# app/api/model/model_api.py
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.model.schemas.response import FeaturesInput, PredictionResponse
from app.api.model.commands.model_commands import predict_risk_async
from app.api.model.cruds.model_crud import MODEL
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from model.models import Object
from sqlalchemy import select
import random


router = APIRouter()

@router.get("/random", response_model=PredictionResponse)
async def predict_random_dam_risk(db: AsyncSession = Depends(get_db)):
    """
    Берёт случайную плотину из базы и оценивает её риск аварии
    """
    # Ищем все объекты, которые являются плотинами (можно уточнить по resource_type_id)
    # Предположим, что плотина — это resource_type_id = 4 (из твоего импорта)
    query = select(Object).where(Object.resource_type_id == 4)  # Плотины

    result = await db.execute(query)
    dams = result.scalars().all()

    if not dams:
        raise HTTPException(status_code=404, detail="В базе нет плотин для оценки")

    # Выбираем случайную
    dam = random.choice(dams)

    # Формируем входные данные для модели
    try:
        features = FeaturesInput(
            CAP_MCM=dam.capacity_mcm or 100.0,
            CAP_MAX=dam.capacity_max or 150.0,
            CAP_MIN=dam.capacity_min or 10.0,
            AREA_SKM=dam.area_skm or 12.0,
            AREA_MAX=dam.area_max or 18.0,
            DEPTH_M=dam.depth_m or 20.0,
            CATCH_SKM=dam.catchment_skm or 800.0,
            DIS_AVG_LS=dam.avg_discharge_ls or 50.0,
            ELEV_MASL=dam.elevation_masl or 500.0,
            DAM_HGT_M=dam.dam_height_m or 35.0,
            DAM_LEN_M=dam.dam_length_m or 400.0,
            DAM_TYPE=dam.dam_type or "Земляная",
            INSTREAM="Да" if dam.instream else "Нет"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка подготовки данных: {str(e)}")

    # Делаем предсказание
    try:
        prediction = await predict_risk_async(features)
        # Добавим инфу о плотине в ответ (необязательно, но красиво)
        prediction.model = f"CatBoost | Плотина: {dam.name} ({dam.region.region if dam.region else '—'})"
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка предсказания: {str(e)}")