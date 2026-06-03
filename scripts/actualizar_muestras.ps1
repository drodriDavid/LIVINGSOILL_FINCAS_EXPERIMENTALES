# LivingSoiLL — Publica el snapshot de muestras IoT en el repositorio.
# Copia el iot_muestras.json descargado (carpeta Descargas) a data/ y hace
# commit + push. Antes hay que generar el fichero con scripts/generar_muestras.js
# (ver instrucciones en ese archivo).
#
# Uso:  pwsh scripts/actualizar_muestras.ps1
#       (o clic derecho -> "Ejecutar con PowerShell")

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$src  = Join-Path $env:USERPROFILE 'Downloads\iot_muestras.json'
$dst  = Join-Path $repo 'data\iot_muestras.json'

if (-not (Test-Path $src)) {
    Write-Error "No se encuentra '$src'. Genera primero el fichero con scripts/generar_muestras.js (pega ese script en la consola del navegador con la sesion del Living Lab iniciada)."
}

# Validacion basica: que sea JSON valido
try { Get-Content $src -Raw | ConvertFrom-Json | Out-Null }
catch { Write-Error "El fichero descargado no es un JSON valido: $($_.Exception.Message)" }

Copy-Item $src $dst -Force
Write-Host "Copiado a $dst"

Push-Location $repo
try {
    git add data/iot_muestras.json
    $changed = git status --porcelain data/iot_muestras.json
    if (-not $changed) { Write-Host "Sin cambios respecto al snapshot actual. Nada que publicar."; return }
    $fecha = Get-Date -Format 'yyyy-MM-dd'
    git commit -m "Actualiza snapshot de muestras IoT ($fecha)"
    git push
    Write-Host "Snapshot publicado correctamente."
}
finally { Pop-Location }
