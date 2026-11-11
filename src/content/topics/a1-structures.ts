import type { TopicContent } from "../types";

/** A1 — nhóm cấu trúc: there is/are, tần suất, đơn vs tiếp diễn, can, mệnh lệnh, giới từ, từ để hỏi. */

const thereIsAre: TopicContent = {
  slug: "there-is-are",
  intro: "Nói \"có cái gì ở đâu\": There is a bank... / There are two cats...",
  theory: [
    { type: "summary", text: "There is / There are dùng để nói CÓ (tồn tại) người/vật ở một nơi nào đó. There is + danh từ số ít hoặc không đếm được; There are + danh từ số nhiều." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "There is / There are", role: "aux" }, { t: "N", role: "subject" }, { t: "nơi chốn", role: "object" }], example: "There is a cat in the garden." },
        { label: "Phủ định (−)", parts: [{ t: "There isn't / There aren't", role: "aux" }, { t: "(any) N", role: "subject" }, { t: "nơi chốn", role: "object" }], example: "There aren't any chairs in the room." },
        { label: "Nghi vấn (?)", parts: [{ t: "Is there / Are there", role: "aux" }, { t: "(any) N", role: "subject" }, { t: "nơi chốn ?", role: "object" }], example: "Is there a bank near here?" },
      ],
      note: "Trả lời ngắn: Yes, there is. / No, there isn't. — Yes, there are. / No, there aren't.",
    },
    {
      type: "usage",
      title: "Ví dụ",
      examples: [
        { en: "There is some water in the bottle.", vi: "Có một ít nước trong chai. (không đếm được → is)" },
        { en: "There are thirty students in my class.", vi: "Lớp tôi có ba mươi học sinh." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Have a cat in the garden.", right: "There is a cat in the garden.", why: "\"Có\" (tồn tại) ở một nơi → There is/are, không dùng have." },
        { wrong: "There is two books on the desk.", right: "There are two books on the desk.", why: "two books số nhiều → There are." },
        { wrong: "There are some milk.", right: "There is some milk.", why: "milk không đếm được → There is." },
      ],
    },
  ],
  questions: [
    { id: "th1", type: "mcq", prompt: "___ a supermarket near my house.", options: ["There are", "There is", "It has", "Have"], answer: 1, explanation: "a supermarket (số ít) → There is." },
    { id: "th2", type: "mcq", prompt: "___ many students in the library.", options: ["There is", "There are", "It is", "They have"], answer: 1, explanation: "many students (số nhiều) → There are." },
    { id: "th3", type: "gap_fill", prompt: "There ___ some milk in the glass.", answers: ["is"], hint: "is / are", explanation: "milk không đếm được → is." },
    { id: "th4", type: "mcq", prompt: "___ there any chairs in the room?", options: ["Is", "Are", "Do", "Have"], answer: 1, explanation: "chairs số nhiều → Are there...?" },
    {
      id: "th5", type: "error_id",
      segments: [{ text: "Have", underline: true }, { text: " " }, { text: "a lot of", underline: true }, { text: " trees in " }, { text: "my village", underline: true }, { text: "." }],
      answer: 0, correction: "There are",
      explanation: "Nói \"có\" ở một nơi dùng There are (trees số nhiều).",
    },
    { id: "th6", type: "transform", prompt: "My school has a big library.", starter: "There", answers: ["There is a big library in my school.", "There's a big library in my school.", "There is a big library at my school."], explanation: "There is + a big library + in my school." },
    {
      id: "th7", type: "matching", prompt: "Nối câu hỏi với câu trả lời",
      left: ["Is there a bank near here?", "Are there any eggs?", "Is there any juice?"],
      right: ["No, there aren't.", "Yes, there is. It's on Le Loi Street.", "No, there isn't."],
      pairs: [1, 0, 2],
      explanation: "Câu trả lời ngắn dùng lại is/are giống câu hỏi.",
    },
    { id: "th8", type: "word_order", words: ["any", "there", "aren't", "in", "fridge", "the", "apples"], answers: ["There aren't any apples in the fridge"], explanation: "There aren't + any + N (số nhiều) + nơi chốn." },
  ],
};

