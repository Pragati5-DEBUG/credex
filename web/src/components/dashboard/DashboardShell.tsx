"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/integrations", label: "Integrations" },
  { href: "/dashboard/breakdown", label: "Breakdown" },
  { href: "/dashboard/insights", label: "Insights" },
  { href: "/dashboard/alerts", label: "Alerts" },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const demo = search.get("demo") === "1";
  const qs = demo ? "?demo=1" : "";

  return (
    <div className="flex min-h-screen bg-[#050508] text-zinc-100 antialiased">
      <aside className="flex w-56 shrink-0 flex-col border-r border-white/[0.06] bg-[#08080c] px-3 py-5">
        <div className="mb-8 px-2">
          <Link href="/" className="block">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              Credex
            </span>
            <span className="mt-0.5 block text-[0.65rem] font-medium uppercase tracking-widest text-zinc-600">
              Spend lab
            </span>
          </Link>
        </div>

        <div className="mb-6 px-2">
          <label className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-wider text-zinc-600">
            Workspace
          </label>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-black/30 px-2.5 py-2 text-left text-sm font-medium text-zinc-200 hover:border-violet-500/30"
          >
            CREDEX
            <span className="text-zinc-600" aria-hidden>
              ▾
            </span>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-1">
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={`${item.href}${qs}`}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-violet-600/15 text-violet-200 ring-1 ring-violet-500/25"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/[0.06] pt-4 px-2 text-xs text-zinc-600">
          <a href="#" className="block hover:text-zinc-400">
            Quick feedback
          </a>
          <p className="truncate text-[0.7rem] text-zinc-700">Signed in locally</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
