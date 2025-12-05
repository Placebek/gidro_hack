from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from model.models import Object, Region, ResourceType, WaterType
from sqlalchemy.orm import selectinload


async def dal_create_object(data: dict, db: AsyncSession) -> Object:
    obj = Object(**data)
    db.add(obj)
    await db.commit()
    
    result = await db.execute(
        select(Object)
        .options(
            selectinload(Object.region),
            selectinload(Object.resource_type),
            selectinload(Object.water_type)
        )
        .where(Object.id == obj.id)
    )
    refreshed = result.scalar_one()
    return refreshed

async def dal_get_object_by_id(obj_id: int, db: AsyncSession) -> Object:
    result = await db.execute(
        select(Object)
        .join(Region, Object.region_id == Region.id)
        .join(ResourceType, Object.resource_type_id == ResourceType.id, isouter=True)
        .join(WaterType, Object.water_type_id == WaterType.id, isouter=True)
        .where(Object.id == obj_id)
    )
    return result.scalar_one_or_none()