import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { ZH_MOCKS } from "@/content/zh/mock";
import { HSK_INFO } from "@/content/zh/hsk-levels";

export const metadata: Metadata = { title: "Thi thử HSK" };

/** Danh sách bài thi thử HSK 1–4 (một mục duy nhất trong menu Luyện). */
export default function ZhMockIndexPage() {
  const tests = Object.values(ZH_MOCKS).sort((a, b) => a.level - b.level);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold md:text-3xl">Thi thử HSK</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {tests.map((t) => (
          <li key={t.id}>
            <Link href={`/zh/mock/${t.id}`} className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-lg font-black text-white ${HSK_INFO[t.level].gradient}`}>{t.level}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{t.title}</span>
                <span className="text-xs text-muted">{t.items.length} câu</span>
              </span>
              <ChevronRight className="size-5 text-muted transition group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
