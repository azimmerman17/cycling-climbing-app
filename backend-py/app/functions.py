import jwt, math, smtplib, requests
from sqlalchemy import text
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from smtplib import SMTP



from config import Config
from app.extensions import db

# Function to decode a token
def decode_token(token, token_type, SALT=Config.SALT):
  end = len(token) - len(SALT)
  encoded_token = token[0:end]

  decoded_token = jwt.decode(encoded_token, Config.SECRET_KEY, algorithms=["HS256"])
  if token_type == 'refresh': 
    return decoded_token['refresh_token']
  else:
    return decode_token['access_token']

# attempt to get the model class to JSON
def to_dict(self):
  return {c.name: getattr(self, c.name) for c in self.__table__.columns}

# use the refresh token to get a new access token
def get_new_AT(refresh_token, encoded=False, SALT=Config.SALT):
  if encoded == True:
    # decode the refresh token
    refresh_token = decode_token(refresh_token, 'refresh')

  # Get the access token
  payload = {
    'client_id': Config.STRAVA_CLIENT_ID,
    'client_secret': Config.STRAVA_CLIENT_SECERT,
    'refresh_token': refresh_token,
    'grant_type': 'refresh_token',
    'f': 'json'
  }

  # Strava API endpoint
  token_exchange_url = 'https://www.strava.com/api/v3/oauth/token'

  # POST request to get your access token 
  access_token = requests.post(token_exchange_url, data=payload, verify=True).json()['access_token']

  return access_token

# add a new segment to DB and send email for approval
def add_new_segment(id, segment):
  # DB connection for SQL
  session = db.session()
  connection = session.connection()

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

  # filter out requests that don't meet requiremets:
  # No private, downhill segments, hazardous, running Segments
  if segment['private'] == True:
    return {
      'msg': 'Segment set to Private',
      'state': 2
      }
  elif segment['average_grade'] < 0:
    return {
      'msg': 'Segment is downhill',
      'state': 2
    }
  elif segment['hazardous'] == True:
    return {
      'msg': 'Segment is hazarous',
      'state': 2
    }
  elif segment['activity_type'] == 'Run':
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
    if segment['climb_category'] == 0:
      segment['climb_category'] = 'UC'
    elif segment['climb_category'] == 5:
      segment['climb_category'] = 'HC'
    else:
      segment['climb_category'] = 5 -  segment['climb_category']

    # send the email
    send_request_email(segment)

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

# Function that will send the email to approve/reject a request
def send_request_email(segment):   
  # set the email parameters
  server = Config.EMAIL_SERVER
  port = Config.EMAIL_PORT

  msg = MIMEMultipart("alternative")
  msg['Subject'] = f"Cycling Climbs App Segment Request - {segment['id']}"
  msg['From'] = Config.EMAIL_USERNAME
  msg['To'] = Config.EMAIL_USERNAME

  # email styling
  css = """
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
          {css}
        </style>
      </head>
      <body>
        <h4 class='center'>The following segment has been requested to add to Cycling Climbs App.</h4>
        <ul>
          <li>Segment Name: {segment['name']}</li>
          <li>Segement ID: {segment['id']}</li>
          <li>Location: {segment['city']}, {segment['state']} {segment['country']}</li>
          <li>Distance: {math.trunc(segment['distance'] / 10) / 100} km</li>
          <li>Avg Grade: {segment['average_grade']}%</li>
          <li>Max Grade: {segment['maximum_grade']}%</li>
          <li>Elevation Low: {segment['elevation_low']} m</li>
          <li>Elevation High: {segment['elevation_high']} m</li>
          <li>Climb Category: {segment['climb_category']}</li>
          <li>Type: {segment['activity_type']}</li>
          <li>Hazardous: {segment['hazardous']}</li>
        </ul>
        <div class='center'>
          <button class='button-lg' id='review'>
            <a class='font-white' href='https://www.strava.com/segments/{segment['id']}' target='_blank'>Review on Strava</a>
          </button>
        </div>
        <div class='center' >
          <button class='button' id='approve'>
            <a class='font-white'href='http://localhost:8080/segments/approve/{segment['id']}' target='_blank'>Approve</a>
          </button>
          <button class='button'id='reject'>
            <a class='font-white' href='http://localhost:8080/segments/reject/{segment['id']}' target='_blank'>Reject</a>
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
  s.login(Config.EMAIL_USERNAME, Config.EMAIL_PASSWORD)
  s.sendmail(Config.EMAIL_USERNAME, Config.EMAIL_USERNAME, msg.as_string())
  s.quit()

# Function to get segment data from strava
def get_segment(id, access_token, encoded=False, SALT=Config.SALT):
  if encoded == True:
    # decode the access token
    access_token = decode_token(access_token, 'access')  

  # url headers for the API request 
  segment_url = f'https://www.strava.com/api/v3/segments/{id}'
  payload = {}
  headers = {
    'Authorization': f'Bearer {access_token}'
  }

  try:
    response = requests.request("GET", f'{segment_url}', headers=headers, data=payload).json()
    return response
  except:
    # error in segment request
    return {
      'msg': 'Failed to validate Segment',
      'state': 2
      }




 
  print('none')








