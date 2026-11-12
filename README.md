# EngQuiz

Website học **ngữ pháp** và luyện **nghe & chép chính tả** tiếng Anh theo lộ trình **A1 → C1**.

- 📘 **Lý thuyết**: 81 chủ điểm; A1 và A2 đã đầy đủ (37 chủ điểm có nội dung), công thức tô màu theo thành phần câu, dòng thời gian, lỗi người Việt hay mắc, ví dụ có phát âm.
- ✍️ **Quiz ngữ pháp**: 7 dạng bài (trắc nghiệm, chia động từ, điền từ, tìm lỗi sai, viết lại câu, sắp xếp từ, nối), có giải thích ngay sau mỗi câu. Có bộ đề theo chủ điểm, theo nhóm (vd tất cả câu điều kiện) và tổng hợp theo cấp.
- 🔤 **Bảng phiên âm IPA** (`/ipa`): 44 âm (12 nguyên âm đơn, 8 nguyên âm đôi, 24 phụ âm) với hướng dẫn khẩu hình, âm tiếng Việt gần giống, lỗi hay gặp, ghi chú Anh-Mỹ, nghe âm đứng riêng (36 file ghi âm từ Wikimedia Commons, CC BY-SA 3.0, ghi nguồn cuối trang; nguyên âm đôi phát qua từ ví dụ), từ ví dụ nghe được (thường & chậm), cặp từ so sánh; hướng dẫn đọc phiên âm, quy tắc đọc đuôi -s/-es, -ed và bài luyện nghe phân biệt cặp âm.
- 🎧 **Nghe & chép** (kiểu dailydictation): nghe từng câu, gõ lại, bấm *Kiểm tra*: từ đúng hiện ra, từ sai bị che `***` để nghe lại và tự sửa. Có gợi ý từng từ, hiện đáp án, đổi tốc độ, phím tắt.
- 🧭 **Lộ trình cá nhân** (`/roadmap`): trả lời 6 câu (trình độ, mục tiêu, điểm yếu, thời gian/ngày, số tuần, ngày bắt đầu) → kế hoạch theo tuần, ghép sẵn bài lý thuyết/quiz/nghe chép/âm IPA, buổi học hôm nay, tích buổi, biểu đồ số giây nói liên tục.
- 🎤 **Luyện nói** (`/speaking`): *đọc theo câu mẫu* — nghe câu, đọc to, máy chấm từng từ nghe được (xanh/vàng/đỏ, bấm từ để nghe lại); *nói tự do* — trả lời đề của lộ trình, **AI (Claude) chấm** ngữ pháp, từ vựng, độ trôi chảy, đúng trọng tâm và **sửa từng lỗi** kèm giải thích tiếng Việt, câu trả lời tự nhiên hơn để nghe lại.
- 👤 **Tài khoản**: đăng nhập bằng link qua email hoặc Google; tiến độ và lộ trình lưu trong **PostgreSQL**, học tiếp trên mọi thiết bị.

Kế hoạch chi tiết: [PLAN.md](./PLAN.md).

## Chạy trên máy local

Yêu cầu: **Node.js 20+** (khuyến nghị 22) và **Docker Desktop** (để chạy Postgres).

```bash
npm install
```

Tạo file `.env` (sinh sẵn mật khẩu database và `AUTH_SECRET`; không ghi đè nếu đã có):

```bash
npm run setup:env
```

Chạy Postgres rồi tạo bảng:

```bash
npm run db:up
```

```bash
npm run db:migrate
```

```bash
npm run dev
```

Mở http://localhost:3000. Nếu cổng khác 3000, sửa `AUTH_URL` trong `.env` cho khớp.

**Đăng nhập khi dev:** để trống `EMAIL_SERVER` thì link đăng nhập được **in ra terminal** chạy `npm run dev` thay vì gửi email. Nút Google chỉ hiện khi có `AUTH_GOOGLE_ID` và `AUTH_GOOGLE_SECRET`.

### Gửi email đăng nhập (ví dụ Gmail)

1. Bật xác minh 2 bước cho tài khoản Google, rồi tạo **Mật khẩu ứng dụng** (App password) tại https://myaccount.google.com/apppasswords — được chuỗi 16 ký tự.
2. Sửa `.env` (thay `@` trong email bằng `%40`, bỏ dấu cách trong mật khẩu ứng dụng):
   ```
   EMAIL_SERVER=smtps://ten.ban%40gmail.com:matkhauungdung16kytu@smtp.gmail.com:465
   EMAIL_FROM=EngQuiz <ten.ban@gmail.com>
   ```
