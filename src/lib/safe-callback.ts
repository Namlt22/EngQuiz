const DEFAULT_CALLBACK = "/roadmap";

/** Chỉ cho phép chuyển về đường dẫn nội bộ, chặn open redirect (kể cả "//x", "/\x", ký tự điều khiển). */
export function safeCallback(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || /[\\\u0000-\u001f]/.test(raw)) return DEFAULT_CALLBACK;
  try {
    const base = "http://engquiz.local";
    const url = new URL(raw, base);
    return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : DEFAULT_CALLBACK;
  } catch {
    return DEFAULT_CALLBACK;
  }
}
