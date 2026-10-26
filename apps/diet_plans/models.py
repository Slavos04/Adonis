from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.recipes.models import Recipe, Product, MealCategory

class DietPlanTemplate(models.Model):
    name = models.CharField(_('nazwa szablonu'), max_length=255)
    category = models.CharField(_('kategoria / grupa'), max_length=100, default='Dieta redukcyjna')
    description = models.TextField(_('opis'), blank=True)
    dietitian = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='diet_templates',
        verbose_name=_('dietetyk')
    )
    target_calories = models.PositiveIntegerField(_('cel kalorii'), default=2000)
    meals_per_day = models.PositiveSmallIntegerField(_('liczba posiłków na dzień'), default=4)
    days_data = models.JSONField(_('dane jadłospisu na 7 dni'), default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('szablon diety')
        verbose_name_plural = _('szablony diet')
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.category}] {self.name} ({self.target_calories} kcal, {self.meals_per_day} posiłków)"

class DietPlanTemplateAssignment(models.Model):
    template = models.ForeignKey(
        DietPlanTemplate,
        on_delete=models.CASCADE,
        related_name='assignments',
        verbose_name=_('szablon diety')
    )
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_diet_packages',
        verbose_name=_('pacjent')
    )
    dietitian = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='sent_diet_packages',
        verbose_name=_('dietetyk')
    )
    start_date = models.DateField(_('data rozpoczęcia'))
    end_date = models.DateField(_('data zakończenia'))
    notes = models.TextField(_('notatki'), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('przypisanie pakietu diety')
        verbose_name_plural = _('przypisania pakietów diet')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.template.name} -> {self.patient.email} od {self.start_date}"

class DailyMealPlan(models.Model):
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='daily_plans',
        verbose_name=_('pacjent')
    )
    dietitian = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='prescribed_plans',
        verbose_name=_('dietetyk')
    )
    date = models.DateField(_('data jadłospisu'), db_index=True)
    notes = models.TextField(_('notatki / wskazówki'), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('dzienny jadłospis')
        verbose_name_plural = _('dzienne jadłospisy')
        unique_together = ('patient', 'date')
        ordering = ['date']

    def __str__(self):
        return f"Jadłospis {self.patient.email} na {self.date}"

class PlannedMeal(models.Model):
    daily_plan = models.ForeignKey(
        DailyMealPlan,
        on_delete=models.CASCADE,
        related_name='meals',
        verbose_name=_('jadłospis')
    )
    recipe = models.ForeignKey(
        Recipe,
        on_delete=models.CASCADE,
        related_name='planned_usages',
        verbose_name=_('przepis')
    )
    meal_type = models.CharField(
        _('rodzaj posiłku'),
        max_length=50,
        choices=MealCategory.choices,
        default=MealCategory.LUNCH
    )
    portions = models.DecimalField(_('liczba porcji'), max_digits=4, decimal_places=2, default=1.0)
    order = models.PositiveSmallIntegerField(_('kolejność w ciągu dnia'), default=1)
    is_completed = models.BooleanField(_('oznaczony jako zjedzony'), default=False)

    class Meta:
        verbose_name = _('zaplanowany posiłek')
        verbose_name_plural = _('zaplanowane posiłki')
        ordering = ['daily_plan__date', 'order']

    def __str__(self):
        return f"{self.meal_type}: {self.recipe.title} ({self.portions} porcji)"

class ShoppingListItem(models.Model):
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shopping_items',
        verbose_name=_('pacjent')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='shopping_usages',
        verbose_name=_('produkt')
    )
    aggregated_amount = models.DecimalField(_('zagregowana waga/ilość'), max_digits=8, decimal_places=2)
    unit = models.CharField(_('jednostka'), max_length=20, default='g')
    start_date = models.DateField(_('początek okresu'), db_index=True)
    end_date = models.DateField(_('koniec okresu'), db_index=True)
    is_bought = models.BooleanField(_('kupione'), default=False)
    is_skipped = models.BooleanField(_('pominięte / mam w domu'), default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('pozycja listy zakupów')
        verbose_name_plural = _('pozycje listy zakupów')
        unique_together = ('patient', 'product', 'start_date', 'end_date')

    def __str__(self):
        status = " (Kupione)" if self.is_bought else (" (Pominięte)" if self.is_skipped else "")
        return f"{self.product.name}: {self.aggregated_amount} {self.unit}{status}"
