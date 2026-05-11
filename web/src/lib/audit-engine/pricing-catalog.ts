/**
 * List-price catalog for the audit engine. Every numeric assumption is backed by
 * `PRICING_DATA.md` at the repo root (source IDs).
 */
import type { VendorSlug } from "@/types/audit";

export function normalizePlanLabel(plan: string): string {
  return plan
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

export interface RetailResolve {
  monthlyUsd: number | null;
  sourceId: string;
  matchedDefId: string | null;
}

interface CatalogEntry {
  id: string;
  vendor: VendorSlug;
  sourceId: string;
  /** Higher wins when multiple matchers hit */
  matchPriority: number;
  matchesPlan: (normalizedPlan: string) => boolean;
  /** List-price monthly total for this SKU at `seats`, or null if not applicable */
  listMonthlyTotal: (seats: number, teamSize: number) => number | null;
  /** Can engine recommend moving *to* this SKU */
  eligibleTarget: (seats: number, teamSize: number) => boolean;
}

const always: CatalogEntry["eligibleTarget"] = (seats) => seats >= 1;

const CATALOG: CatalogEntry[] = [
  // --- Cursor (SRC_CURSOR) ---
  {
    id: "cursor_hobby",
    vendor: "cursor",
    sourceId: "SRC_CURSOR",
    matchPriority: 10,
    matchesPlan: (p) => p.includes("hobby"),
    listMonthlyTotal: () => 0,
    eligibleTarget: always,
  },
  {
    id: "cursor_pro_plus",
    vendor: "cursor",
    sourceId: "SRC_CURSOR",
    matchPriority: 90,
    matchesPlan: (p) => p.includes("pro+") || p.includes("pro +"),
    listMonthlyTotal: (seats) => 60 * seats,
    eligibleTarget: always,
  },
  {
    id: "cursor_ultra",
    vendor: "cursor",
    sourceId: "SRC_CURSOR",
    matchPriority: 85,
    matchesPlan: (p) => /\bultra\b/.test(p),
    listMonthlyTotal: (seats) => 200 * seats,
    eligibleTarget: always,
  },
  {
    id: "cursor_pro",
    vendor: "cursor",
    sourceId: "SRC_CURSOR",
    matchPriority: 50,
    matchesPlan: (p) => p.includes("pro") && !p.includes("pro+") && !p.includes("pro +"),
    listMonthlyTotal: (seats) => 20 * seats,
    eligibleTarget: always,
  },
  {
    id: "cursor_business",
    vendor: "cursor",
    sourceId: "SRC_CURSOR",
    matchPriority: 60,
    matchesPlan: (p) => p.includes("business") || p.includes("team"),
    listMonthlyTotal: (seats) => 40 * seats,
    eligibleTarget: always,
  },
  {
    id: "cursor_enterprise",
    vendor: "cursor",
    sourceId: "SRC_CURSOR",
    matchPriority: 40,
    matchesPlan: (p) => p.includes("enterprise"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  // --- GitHub Copilot (SRC_GH_COPILOT) ---
  {
    id: "copilot_individual",
    vendor: "copilot",
    sourceId: "SRC_GH_COPILOT",
    matchPriority: 55,
    matchesPlan: (p) => p.includes("individual"),
    listMonthlyTotal: (seats) => 10 * seats,
    /** Copilot Pro-style listing is aimed at small individual seat counts */
    eligibleTarget: (seats) => seats >= 1 && seats <= 5,
  },
  {
    id: "copilot_business",
    vendor: "copilot",
    sourceId: "SRC_GH_COPILOT",
    matchPriority: 60,
    matchesPlan: (p) => p.includes("business"),
    listMonthlyTotal: (seats) => 19 * seats,
    eligibleTarget: (seats) => seats >= 1,
  },
  {
    id: "copilot_enterprise",
    vendor: "copilot",
    sourceId: "SRC_GH_COPILOT",
    matchPriority: 40,
    matchesPlan: (p) => p.includes("enterprise"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  // --- Claude (SRC_CLAUDE, SRC_CLAUDE_TEAM) ---
  {
    id: "claude_free",
    vendor: "claude",
    sourceId: "SRC_CLAUDE",
    matchPriority: 5,
    matchesPlan: (p) => /\bfree\b/.test(p),
    listMonthlyTotal: () => 0,
    eligibleTarget: always,
  },
  {
    id: "claude_api",
    vendor: "claude",
    sourceId: "SRC_CLAUDE",
    matchPriority: 70,
    matchesPlan: (p) => p.includes("api"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  {
    id: "claude_team",
    vendor: "claude",
    sourceId: "SRC_CLAUDE_TEAM",
    matchPriority: 65,
    matchesPlan: (p) => p.includes("team") && !p.includes("enterprise"),
    listMonthlyTotal: (seats) => (seats >= 5 ? 25 * seats : null),
    eligibleTarget: (seats) => seats >= 5,
  },
  {
    id: "claude_max",
    vendor: "claude",
    sourceId: "SRC_CLAUDE",
    matchPriority: 58,
    matchesPlan: (p) => /\bmax\b/.test(p),
    /** Intake “Max” treated as Max 5× single-workspace list anchor (see PRICING_DATA.md). */
    listMonthlyTotal: () => 100,
    eligibleTarget: always,
  },
  {
    id: "claude_pro",
    vendor: "claude",
    sourceId: "SRC_CLAUDE",
    matchPriority: 50,
    matchesPlan: (p) => p.includes("pro") && !p.includes("max"),
    listMonthlyTotal: (seats) => 20 * Math.max(1, seats),
    eligibleTarget: always,
  },
  {
    id: "claude_enterprise",
    vendor: "claude",
    sourceId: "SRC_CLAUDE",
    matchPriority: 40,
    matchesPlan: (p) => p.includes("enterprise"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  // --- ChatGPT (SRC_OPENAI, SRC_OPENAI_TEAM) ---
  {
    id: "chatgpt_api",
    vendor: "chatgpt",
    sourceId: "SRC_OPENAI",
    matchPriority: 70,
    matchesPlan: (p) => p.includes("api"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  {
    id: "chatgpt_team",
    vendor: "chatgpt",
    sourceId: "SRC_OPENAI_TEAM",
    matchPriority: 60,
    matchesPlan: (p) => p.includes("team") || p.includes("business"),
    listMonthlyTotal: (seats) => (seats >= 2 ? 25 * seats : null),
    eligibleTarget: (seats) => seats >= 2,
  },
  {
    id: "chatgpt_plus",
    vendor: "chatgpt",
    sourceId: "SRC_OPENAI",
    matchPriority: 50,
    matchesPlan: (p) => p.includes("plus"),
    listMonthlyTotal: (seats) => (seats === 1 ? 20 : null),
    eligibleTarget: (seats) => seats === 1,
  },
  {
    id: "chatgpt_enterprise",
    vendor: "chatgpt",
    sourceId: "SRC_OPENAI",
    matchPriority: 40,
    matchesPlan: (p) => p.includes("enterprise"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  // --- API direct vendors ---
  {
    id: "anthropic_api",
    vendor: "anthropic-api",
    sourceId: "SRC_ANTHROPIC_API",
    matchPriority: 10,
    matchesPlan: () => true,
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  {
    id: "openai_api",
    vendor: "openai-api",
    sourceId: "SRC_OPENAI_API",
    matchPriority: 10,
    matchesPlan: () => true,
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  // --- Gemini (SRC_GOOGLE_AI) ---
  {
    id: "gemini_api",
    vendor: "gemini",
    sourceId: "SRC_GOOGLE_AI",
    matchPriority: 70,
    matchesPlan: (p) => p.includes("api"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  {
    id: "gemini_ultra",
    vendor: "gemini",
    sourceId: "SRC_GOOGLE_AI",
    matchPriority: 55,
    matchesPlan: (p) => p.includes("ultra"),
    listMonthlyTotal: (seats) => 250 * Math.max(1, seats),
    eligibleTarget: always,
  },
  {
    id: "gemini_pro",
    vendor: "gemini",
    sourceId: "SRC_GOOGLE_AI",
    matchPriority: 50,
    matchesPlan: (p) => p.includes("pro"),
    listMonthlyTotal: (seats) => 20 * Math.max(1, seats),
    eligibleTarget: always,
  },
  // --- Windsurf (SRC_WINDSURF) ---
  {
    id: "windsurf_ent",
    vendor: "windsurf",
    sourceId: "SRC_WINDSURF",
    matchPriority: 40,
    matchesPlan: (p) => p.includes("enterprise"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  {
    id: "windsurf_team",
    vendor: "windsurf",
    sourceId: "SRC_WINDSURF",
    matchPriority: 55,
    matchesPlan: (p) => p.includes("team"),
    listMonthlyTotal: (seats) => 60 * seats,
    eligibleTarget: always,
  },
  {
    id: "windsurf_pro",
    vendor: "windsurf",
    sourceId: "SRC_WINDSURF",
    matchPriority: 50,
    matchesPlan: (p) =>
      p.includes("individual") || p.includes("pro") || p.includes("not sure"),
    listMonthlyTotal: (seats) => 15 * seats,
    eligibleTarget: always,
  },
  // --- v0 (SRC_V0) ---
  {
    id: "v0_ent",
    vendor: "v0",
    sourceId: "SRC_V0",
    matchPriority: 40,
    matchesPlan: (p) => p.includes("enterprise"),
    listMonthlyTotal: () => null,
    eligibleTarget: () => false,
  },
  {
    id: "v0_team",
    vendor: "v0",
    sourceId: "SRC_V0",
    matchPriority: 55,
    matchesPlan: (p) => p.includes("team"),
    listMonthlyTotal: (seats) => 30 * seats,
    eligibleTarget: always,
  },
  {
    id: "v0_pro",
    vendor: "v0",
    sourceId: "SRC_V0",
    matchPriority: 50,
    matchesPlan: (p) =>
      p.includes("individual") || p.includes("pro") || p.includes("not sure"),
    listMonthlyTotal: (seats) => 20 * Math.max(1, seats),
    eligibleTarget: (seats) => seats >= 1,
  },
];

function catalogForVendor(vendor: VendorSlug): CatalogEntry[] {
  return CATALOG.filter((c) => c.vendor === vendor).sort((a, b) => b.matchPriority - a.matchPriority);
}

export function resolveRetailForPlan(
  vendor: VendorSlug,
  planDisplay: string,
  seats: number,
  teamSize: number,
): RetailResolve {
  const normalized = normalizePlanLabel(planDisplay);
  const rows = catalogForVendor(vendor);
  for (const row of rows) {
    if (!row.matchesPlan(normalized)) continue;
    const monthlyUsd = row.listMonthlyTotal(seats, teamSize);
    if (monthlyUsd === null) continue;
    return { monthlyUsd, sourceId: row.sourceId, matchedDefId: row.id };
  }
  return { monthlyUsd: null, sourceId: "NONE", matchedDefId: null };
}

export interface TargetPlanOption {
  defId: string;
  vendor: VendorSlug;
  sourceId: string;
  label: string;
  monthlyUsd: number;
}

function humanLabel(defId: string): string {
  const map: Record<string, string> = {
    cursor_hobby: "Cursor Hobby (free)",
    cursor_pro: "Cursor Pro (list)",
    cursor_pro_plus: "Cursor Pro+ (list)",
    cursor_ultra: "Cursor Ultra (list)",
    cursor_business: "Cursor Business / Teams (list)",
    copilot_individual: "GitHub Copilot Pro-style ($10/user list)",
    copilot_business: "GitHub Copilot Business ($19/user list)",
    claude_free: "Claude Free",
    claude_pro: "Claude Pro (list)",
    claude_max: "Claude Max 5× (list anchor)",
    claude_team: "Claude Team standard seat (list, 5+ seats)",
    chatgpt_plus: "ChatGPT Plus (list)",
    chatgpt_team: "ChatGPT Business seat (list, 2+ seats)",
    gemini_pro: "Google AI Pro / Gemini (list anchor)",
    gemini_ultra: "Google AI Ultra (list anchor)",
    windsurf_pro: "Windsurf Pro (list anchor)",
    windsurf_team: "Windsurf Team (list anchor)",
    v0_pro: "v0 Pro (list anchor)",
    v0_team: "v0 Team (list anchor)",
  };
  return map[defId] ?? defId;
}

/** All list-priced downgrade / switch targets for a vendor at this seat count */
export function listTargetPlansForVendor(
  vendor: VendorSlug,
  seats: number,
  teamSize: number,
  excludeDefId: string | null,
): TargetPlanOption[] {
  const out: TargetPlanOption[] = [];
  for (const row of CATALOG) {
    if (row.vendor !== vendor) continue;
    if (excludeDefId && row.id === excludeDefId) continue;
    if (!row.eligibleTarget(seats, teamSize)) continue;
    const monthlyUsd = row.listMonthlyTotal(seats, teamSize);
    if (monthlyUsd === null || !Number.isFinite(monthlyUsd)) continue;
    out.push({
      defId: row.id,
      vendor,
      sourceId: row.sourceId,
      label: humanLabel(row.id),
      monthlyUsd,
    });
  }
  return out;
}

/** Minimum positive list total for any eligible SKU on this vendor (for cross-vendor floor) */
export function minListedMonthlyAcrossVendor(
  vendor: VendorSlug,
  seats: number,
  teamSize: number,
): { monthlyUsd: number; defId: string; sourceId: string } | null {
  const opts = listTargetPlansForVendor(vendor, seats, teamSize, null).filter((o) => o.monthlyUsd > 0);
  if (!opts.length) return null;
  let best = opts[0]!;
  for (const o of opts) {
    if (o.monthlyUsd < best.monthlyUsd) best = o;
  }
  return { monthlyUsd: best.monthlyUsd, defId: best.defId, sourceId: best.sourceId };
}
