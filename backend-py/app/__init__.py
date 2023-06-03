from flask import Flask
from flask_migrate import Migrate

from config import Config
from app.extensions import db


def create_app(config_class=Config):
  app = Flask(__name__)
  app.config.from_object(config_class)

  # Initialize Flask extensions here
  db.init_app(app)

  # migrate models
  from app.models import users, strava_users
  Migrate(app,users.db)
  Migrate(app,strava_users.db)

  # Register blueprints here
  from app.strava_auth import bp as strava_auth_bp
  app.register_blueprint(strava_auth_bp)

  @app.route('/test')
  def test_page():
      return '<h1>Testing the Flask Application Factory Pattern</h1>'

  return app