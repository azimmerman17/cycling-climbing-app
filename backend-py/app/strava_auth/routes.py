import requests
import urllib3
import jwt
import asyncio
from flask import Flask, redirect, request, url_for
from datetime import datetime, timedelta
from sqlalchemy import text
from urllib.parse import urlencode

from app.strava_auth import bp
from config import Config
from app.extensions import db, localStorage
from app.models.user import User

user_url = 'https://www.strava.com/api/v3/athlete'

@bp.route('/')
def index(config_class=Config):
  # args = request.args

  # checks for query string for refresh token needed on the redirect back
  # if args:
  #   config_class.STRAVA_REFRESH_TOKEN = args['param']
  #   print(config_class.STRAVA_REFRESH_TOKEN)
  
  urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

  # URLs to request and check auth
  strava_auth_url = 'https://www.strava.com/oauth/token'
  activities_url = 'https://www.strava.com/api/v3/athlete/activities'
  profile_url = 'https://www.strava.com/api/v3/athlete'

  try:  
    # Strava auth payload (POST request)
    # uses refresh token to get access token
    payload = {
      'client_id': config_class.STRAVA_CLIENT_ID,
      'client_secret': config_class.STRAVA_CLIENT_SECERT,
      'refresh_token': config_class.STRAVA_REFRESH_TOKEN,
      'grant_type': 'refresh_token',
      'f': 'json'
    }

    # POST request to get your access token 
    res = requests.post(strava_auth_url, data=payload, verify=False)

    access_token = res.json()['access_token']
    refresh_token = res.json()['refresh_token']

    config_class.STRAVA_ACCESS_TOKEN = access_token
    config_class.STRAVA_REFRESH_TOKEN = refresh_token

    # Using fetched access token use to get user profile and activities
    header = {'Authorization': 'Bearer ' + access_token}
    # see Strava documentation on param usage

    print(config_class.returnData)

    return redirect(f'http://localhost:8080/{config_class.returnData.route}/{config_class.returnData.id}')

  except:
    # for new users or users that do not have a refresh token
    print('Invalid or no refresh token')
    strava_authorize_url = 'https://www.strava.com/oauth/authorize'
    client_id = config_class.STRAVA_CLIENT_ID
    redirect_uri = 'http://localhost:8080/auth/strava/return'
    response_type = 'code'
    scope = 'read_all,profile:read_all,profile:write,activity:read_all'
    
    return redirect(f'{strava_authorize_url}?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&scope={scope}') 


@bp.route('/return')# , methods=['POST'])
def strava_redirect(config_class=Config):

  # DB connection for SQL
  session = db.session()
  connection = session.connection()

  # gets current date for timestamps
  current_date = datetime.utcnow()

  # Retieve the access code from the redirect page from Strava
  # will need to save the access token
  args = request.args
  try:
    if args['error']:
      return redirect('http://localhost:3000')
  except:
    print('User Authorized App')

  code = args["code"]

  client_id = config_class.STRAVA_CLIENT_ID
  client_secret = config_class.STRAVA_CLIENT_SECERT
  grant_type = 'authorization_code'
  
  # url request to get the refresh token
  url = f'https://www.strava.com/oauth/token?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type={grant_type}'

  res = requests.request("POST", url).json()

  access_token = res['access_token'] 
  refresh_token = res['refresh_token']

  # encode tokens using jwt - Getting junk after number literal error
  encoded_access_token = jwt.encode({'access_token': f'{access_token}'}, config_class.SECRET_KEY, algorithm='HS256')
  encoded_refresh_token = jwt.encode({'refresh_token': f'{refresh_token}'}, config_class.SECRET_KEY, algorithm='HS256')

  # get the profile information from Strava
  payload = {}
  headers = {
    'Authorization': f"Bearer {access_token}"
  }

  profile = requests.request('GET', f'{user_url}', headers=headers, data=payload).json()

  # define varibles for DB
  athlete = res['athlete']

  strava_id = profile['id']
  first_name = profile['firstname']
  ftp = profile['ftp']
  last_name = profile['lastname']
  premium = athlete['premium']
  prefer_units = profile['measurement_preference']
  profile_pic = profile['profile'][8:]
  profile_pic_medium = profile['profile_medium'][8:]
  sex = profile['sex']
  username = profile['username']
  weight = profile['weight']

  if prefer_units == 'feet': prefer_units = 'Imperial'
  else: prefer_units = 'Metric'
  username = f"'{username}'" if username != None else 'null'

  foundUser = None
  try:
    query = text(
      f"SELECT * FROM public.\"user\"\
      WHERE strava_id = '{strava_id}'"
    )
    foundUser = connection.execute(query).first()

    if foundUser != None:
      update_query = text(
        f"UPDATE public.\"user\" SET first_name = '{first_name}', last_name = '{last_name}', premium = {premium}, profile_pic = '{profile_pic}', profile_pic_medium = '{profile_pic_medium}', sex = '{sex}',  username = {username}, weight = {weight}, strava_access_token = '{encoded_access_token}', strava_refresh_token = '{encoded_refresh_token}', updated_at = NOW(), prefer_units='{prefer_units}, ftp='{ftp}''\
        WHERE strava_id = '{strava_id}';"

      )
      connection.execute(update_query)

    # if no user - create the profile
    else:
      print('No User Found')
      query = text(
        f"INSERT INTO public.\"user\" (strava_id, first_name, last_name, premium, profile_pic, profile_pic_medium, sex, username, weight, prefer_units, ftp, strava_access_token, strava_refresh_token, strava_token_type, updated_at, created_at)\
        VALUES ({strava_id}, '{first_name}', '{last_name}', {premium}, '{profile_pic}', '{profile_pic_medium}', '{sex}', {username}, {weight}, '{prefer_units}', '{ftp}', '{encoded_access_token}', '{encoded_refresh_token}', 'Bearer', NOW(), NOW());"
      )
      connection.execute(query)
  except:
    print('SQL Error')
    if not access_token:
      return redirect(f'http://localhost:3000/')


  current_user = {
    'strava_id': strava_id,
    'first_name': first_name,
    'last_name': last_name,
    'premium': premium,
    'profile_pic': profile_pic,
    'profile_pic_medium': profile_pic_medium,
    'sex': sex,
    'prefer_units': prefer_units,
    'username': username if username == 'null' else None,
    'weight': weight, 
    'ftp': ftp,
    'access_token': encoded_access_token + config_class.SALT,
    'refresh_token': encoded_refresh_token + config_class.SALT,
  }

  # set the tokens in the backend
  Config.USER_ID = strava_id
  Config.CURRENT_USER = current_user

  # save user to local storage for FE - probably doesnt work
  localStorage.setItem('Current_User', current_user)


  try:
    session.commit()
  except:
    session.rollback()

  return redirect(f'http://localhost:3000/profile')

@bp.route('/clear')
def strava_return(config_class=Config):
  Config.USER_ID = None
  Config.CURRENT_USER = None
  return redirect(f'http://localhost:3000/')