from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.object.schemas.create import ObjectCreate
from app.api.object.schemas.response import ObjectResponse
from app.api.object.cruds.object_crud import dal_create_object
from model.models import UserRole
import logging


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