from ninja import Schema
from typing import List, Optional

class ProductOutSchema(Schema):
    id: int
    name: str
    store: str
    brand: str
    barcode: Optional[str] = None
    calories_per_100g: float
    protein_per_100g: float
    fat_per_100g: float
    carbs_per_100g: float
    unit: str
    category: str

class RecipeIngredientOutSchema(Schema):
    id: int
    product: ProductOutSchema
    amount_g: float
    amount_female_g: Optional[float] = None
    amount_male_g: Optional[float] = None
    unit: str
    kitchen_measure: Optional[str] = ""

class RecipeOutSchema(Schema):
    id: int
    title: str
    category: str
    preparation_time_minutes: int
    default_portions: float
    calories: float
    protein_g: float
    fat_g: float
    carbs_g: float
    calories_female: Optional[float] = None
    calories_male: Optional[float] = None
    protein_female_g: Optional[float] = None
    protein_male_g: Optional[float] = None
    fat_female_g: Optional[float] = None
    fat_male_g: Optional[float] = None
    carbs_female_g: Optional[float] = None
    carbs_male_g: Optional[float] = None
    image_url: Optional[str] = None
    is_verified: bool
    instructions: Optional[str] = ""
    ingredients: Optional[List[RecipeIngredientOutSchema]] = []

class RecipeDetailOutSchema(RecipeOutSchema):
    pass

class ScaledIngredientItemSchema(Schema):
    ingredient_id: int
    product_id: int
    product_name: str
    brand: str
    store: str
    barcode: Optional[str] = None
    original_amount: float
    scaled_amount: float
    amount_female_g: Optional[float] = None
    amount_male_g: Optional[float] = None
    unit: str
    kitchen_measure: Optional[str] = ""
    calories: float
    protein_g: float
    fat_g: float
    carbs_g: float

class ScaledRecipeOutSchema(Schema):
    recipe_id: int
    title: str
    category: str
    preparation_time_minutes: int = 20
    image_url: Optional[str] = None
    default_portions: float
    target_portions: float
    multiplier: float
    total_calories: float
    total_protein_g: float
    total_fat_g: float
    total_carbs_g: float
    ingredients: List[ScaledIngredientItemSchema]
    instructions: str

class ProductCreateSchema(Schema):
    name: str
    store: str = "Lidl"
    brand: str = ""
    barcode: Optional[str] = None
    calories_per_100g: float
    protein_per_100g: float
    fat_per_100g: float
    carbs_per_100g: float
    unit: str = "g"
    category: str = "Inne"

class RecipeIngredientInputSchema(Schema):
    product_id: int
    amount_g: float
    amount_female_g: Optional[float] = None
    amount_male_g: Optional[float] = None
    unit: Optional[str] = "g"

class RecipeCreateSchema(Schema):
    title: str
    category: str
    preparation_time_minutes: int = 20
    instructions: str
    default_portions: float = 1.0
    image_url: Optional[str] = None
    ingredients: List[RecipeIngredientInputSchema]

class RecipeUpdateSchema(Schema):
    title: Optional[str] = None
    category: Optional[str] = None
    preparation_time_minutes: Optional[int] = None
    instructions: Optional[str] = None
    default_portions: Optional[float] = None
    image_url: Optional[str] = None
    ingredients: Optional[List[RecipeIngredientInputSchema]] = None


class ReplaceRecipeSchema(Schema):
    replacement_recipe_id: int
    delete_old: bool = True
