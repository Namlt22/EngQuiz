// Kiểm tra cấu hình SMTP trong .env (đăng nhập được vào máy chủ mail hay không) — KHÔNG gửi email.
// Chạy: npm run email:check
import "dotenv/config";
import { createTransport } from "nodemailer";

const server = process.env.EMAIL_SERVER;
if (!server) {
  console.error("EMAIL_SERVER đang trống trong .env — hãy điền rồi lưu file (xem README, mục “Gửi email đăng nhập”).");
  process.exit(1);
}

const masked = server.replace(/(:\/\/[^:]*):[^@]*@/, "$1:****@");
console.log(`Đang kiểm tra ${masked} ...`);

try {
  await createTransport(server).verify();
  console.log(`OK: đăng nhập SMTP thành công. Email sẽ gửi từ: ${process.env.EMAIL_FROM ?? "(chưa đặt EMAIL_FROM)"}`);
} catch (e) {
  console.error(`Lỗi SMTP: ${e instanceof Error ? e.message : e}`);
  console.error("Gợi ý: Gmail cần Mật khẩu ứng dụng (không phải mật khẩu thường), '@' trong email viết thành %40, cổng 465 dùng smtps://.");
  process.exit(1);
}
