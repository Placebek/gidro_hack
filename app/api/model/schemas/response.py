from pydantic import BaseModel, Field
from typing import Literal


class RiskPredictionInput(BaseModel):
    CAP_MCM: float = Field(..., gt=0)
    CAP_MAX: float = Field(..., gt=0)
    CAP_MIN: float = Field(..., ge=0)
    AREA_SKM: float = Field(..., gt=0)
    AREA_MAX: float = Field(..., gt=0)
    DEPTH_M: float  # Оставляем без gt=0 — глубина может быть отрицательной
    CATCH_SKM: float = Field(..., gt=0)
    DIS_AVG_LS: float = Field(..., ge=0)
    ELEV_MASL: float
    DAM_HGT_M: float = Field(..., gt=0)
    DAM_LEN_M: float = Field(..., gt=0)
    DAM_TYPE: str
    INSTREAM: str = Field(
        ..., 
        pattern="^(?i)(yes|no|y|n|1|0)$",   # ← ИСПРАВЛЕНО: regex → pattern
        description="yes/no (регистронезависимо)"
    )


class RiskPredictionResponse(BaseModel):
    risk_level: str = Field(..., example="Высокий риск")
    risk_class: int = Field(..., ge=0, le=1, example=1)
    risk_probability: float = Field(..., ge=0, le=1, example=0.87)
    confidence: str = Field(..., example="высокая")
    model: str = "CatBoost"