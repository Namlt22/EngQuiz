import { describe, expect, it } from "vitest";
import { ZH_GRAMMAR } from "@/content/zh/grammar";
import { getHanziChar } from "@/content/zh/hanzi-chars";
import { PINYIN_LESSONS } from "@/content/zh/pinyin-lessons";
import { ZH_TEXTS } from "@/content/zh/texts";
import { ZH_INTRO_WEEKS, ZH_WEEKS } from "@/content/zh/roadmap-zh";
import { daysFor } from "./course-roadmap";
import { EMPTY_LOG } from "./roadmap";
import { DAYS_PER_WEEK, completeResource, dayDone, remapTasks } from "./roadmap-days";
import { buildZhRoadmap, zhProfile } from "./zh-roadmap";

const full = zhProfile(false, "2026-11-17");
const skip = zhProfile(true, "2026-11-17");

describe("lộ trình tiếng Trung", () => {
  it("mới bắt đầu: 10 tuần × 7 ngày; đã biết pinyin: bỏ tuần Nhập môn", () => {
    expect(buildZhRoadmap(full).weeks).toHaveLength(ZH_WEEKS.length);
    expect(buildZhRoadmap(full).days).toHaveLength(ZH_WEEKS.length * DAYS_PER_WEEK);
    expect(buildZhRoadmap(skip).weeks).toHaveLength(ZH_WEEKS.length - ZH_INTRO_WEEKS);
  });

  it("ngày nào cũng có bài; id nhiệm vụ không trùng; ngày 7 là kiểm tra", () => {
    const { days } = buildZhRoadmap(full);
    for (const d of days) {
      expect(d.tasks.length, `day ${d.n}`).toBeGreaterThan(0);
      expect(d.kind).toBe(d.day === DAYS_PER_WEEK ? "checkpoint" : "study");
    }
    const ids = days.flatMap((d) => d.tasks.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("phủ ĐỦ nội dung đã có: mọi bài pinyin, ngữ pháp HSK 1, hội thoại, bài đọc", () => {
    const keys = new Set(buildZhRoadmap(full).days.flatMap((d) => d.tasks.map((t) => t.key)));
    for (const l of PINYIN_LESSONS) expect(keys, l.id).toContain(`sound:pinyin-${l.id}`);
    for (const g of ZH_GRAMMAR.filter((x) => x.level === 1)) expect(keys, g.id).toContain(`theory:grammar-${g.id}`);
    for (const t of ZH_TEXTS.filter((x) => x.level === 1)) expect(keys, t.id).toContain(`${t.kind}:${t.id}`);
    expect(keys).toContain("quizset:mock-hsk1");
  });

  it("chữ tập viết thuộc HSK 1 (hoặc chữ số cơ bản) và không lặp", () => {
    const chars = ZH_WEEKS.flatMap((w) => w.chars);
    expect(new Set(chars).size).toBe(chars.length);
    for (const ch of chars) expect(getHanziChar(ch)?.level, ch).toBe(1);
  });

  it("làm xong một hoạt động thì tích đúng bài sớm nhất cùng khoá", () => {
    const days = daysFor("zh", full);
    const log = completeResource(days, EMPTY_LOG, "sound:pinyin-tones");
    const first = days[0].tasks.find((t) => t.key === "sound:pinyin-tones")!;
    expect(log.tasks[first.id]).toBe(true);
    // Xong mọi bài của Day 1 thì ngày hoàn thành.
    const all = days[0].tasks.reduce((l, t) => completeResource(days, l, t.key), EMPTY_LOG);
    expect(dayDone(all, days[0])).toBe(true);
    // Ôn thẻ từ vựng: mỗi lượt tích một ngày.
    const hsk = daysFor("zh", skip);
    const once = completeResource(hsk, EMPTY_LOG, "quizset:zh-vocab");
    const twice = completeResource(hsk, once, "quizset:zh-vocab");
    expect(Object.keys(twice.tasks)).toHaveLength(2);
  });

  it("đổi điểm bắt đầu giữ tiến độ theo bài học", () => {
    const fullDays = daysFor("zh", full);
    const log = completeResource(fullDays, EMPTY_LOG, "theory:grammar-shi-sentence");
    const moved = remapTasks(fullDays, daysFor("zh", skip), log);
    const task = daysFor("zh", skip)[0].tasks.find((t) => t.key === "theory:grammar-shi-sentence");
    expect(moved.tasks[task!.id]).toBe(true);
  });

  it("khoá tiếng Anh vẫn dùng lịch tiếng Anh", () => {
    const en = daysFor("en", { level: "A1", goal: "daily", focus: "speaking", minutesPerDay: 60, weeks: 8, startDate: "2026-11-17" });
    expect(en[0].tasks.some((t) => t.href.startsWith("/zh"))).toBe(false);
  });
});
