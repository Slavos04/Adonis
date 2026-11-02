package com.adonis.app.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
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
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adonis.app.R
import com.adonis.app.util.AppVersionHelper

@Composable
fun AppInfoDialog(
    onDismissRequest: () -> Unit
) {
    val context = LocalContext.current
    val currentVersion = remember { AppVersionHelper.getVersionName(context) }
    var selectedTab by remember { mutableStateOf(0) }

    AlertDialog(
        onDismissRequest = onDismissRequest,
        icon = {
            Icon(
                Icons.Default.Info,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(36.dp)
            )
        },
        title = {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "ADONIS",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "fit & eat",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.secondary,
                    letterSpacing = 1.5.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = "v$currentVersion",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 2.dp)
                    )
                }
            }
        },
        text = {
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                TabRow(
                    selectedTabIndex = selectedTab,
                    modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp)
                ) {
                    Tab(
                        selected = selectedTab == 0,
                        onClick = { selectedTab = 0 },
                        text = { Text("O aplikacji", fontSize = 12.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = selectedTab == 1,
                        onClick = { selectedTab = 1 },
                        text = { Text("Changelog", fontSize = 12.sp, fontWeight = FontWeight.Bold) }
                    )
                }

                if (selectedTab == 0) {
                    // TAB 0: O APLIKACJI
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 380.dp)
                            .verticalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            text = "ADONIS fit & eat to zaawansowany system dietetyczny i monitorowania sylwetki, stworzony z myślą o trwałej i bezpiecznej redukcji masy ciała.",
                            fontSize = 13.sp,
                            lineHeight = 18.sp
                        )

                        Surface(
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(10.dp),
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                FeatureRow("Precyzyjne bilansowanie kalorii i makro (B, T, W)")
                                FeatureRow("Automatyczne miary kuchenne (łyżki, szklanki, garście)")
                                FeatureRow("Baza ponad 125 przepisów i realnych produktów z dyskontów")
                                FeatureRow("Inteligentna lista zakupów z mnożnikiem zapasów")
                                FeatureRow("Wykresy wagi, talii i dynamiczne BMI z normą WHO")
                                FeatureRow("Czat z dietetykiem w czasie rzeczywistym")
                            }
                        }

                        // Kod QR do aplikacji mobilnej
                        Surface(
                            color = Color.White,
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(12.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "POBIERZ APLIKACJĘ MOBILNĄ",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF1E293B)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Image(
                                    painter = painterResource(id = R.drawable.adonis_qr),
                                    contentDescription = "Kod QR do pobrania aplikacji",
                                    modifier = Modifier.size(130.dp)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "Zeskanuj kod aparatem telefonu",
                                    fontSize = 10.sp,
                                    color = Color(0xFF64748B)
                                )
                            }
                        }

                        Surface(
                            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.08f),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(10.dp),
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = "KONTAKT I WSPARCIE:",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                TextButton(
                                    onClick = {
                                        val intent = Intent(Intent.ACTION_SENDTO).apply {
                                            data = Uri.parse("mailto:slavosmm@gmail.com")
                                            putExtra(Intent.EXTRA_SUBJECT, "ADONIS fit & eat - kontakt")
                                        }
                                        try {
                                            context.startActivity(intent)
                                        } catch (_: Exception) {}
                                    }
                                ) {
                                    Icon(Icons.Default.Email, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "slavosmm@gmail.com",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp
                                    )
                                }
                            }
                        }

                        Text(
                            text = "© 2026 ADONIS fit & eat. Wszelkie prawa zastrzeżone.",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                            modifier = Modifier.align(Alignment.CenterHorizontally)
                        )
                    }
                } else {
                    // TAB 1: CHANGELOG (HISTORIA ZMIAN)
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 380.dp)
                            .verticalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        ChangelogCard(
                            version = "1.18.0",
                            date = "2 listopada 2026",
                            isLatest = true,
                            title = "Nawigacja jadłospisu, sumy dnia & miary kuchenne",
                            items = listOf(
                                "Nawigacja po dniach: Wygodne i widoczne przyciski < i > obok daty z opcją wyboru z kalendarza.",
                                "Dynamiczne sumy dnia: Zmiana wielkości porcji posiłku aktualizuje dzienne kalorie oraz makroskładniki.",
                                "Cel kaloryczny & ostrzeżenie: Wyświetlanie dziennego limitu kalorii oraz czerwonego wykrzyknika ❗ przy dacie w przypadku przekroczenia.",
                                "Lista zakupów: Przeniesienie ikony domku pod checkbox oraz zwięzłe i czytelne miary kuchenne.",
                                "Miary kuchenne: Automatyczne przeliczanie składników na łyżki, łyżeczki, szklanki, garście i sztuki w całej aplikacji.",
                                "Historia zmian: Pełny Changelog dostępny bezpośrednio w oknie O aplikacji."
                            )
                        )

                        ChangelogCard(
                            version = "1.17.0",
                            date = "2 listopada 2026",
                            isLatest = false,
                            title = "Mnożnik listy zakupów i ujednolicenie składników",
                            items = listOf(
                                "Mnożnik zakupów: Dodano skalowanie listy zakupów (x0.5, x1, x1.5, x2, x3) do robienia większych zapasów.",
                                "Czyste składniki: Usunięto zbędny znacznik 'ogólne' przy składnikach – nazwa marketu pojawia się tylko przy konkretnych dyskontach.",
                                "Eksport PDF listy zakupów uwzględnia wybrany mnożnik."
                            )
                        )

                        ChangelogCard(
                            version = "1.16.0",
                            date = "1 listopada 2026",
                            isLatest = false,
                            title = "Naprawa zapisu pomiarów (waga, talia)",
                            items = listOf(
                                "Pomiary ciała: Naprawiono błąd zapisu wagi i obwodu talii w bazie danych.",
                                "Pomiary Dietetyka: Umożliwiono dietetykowi bezpośrednie wprowadzanie pomiarów dla podopiecznych.",
                                "Czytelne komunikaty błędów walidacji."
                            )
                        )

                        ChangelogCard(
                            version = "1.15.0",
                            date = "1 listopada 2026",
                            isLatest = false,
                            title = "Samodzielne przypisywanie dietetyka",
                            items = listOf(
                                "Konto Dietetyka: Przypisywanie i odpinanie pacjentów z poziomu kartoteki.",
                                "Konto Pacjenta: Wybór dietetyka prowadzącego w Ustawieniach.",
                                "Powiadomienia o objęciu opieką dietetyczną."
                            )
                        )

                        ChangelogCard(
                            version = "1.14.0",
                            date = "1 listopada 2026",
                            isLatest = false,
                            title = "Niezawodne tło graficzne i branding",
                            items = listOf(
                                "Studio Motywów: Obsługa teł graficznych i wgrywania własnych zdjęć.",
                                "Globalna publikacja motywu dla podopiecznych."
                            )
                        )

                        ChangelogCard(
                            version = "1.13.0",
                            date = "31 października 2026",
                            isLatest = false,
                            title = "Baza przepisów i bilansowanie makro",
                            items = listOf(
                                "Baza 125+ zbilansowanych przepisów z realnymi produktami z dyskontów (Lidl, Biedronka, Kaufland, Carrefour).",
                                "Precyzyjne wyliczanie kalorii i makroskładników (B, T, W)."
                            )
                        )
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = onDismissRequest,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Zamknij")
            }
        }
    )
}

@Composable
private fun ChangelogCard(
    version: String,
    date: String,
    isLatest: Boolean,
    title: String,
    items: List<String>
) {
    Card(
        colors = CardDefaults.cardColors(
            containerColor = if (isLatest) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.35f) else MaterialTheme.colorScheme.surfaceVariant
        ),
        border = if (isLatest) BorderStroke(1.dp, MaterialTheme.colorScheme.primary) else null,
        shape = RoundedCornerShape(10.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "v$version",
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 13.sp,
                    color = if (isLatest) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                )
                if (isLatest) {
                    Surface(
                        color = MaterialTheme.colorScheme.primary,
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = "NAJNOWSZA",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimary,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                } else {
                    Text(
                        text = date,
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(vertical = 3.dp)
            )
            items.forEach { item ->
                Row(
                    modifier = Modifier.padding(vertical = 1.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Text(
                        text = "• ",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = item,
                        fontSize = 11.sp,
                        lineHeight = 15.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
private fun FeatureRow(text: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Icon(
            Icons.Default.Check,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(14.dp)
        )
        Text(
            text = text,
            fontSize = 12.sp,
            lineHeight = 16.sp
        )
    }
}
