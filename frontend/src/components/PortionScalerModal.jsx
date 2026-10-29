import React, { useState, useEffect } from 'react';
import { recipesApi } from '../api/client';
import { X, Scale, Flame, Award, Clock, ChefHat, Info, Image, Trash2, Edit3 } from 'lucide-react';

export function PortionScalerModal({ recipeId, initialPortions = 1.0, onClose, onEdit, onDelete }) {
  const [portions, setPortions] = useState(initialPortions);
  const [scaledData, setScaledData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScaled(portions);
  }, [recipeId, portions]);

  async function fetchScaled(targetPortions) {
    if (targetPortions <= 0) return;
    setLoading(true);
    try {
      const data = await recipesApi.scale(recipeId, targetPortions);
      setScaledData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const presets = [0.5, 1.0, 1.5, 2.0, 3.0];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '0.6rem', borderRadius: '12px' }}>
              <ChefHat size={26} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Opis Dania i Opcje Porcji</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                <span className="badge badge-emerald">{scaledData?.category || 'Danie fitness'}</span>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(56,189,248,0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600, border: '1px solid rgba(56,189,248,0.25)' }}>
                  <Clock size={13} /> Czas przygotowania: {scaledData?.preparation_time_minutes ? `${scaledData.preparation_time_minutes} min` : '20 min'}
                </span>

              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {onEdit && scaledData && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(scaledData);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                title="Przejdź do edycji tego przepisu"
              >
                <Edit3 size={14} /> Edytuj
              </button>
            )}
            {onDelete && scaledData && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(scaledData);
                }}
                className="btn btn-secondary btn-sm"
                style={{
                  color: '#f43f5e',
                  borderColor: 'rgba(244, 63, 94, 0.5)',
                  background: 'rgba(244, 63, 94, 0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
                title="Usuń ten przepis z bazy danych"
              >
                <Trash2 size={14} /> Usuń przepis
              </button>
            )}
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Dish Photo if available */}
        {scaledData?.image_url && (
          <div
            style={{
              width: '100%',
              height: '220px',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <img
              src={scaledData.image_url}
              alt={scaledData.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(15,23,42,0.85))',
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="badge badge-emerald">{scaledData.category || 'Danie fitness'}</span>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                {scaledData.preparation_time_minutes ? `${scaledData.preparation_time_minutes} min` : 'Szybkie danie'}
              </span>
            </div>
          </div>
        )}

        {/* Portion Selector Controls */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale size={18} color="#10b981" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Opcje skalowania porcji:</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10"
                value={portions}
                onChange={(e) => setPortions(parseFloat(e.target.value) || 1.0)}
                style={{
                  background: '#1f2937',
                  border: '1px solid var(--border-active)',
                  color: '#fff',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  width: '80px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textAlign: 'center',
                }}
              />
              <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>porcji</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setPortions(p)}
                className={`btn btn-sm ${portions === p ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                {p} {p === 1 ? 'porcja' : 'porcje'}
              </button>
            ))}
          </div>
        </div>

        {error && <div style={{ color: 'var(--accent-rose)', marginBottom: '1rem' }}>{error}</div>}

        {scaledData && (
          <div>
            {/* Macro summary pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="macro-pill" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)' }}>
                <span className="label">Kalorie</span>
                <span className="value" style={{ color: '#34d399' }}>{scaledData.total_calories} kcal</span>
              </div>
              <div className="macro-pill" style={{ borderColor: 'rgba(14,165,233,0.3)' }}>
                <span className="label">Białko</span>
                <span className="value" style={{ color: '#38bdf8' }}>{scaledData.total_protein_g} g</span>
              </div>
              <div className="macro-pill" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                <span className="label">Tłuszcze</span>
                <span className="value" style={{ color: '#fbbf24' }}>{scaledData.total_fat_g} g</span>
              </div>
              <div className="macro-pill" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
                <span className="label">Węglowodany</span>
                <span className="value" style={{ color: '#818cf8' }}>{scaledData.total_carbs_g} g</span>
              </div>
            </div>

            {/* Ingredients table */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Składniki z Dyskontów (dla {portions}x porcji):</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {scaledData.ingredients.map((item) => (
                <div
                  key={item.ingredient_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.product_name}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span className={`badge ${item.store === 'Lidl' ? 'badge-lidl' : item.store === 'Biedronka' ? 'badge-biedronka' : 'badge-emerald'}`}>
                        {item.store}
                      </span>
                      {item.brand && <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.brand}</span>}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#10b981' }}>
                      {item.scaled_amount} {item.unit}
                      {item.kitchen_measure && (
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#a7f3d0', marginLeft: '0.45rem' }}>
                          ({item.kitchen_measure})
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      👩 K: <strong style={{ color: '#f472b6' }}>{item.amount_female_g || Math.round(item.original_amount * 0.82)} {item.unit}</strong> | 👨 M: <strong style={{ color: '#60a5fa' }}>{item.amount_male_g || Math.round(item.original_amount * 1.18)} {item.unit}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Instrukcja Przygotowania Krok po Kroku:</h3>
            <div style={{ whiteSpace: 'pre-line', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {scaledData.instructions || 'Brak opisu przygotowania.'}
            </div>

            {/* Bottom Actions for Dietitian (if onEdit or onDelete passed) */}
            {(onEdit || onDelete) && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                {onDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onDelete(scaledData);
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
                    <Trash2 size={16} /> Usuń przepis
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEdit(scaledData);
                      }}
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Edit3 size={15} /> Edytuj przepis
                    </button>
                  )}
                  <button type="button" onClick={onClose} className="btn btn-secondary">
                    Zamknij
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default PortionScalerModal;
