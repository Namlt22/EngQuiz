/** Email về gói AI: báo admin có đơn mới; báo người mua khi gói được kích hoạt. Gửi ở nền, lỗi chỉ ghi log. */
import { formatVnd, getPlan } from "@/lib/plans";
import { escapeHtml, mailHtml, sendMail } from "./mailer";

const site = () => (process.env.AUTH_URL ?? "").replace(/\/+$/, "");
const vnDate = (d: Date) => d.toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
const logError = (err: unknown) => console.error("[billing] gửi email lỗi:", err);

export function notifyAdminsNewOrder(order: { code: string; plan: string; amount: number }, buyerEmail: string | null): void {
  const admins = (process.env.ENGQUIZ_ADMIN_EMAILS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const plan = getPlan(order.plan)?.label ?? order.plan;
  const text = `Đơn ${order.code}: gói AI ${plan}, ${formatVnd(order.amount)}, người mua ${buyerEmail ?? "?"}.\nKhi nhận được chuyển khoản có nội dung ${order.code}, vào ${site()}/admin/orders để kích hoạt.`;
  for (const to of admins) {
    void sendMail({
      to,
      subject: `[EngQuiz] Đơn mới ${order.code} — ${formatVnd(order.amount)}`,
      text,
      html: mailHtml("Đơn mua gói AI mới", `<p>${escapeHtml(text).replace(/\n/g, "<br>")}</p>`),
    }).catch(logError);
  }
}

export function notifyBuyerActivated(email: string | null, info: { months: number; premiumUntil: Date }): void {
  if (!email) return;
  const text = `Gói AI ${info.months} tháng đã được kích hoạt. Bạn dùng được AI chấm & sửa bài nói đến hết ngày ${vnDate(info.premiumUntil)}.`;
  void sendMail({
    to: email,
    subject: "Gói AI EngQuiz đã được kích hoạt",
    text: `${text}\n${site()}/speaking?tab=talk`,
    html: mailHtml(
      "Gói AI đã được kích hoạt 🎉",
      `<p>${escapeHtml(text)}</p><p><a href="${escapeHtml(site())}/speaking?tab=talk" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Luyện nói với AI</a></p>`,
    ),
  }).catch(logError);
}
