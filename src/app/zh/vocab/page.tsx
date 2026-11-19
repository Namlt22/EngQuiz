import { Suspense } from "react";
import type { Metadata } from "next";
import { VocabHome } from "@/components/zh/VocabHome";

export const metadata: Metadata = { title: "Từ vựng HSK" };

export default function VocabPage() {
  return (
    <Suspense fallback={null}>
      <VocabHome />
    </Suspense>
  );
}
