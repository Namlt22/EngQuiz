import type { Metadata } from "next";
import { ZhTextList } from "@/components/zh/ZhTextList";

export const metadata: Metadata = { title: "Bài đọc tiếng Trung" };

export default function Page() {
  return <ZhTextList kind="reading" />;
}
