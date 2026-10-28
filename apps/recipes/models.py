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

    def get_macros_for_gender(self, gender: str = 'all') -> dict:
        """Oblicza kalorie i makroskładniki (B/T/W) uwzględniając podział na płeć."""
        total_cal = 0.0
        total_p = 0.0
        total_f = 0.0
        total_c = 0.0
        for item in self.ingredients.select_related('product').all():
            amt = item.get_amount_for_gender(gender)
            factor = amt / 100.0
            total_cal += float(item.product.calories_per_100g) * factor
            total_p += float(item.product.protein_per_100g) * factor
            total_f += float(item.product.fat_per_100g) * factor
            total_c += float(item.product.carbs_per_100g) * factor
        return {
            'calories': round(total_cal, 1),
            'protein_g': round(total_p, 1),
            'fat_g': round(total_f, 1),
            'carbs_g': round(total_c, 1),
        }

    @property
    def calories_female(self):
        return self.get_macros_for_gender('female')['calories']

    @property
    def calories_male(self):
        return self.get_macros_for_gender('male')['calories']

    @property
    def protein_female_g(self):
        return self.get_macros_for_gender('female')['protein_g']

    @property
    def protein_male_g(self):
        return self.get_macros_for_gender('male')['protein_g']

    @property
    def fat_female_g(self):
        return self.get_macros_for_gender('female')['fat_g']

    @property
    def fat_male_g(self):
        return self.get_macros_for_gender('male')['fat_g']

    @property
    def carbs_female_g(self):
        return self.get_macros_for_gender('female')['carbs_g']

    @property
    def carbs_male_g(self):
        return self.get_macros_for_gender('male')['carbs_g']

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
    amount_g = models.DecimalField(_('ilość bazowa (g / ml)'), max_digits=7, decimal_places=2)
    amount_female_g = models.DecimalField(_('ilość dla kobiet (g / ml)'), max_digits=7, decimal_places=2, null=True, blank=True)
    amount_male_g = models.DecimalField(_('ilość dla mężczyzn (g / ml)'), max_digits=7, decimal_places=2, null=True, blank=True)
    unit = models.CharField(_('jednostka'), max_length=20, default='g')

    class Meta:
        verbose_name = _('składnik przepisu')
        verbose_name_plural = _('składniki przepisu')

    def __str__(self):
        return f"{self.product.name} - {self.amount_g} {self.unit}"

    def get_amount_for_gender(self, gender: str = 'all') -> float:
        """Zwraca gramaturę składnika dopasowaną do płci pacjenta."""
        g = (gender or '').lower()
        if g in ('female', 'kobieta', 'k'):
            if self.amount_female_g is not None and self.amount_female_g > 0:
                return float(self.amount_female_g)
        elif g in ('male', 'mężczyzna', 'mezczyzna', 'm'):
            if self.amount_male_g is not None and self.amount_male_g > 0:
                return float(self.amount_male_g)
        return float(self.amount_g)

    @property
    def kitchen_measure(self) -> str:
        """Zwraca przyjazną miarę kuchenną (łyżka, łyżeczka, szklanka, sztuka)."""
        prod_name = self.product.name if self.product else ""
        return format_kitchen_measure(prod_name, float(self.amount_g))


