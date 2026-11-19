import type { TopicContent } from "../types";

/** B1 — bị động các thì, suy đoán hiện tại, gerund / to V, too / enough, so / such, cụm động từ. */

const passiveOtherTenses: TopicContent = {
  slug: "passive-other-tenses",
  intro: "is being built, has been sold, will be finished — bị động ở các thì khác.",
  theory: [
    { type: "summary", text: "Câu bị động luôn có dạng be + V3. Muốn chia bị động ở thì nào, chỉ cần chia động từ BE ở thì đó, còn V3 giữ nguyên." },
    {
      type: "table",
      title: "Bị động theo thì",
      headers: ["Thì", "Chủ động", "Bị động"],
      rows: [
        ["Hiện tại tiếp diễn", "They are building a bridge.", "A bridge is being built."],
        ["Quá khứ tiếp diễn", "They were repairing the road.", "The road was being repaired."],
        ["Hiện tại hoàn thành", "Someone has stolen my bike.", "My bike has been stolen."],
        ["Quá khứ hoàn thành", "They had sold the tickets.", "The tickets had been sold."],
        ["Tương lai đơn", "We will finish the work.", "The work will be finished."],
        ["be going to", "They are going to open a shop.", "A shop is going to be opened."],
        ["Modal", "You must wear a helmet.", "A helmet must be worn."],
      ],
    },
    {
      type: "tip",
      text: "Mẹo: tìm thì của câu chủ động → viết BE đúng thì đó → thêm V3. Tiếp diễn thêm being, hoàn thành thêm been.",
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The house is building now.", right: "The house is being built now.", why: "Nhà không tự xây → bị động tiếp diễn: is being built." },
        { wrong: "My phone has been stole.", right: "My phone has been stolen.", why: "Sau been là V3: stolen." },
        { wrong: "The letter will sent tomorrow.", right: "The letter will be sent tomorrow.", why: "Tương lai bị động: will be + V3." },
      ],
    },
  ],
  questions: [
    { id: "pot1", type: "mcq", prompt: "A new hospital ___ in our town at the moment.", options: ["is building", "is being built", "has built", "builds"], answer: 1, explanation: "at the moment + bị động → is being built." },
    { id: "pot2", type: "verb_form", prompt: "My wallet ___! I can't find it anywhere.", base: "steal", answers: ["has been stolen", "'s been stolen"], explanation: "Kết quả hiện tại, bị động → has been stolen." },
    { id: "pot3", type: "verb_form", prompt: "The results ___ next week.", base: "announce", answers: ["will be announced"], explanation: "Tương lai bị động: will be announced." },
    { id: "pot4", type: "transform", prompt: "They are repairing my car.", starter: "My car", answers: ["My car is being repaired."], explanation: "Hiện tại tiếp diễn bị động: is being + V3." },
    { id: "pot5", type: "transform", prompt: "Someone has eaten all the cake.", starter: "All the cake", answers: ["All the cake has been eaten."], explanation: "HTHT bị động: has been + V3." },
    { id: "pot6", type: "gap_fill", prompt: "When we arrived, the food had already ___ served.", answers: ["been"], explanation: "Quá khứ hoàn thành bị động: had been served." },
    {
      id: "pot7", type: "error_id",
      segments: [{ text: "The road " }, { text: "was", underline: true }, { text: " " }, { text: "repairing", underline: true }, { text: " when I " }, { text: "drove", underline: true }, { text: " past." }],
      answer: 3, correction: "being repaired",
      explanation: "Con đường được sửa → bị động: was being repaired.",
    },
    { id: "pot8", type: "mcq", prompt: "Mobile phones must ___ off during the exam.", options: ["turn", "be turned", "turned", "be turning"], answer: 1, explanation: "Modal bị động: must be + V3." },
    { id: "pot9", type: "mcq", prompt: "This song ___ by millions of people since 2010.", options: ["has been downloaded", "has downloaded", "was downloading", "is downloaded"], answer: 0, explanation: "since → HTHT; bài hát được tải → has been downloaded." },
  ],
};

