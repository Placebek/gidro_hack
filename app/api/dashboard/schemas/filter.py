from typing import Optional
from pydantic import BaseModel, Field
from datetime import date


class FeaturesFilter(BaseModel):
    cap_mcm_min: Optional[float] = None
    cap_mcm_max: Optional[float] = None
    
    cap_max_min: Optional[float] = None
    cap_max_max: Optional[float] = None
    
    area_skm_min: Optional[float] = None
    area_skm_max: Optional[float] = None
    
    depth_min: Optional[float] = None
    depth_max: Optional[float] = None
    
    elev_masl_min: Optional[float] = None
    elev_masl_max: Optional[float] = None
    
    dam_hgt_min: Optional[float] = None
    dam_hgt_max: Optional[float] = None
    
    dam_len_min: Optional[float] = None
    dam_len_max: Optional[float] = None

    dam_type: Optional[str] = Field(None, description="Тип плотины (например: земляная, бетонная)")
    instream: Optional[str] = Field(None, description="Водоём в русле (yes/no)")

    date_from: Optional[date] = None
    date_to: Optional[date] = None

    skip: Optional[int] = Field(0, ge=0)
    limit: Optional[int] = Field(100, ge=1, le=1000)