## [1.9] – 2026-10-29 09:15 CET

### Baza i Edycja Przepisów
- **Wyrazisty przycisk "Usuń przepis" na kafelkach**: Dodano pełnowymiarowy, czerwony przycisk usuwania bezpośrednio na każdym kafelku w Bazie Przepisów.
- **Klawisz usuwania w nagłówku i stopce edycji**: W oknie edycji dania (`showRecipeModal`) dodano przycisk "Usuń przepis" w górnym nagłówku (obok ✕) oraz wyrazisty czerwony przycisk w stopce formularza.
- **Usuwanie i edycja w oknie szczegółów dania**: W oknie `PortionScalerModal` (podgląd dania, zdjęcie i instrukcja) dodano przyciski "Edytuj przepis" oraz "Usuń przepis" w nagłówku i na dole.

### Interfejs i Weryfikacja
- **Wskaźnik wersji (v1.9)**: W nagłówku Panelu Dietetyka umieszczono wskaźnik wersji aplikacji ułatwiający natychmiastową weryfikację załadowania najnowszego buildu w przeglądarce.

---

## [1.8] — 2026-10-29 08:30 CET

### Bezpieczeństwo i Integralność Bazy Przepisów
- Wprowadzono blokadę usuwania przepisów powiązanych z aktywnymi szablonami diet lub zaplanowanymi posiłkami pacjentów (kod HTTP 409 przy braku zamiennika)
- Szczegółowa lista miejsc występowania dania przed usunięciem (nazwa pakietu, dni, kategorie posiłków, pacjenci i daty)
- Narzędzie automatycznego zastępowania usuwanego przepisu innym wybranym daniem we wszystkich pakietach i planach pacjentów (endpoint POST /api/recipes/{id}/replace)

### Menu Edycji Przepisów
- Dodano klawisz "Usuń przepis" w dolnym pasku okna edycji przepisu
- Dodano kartę wartości odżywczych dania na żywo (kalorie, białko, tłuszcze, węglowodany) przeliczaną dynamicznie ze składników
- Podgląd kalorii i makroskładników z podziałem na płeć (Kobieta / Mężczyzna)
## [1.7] — 2026-10-29 07:45 CET

### Grupy diety i elastyczne pakiety
- Dodano przycisk "+" do szybkiego tworzenia nowych grup diety w panelu dietetyka
- Możliwość swobodnego przypisywania i zmiany grupy dla każdego jadłospisu oraz opcja "Bez grupy"
- Dynamiczne filtry grup diety pobierające kategorie ze wszystkich dostępnych szablonów

### Elastyczny import PDF
- Kategoria nie jest już wymagana przy imporcie z pliku PDF
- Dodano opcjonalne pole na opis jadłospisu oraz wybór grupy diety
- Usunięto sztywny opis "28-dniowy jadłospis..." – opis dostosowuje się dynamicznie

### Poprawa podglądu i edycji pakietów
- Zwiększono limit pobierania przepisów (z 150 do 1000) – nowe przepisy z importu są w pełni widoczne
- Naprawiono wyświetlanie tytułów przepisów i kalorii w sekcji "Pokaż przepisy w pakiecie"
- Naprawiono formularz edycji pakietu – prawidłowe mapowanie ID przepisów i wsparcie dla dowolnej liczby dni
## [1.6] — 2026-10-29 07:00 CET

### Import diety z PDF (NFZ)
- Nowe narzędzie importu jadłospisu z pliku PDF (diety.nfz.gov.pl) w panelu dietetyka
- Drag & drop lub wybór pliku PDF — automatyczne wyodrębnienie przepisów, kategorii posiłków, makroskładników i składników
- Inteligentna deduplikacja przepisów (ponowne użycie istniejącego zamiast duplikatu)
- Automatyczne przypisanie źródła: https://diety.nfz.gov.pl/ do każdego przepisu
- Import szablonu M_1500_cal (28 dni, 112 posiłków, 89 nowych przepisów)
- Endpoint API: POST /api/diet-plans/import-pdf (multipart/form-data), dostępny tylko dla dietetyka/admina

