package com.adonis.app.data.model

import com.google.gson.annotations.SerializedName

data class User(
    val id: Int,
    val email: String,
    val username: String,
    @SerializedName("first_name") val firstName: String,
    @SerializedName("last_name") val lastName: String,
    val role: String,
    @SerializedName("assigned_dietitian_name") val assignedDietitianName: String?
)

data class PatientProfile(
    @SerializedName("current_weight") val currentWeight: Double,
    @SerializedName("target_weight") val targetWeight: Double,
    val height: Double,
    val gender: String = "female",
    @SerializedName("daily_calories_goal") val dailyCaloriesGoal: Int,
    @SerializedName("protein_goal_g") val proteinGoalG: Double,
    @SerializedName("fat_goal_g") val fatGoalG: Double,
    @SerializedName("carbs_goal_g") val carbsGoalG: Double,
    @SerializedName("meals_per_day") val mealsPerDay: Int? = 4,
    @SerializedName("official_recommendations") val officialRecommendations: String?
)

data class AuthResponse(
    val token: String,
    val user: User,
    val profile: PatientProfile?,
    val message: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    @SerializedName("first_name") val firstName: String = "",
    @SerializedName("last_name") val lastName: String = "",
    val gender: String = "male",
    val role: String = "patient"
)

data class Product(
    val id: Int,
    val name: String,
    val store: String,
    val brand: String,
    val barcode: String?,
    @SerializedName("calories_per_100g") val caloriesPer100g: Double,
    @SerializedName("protein_per_100g") val proteinPer100g: Double,
    @SerializedName("fat_per_100g") val fatPer100g: Double,
    @SerializedName("carbs_per_100g") val carbsPer100g: Double,
    val unit: String
)

data class RecipeIngredient(
    val id: Int,
    val product: Product,
    @SerializedName("amount_g") val amountG: Double,
    @SerializedName("amount_female_g") val amountFemaleG: Double? = null,
    @SerializedName("amount_male_g") val amountMaleG: Double? = null,
    val unit: String
)

data class Recipe(
    val id: Int,
    val title: String,
    val category: String,
    @SerializedName("preparation_time_minutes") val prepTimeMinutes: Int,
    @SerializedName("default_portions") val defaultPortions: Double,
    val calories: Double,
    @SerializedName("protein_g") val proteinG: Double,
    @SerializedName("fat_g") val fatG: Double,
    @SerializedName("carbs_g") val carbsG: Double,
    @SerializedName("image_url") val imageUrl: String? = null,
    val instructions: String? = null,
    val ingredients: List<RecipeIngredient>? = null
)

data class PatientRecommendation(
    val id: Int,
    @SerializedName("patient_id") val patientId: Int,
    @SerializedName("dietitian_id") val dietitianId: Int?,
    @SerializedName("dietitian_name") val dietitianName: String?,
    val title: String,
    val content: String,
    @SerializedName("created_at") val createdAt: String
)

data class ScaledIngredient(
    @SerializedName("product_name") val productName: String,
    val store: String,
    val brand: String,
    @SerializedName("scaled_amount") val scaledAmount: Double,
    val unit: String
)

data class ScaledRecipeResponse(
    @SerializedName("recipe_id") val recipeId: Int,
    val title: String,
    @SerializedName("target_portions") val targetPortions: Double,
    @SerializedName("total_calories") val totalCalories: Double,
    @SerializedName("total_protein_g") val totalProteinG: Double,
    @SerializedName("total_fat_g") val totalFatG: Double,
    @SerializedName("total_carbs_g") val totalCarbsG: Double,
    val ingredients: List<ScaledIngredient>
)

data class PlannedMeal(
    val id: Int,
    @SerializedName("meal_type") val mealType: String,
    val portions: Double,
    val order: Int,
    @SerializedName("is_completed") val isCompleted: Boolean,
    val recipe: Recipe
)

data class DailyMealPlanResponse(
    val id: Int,
    val date: String,
    val notes: String?,
    val meals: List<PlannedMeal>,
    @SerializedName("total_calories") val totalCalories: Double,
    @SerializedName("total_protein_g") val totalProteinG: Double,
    @SerializedName("total_fat_g") val totalFatG: Double,
    @SerializedName("total_carbs_g") val totalCarbsG: Double
)

data class ShoppingListItem(
    val id: Int?,
    @SerializedName("product_id") val productId: Int,
    @SerializedName("product_name") val productName: String,
    val store: String,
    val brand: String,
    val amount: Double,
    val unit: String,
    @SerializedName("is_bought") val isBought: Boolean,
    @SerializedName("is_skipped") val isSkipped: Boolean,
    val recipes: List<String>
)

data class ToggleShoppingItemRequest(
    @SerializedName("item_id") val itemId: Int,
    @SerializedName("is_bought") val isBought: Boolean? = null,
    @SerializedName("is_skipped") val isSkipped: Boolean? = null
)

data class Measurement(
    val id: Int,
    val date: String,
    val weight: Double,
    @SerializedName("waist_cm") val waistCm: Double?,
    val notes: String?
)

data class MeasurementRequest(
    val weight: Double,
    val height: Double? = null,
    @SerializedName("waist_cm") val waistCm: Double? = null,
    val notes: String? = null,
    val date: String? = null
)

