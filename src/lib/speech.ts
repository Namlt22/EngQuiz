"use client";

/**
 * Phát âm bằng Web Speech API (có sẵn trong trình duyệt, không cần API key).
 * Giai đoạn sau sẽ thay bằng file audio TTS tạo sẵn (PLAN.md mục 5.6);
 * khi đó chỉ cần đổi phần cài đặt bên trong hook này.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { respellVietnameseNames } from "./vi-names";
import { wakeAudio } from "./audio-keepalive";
import { createSpeechRunner, type SpeechRunner, type SynthLike, type UtteranceLike } from "./speech-runner";

export interface VoiceOption {
  id: string;
  label: string;
}

/** Đẩy mọi giọng online xuống sau mọi giọng offline (hạng ngôn ngữ chỉ chạy 0–2). */
const ONLINE_VOICE_PENALTY = 10;

/** Phần tiếng Anh của EngQuiz dùng giọng Anh-Mỹ. */
export const SPEECH_LANG = "en-US";
/** Phần tiếng Trung dùng giọng phổ thông Trung Quốc đại lục (giản thể, chuẩn HSK). */
export const SPEECH_LANG_ZH = "zh-CN";

/** Thông báo chung khi giọng máy không phát được (onError của speak). */
export const SPEECH_ERROR_NOTICE = "Không phát được âm thanh. Thử chọn giọng khác hoặc tải lại trang.";

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

/**
 * Giọng tiếng Trung phổ thông: zh-CN trước, rồi zh-TW (vẫn là tiếng phổ thông).
 * Loại zh-HK / yue: đó là tiếng Quảng Đông, đọc sai hoàn toàn so với pinyin.
 */
export function pickChineseVoices(all: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const norm = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace("_", "-");
  const mandarin = all.filter((v) => /^(zh|cmn)/.test(norm(v)) && !/hk|yue/.test(norm(v)));
  const rank = (v: SpeechSynthesisVoice) => {
    let r = /^(zh-cn|cmn-hans|zh-hans)/.test(norm(v)) ? 0 : 1;
    if (/google|natural|neural|premium|enhanced/i.test(v.name)) r -= 0.5;
    if (!v.localService) r += ONLINE_VOICE_PENALTY;
    return r;
  };
  return mandarin.sort((x, y) => rank(x) - rank(y));
}

// Đổi tên khóa khi chuyển hết sang giọng Mỹ: lựa chọn giọng Anh-Anh đã lưu trước đây không còn được áp dụng.

/**
 * lang: "en" (mặc định, giọng Anh-Mỹ, đọc được tên riêng Việt Nam trong câu) hoặc "zh" (giọng phổ thông).
 * Mỗi ngôn ngữ nhớ giọng đã chọn ở khoá localStorage riêng.
 */
/** Một bộ điều phối cho cả trang (giọng máy là tài nguyên chung của trình duyệt) — xem speech-runner.ts. */
let runner: SpeechRunner | null = null;
function getRunner(): SpeechRunner {
  runner ??= createSpeechRunner({ synth: window.speechSynthesis as unknown as SynthLike, setTimeout: (fn, ms) => window.setTimeout(fn, ms), wakeAudio });
  return runner;
}
/** Dừng giọng máy đang đọc / đang chờ đọc (vd trước khi phát file ghi âm). */
export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) getRunner().stop();
}

/** Hook nào đang đọc — hook bị gỡ khỏi trang chỉ dừng câu của chính nó. */
let ownerSeq = 0;
let currentOwner = 0;

/**
 * lang: "en" (mặc định, giọng Anh-Mỹ, đọc được tên riêng Việt Nam trong câu) hoặc "zh" (giọng phổ thông).
 * Mỗi ngôn ngữ nhớ giọng đã chọn ở khoá localStorage riêng.
 */
