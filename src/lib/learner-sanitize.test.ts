import { describe, expect, it } from "vitest";
import { sanitizeLearnerData, sanitizeProgress } from "./learner-sanitize";
import { learnerDataSchema, learnerPutSchema, progressSchema } from "./learner-schema";
import { mergeProgress } from "./learner-merge";
import { safeCallback } from "./safe-callback";
import { EMPTY_LOG } from "./roadmap";

describe("sanitizeProgress", () => {
  it("giữ mục hợp lệ, bỏ mục sai thay vì vứt cả khối", () => {
    const p = sanitizeProgress({
      version: 1,
      topics: { "to-be": { quizBest: 90 }, bad: { quizBest: 999 }, __proto__x: { theoryRead: true } },
      dictations: { a: { best: 80, done: 3, total: 5 }, b: { best: "x" } },
      xp: -5,
      streak: 2.7,
      lastActiveDate: "hôm qua",
      activity: { "2026-11-12": 10, "not-a-date": 3 },
      extra: "field",
    });
    expect(p.topics).toEqual({ "to-be": { quizBest: 90 }, __proto__x: { theoryRead: true } });
    expect(p.dictations).toEqual({ a: { best: 80, done: 3, total: 5 } });
    expect(p.xp).toBe(0);
    expect(p.streak).toBe(3);
    expect(p.lastActiveDate).toBeUndefined();
    expect(p.activity).toEqual({ "2026-11-12": 10 });
  });

  it("dữ liệu rác hoàn toàn → tiến độ trống hợp lệ", () => {
    expect(sanitizeProgress("rác")).toEqual({ version: 1, topics: {}, dictations: {}, xp: 0, streak: 0, activity: {} });
  });

  it("kết quả luôn qua được schema của API", () => {
    const data = sanitizeLearnerData({ progress: { xp: "10" }, roadmap: { level: "Z" }, roadmapLog: null });
    expect(learnerDataSchema.safeParse(data).success).toBe(true);
    expect(data.roadmap).toBeNull();
    expect(data.roadmapLog).toEqual(EMPTY_LOG);
  });
});

describe("schema chặn khóa nguy hiểm", () => {
  const bodyWithTopicKey = (k: string) =>
    JSON.parse(
      `{"progress":{"version":1,"topics":{"${k}":{"quizBest":1}},"dictations":{},"xp":0,"streak":0,"activity":{}},"roadmap":null,"roadmapLog":${JSON.stringify(EMPTY_LOG)},"baseVersion":null}`,
    );

  it("từ chối constructor / prototype làm tên mục", () => {
    expect(learnerPutSchema.safeParse(bodyWithTopicKey("constructor")).success).toBe(false);
    expect(learnerPutSchema.safeParse(bodyWithTopicKey("prototype")).success).toBe(false);
  });

  it("__proto__ bị bỏ đi, không làm đổi prototype của object", () => {
    const r = learnerPutSchema.safeParse(bodyWithTopicKey("__proto__"));
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(Object.keys(r.data.progress.topics)).toEqual([]);
    expect(Object.getPrototypeOf(r.data.progress.topics)).toBe(Object.prototype);
  });
});

describe("safeCallback", () => {
  it.each([
    ["/roadmap?x=1#a", "/roadmap?x=1#a"],
    ["/grammar/to-be", "/grammar/to-be"],
    ["//evil.com", "/roadmap"],
    ["/\\evil.com", "/roadmap"],
    ["https://evil.com", "/roadmap"],
    ["/\u0000x", "/roadmap"],
    [undefined, "/roadmap"],
  ])("%s → %s", (input, expected) => {
    expect(safeCallback(input)).toBe(expected);
  });
});

describe("tiến độ luyện nói (speaking)", () => {
  const base = { version: 1, topics: {}, dictations: {}, xp: 0, streak: 0, activity: {} };

  it("bản cũ chưa có speaking vẫn hợp lệ và không bị thêm trường rỗng", () => {
    expect(progressSchema.safeParse(base).success).toBe(true);
    expect(sanitizeProgress(base)).not.toHaveProperty("speaking");
  });

  it("giữ mục hợp lệ, bỏ mục sai", () => {
    const p = sanitizeProgress({ ...base, speaking: { a: { best: 90, done: 4, total: 5 }, b: { best: 200 }, constructor: { best: 1 } } });
    expect(p.speaking).toEqual({ a: { best: 90, done: 4, total: 5 } });
    expect(progressSchema.safeParse({ ...base, speaking: { x: { best: 101, done: 0, total: 0 } } }).success).toBe(false);
  });

  it("gộp hai máy: lấy điểm cao nhất mỗi bộ câu", () => {
    const merged = mergeProgress(
      { ...base, version: 1, speaking: { a: { best: 60, done: 3, total: 5 } } },
      { ...base, version: 1, speaking: { a: { best: 85, done: 4, total: 5 }, b: { best: 40, done: 1, total: 4 } } },
    );
    expect(merged.speaking).toEqual({ a: { best: 85, done: 4, total: 5 }, b: { best: 40, done: 1, total: 4 } });
    expect(mergeProgress({ ...base, version: 1 }, { ...base, version: 1 })).not.toHaveProperty("speaking");
  });
});
