import { describe, expect, it } from "vitest";
import { ROADMAP_UNITS } from "@/content/roadmap-units";
import { getDictation } from "@/content/dictations";
import { IPA_MAP } from "@/content/ipa";
import { TOPIC_CONTENT } from "@/content/topics";
import { listQuizSets } from "./quiz-sets";
import {
  EMPTY_LOG,
  MINUTE_OPTIONS,
  allocateMinutes,
  buildRoadmap,
  currentWeekNumber,
  parseLog,
  parseProfile,
  roadmapSummary,
  sessionKey,
  weekDateRange,
  weekProgress,
  type RoadmapProfile,
} from "./roadmap";
import type { ProgressState } from "./progress-calc";

const profile = (patch: Partial<RoadmapProfile> = {}): RoadmapProfile => ({
  level: "A2",
  goal: "daily",
  focus: "speaking",
  minutesPerDay: 75,
  weeks: 12,
  startDate: "2026-11-16",
  ...patch,
});

describe("roadmap units", () => {
  const quizIds = new Set(listQuizSets().map((s) => s.id));

  for (const u of ROADMAP_UNITS) {
    it(`${u.id}: mọi liên kết trỏ tới nội dung có thật`, () => {
      expect(u.grammar.length).toBeGreaterThan(0);
      for (const slug of u.grammar) expect(TOPIC_CONTENT[slug], slug).toBeDefined();
      for (const id of u.dictations) expect(getDictation(id), id).toBeDefined();
      for (const id of u.sounds) expect(IPA_MAP[id], id).toBeDefined();
      for (const id of u.quizSets ?? []) expect(quizIds.has(id), id).toBe(true);
      expect(u.prompts.daily.length).toBeGreaterThan(0);
    });
  }
});

describe("allocateMinutes", () => {
  it("75 phút, điểm yếu nghe → giữ đúng tổng và dồn thêm cho nghe chép", () => {
    const m = allocateMinutes(75, "listening");
    expect(Object.values(m).reduce((a, b) => a + b, 0)).toBe(75);
    expect(m.dictation).toBeGreaterThanOrEqual(m.grammar);
  });

  it("mọi lựa chọn thời gian: tổng đúng, mỗi khối ≥ 5 phút và là bội số của 5", () => {
    for (const total of MINUTE_OPTIONS) {
      for (const focus of ["speaking", "listening", "grammar"] as const) {
        const m = allocateMinutes(total, focus);
        const values = Object.values(m);
        expect(values.reduce((a, b) => a + b, 0), `${total}/${focus}`).toBe(total);
        for (const v of values) {
          expect(v).toBeGreaterThanOrEqual(5);
          expect(v % 5).toBe(0);
        }
      }
    }
  });

  it("điểm yếu nói → khối tự nói dài nhất", () => {
    const m = allocateMinutes(60, "speaking");
    expect(Math.max(...Object.values(m))).toBe(m.speaking);
  });
});

describe("buildRoadmap", () => {
  it("A2, 12 tuần: mỗi tuần một chủ đề, 3 giai đoạn, mục tiêu giây tăng dần", () => {
    const r = buildRoadmap(profile());
    expect(r.weeks).toHaveLength(12);
    expect(r.weeks[0].title).toBe(ROADMAP_UNITS[0].title);
    expect(r.weeks.map((w) => w.phase)).toEqual([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]);
    expect(r.weeks[0].targetSeconds).toBeLessThan(r.weeks[11].targetSeconds);
    expect(r.weeks.some((w) => w.review)).toBe(false);
    expect(r.weeks.filter((w) => w.recordCheckpoint).map((w) => w.n)).toEqual([1, 4, 8, 12]);
  });

  it("8 tuần: dồn đủ 12 chủ đề, không bỏ sót ngữ pháp nào", () => {
    const r = buildRoadmap(profile({ weeks: 8 }));
    expect(r.weeks).toHaveLength(8);
    const covered = new Set(r.weeks.flatMap((w) => w.grammar));
    for (const slug of ROADMAP_UNITS.slice(0, 12).flatMap((u) => u.grammar)) expect(covered.has(slug), slug).toBe(true);
  });

  it("B1 bỏ qua phần nền tảng; 16 tuần thì có tuần củng cố", () => {
    const r = buildRoadmap(profile({ level: "B1", weeks: 16 }));
    expect(r.weeks[0].grammar).not.toContain("to-be");
    expect(r.weeks.some((w) => w.review)).toBe(true);
    expect(r.weeks[0].review).toBe(false);
  });

  it("đề nói theo mục tiêu: công việc dùng đề riêng, thiếu thì dùng đề hằng ngày", () => {
    const work = buildRoadmap(profile({ goal: "work" }));
    expect(work.weeks[0].prompts[0]).toMatch(/job/i);
    const travel = buildRoadmap(profile({ goal: "travel" }));
    expect(travel.weeks[1].prompts).toEqual(ROADMAP_UNITS[1].prompts.daily);
  });

  it("A1 + 8 tuần có cảnh báo", () => {
    expect(buildRoadmap(profile({ level: "A1", weeks: 8 })).warnings.length).toBeGreaterThan(0);
    expect(buildRoadmap(profile()).warnings).toEqual([]);
  });
});

