/**
 * Bài nghe & chép cho các chủ điểm B2 (mỗi chủ điểm một bài, câu dùng đúng cấu trúc).
 * Bộ câu này cũng là bộ "Đọc theo câu mẫu" ở trang Luyện nói.
 */
import type { DictationExercise } from "./types";

type Sentences = [en: string, vi: string][];

const grammar = (slug: string, title: string, description: string, sentences: Sentences): DictationExercise => ({
  id: slug,
  title,
  level: "B2",
  kind: "grammar",
  description,
  rate: 0.95,
  topicSlug: slug,
  sentences: sentences.map(([text, vi]) => ({ text, vi })),
});

export const DICTATIONS_B2: DictationExercise[] = [
  grammar("future-continuous-perfect", "Giờ này ngày mai", "will be + V-ing và will have + V3 — chú ý have đọc lướt.", [
    ["This time tomorrow I will be flying to Tokyo.", "Giờ này ngày mai tôi đang bay đến Tokyo."],
    ["Don't call at eight because we will be having dinner.", "Đừng gọi lúc tám giờ vì lúc đó chúng tôi đang ăn tối."],
    ["By Friday I will have finished the report.", "Trước thứ Sáu tôi sẽ làm xong báo cáo."],
    ["By the time you arrive, the film will have started.", "Lúc bạn đến thì phim đã bắt đầu rồi."],
    ["Next year they will have been married for ten years.", "Năm sau là họ cưới nhau được mười năm."],
  ]),
  grammar("past-perfect-continuous", "Vì sao lại mệt?", "had been + V-ing — giải thích nguyên nhân trong quá khứ.", [
    ["The ground was wet because it had been raining.", "Mặt đất ướt vì trời đã mưa."],
    ["She was tired because she had been working all night.", "Cô ấy mệt vì đã làm việc cả đêm."],
    ["We had been waiting for an hour when the bus finally came.", "Chúng tôi đã đợi một tiếng thì xe buýt mới đến."],
    ["His eyes were red because he had been crying.", "Mắt anh ấy đỏ vì anh ấy đã khóc."],
    ["How long had you been living there before you moved?", "Bạn đã sống ở đó bao lâu trước khi chuyển đi?"],
  ]),
  grammar("twelve-tenses", "Một ngày bận rộn", "Nghe và nhận ra nhiều thì khác nhau trong cùng một câu chuyện.", [
    ["I usually start work at nine, but today I started at seven.", "Tôi thường bắt đầu làm lúc chín giờ nhưng hôm nay bắt đầu lúc bảy giờ."],
    ["While I was driving to the office, my boss called me.", "Trong lúc tôi đang lái xe đến công ty thì sếp gọi."],
    ["I have been working on this project since March.", "Tôi làm dự án này từ tháng Ba."],
    ["By the time I got home, my family had already eaten.", "Lúc tôi về đến nhà thì cả nhà đã ăn xong."],
    ["Tomorrow I will be working from home.", "Ngày mai tôi sẽ làm việc ở nhà."],
  ]),
  grammar("mixed-conditionals", "Giá mà hồi đó", "Điều kiện quá khứ, kết quả hiện tại.", [
    ["If I had taken that job, I would live in Singapore now.", "Nếu hồi đó tôi nhận công việc ấy thì giờ tôi đang sống ở Singapore."],
    ["If we had left earlier, we wouldn't be stuck in traffic.", "Nếu chúng ta đi sớm hơn thì giờ đã không bị kẹt xe."],
    ["If she were more careful, she wouldn't have lost her phone.", "Nếu cô ấy cẩn thận hơn thì đã không làm mất điện thoại."],
    ["If I had eaten breakfast, I wouldn't be so hungry now.", "Nếu tôi ăn sáng thì giờ đã không đói thế này."],
    ["If he spoke English, he would have got the job.", "Nếu anh ấy nói được tiếng Anh thì đã được nhận việc."],
  ]),
  grammar("wish-past", "Tiếc nuối", "wish / if only + had + V3.", [
    ["I wish I had studied harder at school.", "Giá mà hồi đi học tôi chăm hơn."],
    ["If only we had left the house earlier.", "Giá mà chúng ta ra khỏi nhà sớm hơn."],
    ["She wishes she hadn't said that to her friend.", "Cô ấy tiếc vì đã nói điều đó với bạn."],
    ["I wish I had brought my umbrella today.", "Giá mà hôm nay tôi mang ô."],
    ["He wishes he had taken the job in Hanoi.", "Anh ấy tiếc vì đã không nhận việc ở Hà Nội."],
  ]),
  grammar("passive-modals-reporting", "Tin tức", "must be done, is said to … — văn phong tin tức.", [
    ["All forms must be signed before Friday.", "Mọi mẫu đơn phải được ký trước thứ Sáu."],
    ["The problem should have been solved earlier.", "Vấn đề lẽ ra phải được giải quyết sớm hơn."],
    ["It is said that the company will close next year.", "Người ta nói công ty sẽ đóng cửa vào năm sau."],
    ["The painting is believed to be very old.", "Bức tranh được cho là rất cổ."],
    ["The thieves are thought to have escaped by car.", "Bọn trộm được cho là đã trốn thoát bằng ô tô."],
  ]),
  grammar("causative", "Thuê người làm", "have / get something done.", [
    ["I had my hair cut last weekend.", "Cuối tuần trước tôi đi cắt tóc."],
    ["We are having our kitchen painted next month.", "Tháng sau chúng tôi thuê người sơn bếp."],
    ["She got her phone repaired at a small shop.", "Cô ấy mang điện thoại đi sửa ở một cửa hàng nhỏ."],
    ["He had his wallet stolen on the train.", "Anh ấy bị trộm ví trên tàu."],
    ["I got my brother to help me move the sofa.", "Tôi nhờ anh trai giúp chuyển cái ghế sofa."],
  ]),
  grammar("reported-questions-commands", "Cô ấy đã hỏi gì?", "asked where / if …, told me to … — trật tự câu kể.", [
    ["She asked me where I lived.", "Cô ấy hỏi tôi sống ở đâu."],
    ["He asked if I was tired.", "Anh ấy hỏi tôi có mệt không."],
    ["The teacher asked whether we had finished the test.", "Cô giáo hỏi chúng tôi đã làm xong bài kiểm tra chưa."],
    ["My mother told me not to be late.", "Mẹ dặn tôi đừng về muộn."],
    ["The doctor asked me to stay in bed for two days.", "Bác sĩ bảo tôi nằm nghỉ hai ngày."],
  ]),
  grammar("non-defining-relative", "Thông tin thêm", "Mệnh đề có dấu phẩy: who, which, whose, where.", [
    ["My sister, who lives in Da Nang, is a nurse.", "Chị tôi, người sống ở Đà Nẵng, là y tá."],
    ["Hue, which was once the capital, is full of history.", "Huế, nơi từng là kinh đô, có rất nhiều di tích."],
    ["He forgot my birthday, which made me sad.", "Anh ấy quên sinh nhật tôi, điều đó làm tôi buồn."],
    ["My neighbour, whose dog barks all night, never says sorry.", "Ông hàng xóm, có con chó sủa cả đêm, chẳng bao giờ xin lỗi."],
    ["We stayed in Hoi An, where we bought some lanterns.", "Chúng tôi ở Hội An, nơi chúng tôi mua vài chiếc đèn lồng."],
  ]),
  grammar("reduced-relative", "Câu gọn hơn", "V-ing, V3 và to V thay cho who / which.", [
    ["The man standing at the door is our new teacher.", "Người đàn ông đứng ở cửa là thầy giáo mới của chúng tôi."],
    ["Most of the shoes sold here are made in Vietnam.", "Phần lớn giày bán ở đây được sản xuất tại Việt Nam."],
    ["She was the first person to arrive at the party.", "Cô ấy là người đầu tiên đến bữa tiệc."],
    ["Passengers waiting for the train should stay behind the line.", "Hành khách chờ tàu nên đứng sau vạch."],
    ["The bridge built in 1902 is still in use today.", "Cây cầu xây năm 1902 vẫn được dùng đến hôm nay."],
  ]),
  grammar("modals-deduction-past", "Chắc là đã…", "must have, might have, can't have — chú ý have đọc nhẹ.", [
    ["The road is wet, so it must have rained.", "Đường ướt nên chắc trời đã mưa."],
    ["She might have missed the bus.", "Có lẽ cô ấy lỡ chuyến xe buýt."],
    ["He can't have finished already.", "Không thể nào anh ấy đã làm xong rồi."],
    ["You must have been very worried.", "Chắc hẳn bạn đã rất lo lắng."],
    ["They might have been sleeping when you called.", "Có lẽ lúc bạn gọi họ đang ngủ."],
  ]),
  grammar("should-have", "Lẽ ra…", "should have, shouldn't have, needn't have.", [
    ["I should have listened to my parents.", "Lẽ ra tôi nên nghe lời bố mẹ."],
    ["You shouldn't have told her the secret.", "Lẽ ra bạn không nên kể bí mật cho cô ấy."],
    ["We could have taken a taxi, but we walked.", "Chúng tôi đã có thể đi taxi nhưng lại đi bộ."],
    ["You needn't have cooked because we had already eaten.", "Bạn không cần nấu đâu vì chúng tôi đã ăn rồi."],
    ["She should have left the house earlier.", "Lẽ ra cô ấy nên ra khỏi nhà sớm hơn."],
  ]),
  grammar("used-to-be-used-to", "Đã quen chưa?", "used to, be used to, get used to.", [
    ["I used to live in a small town.", "Tôi từng sống ở một thị trấn nhỏ."],
    ["She is used to getting up very early.", "Cô ấy đã quen dậy rất sớm."],
    ["You will soon get used to the hot weather.", "Bạn sẽ sớm quen với thời tiết nóng."],
    ["Did you use to play football at school?", "Hồi đi học bạn có hay đá bóng không?"],
    ["It took me a month to get used to driving on the right.", "Tôi mất một tháng mới quen lái xe bên phải."],
  ]),
  grammar("would-rather", "Thích hơn", "would rather, it's time, had better.", [
    ["I would rather stay at home tonight.", "Tối nay tôi muốn ở nhà hơn."],
    ["I'd rather you didn't smoke in here.", "Tôi muốn bạn đừng hút thuốc ở đây."],
    ["It's time we went home.", "Đã đến lúc chúng ta về nhà rồi."],
    ["You had better take an umbrella.", "Bạn nên mang theo ô."],
    ["We'd better not be late for the meeting.", "Chúng ta không nên đến họp muộn."],
  ]),
  grammar("contrast-linkers", "Mặc dù vậy", "although, despite, however, whereas.", [
    ["Although it was raining, we went for a walk.", "Mặc dù trời mưa, chúng tôi vẫn đi dạo."],
    ["Despite the heavy traffic, we arrived on time.", "Dù tắc đường, chúng tôi vẫn đến đúng giờ."],
    ["The hotel was expensive. However, the rooms were small.", "Khách sạn đắt. Tuy vậy, phòng lại nhỏ."],
    ["I like spicy food, whereas my wife hates it.", "Tôi thích đồ cay, còn vợ tôi thì ghét."],
    ["In spite of being tired, he kept working.", "Dù mệt, anh ấy vẫn tiếp tục làm việc."],
  ]),
  grammar("participle-clauses", "Văn viết gọn", "V-ing, V3, having + V3 ở đầu câu.", [
    ["Feeling tired, I went to bed early.", "Thấy mệt, tôi đi ngủ sớm."],
    ["Built in 1890, the bridge is the oldest in the city.", "Được xây năm 1890, cây cầu là cây cầu cổ nhất thành phố."],
    ["Having finished my homework, I watched a film.", "Làm xong bài tập, tôi xem một bộ phim."],
    ["Not knowing what to do, she called her mother.", "Không biết phải làm gì, cô ấy gọi cho mẹ."],
    ["Walking along the beach, we saw a beautiful sunset.", "Đi dạo dọc bãi biển, chúng tôi thấy hoàng hôn rất đẹp."],
  ]),
];
