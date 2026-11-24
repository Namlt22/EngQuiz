/**
 * POST /api/transcribe — nhận dạng lời nói trên chính máy chủ (form: file = bản ghi, lang = en|zh, expected = câu cần đọc)
 * → ApiResponse<TranscribeResult>. Thay Web Speech API của trình duyệt cho mọi màn hình có micro.
 *
 * Gọi dịch vụ cục bộ (127.0.0.1, scripts/voice/pronounce_service.py, Whisper): tốn CPU → bắt buộc đăng nhập,
 * cùng nguồn, giới hạn tần suất theo người dùng / IP. Bản ghi chỉ được chuyển tiếp để nhận dạng, không lưu.
 */
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import type { ApiResponse } from "@/lib/learner-schema";
import { TRANSCRIBE_LIMITS, transcribeResultSchema, type TranscribeResult } from "@/lib/transcribe";
import { createRateLimiter } from "@/server/rate-limit";
import { clientIp, isSameOrigin, readBytesWithLimit } from "@/server/request";

export const dynamic = "force-dynamic";

const SERVICE_URL = process.env.ENGQUIZ_PRONOUNCE_URL ?? "http://127.0.0.1:8765";
/** Nói tự do 3 phút ≈ 30–40 giây nhận dạng trên CPU. */
const SERVICE_TIMEOUT_MS = 90_000;
const FORM_OVERHEAD = 4 * 1024;
const TEN_MINUTES = 10 * 60_000;
const LANGS = new Set(["en", "zh"]);

const userBurst = createRateLimiter({ limit: 120, windowMs: TEN_MINUTES });
const ipBurst = createRateLimiter({ limit: 240, windowMs: TEN_MINUTES });

function fail(status: number, error: string) {
  return NextResponse.json<ApiResponse<never>>({ success: false, data: null, error }, { status });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Hãy đăng nhập để dùng micro.");

  const max = TRANSCRIBE_LIMITS.maxBytes + FORM_OVERHEAD;
  if (Number(req.headers.get("content-length") ?? "0") > max) return fail(413, "Bản ghi quá dài.");
  let form: FormData;
  try {
    const bytes = await readBytesWithLimit(req, max);
    if (!bytes) return fail(413, "Bản ghi quá dài.");
    form = await new Response(new Blob([bytes as Uint8Array<ArrayBuffer>]), { headers: { "content-type": req.headers.get("content-type") ?? "" } }).formData();
  } catch {
    return fail(400, "Dữ liệu gửi lên không hợp lệ.");
  }
  const file = form.get("file");
  if (!(file instanceof Blob) || !file.size) return fail(400, "Thiếu bản ghi.");
  if (file.size > TRANSCRIBE_LIMITS.maxBytes) return fail(413, "Bản ghi quá dài.");
  const lang = String(form.get("lang") ?? "en");
  const expected = String(form.get("expected") ?? "").replace(/\s+/g, " ").trim().slice(0, TRANSCRIBE_LIMITS.maxExpectedChars);

  const ip = clientIp(req);
  if (!userBurst.check(userId)) return fail(429, "Bạn dùng micro hơi nhiều, hãy nghỉ vài phút rồi thử lại.");
  if (!ipBurst.check(ip)) {
    userBurst.refund(userId);
    return fail(429, "Mạng này gửi quá nhiều yêu cầu, hãy thử lại sau ít phút.");
  }
  const refund = () => {
    userBurst.refund(userId);
    ipBurst.refund(ip);
  };

  const upstream = new FormData();
  upstream.set("file", file, file.type.includes("ogg") ? "rec.ogg" : file.type.includes("mp4") ? "rec.m4a" : "rec.webm");
  upstream.set("lang", LANGS.has(lang) ? lang : "en");
  if (expected) upstream.set("expected", expected);
  let res: Response;
  try {
    res = await fetch(`${SERVICE_URL}/transcribe`, { method: "POST", body: upstream, signal: AbortSignal.timeout(SERVICE_TIMEOUT_MS) });
  } catch {
    refund();
    return fail(503, "Nhận dạng giọng nói đang tạm nghỉ. Hãy thử lại sau.");
  }
  if (!res.ok) {
    if (res.status >= 500) refund();
    if (res.status === 422) return fail(422, "Bản ghi quá ngắn hoặc quá dài. Hãy nói lại.");
    if (res.status === 503) return fail(503, "Bộ nhận dạng đang khởi động, thử lại sau ít giây.");
    return fail(502, "Không nhận dạng được bản ghi này. Hãy thử lại.");
  }
  const parsed = transcribeResultSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) return fail(502, "Không nhận dạng được bản ghi này. Hãy thử lại.");
  return NextResponse.json<ApiResponse<TranscribeResult>>({ success: true, data: parsed.data, error: null });
}
