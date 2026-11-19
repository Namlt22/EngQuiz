import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/AuthForms";
import { safeCallback } from "@/lib/safe-callback";

export const metadata: Metadata = { title: "Tạo tài khoản" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  return (
    <div className="mx-auto max-w-md">
      <RegisterForm googleEnabled={googleEnabled} callbackUrl={safeCallback(callbackUrl)} />
    </div>
  );
}
