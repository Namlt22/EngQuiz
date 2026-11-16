import type { TopicContent } from "../types";

/** B1 — mệnh đề quan hệ, câu tường thuật, câu hỏi gián tiếp, câu hỏi đuôi, unless / in case, wish. */

const definingRelative: TopicContent = {
  slug: "defining-relative",
  intro: "The man who lives next door — who / which / that / whose / where.",
  theory: [
    { type: "summary", text: "Mệnh đề quan hệ xác định đứng ngay sau danh từ để cho biết ĐÓ LÀ AI / CÁI NÀO. Thiếu mệnh đề này câu sẽ không rõ nghĩa. Không dùng dấu phẩy." },
    {
      type: "table",
      title: "Đại từ quan hệ",
      headers: ["Từ", "Thay cho", "Ví dụ"],
      rows: [
        ["who", "người", "The woman who called you is my aunt."],
        ["which", "vật, con vật", "The phone which I bought is broken."],
        ["that", "người hoặc vật (thay who/which)", "The film that we watched was boring."],
        ["whose", "sở hữu (của ai/cái gì)", "The boy whose bike was stolen is crying."],
        ["where", "nơi chốn", "This is the café where we first met."],
        ["when", "thời gian", "I remember the day when we met."],
      ],
    },
    {
      type: "usage",
      title: "Có thể bỏ who / which / that khi nó là TÂN NGỮ",
      text: "Nếu ngay sau who/which/that là một chủ ngữ khác (I, you, she...), có thể bỏ đại từ quan hệ.",
      examples: [
        { en: "The book (that) you lent me is great.", vi: "Quyển sách bạn cho tôi mượn rất hay." },
        { en: "The people (who) we met were friendly.", vi: "Những người chúng tôi gặp rất thân thiện." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "The girl which sits next to me is Lan.", right: "The girl who sits next to me is Lan.", why: "Chỉ người → who (hoặc that)." },
        { wrong: "This is the house where I was born in.", right: "This is the house where I was born.", why: "where đã gồm nghĩa giới từ in, không thêm in." },
        { wrong: "The man who he helped me is a doctor.", right: "The man who helped me is a doctor.", why: "who đã làm chủ ngữ, không lặp he." },
      ],
    },
  ],
  questions: [
    { id: "dr1", type: "mcq", prompt: "The teacher ___ teaches us maths is very kind.", options: ["which", "who", "whose", "where"], answer: 1, explanation: "Chỉ người, làm chủ ngữ → who." },
    { id: "dr2", type: "mcq", prompt: "This is the restaurant ___ we had dinner last night.", options: ["which", "who", "where", "whose"], answer: 2, explanation: "Nơi chốn → where." },
    { id: "dr3", type: "gap_fill", prompt: "I have a friend ___ father is a pilot.", answers: ["whose"], explanation: "Bố CỦA người bạn → whose." },
    { id: "dr4", type: "mcq", prompt: "The laptop ___ I bought last week is very fast.", options: ["who", "which", "where", "whose"], answer: 1, explanation: "Chỉ vật → which (hoặc that, hoặc bỏ)." },
    {
      id: "dr5", type: "error_id",
      segments: [{ text: "The man " }, { text: "which", underline: true }, { text: " " }, { text: "lives", underline: true }, { text: " next door " }, { text: "is", underline: true }, { text: " a doctor." }],
      answer: 1, correction: "who",
      explanation: "Chỉ người → who.",
    },
    { id: "dr6", type: "transform", prompt: "I met a girl. She speaks five languages.", starter: "I met a girl", answers: ["I met a girl who speaks five languages.", "I met a girl that speaks five languages."], explanation: "Nối bằng who: She → who." },
    { id: "dr7", type: "transform", prompt: "This is the hotel. We stayed there last summer.", starter: "This is the hotel", answers: ["This is the hotel where we stayed last summer.", "This is the hotel which we stayed at last summer.", "This is the hotel that we stayed at last summer."], explanation: "there (nơi chốn) → where." },
    { id: "dr8", type: "gap_fill", prompt: "Do you know the woman ___ is talking to Nam?", answers: ["who", "that"], explanation: "Chỉ người, làm chủ ngữ → who / that." },
    { id: "dr9", type: "mcq", prompt: "Which sentence is correct?", options: ["The cake who she made was delicious.", "The cake she made was delicious.", "The cake where she made was delicious.", "The cake whose she made was delicious."], answer: 1, explanation: "which/that làm tân ngữ có thể bỏ: The cake (that) she made." },
  ],
};

