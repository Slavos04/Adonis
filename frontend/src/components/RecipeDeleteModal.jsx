import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert, RefreshCw, Trash2, CheckCircle, ArrowRight, BookOpen, User, Layers } from 'lucide-react';
import { recipesApi } from '../api/client';

export function RecipeDeleteModal({ isOpen, recipe, allRecipes = [], onClose, onSuccess }) {
  const [loadingUsage, setLoadingUsage] = useState(true);
  const [usageData, setUsageData] = useState(null);
  const [replacementId, setReplacementId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && recipe) {
      loadUsage();
    } else {
      setUsageData(null);
      setReplacementId('');
      setError(null);
    }
  }, [isOpen, recipe?.id]);

  async function loadUsage() {
    setLoadingUsage(true);
    setError(null);
    try {
      const data = await recipesApi.checkUsage(recipe.id);
      setUsageData(data);
      // Domyślnie zasugeruj przepis z tej samej kategorii
      const sameCategory = allRecipes.find(r => r.id !== recipe.id && r.category === recipe.category);
      if (sameCategory) {
        setReplacementId(sameCategory.id.toString());
      } else {
        const anyOther = allRecipes.find(r => r.id !== recipe.id);
        if (anyOther) setReplacementId(anyOther.id.toString());
      }
    } catch (err) {
      setError(err.message || 'Nie udało się sprawdzić powiązań przepisu.');
    } finally {
      setLoadingUsage(false);
    }
  }

  if (!isOpen || !recipe) return null;

  async function handleDirectDelete() {
    if (!window.confirm(`Czy na pewno trwale usunąć przepis "${recipe.title}"?`)) return;
    setSubmitting(true);
    setError(null);
    try {
      await recipesApi.delete(recipe.id, true);
      if (onSuccess) onSuccess(`Przepis "${recipe.title}" został pomyślnie usunięty.`);
      onClose();
    } catch (err) {
      setError(err.message || 'Błąd podczas usuwania przepisu.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReplaceAndDelete(e) {
    e.preventDefault();
    if (!replacementId) {
      setError('Proszę wybrać przepis zamienny z listy.');
      return;
    }
    const replRecipe = allRecipes.find(r => r.id === parseInt(replacementId));
    const confirmMsg = `Czy na pewno chcesz zastąpić przepis "${recipe.title}" przepisem "${replRecipe?.title || '#' + replacementId}" w ${usageData.total_usages} miejscach, a następnie usunąć stary przepis?`;
    if (!window.confirm(confirmMsg)) return;

    setSubmitting(true);
    setError(null);
    try {
      const res = await recipesApi.replace(recipe.id, {
        replacement_recipe_id: parseInt(replacementId),
        delete_old: true
      });
      if (onSuccess) onSuccess(res.message);
      onClose();
    } catch (err) {
      setError(err.message || 'Błąd podczas zastępowania przepisu.');
    } finally {
      setSubmitting(false);
    }
  }

  const otherRecipes = allRecipes.filter(r => r.id !== recipe.id);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1300 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '620px',
          width: '92%',
          background: '#0f172a',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px rgba(244, 63, 94, 0.15)',
          padding: '1.75rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e'
            }}>
              <Trash2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                Usuwanie przepisu: {recipe.title}
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Kategoria: <strong>{recipe.category}</strong> • ID: #{recipe.id}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem', borderRadius: '8px' }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem'
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {loadingUsage ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#94a3b8' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.75rem', color: '#f43f5e' }} />
            <div>Sprawdzanie powiązań z pakietami i planami pacjentów...</div>
          </div>
        ) : usageData && !usageData.is_used ? (
          /* Przepis nie jest używany */
          <div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <CheckCircle size={22} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  Bezpieczne usunięcie
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  Ten przepis <strong>nie jest przypisany</strong> do żadnego szablonu diety ani do zaplanowanych posiłków pacjentów.
                  Możesz go bezpiecznie usunąć z bazy danych Adonis.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Anuluj
              </button>
              <button
                type="button"
                onClick={handleDirectDelete}
                disabled={submitting}
                className="btn btn-danger"
                style={{ background: '#f43f5e', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                {submitting ? <RefreshCw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Usuń przepis trwale
              </button>
            </div>
          </div>
        ) : usageData && usageData.is_used ? (
          /* Przepis jest używany - Blokada z ostrzeżeniem + lista miejsc + zastępowanie */
          <div>
            <div style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <ShieldAlert size={24} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#fda4af', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                  Blokada integralności: Przepis jest aktywnie używany ({usageData.total_usages} powiązań)
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  Bezpośrednie usunięcie spowodowałoby błędy w pakietach lub zniknięcie posiłku z kalendarza pacjenta.
                  Skorzystaj z narzędzia <strong>łatwego zastępowania</strong> poniżej.
                </p>
              </div>
            </div>

            {/* Lista miejsc użycia */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={15} /> Miejsca występowania przepisu:
              </div>

              <div style={{ maxHeight: '160px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {usageData.template_usages.map((tpl, tIdx) => (
                  <div key={tIdx} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                    <div style={{ color: '#38bdf8', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                      <span>📦 Pakiet: {tpl.template_name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{tpl.category}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                      {tpl.occurrences.join(' • ')}
                    </div>
                  </div>
                ))}

                {usageData.planned_usages.map((pm, pIdx) => (
                  <div key={pIdx} style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                    <div style={{ color: '#34d399', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                      <span>👤 Pacjent: {pm.patient_name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>{pm.date}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                      Posiłek: <strong>{pm.meal_type}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formularz łatwego zastępowania */}
            <form onSubmit={handleReplaceAndDelete} style={{
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <RefreshCw size={16} /> Wybierz przepis zamienny:*
                </label>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>
                  Wybrane danie automatycznie zastąpi stary przepis we wszystkich powyższych pakietach i planach pacjentów, a usuwany przepis zostanie trwale skasowany.
                </p>

                <select
                  value={replacementId}
                  onChange={(e) => setReplacementId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#111827',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="">— Wybierz przepis zastępczy —</option>
                  {otherRecipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.category}] {r.title} ({r.calories} kcal)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={submitting || !replacementId}
                  className="btn btn-primary"
                  style={{
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 700,
                    opacity: submitting || !replacementId ? 0.6 : 1
                  }}
                >
                  {submitting ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  Zastąp w jadłospisach i usuń przepis
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
export default RecipeDeleteModal;

