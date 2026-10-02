@echo off
cd /d "%~dp0"
title Halloween Rosa - Lelinha v44
where node >nul 2>nul
if errorlevel 1 (
  echo Instale Node.js LTS em https://nodejs.org e abra este arquivo novamente.
  pause
  exit /b 1
)
echo Halloween Rosa - Lelinha v44
echo Abra http://localhost:4173 no navegador apos o servidor iniciar.
echo Se a porta estiver ocupada, use outra porta: set PORT=4177
node server.mjs
pause
