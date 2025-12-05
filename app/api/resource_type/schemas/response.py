from pydantic import BaseModel
from typing import List


class ResourceTypeResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class ResourceTypeListResponse(BaseModel):
    resource_types: List[ResourceTypeResponse]