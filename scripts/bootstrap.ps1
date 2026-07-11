$ErrorActionPreference = "Stop"

$repo = "rodrigojager/opencode-codex-account-pool"
$ref = if ($env:OPENCODE_CODEX_REF) { $env:OPENCODE_CODEX_REF } else { "main" }
$dataHome = if ($env:LOCALAPPDATA) { $env:LOCALAPPDATA } else { Join-Path $HOME ".local/share" }
$installDir = if ($env:OPENCODE_CODEX_PLUGIN_DIR) { $env:OPENCODE_CODEX_PLUGIN_DIR } else { Join-Path $dataHome "opencode/plugins/opencode-codex-account-pool" }
$installDir = [System.IO.Path]::GetFullPath($installDir)
$archiveUrl = "https://github.com/$repo/archive/refs/heads/$ref.zip"
$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) "opencode-codex-pool-$PID-$([guid]::NewGuid().ToString('N'))"
$stagingDir = "$installDir.new-$PID"
$backupDir = "$installDir.old-$PID"
$oldMoved = $false
$swapped = $false

function Invoke-Bun {
  param([string[]]$BunArgs)
  & $script:BunPath @BunArgs
  if ($LASTEXITCODE -ne 0) { throw "bun $($BunArgs -join ' ') failed with exit code $LASTEXITCODE" }
}

try {
  $root = [System.IO.Path]::GetPathRoot($installDir)
  if ($installDir -eq $root -or $installDir -eq [System.IO.Path]::GetFullPath($HOME)) {
    throw "Refusing unsafe install directory: $installDir"
  }

  $bunCommand = Get-Command bun -ErrorAction SilentlyContinue
  if (-not $bunCommand) {
    Write-Host "Bun was not found. Installing Bun..."
    Invoke-RestMethod https://bun.sh/install.ps1 | Invoke-Expression
    $env:PATH = "$(Join-Path $HOME '.bun/bin');$env:PATH"
    $bunCommand = Get-Command bun -ErrorAction SilentlyContinue
  }
  if (-not $bunCommand) { throw "Bun installation finished, but bun is not available in this PowerShell session." }
  $script:BunPath = $bunCommand.Source

  New-Item -ItemType Directory -Path $tempDir | Out-Null
  $archivePath = Join-Path $tempDir "plugin.zip"
  Write-Host "Downloading OpenCode Codex Account Pool..."
  Invoke-WebRequest -UseBasicParsing -Uri $archiveUrl -OutFile $archivePath
  Expand-Archive -LiteralPath $archivePath -DestinationPath $tempDir
  $sourceDir = Get-ChildItem -LiteralPath $tempDir -Directory | Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName "package.json") } | Select-Object -First 1
  if (-not $sourceDir) { throw "Downloaded archive does not contain the expected project." }

  $installParent = Split-Path -Parent $installDir
  New-Item -ItemType Directory -Path $installParent -Force | Out-Null
  Remove-Item -LiteralPath $stagingDir -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $backupDir -Recurse -Force -ErrorAction SilentlyContinue
  Move-Item -LiteralPath $sourceDir.FullName -Destination $stagingDir

  Write-Host "Preparing plugin files..."
  Push-Location $stagingDir
  try {
    Invoke-Bun @("install", "--frozen-lockfile")
    Invoke-Bun @("run", "build")
  } finally {
    Pop-Location
  }

  if (Test-Path -LiteralPath $installDir) {
    Move-Item -LiteralPath $installDir -Destination $backupDir
    $oldMoved = $true
  }
  Move-Item -LiteralPath $stagingDir -Destination $installDir
  $swapped = $true

  Push-Location $installDir
  try {
    Invoke-Bun @("./scripts/install.mjs", "--global")
  } finally {
    Pop-Location
  }

  Remove-Item -LiteralPath $backupDir -Recurse -Force -ErrorAction SilentlyContinue
  $oldMoved = $false
  Write-Host "Installed at: $installDir"
  Write-Host "Quit every OpenCode process and start it again."
} catch {
  if ($swapped -and (Test-Path -LiteralPath $installDir)) {
    Remove-Item -LiteralPath $installDir -Recurse -Force -ErrorAction SilentlyContinue
  }
  if ($oldMoved -and (Test-Path -LiteralPath $backupDir)) {
    Move-Item -LiteralPath $backupDir -Destination $installDir
  }
  throw
} finally {
  Remove-Item -LiteralPath $tempDir -Recurse -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $stagingDir -Recurse -Force -ErrorAction SilentlyContinue
}
