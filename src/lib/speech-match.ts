/**
 * Kiểm tra nhanh "người học đã nói đủ câu cần đọc chưa" — dùng để dừng nhận dạng giọng nói ngay khi đủ,
 * thay vì chờ trình duyệt tự nhận ra im lặng (thường 1,5–2 giây). Hàm thuần.
 * Đủ = mọi từ (EN) / chữ (ZH) của một câu đích xuất hiện theo đúng thứ tự trong lời nói (có thể xen từ khác).
 */
const tokens = (s: string, lang: "en" | "zh") =>
  lang === "zh"
    ? [...s.replace(/[\s\p{P}\p{S}]/gu, "")]
    : s
        .toLowerCase()
        .replace(/[’`]/g, "'")
        .replace(/[^a-z0-9' ]+/g, " ")
        .split(/\s+/)
        .filter(Boolean);

function isSubsequence(want: readonly string[], got: readonly string[]): boolean {
  let j = 0;
  for (const g of got) if (j < want.length && g === want[j]) j++;
  return want.length > 0 && j === want.length;
}

export function heardAll(transcript: string, expected: readonly string[], lang: "en" | "zh"): boolean {
  const got = tokens(transcript, lang);
  if (!got.length) return false;
  return expected.some((e) => isSubsequence(tokens(e, lang), got));
}
