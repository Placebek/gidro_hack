from pydantic import BaseModel, Field


class FeaturesInput(BaseModel):
    CAP_MCM: float = Field(..., gt=0)
    CAP_MAX: float = Field(..., gt=0)
    CAP_MIN: float = Field(..., ge=0)
    AREA_SKM: float = Field(..., gt=0)
    AREA_MAX: float = Field(..., gt=0)
    DEPTH_M: float
    CATCH_SKM: float = Field(..., gt=0)
    DIS_AVG_LS: float = Field(..., ge=0)
    ELEV_MASL: float
    DAM_HGT_M: float = Field(..., gt=0)
    DAM_LEN_M: float = Field(..., gt=0)
    DAM_TYPE: str
    INSTREAM: str


class PredictionResponse(BaseModel):
    risk_level: str
    risk_class: int
    risk_probability: float
    confidence: str
    model: str = "CatBoost"