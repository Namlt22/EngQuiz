/**
 * Bài nghe & chép cho các chủ điểm C1 (mỗi chủ điểm một bài). Câu dài hơn, văn phong trang trọng.
 * Bộ câu này cũng là bộ "Đọc theo câu mẫu" ở trang Luyện nói.
 */
import type { DictationExercise } from "./types";

type Sentences = [en: string, vi: string][];

const grammar = (slug: string, title: string, description: string, sentences: Sentences): DictationExercise => ({
  id: slug,
  title,
  level: "C1",
  kind: "grammar",
  description,
  rate: 1,
  topicSlug: slug,
  sentences: sentences.map(([text, vi]) => ({ text, vi })),
});

export const DICTATIONS_C1: DictationExercise[] = [
  grammar("inversion-negative", "Chưa bao giờ", "Đảo ngữ sau trạng từ phủ định.", [
    ["Never have I seen such a beautiful sunset.", "Tôi chưa bao giờ thấy hoàng hôn đẹp như thế."],
    ["Not only did she win the race, but she also broke the record.", "Cô ấy không chỉ thắng cuộc đua mà còn phá kỷ lục."],
    ["No sooner had we arrived than it started to rain.", "Chúng tôi vừa đến thì trời bắt đầu mưa."],
    ["Only after the meeting did I realise my mistake.", "Chỉ sau cuộc họp tôi mới nhận ra lỗi của mình."],
    ["Under no circumstances should you open this door.", "Trong bất cứ hoàn cảnh nào bạn cũng không được mở cánh cửa này."],
  ]),
  grammar("inversion-conditional", "Nếu như", "Should, Were, Had đứng đầu câu thay cho if.", [
    ["Should you have any questions, please contact us.", "Nếu có câu hỏi nào, vui lòng liên hệ với chúng tôi."],
    ["Were I in your position, I would accept the offer.", "Nếu tôi ở vị trí của bạn, tôi sẽ nhận lời."],
    ["Had we left earlier, we would have caught the train.", "Nếu chúng ta đi sớm hơn thì đã kịp chuyến tàu."],
    ["Had it not been for your help, we would have failed.", "Nếu không có sự giúp đỡ của bạn, chúng tôi đã thất bại."],
    ["Were she to apply for the job, she would get it.", "Nếu cô ấy nộp đơn thì cô ấy sẽ được nhận."],
  ]),
  grammar("advanced-conditionals", "Miễn là", "provided, as long as, unless, but for, in case.", [
    ["You can borrow my car provided you return it tomorrow.", "Bạn có thể mượn xe của tôi với điều kiện mai trả lại."],
    ["As long as you are happy, I am happy too.", "Miễn là bạn vui thì tôi cũng vui."],
    ["Unless it rains, we will have dinner in the garden.", "Trừ khi trời mưa, chúng ta sẽ ăn tối ngoài vườn."],
    ["But for your support, I would never have finished.", "Nếu không có sự ủng hộ của bạn, tôi đã không bao giờ hoàn thành."],
    ["Take a coat in case it gets cold later.", "Mang theo áo khoác phòng khi lát nữa trời lạnh."],
  ]),
  grammar("cleft-sentences", "Chính là", "It was … who / that, What … is.", [
    ["It was my brother who broke the window.", "Chính anh trai tôi đã làm vỡ cửa sổ."],
    ["It was in Hue that they first met.", "Chính ở Huế họ đã gặp nhau lần đầu."],
    ["What I need right now is a long holiday.", "Điều tôi cần lúc này là một kỳ nghỉ dài."],
    ["What surprised me most was his reaction.", "Điều làm tôi ngạc nhiên nhất là phản ứng của anh ấy."],
    ["All I want is a quiet life.", "Tất cả những gì tôi muốn là một cuộc sống yên bình."],
  ]),
  grammar("subjunctive", "Đề nghị rằng", "suggest / insist / essential that + V nguyên mẫu.", [
    ["The doctor recommended that he stay in bed.", "Bác sĩ khuyên anh ấy nằm nghỉ trên giường."],
    ["It is essential that everyone be on time.", "Điều quan trọng là mọi người phải đúng giờ."],
    ["The teacher insisted that every student submit the essay.", "Giáo viên yêu cầu mọi học sinh phải nộp bài luận."],
    ["I suggest that she not tell anyone yet.", "Tôi đề nghị cô ấy chưa nói với ai."],
    ["He talks as if he were the manager.", "Anh ta nói như thể anh ta là quản lý."],
  ]),
  grammar("emphasis", "Thật sự mà", "do / did nhấn mạnh, the very, on earth, whatsoever.", [
    ["I did call you, three times in fact.", "Tôi có gọi cho bạn thật mà, ba lần cơ."],
    ["She does look tired today.", "Hôm nay trông cô ấy mệt thật."],
    ["That is the very book I was looking for.", "Đó chính là quyển sách tôi đang tìm."],
    ["What on earth are you doing?", "Rốt cuộc bạn đang làm gì vậy?"],
    ["I have no idea whatsoever.", "Tôi hoàn toàn không biết gì cả."],
  ]),
  grammar("nominalisation", "Văn phong báo cáo", "Danh từ hoá: decision, rise, analysis.", [
    ["The sharp rise in prices caused widespread concern.", "Việc giá tăng mạnh gây lo ngại khắp nơi."],
    ["The company's decision to close the factory shocked the workers.", "Quyết định đóng cửa nhà máy của công ty khiến công nhân sửng sốt."],
    ["Careful analysis of the results reveals a clear pattern.", "Phân tích kỹ kết quả cho thấy một quy luật rõ ràng."],
    ["The rapid development of technology has changed our lives.", "Sự phát triển nhanh của công nghệ đã thay đổi cuộc sống của chúng ta."],
    ["Her ability to solve problems impressed everyone.", "Khả năng giải quyết vấn đề của cô ấy khiến mọi người ấn tượng."],
  ]),
  grammar("ellipsis-substitution", "Khỏi nhắc lại", "so, not, one, do, to.", [
    ["Will it rain tomorrow? I hope not.", "Mai trời có mưa không? Tôi mong là không."],
    ["Is the shop open? I think so.", "Cửa hàng có mở không? Tôi nghĩ là có."],
    ["I don't like the red shirt, but I like the blue one.", "Tôi không thích chiếc áo đỏ, nhưng tôi thích chiếc màu xanh."],
    ["She sings much better than I do.", "Cô ấy hát hay hơn tôi nhiều."],
    ["I would love to come, but I can't afford to.", "Tôi rất muốn đến nhưng không đủ tiền."],
  ]),
  grammar("future-in-past", "Tưởng là sẽ", "would, was going to, was about to.", [
    ["I knew it would be difficult.", "Tôi biết là sẽ khó."],
    ["We were going to travel, but we got sick.", "Chúng tôi định đi du lịch nhưng lại bị ốm."],
    ["I was about to leave when you called.", "Tôi vừa định đi thì bạn gọi."],
    ["He promised that he would call me the next day.", "Anh ấy hứa hôm sau sẽ gọi cho tôi."],
    ["Little did they know that the boy would become famous.", "Họ đâu biết rằng cậu bé sau này sẽ nổi tiếng."],
  ]),
  grammar("advanced-articles", "Mạo từ khó", "the + tính từ, tên sông, go to school.", [
    ["The rich are not always happy.", "Người giàu không phải lúc nào cũng hạnh phúc."],
    ["Life is too short to waste.", "Cuộc đời quá ngắn để lãng phí."],
    ["The Mekong flows through six countries.", "Sông Mê Kông chảy qua sáu quốc gia."],
    ["My little brother started school this year.", "Năm nay em trai tôi bắt đầu đi học."],
    ["The elderly need more support from society.", "Người cao tuổi cần được xã hội hỗ trợ nhiều hơn."],
  ]),
  grammar("academic-linkers", "Bài luận", "furthermore, consequently, nevertheless, whereas.", [
    ["The project was expensive. Nevertheless, it was a great success.", "Dự án tốn kém. Tuy vậy, nó rất thành công."],
    ["The flight was delayed due to bad weather.", "Chuyến bay bị hoãn do thời tiết xấu."],
    ["The company lost money. Consequently, many workers were laid off.", "Công ty thua lỗ. Do đó, nhiều công nhân bị cho nghỉ việc."],
    ["Some people prefer cities, whereas others enjoy rural life.", "Một số người thích thành phố, trong khi những người khác thích cuộc sống nông thôn."],
    ["Furthermore, the plan is easy to carry out.", "Hơn nữa, kế hoạch dễ thực hiện."],
  ]),
  grammar("advanced-passive", "Được và bị", "being done, to be done, needs doing.", [
    ["I hate being interrupted when I am working.", "Tôi ghét bị ngắt lời khi đang làm việc."],
    ["She expects to be promoted next year.", "Cô ấy mong được thăng chức vào năm sau."],
    ["We were shown the new office.", "Chúng tôi được dẫn đi xem văn phòng mới."],
    ["The thief is thought to have escaped through the window.", "Tên trộm được cho là đã trốn qua cửa sổ."],
    ["My car needs washing.", "Xe của tôi cần được rửa."],
  ]),
];
