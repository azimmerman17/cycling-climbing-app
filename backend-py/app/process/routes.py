from flask import Blueprint

bp = Blueprint('process', __name__, url_prefix='/process')

from app.segments import routes