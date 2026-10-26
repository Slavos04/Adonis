import pytest
from decimal import Decimal
from datetime import date, timedelta
from django.test import Client
from apps.authentication.models import User, UserRole
from apps.recipes.models import Product, Recipe, MealCategory
from apps.diet_plans.models import DailyMealPlan, PlannedMeal, DietPlanTemplate
from apps.chat.models import Notification
from apps.authentication.security import generate_jwt_token

@pytest.mark.django_db
def test_weekly_calendar_and_templates_flow():
    # Setup test users
    dietitian = User.objects.create(
        email='diet_test@adonis.app',
        username='diet_test',
        role=UserRole.DIETITIAN
    )
    patient = User.objects.create(
        email='patient_test@adonis.app',
        username='patient_test',
        role=UserRole.PATIENT,
        assigned_dietitian=dietitian
    )
    product = Product.objects.create(
        name='Test Skyr',
        store='Lidl',
        calories_per_100g=Decimal('65.0'),
        protein_per_100g=Decimal('12.0'),
        fat_per_100g=Decimal('0.2'),
        carbs_per_100g=Decimal('4.0'),
    )
    recipe = Recipe.objects.create(
        title='Owsianka Testowa',
        category=MealCategory.BREAKFAST,
        preparation_time_minutes=15,
        instructions='Wymieszaj i podgrzej.',
        calories=Decimal('350.0'),
        protein_g=Decimal('25.0'),
        fat_g=Decimal('5.0'),
        carbs_g=Decimal('45.0'),
        image_url='https://example.com/photo.jpg',
        created_by=dietitian
    )

    client = Client()
    patient_token = generate_jwt_token(patient)
    dietitian_token = generate_jwt_token(dietitian)

    # 1. Test Weekly Calendar endpoint
    today = date.today()
    mon = today - timedelta(days=today.weekday())

    # Create a daily plan for Monday
    dp = DailyMealPlan.objects.create(patient=patient, date=mon, dietitian=dietitian)
    PlannedMeal.objects.create(daily_plan=dp, recipe=recipe, meal_type=MealCategory.BREAKFAST, portions=1.0, order=1)

    weekly_resp = client.get(
        f'/api/diet-plans/weekly?start_date={mon}',
        HTTP_AUTHORIZATION=f'Bearer {patient_token}'
    )
    assert weekly_resp.status_code == 200
    weekly_data = weekly_resp.json()
    assert len(weekly_data['days']) == 7
    # Day 1 has 1 meal preview
    assert weekly_data['days'][0]['meals_count'] == 1
    assert weekly_data['days'][0]['meals_preview'][0]['recipe_title'] == 'Owsianka Testowa'
    assert weekly_data['days'][0]['meals_preview'][0]['calories'] == 350.0

    # 2. Test Diet Template Package Creation
    tpl_payload = {
        'name': 'Testowa Dieta Niskokaloryczna 1600 kcal',
        'category': 'Dieta niskokaloryczna',
        'description': 'Testowy pakiet redukcyjny na 7 dni',
        'target_calories': 1600,
        'meals_per_day': 3,
        'days_data': [
            {
                'day_number': i + 1,
                'day_name': f'Dzień {i+1}',
                'meals': [
                    {'meal_type': 'Śniadanie', 'recipe_id': recipe.id, 'portions': 1.0},
                    {'meal_type': 'Obiad', 'recipe_id': recipe.id, 'portions': 1.5},
                    {'meal_type': 'Kolacja', 'recipe_id': recipe.id, 'portions': 1.0},
                ]
            } for i in range(7)
        ]
    }

    create_tpl_resp = client.post(
        '/api/diet-plans/templates',
        data=tpl_payload,
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {dietitian_token}'
    )
    assert create_tpl_resp.status_code == 200
    created_tpl = create_tpl_resp.json()
    tpl_id = created_tpl['id']
    assert created_tpl['name'] == 'Testowa Dieta Niskokaloryczna 1600 kcal'
    assert len(created_tpl['days_data']) == 7

    # 3. Test Sending Package to Patient
    send_payload = {
        'patient_id': patient.id,
        'start_date': str(mon + timedelta(days=7)),
        'notes': 'Pakiet wdrożony na kolejny tydzień'
    }
    send_resp = client.post(
        f'/api/diet-plans/templates/{tpl_id}/send-to-patient',
        data=send_payload,
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {dietitian_token}'
    )
    assert send_resp.status_code == 200
    assert send_resp.json()['days_assigned'] == 7

    # Verify that the 7 days were actually created for patient
    new_plans = DailyMealPlan.objects.filter(
        patient=patient,
        date__gte=mon + timedelta(days=7)
    )
    assert new_plans.count() == 7
    # Verify that patient received notification
    notif = Notification.objects.filter(recipient=patient).first()
    assert notif is not None
    assert 'Testowa Dieta Niskokaloryczna' in notif.title