const reportedStatements: TopicContent = {
  slug: "reported-statements",
  intro: "She said (that) she was tired — chuyển lời nói trực tiếp sang gián tiếp.",
  theory: [
    { type: "summary", text: "Câu tường thuật thuật lại lời người khác. Khi động từ tường thuật ở quá khứ (said, told), động từ trong câu được LÙI MỘT THÌ, đồng thời đổi đại từ và từ chỉ thời gian, nơi chốn cho hợp ngữ cảnh." },
    {
      type: "table",
      title: "Lùi thì",
      headers: ["Lời nói trực tiếp", "Câu tường thuật"],
      rows: [
        ["Hiện tại đơn: “I am tired.”", "Quá khứ đơn: She said she was tired."],
        ["Hiện tại tiếp diễn: “I'm working.”", "Quá khứ tiếp diễn: He said he was working."],
        ["Hiện tại hoàn thành: “I have finished.”", "Quá khứ hoàn thành: She said she had finished."],
        ["Quá khứ đơn: “I saw it.”", "Quá khứ hoàn thành: He said he had seen it."],
        ["will: “I will call.”", "would: She said she would call."],
        ["can / may / must", "could / might / had to"],
      ],
    },
    {
      type: "table",
      title: "Đổi từ chỉ thời gian, nơi chốn",
      headers: ["Trực tiếp", "Gián tiếp"],
      rows: [
        ["now", "then"],
        ["today / tonight", "that day / that night"],
        ["yesterday", "the day before / the previous day"],
        ["tomorrow", "the next day / the following day"],
        ["here / this", "there / that"],
        ["ago", "before"],
      ],
    },
    {
      type: "usage",
      title: "say vs tell",
      text: "say (something) — không cần tân ngữ người; tell + người + (that) ...",
      examples: [
        { en: "He said that he was hungry.", vi: "Anh ấy nói rằng anh ấy đói." },
        { en: "He told me that he was hungry.", vi: "Anh ấy bảo tôi rằng anh ấy đói." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She said me that she was busy.", right: "She told me that she was busy.", why: "Có tân ngữ người (me) → dùng told." },
        { wrong: "He said he will come tomorrow.", right: "He said he would come the next day.", why: "will lùi thành would; tomorrow → the next day." },
      ],
    },
  ],
  questions: [
    { id: "rs1", type: "mcq", prompt: "“I am hungry,” said Tom. → Tom said that he ___ hungry.", options: ["is", "was", "has been", "will be"], answer: 1, explanation: "am → was (lùi một thì)." },
    { id: "rs2", type: "mcq", prompt: "She ___ me that she was leaving.", options: ["said", "told", "spoke", "talked"], answer: 1, explanation: "told + tân ngữ người (me)." },
    { id: "rs3", type: "gap_fill", prompt: "“I will help you.” → He said he ___ help me.", answers: ["would"], explanation: "will → would." },
    { id: "rs4", type: "transform", prompt: "“I can swim,” Lan said.", starter: "Lan said", answers: ["Lan said that she could swim.", "Lan said she could swim."], explanation: "can → could; I → she." },
    { id: "rs5", type: "transform", prompt: "“I have finished my report,” he said.", starter: "He said", answers: ["He said that he had finished his report.", "He said he had finished his report."], explanation: "have finished → had finished; my → his." },
    { id: "rs6", type: "mcq", prompt: "“I saw her yesterday.” → He said he had seen her ___.", options: ["yesterday", "the day before", "tomorrow", "today"], answer: 1, explanation: "yesterday → the day before." },
    {
      id: "rs7", type: "error_id",
      segments: [{ text: "She " }, { text: "said", underline: true }, { text: " that she " }, { text: "is", underline: true }, { text: " working " }, { text: "then", underline: true }, { text: "." }],
      answer: 3, correction: "was",
      explanation: "said ở quá khứ → is working lùi thành was working.",
    },
    { id: "rs8", type: "gap_fill", prompt: "“We are watching TV now.” → They said they were watching TV ___.", answers: ["then"], explanation: "now → then." },
    { id: "rs9", type: "transform", prompt: "“I don't like coffee,” Minh said.", starter: "Minh said", answers: ["Minh said that he didn't like coffee.", "Minh said he didn't like coffee.", "Minh said that he did not like coffee.", "Minh said he did not like coffee."], explanation: "don't like → didn't like; I → he." },
  ],
};

const indirectQuestions: TopicContent = {
  slug: "indirect-questions",
  intro: "Could you tell me where the station is? — hỏi lịch sự, đảo về trật tự câu kể.",
  theory: [
    { type: "summary", text: "Câu hỏi gián tiếp lịch sự hơn câu hỏi trực tiếp. Sau phần mở đầu (Could you tell me..., Do you know..., I wonder...), phần câu hỏi trở về TRẬT TỰ CÂU KỂ: chủ ngữ đứng trước động từ, không dùng do/does/did." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Câu hỏi Wh-", parts: [{ t: "Could you tell me / Do you know", role: "other" }, { t: "Wh-word", role: "aux" }, { t: "S", role: "subject" }, { t: "V ...?", role: "verb" }], example: "Do you know what time it is?" },
        { label: "Câu hỏi Yes/No", parts: [{ t: "Could you tell me / I wonder", role: "other" }, { t: "if / whether", role: "aux" }, { t: "S", role: "subject" }, { t: "V ...", role: "verb" }], example: "Could you tell me if the museum is open today?" },
      ],
    },
    {
      type: "compare",
      title: "Trực tiếp → gián tiếp",
      headers: ["Trực tiếp", "Gián tiếp"],
      rows: [
        ["Where is the bank?", "Could you tell me where the bank is?"],
        ["What time does the film start?", "Do you know what time the film starts?"],
        ["Did she call?", "I wonder if she called."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Can you tell me where is the toilet?", right: "Can you tell me where the toilet is?", why: "Trong câu hỏi gián tiếp, chủ ngữ đứng trước động từ." },
        { wrong: "Do you know what time does it open?", right: "Do you know what time it opens?", why: "Bỏ does, động từ chia theo chủ ngữ." },
      ],
    },
  ],
  questions: [
    { id: "iq1", type: "mcq", prompt: "Could you tell me where ___?", options: ["is the post office", "the post office is", "does the post office", "the post office does"], answer: 1, explanation: "Trật tự câu kể: the post office is." },
    { id: "iq2", type: "mcq", prompt: "Do you know what time ___?", options: ["does the bus leave", "the bus leaves", "leaves the bus", "the bus does leave"], answer: 1, explanation: "Bỏ does; leave → leaves theo chủ ngữ the bus." },
    { id: "iq3", type: "gap_fill", prompt: "I wonder ___ she will come to the party.", answers: ["if", "whether"], explanation: "Câu hỏi Yes/No → if / whether." },
    { id: "iq4", type: "transform", prompt: "Where does Lan live?", starter: "Do you know", answers: ["Do you know where Lan lives?"], explanation: "Bỏ does, live → lives." },
    { id: "iq5", type: "transform", prompt: "Is the shop open on Sunday?", starter: "Could you tell me", answers: ["Could you tell me if the shop is open on Sunday?", "Could you tell me whether the shop is open on Sunday?"], explanation: "Yes/No → if; is đứng sau chủ ngữ." },
    {
      id: "iq6", type: "error_id",
      segments: [{ text: "Can you tell me " }, { text: "how much", underline: true }, { text: " " }, { text: "does this cost", underline: true }, { text: "?" }],
      answer: 3, correction: "this costs",
      explanation: "Câu hỏi gián tiếp: S + V → this costs.",
    },
    { id: "iq7", type: "word_order", words: ["know", "do", "you", "is", "who", "she", "?"], answers: ["Do you know who she is?"], explanation: "Do you know + who + she + is?" },
    { id: "iq8", type: "transform", prompt: "Why did he leave early?", starter: "I wonder", answers: ["I wonder why he left early."], explanation: "Bỏ did, leave → left." },
  ],
};

const questionTags: TopicContent = {
  slug: "question-tags",
  intro: "It's hot today, isn't it? — câu hỏi đuôi để xác nhận.",
  theory: [
    { type: "summary", text: "Câu hỏi đuôi gắn vào cuối câu kể để xác nhận thông tin. Câu chính KHẲNG ĐỊNH → đuôi PHỦ ĐỊNH; câu chính PHỦ ĐỊNH → đuôi KHẲNG ĐỊNH. Đuôi dùng trợ động từ của câu chính + đại từ." },
    {
      type: "table",
      title: "Cách tạo đuôi",
      headers: ["Câu chính", "Đuôi"],
      rows: [
        ["She is a doctor,", "isn't she?"],
        ["You aren't busy,", "are you?"],
        ["They live here,", "don't they?"],
        ["He plays tennis,", "doesn't he?"],
        ["You went out,", "didn't you?"],
        ["We have met before,", "haven't we?"],
        ["She can swim,", "can't she?"],
        ["You will come,", "won't you?"],
      ],
    },
    {
      type: "table",
      title: "Trường hợp đặc biệt",
      headers: ["Câu chính", "Đuôi"],
      rows: [
        ["I am right,", "aren't I?"],
        ["Let's go,", "shall we?"],
        ["Open the door,", "will you?"],
        ["Nobody called,", "did they?"],
        ["He never eats meat,", "does he? (never mang nghĩa phủ định)"],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "She likes music, isn't she?", right: "She likes music, doesn't she?", why: "Động từ thường ở hiện tại đơn → mượn does." },
        { wrong: "You never smoke, don't you?", right: "You never smoke, do you?", why: "never đã phủ định → đuôi khẳng định." },
      ],
    },
  ],
  questions: [
    { id: "qt1", type: "mcq", prompt: "It's cold today, ___?", options: ["is it", "isn't it", "doesn't it", "it isn't"], answer: 1, explanation: "Khẳng định với is → isn't it?" },
    { id: "qt2", type: "mcq", prompt: "You don't eat meat, ___?", options: ["do you", "don't you", "are you", "aren't you"], answer: 0, explanation: "Phủ định với don't → do you?" },
    { id: "qt3", type: "gap_fill", prompt: "She went to Hanoi, ___ she?", answers: ["didn't"], explanation: "went (quá khứ đơn, khẳng định) → didn't she?" },
    { id: "qt4", type: "gap_fill", prompt: "They have finished, ___ they?", answers: ["haven't"], explanation: "have finished → haven't they?" },
    { id: "qt5", type: "mcq", prompt: "I'm late, ___?", options: ["am I", "amn't I", "aren't I", "isn't it"], answer: 2, explanation: "Đặc biệt: I am → aren't I?" },
    { id: "qt6", type: "mcq", prompt: "Let's have a break, ___?", options: ["shall we", "will you", "don't we", "let's we"], answer: 0, explanation: "Let's → shall we?" },
    { id: "qt7", type: "gap_fill", prompt: "He can drive, ___ he?", answers: ["can't"], explanation: "can → can't he?" },
    { id: "qt8", type: "mcq", prompt: "Nobody phoned, ___?", options: ["didn't they", "did they", "did he", "didn't he"], answer: 1, explanation: "Nobody mang nghĩa phủ định; đại từ thay nobody là they → did they?" },
    {
      id: "qt9", type: "error_id",
      segments: [{ text: "Your brother " }, { text: "works", underline: true }, { text: " in a bank, " }, { text: "isn't he", underline: true }, { text: "?" }],
      answer: 3, correction: "doesn't he",
      explanation: "works (hiện tại đơn) → doesn't he?",
    },
  ],
};

