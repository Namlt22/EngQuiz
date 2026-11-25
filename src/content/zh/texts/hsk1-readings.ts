/**
 * 6 bài đọc ngắn HSK 1. Chỉ dùng từ HSK 1 + tên riêng ghi kèm pinyin (test: src/content/zh/texts.test.ts).
 * Đáp án đúng của câu hỏi luôn là lựa chọn đầu tiên (giao diện tự xáo).
 */
import type { ZhTextLesson } from "./types";

export const HSK1_READINGS: ZhTextLesson[] = [
  {
    id: "r1-my-family",
    kind: "reading",
    level: 1,
    title: "Gia đình tôi",
    zhTitle: "我 的 家",
    scene: "Lan tự giới thiệu về bản thân và gia đình.",
    lines: [
      { zh: "我 叫 兰|Lán ， 是 越南|Yuè-nán 人 。", vi: "Tôi tên là Lan, là người Việt Nam." },
      { zh: "我 今年 二十 岁 ， 是 大学生 。", vi: "Năm nay tôi hai mươi tuổi, là sinh viên." },
      { zh: "我 家 有 四 口 人 ： 爸爸 、 妈妈 、 弟弟 和 我 。", vi: "Nhà tôi có bốn người: bố, mẹ, em trai và tôi." },
      { zh: "我 爸爸 是 医生 ， 妈妈 是 老师 。", vi: "Bố tôi là bác sĩ, mẹ tôi là giáo viên." },
      { zh: "弟弟 十 岁 ， 是 小学生 。", vi: "Em trai mười tuổi, là học sinh tiểu học." },
      { zh: "我 很 爱 我 的 家 。", vi: "Tôi rất yêu gia đình mình." },
    ],
    questions: [
      { id: "r1-q1", prompt: "Lan bao nhiêu tuổi?", options: ["20 tuổi", "18 tuổi", "22 tuổi"], explanation: "我今年二十岁。" },
      { id: "r1-q2", prompt: "Mẹ Lan làm nghề gì?", options: ["Giáo viên", "Bác sĩ", "Sinh viên"], explanation: "妈妈是老师。" },
      { id: "r1-q3", prompt: "Em trai Lan là ai?", options: ["Học sinh tiểu học, 10 tuổi", "Sinh viên, 20 tuổi", "Bác sĩ"], explanation: "弟弟十岁，是小学生。" },
    ],
  },
  {
    id: "r2-my-day",
    kind: "reading",
    level: 1,
    title: "Một ngày của tôi",
    zhTitle: "我 的 一 天",
    scene: "Lịch sinh hoạt một ngày đi học.",
    lines: [
      { zh: "我 早上 七 点 起床 ， 七 点 半 吃 早饭 。", vi: "Tôi dậy lúc bảy giờ sáng, bảy rưỡi ăn sáng." },
      { zh: "八 点 我 去 学校 上课 。", vi: "Tám giờ tôi đến trường học." },
      { zh: "中午 十二 点 ， 我 和 同学 吃 午饭 。", vi: "Mười hai giờ trưa, tôi ăn trưa với bạn học." },
      { zh: "下午 我 在 家 学习 汉语 。", vi: "Buổi chiều tôi học tiếng Trung ở nhà." },
      { zh: "晚上 六 点 ， 我 和 家人 吃 晚饭 。", vi: "Sáu giờ tối, tôi ăn tối với gia đình." },
      { zh: "吃 了 晚饭 ， 我 看 电视 。 我 十一 点 睡觉 。", vi: "Ăn tối xong, tôi xem ti vi. Mười một giờ tôi đi ngủ." },
    ],
    questions: [
      { id: "r2-q1", prompt: "Tôi ăn sáng lúc mấy giờ?", options: ["7 giờ 30", "7 giờ", "8 giờ"], explanation: "七点半吃早饭。" },
      { id: "r2-q2", prompt: "Buổi chiều tôi làm gì?", options: ["Học tiếng Trung ở nhà", "Đi làm", "Xem phim"], explanation: "下午我在家学习汉语。" },
      { id: "r2-q3", prompt: "Tôi đi ngủ lúc mấy giờ?", options: ["11 giờ", "10 giờ", "12 giờ"], explanation: "我十一点睡觉。" },
    ],
  },
  {
    id: "r3-my-friend",
    kind: "reading",
    level: 1,
    title: "Bạn tôi",
    zhTitle: "我 的 中国 朋友",
    scene: "Giới thiệu một người bạn Trung Quốc.",
    lines: [
      { zh: "我 有 一 个 中国 朋友 ， 她 叫 王|Wáng 月|Yuè 。", vi: "Tôi có một người bạn Trung Quốc, cô ấy tên là Vương Nguyệt." },
      { zh: "她 是 我 的 同学 ， 今年 二十一 岁 。", vi: "Cô ấy là bạn học của tôi, năm nay hai mươi mốt tuổi." },
      { zh: "她 在 越南|Yuè-nán 学习 ， 住 在 学校 里 。", vi: "Cô ấy học ở Việt Nam, sống trong trường." },
      { zh: "她 很 喜欢 越南|Yuè-nán 菜 。", vi: "Cô ấy rất thích món ăn Việt Nam." },
      { zh: "星期天 我们 去 商店 买 衣服 。", vi: "Chủ nhật chúng tôi đi cửa hàng mua quần áo." },
      { zh: "她 说 ： “ 这里 的 衣服 很 漂亮 ， 也 很 便宜 。 ”", vi: "Cô ấy nói: \"Quần áo ở đây rất đẹp, cũng rất rẻ.\"" },
    ],
    questions: [
      { id: "r3-q1", prompt: "Vương Nguyệt là người nước nào?", options: ["Trung Quốc", "Việt Nam", "Không rõ"], explanation: "我有一个中国朋友。" },
      { id: "r3-q2", prompt: "Cô ấy thích gì?", options: ["Món ăn Việt Nam", "Xem phim", "Học tiếng Anh"], explanation: "她很喜欢越南菜。" },
      { id: "r3-q3", prompt: "Cô ấy thấy quần áo ở cửa hàng thế nào?", options: ["Đẹp và rẻ", "Đẹp nhưng đắt", "Không đẹp"], explanation: "很漂亮，也很便宜。" },
    ],
  },
  {
    id: "r4-shopping",
    kind: "reading",
    level: 1,
    title: "Đi mua sắm cuối tuần",
    zhTitle: "去 商店",
    scene: "Thứ Bảy đi mua đồ cùng mẹ.",
    lines: [
      { zh: "今天 是 星期 六 ， 我 和 妈妈 去 商店 买 东西 。", vi: "Hôm nay là thứ Bảy, tôi và mẹ đi cửa hàng mua đồ." },
      { zh: "商店 里 人 很 多 。", vi: "Trong cửa hàng rất đông người." },
      { zh: "妈妈 买 了 一 件 衣服 ， 三百 块 钱 。", vi: "Mẹ mua một chiếc áo, ba trăm đồng." },
      { zh: "我 想 买 一 本 书 ， 书 有点儿 贵 ， 我 没有 买 。", vi: "Tôi muốn mua một quyển sách, sách hơi đắt nên tôi không mua." },
      { zh: "我们 还 买 了 水果 和 牛奶 。", vi: "Chúng tôi còn mua hoa quả và sữa." },
      { zh: "中午 我们 在 饭店 吃 了 饺子 。", vi: "Buổi trưa chúng tôi ăn sủi cảo ở nhà hàng." },
    ],
    questions: [
      { id: "r4-q1", prompt: "Hôm nay là thứ mấy?", options: ["Thứ Bảy", "Thứ Sáu", "Chủ nhật"], explanation: "今天是星期六。" },
      { id: "r4-q2", prompt: "Áo của mẹ giá bao nhiêu?", options: ["300 đồng", "30 đồng", "3000 đồng"], explanation: "三百块钱。" },
      { id: "r4-q3", prompt: "Vì sao tôi không mua sách?", options: ["Sách hơi đắt", "Không thích sách", "Cửa hàng hết sách"], explanation: "书有点儿贵，我没有买。" },
    ],
  },
  {
    id: "r5-weather",
    kind: "reading",
    level: 1,
    title: "Thời tiết hôm nay",
    zhTitle: "今天 天气 怎么样",
    scene: "Trời lạnh và mưa, ở nhà đọc sách.",
    lines: [
      { zh: "今天 天气 不 好 ， 很 冷 ， 还 下雨 。", vi: "Hôm nay thời tiết không tốt, rất lạnh, lại còn mưa." },
      { zh: "我 不 想 去 外边 。", vi: "Tôi không muốn ra ngoài." },
      { zh: "我 在 家 看 书 、 喝 茶 。", vi: "Tôi ở nhà đọc sách, uống trà." },
      { zh: "明天 天气 怎么样 ？ 我 看 了 手机 。", vi: "Ngày mai thời tiết thế nào? Tôi xem điện thoại." },
      { zh: "明天 不 下雨 ， 也 不 冷 。", vi: "Ngày mai không mưa, cũng không lạnh." },
      { zh: "明天 我 想 和 朋友 去 外边 玩 。", vi: "Ngày mai tôi muốn ra ngoài chơi với bạn." },
    ],
    questions: [
      { id: "r5-q1", prompt: "Thời tiết hôm nay thế nào?", options: ["Lạnh và mưa", "Nóng", "Đẹp, không mưa"], explanation: "很冷，还下雨。" },
      { id: "r5-q2", prompt: "Hôm nay tôi làm gì?", options: ["Ở nhà đọc sách, uống trà", "Đi chơi với bạn", "Đi làm"], explanation: "我在家看书、喝茶。" },
      { id: "r5-q3", prompt: "Ngày mai tôi muốn làm gì?", options: ["Ra ngoài chơi với bạn", "Ngủ cả ngày", "Đi khám bệnh"], explanation: "明天我想和朋友去外边玩。" },
    ],
  },
  {
    id: "r6-work",
    kind: "reading",
    level: 1,
    title: "Công việc của anh trai",
    zhTitle: "我 哥哥 的 工作",
    scene: "Một ngày đi làm của anh trai.",
    lines: [
      { zh: "我 哥哥 在 一 个 公司 工作 。", vi: "Anh trai tôi làm việc ở một công ty." },
      { zh: "他 早上 八 点 半 上班 ， 下午 五 点 下班 。", vi: "Anh ấy đi làm lúc tám rưỡi sáng, tan làm lúc năm giờ chiều." },
      { zh: "他 开车 去 公司 。", vi: "Anh ấy lái xe đến công ty." },
      { zh: "他 工作 很 忙 ， 中午 只 有 一 个 小时 吃 饭 。", vi: "Công việc của anh ấy rất bận, buổi trưa chỉ có một tiếng ăn cơm." },
      { zh: "晚上 回 家 ， 他 喜欢 做饭 。", vi: "Buổi tối về nhà, anh ấy thích nấu ăn." },
      { zh: "他 做 的 菜 非常 好吃 ！", vi: "Món anh ấy nấu cực kỳ ngon!" },
    ],
    questions: [
      { id: "r6-q1", prompt: "Anh trai làm việc ở đâu?", options: ["Công ty", "Bệnh viện", "Trường học"], explanation: "我哥哥在一个公司工作。" },
      { id: "r6-q2", prompt: "Anh ấy tan làm lúc mấy giờ?", options: ["5 giờ chiều", "8 giờ 30 sáng", "12 giờ trưa"], explanation: "下午五点下班。" },
      { id: "r6-q3", prompt: "Anh ấy đến công ty bằng gì?", options: ["Lái xe", "Taxi", "Tàu hoả"], explanation: "他开车去公司。" },
    ],
  },
];
