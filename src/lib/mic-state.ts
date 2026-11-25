/**
 * Trạng thái nút micro trên màn hình có hai cách chấm: đã đăng nhập → chấm phát âm trên máy chủ (usePronounceCheck),
 * còn lại → nhận dạng giọng nói (useSpeechRecognition). Hàm thuần để các màn hình dùng chung và kiểm thử được.
 */
import type { PronouncePhase } from "./pronounce-client";

export interface PronounceMic {
  available: boolean;
  busy: boolean;
  phase: PronouncePhase;
}

export interface RecognitionMic {
  status: string;
  listening: boolean;
  recognizing: boolean;
}

export interface ScoredMicState {
  /** Có cách chấm nào dùng được không. */
  canRecord: boolean;
  /** Đang trong một lượt (ghi hoặc chờ chấm). */
  recording: boolean;
  /** Đã ghi xong, đang chờ máy chủ. */
  busy: boolean;
  /** Nhãn nút khi chờ máy chủ (undefined = nhãn mặc định của RecordButton). */
  busyLabel: string | undefined;
}

export function scoredMicState(pron: PronounceMic, recognition: RecognitionMic): ScoredMicState {
  if (pron.available) return { canRecord: true, recording: pron.busy, busy: pron.phase === "scoring", busyLabel: "Đang chấm…" };
  return { canRecord: recognition.status === "ready", recording: recognition.listening, busy: recognition.recognizing, busyLabel: undefined };
}

/** Dòng trạng thái khi đang chấm phát âm (rỗng khi chưa bấm). */
export function pronouncePhaseLabel(phase: PronouncePhase): string {
  if (phase === "scoring") return "Đang chấm…";
  if (phase === "recording") return "Đang nghe…";
  if (phase === "preparing") return "Chuẩn bị…";
  return "";
}
