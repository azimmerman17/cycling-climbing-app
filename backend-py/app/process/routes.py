from flask import Flask, redirect, request, url_for
import requests
from sqlalchemy import text


from app.process import bp
from config import Config
from app.extensions import db
from app.functions import get_new_AT, add_new_segment

# list of required urls for api calls
starred_segments = 'https://www.strava.com/api/v3/segments/starred'

#function to get the access token, from refresh token

# endpoint to refresh all segment data

# endpoint to pull all starred segments and add to the DB list
@bp.route('/starred')
def add_starred_segments(config_class=Config):
  # DB connection for SQL
  session = db.session()
  connection = session.connection()

  # Get the refresh token - use the config RT so it only gets the admin's segments and not a user's
  refresh_token = config_class.BATCH_REFRESH_TOKEN

  # retrieve the access token
  access_token = get_new_AT(refresh_token)

  # Get all starred segements
  page = 1
  flag = 0
  per_page = 200
  new_segments = 0
   
  # while loop to get all segments
  while flag == 0:
    # Get the data from strava
    try:
      payload = {}
      headers = {
        'Authorization': f'Bearer {access_token}'
      }

      response = requests.request("GET", f'{starred_segments}?page={page}&per_page={per_page}', headers=headers, data=payload).json()
    except:
      flag = 1
      return {
        'msg': 'Cannot connect to Strava',
        'endpoint': 'starred',
        'state': 2
        }
    
    # End loop when no data is returned
    if len(response) == 0:
      flag = 1

    # add each id to DB
    for segment in response:
      id = segment['id']
      res = add_new_segment(id, segment)
      print (res['msg'])
      if res['state'] == 0:
        new_segments += 1
    
    # move onto the next page on strava
    page += 1

  return {
    'msg': 'Process Complete',
    'new segments': new_segments
    }

