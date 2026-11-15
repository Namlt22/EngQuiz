# Removes the 'EngQuiz Server' background task and stops the server it started.
# Run in an elevated PowerShell:  powershell -ExecutionPolicy Bypass -File scripts\windows\uninstall-service.ps1
#Requires -RunAsAdministrator
$ErrorActionPreference = 'Stop'
$TaskName = 'EngQuiz Server'

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
  Stop-ScheduledTask -TaskName $TaskName
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
  Write-Host "Removed '$TaskName'."
} else {
  Write-Host "No task named '$TaskName'."
}

# Stopping the task ends cmd.exe; its restart loop and the node child may survive - stop them too.
Get-CimInstance Win32_Process |
  # Match only this project's processes (Quizly also has a run-server.cmd).
  Where-Object { ($_.Name -eq 'cmd.exe' -and $_.CommandLine -like '*EngQuiz*run-server.cmd*') -or ($_.Name -eq 'node.exe' -and $_.CommandLine -like '*next*start*-p 3001*') } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; Write-Host "Stopped $($_.Name) (PID $($_.ProcessId))." }
