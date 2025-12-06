from pydantic import BaseModel, Field
from typing import Optional


class WaterClassCreate(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    description: Optional[str] = None
    water_class: Optional[int] = Field(None, ge=1, le=5)  
    location_info: Optional[str] = None                   
    purpose: Optional[str] = None                         
    fauna: Optional[str] = None                           
    index: Optional[str] = Field(None, max_length=50)
    parameter: str = Field(..., max_length=50)  
    unit: Optional[str] = Field(None, max_length=20)
    concentration: Optional[float] = None
    background: Optional[float] = None