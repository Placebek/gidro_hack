from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from app.api.water_type.cruds.water_type_crud import dal_get_all_water_types
from app.api.water_type.schemas.response import WaterTypeListResponse


router = APIRouter()

@router.get(
    "/water-types",
    response_model=WaterTypeListResponse,
    summary="Все типы водных объектов"
)
async def list_water_types(db: AsyncSession = Depends(get_db)):
    types = await dal_get_all_water_types(db)
    return {"water_types": types}