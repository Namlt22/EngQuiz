r"""Dịch vụ chấm phát âm tới từng âm (OpenPronounce, MIT) cho EngQuiz — chỉ nghe ở 127.0.0.1.

Next.js gọi qua /api/pronounce (đã kiểm tra đăng nhập, giới hạn lượt, kích thước file) — không mở cổng này ra ngoài.

  ..\\voice-runtime\\venv\\Scripts\\python.exe scripts\\voice\\pronounce_service.py      (cổng 8765)

Bản ghi âm chỉ nằm trong bộ nhớ / file tạm trong lúc chấm, xoá ngay sau đó; không lưu lại.
"""
from __future__ import annotations

import asyncio
import logging
import os
import tempfile
import time
from pathlib import Path

ESPEAK_DLL = Path(os.environ.get("ProgramFiles", r"C:\Program Files")) / "eSpeak NG" / "libespeak-ng.dll"
if ESPEAK_DLL.is_file():
    os.environ.setdefault("PHONEMIZER_ESPEAK_LIBRARY", str(ESPEAK_DLL))
# Giọng chuẩn để so âm học: Kokoro chạy offline (mặc định của OpenPronounce là gTTS, cần mạng).
os.environ.setdefault("OPENPRONOUNCE_TTS", "kokoro")
os.environ.setdefault("OPENPRONOUNCE_TTS_VOICE", "af_heart")

import uvicorn  # noqa: E402
from fastapi import FastAPI, File, Form, HTTPException, UploadFile  # noqa: E402
from fastapi.concurrency import run_in_threadpool  # noqa: E402
from openpronounce import audio, phones, speech  # noqa: E402

HOST = "127.0.0.1"
PORT = int(os.environ.get("PRONOUNCE_PORT", "8765"))
MAX_BYTES = 2 * 1024 * 1024
MAX_TEXT = 200
MAX_SECONDS = 15.0

log = logging.getLogger("engquiz.pronounce")
app = FastAPI(title="EngQuiz pronunciation", docs_url=None, redoc_url=None, openapi_url=None)
# Một lượt chấm mỗi lúc: mô hình wav2vec2 chiếm nhiều RAM / CPU, chấm song song chỉ làm mọi người chờ lâu hơn.
gate = asyncio.Semaphore(1)
ready = False


def _word_sounds(sound, text: str) -> list[dict]:
    """Từng âm của MỌI từ (kể cả từ OpenPronounce không báo lỗi).

    OpenPronounce chỉ báo một từ khi lỗi cộng lại đủ 40% số âm, và tính lỗi "gần" (hữu thanh/vô thanh, căng/chùng)
    bằng nửa lỗi — nên một âm sai trong từ ba âm (ship → sheep, van → fan) không bao giờ được báo. Bài luyện một âm IPA
    cần đúng thông tin đó, nên trả về báo cáo từng âm của mọi từ để app tự xét âm đang học.
    """
    recognition = phones.recognize_phones(sound, audio.TARGET_SR, lang="en")
    return [
        {
            "word": r["word"],
            "expected": r["expected"],
            "heard": r["actual"],
            "phones": [{"expected": p["expected"], "heard": p["heard"], "confidence": round(p["confidence"], 3)} for p in r["phones"]],
        }
        for r in phones._word_reports(recognition, text, lang="en")
    ]


def _slim(result: dict) -> dict:
    """Chỉ giữ phần app dùng (bỏ đường cao độ / năng lượng và vector căn chỉnh)."""
    diff = result["differences"]
    return {
        "score": round(float(result["score"]), 1),
        "transcript": result.get("transcribe", ""),
        "phoneErrorRate": diff.get("phoneme_error_rate"),
        "wordErrorRate": diff.get("word_error_rate"),
        "expectedPhones": diff.get("expected_phones"),
        "heardPhones": diff.get("heard_phones"),
        "errors": [
            {
                "word": e.get("word"),
                "expected": e.get("expected"),
                "heard": e.get("actual"),
                "confidence": e.get("confidence"),
                "phones": [
                    {"expected": p.get("expected"), "heard": p.get("heard"), "confidence": p.get("confidence")}
                    for p in e.get("phones", [])
                ],
            }
            for e in diff.get("errors", [])
        ],
    }


def _score_file(path: str, text: str) -> dict:
    sound = audio.load(path)
    seconds = len(sound) / audio.TARGET_SR
    if seconds < 0.2:
        raise ValueError("too_short")
    if seconds > MAX_SECONDS:
        raise ValueError("too_long")
    return {**_slim(speech.compare_audio_with_text(sound, text, lang="en")), "words": _word_sounds(sound, text)}


def _warm_up() -> None:
    """Nạp sẵn mô hình (lần đầu mất ~20–40 giây) để người học đầu tiên không phải chờ."""
    global ready
    started = time.time()
    silence = audio.text2speech("Hello there.", lang="en")
    speech.compare_audio_with_text(audio.load(silence), "Hello there.", lang="en")
    ready = True
    log.info("ready after %.1fs", time.time() - started)


@app.on_event("startup")
async def startup() -> None:
    asyncio.get_running_loop().run_in_executor(None, _warm_up)


@app.get("/health")
async def health() -> dict:
    return {"ready": ready}


@app.post("/score")
async def score(file: UploadFile = File(...), text: str = Form(...)) -> dict:
    text = " ".join(text.split())
    if not text or len(text) > MAX_TEXT:
        raise HTTPException(status_code=400, detail="bad_text")
    data = await file.read(MAX_BYTES + 1)
    if not data or len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="bad_size")
    if not ready:
        raise HTTPException(status_code=503, detail="warming_up")
    suffix = Path(file.filename or "rec.webm").suffix or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(data)
        path = tmp.name
    try:
        async with gate:
            return await run_in_threadpool(_score_file, path, text)
    except ValueError as err:
        raise HTTPException(status_code=422, detail=str(err)) from None
    except Exception:
        log.exception("scoring failed")
        raise HTTPException(status_code=500, detail="failed") from None
    finally:
        try:
            os.remove(path)
        except OSError:
            log.warning("could not remove temp recording")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    uvicorn.run(app, host=HOST, port=PORT, log_level="info")
