import { describe, expect, it } from "vitest";
import { getSentenceSet } from "@/content/sentence-practice";
import { EMPTY_LOG, buildRoadmap, type RoadmapLog, type RoadmapProfile } from "./roadmap";
import { SENTENCE_TASKS_MARKER, buildDays, completeResource, dayDone, remapTasks, resourceKey, settleAddedTasks, type RoadmapDay } from "./roadmap-days";
import { buildZhRoadmap, zhProfile, zhSentenceSetFor } from "./zh-roadmap";

const profile = (patch: Partial<RoadmapProfile> = {}): RoadmapProfile => ({
  level: "A1",
  goal: "daily",
  focus: "speaking",
  minutesPerDay: 60,
  weeks: 12,
  startDate: "2026-11-16",
  ...patch,
});

const enDays = buildDays(buildRoadmap(profile()));
const zhDays = buildZhRoadmap(zhProfile(false, "2026-11-16")).days;
const sentenceTasks = (days: RoadmapDay[]) => days.flatMap((d) => d.tasks.filter((t) => t.kind === "sentence").map((t) => ({ day: d, t })));
const finishOld = (days: RoadmapDay[], log: RoadmapLog, n: number) =>
  days[n - 1].tasks.filter((t) => t.kind !== "sentence").reduce((l, t) => ({ ...l, tasks: { ...l.tasks, [t.id]: true } }), log);

describe("nhiệm vụ Đặt câu trong lộ trình", () => {
  it("tiếng Anh: mỗi tuần một bộ, ở cuối ngày 6, trỏ đúng trang bộ câu", () => {
    const found = sentenceTasks(enDays);
    expect(found.length).toBe(Math.max(...enDays.map((d) => d.week)));
    for (const { day, t } of found) {
      expect(day.day).toBe(6);
      expect(day.tasks[day.tasks.length - 1]).toBe(t);
      const id = t.href.split("/").pop()!;
      expect(getSentenceSet(id)?.course).toBe("en");
      expect(t.key).toBe(resourceKey("sentence", id));
    }
  });

  it("tiếng Trung: tuần nhập môn không có; tuần HSK có một bộ đúng cấp ở cuối ngày 6", () => {
    const found = sentenceTasks(zhDays);
    expect(found.length).toBeGreaterThan(0);
    for (const { day, t } of found) {
      expect(day.day).toBe(6);
      expect(day.tasks[day.tasks.length - 1]).toBe(t);
      expect(t.href).toMatch(/^\/zh\/sentences\/zh-/);
    }
    expect(found.some(({ day }) => day.week === 1)).toBe(false);
    expect(zhSentenceSetFor(undefined, 0)).toBeUndefined();
    expect(getSentenceSet(zhSentenceSetFor(1, 0)!)?.level).toBe("HSK 1");
    // Cấp chưa có bộ riêng → dùng cấp cao nhất đang có.
    expect(getSentenceSet(zhSentenceSetFor(4, 0)!)?.level).toBe("HSK 3");
  });

  it("ngày đã xong trước đợt thêm bài không bị mở lại; ngày chưa xong phải làm cả bài Đặt câu", () => {
    const [{ day: d6 }, { day: d13 }] = sentenceTasks(enDays);
    let log = EMPTY_LOG;
    for (let n = 1; n <= d6.n; n++) log = finishOld(enDays, log, n);
    const settled = settleAddedTasks(enDays, log);
    expect(dayDone(settled, d6)).toBe(true);
    expect(settled.tasks[SENTENCE_TASKS_MARKER]).toBe(true);

    // Sau đợt chuyển: làm xong bài cũ của tuần 2 vẫn chưa đủ.
    let later = settled;
    for (let n = d6.n + 1; n <= d13.n; n++) later = finishOld(enDays, later, n);
    expect(settleAddedTasks(enDays, later)).toBe(later);
    expect(dayDone(later, d13)).toBe(false);
    const sentence = d13.tasks[d13.tasks.length - 1];
    expect(dayDone(completeResource(enDays, later, sentence.key), d13)).toBe(true);
  });

  it("đổi hồ sơ (remapTasks) giữ dấu đã chuyển dữ liệu", () => {
    const log = settleAddedTasks(enDays, EMPTY_LOG);
    const other = buildDays(buildRoadmap(profile({ level: "B1" })));
    expect(remapTasks(enDays, other, log).tasks[SENTENCE_TASKS_MARKER]).toBe(true);
  });
});
