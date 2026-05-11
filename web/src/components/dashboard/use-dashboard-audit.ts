"use client";

import { DEMO_AUDIT_PAYLOAD } from "@/lib/audit-demo-payload";
import { readSpendPayloadFromBrowserStorage } from "@/lib/audit-storage";
import { runAudit } from "@/lib/audit-engine";
import type { AuditResult, AuditSpendFormPayload } from "@/types/audit";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useDashboardAudit() {
  const search = useSearchParams();
  const demo = search.get("demo") === "1";
  const [payload, setPayload] = useState<AuditSpendFormPayload | null>(null);
  const [audit, setAudit] = useState<AuditResult | null>(null);

  useEffect(() => {
    if (demo) {
      setPayload(DEMO_AUDIT_PAYLOAD);
      setAudit(runAudit(DEMO_AUDIT_PAYLOAD));
      return;
    }
    const p = readSpendPayloadFromBrowserStorage();
    setPayload(p);
    setAudit(p?.tools?.length ? runAudit(p) : null);
  }, [demo]);

  return {
    demo,
    payload,
    audit,
    hasStack: !!(payload?.tools && payload.tools.length > 0),
  };
}
