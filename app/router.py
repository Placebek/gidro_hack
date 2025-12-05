from fastapi import APIRouter
from app.api.auth.auth_api import router as auth_router
from app.api.resource_type.resource_type_api import router as resource_type_router
from app.api.water_type.water_type_api import router as water_type_router


route = APIRouter()

route.include_router(auth_router, prefix="/auth", tags=["AUTHENTICATION"])
route.include_router(resource_type_router, prefix="/resource", tags=["RESOURCE TYPE"])
route.include_router(water_type_router, prefix="/water", tags=["WATER TYPE"])