import type { PublicAuditSnapshot } from "@/lib/public-audit-snapshot";

function fmtUsd(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}

/** Deterministic ~100-word executive readout from public snapshot fields. */
export function buildTemplateAuditSummary(s: PublicAuditSnapshot): string {
  const after = Math.max(0, s.combinedMonthlyUsd - s.savingsMonthlyUsd);
  const band =
    s.savingsBand === "high"
      ? "high"
      : s.savingsBand === "moderate"
        ? "moderate"
        : "low";
  const top = s.lines
    .filter((l) => l.savingsMonthlyUsd > 0)
    .sort((a, b) => b.savingsMonthlyUsd - a.savingsMonthlyUsd)
    .slice(0, 2);
  const topPhrase =
    top.length === 0
      ? "No single line item shows material modeled savings in this pass."
      : top.length === 1
        ? `The largest modeled opportunity is ${top[0]!.vendorLabel} (${fmtUsd(top[0]!.savingsMonthlyUsd)}/mo).`
        : `Largest modeled moves are ${top[0]!.vendorLabel} (${fmtUsd(top[0]!.savingsMonthlyUsd)}/mo) and ${top[1]!.vendorLabel} (${fmtUsd(top[1]!.savingsMonthlyUsd)}/mo).`;
  return (
    `This snapshot models roughly ${fmtUsd(s.combinedMonthlyUsd)}/mo in current stack spend, with about ${fmtUsd(s.savingsMonthlyUsd)}/mo in potential savings ` +
    `(${fmtUsd(s.savingsAnnualUsd)}/yr annualized), leaving an “after” envelope near ${fmtUsd(after)}/mo. The savings band reads as ${band} relative to documented list anchors. ` +
    `${topPhrase} ` +
    `These figures come from rule-based pricing math and documented list anchors. Use the per-line actions as a checklist: re-seat, re-tier, or compare cross-vendor floors where shown. ` +
    `If you want a human pass on credits or enterprise quotes, follow up after you have this snapshot in hand.`
  );
}
