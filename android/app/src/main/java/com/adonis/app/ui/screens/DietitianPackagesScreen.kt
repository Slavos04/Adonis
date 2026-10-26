package com.adonis.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.model.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DietitianPackagesScreen(
    apiService: AdonisApiService
) {
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var successMessage by remember { mutableStateOf<String?>(null) }

    var templates by remember { mutableStateOf<List<DietPlanTemplate>>(emptyList()) }
    var patients by remember { mutableStateOf<List<User>>(emptyList()) }
    var availableRecipes by remember { mutableStateOf<List<Recipe>>(emptyList()) }

    var selectedCategory by remember { mutableStateOf("Wszystkie") }
    var searchQuery by remember { mutableStateOf("") }

    // Dialog wdrożenia pakietu
    var deployingTemplate by remember { mutableStateOf<DietPlanTemplate?>(null) }
    var selectedPatientId by remember { mutableStateOf<Int?>(null) }
    val dateFormat = remember { SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()) }
    var startDateStr by remember { mutableStateOf(dateFormat.format(Date())) }
    var notesStr by remember { mutableStateOf("Spersonalizowany plan diety wdrożony przez dietetyka.") }
    var isSending by remember { mutableStateOf(false) }

    // Dialog tworzenia nowego pakietu diety
    var showCreateTemplateDialog by remember { mutableStateOf(false) }

    val categories = remember {
        listOf("Wszystkie", "Dieta redukcyjna", "Dieta wysokobiałkowa", "Niski indeks glikemiczny", "Dieta wegetariańska", "Zbilansowana")
    }

    val loadData = {
        scope.launch {
            isLoading = true
            errorMessage = null
            try {
                val tList = apiService.getDietTemplates()
                templates = tList
            } catch (e: Exception) {
                errorMessage = "Nie udało się pobrać pakietów: ${e.localizedMessage}"
            }

            try {
                val pList = apiService.getPatients()
                patients = pList
                if (pList.isNotEmpty() && selectedPatientId == null) {
                    selectedPatientId = pList.first().id
                }
            } catch (_: Exception) {}

            try {
                availableRecipes = apiService.getRecipes()
            } catch (_: Exception) {}

            isLoading = false
        }
    }

    LaunchedEffect(Unit) {
        loadData()
    }

    val filteredTemplates = remember(templates, selectedCategory, searchQuery) {
        templates.filter { t ->
            val matchCategory = selectedCategory == "Wszystkie" || t.category.contains(selectedCategory, ignoreCase = true)
            val matchQuery = searchQuery.isBlank() ||
                    t.name.contains(searchQuery, ignoreCase = true) ||
                    (t.description?.contains(searchQuery, ignoreCase = true) == true) ||
                    t.category.contains(searchQuery, ignoreCase = true)
            matchCategory && matchQuery
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Nagłówek
        Text(
            text = "Szablony i pakiety diet",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Twórz nowe jadłospisy, modyfikuj pakiety i wdrażaj je bezpośrednio swoim pacjentom",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 10.dp)
        )

        // Przycisk tworzenia nowego pakietu diety
        Button(
            onClick = { showCreateTemplateDialog = true },
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            shape = RoundedCornerShape(10.dp)
        ) {
            Icon(Icons.Default.AddCircleOutline, contentDescription = null, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text("Utwórz nowy pakiet diety", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
        }

        // Komunikaty sukcesu / błędu
        successMessage?.let { msg ->
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = msg, fontSize = 13.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                }
            }
        }

        errorMessage?.let { msg ->
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Error, contentDescription = null, tint = MaterialTheme.colorScheme.error)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = msg, fontSize = 13.sp, color = MaterialTheme.colorScheme.onErrorContainer)
                }
            }
        }

        // Wyszukiwarka
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Szukaj pakietu diety...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Szukaj") },
            trailingIcon = {
                if (searchQuery.isNotBlank()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Default.Clear, contentDescription = "Wyczyść")
                    }
                }
            },
            singleLine = true,
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp),
            shape = RoundedCornerShape(12.dp)
        )

        // Pasek kategorii
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 14.dp)
        ) {
            items(categories) { cat ->
                val isSelected = cat == selectedCategory
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedCategory = cat },
                    label = { Text(cat, fontSize = 12.sp) }
                )
            }
        }

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else if (filteredTemplates.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.FolderOpen, contentDescription = null, modifier = Modifier.size(48.dp), tint = MaterialTheme.colorScheme.outline)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Brak pakietów diety spełniających kryteria.",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.outline
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredTemplates) { tpl ->
                    ElevatedCard(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = tpl.name,
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.weight(1f)
                                )

                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = MaterialTheme.colorScheme.primaryContainer
                                ) {
                                    Text(
                                        text = "${tpl.targetCalories} kcal",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(4.dp))

                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = MaterialTheme.colorScheme.secondaryContainer
                                ) {
                                    Text(
                                        text = tpl.category,
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }

                                Text(
                                    text = "${tpl.mealsPerDay} posiłki / dzień",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }

                            if (!tpl.description.isNullOrBlank()) {
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = tpl.description,
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    lineHeight = 18.sp
                                )
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Button(
                                onClick = {
                                    deployingTemplate = tpl
                                },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Wdróż ten pakiet pacjentowi", fontSize = 13.sp)
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal: Utworzenie nowego szablonu / pakietu diety
    if (showCreateTemplateDialog) {
        var templateName by remember { mutableStateOf("") }
        var templateCategory by remember { mutableStateOf("Dieta redukcyjna") }
        var templateDesc by remember { mutableStateOf("") }
        var templateCalories by remember { mutableStateOf("2000") }
        var mealsPerDayCount by remember { mutableStateOf("4") }
        var isSavingTemplate by remember { mutableStateOf(false) }
        var templateError by remember { mutableStateOf<String?>(null) }

        val categoryOptions = listOf(
            "Dieta redukcyjna", "Dieta na masę", "Dieta wysokobiałkowa",
            "Niski indeks glikemiczny", "Dieta wegetariańska", "Zbilansowana"
        )
        val dayNames = listOf("Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela")
        val mealTypes = listOf("Śniadanie", "Drugie śniadanie", "Obiad", "Podwieczorek", "Kolacja")

        AlertDialog(
            onDismissRequest = { showCreateTemplateDialog = false },
            title = { Text("Utwórz nowy pakiet diety") },
            text = {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        templateError?.let {
                            Text(it, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = templateName,
                            onValueChange = { templateName = it },
                            label = { Text("Nazwa pakietu diety (np. Redukcja 2000 kcal)") },
                            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                    }
                    item {
                        Text("Kategoria diety:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(categoryOptions) { cat ->
                                FilterChip(
                                    selected = templateCategory == cat,
                                    onClick = { templateCategory = cat },
                                    label = { Text(cat, fontSize = 11.sp) }
                                )
                            }
                        }
                    }
                    item {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = templateCalories,
                                onValueChange = { templateCalories = it },
                                label = { Text("Kalorie [kcal]") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )
                            OutlinedTextField(
                                value = mealsPerDayCount,
                                onValueChange = { mealsPerDayCount = it },
                                label = { Text("Liczba posiłków (3-5)") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = templateDesc,
                            onValueChange = { templateDesc = it },
                            label = { Text("Opis i założenia diety dla pacjenta") },
                            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(110.dp),
                            maxLines = 5
                        )
                    }
                    item {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.AutoFixHigh, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "System automatycznie utworzy pełny 7-dniowy cykl jadłospisu, dopasowując zbilansowane dania z bazy przepisów.",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val cal = templateCalories.toIntOrNull() ?: 2000
                        val mealsCount = mealsPerDayCount.toIntOrNull()?.coerceIn(3, 5) ?: 4

                        if (templateName.isBlank()) {
                            templateError = "Podaj nazwę pakietu diety."
                            return@Button
                        }
                        if (availableRecipes.isEmpty()) {
                            templateError = "Baza przepisów jest pusta. Dodaj najpierw przepisy."
                            return@Button
                        }

                        scope.launch {
                            isSavingTemplate = true
                            try {
                                // Dobierz przepisy z bazy do każdego dnia tygodnia
                                val daysList = dayNames.mapIndexed { dayIdx, dayName ->
                                    val dayMeals = (1..mealsCount).map { mealIdx ->
                                        val mType = when (mealIdx) {
                                            1 -> "Śniadanie"
                                            2 -> if (mealsCount == 3) "Obiad" else "Drugie śniadanie"
                                            3 -> if (mealsCount == 3) "Kolacja" else "Obiad"
                                            4 -> if (mealsCount == 4) "Kolacja" else "Podwieczorek"
                                            else -> "Kolacja"
                                        }
                                        // Znajdź przepis pasujący do kategorii lub dowolny inny
                                        val matchRecipe = availableRecipes.filter { it.category.contains(mType, ignoreCase = true) }
                                            .let { list ->
                                                if (list.isNotEmpty()) list[(dayIdx + mealIdx) % list.size]
                                                else availableRecipes[(dayIdx + mealIdx) % availableRecipes.size]
                                            }

                                        TemplateMealInput(
                                            mealType = mType,
                                            recipeId = matchRecipe.id,
                                            portions = 1.0
                                        )
                                    }

                                    TemplateDayInput(
                                        dayNumber = dayIdx + 1,
                                        dayName = dayName,
                                        meals = dayMeals
                                    )
                                }

                                val req = DietPlanTemplateCreateRequest(
                                    name = templateName.trim(),
                                    category = templateCategory,
                                    description = templateDesc.trim(),
                                    targetCalories = cal,
                                    mealsPerDay = mealsCount,
                                    daysData = daysList
                                )

                                apiService.createDietTemplate(req)
                                successMessage = "Pakiet '${templateName.trim()}' został pomyślnie utworzony!"
                                showCreateTemplateDialog = false
                                loadData()
                            } catch (e: Exception) {
                                templateError = "Błąd zapisu pakietu: ${e.localizedMessage}"
                            } finally {
                                isSavingTemplate = false
                            }
                        }
                    },
                    enabled = !isSavingTemplate
                ) {
                    if (isSavingTemplate) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text("Zapisz pakiet")
                }
            },
            dismissButton = {
                TextButton(onClick = { showCreateTemplateDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Modal: Wdrożenie wybranego pakietu pacjentowi
    if (deployingTemplate != null) {
        val tpl = deployingTemplate!!
        AlertDialog(
            onDismissRequest = { deployingTemplate = null },
            title = {
                Column {
                    Text(text = "Wdróż pakiet pacjentowi", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Text(text = tpl.name, fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
                }
            },
            text = {
                Column {
                    Text(
                        text = "Wybierz pacjenta, któremu zostanie przypisany ten plan żywieniowy od wybranego dnia:",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )

                    Text(text = "Wybierz pacjenta:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(4.dp))
                    if (patients.isNotEmpty()) {
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(130.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            items(patients) { p ->
                                val isChosen = p.id == selectedPatientId
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (isChosen) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { selectedPatientId = p.id }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        RadioButton(
                                            selected = isChosen,
                                            onClick = { selectedPatientId = p.id }
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Column {
                                            Text(
                                                text = "${p.firstName} ${p.lastName}".ifBlank { p.username },
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 13.sp
                                            )
                                            Text(text = p.email, fontSize = 11.sp)
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        Text("Brak przypisanych pacjentów do wyboru.", fontSize = 12.sp, color = MaterialTheme.colorScheme.error)
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = startDateStr,
                        onValueChange = { startDateStr = it },
                        label = { Text("Data początkowa (RRRR-MM-DD)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = notesStr,
                        onValueChange = { notesStr = it },
                        label = { Text("Wiadomość / Notatka dla pacjenta") },
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val pid = selectedPatientId ?: return@Button
                        scope.launch {
                            isSending = true
                            try {
                                val res = apiService.sendTemplateToPatient(
                                    templateId = tpl.id,
                                    request = ApplyTemplateToPatientRequest(
                                        patientId = pid,
                                        startDate = startDateStr.trim(),
                                        notes = notesStr.trim()
                                    )
                                )
                                successMessage = res["message"] as? String ?: "Pakiet '${tpl.name}' został pomyślnie wdrożony!"
                                deployingTemplate = null
                            } catch (e: Exception) {
                                errorMessage = "Błąd wdrożenia pakietu: ${e.localizedMessage}"
                            } finally {
                                isSending = false
                            }
                        }
                    },
                    enabled = !isSending && selectedPatientId != null
                ) {
                    if (isSending) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text("Potwierdź i wyślij")
                }
            },
            dismissButton = {
                TextButton(onClick = { deployingTemplate = null }) {
                    Text("Anuluj")
                }
            }
        )
    }
}
