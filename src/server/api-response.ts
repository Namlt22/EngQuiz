/** Phản hồi API thống nhất { success, data, error } và đọc body (JSON / form) có giới hạn kích thước. */
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/learner-schema";
import { BodyTooLargeError, readBodyWithLimit, readBytesWithLimit } from "./request";

export const ok = <T>(data: T, status = 200) => NextResponse.json<ApiResponse<T>>({ success: true, data, error: null }, { status });
export const fail = (status: number, error: string) => NextResponse.json<ApiResponse<never>>({ success: false, data: null, error }, { status });

const INVALID_DATA = "Dữ liệu không hợp lệ.";
const INVALID_FORM = "Dữ liệu gửi lên không hợp lệ.";

/**
 * Đọc body JSON bất kỳ; trả `{ json }` hoặc Response lỗi (413 `tooLarge` / 400 `invalid`).
 * Bọc trong object để không nhầm với Response khi JSON hợp lệ.
 */
export async function readJsonBody(
  req: Request,
  maxBytes: number,
  messages: { tooLarge: string; invalid: string },
): Promise<{ json: unknown } | Response> {
  try {
    return { json: JSON.parse(await readBodyWithLimit(req, maxBytes)) as unknown };
  } catch (e) {
    if (e instanceof BodyTooLargeError) return fail(413, messages.tooLarge);
    return fail(400, messages.invalid);
  }
}

/** Đọc object JSON; trả Response lỗi (413/400) nếu không hợp lệ. */
export async function readJsonObject(req: Request, maxBytes: number): Promise<Record<string, unknown> | Response> {
  const body = await readJsonBody(req, maxBytes, { tooLarge: "Dữ liệu gửi lên quá lớn.", invalid: INVALID_DATA });
  if (body instanceof Response) return body;
  const { json } = body;
  if (!json || typeof json !== "object" || Array.isArray(json)) return fail(400, INVALID_DATA);
  return json as Record<string, unknown>;
}

/**
 * Đọc body multipart (bản ghi âm) có giới hạn; trả FormData hoặc Response lỗi (413 `tooLarge` / 400).
 * Tự đếm byte: qua Cloudflare Tunnel, Content-Length có thể bị bỏ (truyền từng khúc).
 */
export async function readFormBody(req: Request, maxBytes: number, tooLarge: string): Promise<FormData | Response> {
  if (Number(req.headers.get("content-length") ?? "0") > maxBytes) return fail(413, tooLarge);
  try {
    const bytes = await readBytesWithLimit(req, maxBytes);
    if (!bytes) return fail(413, tooLarge);
    const body = new Blob([bytes as Uint8Array<ArrayBuffer>]);
    return await new Response(body, { headers: { "content-type": req.headers.get("content-type") ?? "" } }).formData();
  } catch {
    return fail(400, INVALID_FORM);
  }
}
