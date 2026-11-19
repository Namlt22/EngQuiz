import type { TopicContent } from "../types";

/**
 * B2 — đợt 1: tương lai tiếp diễn & hoàn thành, quá khứ hoàn thành tiếp diễn, tổng ôn 12 thì,
 * câu điều kiện hỗn hợp, wish / if only + quá khứ hoàn thành, bị động với modal & động từ tường thuật,
 * thể truyền khiến, tường thuật câu hỏi & mệnh lệnh.
 */

const futureContinuousPerfect: TopicContent = {
  slug: "future-continuous-perfect",
  intro: "This time tomorrow I'll be flying · By Friday I'll have finished — nhìn từ một mốc trong tương lai.",
  theory: [
    {
      type: "summary",
      text: "Tương lai tiếp diễn (will be + V-ing): việc ĐANG diễn ra tại một thời điểm trong tương lai. Tương lai hoàn thành (will have + V3): việc sẽ XONG TRƯỚC một mốc trong tương lai. Cả hai đều đặt người nói ở một điểm tương lai rồi nhìn vào hành động.",
    },
    {
      type: "timeline",
      caption: "will be flying: đang bay lúc 9 giờ mai · will have finished: xong trước thứ Sáu",
      items: [
        { kind: "span", at: 0.2, to: 0.5, label: "will be flying" },
        { kind: "point", at: 0.75, label: "by Friday: will have finished" },
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Tương lai tiếp diễn", parts: [{ t: "S", role: "subject" }, { t: "will be", role: "aux" }, { t: "V-ing", role: "verb" }], example: "This time tomorrow I will be lying on the beach." },
        { label: "Tương lai hoàn thành", parts: [{ t: "S", role: "subject" }, { t: "will have", role: "aux" }, { t: "V3/V-ed", role: "verb" }], example: "By 2030, they will have built the new bridge." },
        { label: "Phủ định", parts: [{ t: "S", role: "subject" }, { t: "won't be / won't have", role: "aux" }, { t: "V-ing / V3", role: "verb" }], example: "She won't have finished the report by noon." },
      ],
    },
    {
      type: "usage",
      title: "Cách dùng",
      examples: [
        { en: "Don't call me at 8 — I'll be having dinner.", vi: "Đừng gọi lúc 8 giờ — lúc đó tôi đang ăn tối." },
        { en: "Will you be using the car tonight?", vi: "Tối nay bạn có dùng xe không? (hỏi lịch sự về kế hoạch)" },
        { en: "By the time you arrive, I will have cooked dinner.", vi: "Lúc bạn đến thì tôi đã nấu xong bữa tối." },
        { en: "Next month we will have been married for ten years.", vi: "Tháng sau là chúng tôi cưới nhau được mười năm." },
      ],
    },
    { type: "signals", title: "Dấu hiệu", words: ["this time tomorrow", "at 8 p.m. tomorrow", "by Friday", "by the time ...", "by the end of ...", "in two years' time"] },
    {
      type: "mistakes",
      items: [
        { wrong: "By next June I will finish my degree.", right: "By next June I will have finished my degree.", why: "by + mốc tương lai → việc xong trước mốc đó → tương lai hoàn thành." },
        { wrong: "By the time you will arrive, we will have left.", right: "By the time you arrive, we will have left.", why: "Sau by the time / when / before (mệnh đề thời gian) dùng hiện tại đơn, không dùng will." },
      ],
    },
    { type: "tip", text: "Hỏi kế hoạch của người khác bằng tương lai tiếp diễn nghe lịch sự hơn: Will you be coming to the meeting? (chỉ hỏi thông tin, không có ý ép)." },
  ],
  questions: [
    { id: "fcp1", type: "mcq", prompt: "This time next week I ___ on a beach in Phu Quoc.", options: ["will lie", "will be lying", "will have lain", "am lying"], answer: 1, explanation: "This time next week → việc đang diễn ra tại thời điểm tương lai → will be lying." },
    { id: "fcp2", type: "mcq", prompt: "By the end of this year, she ___ three novels.", options: ["will be writing", "will write", "will have written", "has written"], answer: 2, explanation: "By the end of ... → xong trước mốc → will have written." },
    { id: "fcp3", type: "verb_form", prompt: "Don't phone at seven. We ___ dinner then.", base: "have", answers: ["will be having", "'ll be having"], explanation: "Lúc 7 giờ việc ăn tối đang diễn ra → will be having." },
    { id: "fcp4", type: "verb_form", prompt: "By the time you get here, the film ___.", base: "start", answers: ["will have started", "'ll have started"], explanation: "Xong trước lúc bạn tới → will have started." },
    { id: "fcp5", type: "mcq", prompt: "By the time you ___, we will have left.", options: ["will arrive", "arrive", "will have arrived", "are arriving"], answer: 1, explanation: "Mệnh đề thời gian sau by the time dùng hiện tại đơn: arrive." },
    { id: "fcp6", type: "gap_fill", prompt: "In June, they will have ___ married for twenty years.", answers: ["been"], explanation: "will have been + khoảng thời gian (be married)." },
    {
      id: "fcp7", type: "error_id",
      segments: [{ text: "By next month I " }, { text: "will finish", underline: true }, { text: " " }, { text: "all", underline: true }, { text: " my " }, { text: "exams", underline: true }, { text: "." }],
      answer: 1, correction: "will have finished",
      explanation: "By next month → tương lai hoàn thành: will have finished.",
    },
    { id: "fcp8", type: "transform", prompt: "I will finish the report before Friday.", starter: "By Friday I", answers: ["By Friday I will have finished the report.", "By Friday I'll have finished the report."], explanation: "before Friday → By Friday + will have finished." },
    { id: "fcp9", type: "mcq", prompt: "___ you ___ the car this evening? I need to borrow it.", options: ["Will / be using", "Will / have used", "Are / use", "Do / use"], answer: 0, explanation: "Hỏi lịch sự về kế hoạch → Will you be using ...?" },
    { id: "fcp10", type: "word_order", words: ["will", "finished", "have", "by", "we", "noon", "."], answers: ["We will have finished by noon."], explanation: "S + will have + V3 + by + mốc." },
  ],
};

