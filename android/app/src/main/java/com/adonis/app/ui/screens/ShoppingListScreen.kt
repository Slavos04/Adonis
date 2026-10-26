package com.adonis.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.ShoppingCart
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
                    text = "Lidl, Biedronka, Kaufland, Carrefour",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
            IconButton(onClick = { loadItems() }) {
                Icon(Icons.Default.Refresh, contentDescription = "Odśwież")
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Progress Card - Item 11: "Koszyk: 0/37" so percentage fits on one line
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp),
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
            }
        }

        // Days range selection chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Zakres:", fontSize = 11.sp, fontWeight = FontWeight.Bold)
            listOf(3, 5, 7, 14).forEach { days ->
                FilterChip(
                    selected = daysAhead == days,
                    onClick = { daysAhead = days },
                    label = { Text("$days d", fontSize = 11.sp) }
                )
            }
        }

        // One-Stop Shopping Mode Banner / Toggle - Item 12: clearly visible store chips
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp),
            colors = CardDefaults.cardColors(
                containerColor = if (oneStopStore != "OFF") MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
            )
        ) {
            Column(modifier = Modifier.padding(8.dp)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        Icons.Default.Store,
                        contentDescription = "One-Stop",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(16.dp)
                    )
                    Text(
                        text = "Tryb One-Stop (wszystko w 1 sklepie):",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    oneStopStores.forEach { store ->
                        val isSelected = oneStopStore == store
                        Surface(
                            shape = MaterialTheme.shapes.small,
                            color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.clickable { oneStopStore = store }
                        ) {
                            Text(
                                text = if (store == "OFF") "Wyłączony" else store,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp)
                            )
                        }
                    }
                }
            }
        }

        // Store Filter Chips - Item 12: clearly visible store chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            availableStores.forEach { store ->
                val isSelected = selectedStoreFilter == store
                Surface(
                    shape = MaterialTheme.shapes.small,
                    color = if (isSelected) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.surfaceVariant,
                    modifier = Modifier.clickable { selectedStoreFilter = store }
                ) {
                    Text(
                        text = store,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        color = if (isSelected) MaterialTheme.colorScheme.onSecondary else MaterialTheme.colorScheme.onSurface,
                        modifier = Modifier.padding(horizontal = 9.dp, vertical = 5.dp)
                    )
                }
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
                    .padding(16.dp),
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
                        text = "Lista generuje się automatycznie z Twojego jadłospisu ($startDate – $endDate). Załaduj pakiet dań w menu Jadłospis.",
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
            return
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(filteredItems, key = { it.id ?: it.productName }) { item ->
                val isOneStopSubstituted = oneStopStore != "OFF" && !item.store.equals(oneStopStore, ignoreCase = true)
                val targetDisplayStore = if (isOneStopSubstituted) oneStopStore else item.store

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
                                        color = getStoreBadgeColor(targetDisplayStore),
                                        shape = MaterialTheme.shapes.extraSmall
                                    ) {
                                        Text(
                                            text = targetDisplayStore,
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White,
                                            modifier = Modifier.padding(horizontal = 5.dp, vertical = 2.dp)
                                        )
                                    }

                                    if (isOneStopSubstituted) {
                                        Text(
                                            text = "odp. z ${item.store}",
                                            fontSize = 9.sp,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                    } else if (item.brand.isNotBlank()) {
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

fun getStoreBadgeColor(store: String): Color {
    return when (store.lowercase()) {
        "lidl" -> Color(0xFF0050AA)
        "biedronka" -> Color(0xFFD32F2F)
        "kaufland" -> Color(0xFFC62828)
        "carrefour" -> Color(0xFF0284C7)
        else -> Color(0xFF4B5563)
    }
}

