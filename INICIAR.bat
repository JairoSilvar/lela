@echo off
cd /d "%~dp0"
title Halloween Rosa - Servidor

where node >nul 2>nul
if errorlevel 1 (
  echo Instale Node.js LTS em https://nodejs.org e abra este arquivo novamente.
  pause
  exit /b 1
)

echo Encerrando servidor anterior na porta 4173 (se existir)...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":4173" ^| findstr "LISTENING"') do (
  echo  - Encerrando PID %%P
  taskkill /PID %%P /F >nul 2>nul
)
timeout /t 1 /nobreak >nul

echo Iniciando Halloween Rosa em http://localhost:4173
start "" http://localhost:4173
node server.mjs
echo.
echo Servidor encerrado.
pause
