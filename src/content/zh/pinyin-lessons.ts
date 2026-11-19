/**
 * Chặng Nhập môn của khoá tiếng Trung: pinyin & thanh điệu (docs/PLAN-ZH.md mục 4.1).
 *
 * Âm mẫu được đọc bằng giọng máy tiếng phổ thông qua CHỮ HÁN (TTS không đọc chuẩn pinyin rời),
 * nên mỗi mục chọn chữ chỉ có một cách đọc (test đối chiếu với danh mục từ HSK, src/content/zh/pinyin.test.ts).
 * Mô tả khẩu hình dựa trên hệ âm vị tiếng phổ thông chuẩn (Hán ngữ bính âm phương án 1958, thanh điệu 55 / 35 / 214 / 51).
 */

export interface PinyinItem {
  /** Pinyin có dấu thanh */
  pinyin: string;
  /** Chữ Hán đại diện — giọng máy đọc chữ này */
  hanzi: string;
  /** Nghĩa tiếng Việt */
  vi: string;
  /** Âm cần chú ý trong âm tiết (để tô đậm), vd "zh" */
  focus?: string;
}

export interface PinyinPoint {
  /** Ký hiệu / tiêu đề ngắn, vd "zh" hoặc "Thanh 3" */
  label: string;
  /** Cách phát âm */
  how: string;
  /** Âm tiếng Việt gần giống (nếu có) */
  viLike?: string;
}

/** Vòng trắc nghiệm ở bước 3. `say` = chữ Hán được đọc lên (bỏ trống nếu câu hỏi chỉ cần đọc). */
export interface PinyinRound {
  say?: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
}

export type PinyinDrill =
  /** Nghe một chữ, chọn đúng âm tiết giữa hai âm dễ nhầm. */
  | { kind: "pairs"; pairs: [PinyinItem, PinyinItem][] }
  /** Nghe một chữ, chọn đúng thanh (1–4). Mỗi bộ là cùng một âm ở 4 thanh. */
  | { kind: "tones"; sets: PinyinItem[][] }
  /** Câu hỏi soạn sẵn (biến điệu, quy tắc viết). */
  | { kind: "mcq"; rounds: PinyinRound[] };

export type PinyinGroup = "tone" | "initial" | "final" | "rule";

export interface PinyinLesson {
  id: string;
  group: PinyinGroup;
  title: string;
  /** Một câu: học xong làm được gì */
  goal: string;
  points: PinyinPoint[];
  /** Các âm tiết mẫu: nghe ở bước 1, đọc theo ở bước 2 */
  items: PinyinItem[];
  /** Lỗi người Việt hay mắc */
  tip?: string;
  drill: PinyinDrill;
}

