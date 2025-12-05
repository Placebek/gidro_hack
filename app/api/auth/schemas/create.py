from pydantic import (
    BaseModel,
    Field,
)


class UserLogin(BaseModel):
    username: str = Field(..., max_length=100, description="Имя пользователя")
    password: str = Field(..., min_length=8, description="Пароль")