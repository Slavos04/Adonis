export const APP_VERSION = '1.12';
export const APP_RELEASE_DATE = '2026-10-31';

export const CHANGELOG_DATA = [
  {
    version: '1.12',
    date: '2026-10-31',
    time: '11:15 CET',
    title: 'Wydanie 1.12 – Wydruk listy zakupów w PDF, poprawka PDF jadłospisu i ergonomia EAN',
    badge: 'Aktualna',
    badgeType: 'emerald',
    changes: [
      {
        category: 'Wydruk i eksport listy zakupów (Web & Mobile)',
        items: [
          'Dodano generowanie i pobieranie listy zakupów w formacie PDF podzielonej na działy (Warzywa, Owoce, Nabiał, Mięso itd.) z polami do odhaczania.',
          'W aplikacji mobilnej dodano przycisk pobierania PDF listy zakupów w nagłówku oraz pod wyborem zakresu dat.',
          'W aplikacji webowej dodano przycisk "Pobierz PDF" w widoku listy zakupów obok opcji drukowania i kopiowania do schowka.',
          'Uwzględnienie filtrów marketu (Lidl, Biedronka, Kaufland, Carrefour) przy generowaniu pliku PDF.'
        ]
      },
      {
        category: 'Poprawka generowania PDF jadłospisu pacjenta',
        items: [
          'Naprawiono pobieranie PDF w sekcji "Jadłospis" w aplikacji mobilnej – dodano przekazywanie tokenu autoryzacyjnego w intencie.',
          'Wprowadzono automatyczne dopełnianie brakujących dni w jadłospisie z aktywnego pakietu dietetyka, eliminując problem pustych wydruków.'
        ]
      },
      {
        category: 'Ergonomia zamiany posiłku (EAN & Skaner)',
        items: [
          'W oknie "Zamień posiłek" w aplikacji mobilnej rozciągnięto pole kodu EAN na pełną szerokość z ikoną aparatu/skanera po prawej stronie.',
          'Przeniesiono przycisk "Szukaj w bazie kodów EAN" bezpośrednio pod pole formularza dla wygodniejszej obsługi jedną ręką.'
        ]
      }
    ]
  },
  {
    version: '1.11',
    date: '2026-10-30',
    time: '14:30 CET',
    title: 'Wydanie 1.11 – Generowanie PDF na żądanie (Web & Mobile) oraz naprawa API_URL',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Generowanie PDF na żądanie (Web + Mobile)',
        items: [
          'Dodano silnik generowania eleganckich dokumentów PDF (ReportLab + obsługa polskich znaków DejaVu Sans).',
          'Możliwość pobierania i drukowania pakietu diety bezpośrednio z panelu dietetyka przy każdym pakiecie.',
          'Przycisk "Pobierz PDF" w kalendarzu tygodniowym pacjenta (Web i Android) generujący spersonalizowany jadłospis z zaleceniami i zamianami dań.',
          'W aplikacji mobilnej Android dodano przyciski pobierania PDF w widoku planu dnia oraz przy każdym pakiecie diety.',
          'Naprawiono błąd widoku API_URL is not defined w kliencie API.'
        ]
      }
    ]
  },
  {
    version: '1.10',
    date: '2026-10-29',
    time: '14:50 CET',
    title: 'Wydanie 1.10 – Zastępowanie posiłków (EAN / skaner aparatem / ręcznie) oraz powiadomienia w tle',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Zamiana posiłków przez pacjenta (Web + Mobile)',
        items: [
          'Dodano przycisk "Zamień posiłek" oraz zmieniono kartę porcji na "Opcje" w aplikacji webowej i mobilnej.',
          'Wprowadzono możliwość zamiany posiłku, gdy pacjent zjadł coś innego niż w planie.',
          'Integracja z bazą kodów kreskowych Open Food Facts: po wpisaniu EAN pobierana jest nazwa i makroskładniki na 100g.',
          'Dodano skaner kodów kreskowych z aparatu (Google Play Services Code Scanner w Androidzie oraz skaner wideo w webie).',
          'Możliwość dodawania wielu produktów do jednego posiłku przyciskiem "+" (np. grahamka + serek wiejski + pomidor) z automatycznym sumowaniem kalorii i makro.',
          'Opcja ręcznego wprowadzania składników, gdy brak kodu EAN lub produktu nie ma w bazie.',
          'Oznaczanie posiłków plakietką "Zamieniony" w kalendarzu pacjenta z podglądem składników oraz możliwością przywrócenia oryginalnego dania.'
        ]
      },
      {
        category: 'Powiadomienia w tle (Android - Wariant A)',
        items: [
          'Wdrożono WorkManager do okresowej synchronizacji w tle (sprawdzanie nowych wiadomości na czacie, zaktualizowanego jadłospisu i nowych zaleceń od dietetyka).',
          'Zabezpieczono harmonogram alarmów o zbliżających się posiłkach w NotificationHelper pod kątem Androida 12+ / 13+ / 14+.'
        ]
      }
    ]
  },
  {
    version: '1.9',
    date: '2026-10-29',
    time: '09:15 CET',
    title: 'Wydanie 1.9 – Wyeksponowanie usuwania i edycji dań we wszystkich widokach oraz wskaźnik wersji',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Baza i Edycja Przepisów',
        items: [
          'Dodano czytelny, pełny przycisk "Usuń przepis" bezpośrednio na każdym kafelku w Bazie Przepisów oraz w ogólnym Katalogu Przepisów (/recipes).',
          'Dodano klawisz "Usuń przepis" w nagłówku okna edycji przepisu (obok ✕) oraz wyrazisty czerwony przycisk w stopce formularzy edycji.',
          'Dodano przyciski "Edytuj przepis" oraz "Usuń przepis" w oknie szczegółów dania i skalowania porcji (PortionScalerModal) oraz w edytorze dni szablonu.',
          'Usunięto sztywno wpisaną liczbę 125 oraz limit 100 w katalogu /recipes – teraz dynamicznie ładuje się i wyświetla pełna baza wszystkich przepisów (360+).'
        ]
      },
      {
        category: 'Interfejs i Weryfikacja Wdrożenia',
        items: [
          'Dodano wskaźnik wersji (v1.9) w nagłówku Panelu Dietetyka ułatwiający weryfikację załadowania najnowszego kodu w przeglądarce.',
          'Rozwiązano potencjalne problemy z niewidocznymi przyciskami usuwania przy długich formularzach.'
        ]
      }
    ]
  },
  {
    version: '1.8',
    date: '2026-10-29',
    time: '08:30 CET',
    title: 'Wydanie 1.8 – Blokada usuwania powiązanych dań, łatwe zastępowanie przepisów i makroskładniki w edycji',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Bezpieczeństwo i Integralność Bazy Przepisów',
        items: [
          'Wprowadzono blokadę usuwania przepisów powiązanych z aktywnymi szablonami diet lub zaplanowanymi posiłkami pacjentów.',
          'Szczegółowa lista miejsc występowania dania (nazwa pakietu, dzień, kategoria posiłku, dane pacjenta i data).',
          'Narzędzie natychmiastowego zastępowania usuwanego dania innym wybranym przepisem we wszystkich powiązanych pakietach i planach pacjentów.'
        ]
      },
      {
        category: 'Edycja Przepisów',
        items: [
          'Dodano klawisz "Usuń przepis" bezpośrednio w oknie edycji dania.',
          'Dodano kartę wartości odżywczych na żywo (kalorie, białko, tłuszcze, węglowodany) przeliczaną dynamicznie ze składników.',
          'Podgląd docelowych kalorii i makroskładników z podziałem na płeć (Kobieta / Mężczyzna).'
        ]
      }
    ]
  },
  {
    version: '1.7',
    date: '2026-10-29',
    time: '07:45 CET',
    title: 'Wydanie 1.7 – Zarządzanie grupami diety, elastyczny import PDF i naprawa podglądu pakietów',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Grupy diety & Pakiety',
        items: [
          'Nowy przycisk "+" do natychmiastowego dodawania nowych grup diety.',
          'Elastyczne przypisywanie jadłospisów do wybranej grupy lub opcja "Bez grupy".',
          'Dynamiczne filtry grup diety bazujące na faktycznie istniejących pakietach.'
        ]
      },
      {
        category: 'Import PDF',
        items: [
          'Kategoria nie jest już wymagana przy imporcie PDF (możliwość wyboru grupy lub "Bez grupy").',
          'Dodano pole na własny opis jadłospisu przy imporcie.',
          'Usunięto sztywny opis "28-dniowy jadłospis..." – opis dostosowuje się dynamicznie do liczby dni i założeń.'
        ]
      },
      {
        category: 'Podgląd i Edycja Pakietów',
        items: [
          'Naprawiono błąd wyświetlania przepisów i kalorii w rozwinięciu "Pokaż przepisy w pakiecie" (pełna baza przepisów bez limitu 150 pozycji).',
          'Pełna zgodność podglądu z formularzem edycji pakietu – prawidłowe mapowanie ID przepisów.',
          'Wsparcie dla pakietów o dowolnej liczbie dni w edytorze.'
        ]
      }
    ]
  },
  {
    version: '1.6',
    date: '2026-10-29',
    time: '07:00 CET',
    title: 'Wydanie 1.6 – Import diety z PDF, rok urodzenia pacjenta',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Import diety z PDF (NFZ)',
        items: [
          'Nowe narzędzie importu jadłospisu z pliku PDF (diety.nfz.gov.pl) w panelu dietetyka.',
          'Drag & drop lub wybór pliku PDF – automatyczne wyodrębnienie przepisów, kategorii posiłków, makroskładników i składników.',
          'Inteligentna deduplikacja przepisów (ponowne użycie istniejącego przepisu zamiast duplikowania).',
          'Automatyczne przypisanie źródła: https://diety.nfz.gov.pl/ do każdego importowanego przepisu.',
          'Import szablonu M_1500_cal (28 dni, 112 posiłków, 89 nowych przepisów) z pliku NFZ.',
          'Endpoint API: POST /api/diet-plans/import-pdf (multipart/form-data), dostępny tylko dla dietetyka/admina.'
        ]
      },
      {
        category: 'Rok urodzenia pacjenta',
        items: [
          'Dodanie pola "Rok urodzenia" w profilu pacjenta (wyświetlany jako obliczony wiek).',
          'Wiek pacjenta widoczny w nagłówku panelu dietetyka przy wyborze pacjenta.',
          'Pole roku urodzenia w formularzu celów dietetycznych z podglądem obliczonego wieku.',
          'Uwzględnienie roku urodzenia w API profilu pacjenta (birth_year, age).'
        ]
      }
    ]
  },
  {
    version: '1.5',
    date: '2026-10-28',
    time: '20:40 CET',
    title: 'Wydanie 1.5 – Oficjalny kod QR AdonisQR.png do pobierania aplikacji mobilnej',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Aplikacja Webowa & Zasoby',
        items: [
          'Podmiana kodu QR w oknie „O aplikacji” (AppInfoModal) oraz na dedykowanej stronie pobierania na oficjalną grafikę AdonisQR.png z logo i motywem Cyber-Fit.',
          'Zwiększenie estetyki i czytelności modułu instalacji aplikacji mobilnej na telefonach komórkowych.'
        ]
      }
    ]
  },
  {
    version: '1.4',
    date: '2026-10-28',
    time: '19:30 CET',
    title: 'Wydanie 1.4 — Naprawa widoku webowego, artystyczny kod QR i weryfikacja pakietu APK',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Aplikacja Webowa',
        items: [
          'Rozwiązanie problemu renderowania widoku pacjenta (brakujący import ikony Activity w belce nawigacyjnej).',
          'Dodanie globalnego ErrorBoundary zabezpieczającego aplikację przed białym ekranem w przypadku nieoczekiwanego błędu.',
          'Wdrożenie artystycznego, w pełni skanowalnego kodu QR w oknie informacyjnym "O aplikacji" (AppInfoModal) wraz z cyberpunkową grafiką i przyciskiem kopiowania bezpośredniego linku do pobrania APK.'
        ]
      },
      {
        category: 'Aplikacja Mobilna Android & Serwer',
        items: [
          'Podniesienie wersji aplikacji mobilnej do 1.4.0 (versionCode 6).',
          'Weryfikacja i synchronizacja najnowszego pliku APK (Adonis-fit-and-eat-v1.4.apk) bezpośrednio na serwerze produkcyjnym.',
          'Naprawa nagłówków Nginx i skryptu update.sh gwarantujących poprawne pobieranie najnowszych wersji pliku instalacyjnego.'
        ]
      }
    ]
  },
  {
    version: '1.3',
    date: '2026-10-28',
    time: '07:20 CET',
    title: 'Wydanie 1.3 — Pomiary w belce, historia zaleceń i jadłospisów, kategorie zakupów i miary kuchenne',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Aplikacja Webowa',
        items: [
          'Dodanie przycisku "Zamknij" w oknie Ustawień.',
          'Pełna historia zaleceń wraz z podglądem przypisanych jadłospisów i 7-dniowych planów posiłków.',
          'Nowa zakładka "Pomiary" w górnej belce nawigacyjnej z wykresem trendu wagi/talii, klasyfikacją BMI WHO, edycją wzrostu i tabelą pomiarów.',
          'Grupowanie listy zakupów według kategorii (warzywa, owoce, nabiał, mięso itp.) z master-checkboxem zaznaczającym wszystkie pozycje.',
          'Przeniesienie usuwania konta i ikony kosza do sekcji Ustawienia (Strefa niebezpieczna) dla ochrony przed przypadkowym skasowaniem.'
        ]
      },
      {
        category: 'Aplikacja Mobilna Android',
        items: [
          'Wyświetlanie czystego numeru wersji w oknie O aplikacji (np. "1.3" bez słowa "Produkcyjna").',
          'Grupowanie zakupów według kategorii oraz zbiorczy checkbox "Zaznacz wszystkie / Odznacz wszystkie".',
          'Wsparcie dla miar kuchennych w składnikach posiłków (łyżki, łyżeczki, szklanki, sztuki).'
        ]
      },
      {
        category: 'Baza Przepisów i Dietetyka',
        items: [
          'Weryfikacja bazy przepisów i przypisanych zdjęć.',
          'Weryfikacja diety redukcyjnej (standardowy nabiał niskotłuszczowy, nabiał bez laktozy wyłącznie w jednostkach klinicznych WZJG).',
          'Dodanie miar kuchennych obok gramatury dla wszystkich składników (łyżki, łyżeczki, szklanki, sztuki, plastry, garście).'
        ]
      }
    ]
  },
  {
    version: '1.2',
    date: '2026-10-28',
    time: '05:48 CET',
    title: 'Wydanie 1.2 — Usprawnienia aplikacji mobilnej, minimalizacja gotowania i historia zaleceń',
    badge: 'Poprzednia',
    badgeType: 'slate',
    changes: [
      {
        category: 'Aplikacja Mobilna Android',
        items: [
          'Ujednolicenie motywów: ciemny, jasny, ocean, las z natychmiastowym przełączaniem.',
          'Naprawa uprawnień i kanałów powiadomień Android 13+ (przypomnienia o posiłkach).',
          'Usunięcie banera posiłku z ekranu głównego telefonu.',
          'Przeniesienie kafelka "Załaduj jadłospis" na lewo od selektora daty z tekstem w 2 wierszach.',
          'Przeniesienie przycisku "Zalecenia" do menu "Pomiary".',
          'W menu Zakupy: dodanie wyboru zakresu dat (Od - Do) oraz szybkich kafelków (1d, 3d, 5d, 7d, 14d).',
          'W menu Zakupy: usunięcie zduplikowanego wiersza ze sklepami.',
          'W menu Pomiary: wyświetlanie trendu wagi poziomo w nowym wierszu.',
          'Pionowe przewijanie góra-dół dla wszystkich ekranów menu.'
        ]
      },
      {
        category: 'Jadłospisy i Zalecenia',
        items: [
          'Minimalizacja gotowania na śniadanie, II śniadanie, podwieczorek i obiad (5-10 min).',
          'Zapis w zaleceniach tytułu bieżącego jadłospisu, daty wprowadzenia oraz historii przesłanych pakietów.',
          'Ścisła kontrola dostępu: pacjent ma dostęp wyłącznie do jadłospisów przesłanych mu przez dietetyka w paczkach.'
        ]
      }
    ]
  },
  {
    version: '1.1',
    date: '2026-10-27',
    time: '22:15 CET',
    title: 'Wydanie 1.1 — Podział jadłospisów na płeć, nowe logo i historia zmian',
    badge: 'Wcześniejsza',
    badgeType: 'blue',
    changes: [
      {
        category: 'Podział jadłospisów na płeć',
        items: [
          'Osobne gramatury składników dla kobiet i mężczyzn (amount_female_g i amount_male_g) w każdym przepisie.',
          'Automatyczne skalowanie posiłków i makroskładników w planie dnia w zależności od płci pacjenta.',
          'Inteligentna lista zakupów agregująca ilości produktów zgodnie z płcią pacjenta.',
          'Kalkulator porcji z podglądem gramatur: 👩 Kobieta / 👨 Mężczyzna.'
        ]
      },
      {
        category: 'Kategoryzacja pakietów dietetycznych',
        items: [
          'Wybór płci docelowej w szablonach pakietów (Kobieta, Mężczyzna, Dla każdego).',
          'Filtry płci w oknie wyboru pakietu oraz w panelu administratora.',
          '10 gotowych pakietów 7-dniowych (4 dla kobiet 1500-1750 kcal, 4 dla mężczyzn 2000-2400 kcal, 2 uniwersalne).'
        ]
      },
      {
        category: 'Bezpieczeństwo i uprawnienia pacjenta',
        items: [
          'Dostęp pacjenta ograniczony wyłącznie do pakietów przekazanych przez dietetyka.',
          'Ciągły dostęp do historii wszystkich dotychczas przypisanych pakietów.'
        ]
      },
      {
        category: 'Nowe logo i identyfikacja',
        items: [
          'Nowy logotyp: zielona litera A spleciona z liściem w aplikacji webowej i mobilnej Android.',
          'Odświeżone ikony nawigacji i okna informacyjnego.'
        ]
      },
      {
        category: 'System wersjonowania i dziennik zmian',
        items: [
          'Wprowadzono plik CHANGELOG.md z rejestrem zmian i datami modyfikacji.',
          'Dedykowany przycisk i okno historii zmian w menu informacyjnym aplikacji.',
          'Aktualizacja wersji w stopce strony na ver. 1.1.',
          'Nowy pakiet instalacyjny Android APK v1.1.0.'
        ]
      }
    ]
  },
  {
    version: '1.0',
    date: '2026-10-25',
    time: '19:30 CET',
    title: 'Wydanie 1.0 — Oficjalna premiera ADONIS fit & eat',
    badge: 'Pierwsze wydanie',
    badgeType: 'secondary',
    changes: [
      {
        category: 'Podstawowe funkcjonalności',
        items: [
          'Panel dietetyka i pacjenta z podglądem planów i postępów.',
          'Baza ponad 125 sprawdzonych przepisów kulinarnych ze szczegółowym bilansem makroskładników.',
          'Karty pomiarów: waga, obwód talii oraz dynamiczne BMI z referencyjnymi strefami normy WHO (18.5 – 24.9).',
          'Zagregowana lista zakupów z optymalizacją pod jeden market (One-Stop-Shop).',
          'Komunikator czatu w czasie rzeczywistym między dietetykiem a pacjentem.',
          'Natywna aplikacja mobilna na system Android (Material Design 3).'
        ]
      }
    ]
  }
];
