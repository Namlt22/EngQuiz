import Link from "next/link";

/** Logo dạng chữ (tạm thời, chưa có nhận diện thương hiệu). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`} aria-label="EngQuiz — Trang chủ">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-black text-white shadow-md shadow-indigo-500/30 transition group-hover:rotate-[-6deg]">
        EQ
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        Eng<span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Quiz</span>
      </span>
    </Link>
  );
}
