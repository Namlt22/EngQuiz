import type { Metadata } from "next";
import { ZhRoadmapApp } from "@/components/zh/ZhRoadmapApp";

export const metadata: Metadata = { title: "Lộ trình tiếng Trung" };

export default function ZhRoadmapPage() {
  return <ZhRoadmapApp />;
}
