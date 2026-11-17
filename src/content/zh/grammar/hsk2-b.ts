/**
 * Ngữ pháp HSK 2 — bài 7–11. Câu ví dụ chỉ dùng từ HSK 1–2 (test: src/content/zh/grammar.test.ts).
 */
import type { ZhGrammarLesson } from "./types";

export const HSK2_GRAMMAR_B: ZhGrammarLesson[] = [
  {
    id: "shi-de",
    level: 2,
    title: "是…的: nhấn mạnh thời gian, nơi chốn, cách thức",
    points: ["是…的 句 · câu 是…的 (nhấn mạnh việc đã xảy ra)"],
    intro: "Bạn đến khi nào? Đến bằng gì? Đến từ đâu? — hỏi chi tiết của việc đã xảy ra.",
    blocks: [
      { type: "summary", text: "Khi cả hai người đều biết việc ĐÃ xảy ra, muốn hỏi / nhấn mạnh CHI TIẾT (khi nào, ở đâu, bằng cách nào, với ai) thì đặt chi tiết đó giữa 是 và 的. 是 có thể lược bỏ trong câu khẳng định, nhưng phủ định phải là 不是 … 的. Không dùng 了 trong câu này." },
      {
        type: "formula",
        rows: [
          { label: "Khẳng định", pattern: "Chủ ngữ + (是) + Chi tiết + V + 的", example: "我 是 昨天 来 的 。" },
          { label: "Phủ định", pattern: "Chủ ngữ + 不 是 + Chi tiết + V + 的", example: "我 不 是 坐 飞机 来 的 。" },
          { label: "Hỏi", pattern: "Chủ ngữ + 是 + Từ để hỏi + V + 的？", example: "你 是 怎么 来 的 ？" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "你 是 什么 时候 来 的 ？", vi: "Bạn đến lúc nào? (việc đến đã xảy ra)" },
          { zh: "我 是 坐 地铁 来 的 。", vi: "Tôi đi tàu điện ngầm đến." },
          { zh: "他 是 跟 朋友 一起 去 的 。", vi: "Anh ấy đi cùng bạn." },
          { zh: "这 本 书 是 在 哪儿 买 的 ？", vi: "Quyển sách này mua ở đâu?" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 是 昨天 来 了 。", right: "我 是 昨天 来 的 。", why: "Câu 是…的 kết thúc bằng 的, không dùng 了." },
          { wrong: "我 没有 坐 飞机 来 的 。", right: "我 不 是 坐 飞机 来 的 。", why: "Phủ định câu 是…的 dùng 不是." },
        ],
      },
      { type: "tip", text: "Tình huống điển hình: gặp người mới đến — hỏi 你是什么时候来的？你是怎么来的？你是从哪儿来的？" },
    ],
    quiz: [
      { id: "h2sd-1", type: "mcq", zhPrompt: true, prompt: "你 是 怎么 来 ___ ？", options: ["的", "了", "过"], answer: 0, explanation: "Hỏi cách thức của việc đã xảy ra → 是…的." },
      { id: "h2sd-2", type: "mcq", prompt: "\"Tôi không đi máy bay đến\" là?", options: ["我 没有 坐 飞机 来 的 。", "我 不 是 坐 飞机 来 的 。", "我 是 不 坐 飞机 来 的 。"], answer: 1, explanation: "Phủ định: 不是 … 的." },
      { id: "h2sd-3", type: "mcq", prompt: "Câu nào SAI?", options: ["我 是 昨天 来 的 。", "我 是 昨天 来 了 。", "我 昨天 来 的 。"], answer: 1, explanation: "Câu 是…的 không dùng 了." },
      { id: "h2sd-4", type: "order", vi: "Tôi đi tàu điện ngầm đến.", answers: ["我 是 坐 地铁 来 的 。"], explanation: "是 + cách thức + V + 的." },
      { id: "h2sd-5", type: "order", vi: "Bạn đến lúc nào?", answers: ["你 是 什么 时候 来 的 ？"], explanation: "是 + 什么时候 + 来 + 的?" },
      { id: "h2sd-6", type: "order", vi: "Quyển sách này mua ở đâu?", answers: ["这 本 书 是 在 哪儿 买 的 ？"], explanation: "是 + 在哪儿 + 买 + 的?" },
    ],
  },
  {
    id: "conjunction-pairs",
    level: 2,
    title: "因为…所以, 虽然…但是, 还是, 就",
    points: ["因为…所以 · quan hệ nhân quả", "虽然…但是 · quan hệ tương phản", "还是 · câu hỏi lựa chọn", "就 · \"thì\" nối hai việc"],
    intro: "Vì … nên, tuy … nhưng, A hay B, hễ … thì.",
    blocks: [
      { type: "summary", text: "Tiếng Trung thích dùng CẶP liên từ: 因为 … 所以 … (vì … nên …), 虽然 … 但是 … (tuy … nhưng …) — khác tiếng Anh (không dùng although … but), tiếng Trung DÙNG CẢ HAI. Hỏi lựa chọn \"A hay B\" dùng 还是 (không dùng 吗). 就 đứng trước động từ ở vế sau: \"thì\"." },
      {
        type: "formula",
        rows: [
          { label: "Nhân quả", pattern: "因为 + Nguyên nhân ， 所以 + Kết quả", example: "因为 下雨 ， 所以 我 没有 去 。" },
          { label: "Tương phản", pattern: "虽然 + A ， 但是 + B", example: "虽然 很 累 ， 但是 我 很 高兴 。" },
          { label: "Lựa chọn", pattern: "A + 还是 + B ？", example: "你 喝 茶 还是 喝 咖啡 ？" },
          { label: "Thì (kết quả ngay)", pattern: "Điều kiện ， Chủ ngữ + 就 + V", example: "你 累 了 就 休息 吧 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "因为 他 生病 了 ， 所以 今天 没有 来 。", vi: "Vì anh ấy ốm nên hôm nay không đến." },
          { zh: "虽然 汉字 不 好 写 ， 但是 很 有意思 。", vi: "Tuy chữ Hán khó viết nhưng rất thú vị." },
          { zh: "你 是 中国 人 还是 越南|Yuè-nán 人 ？", vi: "Bạn là người Trung Quốc hay người Việt Nam?" },
          { zh: "我 下班 了 就 回 家 。", vi: "Tôi tan làm là về nhà ngay." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "你 喝 茶 还是 喝 咖啡 吗 ？", right: "你 喝 茶 还是 喝 咖啡 ？", why: "Câu hỏi lựa chọn với 还是 đã là câu hỏi, không thêm 吗." },
          { wrong: "所以 下雨 ， 因为 我 没有 去 。", right: "因为 下雨 ， 所以 我 没有 去 。", why: "因为 đi với nguyên nhân (vế trước), 所以 đi với kết quả (vế sau)." },
        ],
      },
    ],
    quiz: [
      { id: "h2cj-1", type: "mcq", zhPrompt: true, prompt: "因为 下雨 ， ___ 我 没有 去 。", options: ["所以", "但是", "还是"], answer: 0, explanation: "因为 … 所以 …" },
      { id: "h2cj-2", type: "mcq", zhPrompt: true, prompt: "虽然 很 累 ， ___ 我 很 高兴 。", options: ["所以", "但是", "就"], answer: 1, explanation: "虽然 … 但是 …" },
      { id: "h2cj-3", type: "mcq", zhPrompt: true, prompt: "你 喝 茶 ___ 喝 咖啡 ？", options: ["还是", "和", "也"], answer: 0, explanation: "Hỏi lựa chọn → 还是." },
      { id: "h2cj-4", type: "mcq", prompt: "Câu nào SAI?", options: ["你 去 还是 不 去 ？", "你 去 还是 不 去 吗 ？", "你 喝 茶 还是 喝 水 ？"], answer: 1, explanation: "Câu có 还是 không thêm 吗." },
      { id: "h2cj-5", type: "order", vi: "Vì anh ấy ốm nên hôm nay không đến.", answers: ["因为 他 生病 了 ， 所以 今天 没有 来 。"], explanation: "因为 + nguyên nhân, 所以 + kết quả." },
      { id: "h2cj-6", type: "order", vi: "Bạn mệt thì nghỉ đi.", answers: ["你 累 了 就 休息 吧 。"], explanation: "就 đứng trước động từ vế sau." },
    ],
  },
  {
    id: "prepositions-distance-direction",
    level: 2,
    title: "从…到, 离, 往, 跟: từ đâu đến đâu, cách bao xa, đi hướng nào",
    points: ["介词 从 / 到 · từ … đến", "介词 离 · cách (khoảng cách)", "介词 往 · hướng về", "介词 跟 · với"],
    intro: "Hỏi đường, nói khoảng cách và lịch trình.",
    blocks: [
      { type: "summary", text: "Giới từ + tân ngữ luôn đứng TRƯỚC động từ chính (giống 在). 从 A 到 B: từ A đến B (nơi chốn hoặc thời gian). A 离 B + 远 / 近: A cách B xa / gần. 往 + phương hướng + V: đi về hướng… 跟 + người + V: làm cùng ai." },
      {
        type: "formula",
        rows: [
          { label: "Từ … đến", pattern: "从 + A + 到 + B (+ V)", example: "我 从 八 点 到 五 点 上班 。" },
          { label: "Khoảng cách", pattern: "A + 离 + B + 远 / 近", example: "我 家 离 学校 很 近 。" },
          { label: "Hướng", pattern: "往 + 左 / 右 / 前 + V", example: "往 前 走 ， 再 往 左 。" },
          { label: "Cùng ai", pattern: "跟 + Người + (一起) + V", example: "我 跟 朋友 一起 去 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "从 我 家 到 公司 要 多 长 时间 ？", vi: "Từ nhà tôi đến công ty mất bao lâu?" },
          { zh: "机场 离 这儿 远 吗 ？", vi: "Sân bay cách đây có xa không?" },
          { zh: "你 往 右 走 ， 药店 就 在 旁边 。", vi: "Bạn đi về bên phải, hiệu thuốc ở ngay bên cạnh." },
          { zh: "我 想 跟 你 说 一 件 事 。", vi: "Tôi muốn nói với bạn một chuyện." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 家 很 近 离 学校 。", right: "我 家 离 学校 很 近 。", why: "离 + điểm mốc đứng trước 近 / 远." },
          { wrong: "我 走 往 前 。", right: "我 往 前 走 。", why: "Giới từ 往 + hướng đứng trước động từ." },
          { wrong: "我 去 跟 朋友 。", right: "我 跟 朋友 去 。", why: "跟 + người đứng trước động từ." },
        ],
      },
    ],
    quiz: [
      { id: "h2pp-1", type: "mcq", zhPrompt: true, prompt: "我 家 ___ 学校 很 近 。", options: ["离", "从", "往"], answer: 0, explanation: "Khoảng cách: A 离 B + 近." },
      { id: "h2pp-2", type: "mcq", zhPrompt: true, prompt: "___ 前 走 ， 再 往 左 。", options: ["往", "离", "跟"], answer: 0, explanation: "Hướng đi: 往 + 前." },
      { id: "h2pp-3", type: "mcq", zhPrompt: true, prompt: "我 从 八 点 ___ 五 点 上班 。", options: ["到", "离", "往"], answer: 0, explanation: "从 … 到 …" },
      { id: "h2pp-4", type: "mcq", prompt: "Câu nào ĐÚNG?", options: ["我 走 往 前 。", "我 往 前 走 。", "往 我 前 走 。"], answer: 1, explanation: "往 + hướng đứng trước động từ." },
      { id: "h2pp-5", type: "order", vi: "Sân bay cách đây có xa không?", answers: ["机场 离 这儿 远 吗 ？"], explanation: "A 离 B + 远 + 吗?" },
      { id: "h2pp-6", type: "order", vi: "Tôi đi cùng bạn bè.", answers: ["我 跟 朋友 一起 去 。"], explanation: "跟 + người + 一起 + V." },
    ],
  },
  {
    id: "aspect-time",
    level: 2,
    title: "已经…了, 快要…了, thời lượng (V 了 + thời gian), 一会儿",
    points: ["已经…了 · đã … rồi", "快要…了 · sắp … rồi", "时量补语 · bổ ngữ thời lượng", "一会儿 · một lát"],
    intro: "Đã … rồi, sắp … rồi, học bao lâu rồi.",
    blocks: [
      { type: "summary", text: "已经 + V + 了: đã … rồi. 快要 / 快 + V + 了: sắp … rồi (sắp xảy ra). Nói làm BAO LÂU: thời lượng đứng SAU động từ: V + 了 + thời lượng (学了两年). Thêm 了 ở cuối câu nữa nghĩa là việc vẫn còn tiếp tục: 我学汉语学了两年了." },
      {
        type: "formula",
        rows: [
          { label: "Đã … rồi", pattern: "已经 + V (+ Tân ngữ) + 了", example: "他 已经 走 了 。" },
          { label: "Sắp … rồi", pattern: "快要 / 快 + V / Tính từ + 了", example: "火车 快要 开 了 。" },
          { label: "Bao lâu", pattern: "V + 了 + Thời lượng", example: "我 等 了 一会儿 。" },
          { label: "Có tân ngữ", pattern: "V + Tân ngữ + V + 了 + Thời lượng", example: "我 学 汉语 学 了 两 年 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 已经 吃 饭 了 。", vi: "Tôi đã ăn cơm rồi." },
          { zh: "快要 下雨 了 ， 我们 回去 吧 。", vi: "Sắp mưa rồi, chúng ta về thôi." },
          { zh: "他 在 中国 住 了 三 年 。", vi: "Anh ấy đã sống ở Trung Quốc ba năm." },
          { zh: "请 等 一会儿 。", vi: "Xin đợi một lát." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 两 年 学 了 汉语 。", right: "我 学 了 两 年 汉语 。", why: "Thời lượng đứng SAU động từ (khác thời điểm — đứng trước)." },
          { wrong: "火车 快要 开 。", right: "火车 快要 开 了 。", why: "快要 … 了 đi thành cặp." },
        ],
      },
      { type: "tip", text: "Thời ĐIỂM (lúc nào) đứng trước động từ: 我八点来. Thời LƯỢNG (bao lâu) đứng sau động từ: 我等了一个小时." },
    ],
    quiz: [
      { id: "h2at-1", type: "mcq", zhPrompt: true, prompt: "他 ___ 走 了 。", options: ["已经", "快要", "正在"], answer: 0, explanation: "Đã … rồi: 已经 … 了." },
      { id: "h2at-2", type: "mcq", zhPrompt: true, prompt: "火车 快要 开 ___ 。", options: ["了", "过", "着"], answer: 0, explanation: "快要 … 了." },
      { id: "h2at-3", type: "mcq", prompt: "\"Tôi đã học tiếng Trung hai năm\" là?", options: ["我 两 年 学 了 汉语 。", "我 学 了 两 年 汉语 。", "我 学 汉语 两 年 了 学 。"], answer: 1, explanation: "Thời lượng sau động từ: 学了两年汉语." },
      { id: "h2at-4", type: "mcq", zhPrompt: true, prompt: "请 等 ___ 。", options: ["一会儿", "一点儿", "已经"], answer: 0, explanation: "Đợi một lát → 一会儿 (thời gian)." },
      { id: "h2at-5", type: "order", vi: "Sắp mưa rồi, chúng ta về thôi.", answers: ["快要 下雨 了 ， 我们 回去 吧 。"], explanation: "快要 … 了 + 回去 + 吧." },
      { id: "h2at-6", type: "order", vi: "Anh ấy đã sống ở Trung Quốc ba năm.", answers: ["他 在 中国 住 了 三 年 。"], explanation: "在 + nơi + V + 了 + thời lượng." },
    ],
  },
  {
    id: "rang-bie-duo",
    level: 2,
    title: "让 (bảo ai làm gì), 别 (đừng), 多 + tính từ (bao nhiêu), 怎么 (cách làm)",
    points: ["兼语句 让 · câu kiêm ngữ với 让", "否定祈使 别 · cầu khiến phủ định", "多 + 形容词 · hỏi mức độ", "怎么 + V · hỏi cách thức"],
    intro: "Mẹ bảo tôi về nhà · Đừng đi · Bạn cao bao nhiêu · Đi thế nào?",
    blocks: [
      { type: "summary", text: "A 让 B + V: A bảo / cho / để B làm gì (B vừa là tân ngữ của 让, vừa là chủ ngữ của V). 别 + V (+ 了): đừng … (thân mật hơn 不要). Hỏi mức độ: (有) 多 + 大 / 高 / 长 / 远? — bao nhiêu tuổi / cao bao nhiêu / dài bao lâu / xa bao nhiêu. Hỏi cách làm: 怎么 + V?" },
      {
        type: "formula",
        rows: [
          { label: "Bảo ai làm gì", pattern: "A + 让 + B + V", example: "妈妈 让 我 早 一点儿 回来 。" },
          { label: "Đừng", pattern: "别 + V (+ 了)", example: "别 说话 了 ！" },
          { label: "Bao nhiêu", pattern: "Chủ ngữ + 多 + Tính từ？", example: "你 多 大 ？" },
          { label: "Làm thế nào", pattern: "怎么 + V？", example: "去 机场 怎么 走 ？" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "老师 让 我们 写 汉字 。", vi: "Thầy giáo bảo chúng tôi viết chữ Hán." },
          { zh: "别 忘 了 拿 手机 。", vi: "Đừng quên cầm điện thoại." },
          { zh: "你 个子 多 高 ？", vi: "Bạn cao bao nhiêu?" },
          { zh: "从 这儿 到 车站 多 远 ？", vi: "Từ đây đến bến xe bao xa?" },
          { zh: "这 个 字 怎么 读 ？", vi: "Chữ này đọc thế nào?" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "妈妈 让 我 回来 早 。", right: "妈妈 让 我 早 一点儿 回来 。", why: "Trạng ngữ (早一点儿) đứng trước động từ." },
          { wrong: "你 几 高 ？", right: "你 多 高 ？", why: "Hỏi mức độ của tính từ dùng 多, không dùng 几." },
        ],
      },
    ],
    quiz: [
      { id: "h2rb-1", type: "mcq", zhPrompt: true, prompt: "老师 ___ 我们 写 汉字 。", options: ["让", "别", "多"], answer: 0, explanation: "Bảo ai làm gì → 让." },
      { id: "h2rb-2", type: "mcq", zhPrompt: true, prompt: "___ 说话 了 ， 上课 了 ！", options: ["别", "让", "没|méi"], answer: 0, explanation: "Đừng … → 别." },
      { id: "h2rb-3", type: "mcq", zhPrompt: true, prompt: "从 这儿 到 车站 ___ 远 ？", options: ["多", "几", "怎么"], answer: 0, explanation: "Hỏi mức độ: 多 + 远." },
      { id: "h2rb-4", type: "mcq", zhPrompt: true, prompt: "这 个 字 ___ 读 ？", options: ["怎么", "多", "什么"], answer: 0, explanation: "Hỏi cách làm: 怎么 + V." },
      { id: "h2rb-5", type: "order", vi: "Mẹ bảo tôi về sớm một chút.", answers: ["妈妈 让 我 早 一点儿 回来 。"], explanation: "A 让 B + trạng ngữ + V." },
      { id: "h2rb-6", type: "order", vi: "Bạn cao bao nhiêu?", answers: ["你 多 高 ？"], explanation: "多 + 高." },
    ],
  },
];
