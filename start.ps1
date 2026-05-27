$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

$port = 8765
$url  = "http://localhost:$port/index.html"

Write-Host ""
Write-Host " Living Soill - Fincas Experimentales" -ForegroundColor Green
Write-Host " ------------------------------------"
Write-Host " Servidor: $url"
Write-Host " Pulsa Ctrl+C para detener el servidor."
Write-Host ""

Start-Process $url | Out-Null

if (Get-Command py -ErrorAction SilentlyContinue) {
    & py -3 -m http.server $port
}
elseif (Get-Command python -ErrorAction SilentlyContinue) {
    & python -m http.server $port
}
elseif (Get-Command node -ErrorAction SilentlyContinue) {
    & npx --yes http-server -p $port -c-1 .
}
else {
    Write-Host "No se ha encontrado Python ni Node en el PATH." -ForegroundColor Yellow
    Write-Host "Instala Python (https://www.python.org/) o Node.js y vuelve a ejecutar este script."
    Read-Host "Pulsa ENTER para salir"
}
