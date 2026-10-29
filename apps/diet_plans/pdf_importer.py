"""
Moduł automatycznego importu jadłospisów i przepisów z plików PDF (np. Diety NFZ).
Obsługuje ekstrakcję tekstu, makroskładników, gramatur, miar domowych oraz inteligentną deduplikację przepisów.
"""
import io
import re
from decimal import Decimal
from typing import Dict, Any, List, Optional, Tuple, Union
import pypdf
from django.db import transaction
from django.contrib.auth import get_user_model

from apps.recipes.models import Recipe, Product, RecipeIngredient, MealCategory, StoreChoice
from apps.diet_plans.models import DietPlanTemplate

User = get_user_model()

NFZ_SOURCE_URL = "https://diety.nfz.gov.pl/"
NFZ_SOURCE_TEXT = f"\n\nŹródło: {NFZ_SOURCE_URL}"

def categorize_product_by_name(name: str) -> str:
    n = name.lower()
    if any(k in n for k in ['chleb', 'bułka', 'bagietka', 'tortilla', 'graham', 'żytni', 'razowy', 'pieczywo', 'tost']):
        return 'Pieczywo'
    if any(k in n for k in ['jabłko', 'banan', 'pomarańcza', 'mandaryn', 'borówk', 'truskawk', 'malin', 'śliwk', 'gruszk', 'morel', 'jagod', 'ananas', 'kiwi', 'granat', 'porzeczk']):
        return 'Owoce'
    if any(k in n for k in ['pomidor', 'ogórek', 'papryk', 'cukini', 'marchew', 'cebul', 'czosnek', 'sałat', 'szpinak', 'jarmuż', 'roszponk', 'rukol', 'pieczark', 'brokuł', 'bakłażan', 'rzodkiewk', 'kapar', 'groszek', 'soczewic', 'ciecierzyc', 'cieciork', 'fasol', 'burak', 'włoszczyzn', 'kiełki']):
        return 'Warzywa'
    if any(k in n for k in ['twaróg', 'serek', 'ser ', 'ser,', 'jogurt', 'mleko', 'maślank', 'kefir', 'feta', 'ricotta', 'camembert', 'edamski', 'kozi', 'mozzarella']):
        return 'Nabiał'
    if any(k in n for k in ['kurczak', 'indyk', 'wieprzow', 'wołow', 'szynka', 'schab', 'polędwic', 'kiełbas', 'parówk', 'mięso']):
        return 'Mięso i wędliny'
    if any(k in n for k in ['łosoś', 'tuńczyk', 'makrel', 'dorsz', 'ryb', 'krewetk']):
        return 'Ryby i owoce morza'
    if any(k in n for k in ['płatki', 'kasza', 'ryż', 'makaron', 'mąka', 'kuskus', 'komosa', 'quinoa', 'wafle ryżowe']):
        return 'Produkty zbożowe'
    if any(k in n for k in ['oliwa', 'olej', 'orzech', 'migdał', 'nasiona', 'pestki', 'masło orzechowe', 'wiórki kokosowe', 'sezam', 'chia']):
        return 'Tłuszcze, nasiona i orzechy'
    return 'Inne'

def is_ingredient_line(line: str) -> bool:
    line_clean = line.strip()
    return bool(re.search(
        r'(?:,\s*\d+(?:[.,]\d+)?\s*(?:g|ml)|\b\d+(?:[.,]\d+)?\s*(?:g|ml))\s*$',
        line_clean,
        re.IGNORECASE
    ))

def parse_ingredient_line(line: str) -> Tuple[str, str, float, str]:
    """
    Parsuje pojedynczy wiersz składnika z formatu NFZ:
    'jaja kurze 2 sztuki, 100 g' -> ('jaja kurze', '2 sztuki', 100.0, 'g')
    'oliwa z oliwek 1 łyżeczka, 5 ml' -> ('oliwa z oliwek', '1 łyżeczka', 5.0, 'ml')
    """
    line_clean = line.strip()
    m = re.search(
        r'^(.*?)\s+((?:(?:(?:\d+(?:[.,]\d+)?(?:\s*/\s*\d+)?|\d+\s+\d+/\d+|do smaku|porcja)\s+[\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+),?\s*)?(\d+(?:[.,]\d+)?)\s*(g|ml))$',
        line_clean,
        re.IGNORECASE
    )
    if m:
        name = m.group(1).strip()
        measure = (m.group(2) or '').strip().rstrip(',')
        amount = float(m.group(3).replace(',', '.'))
        unit = m.group(4).lower()
        return name, measure, amount, unit
    return line_clean, '', 0.0, 'g'

