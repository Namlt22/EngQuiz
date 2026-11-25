import type { Metadata } from "next";
import { ZhGrammarList } from "@/components/zh/ZhGrammarList";

export const metadata: Metadata = { title: "Ngữ pháp HSK" };

export default function ZhGrammarPage() {
  return <ZhGrammarList />;
}
