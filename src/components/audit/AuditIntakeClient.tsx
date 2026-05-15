"use client";

import {
  PLANS_BY_VENDOR,
  PRIMARY_USE_CASE_OPTIONS,
  VENDOR_OPTIONS,
} from "@/lib/audit-intake-config";
import { PRODUCT_NAME } from "@/lib/product-brand";
import { AUDIT_STACK_STORAGE_KEY } from "@/lib/audit-storage";
import type { AuditSpendFormPayload, AuditToolLine, PrimaryUseCase, VendorSlug } from "@/types/audit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/** Stable ids avoid SSR/client hydration mismatches from `randomUUID()` in initial state. */
function createRowId(seq: number): string {
  return `audit-row-${seq}`;
}

function normalizeLoadedRow(
  row: Omit<AuditToolLine, "id">,
  id: string,
): AuditToolLine {
  const slug = (row.vendorSlug ?? "").trim() as VendorSlug | "";
  const validVendor = VENDOR_OPTIONS.some((v) => v.slug === slug);
  const vendorSlug = validVendor ? slug : "";
  const plans = vendorSlug ? PLANS_BY_VENDOR[vendorSlug as VendorSlug] ?? [] : [];
  let plan = (row.plan ?? "").trim();
  if (!plan || !plans.includes(plan)) {
    plan = "";
  }
  return {
    id,
    vendorSlug,
    plan,
    seats: row.seats ?? "",
    monthlySpend: row.monthlySpend ?? "",
    label: row.label ?? "",
  };
}

function emptyRow(id: string): AuditToolLine {
  return {
    id,
    vendorSlug: "",
    plan: "",
    seats: "",
    monthlySpend: "",
    label: "",
  };
}

function isRowEmpty(r: AuditToolLine) {
  return (
    !r.vendorSlug.trim() &&
    !r.plan.trim() &&
    !r.seats.trim() &&
    !r.monthlySpend.trim() &&
    !(r.label ?? "").trim()
  );
}

