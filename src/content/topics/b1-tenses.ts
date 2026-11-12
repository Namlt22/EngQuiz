import type { TopicContent } from "../types";

/** B1 — nhóm các thì: HTHT vs QKĐ, HTHT tiếp diễn, quá khứ hoàn thành, used to / would. */

const presentPerfectVsPast: TopicContent = {
  slug: "present-perfect-vs-past",
  intro: "I have lost my keys (giờ vẫn chưa thấy) vs I lost my keys yesterday (chuyện đã qua).",
  theory: [
    { type: "summary", text: "Quá khứ đơn nói về việc đã KẾT THÚC tại một thời điểm XÁC ĐỊNH trong quá khứ. Hiện tại hoàn thành nói về việc trong quá khứ nhưng KHÔNG nêu thời điểm, hoặc còn liên quan/kéo dài đến hiện tại." },
    {
      type: "timeline",
      caption: "Quá khứ đơn: một điểm đã đóng lại · Hiện tại hoàn thành: nối đến bây giờ",
      items: [
        { kind: "point", at: -0.7, label: "yesterday (V2)" },
        { kind: "span", at: -0.4, to: 0, label: "since 2020 (have V3)" },
      ],
    },
    {
      type: "compare",
      title: "So sánh",
      headers: ["Quá khứ đơn (V2 / V-ed)", "Hiện tại hoàn thành (have / has + V3)"],
      rows: [
        ["Có thời điểm xác định: yesterday, last year, in 2019, ... ago, when I was ...", "Không nêu thời điểm: ever, never, already, yet, just, so far, recently"],
        ["Việc đã kết thúc hẳn: I lived in Hue for 5 years. (giờ không sống ở đó nữa)", "Việc còn kéo dài: I have lived in Hanoi for 5 years. (vẫn đang sống)"],
        ["Hỏi When...?: When did you see it?", "Hỏi Have you ever...?: Have you ever seen it?"],
        ["Người đã mất / thời kỳ đã qua: Shakespeare wrote many plays.", "Kết quả ở hiện tại: I've broken my arm. (giờ tay đang bó bột)"],
      ],
    },
    {
      type: "usage",
      title: "Cách chuyển từ HTHT sang QKĐ trong hội thoại",
      text: "Câu đầu giới thiệu trải nghiệm bằng HTHT, các câu chi tiết sau đó dùng QKĐ.",
      examples: [
        { en: "Have you ever been to Phu Quoc? – Yes, I have. I went there last summer.", vi: "Bạn đã từng đến Phú Quốc chưa? – Rồi. Tôi đến đó hè năm ngoái." },
        { en: "I've lost my wallet. I left it on the bus this morning.", vi: "Tôi làm mất ví rồi. Sáng nay tôi để quên nó trên xe buýt." },
      ],
    },
    { type: "signals", title: "Dấu hiệu QKĐ", words: ["yesterday", "last week / month / year", "... ago", "in 2019", "when I was young", "What time...?"] },
    { type: "signals", title: "Dấu hiệu HTHT", words: ["ever / never", "already / yet / just", "since / for", "so far / up to now", "recently / lately", "this is the first time"] },
    {
      type: "mistakes",
      items: [
        { wrong: "I have seen him yesterday.", right: "I saw him yesterday.", why: "Có yesterday (thời điểm xác định) → quá khứ đơn, không dùng HTHT." },
        { wrong: "When have you arrived?", right: "When did you arrive?", why: "Câu hỏi When luôn hỏi thời điểm → quá khứ đơn." },
        { wrong: "I live here since 2018.", right: "I have lived here since 2018.", why: "Việc bắt đầu trong quá khứ, kéo dài đến nay → HTHT, không dùng hiện tại đơn." },
      ],
    },
    { type: "tip", text: "Mẹo: nếu bạn có thể trả lời câu hỏi \"Khi nào?\" bằng một thời điểm cụ thể đã qua → quá khứ đơn. Nếu thời điểm không quan trọng hoặc chưa kết thúc → hiện tại hoàn thành." },
  ],
  questions: [
    { id: "b1pv1", type: "mcq", prompt: "I ___ him at the supermarket yesterday.", options: ["have seen", "saw", "see", "have saw"], answer: 1, explanation: "yesterday = thời điểm xác định → quá khứ đơn: saw." },
    { id: "b1pv2", type: "mcq", prompt: "___ you ever ___ sushi?", options: ["Did / eat", "Have / eaten", "Have / ate", "Do / eat"], answer: 1, explanation: "ever (đã từng) → hiện tại hoàn thành: Have you ever eaten...?" },
    { id: "b1pv3", type: "verb_form", prompt: "We ___ in this house since 2015.", base: "live", answers: ["have lived", "'ve lived", "have been living", "'ve been living"], explanation: "since 2015 → việc kéo dài đến nay → have lived." },
    { id: "b1pv4", type: "verb_form", prompt: "Shakespeare ___ Romeo and Juliet.", base: "write", answers: ["wrote"], explanation: "Người đã mất, việc thuộc về quá khứ đã khép lại → quá khứ đơn: wrote." },
    {
      id: "b1pv5", type: "error_id",
      segments: [{ text: "When " }, { text: "have you", underline: true }, { text: " " }, { text: "arrived", underline: true }, { text: " in " }, { text: "Hanoi", underline: true }, { text: "?" }],
      answer: 1, correction: "did you (arrive)",
      explanation: "When hỏi thời điểm → quá khứ đơn: When did you arrive in Hanoi?",
    },
    { id: "b1pv6", type: "gap_fill", prompt: "I've already finished my report. I ___ it two hours ago.", answers: ["finished", "did", "completed"], hint: "quá khứ đơn", explanation: "two hours ago → quá khứ đơn: finished." },
    { id: "b1pv7", type: "transform", prompt: "I started learning English five years ago. I'm still learning it.", starter: "I have", answers: ["I have learned English for five years.", "I have learnt English for five years.", "I have been learning English for five years.", "I have learned English for 5 years."], explanation: "Bắt đầu trong quá khứ và vẫn tiếp tục → HTHT + for five years." },
    {
      id: "b1pv8", type: "matching", prompt: "Nối mỗi câu với thì phù hợp",
      left: ["I ___ to Japan in 2019.", "I ___ to Japan three times.", "She ___ her keys, so she can't get in."],
      right: ["has lost", "went", "have been"],
      pairs: [1, 2, 0],
      explanation: "in 2019 → went (QKĐ); three times (trải nghiệm) → have been; kết quả ở hiện tại → has lost.",
    },
    { id: "b1pv9", type: "word_order", words: ["been", "have", "never", "to", "I", "Da Lat"], answers: ["I have never been to Da Lat"], explanation: "S + have + never + been to + nơi chốn (trải nghiệm)." },
    { id: "b1pv10", type: "mcq", prompt: "My grandfather ___ in the army for ten years. He retired in 1990.", options: ["has served", "served", "has been serving", "serves"], answer: 1, explanation: "Ông đã nghỉ hưu năm 1990 → khoảng thời gian đã kết thúc → quá khứ đơn: served." },
  ],
};

