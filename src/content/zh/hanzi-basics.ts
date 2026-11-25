/**
 * Kiến thức nền về chữ Hán (chặng Nhập môn, docs/PLAN-ZH.md mục 4.2): nét cơ bản, quy tắc thứ tự nét, bộ thủ thường gặp.
 *
 * Bộ thủ ở đây được dạy như "thành phần gợi nghĩa" — ví dụ chọn chữ mà thành phần đó hiện rõ và liên quan đến nghĩa.
 * Cách xếp chữ vào bộ trong từ điển (Khang Hy hay bảng bộ thủ giản thể GF 0011-2009) có chỗ khác nhau,
 * nên ở đây không khẳng định "chữ X thuộc bộ Y" trong từ điển.
 */

export interface Stroke {
  /** Tên tiếng Trung */
  zh: string;
  pinyin: string;
  /** Tên Hán-Việt quen dùng */
  vi: string;
  /** Hình dạng nét */
  shape: string;
  how: string;
  /** Chữ có nét này */
  examples: string;
}

export const BASIC_STROKES: Stroke[] = [
  { zh: "横", pinyin: "héng", vi: "Ngang", shape: "一", how: "Viết từ trái sang phải, hơi chếch lên.", examples: "一 二 三" },
  { zh: "竖", pinyin: "shù", vi: "Sổ", shape: "丨", how: "Viết thẳng từ trên xuống.", examples: "十 中 工" },
  { zh: "撇", pinyin: "piě", vi: "Phẩy", shape: "丿", how: "Từ trên phải kéo xuống dưới trái, nhẹ dần.", examples: "人 八 大" },
  { zh: "点", pinyin: "diǎn", vi: "Chấm", shape: "丶", how: "Một chấm ngắn từ trên xuống, nghiêng sang phải.", examples: "六 文 主" },
  { zh: "捺", pinyin: "nà", vi: "Mác", shape: "㇏", how: "Từ trên trái kéo xuống dưới phải, đậm dần rồi nhấc bút.", examples: "人 大 八" },
  { zh: "提", pinyin: "tí", vi: "Hất", shape: "㇀", how: "Từ dưới trái hất lên trên phải, ngắn và nhanh.", examples: "我 打 地" },
  { zh: "折", pinyin: "zhé", vi: "Gập", shape: "㇕", how: "Đang viết thì đổi hướng, gập góc (thường ngang rồi gập xuống).", examples: "口 日 五" },
  { zh: "钩", pinyin: "gōu", vi: "Móc", shape: "亅", how: "Cuối nét móc ngược lên, nhấc bút nhanh.", examples: "小 子 你" },
];

export interface StrokeRule {
  rule: string;
  zh: string;
  explain: string;
  example: string;
  /** Thứ tự viết của chữ ví dụ, mô tả bằng lời */
  order: string;
}

export const STROKE_RULES: StrokeRule[] = [
  { rule: "Ngang trước, sổ sau", zh: "先横后竖", explain: "Nét ngang và nét sổ cắt nhau thì viết ngang trước.", example: "十", order: "一 rồi 丨" },
  { rule: "Phẩy trước, mác sau", zh: "先撇后捺", explain: "Nét phẩy (xuống trái) viết trước nét mác (xuống phải).", example: "人", order: "丿 rồi ㇏" },
  { rule: "Trên trước, dưới sau", zh: "从上到下", explain: "Phần trên của chữ viết trước phần dưới.", example: "三", order: "ngang trên → ngang giữa → ngang dưới" },
  { rule: "Trái trước, phải sau", zh: "从左到右", explain: "Phần bên trái viết trước phần bên phải.", example: "你", order: "亻 rồi 尔" },
  { rule: "Ngoài trước, trong sau", zh: "从外到内", explain: "Khung bao ngoài viết trước nét bên trong.", example: "月", order: "丿 → ㇆ → hai nét ngang bên trong" },
  { rule: "Vào nhà rồi đóng cửa", zh: "先里头后封口", explain: "Khung kín bốn phía: viết ba cạnh, rồi phần trong, cuối cùng mới đóng nét đáy.", example: "国", order: "丨 → ㇕ → 玉 → 一 (nét đáy cuối cùng)" },
  { rule: "Giữa trước, hai bên sau", zh: "先中间后两边", explain: "Chữ đối xứng có nét giữa nổi bật thì viết nét giữa trước.", example: "小", order: "亅 → 丶 bên trái → 丶 bên phải" },
];

export interface Radical {
  /** Dạng viết thường gặp (dạng biến thể khi đứng bên cạnh, nếu có) */
  form: string;
  /** Dạng đầy đủ khi khác dạng biến thể, vd 亻 ← 人 */
  full?: string;
  /** Tên Hán-Việt của bộ */
  name: string;
  meaning: string;
  /** Các chữ HSK có thành phần này */
  examples: string;
  /** Nhóm nghĩa gần nhau (vd các bộ chỉ "đi lại"): bài kiểm tra không lấy nghĩa trong cùng nhóm làm đáp án nhiễu */
  family?: string;
}

