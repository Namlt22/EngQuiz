# EngQuiz — Đặc tả thiết kế lại (IA · hành trình học · giao diện)

Phạm vi: khoá tiếng Anh (CEFR A1–C1) và tiếng Trung (HSK 1–4). Tài liệu này chỉ mô tả thiết kế, không kèm mã.
Các quyết định đã chốt, không bàn lại: màn hình sạch (không chú thích, không mô tả tính năng, không ghi chú quota, không chú giải màu),
credits chỉ ở `/credits`; giữ đúng hai dòng pháp lý (nhắc "không gửi dữ liệu nhạy cảm · điều khoản AI" trước ô nhập AI, và nhãn "AI tạo, có thể sai" trên phản hồi AI);
chat AI: nhập vai + trò chuyện tự do, 1 cuộc = 1 lượt AI, tối đa 12 tin của người học.

---

## 0. Tham khảo đối thủ (openquiz.ai)

Đọc được trang chủ công khai (`/`, `/vi`); không vào được phần app sau đăng nhập. Những mẫu đáng mượn (diễn đạt lại, không sao chép):

| Mẫu | Ý tưởng | Áp dụng cho EngQuiz |
|---|---|---|
| Một bộ từ, nhiều cách luyện | Một tập từ là trung tâm; flashcard, trắc nghiệm, nghe chép, nói, dịch câu đều dùng lại tập đó | Sổ tay từ vựng là "tập từ của tôi"; từ trong sổ tay đi vào ôn thẻ, Luyện đặt câu và gợi ý cho chat AI |
| Lưu từ ở mọi nơi | Lưu từ ngay tại chỗ gặp (kể cả từ trang web khác) | Nút ngôi sao + chọn đoạn văn trong mọi bài đọc, hội thoại, danh sách từ, sửa lỗi chat |
| Vòng học khép kín | Học từ → luyện → dùng trong câu/lời nói → được sửa → ôn lại sau | Chuỗi "bước tiếp theo" cố định sau mỗi hoạt động (mục 3) |
| Đếm thẻ đến hạn | Bảng điều khiển hiện số thẻ đến hạn / đang học / mới | Thẻ "Ôn hôm nay" trên trang chủ, một con số duy nhất |
| Lộ trình theo kỳ thi, chia nhỏ theo chủ đề | Đi tuần tự từng tập nhỏ | EngQuiz đã có lộ trình theo ngày, mạnh hơn; chỉ cần đưa nó lên làm trục chính của trang chủ |

Không mượn: trang marketing dài, trò chơi, lớp học/giáo viên, nhập từ ảnh, AI tự soạn bài (trái với nguyên tắc "không sinh nội dung").

---

## 1. Chẩn đoán hiện trạng

### 1.1 Lối vào trùng lặp
- **Cấp độ vs Lý thuyết** (EN): `/levels/[level]` (tiêu đề "Ngữ pháp A1…", `LevelPath.tsx`) và `/grammar` (`GrammarLibrary.tsx`) đều là danh sách chủ điểm ngữ pháp, chỉ khác cách lọc. Cả hai nằm trong nhóm "Học" (`nav-items.ts`).
- **Quiz chủ điểm** có 3 lối vào: nút Quiz ở hero trang chủ, `TheoryFooter.tsx`, và `/quiz` (`QuizSetList.tsx`) — trong khi quiz chỉ có nghĩa sau khi học lý thuyết.
- **Trang chủ EN** (`HomeDashboard.tsx`) lặp lại menu: lưới "Cấp độ" + lưới 6 "Luyện tập" trùng với dropdown Học/Luyện tập.
- **Trang chủ ZH** (`src/app/zh/page.tsx`) lưới 8 module trùng nguyên menu.
- **Thi thử HSK**: 4 mục riêng trong nhóm "Luyện tập" (`NAV_ZH`), làm bảng chọn trên điện thoại dài 7 dòng.

### 1.2 Ngõ cụt (kết thúc không dẫn đi đâu)
| Màn hình | File | Kết thúc hiện tại |
|---|---|---|
| Kết quả bài đọc / hội thoại EN | `LessonQuiz.tsx` → `LessonResult` | Chỉ "Làm lại" |
| Kết quả đọc hiểu ZH | `ZhTextQuiz.tsx` | Chỉ "Làm lại" |
| Bài tập ngữ pháp ZH | `ZhGrammarQuiz.tsx` | Chỉ "Làm lại" |
| Thi thử HSK | `ZhMockTest.tsx` | Chỉ "Làm lại (thứ tự đáp án mới)" |
| Nghe chép EN | `DictationPlayer.tsx` | Làm lại / Lý thuyết / Bài khác — không có bước tiến |
| Nghe chép ZH | `ZhDictationView.tsx` | Làm lại / về danh sách |
| Ôn thẻ EN | `EnFlashcardSession.tsx` | "Xong lượt ôn" → về `/vocab` |
| Chat AI hết 12 tin | `ChatRoom.tsx` | Chỉ mở cuộc mới; câu sửa lỗi biến mất cùng cuộc |
| Lộ trình trên trang chủ ZH | `zh/page.tsx` → `Stage` | Thẻ chặng là `<li>` không bấm được |

Chỉ có `RoadmapReturnBar.tsx` (khi vào từ lộ trình) và `TheoryFooter.tsx`, `ZhGrammarView.tsx` ("Bài tiếp"), `PinyinLessonView.tsx` là có bước tiếp theo rõ.

