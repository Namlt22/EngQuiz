import type { TopicContent } from "../types";

/**
 * B2 — đợt 2: mệnh đề quan hệ không xác định & rút gọn, suy đoán quá khứ, should have / could have / needn't have,
 * used to / be used to / get used to, would rather / it's time / had better, liên từ tương phản, mệnh đề phân từ.
 */

const nonDefiningRelative: TopicContent = {
  slug: "non-defining-relative",
  intro: "My brother, who lives in Hue, is a doctor — thêm thông tin phụ, có dấu phẩy.",
  theory: [
    { type: "summary", text: "Mệnh đề quan hệ không xác định cho thêm thông tin PHỤ về một người/vật đã rõ là ai, cái gì. Bỏ mệnh đề đi câu vẫn đủ nghĩa. Luôn đặt giữa hai dấu phẩy (hoặc dấu phẩy và dấu chấm), KHÔNG dùng that và KHÔNG được bỏ đại từ quan hệ." },
    {
      type: "compare",
      title: "Xác định vs không xác định",
      headers: ["", "Xác định", "Không xác định"],
      rows: [
        ["Chức năng", "Cho biết là ai/cái nào", "Thêm thông tin phụ"],
        ["Dấu phẩy", "Không", "Có"],
        ["Dùng that", "Được", "KHÔNG"],
        ["Bỏ đại từ (tân ngữ)", "Được", "KHÔNG"],
        ["Ví dụ", "The man who called you is my boss.", "Mr Lam, who called you, is my boss."],
      ],
    },
    {
      type: "usage",
      title: "Các đại từ dùng được",
      examples: [
        { en: "Da Lat, which is in the Central Highlands, is famous for flowers.", vi: "Đà Lạt, nằm ở Tây Nguyên, nổi tiếng về hoa." },
        { en: "My grandmother, whose house is by the sea, loves fishing.", vi: "Bà tôi, người có nhà ở cạnh biển, rất thích câu cá." },
        { en: "He passed the exam, which surprised everyone.", vi: "Anh ấy đỗ kỳ thi, điều này làm mọi người ngạc nhiên. (which thay cho cả mệnh đề)" },
        { en: "I met Lan in 2019, when I was working in Hanoi.", vi: "Tôi gặp Lan năm 2019, khi tôi đang làm việc ở Hà Nội." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "My father, that is a teacher, works hard.", right: "My father, who is a teacher, works hard.", why: "Mệnh đề không xác định không dùng that." },
        { wrong: "Hanoi which is the capital is very busy.", right: "Hanoi, which is the capital, is very busy.", why: "Thông tin phụ về danh từ riêng → cần dấu phẩy." },
        { wrong: "He failed, that made him sad.", right: "He failed, which made him sad.", why: "Thay cho cả mệnh đề trước dùng which." },
      ],
    },
  ],
  questions: [
    { id: "ndr1", type: "mcq", prompt: "My sister, ___ works in Da Nang, is visiting us.", options: ["that", "who", "which", "whom"], answer: 1, explanation: "Người + mệnh đề không xác định → who (không dùng that)." },
    { id: "ndr2", type: "mcq", prompt: "Hue, ___ is in central Vietnam, was once the capital.", options: ["that", "where", "which", "who"], answer: 2, explanation: "Vật/nơi chốn làm chủ ngữ trong mệnh đề → which." },
    { id: "ndr3", type: "mcq", prompt: "He didn't call me back, ___ was really annoying.", options: ["that", "what", "which", "it"], answer: 2, explanation: "which thay cho cả mệnh đề trước." },
    { id: "ndr4", type: "gap_fill", prompt: "My neighbour, ___ dog barks all night, never apologises.", answers: ["whose"], explanation: "Sở hữu (con chó CỦA người hàng xóm) → whose." },
    { id: "ndr5", type: "mcq", prompt: "Which sentence is correct?", options: ["My car, that is red, is old.", "My car, which is red, is old.", "My car which is red, is old.", "My car, is red, is old."], answer: 1, explanation: "Không xác định: dấu phẩy hai bên + which." },
    { id: "ndr6", type: "gap_fill", prompt: "We stayed at the Rex Hotel, ___ we had a great view of the city.", answers: ["where"], explanation: "Nơi chốn + mệnh đề đầy đủ (we had …) → where." },
    {
      id: "ndr7", type: "error_id",
      segments: [{ text: "Mr Binh, " }, { text: "that", underline: true }, { text: " teaches us maths, " }, { text: "is", underline: true }, { text: " very " }, { text: "patient", underline: true }, { text: "." }],
      answer: 1, correction: "who",
      explanation: "Mệnh đề không xác định không dùng that → who.",
    },
    { id: "ndr8", type: "transform", prompt: "Ha Long Bay is a World Heritage Site. It attracts millions of tourists.", starter: "Ha Long Bay, which", answers: ["Ha Long Bay, which is a World Heritage Site, attracts millions of tourists.", "Ha Long Bay, which attracts millions of tourists, is a World Heritage Site."], explanation: "Đưa một câu vào làm thông tin phụ, có dấu phẩy hai bên." },
    { id: "ndr9", type: "mcq", prompt: "I spoke to the manager, ___ I had met before.", options: ["who", "whom", "which", "Both A and B"], answer: 3, explanation: "Tân ngữ chỉ người: whom (trang trọng) hoặc who đều đúng; không được bỏ đại từ." },
  ],
};

