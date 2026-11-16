# Kế hoạch: chọn ngôn ngữ học + khoá tiếng Trung (chuẩn HSK 3.0)

> Đã duyệt 2026-11-17 (theo các lựa chọn đề xuất) · Đã xong: Bước 0 (từ vựng), Bước 1, Bước 2 phần pinyin. Bước 2 xong (trừ bảng chữ chính thức)
>
> **Phạm vi:**
> - Người dùng chọn ngôn ngữ muốn học: **Tiếng Anh** (đã có) hoặc **Tiếng Trung** (mới).
> - Tiếng Trung có đủ lộ trình, từ vựng, ngữ pháp, Hán tự, pinyin, nghe, nói, đọc và quiz.
> - Nội dung bám **Tiêu chuẩn trình độ tiếng Trung quốc tế (HSK 3.0)**.

---

## 1. Chuẩn tham chiếu

### 1.1 Văn bản gốc
- **GF 0025-2021** *国际中文教育中文水平等级标准* (Tiêu chuẩn trình độ tiếng Trung giáo dục quốc tế).
  - Bộ Giáo dục Trung Quốc ban hành, hiệu lực từ 01/07/2021.
  - Gồm 3 giai đoạn (Sơ, Trung, Cao) và 9 cấp.
  - Mô tả 4 thứ: âm tiết, chữ Hán, từ vựng, ngữ pháp.
- **新版HSK考试大纲 (11/2025)**: đề cương thi HSK mới.
  - Kỳ thi HSK 3.0 cấp 1–6 chính thức đầu tiên dự kiến **13/12/2026**.
  - Cấp 7–9 thi chung một bài; điểm số quyết định đạt cấp 7, 8 hay 9.

### 1.2 Hai văn bản lệch nhau về số lượng từ

| Cấp | Từ vựng (GF 0025-2021, cộng dồn) | Từ vựng (đề cương 2025, cộng dồn)* | Chữ Hán (2021, cộng dồn) | Âm tiết (2021, cộng dồn) | Điểm ngữ pháp (2021, từng cấp) |
|---|---|---|---|---|---|
| HSK 1 | 500 | 300 | 300 | 269 | 48 |
| HSK 2 | 1 272 | 500 | 600 | 468 | 81 |
| HSK 3 | 2 245 | 1 000 | 900 | 608 | 81 |
| HSK 4 | 3 245 | 2 000 | 1 200 | 724 | 76 |
| HSK 5 | 4 316 | 3 600 | 1 500 | 822 | 71 |
| HSK 6 | 5 456 | 5 400 | 1 800 | 908 | 67 |
| HSK 7–9 | 11 092 | ~11 000 | 3 000 | 1 110 | 148 |

\* Số liệu đề cương 2025 lấy từ nguồn thứ cấp. Bước 0 phải đối chiếu lại với bản gốc.

**Quyết định đề xuất:**
- Bám **đề cương thi 2025**, vì đó là thứ người học sẽ thi.
- Giữ GF 0025-2021 làm khung cho âm tiết, chữ Hán và ngữ pháp (nếu đề cương 2025 không thay).
- Mỗi từ, chữ và điểm ngữ pháp mang mã cấp riêng, nên nếu chuẩn đổi thì chỉ cần sửa dữ liệu, không phải viết lại lộ trình.

### 1.3 Phạm vi giai đoạn này
- **Làm:** HSK 1 → HSK 4 (trình độ tương đương B1–B2, đủ cho học tập và làm việc cơ bản).
- **Để sau:** HSK 5–6, sẽ thêm theo cùng khuôn.
- **Không làm:** HSK 7–9 (dành cho người học chuyên sâu, vượt quy mô hiện tại).

---

## 2. Trải nghiệm chọn ngôn ngữ

- **Lần đầu vào trang chủ:**
  - Hiện 2 thẻ lớn: 🇬🇧 *Tiếng Anh · CEFR A1–C1* và 🇨🇳 *Tiếng Trung · HSK 1–6*.
  - Lựa chọn được lưu lại.
