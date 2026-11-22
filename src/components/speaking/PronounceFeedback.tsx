"use client";

/**
 * Kết quả chấm tới từng âm, kiểu ELSA: mỗi từ tách thành âm vị tô xanh / vàng / đỏ; bấm âm đỏ (hoặc vàng) để xem
 * bạn đọc gần âm nào, cách đặt lưỡi / môi cho âm đúng (mô tả trong bài IPA), nghe mẫu, nghe lại giọng mình.
 */
import { useState } from "react";
import Link from "next/link";
import { Ear, Volume2 } from "lucide-react";
import { soundsByWord, wordStatus, type PronounceResult, type PronounceSound, type SoundStatus } from "@/lib/pronounce";
import { soundForPhone } from "@/lib/pronounce-ipa";

const TONE: Record<SoundStatus, string> = {
  right: "text-success",
  unsure: "text-warning",
  wrong: "text-danger underline decoration-2 underline-offset-4",
};

const WORD_TONE: Record<SoundStatus, string> = {
  right: "border-success/40 bg-success/5",
  unsure: "border-warning/40 bg-warning-soft",
  wrong: "border-danger/40 bg-danger-soft",
};

/** Ký hiệu hiển thị cho một âm vị của bộ chấm: dùng ký hiệu trong bài IPA nếu có. */
const shown = (phone: string) => soundForPhone(phone)?.symbol ?? phone;

export function PronounceFeedback({
  result,
  onlyWord,
  onSpeak,
  recording,
}: {
  result: PronounceResult;
  /** Chỉ hiện một từ (bài IPA đọc trong câu khung). */
  onlyWord?: string;
  onSpeak: (text: string) => void;
  /** URL bản ghi vừa rồi để nghe lại. */
  recording?: string | null;
}) {
  const words = soundsByWord(result).filter((w) => !onlyWord || w.word.toLowerCase() === onlyWord.toLowerCase());
  const firstBad = words.flatMap((w) => w.sounds).find((s) => s.status === "wrong") ?? null;
  // Mỗi kết quả mới (đọc lại) mở sẵn âm sai đầu tiên của chính kết quả đó.
  const [shownFor, setShownFor] = useState(result);
  const [open, setOpen] = useState<PronounceSound | null>(firstBad);
  if (shownFor !== result) {
    setShownFor(result);
    setOpen(firstBad);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5" lang="en">
        {words.map((w) => (
          <div key={w.wordIndex} className={`rounded-xl border px-2.5 py-1 ${WORD_TONE[wordStatus(w.sounds)]}`}>
            <button type="button" onClick={() => onSpeak(w.word)} className="block text-left font-semibold">
              {w.word}
            </button>
            <span className="font-ipa text-sm">
              /
              {w.sounds.map((s, k) => (
                <button
                  key={k}
                  type="button"
                  disabled={s.status === "right" || !s.scored}
                  onClick={() => setOpen(s)}
                  className={`${s.scored ? TONE[s.status] : "text-muted"} ${open === s ? "rounded bg-surface px-0.5" : ""}`}
                  aria-label={`Âm /${shown(s.phone)}/: ${s.status === "right" ? "đúng" : s.status === "unsure" ? "chưa rõ" : "sai"}`}
                >
                  {shown(s.phone)}
                </button>
              ))}
              /
            </span>
          </div>
        ))}
      </div>
      {open && <SoundTip sound={open} onSpeak={onSpeak} recording={recording} />}
    </div>
  );
}

function SoundTip({ sound, onSpeak, recording }: { sound: PronounceSound; onSpeak: (text: string) => void; recording?: string | null }) {
  const target = soundForPhone(sound.phone);
  const heard = sound.heard ? soundForPhone(sound.heard) : null;
  return (
    <div className="space-y-2 rounded-xl border border-line bg-surface p-3 text-sm">
      <p>
        <b className="font-ipa text-success">/{shown(sound.phone)}/</b> trong <b lang="en">{sound.word}</b>
        {sound.status === "wrong" && (
          <>
            {" "}
            — bạn đọc gần{" "}
            {sound.heard ? (
              <b className="font-ipa text-danger">/{shown(sound.heard)}/</b>
            ) : (
              <b className="text-danger">mất âm này</b>
            )}
            {heard?.examples[0] && (
              <span className="text-muted">
                {" "}
                (như <span lang="en">{heard.examples[0].word}</span>)
              </span>
            )}
          </>
        )}
      </p>
      {target && <p className="text-muted">{target.tip ?? target.guide}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onSpeak(sound.word)} className="btn-ghost text-sm">
          <Volume2 className="size-4" /> Nghe mẫu
        </button>
        {recording && (
          <button type="button" onClick={() => void new Audio(recording).play()} className="btn-ghost text-sm">
            <Ear className="size-4" /> Giọng bạn
          </button>
        )}
        {target && (
          <Link href={`/ipa/${target.id}`} className="btn-ghost text-sm">
            Bài /{target.symbol}/
          </Link>
        )}
      </div>
    </div>
  );
}
