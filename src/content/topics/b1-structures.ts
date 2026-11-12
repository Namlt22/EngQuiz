import type { TopicContent } from "../types";

/** B1 — nhóm cấu trúc: gerund/infinitive, too/enough, so/such, câu hỏi đuôi, câu hỏi gián tiếp, phrasal verbs. */

const gerundInfinitive: TopicContent = {
  slug: "gerund-infinitive",
  intro: "enjoy doing · decide to do · stop doing vs stop to do — động từ nào theo sau bởi V-ing, động từ nào bởi to V.",
  theory: [
    { type: "summary", text: "Một số động từ chỉ đi với V-ing, một số chỉ đi với to V, và một số đi được với cả hai nhưng NGHĨA KHÁC NHAU. Sau giới từ luôn dùng V-ing." },
    {
      type: "table",
      title: "Nhóm động từ",
      headers: ["+ V-ing", "+ to V", "+ cả hai (nghĩa gần như không đổi)"],
      rows: [
        ["enjoy, finish, mind, avoid, suggest, keep, practise, miss, can't stand, give up", "want, decide, hope, plan, agree, refuse, promise, learn, manage, afford, offer", "like, love, hate, prefer, start, begin, continue"],
      ],
    },
    {
      type: "compare",
      title: "Động từ đổi nghĩa",
      headers: ["Động từ", "+ V-ing", "+ to V"],
      rows: [
        ["stop", "ngừng hẳn việc đó: I stopped smoking.", "dừng lại để làm việc khác: I stopped to smoke."],
        ["remember", "nhớ ĐÃ làm: I remember locking the door.", "nhớ PHẢI làm: Remember to lock the door."],
        ["forget", "quên đã làm: I'll never forget meeting him.", "quên phải làm: I forgot to call her."],
        ["try", "thử làm xem sao: Try restarting the computer.", "cố gắng làm: I tried to open the window, but it was stuck."],
        ["regret", "hối tiếc đã làm: I regret saying that.", "lấy làm tiếc phải báo: We regret to inform you..."],
      ],
    },
    {
      type: "usage",
      title: "V-ing làm chủ ngữ và sau giới từ",
      examples: [
        { en: "Swimming is good for your health.", vi: "Bơi lội tốt cho sức khỏe." },
        { en: "She is interested in learning Korean.", vi: "Cô ấy thích học tiếng Hàn." },
        { en: "Thank you for helping me.", vi: "Cảm ơn bạn đã giúp tôi." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I enjoy to listen to music.", right: "I enjoy listening to music.", why: "enjoy + V-ing." },
        { wrong: "She decided going home.", right: "She decided to go home.", why: "decide + to V." },
        { wrong: "I'm looking forward to meet you.", right: "I'm looking forward to meeting you.", why: "to ở đây là giới từ → V-ing." },
      ],
    },
  ],
  questions: [
    { id: "b1gi1", type: "verb_form", prompt: "I really enjoy ___ to music in the evening.", base: "listen", answers: ["listening"], explanation: "enjoy + V-ing." },
    { id: "b1gi2", type: "verb_form", prompt: "We have decided ___ a new car.", base: "buy", answers: ["to buy"], explanation: "decide + to V." },
    { id: "b1gi3", type: "mcq", prompt: "Would you mind ___ the window?", options: ["to open", "opening", "open", "opened"], answer: 1, explanation: "mind + V-ing." },
    { id: "b1gi4", type: "mcq", prompt: "Please remember ___ the lights before you leave.", options: ["turning off", "to turn off", "turn off", "turned off"], answer: 1, explanation: "Nhớ PHẢI làm (chưa làm) → remember + to V." },
    { id: "b1gi5", type: "mcq", prompt: "He stopped ___ a coffee on his way to work.", options: ["having", "to have", "have", "had"], answer: 1, explanation: "Dừng lại ĐỂ uống cà phê → stop + to V." },
    {
      id: "b1gi6", type: "error_id",
      segments: [{ text: "I'm " }, { text: "looking forward", underline: true }, { text: " to " }, { text: "see", underline: true }, { text: " you " }, { text: "again", underline: true }, { text: "." }],
      answer: 3, correction: "seeing",
      explanation: "look forward to + V-ing (to là giới từ).",
    },
    { id: "b1gi7", type: "gap_fill", prompt: "She is good at ___ (draw) pictures.", answers: ["drawing"], hint: "sau giới từ", explanation: "Sau giới từ at → V-ing." },
    { id: "b1gi8", type: "transform", prompt: "It is good for your health to swim. (bắt đầu bằng V-ing)", starter: "Swimming", answers: ["Swimming is good for your health."], explanation: "V-ing có thể làm chủ ngữ." },
    {
      id: "b1gi9", type: "matching", prompt: "Nối câu với nghĩa",
      left: ["I stopped smoking.", "I stopped to smoke.", "I remember meeting her."],
      right: ["Tôi dừng lại để hút thuốc.", "Tôi nhớ là đã gặp cô ấy.", "Tôi đã bỏ thuốc lá."],
      pairs: [2, 0, 1],
      explanation: "stop V-ing = bỏ hẳn; stop to V = dừng lại để làm; remember V-ing = nhớ đã làm.",
    },
    { id: "b1gi10", type: "word_order", words: ["to", "agreed", "he", "help", "us"], answers: ["He agreed to help us"], explanation: "agree + to V." },
  ],
};

const tooEnough: TopicContent = {
  slug: "too-enough",
  intro: "too hot to drink · not old enough to drive — quá ... để làm gì / đủ ... để làm gì.",
  theory: [
    { type: "summary", text: "too (quá) mang nghĩa tiêu cực: vượt quá mức nên KHÔNG làm được. enough (đủ) cho biết mức độ đã đủ / chưa đủ để làm gì." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "too", parts: [{ t: "too", role: "aux" }, { t: "adj / adv", role: "verb" }, { t: "(for sb)", role: "object" }, { t: "to V", role: "other" }], example: "The tea is too hot (for me) to drink." },
        { label: "enough + tính từ", parts: [{ t: "adj / adv", role: "verb" }, { t: "enough", role: "aux" }, { t: "(for sb)", role: "object" }, { t: "to V", role: "other" }], example: "She is old enough to drive." },
        { label: "enough + danh từ", parts: [{ t: "enough", role: "aux" }, { t: "N", role: "object" }, { t: "to V", role: "other" }], example: "We don't have enough money to buy it." },
      ],
      note: "enough đứng SAU tính từ/trạng từ nhưng TRƯỚC danh từ.",
    },
    {
      type: "compare",
      title: "too vs very",
      headers: ["very (rất — chỉ mức độ)", "too (quá — nên không làm được)"],
      rows: [["The bag is very heavy, but I can carry it.", "The bag is too heavy. I can't carry it."]],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "He isn't enough old to vote.", right: "He isn't old enough to vote.", why: "enough đứng sau tính từ." },
        { wrong: "The coffee is too hot to drink it.", right: "The coffee is too hot to drink.", why: "Chủ ngữ đã là the coffee → không thêm it sau to V." },
        { wrong: "This city is too beautiful.", right: "This city is very beautiful.", why: "too mang nghĩa tiêu cực; khen thì dùng very / really." },
      ],
    },
    { type: "tip", text: "Biến đổi câu: so + adj + that ... can't ↔ too + adj + to V ↔ not + adj trái nghĩa + enough + to V. Ví dụ: He is too young to drive = He isn't old enough to drive." },
  ],
  questions: [
    { id: "b1te1", type: "mcq", prompt: "This box is ___ heavy for me to lift.", options: ["enough", "too", "very", "so"], answer: 1, explanation: "Nặng quá nên không nhấc được → too + adj + for sb + to V." },
    { id: "b1te2", type: "mcq", prompt: "He isn't ___ to reach the top shelf.", options: ["tall enough", "enough tall", "too tall", "tall too"], answer: 0, explanation: "enough đứng sau tính từ: tall enough." },
    { id: "b1te3", type: "mcq", prompt: "We don't have ___ to finish the project today.", options: ["time enough", "enough time", "too time", "too much"], answer: 1, explanation: "enough đứng trước danh từ: enough time." },
    {
      id: "b1te4", type: "error_id",
      segments: [{ text: "The soup is " }, { text: "too hot", underline: true }, { text: " " }, { text: "to eat", underline: true }, { text: " " }, { text: "it", underline: true }, { text: "." }],
      answer: 5, correction: "(bỏ it)",
      explanation: "Chủ ngữ the soup chính là đối tượng của eat → không thêm it.",
    },
    { id: "b1te5", type: "transform", prompt: "The boy is too young to watch this film. (dùng enough)", starter: "The boy isn't", answers: ["The boy isn't old enough to watch this film.", "The boy is not old enough to watch this film."], explanation: "too young = not old enough." },
    { id: "b1te6", type: "transform", prompt: "The water is so cold that we can't swim in it. (dùng too)", starter: "The water is", answers: ["The water is too cold for us to swim in.", "The water is too cold to swim in.", "The water is too cold for us to swim."], explanation: "so ... that ... can't → too + adj + (for us) + to V; bỏ it ở cuối." },
    { id: "b1te7", type: "gap_fill", prompt: "Is your coffee sweet ___? – Yes, it's fine.", answers: ["enough"], hint: "đủ", explanation: "adj + enough." },
    { id: "b1te8", type: "word_order", words: ["enough", "she", "to", "is", "old", "drive"], answers: ["She is old enough to drive"], explanation: "S + be + adj + enough + to V." },
    {
      id: "b1te9", type: "matching", prompt: "Nối nửa đầu với nửa sau",
      left: ["It's too dark", "He's strong enough", "I haven't got enough money"],
      right: ["to carry the sofa.", "to buy a new phone.", "to read without a lamp."],
      pairs: [2, 0, 1],
      explanation: "too dark → không đọc được; strong enough → mang được ghế; not enough money → không mua được.",
    },
  ],
};

