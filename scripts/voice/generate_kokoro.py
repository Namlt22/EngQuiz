r"""Tạo giọng đọc mẫu tiếng Anh bằng Kokoro-82M (Apache 2.0) cho EngQuiz.

Đầu vào : texts.json do scripts/voice/export-texts.run.ts xuất ra ([{key, text, say, voice, group}]).
Đầu ra  : public/audio/voice/en/<key>.mp3 (mono, 48 kbps) và public/audio/voice/en/index.json (danh sách khoá có file).
Chạy lại an toàn: file đã có thì bỏ qua; index.json ghi lại sau mỗi 25 file.

  ..\\voice-runtime\\venv\\Scripts\\python.exe scripts\\voice\\generate_kokoro.py [--texts PATH] [--limit N] [--group ipa]

Khoá phải trùng src/lib/voice-key.ts (FNV-1a 32-bit trên "<giọng>|<câu đã chuẩn hoá>").
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = ROOT / "public" / "audio" / "voice" / "en"
DEFAULT_TEXTS = ROOT.parent / "voice-runtime" / "texts.json"
SAMPLE_RATE = 24_000
# Khoảng lặng giữ lại ở hai đầu (giây): đủ để không cắt phụ âm cuối, không để chờ lâu khi bấm nghe.
EDGE_SILENCE = 0.05
SILENCE_DB = -45.0


def normalize(text: str) -> str:
    return " ".join(text.split())


def voice_key(text: str, voice: str) -> str:
    h = 0x811C9DC5
    for b in f"{voice}|{normalize(text)}".encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


def trim(audio: np.ndarray) -> np.ndarray:
    """Cắt khoảng lặng hai đầu, chừa EDGE_SILENCE."""
    threshold = 10 ** (SILENCE_DB / 20) * max(float(np.max(np.abs(audio))), 1e-6)
    loud = np.flatnonzero(np.abs(audio) > threshold)
    if not loud.size:
        return audio
    pad = int(EDGE_SILENCE * SAMPLE_RATE)
    return audio[max(0, loud[0] - pad) : min(len(audio), loud[-1] + pad)]


def to_mp3(audio: np.ndarray, out: Path) -> None:
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        wav = Path(tmp.name)
    try:
        sf.write(wav, audio, SAMPLE_RATE)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "48k", str(out)],
            check=True,
        )
    finally:
        wav.unlink(missing_ok=True)


def write_index() -> None:
    keys = sorted(p.stem for p in OUT_DIR.glob("*.mp3"))
    (OUT_DIR / "index.json").write_text(json.dumps(keys, separators=(",", ":")), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--texts", type=Path, default=DEFAULT_TEXTS)
    ap.add_argument("--limit", type=int, default=0, help="chỉ tạo N file (thử nhanh)")
    ap.add_argument("--group", default="", help="chỉ tạo một nhóm (ipa, vocab, dictation, dialogue, reading)")
    args = ap.parse_args()

    texts = json.loads(args.texts.read_text(encoding="utf-8"))
    bad = [t for t in texts if voice_key(t["text"], t["voice"]) != t["key"]]
    if bad:
        print(f"Khoá không khớp với voice-key.ts ở {len(bad)} câu, vd {bad[0]}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    todo = [t for t in texts if (not args.group or t["group"] == args.group) and not (OUT_DIR / f"{t['key']}.mp3").exists()]
    if args.limit:
        todo = todo[: args.limit]
    print(f"{len(texts)} câu, cần tạo {len(todo)}", flush=True)
    if not todo:
        write_index()
        return 0

    from kokoro import KPipeline  # nạp chậm (~10 s) — chỉ khi có việc

    pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    started = time.time()
    for n, t in enumerate(todo, 1):
        chunks = [np.asarray(audio, dtype=np.float32) for _, _, audio in pipeline(t["say"], voice=t["voice"], speed=1.0) if audio is not None]
        if not chunks:
            print(f"  bỏ qua (không ra âm thanh): {t['text']!r}", flush=True)
            continue
        to_mp3(trim(np.concatenate(chunks)), OUT_DIR / f"{t['key']}.mp3")
        if n % 25 == 0 or n == len(todo):
            write_index()
            rate = n / (time.time() - started)
            print(f"  {n}/{len(todo)} · {rate:.1f} câu/giây · còn ~{(len(todo) - n) / rate / 60:.0f} phút", flush=True)
    write_index()
    return 0


if __name__ == "__main__":
    sys.exit(main())
