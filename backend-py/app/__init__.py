from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import json

from config import Config
from app.extensions import db, JsonModel
from app.functions import to_dict
from app.models import users, strava_users 

def create_app(config_class=Config):
  app = Flask(__name__)

  app.config.from_object(config_class)

  # Initialize Flask extensions here
  db.init_app(app)
  CORS(app, resources=r'/*')

  # migrate models
  from app.models import users, strava_users
  Migrate(app,users.db)
  Migrate(app,strava_users.db)

  # Register blueprints here
  from app.strava_auth import bp as strava_auth_bp
  app.register_blueprint(strava_auth_bp)

  from app.segments import bp as segments_bp
  app.register_blueprint(segments_bp)

  from app.user import bp as user_bp
  app.register_blueprint(user_bp)

  @app.route('/test')
  def test_page():
    return '<h1>Testing the Flask Application Factory Pattern</h1>'

  @app.route('/test/db/')
  def test_db():
    # from users 
    user_list = []
    users_all = strava_users.Strava_User.query.all()
    for user in users_all:
      user = to_dict(user)
      user_list.append(user)
    return user_list

  return app