const soSuch: TopicContent = {
  slug: "so-such",
  intro: "so + tính từ · such + (a/an) + tính từ + danh từ ... that — quá ... đến nỗi mà.",
  theory: [
    { type: "summary", text: "so ... that và such ... that diễn tả kết quả: một điều gì đó ở mức độ cao đến mức dẫn đến một kết quả. Khác biệt nằm ở từ loại theo sau: so đi với tính từ/trạng từ, such đi với cụm danh từ." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "so", parts: [{ t: "S + V", role: "subject" }, { t: "so", role: "aux" }, { t: "adj / adv", role: "verb" }, { t: "that + S + V", role: "other" }], example: "The film was so boring that I fell asleep." },
        { label: "such", parts: [{ t: "S + V", role: "subject" }, { t: "such", role: "aux" }, { t: "(a/an) + adj + N", role: "object" }, { t: "that + S + V", role: "other" }], example: "It was such a boring film that I fell asleep." },
        { label: "so + lượng", parts: [{ t: "so", role: "aux" }, { t: "many / much / few / little + N", role: "object" }, { t: "that ...", role: "other" }], example: "There were so many people that we couldn't move." },
      ],
      note: "Danh từ số nhiều / không đếm được dùng such không có a/an: such nice people, such bad weather.",
    },
    {
      type: "usage",
      title: "Dùng trong câu cảm thán (không có that)",
      examples: [
        { en: "She's so kind!", vi: "Cô ấy thật tốt bụng!" },
        { en: "It's such a beautiful day!", vi: "Hôm nay thật là một ngày đẹp trời!" },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "It was so a nice day.", right: "It was such a nice day. / The day was so nice.", why: "Có danh từ (a nice day) → dùng such." },
        { wrong: "They are such kind that everyone loves them.", right: "They are so kind that everyone loves them.", why: "Chỉ có tính từ → dùng so." },
        { wrong: "It was such an awful weather.", right: "It was such awful weather.", why: "weather không đếm được → không có a/an." },
      ],
    },
  ],
  questions: [
    { id: "b1ss1", type: "mcq", prompt: "The test was ___ difficult that nobody passed.", options: ["such", "so", "too", "such a"], answer: 1, explanation: "Theo sau là tính từ (difficult) → so." },
    { id: "b1ss2", type: "mcq", prompt: "It was ___ interesting book that I read it twice.", options: ["so", "such", "such an", "so an"], answer: 2, explanation: "Cụm danh từ đếm được số ít bắt đầu bằng nguyên âm → such an." },
    { id: "b1ss3", type: "mcq", prompt: "There were ___ many people that we couldn't find a seat.", options: ["so", "such", "such a", "too"], answer: 0, explanation: "many / much / few / little → dùng so." },
    { id: "b1ss4", type: "gap_fill", prompt: "We had ___ terrible weather that we stayed inside all week.", answers: ["such"], hint: "so / such", explanation: "weather (không đếm được) là danh từ → such, không có a." },
    {
      id: "b1ss5", type: "error_id",
      segments: [{ text: "She " }, { text: "is", underline: true }, { text: " " }, { text: "so a good singer", underline: true }, { text: " that everyone " }, { text: "loves", underline: true }, { text: " her." }],
      answer: 3, correction: "such a good singer",
      explanation: "Có danh từ singer → such a good singer.",
    },
    { id: "b1ss6", type: "transform", prompt: "The room was so small that we couldn't put a bed in it.", starter: "It was such", answers: ["It was such a small room that we couldn't put a bed in it.", "It was such a small room that we could not put a bed in it."], explanation: "so + adj → such + a + adj + N." },
    { id: "b1ss7", type: "transform", prompt: "He is such a fast runner that nobody can catch him.", starter: "He runs so", answers: ["He runs so fast that nobody can catch him.", "He runs so fast that no one can catch him."], explanation: "such a fast runner → runs so fast (trạng từ)." },
    { id: "b1ss8", type: "word_order", words: ["such", "it", "a", "was", "day", "lovely"], answers: ["It was such a lovely day"], explanation: "such + a + adj + N." },
    {
      id: "b1ss9", type: "matching", prompt: "Điền so hay such?",
      left: ["___ hot", "___ hot weather", "___ much noise"],
      right: ["such", "so", "so (với much)"],
      pairs: [1, 0, 2],
      explanation: "Tính từ → so; cụm danh từ → such; much/many → so.",
    },
  ],
};

