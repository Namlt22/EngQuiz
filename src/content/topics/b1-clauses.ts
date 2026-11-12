import type { TopicContent } from "../types";

/** B1 — nhóm mệnh đề & biến đổi câu: unless/in case, bị động các thì, mệnh đề quan hệ, tường thuật, suy đoán, wish. */

const unlessInCase: TopicContent = {
  slug: "unless-in-case",
  intro: "unless = if ... not · as long as = miễn là · in case = phòng khi.",
  theory: [
    { type: "summary", text: "Ngoài if, tiếng Anh có nhiều liên từ điều kiện khác. Chúng thường theo cấu trúc câu điều kiện loại 1: mệnh đề điều kiện dùng hiện tại đơn, mệnh đề chính dùng will / can / mệnh lệnh." },
    {
      type: "table",
      title: "Các liên từ điều kiện",
      headers: ["Liên từ", "Nghĩa", "Ví dụ"],
      rows: [
        ["unless", "trừ khi, nếu ... không", "You'll miss the bus unless you hurry. (= if you don't hurry)"],
        ["as long as / provided (that)", "miễn là, với điều kiện là", "You can borrow my bike as long as you bring it back tomorrow."],
        ["in case", "phòng khi, đề phòng", "Take an umbrella in case it rains."],
        ["otherwise", "nếu không thì (đứng đầu câu/vế thứ hai)", "Hurry up, otherwise you'll be late."],
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "unless", parts: [{ t: "Unless", role: "other" }, { t: "S + V (khẳng định)", role: "verb" }, { t: ",", role: "other" }, { t: "S + will / can + V", role: "aux" }], example: "Unless you study, you won't pass." },
        { label: "in case", parts: [{ t: "S + V", role: "verb" }, { t: "in case", role: "other" }, { t: "S + V (hiện tại)", role: "subject" }], example: "I'll take my phone in case you call." },
      ],
      note: "Sau unless, as long as, in case KHÔNG dùng will dù nói về tương lai.",
    },
    {
      type: "compare",
      title: "if vs in case",
      headers: ["if (chỉ làm KHI điều đó xảy ra)", "in case (làm TRƯỚC để phòng)"],
      rows: [["I'll buy an umbrella if it rains. (mưa rồi mới mua)", "I'll buy an umbrella in case it rains. (mua sẵn, có thể không mưa)"]],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Unless you don't hurry, you'll be late.", right: "Unless you hurry, you'll be late.", why: "unless đã mang nghĩa phủ định → không thêm don't." },
        { wrong: "Take a coat in case it will be cold.", right: "Take a coat in case it is cold.", why: "Sau in case dùng hiện tại đơn, không dùng will." },
      ],
    },
  ],
  questions: [
    { id: "b1uc1", type: "mcq", prompt: "You won't get better ___ you take the medicine.", options: ["if", "unless", "in case", "as long as"], answer: 1, explanation: "Sẽ không khỏe hơn nếu KHÔNG uống thuốc → unless." },
    { id: "b1uc2", type: "mcq", prompt: "Take some money with you ___ you need a taxi.", options: ["unless", "in case", "as long as", "otherwise"], answer: 1, explanation: "Mang sẵn tiền để phòng khi cần → in case." },
    { id: "b1uc3", type: "mcq", prompt: "You can stay out late ___ you call me.", options: ["unless", "in case", "as long as", "otherwise"], answer: 2, explanation: "Được về muộn MIỄN LÀ gọi cho mẹ → as long as." },
    { id: "b1uc4", type: "transform", prompt: "If you don't leave now, you will miss the train.", starter: "Unless", answers: ["Unless you leave now, you will miss the train.", "Unless you leave now, you'll miss the train."], explanation: "if ... not = unless + khẳng định." },
    {
      id: "b1uc5", type: "error_id",
      segments: [{ text: "Unless you " }, { text: "don't study", underline: true }, { text: " harder, you " }, { text: "won't pass", underline: true }, { text: " the " }, { text: "exam", underline: true }, { text: "." }],
      answer: 1, correction: "study",
      explanation: "unless = if not → bỏ don't: Unless you study harder.",
    },
    { id: "b1uc6", type: "verb_form", prompt: "I'll write down the address in case I ___ it.", base: "forget", answers: ["forget"], explanation: "Sau in case dùng hiện tại đơn dù nói về tương lai." },
    { id: "b1uc7", type: "gap_fill", prompt: "Hurry up, ___ we'll be late for the meeting.", answers: ["otherwise", "or"], hint: "nếu không thì", explanation: "otherwise (hoặc or) = nếu không thì." },
    { id: "b1uc8", type: "word_order", words: ["case", "a", "take", "it", "in", "coat", "gets", "cold"], answers: ["Take a coat in case it gets cold"], explanation: "Mệnh lệnh + in case + hiện tại đơn." },
    {
      id: "b1uc9", type: "matching", prompt: "Nối liên từ với nghĩa",
      left: ["unless", "as long as", "in case"],
      right: ["phòng khi", "trừ khi", "miễn là"],
      pairs: [1, 2, 0],
      explanation: "unless = trừ khi; as long as = miễn là; in case = phòng khi.",
    },
  ],
};

