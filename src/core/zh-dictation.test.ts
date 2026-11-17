import { describe, expect, it } from "vitest";
import { gradeHanzi, gradePinyin, parsePinyinInput } from "./zh-dictation";

const S = "我 是 学生 。";

describe("nghe chép chữ Hán", () => {
  it("đúng hết, bỏ qua dấu câu và khoảng trắng", () => {
    expect(gradeHanzi(S, "我是 学生").percent).toBe(100);
  });

  it("thiếu một chữ không làm lệch các chữ sau", () => {
    const r = gradeHanzi(S, "我学生");
    expect(r.marks.map((m) => m.score)).toEqual([1, 0, 1, 1]);
    expect(r.percent).toBe(75);
  });

  it("sai chữ đồng âm vẫn tính sai", () => {
    expect(gradeHanzi(S, "我事学生").marks[1].score).toBe(0);
  });
});

describe("nghe chép pinyin", () => {
  it("đọc được kiểu số, kiểu dấu, v = ü", () => {
    expect(parsePinyinInput("ni3 hao3")).toEqual([
      { bare: "ni", tone: 3 },
      { bare: "hao", tone: 3 },
    ]);
    expect(parsePinyinInput("nǚ")).toEqual([{ bare: "nü", tone: 3 }]);
    expect(parsePinyinInput("nv3")).toEqual([{ bare: "nü", tone: 3 }]);
    expect(parsePinyinInput("xue2sheng")).toEqual([
      { bare: "xue", tone: 2 },
      { bare: "sheng", tone: null },
    ]);
  });

  it("đúng âm + thanh = trọn điểm; thanh nhẹ không cần ghi số", () => {
    expect(gradePinyin(S, "wo3 shi4 xue2 sheng").percent).toBe(100);
    expect(gradePinyin(S, "wǒ shì xué sheng").percent).toBe(100);
  });

  it("đúng âm sai / thiếu thanh = nửa điểm", () => {
    const r = gradePinyin(S, "wo shi4 xue2 sheng");
    expect(r.marks.map((m) => m.score)).toEqual([0.5, 1, 1, 1]);
  });

  it("sai âm = 0", () => {
    expect(gradePinyin(S, "wo3 si4 xue2 sheng").marks[1].score).toBe(0);
  });
});
