
from apps.diet_plans.models import PlannedMeal, DietPlanTemplate
from django.db import transaction
from ninja import Router
from typing import List, Optional
from django.db.models import Q
from ninja.errors import HttpError

from .models import Recipe, Product, RecipeIngredient
from .schemas import (
    ReplaceRecipeSchema,
    RecipeOutSchema, RecipeDetailOutSchema, ScaledRecipeOutSchema,
    ProductOutSchema, RecipeCreateSchema
)
from .services import scale_recipe
from .openfoodfacts import OpenFoodFactsClient
from apps.authentication.security import JWTAuth

router = Router(tags=["Przepisy i Baza Produktów"])
off_client = OpenFoodFactsClient()

@router.get("/", response=List[RecipeOutSchema], auth=None)
def list_recipes(
    request,
    category: Optional[str] = None,
    search: Optional[str] = None,
    max_calories: Optional[float] = None,
    limit: int = 500,
    offset: int = 0
):
    """Pobiera listę przepisów fitness z opcją filtrowania po kategorii, nazwie i limicie kalorii."""
    qs = Recipe.objects.all()
    if category:
        qs = qs.filter(category=category)
    if search:
        qs = qs.filter(Q(title__icontains=search) | Q(ingredients__product__name__icontains=search)).distinct()
    if max_calories:
        qs = qs.filter(calories__lte=max_calories)

    return qs[offset:offset+limit]

@router.get("/{recipe_id}", response=RecipeDetailOutSchema, auth=None)
def get_recipe_detail(request, recipe_id: int):
    """Pobiera szczegółowe dane przepisu wraz z listą składników i gramaturą."""
    recipe = Recipe.objects.prefetch_related('ingredients__product').filter(id=recipe_id).first()
    if not recipe:
        raise HttpError(404, "Nie znaleziono danego przepisu.")
    return recipe

@router.get("/{recipe_id}/scale", response=ScaledRecipeOutSchema, auth=None)
def scale_recipe_portions(request, recipe_id: int, portions: float = 1.0, gender: Optional[str] = "all"):
    """
    Automatyczne skalowanie porcji dań w locie z uwzględnieniem docelowej płci (gender).
    Matematycznie przelicza gramaturę składników, całkowitą kaloryczność i makroskładniki (białko, tłuszcze, węglowodany).
    """
    recipe = Recipe.objects.prefetch_related('ingredients__product').filter(id=recipe_id).first()
    if not recipe:
        raise HttpError(404, "Nie znaleziono danego przepisu.")

    if portions <= 0:
        raise HttpError(400, "Liczba porcji musi być większa od 0.")

    scaled_data = scale_recipe(recipe, portions, gender=gender or "all")
    return scaled_data

@router.get("/products/list", response=List[ProductOutSchema], auth=None)
def list_products(
    request,
    search: Optional[str] = None,
    store: Optional[str] = None,
    limit: int = 500
):
    """Przeglądanie lokalnej bazy produktów z sieci Lidl i Biedronka."""
    qs = Product.objects.all()
    if store:
        qs = qs.filter(store__iexact=store)
    if search:
        qs = qs.filter(Q(name__icontains=search) | Q(brand__icontains=search))
    return qs[:limit]

@router.get("/openfoodfacts/search", auth=None)
async def search_open_food_facts(request, query: str, store: Optional[str] = None):
    """
    Wyszukiwanie produktów w czasie rzeczywistym w darmowym API Open Food Facts,
    z filtrowaniem polskich marek i dyskontów (Lidl / Biedronka).
    """
    if not query or len(query.strip()) < 2:
        return []
    results = await off_client.search_products(query, store_filter=store)
    return results

