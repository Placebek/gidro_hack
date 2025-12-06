from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.object.schemas.create import ObjectCreate
from app.api.object.schemas.response import ObjectResponse, PaginatedResponse, ObjectListItem
from app.api.object.cruds.object_crud import dal_create_object, dal_delete_object, dal_get_objects, dal_search_objects, dal_update_object
from app.api.object.schemas.filters import ObjectFilters
from app.api.object.schemas.update import ObjectUpdate


async def bll_create_object(
    cmd: ObjectCreate,
    db: AsyncSession,
    current_user
) -> ObjectResponse:
    obj = await dal_create_object(cmd.dict(), db)

    return ObjectResponse(
        id=obj.id,
        name=obj.name,
        region=obj.region.region,
        resource_type=obj.resource_type.name if obj.resource_type else None,
        water_type=obj.water_type.name if obj.water_type else None,
        fauna=obj.fauna,
        technical_condition=obj.technical_condition,
        latitude=float(obj.latitude) if obj.latitude else None,
        longitude=float(obj.longitude) if obj.longitude else None,
        
        danger_level_cm=obj.danger_level_cm,
        actual_level_cm=obj.actual_level_cm,
        actual_discharge_m3s=obj.actual_discharge_m3s,
        water_temperature_C=obj.water_temperature_C,
        water_object_code=obj.water_object_code,
        pdf_url=obj.pdf_url or ""
    )


async def bll_get_objects(filters: ObjectFilters, db) -> PaginatedResponse:
    raw_filters = filters.dict(exclude={"page", "size"})
    objects, total, page, size = await dal_get_objects(
        {**raw_filters, "page": filters.page, "size": filters.size},
        db
    )

    items = []
    for obj in objects:
        is_dangerous = (
            obj.actual_level_cm is not None and
            obj.danger_level_cm is not None and
            obj.actual_level_cm >= obj.danger_level_cm
        )
        items.append(ObjectListItem(
            id=obj.id,
            name=obj.name,
            region=obj.region.region,
            resource_type=obj.resource_type.name if obj.resource_type else None,
            water_type=obj.water_type.name if obj.water_type else None,
            latitude=float(obj.latitude) if obj.latitude else None,
            longitude=float(obj.longitude) if obj.longitude else None,
            danger_level_cm=obj.danger_level_cm,
            actual_level_cm=obj.actual_level_cm,
            actual_discharge_m3s=obj.actual_discharge_m3s,
            water_temperature_C=obj.water_temperature_C,
            water_object_code=obj.water_object_code,
            is_dangerous=is_dangerous
        ))

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )


async def bll_search_objects(filters: ObjectFilters, db) -> PaginatedResponse:
    raw = filters.dict(exclude={"page", "size"})
    objects, total, page, size = await dal_search_objects(
        {**raw, "page": filters.page, "size": filters.size},
        db
    )

    items = []
    for obj in objects:
        is_dangerous = (
            obj.actual_level_cm is not None and
            obj.danger_level_cm is not None and
            obj.actual_level_cm >= obj.danger_level_cm
        )
        items.append(ObjectListItem(
            id=obj.id,
            name=obj.name,
            region=obj.region.region,
            resource_type=obj.resource_type.name if obj.resource_type else None,
            water_type=obj.water_type.name if obj.water_type else None,
            latitude=float(obj.latitude) if obj.latitude else None,
            longitude=float(obj.longitude) if obj.longitude else None,
            danger_level_cm=obj.danger_level_cm,
            actual_level_cm=obj.actual_level_cm,
            actual_discharge_m3s=obj.actual_discharge_m3s,
            water_temperature_C=obj.water_temperature_C,
            water_object_code=obj.water_object_code,
            is_dangerous=is_dangerous
        ))

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=(total + size - 1) // size
    )

async def bll_update_object(
    obj_id: int,
    cmd: ObjectUpdate,
    db: AsyncSession,
    current_user  
) -> ObjectResponse:
    updated_obj = await dal_update_object(obj_id, cmd.dict(exclude_unset=True), db)

    return ObjectResponse(
        id=updated_obj.id,
        name=updated_obj.name,
        region=updated_obj.region.region,
        resource_type=updated_obj.resource_type.name if updated_obj.resource_type else None,
        water_type=updated_obj.water_type.name if updated_obj.water_type else None,
        fauna=updated_obj.fauna,
        technical_condition=updated_obj.technical_condition,
        latitude=float(updated_obj.latitude) if updated_obj.latitude else None,
        longitude=float(updated_obj.longitude) if updated_obj.longitude else None,
        danger_level_cm=updated_obj.danger_level_cm,
        actual_level_cm=updated_obj.actual_level_cm,
        actual_discharge_m3s=updated_obj.actual_discharge_m3s,
        water_temperature_C=updated_obj.water_temperature_C,
        water_object_code=updated_obj.water_object_code,
        pdf_url=updated_obj.pdf_url or ""
    )


async def bll_delete_object(
    obj_id: int,
    db: AsyncSession,
    current_user
):
    await dal_delete_object(obj_id, db)
    return {"detail": "Объект успешно удалён"}