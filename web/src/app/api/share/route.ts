import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isPublicAuditSnapshot } from "@/lib/public-audit-snapshot";
import { isValidShareId, newShareId } from "@/lib/share-id";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BODY = 120_000;

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
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const snap = (body as { snapshot?: unknown })?.snapshot;
  if (!isPublicAuditSnapshot(snap)) {
    return NextResponse.json({ error: "invalid_snapshot" }, { status: 400 });
  }
  const requestedId = (body as { id?: unknown }).id;
  const id =
    typeof requestedId === "string" && isValidShareId(requestedId) ? requestedId : newShareId();
  const { error } = await sb.from("audit_shares").insert({ id, data: snap });
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "id_collision", message: "Retry with a new id." }, { status: 409 });
    }
    return NextResponse.json({ error: "db_error", message: error.message }, { status: 500 });
  }
  return NextResponse.json({ id, urlPath: `/r/${id}` });
}
