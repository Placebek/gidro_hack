from pydantic import BaseModel, Field
from typing import Optional


class WaterClassUpdate(BaseModel):
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    description: Optional[str] = None
    water_class: Optional[int] = Field(None, ge=1, le=6)  
    location_info: Optional[str] = None
    purpose: Optional[str] = None
    fauna: Optional[str] = None
    index: Optional[str] = None
    parameter: Optional[str] = None
    unit: Optional[str] = None
    concentration: Optional[float] = None
    background: Optional[float] = None

    class Config:
        extra = "ignore"