import React, { useState, useMemo } from 'react';
import { TrendingDown, TrendingUp, Minus, Activity, ShieldCheck, Ruler } from 'lucide-react';

export function MonthlyMeasurementChart({ measurements = [], height: patientHeight = 175 }) {
  const [activeMetric, setActiveMetric] = useState('weight'); // 'weight' | 'waist' | 'bmi' | 'both'
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const validHeight = patientHeight && patientHeight > 0 ? Number(patientHeight) : 175;
  const hM = validHeight / 100;
  const minNormalWeight = +(18.5 * hM * hM).toFixed(1);
  const maxNormalWeight = +(24.9 * hM * hM).toFixed(1);

  // Filtrujemy pomiary chronologicznie
  const sorted = useMemo(() => {
    return [...measurements].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [measurements]);

  // Zakres 1 miesiąca (30 dni)
  const monthlyData = useMemo(() => {
    if (!sorted.length) return [];
    const latestDate = new Date(sorted[sorted.length - 1].date);
    const thirtyDaysBefore = new Date(latestDate);
    thirtyDaysBefore.setDate(thirtyDaysBefore.getDate() - 30);

    const filtered = sorted.filter(m => new Date(m.date) >= thirtyDaysBefore);
    // Jeśli w ostatnich 30 dniach jest mniej niż 2 pomiary, pokaż do 10 ostatnich pomiarów
    return filtered.length >= 2 ? filtered : sorted.slice(-10);
  }, [sorted]);

  // Statystyki zmian wagi i talii
  const stats = useMemo(() => {
    if (!monthlyData.length) return null;
    const first = monthlyData[0];
    const last = monthlyData[monthlyData.length - 1];

    const weightChange = (last.weight - first.weight).toFixed(1);
    const waistItems = monthlyData.filter(m => m.waist_cm != null);
    let waistChange = null;
    if (waistItems.length >= 2) {
      waistChange = (waistItems[waistItems.length - 1].waist_cm - waistItems[0].waist_cm).toFixed(1);
    }

    const currentBmi = +(last.weight / (hM * hM)).toFixed(1);

    return {
      firstDate: first.date,
      lastDate: last.date,
      currentWeight: last.weight,
      weightChange: parseFloat(weightChange),
      currentWaist: last.waist_cm,
      waistChange: waistChange ? parseFloat(waistChange) : null,
      currentBmi,
      count: monthlyData.length,
    };
  }, [monthlyData, hM]);

  const bmiClassification = useMemo(() => {
    if (!stats?.currentBmi) return null;
    const val = stats.currentBmi;
    if (val < 18.5) return { label: 'Niedowaga', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)' };
    if (val <= 24.9) return { label: 'Norma', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' };
    if (val <= 29.9) return { label: 'Nadwaga', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' };
    return { label: 'Otyłość', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' };
  }, [stats?.currentBmi]);

  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
        border: '1px dashed var(--border-subtle)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
          <Activity size={16} color="var(--accent-emerald)" />
          <strong>Wykres postępów (okres 1 miesiąca)</strong>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
          Brak pomiarów w tym miesiącu. Zapisz dzisiejszy pomiar wagi, aby aktywować wykres.
        </p>
      </div>
    );
  }

  // Obliczenia współrzędnych SVG
  const width = 380;
  const height = 145;
  const pad = { top: 16, right: 25, bottom: 25, left: 35 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  // Min / max dla wagi (obejmujące też normę BMI)
  const weights = monthlyData.map(d => d.weight);
  const minWData = Math.min(...weights);
  const maxWData = Math.max(...weights);
  const minW = Math.floor(Math.min(minWData, minNormalWeight) - 1.0);
  const maxW = Math.ceil(Math.max(maxWData, maxNormalWeight) + 1.0);
  const rangeW = maxW - minW || 1;

  // Min / max dla BMI
  const bmis = monthlyData.map(d => d.weight / (hM * hM));
  const minBmi = Math.floor(Math.min(Math.min(...bmis), 17.5) - 0.5);
  const maxBmi = Math.ceil(Math.max(Math.max(...bmis), 25.5) + 0.5);
  const rangeBmi = maxBmi - minBmi || 1;

  // Min / max dla talii
  const waists = monthlyData.map(d => d.waist_cm).filter(w => w != null);
  const hasWaist = waists.length >= 1;
  const minT = hasWaist ? Math.floor(Math.min(...waists) - 1) : 60;
  const maxT = hasWaist ? Math.ceil(Math.max(...waists) + 1) : 100;
  const rangeT = maxT - minT || 1;

  const isSingle = monthlyData.length === 1;

  // Punkty Wagi
  const pointsW = monthlyData.map((d, i) => {
    const x = isSingle ? pad.left + chartW / 2 : pad.left + (i / (monthlyData.length - 1)) * chartW;
    const y = isSingle ? pad.top + chartH / 2 : pad.top + chartH - ((d.weight - minW) / rangeW) * chartH;
    const itemBmi = +(d.weight / (hM * hM)).toFixed(1);
    return { x, y, data: { ...d, bmi: itemBmi } };
  });

  // Punkty BMI
  const pointsBmi = monthlyData.map((d, i) => {
    const x = isSingle ? pad.left + chartW / 2 : pad.left + (i / (monthlyData.length - 1)) * chartW;
    const bmiVal = d.weight / (hM * hM);
    const y = isSingle ? pad.top + chartH / 2 : pad.top + chartH - ((bmiVal - minBmi) / rangeBmi) * chartH;
    return { x, y, data: { ...d, bmi: +bmiVal.toFixed(1) } };
  });

  // Punkty Talii
  const pointsT = monthlyData
    .map((d, i) => {
      if (d.waist_cm == null) return null;
      const x = isSingle ? pad.left + chartW / 2 : pad.left + (i / (monthlyData.length - 1)) * chartW;
      const y = isSingle ? pad.top + chartH / 2 : pad.top + chartH - ((d.waist_cm - minT) / rangeT) * chartH;
      return { x, y, data: d };
    })
    .filter(Boolean);

  const pathW = isSingle
    ? `M ${pad.left} ${(pad.top + chartH / 2).toFixed(1)} L ${(pad.left + chartW).toFixed(1)} ${(pad.top + chartH / 2).toFixed(1)}`
    : pointsW.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  const areaW = isSingle
    ? ''
    : `${pathW} L ${pointsW[pointsW.length - 1].x.toFixed(1)} ${pad.top + chartH} L ${pointsW[0].x.toFixed(1)} ${pad.top + chartH} Z`;

  const pathBmi = isSingle
    ? `M ${pad.left} ${(pad.top + chartH / 2).toFixed(1)} L ${(pad.left + chartW).toFixed(1)} ${(pad.top + chartH / 2).toFixed(1)}`
    : pointsBmi.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  const areaBmi = isSingle
    ? ''
    : `${pathBmi} L ${pointsBmi[pointsBmi.length - 1].x.toFixed(1)} ${pad.top + chartH} L ${pointsBmi[0].x.toFixed(1)} ${pad.top + chartH} Z`;

  const pathT = isSingle
    ? `M ${pad.left} ${(pad.top + chartH / 2).toFixed(1)} L ${(pad.left + chartW).toFixed(1)} ${(pad.top + chartH / 2).toFixed(1)}`
    : pointsT.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  // Współrzędne normy BMI dla wykresu wagi (minNormalWeight i maxNormalWeight)
  const yNormMaxW = pad.top + chartH - ((maxNormalWeight - minW) / rangeW) * chartH;
  const yNormMinW = pad.top + chartH - ((minNormalWeight - minW) / rangeW) * chartH;
  const clampedNormTopW = Math.max(pad.top, Math.min(pad.top + chartH, yNormMaxW));
  const clampedNormBottomW = Math.max(pad.top, Math.min(pad.top + chartH, yNormMinW));

  // Współrzędne normy BMI dla wykresu BMI (18.5 i 24.9)
  const yNorm18Bmi = pad.top + chartH - ((18.5 - minBmi) / rangeBmi) * chartH;
  const yNorm25Bmi = pad.top + chartH - ((24.9 - minBmi) / rangeBmi) * chartH;
  const clampedNormTopBmi = Math.max(pad.top, Math.min(pad.top + chartH, yNorm25Bmi));
  const clampedNormBottomBmi = Math.max(pad.top, Math.min(pad.top + chartH, yNorm18Bmi));

  return (
    <div style={{
      marginTop: '1.25rem',
      padding: '1rem',
      background: 'rgba(17, 24, 39, 0.65)',
      borderRadius: '12px',
      border: '1px solid var(--border-subtle)',
    }}>
      {/* Nagłówek i podsumowanie */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={15} color="var(--accent-emerald)" /> Trend 30 dni: Waga, Talia & BMI
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
            {stats.firstDate} → {stats.lastDate} ({stats.count} pomiary) • Wzrost: <strong style={{ color: '#fff' }}>{validHeight} cm</strong>
          </div>
        </div>

        {/* Metryki zmian wagi, talii i aktualne BMI */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Badge aktualne BMI */}
          {stats.currentBmi && bmiClassification && (
            <div style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              background: bmiClassification.bg,
              border: `1px solid ${bmiClassification.border}`,
              color: bmiClassification.color,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontWeight: 800,
            }}>
              BMI: {stats.currentBmi} ({bmiClassification.label})
            </div>
          )}

          <div style={{
            fontSize: '0.72rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            background: stats.weightChange <= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            border: `1px solid ${stats.weightChange <= 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            color: stats.weightChange <= 0 ? '#34d399' : '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontWeight: 700,
          }}>
            {stats.weightChange < 0 ? <TrendingDown size={12} /> : stats.weightChange > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
            Waga: {stats.weightChange > 0 ? `+${stats.weightChange}` : stats.weightChange} kg
          </div>

          {stats.waistChange != null && (
            <div style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              background: stats.waistChange <= 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${stats.waistChange <= 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              color: stats.waistChange <= 0 ? '#38bdf8' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 700,
            }}>
              {stats.waistChange < 0 ? <TrendingDown size={12} /> : stats.waistChange > 0 ? <TrendingUp size={12} /> : <Minus size={12} />}
              Talia: {stats.waistChange > 0 ? `+${stats.waistChange}` : stats.waistChange} cm
            </div>
          )}
        </div>
      </div>

      {/* Belka normy BMI WHO */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '6px',
        padding: '0.35rem 0.65rem',
        marginBottom: '0.65rem',
        fontSize: '0.70rem',
        color: '#e5e7eb',
      }}>
        <ShieldCheck size={14} color="#34d399" style={{ flexShrink: 0 }} />
        <div>
          <span>Poziom prawidłowy BMI: <strong style={{ color: '#34d399' }}>18.5 – 24.9</strong> (Norma WHO)</span>
          <span style={{ color: 'var(--text-dim)', marginLeft: '0.4rem' }}>
            • Waga w normie dla {validHeight} cm: <strong style={{ color: '#fff' }}>{minNormalWeight} – {maxNormalWeight} kg</strong>
          </span>
        </div>
      </div>

      {/* Przełącznik serii: Waga / Talia / BMI / Obie */}
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveMetric('weight')}
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            background: activeMetric === 'weight' ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.05)',
            color: activeMetric === 'weight' ? '#fff' : 'var(--text-muted)',
          }}
        >
          ⚖️ Waga (kg)
        </button>
        <button
          type="button"
          onClick={() => setActiveMetric('bmi')}
          style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            background: activeMetric === 'bmi' ? '#8b5cf6' : 'rgba(255,255,255,0.05)',
            color: activeMetric === 'bmi' ? '#fff' : 'var(--text-muted)',
          }}
        >
          📊 Wskaźnik BMI
        </button>
        {hasWaist && (
          <button
            type="button"
            onClick={() => setActiveMetric('waist')}
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: activeMetric === 'waist' ? '#0284c7' : 'rgba(255,255,255,0.05)',
              color: activeMetric === 'waist' ? '#fff' : 'var(--text-muted)',
            }}
          >
            📏 Talia (cm)
          </button>
        )}
        {hasWaist && (
          <button
            type="button"
            onClick={() => setActiveMetric('both')}
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              background: activeMetric === 'both' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255,255,255,0.05)',
              color: activeMetric === 'both' ? '#a5b4fc' : 'var(--text-muted)',
            }}
          >
            ✨ Porównaj oba
          </button>
        )}
      </div>

      {/* SVG Interaktywny Wykres */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bmiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="waistGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Strefa Normy BMI w trybie Waga / Obie */}
          {(activeMetric === 'weight' || activeMetric === 'both') && clampedNormBottomW > clampedNormTopW && (
            <g>
              <rect
                x={pad.left}
                y={clampedNormTopW}
                width={chartW}
                height={clampedNormBottomW - clampedNormTopW}
                fill="rgba(16, 185, 129, 0.10)"
              />
              <line
                x1={pad.left}
                y1={yNormMaxW}
                x2={width - pad.right}
                y2={yNormMaxW}
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              <line
                x1={pad.left}
                y1={yNormMinW}
                x2={width - pad.right}
                y2={yNormMinW}
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              <text
                x={width - pad.right - 2}
                y={yNormMaxW - 3}
                textAnchor="end"
                fill="#34d399"
                fontSize="7"
                fontWeight="700"
              >
                Norma BMI (24.9)
              </text>
            </g>
          )}

          {/* Strefa Normy BMI w trybie BMI */}
          {activeMetric === 'bmi' && clampedNormBottomBmi > clampedNormTopBmi && (
            <g>
              <rect
                x={pad.left}
                y={clampedNormTopBmi}
                width={chartW}
                height={clampedNormBottomBmi - clampedNormTopBmi}
                fill="rgba(16, 185, 129, 0.12)"
              />
              <line
                x1={pad.left}
                y1={yNorm25Bmi}
                x2={width - pad.right}
                y2={yNorm25Bmi}
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="3,3"
                opacity="0.7"
              />
              <line
                x1={pad.left}
                y1={yNorm18Bmi}
                x2={width - pad.right}
                y2={yNorm18Bmi}
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="3,3"
                opacity="0.7"
              />
              <text
                x={width - pad.right - 2}
                y={yNorm25Bmi - 3}
                textAnchor="end"
                fill="#34d399"
                fontSize="7"
                fontWeight="700"
              >
                Norma BMI (18.5 – 24.9)
              </text>
            </g>
          )}

          {/* Linie siatki poziomej */}
          {[0, 0.5, 1].map((ratio) => {
            const y = pad.top + chartH * ratio;
            let valLabel = '';
            if (activeMetric === 'bmi') {
              valLabel = (maxBmi - ratio * rangeBmi).toFixed(1);
            } else {
              valLabel = (maxW - ratio * rangeW).toFixed(1);
            }
            return (
              <g key={ratio}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={width - pad.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="2,2"
                />
                <text
                  x={pad.left - 4}
                  y={y + 3}
                  textAnchor="end"
                  fill="var(--text-dim)"
                  fontSize="8"
                  fontWeight="600"
                >
                  {valLabel}
                </text>
              </g>
            );
          })}

          {/* Oś X - data początkowa i końcowa */}
          <text
            x={pad.left}
            y={height - 6}
            textAnchor="start"
            fill="var(--text-dim)"
            fontSize="8"
          >
            {monthlyData[0].date.slice(5)}
          </text>
          <text
            x={width - pad.right}
            y={height - 6}
            textAnchor="end"
            fill="var(--text-dim)"
            fontSize="8"
          >
            {monthlyData[monthlyData.length - 1].date.slice(5)}
          </text>

          {/* Seria Talia (niebieska) */}
          {(activeMetric === 'waist' || activeMetric === 'both') && hasWaist && (
            <>
              <path
                d={pathT}
                fill="none"
                stroke="#38bdf8"
                strokeWidth={activeMetric === 'waist' ? '2.5' : '1.8'}
                strokeDasharray={activeMetric === 'both' ? '3,3' : undefined}
              />
              {pointsT.map((p, idx) => (
                <circle
                  key={`t-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.data?.id === p.data.id ? 5 : 3}
                  fill="#38bdf8"
                  stroke="#111827"
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </>
          )}

          {/* Seria Waga (zielona) */}
          {(activeMetric === 'weight' || activeMetric === 'both') && (
            <>
              <path d={areaW} fill="url(#weightGrad)" />
              <path
                d={pathW}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
              {pointsW.map((p, idx) => (
                <circle
                  key={`w-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.data?.id === p.data.id ? 5.5 : 3.5}
                  fill="#10b981"
                  stroke="#111827"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </>
          )}

          {/* Seria BMI (fioletowa) */}
          {activeMetric === 'bmi' && (
            <>
              <path d={areaBmi} fill="url(#bmiGrad)" />
              <path
                d={pathBmi}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
              />
              {pointsBmi.map((p, idx) => (
                <circle
                  key={`bmi-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPoint?.data?.id === p.data.id ? 5.5 : 3.5}
                  fill="#8b5cf6"
                  stroke="#111827"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'r 0.15s' }}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </>
          )}
        </svg>

        {/* Tooltip przy najechaniu */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '8px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid var(--accent-emerald)',
              padding: '0.35rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
              lineHeight: 1.3,
            }}
          >
            <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>{hoveredPoint.data.date}</div>
            <div>⚖️ Waga: <strong style={{ color: '#34d399' }}>{hoveredPoint.data.weight} kg</strong></div>
            {hoveredPoint.data.bmi && (
              <div>📊 BMI: <strong style={{ color: '#c084fc' }}>{hoveredPoint.data.bmi}</strong></div>
            )}
            {hoveredPoint.data.waist_cm && (
              <div>📏 Talia: <strong style={{ color: '#38bdf8' }}>{hoveredPoint.data.waist_cm} cm</strong></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyMeasurementChart;
