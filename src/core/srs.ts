/**
 * Ôn từ vựng lặp lại ngắt quãng theo hệ hộp Leitner — hàm thuần.
 *
 * Mỗi từ ở một "hộp" 0–5. Nhớ được → lên hộp, khoảng cách ôn dài ra; quên → về hộp 1, ôn lại ngay hôm nay.
 * Lưu gọn thành một chuỗi "từ,hộp,ngày;từ,hộp,ngày" (ngày = số ngày kể từ 1970-01-01 theo lịch địa phương)
 * để đồng bộ theo tài khoản mà không làm phình dữ liệu (xem progressSchema.srs).
 */

export type Grade = "again" | "good" | "easy";

export interface CardState {
  box: number;
  /** Ngày đến hạn ôn (số ngày kể từ 1970-01-01) */
  due: number;
}

export type SrsMap = Map<string, CardState>;

/** Số ngày chờ trước lần ôn tiếp theo khi từ đang ở hộp i. */
export const BOX_INTERVAL_DAYS = [0, 1, 2, 4, 8, 16] as const;
export const MAX_BOX = BOX_INTERVAL_DAYS.length - 1;
/** Từ ở hộp này trở lên coi như "đã thuộc". */
export const MASTERED_BOX = 4;
/** Số từ mới tối đa mỗi lượt ôn. */
export const NEW_PER_SESSION = 10;
/** Giới hạn độ dài chuỗi lưu (đủ cho ~3 000 từ). */
export const SRS_MAX_CHARS = 40_000;

const MS_PER_DAY = 86_400_000;

/** Số ngày của một ngày theo lịch địa phương (không lệch múi giờ). */
export function dayNumber(d = new Date()): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / MS_PER_DAY);
}

export function review(prev: CardState | undefined, grade: Grade, today: number): CardState {
  if (grade === "again") return { box: 1, due: today };
  const box = Math.min(MAX_BOX, (prev?.box ?? 0) + (grade === "easy" ? 2 : 1));
  return { box, due: today + BOX_INTERVAL_DAYS[box] };
}

export const isMastered = (s: CardState | undefined) => !!s && s.box >= MASTERED_BOX;

/**
 * Hàng đợi ôn hôm nay: từ đến hạn trước (hạn cũ nhất trước), sau đó tối đa `newLimit` từ chưa học theo thứ tự danh sách.
 * Từ đã hỏng hôm nay (hộp 1, hạn = hôm nay) vẫn nằm trong hàng đợi để ôn lại.
 */
export function buildQueue(words: readonly string[], srs: SrsMap, today: number, newLimit = NEW_PER_SESSION): string[] {
  const due = words.filter((w) => {
    const s = srs.get(w);
    return s && s.due <= today;
  });
  due.sort((a, b) => srs.get(a)!.due - srs.get(b)!.due);
  const fresh = words.filter((w) => !srs.has(w)).slice(0, newLimit);
  return [...due, ...fresh];
}

/* ---------------- Mã hoá chuỗi lưu trữ ---------------- */

/**
 * Khoá của một thẻ: từ tiếng Trung (1–8 chữ Hán) hoặc từ / cụm từ tiếng Anh viết thường (2–30 ký tự: chữ, dấu cách,
 * gạch nối, nháy đơn; bắt đầu và kết thúc bằng chữ). Không chứa "," hay ";" nên không phá chuỗi lưu.
 */
const ENTRY = /^(\p{Script=Han}{1,8}|[a-z][a-z' -]{0,28}[a-z]),([0-5]),(\d{1,6})$/u;

export function decodeSrs(raw: string | undefined): SrsMap {
  const map: SrsMap = new Map();
  if (!raw) return map;
  for (const part of raw.split(";")) {
    const m = ENTRY.exec(part);
    if (m) map.set(m[1], { box: Number(m[2]), due: Number(m[3]) });
  }
  return map;
}

/** Mã hoá theo thứ tự từ để kết quả ổn định (so sánh dữ liệu khi đồng bộ). Vượt giới hạn thì bỏ các từ hộp thấp nhất. */
export function encodeSrs(map: SrsMap): string {
  const entries = [...map].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  let out = entries.map(([w, s]) => `${w},${s.box},${s.due}`).join(";");
  if (out.length <= SRS_MAX_CHARS) return out;
  const kept = [...entries].sort(([, a], [, b]) => b.box - a.box);
  while (kept.length && (out = kept.map(([w, s]) => `${w},${s.box},${s.due}`).join(";")).length > SRS_MAX_CHARS) kept.pop();
  return kept.sort(([a], [b]) => (a < b ? -1 : 1)).map(([w, s]) => `${w},${s.box},${s.due}`).join(";");
}

/** Chuỗi hợp lệ = mọi mục đúng dạng, không trùng từ. */
export function isValidSrs(raw: string): boolean {
  if (raw === "") return true;
  const parts = raw.split(";");
  return parts.every((p) => ENTRY.test(p)) && new Set(parts.map((p) => p.split(",")[0])).size === parts.length;
}

/** Gộp hai máy: mỗi từ giữ trạng thái ở hộp cao hơn; cùng hộp thì lấy hạn muộn hơn. */
export function mergeSrs(a: string | undefined, b: string | undefined): string {
  const out = decodeSrs(a);
  for (const [w, s] of decodeSrs(b)) {
    const cur = out.get(w);
    if (!cur || s.box > cur.box || (s.box === cur.box && s.due > cur.due)) out.set(w, s);
  }
  return encodeSrs(out);
}
