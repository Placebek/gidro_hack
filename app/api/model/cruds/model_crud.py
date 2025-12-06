import joblib
from catboost import CatBoostClassifier
from pathlib import Path


MODEL_DIR = Path("D:/gidro_hack/app/api/ai/models")
MODEL_PATH = MODEL_DIR / "catboost_model.cbm"

MODEL: CatBoostClassifier | None = None

async def load_model_async() -> CatBoostClassifier:
    """Асинхронно загружает модель при старте"""
    global MODEL
    if MODEL is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Модель не найдена: {MODEL_PATH}")
        import asyncio
        loop = asyncio.get_event_loop()
        MODEL = await loop.run_in_executor(None, joblib.load, MODEL_PATH)
        print("CatBoost модель загружена асинхронно (DAL)")
    return MODEL