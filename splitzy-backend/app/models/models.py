from sqlalchemy import Column, Integer,String
from app.config.db import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique = True, index = True, nullable = False)
    phone = Column(String(15), unique = True, index = True, nullable=False)
    password = Column(String, nullable=False)