const frequencyAdverbs: TopicContent = {
  slug: "frequency-adverbs",
  intro: "always, usually, often, sometimes, never — nói mức độ thường xuyên và đặt đúng vị trí.",
  theory: [
    { type: "summary", text: "Trạng từ chỉ tần suất cho biết một việc xảy ra thường xuyên đến mức nào. Hay dùng với thì hiện tại đơn." },
    {
      type: "table",
      title: "Mức độ",
      headers: ["Trạng từ", "Mức độ", "Nghĩa"],
      rows: [
        ["always", "100%", "luôn luôn"],
        ["usually", "~90%", "thường xuyên"],
        ["often", "~70%", "hay, thường"],
        ["sometimes", "~50%", "thỉnh thoảng"],
        ["rarely / seldom", "~10%", "hiếm khi"],
        ["never", "0%", "không bao giờ"],
      ],
    },
    {
      type: "formula",
      title: "Vị trí",
      rows: [
        { label: "TRƯỚC động từ thường", parts: [{ t: "S", role: "subject" }, { t: "always / usually...", role: "other" }, { t: "V", role: "verb" }], example: "I always get up early." },
        { label: "SAU to be", parts: [{ t: "S", role: "subject" }, { t: "am / is / are", role: "aux" }, { t: "always / never...", role: "other" }], example: "She is never late." },
      ],
      note: "Hỏi tần suất: How often...? → once a week, twice a month, every day (các cụm này đặt CUỐI câu).",
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I go always to school by bike.", right: "I always go to school by bike.", why: "Trạng từ tần suất đứng trước động từ thường." },
        { wrong: "She always is happy.", right: "She is always happy.", why: "Với to be, trạng từ đứng sau." },
        { wrong: "I don't never drink coffee.", right: "I never drink coffee.", why: "never đã mang nghĩa phủ định, không dùng thêm don't." },
      ],
    },
  ],
  questions: [
    { id: "fa1", type: "word_order", words: ["always", "I", "breakfast", "have"], answers: ["I always have breakfast"], explanation: "Trạng từ tần suất đứng trước động từ thường." },
    { id: "fa2", type: "word_order", words: ["late", "is", "never", "he"], answers: ["He is never late"], explanation: "Trạng từ tần suất đứng sau to be." },
    { id: "fa3", type: "mcq", prompt: "I go swimming four days a week. → I ___ go swimming.", options: ["never", "rarely", "often", "sometimes"], answer: 2, explanation: "4 ngày/tuần là khá thường xuyên → often." },
    { id: "fa4", type: "mcq", prompt: "___ do you go to the cinema? – Once a month.", options: ["How many", "How often", "How long", "When"], answer: 1, explanation: "Hỏi tần suất → How often." },
    {
      id: "fa5", type: "error_id",
      segments: [{ text: "She " }, { text: "goes usually", underline: true }, { text: " to school " }, { text: "by", underline: true }, { text: " " }, { text: "bus", underline: true }, { text: "." }],
      answer: 1, correction: "usually goes",
      explanation: "usually đứng TRƯỚC động từ thường: usually goes.",
    },
    {
      id: "fa6", type: "error_id",
      segments: [{ text: "I " }, { text: "don't never", underline: true }, { text: " " }, { text: "eat", underline: true }, { text: " " }, { text: "fast food", underline: true }, { text: "." }],
      answer: 1, correction: "never",
      explanation: "never đã mang nghĩa phủ định → bỏ don't.",
    },
    { id: "fa7", type: "transform", prompt: "Lan is late for school. (always)", starter: "Lan", answers: ["Lan is always late for school."], explanation: "always đứng sau to be: Lan is always late." },
    {
      id: "fa8", type: "matching", prompt: "Nối trạng từ với mức độ",
      left: ["always", "sometimes", "never"], right: ["0%", "100%", "50%"], pairs: [1, 2, 0],
      explanation: "always 100%, sometimes ~50%, never 0%.",
    },
  ],
};

