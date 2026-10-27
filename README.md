# ADONIS fit & eat (ver. 1.1)
### Kompleksowy System Dietetyczny, Zarządzania Jadłospisami i Monitorowania Sylwetki (Web & Android)

**ADONIS fit & eat** to produkcyjny, zaawansowany system dietetyczny wspomagający trwałą i bezpieczną redukcję masy ciała oraz bieżącą współpracę pacjenta z wykwalifikowanym dietetykiem. Aplikacja łączy w sobie intuicyjny interfejs webowy (React/Vite), wydajny asynchroniczny backend (Django Ninja + WebSockets) oraz w pełni natywną aplikację mobilną na system Android (Kotlin + Jetpack Compose).

---

## 🌟 Główne Możliwości i Moduły

### 1. 📊 Wykresy Postępów, Pomiary i Dynamiczne BMI (Norma WHO)
- **Monitoring Wagi i Rozmiaru Talii**: Rejestracja i wizualizacja pomiarów w czasie na interaktywnych wykresach.
- **Dynamiczne BMI**: Automatyczne wyliczanie wskaźnika masy ciała na podstawie najnowszej wagi i wzrostu pacjenta ($BMI = \frac{\text{waga [kg]}}{(\text{wzrost [m]})^2}$).
- **Korytarz Normy WHO (18.5 – 24.9)**:
  - Zielone pasmo referencyjne bezpośrednio na wykresie wagi, reprezentujące idealny zakres wagowy dla wzrostu danego pacjenta.
  - Dedykowany tryb wykresu **Wskaźnik BMI** z dynamicznym kolorowym oznaczeniem statusu (Niedowaga, Norma, Nadwaga, Otyłość).
  - Wygodna, szybka edycja wzrostu pacjenta (zarówno przez pacjenta, jak i dietetyka) z poziomu wykresu i formularza pomiarów.

### 2. 🥗 Baza Ponad 125 Przepisów i Produkty Rynkowe
- Gotowa baza ponad 125 sprawdzonych przepisów redukcyjnych z podziałem na kategorie (Śniadania, II Śniadania, Obiady, Przekąski, Kolacje).
- Szczegółowe instrukcje przygotowania krok po kroku oraz precyzyjne makroskładniki (Kalorie, Białko, Tłuszcze, Węglowodany).
- Produkty oparte na realnym asortymencie polskich sieci marketów (m.in. Lidl, Biedronka, Kaufland, Carrefour) oraz integracja z Open Food Facts API (skaner kodów EAN-13).

### 3. ⚖️ Matematyczne Skalowanie Porcji i Agregacja Zakupów
- **Skalowanie porcji**: Płynne przeliczanie gramatury składników i makroskładników w czasie rzeczywistym (np. 1.2x, 1.5x porcji).
- **Inteligentna Lista Zakupów**:
  - Automatyczna agregacja identycznych składników z wybranych dni i posiłków.
  - Odznaczanie kupionych produktów (`is_bought`) oraz oznaczanie produktów już posiadanych w domu (`is_skipped`).
  - **Tryb One-Stop-Shop**: Funkcja umożliwiająca zrobienie całych zakupów w jednym wybranym markecie.

### 4. 💬 Czat w Czasie Rzeczywistym (WebSockets)
- Natychmiastowa, bezpieczna komunikacja pacjenta z przypisanym dietetykiem.
- Działanie w oparciu o Django Channels i protokół WebSockets (WSS).
- Liczniki nieprzeczytanych wiadomości i powiadomień synchronizowane pomiędzy przeglądarką a telefonem.

### 5. 👥 Role i Kontrola Dostępu (RBAC & Audit Log)
- **Pacjent**: Przegląd jadłospisu, listy zakupów, dodawanie pomiarów, podgląd wykresów wagi/talii/BMI, czat z dietetykiem.
- **Dietetyk**: Zarządzanie podopiecznymi, tworzenie i przypisywanie pakietów dietetycznych, dodawanie własnych przepisów i produktów, edycja celów i wzrostu pacjenta, historia audytowa zmian pomiarów (Audit Log).
- **Administrator**: Zarządzanie użytkownikami, przypisywanie pacjentów do dietetyków, pełny audyt operacji w systemie.

---

## 🏗️ Architektura Technologiczna

| Warstwa | Zastosowane Technologie |
|---|---|
| **Backend API** | Python 3.12+ / Django 5 / Django Ninja (OpenAPI/Swagger) |
| **Komunikacja Real-time** | Django Channels (ASGI), Daphne, WebSockets |
| **Baza Danych** | PostgreSQL (produkcja), SQLite (testy i development) |
| **Autoryzacja** | JWT (Dual-layer: HttpOnly cookies dla Web, Bearer token dla Android) |
| **Aplikacja Webowa** | React 18, Vite, Lucide Icons, Vanilla CSS (Glassmorphism / Design Tokens) |
| **Aplikacja Mobilna** | Android (Kotlin, Jetpack Compose, Material Design 3, Retrofit 2, OkHttp WS) |
| **Konteneryzacja** | Docker, Docker Compose, wsparcie Multi-Arch (x86_64 / ARM64) |

---

## 🚀 Szybki Start (Środowisko Lokalne)

### 1. Uruchomienie Backendu (Django Ninja + Daphne)
```powershell
# Aktywacja środowiska wirtualnego:
.\.venv\Scripts\Activate.ps1

# Wykonanie migracji bazy danych:
python manage.py migrate

# (Opcjonalnie) Wgranie bazy 125 przepisów:
python manage.py seed_recipes

# Uruchomienie asynchronicznego serwera ASGI:
daphne -b 127.0.0.1 -p 8000 adonis_backend.asgi:application
```
- Dokumentacja API Swagger: `http://127.0.0.1:8000/api/docs`
- Panel administracyjny: `http://127.0.0.1:8000/admin/`

### 2. Uruchomienie Aplikacji Webowej (React + Vite)
```powershell
cd frontend
npm install
npm run dev
```
Aplikacja otwiera się pod adresem: `http://localhost:5173`

### 3. Aplikacja Android
Projekt Android znajduje się w katalogu `/android`.
- Otwórz katalog `/android` w programie **Android Studio** lub zbuduj plik APK za pomocą Gradle:
  ```powershell
  cd android
  .\gradlew.bat assembleDebug
  ```
- Gotowy plik instalacyjny znajduje się w:
  `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔑 Domyślne Konta Użytkowników (Wygenerowane przez seed)

| Rola | Adres E-mail | Hasło |
|---|---|---|
| **Administrator** | `admin@adonis.app` | `Admin123!` |
| **Dietetyk** | `dietetyk@adonis.app` | `Dietetyk123!` |
| **Pacjent** | `pacjent@adonis.app` | `Pacjent123!` |

---

## 📬 Kontakt i Wsparcie Techniczne

- **E-mail**: [slavosmm@gmail.com](mailto:slavosmm@gmail.com)
- **Wersja**: `1.0 (Produkcyjna)`
- **Prawa autorskie**: © 2026 ADONIS fit & eat. Wszelkie prawa zastrzeżone.
