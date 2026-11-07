import type { PhoneInput, PredictionResponse } from "@/types/phone";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Health Check ───

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === "healthy";
  } catch {
    return false;
  }
}

// ─── Prediction ───

export async function predictResalePrice(
  input: PhoneInput
): Promise<PredictionResponse> {
  const res = await fetch(`${API_URL}/predict/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (res.status === 422) {
      throw new ValidationError(
        "Validation failed. Please check your inputs.",
        body
      );
    }
    throw new ApiError(
      body?.detail ?? `Server error (${res.status})`,
      res.status
    );
  }

  return res.json();
}

// ─── Error Types ───

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends ApiError {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, public details: any) {
    super(message, 422);
    this.name = "ValidationError";
  }
}

// ─── Test Payload (from backend/test_payload.txt) ───

export const TEST_PAYLOAD: PhoneInput = {
  brand: "Samsung",
  model: "Galaxy S23",
  launch_price_inr: 74999,
  age_years: 1,
  ram_gb: 8,
  storage_gb: 128,
  battery_health_pct: 90,
  condition: "Excellent",
  screen_crack: "No",
  scratches: "Minor",
  box: "Yes",
  charger: "Yes",
  invoice: "Yes",
  warranty: "No",
  city: "Pune",
  seller_type: "Individual",
};