const simpleVsContinuous: TopicContent = {
  slug: "simple-vs-continuous",
  intro: "Thói quen hay đang xảy ra? Phân biệt hiện tại đơn và hiện tại tiếp diễn.",
  theory: [
    { type: "summary", text: "Hiện tại đơn: thói quen, sự thật, việc lâu dài. Hiện tại tiếp diễn: việc đang xảy ra lúc nói hoặc tạm thời trong giai đoạn này." },
    {
      type: "compare",
      title: "So sánh",
      headers: ["Hiện tại đơn", "Hiện tại tiếp diễn"],
      rows: [
        ["S + V(s/es)", "S + am/is/are + V-ing"],
        ["Thói quen: I walk to school every day.", "Lúc nói: I'm walking to school now."],
        ["Lâu dài: She lives in Hue.", "Tạm thời: She's staying with her aunt this week."],
        ["always, usually, every day, on Mondays", "now, right now, at the moment, Look!, Listen!"],
      ],
    },
    {
      type: "table",
      title: "Động từ trạng thái — KHÔNG dùng tiếp diễn",
      headers: ["Nhóm", "Động từ"],
      rows: [
        ["Cảm xúc", "like, love, hate, want, need, prefer"],
        ["Suy nghĩ", "know, understand, believe, remember, mean"],
        ["Sở hữu", "have (= sở hữu), own, belong"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I am wanting a new phone.", right: "I want a new phone.", why: "want là động từ trạng thái → hiện tại đơn." },
        { wrong: "Look! It rains.", right: "Look! It's raining.", why: "Look! → đang xảy ra → tiếp diễn." },
        { wrong: "She is going to school every day.", right: "She goes to school every day.", why: "every day → thói quen → hiện tại đơn." },
      ],
    },
  ],
  questions: [
    { id: "sv1", type: "mcq", prompt: "Water ___ at 100 degrees Celsius.", options: ["boils", "is boiling", "boil", "are boiling"], answer: 0, explanation: "Sự thật hiển nhiên → hiện tại đơn." },
    { id: "sv2", type: "mcq", prompt: "Be quiet! The baby ___.", options: ["sleeps", "is sleeping", "sleep", "are sleeping"], answer: 1, explanation: "Be quiet! → đang xảy ra → is sleeping." },
    { id: "sv3", type: "verb_form", prompt: "My mother usually ___ dinner at 6 p.m.", base: "cook", answers: ["cooks"], explanation: "usually → thói quen → cooks." },
    { id: "sv4", type: "verb_form", prompt: "Look! The bus ___.", base: "come", answers: ["is coming"], explanation: "Look! → đang xảy ra → is coming." },
    { id: "sv5", type: "mcq", prompt: "I ___ this song. It's great!", options: ["love", "am loving", "loving", "loves"], answer: 0, explanation: "love là động từ trạng thái → hiện tại đơn." },
    { id: "sv6", type: "mcq", prompt: "She ___ in Hanoi, but this month she ___ with her aunt in Hue.", options: ["lives / stays", "is living / stays", "lives / is staying", "is living / is staying"], answer: 2, explanation: "Lâu dài → lives; tạm thời (this month) → is staying." },
    {
      id: "sv7", type: "error_id",
      segments: [{ text: "I " }, { text: "am wanting", underline: true }, { text: " " }, { text: "a new", underline: true }, { text: " " }, { text: "phone", underline: true }, { text: "." }],
      answer: 1, correction: "want",
      explanation: "want không dùng ở dạng tiếp diễn.",
    },
    { id: "sv8", type: "mcq", prompt: "What ___ you usually ___ on Sundays?", options: ["are / doing", "do / do", "does / do", "do / doing"], answer: 1, explanation: "usually → hiện tại đơn: What do you usually do...?" },
    {
      id: "sv9", type: "matching", prompt: "Nối để tạo câu đúng",
      left: ["I know", "Look! It", "They usually"], right: ["is raining.", "walk to school.", "the answer."], pairs: [2, 0, 1],
      explanation: "I know the answer (trạng thái). Look! It is raining (đang xảy ra). They usually walk to school (thói quen).",
    },
  ],
};

const canCant: TopicContent = {
  slug: "can-cant",
  intro: "can / can't — nói về khả năng, xin phép và nhờ vả.",
  theory: [
    { type: "summary", text: "can + động từ nguyên mẫu dùng để nói về KHẢ NĂNG (biết làm gì), XIN PHÉP (Can I...?) và NHỜ VẢ (Can you...?). can giống nhau ở mọi ngôi." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định (+)", parts: [{ t: "S", role: "subject" }, { t: "can", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }], example: "She can swim." },
        { label: "Phủ định (−)", parts: [{ t: "S", role: "subject" }, { t: "can't / cannot", role: "aux" }, { t: "V", role: "verb" }], example: "I can't drive." },
        { label: "Nghi vấn (?)", parts: [{ t: "Can", role: "aux" }, { t: "S", role: "subject" }, { t: "V ?", role: "verb" }], example: "Can you speak Japanese?" },
      ],
      note: "Không thêm -s (she cans ✗), không thêm to (can to swim ✗), không dùng do (Do you can ✗).",
    },
    {
      type: "usage",
      title: "Ba cách dùng",
      examples: [
        { en: "My grandmother can cook very well.", vi: "Bà tôi nấu ăn rất giỏi. (khả năng)" },
        { en: "Can I use your pen?", vi: "Tôi dùng bút của bạn được không? (xin phép)" },
        { en: "Can you help me, please?", vi: "Bạn giúp tôi được không? (nhờ vả)" },
      ],
    },
    { type: "tip", text: "Phát âm: can trong câu khẳng định đọc nhẹ /kən/, còn can't đọc mạnh /kɑːnt/. Nghe kỹ âm này để không hiểu ngược nghĩa!" },
    {
      type: "mistakes",
      items: [
        { wrong: "He cans play the piano.", right: "He can play the piano.", why: "can không thêm -s." },
        { wrong: "I can to swim.", right: "I can swim.", why: "Sau can là động từ nguyên mẫu không to." },
        { wrong: "Do you can help me?", right: "Can you help me?", why: "Câu hỏi đảo can lên đầu, không dùng do." },
      ],
    },
  ],
  questions: [
    { id: "cn1", type: "mcq", prompt: "My little sister ___ ride a bike.", options: ["can", "cans", "can to", "is can"], answer: 0, explanation: "can + V nguyên mẫu, không thêm -s." },
    { id: "cn2", type: "mcq", prompt: "___ I open the window? It's hot.", options: ["Do", "Can", "Am", "Does"], answer: 1, explanation: "Xin phép → Can I...?" },
    {
      id: "cn3", type: "error_id",
      segments: [{ text: "He " }, { text: "cans", underline: true }, { text: " " }, { text: "speak", underline: true }, { text: " three " }, { text: "languages", underline: true }, { text: "." }],
      answer: 1, correction: "can",
      explanation: "can không thêm -s ở ngôi thứ ba.",
    },
    {
      id: "cn4", type: "error_id",
      segments: [{ text: "I " }, { text: "can to", underline: true }, { text: " " }, { text: "play", underline: true }, { text: " " }, { text: "the guitar", underline: true }, { text: "." }],
      answer: 1, correction: "can",
      explanation: "Sau can không dùng to.",
    },
    { id: "cn5", type: "transform", prompt: "Nam can cook. (→ câu hỏi)", starter: "Can", answers: ["Can Nam cook?"], explanation: "Đảo can lên đầu: Can Nam cook?" },
    { id: "cn6", type: "transform", prompt: "My dad can drive a car. (→ phủ định)", starter: "My dad", answers: ["My dad can't drive a car.", "My dad cannot drive a car.", "My dad can not drive a car."], explanation: "can → can't / cannot." },
    {
      id: "cn7", type: "matching", prompt: "Nối câu hỏi với câu trả lời",
      left: ["Can you swim?", "Can I borrow your pen?", "Can you help me?"],
      right: ["Sure, here you are.", "Of course. What's the problem?", "Yes, I can."],
      pairs: [2, 0, 1],
      explanation: "Hỏi khả năng → Yes, I can. Xin mượn → Sure, here you are. Nhờ giúp → Of course...",
    },
    { id: "cn8", type: "word_order", words: ["you", "me", "can", "help", "?"], answers: ["Can you help me?"], explanation: "Can + S + V + O?" },
  ],
};

