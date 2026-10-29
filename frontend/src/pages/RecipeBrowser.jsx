import React, { useState, useEffect } from 'react';
import { recipesApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PortionScalerModal } from '../components/PortionScalerModal';
import { RecipeDeleteModal } from '../components/RecipeDeleteModal';
import { BookOpen, Search, Filter, Barcode, Scale, Sparkles, ShoppingBag, Clock, Edit3, X, Upload, Trash2, Flame, Award } from 'lucide-react';

function getStoreBadgeClass(store) {
  const s = (store || '').toLowerCase();
  if (s === 'lidl') return 'badge-lidl';
  if (s === 'biedronka') return 'badge-biedronka';
  if (s === 'kaufland') return 'badge-kaufland';
  if (s === 'carrefour') return 'badge-carrefour';
  return 'badge-emerald';
}

export function RecipeBrowser() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'dietitian';

  const [viewMode, setViewMode] = useState('recipes'); // 'recipes' | 'products' | 'off'
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [productStoreFilter, setProductStoreFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [scalingRecipeId, setScalingRecipeId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function promptDeleteRecipe(r) {
    setRecipeToDelete(r);
    setShowDeleteModal(true);
  }

  // Open Food Facts state
  const [offQuery, setOffQuery] = useState('');
  const [offStoreFilter, setOffStoreFilter] = useState('');
  const [offResults, setOffResults] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('590000000001');
  const [barcodeResult, setBarcodeResult] = useState(null);

  useEffect(() => {
    if (viewMode === 'recipes') {
      loadRecipes();
    } else if (viewMode === 'products') {
      loadProducts();
    }
  }, [viewMode, categoryFilter, searchQuery]);

  async function loadRecipes() {
    setLoading(true);
    try {
      const data = await recipesApi.list({
        search: searchQuery,
        category: categoryFilter,
        limit: 1000,
      });
      setRecipes(data);
    } catch (_) {}
    setLoading(false);
  }

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await recipesApi.products({ search: searchQuery, limit: 60 });
      setProducts(data);
    } catch (_) {}
    setLoading(false);
  }

  async function handleSearchOFF(e) {
    e.preventDefault();
    if (!offQuery.trim()) return;
    setLoading(true);
    try {
      const data = await recipesApi.searchOpenFoodFacts(offQuery, offStoreFilter);
      setOffResults(data);
    } catch (err) {
      alert(`Błąd OFF: ${err.message}`);
    }
    setLoading(false);
  }

  async function handleScanBarcode(e) {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    try {
      const data = await recipesApi.getBarcode(barcodeInput.trim());
      setBarcodeResult(data);
    } catch (err) {
      alert(`Nie znaleziono produktu: ${err.message}`);
    }
  }

  const categories = ['Wszystkie', 'Śniadanie', 'Drugie śniadanie', 'Obiad', 'Przekąska / Podwieczorek', 'Kolacja'];

  return (
    <div className="page-container">
      {/* Top Banner and Navigation */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookOpen size={24} color="#10b981" />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Katalog Przepisów & Baza Dyskontów</h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {recipes.length > 0 ? `Baza ${recipes.length} przepisów redukcyjnych i NFZ` : 'Baza ponad 360 przepisów'} opartych na produktach z sieci Kaufland, Carrefour, Lidl i Biedronka
            </p>
          </div>

          <div className="tabs-nav">
            <button
              className={`tab-btn ${viewMode === 'recipes' ? 'active' : ''}`}
              onClick={() => setViewMode('recipes')}
            >
              Przepisy Fitness ({recipes.length})
            </button>
            <button
              className={`tab-btn ${viewMode === 'products' ? 'active' : ''}`}
              onClick={() => setViewMode('products')}
            >
              Produkty ({products.length})
            </button>
            <button
              className={`tab-btn ${viewMode === 'off' ? 'active' : ''}`}
              onClick={() => setViewMode('off')}
            >
              <Barcode size={16} /> Open Food Facts & Kody Kreskowe
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: RECIPES BROWSER */}
      {viewMode === 'recipes' && (
        <div>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Szukaj przepisu lub składnika (np. kurczak, skyr, twaróg)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#111827',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.65rem 1rem 0.65rem 2.75rem',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c === 'Wszystkie' ? '' : c)}
                  className={`btn btn-sm ${categoryFilter === (c === 'Wszystkie' ? '' : c) ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Recipes Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {recipes.map((r) => (
              <div key={r.id} className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                {r.image_url && (
                  <div style={{ width: '100%', height: '160px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={r.image_url}
                      alt={r.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                      <span className="badge badge-emerald">{r.category}</span>
                    </div>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} /> {r.preparation_time_minutes} min
                    </div>
                  </div>
                )}

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    {!r.image_url && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="badge badge-emerald">{r.category}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Clock size={12} /> {r.preparation_time_minutes} min
                        </span>
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.3 }}>{r.title}</h3>

                    {/* Macro pills */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      <div className="macro-pill" style={{ padding: '0.35rem 0.5rem' }}>
                        <span className="label" style={{ fontSize: '0.6rem' }}>Kcal</span>
                        <span className="value" style={{ fontSize: '0.95rem', color: '#10b981' }}>{r.calories}</span>
                      </div>
                      <div className="macro-pill" style={{ padding: '0.35rem 0.5rem' }}>
                        <span className="label" style={{ fontSize: '0.6rem' }}>Białko</span>
                        <span className="value" style={{ fontSize: '0.95rem' }}>{r.protein_g}g</span>
                      </div>
                      <div className="macro-pill" style={{ padding: '0.35rem 0.5rem' }}>
                        <span className="label" style={{ fontSize: '0.6rem' }}>Tłuszcz</span>
                        <span className="value" style={{ fontSize: '0.95rem' }}>{r.fat_g}g</span>
                      </div>
                      <div className="macro-pill" style={{ padding: '0.35rem 0.5rem' }}>
                        <span className="label" style={{ fontSize: '0.6rem' }}>Węgle</span>
                        <span className="value" style={{ fontSize: '0.95rem' }}>{r.carbs_g}g</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setScalingRecipeId(r.id)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <Scale size={14} /> Opis i opcje
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => setEditingRecipe(r)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-emerald)' }}
                        title="Edytuj przepis (Dietetyk & Admin)"
                      >
                        <Edit3 size={14} /> Edytuj
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => promptDeleteRecipe(r)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          color: '#f43f5e',
                          borderColor: 'rgba(244,63,94,0.35)',
                          background: 'rgba(244,63,94,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontWeight: 600
                        }}
                        title="Usuń ten przepis z bazy danych"
                      >
                        <Trash2 size={14} /> Usuń
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: PRODUCTS CATALOG */}
      {viewMode === 'products' && (
        <div>
          {/* Store filter tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { id: '', label: `Wszystkie (${products.length})` },
              { id: 'Kaufland', label: `Kaufland (${products.filter(p => p.store === 'Kaufland').length})` },
              { id: 'Carrefour', label: `Carrefour (${products.filter(p => p.store === 'Carrefour').length})` },
              { id: 'Lidl', label: `Lidl (${products.filter(p => p.store === 'Lidl').length})` },
              { id: 'Biedronka', label: `Biedronka (${products.filter(p => p.store === 'Biedronka').length})` },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setProductStoreFilter(s.id)}
                className={`btn btn-sm ${productStoreFilter === s.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {products
              .filter(p => !productStoreFilter || p.store.toLowerCase() === productStoreFilter.toLowerCase())
              .map((p) => (
              <div key={p.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span className={`badge ${getStoreBadgeClass(p.store)}`}>
                    {p.store}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.category}</span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{p.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Marka: {p.brand} | EAN: {p.barcode || 'Brak'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.75rem', borderRadius: '6px', marginBottom: canEdit ? '0.6rem' : 0 }}>
                  <span>{p.calories_per_100g} kcal</span>
                  <span>B: {p.protein_per_100g}g</span>
                  <span>T: {p.fat_per_100g}g</span>
                  <span>W: {p.carbs_per_100g}g</span>
                </div>
                {canEdit && (
                  <button
                    onClick={() => setEditingProduct(p)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--accent-emerald)', fontSize: '0.78rem' }}
                  >
                    <Edit3 size={13} /> Edytuj produkt
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: OPEN FOOD FACTS & BARCODE SCANNER */}
      {viewMode === 'off' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Search OFF */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Wyszukiwarka Open Food Facts API
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Odpytywanie bazy produktów po polskich nazwach i markach dyskontowych (Lidl, Biedronka)
            </p>

            <form onSubmit={handleSearchOFF} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Wpisz nazwę (np. twaróg, skyr, mleko)..."
                value={offQuery}
                onChange={(e) => setOffQuery(e.target.value)}
                style={{ flex: 1, background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem', borderRadius: '8px' }}
              />
              <button type="submit" className="btn btn-primary btn-sm">Szukaj w OFF</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
              {offResults.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{item.name}</strong>
                    <span className={`badge ${item.store === 'Lidl' ? 'badge-lidl' : item.store === 'Biedronka' ? 'badge-biedronka' : 'badge-emerald'}`}>{item.store}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.brand} | Kod: {item.barcode}</div>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.3rem' }}>
                    {item.calories_per_100g} kcal / 100g (B: {item.protein_per_100g}g, T: {item.fat_per_100g}g, W: {item.carbs_per_100g}g)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Barcode Lookup Simulator */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Skaner Kodów Kreskowych (EAN-13)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Wprowadź kod kreskowy z opakowania produktu, aby sprawdzić makroskładniki na 100g
            </p>

            <form onSubmit={handleScanBarcode} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Kod EAN (np. 590000000001)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                style={{ flex: 1, background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem', borderRadius: '8px', fontFamily: 'monospace' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm">Skanuj</button>
            </form>

            {barcodeResult && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', padding: '1.25rem', borderRadius: '10px' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>Zweryfikowany Produkt</span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{barcodeResult.name}</h4>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Sklep: {barcodeResult.store} | Marka: {barcodeResult.brand} | Źródło: {barcodeResult.source}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <div className="macro-pill">
                    <span className="label">Kcal/100g</span>
                    <span className="value" style={{ color: '#10b981' }}>{barcodeResult.calories_per_100g}</span>
                  </div>
                  <div className="macro-pill">
                    <span className="label">Białko</span>
                    <span className="value">{barcodeResult.protein_per_100g}g</span>
                  </div>
                  <div className="macro-pill">
                    <span className="label">Tłuszcz</span>
                    <span className="value">{barcodeResult.fat_per_100g}g</span>
                  </div>
                  <div className="macro-pill">
                    <span className="label">Węgle</span>
                    <span className="value">{barcodeResult.carbs_per_100g}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Portion Scaler Modal */}
      {scalingRecipeId && (
        <PortionScalerModal
          recipeId={scalingRecipeId}
          initialPortions={1.0}
          onClose={() => setScalingRecipeId(null)}
          onEdit={canEdit ? (scaled) => {
            const r = recipes.find(x => x.id === (scaled?.id || scalingRecipeId));
            if (r) {
              setScalingRecipeId(null);
              setEditingRecipe(r);
            }
          } : undefined}
          onDelete={canEdit ? (scaled) => {
            const r = recipes.find(x => x.id === (scaled?.id || scalingRecipeId)) || scaled;
            if (r) {
              setScalingRecipeId(null);
              promptDeleteRecipe(r);
            }
          } : undefined}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <BrowserEditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => { loadProducts(); }}
        />
      )}

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <BrowserEditRecipeModal
          recipe={editingRecipe}
          onClose={() => setEditingRecipe(null)}
          onSuccess={() => { loadRecipes(); }}
          onDelete={(r) => {
            setEditingRecipe(null);
            promptDeleteRecipe(r);
          }}
        />
      )}

      {/* Delete Recipe Modal */}
      <RecipeDeleteModal
        isOpen={showDeleteModal}
        recipe={recipeToDelete}
        allRecipes={recipes}
        onClose={() => {
          setShowDeleteModal(false);
          setRecipeToDelete(null);
        }}
        onSuccess={(msg) => {
          alert(msg);
          loadRecipes();
        }}
      />
    </div>
  );
}

function BrowserEditProductModal({ product, onClose, onSuccess }) {
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
      onSuccess();
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} color="var(--accent-emerald)" /> Edycja produktu (Dietetyk & Admin)
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>
        {error && <div style={{ color: 'var(--accent-rose)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Nazwa produktu*</label>
            <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sklep</label>
              <select className="form-input" value={form.store} onChange={e => setForm(f => ({ ...f, store: e.target.value }))}>
                <option value="Lidl">Lidl</option>
                <option value="Biedronka">Biedronka</option>
                <option value="Kaufland">Kaufland</option>
                <option value="Carrefour">Carrefour</option>
                <option value="Ogolne">Ogólne</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kategoria</label>
              <input className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Marka</label>
              <input className="form-input" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kod kreskowy</label>
              <input className="form-input" value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Kcal</label>
              <input type="number" step="0.1" className="form-input" value={form.calories_per_100g} onChange={e => setForm(f => ({ ...f, calories_per_100g: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Białko</label>
              <input type="number" step="0.1" className="form-input" value={form.protein_per_100g} onChange={e => setForm(f => ({ ...f, protein_per_100g: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tłuszcz</label>
              <input type="number" step="0.1" className="form-input" value={form.fat_per_100g} onChange={e => setForm(f => ({ ...f, fat_per_100g: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Węgle</label>
              <input type="number" step="0.1" className="form-input" value={form.carbs_per_100g} onChange={e => setForm(f => ({ ...f, carbs_per_100g: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Anuluj</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Zapisuję...' : 'Zapisz produkt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BrowserEditRecipeModal({ recipe, onClose, onSuccess, onDelete }) {
  const [form, setForm] = useState({
    title: recipe.title || '',
    category: recipe.category || 'Obiad',
    preparation_time_minutes: recipe.preparation_time_minutes || 20,
    default_portions: recipe.default_portions || 1.0,
    instructions: recipe.instructions || '',
    image_url: recipe.image_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await recipesApi.uploadImage(file);
      setForm(f => ({ ...f, image_url: res.image_url }));
    } catch (err) {
      alert(`Błąd uploadu: ${err.message}`);
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
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '550px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Edit3 size={18} color="var(--accent-emerald)" /> Edycja przepisu (Dietetyk & Admin)
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(recipe);
                }}
                className="btn btn-secondary btn-sm"
                style={{
                  color: '#f43f5e',
                  borderColor: 'rgba(244, 63, 94, 0.5)',
                  background: 'rgba(244, 63, 94, 0.12)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
                title="Usuń ten przepis z bazy danych"
              >
                <Trash2 size={14} /> Usuń przepis
              </button>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
          </div>
        </div>

        {/* Karta Wartości Odżywczych */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '10px',
          padding: '0.75rem 0.9rem',
          marginBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Flame size={15} /> Wartości odżywcze dania (1 porcja):
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Kalorie</span>
              <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1rem' }}>
                {Math.round(recipe.calories || 0)} <span style={{ fontSize: '0.7rem' }}>kcal</span>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Białko</span>
              <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1rem' }}>
                {recipe.protein_g ?? 0}g
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tłuszcze</span>
              <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '1rem' }}>
                {recipe.fat_g ?? 0}g
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Węgle</span>
              <div style={{ fontWeight: 800, color: '#a78bfa', fontSize: '1rem' }}>
                {recipe.carbs_g ?? 0}g
              </div>
            </div>
          </div>

          {(recipe.calories_female || recipe.calories_male) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.45rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
              <span>👩 K: <strong style={{ color: '#fff' }}>{Math.round(recipe.calories_female || 0)} kcal</strong></span>
              <span>👨 M: <strong style={{ color: '#fff' }}>{Math.round(recipe.calories_male || 0)} kcal</strong></span>
            </div>
          )}
        </div>
        {error && <div style={{ color: 'var(--accent-rose)', marginBottom: '0.75rem', fontSize: '0.85rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Nazwa dania*</label>
            <input className="form-input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kategoria</label>
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
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Czas (min)</label>
              <input type="number" className="form-input" value={form.preparation_time_minutes} onChange={e => setForm(f => ({ ...f, preparation_time_minutes: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Porcje</label>
              <input type="number" step="0.5" className="form-input" value={form.default_portions} onChange={e => setForm(f => ({ ...f, default_portions: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Zdjęcie (URL lub upload)</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input className="form-input" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} style={{ flex: 1 }} />
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Upload size={13} /> {uploadingImage ? 'Wgrywam...' : 'Plik'}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
              </label>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sposób przygotowania</label>
            <textarea rows="3" className="form-input" value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(recipe);
                }}
                className="btn btn-secondary"
                style={{
                  color: '#fff',
                  borderColor: '#f43f5e',
                  background: '#dc2626',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 700,
                }}
                title="Usuń ten przepis z bazy danych"
              >
                <Trash2 size={15} /> Usuń przepis
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">Anuluj</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Zapisuję...' : 'Zapisz przepis'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
