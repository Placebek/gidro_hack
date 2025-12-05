from pydantic import BaseModel
from typing import Optional


class ObjectResponse(BaseModel):
    id: int
    name: str
    region: str
    resource_type: Optional[str] = None
    water_type: Optional[str] = None
    fauna: bool
    technical_condition: int
    latitude: Optional[float]
    longitude: Optional[float]
    danger_level_cm: Optional[int]
    actual_level_cm: Optional[int]
    actual_discharge_m3s: Optional[int]
    water_temperature_C: Optional[int]
    water_object_code: Optional[str]
    pdf_url: str

    model_config = {"from_attributes": True}