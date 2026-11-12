import type { NextRequest } from "next/server";
import { handlers } from "@/auth";
import { createRateLimiter } from "@/server/rate-limit";
import { clientIp } from "@/server/request";

export const { GET } = handlers;

const ONE_HOUR = 60 * 60_000;
/** Chống spam link đăng nhập: mỗi IP 10 lần/giờ, mỗi email 5 lần/giờ. */
const byIp = createRateLimiter({ limit: 10, windowMs: ONE_HOUR });
const byEmail = createRateLimiter({ limit: 5, windowMs: ONE_HOUR });

/** `url` để client của next-auth chuyển về trang đăng nhập kèm thông báo lỗi. */
const tooMany = (req: NextRequest) =>
  Response.json({ url: new URL("/signin?error=RateLimited", req.nextUrl.origin).toString() }, { status: 429 });

export async function POST(req: NextRequest) {
  if (req.nextUrl.pathname.endsWith("/signin/email")) {
    if (!byIp.check(clientIp(req))) return tooMany(req);
    const form = await req.clone().formData().catch(() => null);
    const email = String(form?.get("email") ?? "").trim().toLowerCase();
    if (email && !byEmail.check(email)) return tooMany(req);
  }
  return handlers.POST(req);
}
