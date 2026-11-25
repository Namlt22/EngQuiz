/**
 * Ngữ pháp HSK 3 — bài 7–12: 才 / 就, cặp liên từ điều kiện, trình tự hành động, phó từ 又 / 再 / 还 và mức độ,
 * đại từ nghi vấn dùng phiếm chỉ, giới từ 为了 / 关于 / 根据 / 向 / 对. Câu ví dụ chỉ dùng từ HSK 1–3.
 */
import type { ZhGrammarLesson } from "./types";

export const HSK3_GRAMMAR_B: ZhGrammarLesson[] = [
  {
    id: "cai-jiu",
    level: 3,
    title: "才 và 就: muộn hay sớm, nhiều hay ít",
    points: ["副词 才 · mới (muộn, khó)", "副词 就 · đã (sớm, dễ)"],
    intro: "Mười giờ anh ấy mới đến / tám giờ anh ấy đã đến rồi — cùng một sự việc, hai thái độ.",
    blocks: [
      { type: "summary", text: "就 và 才 đứng trước động từ, thể hiện cảm nhận của người nói. 就 = sớm, nhanh, dễ hơn mong đợi; câu thường có 了. 才 = muộn, chậm, khó hơn mong đợi; câu KHÔNG dùng 了. Ngoài ra 才 + số lượng = \"chỉ có\" (ít)." },
      {
        type: "formula",
        rows: [
          { label: "Sớm", pattern: "Thời gian + 就 + V + 了", example: "他 八 点 就 来 了 。" },
          { label: "Muộn", pattern: "Thời gian + 才 + V", example: "他 十 点 才 来 。" },
          { label: "Ít", pattern: "才 + Số lượng", example: "这 件 衣服 才 五十 块 钱 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "他 五 岁 就 会 游泳 了 。", vi: "Mới năm tuổi cậu ấy đã biết bơi." },
          { zh: "你 怎么 现在 才 来 ？", vi: "Sao giờ bạn mới đến?" },
          { zh: "我 早上 六 点 就 起床 了 。", vi: "Sáng tôi sáu giờ đã dậy rồi." },
          { zh: "他 学 了 三 年 才 学 会 。", vi: "Anh ấy học ba năm mới học được." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "他 十 点 才 来 了 。", right: "他 十 点 才 来 。", why: "Câu có 才 (muộn) không dùng 了." },
          { wrong: "他 才 十 点 来 。", right: "他 十 点 才 来 。", why: "才 đứng sau thời gian, trước động từ." },
        ],
      },
    ],
    quiz: [
      { id: "h3cj-1", type: "mcq", zhPrompt: true, prompt: "电影 七 点 开始 ， 他 八 点 ___ 来 。", options: ["才", "就", "再"], answer: 0, explanation: "Phim bắt đầu 7 giờ, 8 giờ mới đến → muộn → 才." },
      { id: "h3cj-2", type: "mcq", zhPrompt: true, prompt: "他 五 岁 ___ 会 游泳 了 。", options: ["才", "就", "还"], answer: 1, explanation: "Sớm hơn mong đợi, có 了 → 就." },
      { id: "h3cj-3", type: "mcq", prompt: "Câu nào SAI?", options: ["他 十 点 才 来 。", "他 十 点 才 来 了 。", "他 八 点 就 来 了 。"], answer: 1, explanation: "才 không đi với 了." },
      { id: "h3cj-4", type: "mcq", prompt: "\"我 早上 六 点 就 起床 了 。\" người nói thấy 6 giờ là?", options: ["sớm", "muộn", "đúng giờ"], answer: 0, explanation: "就 = sớm hơn mong đợi." },
      { id: "h3cj-5", type: "order", vi: "Sao giờ bạn mới đến?", answers: ["你 怎么 现在 才 来 ？"], explanation: "怎么 + thời gian + 才 + V." },
      { id: "h3cj-6", type: "order", vi: "Bộ quần áo này chỉ có năm mươi tệ.", answers: ["这 件 衣服 才 五十 块 钱 。"], explanation: "才 + số lượng = chỉ có." },
    ],
  },
  {
    id: "conditional-conjunctions",
    level: 3,
    title: "不但…而且, 只要…就, 只有…才, 如果…就, 除了…以外",
    points: ["不但…而且 · tăng tiến", "只要…就 · điều kiện đủ", "只有…才 · điều kiện duy nhất", "如果…(的话) 就 · giả thiết", "除了…以外 · ngoài… ra", "或者 / 还是 · hoặc"],
    intro: "Không những… mà còn, chỉ cần… là, chỉ có… mới, nếu… thì, ngoài… ra.",
    blocks: [
      { type: "summary", text: "Các cặp liên từ đi theo đôi cố định — nhớ cặp chứ không nhớ từ lẻ. 只要 (chỉ cần, dễ) đi với 就; 只有 (chỉ có, duy nhất) đi với 才. 除了…以外 + 都 = trừ ra (không tính); + 还 / 也 = ngoài ra còn (cộng thêm). 或者 dùng trong câu kể, 还是 dùng trong câu hỏi lựa chọn." },
      {
        type: "formula",
        rows: [
          { label: "Tăng tiến", pattern: "不但 A ， 而且 B", example: "他 不但 会 说 汉语 ， 而且 说 得 很 好 。" },
          { label: "Điều kiện đủ", pattern: "只要 A ， 就 B", example: "只要 你 努力 ， 就 能 学 好 。" },
          { label: "Điều kiện duy nhất", pattern: "只有 A ， 才 B", example: "只有 多 练习 ， 才 能 提高 水平 。" },
          { label: "Giả thiết", pattern: "如果 A (的话) ， 就 B", example: "如果 明天 下雨 的话 ， 我们 就 不 去 了 。" },
          { label: "Loại trừ", pattern: "除了 A 以外 ， … 都 …", example: "除了 他 以外 ， 大家 都 来 了 。" },
          { label: "Bổ sung", pattern: "除了 A 以外 ， … 还 …", example: "除了 汉语 以外 ， 我 还 学 数学 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "这 家 饭店 的 菜 不但 好吃 ， 而且 很 便宜 。", vi: "Món ở nhà hàng này không những ngon mà còn rẻ." },
          { zh: "只要 有 时间 ， 我 就 去 锻炼 。", vi: "Chỉ cần có thời gian là tôi đi tập." },
          { zh: "你 可以 坐 地铁 或者 坐 出租车 。", vi: "Bạn có thể đi tàu điện ngầm hoặc đi taxi." },
          { zh: "你 喝 茶 还是 喝 咖啡 ？", vi: "Bạn uống trà hay cà phê?" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "只要 你 努力 ， 才 能 学 好 。", right: "只要 你 努力 ， 就 能 学 好 。", why: "只要 đi với 就; 只有 mới đi với 才." },
          { wrong: "你 喝 茶 或者 喝 咖啡 ？", right: "你 喝 茶 还是 喝 咖啡 ？", why: "Câu hỏi lựa chọn dùng 还是; 或者 dùng trong câu kể." },
        ],
      },
    ],
    quiz: [
      { id: "h3cc-1", type: "mcq", zhPrompt: true, prompt: "只有 多 练习 ， ___ 能 提高 水平 。", options: ["才", "就", "都"], answer: 0, explanation: "只有 … 才 …" },
      { id: "h3cc-2", type: "mcq", zhPrompt: true, prompt: "只要 你 努力 ， ___ 能 学 好 。", options: ["才", "就", "还"], answer: 1, explanation: "只要 … 就 …" },
      { id: "h3cc-3", type: "mcq", zhPrompt: true, prompt: "除了 他 以外 ， 大家 ___ 来 了 。", options: ["都", "还", "才"], answer: 0, explanation: "Trừ anh ấy ra, mọi người ĐỀU đến → 都." },
      { id: "h3cc-4", type: "mcq", zhPrompt: true, prompt: "你 喝 茶 ___ 喝 咖啡 ？", options: ["还是", "或者", "而且"], answer: 0, explanation: "Câu hỏi lựa chọn → 还是." },
      { id: "h3cc-5", type: "order", vi: "Ngoài tiếng Trung ra, tôi còn học toán.", answers: ["除了 汉语 以外 ， 我 还 学 数学 。"], explanation: "除了…以外 + 还 = cộng thêm." },
      { id: "h3cc-6", type: "order", vi: "Nếu mai trời mưa thì chúng ta không đi nữa.", answers: ["如果 明天 下雨 的话 ， 我们 就 不 去 了 。"], explanation: "如果 … 的话 ， 就 …" },
    ],
  },
  {
    id: "sequence-actions",
    level: 3,
    title: "一边…一边, 先…然后, 一…就, …以后 / …的时候",
    points: ["一边…一边 · vừa… vừa", "先…再 / 然后 · trước… sau đó", "一…就 · vừa… là", "…以前 / 以后 / 的时候 · trước / sau / khi"],
    intro: "Vừa ăn vừa xem TV, tắm trước rồi ngủ, vừa về đến nhà là gọi điện.",
    blocks: [
      { type: "summary", text: "Hai hành động cùng lúc của MỘT người: 一边 V1 一边 V2. Trình tự: 先 V1 ， 再 / 然后 V2 (再 cho việc chưa làm, 然后 dùng được cả khi kể). Ngay sau: 一 V1 就 V2. Mốc thời gian 以前 / 以后 / 的时候 đứng SAU sự việc, khác tiếng Việt (\"sau khi tan học\" = 下课以后)." },
      {
        type: "formula",
        rows: [
          { label: "Cùng lúc", pattern: "一边 + V1 + 一边 + V2", example: "他 一边 吃 饭 一边 看 电视 。" },
          { label: "Trình tự", pattern: "先 + V1 ， 然后 / 再 + V2", example: "我 先 洗澡 ， 然后 睡觉 。" },
          { label: "Ngay sau", pattern: "一 + V1 + 就 + V2", example: "他 一 到 家 就 给 我 打电话 。" },
          { label: "Mốc thời gian", pattern: "Sự việc + 以前 / 以后 / 的 时候", example: "下课 以后 ， 我 去 图书馆 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我们 先 吃 饭 再 去 看 电影 吧 。", vi: "Chúng ta ăn cơm trước rồi đi xem phim nhé." },
          { zh: "吃 饭 的 时候 ， 别 看 手机 。", vi: "Lúc ăn cơm đừng xem điện thoại." },
          { zh: "睡觉 以前 ， 我 要 刷 牙 。", vi: "Trước khi ngủ tôi phải đánh răng." },
          { zh: "今天 又 下雨 又 刮 风 。", vi: "Hôm nay vừa mưa vừa có gió." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "以后 下课 ， 我 去 图书馆 。", right: "下课 以后 ， 我 去 图书馆 。", why: "以后 đứng SAU sự việc làm mốc." },
          { wrong: "今天 一边 下雨 一边 刮 风 。", right: "今天 又 下雨 又 刮 风 。", why: "一边…一边 dùng cho hành động chủ ý của người; hiện tượng / tính chất song song dùng 又…又." },
        ],
      },
    ],
    quiz: [
      { id: "h3sq-1", type: "mcq", zhPrompt: true, prompt: "他 一边 吃 饭 ___ 看 电视 。", options: ["一边", "就", "然后"], answer: 0, explanation: "一边 … 一边 …" },
      { id: "h3sq-2", type: "mcq", zhPrompt: true, prompt: "他 一 到 家 ___ 给 我 打电话 。", options: ["就", "才", "再"], answer: 0, explanation: "一 … 就 …: vừa… là." },
      { id: "h3sq-3", type: "mcq", prompt: "\"Sau khi tan học, tôi đến thư viện\" là?", options: ["下课 以后 ， 我 去 图书馆 。", "以后 下课 ， 我 去 图书馆 。", "我 以后 去 图书馆 下课 。"], answer: 0, explanation: "Sự việc + 以后." },
      { id: "h3sq-4", type: "mcq", zhPrompt: true, prompt: "我 先 洗澡 ， ___ 睡觉 。", options: ["然后", "一边", "以前"], answer: 0, explanation: "先 … 然后 …" },
      { id: "h3sq-5", type: "order", vi: "Lúc ăn cơm đừng xem điện thoại.", answers: ["吃 饭 的 时候 ， 别 看 手机 。"], explanation: "Sự việc + 的时候." },
      { id: "h3sq-6", type: "order", vi: "Chúng ta ăn cơm trước rồi đi xem phim nhé.", answers: ["我们 先 吃 饭 再 去 看 电影 吧 。"], explanation: "先 V1 再 V2 cho việc sắp làm." },
    ],
  },
  {
    id: "adverbs-again-degree",
    level: 3,
    title: "又, 再, 还; 极了, 挺…的, 有一点儿",
    points: ["副词 又 / 再 / 还 · lại, nữa", "程度 极了 · cực kỳ", "挺…的 · khá là", "有一点儿 vs 一点儿 · hơi / một chút"],
    intro: "Hôm qua đến, hôm nay lại đến; mai đến nữa nhé. Ngon cực, khá lạnh, hơi đắt.",
    blocks: [
      { type: "summary", text: "又 = lại (việc lặp lại ĐÃ xảy ra). 再 = nữa, lại (việc lặp lại CHƯA xảy ra). 还 = vẫn / còn, và 还 + 想 / 要 + 再 cho mong muốn làm thêm. Mức độ: Adj + 极了 (cực kỳ), 挺 + Adj + 的 (khá là, khẩu ngữ). 有一点儿 + Adj (hơi… — thường điều không vừa ý) đứng TRƯỚC tính từ; Adj + 一点儿 (… hơn một chút, so sánh / yêu cầu) đứng SAU." },
      {
        type: "compare",
        title: "又 · 再 · 还",
        headers: ["Từ", "Khi nào", "Ví dụ"],
        rows: [
          ["又", "đã lặp lại", "他昨天来了，今天又来了。"],
          ["再", "sẽ lặp lại", "明天再来吧。"],
          ["还", "vẫn / còn muốn thêm", "我还想再吃一碗。"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "这 个 菜 好吃 极 了 。", vi: "Món này ngon cực kỳ." },
          { zh: "今天 挺 冷 的 。", vi: "Hôm nay khá lạnh." },
          { zh: "这 件 衣服 有一点儿 贵 。", vi: "Bộ này hơi đắt." },
          { zh: "能 便宜 一点儿 吗 ？", vi: "Rẻ hơn một chút được không?" },
          { zh: "我 还 想 再 吃 一 碗 。", vi: "Tôi còn muốn ăn thêm một bát nữa." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 明天 又 来 。", right: "我 明天 再 来 。", why: "Việc chưa xảy ra → 再." },
          { wrong: "这 件 衣服 一点儿 贵 。", right: "这 件 衣服 有一点儿 贵 。", why: "\"Hơi…\" trước tính từ là 有一点儿; 一点儿 đứng sau tính từ." },
        ],
      },
    ],
    quiz: [
      { id: "h3ad-1", type: "mcq", zhPrompt: true, prompt: "他 昨天 来 了 ， 今天 ___ 来 了 。", options: ["又", "再", "还"], answer: 0, explanation: "Đã lặp lại → 又." },
      { id: "h3ad-2", type: "mcq", zhPrompt: true, prompt: "今天 太 晚 了 ， 明天 ___ 来 吧 。", options: ["又", "再", "才"], answer: 1, explanation: "Chưa xảy ra → 再." },
      { id: "h3ad-3", type: "mcq", zhPrompt: true, prompt: "这 件 衣服 ___ 贵 。", options: ["有一点儿", "一点儿", "极 了"], answer: 0, explanation: "Hơi… (không vừa ý) → 有一点儿 + Adj." },
      { id: "h3ad-4", type: "mcq", prompt: "Câu nào SAI?", options: ["这 个 菜 好吃 极 了 。", "今天 挺 冷 的 。", "能 一点儿 便宜 吗 ？"], answer: 2, explanation: "一点儿 đứng sau tính từ: 便宜一点儿." },
      { id: "h3ad-5", type: "order", vi: "Tôi còn muốn ăn thêm một bát nữa.", answers: ["我 还 想 再 吃 一 碗 。"], explanation: "还 + 想 + 再 + V." },
      { id: "h3ad-6", type: "order", vi: "Món này ngon cực kỳ.", answers: ["这 个 菜 好吃 极 了 。"], explanation: "Adj + 极了." },
    ],
  },
  {
    id: "question-words-indefinite",
    level: 3,
    title: "谁都, 什么都, 哪儿也: đại từ nghi vấn không dùng để hỏi",
    points: ["疑问 代词 任指 · đại từ nghi vấn chỉ \"bất kỳ\"", "疑问 代词 连用 · 什么…什么"],
    intro: "Chẳng muốn ăn gì cả, ai cũng quen, cuối tuần chẳng đi đâu.",
    blocks: [
      { type: "summary", text: "Từ để hỏi (谁, 什么, 哪儿, 怎么) + 都 / 也 = \"ai cũng, gì cũng, đâu cũng\"; với phủ định = \"không ai, không gì, không đâu\". Thứ tự: TỪ ĐỂ HỎI đứng TRƯỚC 都 / 也. Dùng hai lần trong một câu thì hai từ chỉ cùng một đối tượng: 你想吃什么，就吃什么 (muốn ăn gì thì ăn nấy)." },
      {
        type: "formula",
        rows: [
          { label: "Bất kỳ", pattern: "谁 / 什么 / 哪儿 + 都 + V", example: "他 谁 都 认识 。" },
          { label: "Không… gì cả", pattern: "什么 / 哪儿 + 都 / 也 + 不 / 没有 + V", example: "我 什么 都 不 想 吃 。" },
          { label: "Thế nào cũng không", pattern: "怎么 + V + 也 + V 不 C", example: "这 个 字 我 怎么 写 也 写 不 好 。" },
          { label: "Gì thì nấy", pattern: "… 什么 ， 就 … 什么", example: "你 想 吃 什么 ， 就 吃 什么 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "周末 我 哪儿 也 没有 去 。", vi: "Cuối tuần tôi chẳng đi đâu cả." },
          { zh: "这 件 事 谁 都 不 知道 。", vi: "Chuyện này không ai biết." },
          { zh: "谁 先 来 ， 谁 先 吃 。", vi: "Ai đến trước thì người đó ăn trước." },
          { zh: "他 什么 时候 都 很 忙 。", vi: "Lúc nào anh ấy cũng bận." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 都 什么 不 想 吃 。", right: "我 什么 都 不 想 吃 。", why: "Từ để hỏi đứng trước 都 / 也." },
          { wrong: "我 不 想 吃 什么 都 。", right: "我 什么 都 不 想 吃 。", why: "Cụm 什么都 đứng trước động từ, không đặt cuối câu." },
        ],
      },
    ],
    quiz: [
      { id: "h3qw-1", type: "mcq", prompt: "\"Tôi chẳng muốn ăn gì cả\" là?", options: ["我 什么 都 不 想 吃 。", "我 都 什么 不 想 吃 。", "我 不 想 吃 什么 都 。"], answer: 0, explanation: "什么 + 都 + 不 + V." },
      { id: "h3qw-2", type: "mcq", zhPrompt: true, prompt: "他 ___ 都 认识 。", options: ["谁", "什么", "怎么"], answer: 0, explanation: "Ai anh ấy cũng quen → 谁都." },
      { id: "h3qw-3", type: "mcq", zhPrompt: true, prompt: "这 个 字 我 怎么 写 ___ 写 不 好 。", options: ["也", "就", "才"], answer: 0, explanation: "怎么 + V + 也 + V不C." },
      { id: "h3qw-4", type: "mcq", prompt: "\"你 想 吃 什么 ， 就 吃 什么 。\" nghĩa là?", options: ["Bạn muốn ăn gì thì ăn nấy.", "Bạn muốn ăn gì vậy?", "Bạn không được ăn gì."], answer: 0, explanation: "Hai 什么 chỉ cùng một thứ." },
      { id: "h3qw-5", type: "order", vi: "Cuối tuần tôi chẳng đi đâu cả.", answers: ["周末 我 哪儿 也 没有 去 。", "我 周末 哪儿 也 没有 去 。"], explanation: "哪儿 + 也 + 没有 + V." },
      { id: "h3qw-6", type: "order", vi: "Chuyện này không ai biết.", answers: ["这 件 事 谁 都 不 知道 。"], explanation: "谁 + 都 + 不 + V." },
    ],
  },
  {
    id: "prepositions-purpose-topic",
    level: 3,
    title: "为了, 为, 关于, 根据, 向, 对",
    points: ["介词 为了 / 为 · để, vì, cho", "介词 关于 · về (chủ đề)", "介词 根据 · căn cứ vào", "介词 向 · về phía, với", "介词 对 · đối với"],
    intro: "Để học tốt tiếng Trung, sách về lịch sử, theo bản đồ, hỏi thầy giáo, tốt cho sức khoẻ.",
    blocks: [
      { type: "summary", text: "Như mọi giới từ tiếng Trung, cụm giới từ đứng TRƯỚC động từ (hoặc đầu câu). 为了 + mục đích (để…), 为 + người (vì / cho ai). 关于 + chủ đề, hay làm định ngữ: 关于…的书. 根据 + căn cứ. 向 + hướng / người (hướng tới, với). 对 + đối tượng: 对…很好 / 对…感兴趣 / 对…热情." },
      {
        type: "formula",
        rows: [
          { label: "Mục đích", pattern: "为了 + Mục đích ， Chủ ngữ + V", example: "为了 学 好 汉语 ， 他 每 天 都 练习 。" },
          { label: "Vì ai", pattern: "为 + Người + V", example: "妈妈 为 我 做 了 一 个 蛋糕 。" },
          { label: "Chủ đề", pattern: "关于 + Chủ đề + 的 + Danh từ", example: "这 是 一 本 关于 中国 历史 的 书 。" },
          { label: "Căn cứ", pattern: "根据 + Căn cứ ， …", example: "根据 这 张 地图 ， 我们 应该 往 东 走 。" },
          { label: "Đối với", pattern: "A + 对 + B + Adj / 感兴趣", example: "我 对 中国 文化 很 感兴趣 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 向 老师 问 了 一 个 问题 。", vi: "Tôi hỏi thầy giáo một câu." },
          { zh: "运动 对 身体 很 好 。", vi: "Vận động rất tốt cho sức khoẻ." },
          { zh: "他 对 我 很 热情 。", vi: "Anh ấy rất nhiệt tình với tôi." },
          { zh: "关于 这 件 事 ， 我 还 要 再 想 想 。", vi: "Về chuyện này, tôi còn phải nghĩ thêm." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 感兴趣 中国 文化 。", right: "我 对 中国 文化 很 感兴趣 。", why: "感兴趣 không mang tân ngữ trực tiếp — dùng 对 + đối tượng + 感兴趣." },
          { wrong: "他 很 热情 对 我 。", right: "他 对 我 很 热情 。", why: "Cụm giới từ đứng trước tính từ / động từ." },
        ],
      },
    ],
    quiz: [
      { id: "h3pp-1", type: "mcq", zhPrompt: true, prompt: "我 ___ 中国 文化 很 感兴趣 。", options: ["对", "向", "为"], answer: 0, explanation: "对 + đối tượng + 感兴趣." },
      { id: "h3pp-2", type: "mcq", zhPrompt: true, prompt: "___ 学 好 汉语 ， 他 每 天 都 练习 。", options: ["为了", "关于", "根据"], answer: 0, explanation: "Mục đích → 为了." },
      { id: "h3pp-3", type: "mcq", zhPrompt: true, prompt: "这 是 一 本 ___ 中国 历史 的 书 。", options: ["关于", "对", "向"], answer: 0, explanation: "Sách VỀ lịch sử → 关于…的书." },
      { id: "h3pp-4", type: "mcq", prompt: "Câu nào SAI?", options: ["运动 对 身体 很 好 。", "他 很 热情 对 我 。", "我 向 老师 问 了 一 个 问题 。"], answer: 1, explanation: "对我 phải đứng trước 很热情." },
      { id: "h3pp-5", type: "order", vi: "Mẹ làm cho tôi một cái bánh.", answers: ["妈妈 为 我 做 了 一 个 蛋糕 。"], explanation: "为 + người + V." },
      { id: "h3pp-6", type: "order", vi: "Theo tấm bản đồ này, chúng ta nên đi về phía đông.", answers: ["根据 这 张 地图 ， 我们 应该 往 东 走 。"], explanation: "根据 + căn cứ đứng đầu câu." },
    ],
  },
];
