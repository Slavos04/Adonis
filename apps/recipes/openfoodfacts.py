import httpx
from typing import List, Optional, Dict, Any
from django.conf import settings

LIDL_BRANDS = [
    'pilos', 'rzeźnik', 'rzeznlik', 'vemondo', 'crownfield', 'combino',
    'alesto', 'milbona', 'cien', 'pikok', 'fin carre', 'bellarom', 'freshona', 'lidl'
]

BIEDRONKA_BRANDS = [
    'delikate', 'mleczna dolina', 'kraina wędlin', 'kraina wedlin',
    'vitanella', 'tastino', 'culinea', 'marinero', 'plony natury',
    'biedronka', 'fruvita', 'smakowita pajda', 'bonte', 'nasze smaki'
]

KAUFLAND_BRANDS = [
    'k-classic', 'k-bio', 'k-purland', 'k-take it veggie', 'k-favourite', 'kaufland'
]

CARREFOUR_BRANDS = [
    'carrefour', 'carrefour classic', 'carrefour bio', 'carrefour extra', 'simpl'
]

def detect_store_and_brand(brands_str: str, stores_str: str = "") -> tuple[str, str]:
    """Detects whether product originates from Lidl, Biedronka, Kaufland, or Carrefour based on brands and store tags."""
    haystack = f"{brands_str} {stores_str}".lower()
    
    for b in LIDL_BRANDS:
        if b in haystack:
            return 'Lidl', brands_str.title()
            
    for b in BIEDRONKA_BRANDS:
        if b in haystack:
            return 'Biedronka', brands_str.title()

    for b in KAUFLAND_BRANDS:
        if b in haystack:
            return 'Kaufland', brands_str.title()

    for b in CARREFOUR_BRANDS:
        if b in haystack:
            return 'Carrefour', brands_str.title()
            
    return 'Ogolne', (brands_str or "Marka ogólna").title()

class OpenFoodFactsClient:
    """
    Asynchronous client for Open Food Facts API with filtering
    for Polish discount store products (Lidl & Biedronka).
    """
    def __init__(self, base_url: str = None, timeout: float = 10.0):
        self.base_url = (base_url or getattr(settings, 'OPEN_FOOD_FACTS_BASE_URL', 'https://world.openfoodfacts.org')).rstrip('/')
        self.headers = {
            'User-Agent': 'AdonisDietApp - Python/httpx - Version 1.0 (contact: support@adonis.app)'
        }
        self.timeout = timeout

    async def get_product_by_barcode(self, barcode: str) -> Optional[Dict[str, Any]]:
        """Fetches a single product by EAN barcode."""
        url = f"{self.base_url}/api/v2/product/{barcode}.json"
        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
                resp = await client.get(url)
                if resp.status_code != 200:
                    return None
                data = resp.json()
                if data.get('status') != 1:
                    return None
                
                raw = data.get('product', {})
                return self._parse_product(raw, fallback_barcode=barcode)
        except Exception:
            return None

    async def search_products(self, query: str, store_filter: Optional[str] = None, page_size: int = 20) -> List[Dict[str, Any]]:
        """
        Searches products in Open Food Facts with focus on Poland, Lidl and Biedronka.
        """
        url = f"{self.base_url}/cgi/search.pl"
        params = {
            'search_terms': query,
            'search_simple': 1,
            'action': 'process',
            'json': 1,
            'page_size': page_size,
            'countries_tags_en': 'poland'
        }
        
        try:
            async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
                resp = await client.get(url, params=params)
                if resp.status_code != 200:
                    return []
                
                data = resp.json()
                raw_products = data.get('products', [])
                results = []
                
                for item in raw_products:
                    parsed = self._parse_product(item)
                    if parsed:
                        if store_filter and parsed['store'].lower() != store_filter.lower():
                            continue
                        results.append(parsed)
                return results
        except Exception:
            return []

    def _parse_product(self, raw: dict, fallback_barcode: str = "") -> Optional[Dict[str, Any]]:
        name = raw.get('product_name_pl') or raw.get('product_name')
        if not name:
            return None

        barcode = raw.get('code') or fallback_barcode
        brands = raw.get('brands') or ""
        stores = raw.get('stores') or ""
        store, detected_brand = detect_store_and_brand(brands, stores)

        nutriments = raw.get('nutriments', {})
        kcal = nutriments.get('energy-kcal_100g') or nutriments.get('energy-kcal') or 0.0
        protein = nutriments.get('proteins_100g') or nutriments.get('proteins') or 0.0
        fat = nutriments.get('fat_100g') or nutriments.get('fat') or 0.0
        carbs = nutriments.get('carbohydrates_100g') or nutriments.get('carbohydrates') or 0.0

        return {
            "barcode": barcode,
            "name": name.strip(),
            "store": store,
            "brand": detected_brand,
            "calories_per_100g": round(float(kcal), 1),
            "protein_per_100g": round(float(protein), 1),
            "fat_per_100g": round(float(fat), 1),
            "carbs_per_100g": round(float(carbs), 1),
            "image_url": raw.get('image_front_url') or raw.get('image_url') or "",
            "source": "open_food_facts"
        }
