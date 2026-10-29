package com.adonis.app.worker

import android.content.Context
import androidx.work.*
import com.adonis.app.data.api.AdonisApiClient
import com.adonis.app.data.api.TokenManager
import com.adonis.app.util.NotificationHelper
import java.util.concurrent.TimeUnit

class NotificationSyncWorker(
    private val appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val tokenManager = TokenManager(appContext)
        val token = tokenManager.getToken()
        if (token.isNullOrBlank()) {
            return Result.success()
        }

        val apiService = AdonisApiClient.create(tokenManager)
        val prefs = appContext.getSharedPreferences("adonis_sync_prefs", Context.MODE_PRIVATE)

        try {
            val settings = apiService.getSettings()

            // 1. CHAT NOTIFICATIONS
            if (settings.notifyChatMessages) {
                try {
                    val conversations = apiService.getConversations()
                    for (conv in conversations) {
                        if (conv.unreadCount > 0) {
                            val lastNotifiedCount = prefs.getInt("unread_chat_${conv.partnerId}", 0)
                            if (conv.unreadCount > lastNotifiedCount) {
                                NotificationHelper.showChatNotification(
                                    appContext,
                                    conv.partnerName,
                                    conv.lastMessage ?: "Masz nową wiadomość na czacie",
                                    notificationId = 300 + conv.partnerId
                                )
                                prefs.edit().putInt("unread_chat_${conv.partnerId}", conv.unreadCount).apply()
                            }
                        } else {
                            prefs.edit().putInt("unread_chat_${conv.partnerId}", 0).apply()
                        }
                    }
                } catch (_: Exception) {}
            }

            // 2. NEW DIET PLAN NOTIFICATIONS
            if (settings.notifyNewDietPlan) {
                try {
                    val dailyPlan = apiService.getDailyPlan()
                    val lastPlanId = prefs.getInt("last_known_plan_id", -1)
                    val lastPlanDate = prefs.getString("last_known_plan_date", "")

                    if (dailyPlan.meals.isNotEmpty()) {
                        if (lastPlanId != -1 && (dailyPlan.id != lastPlanId || dailyPlan.date != lastPlanDate)) {
                            NotificationHelper.showDietPlanNotification(
                                appContext,
                                "Nowy jadłospis! 🥗",
                                "Twój plan na dzień ${dailyPlan.date} jest gotowy w aplikacji ADONIS."
                            )
                        }
                        prefs.edit()
                            .putInt("last_known_plan_id", dailyPlan.id)
                            .putString("last_known_plan_date", dailyPlan.date)
                            .apply()
                    }
                } catch (_: Exception) {}
            }

            // 3. RECOMMENDATIONS NOTIFICATIONS
            if (settings.notifyRecommendations) {
                try {
                    val me = apiService.getMyProfile()
                    val recs = me.profile?.officialRecommendations?.trim() ?: ""
                    val lastRecs = prefs.getString("last_known_recs", "") ?: ""

                    if (recs.isNotBlank() && recs != lastRecs) {
                        if (lastRecs.isNotBlank()) {
                            NotificationHelper.showRecommendationNotification(
                                appContext,
                                "Nowe zalecenia od dietetyka 📋",
                                recs
                            )
                        }
                        prefs.edit().putString("last_known_recs", recs).apply()
                    }
                } catch (_: Exception) {}
            }

            // 4. MEAL ALARMS
            if (settings.notifyUpcomingMeals) {
                NotificationHelper.scheduleAllMealAlarms(
                    appContext,
                    settings.mealTimeBreakfast,
                    settings.mealTimeSecondBreakfast,
                    settings.mealTimeLunch,
                    settings.mealTimeSnack,
                    settings.mealTimeDinner
                )
            }

            return Result.success()
        } catch (e: Exception) {
            return Result.retry()
        }
    }

    companion object {
        private const val WORK_NAME = "adonis_notification_sync_work"

        fun enqueuePeriodic(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val periodicRequest = PeriodicWorkRequestBuilder<NotificationSyncWorker>(
                15, TimeUnit.MINUTES
            )
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                periodicRequest
            )
        }

        fun enqueueImmediate(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val oneTimeRequest = OneTimeWorkRequestBuilder<NotificationSyncWorker>()
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueue(oneTimeRequest)
        }
    }
}
