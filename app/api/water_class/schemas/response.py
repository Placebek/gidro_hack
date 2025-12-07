# app/api/water_class/schemas/response.py
from pydantic import BaseModel
from typing import Optional, List

class ParameterItem(BaseModel):
    index: Optional[str] = None
    parameter: str
    unit: Optional[str] = None
    concentration: Optional[float] = None
    background: Optional[float] = None

class WaterClassResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    description: Optional[str] = None
    water_class: Optional[int] = None
    location_info: Optional[str] = None
    purpose: Optional[str] = None
    fauna: Optional[str] = None
    index: Optional[str] = None
    parameter: str
    unit: Optional[str] = None
    concentration: Optional[float] = None
    background: Optional[float] = None

    # ДОБАВЛЕНО
    region_id: Optional[int] = None
    region: Optional[str] = None

    model_config = {"from_attributes": True}


class WaterClassDetailResponse(BaseModel):
    id: Optional[int] = None
    lat: float
    lng: float
    description: Optional[str] = None
    water_class: Optional[int] = None
    location_info: Optional[str] = None
    purpose: List[str] = []
    fauna: List[str] = []
    parameters: List[ParameterItem] = []

    # ДОБАВЛЕНО
    region_id: Optional[int] = None
    region: Optional[str] = None

    model_config = {"from_attributes": True}