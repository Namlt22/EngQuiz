/**
 * Bảng phiên âm quốc tế IPA — 44 âm tiếng Anh (giọng Anh-Anh chuẩn RP,
 * bộ ký hiệu dùng trong từ điển Oxford / Cambridge).
 * Bố cục bảng theo kiểu "phonemic chart" quen thuộc với người học Việt Nam.
 */

export type IpaGroup = "short" | "long" | "diphthong" | "voiceless" | "voiced";

export interface IpaExample {
  word: string;
  ipa: string;
  vi: string;
}

export interface IpaSound {
  id: string;
  symbol: string;
  group: IpaGroup;
  /** Mô tả cách phát âm: khẩu hình môi, vị trí lưỡi, dây thanh. */
  guide: string;
  /** Âm tiếng Việt gần giống (nếu có). */
  viLike?: string;
  /** Lỗi người Việt hay mắc / mẹo. */
  tip?: string;
  /** Ghi chú khác biệt giọng Anh-Mỹ. */
  us?: string;
  examples: IpaExample[];
  /** Cặp từ tối thiểu để so sánh với một âm dễ nhầm. */
  pair?: { with: string; a: IpaExample; b: IpaExample };
}

export const IPA_GROUP_INFO: Record<IpaGroup, { label: string; cell: string; dot: string }> = {
  short: {
    label: "Nguyên âm ngắn",
    cell: "bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-500/40",
    dot: "bg-sky-500",
  },
  long: {
    label: "Nguyên âm dài",
    cell: "bg-indigo-100 text-indigo-800 ring-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-500/40",
    dot: "bg-indigo-500",
  },
  diphthong: {
    label: "Nguyên âm đôi",
    cell: "bg-violet-100 text-violet-800 ring-violet-300 dark:bg-violet-500/15 dark:text-violet-200 dark:ring-violet-500/40",
    dot: "bg-violet-500",
  },
  voiceless: {
    label: "Phụ âm vô thanh",
    cell: "bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/40",
    dot: "bg-amber-500",
  },
  voiced: {
    label: "Phụ âm hữu thanh",
    cell: "bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-500/40",
    dot: "bg-emerald-500",
  },
};

const ex = (word: string, ipa: string, vi: string): IpaExample => ({ word, ipa, vi });

