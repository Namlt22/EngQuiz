import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LEVELS, getLevel } from "@/content/levels";
import { topicsByLevel } from "@/content/catalog";
import { LevelPath } from "@/components/learn/LevelPath";

export function generateStaticParams() {
  return LEVELS.map((l) => ({ level: l.code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const level = getLevel((await params).level);
  return { title: level ? `Ngữ pháp ${level.code} — ${level.name}` : "Cấp độ" };
}

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const level = getLevel((await params).level);
  if (!level) notFound();
  const idx = LEVELS.indexOf(level);
  const prev = LEVELS[idx - 1];
  const next = LEVELS[idx + 1];

  return (
    <div className="space-y-6">
      <section className={`rounded-3xl bg-gradient-to-br p-6 text-white shadow-lg md:p-8 ${level.gradient}`}>
        <Link href="/levels" className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white">
          <ChevronLeft className="size-4" /> Tất cả cấp độ
        </Link>
        <div className="mt-3 flex items-center gap-4">
          <span className="grid size-16 place-items-center rounded-2xl bg-white/20 text-2xl font-black">{level.code}</span>
          <div>
            <h1 className="text-2xl font-extrabold md:text-3xl">{level.name}</h1>
            <p className="text-white/85">{topicsByLevel(level.code).length} chủ điểm ngữ pháp</p>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-white/90">{level.description}</p>
      </section>

      <p className="text-sm text-muted">
        Mỗi chủ điểm gồm 3 bước: <b className="text-fg">đọc lý thuyết</b> → <b className="text-fg">quiz ≥ 80%</b> →{" "}
        <b className="text-fg">nghe chép ≥ 80%</b>. Hoàn thành cả 3 để mở chủ điểm tiếp theo.
      </p>

      <LevelPath level={level.code} accent={level.accent} />

      <nav className="flex justify-between pt-2">
        {prev ? (
          <Link href={`/levels/${prev.code.toLowerCase()}`} className="btn-ghost">
            <ChevronLeft className="size-4" /> {prev.code}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/levels/${next.code.toLowerCase()}`} className="btn-ghost">
            {next.code} <ChevronRight className="size-4" />
          </Link>
        )}
      </nav>
    </div>
  );
}
