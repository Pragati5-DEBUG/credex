import type { AuditSpendFormPayload, PrimaryUseCase, VendorSlug } from "@/types/audit";

export const AUDIT_STACK_STORAGE_KEY = "credex_audit_stack_preview_v1";

function migrateLegacy(o: Record<string, unknown>): AuditSpendFormPayload | null {
  const toolsUnknown = o.tools;
  if (!Array.isArray(toolsUnknown)) return null;
  const tools = toolsUnknown.map((t) => {
    const row = t as Record<string, string | undefined>;
    const slug = (row.provider ?? row.vendorSlug ?? "") as VendorSlug | "";
    return {
      vendorSlug: slug,
      plan: row.plan ?? "",
      seats: row.seats ?? "",
      monthlySpend: row.spend ?? row.monthlySpend ?? "",
      label: row.label ?? "",
    };
  });
  return { version: 2, teamSize: typeof o.teamSize === "string" ? o.teamSize : "", primaryUseCase: (o.primaryUseCase as PrimaryUseCase) || "", tools };
}

export function readSpendPayloadFromBrowserStorage(): AuditSpendFormPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUDIT_STACK_STORAGE_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as Record<string, unknown>;
    if (j.version === 2 && Array.isArray(j.tools)) {
      return j as unknown as AuditSpendFormPayload;
    }
    return migrateLegacy(j);
  } catch {
    return null;
  }
}
