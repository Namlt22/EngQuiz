# EngQuiz

Website học **ngữ pháp** và luyện **nghe & chép chính tả** tiếng Anh theo lộ trình **A1 → C1**.

- 📘 **Lý thuyết**: 81 chủ điểm; A1, A2 và B1 đã đầy đủ (53 chủ điểm có nội dung, 472 câu quiz), công thức tô màu theo thành phần câu, dòng thời gian, lỗi người Việt hay mắc, ví dụ có phát âm.
- ✍️ **Quiz ngữ pháp**: 7 dạng bài (trắc nghiệm, chia động từ, điền từ, tìm lỗi sai, viết lại câu, sắp xếp từ, nối), có giải thích ngay sau mỗi câu. Có bộ đề theo chủ điểm, theo nhóm (vd tất cả câu điều kiện) và tổng hợp theo cấp.
- 🔤 **Bảng phiên âm IPA** (`/ipa`): 44 âm (12 nguyên âm đơn, 8 nguyên âm đôi, 24 phụ âm) với hướng dẫn khẩu hình, âm tiếng Việt gần giống, lỗi hay gặp, ghi chú Anh-Mỹ, từ ví dụ nghe được (thường & chậm), cặp từ so sánh; hướng dẫn đọc phiên âm, quy tắc đọc đuôi -s/-es, -ed và bài luyện nghe phân biệt cặp âm.
- 🎧 **Nghe & chép** (kiểu dailydictation): nghe từng câu, gõ lại, bấm *Kiểm tra*: từ đúng hiện ra, từ sai bị che `***` để nghe lại và tự sửa. Có gợi ý từng từ, hiện đáp án, đổi tốc độ, phím tắt.

Kế hoạch chi tiết: [PLAN.md](./PLAN.md).

## Chạy trên máy local

Yêu cầu: **Node.js 20+** (khuyến nghị 22).

```bash
npm install
```

```bash
npm run dev
```

Mở http://localhost:3000. Không cần database hay API key.

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy chế độ phát triển |
| `npm test` | Chạy unit test (chấm điểm, chuẩn hóa văn bản, kiểm tra nội dung) |
| `npm run lint` | Kiểm tra kiểu TypeScript |
| `npm run build && npm start` | Build và chạy bản production |

> **Âm thanh:** giai đoạn này dùng Web Speech API có sẵn trong trình duyệt (Chrome, Edge, Safari). Chất lượng giọng phụ thuộc hệ điều hành; Edge/Chrome có giọng "Natural"/"Google" nghe tốt nhất. Có thể chọn giọng ngay trong bài nghe chép.
>
> **Tiến độ học** được lưu trong `localStorage` của trình duyệt (chưa có tài khoản).

## Cấu trúc

```
src/
├── app/                    # Các trang (Next.js App Router)
│   ├── page.tsx            # Trang chủ
│   ├── levels/             # Lộ trình theo cấp độ
│   ├── grammar/            # Thư viện & trang lý thuyết
│   ├── quiz/               # Danh sách bộ đề & làm bài
│   └── dictation/          # Danh sách bài nghe & làm bài
├── components/             # Giao diện (theory, quiz, dictation, layout...)
├── content/                # NỘI DUNG — sửa/thêm bài học ở đây
│   ├── catalog.ts          # Danh mục 81 chủ điểm A1–C1
│   ├── topics/             # Lý thuyết + câu hỏi cho từng chủ điểm
│   ├── dictations.ts       # Bài nghe & chép
│   └── ipa.ts              # 44 âm IPA, hướng dẫn đọc, quy tắc đuôi -s/-ed
├── core/                   # Logic thuần + test: chuẩn hóa, chấm dictation, chấm quiz
└── lib/                    # Tiến độ (localStorage), TTS, lộ trình, bộ đề
```

## Thêm nội dung

**Thêm một chủ điểm:**
1. Tạo file trong `src/content/topics/` (một chủ điểm, hoặc một nhóm như `a2-tenses.ts`; copy file có sẵn làm mẫu). `slug` phải trùng với `catalog.ts`.
2. Đăng ký trong `src/content/topics/index.ts`.
3. Chạy `npm test`: test nội dung sẽ báo nếu đáp án không hợp lệ (vd từ trong câu sắp xếp không khớp, chỉ số đáp án sai).

**Thêm một bài nghe chép:** thêm vào `src/content/dictations.ts` (truyện, hội thoại) hoặc `src/content/dictations-a1a2.ts` / `dictations-b1.ts` (theo chủ điểm). Test yêu cầu mỗi chủ điểm có ít nhất một bài nghe chép. Gắn `topicSlug` để bài nghe được tính vào tiến độ của chủ điểm.

## Quy tắc chấm Nghe & chép

Xem `src/core/dictation.ts` và `src/core/normalize.ts`:

- Không phân biệt hoa/thường, bỏ qua dấu câu.
- Chấp nhận `don't` = `do not`, `5` = `five`, `colour` = `color`. Riêng `'s` và `'d` giữ nguyên vì mơ hồ (is/has, would/had).
- Sai 1 ký tự ở từ ≥ 5 chữ cái là **gần đúng** (nửa điểm, vẫn cho qua). Riêng sai đuôi ngữ pháp (`walk`/`walked`) luôn tính là **sai**.
- Điểm mỗi câu tính ở **lần kiểm tra đầu tiên**; sau đó người học sửa đến khi đúng.