def parse_nfz_pdf_text(full_text_pages: List[str]) -> List[Dict[str, Any]]:
    """Wyodrębnia dni, posiłki, składniki i instrukcje z surowego tekstu stron PDF."""
    cleaned_pages = []
    for txt in full_text_pages:
        lines = [l for l in txt.splitlines() if not l.startswith('Powered by') and 'DIETYNFZ' not in l]
        cleaned_pages.append('\n'.join(lines))

    all_content = '\n'.join(cleaned_pages)
    
    # Podział na dni (ignorujemy datę kalendarzową, numerujemy kolejno 1..N)
    day_blocks = re.split(r'\n(?=[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+\s+\d{2}\.\d{2}\.\d{4})', all_content)
    # Filtrujemy tylko bloki zawierające posiłki
    day_blocks = [b for b in day_blocks if re.search(r'(Śniadanie|Drugie śniadanie|Obiad|Kolacja)', b, re.IGNORECASE)]

    meal_split_re = re.compile(
        r'(Śniadanie|Drugie śniadanie|Obiad|Kolacja|Przekąska|Podwieczorek)\s*\((\d+)\s*kcal\)\s*'
        r'białko\s+(\d+(?:[.,]\d+)?)\s*g\s+tłuszcze\s+(\d+(?:[.,]\d+)?)\s*g\s+węglowodany\s+(\d+(?:[.,]\d+)?)\s*g(?:\s+(\d+)\s*min)?',
        re.IGNORECASE
    )

    parsed_days = []

    for d_idx, day_str in enumerate(day_blocks, start=1):
        matches = list(meal_split_re.finditer(day_str))
        day_meals = []

        for idx, m in enumerate(matches):
            m_type_raw, kcal_str, p_str, f_str, c_str, prep_str = m.groups()
            
            # Normalizacja nazwy posiłku do MealCategory
            m_type_lower = m_type_raw.lower()
            if 'drugie' in m_type_lower:
                category = MealCategory.SECOND_BREAKFAST
            elif 'śniadanie' in m_type_lower:
                category = MealCategory.BREAKFAST
            elif 'obiad' in m_type_lower:
                category = MealCategory.LUNCH
            elif 'kolacja' in m_type_lower:
                category = MealCategory.DINNER
            else:
                category = MealCategory.SNACK

            start_pos = m.end()
            end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(day_str)
            body = day_str[start_pos:end_pos].strip()
            lines = [l.strip() for l in body.splitlines() if l.strip()]

            title_lines = []
            ing_lines = []
            instr_lines = []

            state = 'title'
            for line in lines:
                if state == 'title':
                    if is_ingredient_line(line):
                        state = 'ingredients'
                        ing_lines.append(line)
                    else:
                        title_lines.append(line)
                elif state == 'ingredients':
                    if is_ingredient_line(line):
                        ing_lines.append(line)
                    else:
                        state = 'instructions'
                        instr_lines.append(line)
                else:
                    instr_lines.append(line)

            title = ' '.join(title_lines).strip()
            # Usuń ewentualne podwójne spacje
            title = re.sub(r'\s+', ' ', title)

            ingredients = []
            for ing_str in ing_lines:
                name, measure, amount_g, unit = parse_ingredient_line(ing_str)
                if name and amount_g > 0:
                    ingredients.append({
                        "name": name,
                        "measure": measure,
                        "amount_g": amount_g,
                        "unit": unit
                    })

            instructions_text = ' '.join(instr_lines).strip()
            if not instructions_text:
                instructions_text = f"Przygotuj składniki na {category.lower()} i wymieszaj zgodnie ze sztuką kulinarną."

            day_meals.append({
                "meal_type": category,
                "title": title,
                "calories": float(kcal_str),
                "protein_g": float(p_str.replace(',', '.')),
                "fat_g": float(f_str.replace(',', '.')),
                "carbs_g": float(c_str.replace(',', '.')),
                "preparation_time_minutes": int(prep_str) if prep_str else 15,
                "ingredients": ingredients,
                "instructions": instructions_text
            })

        if day_meals:
            parsed_days.append({
                "day_number": d_idx,
                "day_name": f"Dzień {d_idx}",
                "meals": day_meals
            })

    return parsed_days