- **Header:**
  - Có nút chuyển ngôn ngữ (cờ + tên) ở đầu thanh điều hướng.
  - Menu "Học / Luyện tập" đổi theo ngôn ngữ đang học.
- **Đường dẫn:**
  - Tiếng Anh giữ nguyên `/roadmap`, `/grammar`… để không gãy link cũ.
  - Tiếng Trung dùng tiền tố `/zh/…`: `/zh/roadmap`, `/zh/pinyin`, `/zh/hanzi`, `/zh/vocab`, `/zh/grammar`, `/zh/reading`, `/zh/dictation`, `/zh/speaking`, `/zh/dialogues`, `/zh/quiz`.
  - Mở thẳng một link `/zh/...` sẽ tự chuyển ngôn ngữ đang học sang tiếng Trung.
- **Tiến độ, XP, streak:**
  - Tách riêng theo từng ngôn ngữ.
  - Trang chủ cho phép xem tổng hợp cả hai.
- **Gói AI:** dùng chung cho cả hai ngôn ngữ (một tài khoản, một gói). → *Cần anh duyệt, xem mục 9.*

---

## 3. Kiến trúc kỹ thuật

### 3.1 Dữ liệu người học (DB)

Thêm một cột JSON vào `LearnerState`:

```prisma
/// Dữ liệu các khoá ngoài tiếng Anh: { zh: { progress, roadmap, roadmapLog } }
courses Json @default("{}")
```

- Mỗi khoá dùng **đúng schema hiện tại** (`progressSchema`, `roadmapProfileSchema`, `roadmapLogSchema`).
  - Toàn bộ code sanitize, merge chống ghi đè và remap task được tái sử dụng.
- Dữ liệu tiếng Anh giữ ở các cột cũ, không cần migrate.
- Thêm ngôn ngữ khác sau này (Nhật, Hàn) chỉ cần thêm khoá trong `courses`.
- `learner-sync`:
  - gửi kèm `courses`;
  - giới hạn kích thước theo từng khoá;
  - vẫn giữ trần keepalive 60 KB.

### 3.2 Tách lõi dùng chung và phần riêng từng ngôn ngữ

| Lớp | Hiện tại (tiếng Anh) | Việc cần làm |
|---|---|---|
| Danh mục ngôn ngữ | — | `src/lib/language.ts`: `LanguageCode = "en" \| "zh"`, store chọn ngôn ngữ, `useLanguage()` |
| Chuẩn hoá đáp án | `core/normalize.ts` (viết tắt, Anh–Mỹ) | Thêm `core/normalize-zh.ts`, chi tiết ở mục 3.3 |
| Chấm nghe chép | `core/dictation.ts` (so theo từ) | Thêm chế độ so **theo chữ Hán** (diff ký tự), vì tiếng Trung không có dấu cách |
| TTS | `speech.ts` cố định `en-US` | Chọn giọng theo ngôn ngữ (`zh-CN`), chỉnh tốc độ chậm/thường |
| Nhận dạng giọng | `useSpeechRecognition({lang})` | Truyền `zh-CN`; Chrome/Edge hỗ trợ, Safari iOS hạn chế (báo rõ cho người dùng) |
| AI sửa lỗi nói | prompt tiếng Anh | Prompt riêng cho tiếng Trung: sửa câu, đánh dấu sai thanh điệu/từ, giải thích bằng tiếng Việt |
| Lộ trình | `roadmap.ts` + `roadmap-units.ts` | Engine giữ nguyên; nhận `units` và `levels` theo khoá học thay vì import cứng |
| Quiz | 7 dạng câu | Giữ `mcq`, `gap_fill`, `word_order`, `matching`; thêm 3 dạng mới ở mục 4.5 |

