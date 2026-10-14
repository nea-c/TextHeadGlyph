$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = Split-Path -Parent $PSScriptRoot
$packSource = Join-Path $projectRoot 'resourcepack'
$outputFolder = Join-Path $projectRoot 'dist'
[void][IO.Directory]::CreateDirectory($outputFolder)
$temporaryZip = Join-Path $outputFolder ('pack-' + [Guid]::NewGuid().ToString('N') + '.zip')
$finalZip = Join-Path $outputFolder 'TextHeadGlyph-26.2.zip'
[IO.Compression.ZipFile]::CreateFromDirectory($packSource, $temporaryZip)
Move-Item -LiteralPath $temporaryZip -Destination $finalZip -Force
Write-Output $finalZip
