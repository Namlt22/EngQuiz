import { useId } from "react";
import type { CourseCode } from "@/lib/course";

/**
 * Lá cờ tròn của khoá học: Anh cho tiếng Anh, Trung Quốc cho tiếng Trung.
 * Vẽ bằng SVG (emoji cờ không hiển thị trên Windows). `className` quyết định kích thước, vd "size-7".
 */
export function CourseMark({ course, className = "size-7" }: { course: CourseCode; className?: string }) {
  return (
    <span aria-hidden="true" className={`block shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/15 ${className}`}>
      {course === "zh" ? <ChinaFlag /> : <UkFlag />}
    </span>
  );
}

/** Cờ Vương quốc Anh (tỉ lệ 2:1), cắt giữa thành hình tròn. */
function UkFlag() {
  // id của clipPath phải riêng cho từng lá cờ vì có thể có nhiều lá trên cùng trang.
  const clip = useId();
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="size-full">
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${clip})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/** Ngôi sao năm cánh bán kính 1, tâm tại gốc toạ độ. */
const STAR = "M0,-1 0.5878,0.809 -0.9511,-0.309H0.9511L-0.5878,0.809z";
/** Vị trí các ngôi sao nhỏ theo thiết kế chuẩn (lưới 30 × 20), mỗi sao xoay hướng về sao lớn. */
const SMALL_STARS: [x: number, y: number, rotate: number][] = [
  [10, 2, 23.04],
  [12, 4, 45.87],
  [12, 7, 69.95],
  [10, 9, 20.66],
];

/** Cờ Trung Quốc (tỉ lệ 3:2), cắt lệch trái để giữ trọn các ngôi sao trong hình tròn. */
function ChinaFlag() {
  return (
    <svg viewBox="0 0 30 20" preserveAspectRatio="xMinYMid slice" className="size-full">
      <rect width="30" height="20" fill="#EE1C25" />
      <path d={STAR} fill="#FFDE00" transform="translate(5,5) scale(3)" />
      {SMALL_STARS.map(([x, y, r]) => (
        <path key={`${x}-${y}`} d={STAR} fill="#FFDE00" transform={`translate(${x},${y}) rotate(${r})`} />
      ))}
    </svg>
  );
}
