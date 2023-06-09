from flask import Blueprint

bp = Blueprint('segments', __name__, url_prefix='/segments')

from app.segments import routes