describe("theo dõi", () => {
  it("currentWeekNumber: trước ngày bắt đầu = 0, ngày 8 = tuần 2, quá hạn = weeks + 1", () => {
    expect(currentWeekNumber("2026-11-16", "2026-11-15", 12)).toBe(0);
    expect(currentWeekNumber("2026-11-16", "2026-11-16", 12)).toBe(1);
    expect(currentWeekNumber("2026-11-16", "2026-11-23", 12)).toBe(2);
    expect(currentWeekNumber("2026-11-16", "2027-06-01", 12)).toBe(13);
    expect(currentWeekNumber("sai", "2026-11-16", 12)).toBe(0);
  });

  it("weekDateRange", () => {
    expect(weekDateRange("2026-11-16", 1)).toBe("16/11 – 22/11");
    expect(weekDateRange("2026-11-16", 3)).toBe("30/11 – 6/12");
  });

  it("weekProgress ghép nhật ký với tiến độ học thật", () => {
    const week = buildRoadmap(profile()).weeks[0];
    const progress: ProgressState = {
      version: 1,
      xp: 0,
      streak: 0,
      activity: {},
      topics: { "to-be": { theoryRead: true, quizBest: 90, dictationBest: 85 } },
      dictations: { "story-my-family": { best: 80, done: 8, total: 8 } },
    };
    const log = { ...EMPTY_LOG, sessions: { [sessionKey(1, 1)]: true, [sessionKey(1, 2)]: true }, talks: { "1": true } };
    expect(weekProgress(week, log, progress)).toEqual({
      sessionsDone: 2,
      talkDone: true,
      milestoneDone: false,
      grammarDone: 1,
      dictationsDone: 1,
    });
  });

  it("roadmapSummary bỏ qua nhật ký của tuần nằm ngoài lộ trình", () => {
    const r = buildRoadmap(profile({ weeks: 8 }));
    const log = { ...EMPTY_LOG, sessions: { "1-1": true, "12-1": true }, milestones: { "2": true, "11": true } };
    expect(roadmapSummary(r, log)).toMatchObject({ sessions: 1, sessionsTotal: 48, milestones: 1, weeks: 8 });
  });
});

describe("parse dữ liệu lưu", () => {
  it("parseProfile nhận hồ sơ hợp lệ, từ chối giá trị lạ", () => {
    expect(parseProfile(profile())).toEqual(profile());
    expect(parseProfile({ ...profile(), level: "C2" })).toBeUndefined();
    expect(parseProfile({ ...profile(), minutesPerDay: 999 })).toBeUndefined();
    expect(parseProfile({ ...profile(), startDate: "16/11/2026" })).toBeUndefined();
    expect(parseProfile(null)).toBeUndefined();
  });

  it("parseLog lọc bỏ giá trị sai kiểu", () => {
    const log = parseLog({ sessions: { "1-1": true, "1-2": "yes" }, seconds: { "1": 45, "2": -3, "3": "x" }, notes: 5 });
    expect(log.sessions).toEqual({ "1-1": true });
    expect(log.seconds).toEqual({ "1": 45 });
    expect(log.notes).toEqual({});
  });
});
