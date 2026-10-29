## [1.6] � 2026-10-29 07:00 CET

### Import diety z PDF (NFZ)
- Nowe narz�dzie importu jad�ospisu z pliku PDF (diety.nfz.gov.pl) w panelu dietetyka
- Drag & drop lub wyb�r pliku PDF � automatyczne wyodr�bnienie przepis�w, kategorii posi�k�w, makrosk�adnik�w i sk�adnik�w
- Inteligentna deduplikacja przepis�w (ponowne u�ycie istniej�cego zamiast duplikatu)
- Automatyczne przypisanie �r�d�a: https://diety.nfz.gov.pl/ do ka�dego przepisu
- Import szablonu M_1500_cal (28 dni, 112 posi�k�w, 89 nowych przepis�w)
- Endpoint API: POST /api/diet-plans/import-pdf (multipart/form-data), dost�pny tylko dla dietetyka/admina

### Rok urodzenia pacjenta
- Pole birth_year w profilu pacjenta wy�wietlane jako obliczony wiek
- Wiek pacjenta widoczny w nag��wku panelu dietetyka przy wyborze pacjenta
- Pole roku urodzenia w formularzu cel�w dietetycznych z podgl�dem obliczonego wieku
# Dziennik Zmian (CHANGELOG) — ADONIS fit & eat

