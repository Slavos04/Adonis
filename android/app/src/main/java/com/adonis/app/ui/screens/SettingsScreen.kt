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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiClient
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.api.TokenManager
import com.adonis.app.data.model.ChangePasswordRequest
import com.adonis.app.data.model.UserNotificationSettings
import com.adonis.app.ui.components.AppInfoDialog
import com.adonis.app.util.NotificationHelper
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    apiService: AdonisApiService,
    tokenManager: TokenManager? = null,
    onThemeChanged: (String) -> Unit = {},
    onClose: () -> Unit,
    onLogout: () -> Unit
) {
    val context = LocalContext.current
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

    // Godziny posiłków
    var mealBreakfast by remember { mutableStateOf("08:00") }
    var mealSecondBreakfast by remember { mutableStateOf("11:00") }
    var mealLunch by remember { mutableStateOf("14:00") }
    var mealSnack by remember { mutableStateOf("17:00") }
    var mealDinner by remember { mutableStateOf("20:00") }

    // Płeć
    var userGender by remember { mutableStateOf("male") }

    // Motyw
    var selectedTheme by remember { mutableStateOf(tokenManager?.getTheme() ?: "dark") }

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
                if (!s.appTheme.isNullOrBlank()) {
                    selectedTheme = s.appTheme
                    tokenManager?.saveTheme(s.appTheme)
                    onThemeChanged(s.appTheme)
                }
                mealBreakfast = s.mealTimeBreakfast
                mealSecondBreakfast = s.mealTimeSecondBreakfast
                mealLunch = s.mealTimeLunch
                mealSnack = s.mealTimeSnack
                mealDinner = s.mealTimeDinner
            } catch (_: Exception) {}

            try {
                val me = apiService.getMyProfile()
                me.profile?.gender?.let { if (it.isNotBlank()) userGender = it }
            } catch (_: Exception) {}
            finally {
                isLoading = false
            }
        }
    }

    fun saveSettings(theme: String = selectedTheme) {
        tokenManager?.saveTheme(theme)
        onThemeChanged(theme)
        if (notifyMeal) {
            NotificationHelper.scheduleAllMealAlarms(
                context,
                mealBreakfast,
                mealSecondBreakfast,
                mealLunch,
                mealSnack,
                mealDinner
            )
        }
        com.adonis.app.worker.NotificationSyncWorker.enqueueImmediate(context)
        com.adonis.app.worker.NotificationSyncWorker.enqueuePeriodic(context)
        scope.launch {
            try {
                apiService.updateSettings(
                    UserNotificationSettings(
                        notifyNewDietPlan = notifyDietPlan,
                        notifyRecommendations = notifyRec,
                        notifyChatMessages = notifyChat,
                        notifyUpcomingMeals = notifyMeal,
                        appTheme = theme,
                        mealTimeBreakfast = mealBreakfast,
                        mealTimeSecondBreakfast = mealSecondBreakfast,
                        mealTimeLunch = mealLunch,
                        mealTimeSnack = mealSnack,
                        mealTimeDinner = mealDinner
                    )
                )
                try {
                    apiService.updateMyProfile(com.adonis.app.data.model.PatientProfileUpdateRequest(gender = userGender))
                } catch (_: Exception) {}
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

                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedButton(
                        onClick = {
                            NotificationHelper.showTestNotification(context)
                            statusMessage = "Wysłano testowe powiadomienie!"
                            isError = false
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.NotificationsActive, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Wyślij testowe powiadomienie", fontSize = 12.sp)
                    }
                }
            }

            // SEKCJA 1b: Harmonogram posiłków (Godziny) - Item 5
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AccessTime, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Harmonogram posiłków", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text(
                        "Ustaw godziny swoich posiłków. Aplikacja wyświetli je w jadłospisie i przypomni o porze posiłku.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
                    )

                    val mealRows = listOf(
                        Triple("Śniadanie", mealBreakfast) { v: String -> mealBreakfast = v },
                        Triple("II Śniadanie", mealSecondBreakfast) { v: String -> mealSecondBreakfast = v },
                        Triple("Obiad", mealLunch) { v: String -> mealLunch = v },
                        Triple("Przekąska", mealSnack) { v: String -> mealSnack = v },
                        Triple("Kolacja", mealDinner) { v: String -> mealDinner = v }
                    )

                    mealRows.forEach { (label, value, onValChange) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(label, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                            OutlinedTextField(
                                value = value,
                                onValueChange = onValChange,
                                singleLine = true,
                                modifier = Modifier.width(100.dp),
                                textStyle = androidx.compose.ui.text.TextStyle(fontSize = 13.sp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        onClick = { saveSettings() },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Zapisz godziny posiłków", fontSize = 13.sp)
                    }
                }
            }

            // SEKCJA 1c: Dane profilu (Płeć) - Item 15
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Dane profilu: Płeć", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Text(
                        "Płeć jest kluczowa do prawidłowego wyliczenia norm metabolicznych i zapotrzebowania kalorycznego.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp, bottom = 10.dp)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        FilterChip(
                            selected = userGender == "male",
                            onClick = {
                                userGender = "male"
                                saveSettings()
                            },
                            label = { Text("👨 Mężczyzna", fontSize = 12.sp) }
                        )
                        FilterChip(
                            selected = userGender == "female",
                            onClick = {
                                userGender = "female"
                                saveSettings()
                            },
                            label = { Text("👩 Kobieta", fontSize = 12.sp) }
                        )
                    }
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
                        Triple("dark", "Ciemny", Color(0xFF111827)),
                        Triple("light", "Jasny", Color(0xFFF3F4F6)),
                        Triple("ocean", "Ocean", Color(0xFF0284C7)),
                        Triple("forest", "Las", Color(0xFF22C55E))
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        themes.forEach { (key, name, color) ->
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier
                                    .clickable {
                                        selectedTheme = key
                                        tokenManager?.saveTheme(key)
                                        onThemeChanged(key)
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
                    text = "ver. 1.1 (Produkcyjna)",
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
