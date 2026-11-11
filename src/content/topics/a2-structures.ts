import type { TopicContent } from "../types";

/** A2 — nhóm cấu trúc: so sánh, trạng từ, lượng từ, modal, to V / V-ing, liên từ, điều kiện loại 0, đại từ. */

const comparatives: TopicContent = {
  slug: "comparatives-superlatives",
  intro: "taller, more beautiful, the best — so sánh hơn và so sánh nhất.",
  theory: [
    { type: "summary", text: "So sánh hơn dùng khi so sánh HAI đối tượng (A cao hơn B). So sánh nhất dùng khi so sánh một đối tượng với cả nhóm (cao nhất lớp). Tính từ ngắn thêm -er / -est; tính từ dài dùng more / the most." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "So sánh hơn — tính từ ngắn", parts: [{ t: "A", role: "subject" }, { t: "be", role: "aux" }, { t: "adj-er", role: "verb" }, { t: "than B", role: "object" }], example: "My brother is taller than me." },
        { label: "So sánh hơn — tính từ dài", parts: [{ t: "A", role: "subject" }, { t: "be", role: "aux" }, { t: "more + adj", role: "verb" }, { t: "than B", role: "object" }], example: "This book is more interesting than that one." },
        { label: "So sánh nhất", parts: [{ t: "A", role: "subject" }, { t: "be", role: "aux" }, { t: "the adj-est / the most + adj", role: "verb" }, { t: "(in / of ...)", role: "object" }], example: "She is the youngest in my family." },
      ],
    },
    {
      type: "table",
      title: "Quy tắc biến đổi",
      headers: ["Tính từ", "So sánh hơn", "So sánh nhất"],
      rows: [
        ["tall (1 âm tiết)", "taller", "the tallest"],
        ["nice (tận cùng e)", "nicer", "the nicest"],
        ["big, hot (phụ âm-nguyên âm-phụ âm)", "bigger, hotter", "the biggest, the hottest"],
        ["happy, easy (tận cùng y)", "happier, easier", "the happiest, the easiest"],
        ["beautiful, expensive (dài)", "more beautiful", "the most beautiful"],
        ["good / bad / far", "better / worse / farther (further)", "the best / the worst / the farthest"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She is more taller than me.", right: "She is taller than me.", why: "Không dùng more cùng với đuôi -er." },
        { wrong: "This is the goodest film.", right: "This is the best film.", why: "good là bất quy tắc: good → better → best." },
        { wrong: "He is the most tallest.", right: "He is the tallest.", why: "Không dùng most cùng -est." },
      ],
    },
  ],
  questions: [
    { id: "cs1", type: "mcq", prompt: "My brother is ___ than me.", options: ["tall", "taller", "tallest", "more tall"], answer: 1, explanation: "So sánh hơn, tính từ ngắn: taller than." },
    { id: "cs2", type: "gap_fill", prompt: "This exercise is ___ than that one.", answers: ["more difficult"], hint: "difficult", explanation: "Tính từ dài: more difficult than." },
    { id: "cs3", type: "mcq", prompt: "Fansipan is the ___ mountain in Vietnam.", options: ["high", "higher", "highest", "most high"], answer: 2, explanation: "So sánh nhất: the highest." },
    { id: "cs4", type: "gap_fill", prompt: "Today is ___ than yesterday.", answers: ["hotter"], hint: "hot", explanation: "hot (phụ âm-nguyên âm-phụ âm) → gấp đôi t: hotter." },
    { id: "cs5", type: "mcq", prompt: "This is the ___ film I have ever seen.", options: ["bad", "worse", "worst", "most bad"], answer: 2, explanation: "bad → worse → the worst." },
    {
      id: "cs6", type: "error_id",
      segments: [{ text: "She is " }, { text: "more prettier", underline: true }, { text: " " }, { text: "than", underline: true }, { text: " " }, { text: "her sister", underline: true }, { text: "." }],
      answer: 1, correction: "prettier",
      explanation: "Không dùng more cùng -er: prettier.",
    },
    {
      id: "cs7", type: "matching", prompt: "Nối tính từ với dạng so sánh hơn",
      left: ["good", "bad", "far"], right: ["worse", "further", "better"], pairs: [2, 0, 1],
      explanation: "good → better, bad → worse, far → further / farther.",
    },
    { id: "cs8", type: "transform", prompt: "No one in my class is taller than Minh.", starter: "Minh is", answers: ["Minh is the tallest in my class.", "Minh is the tallest student in my class.", "Minh is the tallest person in my class."], explanation: "Không ai cao hơn Minh → Minh cao nhất: the tallest." },
    { id: "cs9", type: "gap_fill", prompt: "My new phone is ___ than my old one.", answers: ["better"], hint: "good", explanation: "good → better." },
  ],
};

