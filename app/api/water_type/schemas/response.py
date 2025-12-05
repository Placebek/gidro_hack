from pydantic import BaseModel
from typing import List


class WaterTypeResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class WaterTypeListResponse(BaseModel):
    water_types: List[WaterTypeResponse]