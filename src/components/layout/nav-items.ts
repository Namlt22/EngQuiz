import { AudioLines, BookOpen, BookOpenText, Bot, Dumbbell, Gamepad2, GraduationCap, Headphones, House, Layers, MessageSquareText, MessagesSquare, Mic, NotebookPen, PenLine, Repeat, Route, Target, type LucideIcon } from "lucide-react";
import type { CourseCode } from "@/lib/course";

/**
 * Điều hướng chính, dùng chung cho header (máy tính) và thanh tab dưới (điện thoại) — docs/REDESIGN.md mục 2.
 * Cả hai khoá cùng khung: Hôm nay · Lộ trình · Học ▾ · Luyện ▾ · Sổ tay.
 */
export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavLink[];
}

export type NavEntry = ({ kind: "link" } & NavLink) | ({ kind: "group" } & NavGroup);

export const NAV_EN: NavEntry[] = [
  { kind: "link", href: "/", label: "Hôm nay", icon: House },
  { kind: "link", href: "/roadmap", label: "Lộ trình", icon: Route },
  {
    kind: "group",
    label: "Học",
    icon: BookOpen,
    items: [
      { href: "/grammar", label: "Ngữ pháp", icon: BookOpen },
      { href: "/vocab", label: "Từ vựng", icon: Layers },
      { href: "/ipa", label: "Phát âm", icon: AudioLines },
      { href: "/reading", label: "Đọc hiểu", icon: BookOpenText },
      { href: "/dialogues", label: "Hội thoại", icon: MessagesSquare },
      { href: "/a1-course", label: "Khoá A1 20 ngày", icon: GraduationCap },
    ],
  },
  {
    kind: "group",
    label: "Luyện",
    icon: Dumbbell,
    items: [
      { href: "/review", label: "Ôn thẻ hôm nay", icon: Repeat },
      { href: "/quiz", label: "Quiz", icon: PenLine },
      { href: "/games", label: "Trò chơi", icon: Gamepad2 },
      { href: "/level-test", label: "Kiểm tra trình độ", icon: Target },
      { href: "/sentences", label: "Đặt câu", icon: MessageSquareText },
      { href: "/dictation", label: "Nghe chép", icon: Headphones },
      { href: "/speaking", label: "Luyện nói", icon: Mic },
      { href: "/chat", label: "Trò chuyện AI", icon: Bot },
    ],
  },
  { kind: "link", href: "/notebook", label: "Sổ tay", icon: NotebookPen },
];

export const NAV_ZH: NavEntry[] = [
  { kind: "link", href: "/zh", label: "Hôm nay", icon: House },
  { kind: "link", href: "/zh/roadmap", label: "Lộ trình", icon: Route },
  {
    kind: "group",
    label: "Học",
    icon: BookOpen,
    items: [
      { href: "/zh/pinyin", label: "Pinyin", icon: AudioLines },
      { href: "/zh/hanzi", label: "Hán tự", icon: PenLine },
      { href: "/zh/vocab", label: "Từ vựng HSK", icon: Layers },
      { href: "/zh/grammar", label: "Ngữ pháp", icon: BookOpenText },
      { href: "/zh/reading", label: "Bài đọc", icon: BookOpen },
      { href: "/zh/dialogues", label: "Hội thoại", icon: MessagesSquare },
    ],
  },
  {
    kind: "group",
    label: "Luyện",
    icon: Dumbbell,
    items: [
      { href: "/zh/review", label: "Ôn thẻ hôm nay", icon: Repeat },
      { href: "/zh/sentences", label: "Đặt câu", icon: MessageSquareText },
      { href: "/zh/dictation", label: "Nghe chép", icon: Headphones },
      { href: "/zh/mock", label: "Thi thử HSK", icon: PenLine },
      { href: "/zh/chat", label: "Trò chuyện AI", icon: Bot },
    ],
  },
  { kind: "link", href: "/zh/notebook", label: "Sổ tay", icon: NotebookPen },
];

/**
 * Màn hình đang làm bài: thanh tab dưới ẩn để không che nút (docs/REDESIGN.md mục 2.2).
 */
export const SESSION_ROUTES: readonly RegExp[] = [
  /^\/quiz\/.+/,
  /^\/dictation\/.+/,
  /^\/zh\/dictation\/.+/,
  /^\/zh\/mock\/.+/,
  /^\/review\/?$/,
  /^\/zh\/review\/?$/,
  /^\/sentences\/.+/,
  /^\/zh\/sentences\/.+/,
  // Khoá tiếng Anh: ngày học khoá A1, game theo chủ đề, bài kiểm tra trình độ.
  /^\/a1-course\/.+/,
  /^\/games\/(vocab|grammar)\/.+/,
  /^\/level-test\/?$/,
];

export const isSessionRoute = (pathname: string) => SESSION_ROUTES.some((re) => re.test(pathname));

export const NAV_BY_COURSE: Record<CourseCode, NavEntry[]> = { en: NAV_EN, zh: NAV_ZH };

/** Trang đang mở có thuộc đường dẫn này không ("/" chỉ khớp đúng trang chủ). */
// Trang chủ của khoá ("/" và "/zh") chỉ khớp đúng chính nó, không khớp mọi trang con.
const COURSE_HOMES = new Set(["/", "/zh"]);
export const isActive = (href: string, pathname: string) =>
  COURSE_HOMES.has(href) ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export const isEntryActive = (entry: NavEntry, pathname: string) =>
  entry.kind === "link" ? isActive(entry.href, pathname) : entry.items.some((i) => isActive(i.href, pathname));
