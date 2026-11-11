import type { TopicContent } from "../types";

export const toBe: TopicContent = {
  slug: "to-be",
  intro: "am / is / are — động từ đầu tiên và quan trọng nhất trong tiếng Anh.",
  theory: [
    {
      type: "summary",
      text: "Động từ to be (am / is / are) dùng để nói ai/cái gì LÀ gì, Ở đâu, hoặc NHƯ THẾ NÀO. Chọn am, is hay are tùy theo chủ ngữ.",
    },
    {
      type: "table",
      title: "Chọn am / is / are theo chủ ngữ",
      headers: ["Chủ ngữ", "to be", "Viết tắt", "Ví dụ"],
      rows: [
        ["I", "am", "I'm", "I'm a student."],
        ["He / She / It / danh từ số ít", "is", "he's, she's, it's", "She's my sister."],
        ["You / We / They / danh từ số nhiều", "are", "you're, we're, they're", "They're at home."],
      ],
    },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        {
          label: "Khẳng định (+)",
          parts: [
            { t: "S", role: "subject" },
            { t: "am / is / are", role: "aux" },
            { t: "N / Adj / nơi chốn", role: "object" },
          ],
          example: "He is a doctor.",
        },
        {
          label: "Phủ định (−)",
          parts: [
            { t: "S", role: "subject" },
            { t: "am / is / are + not", role: "aux" },
            { t: "N / Adj / nơi chốn", role: "object" },
          ],
          example: "We aren't tired.",
        },
        {
          label: "Nghi vấn (?)",
          parts: [
            { t: "Am / Is / Are", role: "aux" },
            { t: "S", role: "subject" },
            { t: "N / Adj / nơi chốn ?", role: "object" },
          ],
          example: "Is she from Hanoi?",
        },
      ],
      note: "Viết tắt phủ định: is not = isn't, are not = aren't. Riêng am not KHÔNG viết tắt thành amn't, chỉ có I'm not.",
    },
    {
      type: "usage",
      title: "1. Giới thiệu tên, nghề nghiệp, quốc tịch",
      examples: [
        { en: "I'm Nam. I'm from Vietnam.", vi: "Tôi là Nam. Tôi đến từ Việt Nam." },
        { en: "My mother is a teacher.", vi: "Mẹ tôi là giáo viên." },
      ],
    },
    {
      type: "usage",
      title: "2. Miêu tả tính chất, cảm xúc, tuổi",
      examples: [
        { en: "The weather is hot today.", vi: "Hôm nay thời tiết nóng." },
        { en: "I'm twenty years old.", vi: "Tôi hai mươi tuổi." },
      ],
    },
    {
      type: "usage",
      title: "3. Nói về vị trí",
      examples: [
        { en: "The keys are on the table.", vi: "Chùm chìa khóa ở trên bàn." },
        { en: "Are you at school now?", vi: "Bây giờ bạn có ở trường không?" },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I very happy.", right: "I am very happy.", why: "Tiếng Việt nói \"Tôi rất vui\" không cần động từ, nhưng tiếng Anh BẮT BUỘC có to be trước tính từ." },
        { wrong: "I am 20 years.", right: "I am 20 years old.", why: "Nói tuổi cần \"years old\" (hoặc chỉ \"I am 20\")." },
        { wrong: "She is go to school.", right: "She goes to school.", why: "Không dùng to be cùng động từ thường ở thì hiện tại đơn." },
        { wrong: "My friends is nice.", right: "My friends are nice.", why: "Chủ ngữ số nhiều (friends) đi với are." },
      ],
    },
    { type: "tip", text: "Mẹo: trả lời ngắn câu hỏi Yes/No bằng chính to be: \"Are you tired?\" → \"Yes, I am.\" / \"No, I'm not.\" (Không viết tắt ở câu trả lời khẳng định: KHÔNG nói \"Yes, I'm.\")" },
  ],
  questions: [
    { id: "tb1", type: "mcq", prompt: "My brother ___ a doctor.", options: ["am", "is", "are", "be"], answer: 1, explanation: "\"My brother\" là danh từ số ít, tương đương \"he\" → dùng is." },
    { id: "tb2", type: "mcq", prompt: "___ you from Da Nang?", options: ["Is", "Am", "Are", "Do"], answer: 2, explanation: "Câu hỏi với to be: đảo to be lên trước chủ ngữ. Chủ ngữ \"you\" đi với are." },
    { id: "tb3", type: "gap_fill", prompt: "I ___ hungry. Let's eat!", answers: ["am", "'m"], hint: "am / is / are", explanation: "Chủ ngữ \"I\" luôn đi với am." },
    { id: "tb4", type: "gap_fill", prompt: "The children ___ in the garden.", answers: ["are", "'re"], hint: "am / is / are", explanation: "\"The children\" là danh từ số nhiều (bất quy tắc của child) → are." },
    { id: "tb5", type: "mcq", prompt: "She ___ not at home now.", options: ["are", "am", "is", "isn't"], answer: 2, explanation: "Phủ định: S + is + not. \"isn't\" đã bao gồm \"not\" nên không thể đứng trước \"not\" nữa." },
    {
      id: "tb6", type: "error_id",
      segments: [{ text: "My parents " }, { text: "is", underline: true }, { text: " very " }, { text: "kind", underline: true }, { text: " to " }, { text: "me", underline: true }, { text: "." }],
      answer: 1, correction: "are",
      explanation: "\"My parents\" (bố mẹ tôi) là số nhiều → phải dùng are.",
    },
    {
      id: "tb7", type: "error_id",
      segments: [{ text: "I " }, { text: "very", underline: true }, { text: " " }, { text: "tired", underline: true }, { text: " " }, { text: "today", underline: true }, { text: "." }],
      answer: 1, correction: "am very",
      explanation: "Thiếu động từ to be trước tính từ: I am very tired today.",
    },
    { id: "tb8", type: "word_order", words: ["is", "where", "the", "station", "?"], answers: ["Where is the station?"], explanation: "Câu hỏi Wh-: Từ để hỏi + to be + chủ ngữ?" },
    { id: "tb9", type: "transform", prompt: "They are students. (→ câu phủ định)", starter: "They", answers: ["They are not students.", "They aren't students.", "They're not students."], explanation: "Phủ định: thêm not sau are → They are not / aren't students." },
    {
      id: "tb10", type: "matching", prompt: "Nối câu hỏi với câu trả lời phù hợp",
      left: ["Are you a student?", "Is it cold today?", "Are they your friends?"],
      right: ["Yes, they are.", "No, I'm not.", "Yes, it is."],
      pairs: [1, 2, 0],
      explanation: "Câu trả lời ngắn dùng lại chủ ngữ (đổi you → I) và to be tương ứng.",
    },
  ],
};
