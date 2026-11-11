import type { TopicContent } from "../types";

export const presentContinuous: TopicContent = {
  slug: "present-continuous",
  intro: "Diễn tả hành động đang xảy ra ngay lúc nói hoặc trong giai đoạn hiện tại.",
  theory: [
    {
      type: "summary",
      text: "Thì hiện tại tiếp diễn dùng cho hành động ĐANG xảy ra ngay lúc nói, hoặc đang diễn ra tạm thời trong khoảng thời gian này.",
    },
    {
      type: "timeline",
      caption: "Hành động đang diễn ra quanh thời điểm hiện tại",
      items: [{ kind: "span", at: -0.25, to: 0.25, label: "now" }],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        {
          label: "Khẳng định (+)",
          parts: [{ t: "S", role: "subject" }, { t: "am / is / are", role: "aux" }, { t: "V-ing", role: "verb" }, { t: "O", role: "object" }],
          example: "I am reading a book.",
        },
        {
          label: "Phủ định (−)",
          parts: [{ t: "S", role: "subject" }, { t: "am / is / are + not", role: "aux" }, { t: "V-ing", role: "verb" }, { t: "O", role: "object" }],
          example: "She isn't sleeping.",
        },
        {
          label: "Nghi vấn (?)",
          parts: [{ t: "Am / Is / Are", role: "aux" }, { t: "S", role: "subject" }, { t: "V-ing", role: "verb" }, { t: "O ?", role: "object" }],
          example: "Are they playing football?",
        },
      ],
    },
    {
      type: "table",
      title: "Quy tắc thêm -ing",
      headers: ["Trường hợp", "Quy tắc", "Ví dụ"],
      rows: [
        ["Tận cùng -e câm", "bỏ e, thêm -ing", "write → writing, make → making"],
        ["Tận cùng -ie", "đổi ie → y, thêm -ing", "lie → lying, die → dying"],
        ["1 âm tiết: phụ âm + nguyên âm + phụ âm", "gấp đôi phụ âm cuối", "run → running, sit → sitting"],
        ["Còn lại", "thêm -ing", "read → reading, play → playing"],
      ],
    },
    {
      type: "usage",
      title: "1. Hành động đang xảy ra lúc nói",
      examples: [
        { en: "Be quiet! The baby is sleeping.", vi: "Trật tự! Em bé đang ngủ." },
        { en: "Look! It's raining.", vi: "Nhìn kìa! Trời đang mưa." },
      ],
    },
    {
      type: "usage",
      title: "2. Hành động tạm thời trong giai đoạn này",
      examples: [{ en: "I'm learning to drive this month.", vi: "Tháng này tôi đang học lái xe." }],
    },
    {
      type: "signals",
      title: "Dấu hiệu nhận biết",
      words: ["now", "right now", "at the moment", "at present", "Look!", "Listen!", "Be quiet!", "these days", "this week"],
    },
    {
      type: "compare",
      title: "Hiện tại đơn vs Hiện tại tiếp diễn",
      headers: ["Hiện tại đơn", "Hiện tại tiếp diễn"],
      rows: [
        ["Thói quen, lặp lại", "Đang xảy ra lúc nói"],
        ["I walk to school every day.", "I'm walking to school now."],
        ["Lâu dài: She lives in Hue.", "Tạm thời: She's living with friends this month."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She cooking now.", right: "She is cooking now.", why: "Thiếu to be. Công thức luôn là am/is/are + V-ing." },
        { wrong: "I am knowing the answer.", right: "I know the answer.", why: "Động từ chỉ trạng thái (know, like, want, need, believe...) thường KHÔNG dùng ở dạng tiếp diễn." },
        { wrong: "He is siting there.", right: "He is sitting there.", why: "sit: phụ âm + nguyên âm + phụ âm → gấp đôi t: sitting." },
      ],
    },
  ],
  questions: [
    { id: "pc1", type: "mcq", prompt: "Listen! Someone ___ at the door.", options: ["knocks", "is knocking", "knock", "are knocking"], answer: 1, explanation: "\"Listen!\" → hành động đang xảy ra lúc nói. Chủ ngữ someone số ít → is knocking." },
    { id: "pc2", type: "verb_form", prompt: "Look! The children ___ in the rain.", base: "run", answers: ["are running"], explanation: "Look! → hiện tại tiếp diễn. run → running (gấp đôi n)." },
    { id: "pc3", type: "verb_form", prompt: "I ___ an email at the moment.", base: "write", answers: ["am writing", "'m writing"], explanation: "at the moment → hiện tại tiếp diễn. write bỏ e → writing." },
    { id: "pc4", type: "mcq", prompt: "I ___ what you mean.", options: ["am understanding", "understand", "understanding", "is understand"], answer: 1, explanation: "understand là động từ trạng thái → không dùng tiếp diễn." },
    { id: "pc5", type: "mcq", prompt: "My brother usually ___ to work, but today he ___ the bus.", options: ["cycles / takes", "is cycling / takes", "cycles / is taking", "is cycling / is taking"], answer: 2, explanation: "usually → thói quen (hiện tại đơn); today → tạm thời, khác thói quen (hiện tại tiếp diễn)." },
    {
      id: "pc6", type: "error_id",
      segments: [{ text: "Be quiet! " }, { text: "The baby", underline: true }, { text: " " }, { text: "sleeps", underline: true }, { text: " " }, { text: "in the next room", underline: true }, { text: "." }],
      answer: 3, correction: "is sleeping",
      explanation: "\"Be quiet!\" → hành động đang diễn ra → is sleeping.",
    },
    { id: "pc7", type: "word_order", words: ["are", "what", "doing", "you", "?"], answers: ["What are you doing?"], explanation: "Câu hỏi Wh-: Wh + am/is/are + S + V-ing?" },
    { id: "pc8", type: "transform", prompt: "She is watching TV. (→ câu phủ định)", starter: "She", answers: ["She is not watching TV.", "She isn't watching TV.", "She's not watching TV."], explanation: "Phủ định: is + not + V-ing." },
    { id: "pc9", type: "gap_fill", prompt: "___ they playing games right now?", answers: ["are"], hint: "am / is / are", explanation: "Chủ ngữ they → Are." },
    {
      id: "pc10", type: "matching", prompt: "Nối động từ với dạng -ing đúng",
      left: ["swim", "make", "lie"],
      right: ["lying", "swimming", "making"],
      pairs: [1, 2, 0],
      explanation: "swim → swimming (gấp đôi m); make → making (bỏ e); lie → lying (ie → y).",
    },
  ],
};
