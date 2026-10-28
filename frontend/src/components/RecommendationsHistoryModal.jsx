import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, UserCheck, Plus, Send, Clock, Package, ChevronDown, ChevronUp, Utensils, Flame, CheckCircle2 } from 'lucide-react';
import { authApi, dietPlansApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function RecommendationsHistoryModal({ isOpen, onClose, patientId, isDietitian = false, onRecommendationAdded }) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('recommendations'); // 'recommendations' | 'diet_packages'
  const [history, setHistory] = useState([]);
  const [packages, setPackages] = useState([]);
  const [expandedPkgId, setExpandedPkgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('Oficjalne zalecenia dietetyczne');
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadAll();
      setSuccessMsg(null);
    }
  }, [isOpen, patientId]);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Historia zaleceń
      let recData = [];
      if (patientId) {
        recData = await authApi.getPatientRecommendationsHistory(patientId);
      } else {
        recData = await authApi.getMyRecommendationsHistory();
      }
      setHistory(recData || []);

      // 2. Pakiety i szablony jadłospisów
      try {
        const pkgData = await dietPlansApi.getTemplates();
        setPackages(pkgData || []);
        if (pkgData && pkgData.length > 0 && !expandedPkgId) {
          setExpandedPkgId(pkgData[0].id);
        }
      } catch (_) {}

    } catch (err) {
      console.error('Błąd pobierania historii:', err);
      setError(err.message || 'Nie udało się pobrać historii.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecommendation = async (e) => {
    e.preventDefault();
    if (!newContent.trim() || !patientId) return;

    try {
      setSubmitting(true);
      setError(null);
      const created = await authApi.addPatientRecommendation(patientId, {
        title: newTitle.trim() || 'Oficjalne zalecenia dietetyczne',
        content: newContent.trim()
      });
      setHistory(prev => [created, ...prev]);
      setNewContent('');
      setSuccessMsg('Nowe zalecenie zostało zapisane, a pacjent otrzymał powiadomienie!');
      if (onRecommendationAdded) {
        onRecommendationAdded(created);
      }
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.message || 'Nie udało się zapisać zalecenia.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface, #1e293b)',
          border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(99,102,241,0.08) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#10b981', color: '#fff', padding: '0.5rem', borderRadius: '10px' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main, #f8fafc)', margin: 0 }}>
                Historia zaleceń i jadłospisów
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', margin: 0 }}>
                Pełny wgląd we wszystkie wytyczne dietetyczne oraz przypisane pakiety diet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Zamknij"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.1)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('recommendations')}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              background: activeTab === 'recommendations' ? 'rgba(16,185,129,0.12)' : 'transparent',
              color: activeTab === 'recommendations' ? 'var(--accent-emerald)' : 'var(--text-muted)',
              border: 'none',
              borderBottom: activeTab === 'recommendations' ? '2px solid var(--accent-emerald)' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Sparkles size={16} />
            Wytyczne i zalecenia ({history.length + (profile?.official_recommendations && !history.some(h => h.content === profile.official_recommendations) ? 1 : 0)})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diet_packages')}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              background: activeTab === 'diet_packages' ? 'rgba(99,102,241,0.12)' : 'transparent',
              color: activeTab === 'diet_packages' ? '#a5b4fc' : 'var(--text-muted)',
              border: 'none',
              borderBottom: activeTab === 'diet_packages' ? '2px solid #818cf8' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Package size={16} />
            Przypisane jadłospisy i pakiety ({packages.length})
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.875rem',
              }}
            >
              {successMsg}
            </div>
          )}

          {/* Form for Dietitian to add a new recommendation */}
          {activeTab === 'recommendations' && isDietitian && patientId && (
            <form
              onSubmit={handleAddRecommendation}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Plus size={16} color="#10b981" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
                  Wydaj nowe zalecenie dla pacjenta
                </span>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Tytuł zalecenia (np. Zmiana nawyków, Dieta redukcyjna...)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: '#1f2937',
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <textarea
                  rows={3}
                  required
                  placeholder="Wpisz szczegółowe wytyczne dla pacjenta... Zapisanie wygeneruje automatyczne powiadomienie."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: '#1f2937',
                    color: '#fff',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={submitting || !newContent.trim()}
                  className="btn btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <Send size={15} />
                  {submitting ? 'Zapisywanie...' : 'Opublikuj i powiadom pacjenta'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 1: Zalecenia */}
          {activeTab === 'recommendations' && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Ładowanie historii zaleceń...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Bieżące wytyczne z profilu jeśli nie ma w historii */}
                  {profile?.official_recommendations && !history.some(h => h.content === profile.official_recommendations) && (
                    <div
                      style={{
                        padding: '1.1rem 1.25rem',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: '#10b981', color: '#fff' }}>
                            AKTUALNE W PROFILU
                          </span>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                            Bieżące wytyczne żywieniowe
                          </h4>
                        </div>
                        {profile?.recommendations_updated_at && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(profile.recommendations_updated_at).toLocaleDateString('pl-PL')}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                        {profile.official_recommendations}
                      </p>
                    </div>
                  )}

                  {history.length === 0 && !profile?.official_recommendations ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                      <Clock size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>Brak zarejestrowanych zaleceń w historii.</p>
                      <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Wszystkie nowe zalecenia pojawią się w tym miejscu.</p>
                    </div>
                  ) : (
                    history.map((rec, index) => (
                      <div
                        key={rec.id || index}
                        style={{
                          padding: '1.1rem 1.25rem',
                          borderRadius: '12px',
                          background: index === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          border: index === 0 ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                backgroundColor: index === 0 ? '#10b981' : 'rgba(255,255,255,0.1)',
                                color: '#fff',
                              }}
                            >
                              {index === 0 ? 'NAJNOWSZE' : `#${history.length - index}`}
                            </span>
                            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                              {rec.title}
                            </h4>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {rec.dietitian_name && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <UserCheck size={13} color="#34d399" />
                                {rec.dietitian_name}
                              </span>
                            )}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Calendar size={13} />
                              {new Date(rec.created_at).toLocaleString('pl-PL', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, color: '#e2e8f0', whiteSpace: 'pre-line' }}>
                          {rec.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Przypisane pakiety i jadłospisy do wglądu */}
          {activeTab === 'diet_packages' && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Ładowanie przypisanych jadłospisów...
                </div>
              ) : packages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                  <Package size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontWeight: 600 }}>Brak przypisanych pakietów diet.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Gdy dietetyk przypisze pakiet diety, pojawi się on tutaj z pełnym jadłospisem do wglądu.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {packages.map((pkg) => {
                    const isExpanded = expandedPkgId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        style={{
                          borderRadius: '12px',
                          border: isExpanded ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border-subtle)',
                          background: isExpanded ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
                          overflow: 'hidden',
                          transition: 'all 0.2s',
                        }}
                      >
                        {/* Package card header */}
                        <div
                          onClick={() => setExpandedPkgId(isExpanded ? null : pkg.id)}
                          style={{
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <Package size={17} color="#818cf8" />
                              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                                {pkg.name}
                              </h4>
                              <span style={{ fontSize: '0.72rem', background: 'rgba(99,102,241,0.2)', color: '#c7d2fe', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                                {pkg.category}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                              <span>Kalorie: <strong style={{ color: 'var(--accent-emerald)' }}>{pkg.target_calories} kcal</strong></span>
                              <span>Posiłków dziennie: <strong style={{ color: '#fff' }}>{pkg.meals_per_day}</strong></span>
                              <span>Dni w planie: <strong style={{ color: '#fff' }}>{pkg.days_data?.length || 7} dni</strong></span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{isExpanded ? 'Zwiń' : 'Rozwiń jadłospis'}</span>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {/* Package description */}
                        {pkg.description && (
                          <div style={{ padding: '0 1.25rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                            {pkg.description}
                          </div>
                        )}

                        {/* Expandable 7-day Meal Plan */}
                        {isExpanded && pkg.days_data && pkg.days_data.length > 0 && (
                          <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.85rem' }}>
                            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Szczegółowy jadłospis tygodniowy:
                            </h5>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {pkg.days_data.map((day) => (
                                <div
                                  key={day.day_number}
                                  style={{
                                    background: 'rgba(0,0,0,0.25)',
                                    borderRadius: '8px',
                                    padding: '0.75rem 1rem',
                                    border: '1px solid var(--border-subtle)',
                                  }}
                                >
                                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--accent-emerald)', marginBottom: '0.45rem' }}>
                                    Dzień {day.day_number} — {day.day_name}
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                    {(day.meals || []).map((m, mIdx) => (
                                      <div
                                        key={mIdx}
                                        style={{
                                          background: 'rgba(255,255,255,0.03)',
                                          padding: '0.5rem 0.65rem',
                                          borderRadius: '6px',
                                          fontSize: '0.78rem',
                                          border: '1px solid rgba(255,255,255,0.05)',
                                        }}
                                      >
                                        <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.7rem' }}>
                                          {m.meal_type}
                                        </div>
                                        <div style={{ color: '#fff', fontWeight: 700, margin: '2px 0' }}>
                                          {m.recipe_title || `Przepis #${m.recipe_id}`}
                                        </div>
                                        <div style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                                          {m.recipe_calories ? `${Math.round(m.recipe_calories * (m.portions || 1.0))} kcal` : ''} • Porcja: {m.portions || 1.0}x
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-color, rgba(255,255,255,0.1))',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.15)',
          }}
        >
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '0.875rem',
              borderRadius: '8px',
              fontWeight: 700,
            }}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
