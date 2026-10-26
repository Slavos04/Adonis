// Utylity do dynamicznego zarządzania tłem, motywami i deseniami w Adonis

export const DEFAULT_THEMES = ['dark', 'light', 'ocean', 'forest'];

export const PATTERN_PRESETS = [
  { id: 'default', label: 'Domyślny motywu (duża grafika akcentowa w rogu)' },
  { id: 'dots', label: 'Subtelne kropki – powielane na całą stronę (Dots)' },
  { id: 'grid', label: 'Siatka techniczna – powielana na całą stronę (Grid)' },
  { id: 'leaves', label: 'Motyw liściasty – powielany na całą stronę (Leaves)' },
  { id: 'waves', label: 'Fale morskie – powielane na całą stronę (Waves)' },
  { id: 'honeycomb', label: 'Plaster miodu – powielany na całą stronę (Hexagons)' },
  { id: 'diagonal', label: 'Linie skośne – powielane na całą stronę (Diagonal)' },
  { id: 'none', label: 'Brak desenia (Gładkie tło)' },
];

export const PATTERN_CONFIG = {
  dots: {
    repeat: 'repeat',
    size: '24px 24px',
    pos: '0 0',
  },
  grid: {
    repeat: 'repeat',
    size: '36px 36px',
    pos: '0 0',
  },
  leaves: {
    repeat: 'repeat',
    size: '80px 80px',
    pos: '0 0',
  },
  waves: {
    repeat: 'repeat',
    size: '80px 40px',
    pos: '0 0',
  },
  honeycomb: {
    repeat: 'repeat',
    size: '56px 96px',
    pos: '0 0',
  },
  diagonal: {
    repeat: 'repeat',
    size: '20px 20px',
    pos: '0 0',
  },
  none: {
    repeat: 'no-repeat',
    size: 'auto',
    pos: 'center center',
  },
};

export const PATTERN_SVGS = {
  dots: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='1.5' fill='%2310b981' fill-opacity='0.28'/%3E%3C/svg%3E")`,
  grid: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cpath d='M 36 0 L 0 0 0 36' fill='none' stroke='%2310b981' stroke-width='0.9' stroke-opacity='0.22'/%3E%3C/svg%3E")`,
  leaves: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M20 15 C10 30, 25 45, 38 40 C42 28, 35 15, 20 15 Z' fill='%234ade80' fill-opacity='0.16' stroke='%234ade80' stroke-width='1.2' stroke-opacity='0.3'/%3E%3Cpath d='M20 17 Q 28 28, 36 38' stroke='%234ade80' stroke-width='0.9' stroke-opacity='0.3' fill='none'/%3E%3Cpath d='M60 55 C50 70, 65 85, 78 80 C82 68, 75 55, 60 55 Z' fill='%234ade80' fill-opacity='0.16' stroke='%234ade80' stroke-width='1.2' stroke-opacity='0.3'/%3E%3Cpath d='M60 57 Q 68 68, 76 78' stroke='%234ade80' stroke-width='0.9' stroke-opacity='0.3' fill='none'/%3E%3C/svg%3E")`,
  waves: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'%3E%3Cpath d='M0 20 Q 20 8, 40 20 T 80 20' fill='none' stroke='%2338bdf8' stroke-width='1.5' stroke-opacity='0.3'/%3E%3Cpath d='M0 38 Q 20 26, 40 38 T 80 38' fill='none' stroke='%2338bdf8' stroke-width='1.5' stroke-opacity='0.22' stroke-dasharray='4,4'/%3E%3C/svg%3E")`,
  honeycomb: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='96' viewBox='0 0 56 96'%3E%3Cpath d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 48 L56 64 L56 96 L28 112 L0 96 L0 64 Z' fill='none' stroke='%2310b981' stroke-width='1' stroke-opacity='0.22'/%3E%3C/svg%3E")`,
  diagonal: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cline x1='0' y1='20' x2='20' y2='0' stroke='%2310b981' stroke-width='1.2' stroke-opacity='0.2'/%3E%3C/svg%3E")`,
  none: 'none',
};

export const BACKGROUND_PRESETS = [
  {
    id: 'healthy_food',
    label: 'Świeże warzywa i zioła (Dietetyka)',
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'fitness_gym',
    label: 'Siłownia i trening siłowy',
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'forest_trail',
    label: 'Zimowy las / Spokojna natura',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 'ocean_blue',
    label: 'Głęboki błękit oceanu',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  },
];

// ─── ZARZĄDZANIE WŁASNYMI MOTYWAMI (ADMIN CUSTOM THEMES) ─────────────────────

export function getCustomThemes() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('adonis_custom_themes_list');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function saveCustomTheme(themeObj) {
  if (typeof window === 'undefined') return;
  const list = getCustomThemes();
  const existingIdx = list.findIndex(t => t.id === themeObj.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...themeObj };
  } else {
    list.push(themeObj);
  }
  localStorage.setItem('adonis_custom_themes_list', JSON.stringify(list));
  applyCustomThemeSettings();
  window.dispatchEvent(new Event('adonis_themes_changed'));
}

