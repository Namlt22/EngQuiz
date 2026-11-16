"use client";

/**
 * Phát âm bằng Web Speech API (có sẵn trong trình duyệt, không cần API key).
 * Giai đoạn sau sẽ thay bằng file audio TTS tạo sẵn (PLAN.md mục 5.6);
 * khi đó chỉ cần đổi phần cài đặt bên trong hook này.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { respellVietnameseNames, splitVietnameseNames } from "./vi-names";

export interface VoiceOption {
  id: string;
  label: string;
}

/** Đẩy mọi giọng online xuống sau mọi giọng offline (hạng ngôn ngữ chỉ chạy 0–2). */
const ONLINE_VOICE_PENALTY = 10;

/** Toàn bộ phần đọc của EngQuiz dùng giọng Anh-Mỹ. */
export const SPEECH_LANG = "en-US";

/**
 * Giọng Anh-Mỹ (en-US) có trên máy, giọng tốt nhất trước. Máy không có giọng Mỹ nào thì mới dùng giọng tiếng Anh khác.
 * Giọng offline (cài trên máy) đứng trước: phát gần như tức thì. Giọng online (Google…, Microsoft …Natural trên Edge)
 * hay hơn nhưng mỗi câu phải gửi lên server và chờ tải âm thanh về (trễ 0,3–1,5 giây) → để người dùng tự chọn.
 */
export function pickEnglishVoices(all: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const norm = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace("_", "-");
  const english = all.filter((v) => norm(v).startsWith("en"));
  const us = english.filter((v) => norm(v).startsWith("en-us"));
  const rank = (v: SpeechSynthesisVoice) => {
    let r = 0;
    if (/google|natural|neural|premium|enhanced/i.test(v.name)) r -= 0.5;
    if (!v.localService) r += ONLINE_VOICE_PENALTY;
    return r;
  };
  return (us.length ? us : english).sort((x, y) => rank(x) - rank(y));
}

// Đổi tên khóa khi chuyển hết sang giọng Mỹ: lựa chọn giọng Anh-Anh đã lưu trước đây không còn được áp dụng.
/** Giọng tiếng Việt để đọc tên riêng Việt Nam trong câu (giọng offline trước). */
export function pickVietnameseVoice(all: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const vi = all.filter((v) => v.lang.toLowerCase().startsWith("vi"));
  return vi.find((v) => v.localService) ?? vi[0];
}

export function useSpeech({ storageKey = "engquiz:voice-us" }: { storageKey?: string } = {}) {
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceId, setVoiceId] = useState<string>("");
  const [speaking, setSpeaking] = useState(false);
  const [viVoice, setViVoice] = useState<SpeechSynthesisVoice | undefined>();
  const utterRef = useRef<SpeechSynthesisUtterance[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const synth = window.speechSynthesis;
    const refresh = () => {
      const all = synth.getVoices();
      const list = pickEnglishVoices(all);
      setVoices(list);
      setViVoice(pickVietnameseVoice(all));
      setVoiceId((cur) => {
        if (cur && list.some((v) => v.voiceURI === cur)) return cur;
        try {
          const saved = window.localStorage.getItem(storageKey);
          if (saved && list.some((v) => v.voiceURI === saved)) return saved;
        } catch {}
        return list[0]?.voiceURI ?? "";
      });
    };
    refresh();
    synth.addEventListener("voiceschanged", refresh);
    return () => {
      synth.removeEventListener("voiceschanged", refresh);
      synth.cancel();
    };
  }, [storageKey]);

  const chooseVoice = useCallback(
    (id: string) => {
      setVoiceId(id);
      try {
        window.localStorage.setItem(storageKey, id);
      } catch {}
    },
    [storageKey],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    /**
     * pitch: đổi cao độ để phân biệt hai nhân vật trong hội thoại.
     * onEnd: gọi khi đọc xong cả câu (KHÔNG gọi khi bị hủy hay lỗi) — dùng để đọc nối câu tiếp theo.
     */
    (text: string, rate = 1, { pitch = 1, onEnd }: { pitch?: number; onEnd?: () => void } = {}) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      // Chỉ hủy khi đang có câu đọc dở: gọi cancel() liền trước speak() làm Chrome khởi động lại engine, trễ thêm.
      if (synth.speaking || synth.pending) synth.cancel();
      const enVoice = voices.find((v) => v.voiceURI === voiceId);
      const make = (part: string, voice: SpeechSynthesisVoice | undefined, lang: string) => {
        const u = new SpeechSynthesisUtterance(part);
        if (voice) u.voice = voice;
        u.lang = voice?.lang ?? lang;
        u.rate = rate;
        u.pitch = pitch;
        return u;
      };
      // Tên riêng Việt Nam (Huế, Đà Nẵng, Linh…): đọc bằng giọng Việt nếu máy có, không thì đọc theo phiên âm.
      const segments = splitVietnameseNames(text);
      const parts =
        viVoice && segments.some((p) => p.lang === "vi")
          ? segments.map((p) => (p.lang === "vi" ? make(p.text, viVoice, "vi-VN") : make(p.text, enVoice, SPEECH_LANG)))
          : [make(respellVietnameseNames(text), enVoice, SPEECH_LANG)];
      const lastPart = parts[parts.length - 1];
      parts[0].onstart = () => setSpeaking(true);
      lastPart.onend = () => {
        setSpeaking(false);
        onEnd?.();
      };
      parts.forEach((u) => (u.onerror = () => setSpeaking(false)));
      utterRef.current = parts; // giữ tham chiếu để Chrome không thu hồi sớm
      parts.forEach((u) => synth.speak(u));
    },
    [supported, voices, voiceId, viVoice],
  );

  const voiceOptions: VoiceOption[] = voices.map((v) => ({
    id: v.voiceURI,
    label: `${v.name.replace(/^(Microsoft|Google)\s*/i, "")} (${v.lang})${v.localService ? "" : " · online, chậm hơn"}`,
  }));

  return { supported, speaking, speak, stop, voiceOptions, voiceId, chooseVoice };
}
