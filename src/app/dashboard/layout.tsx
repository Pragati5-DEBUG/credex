import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050508]" aria-hidden />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