const modalsDeductionPresent: TopicContent = {
  slug: "modals-deduction-present",
  intro: "He must be tired / She might be at home / It can't be true — đoán chắc chắn tới đâu.",
  theory: [
    { type: "summary", text: "Dùng modal để suy đoán về hiện tại dựa trên bằng chứng. must = gần như chắc chắn ĐÚNG; might / may / could = có thể; can't = gần như chắc chắn KHÔNG ĐÚNG." },
    {
      type: "table",
      title: "Mức độ chắc chắn",
      headers: ["Modal", "Mức độ", "Ví dụ"],
      rows: [
        ["must + V", "~95% đúng", "The lights are on. They must be at home."],
        ["may / might / could + V", "~50%", "She isn't answering. She might be asleep."],
        ["can't / couldn't + V", "~95% sai", "He has just eaten. He can't be hungry."],
      ],
    },
    {
      type: "formula",
      title: "Với hành động đang diễn ra",
      rows: [{ label: "Tiếp diễn", parts: [{ t: "S", role: "subject" }, { t: "must / might / can't", role: "aux" }, { t: "be V-ing", role: "verb" }], example: "Listen! Someone must be playing the piano." }],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "He mustn't be at work — his car is here.", right: "He can't be at work — his car is here.", why: "Phủ định của suy đoán chắc chắn là can't, không phải mustn't (cấm)." },
        { wrong: "She must to be tired.", right: "She must be tired.", why: "Sau modal là V nguyên mẫu không to." },
      ],
    },
  ],
  questions: [
    { id: "mdp1", type: "mcq", prompt: "She has worked for twelve hours. She ___ exhausted.", options: ["must be", "can't be", "mustn't be", "should"], answer: 0, explanation: "Bằng chứng rõ → chắc chắn: must be." },
    { id: "mdp2", type: "mcq", prompt: "That ___ be Nam. He's in Japan this week.", options: ["must", "might", "can't", "should"], answer: 2, explanation: "Gần như chắc chắn không phải → can't." },
    { id: "mdp3", type: "mcq", prompt: "I'm not sure where Lan is. She ___ be in the library.", options: ["must", "might", "can't", "mustn't"], answer: 1, explanation: "Không chắc (~50%) → might." },
    { id: "mdp4", type: "gap_fill", prompt: "The phone is ringing. It ___ be my mother — she always calls at this time.", answers: ["must"], explanation: "Có căn cứ (luôn gọi giờ này) → must." },
    {
      id: "mdp5", type: "error_id",
      segments: [{ text: "He " }, { text: "mustn't", underline: true }, { text: " be rich — he " }, { text: "lives", underline: true }, { text: " in a " }, { text: "tiny", underline: true }, { text: " flat." }],
      answer: 1, correction: "can't",
      explanation: "Suy đoán phủ định → can't.",
    },
    { id: "mdp6", type: "mcq", prompt: "Listen! The baby ___ crying.", options: ["must be", "must", "can't", "might is"], answer: 0, explanation: "Suy đoán việc đang diễn ra → must be + V-ing." },
    { id: "mdp7", type: "transform", prompt: "I'm sure he is at home.", starter: "He must", answers: ["He must be at home."], explanation: "I'm sure → must be." },
    { id: "mdp8", type: "transform", prompt: "I'm sure that isn't true.", starter: "That can't", answers: ["That can't be true.", "That cannot be true."], explanation: "I'm sure ... isn't → can't be." },
  ],
};

