# Skrypt uruchamiający Adonis w PowerShell
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Uruchamianie Systemu Adonis (Backend + Frontend)      " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

$RootPath = $PSScriptRoot

# Start Backend Daphne
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath'; & '.\.venv\Scripts\Activate.ps1'; daphne -b 0.0.0.0 -p 8000 adonis_backend.asgi:application"

# Start Frontend Vite
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootPath\frontend'; npm run dev"

Write-Host ""
Write-Host "System wystartował w dwóch oknach:" -ForegroundColor Yellow
Write-Host "  • Panel Webowy:       http://localhost:5173" -ForegroundColor Cyan
Write-Host "  • Swagger API Docs:   http://127.0.0.1:8000/api/docs" -ForegroundColor Cyan
Write-Host "  • Django Admin:       http://127.0.0.1:8000/admin/" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
