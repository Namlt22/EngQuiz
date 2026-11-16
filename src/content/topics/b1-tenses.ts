import type { TopicContent } from "../types";

/** B1 — nhóm thì: hiện tại hoàn thành vs quá khứ đơn, HTHT tiếp diễn, quá khứ hoàn thành, used to / would. */

const presentPerfectVsPast: TopicContent = {
  slug: "present-perfect-vs-past",
  intro: "I have been to Hue vs I went to Hue last year — khi nào dùng thì nào.",
  theory: [
    {
      type: "summary",
      text: "Quá khứ đơn nói về việc đã xong ở một THỜI ĐIỂM XÁC ĐỊNH trong quá khứ (yesterday, in 2020, last week). Hiện tại hoàn thành nói về trải nghiệm hoặc kết quả còn liên quan đến BÂY GIỜ, không nêu rõ lúc nào.",
    },
    {
      type: "timeline",
      caption: "Quá khứ đơn: một điểm đã khép lại. Hiện tại hoàn thành: từ quá khứ nối đến hiện tại.",
      items: [
        { kind: "point", at: -0.6, label: "went (2020)" },
        { kind: "span", at: -0.5, to: 0, label: "have lived" },
      ],
    },
    {
      type: "compare",
      title: "So sánh nhanh",
      headers: ["", "Quá khứ đơn", "Hiện tại hoàn thành"],
      rows: [
        ["Công thức", "S + V2/V-ed", "S + have/has + V3/V-ed"],
        ["Thời gian", "Xác định, đã kết thúc", "Không xác định hoặc chưa kết thúc"],
        ["Dấu hiệu", "yesterday, ago, last ..., in 2019, when ...", "ever, never, already, yet, just, since, for, so far"],
        ["Ví dụ", "I saw that film last night.", "I have seen that film twice."],
      ],
    },
    {
      type: "usage",
      title: "Câu chuyện thường mở bằng HTHT rồi chuyển sang quá khứ đơn",
      text: "Câu đầu nêu trải nghiệm (HTHT), câu sau kể chi tiết khi nào, ở đâu (quá khứ đơn).",
      examples: [
        { en: "Have you ever been to Da Nang? — Yes, I went there last summer.", vi: "Bạn từng đến Đà Nẵng chưa? — Rồi, tôi đến đó hè năm ngoái." },
        { en: "She has lost her keys. She lost them on the bus this morning.", vi: "Cô ấy bị mất chìa khóa. Cô ấy làm rơi trên xe buýt sáng nay." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I have seen him yesterday.", right: "I saw him yesterday.", why: "Có thời điểm xác định (yesterday) → quá khứ đơn." },
        { wrong: "I live here since 2018.", right: "I have lived here since 2018.", why: "Việc bắt đầu trong quá khứ, vẫn còn đến giờ, có since → HTHT." },
        { wrong: "When have you arrived?", right: "When did you arrive?", why: "Câu hỏi When hỏi thời điểm → quá khứ đơn." },
      ],
    },
    { type: "tip", text: "Thấy từ chỉ thời điểm đã kết thúc (ago, last, yesterday, in + năm) thì gần như chắc chắn là quá khứ đơn." },
  ],
  questions: [
    { id: "pvp1", type: "mcq", prompt: "I ___ this film last weekend.", options: ["have watched", "watched", "have been watching", "watch"], answer: 1, explanation: "last weekend là thời điểm đã kết thúc → quá khứ đơn watched." },
    { id: "pvp2", type: "mcq", prompt: "___ you ever ___ sushi?", options: ["Did / eat", "Have / eaten", "Do / eat", "Were / eating"], answer: 1, explanation: "ever hỏi về trải nghiệm → Have you ever eaten." },
    { id: "pvp3", type: "verb_form", prompt: "We ___ in this city since 2015.", base: "live", answers: ["have lived", "'ve lived"], explanation: "since + mốc thời gian, việc vẫn còn → have lived." },
    { id: "pvp4", type: "verb_form", prompt: "She ___ to Japan two years ago.", base: "go", answers: ["went"], explanation: "ago → quá khứ đơn: went." },
    { id: "pvp5", type: "gap_fill", prompt: "I haven't finished my homework ___.", answers: ["yet"], hint: "already / yet", explanation: "yet dùng ở cuối câu phủ định và câu hỏi của HTHT." },
    { id: "pvp6", type: "mcq", prompt: "When ___ your new job?", options: ["have you started", "did you start", "you started", "have you start"], answer: 1, explanation: "When hỏi thời điểm → quá khứ đơn did you start." },
    {
      id: "pvp7", type: "error_id",
      segments: [{ text: "I " }, { text: "have met", underline: true }, { text: " my best friend " }, { text: "in", underline: true }, { text: " " }, { text: "2019", underline: true }, { text: "." }],
      answer: 1, correction: "met",
      explanation: "in 2019 là thời điểm xác định → quá khứ đơn met.",
    },
    { id: "pvp8", type: "transform", prompt: "I started learning English three years ago.", starter: "I have", answers: ["I have learned English for three years.", "I have learnt English for three years.", "I have been learning English for three years."], explanation: "started ... ago → have learned ... for + khoảng thời gian." },
    { id: "pvp9", type: "mcq", prompt: "Look! Somebody ___ the window.", options: ["broke", "has broken", "breaks", "was breaking"], answer: 1, explanation: "Kết quả còn thấy ngay bây giờ, không nêu lúc nào → has broken." },
    { id: "pvp10", type: "verb_form", prompt: "My father ___ to Hanoi last month.", base: "fly", answers: ["flew"], explanation: "last month → quá khứ đơn: fly → flew." },
  ],
};

const presentPerfectContinuous: TopicContent = {
  slug: "present-perfect-continuous",
  intro: "I have been waiting for an hour — nhấn mạnh việc kéo dài đến bây giờ.",
  theory: [
    { type: "summary", text: "Hiện tại hoàn thành tiếp diễn nói về một hành động bắt đầu trong quá khứ, KÉO DÀI liên tục đến hiện tại (và có thể còn tiếp). Thì này nhấn mạnh QUÁ TRÌNH và thời gian, không nhấn mạnh kết quả." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "have / has been", role: "aux" }, { t: "V-ing", role: "verb" }, { t: "for / since ...", role: "object" }], example: "I have been studying for two hours." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "haven't / hasn't been", role: "aux" }, { t: "V-ing", role: "verb" }], example: "She hasn't been sleeping well lately." },
        { label: "Nghi vấn (?)", parts: [{ t: "Have / Has", role: "aux" }, { t: "S", role: "subject" }, { t: "been V-ing", role: "verb" }, { t: "?", role: "other" }], example: "How long have you been waiting?" },
      ],
    },
    {
      type: "compare",
      title: "HTHT vs HTHT tiếp diễn",
      headers: ["Hiện tại hoàn thành", "Hiện tại hoàn thành tiếp diễn"],
      rows: [
        ["Nhấn mạnh kết quả, số lượng: I have read three books.", "Nhấn mạnh quá trình, thời gian: I have been reading all day."],
        ["Việc đã xong: She has painted the room.", "Việc vừa làm, còn dấu vết: Her hands are dirty — she has been painting."],
        ["Động từ trạng thái: I have known him for years.", "Không dùng với know, like, believe, own..."],
      ],
    },
    { type: "signals", words: ["for two hours", "since this morning", "all day", "lately", "recently", "How long ...?"] },
    {
      type: "mistakes",
      items: [
        { wrong: "I have been knowing her since 2010.", right: "I have known her since 2010.", why: "know là động từ trạng thái, không chia tiếp diễn." },
        { wrong: "I am waiting here for an hour.", right: "I have been waiting here for an hour.", why: "Việc kéo dài từ quá khứ đến giờ + for → HTHT tiếp diễn, không phải hiện tại tiếp diễn." },
      ],
    },
  ],
  questions: [
    { id: "ppc1", type: "mcq", prompt: "I ___ for you for forty minutes!", options: ["wait", "am waiting", "have been waiting", "waited"], answer: 2, explanation: "Việc kéo dài đến giờ + for → have been waiting." },
    { id: "ppc2", type: "verb_form", prompt: "It ___ since early morning.", base: "rain", answers: ["has been raining", "'s been raining"], explanation: "It → has been raining since ..." },
    { id: "ppc3", type: "mcq", prompt: "How long ___ English?", options: ["have you been learning", "are you learning", "do you learn", "did you learn"], answer: 0, explanation: "How long hỏi khoảng thời gian kéo dài đến nay → have you been learning." },
    { id: "ppc4", type: "mcq", prompt: "I ___ him since we were children.", options: ["have been knowing", "have known", "am knowing", "know"], answer: 1, explanation: "know là động từ trạng thái → have known." },
    { id: "ppc5", type: "gap_fill", prompt: "She is tired because she has ___ working all day.", answers: ["been"], explanation: "has been + V-ing." },
    { id: "ppc6", type: "mcq", prompt: "I ___ three emails this morning.", options: ["have been writing", "have written", "am writing", "write"], answer: 1, explanation: "Nêu số lượng (three emails) → nhấn mạnh kết quả → have written." },
    { id: "ppc7", type: "verb_form", prompt: "Your eyes are red. Have you ___?", base: "cry", answers: ["been crying"], explanation: "Dấu vết còn thấy của việc vừa diễn ra → Have you been crying?" },
    {
      id: "ppc8", type: "error_id",
      segments: [{ text: "We " }, { text: "are living", underline: true }, { text: " in this flat " }, { text: "for", underline: true }, { text: " " }, { text: "five years", underline: true }, { text: "." }],
      answer: 1, correction: "have been living",
      explanation: "for five years (đến nay) → have been living / have lived.",
    },
    { id: "ppc9", type: "word_order", words: ["been", "long", "have", "how", "you", "waiting", "?"], answers: ["How long have you been waiting?"], explanation: "How long + have + S + been + V-ing?" },
  ],
};

