import type {
  AuditResult,
  AuditSpendFormPayload,
  AuditSavingsLine,
  PrimaryUseCase,
  VendorSlug,
} from "@/types/audit";
import { VENDOR_LABELS } from "@/lib/audit-intake-config";
import {
  listTargetPlansForVendor,
  normalizePlanLabel,
  resolveRetailForPlan,
} from "./pricing-catalog";
import { crossVendorFloors } from "./cross-vendor";

export const MIN_MATERIAL_MONTHLY_SAVINGS_USD = 5;

function parseSpendUsd(raw: string): number {
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function parseTeamSize(payload: AuditSpendFormPayload): number {
  const n = parseInt(String(payload.teamSize).trim(), 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

type Candidate = {
  kind: "same_vendor" | "cross_vendor";
  targetMonthlyUsd: number;
  action: string;
  reason: string;
};

function pickBestCandidate(
  currentMonthly: number,
  sameVendor: Candidate[],
  crossVendor: Candidate[],
): Candidate | null {
  const all = [...sameVendor, ...crossVendor].filter(
    (c) => currentMonthly - c.targetMonthlyUsd >= MIN_MATERIAL_MONTHLY_SAVINGS_USD,
  );
  if (!all.length) return null;
  all.sort((a, b) => {
    const sa = currentMonthly - a.targetMonthlyUsd;
    const sb = currentMonthly - b.targetMonthlyUsd;
    if (sb !== sa) return sb - sa;
    if (a.kind !== b.kind) return a.kind === "same_vendor" ? -1 : 1;
    return a.targetMonthlyUsd - b.targetMonthlyUsd;
  });
  return all[0] ?? null;
}

function savingsBand(total: number): AuditResult["savingsBand"] {
  if (total >= 500) return "high";
  if (total < 100) return "low";
  return "moderate";
}

export function runAudit(payload: AuditSpendFormPayload): AuditResult {
  const teamSize = parseTeamSize(payload);
  const useCase: PrimaryUseCase | "" = payload.primaryUseCase || "";
  const lines: AuditSavingsLine[] = [];
  let combinedCurrent = 0;

  payload.tools.forEach((tool, index) => {
    const vendor = tool.vendorSlug as VendorSlug;
    const toolId = `tool-${index}`;
    const planNorm = normalizePlanLabel(tool.plan ?? "");
    const seats = parseInt(String(tool.seats).trim(), 10);
    const current = parseSpendUsd(tool.monthlySpend ?? "");

    if (!vendor || !Number.isFinite(seats) || seats < 1 || !Number.isFinite(current) || current <= 0) {
      return;
    }

    combinedCurrent += current;
    const vendorLabel = VENDOR_LABELS[vendor] ?? vendor;
    const planLabel = tool.plan?.trim() || "—";

    const retail = resolveRetailForPlan(vendor, tool.plan ?? "", seats, teamSize);
    const excludeId = retail.matchedDefId;

    const sameVendor: Candidate[] = [];
    if (
      retail.monthlyUsd !== null &&
      current - retail.monthlyUsd >= MIN_MATERIAL_MONTHLY_SAVINGS_USD
    ) {
      sameVendor.push({
        kind: "same_vendor",
        targetMonthlyUsd: retail.monthlyUsd,
        action: `Align to published list for ${planLabel} (~$${retail.monthlyUsd.toFixed(0)}/mo at ${seats} seat(s)).`,
        reason: `Reported spend is above the cited public list for this SKU (${retail.sourceId})—check annual vs monthly billing, add-ons, or duplicate seats.`,
      });
    }

    const sameTargets = listTargetPlansForVendor(vendor, seats, teamSize, excludeId);
    for (const t of sameTargets) {
      if (t.monthlyUsd === 0 && current >= 15) continue;
      if (t.monthlyUsd >= current - MIN_MATERIAL_MONTHLY_SAVINGS_USD) continue;
      if (retail.monthlyUsd !== null && t.monthlyUsd > retail.monthlyUsd + 0.01) continue;
      sameVendor.push({
        kind: "same_vendor",
        targetMonthlyUsd: t.monthlyUsd,
        action: `Move to ${t.label} (~$${t.monthlyUsd.toFixed(0)}/mo at list for your seats).`,
        reason:
          retail.monthlyUsd !== null
            ? `Published list for your current tier is ~$${retail.monthlyUsd.toFixed(0)}/mo; ${t.label} totals ~$${t.monthlyUsd.toFixed(0)}/mo before discounts or overages (${retail.sourceId}).`
            : `No reliable public list price for your current SKU; ${t.label} still undercuts what you entered by ~$${(current - t.monthlyUsd).toFixed(0)}/mo at list (${t.sourceId}).`,
      });
    }

    const cross = crossVendorFloors(useCase, vendor, seats, teamSize);
    const crossVendor: Candidate[] = cross
      .filter((c) => c.monthlyUsd < current - MIN_MATERIAL_MONTHLY_SAVINGS_USD)
      .map((c) => ({
        kind: "cross_vendor" as const,
        targetMonthlyUsd: c.monthlyUsd,
        action: `Evaluate ${VENDOR_LABELS[c.vendor] ?? c.vendor} (~$${c.monthlyUsd.toFixed(0)}/mo list floor for your seats).`,
        reason: c.reasonOneLiner,
      }));

    const best = pickBestCandidate(current, sameVendor, crossVendor);
    if (!best) {
      const atOrBelowList =
        retail.monthlyUsd !== null && current <= retail.monthlyUsd + 0.01;
      let action: string;
      let reason: string;
      if (atOrBelowList) {
        action = "No material cheaper option found at published list prices for your seats.";
        reason =
          "You’re at or under public list for this row; further optimizations need usage, contracts, or reseller context.";
      } else if (retail.monthlyUsd === null) {
        action =
          "No fixed monthly list benchmark for this SKU (often Enterprise, API/usage, or unmatched plan text).";
        reason =
          "We don’t model savings without a cited list anchor—see PRICING_DATA.md for what we can price.";
      } else {
        action =
          "No cheaper eligible SKU at list prices without breaking our seat/plan rules—or spend is already tight vs list.";
        reason =
          "Downgrade targets must cost less than both your entered spend and your current list anchor when one exists.";
      }
      lines.push({
        toolId,
        vendorSlug: vendor,
        vendorLabel,
        planLabel,
        currentMonthlyUsd: current,
        recommendedAction: action,
        estimatedMonthlySavingsUsd: 0,
        reasonOneLiner: reason,
      });
      return;
    }

    const savings = current - best.targetMonthlyUsd;
    lines.push({
      toolId,
      vendorSlug: vendor,
      vendorLabel,
      planLabel,
      currentMonthlyUsd: current,
      recommendedAction: best.action,
      estimatedMonthlySavingsUsd: Math.max(0, savings),
      reasonOneLiner: best.reason,
    });
  });

  const totalMonthlySavingsUsd = lines.reduce((s, l) => s + l.estimatedMonthlySavingsUsd, 0);
  return {
    lines,
    totalMonthlySavingsUsd,
    totalAnnualSavingsUsd: totalMonthlySavingsUsd * 12,
    combinedCurrentMonthlyUsd: combinedCurrent,
    savingsBand: savingsBand(totalMonthlySavingsUsd),
  };
}
