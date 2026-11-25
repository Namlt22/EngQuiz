import { describe, expect, it } from "vitest";
import { tokenize } from "@/core/zh-sentence";
import { ZH_GRAMMAR } from "./grammar";
import { ZH_MOCKS } from "./mock";
import { ZH_TEXTS } from "./texts";

/**
 * Cú pháp "chữ|pinyin" chỉ dành cho TÊN RIÊNG (và 没 dùng đứng một mình làm phương án nhiễu).
 * Không được dùng để đưa từ vượt cấp vào bài — mọi token dạng này phải nằm trong danh sách đã duyệt.
 */
const ALLOWED = new Set(["兰", "明", "王", "月", "越南", "没"]);

function allSentences(): string[] {
  const out: string[] = [];
  for (const l of ZH_GRAMMAR) {
    for (const b of l.blocks) {
      if (b.type === "formula") b.rows.forEach((r) => r.example && out.push(r.example));
      if (b.type === "usage") b.examples.forEach((e) => out.push(e.zh));
      if (b.type === "mistakes") b.items.forEach((m) => out.push(m.wrong, m.right));
    }
    for (const q of l.quiz) out.push(...(q.type === "order" ? q.answers : [q.prompt, ...q.options]));
  }
  for (const t of ZH_TEXTS) out.push(t.zhTitle, ...t.lines.map((l) => l.zh));
  for (const m of Object.values(ZH_MOCKS)) for (const q of m.items) out.push(...[q.say, q.text, q.prompt, ...q.options].filter((s): s is string => !!s));
  return out;
}

describe("tên riêng ghi kèm pinyin", () => {
  it("chỉ dùng cho tên riêng đã duyệt", () => {
    const used = new Set(allSentences().flatMap((s) => tokenize(s).filter((t) => t.kind === "name").map((t) => t.text)));
    expect([...used].filter((n) => !ALLOWED.has(n))).toEqual([]);
  });
});
