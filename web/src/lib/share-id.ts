import { randomBytes } from "crypto";

const SHARE_ID_RE = /^[A-Za-z0-9_-]{10,48}$/;

export function isValidShareId(id: string): boolean {
  return SHARE_ID_RE.test(id);
}

export function newShareId(): string {
  return randomBytes(12).toString("base64url");
}