export const IPA_SOUNDS: IpaSound[] = [
  /* ================= NGUYÊN ÂM ĐƠN (12) ================= */
  {
    id: "i-long", symbol: "iː", group: "long",
    guide: "Môi kéo rộng sang hai bên như đang cười, lưỡi nâng cao và đưa ra phía trước. Đọc \"i\" và KÉO DÀI, cơ miệng căng.",
    viLike: "Gần \"i\" tiếng Việt nhưng dài và căng hơn.",
    tip: "Đừng đọc ngắn như /ɪ/, nếu không \"sheep\" (con cừu) sẽ thành \"ship\" (con tàu).",
    examples: [ex("see", "/siː/", "nhìn thấy"), ex("eat", "/iːt/", "ăn"), ex("people", "/ˈpiːpl/", "mọi người")],
    pair: { with: "i-short", a: ex("sheep", "/ʃiːp/", "con cừu"), b: ex("ship", "/ʃɪp/", "con tàu") },
  },
  {
    id: "i-short", symbol: "ɪ", group: "short",
    guide: "Môi hơi mở, lưỡi thấp hơn /iː/ một chút, cơ miệng thả lỏng. Đọc NGẮN, dứt khoát.",
    viLike: "Nằm giữa \"i\" và \"ê\" tiếng Việt, đọc rất ngắn.",
    tip: "Người Việt hay đọc /ɪ/ thành /iː/ dài. Hãy đọc thật ngắn và thả lỏng.",
    examples: [ex("sit", "/sɪt/", "ngồi"), ex("big", "/bɪɡ/", "to, lớn"), ex("women", "/ˈwɪmɪn/", "phụ nữ (số nhiều)")],
    pair: { with: "i-long", a: ex("ship", "/ʃɪp/", "con tàu"), b: ex("sheep", "/ʃiːp/", "con cừu") },
  },
  {
    id: "u-short", symbol: "ʊ", group: "short",
    guide: "Môi hơi tròn nhưng không chu nhiều, lưỡi lùi về phía sau và thả lỏng. Đọc NGẮN.",
    viLike: "Gần \"u\" tiếng Việt nhưng ngắn và nhẹ hơn.",
    examples: [ex("book", "/bʊk/", "quyển sách"), ex("put", "/pʊt/", "đặt, để"), ex("good", "/ɡʊd/", "tốt")],
    pair: { with: "u-long", a: ex("full", "/fʊl/", "đầy"), b: ex("fool", "/fuːl/", "kẻ ngốc") },
  },
  {
    id: "u-long", symbol: "uː", group: "long",
    guide: "Môi tròn và chu hẳn ra phía trước, lưỡi nâng cao ở phía sau. Đọc \"u\" và KÉO DÀI.",
    viLike: "Gần \"u\" tiếng Việt nhưng môi chu hơn và dài hơn.",
    examples: [ex("food", "/fuːd/", "thức ăn"), ex("blue", "/bluː/", "màu xanh dương"), ex("two", "/tuː/", "số hai")],
    pair: { with: "u-short", a: ex("fool", "/fuːl/", "kẻ ngốc"), b: ex("full", "/fʊl/", "đầy") },
  },
  {
    id: "e", symbol: "e", group: "short",
    guide: "Miệng mở vừa, môi dẹt sang hai bên, lưỡi ở giữa và hơi đưa ra trước. Đọc ngắn.",
    viLike: "Nằm giữa \"e\" và \"ê\" tiếng Việt.",
    examples: [ex("bed", "/bed/", "cái giường"), ex("ten", "/ten/", "số mười"), ex("head", "/hed/", "cái đầu")],
    pair: { with: "ae", a: ex("bed", "/bed/", "cái giường"), b: ex("bad", "/bæd/", "tồi, xấu") },
  },
  {
    id: "schwa", symbol: "ə", group: "short",
    guide: "Âm \"schwa\" — âm yếu và phổ biến nhất trong tiếng Anh. Miệng và lưỡi thả lỏng hoàn toàn, đọc \"ơ\" thật nhẹ và ngắn. Chỉ xuất hiện ở âm tiết KHÔNG nhấn.",
    viLike: "Như \"ơ\" tiếng Việt nhưng rất nhẹ, gần như lướt qua.",
    tip: "Người Việt hay đọc rõ mọi nguyên âm (ba-na-na) làm mất nhịp. Hãy đọc /bəˈnɑːnə/: chỉ âm giữa mạnh, hai âm /ə/ rất nhẹ.",
    examples: [ex("about", "/əˈbaʊt/", "về, khoảng"), ex("teacher", "/ˈtiːtʃə/", "giáo viên"), ex("banana", "/bəˈnɑːnə/", "quả chuối")],
  },
  {
    id: "er-long", symbol: "ɜː", group: "long",
    guide: "Miệng mở vừa, môi thả lỏng (không tròn), lưỡi nằm ở giữa khoang miệng. Đọc \"ơ\" và KÉO DÀI.",
    viLike: "Gần \"ơ\" tiếng Việt kéo dài.",
    us: "Giọng Mỹ cong lưỡi thêm âm r: bird /bɝːd/.",
    examples: [ex("bird", "/bɜːd/", "con chim"), ex("work", "/wɜːk/", "làm việc"), ex("learn", "/lɜːn/", "học")],
  },
  {
    id: "or-long", symbol: "ɔː", group: "long",
    guide: "Môi tròn, miệng mở vừa, lưỡi lùi về sau. Đọc \"o\" và KÉO DÀI.",
    viLike: "Gần \"o\" tiếng Việt kéo dài.",
    examples: [ex("door", "/dɔː/", "cánh cửa"), ex("saw", "/sɔː/", "đã nhìn thấy"), ex("talk", "/tɔːk/", "nói chuyện")],
    pair: { with: "o-short", a: ex("port", "/pɔːt/", "cảng"), b: ex("pot", "/pɒt/", "cái nồi") },
  },
  {
    id: "ae", symbol: "æ", group: "short",
    guide: "Miệng mở RỘNG, hàm dưới hạ thấp, môi kéo sang hai bên. Đọc như \"e\" nhưng mở miệng to như khi đọc \"a\".",
    viLike: "Không có trong tiếng Việt — nằm giữa \"e\" và \"a\".",
    tip: "Lỗi phổ biến: đọc thành \"a\" (cat → \"cát\") hoặc \"e\" (bad → \"bed\"). Hãy hạ hàm thật thấp.",
    examples: [ex("cat", "/kæt/", "con mèo"), ex("bad", "/bæd/", "tồi, xấu"), ex("apple", "/ˈæpl/", "quả táo")],
    pair: { with: "e", a: ex("bad", "/bæd/", "tồi, xấu"), b: ex("bed", "/bed/", "cái giường") },
  },
  {
    id: "uh", symbol: "ʌ", group: "short",
    guide: "Miệng hơi mở, môi thả lỏng, lưỡi ở giữa hơi lùi sau. Đọc NGẮN, bật nhanh.",
    viLike: "Gần \"ă\" tiếng Việt.",
    examples: [ex("cup", "/kʌp/", "cái cốc"), ex("love", "/lʌv/", "yêu"), ex("money", "/ˈmʌni/", "tiền")],
    pair: { with: "a-long", a: ex("hut", "/hʌt/", "túp lều"), b: ex("heart", "/hɑːt/", "trái tim") },
  },
  {
    id: "a-long", symbol: "ɑː", group: "long",
    guide: "Miệng mở to, lưỡi hạ thấp và lùi về sau. Đọc \"a\" và KÉO DÀI.",
    viLike: "Gần \"a\" tiếng Việt kéo dài.",
    us: "Giọng Mỹ thường thêm âm r khi có chữ r: car /kɑːr/.",
    examples: [ex("car", "/kɑː/", "ô tô"), ex("father", "/ˈfɑːðə/", "bố"), ex("heart", "/hɑːt/", "trái tim")],
    pair: { with: "uh", a: ex("heart", "/hɑːt/", "trái tim"), b: ex("hut", "/hʌt/", "túp lều") },
  },
  {
    id: "o-short", symbol: "ɒ", group: "short",
    guide: "Môi hơi tròn, miệng mở rộng, lưỡi hạ thấp ở phía sau. Đọc NGẮN.",
    viLike: "Gần \"o\" tiếng Việt đọc thật nhanh.",
    us: "Giọng Mỹ đọc gần như /ɑː/: hot ≈ \"hát\".",
    examples: [ex("hot", "/hɒt/", "nóng"), ex("dog", "/dɒɡ/", "con chó"), ex("watch", "/wɒtʃ/", "xem, đồng hồ")],
    pair: { with: "or-long", a: ex("pot", "/pɒt/", "cái nồi"), b: ex("port", "/pɔːt/", "cảng") },
  },

  /* ================= NGUYÊN ÂM ĐÔI (8) ================= */
  {
    id: "ia", symbol: "ɪə", group: "diphthong",
    guide: "Bắt đầu bằng /ɪ/ rồi trượt nhẹ sang /ə/. Âm đầu rõ, âm sau nhẹ.",
    viLike: "Gần \"ia\" trong \"bia\".",
    examples: [ex("here", "/hɪə/", "ở đây"), ex("near", "/nɪə/", "gần"), ex("idea", "/aɪˈdɪə/", "ý tưởng")],
  },
  {
    id: "ei", symbol: "eɪ", group: "diphthong",
    guide: "Bắt đầu bằng /e/ rồi trượt lên /ɪ/, miệng hẹp dần.",
    viLike: "Gần \"ây\" / \"êi\".",
    tip: "Đừng đọc thành \"ê\" đơn (name → \"nêm\"); phải nghe được phần /ɪ/ ở cuối.",
    examples: [ex("day", "/deɪ/", "ngày"), ex("name", "/neɪm/", "tên"), ex("great", "/ɡreɪt/", "tuyệt vời")],
  },
  {
    id: "ua", symbol: "ʊə", group: "diphthong",
    guide: "Bắt đầu bằng /ʊ/ (môi hơi tròn) rồi trượt sang /ə/ thả lỏng.",
    viLike: "Gần \"ua\" trong \"mua\".",
    us: "Nhiều người (cả Anh và Mỹ) đọc thành /ɔː/: sure /ʃɔː/.",
    examples: [ex("tour", "/tʊə/", "chuyến du lịch"), ex("pure", "/pjʊə/", "tinh khiết"), ex("sure", "/ʃʊə/", "chắc chắn")],
  },
  {
    id: "oi", symbol: "ɔɪ", group: "diphthong",
    guide: "Bắt đầu bằng /ɔː/ môi tròn rồi trượt sang /ɪ/, môi dẹt dần.",
    viLike: "Gần \"oi\" trong \"con voi\".",
    examples: [ex("boy", "/bɔɪ/", "cậu bé"), ex("coin", "/kɔɪn/", "đồng xu"), ex("enjoy", "/ɪnˈdʒɔɪ/", "thích thú")],
  },
  {
    id: "ou", symbol: "əʊ", group: "diphthong",
    guide: "Bắt đầu bằng /ə/ thả lỏng rồi tròn môi trượt sang /ʊ/.",
    viLike: "Gần \"âu\" trong \"câu\".",
    tip: "Đừng đọc thành \"ô\" đơn (home → \"hôm\").",
    us: "Giọng Mỹ: /oʊ/ — bắt đầu từ \"ô\": go /ɡoʊ/.",
    examples: [ex("go", "/ɡəʊ/", "đi"), ex("home", "/həʊm/", "nhà"), ex("phone", "/fəʊn/", "điện thoại")],
  },
  {
    id: "ea", symbol: "eə", group: "diphthong",
    guide: "Bắt đầu bằng /e/ rồi trượt nhẹ sang /ə/.",
    viLike: "Gần \"e-ơ\" đọc liền.",
    us: "Giọng Mỹ: /er/ — hair /her/.",
    examples: [ex("hair", "/heə/", "tóc"), ex("care", "/keə/", "quan tâm"), ex("where", "/weə/", "ở đâu")],
  },
  {
    id: "ai", symbol: "aɪ", group: "diphthong",
    guide: "Bắt đầu bằng /a/ mở miệng rộng rồi trượt lên /ɪ/.",
    viLike: "Gần \"ai\" tiếng Việt.",
    examples: [ex("my", "/maɪ/", "của tôi"), ex("time", "/taɪm/", "thời gian"), ex("buy", "/baɪ/", "mua")],
  },
  {
    id: "au", symbol: "aʊ", group: "diphthong",
    guide: "Bắt đầu bằng /a/ mở miệng rộng rồi tròn môi trượt sang /ʊ/.",
    viLike: "Gần \"ao\" tiếng Việt.",
    examples: [ex("now", "/naʊ/", "bây giờ"), ex("house", "/haʊs/", "ngôi nhà"), ex("mouth", "/maʊθ/", "cái miệng")],
  },

  /* ================= PHỤ ÂM (24) ================= */
  {
    id: "p", symbol: "p", group: "voiceless",
    guide: "Mím hai môi, giữ hơi rồi bật mạnh ra. Không rung dây thanh. Đặt tờ giấy trước miệng sẽ thấy giấy rung.",
    viLike: "Như \"p\" tiếng Việt nhưng bật hơi mạnh hơn.",
    examples: [ex("pen", "/pen/", "cái bút"), ex("happy", "/ˈhæpi/", "vui vẻ"), ex("stop", "/stɒp/", "dừng lại")],
    pair: { with: "b", a: ex("pen", "/pen/", "cái bút"), b: ex("Ben", "/ben/", "tên riêng") },
  },
  {
    id: "b", symbol: "b", group: "voiced",
    guide: "Mím hai môi rồi bật ra như /p/ nhưng RUNG dây thanh, hơi bật nhẹ hơn.",
    viLike: "Như \"b\" tiếng Việt.",
    tip: "Ở cuối từ (job, rub) vẫn phải bật nhẹ âm /b/, đừng bỏ.",
    examples: [ex("bag", "/bæɡ/", "cái túi"), ex("rubber", "/ˈrʌbə/", "cục tẩy"), ex("job", "/dʒɒb/", "công việc")],
    pair: { with: "p", a: ex("Ben", "/ben/", "tên riêng"), b: ex("pen", "/pen/", "cái bút") },
  },
  {
    id: "t", symbol: "t", group: "voiceless",
    guide: "Đầu lưỡi chạm vào lợi (phần nhô sau răng cửa trên), giữ hơi rồi bật mạnh. Không rung dây thanh.",
    viLike: "Gần \"th\" tiếng Việt (bật hơi) hơn là \"t\".",
    tip: "Lỗi phổ biến: nuốt âm /t/ ở cuối từ (cat → \"ca\"). Hãy bật nhẹ âm cuối.",
    us: "Giọng Mỹ: /t/ giữa hai nguyên âm đọc gần như /d/: water ≈ \"wader\".",
    examples: [ex("tea", "/tiː/", "trà"), ex("water", "/ˈwɔːtə/", "nước"), ex("cat", "/kæt/", "con mèo")],
    pair: { with: "d", a: ex("write", "/raɪt/", "viết"), b: ex("ride", "/raɪd/", "cưỡi, đi xe") },
  },
  {
    id: "d", symbol: "d", group: "voiced",
    guide: "Vị trí như /t/ (đầu lưỡi ở lợi trên) nhưng RUNG dây thanh.",
    viLike: "Gần \"đ\" tiếng Việt, nhưng lưỡi đặt ở lợi chứ không chạm răng.",
    examples: [ex("dog", "/dɒɡ/", "con chó"), ex("ladder", "/ˈlædə/", "cái thang"), ex("bed", "/bed/", "cái giường")],
    pair: { with: "t", a: ex("ride", "/raɪd/", "cưỡi, đi xe"), b: ex("write", "/raɪt/", "viết") },
  },
  {
    id: "ch", symbol: "tʃ", group: "voiceless",
    guide: "Đầu lưỡi chạm lợi trên, môi hơi chu tròn ra trước, bật hơi mạnh. Không rung dây thanh.",
    viLike: "Gần \"ch\" tiếng Việt nhưng môi chu và bật hơi mạnh hơn.",
    examples: [ex("chair", "/tʃeə/", "cái ghế"), ex("teacher", "/ˈtiːtʃə/", "giáo viên"), ex("watch", "/wɒtʃ/", "xem, đồng hồ")],
    pair: { with: "dj", a: ex("cheap", "/tʃiːp/", "rẻ"), b: ex("jeep", "/dʒiːp/", "xe jeep") },
  },
  {
    id: "dj", symbol: "dʒ", group: "voiced",
    guide: "Như /tʃ/ (môi chu, lưỡi ở lợi) nhưng RUNG dây thanh.",
    viLike: "Gần \"giơ\" đọc chu môi, không có trong tiếng Việt chuẩn.",
    examples: [ex("job", "/dʒɒb/", "công việc"), ex("age", "/eɪdʒ/", "tuổi"), ex("bridge", "/brɪdʒ/", "cây cầu")],
    pair: { with: "ch", a: ex("jeep", "/dʒiːp/", "xe jeep"), b: ex("cheap", "/tʃiːp/", "rẻ") },
  },
  {
    id: "k", symbol: "k", group: "voiceless",
    guide: "Cuống lưỡi nâng lên chạm vòm mềm phía sau, giữ hơi rồi bật mạnh. Không rung dây thanh.",
    viLike: "Như \"k / c\" tiếng Việt nhưng bật hơi hơn.",
    tip: "Âm /k/ cuối từ (book, like) phải nghe rõ.",
    examples: [ex("key", "/kiː/", "chìa khóa"), ex("school", "/skuːl/", "trường học"), ex("book", "/bʊk/", "quyển sách")],
    pair: { with: "g", a: ex("coat", "/kəʊt/", "áo khoác"), b: ex("goat", "/ɡəʊt/", "con dê") },
  },
  {
    id: "g", symbol: "ɡ", group: "voiced",
    guide: "Vị trí như /k/ (cuống lưỡi chạm vòm mềm) nhưng RUNG dây thanh.",
    viLike: "Như \"g\" tiếng Việt.",
    examples: [ex("girl", "/ɡɜːl/", "cô gái"), ex("again", "/əˈɡen/", "lần nữa"), ex("big", "/bɪɡ/", "to, lớn")],
    pair: { with: "k", a: ex("goat", "/ɡəʊt/", "con dê"), b: ex("coat", "/kəʊt/", "áo khoác") },
  },
  {
    id: "f", symbol: "f", group: "voiceless",
    guide: "Răng cửa trên chạm nhẹ môi dưới, thổi hơi qua khe hở. Không rung dây thanh.",
    viLike: "Như \"ph\" tiếng Việt.",
    examples: [ex("fish", "/fɪʃ/", "con cá"), ex("coffee", "/ˈkɒfi/", "cà phê"), ex("laugh", "/lɑːf/", "cười")],
    pair: { with: "v", a: ex("fan", "/fæn/", "cái quạt"), b: ex("van", "/væn/", "xe tải nhỏ") },
  },
  {
    id: "v", symbol: "v", group: "voiced",
    guide: "Như /f/ (răng trên chạm môi dưới) nhưng RUNG dây thanh.",
    viLike: "Như \"v\" tiếng Việt.",
    tip: "Âm /v/ cuối từ (love, five) hay bị bỏ hoặc đọc thành /f/.",
    examples: [ex("very", "/ˈveri/", "rất"), ex("river", "/ˈrɪvə/", "dòng sông"), ex("love", "/lʌv/", "yêu")],
    pair: { with: "f", a: ex("van", "/væn/", "xe tải nhỏ"), b: ex("fan", "/fæn/", "cái quạt") },
  },
  {
    id: "th-voiceless", symbol: "θ", group: "voiceless",
    guide: "Đặt đầu lưỡi giữa hai hàm răng (thè nhẹ ra), thổi hơi qua khe giữa lưỡi và răng trên. Không rung dây thanh.",
    viLike: "Không có trong tiếng Việt.",
    tip: "Đừng đọc thành \"th\" tiếng Việt, \"t\" hay \"s\": think ≠ \"thinh\" ≠ \"sink\". Lưỡi PHẢI ở giữa hai răng.",
    examples: [ex("think", "/θɪŋk/", "nghĩ"), ex("birthday", "/ˈbɜːθdeɪ/", "sinh nhật"), ex("mouth", "/maʊθ/", "cái miệng")],
    pair: { with: "s", a: ex("think", "/θɪŋk/", "nghĩ"), b: ex("sink", "/sɪŋk/", "bồn rửa") },
  },
  {
    id: "th-voiced", symbol: "ð", group: "voiced",
    guide: "Vị trí như /θ/ (đầu lưỡi giữa hai răng) nhưng RUNG dây thanh.",
    viLike: "Không có trong tiếng Việt.",
    tip: "Đừng đọc thành \"đ\" hay \"d\": this ≠ \"đít\", they ≠ \"day\".",
    examples: [ex("this", "/ðɪs/", "cái này"), ex("mother", "/ˈmʌðə/", "mẹ"), ex("breathe", "/briːð/", "thở")],
    pair: { with: "d", a: ex("they", "/ðeɪ/", "họ"), b: ex("day", "/deɪ/", "ngày") },
  },
  {
    id: "s", symbol: "s", group: "voiceless",
    guide: "Đầu lưỡi gần chạm lợi trên, đẩy hơi qua khe hẹp tạo tiếng xì. Không rung dây thanh.",
    viLike: "Như \"x\" tiếng Việt.",
    tip: "Lỗi rất phổ biến: bỏ âm /s/ cuối từ (books → \"búc\"). Âm này mang nghĩa ngữ pháp (số nhiều, ngôi 3)!",
    examples: [ex("sun", "/sʌn/", "mặt trời"), ex("city", "/ˈsɪti/", "thành phố"), ex("bus", "/bʌs/", "xe buýt")],
    pair: { with: "z", a: ex("bus", "/bʌs/", "xe buýt"), b: ex("buzz", "/bʌz/", "tiếng vo ve") },
  },
  {
    id: "z", symbol: "z", group: "voiced",
    guide: "Như /s/ nhưng RUNG dây thanh — nghe như tiếng ong vo ve.",
    viLike: "Gần \"d\" giọng miền Bắc nhưng có tiếng rung xì.",
    examples: [ex("zoo", "/zuː/", "sở thú"), ex("easy", "/ˈiːzi/", "dễ"), ex("rose", "/rəʊz/", "hoa hồng")],
    pair: { with: "s", a: ex("buzz", "/bʌz/", "tiếng vo ve"), b: ex("bus", "/bʌs/", "xe buýt") },
  },
  {
    id: "sh", symbol: "ʃ", group: "voiceless",
    guide: "Môi chu tròn ra trước, mặt lưỡi nâng gần vòm cứng, đẩy hơi tạo tiếng \"suỵt\". Không rung dây thanh.",
    viLike: "Như \"s\" (nặng) tiếng Việt, môi chu hơn.",
    examples: [ex("she", "/ʃiː/", "cô ấy"), ex("ocean", "/ˈəʊʃn/", "đại dương"), ex("fish", "/fɪʃ/", "con cá")],
    pair: { with: "s", a: ex("she", "/ʃiː/", "cô ấy"), b: ex("sea", "/siː/", "biển") },
  },
  {
    id: "zh", symbol: "ʒ", group: "voiced",
    guide: "Như /ʃ/ (môi chu) nhưng RUNG dây thanh. Âm hiếm, thường ở giữa từ.",
    viLike: "Gần \"gi\" đọc chu môi, không có trong tiếng Việt chuẩn.",
    examples: [ex("vision", "/ˈvɪʒn/", "tầm nhìn"), ex("usually", "/ˈjuːʒuəli/", "thường xuyên"), ex("garage", "/ˈɡærɑːʒ/", "ga-ra")],
  },
  {
    id: "m", symbol: "m", group: "voiced",
    guide: "Mím hai môi, cho hơi đi qua mũi, rung dây thanh.",
    viLike: "Như \"m\" tiếng Việt.",
    examples: [ex("man", "/mæn/", "người đàn ông"), ex("summer", "/ˈsʌmə/", "mùa hè"), ex("room", "/ruːm/", "căn phòng")],
  },
  {
    id: "n", symbol: "n", group: "voiced",
    guide: "Đầu lưỡi chạm lợi trên, hơi đi qua mũi, rung dây thanh.",
    viLike: "Như \"n\" tiếng Việt.",
    examples: [ex("no", "/nəʊ/", "không"), ex("dinner", "/ˈdɪnə/", "bữa tối"), ex("ten", "/ten/", "số mười")],
    pair: { with: "ng", a: ex("thin", "/θɪn/", "gầy, mỏng"), b: ex("thing", "/θɪŋ/", "đồ vật") },
  },
  {
    id: "ng", symbol: "ŋ", group: "voiced",
    guide: "Cuống lưỡi nâng chạm vòm mềm (như /k/), hơi đi qua mũi, rung dây thanh. Không bao giờ đứng đầu từ.",
    viLike: "Như \"ng\" tiếng Việt.",
    tip: "Đừng đọc -ng cuối thành /n/: thing ≠ thin.",
    examples: [ex("sing", "/sɪŋ/", "hát"), ex("think", "/θɪŋk/", "nghĩ"), ex("finger", "/ˈfɪŋɡə/", "ngón tay")],
    pair: { with: "n", a: ex("thing", "/θɪŋ/", "đồ vật"), b: ex("thin", "/θɪn/", "gầy, mỏng") },
  },
  {
    id: "h", symbol: "h", group: "voiceless",
    guide: "Miệng mở, đẩy hơi nhẹ từ cổ họng ra như khi hà hơi lên kính. Không rung dây thanh.",
    viLike: "Như \"h\" tiếng Việt nhưng nhẹ hơn.",
    tip: "Một số từ có chữ h câm: hour /ˈaʊə/, honest /ˈɒnɪst/.",
    examples: [ex("hat", "/hæt/", "cái mũ"), ex("behind", "/bɪˈhaɪnd/", "phía sau"), ex("who", "/huː/", "ai")],
  },
  {
    id: "l", symbol: "l", group: "voiced",
    guide: "Đầu lưỡi chạm lợi trên, hơi thoát ra hai bên lưỡi, rung dây thanh. Ở cuối từ (\"dark L\"), cuống lưỡi nâng lên, nghe hơi giống \"âu/ô\".",
    viLike: "Như \"l\" tiếng Việt ở đầu từ.",
    tip: "Đừng bỏ /l/ cuối (feel → \"phi\") và đừng đọc /l/ thành /n/.",
    examples: [ex("light", "/laɪt/", "ánh sáng"), ex("hello", "/həˈləʊ/", "xin chào"), ex("feel", "/fiːl/", "cảm thấy")],
    pair: { with: "r", a: ex("light", "/laɪt/", "ánh sáng"), b: ex("right", "/raɪt/", "đúng, bên phải") },
  },
  {
    id: "r", symbol: "r", group: "voiced",
    guide: "Cong đầu lưỡi lên về phía vòm miệng nhưng KHÔNG chạm, môi hơi tròn, rung dây thanh. Không rung lưỡi.",
    viLike: "Khác \"r\" tiếng Việt (không rung lưỡi, không bật).",
    us: "Giọng Anh không đọc r khi sau nó không có nguyên âm (car /kɑː/); giọng Mỹ đọc rõ (car /kɑːr/).",
    examples: [ex("red", "/red/", "màu đỏ"), ex("sorry", "/ˈsɒri/", "xin lỗi"), ex("very", "/ˈveri/", "rất")],
    pair: { with: "l", a: ex("right", "/raɪt/", "đúng, bên phải"), b: ex("light", "/laɪt/", "ánh sáng") },
  },
  {
    id: "w", symbol: "w", group: "voiced",
    guide: "Chu tròn môi như đọc \"u\" rồi mở nhanh sang nguyên âm phía sau. Rung dây thanh, răng không chạm môi.",
    viLike: "Gần \"qu\" / \"oa\" (như \"oa\" trong \"hoa\").",
    tip: "Đừng đọc /w/ thành /v/: wine ≠ vine. Răng không được chạm môi.",
    examples: [ex("we", "/wiː/", "chúng tôi"), ex("water", "/ˈwɔːtə/", "nước"), ex("quick", "/kwɪk/", "nhanh")],
    pair: { with: "v", a: ex("wine", "/waɪn/", "rượu vang"), b: ex("vine", "/vaɪn/", "cây nho") },
  },
  {
    id: "j", symbol: "j", group: "voiced",
    guide: "Mặt lưỡi nâng gần vòm cứng (như đọc /iː/) rồi trượt nhanh sang nguyên âm phía sau. Rung dây thanh.",
    viLike: "Gần \"d\" giọng miền Nam / \"i\" lướt (như \"ia\" đọc nhanh).",
    tip: "Ký hiệu /j/ KHÔNG đọc là \"giây\": yes /jes/ ≈ \"iés\".",
    examples: [ex("yes", "/jes/", "vâng"), ex("you", "/juː/", "bạn"), ex("music", "/ˈmjuːzɪk/", "âm nhạc")],
  },
];

