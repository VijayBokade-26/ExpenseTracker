from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.users import UserRead


router = APIRouter(prefix='/auth', tags=['users'])


@router.get('/me', response_model=UserRead)
@router.get('/profile', response_model=UserRead, include_in_schema=False)
def get_me(current_user=Depends(get_current_user)):
    return current_user
