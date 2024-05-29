import os
from dotenv import load_dotenv
import redis
import sys

load_dotenv()


class Config:
    SECRET_KEY = os.environ['SECRET_KEY']
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://ahmedt1:halalhustlers0405@ahmedt1.mysql.pythonanywhere-services.com/ahmedt1$instalock'

    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = False
    PERMANENT_SESSION_LIFETIME = 30
    SESSION_USE_SIGNER = True

    MAIL_SERVER = os.environ['MAIL_SERVER']
    MAIL_PORT = os.environ['MAIL_PORT']
    MAIL_USE_SSL = os.environ['MAIL_USE_SSL']
    MAIL_USERNAME = os.environ['MAIL_USERNAME']
    MAIL_PASSWORD = os.environ['MAIL_PASSWORD']
    MAIL_DEFAULT_SENDER = os.environ['MAIL_DEFAULT_SENDER']


class ProductionConfig(Config):
    Config
    INTERNAL_URL = os.environ['INTERNAL_URL_PROD']
    SESSION_COOKIE_SECURE = True
    MODE = "prod"
    static_folder = 'static'
    template_folder = 'static'
    static_url_path = ''


class DevelopmentConfig(Config):
    Config
    INTERNAL_URL = os.environ['INTERNAL_URL_DEV']
    SESSION_COOKIE_SECURE = False
    MODE = "test"
