import { Suspense } from "react";
import { DashboardHomeClient } from "@/components/dashboard/DashboardHomeClient";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center p-12 text-sm text-zinc-500">
          Loading dashboard…
        </div>
      }
    >
      <DashboardHomeClient />
    </Suspense>
  );
}
