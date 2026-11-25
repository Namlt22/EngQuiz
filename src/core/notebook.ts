/**
 * Sổ tay từ vựng của người học — hàm thuần, mọi thao tác trả về mảng mới (không sửa mảng cũ).
 *  - Mỗi khoá học một sổ, lưu trong ProgressState.notebook và đồng bộ theo tài khoản.
 *  - Ôn bằng cùng hệ hộp Leitner với thẻ từ vựng (src/core/srs.ts), nhưng trạng thái nằm ngay trong mục
 *    (từ người học tự nhập có thể là cụm bất kỳ, không làm khoá của chuỗi srs được).
 *  - Xoá để lại dấu `deleted` (tombstone) để máy khác khi gộp không "hồi sinh" mục đã xoá.
 */
import { NEW_PER_SESSION, review, type Grade } from "./srs";

export const NOTEBOOK_LIMITS = {
  /** Số mục đang dùng tối đa mỗi sổ. */
  entries: 300,
  /** Tổng số mục kể cả dấu đã xoá (dấu cũ nhất bị bỏ khi vượt). */
  stored: 360,
  /** Đủ cho một câu đã sửa từ Trò chuyện AI. */
  term: 160,
  meaning: 160,
  example: 200,
  reading: 60,
  source: 60,
} as const;

export interface NotebookEntry {
  id: string;
  term: string;
  meaning: string;
  /** Phiên âm IPA (EN) hoặc pinyin (ZH). */
  reading?: string;
  example?: string;
  /** Nơi thêm từ, vd "reading:gig-economy", "chat", "vocab:travel". */
  source?: string;
  /** Hộp Leitner 0–5 (0 = chưa ôn). */
  box: number;
  /** Ngày đến hạn (số ngày kể từ 1970-01-01, xem dayNumber). */
  due: number;
  /** Thời điểm sửa gần nhất (ms) — dùng khi gộp hai máy. */
  updated: number;
  deleted?: true;
}

export interface NewEntry {
  term: string;
  meaning: string;
  reading?: string;
  example?: string;
  source?: string;
}

const clip = (s: string | undefined, max: number) => (s ?? "").trim().replace(/\s+/g, " ").slice(0, max);
const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

function newId(): string {
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().replace(/-/g, "") : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return rand.slice(0, 12).toLowerCase();
}

export const activeEntries = (list: readonly NotebookEntry[]) => list.filter((e) => !e.deleted);

export function findEntry(list: readonly NotebookEntry[], term: string): NotebookEntry | undefined {
  const t = norm(term);
  return list.find((e) => !e.deleted && norm(e.term) === t);
}

/** Bỏ dấu đã xoá cũ nhất khi tổng số mục vượt giới hạn lưu. */
function trimStored(list: NotebookEntry[]): NotebookEntry[] {
  if (list.length <= NOTEBOOK_LIMITS.stored) return list;
  const tombstones = list.filter((e) => e.deleted).sort((a, b) => a.updated - b.updated);
  const drop = new Set(tombstones.slice(0, list.length - NOTEBOOK_LIMITS.stored).map((e) => e.id));
  return list.filter((e) => !drop.has(e.id));
}

/** Thêm từ. Trùng từ đang có (không phân biệt hoa thường) hoặc thiếu dữ liệu / đầy sổ → added = false. */
export function addEntry(
  list: readonly NotebookEntry[],
  input: NewEntry,
  now: number,
  today: number,
): { list: readonly NotebookEntry[]; entry: NotebookEntry; added: boolean } {
  const term = clip(input.term, NOTEBOOK_LIMITS.term);
  const meaning = clip(input.meaning, NOTEBOOK_LIMITS.meaning);
  const existing = term ? findEntry(list, term) : undefined;
  const entry: NotebookEntry = existing ?? {
    id: newId(),
    term,
    meaning,
    ...(clip(input.reading, NOTEBOOK_LIMITS.reading) ? { reading: clip(input.reading, NOTEBOOK_LIMITS.reading) } : {}),
    ...(clip(input.example, NOTEBOOK_LIMITS.example) ? { example: clip(input.example, NOTEBOOK_LIMITS.example) } : {}),
    ...(clip(input.source, NOTEBOOK_LIMITS.source) ? { source: clip(input.source, NOTEBOOK_LIMITS.source) } : {}),
    box: 0,
    due: today,
    updated: now,
  };
  if (existing || !term || !meaning || activeEntries(list).length >= NOTEBOOK_LIMITS.entries) return { list, entry, added: false };
  return { list: trimStored([...list, entry]), entry, added: true };
}