const questionTags: TopicContent = {
  slug: "question-tags",
  intro: "You're a student, aren't you? — câu hỏi đuôi để xác nhận thông tin.",
  theory: [
    { type: "summary", text: "Câu hỏi đuôi là phần câu hỏi ngắn ở cuối câu, dùng để xác nhận điều mình nghĩ là đúng hoặc tìm sự đồng tình. Quy tắc: câu chính khẳng định → đuôi phủ định, và ngược lại." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Khẳng định → đuôi phủ định", parts: [{ t: "S + V (+)", role: "subject" }, { t: ",", role: "other" }, { t: "trợ động từ + n't", role: "aux" }, { t: "+ đại từ ?", role: "subject" }], example: "She likes coffee, doesn't she?" },
        { label: "Phủ định → đuôi khẳng định", parts: [{ t: "S + V (−)", role: "subject" }, { t: ",", role: "other" }, { t: "trợ động từ", role: "aux" }, { t: "+ đại từ ?", role: "subject" }], example: "They aren't here, are they?" },
      ],
      note: "Đuôi dùng lại trợ động từ của câu chính (be, have, will, can...). Nếu câu chính không có trợ động từ → dùng do / does / did.",
    },
    {
      type: "table",
      title: "Trường hợp đặc biệt",
      headers: ["Câu chính", "Đuôi", "Ví dụ"],
      rows: [
        ["I am ...", "aren't I?", "I'm late, aren't I?"],
        ["Let's ...", "shall we?", "Let's go, shall we?"],
        ["Mệnh lệnh", "will you? / can you?", "Close the door, will you?"],
        ["never, hardly, nobody, nothing (nghĩa phủ định)", "đuôi khẳng định", "He never comes on time, does he?"],
        ["Everyone / Somebody / Nobody", "they", "Everyone is here, aren't they?"],
        ["This / That / Nothing", "it", "That's your car, isn't it?"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She works here, isn't she?", right: "She works here, doesn't she?", why: "works không có trợ động từ → mượn does." },
        { wrong: "I'm right, am not I?", right: "I'm right, aren't I?", why: "I am → đuôi đặc biệt aren't I." },
        { wrong: "He never smokes, doesn't he?", right: "He never smokes, does he?", why: "never mang nghĩa phủ định → đuôi khẳng định." },
      ],
    },
    { type: "tip", text: "Ngữ điệu: lên giọng ở đuôi khi thật sự hỏi (không chắc); xuống giọng khi chỉ muốn người nghe đồng ý." },
  ],
  questions: [
    { id: "b1qt1", type: "mcq", prompt: "You are a teacher, ___?", options: ["are you", "aren't you", "don't you", "isn't it"], answer: 1, explanation: "Câu khẳng định với are → đuôi aren't you." },
    { id: "b1qt2", type: "mcq", prompt: "She doesn't eat meat, ___?", options: ["does she", "doesn't she", "is she", "did she"], answer: 0, explanation: "Câu phủ định với doesn't → đuôi khẳng định does she." },
    { id: "b1qt3", type: "gap_fill", prompt: "They went to Hue last week, ___ they?", answers: ["didn't", "did not"], hint: "trợ động từ", explanation: "went (quá khứ đơn, khẳng định) → didn't they." },
    { id: "b1qt4", type: "gap_fill", prompt: "You have finished your homework, ___ you?", answers: ["haven't"], hint: "trợ động từ", explanation: "have finished → haven't you." },
    { id: "b1qt5", type: "mcq", prompt: "I'm late, ___?", options: ["am not I", "aren't I", "isn't I", "don't I"], answer: 1, explanation: "Trường hợp đặc biệt: I am → aren't I." },
    { id: "b1qt6", type: "mcq", prompt: "Let's have a break, ___?", options: ["shall we", "will we", "don't we", "let's we"], answer: 0, explanation: "Let's ... → shall we?" },
    {
      id: "b1qt7", type: "error_id",
      segments: [{ text: "He " }, { text: "never", underline: true }, { text: " " }, { text: "arrives", underline: true }, { text: " on time, " }, { text: "doesn't he", underline: true }, { text: "?" }],
      answer: 5, correction: "does he",
      explanation: "never mang nghĩa phủ định → đuôi khẳng định does he.",
    },
    { id: "b1qt8", type: "gap_fill", prompt: "Nam can swim very well, ___ he?", answers: ["can't", "cannot"], hint: "trợ động từ", explanation: "can (khẳng định) → can't he." },
    {
      id: "b1qt9", type: "matching", prompt: "Nối câu với đuôi đúng",
      left: ["It will rain,", "Nobody called,", "Close the door,"],
      right: ["will you?", "won't it?", "did they?"],
      pairs: [1, 2, 0],
      explanation: "will → won't it; Nobody (phủ định, thay bằng they) → did they; mệnh lệnh → will you.",
    },
  ],
};

