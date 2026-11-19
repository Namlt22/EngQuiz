/**
 * POST /api/pronounce — chấm phát âm tới từng âm (form: file = bản ghi, text = câu đúng) → ApiResponse<PronounceResult>.
 *
 * Chấm bằng dịch vụ OpenPronounce chạy trên chính máy chủ (127.0.0.1, scripts/voice/pronounce_service.py):
 * không tốn phí AI, nhưng tốn CPU → bắt buộc đăng nhập, cùng nguồn, giới hạn tần suất theo người dùng / IP,
 * và chỉ nhận câu có trong bài học của app (không làm công cụ chấm tuỳ ý cho bên ngoài).
 * Bản ghi chỉ được chuyển tiếp để chấm, không lưu.
 */
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import type { ApiResponse } from "@/lib/learner-schema";
import { PRONOUNCE_LIMITS, pronounceResultSchema, type PronounceResult } from "@/lib/pronounce";
import { normalizeVoiceText } from "@/lib/voice-key";
import { collectVoiceTexts } from "@/lib/voice-texts";
import { createRateLimiter } from "@/server/rate-limit";
import { clientIp, isSameOrigin } from "@/server/request";

export const dynamic = "force-dynamic";

const SERVICE_URL = process.env.ENGQUIZ_PRONOUNCE_URL ?? "http://127.0.0.1:8765";
const SERVICE_TIMEOUT_MS = 30_000;
/** Phần đầu form (ranh giới, tên trường, câu) cộng thêm vào kích thước file. */
const FORM_OVERHEAD = 4 * 1024;
const TEN_MINUTES = 10 * 60_000;

const userBurst = createRateLimiter({ limit: 60, windowMs: TEN_MINUTES });
const ipBurst = createRateLimiter({ limit: 120, windowMs: TEN_MINUTES });

let knownTexts: Set<string> | null = null;
const isKnownText = (text: string) => (knownTexts ??= new Set(collectVoiceTexts().map((t) => t.text.toLowerCase()))).has(text.toLowerCase());

function fail(status: number, error: string) {
  return NextResponse.json<ApiResponse<never>>({ success: false, data: null, error }, { status });
}

const SERVICE_ERRORS: Record<number, [number, string]> = {
  422: [422, "Bản ghi quá ngắn hoặc quá dài. Hãy đọc lại cả câu."],
  503: [503, "Bộ chấm phát âm đang khởi động, thử lại sau ít giây."],
};

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để chấm phát âm.");

  const declared = Number(req.headers.get("content-length") ?? "0");
  // Không có Content-Length thì không đọc (tránh luồng dữ liệu không giới hạn); trình duyệt luôn gửi khi đăng FormData.
  if (!Number.isFinite(declared) || declared <= 0) return fail(411, "Thiếu kích thước dữ liệu.");
  if (declared > PRONOUNCE_LIMITS.maxBytes + FORM_OVERHEAD) return fail(413, "Bản ghi quá dài.");

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "Dữ liệu gửi lên không hợp lệ.");
  }
  const file = form.get("file");
  const text = normalizeVoiceText(String(form.get("text") ?? ""));
  if (!(file instanceof Blob) || !file.size) return fail(400, "Thiếu bản ghi.");
  if (file.size > PRONOUNCE_LIMITS.maxBytes) return fail(413, "Bản ghi quá dài.");
  if (!text || text.length > PRONOUNCE_LIMITS.maxTextChars || !isKnownText(text)) return fail(400, "Câu cần chấm không có trong bài học.");

  const ip = clientIp(req);
  if (!userBurst.check(userId)) return fail(429, "Bạn chấm hơi nhiều, hãy nghỉ vài phút rồi thử lại.");
  if (!ipBurst.check(ip)) {
    userBurst.refund(userId);
    return fail(429, "Mạng này gửi quá nhiều yêu cầu, hãy thử lại sau ít phút.");
  }

  const upstream = new FormData();
  upstream.set("file", file, file.type.includes("ogg") ? "rec.ogg" : file.type.includes("mp4") ? "rec.m4a" : "rec.webm");
  upstream.set("text", text);
  let res: Response;
  try {
    res = await fetch(`${SERVICE_URL}/score`, { method: "POST", body: upstream, signal: AbortSignal.timeout(SERVICE_TIMEOUT_MS) });
  } catch {
    userBurst.refund(userId);
    ipBurst.refund(ip);
    return fail(503, "Chấm phát âm đang tạm nghỉ. Hãy thử lại sau.");
  }
  if (!res.ok) {
    if (res.status >= 500) {
      userBurst.refund(userId);
      ipBurst.refund(ip);
    }
    const [status, message] = SERVICE_ERRORS[res.status] ?? [502, "Không chấm được bản ghi này. Hãy thử lại."];
    return fail(status, message);
  }
  const parsed = pronounceResultSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) return fail(502, "Không chấm được bản ghi này. Hãy thử lại.");
  return NextResponse.json<ApiResponse<PronounceResult>>({ success: true, data: parsed.data, error: null });
}