def format_kitchen_measure(product_name: str, amount_g: float) -> str:
    """Konwertuje gramaturę produktu na polską miarę domową (łyżki, łyżeczki, szklanki itp.)."""
    if not product_name or amount_g is None or amount_g <= 0:
        return ""
    name = product_name.lower()
    amt = float(amount_g)

    # Oliwa / oleje (1 łyżka = 10g, 1 łyżeczka = 5g)
    if 'oliwa' in name or 'olej' in name:
        if amt < 8:
            tsp = round(amt / 5.0, 1)
            t_int = int(tsp) if tsp.is_integer() else tsp
            return f"{t_int} łyżeczka" if t_int == 1 else f"{t_int} łyżeczki"
        tbsp = round(amt / 10.0, 1)
        t_int = int(tbsp) if tbsp.is_integer() else tbsp
        return f"{t_int} łyżka" if t_int == 1 else f"{t_int} łyżki" if t_int in (2, 3, 4) else f"{t_int} łyżek"

    # Miód, nasiona chia, siemię, cynamon, kakao (1 łyżeczka = 5g)
    if any(k in name for k in ['miód', 'chia', 'siemię', 'cynamon', 'kakao', 'cukier wanilinowy', 'sezam']):
        if amt >= 15:
            tbsp = round(amt / 12.0, 1)
            t_int = int(tbsp) if tbsp.is_integer() else tbsp
            return f"{t_int} łyżki" if t_int in (2, 3, 4) else f"{t_int} łyżek"
        tsp = round(amt / 5.0, 1)
        t_int = int(tsp) if tsp.is_integer() else tsp
        return f"{t_int} łyżeczka" if t_int == 1 else f"{t_int} łyżeczki" if t_int in (2, 3, 4) else f"{t_int} łyżeczek"

    # Masło orzechowe / masło (1 łyżka = 15g)
    if 'masło' in name:
        if amt < 12:
            return "1 łyżeczka"
        tbsp = round(amt / 15.0, 1)
        t_int = int(tbsp) if tbsp.is_integer() else tbsp
        return f"{t_int} łyżka" if t_int == 1 else f"{t_int} łyżki"

    # Płatki, kasze, ryż, mąka, makaron (1 łyżka = ok. 10g, 1 szklanka = 100-150g)
    if any(k in name for k in ['płatki', 'kasza', 'ryż', 'mąka', 'manna', 'jaglan', 'makaron']):
        if amt >= 100:
            cups = round(amt / 100.0, 1)
            return "1 szklanka" if 0.9 <= cups <= 1.1 else f"{cups} szklanki"
        tbsp = round(amt / 10.0, 1)
        t_int = int(tbsp) if tbsp.is_integer() else tbsp
        return f"{t_int} łyżek" if t_int >= 5 or t_int == 0 else f"{t_int} łyżki"

    # Płyny: mleko, kefir, maślanka, woda, bulion (1 szklanka = 250ml/g)
    if any(k in name for k in ['mleko', 'kefir', 'maślanka', 'bulion', 'woda']):
        if amt >= 180:
            cups = round(amt / 250.0, 1)
            return "1 szklanka" if 0.9 <= cups <= 1.1 else "1/2 szklanki" if 0.4 <= cups <= 0.6 else "3/4 szklanki" if 0.7 <= cups <= 0.85 else f"{cups} szklanki"
        tbsp = round(amt / 15.0, 1)
        t_int = int(tbsp) if tbsp.is_integer() else tbsp
        return f"{t_int} łyżek"

    # Jogurt, skyr, serek (1 kubek/opakowanie = 150g lub 1 łyżka = 25g)
    if any(k in name for k in ['jogurt', 'skyr', 'serek wiejski', 'ricotta']):
        if 130 <= amt <= 160:
            return "1 mały kubek (150g)"
        if 190 <= amt <= 220:
            return "1 duże opakowanie (200g)"
        tbsp = round(amt / 25.0, 1)
        t_int = int(tbsp) if tbsp.is_integer() else tbsp
        return f"{t_int} łyżki" if t_int in (2, 3, 4) else f"{t_int} łyżek"

    # Twaróg (1 plaster = ok. 50g, 1 kostka = 200g)
    if 'twaróg' in name:
        if 90 <= amt <= 110:
            return "1/2 kostki"
        if 190 <= amt <= 210:
            return "1 cała kostka"
        slices = round(amt / 50.0, 1)
        t_int = int(slices) if slices.is_integer() else slices
        return f"{t_int} grube plastry" if t_int > 1 else "1 gruby plaster"

    # Orzechy, migdały (1 garść = ok. 30g)
    if any(k in name for k in ['orzech', 'migdał']):
        if 20 <= amt <= 35:
            return "1 garść"
        return f"{round(amt / 30.0, 1)} garści"

    # Owoce jagodowe (borówki, jagody, maliny, truskawki)
    if any(k in name for k in ['borówk', 'jagod', 'malin', 'truskawk']):
        if amt <= 40:
            return "ok. 1 garść (2 łyżki)"
        if amt <= 80:
            return "ok. 2 garście (1/2 szklanki)"
        return "1 szklanka"

    # Chleb, pieczywo (1 kromka = ok. 35g)
    if any(k in name for k in ['chleb', 'bułka', 'pieczywo']):
        if 'bułka' in name:
            pcs = round(amt / 70.0, 1)
            return "1 sztuka" if 0.8 <= pcs <= 1.2 else f"{pcs} szt."
        slices = round(amt / 35.0, 1)
        t_int = int(slices) if slices.is_integer() else slices
        return "1 kromka" if t_int == 1 else f"{t_int} kromki" if t_int in (2, 3, 4) else f"{t_int} kromek"

    # Wędliny, szynka (1 plaster = ok. 20g)
    if any(k in name for k in ['szynka', 'polędwica', 'łosoś wędzony']):
        slices = round(amt / 20.0, 1)
        t_int = int(slices) if slices.is_integer() else slices
        return "1 plaster" if t_int == 1 else f"{t_int} plastry" if t_int in (2, 3, 4) else f"{t_int} plastrów"

    # Jajka (1 szt = ok. 55g)
    if 'jaj' in name:
        pcs = round(amt / 55.0)
        return "1 sztuka" if pcs == 1 else f"{int(pcs)} sztuki" if pcs in (2, 3, 4) else f"{int(pcs)} sztuk"

    # Owoce/warzywa
    if any(k in name for k in ['banan', 'jabłko', 'pomidor', 'gruszka', 'pomarańcza']):
        pcs = round(amt / 130.0, 1)
        return "1 średnia sztuka" if 0.8 <= pcs <= 1.2 else "1/2 sztuki" if 0.4 <= pcs <= 0.6 else f"{pcs} szt."

    if 'ogórek' in name or 'marchew' in name or 'cukinia' in name:
        if amt < 50:
            return "kawałek (kilka plasterków)"
        pcs = round(amt / 100.0, 1)
        return "1 sztuka" if 0.8 <= pcs <= 1.2 else "1/2 sztuki" if 0.4 <= pcs <= 0.6 else f"{pcs} szt."

    if 'czosnek' in name:
        cloves = round(amt / 5.0)
        return "1 ząbek" if cloves <= 1 else f"{int(cloves)} ząbki"

    return ""
