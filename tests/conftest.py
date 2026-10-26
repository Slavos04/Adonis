import pytest
from decimal import Decimal
from django.contrib.auth import get_user_model
from apps.authentication.models import UserRole, PatientProfile
from apps.recipes.models import Product, Recipe, RecipeIngredient, StoreChoice, MealCategory

User = get_user_model()

@pytest.fixture
def db_users(db):
    """Fixture providing test users for all three RBAC roles."""
    admin = User.objects.create_superuser(
        email='testadmin@adonis.app',
        username='testadmin',
        password='TestPassword123!',
        first_name='Admin',
        last_name='Testowy'
    )
    
    dietitian = User.objects.create_user(
        email='testdietitian@adonis.app',
        username='testdietitian',
        password='TestPassword123!',
        first_name='Dietetyk',
        last_name='Testowy',
        role=UserRole.DIETITIAN
    )
    
    patient = User.objects.create_user(
        email='testpatient@adonis.app',
        username='testpatient',
        password='TestPassword123!',
        first_name='Pacjent',
        last_name='Testowy',
        role=UserRole.PATIENT,
        assigned_dietitian=dietitian
    )
    
    PatientProfile.objects.create(
        user=patient,
        current_weight=Decimal('80.0'),
        target_weight=Decimal('72.0'),
        height=Decimal('178.0'),
        daily_calories_goal=2000,
        protein_goal_g=Decimal('140.0'),
        fat_goal_g=Decimal('60.0'),
        carbs_goal_g=Decimal('220.0'),
        meals_per_day=4,
        official_recommendations='Regularne nawadnianie organizmu.'
    )
    
    return {
        'admin': admin,
        'dietitian': dietitian,
        'patient': patient
    }

@pytest.fixture
def sample_discount_products(db):
    """Fixture providing sample Lidl and Biedronka products."""
    kurczak_lidl = Product.objects.create(
        name='Pierś z kurczaka Rzeźnik',
        store=StoreChoice.LIDL,
        brand='Rzeźnik',
        barcode='590000000001',
        calories_per_100g=Decimal('99.0'),
        protein_per_100g=Decimal('21.5'),
        fat_per_100g=Decimal('1.3'),
        carbs_per_100g=Decimal('0.0'),
        unit='g',
        category='Mięso'
    )
    
    ryz_lidl = Product.objects.create(
        name='Ryż basmati Golden Sun',
        store=StoreChoice.LIDL,
        brand='Golden Sun',
        barcode='590000000002',
        calories_per_100g=Decimal('355.0'),
        protein_per_100g=Decimal('8.0'),
        fat_per_100g=Decimal('0.8'),
        carbs_per_100g=Decimal('78.0'),
        unit='g',
        category='Zbożowe'
    )

    twarog_biedronka = Product.objects.create(
        name='Twaróg chudy klinek Delikate',
        store=StoreChoice.BIEDRONKA,
        brand='Delikate',
        barcode='590000000003',
        calories_per_100g=Decimal('89.0'),
        protein_per_100g=Decimal('19.8'),
        fat_per_100g=Decimal('0.5'),
        carbs_per_100g=Decimal('3.5'),
        unit='g',
        category='Nabiał'
    )

    return {
        'kurczak': kurczak_lidl,
        'ryz': ryz_lidl,
        'twarog': twarog_biedronka
    }

@pytest.fixture
def sample_recipe(db, sample_discount_products):
    """Fixture creating a recipe with exactly known ingredient amounts."""
    recipe = Recipe.objects.create(
        title='Pieczony kurczak z ryżem i ziołami',
        category=MealCategory.LUNCH,
        preparation_time_minutes=25,
        instructions='Krok 1. Ugotuj ryż. Krok 2. Upiecz kurczaka.',
        default_portions=Decimal('1.0')
    )
    # 200g kurczaka (198 kcal, 43.0g B, 2.6g T, 0g W)
    RecipeIngredient.objects.create(
        recipe=recipe,
        product=sample_discount_products['kurczak'],
        amount_g=Decimal('200.0'),
        unit='g'
    )
    # 50g ryżu (177.5 kcal, 4.0g B, 0.4g T, 39.0g W)
    RecipeIngredient.objects.create(
        recipe=recipe,
        product=sample_discount_products['ryz'],
        amount_g=Decimal('50.0'),
        unit='g'
    )
    recipe.recalculate_macros_from_ingredients()
    return recipe
