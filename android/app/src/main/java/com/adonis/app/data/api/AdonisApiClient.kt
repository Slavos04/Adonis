package com.adonis.app.data.api

import com.adonis.app.data.model.*
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

interface AdonisApiService {

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @GET("auth/me")
    suspend fun getMe(): Map<String, Any>

    @GET("auth/me")
    suspend fun getMyProfile(): PatientProfileResponse

    @PUT("auth/me/profile")
    suspend fun updateMyProfile(
        @Body body: PatientProfileUpdateRequest
    ): Map<String, Any>

    @GET("diet-plans/daily")
    suspend fun getDailyPlan(
        @Query("target_date") targetDate: String? = null
    ): DailyMealPlanResponse

    @POST("diet-plans/meals/{meal_id}/toggle-complete")
    suspend fun toggleMealCompleted(
        @Path("meal_id") mealId: Int
    ): Map<String, Any>

    @GET("recipes/{id}/scale")
    suspend fun scaleRecipe(
        @Path("id") recipeId: Int,
        @Query("portions") portions: Double
    ): ScaledRecipeResponse

    @GET("diet-plans/shopping-list")
    suspend fun getShoppingList(
        @Query("start_date") startDate: String,
        @Query("end_date") endDate: String
    ): List<ShoppingListItem>

    @POST("diet-plans/shopping-list/toggle")
    suspend fun toggleShoppingItem(
        @Body request: ToggleShoppingItemRequest
    ): Map<String, Any>

    @POST("diet-plans/shopping-list/bulk-toggle")
    suspend fun bulkToggleShoppingItems(
        @Body request: BulkToggleShoppingRequest
    ): Map<String, Any>

    @GET("measurements/")
    suspend fun getMeasurements(): List<Measurement>

    @POST("measurements/")
    suspend fun addMeasurement(
        @Body request: MeasurementRequest
    ): Measurement

    @GET("chat/messages")
    suspend fun getChatHistory(
        @Query("other_user_id") otherUserId: Int
    ): List<ChatMessage>

    @GET("chat/conversations")
    suspend fun getConversations(): List<ConversationPartner>

    @POST("chat/messages")
    suspend fun sendMessage(
        @Body payload: Map<String, Any>
    ): ChatMessage

    @GET("auth/me/recommendations-history")
    suspend fun getMyRecommendationsHistory(): List<PatientRecommendation>

    @GET("auth/patients/{patient_id}/recommendations-history")
    suspend fun getPatientRecommendationsHistory(
        @Path("patient_id") patientId: Int
    ): List<PatientRecommendation>

    @GET("auth/settings")
    suspend fun getSettings(): UserNotificationSettings

    @PUT("auth/settings")
    suspend fun updateSettings(@Body settings: UserNotificationSettings): UserNotificationSettings

    @POST("auth/change-password")
    suspend fun changePassword(@Body request: ChangePasswordRequest): Map<String, Any>

    @POST("auth/forgot-password")
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): Map<String, Any>

    @POST("auth/reset-password")
    suspend fun resetPassword(@Body request: ResetPasswordRequest): Map<String, Any>

    @GET("diet-plans/templates")
    suspend fun getDietTemplates(): List<DietPlanTemplate>

    @POST("diet-plans/patient/load-package")
    suspend fun loadDietPackage(@Body request: PatientLoadPackageRequest): Map<String, Any>

    @GET("auth/patients")
    suspend fun getPatients(): List<User>

    @GET("auth/patients/{patient_id}/profile")
    suspend fun getPatientProfile(
        @Path("patient_id") patientId: Int
    ): PatientProfileResponse

    @PUT("auth/patients/{patient_id}/profile")
    suspend fun updatePatientProfile(
        @Path("patient_id") patientId: Int,
        @Body body: PatientProfileUpdateRequest
    ): Map<String, Any>

    @POST("auth/patients/{patient_id}/recommendations")
    suspend fun addPatientRecommendation(
        @Path("patient_id") patientId: Int,
        @Body body: AddRecommendationRequest
    ): PatientRecommendation

    @GET("measurements/")
    suspend fun getPatientMeasurements(
        @Query("patient_id") patientId: Int
    ): List<Measurement>

    @POST("diet-plans/templates/{template_id}/send-to-patient")
    suspend fun sendTemplateToPatient(
        @Path("template_id") templateId: Int,
        @Body request: ApplyTemplateToPatientRequest
    ): Map<String, Any>

    @GET("recipes/")
    suspend fun getRecipes(
        @Query("category") category: String? = null,
        @Query("search") search: String? = null
    ): List<Recipe>

    @GET("recipes/{recipe_id}")
    suspend fun getRecipeDetail(
        @Path("recipe_id") recipeId: Int
    ): Recipe

    @GET("recipes/products/list")
    suspend fun getProducts(
        @Query("search") search: String? = null,
        @Query("store") store: String? = null,
        @Query("limit") limit: Int = 100
    ): List<Product>

    @POST("recipes/products/")
    suspend fun createProduct(
        @Body request: ProductCreateRequest
    ): Product

    @POST("recipes/")
    suspend fun createRecipe(
        @Body request: RecipeCreateRequest
    ): Recipe

    @POST("diet-plans/templates")
    suspend fun createDietTemplate(
        @Body request: DietPlanTemplateCreateRequest
    ): DietPlanTemplate
}

class DynamicHostInterceptor : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        var request = chain.request()
        val currentBaseUrl = AdonisApiClient.baseUrl.toHttpUrlOrNull()
        if (currentBaseUrl != null) {
            val newUrl = request.url.newBuilder()
                .scheme(currentBaseUrl.scheme)
                .host(currentBaseUrl.host)
                .port(currentBaseUrl.port)
                .build()
            request = request.newBuilder().url(newUrl).build()
        }
        return chain.proceed(request)
    }
}

class AuthInterceptor(private val tokenManager: TokenManager) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val token = tokenManager.getToken()

        val builder = original.newBuilder()
        if (!token.isNullOrBlank()) {
            builder.header("Authorization", "Bearer $token")
        }
        return chain.proceed(builder.build())
    }
}

object AdonisApiClient {
    const val ONLINE_BASE_URL: String = "https://adonis.slavosmm.duckdns.org/api/"
    const val LOCAL_BASE_URL: String = "http://10.0.2.2:8000/api/"

    var baseUrl: String = ONLINE_BASE_URL

    fun updateBaseUrl(newUrl: String) {
        var clean = newUrl.trim()
        if (clean.isBlank()) return
        if (!clean.endsWith("/")) clean += "/"
        if (!clean.endsWith("api/")) clean += "api/"
        baseUrl = clean
    }

    fun getWebSocketUrl(): String {
        val base = baseUrl.trimEnd('/')
        val wsBase = when {
            base.startsWith("https://") -> base.replaceFirst("https://", "wss://")
            base.startsWith("http://") -> base.replaceFirst("http://", "ws://")
            else -> "wss://$base"
        }
        val rootWs = if (wsBase.endsWith("/api")) wsBase.removeSuffix("/api") else wsBase
        return "$rootWs/ws/chat/"
    }

    fun create(tokenManager: TokenManager): AdonisApiService {
        val saved = tokenManager.getServerUrl()
        if (saved.isNotBlank()) {
            updateBaseUrl(saved)
        } else {
            updateBaseUrl(ONLINE_BASE_URL)
        }

        val logging = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(DynamicHostInterceptor())
            .addInterceptor(AuthInterceptor(tokenManager))
            .addInterceptor(logging)
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()

        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AdonisApiService::class.java)
    }
}
