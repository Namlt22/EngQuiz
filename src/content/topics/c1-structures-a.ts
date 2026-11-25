import type { TopicContent } from "../types";

/**
 * C1 — đợt 1: đảo ngữ với trạng từ phủ định, đảo ngữ câu điều kiện, điều kiện nâng cao,
 * câu chẻ, thể giả định, cấu trúc nhấn mạnh.
 */

const inversionNegative: TopicContent = {
  slug: "inversion-negative",
  intro: "Never have I seen… · Not only did she… · Hardly had we… — đảo ngữ để nhấn mạnh, văn phong trang trọng.",
  theory: [
    { type: "summary", text: "Khi đưa một trạng từ / cụm từ mang nghĩa PHỦ ĐỊNH hoặc HẠN CHẾ lên đầu câu để nhấn mạnh, phần sau phải ĐẢO trợ động từ lên trước chủ ngữ, giống trật tự câu hỏi. Không có trợ động từ thì mượn do / does / did. Thường gặp trong văn viết, bài phát biểu, bài thi." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Đảo ngữ", parts: [{ t: "Never / Rarely / Seldom / Little", role: "other" }, { t: "trợ động từ", role: "aux" }, { t: "S", role: "subject" }, { t: "V", role: "verb" }], example: "Never have I seen such a beautiful sunset." },
        { label: "Mượn do/does/did", parts: [{ t: "Not only", role: "other" }, { t: "did", role: "aux" }, { t: "S", role: "subject" }, { t: "V …, but (also) …", role: "verb" }], example: "Not only did she win, but she also broke the record." },
        { label: "Hai việc nối tiếp", parts: [{ t: "Hardly / Scarcely … when · No sooner … than", role: "other" }, { t: "had", role: "aux" }, { t: "S", role: "subject" }, { t: "V3", role: "verb" }], example: "No sooner had we arrived than it started to rain." },
        { label: "Only + cụm", parts: [{ t: "Only then / Only after … / Only when …", role: "other" }, { t: "trợ động từ", role: "aux" }, { t: "S + V", role: "subject" }], example: "Only after the meeting did I realise my mistake." },
      ],
    },
    {
      type: "table",
      title: "Các cụm hay gặp",
      headers: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["Never / Rarely / Seldom", "chưa bao giờ / hiếm khi", "Rarely do we see snow here."],
        ["Little", "hầu như không (biết…)", "Little did he know what was coming."],
        ["Under no circumstances / On no account", "trong bất cứ hoàn cảnh nào cũng không", "Under no circumstances should you open this door."],
        ["Not until …", "mãi đến khi … mới", "Not until midnight did they finish."],
        ["In no way", "không hề", "In no way is this your fault."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Never I have seen such a mess.", right: "Never have I seen such a mess.", why: "Sau trạng từ phủ định đầu câu phải đảo trợ động từ lên trước chủ ngữ." },
        { wrong: "Not only she sings, but she also dances.", right: "Not only does she sing, but she also dances.", why: "Không có trợ động từ → mượn does, động từ về nguyên mẫu." },
        { wrong: "Not until he left I realised.", right: "Not until he left did I realise.", why: "Đảo ở MỆNH ĐỀ CHÍNH (I realised), không đảo trong mệnh đề Not until." },
      ],
    },
  ],
  questions: [
    { id: "inn1", type: "mcq", prompt: "Never ___ such a delicious meal.", options: ["I have eaten", "have I eaten", "I ate", "did I ate"], answer: 1, explanation: "Never đầu câu → đảo: have I eaten." },
    { id: "inn2", type: "mcq", prompt: "Not only ___ late, but he also forgot the documents.", options: ["he arrived", "did he arrive", "he did arrive", "arrived he"], answer: 1, explanation: "Không có trợ động từ → mượn did: did he arrive." },
    { id: "inn3", type: "mcq", prompt: "No sooner had we sat down ___ the phone rang.", options: ["when", "than", "then", "that"], answer: 1, explanation: "No sooner … than (Hardly … when)." },
    { id: "inn4", type: "mcq", prompt: "Little ___ that his life was about to change.", options: ["he knew", "did he know", "knew he", "he did know"], answer: 1, explanation: "Little đầu câu → did he know." },
    { id: "inn5", type: "gap_fill", prompt: "Under no circumstances ___ you leave the building.", answers: ["should", "must", "can", "may"], explanation: "Đảo modal: should you leave." },
    { id: "inn6", type: "gap_fill", prompt: "Rarely ___ we see such talent in young players.", answers: ["do"], explanation: "Rarely đầu câu, hiện tại đơn, không có trợ động từ → mượn do." },
    {
      id: "inn7", type: "error_id",
      segments: [{ text: "Not until the film ended " }, { text: "I noticed", underline: true }, { text: " that my " }, { text: "phone", underline: true }, { text: " was " }, { text: "missing", underline: true }, { text: "." }],
      answer: 1, correction: "did I notice",
      explanation: "Not until … → đảo ở mệnh đề chính: did I notice.",
    },
    { id: "inn8", type: "transform", prompt: "I have never heard such nonsense.", starter: "Never", answers: ["Never have I heard such nonsense."], explanation: "Never + have + I + heard." },
    { id: "inn9", type: "transform", prompt: "As soon as she arrived, the meeting started.", starter: "Hardly", answers: ["Hardly had she arrived when the meeting started."], explanation: "Hardly had + S + V3 + when + quá khứ đơn." },
    { id: "inn10", type: "transform", prompt: "I only understood the problem after reading the report.", starter: "Only after", answers: ["Only after reading the report did I understand the problem.", "Only after I had read the report did I understand the problem.", "Only after I read the report did I understand the problem."], explanation: "Only after … + did + I + understand." },
  ],
};