const asAs: TopicContent = {
  slug: "as-as",
  intro: "as tall as, not as expensive as — so sánh bằng và không bằng.",
  theory: [
    { type: "summary", text: "as + tính từ/trạng từ (dạng nguyên) + as dùng để nói hai đối tượng BẰNG nhau. not as ... as nghĩa là KHÔNG BẰNG." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Bằng nhau", parts: [{ t: "A", role: "subject" }, { t: "be / V", role: "aux" }, { t: "as + adj/adv + as", role: "verb" }, { t: "B", role: "object" }], example: "Lan is as tall as her mother." },
        { label: "Không bằng", parts: [{ t: "A", role: "subject" }, { t: "be not / don't V", role: "aux" }, { t: "as + adj/adv + as", role: "verb" }, { t: "B", role: "object" }], example: "Hue is not as big as Hanoi." },
      ],
      note: "the same (+ N) as: My bag is the same as yours. / He is the same age as me.",
    },
    {
      type: "usage",
      title: "Viết lại câu so sánh hơn",
      examples: [
        { en: "Nam is taller than Minh. → Minh is not as tall as Nam.", vi: "Nam cao hơn Minh → Minh không cao bằng Nam." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She is as taller as me.", right: "She is as tall as me.", why: "Giữa as ... as dùng tính từ nguyên mẫu." },
        { wrong: "My bike is as fast than yours.", right: "My bike is as fast as yours.", why: "Cấu trúc là as ... as, không dùng than." },
        { wrong: "My bag is the same like yours.", right: "My bag is the same as yours.", why: "the same as, không phải the same like." },
      ],
    },
  ],
  questions: [
    { id: "aa1", type: "mcq", prompt: "Lan is as ___ as her mother.", options: ["tall", "taller", "tallest", "more tall"], answer: 0, explanation: "as + tính từ nguyên + as." },
    { id: "aa2", type: "mcq", prompt: "This book is not ___ interesting as that one.", options: ["as", "more", "than", "the"], answer: 0, explanation: "not as ... as." },
    {
      id: "aa3", type: "error_id",
      segments: [{ text: "My bike is " }, { text: "as", underline: true }, { text: " " }, { text: "fast", underline: true }, { text: " " }, { text: "than", underline: true }, { text: " yours." }],
      answer: 5, correction: "as",
      explanation: "as fast AS yours.",
    },
    { id: "aa4", type: "transform", prompt: "Nam is taller than Minh.", starter: "Minh is not", answers: ["Minh is not as tall as Nam.", "Minh is not so tall as Nam."], explanation: "taller than → not as tall as (đảo chủ ngữ)." },
    { id: "aa5", type: "gap_fill", prompt: "Your phone is the same ___ mine.", answers: ["as"], hint: "the same ...", explanation: "the same as." },
    { id: "aa6", type: "mcq", prompt: "He can run as ___ as a horse!", options: ["fast", "faster", "fastly", "fastest"], answer: 0, explanation: "fast vừa là tính từ vừa là trạng từ; dạng nguyên: as fast as." },
    { id: "aa7", type: "word_order", words: ["as", "not", "is", "hot", "Hanoi", "as", "Saigon"], answers: ["Hanoi is not as hot as Saigon", "Saigon is not as hot as Hanoi"], explanation: "A + is not as + adj + as + B." },
    { id: "aa8", type: "transform", prompt: "This bag and that bag have the same price.", starter: "This bag is as", answers: ["This bag is as expensive as that bag.", "This bag is as expensive as that one.", "This bag is as cheap as that bag.", "This bag is as cheap as that one."], explanation: "Giá bằng nhau → as expensive as / as cheap as." },
  ],
};

