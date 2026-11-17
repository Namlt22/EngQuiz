import type { Metadata } from "next";
import { ZhTextList } from "@/components/zh/ZhTextList";

export const metadata: Metadata = { title: "Nghe chép tiếng Trung" };

export default function Page() {
  return <ZhTextList kind="dictation" />;
}
