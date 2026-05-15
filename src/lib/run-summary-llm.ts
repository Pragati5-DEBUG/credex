import type { PublicAuditSnapshot } from "@/lib/public-audit-snapshot";
import { summarizeWithAnthropic } from "@/lib/anthropic-audit-summary";
import { summarizeWithOpenAI } from "@/lib/openai-audit-summary";

export type SummaryLlmProvider = "openai" | "anthropic";

export type SummaryLlmResult =
  | { ok: true; text: string; provider: SummaryLlmProvider }
  | { ok: false; attempted: boolean; error: string };

/**
 * `SUMMARY_LLM_PROVIDER`:
 * - `auto` (default): try OpenAI if `OPENAI_API_KEY` is set, then Anthropic if `ANTHROPIC_API_KEY` is set.
 * - `openai` / `anthropic`: only that provider (requires matching key).
 */
export async function runSummaryLlm(
  snapshot: PublicAuditSnapshot,
  systemPrompt: string,
): Promise<SummaryLlmResult> {
  const mode = (process.env.SUMMARY_LLM_PROVIDER?.trim().toLowerCase() || "auto") as
    | "auto"
    | "openai"
    | "anthropic";

  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasAnthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim());

  const order: SummaryLlmProvider[] =
    mode === "openai" ? ["openai"] : mode === "anthropic" ? ["anthropic"] : ["openai", "anthropic"];

  let lastError = "set OPENAI_API_KEY and/or ANTHROPIC_API_KEY";
  let attempted = false;

  for (const provider of order) {
    if (provider === "openai" && !hasOpenAI) continue;
    if (provider === "anthropic" && !hasAnthropic) continue;

    attempted = true;
    const outcome =
      provider === "openai"
        ? await summarizeWithOpenAI(snapshot, systemPrompt)
        : await summarizeWithAnthropic(snapshot, systemPrompt);

    if (outcome.ok) {
      return { ok: true, text: outcome.text, provider };
    }
    lastError = outcome.error;

    if (mode !== "auto") break;
  }

  return { ok: false, attempted, error: lastError };
}
