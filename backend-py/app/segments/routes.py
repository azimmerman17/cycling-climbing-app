from flask import redirect, request, url_for


from app.segments import bp
from config import Config

segment_url = "https://www.strava.com/api/v3/segments/"

@bp.route('/')
def index(config_class=Config):
  print(config_class.STRAVA_ACCESS_TOKEN)
  return 'Testing the segemnt bp'

@bp.route('/<int:id>')
def segment(id, config_class=Config):
  import requests

  payload = {}
  headers = {
    'Authorization': f'Bearer {config_class.STRAVA_ACCESS_TOKEN}'
  }

  response = requests.request('GET', f'{segment_url}/{id}', headers=headers, data=payload)

  print(response.text)

  return response.json()
