package com.adonis.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiClient
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.api.TokenManager
import com.adonis.app.data.model.ChatMessage
import com.adonis.app.data.model.ConversationPartner
import com.adonis.app.data.websocket.AdonisWebSocketClient
import com.google.gson.Gson
import com.google.gson.JsonObject
import kotlinx.coroutines.launch

@Composable
fun ChatScreen(
    apiService: AdonisApiService,
    tokenManager: TokenManager,
    initialTargetUserId: Int? = null
) {
    var messages by remember { mutableStateOf<List<ChatMessage>>(emptyList()) }
    var textInput by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val token = tokenManager.getToken() ?: ""
    val isDietitian = remember { tokenManager.getUserRole() == "dietitian" }
    val myUserId = remember { tokenManager.getUserId() }
    val gson = remember { Gson() }
    val listState = rememberLazyListState()

    // Domyślni partnerzy dla pacjenta vs dietetyka
    val defaultPartners = remember(isDietitian) {
        if (isDietitian) {
            emptyList()
        } else {
            listOf(
                ConversationPartner(partnerId = 2, partnerName = "Dietetyk", partnerRole = "dietitian"),
                ConversationPartner(partnerId = 1, partnerName = "Administrator", partnerRole = "admin")
            )
        }
    }

    var partners by remember { mutableStateOf<List<ConversationPartner>>(defaultPartners) }
    var selectedPartnerId by remember { mutableStateOf(initialTargetUserId ?: if (isDietitian) 0 else 2) }

    LaunchedEffect(initialTargetUserId) {
        if (initialTargetUserId != null && initialTargetUserId > 0) {
            selectedPartnerId = initialTargetUserId
        }
    }

    val activePartner = partners.find { it.partnerId == selectedPartnerId } ?: partners.firstOrNull()

    val wsClient = remember(token) {
        AdonisWebSocketClient(serverUrl = AdonisApiClient.getWebSocketUrl(), token = token).apply { connect() }
    }

    // Pobieranie listy konwersacji i aktualizacja partnerów
    val refreshConversations: suspend () -> Unit = {
        try {
            val map = linkedMapOf<Int, ConversationPartner>()
            if (isDietitian) {
                // Dietetyk: wczytaj pacjentów
                try {
                    val patients = apiService.getPatients()
                    patients.forEach { p ->
                        val pName = "${p.firstName} ${p.lastName}".trim().ifBlank { p.username }
                        map[p.id] = ConversationPartner(
                            partnerId = p.id,
                            partnerName = pName,
                            partnerRole = "patient",
                            partnerEmail = p.email
                        )
                    }
                } catch (_: Exception) {}
            }

            val convs = apiService.getConversations()
            convs.forEach { c ->
                val existing = map[c.partnerId]
                if (existing != null) {
                    map[c.partnerId] = existing.copy(
                        lastMessage = c.lastMessage,
                        unreadCount = c.unreadCount
                    )
                } else {
                    map[c.partnerId] = c
                }
            }

            if (!isDietitian) {
                defaultPartners.forEach { def ->
                    if (!map.containsKey(def.partnerId)) {
                        map[def.partnerId] = def
                    }
                }
            }

            val list = map.values.toList()
            partners = list
            if (initialTargetUserId == null && list.isNotEmpty()) {
                val withUnread = list.find { it.unreadCount > 0 }
                val withMsg = list.find { !it.lastMessage.isNullOrBlank() }
                val target = withUnread ?: withMsg ?: list.first()
                selectedPartnerId = target.partnerId
            } else if (selectedPartnerId == 0 && list.isNotEmpty()) {
                selectedPartnerId = list.first().partnerId
            }
        } catch (_: Exception) {}
    }

    // Załaduj partnerów na start
    LaunchedEffect(Unit) {
        refreshConversations()
    }

    // Załaduj historię wiadomości przy zmianie rozmówcy
    LaunchedEffect(selectedPartnerId) {
        if (selectedPartnerId > 0) {
            try {
                val history = apiService.getChatHistory(otherUserId = selectedPartnerId)
                messages = history
                if (history.isNotEmpty()) {
                    listState.scrollToItem(history.size - 1)
                }
            } catch (_: Exception) {}
        }
    }

    // Odbiór wiadomości przez WebSocket na żywo
    LaunchedEffect(wsClient, selectedPartnerId) {
        wsClient.messagesFlow.collect { rawJson ->
            try {
                val json = gson.fromJson(rawJson, JsonObject::class.java)
                if (json.get("type")?.asString == "chat_message") {
                    val sId = json.get("sender_id")?.asInt ?: 0
                    val rId = json.get("receiver_id")?.asInt ?: 0
                    val newMsg = ChatMessage(
                        id = json.get("message_id")?.asInt ?: (System.currentTimeMillis() % 100000).toInt(),
                        senderId = sId,
                        senderName = json.get("sender_name")?.asString ?: "",
                        receiverId = rId,
                        content = json.get("content")?.asString ?: "",
                        createdAt = json.get("created_at")?.asString ?: "teraz"
                    )

                    // Jeśli wiadomość dotyczy obecnie aktywnego rozmówcy
                    if (sId == selectedPartnerId || rId == selectedPartnerId) {
                        messages = messages + newMsg
                        if (messages.isNotEmpty()) {
                            listState.animateScrollToItem(messages.size - 1)
                        }
                    }

                    // Odśwież listę rozmówców i liczniki
                    scope.launch { refreshConversations() }
                }
            } catch (_: Exception) {}
        }
    }

    DisposableEffect(wsClient) {
        onDispose { wsClient.disconnect() }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Główny nagłówek ekranu - zgodnie z życzeniem użytkownika: "Czat"
        Text(
            text = "Czat",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        // Wybór rozmówcy (Dietetyk, Administrator, etc.)
        Text(
            text = "Wybierz rozmówcę:",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
            modifier = Modifier.padding(bottom = 6.dp)
        )

        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp)
        ) {
            items(partners) { partner ->
                val isSelected = partner.partnerId == selectedPartnerId
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedPartnerId = partner.partnerId },
                    label = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = partner.partnerName,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                            if (partner.unreadCount > 0) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Box(
                                    modifier = Modifier
                                        .size(16.dp)
                                        .clip(CircleShape)
                                        .background(MaterialTheme.colorScheme.error),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "${partner.unreadCount}",
                                        fontSize = 10.sp,
                                        color = MaterialTheme.colorScheme.onError,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    },
                    leadingIcon = {
                        val icon = if (partner.partnerRole == "admin" || partner.partnerName.contains("admin", ignoreCase = true)) {
                            Icons.Default.AdminPanelSettings
                        } else {
                            Icons.Default.Person
                        }
                        Icon(
                            imageVector = icon,
                            contentDescription = partner.partnerName,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                )
            }
        }

        // Informacja o wybranym rozmówcy
        Surface(
            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
            shape = RoundedCornerShape(8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Rozmowa z: ",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                val roleLabel = when (activePartner?.partnerRole) {
                    "admin" -> "Administrator"
                    "patient" -> "Pacjent"
                    else -> "Dietetyk"
                }
                Text(
                    text = "${activePartner?.partnerName ?: ""} ($roleLabel)",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }

        // Lista wiadomości
        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages) { msg ->
                val isMe = (myUserId > 0 && msg.senderId == myUserId) ||
                        msg.senderName.contains("pacjent", ignoreCase = true) ||
                        msg.senderName.equals("Ja", ignoreCase = true) ||
                        msg.senderId == 3

                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = if (isMe) Alignment.CenterEnd else Alignment.CenterStart
                ) {
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (isMe) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant
                        ),
                        modifier = Modifier.widthIn(max = 280.dp),
                        shape = RoundedCornerShape(
                            topStart = 16.dp,
                            topEnd = 16.dp,
                            bottomStart = if (isMe) 16.dp else 4.dp,
                            bottomEnd = if (isMe) 4.dp else 16.dp
                        )
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            if (!isMe) {
                                Text(
                                    text = msg.senderName.ifBlank { activePartner?.partnerName ?: "Rozmówca" },
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                            Text(
                                text = msg.content,
                                fontSize = 14.sp,
                                color = if (isMe) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = msg.createdAt.takeLast(8).take(5).ifBlank { msg.createdAt },
                                fontSize = 10.sp,
                                modifier = Modifier.align(Alignment.End),
                                color = (if (isMe) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant).copy(alpha = 0.6f)
                            )
                        }
                    }
                }
            }
        }

        // Pasek wpisywania i wysyłania wiadomości
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = textInput,
                onValueChange = { textInput = it },
                placeholder = { Text("Napisz do ${activePartner?.partnerName ?: "rozmówcy"}...") },
                modifier = Modifier.weight(1f),
                singleLine = false,
                maxLines = 3,
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences)
            )

            Spacer(modifier = Modifier.width(8.dp))

            Button(
                onClick = {
                    if (textInput.isNotBlank()) {
                        val content = textInput.trim()
                        textInput = ""
                        val targetId = selectedPartnerId

                        // Wysyłanie przez REST i WebSocket
                        scope.launch {
                            try {
                                apiService.sendMessage(mapOf("receiver_id" to targetId, "content" to content))
                            } catch (_: Exception) {}
                        }
                        wsClient.sendMessage(receiverId = targetId, content = content)

                        // Lokalna aktualizacja widoku
                        val localMsg = ChatMessage(
                            id = (System.currentTimeMillis() % 100000).toInt(),
                            senderId = if (myUserId > 0) myUserId else 3,
                            senderName = "Ja",
                            receiverId = targetId,
                            content = content,
                            createdAt = "teraz"
                        )
                        messages = messages + localMsg

                        // Scroll do dołu
                        scope.launch {
                            if (messages.isNotEmpty()) {
                                listState.animateScrollToItem(messages.size - 1)
                            }
                        }
                    }
                },
                enabled = textInput.isNotBlank()
            ) {
                Icon(Icons.Default.Send, contentDescription = "Wyślij", modifier = Modifier.size(18.dp))
            }
        }
    }
}
