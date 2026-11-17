/**
 * Bài thi thử HSK 4 — MÔ PHỎNG cấu trúc nghe – đọc, do EngQuiz tự soạn (không phải đề thi thật).
 * Chỉ dùng từ HSK 1–4 (test: src/content/zh/mock.test.ts). Đáp án đúng luôn là options[0]; giao diện tự xáo.
 */
import type { MockTest } from "./hsk1";

export const HSK4_MOCK: MockTest = {
  id: "hsk4",
  title: "Thi thử HSK 4",
  level: 4,
  passPercent: 60,
  maxPlays: 2,
  items: [
    { id: "m4l1", section: "listening", say: "由于 天气 原因 ， 航班 将 推迟 一 个 小时 起飞 。", prompt: "Chuyến bay thế nào?", options: ["Bị hoãn một tiếng do thời tiết", "Bị huỷ", "Cất cánh đúng giờ"], explanation: "由于天气原因，航班将推迟一个小时。" },
    { id: "m4l2", section: "listening", say: "他 忙 得 连 午餐 都 没有 吃 。", prompt: "Câu nào đúng?", options: ["Anh ấy bận đến mức không ăn trưa", "Anh ấy ăn trưa rất muộn", "Anh ấy không bận"], explanation: "连…都没有吃 = đến… cũng không ăn." },
    { id: "m4l3", section: "listening", say: "即使 明天 下雨 ， 比赛 也 会 按时 举行 。", prompt: "Nếu mai mưa thì sao?", options: ["Trận đấu vẫn diễn ra đúng giờ", "Trận đấu bị hoãn", "Trận đấu bị huỷ"], explanation: "即使…也… = cho dù… vẫn…" },
    { id: "m4l4", section: "listening", say: "我 差一点儿 错过 了 动车 。", prompt: "Người nói có lỡ tàu không?", options: ["Không, suýt nữa thôi", "Có, đã lỡ tàu", "Không đi tàu"], explanation: "差一点儿 + điều không mong muốn = suýt nữa." },
    { id: "m4l5", section: "listening", say: "这 家 餐厅 的 菜 既 便宜 又 好吃 ， 所以 人 很 多 。", prompt: "Vì sao nhà hàng đông khách?", options: ["Vừa rẻ vừa ngon", "Ở gần trường", "Có giảm giá"], explanation: "既便宜又好吃." },
    { id: "m4l6", section: "listening", say: "你 不 是 说 今天 要 加班 吗 ？ 怎么 这么 早 就 回来 了 ？", prompt: "Người nói cảm thấy thế nào?", options: ["Ngạc nhiên vì người kia về sớm", "Tức giận vì người kia về muộn", "Vui vì được tăng ca"], explanation: "不是…吗？ nhắc điều đã nói; 这么早 = sớm thế." },
    { id: "m4l7", section: "listening", say: "按照 规定 ， 这里 禁止 停车 。", prompt: "Ở đây không được làm gì?", options: ["Đỗ xe", "Hút thuốc", "Chụp ảnh"], explanation: "禁止停车 = cấm đỗ xe." },
    { id: "m4l8", section: "listening", say: "他 从来 不 吃 早饭 ， 这 是 一 个 坏 习惯 。", prompt: "Thói quen xấu là gì?", options: ["Không bao giờ ăn sáng", "Ăn sáng quá nhiều", "Ngủ quá muộn"], explanation: "从来不吃早饭." },
    { id: "m4l9", section: "listening", say: "已经 八 点 了 ， 恐怕 来不及 了 ， 我们 打车 吧 。", prompt: "Vì sao họ bắt taxi?", options: ["Sợ không kịp", "Trời mưa", "Ga tàu đóng cửa"], explanation: "恐怕来不及了." },
    { id: "m4l10", section: "listening", say: "这 部 电影 使 很 多 观众 非常 感动 。", prompt: "Khán giả cảm thấy thế nào?", options: ["Rất cảm động", "Thấy chán", "Thấy buồn cười"], explanation: "使很多观众非常感动." },

    { id: "m4r1", section: "reading", zhPrompt: true, prompt: "这 个 问题 连 老师 ___ 不 知道 。", options: ["都", "才", "而"], explanation: "连 … 都 / 也 …" },
    { id: "m4r2", section: "reading", zhPrompt: true, prompt: "___ 你 来 了 ， 就 在 这儿 吃 饭 吧 。", options: ["既然", "即使", "尽管"], explanation: "既然 … 就 …" },
    { id: "m4r3", section: "reading", zhPrompt: true, prompt: "快 走 吧 ， ___ 要 迟到 了 。", options: ["否则", "于是", "由于"], explanation: "Cảnh báo → 否则." },
    { id: "m4r4", section: "reading", zhPrompt: true, prompt: "不管 工作 多么 忙 ， 他 ___ 去 健身房 。", options: ["都", "就", "却"], explanation: "不管 … 都 …" },
    { id: "m4r5", section: "reading", zhPrompt: true, prompt: "你 ___ 去 不 去 ？", options: ["到底", "确实", "竟然"], explanation: "Hỏi dồn, không dùng 吗 → 到底." },
    { id: "m4r6", section: "reading", zhPrompt: true, prompt: "请问 您 ___ 需要 帮助 ？", options: ["是否", "之前", "以内"], explanation: "Văn viết: 是否 = có… hay không." },
    { id: "m4r7", section: "reading", text: "尽管 他 很 努力 ， 但是 这 次 考试 还是 没有 通过 。", prompt: "Câu nào đúng?", options: ["Anh ấy cố gắng nhưng vẫn trượt", "Anh ấy không cố gắng nên trượt", "Anh ấy đỗ nhờ cố gắng"], explanation: "尽管…但是… = mặc dù… nhưng…" },
    { id: "m4r8", section: "reading", text: "随着 互联网 的 发展 ， 网购 越 来 越 普遍 ， 很 多 人 连 现金 都 不 带 了 。", prompt: "Đoạn văn chủ yếu nói về điều gì?", options: ["Internet thay đổi cách mua sắm", "Tiền mặt rất quan trọng", "Mua sắm ở chợ ngày càng nhiều"], explanation: "随着互联网的发展，网购越来越普遍." },
    { id: "m4r9", section: "reading", text: "对不起 ， 让 你 久 等 了 。", prompt: "Câu đáp phù hợp là?", options: ["没关系 ， 我 也 刚 到 。", "我 也 让 你 等 。", "等 是 一 个 好 习惯 。"], explanation: "Đáp lại lời xin lỗi: 没关系." },
    { id: "m4r10", section: "reading", text: "作为 学生 ， 我们 不仅 要 学 好 知识 ， 而且 要 养成 好 习惯 。", prompt: "Theo câu này, học sinh cần làm gì?", options: ["Học tốt kiến thức và hình thành thói quen tốt", "Chỉ cần học tốt kiến thức", "Chỉ cần có thói quen tốt"], explanation: "不仅…而且… — cả hai." },
  ],
};
