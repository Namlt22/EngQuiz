import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { LEVELS } from "@/content/levels";
import { topicsByLevel } from "@/content/catalog";
import { isAvailable } from "@/lib/learn";

export const metadata: Metadata = { title: "Lộ trình A1 – C1" };

export default function LevelsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Lộ trình ngữ pháp A1 → C1</h1>
        <p className="mt-1 text-muted">Theo khung tham chiếu châu Âu (CEFR). Chọn cấp độ phù hợp để bắt đầu.</p>
      </header>
      <div className="space-y-4">
        {LEVELS.map((l) => {
          const topics = topicsByLevel(l.code);
          return (
            <Link key={l.code} href={`/levels/${l.code.toLowerCase()}`} className="card group flex items-center gap-4 p-5 transition hover:shadow-md">
              <span className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-xl font-black text-white ${l.gradient}`}>
                {l.code}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-bold">{l.name}</div>
                <p className="text-sm text-muted">{l.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {topics.slice(0, 5).map((t) => (
                    <span key={t.slug} className={`chip ${isAvailable(t.slug) ? l.badge : "bg-surface-2 text-muted"}`}>
                      {t.titleEn}
                    </span>
                  ))}
                  {topics.length > 5 && <span className="chip bg-surface-2 text-muted">+{topics.length - 5}</span>}
                </div>
              </div>
              <ArrowRight className="size-5 shrink-0 text-muted transition group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
