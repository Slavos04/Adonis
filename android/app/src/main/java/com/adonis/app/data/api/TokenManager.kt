package com.adonis.app.data.api

import android.content.Context
import android.content.SharedPreferences

class TokenManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("adonis_secure_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_JWT_TOKEN = "jwt_token"
        private const val KEY_USER_EMAIL = "user_email"
        private const val KEY_USER_ROLE = "user_role"
        private const val KEY_USER_FIRST_NAME = "user_first_name"
        private const val KEY_USER_LAST_NAME = "user_last_name"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_THEME = "app_theme"
    }

    fun saveToken(
        token: String,
        email: String,
        role: String,
        firstName: String = "",
        lastName: String = "",
        userId: Int = 0
    ) {
        prefs.edit()
            .putString(KEY_JWT_TOKEN, token)
            .putString(KEY_USER_EMAIL, email)
            .putString(KEY_USER_ROLE, role)
            .putString(KEY_USER_FIRST_NAME, firstName)
            .putString(KEY_USER_LAST_NAME, lastName)
            .putInt(KEY_USER_ID, userId)
            .apply()
    }

    fun saveUserName(firstName: String, lastName: String) {
        prefs.edit()
            .putString(KEY_USER_FIRST_NAME, firstName)
            .putString(KEY_USER_LAST_NAME, lastName)
            .apply()
    }

    fun getToken(): String? = prefs.getString(KEY_JWT_TOKEN, null)

    fun getUserEmail(): String? = prefs.getString(KEY_USER_EMAIL, null)

    fun getUserId(): Int = prefs.getInt(KEY_USER_ID, 0)

    fun getUserRole(): String? = prefs.getString(KEY_USER_ROLE, null)

    fun getUserFullName(): String {
        val first = prefs.getString(KEY_USER_FIRST_NAME, "") ?: ""
        val last = prefs.getString(KEY_USER_LAST_NAME, "") ?: ""
        val full = "$first $last".trim()
        return if (full.isNotBlank()) full else (getUserEmail()?.substringBefore("@") ?: "Użytkownik")
    }

    fun saveTheme(theme: String) {
        prefs.edit().putString(KEY_THEME, theme).apply()
    }

    fun getTheme(): String = prefs.getString(KEY_THEME, "dark") ?: "dark"

    fun clear() {
        prefs.edit().clear().apply()
    }

    fun getServerUrl(): String = prefs.getString("server_url", "") ?: ""

    fun saveServerUrl(url: String) {
        prefs.edit().putString("server_url", url).apply()
    }

    fun isRecBannerDismissed(): Boolean = prefs.getBoolean("rec_banner_dismissed", false)

    fun setRecBannerDismissed(dismissed: Boolean) {
        prefs.edit().putBoolean("rec_banner_dismissed", dismissed).apply()
    }

    fun hasToken(): Boolean = !getToken().isNullOrBlank()
}