3. Khởi động lại `npm run dev`. Dịch vụ khác (Brevo, Resend SMTP, Mailgun…) dùng cùng định dạng `smtp(s)://user:pass@host:port`.

### Bật AI chấm & sửa lỗi phần Luyện nói

1. Tạo khóa API tại https://console.anthropic.com (mục **API keys**) và nạp tiền/credit cho tài khoản.
2. Điền vào `.env` rồi khởi động lại server:
   ```
   ENGQUIZ_ANTHROPIC_API_KEY=sk-ant-...
   ```
   Dùng tên biến riêng này (không phải `ANTHROPIC_API_KEY`) để EngQuiz không tiêu nhầm khóa của công cụ khác có sẵn trên máy.

Mỗi lượt chấm gọi Claude Opus 5.5 một lần (khoảng 2–3 nghìn token, cỡ vài trăm đồng). Để giới hạn chi phí: phải đăng nhập mới dùng được, mỗi người tối đa 10 lượt / 10 phút và 60 lượt / ngày, chỉ chấm các đề có sẵn của lộ trình. Bỏ trống khóa thì phần **đọc theo câu mẫu** vẫn dùng bình thường (không cần AI).

> Nhận dạng giọng nói dùng Web Speech API: chạy trên **Chrome, Edge** (máy tính, Android) và **Safari** (iPhone/iPad); Firefox chưa hỗ trợ. Chrome/Edge gửi âm thanh lên máy chủ Google/Microsoft để nhận dạng nên cần Internet. Micro chỉ dùng được trên **HTTPS hoặc localhost**.

### Dùng từ máy khác trong cùng mạng (Wi-Fi/LAN, có HTTPS cho micro)

1. Đặt `AUTH_URL` thành `https://<IP LAN>:<cổng>` và tạo chứng chỉ tự ký cho IP đó (lưu trong `certificates/`, không commit):
   ```bash
   npm run setup:lan
   ```
   Có thể chỉ định IP: `npm run setup:lan -- 192.168.1.10`; quay về chỉ dùng máy này (HTTP): `npm run setup:lan -- localhost`.
2. Chạy server bằng HTTPS (thay cho `npm run dev`):
   ```bash
   npm run dev:lan
   ```
3. Mở cổng trên Windows Firewall (PowerShell **Run as administrator**, làm 1 lần; đổi `3001` theo cổng của bạn):
   ```powershell
   New-NetFirewallRule -DisplayName "EngQuiz 3001" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -Profile Private
   ```
   Mạng Wi-Fi phải đặt là **Private** (Settings → Network → Wi-Fi → Network profile type).
4. Máy khác mở `https://<IP>:<cổng>` (lệnh ở bước 1 in sẵn địa chỉ). Lần đầu trình duyệt cảnh báo chứng chỉ tự ký → **Nâng cao → Tiếp tục truy cập** (mỗi thiết bị một lần). Trên iPhone, Safari có thể không cho dùng micro với chứng chỉ chưa tin cậy; khi đó dùng Chrome hoặc cài chứng chỉ `certificates/lan-cert.pem` vào máy.

Ghi chú: link trong email đăng nhập luôn trỏ về `AUTH_URL`; nếu router đổi IP của máy (DHCP), chạy lại `npm run setup:lan` (tạo chứng chỉ mới cho IP mới). Postgres vẫn chỉ mở cho máy chạy server; máy khác không truy cập trực tiếp database.

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy chế độ phát triển (HTTP, dùng trên máy này) |
| `npm run setup:lan` | Đặt `AUTH_URL` theo IP LAN và tạo chứng chỉ HTTPS tự ký |
| `npm run dev:lan` | Chạy chế độ phát triển qua HTTPS cho các máy trong mạng |
| `npm test` | Chạy unit test (chấm điểm, nội dung, lộ trình, đồng bộ dữ liệu) |
| `npm run lint` | Kiểm tra kiểu TypeScript |
| `npm run build && npm start` | Build và chạy bản production |
| `npm run db:up` | Chạy Postgres bằng Docker (cổng 5433, chỉ mở cho máy local) |
| `npm run db:migrate` | Tạo/cập nhật bảng theo `prisma/schema.prisma` (dev) |
| `npm run db:deploy` | Áp dụng migration ở production |
| `npm run db:studio` | Xem dữ liệu bằng Prisma Studio |