const presentPerfectContinuous: TopicContent = {
  slug: "present-perfect-continuous",
  intro: "have / has been + V-ing — hành động kéo dài đến tận bây giờ, nhấn mạnh QUÁ TRÌNH.",
  theory: [
    { type: "summary", text: "Thì hiện tại hoàn thành tiếp diễn diễn tả hành động bắt đầu trong quá khứ, kéo dài liên tục đến hiện tại (có thể vẫn đang tiếp tục), hoặc vừa dừng lại và để lại dấu vết." },
    {
      type: "timeline",
      caption: "Hành động liên tục từ quá khứ đến bây giờ",
      items: [{ kind: "span", at: -0.6, to: 0, label: "has been raining" }],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "have / has been", role: "aux" }, { t: "V-ing", role: "verb" }], example: "I have been waiting for an hour." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "haven't / hasn't been", role: "aux" }, { t: "V-ing", role: "verb" }], example: "She hasn't been sleeping well." },
        { label: "Nghi vấn (?)", parts: [{ t: "Have / Has", role: "aux" }, { t: "S", role: "subject" }, { t: "been V-ing ?", role: "verb" }], example: "How long have you been learning English?" },
      ],
    },
    {
      type: "usage",
      title: "Cách dùng",
      examples: [
        { en: "It has been raining since this morning.", vi: "Trời mưa từ sáng đến giờ. (vẫn đang mưa)" },
        { en: "You look tired. – I've been working all day.", vi: "Trông bạn mệt quá. – Tôi làm việc cả ngày. (dấu vết: mệt)" },
        { en: "How long have you been studying here?", vi: "Bạn học ở đây bao lâu rồi?" },
      ],
    },
    {
      type: "compare",
      title: "HTHT tiếp diễn vs HTHT",
      headers: ["have been V-ing (quá trình, bao lâu)", "have V3 (kết quả, bao nhiêu)"],
      rows: [
        ["I've been reading this book for two hours.", "I've read 50 pages. / I've read the book. (đã xong)"],
        ["She has been painting the room. (áo dính sơn, chưa chắc xong)", "She has painted the room. (đã sơn xong)"],
      ],
    },
    { type: "tip", text: "Động từ chỉ trạng thái (know, like, love, want, believe, own, understand...) KHÔNG dùng tiếp diễn: I have known him for years (không nói have been knowing)." },
    { type: "signals", words: ["for + khoảng thời gian", "since + mốc thời gian", "How long...?", "all day / all morning", "recently / lately"] },
    {
      type: "mistakes",
      items: [
        { wrong: "I am waiting here for an hour.", right: "I have been waiting here for an hour.", why: "for an hour (kéo dài từ quá khứ đến nay) → không dùng hiện tại tiếp diễn." },
        { wrong: "I have been knowing her since 2010.", right: "I have known her since 2010.", why: "know là động từ trạng thái → dùng HTHT." },
        { wrong: "She has been writing three emails.", right: "She has written three emails.", why: "Có số lượng hoàn thành (three emails) → HTHT." },
      ],
    },
  ],
  questions: [
    { id: "b1pc1", type: "verb_form", prompt: "It ___ since early this morning.", base: "rain", answers: ["has been raining", "'s been raining"], explanation: "Kéo dài liên tục từ sáng đến giờ → has been raining." },
    { id: "b1pc2", type: "verb_form", prompt: "How long have you ___ for the bus?", base: "wait", answers: ["been waiting"], explanation: "How long + quá trình kéo dài → How long have you been waiting?" },
    { id: "b1pc3", type: "mcq", prompt: "I ___ him since we were at primary school.", options: ["have been knowing", "have known", "am knowing", "know"], answer: 1, explanation: "know là động từ trạng thái → HTHT: have known." },
    { id: "b1pc4", type: "mcq", prompt: "Your eyes are red. ___?", options: ["Have you cried", "Have you been crying", "Did you cry", "Are you crying since"], answer: 1, explanation: "Hỏi về hoạt động vừa diễn ra để lại dấu vết (mắt đỏ) → Have you been crying?" },
    { id: "b1pc5", type: "mcq", prompt: "She ___ three chapters of the book so far.", options: ["has been writing", "has written", "writes", "is writing"], answer: 1, explanation: "Có số lượng đã hoàn thành (three chapters) → HTHT: has written." },
    {
      id: "b1pc6", type: "error_id",
      segments: [{ text: "We " }, { text: "are living", underline: true }, { text: " in Da Nang " }, { text: "for", underline: true }, { text: " " }, { text: "six years", underline: true }, { text: "." }],
      answer: 1, correction: "have been living",
      explanation: "for six years (kéo dài đến nay) → have been living (hoặc have lived), không dùng hiện tại tiếp diễn.",
    },
    { id: "b1pc7", type: "transform", prompt: "He started playing the piano two hours ago. He is still playing.", starter: "He has", answers: ["He has been playing the piano for two hours.", "He has been playing the piano for 2 hours.", "He's been playing the piano for two hours."], explanation: "Bắt đầu 2 tiếng trước, vẫn đang chơi → has been playing ... for two hours." },
    { id: "b1pc8", type: "gap_fill", prompt: "I've been learning English ___ 2018.", answers: ["since"], hint: "for / since", explanation: "2018 là mốc thời gian → since." },
    { id: "b1pc9", type: "word_order", words: ["you", "long", "been", "how", "have", "working", "here", "?"], answers: ["How long have you been working here?"], explanation: "How long + have + S + been + V-ing ...?" },
    {
      id: "b1pc10", type: "matching", prompt: "Nối câu với ý nghĩa",
      left: ["I've been painting the kitchen.", "I've painted the kitchen.", "I painted the kitchen last year."],
      right: ["Đã sơn xong, giờ thấy kết quả.", "Việc đã khép lại ở thời điểm quá khứ.", "Nhấn mạnh quá trình, có thể chưa xong."],
      pairs: [2, 0, 1],
      explanation: "been V-ing = quá trình; have V3 = kết quả; V2 + last year = quá khứ xác định.",
    },
  ],
};

