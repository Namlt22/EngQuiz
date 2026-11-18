import { describe, expect, it } from "vitest";
import { addEntry, reviewEntry } from "@/core/notebook";
import { encodeSrs } from "@/core/srs";
import { buildReviewQueue } from "./review-queue";

const DAY = 20_000;

describe("hàng đợi Ôn thẻ hôm nay (bộ từ chuẩn + Sổ tay)", () => {
  it("chỉ lấy thẻ đến hạn của bộ từ chuẩn; Sổ tay lấy cả mục chưa ôn; xen kẽ hai nguồn", () => {
    const srs = encodeSrs(
      new Map([
        ["apple", { box: 2, due: DAY - 1 }],
        ["banana", { box: 3, due: DAY + 5 }],
        ["cat", { box: 1, due: DAY }],
      ]),
    );
    let nb = addEntry([], { term: "resilient", meaning: "kiên cường" }, 1, DAY).list;
    nb = addEntry(nb, { term: "brave", meaning: "dũng cảm" }, 2, DAY).list;
    const q = buildReviewQueue(srs, nb, DAY);
    expect(q.map((x) => (x.kind === "vocab" ? x.word : x.entry.term))).toEqual(["apple", "resilient", "cat", "brave"]);
  });

  it("không có gì đến hạn → rỗng; mục Sổ tay đã ôn nhưng chưa đến hạn thì bỏ qua", () => {
    const nb = addEntry([], { term: "x1", meaning: "m" }, 1, DAY);
    const reviewed = reviewEntry(nb.list, nb.entry.id, "easy", DAY, 2);
    expect(buildReviewQueue(undefined, reviewed, DAY)).toEqual([]);
  });
});
