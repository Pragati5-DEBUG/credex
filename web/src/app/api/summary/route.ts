import { buildTemplateAuditSummary } from "@/lib/template-audit-summary";
import { runSummaryLlm } from "@/lib/run-summary-llm";
import { CREDEX_SUMMARY_SYSTEM_PROMPT } from "@/lib/summary-system-prompt";
import { isPublicAuditSnapshot } from "@/lib/public-audit-snapshot";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const snap = (body as { snapshot?: unknown })?.snapshot;
  if (!isPublicAuditSnapshot(snap)) {
    return NextResponse.json({ error: "invalid_snapshot" }, { status: 400 });
  }
  const system = CREDEX_SUMMARY_SYSTEM_PROMPT;
  let source: "llm" | "fallback" = "fallback";
  let text = buildTemplateAuditSummary(snap);
  let provider: "openai" | "anthropic" | undefined;
  let llmAttempted = false;
  let llmError: string | null = null;
  try {
    const outcome = await runSummaryLlm(snap, system);
    llmAttempted = outcome.ok ? true : outcome.attempted;
    if (outcome.ok) {
      text = outcome.text;
      source = "llm";
      provider = outcome.provider;
    } else {
      llmError = outcome.error;
    }
  } catch {
    source = "fallback";
    text = buildTemplateAuditSummary(snap);
    llmError = "LLM request threw (network or parse error)";
  }
  return NextResponse.json({
    text,
    source,
    provider,
    debug:
      llmAttempted && llmError
        ? { llmAttempted, llmError }
        : !llmAttempted && llmError
          ? { llmAttempted: false, llmError }
          : undefined,
  });
}