### 3.3 Quy tắc chuẩn hoá tiếng Trung (`normalize-zh.ts`)
- Bỏ dấu câu toàn khổ: `，。？！、：；“”` và các dấu tương tự.
- Bỏ khoảng trắng.
- Quy chữ phồn thể về giản thể với danh sách nhỏ các chữ thường gặp.
- Pinyin:
  - chấp nhận dấu thanh (`nǐ hǎo`) hoặc số (`ni3 hao3`);
  - `v` / `u:` được hiểu là `ü`.
- Số Ả Rập ⇄ chữ Hán chỉ với số đơn giản (`3` = `三`).

### 3.4 Nội dung tĩnh, kiểm tra bằng test
Nội dung nằm trong `src/content/zh/…`, viết bằng TypeScript như hiện tại, và luôn có test kiểm tra:

- mọi từ, chữ dùng trong bài HSK *n* phải thuộc danh sách cấp ≤ *n*.
  - Ví dụ có gắn sẵn mảng token đã tách từ, nên kiểm tra được tự động.
- pinyin của từng từ khớp với từ điển gốc;
- đáp án quiz hợp lệ;
- bài đọc, nghe chép không dùng từ vượt cấp (cho phép tối đa 5%, phần vượt phải có chú thích).

---

## 4. Nội dung tiếng Trung

### 4.1 Pinyin & thanh điệu (`/zh/pinyin`, tương tự IPA bên tiếng Anh)

**Bảng âm:**
- 23 thanh mẫu (kể cả y, w).
- 36 vận mẫu.
- 4 thanh + thanh nhẹ.
- Bảng tổ hợp âm tiết theo đúng danh sách âm tiết của chuẩn.

**Bài học 3 bước** (như bài phát âm IPA hiện tại):
1. Nghe.
2. Phân biệt cặp dễ nhầm. Đây là điểm khó của người Việt:
   - zh/z, ch/c, sh/s;
   - j/q/x;
   - ü/u;
   - an/ang, en/eng;
   - thanh 2 và thanh 3.
3. Bài kiểm tra chọn thanh / chọn âm.

**Biến điệu:**
- 3-3 → 2-3;
- 不 (bù → bú);
- 一 (yī → yí / yì);
- âm cuốn lưỡi 儿化 (giới thiệu).

**Âm thanh mẫu:**
- TTS không đọc chuẩn pinyin rời, nên dùng **chữ Hán đại diện** cho từng âm tiết + thanh (ví dụ 妈 / 麻 / 马 / 骂).
- Âm tiết không có chữ phổ thông thì ghi chú, không phát âm.

### 4.2 Hán tự (`/zh/hanzi`)
- Đủ chữ Hán theo cấp (300 / 600 / 900 / 1 200 chữ cho HSK 1–4 theo chuẩn 2021).
- Nội dung mỗi chữ:
  - bộ thủ;
  - số nét;
  - **thứ tự nét có hoạt hình và bài tập tô chữ**;
  - **âm Hán-Việt**;
  - các từ HSK chứa chữ đó.
- 8 nét cơ bản, 7 quy tắc thứ tự nét, khoảng 50 bộ thủ thường gặp nhất.
- Thư viện: **Hanzi Writer** (MIT) + dữ liệu nét **Make Me a Hanzi**.
  - Phần dữ liệu nét dùng giấy phép Arphic, cho phép dùng nếu ghi công. → *Kiểm tra giấy phép ở Bước 0.*

### 4.3 Từ vựng (`/zh/vocab`)
- Đủ danh sách từ theo đề cương HSK 1–4.
- Mỗi từ gồm:
  - chữ Hán;
  - pinyin;
  - từ loại;
  - nghĩa tiếng Việt;
  - **Hán-Việt** (lợi thế lớn cho người Việt: 学生 = *học sinh*);
  - 1–2 câu ví dụ trong cấp.
- **Thẻ ghi nhớ có lặp lại ngắt quãng (SRS)**, chế độ chữ → nghĩa, nghĩa → chữ, nghe → chữ.
- Lượt ôn lưu vào `progress` của khoá `zh`.

