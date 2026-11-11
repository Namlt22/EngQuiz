import type { TopicContent } from "../types";

export const conditionalType1: TopicContent = {
  slug: "conditional-type-1",
  intro: "Nói về điều CÓ THỂ xảy ra ở hiện tại hoặc tương lai và kết quả của nó.",
  theory: [
    {
      type: "summary",
      text: "Câu điều kiện loại 1 diễn tả một điều kiện CÓ THẬT, có khả năng xảy ra ở hiện tại hoặc tương lai, và kết quả có thể xảy ra nếu điều kiện đó đúng.",
    },
    {
      type: "timeline",
      caption: "Điều kiện ở hiện tại, kết quả ở tương lai",
      items: [
        { kind: "point", at: 0, label: "if ..." },
        { kind: "point", at: 0.6, label: "will ..." },
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        {
          label: "Mệnh đề If + mệnh đề chính",
          parts: [
            { t: "If", role: "other" },
            { t: "S", role: "subject" },
            { t: "V (hiện tại đơn)", role: "verb" },
            { t: ",", role: "other" },
            { t: "S", role: "subject" },
            { t: "will / won't", role: "aux" },
            { t: "V", role: "verb" },
          ],
          example: "If it rains, we will stay at home.",
        },
        {
          label: "Đảo vị trí (không cần dấu phẩy)",
          parts: [
            { t: "S", role: "subject" },
            { t: "will", role: "aux" },
            { t: "V", role: "verb" },
            { t: "if", role: "other" },
            { t: "S", role: "subject" },
            { t: "V (hiện tại đơn)", role: "verb" },
          ],
          example: "We will stay at home if it rains.",
        },
      ],
      note: "Mệnh đề chính có thể dùng can / may / should / must hoặc câu mệnh lệnh thay cho will: If you see Lan, tell her to call me.",
    },
    {
      type: "usage",
      title: "1. Dự đoán kết quả có thể xảy ra",
      examples: [
        { en: "If you study hard, you will pass the exam.", vi: "Nếu bạn học chăm, bạn sẽ đỗ kỳ thi." },
        { en: "If we don't hurry, we'll miss the train.", vi: "Nếu không nhanh lên, chúng ta sẽ lỡ tàu." },
      ],
    },
    {
      type: "usage",
      title: "2. Lời hứa, cảnh báo, đe dọa",
      examples: [
        { en: "If you touch that, you'll burn yourself.", vi: "Nếu bạn chạm vào đó, bạn sẽ bị bỏng." },
        { en: "I'll help you if you need me.", vi: "Tôi sẽ giúp nếu bạn cần." },
      ],
    },
    {
      type: "compare",
      title: "Loại 0 vs Loại 1",
      headers: ["Loại 0", "Loại 1"],
      rows: [
        ["Sự thật luôn đúng", "Tình huống cụ thể, có thể xảy ra"],
        ["If + hiện tại đơn, hiện tại đơn", "If + hiện tại đơn, will + V"],
        ["If you heat ice, it melts.", "If it is sunny tomorrow, we will go swimming."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "If it will rain, we will stay at home.", right: "If it rains, we will stay at home.", why: "KHÔNG dùng will trong mệnh đề if. Mệnh đề if dùng hiện tại đơn dù nói về tương lai." },
        { wrong: "If you don't hurry, you miss the bus.", right: "If you don't hurry, you will miss the bus.", why: "Tình huống cụ thể trong tương lai → mệnh đề chính cần will." },
        { wrong: "If she come, I will tell her.", right: "If she comes, I will tell her.", why: "Mệnh đề if là hiện tại đơn → ngôi 3 số ít thêm -s." },
      ],
    },
    { type: "tip", text: "unless = if ... not. \"Unless you hurry, you'll be late.\" = \"If you don't hurry, you'll be late.\"" },
  ],
  questions: [
    { id: "c1a", type: "verb_form", prompt: "If it ___ tomorrow, we will cancel the picnic.", base: "rain", answers: ["rains"], explanation: "Mệnh đề if loại 1 dùng hiện tại đơn; chủ ngữ it → rains." },
    { id: "c1b", type: "verb_form", prompt: "If you leave now, you ___ the bus.", base: "catch", answers: ["will catch", "'ll catch"], explanation: "Mệnh đề chính loại 1: will + V nguyên mẫu." },
    { id: "c1c", type: "mcq", prompt: "If she ___ hard, she will pass the test.", options: ["will study", "studies", "studied", "study"], answer: 1, explanation: "Không dùng will sau if; chủ ngữ she → studies." },
    { id: "c1d", type: "mcq", prompt: "I'll call you if I ___ any news.", options: ["get", "will get", "got", "getting"], answer: 0, explanation: "Mệnh đề if (dù đứng sau) vẫn dùng hiện tại đơn: if I get." },
    {
      id: "c1e", type: "error_id",
      segments: [{ text: "If he " }, { text: "will come", underline: true }, { text: " late, " }, { text: "the teacher", underline: true }, { text: " " }, { text: "will be", underline: true }, { text: " angry." }],
      answer: 1, correction: "comes",
      explanation: "Không dùng will trong mệnh đề if → If he comes late.",
    },
    { id: "c1f", type: "mcq", prompt: "___ you hurry, you'll miss the train.", options: ["If", "Unless", "When", "Because"], answer: 1, explanation: "Unless = If ... not: Nếu bạn không nhanh lên, bạn sẽ lỡ tàu." },
    { id: "c1g", type: "transform", prompt: "Study hard or you will fail the exam.", starter: "If you don't", answers: ["If you don't study hard, you will fail the exam.", "If you do not study hard, you will fail the exam.", "If you don't study hard, you'll fail the exam."], explanation: "\"... or ...\" (nếu không thì) → If you don't + V, you will..." },
    { id: "c1h", type: "word_order", words: ["will", "if", "be", "you", "late", "you", "don't", "hurry"], answers: ["You will be late if you don't hurry"], explanation: "Mệnh đề chính đứng trước: S + will + V + if + S + V (hiện tại đơn)." },
    {
      id: "c1i", type: "matching", prompt: "Nối mệnh đề If với kết quả phù hợp",
      left: ["If you eat too much,", "If it's sunny tomorrow,", "If you need help,"],
      right: ["we'll go to the beach.", "I'll be happy to help.", "you'll feel sick."],
      pairs: [2, 0, 1],
      explanation: "Chọn kết quả hợp lý về nghĩa cho từng điều kiện.",
    },
    { id: "c1j", type: "gap_fill", prompt: "If you see Minh, ___ him to call me.", answers: ["tell", "ask"], hint: "câu mệnh lệnh", explanation: "Mệnh đề chính có thể là câu mệnh lệnh: tell / ask him to call me." },
  ],
};
