/**
 * Tên riêng Việt Nam nằm trong câu tiếng Anh (Linh, Huế, Đà Nẵng, Nguyễn Du…).
 * Giọng đọc tiếng Anh đọc chúng như từ tiếng Anh ("Hue" → "hiu") nên người nghe không nhận ra.
 * Cách xử lý khi đọc một câu: thay tên bằng cách viết phiên âm (en) để giọng tiếng Anh đọc gần đúng, cả câu đọc liền
 * một lượt. Không tách tên sang giọng Việt: đổi giọng giữa câu tạo khoảng ngắt, nghe không liền mạch.
 * splitVietnameseNames vẫn giữ để nhận diện tên (vd hiển thị), cách viết tiếng Việt nằm ở trường vi.
 * Hanoi, Saigon, Vietnam là tên tiếng Anh thông dụng → giữ nguyên, đọc giọng Anh.
 * Thêm tên mới: thêm một dòng vào VI_NAMES (cụm dài đặt trước cụm ngắn).
 */
export interface ViName {
  /** Cách viết trong câu tiếng Anh (không dấu) */
  match: string;
  /** Cách viết tiếng Việt cho giọng Việt đọc */
  vi: string;
  /** Phiên âm cho giọng tiếng Anh khi máy không có giọng Việt */
  en: string;
  /** Tên trùng với từ tiếng Anh thường gặp (vd "An") → chỉ nhận khi viết hoa và KHÔNG đứng đầu câu */
  ambiguous?: boolean;
}

export const VI_NAMES: readonly ViName[] = [
  { match: "Nguyen Du", vi: "Nguyễn Du", en: "Nwin Zoo" },
  { match: "Da Nang", vi: "Đà Nẵng", en: "Dah Nahng" },
  { match: "Hoi An", vi: "Hội An", en: "Hoy Ahn" },
  { match: "Kieu", vi: "Kiều", en: "Kee-oo" },
  { match: "Hue", vi: "Huế", en: "Hway" },
  { match: "Linh", vi: "Linh", en: "Ling" },
  { match: "Minh", vi: "Minh", en: "Ming" },
  { match: "Hoa", vi: "Hoa", en: "Hwah" },
  { match: "Lan", vi: "Lan", en: "Lahn" },
  { match: "Nam", vi: "Nam", en: "Nahm" },
  { match: "An", vi: "An", en: "Ahn", ambiguous: true },
];

export interface SpeechSegment {
  text: string;
  lang: "en" | "vi";
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Một tên: đứng riêng (không dính chữ khác), cho phép sở hữu 's ("Lan's").
 * Tên "ambiguous" phải có chữ hoặc dấu phẩy + khoảng trắng đứng trước (không ở đầu câu: "An apple…").
 */
const NAME_RE = new RegExp(
  VI_NAMES.map((n) => (n.ambiguous ? `(?<=[\\p{L},] )${escape(n.match)}` : `(?<![\\p{L}])${escape(n.match)}`) + "(?![\\p{L}])").join("|"),
  "gu",
);
const BY_MATCH = new Map(VI_NAMES.map((n) => [n.match, n]));

/** Tách câu thành các đoạn tiếng Anh / tên tiếng Việt. Không có tên Việt → một đoạn duy nhất. */
export function splitVietnameseNames(text: string): SpeechSegment[] {
  const out: SpeechSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(NAME_RE)) {
    const name = BY_MATCH.get(m[0]);
    if (!name || m.index === undefined) continue;
    if (m.index > last) out.push({ text: text.slice(last, m.index), lang: "en" });
    out.push({ text: name.vi, lang: "vi" });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), lang: "en" });
  return out.filter((s) => s.text.trim() !== "");
}

/** Máy không có giọng Việt: thay tên bằng phiên âm để giọng tiếng Anh đọc gần đúng. */
export function respellVietnameseNames(text: string): string {
  return text.replace(NAME_RE, (m) => BY_MATCH.get(m)?.en ?? m);
}
