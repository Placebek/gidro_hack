from pydantic import BaseModel, Field, AnyUrl
from typing import Optional
from datetime import date


class ObjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=300, description="Название объекта")
    region_id: int = Field(..., ge=1, description="ID региона")
    resource_type_id: Optional[int] = Field(None, description="Тип ресурса")
    water_type_id: Optional[int] = Field(None, description="Тип воды")
    fauna: bool = Field(False, description="Наличие фауны")
    passport_date: Optional[date] = None
    technical_condition: Optional[int] = Field(5, ge=1, le=10, description="Тех. состояние (1–10)")
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    danger_level_cm: Optional[int] = Field(None, description="Уровень опасности (см)")
    actual_level_cm: Optional[int] = Field(None, description="Текущий уровень (см)")
    actual_discharge_m3s: Optional[int] = Field(None, description="Текущий расход (м³/с)")
    water_temperature_C: Optional[int] = Field(None, description="Температура воды (°C)")
    water_object_code: Optional[str] = Field(None, max_length=100, description="Код водного объекта")
    pdf_url: Optional[str] = Field("", description="Ссылка на паспорт (PDF)")

    model_config = {"from_attributes": True}