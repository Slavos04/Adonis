package com.adonis.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Height
import androidx.compose.material.icons.filled.MonitorWeight
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingFlat
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.model.Measurement
import java.util.Locale

@Composable
fun WeightAndWaistChartCard(
    measurements: List<Measurement>,
    patientHeight: Double = 175.0,
    onUpdateHeight: ((Double) -> Unit)? = null,
    title: String = "Wykres trendu wagi i talii",
    subtitle: String = "Wizualizacja postępów i normy BMI",
    modifier: Modifier = Modifier
) {
    var showHeightDialog by remember { mutableStateOf(false) }
    var heightInput by remember(patientHeight) {
        mutableStateOf(if (patientHeight > 0) patientHeight.toInt().toString() else "175")
    }

    if (measurements.isEmpty()) {
        Card(
            modifier = modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Brak zarejestrowanych pomiarów.",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.outline
                )
            }
        }
        return
    }

    val sorted = remember(measurements) { measurements.sortedBy { it.date } }
    val latest = sorted.last()
    val first = sorted.first()
    val weightDelta = (latest.weight - first.weight)

    val validHeight = if (patientHeight > 0) patientHeight else 175.0
    val hM = validHeight / 100.0
    val currentBmi = latest.weight / (hM * hM)
    val minNormalWeight = 18.5 * (hM * hM)
    val maxNormalWeight = 24.9 * (hM * hM)

    val (bmiStatus, bmiColor) = when {
        currentBmi < 18.5 -> "Niedowaga" to Color(0xFF38BDF8)
        currentBmi <= 24.9 -> "Norma" to Color(0xFF10B981)
        currentBmi <= 29.9 -> "Nadwaga" to Color(0xFFF59E0B)
        else -> "Otyłość" to Color(0xFFEF4444)
    }

    var chartMode by remember { mutableStateOf("both") } // "both", "weight", "waist", "bmi"

    val primaryColor = MaterialTheme.colorScheme.primary
    val waistColor = Color(0xFFF59E0B)
    val bmiPlotColor = Color(0xFF8B5CF6)

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.45f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Nagłówek
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Text(
                    text = subtitle,
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                // Wskaźnik zmiany wagi w osobnym wierszu poniżej tytułu (wyświetlany poziomo)
                if (sorted.size > 1) {
                    Spacer(modifier = Modifier.height(6.dp))
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (weightDelta <= 0) Color(0xFF10B981).copy(alpha = 0.15f) else MaterialTheme.colorScheme.error.copy(alpha = 0.15f),
                        modifier = Modifier.wrapContentWidth()
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                        ) {
                            Icon(
                                imageVector = if (weightDelta < 0) Icons.Default.TrendingDown else if (weightDelta > 0) Icons.Default.TrendingUp else Icons.Default.TrendingFlat,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp),
                                tint = if (weightDelta <= 0) Color(0xFF10B981) else MaterialTheme.colorScheme.error
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Trend: ${if (weightDelta > 0) "+" else ""}${String.format(Locale.US, "%.1f", weightDelta)} kg",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (weightDelta <= 0) Color(0xFF10B981) else MaterialTheme.colorScheme.error,
                                maxLines = 1
                            )
                        }
                    }
                }
            }

            // Przełącznik serii wykresu - bezpośrednio pod tytułem
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp)
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                FilterChip(
                    selected = chartMode == "both",
                    onClick = { chartMode = "both" },
                    label = { Text("Oba wykresy", fontSize = 11.sp) }
                )
                FilterChip(
                    selected = chartMode == "weight",
                    onClick = { chartMode = "weight" },
                    label = { Text("Waga (kg)", fontSize = 11.sp) }
                )
                FilterChip(
                    selected = chartMode == "bmi",
                    onClick = { chartMode = "bmi" },
                    label = { Text("Wskaźnik BMI", fontSize = 11.sp) }
                )
                FilterChip(
                    selected = chartMode == "waist",
                    onClick = { chartMode = "waist" },
                    label = { Text("Talia (cm)", fontSize = 11.sp) }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Rysowanie wykresu na Canvas - widoczne od razu pod tytułem!
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(12.dp))
                    .padding(8.dp)
            ) {
                MeasurementsCanvasPlot(
                    measurements = sorted,
                    mode = chartMode,
                    patientHeight = validHeight,
                    primaryColor = primaryColor,
                    waistColor = waistColor,
                    bmiColor = bmiPlotColor
                )
            }

            // Oś dat (najstarsza i najnowsza)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 4.dp, bottom = 12.dp, start = 8.dp, end = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = first.date,
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.outline
                )
                Text(
                    text = "${sorted.size} pomiarów",
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.outline
                )
                Text(
                    text = latest.date,
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.outline
                )
            }

            // Wiersz 1: Waga i Talia
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Surface(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(8.dp).background(primaryColor, CircleShape))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Waga aktualna", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                        }
                        Text(
                            text = "${latest.weight} kg",
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }

                Surface(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(8.dp).background(waistColor, CircleShape))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Talia", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                        }
                        Text(
                            text = if (latest.waistCm != null) "${latest.waistCm} cm" else "Brak danych",
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Wiersz 2: BMI Aktualne i Wzrost pacjenta
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Karta BMI aktualne
                Surface(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(8.dp).background(bmiColor, CircleShape))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("BMI aktualne", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                        }
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(top = 2.dp)
                        ) {
                            Text(
                                text = String.format(Locale.US, "%.1f", currentBmi),
                                fontWeight = FontWeight.Bold,
                                fontSize = 17.sp,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = bmiColor.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    text = bmiStatus,
                                    color = bmiColor,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                }

                // Karta Wzrost pacjenta
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .then(
                            if (onUpdateHeight != null) Modifier.clickable { showHeightDialog = true }
                            else Modifier
                        ),
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.surface
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.Height,
                                    contentDescription = null,
                                    modifier = Modifier.size(12.dp),
                                    tint = MaterialTheme.colorScheme.outline
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Wzrost", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                            }
                            if (onUpdateHeight != null) {
                                Icon(
                                    Icons.Default.Edit,
                                    contentDescription = "Zmień wzrost",
                                    modifier = Modifier.size(13.dp),
                                    tint = MaterialTheme.colorScheme.primary
                                )
                            }
                        }
                        Text(
                            text = "${validHeight.toInt()} cm",
                            fontWeight = FontWeight.Bold,
                            fontSize = 17.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Belka informacyjna: Prawidłowy poziom BMI (wartość w nowym wierszu - Item 16)
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = Color(0xFF10B981).copy(alpha = 0.10f),
                border = BorderStroke(1.dp, Color(0xFF10B981).copy(alpha = 0.30f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = Color(0xFF10B981),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "Poziom prawidłowy BMI:",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = "18.5 – 24.9 (Norma WHO)",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF10B981)
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Waga prawidłowa dla ${validHeight.toInt()} cm: ${String.format(Locale.US, "%.1f", minNormalWeight)} – ${String.format(Locale.US, "%.1f", maxNormalWeight)} kg",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.8f)
                        )
                    }
                }
            }
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 6.dp, start = 8.dp, end = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = first.date,
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.outline
                )
                Text(
                    text = "${sorted.size} pomiarów",
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.outline
                )
                Text(
                    text = latest.date,
                    fontSize = 10.sp,
                    color = MaterialTheme.colorScheme.outline
                )
            }
        }
    }

    // Modal edycji wzrostu pacjenta
    if (showHeightDialog && onUpdateHeight != null) {
        AlertDialog(
            onDismissRequest = { showHeightDialog = false },
            title = { Text("Zmień wzrost pacjenta") },
            text = {
                Column {
                    Text(
                        text = "Wzrost jest niezbędny do precyzyjnego wyliczania aktualnego BMI oraz prawidłowego przedziału wagi.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = heightInput,
                        onValueChange = { heightInput = it.filter { ch -> ch.isDigit() || ch == '.' } },
                        label = { Text("Wzrost (cm)") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val parsed = heightInput.toDoubleOrNull()
                        if (parsed != null && parsed in 100.0..250.0) {
                            onUpdateHeight(parsed)
                            showHeightDialog = false
                        }
                    }
                ) {
                    Text("Zapisz")
                }
            },
            dismissButton = {
                TextButton(onClick = { showHeightDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }
}

@Composable
fun MeasurementsCanvasPlot(
    measurements: List<Measurement>,
    mode: String,
    patientHeight: Double,
    primaryColor: Color,
    waistColor: Color,
    bmiColor: Color,
    modifier: Modifier = Modifier.fillMaxSize()
) {
    val gridColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.10f)
    val normalGreen = Color(0xFF10B981)

    val hM = (if (patientHeight > 0) patientHeight else 175.0) / 100.0
    val minNormW = 18.5 * (hM * hM)
    val maxNormW = 24.9 * (hM * hM)

    Canvas(modifier = modifier) {
        val width = size.width
        val height = size.height

        val paddingLeft = 32f
        val paddingRight = 30f
        val paddingTop = 24f
        val paddingBottom = 24f

        val plotW = width - paddingLeft - paddingRight
        val plotH = height - paddingTop - paddingBottom

        // Linie siatki poziomej (3 linie)
        for (i in 0..2) {
            val y = paddingTop + plotH * (i / 2f)
            drawLine(
                color = gridColor,
                start = Offset(paddingLeft, y),
                end = Offset(width - paddingRight, y),
                strokeWidth = 1.5f
            )
        }

        // Gdy jest tylko 1 pomiar
        if (measurements.size == 1) {
            val m = measurements[0]
            val midX = paddingLeft + plotW / 2f
            val midY = paddingTop + plotH / 2f

            if (mode == "both" || mode == "weight") {
                drawCircle(color = primaryColor, radius = 8f, center = Offset(midX, midY - 15f))
                drawCircle(color = Color.White, radius = 4f, center = Offset(midX, midY - 15f))
            }
            if (mode == "bmi") {
                drawCircle(color = bmiColor, radius = 8f, center = Offset(midX, midY))
                drawCircle(color = Color.White, radius = 4f, center = Offset(midX, midY))
            }
            if ((mode == "both" || mode == "waist") && m.waistCm != null) {
                drawCircle(color = waistColor, radius = 8f, center = Offset(midX, midY + 15f))
                drawCircle(color = Color.White, radius = 4f, center = Offset(midX, midY + 15f))
            }
            return@Canvas
        }

        // =========================================================================
        // TRYB BMI: Rysowanie wykresu BMI z zielonym pasem prawidłowego BMI 18.5-24.9
        // =========================================================================
        if (mode == "bmi") {
            val bmis = measurements.map { it.weight / (hM * hM) }
            val minBmiData = bmis.minOrNull() ?: 20.0
            val maxBmiData = bmis.maxOrNull() ?: 25.0

            // Rozszerzamy zakres Y tak, aby norma 18.5 - 24.9 oraz dane były widoczne
            val minBmiAxis = (minOf(minBmiData, 17.5) - 1.0).coerceAtLeast(12.0)
            val maxBmiAxis = (maxOf(maxBmiData, 26.0) + 1.0)
            val rangeBmi = (maxBmiAxis - minBmiAxis).coerceAtLeast(1.0)

            // Obliczamy współrzędne Y dla normy BMI 18.5 i 24.9
            val yNorm18 = paddingTop + plotH * (1f - ((18.5 - minBmiAxis) / rangeBmi).toFloat())
            val yNorm25 = paddingTop + plotH * (1f - ((24.9 - minBmiAxis) / rangeBmi).toFloat())

            val normTop = yNorm25.coerceIn(paddingTop, paddingTop + plotH)
            val normBottom = yNorm18.coerceIn(paddingTop, paddingTop + plotH)

            // Rysujemy zielony pas normy BMI 18.5 - 24.9
            if (normBottom > normTop) {
                drawRect(
                    color = normalGreen.copy(alpha = 0.14f),
                    topLeft = Offset(paddingLeft, normTop),
                    size = Size(plotW, normBottom - normTop)
                )
            }

            // Linie normy BMI (dolna i górna)
            drawLine(
                color = normalGreen.copy(alpha = 0.7f),
                start = Offset(paddingLeft, yNorm18),
                end = Offset(width - paddingRight, yNorm18),
                strokeWidth = 2f
            )
            drawLine(
                color = normalGreen.copy(alpha = 0.7f),
                start = Offset(paddingLeft, yNorm25),
                end = Offset(width - paddingRight, yNorm25),
                strokeWidth = 2f
            )

            // Punkty BMI
            val bmiPoints = measurements.mapIndexed { idx, m ->
                val bmiVal = m.weight / (hM * hM)
                val x = paddingLeft + (idx.toFloat() / (measurements.size - 1)) * plotW
                val y = paddingTop + plotH * (1f - ((bmiVal - minBmiAxis) / rangeBmi).toFloat())
                Offset(x, y)
            }

            // Gradient pod wykresem BMI
            val fillPath = Path().apply {
                moveTo(bmiPoints.first().x, paddingTop + plotH)
                bmiPoints.forEach { pt -> lineTo(pt.x, pt.y) }
                lineTo(bmiPoints.last().x, paddingTop + plotH)
                close()
            }
            drawPath(
                path = fillPath,
                brush = Brush.verticalGradient(
                    colors = listOf(bmiColor.copy(alpha = 0.25f), bmiColor.copy(alpha = 0.0f)),
                    startY = paddingTop,
                    endY = paddingTop + plotH
                )
            )

            // Linia BMI
            val bmiPath = Path().apply {
                bmiPoints.forEachIndexed { i, pt ->
                    if (i == 0) moveTo(pt.x, pt.y) else lineTo(pt.x, pt.y)
                }
            }
            drawPath(
                path = bmiPath,
                color = bmiColor,
                style = Stroke(width = 4.5f, cap = StrokeCap.Round, join = StrokeJoin.Round)
            )

            // Punkty BMI
            bmiPoints.forEach { pt ->
                drawCircle(color = bmiColor, radius = 6f, center = pt)
                drawCircle(color = Color.White, radius = 3f, center = pt)
            }
            return@Canvas
        }

        // =========================================================================
        // TRYBY WAGA / TALIA / OBA:
        // =========================================================================
        val showWeight = mode == "both" || mode == "weight"
        val showWaist = mode == "both" || mode == "waist"

        // 1. Seria Waga + Strefa Prawidłowej Wagi odpowiadająca BMI 18.5 - 24.9
        if (showWeight) {
            val weights = measurements.map { it.weight }
            // Oś Y obejmuje wagi pacjenta oraz zakres normy BMI
            val minDataW = weights.minOrNull() ?: 60.0
            val maxDataW = weights.maxOrNull() ?: 80.0

            val minW = (minOf(minDataW, minNormW) - 1.5).coerceAtLeast(20.0)
            val maxW = (maxOf(maxDataW, maxNormW) + 1.5)
            val rangeW = (maxW - minW).coerceAtLeast(0.5)

            // Strefa normy BMI w przeliczeniu na wagę:
            val yNormMinW = paddingTop + plotH * (1f - ((minNormW - minW) / rangeW).toFloat())
            val yNormMaxW = paddingTop + plotH * (1f - ((maxNormW - minW) / rangeW).toFloat())

            val normTop = yNormMaxW.coerceIn(paddingTop, paddingTop + plotH)
            val normBottom = yNormMinW.coerceIn(paddingTop, paddingTop + plotH)

            // Rysujemy zielony pas normy BMI (waga prawidłowa)
            if (normBottom > normTop) {
                drawRect(
                    color = normalGreen.copy(alpha = 0.12f),
                    topLeft = Offset(paddingLeft, normTop),
                    size = Size(plotW, normBottom - normTop)
                )
            }

            // Granice normy wagi
            drawLine(
                color = normalGreen.copy(alpha = 0.5f),
                start = Offset(paddingLeft, yNormMinW),
                end = Offset(width - paddingRight, yNormMinW),
                strokeWidth = 1.5f
            )
            drawLine(
                color = normalGreen.copy(alpha = 0.5f),
                start = Offset(paddingLeft, yNormMaxW),
                end = Offset(width - paddingRight, yNormMaxW),
                strokeWidth = 1.5f
            )

            val weightPoints = measurements.mapIndexed { idx, m ->
                val x = paddingLeft + (idx.toFloat() / (measurements.size - 1)) * plotW
                val y = paddingTop + plotH * (1f - ((m.weight - minW) / rangeW).toFloat())
                Offset(x, y)
            }

            // Gradientowe wypełnienie pod wykresem wagi
            val fillPath = Path().apply {
                moveTo(weightPoints.first().x, paddingTop + plotH)
                weightPoints.forEach { pt -> lineTo(pt.x, pt.y) }
                lineTo(weightPoints.last().x, paddingTop + plotH)
                close()
            }
            drawPath(
                path = fillPath,
                brush = Brush.verticalGradient(
                    colors = listOf(primaryColor.copy(alpha = 0.25f), primaryColor.copy(alpha = 0.0f)),
                    startY = paddingTop,
                    endY = paddingTop + plotH
                )
            )

            // Linia wagi
            val weightPath = Path().apply {
                weightPoints.forEachIndexed { i, pt ->
                    if (i == 0) moveTo(pt.x, pt.y) else lineTo(pt.x, pt.y)
                }
            }
            drawPath(
                path = weightPath,
                color = primaryColor,
                style = Stroke(width = 4.5f, cap = StrokeCap.Round, join = StrokeJoin.Round)
            )

            // Punkty wagi
            weightPoints.forEach { pt ->
                drawCircle(color = primaryColor, radius = 6f, center = pt)
                drawCircle(color = Color.White, radius = 3f, center = pt)
            }
        }

        // 2. Seria Talia
        if (showWaist) {
            val validWaists = measurements.filter { it.waistCm != null }
            if (validWaists.size >= 2) {
                val waists = validWaists.mapNotNull { it.waistCm }
                val minWaist = (waists.minOrNull() ?: 60.0) - 1.0
                val maxWaist = (waists.maxOrNull() ?: 100.0) + 1.0
                val rangeWaist = (maxWaist - minWaist).coerceAtLeast(0.5)

                val waistPoints = measurements.mapIndexedNotNull { idx, m ->
                    m.waistCm?.let { w ->
                        val x = paddingLeft + (idx.toFloat() / (measurements.size - 1)) * plotW
                        val y = paddingTop + plotH * (1f - ((w - minWaist) / rangeWaist).toFloat())
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
                    style = Stroke(width = 3.5f, cap = StrokeCap.Round, join = StrokeJoin.Round)
                )

                waistPoints.forEach { pt ->
                    drawCircle(color = waistColor, radius = 5f, center = pt)
                    drawCircle(color = Color.White, radius = 2.5f, center = pt)
                }
            }
        }
    }
}