const gerundInfinitive: TopicContent = {
  slug: "gerund-infinitive",
  intro: "enjoy doing, decide to do, stop doing vs stop to do.",
  theory: [
    { type: "summary", text: "Một số động từ đi với V-ing (gerund), một số đi với to V (to-infinitive), một số đi được cả hai nhưng NGHĨA KHÁC NHAU. Sau giới từ luôn là V-ing." },
    {
      type: "table",
      title: "Động từ hay gặp",
      headers: ["+ V-ing", "+ to V"],
      rows: [
        ["enjoy, finish, mind, avoid, suggest", "want, decide, plan, hope, agree"],
        ["keep, practise, consider, miss, deny", "promise, refuse, manage, learn, offer"],
        ["can't stand, look forward to, be good at", "would like, need, afford, expect, seem"],
      ],
    },
    {
      type: "compare",
      title: "Đi được cả hai nhưng khác nghĩa",
      headers: ["Động từ", "+ V-ing", "+ to V"],
      rows: [
        ["stop", "dừng việc đang làm: He stopped smoking.", "dừng lại ĐỂ làm việc khác: He stopped to smoke."],
        ["remember", "nhớ đã làm: I remember meeting her.", "nhớ phải làm: Remember to lock the door."],
        ["forget", "quên đã làm: I'll never forget seeing the sea.", "quên phải làm: Don't forget to call me."],
        ["try", "thử làm xem sao: Try adding salt.", "cố gắng: I tried to open the door."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I enjoy to listen to music.", right: "I enjoy listening to music.", why: "enjoy + V-ing." },
        { wrong: "I'm looking forward to see you.", right: "I'm looking forward to seeing you.", why: "to ở đây là giới từ → V-ing." },
        { wrong: "She decided going abroad.", right: "She decided to go abroad.", why: "decide + to V." },
      ],
    },
  ],
  questions: [
    { id: "gi1", type: "mcq", prompt: "Would you mind ___ the window?", options: ["open", "to open", "opening", "opened"], answer: 2, explanation: "mind + V-ing." },
    { id: "gi2", type: "verb_form", prompt: "We decided ___ a taxi.", base: "take", answers: ["to take"], explanation: "decide + to V." },
    { id: "gi3", type: "verb_form", prompt: "I'm looking forward to ___ you.", base: "see", answers: ["seeing"], explanation: "look forward to + V-ing." },
    { id: "gi4", type: "mcq", prompt: "Remember ___ off the lights when you leave.", options: ["turning", "to turn", "turn", "turned"], answer: 1, explanation: "Nhớ PHẢI làm (chưa làm) → remember to V." },
    { id: "gi5", type: "mcq", prompt: "He stopped ___ because it was bad for his health.", options: ["to smoke", "smoking", "smoke", "smoked"], answer: 1, explanation: "Bỏ hẳn việc hút thuốc → stop + V-ing." },
    { id: "gi6", type: "verb_form", prompt: "She is good at ___ pictures.", base: "draw", answers: ["drawing"], explanation: "Sau giới từ at → V-ing." },
    {
      id: "gi7", type: "error_id",
      segments: [{ text: "My father " }, { text: "promised", underline: true }, { text: " " }, { text: "buying", underline: true }, { text: " me a " }, { text: "new bike", underline: true }, { text: "." }],
      answer: 3, correction: "to buy",
      explanation: "promise + to V.",
    },
    {
      id: "gi8", type: "matching", prompt: "Nối cụm với nghĩa đúng",
      left: ["stop smoking", "stop to smoke", "remember locking", "remember to lock"],
      right: ["dừng lại để hút thuốc", "bỏ hút thuốc", "nhớ phải khóa", "nhớ là đã khóa"],
      pairs: [1, 0, 3, 2],
      explanation: "stop / remember + V-ing: việc đang làm / đã làm; + to V: mục đích / việc phải làm.",
    },
    { id: "gi9", type: "verb_form", prompt: "I still remember ___ my first English lesson.", base: "have", answers: ["having"], explanation: "Nhớ việc ĐÃ làm → remember + V-ing." },
  ],
};

const tooEnough: TopicContent = {
  slug: "too-enough",
  intro: "too hot to drink, old enough to drive — quá ... / đủ ... để.",
  theory: [
    { type: "summary", text: "too + tính từ = QUÁ (đến mức không làm được). Tính từ + enough = ĐỦ (để làm được). enough đứng SAU tính từ/trạng từ nhưng đứng TRƯỚC danh từ." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "too", parts: [{ t: "S + be", role: "subject" }, { t: "too + adj", role: "aux" }, { t: "(for sb) to V", role: "verb" }], example: "The coffee is too hot to drink." },
        { label: "enough + adj", parts: [{ t: "S + be (not)", role: "subject" }, { t: "adj + enough", role: "aux" }, { t: "to V", role: "verb" }], example: "She is old enough to drive." },
        { label: "enough + N", parts: [{ t: "S + have", role: "subject" }, { t: "enough + N", role: "aux" }, { t: "to V", role: "verb" }], example: "We don't have enough money to buy it." },
      ],
    },
    {
      type: "compare",
      title: "Hai cách nói cùng một ý",
      headers: ["too", "not ... enough"],
      rows: [
        ["He is too young to vote.", "He isn't old enough to vote."],
        ["The box is too heavy to lift.", "The box isn't light enough to lift."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She is enough tall to reach the shelf.", right: "She is tall enough to reach the shelf.", why: "enough đứng sau tính từ." },
        { wrong: "The tea is too hot to drink it.", right: "The tea is too hot to drink.", why: "Chủ ngữ cũng là tân ngữ của drink → không lặp it." },
        { wrong: "We have money enough.", right: "We have enough money.", why: "enough đứng trước danh từ." },
      ],
    },
  ],
  questions: [
    { id: "te1", type: "mcq", prompt: "This bag is ___ heavy for me to carry.", options: ["enough", "too", "so", "very"], answer: 1, explanation: "Quá nặng (không mang được) → too heavy." },
    { id: "te2", type: "mcq", prompt: "He isn't ___ to join the team.", options: ["enough tall", "tall enough", "too tall", "tall too"], answer: 1, explanation: "adj + enough." },
    { id: "te3", type: "gap_fill", prompt: "We don't have ___ chairs for everyone.", answers: ["enough"], explanation: "enough + danh từ." },
    { id: "te4", type: "transform", prompt: "The water is very cold. We can't swim in it.", starter: "The water is too", answers: ["The water is too cold to swim in.", "The water is too cold for us to swim in."], explanation: "too + adj + to V (+ giới từ)." },
    { id: "te5", type: "transform", prompt: "She is too young to get married.", starter: "She isn't old", answers: ["She isn't old enough to get married.", "She is not old enough to get married."], explanation: "too young = not old enough." },
    {
      id: "te6", type: "error_id",
      segments: [{ text: "The film was " }, { text: "enough interesting", underline: true }, { text: " " }, { text: "to watch", underline: true }, { text: " " }, { text: "again", underline: true }, { text: "." }],
      answer: 1, correction: "interesting enough",
      explanation: "enough đứng sau tính từ.",
    },
    { id: "te7", type: "mcq", prompt: "The soup is too hot ___.", options: ["to eat it", "to eat", "for eat", "eating"], answer: 1, explanation: "Không lặp tân ngữ: too hot to eat." },
    { id: "te8", type: "word_order", words: ["fast", "enough", "she", "didn't", "run", "to", "win"], answers: ["She didn't run fast enough to win"], explanation: "trạng từ + enough + to V." },
  ],
};

