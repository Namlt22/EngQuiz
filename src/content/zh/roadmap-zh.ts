/**
 * Khung lộ trình tiếng Trung — Nhập môn (tuần 1–2), HSK 1 (3–10), HSK 2 (11–16), HSK 3 (17–28), HSK 4 (29–40), docs/PLAN-ZH.md mục 5.
 * Mỗi tuần liệt kê tài nguyên; src/lib/zh-roadmap.ts chia thành 6 ngày học + ngày 7 kiểm tra.
 * Test: src/lib/zh-roadmap.test.ts (mọi id phải tồn tại, mọi bài HSK 1 đều có trong lộ trình).
 */

export interface ZhWeekPlan {
  phase: 1 | 2 | 3 | 4 | 5;
  /** Cấp HSK của tuần (ôn thẻ từ vựng cấp này); bỏ trống ở chặng Nhập môn */
  hsk?: 1 | 2 | 3 | 4;
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

export const ZH_PHASE_NAMES = ["Nhập môn: pinyin, thanh điệu, chữ Hán", "HSK 1: giao tiếp cơ bản", "HSK 2: kể việc, so sánh, nói chi tiết", "HSK 3: câu 把 / 被, bổ ngữ, kể chuyện và nêu ý kiến", "HSK 4: câu phức, văn viết, công việc và đời sống"] as const;

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
  { phase: 4, hsk: 3, title: "Câu 把; chuyển nhà", milestone: "Nói việc xử lý đồ vật: đặt ở đâu, đưa cho ai, làm xong chưa", pinyin: [], grammar: ["ba-sentence"], dialogue: "d15-moving", reading: "r11-new-home", chars: ["把", "搬", "放", "箱"], vocab: true },
  { phase: 4, hsk: 3, title: "Câu bị động 被; tìm đồ thất lạc", milestone: "Kể chuyện không may đã xảy ra bằng câu 被", pinyin: [], grammar: ["bei-passive"], dialogue: "d16-lost-phone", chars: ["被", "拿", "包", "丢"], vocab: true },
  { phase: 4, hsk: 3, title: "Bổ ngữ khả năng; lớp học và du học", milestone: "Nói nghe hiểu / nhìn rõ / làm xong được hay không", pinyin: [], grammar: ["potential-complement"], dialogue: "d17-classroom", reading: "r12-study-abroad", chars: ["听", "写", "清", "楚"], vocab: true },
  { phase: 4, hsk: 3, title: "起来, 下去, 出来; gặp lại bạn cũ", milestone: "Nhớ ra, nhận ra, nói tiếp, đánh giá vẻ ngoài", pinyin: [], grammar: ["direction-extended"], dialogue: "d18-old-friend", chars: ["起", "想", "声", "音"], vocab: true },
  { phase: 4, hsk: 3, title: "So sánh nâng cao; thời tiết bốn mùa", milestone: "So sánh bằng, hơn nhiều, ngày càng; tả thời tiết các vùng", pinyin: [], grammar: ["comparison-advanced"], dialogue: "d19-seasons", reading: "r13-four-seasons", chars: ["春", "夏", "秋", "冬"], vocab: true },
  { phase: 4, hsk: 3, title: "Làm bao lâu, mấy lần; sở thích thể thao", milestone: "Nói đã học / làm bao lâu, mấy lần một tuần", pinyin: [], grammar: ["duration-frequency"], dialogue: "d20-tennis", chars: ["网", "球", "练", "习"], vocab: true },
  { phase: 4, hsk: 3, title: "才 và 就; giờ giấc, đi làm muộn", milestone: "Thể hiện sớm / muộn so với mong đợi, xin lỗi khi đến muộn", pinyin: [], grammar: ["cai-jiu"], dialogue: "d21-late", reading: "r14-early-bird", chars: ["才", "就", "早", "晚"], vocab: true },
  { phase: 4, hsk: 3, title: "Cặp liên từ điều kiện; chọn nhà thuê", milestone: "Cân nhắc lựa chọn bằng 不但…而且, 只要, 只有, 除了", pinyin: [], grammar: ["conditional-conjunctions"], dialogue: "d22-choose-flat", chars: ["只", "要", "而", "且"], vocab: true },
  { phase: 4, hsk: 3, title: "Trình tự hành động; cuối tuần của tôi", milestone: "Kể một ngày theo trình tự: trước, sau, vừa… vừa, vừa… là", pinyin: [], grammar: ["sequence-actions"], reading: "r15-weekend", chars: ["先", "然", "后", "边"], vocab: true },
  { phase: 4, hsk: 3, title: "又, 再, 还 và mức độ; ở nhà hàng", milestone: "Gọi thêm món, khen chê với 极了, 挺…的, 有一点儿", pinyin: [], grammar: ["adverbs-again-degree"], dialogue: "d23-restaurant", chars: ["又", "再", "还", "极"], vocab: true },
  { phase: 4, hsk: 3, title: "谁都, 什么都; chuyện trong nhà", milestone: "Nói \"ai cũng, gì cũng, chẳng đâu\" bằng đại từ nghi vấn", pinyin: [], grammar: ["question-words-indefinite"], reading: "r16-little-sister", chars: ["谁", "什", "么", "哪"], vocab: true },
  { phase: 4, hsk: 3, title: "Giới từ 为了, 关于, 对; thi thử HSK 3", milestone: "Nói mục đích, chủ đề, đối tượng; hoàn thành bài thi thử HSK 3", pinyin: [], grammar: ["prepositions-purpose-topic"], chars: ["为", "关", "于", "向"], vocab: true, mock: "hsk3" },
  { phase: 5, hsk: 4, title: "连…都, 甚至; phỏng vấn xin việc", milestone: "Giới thiệu bản thân khi phỏng vấn, nhấn mạnh bằng 连…都 / 甚至", pinyin: [], grammar: ["lian-dou"], dialogue: "d24-interview", reading: "r17-first-job", chars: ["连", "甚", "至", "职"], vocab: true },
  { phase: 5, hsk: 4, title: "Câu nhượng bộ; chuyến bay bị hoãn", milestone: "Nói \"cho dù / mặc dù / bất kể\" với 即使, 尽管, 不管", pinyin: [], grammar: ["concession"], dialogue: "d25-delayed-flight", chars: ["即", "尽", "管", "论"], vocab: true },
  { phase: 5, hsk: 4, title: "既然, 既…又, 不仅; thuê nhà, mua online", milestone: "Thương lượng thuê nhà; nêu ưu nhược điểm bằng cặp liên từ", pinyin: [], grammar: ["jiran-bujin"], dialogue: "d26-renting", reading: "r18-online-shopping", chars: ["既", "仅", "租", "套"], vocab: true },
  { phase: 5, hsk: 4, title: "由于, 于是, 否则; đi taxi kịp tàu", milestone: "Nói nguyên nhân – kết quả kiểu văn viết, cảnh báo với 否则", pinyin: [], grammar: ["cause-result-formal"], dialogue: "d27-taxi", chars: ["由", "此", "否", "则"], vocab: true },
  { phase: 5, hsk: 4, title: "使, 让, 请; chọn nghề", milestone: "Nói ai khiến / bảo / mời ai làm gì; thuyết phục người khác", pinyin: [], grammar: ["causative-shi-rang"], dialogue: "d28-career", chars: ["使", "律", "记", "者"], vocab: true },
  { phase: 5, hsk: 4, title: "Câu hỏi tu từ; sống chung, môi trường", milestone: "Phàn nàn, phản bác nhẹ nhàng bằng 难道, 不是…吗", pinyin: [], grammar: ["rhetorical-questions"], dialogue: "d29-roommate", reading: "r19-environment", chars: ["难", "道", "怎", "收"], vocab: true },
  { phase: 5, hsk: 4, title: "竟然, 原来, 到底; trận đấu bất ngờ", milestone: "Thể hiện bất ngờ, phát hiện, hỏi dồn bằng phó từ thái độ", pinyin: [], grammar: ["attitude-adverbs"], reading: "r20-the-match", chars: ["竟", "原", "究", "赢"], vocab: true },
  { phase: 5, hsk: 4, title: "从来, 往往, 偶尔; khám sức khoẻ", milestone: "Nói về thói quen, tần suất; hiểu lời khuyên của bác sĩ", pinyin: [], grammar: ["frequency-time-adverbs"], dialogue: "d30-health-check", chars: ["偶", "尔", "常", "健"], vocab: true },
  { phase: 5, hsk: 4, title: "差一点儿, 只好, 千万; một buổi sáng xui xẻo", milestone: "Kể sự cố: suýt nữa, đành phải, may mà; dặn dò", pinyin: [], grammar: ["almost-have-to"], dialogue: "d31-almost-missed", chars: ["差", "千", "万", "稍"], vocab: true },
  { phase: 5, hsk: 4, title: "按照, 通过, 作为, 由; điện thoại và đời sống", milestone: "Hiểu và dùng giới từ văn viết trong bài đọc", pinyin: [], grammar: ["formal-prepositions"], reading: "r21-phone-life", chars: ["按", "照", "通", "过"], vocab: true },
  { phase: 5, hsk: 4, title: "是否, 之前, 将; đọc thông báo", milestone: "Đọc hiểu thông báo, email trang trọng", pinyin: [], grammar: ["formal-structures"], reading: "r22-notice", chars: ["之", "前", "内", "与"], vocab: true },
  { phase: 5, hsk: 4, title: "Phỏng đoán, 来得及; thi thử HSK 4", milestone: "Phỏng đoán với mức chắc chắn khác nhau; hoàn thành bài thi thử HSK 4", pinyin: [], grammar: ["speculation-possibility"], chars: ["恐", "怕", "估", "计"], vocab: true, mock: "hsk4" },
];
