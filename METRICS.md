# Metrics

## North Star

**Qualified audits completed per week where the user both (a) sees results and (b) optionally leaves an email or copies a share link.**

Why: this product is ** episodic** — people don’t open it daily like a chat app. The healthy signal is **completed audits that create a lead artifact** (email capture or share URL), not raw pageviews.

## Three input metrics

1. **Audit completion rate** — started `/audit` → reached `/audit/summary` with a valid stack. Shows friction in the form, not vanity traffic.
2. **Share or email rate** — % of completions that trigger **`/api/share`** or **`/api/leads`**. Measures trust after value is shown (aligned with “email after value” positioning).
3. **High-band share rate** — among completions, % with **savings band = high** (per your thresholds). Surfaces whether messaging attracts underspending teams vs already-optimized stacks.

## What to instrument first

- **Client:** completion funnel steps (tool count distribution, drop-off if you add steps later).
- **Server:** `POST /api/leads` and `POST /api/share` counts by day; Resend delivery events if available.
- **Business:** manual tagging of **consultations booked** from high-band leads until CRM exists.

## Pivot trigger

If **completion → email/share** stays **&lt;5%** after **500** completions from intentional traffic (not bots), assume **value perception or trust** is broken — revisit copy, methodology transparency, or whether the audit differential is visible enough before asking for contact.

If completions are high but **every** audit shows **low** modeled savings, the tool still helps honesty — but **lead quality** for Credex credits may be weak; pivot messaging toward “peace of mind / benchmark” rather than overspend rescue.
