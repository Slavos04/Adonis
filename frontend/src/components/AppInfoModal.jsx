import React from 'react';
import { Flame, Info, Mail, CheckCircle, ShieldCheck, Smartphone, Sparkles, X, Download } from 'lucide-react';

export function AppInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          padding: '2rem',
          position: 'relative',
          borderRadius: '18px',
          border: '1px solid var(--border-active)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px var(--accent-emerald-glow)',
              border: '1px solid var(--border-active)',
              marginBottom: '0.75rem'
            }}
          >
            <img src="/app-icon.png" alt="ADONIS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            ADONIS
          </h2>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--accent-emerald)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginTop: '0.2rem'
            }}
          >
            fit & eat
          </div>
          <span
            className="badge badge-emerald"
            style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}
          >
            Wersja 1.0 &bull; Produkcyjna
          </span>
        </div>

        {/* Description */}
        <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, textAlign: 'center', marginBottom: '1.25rem' }}>
          <strong>ADONIS fit & eat</strong> to kompleksowy, inteligentny system dietetyczny i monitorowania postępów, zaprojektowany z myślą o efektywnej, bezpiecznej i trwałej redukcji masy ciała.
        </p>

        {/* Highlights List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
            <CheckCircle size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
            <span>Precyzyjne planowanie posiłków i bilansowanie makroskładników (B, T, W).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
            <Sparkles size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
            <span>Baza ponad 125 sprawdzonych przepisów oraz realnych produktów sklepowych.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
            <CheckCircle size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
            <span>Zagregowana lista zakupów z trybem <em>One-Stop-Shop</em> (jeden market).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
            <span>Wykresy wagi, talii i dynamiczne BMI z referencyjnym pasmem normy WHO (18.5 – 24.9).</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem' }}>
            <Smartphone size={16} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
            <span>Dostęp przez przeglądarkę WWW oraz natywną aplikację mobilną na system Android.</span>
          </div>
        </div>

        {/* Android APK Download Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 100%)',
            border: '1px solid var(--accent-emerald)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.25rem',
            boxShadow: '0 4px 15px rgba(16,185,129,0.1)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(16,185,129,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Smartphone size={24} color="var(--accent-emerald)" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Aplikacja mobilna na telefon
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Pakiet instalacyjny Android (.APK v1.0 &bull; 11.5 MB)
              </div>
            </div>
          </div>
          <a
            href="/Adonis-fit-and-eat-v1.0.apk"
            download="Adonis-fit-and-eat-v1.0.apk"
            className="btn btn-primary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              padding: '0.55rem 1.1rem',
              borderRadius: '10px'
            }}
          >
            <Download size={16} /> Pobierz APK
          </a>
        </div>

        {/* Contact info card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(99,102,241,0.08) 100%)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            Kontakt i Wsparcie Techniczne
          </div>
          <a
            href="mailto:slavosmm@gmail.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--accent-emerald)',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none'
            }}
          >
            <Mail size={18} /> slavosmm@gmail.com
          </a>
        </div>

        {/* Footer info & close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            ADONIS &copy; 2026 &bull; ver. 1.0
          </span>
          <button className="btn btn-primary btn-sm" onClick={onClose} style={{ padding: '0.4rem 1.25rem' }}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
