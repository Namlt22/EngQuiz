/**
 * Cấu hình đăng nhập (Auth.js v5). Phiên đăng nhập lưu trong database (bảng Session).
 * Provider:
 *  - "email": link đăng nhập gửi qua email (luôn bật).
 *  - "google": chỉ bật khi có AUTH_GOOGLE_ID và AUTH_GOOGLE_SECRET.
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";
import { sendLoginEmail } from "@/server/login-email";

const LOGIN_LINK_MAX_AGE_SECONDS = 24 * 60 * 60;
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const providers: Provider[] = [
  {
    id: "email",
    type: "email",
    name: "Email",
    from: process.env.EMAIL_FROM ?? "EngQuiz <no-reply@example.com>",
    maxAge: LOGIN_LINK_MAX_AGE_SECONDS,
    sendVerificationRequest: sendLoginEmail,
  },
  ...(googleEnabled ? [Google] : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as unknown as Parameters<typeof PrismaAdapter>[0]),
  providers,
  session: { strategy: "database", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/signin", verifyRequest: "/signin/check-email", error: "/signin" },
  callbacks: {
    session({ session, user }) {
      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
});
