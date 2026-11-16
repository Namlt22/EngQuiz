import { describe, expect, it } from "vitest";
import { courseFromPath, courseStorageKey } from "./course";
import { learnerPutSchema, type CourseData, type LearnerData } from "./learner-schema";
import { mergeLearnerData } from "./learner-merge";
import { sanitizeLearnerData } from "./learner-sanitize";
import { isBlank, trimForUpload } from "./learner-sync";
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
const course = (patch: Partial<ProgressState> = {}): CourseData => ({ progress: progress(patch), roadmap: null, roadmapLog: EMPTY_LOG });

describe("khoá học theo đường dẫn", () => {
  it("chỉ /zh và trang con của /zh là tiếng Trung", () => {
    expect(courseFromPath("/zh")).toBe("zh");
    expect(courseFromPath("/zh/vocab/1")).toBe("zh");
    expect(courseFromPath("/")).toBe("en");
    expect(courseFromPath("/grammar/to-be")).toBe("en");
    expect(courseFromPath("/zhuyin")).toBe("en");
  });

  it("tiếng Anh giữ khoá localStorage cũ, tiếng Trung có khoá riêng", () => {
    expect(courseStorageKey("en", "progress:v1")).toBe("engquiz:progress:v1");
    expect(courseStorageKey("zh", "progress:v1")).toBe("engquiz:zh:progress:v1");
  });
});

describe("dữ liệu nhiều khoá học", () => {
  it("schema nhận dữ liệu cũ (không có courses) và dữ liệu có courses.zh", () => {
    expect(learnerPutSchema.safeParse({ ...course(), baseVersion: null }).success).toBe(true);
    expect(learnerPutSchema.safeParse({ ...course(), courses: { zh: course({ xp: 5 }) }, baseVersion: 1 }).success).toBe(true);
  });

  it("schema từ chối khoá học lạ", () => {
    expect(learnerPutSchema.safeParse({ ...course(), courses: { fr: course() }, baseVersion: 1 }).success).toBe(false);
  });

  it("gộp từng khoá riêng: XP tiếng Trung không lẫn vào tiếng Anh", () => {
    const remote: LearnerData = { ...course({ xp: 100 }), courses: { zh: course({ xp: 20 }) } };
    const local: LearnerData = { ...course({ xp: 80 }), courses: { zh: course({ xp: 35 }) } };
    const merged = mergeLearnerData(remote, local);
    expect(merged.progress.xp).toBe(100);
    expect(merged.courses?.zh?.progress.xp).toBe(35);
  });

  it("khoá chỉ có ở một bên được giữ nguyên; không bên nào có thì không thêm courses", () => {
    const withZh: LearnerData = { ...course(), courses: { zh: course({ xp: 7 }) } };
    expect(mergeLearnerData(course(), withZh).courses?.zh?.progress.xp).toBe(7);
    expect(mergeLearnerData(withZh, course()).courses?.zh?.progress.xp).toBe(7);
    expect(mergeLearnerData(course(), course())).not.toHaveProperty("courses");
  });

  it("isBlank xét cả khoá tiếng Trung: chỉ học tiếng Trung thì không được coi là trống", () => {
    expect(isBlank(course())).toBe(true);
    expect(isBlank({ ...course(), courses: { zh: course({ xp: 3 }) } })).toBe(false);
  });

  it("trimForUpload cắt bớt ngày hoạt động của từng khoá", () => {
    const activity = Object.fromEntries(Array.from({ length: 3700 }, (_, i) => [new Date(Date.UTC(2010, 0, 1 + i)).toISOString().slice(0, 10), 1]));
    const out = trimForUpload({ ...course(), courses: { zh: course({ activity }) } });
    expect(Object.keys(out.courses?.zh?.progress.activity ?? {}).length).toBe(3660);
  });

  it("sanitize giữ phần hợp lệ của khoá tiếng Trung và bỏ khoá lạ", () => {
    const raw = { ...course(), courses: { zh: { progress: progress({ xp: 9 }), roadmap: "hỏng", roadmapLog: null }, fr: course() } };
    const out = sanitizeLearnerData(raw);
    expect(out.courses?.zh?.progress.xp).toBe(9);
    expect(out.courses?.zh?.roadmap).toBeNull();
    expect(out.courses).not.toHaveProperty("fr");
  });
});
