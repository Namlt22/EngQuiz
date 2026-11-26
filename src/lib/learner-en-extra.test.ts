/**
 * Đồng bộ tiến độ các tính năng thêm của khoá tiếng Anh (progress.enExtra).
 * Quan trọng nhất: dữ liệu khoá tiếng Trung (không có enExtra) gộp ra y như trước.
 */
import { describe, expect, it } from "vitest";
import { mergeEnExtra, type EnExtraData } from "@/core/en-extra-merge";
import { learnerDataSchema, progressSchema, type LearnerData } from "./learner-schema";
import { mergeLearnerData, mergeProgress, sameData } from "./learner-merge";
import { sanitizeLearnerData, sanitizeProgress } from "./learner-sanitize";
import { isBlankCourse } from "./learner-sync";
import { EMPTY_LOG } from "./roadmap";
import type { ProgressState } from "./progress-calc";

const prog = (over: Partial<ProgressState> = {}): ProgressState => ({ version: 1, topics: {}, dictations: {}, xp: 0, streak: 0, activity: {}, ...over });

const laptop: EnExtraData = {
  version: 1,
  games: { "vocab:food:choose": 60, "grammar:to-be:truefalse": 100 },
  placement: { estimate: "A1", start: "A2", at: 100 },
  course: { "A1-1": { words: 80, grammar: 40 } },
};
const phone: EnExtraData = {
  version: 1,
  games: { "vocab:food:choose": 90 },
  placement: { estimate: "A2", start: "B1", at: 200 },
  course: { "A1-1": { grammar: 100, listening: 50 }, "A1-2": { words: 70 } },
};

describe("mergeEnExtra", () => {
  it("giữ điểm cao nhất và kết quả kiểm tra trình độ mới nhất", () => {
    expect(mergeEnExtra(laptop, phone)).toEqual({
      version: 1,
      games: { "vocab:food:choose": 90, "grammar:to-be:truefalse": 100 },
      placement: phone.placement,
      course: { "A1-1": { words: 80, grammar: 100, listening: 50 }, "A1-2": { words: 70 } },
    });
  });

  it("giao hoán, idempotent, một bên trống thì giữ bên kia", () => {
    const m = mergeEnExtra(laptop, phone);
    expect(mergeEnExtra(phone, laptop)).toEqual(m);
    expect(mergeEnExtra(m, m)).toEqual(m);
    expect(mergeEnExtra(undefined, laptop)).toEqual(laptop);
    expect(mergeEnExtra(undefined, undefined)).toBeUndefined();
  });
});

describe("schema / gộp / làm sạch với enExtra", () => {
  it("progress tiếng Anh nhận enExtra hợp lệ, từ chối enExtra sai", () => {
    expect(progressSchema.safeParse({ ...prog(), enExtra: laptop }).success).toBe(true);
    expect(progressSchema.safeParse({ ...prog(), enExtra: { ...laptop, games: { x: 150 } } }).success).toBe(false);
    expect(progressSchema.safeParse({ ...prog(), enExtra: { ...laptop, placement: { estimate: "Z9", start: "A1", at: 1 } } }).success).toBe(false);
  });

  it("dữ liệu tiếng Trung (không có enExtra) gộp ra đúng như trước, không thêm trường mới", () => {
    const zhA = prog({ xp: 30, topics: { "pinyin-1": { theoryRead: true } } });
    const zhB = prog({ xp: 50, srs: "我,2,100" });
    const merged = mergeProgress(zhA, zhB);
    expect("enExtra" in merged).toBe(false);
    const data: LearnerData = {
      progress: prog(),
      roadmap: null,
      roadmapLog: EMPTY_LOG,
      courses: { zh: { progress: zhA, roadmap: null, roadmapLog: EMPTY_LOG } },
    };
    const out = mergeLearnerData(data, { ...data, courses: { zh: { progress: zhB, roadmap: null, roadmapLog: EMPTY_LOG } } });
    expect(out.courses?.zh?.progress).toEqual(merged);
    expect("enExtra" in (out.courses?.zh?.progress ?? {})).toBe(false);
  });

  it("gộp enExtra của tiếng Anh giữa máy và tài khoản", () => {
    const local: LearnerData = { progress: { ...prog({ xp: 10 }), enExtra: laptop }, roadmap: null, roadmapLog: EMPTY_LOG };
    const remote: LearnerData = { progress: { ...prog({ xp: 20 }), enExtra: phone }, roadmap: null, roadmapLog: EMPTY_LOG };
    const out = mergeLearnerData(remote, local);
    expect(out.progress.enExtra).toEqual(mergeEnExtra(laptop, phone));
    expect(learnerDataSchema.safeParse(out).success).toBe(true);
    // Bản cũ không có enExtra + bản có → giữ bản có; dữ liệu không đổi khi gộp lại lần nữa.
    expect(sameData(mergeLearnerData(out, out), out)).toBe(true);
  });

  it("làm sạch: giữ enExtra hợp lệ, bỏ enExtra hỏng mà không mất phần còn lại", () => {
    expect(progressSchema.parse(sanitizeProgress({ ...prog({ xp: 5 }), enExtra: laptop })).enExtra).toEqual(laptop);
    const bad = sanitizeProgress({ ...prog({ xp: 5 }), enExtra: { games: "x" } });
    expect(bad.xp).toBe(5);
    expect("enExtra" in bad).toBe(false);
    const all = sanitizeLearnerData({ progress: { ...prog(), enExtra: laptop }, roadmap: null, roadmapLog: EMPTY_LOG });
    expect(all.progress.enExtra).toEqual(laptop);
  });

  it("chỉ có enExtra vẫn tính là có dữ liệu (được gửi lên)", () => {
    expect(isBlankCourse({ progress: prog(), roadmap: null, roadmapLog: EMPTY_LOG })).toBe(true);
    expect(isBlankCourse({ progress: { ...prog(), enExtra: laptop }, roadmap: null, roadmapLog: EMPTY_LOG })).toBe(false);
  });
});