export const IPA_MAP: Record<string, IpaSound> = Object.fromEntries(IPA_SOUNDS.map((s) => [s.id, s]));

/** Bố cục bảng (theo hàng) — giống bảng phiên âm treo tường quen thuộc. */
export const IPA_CHART = {
  monophthongs: [
    ["i-long", "i-short", "u-short", "u-long"],
    ["e", "schwa", "er-long", "or-long"],
    ["ae", "uh", "a-long", "o-short"],
  ],
  diphthongs: [
    ["ia", "ei"],
    ["ua", "oi", "ou"],
    ["ea", "ai", "au"],
  ],
  consonants: [
    ["p", "b", "t", "d", "ch", "dj", "k", "g"],
    ["f", "v", "th-voiceless", "th-voiced", "s", "z", "sh", "zh"],
    ["m", "n", "ng", "h", "l", "r", "w", "j"],
  ],
};

/* ---------------- Hướng dẫn đọc phiên âm ---------------- */

export interface ReadingRule {
  title: string;
  text: string;
  examples?: IpaExample[];
}

export const READING_RULES: ReadingRule[] = [
  {
    title: "Dấu trọng âm ˈ và ˌ",
    text: "Dấu ˈ đặt TRƯỚC âm tiết được nhấn mạnh nhất; dấu ˌ là trọng âm phụ. Âm tiết nhấn đọc to, dài và cao hơn; các âm tiết khác đọc nhẹ (thường là /ə/).",
    examples: [ex("about", "/əˈbaʊt/", "a-BOUT"), ex("teacher", "/ˈtiːtʃə/", "TEA-cher"), ex("information", "/ˌɪnfəˈmeɪʃn/", "in-for-MA-tion")],
  },
  {
    title: "Dấu ː — âm dài",
    text: "Dấu hai chấm sau nguyên âm nghĩa là đọc KÉO DÀI. Độ dài làm thay đổi nghĩa của từ.",
    examples: [ex("sheep", "/ʃiːp/", "con cừu"), ex("ship", "/ʃɪp/", "con tàu")],
  },
  {
    title: "Luôn đọc âm cuối",
    text: "Tiếng Việt không bật âm cuối nên người Việt hay \"nuốt\" âm cuối tiếng Anh. Âm cuối thường mang nghĩa ngữ pháp: -s (số nhiều, ngôi 3), -ed (quá khứ).",
    examples: [ex("like", "/laɪk/", "thích"), ex("likes", "/laɪks/", "thích (ngôi 3)"), ex("liked", "/laɪkt/", "đã thích")],
  },
  {
    title: "Không chèn \"ơ\" vào cụm phụ âm",
    text: "Các cụm phụ âm như /st/, /pl/, /tr/, /sk/ phải đọc liền, không chèn nguyên âm: school ≠ \"sờ-cun\", play ≠ \"pờ-lây\".",
    examples: [ex("school", "/skuːl/", "trường học"), ex("street", "/striːt/", "con phố"), ex("play", "/pleɪ/", "chơi")],
  },
  {
    title: "Phân biệt vô thanh và hữu thanh",
    text: "Đặt tay lên cổ họng: âm hữu thanh làm cổ RUNG (/v/, /z/, /b/...), âm vô thanh thì không (/f/, /s/, /p/...). Phần lớn phụ âm đi theo cặp vô thanh – hữu thanh.",
  },
];

