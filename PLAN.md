# EngQuiz — Kế hoạch xây dựng website học ngữ pháp & luyện nghe tiếng Anh

> Phiên bản: 2.0 · Ngày: 2026-11-11
> **Phạm vi đã chốt:**
> 1. Tổ chức theo trình độ **CEFR: A1 → A2 → B1 → B2 → C1 (→ C2)**.
> 2. **Lý thuyết** = ngữ pháp: các thì, cấu trúc câu, câu điều kiện (if), bị động, câu tường thuật, mệnh đề quan hệ...
> 3. **Bộ đề Quiz** xoay quanh ngữ pháp + dạng **Nghe & chép lại (Dictation)**.
>
> Giao diện hiện đại, thân thiện, ưu tiên điện thoại.

---

## Mục lục

1. [Tổng quan sản phẩm](#1-tổng-quan-sản-phẩm)
2. [Chương trình ngữ pháp theo cấp độ](#2-chương-trình-ngữ-pháp-theo-cấp-độ)
3. [Thiết kế trang lý thuyết](#3-thiết-kế-trang-lý-thuyết)
4. [Hệ thống Quiz ngữ pháp](#4-hệ-thống-quiz-ngữ-pháp)
5. [Nghe & chép lại (Dictation)](#5-nghe--chép-lại-dictation)
6. [Tiến độ, ôn tập & động lực](#6-tiến-độ-ôn-tập--động-lực)
7. [Thiết kế UI/UX](#7-thiết-kế-uiux)
8. [Kiến trúc kỹ thuật](#8-kiến-trúc-kỹ-thuật)
9. [Mô hình dữ liệu](#9-mô-hình-dữ-liệu)
10. [Kế hoạch nội dung](#10-kế-hoạch-nội-dung)
11. [Lộ trình triển khai](#11-lộ-trình-triển-khai)
12. [Cấu trúc thư mục](#12-cấu-trúc-thư-mục)
13. [Chất lượng & hiệu năng](#13-chất-lượng--hiệu-năng)
14. [KPI & rủi ro](#14-kpi--rủi-ro)
15. [Quyết định còn mở](#15-quyết-định-còn-mở)

---

## 1. Tổng quan sản phẩm

**Một câu:** *Học một chủ điểm ngữ pháp → làm quiz ngay → nghe & chép lại câu dùng đúng chủ điểm đó → ôn lại đúng lúc sắp quên.*

### Ba trụ cột

| Trụ cột | Người học làm gì | Kết quả |
|---|---|---|
| 📘 **Lý thuyết** | Đọc bài ngữ pháp ngắn gọn, có công thức, ví dụ, lỗi hay gặp | Hiểu quy tắc |
| ✍️ **Quiz ngữ pháp** | Làm bộ đề 10–40 câu, 7 dạng bài | Áp dụng quy tắc, phát hiện điểm yếu |
| 🎧 **Nghe & chép** | Nghe câu/đoạn, gõ lại chính xác | Nghe tốt hơn, chính tả chuẩn hơn, quen cấu trúc ngữ pháp trong lời nói thật |

**Điểm khác biệt:** ba trụ cột **liên kết với nhau theo từng chủ điểm**. Ví dụ chủ điểm *"Câu điều kiện loại 2"* có trang lý thuyết, bộ quiz và bộ nghe–chép gồm các câu loại 2. Người học luyện cùng một cấu trúc qua cả mắt, tay và tai.

### Người dùng mục tiêu
- Học sinh, sinh viên cần chắc ngữ pháp (nền tảng cho mọi kỳ thi).
- Người mất gốc muốn học lại có hệ thống từ A1.
- Người muốn cải thiện kỹ năng nghe và chính tả.

### Luồng sử dụng chính

```
Đăng ký → Chọn mục tiêu & thời gian/ngày → Bài kiểm tra xếp lớp (15–20 câu)
   → Gợi ý cấp độ bắt đầu (vd: A2)
   → Bản đồ chủ điểm của cấp đó
        → Chủ điểm "Past simple"
             1. Đọc lý thuyết (3–5 phút)
             2. Quiz nhanh 10 câu
             3. Nghe & chép 5 câu
             4. Hoàn thành → mở chủ điểm tiếp theo, đưa câu sai vào lịch ôn
   → Bài kiểm tra cuối cấp (≥ 70% → lên cấp)
```

---

## 2. Chương trình ngữ pháp theo cấp độ

Khung tham khảo từ English Grammar Profile và các giáo trình phổ biến, đã sắp lại cho người Việt học. Mỗi dòng là **một chủ điểm (Grammar Topic)**, tương ứng với một trang lý thuyết, một bộ quiz và một bộ nghe–chép.

Danh mục (category) dùng để lọc: `TENSE` các thì · `MODAL` động từ khuyết thiếu · `COND` câu điều kiện · `PASSIVE` bị động · `REPORTED` tường thuật · `RELATIVE` mệnh đề quan hệ · `WORD` từ loại/mạo từ/đại từ · `STRUCT` cấu trúc câu · `CLAUSE` liên từ & mệnh đề.

### 🟢 A1 — Sơ cấp (16 chủ điểm)

| # | Chủ điểm | Danh mục |
|---|---|---|
| 1 | Động từ *to be* (am/is/are) — khẳng định, phủ định, nghi vấn | TENSE |
| 2 | Đại từ nhân xưng chủ ngữ & tân ngữ (I/me, he/him...) | WORD |
| 3 | Tính từ sở hữu & sở hữu cách *'s* | WORD |
| 4 | Mạo từ *a / an / the* (cơ bản) | WORD |
| 5 | Danh từ số nhiều (quy tắc & bất quy tắc) | WORD |
| 6 | *this / that / these / those* | WORD |
| 7 | *There is / There are* | STRUCT |
| 8 | **Thì hiện tại đơn** (Present simple) | TENSE |
| 9 | Trạng từ chỉ tần suất (always, usually, never...) | WORD |
| 10 | **Thì hiện tại tiếp diễn** (Present continuous) | TENSE |
| 11 | Hiện tại đơn vs hiện tại tiếp diễn | TENSE |
| 12 | *can / can't* (khả năng, xin phép) | MODAL |
| 13 | Câu mệnh lệnh (Imperatives) | STRUCT |
| 14 | Giới từ thời gian & nơi chốn *in / on / at* | WORD |
| 15 | Từ để hỏi (What, Where, When, Who, How...) | STRUCT |
| 16 | Danh từ đếm được/không đếm được, *some / any* | WORD |

### 🔵 A2 — Sơ trung cấp (18 chủ điểm)

| # | Chủ điểm | Danh mục |
|---|---|---|
| 1 | **Quá khứ đơn** của *to be* (was/were) | TENSE |
| 2 | **Thì quá khứ đơn** — động từ có quy tắc & bất quy tắc | TENSE |
| 3 | **Thì quá khứ tiếp diễn** | TENSE |
| 4 | Quá khứ đơn vs quá khứ tiếp diễn (*when / while*) | TENSE |
| 5 | **Tương lai**: *will* vs *be going to* | TENSE |
| 6 | Hiện tại tiếp diễn diễn tả tương lai (kế hoạch) | TENSE |
| 7 | **Thì hiện tại hoàn thành** (ever/never, just/already/yet) | TENSE |
| 8 | So sánh hơn & so sánh nhất | STRUCT |
| 9 | So sánh bằng *as ... as* | STRUCT |
| 10 | Trạng từ chỉ cách thức (quickly, well...) | WORD |
| 11 | *much / many / a lot of / a few / a little* | WORD |
| 12 | *must / have to / should* | MODAL |
| 13 | *could* (khả năng trong quá khứ), *would like* | MODAL |
| 14 | Động từ + *to V* / *V-ing* (cơ bản: want to, enjoy doing) | STRUCT |
| 15 | Liên từ *and / but / or / because / so* | CLAUSE |
| 16 | **Câu điều kiện loại 0** | COND |
| 17 | **Câu điều kiện loại 1** | COND |
| 18 | Đại từ sở hữu (mine, yours...) & đại từ phản thân | WORD |

### 🟣 B1 — Trung cấp (18 chủ điểm)

| # | Chủ điểm | Danh mục |
|---|---|---|
| 1 | Hiện tại hoàn thành vs quá khứ đơn | TENSE |
| 2 | **Thì hiện tại hoàn thành tiếp diễn** (for/since) | TENSE |
| 3 | **Thì quá khứ hoàn thành** | TENSE |
| 4 | *used to / would* (thói quen trong quá khứ) | STRUCT |
| 5 | **Câu điều kiện loại 2** | COND |
| 6 | *unless*, *as long as*, *in case* | COND |
| 7 | **Câu bị động** — hiện tại đơn & quá khứ đơn | PASSIVE |
| 8 | Câu bị động — các thì khác (tiếp diễn, hoàn thành, tương lai) | PASSIVE |
| 9 | **Mệnh đề quan hệ xác định** (who, which, that, where, whose) | RELATIVE |
| 10 | **Câu tường thuật** — câu kể (lùi thì) | REPORTED |
| 11 | Động từ khuyết thiếu chỉ suy đoán hiện tại (*must / might / can't*) | MODAL |
| 12 | Gerund vs To-infinitive (remember/stop/try + to V/V-ing) | STRUCT |
| 13 | *too / enough* | STRUCT |
| 14 | *so / such ... that* | STRUCT |
| 15 | Câu hỏi đuôi (Question tags) | STRUCT |
| 16 | Câu hỏi gián tiếp (Can you tell me where...?) | STRUCT |
| 17 | *wish* + quá khứ đơn (ước ở hiện tại) | COND |
| 18 | Cụm động từ (Phrasal verbs) thông dụng | WORD |

### 🟠 B2 — Trung cao cấp (17 chủ điểm)

| # | Chủ điểm | Danh mục |
|---|---|---|
| 1 | **Thì tương lai tiếp diễn & tương lai hoàn thành** | TENSE |
| 2 | **Thì quá khứ hoàn thành tiếp diễn** | TENSE |
| 3 | Tổng ôn **12 thì** & phối hợp thì | TENSE |
| 4 | **Câu điều kiện loại 3** | COND |
| 5 | **Câu điều kiện hỗn hợp** (Mixed conditionals) | COND |
| 6 | *wish / if only* + quá khứ hoàn thành; *wish + would* | COND |
| 7 | Bị động với động từ khuyết thiếu; *It is said that... / He is said to...* | PASSIVE |
| 8 | Thể truyền khiến: *have / get something done* | PASSIVE |
| 9 | Câu tường thuật — câu hỏi, mệnh lệnh, động từ tường thuật (advise, deny, suggest...) | REPORTED |
| 10 | **Mệnh đề quan hệ không xác định** & dấu phẩy | RELATIVE |
| 11 | Rút gọn mệnh đề quan hệ (V-ing / V3 / to V) | RELATIVE |
| 12 | Suy đoán trong quá khứ: *must have / might have / can't have* | MODAL |
| 13 | *should have / could have / needn't have* | MODAL |
| 14 | *used to / be used to / get used to* | STRUCT |
| 15 | *I'd rather / It's time / had better* | STRUCT |
| 16 | Liên từ tương phản: *although / despite / in spite of / whereas / however* | CLAUSE |
| 17 | Mệnh đề phân từ (Participle clauses) | CLAUSE |

### 🔴 C1 — Cao cấp (12 chủ điểm)

| # | Chủ điểm | Danh mục |
|---|---|---|
| 1 | **Đảo ngữ** với trạng từ phủ định (*Never have I..., Not only..., Hardly... when*) | STRUCT |
| 2 | **Đảo ngữ trong câu điều kiện** (*Had I known..., Were I..., Should you...*) | COND |
| 3 | Điều kiện nâng cao: *but for, provided that, supposing, were to* | COND |
| 4 | **Câu chẻ** (Cleft sentences): *It is ... that...*, *What I need is...* | STRUCT |
| 5 | Thể giả định (Subjunctive): *suggest/insist that he go* | STRUCT |
| 6 | Cấu trúc nhấn mạnh (*do/does/did*, *the very*, *at all*) | STRUCT |
| 7 | Danh từ hóa (Nominalisation) trong văn viết học thuật | STRUCT |
| 8 | Tỉnh lược & thay thế (*so, not, do so, one*) | STRUCT |
| 9 | Tương lai trong quá khứ (*was going to, would, was about to*) | TENSE |
| 10 | Mạo từ nâng cao & danh từ trừu tượng | WORD |
| 11 | Từ nối học thuật (*notwithstanding, insofar as, whereby*) | CLAUSE |
| 12 | Bị động nâng cao (bị động với V-ing/to V, *get* passive) | PASSIVE |

### ⚫ C2 — Thành thạo (giai đoạn sau)
Tập trung vào sắc thái nghĩa, văn phong (trang trọng/thân mật) và các cấu trúc hiếm. Nội dung sẽ làm khi A1–C1 đã ổn định.

> **Tổng:** 81 chủ điểm cho A1–C1.

### Các trang "Tổng hợp" (chủ đề xuyên cấp độ)
Ngoài lộ trình theo cấp, có các trang tổng hợp để tra cứu nhanh:
- **12 thì tiếng Anh** — bảng so sánh công thức, dấu hiệu nhận biết, dòng thời gian (timeline) trực quan.
- **Câu điều kiện (If)** — loại 0, 1, 2, 3, hỗn hợp, *unless*, đảo ngữ, gom về một bảng.
- **Câu bị động** — bảng chuyển đổi theo tất cả các thì.
- **Câu tường thuật** — bảng lùi thì & đổi trạng từ (now → then, tomorrow → the next day...).
- **Động từ bất quy tắc** — bảng tra có audio, kèm chế độ luyện riêng.

---

## 3. Thiết kế trang lý thuyết

### 3.1. Khung chuẩn cho mỗi chủ điểm

Mọi trang lý thuyết dùng **cùng một khung** để người học quen mắt:

| Khối | Nội dung | Ví dụ (Câu điều kiện loại 2) |
|---|---|---|
| 1. **Tóm tắt 1 câu** | Dùng khi nào | Giả định điều không có thật / khó xảy ra ở hiện tại |
| 2. **Công thức** | Bảng (+) / (−) / (?) | *If + S + V2/V-ed, S + would + V* |
| 3. **Cách dùng** | 2–4 cách dùng, mỗi cách 1–2 ví dụ | Giả định trái hiện tại; lời khuyên *If I were you...* |
| 4. **Dấu hiệu nhận biết** | Từ khóa, ngữ cảnh | — |
| 5. **Ví dụ có audio** | 4–6 câu, bấm để nghe, có nghĩa tiếng Việt | *If I had more time, I would learn French.* 🔊 |
| 6. **⚠️ Lỗi người Việt hay mắc** | Sai → đúng + lý do | ✗ *If I would have...* → ✓ *If I had...* |
| 7. **So sánh dễ nhầm** | Bảng đối chiếu với chủ điểm gần | Loại 1 vs loại 2 |
| 8. **Kiểm tra nhanh** | 3–5 câu ngay trong trang | — |
| 9. **CTA** | "Làm Quiz 10 câu" · "Nghe & chép 5 câu" | — |

### 3.2. Thành phần trực quan
- **Timeline cho các thì:** thanh thời gian (Quá khứ — Hiện tại — Tương lai) có điểm/đoạn tô màu để thể hiện hành động. Ví dụ thì hiện tại hoàn thành vẽ một đoạn bắt đầu ở quá khứ và kéo dài đến hiện tại.
- **Công thức tô màu theo thành phần:** chủ ngữ một màu, trợ động từ một màu, động từ chính một màu. Màu được dùng nhất quán trên toàn site, kể cả trong giải thích đáp án quiz.
- **Hộp "Mẹo nhớ"** (tip box) và **hộp "Cảnh báo"**.
- **Song ngữ:** giải thích bằng tiếng Việt; ví dụ bằng tiếng Anh, có thể bật/tắt dòng dịch.

### 3.3. Cách lưu nội dung
Nội dung lý thuyết lưu dạng **khối có cấu trúc (JSON blocks)**, không phải HTML tự do, ví dụ:
```json
[
  { "type": "summary", "text": "..." },
  { "type": "formula", "rows": [{ "kind": "positive", "parts": [...] }] },
  { "type": "usage", "title": "...", "examples": [{ "en": "...", "vi": "...", "audio": "..." }] },
  { "type": "timeline", "spans": [...] },
  { "type": "mistake", "wrong": "...", "right": "...", "why": "..." },
  { "type": "quickcheck", "questionIds": ["..."] }
]
```
→ Giao diện render đẹp và nhất quán, trang quản trị (CMS) soạn bằng form, dễ tái sử dụng cho app di động sau này.

---

## 4. Hệ thống Quiz ngữ pháp

### 4.1. Các dạng câu hỏi

| # | Dạng | Mô tả | Ví dụ | Chấm |
|---|---|---|---|---|
| 1 | **Trắc nghiệm** (Multiple choice) | Chọn 1 trong 4 | *She ___ to school every day.* A. go B. goes C. going D. gone | Tự động |
| 2 | **Chia động từ** (Verb form) | Gõ dạng đúng của động từ trong ngoặc | *If I (know) ___, I would tell you.* → **knew** | Tự động, chấp nhận nhiều đáp án |
| 3 | **Điền từ** (Gap fill) | Gõ 1 từ (giới từ, mạo từ, từ để hỏi...) | *I was born ___ 2005.* → **in** | Tự động |
| 4 | **Tìm lỗi sai** (Error identification) | Bấm vào phần gạch chân sai | *He **have** lived here **since** 2010.* | Tự động |
| 5 | **Viết lại câu** (Sentence transformation) | Viết lại câu không đổi nghĩa | *I don't have a car, so I can't drive to work.* → *If I had a car, I could drive to work.* | Tự động theo danh sách đáp án chấp nhận + chuẩn hóa; AI chấm khi đáp án lạ (giai đoạn 2) |
| 6 | **Sắp xếp từ** (Word order) | Kéo thả các từ thành câu đúng | *never / I / have / Paris / been / to* | Tự động |
| 7 | **Nối mệnh đề** (Matching) | Nối vế *If...* với vế chính phù hợp | — | Tự động |

> Dạng 2, 3, 5 là **dạng gõ chữ**, dùng chung bộ chuẩn hóa văn bản với Dictation (mục 5.4): bỏ qua hoa/thường, khoảng trắng thừa, dấu nháy cong/thẳng, chấp nhận viết tắt (*didn't* = *did not*).

### 4.2. Cấu trúc một câu hỏi

Mỗi câu hỏi gắn với:
- `grammarTopicId`: thuộc chủ điểm nào (bắt buộc).
- `level`: A1–C1.
- `difficulty`: 1 (dễ) — 5 (khó).
- `explanationVi`: giải thích **vì sao đúng và vì sao các phương án khác sai**.
- `tags`: ví dụ `signal-word:since`, `irregular-verb`.

### 4.3. Các loại bộ đề (Quiz Set)

| Loại bộ đề | Nội dung | Số câu | Cách tạo |
|---|---|---|---|
| **Theo chủ điểm** | 1 chủ điểm (vd: "Câu bị động — hiện tại & quá khứ") | 10 / 20 | Sinh ngẫu nhiên từ ngân hàng theo chủ điểm, trộn dạng câu |
| **Theo danh mục** | Gộp các chủ điểm cùng loại (vd: "Tất cả câu điều kiện A2–B2") | 20 / 30 | Sinh ngẫu nhiên, cân bằng giữa các chủ điểm |
| **Tổng hợp cấp độ** | Toàn bộ chủ điểm của 1 cấp (vd: "Kiểm tra cuối A2") | 40 | Bộ đề cố định do người soạn chọn |
| **Ôn điểm yếu** | Câu đã sai + câu cùng chủ điểm/tag | 10–20 | Sinh theo dữ liệu cá nhân |
| **Bộ đề biên soạn sẵn** | Đề do giáo viên soạn theo chủ đề | Tùy | CMS |

### 4.4. Chế độ làm bài

| | **Luyện tập** | **Kiểm tra** |
|---|---|---|
| Phản hồi | Ngay sau mỗi câu (đúng/sai + giải thích) | Sau khi nộp toàn bài |
| Thời gian | Không giới hạn | Đếm ngược (vd 40 câu / 30 phút) |
| Gợi ý | Có (link sang lý thuyết) | Không |
| Làm lại câu sai | Có, cuối bộ đề | Sau khi xem kết quả |
| Tính lên cấp | Không | Có (bài cuối cấp) |

### 4.5. Màn hình kết quả
- Điểm lớn (vd **17/20**), thời gian làm bài, XP nhận được.
- **Điểm theo chủ điểm** (nếu là bộ đề tổng hợp): thanh màu cho biết mạnh/yếu ở đâu.
- Danh sách câu sai: đáp án của bạn → đáp án đúng → giải thích → nút "Xem lý thuyết".
- Nút: "Làm lại câu sai" · "Ôn điểm yếu" · "Chủ điểm tiếp theo".

---

## 5. Nghe & chép lại (Dictation)

### 5.1. Mục tiêu
Luyện **nghe chính xác từng từ**, chính tả và nhận biết **cấu trúc ngữ pháp trong lời nói tự nhiên** (dạng rút gọn, nối âm, âm cuối *-ed / -s*, *would / 'd*...).

### 5.2. Mức độ theo CEFR

| Cấp | Độ dài | Tốc độ mặc định | Đặc điểm |
|---|---|---|---|
| A1 | 1 câu, 4–8 từ | 0.8x, rõ ràng | Từ vựng cơ bản, hiện tại đơn/tiếp diễn |
| A2 | 1 câu, 8–12 từ | 0.9x | Quá khứ đơn (nghe đuôi *-ed*), so sánh |
| B1 | 1–2 câu, 12–20 từ | 1.0x | Câu phức, mệnh đề quan hệ, có nối âm |
| B2 | Đoạn 2–4 câu | 1.0x, tự nhiên | Dạng rút gọn (*would've, I'd*), điều kiện loại 3 |
| C1 | Đoạn 4–6 câu | 1.0–1.1x | Đảo ngữ, câu chẻ, nhiều giọng (Anh/Mỹ/Úc) |

### 5.3. Các chế độ chép

| Chế độ | Mô tả | Phù hợp |
|---|---|---|
| **Điền từ còn thiếu** (Gap dictation) | Hiện sẵn câu, chỉ ẩn 2–4 từ, thường là phần ngữ pháp trọng tâm | A1–A2, người mới |
| **Chép từng câu** | Nghe 1 câu → gõ → kiểm tra → câu tiếp | Mặc định |
| **Chép cả đoạn** | Nghe cả đoạn (có thể tua từng câu) → gõ toàn bộ | B2–C1 |

### 5.4. Trình phát & thao tác

- Nút **Phát / Tạm dừng**, **Phát lại câu**, **Lùi 3 giây**.
- Tốc độ: **0.75x · 1x · 1.25x**.
- Giới hạn số lần nghe: không giới hạn ở chế độ luyện tập; tối đa 3 lần ở chế độ kiểm tra.
- **Phím tắt** (không xung đột với ô nhập): `Ctrl + Space` phát/dừng · `Ctrl + ←` lùi 3s · `Ctrl + Enter` kiểm tra.
- **Gợi ý** (bị trừ điểm): hiện số từ của câu (`_ _ _ _ _`), hiện chữ cái đầu mỗi từ, hoặc mở 1 từ.
- Transcript đầy đủ + nghĩa tiếng Việt chỉ hiện **sau khi nộp**.

### 5.5. Chấm điểm (phần kỹ thuật quan trọng nhất)

**Bước 1 — Chuẩn hóa** cả đáp án và bài làm:
- Chuyển về chữ thường, gộp khoảng trắng.
- Đồng nhất dấu nháy (`’` → `'`), bỏ dấu câu (mặc định; có tùy chọn "chấm cả dấu câu" cho C1).
- Chấp nhận các biến thể tương đương: viết tắt (*don't* ⇄ *do not*, *I'm* ⇄ *I am*), số (*5* ⇄ *five*), chính tả Anh–Mỹ (*colour* ⇄ *color*).
- Danh sách biến thể khác do người soạn bổ sung cho từng câu (`acceptedVariants`).

**Bước 2 — So khớp theo từ:** dùng thuật toán **căn chỉnh chuỗi (Levenshtein/LCS ở mức từ)** để biết từng từ thuộc loại nào:

| Trạng thái | Hiển thị | Ví dụ |
|---|---|---|
| ✅ Đúng | Chữ xanh | — |
| 🟡 Gần đúng (sai 1 ký tự với từ ≥ 5 chữ cái) | Chữ vàng + từ đúng | *recieve* → *receive* |
| ❌ Sai | Chữ đỏ gạch + từ đúng bên trên | *walk* → **walked** |
| ➖ Thiếu | Ô cam chèn từ còn thiếu | *I ___ been* → **have** |
| ➕ Thừa | Chữ xám gạch ngang | — |

**Bước 3 — Tính điểm:**
`Điểm = (số từ đúng + 0.5 × số từ gần đúng − 0.25 × số gợi ý đã dùng) / tổng số từ`, giới hạn trong 0–100%.

**Bước 4 — Phản hồi gắn ngữ pháp:** nếu chỗ sai thuộc phần trọng tâm của chủ điểm (vd thiếu đuôi *-ed*, nghe nhầm *would* thành *will*) thì hiện ghi chú: *"Bạn bỏ sót đuôi -ed của thì quá khứ đơn → xem lại lý thuyết"*.

### 5.6. Nguồn audio
- **Tạo bằng TTS** (Azure Speech / Google / ElevenLabs) với 4–6 giọng (Anh–Mỹ, nam–nữ). Audio **tạo sẵn một lần khi xuất bản** và lưu trên CDN, không gọi TTS mỗi lần nghe.
- Lưu sẵn cả bản tốc độ 0.75x để tránh méo tiếng khi trình duyệt tự đổi tốc độ (tùy chọn).
- Giai đoạn sau: thu âm người thật cho các bài B2–C1 để có ngữ điệu tự nhiên.

---

## 6. Tiến độ, ôn tập & động lực

### 6.1. Tiến độ
- **Bản đồ chủ điểm** cho mỗi cấp: mỗi chủ điểm là một ô có 3 trạng thái nhỏ (📘 đã đọc · ✍️ quiz ≥ 80% · 🎧 chép ≥ 80%). Đủ cả 3 thì ô được tô đầy và đánh dấu "Hoàn thành".
- **Mức thành thạo (mastery) mỗi chủ điểm**: 0–100%, tính từ kết quả các lần làm gần nhất (lần gần đây có trọng số cao hơn).
- **Kiểm tra cuối cấp:** đạt ≥ 70% để lên cấp và nhận huy hiệu cấp độ.

### 6.2. Ôn tập ngắt quãng (SRS)
- Câu quiz làm sai và câu chép dưới 80% được **đưa vào hàng ôn tập**.
- Lịch ôn dùng **SM-2** (sau có thể nâng lên FSRS): ôn lại sau 1 ngày → 3 ngày → 7 ngày → ...
- Dashboard hiển thị: *"Hôm nay cần ôn: 12 câu"*.
- Khi ôn, hệ thống có thể đưa **câu khác cùng chủ điểm/tag** thay vì đúng câu cũ, tránh người học chỉ nhớ đáp án.

### 6.3. Động lực (Gamification nhẹ)
- **XP**: hoàn thành bài, độ chính xác, thưởng streak.
- **Streak**: số ngày học liên tiếp, tính theo múi giờ người dùng, có "đóng băng streak".
- **Mục tiêu ngày**: 10 / 20 / 30 phút.
- **Huy hiệu**: "Bậc thầy 12 thì", "Vua câu điều kiện", "Đôi tai vàng" (100 câu chép đúng 100%)...
- **Bảng xếp hạng tuần** (giai đoạn 2).

---

## 7. Thiết kế UI/UX

### 7.1. Phong cách
- **Hiện đại, sạch, thoáng**: bo góc lớn (12–16px), đổ bóng nhẹ, nhiều khoảng trắng.
- **Thân thiện**: màu tươi, minh họa phẳng, một **linh vật** xuất hiện ở onboarding, màn hình chúc mừng và trạng thái trống.
- **Mobile-first**: thiết kế cho màn hình 375px trước.
- **Vi tương tác ngắn (< 400ms)**: hiệu ứng đúng/sai, confetti khi xong bộ đề; tôn trọng `prefers-reduced-motion`.

### 7.2. Design tokens

| Token | Sáng | Tối | Dùng cho |
|---|---|---|---|
| `--primary` | `#4F46E5` | `#818CF8` | Nút chính, liên kết |
| `--success` | `#16A34A` | `#4ADE80` | Đúng |
| `--danger` | `#DC2626` | `#F87171` | Sai |
| `--warning` | `#F59E0B` | `#FBBF24` | Gần đúng, streak |
| `--bg` | `#F8FAFC` | `#0F172A` | Nền |
| `--surface` | `#FFFFFF` | `#1E293B` | Card |
| `--text` | `#0F172A` | `#F1F5F9` | Chữ |

**Màu cấp độ:** A1 🟢 xanh lá · A2 🔵 xanh dương · B1 🟣 tím · B2 🟠 cam · C1 🔴 đỏ.
**Màu thành phần câu** (dùng trong công thức & giải thích): Chủ ngữ — xanh dương · Trợ động từ — tím · Động từ chính — xanh lá · Tân ngữ/bổ ngữ — xám.
**Font:** *Be Vietnam Pro* (giao diện, tiếng Việt) · *Nunito* hoặc *Inter* (nội dung tiếng Anh) · *JetBrains Mono* cho ô chép chính tả (dễ thấy lỗi từng ký tự).

### 7.3. Điều hướng
- **Mobile — thanh tab dưới:** 🏠 Trang chủ · 📘 Lý thuyết · ✍️ Quiz · 🎧 Nghe chép · 👤 Tôi
- **Desktop:** sidebar trái thu gọn được, cùng 5 mục.

### 7.4. Các màn hình chính

| # | Màn hình | Điểm nhấn thiết kế |
|---|---|---|
| 1 | **Landing** | Hero + CTA "Kiểm tra trình độ miễn phí", demo một câu quiz & một câu nghe–chép tương tác ngay trên trang |
| 2 | **Onboarding + xếp lớp** | 1 câu hỏi/màn hình, thanh tiến độ, kết quả "Bạn đang ở A2" kèm linh vật |
| 3 | **Trang chủ** | Thẻ "Tiếp tục: Past continuous" to nhất; streak; vòng mục tiêu ngày; "Cần ôn: 12 câu"; mastery theo cấp |
| 4 | **Bản đồ cấp độ** | Lưới/đường các chủ điểm, mỗi ô có 3 chấm trạng thái (đọc – quiz – chép) |
| 5 | **Trang lý thuyết** | Khung 9 khối (mục 3), mục lục dính (sticky) trên desktop, nút CTA cố định dưới trên mobile |
| 6 | **Thư viện ngữ pháp** | Lọc theo cấp/danh mục, tìm kiếm ("if", "bị động"...) |
| 7 | **Màn hình làm quiz** | Toàn màn hình, thanh tiến độ trên cùng, nút "Kiểm tra" cố định dưới (vùng ngón cái), sheet phản hồi trượt lên |
| 8 | **Màn hình nghe–chép** | Trình phát lớn ở giữa, ô nhập font monospace, kết quả hiển thị so khớp màu từng từ |
| 9 | **Kết quả** | Điểm lớn, điểm theo chủ điểm, danh sách câu sai có giải thích |
| 10 | **Hồ sơ** | Heatmap ngày học, huy hiệu, thống kê chủ điểm mạnh/yếu |

### 7.5. Khả năng tiếp cận
- Tương phản tối thiểu WCAG AA.
- Làm quiz bằng bàn phím: `1–4` chọn đáp án, `Enter` kiểm tra.
- Không thể hiện đúng/sai **chỉ bằng màu**, luôn kèm icon ✓ / ✗ / ~.
- Nội dung đọc tối thiểu 16–18px, line-height 1.6.

---

## 8. Kiến trúc kỹ thuật

### 8.1. Tech stack

| Lớp | Lựa chọn | Lý do |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SSG cho trang lý thuyết (tốt cho SEO, người dùng tìm "câu điều kiện loại 2" trên Google), server actions cho phần học |
| UI | **Tailwind CSS + shadcn/ui + Framer Motion** | Hiện đại, nhanh, dễ làm chế độ sáng/tối |
| Kéo thả | dnd-kit | Dạng sắp xếp từ, nối mệnh đề; hỗ trợ cảm ứng & bàn phím |
| Audio | HTML5 Audio + Howler.js (tùy chọn) | Điều khiển tốc độ, tua |
| State | TanStack Query + Zustand | Cache dữ liệu server; trạng thái phiên làm bài |
| Validate | **Zod** | Schema cho từng dạng câu hỏi & khối lý thuyết |
| DB | **PostgreSQL + Prisma** | |
| Auth | Auth.js (email + Google) | |
| Lưu file | Cloudflare R2 / S3 + CDN | Audio, ảnh |
| TTS | Azure Speech / Google TTS | Tạo audio cho ví dụ & nghe–chép |
| Hạ tầng | Vercel + Neon (Postgres) | Ít vận hành, chi phí thấp lúc đầu |
| Giám sát | Sentry + PostHog | Lỗi & hành vi người dùng |
| Test | Vitest, Testing Library, Playwright | |
| CI/CD | GitHub Actions | Lint → test → build → preview deploy |

### 8.2. Sơ đồ

```
Trình duyệt (PWA)
     │
     ▼
Next.js ── SSG: trang lý thuyết, thư viện ngữ pháp (cache CDN)
        ── Server actions / API: quiz, chấm điểm, tiến độ, SRS
     │                     │
     ▼                     ▼
PostgreSQL (Prisma)    R2/S3 + CDN (audio .mp3/.opus, ảnh)
                           ▲
                           │ (khi xuất bản nội dung)
                    Script tạo audio TTS
```

### 8.3. Quyết định kỹ thuật quan trọng
- **Logic chấm điểm nằm trong `packages/core`** (TypeScript thuần): chuẩn hóa văn bản, so khớp từ cho dictation, chấm từng dạng câu, SM-2, tính mastery. Dùng được cả ở client (phản hồi tức thì khi luyện tập) và server (chấm chính thức khi kiểm tra).
- **Chế độ kiểm tra:** không gửi đáp án xuống trình duyệt, chấm ở server.
- **Trang lý thuyết được tạo tĩnh (SSG) + cập nhật lại khi CMS xuất bản (ISR/revalidate)** → tải rất nhanh và tốt cho SEO.
- **Audio tạo sẵn**, không gọi TTS trực tiếp từ trình duyệt.

---

## 9. Mô hình dữ liệu

```
User(id, email, name, avatar, role[student|admin|editor], currentLevel,
     dailyGoalMinutes, xp, streakCount, lastActiveDate, timezone, createdAt)

Level(code[A1|A2|B1|B2|C1|C2], name, order, color)

GrammarTopic(id, levelCode, slug, title, titleEn, category, order,
             summary, theoryBlocks(JSON), status[draft|review|published])
TopicPrerequisite(topicId, requiresTopicId)          -- vd: Loại 2 cần Loại 1

Question(id, grammarTopicId, type[mcq|verb_form|gap_fill|error_id|
         transform|word_order|matching], difficulty(1-5),
         prompt(JSON), options(JSON)?, answer(JSON), acceptedAnswers[],
         explanationVi, tags[], status)

DictationItem(id, grammarTopicId?, levelCode, mode[gap|sentence|passage],
              text, translationVi, gapIndexes[]?, acceptedVariants(JSON),
              audioUrl, audioSlowUrl?, voice, durationMs, status)

QuizSet(id, title, kind[topic|category|level_test|custom], levelCode?,
        grammarTopicId?, category?, isFixed, questionCount, timeLimitSec?)
QuizSetQuestion(quizSetId, questionId, order)        -- chỉ cho bộ đề cố định

Attempt(id, userId, kind[quiz|dictation|placement|level_test],
        quizSetId?, mode[practice|test], startedAt, submittedAt,
        score, maxScore, durationSec)
AttemptAnswer(attemptId, questionId?, dictationItemId?, response(JSON),
              isCorrect, scoreRatio(0-1), diff(JSON)?, hintsUsed, timeSpentMs)

UserTopicProgress(userId, grammarTopicId, theoryRead, quizBest, dictationBest,
                  mastery(0-100), completedAt?)
ReviewItem(userId, questionId?|dictationItemId?, ease, intervalDays,
           repetitions, dueAt, lapses)               -- SRS

DailyActivity(userId, date, xp, minutes, itemsDone)
Badge(id, code, name, icon, rule(JSON)) · UserBadge(userId, badgeId, earnedAt)
ContentReport(id, userId, questionId?|dictationItemId?, reason, status)
```

**Ghi chú:**
- `prompt / options / answer` dạng JSON, mỗi `type` có một Zod schema riêng → thêm dạng câu mới không phải đổi cấu trúc bảng.
- `AttemptAnswer.diff` lưu kết quả so khớp từng từ của dictation → hiển thị lại lịch sử và thống kê các từ hay nghe sai.

---

## 10. Kế hoạch nội dung

### 10.1. Số lượng mục tiêu

| Cấp | Chủ điểm | Câu quiz (≥ 30/chủ điểm) | Câu nghe–chép (≥ 10/chủ điểm) | Bài kiểm tra cuối cấp |
|---|---|---|---|---|
| A1 | 16 | ~500 | ~160 | 2 đề × 40 câu |
| A2 | 18 | ~550 | ~180 | 2 đề |
| B1 | 18 | ~550 | ~180 | 2 đề |
| B2 | 17 | ~520 | ~170 | 2 đề |
| C1 | 12 | ~360 | ~120 | 2 đề |
| **Tổng** | **81** | **~2.500** | **~800** | **10 đề** |

Đợt 1 (MVP) chỉ cần **A1 + A2 + B1** (52 chủ điểm, ~1.600 câu quiz, ~520 câu nghe–chép).

### 10.2. Quy trình sản xuất
1. **Soạn nháp:** giáo viên soạn, hoặc AI tạo nháp theo template (chủ điểm + dạng câu + cấp độ + yêu cầu giải thích tiếng Việt).
2. **Kiểm tra tự động:** đúng schema, có giải thích, đáp án không trùng phương án nhiễu, câu nghe–chép đúng độ dài theo cấp.
3. **Duyệt bởi người:** bắt buộc, vì AI có thể sai ngữ pháp ở các trường hợp tinh tế.
4. **Xuất bản:** tự động tạo audio TTS cho ví dụ và câu nghe–chép.
5. **Theo dõi:** tỉ lệ làm đúng từng câu; câu có tỉ lệ đúng < 20% hoặc > 98%, hoặc bị báo lỗi, sẽ được đưa lại để duyệt.

### 10.3. Nhập liệu hàng loạt
CMS hỗ trợ **import CSV/Excel** theo template:
```
topic_slug, type, difficulty, prompt, options, answer, accepted_answers, explanation_vi, tags
present-simple, mcq, 1, "She ___ to school.", "go|goes|going|gone", "goes", "", "Chủ ngữ số ít ngôi 3 → thêm -es", "third-person"
```

---

## 11. Lộ trình triển khai

Giả định: 1–2 dev, 1 designer bán thời gian, 2 người soạn nội dung.

### Giai đoạn 0 — Chuẩn bị (2 tuần)
- [ ] Wireframe → UI (Figma) cho 10 màn hình + design system.
- [ ] Khởi tạo dự án: Next.js, TS, Tailwind, shadcn/ui, Prisma, ESLint/Prettier, Vitest, CI.
- [ ] Chốt template nội dung (khối lý thuyết, CSV câu hỏi, CSV nghe–chép).
- [ ] Soạn **1 chủ điểm mẫu hoàn chỉnh** ("Present simple" A1) để chạy thử toàn bộ quy trình.

### Giai đoạn 1 — MVP (10 tuần): A1–B1
| Tuần | Công việc |
|---|---|
| 1 | Layout, điều hướng, theme sáng/tối, auth, schema DB, seed dữ liệu mẫu |
| 2 | **Trang lý thuyết**: renderer cho các khối (công thức tô màu, ví dụ có audio, timeline, lỗi hay gặp) |
| 3 | `packages/core`: chuẩn hóa văn bản + chấm 7 dạng câu (có unit test) |
| 4 | **Quiz player**: UI cho 7 dạng câu, chế độ luyện tập, màn hình kết quả |
| 5 | Sinh bộ đề (theo chủ điểm, danh mục, cấp độ), chế độ kiểm tra có đếm giờ |
| 6 | **Dictation**: trình phát audio, 3 chế độ, thuật toán so khớp từ, hiển thị diff |
| 7 | Tiến độ & mastery, bản đồ cấp độ, trang chủ, XP & streak |
| 8 | SRS ôn tập, bài xếp lớp, kiểm tra cuối cấp |
| 9 | **CMS**: CRUD chủ điểm/câu hỏi/nghe–chép, import CSV, tạo audio TTS khi xuất bản |
| 10 | E2E test, tối ưu hiệu năng, SEO, beta đóng 50–100 người |

**Song song:** đội nội dung hoàn thành A1–B1 (52 chủ điểm).

### Giai đoạn 2 — Bản 1.0 (6–8 tuần)
- [ ] Nội dung B2 + C1.
- [ ] Trang tổng hợp: 12 thì, câu điều kiện, bị động, tường thuật, động từ bất quy tắc.
- [ ] Huy hiệu, bảng xếp hạng tuần, nhắc học (email / web push).
- [ ] AI giải thích thêm khi người học hỏi "Tại sao?" và AI chấm câu viết lại có đáp án lạ.
- [ ] Ôn điểm yếu thông minh, thống kê từ hay nghe sai.
- [ ] PWA: ôn tập offline.
- [ ] **Ra mắt công khai.**

### Giai đoạn 3 — Mở rộng
- [ ] C2, thu âm giọng người thật cho B2–C1.
- [ ] Lớp học cho giáo viên (giao bộ đề, xem kết quả học sinh).
- [ ] Gói Premium.
- [ ] Luyện thi chứng chỉ (TOEIC/IELTS/THPT QG) dựa trên nền ngữ pháp và nghe đã có.
- [ ] App di động (Expo), tái sử dụng `packages/core`.

---

## 12. Cấu trúc thư mục

```
engquiz/
├── apps/web/                          # Next.js
│   ├── app/
│   │   ├── (marketing)/               # landing
│   │   ├── (auth)/                    # đăng nhập, onboarding, xếp lớp
│   │   ├── (app)/
│   │   │   ├── home/
│   │   │   ├── levels/[level]/        # bản đồ chủ điểm
│   │   │   ├── grammar/[slug]/        # trang lý thuyết (SSG)
│   │   │   ├── quiz/[setId]/          # làm quiz
│   │   │   ├── dictation/[setId]/     # nghe & chép
│   │   │   ├── review/                # ôn tập SRS
│   │   │   └── profile/
│   │   ├── admin/                     # CMS
│   │   └── api/
│   ├── components/
│   │   ├── ui/                        # shadcn
│   │   ├── theory/                    # Formula, Timeline, MistakeBox, ExampleList...
│   │   ├── quiz/                      # McqQuestion, VerbFormQuestion, ErrorIdQuestion...
│   │   └── dictation/                 # AudioPlayer, DictationInput, WordDiffView
│   └── lib/
├── packages/
│   ├── core/                          # logic thuần + test
│   │   ├── normalize.ts               # chuẩn hóa văn bản (dùng chung quiz & dictation)
│   │   ├── dictation-diff.ts          # so khớp từ & tính điểm
│   │   ├── grading/                   # chấm từng dạng câu
│   │   ├── srs.ts                     # SM-2
│   │   ├── mastery.ts
│   │   └── quiz-builder.ts            # sinh bộ đề
│   ├── schema/                        # Zod: question types, theory blocks
│   └── db/                            # Prisma schema, migrations, seed
├── content/                           # CSV/JSON nội dung để seed
│   ├── a1/ a2/ b1/ ...
└── scripts/
    └── generate-audio.ts              # tạo TTS cho nội dung mới
```

---

## 13. Chất lượng & hiệu năng

- **Unit test bắt buộc** cho `packages/core`, đặc biệt các trường hợp biên của chuẩn hóa và dictation:
  - viết tắt, dấu nháy cong, số viết bằng chữ;
  - người dùng gõ thiếu hoặc thừa cả cụm từ;
  - từ lặp lại trong câu (*"that that"*).
  - Coverage ≥ 90%.
- **E2E (Playwright):** đăng ký → xếp lớp → đọc lý thuyết → làm quiz → nghe–chép → xem kết quả.
- **Hiệu năng:** LCP < 2.5s trên 4G; tải trước audio của câu tiếp theo; audio ≤ 64kbps.
- **Bảo mật & dữ liệu cá nhân:** rate limit, validate input bằng Zod, tuân thủ Nghị định 13/2023/NĐ-CP (chính sách quyền riêng tư, cho phép xóa tài khoản).

---

## 14. KPI & rủi ro

### KPI (3 tháng sau ra mắt)
| Chỉ số | Mục tiêu |
|---|---|
| % người đăng ký hoàn thành bài xếp lớp | ≥ 60% |
| Retention D1 / D7 / D30 | 40% / 20% / 10% |
| Số chủ điểm hoàn thành trung bình / người dùng hoạt động / tuần | ≥ 2 |
| Điểm trung bình lần 2 so với lần 1 trên cùng chủ điểm | tăng ≥ 15% |
| Báo lỗi nội dung / 1.000 câu trả lời | < 1 |

### Rủi ro
| Rủi ro | Giảm thiểu |
|---|---|
| Không kịp soạn đủ nội dung | MVP chỉ A1–B1; AI soạn nháp + người duyệt; ưu tiên chủ điểm hay dùng |
| Sai sót ngữ pháp trong nội dung | Duyệt 2 lớp, nút "Báo lỗi" ở mọi câu, theo dõi câu có tỉ lệ đúng bất thường |
| Chấm dictation quá khắt khe gây nản | Chuẩn hóa rộng rãi, có mức "gần đúng", cho phép báo "đáp án của tôi cũng đúng" |
| Audio TTS nghe máy móc | Chọn giọng neural chất lượng cao; thu âm thật cho cấp cao |
| Người học bỏ dở | Bài ngắn 5–10 phút, streak, mục tiêu ngày, nhắc ôn tập |

---

## 15. Quyết định đã chốt & trạng thái

| # | Nội dung | Quyết định |
|---|---|---|
| 1 | Chấm dictation | Theo kiểu **dailydictation.com**: chép từng câu, kiểm tra → từ sai bị che `***`, sửa đến khi đúng; có gợi ý từng từ / hiện đáp án / bỏ qua. Bỏ qua dấu câu và hoa/thường; sai 1 ký tự ở từ dài = gần đúng (nửa điểm); sai đuôi ngữ pháp = sai. Điểm câu tính ở lần kiểm tra đầu. |
| 2 | Thứ tự học | Khóa nhẹ: gợi ý thứ tự, cho học vượt khi quiz chủ điểm đạt ≥ 80%. |
| 3 | Đăng nhập | Lý thuyết không cần đăng nhập. Đăng nhập (Auth.js: link qua email, Google) để lưu tiến độ và lộ trình cá nhân vào PostgreSQL; chưa đăng nhập thì lưu localStorage. |
| 4 | Hạ tầng | Lên kế hoạch sau. |
| 5 | Thương hiệu | Lên kế hoạch sau; tạm dùng logo chữ "EngQuiz". |

### Giai đoạn local (đã triển khai)
Để chạy được ngay trên máy không cần cài đặt thêm, bản đầu tiên đơn giản hóa so với mục 8:
- **Một ứng dụng Next.js** (chưa tách monorepo); logic thuần nằm ở `src/core` kèm unit test.
- **Nội dung lưu dạng file TypeScript** trong `src/content` (chưa có DB/CMS).
- **Tiến độ**: localStorage khi chưa đăng nhập; đăng nhập thì đồng bộ vào PostgreSQL (Prisma) qua `/api/learner`.
- **Âm thanh dùng Web Speech API** của trình duyệt (chưa tạo file TTS).

Đã có: 81 chủ điểm trong danh mục; **A1 (16/16) và A2 (18/18) đầy đủ**, cùng 3 chủ điểm B1–B2 (điều kiện loại 2/3, bị động) — tổng 37 chủ điểm, 322 câu quiz đủ 7 dạng, 42 bài nghe chép (mỗi chủ điểm một bài + truyện ngắn, hội thoại); bảng phiên âm IPA 44 âm.

### Bước tiếp theo
1. Bổ sung nội dung B1 (còn 16 chủ điểm), rồi B2–C1.
2. Bài kiểm tra xếp lớp & kiểm tra cuối cấp; chế độ "Kiểm tra" có đếm giờ cho quiz.
3. Ôn tập ngắt quãng (SRS) cho câu sai.
4. Backend (PostgreSQL + Prisma), tài khoản, CMS, audio TTS tạo sẵn.