@router.get("/openfoodfacts/barcode/{barcode}", auth=None)
async def get_product_by_barcode(request, barcode: str):
    """Pobranie szczegółowych makroskładników na 100g produktu po kodzie kreskowym EAN."""
    # Najpierw sprawdź w lokalnej bazie
    local_prod = await Product.objects.filter(barcode=barcode).afirst()
    if local_prod:
        return {
            "barcode": local_prod.barcode,
            "name": local_prod.name,
            "store": local_prod.store,
            "brand": local_prod.brand,
            "calories_per_100g": float(local_prod.calories_per_100g),
            "protein_per_100g": float(local_prod.protein_per_100g),
            "fat_per_100g": float(local_prod.fat_per_100g),
            "carbs_per_100g": float(local_prod.carbs_per_100g),
            "source": "local"
        }

    # Jeśli nie ma, pobierz z Open Food Facts API
    off_data = await off_client.get_product_by_barcode(barcode)
    if not off_data:
        raise HttpError(404, "Nie znaleziono produktu o podanym kodzie kreskowym.")
    return off_data

import os
import uuid
from decimal import Decimal
from django.conf import settings
from ninja import File, UploadedFile
from .schemas import ProductCreateSchema, RecipeUpdateSchema

@router.post("/products/", response=ProductOutSchema, auth=JWTAuth())
def create_product(request, payload: ProductCreateSchema):
    """Ręczne dodawanie nowego produktu do bazy przez dietetyka lub administratora."""
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Brak uprawnień.")

    prod = Product.objects.create(
        name=payload.name.strip(),
        store=payload.store,
        brand=payload.brand.strip(),
        barcode=payload.barcode.strip() if payload.barcode else None,
        calories_per_100g=Decimal(str(payload.calories_per_100g)),
        protein_per_100g=Decimal(str(payload.protein_per_100g)),
        fat_per_100g=Decimal(str(payload.fat_per_100g)),
        carbs_per_100g=Decimal(str(payload.carbs_per_100g)),
        unit=payload.unit,
        category=payload.category,
        source="manual"
    )
    return prod

@router.put("/products/{product_id}", response=ProductOutSchema, auth=JWTAuth())
def update_product(request, product_id: int, payload: ProductCreateSchema):
    """Ręczna edycja parametrów i makroskładników produktu."""
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Brak uprawnień.")

    prod = Product.objects.filter(id=product_id).first()
    if not prod:
        raise HttpError(404, "Nie znaleziono produktu.")

    prod.name = payload.name.strip()
    prod.store = payload.store
    prod.brand = payload.brand.strip()
    if payload.barcode:
        prod.barcode = payload.barcode.strip()
    prod.calories_per_100g = Decimal(str(payload.calories_per_100g))
    prod.protein_per_100g = Decimal(str(payload.protein_per_100g))
    prod.fat_per_100g = Decimal(str(payload.fat_per_100g))
    prod.carbs_per_100g = Decimal(str(payload.carbs_per_100g))
    prod.unit = payload.unit
    prod.category = payload.category
    prod.save()
    return prod

@router.delete("/products/{product_id}", auth=JWTAuth())
def delete_product(request, product_id: int):
    """Usuwanie produktu z bazy."""
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Brak uprawnień.")

    prod = Product.objects.filter(id=product_id).first()
    if not prod:
        raise HttpError(404, "Nie znaleziono produktu.")
    prod.delete()
    return {"message": "Produkt został usunięty."}

@router.post("/upload-image", auth=JWTAuth())
def upload_recipe_image(request, file: UploadedFile = File(...)):
    """Upload zdjęcia potrawy do katalogu mediów serwera."""
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Brak uprawnień.")

    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
        ext = '.jpg'

    filename = f"recipe_{uuid.uuid4().hex}{ext}"
    media_dir = settings.MEDIA_ROOT / 'recipes'
    os.makedirs(media_dir, exist_ok=True)
    target_path = media_dir / filename

    with open(target_path, 'wb') as destination:
        for chunk in file.chunks():
            destination.write(chunk)

    image_url = f"{settings.MEDIA_URL}recipes/{filename}"
    return {"image_url": image_url}

