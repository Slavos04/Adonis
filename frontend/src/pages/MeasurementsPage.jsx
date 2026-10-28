import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { measurementsApi, authApi } from '../api/client';
import { MonthlyMeasurementChart } from '../components/MonthlyMeasurementChart';
import RecommendationsHistoryModal from '../components/RecommendationsHistoryModal';
import {
  Activity, Plus, History, Sparkles, TrendingDown, TrendingUp, Minus,
  Scale, Ruler, Trash2, Calendar, FileText, CheckCircle2, AlertCircle, X, ShieldCheck
} from 'lucide-react';

export function MeasurementsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecModal, setShowRecModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [date, setDate] = useState(todayStr);
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [height, setHeight] = useState(profile?.height || 175);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Quick edit height
  const [editingHeight, setEditingHeight] = useState(false);
  const [tempHeight, setTempHeight] = useState(profile?.height || 175);

  useEffect(() => {
    loadMeasurements();
  }, []);

  useEffect(() => {
    if (profile?.height) {
      setHeight(profile.height);
      setTempHeight(profile.height);
    }
  }, [profile?.height]);

  async function loadMeasurements() {
    setLoading(true);
    try {
      const data = await measurementsApi.list();
      setMeasurements(data || []);
    } catch (err) {
      console.error('Błąd pobierania pomiarów:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMeasurement(e) {
    e.preventDefault();
    if (!weight) return;

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        date,
        weight: parseFloat(weight),
        waist_cm: waist ? parseFloat(waist) : null,
        height: height ? parseFloat(height) : null,
        notes: notes.trim(),
      };
      await measurementsApi.add(payload);
      setSuccessMsg('Nowy pomiar został pomyślnie zapisany!');
      setWeight('');
      setWaist('');
      setNotes('');
      setShowAddModal(false);
      await loadMeasurements();
      if (refreshProfile) refreshProfile();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message || 'Błąd zapisu pomiaru.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteMeasurement(id) {
    if (!window.confirm('Czy na pewno chcesz usunąć ten pomiar?')) return;
    try {
      await measurementsApi.delete(id);
      setMeasurements(prev => prev.filter(m => m.id !== id));
      if (refreshProfile) refreshProfile();
    } catch (err) {
      alert(`Błąd usuwania pomiaru: ${err.message}`);
    }
  }

  async function handleSaveHeight() {
    try {
      await authApi.updateMyProfile({ height: parseFloat(tempHeight) });
      setHeight(parseFloat(tempHeight));
      setEditingHeight(false);
      if (refreshProfile) refreshProfile();
    } catch (err) {
      alert(`Błąd aktualizacji wzrostu: ${err.message}`);
    }
  }

  const sortedChronological = [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date));
  const latest = sortedChronological[sortedChronological.length - 1];
  const first = sortedChronological[0];
  const weightDelta = (latest && first && sortedChronological.length > 1)
    ? (latest.weight - first.weight).toFixed(1)
    : 0.0;

  const validH = height && height > 0 ? Number(height) : 175;
  const hM = validH / 100;
  const currentBmi = latest ? +(latest.weight / (hM * hM)).toFixed(1) : null;

  const bmiCategory = currentBmi ? (
    currentBmi < 18.5 ? { label: 'Niedowaga', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' } :
    currentBmi <= 24.9 ? { label: 'Waga prawidłowa (Norma WHO)', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)' } :
    currentBmi <= 29.9 ? { label: 'Nadwaga', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)' } :
    { label: 'Otyłość', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)' }
  ) : null;

  return (
    <div className="page-container" style={{ maxWidth: '1080px' }}>
      {/* Top Header Card */}
      <div
        className="glass-panel"
        style={{
          padding: '1.5rem 1.75rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(99,102,241,0.05) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-emerald), #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px var(--accent-emerald-glow)',
            }}
          >
            <Activity size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Pomiary &amp; Postępy
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Wykres trendu wagi i talii, analiza wskaźnika BMI i historia zaleceń
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowRecModal(true)}
            className="btn btn-secondary btn-sm"
            style={{
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#34d399',
              borderColor: 'rgba(16, 185, 129, 0.35)',
              fontWeight: 700,
            }}
            title="Przeglądaj pełną historię wytycznych i jadłospisów od dietetyka"
          >
            <Sparkles size={15} color="#34d399" />
            Zalecenia i jadłospisy
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
            style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
          >
            <Plus size={16} />
            Dodaj pomiar
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--accent-emerald)', color: '#6ee7b7', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Card 1: Aktualna waga */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Aktualna waga
            </span>
            <Scale size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>
            {latest?.weight || profile?.current_weight || '—'} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            Ostatni pomiar: {latest?.date || 'Brak'}
          </div>
        </div>

        {/* Card 2: Zmiana całkowita (z horyzontalną odznaką) */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Trend wagi
            </span>
            {parseFloat(weightDelta) < 0 ? (
              <TrendingDown size={18} color="#34d399" />
            ) : parseFloat(weightDelta) > 0 ? (
              <TrendingUp size={18} color="#f87171" />
            ) : (
              <Minus size={18} color="var(--text-muted)" />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 900, color: parseFloat(weightDelta) < 0 ? '#34d399' : parseFloat(weightDelta) > 0 ? '#f87171' : '#fff' }}>
              {parseFloat(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg</span>
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
            {sortedChronological.length > 1 ? `Od pierwszego pomiaru (${first.date})` : 'Zapisz minimum 2 pomiary'}
          </div>
        </div>

        {/* Card 3: Wskaźnik BMI */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Aktualne BMI
            </span>
            <ShieldCheck size={18} color={bmiCategory ? bmiCategory.color : 'var(--text-muted)'} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>
            {currentBmi || '—'}
          </div>
          {bmiCategory && (
            <div style={{ marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: bmiCategory.color, background: bmiCategory.bg, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {bmiCategory.label}
              </span>
            </div>
          )}
        </div>

        {/* Card 4: Wzrost i edycja */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Wzrost pacjenta
            </span>
            <Ruler size={18} color="var(--accent-indigo)" />
          </div>
          {editingHeight ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem' }}>
              <input
                type="number"
                value={tempHeight}
                onChange={(e) => setTempHeight(e.target.value)}
                style={{ width: '80px', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '1rem', fontWeight: 700 }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>cm</span>
              <button onClick={handleSaveHeight} className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                Zapisz
              </button>
              <button onClick={() => setEditingHeight(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                X
              </button>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>
                {height} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>cm</span>
              </div>
              <button
                onClick={() => setEditingHeight(true)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', fontSize: '0.75rem', cursor: 'pointer', padding: 0, marginTop: '0.25rem', textDecoration: 'underline' }}
              >
                Zmień wzrost
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Interactive Chart */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Wykres trendu wagi i talii
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Wizualizacja postępów z uwzględnieniem prawidłowego zakresu BMI (18.5 – 24.9)
            </p>
          </div>
        </div>

        <MonthlyMeasurementChart measurements={measurements} height={height} />
      </div>

      {/* Measurement History Table */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Historia wpisów pomiarowych ({measurements.length})
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Wszystkie zarejestrowane pomiary wagi i obwodów
            </p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={15} /> Nowy pomiar
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Ładowanie historii pomiarów...
          </div>
        ) : measurements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px', color: 'var(--text-muted)' }}>
            <Scale size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ margin: 0, fontWeight: 600 }}>Brak zarejestrowanych pomiarów.</p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
              Kliknij przycisk „Dodaj pomiar”, aby zapisać swój pierwszy pomiar wagi!
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Data</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Waga</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Obwód talii</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>BMI</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Notatka</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, textAlign: 'right' }}>Akcja</th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((m) => {
                  const mBmi = +(m.weight / (hM * hM)).toFixed(1);
                  return (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: 'background 0.2s',
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#fff' }}>
                        {m.date}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        {m.weight} kg
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: m.waist_cm ? '#38bdf8' : 'var(--text-dim)' }}>
                        {m.waist_cm ? `${m.waist_cm} cm` : '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: mBmi >= 18.5 && mBmi <= 24.9 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                          color: mBmi >= 18.5 && mBmi <= 24.9 ? '#34d399' : '#fbbf24',
                        }}>
                          {mBmi}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                        {m.notes || '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteMeasurement(m.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-rose)',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            borderRadius: '6px',
                            opacity: 0.7,
                          }}
                          title="Usuń ten pomiar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Measurement Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)} style={{ zIndex: 1200 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Plus size={20} color="var(--accent-emerald)" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Nowy pomiar ciała</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm" style={{ borderRadius: '50%', width: '30px', height: '30px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid var(--accent-rose)', color: '#fca5a5', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleAddMeasurement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Data pomiaru
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Waga (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="np. 74.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    Talia (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="np. 82.0"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Wzrost (cm)
                </label>
                <input
                  type="number"
                  step="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Notatka (opcjonalnie)
                </label>
                <input
                  type="text"
                  placeholder="np. po treningu na czczo"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                  Anuluj
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {submitting ? 'Zapisywanie...' : 'Zapisz pomiar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recommendations & Diet Packages History Modal */}
      <RecommendationsHistoryModal
        isOpen={showRecModal}
        onClose={() => setShowRecModal(false)}
      />
    </div>
  );
}
export default MeasurementsPage;
