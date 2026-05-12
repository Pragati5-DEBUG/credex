# AiTookMySalary — AI spend audit (Round 1)

**AiTookMySalary helps founders and engineering leads benchmark AI tool spend against defensible list-price anchors, then optionally capture a lead and share a read-only report — lead-gen for discounted AI infrastructure credits (per the brief, **Credex** as a credits vendor).** Built as a Next.js web app per [`credex.pdf`](./credex.pdf).

**Live app:** _[Add your deployed URL before submitting — e.g. https://….vercel.app]_  

**Screenshots / demo:** _[Add 3+ screenshots here or a ~30s Loom/YouTube link]_  

---

## Quick start

From **repo root**:

```bash
npm install --prefix web
npm run dev
```

From **`web/`**:

```bash
cd web
npm install
npm run dev
```

- **`npm run dev`** opens the browser when ready (see terminal for **Local:** URL — often `http://localhost:3000`).
- Only one `next dev` at a time. **`npm run dev:plain`** skips auto-open (`cd web && npm run dev:plain`).
- Production build: `npm run build --prefix web` then `npm run start --prefix web`.

Env: copy [`web/.env.example`](./web/.env.example) → **`web/.env.local`**. See [`SUPABASE.sql`](./SUPABASE.sql) for database setup.

---

## Repo map (submission docs)

| File | Purpose |
|------|---------|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Diagram, data flow, stack, scale notes |
| [`DEVLOG.md`](./DEVLOG.md) | Seven daily entries (fill dates — assignment format) |
| [`REFLECTION.md`](./REFLECTION.md) | Five prompts (150–400 words each) |
| [`TESTS.md`](./TESTS.md) | Automated tests + how to run |
| [`PRICING_DATA.md`](./PRICING_DATA.md) | Pricing sources for the engine |
| [`PROMPTS.md`](./PROMPTS.md) | LLM prompts for executive summary |
| [`GTM.md`](./GTM.md) | Go-to-market |
| [`ECONOMICS.md`](./ECONOMICS.md) | Unit economics |
| [`USER_INTERVIEWS.md`](./USER_INTERVIEWS.md) | **Three real interviews** — do not fabricate |
| [`LANDING_COPY.md`](./LANDING_COPY.md) | Ship-ready landing copy draft |
| [`METRICS.md`](./METRICS.md) | North Star + instrumentation |

CI: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — lint + tests on push to **`main`**.

---

## App (`web/`)

| Route | Description |
|-------|-------------|
| `/` | Marketing landing |
| `/audit` | Spend intake (tools, plans, seats, spend; persisted in `localStorage`) |
| `/audit/summary` | Audit results + executive readout + share + email capture |
| `/r/[id]` | Public read-only snapshot (no email/company); OG metadata |

| Area | Path |
|------|------|
| Audit engine | `web/src/lib/audit-engine/` |
| API routes | `web/src/app/api/` |

---

## Decisions (trade-offs)

1. **Rules-first audit math, LLM only for narrative** — Keeps finance-defensible numbers and avoids “AI invented savings” (per brief). Trade-off: more maintenance when vendors change pricing (mitigated by `PRICING_DATA.md`).
2. **Supabase for shares/leads** — Faster than self-hosted Postgres for a week-long scope; trade-off: vendor lock-in and correct **service role** key discipline.
3. **Client-side `runAudit` on summary** — Instant UX without round-trip for math; trade-off: very large stacks could move server-side later.
4. **Public snapshot strips PII** — Share links stay safe for Slack; trade-off: public page can’t show optional tool labels from intake.
5. **Resend for transactional email** — Simple API vs SES setup time; trade-off: deliverability tuning and verified **from** domain for production.

---

## Scripts (from `web/`)

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint |
| `npm run test` | Vitest (`tests` listed in [`TESTS.md`](./TESTS.md)) |
| `npm run build` | Production build |

---

## Deploy

Typical: **Vercel** → import repo, root **`web`**, set env vars (`NEXT_PUBLIC_APP_URL`, Supabase, Resend, optional LLM keys). Run **`SUPABASE.sql`** on your Supabase project first.

---

Brief: [`credex.pdf`](./credex.pdf)