data class ChatMessage(
    val id: Int,
    @SerializedName("sender_id") val senderId: Int,
    @SerializedName("sender_name") val senderName: String,
    @SerializedName("receiver_id") val receiverId: Int,
    val content: String,
    @SerializedName("created_at") val createdAt: String
)

data class ConversationPartner(
    @SerializedName("partner_id") val partnerId: Int,
    @SerializedName("partner_name") val partnerName: String,
    @SerializedName("partner_email") val partnerEmail: String? = null,
    @SerializedName("partner_role") val partnerRole: String? = null,
    @SerializedName("partner_first_name") val partnerFirstName: String? = null,
    @SerializedName("partner_last_name") val partnerLastName: String? = null,
    @SerializedName("last_message") val lastMessage: String? = null,
    @SerializedName("unread_count") val unreadCount: Int = 0
)

data class UserNotificationSettings(
    @SerializedName("notify_new_diet_plan") val notifyNewDietPlan: Boolean = true,
    @SerializedName("notify_recommendations") val notifyRecommendations: Boolean = true,
    @SerializedName("notify_chat_messages") val notifyChatMessages: Boolean = true,
    @SerializedName("notify_upcoming_meals") val notifyUpcomingMeals: Boolean = true,
    @SerializedName("meal_time_breakfast") val mealTimeBreakfast: String = "08:00",
    @SerializedName("meal_time_second_breakfast") val mealTimeSecondBreakfast: String = "11:00",
    @SerializedName("meal_time_lunch") val mealTimeLunch: String = "14:00",
    @SerializedName("meal_time_snack") val mealTimeSnack: String = "17:00",
    @SerializedName("meal_time_dinner") val mealTimeDinner: String = "20:00",
    @SerializedName("app_theme") val appTheme: String = "emerald"
)

data class ChangePasswordRequest(
    @SerializedName("old_password") val oldPassword: String,
    @SerializedName("new_password") val newPassword: String
)

data class ForgotPasswordRequest(
    val email: String
)

data class ResetPasswordRequest(
    val email: String,
    val code: String,
    @SerializedName("new_password") val newPassword: String
)

data class DietPlanTemplate(
    val id: Int,
    val name: String,
    val category: String,
    @SerializedName("target_gender") val targetGender: String? = "all",
    val description: String?,
    @SerializedName("target_calories") val targetCalories: Int,
    @SerializedName("meals_per_day") val mealsPerDay: Int
)

data class PatientLoadPackageRequest(
    @SerializedName("template_id") val templateId: Int,
    @SerializedName("start_date") val startDate: String? = null
)

data class PatientProfileResponse(
    val user: User,
    val profile: PatientProfile?
)

data class PatientProfileUpdateRequest(
    @SerializedName("current_weight") val currentWeight: Double? = null,
    @SerializedName("target_weight") val targetWeight: Double? = null,
    val height: Double? = null,
    val gender: String? = null,
    @SerializedName("daily_calories_goal") val dailyCaloriesGoal: Int? = null,
    @SerializedName("protein_goal_g") val proteinGoalG: Double? = null,
    @SerializedName("fat_goal_g") val fatGoalG: Double? = null,
    @SerializedName("carbs_goal_g") val carbsGoalG: Double? = null,
    @SerializedName("meals_per_day") val mealsPerDay: Int? = null,
    @SerializedName("official_recommendations") val officialRecommendations: String? = null
)

data class AddRecommendationRequest(
    val title: String? = null,
    val content: String
)

data class ApplyTemplateToPatientRequest(
    @SerializedName("patient_id") val patientId: Int,
    @SerializedName("start_date") val startDate: String,
    val notes: String? = null
)

data class ProductCreateRequest(
    val name: String,
    val store: String = "Lidl",
    val brand: String = "",
    val barcode: String? = null,
    @SerializedName("calories_per_100g") val caloriesPer100g: Double,
    @SerializedName("protein_per_100g") val proteinPer100g: Double,
    @SerializedName("fat_per_100g") val fatPer100g: Double,
    @SerializedName("carbs_per_100g") val carbsPer100g: Double,
    @SerializedName("fiber_per_100g") val fiberPer100g: Double = 0.0,
    val unit: String = "g",
    val category: String = "Inne"
)

data class RecipeIngredientInput(
    @SerializedName("product_id") val productId: Int,
    @SerializedName("amount_g") val amountG: Double,
    val unit: String = "g"
)

data class RecipeCreateRequest(
    val title: String,
    val category: String,
    @SerializedName("preparation_time_minutes") val prepTimeMinutes: Int = 20,
    val instructions: String,
    @SerializedName("default_portions") val defaultPortions: Double = 1.0,
    @SerializedName("image_url") val imageUrl: String? = null,
    val ingredients: List<RecipeIngredientInput>
)

data class TemplateMealInput(
    @SerializedName("meal_type") val mealType: String,
    @SerializedName("recipe_id") val recipeId: Int,
    val portions: Double = 1.0
)

data class TemplateDayInput(
    @SerializedName("day_number") val dayNumber: Int,
    @SerializedName("day_name") val dayName: String,
    val meals: List<TemplateMealInput>
)

data class DietPlanTemplateCreateRequest(
    val name: String,
    val category: String = "Dieta redukcyjna",
    val description: String = "",
    @SerializedName("target_calories") val targetCalories: Int = 2000,
    @SerializedName("meals_per_day") val mealsPerDay: Int = 4,
    @SerializedName("days_data") val daysData: List<TemplateDayInput>
)