/** Bộ thủ thường gặp trong chữ HSK 1–4, xếp theo mức độ thường gặp. */
export const COMMON_RADICALS: Radical[] = [
  { form: "亻", full: "人", name: "Nhân (nhân đứng)", meaning: "người", examples: "你 他 们 住" },
  { form: "口", name: "Khẩu", meaning: "miệng, ăn nói", examples: "吃 喝 叫 吗", family: "mouth" },
  { form: "氵", full: "水", name: "Thuỷ (ba chấm thuỷ)", meaning: "nước", examples: "汉 洗 河 海", family: "water" },
  { form: "扌", full: "手", name: "Thủ (tài gảy)", meaning: "tay, động tác tay", examples: "打 找 把 提", family: "hand" },
  { form: "讠", full: "言", name: "Ngôn", meaning: "lời nói", examples: "说 话 语 请", family: "mouth" },
  { form: "女", name: "Nữ", meaning: "phụ nữ", examples: "妈 姐 妹 她" },
  { form: "忄", full: "心", name: "Tâm (tâm đứng)", meaning: "tim, tình cảm, suy nghĩ", examples: "忙 快 怕 情", family: "heart" },
  { form: "心", name: "Tâm", meaning: "tim, tình cảm, suy nghĩ", examples: "想 思 意 您", family: "heart" },
  { form: "木", name: "Mộc", meaning: "cây, gỗ", examples: "树 林 椅 桌", family: "plant" },
  { form: "日", name: "Nhật", meaning: "mặt trời, thời gian", examples: "时 明 早 晚", family: "sky" },
  { form: "月", name: "Nguyệt / Nhục", meaning: "mặt trăng; cơ thể (thịt)", examples: "朋 期 脑 脚" },
  { form: "土", name: "Thổ", meaning: "đất", examples: "地 场 坐 城", family: "earth" },
  { form: "宀", name: "Miên", meaning: "mái nhà", examples: "家 安 室 客" },
  { form: "艹", full: "艸", name: "Thảo", meaning: "cỏ, cây cỏ", examples: "茶 菜 花 草", family: "plant" },
  { form: "辶", name: "Sước", meaning: "đi, di chuyển", examples: "这 进 近 道", family: "walk" },
  { form: "纟", full: "糸", name: "Mịch", meaning: "sợi tơ", examples: "红 绿 给 经", family: "cloth" },
  { form: "钅", full: "金", name: "Kim", meaning: "kim loại, tiền", examples: "钱 错 钟 银", family: "money" },
  { form: "饣", full: "食", name: "Thực", meaning: "ăn uống", examples: "饭 饿 馆 饺", family: "mouth" },
  { form: "门", name: "Môn", meaning: "cửa", examples: "问 间 闹 闻" },
  { form: "贝", name: "Bối", meaning: "vỏ sò (tiền thời xưa), của cải", examples: "贵 货 购 账", family: "money" },
  { form: "目", name: "Mục", meaning: "mắt, nhìn", examples: "看 睡 眼 睛" },
  { form: "⻊", full: "足", name: "Túc", meaning: "chân, đi lại", examples: "跑 路 跳 踢", family: "walk" },
  { form: "车", name: "Xa", meaning: "xe", examples: "辆 轻 输 转" },
  { form: "灬", full: "火", name: "Hoả (bốn chấm hoả)", meaning: "lửa, nóng", examples: "热 点 照 熟", family: "fire" },
  { form: "火", name: "Hoả", meaning: "lửa", examples: "灯 烧 烤", family: "fire" },
  { form: "雨", name: "Vũ", meaning: "mưa, thời tiết", examples: "雪 零 需", family: "sky" },
  { form: "⺮", full: "竹", name: "Trúc", meaning: "tre, đồ làm bằng tre", examples: "笔 等 第 答", family: "plant" },
  { form: "衤", full: "衣", name: "Y", meaning: "quần áo", examples: "衬 衫 裤 被", family: "cloth" },
  { form: "礻", full: "示", name: "Thị", meaning: "thần linh, lễ nghi", examples: "社 礼 祝 福" },
  { form: "疒", name: "Nạch", meaning: "bệnh tật", examples: "病 疼 瘦" },
  { form: "冫", name: "Băng (hai chấm thuỷ)", meaning: "băng, lạnh", examples: "冷 冰 凉 准", family: "water" },
  { form: "刂", full: "刀", name: "Đao", meaning: "dao, cắt", examples: "到 别 刚 刻" },
  { form: "力", name: "Lực", meaning: "sức lực", examples: "动 助 加 努" },
  { form: "彳", name: "Xích", meaning: "bước chân, đi", examples: "很 得 往 街", family: "walk" },
  { form: "犭", full: "犬", name: "Khuyển", meaning: "chó, loài thú", examples: "狗 猫" },
  { form: "王", full: "玉", name: "Ngọc", meaning: "ngọc, đá quý", examples: "玩 班 现 球", family: "money" },
  { form: "米", name: "Mễ", meaning: "gạo, hạt", examples: "糖 精" },
  { form: "石", name: "Thạch", meaning: "đá", examples: "碗 破 础", family: "earth" },
  { form: "页", name: "Hiệt", meaning: "đầu", examples: "题 顾 颜" },
  { form: "马", name: "Mã", meaning: "ngựa", examples: "骑 验" },
  { form: "鸟", name: "Điểu", meaning: "chim", examples: "鸡" },
  { form: "虫", name: "Trùng", meaning: "sâu bọ, loài nhỏ", examples: "蛋 虽" },
  { form: "子", name: "Tử", meaning: "con, trẻ em", examples: "孩 学 字" },
  { form: "攵", full: "攴", name: "Phộc", meaning: "đánh, hành động", examples: "教 放 数 收", family: "hand" },
  { form: "走", name: "Tẩu", meaning: "chạy, đi", examples: "起 越 超", family: "walk" },
  { form: "阝", name: "Phụ (trái) / Ấp (phải)", meaning: "bên trái: đồi núi; bên phải: vùng đất, thành ấp", examples: "院 阳 都 那", family: "earth" },
];