const pastPerfect: TopicContent = {
  slug: "past-perfect",
  intro: "When I arrived, the train had left — việc xảy ra TRƯỚC một việc khác trong quá khứ.",
  theory: [
    { type: "summary", text: "Quá khứ hoàn thành (had + V3) diễn tả một hành động đã xong TRƯỚC một hành động hoặc thời điểm khác trong quá khứ. Việc xảy ra trước dùng had + V3, việc xảy ra sau dùng quá khứ đơn." },
    {
      type: "timeline",
      caption: "had left xảy ra trước arrived",
      items: [
        { kind: "point", at: -0.75, label: "had left" },
        { kind: "point", at: -0.35, label: "arrived" },
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "had", role: "aux" }, { t: "V3/V-ed", role: "verb" }], example: "The film had started when we got there." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "hadn't", role: "aux" }, { t: "V3/V-ed", role: "verb" }], example: "I hadn't eaten anything before the exam." },
        { label: "Nghi vấn (?)", parts: [{ t: "Had", role: "aux" }, { t: "S", role: "subject" }, { t: "V3/V-ed ?", role: "verb" }], example: "Had you met her before the party?" },
      ],
      note: "Dùng chung cho mọi ngôi: I / he / they had gone.",
    },
    { type: "signals", words: ["before", "after", "by the time", "already", "when", "until", "never ... before"] },
    {
      type: "usage",
      title: "Các cấu trúc hay gặp",
      examples: [
        { en: "By the time we arrived, the shop had closed.", vi: "Lúc chúng tôi đến thì cửa hàng đã đóng cửa." },
        { en: "After she had finished her work, she went home.", vi: "Sau khi làm xong việc, cô ấy về nhà." },
        { en: "I had never seen the sea before I was ten.", vi: "Trước năm mười tuổi tôi chưa từng thấy biển." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "When I got home, my mother cooked dinner already.", right: "When I got home, my mother had already cooked dinner.", why: "Việc nấu xảy ra trước việc về nhà → had cooked." },
        { wrong: "He had went out.", right: "He had gone out.", why: "Sau had là V3 (gone), không phải V2 (went)." },
      ],
    },
  ],
  questions: [
    { id: "pfp1", type: "mcq", prompt: "When we reached the station, the train ___.", options: ["left", "had left", "has left", "was leaving"], answer: 1, explanation: "Tàu rời đi TRƯỚC khi chúng tôi đến → had left." },
    { id: "pfp2", type: "verb_form", prompt: "She told me she ___ the book already.", base: "read", answers: ["had read", "'d read"], explanation: "Việc đọc xảy ra trước lúc kể → had read." },
    { id: "pfp3", type: "verb_form", prompt: "By the time I got up, everyone ___ breakfast.", base: "have", answers: ["had had", "'d had"], explanation: "By the time + quá khứ đơn → mệnh đề kia dùng had + V3: had had." },
    { id: "pfp4", type: "mcq", prompt: "I ___ never ___ snow before I visited Sa Pa.", options: ["have / seen", "had / seen", "did / see", "was / seeing"], answer: 1, explanation: "Trải nghiệm tính đến một thời điểm quá khứ → had never seen." },
    { id: "pfp5", type: "gap_fill", prompt: "After he ___ finished his homework, he watched TV.", answers: ["had"], explanation: "After + had + V3, mệnh đề sau dùng quá khứ đơn." },
    {
      id: "pfp6", type: "error_id",
      segments: [{ text: "When I " }, { text: "arrived", underline: true }, { text: ", the meeting " }, { text: "has", underline: true }, { text: " already " }, { text: "started", underline: true }, { text: "." }],
      answer: 3, correction: "had",
      explanation: "Câu chuyện ở quá khứ, việc bắt đầu xảy ra trước → had already started.",
    },
    { id: "pfp7", type: "transform", prompt: "First she locked the door. Then she went to bed.", starter: "After she had", answers: ["After she had locked the door, she went to bed."], explanation: "Việc trước → had + V3; việc sau → quá khứ đơn." },
    { id: "pfp8", type: "mcq", prompt: "They were hungry because they ___ all day.", options: ["didn't eat", "haven't eaten", "hadn't eaten", "don't eat"], answer: 2, explanation: "Việc không ăn kéo dài trước lúc thấy đói (quá khứ) → hadn't eaten." },
    { id: "pfp9", type: "verb_form", prompt: "I couldn't get in because I ___ my keys.", base: "lose", answers: ["had lost", "'d lost"], explanation: "Mất chìa khóa xảy ra trước việc không vào được → had lost." },
  ],
};

