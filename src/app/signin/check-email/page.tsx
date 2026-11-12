import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck } from "lucide-react";

export const metadata: Metadata = { title: "Kiểm tra email" };

export default function CheckEmailPage() {
  return (
    <div className="card mx-auto max-w-md space-y-3 p-6 text-center md:p-8">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <MailCheck className="size-7" />
      </span>
      <h1 className="text-2xl font-extrabold">Kiểm tra hộp thư của bạn</h1>
      <p className="text-muted">
        EngQuiz vừa gửi link đăng nhập tới email của bạn. Bấm link trong email để đăng nhập; link có hiệu lực 24 giờ. Không thấy email thì xem cả mục Spam.
      </p>
      {process.env.NODE_ENV === "development" && !process.env.EMAIL_SERVER && (
        <p className="rounded-xl bg-warning-soft p-3 text-left text-sm">
          <b>Chế độ dev:</b> chưa cấu hình <code>EMAIL_SERVER</code> trong file <code>.env</code> nên EngQuiz <b>không gửi email</b>. Link
          đăng nhập được in ra terminal đang chạy <code>npm run dev</code>. Xem mục “Gửi email đăng nhập” trong README để bật gửi email thật.
        </p>
      )}
      <Link href="/signin" className="btn-ghost">
        Dùng email khác
      </Link>
    </div>
  );
}