### 1.3 Lệch giữa hai khoá
| Khía cạnh | Tiếng Anh | Tiếng Trung |
|---|---|---|
| Trang chủ | Có streak/XP, "Tiếp tục học", `RoadmapTeaser` | Tĩnh: hero + chặng + lưới; không tiến độ, không streak, không "Day n" |
| `RoadmapTeaser.tsx` | Chỉ dùng `buildRoadmap` (EN), link cứng `/roadmap` | Không dùng được |
| Ôn từ vựng → lộ trình | Không có nhiệm vụ ôn từ; `EnFlashcardSession` không báo xong | Có (`finishVocabSession`, `ZH_VOCAB_TASK_REF`) |
| Thiết lập lộ trình | `RoadmapSetup.tsx` (mục tiêu, phút/ngày…) | `ZhRoadmapApp.tsx` chỉ chọn điểm bắt đầu |
| Bài đọc / hội thoại | Hai component (`ReadingView`, `DialoguePlayer`), glossary là danh sách tĩnh | Một component (`ZhTextView`), chạm từ → `WordGloss` |
| Lý thuyết → luyện | `TheoryFooter` (Quiz, Nghe chép) | Bài tập nằm trong trang, "Bài tiếp" sang bài ngữ pháp kế |
| Luyện nói | `/speaking`, `/ipa` | Không có (chỉ pinyin + chat) — chấp nhận, nhưng menu phải cân |

### 1.4 Điện thoại
- `BottomNav.tsx`: biểu thức ẩn thanh tab khi đang làm bài là `^/(quiz|dictation)/.+` → **không** ẩn ở `/zh/dictation/*`, `/zh/mock/*`, `/zh/grammar/*`, bài đọc, hội thoại: thanh tab che nút "Kiểm tra/Tiếp".
- Thanh tab có 5 ô, ô thứ 5 là "Gói AI" (`/pricing`) — chiếm chỗ của một tính năng học hằng ngày.
- `WordGloss.tsx` (cố định đáy, `bottom-[4.75rem]`) và `RoadmapReturnBar` (dưới header) cùng lúc chiếm ~30% chiều cao màn hình nhỏ.
- Bảng chọn nhóm "Luyện tập" ZH 7 dòng + tiêu đề vượt nửa màn hình 375×667.
- Hero trang chủ EN chiếm gần trọn màn hình đầu; nút hành động chính nằm dưới nếp gấp trên máy nhỏ.

### 1.5 Chưa nhất quán về giao diện
- Ba kiểu màn hình kết quả (QuizPlayer, LessonResult, ZhDictationView) với bố cục, biểu tượng và thứ tự nút khác nhau.
- Hai bộ thẻ ôn gần giống nhau (`EnFlashcardSession.tsx` 192 dòng, `zh/FlashcardSession.tsx` 209 dòng).
- Thẻ lối tắt: EN dùng icon gradient + chữ ngang; ZH dùng icon nền xám + chữ dọc.
- Nút "Thoát" của bài: EN là icon X về danh sách; ZH là link chữ "← …" ở đầu trang.

---

## 2. Kiến trúc thông tin mục tiêu

Nguyên tắc: **3 nhóm cố định cho cả hai khoá** — Hôm nay (làm gì bây giờ), Học (nội dung theo bài), Luyện (dạng bài tập dùng lại kiến thức), cộng **Sổ tay** là của riêng người học. Lộ trình là trục, nằm cạnh Hôm nay.

### 2.1 Cây menu cuối cùng

```
Tiếng Anh                                  Tiếng Trung
─────────────────────────────────          ─────────────────────────────────
Hôm nay            /                       Hôm nay            /zh
Lộ trình           /roadmap                Lộ trình           /zh/roadmap
Học ▾                                      Học ▾
  Ngữ pháp         /grammar (lọc cấp)        Pinyin           /zh/pinyin
  Từ vựng          /vocab                    Hán tự           /zh/hanzi
  Phát âm          /ipa                      Từ vựng HSK      /zh/vocab
  Đọc hiểu         /reading                  Ngữ pháp         /zh/grammar
  Hội thoại        /dialogues                Bài đọc          /zh/reading
                                             Hội thoại        /zh/dialogues
Luyện ▾                                    Luyện ▾
  Ôn thẻ hôm nay   /review                   Ôn thẻ hôm nay   /zh/review
  Đặt câu          /sentences                Đặt câu          /zh/sentences
  Quiz             /quiz                     Nghe chép        /zh/dictation
  Nghe chép        /dictation                Thi thử HSK      /zh/mock
  Luyện nói        /speaking                 Trò chuyện AI    /zh/chat
  Trò chuyện AI    /chat
Sổ tay             /notebook               Sổ tay             /zh/notebook

Góc phải header (cả hai): CourseSwitcher · Gói AI · ThemeToggle · UserMenu
Footer: Pháp lý · Credits (giữ nguyên SiteFooter)
```

Thay đổi so với `nav-items.ts`:
1. Bỏ "Cấp độ" khỏi menu; `/levels/[level]` giữ làm trang con (đường đi theo cấp) và mở từ bộ lọc cấp ở `/grammar`. `/levels` chuyển hướng về `/grammar`.
2. "Lý thuyết" đổi tên "Ngữ pháp" cho khớp ZH.
3. "Hội thoại" chuyển từ Luyện sang Học (là nội dung theo bài, có ở lộ trình) — ZH cũng vậy.
4. 4 mục thi thử gộp thành một "Thi thử HSK" → trang `/zh/mock` mới (4 thẻ HSK 1–4).
5. Thêm "Ôn thẻ hôm nay", "Đặt câu", "Sổ tay".
6. "Luyện tập" đổi thành "Luyện" (vừa ô tab).

