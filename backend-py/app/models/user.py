from app.extensions import db
from datetime import datetime

#creates serialization for JSON
class JsonModel(object):
  def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class User(db.Model, JsonModel):
  strava_id = db.Column(db.Integer, primary_key = True)
  first_name = db.Column(db.String)
  last_name = db.Column(db.String)
  # Strava response returns string - needs to be converted
  premium = db.Column(db.Boolean)
  profile_pic = db.Column(db.String)
  profile_pic_medium = db.Column(db.String)
  sex = db.Column(db.String)
  username  = db.Column(db.String, nullable=True)
  weight = db.Column(db.Float)
  height  = db.Column(db.Float, nullable=True)
  ftp = db.Column(db.Integer, nullable=True)
  prefer_units = db.Column(
    db.Enum(
      'Imperial',
      'Metric',
      name='unit_measurement'
    ),  
    nullable=False,
    default='Metric')

  # All tokens must be encrypted
  strava_access_token = db.Column(db.String)
  strava_refresh_token = db.Column(db.String)
  strava_token_type = db.Column(db.String)
  # use expires in to calculate date time.  Value is in seconds?
  # strava_token_expires = db.Column(db.DateTime)

  # timestamps
  updated_at = db.Column(db.String)
  created_at = db.Column(db.String)

  def __init__(self, strava_id, first_name, last_name, premium, profile_pic, profile_pic_medium, sex, username, weight, strava_access_token, strava_refresh_token, height=None, ftp=None, prefer_units='Metric', strava_token_type='Bearer', updated_at=datetime.now(), created_at=datetime.now()):
    self.strava_id = strava_id
    self.first_name = first_name
    self.last_name = last_name
    self.premium = premium
    self.profile_pic = profile_pic
    self.profile_pic_medium = profile_pic_medium
    self. sex = sex
    self.username = username
    self.weight = weight
    self.height = height
    self.ftp = ftp
    self.prefer_units = prefer_units
    self.strava_access_token = strava_access_token
    self.strava_refresh_token = strava_refresh_token
    self.strava_token_type = strava_token_type
    # self.strava_token_expires = strava_token_expires
    self.created_at = created_at
    self.updated_at = updated_at

