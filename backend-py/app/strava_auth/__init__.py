from flask import Blueprint

bp = Blueprint('strava_auth', __name__, url_prefix='/auth/strava')

from app.strava_auth import routes