### 2.2 Thanh tab dưới (điện thoại)

```
[ Hôm nay ] [ Lộ trình ] [ Học ] [ Luyện ] [ Sổ tay ]
```
- "Học", "Luyện" mở `GroupSheet` như hiện nay (tối đa 6 dòng — đã đạt sau khi gộp thi thử).
- Bỏ ô "Gói AI" khỏi thanh tab; Gói AI ở header (nút nhỏ) và trong `UserMenu`.
- Chấm đỏ nhỏ (không số) trên ô "Luyện" khi có thẻ đến hạn; không thêm chữ.
- Ẩn thanh tab trong **mọi** màn hình đang làm bài: dùng một danh sách tiền tố dùng chung (`SESSION_ROUTES` trong `nav-items.ts`) gồm `/quiz/*`, `/dictation/*`, `/zh/dictation/*`, `/zh/mock/*`, `/review`, `/zh/review`, `/sentences/*`, `/zh/sentences/*`, và khi `CardSession`/`SentencePlayer` đang chạy (thuộc tính `data-session` trên `<body>`).

### 2.3 Trang chủ = trung tâm "Hôm nay"
Một component chung `TodayHub` cho cả hai khoá (thay `HomeDashboard.tsx` và nội dung `src/app/zh/page.tsx`). Bố cục ở mục 5.1.

---

## 3. Hành trình người học

### 3.1 Ngày đầu tiên
1. Vào `/` (hoặc `/zh`) chưa có lộ trình → `TodayHub` chỉ hiện một thẻ lớn: chọn trình độ bắt đầu (tái dùng `RoadmapSetup` thu gọn: EN chọn cấp; ZH chọn "Bắt đầu từ pinyin" / "Đã biết pinyin"). Không có lưới module.
2. Lưu xong → ở lại trang chủ, thẻ "Tiếp theo" hiện nhiệm vụ 1 của Day 1 với nút "Bắt đầu".
3. Làm nhiệm vụ → màn hình kết quả có nút chính "Bài tiếp theo" (nhiệm vụ 2 của Day 1).
4. Xong Day 1 → màn hình kết quả hiện "Xong Day 1" + streak 1 + nút "Về Hôm nay". Sổ tay đã có các từ người học gắn sao (nếu có); nếu chưa có, không nhắc.

### 3.2 Một ngày bình thường
```
Mở app → Hôm nay
  ├─ "Tiếp theo": nhiệm vụ chưa xong đầu tiên của ngày hiện tại  ← nút chính
  ├─ Ôn thẻ hôm nay (n)  → /review   (từ HSK/EN đến hạn + Sổ tay đến hạn, một hàng đợi)
  └─ Danh sách nhiệm vụ trong ngày (gọn), tích tự động
Mỗi hoạt động kết thúc → ActivityResult → bước tiếp theo (mục 3.4)
Hết nhiệm vụ → "Xong Day n" → gợi ý một việc tuỳ chọn: Đặt câu với từ mới lưu, hoặc Trò chuyện AI
```

### 3.3 Sau một bài học
Mọi bài kết thúc bằng `ActivityResult` gồm: điểm, XP nhận được, (nếu có) "Lưu n từ của bài" và **đúng một nút chính** + tối đa một nút phụ + nút nhỏ "Làm lại".

### 3.4 Logic "bước tiếp theo"
Hàm thuần mới `nextStep(input) → { primary, secondary? }` trong `src/lib/next-step.ts` (có test). Thứ tự ưu tiên:

1. **Không đạt** (dưới `PASS_PERCENT` hoặc ngưỡng riêng của bài): primary = "Làm lại câu sai" (hoặc "Làm lại"); secondary = xem lại lý thuyết/bài. Không đẩy sang bước mới.
2. **Mở từ lộ trình** (`readReturnTarget(course)` có giá trị): primary = nhiệm vụ chưa xong kế tiếp **của cùng ngày** (mở thẳng, gọi `saveReturnTarget` cho nhiệm vụ đó); hết ngày → "Xong Day n" → "Về Hôm nay". Secondary = "Về lộ trình".
3. **Ngoài lộ trình** — chuỗi theo nội dung:

| Vừa xong | Primary | Secondary |
|---|---|---|
| Lý thuyết EN (`TheoryFooter`) | Quiz chủ điểm | Nghe chép (nếu `dictationId`) |
| Quiz chủ điểm đạt | Nghe chép của chủ điểm; nếu không có → Đặt câu theo chủ điểm | Chủ điểm kế tiếp (`nextTopic`) |
| Nghe chép đạt | Đặt câu theo chủ điểm | Lưu từ của bài |
| Đọc hiểu / Hội thoại đạt | Lưu từ của bài (glossary) → rồi Đặt câu "trả lời → câu hỏi" từ bài đó | Bài kế tiếp cùng cấp |
| Ngữ pháp ZH đạt | Đặt câu với cấu trúc vừa học | Bài ngữ pháp kế (giữ "Bài tiếp" hiện có) |
| Pinyin ZH | (giữ chuỗi 3 bước hiện có) → Hán tự của tuần | Bài pinyin kế |
| Thi thử đạt | Về Hôm nay | Thi thử cấp kế |
| Ôn thẻ xong | Đặt câu với từ Sổ tay vừa ôn (khi Sổ tay ≥ 3 từ) | Về Hôm nay |
| Đặt câu xong | Ôn thẻ nếu còn thẻ đến hạn; không thì Về Hôm nay | — |
| Chat AI hết lượt | Lưu các câu đã sửa vào Sổ tay | Cuộc mới |

