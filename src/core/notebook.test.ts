import { describe, expect, it } from "vitest";
import {
  NOTEBOOK_LIMITS,
  activeEntries,
  addEntry,
  buildNotebookQueue,
  findEntry,
  mergeNotebook,
  removeEntry,
  reviewEntry,
  sanitizeNotebook,
  updateEntry,
  type NotebookEntry,
} from "./notebook";

const T0 = 1_800_000_000_000;
const DAY = 20_000;

describe("sổ tay từ vựng — thêm / sửa / xoá", () => {
  it("thêm từ mới: cắt khoảng trắng, có id, hộp 0, đến hạn ngay", () => {
    const { list, entry, added } = addEntry([], { term: "  take care of ", meaning: " chăm sóc ", source: "reading:gig-economy" }, T0, DAY);
    expect(added).toBe(true);
    expect(list).toHaveLength(1);
    expect(entry).toMatchObject({ term: "take care of", meaning: "chăm sóc", source: "reading:gig-economy", box: 0, due: DAY, updated: T0 });
    expect(entry.id).toMatch(/^[a-z0-9]{8,}$/);
  });

  it("không thêm trùng (không phân biệt hoa thường): trả lại mục cũ, danh sách giữ nguyên", () => {
    const first = addEntry([], { term: "Apple", meaning: "táo" }, T0, DAY);
    const again = addEntry(first.list, { term: "apple", meaning: "quả táo" }, T0 + 1, DAY);
    expect(again.added).toBe(false);
    expect(again.list).toBe(first.list);
    expect(again.entry.id).toBe(first.entry.id);
    expect(findEntry(again.list, "APPLE")?.id).toBe(first.entry.id);
  });

  it("bỏ qua nếu thiếu từ hoặc nghĩa; cắt độ dài quá giới hạn", () => {
    expect(addEntry([], { term: " ", meaning: "x" }, T0, DAY).added).toBe(false);
    expect(addEntry([], { term: "x", meaning: "" }, T0, DAY).added).toBe(false);
    const long = addEntry([], { term: "a".repeat(500), meaning: "b".repeat(900), example: "c".repeat(900) }, T0, DAY).entry;
    expect(long.term.length).toBe(NOTEBOOK_LIMITS.term);
    expect(long.meaning.length).toBe(NOTEBOOK_LIMITS.meaning);
    expect(long.example?.length).toBe(NOTEBOOK_LIMITS.example);
  });

  it("sửa và xoá không làm thay đổi mảng gốc; xoá để lại dấu (tombstone) để đồng bộ", () => {
    const { list, entry } = addEntry([], { term: "cat", meaning: "mèo" }, T0, DAY);
    const edited = updateEntry(list, entry.id, { meaning: "con mèo", example: "The cat sleeps." }, T0 + 5);
    expect(list[0].meaning).toBe("mèo");
    expect(edited[0]).toMatchObject({ meaning: "con mèo", example: "The cat sleeps.", updated: T0 + 5 });
    const removed = removeEntry(edited, entry.id, T0 + 9);
    expect(removed[0].deleted).toBe(true);
    expect(activeEntries(removed)).toHaveLength(0);
    // Thêm lại từ đã xoá → mục mới đang hoạt động.
    expect(addEntry(removed, { term: "cat", meaning: "mèo" }, T0 + 10, DAY).added).toBe(true);
  });

  it("vượt giới hạn số mục đang dùng → không thêm", () => {
    let list: readonly NotebookEntry[] = [];
    for (let i = 0; i < NOTEBOOK_LIMITS.entries; i++) list = addEntry(list, { term: `w${i}`, meaning: "m" }, T0 + i, DAY).list;
    expect(addEntry(list, { term: "extra", meaning: "m" }, T0, DAY).added).toBe(false);
  });
});

describe("sổ tay — ôn lặp lại ngắt quãng", () => {
  it("chấm nhớ → lên hộp, hạn lùi; quên → hộp 1 hôm nay", () => {
    const { list, entry } = addEntry([], { term: "dog", meaning: "chó" }, T0, DAY);
    const good = reviewEntry(list, entry.id, "good", DAY, T0 + 1);
    expect(good[0]).toMatchObject({ box: 1, due: DAY + 1 });
    const again = reviewEntry(good, entry.id, "again", DAY + 1, T0 + 2);
    expect(again[0]).toMatchObject({ box: 1, due: DAY + 1 });
  });

  it("hàng đợi: mục đến hạn trước, rồi mục mới; bỏ mục đã xoá", () => {
    let list: readonly NotebookEntry[] = [];
    for (const t of ["a1", "b2", "c3"]) list = addEntry(list, { term: t, meaning: "m" }, T0, DAY).list;
    list = reviewEntry(list, list[0].id, "easy", DAY, T0); // a1 → hạn sau
    list = removeEntry(list, list[2].id, T0); // c3 xoá
    expect(buildNotebookQueue(list, DAY).map((e) => e.term)).toEqual(["b2"]);
    expect(buildNotebookQueue(list, DAY + 10).map((e) => e.term)).toEqual(["a1", "b2"]);
  });
});

describe("sổ tay — làm sạch & gộp hai máy", () => {
  it("sanitize bỏ mục hỏng, trùng id, giữ tối đa giới hạn", () => {
    const ok = addEntry([], { term: "ok", meaning: "được" }, T0, DAY).entry;
    const raw = [ok, { ...ok }, { id: "x", term: 3 }, null, { ...ok, id: "zzzzzzzz", box: 9 }];
    const clean = sanitizeNotebook(raw);
    expect(clean.map((e) => e.id)).toEqual([ok.id, "zzzzzzzz"]);
    expect(clean[1].box).toBe(5);
    expect(sanitizeNotebook("nope")).toEqual([]);
  });

  it("gộp: hợp theo id, mỗi mục giữ bản sửa sau; xoá ở máy này thắng bản cũ ở máy kia", () => {
    const base = addEntry([], { term: "sun", meaning: "mặt trời" }, T0, DAY);
    const phone = updateEntry(base.list, base.entry.id, { meaning: "mặt trời (n)" }, T0 + 10);
    const laptop = removeEntry(base.list, base.entry.id, T0 + 20);
    const other = addEntry([], { term: "moon", meaning: "mặt trăng" }, T0 + 5, DAY).list;
    const merged = mergeNotebook([...phone, ...other], laptop);
    expect(merged.find((e) => e.term === "sun")?.deleted).toBe(true);
    expect(merged.find((e) => e.term === "moon")).toBeDefined();
    expect(mergeNotebook(phone, base.list)[0].meaning).toBe("mặt trời (n)");
  });
});
