from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.auth.cruds.auth_crud import dal_get_user_by_username
from app.api.auth.schemas.create import UserLogin
from app.api.auth.schemas.response import TokenResponse
from utils.context_utils import verify_password, create_access_token


async def bll_login_user(cmd: UserLogin, db: AsyncSession) -> TokenResponse:
    user = await dal_get_user_by_username(cmd.username, db)
    
    if not user or not verify_password(cmd.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль"
        )

    access_token = create_access_token({"sub": str(user.id)})  

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role,           
        username=user.username
    )