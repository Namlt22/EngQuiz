import type { TopicContent } from "../types";

/** A2 — nhóm các thì: was/were, quá khứ tiếp diễn, phối hợp thì quá khứ, tương lai, hiện tại hoàn thành. */

const pastBe: TopicContent = {
  slug: "past-be",
  intro: "was / were — quá khứ của động từ to be.",
  theory: [
    { type: "summary", text: "was / were là quá khứ của am / is / are. Dùng để nói ai/cái gì ĐÃ LÀ gì, Ở đâu, NHƯ THẾ NÀO trong quá khứ." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "I / He / She / It", role: "subject" }, { t: "was", role: "aux" }, { t: "...", role: "object" }], example: "I was at home yesterday." },
        { label: "Khẳng định (+)", parts: [{ t: "You / We / They", role: "subject" }, { t: "were", role: "aux" }, { t: "...", role: "object" }], example: "They were tired." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "wasn't / weren't", role: "aux" }, { t: "...", role: "object" }], example: "The film wasn't interesting." },
        { label: "Nghi vấn (?)", parts: [{ t: "Was / Were", role: "aux" }, { t: "S", role: "subject" }, { t: "... ?", role: "object" }], example: "Were you at school yesterday?" },
      ],
      note: "There was + số ít / There were + số nhiều. Nói năm sinh: I was born in 2010.",
    },
    { type: "signals", words: ["yesterday", "last night / week / year", "... ago", "in 2015", "when I was a child"] },
    {
      type: "mistakes",
      items: [
        { wrong: "I born in 2008.", right: "I was born in 2008.", why: "\"Được sinh ra\" luôn cần was/were: was born." },
        { wrong: "They was at the park.", right: "They were at the park.", why: "They đi với were." },
        { wrong: "Did you be at home?", right: "Were you at home?", why: "Câu hỏi với to be không dùng did." },
      ],
    },
  ],
  questions: [
    { id: "pb1", type: "mcq", prompt: "I ___ at home yesterday evening.", options: ["was", "were", "am", "did"], answer: 0, explanation: "I + was; yesterday → quá khứ." },
    { id: "pb2", type: "mcq", prompt: "My parents ___ in Da Lat last week.", options: ["was", "were", "are", "did"], answer: 1, explanation: "My parents (số nhiều) → were." },
    { id: "pb3", type: "gap_fill", prompt: "___ you at school yesterday? – Yes, I was.", answers: ["were"], hint: "was / were", explanation: "you → Were you...?" },
    {
      id: "pb4", type: "error_id",
      segments: [{ text: "I", underline: true }, { text: " " }, { text: "born", underline: true }, { text: " in " }, { text: "2008", underline: true }, { text: "." }],
      answer: 2, correction: "was born",
      explanation: "Năm sinh: I was born in 2008.",
    },
    { id: "pb5", type: "transform", prompt: "The film was interesting. (→ phủ định)", starter: "The film", answers: ["The film wasn't interesting.", "The film was not interesting."], explanation: "was → wasn't." },
    { id: "pb6", type: "mcq", prompt: "There ___ a lot of people at the party.", options: ["was", "were", "is", "be"], answer: 1, explanation: "people số nhiều, quá khứ → There were." },
    {
      id: "pb7", type: "matching", prompt: "Nối câu hỏi với câu trả lời",
      left: ["Were you tired?", "Was it cold?", "Were they at home?"], right: ["Yes, it was.", "No, they weren't.", "Yes, I was."], pairs: [2, 0, 1],
      explanation: "Trả lời ngắn dùng lại was/were với chủ ngữ tương ứng.",
    },
    { id: "pb8", type: "word_order", words: ["were", "where", "yesterday", "you", "?"], answers: ["Where were you yesterday?"], explanation: "Wh- + were + S + thời gian?" },
  ],
};

