# Installs the EngQuiz pronunciation scoring service (OpenPronounce) as a Windows background task:
#  - starts at boot, no login needed (runs as SYSTEM); run-pronounce.cmd restarts python if it exits
#  - listens on 127.0.0.1:8765 only (not reachable from outside; Next.js /api/pronounce calls it)
# Run in an elevated PowerShell:  powershell -ExecutionPolicy Bypass -File scripts\windows\install-pronounce-service.ps1
# (ASCII only on purpose: Windows PowerShell 5.1 misreads UTF-8 scripts without a BOM.)
#Requires -RunAsAdministrator
$ErrorActionPreference = 'Stop'

$TaskName = 'EngQuiz Pronounce'
$Launcher = Join-Path $PSScriptRoot 'run-pronounce.cmd'
$ProjectDir = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$Python = Join-Path $ProjectDir '..\voice-runtime\venv\Scripts\python.exe'

if (-not (Test-Path $Launcher)) { throw "Launcher not found: $Launcher" }
if (-not (Test-Path $Python)) { throw "Python env not found: $Python" }
$Ffmpeg = Join-Path $ProjectDir '..\voice-runtime\bin\ffmpeg.exe'
if (-not (Test-Path $Ffmpeg)) { throw "ffmpeg not found: $Ffmpeg (copy ffmpeg.exe there; the SYSTEM task cannot see per-user installs)" }

$busy = Get-NetTCPConnection -LocalPort 8765 -State Listen -ErrorAction SilentlyContinue
if ($busy) { throw 'Port 8765 is already in use - stop the service running in the terminal first (Ctrl+C).' }

$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$Launcher`"" -WorkingDirectory $ProjectDir
$trigger = New-ScheduledTaskTrigger -AtStartup
$principal = New-ScheduledTaskPrincipal -UserId 'SYSTEM' -LogonType ServiceAccount -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -ExecutionTimeLimit ([TimeSpan]::Zero) `
  -RestartCount 999 -RestartInterval (New-TimeSpan -Minutes 1) `
  -MultipleInstances IgnoreNew

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings `
  -Description 'EngQuiz pronunciation scoring (OpenPronounce) on 127.0.0.1:8765. Log: logs\pronounce.log' -Force | Out-Null

Start-ScheduledTask -TaskName $TaskName
Start-Sleep -Seconds 4
Get-ScheduledTask -TaskName $TaskName | Select-Object TaskName, State | Format-Table -AutoSize
Write-Host "Installed '$TaskName'. Log: $ProjectDir\logs\pronounce.log (models load in ~1 minute)"