const passiveOtherTenses: TopicContent = {
  slug: "passive-other-tenses",
  intro: "is being done · has been done · will be done · can be done — bị động ở các thì khác.",
  theory: [
    { type: "summary", text: "Câu bị động luôn có dạng be + V3. Muốn đổi thì, chỉ cần chia động từ be theo thì đó; V3 giữ nguyên." },
    {
      type: "table",
      title: "Bảng chia bị động",
      headers: ["Thì / dạng", "Chủ động", "Bị động"],
      rows: [
        ["Hiện tại tiếp diễn", "They are building a bridge.", "A bridge is being built."],
        ["Quá khứ tiếp diễn", "They were repairing the road.", "The road was being repaired."],
        ["Hiện tại hoàn thành", "Someone has stolen my bike.", "My bike has been stolen."],
        ["Quá khứ hoàn thành", "They had sold the tickets.", "The tickets had been sold."],
        ["Tương lai đơn", "They will announce the results.", "The results will be announced."],
        ["be going to", "They are going to open a shop.", "A shop is going to be opened."],
        ["Modal (can, must, should...)", "You must finish this today.", "This must be finished today."],
      ],
    },
    {
      type: "formula",
      title: "Công thức chung",
      rows: [
        { label: "Tiếp diễn", parts: [{ t: "S", role: "subject" }, { t: "am/is/are/was/were being", role: "aux" }, { t: "V3", role: "verb" }], example: "The room is being cleaned." },
        { label: "Hoàn thành", parts: [{ t: "S", role: "subject" }, { t: "have/has/had been", role: "aux" }, { t: "V3", role: "verb" }], example: "The letter has been sent." },
        { label: "Tương lai / modal", parts: [{ t: "S", role: "subject" }, { t: "will / can / must ... be", role: "aux" }, { t: "V3", role: "verb" }], example: "The work will be done tomorrow." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The house is building now.", right: "The house is being built now.", why: "Bị động tiếp diễn cần being + V3." },
        { wrong: "My car has stolen.", right: "My car has been stolen.", why: "Bị động hoàn thành: has been + V3." },
        { wrong: "It must be finish today.", right: "It must be finished today.", why: "Sau be luôn là V3." },
      ],
    },
    { type: "tip", text: "Mẹo kiểm tra: bỏ phần V3 đi, phần còn lại (is being, has been, will be...) phải đúng thì của câu chủ động." },
  ],
  questions: [
    { id: "b1po1", type: "verb_form", prompt: "A new hospital ___ in our town at the moment.", base: "build", answers: ["is being built"], explanation: "at the moment → tiếp diễn; bị động: is being built." },
    { id: "b1po2", type: "verb_form", prompt: "My wallet ___! I can't find it anywhere.", base: "steal", answers: ["has been stolen", "'s been stolen"], explanation: "Kết quả ở hiện tại → HTHT bị động: has been stolen." },
    { id: "b1po3", type: "mcq", prompt: "The results ___ next Monday.", options: ["will announce", "will be announced", "are announcing", "have announced"], answer: 1, explanation: "Kết quả được công bố (bị động) + tương lai → will be announced." },
    { id: "b1po4", type: "mcq", prompt: "This form must ___ in black ink.", options: ["fill", "be filled", "been filled", "filling"], answer: 1, explanation: "Modal + be + V3: must be filled." },
    {
      id: "b1po5", type: "error_id",
      segments: [{ text: "The road " }, { text: "was", underline: true }, { text: " " }, { text: "repairing", underline: true }, { text: " when we " }, { text: "drove", underline: true }, { text: " past." }],
      answer: 3, correction: "being repaired",
      explanation: "Con đường được sửa → bị động quá khứ tiếp diễn: was being repaired.",
    },
    { id: "b1po6", type: "transform", prompt: "They have cancelled the concert.", starter: "The concert", answers: ["The concert has been cancelled.", "The concert has been canceled.", "The concert has been cancelled by them."], explanation: "have cancelled → has been cancelled (chủ ngữ mới số ít)." },
    { id: "b1po7", type: "transform", prompt: "Someone is cleaning the classroom now.", starter: "The classroom", answers: ["The classroom is being cleaned now.", "The classroom is being cleaned."], explanation: "is cleaning → is being cleaned; bỏ someone." },
    { id: "b1po8", type: "transform", prompt: "You should keep medicine away from children.", starter: "Medicine", answers: ["Medicine should be kept away from children."], explanation: "should + V → should be + V3." },
    { id: "b1po9", type: "word_order", words: ["been", "the", "has", "already", "sent", "email"], answers: ["The email has already been sent"], explanation: "S + has + already + been + V3." },
    {
      id: "b1po10", type: "matching", prompt: "Nối câu chủ động với câu bị động",
      left: ["They will open it.", "They have opened it.", "They are opening it."],
      right: ["It is being opened.", "It will be opened.", "It has been opened."],
      pairs: [1, 2, 0],
      explanation: "Giữ nguyên thì của be: will → will be; have → has been; are V-ing → is being.",
    },
  ],
};

const definingRelative: TopicContent = {
  slug: "defining-relative",
  intro: "who / which / that / whose / where — mệnh đề quan hệ xác định giúp nói rõ \"người nào, cái nào\".",
  theory: [
    { type: "summary", text: "Mệnh đề quan hệ xác định đứng ngay sau danh từ để xác định danh từ đó là ai/cái gì. Nếu bỏ đi, câu sẽ thiếu thông tin quan trọng. Không dùng dấu phẩy." },
    {
      type: "table",
      title: "Đại từ / trạng từ quan hệ",
      headers: ["Từ", "Thay cho", "Ví dụ"],
      rows: [
        ["who", "người (chủ ngữ hoặc tân ngữ)", "The man who lives next door is a doctor."],
        ["which", "vật, con vật", "The book which I bought is very good."],
        ["that", "người hoặc vật (thay who/which)", "The phone that I lost was new."],
        ["whose", "sở hữu (của người/vật đó)", "That's the girl whose father is a pilot."],
        ["where", "nơi chốn", "This is the café where we first met."],
        ["when", "thời gian", "I remember the day when I started school."],
      ],
    },
    {
      type: "formula",
      title: "Vị trí",
      rows: [
        { label: "Làm chủ ngữ", parts: [{ t: "N", role: "subject" }, { t: "who / which / that", role: "other" }, { t: "V ...", role: "verb" }], example: "The woman who called you is my aunt." },
        { label: "Làm tân ngữ (có thể bỏ)", parts: [{ t: "N", role: "object" }, { t: "(who / which / that)", role: "other" }, { t: "S + V", role: "verb" }], example: "The film (that) we watched was boring." },
      ],
      note: "Khi đại từ quan hệ là TÂN NGỮ (theo sau là S + V), có thể lược bỏ nó.",
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The man which lives next door is kind.", right: "The man who lives next door is kind.", why: "Người → who (hoặc that)." },
        { wrong: "This is the book that I bought it yesterday.", right: "This is the book that I bought yesterday.", why: "that đã thay cho the book → không lặp lại it." },
        { wrong: "The girl who her father is a pilot...", right: "The girl whose father is a pilot...", why: "Sở hữu → whose + danh từ." },
      ],
    },
  ],
  questions: [
    { id: "b1dr1", type: "mcq", prompt: "The woman ___ lives next door is a nurse.", options: ["which", "who", "whose", "where"], answer: 1, explanation: "Người, làm chủ ngữ → who." },
    { id: "b1dr2", type: "mcq", prompt: "This is the restaurant ___ we had our first date.", options: ["which", "who", "where", "whose"], answer: 2, explanation: "Nơi chốn (ở đó) → where." },
    { id: "b1dr3", type: "mcq", prompt: "I have a friend ___ brother plays for the national team.", options: ["who", "whose", "which", "that"], answer: 1, explanation: "Anh trai CỦA người bạn → whose + danh từ." },
    { id: "b1dr4", type: "gap_fill", prompt: "The laptop ___ I bought last week has stopped working.", answers: ["which", "that"], hint: "vật", explanation: "Vật → which / that (cũng có thể bỏ vì là tân ngữ)." },
    {
      id: "b1dr5", type: "error_id",
      segments: [{ text: "The film " }, { text: "that", underline: true }, { text: " we " }, { text: "watched it", underline: true }, { text: " last night " }, { text: "was", underline: true }, { text: " amazing." }],
      answer: 3, correction: "watched",
      explanation: "that đã thay cho the film → bỏ it.",
    },
    { id: "b1dr6", type: "transform", prompt: "I met a girl. She speaks five languages. (nối bằng who)", starter: "I met a girl", answers: ["I met a girl who speaks five languages.", "I met a girl that speaks five languages.", "I met a girl who speaks 5 languages."], explanation: "She → who, nối ngay sau a girl." },
    { id: "b1dr7", type: "transform", prompt: "This is the house. My grandfather built it.", starter: "This is the house", answers: ["This is the house which my grandfather built.", "This is the house that my grandfather built.", "This is the house my grandfather built."], explanation: "it → which/that (có thể lược vì là tân ngữ)." },
    { id: "b1dr8", type: "word_order", words: ["who", "the", "man", "called", "is", "my", "teacher"], answers: ["The man who called is my teacher"], explanation: "N + who + V + động từ chính." },
    {
      id: "b1dr9", type: "matching", prompt: "Chọn từ quan hệ phù hợp",
      left: ["the city ___ I was born", "the boy ___ bike was stolen", "the dog ___ bit me"],
      right: ["whose", "which", "where"],
      pairs: [2, 0, 1],
      explanation: "Nơi chốn → where; sở hữu → whose; con vật → which.",
    },
  ],
};

