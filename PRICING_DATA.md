# PRICING_DATA — Credex audit engine

All **list-price numbers** used by `web/src/lib/audit-engine/pricing-catalog.ts` are documented here with **official sources**. When vendors change prices, update **both** this file and the catalog in the same commit.

**As-of:** 2026-05-10 (submission week). Currency: **USD** unless noted.

---

## Source index

| ID | Vendor / product | Official pricing URL |
|----|------------------|----------------------|
| SRC_CURSOR | Cursor | https://www.cursor.com/pricing |
| SRC_CURSOR_DOC | Cursor account pricing help | https://cursor.com/docs/account/pricing |
| SRC_GH_COPILOT | GitHub Copilot | https://github.com/features/copilot/plans |
| SRC_GH_COPILOT_DOC | Copilot plans (docs) | https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot |
| SRC_CLAUDE | Claude (Anthropic consumer) | https://www.claude.com/pricing |
| SRC_CLAUDE_TEAM | Claude Team (help) | https://support.anthropic.com/en/articles/9266767-what-is-the-claude-team-plan |
| SRC_OPENAI | ChatGPT / OpenAI plans | https://openai.com/pricing/ |
| SRC_OPENAI_TEAM | ChatGPT Business (incl. former Team) | https://help.openai.com/en/articles/8792828-what-is-chatgpt-team |
| SRC_GOOGLE_AI | Google AI / Gemini (Google One AI) | https://one.google.com/about/google-ai-plans/ |
| SRC_OPENAI_API | OpenAI API pricing | https://openai.com/api/pricing/ |
| SRC_ANTHROPIC_API | Anthropic API pricing | https://www.claude.com/platform/api |
| SRC_WINDSURF | Windsurf | https://windsurf.com/pricing |
| SRC_V0 | v0 by Vercel | https://v0.app/pricing |

---

## Cursor (SRC_CURSOR, SRC_CURSOR_DOC)

| Plan label (intake) | Rule in engine | List USD | Notes |
|---------------------|----------------|----------|--------|
| Hobby | $0 / user / mo | 0 | Free tier. |
| Pro | $20 / user / mo | 20 | Individual Pro. |
| Pro+ | $60 / user / mo | 60 | Listed on pricing page. |
| Ultra | $200 / user / mo | 200 | Listed on pricing page. |
| Business | Same as **Teams** on site | **40 / user / mo** | PDF says “Business”; Cursor site uses “Teams”. |
| Enterprise | custom | — | Engine does not assume a list price. |

---

## GitHub Copilot (SRC_GH_COPILOT, SRC_GH_COPILOT_DOC)

| Plan label (intake) | Rule in engine | List USD | Notes |
|---------------------|----------------|----------|--------|
| Individual | Treated as **Copilot Pro** (individual paid) | **10 / user / mo** | Site lists “Pro”; intake uses “Individual” from PDF. |
| Business | **Copilot Business** (org) | **19 / user / mo** | Common org list price; confirm on GitHub for your date/region. |
| Enterprise | custom | — | No assumed list price. |

GitHub has announced future billing changes; re-check before submission.

---

## Claude (SRC_CLAUDE, SRC_CLAUDE_TEAM)

| Plan label | Rule in engine | List USD | Notes |
|------------|----------------|----------|--------|
| Free | $0 | 0 | |
| Pro | $20 / mo | 20 | Individual; billed monthly (annual lower on site—engine uses monthly for comparability). |
| Max | **Max 5×** list | **100 / mo** | Intake has single “Max”; engine uses 5× tier as conservative default. |
| Team | Standard seat, monthly | **25 / seat / mo** | Team plan **minimum 5 members** per Anthropic help article—engine enforces `seats ≥ 5`. |
| Enterprise | custom | — | |
| API direct | usage | — | No fixed monthly; engine skips list-price comparison. |

---

## ChatGPT (SRC_OPENAI, SRC_OPENAI_TEAM)

| Plan label | Rule in engine | List USD | Notes |
|------------|----------------|----------|--------|
| Plus | Plus monthly | **20 / mo** | Single-seat style pricing on openai.com/pricing. |
| Team | Treated as **Business** workspace seat | **25 / user / mo** | Help center cites monthly vs annual; engine uses **monthly** list. **Minimum 2 users** for Business—engine enforces `seats ≥ 2`. |
| Enterprise | custom | — | |
| API direct | usage | — | No fixed monthly. |

---

## Anthropic API / OpenAI API (SRC_ANTHROPIC_API, SRC_OPENAI_API)

Usage-based only. Engine returns **no guaranteed list monthly**; recommendations are same-vendor “verify usage” only when applicable.

---

## Gemini (SRC_GOOGLE_AI)

| Plan label | Rule in engine | List USD | Notes |
|------------|----------------|----------|--------|
| Pro | Google AI Pro (Gemini) | **20 / mo** | Rounded; verify exact local price on one.google.com. |
| Ultra | Higher consumer tier | **250 / mo** | **Approximate** list anchor—re-verify on Google’s live page before relying on savings. |
| API | usage | — | No fixed monthly. |

---

## Windsurf (SRC_WINDSURF)

| Plan label | Rule in engine | List USD | Notes |
|------------|----------------|----------|--------|
| Individual / Pro | Pro | **15 / user / mo** | **Approximate**—confirm on windsurf.com/pricing. |
| Team | Team | **60 / user / mo** | **Approximate**—confirm on site. |
| Enterprise | custom | — | |
| Not sure | — | — | Treated like no list price. |

---

## v0 (SRC_V0)

| Plan label | Rule in engine | List USD | Notes |
|------------|----------------|----------|--------|
| Individual / Pro | Pro | **20 / mo** | **Approximate** starter anchor—verify on v0.app/pricing. |
| Team | Team seat | **30 / user / mo** | **Approximate**—verify on site. |
| Enterprise | custom | — | |

---

## Credex credits (marketing, not a formula)

The brief asks to flag when teams pay **retail** and could buy through **Credex credits**. The engine does **not** invent a discount percentage; the UI may mention credits when savings are already high (see `run-audit.ts` / product copy).
