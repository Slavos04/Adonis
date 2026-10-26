import React, { useState, useEffect } from 'react';
import { dietPlansApi } from '../api/client';
import { ShoppingBag, Check, EyeOff, Calendar, Copy, CheckCheck, Store, Printer, Sparkles } from 'lucide-react';

export function ShoppingListWidget() {
  const today = new Date();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
  const nextFriday = new Date(nextMonday);
  nextFriday.setDate(nextMonday.getDate() + 4);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(new Date(today.getTime() + 5 * 86400000)));
  const [storeFilter, setStoreFilter] = useState('ALL');
  const [oneStopStore, setOneStopStore] = useState('OFF'); // 'OFF' | 'Kaufland' | 'Carrefour' | 'Lidl' | 'Biedronka'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadShoppingList();
  }, [startDate, endDate]);

  async function loadShoppingList() {
    setLoading(true);
    try {
      const data = await dietPlansApi.getShoppingList(startDate, endDate);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(item, field) {
    const newValue = !item[field];
    try {
      await dietPlansApi.toggleShoppingItem(item.id, { [field]: newValue });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, [field]: newValue } : i))
      );
    } catch (err) {
      alert(`Błąd aktualizacji: ${err.message}`);
    }
  }

  // When One-Stop Shopping mode is active, we display all items as available in that chosen store
  const displayItems = items
    .filter((item) => {
      if (oneStopStore !== 'OFF') {
        // In one-stop mode, show all products consolidated for the target store
        return true;
      }
      if (storeFilter === 'LIDL') return item.store === 'Lidl';
      if (storeFilter === 'BIEDRONKA') return item.store === 'Biedronka';
      if (storeFilter === 'KAUFLAND') return item.store === 'Kaufland';
      if (storeFilter === 'CARREFOUR') return item.store === 'Carrefour';
      return true;
    })
    .map((item) => {
      if (oneStopStore !== 'OFF') {
        return {
          ...item,
          displayStore: oneStopStore,
          originalStore: item.store,
          isConverted: item.store !== oneStopStore,
        };
      }
      return {
        ...item,
        displayStore: item.store,
        originalStore: item.store,
        isConverted: false,
      };
    });

  const boughtCount = displayItems.filter((i) => i.is_bought).length;
  const skippedCount = displayItems.filter((i) => i.is_skipped).length;

  function getStoreBadgeClass(store) {
    const s = (store || '').toLowerCase();
    if (s === 'lidl') return 'badge-lidl';
    if (s === 'biedronka') return 'badge-biedronka';
    if (s === 'kaufland') return 'badge-kaufland';
    if (s === 'carrefour') return 'badge-carrefour';
    return 'badge-emerald';
  }

  function handleCopyToClipboard() {
    const storeLabel = oneStopStore !== 'OFF' ? ` w markecie ${oneStopStore}` : '';
    const lines = [
      `🛒 ADONIS — LISTA ZAKUPÓW${storeLabel} (${startDate} - ${endDate})`,
      '----------------------------------------',
      ...displayItems
        .filter((i) => !i.is_skipped)
        .map(
          (i) =>
            `[${i.is_bought ? 'X' : ' '}] ${i.product_name} - ${i.amount} ${i.unit} (${i.displayStore})`
        ),
      '----------------------------------------',
      `Łącznie pozycji do kupienia: ${displayItems.filter((i) => !i.is_skipped).length}`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="glass-panel" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={24} color="#10b981" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Inteligentna Lista Zakupów</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Automatyczna agregacja produktów z <strong>Kaufland</strong>, <strong>Carrefour</strong>, <strong>Lidl</strong> i <strong>Biedronka</strong> z opcją zrobienia całych zakupów w jednym wybranym markecie.
          </p>
        </div>

        {/* Date Selector & Copy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <Calendar size={16} color="var(--text-muted)" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem' }}
            />
            <span style={{ color: 'var(--text-dim)' }}>do</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem' }}
            />
          </div>

          <button
            onClick={handleCopyToClipboard}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Kopiuj czytelną listę do schowka"
          >
            {copied ? <CheckCheck size={15} color="#10b981" /> : <Copy size={15} />}
            {copied ? 'Skopiowano!' : 'Kopiuj listę'}
          </button>

          <button
            onClick={() => window.print()}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Drukuj listę zakupów"
          >
            <Printer size={15} /> Drukuj
          </button>
        </div>
      </div>

      {/* ONE-STOP SHOPPING CALLOUT / CHOOSER */}
      <div
        style={{
          background: oneStopStore !== 'OFF' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
          border: oneStopStore !== 'OFF' ? '1px solid rgba(16,185,129,0.35)' : '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Store size={18} color={oneStopStore !== 'OFF' ? '#10b981' : 'var(--text-dim)'} />
            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
              Zrób wszystkie zakupy w jednym sklepie:
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              (automatycznie dostosowuje wszystkie artykuły do jednego marketu)
            </span>
          </div>

          {oneStopStore !== 'OFF' && (
            <button
              onClick={() => setOneStopStore('OFF')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
            >
              ↺ Wyłącz tryb jednego sklepu
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'Kaufland', label: '🔴 Kaufland', badge: 'badge-kaufland' },
            { id: 'Carrefour', label: '🔵 Carrefour', badge: 'badge-carrefour' },
            { id: 'Biedronka', label: '🟡 Biedronka', badge: 'badge-biedronka' },
            { id: 'Lidl', label: '🔷 Lidl', badge: 'badge-lidl' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setOneStopStore((prev) => (prev === s.id ? 'OFF' : s.id));
                setStoreFilter('ALL');
              }}
              className={`btn btn-sm ${oneStopStore === s.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                borderColor: oneStopStore === s.id ? 'var(--accent-emerald)' : undefined,
              }}
            >
              Kup wszystko w {s.id}
            </button>
          ))}
        </div>

        {oneStopStore !== 'OFF' && (
          <div style={{ fontSize: '0.82rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} />
            <span>
              Aktywny tryb <strong>{oneStopStore}</strong>: Cała Twoja lista ({displayItems.length} produktów) jest gotowa do kupienia w jednym markecie! Produkty oryginalnie z innych sieci zostały opatrzone wskazówką o odpowiedniku.
            </span>
          </div>
        )}
      </div>

      {/* Store filter tabs (when one-stop mode is OFF) */}
      {oneStopStore === 'OFF' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStoreFilter('ALL')}
              className={`btn btn-sm ${storeFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Wszystkie ({items.length})
            </button>
            <button
              onClick={() => setStoreFilter('KAUFLAND')}
              className={`btn btn-sm ${storeFilter === 'KAUFLAND' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Kaufland ({items.filter((i) => i.store === 'Kaufland').length})
            </button>
            <button
              onClick={() => setStoreFilter('CARREFOUR')}
              className={`btn btn-sm ${storeFilter === 'CARREFOUR' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Carrefour ({items.filter((i) => i.store === 'Carrefour').length})
            </button>
            <button
              onClick={() => setStoreFilter('LIDL')}
              className={`btn btn-sm ${storeFilter === 'LIDL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Lidl ({items.filter((i) => i.store === 'Lidl').length})
            </button>
            <button
              onClick={() => setStoreFilter('BIEDRONKA')}
              className={`btn btn-sm ${storeFilter === 'BIEDRONKA' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Biedronka ({items.filter((i) => i.store === 'Biedronka').length})
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Kupiono: <strong style={{ color: '#10b981' }}>{boughtCount}</strong> | W lodówce:{' '}
            <strong style={{ color: '#fbbf24' }}>{skippedCount}</strong> | Do kupienia:{' '}
            <strong style={{ color: '#fff' }}>{displayItems.length - boughtCount - skippedCount}</strong>
          </div>
        </div>
      )}

      {loading && (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
          Generowanie inteligentnej listy zakupów...
        </div>
      )}

      {error && <div style={{ color: 'var(--accent-rose)', padding: '1rem' }}>{error}</div>}

      {!loading && displayItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          Brak zaplanowanych posiłków w wybranym przedziale czasowym.
        </div>
      )}

      {/* List items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {displayItems.map((item) => (
          <div
            key={item.product_id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              background: item.is_bought
                ? 'rgba(16,185,129,0.06)'
                : item.is_skipped
                ? 'rgba(255,255,255,0.01)'
                : 'rgba(255,255,255,0.03)',
              border: '1px solid',
              borderColor: item.is_bought
                ? 'rgba(16,185,129,0.3)'
                : item.is_skipped
                ? 'rgba(255,255,255,0.04)'
                : 'var(--border-subtle)',
              opacity: item.is_skipped ? 0.45 : 1,
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Bought Checkbox */}
              <button
                onClick={() => handleToggle(item, 'is_bought')}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: item.is_bought ? 'none' : '2px solid var(--border-subtle)',
                  background: item.is_bought ? '#10b981' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                }}
                title={item.is_bought ? 'Oznacz jako niekupione' : 'Oznacz jako kupione'}
              >
                {item.is_bought && <Check size={16} strokeWidth={3} />}
              </button>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textDecoration: item.is_bought || item.is_skipped ? 'line-through' : 'none',
                    color: item.is_bought ? '#9ca3af' : '#fff',
                  }}
                >
                  {item.product_name}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                  <span className={`badge ${getStoreBadgeClass(item.displayStore)}`}>
                    {item.displayStore}
                  </span>
                  {item.isConverted && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', background: 'rgba(245,158,11,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      Odpowiednik w {item.displayStore} (baza: {item.originalStore})
                    </span>
                  )}
                  {item.brand && <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.brand}</span>}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    (Użyte w {item.recipes_count} {item.recipes_count === 1 ? 'przepisie' : 'przepisach'})
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: item.is_bought ? '#9ca3af' : '#10b981',
                    textDecoration: item.is_skipped ? 'line-through' : 'none',
                  }}
                >
                  {item.amount}
                </span>{' '}
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.unit}</span>
              </div>

              {/* Skip / "Mam w lodówce" button */}
              <button
                onClick={() => handleToggle(item, 'is_skipped')}
                className="btn btn-secondary btn-sm"
                style={{
                  background: item.is_skipped ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.03)',
                  borderColor: item.is_skipped ? 'rgba(245,158,11,0.4)' : 'var(--border-subtle)',
                  color: item.is_skipped ? '#fbbf24' : 'var(--text-muted)',
                }}
                title={item.is_skipped ? 'Przywróć na listę' : 'Mam w domu / pomiń'}
              >
                <EyeOff size={14} />
                {item.is_skipped ? 'W lodówce' : 'Mam w domu'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
