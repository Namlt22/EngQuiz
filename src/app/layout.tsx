import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { themeInitScript } from "@/components/layout/ThemeToggle";
import { Providers } from "@/components/auth/Providers";

export const metadata: Metadata = {
  title: { default: "EngQuiz — Học ngữ pháp & luyện nghe tiếng Anh", template: "%s · EngQuiz" },
  description:
    "Học ngữ pháp tiếng Anh từ A1 đến C1: lý thuyết dễ hiểu, quiz ngữ pháp và luyện nghe chép chính tả (dictation).",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Charis+SIL:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-dvh">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:pb-16">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
