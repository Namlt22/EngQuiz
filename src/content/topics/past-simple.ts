import type { TopicContent } from "../types";

export const pastSimple: TopicContent = {
  slug: "past-simple",
  intro: "Kể lại hành động đã xảy ra và kết thúc tại một thời điểm trong quá khứ.",
  theory: [
    {
      type: "summary",
      text: "Thì quá khứ đơn diễn tả hành động đã xảy ra và KẾT THÚC HOÀN TOÀN trong quá khứ, thường có thời gian cụ thể (yesterday, last week, in 2020...).",
    },
    {
      type: "timeline",
      caption: "Một thời điểm đã kết thúc trong quá khứ",
      items: [{ kind: "point", at: -0.55, label: "yesterday" }],
    },
    {
      type: "formula",
      title: "Công thức với động từ thường",
      rows: [
        {
          label: "Khẳng định (+)",
          parts: [{ t: "S", role: "subject" }, { t: "V-ed / V2", role: "verb" }, { t: "O", role: "object" }],
          example: "We visited Hoi An last summer.",
        },
        {
          label: "Phủ định (−)",
          parts: [{ t: "S", role: "subject" }, { t: "did not (didn't)", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }, { t: "O", role: "object" }],
          example: "She didn't go to school yesterday.",
        },
        {
          label: "Nghi vấn (?)",
          parts: [{ t: "Did", role: "aux" }, { t: "S", role: "subject" }, { t: "V (nguyên mẫu)", role: "verb" }, { t: "O ?", role: "object" }],
          example: "Did you see the film?",
        },
      ],
      note: "did dùng cho TẤT CẢ các ngôi (I, you, he, she, they...).",
    },
    {
      type: "table",
      title: "Quy tắc thêm -ed (động từ có quy tắc)",
      headers: ["Trường hợp", "Quy tắc", "Ví dụ"],
      rows: [
        ["Tận cùng -e", "thêm -d", "live → lived, dance → danced"],
        ["Phụ âm + y", "đổi y → i, thêm -ed", "study → studied, cry → cried"],
        ["1 âm tiết: phụ âm + nguyên âm + phụ âm", "gấp đôi phụ âm cuối", "stop → stopped, plan → planned"],
        ["Còn lại", "thêm -ed", "work → worked, play → played"],
      ],
    },
    {
      type: "table",
      title: "Một số động từ bất quy tắc thường gặp",
      headers: ["Nguyên mẫu", "Quá khứ (V2)", "Nghĩa"],
      rows: [
        ["go", "went", "đi"],
        ["have", "had", "có"],
        ["see", "saw", "nhìn thấy"],
        ["buy", "bought", "mua"],
        ["eat", "ate", "ăn"],
        ["take", "took", "lấy, mang"],
        ["make", "made", "làm"],
        ["write", "wrote", "viết"],
      ],
    },
    {
      type: "usage",
      title: "1. Hành động đã kết thúc ở thời điểm xác định",
      examples: [
        { en: "I met her two years ago.", vi: "Tôi gặp cô ấy cách đây hai năm." },
        { en: "They moved to Saigon in 2019.", vi: "Họ chuyển đến Sài Gòn năm 2019." },
      ],
    },
    {
      type: "usage",
      title: "2. Chuỗi hành động nối tiếp nhau trong quá khứ",
      examples: [{ en: "He came home, took a shower and went to bed.", vi: "Anh ấy về nhà, tắm rồi đi ngủ." }],
    },
    {
      type: "signals",
      title: "Dấu hiệu nhận biết",
      words: ["yesterday", "last night / week / year", "... ago", "in 2010", "when I was a child", "this morning (đã qua)"],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I didn't went to the party.", right: "I didn't go to the party.", why: "Sau did/didn't, động từ trở về nguyên mẫu." },
        { wrong: "Did she called you?", right: "Did she call you?", why: "Câu hỏi với Did → V nguyên mẫu." },
        { wrong: "We goed to the beach.", right: "We went to the beach.", why: "go là động từ bất quy tắc: go → went." },
        { wrong: "He stoped the car.", right: "He stopped the car.", why: "stop: phụ âm + nguyên âm + phụ âm → gấp đôi p." },
      ],
    },
    { type: "tip", text: "Khi nghe, đuôi -ed thường rất nhẹ: /t/ (worked), /d/ (played), /ɪd/ (wanted). Hãy chú ý âm cuối trong bài Nghe & chép!" },
  ],
  questions: [
    { id: "pa1", type: "verb_form", prompt: "I ___ my grandparents last weekend.", base: "visit", answers: ["visited"], explanation: "last weekend → quá khứ đơn: visit → visited." },
    { id: "pa2", type: "verb_form", prompt: "She ___ a new phone yesterday.", base: "buy", answers: ["bought"], explanation: "buy là động từ bất quy tắc: buy → bought." },
    { id: "pa3", type: "mcq", prompt: "___ you go to the cinema last night?", options: ["Do", "Did", "Were", "Was"], answer: 1, explanation: "Câu hỏi quá khứ đơn với động từ thường: Did + S + V nguyên mẫu." },
    { id: "pa4", type: "mcq", prompt: "We ___ TV yesterday evening.", options: ["didn't watch", "didn't watched", "not watched", "don't watch"], answer: 0, explanation: "Phủ định: didn't + V nguyên mẫu." },
    { id: "pa5", type: "verb_form", prompt: "The bus ___ suddenly.", base: "stop", answers: ["stopped"], explanation: "stop → stopped (gấp đôi p)." },
    { id: "pa6", type: "verb_form", prompt: "He ___ hard for the exam last month.", base: "study", answers: ["studied"], explanation: "Phụ âm + y → đổi y thành i + ed: studied." },
    {
      id: "pa7", type: "error_id",
      segments: [{ text: "Did " }, { text: "your sister", underline: true }, { text: " " }, { text: "went", underline: true }, { text: " to Hanoi " }, { text: "last year", underline: true }, { text: "?" }],
      answer: 3, correction: "go",
      explanation: "Sau Did dùng động từ nguyên mẫu: Did your sister go...?",
    },
    { id: "pa8", type: "word_order", words: ["ago", "moved", "they", "here", "three years"], answers: ["They moved here three years ago"], explanation: "\"... ago\" đặt cuối câu: three years ago." },
    { id: "pa9", type: "transform", prompt: "Tom ate pho for breakfast. (→ câu phủ định)", starter: "Tom", answers: ["Tom did not eat pho for breakfast.", "Tom didn't eat pho for breakfast."], explanation: "ate → did not / didn't + eat." },
    {
      id: "pa10", type: "matching", prompt: "Nối động từ với dạng quá khứ",
      left: ["write", "take", "see"],
      right: ["saw", "wrote", "took"],
      pairs: [1, 2, 0],
      explanation: "write → wrote, take → took, see → saw (đều là động từ bất quy tắc).",
    },
  ],
};