def import_diet_from_pdf(
    pdf_source: Union[io.BytesIO, bytes, str],
    template_name: str = "M_1500_cal",
    dietitian: Optional[User] = None,
    target_gender: str = "male",
    category: str = "Bez grupy",
    description: Optional[str] = None
) -> Dict[str, Any]:
    """
    Główna funkcja importu:
    1. Odczytuje PDF przez pypdf.
    2. Parsuje dni i posiłki.
    3. Przeprowadza inteligentną deduplikację (wyszukuje istniejące przepisy wg znormalizowanego tytułu).
    4. Tworzy nowe przepisy (oraz ich składniki/produkty) lub wykorzystuje istniejące.
    5. Tworzy szablon DietPlanTemplate z pełnymi danymi 28 dni.
    """
    if isinstance(pdf_source, bytes):
        pdf_stream = io.BytesIO(pdf_source)
    elif isinstance(pdf_source, str):
        pdf_stream = open(pdf_source, 'rb')
    else:
        pdf_stream = pdf_source

    reader = pypdf.PdfReader(pdf_stream)
    pages_text = [p.extract_text() or '' for p in reader.pages]

    parsed_days = parse_nfz_pdf_text(pages_text)
    if not parsed_days:
        raise ValueError("Nie udało się wyodrębnić żadnych posiłków z podanego pliku PDF.")

    if dietitian is None:
        dietitian = User.objects.filter(role='dietitian').first() or User.objects.filter(is_superuser=True).first()

    new_recipes_created = 0
    reused_recipes_count = 0
    template_days_data = []

    clean_category = (category or "").strip() or "Bez grupy"
    clean_description = (description or "").strip() or f"Jadłospis z oficjalnych wytycznych NFZ ({NFZ_SOURCE_URL})"

    with transaction.atomic():
        # Pamięć podręczna produktów wg nazwy
        product_cache = {p.name.lower(): p for p in Product.objects.all()}

        for day in parsed_days:
            day_meals_data = []

            for meal_idx, m_info in enumerate(day["meals"], start=1):
                clean_title = m_info["title"].strip()
                normalized_title = re.sub(r'\s+', ' ', clean_title).lower()

                # Deduplikacja: szukamy istniejącego przepisu
                existing_recipe = Recipe.objects.filter(title__iexact=clean_title).first()
                if not existing_recipe:
                    # Szukanie po znormalizowanym tytule (strip interpunkcji na końcu)
                    for r in Recipe.objects.filter(category=m_info["meal_type"]):
                        if re.sub(r'\s+', ' ', r.title).lower().rstrip(' .') == normalized_title.rstrip(' .'):
                            existing_recipe = r
                            break

                if existing_recipe:
                    reused_recipes_count += 1
                    recipe = existing_recipe
                    # Upewnij się, że źródło NFZ jest w instrukcji
                    if NFZ_SOURCE_URL not in recipe.instructions:
                        recipe.instructions = recipe.instructions.strip() + NFZ_SOURCE_TEXT
                        recipe.save(update_fields=['instructions'])
                else:
                    new_recipes_created += 1
                    full_instructions = m_info["instructions"].strip()
                    if NFZ_SOURCE_URL not in full_instructions:
                        full_instructions += NFZ_SOURCE_TEXT

                    recipe = Recipe.objects.create(
                        title=clean_title,
                        category=m_info["meal_type"],
                        preparation_time_minutes=m_info["preparation_time_minutes"],
                        instructions=full_instructions,
                        default_portions=Decimal('1.0'),
                        calories=Decimal(str(m_info["calories"])),
                        protein_g=Decimal(str(m_info["protein_g"])),
                        fat_g=Decimal(str(m_info["fat_g"])),
                        carbs_g=Decimal(str(m_info["carbs_g"])),
                        created_by=dietitian,
                        is_verified=True
                    )

                    # Tworzenie składników dla nowego przepisu
                    for ing in m_info["ingredients"]:
                        prod_name = ing["name"].strip()
                        prod_key = prod_name.lower()
                        prod = product_cache.get(prod_key)

                        if not prod:
                            cat = categorize_product_by_name(prod_name)
                            # Szacunkowe makroskładniki per 100g w zależności od kategorii
                            cal_100 = Decimal('150.0')
                            p_100 = Decimal('8.0')
                            f_100 = Decimal('5.0')
                            c_100 = Decimal('18.0')
                            if cat == 'Warzywa':
                                cal_100, p_100, f_100, c_100 = Decimal('30.0'), Decimal('2.0'), Decimal('0.5'), Decimal('5.0')
                            elif cat == 'Owoce':
                                cal_100, p_100, f_100, c_100 = Decimal('55.0'), Decimal('1.0'), Decimal('0.3'), Decimal('13.0')
                            elif cat == 'Mięso i wędliny':
                                cal_100, p_100, f_100, c_100 = Decimal('140.0'), Decimal('22.0'), Decimal('5.0'), Decimal('0.5')
                            elif cat == 'Ryby i owoce morza':
                                cal_100, p_100, f_100, c_100 = Decimal('180.0'), Decimal('20.0'), Decimal('11.0'), Decimal('0.0')
                            elif cat == 'Tłuszcze, nasiona i orzechy':
                                cal_100, p_100, f_100, c_100 = Decimal('650.0'), Decimal('15.0'), Decimal('60.0'), Decimal('12.0')
                            elif cat == 'Nabiał':
                                cal_100, p_100, f_100, c_100 = Decimal('90.0'), Decimal('12.0'), Decimal('3.0'), Decimal('4.0')
                            elif cat == 'Pieczywo':
                                cal_100, p_100, f_100, c_100 = Decimal('240.0'), Decimal('8.0'), Decimal('1.5'), Decimal('48.0')

                            prod = Product.objects.create(
                                name=prod_name,
                                store=StoreChoice.OGOLNE,
                                category=cat,
                                unit=ing["unit"],
                                calories_per_100g=cal_100,
                                protein_per_100g=p_100,
                                fat_per_100g=f_100,
                                carbs_per_100g=c_100,
                                source='nfz_pdf_import'
                            )
                            product_cache[prod_key] = prod

                        amt = Decimal(str(ing["amount_g"]))
                        amt_female = round(amt * Decimal('0.85'), 1)
                        amt_male = amt if target_gender == 'male' else round(amt * Decimal('1.15'), 1)

                        RecipeIngredient.objects.create(
                            recipe=recipe,
                            product=prod,
                            amount_g=amt,
                            amount_female_g=amt_female,
                            amount_male_g=amt_male,
                            unit=ing["unit"]
                        )

                day_meals_data.append({
                    "recipe_id": recipe.id,
                    "meal_type": m_info["meal_type"],
                    "portions": 1.0,
                    "order": meal_idx,
                    "title": recipe.title,
                    "calories": float(recipe.calories),
                    "protein_g": float(recipe.protein_g),
                    "fat_g": float(recipe.fat_g),
                    "carbs_g": float(recipe.carbs_g)
                })

            template_days_data.append({
                "day_number": day["day_number"],
                "day_name": day["day_name"],
                "meals": day_meals_data
            })

        # Obliczenie średnich kalorii dziennych
        day_calories = [sum(m["calories"] for m in d["meals"]) for d in template_days_data]
        avg_cal = int(round(sum(day_calories) / len(day_calories))) if day_calories else 1500

        # Tworzenie lub aktualizacja DietPlanTemplate
        template, created = DietPlanTemplate.objects.get_or_create(
            name=template_name,
            dietitian=dietitian,
            defaults={
                "category": clean_category,
                "description": clean_description,
                "target_calories": avg_cal,
                "target_gender": target_gender,
                "meals_per_day": len(template_days_data[0]["meals"]) if template_days_data and "meals" in template_days_data[0] else 4,
                "days_data": template_days_data
            }
        )
        if not created:
            template.category = clean_category
            if description is not None and description.strip():
                template.description = clean_description
            template.target_calories = avg_cal
            template.target_gender = target_gender
            template.meals_per_day = len(template_days_data[0]["meals"]) if template_days_data and "meals" in template_days_data[0] else 4
            template.days_data = template_days_data
            template.save()

    total_meals_count = sum(len(d["meals"]) for d in template_days_data)

    return {
        "success": True,
        "template_id": template.id,
        "template_name": template.name,
        "category": template.category,
        "target_calories": template.target_calories,
        "target_gender": template.target_gender,
        "days": len(template_days_data),
        "meals": total_meals_count,
        "total_days": len(template_days_data),
        "total_meals": total_meals_count,
        "new_recipes_created": new_recipes_created,
        "reused_recipes_count": reused_recipes_count,
        "source": NFZ_SOURCE_URL,
        "message": f"Pomyślnie zaimportowano pakiet '{template.name}' ({len(template_days_data)} dni, {total_meals_count} posiłków). Utworzono {new_recipes_created} nowych przepisów, zrecyklingowano {reused_recipes_count} istniejących."
    }