export const ENDING_RULES = {
  s: {
    title: "Cách đọc đuôi -s / -es",
    rows: [
      ["/s/", "sau âm vô thanh /p/, /t/, /k/, /f/, /θ/", "stops /stɒps/, cats /kæts/, books /bʊks/"],
      ["/ɪz/", "sau /s/, /z/, /ʃ/, /ʒ/, /tʃ/, /dʒ/", "buses /ˈbʌsɪz/, watches /ˈwɒtʃɪz/, pages /ˈpeɪdʒɪz/"],
      ["/z/", "các trường hợp còn lại (nguyên âm, âm hữu thanh)", "plays /pleɪz/, dogs /dɒɡz/, loves /lʌvz/"],
    ],
  },
  ed: {
    title: "Cách đọc đuôi -ed",
    rows: [
      ["/ɪd/", "sau /t/, /d/", "wanted /ˈwɒntɪd/, needed /ˈniːdɪd/"],
      ["/t/", "sau âm vô thanh /p/, /k/, /f/, /s/, /ʃ/, /tʃ/, /θ/", "stopped /stɒpt/, worked /wɜːkt/, watched /wɒtʃt/"],
      ["/d/", "các trường hợp còn lại (nguyên âm, âm hữu thanh)", "played /pleɪd/, lived /lɪvd/, cleaned /kliːnd/"],
    ],
  },
};
