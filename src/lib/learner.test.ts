import { describe, expect, it } from "vitest";
import { learnerPutSchema, progressSchema, roadmapLogSchema, roadmapProfileSchema, type LearnerData } from "./learner-schema";
import { mergeLearnerData, mergeProgress, mergeRoadmapLog, sameData } from "./learner-merge";
import { EMPTY_LOG } from "./roadmap";
import type { ProgressState } from "./progress-calc";

const progress = (patch: Partial<ProgressState> = {}): ProgressState => ({
  version: 1,
  topics: {},
  dictations: {},
  xp: 0,
  streak: 0,
  activity: {},
  ...patch,
});

const profile = { level: "A2", goal: "daily", focus: "speaking", minutesPerDay: 60, weeks: 12, startDate: "2026-11-16" } as const;

describe("learner schema", () => {
  it("chấp nhận dữ liệu hợp lệ", () => {
    const body = { progress: progress({ xp: 10 }), roadmap: profile, roadmapLog: EMPTY_LOG, baseVersion: null };
    expect(learnerPutSchema.safeParse(body).success).toBe(true);
  });

  it("từ chối điểm ngoài 0–100, khóa lạ và lựa chọn không có trong danh sách", () => {
    expect(progressSchema.safeParse(progress({ topics: { "to-be": { quizBest: 150 } } })).success).toBe(false);
    expect(progressSchema.safeParse({ ...progress(), admin: true }).success).toBe(false);
    expect(roadmapProfileSchema.safeParse({ ...profile, minutesPerDay: 61 }).success).toBe(false);
    expect(roadmapProfileSchema.safeParse({ ...profile, weeks: 13 }).success).toBe(false);
    expect(roadmapProfileSchema.safeParse({ ...profile, level: "C2" }).success).toBe(false);
  });

  it("giới hạn số mục để request không làm phình database", () => {
    const sessions = Object.fromEntries(Array.from({ length: 401 }, (_, i) => [`k${i}`, true]));
    expect(roadmapLogSchema.safeParse({ ...EMPTY_LOG, sessions }).success).toBe(false);
    expect(roadmapLogSchema.safeParse({ ...EMPTY_LOG, notes: { "1": "x".repeat(501) } }).success).toBe(false);
  });
});

describe("mergeProgress", () => {
  it("giữ điểm cao nhất, lý thuyết đã đọc ở bất kỳ bên nào", () => {
    const a = progress({ topics: { "to-be": { theoryRead: true, quizBest: 60 } }, xp: 30 });
    const b = progress({ topics: { "to-be": { quizBest: 90 }, "past-simple": { quizBest: 40 } }, xp: 50 });
    const m = mergeProgress(a, b);
    expect(m.topics["to-be"]).toEqual({ theoryRead: true, quizBest: 90 });
    expect(m.topics["past-simple"]).toEqual({ quizBest: 40 });
    expect(m.xp).toBe(50);
  });

  it("streak theo bên học gần nhất, activity lấy max từng ngày", () => {
    const a = progress({ streak: 5, lastActiveDate: "2026-11-10", activity: { "2026-11-10": 20 } });
    const b = progress({ streak: 1, lastActiveDate: "2026-11-12", activity: { "2026-11-10": 5, "2026-11-12": 8 } });
    const m = mergeProgress(a, b);
    expect(m.streak).toBe(1);
    expect(m.lastActiveDate).toBe("2026-11-12");
    expect(m.activity).toEqual({ "2026-11-10": 20, "2026-11-12": 8 });
  });

  it("nghe chép: lấy lần làm có điểm cao hơn", () => {
    const a = progress({ dictations: { x: { best: 70, done: 5, total: 5 } } });
    const b = progress({ dictations: { x: { best: 90, done: 3, total: 5 } } });
    expect(mergeProgress(a, b).dictations.x).toEqual({ best: 90, done: 3, total: 5 });
  });
});

describe("mergeRoadmapLog & mergeLearnerData", () => {
  it("ô đã tích ở bên nào cũng giữ, số giây lấy max", () => {
    const a = { ...EMPTY_LOG, sessions: { "1-1": true }, seconds: { "1": 30 } };
    const b = { ...EMPTY_LOG, sessions: { "1-2": true }, seconds: { "1": 45 }, notes: { "1": "quên -s" } };
    expect(mergeRoadmapLog(a, b)).toEqual({
      sessions: { "1-1": true, "1-2": true },
      talks: {},
      milestones: {},
      seconds: { "1": 45 },
      notes: { "1": "quên -s" },
    });
  });

  it("hồ sơ lộ trình ưu tiên bản trong database, thiếu thì lấy bản trên máy", () => {
    const remote: LearnerData = { progress: progress(), roadmap: null, roadmapLog: EMPTY_LOG };
    const local: LearnerData = { progress: progress(), roadmap: profile, roadmapLog: EMPTY_LOG };
    expect(mergeLearnerData(remote, local).roadmap).toEqual(profile);
    expect(mergeLearnerData({ ...remote, roadmap: { ...profile, weeks: 8 } }, local).roadmap?.weeks).toBe(8);
  });

  it("sameData không phụ thuộc thứ tự khóa", () => {
    expect(sameData({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 3, c: 2 }, a: 1 })).toBe(true);
    expect(sameData({ a: 1 }, { a: 2 })).toBe(false);
  });
});
