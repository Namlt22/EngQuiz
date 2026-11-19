/**
 * Tình huống nhập vai cho phần Trò chuyện cùng AI. EngQuiz tự soạn.
 *  - `brief` là mô tả bằng tiếng Anh gửi cho model (vai của AI, bối cảnh, việc người học cần làm).
 *  - `opening` là câu mở đầu của AI, hiện ngay khi vào cuộc (không tốn lượt AI).
 *  - Câu tiếng Trung viết liền (không tách từ) vì chỉ để hiển thị; pinyin ghi sẵn.
 * Test: src/content/chat-scenarios.test.ts.
 */
import type { CourseCode } from "@/lib/course";

export interface ChatScenario {
  id: string;
  course: CourseCode;
  /** CEFR (tiếng Anh) hoặc "HSK n" (tiếng Trung) — phải thuộc CHAT_LEVELS[course]. */
  level: string;
  title: string;
  emoji: string;
  /** Vai của người học (tiếng Việt). */
  learnerRole: string;
  /** Mục tiêu cần đạt trong cuộc (tiếng Việt). */
  goal: string;
  /** Bối cảnh và vai của AI, gửi cho model (tiếng Anh). */
  brief: string;
  opening: { text: string; pinyin?: string; vi: string };
}

export const CHAT_SCENARIOS: readonly ChatScenario[] = [
  // ── Tiếng Anh ──
  {
    id: "en-cafe",
    course: "en",
    level: "A1",
    title: "Gọi đồ uống ở quán cà phê",
    emoji: "☕",
    learnerRole: "Khách",
    goal: "Gọi một đồ uống và một món bánh, hỏi giá, trả tiền.",
    brief: "You are a friendly barista in a small coffee shop. The learner is a customer. Take their order (drinks: coffee, tea, juice; food: muffin, sandwich, cake), tell them prices in dollars, and ask how they want to pay.",
    opening: { text: "Hi there! Welcome to Sunny Café. What can I get for you today?", vi: "Chào bạn! Chào mừng đến Sunny Café. Hôm nay bạn muốn dùng gì?" },
  },
  {
    id: "en-hotel",
    course: "en",
    level: "A2",
    title: "Nhận phòng khách sạn",
    emoji: "🏨",
    learnerRole: "Khách đã đặt phòng",
    goal: "Báo tên đặt phòng, hỏi giờ ăn sáng và mật khẩu Wi-Fi.",
    brief: "You are a hotel receptionist. The learner has a reservation and wants to check in. Ask for their name and passport, confirm the room (a double room for two nights), and answer questions about breakfast (7 to 10 a.m.) and Wi-Fi (password on the key card).",
    opening: { text: "Good evening, welcome to the Riverside Hotel. Do you have a reservation with us?", vi: "Chào buổi tối, chào mừng đến khách sạn Riverside. Anh/chị có đặt phòng trước không ạ?" },
  },
  {
    id: "en-directions",
    course: "en",
    level: "A2",
    title: "Hỏi đường đến ga tàu",
    emoji: "🗺️",
    learnerRole: "Khách du lịch bị lạc",
    goal: "Hỏi đường đến ga tàu, hỏi mất bao lâu và nên đi bộ hay đi xe buýt.",
    brief: "You are a local person on a city street. The learner is a lost tourist looking for the train station. Give simple directions (go straight, turn left at the bank, it is next to the park), say it takes about 15 minutes on foot or 5 minutes by bus number 12.",
    opening: { text: "You look a bit lost. Can I help you find something?", vi: "Trông bạn có vẻ bị lạc. Tôi giúp bạn tìm gì được không?" },
  },
  {
    id: "en-doctor",
    course: "en",
    level: "B1",
    title: "Đi khám bác sĩ",
    emoji: "🩺",
    learnerRole: "Bệnh nhân",
    goal: "Mô tả triệu chứng, nói đã bị bao lâu, hỏi cách uống thuốc.",
    brief: "You are a family doctor. The learner is a patient who feels unwell. Ask about their symptoms, how long they have had them and whether they have a fever. Give a simple diagnosis (a bad cold), advice (rest, drink water) and explain how to take the medicine (twice a day after meals).",
    opening: { text: "Hello, please have a seat. What seems to be the problem today?", vi: "Chào anh/chị, mời ngồi. Hôm nay anh/chị thấy không khoẻ ở đâu?" },
  },
  {
    id: "en-interview",
    course: "en",
    level: "B1",
    title: "Phỏng vấn xin việc",
    emoji: "💼",
    learnerRole: "Ứng viên",
    goal: "Giới thiệu bản thân, nói về kinh nghiệm và điểm mạnh, hỏi lại một câu về công việc.",
    brief: "You are a friendly HR manager interviewing the learner for a customer service job at an international company. Ask about their background, experience, strengths and why they want the job, one question at a time. At the end, invite them to ask a question.",
    opening: { text: "Thanks for coming in today. Could you start by telling me a little about yourself?", vi: "Cảm ơn bạn đã đến hôm nay. Bạn có thể bắt đầu bằng việc giới thiệu một chút về bản thân không?" },
  },
  {
    id: "en-return",
    course: "en",
    level: "B1",
    title: "Đổi trả hàng bị lỗi",
    emoji: "🛍️",
    learnerRole: "Khách mua phải hàng lỗi",
    goal: "Giải thích vấn đề của sản phẩm và đề nghị đổi hoặc hoàn tiền.",
    brief: "You are a shop assistant at an electronics store. The learner bought headphones last week and one side does not work. Ask for the receipt and what the problem is, then offer an exchange or a refund. Be polite but follow the store policy: returns within 30 days with a receipt.",
    opening: { text: "Hi, how can I help you today?", vi: "Chào anh/chị, tôi có thể giúp gì ạ?" },
  },
  {
    id: "en-flat",
    course: "en",
    level: "B2",
    title: "Thuê căn hộ",
    emoji: "🏠",
    learnerRole: "Người đi thuê nhà",
    goal: "Hỏi về tiền thuê, tiền điện nước, hợp đồng và thương lượng giá.",
    brief: "You are a landlord showing a one-bedroom flat. Rent is 600 dollars a month, bills are not included, the contract is for 12 months and you want one month's deposit. You can lower the rent slightly if the learner signs a longer contract, but only if they negotiate.",
    opening: { text: "So this is the flat. It gets lots of light in the morning. What would you like to know?", vi: "Đây là căn hộ. Buổi sáng rất nhiều ánh sáng. Bạn muốn hỏi gì?" },
  },
  {
    id: "en-deadline",
    course: "en",
    level: "B2",
    title: "Xin lùi hạn công việc",
    emoji: "📅",
    learnerRole: "Nhân viên",
    goal: "Giải thích vì sao trễ hạn, đề xuất hạn mới và cách xử lý.",
    brief: "You are the learner's manager. A report is due tomorrow, and the learner needs more time. Ask why, ask what is already done, and push back a little before agreeing to a realistic new deadline if they give a clear plan.",
    opening: { text: "You wanted to talk to me? Is this about the quarterly report?", vi: "Bạn muốn gặp tôi à? Có phải về bản báo cáo quý không?" },
  },

  // ── Tiếng Trung ──
  {
    id: "zh-order-food",
    course: "zh",
    level: "HSK 1",
    title: "Gọi món ở nhà hàng",
    emoji: "🥟",
    learnerRole: "Khách",
    goal: "Gọi một món ăn và một đồ uống, hỏi giá.",
    brief: "You are a waiter in a small Chinese restaurant. The learner is a customer. Dishes: 饺子 (20 yuan), 米饭 (3 yuan), 面条 (15 yuan); drinks: 茶 (no charge — say 茶不要钱), 可乐 (5 yuan). Take the order and tell the total.",
    opening: { text: "你好！请问你想吃什么？", pinyin: "Nǐ hǎo! Qǐngwèn nǐ xiǎng chī shénme?", vi: "Chào bạn! Xin hỏi bạn muốn ăn gì?" },
  },
  {
    id: "zh-shopping",
    course: "zh",
    level: "HSK 1",
    title: "Mua hoa quả",
    emoji: "🍎",
    learnerRole: "Người mua",
    goal: "Hỏi giá, mua hai loại hoa quả và trả tiền.",
    brief: "You are a fruit seller at a market. Apples are 8 yuan a jin, bananas 5 yuan a jin, watermelon 20 yuan each. Answer price questions, help the learner buy, say the total.",
    opening: { text: "你好，你要买什么？苹果很好吃！", pinyin: "Nǐ hǎo, nǐ yào mǎi shénme? Píngguǒ hěn hǎochī!", vi: "Chào bạn, bạn muốn mua gì? Táo ngon lắm!" },
  },
  {
    id: "zh-directions",
    course: "zh",
    level: "HSK 2",
    title: "Hỏi đường",
    emoji: "🚇",
    learnerRole: "Người hỏi đường",
    goal: "Hỏi đường đến ga tàu điện ngầm, hỏi xa không và đi mất bao lâu.",
    brief: "You are a friendly passer-by. The learner asks how to get to the subway station. It is not far: go straight, turn right at the second intersection, it is next to a supermarket, about 10 minutes on foot.",
    opening: { text: "你好！你在找什么地方吗？", pinyin: "Nǐ hǎo! Nǐ zài zhǎo shénme dìfang ma?", vi: "Chào bạn! Bạn đang tìm chỗ nào à?" },
  },
  {
    id: "zh-doctor",
    course: "zh",
    level: "HSK 2",
    title: "Đi khám bệnh",
    emoji: "🏥",
    learnerRole: "Người bệnh",
    goal: "Nói chỗ đau, từ khi nào, và hỏi cần uống thuốc thế nào.",
    brief: "You are a doctor. The learner feels unwell. Ask where it hurts, since when, and whether they have a fever. Diagnose a cold, tell them to rest, drink more water and take the medicine three times a day.",
    opening: { text: "你好，你哪儿不舒服？", pinyin: "Nǐ hǎo, nǐ nǎr bù shūfu?", vi: "Chào bạn, bạn thấy khó chịu ở đâu?" },
  },
  {
    id: "zh-rent",
    course: "zh",
    level: "HSK 3",
    title: "Thuê phòng",
    emoji: "🔑",
    learnerRole: "Người thuê",
    goal: "Hỏi tiền thuê, có điều hoà và máy giặt không, và hẹn xem phòng.",
    brief: "You are a landlord renting a room. Rent is 2500 yuan a month, it has air conditioning and a washing machine, it is 5 minutes from the subway. You can show the room tomorrow afternoon.",
    opening: { text: "你好，你是来看房子的吗？", pinyin: "Nǐ hǎo, nǐ shì lái kàn fángzi de ma?", vi: "Chào bạn, bạn đến xem nhà phải không?" },
  },
  {
    id: "zh-interview",
    course: "zh",
    level: "HSK 4",
    title: "Phỏng vấn xin việc",
    emoji: "💼",
    learnerRole: "Ứng viên",
    goal: "Giới thiệu bản thân, kinh nghiệm và lý do muốn làm việc ở công ty.",
    brief: "You are an HR manager at a trading company interviewing the learner for an assistant position that needs Chinese and Vietnamese. Ask about their background, experience, strengths and why they want the job, one question at a time.",
    opening: { text: "你好，请先简单地介绍一下你自己。", pinyin: "Nǐ hǎo, qǐng xiān jiǎndān de jièshào yíxià nǐ zìjǐ.", vi: "Chào bạn, mời bạn giới thiệu ngắn gọn về bản thân." },
  },
];

const BY_ID = new Map(CHAT_SCENARIOS.map((s) => [s.id, s]));
export const getChatScenario = (id: string) => BY_ID.get(id);
export const scenariosFor = (course: CourseCode) => CHAT_SCENARIOS.filter((s) => s.course === course);

/** Câu mở đầu của trò chuyện tự do (không tốn lượt AI). */
export const FREE_CHAT_OPENING: Record<CourseCode, { text: string; pinyin?: string; vi: string }> = {
  en: { text: "Hi! I'm your English chat partner. How was your day today?", vi: "Chào bạn! Mình là bạn trò chuyện tiếng Anh. Hôm nay của bạn thế nào?" },
  zh: { text: "你好！我们用中文聊聊天吧。你今天怎么样？", pinyin: "Nǐ hǎo! Wǒmen yòng Zhōngwén liáoliao tiān ba. Nǐ jīntiān zěnmeyàng?", vi: "Chào bạn! Mình trò chuyện bằng tiếng Trung nhé. Hôm nay bạn thế nào?" },
};
