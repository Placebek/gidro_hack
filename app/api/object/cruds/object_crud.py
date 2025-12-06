from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
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


async def dal_get_objects(
    filters: dict,
    db: AsyncSession
):
    stmt = (
        select(Object)
        .options(
            selectinload(Object.region),
            selectinload(Object.resource_type),
            selectinload(Object.water_type)
        )
    )

    conditions = []
    if filters.get("region_id"):
        conditions.append(Object.region_id == filters["region_id"])
    if filters.get("resource_type_id"):
        conditions.append(Object.resource_type_id == filters["resource_type_id"])
    if filters.get("water_type_id"):
        conditions.append(Object.water_type_id == filters["water_type_id"])
    if filters.get("name_contains"):
        conditions.append(Object.name.ilike(f"%{filters['name_contains']}%"))
    if filters.get("water_object_code"):
        conditions.append(Object.water_object_code == filters["water_object_code"])
    if filters.get("min_danger_level"):
        conditions.append(Object.danger_level_cm >= filters["min_danger_level"])
    if filters.get("only_dangerous"):
        conditions.append(Object.actual_level_cm >= Object.danger_level_cm)

    if conditions:
        stmt = stmt.where(and_(*conditions))

    page = max(1, filters.get("page", 1))
    size = min(100, max(1, filters.get("size", 20)))
    offset = (page - 1) * size

    total = await db.scalar(select(func.count()).select_from(stmt.subquery()))
    stmt = stmt.offset(offset).limit(size).order_by(Object.id.desc())

    result = await db.execute(stmt)
    objects = result.scalars().all()

    return objects, total, page, size