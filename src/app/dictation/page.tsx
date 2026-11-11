import type { Metadata } from "next";
import { DICTATIONS } from "@/content/dictations";
import { DictationList } from "@/components/dictation/DictationList";

export const metadata: Metadata = { title: "Nghe & chép chính tả" };

export default function DictationIndexPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold md:text-3xl">Nghe & chép chính tả</h1>
        <p className="mt-1 max-w-2xl text-muted">
          Nghe từng câu và gõ lại. Bấm <b className="text-fg">Kiểm tra</b>: từ đúng sẽ hiện ra, từ sai bị che bằng <code className="font-mono">***</code> để bạn
          nghe lại và tự sửa cho đến khi đúng.
        </p>
      </header>
      <DictationList exercises={DICTATIONS} />
    </div>
  );
}
