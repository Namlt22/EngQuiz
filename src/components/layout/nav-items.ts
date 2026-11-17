import { AudioLines, BookOpen, BookOpenText, Dumbbell, Headphones, House, Layers, MessagesSquare, Mic, PenLine, Route, type LucideIcon } from "lucide-react";
import type { CourseCode } from "@/lib/course";

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

export const NAV_EN: NavEntry[] = [
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

/**
 * Khoá tiếng Trung — chỉ liệt kê trang đã có nội dung; các phần pinyin, Hán tự, từ vựng…
 * được thêm vào đây khi xây xong (docs/PLAN-ZH.md mục 7).
 */
export const NAV_ZH: NavEntry[] = [
  { kind: "link", href: "/zh", label: "Trang chủ", icon: House },
  { kind: "link", href: "/zh/roadmap", label: "Lộ trình", icon: Route },
  {
    kind: "group",
    label: "Học",
    icon: BookOpen,
    items: [
      { href: "/zh/pinyin", label: "Pinyin & thanh điệu", hint: "Thanh mẫu, vận mẫu, 4 thanh, biến điệu", icon: AudioLines },
      { href: "/zh/hanzi", label: "Hán tự", hint: "Nét, bộ thủ, tập viết có hoạt hình", icon: PenLine },
      { href: "/zh/vocab", label: "Từ vựng HSK", hint: "Thẻ ôn lặp lại ngắt quãng", icon: Layers },
      { href: "/zh/grammar", label: "Ngữ pháp", hint: "Theo danh mục chuẩn HSK 3.0", icon: BookOpenText },
      { href: "/zh/reading", label: "Bài đọc", hint: "Bài đọc ngắn, chạm từ xem nghĩa", icon: BookOpen },
    ],
  },
  {
    kind: "group",
    label: "Luyện tập",
    icon: Dumbbell,
    items: [
      { href: "/zh/dialogues", label: "Hội thoại", hint: "Tình huống giao tiếp, mỗi vai một giọng", icon: MessagesSquare },
      { href: "/zh/dictation", label: "Nghe chép", hint: "Gõ pinyin hoặc chữ Hán, chấm từng thanh", icon: Headphones },
      { href: "/zh/mock/hsk1", label: "Thi thử HSK 1", hint: "20 câu nghe – đọc, chấm điểm từng phần", icon: PenLine },
    ],
  },
];

export const NAV_BY_COURSE: Record<CourseCode, NavEntry[]> = { en: NAV_EN, zh: NAV_ZH };

/** Trang đang mở có thuộc đường dẫn này không ("/" chỉ khớp đúng trang chủ). */
// Trang chủ của khoá ("/" và "/zh") chỉ khớp đúng chính nó, không khớp mọi trang con.
const COURSE_HOMES = new Set(["/", "/zh"]);
export const isActive = (href: string, pathname: string) =>
  COURSE_HOMES.has(href) ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export const isEntryActive = (entry: NavEntry, pathname: string) =>
  entry.kind === "link" ? isActive(entry.href, pathname) : entry.items.some((i) => isActive(i.href, pathname));
