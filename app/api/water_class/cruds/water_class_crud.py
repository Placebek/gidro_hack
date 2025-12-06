from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from model.models import WaterClass
from app.api.water_class.schemas.filter import WaterClassFilter
from typing import Sequence


async def dal_create_water_class(data: dict, db: AsyncSession) -> WaterClass:
    wc = WaterClass(**data)
    db.add(wc)
    await db.commit()
    await db.refresh(wc)
    return wc

async def dal_get_water_class_by_id(wc_id: int, db: AsyncSession) -> WaterClass | None:
    result = await db.execute(select(WaterClass).where(WaterClass.id == wc_id))
    return result.scalar_one_or_none()

async def dal_get_all_water_classes(
    db: AsyncSession,
    filters: WaterClassFilter
) -> Sequence[WaterClass]:
    query = select(WaterClass)
    conditions = []

    if filters.latitude_min is not None:
        conditions.append(WaterClass.latitude >= filters.latitude_min)
    if filters.latitude_max is not None:
        conditions.append(WaterClass.latitude <= filters.latitude_max)
    if filters.longitude_min is not None:
        conditions.append(WaterClass.longitude >= filters.longitude_min)
    if filters.longitude_max is not None:
        conditions.append(WaterClass.longitude <= filters.longitude_max)

    if filters.water_class is not None:
        conditions.append(WaterClass.water_class == filters.water_class)

    if filters.parameter:
        conditions.append(WaterClass.parameter.ilike(f"%{filters.parameter}%"))
    if filters.concentration_min is not None:
        conditions.append(WaterClass.concentration >= filters.concentration_min)
    if filters.concentration_max is not None:
        conditions.append(WaterClass.concentration <= filters.concentration_max)
    if filters.background_min is not None:
        conditions.append(WaterClass.background >= filters.background_min)
    if filters.background_max is not None:
        conditions.append(WaterClass.background <= filters.background_max)

    if filters.fauna_contains:
        conditions.append(WaterClass.fauna.ilike(f"%{filters.fauna_contains}%"))

    if filters.fauna_exact:
        conditions.append(WaterClass.fauna.ilike(f"%{filters.fauna_exact}%"))

    if filters.purpose_contains:
        conditions.append(WaterClass.purpose.ilike(f"%{filters.purpose_contains}%"))

    if filters.pollution_level:
        conditions.append(WaterClass.purpose.ilike(f"%{filters.pollution_level}%"))

    if conditions:
        query = query.where(and_(*conditions))

    query = query.offset(filters.skip).limit(filters.limit).order_by(WaterClass.id)

    result = await db.execute(query)
    return result.scalars().all()
