# app/api/water_quality/router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from app.api.water_class.schemas.create import WaterClassCreate
from app.api.water_class.schemas.response import WaterClassResponse
from app.api.water_class.commands.water_class_command import bll_create_water_class
from app.api.water_class.cruds.water_class_crud import dal_get_water_class_by_id, dal_get_all_water_classes
from utils.context_utils import require_expert


router = APIRouter()

@router.post("", response_model=WaterClassResponse, summary="Создать класс воды", status_code=201)
async def create_water_class(
    cmd: WaterClassCreate,
    db: AsyncSession = Depends(get_db),
    user = Depends(require_expert)
):
    return await bll_create_water_class(cmd, db, user)

@router.get("/{wc_id}", response_model=WaterClassResponse, summary="Выводит класс воды по id")
async def get_water_class(wc_id: int, db: AsyncSession = Depends(get_db)):
    wc = await dal_get_water_class_by_id(wc_id, db)
    if not wc:
        raise HTTPException(404, "Точка анализа не найдена")
    return WaterClassResponse.model_validate(wc)

@router.get("", response_model=list[WaterClassResponse], summary="Выводит все классы воды")
async def get_all_water_classes(db: AsyncSession = Depends(get_db)):
    items = await dal_get_all_water_classes(db)
    return [WaterClassResponse.model_validate(item) for item in items]