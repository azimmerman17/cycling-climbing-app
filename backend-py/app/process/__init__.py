from flask import Blueprint

bp = Blueprint('process', __name__, url_prefix='/process')

from app.process import routes


# @bp.route('/batch')
# def batch(config_class=Config):
#   # DB connection for SQL
#   session = db.session()
#   connection = session.connection()

#   # Get the access token
#   encoded_access_token = config_class.CURRENT_USER['access_token']
#   end = len(encoded_access_token) - len(config_class.SALT)
#   encoded_access_token = encoded_access_token[0:end]

#   decoded_access_token = jwt.decode(encoded_access_token, config_class.SECRET_KEY, algorithms=["HS256"])
#   access_token = decoded_access_token['access_token']

#   # list of segment IDs
#   segment_ids = []


#   # while loop to get all segments
#   i = 1
#   flag = 0
#   while (flag == 0):
#     starred_segments = f'https://www.strava.com/api/v3/segments/starred?page={i}per_page=200'
#     try:
#       payload = {}
#       headers = {
#         'Authorization': f'Bearer {access_token}'
#       }

#       response = requests.request("GET", f'{starred_segments}', headers=headers, data=payload).json()

#       # just put the 

#     except:
#       return {
#         'msg': 'Cannot connect to Strava',
#         'state': 2
#         }
    
#   return response
