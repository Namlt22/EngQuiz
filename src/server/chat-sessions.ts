/**
 * Đếm tin nhắn trong từng cuộc trò chuyện với AI (1 cuộc = 1 lượt AI, tối đa CHAT_LIMITS.maxLearnerTurns tin).
 * Lưu trong bộ nhớ tiến trình giống rate-limit.ts: khởi động lại server thì cuộc đang dở được tính như cuộc mới.
 * Đếm ở server (không tin số tin trình duyệt gửi lên) nên gửi lại lịch sử cũ cũng không được thêm lượt.
 * Mỗi cuộc chỉ xử lý một tin một lúc (`busy`): hai tin gửi đồng thời không thể mở hai lượt hay vượt giới hạn.
 */
import type { AiTurn } from "./billing";

export interface ChatSession {
  /** Lượt AI đã lấy khi mở cuộc (null trong lúc đang lấy) — trả lại nếu tin đầu tiên lỗi. */
  turn: AiTurn | null;
  /** Số tin của người học đã được AI trả lời. */
  answered: number;
  /** Đang chờ AI trả lời một tin của cuộc này. */
  busy: boolean;
  lastUsed: number;
}

const SESSION_TTL_MS = 3 * 60 * 60_000;
const MAX_SESSIONS = 20_000;

export function createChatSessions(now: () => number = Date.now) {
  const sessions = new Map<string, ChatSession>();
  const key = (userId: string, conversationId: string) => `${userId}:${conversationId}`;

  function prune() {
    const t = now();
    for (const [k, s] of sessions) if (!s.busy && t - s.lastUsed > SESSION_TTL_MS) sessions.delete(k);
    // Vẫn quá nhiều (bị spam) → bỏ các cuộc cũ nhất không bận; Map giữ thứ tự chèn.
    for (const [k, s] of sessions) {
      if (sessions.size < MAX_SESSIONS) break;
      if (!s.busy) sessions.delete(k);
    }
  }

  function get(userId: string, conversationId: string): ChatSession | undefined {
    const k = key(userId, conversationId);
    const s = sessions.get(k);
    if (s && !s.busy && now() - s.lastUsed > SESSION_TTL_MS) {
      sessions.delete(k);
      return undefined;
    }
    return s;
  }

  return {
    get,
    /** Mở cuộc mới ở trạng thái bận (đồng bộ, trước mọi await) để tin gửi trùng không mở được cuộc thứ hai. */
    open(userId: string, conversationId: string): ChatSession {
      if (sessions.size >= MAX_SESSIONS) prune();
      const s: ChatSession = { turn: null, answered: 0, busy: true, lastUsed: now() };
      sessions.set(key(userId, conversationId), s);
      return s;
    },
    close(userId: string, conversationId: string): void {
      sessions.delete(key(userId, conversationId));
    },
    get size() {
      return sessions.size;
    },
  };
}
