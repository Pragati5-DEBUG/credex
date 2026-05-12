# Automated tests

Run from **`web/`**:

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

## Audit engine (Vitest)

| File | What it covers |
|------|----------------|
| [`web/src/lib/audit-engine/run-audit.test.ts`](web/src/lib/audit-engine/run-audit.test.ts) | **5 tests** on `runAudit`: Cursor Business → cheaper Pro tier savings; spend alignment on same tier; no invented savings when list matches; API usage rows; PDF savings-band thresholds (`high` / `moderate` / `low`). |

## Other

| File | What it covers |
|------|----------------|
| [`web/src/lib/public-audit-snapshot.test.ts`](web/src/lib/public-audit-snapshot.test.ts) | `buildPublicSnapshot` maps audit lines to a PII-safe public payload and validates shape. |

**Total:** 6 tests (5 specifically on the audit engine per assignment minimum).
