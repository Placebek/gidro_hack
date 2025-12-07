# app/api/model/model_api.py
from fastapi import APIRouter, Depends, HTTPException
from app.api.model.schemas.response import FeaturesInput, PredictionResponse
from app.api.model.commands.model_commands import predict_risk_async
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from model.models import Features
from sqlalchemy import func, select
import random


router = APIRouter()

@router.get("/random")
async def predict_random_dam_risk(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Features).order_by(func.random()).limit(1))
    row = result.scalar_one_or_none()
    if not row:
        raise HTTPException(404, "No data")

    # Заменяем -99 и прочие заглушки
    def fix(val, default):
        return default if val is None or val <= -1 else float(val)

    features = FeaturesInput(
        CAP_MCM=fix(row.CAP_MCM, 100.0),
        CAP_MAX=fix(row.CAP_MAX, 150.0),
        CAP_MIN=fix(row.CAP_MIN, 10.0),
        AREA_SKM=fix(row.AREA_SKM, 12.0),
        AREA_MAX=fix(row.AREA_MAX, 18.0),
        DEPTH_M=fix(row.DEPTH_M, 20.0),
        CATCH_SKM=fix(row.CATCH_SKM, 800.0),
        DIS_AVG_LS=fix(row.DIS_AVG_LS, 50.0),
        ELEV_MASL=fix(row.ELEV_MASL, 500.0),
        DAM_HGT_M=fix(row.DAM_HGT_M, 35.0),
        DAM_LEN_M=fix(row.DAM_LEN_M, 400.0),
        DAM_TYPE=row.DAM_TYPE or "Gravity Dam",
        INSTREAM=row.INSTREAM or "Yes"
    )

    prediction = await predict_risk_async(features)

    return {
        "dam_id": row.id,
        "dam_type": row.DAM_TYPE,
        "original_hgt": getattr(row, "DAM_HGT_M"),
        **prediction.dict()
    }