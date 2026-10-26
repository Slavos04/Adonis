package com.adonis.app.ui.screens

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.data.api.AdonisApiService
import com.adonis.app.data.model.ShoppingListItem
import com.adonis.app.data.model.ToggleShoppingItemRequest
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShoppingListScreen(apiService: AdonisApiService) {
    val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    var daysAhead by remember { mutableStateOf(5) }

    val today = remember { Calendar.getInstance() }
    val startDate = remember { sdf.format(today.time) }
    val endDate = remember(daysAhead) {
        val cal = Calendar.getInstance().apply { add(Calendar.DAY_OF_YEAR, daysAhead) }
        sdf.format(cal.time)
    }

    var items by remember { mutableStateOf<List<ShoppingListItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var selectedStoreFilter by remember { mutableStateOf("Wszystkie") }
    var oneStopStore by remember { mutableStateOf("OFF") } // OFF, Lidl, Biedronka, Kaufland, Carrefour
    val scope = rememberCoroutineScope()

    val availableStores = listOf("Wszystkie", "Lidl", "Biedronka", "Kaufland", "Carrefour")
    val oneStopStores = listOf("OFF", "Lidl", "Biedronka", "Kaufland", "Carrefour")

    fun loadItems() {
        scope.launch {
            isLoading = true
            try {
                items = apiService.getShoppingList(startDate, endDate)
            } catch (_: Exception) {
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(endDate) {
        loadItems()
    }

    // Filter items based on store filter
    val filteredItems = remember(items, selectedStoreFilter) {
        if (selectedStoreFilter == "Wszystkie") {
            items
        } else {
            items.filter { it.store.equals(selectedStoreFilter, ignoreCase = true) }
        }
    }

    val boughtCount = items.count { it.isBought }
    val totalCount = items.size
    val progress = if (totalCount > 0) boughtCount.toFloat() / totalCount else 0f

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Inteligentna Lista Zakupów",
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 2.dp)
        )
        Text(
            text = "4 sieci: Lidl, Biedronka, Kaufland & Carrefour • Tryb One-Stop",
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Progress Card
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Koszyk zakupowy: $boughtCount / $totalCount kupionych",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = "${(progress * 100).toInt()}%",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                LinearProgressIndicator(
                    progress = { progress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp),
                    color = MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.surface
                )
            }
        }

        // Days range selection chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Zakres:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            listOf(3, 5, 7, 14).forEach { days ->
                FilterChip(
                    selected = daysAhead == days,
                    onClick = { daysAhead = days },
                    label = { Text("$days dni") }
                )
            }
        }

        // One-Stop Shopping Mode Banner / Toggle
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            colors = CardDefaults.cardColors(
                containerColor = if (oneStopStore != "OFF") MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
            )
        ) {
            Column(modifier = Modifier.padding(10.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        Icons.Default.Store,
                        contentDescription = "One-Stop",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        text = "Tryb One-Stop Shopping (wszystko w 1 sklepie):",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    oneStopStores.forEach { store ->
                        FilterChip(
                            selected = oneStopStore == store,
                            onClick = { oneStopStore = store },
                            label = { Text(if (store == "OFF") "Wyłączony" else store, fontSize = 11.sp) },
                            leadingIcon = if (oneStopStore == store) {
                                { Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp)) }
                            } else null
                        )
                    }
                }
                if (oneStopStore != "OFF") {
                    Text(
                        text = "⚡ Automatycznie zamienia produkty z innych marketów na odpowiedniki w $oneStopStore!",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
        }

        // Store Filter Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            availableStores.forEach { store ->
                FilterChip(
                    selected = selectedStoreFilter == store,
                    onClick = { selectedStoreFilter = store },
                    label = { Text(store, fontSize = 12.sp) }
                )
            }
        }

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
            return
        }

        if (filteredItems.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Brak produktów do kupienia dla wybranych filtrów.",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
            return
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(filteredItems) { item ->
                val isOneStopSubstituted = oneStopStore != "OFF" && !item.store.equals(oneStopStore, ignoreCase = true)
                val targetDisplayStore = if (isOneStopSubstituted) oneStopStore else item.store

                Card(
                    modifier = Modifier.fillMaxWidth(),
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
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Checkbox(
                                checked = item.isBought,
                                onCheckedChange = { checked ->
                                    item.id?.let { id ->
                                        scope.launch {
                                            apiService.toggleShoppingItem(
                                                ToggleShoppingItemRequest(itemId = id, isBought = checked)
                                            )
                                            loadItems()
                                        }
                                    }
                                }
                            )

                            Column(modifier = Modifier.padding(start = 8.dp)) {
                                Text(
                                    text = item.productName,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    textDecoration = if (item.isBought || item.isSkipped) TextDecoration.LineThrough else TextDecoration.None
                                )

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    modifier = Modifier.padding(top = 2.dp)
                                ) {
                                    Surface(
                                        color = getStoreBadgeColor(targetDisplayStore),
                                        shape = MaterialTheme.shapes.extraSmall
                                    ) {
                                        Text(
                                            text = targetDisplayStore,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }

                                    if (isOneStopSubstituted) {
                                        Text(
                                            text = "odp. z ${item.store}",
                                            fontSize = 10.sp,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    } else if (item.brand.isNotBlank()) {
                                        Text(
                                            text = item.brand,
                                            fontSize = 11.sp,
                                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                                        )
                                    }
                                }

                                if (item.recipes.isNotEmpty()) {
                                    Text(
                                        text = "Przepis: ${item.recipes.joinToString(", ")}",
                                        fontSize = 10.sp,
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
                                fontSize = 15.sp,
                                color = MaterialTheme.colorScheme.primary
                            )

                            TextButton(
                                onClick = {
                                    item.id?.let { id ->
                                        scope.launch {
                                            apiService.toggleShoppingItem(
                                                ToggleShoppingItemRequest(itemId = id, isSkipped = !item.isSkipped)
                                            )
                                            loadItems()
                                        }
                                    }
                                },
                                contentPadding = PaddingValues(0.dp)
                            ) {
                                Text(
                                    if (item.isSkipped) "W lodówce ✓" else "Mam w domu",
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }
                }
            }
        }
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

