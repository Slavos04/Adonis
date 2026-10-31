from decimal import Decimal, ROUND_HALF_UP
from datetime import date
from typing import List, Optional, Dict, Any
from .models import DailyMealPlan, PlannedMeal, ShoppingListItem

def generate_smart_shopping_list(
    patient,
    start_date: date,
    end_date: date,
    meal_types: Optional[List[str]] = None,
    persist: bool = True
) -> List[Dict[str, Any]]:
    """
    Generates an aggregated shopping list for a patient over a selected date range.
    
    1. Finds all PlannedMeals for the patient between start_date and end_date.
    2. Filters by meal_types if provided (e.g. ['Śniadanie', 'Obiad']).
    3. Multiplies ingredient grams by the meal's portion multiplier.
    4. Groups and sums identical products (e.g. Pierś z kurczaka Rzeźnik from Lidl).
    5. Preserves existing 'is_bought' and 'is_skipped' flags from the database.
    """
    plans = DailyMealPlan.objects.filter(
        patient=patient,
        date__range=[start_date, end_date]
    ).prefetch_related('meals__recipe__ingredients__product')

    product_totals: Dict[int, Dict[str, Any]] = {}

    patient_gender = 'all'
    if hasattr(patient, 'patient_profile') and patient.patient_profile and patient.patient_profile.gender:
        patient_gender = patient.patient_profile.gender.lower()

    for plan in plans:
        for meal in plan.meals.all():
            if meal_types and meal.meal_type not in meal_types:
                continue

            multiplier = Decimal(str(meal.portions)) / Decimal(str(meal.recipe.default_portions or 1.0))

            for ing in meal.recipe.ingredients.all():
                prod = ing.product
                base_g = ing.get_amount_for_gender(patient_gender)
                needed_amount = Decimal(str(base_g)) * multiplier

                if prod.id not in product_totals:
                    product_totals[prod.id] = {
                        "product": prod,
                        "product_id": prod.id,
                        "product_name": prod.name,
                        "brand": prod.brand,
                        "store": prod.store,
                        "unit": ing.unit,
                        "category": prod.category,
                        "total_amount": Decimal('0.0'),
                        "recipes_used_in": set(),
                    }

                product_totals[prod.id]["total_amount"] += needed_amount
                product_totals[prod.id]["recipes_used_in"].add(meal.recipe.title)

    # Odczytanie lub utworzenie encji ShoppingListItem w bazie danych
    existing_items = {}
    if persist:
        qs = ShoppingListItem.objects.filter(
            patient=patient,
            start_date=start_date,
            end_date=end_date
        )
        for item in qs:
            existing_items[item.product_id] = item

    results = []
    for prod_id, data in product_totals.items():
        total_qty = data["total_amount"].quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        prod = data["product"]

        is_bought = False
        is_skipped = False
        item_id = None

        if persist:
            item = existing_items.get(prod_id)
            if item:
                item.aggregated_amount = total_qty
                item.save(update_fields=['aggregated_amount'])
                is_bought = item.is_bought
                is_skipped = item.is_skipped
                item_id = item.id
            else:
                new_item = ShoppingListItem.objects.create(
                    patient=patient,
                    product=prod,
                    aggregated_amount=total_qty,
                    unit=data["unit"],
                    start_date=start_date,
                    end_date=end_date,
                    is_bought=False,
                    is_skipped=False
                )
                item_id = new_item.id

        results.append({
            "id": item_id,
            "product_id": prod.id,
            "product_name": prod.name,
            "brand": prod.brand,
            "store": prod.store,
            "category": prod.category,
            "amount": float(total_qty),
            "unit": data["unit"],
            "is_bought": is_bought,
            "is_skipped": is_skipped,
            "recipes_count": len(data["recipes_used_in"]),
            "recipes": list(data["recipes_used_in"]),
        })

    # Sortowanie po sklepie (Lidl, Biedronka, inne) i nazwie
    results.sort(key=lambda x: (x["store"], x["product_name"]))
    return results

SHOPPING_CATEGORY_ORDER = [
    'Warzywa',
    'Owoce',
    'Nabiał',
    'Mięso i wędliny',
    'Ryby i owoce morza',
    'Pieczywo',
    'Produkty zbożowe',
    'Tłuszcze, nasiona i orzechy',
    'Inne produkty'
]

def normalize_shopping_category(cat: Optional[str]) -> str:
    if not cat:
        return 'Inne produkty'
    c = cat.lower()
    if 'warzyw' in c:
        return 'Warzywa'
    if 'owoc' in c and 'morza' not in c:
        return 'Owoce'
    if any(k in c for k in ['nabiał', 'nabial', 'mleko', 'jogurt', 'ser', 'twaróg', 'twarog', 'kefir', 'skyr']):
        return 'Nabiał'
    if any(k in c for k in ['mięs', 'mies', 'drób', 'drob', 'wędlin', 'wedlin', 'kurczak', 'indyk', 'szynk']):
        return 'Mięso i wędliny'
    if any(k in c for k in ['ryb', 'morza', 'łosoś', 'losos', 'dorsz', 'tuńczyk', 'tunczyk']):
        return 'Ryby i owoce morza'
    if any(k in c for k in ['pieczyw', 'chleb', 'bułk', 'bulk']):
        return 'Pieczywo'
    if any(k in c for k in ['zboż', 'zboz', 'płatk', 'platk', 'kasz', 'ryż', 'ryz', 'makaron', 'mąk', 'mak']):
        return 'Produkty zbożowe'
    if any(k in c for k in ['tłuszcz', 'tluszcz', 'oliw', 'olej', 'orzech', 'nasion', 'masło', 'maslo']):
        return 'Tłuszcze, nasiona i orzechy'
    return 'Inne produkty'

