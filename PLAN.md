# EngQuiz — Kế hoạch xây dựng website học & luyện thi tiếng Anh

> Phiên bản: 1.0 · Ngày: 2026-11-11
> Mục tiêu: một nền tảng học tiếng Anh **từ mất gốc (Pre-A1) đến thành thạo (C2)**, kèm **luyện thi** các chứng chỉ phổ biến tại Việt Nam, với giao diện **hiện đại, thân thiện, dùng tốt trên điện thoại**.

---

## Mục lục

1. [Tầm nhìn & người dùng mục tiêu](#1-tầm-nhìn--người-dùng-mục-tiêu)
2. [Khung trình độ & lộ trình học](#2-khung-trình-độ--lộ-trình-học)
3. [Các kỳ thi hỗ trợ](#3-các-kỳ-thi-hỗ-trợ)
4. [Danh sách tính năng](#4-danh-sách-tính-năng)
5. [Thiết kế UI/UX](#5-thiết-kế-uiux)
6. [Kiến trúc kỹ thuật](#6-kiến-trúc-kỹ-thuật)
7. [Mô hình dữ liệu](#7-mô-hình-dữ-liệu)
8. [Thuật toán cốt lõi](#8-thuật-toán-cốt-lõi)
9. [Chiến lược nội dung](#9-chiến-lược-nội-dung)
10. [Lộ trình triển khai (Roadmap)](#10-lộ-trình-triển-khai-roadmap)
11. [Cấu trúc thư mục dự án](#11-cấu-trúc-thư-mục-dự-án)
12. [Chất lượng, bảo mật, hiệu năng](#12-chất-lượng-bảo-mật-hiệu-năng)
13. [Mô hình kinh doanh](#13-mô-hình-kinh-doanh)
14. [Chỉ số đo lường (KPI)](#14-chỉ-số-đo-lường-kpi)
15. [Rủi ro & cách giảm thiểu](#15-rủi-ro--cách-giảm-thiểu)
16. [Việc cần làm ngay](#16-việc-cần-làm-ngay)

---

## 1. Tầm nhìn & người dùng mục tiêu

**Tầm nhìn:** "Học mỗi ngày 15 phút, biết chính xác mình đang ở đâu và cần làm gì tiếp theo."

| Nhóm người dùng | Nhu cầu chính | Ưu tiên |
|---|---|---|
| Học sinh THCS/THPT | Ngữ pháp, từ vựng, luyện đề thi vào 10 & THPT Quốc gia | Cao |
| Sinh viên | Chuẩn đầu ra (VSTEP, TOEIC), IELTS du học | Cao |
| Người đi làm | TOEIC, giao tiếp công sở, IELTS định cư | Trung bình |
| Người mất gốc | Phát âm, từ vựng cơ bản, câu giao tiếp | Cao |
| Giáo viên / trung tâm | Giao bài, theo dõi lớp | Giai đoạn sau |

**Nguyên tắc sản phẩm:**
- **Cá nhân hóa:** bài kiểm tra đầu vào → lộ trình riêng.
- **Phản hồi ngay:** mọi câu trả lời đều có giải thích (tiếng Việt + tiếng Anh).
- **Thói quen hơn cường độ:** streak, mục tiêu nhỏ hằng ngày, nhắc ôn tập đúng lúc.
- **Song ngữ:** giao diện tiếng Việt mặc định, có thể chuyển sang tiếng Anh.

---

## 2. Khung trình độ & lộ trình học

Dùng **CEFR** làm "xương sống", ánh xạ sang điểm các kỳ thi.

| Cấp | Mô tả | Từ vựng tích lũy | Tương đương (tham khảo) |
|---|---|---|---|
| Pre-A1 | Mất gốc: bảng chữ cái, phát âm, số, chào hỏi | ~300 | — |
| A1 | Câu đơn giản, giới thiệu bản thân | ~700 | TOEIC 120–225 |
| A2 | Giao tiếp tình huống quen thuộc | ~1.500 | TOEIC 225–550 · VSTEP bậc 2 · KET |
| B1 | Trình bày ý kiến, đọc hiểu văn bản phổ thông | ~2.500 | TOEIC 550–785 · IELTS 4.0–5.0 · VSTEP bậc 3 · PET |
| B2 | Thảo luận chủ đề trừu tượng, viết luận | ~4.000 | TOEIC 785–945 · IELTS 5.5–6.5 · VSTEP bậc 4 · FCE |
| C1 | Sử dụng linh hoạt trong học thuật/công việc | ~6.500 | IELTS 7.0–8.0 · VSTEP bậc 5 · CAE |
| C2 | Gần như người bản xứ | 8.000+ | IELTS 8.5–9.0 · CPE |

### Cấu trúc nội dung mỗi cấp

```
Cấp độ (Level: A1)
 └── Unit (chủ đề: "Family", "Daily routine"...)  ~10–15 unit / cấp
      └── Lesson (bài học 10–15 phút)              ~4–6 lesson / unit
           ├── Vocabulary   (8–12 từ, có ảnh, audio, ví dụ)
           ├── Grammar      (1 điểm ngữ pháp, giải thích + bài tập)
           ├── Listening    (hội thoại ngắn + câu hỏi)
           ├── Reading      (đoạn văn + câu hỏi)
           ├── Speaking     (nhại âm / trả lời câu hỏi, chấm bằng AI)
           ├── Writing      (điền câu → đoạn văn, chấm bằng AI)
           └── Quiz cuối bài (để mở khóa bài tiếp theo)
      └── Unit test (kiểm tra cuối unit)
 └── Level test (đạt ≥ 70% để lên cấp, cấp chứng nhận nội bộ)
```

### Bốn kỹ năng + hai nền tảng

- **Nền tảng:** Từ vựng (Vocabulary), Ngữ pháp (Grammar), Phát âm (Pronunciation — IPA, trọng âm, nối âm).
- **Kỹ năng:** Nghe, Nói, Đọc, Viết — mỗi kỹ năng có thanh tiến độ riêng trên dashboard.

---

## 3. Các kỳ thi hỗ trợ

| Kỳ thi | Phần thi | Dạng câu hỏi cần xây dựng | Giai đoạn |
|---|---|---|---|
| **TOEIC L&R** | Listening (Part 1–4), Reading (Part 5–7) | Mô tả tranh, hỏi–đáp, hội thoại, điền câu, đọc hiểu đa văn bản | MVP |
| **THPT Quốc gia** | 40 câu trắc nghiệm (định dạng 2025+) | Phát âm/trọng âm, ngữ pháp, đọc điền từ, đọc hiểu, sắp xếp câu | MVP |
| **IELTS Academic/General** | Listening, Reading, Writing Task 1/2, Speaking Part 1–3 | Form completion, matching headings, T/F/NG, chấm Writing/Speaking bằng AI | Giai đoạn 2 |
| **VSTEP (B1–C1)** | Nghe, Đọc, Viết, Nói | Theo định dạng Bộ GD&ĐT | Giai đoạn 2 |
| **Thi vào lớp 10** | Trắc nghiệm + tự luận | Theo đề các tỉnh/thành | Giai đoạn 3 |
| **TOEIC S&W**, **Cambridge (KET/PET/FCE)**, **TOEFL iBT** | — | — | Giai đoạn 3+ |

### Chế độ luyện thi

1. **Luyện theo dạng (Practice by part):** chọn 1 dạng câu, làm không giới hạn, có giải thích từng câu.
2. **Mini test:** 15–30 phút, rút gọn đề thật.
3. **Full test (mô phỏng thi thật):** đồng hồ đếm ngược, khóa quay lại (đúng như thi thật), audio phát 1 lần.
4. **Phân tích sau thi:** điểm quy đổi, điểm theo từng part, top dạng câu sai nhiều nhất, đề xuất bài luyện.
5. **Sổ tay lỗi sai (Mistake notebook):** tự động gom câu sai để làm lại.

---

## 4. Danh sách tính năng

Ký hiệu ưu tiên: **P0** = MVP bắt buộc · **P1** = nên có ở bản 1.0 · **P2** = về sau.

### 4.1. Tài khoản & cá nhân hóa
| Tính năng | Ưu tiên |
|---|---|
| Đăng ký/đăng nhập: email, Google, Facebook (OAuth) | P0 |
| Onboarding: mục tiêu (thi gì, bao nhiêu điểm, hạn), thời gian học/ngày | P0 |
| **Bài kiểm tra xếp lớp (Placement test)** thích ứng ~20 câu, 10 phút | P0 |
| Lộ trình cá nhân hóa tự sinh từ mục tiêu + kết quả xếp lớp | P0 |
| Hồ sơ, ảnh đại diện, cài đặt thông báo, chế độ tối | P1 |

### 4.2. Học tập
| Tính năng | Ưu tiên |
|---|---|
| Bài học theo cấp độ (cấu trúc mục 2) | P0 |
| Các loại bài tập: trắc nghiệm, điền từ, kéo thả, nối cặp, sắp xếp câu, chọn ảnh, nghe–chép (dictation) | P0 |
| **Flashcard từ vựng + lặp lại ngắt quãng (SRS)** | P0 |
| Từ điển tra nhanh (bôi đen từ bất kỳ → nghĩa, IPA, audio, thêm vào sổ từ) | P1 |
| Thư viện ngữ pháp (tra cứu theo chủ điểm, có ví dụ) | P1 |
| Luyện phát âm: so sánh giọng với mẫu, chấm điểm từng âm | P1 |
| Truyện song ngữ / bài đọc theo cấp độ | P2 |
| Video bài giảng ngắn kèm phụ đề tương tác | P2 |

### 4.3. Luyện thi
| Tính năng | Ưu tiên |
|---|---|
| Ngân hàng đề TOEIC & THPT QG, luyện theo part | P0 |
| Phòng thi mô phỏng (full test) | P0 |
| Báo cáo kết quả & quy đổi điểm | P0 |
| Sổ tay lỗi sai | P1 |
| **Chấm IELTS Writing bằng AI** (band theo 4 tiêu chí + gợi ý sửa) | P1 |
| **Chấm Speaking bằng AI** (ghi âm → chuyển giọng nói thành văn bản → chấm) | P1 |
| Dự đoán điểm thi thật dựa trên lịch sử | P2 |

### 4.4. AI Tutor (trợ lý học tập)
| Tính năng | Ưu tiên |
|---|---|
| Giải thích vì sao đáp án sai bằng tiếng Việt (khi giải thích có sẵn chưa đủ) | P1 |
| Chat luyện hội thoại theo tình huống (gọi món, phỏng vấn xin việc...) | P1 |
| Sinh bài tập bổ sung theo điểm yếu | P2 |
| Giới hạn số lượt AI/ngày cho gói miễn phí | P1 |

### 4.5. Động lực & cộng đồng (Gamification)
| Tính năng | Ưu tiên |
|---|---|
| XP, streak (chuỗi ngày học), mục tiêu ngày | P0 |
| Huy hiệu (badges), cấp độ người dùng | P1 |
| Bảng xếp hạng tuần theo giải đấu (Đồng → Kim cương) | P1 |
| Thử thách 1v1 với bạn bè (quiz thời gian thực) | P2 |
| Nhắc học qua email / web push | P1 |

### 4.6. Giáo viên & quản trị
| Tính năng | Ưu tiên |
|---|---|
| **CMS nội bộ**: soạn bài học, câu hỏi, đề thi, upload audio/ảnh, import Excel/CSV | P0 |
| Duyệt nội dung (draft → review → published) | P1 |
| Dashboard quản trị: người dùng, doanh thu, nội dung lỗi bị báo cáo | P1 |
| Lớp học: giáo viên tạo lớp, giao bài, xem tiến độ học sinh | P2 |

---

## 5. Thiết kế UI/UX

### 5.1. Định hướng phong cách
- **Hiện đại, sạch, nhiều khoảng trắng**, bo góc lớn (12–16px), đổ bóng nhẹ.
- **Thân thiện:** màu tươi, minh họa (illustration) phẳng, có một **linh vật** (mascot) xuất hiện ở onboarding, màn hình chúc mừng và trạng thái trống.
- **Mobile-first:** 70%+ học sinh/sinh viên dùng điện thoại → thiết kế cho 375px trước rồi mở rộng.
- **Vi tương tác (micro-interactions):** hiệu ứng đúng/sai, confetti khi hoàn thành bài, rung nhẹ khi sai — nhưng **ngắn (<400ms)** và tôn trọng `prefers-reduced-motion`.

### 5.2. Design tokens (gợi ý)

| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| `--primary` | `#4F46E5` (indigo) | `#818CF8` | Nút chính, liên kết |
| `--success` | `#16A34A` | `#4ADE80` | Đáp án đúng |
| `--danger` | `#DC2626` | `#F87171` | Đáp án sai |
| `--warning` | `#F59E0B` | `#FBBF24` | Streak, XP |
| `--bg` | `#F8FAFC` | `#0F172A` | Nền trang |
| `--surface` | `#FFFFFF` | `#1E293B` | Card |
| `--text` | `#0F172A` | `#F1F5F9` | Chữ chính |

Màu theo cấp độ (để người dùng nhận biết nhanh): A1 xanh lá · A2 xanh ngọc · B1 xanh dương · B2 tím · C1 cam · C2 đỏ.

- **Font:** `Be Vietnam Pro` (hỗ trợ tiếng Việt tốt) cho giao diện; `Inter` hoặc `Nunito` cho nội dung tiếng Anh.
- **Cỡ chữ cơ sở:** 16px; nội dung đọc hiểu 18px, line-height 1.6.

### 5.3. Các màn hình chính

1. **Landing page** — hero + CTA "Kiểm tra trình độ miễn phí", giới thiệu tính năng, bảng giá, đánh giá người dùng.
2. **Onboarding** (3–4 bước, 1 câu hỏi/màn hình) → Placement test → màn hình kết quả "Trình độ của bạn: B1".
3. **Dashboard (Trang chủ học)**
   - Thẻ "Tiếp tục học" lớn nhất ở trên cùng.
   - Streak 🔥, XP hôm nay / mục tiêu (vòng tiến độ).
   - "Từ cần ôn hôm nay: 24" → vào Flashcard.
   - Biểu đồ radar 4 kỹ năng.
   - Đếm ngược ngày thi (nếu có mục tiêu).
4. **Bản đồ lộ trình (Learning path)** — các unit dạng con đường cuộn dọc, unit đã khóa/mở khóa/hoàn thành.
5. **Màn hình làm bài** — toàn màn hình, tối giản: thanh tiến độ trên cùng, câu hỏi ở giữa, nút "Kiểm tra" cố định dưới cùng (dễ bấm bằng ngón cái), sheet phản hồi trượt lên khi trả lời.
6. **Phòng thi** — bố cục 2 cột trên desktop (đề bài | câu hỏi), bảng điều hướng câu, đồng hồ, đánh dấu câu xem lại.
7. **Báo cáo kết quả** — điểm lớn, biểu đồ theo part, danh sách câu sai có giải thích.
8. **Flashcard** — thẻ lật, vuốt trái/phải, 4 nút đánh giá (Quên / Khó / Được / Dễ).
9. **Hồ sơ & thống kê** — lịch heatmap ngày học, huy hiệu, lịch sử thi.

### 5.4. Điều hướng
- **Mobile:** thanh tab dưới: Học · Luyện thi · Ôn tập · Xếp hạng · Tôi.
- **Desktop:** sidebar trái thu gọn được + cùng 5 mục.

### 5.5. Khả năng tiếp cận (Accessibility)
- Tương phản tối thiểu WCAG AA (4.5:1).
- Mọi bài tập làm được bằng bàn phím (phím số 1–4 chọn đáp án, Enter để kiểm tra, Space phát lại audio).
- Không truyền tải đúng/sai **chỉ bằng màu** — luôn kèm icon ✓/✗.
- Audio có điều chỉnh tốc độ (0.75x / 1x / 1.25x) và transcript (sau khi nộp).

---

## 6. Kiến trúc kỹ thuật

### 6.1. Tech stack đề xuất

| Lớp | Lựa chọn | Lý do |
|---|---|---|
| Frontend | **Next.js (App Router) + TypeScript** | SSR/SSG cho SEO (landing, thư viện ngữ pháp), React Server Components |
| UI | **Tailwind CSS + shadcn/ui + Framer Motion** | Nhanh, nhất quán, dễ theme sáng/tối, animation mượt |
| State/Data | TanStack Query + Zustand | Cache server state; state cục bộ khi làm bài |
| Backend | **Next.js Route Handlers / Server Actions** (giai đoạn đầu) → tách **NestJS** khi cần | Bắt đầu đơn giản (monolith), tách dịch vụ khi tải tăng |
| Database | **PostgreSQL** + **Prisma ORM** | Dữ liệu quan hệ rõ ràng (người dùng, bài, câu hỏi, kết quả) |
| Cache / hàng đợi | **Redis** (Upstash) + BullMQ | Bảng xếp hạng (sorted set), rate-limit AI, job chấm bài |
| Tìm kiếm | PostgreSQL full-text → Meilisearch khi cần | Tra từ, tìm bài |
| Lưu trữ file | S3 / Cloudflare R2 + CDN | Audio, hình ảnh |
| Xác thực | Auth.js (NextAuth) | Email + OAuth Google/Facebook |
| AI | Claude API (chấm Writing, tutor, giải thích) · Speech-to-text (Whisper/Azure) · TTS (Azure/ElevenLabs) cho audio | Chất lượng phản hồi tiếng Việt tốt |
| Thanh toán | VNPay / MoMo / ZaloPay + Stripe (quốc tế) | Phổ biến tại Việt Nam |
| Hạ tầng | Vercel (web) + Neon/Supabase (Postgres) hoặc Docker trên VPS | Giai đoạn đầu chi phí thấp |
| Giám sát | Sentry, PostHog (analytics + feature flag) | Theo dõi lỗi & hành vi |
| Kiểm thử | Vitest, Testing Library, Playwright (E2E) | |
| CI/CD | GitHub Actions | Lint, test, build, deploy preview |

### 6.2. Sơ đồ kiến trúc

```
                ┌───────────────────────────┐
  Trình duyệt ─►│  Next.js (Vercel / Docker)│
  (PWA)         │  - Pages (SSR/SSG)        │
                │  - API / Server Actions   │
                └──────┬───────────┬────────┘
                       │           │
          ┌────────────▼──┐   ┌────▼─────────┐     ┌───────────────┐
          │ PostgreSQL    │   │ Redis        │◄────│ Worker (BullMQ)│
          │ (Prisma)      │   │ cache, rank, │     │ - chấm Writing │
          └───────────────┘   │ queue        │     │ - chấm Speaking│
                              └──────────────┘     │ - gửi email    │
          ┌───────────────┐                        └──────┬────────┘
          │ R2/S3 + CDN   │ audio, ảnh                    │
          └───────────────┘                    ┌──────────▼─────────┐
                                               │ AI APIs: LLM, STT, │
                                               │ TTS                │
                                               └────────────────────┘
```

### 6.3. Quyết định kiến trúc quan trọng
- **Chấm điểm trắc nghiệm trên server**, không gửi đáp án đúng xuống client trước khi nộp (chống gian lận ở chế độ thi). Ở chế độ luyện tập có thể gửi kèm để phản hồi tức thì.
- **Chấm AI chạy bất đồng bộ** qua hàng đợi: người dùng nộp bài → nhận "Đang chấm..." → kết quả đẩy về sau 10–30 giây (polling hoặc SSE).
- **PWA + lưu offline** bộ flashcard để ôn tập khi mất mạng, đồng bộ lại khi có mạng.
- **Nội dung tách khỏi code:** mọi bài học/câu hỏi nằm trong DB, quản lý qua CMS; code chỉ định nghĩa *loại* bài tập.

---

## 7. Mô hình dữ liệu

Các bảng chính (rút gọn):

```
User(id, email, name, avatar, role[student|teacher|admin], locale,
     currentLevel, targetExam, targetScore, examDate, dailyGoalMinutes,
     xp, streakCount, lastActiveDate, plan[free|premium], createdAt)

Level(id, code[PRE_A1..C2], name, order, color)
Unit(id, levelId, title, description, order, icon)
Lesson(id, unitId, title, type[vocab|grammar|listening|reading|speaking|writing|mixed],
       order, estimatedMinutes, status[draft|review|published])
LessonItem(id, lessonId, order, kind[content|question], contentId?, questionId?)

Question(id, type, skill, levelCode, difficulty(-3..+3),
         prompt(JSON), options(JSON), answer(JSON), explanationVi, explanationEn,
         mediaAudioUrl?, mediaImageUrl?, transcript?, tags[], passageId?)
Passage(id, title, body, audioUrl?, transcript?)   -- đoạn đọc/nghe dùng chung nhiều câu

Exam(id, type[TOEIC|IELTS|THPT|VSTEP...], title, durationMinutes, isFullTest)
ExamSection(id, examId, name, order, durationMinutes?)
ExamSectionQuestion(sectionId, questionId, order)
ScoreConversion(examType, section, rawScore, scaledScore)

Attempt(id, userId, examId?|lessonId?, mode[practice|exam], startedAt,
        submittedAt, rawScore, scaledScore, detail(JSON))
AttemptAnswer(attemptId, questionId, response(JSON), isCorrect, timeSpentMs)
AiGrading(id, attemptAnswerId, provider, rubricScores(JSON), feedback(JSON), status)

Word(id, headword, ipaUk, ipaUs, pos, meaningVi, definitionEn, example,
     audioUrl, imageUrl, levelCode, topicTags[])
UserWord(userId, wordId, ease, intervalDays, repetitions, dueAt, lapses, lastReviewedAt)

UserLessonProgress(userId, lessonId, status, bestScore, completedAt)
UserSkillStat(userId, skill, ability(theta), updatedAt)
Badge(id, code, name, icon, condition(JSON)) · UserBadge(userId, badgeId, earnedAt)
DailyActivity(userId, date, xp, minutes, lessonsDone)   -- cho heatmap & streak
Subscription(id, userId, plan, provider, status, currentPeriodEnd)
ContentReport(id, userId, questionId, reason, status)
```

**Lưu ý thiết kế:** `prompt/options/answer` dùng **JSON có schema theo từng loại câu hỏi** (validate bằng Zod) → thêm loại bài tập mới không cần migrate DB.

---

## 8. Thuật toán cốt lõi

### 8.1. Lặp lại ngắt quãng (SRS) cho từ vựng
- Bắt đầu với **SM-2** (đơn giản, đã được kiểm chứng), lưu `ease`, `interval`, `repetitions`.
- Nâng cấp lên **FSRS** khi có đủ dữ liệu ôn tập (chính xác hơn, ít lượt ôn hơn cho cùng tỉ lệ nhớ).
- Giới hạn từ mới/ngày (mặc định 10) và tổng lượt ôn/ngày để người dùng không bị "ngập" thẻ.

### 8.2. Bài kiểm tra xếp lớp thích ứng (Adaptive placement)
- Mỗi câu hỏi có độ khó `b` (theo mô hình **IRT 1PL/Rasch**).
- Bắt đầu ở mức B1 → đúng thì tăng độ khó, sai thì giảm; cập nhật ước lượng năng lực `θ` sau mỗi câu.
- Dừng khi sai số ước lượng đủ nhỏ hoặc đủ 20–25 câu → ánh xạ `θ` sang CEFR.
- Giai đoạn đầu (chưa có dữ liệu để hiệu chỉnh IRT): dùng độ khó do người soạn gán + quy tắc lên/xuống bậc đơn giản (staircase).

### 8.3. Gợi ý bài học tiếp theo
Điểm ưu tiên cho mỗi bài/kỹ năng = trọng số × (khoảng cách tới mục tiêu) × (mức độ yếu) × (độ "mới" — lâu chưa luyện).
Dashboard luôn trả về **1 hành động chính** ("Tiếp tục học") + 2–3 gợi ý phụ.

### 8.4. Quy đổi điểm thi
Dùng bảng `ScoreConversion` (raw → scaled) cho TOEIC/IELTS; điểm IELTS tổng = trung bình 4 kỹ năng làm tròn theo quy tắc 0.25/0.75.

### 8.5. Streak & XP
- XP theo bài: hoàn thành + thưởng chính xác + thưởng tốc độ (chỉ ở luyện tập).
- Streak tính theo **múi giờ của người dùng**; có "Streak freeze" (mua bằng XP) để giảm áp lực.

---

## 9. Chiến lược nội dung

Nội dung là phần **tốn công nhất** — cần kế hoạch riêng.

| Hạng mục | Số lượng mục tiêu (bản 1.0) | Nguồn / cách làm |
|---|---|---|
| Từ vựng | 3.000 từ (Oxford 3000 làm khung) | Tự biên soạn nghĩa, ví dụ; audio bằng TTS; ảnh minh họa có bản quyền |
| Điểm ngữ pháp | ~80 chủ điểm A1–C1 | Giáo viên biên soạn, AI hỗ trợ tạo bài tập, **người duyệt bắt buộc** |
| Bài học | A1–B2: ~200 lesson | Giáo viên + AI nháp + review |
| Đề TOEIC | 10 full test + 1.500 câu luyện part | Tự biên soạn theo format (không sao chép đề có bản quyền) |
| Đề THPT QG | 20 đề | Biên soạn theo ma trận đề minh họa của Bộ GD&ĐT |
| IELTS | 6 bộ L/R + 100 đề Writing/Speaking | Giai đoạn 2 |

**Quy trình sản xuất nội dung:**
1. Soạn nháp (giáo viên hoặc AI theo template) →
2. Kiểm tra tự động (chính tả, định dạng JSON, đủ giải thích) →
3. Giáo viên duyệt →
4. Xuất bản →
5. Theo dõi chỉ số câu hỏi (tỉ lệ đúng, báo lỗi từ người dùng) → sửa câu "quá dễ/quá khó/sai".

**Bản quyền:** không dùng đề thi thật của ETS/IDP/British Council/Cambridge; chỉ tham khảo định dạng. Audio tự sản xuất bằng TTS nhiều giọng (Anh–Mỹ–Úc) hoặc thu âm.

---

## 10. Lộ trình triển khai (Roadmap)

Giả định đội ngũ nhỏ: 1–2 dev full-stack, 1 designer (bán thời gian), 2–3 người soạn nội dung.

### Giai đoạn 0 — Chuẩn bị (2 tuần)
- [ ] Chốt phạm vi MVP, viết user story.
- [ ] Thiết kế wireframe → UI Figma cho 8 màn hình chính + design system.
- [ ] Khởi tạo repo: Next.js, TypeScript, Tailwind, shadcn/ui, Prisma, ESLint/Prettier, CI.
- [ ] Soạn template nội dung (file Excel/CSV mẫu cho câu hỏi, từ vựng).

### Giai đoạn 1 — MVP (8–10 tuần)
**Mục tiêu:** người dùng có thể đăng ký, làm bài xếp lớp, học A1–B1 và luyện TOEIC/THPT.

| Tuần | Công việc |
|---|---|
| 1–2 | Auth, onboarding, layout, theme sáng/tối, schema DB, seed dữ liệu |
| 3–4 | **Engine câu hỏi**: render 6 loại bài tập (trắc nghiệm, điền từ, nối, sắp xếp, nghe chọn, chép chính tả) + chấm điểm |
| 5 | Lesson player, tiến độ, mở khóa bài, XP & streak |
| 6 | Flashcard + SRS (SM-2), sổ từ cá nhân |
| 7 | Placement test (staircase), dashboard |
| 8 | Phòng thi TOEIC/THPT: đồng hồ, điều hướng, nộp bài, báo cáo kết quả |
| 9 | CMS quản trị: CRUD nội dung, import CSV, upload media |
| 10 | Kiểm thử E2E, tối ưu hiệu năng, SEO landing, **beta đóng 50–100 người** |

### Giai đoạn 2 — Bản 1.0 (8 tuần)
- [ ] IELTS: Listening/Reading đầy đủ dạng câu; **Writing chấm AI**.
- [ ] Speaking: ghi âm, STT, chấm phát âm & nội dung.
- [ ] AI Tutor: giải thích câu sai, chat hội thoại.
- [ ] VSTEP.
- [ ] Bảng xếp hạng tuần, huy hiệu, thông báo email/web push.
- [ ] Gói Premium + thanh toán VNPay/MoMo.
- [ ] Sổ tay lỗi sai, từ điển tra nhanh.
- [ ] Mở rộng nội dung B2–C1.
- [ ] **Ra mắt công khai.**

### Giai đoạn 3 — Mở rộng (liên tục)
- [ ] Tính năng lớp học cho giáo viên/trung tâm (B2B).
- [ ] Thi đấu 1v1 thời gian thực (WebSocket).
- [ ] Ứng dụng di động (React Native/Expo, tái sử dụng logic).
- [ ] FSRS, IRT hiệu chỉnh từ dữ liệu thật, dự đoán điểm.
- [ ] Nội dung C2, Cambridge, TOEFL, thi vào lớp 10.

---

## 11. Cấu trúc thư mục dự án

```
engquiz/
├── apps/
│   └── web/                        # Next.js
│       ├── app/
│       │   ├── (marketing)/        # landing, pricing, blog (SSG)
│       │   ├── (auth)/             # login, register, onboarding
│       │   ├── (app)/              # cần đăng nhập
│       │   │   ├── dashboard/
│       │   │   ├── learn/[level]/[unit]/[lesson]/
│       │   │   ├── practice/       # luyện thi theo part
│       │   │   ├── exam/[examId]/  # phòng thi
│       │   │   ├── review/         # flashcard SRS
│       │   │   ├── leaderboard/
│       │   │   └── profile/
│       │   ├── admin/              # CMS
│       │   └── api/
│       ├── components/
│       │   ├── ui/                 # shadcn components
│       │   ├── exercises/          # 1 component / loại câu hỏi
│       │   └── exam/
│       └── lib/
├── packages/
│   ├── db/                         # Prisma schema, migrations, seed
│   ├── core/                       # logic thuần: chấm điểm, SRS, placement, XP
│   │                               #   (viết test kỹ, dùng chung cho web & mobile)
│   ├── question-schema/            # Zod schema cho từng loại câu hỏi
│   └── ai/                         # prompt & client gọi AI (chấm Writing, tutor)
├── workers/                        # BullMQ jobs
├── content/                        # file CSV/JSON nội dung mẫu để seed
└── .github/workflows/
```

**Điểm then chốt:** `packages/core` chứa logic nghiệp vụ thuần (không phụ thuộc framework) → dễ test, dùng lại cho app di động.

---

## 12. Chất lượng, bảo mật, hiệu năng

**Chất lượng**
- Unit test bắt buộc cho `packages/core` (chấm điểm, SRS, quy đổi điểm) — coverage ≥ 90%.
- E2E Playwright cho luồng chính: đăng ký → xếp lớp → học 1 bài → làm 1 mini test.
- Preview deploy cho mỗi PR.

**Bảo mật**
- Rate limit đăng nhập & API AI; xác thực dữ liệu đầu vào bằng Zod.
- Không lộ đáp án ở chế độ thi; ký (sign) URL audio đề thi để hạn chế tải hàng loạt.
- Tuân thủ **Nghị định 13/2023/NĐ-CP** về bảo vệ dữ liệu cá nhân: chính sách quyền riêng tư, cho phép xóa tài khoản & xuất dữ liệu; cẩn trọng với người dùng dưới 16 tuổi.
- Ghi âm Speaking: xin quyền rõ ràng, tự xóa sau N ngày nếu người dùng không lưu.

**Hiệu năng** (mục tiêu)
- LCP < 2.5s trên 4G, Lighthouse ≥ 90.
- Tải trước (prefetch) câu hỏi + audio tiếp theo trong lesson để chuyển câu tức thì.
- Audio nén Opus/AAC 64kbps, ảnh WebP/AVIF qua CDN.

---

## 13. Mô hình kinh doanh

| Gói | Giá tham khảo | Quyền lợi |
|---|---|---|
| **Miễn phí** | 0đ | Toàn bộ bài học A1–A2, 1 bài học/ngày từ B1+, 2 mini test/tuần, 3 lượt AI/ngày |
| **Premium** | ~99.000đ/tháng · ~699.000đ/năm | Không giới hạn bài học & đề, full test, AI chấm Writing/Speaking, sổ tay lỗi sai, không quảng cáo |
| **Lớp học (B2B)** | Theo số học viên | Quản lý lớp, giao bài, báo cáo cho giáo viên/trung tâm |

Chi phí cần theo dõi: **AI API** (chấm Writing/Speaking là khoản lớn nhất) → cache, giới hạn lượt, chọn model phù hợp với từng tác vụ.

---

## 14. Chỉ số đo lường (KPI)

| Nhóm | Chỉ số | Mục tiêu 3 tháng sau ra mắt |
|---|---|---|
| Kích hoạt | % người đăng ký hoàn thành placement test | ≥ 60% |
| Giữ chân | Retention D1 / D7 / D30 | 40% / 20% / 10% |
| Mức độ dùng | Thời gian học trung bình/ngày (người dùng hoạt động) | ≥ 12 phút |
| Thói quen | % người dùng có streak ≥ 7 ngày | ≥ 15% |
| Học tập | Tỉ lệ hoàn thành lesson đã bắt đầu | ≥ 80% |
| Chuyển đổi | Free → Premium | 2–4% |
| Chất lượng | Số báo lỗi nội dung / 1.000 câu trả lời | < 1 |

---

## 15. Rủi ro & cách giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Thiếu nội dung chất lượng khi ra mắt | Cao | Thu hẹp MVP (A1–B1 + TOEIC + THPT), AI hỗ trợ soạn nháp nhưng luôn có người duyệt |
| Chi phí AI tăng nhanh | Trung bình | Giới hạn lượt, hàng đợi, cache, chỉ dùng AI cho Writing/Speaking/tutor |
| Chấm AI không chính xác → mất uy tín | Trung bình | Hiển thị là "điểm ước lượng", hiệu chỉnh với bài đã được giáo viên chấm, cho phép người dùng phản hồi |
| Vi phạm bản quyền đề thi | Cao | Tự biên soạn 100%, chỉ tham khảo định dạng |
| Người dùng bỏ học sau vài ngày | Cao | Onboarding ngắn, mục tiêu nhỏ, streak, nhắc học, cá nhân hóa |
| Phạm vi phình to | Cao | Bám sát bảng ưu tiên P0/P1/P2, review phạm vi mỗi 2 tuần |

---

## 16. Việc cần làm ngay

1. **Chốt các quyết định mở:**
   - Ưu tiên kỳ thi nào cho MVP? (đề xuất: TOEIC + THPT QG)
   - Tự host (VPS + Docker) hay dùng dịch vụ quản lý (Vercel + Neon)?
   - Tên miền, nhận diện thương hiệu, linh vật.
2. Khởi tạo khung dự án (monorepo Next.js + Prisma + Tailwind + shadcn/ui) và CI.
3. Viết `packages/question-schema` cho 6 loại câu hỏi MVP và `packages/core` (chấm điểm + SM-2) kèm test.
4. Thiết kế Figma cho: Dashboard, Lesson player, Phòng thi, Flashcard.
5. Soạn 1 unit mẫu hoàn chỉnh (A1 — "Greetings") để kiểm chứng toàn bộ quy trình nội dung → code.
