/** AccountRepo trên Prisma (PostgreSQL). Email luôn được lưu & tra cứu ở dạng chữ thường. */
import { prisma } from "./db";
import type { AccountRepo, AccountUser } from "./account-service";

const USER_FIELDS = { id: true, email: true, name: true, emailVerified: true, passwordHash: true } as const;

export const prismaAccountRepo: AccountRepo = {
  async findUserByEmail(email) {
    // Tài khoản cũ (Google / link email) có thể lưu email khác chữ hoa/thường.
    return prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } }, select: USER_FIELDS }) as Promise<AccountUser | null>;
  },
  async createUser({ email, name, passwordHash }) {
    return prisma.user.create({ data: { email, name, passwordHash }, select: USER_FIELDS });
  },
  async updateUser(id, data) {
    return prisma.user.update({ where: { id }, data, select: USER_FIELDS });
  },
  async saveCode(email, purpose, codeHash, expiresAt) {
    const data = { codeHash, expiresAt, attempts: 0, createdAt: new Date() };
    await prisma.authCode.upsert({ where: { email_purpose: { email, purpose } }, create: { email, purpose, ...data }, update: data });
  },
  async getCode(email, purpose) {
    return prisma.authCode.findUnique({ where: { email_purpose: { email, purpose } } });
  },
  async bumpCodeAttempts(email, purpose) {
    await prisma.authCode.updateMany({ where: { email, purpose }, data: { attempts: { increment: 1 } } });
  },
  async deleteCode(email, purpose) {
    await prisma.authCode.deleteMany({ where: { email, purpose } });
  },
  async createSession(userId, sessionToken, expires) {
    await prisma.session.create({ data: { userId, sessionToken, expires } });
  },
  async deleteSessions(userId) {
    await prisma.session.deleteMany({ where: { userId } });
  },
};
