from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import (
    Depends,
    APIRouter,
)
from database.db import get_db
from app.api.auth.schemas.create import UserLogin
from app.api.auth.schemas.response import TokenResponse
from app.api.auth.commands.auth_command import bll_login_user


router = APIRouter()

@router.post("/login", response_model=TokenResponse, summary="Вход по username и паролю")
async def login(cmd: UserLogin, db: AsyncSession = Depends(get_db)):
    return await bll_login_user(cmd, db)