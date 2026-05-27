@echo off
setlocal
cd /d "%~dp0"

set PORT=8765
set URL=http://localhost:%PORT%/index.html

echo.
echo  Living Soill - Fincas Experimentales
echo  ------------------------------------
echo  Servidor: %URL%
echo  Pulsa Ctrl+C en esta ventana para detenerlo.
echo.

start "" "%URL%"

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 -m http.server %PORT%
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server %PORT%
  goto :eof
)

where node >nul 2>nul
if %errorlevel%==0 (
  npx --yes http-server -p %PORT% -c-1 .
  goto :eof
)

echo No se ha encontrado Python ni Node en el PATH.
echo Instala Python (https://www.python.org/) o Node.js y vuelve a ejecutar este script.
pause
