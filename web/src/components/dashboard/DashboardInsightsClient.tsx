"use client";

import Link from "next/link";
import { useMemo } from "react";
import { buildDashboardInsights, countInsightsByPriority } from "@/lib/dashboard-from-audit";
import { useDashboardAudit } from "./use-dashboard-audit";

function badgeClass(p: "high" | "medium" | "low") {
  if (p === "high") return "bg-red-500/20 text-red-300 ring-red-500/30";
  if (p === "medium") return "bg-amber-500/15 text-amber-200 ring-amber-500/25";
  return "bg-zinc-500/15 text-zinc-400 ring-zinc-500/20";
}

function effortClass(e: "low" | "medium" | "high") {
  if (e === "low") return "text-emerald-400";
  if (e === "medium") return "text-amber-400";
  return "text-orange-400";
}

export function DashboardInsightsClient() {
  const { demo, audit, hasStack } = useDashboardAudit();
  const dashHref = demo ? "/dashboard?demo=1" : "/dashboard";
  const insights = useMemo(() => buildDashboardInsights(audit), [audit]);
  const savings = audit?.totalMonthlySavingsUsd ?? 0;
  const pri = countInsightsByPriority(insights);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-white/[0.06] px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Insights</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {hasStack
                ? `${insights.length} optimization row(s) from your saved stack`
                : "Complete intake to generate optimization rows"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              <span className={`rounded-full px-2.5 py-1 ring-1 ${badgeClass("high")}`}>
                {pri.high} high
              </span>
              <span className={`rounded-full px-2.5 py-1 ring-1 ${badgeClass("medium")}`}>
                {pri.medium} medium
              </span>
              <span className={`rounded-full px-2.5 py-1 ring-1 ${badgeClass("low")}`}>
                {pri.low} low
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 px-5 py-4 text-right">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-violet-300/80">
              Potential savings
            </p>
            <p className="mt-1 text-2xl font-bold text-white">
              ~${savings.toFixed(0)}
              <span className="text-base font-semibold text-zinc-500">/mo</span>
            </p>
            {demo ? (
              <p className="mt-1 text-[0.65rem] text-violet-300/60">Demo stack</p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-auto px-6 py-6">
        {!hasStack ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-black/30 p-8 text-center text-sm text-zinc-500">
            No stack in local storage.{" "}
            <Link href="/audit" className="text-violet-400 hover:underline">
              Run audit intake
            </Link>{" "}
            or{" "}
            <Link href="/dashboard/insights?demo=1" className="text-violet-400 hover:underline">
              view demo
            </Link>
            .
          </div>
        ) : (
          insights.map((ins) => (
            <article
              key={ins.id}
              className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0b0f]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.04] px-5 py-4">
                <h2 className="flex items-start gap-2 pr-16 text-base font-semibold leading-snug text-white">
                  <span className="mt-0.5 text-violet-400" aria-hidden>
                    ↓
                  </span>
                  {ins.title}
                </h2>
                <span
                  className={`absolute right-4 top-4 rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ring-1 ${badgeClass(ins.priority)}`}
                >
                  {ins.priority}
                </span>
              </div>
              <div className="space-y-3 px-5 py-4">
                <p className="text-sm leading-relaxed text-zinc-400">{ins.context}</p>
                <div className="rounded-lg border border-white/[0.05] bg-black/35 px-4 py-3 text-sm text-zinc-300">
                  {ins.recommendation}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.04] pt-3 text-xs font-medium">
                  {ins.saveMonthly > 0 ? (
                    <p className="text-zinc-300">
                      Save ~<span className="text-emerald-400">${ins.saveMonthly.toFixed(0)}/mo</span>{" "}
                      <span className="text-zinc-600">({ins.savePct}%)</span>
                    </p>
                  ) : (
                    <p className="text-zinc-500">No modeled $ savings on this row</p>
                  )}
                  <p className="text-zinc-500">
                    Impact:{" "}
                    <span className={ins.impact === "high" ? "text-red-400" : "text-zinc-300"}>
                      {ins.impact.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-zinc-500">
                    Effort:{" "}
                    <span className={effortClass(ins.effort)}>{ins.effort.toUpperCase()}</span>
                  </p>
                </div>
              </div>
            </article>
          ))
        )}

        <p className="text-center text-xs text-zinc-600">
          <Link href={dashHref} className="text-violet-400 hover:underline">
            ← Dashboard
          </Link>
          {" · "}
          <Link href="/audit/summary" className="hover:text-zinc-400">
            Audit summary
          </Link>
        </p>
      </div>
    </div>
  );
}
