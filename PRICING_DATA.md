PRICING_DATA

List-price sources for the audit engine (`web/src/lib/audit-engine/pricing-catalog.ts`). Update this file and the catalog together when a vendor changes pricing.

Verified as-of: 2026-05-10 (submission week). Currency: USD unless noted.

Source index (catalog `sourceId`)

| ID | Official pricing URL |
|----|----------------------|
| SRC_CURSOR | https://www.cursor.com/pricing |
| SRC_CURSOR_DOC | https://cursor.com/docs/account/pricing |
| SRC_GH_COPILOT | https://github.com/features/copilot/plans |
| SRC_GH_COPILOT_DOC | https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot |
| SRC_CLAUDE | https://www.claude.com/pricing |
| SRC_CLAUDE_TEAM | https://support.anthropic.com/en/articles/9266767-what-is-the-claude-team-plan |
| SRC_OPENAI | https://openai.com/pricing/ |
| SRC_OPENAI_TEAM | https://help.openai.com/en/articles/8792828-what-is-chatgpt-team |
| SRC_GOOGLE_AI | https://one.google.com/about/google-ai-plans/ |
| SRC_OPENAI_API | https://openai.com/api/pricing/ |
| SRC_ANTHROPIC_API | https://www.claude.com/platform/api |
| SRC_WINDSURF | https://windsurf.com/pricing |
| SRC_V0 | https://v0.app/pricing |

## Cursor

- Hobby: $0/user/month — https://www.cursor.com/pricing — verified 2026-05-10
- Pro: $20/user/month — https://www.cursor.com/pricing — verified 2026-05-10
- Pro+: $60/user/month — https://www.cursor.com/pricing — verified 2026-05-10
- Ultra: $200/user/month — https://www.cursor.com/pricing — verified 2026-05-10
- Business (Teams on site): $40/user/month — https://www.cursor.com/pricing — verified 2026-05-10
- Enterprise: custom / contact sales — https://www.cursor.com/pricing — verified 2026-05-10 (no list total in engine)

## GitHub Copilot

- Individual (Pro on site): $10/user/month — https://github.com/features/copilot/plans — verified 2026-05-10
- Business: $19/user/month — https://github.com/features/copilot/plans — verified 2026-05-10
- Enterprise: custom — https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot — verified 2026-05-10 (no list total in engine)

## Claude

- Free: $0 — https://www.claude.com/pricing — verified 2026-05-10
- Pro: $20/month (monthly anchor) — https://www.claude.com/pricing — verified 2026-05-10
- Max: $100/month (Max 5× anchor for intake “Max”) — https://www.claude.com/pricing — verified 2026-05-10
- Team: $25/seat/month (minimum 5 seats) — https://www.claude.com/pricing — verified 2026-05-10
- Enterprise: custom — https://www.claude.com/pricing — verified 2026-05-10 (no list total in engine)
- API direct: usage-based — https://www.claude.com/platform/api — verified 2026-05-10 (no fixed monthly list in engine)

## ChatGPT

- Plus: $20/month (single-seat anchor) — https://openai.com/pricing/ — verified 2026-05-10
- Team (Business seat): $25/user/month (minimum 2 seats) — https://openai.com/pricing/ — verified 2026-05-10
- Enterprise: custom — https://openai.com/pricing/ — verified 2026-05-10 (no list total in engine)
- API direct: usage-based — https://openai.com/api/pricing/ — verified 2026-05-10 (no fixed monthly list in engine)

## Anthropic API (direct)

- Usage-based pricing only — https://www.claude.com/platform/api — verified 2026-05-10 (engine does not invent monthly totals)

## OpenAI API (direct)

- Usage-based pricing only — https://openai.com/api/pricing/ — verified 2026-05-10 (engine does not invent monthly totals)

## Gemini

- Pro: ~$20/seat/month (Google AI Pro bundle; confirm on site) — https://one.google.com/about/google-ai-plans/ — verified 2026-05-10
- Ultra: ~$250/seat/month (approximate bundle anchor) — https://one.google.com/about/google-ai-plans/ — verified 2026-05-10
- API: usage-based — https://one.google.com/about/google-ai-plans/ — verified 2026-05-10 (no fixed monthly list in engine)

## Windsurf

- Individual / Pro: ~$15/seat/month — https://windsurf.com/pricing — verified 2026-05-10
- Team: ~$60/seat/month — https://windsurf.com/pricing — verified 2026-05-10
- Enterprise: custom — https://windsurf.com/pricing — verified 2026-05-10 (no list total in engine)

## v0

- Individual / Pro: ~$20/seat/month — https://v0.app/pricing — verified 2026-05-10
- Team: ~$30/seat/month — https://v0.app/pricing — verified 2026-05-10
- Enterprise: custom — https://v0.app/pricing — verified 2026-05-10 (no list total in engine)

## Credex credits (positioning)

- Retail vs Credex credits is explained in product copy for high-savings audits; discount % is not hardcoded in the engine — https://www.credex.rocks/ — verified 2026-05-10 (positioning only, not a list-price multiplier)
