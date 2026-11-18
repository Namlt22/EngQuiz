import { describe, expect, it } from "vitest";
import { BOX_INTERVAL_DAYS, MAX_BOX, buildQueue, dayNumber, decodeSrs, encodeSrs, isMastered, isValidSrs, mergeSrs, review } from "./srs";

const TODAY = 20_000;

describe("lên/xuống hộp", () => {
  it("từ mới nhớ được → hộp 1, ôn lại sau 1 ngày", () => {
    expect(review(undefined, "good", TODAY)).toEqual({ box: 1, due: TODAY + BOX_INTERVAL_DAYS[1] });
  });

  it("dễ → nhảy 2 hộp; không vượt hộp cao nhất", () => {
    expect(review({ box: 1, due: TODAY }, "easy", TODAY).box).toBe(3);
    expect(review({ box: MAX_BOX, due: TODAY }, "easy", TODAY).box).toBe(MAX_BOX);
  });

  it("quên → về hộp 1, ôn lại ngay hôm nay", () => {
    expect(review({ box: 4, due: TODAY }, "again", TODAY)).toEqual({ box: 1, due: TODAY });
  });

  it("đã thuộc từ hộp 4", () => {
    expect(isMastered({ box: 4, due: 0 })).toBe(true);
    expect(isMastered({ box: 3, due: 0 })).toBe(false);
    expect(isMastered(undefined)).toBe(false);
  });
});

describe("hàng đợi ôn", () => {
  it("từ đến hạn trước (hạn cũ trước), rồi tối đa N từ mới theo thứ tự", () => {
    const srs = new Map([
      ["你", { box: 2, due: TODAY }],
      ["好", { box: 1, due: TODAY - 3 }],
      ["我", { box: 3, due: TODAY + 2 }],
    ]);
    expect(buildQueue(["我", "你", "好", "他", "她", "它"], srs, TODAY, 2)).toEqual(["好", "你", "他", "她"]);
  });
});

describe("chuỗi lưu trữ", () => {
  it("mã hoá rồi giải mã giữ nguyên, thứ tự ổn định", () => {
    const map = new Map([
      ["谢谢", { box: 2, due: 20_100 }],
      ["爱", { box: 5, due: 20_200 }],
    ]);
    const s = encodeSrs(map);
    expect(decodeSrs(s)).toEqual(map);
    expect(encodeSrs(decodeSrs(s))).toBe(s);
  });

  it("bỏ mục sai định dạng khi giải mã; kiểm tra hợp lệ", () => {
    expect(decodeSrs("爱,2,20000;ABC,1,1;好,9,1;get-up,9,1").size).toBe(1);
    expect(isValidSrs("爱,2,20000;好,1,20001")).toBe(true);
    expect(isValidSrs("爱,2,20000;爱,1,20001")).toBe(false);
    expect(isValidSrs("x,1,1")).toBe(false);
    expect(isValidSrs("")).toBe(true);
  });

  it("nhận cả từ / cụm từ tiếng Anh viết thường (khoá tiếng Anh)", () => {
    const map = new Map([
      ["get up", { box: 1, due: 20_000 }],
      ["mother-in-law", { box: 3, due: 20_010 }],
      ["don't", { box: 2, due: 20_005 }],
    ]);
    expect(decodeSrs(encodeSrs(map))).toEqual(map);
    expect(isValidSrs("get up,1,20000;apple,2,20001")).toBe(true);
    expect(isValidSrs("Apple,2,20001")).toBe(false);
    expect(isValidSrs("apple ,2,20001")).toBe(false);
    expect(isValidSrs("a,2,20001")).toBe(false);
  });

  it("gộp hai máy: giữ hộp cao hơn, cùng hộp lấy hạn muộn hơn", () => {
    expect(mergeSrs("爱,2,100;好,3,50", "爱,4,90;好,3,60;你,1,10")).toBe(encodeSrs(new Map([
      ["爱", { box: 4, due: 90 }],
      ["好", { box: 3, due: 60 }],
      ["你", { box: 1, due: 10 }],
    ])));
  });

  it("ngày theo lịch địa phương", () => {
    expect(dayNumber(new Date(2026, 10, 17, 23, 59))).toBe(dayNumber(new Date(2026, 10, 17, 0, 1)));
    expect(dayNumber(new Date(2026, 10, 18)) - dayNumber(new Date(2026, 10, 17))).toBe(1);
  });
});
