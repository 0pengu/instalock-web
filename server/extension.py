from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_login import LoginManager
from flask_mail import Mail, Message
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
sesh = Session()
login_manager = LoginManager()
mail = Mail()
bcrypt = Bcrypt()