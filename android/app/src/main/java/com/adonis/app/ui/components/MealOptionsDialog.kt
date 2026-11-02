package com.adonis.app.ui.components

import android.widget.Toast
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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

    // Wyszukiwanie składników po nazwie
    var nameSearchInput by remember { mutableStateOf("") }
    var isSearchingName by remember { mutableStateOf(false) }
    var nameSearchResults by remember { mutableStateOf<List<Product>>(emptyList()) }
    var selectedQuickCat by remember { mutableStateOf(0) } // 0: Owoce, 1: Warzywa, 2: Pieczywo

    fun searchProductsByName(q: String) {
        if (q.trim().length < 2) return
        scope.launch {
            isSearchingName = true
            nameSearchResults = emptyList()
            try {
                nameSearchResults = apiService.getProducts(search = q.trim(), limit = 15)
            } catch (e: Exception) {
                Toast.makeText(context, "Błąd wyszukiwania: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                isSearchingName = false
            }
        }
    }

    fun selectProduct(prod: Product) {
        inputItemName = prod.name
        inputKcal100g = prod.caloriesPer100g.toInt().toString()
        inputP100g = prod.proteinPer100g.toString()
        inputF100g = prod.fatPer100g.toString()
        inputC100g = prod.carbsPer100g.toString()
        if (!prod.barcode.isNullOrBlank()) {
            eanCodeInput = prod.barcode
        }
        nameSearchResults = emptyList()
        nameSearchInput = ""
    }

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
                .wrapContentHeight()
                .heightIn(max = 640.dp),
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
                                "Składniki:",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                modifier = Modifier.padding(top = 8.dp, bottom = 4.dp)
                            )
                            res.ingredients.forEach { ing ->
                                val kMeasure = com.adonis.app.util.KitchenMeasureHelper.getMeasureText(ing.productName, ing.scaledAmount, ing.kitchenMeasure)
                                val measureInfo = if (kMeasure.isNotBlank()) " ($kMeasure)" else ""
                                Text(
                                    "• ${ing.productName}${if (isDiscountStore(ing.store)) " (${ing.store})" else ""}: ${if (ing.scaledAmount % 1.0 == 0.0) ing.scaledAmount.toInt().toString() else ing.scaledAmount.toString()} ${ing.unit}$measureInfo",
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

                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = {
                                scope.launch {
                                    try {
                                        apiService.updateMealPortions(meal.id, UpdateMealPortionsRequest(selectedPortions))
                                        Toast.makeText(context, "Zapisano wielkość porcji: ${selectedPortions}x", Toast.LENGTH_SHORT).show()
                                        onPlanUpdated()
                                        onDismiss()
                                    } catch (e: Exception) {
                                        Toast.makeText(context, "Błąd zapisu porcji: ${e.message}", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Zastosuj porcję ${selectedPortions}x do dnia", fontWeight = FontWeight.Bold)
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
                                // Wyszukiwanie po nazwie
                                Text("Wyszukaj składnik po nazwie w bazie:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Row(
                                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    OutlinedTextField(
                                        value = nameSearchInput,
                                        onValueChange = { nameSearchInput = it },
                                        placeholder = { Text("np. pomidor, chleb, szynka...") },
                                        modifier = Modifier.weight(1f),
                                        singleLine = true,
                                        trailingIcon = {
                                            if (nameSearchInput.isNotBlank()) {
                                                IconButton(onClick = { nameSearchInput = ""; nameSearchResults = emptyList() }) {
                                                    Icon(Icons.Default.Clear, contentDescription = "Wyczyść")
                                                }
                                            }
                                        }
                                    )
                                    Button(
                                        onClick = { searchProductsByName(nameSearchInput) },
                                        enabled = !isSearchingName && nameSearchInput.trim().length >= 2,
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                    ) {
                                        if (isSearchingName) {
                                            CircularProgressIndicator(modifier = Modifier.size(16.dp), strokeWidth = 2.dp)
                                        } else {
                                            Icon(Icons.Default.Search, contentDescription = "Szukaj")
                                        }
                                    }
                                }

                                if (nameSearchResults.isNotEmpty()) {
                                    Surface(
                                        color = MaterialTheme.colorScheme.surface,
                                        shape = RoundedCornerShape(8.dp),
                                        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary),
                                        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
                                    ) {
                                        Column(modifier = Modifier.padding(6.dp)) {
                                            Row(
                                                modifier = Modifier.fillMaxWidth().padding(bottom = 4.dp),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Text("Znaleziono (${nameSearchResults.size}) - dotknij, aby wybrać:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                                                Text(
                                                    "✕ Zamknij",
                                                    fontSize = 11.sp,
                                                    color = MaterialTheme.colorScheme.error,
                                                    modifier = Modifier.clickable { nameSearchResults = emptyList() }
                                                )
                                            }
                                            nameSearchResults.take(8).forEach { prod ->
                                                Row(
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .clickable { selectProduct(prod) }
                                                        .padding(vertical = 4.dp, horizontal = 6.dp),
                                                    horizontalArrangement = Arrangement.SpaceBetween,
                                                    verticalAlignment = Alignment.CenterVertically
                                                ) {
                                                    Column(modifier = Modifier.weight(1f)) {
                                                        Text(prod.name, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                                        val storeText = if (prod.store.isNotBlank()) "[${prod.store}] " else ""
                                                        Text(storeText + prod.brand, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                                    }
                                                    Text("${prod.caloriesPer100g.toInt()} kcal", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                                                }
                                                HorizontalDivider(modifier = Modifier.padding(vertical = 2.dp), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
                                            }
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                // Szybki wybór popularnych: Owoce, Warzywa, Pieczywo
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text("Szybki wybór:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    listOf("🍎 Owoce", "🥕 Warzywa", "🍞 Pieczywo").forEachIndexed { idx, label ->
                                        Surface(
                                            color = if (selectedQuickCat == idx) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                                            shape = RoundedCornerShape(6.dp),
                                            modifier = Modifier.clickable { selectedQuickCat = idx }
                                        ) {
                                            Text(
                                                text = label,
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = if (selectedQuickCat == idx) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                            )
                                        }
                                    }
                                }

                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .horizontalScroll(rememberScrollState())
                                        .padding(vertical = 4.dp),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    val quickItems = when (selectedQuickCat) {
                                        0 -> listOf(
                                            Triple("Jabłko", 150, 52),
                                            Triple("Banan", 120, 89),
                                            Triple("Pomarańcza", 180, 47),
                                            Triple("Mandarynka", 70, 53),
                                            Triple("Gruszka", 150, 57),
                                            Triple("Truskawki", 100, 32),
                                            Triple("Borówki", 100, 57),
                                            Triple("Kiwi", 80, 61)
                                        )
                                        1 -> listOf(
                                            Triple("Pomidor", 120, 18),
                                            Triple("Ogórek", 100, 14),
                                            Triple("Papryka", 100, 31),
                                            Triple("Marchew", 80, 41),
                                            Triple("Sałata", 50, 14),
                                            Triple("Szpinak", 50, 23),
                                            Triple("Cukinia", 150, 17),
                                            Triple("Pieczarki", 100, 22)
                                        )
                                        else -> listOf(
                                            Triple("Chleb żytni", 70, 225),
                                            Triple("Grahamka", 70, 255),
                                            Triple("Kajzerka", 60, 295),
                                            Triple("Pszenny", 70, 245),
                                            Triple("Tostowy", 50, 250),
                                            Triple("Wafle ryżowe", 30, 380),
                                            Triple("Tortilla", 60, 310)
                                        )
                                    }
                                    quickItems.forEach { (name, defWeight, kcal) ->
                                        Surface(
                                            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                                            shape = RoundedCornerShape(8.dp),
                                            modifier = Modifier.clickable {
                                                inputItemName = name
                                                inputWeight = defWeight.toString()
                                                inputKcal100g = kcal.toString()
                                                when (selectedQuickCat) {
                                                    0 -> {
                                                        inputP100g = if (name in listOf("Banan", "Kiwi")) "1.1" else "0.5"
                                                        inputF100g = "0.2"
                                                        inputC100g = when (name) {
                                                            "Banan" -> "22.8"
                                                            "Jabłko" -> "13.8"
                                                            "Gruszka" -> "15.2"
                                                            else -> "10.0"
                                                        }
                                                    }
                                                    1 -> {
                                                        inputP100g = if (name in listOf("Szpinak", "Pieczarki")) "3.0" else "1.0"
                                                        inputF100g = "0.2"
                                                        inputC100g = if (name == "Marchew") "9.6" else "3.5"
                                                    }
                                                    else -> {
                                                        inputP100g = "8.5"
                                                        inputF100g = "2.5"
                                                        inputC100g = if (name.contains("Wafle")) "81.0" else "48.0"
                                                    }
                                                }
                                            }
                                        ) {
                                            Text(
                                                text = name,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = MaterialTheme.colorScheme.primary,
                                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                            )
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(6.dp))
                                Text("Pobierz z bazy kodów kreskowych (EAN):", fontSize = 12.sp, fontWeight = FontWeight.Bold)

                                // Pełna szerokość pola EAN z ikoną aparatu
                                OutlinedTextField(
                                    value = eanCodeInput,
                                    onValueChange = { eanCodeInput = it },
                                    label = { Text("Wpisz kod kreskowy (EAN)") },
                                    placeholder = { Text("Wpisz cyfry kodu lub użyj aparatu...") },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp),
                                    singleLine = true,
                                    trailingIcon = {
                                        IconButton(
                                            onClick = {
                                                barcodeScanner?.startScan()
                                                    ?.addOnSuccessListener { barcode ->
                                                        barcode.rawValue?.let { lookupBarcode(it) }
                                                    }
                                                    ?.addOnFailureListener {
                                                        Toast.makeText(context, "Błąd skanera: ${it.message}", Toast.LENGTH_SHORT).show()
                                                    }
                                            }
                                        ) {
                                            Icon(
                                                Icons.Default.PhotoCamera,
                                                contentDescription = "Skanuj aparatem",
                                                tint = MaterialTheme.colorScheme.primary
                                            )
                                        }
                                    }
                                )

                                // Klawisz szukaj przeniesiony poniżej okna wpisywania EAN
                                Button(
                                    onClick = { lookupBarcode(eanCodeInput) },
                                    enabled = !isSearchingEan && eanCodeInput.isNotBlank(),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(bottom = 6.dp)
                                ) {
                                    if (isSearchingEan) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.size(16.dp),
                                            strokeWidth = 2.dp,
                                            color = MaterialTheme.colorScheme.onPrimary
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text("Wyszukiwanie w bazie...")
                                    } else {
                                        Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text("Szukaj w bazie kodów EAN")
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
