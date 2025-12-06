from typing import Optional, Literal
from pydantic import BaseModel, Field


class WaterClassFilter(BaseModel):
    latitude_min: Optional[float] = Field(None, ge=-90, le=90)
    latitude_max: Optional[float] = Field(None, ge=-90, le=90)
    longitude_min: Optional[float] = Field(None, ge=-180, le=180)
    longitude_max: Optional[float] = Field(None, ge=-180, le=180)
    
    water_class: Optional[int] = Field(None, ge=1, le=5)
    parameter: Optional[str] = Field(None, max_length=50)
    concentration_min: Optional[float] = None
    concentration_max: Optional[float] = None
    background_min: Optional[float] = None
    background_max: Optional[float] = None
    fauna_contains: Optional[str] = Field(None, description="Любая подстрока в поле fauna, например: 'отсутствует', 'присутствует'")
    fauna_exact: Optional[
        Literal["рыба отсутствует", "рыба присутствует", "макрофиты отсутствуют", "зоопланктон отсутствует", None]
    ] = None

    purpose_contains: Optional[str] = Field(None, description="Подстрока в поле purpose")
    pollution_level: Optional[
        Literal["сильно загрязнённая", "загрязнённая", "умеренно загрязнённая", "чистая", "условно чистая", None]
    ] = None
    
    skip: Optional[int] = Field(0, ge=0)
    limit: Optional[int] = Field(100, ge=1, le=1000)