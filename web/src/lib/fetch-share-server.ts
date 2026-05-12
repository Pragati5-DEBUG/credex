import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { PublicAuditSnapshot } from "@/lib/public-audit-snapshot";
import { isPublicAuditSnapshot } from "@/lib/public-audit-snapshot";
import { isValidShareId } from "@/lib/share-id";

export async function fetchShareSnapshot(id: string): Promise<PublicAuditSnapshot | null> {
  if (!isValidShareId(id)) return null;
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data, error } = await sb.from("audit_shares").select("data").eq("id", id).maybeSingle();
  if (error || !data?.data) return null;
  const snap = data.data as unknown;
  return isPublicAuditSnapshot(snap) ? snap : null;
}
