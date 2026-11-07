"use client";

import { useState, useEffect, useCallback } from "react";
import type { PhoneInput, EvaluationResult } from "@/types/phone";
import { predictResalePrice, ValidationError, ApiError } from "@/lib/api";
import Header from "@/components/Header";
import PhoneForm from "@/components/PhoneForm";
import ResultPanel from "@/components/ResultPanel";
import SkeletonResult from "@/components/SkeletonResult";
import ComparisonTable from "@/components/ComparisonTable";
import { AlertCircle } from "lucide-react";

const STORAGE_KEY = "secondlife_evaluations";

function deriveDecision(
  predictedPrice: number,
  askingPrice?: number
): { decision?: "Buy" | "Negotiate" | "Pass"; value_ratio?: number } {
  if (askingPrice === undefined || askingPrice <= 0) return {};
  const ratio = askingPrice / predictedPrice;
  let decision: "Buy" | "Negotiate" | "Pass";
  if (ratio <= 0.9) decision = "Buy";
  else if (ratio <= 1.15) decision = "Negotiate";
  else decision = "Pass";
  return { decision, value_ratio: ratio };
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(
    null
  );
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);

  // Load persisted evaluations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEvaluations(JSON.parse(stored));
    } catch {
      /* ignore corrupt data */
    }
  }, []);

  // Persist evaluations
  const persist = useCallback((evs: EvaluationResult[]) => {
    setEvaluations(evs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evs));
  }, []);

  const handleSubmit = async (input: PhoneInput, askingPrice?: number) => {
    setError(null);
    setLoading(true);
    setCurrentResult(null);

    try {
      const prediction = await predictResalePrice(input);

      const { decision, value_ratio } = deriveDecision(
        prediction.predicted_resale_price_inr,
        askingPrice
      );

      const result: EvaluationResult = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        input,
        prediction,
        asking_price: askingPrice,
        decision,
        value_ratio,
      };

      setCurrentResult(result);
      persist([result, ...evaluations].slice(0, 20));
    } catch (err) {
      if (err instanceof ValidationError) {
        const details = err.details?.detail;
        if (Array.isArray(details)) {
          const messages = details
            .map(
              (d: { loc?: string[]; msg?: string }) =>
                `${d.loc?.slice(-1)[0] ?? "field"}: ${d.msg}`
            )
            .join("; ");
          setError(`Validation error — ${messages}`);
        } else {
          setError(err.message);
        }
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => persist([]);
  const handleRemove = (id: string) =>
    persist(evaluations.filter((e) => e.id !== id));

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* ── SDG Banner ── */}
        <div className="mb-8 rounded-2xl border border-emerald-800/30 bg-gradient-to-r from-emerald-950/50 via-gray-900/50 to-emerald-950/50 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
            Powered by XGBoost · UN SDG 12.5
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Used Smartphone Valuation &amp; Circular Economy
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
            Get an ML-predicted fair resale price for any used smartphone.
            Compare asking prices, make data-driven Buy&nbsp;/&nbsp;Negotiate&nbsp;/&nbsp;Pass
            decisions, and keep devices in circulation longer.
          </p>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left — Form */}
          <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6">
            <PhoneForm onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Right — Results */}
          <div className="rounded-2xl border border-gray-800/50 bg-gray-900/50 p-6">
            <h2 className="mb-4 text-base font-bold text-white">
              📊 Prediction &amp; Decision
            </h2>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-600/40 bg-red-900/30 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {loading && <SkeletonResult />}

            {!loading && currentResult && (
              <ResultPanel result={currentResult} />
            )}

            {!loading && !currentResult && !error && (
              <div className="flex h-64 flex-col items-center justify-center text-center text-gray-600">
                <p className="text-sm">
                  Fill in device details and hit <br />
                  <span className="font-semibold text-emerald-500">
                    Predict Resale Value
                  </span>{" "}
                  to see results here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Comparison Section ── */}
        <ComparisonTable
          evaluations={evaluations}
          onClear={handleClear}
          onRemove={handleRemove}
        />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800/50 py-6 text-center text-xs text-gray-600">
        SecondLife · Sustainable Device Valuation · UN SDG 12.5
      </footer>
    </div>
  );
}