@router.post("/", response=RecipeDetailOutSchema, auth=JWTAuth())
def create_recipe(request, payload: RecipeCreateSchema):
    """Tworzenie nowego przepisu przez zalogowanego dietetyka lub administratora."""
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Tylko dietetycy i administratorzy mogą dodawać nowe przepisy.")

    recipe = Recipe.objects.create(
        title=payload.title,
        category=payload.category,
        preparation_time_minutes=payload.preparation_time_minutes,
        instructions=payload.instructions,
        default_portions=Decimal(str(payload.default_portions)),
        image_url=payload.image_url,
        created_by=user,
        is_verified=True
    )

    for item in payload.ingredients:
        prod = Product.objects.filter(id=item.product_id).first()
        if prod:
            RecipeIngredient.objects.create(
                recipe=recipe,
                product=prod,
                amount_g=Decimal(str(item.amount_g)),
                unit=item.unit or prod.unit
            )

    recipe.recalculate_macros_from_ingredients()
    return Recipe.objects.prefetch_related('ingredients__product').get(id=recipe.id)

@router.put("/{recipe_id}", response=RecipeDetailOutSchema, auth=JWTAuth())
def update_recipe(request, recipe_id: int, payload: RecipeUpdateSchema):
    """Ręczna edycja przepisu (tytuł, instrukcja, zdjęcie, składniki) przez dietetyka."""
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Brak uprawnień.")

    recipe = Recipe.objects.filter(id=recipe_id).first()
    if not recipe:
        raise HttpError(404, "Nie znaleziono danego przepisu.")

    if payload.title is not None:
        recipe.title = payload.title
    if payload.category is not None:
        recipe.category = payload.category
    if payload.preparation_time_minutes is not None:
        recipe.preparation_time_minutes = payload.preparation_time_minutes
    if payload.instructions is not None:
        recipe.instructions = payload.instructions
    if payload.default_portions is not None:
        recipe.default_portions = Decimal(str(payload.default_portions))
    if payload.image_url is not None:
        recipe.image_url = payload.image_url

    if payload.ingredients is not None:
        recipe.ingredients.all().delete()
        for item in payload.ingredients:
            prod = Product.objects.filter(id=item.product_id).first()
            if prod:
                RecipeIngredient.objects.create(
                    recipe=recipe,
                    product=prod,
                    amount_g=Decimal(str(item.amount_g)),
                    unit=item.unit or prod.unit
                )
        recipe.recalculate_macros_from_ingredients()
    else:
        recipe.save()

    return Recipe.objects.prefetch_related('ingredients__product').get(id=recipe.id)

def get_recipe_usages_info(recipe_id: int):
    """Sprawdza gdzie dany przepis jest użyty w szablonach i zaplanowanych posiłkach pacjentów."""
    # 1. Posiłki pacjentów
    planned_meals = PlannedMeal.objects.filter(recipe_id=recipe_id).select_related('daily_plan__patient')
    planned_usages = []
    for pm in planned_meals:
        pat = pm.daily_plan.patient
        pat_name = f"{pat.first_name} {pat.last_name} ({pat.email})".strip()
        planned_usages.append({
            "daily_plan_id": pm.daily_plan.id,
            "patient_name": pat_name,
            "date": str(pm.daily_plan.date),
            "meal_type": pm.meal_type
        })

    # 2. Szablony dietetyczne
    template_usages = []
    templates = DietPlanTemplate.objects.all()
    for tpl in templates:
        occurrences = []
        for d in (tpl.days_data or []):
            day_name = d.get('day_name') or f"Dzień {d.get('day_number', '?')}"
            for m in d.get('meals', []):
                if m.get('recipe_id') == recipe_id:
                    occurrences.append(f"{day_name} ({m.get('meal_type', 'Posiłek')})")
        if occurrences:
            template_usages.append({
                "template_id": tpl.id,
                "template_name": tpl.name,
                "category": tpl.category,
                "occurrences": occurrences
            })

    total_usages = len(planned_usages) + sum(len(t["occurrences"]) for t in template_usages)
    return {
        "recipe_id": recipe_id,
        "is_used": total_usages > 0,
        "total_usages": total_usages,
        "planned_usages": planned_usages,
        "template_usages": template_usages
    }

