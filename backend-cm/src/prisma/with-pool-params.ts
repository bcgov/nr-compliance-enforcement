export function withPoolParams(url: string, limit = 20, timeout = 20): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has("connection_limit")) {
      u.searchParams.set("connection_limit", String(limit));
    }
    if (!u.searchParams.has("pool_timeout")) {
      u.searchParams.set("pool_timeout", String(timeout));
    }
    return u.toString();
  } catch {
    return url;
  }
}
