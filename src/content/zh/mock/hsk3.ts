/**
 * Bài thi thử HSK 3 — MÔ PHỎNG cấu trúc nghe – đọc, do EngQuiz tự soạn (không phải đề thi thật).
 * Chỉ dùng từ HSK 1–3 (test: src/content/zh/mock.test.ts). Đáp án đúng luôn là options[0]; giao diện tự xáo.
 */
import type { MockTest } from "./hsk1";

export const HSK3_MOCK: MockTest = {
  id: "hsk3",
  title: "Thi thử HSK 3",
  level: 3,
  passPercent: 60,
  maxPlays: 2,
  items: [
    { id: "m3l1", section: "listening", say: "我 把 作业 写 完 了 ， 现在 可以 去 玩 了 。", prompt: "Người nói đã làm gì?", options: ["Làm xong bài tập", "Chưa làm bài tập", "Đang đi chơi"], explanation: "把作业写完了 = đã viết xong bài tập." },
    { id: "m3l2", section: "listening", say: "我 的 自行车 被 人 骑 走 了 。", prompt: "Chuyện gì đã xảy ra?", options: ["Xe đạp bị người khác lấy đi", "Người nói đạp xe đi làm", "Xe đạp bị hỏng"], explanation: "被人骑走了 = bị người ta đạp đi mất." },
    { id: "m3l3", section: "listening", say: "老师 说 得 太 快 ， 我 听 不 懂 。", prompt: "Vì sao người nói không hiểu?", options: ["Thầy nói quá nhanh", "Thầy nói quá nhỏ", "Người nói không đến lớp"], explanation: "说得太快 → 听不懂." },
    { id: "m3l4", section: "listening", say: "会议 九 点 开始 ， 他 十 点 才 来 。", prompt: "Câu nào đúng?", options: ["Anh ấy đến muộn một tiếng", "Anh ấy đến sớm", "Anh ấy không đến"], explanation: "才 = muộn hơn mong đợi." },
    { id: "m3l5", section: "listening", say: "天气 越 来 越 冷 了 ， 你 要 多 穿 衣服 。", prompt: "Người nói khuyên gì?", options: ["Mặc thêm áo", "Ở nhà", "Đi khám bệnh"], explanation: "越来越冷 → 多穿衣服." },
    { id: "m3l6", section: "listening", say: "除了 小 王|Wáng 以外 ， 大家 都 来 了 。", prompt: "Ai chưa đến?", options: ["Tiểu Vương", "Mọi người", "Không ai"], explanation: "除了…以外，都… = trừ Tiểu Vương, ai cũng đến." },
    { id: "m3l7", section: "listening", say: "我 学 网球 学 了 三 年 了 。", prompt: "Người nói học quần vợt bao lâu?", options: ["Ba năm", "Ba tháng", "Một năm"], explanation: "学了三年了 = đã học ba năm (vẫn đang học)." },
    { id: "m3l8", section: "listening", say: "他 一 到 家 就 给 我 打电话 。", prompt: "Anh ấy gọi điện khi nào?", options: ["Vừa về đến nhà", "Trước khi về nhà", "Sáng hôm sau"], explanation: "一…就… = vừa… là…" },
    { id: "m3l9", section: "listening", say: "这 件 衣服 有一点儿 贵 ， 能 便宜 一点儿 吗 ？", prompt: "Người nói muốn gì?", options: ["Muốn giảm giá", "Muốn đổi màu", "Muốn mua hai cái"], explanation: "便宜一点儿 = rẻ hơn một chút." },
    { id: "m3l10", section: "listening", say: "周末 我 哪儿 也 没有 去 ， 在 家 休息 。", prompt: "Cuối tuần người nói làm gì?", options: ["Ở nhà nghỉ ngơi", "Đi du lịch", "Đi làm"], explanation: "哪儿也没有去 = chẳng đi đâu cả." },

    { id: "m3r1", section: "reading", zhPrompt: true, prompt: "请 ___ 门 关 上 。", options: ["把", "被", "对"], explanation: "Câu 把: làm gì với cái cửa." },
    { id: "m3r2", section: "reading", zhPrompt: true, prompt: "蛋糕 ___ 弟弟 吃 完 了 。", options: ["被", "把", "向"], explanation: "Vật chịu tác động đứng đầu câu → 被." },
    { id: "m3r3", section: "reading", zhPrompt: true, prompt: "只有 多 练习 ， ___ 能 提高 水平 。", options: ["才", "就", "都"], explanation: "只有 … 才 …" },
    { id: "m3r4", section: "reading", zhPrompt: true, prompt: "今天 比 昨天 ___ 冷 。", options: ["还", "很", "非常"], explanation: "Câu 比 nhấn mạnh bằng 还 / 更." },
    { id: "m3r5", section: "reading", zhPrompt: true, prompt: "你 说 ___ ， 我 在 听 。", options: ["下去", "起来", "出来"], explanation: "Tiếp tục → 下去." },
    { id: "m3r6", section: "reading", zhPrompt: true, prompt: "我 ___ 中国 文化 很 感兴趣 。", options: ["对", "为", "向"], explanation: "对 + đối tượng + 感兴趣." },
    { id: "m3r7", section: "reading", text: "这 家 饭店 的 菜 不但 好吃 ， 而且 很 便宜 。", prompt: "Nhà hàng này thế nào?", options: ["Ngon và rẻ", "Ngon nhưng đắt", "Rẻ nhưng không ngon"], explanation: "不但…而且… = không những… mà còn…" },
    { id: "m3r8", section: "reading", text: "我 每 天 早上 先 锻炼 一 个 小时 ， 然后 吃 早饭 。", prompt: "Người viết làm gì trước bữa sáng?", options: ["Tập thể dục một tiếng", "Đọc báo", "Đi làm"], explanation: "先锻炼…然后吃早饭." },
    { id: "m3r9", section: "reading", text: "字 太 小 了 ， 我 看 不 清楚 。", prompt: "Câu trả lời phù hợp là?", options: ["我 给 你 写 大 一点儿 。", "我 也 看 过 这 本 书 。", "这 个 字 很 好看 。"], explanation: "Không nhìn rõ vì chữ nhỏ → viết to hơn." },
    { id: "m3r10", section: "reading", text: "只要 你 坚持 ， 就 一定 能 学 好 汉语 。", prompt: "Theo người viết, cần gì để học tốt tiếng Trung?", options: ["Kiên trì", "Đi du học", "Có giáo viên giỏi"], explanation: "只要坚持，就能学好." },
  ],
};
