import { describe, expect, it } from "vitest";
import { isSpeech, nextFloor, shouldStop } from "./recorder";
import { listenLabel, mergeAlternatives } from "./speech-recognition";

describe("bộ ghi âm chung", () => {
  it("nền ồn hạ ngay theo mức nhỏ hơn, nâng rất chậm khi đang nói", () => {
    expect(nextFloor(0.01, 0.002)).toBe(0.002);
    expect(nextFloor(0.002, 0.1)).toBeCloseTo(0.002 + 0.098 * 0.01);
  });

  it("tiếng nói phải to hơn nền ~3 lần và vượt mức tối thiểu", () => {
    expect(isSpeech(0.003, 0.0001)).toBe(false);
    expect(isSpeech(0.02, 0.005)).toBe(true);
    expect(isSpeech(0.012, 0.005)).toBe(false);
  });

  it("một từ / câu tự dừng khi im lặng sau tiếng nói; câu chờ lâu hơn để người học ngập ngừng", () => {
    expect(shouldStop("word", { heard: true, sinceLoudMs: 800, elapsedMs: 2000 })).toBe(true);
    expect(shouldStop("sentence", { heard: true, sinceLoudMs: 800, elapsedMs: 2000 })).toBe(false);
    expect(shouldStop("sentence", { heard: true, sinceLoudMs: 1300, elapsedMs: 3000 })).toBe(true);
  });

  it("nói tự do không tự dừng vì im lặng, chỉ khi quá giờ hoặc không nói gì", () => {
    expect(shouldStop("long", { heard: true, sinceLoudMs: 20_000, elapsedMs: 60_000 })).toBe(false);
    expect(shouldStop("long", { heard: true, sinceLoudMs: 0, elapsedMs: 200_000 })).toBe(true);
    expect(shouldStop("long", { heard: false, sinceLoudMs: 0, elapsedMs: 11_000 })).toBe(true);
  });

  it("chưa nói gì: chờ vài giây rồi mới dừng", () => {
    expect(shouldStop("word", { heard: false, sinceLoudMs: 0, elapsedMs: 3000 })).toBe(false);
    expect(shouldStop("word", { heard: false, sinceLoudMs: 0, elapsedMs: 5500 })).toBe(true);
  });

  it("ghép bản đoán của máy chủ và trình duyệt: bản máy chủ đứng đầu, bỏ trùng hoa thường / dấu câu", () => {
    expect(mergeAlternatives(["See."], ["see", "sea", ""])).toEqual(["See.", "sea"]);
    expect(mergeAlternatives(["我是学生。"], ["我是学生"])).toEqual(["我是学生。"]);
    expect(mergeAlternatives([], [])).toEqual([]);
  });

  it("dòng trạng thái: chuẩn bị → đang nghe → đang nhận dạng", () => {
    expect(listenLabel({ ready: false, recognizing: false })).toBe("Chuẩn bị…");
    expect(listenLabel({ ready: true, recognizing: false })).toBe("Đang nghe…");
    expect(listenLabel({ ready: false, recognizing: true })).toBe("Đang nhận dạng…");
  });
});
