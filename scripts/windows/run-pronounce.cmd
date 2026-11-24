@echo off
rem EngQuiz pronunciation scoring + speech recognition service (OpenPronounce, Whisper) for Task Scheduler.
rem Listens on 127.0.0.1:8765 only; Next.js calls it from /api/pronounce and /api/transcribe. Restarts 10 s after it exits.
rem Python env: ..\voice-runtime\venv (see scripts\voice\generate_kokoro.py), plus "pip install faster-whisper"
rem and the Systran/faster-whisper-small model in %HF_HOME%. Log: logs\pronounce.log
setlocal
cd /d "%~dp0..\.."
if not exist "logs" mkdir "logs"
set "RUNTIME=%~dp0..\..\..\voice-runtime"
set "HF_HOME=%RUNTIME%\hf"
set "OPENPRONOUNCE_CACHE_DIR=%RUNTIME%\reference-cache"
set "PYTHONIOENCODING=utf-8"
rem Without this Python buffers the redirected log and nothing shows up until the buffer fills.
set "PYTHONUNBUFFERED=1"
rem The task runs as SYSTEM, which does not see per-user installs (winget ffmpeg). Browser recordings are webm/opus and
rem need ffmpeg to decode, so ship our own copy: ..\voice-runtime\bin\ffmpeg.exe (copied from the winget package).
set "PATH=%RUNTIME%\bin;%PATH%"

:loop
if exist "logs\pronounce.log" for %%F in ("logs\pronounce.log") do if %%~zF GTR 10485760 move /y "logs\pronounce.log" "logs\pronounce.log.1" >nul
echo ==== %date% %time% start ====>> "logs\pronounce.log"
"%RUNTIME%\venv\Scripts\python.exe" scripts\voice\pronounce_service.py >> "logs\pronounce.log" 2>&1
echo ==== %date% %time% service exited with code %errorlevel%, restarting in 10 s ====>> "logs\pronounce.log"
timeout /t 10 /nobreak >nul
goto loop
