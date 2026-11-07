
# phone.py defines the API input and output schemas.

from typing import Literal
from pydantic import BaseModel, Field


class PhoneInput(BaseModel):
    brand: str = Field(..., min_length=1)
    model: str = Field(..., min_length=1)

    launch_price_inr: float = Field(..., gt=0)
    age_years: int = Field(..., ge=0)

    ram_gb: float = Field(..., gt=0)
    storage_gb: float = Field(..., gt=0)

    battery_health_pct: float = Field(..., ge=0, le=100)

    condition: Literal["Excellent", "Good", "Fair", "Poor"]

    screen_crack: Literal["Yes", "No"]
    scratches: Literal["Minor", "Moderate", "Heavy", "Unknown"]

    box: Literal["Yes", "No"]
    charger: Literal["Yes", "No"]
    invoice: Literal["Yes", "No"]
    warranty: Literal["Yes", "No"]

    city: str = Field(..., min_length=1)

    seller_type: Literal["Individual", "Dealer"]


class PredictionResponse(BaseModel):
    predicted_resale_price_inr: float
    currency: Literal["INR"] = "INR"