const unlessInCase: TopicContent = {
  slug: "unless-in-case",
  intro: "unless = if not; as long as = miễn là; in case = phòng khi.",
  theory: [
    { type: "summary", text: "Ba liên từ điều kiện hay gặp: unless (trừ khi = if ... not), as long as / provided that (miễn là, với điều kiện), in case (phòng khi — làm trước để đề phòng). Mệnh đề sau chúng dùng thì hiện tại khi nói về tương lai." },
    {
      type: "usage",
      title: "unless = if ... not",
      examples: [
        { en: "You will miss the bus unless you hurry.", vi: "Bạn sẽ lỡ xe buýt trừ khi bạn nhanh lên." },
        { en: "= You will miss the bus if you don't hurry.", vi: "= Bạn sẽ lỡ xe buýt nếu bạn không nhanh lên." },
      ],
    },
    {
      type: "usage",
      title: "as long as / provided that = miễn là",
      examples: [{ en: "You can borrow my car as long as you drive carefully.", vi: "Bạn có thể mượn xe tôi miễn là bạn lái cẩn thận." }],
    },
    {
      type: "usage",
      title: "in case = phòng khi",
      text: "in case nói lý do làm một việc TRƯỚC để đề phòng; khác if (chỉ làm khi điều kiện xảy ra).",
      examples: [
        { en: "Take an umbrella in case it rains.", vi: "Mang ô theo phòng khi trời mưa." },
        { en: "I'll take an umbrella if it rains.", vi: "Nếu trời mưa tôi sẽ mang ô (chỉ mang khi mưa)." },
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "Unless you don't study, you will fail.", right: "Unless you study, you will fail.", why: "unless đã mang nghĩa phủ định, không thêm don't." },
        { wrong: "Take a jacket in case it will be cold.", right: "Take a jacket in case it is cold.", why: "Sau in case dùng hiện tại, không dùng will." },
      ],
    },
  ],
  questions: [
    { id: "uc1", type: "mcq", prompt: "I won't go ___ you come with me.", options: ["unless", "in case", "as long", "if not"], answer: 0, explanation: "Tôi sẽ không đi trừ khi bạn đi cùng → unless." },
    { id: "uc2", type: "mcq", prompt: "Bring some water ___ you get thirsty.", options: ["unless", "in case", "as long as", "so that not"], answer: 1, explanation: "Mang trước để đề phòng → in case." },
    { id: "uc3", type: "gap_fill", prompt: "You can stay up late as ___ as you finish your homework.", answers: ["long"], explanation: "as long as = miễn là." },
    { id: "uc4", type: "transform", prompt: "If you don't leave now, you'll be late.", starter: "Unless", answers: ["Unless you leave now, you'll be late.", "Unless you leave now, you will be late."], explanation: "if ... don't → unless + khẳng định." },
    {
      id: "uc5", type: "error_id",
      segments: [{ text: "Unless " }, { text: "you don't", underline: true }, { text: " " }, { text: "practise", underline: true }, { text: ", you " }, { text: "won't improve", underline: true }, { text: "." }],
      answer: 1, correction: "you",
      explanation: "unless đã phủ định → Unless you practise.",
    },
    { id: "uc6", type: "verb_form", prompt: "Write down my number in case you ___ lost.", base: "get", answers: ["get"], explanation: "Sau in case dùng hiện tại đơn: get." },
    { id: "uc7", type: "mcq", prompt: "You can use my laptop ___ you don't break it.", options: ["unless", "in case", "provided that", "otherwise"], answer: 2, explanation: "miễn là → provided that." },
    { id: "uc8", type: "mcq", prompt: "We'll play football tomorrow unless it ___.", options: ["rains", "will rain", "doesn't rain", "rained"], answer: 0, explanation: "unless + hiện tại đơn khẳng định: rains." },
  ],
};