const pastPerfectContinuous: TopicContent = {
  slug: "past-perfect-continuous",
  intro: "She was tired because she had been working all night — quá trình kéo dài TRƯỚC một mốc quá khứ.",
  theory: [
    { type: "summary", text: "Quá khứ hoàn thành tiếp diễn (had been + V-ing) nói về một hành động KÉO DÀI liên tục cho đến (hoặc ngay trước) một thời điểm trong quá khứ. Nó là \"hiện tại hoàn thành tiếp diễn\" được lùi về quá khứ, thường dùng để giải thích nguyên nhân của một tình trạng trong quá khứ." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "had been", role: "aux" }, { t: "V-ing", role: "verb" }], example: "They had been waiting for two hours when the bus came." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "hadn't been", role: "aux" }, { t: "V-ing", role: "verb" }], example: "I hadn't been sleeping well, so I felt terrible." },
        { label: "Nghi vấn (?)", parts: [{ t: "Had", role: "aux" }, { t: "S", role: "subject" }, { t: "been V-ing ?", role: "verb" }], example: "How long had you been living there before you moved?" },
      ],
    },
    {
      type: "compare",
      title: "Quá khứ hoàn thành vs QKHT tiếp diễn",
      headers: ["had + V3", "had been + V-ing"],
      rows: [
        ["Kết quả, việc đã xong: She had written three letters.", "Quá trình, thời gian: She had been writing letters all morning."],
        ["Dùng được với động từ trạng thái: I had known him for years.", "Không dùng với know, like, own, believe…"],
        ["Hỏi bao nhiêu lần / bao nhiêu cái", "Hỏi bao lâu: How long had they been ...?"],
      ],
    },
    {
      type: "usage",
      title: "Giải thích nguyên nhân trong quá khứ",
      examples: [
        { en: "The ground was wet. It had been raining.", vi: "Mặt đất ướt. Trước đó trời đã mưa." },
        { en: "His eyes were red because he had been crying.", vi: "Mắt anh ấy đỏ vì anh ấy đã khóc." },
        { en: "We had been driving for six hours, so we stopped for a rest.", vi: "Chúng tôi đã lái xe sáu tiếng nên dừng lại nghỉ." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I had been knowing her for years.", right: "I had known her for years.", why: "know là động từ trạng thái → không chia tiếp diễn." },
        { wrong: "She was tired because she has been working all day.", right: "She was tired because she had been working all day.", why: "Mốc là quá khứ (was tired) → lùi thì: had been working." },
      ],
    },
  ],
  questions: [
    { id: "ppcn1", type: "mcq", prompt: "When I arrived, she ___ for over an hour.", options: ["waited", "has been waiting", "had been waiting", "was waited"], answer: 2, explanation: "Kéo dài đến mốc quá khứ (arrived) + for → had been waiting." },
    { id: "ppcn2", type: "verb_form", prompt: "The streets were wet because it ___ all night.", base: "rain", answers: ["had been raining", "'d been raining"], explanation: "Nguyên nhân kéo dài trước mốc quá khứ → had been raining." },
    { id: "ppcn3", type: "mcq", prompt: "He ___ his keys three times before he finally left.", options: ["had been losing", "had lost", "was losing", "has lost"], answer: 1, explanation: "Đếm số lần (three times) → nhấn kết quả → had lost." },
    { id: "ppcn4", type: "mcq", prompt: "How long ___ there before they moved to Hanoi?", options: ["had they been living", "have they been living", "were they living", "did they live"], answer: 0, explanation: "How long + trước một việc quá khứ → had they been living." },
    { id: "ppcn5", type: "gap_fill", prompt: "His hands were dirty. He had ___ repairing the bike.", answers: ["been"], explanation: "had been + V-ing." },
    { id: "ppcn6", type: "mcq", prompt: "I ___ him for ten years when he moved abroad.", options: ["had been knowing", "had known", "knew", "was knowing"], answer: 1, explanation: "know là động từ trạng thái → had known." },
    {
      id: "ppcn7", type: "error_id",
      segments: [{ text: "She " }, { text: "was", underline: true }, { text: " exhausted because she " }, { text: "has been studying", underline: true }, { text: " " }, { text: "all night", underline: true }, { text: "." }],
      answer: 3, correction: "had been studying",
      explanation: "Mốc quá khứ (was exhausted) → had been studying.",
    },
    { id: "ppcn8", type: "verb_form", prompt: "We ___ for six hours, so we were all very tired.", base: "drive", answers: ["had been driving", "'d been driving"], explanation: "Quá trình kéo dài trước tình trạng quá khứ → had been driving." },
    { id: "ppcn9", type: "transform", prompt: "They started waiting at 6. The bus came at 8.", starter: "They had", answers: ["They had been waiting for two hours when the bus came.", "They had been waiting for 2 hours when the bus came."], explanation: "Từ 6 giờ đến 8 giờ = hai tiếng, kéo dài đến lúc xe tới → had been waiting for two hours when ..." },
  ],
};

