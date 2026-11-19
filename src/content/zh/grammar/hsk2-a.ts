/**
 * Ngữ pháp HSK 2 — bài 1–6. Câu ví dụ chỉ dùng từ HSK 1–2 (test: src/content/zh/grammar.test.ts).
 * Điểm ngữ pháp bám danh mục cấp 2 của GF 0025-2021; lời giải thích do EngQuiz soạn.
 */
import type { ZhGrammarLesson } from "./types";

export const HSK2_GRAMMAR_A: ZhGrammarLesson[] = [
  {
    id: "bi-comparison",
    level: 2,
    title: "So sánh: 比, 没有…这么 / 那么, 最",
    points: ["比字句 · câu so sánh với 比", "没有…这么 / 那么 · so sánh kém", "最 · so sánh nhất"],
    intro: "Ai cao hơn, cái nào đắt hơn, cái gì tốt nhất.",
    blocks: [
      { type: "summary", text: "A 比 B + tính từ: A … hơn B. Sau 比 KHÔNG dùng 很 / 非常 / 太. Muốn nói hơn bao nhiêu thì thêm sau tính từ: 一点儿 (một chút), 多了 (nhiều), hoặc con số. So sánh kém: A 没有 B (这么 / 那么) + tính từ. So sánh nhất: 最 + tính từ." },
      {
        type: "formula",
        rows: [
          { label: "Hơn", pattern: "A + 比 + B + Tính từ", example: "哥哥 比 我 高 。" },
          { label: "Hơn bao nhiêu", pattern: "A + 比 + B + Tính từ + 一点儿 / 多了 / số lượng", example: "他 比 我 大 两 岁 。" },
          { label: "Không bằng", pattern: "A + 没有 + B + (这么 / 那么) + Tính từ", example: "今天 没有 昨天 那么 冷 。" },
          { label: "Nhất", pattern: "最 + Tính từ", example: "他 是 我们 班 最 高 的 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "地铁 比 公交车 快 。", vi: "Tàu điện ngầm nhanh hơn xe buýt." },
          { zh: "这 件 衣服 比 那 件 便宜 一点儿 。", vi: "Chiếc áo này rẻ hơn chiếc kia một chút." },
          { zh: "我 的 房间 没有 你 的 那么 大 。", vi: "Phòng tôi không to bằng phòng bạn." },
          { zh: "今天 比 昨天 热 多 了 。", vi: "Hôm nay nóng hơn hôm qua nhiều." },
          { zh: "你 最 喜欢 什么 颜色 ？", vi: "Bạn thích màu gì nhất?" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "哥哥 比 我 很 高 。", right: "哥哥 比 我 高 。", why: "Câu có 比 không dùng 很 / 非常 / 太 trước tính từ." },
          { wrong: "他 比 我 两 岁 大 。", right: "他 比 我 大 两 岁 。", why: "Mức chênh lệch đứng SAU tính từ." },
          { wrong: "我 不 比 他 高 。", right: "我 没有 他 高 。", why: "Nói \"không cao bằng\" dùng 没有; 不比 mang ý khác (\"không hơn\", thường để phản bác)." },
        ],
      },
    ],
    quiz: [
      { id: "h2bi-1", type: "mcq", zhPrompt: true, prompt: "地铁 ___ 公交车 快 。", options: ["比", "很", "最"], answer: 0, explanation: "So sánh hơn: A 比 B + tính từ." },
      { id: "h2bi-2", type: "mcq", prompt: "Câu nào ĐÚNG?", options: ["他 比 我 很 高 。", "他 比 我 高 。", "他 很 比 我 高 。"], answer: 1, explanation: "Sau 比 không dùng 很." },
      { id: "h2bi-3", type: "mcq", zhPrompt: true, prompt: "他 比 我 大 ___ 。", options: ["两 岁", "很 多", "非常"], answer: 0, explanation: "Mức chênh lệch đứng sau tính từ: 大两岁." },
      { id: "h2bi-4", type: "mcq", zhPrompt: true, prompt: "今天 ___ 昨天 那么 冷 。", options: ["比", "没有", "不"], answer: 1, explanation: "Không lạnh bằng: 没有 … 那么 冷." },
      { id: "h2bi-5", type: "order", vi: "Tàu điện ngầm nhanh hơn xe buýt.", answers: ["地铁 比 公交车 快 。"], explanation: "A 比 B + tính từ." },
      { id: "h2bi-6", type: "order", vi: "Bạn thích màu gì nhất?", answers: ["你 最 喜欢 什么 颜色 ？"], explanation: "最 đứng trước động từ / tính từ." },
    ],
  },
  {
    id: "guo-experience",
    level: 2,
    title: "过: đã từng · 次: số lần",
    points: ["动态助词 过 · trợ từ động thái 过 (kinh nghiệm)", "动量补语 次 · bổ ngữ số lần"],
    intro: "Bạn đã từng đến Trung Quốc chưa? Tôi đã đi hai lần.",
    blocks: [
      { type: "summary", text: "V + 过: đã từng làm (trải nghiệm trong quá khứ, nay không còn tiếp diễn). Phủ định: 没(有) + V + 过 — vẫn giữ 过 (khác với 了). Hỏi: V + 过 + … + 吗? hoặc V + 过 + 没有? Số lần: V + 过 + số + 次 (+ tân ngữ)." },
      {
        type: "formula",
        rows: [
          { label: "Đã từng", pattern: "Chủ ngữ + V + 过 + Tân ngữ", example: "我 去 过 中国 。" },
          { label: "Chưa từng", pattern: "Chủ ngữ + 没有 + V + 过 + Tân ngữ", example: "我 没有 吃 过 饺子 。" },
          { label: "Số lần", pattern: "Chủ ngữ + V + 过 + Số + 次 + Tân ngữ", example: "我 去 过 两 次 中国 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "你 去 过 中国 吗 ？", vi: "Bạn đã từng đến Trung Quốc chưa?" },
          { zh: "我 看 过 这 个 电影 。", vi: "Tôi đã từng xem bộ phim này." },
          { zh: "她 没有 坐 过 飞机 。", vi: "Cô ấy chưa từng đi máy bay." },
          { zh: "我 去 过 三 次 。", vi: "Tôi đã đi ba lần." },
        ],
      },
      {
        type: "compare",
        title: "过 hay 了?",
        headers: ["", "过", "了"],
        rows: [
          ["Nghĩa", "trải nghiệm: đã từng (ít nhất một lần)", "hành động cụ thể đã xong"],
          ["Ví dụ", "我 吃 过 饺子。 (Tôi từng ăn sủi cảo)", "我 吃 了 饺子。 (Tôi đã ăn sủi cảo — bữa này)"],
          ["Phủ định", "没 吃 过 (giữ 过)", "没 吃 (bỏ 了)"],
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 没有 去 中国 。", right: "我 没有 去 过 中国 。", why: "Muốn nói \"chưa từng\" phải giữ 过; bỏ 过 thành \"(lần đó) đã không đi\"." },
          { wrong: "我 去 中国 过 。", right: "我 去 过 中国 。", why: "过 đứng ngay sau động từ, trước tân ngữ." },
        ],
      },
    ],
    quiz: [
      { id: "h2guo-1", type: "mcq", zhPrompt: true, prompt: "你 吃 ___ 饺子 吗 ？", options: ["过", "着", "得"], answer: 0, explanation: "Hỏi trải nghiệm \"đã từng\" → 过." },
      { id: "h2guo-2", type: "mcq", prompt: "\"Tôi chưa từng đi máy bay\" là?", options: ["我 没有 坐 飞机 。", "我 没有 坐 过 飞机 。", "我 不 坐 过 飞机 。"], answer: 1, explanation: "Chưa từng: 没有 + V + 过." },
      { id: "h2guo-3", type: "mcq", zhPrompt: true, prompt: "我 去 过 两 ___ 。", options: ["次", "个", "本"], answer: 0, explanation: "Số lần dùng 次." },
      { id: "h2guo-4", type: "mcq", prompt: "Câu nào SAI?", options: ["我 看 过 这 个 电影 。", "我 看 这 个 电影 过 。", "我 没有 看 过 这 个 电影 。"], answer: 1, explanation: "过 đứng ngay sau động từ." },
      { id: "h2guo-5", type: "order", vi: "Bạn đã từng đến Trung Quốc chưa?", answers: ["你 去 过 中国 吗 ？"], explanation: "V + 过 + tân ngữ + 吗?" },
      { id: "h2guo-6", type: "order", vi: "Cô ấy chưa từng đi máy bay.", answers: ["她 没有 坐 过 飞机 。"], explanation: "没有 + V + 过 + tân ngữ." },
    ],
  },
  {
    id: "zhe-continuous",
    level: 2,
    title: "着 và 正 / 正在 … 呢: trạng thái và việc đang làm",
    points: ["动态助词 着 · trợ từ 着 (trạng thái kéo dài)", "正 / 正在 / 在 … 呢 · đang (tiếp diễn)"],
    intro: "Cửa đang mở · Anh ấy đang ăn cơm · Ngồi mà ăn.",
    blocks: [
      { type: "summary", text: "正 / 正在 / 在 + V (+ 呢): hành động ĐANG diễn ra. V + 着: TRẠNG THÁI kéo dài sau khi hành động xảy ra (cửa mở 着, đèn bật 着, mặc 着 áo đỏ), hoặc cách thức đi kèm (坐着吃 — ngồi mà ăn). Phủ định của 着: 没(有) + V + 着." },
      {
        type: "formula",
        rows: [
          { label: "Đang làm", pattern: "Chủ ngữ + 正 / 正在 / 在 + V (+ 呢)", example: "他 正在 吃 饭 呢 。" },
          { label: "Trạng thái", pattern: "Chủ ngữ + V + 着 (+ Tân ngữ)", example: "门 开 着 。" },
          { label: "Cách thức", pattern: "V1 + 着 + V2", example: "我们 走 着 去 吧 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "外面 正 下雨 呢 。", vi: "Bên ngoài đang mưa." },
          { zh: "她 穿 着 一 件 红色 的 衣服 。", vi: "Cô ấy mặc một chiếc áo màu đỏ." },
          { zh: "她 坐 着 看 书 。", vi: "Cô ấy ngồi đọc sách. (坐着: cách thức đi kèm)" },
          { zh: "他 笑 着 说 ： “ 没关系 ！ ”", vi: "Anh ấy cười và nói: \"Không sao!\"" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "门 正在 开 。", right: "门 开 着 。", why: "Nói trạng thái \"cửa đang mở\" (đã mở và vẫn mở) dùng 着, không dùng 正在." },
          { wrong: "我 正在 知道 。", right: "我 知道 。", why: "Động từ trạng thái như 知道, 是, 有 không dùng với 正在." },
        ],
      },
    ],
    quiz: [
      { id: "h2zhe-1", type: "mcq", zhPrompt: true, prompt: "门 开 ___ 。", options: ["着", "过", "得"], answer: 0, explanation: "Trạng thái kéo dài → 着." },
      { id: "h2zhe-2", type: "mcq", zhPrompt: true, prompt: "他 ___ 吃 饭 呢 。", options: ["正在", "着", "过"], answer: 0, explanation: "Hành động đang diễn ra → 正在 … 呢." },
      { id: "h2zhe-3", type: "mcq", prompt: "\"Cô ấy mặc áo đỏ\" (trạng thái) là?", options: ["她 穿 着 红色 的 衣服 。", "她 穿 过 红色 的 衣服 。", "她 正在 穿 红色 的 衣服 。"], answer: 0, explanation: "Trạng thái mặc trên người → 穿着." },
      { id: "h2zhe-4", type: "mcq", prompt: "Câu nào SAI?", options: ["外面 正 下雨 呢 。", "我 正在 知道 。", "门 开 着 。"], answer: 1, explanation: "知道 là động từ trạng thái, không dùng 正在." },
      { id: "h2zhe-5", type: "order", vi: "Bên ngoài đang mưa.", answers: ["外面 正 下雨 呢 。"], explanation: "正 + V + 呢." },
      { id: "h2zhe-6", type: "order", vi: "Chúng ta đi bộ đến đó nhé.", answers: ["我们 走 着 去 吧 。"], explanation: "V1 着 V2: đi bộ (cách thức) để đi." },
    ],
  },
  {
    id: "de-degree-complement",
    level: 2,
    title: "Bổ ngữ trình độ: V + 得 + tính từ",
    points: ["程度补语 · bổ ngữ trình độ (V + 得 + Adj)", "结构助词 得 · trợ từ 得"],
    intro: "Anh ấy nói tiếng Trung rất hay · Cô ấy chạy rất nhanh.",
    blocks: [
      { type: "summary", text: "Đánh giá một hành động làm ra sao: V + 得 + (很 / 非常 / 不) + tính từ. Khi có tân ngữ, LẶP LẠI động từ (hoặc đưa tân ngữ lên trước): 他说汉语说得很好 / 他汉语说得很好. Phủ định đặt 不 SAU 得: 说得不好." },
      {
        type: "formula",
        rows: [
          { label: "Không tân ngữ", pattern: "Chủ ngữ + V + 得 + (很) + Tính từ", example: "她 跑 得 很 快 。" },
          { label: "Có tân ngữ", pattern: "Chủ ngữ + (V) + Tân ngữ + V + 得 + Tính từ", example: "他 说 汉语 说 得 很 好 。" },
          { label: "Phủ định", pattern: "Chủ ngữ + V + 得 + 不 + Tính từ", example: "我 写 得 不 好 。" },
          { label: "Hỏi", pattern: "V + 得 + 怎么样？ / Tính từ 不 Tính từ？", example: "你 考 得 怎么样 ？" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "你 汉语 说 得 真 好 ！", vi: "Bạn nói tiếng Trung giỏi thật!" },
          { zh: "他 每 天 来 得 很 早 。", vi: "Ngày nào anh ấy cũng đến rất sớm." },
          { zh: "我 昨天 睡 得 不 好 。", vi: "Hôm qua tôi ngủ không ngon." },
          { zh: "你 考 得 怎么样 ？", vi: "Bạn thi thế nào?" },
        ],
      },
      {
        type: "compare",
        title: "的, 地, 得 — cùng đọc de",
        headers: ["", "Vị trí", "Ví dụ"],
        rows: [
          ["的", "trước DANH TỪ (định ngữ)", "漂亮 的 衣服"],
          ["地", "trước ĐỘNG TỪ (trạng ngữ)", "高兴 地 说"],
          ["得", "sau ĐỘNG TỪ (bổ ngữ)", "说 得 很 好"],
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "他 说 汉语 得 很 好 。", right: "他 说 汉语 说 得 很 好 。", why: "Có tân ngữ thì phải lặp lại động từ trước 得." },
          { wrong: "我 不 写 得 好 。", right: "我 写 得 不 好 。", why: "Phủ định đặt sau 得." },
        ],
      },
    ],
    quiz: [
      { id: "h2de-1", type: "mcq", zhPrompt: true, prompt: "她 跑 ___ 很 快 。", options: ["得", "地", "的"], answer: 0, explanation: "Sau động từ, nối với mức độ → 得." },
      { id: "h2de-2", type: "mcq", prompt: "\"Anh ấy nói tiếng Trung rất hay\" là?", options: ["他 说 汉语 得 很 好 。", "他 说 汉语 说 得 很 好 。", "他 说 得 汉语 很 好 。"], answer: 1, explanation: "Có tân ngữ → lặp động từ: 说汉语说得很好." },
      { id: "h2de-3", type: "mcq", prompt: "\"Tôi viết không đẹp\" là?", options: ["我 不 写 得 好 。", "我 写 得 不 好 。", "我 写 不 得 好 。"], answer: 1, explanation: "Phủ định đặt sau 得." },
      { id: "h2de-4", type: "mcq", zhPrompt: true, prompt: "他 高兴 ___ 说 ： “ 太 好 了 ！ ”", options: ["地", "得", "的"], answer: 0, explanation: "Trước động từ (说), làm trạng ngữ → 地." },
      { id: "h2de-5", type: "order", vi: "Bạn thi thế nào?", answers: ["你 考 得 怎么样 ？"], explanation: "V + 得 + 怎么样?" },
      { id: "h2de-6", type: "order", vi: "Hôm qua tôi ngủ không ngon.", answers: ["我 昨天 睡 得 不 好 。"], explanation: "Thời gian trước động từ; 得 + 不 + tính từ." },
    ],
  },
  {
    id: "result-complements",
    level: 2,
    title: "Bổ ngữ kết quả: 完, 好, 到, 见, 懂, 错",
    points: ["结果补语 · bổ ngữ kết quả (V + 完 / 好 / 到 / 见 / 懂 / 错)"],
    intro: "Làm xong, nghe hiểu, tìm thấy, viết sai.",
    blocks: [
      { type: "summary", text: "Động từ + một từ chỉ KẾT QUẢ của hành động. Tiếng Việt cũng có cấu trúc này (\"ăn xong\", \"nghe thấy\", \"tìm ra\"). Thường có 了 khi đã đạt kết quả. Phủ định dùng 没(有), bỏ 了: 没听懂." },
      {
        type: "compare",
        title: "Bổ ngữ kết quả thường gặp",
        headers: ["Bổ ngữ", "Nghĩa", "Ví dụ"],
        rows: [
          ["完", "xong", "吃 完, 做 完"],
          ["好", "xong và tốt, sẵn sàng", "准备 好, 做 好"],
          ["到", "đạt được, tìm thấy, đến", "找 到, 买 到, 看 到"],
          ["见", "thấy (nhìn, nghe)", "看 见, 听 见"],
          ["懂", "hiểu", "听 懂, 看 懂"],
          ["错", "sai", "写 错, 说 错, 打 错"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 做 完 了 。", vi: "Tôi làm xong rồi." },
          { zh: "你 听 懂 了 吗 ？", vi: "Bạn nghe hiểu chưa?" },
          { zh: "我 没有 找 到 我 的 手机 。", vi: "Tôi không tìm thấy điện thoại của mình." },
          { zh: "对不起 ， 我 写 错 了 。", vi: "Xin lỗi, tôi viết sai rồi." },
          { zh: "饭 做 好 了 ， 吃 饭 吧 ！", vi: "Cơm nấu xong rồi, ăn thôi!" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 没有 听 懂 了 。", right: "我 没有 听 懂 。", why: "Phủ định với 没有 thì bỏ 了." },
          { wrong: "我 找 了 到 。", right: "我 找 到 了 。", why: "Bổ ngữ kết quả gắn liền với động từ; 了 đứng sau cả cụm." },
        ],
      },
    ],
    quiz: [
      { id: "h2res-1", type: "mcq", zhPrompt: true, prompt: "我 吃 ___ 了 ， 我们 走 吧 。", options: ["完", "见", "错"], answer: 0, explanation: "Ăn xong → 吃完." },
      { id: "h2res-2", type: "mcq", zhPrompt: true, prompt: "老师 的 问题 ， 你 听 ___ 了 吗 ？", options: ["懂", "完", "错"], answer: 0, explanation: "Nghe hiểu → 听懂." },
      { id: "h2res-3", type: "mcq", zhPrompt: true, prompt: "我 的 手机 呢 ？ 我 没有 找 ___ 。", options: ["到", "完", "懂"], answer: 0, explanation: "Tìm thấy → 找到." },
      { id: "h2res-4", type: "mcq", prompt: "\"Tôi không nghe hiểu\" là?", options: ["我 没有 听 懂 了 。", "我 没有 听 懂 。", "我 不 听 懂 。"], answer: 1, explanation: "没有 + V + bổ ngữ, không có 了." },
      { id: "h2res-5", type: "order", vi: "Xin lỗi, tôi viết sai rồi.", answers: ["对不起 ， 我 写 错 了 。"], explanation: "写 + 错 + 了." },
      { id: "h2res-6", type: "order", vi: "Bạn nghe hiểu chưa?", answers: ["你 听 懂 了 吗 ？"], explanation: "V + 懂 + 了 + 吗?" },
    ],
  },
  {
    id: "direction-complements",
    level: 2,
    title: "Bổ ngữ xu hướng: 来 / 去, 进来, 出去, 上来, 下去, 回来, 过来",
    points: ["简单趋向补语 · bổ ngữ xu hướng đơn (V + 来 / 去)", "复合趋向补语 · bổ ngữ xu hướng kép (进来, 出去…)"],
    intro: "Vào đây, ra ngoài, lên đây, xuống dưới, quay về.",
    blocks: [
      { type: "summary", text: "来 = hướng VỀ PHÍA người nói, 去 = hướng RA XA người nói. Ghép với 进 (vào), 出 (ra), 上 (lên), 下 (xuống), 回 (về), 过 (qua) thành 进来, 出去, 上来, 下去, 回来, 过来… Tân ngữ chỉ nơi chốn đứng TRƯỚC 来 / 去: 进教室来, 回家去." },
      {
        type: "compare",
        title: "Bảng bổ ngữ xu hướng",
        headers: ["", "+ 来 (về phía người nói)", "+ 去 (ra xa người nói)"],
        rows: [
          ["进 vào", "进来 vào đây", "进去 vào đó"],
          ["出 ra", "出来 ra đây", "出去 ra ngoài"],
          ["上 lên", "上来 lên đây", "上去 lên đó"],
          ["下 xuống", "下来 xuống đây", "下去 xuống đó"],
          ["回 về", "回来 về (đây)", "回去 về (đó)"],
          ["过 qua", "过来 lại đây", "过去 qua đó"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "请 进来 ！", vi: "Mời vào!" },
          { zh: "他 出去 了 。", vi: "Anh ấy ra ngoài rồi." },
          { zh: "你 什么 时候 回来 ？", vi: "Khi nào bạn về?" },
          { zh: "你 过来 一下 。", vi: "Bạn lại đây một chút." },
          { zh: "老师 进 教室 来 了 。", vi: "Thầy giáo vào lớp rồi." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "老师 进来 教室 了 。", right: "老师 进 教室 来 了 。", why: "Tân ngữ chỉ nơi chốn đứng trước 来 / 去." },
          { wrong: "我 在 外面 ， 你 出去 吧 。", right: "我 在 外面 ， 你 出来 吧 。", why: "Người nói ở bên ngoài → hướng về phía người nói → 出来." },
        ],
      },
    ],
    quiz: [
      { id: "h2dir-1", type: "mcq", prompt: "Bạn đứng trong phòng, mời khách vào. Nói:", options: ["请 进来 ！", "请 进去 ！", "请 出来 ！"], answer: 0, explanation: "Vào phía người nói → 进来." },
      { id: "h2dir-2", type: "mcq", prompt: "Bạn ở ngoài cổng, gọi bạn trong nhà ra. Nói:", options: ["你 出去 吧 。", "你 出来 吧 。", "你 进来 吧 。"], answer: 1, explanation: "Ra phía người nói → 出来." },
      { id: "h2dir-3", type: "mcq", zhPrompt: true, prompt: "你 什么 时候 回 ___ ？ 我们 都 等 你 。", options: ["来", "去", "过"], answer: 0, explanation: "Về chỗ người nói đang ở → 回来." },
      { id: "h2dir-4", type: "mcq", prompt: "Câu nào ĐÚNG?", options: ["老师 进来 教室 了 。", "老师 进 教室 来 了 。", "老师 来 进 教室 了 。"], answer: 1, explanation: "Nơi chốn đứng trước 来: 进教室来." },
      { id: "h2dir-5", type: "order", vi: "Bạn lại đây một chút.", answers: ["你 过来 一下 。"], explanation: "过来 + 一下." },
      { id: "h2dir-6", type: "order", vi: "Anh ấy ra ngoài rồi.", answers: ["他 出去 了 。"], explanation: "出去 + 了." },
    ],
  },
];
