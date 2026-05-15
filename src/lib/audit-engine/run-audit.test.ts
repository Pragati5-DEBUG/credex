import { describe, expect, it } from "vitest";
import { runAudit } from "./run-audit";

describe("runAudit", () => {
  it("recommends Cursor Pro list when Business is overstated vs list", () => {
    const r = runAudit({
      version: 2,
      teamSize: "5",
      primaryUseCase: "mixed",
      tools: [
        {
          vendorSlug: "cursor",
          plan: "Business",
          seats: "5",
          monthlySpend: "500",
          label: "",
        },
      ],
    });
    expect(r.lines).toHaveLength(1);
    expect(r.lines[0]!.estimatedMonthlySavingsUsd).toBeGreaterThan(100);
    expect(r.lines[0]!.recommendedAction.toLowerCase()).toContain("pro");
    expect(r.totalMonthlySavingsUsd).toBe(r.lines[0]!.estimatedMonthlySavingsUsd);
  });

  it("aligns spend when above list on same tier", () => {
    const r = runAudit({
      version: 2,
      teamSize: "1",
      primaryUseCase: "mixed",
      tools: [
        {
          vendorSlug: "cursor",
          plan: "Pro",
          seats: "1",
          monthlySpend: "80",
          label: "",
        },
      ],
    });
    expect(r.lines[0]!.estimatedMonthlySavingsUsd).toBe(60);
    expect(r.lines[0]!.recommendedAction).toMatch(/Align to published list/i);
  });

  it("does not invent savings when list matches spend (mixed = no cross-vendor churn)", () => {
    const r = runAudit({
      version: 2,
      teamSize: "1",
      primaryUseCase: "mixed",
      tools: [
        {
          vendorSlug: "cursor",
          plan: "Pro",
          seats: "1",
          monthlySpend: "20",
          label: "",
        },
      ],
    });
    expect(r.lines[0]!.estimatedMonthlySavingsUsd).toBe(0);
  });

  it("returns zero modeled savings for API usage rows", () => {
    const r = runAudit({
      version: 2,
      teamSize: "3",
      primaryUseCase: "data",
      tools: [
        {
          vendorSlug: "openai-api",
          plan: "Usage-based (on-demand)",
          seats: "3",
          monthlySpend: "400",
          label: "",
        },
      ],
    });
    expect(r.lines[0]!.estimatedMonthlySavingsUsd).toBe(0);
    expect(r.lines[0]!.recommendedAction).toMatch(/No fixed monthly list/i);
  });

  it("classifies savings band for PDF thresholds", () => {
    const high = runAudit({
      version: 2,
      teamSize: "10",
      primaryUseCase: "mixed",
      tools: [
        {
          vendorSlug: "cursor",
          plan: "Business",
          seats: "10",
          monthlySpend: "2000",
          label: "",
        },
      ],
    });
    expect(high.savingsBand).toBe("high");

    const low = runAudit({
      version: 2,
      teamSize: "1",
      primaryUseCase: "mixed",
      tools: [
        {
          vendorSlug: "cursor",
          plan: "Pro",
          seats: "1",
          monthlySpend: "25",
          label: "",
        },
      ],
    });
    expect(low.savingsBand).toBe("low");
  });
});
