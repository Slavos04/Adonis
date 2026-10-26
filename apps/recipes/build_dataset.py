# -*- coding: utf-8 -*-
"""
Full Dataset Builder for Adonis Recipes & Diets.
Generates 250 verified culinary and clinical recipes.
"""
import os
import sys
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

def generate_fixtures_file():
    from apps.recipes.generate_fixtures_full import get_products
    products = get_products()
    products_names = {p["name"] for p in products}

    # Helper function to construct a recipe
    def r(title, category, prep_time, instructions, ingredients, image_type):
        for ing_name, _ in ingredients:
            if ing_name not in products_names:
                raise ValueError(f"Unknown ingredient: '{ing_name}' in recipe '{title}'")
        return {
            "title": title,
            "category": category,
            "prep_time": prep_time,
            "instructions": instructions,
            "ingredients": ingredients,
            "image_type": image_type
        }

    recipes = []

    # =========================================================================
    # 1. FITNESS & REDUKCJA & MASA (100 PRZEPISÓW)
    # =========================================================================
    
    # --- Śniadania (25) ---
    recipes.append(r("Wysokobiałkowa owsianka ze skyrem Pilos i borówkami", "Śniadanie", 15,
        "1. Płatki owsiane zalej wrzątkiem (120 ml) i odstaw na 5 minut do napęcznienia.\n2. Wymieszaj z naturalnym skyrem Pilos.\n3. Całość przygotujesz w 15 minut.\n4. Na wierzch wyłóż borówki i masło orzechowe 100%.",
        [("Skyr naturalny Pilos", 150), ("Płatki owsiane górskie Crownfield", 50), ("Borówki amerykańskie Ryneczek Lidla", 70), ("Masło orzechowe 100% orzechów Alesto", 15)], "oatmeal"))
    
    recipes.append(r("Puszysty omlet ze szpinakiem i polędwicą z indyka", "Śniadanie", 15,
        "1. Jaja ściółkowe roztrzep widelcem ze szczyptą soli.\n2. Na patelni z kroplą oliwy podsmaż szpinak baby i szynkę z indyka.\n3. Wlej masę jajeczną, smaż pod przykryciem 5 minut.\n4. Przygotowanie zajmuje dokładnie 15 minut.\n5. Podawaj z chlebem żytnim.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Szynka z piersi indyka Kraina Wędlin", 50), ("Szpinak baby świeży Ryneczek Lidla", 40), ("Chleb żytni 100% z pieca Lidla", 70), ("Oliwa z oliwek Extra Virgin Luccese", 5)], "omelet"))

    recipes.append(r("Jaglanka waniliowo-malinowa z nasionami chia", "Śniadanie", 20,
        "1. Kaszę jaglaną przepłucz wrzątkiem, ugotuj w wodzie do miękkości (12 minut).\n2. Wymieszaj ze skyrem waniliowym Pilos i nasionami chia.\n3. Czas przygotowania wynosi 20 minut.\n4. Udekoruj podgrzanymi malinami mrożonymi.",
        [("Kasza jaglana Plony Natury", 50), ("Skyr waniliowy Pilos", 150), ("Maliny mrożone Mroźna Kraina", 60), ("Nasiona chia Vitanella", 10)], "oatmeal"))

    recipes.append(r("Szakszuka pomidorowa z bazylią i chlebem żytnim", "Śniadanie", 20,
        "1. Na oliwie podsmaż krojone pomidory z oregano i solą przez 5 minut.\n2. Wbij jaja ściółkowe i duś pod przykryciem 6 minut.\n3. Łączny czas przygotowania to 20 minut.\n4. Podawaj z chlebem żytnim.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Pomidory krojone w puszce Freshona", 180), ("Oliwa z oliwek Extra Virgin Luccese", 8), ("Chleb żytni 100% z pieca Lidla", 60)], "shakshuka"))

    recipes.append(r("Placuszki twarogowe z sosem z ciepłych malin", "Śniadanie", 20,
        "1. Twaróg chudy rozgnieć widelcem z jajkiem i płatkami owsianymi.\n2. Smaż placuszki na patelni teflonowej po 3 minuty z każdej strony.\n3. Czas wykonania wynosi 20 minut.\n4. Polej ciepłymi malinami.",
        [("Twaróg chudy Pilos", 120), ("Jaja ściółkowe Moja Kurka", 60), ("Płatki owsiane górskie Crownfield", 40), ("Maliny mrożone Mroźna Kraina", 80), ("Oliwa z oliwek Extra Virgin Luccese", 5)], "pancakes"))

    recipes.append(r("Kanapki z pastą twarogową z tuńczykiem i ogórkiem", "Śniadanie", 10,
        "1. Odsącz tuńczyka, rozgnieć z chudym twarogiem i jogurtem naturalnym.\n2. Posmaruj pastą kromki chleba graham.\n3. Czas przygotowania to zaledwie 10 minut.\n4. Ułóż na wierzchu świeże plastry ogórka.",
        [("Twaróg chudy klinek Delikate", 100), ("Tuńczyk w sosie własnym Marinero", 60), ("Jogurt naturalny gęsty Mleczna Dolina", 30), ("Chleb graham krojony Biedronka", 70), ("Ogórek zielony świeży Biedronka", 50)], "toast"))

    recipes.append(r("Owsianka orzechowo-bananowa na napoju migdałowym", "Śniadanie", 15,
        "1. Płatki owsiane ugotuj w napoju migdałowym Vemondo (7 minut).\n2. Wymieszaj z plastrami banana i łyżką masła orzechowego Alesto.\n3. Przygotujesz w 15 minut.\n4. Sycące i zdrowe śniadanie pełne energii.",
        [("Płatki owsiane górskie Crownfield", 50), ("Napój migdałowy bez cukru Vemondo", 150), ("Banan świeży Ryneczek Lidla", 80), ("Masło orzechowe 100% orzechów Alesto", 15)], "oatmeal"))

    recipes.append(r("Jajka sadzone na szpinaku z pieczywem żytnim Kaufland", "Śniadanie", 12,
        "1. Na oliwie z oliwek K-Bio podduś szpinak baby z solą i czosnkiem (3 minuty).\n2. Wbij jaja ściółkowe K-Classic i smaż do ścięcia białek.\n3. Czas przygotowania wynosi 12 minut.\n4. Podawaj ze świeżym chlebem żytnim.",
        [("Jaja ściółkowe klasa M K-Classic", 120), ("Szpinak baby K-Bio Kaufland", 50), ("Oliwa z oliwek Extra Virgin K-Bio", 6), ("Chleb żytni 100% Kaufland Piekarnia", 60)], "omelet"))

    recipes.append(r("Twarożek z rzodkiewką i ogórkiem na chlebie graham Carrefour", "Śniadanie", 10,
        "1. Twaróg chudy Carrefour Classic wymieszaj z jogurtem naturalnym i posiekanym ogórkiem.\n2. Dopraw szczyptą soli i pieprzu.\n3. Czas przygotowania to 10 minut.\n4. Nałóż na kromki chleba graham.",
        [("Twaróg chudy Carrefour Classic", 120), ("Jogurt naturalny gęsty Mleczna Dolina", 40), ("Ogórek zielony świeży Biedronka", 50), ("Chleb graham krojony Carrefour Piekarnia", 60)], "toast"))

    recipes.append(r("Owsianka proteinowa z truskawkami i skyrem Carrefour", "Śniadanie", 15,
        "1. Płatki owsiane Carrefour Bio zalej wrzątkiem i odstaw na 5 minut.\n2. Wmieszaj skyr naturalny Carrefour Classic i mrożone truskawki.\n3. Danie przygotujesz w 15 minut.\n4. Bogate w antyoksydanty i białko.",
        [("Płatki owsiane górskie Carrefour Bio", 50), ("Skyr naturalny Carrefour Classic", 150), ("Truskawki mrożone Mroźna Kraina", 80), ("Masło orzechowe 100% orzechów Alesto", 10)], "oatmeal"))

    recipes.append(r("Fit szakszuka z mozzarellą light i oregano", "Śniadanie", 20,
        "1. Pomidory w puszce Freshona duś z ziołami na patelni.\n2. Wbij 2 jaja ściółkowe i posyp pokrojoną mozzarellą light Lovilio.\n3. Przykryj i trzymaj na małym ogniu przez 6 minut.\n4. Czas przygotowania to 20 minut.",
        [("Pomidory krojone w puszce Freshona", 160), ("Jaja ściółkowe Moja Kurka", 120), ("Mozzarella light Lovilio Lidl", 40), ("Chleb żytni 100% z pieca Lidla", 60), ("Oliwa z oliwek Extra Virgin Luccese", 5)], "shakshuka"))

    recipes.append(r("Kanapki z szynką Pikok Pure, jajkiem i pomidorem", "Śniadanie", 12,
        "1. Jajko ściółkowe ugotuj na twardo (8 minut) i pokrój w plasterki.\n2. Na kromkach chleba żytniego ułóż szynkę z kurczaka Pikok Pure, plastry jajka i pomidora.\n3. Przygotujesz w 12 minut.",
        [("Chleb żytni 100% z pieca Lidla", 70), ("Szynka z piersi kurczaka Pikok Pure", 50), ("Jaja ściółkowe Moja Kurka", 60), ("Pomidory malinowe Warzywniak Biedronki", 60)], "toast"))

    recipes.append(r("Jaglanka kokosowo-orzechowa z bananem i nasionami chia", "Śniadanie", 20,
        "1. Kaszę jaglaną ugotuj na miękko w wodzie.\n2. Połącz z nasionami chia, bananem i masłem orzechowym 100%.\n3. Czas przygotowania wynosi 20 minut.\n4. Daje długotrwałą sytość.",
        [("Kasza jaglana Plony Natury", 50), ("Banan świeży Ryneczek Lidla", 80), ("Nasiona chia Vitanella", 10), ("Masło orzechowe 100% orzechów Alesto", 15), ("Skyr naturalny Pilos", 80)], "oatmeal"))

    recipes.append(r("Omlet białkowy z tofu i warzywami na patelnię", "Śniadanie", 18,
        "1. Tofu pokrój w kostkę i podsmaż lekko z warzywami Freshona na oliwie.\n2. Zalej roztrzepanymi jajkami ściółkowymi i smaż pod pokrywką 6 minut.\n3. Czas wykonania to 18 minut.\n4. Wspaniałe urozmaicenie diety.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Tofu naturalne bio Vemondo", 80), ("Warzywa na patelnię klasyczne Freshona", 80), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "omelet"))

    recipes.append(r("Gryczanka na słodko z malinami i skyrem waniliowym", "Śniadanie", 20,
        "1. Kaszę gryczaną prażoną ugotuj w lekko osolonej wodzie.\n2. Wymieszaj ze skyrem waniliowym K-Classic i malinami.\n3. Przygotujesz w 20 minut.\n4. Niezwykłe źródło rutyny i magnezu.",
        [("Kasza gryczana prażona K-Classic", 45), ("Skyr waniliowy K-Classic", 150), ("Maliny mrożone Mroźna Kraina", 70)], "oatmeal"))

    recipes.append(r("Tosty z awokado, jajkiem sadzonym i pomidorem malinowym", "Śniadanie", 15,
        "1. Kromki chleba graham opiecz w tosterze lub na patelni.\n2. Awokado rozgnieć z solą i sokiem z cytryny, posmaruj tosty.\n3. Usmaż jajko sadzone i połóż na wierzchu z plastrami pomidora.\n4. Czas: 15 minut.",
        [("Chleb graham krojony Biedronka", 60), ("Awokado Hass Biedronka", 50), ("Jaja ściółkowe Moja Kurka", 60), ("Pomidory malinowe Warzywniak Biedronki", 60), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "toast"))

    recipes.append(r("Owsianka cynamonowa ze skyrem K-Classic i orzechami włoskimi", "Śniadanie", 15,
        "1. Płatki owsiane K-Classic zalej gorącą wodą z cynamonem na 5 minut.\n2. Dodaj gęsty skyr naturalny K-Classic i posiekane orzechy włoskie.\n3. Przygotowanie zajmuje 15 minut.",
        [("Płatki owsiane górskie K-Classic", 50), ("Skyr naturalny K-Classic", 150), ("Orzechy włoskie Biedronka", 15), ("Banan świeży Ryneczek Lidla", 60)], "oatmeal"))

    recipes.append(r("Omlet z polędwicą sopocką i świeżym pomidorem", "Śniadanie", 15,
        "1. Roztrzep jaja ściółkowe ze szczyptą pieprzu.\n2. Podsmaż na kropli oliwy polędwicę sopocką Kraina Wędlin i pomidora malinowego.\n3. Zalej masą jajeczną, smaż 5 minut pod przykryciem.\n4. Czas: 15 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Polędwica sopocka Kraina Wędlin", 50), ("Pomidory malinowe Warzywniak Biedronki", 70), ("Chleb żytni 100% z pieca Lidla", 50), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "omelet"))

    recipes.append(r("Kanapki z pastą jajeczną z koperkiem i chlebem żytnim Kaufland", "Śniadanie", 15,
        "1. Jaja ugotuj na twardo, rozgnieć z jogurtem naturalnym, solą i pieprzem.\n2. Posmaruj pastą kromki chleba żytniego Kaufland Piekarnia.\n3. Całość przygotujesz w 15 minut.\n4. Dodaj świeży ogórek zielony.",
        [("Jaja ściółkowe klasa M K-Classic", 120), ("Jogurt naturalny gęsty Mleczna Dolina", 30), ("Chleb żytni 100% Kaufland Piekarnia", 70), ("Ogórek zielony świeży Biedronka", 50)], "toast"))

    recipes.append(r("Pancakes owsiane ze skyrem i borówkami Ryneczek Lidla", "Śniadanie", 20,
        "1. Płatki owsiane zblenduj ze skyrem naturalnym Pilos i jajkiem na gładkie ciasto.\n2. Smaż małe placuszki na patelni teflonowej po 2.5 minuty z każdej strony.\n3. Czas wykonania to 20 minut.\n4. Udekoruj świeżymi borówkami.",
        [("Płatki owsiane górskie Crownfield", 45), ("Skyr naturalny Pilos", 100), ("Jaja ściółkowe Moja Kurka", 60), ("Borówki amerykańskie Ryneczek Lidla", 60), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "pancakes"))

    recipes.append(r("Płatki orkiszowe na ciepło z bananem i masłem orzechowym", "Śniadanie", 15,
        "1. Płatki orkiszowe Plony Natury ugotuj w wodzie (ok. 6 minut).\n2. Wmieszaj skyr naturalny, plastry banana i masło orzechowe 100%.\n3. Czas: 15 minut.\n4. Zdrowy początek dnia bogaty w witaminy z grupy B.",
        [("Płatki orkiszowe Plony Natury", 50), ("Skyr naturalny Pilos", 100), ("Banan świeży Ryneczek Lidla", 70), ("Masło orzechowe 100% orzechów Alesto", 15)], "oatmeal"))

    recipes.append(r("Jajecznica ze szczypiorkiem i szynką z kurczaka Carrefour", "Śniadanie", 12,
        "1. Na oliwie podsmaż pokrojoną szynkę z kurczaka Carrefour Jakość z Natury.\n2. Wbij 2 jaja ściółkowe i delikatnie mieszaj na małym ogniu do ścięcia.\n3. Przygotujesz w 12 minut.\n4. Podawaj z chlebem graham.",
        [("Jaja ściółkowe Carrefour Classic", 120), ("Szynka z piersi kurczaka Carrefour Jakość z Natury", 50), ("Chleb graham krojony Carrefour Piekarnia", 60), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 4)], "omelet"))

    recipes.append(r("Wrap śniadaniowy z jajkiem sadzonym, szpinakiem i mozzarellą", "Śniadanie", 15,
        "1. Tortillę podgrzej na patelni.\n2. Usmaż jajko sadzone i ułóż w tortilli ze świeżym szpinakiem baby i startą mozzarellą light.\n3. Zawiń ściśle i przekrój na pół.\n4. Czas: 15 minut.",
        [("Tortilla pełnoziarnista Biedronka", 60), ("Jaja ściółkowe Moja Kurka", 60), ("Szpinak baby świeży Ryneczek Lidla", 30), ("Mozzarella light Lovilio Lidl", 40), ("Pomidory malinowe Warzywniak Biedronki", 50)], "wrap"))

    recipes.append(r("Twarogowy bowl z borówkami, bananem i nasionami chia", "Śniadanie", 10,
        "1. Twaróg chudy rozgnieć z jogurtem naturalnym w misce.\n2. Ułóż borówki, plastry banana i posyp nasionami chia Vitanella.\n3. Gotowe w 10 minut bez gotowania!",
        [("Twaróg chudy Pilos", 120), ("Jogurt naturalny gęsty Mleczna Dolina", 50), ("Borówki amerykańskie Ryneczek Lidla", 60), ("Banan świeży Ryneczek Lidla", 60), ("Nasiona chia Vitanella", 10)], "oatmeal"))

    recipes.append(r("Omlet na słodko ze skyrem waniliowym i malinami", "Śniadanie", 18,
        "1. Jaja ściółkowe ubij lekko widelcem i usmaż na patelni jako puszysty omlet.\n2. Złóż na pół i napełnij skyrem waniliowym Pilos oraz ciepłymi malinami.\n3. Czas wykonania to 18 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Skyr waniliowy Pilos", 100), ("Maliny mrożone Mroźna Kraina", 70), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "omelet"))

    # --- Drugie Śniadania (20) ---
    recipes.append(r("Serek wiejski lekki z rzodkiewką i chlebem graham", "Drugie śniadanie", 10,
        "1. Otwórz serek wiejski lekki Delikate.\n2. Ogórka pokrój w kostkę i wymieszaj z serkiem i pieprzem.\n3. Przygotujesz w 10 minut.\n4. Zjedz z chlebem graham.",
        [("Serek wiejski lekki Delikate", 180), ("Chleb graham krojony Biedronka", 60), ("Ogórek zielony świeży Biedronka", 60)], "toast"))

    recipes.append(r("Koktajl proteinowy z truskawkami i skyrem Pilos", "Drugie śniadanie", 8,
        "1. Do blendera wrzuć skyr naturalny Pilos, truskawki mrożone i napój migdałowy.\n2. Dodaj nasiona chia i miksuj przez 60 sekund.\n3. Całość gotowa w 8 minut.\n4. Przelej do bidonu.",
        [("Skyr naturalny Pilos", 180), ("Truskawki mrożone Mroźna Kraina", 120), ("Napój migdałowy bez cukru Vemondo", 150), ("Nasiona chia Vitanella", 10)], "smoothie"))

    recipes.append(r("Wrap pełnoziarnisty z indykiem i mozzarellą light", "Drugie śniadanie", 12,
        "1. Tortillę podgrzej przez 20 sekund.\n2. Ułóż szpinak, szynkę z indyka Kraina Wędlin i mozzarellę light.\n3. Zawiń ściśle w rulon.\n4. Czas wykonania: 12 minut.",
        [("Tortilla pełnoziarnista Biedronka", 60), ("Szynka z piersi indyka Kraina Wędlin", 60), ("Mozzarella light Lovilio Lidl", 40), ("Pomidory malinowe Warzywniak Biedronki", 60), ("Szpinak baby świeży Ryneczek Lidla", 20)], "wrap"))

    recipes.append(r("Pudding chia na napoju migdałowym z borówkami", "Drugie śniadanie", 10,
        "1. Nasiona chia wymieszaj z napojem migdałowym Vemondo.\n2. Na wierzch dodaj skyr waniliowy i borówki amerykańskie.\n3. Przygotowanie zajmuje 10 minut.\n4. Znakomite źródło Omega-3.",
        [("Nasiona chia Vitanella", 25), ("Napój migdałowy bez cukru Vemondo", 180), ("Skyr waniliowy Pilos", 100), ("Borówki amerykańskie Ryneczek Lidla", 50)], "chia"))

    recipes.append(r("Serek wiejski K-Classic z pomidorkami i bazylią", "Drugie śniadanie", 8,
        "1. Serek wiejski lekki K-Classic wymieszaj z pokrojonym pomidorem i suszoną bazylią.\n2. Czas: 8 minut.\n3. Podawaj z chlebem żytnim Kaufland.",
        [("Serek wiejski lekki K-Classic", 180), ("Pomidory malinowe Warzywniak Biedronki", 80), ("Chleb żytni 100% Kaufland Piekarnia", 50)], "toast"))

    recipes.append(r("Koktajl bananowo-kefirowy z cynamonem i orzechami", "Drugie śniadanie", 6,
        "1. Kefir naturalny Mleczna Dolina zblenduj z bananem i szczyptą cynamonu.\n2. Posyp posiekanymi orzechami włoskimi.\n3. Przygotujesz w 6 minut.",
        [("Kefir naturalny Mleczna Dolina", 220), ("Banan świeży Ryneczek Lidla", 90), ("Orzechy włoskie Biedronka", 15)], "smoothie"))

    recipes.append(r("Sałatka z tuńczykiem w sosie własnym i jajkiem", "Drugie śniadanie", 12,
        "1. Jajko ugotuj na twardo i pokrój w ćwiartki.\n2. W misce połącz szpinak baby, odsączonego tuńczyka Marinero, pomidora i jajko.\n3. Skrop oliwą z oliwek.\n4. Czas: 12 minut.",
        [("Tuńczyk w sosie własnym Marinero", 80), ("Jaja ściółkowe Moja Kurka", 60), ("Szpinak baby świeży Ryneczek Lidla", 40), ("Pomidory malinowe Warzywniak Biedronki", 80), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "salad_bowl"))

    recipes.append(r("Serek wiejski Carrefour z bananem i masłem orzechowym", "Drugie śniadanie", 6,
        "1. Do serka wiejskiego Carrefour Classic dodaj pokrojonego w plasterki banana.\n2. Polej łyżeczką masła orzechowego 100%.\n3. Gotowe w 6 minut!",
        [("Serek wiejski lekki Carrefour Classic", 180), ("Banan świeży Ryneczek Lidla", 80), ("Masło orzechowe 100% orzechów Alesto", 15)], "dessert"))

    recipes.append(r("Wrap z pieczoną piersią z kurczaka i sosem jogurtowym", "Drugie śniadanie", 15,
        "1. Tortillę podgrzej, posmaruj sosem z jogurtu naturalnego i czosnku.\n2. Ułóż upieczoną pierś z kurczaka, ogórek i szpinak.\n3. Zwiń ściśle.\n4. Czas: 15 minut.",
        [("Tortilla pełnoziarnista Biedronka", 60), ("Pierś z kurczaka Rzeźnik", 70), ("Jogurt naturalny gęsty Mleczna Dolina", 30), ("Szpinak baby świeży Ryneczek Lidla", 30), ("Ogórek zielony świeży Biedronka", 40)], "wrap"))

    recipes.append(r("Shake malinowy na kefirze ze skyrem waniliowym", "Drugie śniadanie", 6,
        "1. Zmiksuj kefir naturalny, skyr waniliowy Pilos i mrożone maliny.\n2. Gotowe w 6 minut.\n3. Orzeźwiający i wysokobiałkowy posiłek na wynos.",
        [("Kefir naturalny Mleczna Dolina", 150), ("Skyr waniliowy Pilos", 100), ("Maliny mrożone Mroźna Kraina", 80)], "smoothie"))

    recipes.append(r("Twaróg z awokado i pomidorem na waflach ryżowych", "Drugie śniadanie", 10,
        "1. Twaróg chudy Delikate rozgnieć z dojrzałym awokado i odrobiną soli.\n2. Nałóż pastę na chrupkie wafle ryżowe Good Food i połóż plasterki pomidora.\n3. Czas: 10 minut.",
        [("Twaróg chudy klinek Delikate", 100), ("Awokado Hass Biedronka", 40), ("Wafle ryżowe naturalne Good Food", 30), ("Pomidory malinowe Warzywniak Biedronki", 60)], "toast"))

    recipes.append(r("Sałatka z ciecierzycą, szpinakiem i mozzarellą light", "Drugie śniadanie", 10,
        "1. Odsącz ciecierzycę ze słoika Culinea.\n2. Połącz ze świeżym szpinakiem baby, pokrojoną mozzarellą i pomidorem.\n3. Polej oliwą z oliwek.\n4. Przygotujesz w 10 minut.",
        [("Ciecierzyca w słoiku Culinea", 80), ("Mozzarella light Lovilio Lidl", 50), ("Szpinak baby świeży Ryneczek Lidla", 40), ("Pomidory malinowe Warzywniak Biedronki", 70), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "salad_bowl"))

    recipes.append(r("Kanapka z pastą z czerwonej fasoli i ogórkiem", "Drugie śniadanie", 10,
        "1. Fasolę czerwoną ze słoika zblenduj z łyżeczką oliwy, solą i majerankiem na gładki pasztet.\n2. Posmaruj chleb żytni z pieca Lidla i dodaj plastry ogórka.\n3. Czas: 10 minut.",
        [("Fasola czerwona Nasze Smaki", 80), ("Chleb żytni 100% z pieca Lidla", 60), ("Ogórek zielony świeży Biedronka", 50), ("Oliwa z oliwek Extra Virgin Luccese", 5)], "toast"))

    recipes.append(r("Smoothie bowl ze skyrem, jagodami i płatkami orkiszowymi", "Drugie śniadanie", 8,
        "1. Zblenduj skyr waniliowy z borówkami na gęsty mus i przelej do miski.\n2. Posyp chrupiącymi płatkami orkiszowymi Plony Natury.\n3. Czas wykonania: 8 minut.",
        [("Skyr waniliowy Pilos", 150), ("Borówki amerykańskie Ryneczek Lidla", 80), ("Płatki orkiszowe Plony Natury", 30)], "smoothie"))

    recipes.append(r("Mini sałatka z łososiem wędzonym i jajkiem na twardo", "Drugie śniadanie", 12,
        "1. Szpinak baby ułóż na talerzu, dodaj kawałki łososia wędzonego Marinero i ugotowane jajko.\n2. Skrop sokiem z cytryny i oliwą.\n3. Czas: 12 minut.",
        [("Łosoś wędzony na gorąco Marinero", 60), ("Jaja ściółkowe Moja Kurka", 60), ("Szpinak baby świeży Ryneczek Lidla", 30), ("Pomidory malinowe Warzywniak Biedronki", 60), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "salad_bowl"))

    recipes.append(r("Skyr naturalny K-Classic z bananem i orzechami włoskimi", "Drugie śniadanie", 5,
        "1. Skyr naturalny K-Classic przełóż do kubka, dodaj pokrojonego banana i orzechy włoskie.\n2. Błyskawiczny posiłek gotowy w 5 minut!",
        [("Skyr naturalny K-Classic", 150), ("Banan świeży Ryneczek Lidla", 80), ("Orzechy włoskie Biedronka", 15)], "dessert"))

    recipes.append(r("Kanapki z szynką z piersi indyka i pastą z awokado", "Drugie śniadanie", 10,
        "1. Chleb graham posmaruj dojrzałym awokado roztartym z solą.\n2. Połóż szynkę z piersi indyka K-Purland i pomidora.\n3. Czas przygotowania to 10 minut.",
        [("Chleb graham krojony Biedronka", 60), ("Awokado Hass Biedronka", 40), ("Szynka z piersi indyka K-Purland", 50), ("Pomidory malinowe Warzywniak Biedronki", 60)], "toast"))

    recipes.append(r("Kefir Mleczna Dolina z borówkami i nasionami chia", "Drugie śniadanie", 6,
        "1. Do wysokiej szklanki wlej kefir naturalny, wsyp borówki i nasiona chia Vitanella.\n2. Wymieszaj i odstaw na 5 minut.\n3. Łączny czas: 6 minut.",
        [("Kefir naturalny Mleczna Dolina", 220), ("Borówki amerykańskie Ryneczek Lidla", 70), ("Nasiona chia Vitanella", 10)], "smoothie"))

    recipes.append(r("Wafle ryżowe z masłem orzechowym i plastrami jabłka", "Drugie śniadanie", 5,
        "1. Wafle ryżowe Good Food posmaruj masłem orzechowym Alesto.\n2. Ułóż cienkie plasterki jabłka Gala i posyp cynamonem.\n3. Czas: 5 minut.",
        [("Wafle ryżowe naturalne Good Food", 30), ("Masło orzechowe 100% orzechów Alesto", 20), ("Jabłka polskie Gala Biedronka", 70)], "toast"))

    recipes.append(r("Koktajl z tofu Vemondo, banana i truskawek", "Drugie śniadanie", 8,
        "1. Tofu bio, banana, truskawki mrożone i napój migdałowy zblenduj na kremowy shake.\n2. Roślinny zastrzyk białka w 8 minut!",
        [("Tofu naturalne bio Vemondo", 90), ("Banan świeży Ryneczek Lidla", 80), ("Truskawki mrożone Mroźna Kraina", 100), ("Napój migdałowy bez cukru Vemondo", 150)], "smoothie"))

    # --- Obiady (30) ---
    recipes.append(r("Pieczona pierś z kurczaka z ryżem basmati i warzywami", "Obiad", 30,
        "1. Pierś z kurczaka przypraw ziołami prowansalskimi i upiecz w 190°C (20 minut).\n2. Ugotuj ryż basmati (10 minut).\n3. Podduś warzywa Freshona na oliwie.\n4. Czas: 30 minut.",
        [("Pierś z kurczaka Rzeźnik", 180), ("Ryż basmati Golden Sun", 60), ("Warzywa na patelnię klasyczne Freshona", 180), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "chicken"))

    recipes.append(r("Penne pełnoziarniste z sosem bolońskim z chudego indyka", "Obiad", 25,
        "1. Makaron penne ugotuj al dente (10 minut).\n2. Na oliwie podsmaż mięso mielone z indyka z czosnkiem i solą.\n3. Dodaj krojone pomidory i duś 12 minut.\n4. Czas wykonania to 25 minut.",
        [("Mięso mielone z piersi indyka Biedronka", 160), ("Makaron pełnoziarnisty penne Combino", 70), ("Pomidory krojone w puszce Freshona", 180), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "pasta"))

    recipes.append(r("Pieczony dorsz atlantycki w ziołach z kaszą gryczaną", "Obiad", 25,
        "1. Filet z dorsza oprósz solą, skrop sokiem z cytryny i oliwą, piecz 15 minut w 180°C.\n2. Ugotuj kaszę gryczaną prażoną (15 minut).\n3. Podawaj z sałatką z pomidora.\n4. Czas: 25 minut.",
        [("Dorsz atlantycki świeży Lidl", 200), ("Kasza gryczana prażona Kuchnia Lidla", 60), ("Oliwa z oliwek Extra Virgin Luccese", 8), ("Pomidory malinowe Warzywniak Biedronki", 100)], "fish"))

    recipes.append(r("Stek z łososia pieczony na parze z kaszą jaglaną", "Obiad", 25,
        "1. Łososia i szpinak baby ugotuj na parze przez 12-14 minut.\n2. Kaszę jaglaną ugotuj na sypko.\n3. Danie gotowe w 25 minut.\n4. Pełne kwasów Omega-3.",
        [("Łosoś atlantycki filet świeży Lidl", 150), ("Kasza jaglana Plony Natury", 50), ("Szpinak baby świeży Ryneczek Lidla", 60), ("Pomidory malinowe Warzywniak Biedronki", 80)], "salmon"))

    recipes.append(r("Fit Stir-Fry z tofu Vemondo i warzywami na patelnię", "Obiad", 20,
        "1. Tofu pokrój w kostkę i podsmaż na złoto na oliwie.\n2. Wsyp warzywa Freshona i duś pod przykryciem 8 minut.\n3. Podawaj z ryżem basmati.\n4. Czas: 20 minut.",
        [("Tofu naturalne bio Vemondo", 160), ("Ryż basmati Golden Sun", 60), ("Warzywa na patelnię klasyczne Freshona", 180), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "salad_bowl"))

    recipes.append(r("Gulasz z indyka z warzywami i kaszą gryczaną", "Obiad", 30,
        "1. Polędwiczki z indyka pokrój w kostkę i podsmaż na oliwie.\n2. Dodaj krojone pomidory, liść laurowy i duś 18 minut.\n3. Podawaj z ugotowaną kaszą gryczaną.\n4. Czas: 30 minut.",
        [("Polędwiczki z indyka Rzeźnik", 180), ("Kasza gryczana prażona Kuchnia Lidla", 60), ("Pomidory krojone w puszce Freshona", 140), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "chicken"))

    recipes.append(r("Dorsz pieczony w papilotach z batatami i cukinią", "Obiad", 30,
        "1. Bataty pokrój w plastry i piecz w 200°C przez 15 minut.\n2. Dorsz zawinięty w pergamin z cukinią i oliwą dołóż do piekarnika na kolejne 15 minut.\n3. Łączny czas: 30 minut.",
        [("Dorsz atlantycki świeży Lidl", 180), ("Bataty słodkie ziemniaki Ryneczek Lidla", 160), ("Cukinia świeża Biedronka", 100), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "fish"))

    recipes.append(r("Pierś z kurczaka K-Purland z kaszą gryczaną i warzywami K-Classic", "Obiad", 30,
        "1. Pierś z kurczaka upiecz w piekarniku z ziołami (20 minut).\n2. Ugotuj kaszę gryczaną K-Classic (15 minut).\n3. Podduś warzywa na patelnię K-Classic.\n4. Czas: 30 minut.",
        [("Pierś z kurczaka K-Purland", 180), ("Kasza gryczana prażona K-Classic", 60), ("Warzywa na patelnię klasyczne K-Classic", 180), ("Oliwa z oliwek Extra Virgin K-Bio", 8)], "chicken"))

    recipes.append(r("Penne z kurczakiem, szpinakiem i sosem pomidorowym", "Obiad", 25,
        "1. Makaron penne ugotuj al dente.\n2. Pierś z kurczaka podsmaż na oliwie, dodaj świeży szpinak baby i pomidory krojone Freshona.\n3. Połącz z makaronem.\n4. Czas: 25 minut.",
        [("Pierś z kurczaka świeża Biedronka", 160), ("Makaron pełnoziarnisty penne Combino", 70), ("Pomidory krojone w puszce Freshona", 150), ("Szpinak baby świeży Ryneczek Lidla", 50), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "pasta"))

    recipes.append(r("Pulpety z indyka z sosem pomidorowym i ryżem brązowym", "Obiad", 30,
        "1. Mięso mielone z indyka wymieszaj z białkiem jaja i ziołami, uformuj pulpety.\n2. Gotuj w sosie ze zblendowanych pomidorów przez 16 minut.\n3. Podawaj z ryżem brązowym Plony Natury.\n4. Czas: 30 minut.",
        [("Mięso mielone z piersi indyka Biedronka", 160), ("Pomidory krojone w puszce Freshona", 180), ("Ryż brązowy Plony Natury", 60), ("Jaja ściółkowe Moja Kurka", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    recipes.append(r("Łosoś pieczony z batatami i szpinakiem baby Kaufland", "Obiad", 25,
        "1. Filet z łososia Kaufland i pokrojone bataty ułóż na blaszce, skrop oliwą K-Bio i piecz 20 minut w 190°C.\n2. Szpinak baby podsmaż lekko na patelni.\n3. Czas: 25 minut.",
        [("Łosoś atlantycki świeży filet Kaufland", 150), ("Bataty słodkie ziemniaki Ryneczek Lidla", 160), ("Szpinak baby K-Bio Kaufland", 60), ("Oliwa z oliwek Extra Virgin K-Bio", 6)], "salmon"))

    recipes.append(r("Curry z ciecierzycą, warzywami i ryżem basmati", "Obiad", 25,
        "1. Na oliwie podsmaż warzywa Freshona, dodaj ciecierzycę ze słoika i krojone pomidory.\n2. Dopraw curry i duś 12 minut.\n3. Podawaj z ugotowanym ryżem basmati.\n4. Czas: 25 minut.",
        [("Ciecierzyca w słoiku Culinea", 120), ("Pomidory krojone w puszce Freshona", 160), ("Warzywa na patelnię klasyczne Freshona", 120), ("Ryż basmati Golden Sun", 60), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "curry"))

    recipes.append(r("Filet z kurczaka Carrefour z makaronem penne i cukinią", "Obiad", 25,
        "1. Pierś z kurczaka i cukinię pokrój w kostkę i podsmaż na oliwie Carrefour Classic.\n2. Makaron penne Carrefour Bio ugotuj al dente i połącz z kurczakiem.\n3. Czas: 25 minut.",
        [("Pierś z kurczaka Carrefour Jakość z Natury", 170), ("Makaron pełnoziarnisty penne Carrefour Bio", 65), ("Cukinia świeża Biedronka", 120), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 8)], "pasta"))

    recipes.append(r("Dorsz duszony w pomidorach z kaszą jaglaną", "Obiad", 25,
        "1. Filet z dorsza duś na patelni z krojonymi pomidorami i oregano przez 12 minut.\n2. Równolegle ugotuj kaszę jaglaną na sypko.\n3. Danie gotowe w 25 minut.",
        [("Dorsz atlantycki świeży Lidl", 190), ("Pomidory krojone w puszce Freshona", 160), ("Kasza jaglana Plony Natury", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "fish"))

    recipes.append(r("Polędwiczki z indyka z puree ziemniaczanym i gotowaną marchewką", "Obiad", 30,
        "1. Ziemniaki i marchew ugotuj w osolonej wodzie (18 minut), utłucz z odrobiną oliwy.\n2. Polędwiczki z indyka upiecz w rękawie w 180°C (18 minut).\n3. Czas: 30 minut.",
        [("Polędwiczki z indyka Rzeźnik", 180), ("Ziemniaki polskie Biedronka", 180), ("Marchew świeża myta Ryneczek Lidla", 120), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "puree"))

    recipes.append(r("Chili sin carne z tofu Vemondo i czerwoną fasolą", "Obiad", 25,
        "1. Tofu pokrusz widelcem i podsmaż na oliwie z przyprawami.\n2. Dodaj czerwoną fasolę ze słoika i krojone pomidory, duś 12 minut.\n3. Podawaj z ryżem basmati.\n4. Czas: 25 minut.",
        [("Tofu naturalne bio Vemondo", 140), ("Fasola czerwona Nasze Smaki", 100), ("Pomidory krojone w puszce Freshona", 160), ("Ryż basmati Golden Sun", 60), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "curry"))

    recipes.append(r("Pieczona pierś z kurczaka z purée z batatów i szpinakiem", "Obiad", 30,
        "1. Bataty ugotuj i ugnieć na gładkie purée.\n2. Pierś z kurczaka upiecz na patelni grillowej (12 minut).\n3. Szpinak baby podduś na łyżeczce oliwy.\n4. Czas przygotowania: 30 minut.",
        [("Pierś z kurczaka świeża Biedronka", 180), ("Bataty słodkie ziemniaki Ryneczek Lidla", 180), ("Szpinak baby świeży Ryneczek Lidla", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "puree"))

    recipes.append(r("Risotto z indykiem, cukinią i pomidorami malinowymi", "Obiad", 25,
        "1. Na oliwie podsmaż pokrojonego indyka i plasterki cukinii.\n2. Dodaj biały ryż i stopniowo podlewaj wywarem, gotując 15 minut.\n3. Na koniec wmieszaj pomidory malinowe.\n4. Czas: 25 minut.",
        [("Polędwiczki z indyka K-Purland", 170), ("Ryż biały długoziarnisty Plony Natury", 65), ("Cukinia świeża Biedronka", 100), ("Pomidory malinowe Warzywniak Biedronki", 80), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "chicken"))

    recipes.append(r("Kotlety z tuńczyka i twarogu z kaszą gryczaną", "Obiad", 25,
        "1. Odsączonego tuńczyka wymieszaj z twarogiem chudym, jajkiem i ziołami, uformuj kotleciki.\n2. Piecz w 190°C przez 15 minut.\n3. Podawaj z kaszą gryczaną prażoną.\n4. Czas: 25 minut.",
        [("Tuńczyk w sosie własnym Marinero", 120), ("Twaróg chudy Pilos", 80), ("Jaja ściółkowe Moja Kurka", 60), ("Kasza gryczana prażona Kuchnia Lidla", 60), ("Oliwa z oliwek Extra Virgin Luccese", 5)], "fish"))

    recipes.append(r("Dorsz z patelni z warzywami na patelnię Carrefour", "Obiad", 20,
        "1. Na oliwie podduś mrożone warzywa Carrefour Classic przez 8 minut.\n2. Dołóż pokrojony filet z dorsza Carrefour i duś pod przykryciem 8 minut.\n3. Podawaj z ryżem basmati.\n4. Czas: 20 minut.",
        [("Dorsz atlantycki świeży filet Carrefour", 190), ("Warzywa na patelnię klasyczne Carrefour", 180), ("Ryż basmati Carrefour Extra", 60), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 8)], "fish"))

    recipes.append(r("Pieczone udka z kurczaka bez skóry z ziemniakami i marchewką", "Obiad", 35,
        "1. Ziemniaki i marchewkę pokrój w słupki, wymieszaj z oliwą i ziołami.\n2. Mięso z piersi kurczaka i warzywa piecz w 200°C przez 25 minut.\n3. Czas: 35 minut.",
        [("Pierś z kurczaka Rzeźnik", 180), ("Ziemniaki polskie Biedronka", 180), ("Marchew świeża myta Ryneczek Lidla", 100), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "chicken"))

    recipes.append(r("Fit bolognese z tofu Vemondo i makaronem penne", "Obiad", 25,
        "1. Tofu zetrzyj na tarce o grubych oczkach i podsmaż na oliwie z czosnkiem i oregano.\n2. Dodaj pomidory krojone Freshona i duś 12 minut.\n3. Wymieszaj z penne pełnoziarnistym Combino.\n4. Czas: 25 minut.",
        [("Tofu naturalne bio Vemondo", 150), ("Pomidory krojone w puszce Freshona", 180), ("Makaron pełnoziarnisty penne Combino", 70), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "pasta"))

    recipes.append(r("Łosoś pieczony w ziołach z purée ziemniaczanym i pomidorkami", "Obiad", 30,
        "1. Filet z łososia piecz w pergaminie przez 15 minut w 180°C.\n2. Ziemniaki ugotuj i utłucz na gładkie purée.\n3. Podawaj ze świeżym pomidorem malinowym.\n4. Czas: 30 minut.",
        [("Łosoś atlantycki filet świeży Lidl", 150), ("Ziemniaki polskie Biedronka", 180), ("Pomidory malinowe Warzywniak Biedronki", 90), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "salmon"))

    recipes.append(r("Pierś z indyka duszona w cukinii i pomidorach z ryżem", "Obiad", 25,
        "1. Indyk pokrój w paski, podsmaż na oliwie, dodaj pokrojoną cukinię i pomidory w puszce.\n2. Duś 14 minut na małym ogniu.\n3. Podawaj z ryżem basmati.\n4. Czas: 25 minut.",
        [("Polędwiczki z indyka Rzeźnik", 180), ("Cukinia świeża Biedronka", 120), ("Pomidory krojone w puszce Freshona", 140), ("Ryż basmati Golden Sun", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    recipes.append(r("Dorsz pieczony z dynią i kaszą gryczaną K-Classic", "Obiad", 30,
        "1. Dynię pokrój w kostkę i podpiecz w piekarniku (15 minut).\n2. Dołóż dorsza Kaufland skropionego oliwą i piecz kolejne 12 minut.\n3. Podawaj z kaszą gryczaną K-Classic.\n4. Czas: 30 minut.",
        [("Dorsz atlantycki filet świeży Kaufland", 190), ("Dynia świeża krojona Biedronka", 150), ("Kasza gryczana prażona K-Classic", 60), ("Oliwa z oliwek Extra Virgin K-Bio", 8)], "fish"))

    recipes.append(r("Makaron penne z tuńczykiem, pomidorami i szpinakiem baby", "Obiad", 20,
        "1. Ugotuj penne al dente.\n2. Na patelni podgrzej pomidory w puszce, wrzuć odsączonego tuńczyka Marinero i liście szpinaku baby.\n3. Połącz z makaronem.\n4. Czas: 20 minut.",
        [("Makaron pełnoziarnisty penne Combino", 70), ("Tuńczyk w sosie własnym Marinero", 100), ("Pomidory krojone w puszce Freshona", 150), ("Szpinak baby świeży Ryneczek Lidla", 40), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "pasta"))

    recipes.append(r("Gulasz drobiowy z warzywami na patelnię i kaszą jaglaną", "Obiad", 25,
        "1. Pierś z kurczaka pokrój w kostkę i podsmaż na oliwie.\n2. Dodaj warzywa klasyczne Freshona i 50 ml wody, duś 12 minut.\n3. Serwuj z ugotowaną kaszą jaglaną.\n4. Czas: 25 minut.",
        [("Pierś z kurczaka świeża Biedronka", 170), ("Warzywa na patelnię klasyczne Freshona", 160), ("Kasza jaglana Plony Natury", 60), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "chicken"))

    recipes.append(r("Indyk pieczony z batatami i świeżym szpinakiem Carrefour", "Obiad", 30,
        "1. Bataty pokrój w słupki, indyka w plastry, ułóż na blaszce z oliwą i piecz 20 minut w 190°C.\n2. Podawaj ze świeżym szpinakiem baby Carrefour Bio.\n3. Czas: 30 minut.",
        [("Polędwiczki z indyka Carrefour", 180), ("Bataty słodkie ziemniaki Ryneczek Lidla", 160), ("Szpinak baby Carrefour Bio", 50), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 8)], "chicken"))

    recipes.append(r("Zupa krem dyniowa z pieczoną piersią z kurczaka", "Obiad", 30,
        "1. Dynię i marchewkę ugotuj do miękkości z solą (15 minut) i zblenduj na krem z oliwą.\n2. Pierś z kurczaka upiecz na patelni i pokrój w paski na wierzch zupy.\n3. Czas: 30 minut.",
        [("Dynia świeża krojona Biedronka", 200), ("Marchew świeża myta Ryneczek Lidla", 100), ("Pierś z kurczaka Rzeźnik", 150), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "soup"))

    recipes.append(r("Lekkie pulpety z kurczaka w sosie koperkowym z ryżem basmati", "Obiad", 28,
        "1. Z mielonego mięsa uformuj małe kulki i ugotuj w bulionie warzywnym (12 minut).\n2. Dodaj jogurt naturalny i świeży koperek, zagęszczając sos.\n3. Podawaj z ryżem basmati.\n4. Czas: 28 minut.",
        [("Mięso mielone z piersi indyka Biedronka", 160), ("Ryż basmati Golden Sun", 60), ("Jogurt naturalny gęsty Mleczna Dolina", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    # --- Podwieczorki (10) ---
    recipes.append(r("Deser proteinowy: Skyr z masłem orzechowym i malinami", "Przekąska / Podwieczorek", 5,
        "1. Do pucharka przełóż skyr naturalny Pilos.\n2. Dodaj masło orzechowe 100% Alesto i maliny.\n3. Błyskawiczny deser gotowy w 5 minut!",
        [("Skyr naturalny Pilos", 150), ("Masło orzechowe 100% orzechów Alesto", 15), ("Maliny mrożone Mroźna Kraina", 60)], "dessert"))

    recipes.append(r("Chrupiące słupki ogórka z pastą twarogową", "Przekąska / Podwieczorek", 8,
        "1. Twaróg chudy utrzyj widelcem z tuńczykiem i pieprzem.\n2. Ogórka pokrój w grube słupki do maczania.\n3. Czas przygotowania: 8 minut.",
        [("Twaróg chudy Pilos", 100), ("Tuńczyk w sosie własnym Marinero", 60), ("Ogórek zielony świeży Biedronka", 100)], "toast"))

    recipes.append(r("Kefir Mleczna Dolina z orzechami włoskimi i cynamonem", "Przekąska / Podwieczorek", 5,
        "1. Do kubka wlej naturalny kefir, wsyp posiekane orzechy włoskie i cynamon.\n2. Gotowe w 5 minut.",
        [("Kefir naturalny Mleczna Dolina", 250), ("Orzechy włoskie Biedronka", 20)], "smoothie"))

    recipes.append(r("Pieczone jabłko z cynamonem i orzechami włoskimi", "Przekąska / Podwieczorek", 18,
        "1. Jabłko wydrąż, posyp cynamonem i posiekanymi orzechami włoskimi.\n2. Piecz w 180°C przez 14 minut do miękkości.\n3. Czas: 18 minut.",
        [("Jabłka polskie Gala Biedronka", 150), ("Orzechy włoskie Biedronka", 15)], "apple"))

    recipes.append(r("Skyr waniliowy K-Classic z borówkami i chia", "Przekąska / Podwieczorek", 5,
        "1. W miseczce wymieszaj skyr waniliowy K-Classic z borówkami i nasionami chia.\n2. Czas: 5 minut.",
        [("Skyr waniliowy K-Classic", 150), ("Borówki amerykańskie Ryneczek Lidla", 60), ("Nasiona chia Vitanella", 10)], "dessert"))

    recipes.append(r("Mus bananowo-truskawkowy z waflami ryżowymi", "Przekąska / Podwieczorek", 8,
        "1. Zblenduj banana z truskawkami mrożonymi na gęsty mus owocowy.\n2. Podawaj z chrupkimi waflami ryżowymi Good Food.\n3. Czas: 8 minut.",
        [("Banan świeży Ryneczek Lidla", 90), ("Truskawki mrożone Mroźna Kraina", 80), ("Wafle ryżowe naturalne Good Food", 20)], "smoothie"))

    recipes.append(r("Serek wiejski z cynamonem i plastrami jabłka Gala", "Przekąska / Podwieczorek", 5,
        "1. Serek wiejski lekki Delikate oprósz cynamonem i podaj z chrupiącymi plasterkami jabłka.\n2. Czas: 5 minut.",
        [("Serek wiejski lekki Delikate", 180), ("Jabłka polskie Gala Biedronka", 100)], "dessert"))

    recipes.append(r("Smoothie truskawkowo-migdałowe z nasionami chia", "Przekąska / Podwieczorek", 6,
        "1. Napój migdałowy Vemondo zblenduj z truskawkami i nasionami chia na gładki koktajl.\n2. Czas: 6 minut.",
        [("Napój migdałowy bez cukru Vemondo", 200), ("Truskawki mrożone Mroźna Kraina", 120), ("Nasiona chia Vitanella", 10)], "smoothie"))

    recipes.append(r("Deser twarogowy ze skyrem i musem malinowym Carrefour", "Przekąska / Podwieczorek", 8,
        "1. Twaróg chudy Carrefour Classic utrzyj ze skyrem na gładką masę.\n2. Polej zblendowanymi malinami.\n3. Przygotujesz w 8 minut.",
        [("Twaróg chudy Carrefour Classic", 100), ("Skyr naturalny Carrefour Classic", 60), ("Maliny mrożone Mroźna Kraina", 60)], "dessert"))

    recipes.append(r("Fit batoniki domowe z płatków owsianych i masła orzechowego", "Przekąska / Podwieczorek", 15,
        "1. Płatki owsiane wymieszaj z masłem orzechowym Alesto i bananem rozgniecionym na miazgę.\n2. Uformuj batoniki i schłodź w lodówce lub zapiecz 10 minut w 180°C.\n3. Czas: 15 minut.",
        [("Płatki owsiane górskie Crownfield", 40), ("Masło orzechowe 100% orzechów Alesto", 20), ("Banan świeży Ryneczek Lidla", 70)], "dessert"))

    # --- Kolacje (15) ---
    recipes.append(r("Sałatka fit z grillowaną piersią z kurczaka i sosem jogurtowym", "Kolacja", 20,
        "1. Pierś z kurczaka upiecz na patelni grillowej (8 minut) i pokrój w paski.\n2. Szpinak baby ułóż w misce z pomidorem malinowym.\n3. Polej sosem z jogurtu naturalnego i czosnku.\n4. Czas: 20 minut.",
        [("Pierś z kurczaka Rzeźnik", 150), ("Jogurt naturalny gęsty Mleczna Dolina", 60), ("Chleb żytni 100% z pieca Lidla", 40), ("Szpinak baby świeży Ryneczek Lidla", 50), ("Pomidory malinowe Warzywniak Biedronki", 80)], "salad_bowl"))

    recipes.append(r("Twarożek na słono z rzodkiewką i chlebem graham", "Kolacja", 10,
        "1. Twaróg chudy Delikate połącz z jogurtem naturalnym i ogórkiem pokrojonym w kostkę.\n2. Dopraw pieprzem i zjedz z chlebem graham.\n3. Czas: 10 minut.",
        [("Twaróg chudy klinek Delikate", 140), ("Jogurt naturalny gęsty Mleczna Dolina", 40), ("Chleb graham krojony Biedronka", 60), ("Ogórek zielony świeży Biedronka", 60)], "toast"))

    recipes.append(r("Krem pomidorowy z mozzarellą light i grzankami", "Kolacja", 18,
        "1. Pomidory w puszce Freshona zagotuj z bazylią i oliwą, zblenduj na gładko.\n2. Kromkę chleba żytniego pokrój w kostkę i podpiecz na chrupkie grzanki.\n3. Do zupy wrzuć pokrojoną mozzarellę light.\n4. Czas: 18 minut.",
        [("Pomidory krojone w puszce Freshona", 250), ("Mozzarella light Lovilio Lidl", 50), ("Chleb żytni 100% z pieca Lidla", 40), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Omlet warzywny z cukinią i pomidorem malinowym", "Kolacja", 15,
        "1. Cukinię zetrzyj na tarce i podsmaż na oliwie przez 3 minuty z pokrojonym pomidorem.\n2. Zalej roztrzepanymi jajkami ściółkowymi i smaż pod przykryciem do ścięcia (5 minut).\n3. Czas: 15 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Cukinia świeża Biedronka", 80), ("Pomidory malinowe Warzywniak Biedronki", 70), ("Oliwa z oliwek Extra Virgin Luccese", 5)], "omelet"))

    recipes.append(r("Sałatka z wędzonym łososiem, ogórkiem i chlebem graham", "Kolacja", 12,
        "1. Szpinak baby ułóż w salaterce, dodaj kawałki łososia wędzonego Marinero i plastry ogórka.\n2. Skrop oliwą i zjedz z kromką chleba graham.\n3. Czas: 12 minut.",
        [("Łosoś wędzony na gorąco Marinero", 70), ("Szpinak baby świeży Ryneczek Lidla", 40), ("Ogórek zielony świeży Biedronka", 60), ("Chleb graham krojony Biedronka", 50), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "salad_bowl"))

    recipes.append(r("Aksamitny krem z cukinii z grzankami żytnimi Kaufland", "Kolacja", 20,
        "1. Cukinię i ziemniaka ugotuj w osolonej wodzie (12 minut) i zblenduj z oliwą K-Bio.\n2. Chleb żytni Kaufland pokrój i podpiecz na chrupkie grzanki.\n3. Czas: 20 minut.",
        [("Cukinia świeża Biedronka", 160), ("Ziemniaki polskie Biedronka", 100), ("Chleb żytni 100% Kaufland Piekarnia", 40), ("Oliwa z oliwek Extra Virgin K-Bio", 6)], "soup"))

    recipes.append(r("Pasta jajeczna z tuńczykiem na chlebie graham Carrefour", "Kolacja", 12,
        "1. Jajko ugotowane na twardo rozgnieć z tuńczykiem w sosie własnym i łyżką jogurtu.\n2. Nałóż na kromki chleba graham Carrefour Piekarnia.\n3. Czas: 12 minut.",
        [("Jaja ściółkowe Carrefour Classic", 60), ("Tuńczyk kawałki w sosie własnym Carrefour", 70), ("Jogurt naturalny gęsty Mleczna Dolina", 25), ("Chleb graham krojony Carrefour Piekarnia", 60)], "toast"))

    recipes.append(r("Zapiekanka warzywna z mozzarellą light i pomidorami", "Kolacja", 25,
        "1. Cukinię i pomidora pokrój w plastry, ułóż w naczyniu żaroodpornym, oprósz oregano i solą.\n2. Posyp mozzarellą light Lovilio i zapiecz w 190°C przez 18 minut.\n3. Czas: 25 minut.",
        [("Cukinia świeża Biedronka", 140), ("Pomidory malinowe Warzywniak Biedronki", 100), ("Mozzarella light Lovilio Lidl", 50), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "salad_bowl"))

    recipes.append(r("Kanapki z szynką z indyka K-Purland, jajkiem i ogórkiem", "Kolacja", 10,
        "1. Chleb żytni Kaufland obłóż szynką z indyka K-Purland, plastrami ugotowanego jajka i ogórka.\n2. Pyszna i lekka kolacja w 10 minut.",
        [("Chleb żytni 100% Kaufland Piekarnia", 60), ("Szynka z piersi indyka K-Purland", 50), ("Jaja ściółkowe klasa M K-Classic", 60), ("Ogórek zielony świeży Biedronka", 50)], "toast"))

    recipes.append(r("Sałatka grecka w wersji fit z tofu bio Vemondo", "Kolacja", 12,
        "1. Tofu bio pokrój w kostkę i zamarynuj w oliwie z oregano.\n2. Połącz z pokrojonym pomidorem, ogórkiem i liśćmi szpinaku baby.\n3. Czas: 12 minut.",
        [("Tofu naturalne bio Vemondo", 120), ("Pomidory malinowe Warzywniak Biedronki", 80), ("Ogórek zielony świeży Biedronka", 60), ("Szpinak baby świeży Ryneczek Lidla", 30), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "salad_bowl"))

    recipes.append(r("Twaróg chudy z pomidorem malinowym i oliwą z oliwek", "Kolacja", 8,
        "1. Twaróg chudy Pilos rozgnieć lekko widelcem z pokrojonym w kostkę pomidorem malinowym i oliwą.\n2. Czas: 8 minut.\n3. Podawaj z pieczywem żytnim.",
        [("Twaróg chudy Pilos", 140), ("Pomidory malinowe Warzywniak Biedronki", 100), ("Oliwa z oliwek Extra Virgin Luccese", 6), ("Chleb żytni 100% z pieca Lidla", 50)], "toast"))

    recipes.append(r("Zupa krem z pieczonych pomidorów z grzankami i bazylią", "Kolacja", 20,
        "1. Pomidory w puszce Freshona zagotuj z czosnkiem i oliwą, zblenduj na krem.\n2. Podawaj z chrupiącymi grzankami z chleba żytniego.\n3. Czas: 20 minut.",
        [("Pomidory krojone w puszce Freshona", 260), ("Chleb żytni 100% z pieca Lidla", 40), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Jajka w koszulce na szpinaku z pieczywem graham", "Kolacja", 15,
        "1. Szpinak baby podsmaż na oliwie przez 2 minuty.\n2. W garnku z wrzątkiem zrób wir i wbij jajko, gotuj 3 minuty na miękko.\n3. Ułóż na szpinaku i kromce chleba graham.\n4. Czas: 15 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Szpinak baby świeży Ryneczek Lidla", 50), ("Chleb graham krojony Biedronka", 50), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "omelet"))

    recipes.append(r("Wrap z twarogiem, wędzonym łososiem i ogórkiem", "Kolacja", 12,
        "1. Tortillę posmaruj chudym twarogiem roztartym z odrobiną jogurtu.\n2. Ułóż łososia wędzonego i słupki ogórka, zwiń w rulon.\n3. Czas: 12 minut.",
        [("Tortilla pełnoziarnista Biedronka", 60), ("Twaróg chudy klinek Delikate", 70), ("Łosoś wędzony na gorąco Marinero", 50), ("Ogórek zielony świeży Biedronka", 40)], "wrap"))

    recipes.append(r("Lekki serek wiejski z rzodkiewką i chlebem pszennym tostowym", "Kolacja", 8,
        "1. Serek wiejski lekki połącz z posiekanym ogórkiem i pieprzem.\n2. Zjedz z opieczonym chlebem pszennym tostowym Biedronka.\n3. Czas: 8 minut.",
        [("Serek wiejski lekki Delikate", 180), ("Chleb pszenny tostowy Biedronka", 50), ("Ogórek zielony świeży Biedronka", 50)], "toast"))

    # =========================================================================
    # 2. DIETA LEKKOSTRAWNA REGENERACYJNA (35 PRZEPISÓW)
    # =========================================================================
    recipes.append(r("Delikatna owsianka na wodzie z duszonym jabłkiem i cynamonem", "Śniadanie", 15,
        "1. Jabłko obierz ze skórki, pokrój w kostkę i podduś z wodą i cynamonem na miękko.\n2. Płatki owsiane ugotuj na wodzie na miękki kleik (7 minut).\n3. Połącz z jabłkiem i skyrem naturalnym.\n4. Czas: 15 minut.",
        [("Płatki owsiane górskie Crownfield", 50), ("Jabłka polskie Gala Biedronka", 120), ("Skyr naturalny Pilos", 80)], "apple"))

    recipes.append(r("Jajecznica na parze z chlebem pszennym i masłem", "Śniadanie", 12,
        "1. Jaja ściółkowe wbij do miski z łyżką wody i solą, roztrzep.\n2. Postaw miskę nad kąpielą wodną i mieszaj delikatnie szpatułką do aksamitnego ścięcia.\n3. Czas: 12 minut.\n4. Podawaj z chlebem pszennym.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Chleb pszenny tostowy Biedronka", 70), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "omelet"))

    recipes.append(r("Jaglanka na napoju migdałowym ze skyrem i miękkim bananem", "Śniadanie", 18,
        "1. Kaszę jaglaną przepłucz wrzątkiem, ugotuj w napoju migdałowym na miękko (12 minut).\n2. Wymieszaj ze skyrem i zgniecionym bananem.\n3. Czas: 18 minut.",
        [("Kasza jaglana Plony Natury", 50), ("Napój migdałowy bez cukru Vemondo", 150), ("Skyr naturalny Pilos", 100), ("Banan świeży Ryneczek Lidla", 80)], "oatmeal"))

    recipes.append(r("Kasza manna na gęsto z musem truskawkowym bez pestek", "Śniadanie", 12,
        "1. Kaszę mannę Crownfield ugotuj w napoju migdałowym na gęsty, delikatny krem.\n2. Truskawki podduś i przetrzyj przez sitko na gładki mus.\n3. Czas przygotowania: 12 minut.",
        [("Kasza manna Crownfield", 45), ("Napój migdałowy bez cukru Vemondo", 180), ("Truskawki mrożone Mroźna Kraina", 70), ("Skyr naturalny Pilos", 50)], "dessert"))

    recipes.append(r("Płatki ryżowe na wodzie ze skyrem waniliowym i pieczonym jabłkiem", "Śniadanie", 15,
        "1. Płatki ryżowe Plony Natury ugotuj na miękki kleik ryżowy (6 minut).\n2. Jabłko upiecz bez skórki i utłucz na gładki mus.\n3. Połącz ze skyrem waniliowym. Czas: 15 minut.",
        [("Płatki ryżowe Plony Natury", 45), ("Jabłka polskie Gala Biedronka", 100), ("Skyr waniliowy Pilos", 100)], "oatmeal"))

    recipes.append(r("Omlet biszkoptowy na parze z musem z przetartych malin", "Śniadanie", 15,
        "1. Oddziel białko od żółtka, ubij pianę na sztywno, połącz delikatnie z żółtkiem.\n2. Wylej na parownicę i paruj 8 minut do ścięcia.\n3. Podawaj z przetartym musem malinowym. Czas: 15 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Maliny mrożone Mroźna Kraina", 60), ("Chleb pszenny tostowy Biedronka", 40)], "omelet"))

    recipes.append(r("Delikatny twarożek ze słodkim bananem na pieczywie pszennym", "Śniadanie", 8,
        "1. Twaróg chudy Delikate rozgnieć z dojrzałym bananem i jogurtem naturalnym na aksamitną pastę.\n2. Posmaruj kromki chleba pszennego. Czas: 8 minut.",
        [("Twaróg chudy klinek Delikate", 100), ("Banan świeży Ryneczek Lidla", 70), ("Jogurt naturalny gęsty Mleczna Dolina", 30), ("Chleb pszenny tostowy Biedronka", 60)], "toast"))

    recipes.append(r("Jajko na miękko z chlebem pszennym i chudą szynką z kurczaka", "Śniadanie", 10,
        "1. Jajko ściółkowe gotuj dokładnie 4.5 minuty we wrzątku.\n2. Podawaj z miękkim chlebem pszennym tostowym i szynką z kurczaka Pikok Pure.\n3. Czas: 10 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Chleb pszenny tostowy Biedronka", 60), ("Szynka z piersi kurczaka Pikok Pure", 40), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "omelet"))

    # Drugie śniadania lekkostrawne (7)
    recipes.append(r("Pieczone jabłko z cynamonem i chudym twarożkiem", "Drugie śniadanie", 20,
        "1. Jabłko obierz, wydrąż gniazdo nasienne i upiecz w 180°C przez 15 minut.\n2. Twaróg utrzyj z jogurtem i napełnij upieczone jabłko.\n3. Czas: 20 minut.",
        [("Jabłka polskie Gala Biedronka", 150), ("Twaróg chudy klinek Delikate", 100), ("Jogurt naturalny gęsty Mleczna Dolina", 30)], "apple"))

    recipes.append(r("Lekki serek wiejski z dojrzałym bananem i waflami ryżowymi", "Drugie śniadanie", 8,
        "1. Serek wiejski lekki wymieszaj z plasterkami dojrzałego banana.\n2. Podawaj z chrupkimi waflami ryżowymi Good Food.\n3. Czas: 8 minut.",
        [("Serek wiejski lekki Delikate", 180), ("Banan świeży Ryneczek Lidla", 80), ("Wafle ryżowe naturalne Good Food", 30)], "dessert"))

    recipes.append(r("Aksamitny mus bananowo-jagodowy z kleikiem ryżowym", "Drugie śniadanie", 10,
        "1. Dojrzałego banana i borówki amerykańskie zblenduj na gładko.\n2. Połącz z delikatnymi waflami ryżowymi.\n3. Czas przygotowania: 10 minut.",
        [("Banan świeży Ryneczek Lidla", 100), ("Borówki amerykańskie Ryneczek Lidla", 60), ("Wafle ryżowe naturalne Good Food", 25)], "smoothie"))

    recipes.append(r("Jogurt naturalny gęsty z puree z pieczonej dyni", "Drugie śniadanie", 12,
        "1. Dynię ugotuj lub upiecz na miękko i rozgnieć na gładkie puree.\n2. Wymieszaj z jogurtem naturalnym Mleczna Dolina i szczyptą cynamonu.\n3. Czas: 12 minut.",
        [("Dynia świeża krojona Biedronka", 120), ("Jogurt naturalny gęsty Mleczna Dolina", 140)], "dessert"))

    recipes.append(r("Serek wiejski K-Classic z musem ze słodkiego jabłka", "Drugie śniadanie", 10,
        "1. Jabłko Gala obierz i zetrzyj na najdrobniejszych oczkach tarki.\n2. Połącz z serkiem wiejskim lekkim K-Classic.\n3. Czas przygotowania: 10 minut.",
        [("Serek wiejski lekki K-Classic", 180), ("Jabłka polskie Gala Biedronka", 100)], "dessert"))

    recipes.append(r("Kromka chleba pszennego z pastą z białek jaj i twarogu", "Drugie śniadanie", 12,
        "1. Jajko ugotuj na twardo, wyjmij żółtko, a białko zblenduj z twarogiem chudym i łyżką jogurtu.\n2. Posmaruj pieczywo pszenne.\n3. Czas: 12 minut.",
        [("Jaja ściółkowe Moja Kurka", 60), ("Twaróg chudy Pilos", 70), ("Jogurt naturalny gęsty Mleczna Dolina", 20), ("Chleb pszenny tostowy Biedronka", 50)], "toast"))

    recipes.append(r("Kisiel z przetartych malin ze skyrem waniliowym", "Drugie śniadanie", 10,
        "1. Maliny przetrzyj przez sitko, zagotuj ze 100 ml wody i zagęść mąką ziemniaczaną.\n2. Podawaj z łyżką skyru waniliowego.\n3. Czas: 10 minut.",
        [("Maliny mrożone Mroźna Kraina", 80), ("Skyr waniliowy Pilos", 80)], "dessert"))

    # Obiady lekkostrawne (10)
    recipes.append(r("Filet z indyka gotowany na parze z purée ziemniaczano-marchewkowym", "Obiad", 25,
        "1. Polędwiczki z indyka paruj przez 15 minut z majerankiem.\n2. Ziemniaki i marchewkę ugotuj i utłucz z oliwą na puszyste puree.\n3. Czas: 25 minut.",
        [("Polędwiczki z indyka Rzeźnik", 180), ("Ziemniaki polskie Biedronka", 180), ("Marchew świeża myta Ryneczek Lidla", 100), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "puree"))

    recipes.append(r("Dorsz duszony w koperku z ryżem białym i gotowaną cukinią", "Obiad", 20,
        "1. Filet z dorsza duś pod przykryciem w 50 ml wody z koperkiem przez 10 minut.\n2. Ryż biały ugotuj na miękko.\n3. Cukinię obraną ze skórki ugotuj na parze.\n4. Czas: 20 minut.",
        [("Dorsz atlantycki świeży Lidl", 190), ("Ryż biały długoziarnisty Plony Natury", 60), ("Cukinia świeża Biedronka", 120), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "fish"))

    recipes.append(r("Pulpety z indyka w łagodnym sosie z gotowanym ryżem", "Obiad", 30,
        "1. Mięso mielone z indyka połącz z białkiem jaja, uformuj pulpeciki i gotuj w lekkim wywarze 15 minut.\n2. Podawaj z gotowanym ryżem i marchewką.\n3. Czas: 30 minut.",
        [("Mięso mielone z piersi indyka Biedronka", 160), ("Ryż biały długoziarnisty Plony Natury", 60), ("Marchew świeża myta Ryneczek Lidla", 100), ("Jaja ściółkowe Moja Kurka", 60)], "chicken"))

    recipes.append(r("Gotowany filet z kurczaka z kaszą jaglaną i duszonym jabłkiem", "Obiad", 25,
        "1. Pierś z kurczaka ugotuj w wodzie z solą (15 minut).\n2. Kaszę jaglaną ugotuj na sypko.\n3. Jabłko obierz i podduś na miękko z kropelką oliwy.\n4. Czas: 25 minut.",
        [("Pierś z kurczaka świeża Biedronka", 170), ("Kasza jaglana Plony Natury", 60), ("Jabłka polskie Gala Biedronka", 120), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    recipes.append(r("Dorsz na parze z puree z dyni i białym ryżem", "Obiad", 25,
        "1. Dorsz atlantycki paruj przez 12 minut.\n2. Dynię ugotuj do miękkości i utłucz na gładkie puree z oliwą.\n3. Podawaj z miękkim ryżem białym.\n4. Czas: 25 minut.",
        [("Dorsz atlantycki świeży filet Carrefour", 180), ("Dynia świeża krojona Biedronka", 160), ("Ryż biały długoziarnisty Plony Natury", 60), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 6)], "fish"))

    recipes.append(r("Gotowane polędwiczki z indyka z purée z batatów", "Obiad", 25,
        "1. Polędwiczki z indyka ugotuj na parze (14 minut).\n2. Bataty obierz, ugotuj na miękko i ugnieć na aksamitne puree z oliwą.\n3. Czas: 25 minut.",
        [("Polędwiczki z indyka K-Purland", 180), ("Bataty słodkie ziemniaki Ryneczek Lidla", 180), ("Oliwa z oliwek Extra Virgin K-Bio", 6)], "puree"))

    recipes.append(r("Pieczony filet z łososia w pergaminie z gotowaną marchewką i ryżem", "Obiad", 25,
        "1. Łososia zawiń w pergamin i piecz 15 minut w 180°C bez tłuszczu.\n2. Marchewkę ugotuj w plasterkach, ryż ugotuj na miękko.\n3. Czas: 25 minut.",
        [("Łosoś atlantycki świeży filet Kaufland", 140), ("Marchew świeża myta Ryneczek Lidla", 140), ("Ryż biały długoziarnisty Plony Natury", 60)], "salmon"))

    recipes.append(r("Delikatne risotto z gotowanym kurczakiem i cukinią bez skórki", "Obiad", 25,
        "1. Ugotuj ryż biały na miękko.\n2. Wymieszaj z pokrojoną ugotowaną piersią z kurczaka i duszoną cukinią bez skórki.\n3. Skrop oliwą z oliwek. Czas: 25 minut.",
        [("Pierś z kurczaka Rzeźnik", 160), ("Ryż biały długoziarnisty Plony Natury", 60), ("Cukinia świeża Biedronka", 120), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "chicken"))

    recipes.append(r("Aksamitny gulasz z indyka duszony z marchewką i ziemniakami", "Obiad", 30,
        "1. Indyk, marchew i ziemniaki pokrój w kostkę i duś pod przykryciem w wywarze warzywnym przez 20 minut.\n2. Dodaj oliwę z oliwek i szczyptę majeranku.\n3. Czas: 30 minut.",
        [("Polędwiczki z indyka Rzeźnik", 170), ("Ziemniaki polskie Biedronka", 160), ("Marchew świeża myta Ryneczek Lidla", 100), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "puree"))

    recipes.append(r("Dorsz zapiekany w folii z gotowanymi ziemniakami i koperkiem", "Obiad", 25,
        "1. Dorsz oprósz solą, zawiń w folię i piecz 15 minut w 180°C.\n2. Ziemniaki ugotuj w mundurkach, obierz i posyp koperkiem.\n3. Czas: 25 minut.",
        [("Dorsz atlantycki świeży Lidl", 190), ("Ziemniaki polskie Biedronka", 180), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "fish"))

    # Podwieczorki lekkostrawne (5)
    recipes.append(r("Mus z pieczonego jabłka z kleikiem z kaszy manny", "Przekąska / Podwieczorek", 15,
        "1. Jabłko upiecz bez skórki i zblenduj na mus.\n2. Połącz z delikatną kaszą manną ugotowaną na wodzie.\n3. Czas: 15 minut.",
        [("Jabłka polskie Gala Biedronka", 130), ("Kasza manna Crownfield", 35), ("Skyr naturalny Pilos", 40)], "apple"))

    recipes.append(r("Banan pieczony z cynamonem i jogurtem naturalnym", "Przekąska / Podwieczorek", 12,
        "1. Dojrzałego banana zapiecz w skórce w 180°C przez 10 minut.\n2. Wyjmij miąższ, oprósz cynamonem i polej jogurtem naturalnym Mleczna Dolina.\n3. Czas: 12 minut.",
        [("Banan świeży Ryneczek Lidla", 100), ("Jogurt naturalny gęsty Mleczna Dolina", 80)], "dessert"))

    recipes.append(r("Lekki kisiel żurawinowo-jagodowy z waflami ryżowymi", "Przekąska / Podwieczorek", 10,
        "1. Borówki rozgnieć, zagotuj w wodzie i zagęść mąką ziemniaczaną na delikatny kisiel.\n2. Podawaj z chrupkimi waflami ryżowymi Good Food. Czas: 10 minut.",
        [("Borówki amerykańskie Ryneczek Lidla", 80), ("Wafle ryżowe naturalne Good Food", 25)], "dessert"))

    recipes.append(r("Mus twarogowy ze słodkim bananem", "Przekąska / Podwieczorek", 6,
        "1. Twaróg chudy zblenduj z dojrzałym bananem na aksamitny krem.\n2. Czas przygotowania: 6 minut.",
        [("Twaróg chudy Pilos", 100), ("Banan świeży Ryneczek Lidla", 80)], "dessert"))

    recipes.append(r("Gotowane purée jabłkowo-marchewkowe z biszkoptem", "Przekąska / Podwieczorek", 15,
        "1. Jabłko i marchewkę ugotuj do miękkości i zblenduj na delikatną papkę.\n2. Zjedz z waflami ryżowymi.\n3. Czas: 15 minut.",
        [("Jabłka polskie Gala Biedronka", 100), ("Marchew świeża myta Ryneczek Lidla", 80), ("Wafle ryżowe naturalne Good Food", 20)], "apple"))

    # Kolacje lekkostrawne (5)
    recipes.append(r("Kanapki z szynką z indyka, jajkiem na miękko i pomidorem bez skórki", "Kolacja", 15,
        "1. Jajko ugotuj na miękko (4.5 minuty).\n2. Pomidora sparz i zdejmij skórkę.\n3. Ułóż na chlebie pszennym z szynką z indyka Kraina Wędlin.\n4. Czas: 15 minut.",
        [("Chleb pszenny tostowy Biedronka", 70), ("Szynka z piersi indyka Kraina Wędlin", 50), ("Jaja ściółkowe Moja Kurka", 60), ("Pomidory malinowe Warzywniak Biedronki", 70), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "toast"))

    recipes.append(r("Zupa krem z marchewki i ziemniaka z grzankami pszennymi", "Kolacja", 25,
        "1. Marchew i ziemniaki ugotuj w osolonej wodzie i zblenduj na krem z oliwą.\n2. Podawaj z podsuszonym chlebem pszennym tostowym.\n3. Czas: 25 minut.",
        [("Marchew świeża myta Ryneczek Lidla", 180), ("Ziemniaki polskie Biedronka", 150), ("Chleb pszenny tostowy Biedronka", 40), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Delikatna pasta jajeczna z koperkiem na chlebie pszennym", "Kolacja", 12,
        "1. Jaja ściółkowe ugotuj na twardo, rozgnieć z jogurtem naturalnym i koperkiem.\n2. Posmaruj kromki pieczywa pszennego tostowego. Czas: 12 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Jogurt naturalny gęsty Mleczna Dolina", 30), ("Chleb pszenny tostowy Biedronka", 60)], "toast"))

    recipes.append(r("Aksamitny krem z dyni i cukinii bez skórki", "Kolacja", 20,
        "1. Dynię i cukinię ugotuj w 300 ml wody do miękkości (12 minut).\n2. Zmiksuj blenderem z oliwą z oliwek na aksamitną zupę krem.\n3. Czas: 20 minut.",
        [("Dynia świeża krojona Biedronka", 160), ("Cukinia świeża Biedronka", 120), ("Oliwa z oliwek Extra Virgin Luccese", 8), ("Chleb pszenny tostowy Biedronka", 40)], "soup"))

    recipes.append(r("Twarożek z gotowaną marchewką i pieczywem pszennym", "Kolacja", 12,
        "1. Marchewkę ugotuj na miękko, zetrzyj na tarce i połącz z chudym twarogiem Delikate i jogurtem.\n2. Podawaj z chlebem pszennym tostowym. Czas: 12 minut.",
        [("Twaróg chudy klinek Delikate", 120), ("Marchew świeża myta Ryneczek Lidla", 80), ("Jogurt naturalny gęsty Mleczna Dolina", 30), ("Chleb pszenny tostowy Biedronka", 60)], "toast"))

    # =========================================================================
    # 3. DIETA PŁYNNA I PÓŁPŁYNNA (30 PRZEPISÓW)
    # =========================================================================
    recipes.append(r("Aksamitny koktajl bananowo-jagodowy na kefirze ze skyrem", "Śniadanie", 8,
        "1. Do blendera wlej kefir naturalny i skyr Pilos.\n2. Dodaj banana i borówki.\n3. Miksuj przez 90 sekund na jednolitą emulsję.\n4. Czas: 8 minut.",
        [("Kefir naturalny Mleczna Dolina", 200), ("Skyr naturalny Pilos", 100), ("Banan świeży Ryneczek Lidla", 100), ("Borówki amerykańskie Ryneczek Lidla", 50)], "smoothie"))

    recipes.append(r("Płynny kleik jaglano-migdałowy z musem malinowym", "Śniadanie", 15,
        "1. Kaszę jaglaną ugotuj do pełnego rozklejenia (12 minut).\n2. Zblenduj z napojem migdałowym na gładki płyn.\n3. Wmieszaj przetarte przez sitko maliny.\n4. Czas: 15 minut.",
        [("Kasza jaglana Plony Natury", 40), ("Napój migdałowy bez cukru Vemondo", 220), ("Maliny mrożone Mroźna Kraina", 60), ("Skyr naturalny Pilos", 60)], "smoothie"))

    recipes.append(r("Płynny koktajl twarogowo-bananowy na napoju migdałowym", "Śniadanie", 6,
        "1. Twaróg chudy, dojrzałego banana i napój migdałowy Vemondo miksuj przez 60 sekund na idealnie gładki napój.\n2. Czas: 6 minut.",
        [("Twaróg chudy Pilos", 100), ("Banan świeży Ryneczek Lidla", 90), ("Napój migdałowy bez cukru Vemondo", 200)], "smoothie"))

    recipes.append(r("Aksamitna emulsja owsiano-kefirowa z borówkami", "Śniadanie", 10,
        "1. Płatki owsiane zalej wrzątkiem na 5 minut, a następnie zblenduj z kefirem i borówkami na rzadki koktajl.\n2. Czas: 10 minut.",
        [("Płatki owsiane górskie Crownfield", 35), ("Kefir naturalny Mleczna Dolina", 220), ("Borówki amerykańskie Ryneczek Lidla", 60)], "smoothie"))

    recipes.append(r("Płynna kaszka manna na napoju migdałowym ze skyrem waniliowym", "Śniadanie", 10,
        "1. Kaszę mannę ugotuj w dużej ilości napoju migdałowego na rzadko (5 minut).\n2. Zmiksuj ze skyrem waniliowym K-Classic na aksamitny płyn.\n3. Czas: 10 minut.",
        [("Kasza manna K-Classic", 35), ("Napój migdałowy bez cukru Vemondo", 220), ("Skyr waniliowy K-Classic", 100)], "smoothie"))

    recipes.append(r("Gładki shake proteinowy z tofu bio i truskawkami", "Śniadanie", 6,
        "1. Tofu bio Vemondo, truskawki mrożone i napój migdałowy zblenduj na jednolitą, kremową emulsję bez grudek.\n2. Czas: 6 minut.",
        [("Tofu naturalne bio Vemondo", 100), ("Truskawki mrożone Mroźna Kraina", 100), ("Napój migdałowy bez cukru Vemondo", 200)], "smoothie"))

    recipes.append(r("Płynny kleik ryżowy z pieczonym jabłkiem i cynamonem", "Śniadanie", 15,
        "1. Ryż biały rozgotuj w wodzie na papkę.\n2. Zblenduj gorący ryż z upieczonym jabłkiem i odrobiną wody na płynny kleik.\n3. Czas: 15 minut.",
        [("Ryż biały długoziarnisty Plony Natury", 40), ("Jabłka polskie Gala Biedronka", 120), ("Skyr naturalny Pilos", 60)], "apple"))

    # Drugie śniadania płynne (6)
    recipes.append(r("Kremowy koktajl białkowo-owocowy ze skyrem waniliowym", "Drugie śniadanie", 6,
        "1. Skyr waniliowy połącz z napojem migdałowym i miksuj blenderem 60 sekund.\n2. Dodaj banana i zblenduj na rzadki shake.\n3. Czas: 6 minut.",
        [("Skyr waniliowy Pilos", 150), ("Napój migdałowy bez cukru Vemondo", 150), ("Banan świeży Ryneczek Lidla", 80)], "smoothie"))

    recipes.append(r("Aksamitny mus z pieczonego jabłka z jogurtem naturalnym", "Drugie śniadanie", 15,
        "1. Jabłko upiecz na miękko bez skórki.\n2. Zblenduj z jogurtem naturalnym Mleczna Dolina na rzadki mus.\n3. Czas: 15 minut.",
        [("Jabłka polskie Gala Biedronka", 150), ("Jogurt naturalny gęsty Mleczna Dolina", 120)], "apple"))

    recipes.append(r("Płynny jogurt pitny z musem borówkowym", "Drugie śniadanie", 5,
        "1. Jogurt naturalny połącz z napojem migdałowym (1:1).\n2. Zblenduj z borówkami na jednolity płyn.\n3. Gotowe w 5 minut.",
        [("Jogurt naturalny gęsty Mleczna Dolina", 150), ("Napój migdałowy bez cukru Vemondo", 100), ("Borówki amerykańskie Ryneczek Lidla", 60)], "smoothie"))

    recipes.append(r("Shake malinowo-kefirowy z przetartym musem", "Drugie śniadanie", 6,
        "1. Przetarte przez sitko maliny połącz z kefirem i zblenduj na gładki shake.\n2. Czas: 6 minut.",
        [("Kefir naturalny Mleczna Dolina", 220), ("Maliny mrożone Mroźna Kraina", 80), ("Skyr naturalny Pilos", 50)], "smoothie"))

    recipes.append(r("Aksamitny mus bananowy z jogurtem Carrefour", "Drugie śniadanie", 5,
        "1. Dojrzałego banana zblenduj z jogurtem naturalnym na gładką, płynną konsystencję.\n2. Czas: 5 minut.",
        [("Banan świeży Ryneczek Lidla", 100), ("Jogurt naturalny gęsty Mleczna Dolina", 140)], "smoothie"))

    recipes.append(r("Płynny shake truskawkowy ze skyrem Carrefour", "Drugie śniadanie", 6,
        "1. Skyr waniliowy Carrefour Classic zblenduj z truskawkami i napojem migdałowym.\n2. Czas: 6 minut.",
        [("Skyr waniliowy Carrefour Classic", 140), ("Truskawki mrożone Mroźna Kraina", 100), ("Napój migdałowy bez cukru Vemondo", 120)], "smoothie"))

    # Obiady płynne (9)
    recipes.append(r("Krem dyniowo-marchewkowy z blendowaną piersią z kurczaka", "Obiad", 25,
        "1. Pierś z kurczaka, dynię i marchew ugotuj w wodzie z solą (15 minut).\n2. Dodaj oliwę i miksuj w blenderze kielichowym na gładką zupę krem bez grudek.\n3. Czas: 25 minut.",
        [("Pierś z kurczaka świeża Biedronka", 150), ("Dynia świeża krojona Biedronka", 150), ("Marchew świeża myta Ryneczek Lidla", 100), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "soup"))

    recipes.append(r("Aksamitny krem z białych warzyw z gotowanym dorszem", "Obiad", 25,
        "1. Ziemniaki ugotuj w wywarze (15 minut), dodając dorsza na ostatnie 7 minut.\n2. Dodaj oliwę i miksuj przez 2 minuty na aksamitny krem.\n3. Czas: 25 minut.",
        [("Dorsz atlantycki świeży Lidl", 180), ("Ziemniaki polskie Biedronka", 180), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "soup"))

    recipes.append(r("Krem pomidorowo-warzywny z blendowanym tofu bio", "Obiad", 20,
        "1. Pomidory w puszce zagotuj z ugotowaną marchewką i pokrojonym tofu.\n2. Zblenduj na najwyższych obrotach na gładką zupę krem.\n3. Czas: 20 minut.",
        [("Pomidory krojone w puszce Freshona", 250), ("Tofu naturalne bio Vemondo", 130), ("Marchew świeża myta Ryneczek Lidla", 80), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "soup"))

    recipes.append(r("Aksamitny krem z ziemniaków i dyni z blendowanym indykiem", "Obiad", 25,
        "1. Indyk, ziemniaki i dynię ugotuj do miękkości (15 minut).\n2. Zblenduj na idealnie płynną, sycącą zupę krem z dodatkiem oliwy.\n3. Czas: 25 minut.",
        [("Polędwiczki z indyka Rzeźnik", 150), ("Ziemniaki polskie Biedronka", 150), ("Dynia świeża krojona Biedronka", 120), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "soup"))

    recipes.append(r("Zupa krem z pieczonych batatów i marchewki z łososiem", "Obiad", 30,
        "1. Bataty i marchewkę ugotuj na miękko.\n2. Łososia ugotuj na parze, zdejmij skórę i zblenduj razem z warzywami i oliwą na krem.\n3. Czas: 30 minut.",
        [("Łosoś atlantycki filet świeży Lidl", 130), ("Bataty słodkie ziemniaki Ryneczek Lidla", 160), ("Marchew świeża myta Ryneczek Lidla", 100), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Aksamitna zupa krem z cukinii i ryżu z dorszem atlantyckim", "Obiad", 25,
        "1. Cukinię, ryż biały i dorsza ugotuj w delikatnym wywarze (14 minut).\n2. Zmiksuj na idealnie gładką, lekką emulsję.\n3. Czas: 25 minut.",
        [("Dorsz atlantycki filet świeży Kaufland", 180), ("Cukinia świeża Biedronka", 150), ("Ryż biały długoziarnisty Plony Natury", 30), ("Oliwa z oliwek Extra Virgin K-Bio", 6)], "soup"))

    recipes.append(r("Płynny krem jarzynowy z blendowaną piersią kurczaka Carrefour", "Obiad", 25,
        "1. Pierś z kurczaka Carrefour, marchew i ziemniaki ugotuj w wodzie z solą (16 minut).\n2. Zmiksuj na gładki krem z dodatkiem oliwy.\n3. Czas: 25 minut.",
        [("Pierś z kurczaka Carrefour Jakość z Natury", 150), ("Marchew świeża myta Ryneczek Lidla", 120), ("Ziemniaki polskie Biedronka", 140), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 8)], "soup"))

    recipes.append(r("Aksamitny krem z dyni i marchwi z mielonym indykiem", "Obiad", 25,
        "1. Dynię, marchew i mięso mielone z indyka ugotuj w bulionie (15 minut).\n2. Zblenduj na gładki, pożywny krem obiadowy. Czas: 25 minut.",
        [("Mięso mielone z piersi indyka Biedronka", 150), ("Dynia świeża krojona Biedronka", 160), ("Marchew świeża myta Ryneczek Lidla", 100), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Delikatna zupa krem z pomidorów i batatów z dorszem", "Obiad", 25,
        "1. Bataty ugotuj, dodaj pomidory w puszce i dorsza (gotuj 8 minut).\n2. Zblenduj na krem z łyżką oliwy. Czas: 25 minut.",
        [("Dorsz atlantycki świeży Lidl", 170), ("Bataty słodkie ziemniaki Ryneczek Lidla", 140), ("Pomidory krojone w puszce Freshona", 160), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    # Podwieczorki płynne (4)
    recipes.append(r("Aksamitny mus borówkowy z napojem migdałowym", "Przekąska / Podwieczorek", 5,
        "1. Borówki zblenduj z napojem migdałowym Vemondo na gładki płyn.\n2. Czas: 5 minut.",
        [("Borówki amerykańskie Ryneczek Lidla", 100), ("Napój migdałowy bez cukru Vemondo", 150), ("Skyr naturalny Pilos", 50)], "smoothie"))

    recipes.append(r("Płynny mus z pieczonego jabłka i banana", "Przekąska / Podwieczorek", 12,
        "1. Jabłko upiecz, zblenduj z dojrzałym bananem i 50 ml wody na aksamitny płynny przecier.\n2. Czas: 12 minut.",
        [("Jabłka polskie Gala Biedronka", 120), ("Banan świeży Ryneczek Lidla", 80)], "apple"))

    recipes.append(r("Kremowy shake malinowo-waniliowy ze skyrem K-Classic", "Przekąska / Podwieczorek", 6,
        "1. Skyr waniliowy K-Classic zblenduj z przetartymi malinami i napojem migdałowym.\n2. Czas: 6 minut.",
        [("Skyr waniliowy K-Classic", 140), ("Maliny mrożone Mroźna Kraina", 80), ("Napój migdałowy bez cukru Vemondo", 100)], "smoothie"))

    recipes.append(r("Gładki kisiel owocowy z blendowanym bananem", "Przekąska / Podwieczorek", 10,
        "1. Truskawki przetrzyj, zagotuj z mąką ziemniaczaną i zmiksuj z dojrzałym bananem na rzadki kisiel.\n2. Czas: 10 minut.",
        [("Truskawki mrożone Mroźna Kraina", 80), ("Banan świeży Ryneczek Lidla", 80)], "smoothie"))

    # Kolacje płynne (4)
    recipes.append(r("Krem z cukinii i ziemniaka z blendowanym serkiem wiejskim", "Kolacja", 20,
        "1. Cukinię i ziemniaka obierz i ugotuj w małej ilości wody (12 minut).\n2. Dodaj serek wiejski i oliwę, zmiksuj na gładką zupę krem.\n3. Czas: 20 minut.",
        [("Cukinia świeża Biedronka", 150), ("Ziemniaki polskie Biedronka", 130), ("Serek wiejski lekki Delikate", 120), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Aksamitny shake twarogowo-kefirowy z cynamonem", "Kolacja", 6,
        "1. Twaróg chudy, kefir naturalny i banana miksuj w blenderze przez 90 sekund na gładki płyn.\n2. Czas: 6 minut.",
        [("Twaróg chudy Pilos", 100), ("Kefir naturalny Mleczna Dolina", 200), ("Banan świeży Ryneczek Lidla", 60)], "smoothie"))

    recipes.append(r("Zupa krem z marchwi i ziemniaka z blendowanym tofu", "Kolacja", 20,
        "1. Marchew i ziemniaki ugotuj na miękko, dodaj tofu bio Vemondo i oliwę.\n2. Zblenduj na gładki krem. Czas: 20 minut.",
        [("Marchew świeża myta Ryneczek Lidla", 160), ("Ziemniaki polskie Biedronka", 120), ("Tofu naturalne bio Vemondo", 90), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Aksamitny shake bananowo-twarogowy z cynamonem na noc", "Kolacja", 6,
        "1. Twaróg chudy Carrefour, dojrzały banan i napój migdałowy miksuj do idealnej gładkości.\n2. Czas: 6 minut.",
        [("Twaróg chudy Carrefour Classic", 120), ("Banan świeży Ryneczek Lidla", 70), ("Napój migdałowy bez cukru Vemondo", 180)], "smoothie"))

    # =========================================================================
    # 4. DIETA COLITIS ULCEROSA (WZJG) STANDARDOWA (35 PRZEPISÓW)
    # =========================================================================
    recipes.append(r("Kleik ryżowy z pieczonym jabłkiem bez skórki (Colitis Care)", "Śniadanie", 15,
        "1. Biały ryż rozgotuj na kleik (15 minut).\n2. Jabłko obierz, upiecz i utłucz na mus, połącz z kleikiem i skyrem.\n3. Czas: 15 minut.\n4. Działa kojąco na śluzówkę jelit.",
        [("Ryż biały długoziarnisty Plony Natury", 60), ("Jabłka polskie Gala Biedronka", 130), ("Skyr naturalny Pilos", 60)], "apple"))

    recipes.append(r("Jajka na miękko z bułką pszenną i chudą szynką z indyka", "Śniadanie", 10,
        "1. Jaja ściółkowe gotuj dokładnie 4.5 minuty (na miękko).\n2. Podawaj z chlebem pszennym tostowym i szynką z indyka Kraina Wędlin.\n3. Czas: 10 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Chleb pszenny tostowy Biedronka", 70), ("Szynka z piersi indyka Kraina Wędlin", 50), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "omelet"))

    recipes.append(r("Delikatna kaszka manna na napoju migdałowym z bananem", "Śniadanie", 12,
        "1. Kaszkę ugotuj w napoju migdałowym na gęsto.\n2. Dojrzałego banana rozgnieć na puree i wmieszaj do kaszki.\n3. Czas: 12 minut.",
        [("Kasza manna Crownfield", 45), ("Napój migdałowy bez cukru Vemondo", 200), ("Banan świeży Ryneczek Lidla", 100), ("Skyr naturalny Pilos", 50)], "oatmeal"))

    recipes.append(r("Płatki ryżowe na wodzie ze zgniecionym bananem i oliwą", "Śniadanie", 12,
        "1. Płatki ryżowe Crownfield ugotuj na miękki kleik (6 minut).\n2. Wmieszaj dojrzałego banana i kroplę oliwy z oliwek Extra Virgin.\n3. Czas: 12 minut.",
        [("Płatki ryżowe Crownfield", 45), ("Banan świeży Ryneczek Lidla", 90), ("Oliwa z oliwek Extra Virgin Luccese", 4), ("Skyr naturalny Pilos", 40)], "oatmeal"))

    recipes.append(r("Jajecznica parowa z chlebem pszennym tostowym (Colitis)", "Śniadanie", 12,
        "1. Jaja ściółkowe wymieszaj z odrobiną wody i solą, ścinaj delikatnie nad parą wodną.\n2. Podawaj z miękkim chlebem pszennym tostowym.\n3. Czas: 12 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Chleb pszenny tostowy Biedronka", 70), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "omelet"))

    recipes.append(r("Kaszka ryżowa z przetartymi borówkami i skyrem", "Śniadanie", 15,
        "1. Płatki ryżowe ugotuj na miękki kleik.\n2. Borówki przetrzyj przez sitko i połącz ze skyrem naturalnym Pilos.\n3. Czas: 15 minut.",
        [("Płatki ryżowe Plony Natury", 45), ("Borówki amerykańskie Ryneczek Lidla", 60), ("Skyr naturalny Pilos", 80)], "oatmeal"))

    recipes.append(r("Kanapka pszenna z pastą z jajka na twardo i kroplą oliwy", "Śniadanie", 12,
        "1. Jajko ugotuj na twardo, zetrzyj na drobnej tarce, wymieszaj z oliwą z oliwek i szczyptą soli.\n2. Posmaruj chleb pszenny tostowy. Czas: 12 minut.",
        [("Jaja ściółkowe Moja Kurka", 60), ("Chleb pszenny tostowy Biedronka", 60), ("Oliwa z oliwek Extra Virgin Luccese", 5)], "toast"))

    recipes.append(r("Delikatna owsianka przetarta z pieczonym jabłkiem (Colitis)", "Śniadanie", 15,
        "1. Płatki owsiane ugotuj na kleik i zblenduj na gładko.\n2. Dodaj upieczone, przetarte jabłko Gala.\n3. Czas: 15 minut.",
        [("Płatki owsiane górskie Crownfield", 40), ("Jabłka polskie Gala Biedronka", 120), ("Skyr naturalny Pilos", 50)], "apple"))

    # Drugie śniadania WZJG (7)
    recipes.append(r("Pieczone jabłko bez skórki z chudym twarożkiem (Colitis)", "Drugie śniadanie", 15,
        "1. Jabłko obierz ze skórki i piecz 12 minut w 180°C.\n2. Twaróg chudy przetrzyj przez sitko z jogurtem i połącz z jabłkiem.\n3. Czas: 15 minut.",
        [("Jabłka polskie Gala Biedronka", 140), ("Twaróg chudy klinek Delikate", 100), ("Jogurt naturalny gęsty Mleczna Dolina", 30)], "apple"))

    recipes.append(r("Serek wiejski z miękkim bananem i chrupkim waflem ryżowym", "Drugie śniadanie", 6,
        "1. Serek wiejski lekki wymieszaj ze zgniecionym dojrzałym bananem.\n2. Podawaj z naturalnym waflem ryżowym.\n3. Czas: 6 minut.",
        [("Serek wiejski lekki Delikate", 180), ("Banan świeży Ryneczek Lidla", 70), ("Wafle ryżowe naturalne Good Food", 20)], "dessert"))

    recipes.append(r("Mus bananowy z kleikiem ryżowym dla jelit", "Drugie śniadanie", 8,
        "1. Banana rozgnieć widelcem na gładko, wymieszaj z ugotowanym kleikiem ryżowym.\n2. Czas: 8 minut.",
        [("Banan świeży Ryneczek Lidla", 90), ("Płatki ryżowe Plony Natury", 30), ("Skyr naturalny Pilos", 50)], "smoothie"))

    recipes.append(r("Pieczona dynia z cynamonem i jogurtem naturalnym (Colitis)", "Drugie śniadanie", 15,
        "1. Dynię upiecz na miękko w 180°C, ugnieć na puree i wymieszaj z jogurtem naturalnym Mleczna Dolina.\n2. Czas: 15 minut.",
        [("Dynia świeża krojona Biedronka", 140), ("Jogurt naturalny gęsty Mleczna Dolina", 80)], "dessert"))

    recipes.append(r("Domowy kisiel jagodowy (działanie przeciwzapalne i ściągające)", "Drugie śniadanie", 10,
        "1. Przetarte borówki zagotuj w wodzie i zagęść mąką ziemniaczaną.\n2. Garbniki z jagód wykazują naturalne działanie ściągające.\n3. Czas: 10 minut.",
        [("Borówki amerykańskie Ryneczek Lidla", 80), ("Wafle ryżowe naturalne Good Food", 20), ("Skyr naturalny Pilos", 50)], "dessert"))

    recipes.append(r("Aksamitny serek wiejski K-Classic z puree z pieczonego jabłka", "Drugie śniadanie", 12,
        "1. Jabłko upiecz bez skórki, utłucz i wymieszaj z serkiem wiejskim K-Classic.\n2. Czas: 12 minut.",
        [("Serek wiejski lekki K-Classic", 180), ("Jabłka polskie Gala Biedronka", 100)], "dessert"))

    recipes.append(r("Kromka chleba pszennego z chudą szynką z indyka K-Purland", "Drugie śniadanie", 5,
        "1. Chleb pszenny tostowy obłóż szynką z piersi indyka K-Purland.\n2. Bezpieczna, lekka przekąska w 5 minut.",
        [("Chleb pszenny tostowy Biedronka", 60), ("Szynka z piersi indyka K-Purland", 60), ("Oliwa z oliwek Extra Virgin K-Bio", 3)], "toast"))

    # Obiady WZJG (10)
    recipes.append(r("Gotowany filet z kurczaka z białym ryżem i gotowaną marchewką", "Obiad", 25,
        "1. Pierś z kurczaka ugotuj na parze (15 minut).\n2. Ryż biały ugotuj na miękko.\n3. Marchewkę obierz i ugotuj do miękkości.\n4. Skrop przeciwzapalną oliwą z oliwek. Czas: 25 minut.",
        [("Pierś z kurczaka świeża Biedronka", 180), ("Ryż biały długoziarnisty Plony Natury", 65), ("Marchew świeża myta Ryneczek Lidla", 120), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "chicken"))

    recipes.append(r("Dorsz na parze z purée ziemniaczanym i duszoną dynią", "Obiad", 25,
        "1. Dorsz paruj 12 minut z solą.\n2. Ziemniaki i dynię ugotuj i utłucz z oliwą na aksamitne puree.\n3. Czas: 25 minut.",
        [("Dorsz atlantycki świeży Lidl", 190), ("Ziemniaki polskie Biedronka", 170), ("Dynia świeża krojona Biedronka", 100), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "puree"))

    recipes.append(r("Łosoś pieczony w pergaminie z purée z batatów i cukinią bez skórki", "Obiad", 25,
        "1. Łososia zawiń w pergamin i piecz 14 minut w 180°C.\n2. Bataty ugotuj i utłucz na puree.\n3. Cukinię bez skórki ugotuj na parze. Czas: 25 minut.",
        [("Łosoś atlantycki filet świeży Lidl", 140), ("Bataty słodkie ziemniaki Ryneczek Lidla", 160), ("Cukinia świeża Biedronka", 100), ("Oliwa z oliwek Extra Virgin Luccese", 5)], "salmon"))

    recipes.append(r("Pulpety z indyka gotowane w lekkim bulionie z puree ziemniaczanym", "Obiad", 30,
        "1. Z mielonego indyka uformuj małe pulpeciki i gotuj 14 minut w bulionie.\n2. Ziemniaki utłucz z oliwą z oliwek.\n3. Czas: 30 minut.",
        [("Mięso mielone z piersi indyka Biedronka", 170), ("Ziemniaki polskie Biedronka", 180), ("Oliwa z oliwek Extra Virgin Luccese", 6), ("Jaja ściółkowe Moja Kurka", 60)], "puree"))

    recipes.append(r("Gotowana polędwiczka z indyka z purée z dyni i białym ryżem", "Obiad", 25,
        "1. Polędwiczkę z indyka ugotuj na parze (14 minut).\n2. Dynię utłucz na puree z oliwą.\n3. Podawaj z gotowanym ryżem białym. Czas: 25 minut.",
        [("Polędwiczki z indyka Rzeźnik", 160), ("Dynia świeża krojona Biedronka", 140), ("Ryż biały długoziarnisty Plony Natury", 50), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    recipes.append(r("Dorsz duszony z marchewką i białym ryżem (Colitis)", "Obiad", 25,
        "1. Filet z dorsza i pokrojoną marchewkę duś w małej ilości wody z solą przez 15 minut.\n2. Podawaj z ugotowanym ryżem białym i oliwą.\n3. Czas: 25 minut.",
        [("Dorsz atlantycki świeży filet Carrefour", 180), ("Marchew świeża myta Ryneczek Lidla", 130), ("Ryż biały długoziarnisty Plony Natury", 60), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 6)], "fish"))

    recipes.append(r("Gotowany kurczak z purée z ziemniaków i gotowaną cukinią", "Obiad", 25,
        "1. Pierś z kurczaka ugotuj w osolonej wodzie.\n2. Ziemniaki rozgnieć na puree z łyżeczką oliwy.\n3. Cukinię bez skórki ugotuj na miękko. Czas: 25 minut.",
        [("Pierś z kurczaka K-Purland", 170), ("Ziemniaki polskie Biedronka", 180), ("Cukinia świeża Biedronka", 100), ("Oliwa z oliwek Extra Virgin K-Bio", 6)], "puree"))

    recipes.append(r("Łosoś na parze z kleikiem ryżowym i duszonym jabłkiem", "Obiad", 25,
        "1. Łososia paruj 12 minut.\n2. Ryż biały rozgotuj na kleik, jabłko obierz i uduś na mus.\n3. Bardzo łagodne połączenie dla śluzówki jelita. Czas: 25 minut.",
        [("Łosoś atlantycki świeży filet Kaufland", 140), ("Ryż biały długoziarnisty Plony Natury", 50), ("Jabłka polskie Gala Biedronka", 100), ("Oliwa z oliwek Extra Virgin K-Bio", 4)], "salmon"))

    recipes.append(r("Aksamitne risotto z indykiem i purée z dyni (Colitis)", "Obiad", 25,
        "1. Ryż biały ugotuj na miękko.\n2. Połącz z gotowanym indykiem i purée z dyni, skrop oliwą z oliwek.\n3. Czas: 25 minut.",
        [("Polędwiczki z indyka Carrefour", 160), ("Ryż biały długoziarnisty Plony Natury", 60), ("Dynia świeża krojona Biedronka", 140), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 6)], "chicken"))

    recipes.append(r("Dorsz pieczony w pergaminie z purée z batatów", "Obiad", 25,
        "1. Dorsz zawiń w pergamin i piecz 14 minut w 180°C.\n2. Bataty ugotuj i ugnieć z oliwą z oliwek.\n3. Czas: 25 minut.",
        [("Dorsz atlantycki świeży Lidl", 190), ("Bataty słodkie ziemniaki Ryneczek Lidla", 180), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "fish"))

    # Podwieczorki WZJG (5)
    recipes.append(r("Mus z pieczonego jabłka i banana dla jelit", "Przekąska / Podwieczorek", 12,
        "1. Upieczone jabłko bez skórki i dojrzałego banana zgnieć widelcem na gładką masę.\n2. Czas: 12 minut.",
        [("Jabłka polskie Gala Biedronka", 120), ("Banan świeży Ryneczek Lidla", 80)], "apple"))

    recipes.append(r("Kisiel z jagód z waflem ryżowym Good Food", "Przekąska / Podwieczorek", 10,
        "1. Przetarte borówki zagotuj z mąką ziemniaczaną na lekki kisiel.\n2. Zjedz z naturalnym waflem ryżowym. Czas: 10 minut.",
        [("Borówki amerykańskie Ryneczek Lidla", 80), ("Wafle ryżowe naturalne Good Food", 20)], "dessert"))

    recipes.append(r("Płynny shake ze skyru i pieczonego jabłka", "Przekąska / Podwieczorek", 10,
        "1. Upieczone jabłko zblenduj ze skyrem naturalnym Pilos i odrobiną wody.\n2. Czas: 10 minut.",
        [("Jabłka polskie Gala Biedronka", 120), ("Skyr naturalny Pilos", 80)], "apple"))

    recipes.append(r("Banan rozgnieciony z odrobiną jogurtu naturalnego", "Przekąska / Podwieczorek", 5,
        "1. Banana rozgnieć na papkę i wymieszaj z 2 łyżkami jogurtu naturalnego.\n2. Czas: 5 minut.",
        [("Banan świeży Ryneczek Lidla", 100), ("Jogurt naturalny gęsty Mleczna Dolina", 60)], "dessert"))

    recipes.append(r("Kaszka ryżowa z cynamonem i musem jabłkowym", "Przekąska / Podwieczorek", 12,
        "1. Płatki ryżowe ugotuj na miękko, wymieszaj z musem z obranego pieczonego jabłka.\n2. Czas: 12 minut.",
        [("Płatki ryżowe Plony Natury", 35), ("Jabłka polskie Gala Biedronka", 100)], "oatmeal"))

    # Kolacje WZJG (5)
    recipes.append(r("Aksamitna zupa krem z marchewki, ziemniaka i ryżu", "Kolacja", 25,
        "1. Marchew, ziemniaki i łyżkę ryżu ugotuj do miękkości (18 minut).\n2. Dodaj oliwę z oliwek i zblenduj na krem.\n3. Czas: 25 minut.",
        [("Marchew świeża myta Ryneczek Lidla", 160), ("Ziemniaki polskie Biedronka", 140), ("Ryż biały długoziarnisty Plony Natury", 30), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "soup"))

    recipes.append(r("Kanapka z pieczywa pszennego z gotowanym indykiem i oliwą", "Kolacja", 10,
        "1. Chleb pszenny tostowy skrop oliwą z oliwek i obłóż plasterkami gotowanego indyka.\n2. Czas: 10 minut.",
        [("Chleb pszenny tostowy Biedronka", 60), ("Polędwiczki z indyka Rzeźnik", 60), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "toast"))

    recipes.append(r("Zupa krem z cukinii bez skórki i ziemniaka (Colitis)", "Kolacja", 20,
        "1. Cukinię i ziemniaka ugotuj i zblenduj na delikatny krem z oliwą z oliwek.\n2. Czas: 20 minut.",
        [("Cukinia świeża Biedronka", 160), ("Ziemniaki polskie Biedronka", 120), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Jajko na miękko z chlebem pszennym i purée marchewkowym", "Kolacja", 15,
        "1. Jajko ściółkowe ugotuj na miękko (4.5 minuty).\n2. Marchewkę ugotuj i utłucz na puree.\n3. Zjedz z chlebem pszennym tostowym. Czas: 15 minut.",
        [("Jaja ściółkowe Moja Kurka", 60), ("Marchew świeża myta Ryneczek Lidla", 120), ("Chleb pszenny tostowy Biedronka", 50), ("Oliwa z oliwek Extra Virgin Luccese", 4)], "omelet"))

    recipes.append(r("Krem z pieczonej dyni z białym ryżem", "Kolacja", 22,
        "1. Dynię ugotuj i zblenduj z oliwą na krem.\n2. Podawaj z 2 łyżkami ugotowanego białego ryżu. Czas: 22 minuty.",
        [("Dynia świeża krojona Biedronka", 180), ("Ryż biały długoziarnisty Plony Natury", 40), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    # =========================================================================
    # 5. SPECJALISTYCZNA DIETA WZJG Z NABIAŁEM BEZ LAKTOZY (50 PRZEPISÓW)
    # Produkty: Mleko bez laktozy, Twaróg chudy bez laktozy, Serek wiejski bez laktozy,
    # Jogurt naturalny bez laktozy, Kefir bez laktozy (Lidl, Biedronka, Kaufland, Carrefour)
    # =========================================================================

    # --- Śniadania WZJG bez laktozy (12) ---
    recipes.append(r("Kaszka manna na mleku bez laktozy z pieczonym jabłkiem (WZJG)", "Śniadanie", 15,
        "1. Kaszę mannę Crownfield ugotuj w mleku bez laktozy Pilos na gęsty, delikatny budyń (5 minut).\n2. Jabłko obierz ze skórki, upiecz na miękko i rozgnieć na aksamitny mus.\n3. Połącz kaszkę z jabłkiem i szczyptą cynamonu.\n4. Czas: 15 minut.\n5. Posiłek nie obciąża jelit i dostarcza bezpiecznego wapnia bez laktozy.",
        [("Kasza manna Crownfield", 45), ("Mleko 1.5% bez laktozy Pilos", 200), ("Jabłka polskie Gala Biedronka", 120)], "oatmeal"))

    recipes.append(r("Puszysty omlet parowy z twarogiem bez laktozy i koperkiem (WZJG)", "Śniadanie", 15,
        "1. Jaja ściółkowe roztrzep widelcem z łyżką mleka bez laktozy i szczyptą soli.\n2. Twaróg bez laktozy Delikate rozgnieć widelcem ze świeżym koperkiem.\n3. Wlej masę jajeczną na naczynie do gotowania na parze, na wierzch wyłóż twarożek.\n4. Paruj pod pokrywką przez 8 minut do puszystości.\n5. Czas: 15 minut. Zjedz z chlebem pszennym tostowym.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Twaróg chudy bez laktozy Delikate", 80), ("Mleko 1.5% bez laktozy Mleczna Dolina", 30), ("Chleb pszenny tostowy Biedronka", 60)], "omelet"))

    recipes.append(r("Placuszki twarogowe bez laktozy z musem malinowym (WZJG)", "Śniadanie", 20,
        "1. Twaróg bez laktozy Pilos utrzyj z jajkiem i mąką z płatków ryżowych.\n2. Formuj małe placuszki i smaż na suchej patelni teflonowej na małym ogniu pod przykryciem po 3 minuty z każdej strony.\n3. Maliny przetrzyj przez drobne sitko, usuwając drażniące pestki.\n4. Czas: 20 minut.\n5. Wyjątkowo smaczne i łagodne śniadanie.",
        [("Twaróg chudy bez laktozy Pilos", 130), ("Jaja ściółkowe Moja Kurka", 60), ("Płatki ryżowe Crownfield", 40), ("Maliny mrożone Mroźna Kraina", 70)], "pancakes"))

    recipes.append(r("Płatki ryżowe na mleku bez laktozy z puree z banana (WZJG)", "Śniadanie", 12,
        "1. Płatki ryżowe Plony Natury ugotuj w mleku bez laktozy Mleczna Dolina na miękki kleik (6 minut).\n2. Dojrzałego banana rozgnieć widelcem na gładkie puree i wmieszaj do płatków.\n3. Czas wykonania: 12 minut.\n4. Łatwostrawna energia bez fermentacji laktozowej.",
        [("Płatki ryżowe Plony Natury", 45), ("Mleko 1.5% bez laktozy Mleczna Dolina", 200), ("Banan świeży Ryneczek Lidla", 90)], "oatmeal"))

    recipes.append(r("Jajecznica na parze z chlebem pszennym i serkiem wiejskim bez laktozy (WZJG)", "Śniadanie", 12,
        "1. Jaja ściółkowe wymieszaj z solą i ścinaj powoli w misce nad kąpielą parową.\n2. Na talerzu podaj ze świeżym serkiem wiejskim bez laktozy K-Classic i pieczywem pszennym tostowym.\n3. Czas przygotowania to 12 minut.",
        [("Jaja ściółkowe klasa M K-Classic", 120), ("Serek wiejski bez laktozy K-Classic", 100), ("Chleb pszenny tostowy Biedronka", 60), ("Oliwa z oliwek Extra Virgin K-Bio", 3)], "omelet"))

    recipes.append(r("Delikatna owsianka na mleku bez laktozy z duszonym jabłkiem (WZJG)", "Śniadanie", 15,
        "1. Płatki owsiane górskie zalej mlekiem bez laktozy Carrefour Classic i gotuj 7 minut na małym ogniu.\n2. Jabłko obierz ze skórki i zduś z odrobiną wody i cynamonu.\n3. Połącz owsiankę z ciepłym jabłkiem.\n4. Czas: 15 minut.",
        [("Płatki owsiane górskie Carrefour Bio", 45), ("Mleko 1.5% bez laktozy Carrefour Classic", 200), ("Jabłka polskie Gala Biedronka", 110)], "apple"))

    recipes.append(r("Aksamitny twarożek bez laktozy z miodem i bananem na pieczywie pszennym (WZJG)", "Śniadanie", 8,
        "1. Twaróg chudy bez laktozy Delikate utrzyj z jogurtem bez laktozy i bananem na aksamitną pastę.\n2. Posmaruj kromki chleba pszennego tostowego.\n3. Błyskawiczne i bezpieczne śniadanie w 8 minut.",
        [("Twaróg chudy bez laktozy Delikate", 110), ("Jogurt naturalny bez laktozy Mleczna Dolina", 30), ("Banan świeży Ryneczek Lidla", 70), ("Chleb pszenny tostowy Biedronka", 60)], "toast"))

    recipes.append(r("Ryżanka na mleku bez laktozy z przetartym musem z borówek (WZJG)", "Śniadanie", 15,
        "1. Biały ryż ugotuj w mleku bez laktozy Pilos na miękko (12 minut).\n2. Borówki przetrzyj przez sitko na gładki mus.\n3. Polej ciepły ryż jagodowym sosem.\n4. Czas: 15 minut.",
        [("Ryż biały długoziarnisty Plony Natury", 50), ("Mleko 1.5% bez laktozy Pilos", 180), ("Borówki amerykańskie Ryneczek Lidla", 70)], "oatmeal"))

    recipes.append(r("Budyń z kaszy manny na mleku bez laktozy ze słodką dynią (WZJG)", "Śniadanie", 15,
        "1. Kaszę manną K-Classic ugotuj w mleku bez laktozy na gęsto.\n2. Dynię ugotuj i utłucz na gładkie puree, wmieszaj do budyniu.\n3. Czas: 15 minut. Znakomite źródło beta-karotenu.",
        [("Kasza manna K-Classic", 40), ("Mleko 1.5% bez laktozy K-Classic", 180), ("Dynia świeża krojona Biedronka", 100)], "oatmeal"))

    recipes.append(r("Tosty pszenne z pastą z jajka i serka wiejskiego bez laktozy (WZJG)", "Śniadanie", 12,
        "1. Jajko ugotowane na twardo rozgnieć z serkiem wiejskim bez laktozy Delikate i szczyptą soli.\n2. Posmaruj kromki pieczywa pszennego tostowego.\n3. Czas: 12 minut.",
        [("Jaja ściółkowe Moja Kurka", 60), ("Serek wiejski bez laktozy Delikate", 100), ("Chleb pszenny tostowy Biedronka", 60)], "toast"))

    recipes.append(r("Płatki ryżowe na mleku bez laktozy z pieczonym jabłkiem i cynamonem (WZJG)", "Śniadanie", 15,
        "1. Płatki ryżowe Carrefour Bio ugotuj w mleku bez laktozy Carrefour Classic (5 minut).\n2. Dodaj pieczone jabłko bez skórki rozgniecione na mus.\n3. Czas przygotowania: 15 minut.",
        [("Płatki ryżowe Carrefour Bio", 45), ("Mleko 1.5% bez laktozy Carrefour Classic", 180), ("Jabłka polskie Gala Biedronka", 100)], "oatmeal"))

    recipes.append(r("Omlet biszkoptowy na parze z twarogiem bez laktozy i bananem (WZJG)", "Śniadanie", 16,
        "1. Białko ubij na sztywno, wymieszaj delikatnie z żółtkiem i twarogiem bez laktozy Pilos.\n2. Paruj w foremce pod przykryciem przez 8 minut.\n3. Podawaj z miękkimi plastrami banana. Czas: 16 minut.",
        [("Jaja ściółkowe Moja Kurka", 120), ("Twaróg chudy bez laktozy Pilos", 60), ("Banan świeży Ryneczek Lidla", 70)], "omelet"))

    # --- Drugie śniadania WZJG bez laktozy (10) ---
    recipes.append(r("Serek wiejski bez laktozy z purée z pieczonego jabłka (WZJG)", "Drugie śniadanie", 10,
        "1. Jabłko Gala obierz ze skórki i upiecz w 180°C przez 10 minut na miękko.\n2. Rozgnieć na mus i połącz z chłodnym serkiem wiejskim bez laktozy Pilos.\n3. Czas: 10 minut. Bezpieczna porcja białka i pektyn.",
        [("Serek wiejski lekki bez laktozy Pilos", 180), ("Jabłka polskie Gala Biedronka", 100)], "dessert"))

    recipes.append(r("Shake bananowo-kefirowy bez laktozy z waflami ryżowymi (WZJG)", "Drugie śniadanie", 6,
        "1. Kefir bez laktozy Mleczna Dolina zblenduj z dojrzałym bananem na puszysty shake.\n2. Spożywaj z chrupkimi waflami ryżowymi Good Food.\n3. Czas: 6 minut.",
        [("Kefir bez laktozy Mleczna Dolina", 220), ("Banan świeży Ryneczek Lidla", 80), ("Wafle ryżowe naturalne Good Food", 20)], "smoothie"))

    recipes.append(r("Jogurt naturalny bez laktozy z przecierem z borówek (WZJG)", "Drugie śniadanie", 8,
        "1. Borówki przetrzyj przez sitko, by usunąć skórki.\n2. Wymieszaj z gęstym jogurtem naturalnym bez laktozy Pilos.\n3. Czas: 8 minut.",
        [("Jogurt naturalny bez laktozy Pilos", 160), ("Borówki amerykańskie Ryneczek Lidla", 70)], "dessert"))

    recipes.append(r("Mus twarogowy bez laktozy ze słodkim bananem (WZJG)", "Drugie śniadanie", 6,
        "1. Twaróg bez laktozy Delikate zblenduj z dojrzałym bananem i 2 łyżkami mleka bez laktozy na gładki serek homogenizowany.\n2. Czas: 6 minut.",
        [("Twaróg chudy bez laktozy Delikate", 120), ("Banan świeży Ryneczek Lidla", 80), ("Mleko 1.5% bez laktozy Mleczna Dolina", 30)], "dessert"))

    recipes.append(r("Płynny kefir bez laktozy z kleikiem ryżowym (WZJG)", "Drugie śniadanie", 8,
        "1. Kleik z płatków ryżowych zblenduj z chłodnym kefirem bez laktozy K-Classic na aksamitny napój probiotyczny.\n2. Czas: 8 minut.",
        [("Kefir bez laktozy K-Classic", 200), ("Płatki ryżowe K-Classic", 25)], "smoothie"))

    recipes.append(r("Serek wiejski bez laktozy z gotowaną dynią i cynamonem (WZJG)", "Drugie śniadanie", 10,
        "1. Dynię ugotuj do miękkości i utłucz na puree.\n2. Wymieszaj z serkiem wiejskim bez laktozy Carrefour Classic.\n3. Czas: 10 minut.",
        [("Serek wiejski bez laktozy Carrefour Classic", 180), ("Dynia świeża krojona Biedronka", 90)], "dessert"))

    recipes.append(r("Delikatna pasta z tuńczyka i twarogu bez laktozy (WZJG)", "Drugie śniadanie", 10,
        "1. Tuńczyka odsącz z zalewy, rozgnieć z twarogiem bez laktozy Delikate i łyżką jogurtu bez laktozy.\n2. Posmaruj pieczywo pszenne tostowe. Czas: 10 minut.",
        [("Twaróg chudy bez laktozy Delikate", 90), ("Tuńczyk w sosie własnym Marinero", 50), ("Jogurt naturalny bez laktozy Mleczna Dolina", 25), ("Chleb pszenny tostowy Biedronka", 50)], "toast"))

    recipes.append(r("Koktajl odżywczy z kefirem bez laktozy i pieczonym jabłkiem (WZJG)", "Drugie śniadanie", 12,
        "1. Upieczone jabłko bez skórki zblenduj z kefirem bez laktozy Pilos i szczyptą cynamonu.\n2. Płynna osłona jelit gotowa w 12 minut.",
        [("Kefir bez laktozy Pilos", 220), ("Jabłka polskie Gala Biedronka", 110)], "smoothie"))

    recipes.append(r("Jogurt bez laktozy K-Classic z musem bananowym i waflem ryżowym (WZJG)", "Drugie śniadanie", 6,
        "1. Jogurt naturalny bez laktozy K-Classic połącz z rozgniecionym bananem.\n2. Podawaj z waflem ryżowym Good Food. Czas: 6 minut.",
        [("Jogurt naturalny bez laktozy K-Classic", 150), ("Banan świeży Ryneczek Lidla", 80), ("Wafle ryżowe naturalne Good Food", 20)], "dessert"))

    recipes.append(r("Kanapka pszenna z aksamitnym twarożkiem bez laktozy i szynką z indyka (WZJG)", "Drugie śniadanie", 8,
        "1. Chleb pszenny posmaruj twarogiem bez laktozy utartym z jogurtem bez laktozy.\n2. Nałóż plasterki szynki z indyka Kraina Wędlin. Czas: 8 minut.",
        [("Chleb pszenny tostowy Biedronka", 60), ("Twaróg chudy bez laktozy Delikate", 70), ("Jogurt naturalny bez laktozy Mleczna Dolina", 20), ("Szynka z piersi indyka Kraina Wędlin", 40)], "toast"))

    # --- Obiady WZJG bez laktozy (15) ---
    recipes.append(r("Dorsz atlantycki na parze z puree ziemniaczanym na mleku bez laktozy (WZJG)", "Obiad", 25,
        "1. Dorsz paruj przez 12 minut oprószony solą.\n2. Ziemniaki ugotuj, utłucz z ciepłym mlekiem bez laktozy Pilos i oliwą na aksamitne, kremowe puree.\n3. Czas: 25 minut.\n4. Znakomite, łagodne źródło pełnowartościowego białka i potasu.",
        [("Dorsz atlantycki świeży Lidl", 190), ("Ziemniaki polskie Biedronka", 180), ("Mleko 1.5% bez laktozy Pilos", 50), ("Oliwa z oliwek Extra Virgin Luccese", 8)], "puree"))

    recipes.append(r("Gotowany filet z indyka w sosie jogurtowym bez laktozy z koperkiem (WZJG)", "Obiad", 25,
        "1. Polędwiczki z indyka ugotuj na parze (14 minut) i pokrój w medaliony.\n2. Jogurt naturalny bez laktozy Mleczna Dolina połącz z posiekanym koperkiem i solą, lekko podgrzej (nie gotuj).\n3. Polej indyka sosem, podawaj z białym ryżem. Czas: 25 minut.",
        [("Polędwiczki z indyka Rzeźnik", 180), ("Jogurt naturalny bez laktozy Mleczna Dolina", 80), ("Ryż biały długoziarnisty Plony Natury", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    recipes.append(r("Pulpety z indyka z purée z dyni na mleku bez laktozy (WZJG)", "Obiad", 30,
        "1. Z mielonego indyka uformuj kulki i ugotuj w wywarze warzywnym (14 minut).\n2. Dynię i ziemniaki ugotuj, utłucz z mlekiem bez laktozy Delikate na puszyste puree.\n3. Czas: 30 minut.",
        [("Mięso mielone z piersi indyka Biedronka", 170), ("Dynia świeża krojona Biedronka", 140), ("Ziemniaki polskie Biedronka", 120), ("Mleko 1.5% bez laktozy Mleczna Dolina", 40), ("Jaja ściółkowe Moja Kurka", 60)], "puree"))

    recipes.append(r("Pierś z kurczaka duszona w łagodnym sosie kefirowym bez laktozy z ryżem (WZJG)", "Obiad", 25,
        "1. Pierś z kurczaka pokrój w kostkę, duś w odrobinie wody (12 minut).\n2. Dodaj kefir bez laktozy Pilos i oliwę, dopraw koperkiem i solą.\n3. Podawaj z gotowanym ryżem białym. Czas: 25 minut.",
        [("Pierś z kurczaka świeża Biedronka", 170), ("Kefir bez laktozy Pilos", 80), ("Ryż biały długoziarnisty Plony Natury", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    recipes.append(r("Pieczony łosoś z sosem jogurtowym bez laktozy i ziemniakami (WZJG)", "Obiad", 25,
        "1. Łososia zawiń w pergamin i upiecz w 180°C przez 14 minut.\n2. Ziemniaki ugotuj na miękko.\n3. Przygotuj sos z jogurtu naturalnego bez laktozy K-Classic i koperku.\n4. Czas: 25 minut. Silne działanie przeciwzapalne Omega-3.",
        [("Łosoś atlantycki świeży filet Kaufland", 140), ("Ziemniaki polskie Biedronka", 170), ("Jogurt naturalny bez laktozy K-Classic", 70), ("Oliwa z oliwek Extra Virgin K-Bio", 4)], "salmon"))

    recipes.append(r("Delikatna zapiekanka z gotowanego kurczaka, ziemniaków i jogurtu bez laktozy (WZJG)", "Obiad", 30,
        "1. Ugotowane ziemniaki i pierś z kurczaka pokrój w plastry i ułóż w naczyniu żaroodpornym.\n2. Zalej jogurtem bez laktozy wymieszanym z jajkiem i oliwą.\n3. Zapiecz w 180°C przez 15 minut. Czas: 30 minut.",
        [("Pierś z kurczaka Rzeźnik", 150), ("Ziemniaki polskie Biedronka", 160), ("Jogurt naturalny bez laktozy Pilos", 80), ("Jaja ściółkowe Moja Kurka", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "puree"))

    recipes.append(r("Zupa krem z pieczonej dyni zabielana jogurtem bez laktozy (WZJG)", "Obiad", 25,
        "1. Dynię i marchew ugotuj w osolonej wodzie (15 minut).\n2. Zblenduj z oliwą z oliwek, a na koniec wmieszaj gęsty jogurt bez laktozy Delikate.\n3. Podawaj z ugotowanym białym ryżem. Czas: 25 minut.",
        [("Dynia świeża krojona Biedronka", 180), ("Marchew świeża myta Ryneczek Lidla", 100), ("Jogurt naturalny bez laktozy Mleczna Dolina", 60), ("Ryż biały długoziarnisty Plony Natury", 40), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Pulpety z dorsza na parze z purée z batatów na mleku bez laktozy (WZJG)", "Obiad", 28,
        "1. Dorsz zmiel lub drobno posiekaj, połącz z białkiem jaja i ugotuj na parze jako małe kulki (10 minut).\n2. Bataty ugotuj, utłucz z mlekiem bez laktozy K-Classic i oliwą.\n3. Czas: 28 minut.",
        [("Dorsz atlantycki filet świeży Kaufland", 180), ("Bataty słodkie ziemniaki Ryneczek Lidla", 160), ("Mleko 1.5% bez laktozy K-Classic", 40), ("Oliwa z oliwek Extra Virgin K-Bio", 6), ("Jaja ściółkowe klasa M K-Classic", 60)], "puree"))

    recipes.append(r("Krem z cukinii i ziemniaka zabielany mlekiem bez laktozy z indykiem (WZJG)", "Obiad", 25,
        "1. Cukinię bez skórki, ziemniaki i polędwiczkę z indyka ugotuj razem w wywarze (15 minut).\n2. Dodaj mleko bez laktozy Carrefour Classic i oliwę, zblenduj na aksamitny krem.\n3. Czas: 25 minut.",
        [("Polędwiczki z indyka Carrefour", 150), ("Cukinia świeża Biedronka", 140), ("Ziemniaki polskie Biedronka", 120), ("Mleko 1.5% bez laktozy Carrefour Classic", 60), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 6)], "soup"))

    recipes.append(r("Risotto z białego ryżu z indykiem i serkiem wiejskim bez laktozy (WZJG)", "Obiad", 25,
        "1. Ryż biały ugotuj na miękko.\n2. Wymieszaj z gotowanym indykiem i serkiem wiejskim bez laktozy Pilos, uzyskując kremową, aksamitną strukturę bez masła.\n3. Czas: 25 minut.",
        [("Polędwiczki z indyka Rzeźnik", 160), ("Ryż biały długoziarnisty Plony Natury", 60), ("Serek wiejski lekki bez laktozy Pilos", 100), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    recipes.append(r("Dorsz duszony w koperku z purée ziemniaczano-marchewkowym na mleku bez laktozy (WZJG)", "Obiad", 25,
        "1. Dorsz duś w koperku z wodą przez 10 minut.\n2. Ziemniaki i marchew ugotuj i utłucz z ciepłym mlekiem bez laktozy Delikate.\n3. Czas przygotowania: 25 minut.",
        [("Dorsz atlantycki świeży Lidl", 190), ("Ziemniaki polskie Biedronka", 160), ("Marchew świeża myta Ryneczek Lidla", 100), ("Mleko 1.5% bez laktozy Mleczna Dolina", 40), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "puree"))

    recipes.append(r("Gotowany indyk z purée z dyni zabielanym mlekiem bez laktozy (WZJG)", "Obiad", 25,
        "1. Polędwiczki z indyka ugotuj na parze (14 minut).\n2. Dynię ugotuj i utłucz z mlekiem bez laktozy K-Classic na miękki krem.\n3. Podawaj z gotowanym białym ryżem. Czas: 25 minut.",
        [("Polędwiczki z indyka K-Purland", 170), ("Dynia świeża krojona Biedronka", 160), ("Mleko 1.5% bez laktozy K-Classic", 40), ("Ryż biały długoziarnisty Plony Natury", 50), ("Oliwa z oliwek Extra Virgin K-Bio", 6)], "chicken"))

    recipes.append(r("Pieczony filet z kurczaka w łagodnej marynacie jogurtowej bez laktozy (WZJG)", "Obiad", 30,
        "1. Pierś z kurczaka zanurz w jogurcie bez laktozy Carrefour z odrobiną soli i zawiń w rękaw do pieczenia.\n2. Piecz w 180°C przez 20 minut na wyjątkową miękkość.\n3. Podawaj z purée ziemniaczanym. Czas: 30 minut.",
        [("Pierś z kurczaka Carrefour Jakość z Natury", 170), ("Jogurt naturalny bez laktozy Carrefour Classic", 60), ("Ziemniaki polskie Biedronka", 180), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 6)], "chicken"))

    recipes.append(r("Aksamitny krem z białych warzyw zabielany jogurtem bez laktozy z dorszem (WZJG)", "Obiad", 25,
        "1. Ziemniaki i cukinię ugotuj z dorszem, zblenduj na krem.\n2. Wmieszaj jogurt naturalny bez laktozy Delikate i oliwę z oliwek.\n3. Czas: 25 minut.",
        [("Dorsz atlantycki świeży filet Carrefour", 180), ("Ziemniaki polskie Biedronka", 160), ("Cukinia świeża Biedronka", 100), ("Jogurt naturalny bez laktozy Mleczna Dolina", 60), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 6)], "soup"))

    recipes.append(r("Pulpety drobiowe w delikatnym sosie pomidorowo-jogurtowym bez laktozy (WZJG)", "Obiad", 28,
        "1. Pulpeciki z indyka ugotuj w lekkim wywarze z przetartymi pomidorami (15 minut).\n2. Zdejmij z ognia i zahartuj jogurtem bez laktozy Pilos.\n3. Podawaj z ryżem białym. Czas: 28 minut.",
        [("Mięso mielone z piersi indyka Biedronka", 160), ("Pomidory krojone w puszce Freshona", 120), ("Jogurt naturalny bez laktozy Pilos", 60), ("Ryż biały długoziarnisty Plony Natury", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "chicken"))

    # --- Podwieczorki WZJG bez laktozy (6) ---
    recipes.append(r("Domowy budyń waniliowy na mleku bez laktozy z musem malinowym (WZJG)", "Przekąska / Podwieczorek", 12,
        "1. Kaszę mannę Crownfield ugotuj w mleku bez laktozy Pilos z odrobiną wanilii na gęsty budyń.\n2. Maliny przetrzyj przez sitko i polej przestudzony budyń.\n3. Czas: 12 minut.",
        [("Kasza manna Crownfield", 40), ("Mleko 1.5% bez laktozy Pilos", 200), ("Maliny mrożone Mroźna Kraina", 60)], "dessert"))

    recipes.append(r("Pieczone jabłko nadziewane chudym twarogiem bez laktozy i cynamonem (WZJG)", "Przekąska / Podwieczorek", 16,
        "1. Jabłko obierz, wydrąż gniazdo nasienne.\n2. Wypełnij twarogiem bez laktozy Delikate utartym z cynamonem i zapiecz w 180°C przez 12 minut.\n3. Czas: 16 minut.",
        [("Jabłka polskie Gala Biedronka", 140), ("Twaróg chudy bez laktozy Delikate", 80)], "apple"))

    recipes.append(r("Schłodzony kefir bez laktozy z cynamonem i chrupkim waflem ryżowym (WZJG)", "Przekąska / Podwieczorek", 5,
        "1. Do szklanki wlej schłodzony kefir bez laktozy K-Classic, posyp mielonym cynamonem.\n2. Spożywaj z waflem ryżowym Good Food. Czas: 5 minut.",
        [("Kefir bez laktozy K-Classic", 220), ("Wafle ryżowe naturalne Good Food", 20)], "smoothie"))

    recipes.append(r("Domowy kisiel jagodowy podany z łyżką gęstego jogurtu bez laktozy (WZJG)", "Przekąska / Podwieczorek", 10,
        "1. Przetarte borówki zagotuj z mąką ziemniaczaną na lekki kisiel.\n2. Na wierzch nałóż łyżkę jogurtu bez laktozy Pilos.\n3. Czas: 10 minut.",
        [("Borówki amerykańskie Ryneczek Lidla", 80), ("Jogurt naturalny bez laktozy Pilos", 50), ("Wafle ryżowe naturalne Good Food", 20)], "dessert"))

    recipes.append(r("Aksamitna pianka twarogowa bez laktozy z puree bananowym (WZJG)", "Przekąska / Podwieczorek", 8,
        "1. Twaróg bez laktozy Carrefour Classic zblenduj z mlekiem bez laktozy i bananem na puszystą piankę.\n2. Czas: 8 minut.",
        [("Twaróg chudy bez laktozy Carrefour Classic", 100), ("Mleko 1.5% bez laktozy Carrefour Classic", 40), ("Banan świeży Ryneczek Lidla", 70)], "dessert"))

    recipes.append(r("Płynny shake truskawkowy na kefirze bez laktozy Mleczna Dolina (WZJG)", "Przekąska / Podwieczorek", 6,
        "1. Truskawki przetrzyj przez sitko i zblenduj z kefirem bez laktozy Mleczna Dolina.\n2. Czas: 6 minut.",
        [("Kefir bez laktozy Mleczna Dolina", 220), ("Truskawki mrożone Mroźna Kraina", 80)], "smoothie"))

    # --- Kolacje WZJG bez laktozy (7) ---
    recipes.append(r("Kremowa zupa z dyni i ziemniaków na mleku bez laktozy z grzankami pszennymi (WZJG)", "Kolacja", 22,
        "1. Dynię i ziemniaki ugotuj w małej ilości wody (14 minut).\n2. Dodaj mleko bez laktozy Pilos i oliwę, zblenduj na aksamitny krem.\n3. Podawaj z grzankami z chleba pszennego tostowego. Czas: 22 minuty.",
        [("Dynia świeża krojona Biedronka", 180), ("Ziemniaki polskie Biedronka", 120), ("Mleko 1.5% bez laktozy Pilos", 80), ("Chleb pszenny tostowy Biedronka", 40), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Twarożek bez laktozy z gotowaną marchewką i chlebem pszennym (WZJG)", "Kolacja", 12,
        "1. Marchewkę ugotuj na miękko, zetrzyj drobno i połącz z twarogiem bez laktozy Delikate i łyżką jogurtu bez laktozy.\n2. Posmaruj pieczywo pszenne tostowe. Czas: 12 minut.",
        [("Twaróg chudy bez laktozy Delikate", 120), ("Jogurt naturalny bez laktozy Mleczna Dolina", 30), ("Marchew świeża myta Ryneczek Lidla", 70), ("Chleb pszenny tostowy Biedronka", 60)], "toast"))

    recipes.append(r("Jajko na miękko z serkiem wiejskim bez laktozy i pieczywem tostowym (WZJG)", "Kolacja", 10,
        "1. Jajko ściółkowe ugotuj na miękko (4.5 minuty).\n2. Na talerzu ułóż z serkiem wiejskim bez laktozy K-Classic i pieczywem pszennym tostowym.\n3. Czas: 10 minut.",
        [("Jaja ściółkowe klasa M K-Classic", 60), ("Serek wiejski bez laktozy K-Classic", 120), ("Chleb pszenny tostowy Biedronka", 60), ("Oliwa z oliwek Extra Virgin K-Bio", 3)], "toast"))

    recipes.append(r("Aksamitny krem z cukinii bez skórki zabielany jogurtem bez laktozy (WZJG)", "Kolacja", 20,
        "1. Cukinię i ziemniaka ugotuj do miękkości (12 minut) i zblenduj na krem.\n2. Wmieszaj jogurt naturalny bez laktozy Pilos i oliwę z oliwek.\n3. Czas: 20 minut.",
        [("Cukinia świeża Biedronka", 160), ("Ziemniaki polskie Biedronka", 100), ("Jogurt naturalny bez laktozy Pilos", 60), ("Oliwa z oliwek Extra Virgin Luccese", 6)], "soup"))

    recipes.append(r("Lekka pasta z gotowanego indyka i twarogu bez laktozy na chlebie pszennym (WZJG)", "Kolacja", 12,
        "1. Gotowanego indyka zblenduj z twarogiem bez laktozy Delikate, łyżką mleka bez laktozy i szczyptą soli.\n2. Posmaruj pieczywo pszenne tostowe. Czas: 12 minut.",
        [("Polędwiczki z indyka Rzeźnik", 70), ("Twaróg chudy bez laktozy Delikate", 70), ("Mleko 1.5% bez laktozy Mleczna Dolina", 20), ("Chleb pszenny tostowy Biedronka", 60)], "toast"))

    recipes.append(r("Zupa krem jarzynowa z lanymi kluseczkami i mlekiem bez laktozy (WZJG)", "Kolacja", 22,
        "1. Marchew i ziemniaki ugotuj i zblenduj z mlekiem bez laktozy Carrefour Classic.\n2. Do gorącej zupy wlej roztrzepane jajko, tworząc delikatne lane kluseczki.\n3. Czas: 22 minuty.",
        [("Marchew świeża myta Ryneczek Lidla", 140), ("Ziemniaki polskie Biedronka", 120), ("Mleko 1.5% bez laktozy Carrefour Classic", 80), ("Jaja ściółkowe Carrefour Classic", 60), ("Oliwa z oliwek Extra Virgin Carrefour Classic", 5)], "soup"))

    recipes.append(r("Delikatny mus z pieczonego jabłka i twarogu bez laktozy z chrupkim pieczywem (WZJG)", "Kolacja", 12,
        "1. Upieczone jabłko bez skórki rozgnieć z twarogiem bez laktozy Pilos i cynamonem na gładki mus.\n2. Zjedz z waflami ryżowymi Good Food. Czas: 12 minut.",
        [("Jabłka polskie Gala Biedronka", 120), ("Twaróg chudy bez laktozy Pilos", 100), ("Wafle ryżowe naturalne Good Food", 25)], "toast"))

    print(f"Total verified recipes built: {len(recipes)}")

    # Map image_type to FOOD_IMAGES
    target_py_path = os.path.join(os.path.dirname(__file__), "fixtures_data.py")
    with open(target_py_path, "w", encoding="utf-8") as f:
        f.write('''"""
Pre-populated catalog of real discount store products (Lidl, Biedronka, Kaufland, Carrefour)
and authentic fitness and clinical recipes (Lekkostrawna, Płynna, Colitis ulcerosa,
oraz specjalistyczna Dieta WZJG z nabiałem bez laktozy) with consistent preparation times,
verified macros, and real discount ingredients.
"""

PRODUCTS_CATALOG = ''' + json.dumps(products, ensure_ascii=False, indent=4) + '''

FOOD_IMAGES = {
    "oatmeal": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80",
    "omelet": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    "shakshuka": "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=600&q=80",
    "pancakes": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
    "salad_bowl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "toast": "https://images.unsplash.com/photo-1484723091739-00822c712077?auto=format&fit=crop&w=600&q=80",
    "smoothie": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80",
    "wrap": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
    "chia": "https://images.unsplash.com/photo-1584278860047-22db9ff82bed?auto=format&fit=crop&w=600&q=80",
    "chicken": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
    "pasta": "https://images.unsplash.com/photo-1621996346565-e3d5d6281724?auto=format&fit=crop&w=600&q=80",
    "fish": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    "salmon": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
    "curry": "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80",
    "soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
    "dessert": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
    "puree": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80",
    "apple": "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=80",
}

def generate_fitness_recipes():
    """Generates 250 authentic, diverse culinary and clinical recipes."""
    raw_recipes = ''' + json.dumps(recipes, ensure_ascii=False, indent=4) + '''
    
    formatted = []
    for r in raw_recipes:
        formatted.append({
            "title": r["title"],
            "category": r["category"],
            "prep_time": r["prep_time"],
            "instructions": r["instructions"],
            "ingredients": [tuple(ing) for ing in r["ingredients"]],
            "image_url": FOOD_IMAGES.get(r["image_type"], FOOD_IMAGES["oatmeal"])
        })
    return formatted
''')
    print("SUCCESS: fixtures_data.py written with exactly", len(recipes), "recipes!")

if __name__ == '__main__':
    generate_fixtures_file()
