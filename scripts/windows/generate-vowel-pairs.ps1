# Generates the short/long vowel pairs /I/ - /i:/ ("ship" - "sheep") and /U/ - /u:/ ("book" - "food")
# in public/audio/ipa/ with the "Microsoft David" voice.
# The Wikimedia recordings used before are cardinal IPA vowels with equal length, so each pair sounded almost the same.
# Here: American phones ih/iy and uh/uw; long vowels are slowed down (pitch unchanged), short ones sped up.
# Requires: Windows with the "Microsoft David" voice, ffmpeg on PATH.
# Output is named <id>-v2.mp3 (see FILE_VERSION in src/content/ipa-audio.ts: /audio is cached for 7 days).
# Run: powershell -ExecutionPolicy Bypass -File scripts\windows\generate-vowel-pairs.ps1
# (ASCII only on purpose: Windows PowerShell 5.1 misreads UTF-8 scripts without a BOM.)
$ErrorActionPreference = 'Stop'
$OutDir = (Resolve-Path (Join-Path $PSScriptRoot '..\..\public\audio\ipa')).Path
# id -> SAPI American phones, ffmpeg atempo chain (below 1 = longer, above 1 = shorter, same pitch)
$Sounds = [ordered]@{
  'i-short' = @{ phones = 'ih 1'; tempo = 'atempo=1.3' }
  'i-long'  = @{ phones = 'iy 1'; tempo = 'atempo=0.5,atempo=0.8' }
  'u-short' = @{ phones = 'uh 1'; tempo = 'atempo=1.3' }
  'u-long'  = @{ phones = 'uw 1'; tempo = 'atempo=0.5,atempo=0.8' }
}

$voice = New-Object -ComObject SAPI.SpVoice
foreach ($t in $voice.GetVoices()) { if ($t.GetDescription() -like '*David*') { $voice.Voice = $t } }
$voice.Rate = -4
$tmp = Join-Path $env:TEMP 'engquiz-vowel-pairs'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

foreach ($id in $Sounds.Keys) {
  $wav = Join-Path $tmp "$id.wav"
  $fmt = New-Object -ComObject SAPI.SpAudioFormat
  $fmt.Type = 22  # 22 kHz 16-bit mono
  $fs = New-Object -ComObject SAPI.SpFileStream
  $fs.Format = $fmt
  $fs.Open($wav, 3, $false)
  $voice.AudioOutputStream = $fs
  [void]$voice.Speak("<pron sym=""$($Sounds[$id].phones)""/>", 8)  # 8 = SVSFIsXML
  $fs.Close()
  $trim = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
  $filter = "$trim,$($Sounds[$id].tempo),loudnorm=I=-18:TP=-2,apad=pad_dur=0.15"
  & ffmpeg -v error -y -i $wav -af $filter -ac 1 -ar 44100 -b:a 64k (Join-Path $OutDir "$id-v2.mp3")
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed for $id" }
  Write-Host "$id-v2.mp3"
}
