from ninja import Schema
from typing import List, Optional, Any, Dict
from datetime import date, datetime
from apps.recipes.schemas import RecipeOutSchema

class PlannedMealOutSchema(Schema):
    id: int
    meal_type: str
    portions: float
    order: int
    is_completed: bool
    recipe: RecipeOutSchema

class DailyMealPlanOutSchema(Schema):
    id: int
    date: date
    day_name: Optional[str] = ""
    notes: Optional[str] = ""
    meals: List[PlannedMealOutSchema]
    total_calories: float
    total_protein_g: float
    total_fat_g: float
    total_carbs_g: float

class WeeklyDaySummarySchema(Schema):
    date: date
    day_name: str
    total_calories: float
    total_protein_g: float
    total_fat_g: float
    total_carbs_g: float
    meals_count: int
    meals_preview: List[Dict[str, Any]]

class WeeklyMealPlanOutSchema(Schema):
    start_date: date
    end_date: date
    days: List[WeeklyDaySummarySchema]

class PlannedMealInputSchema(Schema):
    recipe_id: int
    meal_type: str
    portions: float = 1.0
    order: int = 1

class AssignDailyPlanSchema(Schema):
    patient_id: int
    date: date
    notes: Optional[str] = ""
    meals: List[PlannedMealInputSchema]

class ShoppingListItemOutSchema(Schema):
    id: Optional[int] = None
    product_id: int
    product_name: str
    brand: str
    store: str
    category: str
    amount: float
    unit: str
    is_bought: bool
    is_skipped: bool
    recipes_count: int
    recipes: List[str]

class ToggleShoppingItemStatusSchema(Schema):
    item_id: int
    is_bought: Optional[bool] = None
    is_skipped: Optional[bool] = None

class BulkToggleShoppingItemsSchema(Schema):
    is_bought: bool
    item_ids: Optional[List[int]] = None

class TemplateMealInputSchema(Schema):
    meal_type: str
    recipe_id: int
    portions: float = 1.0

class TemplateDayInputSchema(Schema):
    day_number: int  # 1..7
    day_name: str    # "Poniedziałek", etc.
    meals: List[TemplateMealInputSchema]

class DietPlanTemplateCreateSchema(Schema):
    name: str
    category: str = "Dieta redukcyjna"
    target_gender: str = "all"
    description: Optional[str] = ""
    target_calories: int = 2000
    meals_per_day: int = 4
    days_data: List[TemplateDayInputSchema]

class AssignmentHistoryOutSchema(Schema):
    id: int
    patient_id: int
    patient_name: str
    patient_email: str
    dietitian_name: str
    start_date: date
    end_date: date
    notes: Optional[str] = ""
    created_at: datetime

class DietPlanTemplateOutSchema(Schema):
    id: int
    name: str
    category: str
    target_gender: str = "all"
    description: str
    target_calories: int
    meals_per_day: int
    days_data: List[Any]
    created_at: datetime
    assignments: List[AssignmentHistoryOutSchema] = []

class ApplyTemplateToPatientSchema(Schema):
    patient_id: int
    start_date: date
    notes: Optional[str] = ""

class PatientLoadPackageSchema(Schema):
    template_id: int
    start_date: Optional[date] = None


