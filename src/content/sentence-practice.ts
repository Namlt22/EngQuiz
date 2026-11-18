/**
 * Luyện đặt câu (gồm đặt câu hỏi). EngQuiz tự soạn. Chấm bằng src/core/sentence-practice.ts.
 *  - `given`: câu / từ gợi ý; phần trong [ngoặc vuông] là phần cần hỏi tới.
 *  - `answers`: mọi cách nói đúng thường gặp (chấm bỏ qua hoa thường, dấu câu; dạng rút gọn = đầy đủ).
 * Test: src/content/sentence-practice.test.ts.
 */
import type { CourseCode } from "@/lib/course";

export type SentenceTaskKind = "question" | "build" | "transform";

export interface SentenceTask {
  id: string;
  kind: SentenceTaskKind;
  /** Yêu cầu ngắn (tiếng Việt). */
  prompt: string;
  given: string;
  answers: string[];
}

export interface SentenceSet {
  id: string;
  course: CourseCode;
  level: string;
  title: string;
  tasks: SentenceTask[];
}

const q = (id: string, prompt: string, given: string, answers: string[]): SentenceTask => ({ id, kind: "question", prompt, given, answers });
const b = (id: string, prompt: string, given: string, answers: string[]): SentenceTask => ({ id, kind: "build", prompt, given, answers });
const t = (id: string, prompt: string, given: string, answers: string[]): SentenceTask => ({ id, kind: "transform", prompt, given, answers });

