package com.adonis.app.util

import kotlin.math.roundToInt

object KitchenMeasureHelper {

    /**
     * Zwraca tekst miary kuchennej. Jeśli dostarczono już niepustą miarę z backendu, zwraca ją.
     * W przeciwnym razie oblicza ją automatycznie na podstawie nazwy produktu i gramatury.
     */
    fun getMeasureText(productName: String?, amountG: Double?, existingMeasure: String? = null): String {
        if (!existingMeasure.isNullOrBlank()) {
            return shortenMeasure(existingMeasure.trim())
        }
        if (productName.isNullOrBlank() || amountG == null || amountG <= 0.0) {
            return ""
        }
        return format(productName, amountG)
    }

    private fun formatNumber(value: Double): String {
        val rounded = (value * 10.0).roundToInt() / 10.0
        return if (rounded % 1.0 == 0.0) rounded.toInt().toString() else rounded.toString()
    }

    /**
     * Skraca rozbudowane napisy miar (np. usuwa nawiasy z gramaturą), aby zmieściły się w jednej linii.
     */
    fun shortenMeasure(measure: String): String {
        return measure
            .replace(" (ok. 1/2 opakowania)", "")
            .replace(" (1/2 szklanki)", "")
            .replace(" (2 łyżki)", "")
            .replace(" (125g)", "")
            .replace(" (150g)", "")
            .replace(" (200g)", "")
            .replace(" (400g)", "")
            .replace(" (50g)", "")
            .replace(" (100g)", "")
            .replace(" / porcja", "")
            .replace(" / butelki", "")
            .replace("ok. ", "")
            .trim()
    }

