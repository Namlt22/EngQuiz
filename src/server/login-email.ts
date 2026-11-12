/**
 * Gửi email chứa link đăng nhập (magic link) của Auth.js.
 * - Có EMAIL_SERVER: gửi qua SMTP bằng nodemailer.
 * - Không có EMAIL_SERVER và đang dev: in link ra terminal để đăng nhập thử mà không cần SMTP.
 * - Không có EMAIL_SERVER ở production: báo lỗi rõ ràng.
 */
import type { EmailConfig } from "next-auth/providers";

type SendParams = Parameters<EmailConfig["sendVerificationRequest"]>[0];

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

function buildMessage(url: string, host: string) {
  const safeUrl = escapeHtml(url);
  return {
    subject: `Đăng nhập EngQuiz (${host})`,
    text: `Bấm link sau để đăng nhập EngQuiz:\n${url}\n\nLink có hiệu lực 24 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này.`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
<h2 style="margin:0 0 12px">Đăng nhập EngQuiz</h2>
<p>Bấm nút dưới đây để đăng nhập. Link có hiệu lực 24 giờ.</p>
<p><a href="${safeUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Đăng nhập</a></p>
<p style="color:#64748b;font-size:13px">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
</div>`,
  };
}

export async function sendLoginEmail({ identifier, url, provider }: SendParams): Promise<void> {
  const { host } = new URL(url);
  const server = process.env.EMAIL_SERVER;

  if (!server) {
    // Chỉ `next dev` (NODE_ENV=development) mới được in link ra terminal. Mọi bản build
    // (staging, preview, production) đều chạy NODE_ENV=production nên sẽ báo lỗi thay vì lộ link vào log.
    if (process.env.NODE_ENV !== "development") {
      throw new Error("Chưa cấu hình EMAIL_SERVER nên không gửi được link đăng nhập.");
    }
    console.info(`\n[EngQuiz dev] Link đăng nhập cho ${identifier}:\n${url}\n`);
    return;
  }

  const { createTransport } = await import("nodemailer");
  const result = await createTransport(server).sendMail({
    to: identifier,
    from: provider.from,
    ...buildMessage(url, host),
  });
  const failed = [...(result.rejected ?? []), ...((result as { pending?: unknown[] }).pending ?? [])].filter(Boolean);
  if (failed.length) throw new Error("Không gửi được email đăng nhập.");
}