const adverbsManner: TopicContent = {
  slug: "adverbs-manner",
  intro: "quickly, carefully, well — trạng từ chỉ cách thức và phân biệt với tính từ.",
  theory: [
    { type: "summary", text: "Trạng từ chỉ cách thức trả lời câu hỏi \"như thế nào?\" và bổ nghĩa cho ĐỘNG TỪ. Tính từ bổ nghĩa cho DANH TỪ hoặc đứng sau to be." },
    {
      type: "table",
      title: "Cách tạo trạng từ",
      headers: ["Tính từ", "Quy tắc", "Trạng từ"],
      rows: [
        ["quick, careful", "thêm -ly", "quickly, carefully"],
        ["happy, easy", "y → ily", "happily, easily"],
        ["gentle, terrible", "le → ly", "gently, terribly"],
        ["good", "bất quy tắc", "well"],
        ["fast, hard, late, early", "giữ nguyên", "fast, hard, late, early"],
      ],
    },
    {
      type: "compare",
      title: "Tính từ vs Trạng từ",
      headers: ["Tính từ", "Trạng từ"],
      rows: [
        ["She is a careful driver.", "She drives carefully."],
        ["His English is good.", "He speaks English well."],
        ["The soup tastes good. (sau look, feel, taste, smell, sound → tính từ)", ""],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She sings beautiful.", right: "She sings beautifully.", why: "Bổ nghĩa cho động từ sings → trạng từ." },
        { wrong: "He speaks English very good.", right: "He speaks English very well.", why: "Trạng từ của good là well." },
        { wrong: "I work hardly every day.", right: "I work hard every day.", why: "hard (chăm chỉ) giữ nguyên; hardly nghĩa là \"hầu như không\"." },
      ],
    },
  ],
  questions: [
    { id: "am1", type: "mcq", prompt: "She sings very ___.", options: ["beautiful", "beautifully", "beauty", "beautifuly"], answer: 1, explanation: "Bổ nghĩa cho sings → trạng từ beautifully." },
    { id: "am2", type: "mcq", prompt: "He is a ___ driver. He drives ___.", options: ["careful / carefully", "carefully / careful", "careful / careful", "carefully / carefully"], answer: 0, explanation: "Trước danh từ → tính từ; sau động từ → trạng từ." },
    { id: "am3", type: "gap_fill", prompt: "Please speak ___. The baby is sleeping.", answers: ["quietly"], hint: "quiet", explanation: "Bổ nghĩa cho speak → quietly." },
    { id: "am4", type: "mcq", prompt: "My brother plays football very ___.", options: ["good", "well", "goodly", "best"], answer: 1, explanation: "Trạng từ của good là well." },
    {
      id: "am5", type: "error_id",
      segments: [{ text: "She " }, { text: "works", underline: true }, { text: " very " }, { text: "hardly", underline: true }, { text: " " }, { text: "every day", underline: true }, { text: "." }],
      answer: 3, correction: "hard",
      explanation: "Làm việc chăm chỉ: work hard (hardly = hầu như không).",
    },
    { id: "am6", type: "mcq", prompt: "This soup tastes ___.", options: ["good", "well", "goodly", "nicely"], answer: 0, explanation: "Sau taste (động từ chỉ cảm giác) dùng tính từ." },
    { id: "am7", type: "transform", prompt: "He is a fast runner.", starter: "He runs", answers: ["He runs fast.", "He runs very fast."], explanation: "fast giữ nguyên khi làm trạng từ." },
    {
      id: "am8", type: "matching", prompt: "Nối tính từ với trạng từ",
      left: ["happy", "good", "gentle"], right: ["gently", "happily", "well"], pairs: [1, 2, 0],
      explanation: "happy → happily, good → well, gentle → gently.",
    },
  ],
};

