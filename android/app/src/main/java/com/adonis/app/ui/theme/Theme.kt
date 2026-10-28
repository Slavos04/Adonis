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

data class ThemeOption(
    val id: String,
    val name: String,
    val icon: String,
    val previewColor: Color
)

// Dokładnie 4 motywy zgodne z aplikacją webową: ciemny, jasny, ocean, las
val AvailableThemes = listOf(
    ThemeOption("dark", "Ciemny", "🌙", Color(0xFF111827)),
    ThemeOption("light", "Jasny", "☀️", Color(0xFFF3F4F6)),
    ThemeOption("ocean", "Ocean", "🌊", Color(0xFF0284C7)),
    ThemeOption("forest", "Las", "🌲", Color(0xFF22C55E))
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

// 2. Jasny (Light)
private val LightThemeColorScheme = lightColorScheme(
    primary = EmeraldPrimary,
    onPrimary = Color.White,
    secondary = Color(0xFF4F46E5),
    background = Color(0xFFF9FAFB),
    surface = Color(0xFFFFFFFF),
    surfaceVariant = Color(0xFFE5E7EB),
    onBackground = Color(0xFF111827),
    onSurface = Color(0xFF111827),
    onSurfaceVariant = Color(0xFF4B5563)
)

// 3. Ocean (Błękit, fale oceanu)
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

// 4. Las (Forest - drzewa, liście, zieleń)
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

@Composable
fun AdonisTheme(
    themeName: String = "dark",
    content: @Composable () -> Unit
) {
    val colorScheme = when (themeName.lowercase()) {
        "light", "jasny" -> LightThemeColorScheme
        "ocean" -> OceanThemeColorScheme
        "forest", "las" -> ForestThemeColorScheme
        "dark", "ciemny" -> DarkThemeColorScheme
        else -> DarkThemeColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
