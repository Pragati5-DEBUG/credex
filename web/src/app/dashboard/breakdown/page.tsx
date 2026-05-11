import Link from "next/link";

export default function BreakdownPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <h1 className="text-lg font-semibold text-white">Breakdown</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        Per-model usage breakdown needs integration data. Use the audit summary for per-vendor
        lines today.
      </p>
      <Link href="/audit/summary" className="mt-6 text-sm text-violet-400 hover:underline">
        Audit summary →
      </Link>
    </div>
  );
}
