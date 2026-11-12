"use client";

import { SessionProvider } from "next-auth/react";
import { LearnerSync } from "./LearnerSync";

/** Bọc toàn app: phiên đăng nhập (đọc ở client nên trang tĩnh vẫn tĩnh) + đồng bộ dữ liệu học. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LearnerSync />
      {children}
    </SessionProvider>
  );
}
