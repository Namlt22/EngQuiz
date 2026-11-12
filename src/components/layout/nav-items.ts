import { AudioLines, BookOpen, Headphones, House, Layers, Mic, PenLine, Route } from "lucide-react";

/** `short`: nhãn ngắn cho thanh tab dưới cùng trên điện thoại (chỗ hẹp). */
export const NAV_ITEMS: { href: string; label: string; short?: string; icon: typeof House; match: (p: string) => boolean }[] = [
  { href: "/", label: "Trang chủ", icon: House, match: (p: string) => p === "/" },
  { href: "/roadmap", label: "Lộ trình", icon: Route, match: (p: string) => p.startsWith("/roadmap") },
  { href: "/levels", label: "Cấp độ", icon: Layers, match: (p: string) => p.startsWith("/levels") },
  { href: "/grammar", label: "Lý thuyết", icon: BookOpen, match: (p: string) => p.startsWith("/grammar") },
  { href: "/quiz", label: "Quiz", icon: PenLine, match: (p: string) => p.startsWith("/quiz") },
  { href: "/dictation", label: "Nghe chép", icon: Headphones, match: (p: string) => p.startsWith("/dictation") },
  { href: "/speaking", label: "Luyện nói", short: "Nói", icon: Mic, match: (p: string) => p.startsWith("/speaking") },
  { href: "/ipa", label: "Phát âm", icon: AudioLines, match: (p: string) => p.startsWith("/ipa") },
];
