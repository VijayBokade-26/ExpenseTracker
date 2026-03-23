from fastapi import FastAPI
from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user
# from fastapi import APIRouter, Depends
# from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/api")
def get_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name
    }
