# app/api/water_quality/router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from app.api.water_class.schemas.create import WaterClassCreate
from app.api.water_class.schemas.response import WaterClassResponse
from app.api.water_class.schemas.filter import WaterClassFilter
from app.api.water_class.commands.water_class_command import bll_create_water_class
from app.api.water_class.cruds.water_class_crud import dal_get_water_class_by_id, dal_get_all_water_classes
from utils.context_utils import require_expert
from typing import Optional


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

@router.get("", response_model=list[WaterClassResponse], summary="Все точки с фильтрацией и пагинацией")
async def get_all_water_classes(
    db: AsyncSession = Depends(get_db),
    latitude_min: Optional[float] = Query(None, ge=-90, le=90),
    latitude_max: Optional[float] = Query(None, ge=-90, le=90),
    longitude_min: Optional[float] = Query(None, ge=-180, le=180),
    longitude_max: Optional[float] = Query(None, ge=-180, le=180),
    water_class: Optional[int] = Query(None, ge=1, le=5, description="Класс воды 1–5"),
    parameter: Optional[str] = Query(None, max_length=50),
    concentration_min: Optional[float] = Query(None),
    concentration_max: Optional[float] = Query(None),
    background_min: Optional[float] = Query(None),
    background_max: Optional[float] = Query(None),
    fauna_contains: Optional[str] = Query(None, description="Подстрока в fauna, напр.: отсутствует"),
    fauna_exact: Optional[str] = Query(
        None,
        description="Точное совпадение в fauna",
        regex="^(рыба отсутствует|рыба присутствует|макрофиты отсутствуют|зоопланктон отсутствует)$"
    ),

    purpose_contains: Optional[str] = Query(None, description="Подстрока в purpose"),
    pollution_level: Optional[str] = Query(
        None,
        description="Уровень загрязнения",
        regex="^(сильно загрязнённая|загрязнённая|умеренно загрязнённая|чистая|условно чистая)$"
    ),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
):
    filters = WaterClassFilter(
        latitude_min=latitude_min,
        latitude_max=latitude_max,
        longitude_min=longitude_min,
        longitude_max=longitude_max,
        water_class=water_class,
        parameter=parameter,
        concentration_min=concentration_min,
        concentration_max=concentration_max,
        background_min=background_min,
        background_max=background_max,
        fauna_contains=fauna_contains,
        fauna_exact=fauna_exact,
        purpose_contains=purpose_contains,
        pollution_level=pollution_level,
        skip=skip,
        limit=limit,
    )
    
    items = await dal_get_all_water_classes(db, filters)
    return [WaterClassResponse.model_validate(item) for item in items]