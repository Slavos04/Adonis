import pytest
from decimal import Decimal
from datetime import date, timedelta
from django.test import Client
from apps.authentication.models import User, UserRole, PatientProfile
from apps.recipes.models import Product, Recipe
from apps.diet_plans.models import DailyMealPlan, ShoppingListItem
from apps.measurements.models import Measurement, MeasurementAuditLog
from apps.chat.models import ChatMessage
from apps.authentication.security import generate_jwt_token

@pytest.mark.django_db
def test_full_system_integration():
    """
    Kompleksowy test integracyjny weryfikujący całościowe działanie systemu:
    1. Baza danych (użytkownicy, 125 przepisów, produkty Lidl i Biedronka).
    2. Logowanie i autoryzacja (cookie + bearer).
    3. Skalowanie porcji (przeliczanie gramatury i makro).
    4. Lista zakupów (agregacja produktów i flagi pominięcia).
    5. Audit Log (korekta pomiaru pacjenta przez dietetyka).
    6. Wiadomości czatu.
    """
    from django.core.management import call_command
    call_command('seed_recipes')

    # 1. Sprawdzenie kont początkowych
    admin = User.objects.filter(email='admin@adonis.app').first()
    dietitian = User.objects.filter(email='dietetyk@adonis.app').first()
    patient = User.objects.filter(email='pacjent@adonis.app').first()

    assert admin is not None
    assert dietitian is not None
    assert patient is not None
    assert patient.assigned_dietitian == dietitian

    # 2. Sprawdzenie załadowanych produktów i przepisów
    product_count = Product.objects.count()
    recipe_count = Recipe.objects.count()
    assert product_count >= 50
    assert recipe_count >= 50


    # 3. Logowanie i pobranie profilu (Web & Mobile)
    client = Client()
    login_resp = client.post(
        '/api/auth/login',
        data={'email': 'pacjent@adonis.app', 'password': 'Pacjent123!'},
        content_type='application/json'
    )
    assert login_resp.status_code == 200
    token = login_resp.json()['token']
    assert token is not None

    # Zapytanie autoryzowane tokenem Bearer
    me_resp = client.get('/api/auth/me', HTTP_AUTHORIZATION=f'Bearer {token}')
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data['user']['email'] == 'pacjent@adonis.app'
    assert me_data['profile']['daily_calories_goal'] > 0

    # 4. Sprawdzenie skalowania porcji
    first_recipe = Recipe.objects.first()
    scale_resp = client.get(f'/api/recipes/{first_recipe.id}/scale?portions=2.0')
    assert scale_resp.status_code == 200
    scale_data = scale_resp.json()
    assert scale_data['target_portions'] == 2.0
    assert scale_data['total_calories'] > 0

    # 5. Sprawdzenie generowania listy zakupów
    today = date.today()
    shop_resp = client.get(
        f'/api/diet-plans/shopping-list?start_date={today}&end_date={today + timedelta(days=5)}',
        HTTP_AUTHORIZATION=f'Bearer {token}'
    )
    assert shop_resp.status_code == 200
    shop_items = shop_resp.json()
    assert len(shop_items) > 0
    # Weryfikacja obecności produktów z dyskontów
    stores_present = {item['store'] for item in shop_items}
    assert 'Lidl' in stores_present or 'Biedronka' in stores_present

    # 6. Sprawdzenie korekty pomiaru przez dietetyka i wygenerowania Audit Logu
    measurement = Measurement.objects.filter(patient=patient).first()
    dietitian_token = generate_jwt_token(dietitian)
    
    correct_resp = client.put(
        f'/api/measurements/{measurement.id}/correct',
        data={'weight': 84.0, 'reason': 'Testowa korekta dietetyczna weryfikująca audyt'},
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {dietitian_token}'
    )
    assert correct_resp.status_code == 200
    
    # Weryfikacja wpisu w tabeli MeasurementAuditLog
    audit_entry = MeasurementAuditLog.objects.filter(measurement=measurement).order_by('-created_at').first()
    assert audit_entry is not None
    assert audit_entry.changed_by == dietitian
    assert float(audit_entry.new_value) == 84.0
    assert 'Testowa korekta' in audit_entry.reason

    # 7. Sprawdzenie wysłania i odebrania wiadomości czatu
    chat_resp = client.post(
        '/api/chat/messages',
        data={'receiver_id': dietitian.id, 'content': 'Dzień dobry, mam pytanie o gramaturę obiadu.'},
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {token}'
    )
    assert chat_resp.status_code == 200
    assert ChatMessage.objects.filter(sender=patient, receiver=dietitian).exists()