const pastContinuous: TopicContent = {
  slug: "past-continuous",
  intro: "was / were + V-ing — hành động ĐANG diễn ra tại một thời điểm trong quá khứ.",
  theory: [
    { type: "summary", text: "Thì quá khứ tiếp diễn diễn tả hành động đang xảy ra tại một thời điểm xác định trong quá khứ, hoặc hai hành động cùng diễn ra song song." },
    {
      type: "timeline",
      caption: "Hành động đang diễn ra quanh một thời điểm trong quá khứ",
      items: [
        { kind: "span", at: -0.75, to: -0.3 },
        { kind: "point", at: -0.52, label: "8 p.m. yesterday" },
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "was / were", role: "aux" }, { t: "V-ing", role: "verb" }], example: "I was watching TV at 8 p.m." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "wasn't / weren't", role: "aux" }, { t: "V-ing", role: "verb" }], example: "She wasn't sleeping." },
        { label: "Nghi vấn (?)", parts: [{ t: "Was / Were", role: "aux" }, { t: "S", role: "subject" }, { t: "V-ing ?", role: "verb" }], example: "What were you doing?" },
      ],
    },
    {
      type: "usage",
      title: "Cách dùng",
      examples: [
        { en: "At nine last night, I was reading a book.", vi: "Lúc 9 giờ tối qua, tôi đang đọc sách." },
        { en: "While my mother was cooking, my father was cleaning the house.", vi: "Trong khi mẹ nấu ăn, bố dọn nhà. (song song)" },
      ],
    },
    { type: "signals", words: ["at 8 p.m. yesterday", "at this time last week", "while", "all day yesterday"] },
    {
      type: "mistakes",
      items: [
        { wrong: "I was watch TV.", right: "I was watching TV.", why: "Cần V-ing sau was/were." },
        { wrong: "We was playing.", right: "We were playing.", why: "We đi với were." },
      ],
    },
  ],
  questions: [
    { id: "pq1", type: "verb_form", prompt: "At 8 p.m. yesterday, I ___ TV.", base: "watch", answers: ["was watching"], explanation: "Thời điểm xác định trong quá khứ → was watching." },
    { id: "pq2", type: "verb_form", prompt: "They ___ football at this time last Sunday.", base: "play", answers: ["were playing"], explanation: "They + were + V-ing." },
    { id: "pq3", type: "mcq", prompt: "While my mother was cooking, my father ___ the newspaper.", options: ["read", "was reading", "is reading", "reads"], answer: 1, explanation: "Hai hành động song song với while → cả hai ở quá khứ tiếp diễn." },
    {
      id: "pq4", type: "error_id",
      segments: [{ text: "We " }, { text: "was", underline: true }, { text: " " }, { text: "having", underline: true }, { text: " dinner at " }, { text: "7 o'clock", underline: true }, { text: "." }],
      answer: 1, correction: "were",
      explanation: "We → were.",
    },
    { id: "pq5", type: "transform", prompt: "She was sleeping at midnight. (→ câu hỏi)", starter: "Was", answers: ["Was she sleeping at midnight?"], explanation: "Đảo was lên trước chủ ngữ." },
    { id: "pq6", type: "mcq", prompt: "What ___ you doing at 9 o'clock last night?", options: ["was", "were", "did", "are"], answer: 1, explanation: "you → were; last night → quá khứ." },
    { id: "pq7", type: "word_order", words: ["were", "the", "children", "in", "playing", "garden", "the"], answers: ["The children were playing in the garden"], explanation: "S + were + V-ing + nơi chốn." },
    { id: "pq8", type: "gap_fill", prompt: "It ___ raining when I woke up.", answers: ["was"], hint: "was / were", explanation: "It → was raining." },
  ],
};

