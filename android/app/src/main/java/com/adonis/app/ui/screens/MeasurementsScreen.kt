package com.adonis.app.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.model.Measurement
import com.adonis.app.data.model.MeasurementRequest
import com.adonis.app.data.model.PatientRecommendation
import com.adonis.app.ui.components.WeightAndWaistChartCard
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun MeasurementsScreen(apiService: AdonisApiService) {
    var measurements by remember { mutableStateOf<List<Measurement>>(emptyList()) }
    var patientHeight by remember { mutableStateOf(175.0) }
    var isLoading by remember { mutableStateOf(true) }
    var showAddDialog by remember { mutableStateOf(false) }

    // Zalecenia dietetyka i historia jadłospisów
    var showRecommendationsDialog by remember { mutableStateOf(false) }
    var officialRecommendations by remember { mutableStateOf<String?>(null) }
    var recommendationsUpdatedAt by remember { mutableStateOf<String?>(null) }
    var currentDietTitle by remember { mutableStateOf<String?>("Zbilansowany jadłospis tygodniowy") }
    var recHistoryList by remember { mutableStateOf<List<PatientRecommendation>>(emptyList()) }
    var isRecLoading by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()

    fun updateHeight(newH: Double) {
        scope.launch {
            try {
                patientHeight = newH
                apiService.updateMyProfile(com.adonis.app.data.model.PatientProfileUpdateRequest(height = newH))
            } catch (_: Exception) {}
        }
    }

    fun loadData() {
        scope.launch {
            isLoading = true
            try {
                val list = apiService.getMeasurements()
                measurements = list.sortedBy { it.date }
            } catch (_: Exception) {}

            try {
                val meResp = apiService.getMyProfile()
                val prof = meResp.profile
                if (prof != null) {
                    if (prof.height > 0) patientHeight = prof.height
                    officialRecommendations = prof.officialRecommendations
                    recommendationsUpdatedAt = prof.recommendationsUpdatedAt
                }
            } catch (_: Exception) {}

            try {
                val plan = apiService.getDailyPlan()
                if (!plan.notes.isNullOrBlank()) {
                    currentDietTitle = plan.notes
                }
            } catch (_: Exception) {}

            try {
                recHistoryList = apiService.getMyRecommendationsHistory()
            } catch (_: Exception) {}
            finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        loadData()
    }

    // Filter measurements for the last 30 days (1 month)
    val oneMonthMeasurements = remember(measurements) {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val cal = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, -30) }
        val thresholdDate = sdf.format(cal.time)
        val filtered = measurements.filter { it.date >= thresholdDate }
        if (filtered.isNotEmpty()) filtered else measurements.takeLast(10)
    }

    val latest = measurements.lastOrNull()
    val first = measurements.firstOrNull()
    val weightDelta = if (latest != null && first != null && measurements.size > 1) {
        latest.weight - first.weight
    } else 0.0

    if (isLoading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator()
        }
        return
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Pomiary & Postępy",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Wykres trendu, analiza BMI i zalecenia",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // Klawisz "Zalecenia" przeniesiony do menu Pomiary
                    OutlinedButton(
                        onClick = { showRecommendationsDialog = true },
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.Assignment, contentDescription = null, modifier = Modifier.size(15.dp), tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Zalecenia", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    FilledTonalIconButton(
                        onClick = { showAddDialog = true },
                        modifier = Modifier.size(36.dp)
                    ) {
                        Icon(Icons.Default.Add, contentDescription = "Dodaj pomiar")
                    }
                }
            }
        }

        // Weight & Waist Chart with BMI and Normal Level
        item {
            WeightAndWaistChartCard(
                measurements = measurements,
                patientHeight = patientHeight,
                onUpdateHeight = { updateHeight(it) },
                modifier = Modifier.fillMaxWidth()
            )
        }

        // Recent Measurements History
        item {
            Text(
                text = "Historia pomiarów",
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                modifier = Modifier.padding(top = 4.dp)
            )
        }

        if (measurements.isEmpty()) {
            item {
                Text(
                    text = "Brak zarejestrowanych pomiarów.",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                )
            }
        } else {
            items(measurements.reversed()) { m ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = m.date, fontWeight = FontWeight.Bold, fontSize = 13.sp)

                            Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text("Waga: ", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Text("${m.weight} kg", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
                                }
                                m.waistCm?.let { waist ->
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text("Talia: ", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        Text("${waist} cm", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color(0xFFF59E0B))
                                    }
                                }
                            }
                        }

                        // Item 17: Notes on a new line so it never wraps/squashes values
                        if (!m.notes.isNullOrBlank()) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "📝 ${m.notes}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.85f),
                                modifier = Modifier.padding(top = 2.dp)
                            )
                        }
                    }
                }
            }
        }
    }

    // Add Measurement Dialog
    if (showAddDialog) {
        val todayStr = remember { SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()) }
        var dateInput by remember { mutableStateOf(todayStr) }
        var weightInput by remember { mutableStateOf("") }
        var heightInput by remember(patientHeight) { mutableStateOf(patientHeight.toInt().toString()) }
        var waistInput by remember { mutableStateOf("") }
        var notesInput by remember { mutableStateOf("") }
        var isSaving by remember { mutableStateOf(false) }

        AlertDialog(
            onDismissRequest = { if (!isSaving) showAddDialog = false },
            title = { Text("Dodaj nowy pomiar") },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = dateInput,
                        onValueChange = { dateInput = it },
                        label = { Text("Data pomiaru (RRRR-MM-DD)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = weightInput,
                        onValueChange = { weightInput = it },
                        label = { Text("Waga [kg] (np. 82.5)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = heightInput,
                        onValueChange = { heightInput = it.filter { ch -> ch.isDigit() || ch == '.' } },
                        label = { Text("Wzrost [cm] (do obliczeń BMI)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = waistInput,
                        onValueChange = { waistInput = it },
                        label = { Text("Obwód talii [cm] (opcjonalnie)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = notesInput,
                        onValueChange = { notesInput = it },
                        label = { Text("Notatka (np. rano na czczo)") },
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val w = weightInput.replace(',', '.').toDoubleOrNull()
                        val h = heightInput.replace(',', '.').toDoubleOrNull()
                        val waist = waistInput.replace(',', '.').toDoubleOrNull()
                        if (w != null && w > 0) {
                            isSaving = true
                            scope.launch {
                                try {
                                    apiService.addMeasurement(
                                        MeasurementRequest(
                                            date = dateInput.ifBlank { null },
                                            weight = w,
                                            height = h,
                                            waistCm = waist,
                                            notes = notesInput.ifBlank { null }
                                        )
                                    )
                                    if (h != null && h > 0) {
                                        patientHeight = h
                                    }
                                    showAddDialog = false
                                    loadData()
                                } catch (_: Exception) {
                                } finally {
                                    isSaving = false
                                }
                            }
                        }
                    },
                    enabled = !isSaving && weightInput.isNotBlank()
                ) {
                    Text(if (isSaving) "Zapisywanie..." else "Zapisz")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = { showAddDialog = false },
                    enabled = !isSaving
                ) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Dialog Zaleceń Dietetyka i Historii Jadłospisów (Wymóg 5 i 10)
    if (showRecommendationsDialog) {
        AlertDialog(
            onDismissRequest = { showRecommendationsDialog = false },
            title = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                        Icon(Icons.Default.Assignment, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Zalecenia & Historia", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                    IconButton(onClick = { showRecommendationsDialog = false }) {
                        Icon(Icons.Default.Close, contentDescription = "Zamknij")
                    }
                }
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Sekcja 1: Bieżący Jadłospis
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.MenuBook, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("Bieżący Jadłospis", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.onPrimaryContainer)
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = currentDietTitle ?: "Zbilansowany jadłospis tygodniowy",
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 14.sp,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                            Text(
                                text = "Aktywny w Twoim kalendarzu posiłków",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f),
                                modifier = Modifier.padding(top = 2.dp)
                            )
                        }
                    }

                    // Sekcja 2: Oficjalne Zalecenia Dietetyka
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Wytyczne i Wskazówki", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                                recommendationsUpdatedAt?.let { d ->
                                    Text(
                                        text = d.take(10),
                                        fontSize = 10.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = if (!officialRecommendations.isNullOrBlank()) officialRecommendations!! else "Brak bieżących uwag od dietetyka. Stosuj się do wyznaczonych porcji.",
                                fontSize = 13.sp,
                                lineHeight = 18.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }

                    // Sekcja 3: Historia Przesłanych Jadłospisów i Zaleceń
                    Text("Historia przesłanych zaleceń i pakietów:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    if (recHistoryList.isEmpty()) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = "Brak wcześniejszej historii. Nowo przesłane jadłospisy pojawią się tutaj automatycznie.",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.padding(10.dp)
                            )
                        }
                    } else {
                        recHistoryList.forEach { rec ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = rec.dietitianName ?: "Dietetyk",
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 12.sp,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                        Text(
                                            text = rec.createdAt.take(16).replace("T", " "),
                                            fontSize = 10.sp,
                                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(text = rec.content, fontSize = 12.sp, lineHeight = 16.sp)
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                Button(onClick = { showRecommendationsDialog = false }) {
                    Text("Zamknij")
                }
            }
        )
    }
}

@Composable
fun MeasurementsLineChart(
    measurements: List<Measurement>,
    modifier: Modifier = Modifier
) {
    val primaryColor = MaterialTheme.colorScheme.primary
    val waistColor = Color(0xFFF59E0B)
    val gridColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.15f)

    Canvas(modifier = modifier) {
        val width = size.width
        val height = size.height
        val paddingLeft = 30f
        val paddingRight = 20f
        val paddingTop = 20f
        val paddingBottom = 30f

        val plotWidth = width - paddingLeft - paddingRight
        val plotHeight = height - paddingTop - paddingBottom

        val weights = measurements.map { it.weight }
        val minWeight = (weights.minOrNull() ?: 50.0) - 1.0
        val maxWeight = (weights.maxOrNull() ?: 100.0) + 1.0
        val weightRange = if (maxWeight > minWeight) maxWeight - minWeight else 1.0

        val waists = measurements.mapNotNull { it.waistCm }
        val minWaist = if (waists.isNotEmpty()) (waists.minOrNull() ?: 60.0) - 1.0 else 60.0
        val maxWaist = if (waists.isNotEmpty()) (waists.maxOrNull() ?: 100.0) + 1.0 else 100.0
        val waistRange = if (maxWaist > minWaist) maxWaist - minWaist else 1.0

        // Draw horizontal grid lines (3 lines)
        for (i in 0..2) {
            val y = paddingTop + plotHeight * (i / 2f)
            drawLine(
                color = gridColor,
                start = Offset(paddingLeft, y),
                end = Offset(width - paddingRight, y),
                strokeWidth = 1f
            )
        }

        // Compute points for weight
        val weightPoints = measurements.mapIndexed { index, m ->
            val x = paddingLeft + (index.toFloat() / (measurements.size - 1).coerceAtLeast(1)) * plotWidth
            val y = paddingTop + plotHeight * (1f - ((m.weight - minWeight) / weightRange).toFloat())
            Offset(x, y)
        }

        // Draw weight line
        val weightPath = Path().apply {
            weightPoints.forEachIndexed { i, pt ->
                if (i == 0) moveTo(pt.x, pt.y) else lineTo(pt.x, pt.y)
            }
        }
        drawPath(
            path = weightPath,
            color = primaryColor,
            style = Stroke(width = 4f, cap = StrokeCap.Round)
        )

        // Draw weight dots & labels
        weightPoints.forEach { pt ->
            drawCircle(color = primaryColor, radius = 5f, center = pt)
            drawCircle(color = Color.White, radius = 2.5f, center = pt)
        }

        // Compute points for waist (if available)
        val validWaists = measurements.filter { it.waistCm != null }
        if (validWaists.size >= 2) {
            val waistPoints = measurements.mapIndexedNotNull { index, m ->
                m.waistCm?.let { w ->
                    val x = paddingLeft + (index.toFloat() / (measurements.size - 1).coerceAtLeast(1)) * plotWidth
                    val y = paddingTop + plotHeight * (1f - ((w - minWaist) / waistRange).toFloat())
                    Offset(x, y)
                }
            }

            val waistPath = Path().apply {
                waistPoints.forEachIndexed { i, pt ->
                    if (i == 0) moveTo(pt.x, pt.y) else lineTo(pt.x, pt.y)
                }
            }
            drawPath(
                path = waistPath,
                color = waistColor,
                style = Stroke(width = 3f, cap = StrokeCap.Round)
            )

            waistPoints.forEach { pt ->
                drawCircle(color = waistColor, radius = 4f, center = pt)
            }
        }
    }
}
