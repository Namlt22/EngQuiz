/**
 * Email của tài khoản: mã xác thực khi đăng ký, mã đặt lại mật khẩu, và thông báo "email đã có tài khoản"
 * (gửi thay cho mã khi ai đó đăng ký lại một email đã xác thực — trang web trả lời giống hệt, chỉ chủ hộp thư biết).
 * - Có EMAIL_SERVER: gửi qua SMTP (nodemailer).
 * - Không có EMAIL_SERVER và đang `next dev`: in mã ra terminal.
 */
export type AccountMailKind = "verify" | "reset" | "exists";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const TEXT: Record<AccountMailKind, { subject: string; title: string; intro: string; outro: string }> = {
  verify: {
    subject: "Mã xác thực EngQuiz",
    title: "Xác thực email",
    intro: "Nhập mã dưới đây để hoàn tất tạo tài khoản EngQuiz. Mã có hiệu lực 15 phút.",
    outro: "Nếu bạn không tạo tài khoản, hãy bỏ qua email này.",
  },
  reset: {
    subject: "Mã đặt lại mật khẩu EngQuiz",
    title: "Đặt lại mật khẩu",
    intro: "Nhập mã dưới đây để đặt mật khẩu mới cho tài khoản EngQuiz. Mã có hiệu lực 15 phút.",
    outro: "Nếu bạn không yêu cầu, hãy bỏ qua email này — mật khẩu hiện tại vẫn giữ nguyên.",
  },
  exists: {
    subject: "Email này đã có tài khoản EngQuiz",
    title: "Bạn đã có tài khoản",
    intro: "Có người vừa dùng email này để đăng ký EngQuiz, nhưng email đã có tài khoản. Hãy đăng nhập, hoặc dùng “Quên mật khẩu” nếu bạn không nhớ mật khẩu (hoặc trước đây chỉ đăng nhập bằng Google / link email).",
    outro: "Nếu không phải bạn, hãy bỏ qua email này.",
  },
};

export function buildAccountMail(kind: AccountMailKind, code: string, siteUrl: string) {
  const t = TEXT[kind];
  const codeLine = code ? `\nMã: ${code}\n` : `\n${siteUrl}/signin\n`;
  const codeHtml = code
    ? `<p style="font-size:30px;font-weight:800;letter-spacing:8px;margin:16px 0">${escapeHtml(code)}</p>`
    : `<p><a href="${escapeHtml(siteUrl)}/signin" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 20px;border-radius:10px;text-decoration:none;font-weight:600">Đăng nhập EngQuiz</a></p>`;
  return {
    subject: code ? `${t.subject}: ${code}` : t.subject,
    text: `${t.title}\n\n${t.intro}\n${codeLine}\n${t.outro}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
<h2 style="margin:0 0 12px">${t.title}</h2>
<p>${escapeHtml(t.intro)}</p>
${codeHtml}
<p style="color:#64748b;font-size:13px">${escapeHtml(t.outro)}</p>
</div>`,
  };
}

export async function sendAccountMail(to: string, kind: AccountMailKind, code: string): Promise<void> {
  const siteUrl = (process.env.AUTH_URL ?? "").replace(/\/+$/, "");
  const server = process.env.EMAIL_SERVER;
  if (!server) {
    if (process.env.NODE_ENV !== "development") throw new Error("Chưa cấu hình EMAIL_SERVER nên không gửi được email.");
    console.info(`\n[EngQuiz dev] Email "${kind}" cho ${to}${code ? `: mã ${code}` : ""}\n`);
    return;
  }
  const { createTransport } = await import("nodemailer");
  const result = await createTransport(server).sendMail({
    to,
    from: process.env.EMAIL_FROM ?? "EngQuiz <no-reply@example.com>",
    ...buildAccountMail(kind, code, siteUrl),
  });
  const failed = [...(result.rejected ?? []), ...((result as { pending?: unknown[] }).pending ?? [])].filter(Boolean);
  if (failed.length) throw new Error("Máy chủ email từ chối người nhận.");
}
