@echo off
rem EngQuiz production server launcher for Task Scheduler (runs in the background).
rem Serves the built app (npm run build) on 127.0.0.1:3001 for Cloudflare Tunnel (eng.quizly.io.vn).
rem Restarts 10 s after it exits. Log: logs\server.log. Requires Postgres (docker compose) to be up.
setlocal
cd /d "%~dp0..\.."
if not exist "logs" mkdir "logs"
set NODE_ENV=production

:loop
if exist "logs\server.log" for %%F in ("logs\server.log") do if %%~zF GTR 10485760 move /y "logs\server.log" "logs\server.log.1" >nul
echo ==== %date% %time% start ====>> "logs\server.log"
"C:\Program Files\nodejs\node.exe" node_modules\next\dist\bin\next start -H 127.0.0.1 -p 3001 >> "logs\server.log" 2>&1
echo ==== %date% %time% next exited with code %errorlevel%, restarting in 10 s ====>> "logs\server.log"
timeout /t 10 /nobreak >nul
goto loop
