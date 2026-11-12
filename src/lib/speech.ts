"use client";

/**
 * Phát âm bằng Web Speech API (có sẵn trong trình duyệt, không cần API key).
 * Giai đoạn sau sẽ thay bằng file audio TTS tạo sẵn (PLAN.md mục 5.6);
 * khi đó chỉ cần đổi phần cài đặt bên trong hook này.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export interface VoiceOption {
  id: string;
  label: string;
}

/** Đẩy mọi giọng online xuống sau mọi giọng offline (hạng ngôn ngữ chỉ chạy 0–2). */
const ONLINE_VOICE_PENALTY = 10;

export function pickEnglishVoices(all: SpeechSynthesisVoice[], prefer: "en-US" | "en-GB"): SpeechSynthesisVoice[] {
  const en = all.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const first = prefer.toLowerCase();
  const second = first === "en-us" ? "en-gb" : "en-us";
  // Giọng offline (cài trên máy) đứng trước: phát gần như tức thì. Giọng online (Google…, Microsoft …Natural trên Edge)
  // hay hơn nhưng mỗi câu phải gửi lên server và chờ tải âm thanh về (trễ 0,3–1,5 giây) → để người dùng tự chọn.
  // Trong mỗi nhóm: giọng theo `prefer`, rồi giọng Anh/Mỹ còn lại, rồi các giọng tiếng Anh khác; giọng chất lượng cao lên trước.
  const rank = (v: SpeechSynthesisVoice) => {
    const l = v.lang.toLowerCase().replace("_", "-");
    let r = l.startsWith(first) ? 0 : l.startsWith(second) ? 1 : 2;
    if (/google|natural|neural|premium|enhanced/i.test(v.name)) r -= 0.5;
    if (!v.localService) r += ONLINE_VOICE_PENALTY;
    return r;
  };
  return en.sort((a, b) => rank(a) - rank(b));
}

export function useSpeech({ prefer = "en-US", storageKey = "engquiz:voice" }: { prefer?: "en-US" | "en-GB"; storageKey?: string } = {}) {
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceId, setVoiceId] = useState<string>("");
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const synth = window.speechSynthesis;
    const refresh = () => {
      const list = pickEnglishVoices(synth.getVoices(), prefer);
      setVoices(list);
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
  }, [prefer, storageKey]);

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
    (text: string, rate = 1) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      // Chỉ hủy khi đang có câu đọc dở: gọi cancel() liền trước speak() làm Chrome khởi động lại engine, trễ thêm.
      if (synth.speaking || synth.pending) synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.voiceURI === voiceId);
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang;
      } else {
        u.lang = "en-US";
      }
      u.rate = rate;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      utterRef.current = u; // giữ tham chiếu để Chrome không thu hồi sớm
      synth.speak(u);
    },
    [supported, voices, voiceId],
  );

  const voiceOptions: VoiceOption[] = voices.map((v) => ({
    id: v.voiceURI,
    label: `${v.name.replace(/^(Microsoft|Google)\s*/i, "")} (${v.lang})${v.localService ? "" : " · online, chậm hơn"}`,
  }));

  return { supported, speaking, speak, stop, voiceOptions, voiceId, chooseVoice };
}
