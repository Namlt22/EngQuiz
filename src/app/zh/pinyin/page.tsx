import type { Metadata } from "next";
import { PinyinOverview } from "@/components/zh/PinyinOverview";

export const metadata: Metadata = { title: "Pinyin & thanh điệu" };

export default function PinyinPage() {
  return <PinyinOverview />;
}
