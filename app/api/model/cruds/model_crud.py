# app/api/model/cruds/model_crud.py

from pathlib import Path
from catboost import CatBoostClassifier

MODEL_PATH = Path("D:/gidro_hack/app/api/ai/models/catboost_model.cbm")

# Кэшируем модель глобально
_model = None

async def load_model_async() -> CatBoostClassifier:
    global _model
    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Модель не найдена: {MODEL_PATH}")
        _model = CatBoostClassifier()
        _model.load_model(str(MODEL_PATH))  # ← родной формат .cbm — самый надёжный
    return _model