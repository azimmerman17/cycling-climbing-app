import jwt, math, smtplib, requests
from sqlalchemy import text
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from smtplib import SMTP



from config import Config
from app.extensions import db



# attempt to get the model class to JSON
def to_dict(self):
  return {c.name: getattr(self, c.name) for c in self.__table__.columns}

# use the refresh token to get a new access token
def get_new_AT(refresh_token, encoded=False, SALT=Config.SALT):
  if encoded == True:
    #decode the refresh token
    end = len(encoded_access_token) - len(SALT)
    encoded_refresh_token = encoded_access_token[0:end]

    decoded_refresh_token = jwt.decode(encoded_refresh_token, Config.SECRET_KEY, algorithms=["HS256"])
    refresh_token = decoded_access_token['refrsh_token']
  
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
        
    # set the email parameters
    server = Config.EMAIL_SERVER
    port = Config.EMAIL_PORT

    msg = MIMEMultipart("alternative")
    msg['Subject'] = f'Cycling Climbs App Segment Request - {id}'
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
            <li>Segement ID: {id}</li>
            <li>Location: {segment['city']}, {segment['state']} {segment['country']}</li>
            <li>Distance: {math.trunc(segment['distance'] / 1000)}km</li>
            <li>Avg Grade: {segment['average_grade']}%</li>
            <li>Max Grade: {segment['maximum_grade']}%</li>
            <li>Elevation Low: {segment['elevation_low']}</li>
            <li>Elevation High: {segment['elevation_high']}</li>
            <li>Climb Category: {segment['climb_category']}</li>
            <li>Type: {segment['activity_type']} - </li>
            <li>Hazardous: {segment['hazardous']}</li>
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
              <a class='font-white' href='http://localhost:8080/segments/reject/{id}' target='_blank'>Reject</a>
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










