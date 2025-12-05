from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from app.api.object.schemas.create import ObjectCreate
from app.api.object.schemas.response import ObjectResponse
from app.api.object.commands.object_command import bll_create_object
from utils.context_utils import require_expert


router = APIRouter()

@router.post(
    "",
    response_model=ObjectResponse,
    status_code=201,
    summary="Создать гидрологический объект (только эксперты)"
)
async def create_object(
    cmd: ObjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_expert)  
):
    return await bll_create_object(cmd, db, current_user)