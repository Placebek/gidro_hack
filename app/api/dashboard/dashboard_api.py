from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from app.api.dashboard.schemas.filter import FeaturesFilter
from app.api.dashboard.schemas.response import FeaturesResponse
from app.api.dashboard.cruds.dashboard_crud import get_features_filtered
from typing import List, Optional
from datetime import date


router = APIRouter()

@router.get("", response_model=List[FeaturesResponse], summary="Выводить данные для дашборда")
async def get_features(
    db: AsyncSession = Depends(get_db),
    cap_mcm_min: Optional[float] = None,
    cap_mcm_max: Optional[float] = None,
    cap_max_min: Optional[float] = None,
    cap_max_max: Optional[float] = None,
    area_skm_min: Optional[float] = None,
    area_skm_max: Optional[float] = None,
    depth_min: Optional[float] = None,
    depth_max: Optional[float] = None,
    elev_masl_min: Optional[float] = None,
    elev_masl_max: Optional[float] = None,
    dam_hgt_min: Optional[float] = None,
    dam_hgt_max: Optional[float] = None,
    dam_len_min: Optional[float] = None,
    dam_len_max: Optional[float] = None,
    dam_type: Optional[str] = None,
    instream: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
):
    filters = FeaturesFilter(
        cap_mcm_min=cap_mcm_min, cap_mcm_max=cap_mcm_max,
        cap_max_min=cap_max_min, cap_max_max=cap_max_max,
        area_skm_min=area_skm_min, area_skm_max=area_skm_max,
        depth_min=depth_min, depth_max=depth_max,
        elev_masl_min=elev_masl_min, elev_masl_max=elev_masl_max,
        dam_hgt_min=dam_hgt_min, dam_hgt_max=dam_hgt_max,
        dam_len_min=dam_len_min, dam_len_max=dam_len_max,
        dam_type=dam_type,
        instream=instream,
        date_from=date_from,
        date_to=date_to,
        skip=skip,
        limit=limit,
    )

    features = await get_features_filtered(db, filters)
    return features