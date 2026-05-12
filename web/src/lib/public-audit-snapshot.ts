import type { AuditResult } from "@/types/audit";

/** Stored in Supabase and shown on `/r/[id]` — no email, company, or free-form user notes. */
export type PublicAuditSnapshot = {
  v: 1;
  combinedMonthlyUsd: number;
  savingsMonthlyUsd: number;
  savingsAnnualUsd: number;
  savingsBand: AuditResult["savingsBand"];
  lines: Array<{
    vendorLabel: string;
    planLabel: string;
    currentMonthlyUsd: number;
    savingsMonthlyUsd: number;
    actionShort: string;
    reasonShort: string;
  }>;
  generatedAt: string;
};

const MAX_ACTION = 220;
const MAX_REASON = 180;
const MAX_LINES = 40;

function clip(s: string, max: number): string {
  const t = s.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function buildPublicSnapshot(audit: AuditResult, generatedAt = new Date().toISOString()): PublicAuditSnapshot {
  const lines = audit.lines.slice(0, MAX_LINES).map((l) => ({
    vendorLabel: l.vendorLabel,
    planLabel: l.planLabel,
    currentMonthlyUsd: l.currentMonthlyUsd,
    savingsMonthlyUsd: l.estimatedMonthlySavingsUsd,
    actionShort: clip(l.recommendedAction, MAX_ACTION),
    reasonShort: clip(l.reasonOneLiner, MAX_REASON),
  }));
  return {
    v: 1,
    combinedMonthlyUsd: audit.combinedCurrentMonthlyUsd,
    savingsMonthlyUsd: audit.totalMonthlySavingsUsd,
    savingsAnnualUsd: audit.totalAnnualSavingsUsd,
    savingsBand: audit.savingsBand,
    lines,
    generatedAt,
  };
}

export function isPublicAuditSnapshot(x: unknown): x is PublicAuditSnapshot {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (o.v !== 1) return false;
  for (const k of ["combinedMonthlyUsd", "savingsMonthlyUsd", "savingsAnnualUsd"] as const) {
    if (typeof o[k] !== "number" || !Number.isFinite(o[k])) return false;
  }
  if (o.savingsBand !== "high" && o.savingsBand !== "moderate" && o.savingsBand !== "low") return false;
  if (typeof o.generatedAt !== "string") return false;
  if (!Array.isArray(o.lines) || o.lines.length > MAX_LINES) return false;
  for (const row of o.lines) {
    if (!row || typeof row !== "object") return false;
    const r = row as Record<string, unknown>;
    if (typeof r.vendorLabel !== "string" || typeof r.planLabel !== "string") return false;
    if (typeof r.currentMonthlyUsd !== "number" || typeof r.savingsMonthlyUsd !== "number") return false;
    if (typeof r.actionShort !== "string" || typeof r.reasonShort !== "string") return false;
  }
  return true;
}
