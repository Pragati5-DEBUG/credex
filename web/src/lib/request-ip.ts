import type { NextRequest } from "next/server";

export function getRequestIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = req.headers.get("x-real-ip");
  if (real?.trim()) return real.trim().slice(0, 64);
  return "unknown";
}
