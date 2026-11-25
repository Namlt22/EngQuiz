# Dịch vụ giọng nói (chấm phát âm + nhận dạng lời nói)

`pronounce_service.py` nghe ở `127.0.0.1:8765`; Next.js gọi qua `/api/pronounce` (chấm GOP, `gop.py`) và
`/api/transcribe` (Whisper, `asr.py`). Môi trường chạy nằm **ngoài repo**, ở thư mục anh em `..\voice-runtime`
(venv, mô hình, ffmpeg — vài GB, không đưa lên GitHub):

```
D:\C-121126\
  EngQuiz\          ← repo này
  voice-runtime\
    venv\           ← Python 3.12
    hf\             ← HF_HOME: mô hình đã tải
    bin\ffmpeg.exe  ← tác vụ chạy dưới SYSTEM không thấy ffmpeg cài theo người dùng
    reference-cache\ ← OPENPRONOUNCE_CACHE_DIR (tự tạo)
```

## Dựng lại trên máy mới (Windows)

1. **Phần mềm hệ thống**
   - Python 3.12 (64-bit).
   - [eSpeak NG](https://github.com/espeak-ng/espeak-ng/releases) 1.52 cài vào `C:\Program Files\eSpeak NG\`
     (dịch vụ tự tìm `libespeak-ng.dll` ở đó).
   - ffmpeg (bản đang chạy: 9.0 của gyan.dev) — chép `ffmpeg.exe` vào `voice-runtime\bin\`.

2. **Gói Python** (khoá đúng phiên bản đang chạy, gồm torch bản CPU):

   ```powershell
   cd D:\C-121126
   py -3.12 -m venv voice-runtime\venv
   voice-runtime\venv\Scripts\python.exe -m pip install -r EngQuiz\scripts\voice\requirements.txt
   ```

   `openpronounce` phải giữ **0.3.0** (MIT); từ 1.x thư viện đổi sang AGPL.

3. **Mô hình** (~5 GB, tải một lần vào `voice-runtime\hf`):

   ```powershell
   $env:HF_HOME = "D:\C-121126\voice-runtime\hf"
   voice-runtime\venv\Scripts\python.exe -c "from huggingface_hub import snapshot_download as d; [d(r) for r in ['facebook/wav2vec2-lv-60-espeak-cv-ft','facebook/wav2vec2-large-960h','Systran/faster-whisper-small','hexgrad/Kokoro-82M']]"
   ```

   | Mô hình | Dùng cho |
   |---|---|
   | `facebook/wav2vec2-lv-60-espeak-cv-ft` | chấm từng âm (GOP) |
   | `facebook/wav2vec2-large-960h` | OpenPronounce |
   | `Systran/faster-whisper-small` | nhận dạng lời nói (`asr.py`) |
   | `hexgrad/Kokoro-82M` | tạo giọng đọc mẫu (`generate_kokoro.py`, `generate_ipa_sounds.py`) |

   Khi chạy, dịch vụ đặt `HF_HUB_OFFLINE=1` nên không tự tải thiếu — phải tải ở bước này.

4. **Chạy thử**, rồi cài thành tác vụ nền (PowerShell quyền quản trị):

   ```powershell
   cd D:\C-121126\EngQuiz
   scripts\windows\run-pronounce.cmd
   powershell -ExecutionPolicy Bypass -File scripts\windows\install-pronounce-service.ps1
   ```

   Sẵn sàng khi `http://127.0.0.1:8765/health` trả `{"ready":true}` (lần đầu ~20 giây). Log: `logs\pronounce.log`.

5. **Giọng đọc mẫu** `public/audio/voice/` (không có trên GitHub, ~26 MB): tạo lại bằng `generate_kokoro.py`
   (xem đầu file). Âm IPA `public/audio/ipa/` đã có sẵn trong repo.

## Cập nhật requirements.txt

Sau khi thêm / nâng gói trong venv:

```powershell
voice-runtime\venv\Scripts\python.exe -m pip freeze
```

rồi chép vào `requirements.txt`, giữ phần đầu file (kho torch CPU) và đổi dòng `openpronounce @ file:///…`
thành `openpronounce==0.3.0`.