const quantifiers: TopicContent = {
  slug: "quantifiers",
  intro: "much, many, a lot of, a few, a little — nói về số lượng.",
  theory: [
    { type: "summary", text: "Chọn từ chỉ số lượng theo loại danh từ: many / a few đi với danh từ ĐẾM ĐƯỢC số nhiều; much / a little đi với danh từ KHÔNG ĐẾM ĐƯỢC; a lot of / lots of dùng được cho cả hai." },
    {
      type: "table",
      title: "Bảng tóm tắt",
      headers: ["Từ", "Dùng với", "Ví dụ"],
      rows: [
        ["many", "đếm được số nhiều (câu hỏi, phủ định)", "How many books? / not many friends"],
        ["much", "không đếm được (câu hỏi, phủ định)", "How much time? / not much money"],
        ["a lot of / lots of", "cả hai (thường trong câu khẳng định)", "a lot of people, a lot of water"],
        ["a few", "đếm được — một vài (đủ dùng)", "I have a few friends."],
        ["a little", "không đếm được — một chút (đủ dùng)", "a little sugar"],
        ["few / little", "rất ít, gần như không (ý tiêu cực)", "There is little time left."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I don't have much books.", right: "I don't have many books.", why: "books đếm được → many." },
        { wrong: "Can I have a few water?", right: "Can I have a little water?", why: "water không đếm được → a little." },
        { wrong: "How much students are there?", right: "How many students are there?", why: "students đếm được → How many." },
      ],
    },
  ],
  questions: [
    { id: "qu1", type: "mcq", prompt: "How ___ students are there in your class?", options: ["much", "many", "a little", "a lot"], answer: 1, explanation: "students đếm được → How many." },
    { id: "qu2", type: "mcq", prompt: "We don't have ___ time. Hurry up!", options: ["many", "much", "a few", "few"], answer: 1, explanation: "time không đếm được, câu phủ định → much." },
    { id: "qu3", type: "mcq", prompt: "I have ___ friends in Hanoi, so I'm not lonely.", options: ["a few", "a little", "much", "little"], answer: 0, explanation: "friends đếm được, ý tích cực (không cô đơn) → a few." },
    { id: "qu4", type: "mcq", prompt: "Can I have ___ sugar in my coffee?", options: ["a few", "a little", "many", "few"], answer: 1, explanation: "sugar không đếm được → a little." },
    { id: "qu5", type: "gap_fill", prompt: "There are ___ of people at the beach today.", answers: ["a lot", "lots"], hint: "rất nhiều", explanation: "a lot of / lots of + danh từ." },
    {
      id: "qu6", type: "error_id",
      segments: [{ text: "I don't have " }, { text: "much", underline: true }, { text: " " }, { text: "books", underline: true }, { text: " " }, { text: "at home", underline: true }, { text: "." }],
      answer: 1, correction: "many",
      explanation: "books đếm được → many.",
    },
    {
      id: "qu7", type: "matching", prompt: "Điền từ vào câu phù hợp",
      left: ["many", "much", "a little"], right: ["___ milk, please.", "How ___ water do you drink?", "How ___ eggs do we need?"], pairs: [2, 1, 0],
      explanation: "How many eggs (đếm được), How much water (không đếm được), A little milk.",
    },
    { id: "qu8", type: "mcq", prompt: "Hurry! There is ___ time left. (rất ít, gần như không còn)", options: ["little", "a little", "few", "a few"], answer: 0, explanation: "time không đếm được, ý tiêu cực → little." },
  ],
};

const mustHaveToShould: TopicContent = {
  slug: "must-have-to-should",
  intro: "must, have to, should — bắt buộc, không cần thiết và lời khuyên.",
  theory: [
    { type: "summary", text: "must / have to: BẮT BUỘC. mustn't: CẤM. don't have to: KHÔNG CẦN. should / shouldn't: LỜI KHUYÊN. Tất cả đều đi với động từ nguyên mẫu." },
    {
      type: "table",
      title: "Nghĩa và cách dùng",
      headers: ["Từ", "Nghĩa", "Ví dụ"],
      rows: [
        ["must", "phải (người nói thấy cần / luật lệ)", "I must study harder."],
        ["have to / has to", "phải (do quy định, hoàn cảnh bên ngoài)", "She has to wear a uniform."],
        ["mustn't", "không được phép, cấm", "You mustn't smoke here."],
        ["don't have to", "không cần, không bắt buộc", "You don't have to pay. It's free."],
        ["should / shouldn't", "nên / không nên", "You should see a doctor."],
      ],
    },
    {
      type: "compare",
      title: "mustn't ≠ don't have to",
      headers: ["mustn't (cấm)", "don't have to (không cần)"],
      rows: [["You mustn't park here. (bị cấm)", "You don't have to come early. (không bắt buộc, tùy bạn)"]],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Students must to wear uniforms.", right: "Students must wear uniforms.", why: "Sau must không có to." },
        { wrong: "She have to work on Saturdays.", right: "She has to work on Saturdays.", why: "have to chia theo chủ ngữ: she → has to." },
        { wrong: "Must you to go?", right: "Do you have to go?", why: "Câu hỏi với have to dùng Do/Does." },
      ],
    },
  ],
  questions: [
    { id: "mh1", type: "mcq", prompt: "You ___ smoke in the hospital. It's forbidden.", options: ["mustn't", "don't have to", "should", "have to"], answer: 0, explanation: "Bị cấm → mustn't." },
    { id: "mh2", type: "mcq", prompt: "Tomorrow is Sunday, so I ___ get up early.", options: ["mustn't", "don't have to", "must", "should"], answer: 1, explanation: "Không cần (vì là Chủ nhật) → don't have to." },
    { id: "mh3", type: "mcq", prompt: "You look tired. You ___ go to bed early.", options: ["should", "shouldn't", "mustn't", "don't have to"], answer: 0, explanation: "Lời khuyên → should." },
    { id: "mh4", type: "gap_fill", prompt: "My sister ___ to wear a uniform at school.", answers: ["has"], hint: "have to", explanation: "My sister (ngôi 3 số ít) → has to." },
    {
      id: "mh5", type: "error_id",
      segments: [{ text: "Students " }, { text: "must to", underline: true }, { text: " " }, { text: "wear", underline: true }, { text: " " }, { text: "uniforms", underline: true }, { text: "." }],
      answer: 1, correction: "must",
      explanation: "Sau must không có to.",
    },
    { id: "mh6", type: "transform", prompt: "It is necessary for you to finish this report today.", starter: "You", answers: ["You must finish this report today.", "You have to finish this report today."], explanation: "Cần thiết, bắt buộc → must / have to." },
    {
      id: "mh7", type: "matching", prompt: "Nối để tạo câu hợp lý",
      left: ["You mustn't", "You don't have to", "You should"], right: ["see a doctor.", "cheat in the exam.", "pay. It's free."], pairs: [1, 2, 0],
      explanation: "Cấm gian lận; không cần trả tiền vì miễn phí; nên đi khám bác sĩ.",
    },
    { id: "mh8", type: "mcq", prompt: "___ you have to work on Saturdays?", options: ["Do", "Must", "Are", "Have"], answer: 0, explanation: "Câu hỏi với have to dùng Do." },
  ],
};