const inversionConditional: TopicContent = {
  slug: "inversion-conditional",
  intro: "Had I known… · Should you need… · Were I you… — bỏ if, đảo trợ động từ.",
  theory: [
    { type: "summary", text: "Trong văn phong trang trọng có thể bỏ if và đảo trợ động từ lên đầu: Should (loại 1, nghĩa \"nếu chẳng may\"), Were (loại 2), Had (loại 3). Phủ định đặt not SAU chủ ngữ, không viết tắt: Had I not…, không viết Hadn't I…" },
    {
      type: "formula",
      title: "Ba dạng",
      rows: [
        { label: "Loại 1", parts: [{ t: "Should", role: "aux" }, { t: "S", role: "subject" }, { t: "V", role: "verb" }, { t: ", …will / please …", role: "other" }], example: "Should you have any questions, please contact us." },
        { label: "Loại 2", parts: [{ t: "Were", role: "aux" }, { t: "S", role: "subject" }, { t: "(to V) / N / adj", role: "verb" }, { t: ", … would V", role: "other" }], example: "Were I in your position, I would accept the offer." },
        { label: "Loại 3", parts: [{ t: "Had", role: "aux" }, { t: "S", role: "subject" }, { t: "(not) V3", role: "verb" }, { t: ", … would have V3", role: "other" }], example: "Had we left earlier, we would have caught the train." },
      ],
    },
    {
      type: "compare",
      title: "Câu gốc → đảo ngữ",
      headers: ["Có if", "Đảo ngữ"],
      rows: [
        ["If you need help, call me.", "Should you need help, call me."],
        ["If I were rich, I would travel.", "Were I rich, I would travel."],
        ["If he studied harder, he would pass.", "Were he to study harder, he would pass."],
        ["If they hadn't helped, we would have failed.", "Had they not helped, we would have failed."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Hadn't I missed the bus, I would have arrived on time.", right: "Had I not missed the bus, I would have arrived on time.", why: "Đảo ngữ điều kiện không viết tắt; not đứng sau chủ ngữ." },
        { wrong: "Had I know, I would have told you.", right: "Had I known, I would have told you.", why: "Sau Had là V3." },
        { wrong: "Were I study harder, I would pass.", right: "Were I to study harder, I would pass.", why: "Were + S + to V với động từ thường." },
      ],
    },
  ],
  questions: [
    { id: "inc1", type: "mcq", prompt: "___ I known about the problem, I would have helped.", options: ["If", "Had", "Should", "Were"], answer: 1, explanation: "Loại 3 đảo ngữ: Had + S + V3." },
    { id: "inc2", type: "mcq", prompt: "___ you require further information, please let us know.", options: ["Should", "Had", "Were", "Would"], answer: 0, explanation: "Loại 1 trang trọng: Should + S + V." },
    { id: "inc3", type: "mcq", prompt: "___ I in your shoes, I wouldn't accept it.", options: ["Had", "Should", "Were", "If"], answer: 2, explanation: "Loại 2: Were + S." },
    { id: "inc4", type: "mcq", prompt: "___ the rain, we would have finished the match.", options: ["Had it not been for", "Hadn't it been for", "Were it not", "Should not"], answer: 0, explanation: "Had it not been for + N = nếu không có (quá khứ); không viết tắt." },
    { id: "inc5", type: "gap_fill", prompt: "Were she ___ apply for the job, she would get it.", answers: ["to"], explanation: "Were + S + to V." },
    {
      id: "inc6", type: "error_id",
      segments: [{ text: "" }, { text: "Hadn't we", underline: true }, { text: " booked early, we " }, { text: "wouldn't have got", underline: true }, { text: " " }, { text: "seats", underline: true }, { text: "." }],
      answer: 1, correction: "Had we not",
      explanation: "Phủ định trong đảo ngữ: Had we not, không viết tắt.",
    },
    { id: "inc7", type: "transform", prompt: "If you see Mr Lam, please give him this letter.", starter: "Should", answers: ["Should you see Mr Lam, please give him this letter."], explanation: "If you see → Should you see." },
    { id: "inc8", type: "transform", prompt: "If I had known the truth, I would have acted differently.", starter: "Had", answers: ["Had I known the truth, I would have acted differently."], explanation: "If I had known → Had I known." },
    { id: "inc9", type: "transform", prompt: "If it weren't for your help, I would fail.", starter: "Were it", answers: ["Were it not for your help, I would fail."], explanation: "If it weren't for → Were it not for." },
  ],
};

const advancedConditionals: TopicContent = {
  slug: "advanced-conditionals",
  intro: "but for, provided that, as long as, supposing, otherwise — điều kiện không dùng if.",
  theory: [
    { type: "summary", text: "Ngoài if, tiếng Anh có nhiều cách nói điều kiện: provided / providing (that), as long as, on condition that (chỉ khi — có điều kiện ràng buộc); suppose / supposing (giả sử); unless (trừ khi = if … not); but for + N (nếu không có — trang trọng); otherwise / or else (nếu không thì). Thì của động từ vẫn theo quy tắc câu điều kiện tương ứng." },
    {
      type: "table",
      title: "Các cụm điều kiện",
      headers: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["provided (that) / providing", "với điều kiện là", "You can borrow it provided you return it tomorrow."],
        ["as / so long as", "miễn là", "As long as you're happy, I'm happy."],
        ["on condition that", "với điều kiện (trang trọng, ràng buộc)", "He was released on condition that he left the country."],
        ["unless", "trừ khi (= if not)", "Unless it rains, we'll go out."],
        ["supposing / suppose", "giả sử", "Supposing you won the lottery, what would you do?"],
        ["but for + N", "nếu không có", "But for your help, I would have failed."],
        ["otherwise", "nếu không thì", "Hurry up, otherwise we'll miss the bus."],
        ["in case", "phòng khi (KHÔNG phải điều kiện)", "Take a coat in case it gets cold."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Unless you don't hurry, you'll be late.", right: "Unless you hurry, you'll be late.", why: "unless đã mang nghĩa phủ định (= if not)." },
        { wrong: "Provided you will finish early, you can leave.", right: "Provided you finish early, you can leave.", why: "Mệnh đề điều kiện (provided, as long as) dùng hiện tại đơn khi nói tương lai." },
        { wrong: "But for you helped me, I would have failed.", right: "But for your help, I would have failed.", why: "but for + danh từ, không + mệnh đề." },
      ],
    },
    { type: "tip", text: "in case khác if: Take an umbrella in case it rains = mang ô PHÒNG KHI trời mưa (mang ngay bây giờ). Take an umbrella if it rains = chỉ mang NẾU trời mưa." },
  ],
  questions: [
    { id: "adc1", type: "mcq", prompt: "You can use my laptop ___ you don't install anything.", options: ["unless", "provided", "otherwise", "in case"], answer: 1, explanation: "Với điều kiện là → provided." },
    { id: "adc2", type: "mcq", prompt: "___ your support, we would never have finished the project.", options: ["Unless", "But for", "Provided", "As long as"], answer: 1, explanation: "Nếu không có + danh từ → But for." },
    { id: "adc3", type: "mcq", prompt: "Leave now, ___ you'll miss the last train.", options: ["unless", "otherwise", "provided", "supposing"], answer: 1, explanation: "Nếu không thì → otherwise." },
    { id: "adc4", type: "mcq", prompt: "___ you lost your passport abroad, what would you do?", options: ["Unless", "Supposing", "Otherwise", "In case"], answer: 1, explanation: "Giả sử → Supposing." },
    { id: "adc5", type: "mcq", prompt: "I'll bring some snacks ___ we get hungry.", options: ["if", "in case", "unless", "provided"], answer: 1, explanation: "Phòng khi → in case." },
    { id: "adc6", type: "verb_form", prompt: "As long as you ___ the rules, you'll be fine.", base: "follow", answers: ["follow"], explanation: "Mệnh đề điều kiện nói tương lai → hiện tại đơn." },
    {
      id: "adc7", type: "error_id",
      segments: [{ text: "" }, { text: "Unless", underline: true }, { text: " you " }, { text: "don't study", underline: true }, { text: ", you won't " }, { text: "pass", underline: true }, { text: "." }],
      answer: 3, correction: "study",
      explanation: "unless = if not → không thêm don't.",
    },
    { id: "adc8", type: "transform", prompt: "If you don't hurry, you'll be late.", starter: "Unless", answers: ["Unless you hurry, you'll be late.", "Unless you hurry, you will be late."], explanation: "If … not → Unless." },
    { id: "adc9", type: "transform", prompt: "If it hadn't been for the map, we would have got lost.", starter: "But for", answers: ["But for the map, we would have got lost.", "But for the map we would have got lost."], explanation: "If it hadn't been for + N → But for + N." },
  ],
};

const cleftSentences: TopicContent = {
  slug: "cleft-sentences",
  intro: "It was Lan who called · What I need is a holiday — tách câu để nhấn mạnh một phần.",
  theory: [
    { type: "summary", text: "Câu chẻ tách một câu thành hai mệnh đề để LÀM NỔI BẬT một thành phần. It-cleft: It is / was + phần nhấn mạnh + who / that + phần còn lại. Wh-cleft: What + S + V + is / was + phần nhấn mạnh. Dùng để sửa thông tin sai, nhấn mạnh điều mới, tạo điểm nhấn trong bài nói / viết." },
    {
      type: "formula",
      title: "Hai dạng chính",
      rows: [
        { label: "It-cleft", parts: [{ t: "It is / was", role: "aux" }, { t: "phần nhấn mạnh", role: "object" }, { t: "who / that", role: "other" }, { t: "phần còn lại", role: "verb" }], example: "It was my brother who broke the window." },
        { label: "Wh-cleft", parts: [{ t: "What + S + V", role: "subject" }, { t: "is / was", role: "aux" }, { t: "phần nhấn mạnh", role: "object" }], example: "What I need is a long holiday." },
        { label: "All / The thing", parts: [{ t: "All / The thing (that) + S + V", role: "subject" }, { t: "is / was", role: "aux" }, { t: "…", role: "object" }], example: "All I want is a quiet life." },
      ],
    },
    {
      type: "usage",
      title: "Một câu, nhiều cách nhấn mạnh",
      text: "Câu gốc: Lan met Nam in Hue last year.",
      examples: [
        { en: "It was Lan who met Nam in Hue last year.", vi: "Chính Lan (chứ không phải ai khác) đã gặp Nam." },
        { en: "It was in Hue that Lan met Nam last year.", vi: "Chính ở Huế (chứ không phải nơi khác)…" },
        { en: "It was last year that Lan met Nam in Hue.", vi: "Chính năm ngoái…" },
        { en: "What surprised me was his reaction.", vi: "Điều làm tôi ngạc nhiên là phản ứng của anh ấy." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "It was in Hue where I met her.", right: "It was in Hue that I met her.", why: "Nhấn mạnh nơi chốn có giới từ (in Hue) → dùng that." },
        { wrong: "What I need it is more time.", right: "What I need is more time.", why: "Không thêm it trong câu chẻ What." },
        { wrong: "It were the students who complained.", right: "It was the students who complained.", why: "It luôn đi với is / was, dù phần nhấn mạnh là số nhiều." },
      ],
    },
  ],
  questions: [
    { id: "clf1", type: "mcq", prompt: "It was my sister ___ found the keys.", options: ["which", "who", "what", "where"], answer: 1, explanation: "Nhấn mạnh người → who (hoặc that)." },
    { id: "clf2", type: "mcq", prompt: "___ I really want is a cup of coffee.", options: ["That", "Which", "What", "It"], answer: 2, explanation: "Wh-cleft: What + S + V + is …" },
    { id: "clf3", type: "mcq", prompt: "It was in 2015 ___ they got married.", options: ["when", "that", "which", "what"], answer: 1, explanation: "Câu chẻ It was … that (that được dùng chung cho thời gian, nơi chốn)." },
    { id: "clf4", type: "mcq", prompt: "It ___ the twins who won the prize.", options: ["were", "was", "are", "been"], answer: 1, explanation: "It luôn đi với was / is." },
    { id: "clf5", type: "gap_fill", prompt: "All I need ___ a good night's sleep.", answers: ["is"], explanation: "All (that) I need + is …" },
    {
      id: "clf6", type: "error_id",
      segments: [{ text: "It was " }, { text: "in Da Nang", underline: true }, { text: " " }, { text: "where", underline: true }, { text: " we first " }, { text: "met", underline: true }, { text: "." }],
      answer: 3, correction: "that",
      explanation: "It was + cụm giới từ + that.",
    },
    { id: "clf7", type: "transform", prompt: "Nam broke the vase.", starter: "It was Nam", answers: ["It was Nam who broke the vase.", "It was Nam that broke the vase."], explanation: "It was + người + who / that + phần còn lại." },
    { id: "clf8", type: "transform", prompt: "I need a holiday.", starter: "What I need", answers: ["What I need is a holiday."], explanation: "What + S + V + is + phần nhấn mạnh." },
    { id: "clf9", type: "transform", prompt: "His attitude annoys me.", starter: "What annoys me", answers: ["What annoys me is his attitude."], explanation: "What + V + me + is + …" },
  ],
};

const subjunctive: TopicContent = {
  slug: "subjunctive",
  intro: "I suggest that he be told · It's essential that she attend — thể giả định.",
  theory: [
    { type: "summary", text: "Thể giả định hiện tại dùng V NGUYÊN MẪU (không chia, không thêm -s, kể cả ngôi thứ ba; to be → be) trong mệnh đề that sau các động từ / tính từ chỉ đề nghị, yêu cầu, tầm quan trọng. Phủ định: not + V. Tiếng Anh-Anh hay dùng should + V thay thế; cả hai đều đúng." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Sau động từ", parts: [{ t: "S + suggest / recommend / insist / demand / request", role: "subject" }, { t: "that + S", role: "other" }, { t: "(not) V nguyên mẫu", role: "verb" }], example: "The doctor recommended that he stay in bed." },
        { label: "Sau tính từ", parts: [{ t: "It is essential / vital / important / necessary", role: "subject" }, { t: "that + S", role: "other" }, { t: "(not) V nguyên mẫu", role: "verb" }], example: "It is vital that everyone be on time." },
        { label: "Cách Anh-Anh", parts: [{ t: "… that + S", role: "subject" }, { t: "should", role: "aux" }, { t: "V", role: "verb" }], example: "I suggest that he should apologise." },
      ],
    },
    {
      type: "usage",
      title: "Giả định quá khứ (đã học với if, wish)",
      examples: [
        { en: "If I were you, I'd take the job.", vi: "Nếu tôi là bạn thì tôi nhận việc. (were cho mọi ngôi)" },
        { en: "He talks as if he were the boss.", vi: "Anh ta nói như thể anh ta là sếp." },
        { en: "It's high time we left.", vi: "Đã đến lúc chúng ta phải đi rồi." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I suggest that he goes to the doctor.", right: "I suggest that he go to the doctor.", why: "Thể giả định: V nguyên mẫu, không thêm -s." },
        { wrong: "It is essential that she is present.", right: "It is essential that she be present.", why: "to be → be." },
        { wrong: "They insisted that he didn't leave.", right: "They insisted that he not leave.", why: "Phủ định giả định: not + V." },
      ],
    },
  ],
  questions: [
    { id: "sbj1", type: "mcq", prompt: "The teacher insisted that every student ___ the essay by Friday.", options: ["submits", "submit", "submitted", "will submit"], answer: 1, explanation: "Sau insist that → V nguyên mẫu: submit." },
    { id: "sbj2", type: "mcq", prompt: "It is essential that she ___ informed immediately.", options: ["is", "be", "was", "being"], answer: 1, explanation: "to be → be." },
    { id: "sbj3", type: "mcq", prompt: "I recommend that he ___ late again.", options: ["isn't", "not be", "doesn't be", "won't be"], answer: 1, explanation: "Phủ định giả định: not be." },
    { id: "sbj4", type: "verb_form", prompt: "The doctor suggested that my father ___ less salt.", base: "eat", answers: ["eat", "should eat"], explanation: "suggest that + V nguyên mẫu (hoặc should + V)." },
    { id: "sbj5", type: "verb_form", prompt: "It is vital that the door ___ locked at night.", base: "be", answers: ["be", "should be"], explanation: "be (nguyên mẫu)." },
    { id: "sbj6", type: "gap_fill", prompt: "She talks as if she ___ the manager.", answers: ["were"], explanation: "as if + giả định quá khứ: were." },
    {
      id: "sbj7", type: "error_id",
      segments: [{ text: "The committee " }, { text: "demanded", underline: true }, { text: " that he " }, { text: "resigns", underline: true }, { text: " " }, { text: "immediately", underline: true }, { text: "." }],
      answer: 3, correction: "resign",
      explanation: "demand that + V nguyên mẫu: resign.",
    },
    { id: "sbj8", type: "transform", prompt: "\"You should take a break,\" the boss said to me.", starter: "The boss suggested that I", answers: ["The boss suggested that I take a break.", "The boss suggested that I should take a break."], explanation: "suggested that I take (giả định) / should take." },
    { id: "sbj9", type: "mcq", prompt: "Which sentence is correct?", options: ["It's important that he arrives on time.", "It's important that he arrive on time.", "It's important that he arrived on time.", "It's important that he will arrive on time."], answer: 1, explanation: "Giả định trang trọng: he arrive (không -s)." },
  ],
};

const emphasis: TopicContent = {
  slug: "emphasis",
  intro: "I do like it · The very person · Whatever happens — cách nhấn mạnh trong câu.",
  theory: [
    { type: "summary", text: "Ngoài câu chẻ và đảo ngữ, tiếng Anh nhấn mạnh bằng: trợ động từ do / does / did trước động từ (khẳng định mạnh, phản bác); the very + N (chính là); từ nhấn mạnh như at all, whatsoever (sau phủ định), on earth / ever (sau từ để hỏi); đưa thông tin lên đầu câu (fronting)." },
    {
      type: "table",
      title: "Các cách nhấn mạnh",
      headers: ["Cách", "Ví dụ", "Nghĩa"],
      rows: [
        ["do / does / did + V", "I DO like your cooking!", "Tôi thực sự thích mà!"],
        ["the very + N", "That's the very book I wanted.", "Chính là quyển sách tôi muốn."],
        ["Phủ định + at all / whatsoever", "I have no idea whatsoever.", "Tôi hoàn toàn không biết."],
        ["Từ để hỏi + on earth / ever", "What on earth are you doing?", "Rốt cuộc bạn đang làm gì vậy?"],
        ["Đưa lên đầu câu", "This film I will never forget.", "Bộ phim này thì tôi không bao giờ quên."],
        ["myself / itself…", "The manager herself answered the phone.", "Chính bà giám đốc nghe máy."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I do liked the film.", right: "I did like the film.", why: "Nhấn mạnh quá khứ: did + V nguyên mẫu." },
        { wrong: "She does works hard.", right: "She does work hard.", why: "Sau does là V nguyên mẫu." },
        { wrong: "I don't like it whatsoever at all.", right: "I don't like it at all.", why: "Chỉ cần một từ nhấn mạnh; dùng cả hai là thừa." },
      ],
    },
  ],
  questions: [
    { id: "emp1", type: "mcq", prompt: "You think I didn't call? I ___ call you — three times!", options: ["do", "did", "was", "have"], answer: 1, explanation: "Nhấn mạnh việc đã làm: did + V." },
    { id: "emp2", type: "mcq", prompt: "She ___ look tired today.", options: ["do", "does", "did", "is"], answer: 1, explanation: "Hiện tại, ngôi thứ ba: does + V." },
    { id: "emp3", type: "mcq", prompt: "That's ___ person I was telling you about!", options: ["the very", "very the", "a very", "the much"], answer: 0, explanation: "the very + N = chính là." },
    { id: "emp4", type: "mcq", prompt: "Where ___ have you been? We've been looking everywhere!", options: ["in earth", "on earth", "at all", "whatsoever"], answer: 1, explanation: "Từ để hỏi + on earth." },
    { id: "emp5", type: "gap_fill", prompt: "I'm not hungry at ___.", answers: ["all"], explanation: "not … at all." },
    { id: "emp6", type: "verb_form", prompt: "I really ___ enjoy the party last night.", base: "do", answers: ["did"], explanation: "Nhấn mạnh quá khứ: did enjoy." },
    {
      id: "emp7", type: "error_id",
      segments: [{ text: "We " }, { text: "did", underline: true }, { text: " " }, { text: "enjoyed", underline: true }, { text: " the " }, { text: "concert", underline: true }, { text: "." }],
      answer: 3, correction: "enjoy",
      explanation: "did + V nguyên mẫu: did enjoy.",
    },
    { id: "emp8", type: "transform", prompt: "The director answered my email. (nhấn mạnh: chính giám đốc)", starter: "The director", answers: ["The director himself answered my email.", "The director herself answered my email."], explanation: "Đại từ phản thân sau danh từ để nhấn mạnh." },
    { id: "emp9", type: "mcq", prompt: "There is no evidence ___ that he was there.", options: ["whatsoever", "on earth", "the very", "ever"], answer: 0, explanation: "Sau no + N: whatsoever." },
  ],
};

export const C1_STRUCTURE_TOPICS_A: TopicContent[] = [inversionNegative, inversionConditional, advancedConditionals, cleftSentences, subjunctive, emphasis];
