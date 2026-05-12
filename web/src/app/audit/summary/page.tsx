import { AuditSummaryClient } from "@/components/audit/AuditSummaryClient";
import { PRODUCT_NAME } from "@/lib/product-brand";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Audit saved — ${PRODUCT_NAME}`,
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
