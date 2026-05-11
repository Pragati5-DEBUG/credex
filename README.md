# Credex — AI spend audit (Round 1)

**App:** [`web/`](./web/) — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, ESLint.

| Route | What it is |
|-------|------------|
| `/` | Marketing landing (ported from legacy `landing-preview.html` — CSS in `src/app/landing.css`, markup in `src/components/landing/`, scroll animations in `useLandingEffects.ts`) |
| `/audit` | Spend intake per **credex.pdf**: team size, primary use case, per tool → provider (incl. **v0**), **plan**, **seats**, monthly spend; optional label; `localStorage` persistence |
| `/audit/summary` | Saved stack summary or example-data link |

Brief: [`credex.pdf`](./credex.pdf)

## Quick start

From **repo root** (recommended):

```bash
npm install --prefix web
npm run dev
```

Or from `web/`:

```bash
cd web
npm install
npm run dev
```

`npm run dev` starts Next.js and **opens your default browser** when the server is ready (uses the `open` package).

- If nothing loads, open the URL printed in the terminal (usually **http://localhost:3000**).
- **Only one** `next dev` should run. If you see *“Another next dev server is already running”*, stop the old one, e.g. on Windows: `taskkill /PID <pid> /F` (PID is shown in the error), or close the terminal where dev was left running.
- If port **3000** is used by something else, Next may use **3001** — use the “Local:” line in the terminal.
- To skip auto-open: `cd web && npm run dev:plain`

```bash
npm run build
npm start
```

(Run `build` / `start` from repo root like `dev`, or under `web/` with `npm run build` / `npm start`.)

Implement the six MVP features from the PDF in `web/`. Add `ARCHITECTURE.md`, `DEVLOG.md`, and the other required markdown files at the **repo root** when you submit.