### Rok urodzenia pacjenta
- Pole birth_year w profilu pacjenta wyświetlane jako obliczony wiek
- Wiek pacjenta widoczny w nagłówku panelu dietetyka przy wyborze pacjenta
- Pole roku urodzenia w formularzu celów dietetycznych z podglądem obliczonego wieku
# Dziennik Zmian (CHANGELOG) â€” ADONIS fit & eat

Format oparty na [Keep a Changelog](https://keepachangelog.com/pl/1.0.0/).
Projekt stosuje zasadÄ™: **kaĹĽda kolejna zmiana w projekcie podnosi numer wersji o 0.1** (np. `1.0` -> `1.1` -> `1.2`).

---

## [1.5] â€” 2026-10-28
**Data modyfikacji:** 2026-10-28 20:40 CET

### Usprawnienia i NowoĹ›ci (Improvements & Features)
1. **Aplikacja webowa & ModuĹ‚ Pobierania â€” Podmiana kodu QR na AdonisQR.png:**
   - W oknie informacyjnym â€žO aplikacjiâ€ť (`AppInfoModal.jsx`) oraz na stronie pobierania (`pobierz.html`) podmieniono dotychczasowy kod QR na oficjalny, artystyczny kod `AdonisQR.png` z centralnym logotypem Adonis oraz motywem Cyber-Fit.
   - Zapewniono automatyczne serwowanie i caching pliku `AdonisQR.png` w katalogu publicznym aplikacji frontendowej.

---

## [1.4] â€” 2026-10-28
**Data modyfikacji:** 2026-10-28 19:30 CET

### Usprawnienia i NowoĹ›ci (Improvements & Features)
1. **Aplikacja webowa â€” Naprawa bĹ‚Ä™du renderowania widoku pacjenta:**
   - Wykryto i naprawiono bĹ‚Ä…d krytyczny powodujÄ…cy brak renderowania widoku po zalogowaniu na konto pacjenta (`ReferenceError: Activity is not defined` w `Navbar.jsx`). Dodano brakujÄ…cy import ikony `Activity` z biblioteki `lucide-react`.
   - Otoczono gĹ‚Ăłwny layout aplikacji (`MainLayout`) komponentem `ErrorBoundary`, zabezpieczajÄ…c caĹ‚y interfejs przed biaĹ‚ym ekranem w przypadku nieprzewidzianych wyjÄ…tkĂłw i wyĹ›wietlajÄ…c czytelny komunikat z przyciskiem przeĹ‚adowania.
2. **Aplikacja webowa â€” Artystyczny kod QR w sekcji Info:**
   - W oknie â€žO aplikacjiâ€ť (`AppInfoModal.jsx`) zaimplementowano artystycznÄ… sekcjÄ™ pobierania aplikacji mobilnej.
   - WdroĹĽono dynamiczny, w peĹ‚ni funkcjonalny kod QR (`QRCodeSVG` z `qrcode.react`), ktĂłry aparatem dowolnego telefonu natychmiast prowadzi do pobrania aktualnego pliku `.apk`.
   - Dodano estetyczny motyw wizualny *Cyber-Fit* w kolorystyce szmaragdowo-neonowej, cyberpunkowy podglÄ…d potrawy oraz przyciski szybkiego pobierania pliku i kopiowania bezpoĹ›redniego linku do schowka.
3. **Aplikacja mobilna Android & Serwer Produkcyjny:**
   - Podniesiono wersjÄ™ aplikacji mobilnej do `1.4.0` (versionCode 6).
   - Skompilowano oficjalne wydanie release APK `Adonis-fit-and-eat-v1.4.apk` i wdroĹĽono bezpoĹ›rednio na serwer produkcyjny pod publicznym adresem `https://adonis.slavosmm.duckdns.org/Adonis-fit-and-eat-v1.4.apk`.
   - Zaktualizowano `version.js` oraz stopkÄ™ aplikacji do wersji 1.4.

---

## [1.3] â€” 2026-10-28
**Data modyfikacji:** 2026-10-28 07:20 CET

### Usprawnienia i NowoĹ›ci (Improvements & Features)
1. **Aplikacja webowa â€” Przycisk "Zamknij" w oknie UstawieĹ„:**
   - Dodano wyraĹşny przycisk "Zamknij" w dolnym pasku modala UstawieĹ„, umoĹĽliwiajÄ…cy intuicyjne wyjĹ›cie z konfiguracji.
2. **Aplikacja webowa â€” PeĹ‚na historia zaleceĹ„ i wglÄ…d do jadĹ‚ospisĂłw:**
   - ZastÄ…piono pojedyncze ostatnie zalecenie peĹ‚nym oknem historii zaleceĹ„ i przypisanych jadĹ‚ospisĂłw (`RecommendationsHistoryModal.jsx`).
   - UĹĽytkownik ma dostÄ™p do chronologicznej osi czasu zaleceĹ„ dietetyka oraz interaktywnego wglÄ…du do wszystkich pakietĂłw jadĹ‚ospisĂłw wraz z 7-dniowym harmonogramem posiĹ‚kĂłw, nazwami daĹ„, kaloriami i makroskĹ‚adnikami.
3. **Aplikacja webowa â€” Nowe menu "Pomiary" w belce gĂłrnej:**
   - Dodano zakĹ‚adkÄ™ "Pomiary" w gĹ‚Ăłwnym pasku nawigacyjnym aplikacji webowej (`MeasurementsPage.jsx`).
   - WdroĹĽono zestaw tych samych informacji i funkcji co w aplikacji mobilnej: kafelki wagi i trendu, interaktywny wykres trendu wagi i obwodu talii, klasyfikacjÄ™ BMI wg norm WHO, szybkÄ… edycjÄ™ wzrostu pacjenta, peĹ‚nÄ… tabelÄ™ historii pomiarĂłw z opcjÄ… usuwania, formularz dodawania nowego pomiaru oraz przycisk wglÄ…du do zaleceĹ„.
4. **Web & Mobile â€” Kategoryzacja listy zakupĂłw oraz zbiorczy checkbox:**
   - Produkty na liĹ›cie zakupĂłw sÄ… automatycznie grupowane w czytelne sekcje: Warzywa, Owoce, NabiaĹ‚, MiÄ™so i wÄ™dliny, Ryby i owoce morza, Pieczywo, Produkty zboĹĽowe, TĹ‚uszcze, nasiona i orzechy oraz Inne produkty.
   - Dodano ogĂłlny master-checkbox ("Zaznacz wszystkie / Odznacz wszystkie") umoĹĽliwiajÄ…cy jednym klikniÄ™ciem oznaczenie wszystkich pozycji jako kupione/niekupione zarĂłwno w aplikacji webowej (`ShoppingListWidget.jsx`), jak i mobilnej (`ShoppingListScreen.kt`).
   - WdroĹĽono dedykowany endpoint backendu `/api/diet-plans/shopping-list/bulk-toggle` dla optymalizacji wydajnoĹ›ci.
5. **Aplikacja webowa â€” BezpieczeĹ„stwo usuniÄ™cia konta (Strefa niebezpieczna w Ustawieniach):**
   - UsuniÄ™to ikonÄ™ kosza i usuwanie konta z gĂłrnej belki nawigacyjnej, eliminujÄ…c ryzyko przypadkowego klikniÄ™cia obok wylogowania.
   - OpcjÄ™ usuniÄ™cia konta z dwuetapowym potwierdzeniem hasĹ‚em przeniesiono do sekcji "Strefa niebezpieczna" w oknie Ustawienia.
6. **Aplikacja mobilna â€” Numer wersji bez dopisku "Produkcyjna" i wdroĹĽenie na serwer:**
   - W oknie informacji o aplikacji (`AppInfoDialog.kt`) wyĹ›wietlany jest wyĹ‚Ä…cznie czysty numer wersji (`1.3`), usuniÄ™to sĹ‚owo "Produkcyjna".
   - Podniesiono wersjÄ™ aplikacji do `1.3.0` (versionCode 5), zbudowano oficjalny plik release APK i wdroĹĽono bezpoĹ›rednio na serwer produkcyjny pod adresem `https://adonis.slavosmm.duckdns.org/Adonis-fit-and-eat-v1.3.apk`.
7. **Baza przepisĂłw, weryfikacja diety redukcyjnej i miary kuchenne:**
   - Przeprowadzono audyt 291 przepisĂłw i ich fotografii (weryfikacja spĂłjnoĹ›ci i jakoĹ›ci).
   - Zweryfikowano poprawnoĹ›Ä‡ jadĹ‚ospisĂłw diety redukcyjnej: w standardowej redukcji stosowany jest peĹ‚nowartoĹ›ciowy nabiaĹ‚ niskotĹ‚uszczowy (nabiaĹ‚ bez laktozy zarezerwowany jest Ĺ›ciĹ›le dla jednostek klinicznych takich jak WZJG / Colitis Ulcerosa).
   - Dodano przeliczanie i prezentacjÄ™ miar kuchennych obok gramatury dla kaĹĽdego skĹ‚adnika (np. Ĺ‚yĹĽki, Ĺ‚yĹĽeczki, szklanki, sztuki, plastry, garĹ›cie) zarĂłwno w skalerze porcji, jak i w widokach posiĹ‚kĂłw na webie i w aplikacji mobilnej.

---

## [1.2] â€” 2026-10-28
**Data modyfikacji:** 2026-10-28 05:48 CET

### Usprawnienia i Poprawki (Improvements & Fixes)
1. **Aplikacja mobilna â€” Ujednolicenie i naprawa motywĂłw kolorystycznych:**
   - WdroĹĽono spĂłjne motywy zgodne z aplikacjÄ… webowÄ…: `ciemny` (Dark), `jasny` (Light), `ocean` (Ocean Teal) oraz `las` (Forest Emerald).
   - Zapewniono natychmiastowe dynamiczne przeĹ‚Ä…czanie motywu bez koniecznoĹ›ci restartu aplikacji (`Theme.kt`, `SettingsScreen.kt`, `MainActivity.kt`).
2. **Aplikacja mobilna â€” Naprawa powiadomieĹ„ systemowych (Android 13+ / API 33-34):**
   - Dodano uprawnienia `POST_NOTIFICATIONS`, `SCHEDULE_EXACT_ALARM`, `USE_EXACT_ALARM`, `RECEIVE_BOOT_COMPLETED` oraz `VIBRATE`.
   - Zaimplementowano inicjalizacjÄ™ kanaĹ‚Ăłw powiadomieĹ„ (`NotificationChannel`: `meal_reminders` oraz `general_notifications`) podczas startu aplikacji (`NotificationHelper.kt`, `AdonisApplication.kt`), co aktywuje systemowy przeĹ‚Ä…cznik "Zezwalaj na pokazywanie powiadomieĹ„" w ustawieniach telefonu.
   - WdroĹĽono `MealReminderReceiver` z obsĹ‚ugÄ… powiadomieĹ„ o posiĹ‚kach o zaplanowanych porach (Ĺ›niadanie, II Ĺ›niadanie, obiad, podwieczorek, kolacja) oraz przycisk testowy w menu Ustawienia.
3. **Ekran jadĹ‚ospisu â€” UsuniÄ™cie banera posiĹ‚ku:**
   - UsuniÄ™to baner "ZbliĹĽa siÄ™ czas na posiĹ‚ek!" z gĹ‚Ăłwnego widoku dnia w telefonie, zapewniajÄ…c przejrzysty i czysty interfejs.
4. **Ekran jadĹ‚ospisu â€” Przeniesienie kafelka "ZaĹ‚aduj jadĹ‚ospis":**
   - Kafelek "ZaĹ‚aduj jadĹ‚ospis" przeniesiono na lewo od selektora daty, z czytelnym tekstem w dwĂłch wierszach (`ZaĹ‚aduj\njadĹ‚ospis`).
5. **Menu Pomiary â€” Przeniesienie przycisku "Zalecenia":**
   - Przycisk "Zalecenia" zostaĹ‚ przeniesiony z ekranu posiĹ‚kĂłw do menu "Pomiary", w nagĹ‚Ăłwku obok wskaĹşnika BMI.
6. **Menu Zakupy â€” WybĂłr zakresu dat oraz szybkie kafelki:**
   - Dodano selektor dat (zakres `Od` â€“ `Do` z kalendarzem `DatePickerDialog`).
   - Wprowadzono kafelki szybkiego wyboru (`1d`, `3d`, `5d`, `7d`, `14d`), ktĂłre po klikniÄ™ciu automatycznie uzupeĹ‚niajÄ… daty od dnia bieĹĽÄ…cego i odĹ›wieĹĽajÄ… listÄ™.
7. **Menu Zakupy â€” UsuniÄ™cie zduplikowanego wiersza ze sklepami:**
   - Zlikwidowano redundantny podwĂłjny wiersz z nazwami marketĂłw, pozostawiajÄ…c pojedynczy, czysty wiersz filtrĂłw (`Wszystkie`, `Lidl`, `Biedronka`, `Kaufland`, `Carrefour`).
8. **Menu Pomiary â€” Poziomy trend wagi i talii:**
   - Zmodyfikowano "Wykres trendu wagi i talii" (`MeasurementsChart.kt`): wskaĹşnik trendu (np. `-1.5 kg`) zostaĹ‚ przeniesiony do dedykowanego wiersza pod tytuĹ‚em wykresu, eliminujÄ…c pionowe zawijanie tekstu.
9. **PeĹ‚ne przewijanie ekranĂłw (Scroll gĂłra-dĂłĹ‚):**
   - Wszystkie ekrany menu (`JadĹ‚ospis`, `Zakupy`, `Pomiary`, `Ustawienia`, `Czat`) otrzymaĹ‚y peĹ‚nÄ… obsĹ‚ugÄ™ pionowego przewijania (`LazyColumn` / `verticalScroll`), gwarantujÄ…c wygodne korzystanie na dowolnym rozmiarze ekranu smartfona.
10. **JadĹ‚ospisy â€” Minimalizacja gotowania oraz historia zaleceĹ„:**
    - Zoptymalizowano bazÄ™ przepisĂłw i pakiety diet: posiĹ‚ki (Ĺ›niadania, drugie Ĺ›niadania, podwieczorki oraz obiady) zostaĹ‚y zmodyfikowane pod kÄ…tem zerowego lub minimalnego czasu gotowania (5â€“10 min: wrapy peĹ‚noziarniste, saĹ‚atki Ĺ›rĂłdziemnomorskie, bowls, owsianki, serki wiejskie, skyr).
    - W oficjalnych zaleceniach automatycznie zapisywany jest tytuĹ‚ bieĹĽÄ…cego jadĹ‚ospisu, data wprowadzenia, okres obowiÄ…zywania oraz chronologiczna historia wszystkich przesĹ‚anych pacjentowi pakietĂłw (`PatientRecommendation`).
11. **Rygorystyczna kontrola dostÄ™pu do diet:**
    - Pacjent (zarĂłwno w aplikacji mobilnej, jak i webowej) posiada dostÄ™p wyĹ‚Ä…cznie do pakietĂłw przesĹ‚anych mu przez jego dietetyka w paczkach â€” brak dostÄ™pu do globalnych szablonĂłw innych pacjentĂłw/dietetykĂłw.

---

## [1.1] â€” 2026-10-27
**Data modyfikacji:** 2026-10-27 22:15 CET

### Dodano (Added)
- **PodziaĹ‚ jadĹ‚ospisĂłw i gramatur skĹ‚adnikĂłw wedĹ‚ug pĹ‚ci:**
  - Wprowadzono pola `amount_female_g` oraz `amount_male_g` w modelu skĹ‚adnikĂłw receptur (`RecipeIngredient`).
  - Przepisy automatycznie dopasowujÄ… gramatury skĹ‚adnikĂłw i wyliczajÄ… odrÄ™bne makroskĹ‚adniki (kcal, biaĹ‚ko, tĹ‚uszcze, wÄ™glowodany) dla kobiet i mÄ™ĹĽczyzn.
  - Generowanie inteligentnej listy zakupĂłw (`SmartShoppingList`) z automatycznÄ… agregacjÄ… iloĹ›ci produktĂłw dla pĹ‚ci pacjenta.
  - Przelicznik porcji (`PortionScalerModal`) z bezpoĹ›rednim podglÄ…dem gramatur dla kobiet (`đź‘© K`) oraz mÄ™ĹĽczyzn (`đź‘¨ M`).
- **Kategoryzacja pakietĂłw dietetycznych dla pĹ‚ci:**
  - Dodano atrybut `target_gender` (`female`, `male`, `all`) w szablonach pakietĂłw (`DietPlanTemplate`).
  - Filtry i identyfikatory wizualne pĹ‚ci (`Wszystkie`, `đź‘© Kobiety`, `đź‘¨ MÄ™ĹĽczyĹşni`) w oknie Ĺ‚adowania pakietu oraz w panelu administratora.
  - Zasilono bazÄ™ 10 certyfikowanymi pakietami 7-dniowymi:
    - 4 pakiety dla kobiet (1500â€“1750 kcal)
    - 4 pakiety dla mÄ™ĹĽczyzn (2000â€“2400 kcal)
    - 2 pakiety uniwersalne (Dla kaĹĽdego)
- **BezpieczeĹ„stwo i uprawnienia pacjenta:**
  - Pacjent ma wglÄ…d wyĹ‚Ä…cznie do jadĹ‚ospisĂłw i pakietĂłw dietetycznych przesĹ‚anych mu przez przypisanego dietetyka.
  - Pacjent zachowuje ciÄ…gĹ‚y dostÄ™p do historii wszystkich dotychczas przypisanych pakietĂłw (zarĂłwno starych, jak i nowo dosĹ‚anych).
- **Nowy logotyp aplikacji:**
  - WdroĹĽono nowy znak graficzny: zielona litera 'A' harmonijnie spleciona ze Ĺ›wieĹĽym liĹ›ciem (plik `logo.png` oraz ikona `app-icon.png`).
  - Zaktualizowano ikony w nawigacji webowej, oknie informacyjnym oraz aplikacji mobilnej Android.
- **System wersjonowania i historia zmian (Changelog):**
  - Wprowadzono rejestr `CHANGELOG.md` z historiÄ… wydaĹ„ i datami modyfikacji.
  - Dodano przycisk oraz modal historii zmian bezpoĹ›rednio w menu informacji o aplikacji (`AppInfoModal`).
  - Zaktualizowano numer wersji w stopce strony WWW na `ver. 1.1`.
  - Wydano pakiet aplikacji mobilnej Android w wersji `v1.1.0`.

---

## [1.0] â€” 2026-10-25
**Data modyfikacji:** 2026-10-25 19:30 CET

### Wydanie poczÄ…tkowe (Initial Release)
- Oficjalna premiera platformy dietetycznej **ADONIS fit & eat**.
- Panel dietetyka i pacjenta w responsywnej aplikacji webowej (React + Vite).
- Natywna aplikacja mobilna Android (Kotlin, Jetpack Compose, Material 3).
- Baza ponad 125 zbilansowanych przepisĂłw kulinarnych z makroskĹ‚adnikami i instrukcjÄ… krok po kroku.
- ModuĹ‚ monitorowania antropometrycznego: waga, obwĂłd talii, dynamiczny wskaĹşnik BMI z referencyjnym pasmem normy WHO (18.5 â€“ 24.9).
- Inteligentna lista zakupĂłw z trybem One-Stop-Shop (optymalizacja zakupĂłw w jednym markecie: Lidl, Biedronka, Dino, Carrefour, Kaufland, Auchan).
- Czat dietetyka z pacjentem w czasie rzeczywistym z powiadomieniami o nieprzeczytanych wiadomoĹ›ciach.
- Bezpieczny backend oparty na Django REST / Ninja z autoryzacjÄ… JWT i rolami RBAC.
- PeĹ‚na konteneryzacja Docker Multi-arch (x86_64 / ARM64) oraz automatyczny skrypt instalacyjny.
