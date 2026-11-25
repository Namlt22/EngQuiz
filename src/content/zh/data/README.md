# Dữ liệu gốc khoá tiếng Trung

## `hsk-vocab.json` — danh mục từ HSK 1–4 (HSK 3.0)

- **Định dạng:** mỗi dòng là `[chữ giản thể, pinyin, cấp]`.
  - Cấp là cấp **đưa từ đó vào lần đầu**.
  - Pinyin là cách đọc gốc của từng âm tiết, cách nhau bằng dấu cách, chưa áp dụng biến điệu.
- **Số lượng:**

  | Cấp | Từ mới | Cộng dồn |
  |---|---|---|
  | HSK 1 | 300 | 300 |
  | HSK 2 | 197 | 497 |
  | HSK 3 | 493 | 990 |
  | HSK 4 | 990 | 1 980 |

  - Đề cương công bố 500 / 1 000 / 2 000. Chênh lệch là do bản gốc lặp lại một số mục qua các cấp; nguồn đã gộp các mục trùng.
  - 有点儿 / 有一点儿 và 有时 / 有时候 cùng có mặt nên cộng dồn nhiều hơn số "đã làm sạch" của nguồn 2 từ.
- **Nguồn:** [HSKStory — hsk-3-vocabulary](https://github.com/bezlant/hsk-3-vocabulary), tải ngày 2026-11-17, thư mục `by-level/`.
  - Danh mục từ và cấp theo 新版HSK考试大纲 (中外语言交流合作中心, 11/2025).
  - Hệ cấp theo GF 0025-2021 《国际中文教育中文水平等级标准》.
  - Pinyin theo [CC-CEDICT](https://www.mdbg.net/chinese/dictionary?page=cedict).
- **Giấy phép:** file này là tác phẩm phái sinh nên mang giấy phép **[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)**. Ghi công HSKStory và CC-CEDICT.
  - Giấy phép này chỉ áp dụng cho dữ liệu trong thư mục này, không áp dụng cho mã nguồn EngQuiz.
  - Bản quyền đề cương và tiêu chuẩn thuộc cơ quan ban hành; ở đây chỉ có danh mục từ, cấp và cách đọc.

Nghĩa tiếng Việt, âm Hán-Việt và câu ví dụ do EngQuiz tự soạn và nằm ở file riêng (sẽ thêm ở Bước 3–6).

## Chưa có

- **Danh mục chữ Hán (汉字表) và danh mục ngữ pháp (语法等级大纲) của GF 0025-2021.**
  - Chữ xuất hiện trong từ vựng HSK 1–4 mới phủ 248 / 371 / 655 / 1 096 chữ (cộng dồn), trong khi chuẩn yêu cầu 300 / 600 / 900 / 1 200 chữ.
  - Cần bổ sung bảng chữ chính thức trước khi làm phần Hán tự.

## Dữ liệu nét chữ (`public/hanzi/*.json`)

- **Tạo bằng:** `npm run build:hanzi`. Script chép nguyên văn file của gói `hanzi-writer-data` 2.0.1 cho các chữ khoá học cần.
- **Nguồn:** [Make Me a Hanzi](https://github.com/skishore/makemeahanzi), trích từ phông của Arphic Technology.
- **Giấy phép:** Arphic Public License. File `public/hanzi/ARPHICPL.TXT` phải đi kèm và giữ nguyên văn.
- **Thư viện vẽ:** [hanzi-writer](https://github.com/chanind/hanzi-writer) 3.7.3, giấy phép MIT.
