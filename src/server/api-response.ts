/** Phản hồi API thống nhất { success, data, error } và đọc body JSON có giới hạn. */
import { NextResponse } from "next/server";
import { BodyTooLargeError, readBodyWithLimit } from "./request";

export const ok = <T>(data: T, status = 200) => NextResponse.json({ success: true, data, error: null }, { status });
export const fail = (status: number, error: string) => NextResponse.json({ success: false, data: null, error }, { status });

/** Đọc object JSON; trả Response lỗi (413/400) nếu không hợp lệ. */
export async function readJsonObject(req: Request, maxBytes: number): Promise<Record<string, unknown> | Response> {
  try {
    const body: unknown = JSON.parse(await readBodyWithLimit(req, maxBytes));
    if (!body || typeof body !== "object" || Array.isArray(body)) return fail(400, "Dữ liệu không hợp lệ.");
    return body as Record<string, unknown>;
  } catch (e) {
    if (e instanceof BodyTooLargeError) return fail(413, "Dữ liệu gửi lên quá lớn.");
    return fail(400, "Dữ liệu không hợp lệ.");
  }
}
