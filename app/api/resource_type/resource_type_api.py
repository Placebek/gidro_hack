from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from fastapi import APIRouter, Depends
from app.api.resource_type.cruds.resource_type_crud import dal_get_resource_types
from app.api.resource_type.schemas.response import ResourceTypeListResponse


router = APIRouter()

@router.get(
    "/resource-types",
    summary="Все типы ресурсов",
    response_model=ResourceTypeListResponse,
)
async def list_resource_types(db: AsyncSession = Depends(get_db)):
    types = await dal_get_resource_types(db)
    return {"resource_types": types}