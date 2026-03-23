from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = f'postgresql://{os.getenv("DATABASE_USER")}:{os.getenv("DATABASE_PASS")}@{os.getenv("DATABASE_HOST")}:{os.getenv("DATABASE_PORT")}/{os.getenv("DATABASE_NAME")}' 
# print(DATABASE_URL)
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit = False,
    autoflush=False,
    bind = engine
)

Base = declarative_base()



