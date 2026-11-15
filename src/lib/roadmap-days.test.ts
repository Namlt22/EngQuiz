import { describe, expect, it } from "vitest";
import { EMPTY_LOG, buildRoadmap, type RoadmapLog, type RoadmapProfile } from "./roadmap";
import { DAYS_PER_WEEK, buildDays, completeResource, dayDone, nextOpenDay, resourceKey } from "./roadmap-days";

const profile = (patch: Partial<RoadmapProfile> = {}): RoadmapProfile => ({
  level: "A1",
  goal: "daily",
  focus: "speaking",
  minutesPerDay: 60,
  weeks: 12,
  startDate: "2026-11-16",
  ...patch,
});

const days = buildDays(buildRoadmap(profile()));
const finishDay = (log: RoadmapLog, n: number) => days[n - 1].tasks.reduce((l, t) => completeResource(days, l, t.key), log);

describe("chia lộ trình thành ngày học", () => {
  it("mỗi tuần 7 ngày, đánh số Day 1…; ngày 7 là buổi nói chuyện thật", () => {
    expect(days).toHaveLength(12 * DAYS_PER_WEEK);
    expect(days.map((d) => d.n)).toEqual(days.map((_, i) => i + 1));
    expect(days.filter((d) => d.kind === "talk").every((d) => d.day === 7 && d.tasks.length === 0)).toBe(true);
  });

  it("mọi ngày học có ít nhất 2 bài, mỗi bài có link và khóa hoạt động", () => {
    for (const p of [profile(), profile({ level: "B1", weeks: 16, goal: "work" }), profile({ weeks: 8, goal: "travel" })]) {
      for (const d of buildDays(buildRoadmap(p)).filter((x) => x.kind === "study")) {
        expect(d.tasks.length, `Day ${d.n}`).toBeGreaterThanOrEqual(2);
        for (const t of d.tasks) {
          expect(t.href.startsWith("/")).toBe(true);
          expect(t.key).toMatch(/^[a-z]+:.+/);
          expect(t.title.length).toBeGreaterThan(3);
        }
      }
    }
  });

  it("tuần đầu học đủ mọi chủ điểm ngữ pháp và bài nghe của tuần (lý thuyết + quiz, nghe chép rồi đọc theo mẫu)", () => {
    const week1 = buildRoadmap(profile()).weeks[0];
    const keys = days.filter((d) => d.week === 1).flatMap((d) => d.tasks.map((t) => t.key));
    for (const slug of week1.grammar) expect(keys).toEqual(expect.arrayContaining([resourceKey("theory", slug), resourceKey("quiz", slug)]));
    for (const id of week1.dictations) expect(keys).toEqual(expect.arrayContaining([resourceKey("dictation", id), resourceKey("read", id)]));
    // nghe chép đứng trước đọc theo mẫu cùng bộ câu
    const dayOf = (key: string) => days.find((d) => d.tasks.some((t) => t.key === key))!.n;
    for (const id of week1.dictations) expect(dayOf(resourceKey("dictation", id))).toBeLessThan(dayOf(resourceKey("read", id)));
  });
});

describe("tự hoàn thành", () => {
  it("làm xong mọi bài của Day 1 → Day 1 tự hoàn thành, bài tiếp theo là Day 2", () => {
    expect(dayDone(EMPTY_LOG, days[0])).toBe(false);
    const log = finishDay(EMPTY_LOG, 1);
    expect(dayDone(log, days[0])).toBe(true);
    expect(nextOpenDay(days, log)?.n).toBe(2);
  });

  it("bài lặp lại (ôn tập) chỉ được tích khi làm lại lần nữa", () => {
    const reviewDay = days[5];
    const reviewQuiz = reviewDay.tasks.find((t) => t.review && t.kind === "quiz")!;
    let log = completeResource(days, EMPTY_LOG, reviewQuiz.key); // lần đầu → bài quiz ở ngày học mới
    expect(log.tasks[reviewQuiz.id]).toBeUndefined();
    log = completeResource(days, log, reviewQuiz.key); // lần hai → bài ôn tập
    expect(log.tasks[reviewQuiz.id]).toBe(true);
  });

  it("hoạt động không có trong lộ trình → nhật ký giữ nguyên", () => {
    expect(completeResource(days, EMPTY_LOG, "quiz:khong-co")).toBe(EMPTY_LOG);
  });

  it("ngày đã tích tay ở bản cũ vẫn tính là xong và không nhận thêm bài", () => {
    const legacy: RoadmapLog = { ...EMPTY_LOG, sessions: { "1-1": true } };
    expect(dayDone(legacy, days[0])).toBe(true);
    const key = days[0].tasks[0].key;
    const next = completeResource(days, legacy, key);
    expect(Object.keys(next.tasks).every((id) => !id.startsWith("1-1-"))).toBe(true);
  });

  it("ngày nói chuyện thật hoàn thành khi người học tự tích", () => {
    expect(dayDone({ ...EMPTY_LOG, talks: { "1": true } }, days[6])).toBe(true);
    expect(dayDone(EMPTY_LOG, days[6])).toBe(false);
  });
});
