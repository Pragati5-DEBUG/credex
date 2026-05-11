import { Suspense } from "react";
import { DashboardInsightsClient } from "@/components/dashboard/DashboardInsightsClient";

export default function DashboardInsightsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-zinc-500">
          Loading insights…
        </div>
      }
    >
      <DashboardInsightsClient />
    </Suspense>
  );
}
