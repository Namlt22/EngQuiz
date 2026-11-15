# Rebuilds EngQuiz and restarts the 'EngQuiz Server' background task (after code changes or a git pull).
#   1) stop the task and its node process  2) apply DB migrations  3) next build  4) start the task
# Run in an elevated PowerShell:  powershell -ExecutionPolicy Bypass -File scripts\windows\redeploy.ps1
# (ASCII only on purpose: Windows PowerShell 5.1 misreads UTF-8 scripts without a BOM.)
#Requires -RunAsAdministrator
$ErrorActionPreference = 'Stop'
$TaskName = 'EngQuiz Server'
$ProjectDir = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
Set-Location $ProjectDir

Write-Host '== Stopping server'
Stop-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process |
  Where-Object { ($_.Name -eq 'cmd.exe' -and $_.CommandLine -like '*EngQuiz*run-server.cmd*') -or ($_.Name -eq 'node.exe' -and $_.CommandLine -like '*next*start*-p 3001*') } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

try {
  # PowerShell 5.1 turns any stderr line of a native command into an error; npm/prisma print progress there.
  # Judge success by the exit code instead.
  $ErrorActionPreference = 'Continue'
  Write-Host '== Applying database migrations'
  & npx.cmd prisma migrate deploy
  if ($LASTEXITCODE -ne 0) { throw "prisma migrate deploy failed ($LASTEXITCODE)" }

  # Stale route types left by `npm run dev` break the type-check of `next build` (and a failed build leaves no .next to serve).
  Remove-Item -Recurse -Force (Join-Path $ProjectDir '.next\dev') -ErrorAction SilentlyContinue
  Write-Host '== Building'
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) { throw "next build failed ($LASTEXITCODE)" }
} finally {
  # Start again even if the build failed (a failed build may have removed the old output: check logs\server.log).
  Write-Host '== Starting server'
  Start-ScheduledTask -TaskName $TaskName
}

Start-Sleep -Seconds 6
try {
  $code = (Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:3001/' -TimeoutSec 20).StatusCode
  Write-Host "== Health: HTTP $code"
} catch {
  Write-Host "== Health check failed: $($_.Exception.Message) (see logs\server.log)"
}
