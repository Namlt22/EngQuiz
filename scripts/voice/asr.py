"""Nhận dạng lời nói ngay trên máy chủ EngQuiz (faster-whisper "small", CPU, int8) — thay Web Speech API của trình duyệt.

Web Speech gửi giọng lên Google/Microsoft, nghe giọng Việt kém, hay báo "no-speech"/lỗi mạng và mỗi trình duyệt
một kiểu. Whisper chạy tại chỗ: cùng một bộ nghe cho mọi màn hình micro, không gửi âm thanh ra ngoài.

Khi biết câu người học cần đọc (`expected`) mà lượt nghe thường không ra đúng câu đó, nghe thêm một lượt có câu đó
làm ngữ cảnh: giọng lơ nói đúng thường được nhận ra ở lượt này, còn nói khác hẳn thì Whisper vẫn không viết ra câu
mẫu. Lượt thêm chỉ thành một bản đoán phụ (alternatives), bản chính vẫn là lượt không gợi ý.
"""
from __future__ import annotations

import os
import re
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


def _comparable(text: str) -> str:
    return re.sub(r"[^\w]+", " ", text.lower()).strip()


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


def transcribe(wave: np.ndarray, lang: str, expected: str | None = None) -> Heard:
    """Lời nói trong `wave` (16 kHz, mono, float32). Không nghe ra gì → transcript rỗng."""
    if lang not in SUPPORTED_LANGS:
        raise ValueError("bad_lang")
    base_prompt = ZH_PROMPT if lang == "zh" else None
    main = _decode(wave, lang, base_prompt)
    alternatives: list[str] = [main] if main else []
    if expected and main and _comparable(main) != _comparable(expected):
        hinted = _decode(wave, lang, f"{base_prompt or ''}{expected}")
        if hinted and _comparable(hinted) not in {_comparable(a) for a in alternatives}:
            alternatives.append(hinted)
    return Heard(transcript=main, alternatives=tuple(alternatives))


def warm_up(sr: int = 16_000) -> None:
    """Nạp mô hình sẵn (lần đầu vài giây)."""
    _decode(np.zeros(sr, dtype=np.float32), "en", None)
