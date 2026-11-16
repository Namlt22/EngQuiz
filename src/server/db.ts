/**
 * Prisma client dùng chung cho phía server (Prisma 7 + driver adapter pg).
 * Giữ một instance trên globalThis để hot reload ở môi trường dev không mở thêm kết nối.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Thiếu biến môi trường DATABASE_URL (xem .env.example).");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Lỗi trùng khóa duy nhất (P2002). Các lỗi khác (mất kết nối DB…) KHÔNG được coi là trùng khóa. */
export function isUniqueViolation(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}
