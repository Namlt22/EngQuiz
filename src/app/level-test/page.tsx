import type { Metadata } from "next";
import { LevelTest } from "@/components/en-course/LevelTest";

export const metadata: Metadata = {
  title: "Kiểm tra trình độ",
  description: "Bài kiểm tra trình độ tiếng Anh A1–C1, tối đa 20 câu.",
};

export default function Page() {
  return <LevelTest />;
}