const pastPerfect: TopicContent = {
  slug: "past-perfect",
  intro: "had + V3 — việc xảy ra TRƯỚC một việc khác trong quá khứ (\"quá khứ của quá khứ\").",
  theory: [
    { type: "summary", text: "Thì quá khứ hoàn thành diễn tả hành động đã xảy ra và hoàn tất TRƯỚC một hành động hoặc thời điểm khác trong quá khứ. Hành động sau dùng quá khứ đơn." },
    {
      type: "timeline",
      caption: "Việc xảy ra trước (had V3) → việc xảy ra sau (V2)",
      items: [
        { kind: "point", at: -0.8, label: "the train had left" },
        { kind: "point", at: -0.4, label: "I arrived" },
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "had", role: "aux" }, { t: "V3 / V-ed", role: "verb" }], example: "When I arrived, the train had left." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "hadn't", role: "aux" }, { t: "V3 / V-ed", role: "verb" }], example: "I hadn't seen snow before I went to Sapa." },
        { label: "Nghi vấn (?)", parts: [{ t: "Had", role: "aux" }, { t: "S", role: "subject" }, { t: "V3 ?", role: "verb" }], example: "Had you met her before the party?" },
      ],
      note: "had dùng cho mọi ngôi. Viết tắt: I'd, she'd... (dễ nhầm với would — nhìn động từ phía sau: 'd + V3 = had, 'd + V = would).",
    },
    {
      type: "usage",
      title: "Từ nối thường gặp",
      examples: [
        { en: "After she had finished her homework, she watched TV.", vi: "Sau khi làm xong bài tập, cô ấy xem TV." },
        { en: "By the time we got to the cinema, the film had started.", vi: "Khi chúng tôi đến rạp thì phim đã bắt đầu rồi." },
        { en: "I had never flown before I went to Singapore.", vi: "Trước khi đi Singapore tôi chưa từng đi máy bay." },
      ],
    },
    {
      type: "compare",
      title: "Khác nghĩa khi đổi thì",
      headers: ["Quá khứ đơn + quá khứ đơn", "Quá khứ đơn + quá khứ hoàn thành"],
      rows: [["When I arrived, she left. (tôi đến rồi cô ấy mới đi)", "When I arrived, she had left. (cô ấy đi trước khi tôi đến)"]],
    },
    { type: "signals", words: ["before", "after", "by the time", "already", "just", "never ... before", "when"] },
    {
      type: "mistakes",
      items: [
        { wrong: "When I got home, my mother cooked dinner already.", right: "When I got home, my mother had already cooked dinner.", why: "Nấu cơm xảy ra trước khi về nhà → had cooked." },
        { wrong: "She had went out.", right: "She had gone out.", why: "Sau had là V3 (gone), không phải V2 (went)." },
      ],
    },
    { type: "tip", text: "Với before / after, thứ tự đã rõ nên có thể dùng quá khứ đơn cho cả hai vế: After I finished, I left. Nhưng với when / by the time, dùng had V3 để thể hiện việc nào xảy ra trước." },
  ],
  questions: [
    { id: "b1pf1", type: "verb_form", prompt: "When we got to the station, the train ___.", base: "leave", answers: ["had left", "had already left", "'d left"], explanation: "Tàu đi trước khi chúng tôi đến → had left." },
    { id: "b1pf2", type: "verb_form", prompt: "By the time the police arrived, the thief ___.", base: "escape", answers: ["had escaped", "had already escaped"], explanation: "by the time + V2, mệnh đề kia dùng had V3." },
    { id: "b1pf3", type: "mcq", prompt: "I ___ never ___ snow before I visited Sapa.", options: ["have / seen", "had / seen", "did / see", "had / saw"], answer: 1, explanation: "Trải nghiệm tính đến một thời điểm trong quá khứ → had never seen." },
    { id: "b1pf4", type: "mcq", prompt: "After she ___ her homework, she went to bed.", options: ["had finished", "has finished", "finishing", "was finished"], answer: 0, explanation: "Làm bài tập xảy ra trước đi ngủ → had finished." },
    {
      id: "b1pf5", type: "error_id",
      segments: [{ text: "She " }, { text: "had went", underline: true }, { text: " home " }, { text: "before", underline: true }, { text: " I " }, { text: "arrived", underline: true }, { text: "." }],
      answer: 1, correction: "had gone",
      explanation: "had + V3: go → gone.",
    },
    { id: "b1pf6", type: "transform", prompt: "The film started. Then we arrived at the cinema. (dùng By the time)", starter: "By the time we", answers: ["By the time we arrived at the cinema, the film had started.", "By the time we arrived at the cinema, the film had already started.", "By the time we got to the cinema, the film had started."], explanation: "Phim bắt đầu trước → the film had started; mệnh đề by the time dùng quá khứ đơn." },
    { id: "b1pf7", type: "gap_fill", prompt: "I was hungry because I ___ eaten anything all day.", answers: ["hadn't", "had not"], hint: "phủ định", explanation: "Chưa ăn gì trước thời điểm thấy đói → hadn't eaten." },
    { id: "b1pf8", type: "word_order", words: ["had", "the", "already", "film", "started"], answers: ["The film had already started"], explanation: "S + had + already + V3." },
    {
      id: "b1pf9", type: "matching", prompt: "Nối câu với nghĩa đúng",
      left: ["When I arrived, she left.", "When I arrived, she had left.", "When I arrived, she was leaving."],
      right: ["Cô ấy đang trên đường ra về.", "Tôi đến rồi cô ấy mới đi.", "Cô ấy đã đi trước khi tôi đến."],
      pairs: [1, 2, 0],
      explanation: "V2 + V2: nối tiếp; had V3: xảy ra trước; was V-ing: đang diễn ra.",
    },
    { id: "b1pf10", type: "mcq", prompt: "He told me he ___ the report the day before.", options: ["writes", "has written", "had written", "is writing"], answer: 2, explanation: "Việc viết xảy ra trước lúc kể (told) → had written." },
  ],
};

