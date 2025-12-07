# app/api/model/schemas/response.py
from pydantic import BaseModel, Field

class FeaturesInput(BaseModel):
    CAP_MCM: float = Field(..., description="Capacity MCM")
    CAP_MAX: float
    CAP_MIN: float
    AREA_SKM: float
    AREA_MAX: float
    DEPTH_M: float
    CATCH_SKM: float
    DIS_AVG_LS: float
    ELEV_MASL: float
    DAM_HGT_M: float = Field(..., description="Height in meters (may be negative = missing)")
    DAM_LEN_M: float
    DAM_TYPE: str
    INSTREAM: str

    class Config:
        extra = "ignore"  # на всякий случай

class PredictionResponse(BaseModel):
    risk_level: str
    risk_class: int
    risk_probability: float
    confidence: str
    model: str = "CatBoost Dam Failure Risk Model"