### 4.4 Ngữ pháp (`/zh/grammar`)
- Bám danh mục điểm ngữ pháp của chuẩn.
  - Riêng HSK 1–4: 48 + 81 + 81 + 76 = **286 điểm**, gom thành khoảng 70 chủ điểm bài học.
- Ví dụ chủ điểm:
  - câu 是;
  - 吗 / 呢;
  - lượng từ;
  - 的 / 地 / 得;
  - 了 (động thái và ngữ khí);
  - 过 / 着;
  - bổ ngữ kết quả, xu hướng, khả năng, trình độ;
  - câu 把, câu 被;
  - so sánh 比;
  - 是…的;
  - các cặp liên từ…
- Tái sử dụng khối lý thuyết hiện có (`summary`, `formula`, `usage`, `mistakes`, `compare`, `tip`…).
  - Ví dụ đổi `en` thành `zh` + `pinyin`.
  - Phần "lỗi thường gặp" nhắm vào **lỗi của người Việt**: trật tự trạng ngữ thời gian/địa điểm, đặt định ngữ sau danh từ, dùng 了 như "đã".

### 4.5 Quiz (`/zh/quiz`)
**Dạng có sẵn, dùng lại:**
- trắc nghiệm;
- điền chỗ trống;
- **sắp xếp thành câu** (đúng dạng 连词成句 của đề HSK);
- ghép cặp.

**Dạng mới:**
- `tone_pick`: nghe hoặc đọc chữ, chọn thanh điệu.
- `hanzi_pick`: chọn chữ đúng (phân biệt chữ gần giống như 己 / 已, 买 / 卖).
- `pinyin_input`: gõ pinyin cho chữ.

**Bộ đề:**
- bộ đề theo chủ điểm;
- bộ đề tổng hợp theo cấp, **mô phỏng cấu trúc đề HSK 3.0** (phần nghe, đọc, viết).
  - Chỉ mô phỏng cấu trúc, không chép đề thật.

### 4.6 Nghe chép, đọc, hội thoại, luyện nói

| Phần | Nội dung |
|---|---|
| **Nghe chép** | - Khoảng 40 bài cho HSK 1–4.<br>- Chế độ gõ **pinyin** (HSK 1–2) hoặc **chữ Hán** (HSK 3+, dùng bộ gõ của máy).<br>- Chấm theo từng chữ. |
| **Đọc hiểu** | - Khoảng 24 bài.<br>- Bật/tắt pinyin (ruby).<br>- Chạm vào từ để xem nghĩa.<br>- Có câu hỏi hiểu bài. |
| **Hội thoại** | - Khoảng 24 tình huống: chào hỏi, mua sắm, mặc cả, đi taxi, gọi món, khám bệnh, phỏng vấn, công sở…<br>- Có nhập vai. |
| **Luyện nói** | - Đọc theo câu mẫu.<br>- Nhận dạng giọng nói `zh-CN` và so theo từng chữ.<br>- AI sửa lỗi nói (gói AI). |

---

## 5. Lộ trình tiếng Trung (`/zh/roadmap`)

- Giữ nguyên cơ chế đã làm cho tiếng Anh:
  - 6 ngày học + ngày 7 kiểm tra;
  - **tự hoàn thành khi làm xong bài, không cho tự tích**;
  - mốc tuần tự đạt.
- Hồ sơ người học:
  - trình độ đầu vào: *Mới bắt đầu / HSK 1 / HSK 2 / HSK 3*;
  - mục tiêu: *Giao tiếp / Thi HSK / Công việc / Du lịch*;
  - số phút mỗi ngày.

### 5.1 Khung chương trình (≈ 40 tuần nếu học 45 phút/ngày từ con số 0)

