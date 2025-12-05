from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.models import WaterType


async def dal_get_all_water_types(db: AsyncSession):
    result = await db.execute(select(WaterType).order_by(WaterType.name))
    return result.scalars().all()