const couldWouldLike: TopicContent = {
  slug: "could-would-like",
  intro: "could (khả năng quá khứ, yêu cầu lịch sự) và would like (muốn — lịch sự).",
  theory: [
    { type: "summary", text: "could là quá khứ của can (đã có thể), đồng thời dùng để yêu cầu/xin phép LỊCH SỰ hơn can. would like = want nhưng lịch sự hơn, hay dùng khi gọi món, mời mọc." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "could", parts: [{ t: "S", role: "subject" }, { t: "could / couldn't", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }], example: "When I was five, I could swim." },
        { label: "Yêu cầu lịch sự", parts: [{ t: "Could", role: "aux" }, { t: "you / I", role: "subject" }, { t: "V ...?", role: "verb" }], example: "Could you open the window, please?" },
        { label: "would like", parts: [{ t: "S", role: "subject" }, { t: "would like ('d like)", role: "aux" }, { t: "N / to V", role: "verb" }], example: "I'd like a cup of tea. / I'd like to go home." },
        { label: "Lời mời", parts: [{ t: "Would you like", role: "aux" }, { t: "N / to V ?", role: "verb" }], example: "Would you like to come to my party?" },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I would like go to the cinema.", right: "I would like to go to the cinema.", why: "would like + to V." },
        { wrong: "Would you like drink something?", right: "Would you like to drink something?", why: "would like + to V hoặc + danh từ." },
        { wrong: "I could to swim when I was six.", right: "I could swim when I was six.", why: "Sau could là V nguyên mẫu không to." },
      ],
    },
    { type: "tip", text: "Trả lời lời mời: Yes, please. / No, thank you. — Trả lời yêu cầu: Of course. / Sure. / Sorry, I can't." },
  ],
  questions: [
    { id: "cw1", type: "mcq", prompt: "When I was five, I ___ swim.", options: ["can", "could", "would", "will"], answer: 1, explanation: "Khả năng trong quá khứ → could." },
    { id: "cw2", type: "mcq", prompt: "___ you open the window, please?", options: ["Could", "Would like", "Must", "Should"], answer: 0, explanation: "Yêu cầu lịch sự → Could you...?" },
    { id: "cw3", type: "mcq", prompt: "Would you like ___ some tea?", options: ["drink", "to drink", "drinking", "drinks"], answer: 1, explanation: "would like + to V." },
    { id: "cw4", type: "gap_fill", prompt: "I'd ___ a cup of coffee, please.", answers: ["like"], hint: "would ...", explanation: "I'd like = I would like." },
    {
      id: "cw5", type: "error_id",
      segments: [{ text: "I " }, { text: "would like go", underline: true }, { text: " to " }, { text: "the cinema", underline: true }, { text: " " }, { text: "tonight", underline: true }, { text: "." }],
      answer: 1, correction: "would like to go",
      explanation: "would like + to V.",
    },
    { id: "cw6", type: "transform", prompt: "I want a glass of water. (nói lịch sự hơn)", starter: "I would", answers: ["I would like a glass of water.", "I'd like a glass of water."], explanation: "want → would like." },
    {
      id: "cw7", type: "matching", prompt: "Nối câu hỏi với câu trả lời",
      left: ["Would you like some cake?", "Could you help me?", "Could you swim at six?"], right: ["No, I couldn't.", "Yes, please. It looks delicious.", "Of course. What can I do?"], pairs: [1, 2, 0],
      explanation: "Lời mời → Yes, please. Nhờ giúp → Of course. Hỏi khả năng quá khứ → No, I couldn't.",
    },
    { id: "cw8", type: "transform", prompt: "My grandfather was able to speak French when he was young.", starter: "My grandfather could", answers: ["My grandfather could speak French when he was young."], explanation: "was able to = could." },
  ],
};

