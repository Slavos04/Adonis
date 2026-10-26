package com.adonis.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.model.*
import com.adonis.app.ui.components.WeightAndWaistChartCard
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DietitianPatientsScreen(
    apiService: AdonisApiService,
    onNavigateToChat: (patientId: Int) -> Unit
) {
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var successMessage by remember { mutableStateOf<String?>(null) }

    var patients by remember { mutableStateOf<List<User>>(emptyList()) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedPatientId by remember { mutableStateOf<Int?>(null) }

    // Patient profile details state
    var selectedPatientProfile by remember { mutableStateOf<PatientProfile?>(null) }
    var patientMeasurements by remember { mutableStateOf<List<Measurement>>(emptyList()) }

    // Form state for goals
    var dailyCalories by remember { mutableStateOf("2000") }
    var proteinG by remember { mutableStateOf("140.0") }
    var fatG by remember { mutableStateOf("60.0") }
    var carbsG by remember { mutableStateOf("220.0") }
    var targetWeight by remember { mutableStateOf("70.0") }
    var patientHeightInput by remember { mutableStateOf("175") }
    var mealsPerDay by remember { mutableStateOf("4") }
    var officialRecommendations by remember { mutableStateOf("") }
    var isSavingGoals by remember { mutableStateOf(false) }

    // Modals state
    var showAddRecDialog by remember { mutableStateOf(false) }
    var showHistoryDialog by remember { mutableStateOf(false) }
    var showDeployPackageDialog by remember { mutableStateOf(false) }

    // Templates for quick deployment
    var templates by remember { mutableStateOf<List<DietPlanTemplate>>(emptyList()) }
    var recommendationsHistory by remember { mutableStateOf<List<PatientRecommendation>>(emptyList()) }

    // Load patients list
    val loadPatients: () -> Unit = {
        scope.launch {
            isLoading = true
            errorMessage = null
            try {
                val list = apiService.getPatients()
                patients = list
                if (list.isNotEmpty() && (selectedPatientId == null || list.none { it.id == selectedPatientId })) {
                    selectedPatientId = list.first().id
                }
            } catch (e: Exception) {
                errorMessage = "Nie udało się pobrać pacjentów: ${e.localizedMessage ?: "Błąd połączenia"}"
            } finally {
                isLoading = false
            }
        }
    }

    // Load details for selected patient
    LaunchedEffect(selectedPatientId) {
        val pid = selectedPatientId ?: return@LaunchedEffect
        scope.launch {
            try {
                val resp = apiService.getPatientProfile(pid)
                val prof = resp.profile
                selectedPatientProfile = prof
                if (prof != null) {
                    dailyCalories = prof.dailyCaloriesGoal.toString()
                    proteinG = prof.proteinGoalG.toString()
                    fatG = prof.fatGoalG.toString()
                    carbsG = prof.carbsGoalG.toString()
                    targetWeight = prof.targetWeight.toString()
                    patientHeightInput = (prof.height.toInt()).toString()
                    mealsPerDay = (prof.mealsPerDay ?: 4).toString()
                    officialRecommendations = prof.officialRecommendations ?: ""
                }
            } catch (_: Exception) {}

            try {
                val mList = apiService.getPatientMeasurements(pid)
                patientMeasurements = mList
            } catch (_: Exception) {
                patientMeasurements = emptyList()
            }
        }
    }

    LaunchedEffect(Unit) {
        loadPatients()
        try {
            templates = apiService.getDietTemplates()
        } catch (_: Exception) {}
    }

    val filteredPatients = remember(patients, searchQuery) {
        if (searchQuery.isBlank()) patients
        else {
            val q = searchQuery.trim().lowercase()
            patients.filter {
                it.firstName.lowercase().contains(q) ||
                it.lastName.lowercase().contains(q) ||
                it.email.lowercase().contains(q) ||
                it.username.lowercase().contains(q)
            }
        }
    }

    val currentPatient = patients.find { it.id == selectedPatientId }

    if (isLoading && patients.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Tytuł
        Text(
            text = "Kartoteka pacjentów",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Zarządzaj celami makro, zaleceniami oraz dietami swoich podopiecznych",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Sukces / Błąd Snackbary
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

        // Wyszukiwarka pacjentów
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("Szukaj pacjenta (imię, nazwisko, e-mail)...") },
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
                .padding(bottom = 12.dp),
            shape = RoundedCornerShape(12.dp)
        )

        // Poziomy pasek wyboru pacjentów
        if (filteredPatients.isNotEmpty()) {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 14.dp)
            ) {
                items(filteredPatients) { p ->
                    val isSelected = p.id == selectedPatientId
                    FilterChip(
                        selected = isSelected,
                        onClick = {
                            selectedPatientId = p.id
                            successMessage = null
                            errorMessage = null
                        },
                        label = {
                            Text(
                                text = "${p.firstName} ${p.lastName}".ifBlank { p.username },
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        leadingIcon = {
                            Icon(
                                Icons.Default.Person,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    )
                }
            }
        } else {
            Text(
                text = "Brak przypisanych pacjentów spełniających kryteria.",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.outline,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }

        // Szczegóły wybranego pacjenta
        if (currentPatient != null) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Karta nagłówkowa pacjenta z szybkimi akcjami
                item {
                    ElevatedCard(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(46.dp)
                                            .clip(CircleShape)
                                            .background(MaterialTheme.colorScheme.primaryContainer),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = currentPatient.firstName.take(1).uppercase() +
                                                    currentPatient.lastName.take(1).uppercase(),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 18.sp,
                                            color = MaterialTheme.colorScheme.onPrimaryContainer
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column {
                                        Text(
                                            text = "${currentPatient.firstName} ${currentPatient.lastName}".ifBlank { currentPatient.username },
                                            fontSize = 18.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Text(
                                            text = currentPatient.email,
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { onNavigateToChat(currentPatient.id) },
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.Chat, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Czat z pacjentem", fontSize = 12.sp)
                                }

                                FilledTonalButton(
                                    onClick = { showDeployPackageDialog = true },
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.AutoAwesome, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Wdróż dietę", fontSize = 12.sp)
                                }
                            }
                        }
                    }
                }

                // Sekcja 1: Cele kaloryczne i makroskładniki
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(bottom = 12.dp)
                            ) {
                                Icon(Icons.Default.TrackChanges, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Cele kaloryczne i makroskładniki",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedTextField(
                                    value = dailyCalories,
                                    onValueChange = { dailyCalories = it },
                                    label = { Text("Kalorie (kcal)") },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.weight(1f),
                                    singleLine = true
                                )
                                OutlinedTextField(
                                    value = targetWeight,
                                    onValueChange = { targetWeight = it },
                                    label = { Text("Waga docel. (kg)") },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.weight(1f),
                                    singleLine = true
                                )
                                OutlinedTextField(
                                    value = patientHeightInput,
                                    onValueChange = { patientHeightInput = it.filter { ch -> ch.isDigit() || ch == '.' } },
                                    label = { Text("Wzrost (cm)") },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.weight(1f),
                                    singleLine = true
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedTextField(
                                    value = proteinG,
                                    onValueChange = { proteinG = it },
                                    label = { Text("Białko (g)") },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.weight(1f),
                                    singleLine = true
                                )
                                OutlinedTextField(
                                    value = fatG,
                                    onValueChange = { fatG = it },
                                    label = { Text("Tłuszcze (g)") },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.weight(1f),
                                    singleLine = true
                                )
                                OutlinedTextField(
                                    value = carbsG,
                                    onValueChange = { carbsG = it },
                                    label = { Text("Węgle (g)") },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.weight(1f),
                                    singleLine = true
                                )
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            OutlinedTextField(
                                value = mealsPerDay,
                                onValueChange = { mealsPerDay = it },
                                label = { Text("Liczba posiłków dziennie (np. 3, 4, 5)") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true
                            )

                            Spacer(modifier = Modifier.height(14.dp))

                            Button(
                                onClick = {
                                    scope.launch {
                                        isSavingGoals = true
                                        successMessage = null
                                        errorMessage = null
                                        try {
                                            val cals = dailyCalories.toIntOrNull() ?: 2000
                                            val p = proteinG.toDoubleOrNull() ?: 140.0
                                            val f = fatG.toDoubleOrNull() ?: 60.0
                                            val c = carbsG.toDoubleOrNull() ?: 220.0
                                            val tw = targetWeight.toDoubleOrNull() ?: 70.0
                                            val h = patientHeightInput.toDoubleOrNull() ?: 175.0
                                            val mpd = mealsPerDay.toIntOrNull() ?: 4

                                            apiService.updatePatientProfile(
                                                patientId = currentPatient.id,
                                                body = PatientProfileUpdateRequest(
                                                    dailyCaloriesGoal = cals,
                                                    proteinGoalG = p,
                                                    fatGoalG = f,
                                                    carbsGoalG = c,
                                                    targetWeight = tw,
                                                    height = h,
                                                    mealsPerDay = mpd,
                                                    officialRecommendations = officialRecommendations
                                                )
                                            )
                                            selectedPatientProfile = selectedPatientProfile?.copy(
                                                height = h,
                                                targetWeight = tw,
                                                dailyCaloriesGoal = cals
                                            )
                                            successMessage = "Cele i parametry pacjenta zostały zaktualizowane pomyślnie!"
                                        } catch (e: Exception) {
                                            errorMessage = "Błąd zapisu celów: ${e.localizedMessage ?: "Spróbuj ponownie"}"
                                        } finally {
                                            isSavingGoals = false
                                        }
                                    }
                                },
                                enabled = !isSavingGoals,
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                if (isSavingGoals) {
                                    CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color.White)
                                    Spacer(modifier = Modifier.width(8.dp))
                                }
                                Icon(Icons.Default.Save, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Zapisz cele i makroskładniki")
                            }
                        }
                    }
                }

                // Sekcja 2: Oficjalne zalecenia dietetyka
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(bottom = 8.dp)
                            ) {
                                Icon(Icons.Default.Description, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Oficjalne zalecenia dietetyczne",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            if (officialRecommendations.isNotBlank()) {
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = MaterialTheme.colorScheme.surface,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(bottom = 12.dp)
                                ) {
                                    Text(
                                        text = officialRecommendations,
                                        fontSize = 13.sp,
                                        modifier = Modifier.padding(12.dp),
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                }
                            } else {
                                Text(
                                    text = "Brak aktywnych zaleceń dla tego pacjenta.",
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.outline,
                                    modifier = Modifier.padding(bottom = 12.dp)
                                )
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { showAddRecDialog = true },
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Nowe zalecenie", fontSize = 12.sp)
                                }

                                OutlinedButton(
                                    onClick = {
                                        scope.launch {
                                            try {
                                                recommendationsHistory = apiService.getPatientRecommendationsHistory(currentPatient.id)
                                                showHistoryDialog = true
                                            } catch (e: Exception) {
                                                errorMessage = "Błąd pobierania historii: ${e.localizedMessage}"
                                            }
                                        }
                                    },
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Icon(Icons.Default.History, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Historia", fontSize = 12.sp)
                                }
                            }
                        }
                    }
                }

                // Sekcja 3: Historia pomiarów pacjenta
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(bottom = 10.dp)
                            ) {
                                Icon(Icons.Default.ShowChart, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Historia pomiarów pacjenta",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            // Wykres trendu wagi i obwodu talii z poziomem BMI i wzrostem
                            val currentHeight = selectedPatientProfile?.height ?: (patientHeightInput.toDoubleOrNull() ?: 175.0)
                            WeightAndWaistChartCard(
                                measurements = patientMeasurements,
                                patientHeight = currentHeight,
                                onUpdateHeight = { newH ->
                                    patientHeightInput = newH.toInt().toString()
                                    scope.launch {
                                        try {
                                            apiService.updatePatientProfile(
                                                patientId = currentPatient.id,
                                                body = PatientProfileUpdateRequest(height = newH)
                                            )
                                            selectedPatientProfile = selectedPatientProfile?.copy(height = newH)
                                        } catch (_: Exception) {}
                                    }
                                }
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            if (patientMeasurements.isNotEmpty()) {
                                patientMeasurements.take(5).forEach { m ->
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = MaterialTheme.colorScheme.surface,
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(bottom = 8.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(12.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Column {
                                                Text(
                                                    text = m.date,
                                                    fontSize = 12.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = MaterialTheme.colorScheme.primary
                                                )
                                                m.notes?.let { note ->
                                                    if (note.isNotBlank()) {
                                                        Text(
                                                            text = note,
                                                            fontSize = 11.sp,
                                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                                        )
                                                    }
                                                }
                                            }

                                            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                                Column(horizontalAlignment = Alignment.End) {
                                                    Text(text = "Waga", fontSize = 10.sp, color = MaterialTheme.colorScheme.outline)
                                                    Text(text = "${m.weight} kg", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                                }
                                                m.waistCm?.let { waist ->
                                                    Column(horizontalAlignment = Alignment.End) {
                                                        Text(text = "Talia", fontSize = 10.sp, color = MaterialTheme.colorScheme.outline)
                                                        Text(text = "$waist cm", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                Text(
                                    text = "Pacjent nie wprowadził jeszcze żadnych pomiarów wagi.",
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.outline,
                                    modifier = Modifier.padding(vertical = 4.dp)
                                )
                            }
                        }
                    }
                }

                item {
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }
    }

    // Modal: Dodanie nowego zalecenia
    if (showAddRecDialog && currentPatient != null) {
        var recTitle by remember { mutableStateOf("Zalecenia żywieniowe") }
        var recContent by remember { mutableStateOf("") }
        var isSubmitting by remember { mutableStateOf(false) }

        AlertDialog(
            onDismissRequest = { showAddRecDialog = false },
            title = { Text("Dodaj nowe zalecenie dla pacjenta") },
            text = {
                Column {
                    Text(
                        text = "Pacjent ${currentPatient.firstName} ${currentPatient.lastName} otrzyma natychmiastowe powiadomienie na telefon.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )
                    OutlinedTextField(
                        value = recTitle,
                        onValueChange = { recTitle = it },
                        label = { Text("Tytuł zalecenia") },
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = recContent,
                        onValueChange = { recContent = it },
                        label = { Text("Treść zalecenia dietetycznego") },
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp),
                        maxLines = 6
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (recContent.isBlank()) return@Button
                        scope.launch {
                            isSubmitting = true
                            try {
                                apiService.addPatientRecommendation(
                                    patientId = currentPatient.id,
                                    body = AddRecommendationRequest(
                                        title = recTitle.ifBlank { "Zalecenia dietetyczne" },
                                        content = recContent
                                    )
                                )
                                officialRecommendations = recContent
                                successMessage = "Zalecenie zostało pomyślnie zapisane i wysłane pacjentowi!"
                                showAddRecDialog = false
                            } catch (e: Exception) {
                                errorMessage = "Błąd zapisu zalecenia: ${e.localizedMessage}"
                            } finally {
                                isSubmitting = false
                            }
                        }
                    },
                    enabled = !isSubmitting && recContent.isNotBlank()
                ) {
                    if (isSubmitting) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text("Zapisz i powiadom")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddRecDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Modal: Historia zaleceń
    if (showHistoryDialog) {
        AlertDialog(
            onDismissRequest = { showHistoryDialog = false },
            title = { Text("Historia zaleceń pacjenta") },
            text = {
                if (recommendationsHistory.isNotEmpty()) {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(300.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(recommendationsHistory) { rec ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(text = rec.title, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        Text(text = rec.createdAt.take(10), fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(text = rec.content, fontSize = 12.sp)
                                }
                            }
                        }
                    }
                } else {
                    Text("Brak wpisów w historii zaleceń tego pacjenta.")
                }
            },
            confirmButton = {
                TextButton(onClick = { showHistoryDialog = false }) {
                    Text("Zamknij")
                }
            }
        )
    }

    // Modal: Wdrożenie pakietu diety
    if (showDeployPackageDialog && currentPatient != null) {
        val dateFormat = remember { SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()) }
        var selectedTemplateId by remember { mutableStateOf(templates.firstOrNull()?.id ?: 0) }
        var startDateStr by remember { mutableStateOf(dateFormat.format(Date())) }
        var deployNotes by remember { mutableStateOf("Spersonalizowany jadłospis wdrożony przez Twojego dietetyka") }
        var isDeploying by remember { mutableStateOf(false) }

        AlertDialog(
            onDismissRequest = { showDeployPackageDialog = false },
            title = { Text("Wdróż pakiet diety dla pacjenta") },
            text = {
                Column {
                    Text(
                        text = "Wybierz gotowy pakiet diety, który zostanie przypisany do kalendarza pacjenta ${currentPatient.firstName}.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )

                    Text(text = "Pakiet diety:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(4.dp))
                    if (templates.isNotEmpty()) {
                        LazyColumn(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(130.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            items(templates) { tpl ->
                                val isChosen = tpl.id == selectedTemplateId
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (isChosen) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { selectedTemplateId = tpl.id }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(10.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        RadioButton(
                                            selected = isChosen,
                                            onClick = { selectedTemplateId = tpl.id }
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Column {
                                            Text(text = tpl.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            Text(text = "${tpl.category} • ${tpl.targetCalories} kcal", fontSize = 11.sp)
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        Text("Brak szablonów diet w systemie.", fontSize = 12.sp, color = MaterialTheme.colorScheme.error)
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
                        value = deployNotes,
                        onValueChange = { deployNotes = it },
                        label = { Text("Notatka dla pacjenta") },
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (selectedTemplateId == 0) return@Button
                        scope.launch {
                            isDeploying = true
                            try {
                                val res = apiService.sendTemplateToPatient(
                                    templateId = selectedTemplateId,
                                    request = ApplyTemplateToPatientRequest(
                                        patientId = currentPatient.id,
                                        startDate = startDateStr.trim(),
                                        notes = deployNotes.trim()
                                    )
                                )
                                successMessage = res["message"] as? String ?: "Pakiet diety został pomyślnie wdrożony!"
                                showDeployPackageDialog = false
                            } catch (e: Exception) {
                                errorMessage = "Błąd wdrożenia pakietu: ${e.localizedMessage}"
                            } finally {
                                isDeploying = false
                            }
                        }
                    },
                    enabled = !isDeploying && selectedTemplateId != 0
                ) {
                    if (isDeploying) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text("Wdróż pakiet")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeployPackageDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }
}
