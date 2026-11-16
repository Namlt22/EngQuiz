"use client";

/** Danh sách bài ngữ pháp tiếng Trung theo cấp, đánh dấu bài đã xong. */
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HSK_INFO } from "@/content/zh/hsk-levels";
import { grammarAtLevel } from "@/content/zh/grammar";
import { useProgress } from "@/lib/progress";

export function ZhGrammarList() {
  const topics = useProgress().topics;
  const lessons = grammarAtLevel(1);
  const doneCount = lessons.filter((l) => topics[`grammar-${l.id}`]?.theoryRead).length;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-extrabold md:text-3xl">Ngữ pháp HSK</h1>
        <p className="max-w-2xl text-muted">
          Bám danh mục điểm ngữ pháp của chuẩn HSK 3.0. Mỗi bài có công thức, ví dụ (chỉ dùng từ trong cấp), lỗi người Việt hay mắc và bài tập. Làm bài tập đạt từ 80% thì bài được ghi nhận.
        </p>
      </header>
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-extrabold">
            HSK 1 · {HSK_INFO[1].grammarPoints} điểm ngữ pháp
          </h2>
          <span className="text-sm text-muted">
            Đã xong {doneCount}/{lessons.length}
          </span>
        </div>
        <ol className="space-y-2">
          {lessons.map((l, i) => {
            const done = !!topics[`grammar-${l.id}`]?.theoryRead;
            return (
              <li key={l.id}>
                <Link href={`/zh/grammar/${l.id}`} className={`card group flex items-center gap-4 p-4 transition hover:shadow-md ${done ? "border-success/40" : ""}`}>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl font-black ${done ? "bg-success text-white" : "bg-surface-2"}`}>
                    {done ? <CheckCircle2 className="size-5" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{l.title}</span>
                    <span className="block text-sm text-muted">{l.intro}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ol>
        <p className="text-sm text-muted">Ngữ pháp HSK 2–4 sẽ mở theo từng chặng của lộ trình.</p>
      </section>
    </div>
  );
}
