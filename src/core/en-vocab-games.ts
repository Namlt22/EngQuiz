/**
 * Game từ vựng (khoá tiếng Anh): tạo câu hỏi từ các từ của một chủ đề trong src/content/vocab-en.
 * Logic thuần; `rng` truyền vào để test được (mặc định Math.random).
 */
import type { EnPos, EnVocabTopic, EnWord } from "@/content/vocab-en";
import { isEquivalent } from "./normalize";

/** Một từ ở dạng dễ dùng cho game. `id` = chính từ (khoá ôn tập của vocab-en). */
export interface GameWord {
  id: string;
  word: string;
  pos: EnPos;
  ipa: string;
  vi: string;
  example: string;
}

export const toGameWord = ([word, pos, ipa, vi, example]: EnWord): GameWord => ({ id: word, word, pos, ipa, vi, example });
export const topicWords = (t: EnVocabTopic): GameWord[] => t.words.map(toGameWord);

export type VocabMode = "listen" | "choose" | "fill" | "match" | "write";
export const VOCAB_MODES: VocabMode[] = ["listen", "choose", "fill", "match", "write"];

export type VocabQuestion =
  /** Nghe từ → chọn từ đúng. */
  | { mode: "listen"; word: GameWord; options: GameWord[] }
  /** Xem từ → chọn nghĩa tiếng Việt. */
  | { mode: "choose"; word: GameWord; options: GameWord[] }
  /** Câu ví dụ có chỗ trống → chọn từ. `gap` = dạng từ đúng như trong câu. */
  | { mode: "fill"; word: GameWord; before: string; after: string; gap: string; options: GameWord[] }
  /** Nối 5 từ với nghĩa. */
  | { mode: "match"; words: GameWord[]; shuffledVi: GameWord[] }
  /** Nghe + xem nghĩa → gõ từ. */
  | { mode: "write"; word: GameWord };

type Rng = () => number;

export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Bộ sinh số ngẫu nhiên có hạt giống (mulberry32), để test và tái tạo một ván. */
export function seededRng(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------- Tìm từ trong câu ví dụ ---------------- */

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Các dạng biến đổi hợp lệ của một từ: số nhiều, -ed, -ing, -ies, gấp đôi phụ âm. */
function inflections(word: string): string[] {
  const w = word.toLowerCase();
  const forms = new Set([w, `${w}s`, `${w}es`, `${w}ed`, `${w}d`, `${w}ing`]);
  if (w.endsWith("y")) {
    forms.add(`${w.slice(0, -1)}ies`);
    forms.add(`${w.slice(0, -1)}ied`);
  }
  if (w.endsWith("e")) forms.add(`${w.slice(0, -1)}ing`);
  if (/[^aeiou][aeiou][bdglmnprt]$/.test(w)) {
    const last = w.slice(-1);
    forms.add(`${w}${last}ed`);
    forms.add(`${w}${last}ing`);
  }
  return [...forms].sort((a, b) => b.length - a.length);
}

/**
 * Tìm từ (hoặc dạng chia) trong câu, không phân biệt hoa thường. Cụm nhiều từ chỉ biến đổi từ đầu ("get up" → "gets up").
 * Không tìm được (dạng bất quy tắc: child → children) thì trả null, từ đó không dùng cho game điền chỗ trống.
 */
export function findInSentence(sentence: string, word: string): { start: number; end: number } | null {
  const [head, ...rest] = word.split(" ");
  const tail = rest.length ? " " + rest.map(escapeRe).join(" ") : "";
  const alts = inflections(head).map(escapeRe).join("|");
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(?:${alts})${tail}(?![\\p{L}\\p{N}])`, "iu");
  const m = re.exec(sentence);
  return m ? { start: m.index, end: m.index + m[0].length } : null;
}

/* ---------------- Tạo câu hỏi ---------------- */

/** `n` đáp án nhiễu, ưu tiên cùng từ loại để câu hỏi không bị lộ. */
export function pickDistractors(target: GameWord, pool: readonly GameWord[], n: number, rng: Rng = Math.random): GameWord[] {
  const others = pool.filter((w) => w.id !== target.id && w.vi !== target.vi);
  const same = shuffle(others.filter((w) => w.pos === target.pos), rng);
  const diff = shuffle(others.filter((w) => w.pos !== target.pos), rng);
  return [...same, ...diff].slice(0, n);
}

const withOptions = (target: GameWord, pool: readonly GameWord[], rng: Rng) => shuffle([target, ...pickDistractors(target, pool, 3, rng)], rng);

/** Từ dùng được cho game điền chỗ trống (tìm thấy trong câu ví dụ). */
export const fillable = (words: readonly GameWord[]) => words.filter((w) => findInSentence(w.example, w.word));

/**
 * Tạo một ván chơi. `words` là các từ của chủ đề (đồng thời là kho đáp án nhiễu).
 * `count`: số câu; với "match" mỗi câu là một nhóm 5 cặp.
 */
export function buildVocabRound(mode: VocabMode, words: readonly GameWord[], count = 10, rng: Rng = Math.random): VocabQuestion[] {
  if (mode === "match") {
    const picked = shuffle(words, rng);
    const groups: VocabQuestion[] = [];
    for (let i = 0; i + 5 <= picked.length && groups.length < Math.max(1, Math.floor(count / 5)); i += 5) {
      const group = picked.slice(i, i + 5);
      groups.push({ mode: "match", words: group, shuffledVi: shuffle(group, rng) });
    }
    return groups;
  }

  const source = mode === "fill" ? fillable(words) : words;
  return shuffle(source, rng)
    .slice(0, count)
    .map((word): VocabQuestion => {
      switch (mode) {
        case "listen":
        case "choose":
          return { mode, word, options: withOptions(word, words, rng) };
        case "write":
          return { mode, word };
        case "fill": {
          const hit = findInSentence(word.example, word.word)!;
          return {
            mode,
            word,
            before: word.example.slice(0, hit.start),
            after: word.example.slice(hit.end),
            gap: word.example.slice(hit.start, hit.end),
            options: withOptions(word, words, rng),
          };
        }
      }
    });
}

/** Chấm chế độ "write": bỏ qua hoa thường, dấu câu; chấp nhận chính tả Anh/Mỹ (colour = color). */
export function checkWritten(input: string, word: GameWord): boolean {
  return input.trim().length > 0 && isEquivalent(input, word.word);
}
