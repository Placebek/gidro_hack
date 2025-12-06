from pydantic import BaseModel
from typing import Optional, List


class WaterClassResponse(BaseModel):
    id: int
    latitude: float
    longitude: float
    description: Optional[str]
    water_class: Optional[int]                            
    location_info: Optional[str]                          
    purpose: Optional[str]                                
    fauna: Optional[str]                                  
    index: Optional[str]
    parameter: str
    unit: Optional[str]
    concentration: Optional[float]
    background: Optional[float]

    model_config = {"from_attributes": True}


class ParameterItem(BaseModel):
    index: Optional[str] = None
    parameter: str
    unit: Optional[str] = None
    concentration: Optional[float] = None
    background: Optional[float] = None


class WaterClassDetailResponse(BaseModel):
    lat: float
    lng: float
    description: Optional[str] = None
    water_class: Optional[int] = None
    location_info: Optional[str] = None
    purpose: List[str] = []
    fauna: List[str] = []
    parameters: List[ParameterItem] = []

    model_config = {"from_attributes": True}