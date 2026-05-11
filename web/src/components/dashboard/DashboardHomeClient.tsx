"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  buildCostOverTimeSeries,
  buildDashboardInsights,
  countInsightsByPriority,
  topVendorLabelFromPayload,
} from "@/lib/dashboard-from-audit";
import { CostOverTimeChart } from "./CostOverTimeChart";
import { useDashboardAudit } from "./use-dashboard-audit";

export function DashboardHomeClient() {
  const { demo, payload, audit, hasStack } = useDashboardAudit();

  const totalSpend = audit?.combinedCurrentMonthlyUsd ?? 0;
  const dailyAvg = totalSpend > 0 ? totalSpend / 30 : 0;
  const topVendor = topVendorLabelFromPayload(payload);
  const dailySeries = useMemo(() => buildCostOverTimeSeries(totalSpend, 30), [totalSpend]);
  const insights = useMemo(() => buildDashboardInsights(audit), [audit]);
  const savings = audit?.totalMonthlySavingsUsd ?? 0;
  const insightCount = insights.filter((i) => i.saveMonthly > 0).length || insights.length;
  const pri = countInsightsByPriority(insights);

  const exampleBanner = !hasStack || demo;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#06060a]/90 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-2 text-zinc-500">
          <span className="rounded border border-white/10 p-1.5 text-xs" aria-hidden>
            ☰
          </span>
          <span className="text-sm text-zinc-400">Overview</span>
        </div>
        <div className="flex rounded-lg border border-white/[0.08] p-0.5 text-xs font-semibold">
          {(["7d", "30d", "Custom"] as const).map((r) => (
            <button
              key={r}
              type="button"
              className={`rounded-md px-3 py-1.5 ${
                r === "30d"
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-auto px-6 py-6">
        {exampleBanner ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-4 py-3 text-sm text-amber-100/90">
            <p>
              {demo
                ? "You're viewing example data. Add a real integration later for live AI spend."
                : "No saved intake in this browser yet — chart uses zeros. Run the audit form or open demo."}
            </p>
            <Link
              href={demo ? "/audit?demo=1" : "/audit"}
              className="shrink-0 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-50 ring-1 ring-amber-500/30 hover:bg-amber-500/30"
            >
              {demo ? "View demo intake" : "Add stack →"}
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-violet-500/[0.04] px-4 py-3 text-sm text-zinc-400">
            Curve is a <span className="text-zinc-200">30-day projection</span> from your declared
            monthly totals (not live API usage yet).
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <KpiCard
            icon="$"
            label="Total spend (modeled)"
            value={totalSpend > 0 ? `$${totalSpend.toFixed(2)}` : "—"}
            sub="Monthly roll-up from intake"
          />
          <KpiCard
            icon="〜"
            label="Daily average"
            value={totalSpend > 0 ? `$${dailyAvg.toFixed(2)}` : "—"}
            sub="Spend ÷ 30 (proxy window)"
          />
          <KpiCard
            icon="◇"
            label="Top vendor"
            value={topVendor}
            sub="Highest declared line"
          />
        </div>

        <Link
          href={demo ? "/dashboard/insights?demo=1" : "/dashboard/insights"}
          className="flex items-center justify-between rounded-xl border border-sky-500/20 bg-sky-500/[0.06] px-4 py-3 text-sm text-sky-100/90 transition hover:border-sky-500/35"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg" aria-hidden>
              💡
            </span>
            <span>
              <span className="font-semibold text-white">{insightCount} insights</span>
              {savings > 0 ? (
                <>
                  {" "}
                  — save ~${savings.toFixed(0)}/mo
                </>
              ) : (
                <> — tune intake for opportunities</>
              )}
            </span>
          </span>
          <span className="text-sky-300/80" aria-hidden>
            →
          </span>
        </Link>
        {(pri.high > 0 || pri.medium > 0 || pri.low > 0) && (
          <p className="text-xs text-zinc-600">
            Priority mix:{" "}
            <span className="text-red-400/90">{pri.high} high</span> ·{" "}
            <span className="text-amber-400/90">{pri.medium} medium</span> ·{" "}
            <span className="text-zinc-500">{pri.low} low</span>
          </p>
        )}

        <CostOverTimeChart dailySeries={dailySeries} hasData={hasStack && totalSpend > 0} />
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0b0b0f] p-4">
      <div className="mb-3 flex items-center justify-between text-zinc-600">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</span>
        <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-xs text-violet-300/90">
          {icon}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-600">{sub}</p>
    </div>
  );
}
