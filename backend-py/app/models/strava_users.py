from app.extensions import db
import datetime

#creates serialization for JSON
class JsonModel(object):
  def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class User(db.Model, JsonModel):
  strava_id = db.Column(db.Integer, primary_key = True)
  bio = db.Column(db.String)
  city = db.Column(db.String)
  state = db.Column(db.String)
  country = db.Column(db.String)
  first_name = db.Column(db.String)
  last_name = db.Column(db.String)
  # Strava response returns string - needs to be converted
  premium = db.Column(db.Boolean)
  profile_pic = db.Column(db.String)
  profile_pic_meduim = db.Column(db.String)
  sex = db.Column(db.String)
  username  = db.Column(db.String, nullable=True)
  weight = db.Column(db.Integer)
  # All tokens must be encrypted
  strava_access_token = db.Column(db.String)
  strava_refresh_token = db.Column(db.String)
  strava_token_type = db.Column(db.String)
  # use expires in to calculate date time.  Value is in seconds?
  strava_token_expires = db.Column(db.DateTime)

  # timestamps
  updated_at = db.Column(db.String)
  created_at = db.Column(db.String)

  def __init__(self, strava_id, bio, city, state, country, first_name, last_name, premium, profile_pic, profile_pic_meduim, sex, username, weight, strava_access_token, strava_refresh_token, strava_token_type, strava_token_expires, updated_at, created_at):
    self.strava_id = strava_id
    self.bio = bio
    self.city = city
    self.state = state
    self.country = country
    self.first_name = first_name
    self.last_name = last_name
    self.premium = premium
    self.profile_pic = profile_pic
    self.profile_pic_meduim = profile_pic_meduim
    self. sex = sex
    self.username = username
    self.weight = weight
    self.strava_access_token = strava_access_token
    self.strava_refresh_token = strava_refresh_token
    self.strava_token_type = strava_token_type
    self.strava_token_expires = strava_token_expires
    self.created_at = created_at
    self.updated_at = updated_at

