import React, { useState, useRef } from 'react';
import { X, FileText, Upload, Sparkles, CheckCircle, AlertCircle, RefreshCw, Layers, Flame, User } from 'lucide-react';
import { dietPlansApi } from '../api/client';

export function PdfImportModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [templateName, setTemplateName] = useState('M_1500_cal');
  const [targetGender, setTargetGender] = useState('male');
  const [category, setCategory] = useState('Dieta NFZ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Obsługiwane są wyłącznie pliki w formacie PDF (.pdf).');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Obsługiwane są wyłącznie pliki w formacie PDF (.pdf).');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Proszę wybrać plik PDF do importu.');
      return;
    }
    if (!templateName.trim()) {
      setError('Proszę podać nazwę dla nowego jadłospisu.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('template_name', templateName.trim());
    formData.append('target_gender', targetGender);
    formData.append('category', category.trim() || 'Dieta NFZ');

    try {
      const res = await dietPlansApi.importDietPdf(formData);
      setResult(res);
      if (onSuccess) {
        onSuccess(res);
      }
    } catch (err) {
      setError(err.message || 'Wystąpił błąd podczas importu pliku PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setResult(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '580px',
          width: '92%',
          background: '#0f172a',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15)',
          padding: '1.75rem',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <FileText size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Import Diety z pliku PDF <Sparkles size={16} color="#34d399" />
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                Automatyczny parser jadłospisów, przepisów i makroskładników NFZ
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} flexShrink={0} />
            <div>{error}</div>
          </div>
        )}

        {/* Success result view */}
        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '14px',
              padding: '1.25rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto'
              }}>
                <CheckCircle size={28} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', marginBottom: '0.25rem' }}>
                Import zakończony sukcesem!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                {result.message}
              </p>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem'
            }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Nazwa jadłospisu</span>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#6ee7b7' }}>{result.template_name}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Średnie kalorie / dzień</span>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f59e0b' }}>{result.target_calories} kcal</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Dni jadłospisu</span>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#38bdf8' }}>{result.total_days} dni ({result.total_meals} posiłków)</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Deduplikacja przepisów</span>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#a78bfa' }}>
                  +{result.new_recipes_created} nowych / ♻️ {result.reused_recipes_count} zrecyklingowanych
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
              Przepisy zostały opatrzone źródłem: <span style={{ color: '#34d399' }}>{result.source}</span>
            </div>

            <button
              onClick={handleClose}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Zamknij i zobacz w Pakietach Diet
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* File Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragging ? '2px dashed #10b981' : file ? '2px solid #059669' : '2px dashed rgba(255,255,255,0.15)',
                background: isDragging ? 'rgba(16, 185, 129, 0.08)' : file ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.02)',
                borderRadius: '14px',
                padding: '1.75rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: file ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                color: file ? '#10b981' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem auto'
              }}>
                <Upload size={22} />
              </div>
              {file ? (
                <div>
                  <div style={{ fontWeight: 700, color: '#6ee7b7', fontSize: '0.92rem' }}>
                    📄 {file.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB &bull; Kliknij, aby zmienić plik
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>
                    Przeciągnij i upuść plik PDF diety tutaj
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    lub kliknij, aby wybrać plik z dysku (np. diety_nfz_przepisy.pdf)
                  </div>
                </div>
              )}
            </div>

            {/* Template Settings Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Nazwa nowego jadłospisu:*
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="np. M_1500_cal"
                  required
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                  Grupa docelowa (płeć):*
                </label>
                <select
                  value={targetGender}
                  onChange={(e) => setTargetGender(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600
                  }}
                >
                  <option value="male">👨 Mężczyzna</option>
                  <option value="female">👩 Kobieta</option>
                  <option value="all">👥 Dla każdego</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                Kategoria jadłospisu:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="np. Dieta NFZ / Redukcyjna"
                style={{
                  width: '100%',
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {/* Smart Import Info Notice */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '10px',
              padding: '0.75rem',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              lineHeight: 1.45
            }}>
              <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} /> Inteligentny import Adonis AI:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
                <li>Pobiera wszystkie posiłki, kalorie, makroskładniki (B/T/W) oraz czasy przygotowania.</li>
                <li>Deduplikuje przepisy: jeśli przepis już istnieje w bazie, system go wykorzysta zamiast powielać.</li>
                <li>Do każdego przepisu automatycznie dodaje przypis źródła: <em>https://diety.nfz.gov.pl/</em>.</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="btn btn-primary"
              style={{
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                opacity: loading || !file ? 0.6 : 1,
                cursor: loading || !file ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Przetwarzanie i importowanie diety...
                </>
              ) : (
                <>
                  <Upload size={18} /> Prześlij i zaimportuj jadłospis z PDF
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

