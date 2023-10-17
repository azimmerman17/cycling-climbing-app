import jwt, requests, email, smtplib, ssl, math
from flask import redirect, request, url_for, jsonify
from sqlalchemy import text
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from smtplib import SMTP

from app.segments import bp
from config import Config
from app.extensions import db

segment_url = "https://www.strava.com/api/v3/segments/"

# @bp.route('/')
# def index(config_class=Config):
#   print(config_class.STRAVA_ACCESS_TOKEN)
#   return 'Testing the segemnt bp'

@bp.route('/<id>')
def segment(id, config_class=Config):
  import requests

  # Get the access token
  encoded_access_token = config_class.CURRENT_USER['access_token']
  end = len(encoded_access_token) - len(config_class.SALT)
  encoded_access_token = encoded_access_token[0:end]

  decoded_access_token = jwt.decode(encoded_access_token, config_class.SECRET_KEY, algorithms=["HS256"])
  access_token = decoded_access_token['access_token']


  try:
    payload = {}
    headers = {
      'Authorization': f'Bearer {access_token}'
    }

    response = requests.request('GET', f'{segment_url}{id}', headers=headers, data=payload)
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

# endpoint to request a segment to be added
@bp.route('request/<int:id>')
def segment_req(id, config_class=Config): # validate in strava, send to function
  # DB connection for SQL
  session = db.session()
  connection = session.connection()

  # Get the access token
  encoded_access_token = config_class.CURRENT_USER['access_token']
  end = len(encoded_access_token) - len(config_class.SALT)
  encoded_access_token = encoded_access_token[0:end]

  decoded_access_token = jwt.decode(encoded_access_token, config_class.SECRET_KEY, algorithms=["HS256"])
  access_token = decoded_access_token['access_token']

  # check to see if its in the DB
  query = text(
    f"SELECT segment_id FROM public.\"segment_list\"\
    WHERE segment_id = {id}"
  )
  found_segment = connection.execute(query).fetchone()

  if found_segment is not None:
    return {
      'msg': 'Segement already Submitted',
      'state': 1
      }
  else:
    print('New segment')
    # Validate the segment exists in Strava
    try:
      payload = {}
      headers = {
        'Authorization': f'Bearer {access_token}'
      }

      response = requests.request("GET", f'{segment_url}{id}', headers=headers, data=payload).json()
    except:
      # error in segment request
      return {
        'msg': 'Failed to validate Segment',
        'state': 2
        }
    try:
      # return error message - if any 
      return response['message']
    except:
    # filter out requests that don't meet requiremets:
    # No private, downhill segments, hazardous, running Segments
      if response['private'] == True:
        return {
          'msg': 'Segment set to Private',
          'state': 2
          }
      elif response['average_grade'] < 0:
        return {
          'msg': 'Segment is downhill',
          'state': 2
        }
      elif response['hazardous'] == True:
        return {
          'msg': 'Segment is hazarous',
          'state': 2
        }
      elif response['activity_type'] == 'Run':
        return {
          'msg': 'Segment is not a cycling segment',
          'state': 2
        }

    # add to the DB
    try:
      query = text(
        f"""
          INSERT INTO public.\"segment_list\" (segment_id, display, approval, updated_at, created_at)
          VALUES ({id}, false, 'under review', NOW(), NOW());
        """
      )
      connection.execute(query)

      # Translate the climb catagory value
      if response['climb_category'] == 0:
        response['climb_category'] = 'UC'
      elif response['climb_category'] == 5:
        response['climb_category'] = 'HC'
        
      # set the email parameters
      server = config_class.EMAIL_SERVER
      port = config_class.EMAIL_PORT

      msg = MIMEMultipart("alternative")
      msg['Subject'] = f'Cycling Climbs App Segment Request - {id}'
      msg['From'] = config_class.EMAIL_USERNAME
      msg['To'] = config_class.EMAIL_USERNAME

      # email styling
      style = """
        body {
          font-size: 18px;
        }
        h4 {
          font-size: 22px;
        }
        div {
          margin: 8px;
        }
        #approve {
          background-color: green;
        }
        #reject {
          background-color: red;
        }
        .center {
          margin: auto;
          width: 95%;
          text-align: center;
        }
        .button {
          height: 3rem;
          font-size: 18px;
          width: 7rem;
          margin: .5rem;
          border-radius: 5px;
        }
        .button-lg {
          height: 3.5rem;
          font-size: 18px;
          width: 15rem;
          margin: 1rem;
          border-radius: 5px;
        }
        #review {
          background-color: #fc5200;
        }
        .font-white {
          color: white;
          text-decoration: none;
        }
      """

      html = f"""
        <html>
          <head>
            <style>
              {style}
            </style>
          </head>
          <body>
            <h4 class='center'>The following segment has been requested to add to Cycling Climbs App.</h4>
            <ul>
              <li>Segment Name: {response['name']}</li>
              <li>Segement ID: {id}</li>
              <li>Location: {response['city']}, {response['state']} {response['country']}</li>
              <li>Distance: {math.trunc(response['distance'] / 1000)}km</li>
              <li>Avg Grade: {response['average_grade']}%</li>
              <li>Max Grade: {response['maximum_grade']}%</li>
              <li>Elevation Gain: {math.trunc(response['total_elevation_gain'])}m</li>
              <li>Elevation Low: {response['elevation_low']}</li>
              <li>Elevation High: {response['elevation_high']}</li>
              <li>Climb Category: {response['climb_category']}</li>
              <li>Type: {response['activity_type']} - </li>
              <li>Athlete Count: {response['athlete_count']}</li>
              <li>Hazardous: {response['hazardous']}</li>
            </ul>
            <div class='center'>
              <button class='button-lg' id='review'>
                <a class='font-white' href='https://www.strava.com/segments/{id}' target='_blank'>Review on Strava</a>
              </button>
            </div>
            <div class='center' >
              <button class='button' id='approve'>
                <a class='font-white'href='http://localhost:8080/segments/approve/{id}' target='_blank'>Approve</a>
              </button>
              <button class='button'id='reject'>
                <a class='font-white' href='http://localhost:8080/segments/reject/652307' target='_blank'>Reject</a>
              </button>
            </div>
          </body>
        </html>
      """

      # Turn these into plain/html MIMEText objects
      html = MIMEText(html, "html")

      # Add HTML/plain-text parts to MIMEMultipart message
      msg.attach(html)

      # send the email
      s = smtplib.SMTP(host=server, port=port)
      s.starttls()
      s.login(config_class.EMAIL_USERNAME, config_class.EMAIL_PASSWORD)
      s.sendmail(config_class.EMAIL_USERNAME, config_class.EMAIL_USERNAME, msg.as_string())
      s.quit()

      #commit the db
      session.commit()
      return {
        'msg': 'Segment Request Sent',
        'state': 0
        }
    except:
      session.rollback()
      return {
        'msg': 'Segment Request Failed',
        'state': 2
        }

# endpoint to approve a segment to be added
@bp.route('approve/<int:id>')
def segment_approve(id, config_class=Config):
  # DB connection for SQL
  session = db.session()
  connection = session.connection()

  try:
    query = text(
      f"""
        UPDATE public."segment_list" SET display = true, approval = 'approved', updated_at = NOW()
        WHERE segment_id = {id};
      """
    )

    # exacute and commit the db
    connection.execute(query)
    session.commit()
    return {'msg': 'Segment Approved'}
  except:
    session.rollback()
    return {'msg': 'Segment Approval Failed'}

# endpoint to reject a segment to be added
@bp.route('reject/<int:id>')
def segment_reject(id, config_class=Config):
  # DB connection for SQL
  session = db.session()
  connection = session.connection()

  try:
    query = text(
      f"""
        UPDATE public."segment_list" SET display = false, approval = 'rejected', updated_at = NOW()
        WHERE segment_id = {id};
      """
    )

    # exacute and commit the db
    connection.execute(query)
    session.commit()
    return {'msg': 'Segment Rejected'}
  except:
    session.rollback()
    return {'msg': 'Segment Rejection Failed'}