export function useSpeech({ storageKey, lang = "en" }: { storageKey?: string; lang?: "en" | "zh" } = {}) {
  storageKey ??= lang === "zh" ? "engquiz:voice-zh" : "engquiz:voice-us";
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceId, setVoiceId] = useState<string>("");
  const [speaking, setSpeaking] = useState(false);
  const ownerRef = useRef(0);
  if (!ownerRef.current) ownerRef.current = ++ownerSeq;

  const pick = useCallback((all: SpeechSynthesisVoice[]) => (lang === "zh" ? pickChineseVoices(all) : pickEnglishVoices(all)), [lang]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    const synth = window.speechSynthesis;
    const owner = ownerRef.current;
    const refresh = () => {
      const all = synth.getVoices();
      const list = pick(all);
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
      // Chỉ dừng nếu câu đang đọc là của hook này (không cắt ngang nút nghe khác trên trang).
      if (currentOwner === owner) getRunner().stop();
    };
  }, [storageKey, lang, pick]);

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
    getRunner().stop();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    /**
     * pitch: đổi cao độ để phân biệt hai nhân vật trong hội thoại.
     * onEnd: gọi khi đọc xong cả câu (KHÔNG gọi khi bị hủy hay lỗi) — dùng để đọc nối câu tiếp theo.
     * onError: giọng máy lỗi thật (không phát được, mất mạng với giọng online, kẹt quá lâu…) — để giao diện thoát trạng thái "đang đọc".
     *   Bị hủy vì đọc câu khác / bấm dừng ("interrupted", "canceled") không tính là lỗi.
     */
    (text: string, rate = 1, { pitch = 1, onEnd, onError }: { pitch?: number; onEnd?: () => void; onError?: (code: string) => void } = {}) => {
      if (!supported) return;
      const synth = window.speechSynthesis;
      // Danh sách giọng nạp không đồng bộ: bấm nghe ngay khi vừa mở trang thì lấy giọng trực tiếp,
      // không để trình duyệt tự chọn giọng mặc định (thường là giọng online, chậm hơn).
      const list = voices.length ? voices : pick(synth.getVoices());
      const mainVoice = list.find((v) => v.voiceURI === voiceId) ?? list[0];
      const make = (part: string, voice: SpeechSynthesisVoice | undefined, fallbackLang: string) => {
        const u = new SpeechSynthesisUtterance(part);
        if (voice) u.voice = voice;
        u.lang = voice?.lang ?? fallbackLang;
        u.rate = rate;
        u.pitch = pitch;
        return u;
      };
      // Cả câu đọc liền một lượt bằng một giọng. Tên riêng Việt Nam (Huế, Đà Nẵng, Linh…) được thay bằng cách viết
      // phiên âm để giọng tiếng Anh đọc gần đúng — không tách sang giọng Việt (đổi giọng giữa câu gây ngắt quãng).
      const makeParts = () => [lang === "zh" ? make(text, mainVoice, SPEECH_LANG_ZH) : make(respellVietnameseNames(text), mainVoice, SPEECH_LANG)];
      currentOwner = ownerRef.current;
      getRunner().speak(makeParts as () => UtteranceLike[], {
        onStart: () => setSpeaking(true),
        onSettle: () => setSpeaking(false),
        onEnd,
        onError,
      });
    },
    [supported, voices, voiceId, lang, pick],
  );

  const voiceOptions: VoiceOption[] = voices.map((v) => ({
    id: v.voiceURI,
    label: `${v.name.replace(/^(Microsoft|Google)\s*/i, "")} (${v.lang})${v.localService ? "" : " · online, chậm hơn"}`,
  }));

  /** Giọng đang dùng là giọng online (mỗi câu phải tải từ server → có độ trễ). */
  const voiceIsOnline = !!voices.find((v) => v.voiceURI === voiceId) && !voices.find((v) => v.voiceURI === voiceId)!.localService;

  return { supported, speaking, speak, stop, voiceOptions, voiceId, chooseVoice, voiceIsOnline };
}
