from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import users
from app.routes import auth as auth_router
# import user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
    allow_credentials = True,
)
app.include_router(users.router,)
app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])


