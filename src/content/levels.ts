import type { Category, LevelCode } from "./types";

export interface LevelInfo {
  code: LevelCode;
  name: string;
  description: string;
  /** Lớp Tailwind cho huy hiệu cấp độ (nền + chữ). */
  badge: string;
  /** Lớp Tailwind cho dải màu nhấn. */
  accent: string;
  /** Lớp gradient cho phần đầu trang cấp độ. */
  gradient: string;
  ring: string;
}

export const LEVELS: LevelInfo[] = [
  {
    code: "A1",
    name: "Sơ cấp",
    description: "Làm quen: động từ to be, hiện tại đơn, hiện tại tiếp diễn, câu hỏi cơ bản.",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    accent: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-500/40",
  },
  {
    code: "A2",
    name: "Sơ trung cấp",
    description: "Quá khứ, tương lai, hiện tại hoàn thành, so sánh, câu điều kiện loại 0 & 1.",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    accent: "bg-sky-500",
    gradient: "from-sky-500 to-blue-500",
    ring: "ring-sky-500/40",
  },
  {
    code: "B1",
    name: "Trung cấp",
    description: "Câu điều kiện loại 2, bị động, mệnh đề quan hệ, câu tường thuật.",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    accent: "bg-violet-500",
    gradient: "from-violet-500 to-purple-500",
    ring: "ring-violet-500/40",
  },
  {
    code: "B2",
    name: "Trung cao cấp",
    description: "Điều kiện loại 3 & hỗn hợp, 12 thì, suy đoán quá khứ, mệnh đề phân từ.",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    accent: "bg-orange-500",
    gradient: "from-orange-500 to-amber-500",
    ring: "ring-orange-500/40",
  },
  {
    code: "C1",
    name: "Cao cấp",
    description: "Đảo ngữ, câu chẻ, thể giả định, cấu trúc nhấn mạnh và văn phong học thuật.",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    accent: "bg-rose-500",
    gradient: "from-rose-500 to-pink-500",
    ring: "ring-rose-500/40",
  },
];

export const LEVEL_MAP = Object.fromEntries(LEVELS.map((l) => [l.code, l])) as Record<
  LevelCode,
  LevelInfo
>;

export function getLevel(code: string): LevelInfo | undefined {
  return LEVELS.find((l) => l.code.toLowerCase() === code.toLowerCase());
}

export const CATEGORY_LABELS: Record<Category, string> = {
  TENSE: "Các thì",
  MODAL: "Động từ khuyết thiếu",
  COND: "Câu điều kiện",
  PASSIVE: "Câu bị động",
  REPORTED: "Câu tường thuật",
  RELATIVE: "Mệnh đề quan hệ",
  WORD: "Từ loại",
  STRUCT: "Cấu trúc câu",
  CLAUSE: "Liên từ & mệnh đề",
};
