import { PRODUCT_NAME } from "@/lib/product-brand";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isPublicAuditSnapshot } from "@/lib/public-audit-snapshot";
import { getRequestIp } from "@/lib/request-ip";
import { isValidShareId, newShareId } from "@/lib/share-id";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BODY = 120_000;
const LEADS_PER_IP_HOUR = 15;

function appOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "http://localhost:3000";
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

type SendEmailResult = { sent: true } | { sent: false; reason: string };

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function sendLeadEmail(to: string, shareUrl: string): Promise<SendEmailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { sent: false, reason: "RESEND_API_KEY is not set in web/.env.local" };
  const from =
    process.env.RESEND_FROM?.trim() || `${PRODUCT_NAME.replace(/"/g, "")} <onboarding@resend.dev>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Your ${PRODUCT_NAME} audit link`,
      html:
        `<p>Thanks — here is your read-only report:</p><p><a href="${escapeHtmlAttr(shareUrl)}">${escapeHtmlAttr(shareUrl)}</a></p>` +
        `<p style="color:#666;font-size:12px;margin-top:14px">Rule-based snapshot only; not financial advice.</p>`,
    }),
  });
  const raw = await res.text();
  if (res.ok) return { sent: true };
  let detail = raw.slice(0, 400);
  try {
    const j = JSON.parse(raw) as { message?: string };
    detail = j.message ?? detail;
  } catch {
    /* keep slice */
  }
  return { sent: false, reason: `Resend (${res.status}): ${detail}` };
}

export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json(
      { error: "not_configured", message: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 },
    );
  }
  const raw = await req.text();
  if (raw.length > MAX_BODY) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const honeypot = typeof body.website === "string" ? body.website : "";
  if (honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const company = typeof body.company === "string" ? body.company.trim().slice(0, 200) : "";
  const role = typeof body.role === "string" ? body.role.trim().slice(0, 120) : "";
  const teamSize = typeof body.team_size === "string" ? body.team_size.trim().slice(0, 40) : "";
  const ip = getRequestIp(req);
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: cErr } = await sb
    .from("audit_leads")
    .select("id", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since);
  if (!cErr && typeof count === "number" && count >= LEADS_PER_IP_HOUR) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let shareId = typeof body.share_id === "string" ? body.share_id.trim() : "";
  const snapshotRaw = body.snapshot;

  if (shareId && !isValidShareId(shareId)) {
    shareId = "";
  }
  if (shareId) {
    const { data: existing } = await sb.from("audit_shares").select("id").eq("id", shareId).maybeSingle();
    if (!existing) shareId = "";
  }

  if (!shareId) {
    const snap = isPublicAuditSnapshot(snapshotRaw) ? snapshotRaw : null;
    if (!snap) {
      return NextResponse.json(
        {
          error: "missing_snapshot",
          message: "Provide a valid PublicAuditSnapshot when share_id is absent or unknown.",
        },
        { status: 400 },
      );
    }
    const id = newShareId();
    const { error: insErr } = await sb.from("audit_shares").insert({ id, data: snap });
    if (insErr) {
      return NextResponse.json({ error: "db_error", message: insErr.message }, { status: 500 });
    }
    shareId = id;
  }

  const { error: leadErr } = await sb.from("audit_leads").insert({
    email,
    company: company || null,
    role: role || null,
    team_size: teamSize || null,
    share_id: shareId,
    ip,
  });
  if (leadErr) {
    return NextResponse.json({ error: "db_error", message: leadErr.message }, { status: 500 });
  }

  const origin = appOrigin();
  const shareUrl = `${origin}/r/${shareId}`;

  const emailResult = await sendLeadEmail(email, shareUrl);

  return NextResponse.json({
    ok: true,
    shareId,
    shareUrl,
    emailed: emailResult.sent,
    ...(emailResult.sent ? {} : { emailNote: emailResult.reason }),
  });
}
