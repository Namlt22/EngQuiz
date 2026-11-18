import { describe, expect, it } from "vitest";
import { CHAT_LEVELS, CHAT_LIMITS, FREE_CHAT_ID } from "@/lib/ai-chat";
import { CHAT_SCENARIOS, FREE_CHAT_OPENING, scenariosFor } from "./chat-scenarios";

describe("tình huống trò chuyện AI", () => {
  it("id không trùng, không trùng id trò chuyện tự do, có tiền tố theo khoá", () => {
    const ids = CHAT_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).not.toContain(FREE_CHAT_ID);
    for (const s of CHAT_SCENARIOS) expect(s.id.startsWith(`${s.course}-`), s.id).toBe(true);
  });

  it("cấp độ hợp lệ với khoá; câu mở đầu ngắn hơn giới hạn tin nhắn; tiếng Trung có pinyin", () => {
    for (const s of CHAT_SCENARIOS) {
      expect(CHAT_LEVELS[s.course], s.id).toContain(s.level);
      expect(s.opening.text.length, s.id).toBeLessThanOrEqual(CHAT_LIMITS.maxMessageChars);
      expect(Boolean(s.opening.pinyin), s.id).toBe(s.course === "zh");
      expect(s.brief.length, s.id).toBeGreaterThan(40);
    }
    expect(FREE_CHAT_OPENING.zh.pinyin).toBeTruthy();
  });

  it("mỗi khoá có tình huống, sắp theo cấp tăng dần", () => {
    for (const course of ["en", "zh"] as const) {
      const list = scenariosFor(course);
      expect(list.length).toBeGreaterThanOrEqual(6);
      const order = list.map((s) => CHAT_LEVELS[course].indexOf(s.level));
      expect(order).toEqual([...order].sort((a, b) => a - b));
    }
  });
});