export function updateEntry(list: readonly NotebookEntry[], id: string, patch: Partial<Pick<NotebookEntry, "term" | "meaning" | "reading" | "example">>, now: number): NotebookEntry[] {
  return list.map((e) => {
    if (e.id !== id || e.deleted) return e;
    const term = patch.term !== undefined ? clip(patch.term, NOTEBOOK_LIMITS.term) || e.term : e.term;
    const meaning = patch.meaning !== undefined ? clip(patch.meaning, NOTEBOOK_LIMITS.meaning) || e.meaning : e.meaning;
    const example = patch.example !== undefined ? clip(patch.example, NOTEBOOK_LIMITS.example) : e.example;
    const reading = patch.reading !== undefined ? clip(patch.reading, NOTEBOOK_LIMITS.reading) : e.reading;
    const { example: _e, reading: _r, ...rest } = e;
    return { ...rest, term, meaning, ...(reading ? { reading } : {}), ...(example ? { example } : {}), updated: now };
  });
}

/** Xoá: giữ nguyên dữ liệu kèm dấu `deleted` (để hoàn tác được và để máy khác biết mục đã xoá). */
export function removeEntry(list: readonly NotebookEntry[], id: string, now: number): NotebookEntry[] {
  return list.map((e) => (e.id === id && !e.deleted ? { ...e, updated: now, deleted: true as const } : e));
}

/** Hoàn tác xoá: bỏ dấu `deleted`, tính là một lần sửa mới (thắng bản xoá khi gộp hai máy). */
export function restoreEntry(list: readonly NotebookEntry[], id: string, now: number): NotebookEntry[] {
  return list.map((e) => {
    if (e.id !== id || !e.deleted) return e;
    const { deleted: _d, ...rest } = e;
    return { ...rest, updated: now };
  });
}

export function reviewEntry(list: readonly NotebookEntry[], id: string, grade: Grade, today: number, now: number): NotebookEntry[] {
  return list.map((e) => {
    if (e.id !== id || e.deleted) return e;
    const next = review(e.box > 0 ? { box: e.box, due: e.due } : undefined, grade, today);
    return { ...e, box: next.box, due: next.due, updated: now };
  });
}

/** Hàng đợi ôn hôm nay: mục đã học đến hạn (hạn cũ trước), rồi tối đa `newLimit` mục chưa ôn theo thứ tự thêm. */
export function buildNotebookQueue(list: readonly NotebookEntry[], today: number, newLimit = NEW_PER_SESSION): NotebookEntry[] {
  const active = activeEntries(list);
  const due = active.filter((e) => e.box > 0 && e.due <= today).sort((a, b) => a.due - b.due);
  const fresh = active.filter((e) => e.box === 0).slice(0, newLimit);
  return [...due, ...fresh];
}

/* ---------------- Làm sạch & gộp (dữ liệu từ trình duyệt / server) ---------------- */

function cleanEntry(raw: unknown): NotebookEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || !/^[a-z0-9]{6,32}$/.test(r.id)) return null;
  if (typeof r.term !== "string" || typeof r.meaning !== "string") return null;
  const term = clip(r.term, NOTEBOOK_LIMITS.term);
  const meaning = clip(r.meaning, NOTEBOOK_LIMITS.meaning);
  if (!term || !meaning) return null;
  const int = (v: unknown, max: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(0, Math.floor(v))) : 0);
  const example = typeof r.example === "string" ? clip(r.example, NOTEBOOK_LIMITS.example) : "";
  const reading = typeof r.reading === "string" ? clip(r.reading, NOTEBOOK_LIMITS.reading) : "";
  const source = typeof r.source === "string" ? clip(r.source, NOTEBOOK_LIMITS.source) : "";
  return {
    id: r.id,
    term,
    meaning,
    ...(reading ? { reading } : {}),
    ...(example ? { example } : {}),
    ...(source ? { source } : {}),
    box: int(r.box, 5),
    due: int(r.due, 999_999),
    updated: int(r.updated, Number.MAX_SAFE_INTEGER),
    ...(r.deleted === true ? { deleted: true as const } : {}),
  };
}

/** Giữ mục hợp lệ, bỏ trùng id (giữ mục đầu), cắt theo giới hạn lưu. */
export function sanitizeNotebook(raw: unknown): NotebookEntry[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: NotebookEntry[] = [];
  for (const item of raw.slice(0, NOTEBOOK_LIMITS.stored * 2)) {
    const e = cleanEntry(item);
    if (!e || seen.has(e.id)) continue;
    seen.add(e.id);
    out.push(e);
  }
  return trimStored(out);
}

/** Gộp hai máy: hợp theo id; cùng id thì lấy bản `updated` sau (xoá cũng là một lần sửa). */
export function mergeNotebook(a: readonly NotebookEntry[], b: readonly NotebookEntry[]): NotebookEntry[] {
  const byId = new Map<string, NotebookEntry>();
  for (const e of [...a, ...b]) {
    const cur = byId.get(e.id);
    if (!cur || e.updated > cur.updated || (e.updated === cur.updated && e.deleted && !cur.deleted)) byId.set(e.id, e);
  }
  return trimStored([...byId.values()]);
}
