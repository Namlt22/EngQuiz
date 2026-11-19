import type { Metadata } from "next";
import { ZhTextList } from "@/components/zh/ZhTextList";

export const metadata: Metadata = { title: "Hội thoại tiếng Trung" };

export default function Page() {
  return <ZhTextList kind="dialogue" />;
}
