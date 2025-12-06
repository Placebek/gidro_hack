from fastapi import APIRouter
from app.api.auth.auth_api import router as auth_router
from app.api.resource_type.resource_type_api import router as resource_type_router
from app.api.water_type.water_type_api import router as water_type_router
from app.api.region.region_api import router as region_router
from app.api.object.object_api import router as object_router
from app.api.water_class.water_class_api import router as water_class_router


route = APIRouter()

route.include_router(auth_router, prefix="/auth", tags=["AUTHENTICATION"])
route.include_router(resource_type_router, prefix="/resource", tags=["RESOURCE TYPE"])
route.include_router(water_type_router, prefix="/water", tags=["WATER TYPE"])
route.include_router(region_router, prefix="/region", tags=["REGION"])
route.include_router(object_router, prefix="/object", tags=["OBJECT"])
route.include_router(water_class_router, prefix="/water_class", tags=["WATER CLASS"])