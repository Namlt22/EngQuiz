import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";
import { safeCallback } from "@/lib/safe-callback";

export const metadata: Metadata = { title: "Quên mật khẩu" };

export default async function ForgotPage({ searchParams }: { searchParams: Promise<{ email?: string; callbackUrl?: string }> }) {
  const { email, callbackUrl } = await searchParams;
  const initialEmail = typeof email === "string" ? email.slice(0, 254) : "";
  return (
    <div className="mx-auto max-w-md">
      <ForgotPasswordForm initialEmail={initialEmail} callbackUrl={safeCallback(callbackUrl)} />
    </div>
  );
}
