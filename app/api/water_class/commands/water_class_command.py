from app.api.water_class.schemas.create import WaterClassCreate
from app.api.water_class.schemas.response import WaterClassResponse
from app.api.water_class.cruds.water_class_crud import dal_create_water_class, dal_delete_water_class, dal_update_water_class
from app.api.water_class.schemas.update import WaterClassUpdate


async def bll_create_water_class(
    cmd: WaterClassCreate,
    db,
    current_user  
) -> WaterClassResponse:
    wc = await dal_create_water_class(cmd.dict(), db)
    return WaterClassResponse.model_validate(wc)

async def bll_update_water_class(
    wc_id: int,
    cmd: WaterClassUpdate,
    db,
    current_user  
) -> WaterClassResponse:
    updated = await dal_update_water_class(wc_id, cmd.dict(exclude_unset=True), db)
    return WaterClassResponse.model_validate(updated)


async def bll_delete_water_class(
    wc_id: int,
    db,
    current_user
):
    await dal_delete_water_class(wc_id, db)
    return {"detail": "Точка анализа успешно удалена"}