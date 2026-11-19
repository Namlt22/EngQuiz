/**
 * Ngữ pháp HSK 4 — bài 1–6: 连…都 / 甚至, câu nhượng bộ, 既然 / 既…又 / 不仅, nhân quả văn viết,
 * câu khiến 使 / 让, câu hỏi tu từ. Câu ví dụ chỉ dùng từ HSK 1–4 (test: src/content/zh/grammar.test.ts).
 */
import type { ZhGrammarLesson } from "./types";

export const HSK4_GRAMMAR_A: ZhGrammarLesson[] = [
  {
    id: "lian-dou",
    level: 4,
    title: "连…都 / 也 và 甚至: ngay cả, thậm chí",
    points: ["连…都 / 也 · ngay cả… cũng", "甚至 · thậm chí"],
    intro: "Ngay cả tên mình cũng quên, thậm chí không ăn cơm — nhấn mạnh trường hợp cực đoan.",
    blocks: [
      { type: "summary", text: "连 + phần được nhấn mạnh + 都 / 也 + V: \"ngay cả … cũng\". Phần sau 连 là trường hợp ÍT ngờ nhất, nên cả câu ngầm ý \"huống chi cái khác\". Phần được nhấn mạnh có thể là chủ ngữ, tân ngữ (đưa lên trước động từ) hoặc số lượng nhỏ nhất (一 + lượng từ, thường đi với phủ định). 甚至 = thậm chí, đứng trước phần cực đoan, có thể kết hợp: 甚至连…都…" },
      {
        type: "formula",
        rows: [
          { label: "Nhấn chủ ngữ", pattern: "连 + Chủ ngữ + 都 / 也 + V", example: "这 个 问题 连 老师 都 不 知道 。" },
          { label: "Nhấn tân ngữ", pattern: "Chủ ngữ + 连 + Tân ngữ + 都 / 也 + V", example: "他 忙 得 连 饭 都 没有 吃 。" },
          { label: "Số lượng nhỏ nhất", pattern: "连 + 一 + Lượng từ + Danh từ + 都 / 也 + 没 / 不", example: "我 连 一 分 钱 也 没有 。" },
          { label: "Thậm chí", pattern: "A ， 甚至 B", example: "他 很 喜欢 中国 文化 ， 甚至 自学 了 京剧 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "这么 简单 的 题 ， 连 孩子 都 会 做 。", vi: "Đề dễ thế này, ngay cả trẻ con cũng làm được." },
          { zh: "我 太 累 了 ， 连 电视 都 不 想 看 。", vi: "Tôi mệt quá, đến TV cũng không muốn xem." },
          { zh: "他 来 中国 三 年 了 ， 连 一 次 饺子 也 没有 吃 过 。", vi: "Anh ấy sang Trung Quốc ba năm mà chưa ăn sủi cảo lần nào." },
          { zh: "雨 很 大 ， 有 的 地方 甚至 停 电 了 。", vi: "Mưa rất to, có nơi thậm chí còn mất điện." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "连 老师 不 知道 这 个 问题 。", right: "这 个 问题 连 老师 都 不 知道 。", why: "连 phải đi cùng 都 / 也 đứng trước động từ." },
          { wrong: "他 连 都 没有 吃 饭 。", right: "他 连 饭 都 没有 吃 。", why: "Phần được nhấn mạnh (饭) nằm giữa 连 và 都; tân ngữ chuyển lên trước động từ." },
        ],
      },
    ],
    quiz: [
      { id: "h4ld-1", type: "mcq", zhPrompt: true, prompt: "这 个 问题 连 老师 ___ 不 知道 。", options: ["都", "就", "才"], answer: 0, explanation: "连 … 都 / 也 …" },
      { id: "h4ld-2", type: "mcq", prompt: "\"Anh ấy bận đến mức không ăn cơm\" là?", options: ["他 忙 得 连 饭 都 没有 吃 。", "他 忙 得 连 都 没有 吃 饭 。", "他 连 忙 得 饭 没有 吃 。"], answer: 0, explanation: "连 + tân ngữ + 都 + 没有 + V." },
      { id: "h4ld-3", type: "mcq", zhPrompt: true, prompt: "他 很 喜欢 中国 文化 ， ___ 自学 了 京剧 。", options: ["甚至", "因此", "然而"], answer: 0, explanation: "Mức cao hơn, bất ngờ → 甚至." },
      { id: "h4ld-4", type: "mcq", prompt: "\"我 连 一 分 钱 也 没有 。\" nghĩa là?", options: ["Tôi không có lấy một xu.", "Tôi chỉ có một xu.", "Tôi có một ít tiền."], answer: 0, explanation: "连 + 一 + lượng từ + 也 + 没有: không có chút nào." },
      { id: "h4ld-5", type: "order", vi: "Đề dễ thế này, ngay cả trẻ con cũng làm được.", answers: ["这么 简单 的 题 ， 连 孩子 都 会 做 。"], explanation: "连 + chủ ngữ + 都 / 也 + V." },
      { id: "h4ld-6", type: "order", vi: "Tôi mệt quá, đến TV cũng không muốn xem.", answers: ["我 太 累 了 ， 连 电视 都 不 想 看 。"], explanation: "连 + 电视 + 都 + 不想看." },
    ],
  },
  {
    id: "concession",
    level: 4,
    title: "即使…也, 尽管…但是 / 却, 不管 / 无论…都",
    points: ["即使…也 · cho dù… cũng (giả định)", "尽管…但是 / 却 · mặc dù (sự thật)", "不管 / 无论…都 · bất kể"],
    intro: "Cho dù mưa cũng đi, mặc dù mệt nhưng vẫn làm, bất kể ai cũng phải xếp hàng.",
    blocks: [
      { type: "summary", text: "即使 nêu điều GIẢ ĐỊNH (có thể chưa xảy ra), vế sau dùng 也. 尽管 nêu điều CÓ THẬT, vế sau dùng 但是 / 可是 / 却 (却 là phó từ, đứng sau chủ ngữ). 不管 (khẩu ngữ) / 无论 (văn viết) + một tập hợp lựa chọn (từ để hỏi, A 还是 B, A 不 A), vế sau dùng 都 / 也: kết quả không đổi." },
      {
        type: "formula",
        rows: [
          { label: "Giả định", pattern: "即使 A ， (Chủ ngữ) 也 B", example: "即使 明天 下雨 ， 我们 也 要 去 。" },
          { label: "Sự thật", pattern: "尽管 A ， 但是 B / Chủ ngữ + 却 B", example: "尽管 很 累 ， 他 却 没有 休息 。" },
          { label: "Bất kể", pattern: "不管 / 无论 + Từ để hỏi / A 还是 B ， 都 / 也 B", example: "不管 谁 来 ， 都 要 排队 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "即使 你 不 同意 ， 我 也 要 试 一 试 。", vi: "Cho dù bạn không đồng ý, tôi cũng muốn thử." },
          { zh: "尽管 他 很 努力 ， 但是 成绩 还是 不 好 。", vi: "Mặc dù anh ấy rất cố gắng nhưng điểm vẫn không tốt." },
          { zh: "无论 工作 多么 忙 ， 他 每 天 都 去 健身房 。", vi: "Bất kể công việc bận đến đâu, ngày nào anh ấy cũng đi tập gym." },
          { zh: "不管 你 去 还是 不 去 ， 都 要 告诉 我 。", vi: "Dù bạn đi hay không, cũng phải báo tôi." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "不管 天气 很 冷 ， 他 都 去 跑步 。", right: "不管 天气 多么 冷 ， 他 都 去 跑步 。", why: "Sau 不管 / 无论 phải là một tập hợp khả năng (多么, 什么, A还是B), không phải một câu khẳng định." },
          { wrong: "尽管 很 累 ， 却 他 没有 休息 。", right: "尽管 很 累 ， 他 却 没有 休息 。", why: "却 là phó từ, đứng SAU chủ ngữ." },
        ],
      },
    ],
    quiz: [
      { id: "h4cs-1", type: "mcq", zhPrompt: true, prompt: "即使 明天 下雨 ， 我们 ___ 要 去 。", options: ["也", "却", "才"], answer: 0, explanation: "即使 … 也 …" },
      { id: "h4cs-2", type: "mcq", zhPrompt: true, prompt: "不管 谁 来 ， ___ 要 排队 。", options: ["都", "就", "而"], answer: 0, explanation: "不管 … 都 …" },
      { id: "h4cs-3", type: "mcq", prompt: "Câu nào SAI?", options: ["不管 天气 很 冷 ， 他 都 去 跑步 。", "不管 天气 多么 冷 ， 他 都 去 跑步 。", "无论 多么 忙 ， 他 都 去 健身房 。"], answer: 0, explanation: "Sau 不管 cần một tập hợp khả năng (多么 冷), không dùng 很 冷." },
      { id: "h4cs-4", type: "mcq", prompt: "So với 尽管, từ 即使 khác ở điểm nào?", options: ["Nêu điều giả định, chưa chắc xảy ra", "Chỉ dùng trong văn viết", "Không khác gì"], answer: 0, explanation: "即使 = cho dù (chưa chắc xảy ra); 尽管 = mặc dù (đã là sự thật)." },
      { id: "h4cs-5", type: "order", vi: "Mặc dù rất mệt, anh ấy lại không nghỉ.", answers: ["尽管 很 累 ， 他 却 没有 休息 。"], explanation: "尽管 …, chủ ngữ + 却 …" },
      { id: "h4cs-6", type: "order", vi: "Cho dù bạn không đồng ý, tôi cũng muốn thử.", answers: ["即使 你 不 同意 ， 我 也 要 试 一 试 。"], explanation: "即使 … 也 …" },
    ],
  },
  {
    id: "jiran-bujin",
    level: 4,
    title: "既然…就, 既…又, 不仅…而且 / 还, 并且",
    points: ["既然…就 · đã… thì", "既…又 / 也 · vừa… vừa", "不仅 / 不光…而且 / 还 · không những… mà còn", "并且 · và, đồng thời"],
    intro: "Đã đến rồi thì ở lại ăn cơm; vừa rẻ vừa ngon; không những biết hát mà còn biết đàn.",
    blocks: [
      { type: "summary", text: "既然 nêu một sự thật CẢ HAI BÊN ĐÃ BIẾT, vế sau rút ra kết luận / lời khuyên với 就 (đã… thì…). 既 A 又 B: vừa A vừa B (hai tính chất cùng tồn tại). 不仅 / 不光 … 而且 / 还 / 也 …: không những … mà còn … (vế sau mạnh hơn). 并且 nối hai động từ / hai vế cùng chủ ngữ, văn viết hơn 而且." },
      {
        type: "formula",
        rows: [
          { label: "Đã… thì", pattern: "既然 A ， (Chủ ngữ) 就 B", example: "既然 你 来 了 ， 就 在 这儿 吃 饭 吧 。" },
          { label: "Vừa… vừa", pattern: "既 + Adj/V + 又 + Adj/V", example: "这 家 餐厅 的 菜 既 便宜 又 好吃 。" },
          { label: "Không những", pattern: "不仅 A ， 而且 / 还 B", example: "她 不仅 会 唱 歌 ， 而且 会 弹 钢琴 。" },
          { label: "Và", pattern: "V1 + O1 ， 并且 + V2 + O2", example: "他 提出 了 问题 ， 并且 说明 了 原因 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "既然 你 不 舒服 ， 就 早 点 回 家 休息 吧 。", vi: "Đã không khoẻ thì về nhà nghỉ sớm đi." },
          { zh: "他 既 是 我 的 老师 ， 又 是 我 的 朋友 。", vi: "Ông ấy vừa là thầy, vừa là bạn của tôi." },
          { zh: "这 本 小说 不光 内容 丰富 ， 而且 语言 很 美 。", vi: "Cuốn tiểu thuyết này không chỉ nội dung phong phú mà ngôn ngữ còn rất đẹp." },
          { zh: "请 填写 这 张 表格 ， 并且 交 给 前面 的 人员 。", vi: "Hãy điền mẫu này và nộp cho nhân viên phía trước." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "既然 你 来 了 ， 才 在 这儿 吃 饭 吧 。", right: "既然 你 来 了 ， 就 在 这儿 吃 饭 吧 。", why: "既然 đi với 就." },
          { wrong: "这 家 餐厅 的 菜 既 便宜 而且 好吃 。", right: "这 家 餐厅 的 菜 既 便宜 又 好吃 。", why: "既 đi với 又 / 也; 而且 đi với 不仅." },
        ],
      },
    ],
    quiz: [
      { id: "h4jr-1", type: "mcq", zhPrompt: true, prompt: "既然 你 不 舒服 ， ___ 早 点 回 家 吧 。", options: ["就", "才", "却"], answer: 0, explanation: "既然 … 就 …" },
      { id: "h4jr-2", type: "mcq", zhPrompt: true, prompt: "这 家 餐厅 的 菜 既 便宜 ___ 好吃 。", options: ["又", "而且", "就"], answer: 0, explanation: "既 … 又 …" },
      { id: "h4jr-3", type: "mcq", zhPrompt: true, prompt: "她 不仅 会 唱 歌 ， ___ 会 弹 钢琴 。", options: ["而且", "否则", "因此"], answer: 0, explanation: "不仅 … 而且 …" },
      { id: "h4jr-4", type: "mcq", prompt: "既然 dùng khi nào?", options: ["Nêu sự thật đã biết rồi rút ra kết luận", "Nêu giả định chưa xảy ra", "Nêu hai việc trái ngược"], answer: 0, explanation: "既然 = đã (sự thật) … thì …" },
      { id: "h4jr-5", type: "order", vi: "Ông ấy vừa là thầy, vừa là bạn của tôi.", answers: ["他 既 是 我 的 老师 ， 又 是 我 的 朋友 。"], explanation: "既 是 … 又 是 …" },
      { id: "h4jr-6", type: "order", vi: "Đã đến rồi thì ở đây ăn cơm đi.", answers: ["既然 你 来 了 ， 就 在 这儿 吃 饭 吧 。"], explanation: "既然 … 就 …" },
    ],
  },
  {
    id: "cause-result-formal",
    level: 4,
    title: "由于…因此, 于是, 结果, 否则",
    points: ["由于…因此 / 所以 · do… vì vậy (văn viết)", "于是 · thế là", "结果 · kết quả là", "否则 · nếu không thì"],
    intro: "Do thời tiết xấu nên chuyến bay bị hoãn; thế là chúng tôi đi tàu; phải nhanh lên, nếu không sẽ muộn.",
    blocks: [
      { type: "summary", text: "由于 (do) trang trọng hơn 因为, hay đi với 因此 / 所以. 因此 đứng đầu vế sau, không đi với 因为 ở vế trước khi đã dùng 由于 cũng được. 于是 = thế là, nối hành động xảy ra TIẾP THEO do việc trước (chỉ dùng cho việc đã xảy ra). 结果 = kết quả là (thường điều không mong muốn). 否则 = nếu không thì (cảnh báo)." },
      {
        type: "formula",
        rows: [
          { label: "Nguyên nhân", pattern: "由于 A ， 因此 / 所以 B", example: "由于 天气 不 好 ， 因此 航班 推迟 了 。" },
          { label: "Thế là", pattern: "A ， 于是 B (đã xảy ra)", example: "地铁 停 了 ， 于是 我们 打车 回 家 。" },
          { label: "Kết quả là", pattern: "A ， 结果 B", example: "他 没有 复习 ， 结果 考试 没有 通过 。" },
          { label: "Nếu không", pattern: "A ， 否则 B", example: "快 走 吧 ， 否则 要 迟到 了 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "由于 堵车 ， 很 多 人 没有 按时 到 。", vi: "Do tắc đường, nhiều người không đến đúng giờ." },
          { zh: "他 看 到 了 招聘 广告 ， 于是 申请 了 这 份 工作 。", vi: "Anh ấy thấy quảng cáo tuyển dụng, thế là nộp đơn công việc này." },
          { zh: "我 本来 想 早 点 睡 ， 结果 看 视频 看 到 两 点 。", vi: "Tôi vốn định ngủ sớm, kết quả xem video đến hai giờ." },
          { zh: "你 要 带 身份证 ， 否则 不 能 登机 。", vi: "Bạn phải mang căn cước, nếu không thì không lên máy bay được." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "明天 下雨 ， 于是 我们 不 去 了 。", right: "明天 下雨 ， 所以 我们 不 去 了 。", why: "于是 chỉ dùng cho việc ĐÃ xảy ra tiếp nối; nhân quả chung dùng 所以 / 因此." },
          { wrong: "你 要 带 身份证 ， 否则 能 登机 。", right: "你 要 带 身份证 ， 否则 不 能 登机 。", why: "否则 nêu hậu quả xấu khi không làm — vế sau là điều không mong muốn." },
        ],
      },
    ],
    quiz: [
      { id: "h4cr-1", type: "mcq", zhPrompt: true, prompt: "由于 天气 不 好 ， ___ 航班 推迟 了 。", options: ["因此", "否则", "即使"], answer: 0, explanation: "由于 … 因此 …" },
      { id: "h4cr-2", type: "mcq", zhPrompt: true, prompt: "快 走 吧 ， ___ 要 迟到 了 。", options: ["否则", "于是", "由于"], answer: 0, explanation: "Cảnh báo: nếu không thì… → 否则." },
      { id: "h4cr-3", type: "mcq", zhPrompt: true, prompt: "地铁 停 了 ， ___ 我们 打车 回 家 。", options: ["于是", "否则", "尽管"], answer: 0, explanation: "Hành động tiếp nối đã xảy ra → 于是." },
      { id: "h4cr-4", type: "mcq", prompt: "Câu nào SAI?", options: ["明天 下雨 ， 于是 我们 不 去 了 。", "由于 堵车 ， 很 多 人 没有 按时 到 。", "他 没有 复习 ， 结果 考试 没有 通过 。"], answer: 0, explanation: "于是 không dùng cho việc chưa xảy ra." },
      { id: "h4cr-5", type: "order", vi: "Bạn phải mang căn cước, nếu không thì không lên máy bay được.", answers: ["你 要 带 身份证 ， 否则 不 能 登机 。"], explanation: "A ， 否则 + hậu quả." },
      { id: "h4cr-6", type: "order", vi: "Do tắc đường, nhiều người không đến đúng giờ.", answers: ["由于 堵车 ， 很 多 人 没有 按时 到 。"], explanation: "由于 + nguyên nhân." },
    ],
  },
  {
    id: "causative-shi-rang",
    level: 4,
    title: "Câu kiêm ngữ: 使, 让, 叫, 请 — khiến ai làm gì",
    points: ["兼语 句 · câu kiêm ngữ", "使 / 让 / 令 · khiến, làm cho"],
    intro: "Bộ phim làm tôi cảm động, bố mẹ bảo tôi học luật, công ty mời anh ấy đến phỏng vấn.",
    blocks: [
      { type: "summary", text: "Câu kiêm ngữ: tân ngữ của động từ thứ nhất đồng thời là chủ ngữ của động từ thứ hai: A + 让 / 叫 / 请 / 使 + B + V / Adj. 让 / 叫: bảo, để cho (khẩu ngữ). 请: mời, nhờ (lịch sự). 使: khiến, làm cho (văn viết, thường + tính từ / động từ tâm lý: 使人感动, 使他失望). Phủ định đặt TRƯỚC động từ thứ nhất: 不让, 没有叫." },
      {
        type: "formula",
        rows: [
          { label: "Bảo / để cho", pattern: "A + 让 / 叫 + B + V", example: "父母 让 我 学习 法律 。" },
          { label: "Mời", pattern: "A + 请 + B + V", example: "公司 请 他 来 面试 。" },
          { label: "Khiến", pattern: "A + 使 + B + Adj / V tâm lý", example: "这 个 消息 使 大家 很 吃惊 。" },
          { label: "Phủ định", pattern: "A + 不 / 没有 + 让 + B + V", example: "妈妈 不 让 我 吃 零食 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "这 部 电影 使 我 非常 感动 。", vi: "Bộ phim này làm tôi vô cùng cảm động." },
          { zh: "经理 叫 我 明天 去 出差 。", vi: "Giám đốc bảo tôi mai đi công tác." },
          { zh: "运动 可以 使 人 心情 愉快 。", vi: "Vận động có thể khiến người ta vui vẻ." },
          { zh: "对不起 ， 让 你 久 等 了 。", vi: "Xin lỗi, để bạn đợi lâu rồi." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "这 个 消息 使 吃惊 大家 。", right: "这 个 消息 使 大家 很 吃惊 。", why: "Người bị tác động (大家) đứng ngay sau 使, rồi mới đến tính từ / động từ." },
          { wrong: "妈妈 让 我 不 吃 零食 。", right: "妈妈 不 让 我 吃 零食 。", why: "\"Không cho phép\" → phủ định đặt trước 让." },
        ],
      },
    ],
    quiz: [
      { id: "h4cv-1", type: "mcq", zhPrompt: true, prompt: "这 部 电影 ___ 我 非常 感动 。", options: ["使", "被", "把"], answer: 0, explanation: "Khiến ai cảm thấy gì → 使 + người + tâm lý." },
      { id: "h4cv-2", type: "mcq", prompt: "\"Mẹ không cho tôi ăn vặt\" là?", options: ["妈妈 不 让 我 吃 零食 。", "妈妈 让 我 不 吃 零食 。", "妈妈 让 不 我 吃 零食 。"], answer: 0, explanation: "Phủ định trước 让." },
      { id: "h4cv-3", type: "mcq", zhPrompt: true, prompt: "公司 ___ 他 来 面试 。", options: ["请", "被", "对"], answer: 0, explanation: "Mời ai làm gì → 请." },
      { id: "h4cv-4", type: "mcq", prompt: "Câu nào SAI?", options: ["这 个 消息 使 吃惊 大家 。", "这 个 消息 使 大家 很 吃惊 。", "经理 叫 我 明天 去 出差 。"], answer: 0, explanation: "使 + người + tính từ." },
      { id: "h4cv-5", type: "order", vi: "Xin lỗi, để bạn đợi lâu rồi.", answers: ["对不起 ， 让 你 久 等 了 。"], explanation: "让 + người + V." },
      { id: "h4cv-6", type: "order", vi: "Bố mẹ bảo tôi học luật.", answers: ["父母 让 我 学习 法律 。"], explanation: "A + 让 + B + V." },
    ],
  },
  {
    id: "rhetorical-questions",
    level: 4,
    title: "Câu hỏi tu từ: 难道…吗, 不是…吗, 怎么 / 哪儿…",
    points: ["反问 句 · câu hỏi tu từ", "难道…吗 · lẽ nào", "不是…吗 · chẳng phải… sao"],
    intro: "Lẽ nào bạn không biết? Chẳng phải bạn đã nói rồi sao? — hỏi để khẳng định mạnh hơn.",
    blocks: [
      { type: "summary", text: "Câu hỏi tu từ không cần trả lời; nó KHẲNG ĐỊNH điều ngược với hình thức: câu hỏi phủ định = khẳng định mạnh, câu hỏi khẳng định = phủ định mạnh. 难道 … 吗 (lẽ nào …?) thể hiện ngạc nhiên / trách. 不是 … 吗 (chẳng phải … sao?) nhắc điều người nghe đã biết. 怎么 / 哪儿 + V (làm sao mà …, đâu có …) phủ định mạnh." },
      {
        type: "compare",
        title: "Hình thức và ý nghĩa thật",
        headers: ["Câu hỏi tu từ", "Ý thật"],
        rows: [
          ["难道你不知道吗？", "Bạn phải biết chứ!"],
          ["你不是说过吗？", "Bạn đã nói rồi mà."],
          ["我怎么会忘呢？", "Tôi không thể quên được."],
          ["我哪儿有时间？", "Tôi làm gì có thời gian."],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "难道 你 连 这 个 都 不 知道 吗 ？", vi: "Lẽ nào đến cái này bạn cũng không biết?" },
          { zh: "你 不 是 说 今天 要 加班 吗 ？", vi: "Chẳng phải bạn nói hôm nay phải tăng ca sao?" },
          { zh: "这么 重要 的 事 ， 我 怎么 会 忘 呢 ？", vi: "Chuyện quan trọng thế, sao tôi quên được?" },
          { zh: "我 每 天 都 加班 ， 哪儿 有 时间 逛 街 ？", vi: "Ngày nào tôi cũng tăng ca, làm gì có thời gian dạo phố?" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "难道 你 不 知道 。", right: "难道 你 不 知道 吗 ？", why: "难道 thường đi với 吗 cuối câu và dấu hỏi." },
          { wrong: "你 是 不 说 过 吗 ？", right: "你 不 是 说 过 吗 ？", why: "Khung cố định là 不是 … 吗." },
        ],
      },
    ],
    quiz: [
      { id: "h4rq-1", type: "mcq", prompt: "\"你 不 是 说 今天 要 加班 吗 ？\" người nói muốn nói gì?", options: ["Bạn đã nói hôm nay phải tăng ca mà.", "Bạn có phải tăng ca không?", "Hôm nay không phải tăng ca."], answer: 0, explanation: "不是…吗 = nhắc lại điều người nghe đã nói." },
      { id: "h4rq-2", type: "mcq", zhPrompt: true, prompt: "___ 你 连 这 个 都 不 知道 吗 ？", options: ["难道", "因此", "即使"], answer: 0, explanation: "难道 … 吗: lẽ nào." },
      { id: "h4rq-3", type: "mcq", prompt: "\"我 哪儿 有 时间 ？\" nghĩa là?", options: ["Tôi làm gì có thời gian.", "Tôi có thời gian ở đâu?", "Tôi có nhiều thời gian."], answer: 0, explanation: "哪儿 + 有 tu từ = không có." },
      { id: "h4rq-4", type: "mcq", prompt: "Câu nào SAI?", options: ["你 是 不 说 过 吗 ？", "你 不 是 说 过 吗 ？", "难道 你 不 知道 吗 ？"], answer: 0, explanation: "Khung đúng: 不是 … 吗." },
      { id: "h4rq-5", type: "order", vi: "Chuyện quan trọng thế, sao tôi quên được?", answers: ["这么 重要 的 事 ， 我 怎么 会 忘 呢 ？"], explanation: "怎么 会 + V + 呢 ? = không thể." },
      { id: "h4rq-6", type: "order", vi: "Chẳng phải bạn nói hôm nay phải tăng ca sao?", answers: ["你 不 是 说 今天 要 加班 吗 ？"], explanation: "不是 … 吗 ?" },
    ],
  },
];