4. **Không có gì phía trên** → "Về Hôm nay". Không bao giờ có màn hình kết quả chỉ một nút "Làm lại".

`RoadmapReturnBar` giữ nguyên vai trò (cho người đang ở giữa bài), nhưng khi `ActivityResult` đang hiển thị thì ẩn để không có hai nút "về lộ trình".

---

## 4. Sổ tay từ vựng và Luyện đặt câu — kết nối

### 4.1 Sổ tay từ vựng (một sổ cho mỗi khoá)

**Dữ liệu** (`src/lib/notebook.ts`, store localStorage theo `courseStorageKey(course, "notebook:v1")`, cùng kiểu `useSyncExternalStore` như `progress.ts`):
- Mục: `id`, `term` (EN: từ/cụm; ZH: chữ Hán), `meaning` (tiếng Việt, bắt buộc), `reading?` (IPA hoặc pinyin), `example?`, `source?` `{ kind: "vocab" | "reading" | "dialogue" | "chat" | "manual" | "selection"; ref?: string }`, `addedDay`.
- SRS: tái dùng `src/core/srs.ts` (`review`, `buildQueue`, `encodeSrs`), lưu chuỗi riêng `notebookSrs` (khoá = `id`), để không chạm giới hạn `SRS_MAX_CHARS` của từ vựng chuẩn.
- Đồng bộ tài khoản: thêm trường vào `learner-schema.ts`, làm sạch ở `learner-sanitize.ts`, gộp ở `learner-merge.ts` (hợp theo `id`, lấy bản sửa sau). Giới hạn số mục mỗi khoá (hằng số `NOTEBOOK_MAX_ENTRIES`).
- Trùng: cùng `term` (chuẩn hoá bằng `normalize.ts` cho EN, bỏ khoảng trắng cho ZH) → không thêm mới, ngôi sao hiện đã lưu.

**Điểm thêm từ** (một component `SaveWordButton` = ngôi sao; `SelectionSave` = nút nổi khi bôi đen):
| Nơi | File | Cách |
|---|---|---|
| Danh sách từ EN | `EnVocabHome.tsx` (mỗi dòng) | Ngôi sao; nghĩa/IPA/ví dụ điền sẵn từ `vocab-en` |
| Danh sách từ HSK | `zh/VocabHome.tsx` | Ngôi sao; pinyin + nghĩa từ `vocab-vi` |
| Thẻ ôn đang lật | `CardSession` (mới, mục 5.7) | Ngôi sao ở góc thẻ |
| Glossary bài đọc EN | `ReadingView.tsx` | Ngôi sao mỗi dòng + nút "Lưu tất cả" ở `ActivityResult` |
| Chạm từ ZH | `WordGloss.tsx` | Ngôi sao cạnh pinyin |
| Bôi đen trong bài đọc/hội thoại | `ReadingView`, `DialoguePlayer`, `ZhTextView` | `SelectionSave` → mở `NotebookEntrySheet` điền sẵn `term`, câu chứa nó làm `example`; nghĩa: tra từ điển nội bộ (vocab-en/vocab-vi), không có thì người học gõ |
| Sửa lỗi chat AI | `ChatBubble.tsx` | Ngôi sao trên khối sửa lỗi: `term` = câu đã sửa, `meaning` = giải thích tiếng Việt (nếu có) hoặc người học gõ; `source.kind = "chat"` |
| Thêm tay | `/notebook` | Nút "+" → `NotebookEntrySheet` |

Không có văn bản hướng dẫn; ngôi sao rỗng/đầy là đủ. Lưu xong: ngôi sao đầy + rung nhẹ (`animate-pop-in`), không toast chữ.

**Ôn**: mặt trước là **nghĩa tiếng Việt**, mặt sau là từ + IPA/pinyin + ví dụ + nghe (trùng chế độ `meaning` hiện có của `EnFlashcardSession`). Có thêm chế độ "Gõ từ" (EN) / "Gõ pinyin" (ZH) như bộ thẻ HSK hiện có.

**Ôn thẻ hôm nay** (`/review`, `/zh/review`): một hàng đợi gộp = thẻ đến hạn của bộ từ chuẩn (`progress.srs`) + thẻ đến hạn của Sổ tay, xen kẽ, tối đa `NEW_PER_SESSION` thẻ mới mỗi nguồn. Trang `/vocab` và `/notebook` vẫn mở được phiên ôn riêng của chúng.

**XP**: thêm từ = 0 XP (tránh "cày"); ôn một thẻ = như `reviewWord` hiện có, dùng chung cho thẻ Sổ tay.

### 4.2 Luyện đặt câu
**Dạng bài** (đều chấm tự động trước):
| Dạng | Nguồn dữ liệu có sẵn (không soạn mới) | Chấm |
|---|---|---|
| Câu khẳng định → câu hỏi | Item `transform`/`word_order` trong `src/content/topics/*` thuộc chủ điểm câu hỏi; câu khẳng định trong `dialogues.ts` có câu hỏi tương ứng | `isEquivalent` (`core/normalize.ts`) với danh sách đáp án |
| Câu trả lời → câu hỏi | Cặp lượt hỏi–đáp liền nhau trong `dialogues.ts` (EN) và `zh/texts` (ZH) | EN: `isEquivalent`; ZH: so token (`core/zh-sentence.ts`), bỏ dấu câu |
| Xếp từ thành câu | Câu đã tách từ trong `zh/texts`, `word_order` EN | So thứ tự |
| Đặt câu với từ/cấu trúc cho sẵn | Từ trong Sổ tay, cấu trúc của chủ điểm ngữ pháp/bài ngữ pháp ZH | Tự động: câu chứa từ/mẫu (regex từ khoá cấu trúc), đủ độ dài tối thiểu, kết thúc đúng dấu; điểm "đạt cơ bản". Sau đó nút tuỳ chọn "AI kiểm tra" |

