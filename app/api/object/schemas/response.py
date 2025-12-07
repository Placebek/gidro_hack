# app/api/object/schemas/response.py
# ← КОПИРУЙ ВЕСЬ ФАЙЛ ПОЛНОСТЬЮ!

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, time


# === ВСПОМОГАТЕЛЬНЫЕ СХЕМЫ ===
class GroupItem(BaseModel):
    number: Optional[int] = None
    code: Optional[int] = None
    text: Optional[str] = None


class HistoryItem(BaseModel):
    date: str
    time: Optional[str] = None
    level_cm: Optional[int] = None
    discharge_m3s: Optional[float] = None
    temperature_C: Optional[float] = None

    # Оставляем только коды — они есть всегда
    status1: Optional[int] = None
    status2: Optional[int] = None

    # Теперь group — массив!
    group: List[GroupItem] = []

    source_file: Optional[str] = None

    @field_validator('date', mode='before')
    def format_date(cls, v):
        if v is None: return None
        return v.isoformat() if hasattr(v, 'isoformat') else str(v)

    @field_validator('time', mode='before')
    def format_time(cls, v):
        if v is None: return None
        return v.strftime("%H:%M:%S") if hasattr(v, 'strftime') else str(v)


# === СТАРЫЕ СХЕМЫ (оставляем для совместимости) ===
class ObjectResponse(BaseModel):
    id: int
    name: str
    region: str
    resource_type: Optional[str] = None
    water_type: Optional[str] = None
    fauna: bool
    technical_condition: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    danger_level_cm: Optional[int] = None
    actual_level_cm: Optional[int] = None
    actual_discharge_m3s: Optional[int] = None
    water_temperature_C: Optional[int] = None
    water_object_code: Optional[str] = None
    pdf_url: str = ""

    model_config = {"from_attributes": True}


class ObjectListItem(BaseModel):
    id: int
    name: str
    region: str
    resource_type: Optional[str] = None
    water_type: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    danger_level_cm: Optional[int] = None
    actual_level_cm: Optional[int] = None
    actual_discharge_m3s: Optional[int] = None
    water_temperature_C: Optional[int] = None
    water_object_code: Optional[str] = None
    is_dangerous: bool = False

    model_config = {"from_attributes": True}


class ObjectDetailResponse(ObjectListItem):
    fauna: bool
    technical_condition: int
    passport_date: Optional[date] = None
    pdf_url: str = ""


class PaginatedResponse(BaseModel):
    items: List[ObjectListItem]
    total: int
    page: int
    size: int
    pages: int


# === НОВАЯ СХЕМА — ТОЧНО КАК НА ФРОНТЕНДЕ! ===
class ObjectFullResponse(BaseModel):
    id: int
    object_name: str = Field(..., alias="object_name")  # ← Поддержка alias
    region: str
    resource_type: Optional[str] = None
    water_type: Optional[str] = None
    fauna: bool
    technical_condition: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    danger_level_cm: Optional[int] = None
    actual_level_cm: Optional[int] = None
    actual_discharge_m3s: Optional[int] = None
    water_temperature_C: Optional[int] = None
    water_object_code: Optional[str] = None
    pdf_url: str = ""
    passport_date: Optional[str] = None
    is_dangerous: bool = False
    history: List[HistoryItem] = []

    @field_validator('actual_discharge_m3s', mode='before')
    def round_float_to_int(cls, v):
        if isinstance(v, float):
            return int(round(v))  # или int(v) если уверен, что дробная часть не нужна
        return v
    
    model_config = {
        "from_attributes": True,
        "populate_by_name": True  # ← ВАЖНО! Позволяет использовать alias
    }