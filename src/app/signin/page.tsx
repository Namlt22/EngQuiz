import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";
import { safeCallback } from "@/lib/safe-callback";

export const metadata: Metadata = { title: "Đăng nhập" };

const ERROR_MESSAGES: Record<string, string> = {
  Verification: "Link đăng nhập đã hết hạn hoặc đã được dùng. Hãy nhập email để nhận link mới.",
  OAuthAccountNotLinked: "Email này đã đăng nhập bằng cách khác. Hãy dùng đúng cách bạn đăng nhập lần đầu.",
  AccessDenied: "Bạn đã từ chối quyền truy cập.",
  RateLimited: "Bạn yêu cầu link đăng nhập quá nhiều lần. Hãy thử lại sau 1 giờ.",
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
