Automated tests

From the repo root:

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

Lint (also runs in CI):

```bash
npm run lint
```

CI

GitHub Actions workflow: .github/workflows/ci.yml

On every push to main: npm ci, npm run lint, npm run test (Node 20).

Audit engine (Vitest) — 5 tests minimum

File: src/lib/audit-engine/run-audit.test.ts

- recommends Cursor Pro list when Business is overstated vs list
- aligns spend when above list on same tier
- does not invent savings when list matches spend (mixed = no cross-vendor churn)
- returns zero modeled savings for API usage rows
- classifies savings band for PDF thresholds (high / moderate / low)

Other

File: src/lib/public-audit-snapshot.test.ts

- maps audit lines to a PII-safe public snapshot and validates shape

Total: 6 tests (5 on the audit engine).
