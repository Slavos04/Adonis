@echo off
chcp 65001 >nul
echo ========================================================
echo   Uruchamianie Systemu Adonis (Backend + Frontend)
echo ========================================================
echo.

echo 1. Startowanie backendu Django ASGI (Daphne) na porcie 8000...
start "Adonis Backend (Daphne)" cmd /k "cd /d %~dp0 && .\.venv\Scripts\activate.bat && daphne -b 0.0.0.0 -p 8000 adonis_backend.asgi:application"

echo 2. Startowanie frontendu React + Vite na porcie 5173...
start "Adonis Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   Aplikacja zostala uruchomiona!
echo.
echo   - Aplikacja Webowa:  http://localhost:5173
echo   - Dokumentacja API:   http://127.0.0.1:8000/api/docs
echo   - Panel Django Admin: http://127.0.0.1:8000/admin/
echo ========================================================
echo.
pause
