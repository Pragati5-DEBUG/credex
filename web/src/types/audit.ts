/**
 * Credex Round 1 — audit types aligned with credex.pdf spend form + results.
 */

export type PrimaryUseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type VendorSlug =
  | "cursor"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf"
  | "v0";

/** One line in the spend form (PDF: plan, monthly spend, seats per tool). */
export interface AuditToolLine {
  id: string;
  vendorSlug: VendorSlug | "";
  plan: string;
  seats: string;
  monthlySpend: string;
  /** Optional user note (not in PDF; kept for duplicate rows). */
  label?: string;
}

/** Full persisted spend form (PDF: tools + team size + primary use case). */
export interface AuditSpendFormPayload {
  version: 2;
  teamSize: string;
  primaryUseCase: PrimaryUseCase | "";
  tools: Omit<AuditToolLine, "id">[];
}

export interface AuditSavingsLine {
  toolId: string;
  vendorSlug: VendorSlug;
  vendorLabel: string;
  planLabel: string;
  currentMonthlyUsd: number;
  recommendedAction: string;
  estimatedMonthlySavingsUsd: number;
  reasonOneLiner: string;
}

export interface AuditResult {
  lines: AuditSavingsLine[];
  totalMonthlySavingsUsd: number;
  totalAnnualSavingsUsd: number;
  combinedCurrentMonthlyUsd: number;
  /** From credex.pdf thresholds on modeled savings */
  savingsBand: "high" | "moderate" | "low";
}
