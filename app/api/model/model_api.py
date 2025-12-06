from fastapi import APIRouter, HTTPException
from app.api.model.schemas.response import FeaturesInput, PredictionResponse
from app.api.model.commands.model_commands import predict_risk_async
from app.api.model.cruds.model_crud import MODEL


router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_endpoint(features: FeaturesInput):
    try:
        return await predict_risk_async(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка ML: {str(e)}")


@router.get("/health")
async def health():
    return {"status": "ready", "model_loaded": MODEL is not None}