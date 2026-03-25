from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config.settings import settings


# bcrypt_sha256 avoids the 72-byte bcrypt limit by pre-hashing safely.
pwd_context = CryptContext(schemes=['bcrypt_sha256'], deprecated='auto')


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def create_token(data: dict, expires_delta: timedelta | None = None) -> str:
    payload = data.copy()
    expire_delta = expires_delta or timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload.update({'exp': datetime.now(timezone.utc) + expire_delta})

    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm=settings.algorithm,
    )


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid or expired token',
            headers={'WWW-Authenticate': 'Bearer'},
        ) from exc
