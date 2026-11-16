import { COMPLAINT_REPLY_WORKING_DAYS, MIN_SELF_CONSENT_AGE } from "@/lib/legal-policy";
import type { LegalContext, LegalDoc } from "./types";

/**
 * Chính sách bảo mật theo Luật Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15, hiệu lực 01/01/2026).
 * Mỗi dòng phải khớp với dữ liệu thật trong prisma/schema.prisma và các bên nhận dữ liệu thật trong code:
 * thêm cột / thêm dịch vụ bên ngoài thì sửa văn bản này và tăng LEGAL_VERSION.
 */
export function privacyDoc({ business: b }: LegalContext): LegalDoc {
  return {
    slug: "privacy",
    title: "Chính sách bảo mật dữ liệu cá nhân",
    summary: "EngQuiz thu thập dữ liệu gì, dùng để làm gì, chia sẻ cho ai (kể cả ra nước ngoài), lưu bao lâu và quyền của bạn.",
    sections: [
      {
        heading: "1. Bên kiểm soát và xử lý dữ liệu",
        blocks: [
          `${b.name} (cá nhân kinh doanh, mã số thuế: ${b.taxCode}, địa chỉ: ${b.address}) là bên kiểm soát và xử lý dữ liệu cá nhân của bạn trên EngQuiz. Liên hệ về dữ liệu cá nhân: ${b.email}.`,
        ],
      },
      {
        heading: "2. Dữ liệu EngQuiz thu thập",
        blocks: [
          {
            list: [
              "Tài khoản: email, tên hiển thị, mật khẩu (chỉ lưu dạng băm, EngQuiz không đọc được mật khẩu gốc), thời điểm đăng ký và thời điểm bạn đồng ý điều khoản.",
              "Nếu đăng nhập bằng Google: tên, email và ảnh đại diện do Google cung cấp.",
              "Dữ liệu học: tiến độ bài học, kết quả quiz và nghe chép, điểm XP, chuỗi ngày học, lộ trình (trình độ tự chọn, mục tiêu, số phút mỗi ngày, ngày bắt đầu) và nhật ký luyện nói (số giây nói, các bài đã hoàn thành trong lộ trình).",
              "Gói AI: mã đơn, gói, số tiền, trạng thái, thời điểm tạo và thanh toán, ngày hết hạn gói, số lượt AI đã dùng mỗi ngày.",
              "Kỹ thuật: cookie phiên đăng nhập (bắt buộc để đăng nhập) và địa chỉ IP (chỉ giữ tạm trong bộ nhớ máy chủ để chống spam, không ghi vào cơ sở dữ liệu).",
            ],
          },
          "EngQuiz không thu thập số CCCD, thông tin thẻ hay tài khoản ngân hàng của bạn. Bạn chuyển khoản qua app ngân hàng của mình; EngQuiz chỉ đối chiếu số tiền và nội dung chuyển khoản (mã đơn).",
          "EngQuiz không dùng công cụ quảng cáo hay theo dõi hành vi của bên thứ ba.",
        ],
      },
      {
        heading: "3. Bài nói và tính năng AI",
        blocks: [
          "Khi bạn luyện nói, trình duyệt chuyển giọng nói thành chữ bằng dịch vụ nhận dạng giọng nói có sẵn của trình duyệt. Với một số trình duyệt (ví dụ Google Chrome), âm thanh có thể được gửi tới máy chủ của nhà cung cấp trình duyệt để nhận dạng. EngQuiz không nhận và không lưu file âm thanh.",
          "Chỉ khi bạn bấm “AI chấm & sửa lỗi”, EngQuiz mới gửi phần chữ đã nhận dạng, đề nói, trình độ bạn tự chọn và thời lượng nói tới dịch vụ AI để chấm. EngQuiz không lưu nội dung bài nói hay kết quả chấm trên máy chủ, và không ghi nội dung bài nói vào nhật ký lỗi.",
          "Đừng nói thông tin cá nhân nhạy cảm (số giấy tờ tuỳ thân, tình trạng sức khoẻ, thông tin tài chính, tài khoản ngân hàng, mật khẩu…) khi luyện nói.",
        ],
      },
      {
        heading: "4. Mục đích xử lý",
        blocks: [
          {
            list: [
              "Tạo và quản lý tài khoản, đăng nhập, xác thực email, đặt lại mật khẩu.",
              "Lưu và đồng bộ tiến độ học giữa các thiết bị.",
              "Chấm và sửa bài nói bằng AI khi bạn yêu cầu.",
              "Xử lý đơn mua gói, kích hoạt gói, đối soát thanh toán, hoàn tiền và giải quyết khiếu nại.",
              "Ghi sổ doanh thu và thực hiện nghĩa vụ kế toán, thuế theo quy định.",
              "Chống gian lận, spam và bảo vệ an toàn hệ thống.",
            ],
          },
          "EngQuiz không bán dữ liệu cá nhân và không dùng dữ liệu của bạn cho mục đích quảng cáo.",
        ],
      },
      {
        heading: "5. Bên nhận dữ liệu và chuyển dữ liệu ra nước ngoài",
        blocks: [
          {
            list: [
              "Anthropic, PBC (Hoa Kỳ), nhà cung cấp mô hình AI Claude: nhận phần chữ của bài nói, đề nói, trình độ và thời lượng khi bạn yêu cầu AI chấm. Đây là việc chuyển dữ liệu ra nước ngoài, chỉ xảy ra khi bạn dùng tính năng AI. Theo điều khoản thương mại hiện hành của Anthropic, dữ liệu gửi qua API không được dùng để huấn luyện mô hình theo mặc định.",
              "Google LLC (Hoa Kỳ): xác thực khi bạn chọn đăng nhập bằng Google; cung cấp phông chữ cho website (trình duyệt tải phông từ máy chủ Google nên Google nhận được địa chỉ IP của bạn).",
              "Nhà cung cấp dịch vụ gửi email: nhận địa chỉ email của bạn để gửi mã xác thực, thông báo đơn hàng và kích hoạt gói.",
              "Dịch vụ tạo ảnh mã QR VietQR: nhận số tài khoản nhận tiền của EngQuiz, số tiền và mã đơn để vẽ ảnh QR. Không nhận email hay tên của bạn.",
              "Cơ quan nhà nước có thẩm quyền, khi pháp luật yêu cầu.",
            ],
          },
        ],
      },
      {
        heading: "6. Thời gian lưu trữ",
        blocks: [
          {
            list: [
              "Tài khoản và dữ liệu học: lưu cho tới khi bạn yêu cầu xoá tài khoản.",
              "Tài khoản đăng ký nhưng chưa xác thực email: có thể bị xoá sau một thời gian.",
              "Đơn hàng và chứng từ thanh toán: lưu trong thời hạn pháp luật về kế toán và thuế yêu cầu, kể cả khi tài khoản đã bị xoá (khi đó chỉ giữ thông tin cần thiết cho sổ sách).",
              "Nội dung bài nói gửi cho AI: EngQuiz không lưu.",
            ],
          },
        ],
      },
      {
        heading: "7. Quyền của bạn",
        blocks: [
          "Bạn có quyền được biết về việc xử lý dữ liệu, đồng ý hoặc rút lại sự đồng ý, xem và chỉnh sửa dữ liệu, yêu cầu xoá dữ liệu, hạn chế hoặc phản đối việc xử lý, nhận bản sao dữ liệu, và khiếu nại, tố cáo, khởi kiện theo quy định của pháp luật.",
          `Gửi yêu cầu tới ${b.email} từ email của tài khoản. EngQuiz trả lời trong vòng ${COMPLAINT_REPLY_WORKING_DAYS} ngày làm việc. Rút lại sự đồng ý hoặc xoá tài khoản không ảnh hưởng tới việc xử lý đã làm hợp pháp trước đó. Sau khi xoá tài khoản, bạn không thể dùng tiếp phần còn lại của gói AI.`,
          `Người dưới ${MIN_SELF_CONSENT_AGE} tuổi cần cha mẹ hoặc người giám hộ đồng ý. Cha mẹ, người giám hộ có thể liên hệ để xem hoặc xoá dữ liệu của con.`,
        ],
      },
      {
        heading: "8. Bảo vệ dữ liệu",
        blocks: [
          "Mật khẩu được băm bằng scrypt. Kết nối dùng HTTPS khi website chạy công khai. Khoá truy cập dịch vụ AI chỉ nằm trên máy chủ. Quyền quản trị giới hạn trong danh sách email được chỉ định.",
          "Nếu xảy ra sự cố lộ lọt dữ liệu, EngQuiz sẽ thông báo cho người bị ảnh hưởng và cơ quan có thẩm quyền theo thời hạn pháp luật quy định.",
        ],
      },
      {
        heading: "9. Cookie và bộ nhớ trình duyệt",
        blocks: [
          "EngQuiz chỉ dùng cookie cần thiết cho việc đăng nhập. Tiến độ khi học thử và lựa chọn giao diện sáng/tối được lưu trong bộ nhớ của trình duyệt (localStorage) trên máy của bạn. Bạn có thể xoá dữ liệu này trong cài đặt trình duyệt.",
        ],
      },
    ],
  };
}
