import { describe, expect, it } from "vitest";
import { nextStep } from "./next-step";
import type { RoadmapDay } from "./roadmap-days";
import { EMPTY_LOG } from "./roadmap";

const day: RoadmapDay = {
  week: 1,
  day: 2,
  n: 2,
  kind: "study",
  tasks: [
    { id: "1-2-1", kind: "theory", key: "theory:be", title: "Lý thuyết: to be", hint: "", href: "/grammar/be", minutes: 10 },
    { id: "1-2-2", kind: "quiz", key: "quiz:be", title: "Quiz: to be", hint: "", href: "/quiz/topic-be", minutes: 8 },
    { id: "1-2-3", kind: "dictation", key: "dictation:be", title: "Nghe chép: to be", hint: "", href: "/dictation/be", minutes: 8 },
  ],
};

describe("bước tiếp theo sau một hoạt động", () => {
  it("chưa đạt → nút chính là Làm lại, nút phụ là xem lại bài (nếu có)", () => {
    const s = nextStep({ course: "en", passed: false, retryHref: undefined, reviewLink: { label: "Xem lại lý thuyết", href: "/grammar/be" } });
    expect(s.primary).toEqual({ kind: "retry", label: "Làm lại" });
    expect(s.secondary).toEqual({ kind: "link", label: "Xem lại lý thuyết", href: "/grammar/be" });
  });

  it("mở từ lộ trình → nhiệm vụ chưa xong kế tiếp của cùng ngày, kèm mốc quay lại lộ trình", () => {
    const log = { ...EMPTY_LOG, tasks: { "1-2-1": true } };
    const s = nextStep({ course: "en", passed: true, roadmap: { day, log, currentTaskId: "1-2-2" } });
    expect(s.primary).toEqual({
      kind: "link",
      label: "Nghe chép: to be",
      href: "/dictation/be",
      returnTarget: { day: 2, taskId: "1-2-3", title: "Nghe chép: to be", course: "en" },
    });
    expect(s.secondary).toEqual({ kind: "link", label: "Về lộ trình", href: "/roadmap#day-2" });
    expect(s.dayComplete).toBeUndefined();
  });

  it("nhiệm vụ cuối của ngày → Xong Day n, về Hôm nay", () => {
    const log = { ...EMPTY_LOG, tasks: { "1-2-1": true, "1-2-2": true } };
    const s = nextStep({ course: "zh", passed: true, roadmap: { day, log, currentTaskId: "1-2-3" } });
    expect(s.dayComplete).toBe(2);
    expect(s.primary).toEqual({ kind: "link", label: "Về Hôm nay", href: "/zh" });
    expect(s.secondary).toEqual({ kind: "link", label: "Về lộ trình", href: "/zh/roadmap#day-2" });
  });

  it("ngoài lộ trình → theo chuỗi nội dung do trang cung cấp", () => {
    const s = nextStep({ course: "en", passed: true, chain: { primary: { label: "Nghe chép", href: "/dictation/be" }, secondary: { label: "Chủ điểm tiếp", href: "/grammar/have" } } });
    expect(s.primary).toEqual({ kind: "link", label: "Nghe chép", href: "/dictation/be" });
    expect(s.secondary).toEqual({ kind: "link", label: "Chủ điểm tiếp", href: "/grammar/have" });
  });

  it("không có gì → Về Hôm nay; không bao giờ chỉ có Làm lại", () => {
    expect(nextStep({ course: "en", passed: true }).primary).toEqual({ kind: "link", label: "Về Hôm nay", href: "/" });
    const failed = nextStep({ course: "zh", passed: false });
    expect(failed.secondary).toEqual({ kind: "link", label: "Về Hôm nay", href: "/zh" });
  });
});
