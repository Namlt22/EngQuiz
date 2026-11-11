import { DICTATIONS_A1_A2 } from "./dictations-a1a2";
import type { DictationExercise, DictationKind } from "./types";

export const DICTATION_KIND_LABELS: Record<DictationKind, { label: string; description: string }> = {
  grammar: { label: "Theo chủ điểm ngữ pháp", description: "Câu ngắn dùng đúng cấu trúc vừa học" },
  story: { label: "Truyện ngắn", description: "Câu chuyện đơn giản, nghe từng câu" },
  conversation: { label: "Hội thoại", description: "Đối thoại trong tình huống hằng ngày" },
};

const BASE_DICTATIONS: DictationExercise[] = [
  /* ---------------- Theo chủ điểm ngữ pháp ---------------- */
  {
    id: "to-be-basics",
    title: "Giới thiệu bản thân",
    level: "A1",
    kind: "grammar",
    topicSlug: "to-be",
    description: "am / is / are trong câu giới thiệu đơn giản.",
    rate: 0.8,
    sentences: [
      { text: "My name is Linh.", vi: "Tên tôi là Linh." },
      { text: "I'm a student.", vi: "Tôi là học sinh." },
      { text: "My parents are teachers.", vi: "Bố mẹ tôi là giáo viên." },
      { text: "Is your brother at home?", vi: "Anh trai bạn có ở nhà không?" },
      { text: "We aren't tired today.", vi: "Hôm nay chúng tôi không mệt." },
      { text: "The books are on the table.", vi: "Những quyển sách ở trên bàn." },
    ],
  },
  {
    id: "present-simple-routine",
    title: "Một ngày của Minh",
    level: "A1",
    kind: "grammar",
    topicSlug: "present-simple",
    description: "Nghe đuôi -s / -es của thì hiện tại đơn.",
    rate: 0.8,
    sentences: [
      { text: "Minh gets up at six o'clock.", vi: "Minh thức dậy lúc 6 giờ." },
      { text: "He usually has bread for breakfast.", vi: "Anh ấy thường ăn bánh mì vào bữa sáng." },
      { text: "He goes to school by bike.", vi: "Anh ấy đi học bằng xe đạp." },
      { text: "His sister doesn't like coffee.", vi: "Em gái anh ấy không thích cà phê." },
      { text: "Do you play football on Sundays?", vi: "Bạn có chơi bóng đá vào Chủ nhật không?" },
      { text: "She watches TV after dinner.", vi: "Cô ấy xem TV sau bữa tối." },
    ],
  },
  {
    id: "present-continuous-now",
    title: "Ngay lúc này",
    level: "A1",
    kind: "grammar",
    topicSlug: "present-continuous",
    description: "am / is / are + V-ing — chú ý dạng viết tắt.",
    rate: 0.85,
    sentences: [
      { text: "Look! It's raining.", vi: "Nhìn kìa! Trời đang mưa." },
      { text: "The baby is sleeping now.", vi: "Em bé đang ngủ." },
      { text: "We're waiting for the bus.", vi: "Chúng tôi đang đợi xe buýt." },
      { text: "What are you doing?", vi: "Bạn đang làm gì vậy?" },
      { text: "I'm not watching TV at the moment.", vi: "Lúc này tôi không xem TV." },
      { text: "They are playing in the garden.", vi: "Họ đang chơi trong vườn." },
    ],
  },
  {
    id: "past-simple-weekend",
    title: "Cuối tuần trước",
    level: "A2",
    kind: "grammar",
    topicSlug: "past-simple",
    description: "Nghe đuôi -ed và động từ bất quy tắc.",
    rate: 0.9,
    sentences: [
      { text: "Last weekend, we visited our grandparents.", vi: "Cuối tuần trước, chúng tôi đến thăm ông bà." },
      { text: "My grandmother cooked a delicious meal.", vi: "Bà tôi nấu một bữa ăn ngon." },
      { text: "After lunch, we walked to the river.", vi: "Sau bữa trưa, chúng tôi đi bộ ra sông." },
      { text: "I took a lot of photos.", vi: "Tôi đã chụp rất nhiều ảnh." },
      { text: "We didn't go home until nine.", vi: "Mãi đến 9 giờ chúng tôi mới về nhà." },
      { text: "Did you have a good weekend?", vi: "Bạn có một cuối tuần vui vẻ không?" },
    ],
  },
  {
    id: "first-conditional-plans",
    title: "Nếu ngày mai trời nắng",
    level: "A2",
    kind: "grammar",
    topicSlug: "conditional-type-1",
    description: "If + hiện tại đơn, will + V — chú ý \"'ll\".",
    rate: 0.9,
    sentences: [
      { text: "If it's sunny tomorrow, we'll go to the beach.", vi: "Nếu ngày mai trời nắng, chúng ta sẽ đi biển." },
      { text: "If you study hard, you will pass the exam.", vi: "Nếu bạn học chăm, bạn sẽ đỗ kỳ thi." },
      { text: "I'll call you if I have time.", vi: "Tôi sẽ gọi bạn nếu tôi có thời gian." },
      { text: "If we don't hurry, we'll miss the train.", vi: "Nếu không nhanh lên, chúng ta sẽ lỡ tàu." },
      { text: "She won't come unless you invite her.", vi: "Cô ấy sẽ không đến trừ khi bạn mời." },
      { text: "If you need help, just ask me.", vi: "Nếu bạn cần giúp, cứ hỏi tôi." },
    ],
  },
  {
    id: "second-conditional-dreams",
    title: "Nếu tôi là...",
    level: "B1",
    kind: "grammar",
    topicSlug: "conditional-type-2",
    description: "If + quá khứ đơn, would + V — phân biệt \"would\" và \"'d\".",
    rate: 1,
    sentences: [
      { text: "If I had more free time, I would learn to play the guitar.", vi: "Nếu tôi có nhiều thời gian rảnh hơn, tôi sẽ học chơi guitar." },
      { text: "If I were you, I would take the job.", vi: "Nếu tôi là bạn, tôi sẽ nhận công việc đó." },
      { text: "What would you do if you won the lottery?", vi: "Bạn sẽ làm gì nếu trúng xổ số?" },
      { text: "If she lived closer, we could meet every day.", vi: "Nếu cô ấy sống gần hơn, chúng ta có thể gặp nhau mỗi ngày." },
      { text: "I'd buy a house by the sea if I were rich.", vi: "Tôi sẽ mua một ngôi nhà bên biển nếu tôi giàu." },
      { text: "If he knew the answer, he would tell us.", vi: "Nếu anh ấy biết câu trả lời, anh ấy sẽ nói với chúng ta." },
    ],
  },
  {
    id: "passive-facts",
    title: "Sự thật thú vị",
    level: "B1",
    kind: "grammar",
    topicSlug: "passive-present-past",
    description: "is / are / was / were + V3 trong câu thông tin.",
    rate: 1,
    sentences: [
      { text: "Coffee is grown in the Central Highlands.", vi: "Cà phê được trồng ở Tây Nguyên." },
      { text: "This bridge was built more than a hundred years ago.", vi: "Cây cầu này được xây hơn một trăm năm trước." },
      { text: "English is spoken in many countries.", vi: "Tiếng Anh được nói ở nhiều quốc gia." },
      { text: "The letters were sent last Monday.", vi: "Những lá thư đã được gửi vào thứ Hai tuần trước." },
      { text: "My bike was stolen outside the library.", vi: "Xe đạp của tôi bị lấy trộm bên ngoài thư viện." },
      { text: "These phones are made in Vietnam.", vi: "Những chiếc điện thoại này được sản xuất ở Việt Nam." },
    ],
  },
  {
    id: "third-conditional-regrets",
    title: "Giá như...",
    level: "B2",
    kind: "grammar",
    topicSlug: "conditional-type-3",
    description: "had + V3, would have + V3 — nghe \"would've\" và \"I'd\".",
    rate: 1,
    sentences: [
      { text: "If I had known about the party, I would have come.", vi: "Nếu tôi biết về bữa tiệc, tôi đã đến." },
      { text: "We would've caught the train if we'd left earlier.", vi: "Chúng tôi đã kịp chuyến tàu nếu đi sớm hơn." },
      { text: "If she hadn't helped me, I would have failed.", vi: "Nếu cô ấy không giúp, tôi đã trượt." },
      { text: "He might have won if he hadn't fallen.", vi: "Có lẽ anh ấy đã thắng nếu không bị ngã." },
      { text: "If you had asked me, I would have told you the truth.", vi: "Nếu bạn hỏi, tôi đã nói sự thật với bạn." },
      { text: "What would you have done if you had been there?", vi: "Bạn sẽ làm gì nếu bạn ở đó?" },
    ],
  },

  /* ---------------- Truyện ngắn ---------------- */
  {
    id: "story-my-family",
    title: "My Family",
    level: "A1",
    kind: "story",
    description: "Câu chuyện ngắn về một gia đình nhỏ.",
    rate: 0.8,
    sentences: [
      { text: "Hello, my name is An.", vi: "Xin chào, tên tôi là An." },
      { text: "I live in a small house in Hue.", vi: "Tôi sống trong một ngôi nhà nhỏ ở Huế." },
      { text: "There are four people in my family.", vi: "Gia đình tôi có bốn người." },
      { text: "My father is a doctor.", vi: "Bố tôi là bác sĩ." },
      { text: "My mother works in a bank.", vi: "Mẹ tôi làm việc ở ngân hàng." },
      { text: "My little brother is seven years old.", vi: "Em trai tôi bảy tuổi." },
      { text: "He loves cats and dogs.", vi: "Em ấy yêu chó mèo." },
      { text: "We often eat dinner together.", vi: "Chúng tôi thường ăn tối cùng nhau." },
    ],
  },
  {
    id: "story-trip-da-nang",
    title: "A Trip to Da Nang",
    level: "A2",
    kind: "story",
    description: "Chuyến du lịch hè — luyện quá khứ đơn.",
    rate: 0.9,
    sentences: [
      { text: "Last summer, my family went to Da Nang.", vi: "Hè năm ngoái, gia đình tôi đi Đà Nẵng." },
      { text: "We stayed in a hotel near the beach.", vi: "Chúng tôi ở một khách sạn gần biển." },
      { text: "Every morning, we swam in the sea.", vi: "Mỗi sáng chúng tôi bơi ở biển." },
      { text: "On the second day, we visited the Marble Mountains.", vi: "Ngày thứ hai, chúng tôi thăm Ngũ Hành Sơn." },
      { text: "The view from the top was amazing.", vi: "Khung cảnh từ trên đỉnh thật tuyệt vời." },
      { text: "In the evening, we ate seafood at a local restaurant.", vi: "Buổi tối, chúng tôi ăn hải sản ở một nhà hàng địa phương." },
      { text: "I bought some gifts for my friends.", vi: "Tôi mua vài món quà cho bạn bè." },
      { text: "It was the best holiday ever.", vi: "Đó là kỳ nghỉ tuyệt nhất từ trước đến nay." },
    ],
  },
  {
    id: "story-new-job",
    title: "The New Job",
    level: "B1",
    kind: "story",
    description: "Câu chuyện về ngày đầu đi làm — nhiều thì kết hợp.",
    rate: 1,
    sentences: [
      { text: "Hoa had been looking for a job for three months.", vi: "Hoa đã tìm việc suốt ba tháng." },
      { text: "Finally, a small company invited her to an interview.", vi: "Cuối cùng, một công ty nhỏ mời cô đi phỏng vấn." },
      { text: "She was so nervous that she couldn't sleep the night before.", vi: "Cô lo lắng đến mức không ngủ được đêm hôm trước." },
      { text: "The interview went better than she had expected.", vi: "Buổi phỏng vấn diễn ra tốt hơn cô mong đợi." },
      { text: "A week later, the manager called to offer her the position.", vi: "Một tuần sau, quản lý gọi để mời cô vào vị trí đó." },
      { text: "Now she has been working there for almost a year.", vi: "Bây giờ cô đã làm việc ở đó gần một năm." },
    ],
  },

  /* ---------------- Hội thoại ---------------- */
  {
    id: "conversation-cafe",
    title: "At the Café",
    level: "A1",
    kind: "conversation",
    description: "Gọi đồ uống tại quán cà phê.",
    rate: 0.85,
    sentences: [
      { text: "Good morning. What can I get you?", vi: "Chào buổi sáng. Tôi có thể lấy gì cho bạn?" },
      { text: "Can I have an iced coffee, please?", vi: "Cho tôi một ly cà phê đá được không?" },
      { text: "Sure. Would you like anything else?", vi: "Được ạ. Bạn có muốn gọi thêm gì không?" },
      { text: "No, thank you. How much is it?", vi: "Không, cảm ơn. Bao nhiêu tiền vậy?" },
      { text: "It's thirty thousand dong.", vi: "Ba mươi nghìn đồng." },
      { text: "Here you are. Have a nice day!", vi: "Của bạn đây. Chúc một ngày tốt lành!" },
    ],
  },
  {
    id: "conversation-directions",
    title: "Asking for Directions",
    level: "A2",
    kind: "conversation",
    description: "Hỏi và chỉ đường trong thành phố.",
    rate: 0.9,
    sentences: [
      { text: "Excuse me, how can I get to the train station?", vi: "Xin lỗi, làm sao để đến ga tàu?" },
      { text: "Go straight ahead and turn left at the traffic lights.", vi: "Đi thẳng rồi rẽ trái ở đèn giao thông." },
      { text: "Is it far from here?", vi: "Có xa đây không?" },
      { text: "No, it's only about ten minutes on foot.", vi: "Không, chỉ khoảng mười phút đi bộ." },
      { text: "Thank you very much for your help.", vi: "Cảm ơn bạn rất nhiều vì đã giúp." },
      { text: "You're welcome. Have a good trip!", vi: "Không có gì. Chúc chuyến đi vui vẻ!" },
    ],
  },
];

/** Thứ tự: bài gốc trước, sau đó bài theo từng chủ điểm A1–A2; trang danh sách tự nhóm theo loại và lọc theo cấp. */
export const DICTATIONS: DictationExercise[] = [...BASE_DICTATIONS, ...DICTATIONS_A1_A2];

export function getDictation(id: string): DictationExercise | undefined {
  return DICTATIONS.find((d) => d.id === id);
}

export function dictationsForTopic(slug: string): DictationExercise[] {
  return DICTATIONS.filter((d) => d.topicSlug === slug);
}