@router.get("/{recipe_id}/usage", auth=JWTAuth())
def check_recipe_usage(request, recipe_id: int):
    """Pobiera listę miejsc (pakietów i planów pacjentów), w których użyty jest dany przepis."""
    recipe = Recipe.objects.filter(id=recipe_id).first()
    if not recipe:
        raise HttpError(404, "Nie znaleziono przepisu.")
    return get_recipe_usages_info(recipe_id)

@router.post("/{recipe_id}/replace", auth=JWTAuth())
def replace_recipe(request, recipe_id: int, payload: ReplaceRecipeSchema):
    """
    Zastępuje dany przepis innym przepisem we wszystkich szablonach i zaplanowanych posiłkach pacjentów,
    a następnie opcjonalnie usuwa stary przepis.
    """
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Brak uprawnień.")

    old_recipe = Recipe.objects.filter(id=recipe_id).first()
    if not old_recipe:
        raise HttpError(404, "Nie znaleziono przepisu źródłowego.")

    new_recipe = Recipe.objects.filter(id=payload.replacement_recipe_id).first()
    if not new_recipe:
        raise HttpError(404, "Nie znaleziono przepisu docelowego (zamiennika).")

    if old_recipe.id == new_recipe.id:
        raise HttpError(400, "Przepis zamienny musi być inny niż przepis zastępowany.")

    with transaction.atomic():
        # 1. Zastąpienie w zaplanowanych posiłkach pacjentów
        updated_planned_count = PlannedMeal.objects.filter(recipe_id=old_recipe.id).update(recipe=new_recipe)

        # 2. Zastąpienie w szablonach pakietów
        updated_templates_count = 0
        templates = DietPlanTemplate.objects.all()
        for tpl in templates:
            modified = False
            days = tpl.days_data or []
            for d in days:
                for m in d.get('meals', []):
                    if m.get('recipe_id') == old_recipe.id:
                        m['recipe_id'] = new_recipe.id
                        m['title'] = new_recipe.title
                        m['calories'] = float(new_recipe.calories)
                        m['protein_g'] = float(new_recipe.protein_g)
                        m['fat_g'] = float(new_recipe.fat_g)
                        m['carbs_g'] = float(new_recipe.carbs_g)
                        modified = True
            if modified:
                tpl.days_data = days
                tpl.save(update_fields=['days_data'])
                updated_templates_count += 1

        # 3. Opcjonalne usunięcie starego przepisu
        old_title = old_recipe.title
        if payload.delete_old:
            old_recipe.delete()

    return {
        "success": True,
        "message": f"Pomyślnie zastąpiono przepis '{old_title}' przepisem '{new_recipe.title}' w {updated_templates_count} szablonach i {updated_planned_count} zaplanowanych posiłkach.",
        "updated_templates": updated_templates_count,
        "updated_planned_meals": updated_planned_count,
        "deleted_old": payload.delete_old
    }

@router.delete("/{recipe_id}", auth=JWTAuth())
def delete_recipe(request, recipe_id: int, force: bool = False):
    """Usuwanie przepisu przez dietetyka lub administratora z blokadą integralności."""
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Brak uprawnień.")

    recipe = Recipe.objects.filter(id=recipe_id).first()
    if not recipe:
        raise HttpError(404, "Nie znaleziono przepisu.")

    if not force:
        usage = get_recipe_usages_info(recipe_id)
        if usage["is_used"]:
            raise HttpError(409, f"Przepis jest używany w {len(usage['template_usages'])} pakietach i {len(usage['planned_usages'])} posiłkach pacjentów. Zastąp go innym przepisem przed usunięciem.")

    recipe.delete()
    return {"message": "Przepis został usunięty."}

