/**
 * Gọi API của EngQuiz từ trình duyệt: POST JSON hoặc form, đọc envelope { success, data, error }.
 * Lỗi mạng / hủy (AbortError, TimeoutError) vẫn ném ra để từng màn hình tự báo theo ngữ cảnh.
 */
import type { ApiResponse } from "./learner-schema";

export interface ApiReply<T> {
  status: number;
  ok: boolean;
  /** null nếu thân phản hồi không phải JSON. */
  json: ApiResponse<T> | null;
}

/** FormData gửi nguyên (bản ghi âm); mọi giá trị khác gửi dạng JSON. */
export async function postApi<T>(url: string, body: FormData | object, init: { signal?: AbortSignal } = {}): Promise<ApiReply<T>> {
  const isForm = body instanceof FormData;
  const res = await fetch(url, {
    method: "POST",
    ...(isForm ? {} : { headers: { "content-type": "application/json" } }),
    body: isForm ? body : JSON.stringify(body),
    signal: init.signal,
  });
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  return { status: res.status, ok: res.ok, json };
}

/** Dữ liệu khi thành công (HTTP 2xx và success), ngược lại undefined. */
export function replyData<T>(reply: ApiReply<T>): T | undefined {
  return reply.ok && reply.json?.success ? reply.json.data : undefined;
}

/** Thông báo lỗi của máy chủ, hoặc `fallback` nếu phản hồi không có. */
export const replyError = (reply: ApiReply<unknown>, fallback: string): string => reply.json?.error ?? fallback;

/** Dịch vụ giọng nói trên máy chủ đang tắt (route trả 503 "… tạm nghỉ …") → màn hình quay về cách khác. */
export const isServiceResting = (reply: ApiReply<unknown>): boolean => reply.status === 503 && !!reply.json?.error?.includes("tạm nghỉ");
