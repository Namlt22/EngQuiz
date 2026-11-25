/**
 * Bài học phát âm một âm IPA (trang /ipa/[id]) — logic thuần, không phụ thuộc trình duyệt.
 *
 * Bài có 3 bước, xong cả 3 thì app tự ghi nhận hoàn thành (người học không tự đánh dấu):
 *  1. Nghe âm mẫu và xem cách đặt môi, lưỡi — phải bấm nghe âm ít nhất một lần.
 *  2. Đọc theo từng từ ví dụ — máy chấm, mỗi từ đạt READ_ALOUD_PASS hoặc đã thử đủ MAX_WORD_TRIES lần.
 *  3. Nghe phân biệt — nghe một từ rồi chọn đúng từ vừa nghe giữa hai từ dễ nhầm; đạt LISTEN_PASS_PERCENT.
 */
import { IPA_MAP, IPA_SOUNDS, type IpaExample, type IpaSound } from "@/content/ipa";

export const LISTEN_ROUNDS = 6;
export const LISTEN_PASS_PERCENT = 80;
/** Nhận dạng giọng nói với một từ đơn lẻ hay nghe nhầm: thử đủ số lần này thì cho qua từ đó (vẫn ghi điểm cao nhất). */
export const MAX_WORD_TRIES = 3;

export interface ListenRound {
  /** Hai từ để chọn; options[answer] là từ được đọc lên. */
  options: [IpaExample, IpaExample];
  answer: 0 | 1;
}

/** Âm dễ nhầm để so sánh: âm trong cặp tối thiểu nếu có, không thì một âm khác cùng nhóm. */
export function contrastSound(sound: IpaSound, rng: () => number = Math.random): IpaSound {
  const paired = sound.pair ? IPA_MAP[sound.pair.with] : undefined;
  if (paired) return paired;
  const sameGroup = IPA_SOUNDS.filter((s) => s.group === sound.group && s.id !== sound.id);
  const pool = sameGroup.length ? sameGroup : IPA_SOUNDS.filter((s) => s.id !== sound.id);
  return pool[Math.floor(rng() * pool.length) % pool.length];
}

/**
 * Các vòng nghe phân biệt. Có cặp tối thiểu (sheep / ship) thì dùng cặp đó ở mọi vòng — đúng loại lỗi người học hay mắc;
 * không có thì ghép từ ví dụ của âm đang học với từ ví dụ của âm dễ nhầm. Từ được đọc lên chia đều hai bên.
 */
export function buildListenRounds(sound: IpaSound, rng: () => number = Math.random): ListenRound[] {
  const other = contrastSound(sound, rng);
  const pairs: [IpaExample, IpaExample][] = sound.pair
    ? [[sound.pair.a, sound.pair.b]]
    : sound.examples.map((e, i) => [e, other.examples[i % other.examples.length]]);
  return Array.from({ length: LISTEN_ROUNDS }, (_, i) => {
    const [mine, theirs] = pairs[i % pairs.length];
    const swap = rng() < 0.5;
    // Nửa đầu đọc từ có âm đang học, nửa sau đọc từ của âm kia; rồi xáo vị trí hai lựa chọn.
    const target: 0 | 1 = i % 2 === 0 ? 0 : 1;
    const options: [IpaExample, IpaExample] = swap ? [theirs, mine] : [mine, theirs];
    const answer = (swap ? 1 - target : target) as 0 | 1;
    return { options, answer };
  });
}

export const listenPercent = (correct: number, total: number) => (total ? Math.round((correct / total) * 100) : 0);

export interface WordAttempt {
  best: number;
  tries: number;
  /** Điểm lượt gần nhất (hiển thị); `best` quyết định đạt hay chưa. */
  last?: number;
}

/** Một từ ví dụ coi như xong khi đọc đạt, hoặc đã thử đủ số lần (tránh kẹt vì máy nhận dạng sai từ đơn). */
export const wordDone = (a: WordAttempt | undefined, pass: number) => !!a && (a.best >= pass || a.tries >= MAX_WORD_TRIES);
