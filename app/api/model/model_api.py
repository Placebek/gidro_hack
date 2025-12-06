# router.py
from fastapi import APIRouter, HTTPException
from app.api.model.schemas.response import RiskPredictionInput, RiskPredictionResponse
from app.api.model.commands.model_commands import predict_risk_async
from app.api.model.cruds.model_crud import MODEL


router = APIRouter()

@router.post("/predict", response_model=RiskPredictionResponse)
async def predict_endpoint(features: RiskPredictionInput):
    try:
        result = await predict_risk_async(features)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ML: {str(e)}")


@router.get("/health")
async def health():
    return {"status": "ready", "model_loaded": MODEL is not None}