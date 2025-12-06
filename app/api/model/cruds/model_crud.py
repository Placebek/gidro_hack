import joblib
import os
from catboost import CatBoostClassifier
from pathlib import Path

MODEL_DIR = Path("D:/gidro_hack/app/api/ai/models")

MODEL: CatBoostClassifier | None = None
SCALER = None
EXPECTED_COLUMNS = None


async def load_ml_artifacts():
    """Асинхронная загрузка модели и артефактов при старте приложения"""
    global MODEL, SCALER, EXPECTED_COLUMNS

    model_path = MODEL_DIR / "catboost_model.cbm"

    if not model_path.exists():
        raise FileNotFoundError(f"Модель не найдена: {model_path}")

    MODEL = joblib.load(model_path)

    print("ML артефакты успешно загружены (async)")