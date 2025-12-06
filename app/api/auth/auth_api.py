from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import (
    Depends,
    APIRouter,
    status,
)
from database.db import get_db
from app.api.auth.schemas.create import UserLogin
from app.api.auth.schemas.response import TokenResponse
from app.api.auth.commands.auth_command import bll_login_user
from utils.context_utils import get_current_user_id


router = APIRouter()

@router.post("/login", response_model=TokenResponse, summary="Вход по username и паролю")
async def login(cmd: UserLogin, db: AsyncSession = Depends(get_db)):
    return await bll_login_user(cmd, db)

@router.post("/logout", status_code=status.HTTP_200_OK, summary="Выход из системы")
async def logout(user_id: int = Depends(get_current_user_id)):
    return {
        "message": "Вы успешно вышли из системы",
        "detail": "Токен удалён на клиенте"
    }