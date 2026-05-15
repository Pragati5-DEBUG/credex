PROMPTS.md

LLM use in this repo is limited to the executive readout on `/audit/summary` via `POST /api/summary`. Audit savings math is not LLM-generated.

Runtime: system text is bundled in `src/lib/summary-system-prompt.ts` (keep in sync with this file). User message is built in `openai-audit-summary.ts` and `anthropic-audit-summary.ts`. If no key works or the call fails, `buildTemplateAuditSummary` in `template-audit-summary.ts` returns a deterministic paragraph (not an LLM prompt).

Keys: `OPENAI_API_KEY` and/or `ANTHROPIC_API_KEY`; optional `SUMMARY_LLM_PROVIDER` (`auto` | `openai` | `anthropic`). Default `auto` tries OpenAI then Anthropic.

## Full system prompt (Anthropic `system` / OpenAI `system` message)

```
# AiTookMySalary — audit summary (LLM)

These instructions apply when summarizing a completed audit. Keep ASCII-only for predictable tokenization.

## Role

You write a single short paragraph (about 90–110 words, never above 120 words) for a finance or engineering lead who just ran a rule-based AI tool spend audit. You do not recalculate savings. You interpret the given numbers and the given line items only.

## Hard rules

1. Treat all dollar figures and counts as facts supplied by the user message. Do not invent vendors, plans, or savings.
2. Do not ask for email, PII, or a meeting in the paragraph. No "reply to this email".
3. No markdown, no bullet list, no title — plain prose, one paragraph.
4. Mention that the math is rules/list anchors, not an LLM estimate, in one short clause.
5. If modeled monthly savings is zero or negligible, say the stack looks already tight vs public list without being dismissive.
6. Tone: concise, neutral, confident — suitable next to a compliance-minded CFO.

## User message shape

The API sends a JSON object PublicAuditSnapshot with fields: combinedMonthlyUsd, savingsMonthlyUsd, savingsAnnualUsd, savingsBand (high | moderate | low), and lines[] with vendor/plan labels, current monthly, modeled savings, and short action/reason strings.

## Output

Return only the paragraph text, with no preamble or quotes.
```

## User message (both providers)

Single user turn, exact pattern:

```
PublicAuditSnapshot JSON:
{...serialized PublicAuditSnapshot...}
```

`PublicAuditSnapshot` is PII-safe (no email or company). Serialization is `JSON.stringify(snapshot)` with no extra instructions.

## API parameters

| Provider | Default model | max_tokens | temperature |
|----------|---------------|------------|-------------|
| OpenAI | gpt-4o-mini | 400 | 0.35 |
| Anthropic | claude-haiku-4-5 | 320 | 0.35 |

Responses are trimmed to about 120 words in code if the model runs long.

## Why this prompt

- One paragraph keeps the readout scannable next to tables and share actions.
- Hard rules stop the model from redoing audit math or inventing vendors—aligned with the brief (rules for numbers, LLM for narrative only).
- Requiring a rules/list-anchor clause makes the separation obvious to a finance reader.
- Low temperature and a JSON snapshot reduce drift; the snapshot already contains actions and reasons from `runAudit`.
- ASCII-only system text avoids tokenization surprises in logs and docs.

## What we tried that did not work

- Asking the model to "recommend" new tools or dollar amounts not in the snapshot—it hallucinated vendors and savings.
- Longer multi-section output (headline + bullets)—cluttered the summary UI and read like a second audit.
- Pasting raw intake (email, company, full form) into the user message—dropped for share safety; only `PublicAuditSnapshot` is sent.
- Relying on the LLM alone without `buildTemplateAuditSummary`—failed deploys and missing keys left the page empty; template fallback is required.
- Letting the model write marketing copy or Credex consultation CTAs in the paragraph—removed; CTAs stay in UI bands, not the LLM readout.

## Fallback (not LLM)

When `runSummaryLlm` fails or no provider key is set, the API returns `buildTemplateAuditSummary(snapshot)`: fixed sentence templates using the same snapshot fields (totals, band, top one or two savings lines, rules/list disclaimer). No prompt is sent.
