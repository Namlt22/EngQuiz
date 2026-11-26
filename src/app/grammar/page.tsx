import type { Metadata } from "next";
import Link from "next/link";
import { Gamepad2, GraduationCap, Target } from "lucide-react";
import { CATALOG } from "@/content/catalog";
import { TOPIC_CONTENT } from "@/content/topics";
import { GrammarLibrary } from "@/components/learn/GrammarLibrary";

export const metadata: Metadata = { title: "Thư viện ngữ pháp" };

export default function GrammarPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">Thư viện ngữ pháp</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/a1-course" className="btn-ghost text-sm">
            <GraduationCap className="size-4" /> Khoá A1 20 ngày
          </Link>
          <Link href="/level-test" className="btn-ghost text-sm">
            <Target className="size-4" /> Kiểm tra trình độ
          </Link>
          <Link href="/games?tab=grammar" className="btn-ghost text-sm">
            <Gamepad2 className="size-4" /> Trò chơi
          </Link>
        </div>
      </header>
      <GrammarLibrary topics={CATALOG} available={Object.keys(TOPIC_CONTENT)} />
    </div>
  );
}
