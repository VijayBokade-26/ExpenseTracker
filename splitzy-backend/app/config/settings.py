from __future__ import annotations
from dataclasses import dataclass
from functools import lru_cache
import os
from dotenv import load_dotenv


load_dotenv()

def _build_database_url() -> str:
    direct_url = os.getenv('DATABASE_URL')
    if direct_url:
        return direct_url

    user = os.getenv('DATABASE_USER')
    password = os.getenv('DATABASE_PASS')
    host = os.getenv('DATABASE_HOST', 'localhost')
    port = os.getenv('DATABASE_PORT', '5432')
    name = os.getenv('DATABASE_NAME')

    missing = [
        key
        for key, value in {
            'DATABASE_USER': user,
            'DATABASE_PASS': password,
            'DATABASE_NAME': name,
        }.items()
        if not value
    ]

    if missing:
        raise RuntimeError(
            'Database configuration is incomplete. Set DATABASE_URL or provide '
            f"{', '.join(missing)}."
        )

    return f'postgresql+psycopg2://{user}:{password}@{host}:{port}/{name}'


def _parse_cors_origins() -> tuple[str, ...]:
    raw_origins = os.getenv('CORS_ORIGINS', '')
    if not raw_origins.strip():
        return ('http://192.168.1.101:3000', 'http://127.0.0.1:3000')

    return tuple(
        origin.strip()
        for origin in raw_origins.split(',')
        if origin.strip()
    )


@dataclass(frozen=True)
class Settings:
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    cors_origins: tuple[str, ...]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    secret_key = os.getenv('SECRET_KEY')
    if not secret_key:
        raise RuntimeError('SECRET_KEY is required for token signing.')

    return Settings(
        database_url=_build_database_url(),
        secret_key=secret_key,
        algorithm=os.getenv('ALGORITHM', 'HS256'),
        access_token_expire_minutes=int(
            os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60')
        ),
        cors_origins=_parse_cors_origins(),
    )

settings = get_settings()