"use client";

import type { EvaluationResult } from "@/types/phone";
import { Trash2, GitCompareArrows, X } from "lucide-react";
import { useState } from "react";

function formatInr(n: number): string {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

interface Props {
  evaluations: EvaluationResult[];
  onClear: () => void;
  onRemove: (id: string) => void;
}

export default function ComparisonTable({
  evaluations,
  onClear,
  onRemove,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });

  const compared = evaluations.filter((e) => selected.has(e.id));

  const rows: { label: string; getValue: (e: EvaluationResult) => string }[] = [
    { label: "Brand", getValue: (e) => e.input.brand },
    { label: "Model", getValue: (e) => e.input.model },
    { label: "Launch Price", getValue: (e) => formatInr(e.input.launch_price_inr) },
    { label: "Age", getValue: (e) => `${e.input.age_years} yr` },
    { label: "RAM", getValue: (e) => `${e.input.ram_gb} GB` },
    { label: "Storage", getValue: (e) => `${e.input.storage_gb} GB` },
    { label: "Battery", getValue: (e) => `${e.input.battery_health_pct}%` },
    { label: "Condition", getValue: (e) => e.input.condition },
    { label: "Screen Crack", getValue: (e) => e.input.screen_crack },
    { label: "Scratches", getValue: (e) => e.input.scratches },
    {
      label: "Predicted Value",
      getValue: (e) => formatInr(e.prediction.predicted_resale_price_inr),
    },
    {
      label: "Asking Price",
      getValue: (e) => (e.asking_price ? formatInr(e.asking_price) : "—"),
    },
    { label: "Decision", getValue: (e) => e.decision ?? "—" },
  ];

  if (evaluations.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-white">
          Recent Evaluations ({evaluations.length})
        </h2>
        <div className="flex gap-2">
          {selected.size >= 2 && (
            <button
              onClick={() => setShowCompare(true)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-600/40 bg-emerald-900/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/50 transition"
            >
              <GitCompareArrows className="h-3.5 w-3.5" />
              Compare ({selected.size})
            </button>
          )}
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-lg border border-red-600/40 bg-red-900/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/50 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All
          </button>
        </div>
      </div>

      {/* ── Evaluation Cards ── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {evaluations.map((ev) => (
          <div
            key={ev.id}
            onClick={() => toggle(ev.id)}
            className={`relative cursor-pointer rounded-xl border p-4 transition ${
              selected.has(ev.id)
                ? "border-emerald-500 bg-emerald-900/20"
                : "border-gray-700/50 bg-gray-800/40 hover:border-gray-600"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(ev.id);
              }}
              className="absolute right-2 top-2 rounded p-1 text-gray-600 hover:text-red-400 transition"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <p className="text-sm font-bold text-white">
              {ev.input.brand} {ev.input.model}
            </p>
            <p className="mt-1 text-lg font-bold text-emerald-400">
              {formatInr(ev.prediction.predicted_resale_price_inr)}
            </p>
            {ev.decision && (
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  ev.decision === "Buy"
                    ? "bg-emerald-900/40 text-emerald-400"
                    : ev.decision === "Negotiate"
                    ? "bg-amber-900/40 text-amber-400"
                    : "bg-red-900/40 text-red-400"
                }`}
              >
                {ev.decision}
              </span>
            )}
            <p className="mt-1 text-[10px] text-gray-500">
              {new Date(ev.timestamp).toLocaleString()}
            </p>
            {selected.has(ev.id) && (
              <div className="absolute left-2 top-2 h-4 w-4 rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center">
                ✓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Side-by-Side Comparison Modal ── */}
      {showCompare && compared.length >= 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[85vh] w-full max-w-4xl overflow-auto rounded-2xl border border-gray-700 bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Side-by-Side Comparison
              </h3>
              <button
                onClick={() => setShowCompare(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 pr-4 text-left font-semibold text-gray-500">
                      Attribute
                    </th>
                    {compared.map((ev) => (
                      <th
                        key={ev.id}
                        className="py-2 px-3 text-left font-semibold text-emerald-400"
                      >
                        {ev.input.brand} {ev.input.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-gray-800/50"
                    >
                      <td className="py-2 pr-4 font-medium text-gray-400">
                        {row.label}
                      </td>
                      {compared.map((ev) => (
                        <td
                          key={ev.id}
                          className="py-2 px-3 text-gray-200"
                        >
                          {row.getValue(ev)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

