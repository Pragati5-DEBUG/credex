/**
 * Spend form scope — matches credex.pdf MVP #1 (tool list + plan tiers + seats + team + use case).
 */
import type { PrimaryUseCase, VendorSlug } from "@/types/audit";

export const VENDOR_OPTIONS: { slug: VendorSlug; label: string }[] = [
  { slug: "cursor", label: "Cursor" },
  { slug: "copilot", label: "GitHub Copilot" },
  { slug: "claude", label: "Claude" },
  { slug: "chatgpt", label: "ChatGPT" },
  { slug: "anthropic-api", label: "Anthropic API (direct)" },
  { slug: "openai-api", label: "OpenAI API (direct)" },
  { slug: "gemini", label: "Gemini" },
  { slug: "windsurf", label: "Windsurf" },
  { slug: "v0", label: "v0" },
];

/** Plan tiers per PDF (API “direct” lines use billing-style options). */
export const PLANS_BY_VENDOR: Record<VendorSlug, readonly string[]> = {
  cursor: ["Hobby", "Pro", "Business", "Enterprise"],
  copilot: ["Individual", "Business", "Enterprise"],
  claude: ["Free", "Pro", "Max", "Team", "Enterprise", "API direct"],
  chatgpt: ["Plus", "Team", "Enterprise", "API direct"],
  "anthropic-api": ["Usage-based (on-demand)", "Committed / contract", "Not sure"],
  "openai-api": ["Usage-based (on-demand)", "Committed / contract", "Not sure"],
  gemini: ["Pro", "Ultra", "API"],
  windsurf: ["Individual / Pro", "Team", "Enterprise", "Not sure"],
  v0: ["Individual / Pro", "Team", "Enterprise", "Not sure"],
};

export const PRIMARY_USE_CASE_OPTIONS: { value: PrimaryUseCase; label: string }[] = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed" },
];

export const VENDOR_LABELS: Record<VendorSlug, string> = Object.fromEntries(
  VENDOR_OPTIONS.map((v) => [v.slug, v.label]),
) as Record<VendorSlug, string>;
