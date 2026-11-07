
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from fastapi import HTTPException

# Resolve paths relative to the backend directory
BACKEND_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BACKEND_DIR / "ml" / "models"

PREPROCESSOR_PATH = MODEL_DIR / "secondlife_preprocessor.joblib"
XGBOOST_PATH = MODEL_DIR / "secondlife_xgb.json"

# Check that model artifacts exist
if not PREPROCESSOR_PATH.exists():
    raise FileNotFoundError(f"Preprocessor not found: {PREPROCESSOR_PATH}")

if not XGBOOST_PATH.exists():
    raise FileNotFoundError(f"XGBoost model not found: {XGBOOST_PATH}")

# Load model artifacts once
preprocessor = joblib.load(PREPROCESSOR_PATH)

model = xgb.XGBRegressor()
model.load_model(XGBOOST_PATH)


def predict_resale_price(phone_data: dict):
    """Predict the expected resale value of a used smartphone."""

    try:
        input_df = pd.DataFrame([phone_data])

        processed_input = preprocessor.transform(input_df)

        prediction = model.predict(processed_input)[0]

        # Reject invalid model output
        if not np.isfinite(prediction):
            raise ValueError("Model returned a non-finite prediction.")

        return {
            "predicted_resale_price_inr": round(float(prediction), 2),
            "currency": "INR"
        }

    except Exception:
        # Keep internal exception details out of the API response
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred while generating the prediction."
        )
