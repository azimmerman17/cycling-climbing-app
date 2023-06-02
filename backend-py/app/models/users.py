from app.extensions import db
import datetime

#creates serialization for JSON
class JsonModel(object):
  def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class User(db.Model, JsonModel):
  user_id = db.Column(db.Integer, primary_key = True)
  strava_id = db.Column(db.Integer)
  first_name = db.Column(db.String(20), nullable=False)
  last_name = db.Column(db.String(20), nullable=False)
  email = db.Column(db.String(40))
  sex= db.Column(db.Enum(
    'Male',
    'Female',
    'N/A',
    name='sex_types'
  ),
  nullable=False,
  default="N/A")
  # use the metric units
  weight = db.Column(db.Float, min=5)
  height = db.Column(db.Float min=50)
  ftp = db.Column(db.Integer)
  # Hash value
  password_digest = db.Column(db.String)
  prefer_units = db.Column(db.Enum(
    'Imperial',
    'Metric',
    name='units_measurements'
  ),
  nullable=False,
  default='Metric')

  # timestamps
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
   
  def __init__(self, strava_id, first_name, last_name, email, sex, weight, height, ftp, password_digest, prefer_units, created_at, updated_at):
    self.strava_id = strava_id
    self.first_name = first_name
    self.last_name = last_name
    self.email = email
    self.sex = sex
    self.weight = weight
    self.height = height
    self.ftp = ftp
    self.password_digest = password_digest
    self. prefer_units = prefer_units
    self.updated_at = updated_at
    self.created_at = created_at

