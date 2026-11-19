import { describe, expect, it } from "vitest";
import { applySandhi, bareSyllable, markTone, markedToNumbered, numberedToMarked, toneOf } from "./pinyin";

describe("thanh và dấu thanh", () => {
  it("đọc thanh từ dấu, không dấu là thanh nhẹ", () => {
    expect(["mā", "má", "mǎ", "mà", "ma"].map(toneOf)).toEqual([1, 2, 3, 4, 5]);
    expect(toneOf("lǜ")).toBe(4);
    expect(toneOf("Zhōng")).toBe(1);
  });

  it("bỏ dấu giữ ü", () => {
    expect(bareSyllable("lǜ")).toBe("lü");
    expect(bareSyllable("Zhōng")).toBe("zhong");
  });

  it("đặt dấu đúng quy tắc: a/e trước, ou trên o, còn lại nguyên âm cuối", () => {
    expect(markTone("hao", 3)).toBe("hǎo");
    expect(markTone("xie", 4)).toBe("xiè");
    expect(markTone("gou", 3)).toBe("gǒu");
    expect(markTone("liu", 4)).toBe("liù");
    expect(markTone("dui", 4)).toBe("duì");
    expect(markTone("lv", 4)).toBe("lǜ");
    expect(markTone("xue", 2)).toBe("xué");
    expect(markTone("er", 4)).toBe("èr");
  });

  it("chuyển qua lại kiểu số và kiểu dấu", () => {
    expect(numberedToMarked("ni3 hao3")).toBe("nǐ hǎo");
    expect(numberedToMarked("nv3 er2")).toBe("nǚ ér");
    expect(numberedToMarked("ma5")).toBe("ma");
    expect(markedToNumbered("Zhōng guó")).toBe("zhong1 guo2");
    expect(markedToNumbered("mā ma")).toBe("ma1 ma5");
  });
});

describe("biến điệu", () => {
  it("hai thanh 3 liền nhau: âm đầu thành thanh 2", () => {
    expect(applySandhi("你好", "nǐ hǎo")).toBe("ní hǎo");
    expect(applySandhi("可以", "kě yǐ")).toBe("ké yǐ");
  });

  it("thanh nhẹ không gây biến điệu", () => {
    expect(applySandhi("姐姐", "jiě jie")).toBe("jiě jie");
  });

  it("不 trước thanh 4 thành bú, trước thanh khác giữ bù", () => {
    expect(applySandhi("不是", "bù shì")).toBe("bú shì");
    expect(applySandhi("不要", "bù yào")).toBe("bú yào");
    expect(applySandhi("不好", "bù hǎo")).toBe("bù hǎo");
    expect(applySandhi("不用", "bù yòng")).toBe("bú yòng");
  });

  it("一: yí trước thanh 4, yì trước thanh 1/2/3, giữ yī khi là số thứ tự / tháng / đứng cuối", () => {
    expect(applySandhi("一样", "yī yàng")).toBe("yí yàng");
    expect(applySandhi("一起", "yī qǐ")).toBe("yì qǐ");
    expect(applySandhi("一天", "yī tiān")).toBe("yì tiān");
    expect(applySandhi("一年", "yī nián")).toBe("yì nián");
    expect(applySandhi("第一", "dì yī")).toBe("dì yī");
    expect(applySandhi("一月", "yī yuè")).toBe("yī yuè");
    expect(applySandhi("星期一", "xīng qī yī")).toBe("xīng qī yī");
    expect(applySandhi("十一", "shí yī")).toBe("shí yī");
  });

  it("một 一 đổi xong không kéo theo luật thanh 3 sai", () => {
    // 一点儿 yī diǎn r: 一 trước thanh 3 → yì; điểm không đổi.
    expect(applySandhi("一点", "yī diǎn")).toBe("yì diǎn");
  });

  it("chuỗi ba thanh 3: hai âm đầu đọc thanh 2", () => {
    expect(applySandhi("展览馆", "zhǎn lǎn guǎn")).toBe("zhán lán guǎn");
  });

  it("số chữ và số âm tiết không khớp thì trả pinyin gốc", () => {
    expect(applySandhi("你好吗", "nǐ hǎo")).toBe("nǐ hǎo");
  });
});
