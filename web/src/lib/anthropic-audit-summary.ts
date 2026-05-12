import type { PublicAuditSnapshot } from "@/lib/public-audit-snapshot";

const ANTHROPIC_VERSION = "2023-06-01";

/** Default when `ANTHROPIC_MODEL` is unset — use a current alias; override in `.env.local` if your org requires a pinned id. */
const DEFAULT_MODEL = "claude-haiku-4-5";

export type AnthropicSummaryOutcome =
  | { ok: true; text: string }
  | { ok: false; error: string };

function extractAssistantText(content: unknown): string | null {
  if (typeof content === "string") {
    const t = content.trim();
    return t.length > 0 ? t : null;
  }
  if (!Array.isArray(content)) return null;
  const chunks: string[] = [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const b = block as Record<string, unknown>;
    if (typeof b.text === "string" && b.text.trim().length > 0) {
      chunks.push(b.text.trim());
    }
  }
  const joined = chunks.join("\n\n").trim();
  return joined.length > 0 ? joined : null;
}

function clipWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ").trim() + "…";
}

export async function summarizeWithAnthropic(
  snapshot: PublicAuditSnapshot,
  systemPrompt: string,
): Promise<AnthropicSummaryOutcome> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return { ok: false, error: "missing ANTHROPIC_API_KEY" };

  const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
  const user = `PublicAuditSnapshot JSON:\n${JSON.stringify(snapshot)}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: 320,
      temperature: 0.35,
      system: systemPrompt,
      messages: [{ role: "user", content: user }],
    }),
  });

  const rawBody = await res.text();

  if (!res.ok) {
    let detail = rawBody.slice(0, 600);
    try {
      const j = JSON.parse(rawBody) as { error?: { message?: string }; message?: string };
      detail = j.error?.message ?? j.message ?? detail;
    } catch {
      /* use raw slice */
    }
    return { ok: false, error: `anthropic HTTP ${res.status}: ${detail}` };
  }

  let data: { content?: unknown };
  try {
    data = JSON.parse(rawBody) as { content?: unknown };
  } catch {
    return { ok: false, error: "anthropic returned non-JSON body" };
  }

  const extracted = extractAssistantText(data.content);
  if (!extracted) {
    return {
      ok: false,
      error: `anthropic no assistant text (model=${model}): ${rawBody.slice(0, 900)}`,
    };
  }

  const text = clipWords(extracted, 120);
  return { ok: true, text };
}
