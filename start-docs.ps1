$ErrorActionPreference = 'Stop'

$docsRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue

if (!$npmCommand) {
  $portableRoot = Join-Path $docsRoot 'work\node'
  if (Test-Path -LiteralPath $portableRoot) {
    $portableNode = Get-ChildItem -LiteralPath $portableRoot -Directory |
      Sort-Object Name -Descending | Select-Object -First 1
    if ($portableNode) {
      $env:PATH = "$($portableNode.FullName);$env:PATH"
      $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
    }
  }
}

if (!$npmCommand) {
  throw '请安装 Node.js 24 LTS，然后在项目目录运行 npm ci。'
}

if (!(Test-Path -LiteralPath (Join-Path $docsRoot 'node_modules\vitepress'))) {
  throw '请先在项目目录运行 npm ci 安装文档站依赖。'
}

& $npmCommand.Source --prefix $docsRoot run docs:dev
exit $LASTEXITCODE
