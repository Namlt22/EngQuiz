/**
 * Đăng ký / đăng nhập bằng email + mật khẩu (giống SAP Quiz):
 *   đăng ký → mã 6 chữ số qua email → xác thực → đăng nhập
 *   quên mật khẩu → mã qua email → mật khẩu mới (đăng xuất mọi thiết bị khác)
 * Chống dò tài khoản: đăng ký / gửi lại mã / quên mật khẩu luôn trả lời giống nhau dù email có tài khoản hay không;
 * email được gửi ở nền nên thời gian phản hồi cũng như nhau.
 * Logic không phụ thuộc Prisma/Next (nhận repo + mailer) để kiểm thử được.
 */
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { BusyError, hashPassword, passwordProblem, verifyPassword } from "./password";
import { createRateLimiter } from "./rate-limit";
import { newSessionToken, SESSION_MAX_AGE_SECONDS } from "./session";
import type { AccountMailKind } from "./account-email";
import { LEGAL_VERSION } from "@/lib/legal-policy";

export type CodePurpose = "verify" | "reset";

export interface AccountUser {
  id: string;
  email: string | null;
  name: string | null;
  emailVerified: Date | null;
  passwordHash: string | null;
}

/** Bằng chứng người dùng đã đồng ý điều khoản: lúc nào, bản nào. */
export interface TermsConsent {
  termsAcceptedAt: Date;
  termsVersion: string;
}

export const TERMS_REQUIRED = "Bạn cần đồng ý Điều khoản sử dụng và Chính sách bảo mật để tạo tài khoản.";

export interface StoredCode {
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

export interface AccountRepo {
  findUserByEmail(email: string): Promise<AccountUser | null>;
  createUser(data: { email: string; name: string | null; passwordHash: string } & TermsConsent): Promise<AccountUser>;
  updateUser(id: string, data: Partial<Pick<AccountUser, "name" | "emailVerified" | "passwordHash"> & TermsConsent>): Promise<AccountUser>;
  saveCode(email: string, purpose: CodePurpose, codeHash: string, expiresAt: Date): Promise<void>;
  getCode(email: string, purpose: CodePurpose): Promise<StoredCode | null>;
  bumpCodeAttempts(email: string, purpose: CodePurpose): Promise<void>;
  deleteCode(email: string, purpose: CodePurpose): Promise<void>;
  createSession(userId: string, sessionToken: string, expires: Date): Promise<void>;
  deleteSessions(userId: string): Promise<void>;
}

export type Mailer = (to: string, kind: AccountMailKind, code: string) => Promise<void>;

/** Kết quả trả về route: status + dữ liệu; `session` có nghĩa là đặt cookie đăng nhập. */
export interface AccountResult {
  status: number;
  data?: Record<string, unknown>;
  error?: string;
  session?: { token: string; expires: Date };
}

export const CODE_TTL_MS = 15 * 60_000;
export const RESEND_AFTER_SECONDS = 60;
const MAX_CODE_ATTEMPTS = 5;
const NAME_MAX = 60;
const EMAIL_MAX = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_RE = /^\d{6}$/;
const BAD_CODE = "Mã không đúng hoặc đã hết hạn. Hãy kiểm tra lại hoặc gửi mã mới.";
const BAD_LOGIN = "Email hoặc mật khẩu không đúng.";

const bad = (error: string, status = 400): AccountResult => ({ status, error });
const str = (v: unknown) => (typeof v === "string" ? v : "");
export const normalizeEmail = (v: unknown) => str(v).trim().toLowerCase();

function emailProblem(email: string): string {
  if (!email) return "Nhập email";
  if (email.length > EMAIL_MAX || !EMAIL_RE.test(email)) return "Email chưa đúng định dạng, ví dụ: ban@gmail.com";
  return "";
}

export function createAccountService({
  repo,
  mail,
  secret,
  now = () => Date.now(),
  onMailError = (err: unknown) => console.error("[account] gửi email lỗi:", err),
}: {
  repo: AccountRepo;
  mail: Mailer;
  secret: string;
  now?: () => number;
  onMailError?: (err: unknown) => void;
}) {
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET phải có ít nhất 32 ký tự.");

  // Mỗi email nhận tối đa 5 email/giờ; sai mật khẩu tối đa 10 lần/15 phút cho mỗi tài khoản.
  const mailPerEmail = createRateLimiter({ limit: 5, windowMs: 60 * 60_000 });
  const loginFailures = createRateLimiter({ limit: 10, windowMs: 15 * 60_000 });

  const codeHash = (email: string, purpose: CodePurpose, code: string) =>
    createHmac("sha256", secret).update(`${purpose}:${email}:${code}`).digest("base64url");

  /** Gửi email ở nền (không chờ SMTP) — phản hồi luôn nhanh như nhau. Bỏ qua nếu vừa gửi < 60 giây hoặc vượt hạn mức. */
  async function sendCode(email: string, kind: AccountMailKind): Promise<void> {
    if (kind !== "exists") {
      const existing = await repo.getCode(email, kind);
      if (existing && now() - existing.createdAt.getTime() < RESEND_AFTER_SECONDS * 1000) return;
    }
    if (!mailPerEmail.check(email, now())) return;
    let code = "";
    if (kind !== "exists") {
      code = String(randomInt(0, 1_000_000)).padStart(6, "0");
      await repo.saveCode(email, kind, codeHash(email, kind, code), new Date(now() + CODE_TTL_MS));
    }
    void mail(email, kind, code).catch(onMailError);
  }

  /** Kiểm tra mã (tối đa 5 lần sai, sau đó phải xin mã mới). Đúng → xoá mã (chỉ dùng một lần). */
  async function consumeCode(email: string, purpose: CodePurpose, code: string): Promise<boolean> {
    if (!CODE_RE.test(code)) return false;
    const stored = await repo.getCode(email, purpose);
    if (!stored || stored.expiresAt.getTime() <= now() || stored.attempts >= MAX_CODE_ATTEMPTS) return false;
    const expected = Buffer.from(stored.codeHash);
    const actual = Buffer.from(codeHash(email, purpose, code));
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      await repo.bumpCodeAttempts(email, purpose);
      return false;
    }
    await repo.deleteCode(email, purpose);
    return true;
  }

