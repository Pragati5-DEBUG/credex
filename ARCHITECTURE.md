Architecture

System diagram

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

Data flow

1. On /audit the user enters team size, primary use case, and per-tool rows (vendor, plan, seats, monthly spend). The payload is saved in localStorage so a reload keeps the form.
2. On /audit/summary the client reads that payload (or a demo stack), runs runAudit in the browser, and gets line items, totals, and a savings band.
3. An optional executive readout uses a template or POST /api/summary with a public snapshot shape only (no email or company on the share payload).
4. Share: the client POSTs the snapshot to /api/share; Supabase stores audit_shares and returns /r/{id}.
5. Leads: POST saves email and optional fields to audit_leads, with honeypot and rate limiting; Resend sends the link when configured.
6. /r/[id] loads the snapshot server-side and sets Open Graph and Twitter metadata.

Stack

- Next.js 16 App Router — SSR for share previews, API routes beside the UI, straightforward Vercel deploy.
- Tailwind CSS v4 — layout and typography without a locked admin template.
- TypeScript audit modules and Vitest — deterministic rules and tests; no LLM in pricing math.
- Supabase Postgres — shares and leads without self-hosting Postgres; service role only on the server.
- Resend — transactional email with a simple HTTP API.

At roughly 10k audits per day

- Run audits on the server behind a queue if stacks grow; keep pricing catalog in memory.
- Tighten rate limits (e.g. Redis) and add captcha on /api/leads if abused.
- Use connection pooling, indexes on share ids and lead timestamps and IPs.
- Cache or CDN immutable /r/* reads where it helps.
- Add structured logging and alerts on API errors and email bounces.
