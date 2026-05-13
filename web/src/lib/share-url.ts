/** Use the page origin when the API returned a localhost link on a deployed host. */
export function normalizePublicShareUrl(serverUrl: string, pageOrigin: string): string {
  try {
    const parsed = new URL(serverUrl);
    const page = new URL(pageOrigin);
    const pageIsLocal = page.hostname === "localhost" || page.hostname === "127.0.0.1";
    const linkIsLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if (!pageIsLocal && linkIsLocal) {
      return `${page.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    /* keep serverUrl */
  }
  return serverUrl;
}
