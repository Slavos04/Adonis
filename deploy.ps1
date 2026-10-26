param (
    [string]$Message = "Aktualizacja aplikacji Adonis"
)

$ErrorActionPreference = "Stop"

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "   WDROŻENIE APLIKACJI ADONIS NA SERWER PRODUKCYJNY" -ForegroundColor Cyan
Write-Host "==================================================`n" -ForegroundColor Cyan

# 1. Sprawdzenie czy frontend wymaga przebudowania
Write-Host "[1/3] Budowanie frontendu (Vite)..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\frontend"
npm run build
Set-Location -Path "$PSScriptRoot"

# 2. Wypchnięcie zmian do GitHub
Write-Host "`n[2/3] Wysyłanie zmian do GitHub..." -ForegroundColor Yellow
git add -A
git commit -m $Message
git push origin main

# 3. Kopiowanie dist i wywołanie aktualizacji na serwerze
Write-Host "`n[3/3] Aktualizacja kontenerów na serwerze..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no -r "$PSScriptRoot\frontend\dist\*" slavosmm@144.24.185.60:/home/slavosmm/app/adonis/frontend/dist/
ssh -o StrictHostKeyChecking=no slavosmm@144.24.185.60 "/home/slavosmm/app/adonis/update.sh"

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "   SUKCES! Aplikacja zaktualizowana na serwerze:" -ForegroundColor Green
Write-Host "   https://adonis.slavosmm.duckdns.org" -ForegroundColor Green
Write-Host "==================================================`n" -ForegroundColor Green