const reportedStatements: TopicContent = {
  slug: "reported-statements",
  intro: "She said (that) she was tired — kể lại lời người khác, LÙI THÌ và đổi đại từ.",
  theory: [
    { type: "summary", text: "Câu tường thuật thuật lại lời nói của ai đó. Khi động từ tường thuật ở quá khứ (said, told), động từ trong câu được lùi một thì; đại từ, tính từ sở hữu và trạng từ thời gian/nơi chốn cũng thay đổi theo." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "say", parts: [{ t: "S", role: "subject" }, { t: "said", role: "verb" }, { t: "(that)", role: "other" }, { t: "S + V (lùi thì)", role: "aux" }], example: "He said (that) he was busy." },
        { label: "tell", parts: [{ t: "S", role: "subject" }, { t: "told", role: "verb" }, { t: "sb", role: "object" }, { t: "(that) S + V (lùi thì)", role: "aux" }], example: "She told me (that) she liked the film." },
      ],
      note: "tell LUÔN cần tân ngữ chỉ người (told me / him / us). say thì không (said that...; nếu có người nghe: said to me).",
    },
    {
      type: "table",
      title: "Lùi thì",
      headers: ["Lời nói trực tiếp", "Câu tường thuật"],
      rows: [
        ["hiện tại đơn: \"I am tired.\"", "quá khứ đơn: she was tired"],
        ["hiện tại tiếp diễn: \"I'm working.\"", "quá khứ tiếp diễn: he was working"],
        ["quá khứ đơn / HTHT: \"I saw it.\" / \"I've seen it.\"", "quá khứ hoàn thành: he had seen it"],
        ["will / can / may", "would / could / might"],
        ["must (bắt buộc)", "had to"],
      ],
    },
    {
      type: "table",
      title: "Đổi trạng từ",
      headers: ["Trực tiếp", "Tường thuật"],
      rows: [
        ["now", "then"],
        ["today / tonight", "that day / that night"],
        ["yesterday", "the day before / the previous day"],
        ["tomorrow", "the next day / the following day"],
        ["here / this", "there / that"],
        ["last week / ago", "the week before / before"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She said me that she was tired.", right: "She told me that she was tired.", why: "Có người nghe ngay sau → dùng told me (hoặc said to me)." },
        { wrong: "He said he will come.", right: "He said he would come.", why: "Động từ tường thuật ở quá khứ → will lùi thành would." },
        { wrong: "She said she is coming tomorrow.", right: "She said she was coming the next day.", why: "Lùi thì và đổi tomorrow → the next day." },
      ],
    },
    { type: "tip", text: "Nếu điều được nói vẫn còn đúng ở hiện tại (sự thật, chân lý), có thể không lùi thì: He said the Earth goes around the Sun." },
  ],
  questions: [
    { id: "b1rs1", type: "mcq", prompt: "\"I am tired,\" she said. → She said she ___ tired.", options: ["is", "was", "has been", "will be"], answer: 1, explanation: "am → was (lùi thì hiện tại đơn → quá khứ đơn)." },
    { id: "b1rs2", type: "mcq", prompt: "He ___ me that he had lost his keys.", options: ["said", "told", "spoke", "talked"], answer: 1, explanation: "Có tân ngữ me ngay sau → told." },
    { id: "b1rs3", type: "transform", prompt: "\"I will call you tomorrow,\" Nam said to me.", starter: "Nam said", answers: ["Nam said he would call me the next day.", "Nam said that he would call me the next day.", "Nam said he would call me the following day.", "Nam said that he would call me the following day.", "Nam said he'd call me the next day."], explanation: "will → would; you → me; tomorrow → the next day." },
    { id: "b1rs4", type: "transform", prompt: "\"I'm watching TV now,\" my brother said.", starter: "My brother said", answers: ["My brother said he was watching TV then.", "My brother said that he was watching TV then.", "My brother said he was watching TV.", "My brother said that he was watching TV."], explanation: "am watching → was watching; now → then." },
    { id: "b1rs5", type: "verb_form", prompt: "\"I saw the film last week.\" → She said she ___ the film the week before.", base: "see", answers: ["had seen"], explanation: "Quá khứ đơn → quá khứ hoàn thành: had seen." },
    {
      id: "b1rs6", type: "error_id",
      segments: [{ text: "Lan " }, { text: "said me", underline: true }, { text: " that she " }, { text: "couldn't", underline: true }, { text: " come to the " }, { text: "party", underline: true }, { text: "." }],
      answer: 1, correction: "told me",
      explanation: "say không đi trực tiếp với tân ngữ người → told me (hoặc said to me).",
    },
    { id: "b1rs7", type: "gap_fill", prompt: "\"I can swim.\" → He said he ___ swim.", answers: ["could"], hint: "lùi thì của can", explanation: "can → could." },
    {
      id: "b1rs8", type: "matching", prompt: "Nối từ ở lời nói trực tiếp với câu tường thuật",
      left: ["tomorrow", "yesterday", "here"],
      right: ["there", "the next day", "the day before"],
      pairs: [1, 2, 0],
      explanation: "tomorrow → the next day; yesterday → the day before; here → there.",
    },
    { id: "b1rs9", type: "word_order", words: ["she", "told", "was", "she", "us", "hungry"], answers: ["She told us she was hungry"], explanation: "S + told + người nghe + mệnh đề lùi thì." },
  ],
};

