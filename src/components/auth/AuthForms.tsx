"use client";

/**
 * Form tài khoản theo kiểu SAP Quiz: Đăng nhập · Tạo tài khoản · Xác thực email (mã 6 số) · Quên / đặt lại mật khẩu.
 * Mật khẩu chỉ giữ trong state của component (không lưu sessionStorage). Đăng nhập xong tải lại trang
 * để SessionProvider đọc phiên mới.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { AlertTriangle, KeyRound, LogIn, MailCheck, UserPlus } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^\d{6}$/;
const PASSWORD_MIN = 8;

type Errors = Record<string, string>;
interface ApiReply {
  ok: boolean;
  status: number;
  data: Record<string, unknown> | null;
  error: string | null;
}

async function callAccount(action: string, body: Record<string, string>): Promise<ApiReply> {
  try {
    const res = await fetch(`/api/account/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as { success?: boolean; data?: Record<string, unknown> | null; error?: string | null } | null;
    if (!json) {
      const down = res.status >= 500;
      return { ok: false, status: res.status, data: null, error: down ? "Máy chủ tạm thời không truy cập được — vui lòng thử lại sau giây lát." : `Phản hồi không hợp lệ (HTTP ${res.status}).` };
    }
    return { ok: Boolean(json.success), status: res.status, data: json.data ?? null, error: json.error ?? null };
  } catch {
    return { ok: false, status: 0, data: null, error: "Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại." };
  }
}

const emailError = (v: string) => (!v.trim() ? "Nhập email" : EMAIL_RE.test(v.trim()) ? "" : "Email chưa đúng định dạng, ví dụ: ban@gmail.com");
function newPasswordError(pw: string, email: string) {
  if (pw.length < PASSWORD_MIN) return `Mật khẩu tối thiểu ${PASSWORD_MIN} ký tự`;
  if (pw.trim().toLowerCase() === email.trim().toLowerCase()) return "Mật khẩu không được trùng email";
  return "";
}
const codeError = (v: string) => (CODE_RE.test(v.trim()) ? "" : "Mã gồm 6 chữ số");
const hasErrors = (e: Errors) => Object.values(e).some(Boolean);

// ── Khung & ô nhập ───────────────────────────────────────────────
function Shell({ icon, title, sub, children, footer }: { icon: React.ReactNode; title: string; sub: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="card animate-pop-in space-y-5 p-6 md:p-8">
      <div className="space-y-2">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">{icon}</span>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="text-sm text-muted">{sub}</p>
      </div>
      {children}
      {footer && <p className="border-t border-line pt-4 text-center text-sm text-muted">{footer}</p>}
    </div>
  );
}

function Alert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex gap-2 rounded-xl bg-danger-soft p-3 text-sm text-danger">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {message}
    </p>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  ...input
}: { id: string; label: string; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-sm font-semibold">
        {label} {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </label>
      <input id={id} name={id} className="input" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...input} />
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function CodeField({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <Field
      id="code"
      label="Mã xác thực"
      hint="6 chữ số trong email"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      pattern="[0-9]*"
      autoFocus
      className="input text-center text-2xl font-bold tracking-[0.5em]"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
      error={error}
    />
  );
}

/** Nút "Gửi lại mã" có đếm ngược. */
function ResendButton({ onResend, retryAfter }: { onResend: () => Promise<number | void>; retryAfter: number }) {
  const [left, setLeft] = useState(retryAfter);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return (
    <button
      type="button"
      className="btn-ghost w-full"
      disabled={busy || left > 0}
      onClick={async () => {
        setBusy(true);
        const next = await onResend();
        setBusy(false);
        setLeft(typeof next === "number" ? next : 60);
      }}
    >
      {left > 0 ? `Gửi lại mã sau ${left}s` : busy ? "Đang gửi…" : "Gửi lại mã"}
    </button>
  );
}

function GoogleButton({ callbackUrl, disabled }: { callbackUrl: string; disabled: boolean }) {
  const [busy, setBusy] = useState(false);
  return (
    <>
      <button
        type="button"
        className="btn-ghost w-full"
        disabled={disabled || busy}
        onClick={() => {
          setBusy(true);
          signIn("google", { redirectTo: callbackUrl }).catch(() => setBusy(false));
        }}
      >
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12z" />
        </svg>
        Tiếp tục với Google
      </button>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> hoặc dùng email <span className="h-px flex-1 bg-line" />
      </div>
    </>
  );
}

const finish = (callbackUrl: string) => window.location.assign(callbackUrl);