const pastSimpleVsContinuous: TopicContent = {
  slug: "past-simple-vs-continuous",
  intro: "I was walking home WHEN it started to rain — hành động dài bị hành động ngắn xen vào.",
  theory: [
    { type: "summary", text: "Khi một hành động ĐANG diễn ra (quá khứ tiếp diễn) thì một hành động khác XEN VÀO (quá khứ đơn). when thường đi với hành động ngắn, while đi với hành động dài." },
    {
      type: "timeline",
      caption: "Hành động dài (đang xảy ra) bị hành động ngắn cắt ngang",
      items: [
        { kind: "span", at: -0.85, to: -0.25, label: "was walking" },
        { kind: "point", at: -0.5, label: "rain started" },
      ],
    },
    {
      type: "formula",
      title: "Hai cách nối",
      rows: [
        { label: "when + hành động ngắn", parts: [{ t: "S + was/were V-ing", role: "aux" }, { t: "when", role: "other" }, { t: "S + V2/V-ed", role: "verb" }], example: "I was having a shower when the phone rang." },
        { label: "while + hành động dài", parts: [{ t: "While", role: "other" }, { t: "S + was/were V-ing", role: "aux" }, { t: ",", role: "other" }, { t: "S + V2/V-ed", role: "verb" }], example: "While I was doing my homework, the lights went out." },
      ],
    },
    {
      type: "compare",
      title: "Chuỗi hành động vs hành động bị xen ngang",
      headers: ["Quá khứ đơn + quá khứ đơn", "Quá khứ tiếp diễn + quá khứ đơn"],
      rows: [
        ["Xảy ra nối tiếp: When I arrived, they started dinner.", "Đang xảy ra thì bị xen: When I arrived, they were having dinner."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "While I cooked, the phone was ringing.", right: "While I was cooking, the phone rang.", why: "Hành động dài (nấu ăn) → tiếp diễn; hành động ngắn (chuông reo) → quá khứ đơn." },
        { wrong: "She was breaking her leg while she played football.", right: "She broke her leg while she was playing football.", why: "Gãy chân là hành động ngắn, đột ngột → quá khứ đơn." },
      ],
    },
  ],
  questions: [
    { id: "sx1", type: "mcq", prompt: "I ___ a shower when the phone rang.", options: ["had", "was having", "have", "am having"], answer: 1, explanation: "Đang tắm (dài) thì chuông reo (ngắn) → was having." },
    { id: "sx2", type: "mcq", prompt: "I ___ along the street when I saw an old friend.", options: ["walked", "was walking", "walk", "am walking"], answer: 1, explanation: "Đang đi bộ thì nhìn thấy → was walking." },
    { id: "sx3", type: "verb_form", prompt: "While I was doing my homework, the lights ___ out.", base: "go", answers: ["went"], explanation: "Hành động ngắn xen vào → quá khứ đơn: went." },
    { id: "sx4", type: "verb_form", prompt: "She ___ her leg while she was playing football.", base: "break", answers: ["broke"], explanation: "Gãy chân là hành động ngắn → broke." },
    { id: "sx5", type: "mcq", prompt: "___ you were sleeping, I cleaned the house.", options: ["When", "While", "During", "Because"], answer: 1, explanation: "While + hành động dài (were sleeping)." },
    {
      id: "sx6", type: "error_id",
      segments: [{ text: "When the teacher " }, { text: "came", underline: true }, { text: " in, the students " }, { text: "were talk", underline: true }, { text: " " }, { text: "loudly", underline: true }, { text: "." }],
      answer: 3, correction: "were talking",
      explanation: "Quá khứ tiếp diễn: were + V-ing.",
    },
    { id: "sx7", type: "transform", prompt: "I was cooking. My friend called me. (dùng while)", starter: "While I", answers: ["While I was cooking, my friend called me."], explanation: "While + hành động dài, + hành động ngắn (quá khứ đơn)." },
    { id: "sx8", type: "mcq", prompt: "What ___ when the accident happened?", options: ["were you doing", "did you do", "you were doing", "are you doing"], answer: 0, explanation: "Hỏi việc đang làm khi sự việc xảy ra → were you doing." },
  ],
};

