/**
 * Truy cập bảng LearnerState. Mọi dữ liệu đọc ra đều được kiểm tra lại bằng Zod.
 * Ghi dùng "optimistic concurrency": chỉ ghi khi version trong DB đúng bằng version client đã đọc.
 */
import { Prisma } from "@/generated/prisma/client";
import { learnerDataSchema, type LearnerData, type LearnerSnapshot } from "@/lib/learner-schema";
import { sanitizeLearnerData } from "@/lib/learner-sanitize";
import { prisma } from "./db";

export type SaveResult = { ok: true; version: number } | { ok: false; current: LearnerSnapshot | null };

export async function findLearner(userId: string): Promise<LearnerSnapshot | null> {
  const row = await prisma.learnerState.findUnique({ where: { userId } });
  if (!row) return null;
  const raw = { progress: row.progress, roadmap: row.roadmap, roadmapLog: row.roadmapLog };
  const parsed = learnerDataSchema.safeParse(raw);
  if (parsed.success) return { ...parsed.data, version: row.version };

  // Bản ghi cũ/hỏng (vd sau khi siết schema): giữ phần hợp lệ thay vì khóa cả tài khoản.
  console.error(`[learner-repo] Dữ liệu không hợp lệ trong DB cho user ${userId}, dùng phần hợp lệ:`, parsed.error.issues.slice(0, 3));
  return { ...sanitizeLearnerData(raw), version: row.version };
}

const toJson = (data: LearnerData) => ({
  progress: data.progress as Prisma.InputJsonValue,
  roadmap: data.roadmap === null ? Prisma.DbNull : (data.roadmap as Prisma.InputJsonValue),
  roadmapLog: data.roadmapLog as Prisma.InputJsonValue,
});

export async function saveLearner(userId: string, data: LearnerData, baseVersion: number | null): Promise<SaveResult> {
  if (baseVersion === null) {
    try {
      const row = await prisma.learnerState.create({ data: { userId, ...toJson(data) } });
      return { ok: true, version: row.version };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return { ok: false, current: await findLearner(userId) };
      }
      throw e;
    }
  }

  const { count } = await prisma.learnerState.updateMany({
    where: { userId, version: baseVersion },
    data: { ...toJson(data), version: { increment: 1 } },
  });
  if (count === 0) return { ok: false, current: await findLearner(userId) };
  return { ok: true, version: baseVersion + 1 };
}