const wishPresent: TopicContent = {
  slug: "wish-present",
  intro: "I wish I had more time — ước điều trái với hiện tại.",
  theory: [
    { type: "summary", text: "wish + quá khứ đơn diễn tả mong ước trái với thực tế ở HIỆN TẠI. Động từ lùi về quá khứ dù ý nghĩa là bây giờ. Với to be, dùng were cho mọi ngôi (văn nói có thể dùng was)." },
    {
      type: "formula",
      title: "Công thức",
      rows: [
        { label: "Ước hiện tại", parts: [{ t: "S", role: "subject" }, { t: "wish", role: "aux" }, { t: "S + V2/V-ed", role: "verb" }], example: "I wish I lived near the sea." },
        { label: "Với to be", parts: [{ t: "S", role: "subject" }, { t: "wish", role: "aux" }, { t: "S + were", role: "verb" }], example: "I wish I were taller." },
        { label: "Với khả năng", parts: [{ t: "S", role: "subject" }, { t: "wish", role: "aux" }, { t: "S + could + V", role: "verb" }], example: "I wish I could speak Japanese." },
      ],
      note: "If only ... mang nghĩa giống wish nhưng mạnh hơn: If only I had a car!",
    },
    {
      type: "compare",
      title: "Thực tế → mong ước",
      headers: ["Thực tế", "Mong ước"],
      rows: [
        ["I don't have a car.", "I wish I had a car."],
        ["I am not rich.", "I wish I were rich."],
        ["I can't sing.", "I wish I could sing."],
        ["It's raining.", "I wish it weren't raining."],
      ],
    },
    {
      type: "mistakes",
      items: [
        { wrong: "I wish I have a bigger house.", right: "I wish I had a bigger house.", why: "wish (hiện tại) + quá khứ đơn." },
        { wrong: "I wish I can fly.", right: "I wish I could fly.", why: "can → could." },
      ],
    },
  ],
  questions: [
    { id: "wp1", type: "mcq", prompt: "I wish I ___ more free time.", options: ["have", "had", "will have", "having"], answer: 1, explanation: "wish + quá khứ đơn: had." },
    { id: "wp2", type: "verb_form", prompt: "I wish I ___ taller.", base: "be", answers: ["were", "was"], explanation: "to be sau wish → were (văn nói: was)." },
    { id: "wp3", type: "gap_fill", prompt: "I can't swim. I wish I ___ swim.", answers: ["could"], explanation: "can → could." },
    { id: "wp4", type: "transform", prompt: "I don't live near my school.", starter: "I wish", answers: ["I wish I lived near my school."], explanation: "don't live → lived." },
    { id: "wp5", type: "transform", prompt: "My brother isn't here.", starter: "I wish", answers: ["I wish my brother were here.", "I wish my brother was here."], explanation: "isn't → were." },
    {
      id: "wp6", type: "error_id",
      segments: [{ text: "She " }, { text: "wishes", underline: true }, { text: " she " }, { text: "knows", underline: true }, { text: " the " }, { text: "answer", underline: true }, { text: "." }],
      answer: 3, correction: "knew",
      explanation: "wish + quá khứ đơn: knew.",
    },
    { id: "wp7", type: "mcq", prompt: "It's so hot. I wish it ___ cooler.", options: ["is", "were", "be", "will be"], answer: 1, explanation: "Ước trái hiện tại với be → were." },
    { id: "wp8", type: "mcq", prompt: "If only I ___ how to fix this!", options: ["know", "knew", "known", "am knowing"], answer: 1, explanation: "If only + quá khứ đơn: knew." },
  ],
};

export const B1_CLAUSE_TOPICS: TopicContent[] = [definingRelative, reportedStatements, indirectQuestions, questionTags, unlessInCase, wishPresent];
