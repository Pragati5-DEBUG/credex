import { fetchShareSnapshot } from "@/lib/fetch-share-server";
import { PRODUCT_NAME } from "@/lib/product-brand";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

function fmtUsd(n: number, maxFrac = 0) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
  });
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const snap = await fetchShareSnapshot(id);
  if (!snap) {
    return {
      title: `Report | ${PRODUCT_NAME}`,
      description: `${PRODUCT_NAME} rule-based AI spend snapshot.`,
      robots: { index: false, follow: false },
    };
  }
  const title = `${PRODUCT_NAME} audit — ${fmtUsd(snap.savingsMonthlyUsd)}/mo modeled savings`;
  const description = `Read-only snapshot: ${snap.lines.length} line(s), ${snap.savingsBand} band. Rule-based list anchors — not financial advice.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function PublicReportPage({ params }: Props) {
  const { id } = await params;
  const snap = await fetchShareSnapshot(id);
  if (!snap) notFound();

  const combined = snap.combinedMonthlyUsd;
  const savings = snap.savingsMonthlyUsd;
  const afterMonthly = Math.max(0, combined - savings);

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100 [color-scheme:dark]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 border-b border-white/[0.06] pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90">Public link</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{PRODUCT_NAME} audit snapshot</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Read-only, rule-based numbers. No sign-in, no vendor accounts — this page intentionally excludes email,
            company, and free-form labels.
          </p>
        </header>

        <section className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Combined</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{fmtUsd(combined)}</p>
            <p className="text-xs text-zinc-600">/ mo modeled</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-300/90">Modeled savings</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-300">{fmtUsd(savings)}</p>
            <p className="text-xs text-emerald-200/70">/ mo · {fmtUsd(snap.savingsAnnualUsd)} / yr</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">After envelope</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-200/90">{fmtUsd(afterMonthly)}</p>
            <p className="text-xs text-zinc-600">Band: {snap.savingsBand}</p>
          </div>
        </section>

        <section className="mb-10 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0b0f]">
          <div className="border-b border-white/[0.06] px-4 py-3 sm:px-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Line items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 py-2.5 sm:px-5">Vendor</th>
                  <th className="px-4 py-2.5 sm:px-5">Plan</th>
                  <th className="px-4 py-2.5 text-right sm:px-5">/ mo</th>
                  <th className="px-4 py-2.5 text-right sm:px-5">Save</th>
                  <th className="px-4 py-2.5 text-right sm:px-5">After</th>
                </tr>
              </thead>
              <tbody className="text-zinc-200">
                {snap.lines.map((line, i) => {
                  const after = Math.max(0, line.currentMonthlyUsd - line.savingsMonthlyUsd);
                  return (
                    <tr key={`${line.vendorLabel}-${line.planLabel}-${i}`} className="border-b border-white/[0.04] last:border-0">
                      <td className="px-4 py-3 font-medium text-white sm:px-5">{line.vendorLabel}</td>
                      <td className="px-4 py-3 text-zinc-400 sm:px-5">{line.planLabel}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-400 sm:px-5">{fmtUsd(line.currentMonthlyUsd)}</td>
                      <td className="px-4 py-3 text-right tabular-nums sm:px-5">
                        {line.savingsMonthlyUsd > 0 ? (
                          <span className="font-semibold text-emerald-400">{fmtUsd(line.savingsMonthlyUsd)}</span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-emerald-200/90 sm:px-5">{fmtUsd(after)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recommendations</h2>
          <ul className="space-y-3">
            {snap.lines.map((line, i) => (
              <li
                key={`card-${line.vendorLabel}-${i}`}
                className="rounded-xl border border-white/[0.06] bg-[#0b0b0f] p-4 sm:p-5"
              >
                <p className="font-semibold text-white">
                  {line.vendorLabel} <span className="font-normal text-zinc-500">· {line.planLabel}</span>
                </p>
                <p className="mt-2 text-sm text-violet-200/90">{line.actionShort}</p>
                <p className="mt-2 text-xs text-zinc-600">{line.reasonShort}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center text-xs text-zinc-600">
          Generated {snap.generatedAt ? new Date(snap.generatedAt).toLocaleString() : "—"} ·{" "}
          <Link href="/" className="text-zinc-500 hover:text-zinc-400">
            {PRODUCT_NAME} home
          </Link>
        </p>
      </div>
    </div>
  );
}
