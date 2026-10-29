import React, { useState, useEffect, useRef } from 'react';
import { recipesApi, dietPlansApi } from '../api/client';
import { 
  X, Scale, Flame, Award, Clock, ChefHat, Info, Image, 
  Trash2, Edit3, Camera, Plus, Check, RefreshCw, Barcode, AlertCircle 
} from 'lucide-react';

export function PortionScalerModal({ 
  recipeId, 
  initialPortions = 1.0, 
  meal = null, 
  initialTab = 'portions',
  onClose, 
  onEdit, 
  onDelete, 
  onMealUpdated 
}) {
  const [activeTab, setActiveTab] = useState(meal?.is_custom_substitution ? 'substitute' : initialTab);
  const [portions, setPortions] = useState(initialPortions);
  const [scaledData, setScaledData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Substitution Form State
  const [subMealName, setSubMealName] = useState(meal?.custom_name || '');
  const [items, setItems] = useState(
    meal?.custom_items?.length 
      ? meal.custom_items 
      : []
  );

  // Current item being added
  const [eanCode, setEanCode] = useState('');
  const [isSearchingEan, setIsSearchingEan] = useState(false);
  const [eanNotFound, setEanNotFound] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemWeight, setItemWeight] = useState(100);
  const [itemKcal100g, setItemKcal100g] = useState(0);
  const [itemP100g, setItemP100g] = useState(0);
  const [itemF100g, setItemF100g] = useState(0);
  const [itemC100g, setItemC100g] = useState(0);
  const [isSavingSub, setIsSavingSub] = useState(false);
  const [subSuccessMsg, setSubSuccessMsg] = useState(null);

  // Camera Barcode Scanning State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (recipeId) {
      fetchScaled(portions);
    }
  }, [recipeId, portions]);

  async function fetchScaled(targetPortions) {
    if (targetPortions <= 0) return;
    setLoading(true);
    try {
      const data = await recipesApi.scale(recipeId, targetPortions);
      setScaledData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Camera barcode detection effect
  useEffect(() => {
    if (!cameraActive) return;
    let stream = null;
    let interval = null;
    let isMounted = true;

    async function startCamera() {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        if ('BarcodeDetector' in window) {
          const detector = new window.BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'qr_code']
          });
          interval = setInterval(async () => {
            if (!videoRef.current || videoRef.current.readyState < 2) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const raw = barcodes[0].rawValue;
                if (raw) {
                  stopCamera();
                  handleLookupEan(raw);
                }
              }
            } catch (_) {}
          }, 350);
        } else {
          setCameraError("Twoja przeglądarka nie wspiera natywnego skanera wideo BarcodeDetector. Wpisz cyfry kodu EAN ręcznie.");
        }
      } catch (err) {
        setCameraError("Brak dostępu do aparatu: " + err.message);
        setCameraActive(false);
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [cameraActive]);

  function stopCamera() {
    setCameraActive(false);
  }

  async function handleLookupEan(barcodeToSearch) {
    const code = (barcodeToSearch || eanCode).trim();
    if (!code) return;
    setEanCode(code);
    setIsSearchingEan(true);
    setEanNotFound(false);
    try {
      const prod = await recipesApi.getBarcode(code);
      if (prod && (prod.name || prod.product_name)) {
        setItemName(prod.name || prod.product_name);
        setItemKcal100g(Math.round(prod.calories_per_100g || prod.calories || 0));
        setItemP100g(Number(prod.protein_per_100g || prod.protein_g || 0));
        setItemF100g(Number(prod.fat_per_100g || prod.fat_g || 0));
        setItemC100g(Number(prod.carbs_per_100g || prod.carbs_g || 0));
        setEanNotFound(false);
      } else {
        setEanNotFound(true);
      }
    } catch (err) {
      setEanNotFound(true);
    } finally {
      setIsSearchingEan(false);
    }
  }

  function handleAddItem() {
    if (!itemName.trim()) {
      alert("Podaj nazwę produktu.");
      return;
    }
    const weight = Number(itemWeight) || 100;
    const ratio = weight / 100.0;
    const cal = Math.round(Number(itemKcal100g) * ratio * 10) / 10;
    const p = Math.round(Number(itemP100g) * ratio * 10) / 10;
    const f = Math.round(Number(itemF100g) * ratio * 10) / 10;
    const c = Math.round(Number(itemC100g) * ratio * 10) / 10;

    const newItem = {
      name: itemName.trim(),
      barcode: eanCode.trim() || null,
      weight_g: weight,
      calories: cal,
      protein_g: p,
      fat_g: f,
      carbs_g: c,
    };

    const newItems = [...items, newItem];
    setItems(newItems);

    // If subMealName is empty, name it after the first item
    if (!subMealName.trim()) {
      setSubMealName(itemName.trim());
    } else if (newItems.length === 2) {
      setSubMealName(prev => `${prev} + ${itemName.trim()}`);
    }

    // Reset current item inputs
    setItemName('');
    setEanCode('');
    setItemWeight(100);
    setItemKcal100g(0);
    setItemP100g(0);
    setItemF100g(0);
    setItemC100g(0);
    setEanNotFound(false);
  }

  function handleRemoveItem(idx) {
    setItems(items.filter((_, i) => i !== idx));
  }

  // Calculated totals of custom meal
  const totalSubKcal = Math.round(items.reduce((s, it) => s + (Number(it.calories) || 0), 0) * 10) / 10;
  const totalSubP = Math.round(items.reduce((s, it) => s + (Number(it.protein_g) || 0), 0) * 10) / 10;
  const totalSubF = Math.round(items.reduce((s, it) => s + (Number(it.fat_g) || 0), 0) * 10) / 10;
  const totalSubC = Math.round(items.reduce((s, it) => s + (Number(it.carbs_g) || 0), 0) * 10) / 10;

  async function handleSaveSubstitution() {
    if (!meal?.id) return;
    if (items.length === 0) {
      alert("Dodaj przynajmniej jeden produkt do zamienionego posiłku.");
      return;
    }
    const finalName = subMealName.trim() || items.map(i => i.name).join(" + ");

    setIsSavingSub(true);
    try {
      await dietPlansApi.substituteMeal(meal.id, {
        custom_name: finalName,
        items: items,
        total_calories: totalSubKcal,
        total_protein_g: totalSubP,
        total_fat_g: totalSubF,
        total_carbs_g: totalSubC,
      });
      setSubSuccessMsg("Posiłek został pomyślnie zamieniony!");
      if (onMealUpdated) onMealUpdated();
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      alert("Błąd zapisu zamiennika: " + err.message);
    } finally {
      setIsSavingSub(false);
    }
  }

  async function handleRevertSubstitution() {
    if (!meal?.id) return;
    if (!window.confirm("Czy na pewno chcesz przywrócić oryginalny posiłek zaplanowany przez dietetyka?")) return;
    setIsSavingSub(true);
    try {
      await dietPlansApi.revertMealSubstitute(meal.id);
      if (onMealUpdated) onMealUpdated();
      onClose();
    } catch (err) {
      alert("Błąd: " + err.message);
    } finally {
      setIsSavingSub(false);
    }
  }

  const presets = [0.5, 1.0, 1.5, 2.0, 3.0];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2500 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '0.6rem', borderRadius: '12px' }}>
              <ChefHat size={26} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {meal ? 'Opcje posiłku' : 'Opis Dania i Opcje Porcji'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                <span className="badge badge-emerald">
                  {meal?.meal_type || scaledData?.category || 'Danie fitness'}
                </span>
                {scaledData?.preparation_time_minutes ? (
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(56,189,248,0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600, border: '1px solid rgba(56,189,248,0.25)' }}>
                    <Clock size={13} /> {scaledData.preparation_time_minutes} min
                  </span>
                ) : null}
                {meal?.is_custom_substitution && (
                  <span style={{ fontSize: '0.75rem', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(245,158,11,0.3)' }}>
                    Zamieniony przez pacjenta
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {onEdit && scaledData && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(scaledData);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                title="Przejdź do edycji tego przepisu"
              >
                <Edit3 size={14} /> Edytuj
              </button>
            )}
            {onDelete && scaledData && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(scaledData);
                }}
                className="btn btn-secondary btn-sm"
                style={{
                  color: '#f43f5e',
                  borderColor: 'rgba(244, 63, 94, 0.5)',
                  background: 'rgba(244, 63, 94, 0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
                title="Usuń ten przepis z bazy danych"
              >
                <Trash2 size={14} /> Usuń przepis
              </button>
            )}
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab switchers if this modal is invoked for a patient meal */}
        {meal && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('portions')}
              className={`btn btn-sm ${activeTab === 'portions' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, fontWeight: 700 }}
            >
              <Scale size={15} /> Szczegóły i porcje
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('substitute')}
              className={`btn btn-sm ${activeTab === 'substitute' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                flex: 1,
                fontWeight: 700,
                background: activeTab === 'substitute' ? '#10b981' : undefined,
                color: activeTab === 'substitute' ? '#fff' : undefined,
                borderColor: '#10b981'
              }}
            >
              <RefreshCw size={15} /> Zamień posiłek
              {meal.is_custom_substitution && (
                <span style={{ fontSize: '0.65rem', background: '#fbbf24', color: '#000', padding: '0.1rem 0.35rem', borderRadius: '4px', marginLeft: '0.3rem', fontWeight: 800 }}>
                  Aktywny
                </span>
              )}
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: PORTIONS AND RECIPE DETAILS                       */}
        {/* ======================================================== */}
        {activeTab === 'portions' && (
          <div>
            {/* Dish Photo if available */}
            {scaledData?.image_url && (
              <div style={{ marginBottom: '1.25rem', borderRadius: '12px', overflow: 'hidden', maxHeight: '220px', border: '1px solid var(--border-subtle)' }}>
                <img
                  src={scaledData.image_url}
                  alt={scaledData.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            {/* Title */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
              {scaledData?.title}
            </h3>

            {/* Portions Scaler Controls */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Scale size={16} color="#10b981" /> Wybierz wielkość porcji:
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                  {portions}x {portions === 1 ? 'porcja' : 'porcje'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPortions(p)}
                    className={`btn btn-sm ${portions === p ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: '1 1 auto', minWidth: '70px', fontWeight: portions === p ? 800 : 500 }}
                  >
                    {p} {p === 1 ? 'porcja' : 'porcje'}
                  </button>
                ))}
              </div>
            </div>

            {error && <div style={{ color: 'var(--accent-rose)', marginBottom: '1rem' }}>{error}</div>}

            {scaledData && (
              <div>
                {/* Macro summary pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="macro-pill" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)' }}>
                    <span className="label">Kalorie</span>
                    <span className="value" style={{ color: '#34d399' }}>{scaledData.total_calories} kcal</span>
                  </div>
                  <div className="macro-pill" style={{ borderColor: 'rgba(14,165,233,0.3)' }}>
                    <span className="label">Białko</span>
                    <span className="value" style={{ color: '#38bdf8' }}>{scaledData.total_protein_g} g</span>
                  </div>
                  <div className="macro-pill" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                    <span className="label">Tłuszcze</span>
                    <span className="value" style={{ color: '#fbbf24' }}>{scaledData.total_fat_g} g</span>
                  </div>
                  <div className="macro-pill" style={{ borderColor: 'rgba(99,102,241,0.3)' }}>
                    <span className="label">Węglowodany</span>
                    <span className="value" style={{ color: '#818cf8' }}>{scaledData.total_carbs_g} g</span>
                  </div>
                </div>

                {/* Ingredients table */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Składniki z Dyskontów (dla {portions}x porcji):</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {scaledData.ingredients.map((item) => (
                    <div
                      key={item.ingredient_id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.9rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.product_name}</div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                          <span className={`badge ${item.store === 'Lidl' ? 'badge-lidl' : item.store === 'Biedronka' ? 'badge-biedronka' : 'badge-emerald'}`}>
                            {item.store}
                          </span>
                          {item.brand && <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.brand}</span>}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#10b981' }}>
                          {item.scaled_amount} {item.unit}
                          {item.kitchen_measure && (
                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#a7f3d0', marginLeft: '0.45rem' }}>
                              ({item.kitchen_measure})
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          👩 K: <strong style={{ color: '#f472b6' }}>{item.amount_female_g || Math.round(item.original_amount * 0.82)} {item.unit}</strong> | 👨 M: <strong style={{ color: '#60a5fa' }}>{item.amount_male_g || Math.round(item.original_amount * 1.18)} {item.unit}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Instrukcja Przygotowania Krok po Kroku:</h3>
                <div style={{ whiteSpace: 'pre-line', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  {scaledData.instructions || 'Brak opisu przygotowania.'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ZAMIEŃ POSIŁEK (MEAL SUBSTITUTION)                */}
        {/* ======================================================== */}
        {activeTab === 'substitute' && (
          <div>
            {/* If meal is currently substituted, show clear banner */}
            {meal?.is_custom_substitution && (
              <div
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
                    Obecny zamiennik posiłku:
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
                    {meal.custom_name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Łącznie: <strong>{meal.custom_calories} kcal</strong> (B: {meal.custom_protein_g}g, T: {meal.custom_fat_g}g, W: {meal.custom_carbs_g}g)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRevertSubstitution}
                  disabled={isSavingSub}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#f43f5e', borderColor: 'rgba(244,63,94,0.4)', fontWeight: 700 }}
                >
                  <RefreshCw size={14} /> Przywróć oryginalny posiłek
                </button>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>
                Zjadłeś coś innego niż w planie? Zeskanuj kod kreskowy (EAN) z opakowania lub wpisz produkty ręcznie. Możesz dodać kilka produktów przyciskiem <strong>„+”</strong>, a system sam zliczy kalorie i makroskładniki.
              </p>

              {/* Meal Name Input */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Nazwa Twojego posiłku / zamiennika:
                </label>
                <input
                  type="text"
                  value={subMealName}
                  onChange={(e) => setSubMealName(e.target.value)}
                  placeholder="np. Bułka grahamka z twarogiem i pomidorem"
                  className="form-control"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px' }}
                />
              </div>

              {/* CAMERA SCANNER VIEW (IF ACTIVE) */}
              {cameraActive && (
                <div
                  style={{
                    background: '#000',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    marginBottom: '1.25rem',
                    border: '2px solid #10b981',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                      📷 Skieruj aparat na kod kreskowy EAN...
                    </span>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.2rem 0.5rem' }}
                    >
                      <X size={15} /> Zamknij aparat
                    </button>
                  </div>
                  <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '75%',
                        height: '45%',
                        border: '2px dashed #10b981',
                        borderRadius: '8px',
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  {cameraError && (
                    <div style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      {cameraError}
                    </div>
                  )}
                </div>
              )}

              {/* PRODUCT ADD FORM CARD */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Barcode size={18} /> Dodaj produkt (EAN lub ręcznie)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCameraActive(!cameraActive)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Camera size={15} color="#38bdf8" />
                    {cameraActive ? 'Wyłącz aparat' : 'Skanuj aparatem'}
                  </button>
                </div>

                {/* EAN Input Row */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <input
                    type="text"
                    value={eanCode}
                    onChange={(e) => setEanCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookupEan()}
                    placeholder="Wpisz kod EAN produktu (np. 5900512300108)..."
                    className="form-control"
                    style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleLookupEan()}
                    disabled={isSearchingEan || !eanCode.trim()}
                    className="btn btn-secondary btn-sm"
                    style={{ fontWeight: 700, minWidth: '100px' }}
                  >
                    {isSearchingEan ? 'Szukam...' : 'Pobierz EAN'}
                  </button>
                </div>

                {eanNotFound && (
                  <div style={{ fontSize: '0.78rem', color: '#fbbf24', background: 'rgba(245,158,11,0.1)', padding: '0.45rem 0.75rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
                    ⚠️ Nie znaleziono kodu w bazie Open Food Facts. Wpisz nazwę i wartości ręcznie poniżej.
                  </div>
                )}

                {/* Product Name & Weight Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Nazwa produktu:
                    </label>
                    <input
                      type="text"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="np. Serek wiejski Piątnica"
                      className="form-control"
                      style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Waga (gramy):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={itemWeight}
                      onChange={(e) => setItemWeight(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Macros per 100g Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Kcal / 100g:
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={itemKcal100g}
                      onChange={(e) => setItemKcal100g(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Białko (g):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={itemP100g}
                      onChange={(e) => setItemP100g(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Tłuszcz (g):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={itemF100g}
                      onChange={(e) => setItemF100g(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Węglowodany (g):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={itemC100g}
                      onChange={(e) => setItemC100g(e.target.value)}
                      className="form-control"
                      style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                {/* Button to add product to current list */}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', fontWeight: 700, padding: '0.55rem' }}
                >
                  <Plus size={16} /> Dodaj ten produkt do posiłku
                </button>
              </div>

              {/* LIST OF PRODUCTS IN CUSTOM MEAL */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.6rem' }}>
                Składniki Twojego posiłku ({items.length}):
              </h4>

              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.25rem', border: '1px dashed var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Brak produktów. Użyj formularza powyżej lub kodu EAN, aby dodać składniki.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{it.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                          Waga: <strong style={{ color: '#fff' }}>{it.weight_g} g</strong> | 
                          Kcal: <strong style={{ color: '#34d399' }}>{it.calories}</strong> | 
                          B: <strong style={{ color: '#38bdf8' }}>{it.protein_g}g</strong>, 
                          T: <strong style={{ color: '#fbbf24' }}>{it.fat_g}g</strong>, 
                          W: <strong style={{ color: '#818cf8' }}>{it.carbs_g}g</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#f43f5e', padding: '0.25rem 0.5rem' }}
                        title="Usuń ten składnik"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TOTAL NUTRITIONAL SUMMARY FOR SUBSTITUTION */}
              <div
                style={{
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '0.4rem' }}>
                  Łączne wartości zmodyfikowanego posiłku:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <div className="macro-pill" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(16,185,129,0.3)' }}>
                    <span className="label">Kalorie</span>
                    <span className="value" style={{ color: '#34d399' }}>{totalSubKcal} kcal</span>
                  </div>
                  <div className="macro-pill" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(14,165,233,0.3)' }}>
                    <span className="label">Białko</span>
                    <span className="value" style={{ color: '#38bdf8' }}>{totalSubP} g</span>
                  </div>
                  <div className="macro-pill" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(245,158,11,0.3)' }}>
                    <span className="label">Tłuszcze</span>
                    <span className="value" style={{ color: '#fbbf24' }}>{totalSubF} g</span>
                  </div>
                  <div className="macro-pill" style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(99,102,241,0.3)' }}>
                    <span className="label">Węglowodany</span>
                    <span className="value" style={{ color: '#818cf8' }}>{totalSubC} g</span>
                  </div>
                </div>
              </div>

              {subSuccessMsg && (
                <div style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 700, textAlign: 'center' }}>
                  ✓ {subSuccessMsg}
                </div>
              )}

              {/* SAVE SUBSTITUTION BUTTON */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={handleSaveSubstitution}
                  disabled={isSavingSub || items.length === 0}
                  className="btn btn-primary"
                  style={{ fontWeight: 800, padding: '0.65rem 1.25rem', background: '#10b981', borderColor: '#10b981' }}
                >
                  <Check size={16} /> {isSavingSub ? 'Zapisywanie...' : 'Zapisz zamianę posiłku'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions for Dietitian (if onEdit or onDelete passed, on portions tab) */}
        {activeTab === 'portions' && (onEdit || onDelete) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(scaledData);
                }}
                className="btn btn-secondary"
                style={{
                  color: '#fff',
                  borderColor: '#f43f5e',
                  background: '#dc2626',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 700,
                }}
                title="Usuń ten przepis z bazy danych"
              >
                <Trash2 size={16} /> Usuń przepis
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(scaledData);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Edit3 size={15} /> Edytuj przepis
                </button>
              )}
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Zamknij
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortionScalerModal;
