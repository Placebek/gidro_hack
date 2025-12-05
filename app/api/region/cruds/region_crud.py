from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.models import Region


async def dal_get_regions(db: AsyncSession):
    result = await db.execute(select(Region).order_by(Region.region))
    return result.scalars().all()