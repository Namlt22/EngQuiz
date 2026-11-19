/** Kiểm tra request admin: cùng nguồn + đã đăng nhập bằng email trong ENGQUIZ_ADMIN_EMAILS. */
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { fail } from "./api-response";
import { isAdminEmail } from "./billing";
import { isSameOrigin } from "./request";

export async function requireAdmin(req: NextRequest): Promise<{ id: string; email: string } | Response> {
  if (!isSameOrigin(req)) return fail(403, "Yêu cầu không hợp lệ.");
  const session = await auth();
  const id = session?.user?.id;
  const email = session?.user?.email;
  if (!id || !email || !isAdminEmail(email)) return fail(403, "Chỉ quản trị viên mới làm được thao tác này.");
  return { id, email };
}
