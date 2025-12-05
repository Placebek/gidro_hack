from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.models import ResourceType


async def dal_get_resource_types(db: AsyncSession):
    result = await db.execute(select(ResourceType).order_by(ResourceType.name))
    return result.scalars().all()