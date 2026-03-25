from pathlib import Path
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.config.settings import settings
from app.routes.auth import router as auth_router
from app.routes.expense import router as expense_router
from app.routes.users import router as users_router


app = FastAPI(
    title='Splitzy API',
    version='1.0.0',
    description='Backend API for Splitzy expense tracking.',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_methods=['*'],
    allow_headers=['*'],
    allow_credentials=True,
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(expense_router)


@app.get('/', tags=['health'])
def root() -> dict[str, str]:
    return {'message': 'Splitzy API is running'}

