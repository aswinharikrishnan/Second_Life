from fastapi import APIRouter

from app.schemas.phone import PhoneInput, PredictionResponse
from app.services.predictor import predict_resale_price

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/", response_model=PredictionResponse)
def predict_price(phone: PhoneInput):
    phone_data = phone.model_dump()
    result = predict_resale_price(phone_data)
    return result