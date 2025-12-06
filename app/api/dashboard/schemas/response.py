from pydantic import BaseModel
from typing import Optional
from datetime import date


class FeaturesResponse(BaseModel):
    id: int
    CAP_MCM: Optional[float]
    CAP_MAX: Optional[float]
    CAP_MIN: Optional[float]
    AREA_SKM: Optional[float]
    AREA_MAX: Optional[float]
    DEPTH_M: Optional[float]
    CATCH_SKM: Optional[float]
    DIS_AVG_LS: Optional[float]
    ELEV_MASL: Optional[float]
    DAM_HGT_M: Optional[float]
    DAM_LEN_M: Optional[float]
    DAM_TYPE: Optional[str]
    INSTREAM: Optional[str]
    date: Optional[date]

    class Config:
        from_attributes = True