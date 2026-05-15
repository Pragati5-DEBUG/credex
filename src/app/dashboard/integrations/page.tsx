import Link from "next/link";

export default function IntegrationsPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-8">
      <h1 className="text-lg font-semibold text-white">Integrations</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
        Grafient-style live pulls from model providers are not in this MVP. The audit uses your
        declared stack from intake.
      </p>
      <Link href="/audit" className="mt-6 text-sm text-violet-400 hover:underline">
        Go to audit intake →
      </Link>
    </div>
  );
}
