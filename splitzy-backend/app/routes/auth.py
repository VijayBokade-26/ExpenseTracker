from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.models.models import User
from app.schemas.users import (
    LoginResponse,
    SignupResponse,
    UserCreate,
    UserLogin,
)
from app.utils.auth import create_token, hash_password, verify_password


router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/signup', response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    normalized_email = user.email.lower().strip()
    normalized_phone = user.phone.strip()

    existing_user = (
        db.query(User)
        .filter((User.email == normalized_email) | (User.phone == normalized_phone))
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='A user with this email or phone already exists.',
        )

    new_user = User(
        name=user.name.strip(),
        email=normalized_email,
        phone=normalized_phone,
        password=hash_password(user.password),
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='A user with this email or phone already exists.',
        ) from exc

    return {
        'message': 'User created successfully.',
        'user': new_user,
    }


@router.post('/login', response_model=LoginResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    normalized_email = user.email.lower().strip()

    db_user = db.query(User).filter(User.email == normalized_email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid email or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid email or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    token = create_token({'user_id': db_user.id, 'sub': str(db_user.id)})

    return {
        'message': 'Login successful.',
        'access_token': token,
        'token_type': 'bearer',
        'user': db_user,
    }