const twelveTenses: TopicContent = {
  slug: "twelve-tenses",
  intro: "Ôn tổng hợp 12 thì: chọn thì theo THỜI ĐIỂM và CÁCH NHÌN hành động.",
  theory: [
    { type: "summary", text: "Mỗi thì = một thời (quá khứ / hiện tại / tương lai) × một thể (đơn / tiếp diễn / hoàn thành / hoàn thành tiếp diễn). Đơn: sự thật, thói quen, việc trọn vẹn. Tiếp diễn: đang diễn ra tại một thời điểm. Hoàn thành: đã xong trước một mốc. Hoàn thành tiếp diễn: kéo dài đến một mốc." },
    {
      type: "table",
      title: "Bảng 12 thì (động từ work)",
      headers: ["", "Đơn", "Tiếp diễn", "Hoàn thành", "Hoàn thành tiếp diễn"],
      rows: [
        ["Hiện tại", "I work", "I am working", "I have worked", "I have been working"],
        ["Quá khứ", "I worked", "I was working", "I had worked", "I had been working"],
        ["Tương lai", "I will work", "I will be working", "I will have worked", "I will have been working"],
      ],
    },
    {
      type: "compare",
      title: "Câu hỏi để chọn thì",
      headers: ["Tự hỏi", "Nếu CÓ → thì"],
      rows: [
        ["Có mốc thời gian đã kết thúc (yesterday, in 2020, ago)?", "Quá khứ đơn"],
        ["Việc đang diễn ra tại một lúc cụ thể?", "… tiếp diễn"],
        ["Việc xong TRƯỚC một mốc / một việc khác?", "… hoàn thành"],
        ["Nhấn mạnh khoảng thời gian kéo dài đến một mốc (for, since, how long)?", "… hoàn thành tiếp diễn"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I am knowing the answer.", right: "I know the answer.", why: "Động từ trạng thái (know, want, belong…) không chia tiếp diễn." },
        { wrong: "When I will see him, I will tell him.", right: "When I see him, I will tell him.", why: "Mệnh đề thời gian chỉ tương lai dùng hiện tại đơn." },
        { wrong: "I have finished it yesterday.", right: "I finished it yesterday.", why: "yesterday → quá khứ đơn." },
      ],
    },
  ],
  questions: [
    { id: "tt1", type: "mcq", prompt: "Water ___ at 100°C.", options: ["is boiling", "boils", "has boiled", "boiled"], answer: 1, explanation: "Sự thật hiển nhiên → hiện tại đơn." },
    { id: "tt2", type: "mcq", prompt: "While I ___ dinner, the lights went out.", options: ["cooked", "was cooking", "had cooked", "have cooked"], answer: 1, explanation: "Việc đang diễn ra thì việc khác xen vào → quá khứ tiếp diễn." },
    { id: "tt3", type: "verb_form", prompt: "I ___ my keys. I can't find them anywhere.", base: "lose", answers: ["have lost", "'ve lost"], explanation: "Kết quả còn đến hiện tại → hiện tại hoàn thành." },
    { id: "tt4", type: "verb_form", prompt: "By the time the police arrived, the thief ___.", base: "escape", answers: ["had escaped", "'d escaped"], explanation: "Xong trước một việc quá khứ → quá khứ hoàn thành." },
    { id: "tt5", type: "mcq", prompt: "Next year she ___ here for a decade.", options: ["will work", "will have been working", "works", "is working"], answer: 1, explanation: "Kéo dài đến một mốc tương lai → tương lai hoàn thành tiếp diễn." },
    { id: "tt6", type: "mcq", prompt: "Look at those clouds! It ___ rain.", options: ["will", "is going to", "rains", "has rained"], answer: 1, explanation: "Dự đoán có dấu hiệu ngay trước mắt → be going to." },
    { id: "tt7", type: "verb_form", prompt: "How long have you ___ English?", base: "learn", answers: ["been learning"], explanation: "How long + kéo dài đến hiện tại → have you been learning." },
    {
      id: "tt8", type: "error_id",
      segments: [{ text: "When I " }, { text: "will finish", underline: true }, { text: " university, I " }, { text: "will travel", underline: true }, { text: " " }, { text: "around", underline: true }, { text: " Asia." }],
      answer: 1, correction: "finish",
      explanation: "Mệnh đề thời gian (When ...) chỉ tương lai dùng hiện tại đơn: When I finish.",
    },
    { id: "tt9", type: "mcq", prompt: "I ___ him since we were at school.", options: ["know", "knew", "have known", "am knowing"], answer: 2, explanation: "since + mốc, động từ trạng thái → have known." },
    {
      id: "tt10", type: "matching",
      prompt: "Ghép câu với thì.",
      left: ["She had left before I came.", "They will be sleeping at midnight.", "I have been waiting for ages.", "He worked there in 2019."],
      right: ["Quá khứ đơn", "Quá khứ hoàn thành", "Tương lai tiếp diễn", "Hiện tại hoàn thành tiếp diễn"],
      pairs: [1, 2, 3, 0],
      explanation: "had left = QKHT; will be sleeping = TLTD; have been waiting = HTHTTD; worked in 2019 = QKĐ.",
    },
  ],
};

const mixedConditionals: TopicContent = {
  slug: "mixed-conditionals",
  intro: "If I had studied medicine, I would be a doctor now — trộn quá khứ và hiện tại.",
  theory: [
    { type: "summary", text: "Câu điều kiện hỗn hợp ghép hai vế thuộc HAI THỜI KHÁC NHAU. Dạng hay gặp nhất: điều kiện trái với QUÁ KHỨ → kết quả trái với HIỆN TẠI. Dạng thứ hai: điều kiện trái với tính cách / sự thật HIỆN TẠI → kết quả trái với QUÁ KHỨ." },
    {
      type: "formula",
      title: "Hai dạng",
      rows: [
        { label: "Quá khứ → hiện tại", parts: [{ t: "If + S + had V3", role: "other" }, { t: ",", role: "other" }, { t: "S + would", role: "aux" }, { t: "V (now)", role: "verb" }], example: "If I had taken that job, I would live in Singapore now." },
        { label: "Hiện tại → quá khứ", parts: [{ t: "If + S + V2 / were", role: "other" }, { t: ",", role: "other" }, { t: "S + would have", role: "aux" }, { t: "V3", role: "verb" }], example: "If she were more careful, she wouldn't have made that mistake." },
      ],
    },
    {
      type: "usage",
      title: "Ví dụ",
      examples: [
        { en: "If I hadn't missed the flight, I would be in Paris now.", vi: "Nếu tôi không lỡ chuyến bay thì giờ tôi đã ở Paris." },
        { en: "If he spoke English, he would have got the job.", vi: "Nếu anh ấy nói được tiếng Anh (nói chung, đến giờ vẫn không) thì đã được nhận việc." },
        { en: "If we had saved more money, we wouldn't be so worried now.", vi: "Nếu trước đây tiết kiệm nhiều hơn thì giờ đã không lo lắng thế này." },
      ],
    },
    {
      type: "compare",
      title: "Phân biệt với loại 2 và loại 3",
      headers: ["Loại", "Điều kiện", "Kết quả"],
      rows: [
        ["Loại 2", "hiện tại (V2)", "hiện tại (would V)"],
        ["Loại 3", "quá khứ (had V3)", "quá khứ (would have V3)"],
        ["Hỗn hợp", "quá khứ (had V3)", "hiện tại (would V)"],
        ["Hỗn hợp", "hiện tại (V2)", "quá khứ (would have V3)"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "If I studied medicine years ago, I would be a doctor now.", right: "If I had studied medicine years ago, I would be a doctor now.", why: "Điều kiện nói về quá khứ (years ago) → had + V3, dù kết quả ở hiện tại (now)." },
        { wrong: "If I would have known, I would tell you.", right: "If I had known, I would have told you.", why: "Không dùng would trong vế if." },
      ],
    },
    { type: "tip", text: "Tìm từ chỉ thời gian: now, today, still ở vế kết quả → kết quả hiện tại (would + V); yesterday, last year ở vế điều kiện → điều kiện quá khứ (had + V3)." },
  ],
  questions: [
    { id: "mxc1", type: "mcq", prompt: "If I had accepted the offer, I ___ in London now.", options: ["would live", "would have lived", "will live", "lived"], answer: 0, explanation: "Điều kiện quá khứ, kết quả hiện tại (now) → would live." },
    { id: "mxc2", type: "mcq", prompt: "If she ___ so shy, she would have spoken at the meeting yesterday.", options: ["isn't", "weren't", "hadn't been", "wouldn't be"], answer: 1, explanation: "Tính cách hiện tại (vẫn nhút nhát) → kết quả quá khứ → If she weren't ..." },
    { id: "mxc3", type: "verb_form", prompt: "If we had left earlier, we ___ stuck in traffic now.", base: "not be", answers: ["wouldn't be", "would not be"], explanation: "Kết quả hiện tại (now) → wouldn't be." },
    { id: "mxc4", type: "verb_form", prompt: "If I ___ breakfast, I wouldn't be so hungry now.", base: "eat", answers: ["had eaten", "'d eaten"], explanation: "Điều kiện trái quá khứ → had eaten." },
    { id: "mxc5", type: "mcq", prompt: "If he were a better driver, he ___ the accident last week.", options: ["wouldn't cause", "wouldn't have caused", "didn't cause", "won't cause"], answer: 1, explanation: "Kết quả quá khứ (last week) → wouldn't have caused." },
    { id: "mxc6", type: "gap_fill", prompt: "If I had learned to swim as a child, I ___ be afraid of water now.", answers: ["wouldn't", "would not"], explanation: "Kết quả hiện tại phủ định → wouldn't be." },
    {
      id: "mxc7", type: "error_id",
      segments: [{ text: "If I " }, { text: "would have taken", underline: true }, { text: " the map, we " }, { text: "wouldn't be", underline: true }, { text: " " }, { text: "lost", underline: true }, { text: " now." }],
      answer: 1, correction: "had taken",
      explanation: "Vế if không dùng would → If I had taken.",
    },
    { id: "mxc8", type: "transform", prompt: "I didn't go to bed early. I'm tired now.", starter: "If I had", answers: ["If I had gone to bed early, I wouldn't be tired now.", "If I had gone to bed early, I would not be tired now.", "If I had gone to bed early I wouldn't be tired now."], explanation: "Quá khứ → hiện tại: If I had gone ..., I wouldn't be tired now." },
    { id: "mxc9", type: "mcq", prompt: "Which sentence is a mixed conditional?", options: ["If it rains, we'll stay in.", "If I had money, I'd buy it.", "If I had saved, I would be rich now.", "If I had saved, I would have bought it."], answer: 2, explanation: "had saved (quá khứ) + would be ... now (hiện tại) → hỗn hợp." },
  ],
};

const wishPast: TopicContent = {
  slug: "wish-past",
  intro: "I wish I had listened · If only I hadn't said that — tiếc nuối về quá khứ.",
  theory: [
    { type: "summary", text: "wish / if only + quá khứ hoàn thành (had V3) diễn tả sự TIẾC NUỐI về một việc đã xảy ra (hoặc đã không xảy ra) trong quá khứ. If only mạnh và cảm xúc hơn wish." },
    {
      type: "formula",
      title: "Ba dạng wish",
      rows: [
        { label: "Tiếc về hiện tại", parts: [{ t: "S + wish", role: "subject" }, { t: "S + V2 / were", role: "verb" }], example: "I wish I knew the answer." },
        { label: "Tiếc về quá khứ", parts: [{ t: "S + wish", role: "subject" }, { t: "S + had V3", role: "verb" }], example: "I wish I had studied harder." },
        { label: "Muốn người khác thay đổi", parts: [{ t: "S + wish", role: "subject" }, { t: "S + would V", role: "verb" }], example: "I wish you would stop talking." },
      ],
    },
    {
      type: "usage",
      title: "Ví dụ",
      examples: [
        { en: "I wish I hadn't eaten so much.", vi: "Giá mà tôi đừng ăn nhiều như thế." },
        { en: "If only we had left earlier!", vi: "Giá mà chúng ta đi sớm hơn!" },
        { en: "She wishes she had taken the job.", vi: "Cô ấy tiếc vì đã không nhận công việc đó." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I wish I didn't say that yesterday.", right: "I wish I hadn't said that yesterday.", why: "Tiếc về quá khứ (yesterday) → had + V3." },
        { wrong: "I wish I would have gone.", right: "I wish I had gone.", why: "Không dùng would have sau wish để nói về quá khứ của chính mình." },
        { wrong: "I wish I would be taller.", right: "I wish I were taller.", why: "would sau wish chỉ dùng cho hành động của NGƯỜI KHÁC mà ta muốn thay đổi; tình trạng của bản thân dùng V2 / were." },
      ],
    },
    { type: "tip", text: "Lùi một thì so với sự thật: sự thật quá khứ (I didn't go) → wish quá khứ hoàn thành (I wish I had gone)." },
  ],
  questions: [
    { id: "wsp1", type: "mcq", prompt: "I failed the exam. I wish I ___ harder.", options: ["studied", "had studied", "would study", "study"], answer: 1, explanation: "Tiếc về quá khứ → had studied." },
    { id: "wsp2", type: "verb_form", prompt: "If only I ___ my umbrella! I'm soaking wet.", base: "bring", answers: ["had brought", "'d brought"], explanation: "Việc (không) mang ô đã xảy ra → had brought." },
    { id: "wsp3", type: "mcq", prompt: "She wishes she ___ that rude comment.", options: ["didn't make", "hadn't made", "wouldn't make", "doesn't make"], answer: 1, explanation: "Tiếc vì đã nói (quá khứ) → hadn't made." },
    { id: "wsp4", type: "mcq", prompt: "I wish I ___ taller. (hiện tại)", options: ["were", "had been", "would be", "am"], answer: 0, explanation: "Tình trạng hiện tại của bản thân → were." },
    { id: "wsp5", type: "mcq", prompt: "I wish my neighbours ___ so much noise at night.", options: ["didn't", "wouldn't make", "hadn't", "don't make"], answer: 1, explanation: "Muốn người khác thay đổi hành vi → wouldn't make." },
    { id: "wsp6", type: "gap_fill", prompt: "I wish I ___ gone to bed so late last night.", answers: ["hadn't", "had not"], explanation: "Quá khứ, phủ định → hadn't gone." },
    {
      id: "wsp7", type: "error_id",
      segments: [{ text: "I " }, { text: "wish", underline: true }, { text: " I " }, { text: "didn't sell", underline: true }, { text: " my car " }, { text: "last year", underline: true }, { text: "." }],
      answer: 3, correction: "hadn't sold",
      explanation: "last year → tiếc về quá khứ → hadn't sold.",
    },
    { id: "wsp8", type: "transform", prompt: "I'm sorry I didn't call you.", starter: "I wish", answers: ["I wish I had called you.", "I wish I'd called you."], explanation: "Sorry I didn't call → I wish I had called." },
    { id: "wsp9", type: "transform", prompt: "It's a pity we missed the train.", starter: "If only", answers: ["If only we hadn't missed the train.", "If only we had not missed the train.", "If only we hadn't missed the train!"], explanation: "Tiếc việc đã xảy ra → If only + hadn't missed." },
  ],
};

const passiveModalsReporting: TopicContent = {
  slug: "passive-modals-reporting",
  intro: "It must be done · He is said to be rich — bị động với modal và động từ tường thuật.",
  theory: [
    { type: "summary", text: "Bị động với động từ khuyết thiếu: modal + be + V3 (hiện tại) / modal + have been + V3 (quá khứ). Bị động với động từ tường thuật (say, believe, think, report, know…) dùng để nói thông tin chung, trang trọng, thường gặp trong tin tức: It is said that … hoặc S + is said to + V." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Modal (hiện tại)", parts: [{ t: "S", role: "subject" }, { t: "can / must / should + be", role: "aux" }, { t: "V3", role: "verb" }], example: "The form must be signed by Friday." },
        { label: "Modal (quá khứ)", parts: [{ t: "S", role: "subject" }, { t: "should / might + have been", role: "aux" }, { t: "V3", role: "verb" }], example: "The letter might have been lost." },
        { label: "It + bị động", parts: [{ t: "It", role: "subject" }, { t: "is said / believed", role: "aux" }, { t: "that + mệnh đề", role: "other" }], example: "It is believed that the painting is fake." },
        { label: "Chủ ngữ + to V", parts: [{ t: "S", role: "subject" }, { t: "is said / believed", role: "aux" }, { t: "to V / to have V3", role: "verb" }], example: "The painting is believed to be fake." },
      ],
    },
    {
      type: "compare",
      title: "to V hay to have V3?",
      headers: ["Thông tin nói về", "Dạng", "Ví dụ"],
      rows: [
        ["cùng lúc với lời nói", "to + V", "He is said to live in Da Lat."],
        ["việc xảy ra trước lời nói", "to have + V3", "He is said to have lived in Da Lat as a child."],
        ["việc đang diễn ra", "to be + V-ing", "They are thought to be negotiating now."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The work must be finish today.", right: "The work must be finished today.", why: "Sau be luôn là V3." },
        { wrong: "He is said that he is rich.", right: "It is said that he is rich. / He is said to be rich.", why: "Hai mẫu khác nhau: It … that … hoặc S … to V, không trộn." },
      ],
    },
  ],
  questions: [
    { id: "pmr1", type: "mcq", prompt: "All applications ___ online.", options: ["must submit", "must be submitted", "must submitted", "must be submit"], answer: 1, explanation: "Bị động với modal: must be + V3." },
    { id: "pmr2", type: "verb_form", prompt: "The problem ___ earlier. (should, solve — quá khứ)", base: "solve", answers: ["should have been solved"], explanation: "Lẽ ra phải được giải quyết (quá khứ) → should have been solved." },
    { id: "pmr3", type: "mcq", prompt: "It ___ that the company will close next year.", options: ["says", "is said", "is saying", "said to"], answer: 1, explanation: "It is said that + mệnh đề." },
    { id: "pmr4", type: "mcq", prompt: "The suspect is believed ___ the country last night.", options: ["to leave", "to have left", "leaving", "left"], answer: 1, explanation: "Việc rời đi xảy ra trước thời điểm nói → to have left." },
    { id: "pmr5", type: "gap_fill", prompt: "This medicine can ___ bought without a prescription.", answers: ["be"], explanation: "can be + V3." },
    { id: "pmr6", type: "transform", prompt: "People say that he is very generous.", starter: "He is said", answers: ["He is said to be very generous."], explanation: "S + is said + to be ..." },
    { id: "pmr7", type: "transform", prompt: "People believe that the thieves escaped by car.", starter: "The thieves are believed", answers: ["The thieves are believed to have escaped by car."], explanation: "Việc trốn thoát đã xảy ra → to have escaped." },
    {
      id: "pmr8", type: "error_id",
      segments: [{ text: "The tickets " }, { text: "can", underline: true }, { text: " " }, { text: "be book", underline: true }, { text: " " }, { text: "online", underline: true }, { text: "." }],
      answer: 3, correction: "be booked",
      explanation: "Sau be dùng V3: be booked.",
    },
    { id: "pmr9", type: "mcq", prompt: "The bridge ___ to have been built in the 12th century.", options: ["thinks", "is thought", "thought", "is thinking"], answer: 1, explanation: "S + is thought + to have been built." },
  ],
};

const causative: TopicContent = {
  slug: "causative",
  intro: "I had my hair cut · She got her phone repaired — nhờ / thuê người khác làm.",
  theory: [
    { type: "summary", text: "Thể truyền khiến (causative) dùng khi ta SẮP XẾP cho người khác làm việc gì cho mình (thường là dịch vụ): have / get + tân ngữ (vật) + V3. Không cần nêu người làm; muốn nêu thì thêm by …. Dạng chủ động: have + người + V / get + người + to V." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Bị động (vật)", parts: [{ t: "S", role: "subject" }, { t: "have / get", role: "aux" }, { t: "something", role: "object" }, { t: "V3", role: "verb" }], example: "I had my car washed yesterday." },
        { label: "Chủ động (have)", parts: [{ t: "S", role: "subject" }, { t: "have", role: "aux" }, { t: "someone", role: "object" }, { t: "V (nguyên mẫu)", role: "verb" }], example: "I had the mechanic check the brakes." },
        { label: "Chủ động (get)", parts: [{ t: "S", role: "subject" }, { t: "get", role: "aux" }, { t: "someone", role: "object" }, { t: "to V", role: "verb" }], example: "I got my brother to help me move." },
      ],
    },
    {
      type: "usage",
      title: "Ví dụ",
      examples: [
        { en: "We're having our kitchen painted next week.", vi: "Tuần sau chúng tôi thuê người sơn bếp." },
        { en: "Where do you get your hair cut?", vi: "Bạn cắt tóc ở đâu?" },
        { en: "He had his wallet stolen on the train.", vi: "Anh ấy bị mất trộm ví trên tàu. (việc không mong muốn)" },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I cut my hair at the hairdresser's.", right: "I had my hair cut at the hairdresser's.", why: "Người khác cắt cho mình → have something done." },
        { wrong: "I had repaired my bike.", right: "I had my bike repaired.", why: "Tân ngữ đứng GIỮA have và V3." },
        { wrong: "I got him repair my computer.", right: "I got him to repair my computer.", why: "get + người + to V." },
      ],
    },
  ],
  questions: [
    { id: "cau1", type: "mcq", prompt: "I'm going to ___ next weekend.", options: ["cut my hair", "have my hair cut", "have cut my hair", "get my hair to cut"], answer: 1, explanation: "Thợ cắt cho mình → have my hair cut." },
    { id: "cau2", type: "verb_form", prompt: "We had the roof ___ after the storm.", base: "repair", answers: ["repaired"], explanation: "have + vật + V3." },
    { id: "cau3", type: "mcq", prompt: "She got her assistant ___ the report.", options: ["type", "to type", "typed", "typing"], answer: 1, explanation: "get + người + to V." },
    { id: "cau4", type: "mcq", prompt: "I had the technician ___ my laptop.", options: ["to check", "checked", "check", "checking"], answer: 2, explanation: "have + người + V nguyên mẫu." },
    { id: "cau5", type: "gap_fill", prompt: "He ___ his phone stolen at the concert.", answers: ["had", "got"], explanation: "Việc không mong muốn xảy ra với mình: had (got) something stolen." },
    { id: "cau6", type: "transform", prompt: "A mechanic serviced my car yesterday.", starter: "I had", answers: ["I had my car serviced yesterday.", "I had my car serviced by a mechanic yesterday."], explanation: "I had + my car + serviced." },
    {
      id: "cau7", type: "error_id",
      segments: [{ text: "We " }, { text: "are having", underline: true }, { text: " " }, { text: "painted", underline: true }, { text: " " }, { text: "our house", underline: true }, { text: " next month." }],
      answer: 3, correction: "our house painted",
      explanation: "Tân ngữ đứng trước V3: having our house painted.",
    },
    { id: "cau8", type: "word_order", words: ["my", "had", "I", "checked", "eyes", "."], answers: ["I had my eyes checked."], explanation: "S + had + tân ngữ + V3." },
    { id: "cau9", type: "mcq", prompt: "Where do you usually get your car ___?", options: ["wash", "washed", "to wash", "washing"], answer: 1, explanation: "get + vật + V3 → washed." },
  ],
};

const reportedQuestionsCommands: TopicContent = {
  slug: "reported-questions-commands",
  intro: "She asked where I lived · He told me to sit down — tường thuật câu hỏi và mệnh lệnh.",
  theory: [
    { type: "summary", text: "Câu hỏi tường thuật có trật tự CÂU KỂ (chủ ngữ trước động từ), bỏ do/does/did và dấu hỏi. Câu hỏi có/không dùng if / whether. Mệnh lệnh, yêu cầu dùng tell / ask + người + (not) to V. Thì lùi như câu kể khi động từ tường thuật ở quá khứ." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Câu hỏi Wh-", parts: [{ t: "S asked (me)", role: "subject" }, { t: "wh-word", role: "other" }, { t: "S + V (lùi thì)", role: "verb" }], example: "\"Where do you live?\" → She asked me where I lived." },
        { label: "Câu hỏi Yes/No", parts: [{ t: "S asked (me)", role: "subject" }, { t: "if / whether", role: "other" }, { t: "S + V (lùi thì)", role: "verb" }], example: "\"Are you tired?\" → He asked if I was tired." },
        { label: "Mệnh lệnh", parts: [{ t: "S told / asked", role: "subject" }, { t: "someone", role: "object" }, { t: "(not) to V", role: "verb" }], example: "\"Don't be late.\" → She told us not to be late." },
      ],
    },
    {
      type: "usage",
      title: "Ví dụ",
      examples: [
        { en: "\"What time does the train leave?\" → I asked what time the train left.", vi: "Tôi hỏi mấy giờ tàu chạy." },
        { en: "\"Have you finished?\" → The teacher asked whether we had finished.", vi: "Cô giáo hỏi chúng tôi đã làm xong chưa." },
        { en: "\"Please help me.\" → She asked me to help her.", vi: "Cô ấy nhờ tôi giúp." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She asked me where did I live.", right: "She asked me where I lived.", why: "Câu hỏi tường thuật theo trật tự câu kể, bỏ did." },
        { wrong: "He asked me that I was ready.", right: "He asked me if I was ready.", why: "Câu hỏi có/không dùng if / whether, không dùng that." },
        { wrong: "She told me don't touch it.", right: "She told me not to touch it.", why: "Mệnh lệnh phủ định → not to V." },
      ],
    },
  ],
  questions: [
    { id: "rqc1", type: "mcq", prompt: "\"Where are you going?\" → He asked me where ___.", options: ["was I going", "I was going", "am I going", "I am going to"], answer: 1, explanation: "Trật tự câu kể + lùi thì → I was going." },
    { id: "rqc2", type: "mcq", prompt: "\"Do you like coffee?\" → She asked ___ I liked coffee.", options: ["that", "if", "what", "do"], answer: 1, explanation: "Câu hỏi có/không → if / whether." },
    { id: "rqc3", type: "mcq", prompt: "\"Close the door, please.\" → He asked me ___ the door.", options: ["close", "closing", "to close", "that I close"], answer: 2, explanation: "ask + người + to V." },
    { id: "rqc4", type: "gap_fill", prompt: "\"Don't shout!\" → The teacher told us ___ to shout.", answers: ["not"], explanation: "Mệnh lệnh phủ định → not to V." },
    { id: "rqc5", type: "transform", prompt: "\"What time does the shop open?\" she asked.", starter: "She asked what time", answers: ["She asked what time the shop opened."], explanation: "Bỏ does, lùi thì: opened." },
    { id: "rqc6", type: "transform", prompt: "\"Have you seen my keys?\" he asked me.", starter: "He asked me if", answers: ["He asked me if I had seen his keys.", "He asked me if I'd seen his keys."], explanation: "if + S + had seen (lùi thì), my → his." },
    {
      id: "rqc7", type: "error_id",
      segments: [{ text: "She " }, { text: "asked", underline: true }, { text: " me where " }, { text: "did I buy", underline: true }, { text: " " }, { text: "my shoes", underline: true }, { text: "." }],
      answer: 3, correction: "I had bought",
      explanation: "Trật tự câu kể, lùi thì: where I had bought my shoes.",
    },
    { id: "rqc8", type: "mcq", prompt: "\"Can you help me?\" → She asked ___ help her.", options: ["if I can", "whether I could", "me could I", "that I could"], answer: 1, explanation: "Có/không → whether + lùi thì can → could." },
    { id: "rqc9", type: "word_order", words: ["asked", "was", "he", "me", "what", "name", "my", "."], answers: ["He asked me what my name was."], explanation: "S + asked + me + what + my name + was (trật tự câu kể)." },
  ],
};

export const B2_TENSE_CONDITIONAL_TOPICS: TopicContent[] = [
  futureContinuousPerfect,
  pastPerfectContinuous,
  twelveTenses,
  mixedConditionals,
  wishPast,
  passiveModalsReporting,
  causative,
  reportedQuestionsCommands,
];
