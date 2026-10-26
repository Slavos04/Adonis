import pytest
from apps.recipes.openfoodfacts import detect_store_and_brand, OpenFoodFactsClient

def test_detect_store_and_brand():
    """Weryfikuje poprawne rozpoznawanie marek własnych Lidla i Biedronki."""
    # Lidl
    store1, brand1 = detect_store_and_brand("Pilos", "Lidl")
    assert store1 == "Lidl"

    store2, brand2 = detect_store_and_brand("Rzeźnik", "")
    assert store2 == "Lidl"

    store3, brand3 = detect_store_and_brand("Vemondo", "")
    assert store3 == "Lidl"

    # Biedronka
    store4, brand4 = detect_store_and_brand("Delikate", "Biedronka")
    assert store4 == "Biedronka"

    store5, brand5 = detect_store_and_brand("Kraina Wędlin", "")
    assert store5 == "Biedronka"

    store6, brand6 = detect_store_and_brand("Marinero", "")
    assert store6 == "Biedronka"

    # Inne
    store7, brand7 = detect_store_and_brand("Bonduelle", "Auchan")
    assert store7 == "Ogolne"

def test_parse_open_food_facts_payload():
    """Weryfikuje parsowanie danych produktu z API Open Food Facts."""
    client = OpenFoodFactsClient()
    mock_payload = {
        "product_name_pl": "Skyr naturalny",
        "code": "5901234567890",
        "brands": "Pilos",
        "stores": "Lidl",
        "nutriments": {
            "energy-kcal_100g": 65.0,
            "proteins_100g": 11.8,
            "fat_100g": 0.2,
            "carbohydrates_100g": 4.1
        }
    }
    parsed = client._parse_product(mock_payload)
    assert parsed is not None
    assert parsed["name"] == "Skyr naturalny"
    assert parsed["store"] == "Lidl"
    assert parsed["calories_per_100g"] == 65.0
    assert parsed["protein_per_100g"] == 11.8
    assert parsed["fat_per_100g"] == 0.2
    assert parsed["carbs_per_100g"] == 4.1
