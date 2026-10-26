from django.contrib import admin
from .models import DietPlanTemplate, DailyMealPlan, PlannedMeal, ShoppingListItem

class PlannedMealInline(admin.TabularInline):
    model = PlannedMeal
    extra = 1

@admin.register(DailyMealPlan)
class DailyMealPlanAdmin(admin.ModelAdmin):
    inlines = [PlannedMealInline]
    list_display = ('patient', 'dietitian', 'date')
    list_filter = ('date',)
    search_fields = ('patient__email', 'dietitian__email')

@admin.register(ShoppingListItem)
class ShoppingListItemAdmin(admin.ModelAdmin):
    list_display = ('patient', 'product', 'aggregated_amount', 'unit', 'start_date', 'end_date', 'is_bought', 'is_skipped')
    list_filter = ('is_bought', 'is_skipped', 'start_date')
    search_fields = ('patient__email', 'product__name')

@admin.register(DietPlanTemplate)
class DietPlanTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'dietitian', 'target_calories')
