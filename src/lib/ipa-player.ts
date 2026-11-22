"use client";

/**
 * Phát âm IPA đứng riêng (file ghi âm), rồi đọc luôn từ ví dụ đầu tiên (giọng Kokoro) — như ELSA dạy âm trong từ:
 * nguyên âm đứng một mình vốn mơ hồ (thử bằng mô hình nhận dạng âm: cả bản ghi Commons lẫn Kokoro đều hay bị nghe
 * thành nguyên âm bên cạnh), nghe ngay trong một từ tiếng Anh thật thì tai mới định vị được.
 * Âm không có file thì chỉ đọc từ ví dụ. Dùng chung cho bảng IPA và bài học phát âm.
 */
import { useCallback, useEffect, useRef } from "react";
import { IPA_SOUNDS, type IpaSound } from "@/content/ipa";
import { ipaAudioSrc } from "@/content/ipa-audio";
import { wakeAudio } from "./audio-keepalive";
import { stopSpeech } from "./speech";
import { COLD_START_MS } from "./speech-runner";

type Speak = (text: string, rate?: number) => void;
/** Nghỉ giữa âm và từ ví dụ. */
const WORD_GAP_MS = 350;

export function useIpaSoundPlayer(speak: Speak, preload: readonly IpaSound[] = IPA_SOUNDS): (sound: IpaSound) => void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Mỗi âm một <audio> dùng lại: tải và giải mã sẵn, bấm là phát ngay.
  const cacheRef = useRef(new Map<string, HTMLAudioElement>());
  const seqRef = useRef(0);

  useEffect(() => {
    const cache = cacheRef.current;
    for (const s of preload) {
      const src = ipaAudioSrc(s.id);
      if (!src || cache.has(s.id)) continue;
      const audio = new Audio(src);
      audio.preload = "auto";
      cache.set(s.id, audio);
    }
    return () => audioRef.current?.pause();
  }, [preload]);

  return useCallback(
    (sound: IpaSound) => {
      const sayExample = () => speak(sound.examples[0].word, 0.8);
      audioRef.current?.pause();
      const src = ipaAudioSrc(sound.id);
      if (!src) return sayExample();

      stopSpeech();
      const audio = cacheRef.current.get(sound.id) ?? new Audio(src);
      audioRef.current = audio;
      const my = ++seqRef.current;
      audio.onended = () => {
        if (my === seqRef.current) window.setTimeout(() => my === seqRef.current && sayExample(), WORD_GAP_MS);
      };
      const start = () => {
        if (my !== seqRef.current) return; // đã bấm âm khác trong lúc chờ
        audio.currentTime = 0;
        audio.play().catch((err: unknown) => {
          // AbortError: người dùng bấm âm khác khi file này đang tải — không phải lỗi.
          if (err instanceof DOMException && err.name === "AbortError") return;
          console.warn(`Không phát được ${src}, đọc từ ví dụ thay thế.`, err);
          sayExample();
        });
      };
      // Thiết bị âm thanh đang ngủ: đánh thức rồi chờ một nhịp, nếu không âm đầu (chính là âm cần nghe) bị nuốt.
      if (wakeAudio()) window.setTimeout(start, COLD_START_MS);
      else start();
    },
    [speak],
  );
}
