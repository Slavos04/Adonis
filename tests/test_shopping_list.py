import pytest
from datetime import date, timedelta
from decimal import Decimal
from django.test import Client
from apps.diet_plans.models import DailyMealPlan, PlannedMeal, ShoppingListItem
from apps.recipes.models import Recipe, RecipeIngredient, MealCategory
from apps.diet_plans.services import generate_smart_shopping_list
from apps.authentication.security import generate_jwt_token

@pytest.mark.django_db
def test_shopping_list_aggregates_identical_products(db_users, sample_discount_products):
    """
    Test matematycznej poprawności agregacji inteligentnej listy zakupów:
    Ten sam produkt z Lidla (Pierś z kurczaka Rzeźnik) występuje w dwóch różnych przepisach
    w wybranym okresie. Algorytm łączy je w jedną pozycję i sumuje wagi z uwzględnieniem mnożnika porcji.
    """
    patient = db_users['patient']
    kurczak = sample_discount_products['kurczak']
    ryz = sample_discount_products['ryz']

    # Przepis 1: 200g kurczaka na porcję
    r1 = Recipe.objects.create(title='Obiad z kurczakiem 1', category=MealCategory.LUNCH, default_portions=1.0)
    RecipeIngredient.objects.create(recipe=r1, product=kurczak, amount_g=Decimal('200.0'))
    RecipeIngredient.objects.create(recipe=r1, product=ryz, amount_g=Decimal('50.0'))

    # Przepis 2: 150g kurczaka na porcję
    r2 = Recipe.objects.create(title='Obiad z kurczakiem 2', category=MealCategory.LUNCH, default_portions=1.0)
    RecipeIngredient.objects.create(recipe=r2, product=kurczak, amount_g=Decimal('150.0'))

    day1 = date.today()
    day2 = day1 + timedelta(days=2)

    # Dzień 1: Przepis 1 z 1.0 porcją -> 200g kurczaka
    plan1 = DailyMealPlan.objects.create(patient=patient, date=day1)
    PlannedMeal.objects.create(daily_plan=plan1, recipe=r1, meal_type=MealCategory.LUNCH, portions=1.0)

    # Dzień 2: Przepis 2 z 1.5 porcji -> 150g * 1.5 = 225g kurczaka
    plan2 = DailyMealPlan.objects.create(patient=patient, date=day2)
    PlannedMeal.objects.create(daily_plan=plan2, recipe=r2, meal_type=MealCategory.LUNCH, portions=1.5)

    # Generowanie listy zakupów
    items = generate_smart_shopping_list(
        patient=patient,
        start_date=day1,
        end_date=day2,
        persist=True
    )

    kurczak_item = next(i for i in items if i["product_name"] == kurczak.name)

    # Oczekiwana waga łączna: 200g + 225g = 425g
    assert kurczak_item["amount"] == 425.0
    assert kurczak_item["store"] == "Lidl"
    assert kurczak_item["recipes_count"] == 2
    assert set(kurczak_item["recipes"]) == {'Obiad z kurczakiem 1', 'Obiad z kurczakiem 2'}

@pytest.mark.django_db
def test_shopping_list_skip_and_bought_flags(db_users, sample_discount_products):
    """
    Test działania funkcji 'is_skipped' (mam w lodówce) oraz 'is_bought' (kupione).
    """
    patient = db_users['patient']
    kurczak = sample_discount_products['kurczak']
    r = Recipe.objects.create(title='Pojedynczy posiłek', default_portions=1.0)
    RecipeIngredient.objects.create(recipe=r, product=kurczak, amount_g=Decimal('180.0'))

    today = date.today()
    plan = DailyMealPlan.objects.create(patient=patient, date=today)
    PlannedMeal.objects.create(daily_plan=plan, recipe=r, portions=1.0)

    items = generate_smart_shopping_list(patient, today, today, persist=True)
    item_id = items[0]["id"]

    token = generate_jwt_token(patient)
    client = Client()

    # Oznaczenie jako pominięte (posiadane w lodówce)
    resp1 = client.post(
        "/api/diet-plans/shopping-list/toggle",
        data={"item_id": item_id, "is_skipped": True},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}"
    )
    assert resp1.status_code == 200
    assert resp1.json()["is_skipped"] is True

    # Ponowne pobranie listy zakupów powinno zapamiętać stan is_skipped
    items_after = generate_smart_shopping_list(patient, today, today, persist=True)
    assert items_after[0]["is_skipped"] is True

    # Oznaczenie jako kupione
    resp2 = client.post(
        "/api/diet-plans/shopping-list/toggle",
        data={"item_id": item_id, "is_bought": True},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token}"
    )
    assert resp2.status_code == 200
    assert resp2.json()["is_bought"] is True
