from pydantic import BaseModel
from typing import Optional


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