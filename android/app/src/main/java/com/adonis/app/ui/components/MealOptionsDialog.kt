package com.adonis.app.ui.components

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.model.*
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import kotlinx.coroutines.launch

@Composable
fun MealOptionsDialog(
    meal: PlannedMeal,
    apiService: AdonisApiService,
    onDismiss: () -> Unit,
    onPlanUpdated: () -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var activeTab by remember { mutableStateOf(if (meal.isCustomSubstitution) 1 else 0) }

    // Tab 0: Portions scaler state
    var selectedPortions by remember { mutableStateOf(meal.portions) }
    var scaledResult by remember { mutableStateOf<ScaledRecipeResponse?>(null) }
    var isScalingLoading by remember { mutableStateOf(false) }

    LaunchedEffect(meal.recipe.id, selectedPortions) {
        if (activeTab == 0) {
            isScalingLoading = true
            try {
                scaledResult = apiService.scaleRecipe(meal.recipe.id, selectedPortions)
            } catch (_: Exception) {}
            finally {
                isScalingLoading = false
            }
        }
    }

    // Tab 1: Substitution state
    var subMealName by remember { mutableStateOf(meal.customName ?: "") }
    var subItems by remember { mutableStateOf<List<CustomMealItem>>(meal.customItems ?: emptyList()) }

    var eanCodeInput by remember { mutableStateOf("") }
    var isSearchingEan by remember { mutableStateOf(false) }
    var eanNotFound by remember { mutableStateOf(false) }

    var inputItemName by remember { mutableStateOf("") }
    var inputWeight by remember { mutableStateOf("100") }
    var inputKcal100g by remember { mutableStateOf("0") }
    var inputP100g by remember { mutableStateOf("0") }
    var inputF100g by remember { mutableStateOf("0") }
    var inputC100g by remember { mutableStateOf("0") }

    var isSavingSub by remember { mutableStateOf(false) }

    val barcodeScanner = remember {
        try {
            GmsBarcodeScanning.getClient(context)
        } catch (_: Exception) {
            null
        }
    }

    fun lookupBarcode(code: String) {
        if (code.isBlank()) return
        eanCodeInput = code
        scope.launch {
            isSearchingEan = true
            eanNotFound = false
            try {
                val prod = apiService.getProductByBarcode(code.trim())
                if (!prod.name.isNullOrBlank()) {
                    inputItemName = prod.name
                    inputKcal100g = prod.caloriesPer100g.toInt().toString()
                    inputP100g = prod.proteinPer100g.toString()
                    inputF100g = prod.fatPer100g.toString()
                    inputC100g = prod.carbsPer100g.toString()
                    eanNotFound = false
                } else {
                    eanNotFound = true
                }
            } catch (_: Exception) {
                eanNotFound = true
            } finally {
                isSearchingEan = false
            }
        }
    }

    fun handleAddItem() {
        if (inputItemName.isBlank()) {
            Toast.makeText(context, "Podaj nazwę produktu", Toast.LENGTH_SHORT).show()
            return
        }
        val weight = inputWeight.toDoubleOrNull() ?: 100.0
        val ratio = weight / 100.0
        val cal = Math.round((inputKcal100g.toDoubleOrNull() ?: 0.0) * ratio * 10.0) / 10.0
        val p = Math.round((inputP100g.toDoubleOrNull() ?: 0.0) * ratio * 10.0) / 10.0
        val f = Math.round((inputF100g.toDoubleOrNull() ?: 0.0) * ratio * 10.0) / 10.0
        val c = Math.round((inputC100g.toDoubleOrNull() ?: 0.0) * ratio * 10.0) / 10.0

        val item = CustomMealItem(
            name = inputItemName.trim(),
            barcode = eanCodeInput.trim().ifEmpty { null },
            weightG = weight,
            calories = cal,
            proteinG = p,
            fatG = f,
            carbsG = c
        )

        val updated = subItems + item
        subItems = updated

        if (subMealName.isBlank()) {
            subMealName = inputItemName.trim()
        } else if (updated.size == 2) {
            subMealName = "$subMealName + ${inputItemName.trim()}"
        }

        // Reset inputs
        inputItemName = ""
        eanCodeInput = ""
        inputWeight = "100"
        inputKcal100g = "0"
        inputP100g = "0"
        inputF100g = "0"
        inputC100g = "0"
        eanNotFound = false
    }

    val totalSubKcal = Math.round(subItems.sumOf { it.calories } * 10.0) / 10.0
    val totalSubP = Math.round(subItems.sumOf { it.proteinG } * 10.0) / 10.0
    val totalSubF = Math.round(subItems.sumOf { it.fatG } * 10.0) / 10.0
    val totalSubC = Math.round(subItems.sumOf { it.carbsG } * 10.0) / 10.0

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.95f)
                .fillMaxHeight(0.9f),
            shape = RoundedCornerShape(16.dp),
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 6.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "Opcje: ${meal.mealType}",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = meal.recipe.title,
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Zamknij")
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Tabs: [Porcje i przepis] | [Zamień posiłek]
                TabRow(selectedTabIndex = activeTab) {
                    Tab(
                        selected = activeTab == 0,
                        onClick = { activeTab = 0 },
                        text = { Text("Porcje i przepis", fontSize = 13.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = activeTab == 1,
                        onClick = { activeTab = 1 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Zamień posiłek", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                if (meal.isCustomSubstitution) {
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Surface(
                                        color = Color(0xFFF59E0B),
                                        shape = RoundedCornerShape(4.dp)
                                    ) {
                                        Text(
                                            "✓",
                                            color = Color.Black,
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 4.dp)
                                        )
                                    }
                                }
                            }
                        }
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Tab Content with vertical scroll
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                ) {
                    if (activeTab == 0) {
                        // TAB 0: PORTION SCALER
                        Text("Wybierz wielkość porcji:", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.padding(vertical = 8.dp)
                        ) {
                            listOf(0.5, 1.0, 1.5, 2.0).forEach { p ->
                                Button(
                                    onClick = { selectedPortions = p },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = if (selectedPortions == p) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant
                                    )
                                ) {
                                    Text("${p}x")
                                }
                            }
                        }

                        scaledResult?.let { res ->
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 8.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text(
                                        "Łącznie dla ${selectedPortions}x porcji:",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp
                                    )
                                    Text(
                                        "${res.totalCalories.toInt()} kcal  •  B: ${res.totalProteinG}g  •  T: ${res.totalFatG}g  •  W: ${res.totalCarbsG}g",
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.primary,
                                        fontSize = 14.sp
                                    )
                                }
                            }

                            Text(
                                "Składniki z dyskontów (Lidl/Biedronka):",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                            )
                            res.ingredients.forEach { ing ->
                                Text(
                                    "• ${ing.productName} (${ing.store}): ${ing.scaledAmount} ${ing.unit}",
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(vertical = 2.dp)
                                )
                            }
                        }

                        if (!meal.recipe.instructions.isNullOrBlank()) {
                            Spacer(modifier = Modifier.height(12.dp))
                            Text("Sposób przygotowania:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text(
                                meal.recipe.instructions,
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    } else {
                        // TAB 1: ZAMIEŃ POSIŁEK (MEAL SUBSTITUTION)
                        if (meal.isCustomSubstitution) {
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(bottom = 12.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(0x22F59E0B))
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text("Aktualnie zamieniony na:", fontSize = 11.sp, color = Color(0xFFFBBF24), fontWeight = FontWeight.Bold)
                                    Text(meal.customName ?: "Własny posiłek", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                    Text("${meal.customCalories?.toInt() ?: 0} kcal (B: ${meal.customProteinG}g, T: ${meal.customFatG}g, W: ${meal.customCarbsG}g)", fontSize = 12.sp)

                                    Spacer(modifier = Modifier.height(8.dp))
                                    OutlinedButton(
                                        onClick = {
                                            scope.launch {
                                                try {
                                                    apiService.revertMealSubstitute(meal.id)
                                                    Toast.makeText(context, "Przywrócono oryginalny posiłek", Toast.LENGTH_SHORT).show()
                                                    onPlanUpdated()
                                                    onDismiss()
                                                } catch (e: Exception) {
                                                    Toast.makeText(context, "Błąd: ${e.message}", Toast.LENGTH_SHORT).show()
                                                }
                                            }
                                        },
                                        colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.error)
                                    ) {
                                        Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Przywróć oryginalny posiłek", fontSize = 12.sp)
                                    }
                                }
                            }
                        }

                        Text("Nazwa Twojego posiłku / zamiennika:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        OutlinedTextField(
                            value = subMealName,
                            onValueChange = { subMealName = it },
                            placeholder = { Text("np. Bułka z serem i szynką") },
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        // BARCODE SCANNING / EAN SEARCH ROW
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text("Pobierz z bazy kodów kreskowych (EAN):", fontSize = 12.sp, fontWeight = FontWeight.Bold)

                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    OutlinedTextField(
                                        value = eanCodeInput,
                                        onValueChange = { eanCodeInput = it },
                                        placeholder = { Text("Kod EAN...") },
                                        modifier = Modifier.weight(1f),
                                        singleLine = true
                                    )

                                    Button(
                                        onClick = { lookupBarcode(eanCodeInput) },
                                        enabled = !isSearchingEan && eanCodeInput.isNotBlank()
                                    ) {
                                        Text(if (isSearchingEan) "..." else "Szukaj")
                                    }

                                    // Skaner aparatem (Google Play Services Code Scanner)
                                    IconButton(
                                        onClick = {
                                            barcodeScanner?.startScan()
                                                ?.addOnSuccessListener { barcode ->
                                                    barcode.rawValue?.let { lookupBarcode(it) }
                                                }
                                                ?.addOnFailureListener {
                                                    Toast.makeText(context, "Błąd skanera: ${it.message}", Toast.LENGTH_SHORT).show()
                                                }
                                        },
                                        modifier = Modifier.background(MaterialTheme.colorScheme.primary, RoundedCornerShape(8.dp))
                                    ) {
                                        Icon(Icons.Default.PhotoCamera, contentDescription = "Skanuj aparatem", tint = MaterialTheme.colorScheme.onPrimary)
                                    }
                                }

                                if (eanNotFound) {
                                    Text("⚠️ Nie znaleziono kodu w Open Food Facts. Wpisz dane ręcznie:", color = Color(0xFFFBBF24), fontSize = 11.sp)
                                }

                                // Item form fields
                                OutlinedTextField(
                                    value = inputItemName,
                                    onValueChange = { inputItemName = it },
                                    label = { Text("Nazwa produktu") },
                                    modifier = Modifier.fillMaxWidth()
                                )

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    OutlinedTextField(
                                        value = inputWeight,
                                        onValueChange = { inputWeight = it },
                                        label = { Text("Waga (g)") },
                                        modifier = Modifier.weight(1f)
                                    )
                                    OutlinedTextField(
                                        value = inputKcal100g,
                                        onValueChange = { inputKcal100g = it },
                                        label = { Text("Kcal/100g") },
                                        modifier = Modifier.weight(1f)
                                    )
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    OutlinedTextField(
                                        value = inputP100g,
                                        onValueChange = { inputP100g = it },
                                        label = { Text("Białko") },
                                        modifier = Modifier.weight(1f)
                                    )
                                    OutlinedTextField(
                                        value = inputF100g,
                                        onValueChange = { inputF100g = it },
                                        label = { Text("Tłuszcz") },
                                        modifier = Modifier.weight(1f)
                                    )
                                    OutlinedTextField(
                                        value = inputC100g,
                                        onValueChange = { inputC100g = it },
                                        label = { Text("Węgle") },
                                        modifier = Modifier.weight(1f)
                                    )
                                }

                                Spacer(modifier = Modifier.height(8.dp))
                                Button(
                                    onClick = { handleAddItem() },
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Dodaj ten produkt do posiłku")
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Składniki w Twoim posiłku (${subItems.size}):", fontWeight = FontWeight.Bold, fontSize = 13.sp)

                        if (subItems.isEmpty()) {
                            Text("Brak dodanych produktów. Dodaj przynajmniej jeden powyżej.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        } else {
                            subItems.forEachIndexed { index, it ->
                                Card(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 3.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f))
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(8.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(it.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            Text("${it.weightG.toInt()}g  •  ${it.calories.toInt()} kcal (B:${it.proteinG}g, T:${it.fatG}g, W:${it.carbsG}g)", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        }
                                        IconButton(onClick = { subItems = subItems.filterIndexed { i, _ -> i != index } }) {
                                            Icon(Icons.Default.Delete, contentDescription = "Usuń", tint = MaterialTheme.colorScheme.error)
                                        }
                                    }
                                }
                            }
                        }

                        // Total Macros Box
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 10.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text("Łącznie zjedzone:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Text(
                                    "$totalSubKcal kcal  •  B: ${totalSubP}g  •  T: ${totalSubF}g  •  W: ${totalSubC}g",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                            }
                        }

                        // Save Substitution Button
                        Button(
                            onClick = {
                                if (subItems.isEmpty()) {
                                    Toast.makeText(context, "Dodaj przynajmniej jeden produkt", Toast.LENGTH_SHORT).show()
                                    return@Button
                                }
                                val finalName = subMealName.ifBlank { subItems.joinToString(" + ") { it.name } }
                                scope.launch {
                                    isSavingSub = true
                                    try {
                                        apiService.substituteMeal(
                                            meal.id,
                                            MealSubstituteRequest(
                                                customName = finalName,
                                                items = subItems,
                                                totalCalories = totalSubKcal,
                                                totalProteinG = totalSubP,
                                                totalFatG = totalSubF,
                                                totalCarbsG = totalSubC
                                            )
                                        )
                                        Toast.makeText(context, "Posiłek został zamieniony!", Toast.LENGTH_SHORT).show()
                                        onPlanUpdated()
                                        onDismiss()
                                    } catch (e: Exception) {
                                        Toast.makeText(context, "Błąd: ${e.message}", Toast.LENGTH_SHORT).show()
                                    } finally {
                                        isSavingSub = false
                                    }
                                }
                            },
                            enabled = !isSavingSub && subItems.isNotEmpty(),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(if (isSavingSub) "Zapisywanie..." else "Zapisz zamianę posiłku")
                        }
                    }
                }
            }
        }
    }
}
