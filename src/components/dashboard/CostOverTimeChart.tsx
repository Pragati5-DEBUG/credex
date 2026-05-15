"use client";

import { useMemo, useState } from "react";

type ViewMode = "stacked" | "cumulative";

type Props = {
  dailySeries: number[];
  hasData: boolean;
};

const W = 640;
const H = 220;
const PAD = 16;

export function CostOverTimeChart({ dailySeries, hasData }: Props) {
  const [mode, setMode] = useState<ViewMode>("stacked");

  const series = useMemo(() => {
    if (!hasData || !dailySeries.length) return [];
    if (mode === "stacked") return dailySeries;
    let acc = 0;
    return dailySeries.map((d) => {
      acc += d;
      return acc;
    });
  }, [dailySeries, hasData, mode]);

  const { pathD, fillD, maxY, yTicks } = useMemo(() => {
    if (!series.length) {
      return { pathD: "", fillD: "", maxY: 1, yTicks: [] as number[] };
    }
    const max = Math.max(...series, 1) * 1.08;
    const n = series.length;
    const pts = series.map((v, i) => {
      const x = PAD + (i / Math.max(1, n - 1)) * (W - PAD * 2);
      const y = PAD + (1 - v / max) * (H - PAD * 2);
      return { x, y };
    });
    const line = pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
    const fill = `${line} L ${pts[pts.length - 1]!.x.toFixed(1)} ${H - PAD} L ${pts[0]!.x.toFixed(1)} ${H - PAD} Z`;
    const ticks = [1, 0.66, 0.33, 0].map((t) => max * t);
    return { pathD: line, fillD: fill, maxY: max, yTicks: ticks };
  }, [series]);

  return (
    <section className="rounded-xl border border-white/[0.06] bg-[#0b0b0f] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">Cost over time</h2>
        <div className="flex rounded-lg border border-white/[0.08] p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode("stacked")}
            className={`rounded-md px-3 py-1.5 transition ${
              mode === "stacked"
                ? "bg-violet-600/90 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Stacked
          </button>
          <button
            type="button"
            onClick={() => setMode("cumulative")}
            className={`rounded-md px-3 py-1.5 transition ${
              mode === "cumulative"
                ? "bg-violet-600/90 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Cumulative
          </button>
        </div>
      </div>

      {!hasData || !series.length ? (
        <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/40 text-sm text-zinc-500">
          Complete audit intake to model a 30-day cost curve from your monthly totals.
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full text-violet-400"
            preserveAspectRatio="none"
            role="img"
            aria-label="Cost over time chart"
          >
            <defs>
              <linearGradient id="credexCostFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(139 92 246)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="rgb(139 92 246)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {yTicks.map((tick, i) => {
              const y = PAD + (1 - tick / maxY) * (H - PAD * 2);
              return (
                <g key={`${tick}-${i}`}>
                  <line
                    x1={PAD}
                    y1={y}
                    x2={W - PAD}
                    y2={y}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                  <text x="4" y={y + 4} fill="rgb(113 113 122)" fontSize="10">
                    ${tick.toFixed(0)}
                  </text>
                </g>
              );
            })}
            <path d={fillD} fill="url(#credexCostFill)" />
            <path
              d={pathD}
              fill="none"
              stroke="rgb(167 139 250)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </section>
  );
}
