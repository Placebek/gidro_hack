import pandas as pd
from app.api.model.cruds.model_crud import load_model_async
from app.api.model.schemas.response import FeaturesInput, PredictionResponse


async def predict_risk_async(features: FeaturesInput) -> PredictionResponse:
    model = await load_model_async()

    df = pd.DataFrame([features.dict()])

    df = pd.get_dummies(df, columns=["DAM_TYPE", "INSTREAM"], dtype=int)

    prediction = model.predict(df)
    proba = model.predict_proba(df)[0]

    pred_class = int(prediction[0])
    pred_proba = float(proba[1])  

    risk_level = "Высокий риск" if pred_class == 1 else "Низкий риск"

    if pred_proba >= 0.80 or pred_proba <= 0.20:
        confidence = "высокая"
    elif pred_proba >= 0.65 or pred_proba <= 0.35:
        confidence = "средняя"
    else:
        confidence = "низкая"

    return PredictionResponse(
        risk_level=risk_level,
        risk_class=pred_class,
        risk_probability=round(pred_proba, 4),
        confidence=confidence
    )