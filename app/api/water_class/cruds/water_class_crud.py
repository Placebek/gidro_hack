from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.models import WaterClass


async def dal_create_water_class(data: dict, db: AsyncSession) -> WaterClass:
    wc = WaterClass(**data)
    db.add(wc)
    await db.commit()
    await db.refresh(wc)
    return wc

async def dal_get_water_class_by_id(wc_id: int, db: AsyncSession) -> WaterClass | None:
    result = await db.execute(select(WaterClass).where(WaterClass.id == wc_id))
    return result.scalar_one_or_none()

async def dal_get_all_water_classes(db: AsyncSession):
    result = await db.execute(select(WaterClass).order_by(WaterClass.id))
    return result.scalars().all()