package com.adonis.app.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Shared Accent Colors
val EmeraldPrimary = Color(0xFF10B981)
val EmeraldLight = Color(0xFFA7F3D0)
val ForestGreen = Color(0xFF22C55E)
val OceanSky = Color(0xFF38BDF8)
val OceanBlue = Color(0xFF0284C7)
val AmberGold = Color(0xFFF59E0B)

data class ThemeOption(
    val id: String,
    val name: String,
    val icon: String,
    val previewColor: Color
)

val AvailableThemes = listOf(
    ThemeOption("dark", "Ciemny (Grafit)", "🌙", Color(0xFF10B981)),
    ThemeOption("forest", "Las (Zieleń & Drzewa)", "🌲", Color(0xFF22C55E)),
    ThemeOption("ocean", "Ocean (Fale Błękitu)", "🌊", Color(0xFF38BDF8)),
    ThemeOption("emerald", "Szmaragd", "💎", Color(0xFF059669)),
    ThemeOption("amber", "Bursztyn (Złoty)", "✨", Color(0xFFF59E0B))
)

// 1. Ciemny (Dark)
private val DarkThemeColorScheme = darkColorScheme(
    primary = EmeraldPrimary,
    onPrimary = Color.White,
    secondary = Color(0xFF818CF8),
    background = Color(0xFF0B0F19),
    surface = Color(0xFF111827),
    surfaceVariant = Color(0xFF1F2937),
    onBackground = Color(0xFFF9FAFB),
    onSurface = Color(0xFFF9FAFB),
    onSurfaceVariant = Color(0xFF9CA3AF)
)

// 2. Las (Forest - drzewa, liście, naturalna zieleń)
private val ForestThemeColorScheme = darkColorScheme(
    primary = ForestGreen,
    onPrimary = Color.White,
    secondary = Color(0xFF86EFAC),
    background = Color(0xFF071811),
    surface = Color(0xFF0E2A1E),
    surfaceVariant = Color(0xFF173F2E),
    onBackground = Color(0xFFECFDF5),
    onSurface = Color(0xFFECFDF5),
    onSurfaceVariant = Color(0xFFA7F3D0)
)

// 3. Ocean (Błękit, morskie fale)
private val OceanThemeColorScheme = darkColorScheme(
    primary = OceanSky,
    onPrimary = Color(0xFF032642),
    secondary = OceanBlue,
    background = Color(0xFF051329),
    surface = Color(0xFF0D2344),
    surfaceVariant = Color(0xFF163766),
    onBackground = Color(0xFFF0F9FF),
    onSurface = Color(0xFFF0F9FF),
    onSurfaceVariant = Color(0xFFBAE6FD)
)

// 4. Szmaragd (Emerald)
private val EmeraldThemeColorScheme = darkColorScheme(
    primary = Color(0xFF34D399),
    onPrimary = Color(0xFF022C22),
    secondary = Color(0xFF6EE7B7),
    background = Color(0xFF02231B),
    surface = Color(0xFF063A2D),
    surfaceVariant = Color(0xFF0D5240),
    onBackground = Color(0xFFF2FBF7),
    onSurface = Color(0xFFF2FBF7),
    onSurfaceVariant = Color(0xFFA7F3D0)
)

// 5. Bursztyn (Amber - ciepłe złociste barwy)
private val AmberThemeColorScheme = darkColorScheme(
    primary = AmberGold,
    onPrimary = Color(0xFF451A03),
    secondary = Color(0xFFFBBF24),
    background = Color(0xFF17120E),
    surface = Color(0xFF261D17),
    surfaceVariant = Color(0xFF3B2E24),
    onBackground = Color(0xFFFFFBEB),
    onSurface = Color(0xFFFFFBEB),
    onSurfaceVariant = Color(0xFFFDE68A)
)

@Composable
fun AdonisTheme(
    themeName: String = "dark",
    content: @Composable () -> Unit
) {
    val colorScheme = when (themeName.lowercase()) {
        "forest", "las" -> ForestThemeColorScheme
        "ocean" -> OceanThemeColorScheme
        "emerald", "szmaragd" -> EmeraldThemeColorScheme
        "amber", "bursztyn" -> AmberThemeColorScheme
        else -> DarkThemeColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}

