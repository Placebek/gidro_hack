from fastapi import Depends, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db
from app.api.region.cruds.region_crud import dal_get_regions
from app.api.region.schemas.response import RegionListResponse


router = APIRouter()

@router.get(
    "/regions",
    summary="Выводить все регионы",
    response_model=RegionListResponse
)
async def list_regions(db: AsyncSession = Depends(get_db)):
    regions = await dal_get_regions(db)
    return {"regions": regions}