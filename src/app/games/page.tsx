import type { Metadata } from "next";
import { Suspense } from "react";
import { CATALOG } from "@/content/catalog";
import { TOPIC_CONTENT } from "@/content/topics";
import { availableGrammarModes } from "@/core/en-grammar-games";
import { GamesHub, type GrammarGameCard } from "@/components/en-games/GamesHub";

export const metadata: Metadata = {
  title: "Trò chơi",
  description: "Game từ vựng tiếng Anh theo chủ đề và game ngữ pháp theo chủ điểm.",
};

export default function Page() {
  const grammar: GrammarGameCard[] = CATALOG.filter((t) => TOPIC_CONTENT[t.slug] && availableGrammarModes(TOPIC_CONTENT[t.slug].questions).length).map((t) => ({
    slug: t.slug,
    title: t.title,
    titleEn: t.titleEn,
    level: t.level,
  }));
  return (
    <Suspense fallback={null}>
      <GamesHub grammar={grammar} />
    </Suspense>
  );
}
