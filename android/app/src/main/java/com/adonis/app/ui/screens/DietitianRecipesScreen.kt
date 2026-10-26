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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DietitianRecipesScreen(
    apiService: AdonisApiService
) {
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var successMessage by remember { mutableStateOf<String?>(null) }

    var recipes by remember { mutableStateOf<List<Recipe>>(emptyList()) }
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Wszystkie") }

    var selectedRecipeDetail by remember { mutableStateOf<Recipe?>(null) }
    var isLoadingDetail by remember { mutableStateOf(false) }

    // Dialogi dodawania
    var showAddRecipeDialog by remember { mutableStateOf(false) }
    var showAddProductDialog by remember { mutableStateOf(false) }

    // Dostępne produkty do składników
    var availableProducts by remember { mutableStateOf<List<Product>>(emptyList()) }

    val categories = remember {
        listOf("Wszystkie", "Śniadanie", "Drugie śniadanie", "Obiad", "Przekąska", "Kolacja")
    }

    val loadRecipes = {
        scope.launch {
            isLoading = true
            errorMessage = null
            try {
                val catParam = if (selectedCategory == "Wszystkie") null else selectedCategory
                val searchParam = if (searchQuery.isBlank()) null else searchQuery.trim()
                val list = apiService.getRecipes(category = catParam, search = searchParam)
                recipes = list
            } catch (e: Exception) {
                errorMessage = "Nie udało się pobrać przepisów: ${e.localizedMessage}"
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(selectedCategory) {
        loadRecipes()
    }

    val loadProducts = {
        scope.launch {
            try {
                availableProducts = apiService.getProducts()
            } catch (_: Exception) {}
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Tytuł i przyciski akcji
        Text(
            text = "Baza przepisów fitness",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Przeglądaj, twórz nowe przepisy oraz zarządzaj bazą produktów dla swoich pacjentów",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(bottom = 10.dp)
        )

        // Pasek przycisków dodawania dla dietetyka
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(
                onClick = {
                    loadProducts()
                    showAddRecipeDialog = true
                },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Nowy przepis", fontSize = 12.sp)
            }

            FilledTonalButton(
                onClick = { showAddProductDialog = true },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(Icons.Default.Egg, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Nowy produkt", fontSize = 12.sp)
            }
        }

        // Komunikat sukcesu
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

        // Błąd
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
            placeholder = { Text("Szukaj przepisu lub składnika...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Szukaj") },
            trailingIcon = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (searchQuery.isNotBlank()) {
                        IconButton(onClick = {
                            searchQuery = ""
                            loadRecipes()
                        }) {
                            Icon(Icons.Default.Clear, contentDescription = "Wyczyść")
                        }
                    }
                    IconButton(onClick = { loadRecipes() }) {
                        Icon(Icons.Default.ArrowForward, contentDescription = "Szukaj")
                    }
                }
            },
            singleLine = true,
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp),
            shape = RoundedCornerShape(12.dp)
        )

        // Filtry kategorii
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
        } else if (recipes.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.RestaurantMenu, contentDescription = null, modifier = Modifier.size(48.dp), tint = MaterialTheme.colorScheme.outline)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Nie znaleziono przepisów.",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.outline
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(recipes) { r ->
                    ElevatedCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                scope.launch {
                                    isLoadingDetail = true
                                    try {
                                        val detail = apiService.getRecipeDetail(r.id)
                                        selectedRecipeDetail = detail
                                    } catch (_: Exception) {
                                        selectedRecipeDetail = r
                                    } finally {
                                        isLoadingDetail = false
                                    }
                                }
                            },
                        shape = RoundedCornerShape(14.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = r.title,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    modifier = Modifier.weight(1f)
                                )
                                Surface(
                                    shape = RoundedCornerShape(6.dp),
                                    color = MaterialTheme.colorScheme.secondaryContainer
                                ) {
                                    Text(
                                        text = r.category,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                MacroBadge(label = "Kcal", value = "${r.calories.toInt()}", color = MaterialTheme.colorScheme.primary)
                                MacroBadge(label = "B", value = "${r.proteinG.toInt()}g", color = MaterialTheme.colorScheme.tertiary)
                                MacroBadge(label = "T", value = "${r.fatG.toInt()}g", color = Color(0xFFD97706))
                                MacroBadge(label = "W", value = "${r.carbsG.toInt()}g", color = Color(0xFF2563EB))

                                Spacer(modifier = Modifier.weight(1f))

                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Timer, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.outline)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "${r.prepTimeMinutes} min",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.outline
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal: Dodanie nowego produktu
    if (showAddProductDialog) {
        var prodName by remember { mutableStateOf("") }
        var prodStore by remember { mutableStateOf("Lidl") }
        var prodBrand by remember { mutableStateOf("") }
        var prodCategory by remember { mutableStateOf("Inne") }
        var prodCalories by remember { mutableStateOf("") }
        var prodProtein by remember { mutableStateOf("") }
        var prodFat by remember { mutableStateOf("") }
        var prodCarbs by remember { mutableStateOf("") }
        var prodFiber by remember { mutableStateOf("") }
        var isSavingProduct by remember { mutableStateOf(false) }
        var prodError by remember { mutableStateOf<String?>(null) }

        val storeOptions = listOf("Lidl", "Biedronka", "Kaufland", "Auchan", "Carrefour", "Inny")
        val prodCategoryOptions = listOf("Nabiał", "Mięso/Ryby", "Pieczywo/Zboża", "Warzywa", "Owoce", "Tłuszcze/Orzechy", "Inne")

        AlertDialog(
            onDismissRequest = { showAddProductDialog = false },
            title = { Text("Dodaj nowy produkt do bazy") },
            text = {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        prodError?.let {
                            Text(it, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = prodName,
                            onValueChange = { prodName = it },
                            label = { Text("Nazwa produktu (np. Twaróg chudy)") },
                            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                    }
                    item {
                        OutlinedTextField(
                            value = prodBrand,
                            onValueChange = { prodBrand = it },
                            label = { Text("Marka / Producent (np. Pilos)") },
                            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                    }
                    item {
                        Text("Dostępny w sklepie:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(storeOptions) { s ->
                                FilterChip(
                                    selected = prodStore == s,
                                    onClick = { prodStore = s },
                                    label = { Text(s, fontSize = 11.sp) }
                                )
                            }
                        }
                    }
                    item {
                        Text("Kategoria produktu:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(prodCategoryOptions) { c ->
                                FilterChip(
                                    selected = prodCategory == c,
                                    onClick = { prodCategory = c },
                                    label = { Text(c, fontSize = 11.sp) }
                                )
                            }
                        }
                    }
                    item {
                        Text("Wartości odżywcze na 100g produktu:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                    item {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = prodCalories,
                                onValueChange = { prodCalories = it },
                                label = { Text("Kcal") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )
                            OutlinedTextField(
                                value = prodProtein,
                                onValueChange = { prodProtein = it },
                                label = { Text("Białko [g]") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )
                        }
                    }
                    item {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = prodFat,
                                onValueChange = { prodFat = it },
                                label = { Text("Tłuszcz [g]") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )
                            OutlinedTextField(
                                value = prodCarbs,
                                onValueChange = { prodCarbs = it },
                                label = { Text("Węgle [g]") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val cal = prodCalories.replace(',', '.').toDoubleOrNull()
                        val p = prodProtein.replace(',', '.').toDoubleOrNull()
                        val f = prodFat.replace(',', '.').toDoubleOrNull()
                        val c = prodCarbs.replace(',', '.').toDoubleOrNull()

                        if (prodName.isBlank()) {
                            prodError = "Podaj nazwę produktu."
                            return@Button
                        }
                        if (cal == null || p == null || f == null || c == null) {
                            prodError = "Wypełnij poprawnie wartości odżywcze (kcal, białko, tłuszcz, węgle)."
                            return@Button
                        }

                        scope.launch {
                            isSavingProduct = true
                            try {
                                val req = ProductCreateRequest(
                                    name = prodName.trim(),
                                    store = prodStore,
                                    brand = prodBrand.trim(),
                                    caloriesPer100g = cal,
                                    proteinPer100g = p,
                                    fatPer100g = f,
                                    carbsPer100g = c,
                                    fiberPer100g = prodFiber.replace(',', '.').toDoubleOrNull() ?: 0.0,
                                    category = prodCategory
                                )
                                apiService.createProduct(req)
                                successMessage = "Produkt '${prodName.trim()}' został pomyślnie dodany do bazy!"
                                showAddProductDialog = false
                            } catch (e: Exception) {
                                prodError = "Błąd dodawania: ${e.localizedMessage}"
                            } finally {
                                isSavingProduct = false
                            }
                        }
                    },
                    enabled = !isSavingProduct
                ) {
                    if (isSavingProduct) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text("Zapisz produkt")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddProductDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Modal: Dodanie nowego przepisu
    if (showAddRecipeDialog) {
        var recipeTitle by remember { mutableStateOf("") }
        var recipeCategory by remember { mutableStateOf("Obiad") }
        var prepTimeStr by remember { mutableStateOf("25") }
        var instructionsStr by remember { mutableStateOf("") }
        var selectedProductId by remember { mutableStateOf<Int?>(null) }
        var ingredientAmountStr by remember { mutableStateOf("100") }
        var chosenIngredients by remember { mutableStateOf<List<Pair<Product, Double>>>(emptyList()) }
        var isSavingRecipe by remember { mutableStateOf(false) }
        var recipeError by remember { mutableStateOf<String?>(null) }

        val recipeCategories = listOf("Śniadanie", "Drugie śniadanie", "Obiad", "Przekąska", "Kolacja")

        AlertDialog(
            onDismissRequest = { showAddRecipeDialog = false },
            title = { Text("Dodaj nowy przepis kulinarny") },
            text = {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        recipeError?.let {
                            Text(it, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = recipeTitle,
                            onValueChange = { recipeTitle = it },
                            label = { Text("Tytuł dania (np. Sałatka z grillowanym kurczakiem)") },
                            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                    }
                    item {
                        Text("Kategoria posiłku:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            items(recipeCategories) { c ->
                                FilterChip(
                                    selected = recipeCategory == c,
                                    onClick = { recipeCategory = c },
                                    label = { Text(c, fontSize = 11.sp) }
                                )
                            }
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = prepTimeStr,
                            onValueChange = { prepTimeStr = it },
                            label = { Text("Czas przygotowania [min]") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )
                    }
                    item {
                        Text("Składniki przepisu:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        if (availableProducts.isNotEmpty()) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                // Wybór produktu
                                var productSearch by remember { mutableStateOf("") }
                                Column(modifier = Modifier.weight(1.5f)) {
                                    OutlinedTextField(
                                        value = productSearch,
                                        onValueChange = { productSearch = it },
                                        placeholder = { Text("Szukaj prod...", fontSize = 11.sp) },
                                        singleLine = true,
                                        modifier = Modifier.fillMaxWidth()
                                    )
                                    val filteredProds = remember(availableProducts, productSearch) {
                                        if (productSearch.isBlank()) availableProducts.take(6)
                                        else availableProducts.filter { it.name.contains(productSearch, ignoreCase = true) }.take(6)
                                    }
                                    LazyRow(
                                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                                        modifier = Modifier.padding(top = 4.dp)
                                    ) {
                                        items(filteredProds) { p ->
                                            FilterChip(
                                                selected = selectedProductId == p.id,
                                                onClick = { selectedProductId = p.id },
                                                label = { Text(p.name.take(14), fontSize = 10.sp) }
                                            )
                                        }
                                    }
                                }

                                Column(modifier = Modifier.weight(1f)) {
                                    OutlinedTextField(
                                        value = ingredientAmountStr,
                                        onValueChange = { ingredientAmountStr = it },
                                        label = { Text("Gramy [g]", fontSize = 10.sp) },
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                        singleLine = true
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    FilledTonalButton(
                                        onClick = {
                                            val pid = selectedProductId ?: return@FilledTonalButton
                                            val amt = ingredientAmountStr.replace(',', '.').toDoubleOrNull() ?: 100.0
                                            val prod = availableProducts.find { it.id == pid }
                                            if (prod != null) {
                                                chosenIngredients = chosenIngredients + (prod to amt)
                                                selectedProductId = null
                                            }
                                        },
                                        modifier = Modifier.fillMaxWidth(),
                                        enabled = selectedProductId != null
                                    ) {
                                        Text("+ Dodaj", fontSize = 11.sp)
                                    }
                                }
                            }
                        } else {
                            Text("Brak wczytanych produktów.", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                        }

                        // Lista dodanych składników
                        if (chosenIngredients.isNotEmpty()) {
                            Spacer(modifier = Modifier.height(6.dp))
                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                chosenIngredients.forEachIndexed { idx, pair ->
                                    Surface(
                                        shape = RoundedCornerShape(6.dp),
                                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                        modifier = Modifier.fillMaxWidth()
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text(
                                                text = "${pair.first.name} - ${pair.second.toInt()}g",
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Medium
                                            )
                                            IconButton(
                                                onClick = {
                                                    chosenIngredients = chosenIngredients.filterIndexed { i, _ -> i != idx }
                                                },
                                                modifier = Modifier.size(24.dp)
                                            ) {
                                                Icon(Icons.Default.Close, contentDescription = "Usuń", modifier = Modifier.size(16.dp))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    item {
                        OutlinedTextField(
                            value = instructionsStr,
                            onValueChange = { instructionsStr = it },
                            label = { Text("Instrukcja przygotowania krok po kroku") },
                            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp),
                            maxLines = 6
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (recipeTitle.isBlank()) {
                            recipeError = "Wpisz tytuł przepisu."
                            return@Button
                        }
                        if (chosenIngredients.isEmpty()) {
                            recipeError = "Dodaj co najmniej jeden składnik do przepisu."
                            return@Button
                        }

                        scope.launch {
                            isSavingRecipe = true
                            try {
                                val req = RecipeCreateRequest(
                                    title = recipeTitle.trim(),
                                    category = recipeCategory,
                                    prepTimeMinutes = prepTimeStr.toIntOrNull() ?: 20,
                                    instructions = instructionsStr.trim(),
                                    defaultPortions = 1.0,
                                    ingredients = chosenIngredients.map {
                                        RecipeIngredientInput(
                                            productId = it.first.id,
                                            amountG = it.second,
                                            unit = "g"
                                        )
                                    }
                                )
                                apiService.createRecipe(req)
                                successMessage = "Przepis '${recipeTitle.trim()}' został pomyślnie zapisany w bazie!"
                                showAddRecipeDialog = false
                                loadRecipes()
                            } catch (e: Exception) {
                                recipeError = "Błąd zapisu przepisu: ${e.localizedMessage}"
                            } finally {
                                isSavingRecipe = false
                            }
                        }
                    },
                    enabled = !isSavingRecipe
                ) {
                    if (isSavingRecipe) {
                        CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                    }
                    Text("Utwórz przepis")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddRecipeDialog = false }) {
                    Text("Anuluj")
                }
            }
        )
    }

    // Modal szczegółów danego przepisu
    if (selectedRecipeDetail != null) {
        val recipe = selectedRecipeDetail!!
        AlertDialog(
            onDismissRequest = { selectedRecipeDetail = null },
            title = {
                Column {
                    Text(
                        text = recipe.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                    Text(
                        text = recipe.category,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            },
            text = {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Makroskładniki dania
                    item {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Text(text = "Wartości odżywcze w porcji:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.height(6.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    MacroBadge(label = "Kcal", value = "${recipe.calories.toInt()}", color = MaterialTheme.colorScheme.primary)
                                    MacroBadge(label = "Białko", value = "${recipe.proteinG.toInt()}g", color = MaterialTheme.colorScheme.tertiary)
                                    MacroBadge(label = "Tłuszcz", value = "${recipe.fatG.toInt()}g", color = Color(0xFFD97706))
                                    MacroBadge(label = "Węgle", value = "${recipe.carbsG.toInt()}g", color = Color(0xFF2563EB))
                                }
                            }
                        }
                    }

                    // Składniki
                    item {
                        Column {
                            Text(text = "Składniki i gramatura:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Spacer(modifier = Modifier.height(4.dp))

                            val ings = recipe.ingredients
                            if (!ings.isNullOrEmpty()) {
                                ings.forEach { ing ->
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = MaterialTheme.colorScheme.surface,
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(vertical = 2.dp)
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(text = ing.product.name, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                                            Text(
                                                text = "${ing.amountG.toInt()} ${ing.unit}",
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = MaterialTheme.colorScheme.primary
                                            )
                                        }
                                    }
                                }
                            } else {
                                Text("Brak szczegółowej listy składników.", fontSize = 12.sp, color = MaterialTheme.colorScheme.outline)
                            }
                        }
                    }

                    // Instrukcja przygotowania
                    item {
                        Text(text = "Sposób przygotowania:", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = recipe.instructions?.ifBlank { "Brak opisu przygotowania." }
                                ?: "Brak opisu przygotowania.",
                            fontSize = 13.sp,
                            lineHeight = 18.sp
                        )
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { selectedRecipeDetail = null }) {
                    Text("Zamknij")
                }
            }
        )
    }
}

@Composable
private fun MacroBadge(label: String, value: String, color: androidx.compose.ui.graphics.Color) {
    Surface(
        shape = RoundedCornerShape(6.dp),
        color = color.copy(alpha = 0.15f)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "$label: ",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Text(
                text = value,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}
