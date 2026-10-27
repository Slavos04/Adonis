import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShieldAlert, Users, BookOpen, Package, Trash2, UserPlus,
  RefreshCw, AlertTriangle, CheckCircle, XCircle, Edit3,
  Search, Eye, EyeOff, X, Plus, Eraser, ShoppingBag,
  Palette, Image, Upload, Sliders, Sparkles, Check, ArrowUpDown
} from 'lucide-react';
import { adminApi, recipesApi, dietPlansApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  PATTERN_PRESETS,
  BACKGROUND_PRESETS,
  saveCustomThemeSettings,
  resetCustomThemeSettings,
  getCustomThemes,
  saveCustomTheme,
  deleteCustomTheme,
  getAllThemeDetails,
} from '../utils/themeCustomizer';

// ─── UTILITIES ────────────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  const map = {
    admin: { label: 'Admin', color: 'var(--accent-rose)', bg: 'rgba(244,63,94,0.12)' },
    dietitian: { label: 'Dietetyk', color: 'var(--accent-indigo)', bg: 'rgba(99,102,241,0.12)' },
    patient: { label: 'Pacjent', color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.12)' },
  };
  const s = map[role] || map.patient;
  return (
    <span style={{ background: s.bg, color: s.color, padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {s.label}
    </span>
  );
}

function StatusBadge({ active }) {
  return active
    ? <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem' }}>✅ Aktywne</span>
    : <span style={{ color: 'var(--accent-rose)', fontSize: '0.8rem' }}>🚫 Zablokowane</span>;
}

function SectionCard({ icon, title, children, action }) {
  return (
    <div className="admin-section glass-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {icon} {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function SortableTh({ colKey, label, currentSort, onSort, style = {} }) {
  const isActive = currentSort?.key === colKey;
  return (
    <th
      onClick={() => onSort(colKey)}
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'background 0.15s, color 0.15s',
        ...style,
      }}
      title={`Kliknij, aby posortować po: ${label}`}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        <span>{label}</span>
        <span style={{ fontSize: '0.72rem', color: isActive ? 'var(--accent-emerald)' : 'var(--text-dim)', opacity: isActive ? 1 : 0.4 }}>
          {isActive ? (currentSort.direction === 'asc' ? '▲' : '▼') : '↕'}
        </span>
      </div>
    </th>
  );
}

