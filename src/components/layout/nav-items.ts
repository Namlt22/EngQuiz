import { AudioLines, BookOpen, Headphones, House, Layers, PenLine, Route } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Trang chủ", icon: House, match: (p: string) => p === "/" },
  { href: "/roadmap", label: "Lộ trình", icon: Route, match: (p: string) => p.startsWith("/roadmap") },
  { href: "/levels", label: "Cấp độ", icon: Layers, match: (p: string) => p.startsWith("/levels") },
  { href: "/grammar", label: "Lý thuyết", icon: BookOpen, match: (p: string) => p.startsWith("/grammar") },
  { href: "/quiz", label: "Quiz", icon: PenLine, match: (p: string) => p.startsWith("/quiz") },
  { href: "/dictation", label: "Nghe chép", icon: Headphones, match: (p: string) => p.startsWith("/dictation") },
  { href: "/ipa", label: "Phát âm", icon: AudioLines, match: (p: string) => p.startsWith("/ipa") },
];