| Chặng | Tuần | Trọng tâm | Mốc tự đạt khi xong chặng |
|---|---|---|---|
| **0 · Nhập môn** | 1–2 | Pinyin, thanh điệu, biến điệu; nét và bộ thủ cơ bản; 30 chữ đầu | Đọc đúng mọi âm tiết pinyin; viết đúng thứ tự nét |
| **HSK 1** | 3–10 | 300 từ, ~48 điểm ngữ pháp: chào hỏi, bản thân, gia đình, số, ngày giờ, mua sắm, ăn uống | Giới thiệu bản thân, hỏi giá, gọi món; đạt bài thi thử HSK 1 |
| **HSK 2** | 11–16 | +200 từ, ~81 điểm: 了 / 过, so sánh, lượng từ mở rộng, đi lại, thời tiết, sức khoẻ | Kể việc đã làm, hỏi đường, hẹn lịch; thi thử HSK 2 |
| **HSK 3** | 17–28 | +500 từ, ~81 điểm: các loại bổ ngữ, câu 把 cơ bản, 是…的, liên từ | Kể chuyện ngắn, nêu ý kiến; viết câu bằng chữ Hán; thi thử HSK 3 |
| **HSK 4** | 29–40 | +1 000 từ, ~76 điểm: câu 被, bổ ngữ khả năng, văn viết ngắn, chủ đề công việc, xã hội | Trao đổi công việc, viết đoạn 80 chữ; thi thử HSK 4 |

### 5.2 Một ngày học mẫu (45 phút)

| Thời lượng | Hoạt động |
|---|---|
| 5′ | Pinyin / thanh điệu |
| 10′ | Từ mới (SRS) + chữ Hán (tô chữ) |
| 10′ | Ngữ pháp + quiz |
| 10′ | Nghe chép |
| 10′ | Nói theo mẫu / hội thoại |

- Ngày 7 là bài kiểm tra tổng hợp của tuần.
- Người đã có HSK *n* được bỏ qua các chặng trước. Dùng lại cơ chế `B1_SKIP_UNITS`.

---

## 6. Đảm bảo "chính xác"

1. **Dữ liệu gốc:**
   - danh sách từ, chữ, ngữ pháp lấy từ văn bản chuẩn ở mục 1;
   - mỗi mục ghi rõ cấp theo nguồn nào.
2. **Test tự động:**
   - kiểm soát vượt cấp;
   - pinyin khớp từ điển;
   - đáp án hợp lệ;
   - không có ô trống.
3. **Kiểm tra chéo bằng agent review** cho từng cấp (như đã làm với EngQuiz).
4. **Người bản ngữ / giáo viên tiếng Trung duyệt trước khi quảng bá là "chuẩn HSK".**
   - Nội dung do AI soạn có thể đúng phần lớn, nhưng thanh điệu, lượng từ và sắc thái dùng từ rất cần người thật soát.
   - Đây là việc anh cần sắp xếp, không tự động hoá được.
5. **Bản quyền:** không sao chép giáo trình *HSK Standard Course* hay đề thi thật. Chỉ dùng danh mục chuẩn (dữ liệu công khai) và tự soạn ví dụ.

---

## 7. Các bước triển khai

| Bước | Nội dung | Kết quả kiểm chứng được |
|---|---|---|
| **0** | - Lấy và đối chiếu danh mục chính thức (từ, chữ, ngữ pháp; 2021 + 2025).<br>- Kiểm tra giấy phép Hanzi Writer / Make Me a Hanzi.<br>- Chốt các quyết định ở mục 9. | File dữ liệu gốc trong `src/content/zh/data/`; test đếm số lượng khớp với chuẩn |
| **1** | Nền tảng đa ngôn ngữ:<br>- `language.ts`;<br>- màn chọn ngôn ngữ;<br>- nút chuyển trên header;<br>- route `/zh`;<br>- cột `courses` + đồng bộ;<br>- TTS / nhận dạng giọng theo ngôn ngữ. | Tiếng Anh không đổi hành vi (toàn bộ test cũ xanh); chuyển qua lại được; tiến độ tách riêng |
| **2** | Pinyin & thanh điệu + Hán tự (tô chữ) | Học xong chặng 0 trên điện thoại |
| **3** | HSK 1 đầy đủ: từ vựng + SRS, ngữ pháp, quiz, nghe chép, đọc, hội thoại, lộ trình tuần 1–10 | Đi trọn lộ trình HSK 1; thi thử HSK 1 |
| **4** | HSK 2 | như trên |
| **5** | HSK 3 | như trên |
| **6** | HSK 4 | như trên |
| **7** | AI sửa lỗi nói tiếng Trung, review bảo mật/hiệu năng, deploy | Review sạch mức CRITICAL/HIGH |

