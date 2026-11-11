import type { TopicContent } from "../types";

export const conditionalType3: TopicContent = {
  slug: "conditional-type-3",
  intro: "Giả định trái với quá khứ: tiếc nuối hoặc tưởng tượng một kết quả khác.",
  theory: [
    {
      type: "summary",
      text: "Câu điều kiện loại 3 giả định một điều KHÔNG XẢY RA trong quá khứ và tưởng tượng kết quả (cũng ở quá khứ) nếu nó đã xảy ra. Thường dùng để bày tỏ sự tiếc nuối hoặc trách móc.",
    },
    {
      type: "timeline",
      caption: "Cả điều kiện và kết quả đều nằm trong quá khứ (không có thật)",
      items: [
        { kind: "point", at: -0.75, label: "if ... had V3" },
        { kind: "point", at: -0.35, label: "would have V3" },
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
            { t: "had", role: "aux" },
            { t: "V3", role: "verb" },
            { t: ",", role: "other" },
            { t: "S", role: "subject" },
            { t: "would / could / might + have", role: "aux" },
            { t: "V3", role: "verb" },
          ],
          example: "If I had studied harder, I would have passed the exam.",
        },
      ],
      note: "Khi nói, \"would have\" thường rút gọn thành \"would've\" /ˈwʊdəv/ và \"had\" thành \"'d\": If I'd known, I would've come.",
    },
    {
      type: "usage",
      title: "1. Tiếc nuối về quá khứ",
      text: "Thực tế: I didn't study hard → I failed.",
      examples: [{ en: "If I had studied harder, I wouldn't have failed.", vi: "Nếu tôi học chăm hơn, tôi đã không trượt." }],
    },
    {
      type: "usage",
      title: "2. Tưởng tượng kết quả khác",
      examples: [
        { en: "If we had left earlier, we would have caught the train.", vi: "Nếu chúng tôi đi sớm hơn, chúng tôi đã kịp chuyến tàu." },
        { en: "She might have won if she hadn't fallen.", vi: "Có lẽ cô ấy đã thắng nếu không bị ngã." },
      ],
    },
    {
      type: "table",
      title: "Tổng hợp câu điều kiện",
      headers: ["Loại", "Mệnh đề If", "Mệnh đề chính", "Dùng khi"],
      rows: [
        ["0", "hiện tại đơn", "hiện tại đơn", "sự thật luôn đúng"],
        ["1", "hiện tại đơn", "will + V", "có thể xảy ra (hiện tại/tương lai)"],
        ["2", "quá khứ đơn", "would + V", "không có thật ở hiện tại"],
        ["3", "had + V3", "would have + V3", "không có thật ở quá khứ"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "If I would have known, I would have come.", right: "If I had known, I would have come.", why: "Không dùng would trong mệnh đề if, kể cả loại 3." },
        { wrong: "If she had told me, I would helped her.", right: "If she had told me, I would have helped her.", why: "Mệnh đề chính loại 3: would + have + V3." },
        { wrong: "If he had went to bed early, ...", right: "If he had gone to bed early, ...", why: "Sau had là V3: go → gone." },
      ],
    },
    { type: "tip", text: "Khi nghe, \"I'd\" trong mệnh đề if loại 3 là \"I had\", còn trong mệnh đề chính là \"I would\": If I'd known (had), I'd have told you (would)." },
  ],
  questions: [
    { id: "c3a", type: "verb_form", prompt: "If you ___ me, I would have helped you.", base: "ask", answers: ["had asked", "'d asked"], explanation: "Mệnh đề if loại 3: had + V3 → had asked." },
    { id: "c3b", type: "verb_form", prompt: "If we had taken a taxi, we ___ on time.", base: "arrive", answers: ["would have arrived", "would've arrived", "could have arrived"], explanation: "Mệnh đề chính loại 3: would have + V3." },
    { id: "c3c", type: "mcq", prompt: "If she ___ the instructions, she wouldn't have made that mistake.", options: ["read", "had read", "would read", "has read"], answer: 1, explanation: "Loại 3 → mệnh đề if dùng quá khứ hoàn thành: had read." },
    { id: "c3d", type: "mcq", prompt: "I ___ the party if I had known about it.", options: ["would go", "will go", "would have gone", "had gone"], answer: 2, explanation: "had known (loại 3) → mệnh đề chính: would have gone." },
    {
      id: "c3e", type: "error_id",
      segments: [{ text: "If he " }, { text: "had saved", underline: true }, { text: " money, he " }, { text: "would bought", underline: true }, { text: " " }, { text: "a new car", underline: true }, { text: " last year." }],
      answer: 3, correction: "would have bought",
      explanation: "Mệnh đề chính loại 3 cần would + have + V3.",
    },
    { id: "c3f", type: "transform", prompt: "I didn't know you were in hospital, so I didn't visit you.", starter: "If I had", answers: ["If I had known you were in hospital, I would have visited you.", "If I had known you were in hospital, I'd have visited you.", "If I had known you were in hospital, I would've visited you."], explanation: "Hai vế phủ định ở quá khứ → loại 3 khẳng định ở cả hai vế." },
    { id: "c3g", type: "transform", prompt: "We got lost because we didn't have a map.", starter: "If we had", answers: ["If we had had a map, we would not have got lost.", "If we had had a map, we wouldn't have got lost.", "If we had had a map, we would not have gotten lost.", "If we had had a map, we wouldn't have gotten lost."], explanation: "had + V3 của have → had had; kết quả đảo nghĩa: wouldn't have got lost." },
    { id: "c3h", type: "word_order", words: ["have", "if", "had", "passed", "would", "I", "studied", "I"], answers: ["I would have passed if I had studied"], explanation: "S + would have + V3 + if + S + had + V3." },
    {
      id: "c3i", type: "matching", prompt: "Nối mệnh đề If với mệnh đề chính đúng thì",
      left: ["If I see him,", "If I saw him,", "If I had seen him,"],
      right: ["I would have told him.", "I'll tell him.", "I would tell him."],
      pairs: [1, 2, 0],
      explanation: "see → will (loại 1); saw → would (loại 2); had seen → would have (loại 3).",
    },
    { id: "c3j", type: "mcq", prompt: "If it hadn't rained, we ___ a picnic.", options: ["would have had", "would had", "will have", "had had"], answer: 0, explanation: "Mệnh đề chính loại 3: would have + V3 (had)." },
  ],
};
