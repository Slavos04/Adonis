import React, { useState, useEffect } from 'react';
import { dietPlansApi } from '../api/client';
import { Package, Calendar, Check, Search, Sparkles, X, ChevronRight, Layers, Flame, Clock } from 'lucide-react';

export function PatientLoadPackageModal({ isOpen, onClose, onPackageLoaded, initialStartDate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [startDate, setStartDate] = useState(initialStartDate || new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      if (initialStartDate) setStartDate(initialStartDate);
    }
  }, [isOpen, initialStartDate]);

  async function loadTemplates() {
    setLoading(true);
    try {
      const data = await dietPlansApi.getTemplates();
      setTemplates(data || []);
      if (data && data.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(data[0].id);
      }
    } catch (err) {
      console.error('Błąd pobierania pakietów:', err);
    } finally {
      setLoading(false);
    }
  }

  // Kategorie z listy szablonów
  const categories = ['Wszystkie', ...new Set(templates.map(t => t.category).filter(Boolean))];

  const filteredTemplates = templates.filter(t => {
    const matchesCat = selectedCategory === 'Wszystkie' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  async function handleLoadPackage(e) {
    e.preventDefault();
    if (!selectedTemplateId) return;

    setSubmitting(true);
    setSuccessMessage(null);
    try {
      const res = await dietPlansApi.loadPackageByPatient({
        template_id: selectedTemplateId,
        start_date: startDate,
      });

      setSuccessMessage(res.message || 'Pakiet został pomyślnie załadowany!');
      if (onPackageLoaded) {
        onPackageLoaded();
      }
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err) {
      alert(`Błąd ładowania pakietu: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-emerald), #059669)', padding: '0.6rem', borderRadius: '10px', color: '#fff' }}>
              <Package size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                Pakiety Diet od Dietetyka
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Wybierz pakiet diety przesłany przez Twojego dietetyka i wdróż go do kalendarza
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm">✕</button>
        </div>

        {successMessage && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <Check size={18} /> {successMessage}
          </div>
        )}

        <form onSubmit={handleLoadPackage}>
          {/* Wybór daty rozpoczęcia */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} color="var(--accent-emerald)" /> Data rozpoczęcia jadłospisu w kalendarzu*:
              </label>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Pakiet rozłoży posiłki na 7 kolejnych dni, a w razie braku nowej paczki będzie automatycznie kontynuowany.
              </div>
            </div>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                background: '#111827',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            />
          </div>

          {/* Wyszukiwarka i filtry kategorii */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '11px' }} />
                <input
                  type="text"
                  placeholder="Szukaj pakietu (np. lekkostrawna, Colitis ulcerosa, redukcyjna, płynna)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#111827',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Pigułki kategorii */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: selectedCategory === cat ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.04)',
                    color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lista dostępnych pakietów */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(245px, 1fr))',
            gap: '0.85rem',
            maxHeight: '360px',
            overflowY: 'auto',
            paddingRight: '4px',
            marginBottom: '1.25rem',
          }}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Ładowanie dostępnych pakietów...
              </div>
            ) : templates.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <p style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '0.5rem' }}>Brak pakietów diet od dietetyka</p>
                <p style={{ fontSize: '0.85rem', maxWidth: '500px', margin: '0 auto' }}>Twój dietetyk nie przesłał Ci jeszcze żadnego pakietu diety. Gdy dietetyk prześle Ci pakiet, pojawi się on w tym miejscu i będziesz mógł wdrożyć go na dowolny tydzień.</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Brak pakietów spełniających kryteria wyszukiwania.
              </div>
            ) : (
              filteredTemplates.map(tpl => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    style={{
                      background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '2px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          {tpl.category}
                        </span>
                        {isSelected && (
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Check size={13} />
                          </div>
                        )}
                      </div>

                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: isSelected ? '#34d399' : '#fff' }}>
                        {tpl.name}
                      </h4>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.75rem 0', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {tpl.description || 'Kompletny zbilansowany tygodniowy jadłospis z przepisami z Lidla i Biedronki.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', color: 'var(--text-dim)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fbbf24', fontWeight: 700 }}>
                        <Flame size={12} /> {tpl.target_calories} kcal
                      </span>
                      <span>{tpl.meals_per_day} posiłków/dzień</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Podgląd wybranego pakietu i przyciski */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div>
              {selectedTemplate ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Wybrany pakiet: <strong style={{ color: '#34d399' }}>{selectedTemplate.name}</strong> ({selectedTemplate.target_calories} kcal)
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-rose)' }}>Wybierz pakiet z powyższej listy</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Anuluj
              </button>
              <button
                type="submit"
                disabled={!selectedTemplateId || submitting}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Package size={16} />
                {submitting ? 'Wdrażanie...' : 'Załaduj pakiet do kalendarza'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientLoadPackageModal;
