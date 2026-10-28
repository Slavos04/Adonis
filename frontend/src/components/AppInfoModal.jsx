import React, { useState } from 'react';
import { Flame, Info, Mail, CheckCircle, ShieldCheck, Smartphone, Sparkles, X, Download, History, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { APP_VERSION } from '../version';
import { ChangelogModal } from './ChangelogModal';

export function AppInfoModal({ isOpen, onClose }) {
  const [showChangelog, setShowChangelog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/Adonis-fit-and-eat-v${APP_VERSION}.apk`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  if (!isOpen) return null;

  return (
    <>
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
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
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
              fit &amp; eat
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span
                className="badge badge-emerald"
                style={{ fontSize: '0.78rem', fontWeight: 700 }}
              >
                Wersja {APP_VERSION} &bull; Produkcyjna
              </span>
            </div>
          </div>

          {/* Button for Changelog */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowChangelog(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              marginBottom: '1.25rem',
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: '1px solid var(--accent-emerald)',
              background: 'rgba(16, 185, 129, 0.09)',
              color: 'var(--accent-emerald)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <History size={18} />
            <span>Historia zmian i wersje (CHANGELOG)</span>
          </button>

          {/* Description */}
          <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, textAlign: 'center', marginBottom: '1.25rem' }}>
            <strong>ADONIS fit &amp; eat</strong> to kompleksowy, inteligentny system dietetyczny i monitorowania postępów, zaprojektowany z myślą o efektywnej, bezpiecznej i trwałej redukcji masy ciała.
          </p>

          {/* Highlights List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', background: 'var(--bg-input)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
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

          {/* Android APK Download & Artistic QR Code Section */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(15,23,42,0.6) 50%, rgba(99,102,241,0.1) 100%)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 24px rgba(16,185,129,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top decorative glow */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--accent-emerald), #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(16,185,129,0.3)'
                }}>
                  <Smartphone size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                    Pobierz aplikację mobilną ADONIS
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Pakiet Android (.APK v{APP_VERSION} &bull; 11.7 MB)
                  </div>
                </div>
              </div>

              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#34d399',
                background: 'rgba(16,185,129,0.15)',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid rgba(16,185,129,0.3)'
              }}>
                Oficjalne wydanie v{APP_VERSION}
              </span>
            </div>

            {/* Artistic QR + Visual Preview Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.25)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}>
              {/* Scannable QR Code Card */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div
                  style={{
                    padding: '10px',
                    background: '#ffffff',
                    borderRadius: '14px',
                    boxShadow: '0 0 20px rgba(16,185,129,0.4), 0 4px 12px rgba(0,0,0,0.4)',
                    border: '2px solid #34d399',
                    display: 'inline-block',
                    position: 'relative'
                  }}
                  title="Zeskanuj aparatem telefonu"
                >
                  <QRCodeSVG
                    value={typeof window !== 'undefined' ? `${window.location.origin}/Adonis-fit-and-eat-v${APP_VERSION}.apk` : `https://adonis.slavosmm.duckdns.org/Adonis-fit-and-eat-v${APP_VERSION}.apk`}
                    size={135}
                    level="H"
                    includeMargin={false}
                    fgColor="#0f172a"
                    bgColor="#ffffff"
                    imageSettings={{
                      src: "/app-icon.png",
                      height: 28,
                      width: 28,
                      excavate: true
                    }}
                  />
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#6ee7b7',
                  marginTop: '0.5rem',
                  letterSpacing: '0.02em'
                }}>
                  📸 Zeskanuj aparatem telefonu
                </span>
              </div>

              {/* Artistic Graphic Banner & Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  height: '85px',
                  border: '1px solid rgba(16,185,129,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  <img
                    src="/adonis_qr_artistic.jpg"
                    alt="Adonis Mobile Art"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '0.4rem 0.6rem'
                  }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                      ADONIS Mobile Cyber-Fit
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  Zsynchronizowane posiłki, automatyczna lista zakupów, powiadomienia i pomiary w Twojej kieszeni.
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <a
                    href={`/Adonis-fit-and-eat-v${APP_VERSION}.apk`}
                    download={`Adonis-fit-and-eat-v${APP_VERSION}.apk`}
                    className="btn btn-primary btn-sm"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    <Download size={15} /> Pobierz .APK
                  </a>
                  {copied ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.5rem 0.7rem', color: '#34d399', borderColor: '#34d399' }}
                      title="Skopiowano link!"
                    >
                      <Check size={15} />
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCopyLink}
                      style={{ padding: '0.5rem 0.7rem' }}
                      title="Kopiuj bezpośredni link do pliku APK"
                    >
                      <Copy size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
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
              ADONIS &copy; 2026 &bull; ver. {APP_VERSION}
            </span>
            <button className="btn btn-primary btn-sm" onClick={onClose} style={{ padding: '0.4rem 1.25rem' }}>
              Zamknij
            </button>
          </div>
        </div>
      </div>

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={showChangelog}
        onClose={() => setShowChangelog(false)}
        onBack={() => setShowChangelog(false)}
      />
    </>
  );
}
