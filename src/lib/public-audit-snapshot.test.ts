import { describe, expect, it } from "vitest";
import { buildPublicSnapshot, isPublicAuditSnapshot } from "./public-audit-snapshot";
import type { AuditResult } from "@/types/audit";

const sample: AuditResult = {
  lines: [
    {
      toolId: "t1",
      vendorSlug: "cursor",
      vendorLabel: "Cursor",
      planLabel: "Pro",
      currentMonthlyUsd: 40,
      recommendedAction: "Down-tier or annualize where it fits your seat policy.",
      estimatedMonthlySavingsUsd: 10,
      reasonOneLiner: "List anchor vs your entered spend.",
    },
  ],
  totalMonthlySavingsUsd: 10,
  totalAnnualSavingsUsd: 120,
  combinedCurrentMonthlyUsd: 40,
  savingsBand: "low",
};

describe("buildPublicSnapshot", () => {
  it("maps audit lines without PII fields", () => {
    const s = buildPublicSnapshot(sample, "2026-01-01T00:00:00.000Z");
    expect(s.v).toBe(1);
    expect(s.combinedMonthlyUsd).toBe(40);
    expect(s.savingsMonthlyUsd).toBe(10);
    expect(s.lines[0]?.vendorLabel).toBe("Cursor");
    expect(s.lines[0]?.savingsMonthlyUsd).toBe(10);
    expect(isPublicAuditSnapshot(s)).toBe(true);
  });
});