const imperatives: TopicContent = {
  slug: "imperatives",
  intro: "Open your book! Don't run! Let's go! — ra lệnh, hướng dẫn, rủ rê.",
  theory: [
    { type: "summary", text: "Câu mệnh lệnh bắt đầu bằng động từ nguyên mẫu, KHÔNG có chủ ngữ. Dùng để ra lệnh, hướng dẫn, cảnh báo hoặc đề nghị. Thêm please cho lịch sự." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định", parts: [{ t: "(Please)", role: "other" }, { t: "V (nguyên mẫu)", role: "verb" }, { t: "...", role: "object" }], example: "Please open your books." },
        { label: "Phủ định", parts: [{ t: "Don't", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }, { t: "...", role: "object" }], example: "Don't touch that!" },
        { label: "Rủ rê", parts: [{ t: "Let's", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }, { t: "...", role: "object" }], example: "Let's go to the park." },
      ],
      note: "Với tính từ, dùng Be: Be quiet! / Be careful! / Don't be late!",
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Don't to run in the corridor.", right: "Don't run in the corridor.", why: "Sau Don't là động từ nguyên mẫu không to." },
        { wrong: "Don't late for class.", right: "Don't be late for class.", why: "late là tính từ → cần be." },
        { wrong: "Let's to play football.", right: "Let's play football.", why: "Sau Let's là V nguyên mẫu." },
      ],
    },
  ],
  questions: [
    { id: "im1", type: "mcq", prompt: "___ the door, please. It's cold.", options: ["Close", "Closing", "To close", "Closes"], answer: 0, explanation: "Câu mệnh lệnh bắt đầu bằng V nguyên mẫu." },
    { id: "im2", type: "mcq", prompt: "___ talk in the library.", options: ["No", "Not", "Don't", "Doesn't"], answer: 2, explanation: "Mệnh lệnh phủ định: Don't + V." },
    { id: "im3", type: "mcq", prompt: "It's hot. ___ go swimming!", options: ["Let", "Let's", "Lets", "Let us to"], answer: 1, explanation: "Rủ rê: Let's + V." },
    {
      id: "im4", type: "error_id",
      segments: [{ text: "Please " }, { text: "don't", underline: true }, { text: " " }, { text: "late", underline: true }, { text: " for " }, { text: "class", underline: true }, { text: "." }],
      answer: 3, correction: "be late",
      explanation: "late là tính từ → Don't be late.",
    },
    { id: "im5", type: "gap_fill", prompt: "___ quiet! The baby is sleeping.", answers: ["be"], hint: "động từ", explanation: "Mệnh lệnh với tính từ: Be quiet!" },
    { id: "im6", type: "transform", prompt: "You must not smoke here. (→ câu mệnh lệnh)", starter: "Don't", answers: ["Don't smoke here.", "Do not smoke here."], explanation: "Cấm → Don't + V." },
    { id: "im7", type: "word_order", words: ["the", "turn", "please", "off", "lights"], answers: ["Please turn off the lights", "Turn off the lights please", "Please turn the lights off", "Turn the lights off please"], explanation: "Please + V + off + the lights." },
    {
      id: "im8", type: "matching", prompt: "Nối tình huống với lời khuyên",
      left: ["It's raining.", "I'm tired.", "This soup is hot."], right: ["Be careful!", "Take an umbrella.", "Let's have a rest."], pairs: [1, 2, 0],
      explanation: "Trời mưa → mang ô. Mệt → nghỉ. Súp nóng → cẩn thận.",
    },
  ],
};

