import Link from "next/link";

export default function AlertsPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <h1 className="text-lg font-semibold text-white">Alerts</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        Budget alerts and anomaly detection would ship after live integrations.
      </p>
      <Link href="/dashboard/insights" className="mt-6 text-sm text-violet-400 hover:underline">
        View insights →
      </Link>
    </div>
  );
}
