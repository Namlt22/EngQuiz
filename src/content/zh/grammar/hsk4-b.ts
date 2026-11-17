/**
 * Ngữ pháp HSK 4 — bài 7–12: phó từ thái độ, phó từ tần suất / thời gian, 差一点儿 / 只好 / 不得不,
 * giới từ văn viết, cấu trúc trang trọng (是否, 之前, 与, 将), phỏng đoán và 来得及 / 来不及.
 * Câu ví dụ chỉ dùng từ HSK 1–4 (test: src/content/zh/grammar.test.ts).
 */
import type { ZhGrammarLesson } from "./types";

export const HSK4_GRAMMAR_B: ZhGrammarLesson[] = [
  {
    id: "attitude-adverbs",
    level: 4,
    title: "竟然, 原来, 到底 / 究竟, 确实, 实在",
    points: ["竟然 · vậy mà (bất ngờ)", "原来 · hoá ra; vốn là", "到底 / 究竟 · rốt cuộc", "确实 / 实在 · quả thật, thật sự"],
    intro: "Vậy mà anh ấy lại thắng! Hoá ra là bạn. Rốt cuộc bạn có đi không? — phó từ thể hiện thái độ người nói.",
    blocks: [
      { type: "summary", text: "Các phó từ này đứng sau chủ ngữ, trước động từ, cho biết người nói NGHĨ gì về sự việc. 竟然: điều xảy ra trái với mong đợi (vậy mà). 原来: phát hiện ra sự thật (hoá ra), hoặc tình trạng ban đầu (vốn). 到底 / 究竟: hỏi dồn, muốn câu trả lời cuối cùng — dùng trong câu hỏi, KHÔNG đi với 吗. 确实: xác nhận đúng là vậy. 实在: nhấn mức độ thật sự (实在太累了)." },
      {
        type: "formula",
        rows: [
          { label: "Bất ngờ", pattern: "Chủ ngữ + 竟然 + V", example: "这么 难 的 题 ， 他 竟然 十 分钟 就 做 完 了 。" },
          { label: "Hoá ra", pattern: "原来 + Sự thật", example: "原来 是 你 ！ 我 还 以为 是 别人 。" },
          { label: "Rốt cuộc", pattern: "Chủ ngữ + 到底 / 究竟 + Câu hỏi (không 吗)", example: "你 到底 去 不 去 ？" },
          { label: "Quả thật", pattern: "Chủ ngữ + 确实 / 实在 + V / Adj", example: "这 个 办法 确实 很 好 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 以为 他 会 输 ， 没有 想 到 他 竟然 赢 了 。", vi: "Tôi tưởng anh ấy sẽ thua, không ngờ anh ấy lại thắng." },
          { zh: "他 本来 想 当 律师 ， 后来 却 成为 了 演员 。", vi: "Anh ấy vốn định làm luật sư, sau này lại trở thành diễn viên." },
          { zh: "这 件 事 究竟 是 谁 做 的 ？", vi: "Chuyện này rốt cuộc là ai làm?" },
          { zh: "对不起 ， 我 实在 太 累 了 ， 不 想 出去 。", vi: "Xin lỗi, tôi thật sự mệt quá, không muốn ra ngoài." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "你 到底 去 吗 ？", right: "你 到底 去 不 去 ？", why: "到底 / 究竟 không đi với 吗; dùng câu hỏi chính phản hoặc từ để hỏi." },
          { wrong: "竟然 他 赢 了 。", right: "他 竟然 赢 了 。", why: "竟然 là phó từ, đứng sau chủ ngữ." },
        ],
      },
    ],
    quiz: [
      { id: "h4aa-1", type: "mcq", zhPrompt: true, prompt: "我 以为 他 会 输 ， 他 ___ 赢 了 。", options: ["竟然", "确实", "原来"], answer: 0, explanation: "Trái với mong đợi → 竟然." },
      { id: "h4aa-2", type: "mcq", zhPrompt: true, prompt: "___ 是 你 ！ 我 还 以为 是 别人 。", options: ["原来", "到底", "竟然"], answer: 0, explanation: "Phát hiện ra sự thật → 原来." },
      { id: "h4aa-3", type: "mcq", prompt: "Câu nào SAI?", options: ["你 到底 去 吗 ？", "你 到底 去 不 去 ？", "这 件 事 究竟 是 谁 做 的 ？"], answer: 0, explanation: "到底 không đi với 吗." },
      { id: "h4aa-4", type: "mcq", zhPrompt: true, prompt: "对不起 ， 我 ___ 太 累 了 。", options: ["实在", "原来", "到底"], answer: 0, explanation: "Nhấn mức độ thật sự → 实在." },
      { id: "h4aa-5", type: "order", vi: "Chuyện này rốt cuộc là ai làm?", answers: ["这 件 事 究竟 是 谁 做 的 ？"], explanation: "究竟 / 到底 + câu hỏi." },
      { id: "h4aa-6", type: "order", vi: "Cách này quả thật rất tốt.", answers: ["这 个 办法 确实 很 好 。"], explanation: "确实 + Adj." },
    ],
  },
  {
    id: "frequency-time-adverbs",
    level: 4,
    title: "从来, 往往, 偶尔, 正好, 随着",
    points: ["从来 + 不 / 没 · chưa bao giờ, xưa nay không", "往往 · thường (theo quy luật)", "偶尔 · thỉnh thoảng", "正好 · vừa đúng lúc", "随着 · cùng với (sự thay đổi)"],
    intro: "Chưa bao giờ đến muộn, cuối tuần thường đông người, thỉnh thoảng nấu ăn, vừa đúng lúc gặp bạn.",
    blocks: [
      { type: "summary", text: "从来 hầu như luôn đi với phủ định: 从来不 (xưa nay không — thói quen), 从来没(有)…过 (chưa bao giờ — trải nghiệm). 往往 nói quy luật đã quan sát được (trong điều kiện nào đó thì thường…), không dùng cho tương lai hay ý muốn; 常常 thì tự do hơn. 偶尔 = thỉnh thoảng (ít). 正好 = vừa khéo, đúng lúc. 随着 + sự thay đổi, vế sau là thay đổi kéo theo." },
      {
        type: "formula",
        rows: [
          { label: "Xưa nay không", pattern: "Chủ ngữ + 从来 + 不 + V", example: "他 从来 不 迟到 。" },
          { label: "Chưa từng", pattern: "Chủ ngữ + 从来 + 没有 + V + 过", example: "我 从来 没有 去 过 农村 。" },
          { label: "Quy luật", pattern: "(Điều kiện) + Chủ ngữ + 往往 + V", example: "周末 的 时候 ， 公园 里 往往 人 很 多 。" },
          { label: "Cùng với", pattern: "随着 + Thay đổi ， B 也 …", example: "随着 年龄 的 增长 ， 他 越 来 越 爱 回忆 童年 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 平时 很 少 做 饭 ， 只是 偶尔 做 一 次 。", vi: "Bình thường tôi ít nấu ăn, chỉ thỉnh thoảng nấu một lần." },
          { zh: "我 正 想 给 你 打电话 ， 你 正好 来 了 。", vi: "Tôi đang định gọi cho bạn thì bạn đến đúng lúc." },
          { zh: "随着 科技 的 发展 ， 网购 越 来 越 普遍 。", vi: "Cùng với sự phát triển khoa học kỹ thuật, mua hàng online ngày càng phổ biến." },
          { zh: "年轻 人 往往 更 喜欢 在 网上 看 新闻 。", vi: "Người trẻ thường thích đọc tin trên mạng hơn." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "他 从来 迟到 。", right: "他 从来 不 迟到 。", why: "从来 dùng với phủ định." },
          { wrong: "明天 我 往往 去 跑步 。", right: "明天 我 要 去 跑步 。", why: "往往 nói quy luật đã có, không dùng cho kế hoạch tương lai." },
        ],
      },
    ],
    quiz: [
      { id: "h4fa-1", type: "mcq", zhPrompt: true, prompt: "我 从来 ___ 去 过 农村 。", options: ["没有", "不", "别"], answer: 0, explanation: "Chưa từng (trải nghiệm) → 从来没有 … 过." },
      { id: "h4fa-2", type: "mcq", zhPrompt: true, prompt: "我 正 想 给 你 打电话 ， 你 ___ 来 了 。", options: ["正好", "往往", "从来"], answer: 0, explanation: "Vừa đúng lúc → 正好." },
      { id: "h4fa-3", type: "mcq", prompt: "Câu nào SAI?", options: ["明天 我 往往 去 跑步 。", "他 从来 不 迟到 。", "我 偶尔 做 饭 。"], answer: 0, explanation: "往往 không dùng cho tương lai." },
      { id: "h4fa-4", type: "mcq", zhPrompt: true, prompt: "___ 科技 的 发展 ， 网购 越 来 越 普遍 。", options: ["随着", "按照", "对于"], answer: 0, explanation: "Cùng với sự thay đổi → 随着." },
      { id: "h4fa-5", type: "order", vi: "Anh ấy xưa nay không đến muộn.", answers: ["他 从来 不 迟到 。"], explanation: "从来 + 不 + V." },
      { id: "h4fa-6", type: "order", vi: "Người trẻ thường thích đọc tin trên mạng hơn.", answers: ["年轻 人 往往 更 喜欢 在 网上 看 新闻 。"], explanation: "往往 = thường (quy luật)." },
    ],
  },
  {
    id: "almost-have-to",
    level: 4,
    title: "差一点儿, 只好, 不得不, 千万, 稍微",
    points: ["差一点儿 · suýt nữa", "只好 / 不得不 · đành phải / buộc phải", "千万 · nhất định (đừng)", "稍微 · hơi, một chút"],
    intro: "Suýt nữa lỡ chuyến bay, hết vé đành đi xe khách, nhất định đừng quên hộ chiếu.",
    blocks: [
      { type: "summary", text: "差一点儿 + V: suýt nữa (việc không xảy ra). Với điều KHÔNG mong muốn, 差一点儿 V và 差一点儿没 V cùng nghĩa \"suýt nữa thì…\" (may mà không). 只好 = đành phải (không còn cách khác, nhẹ nhàng); 不得不 = buộc phải (áp lực bên ngoài, mạnh hơn). 千万 + 要 / 别 / 不要: dặn dò khẩn thiết. 稍微 + Adj / V + 一点儿 / 一下: hơi, một chút." },
      {
        type: "formula",
        rows: [
          { label: "Suýt nữa", pattern: "Chủ ngữ + 差一点儿 + V", example: "我 差一点儿 错过 了 航班 。" },
          { label: "Đành phải", pattern: "…， Chủ ngữ + 只好 + V", example: "票 卖 完 了 ， 我们 只好 坐 大巴 。" },
          { label: "Buộc phải", pattern: "Chủ ngữ + 不得不 + V", example: "因为 下雨 ， 比赛 不得不 停止 。" },
          { label: "Dặn dò", pattern: "千万 + 要 / 别 + V", example: "你 千万 别 忘 了 带 护照 。" },
          { label: "Hơi", pattern: "稍微 + Adj / V + 一点儿 / 一下", example: "请 稍微 等 一 下 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "马路 上 堵车 ， 我 差一点儿 迟到 。", vi: "Đường tắc, tôi suýt nữa đến muộn." },
          { zh: "钥匙 丢 了 ， 他 只好 给 房东 打电话 。", vi: "Mất chìa khoá, anh ấy đành gọi cho chủ nhà." },
          { zh: "这 件 衣服 稍微 大 了 一点儿 。", vi: "Bộ quần áo này hơi rộng một chút." },
          { zh: "开车 的 时候 千万 要 小心 。", vi: "Khi lái xe nhất định phải cẩn thận." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "你 千万 忘 了 带 护照 。", right: "你 千万 别 忘 了 带 护照 。", why: "千万 phải đi với 要 / 别 / 不要 để thành lời dặn." },
          { wrong: "这 件 衣服 稍微 大 。", right: "这 件 衣服 稍微 大 了 一点儿 。", why: "稍微 thường cần 一点儿 / 一下 / 些 đi kèm." },
        ],
      },
    ],
    quiz: [
      { id: "h4ah-1", type: "mcq", zhPrompt: true, prompt: "我 ___ 错过 了 航班 。", options: ["差一点儿", "千万", "只好"], answer: 0, explanation: "Suýt nữa → 差一点儿." },
      { id: "h4ah-2", type: "mcq", zhPrompt: true, prompt: "票 卖 完 了 ， 我们 ___ 坐 大巴 。", options: ["只好", "千万", "稍微"], answer: 0, explanation: "Không còn cách khác → 只好." },
      { id: "h4ah-3", type: "mcq", zhPrompt: true, prompt: "你 ___ 别 忘 了 带 护照 。", options: ["千万", "差一点儿", "竟然"], answer: 0, explanation: "Dặn dò khẩn thiết → 千万 别." },
      { id: "h4ah-4", type: "mcq", prompt: "\"我 差一点儿 迟到 。\" — người nói có đến muộn không?", options: ["Không, suýt nữa thôi", "Có, đến muộn một chút", "Không rõ"], answer: 0, explanation: "差一点儿 + điều không mong muốn = suýt nữa nhưng không xảy ra." },
      { id: "h4ah-5", type: "order", vi: "Bộ quần áo này hơi rộng một chút.", answers: ["这 件 衣服 稍微 大 了 一点儿 。"], explanation: "稍微 + Adj + 了 + 一点儿." },
      { id: "h4ah-6", type: "order", vi: "Mất chìa khoá, anh ấy đành gọi cho chủ nhà.", answers: ["钥匙 丢 了 ， 他 只好 给 房东 打电话 。"], explanation: "只好 + V." },
    ],
  },
  {
    id: "formal-prepositions",
    level: 4,
    title: "Giới từ văn viết: 对于, 按照, 通过, 作为, 由",
    points: ["对于 · đối với (vấn đề)", "按照 · theo (quy định)", "通过 · thông qua", "作为 · với tư cách là", "由 · do (ai phụ trách)"],
    intro: "Theo quy định, thông qua phỏng vấn, với tư cách là sinh viên, việc này do anh ấy phụ trách.",
    blocks: [
      { type: "summary", text: "Các giới từ này hay gặp trong văn viết, thông báo, bài đọc HSK 4. Cụm giới từ đứng đầu câu hoặc trước động từ. 对于 + vấn đề / sự việc (đối với…), thường đứng đầu câu; 对 dùng rộng hơn (cả với người). 按照 + quy định / kế hoạch. 通过 + phương pháp / quá trình. 作为 + thân phận. 由 + người: do ai làm / phụ trách (由 + người + V)." },
      {
        type: "formula",
        rows: [
          { label: "Đối với", pattern: "对于 + Vấn đề ， …", example: "对于 这 个 问题 ， 大家 有 不同 的 看法 。" },
          { label: "Theo", pattern: "按照 + Quy định / Kế hoạch + V", example: "请 按照 顺序 排队 。" },
          { label: "Thông qua", pattern: "通过 + Cách thức ， …", example: "通过 这 次 比赛 ， 我 认识 了 很 多 朋友 。" },
          { label: "Với tư cách", pattern: "作为 + Thân phận ， …", example: "作为 学生 ， 我们 应该 认真 学习 。" },
          { label: "Do ai", pattern: "Việc + 由 + Người + V", example: "这 次 活动 由 王|Wáng 经理 负责 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "按照 规定 ， 这里 禁止 停车 。", vi: "Theo quy định, ở đây cấm đỗ xe." },
          { zh: "他 通过 了 面试 ， 下 个 月 开始 上班 。", vi: "Anh ấy đã qua vòng phỏng vấn, tháng sau bắt đầu đi làm." },
          { zh: "作为 你 的 朋友 ， 我 一定 支持 你 。", vi: "Với tư cách là bạn của bạn, tôi nhất định ủng hộ bạn." },
          { zh: "对于 我 来 说 ， 家庭 是 最 重要 的 。", vi: "Đối với tôi mà nói, gia đình là quan trọng nhất." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "对于 我 很 热情 。", right: "他 对 我 很 热情 。", why: "Thái độ với NGƯỜI dùng 对, không dùng 对于; câu cũng cần chủ ngữ." },
          { wrong: "这 次 活动 负责 由 王|Wáng 经理 。", right: "这 次 活动 由 王|Wáng 经理 负责 。", why: "由 + người đứng TRƯỚC động từ." },
        ],
      },
    ],
    quiz: [
      { id: "h4fp-1", type: "mcq", zhPrompt: true, prompt: "请 ___ 顺序 排队 。", options: ["按照", "作为", "由"], answer: 0, explanation: "Theo thứ tự / quy định → 按照." },
      { id: "h4fp-2", type: "mcq", zhPrompt: true, prompt: "___ 学生 ， 我们 应该 认真 学习 。", options: ["作为", "对于", "通过"], answer: 0, explanation: "Với tư cách là → 作为." },
      { id: "h4fp-3", type: "mcq", zhPrompt: true, prompt: "这 次 活动 ___ 王|Wáng 经理 负责 。", options: ["由", "按照", "随着"], answer: 0, explanation: "Do ai phụ trách → 由." },
      { id: "h4fp-4", type: "mcq", prompt: "Câu nào SAI?", options: ["他 对于 我 很 热情 。", "他 对 我 很 热情 。", "对于 这 个 问题 ， 大家 有 不同 的 看法 。"], answer: 0, explanation: "Thái độ với người → 对." },
      { id: "h4fp-5", type: "order", vi: "Theo quy định, ở đây cấm đỗ xe.", answers: ["按照 规定 ， 这里 禁止 停车 。"], explanation: "按照 + quy định đứng đầu câu." },
      { id: "h4fp-6", type: "order", vi: "Đối với tôi mà nói, gia đình là quan trọng nhất.", answers: ["对于 我 来 说 ， 家庭 是 最 重要 的 。"], explanation: "对于 … 来说 = đối với … mà nói." },
    ],
  },
  {
    id: "formal-structures",
    level: 4,
    title: "Văn phong trang trọng: 是否, 之前 / 之后, 以内, 与, 将",
    points: ["是否 / 能否 · có… hay không", "之前 / 之后 / 之间 · trước / sau / giữa", "以内 · trong vòng", "与 · với, và", "将 · sẽ"],
    intro: "Thông báo, email công việc, biển báo — những từ văn viết thay cho từ khẩu ngữ đã học.",
    blocks: [
      { type: "summary", text: "Văn viết thay một số từ khẩu ngữ bằng từ trang trọng hơn: 是不是 → 是否, 能不能 → 能否 (không thêm 吗); 以前 / 以后 → 之前 / 之后; 和 / 跟 → 与; 要 / 会 (sẽ) → 将. 以内 = trong vòng (thời gian, số lượng, phạm vi)." },
      {
        type: "compare",
        title: "Khẩu ngữ → Văn viết",
        headers: ["Khẩu ngữ", "Văn viết", "Ví dụ văn viết"],
        rows: [
          ["是不是", "是否", "请问您是否需要帮助？"],
          ["能不能", "能否", "能否提前通知我们？"],
          ["以前 / 以后", "之前 / 之后", "会议之前请关机。"],
          ["和 / 跟", "与", "我与他是同学。"],
          ["要 / 会", "将", "航班将推迟一个小时。"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "请问 您 是否 需要 帮助 ？", vi: "Xin hỏi quý khách có cần giúp đỡ không?" },
          { zh: "此次 航班 将 推迟 一 个 小时 起飞 。", vi: "Chuyến bay này sẽ cất cánh muộn một tiếng." },
          { zh: "请 在 三 天 以内 回复 邮件 。", vi: "Vui lòng trả lời email trong vòng ba ngày." },
          { zh: "两 个 城市 之间 的 距离 是 二百 公里 。", vi: "Khoảng cách giữa hai thành phố là hai trăm ki-lô-mét." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "请问 您 是否 需要 帮助 吗 ？", right: "请问 您 是否 需要 帮助 ？", why: "是否 đã là dạng hỏi, không thêm 吗." },
          { wrong: "会议 前 之 请 关机 。", right: "会议 之前 请 关机 。", why: "之前 / 之后 đi liền, đứng sau sự việc làm mốc." },
        ],
      },
    ],
    quiz: [
      { id: "h4fs-1", type: "mcq", zhPrompt: true, prompt: "请问 您 ___ 需要 帮助 ？", options: ["是否", "到底", "因此"], answer: 0, explanation: "Văn viết: 是否, không thêm 吗." },
      { id: "h4fs-2", type: "mcq", zhPrompt: true, prompt: "航班 ___ 推迟 一 个 小时 。", options: ["将", "之", "与"], answer: 0, explanation: "Sẽ (văn viết) → 将." },
      { id: "h4fs-3", type: "mcq", zhPrompt: true, prompt: "请 在 三 天 ___ 回复 邮件 。", options: ["以内", "之间", "是否"], answer: 0, explanation: "Trong vòng → 以内." },
      { id: "h4fs-4", type: "mcq", prompt: "\"我 与 他 是 同学 。\" — 与 tương đương từ khẩu ngữ nào?", options: ["和", "对", "给"], answer: 0, explanation: "与 = 和 / 跟 (văn viết)." },
      { id: "h4fs-5", type: "order", vi: "Trước cuộc họp, vui lòng tắt máy.", answers: ["会议 之前 请 关机 。"], explanation: "Sự việc + 之前." },
      { id: "h4fs-6", type: "order", vi: "Xin hỏi quý khách có cần giúp đỡ không?", answers: ["请问 您 是否 需要 帮助 ？"], explanation: "是否 + V." },
    ],
  },
  {
    id: "speculation-possibility",
    level: 4,
    title: "Phỏng đoán: 恐怕, 也许, 估计, 肯定; 来得及 / 来不及, 受不了",
    points: ["恐怕 · e rằng", "也许 / 估计 · có lẽ / chắc là", "肯定 · chắc chắn", "来得及 / 来不及 · kịp / không kịp", "受不了 · không chịu nổi"],
    intro: "E rằng không kịp rồi, chắc tầm hai tiếng, chắc chắn anh ấy sẽ đến, nóng không chịu nổi.",
    blocks: [
      { type: "summary", text: "Mức chắc chắn tăng dần: 也许 (có lẽ) < 估计 (ước chừng, chắc là) < 肯定 (chắc chắn). 恐怕 = e rằng, dự đoán điều KHÔNG mong muốn. Các từ này đứng trước động từ hoặc đầu câu. 来得及 / 来不及 + V: còn kịp / không kịp làm gì. 受不了 = không chịu nổi (đứng sau tính từ hoặc làm vị ngữ)." },
      {
        type: "formula",
        rows: [
          { label: "E rằng", pattern: "恐怕 + Dự đoán xấu", example: "已经 八 点 了 ， 恐怕 来不及 了 。" },
          { label: "Có lẽ", pattern: "也许 / 估计 + Dự đoán", example: "他 估计 两 个 小时 以后 到 。" },
          { label: "Chắc chắn", pattern: "Chủ ngữ + 肯定 + V", example: "他 肯定 会 来 的 。" },
          { label: "Còn kịp", pattern: "来得及 / 来不及 + V", example: "别 着急 ， 还 来得及 吃 早饭 。" },
          { label: "Không chịu nổi", pattern: "Adj + 得 + 受不了 / Chủ ngữ + 受不了", example: "今天 热 得 受不了 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "天 阴 了 ， 恐怕 要 下雨 了 。", vi: "Trời âm u rồi, e rằng sắp mưa." },
          { zh: "也许 他 没有 看 到 你 的 短信 。", vi: "Có lẽ anh ấy chưa đọc tin nhắn của bạn." },
          { zh: "你 这么 努力 ， 肯定 能 考 上 。", vi: "Bạn chăm chỉ thế, chắc chắn sẽ đỗ." },
          { zh: "他 每 天 都 加班 ， 我 真 受不了 。", vi: "Ngày nào anh ấy cũng tăng ca, tôi thật không chịu nổi." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "恐怕 明天 是 好 天气 。", right: "恐怕 明天 会 下雨 。", why: "恐怕 dùng cho dự đoán KHÔNG mong muốn." },
          { wrong: "我们 不 来得及 了 。", right: "我们 来不及 了 。", why: "Phủ định của 来得及 là 来不及." },
        ],
      },
    ],
    quiz: [
      { id: "h4sp-1", type: "mcq", zhPrompt: true, prompt: "已经 八 点 了 ， ___ 来不及 了 。", options: ["恐怕", "肯定 不", "千万"], answer: 0, explanation: "Dự đoán điều không mong muốn → 恐怕." },
      { id: "h4sp-2", type: "mcq", prompt: "Từ nào thể hiện mức chắc chắn CAO nhất?", options: ["肯定", "估计", "也许"], answer: 0, explanation: "也许 < 估计 < 肯定." },
      { id: "h4sp-3", type: "mcq", prompt: "Câu nào SAI?", options: ["我们 不 来得及 了 。", "我们 来不及 了 。", "还 来得及 。"], answer: 0, explanation: "Phủ định: 来不及." },
      { id: "h4sp-4", type: "mcq", zhPrompt: true, prompt: "今天 热 得 ___ 。", options: ["受不了", "来得及", "差一点儿"], answer: 0, explanation: "Nóng không chịu nổi → 热得受不了." },
      { id: "h4sp-5", type: "order", vi: "Bạn chăm chỉ thế, chắc chắn sẽ đỗ.", answers: ["你 这么 努力 ， 肯定 能 考 上 。"], explanation: "肯定 + 能 + V." },
      { id: "h4sp-6", type: "order", vi: "Đừng sốt ruột, vẫn còn kịp ăn sáng.", answers: ["别 着急 ， 还 来得及 吃 早饭 。"], explanation: "来得及 + V." },
    ],
  },
];