/** Bước nhập mã sau khi đăng ký / đăng nhập tài khoản chưa xác thực. */
function VerifyStep({ email, password, retryAfter, callbackUrl, onBack }: { email: string; password: string; retryAfter: number; callbackUrl: string; onBack: () => void }) {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = { code: codeError(code) };
    setErrors(next);
    if (hasErrors(next)) return;
    setBusy(true);
    setAlert(undefined);
    const r = await callAccount("verify-email", { email, password, code: code.trim() });
    if (r.ok) return finish(callbackUrl);
    setBusy(false);
    setAlert(r.error ?? "Xác thực chưa thành công.");
  }

  return (
    <Shell
      icon={<MailCheck className="size-6" />}
      title="Xác thực email"
      sub={
        <>
          Mã 6 chữ số đã được gửi tới <strong className="text-fg">{email}</strong>. Mã có hiệu lực 15 phút — không thấy thì xem cả mục Spam.
        </>
      }
      footer={
        <>
          Sai email?{" "}
          <button type="button" className="font-semibold text-primary hover:underline" onClick={onBack}>
            Quay lại
          </button>
        </>
      }
    >
      <Alert message={alert} />
      <form onSubmit={submit} className="space-y-3" noValidate>
        <CodeField value={code} onChange={setCode} error={errors.code} />
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Đang xác thực…" : "Xác thực và đăng nhập"}
        </button>
        <ResendButton
          retryAfter={retryAfter}
          onResend={async () => {
            const r = await callAccount("resend-code", { email });
            if (!r.ok) setAlert(r.error ?? undefined);
            return Number(r.data?.retryAfter) || 60;
          }}
        />
      </form>
    </Shell>
  );
}

// ── Đăng nhập ───────────────────────────────────────────────────
export function SignInForm({ googleEnabled, callbackUrl, errorMessage }: { googleEnabled: boolean; callbackUrl: string; errorMessage?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState(errorMessage);
  const [busy, setBusy] = useState(false);
  const [verify, setVerify] = useState<{ email: string; retryAfter: number } | null>(null);

  if (verify) return <VerifyStep email={verify.email} password={password} retryAfter={verify.retryAfter} callbackUrl={callbackUrl} onBack={() => setVerify(null)} />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = { email: email.trim() ? "" : "Nhập email", password: password ? "" : "Nhập mật khẩu" };
    setErrors(next);
    if (hasErrors(next)) return;
    setBusy(true);
    setAlert(undefined);
    const r = await callAccount("login", { email: email.trim(), password });
    if (r.ok) return finish(callbackUrl);
    setBusy(false);
    if (r.status === 403 && r.data?.unverified) return setVerify({ email: String(r.data.email), retryAfter: Number(r.data.retryAfter) || 60 });
    setAlert(r.error ?? "Đăng nhập chưa thành công.");
  }

  const qs = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";
  return (
    <Shell
      icon={<LogIn className="size-6" />}
      title="Đăng nhập"
      sub="Tiếp tục học và đồng bộ tiến độ, lộ trình trên mọi thiết bị."
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href={`/register${qs}`} className="font-semibold text-primary hover:underline">
            Tạo tài khoản
          </Link>
        </>
      }
    >
      <Alert message={alert} />
      {googleEnabled && <GoogleButton callbackUrl={callbackUrl} disabled={busy} />}
      <form onSubmit={submit} className="space-y-3" noValidate>
        <Field id="email" label="Email" type="email" autoComplete="username" inputMode="email" maxLength={254} autoFocus placeholder="ban@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Field id="password" label="Mật khẩu" type="password" autoComplete="current-password" maxLength={128} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="text-right">
          <Link href={`/forgot${email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""}`} className="text-sm font-semibold text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
    </Shell>
  );
}

// ── Tạo tài khoản ───────────────────────────────────────────────
export function RegisterForm({ googleEnabled, callbackUrl }: { googleEnabled: boolean; callbackUrl: string }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [verify, setVerify] = useState<{ email: string; retryAfter: number } | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  if (verify) return <VerifyStep email={verify.email} password={form.password} retryAfter={verify.retryAfter} callbackUrl={callbackUrl} onBack={() => setVerify(null)} />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = {
      name: form.name.trim().length > 60 ? "Tên hiển thị tối đa 60 ký tự" : "",
      email: emailError(form.email),
      password: newPasswordError(form.password, form.email),
      confirm: form.confirm !== form.password ? "Mật khẩu nhập lại không khớp" : "",
    };
    setErrors(next);
    if (hasErrors(next)) return;
    setBusy(true);
    setAlert(undefined);
    const r = await callAccount("register", { name: form.name.trim(), email: form.email.trim(), password: form.password });
    setBusy(false);
    if (r.ok) return setVerify({ email: String(r.data?.email ?? form.email.trim().toLowerCase()), retryAfter: Number(r.data?.retryAfter) || 60 });
    setAlert(r.error ?? "Chưa tạo được tài khoản.");
  }

  const qs = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "";
  return (
    <Shell
      icon={<UserPlus className="size-6" />}
      title="Tạo tài khoản"
      sub="Miễn phí — lưu tiến độ học, lộ trình cá nhân và học tiếp trên mọi thiết bị."
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href={`/signin${qs}`} className="font-semibold text-primary hover:underline">
            Đăng nhập
          </Link>
        </>
      }
    >
      <Alert message={alert} />
      {googleEnabled && <GoogleButton callbackUrl={callbackUrl} disabled={busy} />}
      <form onSubmit={submit} className="space-y-3" noValidate>
        <Field id="name" label="Tên hiển thị" hint="không bắt buộc" autoComplete="name" maxLength={60} autoFocus value={form.name} onChange={set("name")} error={errors.name} />
        <Field id="email" label="Email" hint="nhận mã xác thực" type="email" autoComplete="email" inputMode="email" maxLength={254} placeholder="ban@gmail.com" value={form.email} onChange={set("email")} error={errors.email} />
        <Field id="password" label="Mật khẩu" hint={`tối thiểu ${PASSWORD_MIN} ký tự`} type="password" autoComplete="new-password" maxLength={128} value={form.password} onChange={set("password")} error={errors.password} />
        <Field id="confirm" label="Nhập lại mật khẩu" type="password" autoComplete="new-password" maxLength={128} value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Đang tạo…" : "Tạo tài khoản"}
        </button>
      </form>
    </Shell>
  );
}

