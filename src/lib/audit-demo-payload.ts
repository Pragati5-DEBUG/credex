import type { AuditSpendFormPayload } from "@/types/audit";

/** Shared sample stack for `?demo=1` flows (audit summary + dashboard). */
export const DEMO_AUDIT_PAYLOAD: AuditSpendFormPayload = {
  version: 2,
  teamSize: "8",
  primaryUseCase: "coding",
  tools: [
    {
      vendorSlug: "cursor",
      plan: "Business",
      seats: "8",
      monthlySpend: "960",
      label: "IDE",
    },
    {
      vendorSlug: "chatgpt",
      plan: "Team",
      seats: "8",
      monthlySpend: "320",
      label: "",
    },
  ],
};
