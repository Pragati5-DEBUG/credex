# Credex — architecture

## System diagram

```mermaid
flowchart LR
  subgraph client [Browser]
    Landing[Landing /]
    AuditForm[/audit intake]
    Summary[/audit/summary]
    Public[/r/id public report]
  end
  subgraph next [Next.js server]
    Engine[run-audit.ts]
    ShareAPI[POST /api/share]
    LeadsAPI[POST /api/leads]
    SummaryAPI[POST /api/summary]
  end
  subgraph data [Persistence]
    LS[(localStorage)]
    SB[(Supabase Postgres)]
    Ext[Resend / Anthropic / OpenAI APIs]
  end
  AuditForm --> LS
  AuditForm --> Engine
  Summary --> Engine
  Summary --> SummaryAPI
  Summary --> ShareAPI
  Summary --> LeadsAPI
  ShareAPI --> SB
  LeadsAPI --> SB
  LeadsAPI --> Ext
  SummaryAPI --> Ext
  Public --> SB
```

## Data flow

1. User fills **team size**, **primary use case**, and **per-tool rows** (vendor, plan, seats, monthly spend) on `/audit`. Payload is written to **`localStorage`** (`audit-storage.ts`) so reloads keep state.
2. On `/audit/summary`, the client reads storage (or demo payload), runs **`runAudit()`** in-browser — pure TypeScript; outputs **`AuditResult`** (lines, totals, savings band).
3. **Executive readout** (template or LLM via `/api/summary`) summarizes **`PublicAuditSnapshot`** — derived fields only, no email/company on storage for OG-safe payloads.
4. **Share:** client POSTs **`PublicAuditSnapshot`** to **`/api/share`** → Supabase **`audit_shares`** row → returns **`/r/{id}`**.
5. **Leads:** POST includes email + optional fields + honeypot + snapshot/share id → **`audit_leads`** + transactional email via **Resend** when configured.
6. **Public page** `/r/[id]` server-loads JSON from **`audit_shares`** by id; **`generateMetadata`** sets Open Graph / Twitter.

## Stack choice

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 16 App Router | SSR for OG on share URLs, API routes colocated, React ecosystem, deploys cleanly to Vercel. |
| UI | Tailwind CSS v4 | Fast iteration, consistent spacing/typography without template lock-in (per brief). |
| Audit logic | TS modules + Vitest | Deterministic, testable rules — no LLM in the pricing math (per brief). |
| Backend | Supabase Postgres | Tables for shares/leads without running Postgres myself; service role from server only. |
| Email | Resend | Simple HTTP API, fits transactional “here is your link” flow. |

## If this handled ~10k audits/day

- Move **`runAudit`** behind a queue if audits become server-side jobs; cache **pricing-catalog** reads in memory.
- **Rate limits:** stricter per-IP (Redis / Upstash), captcha for `/api/leads` if abused.
- **Supabase:** connection pooling (PgBouncer), indexes on `audit_shares.id`, `audit_leads(created_at, ip)`.
- **Share reads:** edge-cache immutable snapshots or CDN for `/r/*` static shell + API slice if needed.
- **Observability:** structured logs on API routes, alerts on 5xx and Resend bounce rates.
