import pytest
from decimal import Decimal
from django.test import Client
from apps.recipes.services import scale_recipe

@pytest.mark.django_db
def test_linear_scaling_single_and_half_portion(sample_recipe):
    """
    Test matematyczny skalowania porcji dań (np. z 1.0 do 1.5 porcji).
    Weryfikuje liniowe przeliczenie gramatury składników, kalorii i makroskładników.
    """
    original_cals = float(sample_recipe.calories)
    original_prot = float(sample_recipe.protein_g)
    original_fat = float(sample_recipe.fat_g)
    original_carbs = float(sample_recipe.carbs_g)

    # Skalowanie do 1.5 porcji
    scaled = scale_recipe(sample_recipe, target_portions=1.5)

    assert scaled["target_portions"] == 1.5
    assert scaled["multiplier"] == 1.5

    # Sprawdzenie gramatury składników
    ingredients_map = {item["product_name"]: item for item in scaled["ingredients"]}
    assert "Pierś z kurczaka Rzeźnik" in ingredients_map
    assert "Ryż basmati Golden Sun" in ingredients_map

    # 200g * 1.5 = 300g
    assert ingredients_map["Pierś z kurczaka Rzeźnik"]["scaled_amount"] == 300.0
    # 50g * 1.5 = 75g
    assert ingredients_map["Ryż basmati Golden Sun"]["scaled_amount"] == 75.0

    # Sprawdzenie całkowitych kalorii i makro (z tolerancją zaokrąglenia 0.2)
    assert abs(scaled["total_calories"] - (original_cals * 1.5)) <= 0.2
    assert abs(scaled["total_protein_g"] - (original_prot * 1.5)) <= 0.2
    assert abs(scaled["total_fat_g"] - (original_fat * 1.5)) <= 0.2
    assert abs(scaled["total_carbs_g"] - (original_carbs * 1.5)) <= 0.2

@pytest.mark.django_db
def test_scaling_api_endpoint(sample_recipe):
    """Test endpointu API /api/recipes/{id}/scale ze skalowaniem do 2 porcji."""
    client = Client()
    response = client.get(f"/api/recipes/{sample_recipe.id}/scale?portions=2.0")
    assert response.status_code == 200

    data = response.json()
    assert data["target_portions"] == 2.0
    assert data["multiplier"] == 2.0

    # 200g kurczaka * 2 = 400g
    kurczak = next(i for i in data["ingredients"] if "kurczaka" in i["product_name"])
    assert kurczak["scaled_amount"] == 400.0

@pytest.mark.django_db
def test_scaling_invalid_portions_handling(sample_recipe):
    """Weryfikuje walidację niedozwolonych wartości porcji (<= 0)."""
    client = Client()
    response = client.get(f"/api/recipes/{sample_recipe.id}/scale?portions=-1")
    assert response.status_code == 400
