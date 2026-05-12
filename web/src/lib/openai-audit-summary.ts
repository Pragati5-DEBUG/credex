import type { PublicAuditSnapshot } from "@/lib/public-audit-snapshot";

const DEFAULT_MODEL = "gpt-4o-mini";

export type OpenAiSummaryOutcome =
  | { ok: true; text: string }
  | { ok: false; error: string };

function clipWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ").trim() + "…";
}

export async function summarizeWithOpenAI(
  snapshot: PublicAuditSnapshot,
  systemPrompt: string,
): Promise<OpenAiSummaryOutcome> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return { ok: false, error: "missing OPENAI_API_KEY" };

  const model = process.env.OPENAI_SUMMARY_MODEL?.trim() || DEFAULT_MODEL;
  const user = `PublicAuditSnapshot JSON:\n${JSON.stringify(snapshot)}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      temperature: 0.35,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: user },
      ],
    }),
  });

  const rawBody = await res.text();

  if (!res.ok) {
    let detail = rawBody.slice(0, 600);
    try {
      const j = JSON.parse(rawBody) as { error?: { message?: string } };
      detail = j.error?.message ?? detail;
    } catch {
      /* use raw slice */
    }
    return { ok: false, error: `openai HTTP ${res.status}: ${detail}` };
  }

  let data: { choices?: Array<{ message?: { content?: string | null } }> };
  try {
    data = JSON.parse(rawBody);
  } catch {
    return { ok: false, error: "openai returned non-JSON body" };
  }

  const content = data.choices?.[0]?.message?.content;
  const extracted = typeof content === "string" ? content.trim() : "";
  if (!extracted) {
    return {
      ok: false,
      error: `openai empty completion (model=${model}): ${rawBody.slice(0, 600)}`,
    };
  }

  return { ok: true, text: clipWords(extracted, 120) };
}
