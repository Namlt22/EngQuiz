/**
 * "Bước tiếp theo" sau mỗi hoạt động — hàm thuần, dùng chung cho mọi màn hình kết quả (docs/REDESIGN.md mục 3.4).
 * Thứ tự ưu tiên:
 *  1. Chưa đạt → Làm lại (nút phụ: xem lại bài nếu có, không thì về Hôm nay).
 *  2. Mở từ lộ trình → nhiệm vụ chưa xong kế tiếp của cùng ngày; hết ngày → "Xong Day n", về Hôm nay.
 *  3. Ngoài lộ trình → chuỗi nội dung do trang cung cấp (vd lý thuyết → quiz → nghe chép).
 *  4. Không có gì → Về Hôm nay. Không bao giờ chỉ còn một nút "Làm lại".
 */
import type { CourseCode } from "./course";
import type { RoadmapLog } from "./roadmap";
import { taskDone, type RoadmapDay } from "./roadmap-days";
import { roadmapDayHref, type ReturnTarget } from "./roadmap-return";

export interface StepLinkInput {
  label: string;
  href: string;
}

export type StepAction = { kind: "retry"; label: string } | { kind: "link"; label: string; href: string; returnTarget?: ReturnTarget };

export interface NextStepInput {
  course: CourseCode;
  passed: boolean;
  /** Đường dẫn làm lại (nếu là trang khác); bỏ trống = làm lại tại chỗ. */
  retryHref?: string;
  /** Khi chưa đạt: link xem lại bài (lý thuyết, bài đọc…). */
  reviewLink?: StepLinkInput;
  /** Hoạt động được mở từ lộ trình: ngày đó, nhật ký, và id nhiệm vụ vừa làm (coi như đã xong). */
  roadmap?: { day: RoadmapDay; log: RoadmapLog; currentTaskId: string };
  /** Chuỗi nội dung khi không ở trong lộ trình. */
  chain?: { primary?: StepLinkInput; secondary?: StepLinkInput };
}

export interface NextStep {
  primary: StepAction;
  secondary?: StepAction;
  /** Số Day vừa hoàn thành (khi nhiệm vụ vừa làm là nhiệm vụ cuối của ngày). */
  dayComplete?: number;
}

export const courseHome = (course: CourseCode) => (course === "zh" ? "/zh" : "/");
const home = (course: CourseCode): StepAction => ({ kind: "link", label: "Về Hôm nay", href: courseHome(course) });
const link = (l: StepLinkInput): StepAction => ({ kind: "link", label: l.label, href: l.href });

export function nextStep(input: NextStepInput): NextStep {
  const { course } = input;

  if (!input.passed) {
    return {
      primary: input.retryHref ? { kind: "link", label: "Làm lại", href: input.retryHref } : { kind: "retry", label: "Làm lại" },
      secondary: input.reviewLink ? link(input.reviewLink) : home(course),
    };
  }

  if (input.roadmap) {
    const { day, log, currentTaskId } = input.roadmap;
    const back: StepAction = { kind: "link", label: "Về lộ trình", href: roadmapDayHref(day.n, course) };
    const next = day.tasks.find((t) => t.id !== currentTaskId && !taskDone(log, t));
    if (next) {
      return {
        primary: { kind: "link", label: next.title, href: next.href, returnTarget: { day: day.n, taskId: next.id, title: next.title, course } },
        secondary: back,
      };
    }
    return { primary: home(course), secondary: back, dayComplete: day.n };
  }

  if (input.chain?.primary) {
    return { primary: link(input.chain.primary), ...(input.chain.secondary ? { secondary: link(input.chain.secondary) } : {}) };
  }
  return { primary: home(course) };
}
