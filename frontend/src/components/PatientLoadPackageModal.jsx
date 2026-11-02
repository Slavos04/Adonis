import React, { useState, useEffect } from 'react';
import { dietPlansApi } from '../api/client';
import { Package, Calendar, Check, Search, Sparkles, X, Flame, Clock, Download, ArrowRight, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';

export function PatientLoadPackageModal({ isOpen, onClose, onPackageLoaded, initialStartDate }) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [startDate, setStartDate] = useState(initialStartDate || new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');
  const [submittingId, setSubmittingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadOverview();
      if (initialStartDate) setStartDate(initialStartDate);
    }
  }, [isOpen, initialStartDate]);

  async function loadOverview() {
    setLoading(true);
    try {
      const data = await dietPlansApi.getPatientPackagesOverview();
      setOverview(data || { current_diet: null, pending_diet: null, previous_diets: [] });
      if (data?.pending_diet) {
        setSelectedTemplateId(data.pending_diet.template_id);
        if (data.pending_diet.start_date) {
          setStartDate(data.pending_diet.start_date);
        }
      } else if (data?.current_diet) {
        setSelectedTemplateId(data.current_diet.template_id);
      }
    } catch (err) {
      console.error('Błąd pobierania podsumowania pakietów:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadPackage(templateId, customStartDate) {
    if (!templateId) return;
    setSubmittingId(templateId);
    setSuccessMessage(null);
    try {
      const res = await dietPlansApi.loadPackageByPatient({
        template_id: templateId,
        start_date: customStartDate || startDate,
      });

      setSuccessMessage(res.message || 'Pakiet został pomyślnie załadowany do Twojego kalendarza!');
      if (onPackageLoaded) {
        onPackageLoaded();
      }
      await loadOverview();
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1500);
    } catch (err) {
      alert(`Błąd ładowania pakietu: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  }

  if (!isOpen) return null;

  const currentDiet = overview?.current_diet;
  const pendingDiet = overview?.pending_diet;
  const previousDiets = (overview?.previous_diets || []).filter(d => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return d.name.toLowerCase().includes(q) || (d.category || '').toLowerCase().includes(q) || (d.notes || '').toLowerCase().includes(q);
  });

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-emerald), #059669)', padding: '0.6rem', borderRadius: '10px', color: '#fff' }}>
              <Package size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                Zarządzaj Jadłospisem i Pakietami Diety
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Przeglądaj swój aktualny jadłospis, oczekujące propozycje od dietetyka oraz historię przesłanych diet
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm">✕</button>
        </div>

        {/* Komunikat sukcesu */}
        {successMessage && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <CheckCircle2 size={18} /> {successMessage}
          </div>
        )}

        {/* Globalna data rozpoczęcia dla ładowanych diet */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          padding: '0.85rem 1.15rem',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
        }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={16} color="var(--accent-emerald)" /> Data rozpoczęcia diety w kalendarzu:
            </label>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Wybierz, od którego dnia jadłospis ma zostać wdrożony:
            </div>
            {pendingDiet?.start_date && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setStartDate(pendingDiet.start_date)}
                  className={`btn btn-xs ${startDate === pendingDiet.start_date ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
                >
                  📅 Wg zaleceń dietetyka: {pendingDiet.start_date}
                </button>
                <button
                  type="button"
                  onClick={() => setStartDate(new Date().toISOString().split('T')[0])}
                  className={`btn btn-xs ${startDate === new Date().toISOString().split('T')[0] ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
                >
                  📅 Od dziś: {new Date().toISOString().split('T')[0]}
                </button>
              </div>
            )}
          </div>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              background: '#111827',
              border: '1.5px solid var(--accent-emerald)',
              color: '#fff',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.92rem',
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            Ładowanie Twoich pakietów diety...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* SEKCJA 1: DIETA OCZEKUJĄCA (Najwyższy priorytet - jeśli dietetyk przesłał nowy jadłospis) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <Clock size={16} color="#fbbf24" />
                <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: '#fbbf24' }}>
                  1. Dieta Oczekująca na Załadowanie
                </h3>
                <span className="badge" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontSize: '0.7rem', fontWeight: 800 }}>
                  Wymaga Twojego potwierdzenia
                </span>
              </div>

              {pendingDiet ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
                  border: '2px solid rgba(245, 158, 11, 0.5)',
                  borderRadius: '12px',
                  padding: '1.15rem 1.25rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                          {pendingDiet.category}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>
                          Przesłano: {pendingDiet.created_at ? new Date(pendingDiet.created_at).toLocaleDateString('pl-PL') : 'Ostatnio'}
                        </span>
                        {pendingDiet.dietitian_name && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            • Dietetyk: {pendingDiet.dietitian_name}
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                        {pendingDiet.name}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0', lineHeight: 1.4 }}>
                        {pendingDiet.description || 'Nowy zbilansowany tygodniowy jadłospis przygotowany przez Twojego dietetyka.'}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                        <Flame size={16} color="#fbbf24" /> {pendingDiet.target_calories} kcal
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        {pendingDiet.meals_per_day} posiłków dziennie
                      </div>
                    </div>
                  </div>

                  {pendingDiet.notes && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'rgba(0,0,0,0.2)', padding: '0.45rem 0.75rem', borderRadius: '6px', marginBottom: '1rem' }}>
                      💬 <em>Wskazówka dietetyka:</em> {pendingDiet.notes}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <a
                      href={dietPlansApi.getTemplatePdfUrl(pendingDiet.template_id)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                    >
                      <Download size={14} /> Pobierz PDF
                    </a>
                    <button
                      type="button"
                      disabled={submittingId === pendingDiet.template_id}
                      onClick={() => handleLoadPackage(pendingDiet.template_id)}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}
                    >
                      <Package size={15} />
                      {submittingId === pendingDiet.template_id ? 'Wdrażanie...' : `Załaduj ten jadłospis od ${startDate}`}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <Check size={16} color="var(--accent-emerald)" />
                  Brak oczekujących jadłospisów — wszystkie przesłane przez dietetyka plany zostały już przez Ciebie załadowane.
                </div>
              )}
            </div>

            {/* SEKCJA 2: DIETA AKTUALNA */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                <CheckCircle2 size={16} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0 }}>
                  2. Dieta Aktualna (W realizacji)
                </h3>
              </div>

              {currentDiet ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '12px',
                  padding: '1.1rem 1.25rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                          ● Aktualny plan
                        </span>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                          {currentDiet.category}
                        </span>
                        {currentDiet.start_date && (
                          <span style={{ fontSize: '0.74rem', color: '#6ee7b7', fontWeight: 700 }}>
                            • Okres: od {currentDiet.start_date} {currentDiet.end_date ? `do ${currentDiet.end_date}` : ''}
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1.08rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                        {currentDiet.name}
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.3rem 0 0 0' }}>
                        {currentDiet.description || 'Aktywny jadłospis w Twoim kalendarzu posiłków.'}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                        <Flame size={15} color="#fbbf24" /> {currentDiet.target_calories} kcal
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        {currentDiet.meals_per_day} posiłków dziennie
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <a
                      href={dietPlansApi.getTemplatePdfUrl(currentDiet.template_id)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                    >
                      <Download size={14} /> Pobierz PDF jadłospisu
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                }}>
                  Brak aktywnego jadłospisu. Załaduj jadłospis z sekcji powyżej lub wybierz pakiet z historii.
                </div>
              )}
            </div>

            {/* SEKCJA 3: WCZEŚNIEJSZE DIETY (W kolejności przesłania) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RotateCcw size={16} color="var(--text-muted)" />
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0 }}>
                    3. Wcześniejsze Diety (W kolejności przesłania)
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                    ({previousDiets.length})
                  </span>
                </div>

                {previousDiets.length > 3 && (
                  <div style={{ position: 'relative', width: '220px' }}>
                    <Search size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '8px', top: '9px' }} />
                    <input
                      type="text"
                      placeholder="Szukaj w historii..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#111827',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        padding: '0.35rem 0.5rem 0.35rem 1.8rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                      }}
                    />
                  </div>
                )}
              </div>

              {previousDiets.length === 0 ? (
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                }}>
                  Brak wcześniejszych diet w historii Twojego konta.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                  {previousDiets.map(diet => (
                    <div
                      key={diet.assignment_id || diet.template_id}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.65rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          <span className="badge badge-slate" style={{ fontSize: '0.68rem' }}>
                            {diet.category}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            Przesłano: {diet.created_at ? new Date(diet.created_at).toLocaleDateString('pl-PL') : 'Archiwum'}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                          {diet.name}
                        </h5>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          <span style={{ color: '#fbbf24', fontWeight: 700 }}>{diet.target_calories} kcal</span> • {diet.meals_per_day} posiłków/dzień
                          {diet.dietitian_name && ` • Dietetyk: ${diet.dietitian_name}`}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                          href={dietPlansApi.getTemplatePdfUrl(diet.template_id)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                          title="Pobierz PDF"
                        >
                          <Download size={13} /> PDF
                        </a>
                        <button
                          type="button"
                          disabled={submittingId === diet.template_id}
                          onClick={() => handleLoadPackage(diet.template_id)}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <RotateCcw size={13} />
                          {submittingId === diet.template_id ? 'Ładowanie...' : 'Załaduj ponownie'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1.25rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientLoadPackageModal;
