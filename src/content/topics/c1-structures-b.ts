import type { TopicContent } from "../types";

/**
 * C1 — đợt 2: danh từ hoá, tỉnh lược & thay thế, tương lai trong quá khứ, mạo từ nâng cao,
 * từ nối học thuật, bị động nâng cao.
 */

const nominalisation: TopicContent = {
  slug: "nominalisation",
  intro: "The government decided → The government's decision — văn phong học thuật, báo cáo.",
  theory: [
    { type: "summary", text: "Danh từ hoá là biến động từ / tính từ thành DANH TỪ để câu gọn, khách quan, trang trọng hơn. Rất phổ biến trong bài luận, báo cáo, IELTS Writing. Ai làm thường đi sau of hoặc thành sở hữu cách; trạng từ đổi thành tính từ." },
    {
      type: "table",
      title: "Động từ / tính từ → danh từ",
      headers: ["Gốc", "Danh từ", "Ví dụ"],
      rows: [
        ["decide", "decision", "the decision to close the factory"],
        ["increase", "an increase (in)", "a sharp increase in prices"],
        ["fail", "failure", "the failure of the project"],
        ["analyse", "analysis", "a detailed analysis of the data"],
        ["important", "importance", "the importance of education"],
        ["able", "ability", "her ability to solve problems"],
        ["develop", "development", "the rapid development of technology"],
      ],
    },
    {
      type: "compare",
      title: "Câu thường → câu danh từ hoá",
      headers: ["Câu thường (nói)", "Danh từ hoá (viết)"],
      rows: [
        ["Prices rose sharply, which worried people.", "The sharp rise in prices caused concern."],
        ["Because the company failed to act, many jobs were lost.", "The company's failure to act led to job losses."],
        ["If we analyse the results carefully, we can see a pattern.", "Careful analysis of the results reveals a pattern."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The rapidly development of cities…", right: "The rapid development of cities…", why: "Trước danh từ dùng tính từ (rapid), không dùng trạng từ." },
        { wrong: "The decision of closing the factory was unpopular.", right: "The decision to close the factory was unpopular.", why: "decide to V → decision to V (danh từ giữ cấu trúc của động từ gốc)." },
      ],
    },
    { type: "tip", text: "Đừng danh từ hoá mọi câu: dùng quá nhiều làm bài viết nặng nề, khó hiểu. Dùng khi cần trang trọng và khi muốn đưa một sự việc làm chủ ngữ." },
  ],
  questions: [
    { id: "nom1", type: "mcq", prompt: "The ___ of the new law was announced yesterday.", options: ["introduce", "introduction", "introducing to", "introduced"], answer: 1, explanation: "Sau the … of cần danh từ: introduction." },
    { id: "nom2", type: "mcq", prompt: "There has been a sharp ___ in the cost of living.", options: ["rise", "rising", "risen", "raise of"], answer: 0, explanation: "a rise in + N." },
    { id: "nom3", type: "mcq", prompt: "The ___ development of technology has changed our lives.", options: ["rapidly", "rapid", "rapidness", "rapids"], answer: 1, explanation: "Tính từ trước danh từ: rapid development." },
    { id: "nom4", type: "verb_form", prompt: "Her ___ to speak four languages impressed everyone.", base: "able", answers: ["ability"], explanation: "able → ability." },
    { id: "nom5", type: "verb_form", prompt: "The ___ of the experiment surprised the scientists.", base: "fail", answers: ["failure"], explanation: "fail → failure." },
    { id: "nom6", type: "gap_fill", prompt: "The report emphasises the importance ___ early education.", answers: ["of"], explanation: "the importance of + N." },
    { id: "nom7", type: "transform", prompt: "The company decided to close the factory, which shocked the workers.", starter: "The company's decision", answers: ["The company's decision to close the factory shocked the workers."], explanation: "decided to … which shocked → The company's decision to … shocked …" },
    { id: "nom8", type: "mcq", prompt: "Which is the most formal, academic version?", options: ["Lots of people moved to the city, so it got crowded.", "The large-scale migration to the city led to overcrowding.", "People moved to the city and it was very crowded.", "The city got crowded because people moved."], answer: 1, explanation: "Danh từ hoá (migration, overcrowding) → văn phong học thuật." },
    {
      id: "nom9", type: "error_id",
      segments: [{ text: "The " }, { text: "careful", underline: true }, { text: " " }, { text: "analyse", underline: true }, { text: " of the data " }, { text: "showed", underline: true }, { text: " a clear trend." }],
      answer: 3, correction: "analysis",
      explanation: "Sau the careful … of cần danh từ: analysis.",
    },
  ],
};

const ellipsisSubstitution: TopicContent = {
  slug: "ellipsis-substitution",
  intro: "I hope so · So do I · I'd like to · one / ones — tránh lặp lại.",
  theory: [
    { type: "summary", text: "Người bản ngữ tránh lặp lại bằng cách BỎ phần đã rõ (tỉnh lược) hoặc THAY bằng từ ngắn (thay thế): so / not thay mệnh đề; one / ones thay danh từ đếm được; do / does / did thay động từ; giữ lại to thay cho cả cụm to V." },
    {
      type: "table",
      title: "Các cách thay thế",
      headers: ["Thay cho", "Từ thay", "Ví dụ"],
      rows: [
        ["mệnh đề (khẳng định)", "so", "Will it rain? — I think so."],
        ["mệnh đề (phủ định)", "not", "Is he coming? — I hope not."],
        ["danh từ đếm được", "one / ones", "I don't like the red shirt; I prefer the blue one."],
        ["cụm động từ", "do / does / did", "She sings better than I do."],
        ["to + V", "to", "I'd love to go, but I can't afford to."],
        ["đồng tình", "So / Neither + trợ động từ + S", "I'm tired. — So am I."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I don't think it.", right: "I don't think so.", why: "Thay mệnh đề sau think / hope / believe dùng so." },
        { wrong: "I hope not so.", right: "I hope not.", why: "Phủ định với hope / be afraid: I hope not / I'm afraid not." },
        { wrong: "I'd like to go but I'm not able.", right: "I'd like to go but I'm not able to.", why: "Giữ to khi bỏ động từ phía sau." },
        { wrong: "I don't have a pen. Can you lend me it?", right: "Can you lend me one?", why: "Một cái bất kỳ (không xác định) → one." },
      ],
    },
  ],
  questions: [
    { id: "els1", type: "mcq", prompt: "\"Is the shop open on Sunday?\" — \"I think ___.\"", options: ["it", "so", "that", "yes"], answer: 1, explanation: "Thay mệnh đề: I think so." },
    { id: "els2", type: "mcq", prompt: "\"Will it rain tomorrow?\" — \"I hope ___.\"", options: ["not", "no", "don't", "not so"], answer: 0, explanation: "Phủ định: I hope not." },
    { id: "els3", type: "mcq", prompt: "These shoes are too small. Do you have bigger ___?", options: ["one", "ones", "it", "them"], answer: 1, explanation: "Số nhiều không xác định → ones." },
    { id: "els4", type: "mcq", prompt: "\"I can't swim.\" — \"___ can I.\"", options: ["So", "Neither", "Either", "Not"], answer: 1, explanation: "Đồng tình với câu phủ định: Neither can I." },
    { id: "els5", type: "gap_fill", prompt: "She plays the piano better than I ___.", answers: ["do"], explanation: "Thay cụm động từ: do." },
    { id: "els6", type: "gap_fill", prompt: "\"Would you like to join us?\" — \"I'd love ___!\"", answers: ["to"], explanation: "Giữ to: I'd love to." },
    {
      id: "els7", type: "error_id",
      segments: [{ text: "\"Is he coming?\" — \"I'm " }, { text: "afraid", underline: true }, { text: " " }, { text: "not so", underline: true }, { text: ".\" " }, { text: "Sorry", underline: true }, { text: "." }],
      answer: 3, correction: "not",
      explanation: "I'm afraid not (không có so).",
    },
    { id: "els8", type: "mcq", prompt: "\"I've finished my homework.\" — \"___.\"", options: ["So I have", "So have I", "I have so", "Neither have I"], answer: 1, explanation: "Đồng tình khẳng định: So have I." },
    { id: "els9", type: "transform", prompt: "I don't have an umbrella. Can you lend me an umbrella?", starter: "I don't have an umbrella. Can you lend me", answers: ["I don't have an umbrella. Can you lend me one?"], explanation: "Thay danh từ không xác định bằng one." },
  ],
};

const futureInPast: TopicContent = {
  slug: "future-in-past",
  intro: "I knew she would come · We were going to call you · He was about to leave.",
  theory: [
    { type: "summary", text: "Khi kể chuyện quá khứ mà muốn nói về một việc lúc đó CÒN Ở TƯƠNG LAI, dùng dạng \"lùi\" của các cách nói tương lai: will → would, am going to → was going to, am about to → was about to, am -ing (kế hoạch) → was -ing. was going to thường ngụ ý kế hoạch KHÔNG thành." },
    {
      type: "table",
      title: "Hiện tại → quá khứ",
      headers: ["Tương lai (bây giờ)", "Tương lai trong quá khứ", "Ví dụ"],
      rows: [
        ["will", "would", "I knew it would be difficult."],
        ["be going to", "was / were going to", "We were going to travel, but we got sick."],
        ["be about to", "was / were about to", "I was about to leave when you called."],
        ["be -ing (kế hoạch)", "was / were -ing", "She was meeting him at six, so she left early."],
        ["be to (sắp đặt)", "was / were to", "He was to become president ten years later."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I knew you will like it.", right: "I knew you would like it.", why: "Động từ chính ở quá khứ (knew) → will lùi thành would." },
        { wrong: "I was about leaving when he called.", right: "I was about to leave when he called.", why: "be about to + V nguyên mẫu." },
      ],
    },
    { type: "tip", text: "was / were to + V3 (was to have gone) = đã định làm nhưng không thành; khá trang trọng: We were to have met at noon, but he cancelled." },
  ],
  questions: [
    { id: "fip1", type: "mcq", prompt: "I was sure she ___ the job.", options: ["will get", "would get", "gets", "got"], answer: 1, explanation: "Mốc quá khứ (was sure) → would." },
    { id: "fip2", type: "mcq", prompt: "We ___ go to the beach, but it started to rain.", options: ["are going to", "were going to", "will", "would have"], answer: 1, explanation: "Kế hoạch trong quá khứ không thành → were going to." },
    { id: "fip3", type: "mcq", prompt: "I was ___ call you when you rang.", options: ["about to", "about", "going", "to about"], answer: 0, explanation: "Sắp làm thì việc khác xảy ra → was about to." },
    { id: "fip4", type: "verb_form", prompt: "He promised that he ___ me the next day.", base: "call", answers: ["would call"], explanation: "Lời hứa trong quá khứ → would call." },
    { id: "fip5", type: "gap_fill", prompt: "Little did they know that the boy ___ become a famous writer.", answers: ["would", "was to"], explanation: "Tương lai nhìn từ quá khứ → would / was to." },
    {
      id: "fip6", type: "error_id",
      segments: [{ text: "She " }, { text: "told", underline: true }, { text: " me she " }, { text: "will be", underline: true }, { text: " " }, { text: "late", underline: true }, { text: "." }],
      answer: 3, correction: "would be",
      explanation: "told (quá khứ) → would be.",
    },
    { id: "fip7", type: "transform", prompt: "I planned to visit you, but I was too busy.", starter: "I was going", answers: ["I was going to visit you, but I was too busy.", "I was going to visit you but I was too busy."], explanation: "planned to → was going to." },
    { id: "fip8", type: "mcq", prompt: "The meeting ___ at nine, so I set an alarm.", options: ["was starting", "starts", "will start", "has started"], answer: 0, explanation: "Lịch đã sắp xếp nhìn từ quá khứ → was starting." },
    { id: "fip9", type: "mcq", prompt: "We ___ have met at noon, but she cancelled.", options: ["were to", "would", "are to", "will"], answer: 0, explanation: "were to have + V3: đã định nhưng không thành." },
  ],
};

const advancedArticles: TopicContent = {
  slug: "advanced-articles",
  intro: "the rich, the Mekong, go to hospital, a Mr Smith — mạo từ ở trình độ cao.",
  theory: [
    { type: "summary", text: "Những trường hợp người học trình độ cao vẫn hay sai: the + tính từ chỉ một nhóm người; danh từ chung chung (không mạo từ) vs cụ thể (the); tên riêng địa lý; cơ quan đúng chức năng (go to school / hospital / prison — không the); a / an + tên riêng = \"một người tên là…\"." },
    {
      type: "table",
      title: "Quy tắc nâng cao",
      headers: ["Trường hợp", "Ví dụ đúng", "Ghi chú"],
      rows: [
        ["the + tính từ = nhóm người", "the rich, the elderly, the unemployed", "động từ số nhiều: The rich are…"],
        ["Chung chung → không mạo từ", "Life is short. Coffee keeps me awake.", "nói chung về khái niệm / chất liệu"],
        ["Cụ thể → the", "The life of a soldier is hard.", "có cụm bổ nghĩa xác định"],
        ["Sông, biển, dãy núi, quần đảo → the", "the Mekong, the Pacific, the Alps", "nhưng: Lake Ba Be, Mount Fansipan"],
        ["Đúng chức năng → không the", "go to school / bed / hospital / prison", "đến vì việc khác → the: go to the school to meet the teacher"],
        ["a / an + tên", "A Mr Lam called for you.", "một ông tên Lâm (không quen biết)"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The life is beautiful.", right: "Life is beautiful.", why: "Nói chung về khái niệm → không mạo từ." },
        { wrong: "The rich is getting richer.", right: "The rich are getting richer.", why: "the + tính từ chỉ nhóm người → số nhiều." },
        { wrong: "He was taken to the hospital after the accident. (Anh-Anh)", right: "He was taken to hospital after the accident.", why: "Đến bệnh viện để chữa bệnh (đúng chức năng) → Anh-Anh bỏ the. (Anh-Mỹ vẫn dùng the hospital.)" },
        { wrong: "Mekong flows through six countries.", right: "The Mekong flows through six countries.", why: "Tên sông dùng the." },
      ],
    },
  ],
  questions: [
    { id: "adar1", type: "mcq", prompt: "___ unemployed often find it hard to get loans.", options: ["An", "The", "—", "A"], answer: 1, explanation: "the + tính từ = nhóm người." },
    { id: "adar2", type: "mcq", prompt: "___ honesty is the best policy.", options: ["The", "An", "—", "A"], answer: 2, explanation: "Danh từ trừu tượng nói chung → không mạo từ." },
    { id: "adar3", type: "mcq", prompt: "They sailed across ___ Pacific.", options: ["—", "a", "the", "an"], answer: 2, explanation: "Đại dương → the." },
    { id: "adar4", type: "mcq", prompt: "My little brother started ___ school this year.", options: ["the", "a", "—", "an"], answer: 2, explanation: "Đi học (đúng chức năng) → không the." },
    { id: "adar5", type: "mcq", prompt: "We climbed ___ Mount Fansipan last summer.", options: ["the", "—", "a", "an"], answer: 1, explanation: "Tên một ngọn núi đơn lẻ → không mạo từ." },
    { id: "adar6", type: "gap_fill", prompt: "___ elderly need more support from the government.", answers: ["The", "the"], explanation: "The elderly = người cao tuổi nói chung." },
    {
      id: "adar7", type: "error_id",
      segments: [{ text: "" }, { text: "The rich", underline: true }, { text: " " }, { text: "is", underline: true }, { text: " not always " }, { text: "happy", underline: true }, { text: "." }],
      answer: 3, correction: "are",
      explanation: "The rich chỉ nhóm người → động từ số nhiều: are.",
    },
    { id: "adar8", type: "mcq", prompt: "___ Mr Hung phoned while you were out. I don't know him.", options: ["The", "A", "—", "An"], answer: 1, explanation: "a + tên = một ông tên Hùng nào đó." },
    { id: "adar9", type: "mcq", prompt: "___ music of the 1990s is still popular.", options: ["The", "A", "—", "An"], answer: 0, explanation: "Có cụm xác định (of the 1990s) → the." },
  ],
};

const academicLinkers: TopicContent = {
  slug: "academic-linkers",
  intro: "furthermore, consequently, nevertheless, whereas, in light of — từ nối học thuật.",
  theory: [
    { type: "summary", text: "Từ nối học thuật giúp bài viết mạch lạc và trang trọng. Chú ý hai điều: (1) CHỨC NĂNG (thêm ý, nguyên nhân – kết quả, tương phản, ví dụ, kết luận) và (2) NGỮ PHÁP — trạng từ nối (however, therefore) đứng đầu câu mới, sau đó có dấu phẩy; liên từ (whereas, although) nối hai mệnh đề trong một câu; giới từ (despite, due to) + danh từ." },
    {
      type: "table",
      title: "Theo chức năng",
      headers: ["Chức năng", "Trạng từ nối (đầu câu, có dấu phẩy)", "Giới từ / liên từ"],
      rows: [
        ["Thêm ý", "Furthermore, Moreover, In addition,", "as well as + N"],
        ["Kết quả", "Consequently, Therefore, As a result,", "so (liên từ)"],
        ["Nguyên nhân", "—", "due to / owing to + N; since / as + mệnh đề"],
        ["Tương phản", "However, Nevertheless, On the other hand,", "whereas / while + mệnh đề; despite + N"],
        ["Ví dụ", "For instance, For example,", "such as + N"],
        ["Kết luận", "In conclusion, Overall, To sum up,", "—"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Prices rose, however people kept buying.", right: "Prices rose. However, people kept buying.", why: "however là trạng từ nối: bắt đầu câu mới (hoặc sau dấu chấm phẩy), sau nó có dấu phẩy." },
        { wrong: "Due to it was raining, the match was cancelled.", right: "Due to the rain, the match was cancelled.", why: "due to + danh từ; với mệnh đề dùng because / as." },
        { wrong: "Moreover the cost, the plan is risky.", right: "As well as the cost, the plan is risky. / Moreover, the plan is risky.", why: "Moreover là trạng từ nối, không đi với danh từ." },
      ],
    },
  ],
  questions: [
    { id: "acl1", type: "mcq", prompt: "The project was expensive. ___, it was a great success.", options: ["Despite", "Nevertheless", "Whereas", "Due to"], answer: 1, explanation: "Tương phản, đầu câu mới, có dấu phẩy → Nevertheless." },
    { id: "acl2", type: "mcq", prompt: "The flight was delayed ___ bad weather.", options: ["because", "due to", "therefore", "however"], answer: 1, explanation: "due to + danh từ." },
    { id: "acl3", type: "mcq", prompt: "The company lost money. ___, 200 workers were laid off.", options: ["Consequently", "Whereas", "Despite", "Such as"], answer: 0, explanation: "Kết quả → Consequently." },
    { id: "acl4", type: "mcq", prompt: "Some people prefer cities, ___ others enjoy rural life.", options: ["however", "whereas", "moreover", "therefore"], answer: 1, explanation: "Nối hai mệnh đề tương phản trong cùng câu → whereas." },
    { id: "acl5", type: "mcq", prompt: "The plan is cheap. ___, it is easy to carry out.", options: ["Furthermore", "Nevertheless", "Whereas", "Due to"], answer: 0, explanation: "Thêm ý cùng chiều → Furthermore." },
    { id: "acl6", type: "gap_fill", prompt: "Many fruits, such ___ mangoes and lychees, grow well here.", answers: ["as"], explanation: "such as + N (ví dụ)." },
    {
      id: "acl7", type: "error_id",
      segments: [{ text: "" }, { text: "Due to", underline: true }, { text: " " }, { text: "it was late", underline: true }, { text: ", we took a " }, { text: "taxi", underline: true }, { text: "." }],
      answer: 3, correction: "the late hour (hoặc: Because it was late)",
      explanation: "due to + danh từ, không + mệnh đề.",
    },
    { id: "acl8", type: "transform", prompt: "Although the rent is high, the location is excellent.", starter: "The rent is high. However,", answers: ["The rent is high. However, the location is excellent."], explanation: "Although (liên từ) → However (trạng từ nối) ở câu mới." },
    { id: "acl9", type: "mcq", prompt: "___, the evidence suggests that the policy has worked.", options: ["Overall", "Due to", "Whereas", "Such as"], answer: 0, explanation: "Kết luận chung → Overall." },
  ],
};

const advancedPassive: TopicContent = {
  slug: "advanced-passive",
  intro: "I don't like being told · He is thought to have left · The house needs painting.",
  theory: [
    { type: "summary", text: "Bị động nâng cao gồm: bị động của V-ing và to V (being done / to be done); bị động với động từ có hai tân ngữ (I was given a book); bị động tường thuật quá khứ (is thought to have + V3); và cấu trúc need + V-ing mang nghĩa bị động." },
    {
      type: "table",
      title: "Các dạng",
      headers: ["Dạng", "Công thức", "Ví dụ"],
      rows: [
        ["V-ing bị động", "being + V3", "I hate being interrupted."],
        ["to V bị động", "to be + V3", "She expects to be promoted."],
        ["Hoàn thành", "having been + V3", "Having been warned, he was careful."],
        ["Hai tân ngữ", "S (người) + be + V3 + vật", "We were shown the new office."],
        ["Tường thuật quá khứ", "S + is + said / thought + to have V3", "He is thought to have left the country."],
        ["need + V-ing", "S (vật) + needs + V-ing", "The car needs washing. (= needs to be washed)"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I don't like being tell what to do.", right: "I don't like being told what to do.", why: "being + V3." },
        { wrong: "The windows need to clean.", right: "The windows need cleaning. / The windows need to be cleaned.", why: "Vật cần được làm → need + V-ing hoặc need to be + V3." },
        { wrong: "She is believed to leave yesterday.", right: "She is believed to have left yesterday.", why: "Việc ở quá khứ → to have + V3." },
      ],
    },
  ],
  questions: [
    { id: "adp1", type: "mcq", prompt: "He hates ___ in public.", options: ["criticising", "being criticised", "to criticise", "criticised"], answer: 1, explanation: "Anh ấy bị phê bình → being criticised." },
    { id: "adp2", type: "mcq", prompt: "The students expect ___ their results next week.", options: ["to give", "to be given", "giving", "being give"], answer: 1, explanation: "Được đưa kết quả → to be given." },
    { id: "adp3", type: "mcq", prompt: "My phone screen needs ___.", options: ["replace", "replacing", "to replace", "replaced"], answer: 1, explanation: "Vật cần được làm → needs replacing." },
    { id: "adp4", type: "mcq", prompt: "The painter is believed ___ this picture in 1920.", options: ["to paint", "to have painted", "painting", "to be painted"], answer: 1, explanation: "Việc quá khứ → to have painted." },
    { id: "adp5", type: "verb_form", prompt: "___ by the noise, the baby started crying.", base: "wake", answers: ["Woken", "Having been woken", "woken", "having been woken"], explanation: "Bị đánh thức (bị động) → Woken / Having been woken." },
    { id: "adp6", type: "gap_fill", prompt: "We were ___ a tour of the factory.", answers: ["given", "shown"], explanation: "Hai tân ngữ, người làm chủ ngữ: were given / shown a tour." },
    {
      id: "adp7", type: "error_id",
      segments: [{ text: "Nobody " }, { text: "likes", underline: true }, { text: " " }, { text: "being lie", underline: true }, { text: " " }, { text: "to", underline: true }, { text: "." }],
      answer: 3, correction: "being lied",
      explanation: "being + V3: being lied to.",
    },
    { id: "adp8", type: "transform", prompt: "Someone told me the news yesterday.", starter: "I was", answers: ["I was told the news yesterday."], explanation: "Người làm chủ ngữ: I was told the news." },
    { id: "adp9", type: "transform", prompt: "People think that the thief escaped through the window.", starter: "The thief is thought", answers: ["The thief is thought to have escaped through the window."], explanation: "is thought + to have escaped." },
  ],
};

export const C1_STRUCTURE_TOPICS_B: TopicContent[] = [nominalisation, ellipsisSubstitution, futureInPast, advancedArticles, academicLinkers, advancedPassive];
