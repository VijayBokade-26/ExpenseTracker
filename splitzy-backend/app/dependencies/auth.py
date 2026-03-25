from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.models.models import User
from app.utils.auth import decode_token


security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authentication credentials were not provided',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    payload = decode_token(credentials.credentials)
    user_id = payload.get('user_id') or payload.get('sub')

    if isinstance(user_id, str) and user_id.isdigit():
        user_id = int(user_id)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid token payload',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='User not found',
        )

    return user