**Cấu trúc trang**: `/sentences` (EN), `/zh/sentences` (ZH) — trang chọn bộ: "Theo chủ điểm" (danh sách chủ điểm/bài ngữ pháp đã học), "Với từ trong Sổ tay", "Câu hỏi". Phiên chạy ở `/sentences/[setId]` (ẩn thanh tab). Bộ bài được dựng bằng hàm thuần `buildSentenceSet(source, ref)` trong `src/core/sentence-drill.ts`.

**AI kiểm tra (tuỳ chọn)**: chỉ ở dạng "đặt câu với từ/cấu trúc". Trên ô nhập giữ một dòng nhắc pháp lý giống `ChatRoom.tsx` dòng 206; phản hồi gắn nhãn "AI tạo, có thể sai". Mỗi lần kiểm tra trừ quota AI như chat (không ghi chú quota trên màn hình; hết lượt thì nút mờ đi và dẫn tới `/pricing`). Câu đã sửa → ngôi sao lưu vào Sổ tay.

**XP**: 2 XP mỗi câu đúng lần đầu (cùng hằng số `LESSON_XP_PER_CORRECT`), làm lại không cộng lặp (giống `recordLesson`).

### 4.3 Lộ trình
- Hai `TaskKind` mới trong `roadmap-days.ts`: `review` (ôn thẻ hôm nay) và `sentence` (một bộ đặt câu).
- EN: thêm nhiệm vụ `review` vào các ngày học (thay vai trò `zh-vocab` của ZH; ZH đổi `vocabTask` thành `review` dùng hàng đợi gộp). Thêm `sentence` vào ngày có lý thuyết + quiz của chủ điểm (EN) / ngày có ngữ pháp (ZH), và vào ngày 6 (ôn tập).
- **Rủi ro**: id nhiệm vụ là "tuần-ngày-thứ tự"; chèn nhiệm vụ làm lệch id → mất tích đã làm. Bắt buộc: thêm nhiệm vụ mới ở **cuối** danh sách của ngày, và chạy `remapTasks` cho log cũ (như `learner-merge.ts`) khi phiên bản lộ trình đổi. Có test trong `roadmap-days.test.ts`, `zh-roadmap.test.ts`.
- Báo xong: `progressActions.finishReviewSession()` (gộp `finishVocabSession`), `progressActions.recordSentenceSet(setId, percent, correct, total)` → `done("sentence", setId)` khi đạt.
- Icon trong `TASK_ICONS` (`DayTasks.tsx`): `review` → `Repeat`, `sentence` → `PenLine`/`MessageSquareText`.

---

## 5. Đặc tả từng màn hình (mobile first, 375 px)

Ký hiệu: `[Nút chính]`, `(nút phụ)`, `·` ngăn cách trên cùng dòng.

### 5.1 Hôm nay — `TodayHub` (`/`, `/zh`)
```
┌───────────────────────────────┐
│ 🔥 12 · ⭐ 340 XP · Day 23     │  StatStrip (một dòng, không nhãn dài)
├───────────────────────────────┤
│ TIẾP THEO                     │  NextTaskCard (thẻ màu chủ đạo của khoá)
│ Quiz: Present perfect         │
│ ~8 phút          [Bắt đầu →]  │
├───────────────────────────────┤
│ Ôn thẻ hôm nay      24  [Ôn]  │  ReviewDueCard (ẩn khi 0)
├───────────────────────────────┤
│ Day 23 · 2/4  ▓▓▓▓░░░░        │  DayTasks compact (đã có)
│ ✓ Lý thuyết …                 │
│ ✓ Phát âm /θ/                 │
│ ○ Quiz …                      │
│ ○ Đặt câu …                   │
├───────────────────────────────┤
│ [Sổ tay] [Đặt câu] [Chat AI]  │  QuickRow: 3 ô icon + tên
└───────────────────────────────┘
```
- Chưa có lộ trình: chỉ `RoadmapSetup` thu gọn thay cho NextTaskCard và DayTasks.
- Xong lộ trình: NextTaskCard → "Ôn thẻ" hoặc "Đặt câu".
- Bỏ hero gradient lớn, bỏ lưới Cấp độ, bỏ lưới 6/8 lối tắt. Màu khoá (indigo/đỏ-hổ phách) chỉ ở NextTaskCard.
- Desktop (≥ md): 2 cột — trái NextTaskCard + DayTasks, phải StatStrip dọc + ReviewDueCard + QuickRow.
- Dữ liệu: `daysFor(course, profile)` + `nextOpenDay` (đã có trong `course-roadmap.ts`, `roadmap-days.ts`); `RoadmapTeaser` được thay bằng `NextTaskCard` dùng cả hai khoá.

### 5.2 Lộ trình (`/roadmap`, `/zh/roadmap`)
- Giữ `RoadmapPath.tsx` (bản đồ tuần/ngày) và `DayTasks`. Hợp nhất vỏ: `RoadmapApp` và `ZhRoadmapApp` dùng chung `RoadmapShell` (header: tên lộ trình · tiến độ x/y ngày · nút "Sửa"), khác nhau chỉ ở form thiết lập.
- Mở trang: tự cuộn tới ngày đang học (đã có `#day-n`).
- Bỏ `hint` khỏi dòng nhiệm vụ (chỉ còn tên + phút) cho đúng nguyên tắc "không chú thích"; tiêu chí đạt hiện trong chính bài.

