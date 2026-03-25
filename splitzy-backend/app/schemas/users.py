from datetime import datetime

from pydantic import BaseModel, ConfigDict, constr


NameStr = constr(strip_whitespace=True, min_length=1, max_length=120)
PhoneStr = constr(strip_whitespace=True, min_length=7, max_length=20)
PasswordStr = constr(min_length=8, max_length=128)
EmailLike = constr(
    strip_whitespace=True,
    min_length=5,
    max_length=255,
    pattern=r'^[^@\s]+@[^@\s]+\.[^@\s]+$',
)


class UserCreate(BaseModel):
    name: NameStr
    email: EmailLike
    password: PasswordStr
    phone: PhoneStr


class UserLogin(BaseModel):
    email: EmailLike
    password: str


class UserRead(BaseModel):
    id: int
    name: str
    email: EmailLike
    phone: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SignupResponse(BaseModel):
    message: str
    user: UserRead


class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = 'bearer'
    user: UserRead
