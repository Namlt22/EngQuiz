import type { TopicContent } from "../types";

export const presentSimple: TopicContent = {
  slug: "present-simple",
  intro: "Diễn tả thói quen, sự thật hiển nhiên và lịch trình cố định.",
  theory: [
    {
      type: "summary",
      text: "Thì hiện tại đơn dùng cho những việc xảy ra THƯỜNG XUYÊN (thói quen), những điều LUÔN ĐÚNG (sự thật) và lịch trình cố định (tàu, xe, giờ học).",
    },
    {
      type: "timeline",
      caption: "Hành động lặp đi lặp lại ở quá khứ, hiện tại và tương lai",
      items: [{ kind: "repeat", at: -0.85, to: 0.85, label: "every day" }],
    },
    {
      type: "formula",
      title: "Công thức với động từ thường",
      rows: [
        {
          label: "Khẳng định (+)",
          parts: [{ t: "S", role: "subject" }, { t: "V / V-s/es", role: "verb" }, { t: "O", role: "object" }],
          example: "She drinks coffee every morning.",
        },
        {
          label: "Phủ định (−)",
          parts: [{ t: "S", role: "subject" }, { t: "do not / does not", role: "aux" }, { t: "V (nguyên mẫu)", role: "verb" }, { t: "O", role: "object" }],
          example: "He doesn't eat meat.",
        },
        {
          label: "Nghi vấn (?)",
          parts: [{ t: "Do / Does", role: "aux" }, { t: "S", role: "subject" }, { t: "V (nguyên mẫu)", role: "verb" }, { t: "O ?", role: "object" }],
          example: "Do you live near here?",
        },
      ],
      note: "He / She / It / danh từ số ít → V-s/es và does. I / You / We / They / số nhiều → V nguyên mẫu và do.",
    },
    {
      type: "table",
      title: "Quy tắc thêm -s / -es",
      headers: ["Động từ tận cùng", "Quy tắc", "Ví dụ"],
      rows: [
        ["-o, -s, -ss, -sh, -ch, -x, -z", "thêm -es", "go → goes, watch → watches, fix → fixes"],
        ["phụ âm + y", "bỏ y, thêm -ies", "study → studies, cry → cries"],
        ["nguyên âm + y", "thêm -s", "play → plays, buy → buys"],
        ["bất quy tắc", "—", "have → has"],
        ["còn lại", "thêm -s", "work → works, read → reads"],
      ],
    },
    {
      type: "usage",
      title: "1. Thói quen, hành động lặp lại",
      examples: [
        { en: "I get up at six o'clock every day.", vi: "Tôi thức dậy lúc 6 giờ mỗi ngày." },
        { en: "My father usually reads the news after dinner.", vi: "Bố tôi thường đọc tin tức sau bữa tối." },
      ],
    },
    {
      type: "usage",
      title: "2. Sự thật hiển nhiên, chân lý",
      examples: [
        { en: "The sun rises in the east.", vi: "Mặt trời mọc ở hướng đông." },
        { en: "Water boils at one hundred degrees.", vi: "Nước sôi ở 100 độ." },
      ],
    },
    {
      type: "usage",
      title: "3. Lịch trình, thời gian biểu",
      examples: [{ en: "The train leaves at eight tomorrow.", vi: "Tàu khởi hành lúc 8 giờ ngày mai." }],
    },
    {
      type: "signals",
      title: "Dấu hiệu nhận biết",
      words: ["always", "usually", "often", "sometimes", "rarely", "never", "every day / week", "once a week", "on Mondays"],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She go to school by bus.", right: "She goes to school by bus.", why: "Chủ ngữ ngôi 3 số ít (she) → động từ thêm -s/es." },
        { wrong: "He doesn't likes tea.", right: "He doesn't like tea.", why: "Sau does/doesn't, động từ trở về nguyên mẫu (không thêm -s)." },
        { wrong: "Do she work here?", right: "Does she work here?", why: "Câu hỏi với she/he/it dùng Does." },
        { wrong: "I am usually drink milk.", right: "I usually drink milk.", why: "Không dùng to be cùng động từ thường." },
      ],
    },
    { type: "tip", text: "Trạng từ tần suất (always, usually, never...) đứng TRƯỚC động từ thường nhưng SAU to be: \"She always walks.\" / \"She is always late.\"" },
  ],
  questions: [
    { id: "ps1", type: "mcq", prompt: "My sister ___ English every evening.", options: ["study", "studies", "studys", "is study"], answer: 1, explanation: "Chủ ngữ số ít + động từ tận cùng phụ âm + y → bỏ y thêm -ies: studies." },
    { id: "ps2", type: "verb_form", prompt: "He ___ TV after dinner.", base: "watch", answers: ["watches"], explanation: "Động từ tận cùng -ch → thêm -es: watches." },
    { id: "ps3", type: "verb_form", prompt: "They ___ football on Sundays.", base: "play", answers: ["play"], explanation: "Chủ ngữ \"they\" → giữ nguyên động từ." },
    { id: "ps4", type: "mcq", prompt: "___ your father work in a bank?", options: ["Do", "Is", "Does", "Are"], answer: 2, explanation: "Câu hỏi với chủ ngữ số ít (your father) → Does + V nguyên mẫu." },
    { id: "ps5", type: "verb_form", prompt: "She ___ eat fast food.", base: "phủ định của do", answers: ["doesn't", "does not"], explanation: "Phủ định ngôi 3 số ít: does not / doesn't + V nguyên mẫu." },
    {
      id: "ps6", type: "error_id",
      segments: [{ text: "My mother " }, { text: "doesn't", underline: true }, { text: " " }, { text: "drinks", underline: true }, { text: " coffee " }, { text: "in the evening", underline: true }, { text: "." }],
      answer: 3, correction: "drink",
      explanation: "Sau doesn't, động từ ở dạng nguyên mẫu: doesn't drink.",
    },
    { id: "ps7", type: "gap_fill", prompt: "Water ___ at 100 degrees Celsius.", answers: ["boils"], hint: "boil", explanation: "Sự thật hiển nhiên → hiện tại đơn; chủ ngữ \"water\" số ít → boils." },
    { id: "ps8", type: "word_order", words: ["always", "late", "is", "Tom", "for", "class"], answers: ["Tom is always late for class"], explanation: "Trạng từ tần suất đứng SAU to be: Tom is always late." },
    { id: "ps9", type: "word_order", words: ["usually", "I", "breakfast", "have", "at seven"], answers: ["I usually have breakfast at seven"], explanation: "Trạng từ tần suất đứng TRƯỚC động từ thường: I usually have..." },
    { id: "ps10", type: "transform", prompt: "Lan likes music. (→ câu hỏi Yes/No)", starter: "Does", answers: ["Does Lan like music?"], explanation: "Câu hỏi: Does + S + V nguyên mẫu? → Does Lan like music?" },
  ],
};
