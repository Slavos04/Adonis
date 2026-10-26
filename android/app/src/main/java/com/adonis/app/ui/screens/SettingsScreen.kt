package com.adonis.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiClient
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.api.TokenManager
import com.adonis.app.data.model.ChangePasswordRequest
import com.adonis.app.data.model.UserNotificationSettings
import com.adonis.app.ui.components.AppInfoDialog
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    apiService: AdonisApiService,
    tokenManager: TokenManager? = null,
    onClose: () -> Unit,
    onLogout: () -> Unit
) {
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(true) }
    var statusMessage by remember { mutableStateOf<String?>(null) }
    var isError by remember { mutableStateOf(false) }
    var showAppInfo by remember { mutableStateOf(false) }

    // Powiadomienia
    var notifyDietPlan by remember { mutableStateOf(true) }
    var notifyRec by remember { mutableStateOf(true) }
    var notifyChat by remember { mutableStateOf(true) }
    var notifyMeal by remember { mutableStateOf(true) }

    // Motyw
    var selectedTheme by remember { mutableStateOf("system") }

    // Zmiana hasła
    var oldPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var isChangingPassword by remember { mutableStateOf(false) }

    fun loadSettings() {
        scope.launch {
            isLoading = true
            try {
                val s = apiService.getSettings()
                notifyDietPlan = s.notifyNewDietPlan
                notifyRec = s.notifyRecommendations
                notifyChat = s.notifyChatMessages
                notifyMeal = s.notifyUpcomingMeals
                selectedTheme = s.appTheme
            } catch (_: Exception) {
            } finally {
                isLoading = false
            }
        }
    }

    fun saveSettings(theme: String = selectedTheme) {
        scope.launch {
            try {
                apiService.updateSettings(
                    UserNotificationSettings(
                        notifyNewDietPlan = notifyDietPlan,
                        notifyRecommendations = notifyRec,
                        notifyChatMessages = notifyChat,
                        notifyUpcomingMeals = notifyMeal,
                        appTheme = theme
                    )
                )
                statusMessage = "Ustawienia zapisane"
                isError = false
            } catch (e: Exception) {
                statusMessage = "Nie udało się zapisać: ${e.message}"
                isError = true
            }
        }
    }

    LaunchedEffect(Unit) {
        loadSettings()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Ustawienia", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onClose) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Wróć")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { padding ->
        if (isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
            return@Scaffold
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            statusMessage?.let { msg ->
                Surface(
                    color = if (isError) MaterialTheme.colorScheme.errorContainer else MaterialTheme.colorScheme.primaryContainer,
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = msg,
                        modifier = Modifier.padding(12.dp),
                        color = if (isError) MaterialTheme.colorScheme.onErrorContainer else MaterialTheme.colorScheme.onPrimaryContainer,
                        fontSize = 13.sp
                    )
                }
            }

            // SEKCJA 1: Powiadomienia
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Notifications, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Powiadomienia", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text(
                        "Włącz lub wyłącz poszczególne rodzaje alertów w aplikacji",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
                    )

                    // 1. Nowy jadłospis
                    NotificationSwitchRow(
                        title = "Nowy jadłospis",
                        subtitle = "Gdy dietetyk przypisze lub zmieni Twój plan",
                        checked = notifyDietPlan,
                        onCheckedChange = {
                            notifyDietPlan = it
                            saveSettings()
                        }
                    )
                    HorizontalDivider(modifier = Modifier.padding(vertical = 6.dp), color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.08f))

                    // 2. Nowe zalecenia
                    NotificationSwitchRow(
                        title = "Nowe zalecenia",
                        subtitle = "Wytyczne, wskazówki i zalecenia dietetyka",
                        checked = notifyRec,
                        onCheckedChange = {
                            notifyRec = it
                            saveSettings()
                        }
                    )
                    HorizontalDivider(modifier = Modifier.padding(vertical = 6.dp), color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.08f))

                    // 3. Nowa informacja na czacie
                    NotificationSwitchRow(
                        title = "Czat",
                        subtitle = "Nowa wiadomość od dietetyka lub administratora",
                        checked = notifyChat,
                        onCheckedChange = {
                            notifyChat = it
                            saveSettings()
                        }
                    )
                    HorizontalDivider(modifier = Modifier.padding(vertical = 6.dp), color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.08f))

                    // 4. Zbliżający się posiłek
                    NotificationSwitchRow(
                        title = "Zbliżający się posiłek",
                        subtitle = "Przypomnienie o porze śniadania, obiadu lub kolacji",
                        checked = notifyMeal,
                        onCheckedChange = {
                            notifyMeal = it
                            saveSettings()
                        }
                    )
                }
            }

            // SEKCJA 2: Motywy
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Palette, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Motyw aplikacji", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text(
                        "Dopasuj wygląd do swoich upodobań",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
                    )

                    val themes = listOf(
                        Triple("system", "Systemowy", Color(0xFF6B7280)),
                        Triple("dark", "Ciemny", Color(0xFF1F2937)),
                        Triple("light", "Jasny", Color(0xFFF3F4F6)),
                        Triple("emerald", "Szmaragdowy", Color(0xFF10B981)),
                        Triple("sunset", "Zachód słońca", Color(0xFFF59E0B))
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        themes.forEach { (key, name, color) ->
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier
                                    .clickable {
                                        selectedTheme = key
                                        saveSettings(key)
                                    }
                                    .padding(4.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .clip(CircleShape)
                                        .background(color)
                                        .then(
                                            if (selectedTheme == key) {
                                                Modifier.padding(2.dp)
                                            } else Modifier
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    if (selectedTheme == key) {
                                        Icon(
                                            Icons.Default.Check,
                                            contentDescription = null,
                                            tint = if (key == "light") Color.Black else Color.White,
                                            modifier = Modifier.size(20.dp)
                                        )
                                    }
                                }
                                Text(
                                    text = name,
                                    fontSize = 11.sp,
                                    fontWeight = if (selectedTheme == key) FontWeight.Bold else FontWeight.Normal,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                    }
                }
            }

            // SEKCJA 3: Zmiana hasła
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Lock, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Zmiana hasła", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text(
                        "Wprowadź dotychczasowe hasło oraz nowe hasło (min. 6 znaków)",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
                    )

                    OutlinedTextField(
                        value = oldPassword,
                        onValueChange = { oldPassword = it },
                        label = { Text("Aktualne hasło") },
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = newPassword,
                        onValueChange = { newPassword = it },
                        label = { Text("Nowe hasło") },
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = confirmPassword,
                        onValueChange = { confirmPassword = it },
                        label = { Text("Powtórz nowe hasło") },
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = {
                            if (newPassword != confirmPassword) {
                                statusMessage = "Nowe hasła nie są identyczne."
                                isError = true
                                return@Button
                            }
                            if (newPassword.length < 6) {
                                statusMessage = "Hasło musi mieć co najmniej 6 znaków."
                                isError = true
                                return@Button
                            }
                            isChangingPassword = true
                            scope.launch {
                                try {
                                    val res = apiService.changePassword(
                                        ChangePasswordRequest(
                                            oldPassword = oldPassword,
                                            newPassword = newPassword
                                        )
                                    )
                                    statusMessage = (res["message"] as? String) ?: "Hasło zostało pomyślnie zmienione."
                                    isError = false
                                    oldPassword = ""
                                    newPassword = ""
                                    confirmPassword = ""
                                } catch (e: Exception) {
                                    statusMessage = "Błąd zmiany hasła: ${e.message}"
                                    isError = true
                                } finally {
                                    isChangingPassword = false
                                }
                            }
                        },
                        enabled = !isChangingPassword && oldPassword.isNotBlank() && newPassword.isNotBlank(),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(if (isChangingPassword) "Zmienianie hasła..." else "Zmień hasło")
                    }
                }
            }

            // SEKCJA 4: Wylogowanie
            OutlinedButton(
                onClick = onLogout,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
            ) {
                Icon(Icons.Default.ExitToApp, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Wyloguj się z aplikacji")
            }

            Spacer(modifier = Modifier.height(12.dp))

            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                TextButton(onClick = { showAppInfo = true }) {
                    Icon(Icons.Default.Info, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("O aplikacji ADONIS fit & eat", fontSize = 12.sp)
                }
                Text(
                    text = "Serwer API: ${AdonisApiClient.baseUrl}",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                )
                Text(
                    text = "ver. 1.0 (Produkcyjna)",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.45f)
                )
            }
        }

        if (showAppInfo) {
            AppInfoDialog(onDismissRequest = { showAppInfo = false })
        }
    }
}

@Composable
fun NotificationSwitchRow(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f).padding(end = 12.dp)) {
            Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
            Text(
                text = subtitle,
                fontSize = 11.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange
        )
    }
}
