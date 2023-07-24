import requests
import urllib3
from flask import Flask, redirect, request, url_for

from app.strava_auth import bp
from config import Config

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


@bp.route('/return')
def strava_return(config_class=Config):
  # Retieve the access code from the redirect page from Strava
  #will need to save the access token
  args = request.args

  client_id = config_class.STRAVA_CLIENT_ID
  client_secret = config_class.STRAVA_CLIENT_SECERT
  grant_type = 'authorization_code'
  
  # url request to get the refresh token
  url = f'https://www.strava.com/oauth/token?client_id={client_id}&client_secret={client_secret}&code={args["code"]}&grant_type={grant_type}'

  response = requests.request("POST", url).json()

  config_class.STRAVA_REFRESH_TOKEN = response['refresh_token']
  # First return is for fuctional response
  return redirect(url_for('strava_auth.index'))
  
  # Second return is for displaying returned strava data
  # return response

  @bp.route('/clear')
  def strava_return(config_class=Config):
    config_class.STRAVA_ACCESS_TOKEN = None
    config_class.STRAVA_REFRESH_TOKEN = None
    return 'strava tokens cleared'