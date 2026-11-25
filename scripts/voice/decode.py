"""Giải mã bản ghi của trình duyệt (webm/opus, ogg, mp4) ngay trong tiến trình bằng PyAV.

Gọi chương trình ffmpeg riêng (openpronounce.audio.load) tốn ~0,65 giây mỗi bản ghi, chủ yếu là khởi động tiến trình;
PyAV đọc cùng file trong ~0,05 giây và ra đúng các mẫu đó (đã so trên webm và mp3). Lỗi thì quay về ffmpeg.
"""
from __future__ import annotations

import logging

import numpy as np
from openpronounce import audio

log = logging.getLogger("engquiz.pronounce")


def _decode_with_av(path: str, sr: int) -> np.ndarray:
    import av

    parts: list[np.ndarray] = []
    with av.open(path) as container:
        resampler = av.AudioResampler(format="flt", layout="mono", rate=sr)
        for frame in container.decode(audio=0):
            parts.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(frame))
        parts.extend(f.to_ndarray().reshape(-1) for f in resampler.resample(None))
    return np.concatenate(parts).astype(np.float32) if parts else np.zeros(0, dtype=np.float32)


def load(path: str, sr: int = audio.TARGET_SR) -> np.ndarray:
    """Âm thanh mono float32 ở `sr` Hz."""
    try:
        return _decode_with_av(path, sr)
    except Exception as err:  # noqa: BLE001 — định dạng lạ / PyAV hỏng: ffmpeg vẫn đọc được
        log.warning("PyAV could not decode the recording (%s); falling back to ffmpeg", type(err).__name__)
        return np.asarray(audio.load(path, sr), dtype=np.float32)