const indirectQuestions: TopicContent = {
  slug: "indirect-questions",
  intro: "Could you tell me where the station is? — hỏi lịch sự, KHÔNG đảo trợ động từ.",
  theory: [
    { type: "summary", text: "Câu hỏi gián tiếp là câu hỏi được lồng vào một cụm mở đầu lịch sự (Could you tell me..., Do you know..., I wonder...). Phần câu hỏi bên trong có trật tự như câu KHẲNG ĐỊNH: S + V." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Có từ để hỏi", parts: [{ t: "Could you tell me / Do you know", role: "other" }, { t: "Wh-", role: "aux" }, { t: "S", role: "subject" }, { t: "V ?", role: "verb" }], example: "Do you know where she lives?" },
        { label: "Câu hỏi Yes/No", parts: [{ t: "Could you tell me / I wonder", role: "other" }, { t: "if / whether", role: "aux" }, { t: "S", role: "subject" }, { t: "V", role: "verb" }], example: "Could you tell me if the shop is open?" },
      ],
      note: "Bỏ do / does / did và chia động từ chính tương ứng: Where does he work? → Do you know where he works?",
    },
    {
      type: "compare",
      title: "Trực tiếp → gián tiếp",
      headers: ["Câu hỏi trực tiếp", "Câu hỏi gián tiếp"],
      rows: [
        ["Where is the bank?", "Could you tell me where the bank is?"],
        ["What time does the train leave?", "Do you know what time the train leaves?"],
        ["Did she pass the exam?", "I wonder if she passed the exam."],
        ["Can I park here?", "Do you know whether I can park here?"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Could you tell me where is the station?", right: "Could you tell me where the station is?", why: "Câu gián tiếp không đảo: S + V." },
        { wrong: "Do you know what time does it start?", right: "Do you know what time it starts?", why: "Bỏ does, chia động từ chính: starts." },
        { wrong: "I wonder is she at home.", right: "I wonder if she is at home.", why: "Câu Yes/No → cần if / whether." },
      ],
    },
    { type: "tip", text: "Dấu câu: nếu cụm mở đầu là câu hỏi (Could you tell me...?, Do you know...?) → kết thúc bằng ?. Nếu là câu kể (I wonder..., I'd like to know...) → kết thúc bằng dấu chấm." },
  ],
  questions: [
    { id: "b1iq1", type: "mcq", prompt: "Could you tell me where ___?", options: ["is the post office", "the post office is", "does the post office", "the post office"], answer: 1, explanation: "Câu hỏi gián tiếp: Wh- + S + V → where the post office is." },
    { id: "b1iq2", type: "mcq", prompt: "Do you know what time ___?", options: ["does the film start", "the film starts", "starts the film", "the film does start"], answer: 1, explanation: "Bỏ does, chia động từ: the film starts." },
    { id: "b1iq3", type: "gap_fill", prompt: "I wonder ___ she will come to the party.", answers: ["if", "whether"], hint: "câu Yes/No", explanation: "Câu hỏi Yes/No gián tiếp → if / whether." },
    {
      id: "b1iq4", type: "error_id",
      segments: [{ text: "Can you " }, { text: "tell me", underline: true }, { text: " " }, { text: "how much", underline: true }, { text: " " }, { text: "does this cost", underline: true }, { text: "?" }],
      answer: 3, correction: "this costs",
      explanation: "Không dùng does trong câu gián tiếp: how much this costs.",
    },
    { id: "b1iq5", type: "transform", prompt: "Where does Lan live? (Do you know...?)", starter: "Do you know", answers: ["Do you know where Lan lives?"], explanation: "Bỏ does, live → lives." },
    { id: "b1iq6", type: "transform", prompt: "Is the museum open on Mondays? (Could you tell me...?)", starter: "Could you tell me", answers: ["Could you tell me if the museum is open on Mondays?", "Could you tell me whether the museum is open on Mondays?"], explanation: "Yes/No → if/whether + S + V." },
    { id: "b1iq7", type: "transform", prompt: "What did he say? (I'd like to know...)", starter: "I'd like to know", answers: ["I'd like to know what he said.", "I would like to know what he said."], explanation: "Bỏ did, say → said." },
    { id: "b1iq8", type: "word_order", words: ["the", "you", "is", "where", "know", "do", "bank", "?"], answers: ["Do you know where the bank is?"], explanation: "Do you know + where + S + V?" },
    {
      id: "b1iq9", type: "matching", prompt: "Nối câu hỏi trực tiếp với câu gián tiếp",
      left: ["Where is he?", "Is he here?", "Where does he work?"],
      right: ["...if he is here.", "...where he works.", "...where he is."],
      pairs: [2, 0, 1],
      explanation: "Giữ từ để hỏi, bỏ do/does, Yes/No dùng if; luôn S + V.",
    },
  ],
};

