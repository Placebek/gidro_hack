from pydantic import BaseModel
from typing import Optional


class ObjectResponse(BaseModel):
    id: int
    name: str
    region: str
    resource_type: Optional[str] = None
    water_type: Optional[str] = None
    fauna: bool
    latitude: Optional[float]
    longitude: Optional[float]
    pdf_url: str

    class Config:
        from_attributes = True