const usedToWould: TopicContent = {
  slug: "used-to-would",
  intro: "I used to live in Hue — thói quen, trạng thái trong quá khứ nay không còn.",
  theory: [
    { type: "summary", text: "used to + V nói về thói quen hoặc trạng thái trong quá khứ mà bây giờ KHÔNG còn nữa. would + V cũng diễn tả thói quen lặp lại trong quá khứ (hay dùng khi kể chuyện), nhưng KHÔNG dùng cho trạng thái." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "used to", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }], example: "I used to play football every afternoon." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "didn't use to", role: "aux" }, { t: "V", role: "verb" }], example: "She didn't use to like vegetables." },
        { label: "Nghi vấn (?)", parts: [{ t: "Did", role: "aux" }, { t: "S", role: "subject" }, { t: "use to V ?", role: "verb" }], example: "Did you use to walk to school?" },
        { label: "would", parts: [{ t: "S", role: "subject" }, { t: "would", role: "aux" }, { t: "V (hành động lặp lại)", role: "verb" }], example: "Every summer we would go to the beach." },
      ],
      note: "Sau did / didn't viết use to (không có d).",
    },
    {
      type: "compare",
      title: "used to vs would",
      headers: ["", "used to", "would"],
      rows: [
        ["Thói quen lặp lại", "✓ I used to cycle to school.", "✓ I would cycle to school."],
        ["Trạng thái (be, have, live, like...)", "✓ I used to have long hair.", "✗ I would have long hair."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I use to play the guitar when I was young.", right: "I used to play the guitar when I was young.", why: "Câu khẳng định viết used to." },
        { wrong: "Did you used to live here?", right: "Did you use to live here?", why: "Sau did dùng use to." },
        { wrong: "We would live in a small village.", right: "We used to live in a small village.", why: "live là trạng thái → không dùng would." },
      ],
    },
  ],
  questions: [
    { id: "utw1", type: "mcq", prompt: "When I was a child, I ___ afraid of the dark.", options: ["would be", "used to be", "use to be", "was used to be"], answer: 1, explanation: "Trạng thái trong quá khứ → used to be (không dùng would)." },
    { id: "utw2", type: "gap_fill", prompt: "Did you ___ to live near the river?", answers: ["use"], explanation: "Câu hỏi với did → use to." },
    { id: "utw3", type: "mcq", prompt: "My grandmother ___ tell us stories every evening.", options: ["would", "was", "uses to", "is used to"], answer: 0, explanation: "Hành động lặp lại khi kể chuyện quá khứ → would tell (used to cũng đúng nhưng không có trong lựa chọn)." },
    { id: "utw4", type: "transform", prompt: "I smoked in the past, but I don't now.", starter: "I used", answers: ["I used to smoke."], explanation: "Thói quen quá khứ không còn → used to smoke." },
    {
      id: "utw5", type: "error_id",
      segments: [{ text: "She " }, { text: "didn't used to", underline: true }, { text: " " }, { text: "drink", underline: true }, { text: " " }, { text: "coffee", underline: true }, { text: "." }],
      answer: 1, correction: "didn't use to",
      explanation: "Sau didn't viết use to.",
    },
    { id: "utw6", type: "mcq", prompt: "We ___ a dog, but it died last year.", options: ["would have", "used to have", "use to have", "were having"], answer: 1, explanation: "have (sở hữu) là trạng thái → used to have." },
    { id: "utw7", type: "word_order", words: ["used", "there", "be", "to", "a", "cinema", "here"], answers: ["There used to be a cinema here"], explanation: "There used to be ... = ngày xưa ở đây từng có ..." },
    { id: "utw8", type: "gap_fill", prompt: "He ___ to work at a bank, but now he's a teacher.", answers: ["used"], explanation: "Công việc trước đây, nay không còn → used to work." },
    { id: "utw9", type: "transform", prompt: "There was a market here, but it's gone now.", starter: "There used", answers: ["There used to be a market here."], explanation: "There used to be + N." },
  ],
};

export const B1_TENSE_TOPICS: TopicContent[] = [presentPerfectVsPast, presentPerfectContinuous, pastPerfect, usedToWould];