const phrasalVerbs: TopicContent = {
  slug: "phrasal-verbs",
  intro: "look for, give up, turn on, find out... — động từ + giới từ/trạng từ tạo nghĩa mới.",
  theory: [
    { type: "summary", text: "Cụm động từ (phrasal verb) gồm động từ + tiểu từ (up, down, on, off, out...). Nghĩa của cả cụm thường khác hẳn nghĩa của động từ gốc, nên cần học theo cụm." },
    {
      type: "table",
      title: "Cụm động từ thông dụng ở B1",
      headers: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["look for", "tìm kiếm", "I'm looking for my glasses."],
        ["look after", "chăm sóc", "She looks after her little brother."],
        ["give up", "từ bỏ", "He gave up smoking last year."],
        ["find out", "tìm ra, phát hiện", "I found out the truth."],
        ["turn on / turn off", "bật / tắt", "Turn off the lights, please."],
        ["put on / take off", "mặc vào / cởi ra; (máy bay) cất cánh", "Put on your coat. · The plane took off."],
        ["get up", "thức dậy", "I get up at six."],
        ["pick up", "nhặt lên; đón ai", "I'll pick you up at 7."],
        ["run out of", "hết, cạn", "We've run out of milk."],
        ["get on with", "hòa hợp với", "I get on well with my colleagues."],
        ["come across", "tình cờ gặp/thấy", "I came across an old photo."],
        ["put off", "hoãn lại", "They put off the meeting until Friday."],
      ],
    },
    {
      type: "formula",
      title: "Vị trí tân ngữ",
      rows: [
        { label: "Tách được (danh từ)", parts: [{ t: "turn", role: "verb" }, { t: "the TV", role: "object" }, { t: "off", role: "other" }], example: "Turn the TV off. = Turn off the TV." },
        { label: "Tách được (đại từ)", parts: [{ t: "turn", role: "verb" }, { t: "it", role: "object" }, { t: "off", role: "other" }], example: "Turn it off. (KHÔNG: Turn off it.)" },
        { label: "Không tách", parts: [{ t: "look after", role: "verb" }, { t: "sb", role: "object" }], example: "She looks after them." },
      ],
      note: "Với cụm tách được, đại từ (it, them, him...) PHẢI đứng giữa động từ và tiểu từ.",
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Turn off it, please.", right: "Turn it off, please.", why: "Đại từ đứng giữa: turn it off." },
        { wrong: "I'm looking my keys.", right: "I'm looking for my keys.", why: "Tìm kiếm = look for." },
        { wrong: "We have run out milk.", right: "We have run out of milk.", why: "run out OF + danh từ." },
      ],
    },
    { type: "tip", text: "Học phrasal verb theo chủ đề (việc nhà, công việc, quan hệ) và luôn kèm một câu ví dụ — dễ nhớ hơn học danh sách." },
  ],
  questions: [
    { id: "b1ph1", type: "mcq", prompt: "I'm ___ my phone. Have you seen it?", options: ["looking after", "looking for", "looking up", "looking at"], answer: 1, explanation: "Tìm kiếm → look for." },
    { id: "b1ph2", type: "mcq", prompt: "He ___ smoking two years ago and feels much healthier now.", options: ["gave up", "gave in", "put off", "took off"], answer: 0, explanation: "Từ bỏ → give up (gave up)." },
    { id: "b1ph3", type: "mcq", prompt: "We've ___ sugar. Can you buy some?", options: ["run out of", "run out", "run off", "run into"], answer: 0, explanation: "Hết thứ gì → run out of + N." },
    { id: "b1ph4", type: "gap_fill", prompt: "It's cold outside. Put ___ your jacket.", answers: ["on"], hint: "mặc vào", explanation: "put on = mặc vào." },
    {
      id: "b1ph5", type: "error_id",
      segments: [{ text: "The TV is too loud. " }, { text: "Please", underline: true }, { text: " " }, { text: "turn down it", underline: true }, { text: " a " }, { text: "little", underline: true }, { text: "." }],
      answer: 3, correction: "turn it down",
      explanation: "Đại từ it phải đứng giữa: turn it down.",
    },
    { id: "b1ph6", type: "gap_fill", prompt: "Can you look ___ my cat while I'm on holiday?", answers: ["after"], hint: "chăm sóc", explanation: "look after = chăm sóc." },
    { id: "b1ph7", type: "transform", prompt: "They postponed the match because of the rain. (dùng put off)", starter: "They put", answers: ["They put off the match because of the rain.", "They put the match off because of the rain."], explanation: "postpone = put off; danh từ có thể đứng giữa hoặc sau." },
    {
      id: "b1ph8", type: "matching", prompt: "Nối cụm động từ với nghĩa",
      left: ["find out", "get on with", "come across"],
      right: ["tình cờ thấy", "phát hiện ra", "hòa hợp với"],
      pairs: [1, 2, 0],
      explanation: "find out = phát hiện; get on with = hòa hợp; come across = tình cờ gặp/thấy.",
    },
    { id: "b1ph9", type: "word_order", words: ["you", "I'll", "up", "pick", "at", "seven"], answers: ["I'll pick you up at seven"], explanation: "Đại từ you đứng giữa pick ... up." },
    { id: "b1ph10", type: "mcq", prompt: "The plane ___ at 6 a.m. and landed in Da Nang an hour later.", options: ["took off", "took on", "put off", "got off"], answer: 0, explanation: "Máy bay cất cánh → take off (took off)." },
  ],
};

export const B1_STRUCTURE_TOPICS: TopicContent[] = [
  gerundInfinitive,
  tooEnough,
  soSuch,
  questionTags,
  indirectQuestions,
  phrasalVerbs,
];
