from config import Config

# attempt to get the model class to JSON
def to_dict(self):
  return {c.name: getattr(self, c.name) for c in self.__table__.columns}

