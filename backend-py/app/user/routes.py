from flask import redirect, request, url_for
from flask_cors import CORS
from datetime import datetime, timedelta
from sqlalchemy import text
from app.extensions import db, localStorage
import requests

import jwt

from app.user import bp
from config import Config

user_url = 'https://www.strava.com/api/v3/athlete'

@bp.route('/')
def index(config_class=Config):
  return 'Testing the segemnt bp'

@bp.route('/<int:id>', methods=['POST'])
def get_user(id, config_class=Config):
  return f'{id}'


@bp.route('/currentuser', methods=['POST'])
def current_user(config_class=Config):
  try: return Config.CURRENT_USER
  except: return None

@bp.route('/clear')
def logout(config_class=Config):
  Config.USER_ID = None
  Config.CURRENT_USER = None
  return redirect(f'http://localhost:3000/')