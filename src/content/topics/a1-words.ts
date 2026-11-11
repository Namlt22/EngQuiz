import type { TopicContent } from "../types";

/** A1 — nhóm từ loại: đại từ, sở hữu, mạo từ, danh từ số nhiều, this/that, some/any. */

const pronouns: TopicContent = {
  slug: "pronouns",
  intro: "I / me, he / him, they / them... — dùng đúng đại từ ở vị trí chủ ngữ và tân ngữ.",
  theory: [
    { type: "summary", text: "Đại từ nhân xưng thay cho danh từ chỉ người/vật. Đại từ CHỦ NGỮ đứng trước động từ (ai làm), đại từ TÂN NGỮ đứng sau động từ hoặc giới từ (ai bị/được tác động)." },
    {
      type: "table",
      title: "Bảng đại từ nhân xưng",
      headers: ["Chủ ngữ", "Tân ngữ", "Ví dụ"],
      rows: [
        ["I (tôi)", "me", "I love my mum. / She loves me."],
        ["you (bạn, các bạn)", "you", "You are kind. / I miss you."],
        ["he (anh ấy)", "him", "He is tall. / I know him."],
        ["she (cô ấy)", "her", "She sings well. / Listen to her."],
        ["it (nó — vật, con vật)", "it", "It is red. / I like it."],
        ["we (chúng tôi, chúng ta)", "us", "We are friends. / Help us!"],
        ["they (họ, chúng nó)", "them", "They live here. / Call them."],
      ],
    },
    {
      type: "formula",
      title: "Vị trí trong câu",
      rows: [
        { label: "Chủ ngữ → trước động từ", parts: [{ t: "I / he / she / we / they", role: "subject" }, { t: "V", role: "verb" }, { t: "...", role: "other" }], example: "She teaches English." },
        { label: "Tân ngữ → sau động từ / giới từ", parts: [{ t: "S", role: "subject" }, { t: "V / giới từ", role: "verb" }, { t: "me / him / her / us / them", role: "object" }], example: "Please wait for us." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Me like ice cream.", right: "I like ice cream.", why: "Đứng trước động từ (làm chủ ngữ) phải dùng I, không dùng me." },
        { wrong: "She loves he very much.", right: "She loves him very much.", why: "Sau động từ dùng đại từ tân ngữ: him." },
        { wrong: "My mother she is a nurse.", right: "My mother is a nurse.", why: "Tiếng Anh không lặp lại chủ ngữ bằng đại từ ngay sau danh từ." },
      ],
    },
    { type: "tip", text: "it dùng cho đồ vật, con vật (khi không rõ giới tính). they dùng cho cả người lẫn vật ở số nhiều: \"My shoes? They are under the bed.\"" },
  ],
  questions: [
    { id: "pr1", type: "mcq", prompt: "___ am a student.", options: ["Me", "I", "My", "Mine"], answer: 1, explanation: "Đứng đầu câu, trước động từ → đại từ chủ ngữ I." },
    { id: "pr2", type: "mcq", prompt: "Can you help ___?", options: ["I", "me", "my", "mine"], answer: 1, explanation: "Sau động từ help → đại từ tân ngữ me." },
    { id: "pr3", type: "gap_fill", prompt: "This is Lan. ___ is my best friend.", answers: ["she"], hint: "đại từ chủ ngữ", explanation: "Lan là nữ, làm chủ ngữ → She." },
    { id: "pr4", type: "gap_fill", prompt: "I love my grandparents. I visit ___ every Sunday.", answers: ["them"], hint: "đại từ tân ngữ", explanation: "my grandparents (số nhiều), đứng sau động từ visit → them." },
    { id: "pr5", type: "mcq", prompt: "Tom and I are classmates. ___ sit together.", options: ["They", "We", "Us", "Them"], answer: 1, explanation: "Tom and I = chúng tôi, làm chủ ngữ → We." },
    {
      id: "pr6", type: "error_id",
      segments: [{ text: "Him", underline: true }, { text: " plays football with " }, { text: "me", underline: true }, { text: " every " }, { text: "weekend", underline: true }, { text: "." }],
      answer: 0, correction: "He",
      explanation: "Chủ ngữ phải dùng đại từ chủ ngữ: He plays football...",
    },
    { id: "pr7", type: "transform", prompt: "Mai gives the book to Nam. (thay tên người bằng đại từ)", starter: "She", answers: ["She gives the book to him."], explanation: "Mai (chủ ngữ, nữ) → She; Nam (sau giới từ to, nam) → him." },
    {
      id: "pr8", type: "matching", prompt: "Nối đại từ chủ ngữ với đại từ tân ngữ tương ứng",
      left: ["I", "she", "they"], right: ["them", "me", "her"], pairs: [1, 2, 0],
      explanation: "I → me, she → her, they → them.",
    },
    { id: "pr9", type: "word_order", words: ["us", "please", "with", "come"], answers: ["please come with us", "come with us please"], explanation: "Câu mệnh lệnh: (Please) + V + with + us (tân ngữ)." },
  ],
};

const possessives: TopicContent = {
  slug: "possessives",
  intro: "my, your, his, her... và sở hữu cách 's: Lan's bag, my parents' house.",
  theory: [
    { type: "summary", text: "Tính từ sở hữu (my, your, his...) đứng TRƯỚC danh từ để nói vật đó của ai. Sở hữu cách 's gắn sau tên người/danh từ: Lan's bag = cái túi của Lan." },
    {
      type: "table",
      title: "Tính từ sở hữu",
      headers: ["Đại từ", "Tính từ sở hữu", "Ví dụ"],
      rows: [
        ["I", "my", "my book"],
        ["you", "your", "your name"],
        ["he", "his", "his car"],
        ["she", "her", "her dress"],
        ["it", "its", "its tail (đuôi của nó)"],
        ["we", "our", "our school"],
        ["they", "their", "their house"],
      ],
    },
    {
      type: "table",
      title: "Sở hữu cách 's",
      headers: ["Trường hợp", "Cách viết", "Ví dụ"],
      rows: [
        ["Danh từ số ít / tên người", "+ 's", "Lan's bag, my brother's room"],
        ["Danh từ số nhiều tận cùng -s", "+ '", "my parents' house, the students' books"],
        ["Danh từ số nhiều bất quy tắc", "+ 's", "the children's toys, women's clothes"],
      ],
    },
    {
      type: "usage",
      title: "Cách dùng",
      examples: [
        { en: "This is my sister. Her name is Hoa.", vi: "Đây là em gái tôi. Tên em ấy là Hoa." },
        { en: "That is Mr Nam's car.", vi: "Kia là ô tô của ông Nam." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "the bag of Lan", right: "Lan's bag", why: "Với người, tiếng Anh dùng 's tự nhiên hơn \"of\"." },
        { wrong: "This is my friend house.", right: "This is my friend's house.", why: "Thiếu 's — \"nhà của bạn tôi\"." },
        { wrong: "The dog wags it's tail.", right: "The dog wags its tail.", why: "its = của nó; it's = it is." },
      ],
    },
    { type: "tip", text: "his hay her phụ thuộc vào NGƯỜI SỞ HỮU, không phụ thuộc vào đồ vật: \"Nam loves his mother\" (mẹ của Nam → his)." },
  ],
  questions: [
    { id: "po1", type: "mcq", prompt: "This is my sister. ___ name is Hoa.", options: ["She", "Her", "His", "Hers"], answer: 1, explanation: "Trước danh từ name cần tính từ sở hữu; người sở hữu là nữ → Her." },
    { id: "po2", type: "mcq", prompt: "The dog is wagging ___ tail.", options: ["it's", "its", "his", "it"], answer: 1, explanation: "its = của nó (tính từ sở hữu). it's = it is." },
    { id: "po3", type: "gap_fill", prompt: "We love ___ school. It is very beautiful.", answers: ["our"], hint: "tính từ sở hữu của we", explanation: "we → our." },
    { id: "po4", type: "mcq", prompt: "That is ___ car.", options: ["Mr Nam's", "Mr Nam", "Mr Nams'", "of Mr Nam"], answer: 0, explanation: "Sở hữu cách với tên người: Mr Nam's car." },
    { id: "po5", type: "mcq", prompt: "My ___ room is very big. (phòng của bố mẹ tôi)", options: ["parent's", "parents'", "parents", "parent"], answer: 1, explanation: "parents là số nhiều tận cùng -s → chỉ thêm dấu ': parents'." },
    {
      id: "po6", type: "error_id",
      segments: [{ text: "This is " }, { text: "my", underline: true }, { text: " " }, { text: "friend", underline: true }, { text: " " }, { text: "house", underline: true }, { text: "." }],
      answer: 3, correction: "friend's",
      explanation: "\"Nhà của bạn tôi\" → my friend's house.",
    },
    { id: "po7", type: "transform", prompt: "This bike belongs to Minh.", starter: "This is", answers: ["This is Minh's bike."], explanation: "belongs to Minh → Minh's bike." },
    {
      id: "po8", type: "matching", prompt: "Nối đại từ với tính từ sở hữu",
      left: ["he", "they", "we"], right: ["our", "his", "their"], pairs: [1, 2, 0],
      explanation: "he → his, they → their, we → our.",
    },
    { id: "po9", type: "gap_fill", prompt: "The children are playing with ___ toys.", answers: ["their"], hint: "của bọn trẻ", explanation: "the children = they → their." },
  ],
};

const articlesBasic: TopicContent = {
  slug: "articles-basic",
  intro: "a, an hay the? Và khi nào KHÔNG dùng mạo từ.",
  theory: [
    { type: "summary", text: "a / an = \"một\", dùng với danh từ đếm được số ít, khi nhắc đến lần đầu hoặc không xác định. the = \"cái... đó\", dùng khi cả người nói và người nghe đều biết đang nói về cái nào." },
    {
      type: "table",
      title: "a hay an? — theo ÂM đầu, không theo chữ cái",
      headers: ["Mạo từ", "Khi nào", "Ví dụ"],
      rows: [
        ["a", "trước PHỤ ÂM", "a car, a book, a university /juː/, a uniform"],
        ["an", "trước NGUYÊN ÂM", "an apple, an egg, an hour /aʊə/ (h câm), an umbrella"],
      ],
    },
    {
      type: "usage",
      title: "Dùng the khi",
      text: "Đã nhắc trước đó, chỉ có một, hoặc rõ ràng là cái nào:",
      examples: [
        { en: "I have a cat. The cat is black.", vi: "Tôi có một con mèo. Con mèo (đó) màu đen." },
        { en: "The sun is very hot today.", vi: "Hôm nay mặt trời rất nóng." },
        { en: "Please close the door.", vi: "Làm ơn đóng cửa (cái cửa ở đây)." },
      ],
    },
    {
      type: "usage",
      title: "KHÔNG dùng mạo từ khi",
      text: "Nói chung chung với danh từ số nhiều / không đếm được, bữa ăn, môn thể thao, tên nước:",
      examples: [
        { en: "I like cats.", vi: "Tôi thích mèo (nói chung)." },
        { en: "We have breakfast at seven.", vi: "Chúng tôi ăn sáng lúc 7 giờ." },
        { en: "He plays football in Vietnam.", vi: "Anh ấy chơi bóng đá ở Việt Nam." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "an university", right: "a university", why: "university bắt đầu bằng âm /j/ (phụ âm) → a." },
        { wrong: "I am student.", right: "I am a student.", why: "Nghề nghiệp/danh từ đếm được số ít cần a/an." },
        { wrong: "I play the football.", right: "I play football.", why: "Không dùng the trước môn thể thao." },
      ],
    },
  ],
  questions: [
    { id: "ar1", type: "mcq", prompt: "She is ___ engineer.", options: ["a", "an", "the", "(không dùng)"], answer: 1, explanation: "engineer bắt đầu bằng nguyên âm /e/ → an." },
    { id: "ar2", type: "mcq", prompt: "I have ___ cat. ___ cat is black.", options: ["a / The", "the / A", "an / The", "a / A"], answer: 0, explanation: "Lần đầu nhắc → a; lần sau đã xác định → The." },
    { id: "ar3", type: "gap_fill", prompt: "Wait for me! I'll be back in ___ hour.", answers: ["an"], hint: "a / an / the", explanation: "hour có h câm, bắt đầu bằng âm /aʊ/ → an." },
    { id: "ar4", type: "mcq", prompt: "He studies at ___ university in Hanoi.", options: ["a", "an", "the", "(không dùng)"], answer: 0, explanation: "university bắt đầu bằng âm /juː/ (phụ âm) → a." },
    { id: "ar5", type: "mcq", prompt: "___ sun rises in the east.", options: ["A", "An", "The", "(không dùng)"], answer: 2, explanation: "Mặt trời là duy nhất → The." },
    {
      id: "ar6", type: "error_id",
      segments: [{ text: "My father " }, { text: "plays", underline: true }, { text: " " }, { text: "the tennis", underline: true }, { text: " " }, { text: "on Sundays", underline: true }, { text: "." }],
      answer: 3, correction: "tennis",
      explanation: "Không dùng the trước môn thể thao: play tennis.",
    },
    {
      id: "ar7", type: "error_id",
      segments: [{ text: "I " }, { text: "am", underline: true }, { text: " " }, { text: "student", underline: true }, { text: " at " }, { text: "this school", underline: true }, { text: "." }],
      answer: 3, correction: "a student",
      explanation: "Danh từ đếm được số ít (student) cần mạo từ: a student.",
    },
    {
      id: "ar8", type: "matching", prompt: "Chọn mạo từ đúng",
      left: ["___ umbrella", "___ uniform", "___ moon"], right: ["the", "a", "an"], pairs: [2, 1, 0],
      explanation: "an umbrella (âm /ʌ/), a uniform (âm /j/), the moon (duy nhất).",
    },
    { id: "ar9", type: "mcq", prompt: "I usually have ___ breakfast at 7 o'clock.", options: ["a", "an", "the", "(không dùng)"], answer: 3, explanation: "Không dùng mạo từ trước tên bữa ăn: have breakfast." },
  ],
};

const pluralNouns: TopicContent = {
  slug: "plural-nouns",
  intro: "book → books, box → boxes, child → children: quy tắc và các trường hợp bất quy tắc.",
  theory: [
    { type: "summary", text: "Danh từ đếm được có dạng số nhiều khi chỉ từ hai trở lên. Phần lớn chỉ cần thêm -s, nhưng có quy tắc riêng cho một số đuôi và một nhóm từ bất quy tắc cần học thuộc." },
    {
      type: "table",
      title: "Quy tắc thêm -s / -es",
      headers: ["Danh từ tận cùng", "Quy tắc", "Ví dụ"],
      rows: [
        ["-s, -ss, -sh, -ch, -x, -o", "thêm -es", "bus → buses, dish → dishes, box → boxes, tomato → tomatoes"],
        ["phụ âm + y", "bỏ y, thêm -ies", "baby → babies, city → cities"],
        ["nguyên âm + y", "thêm -s", "boy → boys, day → days"],
        ["-f / -fe", "đổi thành -ves", "knife → knives, leaf → leaves, wife → wives"],
        ["còn lại", "thêm -s", "book → books, car → cars"],
      ],
    },
    {
      type: "table",
      title: "Danh từ bất quy tắc thường gặp",
      headers: ["Số ít", "Số nhiều", "Nghĩa"],
      rows: [
        ["man / woman", "men / women", "đàn ông / phụ nữ"],
        ["child", "children", "đứa trẻ"],
        ["person", "people", "người"],
        ["foot / tooth", "feet / teeth", "bàn chân / răng"],
        ["mouse", "mice", "con chuột"],
        ["sheep / fish", "sheep / fish", "cừu / cá (không đổi)"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "two childrens", right: "two children", why: "children đã là số nhiều, không thêm -s." },
        { wrong: "a people", right: "a person", why: "people là số nhiều của person." },
        { wrong: "three box", right: "three boxes", why: "Số lượng từ 2 trở lên → danh từ số nhiều; box tận cùng -x → boxes." },
      ],
    },
    { type: "tip", text: "Ngoại lệ với -o: photo → photos, piano → pianos. Đuôi -s/-es đọc là /s/, /z/ hoặc /ɪz/ — xem bảng IPA, phần quy tắc đọc đuôi -s." },
  ],
  questions: [
    { id: "pl1", type: "gap_fill", prompt: "There are three ___ on the table.", answers: ["boxes"], hint: "box", explanation: "box tận cùng -x → thêm -es: boxes." },
    { id: "pl2", type: "gap_fill", prompt: "I need two ___ to cut the cake.", answers: ["knives"], hint: "knife", explanation: "Tận cùng -fe → đổi thành -ves: knives." },
    { id: "pl3", type: "mcq", prompt: "How many ___ are there in your class?", options: ["person", "peoples", "people", "a people"], answer: 2, explanation: "Số nhiều của person là people." },
    { id: "pl4", type: "gap_fill", prompt: "The ___ are playing in the park.", answers: ["children"], hint: "child", explanation: "child → children (bất quy tắc)." },
    { id: "pl5", type: "mcq", prompt: "Two ___ are sleeping in the room.", options: ["babys", "babies", "babyes", "baby"], answer: 1, explanation: "Phụ âm + y → bỏ y, thêm -ies: babies." },
    {
      id: "pl6", type: "error_id",
      segments: [{ text: "My two " }, { text: "foots", underline: true }, { text: " " }, { text: "hurt", underline: true }, { text: " after " }, { text: "the long walk", underline: true }, { text: "." }],
      answer: 1, correction: "feet",
      explanation: "foot → feet (bất quy tắc).",
    },
    {
      id: "pl7", type: "matching", prompt: "Nối số ít với số nhiều",
      left: ["tooth", "mouse", "woman"], right: ["women", "teeth", "mice"], pairs: [1, 2, 0],
      explanation: "tooth → teeth, mouse → mice, woman → women.",
    },
    { id: "pl8", type: "gap_fill", prompt: "We bought some ___ at the market.", answers: ["tomatoes"], hint: "tomato", explanation: "tomato tận cùng -o → tomatoes." },
    { id: "pl9", type: "mcq", prompt: "There are ten ___ on the farm.", options: ["sheeps", "sheep", "sheepes", "sheepies"], answer: 1, explanation: "sheep có số nhiều giống số ít." },
  ],
};

const demonstratives: TopicContent = {
  slug: "demonstratives",
  intro: "this / that / these / those — chỉ vật ở gần hay ở xa, một hay nhiều.",
  theory: [
    { type: "summary", text: "this / these chỉ người/vật ở GẦN người nói; that / those chỉ người/vật ở XA. this, that đi với số ít; these, those đi với số nhiều." },
    {
      type: "table",
      title: "Bảng tóm tắt",
      headers: ["", "Số ít", "Số nhiều"],
      rows: [
        ["Gần (đây)", "this — this book", "these — these books"],
        ["Xa (kia)", "that — that house", "those — those houses"],
      ],
    },
    {
      type: "usage",
      title: "Cách dùng",
      examples: [
        { en: "This is my friend, Nam.", vi: "Đây là bạn tôi, Nam. (giới thiệu)" },
        { en: "Are those your shoes?", vi: "Kia có phải giày của bạn không?" },
        { en: "Hello, this is Lan speaking.", vi: "Alô, Lan đây. (khi nghe điện thoại)" },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "These book is new.", right: "These books are new.", why: "these đi với danh từ số nhiều và động từ số nhiều." },
        { wrong: "This are my parents.", right: "These are my parents.", why: "Giới thiệu nhiều người → These are." },
        { wrong: "Look at that birds!", right: "Look at those birds!", why: "birds số nhiều, ở xa → those." },
      ],
    },
  ],
  questions: [
    { id: "dm1", type: "mcq", prompt: "___ shoes are too small for me. (đôi giày tôi đang đi)", options: ["This", "That", "These", "Those"], answer: 2, explanation: "Gần (đang đi), số nhiều → These." },
    { id: "dm2", type: "mcq", prompt: "Look at ___ birds in the sky!", options: ["this", "these", "those", "that"], answer: 2, explanation: "Ở xa (trên trời), số nhiều → those." },
    { id: "dm3", type: "gap_fill", prompt: "Hello, ___ is Nam. Can I speak to Lan?", answers: ["this"], hint: "khi gọi điện thoại", explanation: "Tự giới thiệu qua điện thoại dùng this." },
    {
      id: "dm4", type: "error_id",
      segments: [{ text: "These", underline: true }, { text: " " }, { text: "book", underline: true }, { text: " " }, { text: "are", underline: true }, { text: " very interesting." }],
      answer: 2, correction: "books",
      explanation: "These đi với danh từ số nhiều: These books.",
    },
    { id: "dm5", type: "mcq", prompt: "Is ___ your bag over there?", options: ["this", "that", "these", "those"], answer: 1, explanation: "over there (ở kia), số ít → that." },
    { id: "dm6", type: "transform", prompt: "This is my pencil. (→ số nhiều)", starter: "These", answers: ["These are my pencils."], explanation: "This → These, is → are, pencil → pencils." },
    {
      id: "dm7", type: "matching", prompt: "Nối vị trí và số lượng với từ đúng",
      left: ["Gần – số ít", "Gần – số nhiều", "Xa – số ít", "Xa – số nhiều"], right: ["those", "this", "that", "these"], pairs: [1, 3, 2, 0],
      explanation: "this (gần, ít), these (gần, nhiều), that (xa, ít), those (xa, nhiều).",
    },
    { id: "dm8", type: "word_order", words: ["those", "whose", "are", "shoes", "?"], answers: ["Whose shoes are those?"], explanation: "Whose + danh từ + are + those?" },
  ],
};

