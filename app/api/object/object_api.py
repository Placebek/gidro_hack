from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.object.commands.forecast_pdf import generate_forecast_pdf
from app.api.object.commands.object_command import bll_create_object, bll_delete_object, bll_get_object_full, bll_get_objects, bll_update_object
from app.api.object.schemas.update import ObjectUpdate
from database.db import get_db
from app.api.object.schemas.create import ObjectCreate
from app.api.object.schemas.response import ObjectFullResponse, ObjectResponse, PaginatedResponse, ObjectDetailResponse
from app.api.object.schemas.filters import ObjectFilters
from model.models import Object
from utils.context_utils import require_expert
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi.responses import StreamingResponse
from app.api.object.commands.object_pasport import generate_passport_pdf
from io import BytesIO
from urllib.parse import quote


router = APIRouter()

@router.post(
    "",
    response_model=ObjectResponse,
    status_code=201,
    summary="Создать гидрологический объект (только эксперты)"
)
async def create_object(
    cmd: ObjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_expert)  
):
    return await bll_create_object(cmd, db, current_user)


@router.get("/all", response_model=PaginatedResponse, summary="Выводить все обьекты (фильтрация, поиск, )")
async def get_objects(
    filters: ObjectFilters = Depends(),
    db: AsyncSession = Depends(get_db)
):
    return await bll_get_objects(filters, db)


# @router.get("/{obj_id}", response_model=ObjectDetailResponse, summary="Выводить обьект по id")
# async def get_object_by_id(
#     obj_id: int,
#     db: AsyncSession = Depends(get_db),
# ):
#     result = await db.execute(
#         select(Object)
#         .options(
#             selectinload(Object.region),
#             selectinload(Object.resource_type),
#             selectinload(Object.water_type)
#         )
#         .where(Object.id == obj_id)
#     )
#     obj = result.scalar_one_or_none()
#     if not obj:
#         raise HTTPException(404, "Объект не найден")

#     return ObjectDetailResponse(
#         id=obj.id,                                      
#         name=obj.name,                                  
#         region=obj.region.region,
#         resource_type=obj.resource_type.name if obj.resource_type else None,
#         water_type=obj.water_type.name if obj.water_type else None,
#         fauna=obj.fauna,
#         technical_condition=obj.technical_condition,
#         passport_date=obj.passport_date,
#         latitude=float(obj.latitude) if obj.latitude else None,
#         longitude=float(obj.longitude) if obj.longitude else None,
#         danger_level_cm=obj.danger_level_cm,
#         actual_level_cm=obj.actual_level_cm,
#         actual_discharge_m3s=obj.actual_discharge_m3s,
#         water_temperature_C=obj.water_temperature_C,
#         water_object_code=obj.water_object_code,
#         pdf_url=obj.pdf_url or "",
#         is_dangerous=(
#             obj.actual_level_cm is not None and
#             obj.danger_level_cm is not None and
#             obj.actual_level_cm >= obj.danger_level_cm
#         )
#     )


@router.get("/{obj_id}/passport-pdf", summary="Скачать паспорт обьекта")
async def get_object_passport_pdf(obj_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Object)
        .options(selectinload(Object.region))
        .where(Object.id == obj_id)
    )
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(404, "Объект не найден")

    pdf_buffer = generate_passport_pdf(obj)

    filename = f"Паспорт_{obj.name or 'Объект'}_{obj_id}.pdf"
    encoded = quote(filename)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="passport_{obj_id}.pdf"; filename*=UTF-8\'\'{encoded}'
        }
    )

@router.put("/{obj_id}", response_model=ObjectResponse, summary="Обновить объект (только эксперты)")
async def update_object(
    obj_id: int,
    cmd: ObjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_expert)
):
    return await bll_update_object(obj_id, cmd, db, current_user)

@router.delete("/{obj_id}", summary="Удалить объект (только эксперты)")
async def delete_object(
    obj_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_expert)
):
    result = await bll_delete_object(obj_id, db, current_user)
    return result


@router.get("/{obj_id}", response_model=ObjectFullResponse, summary="Полная информация об объекте в формате фронтенда")
async def get_object_full(
    obj_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await bll_get_object_full(obj_id, db)


@router.get("/{obj_id}/forecast-2025-pdf")
async def forecast_pdf(obj_id: int, db: AsyncSession = Depends(get_db)):
    obj = await bll_get_object_full(obj_id, db)
    pdf = generate_forecast_pdf(obj.dict(by_alias=True))
    return StreamingResponse(pdf, media_type="application/pdf",
                            headers={"Content-Disposition": f"attachment; filename=forecast_2025_{obj_id}.pdf"})