const verbToIng: TopicContent = {
  slug: "verb-to-ing-basic",
  intro: "want TO GO hay enjoy GOING? Động từ theo sau bởi to V hoặc V-ing.",
  theory: [
    { type: "summary", text: "Khi hai động từ đi liền nhau, động từ thứ hai có dạng to V hoặc V-ing tùy theo động từ thứ nhất. Cần học thuộc theo nhóm." },
    {
      type: "table",
      title: "Các nhóm thường gặp",
      headers: ["Theo sau bởi", "Động từ", "Ví dụ"],
      rows: [
        ["to V", "want, would like, need, hope, decide, plan, learn, agree, promise", "She wants to become a doctor."],
        ["V-ing", "enjoy, finish, mind, practise, avoid, keep, go (go shopping)", "I enjoy listening to music."],
        ["cả hai (nghĩa gần giống)", "like, love, hate, start, begin", "I like reading / to read."],
        ["V-ing sau giới từ", "good at, interested in, afraid of, thank you for...", "He is good at playing chess."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I enjoy to swim.", right: "I enjoy swimming.", why: "enjoy + V-ing." },
        { wrong: "She wants going home.", right: "She wants to go home.", why: "want + to V." },
        { wrong: "I'm good at swim.", right: "I'm good at swimming.", why: "Sau giới từ (at) dùng V-ing." },
      ],
    },
  ],
  questions: [
    { id: "vt1", type: "mcq", prompt: "I enjoy ___ to music.", options: ["listen", "to listen", "listening", "listened"], answer: 2, explanation: "enjoy + V-ing." },
    { id: "vt2", type: "mcq", prompt: "She wants ___ a doctor.", options: ["become", "to become", "becoming", "became"], answer: 1, explanation: "want + to V." },
    { id: "vt3", type: "verb_form", prompt: "Have you finished ___ your homework?", base: "do", answers: ["doing"], explanation: "finish + V-ing." },
    { id: "vt4", type: "verb_form", prompt: "We decided ___ by train.", base: "travel", answers: ["to travel"], explanation: "decide + to V." },
    { id: "vt5", type: "mcq", prompt: "My brother is good at ___ the guitar.", options: ["play", "to play", "playing", "plays"], answer: 2, explanation: "Sau giới từ at → V-ing." },
    {
      id: "vt6", type: "error_id",
      segments: [{ text: "Would you " }, { text: "mind", underline: true }, { text: " " }, { text: "to close", underline: true }, { text: " " }, { text: "the door", underline: true }, { text: "?" }],
      answer: 3, correction: "closing",
      explanation: "mind + V-ing: Would you mind closing...?",
    },
    {
      id: "vt7", type: "matching", prompt: "Nối để tạo câu đúng",
      left: ["I hope", "I don't mind", "Let's go"], right: ["waiting.", "swimming.", "to see you soon."], pairs: [2, 0, 1],
      explanation: "hope + to V; mind + V-ing; go + V-ing (hoạt động: go swimming).",
    },
    { id: "vt8", type: "verb_form", prompt: "I need ___ some bread.", base: "buy", answers: ["to buy"], explanation: "need + to V." },
  ],
};

const conjunctions: TopicContent = {
  slug: "conjunctions-basic",
  intro: "and, but, or, because, so — nối hai ý thành một câu.",
  theory: [
    { type: "summary", text: "Liên từ nối các từ hoặc các mệnh đề. Mỗi liên từ thể hiện một quan hệ: thêm ý (and), đối lập (but), lựa chọn (or), nguyên nhân (because), kết quả (so)." },
    {
      type: "table",
      title: "Năm liên từ cơ bản",
      headers: ["Liên từ", "Quan hệ", "Ví dụ"],
      rows: [
        ["and", "thêm ý (và)", "She is smart and kind."],
        ["but", "đối lập (nhưng)", "I like tea, but my sister likes coffee."],
        ["or", "lựa chọn (hoặc)", "Would you like tea or coffee?"],
        ["because", "nguyên nhân (vì)", "We stayed at home because it was raining."],
        ["so", "kết quả (nên)", "It was raining, so we stayed at home."],
      ],
    },
    { type: "tip", text: "because đứng trước NGUYÊN NHÂN, so đứng trước KẾT QUẢ. Thường có dấu phẩy trước but và so." },
    {
      type: "mistakes",
      items: [
        { wrong: "Because I was tired, so I went to bed.", right: "Because I was tired, I went to bed. / I was tired, so I went to bed.", why: "Không dùng cả because và so trong cùng một câu (khác tiếng Việt \"vì... nên...\")." },
        { wrong: "He was tired but he went to bed early.", right: "He was tired, so he went to bed early.", why: "Đi ngủ sớm là KẾT QUẢ của mệt → so." },
      ],
    },
  ],
  questions: [
    { id: "cj1", type: "mcq", prompt: "I like tea, ___ my sister likes coffee.", options: ["and", "but", "so", "because"], answer: 1, explanation: "Hai ý đối lập → but." },
    { id: "cj2", type: "mcq", prompt: "It was raining, ___ we stayed at home.", options: ["because", "but", "so", "or"], answer: 2, explanation: "Ở nhà là kết quả → so." },
    { id: "cj3", type: "mcq", prompt: "We stayed at home ___ it was raining.", options: ["because", "so", "but", "and"], answer: 0, explanation: "Trời mưa là nguyên nhân → because." },
    { id: "cj4", type: "mcq", prompt: "Would you like tea ___ coffee?", options: ["and", "but", "or", "so"], answer: 2, explanation: "Lựa chọn → or." },
    { id: "cj5", type: "gap_fill", prompt: "She is beautiful ___ kind.", answers: ["and"], hint: "liên từ", explanation: "Thêm ý → and." },
    {
      id: "cj6", type: "error_id",
      segments: [{ text: "He was " }, { text: "tired", underline: true }, { text: " " }, { text: "but", underline: true }, { text: " he went to bed " }, { text: "early", underline: true }, { text: "." }],
      answer: 3, correction: "so",
      explanation: "Đi ngủ sớm là kết quả của mệt → so.",
    },
    { id: "cj7", type: "transform", prompt: "I didn't go to school. I was sick. (because)", starter: "I didn't go to school", answers: ["I didn't go to school because I was sick."], explanation: "because + nguyên nhân." },
    {
      id: "cj8", type: "matching", prompt: "Nối để tạo câu hợp lý",
      left: ["I was hungry,", "I studied hard,", "Do you want to walk"], right: ["or take a taxi?", "so I made a sandwich.", "but I failed the test."], pairs: [1, 2, 0],
      explanation: "Đói nên làm bánh mì; học chăm nhưng vẫn trượt; đi bộ hay đi taxi.",
    },
  ],
};

const conditionalType0: TopicContent = {
  slug: "conditional-type-0",
  intro: "If you heat ice, it melts — câu điều kiện cho sự thật luôn đúng.",
  theory: [
    { type: "summary", text: "Câu điều kiện loại 0 diễn tả sự thật hiển nhiên, quy luật tự nhiên hoặc thói quen: hễ điều kiện xảy ra thì kết quả LUÔN xảy ra. Cả hai vế đều dùng hiện tại đơn; if có thể thay bằng when." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        {
          label: "Mệnh đề If + mệnh đề chính",
          parts: [{ t: "If / When", role: "other" }, { t: "S", role: "subject" }, { t: "V (hiện tại đơn)", role: "verb" }, { t: ",", role: "other" }, { t: "S", role: "subject" }, { t: "V (hiện tại đơn)", role: "verb" }],
          example: "If you heat water to 100 degrees, it boils.",
        },
      ],
    },
    {
      type: "usage",
      title: "Ví dụ",
      examples: [
        { en: "If you mix red and white, you get pink.", vi: "Nếu trộn đỏ với trắng, bạn được màu hồng." },
        { en: "When I drink coffee at night, I can't sleep.", vi: "Hễ uống cà phê buổi tối là tôi không ngủ được. (thói quen)" },
      ],
    },
    {
      type: "compare",
      title: "Loại 0 vs Loại 1",
      headers: ["Loại 0 — luôn đúng", "Loại 1 — tình huống cụ thể"],
      rows: [["If it rains, the ground gets wet.", "If it rains tomorrow, we will stay at home."]],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "If you will mix blue and yellow, you get green.", right: "If you mix blue and yellow, you get green.", why: "Không dùng will trong mệnh đề if." },
        { wrong: "If people doesn't eat, they get hungry.", right: "If people don't eat, they get hungry.", why: "people là số nhiều → don't." },
      ],
    },
  ],
  questions: [
    { id: "c0a", type: "verb_form", prompt: "If you heat water to 100 degrees, it ___.", base: "boil", answers: ["boils"], explanation: "Sự thật hiển nhiên → hiện tại đơn: boils." },
    { id: "c0b", type: "mcq", prompt: "If people ___ eat, they get hungry.", options: ["don't", "won't", "didn't", "doesn't"], answer: 0, explanation: "Loại 0, people số nhiều → don't." },
    { id: "c0c", type: "mcq", prompt: "Plants die if they ___ get water.", options: ["don't", "doesn't", "won't", "didn't"], answer: 0, explanation: "they → don't (hiện tại đơn)." },
    { id: "c0d", type: "mcq", prompt: "If I drink coffee at night, I ___ sleep.", options: ["can't", "couldn't", "won't can", "not can"], answer: 0, explanation: "Thói quen ở hiện tại → can't." },
    {
      id: "c0e", type: "error_id",
      segments: [{ text: "If you " }, { text: "will mix", underline: true }, { text: " red and white, you " }, { text: "get", underline: true }, { text: " " }, { text: "pink", underline: true }, { text: "." }],
      answer: 1, correction: "mix",
      explanation: "Mệnh đề if dùng hiện tại đơn, không dùng will.",
    },
    { id: "c0f", type: "transform", prompt: "Ice melts when you heat it.", starter: "If you", answers: ["If you heat ice, it melts."], explanation: "If + hiện tại đơn, hiện tại đơn." },
    {
      id: "c0g", type: "matching", prompt: "Nối điều kiện với kết quả",
      left: ["If you mix blue and yellow,", "If it rains,", "If you don't sleep,"], right: ["you feel tired.", "you get green.", "the ground gets wet."], pairs: [1, 2, 0],
      explanation: "Xanh dương + vàng = xanh lá; mưa → đất ướt; không ngủ → mệt.",
    },
    { id: "c0h", type: "word_order", words: ["if", "floats", "you", "oil", "put", "in", "water", "it"], answers: ["If you put oil in water it floats"], explanation: "If + S + V, S + V." },
  ],
};

