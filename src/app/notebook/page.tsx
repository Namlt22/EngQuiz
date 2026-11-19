import type { Metadata } from "next";
import { NotebookHome } from "@/components/notebook/NotebookHome";

export const metadata: Metadata = { title: "Sổ tay từ vựng" };

export default function NotebookPage() {
  return <NotebookHome course="en" />;
}
