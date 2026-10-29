## ==============================================================================
## GŁÓWNY ROUTER API SYSTEMU ADONIS FIT & EAT (ver. 1.3)
## Integruje wszystkie moduły biznesowe: autoryzację użytkowników, bazę przepisów,
## jadłospisy z podziałem na płeć, pomiary antropometryczne z normami WHO BMI,
## komunikator czatu oraz dziennik zmian CHANGELOG.
## ==============================================================================

import os
from pathlib import Path
from ninja import NinjaAPI
from apps.authentication.api import router as auth_router
from apps.recipes.api import router as recipes_router
from apps.diet_plans.api import router as diet_plans_router
from apps.measurements.api import router as measurements_router
from apps.chat.api import router as chat_router

## Inicjalizacja instancji Django Ninja z dokumentacją interaktywną OpenAPI / Swagger
api = NinjaAPI(
    title="ADONIS fit & eat API",
    version="1.6.0",
    description="Wieloplatformowe produkcyjne API dietetyczne z obsługą jadłospisów wg płci, norm WHO BMI i WebSockets",
    docs_url="/docs"
)

## Endpoint kontrolny stanu usługi (Health Check) do monitoringu i orkiestracji serwera
@api.get("/health", tags=["System"])
def health_check(request):
    """Healthcheck dla monitoringu i orkiestracji kontenerów Docker."""
    return {"status": "ok", "service": "adonis-backend", "version": "1.6.0"}

## Endpoint zwracający historię zmian i aktualną wersję systemu
@api.get("/changelog", tags=["System"])
def get_changelog(request):
    """Zwraca aktualną wersję oraz treść dziennika zmian CHANGELOG.md."""
    base_dir = Path(__file__).resolve().parent.parent
    changelog_path = base_dir / "CHANGELOG.md"
    content = ""
    if changelog_path.exists():
        content = changelog_path.read_text(encoding="utf-8")
    return {
        "version": "1.6.0",
        "last_modified": "2026-10-29 07:00 CET",
        "changelog": content
    }

## Podpięcie dedykowanych routerów dla poszczególnych domen funkcjonalnych:
api.add_router("/auth", auth_router)                 ## Autentykacja JWT, zarządzanie rolami RBAC, profile i reset hasła
api.add_router("/recipes", recipes_router)           ## Baza 125 przepisów, produkty marketowe oraz wyszukiwarka EAN
api.add_router("/diet-plans", diet_plans_router)     ## Pakiety dietetyczne, kalendarz oraz inteligentna lista zakupów
api.add_router("/measurements", measurements_router) ## Pomiary wagi i talii, dynamiczne BMI, pasmo normy WHO i Audit Log
api.add_router("/chat", chat_router)                 ## Wiadomości czatu, liczniki nieprzeczytanych powiadomień
