/**
 * Khung lộ trình tiếng Trung — chặng Nhập môn (tuần 1–2) và HSK 1 (tuần 3–10), docs/PLAN-ZH.md mục 5.
 * Mỗi tuần liệt kê tài nguyên; src/lib/zh-roadmap.ts chia thành 6 ngày học + ngày 7 kiểm tra.
 * Test: src/lib/zh-roadmap.test.ts (mọi id phải tồn tại, mọi bài HSK 1 đều có trong lộ trình).
 */

export interface ZhWeekPlan {
  phase: 1 | 2 | 3;
  /** Cấp HSK của tuần (ôn thẻ từ vựng cấp này); bỏ trống ở chặng Nhập môn */
  hsk?: 1 | 2;
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

export const ZH_PHASE_NAMES = ["Nhập môn: pinyin, thanh điệu, chữ Hán", "HSK 1: giao tiếp cơ bản", "HSK 2: kể việc, so sánh, nói chi tiết"] as const;

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
  { phase: 2, hsk: 1, title: "Chào hỏi, câu chữ 是 và câu hỏi", milestone: "Chào hỏi, giới thiệu tên và quốc tịch", pinyin: [], grammar: ["shi-sentence", "questions-ma"], dialogue: "d1-greeting", chars: ["人", "我", "你", "是"], vocab: true },
  { phase: 2, hsk: 1, title: "Gia đình, sở hữu, câu tính từ", milestone: "Giới thiệu gia đình, tả người và vật", pinyin: [], grammar: ["pronouns-de", "adjective-predicate"], dialogue: "d2-family", reading: "r1-my-family", chars: ["他", "好", "不", "们"], vocab: true },
  { phase: 2, hsk: 1, title: "Hỏi đáp, số đếm, mua sắm", milestone: "Hỏi giá, mua đồ, đếm số lượng", pinyin: [], grammar: ["question-words", "numbers-measure-words"], dialogue: "d3-shopping", chars: ["大", "小", "中", "国"], vocab: true },
  { phase: 2, hsk: 1, title: "Ngày giờ và lịch hẹn", milestone: "Nói ngày, giờ, hẹn gặp", pinyin: [], grammar: ["time-expressions"], dialogue: "d5-time", reading: "r2-my-day", chars: ["日", "月", "年", "天"], vocab: true },
  { phase: 2, hsk: 1, title: "Ở đâu, có gì", milestone: "Hỏi đường, nói nơi làm việc và nơi ở", pinyin: [], grammar: ["you-and-location", "zai"], dialogue: "d6-directions", reading: "r4-shopping", chars: ["口", "学", "生", "家"], vocab: true },
  { phase: 2, hsk: 1, title: "Muốn, biết, có thể; ăn uống", milestone: "Gọi món, nói điều mình muốn và biết làm", pinyin: [], grammar: ["modal-verbs"], dialogue: "d4-restaurant", reading: "r3-my-friend", chars: ["有", "在", "上", "下"], vocab: true },
  { phase: 2, hsk: 1, title: "Cũng, đều, vẫn; sức khoẻ, thời tiết", milestone: "Nói về sức khoẻ, thời tiết; phân biệt 不 / 没有", pinyin: [], grammar: ["adverbs"], dialogue: "d7-sick", reading: "r5-weather", chars: ["来", "去", "吃", "喝"], vocab: true },
  { phase: 2, hsk: 1, title: "Đã làm, đang làm; gọi điện; thi thử HSK 1", milestone: "Kể việc đã làm, rủ rê; hoàn thành bài thi thử HSK 1", pinyin: [], grammar: ["le-zhengzai-ba"], dialogue: "d8-phone", reading: "r6-work", chars: ["说", "看", "书", "字"], vocab: true, mock: "hsk1" },
  { phase: 3, hsk: 2, title: "So sánh và trải nghiệm; mua quần áo", milestone: "So sánh giá, màu, kích cỡ; kể việc đã từng làm", pinyin: [], grammar: ["bi-comparison", "guo-experience"], dialogue: "d13-clothes", reading: "r7-grandparents", chars: ["比", "笔", "别", "长"], vocab: true },
  { phase: 3, hsk: 2, title: "Trạng thái và mức độ; sở thích thể thao", milestone: "Nói việc đang diễn ra, đánh giá ai làm giỏi đến đâu", pinyin: [], grammar: ["zhe-continuous", "de-degree-complement"], dialogue: "d14-sports", reading: "r10-learning", chars: ["着", "跑", "走", "完"], vocab: true },
  { phase: 3, hsk: 2, title: "Kết quả và hướng di chuyển; đi lại trong thành phố", milestone: "Nói việc đã xong / chưa xong, chỉ đường đi vào, ra, lên, xuống", pinyin: [], grammar: ["result-complements", "direction-complements"], dialogue: "d9-subway", chars: ["懂", "进", "出", "从"], vocab: true },
  { phase: 3, hsk: 2, title: "Hỏi chi tiết việc đã xảy ra; khoảng cách, phương hướng", milestone: "Hỏi đến khi nào, bằng gì; nói cách bao xa, đi hướng nào", pinyin: [], grammar: ["shi-de", "prepositions-distance-direction"], dialogue: "d10-arrival", reading: "r8-travel", chars: ["离", "往", "跟", "因"], vocab: true },
  { phase: 3, hsk: 2, title: "Vì… nên, tuy… nhưng; kế hoạch theo thời tiết", milestone: "Nối câu bằng cặp liên từ, nói sắp / đã làm, làm bao lâu", pinyin: [], grammar: ["conjunction-pairs", "aspect-time"], dialogue: "d12-weekend", reading: "r9-birthday", chars: ["所", "虽", "但", "让"], vocab: true },
  { phase: 3, hsk: 2, title: "Đi khám, nhờ và khuyên; thi thử HSK 2", milestone: "Nói triệu chứng, nhờ / bảo ai làm gì; hoàn thành bài thi thử HSK 2", pinyin: [], grammar: ["rang-bie-duo"], dialogue: "d11-doctor", chars: ["药", "身", "体", "笑"], vocab: true, mock: "hsk2" },
];
