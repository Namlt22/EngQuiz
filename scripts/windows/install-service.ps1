# Installs the EngQuiz server as a Windows background task (Task Scheduler):
#  - starts at boot, no login needed (runs as SYSTEM)
#  - run-server.cmd restarts node if it exits; the task itself is retried if it fails to start
# Run in an elevated PowerShell:  powershell -ExecutionPolicy Bypass -File scripts\windows\install-service.ps1
# (ASCII only on purpose: Windows PowerShell 5.1 misreads UTF-8 scripts without a BOM.)
#Requires -RunAsAdministrator
$ErrorActionPreference = 'Stop'

$TaskName = 'EngQuiz Server'
$Node = 'C:\Program Files\nodejs\node.exe'
$Launcher = Join-Path $PSScriptRoot 'run-server.cmd'
$ProjectDir = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path

if (-not (Test-Path $Launcher)) { throw "Launcher not found: $Launcher" }
if (-not (Test-Path $Node)) { throw "Node not found: $Node" }

$busy = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
if ($busy) { throw 'Port 3001 is already in use - stop the server running in the terminal first (Ctrl+C).' }

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
  -Description 'EngQuiz (eng.quizly.io.vn): next start on 127.0.0.1:3001. Log: logs\server.log' -Force | Out-Null

Start-ScheduledTask -TaskName $TaskName
Start-Sleep -Seconds 4
Get-ScheduledTask -TaskName $TaskName | Select-Object TaskName, State | Format-Table -AutoSize
Write-Host "Installed '$TaskName'. Log: $ProjectDir\logs\server.log"
