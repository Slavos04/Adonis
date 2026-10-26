package com.adonis.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.ui.screens.*
import com.adonis.app.ui.theme.AdonisTheme
import com.adonis.app.ui.components.AppInfoDialog

class MainActivity : ComponentActivity() {

    @OptIn(ExperimentalMaterial3Api::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val app = application as AdonisApplication
        val apiService = app.apiService
        val tokenManager = app.tokenManager

        setContent {
            var currentTheme by remember { mutableStateOf(tokenManager.getTheme()) }

            AdonisTheme(themeName = currentTheme) {
                var isLoggedIn by remember { mutableStateOf(tokenManager.hasToken()) }
                var currentTab by remember { mutableStateOf(0) }
                var chatTargetPatientId by remember { mutableStateOf<Int?>(null) }
                var showAppInfo by remember { mutableStateOf(false) }
                val isDietitian = remember(isLoggedIn) { tokenManager.getUserRole() == "dietitian" }

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    if (!isLoggedIn) {
                        LoginScreen(
                            apiService = apiService,
                            tokenManager = tokenManager,
                            onLoginSuccess = {
                                isLoggedIn = true
                                currentTab = 0
                            }
                        )
                    } else {
                        var showSettings by remember { mutableStateOf(false) }

                        if (showSettings) {
                            SettingsScreen(
                                apiService = apiService,
                                tokenManager = tokenManager,
                                onClose = {
                                    currentTheme = tokenManager.getTheme()
                                    showSettings = false
                                },
                                onLogout = {
                                    tokenManager.clear()
                                    isLoggedIn = false
                                    showSettings = false
                                    currentTab = 0
                                }
                            )
                        } else {
                            Scaffold(
                                topBar = {
                                    TopAppBar(
                                        title = {
                                            Column(
                                                verticalArrangement = Arrangement.Center,
                                                modifier = Modifier.padding(vertical = 4.dp)
                                            ) {
                                                // Wiersz 1: Nowe Logo (A z liściem) + ADONIS + fit & eat
                                                Row(
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                                ) {
                                                    Image(
                                                        painter = painterResource(id = R.drawable.app_logo),
                                                        contentDescription = "Logo Adonis",
                                                        modifier = Modifier
                                                            .size(24.dp)
                                                            .clip(RoundedCornerShape(6.dp))
                                                    )
                                                    Text(
                                                        text = "ADONIS",
                                                        fontWeight = FontWeight.Black,
                                                        fontSize = 17.sp,
                                                        color = MaterialTheme.colorScheme.primary,
                                                        lineHeight = 17.sp
                                                    )
                                                    Text(
                                                        text = "fit & eat",
                                                        fontSize = 10.sp,
                                                        fontWeight = FontWeight.Bold,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                        letterSpacing = 1.sp
                                                    )
                                                }

                                                // Wiersz 2 (nowy wiersz): Imię i nazwisko pacjenta / dietetyka
                                                val fullName = tokenManager.getUserFullName()
                                                if (fullName.isNotBlank()) {
                                                    Row(
                                                        verticalAlignment = Alignment.CenterVertically,
                                                        modifier = Modifier.padding(top = 2.dp)
                                                    ) {
                                                        if (isDietitian) {
                                                            Icon(
                                                                Icons.Default.VerifiedUser,
                                                                contentDescription = null,
                                                                modifier = Modifier.size(12.dp),
                                                                tint = MaterialTheme.colorScheme.primary
                                                            )
                                                            Spacer(modifier = Modifier.width(3.dp))
                                                            Text(
                                                                text = "Dietetyk: $fullName",
                                                                fontSize = 11.sp,
                                                                fontWeight = FontWeight.Bold,
                                                                color = MaterialTheme.colorScheme.primary
                                                            )
                                                        } else {
                                                            Text(
                                                                text = fullName,
                                                                fontSize = 11.sp,
                                                                fontWeight = FontWeight.Medium,
                                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                                            )
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        actions = {
                                            // Info Button ("i")
                                            IconButton(onClick = { showAppInfo = true }) {
                                                Icon(
                                                    Icons.Default.Info,
                                                    contentDescription = "O aplikacji",
                                                    tint = MaterialTheme.colorScheme.primary
                                                )
                                            }

                                            // Settings Button
                                            IconButton(onClick = { showSettings = true }) {
                                                Icon(Icons.Default.Settings, contentDescription = "Ustawienia")
                                            }

                                            // Logout Button
                                            IconButton(onClick = {
                                                tokenManager.clear()
                                                isLoggedIn = false
                                                currentTab = 0
                                            }) {
                                                Icon(Icons.Default.Logout, contentDescription = "Wyloguj")
                                            }
                                        },
                                        colors = TopAppBarDefaults.topAppBarColors(
                                            containerColor = MaterialTheme.colorScheme.surface
                                        )
                                    )
                                },
                                bottomBar = {
                                    NavigationBar {
                                        if (isDietitian) {
                                            // Nawigacja Dietetyka
                                            NavigationBarItem(
                                                selected = currentTab == 0,
                                                onClick = { currentTab = 0 },
                                                icon = { Icon(Icons.Default.People, contentDescription = "Pacjenci") },
                                                label = { Text("Pacjenci") }
                                            )
                                            NavigationBarItem(
                                                selected = currentTab == 1,
                                                onClick = { currentTab = 1 },
                                                icon = { Icon(Icons.Default.Layers, contentDescription = "Pakiety") },
                                                label = { Text("Pakiety") }
                                            )
                                            NavigationBarItem(
                                                selected = currentTab == 2,
                                                onClick = { currentTab = 2 },
                                                icon = { Icon(Icons.Default.MenuBook, contentDescription = "Przepisy") },
                                                label = { Text("Przepisy") }
                                            )
                                            NavigationBarItem(
                                                selected = currentTab == 3,
                                                onClick = { currentTab = 3 },
                                                icon = { Icon(Icons.Default.Chat, contentDescription = "Czat") },
                                                label = { Text("Czat") }
                                            )
                                        } else {
                                            // Nawigacja Pacjenta
                                            NavigationBarItem(
                                                selected = currentTab == 0,
                                                onClick = { currentTab = 0 },
                                                icon = { Icon(Icons.Default.RestaurantMenu, contentDescription = "Jadłospis") },
                                                label = { Text("Jadłospis") }
                                            )
                                            NavigationBarItem(
                                                selected = currentTab == 1,
                                                onClick = { currentTab = 1 },
                                                icon = { Icon(Icons.Default.ShoppingCart, contentDescription = "Zakupy") },
                                                label = { Text("Zakupy") }
                                            )
                                            NavigationBarItem(
                                                selected = currentTab == 2,
                                                onClick = { currentTab = 2 },
                                                icon = { Icon(Icons.Default.ShowChart, contentDescription = "Pomiary") },
                                                label = { Text("Pomiary") }
                                            )
                                            NavigationBarItem(
                                                selected = currentTab == 3,
                                                onClick = { currentTab = 3 },
                                                icon = { Icon(Icons.Default.Chat, contentDescription = "Czat") },
                                                label = { Text("Czat") }
                                            )
                                        }
                                    }
                                }
                            ) { innerPadding ->
                                Surface(modifier = Modifier.padding(innerPadding)) {
                                    if (isDietitian) {
                                        when (currentTab) {
                                            0 -> DietitianPatientsScreen(
                                                apiService = apiService,
                                                onNavigateToChat = { patientId ->
                                                    chatTargetPatientId = patientId
                                                    currentTab = 3
                                                }
                                            )
                                            1 -> DietitianPackagesScreen(apiService = apiService)
                                            2 -> DietitianRecipesScreen(apiService = apiService)
                                            3 -> ChatScreen(
                                                apiService = apiService,
                                                tokenManager = tokenManager,
                                                initialTargetUserId = chatTargetPatientId
                                            )
                                        }
                                    } else {
                                        when (currentTab) {
                                            0 -> DailyPlanScreen(apiService = apiService, tokenManager = tokenManager)
                                            1 -> ShoppingListScreen(apiService = apiService)
                                            2 -> MeasurementsScreen(apiService = apiService)
                                            3 -> ChatScreen(apiService = apiService, tokenManager = tokenManager)
                                        }
                                    }
                                }
                            }
                        }

                        if (showAppInfo) {
                            AppInfoDialog(onDismissRequest = { showAppInfo = false })
                        }
                    }
                }
            }
        }
    }
}
