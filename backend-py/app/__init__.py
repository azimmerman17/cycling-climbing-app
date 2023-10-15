from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin

import json

from config import Config
from app.extensions import db, JsonModel
from app.functions import to_dict
from app.models import user, segment_list

def create_app(config_class=Config):
  app = Flask(__name__)

  app.config.from_object(config_class)

  # Initialize Flask extensions here
  db.init_app(app)
  CORS(app, resources={r'/*': {"origins": "*"}})

  # migrate models
  from app.models import user, segment_list
  Migrate(app,user.db)
  Migrate(app, segment_list.db)

  # Register blueprints here
  from app.strava_auth import bp as strava_auth_bp
  app.register_blueprint(strava_auth_bp)

  from app.segments import bp as segments_bp
  app.register_blueprint(segments_bp)

  from app.user import bp as user_bp
  app.register_blueprint(user_bp)

  from app.process import bp as process_bp
  app.register_blueprint(process_bp)

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