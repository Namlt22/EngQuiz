"""Nhận dạng lời nói ngay trên máy chủ EngQuiz (faster-whisper "small", CPU, int8) — thay Web Speech API của trình duyệt.

Web Speech gửi giọng lên Google/Microsoft, nghe giọng Việt kém, hay báo "no-speech"/lỗi mạng và mỗi trình duyệt
một kiểu. Whisper chạy tại chỗ: cùng một bộ nghe cho mọi màn hình micro, không gửi âm thanh ra ngoài.

Mỗi lượt tốn ~1,5 giây gần như cố định (Whisper luôn mã hoá khung 30 giây), nên chỉ nghe MỘT lượt, không gợi ý câu
mẫu: lượt nghe thêm có gợi ý làm người học chờ gấp đôi. Chữ hiện ngay lúc đang nói do trình duyệt lo
(src/lib/speech-recognition.ts), các bản đoán của trình duyệt được ghép vào kết quả cuối.
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache

import numpy as np

MODEL_NAME = os.environ.get("ENGQUIZ_ASR_MODEL", "small")
CPU_THREADS = int(os.environ.get("ENGQUIZ_ASR_THREADS", "4"))
BEAM_SIZE = 5
# Whisper hay viết phồn thể cho tiếng Trung; câu mồi giản thể kéo nó về giản thể như bài học.
ZH_PROMPT = "以下是普通话的句子。"
# Đoạn "nghe ra" mà gần như chắc là im lặng / tạp âm (Whisper hay bịa "Thank you." trên tiếng ồn).
NO_SPEECH_PROB = 0.6
MIN_AVG_LOGPROB = -1.0
SUPPORTED_LANGS = frozenset({"en", "zh"})


@dataclass(frozen=True)
class Heard:
    transcript: str
    alternatives: tuple[str, ...]


@lru_cache(maxsize=1)
def _model():
    from faster_whisper import WhisperModel

    return WhisperModel(MODEL_NAME, device="cpu", compute_type="int8", cpu_threads=CPU_THREADS)


def _decode(wave: np.ndarray, lang: str, prompt: str | None) -> str:
    segments, _ = _model().transcribe(
        wave,
        language=lang,
        beam_size=BEAM_SIZE,
        initial_prompt=prompt,
        condition_on_previous_text=False,
        vad_filter=True,
        without_timestamps=True,
    )
    kept = [s.text.strip() for s in segments if not (s.no_speech_prob > NO_SPEECH_PROB and s.avg_logprob < MIN_AVG_LOGPROB)]
    joiner = "" if lang == "zh" else " "
    return joiner.join(t for t in kept if t).strip()


def transcribe(wave: np.ndarray, lang: str) -> Heard:
    """Lời nói trong `wave` (16 kHz, mono, float32). Không nghe ra gì → transcript rỗng."""
    if lang not in SUPPORTED_LANGS:
        raise ValueError("bad_lang")
    main = _decode(wave, lang, ZH_PROMPT if lang == "zh" else None)
    return Heard(transcript=main, alternatives=(main,) if main else ())


def warm_up(sr: int = 16_000) -> None:
    """Nạp mô hình và chạy thử cả bộ giải mã (lần đầu vài giây).

    Im lặng thì bộ lọc VAD bỏ hết, bộ giải mã không chạy và người học đầu tiên phải chờ thêm ~1 giây → thử trên tiếng
    ồn nhẹ, tắt VAD.
    """
    noise = np.random.default_rng(0).normal(0, 0.05, sr).astype(np.float32)
    for lang in sorted(SUPPORTED_LANGS):
        segments, _ = _model().transcribe(noise, language=lang, beam_size=BEAM_SIZE, vad_filter=False, without_timestamps=True)
        list(segments)
