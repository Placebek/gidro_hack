import joblib
from catboost import CatBoostClassifier
from pathlib import Path
import asyncio
import logging


MODEL_DIR = Path("D:/gidro_hack/app/api/ai/models")
MODEL_PATH = MODEL_DIR / "catboost_model.cbm"

MODEL: CatBoostClassifier | None = None

async def load_model_async() -> CatBoostClassifier:
    global MODEL
    if MODEL is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Модель не найдена по пути: {MODEL_PATH}")

        logging.info(f"Загрузка CatBoost модели: {MODEL_PATH}")
        loop = asyncio.get_event_loop()
        MODEL = await loop.run_in_executor(None, joblib.load, str(MODEL_PATH))
        logging.info("Модель CatBoost успешно загружена")
    return MODEL