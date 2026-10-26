from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class StoreChoice(models.TextChoices):
    LIDL = 'Lidl', 'Lidl'
    BIEDRONKA = 'Biedronka', 'Biedronka'
    KAUFLAND = 'Kaufland', 'Kaufland'
    CARREFOUR = 'Carrefour', 'Carrefour'
    OGOLNE = 'Ogolne', 'Ogólne / Inne'

class MealCategory(models.TextChoices):
    BREAKFAST = 'Śniadanie', 'Śniadanie'
    SECOND_BREAKFAST = 'Drugie śniadanie', 'Drugie śniadanie'
    LUNCH = 'Obiad', 'Obiad'
    SNACK = 'Przekąska / Podwieczorek', 'Przekąska / Podwieczorek'
    DINNER = 'Kolacja', 'Kolacja'

class Product(models.Model):
    name = models.CharField(_('nazwa produktu'), max_length=255, db_index=True)
    store = models.CharField(_('sklep'), max_length=50, choices=StoreChoice.choices, default=StoreChoice.OGOLNE, db_index=True)
    brand = models.CharField(_('marka'), max_length=100, blank=True, db_index=True)
    barcode = models.CharField(_('kod kreskowy (EAN)'), max_length=50, blank=True, null=True, unique=True, db_index=True)
    calories_per_100g = models.DecimalField(_('kcal / 100g'), max_digits=6, decimal_places=2, default=0.0)
    protein_per_100g = models.DecimalField(_('białko / 100g (g)'), max_digits=6, decimal_places=2, default=0.0)
    fat_per_100g = models.DecimalField(_('tłuszcz / 100g (g)'), max_digits=6, decimal_places=2, default=0.0)
    carbs_per_100g = models.DecimalField(_('węglowodany / 100g (g)'), max_digits=6, decimal_places=2, default=0.0)
    unit = models.CharField(_('jednostka bazowa'), max_length=20, default='g')
    category = models.CharField(_('kategoria produktu'), max_length=100, default='Inne')
    source = models.CharField(_('źródło'), max_length=50, default='local')  # 'local' | 'open_food_facts'
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('produkt')
        verbose_name_plural = _('produkty')
        ordering = ['name']

    def __str__(self):
        store_info = f" [{self.store}]" if self.store else ""
        return f"{self.name}{store_info} ({self.calories_per_100g} kcal/100g)"

class Recipe(models.Model):
    title = models.CharField(_('tytuł przepisu'), max_length=255, db_index=True)
    category = models.CharField(_('rodzaj posiłku'), max_length=50, choices=MealCategory.choices, default=MealCategory.LUNCH)
    preparation_time_minutes = models.PositiveIntegerField(_('czas przygotowania (min)'), default=20)
    instructions = models.TextField(_('instrukcja przygotowania krok po kroku'))
    default_portions = models.DecimalField(_('domyślna liczba porcji'), max_digits=4, decimal_places=2, default=1.0)
    
    # Makroskładniki na 1 domyślną porcję
    calories = models.DecimalField(_('kalorie (kcal)'), max_digits=7, decimal_places=2, default=0.0)
    protein_g = models.DecimalField(_('białko (g)'), max_digits=6, decimal_places=2, default=0.0)
    fat_g = models.DecimalField(_('tłuszcz (g)'), max_digits=6, decimal_places=2, default=0.0)
    carbs_g = models.DecimalField(_('węglowodany (g)'), max_digits=6, decimal_places=2, default=0.0)
    
    image_url = models.CharField(_('zdjęcie potrawy'), max_length=500, blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_recipes',
        verbose_name=_('autor')
    )
    is_verified = models.BooleanField(_('zweryfikowany przez dietetyka'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('przepis')
        verbose_name_plural = _('przepisy')
        ordering = ['title']

    def __str__(self):
        return f"{self.title} ({self.category}, {self.calories} kcal)"

    def recalculate_macros_from_ingredients(self):
        """Recalculates calories and macros based on ingredient items."""
        total_cal = 0
        total_p = 0
        total_f = 0
        total_c = 0
        for item in self.ingredients.select_related('product').all():
            factor = float(item.amount_g) / 100.0
            total_cal += float(item.product.calories_per_100g) * factor
            total_p += float(item.product.protein_per_100g) * factor
            total_f += float(item.product.fat_per_100g) * factor
            total_c += float(item.product.carbs_per_100g) * factor
        
        self.calories = round(total_cal, 1)
        self.protein_g = round(total_p, 1)
        self.fat_g = round(total_f, 1)
        self.carbs_g = round(total_c, 1)
        self.save(update_fields=['calories', 'protein_g', 'fat_g', 'carbs_g'])

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='ingredients',
        verbose_name=_('przepis')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='recipe_usages',
        verbose_name=_('produkt')
    )
    amount_g = models.DecimalField(_('ilość (g / ml)'), max_digits=7, decimal_places=2)
    unit = models.CharField(_('jednostka'), max_length=20, default='g')

    class Meta:
        verbose_name = _('składnik przepisu')
        verbose_name_plural = _('składniki przepisu')

    def __str__(self):
        return f"{self.product.name} - {self.amount_g} {self.unit}"
