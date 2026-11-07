"use client";

import { useState } from "react";
import type {
  PhoneInput,
  Condition,
  YesNo,
  ScratchLevel,
  SellerType,
} from "@/types/phone";
import { TEST_PAYLOAD } from "@/lib/api";
import { FlaskConical, Loader2, Beaker } from "lucide-react";

// ── Option arrays (match preprocessor categories) ──
const CONDITIONS: Condition[] = ["Excellent", "Good", "Fair", "Poor"];
const YES_NO: YesNo[] = ["Yes", "No"];
const SCRATCH_LEVELS: ScratchLevel[] = ["Minor", "Moderate", "Heavy", "Unknown"];
const SELLER_TYPES: SellerType[] = ["Individual", "Dealer"];
const RAM_OPTIONS = [2, 3, 4, 6, 8, 12, 16];
const STORAGE_OPTIONS = [16, 32, 64, 128, 256, 512, 1024];

const INITIAL_FORM: PhoneInput = {
  brand: "",
  model: "",
  launch_price_inr: 0,
  age_years: 0,
  ram_gb: 4,
  storage_gb: 64,
  battery_health_pct: 80,
  condition: "Good",
  screen_crack: "No",
  scratches: "Minor",
  box: "Yes",
  charger: "Yes",
  invoice: "No",
  warranty: "No",
  city: "",
  seller_type: "Individual",
};

interface Props {
  onSubmit: (data: PhoneInput, askingPrice?: number) => Promise<void>;
  loading: boolean;
}

export default function PhoneForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<PhoneInput>(INITIAL_FORM);
  const [askingPrice, setAskingPrice] = useState<string>("");

  const set = <K extends keyof PhoneInput>(key: K, val: PhoneInput[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const fillSample = () => {
    setForm(TEST_PAYLOAD);
    setAskingPrice("45000");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form, askingPrice ? Number(askingPrice) : undefined);
  };

  // ── Shared field styling ──
  const inputCls =
    "w-full rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition";
  const selectCls = inputCls + " appearance-none";
  const labelCls = "mb-1 block text-xs font-semibold text-gray-400 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ── Header Row ── */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-white">
          <FlaskConical className="h-5 w-5 text-emerald-400" />
          Device Details
        </h2>
        <button
          type="button"
          onClick={fillSample}
          className="flex items-center gap-1.5 rounded-lg border border-amber-600/40 bg-amber-900/30 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/50 transition"
        >
          <Beaker className="h-3.5 w-3.5" />
          Fill with Test Payload
        </button>
      </div>

      {/* ── Brand & Model ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Brand</label>
          <input
            className={inputCls}
            placeholder="e.g. Samsung"
            required
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Model</label>
          <input
            className={inputCls}
            placeholder="e.g. Galaxy S23"
            required
            value={form.model}
            onChange={(e) => set("model", e.target.value)}
          />
        </div>
      </div>

      {/* ── Price, Age ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Launch Price (₹)</label>
          <input
            className={inputCls}
            type="number"
            min={1}
            required
            value={form.launch_price_inr || ""}
            onChange={(e) => set("launch_price_inr", Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Age (years)</label>
          <input
            className={inputCls}
            type="number"
            min={0}
            required
            value={form.age_years}
            onChange={(e) => set("age_years", Number(e.target.value))}
          />
        </div>
      </div>

      {/* ── RAM, Storage ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>RAM (GB)</label>
          <select
            className={selectCls}
            value={form.ram_gb}
            onChange={(e) => set("ram_gb", Number(e.target.value))}
          >
            {RAM_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r} GB
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Storage (GB)</label>
          <select
            className={selectCls}
            value={form.storage_gb}
            onChange={(e) => set("storage_gb", Number(e.target.value))}
          >
            {STORAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s} GB
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Battery Health slider ── */}
      <div>
        <label className={labelCls}>
          Battery Health —{" "}
          <span className="text-emerald-400">{form.battery_health_pct}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={form.battery_health_pct}
          onChange={(e) => set("battery_health_pct", Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-emerald-500"
        />
        <div className="mt-1 flex justify-between text-[10px] text-gray-500">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* ── Condition & Scratches ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Condition</label>
          <select
            className={selectCls}
            value={form.condition}
            onChange={(e) => set("condition", e.target.value as Condition)}
          >
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Scratches</label>
          <select
            className={selectCls}
            value={form.scratches}
            onChange={(e) => set("scratches", e.target.value as ScratchLevel)}
          >
            {SCRATCH_LEVELS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Screen Crack ── */}
      <div>
        <label className={labelCls}>Screen Crack</label>
        <div className="flex gap-3">
          {YES_NO.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("screen_crack", v)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                form.screen_crack === v
                  ? v === "Yes"
                    ? "border-red-500 bg-red-900/40 text-red-300"
                    : "border-emerald-500 bg-emerald-900/40 text-emerald-300"
                  : "border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-600"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* ── Accessories Grid ── */}
      <div>
        <label className={labelCls}>Accessories Included</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["box", "charger", "invoice", "warranty"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                set(key, form[key] === "Yes" ? "No" : "Yes")
              }
              className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition ${
                form[key] === "Yes"
                  ? "border-emerald-500 bg-emerald-900/40 text-emerald-300"
                  : "border-gray-700 bg-gray-800/40 text-gray-500"
              }`}
            >
              {form[key] === "Yes" ? "✓ " : "✗ "}
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* ── City & Seller ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>City</label>
          <input
            className={inputCls}
            placeholder="e.g. Pune"
            required
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Seller Type</label>
          <select
            className={selectCls}
            value={form.seller_type}
            onChange={(e) => set("seller_type", e.target.value as SellerType)}
          >
            {SELLER_TYPES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Asking Price (optional, for decision) ── */}
      <div>
        <label className={labelCls}>
          Asking / Listed Price (₹){" "}
          <span className="text-gray-600">— optional, for Buy/Pass decision</span>
        </label>
        <input
          className={inputCls}
          type="number"
          min={0}
          placeholder="Seller's asking price"
          value={askingPrice}
          onChange={(e) => setAskingPrice(e.target.value)}
        />
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Predicting…
          </>
        ) : (
          "🔍 Predict Resale Value"
        )}
      </button>
    </form>
  );
}

