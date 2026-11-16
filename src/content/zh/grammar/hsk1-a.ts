/**
 * Ngữ pháp HSK 1 — bài 1–6. Câu ví dụ chỉ dùng từ HSK 1 (test: src/content/zh/grammar.test.ts).
 * Điểm ngữ pháp bám danh mục cấp 1 của GF 0025-2021; lời giải thích do EngQuiz soạn.
 */
import type { ZhGrammarLesson } from "./types";

export const HSK1_GRAMMAR_A: ZhGrammarLesson[] = [
  {
    id: "shi-sentence",
    level: 1,
    title: "Câu chữ 是: A là B",
    points: ["是字句 · câu chữ 是", "否定 不 是 · phủ định"],
    intro: "Câu đầu tiên của mọi người học: giới thiệu mình là ai, cái gì là cái gì.",
    blocks: [
      { type: "summary", text: "是 (shì) nối hai danh từ, nghĩa là \"là\". Phủ định thêm 不 trước 是 → 不是. Động từ tiếng Trung không chia theo ngôi hay thì: 我是, 你是, 他是 đều giữ nguyên 是." },
      {
        type: "formula",
        rows: [
          { label: "Khẳng định", pattern: "Chủ ngữ + 是 + Danh từ", example: "我 是 学生 。" },
          { label: "Phủ định", pattern: "Chủ ngữ + 不 是 + Danh từ", example: "他 不 是 老师 。" },
        ],
      },
      {
        type: "usage",
        title: "Giới thiệu nghề nghiệp, quan hệ, quốc tịch",
        examples: [
          { zh: "我 是 中国 人 。", vi: "Tôi là người Trung Quốc." },
          { zh: "她 是 我 妈妈 。", vi: "Bà ấy là mẹ tôi." },
          { zh: "王|Wáng 先生 是 医生 。", vi: "Ông Vương là bác sĩ." },
          { zh: "这 是 我 的 书 。", vi: "Đây là sách của tôi." },
          { zh: "那 不 是 我 的 杯子 。", vi: "Kia không phải cốc của tôi." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 是 很 忙 。", right: "我 很 忙 。", why: "Trước tính từ KHÔNG dùng 是. Câu tả tính chất dùng 很 + tính từ (xem bài Câu tính từ)." },
          { wrong: "他 是 不 老师 。", right: "他 不 是 老师 。", why: "不 đứng TRƯỚC 是: \"không phải là\", không nói \"là không\"." },
        ],
      },
      { type: "tip", text: "Khi đọc, 不 是 biến điệu thành bú shì vì 是 là thanh 4." },
    ],
    quiz: [
      { id: "shi-1", type: "mcq", zhPrompt: true, prompt: "我 ___ 学生 。", options: ["是", "很", "有"], answer: 0, explanation: "Nối chủ ngữ với danh từ (学生) dùng 是." },
      { id: "shi-2", type: "mcq", zhPrompt: true, prompt: "他 ___ 老师 ， 他 是 学生 。", options: ["是", "不 是", "没有"], answer: 1, explanation: "Vế sau nói anh ấy là học sinh, nên vế trước phủ định: 不是老师." },
      { id: "shi-3", type: "mcq", prompt: "Câu nào SAI?", options: ["我 是 医生 。", "她 是 很 漂亮 。", "这 是 我 的 书 。"], answer: 1, explanation: "Trước tính từ (漂亮) không dùng 是: 她很漂亮." },
      { id: "shi-4", type: "order", vi: "Bà ấy là mẹ tôi.", answers: ["她 是 我 妈妈 。"], explanation: "Chủ ngữ 她 + 是 + 我妈妈 (quan hệ gia đình thân thiết thường bỏ 的)." },
      { id: "shi-5", type: "order", vi: "Kia không phải sách của tôi.", answers: ["那 不 是 我 的 书 。"], explanation: "那 + 不 是 + 我的书." },
      { id: "shi-6", type: "mcq", zhPrompt: true, prompt: "你 是 中国 人 吗 ？ — 不 ， 我 ___ 中国 人 。", options: ["是", "不 是", "不"], answer: 1, explanation: "Trả lời phủ định câu chữ 是: 不是." },
    ],
  },
  {
    id: "questions-ma",
    level: 1,
    title: "Câu hỏi có/không: 吗 và 是不是",
    points: ["吗问句 · câu hỏi với 吗", "正反问句 · câu hỏi chính phản V不V", "呢 省略问句 · câu hỏi rút gọn với 呢"],
    intro: "Ba cách đặt câu hỏi \"có phải không / có không\" và cách hỏi lại \"còn bạn thì sao\".",
    blocks: [
      { type: "summary", text: "Muốn hỏi có/không, chỉ cần thêm 吗 (ma) vào cuối câu kể — trật tự từ giữ nguyên. Cách thứ hai là lặp động từ/tính từ dạng khẳng định + phủ định: 是不是, 去不去, 好不好 (không dùng thêm 吗). 呢 (ne) đứng sau danh từ để hỏi lại: \"còn … thì sao?\"." },
      {
        type: "formula",
        rows: [
          { label: "Hỏi với 吗", pattern: "Câu kể + 吗？", example: "你 是 老师 吗 ？" },
          { label: "Hỏi chính phản", pattern: "Chủ ngữ + V 不 V + …？", example: "你 去 不 去 ？" },
          { label: "Hỏi lại với 呢", pattern: "Danh từ / đại từ + 呢？", example: "我 很 好 ， 你 呢 ？" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "你 是 中国 人 吗 ？", vi: "Bạn là người Trung Quốc à?" },
          { zh: "你 喜欢 喝 茶 吗 ？", vi: "Bạn thích uống trà không?" },
          { zh: "他 是 不 是 你 哥哥 ？", vi: "Anh ấy có phải anh trai bạn không?" },
          { zh: "你 有 没有 手机 ？", vi: "Bạn có điện thoại không?" },
          { zh: "我 是 学生 ， 你 呢 ？", vi: "Tôi là học sinh, còn bạn?" },
        ],
      },
      { type: "compare", title: "Phủ định trong câu chính phản", headers: ["Động từ", "Dạng hỏi", "Nghĩa"], rows: [["是", "是不是", "có phải … không"], ["去", "去不去", "có đi không"], ["有", "有没有 (không phải 有不有)", "có … không"]] },
      {
        type: "mistakes",
        items: [
          { wrong: "你 是 不 是 老师 吗 ？", right: "你 是 不 是 老师 ？", why: "Câu chính phản đã là câu hỏi, không thêm 吗." },
          { wrong: "你 是 吗 学生 ？", right: "你 是 学生 吗 ？", why: "吗 luôn đứng CUỐI câu, không chen vào giữa." },
        ],
      },
      { type: "tip", text: "Trả lời câu hỏi có/không: lặp lại động từ — 你去吗？→ 去。/ 不去。 (tiếng Trung ít trả lời trống \"có\" / \"không\")." },
    ],
    quiz: [
      { id: "ma-1", type: "mcq", zhPrompt: true, prompt: "你 喜欢 猫 ___ ？", options: ["吗", "呢", "的"], answer: 0, explanation: "Câu hỏi có/không: thêm 吗 cuối câu." },
      { id: "ma-2", type: "mcq", zhPrompt: true, prompt: "我 很 好 ， 你 ___ ？", options: ["吗", "呢", "吧"], answer: 1, explanation: "Hỏi lại \"còn bạn thì sao\": 你呢." },
      { id: "ma-3", type: "mcq", prompt: "Dạng chính phản của 有 là?", options: ["有 不 有", "有 没有", "没有 有"], answer: 1, explanation: "有 phủ định bằng 没, nên hỏi 有没有." },
      { id: "ma-4", type: "mcq", prompt: "Câu nào SAI?", options: ["你 去 不 去 ？", "你 去 不 去 吗 ？", "你 去 吗 ？"], answer: 1, explanation: "Câu chính phản không thêm 吗." },
      { id: "ma-5", type: "order", vi: "Bạn có phải giáo viên không?", answers: ["你 是 老师 吗 ？"], explanation: "Hai cách: thêm 吗 cuối câu, hoặc dùng 是不是." },
      { id: "ma-6", type: "order", vi: "Bạn thích uống trà không?", answers: ["你 喜欢 喝 茶 吗 ？"], explanation: "Trật tự câu kể giữ nguyên, thêm 吗 cuối câu." },
    ],
  },
  {
    id: "pronouns-de",
    level: 1,
    title: "Đại từ nhân xưng, 们 và 的 sở hữu",
    points: ["人称代词 · đại từ nhân xưng", "们 · số nhiều", "结构助词 的 · trợ từ kết cấu 的"],
    intro: "Tôi, bạn, anh ấy, chúng tôi… và cách nói \"của tôi\".",
    blocks: [
      { type: "summary", text: "Đại từ: 我 (tôi), 你 (bạn), 您 (ngài — lịch sự), 他 / 她 / 它 (anh ấy / cô ấy / nó — cùng đọc tā). Thêm 们 để chỉ số nhiều: 我们, 你们, 他们. Sở hữu dùng 的: 我的书 = sách của tôi. Lưu ý trật tự NGƯỢC tiếng Việt: người sở hữu đứng TRƯỚC." },
      {
        type: "formula",
        rows: [
          { label: "Sở hữu", pattern: "Người / vật sở hữu + 的 + Danh từ", example: "我 的 手机" },
          { label: "Bỏ 的 (người thân, tổ chức gần gũi)", pattern: "Đại từ + Danh từ chỉ người thân", example: "我 妈妈" },
          { label: "Định ngữ tính từ", pattern: "Tính từ hai âm tiết / 很 + tính từ + 的 + Danh từ", example: "漂亮 的 衣服" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "这 是 我们 的 老师 。", vi: "Đây là thầy giáo của chúng tôi." },
          { zh: "你 的 名字 是 什么 ？", vi: "Tên bạn là gì?" },
          { zh: "他 是 我 朋友 。", vi: "Anh ấy là bạn tôi." },
          { zh: "我们 的 学校 很 大 。", vi: "Trường của chúng tôi rất to." },
          { zh: "她 有 很 多 漂亮 的 衣服 。", vi: "Cô ấy có rất nhiều quần áo đẹp." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "书 的 我", right: "我 的 书", why: "Tiếng Việt nói \"sách của tôi\", tiếng Trung nói \"tôi của sách\": người sở hữu đứng trước 的." },
          { wrong: "三 个 朋友 们", right: "三 个 朋友", why: "Đã có số lượng (三个) thì không thêm 们." },
        ],
      },
      { type: "tip", text: "您 dùng khi nói với người lớn tuổi, khách hàng, cấp trên. 您 không có dạng 您们 trong khẩu ngữ thông thường — nói 你们 hoặc 大家." },
    ],
    quiz: [
      { id: "de-1", type: "mcq", prompt: "\"Sách của tôi\" là?", options: ["书 的 我", "我 的 书", "我 书 的"], answer: 1, explanation: "Người sở hữu + 的 + vật." },
      { id: "de-2", type: "mcq", prompt: "\"Chúng tôi\" là?", options: ["我们", "我 的", "你们"], answer: 0, explanation: "我 + 们 = chúng tôi." },
      { id: "de-3", type: "mcq", prompt: "Nói với thầy giáo lớn tuổi, chọn cách xưng hô lịch sự:", options: ["你", "您", "他"], answer: 1, explanation: "您 là \"ngài\", dùng để tỏ ý tôn trọng." },
      { id: "de-4", type: "order", vi: "Tên bạn là gì?", answers: ["你 叫 什么 名字 ？"], explanation: "Cách hỏi tên thông dụng: 你叫什么名字 (cũng có thể nói 你的名字是什么)." },
      { id: "de-5", type: "order", vi: "Đây là điện thoại của anh ấy.", answers: ["这 是 他 的 手机 。"], explanation: "这 + 是 + 他的手机." },
      { id: "de-6", type: "mcq", zhPrompt: true, prompt: "她 是 我 ___ 妈妈 。", options: ["的", "们", "很"], answer: 0, explanation: "我的妈妈 đúng; nói gọn 我妈妈 cũng đúng. Trong lựa chọn chỉ 的 hợp lệ." },
    ],
  },
  {
    id: "adjective-predicate",
    level: 1,
    title: "Câu tính từ: 很 + tính từ, 太…了, 非常, 真",
    points: ["形容词谓语句 · câu vị ngữ tính từ", "程度副词 很/太/非常/真 · phó từ mức độ"],
    intro: "Tả người, vật, thời tiết: đẹp, đắt, lạnh, bận… mà không cần 是.",
    blocks: [
      { type: "summary", text: "Tính từ làm vị ngữ trực tiếp, KHÔNG có 是. Câu khẳng định thường thêm 很 trước tính từ — ở đây 很 thường không mang nghĩa \"rất\" rõ rệt mà để câu tròn ý. Phủ định: 不 + tính từ (không dùng 很). Mức độ mạnh: 非常 (vô cùng), 真 (thật là), 太…了 (quá…)." },
      {
        type: "formula",
        rows: [
          { label: "Khẳng định", pattern: "Chủ ngữ + 很 + Tính từ", example: "今天 很 冷 。" },
          { label: "Phủ định", pattern: "Chủ ngữ + 不 + Tính từ", example: "这 个 不 贵 。" },
          { label: "Quá …", pattern: "Chủ ngữ + 太 + Tính từ + 了", example: "这 件 衣服 太 贵 了 。" },
          { label: "Hỏi", pattern: "Chủ ngữ + Tính từ + 吗？ / Tính từ 不 Tính từ？", example: "你 忙 不 忙 ？" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 今天 很 忙 。", vi: "Hôm nay tôi bận." },
          { zh: "苹果 不 贵 ， 很 便宜 。", vi: "Táo không đắt, rẻ lắm." },
          { zh: "你 的 女儿 真 漂亮 ！", vi: "Con gái bạn đẹp thật!" },
          { zh: "今天 太 热 了 ！", vi: "Hôm nay nóng quá!" },
          { zh: "我 非常 高兴 。", vi: "Tôi vô cùng vui." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 是 忙 。", right: "我 很 忙 。", why: "Tính từ làm vị ngữ không cần 是." },
          { wrong: "今天 不 很 冷 。", right: "今天 不 冷 。", why: "Phủ định tính từ chỉ dùng 不, bỏ 很. (不很冷 có tồn tại nhưng nghĩa là \"không lạnh lắm\", ít dùng ở trình độ này.)" },
          { wrong: "太 贵 。", right: "太 贵 了 。", why: "Mẫu cảm thán 太 … 了 cần 了 ở cuối." },
        ],
      },
    ],
    quiz: [
      { id: "adj-1", type: "mcq", zhPrompt: true, prompt: "今天 ___ 冷 。", options: ["是", "很", "有"], answer: 1, explanation: "Câu tính từ: 很 + tính từ." },
      { id: "adj-2", type: "mcq", prompt: "\"Cái này không đắt\" là?", options: ["这 个 不 很 贵 。", "这 个 不 贵 。", "这 个 不 是 贵 。"], answer: 1, explanation: "Phủ định tính từ: 不 + tính từ." },
      { id: "adj-3", type: "mcq", zhPrompt: true, prompt: "这 件 衣服 太 贵 ___ ！", options: ["吗", "了", "的"], answer: 1, explanation: "Mẫu 太 … 了." },
      { id: "adj-4", type: "order", vi: "Hôm nay nóng quá!", answers: ["今天 太 热 了 ！"], explanation: "今天 + 太热了." },
      { id: "adj-5", type: "order", vi: "Bạn có bận không?", answers: ["你 忙 不 忙 ？"], explanation: "Câu chính phản 忙不忙 hoặc thêm 吗." },
      { id: "adj-6", type: "mcq", prompt: "Câu nào ĐÚNG?", options: ["我 是 很 高兴 。", "我 很 高兴 。", "我 高兴 很 。"], answer: 1, explanation: "很 đứng trước tính từ, không có 是." },
    ],
  },
  {
    id: "question-words",
    level: 1,
    title: "Đại từ nghi vấn: 什么, 谁, 哪, 哪儿, 几, 多少, 怎么, 怎么样",
    points: ["疑问代词 · đại từ nghi vấn", "特指问句 · câu hỏi có từ để hỏi"],
    intro: "Hỏi cái gì, ai, ở đâu, bao nhiêu, thế nào.",
    blocks: [
      { type: "summary", text: "Điểm mấu chốt: từ để hỏi đứng ĐÚNG VỊ TRÍ của thông tin cần hỏi, trật tự câu không đổi — giống tiếng Việt. Câu đã có từ để hỏi thì KHÔNG thêm 吗." },
      {
        type: "compare",
        title: "Từ để hỏi thường gặp",
        headers: ["Từ", "Nghĩa", "Ví dụ"],
        rows: [
          ["什么 shénme", "cái gì", "你 叫 什么 名字？"],
          ["谁 shuí", "ai", "他 是 谁？"],
          ["哪 nǎ", "nào (+ lượng từ)", "你 是 哪 国 人？"],
          ["哪儿 nǎr / 哪里", "ở đâu", "你 去 哪儿？"],
          ["几 jǐ", "mấy (số nhỏ, thường < 10, cần lượng từ)", "你 家 有 几 口 人？"],
          ["多少 duōshao", "bao nhiêu (số bất kỳ)", "这 个 多少 钱？"],
          ["怎么 zěnme", "làm thế nào; sao (lại)", "这 个 字 怎么 写？"],
          ["怎么样 zěnmeyàng", "thế nào (hỏi ý kiến, tình trạng)", "今天 天气 怎么样？"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "你 叫 什么 名字 ？", vi: "Bạn tên là gì?" },
          { zh: "那 个 人 是 谁 ？", vi: "Người kia là ai?" },
          { zh: "你 是 哪 国 人 ？", vi: "Bạn là người nước nào?" },
          { zh: "你 家 有 几 口 人 ？", vi: "Nhà bạn có mấy người?" },
          { zh: "苹果 多少 钱 ？", vi: "Táo bao nhiêu tiền?" },
          { zh: "你 明天 去 哪儿 ？", vi: "Mai bạn đi đâu?" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "你 叫 什么 名字 吗 ？", right: "你 叫 什么 名字 ？", why: "Đã có từ để hỏi (什么) thì không thêm 吗." },
          { wrong: "什么 你 喜欢 ？", right: "你 喜欢 什么 ？", why: "Từ để hỏi đứng đúng chỗ của tân ngữ, không đưa lên đầu câu như tiếng Anh." },
          { wrong: "你 有 几 钱 ？", right: "你 有 多少 钱 ？", why: "几 dùng cho số nhỏ và cần lượng từ; hỏi tiền/số lớn dùng 多少." },
        ],
      },
    ],
    quiz: [
      { id: "qw-1", type: "mcq", zhPrompt: true, prompt: "你 叫 ___ 名字 ？", options: ["什么", "谁", "哪儿"], answer: 0, explanation: "Hỏi tên: 什么名字." },
      { id: "qw-2", type: "mcq", zhPrompt: true, prompt: "这 个 苹果 ___ 钱 ？", options: ["几", "多少", "怎么"], answer: 1, explanation: "Hỏi giá tiền: 多少钱." },
      { id: "qw-3", type: "mcq", zhPrompt: true, prompt: "你 家 有 ___ 口 人 ？", options: ["几", "多少", "什么"], answer: 0, explanation: "Số nhỏ + lượng từ 口: 几口人." },
      { id: "qw-4", type: "mcq", zhPrompt: true, prompt: "今天 天气 ___ ？", options: ["什么", "怎么样", "哪"], answer: 1, explanation: "Hỏi tình trạng, ý kiến: 怎么样." },
      { id: "qw-5", type: "order", vi: "Bạn là người nước nào?", answers: ["你 是 哪 国 人 ？"], explanation: "哪 + 国 đứng vào chỗ của thông tin cần hỏi." },
      { id: "qw-6", type: "order", vi: "Mai bạn đi đâu?", answers: ["你 明天 去 哪儿 ？", "明天 你 去 哪儿 ？"], explanation: "Thời gian đứng trước động từ; 哪儿 đứng sau 去." },
      { id: "qw-7", type: "mcq", prompt: "Câu nào SAI?", options: ["他 是 谁 ？", "你 喜欢 什么 ？", "你 去 哪儿 吗 ？"], answer: 2, explanation: "Có 哪儿 rồi thì bỏ 吗." },
    ],
  },
  {
    id: "numbers-measure-words",
    level: 1,
    title: "Số đếm và lượng từ: 个, 本, 口, 块, 件, 岁; 二 và 两",
    points: ["数词 · số từ", "量词 · lượng từ", "数量短语 · cụm số lượng", "钱数 · cách nói tiền"],
    intro: "Đếm đồ vật, nói tuổi, nói giá tiền.",
    blocks: [
      { type: "summary", text: "Giữa số và danh từ BẮT BUỘC có lượng từ: 一个人, 三本书 — giống tiếng Việt \"ba quyển sách\". Số 2 trước lượng từ đọc là 两 (liǎng), không phải 二: 两个人. Khi đếm số, số thứ tự, số điện thoại thì dùng 二." },
      {
        type: "formula",
        rows: [
          { label: "Cụm số lượng", pattern: "Số + Lượng từ + Danh từ", example: "三 本 书" },
          { label: "Chỉ định", pattern: "这 / 那 / 哪 + Lượng từ + Danh từ", example: "这 个 杯子" },
          { label: "Tuổi", pattern: "Chủ ngữ + Số + 岁", example: "我 二十 岁 。" },
          { label: "Tiền (khẩu ngữ)", pattern: "Số + 块 (+ 钱)", example: "五 块 钱" },
        ],
      },
      {
        type: "compare",
        title: "Lượng từ HSK 1",
        headers: ["Lượng từ", "Dùng cho", "Ví dụ"],
        rows: [
          ["个 gè", "người, đồ vật nói chung (lượng từ phổ biến nhất)", "一 个 朋友"],
          ["本 běn", "sách, vở", "两 本 书"],
          ["口 kǒu", "số người trong gia đình", "我 家 有 四 口 人"],
          ["件 jiàn", "áo, quần áo; sự việc", "一 件 衣服"],
          ["块 kuài", "đồng (tiền, khẩu ngữ); miếng", "十 块 钱"],
          ["岁 suì", "tuổi", "五 岁"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 有 两 个 哥哥 。", vi: "Tôi có hai anh trai." },
          { zh: "我 家 有 三 口 人 。", vi: "Nhà tôi có ba người." },
          { zh: "这 本 书 二十 块 钱 。", vi: "Quyển sách này 20 đồng." },
          { zh: "我 想 买 一 件 衣服 。", vi: "Tôi muốn mua một chiếc áo." },
          { zh: "她 女儿 五 岁 。", vi: "Con gái cô ấy năm tuổi." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 有 二 个 哥哥 。", right: "我 有 两 个 哥哥 。", why: "Trước lượng từ, số 2 là 两." },
          { wrong: "三 书", right: "三 本 书", why: "Không bỏ lượng từ giữa số và danh từ." },
          { wrong: "我 是 二十 岁 。", right: "我 二十 岁 。", why: "Nói tuổi không cần 是 (câu vị ngữ danh từ)." },
        ],
      },
      { type: "tip", text: "Số từ 11 đến 99 ghép như tiếng Việt: 十一 (mười một), 二十 (hai mươi), 三十五 (ba mươi lăm)." },
    ],
    quiz: [
      { id: "mw-1", type: "mcq", zhPrompt: true, prompt: "我 有 ___ 个 姐姐 。", options: ["二", "两", "几"], answer: 1, explanation: "Trước lượng từ dùng 两." },
      { id: "mw-2", type: "mcq", zhPrompt: true, prompt: "我 想 买 一 ___ 书 。", options: ["本", "个", "口"], answer: 0, explanation: "Lượng từ cho sách: 本." },
      { id: "mw-3", type: "mcq", zhPrompt: true, prompt: "你 家 有 几 ___ 人 ？", options: ["个", "口", "件"], answer: 1, explanation: "Hỏi số người trong gia đình: 几口人." },
      { id: "mw-4", type: "mcq", zhPrompt: true, prompt: "一 ___ 衣服", options: ["件", "本", "块"], answer: 0, explanation: "Áo, quần áo: 件." },
      { id: "mw-5", type: "order", vi: "Quyển sách này 20 đồng.", answers: ["这 本 书 二十 块 钱 。"], explanation: "这 + 本 + 书 + giá tiền (không cần 是)." },
      { id: "mw-6", type: "order", vi: "Tôi hai mươi tuổi.", answers: ["我 二十 岁 。"], explanation: "Chủ ngữ + số + 岁." },
      { id: "mw-7", type: "mcq", prompt: "Câu nào SAI?", options: ["我 有 三 个 朋友 。", "我 二 个 哥哥 。", "这 个 杯子 很 小 。"], answer: 1, explanation: "Thiếu động từ 有 và phải dùng 两: 我有两个哥哥." },
    ],
  },
];
