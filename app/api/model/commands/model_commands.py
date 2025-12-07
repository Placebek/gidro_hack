# app/api/model/commands/model_commands.py

import pandas as pd
from sklearn.preprocessing import StandardScaler
from app.api.model.cruds.model_crud import load_model_async
from app.api.model.schemas.response import FeaturesInput, PredictionResponse

# ТОЧНЫЕ числовые колонки (как у тебя)
NUMERIC_COLUMNS = [
    'CAP_MCM', 'CAP_MAX', 'CAP_MIN', 'AREA_SKM', 'AREA_MAX', 'DEPTH_M',
    'CATCH_SKM', 'DIS_AVG_LS', 'ELEV_MASL', 'DAM_HGT_M', 'DAM_LEN_M'
]

# ТОЧНЫЙ финальный список колонок ПОСЛЕ get_dummies (из твоего вывода!)
EXPECTED_FEATURES = [
    'CAP_MCM', 'CAP_MAX', 'CAP_MIN', 'AREA_SKM', 'AREA_MAX', 'DEPTH_M',
    'CATCH_SKM', 'DIS_AVG_LS', 'ELEV_MASL', 'DAM_HGT_M', 'DAM_LEN_M',
    # Категориальные one-hot колонки — ВЗЯТЫ ИЗ ТВОЕГО ПРИМЕРА!
    'DAM_TYPE_Dam', 'DAM_TYPE_Lake Control Dam', 'DAM_TYPE_Lock', 'DAM_TYPE_Low Permeable Dam',
    'INSTREAM_Instream', 'INSTREAM_Offstream'
    # Если у тебя были другие типы дамб — добавь их сюда!
    # Например: 'DAM_TYPE_Arch Dam', 'DAM_TYPE_Gravity Dam' и т.д.
]

# Создаём и фитим scaler (на нулевых данных — чтобы mean=0, std=1)
scaler = StandardScaler()
_dummy_num = pd.DataFrame(columns=NUMERIC_COLUMNS, dtype=float)
_dummy_num.loc[0] = 0
scaler.fit(_dummy_num)

async def predict_risk_async(features: FeaturesInput) -> PredictionResponse:
    model = await load_model_async()  # ← твоя обученная CatBoost модель

    # 1. Входные данные → DataFrame
    df = pd.DataFrame([features.dict()])

    # 2. Выделяем числовые
    num_data = df[NUMERIC_COLUMNS].copy()

    # 3. Нормализуем числовые
    num_scaled = pd.DataFrame(
        scaler.transform(num_data),
        columns=NUMERIC_COLUMNS,
        index=df.index
    )

    # 4. Делаем one-hot для категориальных (ТОЧНО как при обучении!)
    cat_data = df[["DAM_TYPE", "INSTREAM"]]
    cat_encoded = pd.get_dummies(cat_data, drop_first=False, dtype=float)

    # 5. Объединяем
    df_processed = pd.concat([num_scaled, cat_encoded], axis=1)

    # 6. Добавляем недостающие колонки (если какая-то категория не попала)
    for col in EXPECTED_FEATURES:
        if col not in df_processed.columns:
            df_processed[col] = 0.0

    # 7. Приводим к точному порядку (ОЧЕНЬ ВАЖНО для CatBoost!)
    df_processed = df_processed[EXPECTED_FEATURES]

    # 8. Предсказание
    pred = model.predict(df_processed)[0]
    proba = model.predict_proba(df_processed)[0][1]  # вероятность High Risk

    risk_level = "High Risk" if int(pred) == 1 else "Low Risk"
    confidence = (
        "high" if proba >= 0.8 or proba <= 0.2 else
        "medium" if proba >= 0.6 or proba <= 0.4 else "low"
    )

    return PredictionResponse(
        risk_level=risk_level,
        risk_class=int(pred),
        risk_probability=round(float(proba), 4),
        confidence=confidence,
        model="CatBoost (one-hot + StandardScaler)"
    )