// ── Quên mật khẩu → mã + mật khẩu mới ───────────────────────────
export function ForgotPasswordForm({ initialEmail, callbackUrl }: { initialEmail: string; callbackUrl: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [step, setStep] = useState<{ email: string; retryAfter: number } | null>(null);
  const [form, setForm] = useState({ code: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [alert, setAlert] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    const next = { email: emailError(email) };
    setErrors(next);
    if (hasErrors(next)) return;
    setBusy(true);
    setAlert(undefined);
    const r = await callAccount("forgot-password", { email: email.trim() });
    setBusy(false);
    if (!r.ok) return setAlert(r.error ?? "Chưa gửi được mã.");
    setStep({ email: String(r.data?.email ?? email.trim().toLowerCase()), retryAfter: Number(r.data?.retryAfter) || 60 });
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    if (!step) return;
    const next = {
      code: codeError(form.code),
      password: newPasswordError(form.password, step.email),
      confirm: form.confirm !== form.password ? "Mật khẩu nhập lại không khớp" : "",
    };
    setErrors(next);
    if (hasErrors(next)) return;
    setBusy(true);
    setAlert(undefined);
    const r = await callAccount("reset-password", { email: step.email, code: form.code.trim(), password: form.password });
    if (r.ok) return finish(callbackUrl);
    setBusy(false);
    setAlert(r.error ?? "Chưa đặt được mật khẩu mới.");
  }

  const back = (
    <Link href="/signin" className="font-semibold text-primary hover:underline">
      Quay lại đăng nhập
    </Link>
  );

  if (!step) {
    return (
      <Shell icon={<KeyRound className="size-6" />} title="Quên mật khẩu" sub="Nhập email của tài khoản — chúng tôi sẽ gửi mã để đặt mật khẩu mới." footer={back}>
        <Alert message={alert} />
        <form onSubmit={sendCode} className="space-y-3" noValidate>
          <Field id="email" label="Email" type="email" autoComplete="email" inputMode="email" maxLength={254} autoFocus placeholder="ban@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "Đang gửi…" : "Gửi mã"}
          </button>
          <p className="text-xs text-muted">Trước đây chỉ đăng nhập bằng Google hoặc link email? Dùng chức năng này để đặt mật khẩu cho tài khoản.</p>
        </form>
      </Shell>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  return (
    <Shell
      icon={<KeyRound className="size-6" />}
      title="Đặt mật khẩu mới"
      sub={
        <>
          Nếu <strong className="text-fg">{step.email}</strong> có tài khoản, mã 6 chữ số đã được gửi tới hộp thư này.
        </>
      }
      footer="Đặt lại mật khẩu sẽ đăng xuất tài khoản trên các thiết bị khác."
    >
      <Alert message={alert} />
      <form onSubmit={reset} className="space-y-3" noValidate>
        <CodeField value={form.code} onChange={(code) => setForm({ ...form, code })} error={errors.code} />
        <Field id="password" label="Mật khẩu mới" hint={`tối thiểu ${PASSWORD_MIN} ký tự`} type="password" autoComplete="new-password" maxLength={128} value={form.password} onChange={set("password")} error={errors.password} />
        <Field id="confirm" label="Nhập lại mật khẩu" type="password" autoComplete="new-password" maxLength={128} value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Đang lưu…" : "Đặt mật khẩu và đăng nhập"}
        </button>
        <ResendButton
          retryAfter={step.retryAfter}
          onResend={async () => {
            const r = await callAccount("forgot-password", { email: step.email });
            if (!r.ok) setAlert(r.error ?? undefined);
            return Number(r.data?.retryAfter) || 60;
          }}
        />
      </form>
    </Shell>
  );
}
