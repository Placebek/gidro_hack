from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Sequence
from model.models import Features
from app.api.dashboard.schemas.filter import FeaturesFilter


async def get_features_filtered(db: AsyncSession, filters: FeaturesFilter) -> Sequence[Features]:
    query = select(Features)

    conditions = []

    if filters.cap_mcm_min is not None:
        conditions.append(Features.CAP_MCM >= filters.cap_mcm_min)
    if filters.cap_mcm_max is not None:
        conditions.append(Features.CAP_MCM <= filters.cap_mcm_max)

    if filters.cap_max_min is not None:
        conditions.append(Features.CAP_MAX >= filters.cap_max_min)
    if filters.cap_max_max is not None:
        conditions.append(Features.CAP_MAX <= filters.cap_max_max)

    if filters.area_skm_min is not None:
        conditions.append(Features.AREA_SKM >= filters.area_skm_min)
    if filters.area_skm_max is not None:
        conditions.append(Features.AREA_SKM <= filters.area_skm_max)

    if filters.depth_min is not None:
        conditions.append(Features.DEPTH_M >= filters.depth_min)
    if filters.depth_max is not None:
        conditions.append(Features.DEPTH_M <= filters.depth_max)

    if filters.elev_masl_min is not None:
        conditions.append(Features.ELEV_MASL >= filters.elev_masl_min)
    if filters.elev_masl_max is not None:
        conditions.append(Features.ELEV_MASL <= filters.elev_masl_max)

    if filters.dam_hgt_min is not None:
        conditions.append(Features.DAM_HGT_M >= filters.dam_hgt_min)
    if filters.dam_hgt_max is not None:
        conditions.append(Features.DAM_HGT_M <= filters.dam_hgt_max)

    if filters.dam_len_min is not None:
        conditions.append(Features.DAM_LEN_M >= filters.dam_len_min)
    if filters.dam_len_max is not None:
        conditions.append(Features.DAM_LEN_M <= filters.dam_len_max)

    if filters.dam_type:
        conditions.append(Features.DAM_TYPE.ilike(f"%{filters.dam_type}%"))
    if filters.instream:
        conditions.append(Features.INSTREAM.ilike(f"%{filters.instream}%"))

    if filters.date_from:
        conditions.append(Features.date >= filters.date_from)
    if filters.date_to:
        conditions.append(Features.date <= filters.date_to)

    if conditions:
        query = query.where(and_(*conditions))

    query = query.offset(filters.skip).limit(filters.limit).order_by(Features.id)

    result = await db.execute(query)
    return result.scalars().all()