from ninja import Schema
from typing import Optional
from datetime import date, datetime

class LoginSchema(Schema):
    email: str
    password: str

class RegisterSchema(Schema):
    email: str
    password: str
    username: Optional[str] = None
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    role: Optional[str] = "patient"  # patient | dietitian | admin

class UserOutSchema(Schema):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    role: str
    avatar_url: Optional[str] = None
    phone_number: Optional[str] = None
    assigned_dietitian_id: Optional[int] = None
    assigned_dietitian_name: Optional[str] = None
    is_active: bool = True

class PatientProfileOutSchema(Schema):
    current_weight: float
    target_weight: float
    height: float
    birth_date: Optional[date] = None
    gender: str
    activity_level: str
    daily_calories_goal: int
    protein_goal_g: float
    fat_goal_g: float
    carbs_goal_g: float
    meals_per_day: int
    official_recommendations: str
    recommendations_updated_at: Optional[datetime] = None

class PatientProfileUpdateSchema(Schema):
    current_weight: Optional[float] = None
    target_weight: Optional[float] = None
    height: Optional[float] = None
    daily_calories_goal: Optional[int] = None
    protein_goal_g: Optional[float] = None
    fat_goal_g: Optional[float] = None
    carbs_goal_g: Optional[float] = None
    meals_per_day: Optional[int] = None
    official_recommendations: Optional[str] = None

class AuthResponseSchema(Schema):
    token: str
    user: UserOutSchema
    profile: Optional[PatientProfileOutSchema] = None
    message: str = "Sukces"

class PatientRecommendationOutSchema(Schema):
    id: int
    patient_id: int
    dietitian_id: Optional[int] = None
    dietitian_name: Optional[str] = None
    title: str
    content: str
    created_at: datetime

class AddRecommendationSchema(Schema):
    title: Optional[str] = "Oficjalne zalecenia dietetyczne"
    content: str

class AdminUpdateUserSchema(Schema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    assigned_dietitian_id: Optional[int] = None
    password: Optional[str] = None

class UserNotificationSettingsSchema(Schema):
    notify_new_diet_plan: bool = True
    notify_recommendations: bool = True
    notify_chat_messages: bool = True
    notify_upcoming_meals: bool = True
    app_theme: str = "emerald"

class ChangePasswordSchema(Schema):
    old_password: str
    new_password: str

class ForgotPasswordSchema(Schema):
    email: str

class ResetPasswordSchema(Schema):
    email: str
    code: str
    new_password: str



