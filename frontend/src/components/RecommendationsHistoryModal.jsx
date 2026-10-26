import React, { useState, useEffect } from 'react';
import { X, Sparkles, Calendar, UserCheck, Plus, Send, Clock, ShieldCheck } from 'lucide-react';
import { authApi } from '../api/client';

export default function RecommendationsHistoryModal({ isOpen, onClose, patientId, isDietitian = false, onRecommendationAdded }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('Oficjalne zalecenia dietetyczne');
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      setSuccessMsg(null);
    }
  }, [isOpen, patientId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = [];
      if (patientId) {
        data = await authApi.getPatientRecommendationsHistory(patientId);
      } else {
        data = await authApi.getMyRecommendationsHistory();
      }
      setHistory(data);
    } catch (err) {
      console.error('Błąd pobierania historii zaleceń:', err);
      setError(err.message || 'Nie udało się pobrać historii zaleceń.');
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
        zIndex: 1000,
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
          maxWidth: '750px',
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
                Historia zaleceń dietetycznych
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', margin: 0 }}>
                Wszystkie oficjalne wytyczne, zalecenia i notatki dietetyczne
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
            }}
            title="Zamknij"
          >
            <X size={20} />
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
          {isDietitian && patientId && (
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
                  placeholder="Tytuł zalecenia (np. Zmiana nawyków, Dieta lekkostrawna...)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                    background: 'var(--bg-main, #0f172a)',
                    color: 'var(--text-main, #fff)',
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
                    border: '1px solid var(--border-color, rgba(255,255,255,0.15))',
                    background: 'var(--bg-main, #0f172a)',
                    color: 'var(--text-main, #fff)',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={submitting || !newContent.trim()}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1.25rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  <Send size={15} />
                  {submitting ? 'Zapisywanie...' : 'Opublikuj i powiadom pacjenta'}
                </button>
              </div>
            </form>
          )}

          {/* Timeline of Recommendations */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted, #94a3b8)', marginBottom: '1rem' }}>
              Wpisy w historii ({history.length})
            </h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Ładowanie historii zaleceń...
              </div>
            ) : history.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  border: '1px dashed var(--border-color, rgba(255,255,255,0.15))',
                  borderRadius: '12px',
                  color: 'var(--text-muted, #94a3b8)',
                }}
              >
                <Clock size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <p style={{ margin: 0, fontWeight: 500 }}>Brak zarejestrowanych zaleceń w historii.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  Nowe zalecenia wprowadzane przez dietetyka pojawią się tutaj automatycznie.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map((rec, index) => (
                  <div
                    key={rec.id || index}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: '12px',
                      background: index === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: index === 0 ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: index === 0 ? '#10b981' : 'rgba(255,255,255,0.1)',
                            color: '#fff',
                          }}
                        >
                          {index === 0 ? 'NAJNOWSZE' : `#${history.length - index}`}
                        </span>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main, #f8fafc)' }}>
                          {rec.title}
                        </h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>
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
                    <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5, color: 'var(--text-main, #e2e8f0)', whiteSpace: 'pre-line' }}>
                      {rec.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            className="btn-secondary"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              borderRadius: '8px',
            }}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
