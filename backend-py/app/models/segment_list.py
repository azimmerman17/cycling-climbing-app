from app.extensions import db
from datetime import datetime

#creates serialization for JSON
class JsonModel(object):
  def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class SegmentList(db.Model, JsonModel):
  segment_id = db.Column(db.Integer, primary_key = True)
  display = db.Column(db.Boolean, default=False)
  approval = db.Column(db.String)

  # timestamps
  updated_at = db.Column(db.String)
  created_at = db.Column(db.String)

  def __init__(self, segment_id, display, approval, updated_at=datetime.now(), created_at=datetime.now()):
    self.segment_id = segment_id
    self.display = display
    self.approval = approval
    self.updated_at = updated_at
    self.created_at = created_at