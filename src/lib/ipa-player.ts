"use client";

/** Phát âm IPA đứng riêng (file ghi âm); âm không có file thì đọc từ ví dụ bằng giọng máy. Dùng chung cho bảng IPA và bài học phát âm. */
import { useCallback, useEffect, useRef } from "react";
import { IPA_SOUNDS, type IpaSound } from "@/content/ipa";
import { ipaAudioSrc } from "@/content/ipa-audio";

type Speak = (text: string, rate?: number) => void;

export function useIpaSoundPlayer(speak: Speak, preload: readonly IpaSound[] = IPA_SOUNDS): (sound: IpaSound) => void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Mỗi âm một <audio> dùng lại: tải và giải mã sẵn, bấm là phát ngay.
  const cacheRef = useRef(new Map<string, HTMLAudioElement>());

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

      if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
      const audio = cacheRef.current.get(sound.id) ?? new Audio(src);
      audio.currentTime = 0;
      audioRef.current = audio;
      audio.play().catch((err: unknown) => {
        // AbortError: người dùng bấm âm khác khi file này đang tải — không phải lỗi.
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.warn(`Không phát được ${src}, đọc từ ví dụ thay thế.`, err);
        sayExample();
      });
    },
    [speak],
  );
}
