from flask_sqlalchemy import SQLAlchemy
from localStoragePy import localStoragePy

# model extension
db = SQLAlchemy()

# model to JSON
class JsonModel(object):
  def as_dict(self):
    return {c.name: getattr(self, c.name) for c in self.__table__.columns}

localStorage = localStoragePy('cycling-climbing-app', 'json')
