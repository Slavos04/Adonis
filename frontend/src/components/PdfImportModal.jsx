import React, { useState, useRef } from 'react';
import { X, FileText, Upload, Sparkles, CheckCircle, AlertCircle, RefreshCw, Layers, Flame, User, AlignLeft, FolderPlus } from 'lucide-react';
import { dietPlansApi } from '../api/client';

export function PdfImportModal({ isOpen, onClose, onSuccess, availableGroups = [] }) {
  const [file, setFile] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bez grupy');
  const [customCategory, setCustomCategory] = useState('');
  const [targetGender, setTargetGender] = useState('male');
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
        if (!templateName) {
          const autoName = droppedFile.name.replace(/\.pdf$/i, '').replace(/[^\w\s-]/gi, '_');
          setTemplateName(autoName);
        }
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
        if (!templateName) {
          const autoName = selectedFile.name.replace(/\.pdf$/i, '').replace(/[^\w\s-]/gi, '_');
          setTemplateName(autoName);
        }
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

    const finalCategory = category === '__custom__'
      ? (customCategory.trim() || 'Bez grupy')
      : (category.trim() || 'Bez grupy');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('template_name', templateName.trim());
    formData.append('target_gender', targetGender);
    formData.append('category', finalCategory);
    if (description.trim()) {
      formData.append('description', description.trim());
    }

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
    setDescription('');
    setCategory('Bez grupy');
    setCustomCategory('');
    onClose();
  };

  // Unikalne grupy diety do wyboru
  const groupOptions = Array.from(new Set(['Bez grupy', ...availableGroups.filter(g => g && g !== 'Wszystkie')]));

  return (
    <div className="modal-overlay" onClick={handleClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '600px',
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
              cursor: 'padding',
              padding: '0.4rem',
              borderRadius: '8px'
            }}
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
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {result ? (
          /* Wynik sukcesu importu */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Import zakończony sukcesem!
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Utworzono pakiet: <strong style={{ color: '#34d399' }}>{result.template_name}</strong>
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Dni w pakiecie</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{result.total_days || result.days}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Łącznie posiłków</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{result.total_meals || result.meals}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Średnia kcal</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>{result.target_calories}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Nowe przepisy</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>+{result.new_recipes_created}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Deduplikacja</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a78bfa' }}>{result.reused_recipes_count}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Grupa</span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>{result.category}</div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
            >
              Przejdź do pakietów
            </button>
          </div>
        ) : (
          /* Formularz importu */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragging ? '2px dashed #10b981' : '2px dashed rgba(255, 255, 255, 0.15)',
                background: isDragging ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                color: '#34d399'
              }}>
                <Upload size={22} />
              </div>

              {file ? (
                <div>
                  <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    Rozmiar: {(file.size / (1024 * 1024)).toFixed(2)} MB • Kliknij, aby zmienić plik
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                    Przeciągnij i upuść plik PDF z dietą tutaj
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    lub kliknij, aby wybrać plik z dysku (np. <em>diety_nfz_przepisy.pdf</em>)
                  </div>
                </div>
              )}
            </div>

            {/* Nazwa i płeć */}
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

            {/* Opis jadłospisu (zgodnie z punktem 2) */}
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <AlignLeft size={14} /> Opis jadłospisu (opcjonalny):
              </label>
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="np. Zbilansowany jadłospis z wytycznych NFZ dla redukcji masy ciała..."
                style={{
                  width: '100%',
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Grupa diety (opcjonalna, zgodnie z punktem 2) */}
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <FolderPlus size={14} /> Grupa diety (opcjonalnie):
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.88rem'
                }}
              >
                {groupOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === 'Bez grupy' ? '— Bez grupy —' : opt}
                  </option>
                ))}
                <option value="__custom__">+ Wpisz inną grupę...</option>
              </select>

              {category === '__custom__' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Wpisz nazwę nowej grupy diety"
                  style={{
                    width: '100%',
                    background: '#1e293b',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    color: '#fff',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginTop: '0.4rem'
                  }}
                />
              )}
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
export default PdfImportModal;