const prepositions: TopicContent = {
  slug: "prepositions-time-place",
  intro: "in / on / at — giới từ chỉ thời gian và nơi chốn.",
  theory: [
    { type: "summary", text: "in, on, at dùng cho cả thời gian và nơi chốn. Mẹo: in = khoảng LỚN, on = NGÀY / BỀ MẶT, at = ĐIỂM cụ thể." },
    {
      type: "table",
      title: "Thời gian",
      headers: ["Giới từ", "Dùng với", "Ví dụ"],
      rows: [
        ["in", "tháng, năm, mùa, thế kỷ, buổi trong ngày", "in May, in 2010, in summer, in the morning"],
        ["on", "thứ, ngày, ngày tháng, ngày đặc biệt", "on Monday, on 2 September, on my birthday"],
        ["at", "giờ, thời điểm", "at 7 o'clock, at night, at noon, at the weekend"],
      ],
    },
    {
      type: "table",
      title: "Nơi chốn",
      headers: ["Giới từ", "Dùng với", "Ví dụ"],
      rows: [
        ["in", "bên trong, thành phố, quốc gia", "in the box, in the room, in Hanoi, in Vietnam"],
        ["on", "trên bề mặt, tầng, đường phố", "on the table, on the wall, on the second floor"],
        ["at", "địa điểm cụ thể", "at home, at school, at the bus stop, at work"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "in Monday", right: "on Monday", why: "Thứ trong tuần dùng on." },
        { wrong: "in night", right: "at night", why: "Thành ngữ cố định: at night (nhưng in the morning / afternoon / evening)." },
        { wrong: "in home", right: "at home", why: "Ở nhà: at home." },
      ],
    },
  ],
  questions: [
    { id: "pt1", type: "mcq", prompt: "My birthday is ___ May.", options: ["in", "on", "at", "to"], answer: 0, explanation: "Tháng → in." },
    { id: "pt2", type: "mcq", prompt: "The class starts ___ 7:30.", options: ["in", "on", "at", "by"], answer: 2, explanation: "Giờ cụ thể → at." },
    { id: "pt3", type: "mcq", prompt: "We don't go to school ___ Sunday.", options: ["in", "on", "at", "to"], answer: 1, explanation: "Thứ trong tuần → on." },
    { id: "pt4", type: "gap_fill", prompt: "There is a picture ___ the wall.", answers: ["on"], hint: "in / on / at", explanation: "Trên bề mặt (tường) → on." },
    { id: "pt5", type: "gap_fill", prompt: "I usually stay ___ home at the weekend.", answers: ["at"], hint: "in / on / at", explanation: "at home." },
    {
      id: "pt6", type: "error_id",
      segments: [{ text: "I often " }, { text: "read", underline: true }, { text: " " }, { text: "books", underline: true }, { text: " " }, { text: "in night", underline: true }, { text: "." }],
      answer: 5, correction: "at night",
      explanation: "Cụm cố định: at night.",
    },
    {
      id: "pt7", type: "matching", prompt: "Chọn giới từ đúng",
      left: ["___ the morning", "___ Monday morning", "___ midnight"], right: ["at", "in", "on"], pairs: [1, 2, 0],
      explanation: "in the morning; on Monday morning (có thứ → on); at midnight.",
    },
    { id: "pt8", type: "mcq", prompt: "My keys are ___ my bag.", options: ["in", "on", "at", "to"], answer: 0, explanation: "Bên trong túi → in." },
    { id: "pt9", type: "gap_fill", prompt: "Vietnam's National Day is ___ 2 September.", answers: ["on"], hint: "in / on / at", explanation: "Ngày tháng cụ thể → on." },
  ],
};

