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

function pickEnglishVoices(all: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const en = all.filter((v) => v.lang.toLowerCase().startsWith("en"));
  // Ưu tiên giọng Mỹ, Anh, sau đó các giọng tiếng Anh khác.
  const rank = (v: SpeechSynthesisVoice) => {
    const l = v.lang.toLowerCase();
    let r = l.startsWith("en-us") ? 0 : l.startsWith("en-gb") ? 1 : 2;
    if (/google|natural|neural|premium|enhanced/i.test(v.name)) r -= 0.5;
    return r;
  };
  return en.sort((a, b) => rank(a) - rank(b));
}

export function useSpeech() {
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
      const list = pickEnglishVoices(synth.getVoices());
      setVoices(list);
      setVoiceId((cur) => {
        if (cur && list.some((v) => v.voiceURI === cur)) return cur;
        try {
          const saved = window.localStorage.getItem("engquiz:voice");
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
  }, []);

  const chooseVoice = useCallback((id: string) => {
    setVoiceId(id);
    try {
      window.localStorage.setItem("engquiz:voice", id);
    } catch {}
  }, []);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string, rate = 1) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      synth.cancel();
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
    label: `${v.name.replace(/^(Microsoft|Google)\s*/i, "")} (${v.lang})`,
  }));

  return { supported, speaking, speak, stop, voiceOptions, voiceId, chooseVoice };
}
