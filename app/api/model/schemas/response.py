from pydantic import BaseModel, Field
from typing import Literal


class FeaturesInput(BaseModel):
    CAP_MCM: float = Field(..., gt=0, description="Ёмкость водохранилища, млн м³")
    CAP_MAX: float = Field(..., gt=0, description="Максимальная ёмкость, млн м³")
    CAP_MIN: float = Field(..., ge=0, description="Минимальная ёмкость, млн м³")
    AREA_SKM: float = Field(..., gt=0, description="Площадь зеркала, км²")
    AREA_MAX: float = Field(..., gt=0, description="Максимальная площадь, км²")
    DEPTH_M: float = Field(..., description="Глубина, м")
    CATCH_SKM: float = Field(..., gt=0, description="Площадь водосбора, км²")
    DIS_AVG_LS: float = Field(..., ge=0, description="Средний расход, л/с")
    ELEV_MASL: float = Field(..., description="Отметка нормального уровня, м над ур. моря")
    DAM_HGT_M: float = Field(..., gt=0, description="Высота плотины, м")
    DAM_LEN_M: float = Field(..., gt=0, description="Длина плотины, м")
    DAM_TYPE: Literal["Бетонная", "Земляная", "Каменно-набросная", "Комбинированная"] = Field(..., description="Тип плотины")
    INSTREAM: Literal["Да", "Нет"] = Field(..., description="Плотина в русле реки")

    class Config:
        schema_extra = {
            "example": {
                "CAP_MCM": 120.5,
                "CAP_MAX": 150.0,
                "CAP_MIN": 20.0,
                "AREA_SKM": 15.2,
                "AREA_MAX": 18.0,
                "DEPTH_M": 25.0,
                "CATCH_SKM": 850.0,
                "DIS_AVG_LS": 45.0,
                "ELEV_MASL": 520.0,
                "DAM_HGT_M": 38.0,
                "DAM_LEN_M": 420.0,
                "DAM_TYPE": "",
                "INSTREAM": "Да"
            }
        }


class PredictionResponse(BaseModel):
    risk_level: Literal["Высокий риск", "Низкий риск"]
    risk_class: int = Field(..., ge=0, le=1)
    risk_probability: float = Field(..., ge=0.0, le=1.0)
    confidence: Literal["высокая", "средняя", "низкая"]
    model: str = "CatBoost Classifier (ГидроАтлас AI)"

    class Config:
        schema_extra = {
            "example": {
                "risk_level": "Высокий риск",
                "risk_class": 1,
                "risk_probability": 0.8921,
                "confidence": "высокая",
                "model": "CatBoost Classifier (ГидроАтлас AI)"
            }
        }