const willGoingTo: TopicContent = {
  slug: "will-going-to",
  intro: "will hay be going to? Quyết định tức thì, dự định và dự đoán.",
  theory: [
    { type: "summary", text: "will: quyết định NGAY lúc nói, dự đoán theo ý kiến, lời hứa, đề nghị. be going to: DỰ ĐỊNH đã có từ trước, hoặc dự đoán dựa trên dấu hiệu rõ ràng." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "will", parts: [{ t: "S", role: "subject" }, { t: "will / won't", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }], example: "I'll help you." },
        { label: "be going to", parts: [{ t: "S", role: "subject" }, { t: "am / is / are going to", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }], example: "We're going to visit Hue." },
      ],
    },
    {
      type: "compare",
      title: "So sánh",
      headers: ["will", "be going to"],
      rows: [
        ["Quyết định tức thì: The phone's ringing. – I'll get it.", "Dự định có sẵn: I've bought a ticket. I'm going to fly to Hue."],
        ["Dự đoán theo ý kiến: I think it will be sunny.", "Dự đoán có dấu hiệu: Look at those clouds! It's going to rain."],
        ["Lời hứa: I won't tell anyone.", ""],
      ],
    },
    { type: "signals", words: ["I think / I'm sure / probably (→ will)", "tomorrow", "next week", "Look! (→ going to)"] },
    {
      type: "mistakes",
      items: [
        { wrong: "She will goes to the market.", right: "She will go to the market.", why: "Sau will là V nguyên mẫu." },
        { wrong: "I going to study.", right: "I am going to study.", why: "Thiếu to be (am/is/are)." },
        { wrong: "I will to call you.", right: "I will call you.", why: "Không có to sau will." },
      ],
    },
  ],
  questions: [
    { id: "wg1", type: "mcq", prompt: "The phone is ringing. – I ___ answer it.", options: ["will", "am going to", "going to", "am"], answer: 0, explanation: "Quyết định ngay lúc nói → will." },
    { id: "wg2", type: "mcq", prompt: "Look at those dark clouds! It ___ rain.", options: ["will", "is going to", "goes to", "is"], answer: 1, explanation: "Dự đoán có dấu hiệu rõ ràng → is going to." },
    { id: "wg3", type: "mcq", prompt: "I've bought a ticket. I ___ visit Hue next week.", options: ["will", "am going to", "go", "would"], answer: 1, explanation: "Dự định đã có (đã mua vé) → am going to." },
    { id: "wg4", type: "mcq", prompt: "I think Vietnam ___ win the match.", options: ["will", "is going", "are going to", "wins"], answer: 0, explanation: "I think + dự đoán theo ý kiến → will." },
    {
      id: "wg5", type: "error_id",
      segments: [{ text: "She " }, { text: "will goes", underline: true }, { text: " to " }, { text: "the market", underline: true }, { text: " " }, { text: "tomorrow", underline: true }, { text: "." }],
      answer: 1, correction: "will go",
      explanation: "Sau will là V nguyên mẫu.",
    },
    { id: "wg6", type: "gap_fill", prompt: "Don't worry. I ___ tell anyone your secret.", answers: ["won't", "will not"], hint: "will (phủ định)", explanation: "Lời hứa phủ định → won't." },
    { id: "wg7", type: "transform", prompt: "Kế hoạch của tôi: đi du học năm sau. (dùng be going to + study abroad next year)", starter: "I am", answers: ["I am going to study abroad next year.", "I'm going to study abroad next year."], explanation: "Dự định → am going to + V." },
    { id: "wg8", type: "word_order", words: ["going", "what", "you", "are", "to", "do", "?"], answers: ["What are you going to do?"], explanation: "What + are + you + going to + do?" },
  ],
};

