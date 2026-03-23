from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta 
import os
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv() 
# bcrypt_sha256 avoids the 72-byte bcrypt limit by pre-hashing safely
pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_token(data:dict):
    to_encode = data.copy()

    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    expire = datetime.utcnow() + timedelta(minutes=expire_minutes)
    # expire = datetime.utcnow() + timedelta(minutes= os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
    to_encode.update({"exp":expire})

    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))

    return encoded_jwt

def verify_password(password, hashed_password):
    return pwd_context.verify(password, hashed_password)


def decode_token(token:str):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms = [os.getenv("ALGORITHM")])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    
