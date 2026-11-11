/**
 * Chuẩn hóa văn bản tiếng Anh để so sánh câu trả lời.
 * Dùng chung cho Quiz (dạng gõ chữ) và Nghe & chép (Dictation).
 *
 * Quy tắc (đã chốt trong PLAN.md mục 5.5):
 *  - Không phân biệt hoa/thường, bỏ qua dấu câu, gộp khoảng trắng.
 *  - Đồng nhất dấu nháy cong/thẳng.
 *  - Mở rộng các dạng viết tắt KHÔNG mơ hồ (n't, 'm, 're, 'll, 've).
 *    's và 'd được giữ nguyên vì có nhiều nghĩa (is/has, would/had).
 *  - Số 0–20 và các số tròn chục ⇄ chữ (5 = five).
 *  - Chính tả Anh–Anh quy về Anh–Mỹ (colour = color).
 */

const NUMBER_WORDS: Record<string, string> = {
  zero: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6",
  seven: "7", eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12",
  thirteen: "13", fourteen: "14", fifteen: "15", sixteen: "16", seventeen: "17",
  eighteen: "18", nineteen: "19", twenty: "20", thirty: "30", forty: "40",
  fifty: "50", sixty: "60", seventy: "70", eighty: "80", ninety: "90",
  hundred: "100",
};

const UK_TO_US: Record<string, string> = {
  colour: "color", colours: "colors", favourite: "favorite", favourites: "favorites",
  centre: "center", theatre: "theater", metre: "meter", metres: "meters",
  organise: "organize", organised: "organized", realise: "realize", realised: "realized",
  travelled: "traveled", travelling: "traveling", cancelled: "canceled",
  neighbour: "neighbor", neighbours: "neighbors", behaviour: "behavior",
  honour: "honor", labour: "labor", flavour: "flavor", grey: "gray",
  programme: "program", jewellery: "jewelry", practise: "practice",
  apologise: "apologize", recognise: "recognize", analyse: "analyze",
};

/** Viết tắt đặc biệt cần xử lý trước quy tắc chung n't. */
const SPECIAL_CONTRACTIONS: Record<string, string[]> = {
  "won't": ["will", "not"],
  "can't": ["can", "not"],
  cannot: ["can", "not"],
  "shan't": ["shall", "not"],
  "ain't": ["am", "not"],
  "let's": ["let", "us"],
};

const SUFFIX_CONTRACTIONS: Array<[string, string]> = [
  ["n't", "not"],
  ["'m", "am"],
  ["'re", "are"],
  ["'ll", "will"],
  ["'ve", "have"],
];

/** Đưa mọi loại dấu nháy về ' và chuyển chữ thường. */
export function basicClean(input: string): string {
  return input
    .toLowerCase()
    .replace(/[‘’‚‛′`´]/g, "'")
    .replace(/[“”„]/g, '"')
    .replace(/[–—]/g, " ");
}

/** Chuẩn hóa MỘT từ hiển thị thành 0..n token so sánh. */
export function normalizeWord(word: string): string[] {
  let w = basicClean(word);
  // Gạch nối giữa từ → tách thành 2 token (well-known = well known).
  w = w.replace(/-/g, " ");
  // Bỏ mọi ký tự không phải chữ, số, nháy đơn, khoảng trắng.
  w = w.replace(/[^\p{L}\p{N}' ]+/gu, "");
  // Bỏ nháy ở đầu/cuối (trích dẫn), giữ nháy giữa từ (don't, John's).
  const parts = w
    .split(/\s+/)
    .map((p) => p.replace(/^'+|'+$/g, ""))
    .filter(Boolean);

  const out: string[] = [];
  for (const p of parts) out.push(...expandToken(p));
  return out;
}

function expandToken(token: string): string[] {
  const special = SPECIAL_CONTRACTIONS[token];
  if (special) return special;
  for (const [suffix, full] of SUFFIX_CONTRACTIONS) {
    if (token.endsWith(suffix) && token.length > suffix.length) {
      const base = token.slice(0, -suffix.length);
      return [...expandToken(base), full];
    }
  }
  const num = NUMBER_WORDS[token];
  if (num) return [num];
  const us = UK_TO_US[token];
  if (us) return [us];
  return [token];
}

/** Chuẩn hóa cả câu thành mảng token. */
export function tokenize(text: string): string[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((w) => normalizeWord(w));
}

/** Chuỗi chuẩn hóa — dùng để so sánh nhanh 2 câu. */
export function normalizeSentence(text: string): string {
  return tokenize(text).join(" ");
}

/** Hai câu có tương đương sau khi chuẩn hóa không. */
export function isEquivalent(a: string, b: string): boolean {
  return normalizeSentence(a) === normalizeSentence(b);
}

/** Khoảng cách Levenshtein giữa 2 chuỗi ký tự. */
export function charDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[b.length];
}
