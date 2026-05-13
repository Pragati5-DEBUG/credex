"use client";

import { CREDEX_CONSULTATION_URL, PRODUCT_NAME } from "@/lib/product-brand";
import { DEMO_AUDIT_PAYLOAD } from "@/lib/audit-demo-payload";
import { readSpendPayloadFromBrowserStorage } from "@/lib/audit-storage";
import { PRIMARY_USE_CASE_OPTIONS, VENDOR_LABELS } from "@/lib/audit-intake-config";
import { runAudit } from "@/lib/audit-engine";
import { buildPublicSnapshot } from "@/lib/public-audit-snapshot";
import { normalizePublicShareUrl } from "@/lib/share-url";
import type { AuditSpendFormPayload, AuditResult, AuditSavingsLine, VendorSlug } from "@/types/audit";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect, useState, useCallback, type FormEvent } from "react";

function parseSpend(s: string) {
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function formatPrimaryUseCase(v: string) {
  return PRIMARY_USE_CASE_OPTIONS.find((o) => o.value === v)?.label ?? v;
}

function fmtUsd(n: number, maxFrac = 0) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
  });
}

/** Clipboard API is blocked on some origins; fall back to execCommand. */
async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.margin = "0";
    ta.style.padding = "0";
    ta.style.width = "1px";
    ta.style.height = "1px";
    ta.style.border = "none";
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export function AuditSummaryClient() {
  const search = useSearchParams();
  const demo = search.get("demo") === "1";
  const [payload, setPayload] = useState<AuditSpendFormPayload | null>(null);
  const [audit, setAudit] = useState<AuditResult | null>(null);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const [leadEmail, setLeadEmail] = useState("");
  const [websiteHp, setWebsiteHp] = useState("");
  const [leadBusy, setLeadBusy] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadOk, setLeadOk] = useState<{ shareUrl: string; emailed: boolean; emailNote?: string } | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    queueMicrotask(() => {
      if (demo) {
        setPayload(DEMO_AUDIT_PAYLOAD);
        setAudit(runAudit(DEMO_AUDIT_PAYLOAD));
        return;
      }
      const p = readSpendPayloadFromBrowserStorage();
      if (p?.tools?.length) {
        setPayload(p);
        setAudit(runAudit(p));
      } else {
        setPayload(null);
        setAudit(null);
      }
    });
  }, [demo]);

  const combined = audit?.combinedCurrentMonthlyUsd ?? 0;
  const savings = audit?.totalMonthlySavingsUsd ?? 0;
  const afterMonthly = Math.max(0, combined - savings);
  const highSavingsCreditPromo = audit && audit.savingsBand === "high";
  const spendingWellBand = audit && audit.savingsBand === "low";

  const hasPayload = !!(payload?.tools?.length);
  const hasAuditLines = !!(audit?.lines.length);
  const hasStack = hasPayload && hasAuditLines;

  const toolRows = useMemo(() => {
    if (!payload?.tools || !audit?.lines) return [];
    const out: {
      tool: (typeof payload.tools)[0];
      line: AuditSavingsLine;
      idx: number;
    }[] = [];
    const n = Math.min(payload.tools.length, audit.lines.length);
    for (let i = 0; i < n; i++) {
      out.push({ tool: payload.tools[i]!, line: audit.lines[i]!, idx: i });
    }
    return out;
  }, [payload, audit]);

  const snapshot = useMemo(() => (audit ? buildPublicSnapshot(audit) : null), [audit]);

  const onCreateShareLink = useCallback(async () => {
    if (!snapshot) return;
    setShareError(null);
    setCopyStatus("idle");
    setShareBusy(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        urlPath?: string;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setShareError(j.message ?? j.error ?? "Could not create link.");
        return;
      }
      const path = typeof j.urlPath === "string" ? j.urlPath : "";
      if (!path) {
        setShareError("Unexpected response from server.");
        return;
      }
      setShareUrl(`${window.location.origin}${path}`);
    } catch {
      setShareError("Network error — try again.");
    } finally {
      setShareBusy(false);
    }
  }, [snapshot]);

  const onEmailLead = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!snapshot) return;
      if (websiteHp.trim()) return;
      setLeadError(null);
      setLeadOk(null);
      setLeadBusy(true);
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: leadEmail.trim(),
            snapshot,
            website: websiteHp,
          }),
        });
        const j = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          shareUrl?: string;
          emailed?: boolean;
          emailNote?: string;
          error?: string;
          message?: string;
        };
        if (!res.ok) {
          setLeadError(j.message ?? j.error ?? "Could not save or email.");
          return;
        }
        if (j.shareUrl) {
          const shareUrl = normalizePublicShareUrl(j.shareUrl, window.location.origin);
          setLeadOk({
            shareUrl,
            emailed: Boolean(j.emailed),
            emailNote: typeof j.emailNote === "string" ? j.emailNote : undefined,
          });
          setCopyStatus("idle");
          setShareUrl(shareUrl);
        }
      } catch {
        setLeadError("Network error — try again.");
      } finally {
        setLeadBusy(false);
      }
    },
    [snapshot, leadEmail, websiteHp],
  );

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100 [color-scheme:dark]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header — Grafient-style */}
        <header className="mb-8 border-b border-white/[0.06] pb-6">
          <div className="mb-4 flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-violet-400">
              <path d="M12 3L20 19H4L12 3Z" fill="currentColor" />
            </svg>
            <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              {PRODUCT_NAME}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-500">
              Audit
            </span>
          </div>
          {demo ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-400/90">Demo</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Sample results</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
                Same rule engine as a real run — numbers trace to vendor-published list anchors in the engine.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Your audit snapshot</h1>
            </>
          )}
        </header>

        {!hasPayload && !demo ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-[#0b0b0f] p-10 text-center">
            <p className="text-zinc-400">No saved stack in this browser.</p>
            <Link
              href="/audit"
              className="mt-4 inline-flex rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Run intake
            </Link>
          </div>
        ) : null}

        {hasPayload && audit && !hasAuditLines ? (
          <div className="mb-8 rounded-xl border border-amber-500/25 bg-amber-500/10 p-6 text-center text-sm text-amber-100/90">
            Could not derive audit lines from stored data. Try re-saving your intake from{" "}
            <Link href="/audit" className="font-semibold text-amber-50 underline">
              /audit
            </Link>
            .
          </div>
        ) : null}

        {hasStack && payload && audit ? (
          <>
            {/* Context pills */}
            <div className="mb-6 flex flex-wrap gap-2">
              {payload.teamSize ? (
                <span className="rounded-lg border border-white/[0.08] bg-[#0b0b0f] px-3 py-1.5 text-xs text-zinc-300">
                  <span className="text-zinc-600">Team</span>{" "}
                  <span className="font-semibold text-white">{payload.teamSize}</span>
                </span>
              ) : null}
              {payload.primaryUseCase ? (
                <span className="rounded-lg border border-white/[0.08] bg-[#0b0b0f] px-3 py-1.5 text-xs text-zinc-300">
                  <span className="text-zinc-600">Use case</span>{" "}
                  <span className="font-semibold text-white">{formatPrimaryUseCase(payload.primaryUseCase)}</span>
                </span>
              ) : null}
            </div>

            {/* Hero: before → after */}
            <section className="mb-8 grid gap-4 rounded-xl border border-white/[0.08] bg-[#0b0b0f] p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-6 sm:p-6">
              <div className="rounded-lg border border-white/[0.06] bg-black/40 p-4 text-center sm:text-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-zinc-600">Today (declared)</p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-white sm:text-4xl">{fmtUsd(combined)}</p>
                <p className="mt-0.5 text-xs text-zinc-500">per month · your intake</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-1 py-2 sm:py-0">
                <span className="text-2xl text-violet-400/90" aria-hidden>
                  →
                </span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-center text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/25">
                  Save {fmtUsd(savings)}/mo
                </span>
              </div>

              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-center sm:text-right">
                <p className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-400/80">
                  After modeled fixes
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-emerald-200 sm:text-4xl">{fmtUsd(afterMonthly)}</p>
                <p className="mt-0.5 text-xs text-emerald-200/70">{fmtUsd(savings * 12)} / yr kept in pocket</p>
              </div>
            </section>

            {/* Compact table — replaces long stack prose */}
            <section className="mb-8 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0b0f]">
              <div className="border-b border-white/[0.06] px-4 py-3 sm:px-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Stack breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.04] text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-600">
                      <th className="px-4 py-2.5 sm:px-5">Tool</th>
                      <th className="px-4 py-2.5 sm:px-5">Plan</th>
                      <th className="px-4 py-2.5 text-right sm:px-5">Seats</th>
                      <th className="px-4 py-2.5 text-right sm:px-5">/ mo</th>
                      <th className="px-4 py-2.5 text-right sm:px-5">Save</th>
                      <th className="px-4 py-2.5 text-right sm:px-5">After</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-200">
                    {toolRows.map(({ tool, line }) => {
                      const slug = tool.vendorSlug as VendorSlug;
                      const name = VENDOR_LABELS[slug] ?? slug;
                      const spend = parseSpend(tool.monthlySpend ?? "");
                      const after = Math.max(0, line.currentMonthlyUsd - line.estimatedMonthlySavingsUsd);
                      return (
                        <tr key={line.toolId} className="border-b border-white/[0.04] last:border-0">
                          <td className="px-4 py-3 font-medium text-white sm:px-5">
                            <div className="flex items-center gap-2">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-xs font-bold text-violet-200">
                                {name.slice(0, 1)}
                              </span>
                              <span>
                                {name}
                                {tool.label?.trim() ? (
                                  <span className="mt-0.5 block text-xs font-normal text-zinc-500">{tool.label}</span>
                                ) : null}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-zinc-400 sm:px-5">{tool.plan}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-zinc-400 sm:px-5">{tool.seats}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-white sm:px-5">
                            {Number.isFinite(spend) ? fmtUsd(spend) : "—"}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums sm:px-5">
                            {line.estimatedMonthlySavingsUsd > 0 ? (
                              <span className="font-semibold text-emerald-400">{fmtUsd(line.estimatedMonthlySavingsUsd)}</span>
                            ) : (
                              <span className="text-zinc-600">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums font-medium text-emerald-200/90 sm:px-5">
                            {fmtUsd(after)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/[0.02] text-sm font-semibold">
                      <td colSpan={3} className="px-4 py-3 text-zinc-500 sm:px-5">
                        Combined
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-white sm:px-5">{fmtUsd(combined)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-400 sm:px-5">{fmtUsd(savings)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-200 sm:px-5">{fmtUsd(afterMonthly)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {spendingWellBand ? (
              <div className="mb-8 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-4 sm:px-6">
                <p className="text-lg font-semibold leading-tight text-emerald-50 sm:text-xl">
                  You&apos;re spending well at modeled list anchors.
                </p>
              </div>
            ) : null}

            {highSavingsCreditPromo ? (
              <div className="mb-10 flex justify-center px-2">
                <a
                  href={CREDEX_CONSULTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-xl font-semibold tracking-tight text-zinc-100 underline decoration-violet-500/45 decoration-2 underline-offset-[10px] transition hover:text-white hover:decoration-violet-400/80 sm:text-2xl md:text-3xl"
                  aria-label={`Book consultation (opens ${CREDEX_CONSULTATION_URL})`}
                >
                  Book consultation
                </a>
              </div>
            ) : null}

            {/* Per-tool — scannable cards with bar */}
            <section>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-500">Recommendations</h2>
              <ul className="space-y-3">
                {audit.lines.map((line) => {
                  const pct =
                    line.currentMonthlyUsd > 0
                      ? Math.min(100, (line.estimatedMonthlySavingsUsd / line.currentMonthlyUsd) * 100)
                      : 0;
                  const after = Math.max(0, line.currentMonthlyUsd - line.estimatedMonthlySavingsUsd);
                  return (
                    <li
                      key={line.toolId}
                      className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0b0b0f] p-4 sm:flex sm:items-stretch sm:gap-5 sm:p-5"
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-white">
                              {line.vendorLabel}{" "}
                              <span className="font-normal text-zinc-500">· {line.planLabel}</span>
                            </p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {fmtUsd(line.currentMonthlyUsd)}/mo today
                              {line.estimatedMonthlySavingsUsd > 0 ? (
                                <>
                                  {" "}
                                  → <span className="text-emerald-400/90">{fmtUsd(after)}/mo</span> modeled
                                </>
                              ) : null}
                            </p>
                          </div>
                          {line.estimatedMonthlySavingsUsd > 0 ? (
                            <span className="shrink-0 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/25">
                              −{fmtUsd(line.estimatedMonthlySavingsUsd)}
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-500">
                              On target
                            </span>
                          )}
                        </div>
                        {line.estimatedMonthlySavingsUsd > 0 ? (
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-emerald-500"
                              style={{ width: `${Math.max(6, pct)}%` }}
                            />
                          </div>
                        ) : null}
                        {line.estimatedMonthlySavingsUsd > 0 ? (
                          <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-violet-400/95">
                            Reason to switch
                          </p>
                        ) : null}
                        <p
                          className={`text-base font-medium leading-relaxed text-zinc-50 sm:text-lg ${line.estimatedMonthlySavingsUsd > 0 ? "mt-2" : "mt-4"}`}
                        >
                          {line.recommendedAction}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {!demo ? (
              <section
                className="relative mb-8 rounded-xl border border-white/[0.08] bg-[#0b0b0f] p-5 sm:p-6"
                aria-labelledby="share-email-heading"
              >
                <h2 id="share-email-heading" className="text-sm font-semibold tracking-tight text-white">
                  Read-only link & email
                </h2>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => void onCreateShareLink()}
                    disabled={shareBusy || !snapshot}
                    className="inline-flex items-center justify-center rounded-xl border border-violet-500/35 bg-violet-600/20 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-400/45 hover:bg-violet-600/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {shareBusy ? "Creating…" : "Create read-only link"}
                  </button>
                  {shareUrl ? (
                    <button
                      type="button"
                      onClick={() => {
                        void (async () => {
                          const ok = await copyTextToClipboard(shareUrl);
                          setCopyStatus(ok ? "copied" : "failed");
                          window.setTimeout(() => setCopyStatus("idle"), 2500);
                        })();
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-white/[0.1]"
                    >
                      {copyStatus === "copied"
                        ? "Copied"
                        : copyStatus === "failed"
                          ? "Retry copy"
                          : "Copy link"}
                    </button>
                  ) : null}
                </div>
                {shareError ? (
                  <p className="mt-3 text-sm text-red-300/90" role="alert">
                    {shareError}
                  </p>
                ) : null}
                {shareUrl ? (
                  <div className="mt-3 space-y-2">
                    <p className="select-all break-all rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2 font-mono text-xs text-emerald-200/90">
                      {shareUrl}
                    </p>
                    {copyStatus === "failed" ? (
                      <p className="text-xs text-amber-200/90">
                        Automatic copy was blocked (browser or HTTP). Select the URL above and use Ctrl+C / ⌘C, or open
                        the site over HTTPS.
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <form onSubmit={onEmailLead} className="mt-6 space-y-3 border-t border-white/[0.06] pt-6">
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500" htmlFor="lead-email">
                    Email me the link
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none ring-violet-500/30 placeholder:text-zinc-600 focus:border-violet-500/40 focus:ring-2"
                  />
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={websiteHp}
                    onChange={(e) => setWebsiteHp(e.target.value)}
                    className="pointer-events-none absolute h-px w-px opacity-0"
                    aria-hidden
                  />
                  <button
                    type="submit"
                    disabled={leadBusy || !snapshot}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.08] py-3 text-sm font-semibold text-white hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
                  >
                    {leadBusy ? "Sending…" : "Save lead & email link"}
                  </button>
                  {leadError ? (
                    <p className="text-sm text-red-300/90" role="alert">
                      {leadError}
                    </p>
                  ) : null}
                  {leadOk ? (
                    <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100/95">
                      <p className="break-all font-mono text-xs text-emerald-200/90">{leadOk.shareUrl}</p>
                      <p className="mt-2 text-emerald-200/80">
                        {leadOk.emailed
                          ? "Check your inbox for the same link."
                          : leadOk.emailNote
                            ? `Link saved; email not sent: ${leadOk.emailNote}`
                            : "Link saved; email was not sent (check Resend)."}
                      </p>
                    </div>
                  ) : null}
                </form>
              </section>
            ) : null}
          </>
        ) : null}

        {/* Actions — Grafient-style */}
        <div className="mt-10 space-y-3 border-t border-white/[0.06] pt-8">
          {demo && (
            <Link
              href="/#ledger-section"
              className="flex w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] py-3 text-sm font-medium text-zinc-200 hover:bg-white/[0.07]"
            >
              View sample ledger
            </Link>
          )}

          <Link
            href="/audit"
            className="flex w-full items-center justify-center py-2.5 text-sm text-zinc-500 hover:text-zinc-300"
          >
            Edit intake
          </Link>
          <p className="text-center text-xs text-zinc-700">
            <Link href="/" className="hover:text-zinc-500">
              ← Back to landing
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
