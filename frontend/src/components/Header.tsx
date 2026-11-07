"use client";

import { useEffect, useState } from "react";
import { Leaf, Wifi, WifiOff } from "lucide-react";
import { checkHealth } from "@/lib/api";

export default function Header() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      const ok = await checkHealth();
      if (mounted) setOnline(ok);
    };
    poll();
    const id = setInterval(poll, 15_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-800/30 bg-gray-950/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/25">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              SecondLife
            </h1>
            <p className="text-[11px] font-medium leading-none text-emerald-400">
              Smartphone Circular Economy
            </p>
          </div>
        </div>

        {/* SDG 12.5 Badge + Status */}
        <div className="flex items-center gap-4">
          <span className="hidden rounded-full border border-emerald-700/50 bg-emerald-900/40 px-3 py-1 text-xs font-semibold text-emerald-300 sm:inline-flex">
            🎯 UN SDG 12.5 — Reduce, Reuse, Recycle
          </span>
          <div
            className="flex items-center gap-1.5 text-xs font-medium"
            title={
              online === null
                ? "Checking API…"
                : online
                ? "FastAPI backend connected"
                : "Backend unreachable"
            }
          >
            {online === null ? (
              <Wifi className="h-4 w-4 animate-pulse text-yellow-400" />
            ) : online ? (
              <Wifi className="h-4 w-4 text-emerald-400" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-400" />
            )}
            <span
              className={
                online === null
                  ? "text-yellow-400"
                  : online
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            >
              {online === null ? "Checking…" : online ? "API Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

