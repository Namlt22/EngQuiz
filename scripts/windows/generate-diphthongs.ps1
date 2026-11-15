# Generates the 8 diphthong recordings in public/audio/ipa/ (American English, voice "Microsoft David").
# Wikimedia Commons has no stand-alone diphthong recordings, so they are synthesised with the Windows SAPI 5
# voice using its American phone set (<pron sym="..."/>), then trimmed and loudness-matched with ffmpeg.
# Requires: Windows with the "Microsoft David" voice, ffmpeg on PATH.
# Run: powershell -ExecutionPolicy Bypass -File scripts\windows\generate-diphthongs.ps1
# (ASCII only on purpose: Windows PowerShell 5.1 misreads UTF-8 scripts without a BOM.)
$ErrorActionPreference = 'Stop'
$OutDir = (Resolve-Path (Join-Path $PSScriptRoot '..\..\public\audio\ipa')).Path
# id -> SAPI American phones (US accent: centring diphthongs are r-coloured, e.g. "here" /hIr/)
$Phones = [ordered]@{ ia = 'ih 1 r'; ei = 'ey 1'; ua = 'uh 1 r'; oi = 'oy 1'; ou = 'ow 1'; ea = 'eh 1 r'; ai = 'ay 1'; au = 'aw 1' }

$voice = New-Object -ComObject SAPI.SpVoice
foreach ($t in $voice.GetVoices()) { if ($t.GetDescription() -like '*David*') { $voice.Voice = $t } }
$voice.Rate = -6
$tmp = Join-Path $env:TEMP 'engquiz-diphthongs'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

foreach ($id in $Phones.Keys) {
  $wav = Join-Path $tmp "$id.wav"
  $fmt = New-Object -ComObject SAPI.SpAudioFormat
  $fmt.Type = 22  # 22 kHz 16-bit mono
  $fs = New-Object -ComObject SAPI.SpFileStream
  $fs.Format = $fmt
  $fs.Open($wav, 3, $false)
  $voice.AudioOutputStream = $fs
  [void]$voice.Speak("<pron sym=""$($Phones[$id])""/>", 8)  # 8 = SVSFIsXML
  $fs.Close()
  $filter = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-18:TP=-2,apad=pad_dur=0.15'
  & ffmpeg -v error -y -i $wav -af $filter -ac 1 -ar 44100 -b:a 64k (Join-Path $OutDir "$id.mp3")
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed for $id" }
  Write-Host "$id.mp3"
}
