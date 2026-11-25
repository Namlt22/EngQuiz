/**
 * Bài pinyin (trang /zh/pinyin/[id]) — logic thuần, không phụ thuộc trình duyệt.
 *
 * Ba bước như bài phát âm IPA; xong cả 3 thì app tự ghi nhận:
 *  1. Nghe & quan sát: bấm nghe từng âm mẫu ít nhất một lần.
 *  2. Đọc theo: máy nghe (zh-CN) và so âm tiết; mỗi âm đạt hoặc đã thử đủ MAX_TRIES lần.
 *  3. Luyện tai: trắc nghiệm nghe/chọn; đạt PASS_PERCENT là xong bài.
 */
import type { PinyinItem, PinyinLesson } from "@/content/zh/pinyin-lessons";
import { bareSyllable, syllables } from "./pinyin";

export const PASS_PERCENT = 80;
export const PAIR_ROUNDS = 6;
export const TONE_ROUNDS = 8;
export const READ_PASS = 80;
/** Máy nhận dạng một âm tiết rời hay nghe nhầm: thử đủ số lần này thì cho qua (vẫn ghi điểm cao nhất). */
export const MAX_TRIES = 3;

export interface DrillRound {
  /** Chữ Hán được đọc lên (không có = câu hỏi chỉ cần đọc) */
  say?: string;
  prompt: string;
  options: string[];
  /** Chú thích nhỏ dưới mỗi lựa chọn (nghĩa tiếng Việt) */
  notes?: string[];
  answer: number;
  explain: string;
}

type Rng = () => number;
const pick = <T>(arr: readonly T[], rng: Rng) => arr[Math.floor(rng() * arr.length) % arr.length];

function shuffle<T>(arr: readonly T[], rng: Rng): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1)) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Hai lựa chọn của cặp dễ nhầm; vòng chẵn đọc âm thứ nhất, vòng lẻ đọc âm thứ hai, vị trí lựa chọn xáo ngẫu nhiên. */
function pairRounds(pairs: [PinyinItem, PinyinItem][], rng: Rng): DrillRound[] {
  return Array.from({ length: PAIR_ROUNDS }, (_, i) => {
    const pair = pairs[i % pairs.length];
    const target = pair[i % 2 === 0 ? 0 : 1];
    const options = rng() < 0.5 ? [pair[0], pair[1]] : [pair[1], pair[0]];
    return {
      say: target.hanzi,
      prompt: "Bạn vừa nghe âm nào?",
      options: options.map((o) => o.pinyin),
      notes: options.map((o) => o.vi),
      answer: options.indexOf(target),
      explain: `Âm vừa đọc là ${target.pinyin} (${target.hanzi} — ${target.vi}).`,
    };
  });
}

/** Nghe một chữ, chọn thanh; mỗi thanh xuất hiện đều nhau. */
function toneRounds(sets: PinyinItem[][], rng: Rng): DrillRound[] {
  return Array.from({ length: TONE_ROUNDS }, (_, i) => {
    const set = pick(sets, rng);
    const answer = i % 4;
    const target = set[answer];
    return {
      say: target.hanzi,
      prompt: "Âm vừa nghe mang thanh mấy?",
      options: set.map((x) => x.pinyin),
      notes: set.map((x) => x.vi),
      answer,
      explain: `Âm vừa đọc là ${target.pinyin} (${target.hanzi} — ${target.vi}): thanh ${answer + 1}.`,
    };
  }).sort(() => rng() - 0.5);
}

export function buildDrill(lesson: PinyinLesson, rng: Rng = Math.random): DrillRound[] {
  const d = lesson.drill;
  if (d.kind === "pairs") return pairRounds(d.pairs, rng);
  if (d.kind === "tones") return toneRounds(d.sets, rng);
  return shuffle(d.rounds, rng);
}

export const drillPercent = (correct: number, total: number) => (total ? Math.round((correct / total) * 100) : 0);

/**
 * Chấm một lần đọc theo. Máy nhận dạng trả về CHỮ HÁN, nên so theo âm:
 *  - có đúng chữ mẫu → 100;
 *  - mỗi âm tiết: có chữ nào đọc đúng âm + thanh → đạt; đúng âm sai thanh → nửa điểm.
 * `readings` = các cách đọc của từng chữ (charReadings trong src/content/zh/vocab.ts).
 */
export function scoreSpoken(item: PinyinItem, alternatives: readonly string[], readings: ReadonlyMap<string, ReadonlySet<string>>): number {
  if (alternatives.some((a) => a.includes(item.hanzi))) return 100;
  const targets = syllables(item.pinyin).map((s) => s.toLowerCase());
  let best = 0;
  for (const alt of alternatives) {
    const heard = [...alt].map((ch) => [...(readings.get(ch) ?? [])]);
    let points = 0;
    for (const t of targets) {
      if (heard.some((r) => r.includes(t))) points += 1;
      else if (heard.some((r) => r.some((x) => bareSyllable(x) === bareSyllable(t)))) points += 0.5;
    }
    best = Math.max(best, Math.round((points / targets.length) * 100));
  }
  return best;
}

export interface Attempt {
  best: number;
  tries: number;
}

export const itemDone = (a: Attempt | undefined) => !!a && (a.best >= READ_PASS || a.tries >= MAX_TRIES);
