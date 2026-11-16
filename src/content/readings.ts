/**
 * Bài đọc hiểu (Reading) A1–B1. Mỗi bài: các đoạn văn kèm bản dịch, từ vựng, câu hỏi đọc hiểu.
 * Câu hỏi dùng chung kiểu Question với Quiz nên được chấm bằng cùng bộ chấm (src/core/grading.ts).
 */
import type { ReadingPassage } from "./types";

export const READINGS: ReadingPassage[] = [
  /* ---------------- A1 ---------------- */
  {
    id: "my-family",
    title: "My Family",
    level: "A1",
    theme: "Gia đình",
    description: "Linh giới thiệu về gia đình mình — to be, there are, hiện tại đơn.",
    paragraphs: [
      { en: "Hi! My name is Linh. I am twelve years old and I live in Da Nang with my family.", vi: "Xin chào! Mình tên là Linh. Mình mười hai tuổi và sống ở Đà Nẵng cùng gia đình." },
      { en: "There are five people in my family: my parents, my grandmother, my little brother and me. My father is a doctor. My mother is a teacher at a primary school.", vi: "Nhà mình có năm người: bố mẹ, bà, em trai và mình. Bố mình là bác sĩ. Mẹ mình là giáo viên ở một trường tiểu học." },
      { en: "My brother's name is Nam. He is seven. He likes football and he plays with his friends every afternoon.", vi: "Em trai mình tên là Nam. Em ấy bảy tuổi. Em ấy thích bóng đá và chơi với bạn mỗi buổi chiều." },
      { en: "My grandmother is very kind. She cooks delicious food, and on Sundays we all eat lunch together.", vi: "Bà mình rất hiền. Bà nấu ăn rất ngon, và Chủ nhật cả nhà cùng ăn trưa với nhau." },
    ],
    glossary: [
      { word: "parents", meaning: "bố mẹ" },
      { word: "grandmother", meaning: "bà" },
      { word: "primary school", meaning: "trường tiểu học" },
      { word: "kind", meaning: "tốt bụng, hiền" },
      { word: "delicious", meaning: "ngon" },
      { word: "together", meaning: "cùng nhau" },
    ],
    questions: [
      { id: "rd-fam-1", type: "mcq", prompt: "How many people are there in Linh's family?", options: ["Four", "Five", "Six", "Seven"], answer: 1, explanation: "“There are five people in my family.”" },
      { id: "rd-fam-2", type: "mcq", prompt: "What does Linh's mother do?", options: ["She is a doctor.", "She is a cook.", "She is a teacher.", "She is a student."], answer: 2, explanation: "“My mother is a teacher at a primary school.”" },
      { id: "rd-fam-3", type: "gap_fill", prompt: "Nam plays football every ___.", answers: ["afternoon"], explanation: "“he plays with his friends every afternoon.”" },
      { id: "rd-fam-4", type: "mcq", prompt: "When does the family eat lunch together?", options: ["Every day", "On Saturdays", "On Sundays", "Never"], answer: 2, explanation: "“on Sundays we all eat lunch together.”" },
      {
        id: "rd-fam-5", type: "matching", prompt: "Nối người với thông tin đúng",
        left: ["Father", "Nam", "Grandmother"], right: ["cooks delicious food", "is a doctor", "is seven"], pairs: [1, 2, 0],
        explanation: "Bố là bác sĩ, Nam bảy tuổi, bà nấu ăn ngon.",
      },
    ],
  },
  {
    id: "a-day-at-school",
    title: "A Day at School",
    level: "A1",
    theme: "Trường học",
    description: "Một ngày đi học của Minh — giờ giấc và hoạt động hằng ngày.",
    paragraphs: [
      { en: "Minh is a student at Le Loi Secondary School. He gets up at six o'clock and has breakfast with his parents.", vi: "Minh là học sinh trường THCS Lê Lợi. Cậu ấy dậy lúc sáu giờ và ăn sáng cùng bố mẹ." },
      { en: "School starts at seven. Minh goes to school by bike. It takes about fifteen minutes.", vi: "Trường vào học lúc bảy giờ. Minh đi học bằng xe đạp. Mất khoảng mười lăm phút." },
      { en: "His favourite subject is English because the lessons are fun. He doesn't like maths very much, but he always does his homework.", vi: "Môn yêu thích của Minh là tiếng Anh vì giờ học rất vui. Cậu không thích toán lắm, nhưng luôn làm bài tập về nhà." },
      { en: "At break time, he plays badminton with his classmates. School finishes at eleven thirty, and Minh goes home for lunch.", vi: "Giờ ra chơi, cậu chơi cầu lông với các bạn cùng lớp. Trường tan lúc mười một giờ rưỡi, và Minh về nhà ăn trưa." },
    ],
    glossary: [
      { word: "secondary school", meaning: "trường trung học cơ sở" },
      { word: "favourite subject", meaning: "môn học yêu thích" },
      { word: "homework", meaning: "bài tập về nhà" },
      { word: "break time", meaning: "giờ ra chơi" },
      { word: "classmates", meaning: "bạn cùng lớp" },
    ],
    questions: [
      { id: "rd-sch-1", type: "mcq", prompt: "How does Minh go to school?", options: ["By bus", "On foot", "By bike", "By car"], answer: 2, explanation: "“Minh goes to school by bike.”" },
      { id: "rd-sch-2", type: "mcq", prompt: "Why does Minh like English?", options: ["Because it is easy.", "Because the lessons are fun.", "Because his mother is an English teacher.", "Because he has no homework."], answer: 1, explanation: "“because the lessons are fun.”" },
      { id: "rd-sch-3", type: "gap_fill", prompt: "At break time, Minh plays ___ with his classmates.", answers: ["badminton"], explanation: "“he plays badminton with his classmates.”" },
      { id: "rd-sch-4", type: "mcq", prompt: "Which sentence is TRUE?", options: ["Minh never does his homework.", "School starts at six.", "Minh has lunch at home.", "Minh loves maths."], answer: 2, explanation: "“Minh goes home for lunch.”" },
      { id: "rd-sch-5", type: "mcq", prompt: "How long does it take Minh to get to school?", options: ["Five minutes", "Fifteen minutes", "Thirty minutes", "One hour"], answer: 1, explanation: "“It takes about fifteen minutes.”" },
    ],
  },
  {
    id: "my-city",
    title: "Welcome to Hue",
    level: "A1",
    theme: "Thành phố",
    description: "Giới thiệu thành phố Huế — there is / there are, tính từ miêu tả.",
    paragraphs: [
      { en: "Hue is a city in the centre of Vietnam. It is quiet and beautiful. The Perfume River runs through the city.", vi: "Huế là một thành phố ở miền Trung Việt Nam. Thành phố yên bình và đẹp. Sông Hương chảy qua thành phố." },
      { en: "There are many old buildings in Hue, and there is a big citadel. Lots of tourists visit it every year.", vi: "Ở Huế có nhiều công trình cổ, và có một tòa thành lớn. Rất nhiều khách du lịch đến thăm mỗi năm." },
      { en: "The food in Hue is famous. Bun bo Hue is a spicy noodle soup, and it is very popular.", vi: "Đồ ăn ở Huế rất nổi tiếng. Bún bò Huế là món bún nước có vị cay, và rất được ưa chuộng." },
      { en: "It often rains in Hue from September to December, so bring an umbrella!", vi: "Từ tháng Chín đến tháng Mười hai, ở Huế hay mưa, nên hãy mang theo ô nhé!" },
    ],
    glossary: [
      { word: "centre", meaning: "trung tâm, miền giữa" },
      { word: "quiet", meaning: "yên tĩnh" },
      { word: "citadel", meaning: "thành, kinh thành" },
      { word: "tourists", meaning: "khách du lịch" },
      { word: "spicy", meaning: "cay" },
      { word: "umbrella", meaning: "cái ô" },
    ],
    questions: [
      { id: "rd-hue-1", type: "mcq", prompt: "Where is Hue?", options: ["In the north of Vietnam", "In the centre of Vietnam", "In the south of Vietnam", "Near Hanoi"], answer: 1, explanation: "“Hue is a city in the centre of Vietnam.”" },
      { id: "rd-hue-2", type: "gap_fill", prompt: "The ___ River runs through the city.", answers: ["Perfume"], explanation: "“The Perfume River runs through the city.”" },
      { id: "rd-hue-3", type: "mcq", prompt: "What is bun bo Hue?", options: ["A sweet cake", "A spicy noodle soup", "A kind of tea", "A river"], answer: 1, explanation: "“Bun bo Hue is a spicy noodle soup.”" },
      { id: "rd-hue-4", type: "mcq", prompt: "Why should visitors bring an umbrella?", options: ["It is very sunny.", "It often rains from September to December.", "It snows in winter.", "The citadel has no roof."], answer: 1, explanation: "“It often rains in Hue from September to December.”" },
      { id: "rd-hue-5", type: "mcq", prompt: "Which word describes Hue in the text?", options: ["noisy", "quiet", "modern", "dangerous"], answer: 1, explanation: "“It is quiet and beautiful.”" },
    ],
  },

  /* ---------------- A2 ---------------- */
  {
    id: "weekend-trip",
    title: "A Weekend in Da Lat",
    level: "A2",
    theme: "Du lịch",
    description: "Chuyến đi cuối tuần — quá khứ đơn và từ nối.",
    paragraphs: [
      { en: "Last weekend, my friends and I took a night bus to Da Lat. We left Ho Chi Minh City at ten in the evening and arrived early the next morning.", vi: "Cuối tuần trước, mình và các bạn đi xe khách đêm lên Đà Lạt. Chúng mình rời TP. Hồ Chí Minh lúc mười giờ tối và đến nơi sáng sớm hôm sau." },
      { en: "The weather was cool and fresh, so we wore jackets all day. In the morning, we visited a flower garden and took a lot of photos.", vi: "Thời tiết mát mẻ, trong lành nên cả ngày chúng mình mặc áo khoác. Buổi sáng, chúng mình đi vườn hoa và chụp rất nhiều ảnh." },
      { en: "In the afternoon, we rented bikes and rode around Xuan Huong Lake. It was tiring but really fun.", vi: "Buổi chiều, chúng mình thuê xe đạp đạp quanh hồ Xuân Hương. Mệt nhưng rất vui." },
      { en: "At night, we went to the night market. I tried grilled rice paper for the first time, and it was delicious. I want to go back there next year.", vi: "Buổi tối, chúng mình đi chợ đêm. Lần đầu tiên mình ăn bánh tráng nướng, ngon lắm. Năm sau mình muốn quay lại đó." },
    ],
    glossary: [
      { word: "night bus", meaning: "xe khách đi đêm" },
      { word: "cool and fresh", meaning: "mát mẻ, trong lành" },
      { word: "rented", meaning: "đã thuê (rent)" },
      { word: "tiring", meaning: "mệt, gây mệt" },
      { word: "for the first time", meaning: "lần đầu tiên" },
    ],
    questions: [
      { id: "rd-dl-1", type: "mcq", prompt: "How did they travel to Da Lat?", options: ["By plane", "By train", "By night bus", "By motorbike"], answer: 2, explanation: "“we took a night bus to Da Lat.”" },
      { id: "rd-dl-2", type: "mcq", prompt: "Why did they wear jackets?", options: ["Because it was raining.", "Because the weather was cool.", "Because they were at the market.", "Because jackets were cheap."], answer: 1, explanation: "“The weather was cool and fresh, so we wore jackets.”" },
      { id: "rd-dl-3", type: "verb_form", prompt: "In the afternoon, they ___ around Xuan Huong Lake.", base: "ride", answers: ["rode"], explanation: "Quá khứ của ride là rode: “we rented bikes and rode around Xuan Huong Lake.”" },
      { id: "rd-dl-4", type: "mcq", prompt: "What did the writer eat for the first time?", options: ["Grilled rice paper", "Pho", "Strawberries", "Banh mi"], answer: 0, explanation: "“I tried grilled rice paper for the first time.”" },
      { id: "rd-dl-5", type: "mcq", prompt: "How did the writer feel about the trip?", options: ["Bored", "Angry", "Happy — the writer wants to go back", "Scared"], answer: 2, explanation: "“I want to go back there next year.”" },
    ],
  },
  {
    id: "healthy-habits",
    title: "Healthy Habits",
    level: "A2",
    theme: "Sức khỏe",
    description: "Lời khuyên sống khỏe — should, imperatives, so sánh.",
    paragraphs: [
      { en: "Many people want to be healthier, but they think it is difficult. In fact, small changes can make a big difference.", vi: "Nhiều người muốn khỏe hơn nhưng nghĩ rằng điều đó khó. Thực ra, những thay đổi nhỏ có thể tạo nên khác biệt lớn." },
      { en: "First, you should drink more water. Water is better for you than soft drinks, and it is free!", vi: "Thứ nhất, bạn nên uống nhiều nước hơn. Nước tốt cho bạn hơn nước ngọt, mà lại miễn phí!" },
      { en: "Second, try to walk for thirty minutes every day. You don't need to go to a gym. You can walk to work or take the stairs instead of the lift.", vi: "Thứ hai, hãy cố đi bộ ba mươi phút mỗi ngày. Bạn không cần đến phòng gym. Bạn có thể đi bộ đi làm hoặc đi cầu thang bộ thay vì thang máy." },
      { en: "Finally, sleep is very important. Adults should sleep for seven to eight hours a night. Turn off your phone an hour before bed — you will sleep much better.", vi: "Cuối cùng, giấc ngủ rất quan trọng. Người lớn nên ngủ bảy đến tám tiếng mỗi đêm. Hãy tắt điện thoại một tiếng trước khi ngủ — bạn sẽ ngủ ngon hơn nhiều." },
    ],
    glossary: [
      { word: "healthier", meaning: "khỏe mạnh hơn" },
      { word: "make a big difference", meaning: "tạo khác biệt lớn" },
      { word: "soft drinks", meaning: "nước ngọt có ga" },
      { word: "take the stairs", meaning: "đi cầu thang bộ" },
      { word: "instead of", meaning: "thay vì" },
      { word: "adults", meaning: "người lớn" },
    ],
    questions: [
      { id: "rd-hh-1", type: "mcq", prompt: "What is the main idea of the text?", options: ["Gyms are expensive.", "Small changes can make you healthier.", "Phones are bad.", "Water is free."], answer: 1, explanation: "Đoạn đầu nêu ý chính: “small changes can make a big difference.”" },
      { id: "rd-hh-2", type: "gap_fill", prompt: "Water is ___ for you than soft drinks.", answers: ["better"], explanation: "“Water is better for you than soft drinks.”" },
      { id: "rd-hh-3", type: "mcq", prompt: "According to the text, you ___ go to a gym.", options: ["must", "don't need to", "should", "can't"], answer: 1, explanation: "“You don't need to go to a gym.”" },
      { id: "rd-hh-4", type: "mcq", prompt: "How many hours should adults sleep?", options: ["Five to six", "Six to seven", "Seven to eight", "Nine to ten"], answer: 2, explanation: "“Adults should sleep for seven to eight hours a night.”" },
      { id: "rd-hh-5", type: "mcq", prompt: "When should you turn off your phone?", options: ["When you wake up", "An hour before bed", "During lunch", "At work"], answer: 1, explanation: "“Turn off your phone an hour before bed.”" },
    ],
  },
  {
    id: "online-shopping",
    title: "Shopping Online",
    level: "A2",
    theme: "Mua sắm",
    description: "Ưu và nhược điểm của mua sắm trực tuyến — but, because, so, comparatives.",
    paragraphs: [
      { en: "These days, more and more people in Vietnam shop online. They buy clothes, food and even furniture on their phones.", vi: "Ngày nay, ngày càng nhiều người Việt Nam mua sắm trực tuyến. Họ mua quần áo, đồ ăn và cả đồ nội thất trên điện thoại." },
      { en: "Online shopping is convenient because you can buy things at any time. Prices are often cheaper than in shops, and there are many discounts.", vi: "Mua sắm trực tuyến tiện lợi vì bạn có thể mua bất cứ lúc nào. Giá thường rẻ hơn ở cửa hàng và có nhiều giảm giá." },
      { en: "However, there are some problems. Sometimes the product looks different from the photo, or the size is wrong. Then you have to send it back.", vi: "Tuy nhiên, cũng có vài vấn đề. Đôi khi sản phẩm trông khác ảnh, hoặc sai kích cỡ. Khi đó bạn phải gửi trả lại." },
      { en: "So before you buy, read the reviews carefully and check the return policy.", vi: "Vì vậy, trước khi mua, hãy đọc kỹ đánh giá và kiểm tra chính sách đổi trả." },
    ],
    glossary: [
      { word: "furniture", meaning: "đồ nội thất" },
      { word: "convenient", meaning: "tiện lợi" },
      { word: "discounts", meaning: "giảm giá" },
      { word: "send it back", meaning: "gửi trả lại" },
      { word: "reviews", meaning: "đánh giá, nhận xét" },
      { word: "return policy", meaning: "chính sách đổi trả" },
    ],
    questions: [
      { id: "rd-os-1", type: "mcq", prompt: "Why is online shopping convenient?", options: ["You can buy things at any time.", "Products are always perfect.", "You never pay.", "Shops are closed."], answer: 0, explanation: "“because you can buy things at any time.”" },
      { id: "rd-os-2", type: "mcq", prompt: "Which is a problem with online shopping?", options: ["Prices are too low.", "The size can be wrong.", "There are too many reviews.", "It is slow to order."], answer: 1, explanation: "“or the size is wrong.”" },
      { id: "rd-os-3", type: "gap_fill", prompt: "Prices online are often ___ than in shops.", answers: ["cheaper"], explanation: "“Prices are often cheaper than in shops.”" },
      { id: "rd-os-4", type: "mcq", prompt: "What does the writer advise?", options: ["Never shop online.", "Buy the cheapest product.", "Read reviews and check the return policy.", "Only buy furniture."], answer: 2, explanation: "Đoạn cuối: “read the reviews carefully and check the return policy.”" },
      { id: "rd-os-5", type: "mcq", prompt: "The word “However” in paragraph 3 introduces ___.", options: ["an example", "a contrast", "a reason", "a result"], answer: 1, explanation: "However mở ra ý trái ngược: sau ưu điểm là nhược điểm." },
    ],
  },

  /* ---------------- B1 ---------------- */
  {
    id: "remote-work",
    title: "Working from Home",
    level: "B1",
    theme: "Công việc",
    description: "Làm việc từ xa — hiện tại hoàn thành, so sánh, từ nối đối lập.",
    paragraphs: [
      { en: "Over the past few years, working from home has become normal for millions of people. Many companies have realised that their staff can work just as well outside the office.", vi: "Vài năm qua, làm việc tại nhà đã trở nên bình thường với hàng triệu người. Nhiều công ty nhận ra nhân viên có thể làm việc tốt ngang ngửa khi ở ngoài văn phòng." },
      { en: "For employees, the biggest advantage is time. They no longer spend hours in traffic, so they have more time for their families and hobbies. Some people also say they can concentrate better at home.", vi: "Với nhân viên, lợi ích lớn nhất là thời gian. Họ không còn mất hàng giờ kẹt xe nên có thêm thời gian cho gia đình và sở thích. Một số người còn nói họ tập trung tốt hơn khi ở nhà." },
      { en: "However, working from home is not perfect. Some workers feel lonely because they rarely see their colleagues. Others find it hard to stop working in the evening, since their office is also their living room.", vi: "Tuy nhiên, làm việc tại nhà không hoàn hảo. Một số người thấy cô đơn vì ít gặp đồng nghiệp. Người khác thấy khó dừng làm việc vào buổi tối vì văn phòng cũng chính là phòng khách." },
      { en: "As a result, many companies now offer a hybrid model: employees work in the office for two or three days a week and at home for the rest.", vi: "Vì vậy, nhiều công ty giờ áp dụng mô hình kết hợp: nhân viên làm ở văn phòng hai hoặc ba ngày mỗi tuần, những ngày còn lại làm ở nhà." },
    ],
    glossary: [
      { word: "staff", meaning: "nhân viên (nói chung)" },
      { word: "advantage", meaning: "lợi ích, ưu điểm" },
      { word: "concentrate", meaning: "tập trung" },
      { word: "colleagues", meaning: "đồng nghiệp" },
      { word: "as a result", meaning: "kết quả là, vì vậy" },
      { word: "hybrid model", meaning: "mô hình kết hợp" },
    ],
    questions: [
      { id: "rd-rw-1", type: "mcq", prompt: "What is the biggest advantage of working from home for employees?", options: ["Higher salaries", "More time", "Bigger offices", "Free lunch"], answer: 1, explanation: "“the biggest advantage is time.”" },
      { id: "rd-rw-2", type: "mcq", prompt: "Why do some workers feel lonely?", options: ["They live alone.", "They rarely see their colleagues.", "They work at night.", "They have no hobbies."], answer: 1, explanation: "“because they rarely see their colleagues.”" },
      { id: "rd-rw-3", type: "mcq", prompt: "What does “hybrid model” mean in the text?", options: ["Working only at home", "Working only in the office", "Working partly in the office and partly at home", "Working at weekends"], answer: 2, explanation: "Đoạn cuối giải thích: vài ngày ở văn phòng, còn lại ở nhà." },
      { id: "rd-rw-4", type: "gap_fill", prompt: "Some people find it hard to stop working because their office is also their living ___.", answers: ["room"], explanation: "“since their office is also their living room.”" },
      { id: "rd-rw-5", type: "mcq", prompt: "What is the writer's attitude?", options: ["Working from home is perfect.", "Working from home is a terrible idea.", "It has advantages and disadvantages.", "Offices will disappear."], answer: 2, explanation: "Bài nêu cả ưu điểm (đoạn 2) và nhược điểm (đoạn 3)." },
      { id: "rd-rw-6", type: "transform", prompt: "Working from home became normal a few years ago and it is still normal.", starter: "Working from home has", answers: ["Working from home has become normal.", "Working from home has become normal over the past few years.", "Working from home has been normal for a few years.", "Working from home has become normal for millions of people."], explanation: "Việc bắt đầu trong quá khứ, còn đúng đến giờ → has become." },
    ],
  },
  {
    id: "plastic-problem",
    title: "The Plastic Problem",
    level: "B1",
    theme: "Môi trường",
    description: "Rác thải nhựa — câu bị động, if loại 1, unless.",
    paragraphs: [
      { en: "Every year, millions of tonnes of plastic are thrown away around the world. A lot of it is not recycled. Instead, it ends up in rivers and oceans.", vi: "Mỗi năm, hàng triệu tấn nhựa bị vứt bỏ trên khắp thế giới. Phần lớn không được tái chế mà trôi ra sông và đại dương." },
      { en: "Plastic can take hundreds of years to break down. Sea animals such as turtles often mistake plastic bags for food, and many of them die as a result.", vi: "Nhựa có thể mất hàng trăm năm để phân hủy. Động vật biển như rùa thường nhầm túi nhựa là thức ăn, và nhiều con chết vì vậy." },
      { en: "Vietnam has started to take action. Some supermarkets now wrap vegetables in banana leaves, and many cafés have replaced plastic straws with paper or bamboo ones.", vi: "Việt Nam đã bắt đầu hành động. Một số siêu thị giờ gói rau bằng lá chuối, và nhiều quán cà phê đã thay ống hút nhựa bằng ống hút giấy hoặc tre." },
      { en: "Individuals can help too. If you carry your own bag and water bottle, you will use far less plastic. Unless we change our habits, there may be more plastic than fish in the sea by 2050.", vi: "Mỗi người cũng có thể góp sức. Nếu bạn mang túi và bình nước riêng, bạn sẽ dùng ít nhựa hơn nhiều. Nếu chúng ta không thay đổi thói quen, đến năm 2050 có thể biển sẽ có nhiều nhựa hơn cá." },
    ],
    glossary: [
      { word: "thrown away", meaning: "bị vứt bỏ (throw away)" },
      { word: "recycled", meaning: "được tái chế" },
      { word: "break down", meaning: "phân hủy" },
      { word: "mistake A for B", meaning: "nhầm A là B" },
      { word: "take action", meaning: "hành động" },
      { word: "straws", meaning: "ống hút" },
    ],
    questions: [
      { id: "rd-pl-1", type: "mcq", prompt: "Where does a lot of plastic end up?", options: ["In factories", "In rivers and oceans", "In supermarkets", "In space"], answer: 1, explanation: "“it ends up in rivers and oceans.”" },
      { id: "rd-pl-2", type: "mcq", prompt: "Why do many turtles die?", options: ["The water is too hot.", "They eat plastic bags by mistake.", "People hunt them.", "They cannot swim."], answer: 1, explanation: "“turtles often mistake plastic bags for food.”" },
      { id: "rd-pl-3", type: "mcq", prompt: "What have some supermarkets in Vietnam done?", options: ["Stopped selling vegetables", "Wrapped vegetables in banana leaves", "Sold more plastic bags", "Closed down"], answer: 1, explanation: "“Some supermarkets now wrap vegetables in banana leaves.”" },
      { id: "rd-pl-4", type: "verb_form", prompt: "Millions of tonnes of plastic ___ away every year.", base: "throw", answers: ["are thrown"], explanation: "Bị động hiện tại đơn: are thrown." },
      { id: "rd-pl-5", type: "transform", prompt: "If we don't change our habits, there may be more plastic than fish.", starter: "Unless", answers: ["Unless we change our habits, there may be more plastic than fish.", "Unless we change our habits, there may be more plastic than fish in the sea."], explanation: "if ... don't → unless + khẳng định." },
      { id: "rd-pl-6", type: "mcq", prompt: "Which is NOT mentioned as a way to help?", options: ["Carrying your own bag", "Using a water bottle", "Using paper or bamboo straws", "Burning plastic at home"], answer: 3, explanation: "Bài không nhắc đến việc đốt nhựa." },
    ],
  },
];

export function getReading(id: string): ReadingPassage | undefined {
  return READINGS.find((r) => r.id === id);
}