function sortData(list, key, direction) {
  if (!key || !list) return list;
  return [...list].sort((a, b) => {
    let valA = a[key];
    let valB = b[key];
    if (key === 'fullName') {
      valA = `${a.first_name || ''} ${a.last_name || ''}`.trim().toLowerCase();
      valB = `${b.first_name || ''} ${b.last_name || ''}`.trim().toLowerCase();
    } else if (typeof valA === 'string') {
      valA = (valA || '').toLowerCase();
      valB = (valB || '').toLowerCase();
    } else if (typeof valA === 'number' || typeof valB === 'number') {
      valA = Number(valA) || 0;
      valB = Number(valB) || 0;
    }
    if (valA == null) return 1;
    if (valB == null) return -1;
    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// ─── CREATE USER MODAL ────────────────────────────────────────────────────────

function CreateUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminApi.createUser(form);
      onSuccess('Konto zostało utworzone!');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Utwórz nowe konto</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {error && <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Imię</label>
              <input className="form-input" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="Jan" />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Nazwisko</label>
              <input className="form-input" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Kowalski" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>E-mail *</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Hasło *</label>
            <input className="form-input" type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="min. 8 znaków" />
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Rola</label>
            <select className="form-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
              <option value="patient">Pacjent</option>
              <option value="dietitian">Dietetyk</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Tworzenie...' : 'Utwórz konto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── CREATE PRODUCT MODAL ─────────────────────────────────────────────────────

function CreateProductModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', store: 'Lidl', brand: '', barcode: '',
    calories_per_100g: 100, protein_per_100g: 10, fat_per_100g: 2, carbs_per_100g: 15,
    unit: 'g', category: 'Nabiał'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await recipesApi.createProduct(form);
      onSuccess(`Produkt "${form.name}" został pomyślnie dodany do bazy.`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Dodaj nowy produkt do bazy</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {error && <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Nazwa produktu*</label>
            <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="np. Serek Wiejski lekki" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Sklep</label>
              <select className="form-input" value={form.store} onChange={e => setForm(f => ({ ...f, store: e.target.value }))}>
                <option value="Lidl">Lidl</option>
                <option value="Biedronka">Biedronka</option>
                <option value="Kaufland">Kaufland</option>
                <option value="Carrefour">Carrefour</option>
                <option value="Ogolne">Ogólne / Inny</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Kategoria</label>
              <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="Nabiał">Nabiał</option>
                <option value="Mięso i ryby">Mięso i ryby</option>
                <option value="Pieczywo i zboża">Pieczywo i zboża</option>
                <option value="Warzywa">Warzywa</option>
                <option value="Owoce">Owoce</option>
                <option value="Przekąski">Przekąski</option>
                <option value="Napoje">Napoje</option>
                <option value="Inne">Inne</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Marka</label>
              <input className="form-input" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="np. Pilos" />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Kod kreskowy (opcjonalny)</label>
              <input className="form-input" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="EAN 13 cyfr" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Kcal/100g*</label>
              <input type="number" step="0.1" required className="form-input" value={form.calories_per_100g} onChange={e => setForm(f => ({ ...f, calories_per_100g: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Białko (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.protein_per_100g} onChange={e => setForm(f => ({ ...f, protein_per_100g: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tłuszcz (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.fat_per_100g} onChange={e => setForm(f => ({ ...f, fat_per_100g: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Węgle (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.carbs_per_100g} onChange={e => setForm(f => ({ ...f, carbs_per_100g: parseFloat(e.target.value) || 0 }))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Zapisuję...' : 'Dodaj produkt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── EDIT PRODUCT MODAL ───────────────────────────────────────────────────────

function EditProductModal({ product, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: product.name || '',
    store: product.store || 'Lidl',
    brand: product.brand || '',
    barcode: product.barcode || '',
    calories_per_100g: product.calories_per_100g ?? 100,
    protein_per_100g: product.protein_per_100g ?? 10,
    fat_per_100g: product.fat_per_100g ?? 2,
    carbs_per_100g: product.carbs_per_100g ?? 15,
    unit: product.unit || 'g',
    category: product.category || 'Nabiał',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await recipesApi.updateProduct(product.id, {
        name: form.name,
        store: form.store,
        brand: form.brand,
        barcode: form.barcode || null,
        calories_per_100g: parseFloat(form.calories_per_100g) || 0,
        protein_per_100g: parseFloat(form.protein_per_100g) || 0,
        fat_per_100g: parseFloat(form.fat_per_100g) || 0,
        carbs_per_100g: parseFloat(form.carbs_per_100g) || 0,
        unit: form.unit,
        category: form.category,
      });
      onSuccess(`Produkt "${form.name}" został zaktualizowany!`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} color="var(--accent-emerald)" /> Edycja produktu: #{product.id}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Nazwa produktu*</label>
            <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Sklep</label>
              <select className="form-input" value={form.store} onChange={e => setForm(f => ({ ...f, store: e.target.value }))}>
                <option value="Lidl">Lidl</option>
                <option value="Biedronka">Biedronka</option>
                <option value="Kaufland">Kaufland</option>
                <option value="Carrefour">Carrefour</option>
                <option value="Ogolne">Ogólne / Inny</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Kategoria</label>
              <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="Nabiał">Nabiał</option>
                <option value="Mięso i ryby">Mięso i ryby</option>
                <option value="Pieczywo i zboża">Pieczywo i zboża</option>
                <option value="Warzywa">Warzywa</option>
                <option value="Owoce">Owoce</option>
                <option value="Przekąski">Przekąski</option>
                <option value="Napoje">Napoje</option>
                <option value="Inne">Inne</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Marka</label>
              <input className="form-input" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Kod kreskowy</label>
              <input className="form-input" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Kcal/100g*</label>
              <input type="number" step="0.1" required className="form-input" value={form.calories_per_100g} onChange={e => setForm(f => ({ ...f, calories_per_100g: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Białko (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.protein_per_100g} onChange={e => setForm(f => ({ ...f, protein_per_100g: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tłuszcz (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.fat_per_100g} onChange={e => setForm(f => ({ ...f, fat_per_100g: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Węgle (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.carbs_per_100g} onChange={e => setForm(f => ({ ...f, carbs_per_100g: e.target.value }))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Zapisuję...' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── CREATE RECIPE MODAL ──────────────────────────────────────────────────────

function CreateRecipeModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', category: 'Obiad', preparation_time_minutes: 20, default_portions: 1.0,
    instructions: '', image_url: '', calories: 450, protein_g: 35, fat_g: 12, carbs_g: 50
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await recipesApi.create({
        title: form.title,
        category: form.category,
        preparation_time_minutes: parseInt(form.preparation_time_minutes),
        default_portions: parseFloat(form.default_portions),
        instructions: form.instructions || 'Brak opisu przygotowania.',
        image_url: form.image_url || undefined,
        calories: parseFloat(form.calories),
        protein_g: parseFloat(form.protein_g),
        fat_g: parseFloat(form.fat_g),
        carbs_g: parseFloat(form.carbs_g),
        ingredients: []
      });
      onSuccess(`Przepis "${form.title}" został pomyślnie dodany.`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Dodaj nowy przepis do bazy</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {error && <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Tytuł dania*</label>
            <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="np. Bowl z kurczakiem i awokado" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Kategoria</label>
              <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="Śniadanie">Śniadanie</option>
                <option value="Drugie śniadanie">Drugie śniadanie</option>
                <option value="Obiad">Obiad</option>
                <option value="Kolacja">Kolacja</option>
                <option value="Przekąska">Przekąska</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Czas (min)</label>
              <input type="number" className="form-input" value={form.preparation_time_minutes} onChange={e => setForm(f => ({ ...f, preparation_time_minutes: parseInt(e.target.value) || 15 }))} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Kalorie*</label>
              <input type="number" required className="form-input" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Białko (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.protein_g} onChange={e => setForm(f => ({ ...f, protein_g: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Tłuszcz (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.fat_g} onChange={e => setForm(f => ({ ...f, fat_g: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Węgle (g)*</label>
              <input type="number" step="0.1" required className="form-input" value={form.carbs_g} onChange={e => setForm(f => ({ ...f, carbs_g: parseFloat(e.target.value) || 0 }))} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>URL Zdjęcia dania (opcjonalnie)</label>
            <input className="form-input" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Sposób przygotowania</label>
            <textarea className="form-input" rows={3} value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} placeholder="Kroki przygotowania dania..." />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Zapisuję...' : 'Dodaj przepis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── ASSIGN DIETITIAN MODAL ───────────────────────────────────────────────────

function AssignDietitianModal({ patients, dietitians, onClose, onSuccess }) {
  const [patientId, setPatientId] = useState('');
  const [dietitianId, setDietitianId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!patientId || !dietitianId) return;
    setLoading(true);
    setError('');
    try {
      await adminApi.assignDietitian(patientId, dietitianId);
      onSuccess('Dietetyk został pomyślnie przypisany do pacjenta!');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Przypisz dietetyka do pacjenta</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>

        {error && <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Pacjent</label>
            <select className="form-input" value={patientId} onChange={e => setPatientId(e.target.value)} required>
              <option value="">Wybierz pacjenta...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.email})</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Dietetyk</label>
            <select className="form-input" value={dietitianId} onChange={e => setDietitianId(e.target.value)} required>
              <option value="">Wybierz dietetyka...</option>
              {dietitians.map(d => <option key={d.id} value={d.id}>{d.first_name} {d.last_name} ({d.email})</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>{loading ? 'Przypisuję...' : 'Przypisz'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── EDIT USER MODAL ──────────────────────────────────────────────────────────

function EditUserModal({ user, dietitians, onClose, onSuccess }) {
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    role: user.role || 'patient',
    is_active: user.is_active !== false,
    assigned_dietitian_id: user.assigned_dietitian_id || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        role: form.role,
        is_active: form.is_active,
        assigned_dietitian_id: form.role === 'patient' ? (parseInt(form.assigned_dietitian_id) || -1) : null,
      };
      if (form.password && form.password.trim().length >= 6) {
        payload.password = form.password.trim();
      }
      await adminApi.updateUser(user.id, payload);
      onSuccess(`Konto ${form.email} zostało pomyślnie zaktualizowane!`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} color="var(--accent-emerald)" /> Edycja Użytkownika #{user.id}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Imię</label>
              <input className="form-input" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} required />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Nazwisko</label>
              <input className="form-input" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>E-mail logowania *</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Rola w systemie</label>
              <select className="form-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="patient">Pacjent</option>
                <option value="dietitian">Dietetyk</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Status Konta</label>
              <select className="form-input" value={form.is_active ? 'active' : 'inactive'} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'active' }))}>
                <option value="active">✅ Aktywne (Dozwolone)</option>
                <option value="inactive">🚫 Zablokowane</option>
              </select>
            </div>
          </div>

          {form.role === 'patient' && (
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Przypisany Dietetyk Prowadzący</label>
              <select className="form-input" value={form.assigned_dietitian_id} onChange={e => setForm(f => ({ ...f, assigned_dietitian_id: e.target.value }))}>
                <option value="">-- Brak przypisanego dietetyka --</option>
                {dietitians.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.first_name} {d.last_name} ({d.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Zresetuj Hasło (pozostaw puste, aby nie zmieniać):
            </label>
            <input className="form-input" type="password" placeholder="Opcjonalne nowe hasło (min. 6 znaków)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Zapisuję...' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── EDIT RECIPE MODAL ────────────────────────────────────────────────────────

function EditRecipeModal({ recipe, products, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: recipe.title || '',
    category: recipe.category || 'Obiad',
    preparation_time_minutes: recipe.preparation_time_minutes || 20,
    default_portions: recipe.default_portions || 1.0,
    instructions: recipe.instructions || '',
    image_url: recipe.image_url || '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFull() {
      try {
        const full = await recipesApi.get(recipe.id);
        setForm({
          title: full.title || '',
          category: full.category || 'Obiad',
          preparation_time_minutes: full.preparation_time_minutes || 20,
          default_portions: full.default_portions || 1.0,
          instructions: full.instructions || '',
          image_url: full.image_url || '',
        });
        const ings = (full.ingredients || []).map(i => ({
          product_id: i.product?.id || i.product_id,
          amount_g: i.amount_g,
          unit: i.unit || 'g',
        }));
        setIngredients(ings);
      } catch (_) {
        if (recipe.ingredients) {
          setIngredients(recipe.ingredients.map(i => ({
            product_id: i.product?.id || i.product_id,
            amount_g: i.amount_g,
            unit: i.unit || 'g',
          })));
        }
      }
    }
    loadFull();
  }, [recipe.id]);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = await recipesApi.uploadImage(file);
      setForm(f => ({ ...f, image_url: data.image_url }));
    } catch (err) {
      alert(`Błąd uploadu zdjęcia: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await recipesApi.update(recipe.id, {
        title: form.title,
        category: form.category,
        preparation_time_minutes: parseInt(form.preparation_time_minutes),
        default_portions: parseFloat(form.default_portions),
        instructions: form.instructions,
        image_url: form.image_url,
        ingredients: ingredients.map(i => ({
          product_id: parseInt(i.product_id),
          amount_g: parseFloat(i.amount_g) || 0,
        })),
      });
      onSuccess(`Przepis "${form.title}" został pomyślnie zaktualizowany!`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} color="var(--accent-emerald)" /> Edycja Przepisu: {recipe.title}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Nazwa potrawy *</label>
            <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Kategoria</label>
              <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="Śniadanie">Śniadanie</option>
                <option value="Drugie śniadanie">Drugie śniadanie</option>
                <option value="Obiad">Obiad</option>
                <option value="Podwieczorek">Podwieczorek</option>
                <option value="Przekąska">Przekąska</option>
                <option value="Kolacja">Kolacja</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Czas (min)*</label>
              <input type="number" className="form-input" required value={form.preparation_time_minutes} onChange={e => setForm(f => ({ ...f, preparation_time_minutes: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Porcje bazowe*</label>
              <input type="number" step="0.5" className="form-input" required value={form.default_portions} onChange={e => setForm(f => ({ ...f, default_portions: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Zdjęcie potrawy (URL lub upload z dysku)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input className="form-input" placeholder="https://..." value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} style={{ flex: 1 }} />
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Upload size={14} /> {uploadingImage ? 'Wgrywam...' : 'Wgraj plik'}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
              </label>
            </div>
            {form.image_url && (
              <div style={{ marginTop: '0.5rem', height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <img src={form.image_url} alt="Podgląd" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Instrukcja przygotowania krok po kroku</label>
            <textarea rows="3" className="form-input" style={{ width: '100%', resize: 'vertical' }} value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} />
          </div>

          {/* Składniki z bazy */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Składniki z bazy produktów:</label>
              <button
                type="button"
                onClick={() => setIngredients([...ingredients, { product_id: products[0]?.id || 1, amount_g: 100 }])}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem' }}
              >
                + Dodaj składnik
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '160px', overflowY: 'auto' }}>
              {ingredients.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.4rem' }}>
                  Brak składników. Użyj przycisku "+ Dodaj składnik" powyżej.
                </div>
              ) : (
                ingredients.map((ing, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <select
                      className="form-input"
                      value={ing.product_id}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        setIngredients(prev => prev.map((item, i) => i === idx ? { ...item, product_id: val } : item));
                      }}
                      style={{ flex: 2, fontSize: '0.78rem', padding: '0.35rem' }}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          [{p.store}] {p.name} ({p.calories_per_100g} kcal)
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="form-input"
                      value={ing.amount_g}
                      onChange={e => {
                        const val = parseFloat(e.target.value) || 0;
                        setIngredients(prev => prev.map((item, i) => i === idx ? { ...item, amount_g: val } : item));
                      }}
                      style={{ width: '80px', fontSize: '0.78rem', padding: '0.35rem', textAlign: 'center' }}
                      placeholder="g"
                    />
                    <button
                      type="button"
                      onClick={() => setIngredients(prev => prev.filter((_, i) => i !== idx))}
                      className="btn btn-secondary btn-sm"
                      style={{ color: 'var(--accent-rose)', padding: '0.35rem 0.6rem' }}
                      title="Usuń ten składnik"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Zapisuję...' : 'Zapisz przepis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── EDIT TEMPLATE MODAL ──────────────────────────────────────────────────────

function EditTemplateModal({ template, recipes, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: template.name || '',
    category: template.category || 'Dieta niskokaloryczna',
    description: template.description || '',
    target_calories: template.target_calories || 1800,
    meals_per_day: template.meals_per_day || 4,
  });
  const [daysData, setDaysData] = useState(template.days_data || []);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentDay = daysData[activeDayIdx] || { day_name: `Dzień ${activeDayIdx + 1}`, meals: [] };

  function handleUpdateMealRecipe(mealIdx, recipeId) {
    setDaysData(prev => prev.map((d, dIdx) => {
      if (dIdx !== activeDayIdx) return d;
      const updatedMeals = (d.meals || []).map((m, mIdx) => {
        if (mIdx !== mealIdx) return m;
        return { ...m, recipe_id: parseInt(recipeId) };
      });
      return { ...d, meals: updatedMeals };
    }));
  }

  function handleUpdateMealPortions(mealIdx, portions) {
    setDaysData(prev => prev.map((d, dIdx) => {
      if (dIdx !== activeDayIdx) return d;
      const updatedMeals = (d.meals || []).map((m, mIdx) => {
        if (mIdx !== mealIdx) return m;
        return { ...m, portions: parseFloat(portions) || 1.0 };
      });
      return { ...d, meals: updatedMeals };
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await dietPlansApi.updateTemplate(template.id, {
        name: form.name,
        category: form.category,
        description: form.description,
        target_calories: parseInt(form.target_calories),
        meals_per_day: parseInt(form.meals_per_day),
        days_data: daysData,
      });
      onSuccess(`Pakiet "${form.name}" został zaktualizowany!`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} color="var(--accent-emerald)" /> Edycja Pakietu Diety: {template.name}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.75rem', color: 'var(--accent-rose)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Nazwa pakietu *</label>
              <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Kategoria</label>
              <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="Dieta zbilansowana">Dieta zbilansowana</option>
                <option value="Dieta niskokaloryczna">Dieta niskokaloryczna</option>
                <option value="Dieta wysokobiałkowa">Dieta wysokobiałkowa</option>
                <option value="Dieta wegetariańska">Dieta wegetariańska</option>
                <option value="Dieta lekkostrawna">Dieta lekkostrawna</option>
                <option value="Dieta płynna">Dieta płynna</option>
                <option value="Colitis ulcerosa">Colitis ulcerosa</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Docelowe kcal/dzień*</label>
              <input type="number" className="form-input" required value={form.target_calories} onChange={e => setForm(f => ({ ...f, target_calories: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Posiłków na dzień</label>
              <input type="number" min="3" max="6" className="form-input" required value={form.meals_per_day} onChange={e => setForm(f => ({ ...f, meals_per_day: e.target.value }))} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Opis pakietu</label>
            <textarea rows="2" className="form-input" style={{ width: '100%', resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Dni i Posiłki w Pakiecie */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.85rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
              Rozkład Posiłków według Dni Tygodnia:
            </label>
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', marginBottom: '0.75rem', paddingBottom: '0.25rem' }}>
              {daysData.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveDayIdx(idx)}
                  className={`btn ${activeDayIdx === idx ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', whiteSpace: 'nowrap' }}
                >
                  {d.day_name || `Dzień ${idx + 1}`}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(currentDay.meals || []).map((m, mIdx) => (
                <div key={mIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, width: '130px', color: 'var(--accent-emerald)' }}>
                    {m.meal_type}
                  </span>
                  <select
                    className="form-input"
                    value={m.recipe_id}
                    onChange={e => handleUpdateMealRecipe(mIdx, e.target.value)}
                    style={{ flex: 1, fontSize: '0.78rem', padding: '0.35rem' }}
                  >
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>
                        [{r.category}] {r.title} ({r.calories} kcal)
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5.0"
                    value={m.portions || 1.0}
                    onChange={e => handleUpdateMealPortions(mIdx, e.target.value)}
                    className="form-input"
                    style={{ width: '70px', fontSize: '0.78rem', padding: '0.35rem', textAlign: 'center' }}
                    title="Porcje"
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>porc.</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Zapisuję...' : 'Zapisz pakiet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── THEME & BACKGROUND CONFIGURATOR SECTION ──────────────────────────────────

function ThemeStudioSection({ onToast }) {
  const { theme, setTheme } = useAuth();
  const [, setForceUpdate] = useState(0);

  const [currentPattern, setCurrentPattern] = useState(() => localStorage.getItem('adonis_custom_pattern') || 'default');
  const [bgImageUrl, setBgImageUrl] = useState(() => localStorage.getItem('adonis_custom_bg_image') || '');
  const [bgOverlay, setBgOverlay] = useState(() => parseFloat(localStorage.getItem('adonis_custom_bg_overlay')) || 0.55);
  const [bgBlur, setBgBlur] = useState(() => parseInt(localStorage.getItem('adonis_custom_bg_blur')) || 0);
  const [uploading, setUploading] = useState(false);

  // Kreator nowego motywu
  const [showCreator, setShowCreator] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [newAccentColor, setNewAccentColor] = useState('#8b5cf6');
  const [newBgColor, setNewBgColor] = useState('#0d0f17');
  const [newCardColor, setNewCardColor] = useState('#1e293b');
  const [newTextColor, setNewTextColor] = useState('#f8fafc');
  const [newPattern, setNewPattern] = useState('dots');
  const [newBgImage, setNewBgImage] = useState('');

  const allThemes = getAllThemeDetails();

  function handleSaveAll() {
    saveCustomThemeSettings({
      bgImage: bgImageUrl.trim(),
      overlay: bgOverlay,
      blur: bgBlur,
      pattern: currentPattern,
    });
    onToast('Ustawienia motywu i tła zostały zapisane i zastosowane w całej platformie!');
  }

  function handleReset() {
    if (!window.confirm('Czy na pewno chcesz przywrócić domyślne tło i desenie motywu?')) return;
    resetCustomThemeSettings();
    setBgImageUrl('');
    setBgOverlay(0.55);
    setBgBlur(0);
    setCurrentPattern('default');
    onToast('Przywrócono domyślne ustawienia wyglądu.');
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await recipesApi.uploadImage(file);
      setBgImageUrl(res.image_url);
      saveCustomThemeSettings({ bgImage: res.image_url });
      onToast('Wgrane zdjęcie zostało ustawione jako tło aplikacji!');
    } catch (err) {
      alert(`Błąd uploadu zdjęcia tła: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  function handleCreateTheme(e) {
    e.preventDefault();
    if (!newThemeName.trim()) {
      alert('Podaj unikalną nazwę nowego motywu!');
      return;
    }
    const themeId = `custom_${Date.now()}`;
    const newThemeObj = {
      id: themeId,
      name: newThemeName.trim(),
      accentColor: newAccentColor,
      bgPrimary: newBgColor,
      bgSecondary: newBgColor,
      bgCard: newCardColor,
      textColor: newTextColor,
      borderColor: `${newAccentColor}33`,
      pattern: newPattern,
      bgImage: newBgImage.trim(),
    };
    saveCustomTheme(newThemeObj);
    setTheme(themeId);
    setForceUpdate(v => v + 1);
    setShowCreator(false);
    setNewThemeName('');
    onToast(`Nowy motyw "${newThemeObj.name}" został pomyślnie utworzony i aktywowany!`);
  }

  function handleDeleteCustomTheme(tId, tName) {
    if (!window.confirm(`Czy na pewno usunąć autorski motyw "${tName}"?`)) return;
    deleteCustomTheme(tId);
    if (theme === tId) {
      setTheme('dark');
    }
    setForceUpdate(v => v + 1);
    onToast(`Motyw "${tName}" został trwale usunięty.`);
  }

  return (
    <SectionCard
      icon={<Palette size={18} />}
      title="Studio Motywów, Deseni i Tła Aplikacji"
      action={
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowCreator(!showCreator)}>
            <Plus size={14} /> {showCreator ? 'Zamknij kreator' : 'Nowy Motyw'}
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleReset}>
            <RotateCcwIcon size={14} /> Przywróć Domyślne
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSaveAll}>
            <Check size={14} /> Zastosuj i Zapisz
          </button>
        </div>
      }
    >
      {/* ── KREATOR NOWEGO MOTYWU (MODAL / FORMULARZ) ── */}
      {showCreator && (
        <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--accent-emerald)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Kreator Nowego Motywu Aplikacji
            </h4>
            <button onClick={() => setShowCreator(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateTheme} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Nazwa Twojego Motywu*</label>
                <input
                  className="form-input"
                  required
                  placeholder="np. Złoty Bursztyn, Fioletowy Neon..."
                  value={newThemeName}
                  onChange={e => setNewThemeName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Domyślny deseń tła</label>
                <select className="form-input" value={newPattern} onChange={e => setNewPattern(e.target.value)}>
                  {PATTERN_PRESETS.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Presety kolorów akcentu */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Szybki wybór koloru wiodącego (Akcent):</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {[
                  { name: 'Fiolet', color: '#8b5cf6' },
                  { name: 'Bursztyn', color: '#f59e0b' },
                  { name: 'Róż', color: '#ec4899' },
                  { name: 'Błękit', color: '#38bdf8' },
                  { name: 'Szmaragd', color: '#10b981' },
                  { name: 'Karmin', color: '#f43f5e' },
                  { name: 'Czerń & Złoto', color: '#eab308' },
                ].map(p => (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => setNewAccentColor(p.color)}
                    style={{
                      background: p.color,
                      border: newAccentColor === p.color ? '2px solid #ffffff' : '1px solid transparent',
                      borderRadius: '6px',
                      padding: '0.25rem 0.6rem',
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Próbnik kolorów w siatce */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Kolor akcentu</label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input type="color" value={newAccentColor} onChange={e => setNewAccentColor(e.target.value)} style={{ width: '38px', height: '34px', cursor: 'pointer', border: 'none', background: 'none' }} />
                  <input className="form-input" style={{ fontSize: '0.78rem', padding: '0.3rem' }} value={newAccentColor} onChange={e => setNewAccentColor(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Kolor tła bazy</label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input type="color" value={newBgColor} onChange={e => setNewBgColor(e.target.value)} style={{ width: '38px', height: '34px', cursor: 'pointer', border: 'none', background: 'none' }} />
                  <input className="form-input" style={{ fontSize: '0.78rem', padding: '0.3rem' }} value={newBgColor} onChange={e => setNewBgColor(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Kolor kart i paneli</label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input type="color" value={newCardColor.startsWith('#') ? newCardColor : '#1e293b'} onChange={e => setNewCardColor(e.target.value)} style={{ width: '38px', height: '34px', cursor: 'pointer', border: 'none', background: 'none' }} />
                  <input className="form-input" style={{ fontSize: '0.78rem', padding: '0.3rem' }} value={newCardColor} onChange={e => setNewCardColor(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Kolor tekstu</label>
                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <input type="color" value={newTextColor} onChange={e => setNewTextColor(e.target.value)} style={{ width: '38px', height: '34px', cursor: 'pointer', border: 'none', background: 'none' }} />
                  <input className="form-input" style={{ fontSize: '0.78rem', padding: '0.3rem' }} value={newTextColor} onChange={e => setNewTextColor(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Opcjonalne tło URL */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Opcjonalny URL obrazu tła motywu</label>
              <input
                className="form-input"
                placeholder="https://images.unsplash.com/... (pozostaw puste dla czystego tła)"
                value={newBgImage}
                onChange={e => setNewBgImage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" onClick={() => setShowCreator(false)} className="btn btn-secondary">Anuluj</button>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={15} /> Utwórz i Aktywuj Nowy Motyw
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Kolumna 1: Wszystkie motywy i deseń */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                1. Wybierz Motyw Platformy:
              </label>
              <button
                type="button"
                onClick={() => setShowCreator(true)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.74rem', padding: '0.2rem 0.5rem', color: 'var(--accent-emerald)' }}
              >
                + Dodaj Nowy Motyw
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
              {allThemes.map(t => {
                const isSelected = theme === t.id;
                return (
                  <div
                    key={t.id}
                    style={{
                      background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      onClick={() => setTheme(t.id)}
                      style={{ cursor: 'pointer', flex: 1 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.86rem', color: t.color || 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: t.color || '#fff' }} />
                          {t.label}
                        </strong>
                        {isSelected && <Check size={15} color="var(--accent-emerald)" />}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {t.isCustom ? 'Autorski motyw administratora' : 'Wbudowany motyw Adonis'}
                      </div>
                    </div>

                    {t.isCustom && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomTheme(t.id, t.label)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem', color: 'var(--accent-rose)' }}
                          title="Usuń ten motyw"
                        >
                          <Trash2 size={11} /> Usuń
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
              2. Wybierz Deseń / Wzór Tła (Pattern):
            </label>
            <select
              className="form-input"
              value={currentPattern}
              onChange={e => {
                setCurrentPattern(e.target.value);
                saveCustomThemeSettings({ pattern: e.target.value });
              }}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              {PATTERN_PRESETS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.3rem', display: 'block' }}>
              Deseń nakłada się jako estetyczna tekstura w tle całego interfejsu.
            </span>
          </div>
        </div>

        {/* Kolumna 2: Własne zdjęcie jako tło i filtry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem', color: '#fff' }}>
              3. Własne Zdjęcie jako Tło Całej Aplikacji:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                className="form-input"
                placeholder="Wklej adres URL zdjęcia (np. Unsplash)..."
                value={bgImageUrl}
                onChange={e => {
                  setBgImageUrl(e.target.value);
                  saveCustomThemeSettings({ bgImage: e.target.value.trim() });
                }}
                style={{ flex: 1, fontSize: '0.82rem' }}
              />
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Upload size={14} /> {uploading ? 'Wgrywam...' : 'Wgraj z dysku'}
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>

            {/* Presety obrazów */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Szybkie presety wysokiej jakości:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
              {BACKGROUND_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setBgImageUrl(preset.url);
                    saveCustomThemeSettings({ bgImage: preset.url });
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                >
                  {preset.label}
                </button>
              ))}
              {bgImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setBgImageUrl('');
                    saveCustomThemeSettings({ bgImage: '' });
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem', color: 'var(--accent-rose)' }}
                >
                  ✕ Usuń tło
                </button>
              )}
            </div>

            {/* Suwaki regulacji */}
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Przyciemnienie tła (Dark Overlay):</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{Math.round(bgOverlay * 100)}%</strong>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.9"
                  step="0.05"
                  value={bgOverlay}
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setBgOverlay(val);
                    saveCustomThemeSettings({ overlay: val });
                  }}
                  style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Rozmycie tła (Backdrop Blur):</span>
                  <strong style={{ color: 'var(--accent-emerald)' }}>{bgBlur} px</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={bgBlur}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    setBgBlur(val);
                    saveCustomThemeSettings({ blur: val });
                  }}
                  style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function RotateCcwIcon(props) {
  return <RefreshCw {...props} />;
}

// ─── MAIN ADMIN DASHBOARD ─────────────────────────────────────────────────────

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('users');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [showAssignDietitian, setShowAssignDietitian] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmClean, setConfirmClean] = useState(null);
  const [expandedTplId, setExpandedTplId] = useState(null);

  // Sort & Edit States
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [editingUser, setEditingUser] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  function handleSort(key) {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [u, r, p, t] = await Promise.all([
        adminApi.listUsers(),
        recipesApi.list({ limit: 250 }),
        recipesApi.products({ limit: 250 }),
        dietPlansApi.getTemplates(),
      ]);
      setUsers(u);
      setRecipes(r);
      setProducts(p);
      setTemplates(t);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Filtered & Sorted lists ───────────────────────────────
  const filteredUsers = users.filter(u => {
    const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchStatus = !statusFilter
      ? true
      : statusFilter === 'active'
      ? u.is_active !== false
      : u.is_active === false;
    return matchSearch && matchRole && matchStatus;
  });

  const filteredRecipes = recipes.filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()));
  const filteredProducts = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())) || p.store.toLowerCase().includes(search.toLowerCase()));
  const filteredTemplates = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));

  const sortedUsers = useMemo(() => sortData(filteredUsers, sortConfig.key, sortConfig.direction), [filteredUsers, sortConfig]);
  const sortedProducts = useMemo(() => sortData(filteredProducts, sortConfig.key, sortConfig.direction), [filteredProducts, sortConfig]);
  const sortedRecipes = useMemo(() => sortData(filteredRecipes, sortConfig.key, sortConfig.direction), [filteredRecipes, sortConfig]);
  const sortedTemplates = useMemo(() => sortData(filteredTemplates, sortConfig.key, sortConfig.direction), [filteredTemplates, sortConfig]);

  // ── Stats ────────────────────────────────────────────────
  const stats = {
    admins: users.filter(u => u.role === 'admin').length,
    dietitians: users.filter(u => u.role === 'dietitian').length,
    patients: users.filter(u => u.role === 'patient').length,
    blocked: users.filter(u => u.is_active === false).length,
    recipes: recipes.length,
    products: products.length,
    templates: templates.length,
  };

  // ── Handlers ─────────────────────────────────────────────
  async function handleDeleteUser(userId, email) {
    try {
      await adminApi.deleteUser(userId);
      setUsers(u => u.filter(x => x.id !== userId));
      showToast(`Konto ${email} zostało trwale usunięte.`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setConfirmDelete(null);
    }
  }

  async function handleCleanUser(userId, email) {
    try {
      const res = await adminApi.cleanUser(userId);
      showToast(res.message);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setConfirmClean(null);
    }
  }

  async function handleToggleActive(userId) {
    try {
      const res = await adminApi.deactivateUser(userId);
      setUsers(u => u.map(x => x.id === userId ? { ...x, is_active: res.is_active } : x));
      showToast(res.message);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleDeleteRecipe(id, title) {
    if (!window.confirm(`Czy na pewno usunąć przepis "${title}"?`)) return;
    try {
      await recipesApi.delete(id);
      setRecipes(r => r.filter(x => x.id !== id));
      showToast(`Przepis "${title}" usunięty.`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleDeleteProduct(id, name) {
    if (!window.confirm(`Czy na pewno usunąć produkt "${name}"?`)) return;
    try {
      await recipesApi.deleteProduct(id);
      setProducts(p => p.filter(x => x.id !== id));
      showToast(`Produkt "${name}" usunięty.`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function handleDeleteTemplate(id, name) {
    if (!window.confirm(`Czy na pewno usunąć pakiet "${name}"?`)) return;
    try {
      await dietPlansApi.deleteTemplate(id);
      setTemplates(t => t.filter(x => x.id !== id));
      showToast(`Pakiet "${name}" usunięty.`);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const patients = users.filter(u => u.role === 'patient');
  const dietitians = users.filter(u => u.role === 'dietitian');

  return (
    <div className="admin-panel">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          background: toast.type === 'error' ? 'rgba(244,63,94,0.95)' : 'rgba(16,185,129,0.95)',
          color: '#fff', borderRadius: '10px', padding: '0.85rem 1.25rem',
          fontSize: '0.88rem', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: '0.6rem', animation: 'slideInDown 0.3s ease',
          maxWidth: '360px'
        }}>
          {toast.type === 'error' ? <XCircle size={17} /> : <CheckCircle size={17} />}
          {toast.msg}
        </div>
      )}

      {/* Confirm delete user modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <AlertTriangle size={40} color="var(--accent-rose)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Potwierdź usunięcie konta</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Czy na pewno chcesz trwale usunąć konto <strong style={{ color: 'var(--accent-rose)' }}>{confirmDelete.email}</strong>? Wszystkie dane powiązane z tym kontem zostaną trwale skasowane.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmDelete(null)}>Anuluj</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteUser(confirmDelete.id, confirmDelete.email)}>
                <Trash2 size={15} /> Usuń trwale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm clean user data modal */}
      {confirmClean && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <Eraser size={40} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Wyczyść dane konta</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Ta operacja wyczyści wszystkie pomiary wagi, przypisane jadłospisy, listę zakupów, powiadomienia i historię czatów użytkownika <strong style={{ color: 'var(--accent-amber)' }}>{confirmClean.email}</strong>, przywracając konto do stanu początkowego (samo konto nie zostanie usunięte).
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmClean(null)}>Anuluj</button>
              <button className="btn btn-primary" style={{ flex: 1, background: 'var(--accent-amber)', borderColor: 'var(--accent-amber)' }} onClick={() => handleCleanUser(confirmClean.id, confirmClean.email)}>
                <Eraser size={15} /> Wyczyść dane
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateUser && <CreateUserModal onClose={() => setShowCreateUser(false)} onSuccess={msg => { showToast(msg); loadData(); }} />}
      {showCreateProduct && <CreateProductModal onClose={() => setShowCreateProduct(false)} onSuccess={msg => { showToast(msg); loadData(); }} />}
      {showCreateRecipe && <CreateRecipeModal onClose={() => setShowCreateRecipe(false)} onSuccess={msg => { showToast(msg); loadData(); }} />}
      {showAssignDietitian && <AssignDietitianModal patients={patients} dietitians={dietitians} onClose={() => setShowAssignDietitian(false)} onSuccess={msg => { showToast(msg); loadData(); }} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={26} color="var(--accent-rose)" /> Panel Administratora
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', marginTop: '0.25rem' }}>
            Pełne uprawnienia do użytkowników, przepisów, produktów i pakietów diety
          </p>
        </div>
        <button onClick={loadData} className="btn btn-secondary btn-sm" title="Odśwież dane">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'Adminów', value: stats.admins, color: 'var(--accent-rose)', onClick: () => { setActiveSection('users'); setRoleFilter('admin'); setStatusFilter(''); } },
          { label: 'Dietetyków', value: stats.dietitians, color: 'var(--accent-indigo)', onClick: () => { setActiveSection('users'); setRoleFilter('dietitian'); setStatusFilter(''); } },
          { label: 'Pacjentów', value: stats.patients, color: 'var(--accent-emerald)', onClick: () => { setActiveSection('users'); setRoleFilter('patient'); setStatusFilter(''); } },
          { label: 'Konta zablokowane', value: stats.blocked, color: 'var(--accent-amber)', onClick: () => { setActiveSection('users'); setRoleFilter(''); setStatusFilter('blocked'); } },
          { label: 'Produktów', value: stats.products, color: 'var(--accent-emerald)', onClick: () => setActiveSection('products') },
          { label: 'Przepisów', value: stats.recipes, color: 'var(--accent-sky)', onClick: () => setActiveSection('recipes') },
          { label: 'Pakietów', value: stats.templates, color: 'var(--accent-indigo)', onClick: () => setActiveSection('packages') },
        ].map(s => (
          <div
            key={s.label}
            className="glass-panel"
            style={{ padding: '0.85rem 0.6rem', textAlign: 'center', cursor: s.onClick ? 'pointer' : 'default', transition: 'transform 0.15s, border-color 0.15s' }}
            onClick={s.onClick}
            title={s.onClick ? `Filtruj: ${s.label}` : undefined}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { key: 'users', icon: <Users size={15} />, label: 'Użytkownicy' },
          { key: 'products', icon: <ShoppingBag size={15} />, label: 'Produkty w Bazie' },
          { key: 'recipes', icon: <BookOpen size={15} />, label: 'Przepisy' },
          { key: 'packages', icon: <Package size={15} />, label: 'Pakiety Diety' },
          { key: 'themes', icon: <Palette size={15} />, label: 'Motywy i Tło' },
        ].map(s => (
          <button
            key={s.key}
            className={`btn ${activeSection === s.key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setActiveSection(s.key)}
          >
            {s.icon} {s.label}
          </button>
        ))}

        {/* Search + filter */}
        <div style={{ flex: 1 }} />
        {activeSection !== 'themes' && (
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="form-input"
              style={{ paddingLeft: '2rem', width: '220px', fontSize: '0.83rem', padding: '0.4rem 0.7rem 0.4rem 2rem' }}
              placeholder="Szukaj..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}
        {activeSection === 'users' && (
          <>
            <select className="form-input" style={{ width: '135px', fontSize: '0.83rem', padding: '0.4rem 0.7rem' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">Wszystkie role</option>
              <option value="admin">Admin</option>
              <option value="dietitian">Dietetyk</option>
              <option value="patient">Pacjent</option>
            </select>
            <select className="form-input" style={{ width: '145px', fontSize: '0.83rem', padding: '0.4rem 0.7rem' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">Wszystkie statusy</option>
              <option value="active">Tylko aktywne</option>
              <option value="blocked">Tylko zablokowane</option>
            </select>
          </>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.75rem' }} />
          <p>Ładowanie danych...</p>
        </div>
      ) : (
        <>
          {/* ── USERS SECTION ──────────────────────────────────────────── */}
          {activeSection === 'users' && (
            <SectionCard
              icon={<Users size={17} />}
              title={`Użytkownicy (${sortedUsers.length})`}
              action={
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowAssignDietitian(true)}>
                    <Edit3 size={14} /> Przypisz Dietetyka
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowCreateUser(true)}>
                    <UserPlus size={14} /> + Nowe Konto
                  </button>
                </div>
              }
            >
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <SortableTh colKey="id" label="ID" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="fullName" label="Imię i Nazwisko" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="email" label="E-mail" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="role" label="Rola" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="is_active" label="Status" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="assigned_dietitian_name" label="Dietetyk" currentSort={sortConfig} onSort={handleSort} />
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map(u => (
                      <tr key={u.id}>
                        <td style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>#{u.id}</td>
                        <td style={{ fontWeight: 600 }}>{u.first_name} {u.last_name}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>{u.email}</td>
                        <td><RoleBadge role={u.role} /></td>
                        <td><StatusBadge active={u.is_active !== false} /></td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {u.assigned_dietitian_name || (u.role === 'patient' ? <span style={{ color: 'var(--accent-amber)' }}>Brak</span> : '—')}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingUser(u)}
                              title="Edytuj dane i uprawnienia użytkownika"
                              style={{ padding: '0.3rem 0.5rem', color: 'var(--accent-emerald)' }}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleToggleActive(u.id)}
                              title={u.is_active !== false ? 'Zablokuj konto' : 'Odblokuj konto'}
                              style={{ padding: '0.3rem 0.5rem' }}
                            >
                              {u.is_active !== false ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                            {u.role === 'patient' && (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setConfirmClean(u)}
                                title="Wyczyść dane konta (pomiary, plany, zakupy, czat)"
                                style={{ padding: '0.3rem 0.5rem', color: 'var(--accent-amber)' }}
                              >
                                <Eraser size={13} />
                              </button>
                            )}
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setConfirmDelete(u)}
                              title="Usuń konto trwale"
                              style={{ padding: '0.3rem 0.5rem' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sortedUsers.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>Brak użytkowników spełniających kryteria.</p>
                )}
              </div>
            </SectionCard>
          )}

          {/* ── PRODUCTS SECTION ───────────────────────────────────────── */}
          {activeSection === 'products' && (
            <SectionCard
              icon={<ShoppingBag size={17} />}
              title={`Produkty w Bazie (${sortedProducts.length})`}
              action={
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreateProduct(true)}>
                  <Plus size={14} /> + Dodaj Produkt
                </button>
              }
            >
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <SortableTh colKey="id" label="ID" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="name" label="Nazwa" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="store" label="Sklep" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="brand" label="Marka" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="category" label="Kategoria" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="calories_per_100g" label="Kcal/100g" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="protein_per_100g" label="B / T / W" currentSort={sortConfig} onSort={handleSort} />
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedProducts.map(p => (
                      <tr key={p.id}>
                        <td style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>#{p.id}</td>
                        <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</td>
                        <td>
                          <span className={`badge ${p.store === 'Lidl' ? 'badge-lidl' : p.store === 'Biedronka' ? 'badge-biedronka' : p.store === 'Kaufland' ? 'badge-kaufland' : p.store === 'Carrefour' ? 'badge-carrefour' : 'badge-emerald'}`} style={{ fontSize: '0.72rem' }}>
                            {p.store}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.brand || '—'}</td>
                        <td style={{ fontSize: '0.8rem' }}>{p.category}</td>
                        <td><strong style={{ color: 'var(--accent-amber)' }}>{p.calories_per_100g} kcal</strong></td>
                        <td style={{ fontSize: '0.78rem' }}>
                          <span style={{ color: 'var(--accent-rose)' }}>{p.protein_per_100g}g</span> / <span style={{ color: 'var(--accent-amber)' }}>{p.fat_per_100g}g</span> / <span style={{ color: 'var(--accent-sky)' }}>{p.carbs_per_100g}g</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingProduct(p)}
                              title="Edytuj szczegóły produktu"
                              style={{ padding: '0.3rem 0.5rem', color: 'var(--accent-emerald)' }}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              title="Usuń produkt"
                              style={{ padding: '0.3rem 0.5rem' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sortedProducts.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>Brak produktów.</p>
                )}
              </div>
            </SectionCard>
          )}

          {/* ── RECIPES SECTION ────────────────────────────────────────── */}
          {activeSection === 'recipes' && (
            <SectionCard
              icon={<BookOpen size={17} />}
              title={`Przepisy (${sortedRecipes.length})`}
              action={
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreateRecipe(true)}>
                  <Plus size={14} /> + Dodaj Przepis
                </button>
              }
            >
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <SortableTh colKey="id" label="ID" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="title" label="Tytuł" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="category" label="Kategoria" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="preparation_time_minutes" label="Czas" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="calories" label="Kalorie" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="protein_g" label="Białko" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="fat_g" label="Tłuszcz" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="carbs_g" label="Węglowodany" currentSort={sortConfig} onSort={handleSort} />
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRecipes.map(r => (
                      <tr key={r.id}>
                        <td style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>#{r.id}</td>
                        <td style={{ fontWeight: 600, fontSize: '0.87rem' }}>{r.title}</td>
                        <td style={{ fontSize: '0.8rem' }}>{r.category}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>⏱ {r.preparation_time_minutes || 20} min</td>
                        <td><span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{r.calories} kcal</span></td>
                        <td><span style={{ color: 'var(--accent-rose)' }}>{r.protein_g}g</span></td>
                        <td><span style={{ color: 'var(--accent-amber)' }}>{r.fat_g}g</span></td>
                        <td><span style={{ color: 'var(--accent-sky)' }}>{r.carbs_g}g</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingRecipe(r)}
                              title="Edytuj przepis i składniki"
                              style={{ padding: '0.3rem 0.5rem', color: 'var(--accent-emerald)' }}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteRecipe(r.id, r.title)}
                              title="Usuń przepis"
                              style={{ padding: '0.3rem 0.5rem' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sortedRecipes.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>Brak przepisów.</p>
                )}
              </div>
            </SectionCard>
          )}

          {/* ── PACKAGES SECTION ───────────────────────────────────────── */}
          {activeSection === 'packages' && (
            <SectionCard icon={<Package size={17} />} title={`Pakiety Diety (${sortedTemplates.length})`}>
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <SortableTh colKey="id" label="ID" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="name" label="Nazwa" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="target_gender" label="Płeć" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="category" label="Kategoria" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="target_calories" label="Cel kcal" currentSort={sortConfig} onSort={handleSort} />
                      <SortableTh colKey="meals_per_day" label="Posiłki/dzień" currentSort={sortConfig} onSort={handleSort} />
                      <th>Przypisania</th>
                      <th>Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTemplates.map(t => {
                      const isExp = expandedTplId === t.id;
                      return (
                        <React.Fragment key={t.id}>
                          <tr>
                            <td style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>#{t.id}</td>
                            <td style={{ fontWeight: 600, fontSize: '0.87rem' }}>{t.name}</td>
                            <td>
                              {t.target_gender === 'female' ? (
                                <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(236,72,153,0.15)', color: '#f472b6', fontWeight: 700 }}>👩 Kobieta</span>
                              ) : t.target_gender === 'male' ? (
                                <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontWeight: 700 }}>👨 Mężczyzna</span>
                              ) : (
                                <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 700 }}>🥗 Dla każdego</span>
                              )}
                            </td>
                            <td>
                              <span style={{ background: 'var(--accent-emerald-glow)', color: 'var(--accent-emerald)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                                {t.category}
                              </span>
                            </td>
                            <td><span style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{t.target_calories} kcal</span></td>
                            <td>{t.meals_per_day} posiłki</td>
                            <td>
                              <span style={{ color: 'var(--accent-indigo)', fontWeight: 700 }}>
                                {t.assignments?.length || 0} pacjentów
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.35rem' }}>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => setEditingTemplate(t)}
                                  title="Edytuj pakiet diety"
                                  style={{ padding: '0.3rem 0.5rem', color: 'var(--accent-emerald)' }}
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => setExpandedTplId(isExp ? null : t.id)}
                                  title="Szczegóły pakietu"
                                  style={{ padding: '0.3rem 0.5rem' }}
                                >
                                  <Eye size={13} />
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteTemplate(t.id, t.name)}
                                  title="Usuń pakiet"
                                  style={{ padding: '0.3rem 0.5rem' }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExp && (
                            <tr>
                              <td colSpan={7} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem' }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.5rem' }}>
                                  Rozkład posiłków i doręczenia dla: {t.name}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                  {(t.days_data || []).map((day, idx) => (
                                    <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.75rem' }}>
                                      <strong style={{ color: '#fff' }}>{day.day_name || `Dzień ${day.day_number}`}:</strong>
                                      <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0 }}>
                                        {(day.meals || []).map((m, mIdx) => (
                                          <li key={mIdx}>{m.meal_type} ({m.portions} porc.)</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                                {t.assignments && t.assignments.length > 0 && (
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    <strong>Historia doręczenia:</strong>{' '}
                                    {t.assignments.map(a => `${a.patient_name || a.patient_email} (${a.start_date})`).join(', ')}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
                {sortedTemplates.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>Brak pakietów diety.</p>
                )}
              </div>
            </SectionCard>
          )}

          {/* ── THEMES SECTION ─────────────────────────────────────────── */}
          {activeSection === 'themes' && (
            <ThemeStudioSection onToast={showToast} />
          )}
        </>
      )}

      {/* ── MODALS FOR EDITING ────────────────────────────────────────── */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          dietitians={dietitians}
          onClose={() => setEditingUser(null)}
          onSuccess={msg => { showToast(msg); loadData(); }}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={msg => { showToast(msg); loadData(); }}
        />
      )}

      {editingRecipe && (
        <EditRecipeModal
          recipe={editingRecipe}
          products={products}
          onClose={() => setEditingRecipe(null)}
          onSuccess={msg => { showToast(msg); loadData(); }}
        />
      )}

      {editingTemplate && (
        <EditTemplateModal
          template={editingTemplate}
          recipes={recipes}
          onClose={() => setEditingTemplate(null)}
          onSuccess={msg => { showToast(msg); loadData(); }}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
