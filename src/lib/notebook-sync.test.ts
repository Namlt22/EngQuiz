import { describe, expect, it } from "vitest";
import { addEntry, removeEntry } from "@/core/notebook";
import { mergeProgress } from "./learner-merge";
import { sanitizeProgress } from "./learner-sanitize";
import type { ProgressState } from "./progress-calc";

const T0 = 1_800_000_000_000;
const base: ProgressState = { version: 1, topics: {}, dictations: {}, xp: 0, streak: 0, activity: {} };

describe("sổ tay từ vựng trong dữ liệu tiến độ", () => {
  it("sanitize giữ sổ tay hợp lệ, không thêm trường khi rỗng", () => {
    const { list } = addEntry([], { term: "kind", meaning: "tốt bụng" }, T0, 20_000);
    expect(sanitizeProgress({ ...base, notebook: list }).notebook).toEqual(list);
    expect("notebook" in sanitizeProgress(base)).toBe(false);
    expect("notebook" in sanitizeProgress({ ...base, notebook: [{ bad: 1 }] })).toBe(false);
  });

  it("gộp hai máy: hợp sổ tay, xoá ở máy sau thắng", () => {
    const a = addEntry([], { term: "kind", meaning: "tốt bụng" }, T0, 20_000);
    const b = addEntry([], { term: "brave", meaning: "dũng cảm" }, T0 + 1, 20_000);
    const merged = mergeProgress({ ...base, notebook: [...a.list] }, { ...base, notebook: [...b.list, ...removeEntry(a.list, a.entry.id, T0 + 5)] });
    expect(merged.notebook?.map((e) => [e.term, !!e.deleted]).sort()).toEqual([
      ["brave", false],
      ["kind", true],
    ]);
    expect("notebook" in mergeProgress(base, base)).toBe(false);
  });
});