const soSuch: TopicContent = {
  slug: "so-such",
  intro: "so tired that..., such a good film that... — quá ... đến nỗi.",
  theory: [
    { type: "summary", text: "so ... that và such ... that đều nghĩa là QUÁ ... ĐẾN NỖI. so đi với tính từ / trạng từ; such đi với (a/an) + tính từ + danh từ." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "so", parts: [{ t: "S + be/V", role: "subject" }, { t: "so + adj/adv", role: "aux" }, { t: "that + mệnh đề", role: "verb" }], example: "The film was so boring that I fell asleep." },
        { label: "such (danh từ số ít)", parts: [{ t: "S + be", role: "subject" }, { t: "such a/an + adj + N", role: "aux" }, { t: "that + mệnh đề", role: "verb" }], example: "It was such a boring film that I fell asleep." },
        { label: "such (số nhiều / không đếm được)", parts: [{ t: "S + be", role: "subject" }, { t: "such + adj + N", role: "aux" }, { t: "that + mệnh đề", role: "verb" }], example: "They are such kind people that everyone likes them." },
      ],
      note: "so much / so many + danh từ: There were so many people that we couldn't move.",
    },
    {
      type: "mistakes",
      items: [
        { wrong: "It was so a nice day that we went out.", right: "It was such a nice day that we went out.", why: "Có danh từ (day) → such a." },
        { wrong: "She is such kind that everyone loves her.", right: "She is so kind that everyone loves her.", why: "Chỉ có tính từ → so." },
      ],
    },
  ],
  questions: [
    { id: "ss1", type: "mcq", prompt: "The weather was ___ hot that we stayed inside.", options: ["such", "so", "such a", "too"], answer: 1, explanation: "Chỉ có tính từ hot → so." },
    { id: "ss2", type: "mcq", prompt: "It was ___ difficult exam that nobody passed.", options: ["so", "such a", "such", "so a"], answer: 1, explanation: "a + adj + danh từ số ít → such a." },
    { id: "ss3", type: "gap_fill", prompt: "They are ___ friendly people that I always visit them.", answers: ["such"], explanation: "Danh từ số nhiều → such (không có a)." },
    { id: "ss4", type: "gap_fill", prompt: "There were so ___ cars that we were stuck for hours.", answers: ["many"], explanation: "Danh từ đếm được số nhiều → so many." },
    { id: "ss5", type: "transform", prompt: "The book was so interesting that I read it twice.", starter: "It was such", answers: ["It was such an interesting book that I read it twice."], explanation: "so + adj → such an + adj + N." },
    {
      id: "ss6", type: "error_id",
      segments: [{ text: "He spoke " }, { text: "such", underline: true }, { text: " quickly " }, { text: "that", underline: true }, { text: " I " }, { text: "couldn't understand", underline: true }, { text: " him." }],
      answer: 1, correction: "so",
      explanation: "quickly là trạng từ → so quickly.",
    },
    { id: "ss7", type: "mcq", prompt: "I had ___ much homework that I couldn't go out.", options: ["such", "so", "too", "very"], answer: 1, explanation: "so much + danh từ không đếm được." },
    { id: "ss8", type: "transform", prompt: "She is a very good singer. Everyone wants to hear her.", starter: "She is such", answers: ["She is such a good singer that everyone wants to hear her."], explanation: "such a + adj + N + that ..." },
  ],
};

