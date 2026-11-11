import type { TopicContent } from "../types";

export const passivePresentPast: TopicContent = {
  slug: "passive-present-past",
  intro: "Chuyển trọng tâm từ người làm sang hành động hoặc đối tượng chịu tác động.",
  theory: [
    {
      type: "summary",
      text: "Câu bị động dùng khi muốn nhấn mạnh ĐỐI TƯỢNG chịu tác động của hành động, hoặc khi không biết / không cần nói ai thực hiện hành động.",
    },
    {
      type: "formula",
      title: "Công thức chung",
      rows: [
        {
          label: "Bị động",
          parts: [{ t: "S (đối tượng)", role: "subject" }, { t: "be", role: "aux" }, { t: "V3 / V-ed", role: "verb" }, { t: "(by + người làm)", role: "object" }],
        },
        {
          label: "Hiện tại đơn",
          parts: [{ t: "S", role: "subject" }, { t: "am / is / are", role: "aux" }, { t: "V3 / V-ed", role: "verb" }],
          example: "English is spoken all over the world.",
        },
        {
          label: "Quá khứ đơn",
          parts: [{ t: "S", role: "subject" }, { t: "was / were", role: "aux" }, { t: "V3 / V-ed", role: "verb" }],
          example: "This bridge was built in 1990.",
        },
      ],
      note: "Phủ định: thêm not sau be (isn't made, wasn't built). Nghi vấn: đảo be lên đầu (Is it made...? Was it built...?).",
    },
    {
      type: "table",
      title: "Các bước chuyển chủ động → bị động",
      headers: ["Bước", "Chủ động: They grow rice in Vietnam.", "Bị động"],
      rows: [
        ["1. Lấy tân ngữ làm chủ ngữ", "rice", "Rice ..."],
        ["2. Chia be theo thì và chủ ngữ mới", "grow (hiện tại đơn)", "Rice is ..."],
        ["3. Động từ chính → V3", "grow → grown", "Rice is grown ..."],
        ["4. Thêm by + O (nếu cần)", "they (chung chung) → bỏ", "Rice is grown in Vietnam."],
      ],
    },
    {
      type: "usage",
      title: "1. Không biết hoặc không quan trọng ai làm",
      examples: [
        { en: "My bike was stolen last night.", vi: "Xe đạp của tôi bị lấy trộm tối qua." },
        { en: "These cars are made in Japan.", vi: "Những chiếc ô tô này được sản xuất ở Nhật." },
      ],
    },
    {
      type: "usage",
      title: "2. Nhấn mạnh đối tượng, có người làm đi kèm by",
      examples: [{ en: "The Tale of Kieu was written by Nguyen Du.", vi: "Truyện Kiều được viết bởi Nguyễn Du." }],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The house was build in 2000.", right: "The house was built in 2000.", why: "Sau be phải là V3 (quá khứ phân từ): build → built." },
        { wrong: "The letters is sent every day.", right: "The letters are sent every day.", why: "be chia theo chủ ngữ MỚI (the letters, số nhiều) → are." },
        { wrong: "The window broken by Tom.", right: "The window was broken by Tom.", why: "Thiếu be. Bị động luôn có be + V3." },
        { wrong: "It was happened yesterday.", right: "It happened yesterday.", why: "happen là nội động từ (không có tân ngữ) → không có dạng bị động." },
      ],
    },
    { type: "tip", text: "Bỏ \"by + người làm\" khi người làm là: people, they, someone, somebody, hoặc ai cũng biết." },
  ],
  questions: [
    { id: "pv1", type: "mcq", prompt: "English ___ in many countries.", options: ["speaks", "is spoken", "is speaking", "spoke"], answer: 1, explanation: "Chủ ngữ \"English\" chịu tác động (được nói) → bị động hiện tại đơn: is spoken." },
    { id: "pv2", type: "verb_form", prompt: "This temple ___ in the 11th century.", base: "build", answers: ["was built"], explanation: "Thời điểm trong quá khứ → was + V3: was built." },
    { id: "pv3", type: "verb_form", prompt: "These shoes ___ in Vietnam.", base: "make", answers: ["are made"], explanation: "Sự thật hiện tại, chủ ngữ số nhiều → are made." },
    { id: "pv4", type: "mcq", prompt: "The windows ___ yesterday.", options: ["was cleaned", "were cleaned", "cleaned", "are cleaned"], answer: 1, explanation: "Quá khứ, chủ ngữ số nhiều (windows) → were cleaned." },
    {
      id: "pv5", type: "error_id",
      segments: [{ text: "The letter " }, { text: "was", underline: true }, { text: " " }, { text: "wrote", underline: true }, { text: " " }, { text: "by my grandfather", underline: true }, { text: "." }],
      answer: 3, correction: "written",
      explanation: "Sau be dùng V3: write → written (wrote là V2).",
    },
    { id: "pv6", type: "transform", prompt: "Someone cleans the classroom every day.", starter: "The classroom", answers: ["The classroom is cleaned every day."], explanation: "Hiện tại đơn, chủ ngữ mới số ít → is cleaned; bỏ \"by someone\"." },
    { id: "pv7", type: "transform", prompt: "Nguyen Du wrote The Tale of Kieu.", starter: "The Tale of Kieu", answers: ["The Tale of Kieu was written by Nguyen Du."], explanation: "Quá khứ đơn → was written; người làm quan trọng nên giữ \"by Nguyen Du\"." },
    { id: "pv8", type: "mcq", prompt: "The accident ___ last night.", options: ["was happened", "happened", "is happened", "were happened"], answer: 1, explanation: "happen là nội động từ → không dùng bị động." },
    { id: "pv9", type: "word_order", words: ["was", "my", "stolen", "phone", "yesterday"], answers: ["My phone was stolen yesterday"], explanation: "S + was + V3 + thời gian." },
    { id: "pv10", type: "gap_fill", prompt: "___ the cake made by your mother?", answers: ["was", "is"], hint: "be", explanation: "Câu hỏi bị động: đảo be lên đầu → Was/Is the cake made...?" },
  ],
};
