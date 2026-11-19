/**
 * Bài thi thử HSK 2 — MÔ PHỎNG cấu trúc nghe – đọc, do EngQuiz tự soạn (không phải đề thi thật).
 * Chỉ dùng từ HSK 1–2 (test: src/content/zh/mock.test.ts). Đáp án đúng luôn là options[0]; giao diện tự xáo.
 */
import type { MockTest } from "./hsk1";

export const HSK2_MOCK: MockTest = {
  id: "hsk2",
  title: "Thi thử HSK 2",
  level: 2,
  passPercent: 60,
  maxPlays: 2,
  items: [
    { id: "m2l1", section: "listening", say: "我 去 过 两 次 中国 。", prompt: "Người nói đã đến Trung Quốc mấy lần?", options: ["Hai lần", "Một lần", "Chưa lần nào"], explanation: "去过两次 = đã đi hai lần." },
    { id: "m2l2", section: "listening", say: "地铁 比 公交车 快 多 了 。", prompt: "Câu nào đúng?", options: ["Tàu điện ngầm nhanh hơn xe buýt nhiều", "Xe buýt nhanh hơn tàu điện ngầm", "Hai loại xe nhanh như nhau"], explanation: "A 比 B 快多了." },
    { id: "m2l3", section: "listening", say: "我 是 坐 火车 来 的 。", prompt: "Người nói đến bằng gì?", options: ["Tàu hoả", "Máy bay", "Taxi"], explanation: "是坐火车来的." },
    { id: "m2l4", section: "listening", say: "快要 下雨 了 ， 我们 回去 吧 。", prompt: "Vì sao họ quay về?", options: ["Sắp mưa", "Trời tối", "Mệt rồi"], explanation: "快要下雨了 = sắp mưa." },
    { id: "m2l5", section: "listening", say: "我 头 疼 ， 不 想 去 上班 。", prompt: "Người nói bị làm sao?", options: ["Đau đầu", "Đau mắt", "Đau chân"], explanation: "头疼 = đau đầu." },
    { id: "m2l6", section: "listening", say: "机场 离 这儿 很 远 。", prompt: "Câu nào đúng?", options: ["Sân bay cách đây rất xa", "Sân bay ở ngay gần đây", "Không có sân bay"], explanation: "离这儿很远 = cách đây rất xa." },
    { id: "m2l7", section: "listening", say: "她 说 汉语 说 得 很 好 。", prompt: "Cô ấy nói tiếng Trung thế nào?", options: ["Rất giỏi", "Không giỏi", "Không biết nói"], explanation: "说得很好 = nói rất giỏi." },
    { id: "m2l8", section: "listening", say: "你 喝 茶 还是 喝 咖啡 ？", prompt: "Đây là câu hỏi gì?", options: ["Hỏi chọn trà hay cà phê", "Hỏi có thích trà không", "Mời uống nước"], explanation: "还是 = hay là (lựa chọn)." },
    { id: "m2l9", section: "listening", say: "我 学 汉语 学 了 两 年 了 。", prompt: "Người nói học tiếng Trung bao lâu rồi?", options: ["Hai năm", "Một năm", "Hai tháng"], explanation: "学了两年了 = đã học hai năm." },
    { id: "m2l10", section: "listening", say: "别 忘 了 拿 手机 。", prompt: "Người nói nhắc điều gì?", options: ["Đừng quên cầm điện thoại", "Hãy gọi điện thoại", "Điện thoại bị hỏng"], explanation: "别忘了 = đừng quên." },

    { id: "m2r1", section: "reading", zhPrompt: true, prompt: "哥哥 ___ 我 高 。", options: ["比", "跟", "离"], explanation: "So sánh hơn: A 比 B + tính từ." },
    { id: "m2r2", section: "reading", zhPrompt: true, prompt: "你 吃 ___ 饺子 吗 ？", options: ["过", "着", "得"], explanation: "Hỏi trải nghiệm: V + 过." },
    { id: "m2r3", section: "reading", zhPrompt: true, prompt: "他 跑 ___ 很 快 。", options: ["得", "的", "地"], explanation: "Bổ ngữ trình độ: V + 得 + tính từ." },
    { id: "m2r4", section: "reading", zhPrompt: true, prompt: "因为 下雨 ， ___ 我 没有 去 。", options: ["所以", "但是", "还是"], explanation: "因为 … 所以 …" },
    { id: "m2r5", section: "reading", zhPrompt: true, prompt: "我 家 ___ 学校 很 近 。", options: ["离", "从", "往"], explanation: "Khoảng cách: A 离 B + 近." },
    { id: "m2r6", section: "reading", zhPrompt: true, prompt: "门 开 ___ 。", options: ["着", "过", "得"], explanation: "Trạng thái kéo dài: V + 着." },
    { id: "m2r7", section: "reading", text: "虽然 今天 很 累 ， 但是 我 很 快乐 。", prompt: "Người viết hôm nay thế nào?", options: ["Mệt nhưng vui", "Không mệt", "Mệt và buồn"], explanation: "虽然很累，但是很快乐." },
    { id: "m2r8", section: "reading", text: "我 是 昨天 晚上 到 的 ， 坐 了 三 个 小时 的 火车 。", prompt: "Câu nào đúng?", options: ["Người viết đi tàu hoả ba tiếng", "Người viết đến sáng nay", "Người viết đi máy bay"], explanation: "坐了三个小时的火车." },
    { id: "m2r9", section: "reading", text: "请问 ， 去 药店 怎么 走 ？", prompt: "Câu trả lời phù hợp là?", options: ["往 前 走 ， 就 在 医院 旁边 。", "我 吃 过 药 了 。", "药店 的 药 很 贵 。"], explanation: "Hỏi đường (怎么走) → chỉ hướng đi." },
    { id: "m2r10", section: "reading", text: "老师 让 我们 每 天 写 十 个 汉字 。", prompt: "Thầy giáo bảo học sinh làm gì?", options: ["Mỗi ngày viết mười chữ Hán", "Mỗi ngày đọc mười trang sách", "Mỗi tuần viết mười chữ"], explanation: "让 + 我们 + 每天写十个汉字." },
  ],
};