export const PINYIN_GROUP_INFO: Record<PinyinGroup, { label: string; chip: string }> = {
  tone: { label: "Thanh điệu", chip: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
  initial: { label: "Thanh mẫu (phụ âm đầu)", chip: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" },
  final: { label: "Vận mẫu (vần)", chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  rule: { label: "Quy tắc", chip: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
};

const it = (pinyin: string, hanzi: string, vi: string, focus?: string): PinyinItem => ({ pinyin, hanzi, vi, focus });

/* Bộ 4 thanh dùng cho bài thanh điệu — chữ thường gặp, mỗi chữ một cách đọc. */
const MA = [it("mā", "妈", "mẹ"), it("má", "麻", "cây gai; tê"), it("mǎ", "马", "con ngựa"), it("mà", "骂", "mắng")];
const YI = [it("yī", "衣", "áo"), it("yí", "姨", "dì"), it("yǐ", "椅", "ghế (椅子)"), it("yì", "意", "ý")];
const TANG = [it("tāng", "汤", "canh"), it("táng", "糖", "đường, kẹo"), it("tǎng", "躺", "nằm"), it("tàng", "烫", "nóng bỏng")];
const SHI = [it("shī", "诗", "thơ"), it("shí", "十", "mười"), it("shǐ", "使", "khiến, dùng"), it("shì", "是", "là")];

export const PINYIN_LESSONS: PinyinLesson[] = [
  /* ======================= THANH ĐIỆU ======================= */
  {
    id: "tones",
    group: "tone",
    title: "Bốn thanh điệu và thanh nhẹ",
    goal: "Nghe và đọc đúng 4 thanh của tiếng phổ thông trên cùng một âm tiết.",
    points: [
      { label: "Thanh 1  ˉ  (55)", how: "Cao và bằng, giữ nguyên độ cao từ đầu đến cuối, hơi kéo dài.", viLike: "Như thanh ngang tiếng Việt nhưng CAO hơn hẳn — gần giọng hát nốt cao." },
      { label: "Thanh 2  ˊ  (35)", how: "Từ giữa đi lên cao, như khi hỏi lại \"Hả?\".", viLike: "Gần thanh sắc, nhưng lên từ từ, không gắt và không ngắn." },
      { label: "Thanh 3  ˇ  (214)", how: "Xuống thấp rồi mới lên. Khi nói liền, thường chỉ đọc nửa đầu: xuống thấp và giữ trầm.", viLike: "Gần thanh hỏi, nhưng xuống sâu hơn; đứng trước âm khác thì gần như chỉ trầm xuống." },
      { label: "Thanh 4  ˋ  (51)", how: "Từ cao rơi thẳng xuống thấp, ngắn và dứt khoát, như khi ra lệnh.", viLike: "Nằm giữa thanh huyền và thanh nặng: bắt đầu cao rồi rơi mạnh." },
      { label: "Thanh nhẹ (không dấu)", how: "Đọc ngắn, nhẹ, không nhấn; độ cao phụ thuộc âm đứng trước. Hay gặp ở âm thứ hai của từ lặp và trợ từ: māma, bàba, ma, de.", },
    ],
    items: [...MA, it("mā ma", "妈妈", "mẹ (thanh nhẹ ở âm sau)")],
    tip: "Người Việt hay đọc thanh 1 quá thấp (thành thanh ngang Việt) và nhầm thanh 2 với thanh 3. Khi tập, dùng tay vẽ đường đi của giọng: ngang cao — đi lên — võng xuống — rơi xuống.",
    drill: { kind: "tones", sets: [MA, YI, TANG, SHI] },
  },
  {
    id: "tone-2-3",
    group: "tone",
    title: "Phân biệt thanh 2 và thanh 3",
    goal: "Không còn nhầm thanh 2 (đi lên) với thanh 3 (xuống thấp rồi lên).",
    points: [
      { label: "Thanh 2", how: "Bắt đầu ở giữa và đi THẲNG lên cao, không chùng xuống.", viLike: "Như thanh sắc kéo dài." },
      { label: "Thanh 3", how: "Bắt đầu hơi thấp, chùng XUỐNG đáy giọng (giọng hơi khàn) rồi mới lên. Điểm nhận biết là đoạn trầm ở giữa.", viLike: "Như thanh hỏi đọc chậm và trầm." },
    ],
    items: [it("má", "麻", "tê"), it("mǎ", "马", "ngựa"), it("táng", "糖", "đường"), it("tǎng", "躺", "nằm"), it("yí", "姨", "dì"), it("yǐ", "椅", "ghế")],
    tip: "Nếu không chắc, hãy để ý giọng có đi qua vùng trầm không: có là thanh 3, không là thanh 2.",
    drill: {
      kind: "pairs",
      pairs: [
        [it("má", "麻", "tê"), it("mǎ", "马", "ngựa")],
        [it("táng", "糖", "đường"), it("tǎng", "躺", "nằm")],
        [it("yí", "姨", "dì"), it("yǐ", "椅", "ghế")],
        [it("shí", "十", "mười"), it("shǐ", "使", "khiến")],
      ],
    },
  },

  /* ======================= THANH MẪU ======================= */
  {
    id: "initials-bpmf",
    group: "initial",
    title: "Thanh mẫu b · p · m · f",
    goal: "Phân biệt âm không bật hơi (b) và bật hơi (p).",
    points: [
      { label: "b", how: "Hai môi khép rồi bật ra, KHÔNG bật hơi, dây thanh không rung.", viLike: "Gần \"p\" trong \"pin\" của tiếng Việt, không phải \"b\" Việt (b Việt có rung)." },
      { label: "p", how: "Như b nhưng đẩy một luồng hơi mạnh ra — để tờ giấy trước miệng sẽ rung.", viLike: "Tiếng Việt không có; giống \"p\" tiếng Anh trong \"pen\"." },
      { label: "m", how: "Hai môi khép, hơi ra đằng mũi.", viLike: "Như \"m\" tiếng Việt." },
      { label: "f", how: "Răng trên chạm nhẹ môi dưới, hơi đi qua khe.", viLike: "Như \"ph\" tiếng Việt." },
    ],
    items: [it("bā", "八", "tám", "b"), it("pà", "怕", "sợ", "p"), it("mǎ", "马", "ngựa", "m"), it("fēi", "飞", "bay", "f"), it("bái", "白", "trắng", "b"), it("pái", "牌", "bài, biển", "p")],
    tip: "Trong pinyin, b/d/g là âm KHÔNG bật hơi (gần p/t/c Việt), còn p/t/k là âm BẬT HƠI. Đừng đọc b, d như b, đ tiếng Việt.",
    drill: {
      kind: "pairs",
      pairs: [
        [it("bái", "白", "trắng", "b"), it("pái", "牌", "bài", "p")],
        [it("bà", "爸", "bố", "b"), it("pà", "怕", "sợ", "p")],
        [it("bǎo", "饱", "no", "b"), it("pǎo", "跑", "chạy", "p")],
      ],
    },
  },
  {
    id: "initials-dtnl",
    group: "initial",
    title: "Thanh mẫu d · t · n · l",
    goal: "Đọc d không bật hơi, t bật hơi; tách rõ n và l.",
    points: [
      { label: "d", how: "Đầu lưỡi chạm lợi trên rồi bật ra, không bật hơi, không rung.", viLike: "Gần \"t\" tiếng Việt (không phải \"đ\")." },
      { label: "t", how: "Như d nhưng bật một luồng hơi mạnh.", viLike: "Gần \"th\" tiếng Việt." },
      { label: "n", how: "Đầu lưỡi chạm lợi trên, hơi ra đằng mũi.", viLike: "Như \"n\" tiếng Việt." },
      { label: "l", how: "Đầu lưỡi chạm lợi trên, hơi thoát ra hai bên lưỡi.", viLike: "Như \"l\" tiếng Việt." },
    ],
    items: [it("dà", "大", "to", "d"), it("tā", "他", "anh ấy", "t"), it("nǐ", "你", "bạn", "n"), it("lái", "来", "đến", "l"), it("nán", "男", "nam", "n"), it("lán", "蓝", "xanh lam", "l")],
    tip: "Người ở vùng hay lẫn n/l cần tập kỹ: 男 nán (nam) và 蓝 lán (xanh lam), 女 nǚ (nữ) và 绿 lǜ (xanh lá) là các cặp khác nghĩa hoàn toàn.",
    drill: {
      kind: "pairs",
      pairs: [
        [it("dú", "读", "đọc", "d"), it("tú", "图", "tranh", "t")],
        [it("nán", "男", "nam", "n"), it("lán", "蓝", "xanh lam", "l")],
        [it("niú", "牛", "bò", "n"), it("liú", "流", "chảy", "l")],
      ],
    },
  },
  {
    id: "initials-gkh",
    group: "initial",
    title: "Thanh mẫu g · k · h",
    goal: "Đọc đúng ba âm cuống lưỡi.",
    points: [
      { label: "g", how: "Cuống lưỡi chạm ngạc mềm rồi bật ra, không bật hơi.", viLike: "Gần \"c / k\" tiếng Việt (\"ca\")." },
      { label: "k", how: "Như g nhưng bật hơi mạnh.", viLike: "Gần \"kh\" nhưng là âm bật, không phải âm xát — giống \"k\" tiếng Anh trong \"key\"." },
      { label: "h", how: "Cuống lưỡi nâng gần ngạc mềm, hơi cọ xát đi ra.", viLike: "Gần \"kh\" tiếng Việt nhưng nhẹ hơn; không phải \"h\" Việt (h Việt phát ra từ cổ họng)." },
    ],
    items: [it("gē", "哥", "anh trai", "g"), it("kē", "科", "khoa", "k"), it("hē", "喝", "uống", "h"), it("guān", "关", "đóng", "g"), it("gǒu", "狗", "chó", "g"), it("kě", "渴", "khát", "k")],
    drill: {
      kind: "pairs",
      pairs: [
        [it("gē", "哥", "anh trai", "g"), it("kē", "科", "khoa", "k")],
        [it("gǒu", "狗", "chó", "g"), it("kǒu", "口", "miệng", "k")],
        [it("hē", "喝", "uống", "h"), it("kē", "科", "khoa", "k")],
      ],
    },
  },
  {
    id: "initials-jqx",
    group: "initial",
    title: "Thanh mẫu j · q · x",
    goal: "Đọc đúng ba âm mặt lưỡi, không đọc q thành \"qu\" và x thành \"ks\".",
    points: [
      { label: "j", how: "Mặt lưỡi áp vào ngạc cứng, đầu lưỡi tì sau răng dưới, bật ra không bật hơi.", viLike: "Gần \"ch\" tiếng Việt (\"chi\")." },
      { label: "q", how: "Như j nhưng bật hơi mạnh.", viLike: "Như \"ch\" bật hơi. TUYỆT ĐỐI không đọc là \"qu\"." },
      { label: "x", how: "Mặt lưỡi gần ngạc cứng, hơi xát ra, môi kéo dẹt.", viLike: "Gần \"x\" tiếng Việt, môi dẹt hơn." },
      { label: "Chỉ đi với i, ü", how: "j/q/x chỉ ghép với vần bắt đầu bằng i hoặc ü. Sau j/q/x, ü viết thành u: ju = jü, qu = qü, xue = xüe." },
    ],
    items: [it("jī", "鸡", "gà", "j"), it("qī", "七", "bảy", "q"), it("xī", "西", "tây", "x"), it("jiā", "家", "nhà", "j"), it("qù", "去", "đi", "q"), it("xué", "学", "học", "x")],
    tip: "去 qù đọc gần \"chuy\" có bật hơi, môi tròn — không phải \"cu\". Chữ u sau j/q/x luôn là ü.",
    drill: {
      kind: "pairs",
      pairs: [
        [it("jī", "鸡", "gà", "j"), it("qī", "七", "bảy", "q")],
        [it("qī", "七", "bảy", "q"), it("xī", "西", "tây", "x")],
        [it("jiā", "家", "nhà", "j"), it("xiā", "虾", "tôm", "x")],
      ],
    },
  },
  {
    id: "initials-zh-ch-sh-r",
    group: "initial",
    title: "Thanh mẫu zh · ch · sh · r (uốn lưỡi)",
    goal: "Uốn lưỡi đúng và tách được với z · c · s.",
    points: [
      { label: "zh", how: "Đầu lưỡi cong lên chạm phần ngạc sau lợi, bật ra không bật hơi.", viLike: "Gần \"tr\" tiếng Việt đọc uốn lưỡi." },
      { label: "ch", how: "Như zh nhưng bật hơi mạnh.", viLike: "\"tr\" uốn lưỡi có bật hơi." },
      { label: "sh", how: "Đầu lưỡi cong lên gần ngạc, hơi xát ra.", viLike: "Gần \"s\" uốn lưỡi (như cách phân biệt s/x chuẩn)." },
      { label: "r", how: "Tư thế như sh nhưng dây thanh rung, hơi xát nhẹ.", viLike: "Nằm giữa \"r\" và \"gi\" tiếng Việt; không rung đầu lưỡi." },
      { label: "zhi · chi · shi · ri", how: "Chữ i sau zh/ch/sh/r (và z/c/s) KHÔNG đọc là \"i\": giữ nguyên tư thế lưỡi và kéo dài âm, nghe như \"ư\"." },
    ],
    items: [it("zhī", "知", "biết", "zh"), it("chī", "吃", "ăn", "ch"), it("shì", "是", "là", "sh"), it("rì", "日", "ngày", "r"), it("shū", "书", "sách", "sh"), it("shí", "十", "mười", "sh")],
    tip: "是 shì đọc như \"sư\" uốn lưỡi, không phải \"si\". Đây là lỗi phổ biến nhất của người mới học.",
    drill: {
      kind: "pairs",
      pairs: [
        [it("shì", "是", "là", "sh"), it("sì", "四", "bốn", "s")],
        [it("zhī", "知", "biết", "zh"), it("zī", "资", "vốn", "z")],
        [it("shī", "诗", "thơ", "sh"), it("sī", "丝", "tơ", "s")],
      ],
    },
  },
  {
    id: "initials-z-c-s",
    group: "initial",
    title: "Thanh mẫu z · c · s (đầu lưỡi thẳng)",
    goal: "Đọc c đúng là \"ts\" bật hơi, không đọc thành \"k\".",
    points: [
      { label: "z", how: "Đầu lưỡi thẳng, tì sau răng trên, bật ra không bật hơi.", viLike: "Gần \"ch\" đầu lưỡi, như \"ts\" trong \"cats\"." },
      { label: "c", how: "Như z nhưng bật hơi mạnh.", viLike: "\"ts\" bật hơi. KHÔNG đọc là \"k\" như chữ c tiếng Việt." },
      { label: "s", how: "Đầu lưỡi gần răng trên, hơi xát ra.", viLike: "Như \"x\" tiếng Việt." },
    ],
    items: [it("zì", "字", "chữ", "z"), it("cí", "词", "từ", "c"), it("sì", "四", "bốn", "s"), it("zài", "在", "ở", "z"), it("cài", "菜", "món ăn", "c"), it("sān", "三", "ba", "s")],
    tip: "菜 cài (món ăn) đọc là \"tsʰai\", không phải \"cai\". Chữ c trong pinyin không bao giờ là âm \"k\".",
    drill: {
      kind: "pairs",
      pairs: [
        [it("zài", "在", "ở", "z"), it("cài", "菜", "món ăn", "c")],
        [it("zì", "字", "chữ", "z"), it("cì", "次", "lần", "c")],
        [it("sì", "四", "bốn", "s"), it("shì", "是", "là", "sh")],
      ],
    },
  },

  /* ======================= VẬN MẪU ======================= */
  {
    id: "finals-simple",
    group: "final",
    title: "Vận mẫu đơn a · o · e · i · u · ü và er",
    goal: "Đọc đúng 6 nguyên âm đơn, nhất là e và ü.",
    points: [
      { label: "a", how: "Mở miệng to, lưỡi thấp.", viLike: "Như \"a\" tiếng Việt." },
      { label: "o", how: "Môi tròn, lưỡi lùi sau. Đứng sau b/p/m/f nghe như \"ua\" ngắn: bō ≈ \"bua\".", viLike: "Gần \"ô\" → \"ua\"." },
      { label: "e", how: "Miệng hơi mở, môi KHÔNG tròn, lưỡi lùi về sau.", viLike: "Gần \"ưa\" / \"ơ\" tiếng Việt — không đọc là \"e\"." },
      { label: "i", how: "Môi dẹt, lưỡi nâng cao ra trước.", viLike: "Như \"i\" tiếng Việt." },
      { label: "u", how: "Môi tròn và chu ra, lưỡi lùi sau.", viLike: "Như \"u\" tiếng Việt." },
      { label: "ü", how: "Lưỡi để như đọc \"i\" rồi tròn môi lại, giữ lưỡi không đổi.", viLike: "Tiếng Việt không có; gần \"uy\" đọc liền thành một âm, môi tròn suốt." },
      { label: "er", how: "Đọc e rồi cong đầu lưỡi lên.", viLike: "Gần \"ơ\" + uốn lưỡi." },
    ],
    items: [it("bā", "八", "tám", "a"), it("wǒ", "我", "tôi", "o"), it("hē", "喝", "uống", "e"), it("yī", "衣", "áo", "i"), it("wǔ", "五", "năm (số 5)", "u"), it("yú", "鱼", "cá", "ü"), it("èr", "二", "hai", "er")],
    tip: "喝 hē đọc gần \"hưa\", không phải \"he\"; 鱼 yú phải tròn môi (\"uy\"), không phải \"di\".",
    drill: {
      kind: "pairs",
      pairs: [
        [it("nǚ", "女", "nữ", "ü"), it("nǔ", "努", "cố gắng", "u")],
        [it("lǜ", "绿", "xanh lá", "ü"), it("lù", "路", "đường", "u")],
        [it("yú", "鱼", "cá", "ü"), it("yí", "姨", "dì", "i")],
      ],
    },
  },
  {
    id: "finals-compound",
    group: "final",
    title: "Vận mẫu kép ai · ei · ao · ou",
    goal: "Lướt đúng từ nguyên âm đầu sang nguyên âm sau.",
    points: [
      { label: "ai", how: "Từ a lướt sang i.", viLike: "Như \"ai\" tiếng Việt." },
      { label: "ei", how: "Từ e (gần \"ê\") lướt sang i.", viLike: "Như \"ây\" tiếng Việt." },
      { label: "ao", how: "Từ a lướt sang u (môi tròn dần).", viLike: "Như \"ao\" tiếng Việt." },
      { label: "ou", how: "Từ o lướt sang u.", viLike: "Như \"âu\" tiếng Việt." },
    ],
    items: [it("ài", "爱", "yêu", "ai"), it("hēi", "黑", "đen", "ei"), it("gāo", "高", "cao", "ao"), it("gǒu", "狗", "chó", "ou"), it("mài", "卖", "bán", "ai"), it("mèi", "妹", "em gái", "ei")],
    drill: {
      kind: "pairs",
      pairs: [
        [it("mài", "卖", "bán", "ai"), it("mèi", "妹", "em gái", "ei")],
        [it("gāo", "高", "cao", "ao"), it("gōu", "沟", "rãnh", "ou")],
        [it("bāo", "包", "túi", "ao"), it("bēi", "杯", "cốc", "ei")],
      ],
    },
  },
  {
    id: "finals-i-u-u",
    group: "final",
    title: "Vần bắt đầu bằng i · u · ü",
    goal: "Đọc các vần ia, ie, iao, iu, ua, uo, uai, ui, üe và nhớ cách viết tắt.",
    points: [
      { label: "ia · ie · iao", how: "Bắt đầu bằng i lướt nhanh: ia ≈ \"ia\", ie ≈ \"iê\", iao ≈ \"i-ao\".", viLike: "家 jiā, 谢 xiè, 小 xiǎo." },
      { label: "iu (= iou)", how: "Viết tắt của iou: đọc i + ou, nghe như \"iêu\".", viLike: "六 liù ≈ \"liêu\"." },
      { label: "ua · uo · uai", how: "Bắt đầu bằng u tròn môi: ua ≈ \"oa\", uo ≈ \"ua/uô\", uai ≈ \"oai\".", viLike: "花 huā, 多 duō, 快 kuài." },
      { label: "ui (= uei)", how: "Viết tắt của uei: đọc u + ei, nghe như \"uây\".", viLike: "对 duì ≈ \"tuây\"." },
      { label: "üe", how: "ü tròn môi rồi sang ê. Sau j/q/x/y viết là ue.", viLike: "学 xué ≈ \"xuê\" (môi tròn)." },
    ],
    items: [it("jiā", "家", "nhà", "ia"), it("xiè", "谢", "cảm ơn", "ie"), it("xiǎo", "小", "nhỏ", "iao"), it("liù", "六", "sáu", "iu"), it("huā", "花", "hoa", "ua"), it("duō", "多", "nhiều", "uo"), it("kuài", "快", "nhanh", "uai"), it("duì", "对", "đúng", "ui"), it("xué", "学", "học", "üe")],
    tip: "iu và ui là cách VIẾT tắt — khi đọc vẫn có âm giữa: liù ≈ \"liêu\", duì ≈ \"tuây\".",
    drill: {
      kind: "pairs",
      pairs: [
        [it("liú", "留", "ở lại", "iu"), it("lóu", "楼", "toà nhà", "ou")],
        [it("shuō", "说", "nói", "uo"), it("shōu", "收", "nhận", "ou")],
        [it("xié", "鞋", "giày", "ie"), it("xué", "学", "học", "üe")],
      ],
    },
  },
  {
    id: "finals-nasal",
    group: "final",
    title: "Vần mũi -n và -ng",
    goal: "Tách được an/ang, en/eng, in/ing, ian/iang, uan/uang.",
    points: [
      { label: "-n", how: "Kết thúc bằng đầu lưỡi chạm lợi trên.", viLike: "Như \"-n\" tiếng Việt: an, ân, in." },
      { label: "-ng", how: "Kết thúc bằng cuống lưỡi nâng lên, hơi ra đằng mũi, miệng vẫn mở.", viLike: "Như \"-ng\" tiếng Việt: ang, âng, inh." },
      { label: "en · eng", how: "e ở đây đọc gần \"â\": en ≈ \"ân\", eng ≈ \"âng\"." },
      { label: "ong", how: "Môi tròn, đọc gần \"ung\" tiếng Việt.", viLike: "东 dōng ≈ \"tung\"." },
      { label: "ian · üan", how: "ian đọc gần \"iên\" (không phải \"ian\"); üan (viết uan sau j/q/x/y) gần \"uyên\".", viLike: "先 xiān ≈ \"xiên\", 远 yuǎn ≈ \"uyển\"." },
    ],
    items: [it("bān", "班", "lớp", "an"), it("bāng", "帮", "giúp", "ang"), it("jīn", "金", "vàng", "in"), it("jīng", "京", "kinh đô", "ing"), it("péng", "朋", "bạn (朋友)", "eng"), it("dōng", "东", "đông", "ong"), it("xiān", "先", "trước", "ian"), it("xiāng", "香", "thơm", "iang"), it("yuǎn", "远", "xa", "üan")],
    tip: "Người miền Nam hay lẫn -n/-ng. Tập bằng cặp 新 xīn (mới) / 星 xīng (sao), 班 bān (lớp) / 帮 bāng (giúp).",
    drill: {
      kind: "pairs",
      pairs: [
        [it("bān", "班", "lớp", "an"), it("bāng", "帮", "giúp", "ang")],
        [it("xīn", "新", "mới", "in"), it("xīng", "星", "sao", "ing")],
        [it("xiān", "先", "trước", "ian"), it("xiāng", "香", "thơm", "iang")],
        [it("guān", "关", "đóng", "uan"), it("guāng", "光", "ánh sáng", "uang")],
      ],
    },
  },

  /* ======================= QUY TẮC ======================= */
  {
    id: "sandhi",
    group: "rule",
    title: "Biến điệu: thanh 3, 不 và 一",
    goal: "Đọc đúng các từ có biến điệu như 你好, 不是, 一起.",
    points: [
      { label: "3 + 3 → 2 + 3", how: "Hai âm thanh 3 đứng liền nhau thì âm đầu đọc thành thanh 2. Chữ viết vẫn giữ dấu thanh 3.", viLike: "你好 nǐ hǎo đọc là ní hǎo; 可以 kě yǐ đọc là ké yǐ." },
      { label: "Nửa thanh 3", how: "Thanh 3 đứng trước thanh 1, 2, 4 hoặc thanh nhẹ chỉ đọc nửa đầu: xuống thấp và dừng, không vòng lên.", viLike: "老师 lǎoshī: \"lǎo\" trầm xuống rồi sang ngay \"shī\"." },
      { label: "不 bù", how: "Đứng trước thanh 4 thì đọc thanh 2: bú. Trước thanh 1, 2, 3 giữ bù.", viLike: "不是 bú shì, 不要 bú yào, nhưng 不好 bù hǎo, 不来 bù lái." },
      { label: "一 yī", how: "Trước thanh 4 đọc yí; trước thanh 1, 2, 3 đọc yì. Đứng một mình, cuối từ, khi đếm số hoặc chỉ thứ tự thì giữ yī.", viLike: "一样 yí yàng, 一起 yì qǐ, 一天 yì tiān; nhưng 第一 dì yī, 星期一 xīngqī yī, 一月 yī yuè." },
    ],
    items: [it("nǐ hǎo", "你好", "xin chào"), it("kě yǐ", "可以", "có thể"), it("bù shì", "不是", "không phải"), it("bù hǎo", "不好", "không tốt"), it("yī qǐ", "一起", "cùng nhau"), it("yī yàng", "一样", "giống nhau")],
    tip: "Sách và từ điển thường ghi dấu GỐC (nǐ hǎo, bù shì). Trong EngQuiz, chỗ nào đọc khác cách viết sẽ hiện thêm dòng \"đọc là\".",
    drill: {
      kind: "mcq",
      rounds: [
        { say: "你好", prompt: "你好 (nǐ hǎo) thực tế đọc là?", options: ["ní hǎo", "nǐ hǎo", "nǐ háo"], answer: 0, explain: "Hai thanh 3 liền nhau: âm đầu đọc thành thanh 2." },
        { say: "不是", prompt: "不是 (bù shì) đọc là?", options: ["bù shì", "bú shì", "bǔ shì"], answer: 1, explain: "是 là thanh 4, nên 不 đọc thanh 2: bú." },
        { say: "不好", prompt: "不好 (bù hǎo) đọc là?", options: ["bú hǎo", "bù hǎo", "bù háo"], answer: 1, explain: "好 là thanh 3, nên 不 giữ nguyên thanh 4." },
        { say: "一起", prompt: "一起 (yī qǐ) đọc là?", options: ["yí qǐ", "yì qǐ", "yī qǐ"], answer: 1, explain: "起 là thanh 3, nên 一 đọc thanh 4: yì." },
        { say: "一样", prompt: "一样 (yī yàng) đọc là?", options: ["yì yàng", "yī yàng", "yí yàng"], answer: 2, explain: "样 là thanh 4, nên 一 đọc thanh 2: yí." },
        { say: "第一", prompt: "第一 (dì yī) đọc là?", options: ["dì yī", "dì yí", "dì yì"], answer: 0, explain: "一 chỉ thứ tự (thứ nhất) và đứng cuối: giữ yī." },
        { say: "可以", prompt: "可以 (kě yǐ) đọc là?", options: ["kě yí", "ké yǐ", "kě yǐ"], answer: 1, explain: "Hai thanh 3 liền nhau: âm đầu thành thanh 2." },
        { say: "一天", prompt: "一天 (yī tiān) đọc là?", options: ["yì tiān", "yí tiān", "yī tiān"], answer: 0, explain: "天 là thanh 1, nên 一 đọc thanh 4: yì." },
      ],
    },
  },
  {
    id: "spelling",
    group: "rule",
    title: "Quy tắc viết pinyin và đặt dấu thanh",
    goal: "Đọc đúng pinyin viết tắt (y, w, iu, ui, un, ü→u) và biết dấu thanh đặt ở đâu.",
    points: [
      { label: "y · w", how: "Âm tiết bắt đầu bằng i, u, ü thì viết y, w: i → yi, ia → ya, u → wu, ua → wa, ü → yu, üe → yue." },
      { label: "Bỏ hai chấm của ü", how: "Sau j, q, x, y thì ü viết thành u (ju, qu, xu, yu). Chỉ sau n, l mới giữ hai chấm để phân biệt: nü ≠ nu, lü ≠ lu." },
      { label: "iu · ui · un", how: "iou → iu, uei → ui, uen → un khi có phụ âm đầu: liù, duì, lùn. Khi đọc vẫn có âm giữa." },
      { label: "Đặt dấu thanh", how: "Có a thì dấu trên a; không có a thì trên o hoặc e (ou → trên o); iu, ui đặt dấu trên chữ cuối: liù, duì." },
      { label: "Dấu cách âm '", how: "Âm tiết bắt đầu bằng a, o, e đứng sau âm khác thì thêm ' để khỏi đọc nhầm: Xī'ān (西安, 2 âm) khác xiān (先, 1 âm)." },
    ],
    items: [it("yú", "鱼", "cá"), it("xué", "学", "học"), it("liù", "六", "sáu"), it("duì", "对", "đúng"), it("wǔ", "五", "năm (số 5)"), it("nǚ", "女", "nữ")],
    drill: {
      kind: "mcq",
      rounds: [
        { prompt: "Âm tiết \"xu\" (学 xué, 去 qù…) có nguyên âm thật là?", options: ["u", "ü"], answer: 1, explain: "Sau j, q, x, y chữ u luôn là ü (đã bỏ hai chấm)." },
        { prompt: "\"liu\" là cách viết tắt của?", options: ["liou", "lieu", "lüu"], answer: 0, explain: "iou có phụ âm đầu thì viết tắt thành iu." },
        { prompt: "Dấu thanh 4 của \"gui\" đặt ở đâu?", options: ["guì", "gùi"], answer: 0, explain: "Với ui (và iu), dấu đặt trên chữ cuối." },
        { prompt: "Dấu thanh 3 của \"hao\" đặt ở đâu?", options: ["hǎo", "haǒ"], answer: 0, explain: "Có a thì dấu luôn đặt trên a." },
        { prompt: "Viết pinyin cho âm i + ou đứng một mình (thanh 3, 有)?", options: ["iǒu", "yǒu", "yǐu"], answer: 1, explain: "Không có phụ âm đầu: i → y, viết đầy đủ you; dấu đặt trên o." },
        { prompt: "Từ nào cần hai chấm trên u?", options: ["nü (女)", "ju (句)", "yu (鱼)"], answer: 0, explain: "Chỉ sau n, l mới giữ ü để phân biệt nu / nü, lu / lü." },
        { say: "西安", prompt: "\"Xī'ān\" (西安) có mấy âm tiết?", options: ["1", "2"], answer: 1, explain: "Dấu ' tách hai âm tiết Xī và ān; khác với xiān (先) chỉ một âm." },
      ],
    },
  },
];

export const PINYIN_LESSON_MAP: Record<string, PinyinLesson> = Object.fromEntries(PINYIN_LESSONS.map((l) => [l.id, l]));

export interface ChartCell {
  /** Thanh mẫu, vd "zh" */
  symbol: string;
  /** Âm tiết mẫu để nghe */
  sample: PinyinItem;
}

/** Bảng 21 thanh mẫu theo vị trí phát âm; bấm vào ô để nghe âm tiết mẫu. */
export const INITIAL_CHART: { label: string; cells: ChartCell[] }[] = [
  { label: "Hai môi, môi răng", cells: [c("b", "bā", "八", "tám"), c("p", "pà", "怕", "sợ"), c("m", "mǎ", "马", "ngựa"), c("f", "fēi", "飞", "bay")] },
  { label: "Đầu lưỡi", cells: [c("d", "dà", "大", "to"), c("t", "tā", "他", "anh ấy"), c("n", "nǐ", "你", "bạn"), c("l", "lái", "来", "đến")] },
  { label: "Cuống lưỡi", cells: [c("g", "gē", "哥", "anh trai"), c("k", "kē", "科", "khoa"), c("h", "hē", "喝", "uống")] },
  { label: "Mặt lưỡi", cells: [c("j", "jī", "鸡", "gà"), c("q", "qī", "七", "bảy"), c("x", "xī", "西", "tây")] },
  { label: "Uốn lưỡi", cells: [c("zh", "zhī", "知", "biết"), c("ch", "chī", "吃", "ăn"), c("sh", "shì", "是", "là"), c("r", "rì", "日", "ngày")] },
  { label: "Đầu lưỡi thẳng", cells: [c("z", "zì", "字", "chữ"), c("c", "cí", "词", "từ"), c("s", "sì", "四", "bốn")] },
];

function c(symbol: string, pinyin: string, hanzi: string, vi: string): ChartCell {
  return { symbol, sample: it(pinyin, hanzi, vi, symbol) };
}
