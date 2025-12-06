from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from app.api.object.schemas.create import ObjectCreate
from app.api.object.schemas.response import ObjectResponse, PaginatedResponse, ObjectDetailResponse
from app.api.object.schemas.filters import ObjectFilters
from app.api.object.commands.object_command import bll_create_object, bll_get_objects
from model.models import Object
from utils.context_utils import require_expert
from sqlalchemy import select
from sqlalchemy.orm import selectinload


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


@router.get("/all", response_model=PaginatedResponse)
async def get_objects(
    filters: ObjectFilters = Depends(),
    db: AsyncSession = Depends(get_db)
):
    return await bll_get_objects(filters, db)


@router.get("/{obj_id}", response_model=ObjectDetailResponse)
async def get_object_by_id(
    obj_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Object)
        .options(
            selectinload(Object.region),
            selectinload(Object.resource_type),
            selectinload(Object.water_type)
        )
        .where(Object.id == obj_id)
    )
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Объект не найден")

    return ObjectDetailResponse(
        region=obj.region.region,
        resource_type=obj.resource_type.name if obj.resource_type else None,
        is_dangerous=(obj.actual_level_cm >= obj.danger_level_cm) if obj.danger_level_cm else False
    )