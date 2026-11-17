/**
 * Bài thi thử HSK 1 — MÔ PHỎNG cấu trúc nghe – đọc của kỳ thi, do EngQuiz tự soạn (không phải đề thi thật).
 * Câu tiếng Trung ở dạng tách từ, chỉ dùng từ HSK 1 (test: src/content/zh/mock.test.ts).
 * Đáp án đúng luôn là options[0]; giao diện tự xáo thứ tự.
 */
export interface MockItem {
  id: string;
  section: "listening" | "reading";
  /** Câu được đọc lên (phần nghe) */
  say?: string;
  /** Đoạn văn hiển thị (phần đọc) */
  text?: string;
  prompt: string;
  /** prompt là câu tiếng Trung có "___" */
  zhPrompt?: boolean;
  /** Lựa chọn; có chữ Hán thì hiển thị kèm pinyin khi ôn đáp án */
  options: string[];
  explanation: string;
}

export interface MockTest {
  id: string;
  title: string;
  level: 1;
  passPercent: number;
  /** Số lần được nghe lại mỗi câu ở phần nghe */
  maxPlays: number;
  items: MockItem[];
}

export const HSK1_MOCK: MockTest = {
  id: "hsk1",
  title: "Thi thử HSK 1",
  level: 1,
  passPercent: 60,
  maxPlays: 2,
  items: [
    { id: "l1", section: "listening", say: "我 是 老师 。", prompt: "Bạn nghe được câu nào?", options: ["我 是 老师 。", "我 是 学生 。", "他 是 老师 。"], explanation: "我是老师 — Tôi là giáo viên." },
    { id: "l2", section: "listening", say: "现在 八 点 半 。", prompt: "Bây giờ là mấy giờ?", options: ["8 giờ 30", "8 giờ", "4 giờ 30"], explanation: "八点半 = 8 giờ rưỡi." },
    { id: "l3", section: "listening", say: "这 个 苹果 三 块 钱 。", prompt: "Quả táo giá bao nhiêu?", options: ["3 đồng", "13 đồng", "30 đồng"], explanation: "三块钱 = 3 đồng." },
    { id: "l4", section: "listening", say: "我 家 有 五 口 人 。", prompt: "Nhà người nói có mấy người?", options: ["5 người", "4 người", "3 người"], explanation: "五口人 = 5 người." },
    { id: "l5", section: "listening", say: "明天 星期 三 。", prompt: "Ngày mai là thứ mấy?", options: ["Thứ Tư", "Thứ Ba", "Thứ Năm"], explanation: "星期三 là thứ Tư (星期一 là thứ Hai)." },
    { id: "l6", section: "listening", say: "我 想 喝 茶 。", prompt: "Người nói muốn làm gì?", options: ["Uống trà", "Uống nước", "Ăn cơm"], explanation: "想喝茶 = muốn uống trà." },
    { id: "l7", section: "listening", say: "他 在 医院 工作 。", prompt: "Anh ấy làm việc ở đâu?", options: ["Bệnh viện", "Trường học", "Công ty"], explanation: "在医院工作 = làm việc ở bệnh viện." },
    { id: "l8", section: "listening", say: "今天 很 冷 ， 下雨 了 。", prompt: "Thời tiết hôm nay thế nào?", options: ["Lạnh, trời mưa", "Nóng", "Đẹp trời"], explanation: "很冷，下雨了 = rất lạnh, mưa rồi." },
    { id: "l9", section: "listening", say: "你 叫 什么 名字 ？", prompt: "Câu hỏi này hỏi về điều gì?", options: ["Tên", "Tuổi", "Quốc tịch"], explanation: "叫什么名字 = tên là gì." },
    { id: "l10", section: "listening", say: "我 不 会 开车 。", prompt: "Câu nào đúng với điều bạn nghe?", options: ["Người nói không biết lái xe", "Người nói biết lái xe", "Người nói không thích xe"], explanation: "不会开车 = không biết lái xe." },

    { id: "r1", section: "reading", zhPrompt: true, prompt: "我 ___ 中国 人 。", options: ["是", "很", "有"], explanation: "Nối chủ ngữ với danh từ dùng 是." },
    { id: "r2", section: "reading", zhPrompt: true, prompt: "你 家 有 几 ___ 人 ？", options: ["口", "个", "本"], explanation: "Số người trong gia đình dùng lượng từ 口." },
    { id: "r3", section: "reading", zhPrompt: true, prompt: "今天 ___ 冷 。", options: ["很", "是", "吗"], explanation: "Câu tính từ: 很 + tính từ." },
    { id: "r4", section: "reading", zhPrompt: true, prompt: "我 买 ___ 一 本 书 。", options: ["了", "吗", "呢"], explanation: "Hành động đã hoàn thành: động từ + 了." },
    { id: "r5", section: "reading", zhPrompt: true, prompt: "他 ___ 公司 工作 。", options: ["在", "是", "有"], explanation: "在 + nơi chốn + động từ." },
    { id: "r6", section: "reading", zhPrompt: true, prompt: "我 ___ 有 钱 。", options: ["没|méi", "不", "很"], explanation: "Phủ định 有 là 没有." },
    { id: "r7", section: "reading", text: "我 明天 去 商店 买 水果 。", prompt: "Ngày mai người viết làm gì?", options: ["Đi cửa hàng mua hoa quả", "Đi bệnh viện", "Ở nhà ngủ"], explanation: "去商店买水果 = đi cửa hàng mua hoa quả." },
    { id: "r8", section: "reading", text: "王|Wáng 老师 今年 五十 岁 ， 她 有 一 个 女儿 。", prompt: "Câu nào đúng?", options: ["Cô Vương có một con gái", "Cô Vương 15 tuổi", "Cô Vương có một con trai"], explanation: "她有一个女儿; 五十岁 là 50 tuổi." },
    { id: "r9", section: "reading", text: "你好 ！ 请问 ， 你 是 哪 国 人 ？", prompt: "Câu trả lời phù hợp là?", options: ["我 是 越南|Yuè-nán 人 。", "我 很 好 。", "我 二十 岁 。"], explanation: "Câu hỏi quốc tịch (哪国人) → trả lời 我是越南人." },
    { id: "r10", section: "reading", text: "我 喜欢 吃 米饭 ， 也 喜欢 吃 面条儿 。", prompt: "Người viết thích ăn gì?", options: ["Cơm và mì", "Chỉ ăn cơm", "Bánh mì"], explanation: "米饭 (cơm) … 也喜欢 … 面条儿 (mì)." },
  ],
};

export const ZH_MOCKS: Record<string, MockTest> = { hsk1: HSK1_MOCK };
