/**
 * Cấu hình đăng nhập (Auth.js v5). Phiên đăng nhập lưu trong database (bảng Session).
 *  - Email + mật khẩu: API riêng ở src/app/api/account (ghi cùng bảng Session, cùng cookie — xem src/server/session.ts).
 *  - Google: chỉ bật khi có AUTH_GOOGLE_ID và AUTH_GOOGLE_SECRET.
 */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/server/db";
import { SESSION_MAX_AGE_SECONDS } from "@/server/session";

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const providers: Provider[] = googleEnabled ? [Google] : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as unknown as Parameters<typeof PrismaAdapter>[0]),
  providers,
  session: { strategy: "database", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/signin", error: "/signin" },
  callbacks: {
    session({ session, user }) {
      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
});
