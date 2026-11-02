package com.adonis.app.util

import android.content.Context

object AppVersionHelper {
    /**
     * Zwraca dynamiczny numer wersji aplikacji zadeklarowany w pakiecie Androida (build.gradle.kts).
     */
    fun getVersionName(context: Context): String {
        return try {
            val pInfo = context.packageManager.getPackageInfo(context.packageName, 0)
            pInfo.versionName ?: "1.18.0"
        } catch (_: Exception) {
            "1.18.0"
        }
    }

    /**
     * Zwraca kod wersji (versionCode).
     */
    fun getVersionCode(context: Context): Long {
        return try {
            val pInfo = context.packageManager.getPackageInfo(context.packageName, 0)
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.P) {
                pInfo.longVersionCode
            } else {
                @Suppress("DEPRECATION")
                pInfo.versionCode.toLong()
            }
        } catch (_: Exception) {
            18L
        }
    }
}

