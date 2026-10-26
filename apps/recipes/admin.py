from django.contrib import admin
from .models import Product, Recipe, RecipeIngredient

class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1
    autocomplete_fields = ['product']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'store', 'brand', 'calories_per_100g', 'protein_per_100g', 'fat_per_100g', 'carbs_per_100g')
    list_filter = ('store', 'category')
    search_fields = ('name', 'brand', 'barcode')

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    inlines = [RecipeIngredientInline]
    list_display = ('title', 'category', 'calories', 'protein_g', 'fat_g', 'carbs_g', 'is_verified')
    list_filter = ('category', 'is_verified')
    search_fields = ('title', 'instructions')
