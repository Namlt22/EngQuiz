/**
 * Chấm bài Nghe & chép theo kiểu dailydictation:
 *  - So khớp bài gõ với câu gốc ở MỨC TỪ (căn chỉnh Levenshtein trên token).
 *  - Từ đúng được hiện ra; từ sai/thiếu bị che bằng dấu * để người học nghe lại và sửa.
 *  - Lỗi gõ nhỏ (sai 1 ký tự ở từ dài) được tính "gần đúng" = nửa điểm và vẫn cho qua.
 */
import { charDistance, normalizeWord, tokenize } from "./normalize";

export type TokenStatus = "correct" | "near" | "wrong" | "missing";
export type WordStatus = TokenStatus;

export interface WordResult {
  /** Từ gốc để hiển thị (giữ hoa/thường và dấu câu). */
  display: string;
  status: WordStatus;
  /** Phần người học đã gõ ở vị trí này (nếu có). */
  typed?: string;
}

export interface DictationCheck {
  words: WordResult[];
  /** Các từ người học gõ thừa. */
  extras: string[];
  correctTokens: number;
  nearTokens: number;
  totalTokens: number;
  /** 0..1 — (đúng + 0.5 × gần đúng) / tổng, trừ điểm nếu gõ thừa. */
  accuracy: number;
  /** Câu được tính là hoàn thành (không còn từ sai/thiếu/thừa). */
  passed: boolean;
}

/**
 * Phân loại một token người học gõ so với token đúng.
 *
 * Chính sách hiện tại (PLAN.md mục 5.5):
 *  - giống hệt → "correct"
 *  - từ dài ≥ 5 chữ cái và chỉ sai 1 ký tự → "near" (lỗi gõ, nửa điểm)
 *  - còn lại → "wrong"
 *
 * Lưu ý: KHÔNG coi là "near" nếu khác biệt rơi vào đuôi ngữ pháp
 * (walk/walked, play/plays): đó là lỗi nghe ngữ pháp, không phải lỗi gõ.
 */
export function classifyToken(expected: string, typed: string): Exclude<TokenStatus, "missing"> {
  if (expected === typed) return "correct";
  if (isGrammarEndingDiff(expected, typed)) return "wrong";
  if (expected.length >= 5 && charDistance(expected, typed) === 1) return "near";
  return "wrong";
}

/** walk ↔ walked, play ↔ plays, watch ↔ watches, stop ↔ stopping... */
const GRAMMAR_ENDINGS = ["ing", "est", "es", "ed", "er", "s", "d"];

function stems(word: string): Set<string> {
  const out = new Set([word]);
  for (const end of GRAMMAR_ENDINGS) {
    if (word.length > end.length + 1 && word.endsWith(end)) out.add(word.slice(0, -end.length));
  }
  return out;
}

function isGrammarEndingDiff(a: string, b: string): boolean {
  const sa = stems(a);
  for (const s of stems(b)) if (sa.has(s)) return true;
  return false;
}

interface ExpectedToken {
  token: string;
  wordIndex: number;
}

type Op =
  | { kind: "match"; e: number; t: number; status: Exclude<TokenStatus, "missing"> }
  | { kind: "delete"; e: number } // thiếu token đúng
  | { kind: "insert"; t: number }; // gõ thừa

const SUB_COST: Record<Exclude<TokenStatus, "missing">, number> = {
  correct: 0,
  near: 0.4,
  wrong: 1,
};

function align(expected: string[], typed: string[]): Op[] {
  const n = expected.length;
  const m = typed.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const sub = SUB_COST[classifyToken(expected[i - 1], typed[j - 1])];
      dp[i][j] = Math.min(dp[i - 1][j - 1] + sub, dp[i - 1][j] + 1, dp[i][j - 1] + 1);
    }
  }
  // Truy vết ngược.
  const ops: Op[] = [];
  let i = n;
  let j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const status = classifyToken(expected[i - 1], typed[j - 1]);
      if (dp[i][j] === dp[i - 1][j - 1] + SUB_COST[status]) {
        ops.push({ kind: "match", e: i - 1, t: j - 1, status });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ kind: "delete", e: i - 1 });
      i--;
    } else {
      ops.push({ kind: "insert", t: j - 1 });
      j--;
    }
  }
  return ops.reverse();
}

const SEVERITY: Record<WordStatus, number> = { correct: 0, near: 1, wrong: 2, missing: 3 };

export function checkDictation(expectedText: string, typedText: string): DictationCheck {
  const displayWords = expectedText.split(/\s+/).filter(Boolean);
  const expTokens: ExpectedToken[] = [];
  displayWords.forEach((w, wordIndex) => {
    for (const token of normalizeWord(w)) expTokens.push({ token, wordIndex });
  });
  const typedTokens = tokenize(typedText);

  const ops = align(
    expTokens.map((t) => t.token),
    typedTokens,
  );

  const tokenStatus: TokenStatus[] = new Array(expTokens.length).fill("missing");
  const tokenTyped: (string | undefined)[] = new Array(expTokens.length).fill(undefined);
  const extras: string[] = [];
  for (const op of ops) {
    if (op.kind === "match") {
      tokenStatus[op.e] = op.status;
      tokenTyped[op.e] = typedTokens[op.t];
    } else if (op.kind === "insert") {
      extras.push(typedTokens[op.t]);
    }
  }

  const words: WordResult[] = displayWords.map((display) => ({ display, status: "correct" as WordStatus }));
  const typedPerWord: string[][] = displayWords.map(() => []);
  expTokens.forEach((t, idx) => {
    const cur = words[t.wordIndex];
    const st = tokenStatus[idx];
    if (SEVERITY[st] > SEVERITY[cur.status]) cur.status = st;
    if (tokenTyped[idx]) typedPerWord[t.wordIndex].push(tokenTyped[idx]!);
  });
  words.forEach((w, i) => {
    if (typedPerWord[i].length) w.typed = typedPerWord[i].join(" ");
  });

  const correctTokens = tokenStatus.filter((s) => s === "correct").length;
  const nearTokens = tokenStatus.filter((s) => s === "near").length;
  const totalTokens = expTokens.length;
  const raw = totalTokens ? (correctTokens + 0.5 * nearTokens - 0.5 * extras.length) / totalTokens : 0;
  const accuracy = Math.max(0, Math.min(1, raw));
  const passed =
    totalTokens > 0 && extras.length === 0 && tokenStatus.every((s) => s === "correct" || s === "near");

  return { words, extras, correctTokens, nearTokens, totalTokens, accuracy, passed };
}

/** Che một từ bằng dấu *, giữ nguyên dấu câu: "time," → "****," */
export function maskWord(word: string): string {
  return word.replace(/[\p{L}\p{N}]/gu, "*");
}

/** Khung gợi ý trước khi kiểm tra: mọi từ đều bị che. */
export function maskSentence(text: string): string {
  return text.split(/\s+/).filter(Boolean).map(maskWord).join(" ");
}