const someAny: TopicContent = {
  slug: "some-any",
  intro: "Danh từ đếm được và không đếm được; khi nào dùng some, khi nào dùng any.",
  theory: [
    { type: "summary", text: "Danh từ ĐẾM ĐƯỢC có số ít/số nhiều (an apple, two apples). Danh từ KHÔNG ĐẾM ĐƯỢC không có số nhiều và không đi với a/an (water, rice, money). some dùng trong câu khẳng định và lời mời; any dùng trong câu phủ định và câu hỏi." },
    {
      type: "compare",
      title: "Đếm được vs Không đếm được",
      headers: ["Đếm được", "Không đếm được"],
      rows: [
        ["an apple, two apples", "water, milk, rice, bread"],
        ["a chair, three chairs", "money, information, advice, homework"],
        ["How many apples?", "How much water?"],
      ],
    },
    {
      type: "table",
      title: "some / any",
      headers: ["Loại câu", "Từ", "Ví dụ"],
      rows: [
        ["Khẳng định", "some", "There is some milk in the fridge."],
        ["Lời mời, đề nghị", "some", "Would you like some tea?"],
        ["Phủ định", "any", "We don't have any eggs."],
        ["Câu hỏi", "any", "Are there any students in the room?"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I don't have some money.", right: "I don't have any money.", why: "Câu phủ định dùng any." },
        { wrong: "Can you give me an advice?", right: "Can you give me some advice?", why: "advice không đếm được → không dùng a/an." },
        { wrong: "How many money do you have?", right: "How much money do you have?", why: "money không đếm được → How much." },
      ],
    },
  ],
  questions: [
    { id: "sa1", type: "mcq", prompt: "There is ___ milk in the fridge.", options: ["a", "some", "any", "many"], answer: 1, explanation: "Câu khẳng định, milk không đếm được → some." },
    { id: "sa2", type: "mcq", prompt: "We don't have ___ eggs left.", options: ["some", "any", "a", "an"], answer: 1, explanation: "Câu phủ định → any." },
    { id: "sa3", type: "mcq", prompt: "Would you like ___ coffee?", options: ["any", "some", "a", "many"], answer: 1, explanation: "Lời mời dùng some." },
    { id: "sa4", type: "gap_fill", prompt: "Are there ___ students in the classroom?", answers: ["any"], hint: "some / any", explanation: "Câu hỏi → any." },
    { id: "sa5", type: "mcq", prompt: "Which word is UNCOUNTABLE (không đếm được)?", options: ["apple", "chair", "water", "book"], answer: 2, explanation: "water không đếm được; các từ còn lại đếm được." },
    {
      id: "sa6", type: "error_id",
      segments: [{ text: "Can you give " }, { text: "me", underline: true }, { text: " " }, { text: "an advice", underline: true }, { text: " about " }, { text: "my homework", underline: true }, { text: "?" }],
      answer: 3, correction: "some advice",
      explanation: "advice không đếm được → some advice (hoặc a piece of advice).",
    },
    { id: "sa7", type: "mcq", prompt: "How ___ money do you have?", options: ["many", "much", "some", "any"], answer: 1, explanation: "money không đếm được → How much." },
    { id: "sa8", type: "transform", prompt: "I have some bread. (→ câu phủ định)", starter: "I don't", answers: ["I don't have any bread.", "I do not have any bread."], explanation: "Phủ định: don't have + any." },
    { id: "sa9", type: "word_order", words: ["any", "there", "sugar", "is", "?"], answers: ["Is there any sugar?"], explanation: "Câu hỏi: Is there any + danh từ không đếm được?" },
  ],
};

export const A1_WORD_TOPICS = [pronouns, possessives, articlesBasic, pluralNouns, demonstratives, someAny];
