/** Kiểm tra tài khoản có được đăng nhập không (hàm thuần — dùng ở cả đăng nhập mật khẩu, Google và mỗi phiên). */
export interface AccessFields {
  disabled?: boolean | null;
  accessUntil?: Date | null;
}

/** Lý do không cho đăng nhập (chuỗi rỗng = được phép). */
export function accountBlockReason(user: AccessFields | null | undefined, now = new Date()): string {
  if (!user) return "";
  if (user.disabled) return "Tài khoản đã bị quản trị viên khoá. Liên hệ EngQuiz nếu bạn cần mở lại.";
  if (user.accessUntil && new Date(user.accessUntil).getTime() <= now.getTime()) return "Tài khoản đã hết thời hạn sử dụng. Liên hệ EngQuiz để gia hạn.";
  return "";
}
