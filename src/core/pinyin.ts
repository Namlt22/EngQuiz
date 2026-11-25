/**
 * Xử lý pinyin — hàm thuần, dùng chung cho bài phát âm, từ vựng, nghe chép tiếng Trung.
 *
 * Quy ước: một "âm tiết" là chuỗi pinyin có dấu thanh (vd "nǐ"); thanh nhẹ không có dấu và được đánh số 5.
 * Pinyin của một từ là các âm tiết cách nhau bằng dấu cách (vd "nǐ hǎo"), ứng với từng chữ Hán.
 */

export type Tone = 1 | 2 | 3 | 4 | 5;

/** Nguyên âm mang dấu theo thanh 1–4. */
const MARKS: Record<string, string> = { a: "āáǎà", e: "ēéěè", i: "īíǐì", o: "ōóǒò", u: "ūúǔù", ü: "ǖǘǚǜ" };

const MARKED_TO_PLAIN = new Map<string, [plain: string, tone: Tone]>();
for (const [plain, marks] of Object.entries(MARKS)) {
  [...marks].forEach((m, i) => {
    MARKED_TO_PLAIN.set(m, [plain, (i + 1) as Tone]);
    MARKED_TO_PLAIN.set(m.toUpperCase(), [plain.toUpperCase(), (i + 1) as Tone]);
  });
}

/** Thanh của một âm tiết: 1–4 theo dấu, 5 = thanh nhẹ (không dấu). */
export function toneOf(syllable: string): Tone {
  for (const ch of syllable) {
    const hit = MARKED_TO_PLAIN.get(ch);
    if (hit) return hit[1];
  }
  return 5;
}

/** Bỏ dấu thanh, giữ ü; chữ thường. "Lǜ" → "lü". */
export function bareSyllable(syllable: string): string {
  return [...syllable]
    .map((ch) => MARKED_TO_PLAIN.get(ch)?.[0] ?? ch)
    .join("")
    .toLowerCase();
}

/**
 * Đặt dấu thanh lên âm tiết không dấu theo quy tắc chính tả pinyin:
 * có a hoặc e thì dấu trên a/e; có "ou" thì trên o; còn lại trên nguyên âm cuối (vd "iu" → u, "ui" → i).
 */
export function markTone(bare: string, tone: Tone): string {
  const s = bare.replace(/v|u:/g, "ü");
  if (tone === 5) return s;
  const lower = s.toLowerCase();
  let idx = lower.search(/[ae]/);
  if (idx < 0) idx = lower.indexOf("ou");
  if (idx < 0) {
    for (let i = lower.length - 1; i >= 0; i--) {
      if ("aeiouü".includes(lower[i])) {
        idx = i;
        break;
      }
    }
  }
  if (idx < 0) return s; // không có nguyên âm (vd "m", "ng" thán từ): để nguyên
  const ch = s[idx];
  const marks = MARKS[ch.toLowerCase()];
  const marked = marks[tone - 1];
  return s.slice(0, idx) + (ch === ch.toUpperCase() ? marked.toUpperCase() : marked) + s.slice(idx + 1);
}

/** "ni3 hao3" / "lv4" / "ma5" → "nǐ hǎo" / "lǜ" / "ma". Âm tiết không có số giữ nguyên. */
export function numberedToMarked(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((tok) => {
      const m = /^([a-zA-Zü:]+)([0-5])$/.exec(tok);
      if (!m) return tok.replace(/v|u:/g, "ü");
      const tone = Number(m[2]);
      return markTone(m[1], (tone === 0 ? 5 : tone) as Tone);
    })
    .join(" ");
}

/** "nǐ hǎo" → "ni3 hao3"; thanh nhẹ ghi số 5. */
export function markedToNumbered(pinyin: string): string {
  return syllables(pinyin)
    .map((s) => `${bareSyllable(s)}${toneOf(s)}`)
    .join(" ");
}

export const syllables = (pinyin: string) => pinyin.trim().split(/\s+/).filter(Boolean);

/* ---------------- Biến điệu ---------------- */

/** Chữ đứng trước 一 khiến 一 giữ nguyên yī (số thứ tự, số đếm, từ cố định). */
const YI_KEEP_AFTER = new Set(["第", "十", "期", "统", "唯", "万"]);
/** Chữ đứng sau 一 khiến 一 giữ nguyên yī (tháng một: 一月). */
const YI_KEEP_BEFORE = new Set(["月"]);

function retone(syllable: string, tone: Tone): string {
  return markTone(bareSyllable(syllable), tone);
}

/**
 * Cách đọc thực tế của một từ sau biến điệu:
 *  - 不 bù + thanh 4 → bú (不是 bú shì);
 *  - 一 yī + thanh 4 → yí (一样 yí yàng), + thanh 1/2/3 → yì (一起 yì qǐ); giữ yī khi đứng cuối, sau 第/十/星期…, trước 月;
 *  - chuỗi thanh 3 liền nhau: mọi âm trừ âm cuối đọc thành thanh 2 (你好 ní hǎo).
 * Thanh nhẹ (5) giữ nguyên: 姐姐 jiě jie không đổi. Chuỗi 3 thanh 3 trở lên thực tế còn tuỳ cách ngắt nhịp — đây là cách đọc phổ biến khi nói liền.
 * `hanzi` và `pinyin` phải cùng số âm tiết; không khớp thì trả lại pinyin gốc.
 */
export function applySandhi(hanzi: string, pinyin: string): string {
  const chars = [...hanzi];
  const syl = syllables(pinyin);
  if (chars.length !== syl.length) return pinyin;
  const out = [...syl];
  const baseTone = syl.map(toneOf);

  for (let i = 0; i < out.length; i++) {
    const next = baseTone[i + 1];
    if (chars[i] === "不" && bareSyllable(syl[i]) === "bu" && next === 4) out[i] = retone(syl[i], 2);
    if (chars[i] === "一" && bareSyllable(syl[i]) === "yi" && next !== undefined && next !== 5) {
      const keep = YI_KEEP_AFTER.has(chars[i - 1]) || YI_KEEP_BEFORE.has(chars[i + 1]);
      if (!keep) out[i] = retone(syl[i], next === 4 ? 2 : 4);
    }
  }

  // Chuỗi thanh 3 (tính theo thanh sau khi đổi 不/一): đổi mọi âm trừ âm cuối thành thanh 2.
  let i = 0;
  while (i < out.length) {
    if (toneOf(out[i]) !== 3) {
      i++;
      continue;
    }
    let j = i;
    while (j + 1 < out.length && toneOf(out[j + 1]) === 3) j++;
    for (let k = i; k < j; k++) out[k] = retone(out[k], 2);
    i = j + 1;
  }
  return out.join(" ");
}

/** Tên thanh để hiển thị. */
export const TONE_NAMES: Record<Tone, string> = {
  1: "Thanh 1 (ngang, cao)",
  2: "Thanh 2 (đi lên)",
  3: "Thanh 3 (xuống rồi lên)",
  4: "Thanh 4 (đi xuống)",
  5: "Thanh nhẹ",
};