const modalsDeductionPresent: TopicContent = {
  slug: "modals-deduction-present",
  intro: "must (chắc chắn đúng) · might / may / could (có thể) · can't (chắc chắn không).",
  theory: [
    { type: "summary", text: "Dùng modal để đoán điều gì đó ở hiện tại dựa trên bằng chứng. Mức độ chắc chắn khác nhau tùy modal." },
    {
      type: "table",
      title: "Thang mức độ chắc chắn",
      headers: ["Mức độ", "Modal", "Ví dụ"],
      rows: [
        ["~ 95% đúng", "must + V", "The lights are on. They must be at home."],
        ["~ 50%", "might / may / could + V", "She isn't answering. She might be asleep."],
        ["~ 95% không đúng", "can't + V", "He can't be hungry. He's just eaten."],
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Trạng thái", parts: [{ t: "S", role: "subject" }, { t: "must / might / can't", role: "aux" }, { t: "be + adj / N", role: "verb" }], example: "You must be tired." },
        { label: "Đang diễn ra", parts: [{ t: "S", role: "subject" }, { t: "must / might / can't", role: "aux" }, { t: "be V-ing", role: "verb" }], example: "They might be sleeping." },
      ],
      note: "Phủ định của must (suy đoán) là can't, KHÔNG phải mustn't. mustn't nghĩa là \"cấm\".",
    },
    {
      type: "mistakes",
      items: [
        { wrong: "He mustn't be at home – his car isn't here.", right: "He can't be at home – his car isn't here.", why: "Suy đoán phủ định dùng can't; mustn't là cấm đoán." },
        { wrong: "She must to be tired.", right: "She must be tired.", why: "Sau modal là V nguyên mẫu, không có to." },
        { wrong: "It can be true? I don't think so.", right: "It can't be true!", why: "Diễn tả không tin được → can't be." },
      ],
    },
    { type: "tip", text: "Đọc kỹ \"bằng chứng\" trong câu: bằng chứng mạnh khẳng định → must; bằng chứng mạnh phủ định → can't; không chắc → might / may / could." },
  ],
  questions: [
    { id: "b1md1", type: "mcq", prompt: "You've been working for 12 hours. You ___ be exhausted.", options: ["must", "can't", "mustn't", "might not"], answer: 0, explanation: "Bằng chứng mạnh (làm 12 tiếng) → chắc chắn mệt: must." },
    { id: "b1md2", type: "mcq", prompt: "That ___ be Tom. He's in London this week.", options: ["must", "can't", "might", "should"], answer: 1, explanation: "Tom đang ở London → chắc chắn không phải anh ấy: can't." },
    { id: "b1md3", type: "mcq", prompt: "I'm not sure where Lan is. She ___ be in the library.", options: ["must", "can't", "might", "mustn't"], answer: 2, explanation: "Không chắc chắn → might." },
    { id: "b1md4", type: "gap_fill", prompt: "The phone is ringing. It ___ be my mother – she always calls at this time.", answers: ["must"], hint: "chắc chắn", explanation: "Bằng chứng mạnh (luôn gọi giờ này) → must." },
    {
      id: "b1md5", type: "error_id",
      segments: [{ text: "He " }, { text: "mustn't", underline: true }, { text: " " }, { text: "be", underline: true }, { text: " rich – he " }, { text: "lives", underline: true }, { text: " in a tiny flat." }],
      answer: 1, correction: "can't",
      explanation: "Suy đoán chắc chắn không → can't be, không dùng mustn't.",
    },
    { id: "b1md6", type: "transform", prompt: "I'm sure she is at work. Her car isn't here.", starter: "She must", answers: ["She must be at work.", "She must be at work. Her car isn't here."], explanation: "I'm sure ... is → must be." },
    { id: "b1md7", type: "transform", prompt: "I'm sure this isn't your bag. Yours is blue.", starter: "This can't", answers: ["This can't be your bag.", "This cannot be your bag.", "This can't be your bag. Yours is blue."], explanation: "I'm sure ... isn't → can't be." },
    { id: "b1md8", type: "word_order", words: ["be", "they", "sleeping", "might"], answers: ["They might be sleeping"], explanation: "S + might + be + V-ing (đoán việc đang diễn ra)." },
    {
      id: "b1md9", type: "matching", prompt: "Nối câu với mức độ chắc chắn",
      left: ["She must be at home.", "She might be at home.", "She can't be at home."],
      right: ["Có thể, không chắc", "Gần như chắc chắn không", "Gần như chắc chắn có"],
      pairs: [2, 0, 1],
      explanation: "must ≈ 95% có; might ≈ 50%; can't ≈ 95% không.",
    },
  ],
};

