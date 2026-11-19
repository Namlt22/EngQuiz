"""Tạo âm IPA đứng riêng bằng Kokoro (thay các âm đang tạo bằng giọng Windows "Microsoft David").

Kokoro nhận chuỗi âm vị trực tiếp (bỏ qua bước chữ → âm), ký hiệu theo misaki Anh-Mỹ:
A = eɪ, I = aɪ, Y = ɔɪ, W = aʊ, O = oʊ; ba nguyên âm đôi hướng tâm đọc theo giọng Mỹ có r (ɪɹ, ɛɹ, ʊɹ).

  ..\voice-runtime\venv\Scripts\python.exe scripts\voice\generate_ipa_sounds.py [--out DIR] [--voice af_heart]
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_kokoro import to_mp3, trim  # noqa: E402

# id âm trong EngQuiz → chuỗi âm vị Kokoro (có trọng âm để đọc rõ).
SOUNDS = {
    "i-short": "ˈɪ",
    "i-long": "ˈiː",
    "u-short": "ˈʊ",
    "u-long": "ˈuː",
    "ei": "ˈA",
    "ai": "ˈI",
    "oi": "ˈY",
    "au": "ˈW",
    "ou": "ˈO",
    "ia": "ˈɪɹ",
    "ea": "ˈɛɹ",
    "ua": "ˈʊɹ",
}


# Kokoro đọc /iː/ chỉ dài hơn /ɪ/ ~20%: đọc chậm lại để người học nghe rõ cặp ngắn – dài (≈ gấp đôi).
SPEED = {"i-long": 0.5, "u-long": 0.5}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path, default=Path(__file__).resolve().parents[3] / "voice-runtime" / "ipa-preview")
    ap.add_argument("--voice", default="af_heart")
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    from kokoro import KPipeline

    pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    for sound_id, phonemes in SOUNDS.items():
        chunks = [np.asarray(r.audio, dtype=np.float32) for r in pipeline.generate_from_tokens(phonemes, voice=args.voice, speed=SPEED.get(sound_id, 1.0)) if r.audio is not None]
        if not chunks:
            print(f"{sound_id}: không ra âm thanh", flush=True)
            continue
        audio = trim(np.concatenate(chunks))
        out = args.out / f"{sound_id}-{args.voice}.mp3"
        to_mp3(audio, out)
        print(f"{sound_id:8} {phonemes:6} {len(audio) / 24000:.2f}s → {out.name}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