- Mỗi bước được commit và deploy riêng, nên có thể mở cho người dùng dùng thử từ Bước 3 (HSK 1).
- Bước 3–6 tốn công nhất. Mỗi cấp gồm hàng trăm đến cả nghìn mục dữ liệu, cần nhiều phiên làm việc.

---

## 8. Rủi ro

| Rủi ro | Giảm thiểu |
|---|---|
| Đề cương 2025 khác số liệu đang thấy trên mạng | Bước 0 đối chiếu bản gốc; dữ liệu gắn mã cấp nên dễ sửa |
| TTS tiếng Trung trên máy người dùng kém hoặc không có | Hiển thị cảnh báo + hướng dẫn cài giọng; cân nhắc file âm thanh dựng sẵn cho phần pinyin |
| Nhận dạng giọng `zh-CN` không chạy trên iOS Safari | Báo rõ; phần luyện nói vẫn có nghe mẫu và tự so |
| Gói build phình vì dữ liệu lớn (hàng nghìn từ) | Tách dữ liệu theo cấp, nạp theo trang (dynamic import) |
| Tên "EngQuiz" không còn hợp | Xem quyết định mục 9 |

---

## 9. Quyết định cần anh chốt

1. **Phạm vi đợt này:** HSK 1–4 (đề xuất) hay đủ HSK 1–6?
2. **Bám chuẩn nào khi lệch:** đề cương thi 2025 (đề xuất) hay GF 0025-2021?
3. **Gói AI:** dùng chung cho cả hai ngôn ngữ (đề xuất) hay bán riêng?
4. **Thương hiệu:** giữ "EngQuiz" và tên miền `eng.quizly.io.vn`, hay đổi tên chung (ví dụ "Quizly Languages") và thêm tên miền `zh.` / `learn.`?
5. **Chữ giản thể** (đề xuất, đúng chuẩn HSK) — có cần thêm phồn thể không?
6. **Người duyệt nội dung bản ngữ:** anh có người soát được không?

### Đã chốt (2026-11-17)
1. Đợt này làm HSK 1–4.
2. Khi hai văn bản lệch nhau thì theo đề cương thi 2025.
3. Gói AI dùng chung cho cả hai ngôn ngữ.
4. Tạm giữ tên EngQuiz và tên miền hiện tại.
5. Chỉ dùng chữ giản thể.
6. Người duyệt nội dung bản ngữ: chưa có, cần trước khi quảng bá.

