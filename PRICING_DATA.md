# PRICING_DATA

**Credex Round 1 — audit engine source of truth**

This file is the paper trail for every **list-price** number the engine uses. The implementation lives in:

`web/src/lib/audit-engine/pricing-catalog.ts`

When a vendor changes pricing, update **this document and that file in the same commit**.

---

## At a glance

| Field | Value |
|--------|--------|
| **Currency** | USD (unless noted) |
| **Verified as-of** | 2026-05-10 (submission week) |
| **Rule** | Every numeric anchor must map to an official vendor URL below |

---

## Table of contents

1. [How reviewers use this file](#how-reviewers-use-this-file)
2. [Source index (IDs → URLs)](#source-index-ids--urls)
3. [Column legend](#column-legend)
4. [Cursor](#cursor)
5. [GitHub Copilot](#github-copilot)
6. [Claude](#claude)
7. [ChatGPT](#chatgpt)
8. [Anthropic API & OpenAI API](#anthropic-api--openai-api)
9. [Gemini](#gemini)
10. [Windsurf](#windsurf)
11. [v0](#v0)
12. [Credex credits (positioning)](#credex-credits-positioning)

---

## How reviewers use this file

1. **Spot-check**: Pick a number in `pricing-catalog.ts`, find the matching row here, open the URL.
2. **Stale pricing**: If the live page disagrees, update the table and the catalog together.
3. **“Approximate” rows**: Treat savings that depend on them as directional until you re-verify on the live pricing page.

---

## Source index (IDs → URLs)

These IDs are referenced from the catalog code (`sourceId` fields).

| ID | Product | Official pricing URL |
|----|-----------|------------------------|
| `SRC_CURSOR` | Cursor | https://www.cursor.com/pricing |
| `SRC_CURSOR_DOC` | Cursor — account / billing help | https://cursor.com/docs/account/pricing |
| `SRC_GH_COPILOT` | GitHub Copilot | https://github.com/features/copilot/plans |
| `SRC_GH_COPILOT_DOC` | Copilot — subscription plans (docs) | https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot |
| `SRC_CLAUDE` | Claude (consumer) | https://www.claude.com/pricing |
| `SRC_CLAUDE_TEAM` | Claude Team — help center | https://support.anthropic.com/en/articles/9266767-what-is-the-claude-team-plan |
| `SRC_OPENAI` | ChatGPT / OpenAI consumer & business plans | https://openai.com/pricing/ |
| `SRC_OPENAI_TEAM` | ChatGPT Business (incl. former Team) | https://help.openai.com/en/articles/8792828-what-is-chatgpt-team |
| `SRC_GOOGLE_AI` | Google AI / Gemini (Google One AI plans) | https://one.google.com/about/google-ai-plans/ |
| `SRC_OPENAI_API` | OpenAI API | https://openai.com/api/pricing/ |
| `SRC_ANTHROPIC_API` | Anthropic API | https://www.claude.com/platform/api |
| `SRC_WINDSURF` | Windsurf | https://windsurf.com/pricing |
| `SRC_V0` | v0 (Vercel) | https://v0.app/pricing |

---

## Column legend

Tables below use the same columns:

| Column | Meaning |
|--------|---------|
| **Intake label** | Exact-ish label from the `/audit` form |
| **Engine** | How `pricing-catalog.ts` maps that label to a monthly total |
| **List (USD/mo)** | Anchor used in math (`—` = no fixed list / custom / usage) |
| **Sources** | Which source IDs above justify the row |
| **Notes** | Seat rules, renames (PDF vs vendor site), caveats |

---

## Cursor

**Sources:** `SRC_CURSOR`, `SRC_CURSOR_DOC`

| Intake label | Engine | List (USD/mo) | Sources | Notes |
|--------------|--------|---------------|---------|-------|
| Hobby | $0 / user / mo | **0** | SRC_CURSOR | Free tier |
| Pro | $20 / user / mo | **20** | SRC_CURSOR | Consumer Pro |
| Pro+ | $60 / user / mo | **60** | SRC_CURSOR | Listed on pricing page |
| Ultra | $200 / user / mo | **200** | SRC_CURSOR | Listed on pricing page |
| Business | Treated as **Teams** on cursor.com | **40 / user / mo** | SRC_CURSOR | PDF says “Business”; vendor UI says “Teams” |
| Enterprise | Custom / contact sales | **—** | SRC_CURSOR | Engine does **not** assume a list total |

---

## GitHub Copilot

**Sources:** `SRC_GH_COPILOT`, `SRC_GH_COPILOT_DOC`

| Intake label | Engine | List (USD/mo) | Sources | Notes |
|--------------|--------|---------------|---------|-------|
| Individual | Mapped to **Copilot Pro** (paid individual) | **10 / user / mo** | SRC_GH_COPILOT | Marketing page lists “Pro”; PDF intake uses “Individual” |
| Business | **Copilot Business** (org seat) | **19 / user / mo** | SRC_GH_COPILOT | Re-check for your submission week / region |
| Enterprise | Enterprise / custom | **—** | SRC_GH_COPILOT_DOC | No assumed list total |

> **Heads-up:** GitHub has announced future Copilot billing changes. Re-open the official plans page before you submit.

---

## Claude

**Sources:** `SRC_CLAUDE`, `SRC_CLAUDE_TEAM`

| Intake label | Engine | List (USD/mo) | Sources | Notes |
|--------------|--------|---------------|---------|-------|
| Free | $0 | **0** | SRC_CLAUDE | |
| Pro | Individual Pro, **monthly** anchor | **20** | SRC_CLAUDE | Site shows lower annual; engine uses **monthly** for comparability |
| Max | **Max 5×** single-workspace anchor | **100** | SRC_CLAUDE | Intake has one “Max”; engine uses 5× tier as conservative default |
| Team | Standard seat, **monthly** | **25 / seat / mo** | SRC_CLAUDE, SRC_CLAUDE_TEAM | **Minimum 5 members** on Team — engine only applies Team list when `seats ≥ 5` |
| Enterprise | Custom | **—** | SRC_CLAUDE | |
| API direct | Usage-based | **—** | SRC_ANTHROPIC_API | No fixed monthly; engine skips list-only comparisons |

---

## ChatGPT

**Sources:** `SRC_OPENAI`, `SRC_OPENAI_TEAM`

| Intake label | Engine | List (USD/mo) | Sources | Notes |
|--------------|--------|---------------|---------|-------|
| Plus | Plus (single-seat style) | **20** | SRC_OPENAI | See openai.com/pricing |
| Team | Treated as **Business** workspace seat | **25 / user / mo** | SRC_OPENAI, SRC_OPENAI_TEAM | Engine uses **monthly** list; **minimum 2 seats** — engine enforces `seats ≥ 2` |
| Enterprise | Custom | **—** | SRC_OPENAI | |
| API direct | Usage-based | **—** | SRC_OPENAI_API | No fixed monthly |

> **Plus vs seats:** The catalog treats **Plus** as a **single-seat** list price (`$20`). Workspace **Team/Business** pricing applies when `seats ≥ 2`.

---

## Anthropic API & OpenAI API

**Sources:** `SRC_ANTHROPIC_API`, `SRC_OPENAI_API`

| Situation | Engine behavior |
|-----------|-----------------|
| Intake = usage / committed / “not sure” | **No** guaranteed monthly list total |
| Audit output | Same-vendor guidance only where rules allow; no invented usage dollars |

---

## Gemini

**Source:** `SRC_GOOGLE_AI`

| Intake label | Engine | List (USD/mo) | Sources | Notes |
|--------------|--------|---------------|---------|-------|
| Pro | Google AI Pro (Gemini) anchor | **20 × seats** (min 1) | SRC_GOOGLE_AI | Rounded; confirm local currency bundle on one.google.com |
| Ultra | Ultra-tier consumer anchor | **250 × seats** (min 1) | SRC_GOOGLE_AI | **Approximate** — re-verify before treating savings as precise |
| API | Usage | **—** | SRC_GOOGLE_AI / API docs | No fixed monthly in engine |

---

## Windsurf

**Source:** `SRC_WINDSURF`

| Intake label | Engine | List (USD/mo) | Sources | Notes |
|--------------|--------|---------------|---------|-------|
| Individual / Pro | Pro-style seat | **15 × seats** | SRC_WINDSURF | **Approximate** — confirm on windsurf.com/pricing |
| Team | Team seat | **60 × seats** | SRC_WINDSURF | **Approximate** |
| Enterprise | Custom | **—** | SRC_WINDSURF | |
| Not sure | No SKU match | **—** | — | Engine treats as **no list anchor** |

---

## v0

**Source:** `SRC_V0`

| Intake label | Engine | List (USD/mo) | Sources | Notes |
|--------------|--------|---------------|---------|-------|
| Individual / Pro | Pro anchor | **20 × seats** (min 1) | SRC_V0 | **Approximate** — verify v0.app/pricing |
| Team | Team seat | **30 × seats** | SRC_V0 | **Approximate** |
| Enterprise | Custom | **—** | SRC_V0 | |

---

## Credex credits (positioning)

The product brief asks you to explain **retail vs Credex credits** for teams that still pay list after optimizations.

| Topic | Policy in this repo |
|--------|---------------------|
| Discount % | **Not** hardcoded as a fake precision number |
| UI / copy | May mention credits when modeled savings are already **high** (see audit UI + `run-audit.ts`) |
| Finance story | Credits are a **follow-on conversation**, not a silent multiplier in the engine |

---

*End of PRICING_DATA — keep in sync with `pricing-catalog.ts`.*
