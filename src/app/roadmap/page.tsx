import type { Metadata } from "next";
import { RoadmapApp } from "@/components/roadmap/RoadmapApp";
import { GuestGate } from "@/components/auth/GuestGate";

export const metadata: Metadata = { title: "Lộ trình của tôi" };

export default function RoadmapPage() {
  return (
    <GuestGate itemKey="roadmap">
      <RoadmapApp />
    </GuestGate>
  );
}
