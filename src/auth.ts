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
import { LEGAL_VERSION } from "@/lib/legal-policy";
import { accountBlockReason, type AccessFields } from "@/lib/account-access";

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const providers: Provider[] = googleEnabled ? [Google] : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as unknown as Parameters<typeof PrismaAdapter>[0]),
  providers,
  session: { strategy: "database", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/signin", error: "/signin" },
  events: {
    // Tài khoản mới tạo qua Google: nút Google có ghi "tiếp tục là đồng ý Điều khoản & Chính sách bảo mật" → lưu bằng chứng đồng ý.
    async createUser({ user }) {
      if (!user.id) return;
      await prisma.user
        .update({ where: { id: user.id }, data: { termsAcceptedAt: new Date(), termsVersion: LEGAL_VERSION } })
        .catch((e) => console.error("[auth] ghi nhận đồng ý điều khoản lỗi:", e instanceof Error ? e.message : e));
    },
  },
  callbacks: {
    /** Đăng nhập Google: tài khoản đã có nhưng bị khoá / hết hạn → từ chối (trang đăng nhập báo AccessDenied). */
    async signIn({ user }) {
      if (!user.email) return true;
      const existing = await prisma.user.findFirst({
        where: { email: { equals: user.email, mode: "insensitive" } },
        select: { disabled: true, accessUntil: true },
      });
      return !accountBlockReason(existing);
    },
    /** Mỗi lần đọc phiên: tài khoản bị khoá / hết hạn giữa chừng → xoá mọi phiên của tài khoản, coi như chưa đăng nhập. */
    async session({ session, user }) {
      if (accountBlockReason(user as AccessFields)) {
        await prisma.session.deleteMany({ where: { userId: user.id } }).catch(() => {});
        return { ...session, user: undefined as unknown as typeof session.user };
      }
      return { ...session, user: { ...session.user, id: user.id } };
    },
  },
});
