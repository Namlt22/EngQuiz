import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/AuthForms";
import { safeCallback } from "@/lib/safe-callback";

export const metadata: Metadata = { title: "Đăng nhập" };

/** Lỗi do Auth.js (đăng nhập Google) chuyển về qua ?error=… */
const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: "Email này đã có tài khoản. Hãy đăng nhập bằng email và mật khẩu (hoặc dùng “Quên mật khẩu” để đặt mật khẩu).",
  AccessDenied: "Không đăng nhập được: tài khoản đã bị khoá hoặc hết thời hạn sử dụng (hoặc bạn đã từ chối quyền truy cập Google).",
  Verification: "Link đăng nhập cũ đã hết hạn. Hãy đăng nhập bằng email và mật khẩu.",
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; callbackUrl?: string }> }) {
  const { error, callbackUrl } = await searchParams;
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Đăng nhập chưa thành công. Hãy thử lại.") : undefined;

  return (
    <div className="mx-auto max-w-md">
      <SignInForm googleEnabled={googleEnabled} callbackUrl={safeCallback(callbackUrl)} errorMessage={errorMessage} />
    </div>
  );
}
