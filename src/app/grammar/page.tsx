import type { Metadata } from "next";
import { CATALOG } from "@/content/catalog";
import { TOPIC_CONTENT } from "@/content/topics";
import { GrammarLibrary } from "@/components/learn/GrammarLibrary";

export const metadata: Metadata = { title: "Thư viện ngữ pháp" };

export default function GrammarPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Thư viện ngữ pháp</h1>
        <p className="mt-1 text-muted">81 chủ điểm từ A1 đến C1: các thì, câu điều kiện, bị động, mệnh đề quan hệ...</p>
      </header>
      <GrammarLibrary topics={CATALOG} available={Object.keys(TOPIC_CONTENT)} />
    </div>
  );
}