const questionWords: TopicContent = {
  slug: "question-words",
  intro: "What, Where, When, Who, Why, How... — đặt câu hỏi Wh- đúng cấu trúc.",
  theory: [
    { type: "summary", text: "Câu hỏi Wh- dùng để hỏi thông tin (không trả lời yes/no). Từ để hỏi đứng đầu câu, sau đó là trợ động từ / to be rồi mới đến chủ ngữ." },
    {
      type: "table",
      title: "Các từ để hỏi",
      headers: ["Từ", "Hỏi về", "Ví dụ"],
      rows: [
        ["What", "cái gì", "What is your name?"],
        ["Where", "ở đâu", "Where do you live?"],
        ["When", "khi nào", "When is your birthday?"],
        ["Who", "ai", "Who is that man?"],
        ["Why", "tại sao (trả lời: Because...)", "Why are you sad?"],
        ["How", "như thế nào", "How are you?"],
        ["How old / How many / How much", "tuổi / số lượng / giá, lượng", "How many brothers do you have?"],
        ["Which / Whose", "cái nào / của ai", "Whose bag is this?"],
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Với to be", parts: [{ t: "Wh-", role: "other" }, { t: "am / is / are", role: "aux" }, { t: "S ?", role: "subject" }], example: "Where is the station?" },
        { label: "Với động từ thường", parts: [{ t: "Wh-", role: "other" }, { t: "do / does", role: "aux" }, { t: "S", role: "subject" }, { t: "V ?", role: "verb" }], example: "What do you do at weekends?" },
      ],
      note: "Khi Who/What làm CHỦ NGỮ thì không dùng do/does: Who lives here? (không phải Who does live here?)",
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Where you live?", right: "Where do you live?", why: "Thiếu trợ động từ do." },
        { wrong: "What time it is?", right: "What time is it?", why: "Câu hỏi phải đảo is lên trước chủ ngữ." },
        { wrong: "Where does she works?", right: "Where does she work?", why: "Sau does là V nguyên mẫu." },
      ],
    },
  ],
  questions: [
    { id: "qw1", type: "mcq", prompt: "___ is your birthday? – In June.", options: ["What", "When", "Where", "Who"], answer: 1, explanation: "Trả lời thời gian → When." },
    { id: "qw2", type: "mcq", prompt: "___ do you live? – In Da Nang.", options: ["Where", "When", "What", "Why"], answer: 0, explanation: "Trả lời nơi chốn → Where." },
    { id: "qw3", type: "mcq", prompt: "___ is that man? – He's my uncle.", options: ["What", "Who", "Whose", "Which"], answer: 1, explanation: "Hỏi người → Who." },
    { id: "qw4", type: "mcq", prompt: "___ are you sad? – Because I lost my phone.", options: ["What", "How", "Why", "Where"], answer: 2, explanation: "Trả lời Because → Why." },
    { id: "qw5", type: "gap_fill", prompt: "How ___ are you? – I'm 12 years old.", answers: ["old"], hint: "hỏi tuổi", explanation: "Hỏi tuổi: How old are you?" },
    {
      id: "qw6", type: "error_id",
      segments: [{ text: "Where", underline: true }, { text: " " }, { text: "you", underline: true }, { text: " " }, { text: "live", underline: true }, { text: "?" }],
      answer: 2, correction: "do you",
      explanation: "Câu hỏi với động từ thường cần trợ động từ: Where do you live?",
    },
    { id: "qw7", type: "word_order", words: ["is", "time", "what", "it", "?"], answers: ["What time is it?"], explanation: "What time + is + it?" },
    {
      id: "qw8", type: "matching", prompt: "Nối để tạo câu hỏi đúng",
      left: ["How many", "How much", "Whose"], right: ["bag is this?", "sisters do you have?", "is this T-shirt?"], pairs: [1, 2, 0],
      explanation: "How many + N số nhiều; How much is...? (hỏi giá); Whose bag (của ai).",
    },
    { id: "qw9", type: "transform", prompt: "She works in a hospital. (đặt câu hỏi cho \"in a hospital\")", starter: "Where", answers: ["Where does she work?"], explanation: "Hỏi nơi chốn: Where + does + she + work?" },
  ],
};

export const A1_STRUCTURE_TOPICS = [thereIsAre, frequencyAdverbs, simpleVsContinuous, canCant, imperatives, prepositions, questionWords];
