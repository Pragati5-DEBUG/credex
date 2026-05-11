/**
 * Conservative cross-vendor suggestions: same *category* for the stated primary use case,
 * compared on **list prices** only (see PRICING_DATA.md).
 */
import type { PrimaryUseCase, VendorSlug } from "@/types/audit";
import { minListedMonthlyAcrossVendor } from "./pricing-catalog";

export interface CrossVendorPick {
  vendor: VendorSlug;
  monthlyUsd: number;
  defId: string;
  sourceId: string;
  reasonOneLiner: string;
}

function codingAlts(from: VendorSlug): VendorSlug[] {
  const m: Partial<Record<VendorSlug, VendorSlug[]>> = {
    cursor: ["copilot", "windsurf"],
    copilot: ["cursor", "windsurf"],
    windsurf: ["cursor", "copilot"],
    v0: ["cursor"],
  };
  return m[from] ?? [];
}

function writingAlts(from: VendorSlug): VendorSlug[] {
  const m: Partial<Record<VendorSlug, VendorSlug[]>> = {
    chatgpt: ["claude", "gemini"],
    claude: ["chatgpt", "gemini"],
    gemini: ["chatgpt", "claude"],
  };
  return m[from] ?? [];
}

function dataResearchAlts(from: VendorSlug): VendorSlug[] {
  const m: Partial<Record<VendorSlug, VendorSlug[]>> = {
    chatgpt: ["claude", "gemini"],
    claude: ["chatgpt", "gemini"],
    gemini: ["chatgpt", "claude"],
    "openai-api": ["anthropic-api"],
    "anthropic-api": ["openai-api"],
  };
  return m[from] ?? [];
}

export function crossVendorFloors(
  useCase: PrimaryUseCase | "",
  fromVendor: VendorSlug,
  seats: number,
  teamSize: number,
): CrossVendorPick[] {
  const ts = teamSize >= 1 ? teamSize : seats;
  let neighbors: VendorSlug[] = [];
  if (useCase === "coding") neighbors = codingAlts(fromVendor);
  else if (useCase === "writing") neighbors = writingAlts(fromVendor);
  else if (useCase === "data" || useCase === "research") neighbors = dataResearchAlts(fromVendor);
  else if (useCase === "mixed") neighbors = []; // same-vendor only for mixed

  const out: CrossVendorPick[] = [];
  for (const v of neighbors) {
    const hit = minListedMonthlyAcrossVendor(v, seats, ts);
    if (!hit) continue;
    out.push({
      vendor: v,
      monthlyUsd: hit.monthlyUsd,
      defId: hit.defId,
      sourceId: hit.sourceId,
      reasonOneLiner: reasonFor(useCase, fromVendor, v),
    });
  }
  return out;
}

function reasonFor(
  useCase: PrimaryUseCase | "",
  from: VendorSlug,
  to: VendorSlug,
): string {
  if (useCase === "coding") {
    return `For coding, ${label(to)} is in the same audit bucket as ${label(from)}; compare features, then decide—savings are from published list prices (see PRICING_DATA.md).`;
  }
  if (useCase === "writing") {
    return `For writing workloads, ${label(to)} is treated as a comparable chat workspace in our rules; confirm tone, privacy, and connectors before switching.`;
  }
  return `Listed ${label(to)} total undercuts your current ${label(from)} row at public prices—validate fit for ${useCase || "your"} workflows.`;
}

function label(v: VendorSlug): string {
  const names: Record<VendorSlug, string> = {
    cursor: "Cursor",
    copilot: "GitHub Copilot",
    claude: "Claude",
    chatgpt: "ChatGPT",
    "anthropic-api": "Anthropic API",
    "openai-api": "OpenAI API",
    gemini: "Gemini",
    windsurf: "Windsurf",
    v0: "v0",
  };
  return names[v] ?? v;
}
