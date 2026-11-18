import type { Metadata } from "next";
import { DICTATIONS } from "@/content/dictations";
import { DictationList } from "@/components/dictation/DictationList";

export const metadata: Metadata = { title: "Nghe & chép chính tả" };

export default function DictationIndexPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Nghe & chép chính tả</h1>
        <p className="mt-1 text-sm text-muted">Nghe, gõ lại — từ sai bị che <code className="font-mono">***</code> để bạn tự sửa.</p>
      </header>
      <DictationList exercises={DICTATIONS} />
    </div>
  );
}
