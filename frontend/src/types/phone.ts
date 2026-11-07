// ─── Types mirrored from backend/app/schemas/phone.py ───

export type Condition = "Excellent" | "Good" | "Fair" | "Poor";
export type YesNo = "Yes" | "No";
export type ScratchLevel = "Minor" | "Moderate" | "Heavy" | "Unknown";
export type SellerType = "Individual" | "Dealer";

/** Matches PhoneInput (Pydantic) exactly. */
export interface PhoneInput {
  brand: string;
  model: string;
  launch_price_inr: number;
  age_years: number;
  ram_gb: number;
  storage_gb: number;
  battery_health_pct: number;
  condition: Condition;
  screen_crack: YesNo;
  scratches: ScratchLevel;
  box: YesNo;
  charger: YesNo;
  invoice: YesNo;
  warranty: YesNo;
  city: string;
  seller_type: SellerType;
}

/** Matches PredictionResponse (Pydantic) exactly. */
export interface PredictionResponse {
  predicted_resale_price_inr: number;
  currency: "INR";
}

/** Extended result stored client-side with derived decision metrics. */
export interface EvaluationResult {
  id: string;
  timestamp: string;
  input: PhoneInput;
  prediction: PredictionResponse;
  /** User-supplied asking price used for comparison (optional). */
  asking_price?: number;
  /** Derived decision: Buy / Negotiate / Pass */
  decision?: "Buy" | "Negotiate" | "Pass";
  /** Ratio of predicted price to asking price (if provided). */
  value_ratio?: number;
}

