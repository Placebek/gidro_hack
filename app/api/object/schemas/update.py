from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class ObjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    region_id: Optional[int] = None
    resource_type_id: Optional[int] = None
    water_type_id: Optional[int] = None
    fauna: Optional[bool] = None
    passport_date: Optional[date] = None
    technical_condition: Optional[int] = Field(None, ge=1, le=10)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    danger_level_cm: Optional[int] = None
    actual_level_cm: Optional[int] = None
    actual_discharge_m3s: Optional[int] = None
    water_temperature_C: Optional[int] = None
    water_object_code: Optional[str] = None
    pdf_url: Optional[str] = None

    class Config:
        extra = "ignore"  