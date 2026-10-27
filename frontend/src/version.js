export const APP_VERSION = '1.1';
export const APP_RELEASE_DATE = '2026-10-27';

export const CHANGELOG_DATA = [
  {
    version: '1.1',
    date: '2026-10-27',
    time: '22:15 CET',
    title: 'Wydanie 1.1 — Podział jadłospisów na płeć, nowe logo i historia zmian',
    badge: 'Aktualna',
    badgeType: 'emerald',
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
