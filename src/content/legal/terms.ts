import { COMPLAINT_REPLY_WORKING_DAYS, MIN_SELF_CONSENT_AGE } from "@/lib/legal-policy";
import { GUEST_TRIAL_ITEMS } from "@/lib/plans";
import type { LegalContext, LegalDoc } from "./types";

export function termsDoc({ business: b }: LegalContext): LegalDoc {
  return {
    slug: "terms",
    title: "Điều khoản sử dụng",
    summary: "Quy định chung khi dùng EngQuiz: tài khoản, nội dung học, hành vi bị cấm, trách nhiệm và giải quyết khiếu nại.",
    sections: [
      {
        heading: "1. Về EngQuiz và người bán",
        blocks: [
          `EngQuiz là website học tiếng Anh (lý thuyết ngữ pháp, quiz, nghe chép, luyện phát âm và luyện nói). Website do ${b.name} sở hữu và vận hành với tư cách cá nhân kinh doanh. Mã số thuế: ${b.taxCode}.`,
          `Địa chỉ: ${b.address}. Email: ${b.email}. Điện thoại: ${b.phone}.`,
          "Khi tạo tài khoản, mua gói hoặc tiếp tục sử dụng EngQuiz, bạn đồng ý với Điều khoản này, Chính sách bảo mật, Điều khoản sử dụng AI và Chính sách thanh toán, gia hạn & hoàn tiền.",
        ],
      },
      {
        heading: "2. Tài khoản",
        blocks: [
          {
            list: [
              `Khách chưa đăng nhập được học thử ${GUEST_TRIAL_ITEMS} bài; tiến độ chỉ lưu trên trình duyệt của bạn.`,
              "Tài khoản miễn phí dùng được mọi tính năng không cần AI và được tặng một số lượt AI dùng thử.",
              "Bạn cung cấp email thật mà bạn quản lý, giữ bí mật mật khẩu và chịu trách nhiệm về hoạt động trên tài khoản của mình.",
              "Mỗi người một tài khoản. Không chia sẻ, cho thuê hoặc bán lại tài khoản hay gói AI.",
              `Người dưới ${MIN_SELF_CONSENT_AGE} tuổi cần cha mẹ hoặc người giám hộ đồng ý trước khi đăng ký và mua gói.`,
            ],
          },
        ],
      },
      {
        heading: "3. Nội dung học và quyền sở hữu trí tuệ",
        blocks: [
          "Bài lý thuyết, câu hỏi, bài nghe, đề nói và giao diện của EngQuiz thuộc quyền của chủ sở hữu website. Bạn được dùng cho việc học cá nhân, không được sao chép hàng loạt, bán lại hoặc đăng lại ở nơi khác khi chưa được đồng ý bằng văn bản.",
          "Nội dung bạn tạo ra (bài nói, ghi chú) vẫn thuộc về bạn. Bạn cho phép EngQuiz xử lý nội dung đó trong phạm vi cần thiết để cung cấp dịch vụ, như mô tả trong Chính sách bảo mật.",
        ],
      },
      {
        heading: "4. Hành vi bị cấm",
        blocks: [
          {
            list: [
              "Dùng công cụ tự động, script hoặc tạo nhiều tài khoản để vượt giới hạn lượt dùng, lượt AI hay lượt dùng thử.",
              "Tấn công, dò lỗi trái phép, làm quá tải hoặc cản trở hoạt động của website.",
              "Gửi nội dung vi phạm pháp luật Việt Nam, xúc phạm, quấy rối hoặc xâm phạm quyền của người khác.",
              "Mạo danh người khác hoặc dùng thông tin thanh toán không thuộc quyền của bạn.",
            ],
          },
          "Khi phát hiện vi phạm, EngQuiz có thể tạm khoá hoặc chấm dứt tài khoản. Trường hợp vi phạm nghiêm trọng, gói AI đã mua không được hoàn tiền.",
        ],
      },
      {
        heading: "5. Dịch vụ và giới hạn trách nhiệm",
        blocks: [
          "EngQuiz cố gắng duy trì website hoạt động ổn định nhưng không cam kết không bao giờ gián đoạn: có thể có lúc bảo trì, lỗi mạng hoặc lỗi từ nhà cung cấp bên thứ ba (dịch vụ AI, email, ngân hàng).",
          "EngQuiz là công cụ hỗ trợ tự học. Điểm số và nhận xét chỉ mang tính tham khảo, không thay thế chứng chỉ, kỳ thi chính thức hay giáo viên.",
          "Trong phạm vi pháp luật cho phép, trách nhiệm bồi thường của EngQuiz đối với một gói AI không vượt quá số tiền bạn đã trả cho gói đó.",
        ],
      },
      {
        heading: "6. Khiếu nại và giải quyết tranh chấp",
        blocks: [
          `Gửi khiếu nại tới ${b.email} (ghi rõ email tài khoản, mã đơn nếu có, nội dung và bằng chứng). EngQuiz xác nhận đã nhận và trả lời trong vòng ${COMPLAINT_REPLY_WORKING_DAYS} ngày làm việc kể từ khi nhận đủ thông tin.`,
          "Tranh chấp được ưu tiên giải quyết bằng thương lượng. Nếu không thương lượng được, các bên có thể nhờ cơ quan bảo vệ quyền lợi người tiêu dùng hỗ trợ, hoặc đưa ra Toà án có thẩm quyền theo pháp luật Việt Nam.",
        ],
      },
      {
        heading: "7. Thay đổi điều khoản",
        blocks: [
          "EngQuiz có thể cập nhật các điều khoản. Thay đổi quan trọng được thông báo trên website hoặc qua email trước khi áp dụng. Các thay đổi không làm giảm quyền lợi của gói bạn đã mua trong thời hạn còn lại.",
        ],
      },
    ],
  };
}
