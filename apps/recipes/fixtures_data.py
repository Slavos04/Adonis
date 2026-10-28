"""
Pre-populated catalog of real discount store products (Lidl, Biedronka, Kaufland, Carrefour)
and authentic fitness and clinical recipes (Lekkostrawna, Płynna, Colitis ulcerosa,
oraz specjalistyczna Dieta WZJG z nabiałem bez laktozy) with consistent preparation times,
verified macros, and real discount ingredients.
"""

PRODUCTS_CATALOG = [
    {
        "name": "Skyr naturalny Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000001",
        "calories": 65,
        "protein": 11.8,
        "fat": 0.2,
        "carbs": 4.1,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Skyr waniliowy Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000002",
        "calories": 85,
        "protein": 9.8,
        "fat": 0.2,
        "carbs": 11.0,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Twaróg chudy Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000003",
        "calories": 86,
        "protein": 18.5,
        "fat": 0.5,
        "carbs": 3.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Serek wiejski lekki Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000004",
        "calories": 81,
        "protein": 11.0,
        "fat": 2.5,
        "carbs": 2.4,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Pierś z kurczaka Rzeźnik",
        "store": "Lidl",
        "brand": "Rzeźnik",
        "barcode": "20000005",
        "calories": 99,
        "protein": 21.5,
        "fat": 1.3,
        "carbs": 0.0,
        "unit": "g",
        "category": "Mięso"
    },
    {
        "name": "Polędwiczki z indyka Rzeźnik",
        "store": "Lidl",
        "brand": "Rzeźnik",
        "barcode": "20000006",
        "calories": 102,
        "protein": 22.0,
        "fat": 1.4,
        "carbs": 0.0,
        "unit": "g",
        "category": "Mięso"
    },
    {
        "name": "Dorsz atlantycki świeży Lidl",
        "store": "Lidl",
        "brand": "Targ Rybny Lidl",
        "barcode": "20000007",
        "calories": 78,
        "protein": 17.5,
        "fat": 0.7,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Łosoś atlantycki filet świeży Lidl",
        "store": "Lidl",
        "brand": "Targ Rybny Lidl",
        "barcode": "20000008",
        "calories": 208,
        "protein": 20.0,
        "fat": 13.0,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Tofu naturalne bio Vemondo",
        "store": "Lidl",
        "brand": "Vemondo",
        "barcode": "20000009",
        "calories": 125,
        "protein": 13.0,
        "fat": 7.5,
        "carbs": 1.8,
        "unit": "g",
        "category": "Roślinne"
    },
    {
        "name": "Napój migdałowy bez cukru Vemondo",
        "store": "Lidl",
        "brand": "Vemondo",
        "barcode": "20000010",
        "calories": 13,
        "protein": 0.4,
        "fat": 1.1,
        "carbs": 0.2,
        "unit": "ml",
        "category": "Roślinne"
    },
    {
        "name": "Płatki owsiane górskie Crownfield",
        "store": "Lidl",
        "brand": "Crownfield",
        "barcode": "20000011",
        "calories": 366,
        "protein": 13.5,
        "fat": 7.0,
        "carbs": 58.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Makaron pełnoziarnisty penne Combino",
        "store": "Lidl",
        "brand": "Combino",
        "barcode": "20000012",
        "calories": 348,
        "protein": 12.5,
        "fat": 2.0,
        "carbs": 65.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Ryż basmati Golden Sun",
        "store": "Lidl",
        "brand": "Golden Sun",
        "barcode": "20000013",
        "calories": 355,
        "protein": 8.0,
        "fat": 0.8,
        "carbs": 78.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Kasza gryczana prażona Kuchnia Lidla",
        "store": "Lidl",
        "brand": "Kuchnia Lidla",
        "barcode": "20000014",
        "calories": 343,
        "protein": 12.6,
        "fat": 3.1,
        "carbs": 63.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Masło orzechowe 100% orzechów Alesto",
        "store": "Lidl",
        "brand": "Alesto",
        "barcode": "20000015",
        "calories": 596,
        "protein": 26.0,
        "fat": 46.0,
        "carbs": 12.0,
        "unit": "g",
        "category": "Orzechy"
    },
    {
        "name": "Oliwa z oliwek Extra Virgin Luccese",
        "store": "Lidl",
        "brand": "Luccese",
        "barcode": "20000016",
        "calories": 824,
        "protein": 0.0,
        "fat": 91.6,
        "carbs": 0.0,
        "unit": "g",
        "category": "Tłuszcze"
    },
    {
        "name": "Pomidory krojone w puszce Freshona",
        "store": "Lidl",
        "brand": "Freshona",
        "barcode": "20000017",
        "calories": 22,
        "protein": 1.1,
        "fat": 0.2,
        "carbs": 3.5,
        "unit": "g",
        "category": "Przetwory"
    },
    {
        "name": "Warzywa na patelnię klasyczne Freshona",
        "store": "Lidl",
        "brand": "Freshona",
        "barcode": "20000018",
        "calories": 42,
        "protein": 2.2,
        "fat": 0.3,
        "carbs": 6.5,
        "unit": "g",
        "category": "Mrożonki"
    },
    {
        "name": "Szpinak baby świeży Ryneczek Lidla",
        "store": "Lidl",
        "brand": "Ryneczek Lidla",
        "barcode": "20000019",
        "calories": 23,
        "protein": 2.9,
        "fat": 0.4,
        "carbs": 0.8,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Borówki amerykańskie Ryneczek Lidla",
        "store": "Lidl",
        "brand": "Ryneczek Lidla",
        "barcode": "20000020",
        "calories": 57,
        "protein": 0.7,
        "fat": 0.3,
        "carbs": 12.2,
        "unit": "g",
        "category": "Owoce"
    },
    {
        "name": "Banan świeży Ryneczek Lidla",
        "store": "Lidl",
        "brand": "Ryneczek Lidla",
        "barcode": "20000021",
        "calories": 89,
        "protein": 1.1,
        "fat": 0.3,
        "carbs": 22.0,
        "unit": "g",
        "category": "Owoce"
    },
    {
        "name": "Chleb żytni 100% z pieca Lidla",
        "store": "Lidl",
        "brand": "Piekarnia Lidla",
        "barcode": "20000022",
        "calories": 210,
        "protein": 5.5,
        "fat": 1.2,
        "carbs": 42.0,
        "unit": "g",
        "category": "Pieczywo"
    },
    {
        "name": "Szynka z piersi kurczaka Pikok Pure",
        "store": "Lidl",
        "brand": "Pikok Pure",
        "barcode": "20000023",
        "calories": 88,
        "protein": 19.5,
        "fat": 1.0,
        "carbs": 0.5,
        "unit": "g",
        "category": "Wędliny"
    },
    {
        "name": "Mozzarella light Lovilio Lidl",
        "store": "Lidl",
        "brand": "Lovilio",
        "barcode": "20000024",
        "calories": 165,
        "protein": 19.0,
        "fat": 8.5,
        "carbs": 1.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Bataty słodkie ziemniaki Ryneczek Lidla",
        "store": "Lidl",
        "brand": "Ryneczek Lidla",
        "barcode": "20000055",
        "calories": 86,
        "protein": 1.6,
        "fat": 0.1,
        "carbs": 20.1,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Marchew świeża myta Ryneczek Lidla",
        "store": "Lidl",
        "brand": "Ryneczek Lidla",
        "barcode": "20000056L",
        "calories": 41,
        "protein": 0.9,
        "fat": 0.2,
        "carbs": 9.6,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Mleko 1.5% bez laktozy Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000101",
        "calories": 44,
        "protein": 3.2,
        "fat": 1.5,
        "carbs": 4.7,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Twaróg chudy bez laktozy Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000102",
        "calories": 86,
        "protein": 18.5,
        "fat": 0.5,
        "carbs": 3.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Serek wiejski lekki bez laktozy Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000103",
        "calories": 81,
        "protein": 11.0,
        "fat": 2.5,
        "carbs": 2.4,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Jogurt naturalny bez laktozy Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000104",
        "calories": 60,
        "protein": 4.2,
        "fat": 2.5,
        "carbs": 4.8,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Kefir bez laktozy Pilos",
        "store": "Lidl",
        "brand": "Pilos",
        "barcode": "20000105",
        "calories": 46,
        "protein": 3.4,
        "fat": 1.5,
        "carbs": 4.6,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Kasza manna Crownfield",
        "store": "Lidl",
        "brand": "Crownfield",
        "barcode": "20000106L",
        "calories": 348,
        "protein": 10.0,
        "fat": 1.3,
        "carbs": 74.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Płatki ryżowe Crownfield",
        "store": "Lidl",
        "brand": "Crownfield",
        "barcode": "20000107L",
        "calories": 350,
        "protein": 7.0,
        "fat": 0.6,
        "carbs": 78.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Twaróg chudy klinek Delikate",
        "store": "Biedronka",
        "brand": "Delikate",
        "barcode": "20000025",
        "calories": 89,
        "protein": 19.8,
        "fat": 0.5,
        "carbs": 3.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Twaróg półtłusty Delikate",
        "store": "Biedronka",
        "brand": "Delikate",
        "barcode": "20000026",
        "calories": 113,
        "protein": 16.5,
        "fat": 4.0,
        "carbs": 3.7,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Serek wiejski lekki Delikate",
        "store": "Biedronka",
        "brand": "Delikate",
        "barcode": "20000027",
        "calories": 79,
        "protein": 11.5,
        "fat": 2.4,
        "carbs": 2.2,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Jogurt naturalny gęsty Mleczna Dolina",
        "store": "Biedronka",
        "brand": "Mleczna Dolina",
        "barcode": "20000028",
        "calories": 60,
        "protein": 4.2,
        "fat": 3.0,
        "carbs": 4.3,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Kefir naturalny Mleczna Dolina",
        "store": "Biedronka",
        "brand": "Mleczna Dolina",
        "barcode": "20000029",
        "calories": 46,
        "protein": 3.4,
        "fat": 1.5,
        "carbs": 4.5,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Szynka z piersi indyka Kraina Wędlin",
        "store": "Biedronka",
        "brand": "Kraina Wędlin",
        "barcode": "20000030",
        "calories": 84,
        "protein": 18.0,
        "fat": 1.0,
        "carbs": 0.8,
        "unit": "g",
        "category": "Wędliny"
    },
    {
        "name": "Polędwica sopocka Kraina Wędlin",
        "store": "Biedronka",
        "brand": "Kraina Wędlin",
        "barcode": "20000031",
        "calories": 98,
        "protein": 20.0,
        "fat": 1.5,
        "carbs": 1.0,
        "unit": "g",
        "category": "Wędliny"
    },
    {
        "name": "Pierś z kurczaka świeża Biedronka",
        "store": "Biedronka",
        "brand": "Kraina Mięs",
        "barcode": "20000032",
        "calories": 99,
        "protein": 21.5,
        "fat": 1.3,
        "carbs": 0.0,
        "unit": "g",
        "category": "Mięso"
    },
    {
        "name": "Mięso mielone z piersi indyka Biedronka",
        "store": "Biedronka",
        "brand": "Kraina Mięs",
        "barcode": "20000033",
        "calories": 110,
        "protein": 21.0,
        "fat": 2.5,
        "carbs": 0.0,
        "unit": "g",
        "category": "Mięso"
    },
    {
        "name": "Tuńczyk w sosie własnym Marinero",
        "store": "Biedronka",
        "brand": "Marinero",
        "barcode": "20000034",
        "calories": 101,
        "protein": 24.0,
        "fat": 0.6,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Łosoś wędzony na gorąco Marinero",
        "store": "Biedronka",
        "brand": "Marinero",
        "barcode": "20000035",
        "calories": 215,
        "protein": 21.0,
        "fat": 14.5,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Jaja ściółkowe Moja Kurka",
        "store": "Biedronka",
        "brand": "Moja Kurka",
        "barcode": "20000036",
        "calories": 140,
        "protein": 12.5,
        "fat": 9.7,
        "carbs": 0.6,
        "unit": "g",
        "category": "Jaja"
    },
    {
        "name": "Kasza jaglana Plony Natury",
        "store": "Biedronka",
        "brand": "Plony Natury",
        "barcode": "20000037",
        "calories": 348,
        "protein": 10.5,
        "fat": 2.9,
        "carbs": 68.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Płatki orkiszowe Plony Natury",
        "store": "Biedronka",
        "brand": "Plony Natury",
        "barcode": "20000038",
        "calories": 340,
        "protein": 12.0,
        "fat": 2.8,
        "carbs": 62.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Ryż brązowy Plony Natury",
        "store": "Biedronka",
        "brand": "Plony Natury",
        "barcode": "20000039",
        "calories": 345,
        "protein": 7.5,
        "fat": 2.2,
        "carbs": 71.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Ryż biały długoziarnisty Plony Natury",
        "store": "Biedronka",
        "brand": "Plony Natury",
        "barcode": "20000039B",
        "calories": 352,
        "protein": 7.0,
        "fat": 0.7,
        "carbs": 79.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Nasiona chia Vitanella",
        "store": "Biedronka",
        "brand": "Vitanella",
        "barcode": "20000040",
        "calories": 445,
        "protein": 17.0,
        "fat": 31.0,
        "carbs": 5.0,
        "unit": "g",
        "category": "Nasiona"
    },
    {
        "name": "Orzechy włoskie Biedronka",
        "store": "Biedronka",
        "brand": "Biedronka",
        "barcode": "20000041",
        "calories": 654,
        "protein": 15.0,
        "fat": 65.0,
        "carbs": 7.0,
        "unit": "g",
        "category": "Orzechy"
    },
    {
        "name": "Truskawki mrożone Mroźna Kraina",
        "store": "Biedronka",
        "brand": "Mroźna Kraina",
        "barcode": "20000042",
        "calories": 32,
        "protein": 0.7,
        "fat": 0.4,
        "carbs": 5.4,
        "unit": "g",
        "category": "Owoce"
    },
    {
        "name": "Maliny mrożone Mroźna Kraina",
        "store": "Biedronka",
        "brand": "Mroźna Kraina",
        "barcode": "20000043",
        "calories": 43,
        "protein": 1.3,
        "fat": 0.3,
        "carbs": 5.4,
        "unit": "g",
        "category": "Owoce"
    },
    {
        "name": "Chleb graham krojony Biedronka",
        "store": "Biedronka",
        "brand": "Piekarnia Biedronki",
        "barcode": "20000044",
        "calories": 225,
        "protein": 8.5,
        "fat": 1.5,
        "carbs": 43.0,
        "unit": "g",
        "category": "Pieczywo"
    },
    {
        "name": "Chleb pszenny tostowy Biedronka",
        "store": "Biedronka",
        "brand": "Piekarnia Biedronki",
        "barcode": "20000044B",
        "calories": 255,
        "protein": 7.5,
        "fat": 2.0,
        "carbs": 51.0,
        "unit": "g",
        "category": "Pieczywo"
    },
    {
        "name": "Tortilla pełnoziarnista Biedronka",
        "store": "Biedronka",
        "brand": "Biedronka",
        "barcode": "20000045",
        "calories": 295,
        "protein": 8.5,
        "fat": 5.5,
        "carbs": 50.0,
        "unit": "g",
        "category": "Pieczywo"
    },
    {
        "name": "Ciecierzyca w słoiku Culinea",
        "store": "Biedronka",
        "brand": "Culinea",
        "barcode": "20000046",
        "calories": 115,
        "protein": 6.8,
        "fat": 2.1,
        "carbs": 15.5,
        "unit": "g",
        "category": "Przetwory"
    },
    {
        "name": "Fasola czerwona Nasze Smaki",
        "store": "Biedronka",
        "brand": "Nasze Smaki",
        "barcode": "20000047",
        "calories": 105,
        "protein": 7.5,
        "fat": 0.5,
        "carbs": 14.5,
        "unit": "g",
        "category": "Przetwory"
    },
    {
        "name": "Pomidory malinowe Warzywniak Biedronki",
        "store": "Biedronka",
        "brand": "Warzywniak",
        "barcode": "20000048",
        "calories": 18,
        "protein": 0.9,
        "fat": 0.2,
        "carbs": 3.6,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Ogórek zielony świeży Biedronka",
        "store": "Biedronka",
        "brand": "Warzywniak",
        "barcode": "20000049",
        "calories": 14,
        "protein": 0.7,
        "fat": 0.1,
        "carbs": 2.5,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Awokado Hass Biedronka",
        "store": "Biedronka",
        "brand": "Biedronka",
        "barcode": "20000050",
        "calories": 160,
        "protein": 2.0,
        "fat": 15.0,
        "carbs": 2.0,
        "unit": "g",
        "category": "Owoce"
    },
    {
        "name": "Jabłka polskie Gala Biedronka",
        "store": "Biedronka",
        "brand": "Warzywniak",
        "barcode": "20000056",
        "calories": 52,
        "protein": 0.3,
        "fat": 0.2,
        "carbs": 13.8,
        "unit": "g",
        "category": "Owoce"
    },
    {
        "name": "Cukinia świeża Biedronka",
        "store": "Biedronka",
        "brand": "Warzywniak",
        "barcode": "20000057",
        "calories": 17,
        "protein": 1.2,
        "fat": 0.3,
        "carbs": 3.1,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Ziemniaki polskie Biedronka",
        "store": "Biedronka",
        "brand": "Warzywniak",
        "barcode": "20000058B",
        "calories": 77,
        "protein": 2.0,
        "fat": 0.1,
        "carbs": 17.5,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Dynia świeża krojona Biedronka",
        "store": "Biedronka",
        "brand": "Warzywniak",
        "barcode": "20000059B",
        "calories": 26,
        "protein": 1.0,
        "fat": 0.1,
        "carbs": 6.5,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Wafle ryżowe naturalne Good Food",
        "store": "Biedronka",
        "brand": "Good Food",
        "barcode": "20000060B",
        "calories": 385,
        "protein": 8.0,
        "fat": 2.8,
        "carbs": 81.0,
        "unit": "g",
        "category": "Pieczywo"
    },
    {
        "name": "Mleko 1.5% bez laktozy Mleczna Dolina",
        "store": "Biedronka",
        "brand": "Mleczna Dolina",
        "barcode": "20000108",
        "calories": 44,
        "protein": 3.2,
        "fat": 1.5,
        "carbs": 4.7,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Twaróg chudy bez laktozy Delikate",
        "store": "Biedronka",
        "brand": "Delikate",
        "barcode": "20000109",
        "calories": 89,
        "protein": 19.8,
        "fat": 0.5,
        "carbs": 3.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Serek wiejski bez laktozy Delikate",
        "store": "Biedronka",
        "brand": "Delikate",
        "barcode": "20000110",
        "calories": 79,
        "protein": 11.5,
        "fat": 2.4,
        "carbs": 2.2,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Jogurt naturalny bez laktozy Mleczna Dolina",
        "store": "Biedronka",
        "brand": "Mleczna Dolina",
        "barcode": "20000111",
        "calories": 60,
        "protein": 4.2,
        "fat": 2.5,
        "carbs": 4.8,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Kefir bez laktozy Mleczna Dolina",
        "store": "Biedronka",
        "brand": "Mleczna Dolina",
        "barcode": "20000112",
        "calories": 46,
        "protein": 3.4,
        "fat": 1.5,
        "carbs": 4.6,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Kasza manna Plony Natury",
        "store": "Biedronka",
        "brand": "Plony Natury",
        "barcode": "20000113B",
        "calories": 348,
        "protein": 10.0,
        "fat": 1.3,
        "carbs": 74.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Płatki ryżowe Plony Natury",
        "store": "Biedronka",
        "brand": "Plony Natury",
        "barcode": "20000114B",
        "calories": 350,
        "protein": 7.0,
        "fat": 0.6,
        "carbs": 78.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Pierś z kurczaka K-Purland",
        "store": "Kaufland",
        "brand": "K-Purland",
        "barcode": "20000060",
        "calories": 99,
        "protein": 21.5,
        "fat": 1.3,
        "carbs": 0.0,
        "unit": "g",
        "category": "Mięso"
    },
    {
        "name": "Polędwiczki z indyka K-Purland",
        "store": "Kaufland",
        "brand": "K-Purland",
        "barcode": "20000061",
        "calories": 102,
        "protein": 22.0,
        "fat": 1.4,
        "carbs": 0.0,
        "unit": "g",
        "category": "Mięso"
    },
    {
        "name": "Skyr naturalny K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000062",
        "calories": 64,
        "protein": 11.5,
        "fat": 0.2,
        "carbs": 4.0,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Skyr waniliowy K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000063",
        "calories": 84,
        "protein": 9.6,
        "fat": 0.2,
        "carbs": 11.0,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Twaróg chudy K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000064",
        "calories": 86,
        "protein": 18.5,
        "fat": 0.5,
        "carbs": 3.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Serek wiejski lekki K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000065",
        "calories": 80,
        "protein": 11.0,
        "fat": 2.4,
        "carbs": 2.3,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Płatki owsiane górskie K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000066",
        "calories": 366,
        "protein": 13.5,
        "fat": 7.0,
        "carbs": 58.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Ryż basmati K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000067",
        "calories": 355,
        "protein": 8.0,
        "fat": 0.8,
        "carbs": 78.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Kasza gryczana prażona K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000068",
        "calories": 343,
        "protein": 12.6,
        "fat": 3.1,
        "carbs": 63.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Makaron pełnoziarnisty penne K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000069",
        "calories": 348,
        "protein": 12.5,
        "fat": 2.0,
        "carbs": 65.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Dorsz atlantycki filet świeży Kaufland",
        "store": "Kaufland",
        "brand": "K-Stoisko Rybne",
        "barcode": "20000070",
        "calories": 78,
        "protein": 17.5,
        "fat": 0.7,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Łosoś atlantycki świeży filet Kaufland",
        "store": "Kaufland",
        "brand": "K-Stoisko Rybne",
        "barcode": "20000071",
        "calories": 208,
        "protein": 20.0,
        "fat": 13.0,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Tuńczyk w sosie własnym K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000072",
        "calories": 101,
        "protein": 24.0,
        "fat": 0.6,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Warzywa na patelnię klasyczne K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000073",
        "calories": 42,
        "protein": 2.2,
        "fat": 0.3,
        "carbs": 6.5,
        "unit": "g",
        "category": "Mrożonki"
    },
    {
        "name": "Oliwa z oliwek Extra Virgin K-Bio",
        "store": "Kaufland",
        "brand": "K-Bio",
        "barcode": "20000074",
        "calories": 824,
        "protein": 0.0,
        "fat": 91.6,
        "carbs": 0.0,
        "unit": "g",
        "category": "Tłuszcze"
    },
    {
        "name": "Chleb żytni 100% Kaufland Piekarnia",
        "store": "Kaufland",
        "brand": "Kaufland Piekarnia",
        "barcode": "20000075",
        "calories": 215,
        "protein": 5.8,
        "fat": 1.3,
        "carbs": 42.0,
        "unit": "g",
        "category": "Pieczywo"
    },
    {
        "name": "Jaja ściółkowe klasa M K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000076",
        "calories": 140,
        "protein": 12.5,
        "fat": 9.7,
        "carbs": 0.6,
        "unit": "g",
        "category": "Jaja"
    },
    {
        "name": "Szynka z piersi indyka K-Purland",
        "store": "Kaufland",
        "brand": "K-Purland",
        "barcode": "20000077",
        "calories": 85,
        "protein": 18.5,
        "fat": 1.1,
        "carbs": 0.7,
        "unit": "g",
        "category": "Wędliny"
    },
    {
        "name": "Tofu naturalne bio K-take it veggie",
        "store": "Kaufland",
        "brand": "K-take it veggie",
        "barcode": "20000078",
        "calories": 125,
        "protein": 13.0,
        "fat": 7.5,
        "carbs": 1.8,
        "unit": "g",
        "category": "Roślinne"
    },
    {
        "name": "Szpinak baby K-Bio Kaufland",
        "store": "Kaufland",
        "brand": "K-Bio",
        "barcode": "20000079",
        "calories": 23,
        "protein": 2.9,
        "fat": 0.4,
        "carbs": 0.8,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Mleko 1.5% bez laktozy K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000115",
        "calories": 44,
        "protein": 3.2,
        "fat": 1.5,
        "carbs": 4.7,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Twaróg chudy bez laktozy K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000116",
        "calories": 86,
        "protein": 18.5,
        "fat": 0.5,
        "carbs": 3.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Serek wiejski bez laktozy K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000117",
        "calories": 80,
        "protein": 11.0,
        "fat": 2.4,
        "carbs": 2.3,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Jogurt naturalny bez laktozy K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000118",
        "calories": 60,
        "protein": 4.2,
        "fat": 2.5,
        "carbs": 4.8,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Kefir bez laktozy K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000119",
        "calories": 46,
        "protein": 3.4,
        "fat": 1.5,
        "carbs": 4.6,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Kasza manna K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000120K",
        "calories": 348,
        "protein": 10.0,
        "fat": 1.3,
        "carbs": 74.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Płatki ryżowe K-Classic",
        "store": "Kaufland",
        "brand": "K-Classic",
        "barcode": "20000121K",
        "calories": 350,
        "protein": 7.0,
        "fat": 0.6,
        "carbs": 78.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Pierś z kurczaka Carrefour Jakość z Natury",
        "store": "Carrefour",
        "brand": "Carrefour Jakość z Natury",
        "barcode": "20000080",
        "calories": 99,
        "protein": 21.5,
        "fat": 1.3,
        "carbs": 0.0,
        "unit": "g",
        "category": "Mięso"
    },
    {
        "name": "Polędwiczki z indyka Carrefour",
        "store": "Carrefour",
        "brand": "Carrefour",
        "barcode": "20000081",
        "calories": 102,
        "protein": 22.0,
        "fat": 1.4,
        "carbs": 0.0,
        "unit": "g",
        "category": "Mięso"
    },
    {
        "name": "Skyr naturalny Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000082",
        "calories": 65,
        "protein": 11.8,
        "fat": 0.2,
        "carbs": 4.1,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Skyr waniliowy Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000083",
        "calories": 85,
        "protein": 9.8,
        "fat": 0.2,
        "carbs": 11.0,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Twaróg chudy Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000084",
        "calories": 86,
        "protein": 18.5,
        "fat": 0.5,
        "carbs": 3.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Serek wiejski lekki Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000085",
        "calories": 81,
        "protein": 11.0,
        "fat": 2.5,
        "carbs": 2.4,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Płatki owsiane górskie Carrefour Bio",
        "store": "Carrefour",
        "brand": "Carrefour Bio",
        "barcode": "20000086",
        "calories": 366,
        "protein": 13.5,
        "fat": 7.0,
        "carbs": 58.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Ryż basmati Carrefour Extra",
        "store": "Carrefour",
        "brand": "Carrefour Extra",
        "barcode": "20000087",
        "calories": 355,
        "protein": 8.0,
        "fat": 0.8,
        "carbs": 78.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Kasza gryczana prażona Carrefour",
        "store": "Carrefour",
        "brand": "Carrefour",
        "barcode": "20000088",
        "calories": 343,
        "protein": 12.6,
        "fat": 3.1,
        "carbs": 63.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Makaron pełnoziarnisty penne Carrefour Bio",
        "store": "Carrefour",
        "brand": "Carrefour Bio",
        "barcode": "20000089",
        "calories": 348,
        "protein": 12.5,
        "fat": 2.0,
        "carbs": 65.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Dorsz atlantycki świeży filet Carrefour",
        "store": "Carrefour",
        "brand": "Carrefour Rybny Targ",
        "barcode": "20000090",
        "calories": 78,
        "protein": 17.5,
        "fat": 0.7,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Łosoś atlantycki filet świeży Carrefour",
        "store": "Carrefour",
        "brand": "Carrefour Rybny Targ",
        "barcode": "20000091",
        "calories": 208,
        "protein": 20.0,
        "fat": 13.0,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Tuńczyk kawałki w sosie własnym Carrefour",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000092",
        "calories": 101,
        "protein": 24.0,
        "fat": 0.6,
        "carbs": 0.0,
        "unit": "g",
        "category": "Ryby"
    },
    {
        "name": "Warzywa na patelnię klasyczne Carrefour",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000093",
        "calories": 42,
        "protein": 2.2,
        "fat": 0.3,
        "carbs": 6.5,
        "unit": "g",
        "category": "Mrożonki"
    },
    {
        "name": "Oliwa z oliwek Extra Virgin Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000094",
        "calories": 824,
        "protein": 0.0,
        "fat": 91.6,
        "carbs": 0.0,
        "unit": "g",
        "category": "Tłuszcze"
    },
    {
        "name": "Chleb graham krojony Carrefour Piekarnia",
        "store": "Carrefour",
        "brand": "Carrefour Piekarnia",
        "barcode": "20000095",
        "calories": 225,
        "protein": 8.5,
        "fat": 1.5,
        "carbs": 43.0,
        "unit": "g",
        "category": "Pieczywo"
    },
    {
        "name": "Jaja ściółkowe Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000096",
        "calories": 140,
        "protein": 12.5,
        "fat": 9.7,
        "carbs": 0.6,
        "unit": "g",
        "category": "Jaja"
    },
    {
        "name": "Szynka z piersi kurczaka Carrefour Jakość z Natury",
        "store": "Carrefour",
        "brand": "Carrefour Jakość z Natury",
        "barcode": "20000097",
        "calories": 86,
        "protein": 19.0,
        "fat": 1.0,
        "carbs": 0.6,
        "unit": "g",
        "category": "Wędliny"
    },
    {
        "name": "Tofu naturalne Carrefour Bio",
        "store": "Carrefour",
        "brand": "Carrefour Bio",
        "barcode": "20000098",
        "calories": 125,
        "protein": 13.0,
        "fat": 7.5,
        "carbs": 1.8,
        "unit": "g",
        "category": "Roślinne"
    },
    {
        "name": "Szpinak baby Carrefour Bio",
        "store": "Carrefour",
        "brand": "Carrefour Bio",
        "barcode": "20000099",
        "calories": 23,
        "protein": 2.9,
        "fat": 0.4,
        "carbs": 0.8,
        "unit": "g",
        "category": "Warzywa"
    },
    {
        "name": "Mleko 1.5% bez laktozy Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000122",
        "calories": 44,
        "protein": 3.2,
        "fat": 1.5,
        "carbs": 4.7,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Twaróg chudy bez laktozy Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000123",
        "calories": 86,
        "protein": 18.5,
        "fat": 0.5,
        "carbs": 3.5,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Serek wiejski bez laktozy Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000124",
        "calories": 81,
        "protein": 11.0,
        "fat": 2.5,
        "carbs": 2.4,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Jogurt naturalny bez laktozy Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000125",
        "calories": 60,
        "protein": 4.2,
        "fat": 2.5,
        "carbs": 4.8,
        "unit": "g",
        "category": "Nabiał"
    },
    {
        "name": "Kefir bez laktozy Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000126",
        "calories": 46,
        "protein": 3.4,
        "fat": 1.5,
        "carbs": 4.6,
        "unit": "ml",
        "category": "Nabiał"
    },
    {
        "name": "Kasza manna Carrefour Classic",
        "store": "Carrefour",
        "brand": "Carrefour Classic",
        "barcode": "20000127C",
        "calories": 348,
        "protein": 10.0,
        "fat": 1.3,
        "carbs": 74.0,
        "unit": "g",
        "category": "Zbożowe"
    },
    {
        "name": "Płatki ryżowe Carrefour Bio",
        "store": "Carrefour",
        "brand": "Carrefour Bio",
        "barcode": "20000128C",
        "calories": 350,
        "protein": 7.0,
        "fat": 0.6,
        "carbs": 78.0,
        "unit": "g",
        "category": "Zbożowe"
    }
]

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
    raw_recipes = [
    {
        "title": "Wysokobiałkowa owsianka ze skyrem Pilos i borówkami",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki owsiane zalej wrzątkiem (120 ml) i odstaw na 5 minut do napęcznienia.\n2. Wymieszaj z naturalnym skyrem Pilos.\n3. Całość przygotujesz w 15 minut.\n4. Na wierzch wyłóż borówki i masło orzechowe 100%.",
        "ingredients": [
            [
                "Skyr naturalny Pilos",
                150
            ],
            [
                "Płatki owsiane górskie Crownfield",
                50
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                70
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                15
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Puszysty omlet ze szpinakiem i polędwicą z indyka",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Jaja ściółkowe roztrzep widelcem ze szczyptą soli.\n2. Na patelni z kroplą oliwy podsmaż szpinak baby i szynkę z indyka.\n3. Wlej masę jajeczną, smaż pod przykryciem 5 minut.\n4. Przygotowanie zajmuje dokładnie 15 minut.\n5. Podawaj z chlebem żytnim.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Szynka z piersi indyka Kraina Wędlin",
                50
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                40
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                5
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Jaglanka waniliowo-malinowa z nasionami chia",
        "category": "Śniadanie",
        "prep_time": 20,
        "instructions": "1. Kaszę jaglaną przepłucz wrzątkiem, ugotuj w wodzie do miękkości (12 minut).\n2. Wymieszaj ze skyrem waniliowym Pilos i nasionami chia.\n3. Czas przygotowania wynosi 20 minut.\n4. Udekoruj podgrzanymi malinami mrożonymi.",
        "ingredients": [
            [
                "Kasza jaglana Plony Natury",
                50
            ],
            [
                "Skyr waniliowy Pilos",
                150
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                60
            ],
            [
                "Nasiona chia Vitanella",
                10
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Szakszuka pomidorowa z bazylią i chlebem żytnim",
        "category": "Śniadanie",
        "prep_time": 20,
        "instructions": "1. Na oliwie podsmaż krojone pomidory z oregano i solą przez 5 minut.\n2. Wbij jaja ściółkowe i duś pod przykryciem 6 minut.\n3. Łączny czas przygotowania to 20 minut.\n4. Podawaj z chlebem żytnim.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Pomidory krojone w puszce Freshona",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                60
            ]
        ],
        "image_type": "shakshuka"
    },
    {
        "title": "Placuszki twarogowe z sosem z ciepłych malin",
        "category": "Śniadanie",
        "prep_time": 20,
        "instructions": "1. Twaróg chudy rozgnieć widelcem z jajkiem i płatkami owsianymi.\n2. Smaż placuszki na patelni teflonowej po 3 minuty z każdej strony.\n3. Czas wykonania wynosi 20 minut.\n4. Polej ciepłymi malinami.",
        "ingredients": [
            [
                "Twaróg chudy Pilos",
                120
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Płatki owsiane górskie Crownfield",
                40
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                80
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                5
            ]
        ],
        "image_type": "pancakes"
    },
    {
        "title": "Kanapki z pastą twarogową z tuńczykiem i ogórkiem",
        "category": "Śniadanie",
        "prep_time": 10,
        "instructions": "1. Odsącz tuńczyka, rozgnieć z chudym twarogiem i jogurtem naturalnym.\n2. Posmaruj pastą kromki chleba graham.\n3. Czas przygotowania to zaledwie 10 minut.\n4. Ułóż na wierzchu świeże plastry ogórka.",
        "ingredients": [
            [
                "Twaróg chudy klinek Delikate",
                100
            ],
            [
                "Tuńczyk w sosie własnym Marinero",
                60
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                30
            ],
            [
                "Chleb graham krojony Biedronka",
                70
            ],
            [
                "Ogórek zielony świeży Biedronka",
                50
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Owsianka orzechowo-bananowa na napoju migdałowym",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki owsiane ugotuj w napoju migdałowym Vemondo (7 minut).\n2. Wymieszaj z plastrami banana i łyżką masła orzechowego Alesto.\n3. Przygotujesz w 15 minut.\n4. Sycące i zdrowe śniadanie pełne energii.",
        "ingredients": [
            [
                "Płatki owsiane górskie Crownfield",
                50
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                150
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                15
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Jajka sadzone na szpinaku z pieczywem żytnim Kaufland",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Na oliwie z oliwek K-Bio podduś szpinak baby z solą i czosnkiem (3 minuty).\n2. Wbij jaja ściółkowe K-Classic i smaż do ścięcia białek.\n3. Czas przygotowania wynosi 12 minut.\n4. Podawaj ze świeżym chlebem żytnim.",
        "ingredients": [
            [
                "Jaja ściółkowe klasa M K-Classic",
                120
            ],
            [
                "Szpinak baby K-Bio Kaufland",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                6
            ],
            [
                "Chleb żytni 100% Kaufland Piekarnia",
                60
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Twarożek z rzodkiewką i ogórkiem na chlebie graham Carrefour",
        "category": "Śniadanie",
        "prep_time": 10,
        "instructions": "1. Twaróg chudy Carrefour Classic wymieszaj z jogurtem naturalnym i posiekanym ogórkiem.\n2. Dopraw szczyptą soli i pieprzu.\n3. Czas przygotowania to 10 minut.\n4. Nałóż na kromki chleba graham.",
        "ingredients": [
            [
                "Twaróg chudy Carrefour Classic",
                120
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                40
            ],
            [
                "Ogórek zielony świeży Biedronka",
                50
            ],
            [
                "Chleb graham krojony Carrefour Piekarnia",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Owsianka proteinowa z truskawkami i skyrem Carrefour",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki owsiane Carrefour Bio zalej wrzątkiem i odstaw na 5 minut.\n2. Wmieszaj skyr naturalny Carrefour Classic i mrożone truskawki.\n3. Danie przygotujesz w 15 minut.\n4. Bogate w antyoksydanty i białko.",
        "ingredients": [
            [
                "Płatki owsiane górskie Carrefour Bio",
                50
            ],
            [
                "Skyr naturalny Carrefour Classic",
                150
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                80
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                10
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Fit szakszuka z mozzarellą light i oregano",
        "category": "Śniadanie",
        "prep_time": 20,
        "instructions": "1. Pomidory w puszce Freshona duś z ziołami na patelni.\n2. Wbij 2 jaja ściółkowe i posyp pokrojoną mozzarellą light Lovilio.\n3. Przykryj i trzymaj na małym ogniu przez 6 minut.\n4. Czas przygotowania to 20 minut.",
        "ingredients": [
            [
                "Pomidory krojone w puszce Freshona",
                160
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Mozzarella light Lovilio Lidl",
                40
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                5
            ]
        ],
        "image_type": "shakshuka"
    },
    {
        "title": "Kanapki z szynką Pikok Pure, jajkiem i pomidorem",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Jajko ściółkowe ugotuj na twardo (8 minut) i pokrój w plasterki.\n2. Na kromkach chleba żytniego ułóż szynkę z kurczaka Pikok Pure, plastry jajka i pomidora.\n3. Przygotujesz w 12 minut.",
        "ingredients": [
            [
                "Chleb żytni 100% z pieca Lidla",
                70
            ],
            [
                "Szynka z piersi kurczaka Pikok Pure",
                50
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Jaglanka kokosowo-orzechowa z bananem i nasionami chia",
        "category": "Śniadanie",
        "prep_time": 20,
        "instructions": "1. Kaszę jaglaną ugotuj na miękko w wodzie.\n2. Połącz z nasionami chia, bananem i masłem orzechowym 100%.\n3. Czas przygotowania wynosi 20 minut.\n4. Daje długotrwałą sytość.",
        "ingredients": [
            [
                "Kasza jaglana Plony Natury",
                50
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Nasiona chia Vitanella",
                10
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                15
            ],
            [
                "Skyr naturalny Pilos",
                80
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Omlet białkowy z tofu i warzywami na patelnię",
        "category": "Śniadanie",
        "prep_time": 18,
        "instructions": "1. Tofu pokrój w kostkę i podsmaż lekko z warzywami Freshona na oliwie.\n2. Zalej roztrzepanymi jajkami ściółkowymi i smaż pod pokrywką 6 minut.\n3. Czas wykonania to 18 minut.\n4. Wspaniałe urozmaicenie diety.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Tofu naturalne bio Vemondo",
                80
            ],
            [
                "Warzywa na patelnię klasyczne Freshona",
                80
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Gryczanka na słodko z malinami i skyrem waniliowym",
        "category": "Śniadanie",
        "prep_time": 20,
        "instructions": "1. Kaszę gryczaną prażoną ugotuj w lekko osolonej wodzie.\n2. Wymieszaj ze skyrem waniliowym K-Classic i malinami.\n3. Przygotujesz w 20 minut.\n4. Niezwykłe źródło rutyny i magnezu.",
        "ingredients": [
            [
                "Kasza gryczana prażona K-Classic",
                45
            ],
            [
                "Skyr waniliowy K-Classic",
                150
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                70
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Tosty z awokado, jajkiem sadzonym i pomidorem malinowym",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Kromki chleba graham opiecz w tosterze lub na patelni.\n2. Awokado rozgnieć z solą i sokiem z cytryny, posmaruj tosty.\n3. Usmaż jajko sadzone i połóż na wierzchu z plastrami pomidora.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Chleb graham krojony Biedronka",
                60
            ],
            [
                "Awokado Hass Biedronka",
                50
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Owsianka cynamonowa ze skyrem K-Classic i orzechami włoskimi",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki owsiane K-Classic zalej gorącą wodą z cynamonem na 5 minut.\n2. Dodaj gęsty skyr naturalny K-Classic i posiekane orzechy włoskie.\n3. Przygotowanie zajmuje 15 minut.",
        "ingredients": [
            [
                "Płatki owsiane górskie K-Classic",
                50
            ],
            [
                "Skyr naturalny K-Classic",
                150
            ],
            [
                "Orzechy włoskie Biedronka",
                15
            ],
            [
                "Banan świeży Ryneczek Lidla",
                60
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Omlet z polędwicą sopocką i świeżym pomidorem",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Roztrzep jaja ściółkowe ze szczyptą pieprzu.\n2. Podsmaż na kropli oliwy polędwicę sopocką Kraina Wędlin i pomidora malinowego.\n3. Zalej masą jajeczną, smaż 5 minut pod przykryciem.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Polędwica sopocka Kraina Wędlin",
                50
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                70
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Kanapki z pastą jajeczną z koperkiem i chlebem żytnim Kaufland",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Jaja ugotuj na twardo, rozgnieć z jogurtem naturalnym, solą i pieprzem.\n2. Posmaruj pastą kromki chleba żytniego Kaufland Piekarnia.\n3. Całość przygotujesz w 15 minut.\n4. Dodaj świeży ogórek zielony.",
        "ingredients": [
            [
                "Jaja ściółkowe klasa M K-Classic",
                120
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                30
            ],
            [
                "Chleb żytni 100% Kaufland Piekarnia",
                70
            ],
            [
                "Ogórek zielony świeży Biedronka",
                50
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Pancakes owsiane ze skyrem i borówkami Ryneczek Lidla",
        "category": "Śniadanie",
        "prep_time": 20,
        "instructions": "1. Płatki owsiane zblenduj ze skyrem naturalnym Pilos i jajkiem na gładkie ciasto.\n2. Smaż małe placuszki na patelni teflonowej po 2.5 minuty z każdej strony.\n3. Czas wykonania to 20 minut.\n4. Udekoruj świeżymi borówkami.",
        "ingredients": [
            [
                "Płatki owsiane górskie Crownfield",
                45
            ],
            [
                "Skyr naturalny Pilos",
                100
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "pancakes"
    },
    {
        "title": "Płatki orkiszowe na ciepło z bananem i masłem orzechowym",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki orkiszowe Plony Natury ugotuj w wodzie (ok. 6 minut).\n2. Wmieszaj skyr naturalny, plastry banana i masło orzechowe 100%.\n3. Czas: 15 minut.\n4. Zdrowy początek dnia bogaty w witaminy z grupy B.",
        "ingredients": [
            [
                "Płatki orkiszowe Plony Natury",
                50
            ],
            [
                "Skyr naturalny Pilos",
                100
            ],
            [
                "Banan świeży Ryneczek Lidla",
                70
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                15
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Jajecznica ze szczypiorkiem i szynką z kurczaka Carrefour",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Na oliwie podsmaż pokrojoną szynkę z kurczaka Carrefour Jakość z Natury.\n2. Wbij 2 jaja ściółkowe i delikatnie mieszaj na małym ogniu do ścięcia.\n3. Przygotujesz w 12 minut.\n4. Podawaj z chlebem graham.",
        "ingredients": [
            [
                "Jaja ściółkowe Carrefour Classic",
                120
            ],
            [
                "Szynka z piersi kurczaka Carrefour Jakość z Natury",
                50
            ],
            [
                "Chleb graham krojony Carrefour Piekarnia",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Wrap śniadaniowy z jajkiem sadzonym, szpinakiem i mozzarellą",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Tortillę podgrzej na patelni.\n2. Usmaż jajko sadzone i ułóż w tortilli ze świeżym szpinakiem baby i startą mozzarellą light.\n3. Zawiń ściśle i przekrój na pół.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Tortilla pełnoziarnista Biedronka",
                60
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                30
            ],
            [
                "Mozzarella light Lovilio Lidl",
                40
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                50
            ]
        ],
        "image_type": "wrap"
    },
    {
        "title": "Twarogowy bowl z borówkami, bananem i nasionami chia",
        "category": "Śniadanie",
        "prep_time": 10,
        "instructions": "1. Twaróg chudy rozgnieć z jogurtem naturalnym w misce.\n2. Ułóż borówki, plastry banana i posyp nasionami chia Vitanella.\n3. Gotowe w 10 minut bez gotowania!",
        "ingredients": [
            [
                "Twaróg chudy Pilos",
                120
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                50
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                60
            ],
            [
                "Banan świeży Ryneczek Lidla",
                60
            ],
            [
                "Nasiona chia Vitanella",
                10
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Omlet na słodko ze skyrem waniliowym i malinami",
        "category": "Śniadanie",
        "prep_time": 18,
        "instructions": "1. Jaja ściółkowe ubij lekko widelcem i usmaż na patelni jako puszysty omlet.\n2. Złóż na pół i napełnij skyrem waniliowym Pilos oraz ciepłymi malinami.\n3. Czas wykonania to 18 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Skyr waniliowy Pilos",
                100
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Serek wiejski lekki z rzodkiewką i chlebem graham",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Otwórz serek wiejski lekki Delikate.\n2. Ogórka pokrój w kostkę i wymieszaj z serkiem i pieprzem.\n3. Przygotujesz w 10 minut.\n4. Zjedz z chlebem graham.",
        "ingredients": [
            [
                "Serek wiejski lekki Delikate",
                180
            ],
            [
                "Chleb graham krojony Biedronka",
                60
            ],
            [
                "Ogórek zielony świeży Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Koktajl proteinowy z truskawkami i skyrem Pilos",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Do blendera wrzuć skyr naturalny Pilos, truskawki mrożone i napój migdałowy.\n2. Dodaj nasiona chia i miksuj przez 60 sekund.\n3. Całość gotowa w 8 minut.\n4. Przelej do bidonu.",
        "ingredients": [
            [
                "Skyr naturalny Pilos",
                180
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                120
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                150
            ],
            [
                "Nasiona chia Vitanella",
                10
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Wrap pełnoziarnisty z indykiem i mozzarellą light",
        "category": "Drugie śniadanie",
        "prep_time": 12,
        "instructions": "1. Tortillę podgrzej przez 20 sekund.\n2. Ułóż szpinak, szynkę z indyka Kraina Wędlin i mozzarellę light.\n3. Zawiń ściśle w rulon.\n4. Czas wykonania: 12 minut.",
        "ingredients": [
            [
                "Tortilla pełnoziarnista Biedronka",
                60
            ],
            [
                "Szynka z piersi indyka Kraina Wędlin",
                60
            ],
            [
                "Mozzarella light Lovilio Lidl",
                40
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                60
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                20
            ]
        ],
        "image_type": "wrap"
    },
    {
        "title": "Pudding chia na napoju migdałowym z borówkami",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Nasiona chia wymieszaj z napojem migdałowym Vemondo.\n2. Na wierzch dodaj skyr waniliowy i borówki amerykańskie.\n3. Przygotowanie zajmuje 10 minut.\n4. Znakomite źródło Omega-3.",
        "ingredients": [
            [
                "Nasiona chia Vitanella",
                25
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                180
            ],
            [
                "Skyr waniliowy Pilos",
                100
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                50
            ]
        ],
        "image_type": "chia"
    },
    {
        "title": "Serek wiejski K-Classic z pomidorkami i bazylią",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Serek wiejski lekki K-Classic wymieszaj z pokrojonym pomidorem i suszoną bazylią.\n2. Czas: 8 minut.\n3. Podawaj z chlebem żytnim Kaufland.",
        "ingredients": [
            [
                "Serek wiejski lekki K-Classic",
                180
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                80
            ],
            [
                "Chleb żytni 100% Kaufland Piekarnia",
                50
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Koktajl bananowo-kefirowy z cynamonem i orzechami",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Kefir naturalny Mleczna Dolina zblenduj z bananem i szczyptą cynamonu.\n2. Posyp posiekanymi orzechami włoskimi.\n3. Przygotujesz w 6 minut.",
        "ingredients": [
            [
                "Kefir naturalny Mleczna Dolina",
                220
            ],
            [
                "Banan świeży Ryneczek Lidla",
                90
            ],
            [
                "Orzechy włoskie Biedronka",
                15
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Sałatka z tuńczykiem w sosie własnym i jajkiem",
        "category": "Drugie śniadanie",
        "prep_time": 12,
        "instructions": "1. Jajko ugotuj na twardo i pokrój w ćwiartki.\n2. W misce połącz szpinak baby, odsączonego tuńczyka Marinero, pomidora i jajko.\n3. Skrop oliwą z oliwek.\n4. Czas: 12 minut.",
        "ingredients": [
            [
                "Tuńczyk w sosie własnym Marinero",
                80
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                40
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                80
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "salad_bowl"
    },
    {
        "title": "Serek wiejski Carrefour z bananem i masłem orzechowym",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Do serka wiejskiego Carrefour Classic dodaj pokrojonego w plasterki banana.\n2. Polej łyżeczką masła orzechowego 100%.\n3. Gotowe w 6 minut!",
        "ingredients": [
            [
                "Serek wiejski lekki Carrefour Classic",
                180
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                15
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Wrap z pieczoną piersią z kurczaka i sosem jogurtowym",
        "category": "Drugie śniadanie",
        "prep_time": 15,
        "instructions": "1. Tortillę podgrzej, posmaruj sosem z jogurtu naturalnego i czosnku.\n2. Ułóż upieczoną pierś z kurczaka, ogórek i szpinak.\n3. Zwiń ściśle.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Tortilla pełnoziarnista Biedronka",
                60
            ],
            [
                "Pierś z kurczaka Rzeźnik",
                70
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                30
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                30
            ],
            [
                "Ogórek zielony świeży Biedronka",
                40
            ]
        ],
        "image_type": "wrap"
    },
    {
        "title": "Shake malinowy na kefirze ze skyrem waniliowym",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Zmiksuj kefir naturalny, skyr waniliowy Pilos i mrożone maliny.\n2. Gotowe w 6 minut.\n3. Orzeźwiający i wysokobiałkowy posiłek na wynos.",
        "ingredients": [
            [
                "Kefir naturalny Mleczna Dolina",
                150
            ],
            [
                "Skyr waniliowy Pilos",
                100
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                80
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Twaróg z awokado i pomidorem na waflach ryżowych",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Twaróg chudy Delikate rozgnieć z dojrzałym awokado i odrobiną soli.\n2. Nałóż pastę na chrupkie wafle ryżowe Good Food i połóż plasterki pomidora.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Twaróg chudy klinek Delikate",
                100
            ],
            [
                "Awokado Hass Biedronka",
                40
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                30
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Sałatka z ciecierzycą, szpinakiem i mozzarellą light",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Odsącz ciecierzycę ze słoika Culinea.\n2. Połącz ze świeżym szpinakiem baby, pokrojoną mozzarellą i pomidorem.\n3. Polej oliwą z oliwek.\n4. Przygotujesz w 10 minut.",
        "ingredients": [
            [
                "Ciecierzyca w słoiku Culinea",
                80
            ],
            [
                "Mozzarella light Lovilio Lidl",
                50
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                40
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "salad_bowl"
    },
    {
        "title": "Kanapka z pastą z czerwonej fasoli i ogórkiem",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Fasolę czerwoną ze słoika zblenduj z łyżeczką oliwy, solą i majerankiem na gładki pasztet.\n2. Posmaruj chleb żytni z pieca Lidla i dodaj plastry ogórka.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Fasola czerwona Nasze Smaki",
                80
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                60
            ],
            [
                "Ogórek zielony świeży Biedronka",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                5
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Smoothie bowl ze skyrem, jagodami i płatkami orkiszowymi",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Zblenduj skyr waniliowy z borówkami na gęsty mus i przelej do miski.\n2. Posyp chrupiącymi płatkami orkiszowymi Plony Natury.\n3. Czas wykonania: 8 minut.",
        "ingredients": [
            [
                "Skyr waniliowy Pilos",
                150
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                80
            ],
            [
                "Płatki orkiszowe Plony Natury",
                30
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Mini sałatka z łososiem wędzonym i jajkiem na twardo",
        "category": "Drugie śniadanie",
        "prep_time": 12,
        "instructions": "1. Szpinak baby ułóż na talerzu, dodaj kawałki łososia wędzonego Marinero i ugotowane jajko.\n2. Skrop sokiem z cytryny i oliwą.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Łosoś wędzony na gorąco Marinero",
                60
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                30
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "salad_bowl"
    },
    {
        "title": "Skyr naturalny K-Classic z bananem i orzechami włoskimi",
        "category": "Drugie śniadanie",
        "prep_time": 5,
        "instructions": "1. Skyr naturalny K-Classic przełóż do kubka, dodaj pokrojonego banana i orzechy włoskie.\n2. Błyskawiczny posiłek gotowy w 5 minut!",
        "ingredients": [
            [
                "Skyr naturalny K-Classic",
                150
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Orzechy włoskie Biedronka",
                15
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Kanapki z szynką z piersi indyka i pastą z awokado",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Chleb graham posmaruj dojrzałym awokado roztartym z solą.\n2. Połóż szynkę z piersi indyka K-Purland i pomidora.\n3. Czas przygotowania to 10 minut.",
        "ingredients": [
            [
                "Chleb graham krojony Biedronka",
                60
            ],
            [
                "Awokado Hass Biedronka",
                40
            ],
            [
                "Szynka z piersi indyka K-Purland",
                50
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Kefir Mleczna Dolina z borówkami i nasionami chia",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Do wysokiej szklanki wlej kefir naturalny, wsyp borówki i nasiona chia Vitanella.\n2. Wymieszaj i odstaw na 5 minut.\n3. Łączny czas: 6 minut.",
        "ingredients": [
            [
                "Kefir naturalny Mleczna Dolina",
                220
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                70
            ],
            [
                "Nasiona chia Vitanella",
                10
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Wafle ryżowe z masłem orzechowym i plastrami jabłka",
        "category": "Drugie śniadanie",
        "prep_time": 5,
        "instructions": "1. Wafle ryżowe Good Food posmaruj masłem orzechowym Alesto.\n2. Ułóż cienkie plasterki jabłka Gala i posyp cynamonem.\n3. Czas: 5 minut.",
        "ingredients": [
            [
                "Wafle ryżowe naturalne Good Food",
                30
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                20
            ],
            [
                "Jabłka polskie Gala Biedronka",
                70
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Koktajl z tofu Vemondo, banana i truskawek",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Tofu bio, banana, truskawki mrożone i napój migdałowy zblenduj na kremowy shake.\n2. Roślinny zastrzyk białka w 8 minut!",
        "ingredients": [
            [
                "Tofu naturalne bio Vemondo",
                90
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                100
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                150
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Ekspresowy wrap pełnoziarnisty z szynką z indyka i świeżymi warzywami",
        "category": "Obiad",
        "prep_time": 5,
        "instructions": "1. Placek tortilli pełnoziarnistej posmaruj jogurtem naturalnym wymieszanym z ziołami.\n2. Wyłóż plastry chudej szynki z indyka, szpinak baby i pokrojone pomidorki.\n3. Zawiń w rulon i przekrój. Błyskawiczny obiad w 5 minut bez gotowania!",
        "ingredients": [
            [
                "Tortilla pełnoziarnista Biedronka",
                65
            ],
            [
                "Szynka z piersi indyka Kraina Wędlin",
                100
            ],
            [
                "Jogurt naturalny gęsty Pilos",
                50
            ],
            [
                "Pomidorki koktajlowe Ryneczek Lidla",
                80
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                30
            ]
        ],
        "image_type": "salad"
    },
    {
        "title": "Sałatka śródziemnomorska z tuńczykiem, jajkiem i pomidorkami",
        "category": "Obiad",
        "prep_time": 8,
        "instructions": "1. Do miski wsyp świeży szpinak baby i przekrojone pomidorki koktajlowe.\n2. Dodaj odsączonego tuńczyka w kawałkach i połówki ugotowanego jaja.\n3. Skrop oliwą z oliwek, podawaj z chlebem żytnim. Szybki obiad w 8 minut.",
        "ingredients": [
            [
                "Tuńczyk w sosie własnym Marinero",
                130
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                40
            ],
            [
                "Pomidorki koktajlowe Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                60
            ]
        ],
        "image_type": "salad"
    },
    {
        "title": "Ekspresowy kuskus z ciecierzycą, suszonymi pomidorami i twarogiem",
        "category": "Obiad",
        "prep_time": 5,
        "instructions": "1. Ciecierzycę ze słoika odsącz na sitku i przepłucz wodą.\n2. Połącz z chudym twarogiem, pomidorkami i odrobiną oliwy z oliwek.\n3. Całość dopraw ziołami. Zdrowy obiad bogaty w białko i błonnik w 5 minut bez gotowania!",
        "ingredients": [
            [
                "Ciecierzyca w słoiku Culinea",
                160
            ],
            [
                "Twaróg chudy Pilos",
                90
            ],
            [
                "Pomidorki koktajlowe Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                50
            ]
        ],
        "image_type": "salad"
    },
    {
        "title": "Sałatka z łososiem wędzonym, ogórkiem i chlebkiem żytnim",
        "category": "Obiad",
        "prep_time": 5,
        "instructions": "1. Na talerzu ułóż świeży szpinak baby i plastry zielonego ogórka.\n2. Dodaj kawałki wędzonego na gorąco łososia i skrop oliwą z oliwek.\n3. Podawaj z chlebem żytnim 100%. Pyszny obiad bez włączania kuchenki w 5 minut.",
        "ingredients": [
            [
                "Łosoś wędzony na gorąco Marinero",
                100
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                40
            ],
            [
                "Ogórek zielony szklarniowy Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                60
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Ekspresowy wrap z tuńczykiem, warzywami i sosem jogurtowym",
        "category": "Obiad",
        "prep_time": 5,
        "instructions": "1. Placek tortilli posmaruj sosem jogurtowym.\n2. Nałóż odsączonego tuńczyka, szpinak baby i pomidorki.\n3. Zwiń i zjedz od razu lub zabierz do pracy. 5 minut przygotowania, 0 minut gotowania.",
        "ingredients": [
            [
                "Tortilla pełnoziarnista Biedronka",
                65
            ],
            [
                "Tuńczyk w sosie własnym Marinero",
                120
            ],
            [
                "Jogurt naturalny gęsty Pilos",
                40
            ],
            [
                "Pomidorki koktajlowe Ryneczek Lidla",
                70
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                30
            ]
        ],
        "image_type": "salad"
    },
    {
        "title": "Power Bowl z ciecierzycą, chudą szynką z kurczaka i warzywami",
        "category": "Obiad",
        "prep_time": 5,
        "instructions": "1. Do miski wsyp odsączoną ciecierzycę ze słoika.\n2. Dodaj pokrojoną w paski szynkę z piersi kurczaka Pikok Pure, ogórka i pomidorki.\n3. Skrop oliwą z oliwek. Sycący obiad w 5 minut bez stania przy garnkach.",
        "ingredients": [
            [
                "Ciecierzyca w słoiku Culinea",
                160
            ],
            [
                "Szynka z piersi kurczaka Pikok Pure",
                90
            ],
            [
                "Pomidorki koktajlowe Ryneczek Lidla",
                100
            ],
            [
                "Ogórek zielony szklarniowy Ryneczek Lidla",
                80
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "salad"
    },
    {
        "title": "Kanapki obiadowe z pastą z tuńczyka, twarogu chudego i rzodkiewki",
        "category": "Obiad",
        "prep_time": 5,
        "instructions": "1. Odsączonego tuńczyka rozgnieć widelcem z chudym twarogiem i łyżką gęstego jogurtu.\n2. Posmaruj pastą kromki chleba żytniego 100%.\n3. Udekoruj plastrami ogórka. Gotowe w 5 minut!",
        "ingredients": [
            [
                "Chleb żytni 100% z pieca Lidla",
                100
            ],
            [
                "Tuńczyk w sosie własnym Marinero",
                110
            ],
            [
                "Twaróg chudy Pilos",
                80
            ],
            [
                "Jogurt naturalny gęsty Pilos",
                30
            ],
            [
                "Ogórek zielony szklarniowy Ryneczek Lidla",
                60
            ]
        ],
        "image_type": "salad"
    },
    {
        "title": "Pieczona pierś z kurczaka z ryżem basmati i warzywami",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Pierś z kurczaka przypraw ziołami prowansalskimi i upiecz w 190°C (20 minut).\n2. Ugotuj ryż basmati (10 minut).\n3. Podduś warzywa Freshona na oliwie.\n4. Czas: 30 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka Rzeźnik",
                180
            ],
            [
                "Ryż basmati Golden Sun",
                60
            ],
            [
                "Warzywa na patelnię klasyczne Freshona",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Penne pełnoziarniste z sosem bolońskim z chudego indyka",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Makaron penne ugotuj al dente (10 minut).\n2. Na oliwie podsmaż mięso mielone z indyka z czosnkiem i solą.\n3. Dodaj krojone pomidory i duś 12 minut.\n4. Czas wykonania to 25 minut.",
        "ingredients": [
            [
                "Mięso mielone z piersi indyka Biedronka",
                160
            ],
            [
                "Makaron pełnoziarnisty penne Combino",
                70
            ],
            [
                "Pomidory krojone w puszce Freshona",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "pasta"
    },
    {
        "title": "Pieczony dorsz atlantycki w ziołach z kaszą gryczaną",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Filet z dorsza oprósz solą, skrop sokiem z cytryny i oliwą, piecz 15 minut w 180°C.\n2. Ugotuj kaszę gryczaną prażoną (15 minut).\n3. Podawaj z sałatką z pomidora.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                200
            ],
            [
                "Kasza gryczana prażona Kuchnia Lidla",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                100
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Stek z łososia pieczony na parze z kaszą jaglaną",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Łososia i szpinak baby ugotuj na parze przez 12-14 minut.\n2. Kaszę jaglaną ugotuj na sypko.\n3. Danie gotowe w 25 minut.\n4. Pełne kwasów Omega-3.",
        "ingredients": [
            [
                "Łosoś atlantycki filet świeży Lidl",
                150
            ],
            [
                "Kasza jaglana Plony Natury",
                50
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                60
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                80
            ]
        ],
        "image_type": "salmon"
    },
    {
        "title": "Fit Stir-Fry z tofu Vemondo i warzywami na patelnię",
        "category": "Obiad",
        "prep_time": 20,
        "instructions": "1. Tofu pokrój w kostkę i podsmaż na złoto na oliwie.\n2. Wsyp warzywa Freshona i duś pod przykryciem 8 minut.\n3. Podawaj z ryżem basmati.\n4. Czas: 20 minut.",
        "ingredients": [
            [
                "Tofu naturalne bio Vemondo",
                160
            ],
            [
                "Ryż basmati Golden Sun",
                60
            ],
            [
                "Warzywa na patelnię klasyczne Freshona",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "salad_bowl"
    },
    {
        "title": "Gulasz z indyka z warzywami i kaszą gryczaną",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Polędwiczki z indyka pokrój w kostkę i podsmaż na oliwie.\n2. Dodaj krojone pomidory, liść laurowy i duś 18 minut.\n3. Podawaj z ugotowaną kaszą gryczaną.\n4. Czas: 30 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                180
            ],
            [
                "Kasza gryczana prażona Kuchnia Lidla",
                60
            ],
            [
                "Pomidory krojone w puszce Freshona",
                140
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Dorsz pieczony w papilotach z batatami i cukinią",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Bataty pokrój w plastry i piecz w 200°C przez 15 minut.\n2. Dorsz zawinięty w pergamin z cukinią i oliwą dołóż do piekarnika na kolejne 15 minut.\n3. Łączny czas: 30 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                180
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                160
            ],
            [
                "Cukinia świeża Biedronka",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Pierś z kurczaka K-Purland z kaszą gryczaną i warzywami K-Classic",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Pierś z kurczaka upiecz w piekarniku z ziołami (20 minut).\n2. Ugotuj kaszę gryczaną K-Classic (15 minut).\n3. Podduś warzywa na patelnię K-Classic.\n4. Czas: 30 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka K-Purland",
                180
            ],
            [
                "Kasza gryczana prażona K-Classic",
                60
            ],
            [
                "Warzywa na patelnię klasyczne K-Classic",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Penne z kurczakiem, szpinakiem i sosem pomidorowym",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Makaron penne ugotuj al dente.\n2. Pierś z kurczaka podsmaż na oliwie, dodaj świeży szpinak baby i pomidory krojone Freshona.\n3. Połącz z makaronem.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka świeża Biedronka",
                160
            ],
            [
                "Makaron pełnoziarnisty penne Combino",
                70
            ],
            [
                "Pomidory krojone w puszce Freshona",
                150
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "pasta"
    },
    {
        "title": "Pulpety z indyka z sosem pomidorowym i ryżem brązowym",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Mięso mielone z indyka wymieszaj z białkiem jaja i ziołami, uformuj pulpety.\n2. Gotuj w sosie ze zblendowanych pomidorów przez 16 minut.\n3. Podawaj z ryżem brązowym Plony Natury.\n4. Czas: 30 minut.",
        "ingredients": [
            [
                "Mięso mielone z piersi indyka Biedronka",
                160
            ],
            [
                "Pomidory krojone w puszce Freshona",
                180
            ],
            [
                "Ryż brązowy Plony Natury",
                60
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Łosoś pieczony z batatami i szpinakiem baby Kaufland",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Filet z łososia Kaufland i pokrojone bataty ułóż na blaszce, skrop oliwą K-Bio i piecz 20 minut w 190°C.\n2. Szpinak baby podsmaż lekko na patelni.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Łosoś atlantycki świeży filet Kaufland",
                150
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                160
            ],
            [
                "Szpinak baby K-Bio Kaufland",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                6
            ]
        ],
        "image_type": "salmon"
    },
    {
        "title": "Curry z ciecierzycą, warzywami i ryżem basmati",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Na oliwie podsmaż warzywa Freshona, dodaj ciecierzycę ze słoika i krojone pomidory.\n2. Dopraw curry i duś 12 minut.\n3. Podawaj z ugotowanym ryżem basmati.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Ciecierzyca w słoiku Culinea",
                120
            ],
            [
                "Pomidory krojone w puszce Freshona",
                160
            ],
            [
                "Warzywa na patelnię klasyczne Freshona",
                120
            ],
            [
                "Ryż basmati Golden Sun",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "curry"
    },
    {
        "title": "Filet z kurczaka Carrefour z makaronem penne i cukinią",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Pierś z kurczaka i cukinię pokrój w kostkę i podsmaż na oliwie Carrefour Classic.\n2. Makaron penne Carrefour Bio ugotuj al dente i połącz z kurczakiem.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka Carrefour Jakość z Natury",
                170
            ],
            [
                "Makaron pełnoziarnisty penne Carrefour Bio",
                65
            ],
            [
                "Cukinia świeża Biedronka",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                8
            ]
        ],
        "image_type": "pasta"
    },
    {
        "title": "Dorsz duszony w pomidorach z kaszą jaglaną",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Filet z dorsza duś na patelni z krojonymi pomidorami i oregano przez 12 minut.\n2. Równolegle ugotuj kaszę jaglaną na sypko.\n3. Danie gotowe w 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                190
            ],
            [
                "Pomidory krojone w puszce Freshona",
                160
            ],
            [
                "Kasza jaglana Plony Natury",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Polędwiczki z indyka z puree ziemniaczanym i gotowaną marchewką",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Ziemniaki i marchew ugotuj w osolonej wodzie (18 minut), utłucz z odrobiną oliwy.\n2. Polędwiczki z indyka upiecz w rękawie w 180°C (18 minut).\n3. Czas: 30 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                180
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Chili sin carne z tofu Vemondo i czerwoną fasolą",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Tofu pokrusz widelcem i podsmaż na oliwie z przyprawami.\n2. Dodaj czerwoną fasolę ze słoika i krojone pomidory, duś 12 minut.\n3. Podawaj z ryżem basmati.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Tofu naturalne bio Vemondo",
                140
            ],
            [
                "Fasola czerwona Nasze Smaki",
                100
            ],
            [
                "Pomidory krojone w puszce Freshona",
                160
            ],
            [
                "Ryż basmati Golden Sun",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "curry"
    },
    {
        "title": "Pieczona pierś z kurczaka z purée z batatów i szpinakiem",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Bataty ugotuj i ugnieć na gładkie purée.\n2. Pierś z kurczaka upiecz na patelni grillowej (12 minut).\n3. Szpinak baby podduś na łyżeczce oliwy.\n4. Czas przygotowania: 30 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka świeża Biedronka",
                180
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                180
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Risotto z indykiem, cukinią i pomidorami malinowymi",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Na oliwie podsmaż pokrojonego indyka i plasterki cukinii.\n2. Dodaj biały ryż i stopniowo podlewaj wywarem, gotując 15 minut.\n3. Na koniec wmieszaj pomidory malinowe.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka K-Purland",
                170
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                65
            ],
            [
                "Cukinia świeża Biedronka",
                100
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                80
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Kotlety z tuńczyka i twarogu z kaszą gryczaną",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Odsączonego tuńczyka wymieszaj z twarogiem chudym, jajkiem i ziołami, uformuj kotleciki.\n2. Piecz w 190°C przez 15 minut.\n3. Podawaj z kaszą gryczaną prażoną.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Tuńczyk w sosie własnym Marinero",
                120
            ],
            [
                "Twaróg chudy Pilos",
                80
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Kasza gryczana prażona Kuchnia Lidla",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                5
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Dorsz z patelni z warzywami na patelnię Carrefour",
        "category": "Obiad",
        "prep_time": 20,
        "instructions": "1. Na oliwie podduś mrożone warzywa Carrefour Classic przez 8 minut.\n2. Dołóż pokrojony filet z dorsza Carrefour i duś pod przykryciem 8 minut.\n3. Podawaj z ryżem basmati.\n4. Czas: 20 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży filet Carrefour",
                190
            ],
            [
                "Warzywa na patelnię klasyczne Carrefour",
                180
            ],
            [
                "Ryż basmati Carrefour Extra",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                8
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Pieczone udka z kurczaka bez skóry z ziemniakami i marchewką",
        "category": "Obiad",
        "prep_time": 35,
        "instructions": "1. Ziemniaki i marchewkę pokrój w słupki, wymieszaj z oliwą i ziołami.\n2. Mięso z piersi kurczaka i warzywa piecz w 200°C przez 25 minut.\n3. Czas: 35 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka Rzeźnik",
                180
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Fit bolognese z tofu Vemondo i makaronem penne",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Tofu zetrzyj na tarce o grubych oczkach i podsmaż na oliwie z czosnkiem i oregano.\n2. Dodaj pomidory krojone Freshona i duś 12 minut.\n3. Wymieszaj z penne pełnoziarnistym Combino.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Tofu naturalne bio Vemondo",
                150
            ],
            [
                "Pomidory krojone w puszce Freshona",
                180
            ],
            [
                "Makaron pełnoziarnisty penne Combino",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "pasta"
    },
    {
        "title": "Łosoś pieczony w ziołach z purée ziemniaczanym i pomidorkami",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Filet z łososia piecz w pergaminie przez 15 minut w 180°C.\n2. Ziemniaki ugotuj i utłucz na gładkie purée.\n3. Podawaj ze świeżym pomidorem malinowym.\n4. Czas: 30 minut.",
        "ingredients": [
            [
                "Łosoś atlantycki filet świeży Lidl",
                150
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                90
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "salmon"
    },
    {
        "title": "Pierś z indyka duszona w cukinii i pomidorach z ryżem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Indyk pokrój w paski, podsmaż na oliwie, dodaj pokrojoną cukinię i pomidory w puszce.\n2. Duś 14 minut na małym ogniu.\n3. Podawaj z ryżem basmati.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                180
            ],
            [
                "Cukinia świeża Biedronka",
                120
            ],
            [
                "Pomidory krojone w puszce Freshona",
                140
            ],
            [
                "Ryż basmati Golden Sun",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Dorsz pieczony z dynią i kaszą gryczaną K-Classic",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Dynię pokrój w kostkę i podpiecz w piekarniku (15 minut).\n2. Dołóż dorsza Kaufland skropionego oliwą i piecz kolejne 12 minut.\n3. Podawaj z kaszą gryczaną K-Classic.\n4. Czas: 30 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki filet świeży Kaufland",
                190
            ],
            [
                "Dynia świeża krojona Biedronka",
                150
            ],
            [
                "Kasza gryczana prażona K-Classic",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                8
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Makaron penne z tuńczykiem, pomidorami i szpinakiem baby",
        "category": "Obiad",
        "prep_time": 20,
        "instructions": "1. Ugotuj penne al dente.\n2. Na patelni podgrzej pomidory w puszce, wrzuć odsączonego tuńczyka Marinero i liście szpinaku baby.\n3. Połącz z makaronem.\n4. Czas: 20 minut.",
        "ingredients": [
            [
                "Makaron pełnoziarnisty penne Combino",
                70
            ],
            [
                "Tuńczyk w sosie własnym Marinero",
                100
            ],
            [
                "Pomidory krojone w puszce Freshona",
                150
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "pasta"
    },
    {
        "title": "Gulasz drobiowy z warzywami na patelnię i kaszą jaglaną",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Pierś z kurczaka pokrój w kostkę i podsmaż na oliwie.\n2. Dodaj warzywa klasyczne Freshona i 50 ml wody, duś 12 minut.\n3. Serwuj z ugotowaną kaszą jaglaną.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka świeża Biedronka",
                170
            ],
            [
                "Warzywa na patelnię klasyczne Freshona",
                160
            ],
            [
                "Kasza jaglana Plony Natury",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Indyk pieczony z batatami i świeżym szpinakiem Carrefour",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Bataty pokrój w słupki, indyka w plastry, ułóż na blaszce z oliwą i piecz 20 minut w 190°C.\n2. Podawaj ze świeżym szpinakiem baby Carrefour Bio.\n3. Czas: 30 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Carrefour",
                180
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                160
            ],
            [
                "Szpinak baby Carrefour Bio",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Zupa krem dyniowa z pieczoną piersią z kurczaka",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Dynię i marchewkę ugotuj do miękkości z solą (15 minut) i zblenduj na krem z oliwą.\n2. Pierś z kurczaka upiecz na patelni i pokrój w paski na wierzch zupy.\n3. Czas: 30 minut.",
        "ingredients": [
            [
                "Dynia świeża krojona Biedronka",
                200
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Pierś z kurczaka Rzeźnik",
                150
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Lekkie pulpety z kurczaka w sosie koperkowym z ryżem basmati",
        "category": "Obiad",
        "prep_time": 28,
        "instructions": "1. Z mielonego mięsa uformuj małe kulki i ugotuj w bulionie warzywnym (12 minut).\n2. Dodaj jogurt naturalny i świeży koperek, zagęszczając sos.\n3. Podawaj z ryżem basmati.\n4. Czas: 28 minut.",
        "ingredients": [
            [
                "Mięso mielone z piersi indyka Biedronka",
                160
            ],
            [
                "Ryż basmati Golden Sun",
                60
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Deser proteinowy: Skyr z masłem orzechowym i malinami",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 5,
        "instructions": "1. Do pucharka przełóż skyr naturalny Pilos.\n2. Dodaj masło orzechowe 100% Alesto i maliny.\n3. Błyskawiczny deser gotowy w 5 minut!",
        "ingredients": [
            [
                "Skyr naturalny Pilos",
                150
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                15
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                60
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Chrupiące słupki ogórka z pastą twarogową",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 8,
        "instructions": "1. Twaróg chudy utrzyj widelcem z tuńczykiem i pieprzem.\n2. Ogórka pokrój w grube słupki do maczania.\n3. Czas przygotowania: 8 minut.",
        "ingredients": [
            [
                "Twaróg chudy Pilos",
                100
            ],
            [
                "Tuńczyk w sosie własnym Marinero",
                60
            ],
            [
                "Ogórek zielony świeży Biedronka",
                100
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Kefir Mleczna Dolina z orzechami włoskimi i cynamonem",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 5,
        "instructions": "1. Do kubka wlej naturalny kefir, wsyp posiekane orzechy włoskie i cynamon.\n2. Gotowe w 5 minut.",
        "ingredients": [
            [
                "Kefir naturalny Mleczna Dolina",
                250
            ],
            [
                "Orzechy włoskie Biedronka",
                20
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Pieczone jabłko z cynamonem i orzechami włoskimi",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 18,
        "instructions": "1. Jabłko wydrąż, posyp cynamonem i posiekanymi orzechami włoskimi.\n2. Piecz w 180°C przez 14 minut do miękkości.\n3. Czas: 18 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                150
            ],
            [
                "Orzechy włoskie Biedronka",
                15
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Skyr waniliowy K-Classic z borówkami i chia",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 5,
        "instructions": "1. W miseczce wymieszaj skyr waniliowy K-Classic z borówkami i nasionami chia.\n2. Czas: 5 minut.",
        "ingredients": [
            [
                "Skyr waniliowy K-Classic",
                150
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                60
            ],
            [
                "Nasiona chia Vitanella",
                10
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Mus bananowo-truskawkowy z waflami ryżowymi",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 8,
        "instructions": "1. Zblenduj banana z truskawkami mrożonymi na gęsty mus owocowy.\n2. Podawaj z chrupkimi waflami ryżowymi Good Food.\n3. Czas: 8 minut.",
        "ingredients": [
            [
                "Banan świeży Ryneczek Lidla",
                90
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                80
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Serek wiejski z cynamonem i plastrami jabłka Gala",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 5,
        "instructions": "1. Serek wiejski lekki Delikate oprósz cynamonem i podaj z chrupiącymi plasterkami jabłka.\n2. Czas: 5 minut.",
        "ingredients": [
            [
                "Serek wiejski lekki Delikate",
                180
            ],
            [
                "Jabłka polskie Gala Biedronka",
                100
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Smoothie truskawkowo-migdałowe z nasionami chia",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 6,
        "instructions": "1. Napój migdałowy Vemondo zblenduj z truskawkami i nasionami chia na gładki koktajl.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Napój migdałowy bez cukru Vemondo",
                200
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                120
            ],
            [
                "Nasiona chia Vitanella",
                10
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Deser twarogowy ze skyrem i musem malinowym Carrefour",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 8,
        "instructions": "1. Twaróg chudy Carrefour Classic utrzyj ze skyrem na gładką masę.\n2. Polej zblendowanymi malinami.\n3. Przygotujesz w 8 minut.",
        "ingredients": [
            [
                "Twaróg chudy Carrefour Classic",
                100
            ],
            [
                "Skyr naturalny Carrefour Classic",
                60
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                60
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Fit batoniki domowe z płatków owsianych i masła orzechowego",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 15,
        "instructions": "1. Płatki owsiane wymieszaj z masłem orzechowym Alesto i bananem rozgniecionym na miazgę.\n2. Uformuj batoniki i schłodź w lodówce lub zapiecz 10 minut w 180°C.\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Płatki owsiane górskie Crownfield",
                40
            ],
            [
                "Masło orzechowe 100% orzechów Alesto",
                20
            ],
            [
                "Banan świeży Ryneczek Lidla",
                70
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Sałatka fit z grillowaną piersią z kurczaka i sosem jogurtowym",
        "category": "Kolacja",
        "prep_time": 20,
        "instructions": "1. Pierś z kurczaka upiecz na patelni grillowej (8 minut) i pokrój w paski.\n2. Szpinak baby ułóż w misce z pomidorem malinowym.\n3. Polej sosem z jogurtu naturalnego i czosnku.\n4. Czas: 20 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka Rzeźnik",
                150
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                60
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                40
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                50
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                80
            ]
        ],
        "image_type": "salad_bowl"
    },
    {
        "title": "Twarożek na słono z rzodkiewką i chlebem graham",
        "category": "Kolacja",
        "prep_time": 10,
        "instructions": "1. Twaróg chudy Delikate połącz z jogurtem naturalnym i ogórkiem pokrojonym w kostkę.\n2. Dopraw pieprzem i zjedz z chlebem graham.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Twaróg chudy klinek Delikate",
                140
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                40
            ],
            [
                "Chleb graham krojony Biedronka",
                60
            ],
            [
                "Ogórek zielony świeży Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Krem pomidorowy z mozzarellą light i grzankami",
        "category": "Kolacja",
        "prep_time": 18,
        "instructions": "1. Pomidory w puszce Freshona zagotuj z bazylią i oliwą, zblenduj na gładko.\n2. Kromkę chleba żytniego pokrój w kostkę i podpiecz na chrupkie grzanki.\n3. Do zupy wrzuć pokrojoną mozzarellę light.\n4. Czas: 18 minut.",
        "ingredients": [
            [
                "Pomidory krojone w puszce Freshona",
                250
            ],
            [
                "Mozzarella light Lovilio Lidl",
                50
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Omlet warzywny z cukinią i pomidorem malinowym",
        "category": "Kolacja",
        "prep_time": 15,
        "instructions": "1. Cukinię zetrzyj na tarce i podsmaż na oliwie przez 3 minuty z pokrojonym pomidorem.\n2. Zalej roztrzepanymi jajkami ściółkowymi i smaż pod przykryciem do ścięcia (5 minut).\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Cukinia świeża Biedronka",
                80
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                5
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Sałatka z wędzonym łososiem, ogórkiem i chlebem graham",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Szpinak baby ułóż w salaterce, dodaj kawałki łososia wędzonego Marinero i plastry ogórka.\n2. Skrop oliwą i zjedz z kromką chleba graham.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Łosoś wędzony na gorąco Marinero",
                70
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                40
            ],
            [
                "Ogórek zielony świeży Biedronka",
                60
            ],
            [
                "Chleb graham krojony Biedronka",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "salad_bowl"
    },
    {
        "title": "Aksamitny krem z cukinii z grzankami żytnimi Kaufland",
        "category": "Kolacja",
        "prep_time": 20,
        "instructions": "1. Cukinię i ziemniaka ugotuj w osolonej wodzie (12 minut) i zblenduj z oliwą K-Bio.\n2. Chleb żytni Kaufland pokrój i podpiecz na chrupkie grzanki.\n3. Czas: 20 minut.",
        "ingredients": [
            [
                "Cukinia świeża Biedronka",
                160
            ],
            [
                "Ziemniaki polskie Biedronka",
                100
            ],
            [
                "Chleb żytni 100% Kaufland Piekarnia",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Pasta jajeczna z tuńczykiem na chlebie graham Carrefour",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Jajko ugotowane na twardo rozgnieć z tuńczykiem w sosie własnym i łyżką jogurtu.\n2. Nałóż na kromki chleba graham Carrefour Piekarnia.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Carrefour Classic",
                60
            ],
            [
                "Tuńczyk kawałki w sosie własnym Carrefour",
                70
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                25
            ],
            [
                "Chleb graham krojony Carrefour Piekarnia",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Zapiekanka warzywna z mozzarellą light i pomidorami",
        "category": "Kolacja",
        "prep_time": 25,
        "instructions": "1. Cukinię i pomidora pokrój w plastry, ułóż w naczyniu żaroodpornym, oprósz oregano i solą.\n2. Posyp mozzarellą light Lovilio i zapiecz w 190°C przez 18 minut.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Cukinia świeża Biedronka",
                140
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                100
            ],
            [
                "Mozzarella light Lovilio Lidl",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "salad_bowl"
    },
    {
        "title": "Kanapki z szynką z indyka K-Purland, jajkiem i ogórkiem",
        "category": "Kolacja",
        "prep_time": 10,
        "instructions": "1. Chleb żytni Kaufland obłóż szynką z indyka K-Purland, plastrami ugotowanego jajka i ogórka.\n2. Pyszna i lekka kolacja w 10 minut.",
        "ingredients": [
            [
                "Chleb żytni 100% Kaufland Piekarnia",
                60
            ],
            [
                "Szynka z piersi indyka K-Purland",
                50
            ],
            [
                "Jaja ściółkowe klasa M K-Classic",
                60
            ],
            [
                "Ogórek zielony świeży Biedronka",
                50
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Sałatka grecka w wersji fit z tofu bio Vemondo",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Tofu bio pokrój w kostkę i zamarynuj w oliwie z oregano.\n2. Połącz z pokrojonym pomidorem, ogórkiem i liśćmi szpinaku baby.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Tofu naturalne bio Vemondo",
                120
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                80
            ],
            [
                "Ogórek zielony świeży Biedronka",
                60
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                30
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "salad_bowl"
    },
    {
        "title": "Twaróg chudy z pomidorem malinowym i oliwą z oliwek",
        "category": "Kolacja",
        "prep_time": 8,
        "instructions": "1. Twaróg chudy Pilos rozgnieć lekko widelcem z pokrojonym w kostkę pomidorem malinowym i oliwą.\n2. Czas: 8 minut.\n3. Podawaj z pieczywem żytnim.",
        "ingredients": [
            [
                "Twaróg chudy Pilos",
                140
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                50
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Zupa krem z pieczonych pomidorów z grzankami i bazylią",
        "category": "Kolacja",
        "prep_time": 20,
        "instructions": "1. Pomidory w puszce Freshona zagotuj z czosnkiem i oliwą, zblenduj na krem.\n2. Podawaj z chrupiącymi grzankami z chleba żytniego.\n3. Czas: 20 minut.",
        "ingredients": [
            [
                "Pomidory krojone w puszce Freshona",
                260
            ],
            [
                "Chleb żytni 100% z pieca Lidla",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Jajka w koszulce na szpinaku z pieczywem graham",
        "category": "Kolacja",
        "prep_time": 15,
        "instructions": "1. Szpinak baby podsmaż na oliwie przez 2 minuty.\n2. W garnku z wrzątkiem zrób wir i wbij jajko, gotuj 3 minuty na miękko.\n3. Ułóż na szpinaku i kromce chleba graham.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Szpinak baby świeży Ryneczek Lidla",
                50
            ],
            [
                "Chleb graham krojony Biedronka",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Wrap z twarogiem, wędzonym łososiem i ogórkiem",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Tortillę posmaruj chudym twarogiem roztartym z odrobiną jogurtu.\n2. Ułóż łososia wędzonego i słupki ogórka, zwiń w rulon.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Tortilla pełnoziarnista Biedronka",
                60
            ],
            [
                "Twaróg chudy klinek Delikate",
                70
            ],
            [
                "Łosoś wędzony na gorąco Marinero",
                50
            ],
            [
                "Ogórek zielony świeży Biedronka",
                40
            ]
        ],
        "image_type": "wrap"
    },
    {
        "title": "Lekki serek wiejski z rzodkiewką i chlebem pszennym tostowym",
        "category": "Kolacja",
        "prep_time": 8,
        "instructions": "1. Serek wiejski lekki połącz z posiekanym ogórkiem i pieprzem.\n2. Zjedz z opieczonym chlebem pszennym tostowym Biedronka.\n3. Czas: 8 minut.",
        "ingredients": [
            [
                "Serek wiejski lekki Delikate",
                180
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                50
            ],
            [
                "Ogórek zielony świeży Biedronka",
                50
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Delikatna owsianka na wodzie z duszonym jabłkiem i cynamonem",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Jabłko obierz ze skórki, pokrój w kostkę i podduś z wodą i cynamonem na miękko.\n2. Płatki owsiane ugotuj na wodzie na miękki kleik (7 minut).\n3. Połącz z jabłkiem i skyrem naturalnym.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Płatki owsiane górskie Crownfield",
                50
            ],
            [
                "Jabłka polskie Gala Biedronka",
                120
            ],
            [
                "Skyr naturalny Pilos",
                80
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Jajecznica na parze z chlebem pszennym i masłem",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Jaja ściółkowe wbij do miski z łyżką wody i solą, roztrzep.\n2. Postaw miskę nad kąpielą wodną i mieszaj delikatnie szpatułką do aksamitnego ścięcia.\n3. Czas: 12 minut.\n4. Podawaj z chlebem pszennym.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Jaglanka na napoju migdałowym ze skyrem i miękkim bananem",
        "category": "Śniadanie",
        "prep_time": 18,
        "instructions": "1. Kaszę jaglaną przepłucz wrzątkiem, ugotuj w napoju migdałowym na miękko (12 minut).\n2. Wymieszaj ze skyrem i zgniecionym bananem.\n3. Czas: 18 minut.",
        "ingredients": [
            [
                "Kasza jaglana Plony Natury",
                50
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                150
            ],
            [
                "Skyr naturalny Pilos",
                100
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Kasza manna na gęsto z musem truskawkowym bez pestek",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Kaszę mannę Crownfield ugotuj w napoju migdałowym na gęsty, delikatny krem.\n2. Truskawki podduś i przetrzyj przez sitko na gładki mus.\n3. Czas przygotowania: 12 minut.",
        "ingredients": [
            [
                "Kasza manna Crownfield",
                45
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                180
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                70
            ],
            [
                "Skyr naturalny Pilos",
                50
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Płatki ryżowe na wodzie ze skyrem waniliowym i pieczonym jabłkiem",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki ryżowe Plony Natury ugotuj na miękki kleik ryżowy (6 minut).\n2. Jabłko upiecz bez skórki i utłucz na gładki mus.\n3. Połącz ze skyrem waniliowym. Czas: 15 minut.",
        "ingredients": [
            [
                "Płatki ryżowe Plony Natury",
                45
            ],
            [
                "Jabłka polskie Gala Biedronka",
                100
            ],
            [
                "Skyr waniliowy Pilos",
                100
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Omlet biszkoptowy na parze z musem z przetartych malin",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Oddziel białko od żółtka, ubij pianę na sztywno, połącz delikatnie z żółtkiem.\n2. Wylej na parownicę i paruj 8 minut do ścięcia.\n3. Podawaj z przetartym musem malinowym. Czas: 15 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                60
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                40
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Delikatny twarożek ze słodkim bananem na pieczywie pszennym",
        "category": "Śniadanie",
        "prep_time": 8,
        "instructions": "1. Twaróg chudy Delikate rozgnieć z dojrzałym bananem i jogurtem naturalnym na aksamitną pastę.\n2. Posmaruj kromki chleba pszennego. Czas: 8 minut.",
        "ingredients": [
            [
                "Twaróg chudy klinek Delikate",
                100
            ],
            [
                "Banan świeży Ryneczek Lidla",
                70
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                30
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Jajko na miękko z chlebem pszennym i chudą szynką z kurczaka",
        "category": "Śniadanie",
        "prep_time": 10,
        "instructions": "1. Jajko ściółkowe gotuj dokładnie 4.5 minuty we wrzątku.\n2. Podawaj z miękkim chlebem pszennym tostowym i szynką z kurczaka Pikok Pure.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ],
            [
                "Szynka z piersi kurczaka Pikok Pure",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Pieczone jabłko z cynamonem i chudym twarożkiem",
        "category": "Drugie śniadanie",
        "prep_time": 20,
        "instructions": "1. Jabłko obierz, wydrąż gniazdo nasienne i upiecz w 180°C przez 15 minut.\n2. Twaróg utrzyj z jogurtem i napełnij upieczone jabłko.\n3. Czas: 20 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                150
            ],
            [
                "Twaróg chudy klinek Delikate",
                100
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                30
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Lekki serek wiejski z dojrzałym bananem i waflami ryżowymi",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Serek wiejski lekki wymieszaj z plasterkami dojrzałego banana.\n2. Podawaj z chrupkimi waflami ryżowymi Good Food.\n3. Czas: 8 minut.",
        "ingredients": [
            [
                "Serek wiejski lekki Delikate",
                180
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                30
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Aksamitny mus bananowo-jagodowy z kleikiem ryżowym",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Dojrzałego banana i borówki amerykańskie zblenduj na gładko.\n2. Połącz z delikatnymi waflami ryżowymi.\n3. Czas przygotowania: 10 minut.",
        "ingredients": [
            [
                "Banan świeży Ryneczek Lidla",
                100
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                60
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                25
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Jogurt naturalny gęsty z puree z pieczonej dyni",
        "category": "Drugie śniadanie",
        "prep_time": 12,
        "instructions": "1. Dynię ugotuj lub upiecz na miękko i rozgnieć na gładkie puree.\n2. Wymieszaj z jogurtem naturalnym Mleczna Dolina i szczyptą cynamonu.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Dynia świeża krojona Biedronka",
                120
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                140
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Serek wiejski K-Classic z musem ze słodkiego jabłka",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Jabłko Gala obierz i zetrzyj na najdrobniejszych oczkach tarki.\n2. Połącz z serkiem wiejskim lekkim K-Classic.\n3. Czas przygotowania: 10 minut.",
        "ingredients": [
            [
                "Serek wiejski lekki K-Classic",
                180
            ],
            [
                "Jabłka polskie Gala Biedronka",
                100
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Kromka chleba pszennego z pastą z białek jaj i twarogu",
        "category": "Drugie śniadanie",
        "prep_time": 12,
        "instructions": "1. Jajko ugotuj na twardo, wyjmij żółtko, a białko zblenduj z twarogiem chudym i łyżką jogurtu.\n2. Posmaruj pieczywo pszenne.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Twaróg chudy Pilos",
                70
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                20
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                50
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Kisiel z przetartych malin ze skyrem waniliowym",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Maliny przetrzyj przez sitko, zagotuj ze 100 ml wody i zagęść mąką ziemniaczaną.\n2. Podawaj z łyżką skyru waniliowego.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Maliny mrożone Mroźna Kraina",
                80
            ],
            [
                "Skyr waniliowy Pilos",
                80
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Filet z indyka gotowany na parze z purée ziemniaczano-marchewkowym",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Polędwiczki z indyka paruj przez 15 minut z majerankiem.\n2. Ziemniaki i marchewkę ugotuj i utłucz z oliwą na puszyste puree.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                180
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Dorsz duszony w koperku z ryżem białym i gotowaną cukinią",
        "category": "Obiad",
        "prep_time": 20,
        "instructions": "1. Filet z dorsza duś pod przykryciem w 50 ml wody z koperkiem przez 10 minut.\n2. Ryż biały ugotuj na miękko.\n3. Cukinię obraną ze skórki ugotuj na parze.\n4. Czas: 20 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                190
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Cukinia świeża Biedronka",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Pulpety z indyka w łagodnym sosie z gotowanym ryżem",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Mięso mielone z indyka połącz z białkiem jaja, uformuj pulpeciki i gotuj w lekkim wywarze 15 minut.\n2. Podawaj z gotowanym ryżem i marchewką.\n3. Czas: 30 minut.",
        "ingredients": [
            [
                "Mięso mielone z piersi indyka Biedronka",
                160
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Gotowany filet z kurczaka z kaszą jaglaną i duszonym jabłkiem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Pierś z kurczaka ugotuj w wodzie z solą (15 minut).\n2. Kaszę jaglaną ugotuj na sypko.\n3. Jabłko obierz i podduś na miękko z kropelką oliwy.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka świeża Biedronka",
                170
            ],
            [
                "Kasza jaglana Plony Natury",
                60
            ],
            [
                "Jabłka polskie Gala Biedronka",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Dorsz na parze z puree z dyni i białym ryżem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Dorsz atlantycki paruj przez 12 minut.\n2. Dynię ugotuj do miękkości i utłucz na gładkie puree z oliwą.\n3. Podawaj z miękkim ryżem białym.\n4. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży filet Carrefour",
                180
            ],
            [
                "Dynia świeża krojona Biedronka",
                160
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                6
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Gotowane polędwiczki z indyka z purée z batatów",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Polędwiczki z indyka ugotuj na parze (14 minut).\n2. Bataty obierz, ugotuj na miękko i ugnieć na aksamitne puree z oliwą.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka K-Purland",
                180
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                6
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Pieczony filet z łososia w pergaminie z gotowaną marchewką i ryżem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Łososia zawiń w pergamin i piecz 15 minut w 180°C bez tłuszczu.\n2. Marchewkę ugotuj w plasterkach, ryż ugotuj na miękko.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Łosoś atlantycki świeży filet Kaufland",
                140
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                140
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ]
        ],
        "image_type": "salmon"
    },
    {
        "title": "Delikatne risotto z gotowanym kurczakiem i cukinią bez skórki",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Ugotuj ryż biały na miękko.\n2. Wymieszaj z pokrojoną ugotowaną piersią z kurczaka i duszoną cukinią bez skórki.\n3. Skrop oliwą z oliwek. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka Rzeźnik",
                160
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Cukinia świeża Biedronka",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Aksamitny gulasz z indyka duszony z marchewką i ziemniakami",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Indyk, marchew i ziemniaki pokrój w kostkę i duś pod przykryciem w wywarze warzywnym przez 20 minut.\n2. Dodaj oliwę z oliwek i szczyptę majeranku.\n3. Czas: 30 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                170
            ],
            [
                "Ziemniaki polskie Biedronka",
                160
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Dorsz zapiekany w folii z gotowanymi ziemniakami i koperkiem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Dorsz oprósz solą, zawiń w folię i piecz 15 minut w 180°C.\n2. Ziemniaki ugotuj w mundurkach, obierz i posyp koperkiem.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                190
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Mus z pieczonego jabłka z kleikiem z kaszy manny",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 15,
        "instructions": "1. Jabłko upiecz bez skórki i zblenduj na mus.\n2. Połącz z delikatną kaszą manną ugotowaną na wodzie.\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                130
            ],
            [
                "Kasza manna Crownfield",
                35
            ],
            [
                "Skyr naturalny Pilos",
                40
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Banan pieczony z cynamonem i jogurtem naturalnym",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 12,
        "instructions": "1. Dojrzałego banana zapiecz w skórce w 180°C przez 10 minut.\n2. Wyjmij miąższ, oprósz cynamonem i polej jogurtem naturalnym Mleczna Dolina.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Banan świeży Ryneczek Lidla",
                100
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                80
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Lekki kisiel żurawinowo-jagodowy z waflami ryżowymi",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 10,
        "instructions": "1. Borówki rozgnieć, zagotuj w wodzie i zagęść mąką ziemniaczaną na delikatny kisiel.\n2. Podawaj z chrupkimi waflami ryżowymi Good Food. Czas: 10 minut.",
        "ingredients": [
            [
                "Borówki amerykańskie Ryneczek Lidla",
                80
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                25
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Mus twarogowy ze słodkim bananem",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 6,
        "instructions": "1. Twaróg chudy zblenduj z dojrzałym bananem na aksamitny krem.\n2. Czas przygotowania: 6 minut.",
        "ingredients": [
            [
                "Twaróg chudy Pilos",
                100
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Gotowane purée jabłkowo-marchewkowe z biszkoptem",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 15,
        "instructions": "1. Jabłko i marchewkę ugotuj do miękkości i zblenduj na delikatną papkę.\n2. Zjedz z waflami ryżowymi.\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                100
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                80
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Kanapki z szynką z indyka, jajkiem na miękko i pomidorem bez skórki",
        "category": "Kolacja",
        "prep_time": 15,
        "instructions": "1. Jajko ugotuj na miękko (4.5 minuty).\n2. Pomidora sparz i zdejmij skórkę.\n3. Ułóż na chlebie pszennym z szynką z indyka Kraina Wędlin.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Chleb pszenny tostowy Biedronka",
                70
            ],
            [
                "Szynka z piersi indyka Kraina Wędlin",
                50
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Pomidory malinowe Warzywniak Biedronki",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Zupa krem z marchewki i ziemniaka z grzankami pszennymi",
        "category": "Kolacja",
        "prep_time": 25,
        "instructions": "1. Marchew i ziemniaki ugotuj w osolonej wodzie i zblenduj na krem z oliwą.\n2. Podawaj z podsuszonym chlebem pszennym tostowym.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Marchew świeża myta Ryneczek Lidla",
                180
            ],
            [
                "Ziemniaki polskie Biedronka",
                150
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Delikatna pasta jajeczna z koperkiem na chlebie pszennym",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Jaja ściółkowe ugotuj na twardo, rozgnieć z jogurtem naturalnym i koperkiem.\n2. Posmaruj kromki pieczywa pszennego tostowego. Czas: 12 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                30
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Aksamitny krem z dyni i cukinii bez skórki",
        "category": "Kolacja",
        "prep_time": 20,
        "instructions": "1. Dynię i cukinię ugotuj w 300 ml wody do miękkości (12 minut).\n2. Zmiksuj blenderem z oliwą z oliwek na aksamitną zupę krem.\n3. Czas: 20 minut.",
        "ingredients": [
            [
                "Dynia świeża krojona Biedronka",
                160
            ],
            [
                "Cukinia świeża Biedronka",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                40
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Twarożek z gotowaną marchewką i pieczywem pszennym",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Marchewkę ugotuj na miękko, zetrzyj na tarce i połącz z chudym twarogiem Delikate i jogurtem.\n2. Podawaj z chlebem pszennym tostowym. Czas: 12 minut.",
        "ingredients": [
            [
                "Twaróg chudy klinek Delikate",
                120
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                80
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                30
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Aksamitny koktajl bananowo-jagodowy na kefirze ze skyrem",
        "category": "Śniadanie",
        "prep_time": 8,
        "instructions": "1. Do blendera wlej kefir naturalny i skyr Pilos.\n2. Dodaj banana i borówki.\n3. Miksuj przez 90 sekund na jednolitą emulsję.\n4. Czas: 8 minut.",
        "ingredients": [
            [
                "Kefir naturalny Mleczna Dolina",
                200
            ],
            [
                "Skyr naturalny Pilos",
                100
            ],
            [
                "Banan świeży Ryneczek Lidla",
                100
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                50
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Płynny kleik jaglano-migdałowy z musem malinowym",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Kaszę jaglaną ugotuj do pełnego rozklejenia (12 minut).\n2. Zblenduj z napojem migdałowym na gładki płyn.\n3. Wmieszaj przetarte przez sitko maliny.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Kasza jaglana Plony Natury",
                40
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                220
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                60
            ],
            [
                "Skyr naturalny Pilos",
                60
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Płynny koktajl twarogowo-bananowy na napoju migdałowym",
        "category": "Śniadanie",
        "prep_time": 6,
        "instructions": "1. Twaróg chudy, dojrzałego banana i napój migdałowy Vemondo miksuj przez 60 sekund na idealnie gładki napój.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Twaróg chudy Pilos",
                100
            ],
            [
                "Banan świeży Ryneczek Lidla",
                90
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                200
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Aksamitna emulsja owsiano-kefirowa z borówkami",
        "category": "Śniadanie",
        "prep_time": 10,
        "instructions": "1. Płatki owsiane zalej wrzątkiem na 5 minut, a następnie zblenduj z kefirem i borówkami na rzadki koktajl.\n2. Czas: 10 minut.",
        "ingredients": [
            [
                "Płatki owsiane górskie Crownfield",
                35
            ],
            [
                "Kefir naturalny Mleczna Dolina",
                220
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                60
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Płynna kaszka manna na napoju migdałowym ze skyrem waniliowym",
        "category": "Śniadanie",
        "prep_time": 10,
        "instructions": "1. Kaszę mannę ugotuj w dużej ilości napoju migdałowego na rzadko (5 minut).\n2. Zmiksuj ze skyrem waniliowym K-Classic na aksamitny płyn.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Kasza manna K-Classic",
                35
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                220
            ],
            [
                "Skyr waniliowy K-Classic",
                100
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Gładki shake proteinowy z tofu bio i truskawkami",
        "category": "Śniadanie",
        "prep_time": 6,
        "instructions": "1. Tofu bio Vemondo, truskawki mrożone i napój migdałowy zblenduj na jednolitą, kremową emulsję bez grudek.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Tofu naturalne bio Vemondo",
                100
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                100
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                200
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Płynny kleik ryżowy z pieczonym jabłkiem i cynamonem",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Ryż biały rozgotuj w wodzie na papkę.\n2. Zblenduj gorący ryż z upieczonym jabłkiem i odrobiną wody na płynny kleik.\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Ryż biały długoziarnisty Plony Natury",
                40
            ],
            [
                "Jabłka polskie Gala Biedronka",
                120
            ],
            [
                "Skyr naturalny Pilos",
                60
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Kremowy koktajl białkowo-owocowy ze skyrem waniliowym",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Skyr waniliowy połącz z napojem migdałowym i miksuj blenderem 60 sekund.\n2. Dodaj banana i zblenduj na rzadki shake.\n3. Czas: 6 minut.",
        "ingredients": [
            [
                "Skyr waniliowy Pilos",
                150
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                150
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Aksamitny mus z pieczonego jabłka z jogurtem naturalnym",
        "category": "Drugie śniadanie",
        "prep_time": 15,
        "instructions": "1. Jabłko upiecz na miękko bez skórki.\n2. Zblenduj z jogurtem naturalnym Mleczna Dolina na rzadki mus.\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                150
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                120
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Płynny jogurt pitny z musem borówkowym",
        "category": "Drugie śniadanie",
        "prep_time": 5,
        "instructions": "1. Jogurt naturalny połącz z napojem migdałowym (1:1).\n2. Zblenduj z borówkami na jednolity płyn.\n3. Gotowe w 5 minut.",
        "ingredients": [
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                150
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                100
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                60
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Shake malinowo-kefirowy z przetartym musem",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Przetarte przez sitko maliny połącz z kefirem i zblenduj na gładki shake.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Kefir naturalny Mleczna Dolina",
                220
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                80
            ],
            [
                "Skyr naturalny Pilos",
                50
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Aksamitny mus bananowy z jogurtem Carrefour",
        "category": "Drugie śniadanie",
        "prep_time": 5,
        "instructions": "1. Dojrzałego banana zblenduj z jogurtem naturalnym na gładką, płynną konsystencję.\n2. Czas: 5 minut.",
        "ingredients": [
            [
                "Banan świeży Ryneczek Lidla",
                100
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                140
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Płynny shake truskawkowy ze skyrem Carrefour",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Skyr waniliowy Carrefour Classic zblenduj z truskawkami i napojem migdałowym.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Skyr waniliowy Carrefour Classic",
                140
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                100
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                120
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Krem dyniowo-marchewkowy z blendowaną piersią z kurczaka",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Pierś z kurczaka, dynię i marchew ugotuj w wodzie z solą (15 minut).\n2. Dodaj oliwę i miksuj w blenderze kielichowym na gładką zupę krem bez grudek.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka świeża Biedronka",
                150
            ],
            [
                "Dynia świeża krojona Biedronka",
                150
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Aksamitny krem z białych warzyw z gotowanym dorszem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Ziemniaki ugotuj w wywarze (15 minut), dodając dorsza na ostatnie 7 minut.\n2. Dodaj oliwę i miksuj przez 2 minuty na aksamitny krem.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                180
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Krem pomidorowo-warzywny z blendowanym tofu bio",
        "category": "Obiad",
        "prep_time": 20,
        "instructions": "1. Pomidory w puszce zagotuj z ugotowaną marchewką i pokrojonym tofu.\n2. Zblenduj na najwyższych obrotach na gładką zupę krem.\n3. Czas: 20 minut.",
        "ingredients": [
            [
                "Pomidory krojone w puszce Freshona",
                250
            ],
            [
                "Tofu naturalne bio Vemondo",
                130
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                80
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Aksamitny krem z ziemniaków i dyni z blendowanym indykiem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Indyk, ziemniaki i dynię ugotuj do miękkości (15 minut).\n2. Zblenduj na idealnie płynną, sycącą zupę krem z dodatkiem oliwy.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                150
            ],
            [
                "Ziemniaki polskie Biedronka",
                150
            ],
            [
                "Dynia świeża krojona Biedronka",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Zupa krem z pieczonych batatów i marchewki z łososiem",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Bataty i marchewkę ugotuj na miękko.\n2. Łososia ugotuj na parze, zdejmij skórę i zblenduj razem z warzywami i oliwą na krem.\n3. Czas: 30 minut.",
        "ingredients": [
            [
                "Łosoś atlantycki filet świeży Lidl",
                130
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                160
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Aksamitna zupa krem z cukinii i ryżu z dorszem atlantyckim",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Cukinię, ryż biały i dorsza ugotuj w delikatnym wywarze (14 minut).\n2. Zmiksuj na idealnie gładką, lekką emulsję.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki filet świeży Kaufland",
                180
            ],
            [
                "Cukinia świeża Biedronka",
                150
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                30
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Płynny krem jarzynowy z blendowaną piersią kurczaka Carrefour",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Pierś z kurczaka Carrefour, marchew i ziemniaki ugotuj w wodzie z solą (16 minut).\n2. Zmiksuj na gładki krem z dodatkiem oliwy.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka Carrefour Jakość z Natury",
                150
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                120
            ],
            [
                "Ziemniaki polskie Biedronka",
                140
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                8
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Aksamitny krem z dyni i marchwi z mielonym indykiem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Dynię, marchew i mięso mielone z indyka ugotuj w bulionie (15 minut).\n2. Zblenduj na gładki, pożywny krem obiadowy. Czas: 25 minut.",
        "ingredients": [
            [
                "Mięso mielone z piersi indyka Biedronka",
                150
            ],
            [
                "Dynia świeża krojona Biedronka",
                160
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Delikatna zupa krem z pomidorów i batatów z dorszem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Bataty ugotuj, dodaj pomidory w puszce i dorsza (gotuj 8 minut).\n2. Zblenduj na krem z łyżką oliwy. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                170
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                140
            ],
            [
                "Pomidory krojone w puszce Freshona",
                160
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Aksamitny mus borówkowy z napojem migdałowym",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 5,
        "instructions": "1. Borówki zblenduj z napojem migdałowym Vemondo na gładki płyn.\n2. Czas: 5 minut.",
        "ingredients": [
            [
                "Borówki amerykańskie Ryneczek Lidla",
                100
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                150
            ],
            [
                "Skyr naturalny Pilos",
                50
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Płynny mus z pieczonego jabłka i banana",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 12,
        "instructions": "1. Jabłko upiecz, zblenduj z dojrzałym bananem i 50 ml wody na aksamitny płynny przecier.\n2. Czas: 12 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                120
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Kremowy shake malinowo-waniliowy ze skyrem K-Classic",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 6,
        "instructions": "1. Skyr waniliowy K-Classic zblenduj z przetartymi malinami i napojem migdałowym.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Skyr waniliowy K-Classic",
                140
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                80
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                100
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Gładki kisiel owocowy z blendowanym bananem",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 10,
        "instructions": "1. Truskawki przetrzyj, zagotuj z mąką ziemniaczaną i zmiksuj z dojrzałym bananem na rzadki kisiel.\n2. Czas: 10 minut.",
        "ingredients": [
            [
                "Truskawki mrożone Mroźna Kraina",
                80
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Krem z cukinii i ziemniaka z blendowanym serkiem wiejskim",
        "category": "Kolacja",
        "prep_time": 20,
        "instructions": "1. Cukinię i ziemniaka obierz i ugotuj w małej ilości wody (12 minut).\n2. Dodaj serek wiejski i oliwę, zmiksuj na gładką zupę krem.\n3. Czas: 20 minut.",
        "ingredients": [
            [
                "Cukinia świeża Biedronka",
                150
            ],
            [
                "Ziemniaki polskie Biedronka",
                130
            ],
            [
                "Serek wiejski lekki Delikate",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Aksamitny shake twarogowo-kefirowy z cynamonem",
        "category": "Kolacja",
        "prep_time": 6,
        "instructions": "1. Twaróg chudy, kefir naturalny i banana miksuj w blenderze przez 90 sekund na gładki płyn.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Twaróg chudy Pilos",
                100
            ],
            [
                "Kefir naturalny Mleczna Dolina",
                200
            ],
            [
                "Banan świeży Ryneczek Lidla",
                60
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Zupa krem z marchwi i ziemniaka z blendowanym tofu",
        "category": "Kolacja",
        "prep_time": 20,
        "instructions": "1. Marchew i ziemniaki ugotuj na miękko, dodaj tofu bio Vemondo i oliwę.\n2. Zblenduj na gładki krem. Czas: 20 minut.",
        "ingredients": [
            [
                "Marchew świeża myta Ryneczek Lidla",
                160
            ],
            [
                "Ziemniaki polskie Biedronka",
                120
            ],
            [
                "Tofu naturalne bio Vemondo",
                90
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Aksamitny shake bananowo-twarogowy z cynamonem na noc",
        "category": "Kolacja",
        "prep_time": 6,
        "instructions": "1. Twaróg chudy Carrefour, dojrzały banan i napój migdałowy miksuj do idealnej gładkości.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Twaróg chudy Carrefour Classic",
                120
            ],
            [
                "Banan świeży Ryneczek Lidla",
                70
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                180
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Kleik ryżowy z pieczonym jabłkiem bez skórki (Colitis Care)",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Biały ryż rozgotuj na kleik (15 minut).\n2. Jabłko obierz, upiecz i utłucz na mus, połącz z kleikiem i skyrem.\n3. Czas: 15 minut.\n4. Działa kojąco na śluzówkę jelit.",
        "ingredients": [
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Jabłka polskie Gala Biedronka",
                130
            ],
            [
                "Skyr naturalny Pilos",
                60
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Jajka na miękko z bułką pszenną i chudą szynką z indyka",
        "category": "Śniadanie",
        "prep_time": 10,
        "instructions": "1. Jaja ściółkowe gotuj dokładnie 4.5 minuty (na miękko).\n2. Podawaj z chlebem pszennym tostowym i szynką z indyka Kraina Wędlin.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                70
            ],
            [
                "Szynka z piersi indyka Kraina Wędlin",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Delikatna kaszka manna na napoju migdałowym z bananem",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Kaszkę ugotuj w napoju migdałowym na gęsto.\n2. Dojrzałego banana rozgnieć na puree i wmieszaj do kaszki.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Kasza manna Crownfield",
                45
            ],
            [
                "Napój migdałowy bez cukru Vemondo",
                200
            ],
            [
                "Banan świeży Ryneczek Lidla",
                100
            ],
            [
                "Skyr naturalny Pilos",
                50
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Płatki ryżowe na wodzie ze zgniecionym bananem i oliwą",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Płatki ryżowe Crownfield ugotuj na miękki kleik (6 minut).\n2. Wmieszaj dojrzałego banana i kroplę oliwy z oliwek Extra Virgin.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Płatki ryżowe Crownfield",
                45
            ],
            [
                "Banan świeży Ryneczek Lidla",
                90
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ],
            [
                "Skyr naturalny Pilos",
                40
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Jajecznica parowa z chlebem pszennym tostowym (Colitis)",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Jaja ściółkowe wymieszaj z odrobiną wody i solą, ścinaj delikatnie nad parą wodną.\n2. Podawaj z miękkim chlebem pszennym tostowym.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Kaszka ryżowa z przetartymi borówkami i skyrem",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki ryżowe ugotuj na miękki kleik.\n2. Borówki przetrzyj przez sitko i połącz ze skyrem naturalnym Pilos.\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Płatki ryżowe Plony Natury",
                45
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                60
            ],
            [
                "Skyr naturalny Pilos",
                80
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Kanapka pszenna z pastą z jajka na twardo i kroplą oliwy",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Jajko ugotuj na twardo, zetrzyj na drobnej tarce, wymieszaj z oliwą z oliwek i szczyptą soli.\n2. Posmaruj chleb pszenny tostowy. Czas: 12 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                5
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Delikatna owsianka przetarta z pieczonym jabłkiem (Colitis)",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki owsiane ugotuj na kleik i zblenduj na gładko.\n2. Dodaj upieczone, przetarte jabłko Gala.\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Płatki owsiane górskie Crownfield",
                40
            ],
            [
                "Jabłka polskie Gala Biedronka",
                120
            ],
            [
                "Skyr naturalny Pilos",
                50
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Pieczone jabłko bez skórki z chudym twarożkiem (Colitis)",
        "category": "Drugie śniadanie",
        "prep_time": 15,
        "instructions": "1. Jabłko obierz ze skórki i piecz 12 minut w 180°C.\n2. Twaróg chudy przetrzyj przez sitko z jogurtem i połącz z jabłkiem.\n3. Czas: 15 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                140
            ],
            [
                "Twaróg chudy klinek Delikate",
                100
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                30
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Serek wiejski z miękkim bananem i chrupkim waflem ryżowym",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Serek wiejski lekki wymieszaj ze zgniecionym dojrzałym bananem.\n2. Podawaj z naturalnym waflem ryżowym.\n3. Czas: 6 minut.",
        "ingredients": [
            [
                "Serek wiejski lekki Delikate",
                180
            ],
            [
                "Banan świeży Ryneczek Lidla",
                70
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Mus bananowy z kleikiem ryżowym dla jelit",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Banana rozgnieć widelcem na gładko, wymieszaj z ugotowanym kleikiem ryżowym.\n2. Czas: 8 minut.",
        "ingredients": [
            [
                "Banan świeży Ryneczek Lidla",
                90
            ],
            [
                "Płatki ryżowe Plony Natury",
                30
            ],
            [
                "Skyr naturalny Pilos",
                50
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Pieczona dynia z cynamonem i jogurtem naturalnym (Colitis)",
        "category": "Drugie śniadanie",
        "prep_time": 15,
        "instructions": "1. Dynię upiecz na miękko w 180°C, ugnieć na puree i wymieszaj z jogurtem naturalnym Mleczna Dolina.\n2. Czas: 15 minut.",
        "ingredients": [
            [
                "Dynia świeża krojona Biedronka",
                140
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                80
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Domowy kisiel jagodowy (działanie przeciwzapalne i ściągające)",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Przetarte borówki zagotuj w wodzie i zagęść mąką ziemniaczaną.\n2. Garbniki z jagód wykazują naturalne działanie ściągające.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Borówki amerykańskie Ryneczek Lidla",
                80
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ],
            [
                "Skyr naturalny Pilos",
                50
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Aksamitny serek wiejski K-Classic z puree z pieczonego jabłka",
        "category": "Drugie śniadanie",
        "prep_time": 12,
        "instructions": "1. Jabłko upiecz bez skórki, utłucz i wymieszaj z serkiem wiejskim K-Classic.\n2. Czas: 12 minut.",
        "ingredients": [
            [
                "Serek wiejski lekki K-Classic",
                180
            ],
            [
                "Jabłka polskie Gala Biedronka",
                100
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Kromka chleba pszennego z chudą szynką z indyka K-Purland",
        "category": "Drugie śniadanie",
        "prep_time": 5,
        "instructions": "1. Chleb pszenny tostowy obłóż szynką z piersi indyka K-Purland.\n2. Bezpieczna, lekka przekąska w 5 minut.",
        "ingredients": [
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ],
            [
                "Szynka z piersi indyka K-Purland",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                3
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Gotowany filet z kurczaka z białym ryżem i gotowaną marchewką",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Pierś z kurczaka ugotuj na parze (15 minut).\n2. Ryż biały ugotuj na miękko.\n3. Marchewkę obierz i ugotuj do miękkości.\n4. Skrop przeciwzapalną oliwą z oliwek. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka świeża Biedronka",
                180
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                65
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Dorsz na parze z purée ziemniaczanym i duszoną dynią",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Dorsz paruj 12 minut z solą.\n2. Ziemniaki i dynię ugotuj i utłucz z oliwą na aksamitne puree.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                190
            ],
            [
                "Ziemniaki polskie Biedronka",
                170
            ],
            [
                "Dynia świeża krojona Biedronka",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Łosoś pieczony w pergaminie z purée z batatów i cukinią bez skórki",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Łososia zawiń w pergamin i piecz 14 minut w 180°C.\n2. Bataty ugotuj i utłucz na puree.\n3. Cukinię bez skórki ugotuj na parze. Czas: 25 minut.",
        "ingredients": [
            [
                "Łosoś atlantycki filet świeży Lidl",
                140
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                160
            ],
            [
                "Cukinia świeża Biedronka",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                5
            ]
        ],
        "image_type": "salmon"
    },
    {
        "title": "Pulpety z indyka gotowane w lekkim bulionie z puree ziemniaczanym",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Z mielonego indyka uformuj małe pulpeciki i gotuj 14 minut w bulionie.\n2. Ziemniaki utłucz z oliwą z oliwek.\n3. Czas: 30 minut.",
        "ingredients": [
            [
                "Mięso mielone z piersi indyka Biedronka",
                170
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Gotowana polędwiczka z indyka z purée z dyni i białym ryżem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Polędwiczkę z indyka ugotuj na parze (14 minut).\n2. Dynię utłucz na puree z oliwą.\n3. Podawaj z gotowanym ryżem białym. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                160
            ],
            [
                "Dynia świeża krojona Biedronka",
                140
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Dorsz duszony z marchewką i białym ryżem (Colitis)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Filet z dorsza i pokrojoną marchewkę duś w małej ilości wody z solą przez 15 minut.\n2. Podawaj z ugotowanym ryżem białym i oliwą.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży filet Carrefour",
                180
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                130
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                6
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Gotowany kurczak z purée z ziemniaków i gotowaną cukinią",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Pierś z kurczaka ugotuj w osolonej wodzie.\n2. Ziemniaki rozgnieć na puree z łyżeczką oliwy.\n3. Cukinię bez skórki ugotuj na miękko. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka K-Purland",
                170
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Cukinia świeża Biedronka",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                6
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Łosoś na parze z kleikiem ryżowym i duszonym jabłkiem",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Łososia paruj 12 minut.\n2. Ryż biały rozgotuj na kleik, jabłko obierz i uduś na mus.\n3. Bardzo łagodne połączenie dla śluzówki jelita. Czas: 25 minut.",
        "ingredients": [
            [
                "Łosoś atlantycki świeży filet Kaufland",
                140
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                50
            ],
            [
                "Jabłka polskie Gala Biedronka",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                4
            ]
        ],
        "image_type": "salmon"
    },
    {
        "title": "Aksamitne risotto z indykiem i purée z dyni (Colitis)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Ryż biały ugotuj na miękko.\n2. Połącz z gotowanym indykiem i purée z dyni, skrop oliwą z oliwek.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Carrefour",
                160
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Dynia świeża krojona Biedronka",
                140
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Dorsz pieczony w pergaminie z purée z batatów",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Dorsz zawiń w pergamin i piecz 14 minut w 180°C.\n2. Bataty ugotuj i ugnieć z oliwą z oliwek.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                190
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "fish"
    },
    {
        "title": "Mus z pieczonego jabłka i banana dla jelit",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 12,
        "instructions": "1. Upieczone jabłko bez skórki i dojrzałego banana zgnieć widelcem na gładką masę.\n2. Czas: 12 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                120
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Kisiel z jagód z waflem ryżowym Good Food",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 10,
        "instructions": "1. Przetarte borówki zagotuj z mąką ziemniaczaną na lekki kisiel.\n2. Zjedz z naturalnym waflem ryżowym. Czas: 10 minut.",
        "ingredients": [
            [
                "Borówki amerykańskie Ryneczek Lidla",
                80
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Płynny shake ze skyru i pieczonego jabłka",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 10,
        "instructions": "1. Upieczone jabłko zblenduj ze skyrem naturalnym Pilos i odrobiną wody.\n2. Czas: 10 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                120
            ],
            [
                "Skyr naturalny Pilos",
                80
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Banan rozgnieciony z odrobiną jogurtu naturalnego",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 5,
        "instructions": "1. Banana rozgnieć na papkę i wymieszaj z 2 łyżkami jogurtu naturalnego.\n2. Czas: 5 minut.",
        "ingredients": [
            [
                "Banan świeży Ryneczek Lidla",
                100
            ],
            [
                "Jogurt naturalny gęsty Mleczna Dolina",
                60
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Kaszka ryżowa z cynamonem i musem jabłkowym",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 12,
        "instructions": "1. Płatki ryżowe ugotuj na miękko, wymieszaj z musem z obranego pieczonego jabłka.\n2. Czas: 12 minut.",
        "ingredients": [
            [
                "Płatki ryżowe Plony Natury",
                35
            ],
            [
                "Jabłka polskie Gala Biedronka",
                100
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Aksamitna zupa krem z marchewki, ziemniaka i ryżu",
        "category": "Kolacja",
        "prep_time": 25,
        "instructions": "1. Marchew, ziemniaki i łyżkę ryżu ugotuj do miękkości (18 minut).\n2. Dodaj oliwę z oliwek i zblenduj na krem.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Marchew świeża myta Ryneczek Lidla",
                160
            ],
            [
                "Ziemniaki polskie Biedronka",
                140
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                30
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Kanapka z pieczywa pszennego z gotowanym indykiem i oliwą",
        "category": "Kolacja",
        "prep_time": 10,
        "instructions": "1. Chleb pszenny tostowy skrop oliwą z oliwek i obłóż plasterkami gotowanego indyka.\n2. Czas: 10 minut.",
        "ingredients": [
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ],
            [
                "Polędwiczki z indyka Rzeźnik",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Zupa krem z cukinii bez skórki i ziemniaka (Colitis)",
        "category": "Kolacja",
        "prep_time": 20,
        "instructions": "1. Cukinię i ziemniaka ugotuj i zblenduj na delikatny krem z oliwą z oliwek.\n2. Czas: 20 minut.",
        "ingredients": [
            [
                "Cukinia świeża Biedronka",
                160
            ],
            [
                "Ziemniaki polskie Biedronka",
                120
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Jajko na miękko z chlebem pszennym i purée marchewkowym",
        "category": "Kolacja",
        "prep_time": 15,
        "instructions": "1. Jajko ściółkowe ugotuj na miękko (4.5 minuty).\n2. Marchewkę ugotuj i utłucz na puree.\n3. Zjedz z chlebem pszennym tostowym. Czas: 15 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                120
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                4
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Krem z pieczonej dyni z białym ryżem",
        "category": "Kolacja",
        "prep_time": 22,
        "instructions": "1. Dynię ugotuj i zblenduj z oliwą na krem.\n2. Podawaj z 2 łyżkami ugotowanego białego ryżu. Czas: 22 minuty.",
        "ingredients": [
            [
                "Dynia świeża krojona Biedronka",
                180
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Kaszka manna na mleku bez laktozy z pieczonym jabłkiem (WZJG)",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Kaszę mannę Crownfield ugotuj w mleku bez laktozy Pilos na gęsty, delikatny budyń (5 minut).\n2. Jabłko obierz ze skórki, upiecz na miękko i rozgnieć na aksamitny mus.\n3. Połącz kaszkę z jabłkiem i szczyptą cynamonu.\n4. Czas: 15 minut.\n5. Posiłek nie obciąża jelit i dostarcza bezpiecznego wapnia bez laktozy.",
        "ingredients": [
            [
                "Kasza manna Crownfield",
                45
            ],
            [
                "Mleko 1.5% bez laktozy Pilos",
                200
            ],
            [
                "Jabłka polskie Gala Biedronka",
                120
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Puszysty omlet parowy z twarogiem bez laktozy i koperkiem (WZJG)",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Jaja ściółkowe roztrzep widelcem z łyżką mleka bez laktozy i szczyptą soli.\n2. Twaróg bez laktozy Delikate rozgnieć widelcem ze świeżym koperkiem.\n3. Wlej masę jajeczną na naczynie do gotowania na parze, na wierzch wyłóż twarożek.\n4. Paruj pod pokrywką przez 8 minut do puszystości.\n5. Czas: 15 minut. Zjedz z chlebem pszennym tostowym.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Twaróg chudy bez laktozy Delikate",
                80
            ],
            [
                "Mleko 1.5% bez laktozy Mleczna Dolina",
                30
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Placuszki twarogowe bez laktozy z musem malinowym (WZJG)",
        "category": "Śniadanie",
        "prep_time": 20,
        "instructions": "1. Twaróg bez laktozy Pilos utrzyj z jajkiem i mąką z płatków ryżowych.\n2. Formuj małe placuszki i smaż na suchej patelni teflonowej na małym ogniu pod przykryciem po 3 minuty z każdej strony.\n3. Maliny przetrzyj przez drobne sitko, usuwając drażniące pestki.\n4. Czas: 20 minut.\n5. Wyjątkowo smaczne i łagodne śniadanie.",
        "ingredients": [
            [
                "Twaróg chudy bez laktozy Pilos",
                130
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Płatki ryżowe Crownfield",
                40
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                70
            ]
        ],
        "image_type": "pancakes"
    },
    {
        "title": "Płatki ryżowe na mleku bez laktozy z puree z banana (WZJG)",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Płatki ryżowe Plony Natury ugotuj w mleku bez laktozy Mleczna Dolina na miękki kleik (6 minut).\n2. Dojrzałego banana rozgnieć widelcem na gładkie puree i wmieszaj do płatków.\n3. Czas wykonania: 12 minut.\n4. Łatwostrawna energia bez fermentacji laktozowej.",
        "ingredients": [
            [
                "Płatki ryżowe Plony Natury",
                45
            ],
            [
                "Mleko 1.5% bez laktozy Mleczna Dolina",
                200
            ],
            [
                "Banan świeży Ryneczek Lidla",
                90
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Jajecznica na parze z chlebem pszennym i serkiem wiejskim bez laktozy (WZJG)",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Jaja ściółkowe wymieszaj z solą i ścinaj powoli w misce nad kąpielą parową.\n2. Na talerzu podaj ze świeżym serkiem wiejskim bez laktozy K-Classic i pieczywem pszennym tostowym.\n3. Czas przygotowania to 12 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe klasa M K-Classic",
                120
            ],
            [
                "Serek wiejski bez laktozy K-Classic",
                100
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                3
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Delikatna owsianka na mleku bez laktozy z duszonym jabłkiem (WZJG)",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki owsiane górskie zalej mlekiem bez laktozy Carrefour Classic i gotuj 7 minut na małym ogniu.\n2. Jabłko obierz ze skórki i zduś z odrobiną wody i cynamonu.\n3. Połącz owsiankę z ciepłym jabłkiem.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Płatki owsiane górskie Carrefour Bio",
                45
            ],
            [
                "Mleko 1.5% bez laktozy Carrefour Classic",
                200
            ],
            [
                "Jabłka polskie Gala Biedronka",
                110
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Aksamitny twarożek bez laktozy z miodem i bananem na pieczywie pszennym (WZJG)",
        "category": "Śniadanie",
        "prep_time": 8,
        "instructions": "1. Twaróg chudy bez laktozy Delikate utrzyj z jogurtem bez laktozy i bananem na aksamitną pastę.\n2. Posmaruj kromki chleba pszennego tostowego.\n3. Błyskawiczne i bezpieczne śniadanie w 8 minut.",
        "ingredients": [
            [
                "Twaróg chudy bez laktozy Delikate",
                110
            ],
            [
                "Jogurt naturalny bez laktozy Mleczna Dolina",
                30
            ],
            [
                "Banan świeży Ryneczek Lidla",
                70
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Ryżanka na mleku bez laktozy z przetartym musem z borówek (WZJG)",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Biały ryż ugotuj w mleku bez laktozy Pilos na miękko (12 minut).\n2. Borówki przetrzyj przez sitko na gładki mus.\n3. Polej ciepły ryż jagodowym sosem.\n4. Czas: 15 minut.",
        "ingredients": [
            [
                "Ryż biały długoziarnisty Plony Natury",
                50
            ],
            [
                "Mleko 1.5% bez laktozy Pilos",
                180
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                70
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Budyń z kaszy manny na mleku bez laktozy ze słodką dynią (WZJG)",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Kaszę manną K-Classic ugotuj w mleku bez laktozy na gęsto.\n2. Dynię ugotuj i utłucz na gładkie puree, wmieszaj do budyniu.\n3. Czas: 15 minut. Znakomite źródło beta-karotenu.",
        "ingredients": [
            [
                "Kasza manna K-Classic",
                40
            ],
            [
                "Mleko 1.5% bez laktozy K-Classic",
                180
            ],
            [
                "Dynia świeża krojona Biedronka",
                100
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Tosty pszenne z pastą z jajka i serka wiejskiego bez laktozy (WZJG)",
        "category": "Śniadanie",
        "prep_time": 12,
        "instructions": "1. Jajko ugotowane na twardo rozgnieć z serkiem wiejskim bez laktozy Delikate i szczyptą soli.\n2. Posmaruj kromki pieczywa pszennego tostowego.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Serek wiejski bez laktozy Delikate",
                100
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Płatki ryżowe na mleku bez laktozy z pieczonym jabłkiem i cynamonem (WZJG)",
        "category": "Śniadanie",
        "prep_time": 15,
        "instructions": "1. Płatki ryżowe Carrefour Bio ugotuj w mleku bez laktozy Carrefour Classic (5 minut).\n2. Dodaj pieczone jabłko bez skórki rozgniecione na mus.\n3. Czas przygotowania: 15 minut.",
        "ingredients": [
            [
                "Płatki ryżowe Carrefour Bio",
                45
            ],
            [
                "Mleko 1.5% bez laktozy Carrefour Classic",
                180
            ],
            [
                "Jabłka polskie Gala Biedronka",
                100
            ]
        ],
        "image_type": "oatmeal"
    },
    {
        "title": "Omlet biszkoptowy na parze z twarogiem bez laktozy i bananem (WZJG)",
        "category": "Śniadanie",
        "prep_time": 16,
        "instructions": "1. Białko ubij na sztywno, wymieszaj delikatnie z żółtkiem i twarogiem bez laktozy Pilos.\n2. Paruj w foremce pod przykryciem przez 8 minut.\n3. Podawaj z miękkimi plastrami banana. Czas: 16 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe Moja Kurka",
                120
            ],
            [
                "Twaróg chudy bez laktozy Pilos",
                60
            ],
            [
                "Banan świeży Ryneczek Lidla",
                70
            ]
        ],
        "image_type": "omelet"
    },
    {
        "title": "Serek wiejski bez laktozy z purée z pieczonego jabłka (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Jabłko Gala obierz ze skórki i upiecz w 180°C przez 10 minut na miękko.\n2. Rozgnieć na mus i połącz z chłodnym serkiem wiejskim bez laktozy Pilos.\n3. Czas: 10 minut. Bezpieczna porcja białka i pektyn.",
        "ingredients": [
            [
                "Serek wiejski lekki bez laktozy Pilos",
                180
            ],
            [
                "Jabłka polskie Gala Biedronka",
                100
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Shake bananowo-kefirowy bez laktozy z waflami ryżowymi (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Kefir bez laktozy Mleczna Dolina zblenduj z dojrzałym bananem na puszysty shake.\n2. Spożywaj z chrupkimi waflami ryżowymi Good Food.\n3. Czas: 6 minut.",
        "ingredients": [
            [
                "Kefir bez laktozy Mleczna Dolina",
                220
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Jogurt naturalny bez laktozy z przecierem z borówek (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Borówki przetrzyj przez sitko, by usunąć skórki.\n2. Wymieszaj z gęstym jogurtem naturalnym bez laktozy Pilos.\n3. Czas: 8 minut.",
        "ingredients": [
            [
                "Jogurt naturalny bez laktozy Pilos",
                160
            ],
            [
                "Borówki amerykańskie Ryneczek Lidla",
                70
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Mus twarogowy bez laktozy ze słodkim bananem (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Twaróg bez laktozy Delikate zblenduj z dojrzałym bananem i 2 łyżkami mleka bez laktozy na gładki serek homogenizowany.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Twaróg chudy bez laktozy Delikate",
                120
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Mleko 1.5% bez laktozy Mleczna Dolina",
                30
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Płynny kefir bez laktozy z kleikiem ryżowym (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Kleik z płatków ryżowych zblenduj z chłodnym kefirem bez laktozy K-Classic na aksamitny napój probiotyczny.\n2. Czas: 8 minut.",
        "ingredients": [
            [
                "Kefir bez laktozy K-Classic",
                200
            ],
            [
                "Płatki ryżowe K-Classic",
                25
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Serek wiejski bez laktozy z gotowaną dynią i cynamonem (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Dynię ugotuj do miękkości i utłucz na puree.\n2. Wymieszaj z serkiem wiejskim bez laktozy Carrefour Classic.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Serek wiejski bez laktozy Carrefour Classic",
                180
            ],
            [
                "Dynia świeża krojona Biedronka",
                90
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Delikatna pasta z tuńczyka i twarogu bez laktozy (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 10,
        "instructions": "1. Tuńczyka odsącz z zalewy, rozgnieć z twarogiem bez laktozy Delikate i łyżką jogurtu bez laktozy.\n2. Posmaruj pieczywo pszenne tostowe. Czas: 10 minut.",
        "ingredients": [
            [
                "Twaróg chudy bez laktozy Delikate",
                90
            ],
            [
                "Tuńczyk w sosie własnym Marinero",
                50
            ],
            [
                "Jogurt naturalny bez laktozy Mleczna Dolina",
                25
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                50
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Koktajl odżywczy z kefirem bez laktozy i pieczonym jabłkiem (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 12,
        "instructions": "1. Upieczone jabłko bez skórki zblenduj z kefirem bez laktozy Pilos i szczyptą cynamonu.\n2. Płynna osłona jelit gotowa w 12 minut.",
        "ingredients": [
            [
                "Kefir bez laktozy Pilos",
                220
            ],
            [
                "Jabłka polskie Gala Biedronka",
                110
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Jogurt bez laktozy K-Classic z musem bananowym i waflem ryżowym (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 6,
        "instructions": "1. Jogurt naturalny bez laktozy K-Classic połącz z rozgniecionym bananem.\n2. Podawaj z waflem ryżowym Good Food. Czas: 6 minut.",
        "ingredients": [
            [
                "Jogurt naturalny bez laktozy K-Classic",
                150
            ],
            [
                "Banan świeży Ryneczek Lidla",
                80
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Kanapka pszenna z aksamitnym twarożkiem bez laktozy i szynką z indyka (WZJG)",
        "category": "Drugie śniadanie",
        "prep_time": 8,
        "instructions": "1. Chleb pszenny posmaruj twarogiem bez laktozy utartym z jogurtem bez laktozy.\n2. Nałóż plasterki szynki z indyka Kraina Wędlin. Czas: 8 minut.",
        "ingredients": [
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ],
            [
                "Twaróg chudy bez laktozy Delikate",
                70
            ],
            [
                "Jogurt naturalny bez laktozy Mleczna Dolina",
                20
            ],
            [
                "Szynka z piersi indyka Kraina Wędlin",
                40
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Dorsz atlantycki na parze z puree ziemniaczanym na mleku bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Dorsz paruj przez 12 minut oprószony solą.\n2. Ziemniaki ugotuj, utłucz z ciepłym mlekiem bez laktozy Pilos i oliwą na aksamitne, kremowe puree.\n3. Czas: 25 minut.\n4. Znakomite, łagodne źródło pełnowartościowego białka i potasu.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                190
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Mleko 1.5% bez laktozy Pilos",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                8
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Gotowany filet z indyka w sosie jogurtowym bez laktozy z koperkiem (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Polędwiczki z indyka ugotuj na parze (14 minut) i pokrój w medaliony.\n2. Jogurt naturalny bez laktozy Mleczna Dolina połącz z posiekanym koperkiem i solą, lekko podgrzej (nie gotuj).\n3. Polej indyka sosem, podawaj z białym ryżem. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                180
            ],
            [
                "Jogurt naturalny bez laktozy Mleczna Dolina",
                80
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Pulpety z indyka z purée z dyni na mleku bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Z mielonego indyka uformuj kulki i ugotuj w wywarze warzywnym (14 minut).\n2. Dynię i ziemniaki ugotuj, utłucz z mlekiem bez laktozy Delikate na puszyste puree.\n3. Czas: 30 minut.",
        "ingredients": [
            [
                "Mięso mielone z piersi indyka Biedronka",
                170
            ],
            [
                "Dynia świeża krojona Biedronka",
                140
            ],
            [
                "Ziemniaki polskie Biedronka",
                120
            ],
            [
                "Mleko 1.5% bez laktozy Mleczna Dolina",
                40
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Pierś z kurczaka duszona w łagodnym sosie kefirowym bez laktozy z ryżem (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Pierś z kurczaka pokrój w kostkę, duś w odrobinie wody (12 minut).\n2. Dodaj kefir bez laktozy Pilos i oliwę, dopraw koperkiem i solą.\n3. Podawaj z gotowanym ryżem białym. Czas: 25 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka świeża Biedronka",
                170
            ],
            [
                "Kefir bez laktozy Pilos",
                80
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Pieczony łosoś z sosem jogurtowym bez laktozy i ziemniakami (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Łososia zawiń w pergamin i upiecz w 180°C przez 14 minut.\n2. Ziemniaki ugotuj na miękko.\n3. Przygotuj sos z jogurtu naturalnego bez laktozy K-Classic i koperku.\n4. Czas: 25 minut. Silne działanie przeciwzapalne Omega-3.",
        "ingredients": [
            [
                "Łosoś atlantycki świeży filet Kaufland",
                140
            ],
            [
                "Ziemniaki polskie Biedronka",
                170
            ],
            [
                "Jogurt naturalny bez laktozy K-Classic",
                70
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                4
            ]
        ],
        "image_type": "salmon"
    },
    {
        "title": "Delikatna zapiekanka z gotowanego kurczaka, ziemniaków i jogurtu bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Ugotowane ziemniaki i pierś z kurczaka pokrój w plastry i ułóż w naczyniu żaroodpornym.\n2. Zalej jogurtem bez laktozy wymieszanym z jajkiem i oliwą.\n3. Zapiecz w 180°C przez 15 minut. Czas: 30 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka Rzeźnik",
                150
            ],
            [
                "Ziemniaki polskie Biedronka",
                160
            ],
            [
                "Jogurt naturalny bez laktozy Pilos",
                80
            ],
            [
                "Jaja ściółkowe Moja Kurka",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Zupa krem z pieczonej dyni zabielana jogurtem bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Dynię i marchew ugotuj w osolonej wodzie (15 minut).\n2. Zblenduj z oliwą z oliwek, a na koniec wmieszaj gęsty jogurt bez laktozy Delikate.\n3. Podawaj z ugotowanym białym ryżem. Czas: 25 minut.",
        "ingredients": [
            [
                "Dynia świeża krojona Biedronka",
                180
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Jogurt naturalny bez laktozy Mleczna Dolina",
                60
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Pulpety z dorsza na parze z purée z batatów na mleku bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 28,
        "instructions": "1. Dorsz zmiel lub drobno posiekaj, połącz z białkiem jaja i ugotuj na parze jako małe kulki (10 minut).\n2. Bataty ugotuj, utłucz z mlekiem bez laktozy K-Classic i oliwą.\n3. Czas: 28 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki filet świeży Kaufland",
                180
            ],
            [
                "Bataty słodkie ziemniaki Ryneczek Lidla",
                160
            ],
            [
                "Mleko 1.5% bez laktozy K-Classic",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                6
            ],
            [
                "Jaja ściółkowe klasa M K-Classic",
                60
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Krem z cukinii i ziemniaka zabielany mlekiem bez laktozy z indykiem (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Cukinię bez skórki, ziemniaki i polędwiczkę z indyka ugotuj razem w wywarze (15 minut).\n2. Dodaj mleko bez laktozy Carrefour Classic i oliwę, zblenduj na aksamitny krem.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Carrefour",
                150
            ],
            [
                "Cukinia świeża Biedronka",
                140
            ],
            [
                "Ziemniaki polskie Biedronka",
                120
            ],
            [
                "Mleko 1.5% bez laktozy Carrefour Classic",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Risotto z białego ryżu z indykiem i serkiem wiejskim bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Ryż biały ugotuj na miękko.\n2. Wymieszaj z gotowanym indykiem i serkiem wiejskim bez laktozy Pilos, uzyskując kremową, aksamitną strukturę bez masła.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                160
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Serek wiejski lekki bez laktozy Pilos",
                100
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Dorsz duszony w koperku z purée ziemniaczano-marchewkowym na mleku bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Dorsz duś w koperku z wodą przez 10 minut.\n2. Ziemniaki i marchew ugotuj i utłucz z ciepłym mlekiem bez laktozy Delikate.\n3. Czas przygotowania: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży Lidl",
                190
            ],
            [
                "Ziemniaki polskie Biedronka",
                160
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                100
            ],
            [
                "Mleko 1.5% bez laktozy Mleczna Dolina",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "puree"
    },
    {
        "title": "Gotowany indyk z purée z dyni zabielanym mlekiem bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Polędwiczki z indyka ugotuj na parze (14 minut).\n2. Dynię ugotuj i utłucz z mlekiem bez laktozy K-Classic na miękki krem.\n3. Podawaj z gotowanym białym ryżem. Czas: 25 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka K-Purland",
                170
            ],
            [
                "Dynia świeża krojona Biedronka",
                160
            ],
            [
                "Mleko 1.5% bez laktozy K-Classic",
                40
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                50
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Pieczony filet z kurczaka w łagodnej marynacie jogurtowej bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 30,
        "instructions": "1. Pierś z kurczaka zanurz w jogurcie bez laktozy Carrefour z odrobiną soli i zawiń w rękaw do pieczenia.\n2. Piecz w 180°C przez 20 minut na wyjątkową miękkość.\n3. Podawaj z purée ziemniaczanym. Czas: 30 minut.",
        "ingredients": [
            [
                "Pierś z kurczaka Carrefour Jakość z Natury",
                170
            ],
            [
                "Jogurt naturalny bez laktozy Carrefour Classic",
                60
            ],
            [
                "Ziemniaki polskie Biedronka",
                180
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Aksamitny krem z białych warzyw zabielany jogurtem bez laktozy z dorszem (WZJG)",
        "category": "Obiad",
        "prep_time": 25,
        "instructions": "1. Ziemniaki i cukinię ugotuj z dorszem, zblenduj na krem.\n2. Wmieszaj jogurt naturalny bez laktozy Delikate i oliwę z oliwek.\n3. Czas: 25 minut.",
        "ingredients": [
            [
                "Dorsz atlantycki świeży filet Carrefour",
                180
            ],
            [
                "Ziemniaki polskie Biedronka",
                160
            ],
            [
                "Cukinia świeża Biedronka",
                100
            ],
            [
                "Jogurt naturalny bez laktozy Mleczna Dolina",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Pulpety drobiowe w delikatnym sosie pomidorowo-jogurtowym bez laktozy (WZJG)",
        "category": "Obiad",
        "prep_time": 28,
        "instructions": "1. Pulpeciki z indyka ugotuj w lekkim wywarze z przetartymi pomidorami (15 minut).\n2. Zdejmij z ognia i zahartuj jogurtem bez laktozy Pilos.\n3. Podawaj z ryżem białym. Czas: 28 minut.",
        "ingredients": [
            [
                "Mięso mielone z piersi indyka Biedronka",
                160
            ],
            [
                "Pomidory krojone w puszce Freshona",
                120
            ],
            [
                "Jogurt naturalny bez laktozy Pilos",
                60
            ],
            [
                "Ryż biały długoziarnisty Plony Natury",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "chicken"
    },
    {
        "title": "Domowy budyń waniliowy na mleku bez laktozy z musem malinowym (WZJG)",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 12,
        "instructions": "1. Kaszę mannę Crownfield ugotuj w mleku bez laktozy Pilos z odrobiną wanilii na gęsty budyń.\n2. Maliny przetrzyj przez sitko i polej przestudzony budyń.\n3. Czas: 12 minut.",
        "ingredients": [
            [
                "Kasza manna Crownfield",
                40
            ],
            [
                "Mleko 1.5% bez laktozy Pilos",
                200
            ],
            [
                "Maliny mrożone Mroźna Kraina",
                60
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Pieczone jabłko nadziewane chudym twarogiem bez laktozy i cynamonem (WZJG)",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 16,
        "instructions": "1. Jabłko obierz, wydrąż gniazdo nasienne.\n2. Wypełnij twarogiem bez laktozy Delikate utartym z cynamonem i zapiecz w 180°C przez 12 minut.\n3. Czas: 16 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                140
            ],
            [
                "Twaróg chudy bez laktozy Delikate",
                80
            ]
        ],
        "image_type": "apple"
    },
    {
        "title": "Schłodzony kefir bez laktozy z cynamonem i chrupkim waflem ryżowym (WZJG)",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 5,
        "instructions": "1. Do szklanki wlej schłodzony kefir bez laktozy K-Classic, posyp mielonym cynamonem.\n2. Spożywaj z waflem ryżowym Good Food. Czas: 5 minut.",
        "ingredients": [
            [
                "Kefir bez laktozy K-Classic",
                220
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Domowy kisiel jagodowy podany z łyżką gęstego jogurtu bez laktozy (WZJG)",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 10,
        "instructions": "1. Przetarte borówki zagotuj z mąką ziemniaczaną na lekki kisiel.\n2. Na wierzch nałóż łyżkę jogurtu bez laktozy Pilos.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Borówki amerykańskie Ryneczek Lidla",
                80
            ],
            [
                "Jogurt naturalny bez laktozy Pilos",
                50
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                20
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Aksamitna pianka twarogowa bez laktozy z puree bananowym (WZJG)",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 8,
        "instructions": "1. Twaróg bez laktozy Carrefour Classic zblenduj z mlekiem bez laktozy i bananem na puszystą piankę.\n2. Czas: 8 minut.",
        "ingredients": [
            [
                "Twaróg chudy bez laktozy Carrefour Classic",
                100
            ],
            [
                "Mleko 1.5% bez laktozy Carrefour Classic",
                40
            ],
            [
                "Banan świeży Ryneczek Lidla",
                70
            ]
        ],
        "image_type": "dessert"
    },
    {
        "title": "Płynny shake truskawkowy na kefirze bez laktozy Mleczna Dolina (WZJG)",
        "category": "Przekąska / Podwieczorek",
        "prep_time": 6,
        "instructions": "1. Truskawki przetrzyj przez sitko i zblenduj z kefirem bez laktozy Mleczna Dolina.\n2. Czas: 6 minut.",
        "ingredients": [
            [
                "Kefir bez laktozy Mleczna Dolina",
                220
            ],
            [
                "Truskawki mrożone Mroźna Kraina",
                80
            ]
        ],
        "image_type": "smoothie"
    },
    {
        "title": "Kremowa zupa z dyni i ziemniaków na mleku bez laktozy z grzankami pszennymi (WZJG)",
        "category": "Kolacja",
        "prep_time": 22,
        "instructions": "1. Dynię i ziemniaki ugotuj w małej ilości wody (14 minut).\n2. Dodaj mleko bez laktozy Pilos i oliwę, zblenduj na aksamitny krem.\n3. Podawaj z grzankami z chleba pszennego tostowego. Czas: 22 minuty.",
        "ingredients": [
            [
                "Dynia świeża krojona Biedronka",
                180
            ],
            [
                "Ziemniaki polskie Biedronka",
                120
            ],
            [
                "Mleko 1.5% bez laktozy Pilos",
                80
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                40
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Twarożek bez laktozy z gotowaną marchewką i chlebem pszennym (WZJG)",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Marchewkę ugotuj na miękko, zetrzyj drobno i połącz z twarogiem bez laktozy Delikate i łyżką jogurtu bez laktozy.\n2. Posmaruj pieczywo pszenne tostowe. Czas: 12 minut.",
        "ingredients": [
            [
                "Twaróg chudy bez laktozy Delikate",
                120
            ],
            [
                "Jogurt naturalny bez laktozy Mleczna Dolina",
                30
            ],
            [
                "Marchew świeża myta Ryneczek Lidla",
                70
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Jajko na miękko z serkiem wiejskim bez laktozy i pieczywem tostowym (WZJG)",
        "category": "Kolacja",
        "prep_time": 10,
        "instructions": "1. Jajko ściółkowe ugotuj na miękko (4.5 minuty).\n2. Na talerzu ułóż z serkiem wiejskim bez laktozy K-Classic i pieczywem pszennym tostowym.\n3. Czas: 10 minut.",
        "ingredients": [
            [
                "Jaja ściółkowe klasa M K-Classic",
                60
            ],
            [
                "Serek wiejski bez laktozy K-Classic",
                120
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin K-Bio",
                3
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Aksamitny krem z cukinii bez skórki zabielany jogurtem bez laktozy (WZJG)",
        "category": "Kolacja",
        "prep_time": 20,
        "instructions": "1. Cukinię i ziemniaka ugotuj do miękkości (12 minut) i zblenduj na krem.\n2. Wmieszaj jogurt naturalny bez laktozy Pilos i oliwę z oliwek.\n3. Czas: 20 minut.",
        "ingredients": [
            [
                "Cukinia świeża Biedronka",
                160
            ],
            [
                "Ziemniaki polskie Biedronka",
                100
            ],
            [
                "Jogurt naturalny bez laktozy Pilos",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Luccese",
                6
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Lekka pasta z gotowanego indyka i twarogu bez laktozy na chlebie pszennym (WZJG)",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Gotowanego indyka zblenduj z twarogiem bez laktozy Delikate, łyżką mleka bez laktozy i szczyptą soli.\n2. Posmaruj pieczywo pszenne tostowe. Czas: 12 minut.",
        "ingredients": [
            [
                "Polędwiczki z indyka Rzeźnik",
                70
            ],
            [
                "Twaróg chudy bez laktozy Delikate",
                70
            ],
            [
                "Mleko 1.5% bez laktozy Mleczna Dolina",
                20
            ],
            [
                "Chleb pszenny tostowy Biedronka",
                60
            ]
        ],
        "image_type": "toast"
    },
    {
        "title": "Zupa krem jarzynowa z lanymi kluseczkami i mlekiem bez laktozy (WZJG)",
        "category": "Kolacja",
        "prep_time": 22,
        "instructions": "1. Marchew i ziemniaki ugotuj i zblenduj z mlekiem bez laktozy Carrefour Classic.\n2. Do gorącej zupy wlej roztrzepane jajko, tworząc delikatne lane kluseczki.\n3. Czas: 22 minuty.",
        "ingredients": [
            [
                "Marchew świeża myta Ryneczek Lidla",
                140
            ],
            [
                "Ziemniaki polskie Biedronka",
                120
            ],
            [
                "Mleko 1.5% bez laktozy Carrefour Classic",
                80
            ],
            [
                "Jaja ściółkowe Carrefour Classic",
                60
            ],
            [
                "Oliwa z oliwek Extra Virgin Carrefour Classic",
                5
            ]
        ],
        "image_type": "soup"
    },
    {
        "title": "Delikatny mus z pieczonego jabłka i twarogu bez laktozy z chrupkim pieczywem (WZJG)",
        "category": "Kolacja",
        "prep_time": 12,
        "instructions": "1. Upieczone jabłko bez skórki rozgnieć z twarogiem bez laktozy Pilos i cynamonem na gładki mus.\n2. Zjedz z waflami ryżowymi Good Food. Czas: 12 minut.",
        "ingredients": [
            [
                "Jabłka polskie Gala Biedronka",
                120
            ],
            [
                "Twaróg chudy bez laktozy Pilos",
                100
            ],
            [
                "Wafle ryżowe naturalne Good Food",
                25
            ]
        ],
        "image_type": "toast"
    }
]
    
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
