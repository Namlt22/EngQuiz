/**
 * Dữ liệu học của người dùng đang đăng nhập.
 *  GET  → { progress, roadmap, roadmapLog, version } hoặc null nếu chưa có bản ghi
 *  PUT  → ghi toàn bộ dữ liệu; 409 kèm bản hiện tại nếu version không khớp (tab/thiết bị khác vừa ghi)
 */
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { learnerPutSchema, type ApiResponse, type LearnerConflictResponse, type LearnerSnapshot } from "@/lib/learner-schema";
import { findLearner, saveLearner } from "@/server/learner-repo";
import { createRateLimiter } from "@/server/rate-limit";
import { BodyTooLargeError, isSameOrigin, readBodyWithLimit } from "@/server/request";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 256 * 1024;
const readLimiter = createRateLimiter({ limit: 60, windowMs: 60_000 });
const writeLimiter = createRateLimiter({ limit: 30, windowMs: 60_000 });

function fail(status: number, error: string) {
  return NextResponse.json<ApiResponse<never>>({ success: false, data: null, error }, { status });
}

function ok<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data, error: null }, { status });
}

async function currentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return fail(401, "Bạn cần đăng nhập.");
  if (!readLimiter.check(userId)) return fail(429, "Bạn thao tác quá nhanh, hãy thử lại sau ít phút.");
  try {
    return ok<LearnerSnapshot | null>(await findLearner(userId));
  } catch (e) {
    console.error("[api/learner] GET lỗi:", e);
    return fail(500, "Không đọc được dữ liệu học. Hãy thử lại sau.");
  }
}

export async function PUT(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const userId = await currentUserId();
  if (!userId) return fail(401, "Bạn cần đăng nhập.");
  if (!writeLimiter.check(userId)) return fail(429, "Bạn thao tác quá nhanh, hãy thử lại sau ít phút.");

  let json: unknown;
  try {
    json = JSON.parse(await readBodyWithLimit(req, MAX_BODY_BYTES));
  } catch (e) {
    if (e instanceof BodyTooLargeError) return fail(413, "Dữ liệu gửi lên quá lớn.");
    return fail(400, "Dữ liệu không phải JSON hợp lệ.");
  }
  const parsed = learnerPutSchema.safeParse(json);
  if (!parsed.success) return fail(400, "Dữ liệu học không hợp lệ.");

  const { baseVersion, ...data } = parsed.data;
  try {
    const result = await saveLearner(userId, data, baseVersion);
    if (!result.ok) {
      return NextResponse.json<LearnerConflictResponse>(
        { success: false, data: null, error: "Dữ liệu đã thay đổi ở tab hoặc thiết bị khác.", current: result.current },
        { status: 409 },
      );
    }
    return ok({ version: result.version });
  } catch (e) {
    console.error("[api/learner] PUT lỗi:", e);
    return fail(500, "Không lưu được dữ liệu học. Hãy thử lại sau.");
  }
}