const possessiveReflexive: TopicContent = {
  slug: "possessive-reflexive",
  intro: "mine, yours... và myself, yourself... — đại từ sở hữu và đại từ phản thân.",
  theory: [
    { type: "summary", text: "Đại từ sở hữu (mine, yours...) thay cho \"tính từ sở hữu + danh từ\" để khỏi lặp lại. Đại từ phản thân (myself...) dùng khi chủ ngữ và tân ngữ là CÙNG một người, hoặc để nhấn mạnh tự mình làm." },
    {
      type: "table",
      title: "Bảng đại từ",
      headers: ["Chủ ngữ", "Tính từ sở hữu", "Đại từ sở hữu", "Phản thân"],
      rows: [
        ["I", "my", "mine", "myself"],
        ["you", "your", "yours", "yourself / yourselves"],
        ["he", "his", "his", "himself"],
        ["she", "her", "hers", "herself"],
        ["it", "its", "—", "itself"],
        ["we", "our", "ours", "ourselves"],
        ["they", "their", "theirs", "themselves"],
      ],
    },
    {
      type: "usage",
      title: "Cách dùng",
      examples: [
        { en: "This book is mine, not yours.", vi: "Quyển sách này là của tôi, không phải của bạn." },
        { en: "Be careful! Don't cut yourself.", vi: "Cẩn thận! Đừng tự cắt vào tay." },
        { en: "She made the cake herself.", vi: "Cô ấy tự làm cái bánh. (nhấn mạnh)" },
        { en: "He lives by himself.", vi: "Anh ấy sống một mình." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "This is mine book.", right: "This is my book. / This book is mine.", why: "Trước danh từ dùng tính từ sở hữu (my); mine đứng một mình." },
        { wrong: "He did it hisself.", right: "He did it himself.", why: "Phản thân của he là himself." },
        { wrong: "They enjoyed theirselves.", right: "They enjoyed themselves.", why: "Phản thân của they là themselves." },
      ],
    },
  ],
  questions: [
    { id: "rf1", type: "mcq", prompt: "This pen isn't mine. It's ___.", options: ["her", "hers", "she", "herself"], answer: 1, explanation: "Đứng một mình (không có danh từ sau) → đại từ sở hữu hers." },
    { id: "rf2", type: "mcq", prompt: "Be careful! Don't cut ___.", options: ["you", "your", "yourself", "yours"], answer: 2, explanation: "Chủ ngữ (you) và tân ngữ cùng một người → yourself." },
    { id: "rf3", type: "gap_fill", prompt: "That house is ___. We bought it last year.", answers: ["ours"], hint: "của chúng tôi", explanation: "we → ours." },
    {
      id: "rf4", type: "error_id",
      segments: [{ text: "He " }, { text: "made", underline: true }, { text: " " }, { text: "this cake", underline: true }, { text: " " }, { text: "hisself", underline: true }, { text: "." }],
      answer: 5, correction: "himself",
      explanation: "Phản thân của he là himself.",
    },
    { id: "rf5", type: "mcq", prompt: "They enjoyed ___ at the party.", options: ["them", "their", "themselves", "theirs"], answer: 2, explanation: "enjoy oneself = vui vẻ; they → themselves." },
    { id: "rf6", type: "transform", prompt: "This is my book.", starter: "This book is", answers: ["This book is mine."], explanation: "my book → mine." },
    {
      id: "rf7", type: "matching", prompt: "Nối chủ ngữ với đại từ phản thân",
      left: ["I", "she", "we"], right: ["ourselves", "myself", "herself"], pairs: [1, 2, 0],
      explanation: "I → myself, she → herself, we → ourselves.",
    },
    { id: "rf8", type: "mcq", prompt: "My sister lives by ___ in a small flat.", options: ["her", "hers", "herself", "she"], answer: 2, explanation: "by herself = một mình." },
  ],
};

export const A2_STRUCTURE_TOPICS = [
  comparatives,
  asAs,
  adverbsManner,
  quantifiers,
  mustHaveToShould,
  couldWouldLike,
  verbToIng,
  conjunctions,
  conditionalType0,
  possessiveReflexive,
];
