/**
 * POST /api/transcribe — nhận dạng lời nói trên chính máy chủ (form: file = bản ghi, lang = en|zh, expected = câu cần đọc)
 * → ApiResponse<TranscribeResult>. Thay Web Speech API của trình duyệt cho mọi màn hình có micro.
 *
 * Gọi dịch vụ cục bộ (127.0.0.1, scripts/voice/pronounce_service.py, Whisper): tốn CPU → bắt buộc đăng nhập,
 * cùng nguồn, giới hạn tần suất theo người dùng / IP. Bản ghi chỉ được chuyển tiếp để nhận dạng, không lưu.
 */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { TRANSCRIBE_LIMITS, transcribeResultSchema } from "@/lib/transcribe";
import { fail, ok, readFormBody } from "@/server/api-response";
import { createRateLimiter, refundAll, takeAll, type LimitStep } from "@/server/rate-limit";
import { clientIp, isSameOrigin } from "@/server/request";
import { FORM_OVERHEAD, postToVoiceService, recordingFileName } from "@/server/voice-service";

export const dynamic = "force-dynamic";

/** Nói tự do 3 phút ≈ 30–40 giây nhận dạng trên CPU. */
const SERVICE_TIMEOUT_MS = 90_000;
const TEN_MINUTES = 10 * 60_000;
const LANGS = new Set(["en", "zh"]);
const TOO_LONG = "Bản ghi quá dài.";
const CANNOT_RECOGNIZE = "Không nhận dạng được bản ghi này. Hãy thử lại.";

const userBurst = createRateLimiter({ limit: 120, windowMs: TEN_MINUTES });
const ipBurst = createRateLimiter({ limit: 240, windowMs: TEN_MINUTES });

const SERVICE_ERRORS: Record<number, [number, string]> = {
  422: [422, "Bản ghi quá ngắn hoặc quá dài. Hãy nói lại."],
  503: [503, "Bộ nhận dạng đang khởi động, thử lại sau ít giây."],
};

const limitSteps = (userId: string, ip: string): LimitStep[] => [
  { limiter: userBurst, key: userId, message: "Bạn dùng micro hơi nhiều, hãy nghỉ vài phút rồi thử lại." },
  { limiter: ipBurst, key: ip, message: "Mạng này gửi quá nhiều yêu cầu, hãy thử lại sau ít phút." },
];

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để dùng micro.");

  const form = await readFormBody(req, TRANSCRIBE_LIMITS.maxBytes + FORM_OVERHEAD, TOO_LONG);
  if (form instanceof Response) return form;
  const file = form.get("file");
  if (!(file instanceof Blob) || !file.size) return fail(400, "Thiếu bản ghi.");
  if (file.size > TRANSCRIBE_LIMITS.maxBytes) return fail(413, TOO_LONG);
  const lang = String(form.get("lang") ?? "en");
  const expected = String(form.get("expected") ?? "").replace(/\s+/g, " ").trim().slice(0, TRANSCRIBE_LIMITS.maxExpectedChars);

  const steps = limitSteps(userId, clientIp(req));
  const limited = takeAll(steps);
  if (limited) return fail(429, limited);

  const upstream = new FormData();
  upstream.set("file", file, recordingFileName(file.type));
  upstream.set("lang", LANGS.has(lang) ? lang : "en");
  if (expected) upstream.set("expected", expected);
  const res = await postToVoiceService("/transcribe", upstream, SERVICE_TIMEOUT_MS);
  if (!res) {
    refundAll(steps);
    return fail(503, "Nhận dạng giọng nói đang tạm nghỉ. Hãy thử lại sau.");
  }
  if (!res.ok) {
    if (res.status >= 500) refundAll(steps);
    const [status, message] = SERVICE_ERRORS[res.status] ?? [502, CANNOT_RECOGNIZE];
    return fail(status, message);
  }
  const parsed = transcribeResultSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) return fail(502, CANNOT_RECOGNIZE);
  return ok(parsed.data);
}
