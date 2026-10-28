package com.adonis.app

import android.app.Application
import com.adonis.app.data.api.AdonisApiClient
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.api.TokenManager
import com.adonis.app.util.NotificationHelper

class AdonisApplication : Application() {

    lateinit var tokenManager: TokenManager
    lateinit var apiService: AdonisApiService

    override fun onCreate() {
        super.onCreate()
        tokenManager = TokenManager(this)
        apiService = AdonisApiClient.create(tokenManager)
        NotificationHelper.createNotificationChannels(this)
    }
}
