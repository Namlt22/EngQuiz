import type { TopicContent } from "../types";

export const conditionalType2: TopicContent = {
  slug: "conditional-type-2",
  intro: "Giả định điều KHÔNG CÓ THẬT hoặc khó xảy ra ở hiện tại.",
  theory: [
    {
      type: "summary",
      text: "Câu điều kiện loại 2 dùng để giả định một điều KHÔNG CÓ THẬT ở hiện tại hoặc rất khó xảy ra, và tưởng tượng kết quả của nó.",
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
            { t: "V2 / V-ed (were)", role: "verb" },
            { t: ",", role: "other" },
            { t: "S", role: "subject" },
            { t: "would / could / might", role: "aux" },
            { t: "V", role: "verb" },
          ],
          example: "If I had more time, I would learn French.",
        },
      ],
      note: "Với to be, dùng were cho tất cả các ngôi (If I were, If she were). Văn nói thân mật có thể dùng was với I/he/she/it, nhưng were chuẩn hơn, nhất là trong đề thi.",
    },
    {
      type: "usage",
      title: "1. Giả định trái với thực tế hiện tại",
      text: "Thực tế: I don't have a car → giả định:",
      examples: [
        { en: "If I had a car, I would drive to work.", vi: "Nếu tôi có ô tô, tôi sẽ lái xe đi làm. (thực tế: không có)" },
        { en: "If she lived near here, we could meet more often.", vi: "Nếu cô ấy sống gần đây, chúng ta có thể gặp nhau thường xuyên hơn." },
      ],
    },
    {
      type: "usage",
      title: "2. Tình huống tưởng tượng, khó xảy ra",
      examples: [{ en: "If I won the lottery, I would travel around the world.", vi: "Nếu tôi trúng xổ số, tôi sẽ đi du lịch vòng quanh thế giới." }],
    },
    {
      type: "usage",
      title: "3. Lời khuyên: If I were you...",
      examples: [{ en: "If I were you, I would apologize to her.", vi: "Nếu tôi là bạn, tôi sẽ xin lỗi cô ấy." }],
    },
    {
      type: "compare",
      title: "Loại 1 vs Loại 2",
      headers: ["Loại 1 (có thể xảy ra)", "Loại 2 (không có thật / khó xảy ra)"],
      rows: [
        ["If + hiện tại đơn, will + V", "If + quá khứ đơn, would + V"],
        ["If I have time, I will help you. (có thể có thời gian)", "If I had time, I would help you. (thực tế không có)"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "If I would have money, I would buy it.", right: "If I had money, I would buy it.", why: "KHÔNG dùng would trong mệnh đề if." },
        { wrong: "If I was you, I will go.", right: "If I were you, I would go.", why: "Lời khuyên dùng \"If I were you\" và mệnh đề chính dùng would, không dùng will." },
        { wrong: "If he knows the answer, he would tell us.", right: "If he knew the answer, he would tell us.", why: "Loại 2: mệnh đề if dùng quá khứ đơn (knew), dù nói về hiện tại." },
      ],
    },
    { type: "tip", text: "Mẹo: quá khứ trong câu điều kiện loại 2 KHÔNG chỉ thời gian quá khứ, mà cho biết điều đó \"xa rời thực tế\"." },
  ],
  questions: [
    { id: "c2a", type: "verb_form", prompt: "If I ___ rich, I would buy a big house.", base: "be", answers: ["were", "was"], explanation: "Loại 2 với to be: dùng were (chuẩn) cho mọi ngôi; was cũng được chấp nhận trong văn nói." },
    { id: "c2b", type: "verb_form", prompt: "If she had more free time, she ___ a new language.", base: "learn", answers: ["would learn", "could learn", "'d learn"], explanation: "Mệnh đề chính loại 2: would/could + V nguyên mẫu." },
    { id: "c2c", type: "mcq", prompt: "If I ___ his number, I would call him.", options: ["know", "knew", "would know", "known"], answer: 1, explanation: "Mệnh đề if loại 2 dùng quá khứ đơn: knew." },
    { id: "c2d", type: "mcq", prompt: "If I were you, I ___ that job.", options: ["will take", "take", "would take", "took"], answer: 2, explanation: "Lời khuyên: If I were you, I would + V." },
    {
      id: "c2e", type: "error_id",
      segments: [{ text: "If we " }, { text: "would live", underline: true }, { text: " in Da Lat, " }, { text: "we", underline: true }, { text: " " }, { text: "would wear", underline: true }, { text: " warm clothes all year." }],
      answer: 1, correction: "lived",
      explanation: "Không dùng would trong mệnh đề if → If we lived in Da Lat.",
    },
    { id: "c2f", type: "transform", prompt: "I don't have a car, so I can't drive to work.", starter: "If I", answers: ["If I had a car, I could drive to work.", "If I had a car, I would be able to drive to work.", "If I had a car, I would drive to work."], explanation: "Thực tế phủ định ở hiện tại → loại 2 khẳng định: If I had a car, I could drive..." },
    { id: "c2g", type: "transform", prompt: "He is not tall, so he can't play basketball well.", starter: "If he", answers: ["If he were taller, he could play basketball well.", "If he was taller, he could play basketball well.", "If he were tall, he could play basketball well.", "If he was tall, he could play basketball well."], explanation: "Đảo nghĩa thực tế: is not tall → If he were (taller), he could..." },
    { id: "c2h", type: "word_order", words: ["would", "I", "if", "travel", "I", "more", "had", "money"], answers: ["I would travel if I had more money"], explanation: "Mệnh đề chính trước: S + would + V + if + S + V2." },
    { id: "c2i", type: "mcq", prompt: "What ___ you do if you found a wallet in the street?", options: ["will", "would", "do", "did"], answer: 1, explanation: "found (quá khứ) trong mệnh đề if → mệnh đề chính dùng would." },
    {
      id: "c2j", type: "matching", prompt: "Nối mỗi câu với loại câu điều kiện",
      left: ["If it rains, we'll stay in.", "If I were a bird, I would fly.", "If you heat ice, it melts."],
      right: ["Loại 0", "Loại 1", "Loại 2"],
      pairs: [1, 2, 0],
      explanation: "will → loại 1; were/would → loại 2; hiện tại đơn ở cả 2 vế (sự thật) → loại 0.",
    },
  ],
};