> **Âm thanh:** giai đoạn này dùng Web Speech API có sẵn trong trình duyệt (Chrome, Edge, Safari). Chất lượng giọng phụ thuộc hệ điều hành; Edge/Chrome có giọng "Natural"/"Google" nghe tốt nhất. Có thể chọn giọng ngay trong bài nghe chép.
>
> **Dữ liệu học:** khi chưa đăng nhập, tiến độ lưu trong `localStorage` của trình duyệt. Khi đăng nhập, dữ liệu trên máy được gộp vào tài khoản (giữ điểm cao nhất, giữ mọi ô đã tích) và từ đó tự lưu vào Postgres qua `/api/learner`. Đăng xuất sẽ gửi nốt thay đổi, chờ server xác nhận rồi mới xóa bản trên máy; nếu chưa lưu được (mất mạng) sẽ hỏi lại trước khi xóa.
>
> **Giới hạn đã biết:** khi phải gộp hai bản (đăng nhập trên máy khác đang có dữ liệu cũ, hoặc hai tab cùng ghi), việc *bỏ tích* một ô hoặc *giảm* số giây có thể bị bản kia khôi phục lại, vì phép gộp luôn giữ thành tích cao nhất. Trong lúc học bình thường (không có xung đột) thì mọi thay đổi được lưu đúng như trên máy.

## Cấu trúc

```
prisma/
├── schema.prisma           # Bảng User/Account/Session (Auth.js) + LearnerState
└── migrations/
src/
├── auth.ts                 # Cấu hình Auth.js (email + Google, phiên lưu trong DB)
├── app/                    # Các trang (Next.js App Router)
│   ├── page.tsx            # Trang chủ
│   ├── roadmap/            # Lộ trình cá nhân
│   ├── speaking/           # Luyện nói (đọc theo câu mẫu, nói tự do + AI)
│   ├── signin/             # Đăng nhập
│   ├── api/auth/           # Route của Auth.js
│   ├── api/learner/        # GET/PUT dữ liệu học của người đang đăng nhập
│   ├── api/speaking/       # POST: AI chấm & sửa câu trả lời nói
│   ├── levels/             # Chủ điểm theo cấp độ
│   ├── grammar/            # Thư viện & trang lý thuyết
│   ├── quiz/               # Danh sách bộ đề & làm bài
│   └── dictation/          # Danh sách bài nghe & làm bài
├── components/             # Giao diện (theory, quiz, dictation, roadmap, auth, layout...)
├── content/                # NỘI DUNG — sửa/thêm bài học ở đây
│   ├── catalog.ts          # Danh mục 81 chủ điểm A1–C1
│   ├── topics/             # Lý thuyết + câu hỏi cho từng chủ điểm
│   ├── dictations.ts       # Bài nghe & chép
│   ├── roadmap-units.ts    # 16 chủ đề nói dùng để dựng lộ trình cá nhân
│   └── ipa.ts              # 44 âm IPA, hướng dẫn đọc, quy tắc đuôi -s/-ed
├── core/                   # Logic thuần + test: chuẩn hóa, chấm dictation, chấm quiz
├── lib/                    # Tiến độ, lộ trình, schema dữ liệu, gộp & đồng bộ với server, TTS, bộ đề
└── server/                 # Chỉ chạy ở server: Prisma client, truy cập DB, gửi email, gọi Claude, rate limit
```

## Thêm nội dung

**Thêm một chủ điểm:**
1. Tạo file trong `src/content/topics/` (một chủ điểm, hoặc một nhóm như `a2-tenses.ts`; copy file có sẵn làm mẫu). `slug` phải trùng với `catalog.ts`.
2. Đăng ký trong `src/content/topics/index.ts`.
3. Chạy `npm test`: test nội dung sẽ báo nếu đáp án không hợp lệ (vd từ trong câu sắp xếp không khớp, chỉ số đáp án sai).

**Thêm một bài nghe chép:** thêm vào `src/content/dictations.ts` (truyện, hội thoại) hoặc `src/content/dictations-a1a2.ts` (theo chủ điểm). Test yêu cầu mỗi chủ điểm có ít nhất một bài nghe chép. Gắn `topicSlug` để bài nghe được tính vào tiến độ của chủ điểm.

## Quy tắc chấm Nghe & chép

Xem `src/core/dictation.ts` và `src/core/normalize.ts`:

- Không phân biệt hoa/thường, bỏ qua dấu câu.
- Chấp nhận `don't` = `do not`, `5` = `five`, `colour` = `color`. Riêng `'s` và `'d` giữ nguyên vì mơ hồ (is/has, would/had).
- Sai 1 ký tự ở từ ≥ 5 chữ cái là **gần đúng** (nửa điểm, vẫn cho qua). Riêng sai đuôi ngữ pháp (`walk`/`walked`) luôn tính là **sai**.
- Điểm mỗi câu tính ở **lần kiểm tra đầu tiên**; sau đó người học sửa đến khi đúng.
