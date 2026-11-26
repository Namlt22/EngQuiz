import { Suspense } from "react";
import type { Metadata } from "next";
import { EnVocabHome } from "@/components/vocab/EnVocabHome";

export const metadata: Metadata = {
  title: "Từ vựng",
  description: "Hơn 1 000 từ vựng tiếng Anh A1–B2 theo chủ đề, có phiên âm, nghĩa, câu ví dụ và thẻ ôn lặp lại ngắt quãng.",
};

export default function EnVocabPage() {
  return (
    <Suspense fallback={null}>
      <EnVocabHome />
    </Suspense>
  );
}
