r"""Dịch vụ chấm phát âm tới từng âm và nhận dạng lời nói cho EngQuiz — chỉ nghe ở 127.0.0.1
(Next.js gọi qua /api/pronounce và /api/transcribe; nhận dạng bằng Whisper, scripts/voice/asr.py).

Chấm theo câu đã biết bằng GOP trên mô hình CTC (scripts/voice/gop.py), như ELSA chấm bài đọc theo mẫu.
Thử trên 30 cặp từ tối thiểu của app (giọng Kokoro đọc đúng / đọc nhầm, qua webm như trình duyệt gửi, câu khung
"Say … now."): báo nhầm 1/60, bắt được 56/60 — so với 2/60 và 49/60 của cách OpenPronounce đoán tự do rồi so chuỗi.

  ..\voice-runtime\venv\Scripts\python.exe scripts\voice\pronounce_service.py      (cổng 8765)

Bản ghi âm chỉ nằm trong file tạm trong lúc chấm, xoá ngay sau đó; không lưu lại.
"""
from __future__ import annotations

import asyncio
import logging
import os
import sys
import tempfile
import time
from collections.abc import Callable
from pathlib import Path

ESPEAK_DLL = Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "eSpeak NG" / "libespeak-ng.dll"
if ESPEAK_DLL.is_file():
    os.environ.setdefault("PHONEMIZER_ESPEAK_LIBRARY", str(ESPEAK_DLL))
# Mô hình đã tải sẵn trong HF_HOME: không hỏi mạng mỗi lần khởi động.
os.environ.setdefault("HF_HUB_OFFLINE", "1")
sys.path.insert(0, str(Path(__file__).resolve().parent))

import numpy as np  # noqa: E402
import uvicorn  # noqa: E402
from fastapi import FastAPI, File, Form, HTTPException, UploadFile  # noqa: E402
from fastapi.concurrency import run_in_threadpool  # noqa: E402
from openpronounce import audio  # noqa: E402

import asr  # noqa: E402
import decode  # noqa: E402
import gop  # noqa: E402

HOST = "127.0.0.1"
PORT = int(os.environ.get("PRONOUNCE_PORT", "8765"))
MAX_BYTES = 2 * 1024 * 1024
MAX_TEXT = 200
MIN_SECONDS = 0.2
MAX_SECONDS = 15.0
# Nhận dạng lời nói: Nói tự do cho nói tới 3 phút.
MAX_TRANSCRIBE_BYTES = 4 * 1024 * 1024
MAX_TRANSCRIBE_SECONDS = 200.0
MAX_EXPECTED = 200
# Ngưỡng biên GOP (lpr): < SURE_WRONG → sai; < SURE_RIGHT → chưa rõ; còn lại đúng. Chọn theo kết quả thử ở trên.
SURE_WRONG = -1.0
SURE_RIGHT = 1.0
UNSURE_CREDIT = 0.6
# Câu đứng một mình phải khớp hơn câu khung ít nhất chừng này (nat) mới coi là người học chỉ đọc mỗi từ.
ALONE_MARGIN = 10.0

log = logging.getLogger("engquiz.pronounce")
app = FastAPI(title="EngQuiz pronunciation", docs_url=None, redoc_url=None, openapi_url=None)
# Một lượt chấm mỗi lúc: mô hình wav2vec2 chiếm nhiều CPU, chấm song song chỉ làm mọi người chờ lâu hơn.
gate = asyncio.Semaphore(1)
ready = False


def _status(lpr: float | None) -> str:
    if lpr is None:
        return "right"
    return "wrong" if lpr < SURE_WRONG else "unsure" if lpr < SURE_RIGHT else "right"


def _load_recording(path: str, max_seconds: float) -> tuple[np.ndarray, float]:
    """Giải mã bản ghi; quá ngắn / quá dài → ValueError (route trả 422)."""
    sound = decode.load(path)
    seconds = len(sound) / audio.TARGET_SR
    if seconds < MIN_SECONDS:
        raise ValueError("too_short")
    if seconds > max_seconds:
        raise ValueError("too_long")
    return sound, seconds


def _score_file(path: str, text: str, focus: str | None, skip: frozenset[str]) -> dict:
    sound, _ = _load_recording(path, MAX_SECONDS)
    # Đệm 0,3 giây im lặng hai đầu: bản ghi cắt sát làm mô hình đoán thêm âm ở mép.
    pad = np.zeros(int(0.3 * audio.TARGET_SR), dtype=np.float32)
    lp = gop.log_posteriors(np.concatenate([pad, np.asarray(sound, dtype=np.float32), pad]))
    # Bài IPA chấm từ trong câu khung "Say … now."; người học chỉ đọc mỗi từ thì câu khung khớp rất kém
    # (thử espeak: NLL ~40 so với ~5) và các phụ âm bị báo sai oan → chấm theo từ đứng một mình.
    if focus and gop.canonical_nll(lp, focus) + ALONE_MARGIN < gop.canonical_nll(lp, text):
        text = focus
    scored = gop.score_text(lp, text, only_word=focus, skip_words=skip)
    log.info(
        "text=%r heard=[%s] %s", text, gop.free_phones(lp),
        " ".join(f"{s.word}/{s.phone}:{s.lpr}>{s.heard or '-'}" for s in scored if s.lpr is not None),
    )
    sounds = [
        {"word": s.word, "wordIndex": s.word_index, "phone": s.phone, "lpr": s.lpr, "heard": s.heard, "status": _status(s.lpr), "scored": s.lpr is not None}
        for s in scored
    ]
    credit = [1.0 if s["status"] == "right" else UNSURE_CREDIT if s["status"] == "unsure" else 0.0 for s in sounds if s["scored"]]
    return {"score": round(100 * sum(credit) / len(credit), 1) if credit else 0.0, "sounds": sounds}


