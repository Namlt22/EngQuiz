import { AI_DAILY_LIMIT, AI_TRIAL_TURNS } from "@/lib/plans";
import type { LegalContext, LegalDoc } from "./types";

/**
 * Điều khoản AI: minh bạch việc người dùng tương tác với AI, giới hạn của kết quả AI, dữ liệu gửi đi
 * (Luật Trí tuệ nhân tạo 2025 và Nghị định 142/2026/NĐ-CP). Kết quả tự phân loại rủi ro: docs/legal/ai-risk-assessment.md.
 */
export function aiDoc({ business: b }: LegalContext): LegalDoc {
  return {
    slug: "ai",
    title: "Điều khoản sử dụng AI",
    summary: "Tính năng AI chấm & sửa bài nói hoạt động thế nào, giới hạn của kết quả AI và dữ liệu được gửi đi.",
    sections: [
      {
        heading: "1. Bạn đang dùng trí tuệ nhân tạo",
        blocks: [
          "Phần “AI chấm & sửa lỗi” ở trang Luyện nói do một hệ thống trí tuệ nhân tạo thực hiện. Đó là mô hình Claude của Anthropic, không phải giáo viên thật. Điểm số, câu sửa, câu trả lời gợi ý, nhận xét và câu hỏi tiếp theo đều do AI tạo ra tự động và được gắn nhãn “Do AI tạo”.",
          "Các phần còn lại của EngQuiz (lý thuyết, quiz, nghe chép, bảng IPA, luyện đọc theo câu mẫu) không dùng AI tạo sinh. Kết quả ở các phần này được chấm theo đáp án có sẵn.",
        ],
      },
      {
        heading: "2. Giới hạn của kết quả AI",
        blocks: [
          {
            list: [
              "AI có thể sai: chấm lệch, bỏ sót lỗi, sửa chưa tự nhiên hoặc hiểu nhầm ý bạn.",
              "Bài nói được trình duyệt chuyển thành chữ trước khi gửi cho AI, nên lỗi nhận dạng giọng nói có thể làm AI đánh giá sai. AI được dặn đánh dấu những chỗ nghi do máy nghe nhầm.",
              "Điểm 0–10 chỉ để bạn theo dõi tiến bộ. Đây không phải điểm IELTS, TOEIC, VSTEP hay bất kỳ kỳ thi chính thức nào, và không có giá trị chứng nhận trình độ.",
              "Đừng dùng nhận xét của AI làm căn cứ duy nhất cho các quyết định quan trọng như học tập, tuyển dụng hay thi cử.",
            ],
          },
          `Nếu thấy kết quả sai rõ ràng hoặc có nội dung không phù hợp, hãy báo cho ${b.email} và gửi kèm đề nói, thời gian. EngQuiz dùng phản hồi này để chỉnh lại cách hướng dẫn AI.`,
        ],
      },
      {
        heading: "3. Dữ liệu gửi cho AI",
        blocks: [
          "Chỉ khi bạn bấm nút yêu cầu chấm, EngQuiz gửi tới máy chủ của Anthropic (Hoa Kỳ): phần chữ của bài nói, đề nói, trình độ bạn tự chọn và thời lượng nói. Email, tên và mọi thông tin tài khoản khác không được gửi.",
          "EngQuiz không lưu nội dung bài nói và kết quả chấm trên máy chủ. Chi tiết xem Chính sách bảo mật, mục 3 và mục 5.",
          "Không nói thông tin cá nhân nhạy cảm của bạn hay của người khác khi luyện nói (số giấy tờ, sức khoẻ, tài chính, địa chỉ nhà, mật khẩu…).",
        ],
      },
      {
        heading: "4. Lượt dùng AI",
        blocks: [
          {
            list: [
              `Tài khoản miễn phí được tặng ${AI_TRIAL_TURNS} lượt AI dùng thử.`,
              `Gói AI cho tối đa ${AI_DAILY_LIMIT} lượt mỗi ngày. Lượt được tính lại từ 0 giờ (giờ Việt Nam) và không cộng dồn sang ngày sau.`,
              "Lượt không thành công do lỗi phía AI hoặc máy chủ được tự động trả lại. Lượt bị AI từ chối vì nội dung không phù hợp vẫn bị tính.",
              "Để bảo vệ hệ thống, EngQuiz giới hạn số lượt gửi trong thời gian ngắn và tổng số lượt của toàn hệ thống mỗi ngày.",
            ],
          },
        ],
      },
      {
        heading: "5. Sử dụng đúng mục đích",
        blocks: [
          "Tính năng AI chỉ dùng để luyện nói tiếng Anh theo đề có sẵn. Không được tìm cách khiến AI làm việc khác (viết bài hộ, trả lời câu hỏi ngoài đề, tạo nội dung vi phạm pháp luật), không dùng công cụ tự động gửi yêu cầu, và không chia sẻ tài khoản để dùng chung lượt. Vi phạm có thể bị khoá tính năng AI hoặc khoá tài khoản.",
        ],
      },
    ],
  };
}