@pytest.mark.django_db
def test_recipes_and_products_crud():
    dietitian = User.objects.create(
        email='diet_crud@adonis.app',
        username='diet_crud',
        role=UserRole.DIETITIAN
    )
    dietitian_token = generate_jwt_token(dietitian)
    client = Client()

    # Product CRUD
    prod_payload = {
        'name': 'Nowy Produkt Testowy',
        'store': 'Biedronka',
        'brand': 'Plony Natury',
        'barcode': '590999888111',
        'calories_per_100g': 120.0,
        'protein_per_100g': 10.0,
        'fat_per_100g': 2.0,
        'carbs_per_100g': 15.0,
        'unit': 'g',
        'category': 'Zbożowe'
    }
    create_prod_resp = client.post(
        '/api/recipes/products/',
        data=prod_payload,
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {dietitian_token}'
    )
    assert create_prod_resp.status_code == 200
    prod_data = create_prod_resp.json()
    prod_id = prod_data['id']
    assert prod_data['name'] == 'Nowy Produkt Testowy'

    # Recipe CRUD
    rec_payload = {
        'title': 'Nowy Przepis Testowy ze Zdjęciem',
        'category': 'Obiad',
        'preparation_time_minutes': 25,
        'instructions': 'Gotuj 20 minut na wolnym ogniu.',
        'default_portions': 1.0,
        'image_url': 'https://images.unsplash.com/photo-test',
        'ingredients': [{'product_id': prod_id, 'amount_g': 150.0}]
    }
    create_rec_resp = client.post(
        '/api/recipes/',
        data=rec_payload,
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {dietitian_token}'
    )
    assert create_rec_resp.status_code == 200
    rec_data = create_rec_resp.json()
    assert rec_data['title'] == 'Nowy Przepis Testowy ze Zdjęciem'
    assert rec_data['image_url'] == 'https://images.unsplash.com/photo-test'


@pytest.mark.django_db
def test_recommendations_history_and_notifications():
    dietitian = User.objects.create(
        email='diet_rec@adonis.app',
        username='diet_rec',
        role=UserRole.DIETITIAN
    )
    patient = User.objects.create(
        email='patient_rec@adonis.app',
        username='patient_rec',
        role=UserRole.PATIENT,
        assigned_dietitian=dietitian
    )
    patient_token = generate_jwt_token(patient)
    dietitian_token = generate_jwt_token(dietitian)
    client = Client()

    # 1. Dietitian posts a new recommendation
    rec_resp = client.post(
        f'/api/auth/patients/{patient.id}/recommendations',
        data={'title': 'Zalecenia przy Colitis Ulcerosa', 'content': 'Pij dużo wody, unikaj skórek owoców i ostrych przypraw.'},
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {dietitian_token}'
    )
    assert rec_resp.status_code == 200
    rec_data = rec_resp.json()
    assert rec_data['title'] == 'Zalecenia przy Colitis Ulcerosa'
    assert 'wody' in rec_data['content']


    # 2. Patient verifies notification was automatically created
    notifs = Notification.objects.filter(recipient=patient, notification_type=Notification.NotificationType.RECOMMENDATION)
    assert notifs.count() == 1
    assert 'Nowe zalecenia dietetyczne' in notifs.first().title

    # 3. Patient views recommendations history
    history_resp = client.get(
        '/api/auth/me/recommendations-history',
        HTTP_AUTHORIZATION=f'Bearer {patient_token}'
    )
    assert history_resp.status_code == 200
    history = history_resp.json()
    assert len(history) == 1
    assert history[0]['title'] == 'Zalecenia przy Colitis Ulcerosa'
    assert history[0]['dietitian_id'] == dietitian.id

