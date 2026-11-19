import type { Metadata } from "next";
import { SentenceSetList } from "@/components/sentences/SentenceSetList";

export const metadata: Metadata = { title: "Luyện đặt câu tiếng Trung" };

export default function Page() {
  return <SentenceSetList course="zh" />;
}
