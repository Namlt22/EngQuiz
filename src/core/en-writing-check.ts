/**
 * Kiểm tra câu viết của người học A1 theo các quy tắc cơ bản (chưa dùng AI):
 * viết hoa đầu câu, có dấu kết thúc câu, "I" luôn viết hoa, câu có ít nhất 3 từ.
 * Chấm ngữ pháp sâu hơn sẽ do AI đảm nhận ở giai đoạn Gia sư AI.
 */
export type WritingIssue = "empty" | "capital" | "punctuation" | "lowercaseI" | "tooShort";

export function checkSentence(raw: string): WritingIssue[] {
  const text = raw.trim();
  if (!text) return ["empty"];
  const issues: WritingIssue[] = [];
  if (!/^[A-Z0-9"“']/.test(text)) issues.push("capital");
  if (!/[.!?]["”']?$/.test(text)) issues.push("punctuation");
  if (/(^|[^\p{L}'])i(?=$|[^\p{L}])|(^|[^\p{L}])i'(m|ve|ll|d)\b/u.test(text)) issues.push("lowercaseI");
  if (text.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length < 3) issues.push("tooShort");
  return issues;
}

/** Điểm phần Viết: % số câu không có lỗi. */
export function writingScore(answers: readonly string[]): number {
  if (!answers.length) return 0;
  const ok = answers.filter((a) => checkSentence(a).length === 0).length;
  return Math.round((ok / answers.length) * 100);
}