def _warm_up() -> None:
    """Nạp sẵn mô hình và espeak (lần đầu ~20 giây) để người học đầu tiên không phải chờ."""
    global ready
    started = time.time()
    gop.score_text(gop.log_posteriors(np.zeros(audio.TARGET_SR, dtype=np.float32)), "Say see now.", skip_words=frozenset())
    asr.warm_up(audio.TARGET_SR)
    ready = True
    log.info("ready after %.1fs", time.time() - started)


@app.on_event("startup")
async def startup() -> None:
    asyncio.get_running_loop().run_in_executor(None, _warm_up)


@app.get("/health")
async def health() -> dict:
    return {"ready": ready}


async def _read_upload(file: UploadFile, max_bytes: int) -> bytes:
    data = await file.read(max_bytes + 1)
    if not data or len(data) > max_bytes:
        raise HTTPException(status_code=413, detail="bad_size")
    return data


def _to_temp_file(data: bytes, filename: str | None) -> str:
    """Ghi bản ghi ra file tạm (ffmpeg / PyAV đọc từ file, đoán định dạng theo đuôi); trả đường dẫn. Người gọi phải xoá."""
    suffix = Path(filename or "rec.webm").suffix or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(data)
        return tmp.name


def _require_ready() -> None:
    if not ready:
        raise HTTPException(status_code=503, detail="warming_up")


async def _run_on_recording(path: str, task: str, work: Callable[[], dict]) -> tuple[dict, float]:
    """Chạy `work` trong luồng phụ, một lượt mỗi lúc; trả (kết quả, số giây). ValueError → 422, lỗi khác → 500.
    Luôn xoá file tạm."""
    try:
        async with gate:
            started = time.time()
            result = await run_in_threadpool(work)
            return result, time.time() - started
    except ValueError as err:
        raise HTTPException(status_code=422, detail=str(err)) from None
    except Exception:
        log.exception("%s failed", task)
        raise HTTPException(status_code=500, detail="failed") from None
    finally:
        try:
            os.remove(path)
        except OSError:
            log.warning("could not remove temp recording")


@app.post("/score")
async def score(file: UploadFile = File(...), text: str = Form(...), focus: str = Form(""), skip: str = Form("")) -> dict:
    text = " ".join(text.split())
    if not text or len(text) > MAX_TEXT:
        raise HTTPException(status_code=400, detail="bad_text")
    data = await _read_upload(file, MAX_BYTES)
    _require_ready()
    path = _to_temp_file(data, file.filename)
    skip_words = frozenset(w.lower() for w in skip.split(",") if w.strip())
    result, elapsed = await _run_on_recording(path, "scoring", lambda: _score_file(path, text, focus.strip() or None, skip_words))
    log.info("scored %d sounds in %.2fs", len(result["sounds"]), elapsed)
    return result


def _transcribe_file(path: str, lang: str, expected: str | None) -> dict:
    sound, seconds = _load_recording(path, MAX_TRANSCRIBE_SECONDS)
    heard = asr.transcribe(sound, lang)
    log.info("asr lang=%s %.1fs expected=%r heard=%r", lang, seconds, expected, list(heard.alternatives))
    return {"transcript": heard.transcript, "alternatives": list(heard.alternatives), "seconds": round(seconds, 2)}


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...), lang: str = Form("en"), expected: str = Form("")) -> dict:
    if lang not in asr.SUPPORTED_LANGS:
        raise HTTPException(status_code=400, detail="bad_lang")
    expected = " ".join(expected.split())[:MAX_EXPECTED] or None
    _require_ready()
    path = _to_temp_file(await _read_upload(file, MAX_TRANSCRIBE_BYTES), file.filename)
    result, elapsed = await _run_on_recording(path, "transcription", lambda: _transcribe_file(path, lang, expected))
    log.info("transcribed in %.2fs", elapsed)
    return result


def _normal_priority() -> None:
    """Task Scheduler chạy tác vụ ở mức ưu tiên "dưới bình thường": mỗi lượt nhận dạng chậm thêm ~0,3 giây (đo 1,6 → 1,9).
    Chỉ nâng tiến trình này lên mức bình thường, không đổi gì của hệ thống."""
    if sys.platform != "win32":
        return
    import ctypes
    from ctypes import wintypes

    normal_priority_class = 0x20
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    # HANDLE dài 64 bit: không khai báo kiểu thì ctypes cắt handle giả (-1) còn 32 bit → "handle không hợp lệ".
    kernel32.GetCurrentProcess.restype = wintypes.HANDLE
    kernel32.SetPriorityClass.argtypes = (wintypes.HANDLE, wintypes.DWORD)
    kernel32.SetPriorityClass.restype = wintypes.BOOL
    if not kernel32.SetPriorityClass(kernel32.GetCurrentProcess(), normal_priority_class):
        log.warning("could not raise process priority (error %d)", ctypes.get_last_error())


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    _normal_priority()
    uvicorn.run(app, host=HOST, port=PORT, log_level="info")
