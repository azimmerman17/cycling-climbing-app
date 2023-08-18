from flask import redirect, request, url_for

from app.user import bp
from config import Config

segment_url = "https://www.strava.com/api/v3/segments/"

@bp.route('/')
def index(config_class=Config):
  return 'Testing the segemnt bp'

@bp.route('/db/<int:id>')
def db_users(id, config_class=Config):
  return f'{id}'

@bp.route('/strava/<int:id>')
def api_users(id, config_class=Config):
  return f'{id}'