const presentContinuousFuture: TopicContent = {
  slug: "present-continuous-future",
  intro: "I'm meeting Lan tonight — dùng hiện tại tiếp diễn cho kế hoạch đã sắp xếp.",
  theory: [
    { type: "summary", text: "Hiện tại tiếp diễn (am/is/are + V-ing) còn dùng để nói về kế hoạch TƯƠNG LAI đã được SẮP XẾP cụ thể (đã hẹn giờ, đã đặt vé, đã mời người). Thường có thời gian tương lai đi kèm." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Kế hoạch đã sắp xếp", parts: [{ t: "S", role: "subject" }, { t: "am / is / are", role: "aux" }, { t: "V-ing", role: "verb" }, { t: "+ thời gian tương lai", role: "object" }], example: "We're flying to Da Nang on Friday." },
      ],
    },
    {
      type: "compare",
      title: "Ba cách nói tương lai",
      headers: ["Cách", "Dùng khi", "Ví dụ"],
      rows: [
        ["am/is/are + V-ing", "đã hẹn, đã sắp xếp", "I'm seeing the dentist at 3 tomorrow."],
        ["be going to", "dự định (có thể chưa sắp xếp)", "I'm going to learn the guitar."],
        ["hiện tại đơn", "lịch trình cố định (tàu, xe, lớp học)", "The train leaves at 6:15."],
      ],
    },
    { type: "signals", words: ["tonight", "tomorrow", "this weekend", "next Monday", "on Friday"] },
    {
      type: "mistakes",
      items: [
        { wrong: "She is fly to Bangkok tomorrow.", right: "She is flying to Bangkok tomorrow.", why: "Cần V-ing." },
        { wrong: "What do you do this weekend?", right: "What are you doing this weekend?", why: "Hỏi kế hoạch cuối tuần → hiện tại tiếp diễn." },
      ],
    },
  ],
  questions: [
    { id: "pf1", type: "mcq", prompt: "I ___ my dentist at 3 p.m. tomorrow. I made an appointment.", options: ["see", "am seeing", "saw", "was seeing"], answer: 1, explanation: "Đã hẹn → am seeing." },
    { id: "pf2", type: "verb_form", prompt: "We ___ to Phu Quoc next Saturday. We've booked the hotel.", base: "fly", answers: ["are flying"], explanation: "Kế hoạch đã sắp xếp → are flying." },
    { id: "pf3", type: "mcq", prompt: "What ___ you doing this weekend?", options: ["do", "are", "will", "did"], answer: 1, explanation: "Hỏi kế hoạch: What are you doing...?" },
    { id: "pf4", type: "mcq", prompt: "Câu nào nói về một cuộc hẹn đã sắp xếp trong tương lai?", options: ["I'm meeting Lan at 7 tonight.", "I'm reading a book now.", "I read books every day.", "I was reading at 7."], answer: 0, explanation: "at 7 tonight + hiện tại tiếp diễn → kế hoạch đã sắp xếp." },
    {
      id: "pf5", type: "error_id",
      segments: [{ text: "She " }, { text: "is fly", underline: true }, { text: " to Bangkok " }, { text: "tomorrow", underline: true }, { text: " " }, { text: "morning", underline: true }, { text: "." }],
      answer: 1, correction: "is flying",
      explanation: "am/is/are + V-ing.",
    },
    { id: "pf6", type: "transform", prompt: "Nam and Minh have arranged to play tennis on Sunday.", starter: "Nam is", answers: ["Nam is playing tennis with Minh on Sunday."], explanation: "Đã sắp xếp → is playing." },
    { id: "pf7", type: "word_order", words: ["are", "when", "leaving", "you", "?"], answers: ["When are you leaving?"], explanation: "When + are + you + V-ing?" },
    { id: "pf8", type: "gap_fill", prompt: "My parents ___ coming to visit me next week.", answers: ["are"], hint: "am / is / are", explanation: "My parents → are coming." },
  ],
};

