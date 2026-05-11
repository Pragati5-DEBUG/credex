import type { AuditResult, AuditSavingsLine, AuditSpendFormPayload } from "@/types/audit";
import { VENDOR_LABELS } from "@/lib/audit-intake-config";
import type { VendorSlug } from "@/types/audit";

export type InsightPriority = "high" | "medium" | "low";
export type InsightEffort = "low" | "medium" | "high";

export interface DashboardInsight {
  id: string;
  title: string;
  priority: InsightPriority;
  context: string;
  recommendation: string;
  saveMonthly: number;
  savePct: number;
  impact: InsightPriority;
  effort: InsightEffort;
}

function parseSpend(s: string): number {
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Smooth daily curve that sums to `monthlyTotal` (30-day window as proxy). */
export function buildCostOverTimeSeries(monthlyTotal: number, days = 30): number[] {
  if (monthlyTotal <= 0) return Array.from({ length: days }, () => 0);
  const raw = Array.from({ length: days }, (_, i) => {
    const t = (i / Math.max(1, days - 1)) * Math.PI * 2;
    return 1 + 0.38 * Math.sin(t * 1.4) + 0.12 * Math.sin(t * 4.1);
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => (v / sum) * monthlyTotal);
}

export function cumulativeSeries(daily: number[]): number[] {
  let acc = 0;
  return daily.map((d) => {
    acc += d;
    return acc;
  });
}

export function topVendorLabelFromPayload(payload: AuditSpendFormPayload | null): string {
  if (!payload?.tools?.length) return "—";
  let best: { slug: VendorSlug; spend: number } | null = null;
  for (const t of payload.tools) {
    const slug = t.vendorSlug as VendorSlug;
    const spend = parseSpend(t.monthlySpend ?? "");
    if (!slug || spend <= 0) continue;
    if (!best || spend > best.spend) best = { slug, spend };
  }
  return best ? VENDOR_LABELS[best.slug] ?? best.slug : "—";
}

function savingsPriority(s: number): InsightPriority {
  if (s >= 120) return "high";
  if (s >= 30) return "medium";
  return "low";
}

function effortFromLine(line: AuditSavingsLine): InsightEffort {
  const a = line.recommendedAction.toLowerCase();
  if (a.includes("evaluate") || a.includes("github copilot") || a.includes("windsurf")) {
    return "medium";
  }
  if (a.includes("align")) return "low";
  if (a.includes("move to")) return "low";
  return "medium";
}

function titleFromLine(line: AuditSavingsLine): string {
  if (line.estimatedMonthlySavingsUsd <= 0) {
    return `Review ${line.vendorLabel} (${line.planLabel})`;
  }
  if (line.recommendedAction.length <= 72) return line.recommendedAction;
  return `${line.recommendedAction.slice(0, 69)}…`;
}

export function buildDashboardInsights(audit: AuditResult | null): DashboardInsight[] {
  if (!audit?.lines.length) return [];
  return audit.lines.map((line) => {
    const savePct =
      line.currentMonthlyUsd > 0
        ? Math.round((line.estimatedMonthlySavingsUsd / line.currentMonthlyUsd) * 100)
        : 0;
    const priority = savingsPriority(line.estimatedMonthlySavingsUsd);
    const impact =
      line.estimatedMonthlySavingsUsd >= 150 || savePct >= 45
        ? "high"
        : line.estimatedMonthlySavingsUsd >= 40 || savePct >= 20
          ? "medium"
          : ("low" as InsightPriority);
    return {
      id: line.toolId,
      title: titleFromLine(line),
      priority: line.estimatedMonthlySavingsUsd > 0 ? priority : "low",
      context:
        line.estimatedMonthlySavingsUsd > 0
          ? `You model ~$${line.currentMonthlyUsd.toFixed(0)}/mo on ${line.vendorLabel} (${line.planLabel}). ${line.reasonOneLiner}`
          : `~$${line.currentMonthlyUsd.toFixed(0)}/mo on ${line.vendorLabel} — ${line.reasonOneLiner}`,
      recommendation: line.recommendedAction,
      saveMonthly: line.estimatedMonthlySavingsUsd,
      savePct,
      impact,
      effort: effortFromLine(line),
    };
  });
}

export function countInsightsByPriority(insights: DashboardInsight[]): {
  high: number;
  medium: number;
  low: number;
} {
  return insights.reduce(
    (acc, i) => {
      if (i.saveMonthly <= 0) {
        acc.low += 1;
        return acc;
      }
      if (i.priority === "high") acc.high += 1;
      else if (i.priority === "medium") acc.medium += 1;
      else acc.low += 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 },
  );
}
