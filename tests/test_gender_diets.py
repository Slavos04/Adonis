import pytest
from decimal import Decimal
from apps.recipes.models import Recipe, Product, RecipeIngredient, MealCategory
from apps.diet_plans.models import DietPlanTemplate, DailyMealPlan, PlannedMeal
from apps.diet_plans.services import generate_smart_shopping_list
from apps.recipes.services import scale_recipe
from datetime import date

@pytest.mark.django_db
def test_gender_specific_recipe_ingredients():
    """Weryfikuje, że składniki przepisu posiadają różne gramatury w zależności od płci."""
    prod = Product.objects.create(
        name="Pierś z indyka Rzeźnik",
        store="Lidl",
        brand="Rzeźnik",
        calories_per_100g=Decimal('105.0'),
        protein_per_100g=Decimal('22.0'),
        fat_per_100g=Decimal('1.5'),
        carbs_per_100g=Decimal('0.0'),
        unit="g"
    )
    recipe = Recipe.objects.create(
        title="Pieczony indyk z ziołami",
        category=MealCategory.LUNCH,
        default_portions=1.0
    )
    ing = RecipeIngredient.objects.create(
        recipe=recipe,
        product=prod,
        amount_g=Decimal('150.0'),
        amount_female_g=Decimal('120.0'),
        amount_male_g=Decimal('180.0'),
        unit="g"
    )
    recipe.recalculate_macros_from_ingredients()

    # Kobieta otrzymuje 120g
    assert ing.get_amount_for_gender('female') == 120.0
    # Mężczyzna otrzymuje 180g
    assert ing.get_amount_for_gender('male') == 180.0
    # Uniwersalna baza
    assert ing.get_amount_for_gender('all') == 150.0

    # Test skalowania w locie
    scaled_f = scale_recipe(recipe, target_portions=1.0, gender='female')
    assert scaled_f['ingredients'][0]['scaled_amount'] == 120.0

    scaled_m = scale_recipe(recipe, target_portions=1.0, gender='male')
    assert scaled_m['ingredients'][0]['scaled_amount'] == 180.0

    # Makroskładniki dla kobiet vs mężczyzn
    macros_f = recipe.get_macros_for_gender('female')
    macros_m = recipe.get_macros_for_gender('male')
    assert macros_f['calories'] < macros_m['calories']
    assert macros_f['protein_g'] < macros_m['protein_g']

@pytest.mark.django_db
def test_gender_specific_diet_templates(db_users):
    """Weryfikuje przypisywanie i filtrowanie szablonów diet z podziałem na płeć."""
    dietitian = db_users['dietitian']
    t_female = DietPlanTemplate.objects.create(
        name="[KOBIETA] Redukcja 1500 kcal",
        category="Dieta redukcyjna",
        target_gender="female",
        dietitian=dietitian,
        target_calories=1500
    )
    t_male = DietPlanTemplate.objects.create(
        name="[MĘŻCZYZNA] Redukcja 2000 kcal",
        category="Dieta redukcyjna",
        target_gender="male",
        dietitian=dietitian,
        target_calories=2000
    )
    t_all = DietPlanTemplate.objects.create(
        name="Dieta lekkostrawna uniwersalna",
        category="Dieta lekkostrawna",
        target_gender="all",
        dietitian=dietitian,
        target_calories=1850
    )

    female_plans = DietPlanTemplate.objects.filter(target_gender__in=['female', 'all'])
    assert t_female in female_plans
    assert t_all in female_plans
    assert t_male not in female_plans

    male_plans = DietPlanTemplate.objects.filter(target_gender__in=['male', 'all'])
    assert t_male in male_plans
    assert t_all in male_plans
    assert t_female not in male_plans