Format oparty na [Keep a Changelog](https://keepachangelog.com/pl/1.0.0/).
Projekt stosuje zasadę: **każda kolejna zmiana w projekcie podnosi numer wersji o 0.1** (np. `1.0` -> `1.1` -> `1.2`).

---

## [1.5] — 2026-10-28
**Data modyfikacji:** 2026-10-28 20:40 CET

### Usprawnienia i Nowości (Improvements & Features)
1. **Aplikacja webowa & Moduł Pobierania — Podmiana kodu QR na AdonisQR.png:**
   - W oknie informacyjnym „O aplikacji” (`AppInfoModal.jsx`) oraz na stronie pobierania (`pobierz.html`) podmieniono dotychczasowy kod QR na oficjalny, artystyczny kod `AdonisQR.png` z centralnym logotypem Adonis oraz motywem Cyber-Fit.
   - Zapewniono automatyczne serwowanie i caching pliku `AdonisQR.png` w katalogu publicznym aplikacji frontendowej.

---

## [1.4] — 2026-10-28
**Data modyfikacji:** 2026-10-28 19:30 CET

### Usprawnienia i Nowości (Improvements & Features)
1. **Aplikacja webowa — Naprawa błędu renderowania widoku pacjenta:**
   - Wykryto i naprawiono błąd krytyczny powodujący brak renderowania widoku po zalogowaniu na konto pacjenta (`ReferenceError: Activity is not defined` w `Navbar.jsx`). Dodano brakujący import ikony `Activity` z biblioteki `lucide-react`.
   - Otoczono główny layout aplikacji (`MainLayout`) komponentem `ErrorBoundary`, zabezpieczając cały interfejs przed białym ekranem w przypadku nieprzewidzianych wyjątków i wyświetlając czytelny komunikat z przyciskiem przeładowania.
2. **Aplikacja webowa — Artystyczny kod QR w sekcji Info:**
   - W oknie „O aplikacji” (`AppInfoModal.jsx`) zaimplementowano artystyczną sekcję pobierania aplikacji mobilnej.
   - Wdrożono dynamiczny, w pełni funkcjonalny kod QR (`QRCodeSVG` z `qrcode.react`), który aparatem dowolnego telefonu natychmiast prowadzi do pobrania aktualnego pliku `.apk`.
   - Dodano estetyczny motyw wizualny *Cyber-Fit* w kolorystyce szmaragdowo-neonowej, cyberpunkowy podgląd potrawy oraz przyciski szybkiego pobierania pliku i kopiowania bezpośredniego linku do schowka.
3. **Aplikacja mobilna Android & Serwer Produkcyjny:**
   - Podniesiono wersję aplikacji mobilnej do `1.4.0` (versionCode 6).
   - Skompilowano oficjalne wydanie release APK `Adonis-fit-and-eat-v1.4.apk` i wdrożono bezpośrednio na serwer produkcyjny pod publicznym adresem `https://adonis.slavosmm.duckdns.org/Adonis-fit-and-eat-v1.4.apk`.
   - Zaktualizowano `version.js` oraz stopkę aplikacji do wersji 1.4.

---

## [1.3] — 2026-10-28
**Data modyfikacji:** 2026-10-28 07:20 CET

### Usprawnienia i Nowości (Improvements & Features)
1. **Aplikacja webowa — Przycisk "Zamknij" w oknie Ustawień:**
   - Dodano wyraźny przycisk "Zamknij" w dolnym pasku modala Ustawień, umożliwiający intuicyjne wyjście z konfiguracji.
2. **Aplikacja webowa — Pełna historia zaleceń i wgląd do jadłospisów:**
   - Zastąpiono pojedyncze ostatnie zalecenie pełnym oknem historii zaleceń i przypisanych jadłospisów (`RecommendationsHistoryModal.jsx`).
   - Użytkownik ma dostęp do chronologicznej osi czasu zaleceń dietetyka oraz interaktywnego wglądu do wszystkich pakietów jadłospisów wraz z 7-dniowym harmonogramem posiłków, nazwami dań, kaloriami i makroskładnikami.
3. **Aplikacja webowa — Nowe menu "Pomiary" w belce górnej:**
   - Dodano zakładkę "Pomiary" w głównym pasku nawigacyjnym aplikacji webowej (`MeasurementsPage.jsx`).
   - Wdrożono zestaw tych samych informacji i funkcji co w aplikacji mobilnej: kafelki wagi i trendu, interaktywny wykres trendu wagi i obwodu talii, klasyfikację BMI wg norm WHO, szybką edycję wzrostu pacjenta, pełną tabelę historii pomiarów z opcją usuwania, formularz dodawania nowego pomiaru oraz przycisk wglądu do zaleceń.
4. **Web & Mobile — Kategoryzacja listy zakupów oraz zbiorczy checkbox:**
   - Produkty na liście zakupów są automatycznie grupowane w czytelne sekcje: Warzywa, Owoce, Nabiał, Mięso i wędliny, Ryby i owoce morza, Pieczywo, Produkty zbożowe, Tłuszcze, nasiona i orzechy oraz Inne produkty.
   - Dodano ogólny master-checkbox ("Zaznacz wszystkie / Odznacz wszystkie") umożliwiający jednym kliknięciem oznaczenie wszystkich pozycji jako kupione/niekupione zarówno w aplikacji webowej (`ShoppingListWidget.jsx`), jak i mobilnej (`ShoppingListScreen.kt`).
   - Wdrożono dedykowany endpoint backendu `/api/diet-plans/shopping-list/bulk-toggle` dla optymalizacji wydajności.
5. **Aplikacja webowa — Bezpieczeństwo usunięcia konta (Strefa niebezpieczna w Ustawieniach):**
   - Usunięto ikonę kosza i usuwanie konta z górnej belki nawigacyjnej, eliminując ryzyko przypadkowego kliknięcia obok wylogowania.
   - Opcję usunięcia konta z dwuetapowym potwierdzeniem hasłem przeniesiono do sekcji "Strefa niebezpieczna" w oknie Ustawienia.
6. **Aplikacja mobilna — Numer wersji bez dopisku "Produkcyjna" i wdrożenie na serwer:**
   - W oknie informacji o aplikacji (`AppInfoDialog.kt`) wyświetlany jest wyłącznie czysty numer wersji (`1.3`), usunięto słowo "Produkcyjna".
   - Podniesiono wersję aplikacji do `1.3.0` (versionCode 5), zbudowano oficjalny plik release APK i wdrożono bezpośrednio na serwer produkcyjny pod adresem `https://adonis.slavosmm.duckdns.org/Adonis-fit-and-eat-v1.3.apk`.
7. **Baza przepisów, weryfikacja diety redukcyjnej i miary kuchenne:**
   - Przeprowadzono audyt 291 przepisów i ich fotografii (weryfikacja spójności i jakości).
   - Zweryfikowano poprawność jadłospisów diety redukcyjnej: w standardowej redukcji stosowany jest pełnowartościowy nabiał niskotłuszczowy (nabiał bez laktozy zarezerwowany jest ściśle dla jednostek klinicznych takich jak WZJG / Colitis Ulcerosa).
   - Dodano przeliczanie i prezentację miar kuchennych obok gramatury dla każdego składnika (np. łyżki, łyżeczki, szklanki, sztuki, plastry, garście) zarówno w skalerze porcji, jak i w widokach posiłków na webie i w aplikacji mobilnej.

---

## [1.2] — 2026-10-28
**Data modyfikacji:** 2026-10-28 05:48 CET

### Usprawnienia i Poprawki (Improvements & Fixes)
1. **Aplikacja mobilna — Ujednolicenie i naprawa motywów kolorystycznych:**
   - Wdrożono spójne motywy zgodne z aplikacją webową: `ciemny` (Dark), `jasny` (Light), `ocean` (Ocean Teal) oraz `las` (Forest Emerald).
   - Zapewniono natychmiastowe dynamiczne przełączanie motywu bez konieczności restartu aplikacji (`Theme.kt`, `SettingsScreen.kt`, `MainActivity.kt`).
2. **Aplikacja mobilna — Naprawa powiadomień systemowych (Android 13+ / API 33-34):**
   - Dodano uprawnienia `POST_NOTIFICATIONS`, `SCHEDULE_EXACT_ALARM`, `USE_EXACT_ALARM`, `RECEIVE_BOOT_COMPLETED` oraz `VIBRATE`.
   - Zaimplementowano inicjalizację kanałów powiadomień (`NotificationChannel`: `meal_reminders` oraz `general_notifications`) podczas startu aplikacji (`NotificationHelper.kt`, `AdonisApplication.kt`), co aktywuje systemowy przełącznik "Zezwalaj na pokazywanie powiadomień" w ustawieniach telefonu.
   - Wdrożono `MealReminderReceiver` z obsługą powiadomień o posiłkach o zaplanowanych porach (śniadanie, II śniadanie, obiad, podwieczorek, kolacja) oraz przycisk testowy w menu Ustawienia.
3. **Ekran jadłospisu — Usunięcie banera posiłku:**
   - Usunięto baner "Zbliża się czas na posiłek!" z głównego widoku dnia w telefonie, zapewniając przejrzysty i czysty interfejs.
4. **Ekran jadłospisu — Przeniesienie kafelka "Załaduj jadłospis":**
   - Kafelek "Załaduj jadłospis" przeniesiono na lewo od selektora daty, z czytelnym tekstem w dwóch wierszach (`Załaduj\njadłospis`).
5. **Menu Pomiary — Przeniesienie przycisku "Zalecenia":**
   - Przycisk "Zalecenia" został przeniesiony z ekranu posiłków do menu "Pomiary", w nagłówku obok wskaźnika BMI.
6. **Menu Zakupy — Wybór zakresu dat oraz szybkie kafelki:**
   - Dodano selektor dat (zakres `Od` – `Do` z kalendarzem `DatePickerDialog`).
   - Wprowadzono kafelki szybkiego wyboru (`1d`, `3d`, `5d`, `7d`, `14d`), które po kliknięciu automatycznie uzupełniają daty od dnia bieżącego i odświeżają listę.
7. **Menu Zakupy — Usunięcie zduplikowanego wiersza ze sklepami:**
   - Zlikwidowano redundantny podwójny wiersz z nazwami marketów, pozostawiając pojedynczy, czysty wiersz filtrów (`Wszystkie`, `Lidl`, `Biedronka`, `Kaufland`, `Carrefour`).
8. **Menu Pomiary — Poziomy trend wagi i talii:**
   - Zmodyfikowano "Wykres trendu wagi i talii" (`MeasurementsChart.kt`): wskaźnik trendu (np. `-1.5 kg`) został przeniesiony do dedykowanego wiersza pod tytułem wykresu, eliminując pionowe zawijanie tekstu.
9. **Pełne przewijanie ekranów (Scroll góra-dół):**
   - Wszystkie ekrany menu (`Jadłospis`, `Zakupy`, `Pomiary`, `Ustawienia`, `Czat`) otrzymały pełną obsługę pionowego przewijania (`LazyColumn` / `verticalScroll`), gwarantując wygodne korzystanie na dowolnym rozmiarze ekranu smartfona.
10. **Jadłospisy — Minimalizacja gotowania oraz historia zaleceń:**
    - Zoptymalizowano bazę przepisów i pakiety diet: posiłki (śniadania, drugie śniadania, podwieczorki oraz obiady) zostały zmodyfikowane pod kątem zerowego lub minimalnego czasu gotowania (5–10 min: wrapy pełnoziarniste, sałatki śródziemnomorskie, bowls, owsianki, serki wiejskie, skyr).
    - W oficjalnych zaleceniach automatycznie zapisywany jest tytuł bieżącego jadłospisu, data wprowadzenia, okres obowiązywania oraz chronologiczna historia wszystkich przesłanych pacjentowi pakietów (`PatientRecommendation`).
11. **Rygorystyczna kontrola dostępu do diet:**
    - Pacjent (zarówno w aplikacji mobilnej, jak i webowej) posiada dostęp wyłącznie do pakietów przesłanych mu przez jego dietetyka w paczkach — brak dostępu do globalnych szablonów innych pacjentów/dietetyków.

---

## [1.1] — 2026-10-27
**Data modyfikacji:** 2026-10-27 22:15 CET

### Dodano (Added)
- **Podział jadłospisów i gramatur składników według płci:**
  - Wprowadzono pola `amount_female_g` oraz `amount_male_g` w modelu składników receptur (`RecipeIngredient`).
  - Przepisy automatycznie dopasowują gramatury składników i wyliczają odrębne makroskładniki (kcal, białko, tłuszcze, węglowodany) dla kobiet i mężczyzn.
  - Generowanie inteligentnej listy zakupów (`SmartShoppingList`) z automatyczną agregacją ilości produktów dla płci pacjenta.
  - Przelicznik porcji (`PortionScalerModal`) z bezpośrednim podglądem gramatur dla kobiet (`👩 K`) oraz mężczyzn (`👨 M`).
- **Kategoryzacja pakietów dietetycznych dla płci:**
  - Dodano atrybut `target_gender` (`female`, `male`, `all`) w szablonach pakietów (`DietPlanTemplate`).
  - Filtry i identyfikatory wizualne płci (`Wszystkie`, `👩 Kobiety`, `👨 Mężczyźni`) w oknie ładowania pakietu oraz w panelu administratora.
  - Zasilono bazę 10 certyfikowanymi pakietami 7-dniowymi:
    - 4 pakiety dla kobiet (1500–1750 kcal)
    - 4 pakiety dla mężczyzn (2000–2400 kcal)
    - 2 pakiety uniwersalne (Dla każdego)
- **Bezpieczeństwo i uprawnienia pacjenta:**
  - Pacjent ma wgląd wyłącznie do jadłospisów i pakietów dietetycznych przesłanych mu przez przypisanego dietetyka.
  - Pacjent zachowuje ciągły dostęp do historii wszystkich dotychczas przypisanych pakietów (zarówno starych, jak i nowo dosłanych).
- **Nowy logotyp aplikacji:**
  - Wdrożono nowy znak graficzny: zielona litera 'A' harmonijnie spleciona ze świeżym liściem (plik `logo.png` oraz ikona `app-icon.png`).
  - Zaktualizowano ikony w nawigacji webowej, oknie informacyjnym oraz aplikacji mobilnej Android.
- **System wersjonowania i historia zmian (Changelog):**
  - Wprowadzono rejestr `CHANGELOG.md` z historią wydań i datami modyfikacji.
  - Dodano przycisk oraz modal historii zmian bezpośrednio w menu informacji o aplikacji (`AppInfoModal`).
  - Zaktualizowano numer wersji w stopce strony WWW na `ver. 1.1`.
  - Wydano pakiet aplikacji mobilnej Android w wersji `v1.1.0`.

---

## [1.0] — 2026-10-25
**Data modyfikacji:** 2026-10-25 19:30 CET

### Wydanie początkowe (Initial Release)
- Oficjalna premiera platformy dietetycznej **ADONIS fit & eat**.
- Panel dietetyka i pacjenta w responsywnej aplikacji webowej (React + Vite).
- Natywna aplikacja mobilna Android (Kotlin, Jetpack Compose, Material 3).
- Baza ponad 125 zbilansowanych przepisów kulinarnych z makroskładnikami i instrukcją krok po kroku.
- Moduł monitorowania antropometrycznego: waga, obwód talii, dynamiczny wskaźnik BMI z referencyjnym pasmem normy WHO (18.5 – 24.9).
- Inteligentna lista zakupów z trybem One-Stop-Shop (optymalizacja zakupów w jednym markecie: Lidl, Biedronka, Dino, Carrefour, Kaufland, Auchan).
- Czat dietetyka z pacjentem w czasie rzeczywistym z powiadomieniami o nieprzeczytanych wiadomościach.
- Bezpieczny backend oparty na Django REST / Ninja z autoryzacją JWT i rolami RBAC.
- Pełna konteneryzacja Docker Multi-arch (x86_64 / ARM64) oraz automatyczny skrypt instalacyjny.
