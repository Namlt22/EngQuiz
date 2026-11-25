/**
 * API tài khoản (email + mật khẩu): POST /api/account/{register|verify-email|resend-code|login|forgot-password|reset-password}
 * Trả về { success, data, error }; đăng nhập thành công thì đặt cookie phiên giống Auth.js.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createAccountService } from "@/server/account-service";
import { prismaAccountRepo } from "@/server/account-repo";
import { sendAccountMail } from "@/server/account-email";
import { readJsonObject } from "@/server/api-response";
import { createRateLimiter } from "@/server/rate-limit";
import { clientIp, isSameOrigin } from "@/server/request";
import { sessionCookieName, sessionCookieOptions } from "@/server/session";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4 * 1024;
/** Mỗi IP 30 yêu cầu tài khoản / 10 phút. */
const byIp = createRateLimiter({ limit: 30, windowMs: 10 * 60_000 });

let service: ReturnType<typeof createAccountService> | undefined;
const getService = () =>
  (service ??= createAccountService({ repo: prismaAccountRepo, mail: sendAccountMail, secret: process.env.AUTH_SECRET ?? "" }));

const fail = (status: number, error: string, data: Record<string, unknown> | null = null) =>
  NextResponse.json({ success: false, data, error }, { status });

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  if (!byIp.check(clientIp(req))) return fail(429, "Bạn thao tác quá nhiều lần. Hãy thử lại sau ít phút.");

  const body = await readJsonObject(req, MAX_BODY_BYTES);
  if (body instanceof Response) return body;

  try {
    const result = await getService().run(action, body);
    if (result.error) return fail(result.status, result.error, result.data ?? null);
    const res = NextResponse.json({ success: true, data: result.data ?? null, error: null }, { status: result.status });
    if (result.session) res.cookies.set(sessionCookieName(), result.session.token, sessionCookieOptions());
    return res;
  } catch (e) {
    console.error(`[api/account/${action}] lỗi:`, e);
    return fail(500, "Máy chủ gặp lỗi, hãy thử lại sau.");
  }
}
