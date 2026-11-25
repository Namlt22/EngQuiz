# Hồ sơ tự phân loại rủi ro hệ thống AI — EngQuiz

> Bản nháp do nhà cung cấp tự đánh giá, theo yêu cầu tự phân loại hệ thống AI trước khi đưa vào sử dụng (Luật Trí tuệ nhân tạo 2025; tiêu chí chi tiết tại Nghị định 142/2026/NĐ-CP).
> Chủ website cần đọc lại, đối chiếu tiêu chí trong Nghị định 142/2026, rồi ký và lưu hồ sơ này. Nếu không chắc chắn, hãy hỏi Sở Khoa học và Công nghệ hoặc luật sư.
> Mỗi khi thêm tính năng AI mới, đổi mô hình hay đổi mục đích sử dụng, phải đánh giá lại.

| Mục | Nội dung |
|---|---|
| Nhà cung cấp / bên triển khai | Người bán, chủ sở hữu website EngQuiz (cá nhân kinh doanh) (xem `ENGQUIZ_BUSINESS_*` trong `.env`) |
| Phiên bản đánh giá | 2026-11-15 (khớp `LEGAL_VERSION` trong `src/lib/legal-policy.ts`) |
| Mô hình nền | Claude Haiku 5.5 (`claude-haiku-5-5`) của Anthropic, PBC (Hoa Kỳ), gọi qua API, xem `src/server/speaking-ai.ts` |
| Kết luận đề xuất | **Rủi ro thấp** |

## 1. Mô tả hệ thống

| Thuộc tính | Mô tả |
|---|---|
| Tính năng | “AI chấm & sửa lỗi” ở trang Luyện nói → Nói tự do (`/speaking?tab=talk`) |
| Đầu vào | Phần chữ của bài nói (trình duyệt nhận dạng giọng nói trên máy người dùng), đề nói lấy từ danh sách có sẵn, trình độ người học tự chọn, số giây nói |
| Đầu ra | Điểm 0–10 cho 4 tiêu chí, tối đa 8 lỗi kèm câu sửa và giải thích tiếng Việt, câu trả lời gợi ý, điểm mạnh, mẹo, câu hỏi tiếp theo |
| Người dùng | Người học tiếng Anh trưởng thành (chủ yếu A2–B1), tự nguyện bấm nút yêu cầu chấm |
| Mức tự động | Kết quả chỉ để tham khảo. Hệ thống không đưa ra quyết định nào ảnh hưởng tới quyền hay lợi ích của người dùng: không cấp chứng chỉ, không xếp lớp, không tuyển chọn |
| Phạm vi | Chỉ nhận đề có sẵn (`getSpeakingPrompt`), transcript giới hạn độ dài, `max_tokens` 4000. Prompt hệ thống dặn model không làm theo lệnh nằm trong transcript |

## 2. Đối chiếu với các lĩnh vực thường bị xếp rủi ro cao

| Lĩnh vực | Có áp dụng? | Ghi chú |
|---|---|---|
| Y tế, sức khoẻ | Không | |
| Giáo dục: tuyển sinh, đánh giá kết quả chính thức, cấp văn bằng | **Không** | Đây là luyện tập tự học. Điểm không dùng để tuyển sinh, xét tốt nghiệp hay cấp chứng chỉ, và được ghi rõ là “không phải điểm thi chính thức”. Nếu sau này dùng điểm AI để xếp lớp, cấp chứng nhận hoặc bán cho trường học dùng để chấm điểm thật, phải đánh giá lại. |
| Tài chính, ngân hàng, tín dụng, bảo hiểm | Không | Thanh toán gói không dùng AI |
| Tuyển dụng, quản lý lao động | Không | |
| Hạ tầng thiết yếu | Không | |
| Thực thi pháp luật, tư pháp, di cư | Không | |
| Sinh trắc học, nhận diện cảm xúc | Không | Không xử lý giọng nói ở máy chủ, không nhận diện người nói |
| Tạo nội dung giả người thật (deepfake) | Không | Chỉ tạo văn bản. Không tạo ảnh, âm thanh hay video giả người thật |

## 3. Nghĩa vụ minh bạch đã thực hiện

| Yêu cầu | Đã làm ở đâu |
|---|---|
| Cho người dùng biết họ đang tương tác với AI | Ghi chú dưới nút “AI chấm & sửa lỗi” (`FreeTalk.tsx`, `AiDataNotice`); trang `/legal/ai` |
| Gắn nhãn nội dung do AI tạo | Nhãn “Do AI tạo (Claude của Anthropic)” ở đầu kết quả (`FeedbackView.tsx`) |
| Nêu giới hạn và khả năng sai | Nhãn kết quả + mục 2 của `/legal/ai` |
| Cho biết dữ liệu gửi đi đâu | Ghi chú dưới nút + `/legal/privacy` mục 3 và 5 |
| Kênh phản ánh kết quả sai | `/legal/ai` mục 2 (email hỗ trợ) |

## 4. Rủi ro còn lại và biện pháp

| Rủi ro | Mức | Biện pháp |
|---|---|---|
| Chấm sai, sửa sai gây hiểu nhầm kiến thức | Thấp | Nhãn “có thể sai”; prompt yêu cầu bỏ qua lỗi chấm câu do nhận dạng giọng nói; người dùng có kênh phản ánh |
| Người dùng nói dữ liệu cá nhân nhạy cảm, dữ liệu này bị gửi ra nước ngoài | Thấp–trung bình | Cảnh báo trước khi gửi; chỉ gửi khi người dùng bấm nút; không lưu transcript; log lỗi không chứa nội dung (`route.ts`) |
| Prompt injection qua bài nói | Thấp | Transcript bọc trong thẻ `<transcript>`, có lệnh bỏ qua chỉ dẫn bên trong; đầu ra ép theo schema JSON (`zodOutputFormat`) |
| Lạm dụng chi phí | Thấp | Giới hạn theo người dùng, theo IP và tổng ngày; lượt theo gói |
| Nhà cung cấp AI ngừng dịch vụ | Thấp | Báo lỗi rõ ràng, trả lại lượt; chính sách cộng bù khi gián đoạn quá 48 giờ |

## 5. Cam kết đánh giá lại khi

- Đổi mô hình hoặc nhà cung cấp AI.
- Thêm tính năng AI mới, ví dụ tạo âm thanh giọng nói AI, chấm bài viết, trò chuyện tự do không theo đề.
- Kết quả AI bắt đầu được dùng để đưa ra quyết định chính thức (xếp lớp, cấp chứng nhận, báo cáo cho trường học hay doanh nghiệp).
- Bắt đầu phục vụ trẻ em dưới 16 tuổi như một nhóm người dùng chính.

---
Người đánh giá: ______________________ Ngày: ____/____/______ Ký tên: ______________
