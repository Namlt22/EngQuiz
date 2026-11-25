/**
 * Ngữ pháp HSK 1 — bài 7–12. Câu ví dụ chỉ dùng từ HSK 1 (test: src/content/zh/grammar.test.ts).
 */
import type { ZhGrammarLesson } from "./types";

export const HSK1_GRAMMAR_B: ZhGrammarLesson[] = [
  {
    id: "time-expressions",
    level: 1,
    title: "Ngày tháng, giờ giấc và vị trí của thời gian trong câu",
    points: ["时间表达 · cách nói thời gian (年 / 月 / 号 / 星期 / 点 / 分 / 半)", "名词谓语句 · câu vị ngữ danh từ", "时间状语的位置 · vị trí trạng ngữ thời gian"],
    intro: "Hỏi và nói ngày, thứ, giờ — và đặt thời gian đúng chỗ trong câu.",
    blocks: [
      { type: "summary", text: "Tiếng Trung đi từ LỚN đến NHỎ: năm → tháng → ngày → thứ → buổi → giờ (ngược tiếng Việt). Thời gian là trạng ngữ, đứng TRƯỚC động từ (sau hoặc trước chủ ngữ), không đứng cuối câu như tiếng Việt. Câu nói ngày, giờ, tuổi thường không cần 是." },
      {
        type: "formula",
        rows: [
          { label: "Ngày tháng", pattern: "… 年 + … 月 + … 号 + 星期 …", example: "九 月 十 号 星期 一" },
          { label: "Giờ", pattern: "… 点 (+ … 分 / 半)", example: "八 点 半" },
          { label: "Vị trí thời gian", pattern: "Chủ ngữ + Thời gian + Động từ (hoặc Thời gian + Chủ ngữ + Động từ)", example: "我 七 点 起床 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "今天 几 月 几 号 ？", vi: "Hôm nay ngày mấy tháng mấy?" },
          { zh: "今天 九 月 十 号 ， 星期 一 。", vi: "Hôm nay thứ Hai, ngày 10 tháng 9." },
          { zh: "现在 几 点 ？", vi: "Bây giờ mấy giờ?" },
          { zh: "现在 八 点 半 。", vi: "Bây giờ là 8 giờ rưỡi." },
          { zh: "我 早上 七 点 起床 。", vi: "Tôi dậy lúc 7 giờ sáng." },
          { zh: "明天 下午 我 去 医院 看病 。", vi: "Chiều mai tôi đi bệnh viện khám bệnh." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 起床 七 点 。", right: "我 七 点 起床 。", why: "Thời gian đứng trước động từ, không đứng cuối câu." },
          { wrong: "我 去 商店 明天 。", right: "我 明天 去 商店 。", why: "明天 là trạng ngữ thời gian → đứng trước 去." },
        ],
      },
      { type: "tip", text: "Thứ trong tuần = 星期 + số: 星期一 (thứ Hai) … 星期六 (thứ Bảy); chủ nhật là 星期日 hoặc 星期天. Ngày trong tháng khẩu ngữ dùng 号, văn viết dùng 日." },
    ],
    quiz: [
      { id: "time-1", type: "mcq", prompt: "\"Thứ Hai\" là?", options: ["星期 二", "星期 一", "一 星期"], answer: 1, explanation: "星期 + 一 = thứ Hai (thứ Hai là ngày đầu tuần)." },
      { id: "time-2", type: "mcq", prompt: "\"8 giờ rưỡi\" là?", options: ["八 点 半", "半 八 点", "八 半 点"], answer: 0, explanation: "Giờ + 点 + 半." },
      { id: "time-3", type: "mcq", prompt: "Câu nào ĐÚNG?", options: ["我 起床 七 点 。", "我 七 点 起床 。", "起床 我 七 点 。"], answer: 1, explanation: "Thời gian đứng trước động từ." },
      { id: "time-4", type: "order", vi: "Tôi dậy lúc 7 giờ sáng.", answers: ["我 早上 七 点 起床 。", "早上 七 点 我 起床 。"], explanation: "Buổi (早上) trước giờ (七点), cả cụm đứng trước 起床." },
      { id: "time-5", type: "order", vi: "Hôm nay ngày mấy tháng mấy?", answers: ["今天 几 月 几 号 ？"], explanation: "Tháng trước ngày; hỏi số nhỏ dùng 几." },
      { id: "time-6", type: "order", vi: "Chiều mai tôi đi bệnh viện.", answers: ["明天 下午 我 去 医院 。", "我 明天 下午 去 医院 。"], explanation: "明天下午 (ngày trước, buổi sau) đứng trước động từ 去." },
    ],
  },
  {
    id: "you-and-location",
    level: 1,
    title: "Câu chữ 有 và từ chỉ phương hướng (上, 里, 前, 后…)",
    points: ["有字句 · câu chữ 有 (sở hữu, tồn tại)", "否定 没有 · phủ định", "方位名词 · danh từ phương vị"],
    intro: "Nói mình có gì, ở đâu có gì: \"Trên bàn có một quyển sách\".",
    blocks: [
      { type: "summary", text: "有 (yǒu) = có. Phủ định của 有 là 没有 — KHÔNG BAO GIỜ nói 不有. Muốn nói \"ở chỗ nào có cái gì\", đặt nơi chốn lên đầu câu: Nơi chốn + 有 + Vật. Nơi chốn thường là danh từ + từ phương vị: 桌子上 (trên bàn), 房间里 (trong phòng)." },
      {
        type: "formula",
        rows: [
          { label: "Sở hữu", pattern: "Người + 有 / 没有 + Vật", example: "我 有 一 个 弟弟 。" },
          { label: "Tồn tại", pattern: "Nơi chốn + 有 + Số lượng + Vật", example: "桌子 上 有 一 本 书 。" },
          { label: "Phương vị", pattern: "Danh từ + 上 / 里 / 外边 / 前 / 后", example: "房间 里" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 有 两 个 妹妹 。", vi: "Tôi có hai em gái." },
          { zh: "我 没有 钱 。", vi: "Tôi không có tiền." },
          { zh: "桌子 上 有 一 个 杯子 。", vi: "Trên bàn có một cái cốc." },
          { zh: "房间 里 有 人 吗 ？", vi: "Trong phòng có người không?" },
          { zh: "学校 前 有 一 个 书店 。", vi: "Trước trường có một hiệu sách." },
          { zh: "外边 下雨 了 。", vi: "Bên ngoài mưa rồi." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 不 有 钱 。", right: "我 没有 钱 。", why: "有 chỉ phủ định bằng 没 → 没有." },
          { wrong: "有 一 本 书 在 桌子 上 。", right: "桌子 上 有 一 本 书 。", why: "Câu tồn tại: nơi chốn đứng ĐẦU câu, rồi mới đến 有 + vật." },
          { wrong: "上 桌子 有 书 。", right: "桌子 上 有 书 。", why: "Từ phương vị đứng SAU danh từ (\"bàn trên\"), ngược tiếng Việt (\"trên bàn\")." },
        ],
      },
    ],
    quiz: [
      { id: "you-1", type: "mcq", zhPrompt: true, prompt: "我 ___ 哥哥 ， 我 有 一 个 姐姐 。", options: ["不 有", "没有", "不 是"], answer: 1, explanation: "Phủ định 有 là 没有." },
      { id: "you-2", type: "mcq", prompt: "\"Trong phòng\" là?", options: ["里 房间", "房间 里", "房间 上"], answer: 1, explanation: "Danh từ + từ phương vị: 房间里." },
      { id: "you-3", type: "order", vi: "Trên bàn có một quyển sách.", answers: ["桌子 上 有 一 本 书 。"], explanation: "Nơi chốn (桌子上) + 有 + 一本书." },
      { id: "you-4", type: "order", vi: "Tôi không có điện thoại.", answers: ["我 没有 手机 。"], explanation: "没有 + vật." },
      { id: "you-5", type: "mcq", prompt: "Câu nào ĐÚNG?", options: ["有 一 个 书店 在 学校 前 。", "学校 前 有 一 个 书店 。", "前 学校 有 一 个 书店 。"], answer: 1, explanation: "Câu tồn tại bắt đầu bằng nơi chốn; từ phương vị đứng sau danh từ." },
      { id: "you-6", type: "mcq", zhPrompt: true, prompt: "你 有 ___ 有 弟弟 ？", options: ["不", "没|méi", "吗"], answer: 1, explanation: "Câu chính phản của 有: 有没有." },
    ],
  },
  {
    id: "zai",
    level: 1,
    title: "在: ở đâu và làm gì ở đâu",
    points: ["动词 在 · động từ 在 (ở)", "介词 在 · giới từ 在 (tại)", "处所状语的位置 · vị trí trạng ngữ nơi chốn"],
    intro: "Lỗi số 1 của người Việt: \"Tôi làm việc ở công ty\" phải nói \"Tôi ở công ty làm việc\".",
    blocks: [
      { type: "summary", text: "在 làm động từ: \"ở\" (我在家). 在 làm giới từ: 在 + nơi chốn đặt TRƯỚC động từ chính (我在公司工作). Khác tiếng Việt: nơi chốn KHÔNG đứng sau động từ. Phủ định: 不在." },
      {
        type: "formula",
        rows: [
          { label: "Ở đâu", pattern: "Chủ ngữ + 在 + Nơi chốn", example: "妈妈 在 家 。" },
          { label: "Làm gì ở đâu", pattern: "Chủ ngữ + 在 + Nơi chốn + Động từ (+ Tân ngữ)", example: "我 在 公司 工作 。" },
          { label: "Hỏi", pattern: "Chủ ngữ + 在 + 哪儿 (+ Động từ)？", example: "你 在 哪儿 工作 ？" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "你 妈妈 在 家 吗 ？", vi: "Mẹ bạn có ở nhà không?" },
          { zh: "他 不 在 学校 。", vi: "Anh ấy không ở trường." },
          { zh: "我 姐姐 在 医院 工作 。", vi: "Chị tôi làm việc ở bệnh viện." },
          { zh: "我们 在 饭店 吃 饭 。", vi: "Chúng tôi ăn cơm ở nhà hàng." },
          { zh: "你 住 在 哪儿 ？", vi: "Bạn sống ở đâu?" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 工作 在 公司 。", right: "我 在 公司 工作 。", why: "在 + nơi chốn đứng trước động từ 工作." },
          { wrong: "我们 吃 饭 在 饭店 。", right: "我们 在 饭店 吃 饭 。", why: "Như trên: nơi chốn trước hành động." },
        ],
      },
      { type: "tip", text: "Một số động từ như 住 (ở), 坐 (ngồi) có thể đặt 在 phía sau: 住在北京, 坐在这儿. Ở HSK 1 chỉ cần nhớ 住在 + nơi chốn." },
    ],
    quiz: [
      { id: "zai-1", type: "mcq", prompt: "\"Tôi làm việc ở công ty\" là?", options: ["我 工作 在 公司 。", "我 在 公司 工作 。", "在 公司 我 工作 在 。"], answer: 1, explanation: "在 + nơi chốn + động từ." },
      { id: "zai-2", type: "mcq", zhPrompt: true, prompt: "他 ___ 在 家 ， 他 在 学校 。", options: ["没|méi", "不", "没有"], answer: 1, explanation: "Phủ định 在 dùng 不在." },
      { id: "zai-3", type: "order", vi: "Bạn làm việc ở đâu?", answers: ["你 在 哪儿 工作 ？"], explanation: "在 + 哪儿 + 工作." },
      { id: "zai-4", type: "order", vi: "Chúng tôi ăn cơm ở nhà hàng.", answers: ["我们 在 饭店 吃 饭 。"], explanation: "在饭店 đứng trước 吃饭." },
      { id: "zai-5", type: "order", vi: "Chị tôi làm việc ở bệnh viện.", answers: ["我 姐姐 在 医院 工作 。"], explanation: "在医院 đứng trước 工作." },
      { id: "zai-6", type: "mcq", zhPrompt: true, prompt: "你 妈妈 ___ 家 吗 ？", options: ["在", "有", "是"], answer: 0, explanation: "\"Ở nhà\" là 在家." },
    ],
  },
  {
    id: "modal-verbs",
    level: 1,
    title: "Động từ năng nguyện: 会, 能, 可以, 想, 要",
    points: ["能愿动词 会 / 能 / 可以 / 想 / 要 · động từ năng nguyện"],
    intro: "Biết làm, có thể làm, được phép làm, muốn làm.",
    blocks: [
      { type: "summary", text: "Năng nguyện động từ đứng TRƯỚC động từ chính. Phủ định thêm 不 trước nó: 不会, 不能, 不想. Mỗi từ có sắc thái riêng — người Việt hay dùng lẫn vì tiếng Việt đều nói \"có thể\" hoặc \"muốn\"." },
      {
        type: "compare",
        title: "Phân biệt",
        headers: ["Từ", "Nghĩa chính", "Ví dụ"],
        rows: [
          ["会 huì", "biết (kỹ năng phải học mới có)", "我 会 说 汉语。"],
          ["能 néng", "có thể (có khả năng / điều kiện cho phép)", "我 今天 不 能 去。"],
          ["可以 kěyǐ", "được phép, có thể (xin phép, đề nghị)", "我 可以 坐 这儿 吗？"],
          ["想 xiǎng", "muốn (mong muốn, nhẹ nhàng)", "我 想 喝 茶。"],
          ["要 yào", "muốn / cần (ý chí mạnh, quyết định)", "我 要 买 这 个。"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "你 会 开车 吗 ？", vi: "Bạn biết lái xe không?" },
          { zh: "我 不 会 写 汉字 。", vi: "Tôi không biết viết chữ Hán." },
          { zh: "我 今天 很 忙 ， 不 能 去 。", vi: "Hôm nay tôi bận, không đi được." },
          { zh: "请问 ， 我 可以 坐 这儿 吗 ？", vi: "Xin hỏi, tôi ngồi đây được không?" },
          { zh: "我 想 去 中国 学习 汉语 。", vi: "Tôi muốn đi Trung Quốc học tiếng Trung." },
          { zh: "我 要 买 这 个 。", vi: "Tôi muốn (quyết định) mua cái này." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 能 说 汉语 。", right: "我 会 说 汉语 。", why: "Nói về kỹ năng đã học được (ngoại ngữ, lái xe) dùng 会." },
          { wrong: "我 要 不 去 。", right: "我 不 想 去 。", why: "Phủ định của 要 (muốn) thường dùng 不想; 不要 nghĩa là \"đừng\"." },
          { wrong: "我 想 吗 喝 茶 ？", right: "我 想 喝 茶 吗 ？", why: "吗 luôn ở cuối câu." },
        ],
      },
    ],
    quiz: [
      { id: "mod-1", type: "mcq", zhPrompt: true, prompt: "我 ___ 说 汉语 ， 我 学习 了 一 年 。", options: ["会", "要", "可以"], answer: 0, explanation: "Kỹ năng đã học: 会." },
      { id: "mod-2", type: "mcq", zhPrompt: true, prompt: "请问 ， 我 ___ 坐 这儿 吗 ？", options: ["会", "可以", "想"], answer: 1, explanation: "Xin phép: 可以." },
      { id: "mod-3", type: "mcq", zhPrompt: true, prompt: "我 今天 生病 了 ， 不 ___ 去 上班 。", options: ["会", "能", "要"], answer: 1, explanation: "Không có điều kiện để làm: 不能." },
      { id: "mod-4", type: "mcq", prompt: "\"Tôi không muốn đi\" là?", options: ["我 不要 去 。", "我 不 想 去 。", "我 没有 想 去 。"], answer: 1, explanation: "Không muốn: 不想. (不要 = đừng.)" },
      { id: "mod-5", type: "order", vi: "Bạn biết lái xe không?", answers: ["你 会 开车 吗 ？"], explanation: "会 + 开车 + 吗." },
      { id: "mod-6", type: "order", vi: "Tôi muốn uống trà.", answers: ["我 想 喝 茶 。"], explanation: "想 / 要 + động từ." },
    ],
  },
  {
    id: "adverbs",
    level: 1,
    title: "Phó từ 都, 也, 还, 再, 只 và phân biệt 不 / 没有",
    points: ["范围副词 都 / 只 · phó từ phạm vi", "关联副词 也 · phó từ liên kết", "时间副词 还 / 再 · phó từ thời gian", "否定副词 不 / 没(有) · phó từ phủ định"],
    intro: "Cũng, đều, vẫn, lại, chỉ — và hai cách nói \"không\".",
    blocks: [
      { type: "summary", text: "Phó từ luôn đứng SAU chủ ngữ, TRƯỚC động từ/tính từ. Khi có cả 也 và 都, 也 đứng trước: 我们也都是学生. 不 phủ định thói quen, ý muốn, tương lai, tính chất (不去, 不喜欢); 没有 phủ định việc ĐÃ xảy ra (没有去 = đã không đi / chưa đi)." },
      {
        type: "compare",
        title: "Phó từ HSK 1",
        headers: ["Từ", "Nghĩa", "Ví dụ"],
        rows: [
          ["也 yě", "cũng", "我 也 是 学生。"],
          ["都 dōu", "đều (tổng hợp những gì đứng TRƯỚC nó)", "我们 都 喜欢 猫。"],
          ["还 hái", "vẫn, còn", "他 还 在 学校。"],
          ["再 zài", "lại, nữa (lặp lại ở tương lai)", "明天 再 来 吧。"],
          ["只 zhǐ", "chỉ", "我 只 有 五 块 钱。"],
        ],
      },
      {
        type: "compare",
        title: "不 hay 没有?",
        headers: ["", "不", "没有"],
        rows: [
          ["Dùng cho", "thói quen, ý muốn, tương lai, tính chất", "việc đã (không) xảy ra, phủ định 有"],
          ["Ví dụ", "我 不 喝 茶。 (Tôi không uống trà — thói quen)", "我 没有 喝 茶。 (Tôi đã không / chưa uống trà)"],
          ["Với tính từ", "不 贵 (không đắt)", "— (không dùng)"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 也 喜欢 喝 茶 。", vi: "Tôi cũng thích uống trà." },
          { zh: "我们 也 都 是 学生 。", vi: "Chúng tôi cũng đều là học sinh." },
          { zh: "他 还 没有 起床 。", vi: "Anh ấy vẫn chưa dậy." },
          { zh: "明天 再 来 吧 。", vi: "Mai lại đến nhé." },
          { zh: "昨天 我 没有 去 学校 。", vi: "Hôm qua tôi không đi học." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 喜欢 也 喝 茶 。", right: "我 也 喜欢 喝 茶 。", why: "也 đứng trước động từ đầu tiên (喜欢)." },
          { wrong: "我们 都 也 是 学生 。", right: "我们 也 都 是 学生 。", why: "Thứ tự cố định: 也 trước 都." },
          { wrong: "昨天 我 不 去 学校 。", right: "昨天 我 没有 去 学校 。", why: "Việc đã qua (昨天) phủ định bằng 没有." },
        ],
      },
    ],
    quiz: [
      { id: "adv-1", type: "mcq", zhPrompt: true, prompt: "他 是 老师 ， 我 ___ 是 老师 。", options: ["也", "都", "还"], answer: 0, explanation: "\"Tôi cũng là giáo viên\": 也." },
      { id: "adv-2", type: "mcq", zhPrompt: true, prompt: "昨天 我 ___ 去 商店 。", options: ["不", "没有", "不要"], answer: 1, explanation: "Việc đã qua: 没有." },
      { id: "adv-3", type: "mcq", zhPrompt: true, prompt: "我 ___ 喝 茶 ， 我 喜欢 喝 水 。", options: ["不", "没有", "没|méi"], answer: 0, explanation: "Thói quen / sở thích: 不." },
      { id: "adv-4", type: "order", vi: "Chúng tôi cũng đều là học sinh.", answers: ["我们 也 都 是 学生 。"], explanation: "也 trước 都, cả hai trước 是." },
      { id: "adv-5", type: "order", vi: "Mai lại đến nhé.", answers: ["明天 再 来 吧 。"], explanation: "再 (lặp lại ở tương lai) trước 来; 吧 gợi ý." },
      { id: "adv-6", type: "mcq", prompt: "Câu nào SAI?", options: ["我 也 喜欢 猫 。", "他们 都 是 医生 。", "我 喜欢 也 狗 。"], answer: 2, explanation: "也 phải đứng trước động từ: 我也喜欢狗." },
    ],
  },
  {
    id: "le-zhengzai-ba",
    level: 1,
    title: "了, 正在…呢, 吧 và câu cầu khiến (请, 不要)",
    points: ["动态助词 了 · trợ từ động thái 了 (hoàn thành)", "语气助词 了 · trợ từ ngữ khí 了 (thay đổi)", "正在…呢 · đang (tiếp diễn)", "语气助词 吧 · đề nghị, phỏng đoán", "祈使句 请 / 不要 · câu cầu khiến"],
    intro: "Nói việc đã xong, việc đang làm, rủ rê và yêu cầu lịch sự.",
    blocks: [
      { type: "summary", text: "了 sau động từ: hành động đã hoàn thành (我买了一本书). 了 cuối câu: tình hình đã thay đổi (下雨了 — trời mưa rồi). Phủ định việc đã xảy ra: 没有 + động từ, BỎ 了. 正在 + động từ (+ 呢): đang làm. 吧 cuối câu: rủ rê, đề nghị (…nhé) hoặc đoán chừng (…phải không). 请 + động từ: mời, xin; 不要 + động từ: đừng." },
      {
        type: "formula",
        rows: [
          { label: "Đã làm xong", pattern: "Chủ ngữ + Động từ + 了 + (Số lượng) + Tân ngữ", example: "我 买 了 一 本 书 。" },
          { label: "Thay đổi", pattern: "… + 了 (cuối câu)", example: "天气 冷 了 。" },
          { label: "Phủ định", pattern: "Chủ ngữ + 没有 + Động từ (không có 了)", example: "我 没有 吃 饭 。" },
          { label: "Đang", pattern: "Chủ ngữ + 正在 + Động từ (+ 呢)", example: "他 正在 看 电视 呢 。" },
          { label: "Rủ rê", pattern: "… + 吧", example: "我们 去 吃 饭 吧 。" },
          { label: "Cầu khiến", pattern: "请 + Động từ / 不要 + Động từ", example: "请 坐 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 昨天 看 了 一 个 电影 。", vi: "Hôm qua tôi đã xem một bộ phim." },
          { zh: "你 吃 饭 了 吗 ？", vi: "Bạn ăn cơm chưa?" },
          { zh: "外边 下雨 了 。", vi: "Bên ngoài mưa rồi." },
          { zh: "妈妈 正在 做饭 呢 。", vi: "Mẹ đang nấu cơm." },
          { zh: "你 是 王|Wáng 老师 吧 ？", vi: "Thầy là thầy Vương phải không ạ?" },
          { zh: "请 喝 茶 。", vi: "Mời uống trà." },
          { zh: "上课 了 ， 不要 说话 。", vi: "Vào học rồi, đừng nói chuyện." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 没有 吃 饭 了 。", right: "我 没有 吃 饭 。", why: "Câu phủ định với 没有 không dùng 了." },
          { wrong: "我 了 买 一 本 书 。", right: "我 买 了 一 本 书 。", why: "了 hoàn thành đứng SAU động từ." },
        ],
      },
      { type: "tip", text: "了 KHÔNG tương đương \"đã\": việc làm hằng ngày trong quá khứ thường không có 了, còn 了 cuối câu có thể nói về sự thay đổi ngay lúc này (天气热了 — trời nóng lên rồi)." },
    ],
    quiz: [
      { id: "le-1", type: "mcq", zhPrompt: true, prompt: "我 买 ___ 两 本 书 。", options: ["了", "吧", "呢"], answer: 0, explanation: "Hành động đã hoàn thành: 了 sau động từ." },
      { id: "le-2", type: "mcq", prompt: "\"Tôi chưa ăn cơm\" là?", options: ["我 没有 吃 饭 了 。", "我 没有 吃 饭 。", "我 不 吃 饭 了 。"], answer: 1, explanation: "没有 + động từ, không có 了." },
      { id: "le-3", type: "mcq", zhPrompt: true, prompt: "我们 去 吃 饭 ___ 。", options: ["吗", "吧", "了"], answer: 1, explanation: "Rủ rê: 吧." },
      { id: "le-4", type: "order", vi: "Mẹ đang nấu cơm.", answers: ["妈妈 正在 做饭 呢 。"], explanation: "正在 + động từ (+ 呢)." },
      { id: "le-5", type: "order", vi: "Bạn ăn cơm chưa?", answers: ["你 吃 饭 了 吗 ？"], explanation: "Hỏi việc đã làm chưa: …了吗?" },
      { id: "le-6", type: "mcq", zhPrompt: true, prompt: "___ 坐 ， ___ 喝 茶 。", options: ["请 … 请", "不要 … 请", "吧 … 吧"], answer: 0, explanation: "Mời lịch sự: 请 + động từ." },
      { id: "le-7", type: "mcq", prompt: "Câu nào nói \"Trời mưa rồi\"?", options: ["下雨 了 。", "了 下雨 。", "下 了 雨 吗 。"], answer: 0, explanation: "了 cuối câu chỉ tình hình thay đổi." },
    ],
  },
];
