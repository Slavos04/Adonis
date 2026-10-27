# Dziennik Zmian (CHANGELOG) — ADONIS fit & eat

Format oparty na [Keep a Changelog](https://keepachangelog.com/pl/1.0.0/).
Projekt stosuje zasadę: **każda kolejna zmiana w projekcie podnosi numer wersji o 0.1** (np. `1.0` -> `1.1` -> `1.2`).

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
