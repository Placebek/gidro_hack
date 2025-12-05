from pydantic import BaseModel, Field, AnyUrl
from typing import Optional
from datetime import date


class ObjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Название объекта")
    region_id: int = Field(..., description="ID региона")
    resource_type_id: Optional[int] = Field(None, description="ID типа ресурса")
    water_type_id: Optional[int] = Field(None, description="ID типа воды")
    fauna: bool = Field(False, description="Есть ли фауна")
    passport_date: Optional[date] = Field(None, description="Дата паспорта")
    technical_condition: Optional[int] = Field(5, ge=1, le=10, description="Техническое состояние (1-10)")
    latitude: Optional[float] = Field(None, ge=-90, le=90, description="Широта")
    longitude: Optional[float] = Field(None, ge=-180, le=180, description="Долгота")
    pdf_url: Optional[str] = Field("", description="Ссылка на PDF")

    class Config:
        from_attributes = True