/**
 * POST /api/pronounce — chấm phát âm tới từng âm (form: file = bản ghi, text = câu đúng) → ApiResponse<PronounceResult>.
 *
 * Chấm bằng dịch vụ OpenPronounce chạy trên chính máy chủ (127.0.0.1, scripts/voice/pronounce_service.py):
 * không tốn phí AI, nhưng tốn CPU → bắt buộc đăng nhập, cùng nguồn, giới hạn tần suất theo người dùng / IP,
 * và chỉ nhận câu có trong bài học của app (không làm công cụ chấm tuỳ ý cho bên ngoài).
 * Bản ghi chỉ được chuyển tiếp để chấm, không lưu.
 */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { PRONOUNCE_LIMITS, pronounceResultSchema } from "@/lib/pronounce";
import { vietnameseNamesIn } from "@/lib/vi-names";
import { normalizeVoiceText } from "@/lib/voice-key";
import { collectVoiceTexts } from "@/lib/voice-texts";
import { fail, ok, readFormBody } from "@/server/api-response";
import { createRateLimiter, refundAll, takeAll, type LimitStep } from "@/server/rate-limit";
import { clientIp, isSameOrigin } from "@/server/request";
import { FORM_OVERHEAD, postToVoiceService, recordingFileName } from "@/server/voice-service";

export const dynamic = "force-dynamic";

const SERVICE_TIMEOUT_MS = 30_000;
const TEN_MINUTES = 10 * 60_000;
const TOO_LONG = "Bản ghi quá dài.";
const CANNOT_SCORE = "Không chấm được bản ghi này. Hãy thử lại.";

const userBurst = createRateLimiter({ limit: 60, windowMs: TEN_MINUTES });
const ipBurst = createRateLimiter({ limit: 120, windowMs: TEN_MINUTES });

let knownTexts: Set<string> | null = null;
const isKnownText = (text: string) => (knownTexts ??= new Set(collectVoiceTexts().map((t) => t.text.toLowerCase()))).has(text.toLowerCase());

const MODES = new Set(["word", "sentence", "ipa"]);

const SERVICE_ERRORS: Record<number, [number, string]> = {
  422: [422, "Bản ghi quá ngắn hoặc quá dài. Hãy đọc lại cả câu."],
  503: [503, "Bộ chấm phát âm đang khởi động, thử lại sau ít giây."],
};

const limitSteps = (userId: string, ip: string): LimitStep[] => [
  { limiter: userBurst, key: userId, message: "Bạn chấm hơi nhiều, hãy nghỉ vài phút rồi thử lại." },
  { limiter: ipBurst, key: ip, message: "Mạng này gửi quá nhiều yêu cầu, hãy thử lại sau ít phút." },
];

/** Form gửi dịch vụ chấm: bản ghi, câu đúng, chế độ, âm cần xét và các tên riêng không chấm. */
function scoreForm(form: FormData, file: Blob, text: string): FormData {
  const upstream = new FormData();
  upstream.set("file", file, recordingFileName(file.type));
  upstream.set("text", text);
  const mode = String(form.get("mode") ?? "sentence");
  upstream.set("mode", MODES.has(mode) ? mode : "sentence");
  const focus = String(form.get("focus") ?? "").slice(0, 40);
  if (focus && text.toLowerCase().includes(focus.toLowerCase())) upstream.set("focus", focus);
  // Tên riêng Việt Nam: giọng mẫu đọc theo cách viết lại (Linh → "Ling") → chỉ hiển thị, không chấm.
  const names = vietnameseNamesIn(text);
  if (names.length) upstream.set("skip", names.join(","));
  return upstream;
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để chấm phát âm.");

  const form = await readFormBody(req, PRONOUNCE_LIMITS.maxBytes + FORM_OVERHEAD, TOO_LONG);
  if (form instanceof Response) return form;
  const file = form.get("file");
  const text = normalizeVoiceText(String(form.get("text") ?? ""));
  if (!(file instanceof Blob) || !file.size) return fail(400, "Thiếu bản ghi.");
  if (file.size > PRONOUNCE_LIMITS.maxBytes) return fail(413, TOO_LONG);
  if (!text || text.length > PRONOUNCE_LIMITS.maxTextChars || !isKnownText(text)) return fail(400, "Câu cần chấm không có trong bài học.");

  const steps = limitSteps(userId, clientIp(req));
  const limited = takeAll(steps);
  if (limited) return fail(429, limited);

  const res = await postToVoiceService("/score", scoreForm(form, file, text), SERVICE_TIMEOUT_MS);
  if (!res) {
    refundAll(steps);
    return fail(503, "Chấm phát âm đang tạm nghỉ. Hãy thử lại sau.");
  }
  if (!res.ok) {
    if (res.status >= 500) refundAll(steps);
    const [status, message] = SERVICE_ERRORS[res.status] ?? [502, CANNOT_SCORE];
    return fail(status, message);
  }
  const parsed = pronounceResultSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) return fail(502, CANNOT_SCORE);
  return ok(parsed.data);
}
