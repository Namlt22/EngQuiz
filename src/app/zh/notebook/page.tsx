import type { Metadata } from "next";
import { NotebookHome } from "@/components/notebook/NotebookHome";

export const metadata: Metadata = { title: "Sổ tay từ vựng" };

export default function ZhNotebookPage() {
  return <NotebookHome course="zh" />;
}