    /**
     * Konwertuje gramaturę produktu na polską miarę kuchenną (zwięzłe etykiety).
     */
    fun format(productName: String, amountG: Double): String {
        val name = productName.lowercase()
        val amt = amountG

        // 1. Oliwa / oleje (1 łyżka = 10g, 1 łyżeczka = 5g)
        if (name.contains("oliwa") || name.contains("olej")) {
            if (amt < 8.0) {
                val tsp = (amt / 5.0 * 10.0).roundToInt() / 10.0
                return if (tsp <= 1.0) "1 łyżeczka" else "${formatNumber(tsp)} łyżeczki"
            }
            val tbsp = (amt / 10.0 * 10.0).roundToInt() / 10.0
            return when {
                tbsp <= 1.0 -> "1 łyżka"
                tbsp in 2.0..4.0 -> "${formatNumber(tbsp)} łyżki"
                else -> "${formatNumber(tbsp)} łyżek"
            }
        }

        // 2. Miód, nasiona chia, siemię, cynamon, kakao, sezam (1 łyżeczka = 5g, 1 łyżka = 12-15g)
        if (listOf("miód", "chia", "siemię", "cynamon", "kakao", "cukier", "sezam").any { name.contains(it) }) {
            if (amt >= 15.0) {
                val tbsp = (amt / 12.0 * 10.0).roundToInt() / 10.0
                return if (tbsp in 2.0..4.0) "${formatNumber(tbsp)} łyżki" else "${formatNumber(tbsp)} łyżek"
            }
            val tsp = (amt / 5.0 * 10.0).roundToInt() / 10.0
            return when {
                tsp <= 1.0 -> "1 łyżeczka"
                tsp in 2.0..4.0 -> "${formatNumber(tsp)} łyżeczki"
                else -> "${formatNumber(tsp)} łyżeczek"
            }
        }

        // 3. Masło orzechowe / masło (1 łyżka = 15g, 1 łyżeczka = 5g)
        if (name.contains("masło")) {
            if (amt < 12.0) return "1 łyżeczka"
            val tbsp = (amt / 15.0 * 10.0).roundToInt() / 10.0
            return if (tbsp <= 1.0) "1 łyżka" else "${formatNumber(tbsp)} łyżki"
        }

        // 4. Płatki, kasze, ryż, mąka, makaron (1 łyżka = 10g, 1 szklanka = 100g)
        if (listOf("płatki", "kasza", "ryż", "mąka", "manna", "jaglan", "makaron", "otręby").any { name.contains(it) }) {
            if (amt >= 90.0) {
                val cups = (amt / 100.0 * 10.0).roundToInt() / 10.0
                return if (cups in 0.9..1.1) "1 szklanka" else "${formatNumber(cups)} szklanki"
            }
            val tbsp = (amt / 10.0 * 10.0).roundToInt() / 10.0
            return if (tbsp >= 5.0 || tbsp <= 0.5) "${formatNumber(tbsp)} łyżek" else "${formatNumber(tbsp)} łyżki"
        }

        // 5. Płyny: mleko, napój roślinny, kefir, maślanka, woda, bulion (1 szklanka = 250ml)
        if (listOf("mleko", "kefir", "maślanka", "bulion", "woda", "napój").any { name.contains(it) }) {
            if (amt >= 180.0) {
                val cups = (amt / 250.0 * 10.0).roundToInt() / 10.0
                return when {
                    cups in 0.9..1.1 -> "1 szklanka"
                    cups in 0.4..0.6 -> "1/2 szklanki"
                    cups in 0.7..0.85 -> "3/4 szklanki"
                    else -> "${formatNumber(cups)} szklanki"
                }
            }
            val tbsp = (amt / 15.0).roundToInt()
            return "$tbsp łyżek"
        }

        // 6. Jogurt, skyr, serek (1 kubek = 150g, 1 łyżka = 25g)
        if (listOf("jogurt", "skyr", "serek wiejski", "ricotta").any { name.contains(it) }) {
            if (amt in 130.0..165.0) return "1 kubek"
            if (amt in 190.0..220.0) return "1 opak."
            val tbsp = (amt / 25.0 * 10.0).roundToInt() / 10.0
            return if (tbsp in 2.0..4.0) "${formatNumber(tbsp)} łyżki" else "${formatNumber(tbsp)} łyżek"
        }

        // 7. Twaróg (1/2 kostki = 100g, 1 kostka = 200g, 1 plaster = 50g)
        if (name.contains("twaróg")) {
            if (amt in 90.0..115.0) return "1/2 kostki"
            if (amt in 190.0..220.0) return "1 kostka"
            val slices = (amt / 50.0).roundToInt()
            return if (slices > 1) "$slices plastry" else "1 plaster"
        }

        // 8. Warzywa liściaste (szpinak, rukola, roszponka, sałata, jarmuż)
        if (listOf("szpinak", "rukol", "roszponk", "sałat", "jarmuż").any { name.contains(it) }) {
            return when {
                amt <= 35.0 -> "1 garść"
                amt <= 70.0 -> "2 garście"
                amt <= 130.0 -> "1 opak."
                else -> "${formatNumber(amt / 50.0)} garści"
            }
        }

        // 9. Orzechy, migdały, pestki (1 garść = 30g, 1 łyżka = 15g)
        if (listOf("orzech", "migdał", "pestki", "słonecznik", "nerkowce").any { name.contains(it) }) {
            if (amt in 20.0..35.0) return "1 garść"
            if (amt < 20.0) return "1 łyżka"
            return "${formatNumber(amt / 30.0)} garści"
        }

        // 10. Owoce jagodowe (borówki, jagody, maliny, truskawki)
        if (listOf("borówk", "jagod", "malin", "truskawk").any { name.contains(it) }) {
            return when {
                amt <= 40.0 -> "1 garść"
                amt <= 80.0 -> "2 garście"
                else -> "1 szklanka"
            }
        }

        // 11. Chleb, pieczywo (1 kromka = 35g, 1 bułka = 70g)
        if (listOf("chleb", "bułka", "pieczywo", "grahamk", "tost").any { name.contains(it) }) {
            if (name.contains("bułka") || name.contains("grahamk")) {
                val pcs = (amt / 70.0 * 10.0).roundToInt() / 10.0
                return if (pcs in 0.8..1.2) "1 sztuka" else "${formatNumber(pcs)} szt."
            }
            val slices = (amt / 35.0).roundToInt()
            return when {
                slices == 1 -> "1 kromka"
                slices in 2..4 -> "$slices kromki"
                else -> "$slices kromek"
            }
        }

        // 12. Ryby (łosoś, dorsz, tuńczyk itp.)
        if (listOf("łosoś", "dorsz", "mintaj", "pstrąg", "ryb", "makrel", "tuńczyk").any { name.contains(it) }) {
            if (name.contains("tuńczyk")) {
                if (amt in 100.0..140.0) return "1 puszka"
                return "${formatNumber(amt / 120.0)} puszki"
            }
            if (amt in 110.0..165.0) return "1 filet"
            if (amt in 60.0..90.0) return "1/2 fileta"
            return "${formatNumber(amt / 130.0)} fileta"
        }

        // 13. Mięso i drób (kurczak, indyk, schab, wołowina)
        if (listOf("kurczak", "indyk", "pierś", "schab", "wołowin", "mięso").any { name.contains(it) }) {
            if (amt in 100.0..150.0) return "1 pierś"
            if (amt in 160.0..220.0) return "1 filet"
            if (amt in 40.0..80.0) return "1/2 fileta"
            return "${formatNumber(amt / 120.0)} porcji"
        }

        // 14. Wędliny (1 plaster = 20g)
        if (listOf("szynka", "polędwica", "łosoś wędzony").any { name.contains(it) }) {
            val slices = (amt / 20.0).roundToInt()
            return when {
                slices == 1 -> "1 plaster"
                slices in 2..4 -> "$slices plastry"
                else -> "$slices plastrów"
            }
        }

        // 15. Jajka (1 szt = 55g)
        if (name.contains("jaj")) {
            val pcs = (amt / 55.0).roundToInt()
            return when {
                pcs <= 1 -> "1 sztuka"
                pcs in 2..4 -> "$pcs sztuki"
                else -> "$pcs sztuk"
            }
        }

        // 16. Ziemniaki i bataty
        if (name.contains("batat")) {
            val pcs = (amt / 160.0 * 10.0).roundToInt() / 10.0
            return if (pcs in 0.8..1.2) "1 batat" else if (pcs in 0.4..0.6) "1/2 batata" else "${formatNumber(pcs)} szt."
        }
        if (name.contains("ziemniak")) {
            val pcs = (amt / 85.0).roundToInt()
            return when {
                pcs <= 1 -> "1 sztuka"
                pcs in 2..4 -> "$pcs sztuki"
                else -> "$pcs sztuk"
            }
        }

        // 17. Owoce / warzywa sztukowe
        if (listOf("banan", "jabłko", "pomidor", "gruszka", "pomarańcza", "brzoskwinia").any { name.contains(it) }) {
            val pcs = (amt / 130.0 * 10.0).roundToInt() / 10.0
            return if (pcs in 0.8..1.2) "1 sztuka" else if (pcs in 0.4..0.6) "1/2 sztuki" else "${formatNumber(pcs)} szt."
        }

        if (name.contains("cebul")) {
            val pcs = (amt / 100.0 * 10.0).roundToInt() / 10.0
            return if (pcs in 0.8..1.2) "1 sztuka" else if (pcs in 0.4..0.6) "1/2 sztuki" else "${formatNumber(pcs)} szt."
        }

        if (name.contains("ogórek") || name.contains("marchew") || name.contains("cukinia")) {
            if (amt < 50.0) return "kawałek"
            val pcs = (amt / 100.0 * 10.0).roundToInt() / 10.0
            return if (pcs in 0.8..1.2) "1 sztuka" else if (pcs in 0.4..0.6) "1/2 sztuki" else "${formatNumber(pcs)} szt."
        }

        if (name.contains("czosnek")) {
            val cloves = (amt / 5.0).roundToInt()
            return if (cloves <= 1) "1 ząbek" else "$cloves ząbki"
        }

        // 18. Sery (mozzarella, feta, ser żółty)
        if (name.contains("mozzarella")) {
            if (amt in 110.0..135.0) return "1 kulka"
            if (amt in 50.0..70.0) return "1/2 kulki"
        }
        if (name.contains("feta")) {
            if (amt in 40.0..60.0) return "1/4 kostki"
            if (amt in 90.0..115.0) return "1/2 kostki"
        }
        if (listOf("ser żółty", "gouda", "cheddar", "edam").any { name.contains(it) }) {
            val slices = (amt / 25.0).roundToInt()
            return when {
                slices <= 1 -> "1 plaster"
                slices in 2..4 -> "$slices plastry"
                else -> "$slices plastrów"
            }
        }

        // 19. Sosy, passata, musztarda, majonez
        if (listOf("passata", "przecier pomidorowy", "pomidory w puszce").any { name.contains(it) }) {
            if (amt in 180.0..220.0) return "1/2 puszki"
            if (amt in 380.0..420.0) return "1 puszka"
            val tbsp = (amt / 20.0).roundToInt()
            return "$tbsp łyżek"
        }
        if (listOf("musztard", "chrzan", "majonez", "ketchup", "sos sojowy", "ocet").any { name.contains(it) }) {
            if (amt <= 8.0) return "1 łyżeczka"
            val tbsp = (amt / 15.0).roundToInt()
            return if (tbsp <= 1) "1 łyżka" else "$tbsp łyżki"
        }

        // 20. Przyprawy i zioła
        if (listOf("sól", "pieprz", "oregano", "bazylia", "papryka słodka", "papryka ostra", "kurkuma", "zioła").any { name.contains(it) }) {
            return if (amt <= 3.0) "1 szczypta" else "1 łyżeczka"
        }

        return ""
    }
}