const wishPresent: TopicContent = {
  slug: "wish-present",
  intro: "I wish I had more time — ước điều TRÁI với thực tế ở hiện tại.",
  theory: [
    { type: "summary", text: "wish + quá khứ đơn diễn tả mong ước về hiện tại, điều mà thực tế KHÔNG như vậy. Giống câu điều kiện loại 2, thì quá khứ ở đây thể hiện sự \"không có thật\"." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Ước về hiện tại", parts: [{ t: "S", role: "subject" }, { t: "wish", role: "verb" }, { t: "S", role: "subject" }, { t: "V2 / were", role: "aux" }], example: "I wish I were taller." },
        { label: "Ước có khả năng", parts: [{ t: "S", role: "subject" }, { t: "wish", role: "verb" }, { t: "S", role: "subject" }, { t: "could + V", role: "aux" }], example: "I wish I could speak Japanese." },
        { label: "Phàn nàn, muốn ai thay đổi", parts: [{ t: "S", role: "subject" }, { t: "wish", role: "verb" }, { t: "sb", role: "object" }, { t: "would + V", role: "aux" }], example: "I wish you would stop talking." },
      ],
      note: "Với to be, dùng were cho mọi ngôi (I wish I were...). If only = I wish nhưng mạnh hơn: If only I had more money!",
    },
    {
      type: "usage",
      title: "Từ thực tế sang câu ước",
      text: "Đảo khẳng định ↔ phủ định và lùi một thì.",
      examples: [
        { en: "I don't have a car. → I wish I had a car.", vi: "Tôi không có ô tô. → Ước gì tôi có ô tô." },
        { en: "She lives far away. → I wish she didn't live so far away.", vi: "Cô ấy sống xa. → Ước gì cô ấy không sống xa thế." },
        { en: "I can't swim. → I wish I could swim.", vi: "Tôi không biết bơi. → Ước gì tôi biết bơi." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I wish I have more free time.", right: "I wish I had more free time.", why: "Ước về hiện tại → quá khứ đơn." },
        { wrong: "I wish I would be rich.", right: "I wish I were rich.", why: "Không dùng would với chính chủ ngữ I để ước trạng thái." },
        { wrong: "I wish I can fly.", right: "I wish I could fly.", why: "can → could." },
      ],
    },
  ],
  questions: [
    { id: "b1wp1", type: "verb_form", prompt: "I don't know the answer. I wish I ___ it.", base: "know", answers: ["knew"], explanation: "Thực tế không biết → wish + quá khứ đơn: knew." },
    { id: "b1wp2", type: "verb_form", prompt: "I'm so short. I wish I ___ taller.", base: "be", answers: ["were", "was"], explanation: "to be trong câu ước → were (chuẩn), was (văn nói)." },
    { id: "b1wp3", type: "mcq", prompt: "I can't play the piano. I wish I ___ play it.", options: ["can", "could", "will", "would"], answer: 1, explanation: "can → could trong câu ước." },
    { id: "b1wp4", type: "mcq", prompt: "It's raining again! I wish it ___ raining.", options: ["stops", "will stop", "would stop", "stopped"], answer: 2, explanation: "Phàn nàn, muốn tình huống thay đổi → wish + would + V." },
    {
      id: "b1wp5", type: "error_id",
      segments: [{ text: "I " }, { text: "wish", underline: true }, { text: " I " }, { text: "have", underline: true }, { text: " a bigger " }, { text: "room", underline: true }, { text: "." }],
      answer: 3, correction: "had",
      explanation: "Ước trái thực tế hiện tại → had.",
    },
    { id: "b1wp6", type: "transform", prompt: "I don't live near the sea.", starter: "I wish", answers: ["I wish I lived near the sea."], explanation: "don't live → lived (đảo phủ định thành khẳng định, lùi thì)." },
    { id: "b1wp7", type: "transform", prompt: "My brother is always late. (phàn nàn, dùng would)", starter: "I wish my brother", answers: ["I wish my brother wouldn't be late.", "I wish my brother would not be late.", "I wish my brother wouldn't be so late.", "I wish my brother would be on time.", "I wish my brother wouldn't always be late."], explanation: "Muốn người khác thay đổi hành vi → wish + sb + would (not) + V." },
    { id: "b1wp8", type: "word_order", words: ["could", "wish", "I", "speak", "I", "French"], answers: ["I wish I could speak French"], explanation: "S + wish + S + could + V." },
    { id: "b1wp9", type: "gap_fill", prompt: "___ only I had more money! (= I wish)", answers: ["if"], hint: "___ only", explanation: "If only = I wish, nhấn mạnh hơn." },
  ],
};

export const B1_CLAUSE_TOPICS: TopicContent[] = [
  unlessInCase,
  passiveOtherTenses,
  definingRelative,
  reportedStatements,
  modalsDeductionPresent,
  wishPresent,
];
