/**
 * Các "đơn vị nói" dùng để dựng lộ trình cá nhân (trang /roadmap).
 * Mỗi đơn vị = một chủ đề giao tiếp + ngữ pháp, bài nghe chép và âm IPA đi kèm.
 * Thứ tự = thứ tự học. Người học A1/A2 bắt đầu từ đơn vị đầu, B1 bỏ qua 4 đơn vị nền tảng.
 */

export type RoadmapGoal = "daily" | "work" | "travel";

export interface RoadmapUnit {
  id: string;
  title: string;
  /** Slug chủ điểm ngữ pháp (phải có nội dung trong TOPIC_CONTENT). */
  grammar: string[];
  /** Id bài nghe chép trong DICTATIONS. */
  dictations: string[];
  /** Id bài đọc (READINGS) — dùng ở bài kiểm tra cuối tuần. */
  readings: string[];
  /** Id bài hội thoại (DIALOGUES) — nhập vai ở bài kiểm tra cuối tuần. */
  conversations: string[];
  /** Id âm trong IPA_MAP — luyện ở phần phát âm mỗi ngày. */
  sounds: string[];
  /** Bộ quiz tổng hợp (ngoài quiz từng chủ điểm), vd "level-a2". */
  quizSets?: string[];
  /** Đề tự nói. Mục tiêu nào không có đề riêng thì dùng đề `daily`. */
  prompts: { daily: string[] } & Partial<Record<Exclude<RoadmapGoal, "daily">, string[]>>;
  /** Điều người học làm được khi xong tuần — tự đạt khi hoàn thành mọi ngày của tuần, kể cả bài kiểm tra cuối tuần. */
  milestone: string;
}

/** Số đơn vị nền tảng mà người học B1 được bỏ qua. */
export const B1_SKIP_UNITS = 4;
/** Số đơn vị của lộ trình chính (dùng cho 8 và 12 tuần). */
export const CORE_UNIT_COUNT = 12;

