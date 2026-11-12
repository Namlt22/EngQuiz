import type { Metadata } from "next";
import { RoadmapApp } from "@/components/roadmap/RoadmapApp";

export const metadata: Metadata = { title: "Lộ trình của tôi" };

export default function RoadmapPage() {
  return <RoadmapApp />;
}