### Nguồn dữ liệu từ vựng (Bước 0)
- **Đề xuất:** [bezlant/hsk-3-vocabulary](https://github.com/bezlant/hsk-3-vocabulary)
  - Cấp và danh mục từ theo 新版HSK考试大纲 (11/2025): HSK 1–4 cộng dồn 300 / 496 / 988 / 1 978 từ (sau khi gộp trùng).
  - Pinyin lấy từ CC-CEDICT.
  - Giấy phép **CC BY-SA 4.0**: phải ghi công, và file dữ liệu dẫn xuất cũng mang CC BY-SA. Mã nguồn app không bị ảnh hưởng.
- **Chỉ lấy:** chữ giản thể, pinyin, cấp.
- **Tự soạn:** nghĩa tiếng Việt, âm Hán-Việt, câu ví dụ.

### Bước 2 — tiến độ (2026-11-17)
- **Đã xong: pinyin & thanh điệu** (`/zh/pinyin`), gồm 14 bài.

  | Nhóm | Bài |
  |---|---|
  | Thanh điệu | 2 bài: 4 thanh; thanh 2 và thanh 3 |
  | Thanh mẫu | 6 bài |
  | Vận mẫu | 4 bài |
  | Quy tắc | Biến điệu; quy tắc viết |

  - Kèm bảng 21 thanh mẫu bấm để nghe và đường cao độ của từng thanh.
  - Hàm biến điệu `applySandhi` hiện dòng "đọc là" ở chỗ cách đọc khác cách viết.
- **Âm mẫu:** giọng máy `zh-CN` đọc chữ Hán đại diện.
  - Test chặn chữ đa âm và kiểm tra pinyin khớp danh mục HSK.
  - Máy không có giọng tiếng Trung thì hiện hướng dẫn cài giọng.
- **Đã xong: Hán tự phần nền** (`/zh/hanzi`).
  - 8 nét cơ bản, 7 quy tắc thứ tự nét, 46 bộ thủ thường gặp (chữ ví dụ đều thuộc HSK 1–4).
  - Bài kiểm tra bộ thủ: không lấy nghĩa nhiễu từ các bộ cùng nhóm nghĩa.
- **Đã xong: tập viết từng chữ** (`/zh/hanzi/<mã Unicode>`), cho 1 096 chữ của từ vựng HSK 1–4.
  - Mỗi chữ có hoạt hình thứ tự nét, tô theo mẫu và viết không mẫu (máy kiểm tra hướng và thứ tự nét); kèm cách đọc và các từ HSK chứa chữ.
  - Thư viện `hanzi-writer` 3.7.3 (MIT). Dữ liệu nét lấy từ `hanzi-writer-data` 2.0.1 (Arphic Public License), chép sang `public/hanzi` bằng `npm run build:hanzi`, giữ nguyên file `ARPHICPL.TXT`.
  - Chữ đã viết được lưu gọn thành một chuỗi `progress.hanzi` (có schema, gộp hợp giữa các máy, đồng bộ cùng tài khoản).
- **Còn thiếu: bảng chữ chính thức (汉字表).** Hiện danh sách chữ rút từ từ vựng; có bảng chính thức thì thay nguồn trong `src/content/zh/hanzi-chars.ts`.

### Bước 3 — HSK 1 (đang làm)
- **Đã xong: từ vựng HSK 1** (`/zh/vocab`).
  - 300 từ có từ loại, nghĩa tiếng Việt và âm Hán-Việt (`src/content/zh/vocab-vi/hsk1.ts`, do EngQuiz tự soạn).
  - Test kiểm tra: đủ đúng danh sách, số âm Hán-Việt khớp số chữ, cùng một chữ thì cùng âm Hán-Việt ở mọi từ.
  - Ôn thẻ theo hệ hộp Leitner (`src/core/srs.ts`): 6 hộp, khoảng cách 0/1/2/4/8/16 ngày, tối đa 10 từ mới mỗi lượt.
  - Trạng thái ôn lưu gọn thành chuỗi `progress.srs`, đồng bộ theo tài khoản; khi gộp hai máy thì giữ hộp cao hơn.
- **Đã xong: ngữ pháp HSK 1** (`/zh/grammar`): 12 bài phủ các điểm ngữ pháp cấp 1 của GF 0025-2021.
  - Các bài: câu chữ 是; câu hỏi 吗 / chính phản / 呢; đại từ và 的; câu tính từ; đại từ nghi vấn; số và lượng từ; thời gian; câu chữ 有 và phương vị; 在; động từ năng nguyện; phó từ 都 / 也 / 还 / 再 / 只 và 不 / 没有; 了 / 正在…呢 / 吧 / câu cầu khiến.
  - Câu tiếng Trung soạn ở dạng tách từ: pinyin lấy tự động từ danh mục HSK, và test chặn mọi từ vượt cấp (`src/core/zh-sentence.ts`).
  - Bài tập có trắc nghiệm và sắp xếp câu; đạt từ 80% thì tự ghi nhận bài.
- **Còn lại của HSK 1:** nghe chép, bài đọc, hội thoại, lộ trình tuần 3–10, bài thi thử.