export const ROADMAP_UNITS: RoadmapUnit[] = [
  {
    id: "intro",
    title: "Giới thiệu bản thân, gia đình",
    grammar: ["to-be", "pronouns", "possessives"],
    dictations: ["to-be-basics", "story-my-family"],
    readings: ["my-family"],
    conversations: ["new-friend"],
    sounds: ["i-long", "i-short"],
    prompts: {
      daily: ["Tell me about yourself.", "Tell me about your family."],
      work: ["Introduce yourself at a new job.", "What is your job? Where do you work?"],
      travel: ["Introduce yourself to a new friend at a hostel.", "Where are you from? Tell me about your city."],
    },
    milestone: "Giới thiệu được bản thân và gia đình",
  },
  {
    id: "routine",
    title: "Một ngày của tôi, thói quen",
    grammar: ["present-simple", "frequency-adverbs"],
    dictations: ["present-simple-routine", "frequency-adverbs"],
    readings: ["a-day-at-school"],
    conversations: [],
    sounds: ["s", "z"],
    prompts: {
      daily: ["Describe a normal day for you.", "What do you usually do on weekends?"],
      work: ["Describe a normal working day.", "How often do you have meetings?"],
    },
    milestone: "Kể lại được một ngày bình thường của mình",
  },
  {
    id: "hobbies",
    title: "Sở thích, hiện tại",
    grammar: ["present-continuous", "simple-vs-continuous", "verb-to-ing-basic"],
    dictations: ["present-continuous-now", "verb-to-ing-basic"],
    readings: ["healthy-habits"],
    conversations: [],
    sounds: ["ae", "e"],
    prompts: {
      daily: ["What do you like doing in your free time?", "What are you doing these days?"],
      work: ["What project are you working on now?", "What do you enjoy about your job?"],
    },
    milestone: "Nói về sở thích và việc đang làm",
  },
  {
    id: "questions",
    title: "Đặt câu hỏi, giữ cuộc trò chuyện",
    grammar: ["question-words", "can-cant"],
    dictations: ["question-words", "can-cant"],
    readings: [],
    conversations: ["new-friend"],
    sounds: ["th-voiceless", "th-voiced"],
    prompts: {
      daily: ["Ask a new friend 5 questions about their life.", "What can you do well? What can't you do?"],
      travel: ["Ask a local 5 questions about their city.", "Ask what you can and can't do in a hotel."],
    },
    milestone: "Hỏi và trả lời để giữ được cuộc trò chuyện",
  },
  {
    id: "past",
    title: "Cuối tuần trước, kỷ niệm",
    grammar: ["past-be", "past-simple"],
    dictations: ["past-simple-weekend", "past-be"],
    readings: ["weekend-trip"],
    conversations: [],
    sounds: ["t", "d"],
    prompts: {
      daily: ["What did you do last weekend?", "Tell me about a happy memory."],
      work: ["What did you do at work yesterday?", "Tell me about your first job."],
      travel: ["Tell me about your last trip.", "Where did you go on your last holiday?"],
    },
    milestone: "Kể lại cuối tuần trước bằng quá khứ đơn",
  },
  {
    id: "stories",
    title: "Kể chuyện có diễn biến",
    grammar: ["past-continuous", "past-simple-vs-continuous", "conjunctions-basic"],
    dictations: ["past-simple-vs-continuous", "story-trip-da-nang"],
    readings: ["weekend-trip"],
    conversations: ["lost-luggage"],
    sounds: ["ei", "ai"],
    prompts: {
      daily: ["Tell a story: something surprising happened while you were…", "Tell me about a bad day you had."],
      travel: ["Tell me about a problem you had on a trip.", "Describe a trip that went wrong."],
    },
    milestone: "Kể chuyện có mở đầu, diễn biến và kết thúc",
  },
  {
    id: "plans",
    title: "Kế hoạch, dự định",
    grammar: ["will-going-to", "present-continuous-future"],
    dictations: ["will-going-to", "present-continuous-future"],
    readings: [],
    conversations: ["booking-table"],
    sounds: ["schwa"],
    prompts: {
      daily: ["What are your plans for next month?", "What are you doing this weekend?"],
      work: ["What are your goals at work this year?", "Describe your schedule for next week."],
      travel: ["Plan a 3-day trip and explain it.", "Where are you going on your next holiday?"],
    },
    milestone: "Nói về kế hoạch và dự định sắp tới",
  },
  {
    id: "situations",
    title: "Gọi món, mua sắm, hỏi đường",
    grammar: ["could-would-like", "some-any", "quantifiers"],
    dictations: ["conversation-cafe", "conversation-directions", "could-would-like"],
    readings: [],
    conversations: ["ordering-pho","at-the-market"],
    sounds: ["v", "w"],
    prompts: {
      daily: ["Role-play: order food at a café.", "Role-play: ask for directions to a bank."],
      work: ["Role-play: ask a colleague for help politely.", "Role-play: book a meeting room by phone."],
      travel: ["Role-play: check in at a hotel.", "Role-play: buy a train ticket."],
    },
    milestone: "Gọi món, mua sắm, hỏi đường trọn vẹn",
  },
  {
    id: "experiences",
    title: "Kinh nghiệm bản thân",
    grammar: ["present-perfect"],
    dictations: ["present-perfect"],
    readings: ["remote-work"],
    conversations: ["hotel-check-in"],
    sounds: ["h", "r"],
    prompts: {
      daily: ["Have you ever…? Ask and answer 10 questions.", "What is the most interesting thing you have done?"],
      work: ["What have you achieved in your job so far?", "Have you ever worked in a team abroad?"],
      travel: ["Which countries have you visited?", "Have you ever got lost while travelling?"],
    },
    milestone: "Kể về những trải nghiệm đã có",
  },
  {
    id: "compare",
    title: "So sánh và lựa chọn",
    grammar: ["comparatives-superlatives", "as-as"],
    dictations: ["comparatives-superlatives", "as-as"],
    readings: ["online-shopping"],
    conversations: [],
    sounds: ["er-long", "or-long"],
    prompts: {
      daily: ["City or countryside: which is better?", "Compare two places you have lived in."],
      work: ["Compare two jobs or two companies.", "Working from home or at the office?"],
      travel: ["Compare two cities you have visited.", "Beach or mountains: which is better for a holiday?"],
    },
    milestone: "So sánh và chọn giữa hai lựa chọn, có lý do",
  },
  {
    id: "advice",
    title: "Lời khuyên, quy định, giả định",
    grammar: ["must-have-to-should", "conditional-type-0", "conditional-type-1"],
    dictations: ["must-have-to-should", "first-conditional-plans"],
    readings: ["healthy-habits"],
    conversations: [],
    sounds: ["sh", "ch"],
    prompts: {
      daily: ["Give advice to someone who wants to learn English.", "What will you do if it rains this weekend?"],
      work: ["Give advice to a new colleague.", "What will happen if the project is late?"],
      travel: ["Give advice to a tourist visiting Vietnam.", "What should you do if you lose your passport?"],
    },
    milestone: "Cho lời khuyên trong các tình huống thường gặp",
  },
  {
    id: "goals",
    title: "Mục tiêu và tổng kiểm tra",
    grammar: ["adverbs-manner", "conjunctions-basic"],
    dictations: ["story-new-job", "adverbs-manner"],
    readings: ["my-city"],
    conversations: ["rescheduling-meeting"],
    sounds: ["ng", "l"],
    quizSets: ["level-a2"],
    prompts: {
      daily: ["Talk about your goals for the next year.", "Tell me about yourself and your plans."],
      work: ["Present your career goals in 3 minutes.", "Tell me about yourself and your plans."],
      travel: ["Present your dream trip in 3 minutes.", "Tell me about yourself and your plans."],
    },
    milestone: "Vượt qua tổng kiểm tra A2",
  },
  /* ---------- Mở rộng (lộ trình 16 tuần, hoặc người học B1) ---------- */
  {
    id: "dreams",
    title: "Giả định, ước mơ",
    grammar: ["conditional-type-2"],
    dictations: ["second-conditional-dreams"],
    readings: ["remote-work"],
    conversations: [],
    sounds: ["ou", "au"],
    prompts: {
      daily: ["If you won a lot of money, what would you do?", "If you could live anywhere, where would you live?"],
      work: ["If you were the boss, what would you change?", "If you could have any job, what would it be?"],
    },
    milestone: "Nói về điều sẽ làm “Nếu tôi là…”",
  },
  {
    id: "describe",
    title: "Giới thiệu quê hương, sản phẩm",
    grammar: ["passive-present-past"],
    dictations: ["passive-facts"],
    readings: ["my-city","plastic-problem"],
    conversations: [],
    sounds: ["j", "dj"],
    prompts: {
      daily: ["Describe your hometown: what is it known for?", "How is a traditional dish made?"],
      work: ["Describe a product or service of your company.", "How is your work done, step by step?"],
      travel: ["Describe a famous place in Vietnam.", "When and how was your favourite building built?"],
    },
    milestone: "Giới thiệu quê hương hoặc một sản phẩm",
  },
  {
    id: "opinions",
    title: "Nêu và bảo vệ ý kiến",
    grammar: ["conjunctions-basic", "comparatives-superlatives", "must-have-to-should"],
    dictations: ["conversation-directions"],
    readings: ["plastic-problem"],
    conversations: ["returning-item"],
    sounds: ["oi", "ea"],
    prompts: {
      daily: ["Should students wear uniforms? Give 3 reasons.", "Is social media good or bad for us?"],
      work: ["Should companies allow a 4-day work week?", "Is it better to work for a big or small company?"],
      travel: ["Is tourism good or bad for a city?", "Should you travel alone or with friends?"],
    },
    milestone: "Nêu và bảo vệ ý kiến, có lý do và ví dụ",
  },
  {
    id: "fluency",
    title: "Nói trôi chảy, tổng kết",
    grammar: ["conditional-type-2", "passive-present-past"],
    dictations: ["story-new-job"],
    readings: ["remote-work"],
    conversations: ["rescheduling-meeting","returning-item"],
    sounds: ["schwa"],
    quizSets: ["level-a2"],
    prompts: {
      daily: ["Talk for 5 minutes about your English journey.", "Tell me about yourself and your plans."],
    },
    milestone: "Nói trôi chảy về các chủ đề đã học",
  },
];
