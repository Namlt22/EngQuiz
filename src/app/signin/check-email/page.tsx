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
      <Link href="/signin" className="btn-ghost">
        Dùng email khác
      </Link>
    </div>
  );
}
