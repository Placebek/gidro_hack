# app/api/water_quality/router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from sqlalchemy import select
from model.models import WaterClass
from app.api.water_class.schemas.create import WaterClassCreate
from app.api.water_class.schemas.response import WaterClassResponse, WaterClassDetailResponse
from app.api.water_class.schemas.filter import WaterClassGeoResponse, WaterClassFilter
from app.api.water_class.commands.water_class_command import bll_create_water_class
from app.api.water_class.cruds.water_class_crud import dal_get_water_class_by_id, dal_get_all_water_classes
from utils.context_utils import require_expert
from typing import Optional, List


router = APIRouter()

@router.post("", response_model=WaterClassResponse, summary="Создать класс воды", status_code=201)
async def create_water_class(
    cmd: WaterClassCreate,
    db: AsyncSession = Depends(get_db),
    user = Depends(require_expert)
):
    return await bll_create_water_class(cmd, db, user)

@router.get("/{wc_id}", response_model=WaterClassDetailResponse, summary="Полная точка анализа по ID")
async def get_water_class_by_id(wc_id: int, db: AsyncSession = Depends(get_db)):
    first_item = await dal_get_water_class_by_id(wc_id, db)
    if not first_item:
        raise HTTPException(404, "Точка анализа не найдена")

    result = await db.execute(
        select(WaterClass).where(
            WaterClass.latitude == first_item.latitude,
            WaterClass.longitude == first_item.longitude
        )
    )
    all_items = result.scalars().all()

    if not all_items:
        raise HTTPException(404, "Точка анализа не найдена")

    purpose_list = [s.strip() for s in (all_items[0].purpose or "").split(",") if s.strip()]
    fauna_list = [s.strip() for s in (all_items[0].fauna or "").split(",") if s.strip()]

    parameters = []
    for item in all_items:
        parameters.append({
            "index": item.index,
            "parameter": item.parameter,
            "unit": item.unit,
            "concentration": float(item.concentration) if item.concentration is not None else None,
            "background": float(item.background) if item.background is not None else None,
        })

    response = {
        "lat": float(all_items[0].latitude),
        "lng": float(all_items[0].longitude),
        "description": all_items[0].description,
        "water_class": all_items[0].water_class,
        "location_info": all_items[0].location_info,
        "purpose": purpose_list,
        "fauna": fauna_list,
        "parameters": parameters
    }

    return response

@router.get("", response_model=List[WaterClassGeoResponse])
async def get_water_classes_geo(
    db: AsyncSession = Depends(get_db),
    latitude_min: Optional[float] = Query(None, ge=-90, le=90),
    latitude_max: Optional[float] = Query(None, ge=-90, le=90),
    longitude_min: Optional[float] = Query(None, ge=-180, le=180),
    longitude_max: Optional[float] = Query(None, ge=-180, le=180),
    water_class: Optional[int] = Query(None),
    parameter: Optional[str] = Query(None),
    fauna_contains: Optional[str] = Query(None),
    pollution_level: Optional[str] = Query(None),
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
        fauna_contains=fauna_contains,
        pollution_level=pollution_level,
        skip=skip,
        limit=limit,
    )

    raw_items = await dal_get_all_water_classes(db, filters)

    grouped = {}

    for item in raw_items:
        key = (float(item.latitude), float(item.longitude))
        
        if key not in grouped:
            purpose_list = [s.strip() for s in (item.purpose or "").split(",") if s.strip()]
            fauna_list = [s.strip() for s in (item.fauna or "").split(",") if s.strip()]

            grouped[key] = {
                "id": item.id,
                "lat": float(item.latitude),
                "lng": float(item.longitude),
                "description": item.description,
                "water_class": item.water_class,
                "location_info": item.location_info,
                "purpose": purpose_list,
                "fauna": fauna_list,
                "parameters": []
            }

        grouped[key]["parameters"].append({
            "index": item.index,
            "parameter": item.parameter,
            "unit": item.unit,
            "concentration": float(item.concentration) if item.concentration is not None else None,
            "background": float(item.background) if item.background is not None else None,
        })

    result = list(grouped.values())
    return result