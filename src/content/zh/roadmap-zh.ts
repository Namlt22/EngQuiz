/**
 * Khung lộ trình tiếng Trung — chặng Nhập môn (tuần 1–2) và HSK 1 (tuần 3–10), docs/PLAN-ZH.md mục 5.
 * Mỗi tuần liệt kê tài nguyên; src/lib/zh-roadmap.ts chia thành 6 ngày học + ngày 7 kiểm tra.
 * Test: src/lib/zh-roadmap.test.ts (mọi id phải tồn tại, mọi bài HSK 1 đều có trong lộ trình).
 */

export interface ZhWeekPlan {
  phase: 1 | 2;
  title: string;
  milestone: string;
  /** Bài pinyin (id trong PINYIN_LESSONS) — chỉ chặng Nhập môn */
  pinyin: string[];
  /** Bài ngữ pháp (id trong ZH_GRAMMAR) */
  grammar: string[];
  /** Hội thoại / bài đọc (id trong ZH_TEXTS) */
  dialogue?: string;
  reading?: string;
  /** Chữ tập viết trong tuần (mỗi ngày một chữ) */
  chars: string[];
  /** Có ôn thẻ từ vựng HSK 1 hằng ngày không */
  vocab: boolean;
  /** Tuần cuối: thi thử */
  mock?: string;
  /** Bài kiểm tra bộ thủ */
  radicals?: boolean;
}

export const ZH_PHASE_NAMES = ["Nhập môn: pinyin, thanh điệu, chữ Hán", "HSK 1: giao tiếp cơ bản"] as const;

/** Số tuần nhập môn — người đã biết pinyin bỏ qua. */
export const ZH_INTRO_WEEKS = 2;

export const ZH_WEEKS: ZhWeekPlan[] = [
  {
    phase: 1,
    title: "Thanh điệu và thanh mẫu",
    milestone: "Nghe ra và đọc đúng 4 thanh; đọc đúng 21 thanh mẫu",
    pinyin: ["tones", "tone-2-3", "initials-bpmf", "initials-dtnl", "initials-gkh", "initials-jqx", "initials-zh-ch-sh-r", "initials-z-c-s"],
    grammar: [],
    chars: [],
    vocab: false,
  },
  {
    phase: 1,
    title: "Vận mẫu, biến điệu và nét chữ",
    milestone: "Đọc đúng mọi âm tiết pinyin, biết biến điệu; nhận ra bộ thủ thường gặp",
    pinyin: ["finals-simple", "finals-compound", "finals-i-u-u", "finals-nasal", "sandhi", "spelling"],
    grammar: [],
    chars: ["一", "二", "三", "十"],
    vocab: false,
    radicals: true,
  },
  { phase: 2, title: "Chào hỏi, câu chữ 是 và câu hỏi", milestone: "Chào hỏi, giới thiệu tên và quốc tịch", pinyin: [], grammar: ["shi-sentence", "questions-ma"], dialogue: "d1-greeting", chars: ["人", "我", "你", "是"], vocab: true },
  { phase: 2, title: "Gia đình, sở hữu, câu tính từ", milestone: "Giới thiệu gia đình, tả người và vật", pinyin: [], grammar: ["pronouns-de", "adjective-predicate"], dialogue: "d2-family", reading: "r1-my-family", chars: ["他", "好", "不", "们"], vocab: true },
  { phase: 2, title: "Hỏi đáp, số đếm, mua sắm", milestone: "Hỏi giá, mua đồ, đếm số lượng", pinyin: [], grammar: ["question-words", "numbers-measure-words"], dialogue: "d3-shopping", chars: ["大", "小", "中", "国"], vocab: true },
  { phase: 2, title: "Ngày giờ và lịch hẹn", milestone: "Nói ngày, giờ, hẹn gặp", pinyin: [], grammar: ["time-expressions"], dialogue: "d5-time", reading: "r2-my-day", chars: ["日", "月", "年", "天"], vocab: true },
  { phase: 2, title: "Ở đâu, có gì", milestone: "Hỏi đường, nói nơi làm việc và nơi ở", pinyin: [], grammar: ["you-and-location", "zai"], dialogue: "d6-directions", reading: "r4-shopping", chars: ["口", "学", "生", "家"], vocab: true },
  { phase: 2, title: "Muốn, biết, có thể; ăn uống", milestone: "Gọi món, nói điều mình muốn và biết làm", pinyin: [], grammar: ["modal-verbs"], dialogue: "d4-restaurant", reading: "r3-my-friend", chars: ["有", "在", "上", "下"], vocab: true },
  { phase: 2, title: "Cũng, đều, vẫn; sức khoẻ, thời tiết", milestone: "Nói về sức khoẻ, thời tiết; phân biệt 不 / 没有", pinyin: [], grammar: ["adverbs"], dialogue: "d7-sick", reading: "r5-weather", chars: ["来", "去", "吃", "喝"], vocab: true },
  { phase: 2, title: "Đã làm, đang làm; gọi điện; thi thử HSK 1", milestone: "Kể việc đã làm, rủ rê; hoàn thành bài thi thử HSK 1", pinyin: [], grammar: ["le-zhengzai-ba"], dialogue: "d8-phone", reading: "r6-work", chars: ["说", "看", "书", "字"], vocab: true, mock: "hsk1" },
];