  async function startSession(userId: string): Promise<AccountResult> {
    const token = newSessionToken();
    const expires = new Date(now() + SESSION_MAX_AGE_SECONDS * 1000);
    await repo.createSession(userId, token, expires);
    return { status: 200, data: { signedIn: true }, session: { token, expires } };
  }

  const sent = (email: string): AccountResult => ({ status: 202, data: { email, retryAfter: RESEND_AFTER_SECONDS } });

  async function register(body: Record<string, unknown>): Promise<AccountResult> {
    const email = normalizeEmail(body.email);
    const password = str(body.password);
    const name = str(body.name).trim();
    const problem = emailProblem(email) || passwordProblem(password, email) || (name.length > NAME_MAX ? `Tên hiển thị tối đa ${NAME_MAX} ký tự` : "");
    if (problem) return bad(problem);
    if (body.acceptTerms !== true) return bad(TERMS_REQUIRED);

    const consent: TermsConsent = { termsAcceptedAt: new Date(now()), termsVersion: LEGAL_VERSION };
    const passwordHash = await hashPassword(password); // băm trước mọi nhánh → thời gian như nhau
    const user = await repo.findUserByEmail(email);
    if (user?.emailVerified) {
      await sendCode(email, "exists");
      return sent(email);
    }
    // Chưa ai xác thực email này: người đăng ký sau cùng giữ mật khẩu, nhưng chỉ chủ hộp thư mới nhận được mã.
    if (user) await repo.updateUser(user.id, { passwordHash, name: name || user.name, ...consent });
    else await repo.createUser({ email, name: name || null, passwordHash, ...consent });
    await sendCode(email, "verify");
    return sent(email);
  }

  async function verifyEmail(body: Record<string, unknown>): Promise<AccountResult> {
    const email = normalizeEmail(body.email);
    const user = await repo.findUserByEmail(email);
    if (!user || user.emailVerified || !user.passwordHash) return bad(BAD_CODE);
    if (!(await consumeCode(email, "verify", str(body.code).trim()))) return bad(BAD_CODE);
    if (!(await verifyPassword(str(body.password), user.passwordHash))) return bad("Mật khẩu không đúng với mật khẩu đã đăng ký.");
    await repo.updateUser(user.id, { emailVerified: new Date(now()) });
    return startSession(user.id);
  }

  async function resendCode(body: Record<string, unknown>): Promise<AccountResult> {
    const email = normalizeEmail(body.email);
    if (emailProblem(email)) return bad(emailProblem(email));
    const user = await repo.findUserByEmail(email);
    if (user && !user.emailVerified && user.passwordHash) await sendCode(email, "verify");
    return sent(email);
  }

  async function login(body: Record<string, unknown>): Promise<AccountResult> {
    const email = normalizeEmail(body.email);
    const password = str(body.password);
    if (!email || !password) return bad("Nhập email và mật khẩu.");
    if (!loginFailures.check(email, now())) return bad("Sai mật khẩu quá nhiều lần. Hãy thử lại sau 15 phút hoặc dùng “Quên mật khẩu”.", 429);
    const user = await repo.findUserByEmail(email);
    if (!(await verifyPassword(password, user?.passwordHash))) return bad(BAD_LOGIN, 401);
    loginFailures.refund(email, now()); // đúng mật khẩu → không tính là lần sai
    if (!user) return bad(BAD_LOGIN, 401);
    if (!user.emailVerified) {
      await sendCode(email, "verify");
      return { status: 403, error: "Email chưa được xác thực. Nhập mã vừa gửi tới hộp thư của bạn.", data: { unverified: true, email, retryAfter: RESEND_AFTER_SECONDS } };
    }
    return startSession(user.id);
  }

  async function forgotPassword(body: Record<string, unknown>): Promise<AccountResult> {
    const email = normalizeEmail(body.email);
    if (emailProblem(email)) return bad(emailProblem(email));
    if (await repo.findUserByEmail(email)) await sendCode(email, "reset");
    return sent(email);
  }

  async function resetPassword(body: Record<string, unknown>): Promise<AccountResult> {
    const email = normalizeEmail(body.email);
    const password = str(body.password);
    const problem = passwordProblem(password, email);
    if (problem) return bad(problem);
    const user = await repo.findUserByEmail(email);
    if (!user || !(await consumeCode(email, "reset", str(body.code).trim()))) return bad(BAD_CODE);
    await repo.updateUser(user.id, { passwordHash: await hashPassword(password), emailVerified: user.emailVerified ?? new Date(now()) });
    await repo.deleteSessions(user.id); // đăng xuất mọi thiết bị khác
    return startSession(user.id);
  }

  const actions = { register, "verify-email": verifyEmail, "resend-code": resendCode, login, "forgot-password": forgotPassword, "reset-password": resetPassword };
  type Action = keyof typeof actions;

  return {
    actions: Object.keys(actions) as Action[],
    async run(action: string, body: Record<string, unknown>): Promise<AccountResult> {
      const fn = (actions as Record<string, (b: Record<string, unknown>) => Promise<AccountResult>>)[action];
      if (!fn) return bad("Không tìm thấy chức năng.", 404);
      try {
        return await fn(body);
      } catch (err) {
        if (err instanceof BusyError) return bad(err.message, 503);
        throw err;
      }
    },
  };
}
