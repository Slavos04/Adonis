@echo off
chcp 65001 >nul
echo Uruchamianie wdrożenia Adonis na serwer...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy.ps1" %*
pause
