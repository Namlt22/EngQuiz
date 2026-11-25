/**
 * Các con số trong chính sách (hoàn tiền, khiếu nại…) — dùng chung cho trang chính sách và trang admin
 * để chữ trên web luôn khớp với cách xử lý thật.
 */

/**
 * Phiên bản bộ điều khoản. Đổi khi nội dung thay đổi đáng kể: người đăng ký sau đó được ghi nhận đồng ý bản mới
 * (User.termsVersion), nhờ vậy biết ai đã đồng ý bản nào.
 */
export const LEGAL_VERSION = "2026-11-15";
export const LEGAL_UPDATED_VI = "15/11/2026";

/** Hoàn 100% nếu yêu cầu trong số ngày này kể từ khi gói được kích hoạt… */
export const REFUND_WINDOW_DAYS = 7;
/** …và tổng lượt AI đã dùng kể từ khi kích hoạt không vượt quá số này. */
export const REFUND_MAX_AI_TURNS = 10;
/** Thời gian chuyển trả tiền sau khi chấp nhận yêu cầu hoàn (ngày làm việc). */
export const REFUND_PAYOUT_WORKING_DAYS = 7;
/** AI không dùng được liên tục quá số giờ này do lỗi phía EngQuiz → cộng bù thời gian gói. */
export const OUTAGE_COMPENSATION_HOURS = 48;
/** Thời hạn trả lời khiếu nại (ngày làm việc kể từ khi nhận đủ thông tin). */
export const COMPLAINT_REPLY_WORKING_DAYS = 7;
/** Đã chuyển khoản mà quá số giờ làm việc này chưa được kích hoạt → người mua nên liên hệ. */
export const ACTIVATION_SLA_WORKING_HOURS = 24;
/** Tuổi tối thiểu tự đăng ký; nhỏ hơn cần cha mẹ / người giám hộ đồng ý. */
export const MIN_SELF_CONSENT_AGE = 16;
