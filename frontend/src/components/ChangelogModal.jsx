import React from 'react';
import { X, History, Calendar, CheckCircle2, Tag, ArrowLeft } from 'lucide-react';
import { APP_VERSION, APP_RELEASE_DATE, CHANGELOG_DATA } from '../version';

export function ChangelogModal({ isOpen, onClose, onBack }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1300 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '92%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          position: 'relative',
          borderRadius: '20px',
          border: '1px solid var(--border-active)',
          background: 'var(--bg-card)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onBack && (
              <button
                onClick={onBack}
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                title="Wróć do informacji"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
                border: '1px solid var(--accent-emerald)'
              }}
            >
              <History size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Dziennik Zmian (CHANGELOG)
              </h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span>Wersja aktywna: <strong style={{ color: 'var(--accent-emerald)' }}>v{APP_VERSION}</strong></span>
                <span>&bull;</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={13} /> {APP_RELEASE_DATE}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            title="Zamknij"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Changelog Content */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {CHANGELOG_DATA.map((entry) => (
            <div
              key={entry.version}
              style={{
                background: 'var(--bg-input)',
                borderRadius: '16px',
                border: entry.version === APP_VERSION ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                padding: '1.25rem',
                position: 'relative'
              }}
            >
              {/* Version title and badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: entry.version === APP_VERSION ? 'var(--accent-emerald)' : 'var(--text-main)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Tag size={18} />
                    v{entry.version}
                  </span>
                  <span
                    className={`badge badge-${entry.badgeType || 'emerald'}`}
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', fontWeight: 700 }}
                  >
                    {entry.badge}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={13} />
                  <span>Data modyfikacji: <strong>{entry.date}</strong> ({entry.time})</span>
                </div>
              </div>

              {/* Version summary title */}
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem' }}>
                {entry.title}
              </div>

              {/* Changes categories */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {entry.changes.map((group, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-card)', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-emerald)', marginBottom: '0.45rem' }}>
                      {group.category}
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {group.items.map((item, itemIdx) => (
                        <li key={itemIdx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Zasada wersjonowania: każda modyfikacja zwiększa numer wersji o 0.1
          </span>
          <button className="btn btn-primary btn-sm" onClick={onClose} style={{ padding: '0.4rem 1.25rem' }}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
