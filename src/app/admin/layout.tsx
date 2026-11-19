import { auth } from "@/auth";
import { isAdminEmail } from "@/server/billing";
import { AdminNav } from "@/components/admin/AdminNav";

/** Khung chung các trang quản trị: thanh tab chỉ hiện với admin (từng trang vẫn tự trả 404 cho người khác). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const admin = !!session?.user?.id && isAdminEmail(session.user.email);
  return (
    <div className="space-y-5">
      {admin && <AdminNav />}
      {children}
    </div>
  );
}
