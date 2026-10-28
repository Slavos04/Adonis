package com.adonis.app.util

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.adonis.app.MainActivity
import com.adonis.app.R
import com.adonis.app.data.api.TokenManager
import java.util.Calendar

object NotificationHelper {
    const val CHANNEL_MEALS_ID = "meal_reminders"
    const val CHANNEL_GENERAL_ID = "general_notifications"

    fun createNotificationChannels(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

            // Kanał 1: Przypomnienia o posiłkach
            val mealChannel = NotificationChannel(
                CHANNEL_MEALS_ID,
                "Przypomnienia o posiłkach",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Powiadomienia o wyznaczonych godzinach posiłków (śniadanie, obiad, itp.)"
                enableVibration(true)
                enableLights(true)
                setShowBadge(true)
            }

            // Kanał 2: Wiadomości czatu i zalecenia dietetyka
            val generalChannel = NotificationChannel(
                CHANNEL_GENERAL_ID,
                "Wiadomości i zalecenia",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Nowe zalecenia dietetyczne oraz wiadomości na czacie"
                enableVibration(true)
                setShowBadge(true)
            }

            notificationManager.createNotificationChannel(mealChannel)
            notificationManager.createNotificationChannel(generalChannel)
        }
    }

    fun showMealNotification(context: Context, mealTitle: String, mealHour: String, notificationId: Int = 101) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            notificationId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_MEALS_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("Pora na posiłek: $mealTitle! 🥗")
            .setContentText("Wybiła godzina $mealHour. Sprawdź swój zbilansowany przepis w aplikacji.")
            .setStyle(NotificationCompat.BigTextStyle().bigText("Wybiła godzina $mealHour. Twój plan dnia czeka w ADONIS fit & eat. Zjedz spokojnie i zaznacz posiłek jako ukończony!"))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        try {
            val manager = NotificationManagerCompat.from(context)
            manager.notify(notificationId, builder.build())
        } catch (_: SecurityException) {
            // Brak uprawnień POST_NOTIFICATIONS
        }
    }

    fun showTestNotification(context: Context) {
        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            999,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, CHANNEL_MEALS_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("ADONIS fit & eat — Powiadomienia aktywne! ✅")
            .setContentText("Powiadomienia działają prawidłowo. Aplikacja przypomni Ci o posiłkach.")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)

        try {
            val manager = NotificationManagerCompat.from(context)
            manager.notify(999, builder.build())
        } catch (_: SecurityException) {}
    }

    fun scheduleMealAlarm(context: Context, requestCode: Int, mealTitle: String, timeStr: String) {
        val parts = timeStr.split(":")
        if (parts.size != 2) return
        val hour = parts[0].toIntOrNull() ?: return
        val minute = parts[1].toIntOrNull() ?: return

        val calendar = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis()) {
                add(Calendar.DAY_OF_YEAR, 1)
            }
        }

        val intent = Intent(context, MealReminderReceiver::class.java).apply {
            action = "com.adonis.app.ACTION_MEAL_REMINDER"
            putExtra("meal_title", mealTitle)
            putExtra("meal_hour", timeStr)
            putExtra("notif_id", requestCode)
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    pendingIntent
                )
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    pendingIntent
                )
            }
        } catch (_: SecurityException) {
            alarmManager.set(
                AlarmManager.RTC_WAKEUP,
                calendar.timeInMillis,
                pendingIntent
            )
        }
    }

    fun scheduleAllMealAlarms(
        context: Context,
        breakfast: String = "08:00",
        secondBreakfast: String = "11:00",
        lunch: String = "14:00",
        snack: String = "17:00",
        dinner: String = "20:00"
    ) {
        scheduleMealAlarm(context, 101, "Śniadanie", breakfast)
        scheduleMealAlarm(context, 102, "Drugie śniadanie", secondBreakfast)
        scheduleMealAlarm(context, 103, "Obiad", lunch)
        scheduleMealAlarm(context, 104, "Podwieczorek", snack)
        scheduleMealAlarm(context, 105, "Kolacja", dinner)
    }
}

class MealReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val mealTitle = intent.getStringExtra("meal_title") ?: "Posiłek"
        val mealHour = intent.getStringExtra("meal_hour") ?: "teraz"
        val notifId = intent.getIntExtra("notif_id", 101)

        NotificationHelper.showMealNotification(context, mealTitle, mealHour, notifId)

        // Przeplanuj na kolejny dzień
        NotificationHelper.scheduleMealAlarm(context, notifId, mealTitle, mealHour)
    }
}
