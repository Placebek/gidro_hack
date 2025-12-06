from pydantic import BaseModel
from typing import Optional


class ObjectFilters(BaseModel):
    region_id: Optional[int] = None
    resource_type_id: Optional[int] = None
    water_type_id: Optional[int] = None
    name_contains: Optional[str] = None
    water_object_code: Optional[str] = None
    min_danger_level: Optional[int] = None
    only_dangerous: Optional[bool] = False  

    page: int = 1
    size: int = 20