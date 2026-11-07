"use client";

import type { EvaluationResult } from "@/types/phone";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Ban,
  IndianRupee,
} from "lucide-react";

interface Props {
  result: EvaluationResult;
}

function formatInr(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function getDecisionMeta(decision?: string) {
  switch (decision) {
    case "Buy":
      return {
        color: "emerald",
        Icon: ShieldCheck,
        bg: "bg-emerald-900/40",
        border: "border-emerald-500",
        text: "text-emerald-300",
        label: "Buy — Great Deal",
        reason: "Asking price is well below the predicted fair value.",
      };
    case "Negotiate":
      return {
        color: "amber",
        Icon: AlertTriangle,
        bg: "bg-amber-900/40",
        border: "border-amber-500",
        text: "text-amber-300",
        label: "Negotiate",
        reason: "Asking price is close to or slightly above fair value.",
      };
    case "Pass":
      return {
        color: "red",
        Icon: Ban,
        bg: "bg-red-900/40",
        border: "border-red-500",
        text: "text-red-300",
        label: "Pass — Overpriced",
        reason: "Asking price is significantly above the predicted value.",
      };
    default:
      return {
        color: "gray",
        Icon: IndianRupee,
        bg: "bg-gray-800/40",
        border: "border-gray-600",
        text: "text-gray-300",
        label: "Valuation Only",
        reason: "No asking price provided — showing predicted value only.",
      };
  }
}

export default function ResultPanel({ result }: Props) {
  const predicted = result.prediction.predicted_resale_price_inr;
  const asking = result.asking_price;
  const meta = getDecisionMeta(result.decision);

  // Chart data
  const chartData = [
    {
      name: "Predicted Value",
      value: predicted,
      fill: "#10b981",
    },
    ...(asking
      ? [
          {
            name: "Asking Price",
            value: asking,
            fill:
              result.decision === "Buy"
                ? "#10b981"
                : result.decision === "Pass"
                ? "#ef4444"
                : "#f59e0b",
          },
        ]
      : []),
  ];

  // Depreciation percentage
  const depPct =
    result.input.launch_price_inr > 0
      ? (
          ((result.input.launch_price_inr - predicted) /
            result.input.launch_price_inr) *
          100
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-5">
      {/* ── Decision Badge ── */}
      <div
        className={`flex items-center gap-3 rounded-xl border p-4 ${meta.bg} ${meta.border}`}
      >
        <meta.Icon className={`h-8 w-8 ${meta.text}`} />
        <div>
          <p className={`text-lg font-bold ${meta.text}`}>{meta.label}</p>
          <p className="text-xs text-gray-400">{meta.reason}</p>
        </div>
      </div>

      {/* ── Predicted Price Card ── */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          XGBoost Predicted Fair Value
        </p>
        <p className="mt-1 text-3xl font-extrabold text-emerald-400">
          {formatInr(predicted)}
        </p>
        {depPct !== null && (
          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-400">
            <TrendingDown className="h-3.5 w-3.5 text-red-400" />
            {depPct}% depreciation from launch price
          </p>
        )}
      </div>

      {/* ── Value Ratio (if asking price given) ── */}
      {asking && result.value_ratio !== undefined && (
        <div className="grid grid-cols-3 gap-3">
          <Stat
            label="Asking"
            value={formatInr(asking)}
            sub="Seller price"
          />
          <Stat
            label="Predicted"
            value={formatInr(predicted)}
            sub="Fair value"
          />
          <Stat
            label="Ratio"
            value={(result.value_ratio * 100).toFixed(0) + "%"}
            sub={result.value_ratio >= 1 ? "Over fair" : "Under fair"}
            highlight={result.value_ratio < 0.9}
          />
        </div>
      )}

      {/* ── Bar Chart ── */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Price Comparison
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => [formatInr(v), "Price"]}
            />
            {asking && (
              <ReferenceLine
                y={predicted}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: "Fair Value",
                  fill: "#10b981",
                  fontSize: 10,
                }}
              />
            )}
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Device Summary ── */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Device Summary
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <KV label="Brand" value={result.input.brand} />
          <KV label="Model" value={result.input.model} />
          <KV label="Launch Price" value={formatInr(result.input.launch_price_inr)} />
          <KV label="Age" value={`${result.input.age_years} yr`} />
          <KV label="RAM" value={`${result.input.ram_gb} GB`} />
          <KV label="Storage" value={`${result.input.storage_gb} GB`} />
          <KV label="Battery" value={`${result.input.battery_health_pct}%`} />
          <KV label="Condition" value={result.input.condition} />
          <KV label="Screen Crack" value={result.input.screen_crack} />
          <KV label="Scratches" value={result.input.scratches} />
          <KV label="City" value={result.input.city} />
          <KV label="Seller" value={result.input.seller_type} />
        </div>
      </div>

      {/* ── Sustainability Insight ── */}
      <div className="flex items-start gap-3 rounded-xl border border-emerald-800/30 bg-emerald-950/30 p-4">
        <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
        <div className="text-xs text-gray-300">
          <span className="font-semibold text-emerald-400">
            SecondLife SDG 12.5 Insight:
          </span>{" "}
          Buying this refurbished device at fair value saves an estimated 70 kg
          of CO₂ compared to manufacturing a new phone. Every reuse cycle
          extends the product lifecycle and reduces e-waste.
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-3 text-center">
      <p className="text-[10px] font-semibold uppercase text-gray-500">
        {label}
      </p>
      <p
        className={`text-lg font-bold ${
          highlight ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-[10px] text-gray-500">{sub}</p>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-200">{value}</span>
    </>
  );
}

