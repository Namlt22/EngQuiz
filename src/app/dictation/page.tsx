import type { Metadata } from "next";
import { DICTATIONS } from "@/content/dictations";
import { DictationList } from "@/components/dictation/DictationList";

export const metadata: Metadata = { title: "Nghe & chép chính tả" };

export default function DictationIndexPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Nghe & chép chính tả</h1>
      </header>
      <DictationList exercises={DICTATIONS} />
    </div>
  );
}
