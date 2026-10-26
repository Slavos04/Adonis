from ninja import Router
from typing import List, Optional
from django.db.models import Q
from ninja.errors import HttpError

from .models import Recipe, Product, RecipeIngredient
from .schemas import (
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
    limit: int = 50,
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
def scale_recipe_portions(request, recipe_id: int, portions: float = 1.0):
    """
    Automatyczne skalowanie porcji dań w locie.
    Matematycznie przelicza gramaturę składników, całkowitą kaloryczność i makroskładniki (białko, tłuszcze, węglowodany).
    """
    recipe = Recipe.objects.prefetch_related('ingredients__product').filter(id=recipe_id).first()
    if not recipe:
        raise HttpError(404, "Nie znaleziono danego przepisu.")

    if portions <= 0:
        raise HttpError(400, "Liczba porcji musi być większa od 0.")

    scaled_data = scale_recipe(recipe, portions)
    return scaled_data

@router.get("/products/list", response=List[ProductOutSchema], auth=None)
def list_products(
    request,
    search: Optional[str] = None,
    store: Optional[str] = None,
    limit: int = 50
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
    local_prod = Product.objects.filter(barcode=barcode).first()
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

@router.delete("/{recipe_id}", auth=JWTAuth())
def delete_recipe(request, recipe_id: int):
    """Usuwanie przepisu przez dietetyka lub administratora."""
    user = request.auth_user
    if user.role not in ['admin', 'dietitian']:
        raise HttpError(403, "Brak uprawnień.")

    recipe = Recipe.objects.filter(id=recipe_id).first()
    if not recipe:
        raise HttpError(404, "Nie znaleziono przepisu.")
    recipe.delete()
    return {"message": "Przepis został usunięty."}

