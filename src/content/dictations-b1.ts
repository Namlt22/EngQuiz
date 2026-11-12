/**
 * Bài nghe & chép cho các chủ điểm B1 (mỗi chủ điểm một bài, 5 câu dùng đúng cấu trúc).
 */
import type { DictationExercise } from "./types";

function grammar(topicSlug: string, title: string, description: string, sentences: [en: string, vi: string][]): DictationExercise {
  return {
    id: topicSlug,
    title,
    level: "B1",
    kind: "grammar",
    topicSlug,
    description,
    rate: 1,
    sentences: sentences.map(([text, vi]) => ({ text, vi })),
  };
}

export const DICTATIONS_B1: DictationExercise[] = [
  grammar("present-perfect-vs-past", "Chuyến đi đáng nhớ", "Have you ever...? rồi kể chi tiết bằng quá khứ đơn.", [
    ["Have you ever been to Ha Long Bay?", "Bạn đã từng đến vịnh Hạ Long chưa?"],
    ["Yes, I have. I went there last summer.", "Rồi. Tôi đến đó vào hè năm ngoái."],
    ["We stayed on a boat for two nights.", "Chúng tôi ở trên thuyền hai đêm."],
    ["I have visited many places, but that was the best.", "Tôi đã đi nhiều nơi nhưng đó là nơi tuyệt nhất."],
    ["I haven't been back since then.", "Từ đó đến giờ tôi chưa quay lại."],
  ]),
  grammar("present-perfect-continuous", "Bao lâu rồi?", "have / has been + V-ing với for và since.", [
    ["It has been raining since this morning.", "Trời mưa từ sáng đến giờ."],
    ["How long have you been waiting here?", "Bạn đợi ở đây bao lâu rồi?"],
    ["I've been studying English for three years.", "Tôi học tiếng Anh được ba năm rồi."],
    ["She looks tired because she has been working all day.", "Cô ấy trông mệt vì làm việc cả ngày."],
    ["They have been living in Da Nang since 2020.", "Họ sống ở Đà Nẵng từ năm 2020."],
  ]),
  grammar("past-perfect", "Đến muộn mất rồi", "had + V3 cho việc xảy ra trước.", [
    ["When we arrived at the station, the train had already left.", "Khi chúng tôi đến ga thì tàu đã chạy rồi."],
    ["I had never seen snow before I went to Sapa.", "Trước khi đến Sa Pa tôi chưa từng thấy tuyết."],
    ["By the time the film started, we had eaten all the popcorn.", "Đến lúc phim bắt đầu thì chúng tôi đã ăn hết bỏng ngô."],
    ["She was nervous because she hadn't flown before.", "Cô ấy lo lắng vì chưa từng đi máy bay."],
    ["After he had finished his work, he went home.", "Sau khi làm xong việc, anh ấy về nhà."],
  ]),
  grammar("used-to-would", "Ngày xưa ở quê", "used to và would cho thói quen trong quá khứ.", [
    ["I used to live in a small village.", "Tôi từng sống ở một ngôi làng nhỏ."],
    ["There used to be a big tree in front of our house.", "Trước nhà tôi từng có một cái cây to."],
    ["Every evening, my grandmother would tell us stories.", "Tối nào bà cũng kể chuyện cho chúng tôi nghe."],
    ["We would swim in the river after school.", "Tan học chúng tôi hay bơi ở sông."],
    ["Did you use to have long hair?", "Bạn từng để tóc dài phải không?"],
  ]),
  grammar("unless-in-case", "Chuẩn bị trước khi đi", "unless, as long as, in case.", [
    ["Take an umbrella in case it rains.", "Mang theo ô phòng khi trời mưa."],
    ["You'll miss the bus unless you hurry.", "Bạn sẽ lỡ xe buýt nếu không nhanh lên."],
    ["You can borrow my bike as long as you bring it back tomorrow.", "Bạn có thể mượn xe đạp miễn là mai trả lại."],
    ["I'll write down the address in case I forget it.", "Tôi sẽ ghi lại địa chỉ phòng khi quên."],
    ["Unless it is too cold, we will go camping.", "Trừ khi trời quá lạnh, chúng tôi sẽ đi cắm trại."],
  ]),
  grammar("passive-other-tenses", "Thành phố đang thay đổi", "is being built, has been opened, will be finished...", [
    ["A new bridge is being built across the river.", "Một cây cầu mới đang được xây qua sông."],
    ["Two new schools have been opened this year.", "Năm nay đã có hai trường học mới được mở."],
    ["The old market will be replaced by a shopping centre.", "Khu chợ cũ sẽ được thay bằng một trung tâm mua sắm."],
    ["The road was being repaired when we drove past.", "Con đường đang được sửa khi chúng tôi đi qua."],
    ["All the work must be finished before the end of the year.", "Toàn bộ công việc phải được hoàn thành trước cuối năm."],
  ]),
  grammar("defining-relative", "Người và nơi tôi nhớ", "who, which, that, whose, where.", [
    ["The woman who lives next door is a doctor.", "Người phụ nữ sống cạnh nhà là bác sĩ."],
    ["This is the café where we first met.", "Đây là quán cà phê nơi chúng tôi gặp nhau lần đầu."],
    ["I have a friend whose father is a pilot.", "Tôi có một người bạn có bố là phi công."],
    ["The book that you gave me is really interesting.", "Quyển sách bạn tặng tôi thật sự rất hay."],
    ["Do you remember the day when we started school?", "Bạn có nhớ ngày chúng ta bắt đầu đi học không?"],
  ]),
  grammar("reported-statements", "Cô ấy đã nói gì?", "said / told + lùi thì.", [
    ["She said that she was very tired.", "Cô ấy nói rằng cô ấy rất mệt."],
    ["He told me that he had lost his keys.", "Anh ấy bảo tôi rằng anh ấy làm mất chìa khóa."],
    ["My mother said she would call me the next day.", "Mẹ tôi nói hôm sau mẹ sẽ gọi cho tôi."],
    ["They told us they were moving to a new flat.", "Họ bảo chúng tôi là họ sắp chuyển sang căn hộ mới."],
    ["Nam said he couldn't come to the party.", "Nam nói cậu ấy không thể đến bữa tiệc."],
  ]),
  grammar("modals-deduction-present", "Thám tử nhí", "must / might / can't để suy đoán.", [
    ["The lights are on, so they must be at home.", "Đèn đang sáng nên chắc chắn họ đang ở nhà."],
    ["She isn't answering her phone. She might be asleep.", "Cô ấy không nghe máy. Có thể cô ấy đang ngủ."],
    ["That can't be Tom. He's in London this week.", "Đó không thể là Tom. Tuần này anh ấy ở London."],
    ["You've been working all day. You must be exhausted.", "Bạn làm việc cả ngày rồi. Chắc bạn mệt lắm."],
    ["He may be stuck in traffic.", "Có thể anh ấy đang bị kẹt xe."],
  ]),
  grammar("gerund-infinitive", "Thói quen và dự định", "V-ing hay to V?", [
    ["I enjoy listening to music before I go to bed.", "Tôi thích nghe nhạc trước khi đi ngủ."],
    ["We have decided to spend our holiday in Hoi An.", "Chúng tôi đã quyết định đi nghỉ ở Hội An."],
    ["Please remember to lock the door when you leave.", "Nhớ khóa cửa khi bạn đi nhé."],
    ["He stopped smoking two years ago.", "Anh ấy bỏ thuốc lá hai năm trước."],
    ["I'm looking forward to seeing you again.", "Tôi rất mong được gặp lại bạn."],
  ]),
  grammar("too-enough", "Quá hay chưa đủ?", "too + adj + to V, adj + enough + to V.", [
    ["This tea is too hot to drink.", "Trà này nóng quá không uống được."],
    ["My little brother isn't old enough to drive.", "Em trai tôi chưa đủ tuổi lái xe."],
    ["We don't have enough time to visit the museum.", "Chúng tôi không đủ thời gian để thăm bảo tàng."],
    ["The box was too heavy for me to carry.", "Cái hộp nặng quá tôi không mang được."],
    ["Is the room big enough for six people?", "Căn phòng có đủ rộng cho sáu người không?"],
  ]),
  grammar("so-such", "Một ngày tuyệt vời", "so ... that và such ... that.", [
    ["It was such a beautiful day that we went to the beach.", "Trời đẹp đến nỗi chúng tôi ra biển."],
    ["The film was so boring that I fell asleep.", "Bộ phim chán đến nỗi tôi ngủ quên."],
    ["There were so many people that we couldn't find a seat.", "Đông người đến nỗi chúng tôi không tìm được chỗ ngồi."],
    ["She is such a kind person that everyone loves her.", "Cô ấy tốt bụng đến mức ai cũng quý."],
    ["He spoke so quickly that I didn't understand him.", "Anh ấy nói nhanh đến nỗi tôi không hiểu."],
  ]),
  grammar("question-tags", "Đúng không nhỉ?", "Câu hỏi đuôi trong hội thoại hằng ngày.", [
    ["You're a new student, aren't you?", "Bạn là học sinh mới phải không?"],
    ["It's really hot today, isn't it?", "Hôm nay nóng thật, nhỉ?"],
    ["She doesn't eat meat, does she?", "Cô ấy không ăn thịt, đúng không?"],
    ["You haven't seen my keys, have you?", "Bạn không thấy chìa khóa của tôi đâu, phải không?"],
    ["Let's take a break, shall we?", "Mình nghỉ một chút nhé?"],
  ]),
  grammar("indirect-questions", "Hỏi đường lịch sự", "Could you tell me... / Do you know...", [
    ["Excuse me, could you tell me where the station is?", "Xin lỗi, bạn có thể chỉ giúp tôi ga tàu ở đâu không?"],
    ["Do you know what time the museum opens?", "Bạn có biết mấy giờ bảo tàng mở cửa không?"],
    ["I wonder if there is a bank near here.", "Không biết gần đây có ngân hàng nào không."],
    ["Can you tell me how much this ticket costs?", "Bạn có thể cho tôi biết vé này giá bao nhiêu không?"],
    ["I'd like to know whether the bus stops here.", "Tôi muốn biết xe buýt có dừng ở đây không."],
  ]),
  grammar("wish-present", "Giá mà...", "wish + quá khứ đơn, could, would.", [
    ["I wish I had more free time.", "Ước gì tôi có nhiều thời gian rảnh hơn."],
    ["She wishes she could speak Japanese.", "Cô ấy ước mình nói được tiếng Nhật."],
    ["I wish I were taller.", "Ước gì tôi cao hơn."],
    ["I wish it would stop raining.", "Ước gì trời tạnh mưa."],
    ["If only we lived closer to the sea!", "Giá mà chúng tôi sống gần biển hơn!"],
  ]),
  grammar("phrasal-verbs", "Một buổi sáng bận rộn", "get up, put on, look for, run out of, pick up...", [
    ["I got up late and put on my clothes quickly.", "Tôi dậy muộn và mặc quần áo thật nhanh."],
    ["I spent ten minutes looking for my keys.", "Tôi mất mười phút tìm chìa khóa."],
    ["We had run out of milk, so I skipped breakfast.", "Nhà hết sữa nên tôi bỏ bữa sáng."],
    ["Don't forget to turn off the lights.", "Đừng quên tắt đèn."],
    ["My friend picked me up at the corner.", "Bạn tôi đón tôi ở góc đường."],
  ]),
];
