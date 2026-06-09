$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeRoot = Join-Path $root 'work\node'
$nodeDir = Get-ChildItem -LiteralPath $nodeRoot -Directory | Select-Object -First 1

if (!$nodeDir) {
  throw '没有找到便携 Node.js。请先安装依赖，或让 Codex 重新初始化项目。'
}

$env:PATH = "$($nodeDir.FullName);$env:PATH"
$env:npm_config_cache = Join-Path $root 'work\npm-cache'

& (Join-Path $nodeDir.FullName 'npm.cmd') run docs:dev
