"use client";

/**
 * Ôn thẻ hôm nay (/review, /zh/review): một phiên gộp thẻ đến hạn của bộ từ chuẩn và Sổ tay
 * (src/lib/review-queue.ts). Mặt trước là nghĩa tiếng Việt. Xong phiên ở khoá tiếng Trung tích bài
 * "Ôn từ vựng" của lộ trình.
 */
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getEnWord } from "@/content/vocab-en";
import { getHskWord } from "@/content/zh/vocab";
import { vocabVi } from "@/content/zh/vocab-vi";
import { dayNumber } from "@/core/srs";
import type { CourseCode } from "@/lib/course";
import { progressActions, useProgress } from "@/lib/progress";
import { buildReviewQueue, type ReviewItem } from "@/lib/review-queue";
import { useHydrated } from "@/lib/roadmap-store";
import { useSpeech } from "@/lib/speech";
import { notebookCard } from "@/components/notebook/NotebookHome";
import { CardSession, type Card, type CardMode } from "./CardSession";

function toCard(item: ReviewItem, course: CourseCode): Card | null {
  if (item.kind === "notebook") return notebookCard(item.entry);
  const grade: Card["grade"] = (g) => progressActions.reviewWord(item.word, g);
  if (course === "zh") {
    const w = getHskWord(item.word);
    const vi = vocabVi(item.word);
    return w && vi ? { id: `v:${item.word}`, term: w.hanzi, meaning: vi[1], reading: w.pinyin, grade } : null;
  }
  const w = getEnWord(item.word);
  return w ? { id: `v:${item.word}`, term: w[0], meaning: w[3], reading: w[2], example: w[4], grade } : null;
}

export function ReviewHome({ course }: { course: CourseCode }) {
  const hydrated = useHydrated();
  const p = useProgress();
  const { speak } = useSpeech({ lang: course });
  const [session, setSession] = useState<{ cards: Card[]; mode: CardMode } | null>(null);
  const [finished, setFinished] = useState(false);
  const home = course === "zh" ? "/zh" : "/";

  if (!hydrated) return <div className="card h-64 animate-pulse" aria-busy="true" />;

  if (session) {
    return (
      <div className="mx-auto max-w-xl">
        <CardSession
          cards={session.cards}
          mode={session.mode}
          course={course}
          speak={(t) => speak(t, 0.9)}
          onExit={({ total }) => {
            setSession(null);
            if (total >= session.cards.length) {
              setFinished(true);
              if (course === "zh") progressActions.finishVocabSession();
            }
          }}
        />
      </div>
    );
  }

  const cards = buildReviewQueue(p.srs, p.notebook ?? [], dayNumber())
    .map((item) => toCard(item, course))
    .filter((c): c is Card => c !== null);

  if (!cards.length || finished) {
    return (
      <section className="card mx-auto flex max-w-md flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <p className="font-semibold">Đã ôn xong</p>
        <Link href={home} className="btn-primary">
          Về Hôm nay
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-extrabold md:text-3xl">Ôn thẻ hôm nay</h1>
      <section className="card space-y-3 p-5 text-center">
        <div className="text-4xl font-extrabold text-primary">{cards.length}</div>
        <button type="button" onClick={() => setSession({ cards, mode: "meaning" })} className="btn-primary w-full">
          Bắt đầu
        </button>
        <button type="button" onClick={() => setSession({ cards, mode: "type" })} className="btn-ghost w-full text-sm">
          Gõ từ
        </button>
      </section>
    </div>
  );
}