const presentPerfect: TopicContent = {
  slug: "present-perfect",
  intro: "have / has + V3 — trải nghiệm, việc vừa xảy ra và việc kéo dài đến hiện tại.",
  theory: [
    { type: "summary", text: "Thì hiện tại hoàn thành nối quá khứ với hiện tại: trải nghiệm (đã từng), việc vừa mới xảy ra, việc đã/chưa làm, hoặc việc bắt đầu trong quá khứ và vẫn còn tiếp diễn đến bây giờ." },
    {
      type: "timeline",
      caption: "Bắt đầu trong quá khứ, kéo dài/ảnh hưởng đến hiện tại",
      items: [{ kind: "span", at: -0.8, to: 0, label: "since 2015" }],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "have / has", role: "aux" }, { t: "V3 / V-ed", role: "verb" }], example: "She has finished her homework." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "haven't / hasn't", role: "aux" }, { t: "V3", role: "verb" }], example: "I haven't seen that film." },
        { label: "Nghi vấn (?)", parts: [{ t: "Have / Has", role: "aux" }, { t: "S", role: "subject" }, { t: "V3 ?", role: "verb" }], example: "Have you ever been to Japan?" },
      ],
      note: "He / She / It → has. I / You / We / They → have.",
    },
    {
      type: "table",
      title: "V3 của động từ bất quy tắc thường gặp",
      headers: ["V", "V2", "V3"],
      rows: [["be", "was / were", "been"], ["go", "went", "gone"], ["see", "saw", "seen"], ["eat", "ate", "eaten"], ["do", "did", "done"], ["write", "wrote", "written"]],
    },
    {
      type: "table",
      title: "Từ đi kèm",
      headers: ["Từ", "Nghĩa / vị trí", "Ví dụ"],
      rows: [
        ["ever / never", "đã từng / chưa bao giờ (trước V3)", "Have you ever eaten durian? I've never eaten it."],
        ["just", "vừa mới (trước V3)", "He has just left."],
        ["already", "đã... rồi (trước V3)", "I've already done it."],
        ["yet", "chưa (cuối câu phủ định/câu hỏi)", "Have you finished yet?"],
        ["for + khoảng thời gian", "trong (bao lâu)", "for ten years"],
        ["since + mốc thời gian", "từ (khi nào)", "since 2015, since Monday"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I have saw that film.", right: "I have seen that film.", why: "Sau have/has là V3 (seen), không phải V2 (saw)." },
        { wrong: "She have finished.", right: "She has finished.", why: "She → has." },
        { wrong: "I have lived here since five years.", right: "I have lived here for five years.", why: "Khoảng thời gian → for; mốc thời gian → since." },
      ],
    },
  ],
  questions: [
    { id: "pp1", type: "verb_form", prompt: "I have never ___ sushi.", base: "eat", answers: ["eaten"], explanation: "have + V3: eat → eaten." },
    { id: "pp2", type: "mcq", prompt: "___ you ever been to Ha Long Bay?", options: ["Did", "Have", "Has", "Do"], answer: 1, explanation: "Hỏi trải nghiệm: Have you ever + V3?" },
    { id: "pp3", type: "gap_fill", prompt: "My father has just ___ home.", answers: ["come"], hint: "come", explanation: "come → V3 là come." },
    { id: "pp4", type: "mcq", prompt: "We have lived here ___ 2015.", options: ["for", "since", "ago", "in"], answer: 1, explanation: "2015 là mốc thời gian → since." },
    { id: "pp5", type: "mcq", prompt: "They have known each other ___ ten years.", options: ["since", "for", "ago", "in"], answer: 1, explanation: "ten years là khoảng thời gian → for." },
    {
      id: "pp6", type: "error_id",
      segments: [{ text: "She " }, { text: "have", underline: true }, { text: " " }, { text: "finished", underline: true }, { text: " " }, { text: "her homework", underline: true }, { text: "." }],
      answer: 1, correction: "has",
      explanation: "She → has.",
    },
    {
      id: "pp7", type: "error_id",
      segments: [{ text: "I have " }, { text: "saw", underline: true }, { text: " " }, { text: "that film", underline: true }, { text: " " }, { text: "twice", underline: true }, { text: "." }],
      answer: 1, correction: "seen",
      explanation: "have + V3: see → seen.",
    },
    { id: "pp8", type: "transform", prompt: "I started learning English three years ago. I still learn it now.", starter: "I have", answers: ["I have learned English for three years.", "I have learnt English for three years.", "I have been learning English for three years.", "I've learned English for three years.", "I've learnt English for three years."], explanation: "Bắt đầu trong quá khứ, vẫn tiếp tục → have learned + for three years." },
    { id: "pp9", type: "mcq", prompt: "Have you finished your homework ___?", options: ["already", "yet", "just", "since"], answer: 1, explanation: "yet đứng cuối câu hỏi: ...yet?" },
  ],
};

export const A2_TENSE_TOPICS = [pastBe, pastContinuous, pastSimpleVsContinuous, willGoingTo, presentContinuousFuture, presentPerfect];
