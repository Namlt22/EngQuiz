r"""Dịch vụ chấm phát âm tới từng âm cho EngQuiz — chỉ nghe ở 127.0.0.1 (Next.js gọi qua /api/pronounce).

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

import gop  # noqa: E402

HOST = "127.0.0.1"
PORT = int(os.environ.get("PRONOUNCE_PORT", "8765"))
MAX_BYTES = 2 * 1024 * 1024
MAX_TEXT = 200
MAX_SECONDS = 15.0
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


def _score_file(path: str, text: str, focus: str | None, skip: frozenset[str]) -> dict:
    sound = audio.load(path)
    seconds = len(sound) / audio.TARGET_SR
    if seconds < 0.2:
        raise ValueError("too_short")
    if seconds > MAX_SECONDS:
        raise ValueError("too_long")
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
    ready = True
    log.info("ready after %.1fs", time.time() - started)


@app.on_event("startup")
async def startup() -> None:
    asyncio.get_running_loop().run_in_executor(None, _warm_up)


@app.get("/health")
async def health() -> dict:
    return {"ready": ready}


@app.post("/score")
async def score(file: UploadFile = File(...), text: str = Form(...), focus: str = Form(""), skip: str = Form("")) -> dict:
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
            started = time.time()
            skip_words = frozenset(w.lower() for w in skip.split(",") if w.strip())
            result = await run_in_threadpool(_score_file, path, text, focus.strip() or None, skip_words)
            log.info("scored %d sounds in %.2fs", len(result["sounds"]), time.time() - started)
            return result
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
