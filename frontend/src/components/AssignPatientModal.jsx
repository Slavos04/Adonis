import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, UserPlus, UserMinus, UserCheck, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { authApi } from '../api/client';

export function AssignPatientModal({ isOpen, onClose, onSuccess, currentDietitian }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('unassigned'); // 'unassigned' | 'all' | 'mine'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadPatients();
      setSearchTerm('');
      setStatusMsg(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  async function loadPatients() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await authApi.getPatients({ all_patients: true });
      setPatients(data || []);
    } catch (err) {
      setErrorMsg('Nie udało się pobrać listy pacjentów: ' + (err.message || 'Błąd sieci'));
    } finally {
      setLoading(false);
    }
  }

  async function handleAssign(patient, assignToMe) {
    setActionLoadingId(patient.id);
    setStatusMsg(null);
    setErrorMsg(null);
    try {
      const dietitianId = assignToMe ? (currentDietitian?.id || 0) : 0;
      const res = await authApi.assignDietitian(patient.id, dietitianId);
      setStatusMsg(res.message || 'Operacja zakończona sukcesem.');
      await loadPatients();
      if (onSuccess) {
        onSuccess(patient, assignToMe);
      }
    } catch (err) {
      setErrorMsg('Błąd: ' + (err.message || 'Nie udało się zaktualizować przypisania'));
    } finally {
      setActionLoadingId(null);
    }
  }

  if (!isOpen) return null;

  const currentId = currentDietitian?.id;

  const filteredPatients = patients.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.first_name && p.first_name.toLowerCase().includes(q)) ||
      (p.last_name && p.last_name.toLowerCase().includes(q)) ||
      (p.assigned_dietitian_name && p.assigned_dietitian_name.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterTab === 'unassigned') {
      return !p.assigned_dietitian_id;
    }
    if (filterTab === 'mine') {
      return p.assigned_dietitian_id === currentId;
    }
    return true; // 'all'
  });

  const unassignedCount = patients.filter((p) => !p.assigned_dietitian_id).length;
  const mineCount = patients.filter((p) => p.assigned_dietitian_id === currentId).length;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          background: 'var(--bg-surface, #1e293b)',
          border: '1px solid var(--border-subtle, #334155)',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={20} color="var(--accent-emerald, #10b981)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                Przypisz pacjenta pod opiekę
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Dodaj nowego pacjenta do swojego gabinetu lub zarządzaj opieką
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Status Alerts */}
        {statusMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle2 size={16} />
            {statusMsg}
          </div>
        )}

        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {/* Search bar & Filter tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Wyszukaj pacjenta (imię, nazwisko, e-mail)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
            <button
              className={`btn btn-sm ${filterTab === 'unassigned' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterTab('unassigned')}
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Bez opiekuna
              <span
                style={{
                  background: filterTab === 'unassigned' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {unassignedCount}
              </span>
            </button>
            <button
              className={`btn btn-sm ${filterTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterTab('all')}
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Wszyscy pacjenci
              <span
                style={{
                  background: filterTab === 'all' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {patients.length}
              </span>
            </button>
            <button
              className={`btn btn-sm ${filterTab === 'mine' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterTab('mine')}
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Moi pacjenci
              <span
                style={{
                  background: filterTab === 'mine' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                {mineCount}
              </span>
            </button>
          </div>
        </div>

        {/* Patients list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingRight: '0.2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)' }}>
              Ładowanie listy pacjentów...
            </div>
          ) : filteredPatients.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              {searchTerm ? 'Brak pacjentów spełniających kryteria wyszukiwania.' : 'Brak pacjentów w tej kategorii.'}
            </div>
          ) : (
            filteredPatients.map((p) => {
              const isMine = p.assigned_dietitian_id === currentId;
              const hasNoDietitian = !p.assigned_dietitian_id;
              const isBusy = actionLoadingId === p.id;

              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    background: isMine ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    border: isMine ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    gap: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: isMine ? 'var(--accent-emerald)' : '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: '#fff',
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {p.first_name ? p.first_name[0].toUpperCase() : (p.email ? p.email[0].toUpperCase() : 'P')}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.first_name || p.last_name ? `${p.first_name || ''} ${p.last_name || ''}`.trim() : 'Pacjent'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.email}
                      </div>
                      <div style={{ fontSize: '0.74rem', marginTop: '3px' }}>
                        {isMine ? (
                          <span style={{ color: '#34d399', fontWeight: 600 }}>✓ Twój podopieczny</span>
                        ) : hasNoDietitian ? (
                          <span style={{ color: '#f59e0b', fontWeight: 600 }}>Brak przypisanego dietetyka</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>
                            Opiekun: <strong style={{ color: '#cbd5e1' }}>{p.assigned_dietitian_name}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    {isMine ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={isBusy}
                        onClick={() => {
                          if (window.confirm(`Czy na pewno chcesz zwolnić pacjenta ${p.first_name || p.email} ze swojej opieki?`)) {
                            handleAssign(p, false);
                          }
                        }}
                        style={{
                          color: '#f87171',
                          borderColor: 'rgba(239, 68, 68, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.8rem',
                        }}
                      >
                        <UserMinus size={14} />
                        {isBusy ? 'Odpinanie...' : 'Zwolnij opiekę'}
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={isBusy}
                        onClick={() => handleAssign(p, true)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        <UserCheck size={14} />
                        {isBusy ? 'Przypisywanie...' : (hasNoDietitian ? 'Weź pod opiekę' : 'Przejmij opiekę')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: '0.85rem' }}>
            Zamknij
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AssignPatientModal;

