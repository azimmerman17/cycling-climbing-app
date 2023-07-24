from flask import redirect, request, url_for

from app.segments import bp
from config import Config

segment_url = "https://www.strava.com/api/v3/segments/"

# @bp.route('/')
# def index(config_class=Config):
#   print(config_class.STRAVA_ACCESS_TOKEN)
#   return 'Testing the segemnt bp'

@bp.route('/<int:id>')
def segment(id, config_class=Config):
  import requests

  try:
    payload = {}
    headers = {
      'Authorization': f'Bearer {config_class.STRAVA_ACCESS_TOKEN}'
    }

    response = requests.request('GET', f'{segment_url}/{id}', headers=headers, data=payload)
    print(response.json()) 
  except AttributeError:
    config_class.returnData = {
      'route': 'segemnts',
      'id': id
    }
    print(config_class)
    return redirect(url_for('strava_auth.index'))

  config_class.segemntId = None
  return response.json()


# Build redirect to get access token if expired 