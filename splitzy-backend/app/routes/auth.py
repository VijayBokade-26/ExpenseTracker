from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import SessionLocal
from app.models.models import User
from app.schemas.users import UserCreate, UserLogin
from app.utils.auth import *

router  = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email ==user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail = "Email is already Exist!!")

    hashed_password = hash_password(user.password   )

    new_user = User(
        name = user.name,
        email = user.email,
        phone = user.phone,
        password = hashed_password,
    )

    db.add(new_user)
    db.commit()

    return {
        "status":"Success",
        "message":"User is created successfully!!",
        "status_code":201
    }


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400,detail="Invalid email or password")
    
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    token = create_token({"user_id":db_user.id})

    return {
        "access_token":token,
        "token_type": "Bearer"
    }


    

    

