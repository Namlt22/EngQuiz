/**
 * Gửi email qua SMTP (EMAIL_SERVER). Không có EMAIL_SERVER:
 *  - `next dev`: in tóm tắt ra terminal;
 *  - production: báo lỗi (không lặng lẽ bỏ qua).
 */
export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Dòng in ra terminal ở chế độ dev khi chưa cấu hình SMTP. */
  devSummary?: string;
}

export async function sendMail(msg: MailMessage): Promise<void> {
  const server = process.env.EMAIL_SERVER;
  if (!server) {
    if (process.env.NODE_ENV !== "development") throw new Error("Chưa cấu hình EMAIL_SERVER nên không gửi được email.");
    console.info(`\n[EngQuiz dev] Email tới ${msg.to}: ${msg.devSummary ?? msg.subject}\n`);
    return;
  }
  const { createTransport } = await import("nodemailer");
  const result = await createTransport(server).sendMail({
    to: msg.to,
    from: process.env.EMAIL_FROM ?? "EngQuiz <no-reply@example.com>",
    subject: msg.subject,
    text: msg.text,
    html: msg.html,
  });
  const failed = [...(result.rejected ?? []), ...((result as { pending?: unknown[] }).pending ?? [])].filter(Boolean);
  if (failed.length) throw new Error("Máy chủ email từ chối người nhận.");
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/** Khung HTML chung cho email của EngQuiz. */
export const mailHtml = (title: string, body: string) =>
  `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
<h2 style="margin:0 0 12px">${escapeHtml(title)}</h2>
${body}
</div>`;
