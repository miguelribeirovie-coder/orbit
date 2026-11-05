# Instala a skill orbit no Claude Code (Windows).
#
#   irm https://raw.githubusercontent.com/miguelribeirovie-coder/orbit/main/instalar.ps1 | iex
#   & ([scriptblock]::Create((irm https://raw.githubusercontent.com/miguelribeirovie-coder/orbit/main/instalar.ps1))) --dentro
#
# Dentro de uma cópia do repositório, é o mesmo que: node instalar.mjs [opções]
$ErrorActionPreference = 'Stop'
$Repo = 'miguelribeirovie-coder/orbit'

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host 'Preciso do Node.js 18 ou mais novo. Baixe em https://nodejs.org e rode de novo.' -ForegroundColor Red
  return
}

if ($PSScriptRoot -and (Test-Path (Join-Path $PSScriptRoot 'instalar.mjs')) -and (Test-Path (Join-Path $PSScriptRoot 'skills\orbit'))) {
  & node (Join-Path $PSScriptRoot 'instalar.mjs') @args
  return
}

$Tmp = Join-Path ([System.IO.Path]::GetTempPath()) ('orbit-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $Tmp | Out-Null
try {
  Write-Host "Baixando $Repo..."
  if (Get-Command git -ErrorAction SilentlyContinue) {
    git clone -q --depth 1 "https://github.com/$Repo.git" (Join-Path $Tmp 'orbit')
    $Pasta = Join-Path $Tmp 'orbit'
  } else {
    $Zip = Join-Path $Tmp 'orbit.zip'
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -UseBasicParsing -Uri "https://github.com/$Repo/archive/HEAD.zip" -OutFile $Zip
    Expand-Archive -Path $Zip -DestinationPath $Tmp
    $Pasta = (Get-ChildItem -Path $Tmp -Directory | Where-Object { $_.Name -like 'orbit-*' } | Select-Object -First 1).FullName
  }
  & node (Join-Path $Pasta 'instalar.mjs') @args
} finally {
  Remove-Item -Recurse -Force $Tmp -ErrorAction SilentlyContinue
}
