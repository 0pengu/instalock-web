from flask import request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_login import login_user, login_required, current_user, logout_user

import datetime
import jwt

from app_maker import create_app
from model import User, Video, get_reset_token
from extension import db, sesh, login_manager, mail, Message

"""
TODO - Implement types into API
TODO - Move API routes into separate folder
TODO - Set server-side guidelines for email and password
TODO - Try HCaptcha Solver on Riot's API
"""

app = create_app()

MODE = app.config['MODE']

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(str(user_id))

with app.app_context():
    # with app.test_request_context():
    #     session.clear()
    # db.drop_all()
    if MODE == 'test':
        db.create_all()


@app.route("/api/register", methods = ['POST'])
def register():
    email = request.json['email']
    password = request.json['password']

    user = User.query.filter_by(email = email).first()

    if user:
        return {'code': '409', 'message': 'User already exists'}, 404
    
    hashed_password = Bcrypt().generate_password_hash(password).decode('utf-8')
    new_user = User(email = email, password = hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(
{
    'code': '200',
    'success': 'true',
    'id': new_user.id,
    'email': new_user.email
}
    )

@app.route("/api/login", methods = ['POST'])
def login():
    import time
    time.sleep(1)
    email = request.json['email']
    password = request.json['password']
    remember_me = request.json['rememberMe']

    if type(email) != str or type(password) != str or type(remember_me) != bool:
        return {'code': '400', 'message': 'Bad Request'}, 400

    user = User.query.filter_by(email = email).first()

    if not user:
        return jsonify({'code': '401', 'type': '1', 'message': 'Unauthorized', 'success': 'false'}), 401
    
    if not Bcrypt().check_password_hash(user.password, password):
        return {'code': '401', 'type': '2', 'message': 'Unauthorized', 'success': 'false'}, 401
    
    login_user(user, duration=datetime.timedelta(minutes=1), remember=remember_me)

    return jsonify(
{
    'code': '200',
    'success': 'true',
    'id': user.id,
    'email': user.email
}
    )

@app.route("/api/profile", methods = ['GET'])
def get_profile():
    if not current_user.is_authenticated:
        return {'code': '401', 'message': 'Unauthorized'}, 401
    
    return jsonify(
        {
            'code': '200',
            'success': 'true',
            'id': current_user.id,
            'email': current_user.email
        }
    )

@app.route("/api/resetpassword", methods = ['POST'])
def iforgot():
    email = request.json['email']

    existing_user = User.query.filter_by(email = email).first()

    if existing_user:
        token = get_reset_token(existing_user.email, expires=30)
        message = Message(recipients=[email], subject = "Instalock password reset", body = f"Click the link to reset your password: {"http://localhost:5173" if MODE == "test" else "https://instalock.midhat.io"}/resetpassword?token={token}")
        mail.send(message)
        return jsonify({'code': '200', 'success': 'true'}), 200
    
    return jsonify({'code': '400', 'message': 'Bad request', 'success': 'false'}), 400

@app.route("/api/checkpasswordtoken", methods = ['POST'])
def checkpwtoken():
    token = request.args.get('token')
    if not token:
        return jsonify({'code': '400', 'message': 'Bad request', 'success': 'false'}), 400
    try:
        email = jwt.decode(token, app.config['SECRET_KEY'], algorithms="HS256")['reset_password']
    except Exception as E:
        return jsonify({'code': '400', 'message': 'Bad request', 'success': 'false'}), 400

    existing_user = User.query.filter_by(email = email).first()

    if existing_user:
        return jsonify({'code': '200', 'email': existing_user.email, 'success': 'true'}), 200
    
    return jsonify({'code': '400', 'message': 'Bad request', 'success': 'false'}), 400

@app.route("/api/changepassword", methods = ['POST'])
def changepassword():
    token = request.args.get('token')
    if not token:
        return jsonify({'code': '400', 'message': 'Bad request', 'success': 'false'}), 400
    try:
        email = jwt.decode(token, app.config['SECRET_KEY'], algorithms="HS256")['reset_password']
    except Exception as E:
        return jsonify({'code': '400', 'message': 'Bad request', 'success': 'false'}), 400

    existing_user = User.query.filter_by(email = email).first()

    if existing_user:
        password = request.json['password']
        hashed_password = Bcrypt().generate_password_hash(password).decode('utf-8')
        existing_user.password = hashed_password
        db.session.commit()
        return jsonify({'code': '200', 'success': 'true'}), 200
    
    return jsonify({'code': '400', 'message': 'Bad request', 'success': 'false'}), 400


@app.route("/api/logout", methods = ['POST'])
def logout():
    if not current_user.is_authenticated:
        return {'code': '401', 'message': 'Unauthorized', 'success': 'false'}, 401
    
    logout_user()
    return jsonify({'code': '200', 'success': 'true'}), 200


if __name__ == '__main__':
    if MODE == 'test':
        app.run(port = 4999, debug=True)
    else:
        app.run(port = 4999, debug=False)