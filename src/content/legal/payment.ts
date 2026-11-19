import {
  ACTIVATION_SLA_WORKING_HOURS,
  OUTAGE_COMPENSATION_HOURS,
  REFUND_MAX_AI_TURNS,
  REFUND_PAYOUT_WORKING_DAYS,
  REFUND_WINDOW_DAYS,
} from "@/lib/legal-policy";
import { AI_DAILY_LIMIT, formatVnd, ORDER_EXPIRES_DAYS, PLANS } from "@/lib/plans";
import type { LegalContext, LegalDoc } from "./types";

export function paymentDoc({ business: b }: LegalContext): LegalDoc {
  return {
    slug: "payment",
    title: "Thanh toán, gia hạn & hoàn tiền",
    summary: "Bảng giá, thời hạn từng gói, cách thanh toán và kích hoạt, việc gia hạn và điều kiện hoàn tiền.",
    sections: [
      {
        heading: "1. Bảng giá gói AI",
        blocks: [
          { list: PLANS.map((p) => `Gói ${p.label}: ${formatVnd(p.price)}, dùng trong ${p.months} tháng kể từ ngày kích hoạt.`) },
          `Mọi gói có cùng quyền lợi: AI chấm & sửa bài nói tự do, tối đa ${AI_DAILY_LIMIT} lượt mỗi ngày. Gói dài hơn chỉ khác ở thời hạn và giá trung bình mỗi tháng.`,
          "Giá niêm yết là số tiền cuối cùng bạn trả cho EngQuiz, không cộng thêm khoản phí nào. Phí chuyển khoản (nếu ngân hàng của bạn thu) do bạn chịu.",
        ],
      },
      {
        heading: "2. Cách thanh toán và kích hoạt",
        blocks: [
          {
            list: [
              "Chọn gói ở trang Bảng giá. Hệ thống tạo một đơn có mã riêng (dạng EQXXXXXX) và mã QR chuyển khoản đã điền sẵn số tiền và nội dung.",
              "Chuyển khoản đúng số tiền và giữ nguyên nội dung là mã đơn. Tài khoản nhận tiền đứng tên chủ sở hữu EngQuiz, hiển thị ngay trên trang thanh toán.",
              `Mỗi đơn có hiệu lực ${ORDER_EXPIRES_DAYS} ngày. Quá hạn mà chưa chuyển khoản thì tạo đơn mới.`,
              `Gói được kích hoạt sau khi EngQuiz đối chiếu với sao kê ngân hàng, thường trong vài giờ (giờ hành chính). Bạn nhận email xác nhận khi gói bắt đầu. Đã chuyển khoản mà quá ${ACTIVATION_SLA_WORKING_HOURS} giờ làm việc chưa được kích hoạt, hãy liên hệ ${b.email} kèm mã đơn và ảnh biên lai.`,
              "EngQuiz chỉ kích hoạt gói khi tiền đã thực sự vào tài khoản. Ảnh chụp màn hình chuyển khoản không thay cho việc tiền đã về.",
              `Cần hoá đơn hoặc chứng từ cho việc mua gói? Liên hệ ${b.email} trước khi thanh toán.`,
            ],
          },
        ],
      },
      {
        heading: "3. Gia hạn",
        blocks: [
          {
            list: [
              "Gói AI KHÔNG tự động gia hạn và EngQuiz không tự trừ tiền của bạn. Hết hạn, gói tự dừng. Muốn dùng tiếp thì mua gói mới.",
              "Mua thêm khi gói còn hạn: thời gian mới được cộng tiếp vào ngày hết hạn hiện tại, bạn không mất ngày nào.",
              "Hết hạn gói, tài khoản trở về miễn phí. Tiến độ học và mọi tính năng không dùng AI vẫn giữ nguyên.",
            ],
          },
        ],
      },
      {
        heading: "4. Chuyển khoản sai",
        blocks: [
          {
            list: [
              "Chuyển thiếu: bạn chuyển bổ sung phần còn thiếu với cùng nội dung, hoặc yêu cầu hoàn lại số đã chuyển.",
              "Chuyển thừa: gói vẫn được kích hoạt và phần thừa được hoàn lại khi bạn yêu cầu.",
              "Ghi sai hoặc thiếu nội dung, hoặc chuyển khi đơn đã quá hạn: liên hệ kèm ảnh biên lai, EngQuiz sẽ đối chiếu rồi kích hoạt hoặc hoàn tiền.",
            ],
          },
        ],
      },
      {
        heading: "5. Hoàn tiền",
        blocks: [
          `Bạn được hoàn 100% nếu yêu cầu trong vòng ${REFUND_WINDOW_DAYS} ngày kể từ khi gói được kích hoạt và chưa dùng quá ${REFUND_MAX_AI_TURNS} lượt AI tính từ lúc kích hoạt. Khi hoàn tiền, gói tương ứng bị huỷ.`,
          `Nếu tính năng AI không dùng được liên tục quá ${OUTAGE_COMPENSATION_HOURS} giờ do lỗi phía EngQuiz, thời hạn gói được cộng bù bằng thời gian gián đoạn. Nếu bạn không muốn nhận bù, bạn có thể yêu cầu hoàn phần tiền tương ứng với số ngày còn lại.`,
          "Ngoài các trường hợp trên, gói đã kích hoạt không được hoàn tiền vì lượt AI đã sử dụng tốn chi phí thật. Gói cũng không được hoàn khi tài khoản bị khoá do vi phạm Điều khoản sử dụng.",
          `Cách yêu cầu: gửi email tới ${b.email} từ email tài khoản, ghi mã đơn và lý do. Tiền được chuyển trả về đúng tài khoản đã thanh toán trong vòng ${REFUND_PAYOUT_WORKING_DAYS} ngày làm việc kể từ khi yêu cầu được chấp nhận.`,
          "Chính sách này không hạn chế các quyền khác của bạn theo Luật Bảo vệ quyền lợi người tiêu dùng.",
        ],
      },
    ],
  };
}
