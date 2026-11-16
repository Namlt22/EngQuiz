import { AudioLines, BookOpen, BookOpenText, Dumbbell, Headphones, House, Layers, MessagesSquare, Mic, PenLine, Route, type LucideIcon } from "lucide-react";

/**
 * Điều hướng chính, dùng chung cho header (máy tính) và thanh tab dưới (điện thoại).
 * 10 trang được gom thành 4 mục để header không bị chật: Trang chủ · Lộ trình · Học ▾ · Luyện tập ▾.
 */
export interface NavLink {
  href: string;
  label: string;
  /** Mô tả ngắn hiện trong menu thả xuống */
  hint?: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavLink[];
}

export type NavEntry = ({ kind: "link" } & NavLink) | ({ kind: "group" } & NavGroup);

export const NAV: NavEntry[] = [
  { kind: "link", href: "/", label: "Trang chủ", icon: House },
  { kind: "link", href: "/roadmap", label: "Lộ trình", icon: Route },
  {
    kind: "group",
    label: "Học",
    icon: BookOpen,
    items: [
      { href: "/levels", label: "Cấp độ", hint: "Lộ trình A1 → C1 theo chủ điểm", icon: Layers },
      { href: "/grammar", label: "Lý thuyết", hint: "Ngữ pháp dễ hiểu, nhiều ví dụ", icon: BookOpen },
      { href: "/ipa", label: "Phát âm", hint: "Bảng IPA có âm thanh mẫu", icon: AudioLines },
      { href: "/reading", label: "Đọc hiểu", hint: "Bài đọc theo chủ đề, có câu hỏi", icon: BookOpenText },
    ],
  },
  {
    kind: "group",
    label: "Luyện tập",
    icon: Dumbbell,
    items: [
      { href: "/quiz", label: "Quiz", hint: "Bộ câu hỏi theo chủ điểm, cấp độ", icon: PenLine },
      { href: "/dictation", label: "Nghe chép", hint: "Nghe và chép lại từng câu", icon: Headphones },
      { href: "/speaking", label: "Luyện nói", hint: "Đọc theo mẫu, AI sửa lỗi khi nói", icon: Mic },
      { href: "/dialogues", label: "Hội thoại", hint: "Nghe và nhập vai theo tình huống", icon: MessagesSquare },
    ],
  },
];

/** Trang đang mở có thuộc đường dẫn này không ("/" chỉ khớp đúng trang chủ). */
export const isActive = (href: string, pathname: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export const isEntryActive = (entry: NavEntry, pathname: string) =>
  entry.kind === "link" ? isActive(entry.href, pathname) : entry.items.some((i) => isActive(i.href, pathname));
