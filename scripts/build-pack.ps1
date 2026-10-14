$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = Split-Path -Parent $PSScriptRoot
$packSource = Join-Path $projectRoot 'resourcepack'
$downloadFolder = Join-Path $projectRoot 'docs/downloads'
[void][IO.Directory]::CreateDirectory($downloadFolder)
$temporaryZip = Join-Path $downloadFolder ('pack-' + [Guid]::NewGuid().ToString('N') + '.zip')
$finalZip = Join-Path $downloadFolder 'TextHeadGlyph-26.2.zip'
[IO.Compression.ZipFile]::CreateFromDirectory($packSource, $temporaryZip)
Move-Item -LiteralPath $temporaryZip -Destination $finalZip -Force
Write-Output $finalZip
