from app.api.water_class.schemas.create import WaterClassCreate
from app.api.water_class.schemas.response import WaterClassResponse
from app.api.water_class.cruds.water_class_crud import dal_create_water_class


async def bll_create_water_class(
    cmd: WaterClassCreate,
    db,
    current_user  
) -> WaterClassResponse:
    wc = await dal_create_water_class(cmd.dict(), db)
    return WaterClassResponse.model_validate(wc)