# Phân vùng mã nguồn: Tiếng Anh · Tiếng Trung · Dùng chung

Dự án có ba khu vực, phải tách biệt khi sửa:

| Khu vực | Gồm | Quy tắc |
|---|---|---|
| **Tiếng Anh** (`en`) | Trang gốc của khoá tiếng Anh (`/grammar`, `/quiz`, `/levels`, `/dictation`, `/ipa`, `/reading`, `/dialogues`, `/vocab`, `/games`, `/level-test`, `/a1-course`…), code chỉ khoá tiếng Anh dùng (`components/quiz`, `components/theory`, `core/grading`, `lib/quiz-sets`, mọi file `*/en-*`…), dữ liệu tiếng Anh trong `src/content` (`topics`, `vocab-en`, `dictations*`, `en-course`…) | Thay đổi cho tiếng Anh chỉ được nằm ở đây. |
| **Tiếng Trung** (`zh`) | `src/app/zh`, `src/components/zh`, `src/content/zh`, `src/core/{zh-*,pinyin*,hanzi*}`, `src/lib/zh-*` | Không sửa khi làm việc cho tiếng Anh. |
| **Dùng chung** (`shared`) | Nền tảng cả web: đăng nhập, tài khoản, admin, gói AI / thanh toán, pháp lý, `api/**`, `server/**`, Prisma, layout / header / footer / menu (`components/layout`), cấu hình. Và **lõi học tập** mà cả hai khoá cùng dùng: `lib/progress`, `lib/speech`, `lib/speech-recognition`, `core/srs`, `components/{vocab/CardSession, roadmap, sentences, speaking, notebook, lesson, learn/TodayHub, chat, ui}`… | Không sửa khi làm việc cho một khoá. Chỉ được **dùng** (import). Cần sửa thì hỏi trước vì ảnh hưởng cả hai khoá. |

Danh sách khu "dùng chung" **không viết tay**: script tự tính từ import thật. Mọi file code mà khu tiếng Trung
hoặc nền tảng import tới (trực tiếp hay gián tiếp) đều là dùng chung, nên một file "trông như của tiếng Anh"
(vd `lib/progress.ts`) mà khoá tiếng Trung cũng dùng sẽ tự được xếp vào khu dùng chung.

## Kiểm tra

```bash
node scripts/check-areas.mjs                          # số file mỗi khu
node scripts/check-areas.mjs --file src/lib/speech.ts # một file thuộc khu nào
node scripts/check-areas.mjs --diff origin/claude/tender-volta-83h5q9
```

Lệnh `--diff` liệt kê mọi file đã đổi theo khu vực và **báo lỗi** nếu có file thuộc khu tiếng Trung hoặc dùng chung.

Test `src/core/en-areas.test.ts` chạy trong `npm test`: các module tiếng Anh mới (`*/en-*`, `content/en-course`,
trang `/games`, `/level-test`, `/a1-course`) phải nằm trong khu tiếng Anh (khu tiếng Trung và khu dùng chung không import
tới chúng), trừ đúng hai module đồng bộ đã duyệt (`lib/en-extra-store.ts`, `core/en-extra-merge.ts`); và không module nào
import từ khu tiếng Trung.

Script đọc cả import `@/…` lẫn import tương đối (`./x`, `../x`).

## Các sửa đổi khu dùng chung đã được duyệt (2026-11-26)

Cho các tính năng tiếng Anh mới (game, kiểm tra trình độ, khoá A1 20 ngày), người dùng đồng ý sửa đúng ba chỗ:

1. **Menu** — `components/layout/nav-items.ts`: thêm 3 mục vào `NAV_EN` (Khoá A1 20 ngày · Trò chơi · Kiểm tra trình độ).
   `NAV_ZH` giữ nguyên.
2. **Ẩn thanh tab khi đang làm bài** — `SESSION_ROUTES` trong cùng file: thêm `/a1-course/*`, `/games/(vocab|grammar)/*`,
   `/level-test`.
3. **Đồng bộ tài khoản** — tiến độ các tính năng mới (`lib/en-extra-store.ts`) lưu trong trường tuỳ chọn
   `progress.enExtra` của khoá tiếng Anh (cột JSON `progress` sẵn có, không cần migration):
   `lib/learner-schema.ts` (schema + giới hạn), `lib/learner-merge.ts` (gộp, hàm `core/en-extra-merge.ts`),
   `lib/learner-sanitize.ts` (giữ nếu hợp lệ), `lib/learner-sync.ts` (không coi là trống), `components/auth/LearnerSync.tsx`
   (đọc / ghi / theo dõi / xoá khi đổi tài khoản). Khoá tiếng Trung không bao giờ có trường này: test
   `lib/learner-en-extra.test.ts` kiểm tra dữ liệu tiếng Trung gộp ra y như trước.

Ngoài ba chỗ trên, tính năng tiếng Anh mới không sửa gì ở khu dùng chung. Vì vậy `--diff` sẽ liệt kê đúng các file trên ở
mục SHARED (và báo lỗi); đó là các thay đổi đã duyệt. Mọi thay đổi dùng chung khác vẫn cần hỏi trước.

Lối vào tính năng mới cũng có trên các trang tiếng Anh (`/vocab`, `/grammar`, `/quiz`). XP của các tính năng mới cộng
qua `progressActions.addXp` (chỉ gọi, không sửa `lib/progress`).