### 5.3 Một trang bài học (lý thuyết EN / ngữ pháp ZH / bài đọc / hội thoại)
```
[←]  Present perfect          A2   LessonHeader (dính trên cùng, cao 48px)
────────────────────────────────
 nội dung bài (giữ TheoryBlocks / ReadingView / ZhTextView)
 từ trong bài: ngôi sao lưu; bôi đen → SelectionSave
────────────────────────────────
 ActivityResult hoặc LessonFooter
   ✓ Đã xong +5 XP
   [Quiz chủ điểm →]   (Nghe chép)
```
- `LessonHeader` mới: nút quay lại (về danh sách, hoặc về lộ trình nếu có ReturnTarget — khi đó ẩn `RoadmapReturnBar`), tiêu đề cắt 1 dòng, `LevelBadge`.
- `TheoryFooter` đổi thành dùng `nextStep`; ZH ngữ pháp giữ "Bài tiếp" làm nút phụ.
- `WordGloss` trên điện thoại: nằm sát đáy (vì thanh tab đã ẩn trong bài), chiều cao tối đa 40vh.

### 5.4 Luyện (sheet trên điện thoại / dropdown trên máy tính)
Không làm trang hub riêng (đủ 5–6 mục trong sheet). Mỗi dòng: icon + tên + **số** bên phải nếu có việc đến hạn (Ôn thẻ: 24). Không mô tả.

### 5.5 Sổ tay (`/notebook`, `/zh/notebook`)
```
Sổ tay                         [+]
[ Ôn 8 thẻ ]                        ← nút chính, ẩn khi 0 đến hạn
[Tất cả] [Đến hạn] [Đã thuộc]       ← chip lọc
🔍 tìm
────────────────────────────────
 resilient  /rɪˈzɪl.i.ənt/  🔊
 kiên cường                    ⋯   ← sửa / xoá (vào thùng rác 7 ngày)
────────────────────────────────
 …
```
- Dòng giống danh sách trong `EnVocabHome` (cùng `ListRow`); chấm tiến độ hộp SRS bên trái (3 trạng thái, không chú giải).
- Trống: icon ngôi sao lớn + nút `[+ Thêm từ]`. Không câu giải thích.
- `NotebookEntrySheet` (bottom sheet): Từ · Nghĩa (bắt buộc) · IPA/Pinyin · Ví dụ → `[Lưu]`.
- Xoá: chuyển trạng thái `deletedDay`, hiện nút "Hoàn tác" 5 giây; xoá hẳn sau 7 ngày.
- Nút phụ cuối danh sách khi ≥ 3 từ: (Đặt câu với từ trong sổ).

### 5.6 Luyện đặt câu (`/sentences/[setId]`)
```
[✕]  ▓▓▓▓░░░░ 4/10
────────────────────────────────
 Đổi thành câu hỏi                 ← tên dạng bài, 1 dòng
 She has finished her homework.
 ┌───────────────────────────┐
 │ gõ câu…                   │
 └───────────────────────────┘
 (gợi ý từ: has · finished …)      ← chỉ dạng xếp từ: chip bấm được
                     [Kiểm tra]
── sau khi kiểm tra ──
 ✓ Has she finished her homework?  / ✗ + đáp án đúng
 (AI kiểm tra)  ☆                  ← chỉ dạng tự đặt câu
                     [Tiếp →]
```
- Tái dùng `QuestionView.tsx`/`QuizPlayer.tsx` khung (thanh tiến độ, phím Enter để kiểm tra/tiếp). Có thể triển khai `SentencePlayer` như một biến thể của `QuizPlayer` với `QuizResponse` dạng `transform`/`word_order` cộng dạng mới `compose`.
- ZH: ô nhập chữ Hán; dạng xếp từ dùng chip token (không bắt gõ IME).
- Kết thúc: `ActivityResult`.

### 5.7 Từ vựng (`/vocab`, `/zh/vocab`) và phiên ôn
- Giữ cấu trúc `EnVocabHome`/`VocabHome` (tab cấp, chip chủ đề, 3 số Đã thuộc/Đang học/Chưa học, danh sách).
- Thêm ngôi sao mỗi dòng. Gộp ba nút ôn thành `[Ôn n thẻ]` + menu chế độ nhỏ (Nghĩa → từ / Từ → nghĩa / Gõ từ) để thống nhất với ZH.
- Gộp `EnFlashcardSession` và `zh/FlashcardSession` thành `CardSession` (props: danh sách thẻ `{id, front, back, reading, example, speakText, lang}`, chế độ, nguồn SRS, `onFinish`). Dùng cho từ vựng chuẩn, Sổ tay và Ôn thẻ hôm nay.
- `onFinish` → `finishReviewSession()` cho cả hai khoá → `ActivityResult`.

### 5.8 Trò chuyện AI (`/chat`, `/zh/chat`)
- `ChatPicker`: lưới tình huống nhập vai + một ô "Trò chuyện tự do" ở đầu. Thẻ chỉ có icon + tên.
- `ChatRoom`: giữ nguyên bộ đếm lượt (không chữ giải thích, chỉ "n/12" nhỏ cạnh ô nhập), dòng nhắc pháp lý ngay trên ô nhập, nhãn "AI tạo, có thể sai" trên khối sửa lỗi.
- Khối sửa lỗi trong `ChatBubble`: thêm ngôi sao lưu vào Sổ tay.
- Hết 12 tin hoặc người học bấm "Kết thúc": `ChatSummary` = danh sách các câu đã sửa (mỗi câu có ngôi sao, nút "Lưu tất cả") → `[Cuộc mới]` (Về Hôm nay). Nhiệm vụ "Trò chuyện AI" không vào lộ trình (phụ thuộc gói trả phí).