export function deleteCustomTheme(themeId) {
  if (typeof window === 'undefined') return;
  const list = getCustomThemes().filter(t => t.id !== themeId);
  localStorage.setItem('adonis_custom_themes_list', JSON.stringify(list));
  
  // Jeśli usunięty motyw był aktywny, przełącz na 'dark'
  if (localStorage.getItem('adonis_theme') === themeId) {
    localStorage.setItem('adonis_theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  applyCustomThemeSettings();
  window.dispatchEvent(new Event('adonis_themes_changed'));
}

export function getAllThemes() {
  const custom = getCustomThemes().map(t => t.id);
  return [...DEFAULT_THEMES, ...custom];
}

export function getAllThemeDetails() {
  const defaults = [
    { id: 'dark', label: 'Ciemny (Grafit & Szmaragd)', color: '#10b981', bg: '#0b0f19', isCustom: false },
    { id: 'light', label: 'Jasny (Czysta Biel)', color: '#059669', bg: '#ffffff', isCustom: false },
    { id: 'ocean', label: 'Ocean (Głęboki Błękit)', color: '#38bdf8', bg: '#06101e', isCustom: false },
    { id: 'forest', label: 'Las (Ciemna Zieleń)', color: '#4ade80', bg: '#0a1208', isCustom: false },
  ];
  const custom = getCustomThemes().map(t => ({
    id: t.id,
    label: t.name,
    color: t.accentColor || '#a855f7',
    bg: t.bgPrimary || '#0d0d12',
    isCustom: true,
    ...t,
  }));
  return [...defaults, ...custom];
}

// ─── APLIKOWANIE USTAWIEŃ W DOM ──────────────────────────────────────────────

export function applyCustomThemeSettings() {
  if (typeof window === 'undefined') return;

  const currentTheme = localStorage.getItem('adonis_theme') || document.documentElement.getAttribute('data-theme') || 'dark';
  const customThemes = getCustomThemes();
  const customTheme = customThemes.find(t => t.id === currentTheme);

  // 1. Obsługa dynamicznego arkusza stylów dla własnych motywów
  let styleEl = document.getElementById('adonis-custom-theme-style');
  if (customTheme) {
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'adonis-custom-theme-style';
      document.head.appendChild(styleEl);
    }
    const accent = customTheme.accentColor || '#a855f7';
    const bgPrim = customTheme.bgPrimary || '#0d0b16';
    const bgSec = customTheme.bgSecondary || '#161226';
    const bgCard = customTheme.bgCard || 'rgba(23, 18, 41, 0.78)';
    const textMain = customTheme.textColor || '#f8fafc';
    const borderCol = customTheme.borderColor || 'rgba(255, 255, 255, 0.14)';

    styleEl.innerHTML = `
      [data-theme="${customTheme.id}"] {
        --bg-primary: ${bgPrim};
        --bg-secondary: ${bgSec};
        --bg-card: ${bgCard};
        --text-main: ${textMain};
        --text-base: ${textMain};
        --accent-emerald: ${accent};
        --accent-emerald-glow: ${accent}33;
        --border-active: ${accent};
        --border-subtle: ${borderCol};
        --body-gradient-a: ${accent}28;
        --body-gradient-b: ${accent}14;
      }
    `;
  } else if (styleEl) {
    styleEl.innerHTML = '';
  }

  // 2. Globalne tło graficzne (URL/plik), przyciemnienie i rozmycie
  const bgImg = localStorage.getItem('adonis_custom_bg_image') || (customTheme?.bgImage || '');
  const overlay = localStorage.getItem('adonis_custom_bg_overlay') || (customTheme?.overlay?.toString() || '0.55');
  const blur = localStorage.getItem('adonis_custom_bg_blur') || (customTheme?.blur?.toString() || '0');
  const pattern = localStorage.getItem('adonis_custom_pattern') || (customTheme?.pattern || 'default');

  const root = document.documentElement;

  if (bgImg) {
    root.style.setProperty('--custom-bg-image', `url("${bgImg}")`);
    root.style.setProperty('--custom-bg-overlay', `rgba(0, 0, 0, ${overlay})`);
    root.style.setProperty('--custom-bg-blur', `${blur}px`);
  } else {
    root.style.removeProperty('--custom-bg-image');
    root.style.removeProperty('--custom-bg-overlay');
    root.style.removeProperty('--custom-bg-blur');
  }

  // 3. Deseń tła
  if (pattern !== 'default' && PATTERN_SVGS[pattern]) {
    root.style.setProperty('--theme-pattern', PATTERN_SVGS[pattern]);
    const cfg = PATTERN_CONFIG[pattern];
    if (cfg) {
      root.style.setProperty('--theme-pattern-repeat', cfg.repeat);
      root.style.setProperty('--theme-pattern-size', cfg.size);
      root.style.setProperty('--theme-pattern-pos', cfg.pos);
    } else {
      root.style.setProperty('--theme-pattern-repeat', 'repeat');
      root.style.setProperty('--theme-pattern-size', 'auto');
      root.style.setProperty('--theme-pattern-pos', '0 0');
    }
  } else {
    root.style.removeProperty('--theme-pattern');
    root.style.removeProperty('--theme-pattern-repeat');
    root.style.removeProperty('--theme-pattern-size');
    root.style.removeProperty('--theme-pattern-pos');
  }
}

export function saveCustomThemeSettings({ bgImage, overlay, blur, pattern }) {
  if (bgImage != null) localStorage.setItem('adonis_custom_bg_image', bgImage);
  if (overlay != null) localStorage.setItem('adonis_custom_bg_overlay', overlay.toString());
  if (blur != null) localStorage.setItem('adonis_custom_bg_blur', blur.toString());
  if (pattern != null) localStorage.setItem('adonis_custom_pattern', pattern);
  applyCustomThemeSettings();
}

export function resetCustomThemeSettings() {
  localStorage.removeItem('adonis_custom_bg_image');
  localStorage.removeItem('adonis_custom_bg_overlay');
  localStorage.removeItem('adonis_custom_bg_blur');
  localStorage.removeItem('adonis_custom_pattern');
  applyCustomThemeSettings();
}
