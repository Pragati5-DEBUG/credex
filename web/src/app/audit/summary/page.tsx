import { AuditSummaryClient } from "@/components/audit/AuditSummaryClient";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Audit saved — Credex",
};

export default function AuditSummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-zinc-500">
          Loading…
        </div>
      }
    >
      <AuditSummaryClient />
    </Suspense>
  );
}