const phrasalVerbs: TopicContent = {
  slug: "phrasal-verbs",
  intro: "get up, look for, give up, turn on — cụm động từ dùng hằng ngày.",
  theory: [
    { type: "summary", text: "Cụm động từ = động từ + giới từ / trạng từ (up, on, off, out...). Nghĩa của cả cụm thường KHÁC nghĩa động từ gốc, nên cần học theo cụm và theo ngữ cảnh." },
    {
      type: "table",
      title: "Cụm động từ thông dụng",
      headers: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["get up", "thức dậy", "I get up at six."],
        ["look for", "tìm kiếm", "I'm looking for my keys."],
        ["look after", "chăm sóc", "She looks after her grandmother."],
        ["give up", "từ bỏ", "Don't give up!"],
        ["turn on / turn off", "bật / tắt", "Turn off the lights, please."],
        ["put on / take off", "mặc vào / cởi ra", "Put on your coat."],
        ["find out", "tìm ra, phát hiện", "I found out the truth."],
        ["run out of", "hết (cái gì)", "We've run out of milk."],
        ["come back", "quay lại", "When will you come back?"],
        ["pick up", "đón; nhặt lên", "I'll pick you up at eight."],
      ],
    },
    {
      type: "usage",
      title: "Vị trí tân ngữ với cụm tách được",
      text: "Với cụm như turn on, put on, pick up: tân ngữ là danh từ đứng trước hoặc sau tiểu từ; là ĐẠI TỪ thì bắt buộc đứng giữa.",
      examples: [
        { en: "Turn on the TV. / Turn the TV on.", vi: "Bật TV lên." },
        { en: "Turn it on. (không nói: Turn on it.)", vi: "Bật nó lên." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Can you pick up me at the airport?", right: "Can you pick me up at the airport?", why: "Tân ngữ là đại từ → đứng giữa: pick me up." },
        { wrong: "I'm looking my glasses.", right: "I'm looking for my glasses.", why: "tìm = look for." },
      ],
    },
  ],
  questions: [
    { id: "phv1", type: "mcq", prompt: "Can you ___ my cat while I'm away?", options: ["look for", "look after", "look up", "look out"], answer: 1, explanation: "chăm sóc → look after." },
    { id: "phv2", type: "mcq", prompt: "It's cold. ___ your jacket.", options: ["Put on", "Take off", "Turn on", "Give up"], answer: 0, explanation: "mặc vào → put on." },
    { id: "phv3", type: "gap_fill", prompt: "We've run ___ of coffee. Can you buy some?", answers: ["out"], explanation: "run out of = hết." },
    { id: "phv4", type: "gap_fill", prompt: "Please turn ___ your phones during the film.", answers: ["off"], explanation: "tắt → turn off." },
    { id: "phv5", type: "mcq", prompt: "She tried many times and never ___.", options: ["gave up", "gave in up", "got up", "came back"], answer: 0, explanation: "không bỏ cuộc → never gave up." },
    {
      id: "phv6", type: "error_id",
      segments: [{ text: "I'll " }, { text: "pick up you", underline: true }, { text: " " }, { text: "at", underline: true }, { text: " " }, { text: "seven", underline: true }, { text: "." }],
      answer: 1, correction: "pick you up",
      explanation: "Đại từ đứng giữa: pick you up.",
    },
    {
      id: "phv7", type: "matching", prompt: "Nối cụm động từ với nghĩa",
      left: ["find out", "get up", "come back", "give up"], right: ["quay lại", "từ bỏ", "phát hiện ra", "thức dậy"], pairs: [2, 3, 0, 1],
      explanation: "find out = phát hiện ra; get up = thức dậy; come back = quay lại; give up = từ bỏ.",
    },
    { id: "phv8", type: "word_order", words: ["off", "the", "please", "turn", "TV"], answers: ["Please turn off the TV", "Please turn the TV off"], explanation: "turn off + danh từ (hoặc turn + danh từ + off)." },
  ],
};

export const B1_STRUCTURE_TOPICS: TopicContent[] = [passiveOtherTenses, modalsDeductionPresent, gerundInfinitive, tooEnough, soSuch, phrasalVerbs];
