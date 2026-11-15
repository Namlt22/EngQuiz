# Thủ tục pháp lý trước và sau khi mở bán gói AI

> Ghi chú cho chủ website. Đây không phải tư vấn pháp lý. Các điểm quy đổi doanh thu, phân loại rủi ro AI và hồ sơ dữ liệu cá nhân nên được xác nhận với chi cục thuế, Sở Công Thương hoặc luật sư.
> Căn cứ chính: Nghị định 141/2026/NĐ-CP (ngưỡng 1 tỷ), Nghị quyết 198/2025/QH15 (bỏ lệ phí môn bài), Thông tư 152/2025/TT-BTC (sổ S1a-HKD, mẫu sổ doanh thu dùng cho cá nhân kinh doanh), Nghị định 248/2026/NĐ-CP (thông báo website TMĐT), Luật 91/2025/QH15 (dữ liệu cá nhân), Luật Trí tuệ nhân tạo 2025 và Nghị định 142/2026/NĐ-CP.

## A. Trước khi mở bán

| # | Việc | Trong code đã có | Bạn cần làm |
|---|---|---|---|
| 1 | Có mã số thuế cá nhân để khai thuế với tư cách cá nhân kinh doanh | — | Dùng số định danh cá nhân 12 số; kiểm tra trên eTax Mobile |
| 2 | Công khai thông tin người bán | Chân trang + `/legal` đọc `ENGQUIZ_BUSINESS_*` | Điền 5 biến trong `.env`, chạy `scripts/windows/redeploy.ps1` |
| 3 | Tài khoản ngân hàng riêng cho website | VietQR theo đơn, nội dung = mã đơn (`BANK_*`) | Mở tài khoản đứng tên bạn, chỉ dùng cho website, điền `BANK_*` |
| 4 | Văn bản: Điều khoản, Bảo mật, AI, Thanh toán–gia hạn–hoàn tiền | `/legal/terms`, `/legal/privacy`, `/legal/ai`, `/legal/payment` | Đọc lại; muốn đổi điều kiện hoàn tiền thì sửa `src/lib/legal-policy.ts` |
| 5 | Ghi nhận đồng ý khi đăng ký | Ô tick bắt buộc; lưu `User.termsAcceptedAt` và `termsVersion`. Đăng nhập Google: dòng thông báo + ghi nhận khi tạo tài khoản | Chạy `npm run db:deploy` để thêm 2 cột |
| 6 | Tự phân loại rủi ro AI | `docs/legal/ai-risk-assessment.md` (đề xuất: rủi ro thấp) | Đọc, đối chiếu Nghị định 142/2026, ký và lưu |
| 7 | Hồ sơ đánh giá tác động xử lý dữ liệu cá nhân và chuyển dữ liệu ra nước ngoài (gửi bài nói tới Anthropic, Hoa Kỳ) | Danh mục dữ liệu ở mục C bên dưới | Lập hồ sơ theo mẫu của Bộ Công an (A05). Đọc và lưu DPA / Commercial Terms của Anthropic |
| 8 | Thông báo website TMĐT bán hàng | Link xác nhận hiện ở chân trang khi điền `ENGQUIZ_BUSINESS_NOTICE_URL` | Nộp qua online.gov.vn hoặc cổng dịch vụ công của tỉnh, **trước khi bán** |

## B. Khi đang bán

| Việc | Công cụ |
|---|---|
| Chỉ duyệt đơn khi tiền đã thực sự về tài khoản (không dựa vào ảnh chụp màn hình) | `/admin/orders` |
| Theo dõi doanh thu so với ngưỡng 1 tỷ, kể cả quy đổi khi mới bắt đầu giữa năm | `/admin/revenue` |
| Ghi sổ S1a-HKD | Nút **Tải CSV (S1a-HKD)** ở `/admin/revenue` (theo ngày tiền về, số tiền gộp) |
| Thông báo doanh thu Mẫu 01/TKN-CNKD, chậm nhất 31/01 năm sau | Lấy số “Doanh thu thực tế” của năm ở `/admin/revenue` |
| Đối soát 3 nguồn: đơn trên web, sao kê ngân hàng, doanh thu đã khai | So tổng `/admin/revenue` với sao kê tài khoản riêng |
| Trả lời khiếu nại và yêu cầu về dữ liệu trong 7 ngày làm việc | Email `ENGQUIZ_BUSINESS_EMAIL` |
| Hoàn tiền (7 ngày, không quá 10 lượt AI) | Hiện làm tay. Xem mục D |

## C. Danh mục dữ liệu cá nhân (dùng cho hồ sơ đánh giá tác động)

| Dữ liệu | Nơi lưu | Mục đích | Chia sẻ / ra nước ngoài | Thời hạn |
|---|---|---|---|---|
| Email, tên, mật khẩu băm, ảnh Google | `User` (PostgreSQL trên máy chủ của bạn) | Tài khoản | Google (nếu đăng nhập Google), nhà cung cấp SMTP | Tới khi xoá tài khoản |
| Thời điểm và phiên bản đồng ý điều khoản | `User.termsAcceptedAt`, `termsVersion` | Chứng minh sự đồng ý | — | Như trên |
| Tiến độ học, lộ trình, nhật ký luyện nói | `LearnerState` | Đồng bộ học tập | — | Như trên |
| Đơn hàng, hạn gói, lượt AI mỗi ngày | `Order`, `User.premiumUntil`, `AiUsage` | Bán hàng, kế toán | — | Theo thời hạn lưu chứng từ kế toán |
| Phần chữ của bài nói, đề, trình độ, thời lượng | **Không lưu** | Chấm bằng AI | **Anthropic (Hoa Kỳ)**, chỉ khi người dùng bấm nút | Không lưu ở EngQuiz |
| Âm thanh giọng nói | **Không qua máy chủ EngQuiz** | Nhận dạng giọng nói | Do trình duyệt xử lý (Chrome có thể gửi tới Google) | — |
| Địa chỉ IP | Bộ nhớ tạm (rate limit) | Chống spam | Google Fonts nhận IP khi tải phông | Mất khi khởi động lại server |

## D. Việc nên làm tiếp (chưa có trong code)

- **Nút hoàn tiền trong admin.** Thêm trạng thái `refunded` cho đơn, trừ lại thời hạn gói, và ghi dòng âm vào sổ doanh thu. Hiện sổ chỉ tính đơn `paid`, nên khi hoàn tiền phải tự trừ trong sổ.
- **Tự xoá tài khoản.** Chính sách đã hứa xoá khi có yêu cầu qua email. Nên có nút trong trang tài khoản, đồng thời giữ lại dữ liệu đơn hàng cho sổ sách.
- **Tự đối soát qua webhook ngân hàng** (ví dụ dịch vụ đọc biến động số dư): giúp kích hoạt nhanh hơn và giảm sai sót khi duyệt tay.
- **Tự host phông chữ** thay cho Google Fonts, để khỏi gửi IP người dùng sang Google.
