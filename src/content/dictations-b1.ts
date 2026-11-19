/**
 * Bài nghe & chép cho các chủ điểm B1 (mỗi chủ điểm một bài, câu dùng đúng cấu trúc),
 * cùng vài truyện ngắn và hội thoại B1. Bộ câu này cũng là bộ "Đọc theo câu mẫu" ở trang Luyện nói.
 */
import type { DictationExercise, DictationKind, LevelCode } from "./types";

type Sentences = [en: string, vi: string][];

function make(id: string, kind: DictationKind, level: LevelCode, title: string, description: string, rate: number, sentences: Sentences, topicSlug?: string): DictationExercise {
  return { id, title, level, kind, description, rate, ...(topicSlug ? { topicSlug } : {}), sentences: sentences.map(([text, vi]) => ({ text, vi })) };
}

const grammar = (slug: string, title: string, description: string, sentences: Sentences) => make(slug, "grammar", "B1", title, description, 0.9, sentences, slug);

export const DICTATIONS_B1: DictationExercise[] = [
  grammar("present-perfect-vs-past", "Đã từng và hôm qua", "Nghe phân biệt have + V3 và V2.", [
    ["Have you ever been to Hoi An?", "Bạn đã từng đến Hội An chưa?"],
    ["Yes, I went there last summer.", "Rồi, tôi đến đó hè năm ngoái."],
    ["I have lived in this city since 2018.", "Tôi sống ở thành phố này từ năm 2018."],
    ["She lost her phone on the bus yesterday.", "Hôm qua cô ấy làm mất điện thoại trên xe buýt."],
    ["We haven't seen that film yet.", "Chúng tôi chưa xem bộ phim đó."],
  ]),
  grammar("present-perfect-continuous", "Bao lâu rồi?", "have / has been + V-ing — chú ý từ been đọc lướt.", [
    ["I have been waiting for an hour.", "Tôi đã đợi một tiếng rồi."],
    ["It has been raining since this morning.", "Trời mưa từ sáng đến giờ."],
    ["How long have you been learning English?", "Bạn học tiếng Anh bao lâu rồi?"],
    ["She's been working too hard lately.", "Dạo này cô ấy làm việc quá sức."],
    ["They have been playing football all afternoon.", "Họ chơi bóng cả buổi chiều."],
  ]),
  grammar("past-perfect", "Đến muộn", "had + V3 cho việc xảy ra trước.", [
    ["When we arrived, the film had already started.", "Khi chúng tôi đến, phim đã bắt đầu rồi."],
    ["She had never seen snow before.", "Trước đó cô ấy chưa từng thấy tuyết."],
    ["By the time I got home, everyone had gone to bed.", "Lúc tôi về đến nhà, mọi người đã đi ngủ."],
    ["I couldn't pay because I had left my wallet at home.", "Tôi không trả tiền được vì đã để quên ví ở nhà."],
    ["After he had finished work, he went to the gym.", "Sau khi làm xong việc, anh ấy đi tập gym."],
  ]),
  grammar("used-to-would", "Ngày xưa", "used to / would kể lại thói quen cũ.", [
    ["I used to live in a small village.", "Tôi từng sống ở một ngôi làng nhỏ."],
    ["We would swim in the river every summer.", "Mùa hè nào chúng tôi cũng bơi ở sông."],
    ["There used to be a cinema on this street.", "Ngày trước phố này có một rạp chiếu phim."],
    ["She didn't use to like vegetables.", "Trước đây cô ấy không thích rau."],
    ["Did you use to walk to school?", "Ngày trước bạn có đi bộ đến trường không?"],
  ]),
  grammar("unless-in-case", "Phòng khi", "unless, as long as, in case.", [
    ["Take an umbrella in case it rains.", "Mang ô theo phòng khi trời mưa."],
    ["You will be late unless you leave now.", "Bạn sẽ muộn trừ khi đi ngay bây giờ."],
    ["You can borrow my bike as long as you return it tomorrow.", "Bạn có thể mượn xe đạp miễn là mai trả."],
    ["I'll write down the address in case I forget it.", "Tôi sẽ ghi lại địa chỉ phòng khi quên."],
    ["We'll go to the beach unless the weather is bad.", "Chúng tôi sẽ ra biển trừ khi thời tiết xấu."],
  ]),
  grammar("passive-other-tenses", "Công trình mới", "is being built, has been sold, will be finished.", [
    ["A new bridge is being built across the river.", "Một cây cầu mới đang được xây qua sông."],
    ["All the tickets have been sold.", "Tất cả vé đã được bán hết."],
    ["The work will be finished next month.", "Công việc sẽ được hoàn thành vào tháng sau."],
    ["The road was being repaired when we drove past.", "Con đường đang được sửa khi chúng tôi lái xe qua."],
    ["Phones must be turned off during the exam.", "Điện thoại phải được tắt trong giờ thi."],
  ]),
  grammar("defining-relative", "Người và nơi", "who, which, whose, where trong câu.", [
    ["The woman who lives next door is a nurse.", "Người phụ nữ sống cạnh nhà là y tá."],
    ["This is the café where we first met.", "Đây là quán cà phê nơi chúng ta gặp nhau lần đầu."],
    ["I have a friend whose brother is a famous singer.", "Tôi có một người bạn mà anh trai là ca sĩ nổi tiếng."],
    ["The book that you lent me was great.", "Quyển sách bạn cho tôi mượn rất hay."],
    ["Do you know the man who is talking to Lan?", "Bạn có biết người đàn ông đang nói chuyện với Lan không?"],
  ]),
  grammar("reported-statements", "Cô ấy nói rằng…", "Câu tường thuật: said / told + lùi thì.", [
    ["She said that she was very tired.", "Cô ấy nói rằng cô ấy rất mệt."],
    ["He told me he would call the next day.", "Anh ấy bảo tôi hôm sau anh ấy sẽ gọi."],
    ["They said they had already eaten.", "Họ nói rằng họ đã ăn rồi."],
    ["My teacher told us that the test was easy.", "Cô giáo bảo chúng tôi bài kiểm tra dễ."],
    ["Nam said he couldn't come to the party.", "Nam nói cậu ấy không đến bữa tiệc được."],
  ]),
  grammar("modals-deduction-present", "Chắc là…", "must / might / can't để đoán.", [
    ["The lights are on, so they must be at home.", "Đèn đang sáng, vậy chắc họ ở nhà."],
    ["She isn't answering. She might be asleep.", "Cô ấy không nghe máy. Có thể cô ấy đang ngủ."],
    ["That can't be true!", "Không thể nào là thật được!"],
    ["You must be hungry after the long trip.", "Chắc bạn đói sau chuyến đi dài."],
    ["He could be stuck in traffic.", "Có thể anh ấy đang kẹt xe."],
  ]),
  grammar("gerund-infinitive", "Thích làm gì?", "enjoy doing, decide to do, remember to do.", [
    ["I enjoy reading before bed.", "Tôi thích đọc sách trước khi ngủ."],
    ["We decided to take a taxi.", "Chúng tôi quyết định đi taxi."],
    ["Don't forget to lock the door.", "Đừng quên khóa cửa."],
    ["She stopped eating sweets last year.", "Cô ấy bỏ ăn đồ ngọt từ năm ngoái."],
    ["I'm looking forward to seeing you.", "Tôi mong được gặp bạn."],
  ]),
  grammar("too-enough", "Quá hay đủ?", "too + adj, adj + enough, enough + N.", [
    ["This coffee is too hot to drink.", "Cà phê này nóng quá không uống được."],
    ["He isn't old enough to drive.", "Cậu ấy chưa đủ tuổi lái xe."],
    ["We don't have enough time to finish.", "Chúng tôi không đủ thời gian để làm xong."],
    ["The box is too heavy for me to carry.", "Cái hộp quá nặng tôi không mang nổi."],
    ["Is the room big enough for six people?", "Phòng có đủ rộng cho sáu người không?"],
  ]),
  grammar("so-such", "Đến nỗi…", "so ... that / such ... that.", [
    ["The film was so boring that I fell asleep.", "Bộ phim chán đến nỗi tôi ngủ quên."],
    ["It was such a nice day that we went to the park.", "Hôm đó trời đẹp đến nỗi chúng tôi ra công viên."],
    ["She speaks so quickly that I can't follow her.", "Cô ấy nói nhanh đến nỗi tôi không theo kịp."],
    ["They are such kind people.", "Họ là những người rất tốt bụng."],
    ["There were so many people that we couldn't move.", "Đông người đến nỗi chúng tôi không nhúc nhích được."],
  ]),
  grammar("question-tags", "Phải không?", "Câu hỏi đuôi — chú ý ngữ điệu cuối câu.", [
    ["It's a beautiful day, isn't it?", "Hôm nay trời đẹp nhỉ?"],
    ["You don't like spicy food, do you?", "Bạn không thích đồ cay phải không?"],
    ["She has finished her report, hasn't she?", "Cô ấy làm xong báo cáo rồi phải không?"],
    ["Let's take a break, shall we?", "Mình nghỉ một chút nhé?"],
    ["They went to Da Lat last week, didn't they?", "Tuần trước họ đi Đà Lạt phải không?"],
  ]),
  grammar("indirect-questions", "Hỏi lịch sự", "Could you tell me ... / Do you know ...", [
    ["Could you tell me where the station is?", "Bạn có thể chỉ tôi ga tàu ở đâu không?"],
    ["Do you know what time the museum opens?", "Bạn có biết mấy giờ bảo tàng mở cửa không?"],
    ["I wonder if she got my message.", "Không biết cô ấy đã nhận được tin nhắn của tôi chưa."],
    ["Can you tell me how much this costs?", "Bạn cho tôi hỏi cái này giá bao nhiêu?"],
    ["Do you know who that man is?", "Bạn có biết người đàn ông kia là ai không?"],
  ]),
  grammar("wish-present", "Giá mà…", "wish + quá khứ đơn.", [
    ["I wish I had more free time.", "Ước gì tôi có nhiều thời gian rảnh hơn."],
    ["She wishes she could speak French.", "Cô ấy ước mình nói được tiếng Pháp."],
    ["I wish it weren't so hot today.", "Ước gì hôm nay trời đừng nóng thế."],
    ["Do you wish you lived in the city?", "Bạn có ước được sống ở thành phố không?"],
    ["If only I knew the answer!", "Giá mà tôi biết câu trả lời!"],
  ]),
  grammar("phrasal-verbs", "Một buổi sáng bận rộn", "get up, put on, look for, run out of, pick up.", [
    ["I got up late this morning.", "Sáng nay tôi dậy muộn."],
    ["I put on my coat and looked for my keys.", "Tôi mặc áo khoác và tìm chìa khóa."],
    ["We have run out of milk again.", "Nhà mình lại hết sữa rồi."],
    ["Can you pick me up at eight?", "Bạn đón tôi lúc tám giờ được không?"],
    ["Don't give up, you're almost there!", "Đừng bỏ cuộc, bạn sắp làm được rồi!"],
  ]),

  /* ---------------- Truyện ngắn B1 ---------------- */
  make("story-first-job", "story", "B1", "My First Job", "Kể chuyện ngày đầu đi làm — luyện quá khứ đơn và quá khứ hoàn thành.", 0.9, [
    ["I still remember my first day at work.", "Tôi vẫn nhớ ngày đầu tiên đi làm."],
    ["I had prepared everything the night before.", "Tôi đã chuẩn bị mọi thứ từ tối hôm trước."],
    ["But the bus was late, and I arrived at nine fifteen.", "Nhưng xe buýt đến muộn, và tôi đến lúc chín giờ mười lăm."],
    ["My manager smiled and said it was fine.", "Quản lý mỉm cười và nói không sao."],
    ["She introduced me to everyone in the office.", "Chị ấy giới thiệu tôi với mọi người trong văn phòng."],
    ["By the end of the day, I had made two new friends.", "Đến cuối ngày, tôi đã có thêm hai người bạn mới."],
  ]),
  make("story-lost-phone", "story", "B1", "The Lost Phone", "Một câu chuyện có hậu — nghe nối âm trong câu dài.", 0.9, [
    ["Last month, I left my phone in a taxi.", "Tháng trước, tôi để quên điện thoại trên taxi."],
    ["I didn't notice until I got home.", "Về đến nhà tôi mới để ý."],
    ["I called my number from my sister's phone.", "Tôi gọi vào số của mình bằng điện thoại của chị gái."],
    ["The driver answered and said he had found it.", "Tài xế nghe máy và nói anh ấy đã tìm thấy nó."],
    ["He drove all the way back to give it to me.", "Anh ấy lái xe quay lại tận nơi để trả cho tôi."],
    ["I was so happy that I gave him a big tip.", "Tôi vui đến nỗi đã boa cho anh ấy rất nhiều."],
  ]),

  /* ---------------- Hội thoại B1 ---------------- */
  make("conversation-job-interview", "conversation", "B1", "A Job Interview", "Trả lời phỏng vấn xin việc ngắn.", 0.9, [
    ["Could you tell me a little about yourself?", "Bạn có thể giới thiệu đôi chút về bản thân không?"],
    ["I have worked in marketing for three years.", "Tôi đã làm marketing được ba năm."],
    ["Why do you want to work for our company?", "Vì sao bạn muốn làm việc cho công ty chúng tôi?"],
    ["I'm interested in your products, and I enjoy working in a team.", "Tôi quan tâm đến sản phẩm của công ty và tôi thích làm việc nhóm."],
    ["When would you be able to start?", "Khi nào bạn có thể bắt đầu?"],
    ["I could start at the beginning of next month.", "Tôi có thể bắt đầu từ đầu tháng sau."],
  ]),
  make("conversation-doctor", "conversation", "B1", "At the Doctor's", "Mô tả triệu chứng và nghe lời khuyên.", 0.9, [
    ["What seems to be the problem?", "Bạn bị làm sao vậy?"],
    ["I've had a headache and a sore throat for three days.", "Tôi bị đau đầu và đau họng ba ngày rồi."],
    ["Have you taken any medicine?", "Bạn đã uống thuốc gì chưa?"],
    ["Only some painkillers, but they didn't help much.", "Chỉ vài viên giảm đau, nhưng không đỡ mấy."],
    ["You should rest and drink plenty of water.", "Bạn nên nghỉ ngơi và uống nhiều nước."],
    ["Come back if you don't feel better in a few days.", "Nếu vài ngày nữa không đỡ thì quay lại nhé."],
  ]),
];
