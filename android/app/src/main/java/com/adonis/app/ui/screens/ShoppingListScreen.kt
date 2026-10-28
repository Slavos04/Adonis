package com.adonis.app.ui.screens

import android.app.DatePickerDialog
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.model.ShoppingListItem
import com.adonis.app.data.model.ToggleShoppingItemRequest
import com.adonis.app.data.model.BulkToggleShoppingRequest
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShoppingListScreen(apiService: AdonisApiService) {
    val context = LocalContext.current
    val sdf = remember { SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()) }

    var startDate by remember {
        mutableStateOf(sdf.format(Calendar.getInstance().time))
    }
    var endDate by remember {
        val cal = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, 4) }
        mutableStateOf(sdf.format(cal.time))
    }
    var activeDaysChip by remember { mutableStateOf<Int?>(5) }

    var items by remember { mutableStateOf<List<ShoppingListItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var selectedStoreFilter by remember { mutableStateOf("Wszystkie") }
    val scope = rememberCoroutineScope()

    val availableStores = listOf("Wszystkie", "Lidl", "Biedronka", "Kaufland", "Carrefour")

    fun loadItems(start: String = startDate, end: String = endDate) {
        scope.launch {
            isLoading = true
            try {
                items = apiService.getShoppingList(start, end)
            } catch (_: Exception) {
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(startDate, endDate) {
        loadItems(startDate, endDate)
    }

    fun showDatePicker(currentDateStr: String, onDateSelected: (String) -> Unit) {
        val cal = Calendar.getInstance()
        try {
            sdf.parse(currentDateStr)?.let { cal.time = it }
        } catch (_: Exception) {}

        DatePickerDialog(
            context,
            { _, year, month, dayOfMonth ->
                val chosen = Calendar.getInstance().apply {
                    set(year, month, dayOfMonth)
                }
                onDateSelected(sdf.format(chosen.time))
            },
            cal.get(Calendar.YEAR),
            cal.get(Calendar.MONTH),
            cal.get(Calendar.DAY_OF_MONTH)
        ).show()
    }

    fun applyDaysRange(days: Int) {
        activeDaysChip = days
        val cal = Calendar.getInstance()
        val newStart = sdf.format(cal.time)
        cal.add(Calendar.DAY_OF_YEAR, days - 1)
        val newEnd = sdf.format(cal.time)
        startDate = newStart
        endDate = newEnd
        loadItems(newStart, newEnd)
    }

    fun toggleBought(item: ShoppingListItem, checked: Boolean) {
        val id = item.id ?: return
        items = items.map { if (it.id == id) it.copy(isBought = checked) else it }
        scope.launch {
            try {
                apiService.toggleShoppingItem(
                    ToggleShoppingItemRequest(itemId = id, isBought = checked)
                )
            } catch (_: Exception) {}
        }
    }

    fun toggleSkipped(item: ShoppingListItem) {
        val id = item.id ?: return
        val newSkipped = !item.isSkipped
        items = items.map { if (it.id == id) it.copy(isSkipped = newSkipped) else it }
        scope.launch {
            try {
                apiService.toggleShoppingItem(
                    ToggleShoppingItemRequest(itemId = id, isSkipped = newSkipped)
                )
            } catch (_: Exception) {}
        }
    }

    // Filter items based on single store filter row
    val filteredItems = remember(items, selectedStoreFilter) {
        if (selectedStoreFilter == "Wszystkie") {
            items
        } else {
            items.filter { it.store.equals(selectedStoreFilter, ignoreCase = true) }
        }
    }

    val boughtCount = filteredItems.count { it.isBought }
    val totalCount = filteredItems.size
    val progress = if (totalCount > 0) boughtCount.toFloat() / totalCount else 0f
    val allBought = filteredItems.isNotEmpty() && filteredItems.all { it.isBought }

    fun toggleAllBought(targetState: Boolean) {
        val ids = filteredItems.mapNotNull { it.id }
        items = items.map { if (filteredItems.any { f -> f.id == it.id }) it.copy(isBought = targetState) else it }
        scope.launch {
            try {
                apiService.bulkToggleShoppingItems(
                    BulkToggleShoppingRequest(isBought = targetState, itemIds = ids)
                )
            } catch (_: Exception) {}
        }
    }

    val categoryOrder = listOf(
        "Warzywa", "Owoce", "Nabiał", "Mięso i wędliny",
        "Ryby i owoce morza", "Pieczywo", "Produkty zbożowe",
        "Tłuszcze, nasiona i orzechy", "Inne produkty"
    )

    val groupedItems = remember(filteredItems) {
        categoryOrder.mapNotNull { cat ->
            val matching = filteredItems.filter { normalizeShoppingCategory(it.category) == cat }
            if (matching.isNotEmpty()) cat to matching else null
        }
    }

    // Cały ekran jako LazyColumn z możliwością scrollowania w górę i w dół (Punkt 9)
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 24.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // Nagłówek
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Lista Zakupów",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Generowana z Twojego jadłospisu",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
                IconButton(onClick = { loadItems() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Odśwież")
                }
            }
        }

        // Punkt 6: Wybór zakresu dat (Od - Do) oraz szybkie kafelki (np. "3d", "5d", "7d", "14d")
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(
                            Icons.Default.CalendarMonth,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(16.dp)
                        )
                        Text(
                            text = "Zakres dat jadłospisu:",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Pola dat Od - Do
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = MaterialTheme.shapes.small,
                            color = MaterialTheme.colorScheme.surface,
                            tonalElevation = 2.dp,
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    showDatePicker(startDate) { newDate ->
                                        startDate = newDate
                                        activeDaysChip = null
                                    }
                                }
                        ) {
                            Column(modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)) {
                                Text("Od:", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                                Text(startDate, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        Text("—", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f))

                        Surface(
                            shape = MaterialTheme.shapes.small,
                            color = MaterialTheme.colorScheme.surface,
                            tonalElevation = 2.dp,
                            modifier = Modifier
                                .weight(1f)
                                .clickable {
                                    showDatePicker(endDate) { newDate ->
                                        endDate = newDate
                                        activeDaysChip = null
                                    }
                                }
                        ) {
                            Column(modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)) {
                                Text("Do:", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                                Text(endDate, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Kafelki szybkiego wyboru: 1d, 3d, 5d, 7d, 14d
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Szybki wybór:", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                        listOf(1, 3, 5, 7, 14).forEach { days ->
                            val isSelected = activeDaysChip == days
                            Surface(
                                shape = MaterialTheme.shapes.small,
                                color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surface,
                                tonalElevation = 1.dp,
                                modifier = Modifier.clickable { applyDaysRange(days) }
                            ) {
                                Text(
                                    text = "${days}d",
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface,
                                    modifier = Modifier.padding(horizontal = 9.dp, vertical = 4.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Karta postępu zakupów
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Koszyk: $boughtCount/$totalCount",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${(progress * 100).toInt()}%",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    LinearProgressIndicator(
                        progress = { progress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(7.dp),
                        color = MaterialTheme.colorScheme.primary,
                        trackColor = MaterialTheme.colorScheme.surface
                    )

                    if (filteredItems.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { toggleAllBought(!allBought) },
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = allBought,
                                onCheckedChange = { toggleAllBought(it) },
                                modifier = Modifier.size(28.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (allBought) "Odznacz wszystkie zakupy" else "Zaznacz wszystkie jako kupione",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (allBought) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }
            }
        }

        // Punkt 7: Usunięto zduplikowany wiersz ze sklepami. Pozostawiono pojedynczy, czysty wiersz filtrów sklepów.
        item {
            Column {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier.padding(bottom = 4.dp)
                ) {
                    Icon(
                        Icons.Default.Store,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = "Sklep:",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    availableStores.forEach { store ->
                        val isSelected = selectedStoreFilter == store
                        Surface(
                            shape = MaterialTheme.shapes.small,
                            color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.clickable { selectedStoreFilter = store }
                        ) {
                            Text(
                                text = store,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
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
        } else if (filteredItems.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Default.ShoppingCart,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.6f),
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "Brak produktów w liście zakupów",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Lista generuje się z Twojego jadłospisu ($startDate – $endDate). Załaduj pakiet jadłospisów w menu Jadłospis.",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(onClick = { loadItems() }) {
                            Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Odśwież listę", fontSize = 12.sp)
                        }
                    }
                }
            }
        } else {
            groupedItems.forEach { (catName, catItems) ->
                // Nagłówek kategorii
                item(key = "header_$catName") {
                    Surface(
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                        shape = MaterialTheme.shapes.small,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp, bottom = 2.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Text(getCategoryIcon(catName), fontSize = 14.sp)
                                Text(
                                    text = catName,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                            Surface(
                                shape = MaterialTheme.shapes.extraSmall,
                                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                            ) {
                                Text(
                                    text = "${catItems.size}",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 1.dp)
                                )
                            }
                        }
                    }
                }

                items(catItems, key = { it.id ?: "${it.productName}_${it.store}_${catName}" }) { item ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { toggleBought(item, !item.isBought) },
                        colors = CardDefaults.cardColors(
                            containerColor = when {
                                item.isBought -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
                                item.isSkipped -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
                                else -> MaterialTheme.colorScheme.surface
                            }
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                Checkbox(
                                    checked = item.isBought,
                                    onCheckedChange = { checked ->
                                        toggleBought(item, checked)
                                    }
                                )

                                Column(modifier = Modifier.padding(start = 6.dp)) {
                                    Text(
                                        text = item.productName,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        textDecoration = if (item.isBought || item.isSkipped) TextDecoration.LineThrough else TextDecoration.None
                                    )

                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                                        modifier = Modifier.padding(top = 2.dp)
                                    ) {
                                        Surface(
                                            color = getStoreBadgeColor(item.store),
                                            shape = MaterialTheme.shapes.extraSmall
                                        ) {
                                            Text(
                                                text = item.store,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color.White,
                                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                                            )
                                        }

                                        if (item.brand.isNotBlank()) {
                                            Text(
                                                text = item.brand,
                                                fontSize = 10.sp,
                                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                                            )
                                        }
                                    }

                                    if (item.recipes.isNotEmpty()) {
                                        Text(
                                            text = "Danie: ${item.recipes.joinToString(", ")}",
                                            fontSize = 9.sp,
                                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                                            maxLines = 1,
                                            modifier = Modifier.padding(top = 2.dp)
                                        )
                                    }
                                }
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "${item.amount} ${item.unit}",
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = 14.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )

                                TextButton(
                                    onClick = { toggleSkipped(item) },
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Text(
                                        if (item.isSkipped) "W lodówce ✓" else "Mam w domu",
                                        fontSize = 10.sp
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

fun normalizeShoppingCategory(cat: String?): String {
    if (cat.isNullOrBlank()) return "Inne produkty"
    val c = cat.lowercase(Locale.getDefault())
    return when {
        c.contains("warzyw") -> "Warzywa"
        c.contains("owoc") && !c.contains("morza") -> "Owoce"
        c.contains("nabiał") || c.contains("mleko") || c.contains("jogurt") || c.contains("ser") || c.contains("twaróg") || c.contains("kefir") || c.contains("skyr") -> "Nabiał"
        c.contains("mięs") || c.contains("drób") || c.contains("wędlin") || c.contains("kurczak") || c.contains("indyk") || c.contains("szynk") -> "Mięso i wędliny"
        c.contains("ryb") || c.contains("morza") || c.contains("łosoś") || c.contains("dorsz") || c.contains("tuńczyk") -> "Ryby i owoce morza"
        c.contains("pieczyw") || c.contains("chleb") || c.contains("bułk") -> "Pieczywo"
        c.contains("zboż") || c.contains("płatk") || c.contains("kasz") || c.contains("ryż") || c.contains("makaron") || c.contains("mąk") -> "Produkty zbożowe"
        c.contains("tłuszcz") || c.contains("oliw") || c.contains("olej") || c.contains("orzech") || c.contains("nasion") || c.contains("masło") -> "Tłuszcze, nasiona i orzechy"
        else -> "Inne produkty"
    }
}

fun getCategoryIcon(cat: String): String {
    return when (cat) {
        "Warzywa" -> "🥦"
        "Owoce" -> "🍎"
        "Nabiał" -> "🧀"
        "Mięso i wędliny" -> "🥩"
        "Ryby i owoce morza" -> "🐟"
        "Pieczywo" -> "🥖"
        "Produkty zbożowe" -> "🌾"
        "Tłuszcze, nasiona i orzechy" -> "🥜"
        else -> "📦"
    }
}

fun getStoreBadgeColor(store: String): Color {
    return when (store.lowercase()) {
        "lidl" -> Color(0xFF0050AA)
        "biedronka" -> Color(0xFFD32F2F)
        "kaufland" -> Color(0xFFC62828)
        "carrefour" -> Color(0xFF0284C7)
        else -> Color(0xFF4B5563)
    }
}
