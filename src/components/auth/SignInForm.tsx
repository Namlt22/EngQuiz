"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { AlertTriangle, Mail } from "lucide-react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInForm({
  googleEnabled,
  callbackUrl,
  errorMessage,
}: {
  googleEnabled: boolean;
  callbackUrl: string;
  errorMessage?: string;
}) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(errorMessage);

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setError("Email chưa đúng định dạng, ví dụ: ban@gmail.com");
      return;
    }
    setPending(true);
    setError(undefined);
    try {
      await signIn("email", { email: value, redirectTo: callbackUrl });
    } catch {
      setError("Không gửi được link đăng nhập. Kiểm tra kết nối mạng rồi thử lại.");
      setPending(false);
    }
  }

  return (
    <div className="card space-y-5 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-extrabold">Đăng nhập EngQuiz</h1>
        <p className="mt-1 text-sm text-muted">
          Đăng nhập để lưu tiến độ học và lộ trình cá nhân vào tài khoản, học tiếp trên mọi thiết bị.
        </p>
      </div>

      {error && (
        <p role="alert" className="flex gap-2 rounded-xl bg-danger-soft p-3 text-sm text-danger">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {error}
        </p>
      )}

      {googleEnabled && (
        <>
          <button
            type="button"
            className="btn-ghost w-full"
            disabled={pending}
            onClick={() => {
              setPending(true);
              signIn("google", { redirectTo: callbackUrl }).catch(() => {
                setError("Không mở được trang đăng nhập Google. Hãy thử lại.");
                setPending(false);
              });
            }}
          >
            Tiếp tục với Google
          </button>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line" /> hoặc <span className="h-px flex-1 bg-line" />
          </div>
        </>
      )}

      <form onSubmit={submitEmail} className="space-y-3" noValidate>
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={254}
          placeholder="ban@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          <Mail className="size-4" /> {pending ? "Đang gửi…" : "Gửi link đăng nhập"}
        </button>
        <p className="text-xs text-muted">Không cần mật khẩu: EngQuiz gửi link đăng nhập vào email của bạn.</p>
      </form>
    </div>
  );
}
