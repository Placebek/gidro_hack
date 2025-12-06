import pandas as pd
from app.api.model.schemas.response import RiskPredictionInput, RiskPredictionResponse
from app.api.model.cruds.model_crud import MODEL, SCALER, EXPECTED_COLUMNS


async def predict_risk_async(features: RiskPredictionInput) -> RiskPredictionResponse:
    df = pd.DataFrame([features.dict()])

    df = pd.get_dummies(df, columns=["DAM_TYPE", "INSTREAM"], dtype=int)

    for col in EXPECTED_COLUMNS:
        if col not in df.columns:
            df[col] = 0
    df = df[EXPECTED_COLUMNS]

    num_features = [
        'CAP_MCM', 'CAP_MAX', 'CAP_MIN', 'AREA_SKM', 'AREA_MAX',
        'DEPTH_M', 'CATCH_SKM', 'DIS_AVG_LS', 'ELEV_MASL',
        'DAM_HGT_M', 'DAM_LEN_M'
    ]
    df[num_features] = SCALER.transform(df[num_features])

    pred_class = int(MODEL.predict(df)[0])
    pred_proba = float(MODEL.predict_proba(df)[0][1])

    risk_level = "Высокий риск" if pred_class == 1 else "Низкий риск"
    confidence = "высокая" if pred_proba >= 0.75 or pred_proba <= 0.25 else "средняя"

    return RiskPredictionResponse(
        risk_level=risk_level,
        risk_class=pred_class,
        risk_probability=round(pred_proba, 4),
        confidence=confidence
    )