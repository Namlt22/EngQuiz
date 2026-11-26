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
trang `/games`, `/level-test`, `/a1-course`) phải nằm trong khu tiếng Anh, tức là khu tiếng Trung và khu dùng chung
không import tới chúng, và chúng không import gì từ khu tiếng Trung.

## Lưu ý cho tính năng tiếng Anh mới

- Menu (`components/layout/nav-items.ts`) thuộc khu dùng chung: lối vào tính năng mới đặt trên các trang tiếng Anh
  (`/vocab`, `/grammar`, `/quiz`, `/levels`). Muốn thêm vào menu thì cần đồng ý sửa khu dùng chung.
- Tiến độ của các tính năng mới (điểm game, kết quả kiểm tra trình độ, tiến độ khoá A1 20 ngày) lưu ở
  `lib/en-extra-store.ts` (localStorage riêng của khoá tiếng Anh), vì bộ lưu tiến độ chung (`lib/progress`) và đồng bộ
  tài khoản (`lib/learner-*`) là khu dùng chung. XP vẫn cộng qua `progressActions.addXp` (chỉ gọi, không sửa).