---

## 6. Quy tắc hành vi và nhất quán

### 6.1 Một kiểu thẻ
- `card` (đã có trong CSS chung) là bề mặt duy nhất; bo góc 2xl, viền `line`, không bóng ở trạng thái nghỉ, `hover:shadow-md` chỉ khi là link.
- Thẻ link luôn: icon 40px nền `surface-2` màu `primary` + tên đậm + (số bên phải nếu có). Bỏ icon gradient nhiều màu ở lối tắt; gradient chỉ còn ở `NextTaskCard` và huy hiệu cấp (`LevelBadge`, `LEVELS[].gradient`).

### 6.2 Một thứ bậc nút
| Bậc | Lớp | Quy tắc |
|---|---|---|
| Chính | `btn-primary` | Tối đa **1** trên mỗi màn hình/khối kết quả; luôn là "bước tiếp theo" |
| Phụ | `btn-ghost` | Tối đa 1 bên cạnh nút chính |
| Thứ ba | link chữ nhỏ `text-muted` | "Làm lại", "Về lộ trình" |
| Phản hồi đúng/sai | `btn-success` / nền `danger` | Chỉ trong lúc làm bài (đã có ở `QuizPlayer`) |
Trên điện thoại, nút chính rộng full, đặt cuối khối, nằm trong vùng ngón cái.

### 6.3 Một mẫu tiến độ
- Trong phiên: thanh 6px ở đầu (`ProgressBar`) + "n/N" bên phải. Áp dụng cho quiz, nghe chép, thẻ, đặt câu, thi thử, đọc hiểu.
- Ngoài phiên: `ProgressBar` + "x/y" (ngày, chủ điểm, từ). Không phần trăm chữ, không chú giải màu.

### 6.4 Phản hồi hoàn thành — `ActivityResult`
```
   ✓ (hoặc 🏆 khi đạt / ↻ khi chưa đạt)
   85%                         ← số lớn
   +16 XP · 🔥 12              ← chỉ khi có thay đổi
   ☆ Lưu 6 từ của bài          ← khi bài có glossary/từ mới
   [Bước tiếp theo →]
   (phụ)
   Làm lại
```
- Không câu khen dài, không giải thích ngưỡng đạt (ngưỡng thể hiện qua icon và nút: chưa đạt thì nút chính là "Làm lại câu sai").
- Danh sách câu sai (như `QuizPlayer` dòng ~250) giữ, đặt dưới, thu gọn mặc định.
- Xong một ngày lộ trình: thêm dòng "Xong Day n" và hiệu ứng `animate-pop-in`; không popup.

### 6.5 Trạng thái trống
Icon + một nhãn 1–3 từ + một nút hành động. Ví dụ: Sổ tay trống → ☆ "Chưa có từ" `[+ Thêm từ]`; Ôn thẻ = 0 → ✓ "Đã ôn xong" `[Về Hôm nay]`; không có bài đặt câu theo chủ điểm → ẩn mục thay vì hiện ô trống.

### 6.6 Khác
- Vào bài từ bất kỳ đâu ngoài lộ trình không xoá ReturnTarget; mở bài từ lộ trình luôn ghi ReturnTarget (đã có).
- Mọi phát âm dùng `SpeakButton`; mọi nhãn cấp dùng `LevelBadge`.
- `ComingSoon` không xuất hiện trong menu: mục chưa có nội dung thì không có trong `nav-items.ts`.
- Không thêm `description` dài ở metadata trang hiển thị (metadata SEO giữ được, không hiện trên UI).

---

## 7. Kế hoạch triển khai (mỗi bước ship độc lập)

