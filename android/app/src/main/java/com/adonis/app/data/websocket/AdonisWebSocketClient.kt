package com.adonis.app.data.websocket

import com.google.gson.Gson
import com.google.gson.JsonObject
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharedFlow
import okhttp3.*

class AdonisWebSocketClient(
    private val serverUrl: String = "wss://adonis.slavosmm.duckdns.org/ws/chat/",
    private val token: String
) : WebSocketListener() {

    private val client = OkHttpClient()
    private var webSocket: WebSocket? = null
    private val gson = Gson()

    private val _messagesFlow = MutableSharedFlow<String>(extraBufferCapacity = 50)
    val messagesFlow: SharedFlow<String> = _messagesFlow

    fun connect() {
        val request = Request.Builder()
            .url("$serverUrl?token=$token")
            .build()
        webSocket = client.newWebSocket(request, this)
    }

    fun sendMessage(receiverId: Int, content: String) {
        val payload = JsonObject().apply {
            addProperty("type", "chat_message")
            addProperty("receiver_id", receiverId)
            addProperty("content", content)
        }
        webSocket?.send(gson.toJson(payload))
    }

    override fun onMessage(webSocket: WebSocket, text: String) {
        _messagesFlow.tryEmit(text)
    }

    fun disconnect() {
        webSocket?.close(1000, "User disconnected")
    }
}
