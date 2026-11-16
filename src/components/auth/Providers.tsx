"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { startNewVisit } from "@/lib/roadmap-store";
import { DevtoolsGuard } from "@/components/layout/DevtoolsGuard";
import { LearnerSync } from "./LearnerSync";

/** Mỗi lần chuyển trang là một "lượt học" mới cho lộ trình (xem startNewVisit). */
function RoadmapVisitScope() {
  const pathname = usePathname();
  useEffect(() => startNewVisit(), [pathname]);
  return null;
}

/** Bọc toàn app: phiên đăng nhập (đọc ở client nên trang tĩnh vẫn tĩnh) + đồng bộ dữ liệu học. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LearnerSync />
      <RoadmapVisitScope />
      <DevtoolsGuard />
      {children}
    </SessionProvider>
  );
}
