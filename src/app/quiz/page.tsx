import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import { listQuizSets } from "@/lib/quiz-sets";
import { QuizSetList } from "@/components/quiz/QuizSetList";

export const metadata: Metadata = { title: "Quiz ngữ pháp" };

export default function QuizIndexPage() {
  const sets = listQuizSets().map(({ items, ...rest }) => ({
    ...rest,
    count: items.length,
    topicSlug: rest.kind === "topic" ? items[0]?.topicSlug : undefined,
  }));
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">Quiz ngữ pháp</h1>
        <Link href="/games?tab=grammar" className="btn-ghost text-sm">
          <Gamepad2 className="size-4" /> Trò chơi
        </Link>
      </header>
      <QuizSetList sets={sets} />
    </div>
  );
}
