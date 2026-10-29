package com.adonis.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.api.TokenManager
import com.adonis.app.data.model.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun DailyPlanScreen(
    apiService: AdonisApiService,
    tokenManager: TokenManager
) {
    val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    val shortDateSdf = SimpleDateFormat("d.MM", Locale.getDefault())
    
    val currentCalendar = remember { mutableStateOf(Calendar.getInstance()) }
    val selectedDateStr = remember { derivedStateOf { sdf.format(currentCalendar.value.time) } }
    val displayDateStr = remember {
        derivedStateOf {
            "${getShortDayOfWeek(currentCalendar.value)}, ${shortDateSdf.format(currentCalendar.value.time)}"
        }
    }

    val todayCalendar = remember { Calendar.getInstance() }
    val isToday = remember(currentCalendar.value) {
        val c = currentCalendar.value
        val t = Calendar.getInstance()
        c.get(Calendar.YEAR) == t.get(Calendar.YEAR) && c.get(Calendar.DAY_OF_YEAR) == t.get(Calendar.DAY_OF_YEAR)
    }

    var planResponse by remember { mutableStateOf<DailyMealPlanResponse?>(null) }
    var userSettings by remember { mutableStateOf<UserNotificationSettings?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    
    // Recommendations banner & history dialog
    var officialRecommendations by remember { mutableStateOf<String?>(null) }
    var isRecBannerDismissed by remember { mutableStateOf(tokenManager.isRecBannerDismissed()) }
    var showRecHistoryDialog by remember { mutableStateOf(false) }
    var recHistoryList by remember { mutableStateOf<List<PatientRecommendation>>(emptyList()) }
    var isRecHistoryLoading by remember { mutableStateOf(false) }

    // Dialogs: Scaler & Recipe Info Details & Load Package
    var scalingMeal by remember { mutableStateOf<PlannedMeal?>(null) }
    var scaledResult by remember { mutableStateOf<ScaledRecipeResponse?>(null) }
    var selectedPortions by remember { mutableStateOf(1.5) }

    var infoRecipe by remember { mutableStateOf<Recipe?>(null) }

    // Gotowe pakiety jadłospisów
    var showLoadPackageDialog by remember { mutableStateOf(false) }
    var packagesList by remember { mutableStateOf<List<DietPlanTemplate>>(emptyList()) }
    var isPackagesLoading by remember { mutableStateOf(false) }
    var packageActionStatus by remember { mutableStateOf<String?>(null) }

    val scope = rememberCoroutineScope()

    fun loadPlan() {
        scope.launch {
            isLoading = true
            try {
                planResponse = apiService.getDailyPlan(targetDate = selectedDateStr.value)
            } catch (_: Exception) {
            } finally {
                isLoading = false
            }
        }
    }

    fun openPackagesDialog() {
        showLoadPackageDialog = true
        scope.launch {
            isPackagesLoading = true
            packageActionStatus = null
            try {
                packagesList = apiService.getDietTemplates()
            } catch (_: Exception) {
            } finally {
                isPackagesLoading = false
            }
        }
    }

    // Load user recommendations & settings once
    LaunchedEffect(Unit) {
        try {
            val meData = apiService.getMe()
            val profile = meData["profile"] as? Map<*, *>
            val rec = profile?.get("official_recommendations") as? String
            officialRecommendations = rec
        } catch (_: Exception) {}

        try {
            userSettings = apiService.getSettings()
        } catch (_: Exception) {}
    }

    LaunchedEffect(selectedDateStr.value) {
        loadPlan()
    }

    fun openRecommendationsHistory() {
        showRecHistoryDialog = true
        scope.launch {
            isRecHistoryLoading = true
            try {
                recHistoryList = apiService.getMyRecommendationsHistory()
            } catch (_: Exception) {
            } finally {
                isRecHistoryLoading = false
            }
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // Wiersz nawigacji z kafelkiem "Załaduj jadłospis" na lewo od daty
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Kafelek "Załaduj jadłospis" na lewo od daty (tekst w 2 wierszach)
                OutlinedButton(
                    onClick = { openPackagesDialog() },
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier.padding(end = 4.dp)
                ) {
                    Icon(Icons.Default.MenuBook, contentDescription = null, modifier = Modifier.size(15.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Załaduj\njadłospis",
                        fontSize = 11.sp,
                        lineHeight = 13.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Start
                    )
                }

                Spacer(modifier = Modifier.weight(1f))

                // Poprzedni dzień
                IconButton(onClick = {
                    val cal = Calendar.getInstance().apply {
                        time = currentCalendar.value.time
                        add(Calendar.DAY_OF_YEAR, -1)
                    }
                    currentCalendar.value = cal
                }) {
                    Icon(Icons.Default.ChevronLeft, contentDescription = "Poprzedni dzień")
                }

                // Data i powrót do dzisiaj
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = displayDateStr.value,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    if (isToday) {
                        Surface(
                            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(4.dp),
                            modifier = Modifier.padding(top = 2.dp)
                        ) {
                            Text(
                                text = "Dzisiaj",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp)
                            )
                        }
                    } else {
                        TextButton(
                            onClick = { currentCalendar.value = Calendar.getInstance() },
                            contentPadding = PaddingValues(0.dp)
                        ) {
                            Text("← Dzisiaj", fontSize = 10.sp, color = MaterialTheme.colorScheme.primary)
                        }
                    }
                }

                // Następny dzień
                IconButton(onClick = {
                    val cal = Calendar.getInstance().apply {
                        time = currentCalendar.value.time
                        add(Calendar.DAY_OF_YEAR, 1)
                    }
                    currentCalendar.value = cal
                }) {
                    Icon(Icons.Default.ChevronRight, contentDescription = "Następny dzień")
                }
            }
        }

        if (isLoading) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
        } else {
            planResponse?.let { plan ->
                // Macro summary card
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Cal", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("${plan.totalCalories.toInt()} kcal", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
                            }
                            Column {
                                Text("B", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("${plan.totalProteinG}g", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            }
                            Column {
                                Text("T", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("${plan.totalFatG}g", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            }
                            Column {
                                Text("W", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("${plan.totalCarbsG}g", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            }
                        }
                    }
                }

                if (plan.meals.isEmpty()) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = plan.notes ?: "Brak posiłków zaplanowanych na ten dzień.",
                                fontSize = 14.sp,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            )
                        }
                    }
                } else {
                    items(plan.meals) { meal ->
                        MealItemCard(
                            meal = meal,
                            mealTime = getMealTime(meal.mealType, userSettings),
                            onToggle = {
                                scope.launch {
                                    apiService.toggleMealCompleted(meal.id)
                                    loadPlan()
                                }
                            },
                            onInfoClick = {
                                infoRecipe = meal.recipe
                            },
                            onScaleClick = {
                                scalingMeal = meal
                                scope.launch {
                                    try {
                                        scaledResult = apiService.scaleRecipe(meal.recipe.id, selectedPortions)
                                    } catch (_: Exception) {}
                                }
                            }
                        )
                    }
                }
            }
        }
    }

        // 1. Portion Scaler & Meal Options & Substitution Dialog
        scalingMeal?.let { meal ->
            com.adonis.app.ui.components.MealOptionsDialog(
                meal = meal,
                apiService = apiService,
                onDismiss = { scalingMeal = null },
                onPlanUpdated = { loadPlan() }
            )
        }

        // 2. Recipe Info / Details Dialog with photo & prep time
        infoRecipe?.let { recipe ->
            AlertDialog(
                onDismissRequest = { infoRecipe = null },
                title = {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = recipe.title,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.weight(1f)
                        )
                        IconButton(onClick = { infoRecipe = null }) {
                            Icon(Icons.Default.Close, contentDescription = "Zamknij")
                        }
                    }
                },
                text = {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .verticalScroll(rememberScrollState())
                    ) {
                        // Recipe Photo
                        if (!recipe.imageUrl.isNullOrBlank()) {
                            AsyncImage(
                                model = recipe.imageUrl,
                                contentDescription = recipe.title,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(180.dp)
                                    .clip(RoundedCornerShape(8.dp)),
                                contentScale = ContentScale.Crop
                            )
                            Spacer(modifier = Modifier.height(10.dp))
                        }

                        // Meta details: prep time & category
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                                shape = RoundedCornerShape(4.dp)
                            ) {
                                Text(
                                    text = "⏱️ ${recipe.prepTimeMinutes} min",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }

                            Surface(
                                color = MaterialTheme.colorScheme.surfaceVariant,
                                shape = RoundedCornerShape(4.dp)
                            ) {
                                Text(
                                    text = recipe.category,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Nutrition values
                        Text(
                            text = "${recipe.calories.toInt()} kcal  •  B: ${recipe.proteinG}g  •  T: ${recipe.fatG}g  •  W: ${recipe.carbsG}g",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        // Ingredients list
                        if (!recipe.ingredients.isNullOrEmpty()) {
                            Text("Składniki:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            recipe.ingredients.forEach { ing ->
                                val genderInfo = if (ing.amountFemaleG != null && ing.amountMaleG != null) {
                                    " (👩 ${ing.amountFemaleG.toInt()}g | 👨 ${ing.amountMaleG.toInt()}g)"
                                } else ""
                                val measureInfo = if (!ing.kitchenMeasure.isNullOrBlank()) " (${ing.kitchenMeasure})" else ""
                                Text(
                                    text = "• ${ing.product.name} — ${ing.amountG} ${ing.unit}$measureInfo$genderInfo (${ing.product.store})",
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(vertical = 1.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                        }

                        // Step-by-step instructions
                        Text("Sposób przygotowania:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text(
                            text = recipe.instructions ?: "Brak szczegółowego opisu przygotowania.",
                            fontSize = 13.sp,
                            lineHeight = 18.sp,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                },
                confirmButton = {
                    Button(onClick = { infoRecipe = null }) {
                        Text("Gotowe")
                    }
                }
            )
        }

        // 3. Recommendations History Dialog
        if (showRecHistoryDialog) {
            AlertDialog(
                onDismissRequest = { showRecHistoryDialog = false },
                title = { Text("Historia zaleceń dietetyka") },
                text = {
                    if (isRecHistoryLoading) {
                        Box(modifier = Modifier.fillMaxWidth().height(150.dp), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator()
                        }
                    } else if (recHistoryList.isEmpty()) {
                        Text("Brak wpisów w historii zaleceń.", fontSize = 13.sp)
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxWidth().heightIn(max = 350.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            items(recHistoryList) { rec ->
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Column(modifier = Modifier.padding(10.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = rec.title.ifBlank { "Zalecenie" },
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 13.sp
                                            )
                                            Text(
                                                text = rec.createdAt.take(10),
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                        if (!rec.dietitianName.isNullOrBlank()) {
                                            Text(
                                                text = "Dietetyk: ${rec.dietitianName}",
                                                fontSize = 11.sp,
                                                color = MaterialTheme.colorScheme.primary,
                                                modifier = Modifier.padding(vertical = 2.dp)
                                            )
                                        }
                                        Text(text = rec.content, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
                                    }
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showRecHistoryDialog = false }) {
                        Text("Zamknij")
                    }
                }
            )
        }

        // 4. Load Diet Package Dialog
        if (showLoadPackageDialog) {
            AlertDialog(
                onDismissRequest = { showLoadPackageDialog = false },
                title = { Text("Pakiety diet od dietetyka") },
                text = {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        packageActionStatus?.let { msg ->
                            Text(
                                text = msg,
                                color = if (msg.startsWith("Pomyślnie")) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                        }

                        if (isPackagesLoading) {
                            Box(modifier = Modifier.fillMaxWidth().height(150.dp), contentAlignment = Alignment.Center) {
                                CircularProgressIndicator()
                            }
                        } else if (packagesList.isEmpty()) {
                            Text(
                                text = "Brak pakietów diet przesłanych przez Twojego dietetyka. Skontaktuj się ze swoim dietetykiem na czacie, aby otrzymać spersonalizowany pakiet diety.",
                                fontSize = 13.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        } else {
                            LazyColumn(
                                modifier = Modifier.fillMaxWidth().heightIn(max = 380.dp),
                                verticalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                items(packagesList) { pkg ->
                                    Card(
                                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Column(modifier = Modifier.padding(10.dp)) {
                                            Row(
                                                modifier = Modifier.fillMaxWidth(),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Text(
                                                    text = pkg.name,
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 14.sp,
                                                    modifier = Modifier.weight(1f)
                                                )
                                                Surface(
                                                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                                                    shape = RoundedCornerShape(4.dp)
                                                ) {
                                                    Text(
                                                        text = "${pkg.targetCalories} kcal",
                                                        fontSize = 11.sp,
                                                        fontWeight = FontWeight.Bold,
                                                        color = MaterialTheme.colorScheme.primary,
                                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                    )
                                                }

                                                val genderBadge = when(pkg.targetGender) {
                                                    "female" -> "👩 Kobieta"
                                                    "male" -> "👨 Mężczyzna"
                                                    else -> "🥗 Dla każdego"
                                                }
                                                val genderColor = when(pkg.targetGender) {
                                                    "female" -> Color(0xFFF472B6)
                                                    "male" -> Color(0xFF60A5FA)
                                                    else -> Color(0xFF34D399)
                                                }
                                                Spacer(modifier = Modifier.width(4.dp))
                                                Surface(
                                                    color = genderColor.copy(alpha = 0.15f),
                                                    shape = RoundedCornerShape(4.dp)
                                                ) {
                                                    Text(
                                                        text = genderBadge,
                                                        fontSize = 10.sp,
                                                        fontWeight = FontWeight.Bold,
                                                        color = genderColor,
                                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                    )
                                                }
                                            }

                                            if (pkg.category.isNotBlank()) {
                                                Text(
                                                    text = "Kategoria: ${pkg.category}",
                                                    fontSize = 11.sp,
                                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                    modifier = Modifier.padding(vertical = 2.dp)
                                                )
                                            }

                                            if (!pkg.description.isNullOrBlank()) {
                                                Text(
                                                    text = pkg.description,
                                                    fontSize = 12.sp,
                                                    modifier = Modifier.padding(top = 2.dp, bottom = 6.dp)
                                                )
                                            }

                                            Button(
                                                onClick = {
                                                    scope.launch {
                                                        isPackagesLoading = true
                                                        try {
                                                            val res = apiService.loadDietPackage(
                                                                PatientLoadPackageRequest(
                                                                    templateId = pkg.id,
                                                                    startDate = selectedDateStr.value
                                                                )
                                                            )
                                                            val msg = (res["message"] as? String) ?: "Pakiet załadowany"
                                                            packageActionStatus = msg
                                                            loadPlan()
                                                            showLoadPackageDialog = false
                                                        } catch (e: Exception) {
                                                            packageActionStatus = "Błąd: ${e.message}"
                                                        } finally {
                                                            isPackagesLoading = false
                                                        }
                                                    }
                                                },
                                                modifier = Modifier.fillMaxWidth(),
                                                contentPadding = PaddingValues(vertical = 4.dp)
                                            ) {
                                                Text("Wybierz i zastosuj od ${selectedDateStr.value}", fontSize = 12.sp)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                confirmButton = {
                    TextButton(onClick = { showLoadPackageDialog = false }) {
                        Text("Anuluj")
                    }
                }
            )
        }
    }

@Composable
fun MealItemCard(
    meal: PlannedMeal,
    mealTime: String = "12:00",
    onToggle: () -> Unit,
    onInfoClick: () -> Unit,
    onScaleClick: () -> Unit
) {
    val shortMealName = formatShortMealType(meal.mealType)

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onInfoClick() }
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Górny wiersz: Nazwa posiłku + Godzina + Czas przygotowania + Ikonka info ("i") + Radio/Ptaszek zjedzone
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = shortMealName,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )

                    // Stała godzina posiłku (np. 🕗 08:00)
                    Surface(
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = "🕗 $mealTime",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                        )
                    }

                    // Czas przygotowania
                    Surface(
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = "⏱️ ${meal.recipe.prepTimeMinutes}m",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                        )
                    }

                    // Ikonka "i" w kółeczku przeniesiona do góry obok czasu przygotowania
                    IconButton(
                        onClick = onInfoClick,
                        modifier = Modifier.size(22.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Info,
                            contentDescription = "Szczegóły przepisu",
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                // Radiobox / ptaszek do oznaczania zjedzonego
                IconButton(
                    onClick = onToggle,
                    modifier = Modifier.size(30.dp)
                ) {
                    Icon(
                        imageVector = if (meal.isCompleted) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                        contentDescription = if (meal.isCompleted) "Zjedzone" else "Oznacz zjedzone",
                        tint = if (meal.isCompleted) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline,
                        modifier = Modifier.size(24.dp)
                    )
                }
            }

            if (meal.isCustomSubstitution) {
                Surface(
                    color = Color(0x33F59E0B),
                    shape = RoundedCornerShape(4.dp),
                    modifier = Modifier.padding(bottom = 2.dp)
                ) {
                    Text(
                        "Zamieniony przez pacjenta",
                        color = Color(0xFFFBBF24),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            // Tytuł przepisu - zmniejszona czcionka, mieści się w 2 wersach
            Text(
                text = if (meal.isCustomSubstitution && !meal.customName.isNullOrBlank()) "Zamieniono: ${meal.customName}" else meal.recipe.title,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 18.sp,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
            )

            // Makroskładniki z symbolami Cal, B, T, W
            val dispCal = if (meal.isCustomSubstitution && meal.customCalories != null) meal.customCalories.toInt() else meal.recipe.calories.toInt()
            val dispP = if (meal.isCustomSubstitution && meal.customProteinG != null) meal.customProteinG else meal.recipe.proteinG
            val dispF = if (meal.isCustomSubstitution && meal.customFatG != null) meal.customFatG else meal.recipe.fatG
            val dispC = if (meal.isCustomSubstitution && meal.customCarbsG != null) meal.customCarbsG else meal.recipe.carbsG

            Text(
                text = "Cal: $dispCal kcal  •  B: ${dispP}g  •  T: ${dispF}g  •  W: ${dispC}g",
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f)
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Przycisk "Zamień posiłek"
            OutlinedButton(
                onClick = onScaleClick,
                modifier = Modifier.fillMaxWidth(),
                contentPadding = PaddingValues(vertical = 4.dp)
            ) {
                Icon(Icons.Default.SwapHoriz, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Zamień posiłek", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

fun getShortDayOfWeek(cal: Calendar): String {
    return when (cal.get(Calendar.DAY_OF_WEEK)) {
        Calendar.MONDAY -> "Pn"
        Calendar.TUESDAY -> "Wt"
        Calendar.WEDNESDAY -> "Śr"
        Calendar.THURSDAY -> "Cz"
        Calendar.FRIDAY -> "Pt"
        Calendar.SATURDAY -> "Sb"
        Calendar.SUNDAY -> "Nd"
        else -> ""
    }
}

fun formatShortMealType(mealType: String): String {
    val t = mealType.lowercase().trim()
    return when {
        t == "śniadanie" -> "Śniad."
        t == "drugie śniadanie" || t.contains("drugie") -> "II Śniad."
        t == "obiad" -> "Obiad"
        t == "podwieczorek" || t == "przekąska" || t.contains("przekąsk") -> "Przek."
        t == "kolacja" -> "Kolacja"
        else -> mealType
    }
}

fun getMealTime(mealType: String, settings: UserNotificationSettings?): String {
    val t = mealType.lowercase()
    return when {
        t.contains("śniadanie") && !t.contains("drugie") -> settings?.mealTimeBreakfast ?: "08:00"
        t.contains("drugie") -> settings?.mealTimeSecondBreakfast ?: "11:00"
        t.contains("obiad") -> settings?.mealTimeLunch ?: "14:00"
        t.contains("przekąsk") || t.contains("podwieczor") -> settings?.mealTimeSnack ?: "17:00"
        t.contains("kolacj") -> settings?.mealTimeDinner ?: "20:00"
        else -> "12:00"
    }
}

