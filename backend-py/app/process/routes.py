from flask import Flask, redirect, request, url_for
import requests
from sqlalchemy import text


from app.process import bp
from config import Config
from app.extensions import db
from app.functions import get_new_AT, add_new_segment, get_segment,  send_request_email

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

@bp.route('/open_requests')
def open_requests(config_class=Config):
  # DB connection for SQL
  session = db.session()
  connection = session.connection()

  # intiating a list of segments
  segment_list = []
  failed_segments = []

  # get the unreviewed segments from the segment list
  query = text(f"""
    SELECT segment_id, approval FROM public.\"segment_list\"
    WHERE approval='under review'
  """)

  found_segments = connection.execute(query)

  for row in found_segments:
    segment_list.append(row[0])

  if len(segment_list) > 0:
    access_token = get_new_AT(Config.BATCH_REFRESH_TOKEN)

    for record in segment_list:
      # get data for the segments
      segment = get_segment(record, access_token)

      # Translate the climb catagory value
      if segment['climb_category'] == 0:
        segment['climb_category'] = 'UC'
      elif segment['climb_category'] == 5:
        segment['climb_category'] = 'HC'
      else:
        segment['climb_category'] = 5 -  segment['climb_category']

      try:
        send_request_email(segment)
      except:
        failed_segments.append(record)

  return {
    'msg': 'Segment requests sent',
    '#requests': len(segment_list) - len(failed_segments)
  }