const usedToWould: TopicContent = {
  slug: "used-to-would",
  intro: "used to / would + V — thói quen, trạng thái trong quá khứ nay KHÔNG CÒN nữa.",
  theory: [
    { type: "summary", text: "used to + V nói về thói quen hoặc trạng thái trong quá khứ mà bây giờ không còn. would + V cũng diễn tả thói quen lặp lại trong quá khứ, nhưng KHÔNG dùng cho trạng thái." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "used to", role: "aux" }, { t: "V", role: "verb" }], example: "I used to live in the countryside." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "didn't use to", role: "aux" }, { t: "V", role: "verb" }], example: "She didn't use to like vegetables." },
        { label: "Nghi vấn (?)", parts: [{ t: "Did", role: "aux" }, { t: "S", role: "subject" }, { t: "use to V ?", role: "verb" }], example: "Did you use to play football?" },
        { label: "Thói quen với would", parts: [{ t: "S", role: "subject" }, { t: "would", role: "aux" }, { t: "V", role: "verb" }], example: "Every summer, we would go to the beach." },
      ],
      note: "Sau did / didn't viết use to (không có -d).",
    },
    {
      type: "compare",
      title: "used to vs would",
      headers: ["", "used to", "would"],
      rows: [
        ["Thói quen lặp lại", "✔ I used to walk to school.", "✔ I would walk to school."],
        ["Trạng thái (be, have, live, like, know...)", "✔ I used to have long hair.", "✘ I would have long hair."],
        ["Cần ngữ cảnh quá khứ rõ", "Không cần", "Thường cần (When I was a child, ...)"],
      ],
    },
    {
      type: "usage",
      title: "Ví dụ",
      examples: [
        { en: "There used to be a cinema here.", vi: "Ở đây từng có một rạp chiếu phim. (giờ không còn)" },
        { en: "When I was little, my grandmother would tell me stories every night.", vi: "Hồi nhỏ, tối nào bà cũng kể chuyện cho tôi nghe." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I use to play the guitar when I was young.", right: "I used to play the guitar when I was young.", why: "Khẳng định phải là used to." },
        { wrong: "Did you used to swim?", right: "Did you use to swim?", why: "Sau did dùng use to." },
        { wrong: "I would have a dog when I was a child.", right: "I used to have a dog when I was a child.", why: "have (sở hữu) là trạng thái → không dùng would." },
        { wrong: "I used to living in Hue.", right: "I used to live in Hue.", why: "used to + V nguyên mẫu. (be used to + V-ing là cấu trúc khác, học ở B2.)" },
      ],
    },
  ],
  questions: [
    { id: "b1ut1", type: "mcq", prompt: "I ___ live in Hue, but now I live in Hanoi.", options: ["use to", "used to", "would", "am used to"], answer: 1, explanation: "Trạng thái trong quá khứ nay không còn → used to live." },
    { id: "b1ut2", type: "mcq", prompt: "___ you use to play video games when you were a child?", options: ["Did", "Do", "Were", "Used"], answer: 0, explanation: "Câu hỏi: Did + S + use to + V?" },
    { id: "b1ut3", type: "gap_fill", prompt: "She didn't ___ to like spicy food, but now she loves it.", answers: ["use"], hint: "use / used", explanation: "Sau didn't dùng use to (không -d)." },
    { id: "b1ut4", type: "mcq", prompt: "When I was a child, I ___ a cat called Mimi.", options: ["would have", "used to have", "use to have", "was having"], answer: 1, explanation: "have (sở hữu) là trạng thái → used to, không dùng would." },
    {
      id: "b1ut5", type: "error_id",
      segments: [{ text: "My father " }, { text: "used to", underline: true }, { text: " " }, { text: "smoking", underline: true }, { text: " but he " }, { text: "gave up", underline: true }, { text: " last year." }],
      answer: 3, correction: "smoke",
      explanation: "used to + V nguyên mẫu: used to smoke.",
    },
    { id: "b1ut6", type: "transform", prompt: "There was a big tree in front of my house, but it isn't there now.", starter: "There used", answers: ["There used to be a big tree in front of my house.", "There used to be a big tree in front of my house, but it isn't there now."], explanation: "Trạng thái đã thay đổi → There used to be..." },
    { id: "b1ut7", type: "transform", prompt: "I played football every afternoon when I was at school. (dùng would)", starter: "I would", answers: ["I would play football every afternoon when I was at school.", "I'd play football every afternoon when I was at school."], explanation: "Thói quen lặp lại trong quá khứ → would + V." },
    { id: "b1ut8", type: "word_order", words: ["to", "long", "she", "have", "used", "hair"], answers: ["She used to have long hair"], explanation: "S + used to + V." },
    {
      id: "b1ut9", type: "matching", prompt: "Câu nào dùng would được?",
      left: ["We ___ go fishing every Sunday.", "I ___ be very shy.", "They ___ live in a small flat."],
      right: ["Chỉ used to (trạng thái: be)", "Cả used to và would", "Chỉ used to (trạng thái: live)"],
      pairs: [1, 0, 2],
      explanation: "would chỉ dùng cho hành động lặp lại (go fishing); be, live là trạng thái → chỉ used to.",
    },
  ],
};

export const B1_TENSE_TOPICS: TopicContent[] = [presentPerfectVsPast, presentPerfectContinuous, pastPerfect, usedToWould];
