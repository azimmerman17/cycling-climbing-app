from flask import Flask

from config import Config

def create_app(config_class=Config):
  app = Flask(__name__)
  app.config.from_object(config_class)

  # Initialize Flask extensions here


  # migrate models


  # Register blueprints here
  from app.strava_auth import bp as strava_auth_bp
  app.register_blueprint(strava_auth_bp)

  @app.route('/test')
  def test_page():
      return '<h1>Testing the Flask Application Factory Pattern</h1>'

  return app