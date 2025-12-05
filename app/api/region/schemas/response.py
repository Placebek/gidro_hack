from pydantic import BaseModel
from typing import List


class RegionResponse(BaseModel):
    id: int
    region: str

    class Config:
        from_attributes = True


class RegionListResponse(BaseModel):
    regions: List[RegionResponse]