export const SENTENCE_SETS: readonly SentenceSet[] = [
  /* ---------------- Tiếng Anh ---------------- */
  {
    id: "en-yes-no",
    course: "en",
    level: "A1",
    title: "Câu hỏi Yes / No",
    tasks: [
      q("sp-yn-1", "Đặt câu hỏi Yes/No", "She is a teacher.", ["Is she a teacher?"]),
      q("sp-yn-2", "Đặt câu hỏi Yes/No", "They are from Da Nang.", ["Are they from Da Nang?"]),
      q("sp-yn-3", "Đặt câu hỏi Yes/No", "He likes football.", ["Does he like football?"]),
      q("sp-yn-4", "Đặt câu hỏi Yes/No", "You speak English.", ["Do you speak English?"]),
      q("sp-yn-5", "Đặt câu hỏi Yes/No", "The shop opens at eight.", ["Does the shop open at eight?"]),
      q("sp-yn-6", "Đặt câu hỏi Yes/No", "She can swim.", ["Can she swim?"]),
      q("sp-yn-7", "Đặt câu hỏi Yes/No", "There is a bank near here.", ["Is there a bank near here?"]),
      q("sp-yn-8", "Đặt câu hỏi Yes/No", "Your parents live in Hue.", ["Do your parents live in Hue?"]),
    ],
  },
  {
    id: "en-wh-basic",
    course: "en",
    level: "A1",
    title: "Câu hỏi What, Where, When, Who",
    tasks: [
      q("sp-wh-1", "Hỏi về phần trong ngoặc", "She lives in [Hue].", ["Where does she live?"]),
      q("sp-wh-2", "Hỏi về phần trong ngoặc", "My name is [Lan].", ["What is your name?"]),
      q("sp-wh-3", "Hỏi về phần trong ngoặc", "Class starts at [seven o'clock].", ["When does class start?", "What time does class start?"]),
      q("sp-wh-4", "Hỏi về phần trong ngoặc", "[My brother] cooks dinner.", ["Who cooks dinner?"]),
      q("sp-wh-5", "Hỏi về phần trong ngoặc", "He works [in a bank].", ["Where does he work?"]),
      q("sp-wh-6", "Hỏi về phần trong ngoặc", "They play [badminton] after school.", ["What do they play after school?"]),
      q("sp-wh-7", "Hỏi về phần trong ngoặc", "I get up [at six].", ["When do you get up?", "What time do you get up?"]),
      q("sp-wh-8", "Hỏi về phần trong ngoặc", "She is [a nurse].", ["What does she do?", "What is her job?"]),
    ],
  },
  {
    id: "en-past",
    course: "en",
    level: "A2",
    title: "Hỏi về quá khứ",
    tasks: [
      q("sp-pa-1", "Đặt câu hỏi Yes/No", "You went to the cinema yesterday.", ["Did you go to the cinema yesterday?"]),
      q("sp-pa-2", "Hỏi về phần trong ngoặc", "She visited [Hoi An] last summer.", ["Where did she visit last summer?", "Where did she go last summer?"]),
      q("sp-pa-3", "Hỏi về phần trong ngoặc", "We arrived [at nine].", ["When did you arrive?", "What time did you arrive?"]),
      q("sp-pa-4", "Hỏi về phần trong ngoặc", "He bought [a new phone].", ["What did he buy?"]),
      q("sp-pa-5", "Đặt câu hỏi Yes/No", "It was cold last night.", ["Was it cold last night?"]),
      q("sp-pa-6", "Hỏi về phần trong ngoặc", "They were tired [because they worked late].", ["Why were they tired?"]),
      q("sp-pa-7", "Hỏi về phần trong ngoặc", "[Minh] called you this morning.", ["Who called me this morning?", "Who called you this morning?"]),
      q("sp-pa-8", "Hỏi về phần trong ngoặc", "The trip took [three hours].", ["How long did the trip take?"]),
    ],
  },
  {
    id: "en-build-a2",
    course: "en",
    level: "A2",
    title: "Đặt câu với từ cho sẵn",
    tasks: [
      b("sp-bd-1", "Viết câu: Tôi thường đi làm bằng xe buýt.", "usually / go to work / bus", ["I usually go to work by bus."]),
      b("sp-bd-2", "Viết câu: Cô ấy chưa bao giờ ăn phở.", "never / eat / pho", ["She has never eaten pho.", "She never eats pho."]),
      b("sp-bd-3", "Viết câu: Hôm nay trời nóng hơn hôm qua.", "hotter / than / yesterday", ["It is hotter than yesterday.", "Today is hotter than yesterday.", "It is hotter today than yesterday."]),
      b("sp-bd-4", "Viết câu: Tôi đang học tiếng Anh.", "learn / English / now", ["I am learning English now.", "I am learning English."]),
      b("sp-bd-5", "Viết câu: Chúng tôi sẽ đến thăm bà vào Chủ nhật.", "visit / grandmother / Sunday", ["We will visit our grandmother on Sunday.", "We are going to visit our grandmother on Sunday.", "We will visit grandmother on Sunday."]),
      b("sp-bd-6", "Viết câu: Bạn có thể giúp tôi không?", "can / help", ["Can you help me?", "Could you help me?"]),
      b("sp-bd-7", "Viết câu: Anh ấy quá mệt để làm việc.", "too / tired / work", ["He is too tired to work."]),
      b("sp-bd-8", "Viết câu: Tôi thích đọc sách hơn xem TV.", "prefer / reading / watching TV", ["I prefer reading to watching TV.", "I prefer reading books to watching TV."]),
    ],
  },
  {
    id: "en-how",
    course: "en",
    level: "B1",
    title: "Câu hỏi How much, How long, How often",
    tasks: [
      q("sp-hw-1", "Hỏi về phần trong ngoặc", "This jacket costs [500,000 dong].", ["How much does this jacket cost?", "How much is this jacket?"]),
      q("sp-hw-2", "Hỏi về phần trong ngoặc", "She has lived here [for ten years].", ["How long has she lived here?"]),
      q("sp-hw-3", "Hỏi về phần trong ngoặc", "I go to the gym [three times a week].", ["How often do you go to the gym?"]),
      q("sp-hw-4", "Hỏi về phần trong ngoặc", "The station is [two kilometres] from here.", ["How far is the station from here?", "How far is the station?"]),
      q("sp-hw-5", "Hỏi về phần trong ngoặc", "There are [thirty] students in my class.", ["How many students are there in your class?"]),
      q("sp-hw-6", "Hỏi về phần trong ngoặc", "He goes to work [by motorbike].", ["How does he go to work?", "How does he get to work?"]),
      q("sp-hw-7", "Hỏi về phần trong ngoặc", "My brother is [twenty-five].", ["How old is your brother?"]),
      q("sp-hw-8", "Hỏi về phần trong ngoặc", "I have been waiting [for an hour].", ["How long have you been waiting?"]),
    ],
  },
  {
    id: "en-indirect",
    course: "en",
    level: "B1",
    title: "Câu hỏi gián tiếp, lịch sự",
    tasks: [
      t("sp-in-1", "Viết lại lịch sự, bắt đầu bằng: Could you tell me", "Where is the station?", ["Could you tell me where the station is?"]),
      t("sp-in-2", "Viết lại lịch sự, bắt đầu bằng: Do you know", "What time does the bank open?", ["Do you know what time the bank opens?"]),
      t("sp-in-3", "Viết lại lịch sự, bắt đầu bằng: Could you tell me", "How much does this cost?", ["Could you tell me how much this costs?"]),
      t("sp-in-4", "Viết lại lịch sự, bắt đầu bằng: I wonder", "Why is he late?", ["I wonder why he is late."]),
      t("sp-in-5", "Viết lại lịch sự, bắt đầu bằng: Do you know", "Is the museum open today?", ["Do you know if the museum is open today?", "Do you know whether the museum is open today?"]),
      t("sp-in-6", "Viết lại lịch sự, bắt đầu bằng: Could you tell me", "Where did you buy that bag?", ["Could you tell me where you bought that bag?"]),
      t("sp-in-7", "Viết lại lịch sự, bắt đầu bằng: Can you tell me", "Who is the manager?", ["Can you tell me who the manager is?"]),
      t("sp-in-8", "Viết lại lịch sự, bắt đầu bằng: I'd like to know", "When will the meeting start?", ["I'd like to know when the meeting will start."]),
    ],
  },
  {
    id: "en-tags",
    course: "en",
    level: "B2",
    title: "Câu hỏi đuôi",
    tasks: [
      t("sp-tg-1", "Thêm câu hỏi đuôi", "You are a student", ["You are a student, aren't you?"]),
      t("sp-tg-2", "Thêm câu hỏi đuôi", "She doesn't eat meat", ["She doesn't eat meat, does she?"]),
      t("sp-tg-3", "Thêm câu hỏi đuôi", "They have finished the report", ["They have finished the report, haven't they?"]),
      t("sp-tg-4", "Thêm câu hỏi đuôi", "He can't drive", ["He can't drive, can he?"]),
      t("sp-tg-5", "Thêm câu hỏi đuôi", "It was a great trip", ["It was a great trip, wasn't it?"]),
      t("sp-tg-6", "Thêm câu hỏi đuôi", "You will call me", ["You will call me, won't you?"]),
      t("sp-tg-7", "Thêm câu hỏi đuôi", "Let's go to the beach", ["Let's go to the beach, shall we?"]),
      t("sp-tg-8", "Thêm câu hỏi đuôi", "I'm late", ["I'm late, aren't I?"]),
    ],
  },

  /* ---------------- Tiếng Trung ---------------- */
  {
    id: "zh-ma",
    course: "zh",
    level: "HSK 1",
    title: "Câu hỏi với 吗",
    tasks: [
      q("sp-ma-1", "Đặt câu hỏi với 吗", "他是老师。", ["他是老师吗？"]),
      q("sp-ma-2", "Đặt câu hỏi với 吗", "你喜欢喝茶。", ["你喜欢喝茶吗？"]),
      q("sp-ma-3", "Đặt câu hỏi với 吗", "她会说汉语。", ["她会说汉语吗？"]),
      q("sp-ma-4", "Đặt câu hỏi với 吗", "你有哥哥。", ["你有哥哥吗？"]),
      q("sp-ma-5", "Đặt câu hỏi với 吗", "今天很冷。", ["今天很冷吗？"]),
      q("sp-ma-6", "Đặt câu hỏi với 吗", "你是越南人。", ["你是越南人吗？"]),
      q("sp-ma-7", "Đặt câu hỏi với 吗", "他们在学校。", ["他们在学校吗？"]),
      q("sp-ma-8", "Đặt câu hỏi với 吗", "你想去北京。", ["你想去北京吗？"]),
    ],
  },
  {
    id: "zh-wh",
    course: "zh",
    level: "HSK 1",
    title: "什么, 哪儿, 谁, 几",
    tasks: [
      q("sp-zw-1", "Hỏi về phần trong ngoặc", "我叫[兰]。", ["你叫什么名字？", "你叫什么？"]),
      q("sp-zw-2", "Hỏi về phần trong ngoặc", "他在[医院]工作。", ["他在哪儿工作？", "他在哪里工作？"]),
      q("sp-zw-3", "Hỏi về phần trong ngoặc", "[王老师]是我的老师。", ["谁是你的老师？"]),
      q("sp-zw-4", "Hỏi về phần trong ngoặc", "我家有[五]口人。", ["你家有几口人？"]),
      q("sp-zw-5", "Hỏi về phần trong ngoặc", "我想喝[咖啡]。", ["你想喝什么？"]),
      q("sp-zw-6", "Hỏi về phần trong ngoặc", "现在[三]点。", ["现在几点？"]),
      q("sp-zw-7", "Hỏi về phần trong ngoặc", "她住在[北京]。", ["她住在哪儿？", "她住在哪里？"]),
      q("sp-zw-8", "Hỏi về phần trong ngoặc", "这是[我的]书。", ["这是谁的书？"]),
    ],
  },
  {
    id: "zh-how-why",
    course: "zh",
    level: "HSK 2",
    title: "怎么, 为什么, 多少",
    tasks: [
      q("sp-zh-1", "Hỏi về phần trong ngoặc", "我[坐地铁]去公司。", ["你怎么去公司？"]),
      q("sp-zh-2", "Hỏi về phần trong ngoặc", "这件衣服[两百]块。", ["这件衣服多少钱？"]),
      q("sp-zh-3", "Hỏi về phần trong ngoặc", "他没来，[因为他生病了]。", ["他为什么没来？"]),
      q("sp-zh-4", "Hỏi về phần trong ngoặc", "我们班有[三十]个学生。", ["你们班有多少个学生？", "你们班有多少学生？"]),
      q("sp-zh-5", "Hỏi về phần trong ngoặc", "这个字[这样]写。", ["这个字怎么写？"]),
      q("sp-zh-6", "Hỏi về phần trong ngoặc", "我学汉语，[因为我想去中国]。", ["你为什么学汉语？"]),
      q("sp-zh-7", "Hỏi về phần trong ngoặc", "我[明天]去北京。", ["你什么时候去北京？"]),
      q("sp-zh-8", "Hỏi về phần trong ngoặc", "我的电话号码是[1395]。", ["你的电话号码是多少？"]),
    ],
  },
  {
    id: "zh-haishi",
    course: "zh",
    level: "HSK 2",
    title: "还是, 呢, 吧, câu hỏi chính phản",
    tasks: [
      t("sp-hs-1", "Hỏi lựa chọn với 还是", "喝茶 / 喝咖啡", ["你喝茶还是喝咖啡？", "你喝茶还是咖啡？"]),
      t("sp-hs-2", "Hỏi lựa chọn với 还是", "今天去 / 明天去", ["你今天去还是明天去？"]),
      t("sp-hs-3", "Hỏi ngược lại với 呢", "我是学生。(hỏi lại bạn)", ["你呢？"]),
      t("sp-hs-4", "Đổi sang câu hỏi chính phản", "你是中国人吗？", ["你是不是中国人？"]),
      t("sp-hs-5", "Đổi sang câu hỏi chính phản", "你喜欢吃饺子吗？", ["你喜欢不喜欢吃饺子？", "你喜不喜欢吃饺子？"]),
      t("sp-hs-6", "Đổi sang câu hỏi chính phản", "他有手机吗？", ["他有没有手机？"]),
      t("sp-hs-7", "Đoán ý, hỏi lại với 吧", "Bạn đoán người kia là người Việt Nam", ["你是越南人吧？"]),
      t("sp-hs-8", "Đổi sang câu hỏi chính phản", "明天你去吗？", ["明天你去不去？"]),
    ],
  },
  {
    id: "zh-ba-bei",
    course: "zh",
    level: "HSK 3",
    title: "Đặt câu với 把 và 被",
    tasks: [
      b("sp-bb-1", "Viết câu với 把: Tôi làm xong bài tập rồi.", "把 / 作业 / 写完", ["我把作业写完了。"]),
      b("sp-bb-2", "Viết câu với 把: Mẹ đặt món ăn lên bàn.", "把 / 菜 / 放在 / 桌子上", ["妈妈把菜放在桌子上。", "妈妈把菜放在桌子上了。"]),
      b("sp-bb-3", "Viết câu với 被: Bánh bị em trai ăn hết rồi.", "被 / 蛋糕 / 弟弟 / 吃完", ["蛋糕被弟弟吃完了。"]),
      b("sp-bb-4", "Viết câu với 把: Làm ơn đóng cửa lại.", "请 / 把 / 门 / 关上", ["请把门关上。"]),
      b("sp-bb-5", "Viết câu với 被: Xe đạp của tôi bị người ta lấy mất.", "被 / 自行车 / 骑走", ["我的自行车被人骑走了。", "我的自行车被骑走了。"]),
      b("sp-bb-6", "Viết câu với 把: Tôi tặng quyển sách này cho bạn.", "把 / 这本书 / 送给", ["我把这本书送给你。"]),
      b("sp-bb-7", "Đổi sang câu 被", "弟弟把杯子打破了。", ["杯子被弟弟打破了。"]),
      b("sp-bb-8", "Đổi sang câu 把", "我的手机被他拿走了。", ["他把我的手机拿走了。"]),
    ],
  },
];

const BY_ID = new Map(SENTENCE_SETS.map((s) => [s.id, s]));
export const getSentenceSet = (id: string) => BY_ID.get(id);
export const sentenceSetsFor = (course: CourseCode) => SENTENCE_SETS.filter((s) => s.course === course);