export function AuditIntakeClient() {
  const router = useRouter();
  const idSeqRef = useRef(1);
  const [teamSize, setTeamSize] = useState("");
  const [primaryUseCase, setPrimaryUseCase] = useState<PrimaryUseCase | "">("");
  const [rows, setRows] = useState<AuditToolLine[]>(() => [emptyRow(createRowId(1))]);
  const [error, setError] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(AUDIT_STACK_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (parsed.version === 2 && Array.isArray(parsed.tools)) {
        const t = parsed.tools as Omit<AuditToolLine, "id">[];
        setTeamSize(typeof parsed.teamSize === "string" ? parsed.teamSize : "");
        const rawPu =
          typeof parsed.primaryUseCase === "string" ? parsed.primaryUseCase : "";
        setPrimaryUseCase(
          PRIMARY_USE_CASE_OPTIONS.some((o) => o.value === rawPu)
            ? (rawPu as PrimaryUseCase)
            : "",
        );
        if (t.length === 0) {
          idSeqRef.current = 1;
          setRows([emptyRow(createRowId(1))]);
          return;
        }
        let seq = 1;
        setRows(
          t.map((row) => {
            const id = createRowId(seq);
            seq += 1;
            return normalizeLoadedRow(row, id);
          }),
        );
        idSeqRef.current = Math.max(idSeqRef.current, seq);
        return;
      }
      if (parsed.version !== 2 && Array.isArray(parsed.tools)) {
        const toolsUnknown = parsed.tools as Record<string, string | undefined>[];
        const rawPu =
          typeof parsed.primaryUseCase === "string" ? parsed.primaryUseCase : "";
        setPrimaryUseCase(
          PRIMARY_USE_CASE_OPTIONS.some((o) => o.value === rawPu)
            ? (rawPu as PrimaryUseCase)
            : "",
        );
        if (toolsUnknown.length === 0) {
          idSeqRef.current = 1;
          setRows([emptyRow(createRowId(1))]);
          setTeamSize(typeof parsed.teamSize === "string" ? parsed.teamSize : "");
          return;
        }
        let seq = 1;
        setRows(
          toolsUnknown.map((row) => {
            const id = createRowId(seq);
            seq += 1;
            return normalizeLoadedRow(
              {
                vendorSlug: (row.provider ?? row.vendorSlug ?? "") as VendorSlug | "",
                plan: row.plan ?? "",
                seats: row.seats ?? "",
                monthlySpend: row.spend ?? row.monthlySpend ?? "",
                label: row.label ?? "",
              },
              id,
            );
          }),
        );
        idSeqRef.current = Math.max(idSeqRef.current, seq);
        setTeamSize(typeof parsed.teamSize === "string" ? parsed.teamSize : "");
      }
    } catch {
      /* ignore */
    }
    });
  }, []);

  const persist = useCallback((nextRows: AuditToolLine[], ts: string, pu: PrimaryUseCase | "") => {
    const payload: AuditSpendFormPayload = {
      version: 2,
      teamSize: ts,
      primaryUseCase: pu,
      tools: nextRows.map(({ vendorSlug, plan, seats, monthlySpend, label }) => ({
        vendorSlug: vendorSlug as VendorSlug,
        plan,
        seats,
        monthlySpend,
        label,
      })),
    };
    try {
      localStorage.setItem(AUDIT_STACK_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, []);

  const pushPersist = (nextRows: AuditToolLine[], ts = teamSize, pu = primaryUseCase) => {
    setRows(nextRows);
    persist(nextRows, ts, pu);
  };

  const updateRow = (id: string, patch: Partial<Omit<AuditToolLine, "id">>) => {
    const next = rows.map((r) => {
      if (r.id !== id) return r;
      const merged = { ...r, ...patch };
      if (patch.vendorSlug !== undefined && patch.vendorSlug !== r.vendorSlug) {
        merged.plan = "";
      }
      return merged;
    });
    pushPersist(next);
  };

  const addRow = () => {
    idSeqRef.current += 1;
    pushPersist([...rows, emptyRow(createRowId(idSeqRef.current))]);
  };

  const removeRow = (id: string) => {
    if (rows.length < 2) return;
    pushPersist(rows.filter((r) => r.id !== id));
  };

  const onTeamSizeChange = (v: string) => {
    setTeamSize(v);
    persist(rows, v, primaryUseCase);
  };

  const onUseCaseChange = (v: PrimaryUseCase | "") => {
    setPrimaryUseCase(v);
    persist(rows, teamSize, v);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const ts = teamSize.trim();
    if (!ts.length || !/^\d+$/.test(ts) || parseInt(ts, 10) < 1) {
      setError("Enter team size as a whole number (1 or more).");
      return;
    }
    if (!primaryUseCase) {
      setError("Select a primary use case.");
      return;
    }

    const complete: Omit<AuditToolLine, "id">[] = [];
    for (const r of rows) {
      if (isRowEmpty(r)) continue;
      const spendRaw = r.monthlySpend.trim();
      const seatsRaw = r.seats.trim();
      const hasVendor = r.vendorSlug.trim().length > 0;
      const hasPlan = r.plan.trim().length > 0;
      const hasSpend = spendRaw.length > 0;
      const hasSeats = seatsRaw.length > 0;
      if (!hasVendor && !hasPlan && !hasSpend && !hasSeats) continue;
      if (!hasVendor || !hasPlan || !hasSpend || !hasSeats) {
        setError("Each tool row needs provider, plan, seats, and monthly spend — or clear the row.");
        return;
      }
      if (!/^\d+$/.test(seatsRaw) || parseInt(seatsRaw, 10) < 1) {
        setError("Seats must be a whole number (1 or more) for each tool.");
        return;
      }
      const n = parseFloat(spendRaw.replace(/[^0-9.]/g, ""));
      if (!Number.isFinite(n) || n <= 0) {
        setError("Monthly spend must be a positive number for each tool.");
        return;
      }
      complete.push({
        vendorSlug: r.vendorSlug as VendorSlug,
        plan: r.plan.trim(),
        seats: seatsRaw,
        monthlySpend: spendRaw,
        label: r.label?.trim() ?? "",
      });
    }

    if (!complete.length) {
      setError("Add at least one complete tool row, or use Skip.");
      return;
    }

    const payload: AuditSpendFormPayload = {
      version: 2,
      teamSize: ts,
      primaryUseCase,
      tools: complete,
    };
    try {
      localStorage.setItem(AUDIT_STACK_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    router.push("/audit/summary");
  };

  const fieldClass =
    "mb-3 w-full rounded-[10px] border border-white/10 bg-[#111113] px-3 py-2.5 text-[0.9375rem] text-zinc-100 outline-none focus:border-white/20 [color-scheme:dark]";

  return (
    <div className="min-h-screen bg-black px-5 py-12 text-white [color-scheme:dark]">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-7 flex items-center justify-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 3L20 19H4L12 3Z" fill="currentColor" />
          </svg>
          <span className="text-lg font-bold tracking-tight">{PRODUCT_NAME}</span>
        </div>
        <h1 className="sr-only">AI spend audit intake</h1>
        <p className="mb-8 text-center text-[0.9375rem] leading-relaxed text-zinc-400">
          Each tool needs a <strong className="text-white">plan</strong>,{" "}
          <strong className="text-white">monthly spend</strong>, and <strong className="text-white">seats</strong>.
          Also your <strong className="text-white">team size</strong> and{" "}
          <strong className="text-white">primary use case</strong>.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
          {error ? (
            <p
              className="rounded-[10px] border border-red-400/35 bg-red-950/35 px-3 py-2 text-sm text-red-200"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-4">
            <h2 className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-zinc-400">
              Your team
            </h2>
            <label className="mb-1 block text-sm font-medium" htmlFor="team-size">
              Team size
            </label>
            <input
              id="team-size"
              className={fieldClass}
              inputMode="numeric"
              placeholder="e.g. 8"
              value={teamSize}
              onChange={(e) => onTeamSizeChange(e.target.value)}
              autoComplete="off"
            />
            <label className="mb-1 block text-sm font-medium" htmlFor="use-case">
              Primary use case
            </label>
            <select
              id="use-case"
              className={`${fieldClass} mb-0 cursor-pointer`}
              value={primaryUseCase}
              onChange={(e) => onUseCaseChange(e.target.value as PrimaryUseCase | "")}
            >
              <option value="" className="bg-zinc-900 text-zinc-100">
                Select use case
              </option>
              {PRIMARY_USE_CASE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-zinc-900 text-zinc-100">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-4">
            {rows.map((row, idx) => {
              const plans = row.vendorSlug ? PLANS_BY_VENDOR[row.vendorSlug as VendorSlug] ?? [] : [];
              return (
                <div key={row.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                      Tool {idx + 1}
                    </span>
                    {rows.length > 1 ? (
                      <button
                        type="button"
                        className="rounded-lg border border-white/12 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
                        onClick={() => removeRow(row.id)}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <label className="mb-1 block text-sm font-medium">Tool / provider</label>
                  <select
                    className={`${fieldClass} cursor-pointer`}
                    value={row.vendorSlug}
                    onChange={(e) => updateRow(row.id, { vendorSlug: e.target.value as VendorSlug | "" })}
                  >
                    <option value="" className="bg-zinc-900 text-zinc-100">
                      Select provider
                    </option>
                    {VENDOR_OPTIONS.map((o) => (
                      <option key={o.slug} value={o.slug} className="bg-zinc-900 text-zinc-100">
                        {o.label}
                      </option>
                    ))}
                  </select>

                  <label className="mb-1 block text-sm font-medium">Plan</label>
                  <select
                    className={`${fieldClass} cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
                    value={plans.includes(row.plan) ? row.plan : ""}
                    onChange={(e) => updateRow(row.id, { plan: e.target.value })}
                    disabled={!row.vendorSlug}
                  >
                    <option value="" className="bg-zinc-900 text-zinc-100">
                      {row.vendorSlug ? "Select plan" : "Select provider first"}
                    </option>
                    {plans.map((p) => (
                      <option key={p} value={p} className="bg-zinc-900 text-zinc-100">
                        {p}
                      </option>
                    ))}
                  </select>

                  <label className="mb-1 block text-sm font-medium">Number of seats</label>
                  <input
                    className={fieldClass}
                    inputMode="numeric"
                    placeholder="e.g. 5"
                    value={row.seats}
                    onChange={(e) => updateRow(row.id, { seats: e.target.value })}
                    autoComplete="off"
                  />

                  <label className="mb-1 block text-sm font-medium">Current monthly spend (USD)</label>
                  <input
                    className={fieldClass}
                    inputMode="decimal"
                    placeholder="e.g. 240"
                    value={row.monthlySpend}
                    onChange={(e) => updateRow(row.id, { monthlySpend: e.target.value })}
                    autoComplete="off"
                  />

                  <label className="mb-1 block text-sm font-medium">
                    Label <span className="font-normal text-zinc-500">(optional)</span>
                  </label>
                  <input
                    className={`${fieldClass} mb-0`}
                    placeholder="e.g. second ChatGPT workspace"
                    value={row.label}
                    onChange={(e) => updateRow(row.id, { label: e.target.value })}
                    autoComplete="off"
                  />
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="w-full rounded-[10px] border border-dashed border-white/20 py-2 text-sm font-medium text-zinc-400 hover:border-white/30 hover:text-zinc-200"
            onClick={addRow}
          >
            + Add another tool
          </button>

          <button
            type="submit"
            className="mt-1 w-full rounded-[10px] bg-zinc-200 py-3 text-[0.9375rem] font-semibold text-zinc-950 hover:bg-zinc-300"
          >
            Continue with stack
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <Link
          href="/audit/summary?demo=1"
          className="flex w-full items-center justify-center gap-1.5 py-2 text-sm text-zinc-400 hover:text-zinc-200"
        >
          <span aria-hidden>✦</span> Skip for now & use example data
        </Link>

        <p className="mt-8 text-center text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400">
            ← Back to landing
          </Link>
        </p>
      </div>
    </div>
  );
}
