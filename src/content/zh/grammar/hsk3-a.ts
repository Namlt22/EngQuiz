/**
 * Ngữ pháp HSK 3 — bài 1–6: câu 把, câu 被, bổ ngữ khả năng, bổ ngữ xu hướng mở rộng, so sánh nâng cao,
 * bổ ngữ thời lượng / động lượng. Câu ví dụ chỉ dùng từ HSK 1–3 (test: src/content/zh/grammar.test.ts).
 */
import type { ZhGrammarLesson } from "./types";

export const HSK3_GRAMMAR_A: ZhGrammarLesson[] = [
  {
    id: "ba-sentence",
    level: 3,
    title: "Câu chữ 把: làm gì với cái gì",
    points: ["把 字 句 · câu chữ 把 (xử lý tân ngữ)"],
    intro: "Đặt sách lên bàn, viết xong bài tập, đóng cửa lại — nói việc mình xử lý một đồ vật cụ thể.",
    blocks: [
      { type: "summary", text: "Khi muốn nói ta LÀM GÌ với một vật đã xác định và vật đó THAY ĐỔI ra sao (bị chuyển đi, xong, đóng lại…), tiếng Trung đưa tân ngữ lên trước động từ bằng 把. Sau động từ BẮT BUỘC có thành phần khác: bổ ngữ kết quả / xu hướng, 在 / 给 + nơi chốn / người, 了, hoặc động từ lặp lại. Tân ngữ phải là vật cụ thể, người nghe biết là cái nào." },
      {
        type: "formula",
        rows: [
          { label: "Khẳng định", pattern: "Chủ ngữ + 把 + Tân ngữ + V + Thành phần khác", example: "我 把 作业 写 完 了 。" },
          { label: "Đặt ở đâu", pattern: "把 + Vật + V + 在 + Nơi chốn", example: "妈妈 把 菜 放 在 桌子 上 。" },
          { label: "Đưa cho ai", pattern: "把 + Vật + V + 给 + Người", example: "我 把 这 本 书 送 给 你 。" },
          { label: "Phủ định", pattern: "Chủ ngữ + 没有 / 别 + 把 + Tân ngữ + V…", example: "我 没有 把 作业 写 完 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "请 把 门 关 上 。", vi: "Làm ơn đóng cửa lại." },
          { zh: "他 把 我 的 书 拿 走 了 。", vi: "Anh ấy cầm sách của tôi đi mất rồi." },
          { zh: "你 别 把 手机 放 在 床 上 。", vi: "Bạn đừng để điện thoại trên giường." },
          { zh: "我 把 房间 打扫 干净 了 。", vi: "Tôi đã dọn phòng sạch sẽ rồi." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 把 作业 写 。", right: "我 把 作业 写 完 了 。", why: "Động từ trong câu 把 không đứng trơ — phải có kết quả (完, 好, 在…, 给…) hoặc 了." },
          { wrong: "我 把 作业 没有 写 完 。", right: "我 没有 把 作业 写 完 。", why: "没有 / 别 / 不 đứng TRƯỚC 把, không đứng trước động từ." },
          { wrong: "我 把 一 本 书 看 完 了 。", right: "我 把 那 本 书 看 完 了 。", why: "Tân ngữ của 把 phải xác định (这 / 那 / của ai), không dùng \"một cuốn nào đó\"." },
        ],
      },
      { type: "tip", text: "Mẹo nhận biết: nếu câu tiếng Việt có \"lên / vào / cho / xong / lại\" sau động từ và nói về một vật cụ thể (đặt sách LÊN bàn, đưa vé CHO tôi) — gần như chắc chắn dùng 把." },
    ],
    quiz: [
      { id: "h3ba-1", type: "mcq", zhPrompt: true, prompt: "请 ___ 门 关 上 。", options: ["把", "被", "对"], answer: 0, explanation: "Làm gì với cái cửa → 把 + 门 + 关上." },
      { id: "h3ba-2", type: "mcq", prompt: "Câu nào ĐÚNG?", options: ["我 把 作业 没有 写 完 。", "我 没有 把 作业 写 完 。", "我 把 作业 写 。"], answer: 1, explanation: "Phủ định đứng trước 把; động từ phải có thành phần đi sau." },
      { id: "h3ba-3", type: "mcq", prompt: "Câu nào SAI?", options: ["我 把 那 本 书 看 完 了 。", "我 把 一 本 书 看 完 了 。", "他 把 我 的 书 拿 走 了 。"], answer: 1, explanation: "Tân ngữ của 把 phải xác định." },
      { id: "h3ba-4", type: "mcq", zhPrompt: true, prompt: "你 别 把 手机 ___ 在 床 上 。", options: ["放", "看", "有"], answer: 0, explanation: "把 + vật + 放 + 在 + nơi chốn: đặt ở đâu." },
      { id: "h3ba-5", type: "order", vi: "Mẹ đặt món ăn lên bàn.", answers: ["妈妈 把 菜 放 在 桌子 上 。"], explanation: "把 + 菜 + 放在 + 桌子上." },
      { id: "h3ba-6", type: "order", vi: "Tôi tặng quyển sách này cho bạn.", answers: ["我 把 这 本 书 送 给 你 。"], explanation: "把 + vật + 送给 + người." },
    ],
  },
  {
    id: "bei-passive",
    level: 3,
    title: "Câu bị động với 被",
    points: ["被 字 句 · câu bị động chữ 被"],
    intro: "Xe đạp bị lấy mất, bánh bị ăn hết — nói điều đã xảy ra với người / vật chịu tác động.",
    blocks: [
      { type: "summary", text: "Câu 被 đặt người / vật CHỊU tác động lên đầu câu: A 被 B + V + kết quả. Giống câu 把, động từ không đứng trơ mà phải có kết quả hoặc 了. Người gây ra (B) có thể lược, nói 被 + V. Câu 被 thường kể chuyện không như ý (bị mất, bị hỏng, bị mắng). Khẩu ngữ hay thay 被 bằng 让 / 叫, khi đó KHÔNG được lược người gây ra." },
      {
        type: "formula",
        rows: [
          { label: "Đầy đủ", pattern: "Người/vật chịu + 被 + Người làm + V + Kết quả", example: "蛋糕 被 弟弟 吃 完 了 。" },
          { label: "Lược người làm", pattern: "Người/vật chịu + 被 + V + Kết quả", example: "我 的 自行车 被 骑 走 了 。" },
          { label: "Phủ định", pattern: "… + 没有 + 被 + …", example: "我 的 自行车 没有 被 人 骑 走 。" },
          { label: "Khẩu ngữ", pattern: "… + 让 / 叫 + Người làm + V…", example: "我 的 书 让 弟弟 拿 走 了 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "我 的 钱 被 人 拿 走 了 。", vi: "Tiền của tôi bị người ta lấy mất rồi." },
          { zh: "他 被 经理 叫 去 了 。", vi: "Anh ấy bị giám đốc gọi đi rồi." },
          { zh: "我 的 衣服 被 妈妈 洗 干净 了 。", vi: "Quần áo của tôi được mẹ giặt sạch rồi." },
          { zh: "这 个 问题 已经 被 解决 了 。", vi: "Vấn đề này đã được giải quyết rồi." },
        ],
      },
      {
        type: "compare",
        title: "把 hay 被?",
        headers: ["", "把", "被"],
        rows: [
          ["Đầu câu là", "người LÀM", "người / vật CHỊU"],
          ["Ví dụ", "弟弟把蛋糕吃完了。", "蛋糕被弟弟吃完了。"],
          ["Nghĩa", "Em trai ăn hết bánh.", "Bánh bị em trai ăn hết."],
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 的 手机 被 拿 。", right: "我 的 手机 被 拿 走 了 。", why: "Động từ sau 被 cần kết quả / 了." },
          { wrong: "我 的 自行车 被 人 没有 骑 走 。", right: "我 的 自行车 没有 被 人 骑 走 。", why: "没有 đứng trước 被." },
        ],
      },
    ],
    quiz: [
      { id: "h3bp-1", type: "mcq", zhPrompt: true, prompt: "蛋糕 ___ 弟弟 吃 完 了 。", options: ["被", "把", "给"], answer: 0, explanation: "Bánh là vật chịu tác động, đứng đầu câu → 被." },
      { id: "h3bp-2", type: "mcq", zhPrompt: true, prompt: "弟弟 ___ 蛋糕 吃 完 了 。", options: ["被", "把", "向"], answer: 1, explanation: "Em trai là người làm, đứng đầu câu → 把." },
      { id: "h3bp-3", type: "mcq", prompt: "Câu bị động của \"狗 把 鱼 吃 了 。\" là?", options: ["鱼 被 狗 吃 了 。", "狗 被 鱼 吃 了 。", "鱼 把 狗 吃 了 。"], answer: 0, explanation: "Vật chịu (鱼) + 被 + người làm (狗) + V." },
      { id: "h3bp-4", type: "mcq", prompt: "Câu nào SAI?", options: ["我 的 书 让 弟弟 拿 走 了 。", "我 的 书 让 拿 走 了 。", "我 的 书 被 拿 走 了 。"], answer: 1, explanation: "Dùng 让 / 叫 thì phải có người làm; chỉ 被 mới lược được." },
      { id: "h3bp-5", type: "order", vi: "Xe đạp của tôi bị người ta đạp đi mất rồi.", answers: ["我 的 自行车 被 人 骑 走 了 。"], explanation: "Vật chịu + 被 + 人 + 骑走了." },
      { id: "h3bp-6", type: "order", vi: "Vấn đề này đã được giải quyết rồi.", answers: ["这 个 问题 已经 被 解决 了 。"], explanation: "已经 đứng trước 被." },
    ],
  },
  {
    id: "potential-complement",
    level: 3,
    title: "Bổ ngữ khả năng: 听得懂, 看不见, 做不完",
    points: ["可能 补语 · bổ ngữ khả năng V 得 / 不 + kết quả / xu hướng"],
    intro: "Nghe có hiểu không, nhìn có thấy không, làm có xong không.",
    blocks: [
      { type: "summary", text: "Chèn 得 (được) hoặc 不 (không) vào giữa động từ và bổ ngữ kết quả / xu hướng để nói CÓ LÀM ĐƯỢC hay KHÔNG: 听懂 → 听得懂 / 听不懂; 看见 → 看得见 / 看不见; 回来 → 回得来 / 回不来. Dạng phủ định 不 rất hay dùng. Không nói 不能听懂 khi ý là năng lực / điều kiện khách quan." },
      {
        type: "formula",
        rows: [
          { label: "Được", pattern: "V + 得 + Kết quả / Xu hướng", example: "老师 说 的 汉语 我 听 得 懂 。" },
          { label: "Không được", pattern: "V + 不 + Kết quả / Xu hướng", example: "字 太 小 了 ， 我 看 不 见 。" },
          { label: "Hỏi", pattern: "V 得 C + 吗？ / V 得 C + V 不 C？", example: "你 听 得 懂 听 不 懂 ？" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "作业 太 多 了 ， 今天 做 不 完 。", vi: "Bài tập nhiều quá, hôm nay làm không xong." },
          { zh: "这么 多 菜 ， 我们 吃 得 完 吗 ？", vi: "Nhiều món thế này, chúng ta ăn hết được không?" },
          { zh: "今天 晚上 他 回 不 来 。", vi: "Tối nay anh ấy không về được." },
          { zh: "黑板 上 的 字 你 看 得 清楚 吗 ？", vi: "Chữ trên bảng bạn nhìn có rõ không?" },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 不 能 听 懂 。", right: "我 听 不 懂 。", why: "Nói không nghe hiểu được → bổ ngữ khả năng V 不 C." },
          { wrong: "我 看 得 不 见 。", right: "我 看 不 见 。", why: "Phủ định chỉ thay 得 bằng 不, không dùng cả hai." },
        ],
      },
      { type: "tip", text: "听不懂 = nghe rồi mà không hiểu; 听不见 = không nghe thấy (tiếng nhỏ, xa). Hai câu rất hay dùng khi học: 对不起，我听不懂。 / 声音太小，我听不见。" },
    ],
    quiz: [
      { id: "h3pc-1", type: "mcq", prompt: "\"Tôi nghe không hiểu\" là?", options: ["我 听 不 懂 。", "我 不 听 懂 。", "我 听 得 不 懂 。"], answer: 0, explanation: "V + 不 + C." },
      { id: "h3pc-2", type: "mcq", zhPrompt: true, prompt: "字 太 小 了 ， 我 看 ___ 见 。", options: ["不", "没|méi", "得"], answer: 0, explanation: "Chữ nhỏ quá → không nhìn thấy được: 看不见." },
      { id: "h3pc-3", type: "mcq", zhPrompt: true, prompt: "作业 太 多 了 ， 今天 做 不 ___ 。", options: ["完", "到", "懂"], answer: 0, explanation: "Không làm xong → 做不完." },
      { id: "h3pc-4", type: "mcq", prompt: "Câu nào SAI?", options: ["你 听 得 懂 吗 ？", "我 看 得 不 见 。", "他 回 不 来 。"], answer: 1, explanation: "Phủ định: 看不见, không phải 看得不见." },
      { id: "h3pc-5", type: "order", vi: "Bạn nghe có hiểu không?", answers: ["你 听 得 懂 吗 ？"], explanation: "V + 得 + 懂 + 吗?" },
      { id: "h3pc-6", type: "order", vi: "Tối nay anh ấy không về được.", answers: ["今天 晚上 他 回 不 来 。", "他 今天 晚上 回 不 来 。"], explanation: "Thời gian đứng trước hoặc sau chủ ngữ; 回不来." },
    ],
  },
  {
    id: "direction-extended",
    level: 3,
    title: "起来, 下去, 出来, 下来: nghĩa mở rộng",
    points: ["趋向 补语 引申 用法 · nghĩa mở rộng của bổ ngữ xu hướng"],
    intro: "Cười phá lên, nói tiếp đi, nhận ra giọng ai, ghi lại số điện thoại.",
    blocks: [
      { type: "summary", text: "Ngoài nghĩa hướng di chuyển (HSK 2), một số bổ ngữ xu hướng còn có nghĩa trừu tượng: 起来 = bắt đầu (笑起来) / khi đánh giá (看起来, 听起来) / nhớ ra (想起来). 下去 = tiếp tục (说下去). 出来 = nhận ra, nghĩ ra (看出来, 想出来). 下来 = giữ lại, ghi lại (写下来)." },
      {
        type: "compare",
        title: "Bảng nghĩa mở rộng",
        headers: ["Bổ ngữ", "Nghĩa", "Ví dụ"],
        rows: [
          ["起来", "bắt đầu", "笑起来 cười phá lên"],
          ["起来", "xét / nhìn thì", "看起来 trông có vẻ"],
          ["起来", "nhớ ra", "想起来 nhớ ra"],
          ["下去", "tiếp tục", "说下去 nói tiếp"],
          ["出来", "nhận ra, nghĩ ra", "听出来 nghe ra; 想出来 nghĩ ra"],
          ["下来", "lưu lại", "写下来 ghi lại"],
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "听 了 这 个 故事 ， 大家 都 笑 起来 了 。", vi: "Nghe câu chuyện này, mọi người đều cười phá lên." },
          { zh: "这 件 衣服 看 起来 很 好看 。", vi: "Bộ quần áo này trông rất đẹp." },
          { zh: "你 说 下去 ， 我 在 听 。", vi: "Bạn nói tiếp đi, tôi đang nghe." },
          { zh: "我 听 出来 了 ， 这 是 你 的 声音 。", vi: "Tôi nghe ra rồi, đây là giọng của bạn." },
          { zh: "请 把 这 个 电话 号码 写 下来 。", vi: "Hãy ghi lại số điện thoại này." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 想 出来 了 ， 他 姓 王|Wáng 。", right: "我 想 起来 了 ， 他 姓 王|Wáng 。", why: "Nhớ ra điều đã biết → 想起来. 想出来 là nghĩ ra cái mới (办法)." },
          { wrong: "汉语 很 有意思 ， 我 要 学 起来 。", right: "汉语 很 有意思 ， 我 要 学 下去 。", why: "Tiếp tục làm việc đang làm → 下去." },
        ],
      },
    ],
    quiz: [
      { id: "h3de-1", type: "mcq", zhPrompt: true, prompt: "听 了 这 个 故事 ， 大家 都 笑 ___ 了 。", options: ["起来", "下去", "出来"], answer: 0, explanation: "Bắt đầu cười → 笑起来." },
      { id: "h3de-2", type: "mcq", zhPrompt: true, prompt: "你 说 ___ ， 我 在 听 。", options: ["起来", "下去", "下来"], answer: 1, explanation: "Nói tiếp → 说下去." },
      { id: "h3de-3", type: "mcq", zhPrompt: true, prompt: "我 听 ___ 了 ， 这 是 你 的 声音 。", options: ["出来", "下去", "起来"], answer: 0, explanation: "Nhận ra qua tai → 听出来." },
      { id: "h3de-4", type: "mcq", zhPrompt: true, prompt: "请 把 电话 号码 写 ___ 。", options: ["下来", "下去", "出去"], answer: 0, explanation: "Ghi lại → 写下来." },
      { id: "h3de-5", type: "order", vi: "Bộ quần áo này trông rất đẹp.", answers: ["这 件 衣服 看 起来 很 好看 。"], explanation: "看起来 + đánh giá." },
      { id: "h3de-6", type: "order", vi: "Tôi nghĩ ra một cách rồi.", answers: ["我 想 出来 一 个 办法 了 。"], explanation: "Nghĩ ra cái mới → 想出来." },
    ],
  },
  {
    id: "comparison-advanced",
    level: 3,
    title: "So sánh nâng cao: 一样, 更 / 还, 得多, 越来越",
    points: ["跟…一样 · giống nhau", "比 + 更 / 还 · còn hơn", "比 + Adj + 得多 / 一点儿 / số lượng", "越来越 · 越…越 · càng ngày càng / càng… càng"],
    intro: "Cao bằng anh trai, hôm nay còn lạnh hơn hôm qua, trời ngày càng nóng.",
    blocks: [
      { type: "summary", text: "Bằng nhau: A 跟 / 和 B 一样 (+ Adj). Câu 比 không dùng 很 / 非常 trước tính từ; muốn nhấn mạnh thì dùng 更 / 还 (còn hơn) trước tính từ, hoặc thêm mức chênh SAU tính từ: 得多 (hơn nhiều), 一点儿 (hơn một chút), số lượng (大三岁). Thay đổi dần: 越来越 + Adj; hai việc đi cùng: 越 A 越 B." },
      {
        type: "formula",
        rows: [
          { label: "Bằng nhau", pattern: "A + 跟 + B + 一样 + Adj", example: "我 跟 哥哥 一样 高 。" },
          { label: "Còn hơn", pattern: "A + 比 + B + 更 / 还 + Adj", example: "今天 比 昨天 还 冷 。" },
          { label: "Mức chênh", pattern: "A + 比 + B + Adj + 得多 / 一点儿 / số lượng", example: "妹妹 比 我 小 三 岁 。" },
          { label: "Ngày càng", pattern: "越 来 越 + Adj", example: "天气 越 来 越 热 了 。" },
          { label: "Càng… càng", pattern: "越 + V/Adj + 越 + Adj", example: "雨 越 下 越 大 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "他 比 我 高 得 多 。", vi: "Anh ấy cao hơn tôi nhiều." },
          { zh: "这 件 比 那 件 贵 一点儿 。", vi: "Cái này đắt hơn cái kia một chút." },
          { zh: "汉语 越 学 越 有意思 。", vi: "Tiếng Trung càng học càng thú vị." },
          { zh: "他 的 汉语 水平 越 来 越 高 。", vi: "Trình độ tiếng Trung của anh ấy ngày càng cao." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "今天 比 昨天 很 冷 。", right: "今天 比 昨天 还 冷 。", why: "Câu 比 không dùng 很; nhấn mạnh bằng 更 / 还." },
          { wrong: "我 跟 哥哥 高 一样 。", right: "我 跟 哥哥 一样 高 。", why: "一样 đứng TRƯỚC tính từ." },
        ],
      },
    ],
    quiz: [
      { id: "h3ca-1", type: "mcq", zhPrompt: true, prompt: "今天 比 昨天 ___ 冷 。", options: ["还", "很", "非常"], answer: 0, explanation: "Câu 比 nhấn mạnh bằng 还 / 更." },
      { id: "h3ca-2", type: "mcq", zhPrompt: true, prompt: "我 跟 哥哥 ___ 高 。", options: ["一样", "比", "更"], answer: 0, explanation: "A 跟 B 一样 + Adj." },
      { id: "h3ca-3", type: "mcq", prompt: "\"Trời ngày càng nóng\" là?", options: ["天气 越 来 越 热 了 。", "天气 越 热 越 来 了 。", "天气 来 越 越 热 了 。"], answer: 0, explanation: "越来越 + Adj." },
      { id: "h3ca-4", type: "mcq", prompt: "Câu nào SAI?", options: ["他 比 我 高 得 多 。", "他 比 我 很 高 。", "他 比 我 高 一点儿 。"], answer: 1, explanation: "Không dùng 很 trong câu 比." },
      { id: "h3ca-5", type: "order", vi: "Em gái nhỏ hơn tôi ba tuổi.", answers: ["妹妹 比 我 小 三 岁 。"], explanation: "Số lượng đứng sau tính từ." },
      { id: "h3ca-6", type: "order", vi: "Tiếng Trung càng học càng thú vị.", answers: ["汉语 越 学 越 有意思 。"], explanation: "越 + V + 越 + Adj." },
    ],
  },
  {
    id: "duration-frequency",
    level: 3,
    title: "Làm bao lâu, làm mấy lần: bổ ngữ thời lượng và động lượng",
    points: ["时量 补语 · bổ ngữ thời lượng", "动量 补语 次 / 遍 · bổ ngữ động lượng"],
    intro: "Học tiếng Trung hai năm rồi, xem phim này hai lượt, đã đến Trung Quốc ba lần.",
    blocks: [
      { type: "summary", text: "Khoảng thời gian / số lần làm việc đứng SAU động từ (khác tiếng Việt có thể đặt trước). Nếu có tân ngữ: V + 了 + thời lượng + tân ngữ, hoặc lặp động từ: V + O + V + 了 + thời lượng. Thêm 了 cuối câu = việc vẫn còn tiếp tục đến bây giờ. 次 đếm số lần; 遍 nhấn mạnh làm trọn từ đầu đến cuối. Khi PHỦ ĐỊNH, thời lượng lại đứng trước: 三天没有…了." },
      {
        type: "formula",
        rows: [
          { label: "Không tân ngữ", pattern: "V + 了 + Thời lượng", example: "我 等 了 半 个 小时 。" },
          { label: "Có tân ngữ", pattern: "V + 了 + Thời lượng + Tân ngữ", example: "我 学 了 两 年 汉语 。" },
          { label: "Lặp động từ", pattern: "V + O + V + 了 + Thời lượng (+ 了)", example: "我 学 汉语 学 了 两 年 了 。" },
          { label: "Số lần", pattern: "V + 过 / 了 + Tân ngữ (địa danh) + số + 次 / 遍", example: "我 去 过 中国 三 次 。" },
          { label: "Phủ định", pattern: "Thời lượng + 没有 + V + 了", example: "我 已经 三 天 没有 看见 他 了 。" },
        ],
      },
      {
        type: "usage",
        title: "Ví dụ",
        examples: [
          { zh: "他 等 了 你 半 个 小时 。", vi: "Anh ấy đợi bạn nửa tiếng." },
          { zh: "这 个 电影 我 看 了 两 遍 。", vi: "Bộ phim này tôi xem hai lượt (từ đầu đến cuối)." },
          { zh: "请 再 说 一 遍 。", vi: "Làm ơn nói lại một lần nữa." },
          { zh: "我 每 天 锻炼 一 个 小时 。", vi: "Mỗi ngày tôi tập thể dục một tiếng." },
        ],
      },
      {
        type: "mistakes",
        items: [
          { wrong: "我 两 年 学 了 汉语 。", right: "我 学 了 两 年 汉语 。", why: "Thời lượng đứng sau động từ." },
          { wrong: "我 学 汉语 了 两 年 。", right: "我 学 汉语 学 了 两 年 。", why: "Có tân ngữ thì lặp lại động từ, hoặc đặt thời lượng giữa V và O." },
        ],
      },
      { type: "tip", text: "了 cuối câu thay đổi nghĩa: 我学了两年汉语 (đã học hai năm, có thể đã thôi) / 我学了两年汉语了 (đã học được hai năm và vẫn đang học)." },
    ],
    quiz: [
      { id: "h3df-1", type: "mcq", zhPrompt: true, prompt: "我 学 汉语 学 ___ 两 年 了 。", options: ["了", "过", "着"], answer: 0, explanation: "V + 了 + thời lượng + 了: vẫn còn tiếp tục." },
      { id: "h3df-2", type: "mcq", prompt: "Câu nào ĐÚNG?", options: ["我 两 年 学 了 汉语 。", "我 学 了 两 年 汉语 。", "我 学 汉语 了 两 年 。"], answer: 1, explanation: "V + 了 + thời lượng + tân ngữ." },
      { id: "h3df-3", type: "mcq", prompt: "So với 次, lượng từ 遍 khác ở chỗ nào?", options: ["Nhấn mạnh làm trọn từ đầu đến cuối", "Chỉ dùng cho việc chưa xảy ra", "Chỉ dùng để đếm người"], answer: 0, explanation: "看了两遍 = xem trọn hai lượt; 去过三次 = đi ba lần." },
      { id: "h3df-4", type: "mcq", zhPrompt: true, prompt: "我 已经 三 天 ___ 看见 他 了 。", options: ["没有", "不", "别"], answer: 0, explanation: "Phủ định với thời lượng: thời lượng + 没有 + V + 了." },
      { id: "h3df-5", type: "order", vi: "Anh ấy đợi bạn nửa tiếng.", answers: ["他 等 了 你 半 个 小时 。"], explanation: "Đại từ tân ngữ đứng trước thời lượng." },
      { id: "h3df-6", type: "order", vi: "Tôi đã đến Trung Quốc ba lần.", answers: ["我 去 过 中国 三 次 。", "我 去 过 三 次 中国 。"], explanation: "Địa danh có thể đứng trước hoặc sau số lần." },
    ],
  },
];
