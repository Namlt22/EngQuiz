import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, Clock, Headphones, PenLine } from "lucide-react";
import { CATALOG, getTopicMeta, topicsByLevel } from "@/content/catalog";
import { dictationsForTopic } from "@/content/dictations";
import { CATEGORY_LABELS, LEVEL_MAP } from "@/content/levels";
import { getTopicContent } from "@/content/topics";
import { TheoryBlocks } from "@/components/theory/TheoryBlocks";
import { TheoryFooter } from "@/components/learn/TheoryFooter";
import { LevelBadge } from "@/components/ui/LevelBadge";

export function generateStaticParams() {
  return CATALOG.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const meta = getTopicMeta((await params).slug);
  if (!meta) return {};
  const content = getTopicContent(meta.slug);
  return {
    title: `${meta.title} (${meta.titleEn}) — Ngữ pháp ${meta.level}`,
    description: content?.intro ?? `${meta.title}: lý thuyết, công thức, ví dụ và bài tập.`,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getTopicMeta(slug);
  if (!meta) notFound();
  const content = getTopicContent(slug);
  const level = LEVEL_MAP[meta.level];
  const dictation = dictationsForTopic(slug)[0];
  const siblings = topicsByLevel(meta.level);
  const idx = siblings.findIndex((t) => t.slug === slug);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href={`/levels/${meta.level.toLowerCase()}`} className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-fg">
        <ChevronLeft className="size-4" /> Lộ trình {meta.level} — {level.name}
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={meta.level} />
          <span className="chip bg-surface-2 text-muted">{CATEGORY_LABELS[meta.category]}</span>
          <span className="text-xs text-muted">
            Chủ điểm {idx + 1}/{siblings.length}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold leading-tight md:text-4xl">{meta.title}</h1>
        <p className="text-lg text-muted">{meta.titleEn}</p>
        {content && (
          <div className="flex flex-wrap gap-2 pt-1">
            <Link href={`/quiz/topic-${slug}`} className="btn-ghost">
              <PenLine className="size-4" /> Quiz {content.questions.length} câu
            </Link>
            {dictation && (
              <Link href={`/dictation/${dictation.id}`} className="btn-ghost">
                <Headphones className="size-4" /> Nghe chép {dictation.sentences.length} câu
              </Link>
            )}
          </div>
        )}
      </header>

      {content ? (
        <>
          <TheoryBlocks blocks={content.theory} />
          <TheoryFooter slug={slug} dictationId={dictation?.id} />
        </>
      ) : (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-surface-2 text-muted">
            <Clock className="size-7" />
          </span>
          <h2 className="text-lg font-bold">Chủ điểm đang được biên soạn</h2>
          <p className="max-w-md text-sm text-muted">
            Nội dung lý thuyết, quiz và bài nghe chép cho chủ điểm này sẽ sớm có. Trong lúc chờ, bạn có thể học các chủ điểm đã sẵn sàng.
          </p>
          <Link href="/grammar" className="btn-primary mt-2">
            Về thư viện ngữ pháp
          </Link>
        </div>
      )}
    </article>
  );
}
