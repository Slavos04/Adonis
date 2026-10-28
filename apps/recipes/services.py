## ==============================================================================
## SERWIS MATEMATYCZNEGO SKALOWANIA PORCJI I MAKROSKŁADNIKÓW
## Przelicza proporcjonalnie gramaturę produktów, kalorie oraz B/T/W w czasie rzeczywistym
## z zachowaniem precyzji dziesiętnej (Decimal ROUND_HALF_UP).
## ==============================================================================

from decimal import Decimal, ROUND_HALF_UP

def scale_recipe(recipe, target_portions: float, gender: str = 'all') -> dict:
    """
    Skaluje składniki, kalorie oraz makroskładniki (B, T, W) przepisu
    w oparciu o współczynnik: mnożnik = porcje_docelowe / porcje_domyślne
    oraz uwzględniając docelową płeć (gender).
    """
    target = Decimal(str(target_portions))
    default = Decimal(str(recipe.default_portions))
    
    if default <= 0:
        default = Decimal('1.0')
    if target <= 0:
        target = Decimal('1.0')
        
    multiplier = target / default

    scaled_ingredients = []
    total_scaled_calories = Decimal('0.0')
    total_scaled_protein = Decimal('0.0')
    total_scaled_fat = Decimal('0.0')
    total_scaled_carbs = Decimal('0.0')

    # Przeliczenie składników
    for item in recipe.ingredients.select_related('product').all():
        base_g = item.get_amount_for_gender(gender)
        raw_amount = Decimal(str(base_g)) * multiplier
        scaled_amount = raw_amount.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        
        # Obliczenie makro dla danej przeskalowanej ilości składnika
        p_cal_factor = Decimal(str(item.product.calories_per_100g)) / Decimal('100.0')
        p_prot_factor = Decimal(str(item.product.protein_per_100g)) / Decimal('100.0')
        p_fat_factor = Decimal(str(item.product.fat_per_100g)) / Decimal('100.0')
        p_carb_factor = Decimal(str(item.product.carbs_per_100g)) / Decimal('100.0')

        ing_cal = raw_amount * p_cal_factor
        ing_prot = raw_amount * p_prot_factor
        ing_fat = raw_amount * p_fat_factor
        ing_carb = raw_amount * p_carb_factor

        total_scaled_calories += ing_cal
        total_scaled_protein += ing_prot
        total_scaled_fat += ing_fat
        total_scaled_carbs += ing_carb

        scaled_ingredients.append({
            "ingredient_id": item.id,
            "product_id": item.product.id,
            "product_name": item.product.name,
            "brand": item.product.brand,
            "store": item.product.store,
            "barcode": item.product.barcode,
            "original_amount": float(item.amount_g),
            "scaled_amount": float(scaled_amount),
            "amount_female_g": float(item.amount_female_g) if item.amount_female_g else round(float(item.amount_g) * 0.82, 1),
            "amount_male_g": float(item.amount_male_g) if item.amount_male_g else round(float(item.amount_g) * 1.18, 1),
            "unit": item.unit,
            "kitchen_measure": item.kitchen_measure,
            "calories": float(ing_cal.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)),
            "protein_g": float(ing_prot.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)),
            "fat_g": float(ing_fat.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)),
            "carbs_g": float(ing_carb.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)),
        })

    # Jeśli z jakiegoś powodu przepis nie ma składników, skalujemy bezpośrednio makro przepisu
    if not scaled_ingredients and recipe.calories > 0:
        scaled_cals = (Decimal(str(recipe.calories)) * multiplier).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        scaled_prot = (Decimal(str(recipe.protein_g)) * multiplier).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        scaled_fat = (Decimal(str(recipe.fat_g)) * multiplier).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        scaled_carbs = (Decimal(str(recipe.carbs_g)) * multiplier).quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
    else:
        scaled_cals = total_scaled_calories.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        scaled_prot = total_scaled_protein.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        scaled_fat = total_scaled_fat.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)
        scaled_carbs = total_scaled_carbs.quantize(Decimal('0.1'), rounding=ROUND_HALF_UP)

    return {
        "recipe_id": recipe.id,
        "title": recipe.title,
        "category": recipe.category,
        "preparation_time_minutes": int(recipe.preparation_time_minutes or 20),
        "image_url": recipe.image_url or "",
        "default_portions": float(recipe.default_portions),
        "target_portions": float(target),
        "multiplier": float(multiplier.quantize(Decimal('0.0001'))),
        "total_calories": float(scaled_cals),
        "total_protein_g": float(scaled_prot),
        "total_fat_g": float(scaled_fat),
        "total_carbs_g": float(scaled_carbs),
        "ingredients": scaled_ingredients,
        "instructions": recipe.instructions,
    }