const reducedRelative: TopicContent = {
  slug: "reduced-relative",
  intro: "The man standing there · a book written in 1990 · the first person to arrive — rút gọn mệnh đề quan hệ.",
  theory: [
    { type: "summary", text: "Khi đại từ quan hệ là CHỦ NGỮ của mệnh đề, có thể rút gọn: bỏ who/which/that (và be), động từ đổi thành V-ing (nghĩa chủ động), V3 (nghĩa bị động) hoặc to V (sau the first / the last / the only / so sánh nhất)." },
    {
      type: "formula",
      title: "Ba cách rút gọn",
      rows: [
        { label: "Chủ động → V-ing", parts: [{ t: "N", role: "subject" }, { t: "(who is) V-ing", role: "verb" }], example: "The girl (who is) sitting next to me is my cousin." },
        { label: "Bị động → V3", parts: [{ t: "N", role: "subject" }, { t: "(which was) V3", role: "verb" }], example: "The bridge (which was) built in 1902 is still in use." },
        { label: "the first / only … → to V", parts: [{ t: "the first / last / only + N", role: "subject" }, { t: "to V", role: "verb" }], example: "She was the first woman to win the prize." },
      ],
    },
    {
      type: "usage",
      title: "Ví dụ",
      examples: [
        { en: "Anyone wanting to join should sign here.", vi: "Ai muốn tham gia thì ký ở đây. (= who wants)" },
        { en: "Most of the goods sold here are made locally.", vi: "Phần lớn hàng bán ở đây được sản xuất tại địa phương. (= which are sold)" },
        { en: "He is the only person to have climbed it twice.", vi: "Anh ấy là người duy nhất đã leo lên đó hai lần." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The letter writing in English was hard to read.", right: "The letter written in English was hard to read.", why: "Lá thư ĐƯỢC viết → nghĩa bị động → V3." },
        { wrong: "The people live next door are friendly.", right: "The people living next door are friendly.", why: "Bỏ who thì động từ phải đổi sang V-ing." },
      ],
    },
    { type: "tip", text: "Tự hỏi: danh từ TỰ làm hành động (→ V-ing) hay BỊ / ĐƯỢC làm (→ V3)?" },
  ],
  questions: [
    { id: "rdr1", type: "mcq", prompt: "The woman ___ to the manager is my aunt.", options: ["talks", "talking", "talked", "to talk"], answer: 1, explanation: "Chủ động, đang nói → talking (= who is talking)." },
    { id: "rdr2", type: "mcq", prompt: "The products ___ in this factory are exported to Japan.", options: ["making", "made", "make", "to make"], answer: 1, explanation: "Sản phẩm ĐƯỢC làm → made." },
    { id: "rdr3", type: "mcq", prompt: "Neil Armstrong was the first man ___ on the moon.", options: ["walking", "walked", "to walk", "walk"], answer: 2, explanation: "the first … → to V." },
    { id: "rdr4", type: "verb_form", prompt: "Children ___ under five travel free.", base: "age", answers: ["aged"], explanation: "Cụm cố định: children aged under five (= who are aged)." },
    { id: "rdr5", type: "verb_form", prompt: "Passengers ___ for flight VN123 should go to gate 5.", base: "wait", answers: ["waiting"], explanation: "Hành khách đang chờ → waiting." },
    { id: "rdr6", type: "gap_fill", prompt: "The novel, first ___ in 1936, is still popular.", answers: ["published"], explanation: "Cuốn tiểu thuyết được xuất bản → published." },
    {
      id: "rdr7", type: "error_id",
      segments: [{ text: "The documents " }, { text: "sending", underline: true }, { text: " yesterday " }, { text: "have", underline: true }, { text: " not " }, { text: "arrived", underline: true }, { text: "." }],
      answer: 1, correction: "sent",
      explanation: "Giấy tờ ĐƯỢC gửi → sent.",
    },
    { id: "rdr8", type: "transform", prompt: "The man who is wearing a red shirt is our guide.", starter: "The man", answers: ["The man wearing a red shirt is our guide."], explanation: "Bỏ who is, giữ V-ing." },
    { id: "rdr9", type: "transform", prompt: "The houses which were damaged by the storm will be rebuilt.", starter: "The houses", answers: ["The houses damaged by the storm will be rebuilt."], explanation: "Bỏ which were, giữ V3." },
  ],
};

const modalsDeductionPast: TopicContent = {
  slug: "modals-deduction-past",
  intro: "She must have forgotten · He can't have seen it — đoán về chuyện đã xảy ra.",
  theory: [
    { type: "summary", text: "Suy đoán về QUÁ KHỨ dùng modal + have + V3. Mức chắc chắn: must have (gần như chắc chắn là có) — might / may / could have (có thể) — can't / couldn't have (gần như chắc chắn là không)." },
    {
      type: "table",
      title: "Mức độ chắc chắn",
      headers: ["Modal", "Nghĩa", "Ví dụ"],
      rows: [
        ["must have V3", "chắc hẳn đã (~95%)", "The road is wet. It must have rained."],
        ["might / may / could have V3", "có lẽ đã (~50%)", "She might have missed the bus."],
        ["can't / couldn't have V3", "không thể nào đã (~5%)", "He can't have finished already — he only started at nine."],
      ],
    },
    {
      type: "usage",
      title: "So với hiện tại",
      examples: [
        { en: "He must be tired. (bây giờ) → He must have been tired. (lúc trước)", vi: "Chắc giờ anh ấy mệt → Chắc lúc đó anh ấy mệt." },
        { en: "They might have been sleeping when you called.", vi: "Có lẽ lúc bạn gọi họ đang ngủ. (have been V-ing: đang diễn ra lúc đó)" },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She mustn't have seen me.", right: "She can't have seen me.", why: "Phủ định của suy đoán chắc chắn dùng can't have, không dùng mustn't have." },
        { wrong: "He must have went home.", right: "He must have gone home.", why: "Sau have là V3: gone." },
        { wrong: "I must have leave my keys at work.", right: "I must have left my keys at work.", why: "Sau have là V3." },
      ],
    },
  ],
  questions: [
    { id: "mdpp1", type: "mcq", prompt: "The lights are off. They ___ to bed.", options: ["must go", "must have gone", "can't have gone", "should go"], answer: 1, explanation: "Gần như chắc chắn đã đi ngủ → must have gone." },
    { id: "mdpp2", type: "mcq", prompt: "She ___ the email — she replied to it an hour ago!", options: ["can't have read", "must have read", "might not read", "mustn't have read"], answer: 1, explanation: "Đã trả lời → chắc chắn đã đọc → must have read." },
    { id: "mdpp3", type: "mcq", prompt: "He ___ the thief. He was in Hanoi that night.", options: ["must have been", "can't have been", "might have been", "should have been"], answer: 1, explanation: "Có bằng chứng ngược lại → can't have been." },
    { id: "mdpp4", type: "verb_form", prompt: "I'm not sure where Nam is. He ___ the bus.", base: "miss", answers: ["might have missed", "may have missed", "could have missed"], explanation: "Không chắc → might / may / could have missed." },
    { id: "mdpp5", type: "gap_fill", prompt: "You must have ___ very worried when she didn't come home.", answers: ["been"], explanation: "must have been + tính từ." },
    {
      id: "mdpp6", type: "error_id",
      segments: [{ text: "She " }, { text: "mustn't have", underline: true }, { text: " " }, { text: "heard", underline: true }, { text: " the " }, { text: "phone", underline: true }, { text: "." }],
      answer: 1, correction: "can't have",
      explanation: "Suy đoán phủ định chắc chắn → can't have.",
    },
    { id: "mdpp7", type: "transform", prompt: "I'm sure she forgot about the meeting.", starter: "She must", answers: ["She must have forgotten about the meeting."], explanation: "I'm sure + quá khứ → must have + V3." },
    { id: "mdpp8", type: "transform", prompt: "It's impossible that he wrote this — he can't speak French.", starter: "He can't", answers: ["He can't have written this — he can't speak French.", "He can't have written this.", "He can't have written this, he can't speak French."], explanation: "impossible + quá khứ → can't have + V3." },
    { id: "mdpp9", type: "mcq", prompt: "They ___ when you called. They usually go to bed early.", options: ["must sleep", "might have been sleeping", "can't sleep", "should have slept"], answer: 1, explanation: "Đang diễn ra lúc đó, không chắc → might have been sleeping." },
  ],
};

const shouldHave: TopicContent = {
  slug: "should-have",
  intro: "I should have listened · You needn't have bought it — tiếc nuối, trách, việc không cần thiết đã làm.",
  theory: [
    { type: "summary", text: "should have V3: lẽ ra nên làm (nhưng đã không làm) — tiếc nuối hoặc trách. shouldn't have V3: lẽ ra không nên làm (nhưng đã làm). could have V3: lẽ ra đã có thể (nhưng đã không). needn't have V3: đã làm một việc không cần thiết." },
    {
      type: "compare",
      title: "So sánh",
      headers: ["Mẫu", "Thực tế đã xảy ra", "Ví dụ"],
      rows: [
        ["should have V3", "đã KHÔNG làm", "I should have studied harder."],
        ["shouldn't have V3", "đã làm", "You shouldn't have told her."],
        ["could have V3", "có khả năng nhưng đã không làm", "We could have taken a taxi."],
        ["needn't have V3", "đã làm, nhưng thừa", "You needn't have cooked — we've already eaten."],
        ["didn't need to V", "đã không làm vì không cần", "I didn't need to cook, so I watched TV."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I should studied more.", right: "I should have studied more.", why: "Nói về quá khứ: should HAVE + V3." },
        { wrong: "You needn't to have come.", right: "You needn't have come.", why: "needn't là modal, không có to." },
      ],
    },
    { type: "tip", text: "should've, could've đọc lướt thành /ˈʃʊdəv/, /ˈkʊdəv/ — viết không bao giờ là \"should of\"." },
  ],
  questions: [
    { id: "shh1", type: "mcq", prompt: "I failed the test. I ___ more.", options: ["should study", "should have studied", "must have studied", "needn't have studied"], answer: 1, explanation: "Tiếc vì đã không học → should have studied." },
    { id: "shh2", type: "mcq", prompt: "You ___ him the secret. Now everyone knows!", options: ["should have told", "shouldn't have told", "needn't tell", "couldn't tell"], answer: 1, explanation: "Đã kể, và đó là sai → shouldn't have told." },
    { id: "shh3", type: "mcq", prompt: "You ___ a present — but thank you, it's lovely!", options: ["needn't have bought", "shouldn't buy", "didn't need buying", "mustn't have bought"], answer: 0, explanation: "Đã mua dù không cần → needn't have bought." },
    { id: "shh4", type: "verb_form", prompt: "We ___ a taxi, but we decided to walk.", base: "take", answers: ["could have taken"], explanation: "Đã có thể nhưng không làm → could have taken." },
    { id: "shh5", type: "gap_fill", prompt: "She should ___ left earlier — she missed the train.", answers: ["have"], explanation: "should have + V3." },
    {
      id: "shh6", type: "error_id",
      segments: [{ text: "You " }, { text: "should of", underline: true }, { text: " " }, { text: "asked", underline: true }, { text: " me " }, { text: "first", underline: true }, { text: "." }],
      answer: 1, correction: "should have",
      explanation: "Viết đúng là should have (should've), không phải should of.",
    },
    { id: "shh7", type: "transform", prompt: "It was a mistake to eat so much.", starter: "I shouldn't", answers: ["I shouldn't have eaten so much.", "I should not have eaten so much."], explanation: "Đã làm và tiếc → shouldn't have + V3." },
    { id: "shh8", type: "mcq", prompt: "I ___ go to work yesterday, so I stayed in bed.", options: ["needn't have", "didn't need to", "shouldn't have", "couldn't have"], answer: 1, explanation: "Không đi vì không cần → didn't need to." },
    { id: "shh9", type: "verb_form", prompt: "You ___ me! I was worried all night.", base: "call", answers: ["should have called", "should've called"], explanation: "Trách việc đã không gọi → should have called." },
  ],
};

const usedToBeUsedTo: TopicContent = {
  slug: "used-to-be-used-to",
  intro: "I used to smoke · I'm used to getting up early · I'm getting used to the weather.",
  theory: [
    { type: "summary", text: "Ba cấu trúc giống nhau về hình thức nhưng khác hẳn nghĩa. used to + V: thói quen / tình trạng trong quá khứ, nay không còn. be used to + V-ing / N: đã QUEN với việc gì. get used to + V-ing / N: dần trở nên quen." },
    {
      type: "compare",
      title: "Phân biệt",
      headers: ["Cấu trúc", "Nghĩa", "Ví dụ"],
      rows: [
        ["used to + V", "đã từng (nay không còn)", "I used to live in Hue."],
        ["be used to + V-ing / N", "đã quen với", "I'm used to living alone."],
        ["get used to + V-ing / N", "dần quen với", "You'll get used to the noise."],
      ],
    },
    {
      type: "usage",
      title: "Lưu ý",
      examples: [
        { en: "Did you use to play football? — No, I didn't use to.", vi: "Hồi trước bạn có hay đá bóng không? (câu hỏi và phủ định: use to, không có d)" },
        { en: "She wasn't used to driving on the left.", vi: "Cô ấy không quen lái xe bên trái." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I'm used to get up at five.", right: "I'm used to getting up at five.", why: "be used to + V-ing (to ở đây là giới từ)." },
        { wrong: "I use to play the guitar when I was young.", right: "I used to play the guitar when I was young.", why: "Thói quen quá khứ → used to." },
        { wrong: "Did you used to live here?", right: "Did you use to live here?", why: "Sau did dùng use to." },
      ],
    },
  ],
  questions: [
    { id: "ubu1", type: "mcq", prompt: "I ___ coffee, but now I only drink tea.", options: ["am used to drink", "used to drink", "get used to drinking", "use to drinking"], answer: 1, explanation: "Thói quen quá khứ, nay không còn → used to drink." },
    { id: "ubu2", type: "mcq", prompt: "After ten years in Hanoi, she's used to ___ on motorbikes.", options: ["ride", "riding", "rode", "be riding"], answer: 1, explanation: "be used to + V-ing." },
    { id: "ubu3", type: "mcq", prompt: "Don't worry, you'll soon ___ the hot weather.", options: ["used to", "get used to", "be use to", "use to"], answer: 1, explanation: "Dần dần quen → get used to." },
    { id: "ubu4", type: "verb_form", prompt: "I'm not used to ___ so early.", base: "wake up", answers: ["waking up"], explanation: "be used to + V-ing." },
    { id: "ubu5", type: "gap_fill", prompt: "Did you ___ to have long hair?", answers: ["use"], explanation: "Sau did → use to." },
    {
      id: "ubu6", type: "error_id",
      segments: [{ text: "It took me a long time " }, { text: "to get", underline: true }, { text: " used to " }, { text: "drive", underline: true }, { text: " on the " }, { text: "left", underline: true }, { text: "." }],
      answer: 3, correction: "driving",
      explanation: "get used to + V-ing → driving.",
    },
    { id: "ubu7", type: "transform", prompt: "Living in a big city is normal for me now.", starter: "I'm used", answers: ["I'm used to living in a big city.", "I'm used to living in a big city now.", "I am used to living in a big city."], explanation: "Đã quen → be used to + V-ing." },
    { id: "ubu8", type: "transform", prompt: "When I was a child, I often climbed trees.", starter: "I used", answers: ["I used to climb trees.", "I used to climb trees when I was a child."], explanation: "Thói quen quá khứ → used to + V." },
    { id: "ubu9", type: "mcq", prompt: "There ___ a cinema here, but it closed years ago.", options: ["is used to be", "used to be", "was used to", "gets used to be"], answer: 1, explanation: "Tình trạng quá khứ → There used to be." },
  ],
};

const wouldRather: TopicContent = {
  slug: "would-rather",
  intro: "I'd rather stay home · It's time we left · You'd better hurry.",
  theory: [
    { type: "summary", text: "would rather + V: thích … hơn (cho chính mình). would rather + S + V2: muốn NGƯỜI KHÁC làm gì (lùi thì dù nói về hiện tại). It's (high) time + S + V2: đã đến lúc phải làm (đáng lẽ làm rồi). had better + V: nên làm (nếu không sẽ có hậu quả) — mạnh hơn should." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Bản thân thích hơn", parts: [{ t: "S + would rather", role: "subject" }, { t: "V (than V)", role: "verb" }], example: "I'd rather walk than take the bus." },
        { label: "Muốn người khác", parts: [{ t: "S + would rather", role: "subject" }, { t: "S2 + V2", role: "verb" }], example: "I'd rather you didn't smoke here." },
        { label: "Đã đến lúc", parts: [{ t: "It's (high) time", role: "subject" }, { t: "S + V2", role: "verb" }], example: "It's time we went home." },
        { label: "Nên (cảnh báo)", parts: [{ t: "S + had better ('d better)", role: "aux" }, { t: "(not) V", role: "verb" }], example: "You'd better not be late." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I'd rather to stay at home.", right: "I'd rather stay at home.", why: "would rather + V nguyên mẫu, không có to." },
        { wrong: "I'd rather you don't tell anyone.", right: "I'd rather you didn't tell anyone.", why: "Muốn người khác làm → động từ lùi về quá khứ." },
        { wrong: "You had better to go now.", right: "You had better go now.", why: "had better + V nguyên mẫu." },
        { wrong: "You'd better don't call him.", right: "You'd better not call him.", why: "Phủ định: had better not + V." },
      ],
    },
    { type: "tip", text: "'d trong I'd rather = would, nhưng trong You'd better = had." },
  ],
  questions: [
    { id: "wrt1", type: "mcq", prompt: "I'd rather ___ at home tonight.", options: ["to stay", "stay", "staying", "stayed"], answer: 1, explanation: "would rather + V nguyên mẫu." },
    { id: "wrt2", type: "mcq", prompt: "I'd rather you ___ my phone without asking.", options: ["don't use", "didn't use", "not use", "won't use"], answer: 1, explanation: "Muốn người khác → quá khứ: didn't use." },
    { id: "wrt3", type: "mcq", prompt: "It's late. It's time we ___ home.", options: ["go", "went", "going", "will go"], answer: 1, explanation: "It's time + S + V2 → went." },
    { id: "wrt4", type: "mcq", prompt: "You ___ take an umbrella. It's going to rain.", options: ["would rather", "had better", "would better", "had rather"], answer: 1, explanation: "Lời khuyên có ý cảnh báo → had better." },
    { id: "wrt5", type: "gap_fill", prompt: "You'd better ___ tell her — she'll be angry.", answers: ["not"], explanation: "Phủ định: had better not + V." },
    { id: "wrt6", type: "verb_form", prompt: "I'd rather walk than ___ a taxi.", base: "take", answers: ["take"], explanation: "would rather V than V." },
    {
      id: "wrt7", type: "error_id",
      segments: [{ text: "It's high time you " }, { text: "start", underline: true }, { text: " " }, { text: "looking", underline: true }, { text: " for a " }, { text: "job", underline: true }, { text: "." }],
      answer: 1, correction: "started",
      explanation: "It's high time + S + V2 → started.",
    },
    { id: "wrt8", type: "transform", prompt: "I prefer tea to coffee.", starter: "I'd rather", answers: ["I'd rather drink tea than coffee.", "I'd rather have tea than coffee.", "I would rather drink tea than coffee.", "I'd rather drink tea than drink coffee."], explanation: "would rather + V + than …" },
    { id: "wrt9", type: "transform", prompt: "Please don't tell anyone about this.", starter: "I'd rather you", answers: ["I'd rather you didn't tell anyone about this.", "I would rather you didn't tell anyone about this."], explanation: "would rather + you + V2 (didn't tell)." },
  ],
};

const contrastLinkers: TopicContent = {
  slug: "contrast-linkers",
  intro: "although / even though / despite / in spite of / whereas / however — nói sự tương phản.",
  theory: [
    { type: "summary", text: "Chọn liên từ theo LOẠI TỪ đi sau: although / even though / though + MỆNH ĐỀ (S + V); despite / in spite of + DANH TỪ hoặc V-ing; however / nevertheless đứng đầu câu thứ hai, sau đó có dấu phẩy; whereas / while so sánh hai sự việc trái ngược." },
    {
      type: "table",
      title: "Theo sau là gì?",
      headers: ["Liên từ", "Theo sau", "Ví dụ"],
      rows: [
        ["although / even though", "S + V", "Although it was raining, we went out."],
        ["despite / in spite of", "N / V-ing / the fact that", "Despite the rain, we went out."],
        ["however / nevertheless", "Câu mới, sau dấu chấm hoặc chấm phẩy", "It was raining. However, we went out."],
        ["whereas / while", "S + V (so sánh)", "My brother is tall, whereas I am short."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Despite it was cold, she swam.", right: "Although it was cold, she swam. / Despite the cold, she swam.", why: "despite + danh từ, không + mệnh đề." },
        { wrong: "Although he was tired, but he kept working.", right: "Although he was tired, he kept working.", why: "Không dùng although và but trong cùng một câu." },
        { wrong: "In spite of to be ill, he came.", right: "In spite of being ill, he came.", why: "in spite of + V-ing." },
      ],
    },
    { type: "tip", text: "Muốn dùng despite với mệnh đề: despite the fact that + S + V." },
  ],
  questions: [
    { id: "ctl1", type: "mcq", prompt: "___ the heavy traffic, we arrived on time.", options: ["Although", "Despite", "However", "Even though"], answer: 1, explanation: "Sau là cụm danh từ → Despite." },
    { id: "ctl2", type: "mcq", prompt: "___ she studied hard, she failed the exam.", options: ["Despite", "In spite of", "Although", "However"], answer: 2, explanation: "Sau là mệnh đề → Although." },
    { id: "ctl3", type: "mcq", prompt: "The hotel was expensive. ___, the service was poor.", options: ["Although", "Despite", "However", "Whereas"], answer: 2, explanation: "Đầu câu thứ hai + dấu phẩy → However." },
    { id: "ctl4", type: "mcq", prompt: "I like spicy food, ___ my wife hates it.", options: ["despite", "whereas", "in spite of", "however"], answer: 1, explanation: "So sánh hai điều trái ngược → whereas." },
    { id: "ctl5", type: "verb_form", prompt: "In spite of ___ ill, she went to work.", base: "be", answers: ["being"], explanation: "in spite of + V-ing." },
    { id: "ctl6", type: "gap_fill", prompt: "Despite the fact ___ it was late, they kept talking.", answers: ["that"], explanation: "despite the fact that + mệnh đề." },
    {
      id: "ctl7", type: "error_id",
      segments: [{ text: "Although he " }, { text: "was", underline: true }, { text: " rich, " }, { text: "but", underline: true }, { text: " he " }, { text: "wasn't", underline: true }, { text: " happy." }],
      answer: 3, correction: "(bỏ but)",
      explanation: "Although đã nối hai vế, không dùng thêm but.",
    },
    { id: "ctl8", type: "transform", prompt: "Although it was raining, the match continued.", starter: "Despite", answers: ["Despite the rain, the match continued.", "Despite the rain the match continued.", "Despite it raining, the match continued.", "Despite the fact that it was raining, the match continued."], explanation: "Despite + danh từ (the rain) hoặc the fact that …" },
    { id: "ctl9", type: "mcq", prompt: "___ being tired, he stayed up to finish the project.", options: ["Although", "In spite of", "However", "Even though"], answer: 1, explanation: "Sau là V-ing → In spite of." },
  ],
};

const participleClauses: TopicContent = {
  slug: "participle-clauses",
  intro: "Feeling tired, I went to bed · Built in 1900, the house … · Having finished, she left.",
  theory: [
    { type: "summary", text: "Mệnh đề phân từ rút gọn một mệnh đề phụ (vì, khi, sau khi…) khi HAI VẾ CÙNG CHỦ NGỮ. V-ing: chủ động, cùng lúc. V3: bị động. Having + V3: chủ động, xảy ra TRƯỚC hành động chính. Thường gặp trong văn viết." },
    {
      type: "formula",
      title: "Ba dạng",
      rows: [
        { label: "Chủ động, cùng lúc", parts: [{ t: "V-ing …", role: "verb" }, { t: ", S + V", role: "subject" }], example: "Walking home, I saw an old friend. (= While I was walking)" },
        { label: "Bị động", parts: [{ t: "V3 …", role: "verb" }, { t: ", S + V", role: "subject" }], example: "Written in simple English, the book is easy to read." },
        { label: "Xảy ra trước", parts: [{ t: "Having V3 …", role: "verb" }, { t: ", S + V", role: "subject" }], example: "Having finished my homework, I watched TV." },
      ],
    },
    {
      type: "usage",
      title: "Mệnh đề gốc tương ứng",
      examples: [
        { en: "Not knowing what to do, she called her mother.", vi: "Vì không biết làm gì, cô ấy gọi cho mẹ. (= Because she didn't know)" },
        { en: "Seen from the air, the city looks like a map.", vi: "Nhìn từ trên cao, thành phố trông như tấm bản đồ. (= When it is seen)" },
        { en: "Having lived in Japan, he speaks Japanese well.", vi: "Vì đã sống ở Nhật, anh ấy nói tiếng Nhật tốt." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Walking to school, the rain started.", right: "Walking to school, I got caught in the rain.", why: "Chủ ngữ của vế chính phải là người làm hành động trong mệnh đề phân từ (dangling participle)." },
        { wrong: "Finishing the report, she sent it to her boss.", right: "Having finished the report, she sent it to her boss.", why: "Viết xong rồi MỚI gửi → Having + V3." },
      ],
    },
  ],
  questions: [
    { id: "ptc1", type: "mcq", prompt: "___ the news, she burst into tears.", options: ["Hear", "Hearing", "Heard", "To hear"], answer: 1, explanation: "Chủ động, xảy ra cùng lúc → Hearing." },
    { id: "ptc2", type: "mcq", prompt: "___ in 1890, the bridge is the oldest in the city.", options: ["Building", "Built", "Having built", "Build"], answer: 1, explanation: "Cây cầu ĐƯỢC xây → Built." },
    { id: "ptc3", type: "mcq", prompt: "___ all his money, he had to walk home.", options: ["Spending", "Spent", "Having spent", "To spend"], answer: 2, explanation: "Tiêu hết tiền TRƯỚC rồi mới phải đi bộ → Having spent." },
    { id: "ptc4", type: "verb_form", prompt: "Not ___ the answer, I kept quiet.", base: "know", answers: ["knowing"], explanation: "Phủ định: Not + V-ing." },
    { id: "ptc5", type: "gap_fill", prompt: "___ finished the exam, the students left the room.", answers: ["Having"], explanation: "Hành động trước → Having + V3." },
    {
      id: "ptc6", type: "error_id",
      segments: [{ text: "" }, { text: "Writing", underline: true }, { text: " in 1925, the novel " }, { text: "is", underline: true }, { text: " still " }, { text: "popular", underline: true }, { text: "." }],
      answer: 1, correction: "Written",
      explanation: "Cuốn tiểu thuyết ĐƯỢC viết → Written.",
    },
    { id: "ptc7", type: "transform", prompt: "Because I felt sick, I stayed at home.", starter: "Feeling", answers: ["Feeling sick, I stayed at home.", "Feeling sick I stayed at home."], explanation: "Cùng chủ ngữ I, chủ động → Feeling sick, …" },
    { id: "ptc8", type: "transform", prompt: "After she had read the letter, she tore it up.", starter: "Having", answers: ["Having read the letter, she tore it up."], explanation: "Đọc xong rồi mới xé → Having read …" },
    { id: "ptc9", type: "mcq", prompt: "Which sentence is correct?", options: ["Opening the door, the cat ran out.", "Opening the door, I saw the cat run out.", "Opened the door, I saw the cat.", "Having open the door, I saw the cat."], answer: 1, explanation: "Người mở cửa (I) phải là chủ ngữ vế chính." },
  ],
};

export const B2_CLAUSE_STRUCTURE_TOPICS: TopicContent[] = [
  nonDefiningRelative,
  reducedRelative,
  modalsDeductionPast,
  shouldHave,
  usedToBeUsedTo,
  wouldRather,
  contrastLinkers,
  participleClauses,
];