| # | Bước | File chính | Xong khi |
|---|---|---|---|
| 1 | Ẩn thanh tab đúng trong mọi phiên làm bài | `layout/nav-items.ts` (`SESSION_ROUTES`), `BottomNav.tsx` | Ở `/zh/dictation/x`, `/zh/mock/hsk1`, `/quiz/x` không thấy thanh tab; test đơn vị cho hàm `isSessionRoute` |
| 2 | `nextStep` thuần + test | `src/lib/next-step.ts`, `next-step.test.ts` | Bảng ở mục 3.4 được phủ bằng test (đạt/không đạt, có/không ReturnTarget, cả hai khoá) |
| 3 | `ActivityResult` + dùng ở bài đọc/hội thoại EN | `components/lesson/ActivityResult.tsx`, `LessonQuiz.tsx` | Kết quả bài đọc/hội thoại có đúng 1 nút chính theo `nextStep` |
| 4 | Áp `ActivityResult` cho các bài còn lại | `QuizPlayer.tsx`, `DictationPlayer.tsx`, `ZhTextQuiz.tsx`, `ZhGrammarQuiz.tsx`, `ZhDictationView.tsx`, `ZhMockTest.tsx`, `TheoryFooter.tsx` | Không còn màn hình kết quả chỉ có "Làm lại" (kiểm bằng grep + duyệt tay) |
| 5 | `NextTaskCard` dùng cho cả hai khoá | thay `roadmap/RoadmapTeaser.tsx`; dùng `course-roadmap.ts` | `/zh` hiện "Day n" và nút Bắt đầu đúng nhiệm vụ |
| 6 | `TodayHub` thay hai trang chủ | `learn/TodayHub.tsx`, `app/page.tsx`, `app/zh/page.tsx`, xoá `HomeDashboard.tsx` | Hai trang chủ cùng bố cục mục 5.1; trên 375×667 nút "Bắt đầu" thấy ngay không cuộn |
| 7 | Gọn menu (chưa có tính năng mới) | `nav-items.ts`, `app/levels/page.tsx` (redirect), `app/zh/mock/page.tsx` (mới), `Header.tsx`, `BottomNav.tsx`, `UserMenu.tsx` | Cây menu đúng mục 2.1 trừ 3 mục mới; "Gói AI" rời thanh tab; sheet Luyện ZH ≤ 5 dòng |
| 8 | `CardSession` hợp nhất bộ thẻ | `components/vocab/CardSession.tsx`; thay `EnFlashcardSession.tsx`, `zh/FlashcardSession.tsx` | Cả hai trang từ vựng chạy trên một component; test hiện có của hai bộ thẻ vẫn qua |
| 9 | EN ôn từ báo xong lộ trình | `progress.ts` (`finishReviewSession`), `roadmap-days.ts` (task `review` cuối ngày), `zh-roadmap.ts`, test lộ trình | Ôn xong ở `/vocab` tích nhiệm vụ ôn trong ngày EN; log cũ không mất tích (test `remapTasks`) |
| 10 | Sổ tay: lớp dữ liệu | `lib/notebook.ts`, `learner-schema.ts`, `learner-sanitize.ts`, `learner-merge.ts`, test | Thêm/sửa/xoá/trùng/đồng bộ được kiểm bằng test; chưa có UI |
| 11 | Sổ tay: trang + thêm tay + ôn | `app/notebook/page.tsx`, `app/zh/notebook/page.tsx`, `components/notebook/NotebookHome.tsx`, `NotebookEntrySheet.tsx`; `nav-items.ts` thêm "Sổ tay" | Thêm tay một từ, ôn được với mặt trước là nghĩa tiếng Việt; tab "Sổ tay" xuất hiện |
| 12 | Ngôi sao trong danh sách từ và thẻ | `components/notebook/SaveWordButton.tsx`; `EnVocabHome.tsx`, `zh/VocabHome.tsx`, `CardSession.tsx` | Gắn sao từ danh sách → có trong Sổ tay, sao đầy khi quay lại |
| 13 | Lưu từ trong bài đọc, hội thoại, chọn văn bản | `SelectionSave.tsx`; `ReadingView.tsx`, `DialoguePlayer.tsx`, `ZhTextView.tsx`, `WordGloss.tsx`; "Lưu n từ" trong `ActivityResult` | Bôi đen một cụm trên điện thoại → sheet điền sẵn → lưu được |
| 14 | Lưu câu sửa từ chat + `ChatSummary` | `ChatBubble.tsx`, `ChatRoom.tsx`, `chat/ChatSummary.tsx` | Hết 12 tin thấy danh sách câu sửa, lưu được; hai dòng pháp lý vẫn còn |
| 15 | Ôn thẻ hôm nay (hàng đợi gộp) | `core/srs.ts` (hàm gộp hàng đợi, test), `app/review/page.tsx`, `app/zh/review/page.tsx`, `ReviewDueCard` trong `TodayHub`, nhiệm vụ `review` dùng hàng đợi gộp | Số thẻ đến hạn trên trang chủ = số thẻ trong phiên; xong phiên tích nhiệm vụ |
| 16 | Đặt câu: lõi | `core/sentence-drill.ts` + test (dựng bộ từ topics/dialogues/zh texts, chấm EN/ZH) | Mỗi chủ điểm có dữ liệu sinh được ≥ 5 câu; chấm đúng các biến thể viết tắt (test) |
| 17 | Đặt câu: giao diện | `app/sentences/page.tsx`, `app/sentences/[setId]/page.tsx`, bản `/zh/...`, `components/sentences/SentencePlayer.tsx`, `progress.ts` (`recordSentenceSet`), `nav-items.ts` | Làm hết một bộ → XP + `ActivityResult`; nằm trong menu Luyện |
| 18 | Đặt câu trong lộ trình và chuỗi bước tiếp | `roadmap-days.ts`, `zh-roadmap.ts` (task `sentence` cuối ngày), `next-step.ts` | Day có ngữ pháp có nhiệm vụ Đặt câu, tự tích khi đạt; quiz đạt → gợi ý Đặt câu |
| 19 | AI kiểm tra câu (tuỳ chọn) | `app/api/sentence-check/route.ts` (quota như `api/chat`), `SentencePlayer.tsx` | Có dòng nhắc pháp lý trên ô nhập, nhãn "AI tạo, có thể sai" trên phản hồi; hết lượt nút mờ |
| 20 | Rà nhất quán | `globals.css` (lớp card/btn), các trang danh sách, `LessonHeader.tsx` | Checklist mục 6 đạt trên 375 px và 1280 px, sáng/tối |

Thứ tự gợi ý: 1→7 (sửa luồng hiện có, không phụ thuộc tính năng mới) → 8→15 (Sổ tay) → 16→19 (Đặt câu) → 20. Mỗi bước kèm test theo quy ước dự án (Vitest cho hàm thuần; kiểm tay trên điện thoại cho UI).

Lưu ý kỹ thuật: dự án dùng phiên bản Next.js có thay đổi lớn (xem `AGENTS.md`); trước khi thêm route mới (`/notebook`, `/review`, `/sentences/[setId]`, `/zh/mock`) và redirect `/levels`, đọc hướng dẫn trong `node_modules/next/dist/docs/` về `params`/`searchParams` dạng Promise (như `levels/[level]/page.tsx` đang dùng) và cách redirect.
