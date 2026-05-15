import { AuditIntakeClient } from "@/components/audit/AuditIntakeClient";
import { PRODUCT_NAME } from "@/lib/product-brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Run audit — ${PRODUCT_NAME}`,
  description: "Add your AI tools and monthly spend for a spend audit.",
};

export default function AuditPage() {
  return <AuditIntakeClient />;
}
