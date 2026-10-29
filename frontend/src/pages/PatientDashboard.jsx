import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { dietPlansApi, measurementsApi, chatApi, authApi } from '../api/client';
import { PortionScalerModal } from '../components/PortionScalerModal';
import RecommendationsHistoryModal from '../components/RecommendationsHistoryModal';
import { MonthlyMeasurementChart } from '../components/MonthlyMeasurementChart';
import { PatientLoadPackageModal } from '../components/PatientLoadPackageModal';
import {
  Flame, Calendar, ChevronLeft, ChevronRight, CheckCircle2, Circle,
  Plus, Activity, Sparkles, Info, ChefHat, Clock, Package, X, Bell, History, RefreshCw
} from 'lucide-react';


function getMonday(dateInput) {
  const d = new Date(dateInput);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return mon.toISOString().split('T')[0];
}

export function PatientDashboard() {
  const { user, profile } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [weekStartDate, setWeekStartDate] = useState(getMonday(new Date()));
  const [weeklyData, setWeeklyData] = useState(null);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [newPackageNotifs, setNewPackageNotifs] = useState([]);
  const [dismissedNotifs, setDismissedNotifs] = useState([]);
  const [showRecModal, setShowRecModal] = useState(false);
  const [recDismissed, setRecDismissed] = useState(false);
  const [showLoadPackageModal, setShowLoadPackageModal] = useState(false);

  useEffect(() => {
    if (profile?.official_recommendations) {
      const savedSig = localStorage.getItem('adonis_dismissed_rec_sig');
      const currentSig = `${profile.recommendations_updated_at || ''}_${profile.official_recommendations.slice(0, 30)}`;
      if (savedSig === currentSig) {
        setRecDismissed(true);
      } else {
        setRecDismissed(false);
      }
    }
  }, [profile?.official_recommendations, profile?.recommendations_updated_at]);

  const handleDismissRec = () => {
    const currentSig = `${profile?.recommendations_updated_at || ''}_${(profile?.official_recommendations || '').slice(0, 30)}`;
    localStorage.setItem('adonis_dismissed_rec_sig', currentSig);
    setRecDismissed(true);
  };


  // Load unread PLAN_UPDATE notifications (new packages from dietitian)
  const loadPackageNotifications = useCallback(async () => {
    try {
      const notifs = await chatApi.getNotifications();
      const planNotifs = notifs.filter(n => !n.is_read && n.notification_type === 'plan_update');
      setNewPackageNotifs(planNotifs);
    } catch (_) {}
  }, []);

  useEffect(() => { loadPackageNotifications(); }, [loadPackageNotifications]);

  async function dismissPackageNotif(notifId) {
    try {
      await chatApi.markNotificationRead(notifId);
      setNewPackageNotifs(prev => prev.filter(n => n.id !== notifId));
    } catch (_) {
      setNewPackageNotifs(prev => prev.filter(n => n.id !== notifId));
    }
  }

  // Modal for Recipe Description, Portions and Substitution
  const [selectedMealForOptions, setSelectedMealForOptions] = useState(null);
  const [optionsInitialTab, setOptionsInitialTab] = useState('portions');

  // New measurement form
  const [measurementDate, setMeasurementDate] = useState(todayStr);
  const [newWeight, setNewWeight] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Load weekly plan when weekStartDate changes
  useEffect(() => {
    loadWeeklyPlan();
  }, [weekStartDate]);

  // Load daily details when selectedDate changes
  useEffect(() => {
    loadDailyPlan();
  }, [selectedDate]);

  const [mealSettings, setMealSettings] = useState(null);

  useEffect(() => {
    loadMeasurements();
    authApi.getSettings().then(setMealSettings).catch(() => {});
  }, []);

  const getMealTime = (mealType) => {
    const t = (mealType || '').toLowerCase();
    if (t.includes('śniadanie') && !t.includes('drugie')) return mealSettings?.meal_time_breakfast || '08:00';
    if (t.includes('drugie')) return mealSettings?.meal_time_second_breakfast || '11:00';
    if (t.includes('obiad')) return mealSettings?.meal_time_lunch || '14:00';
    if (t.includes('przekąsk') || t.includes('podwieczor')) return mealSettings?.meal_time_snack || '17:00';
    if (t.includes('kolacj')) return mealSettings?.meal_time_dinner || '20:00';
    return '12:00';
  };

  async function loadWeeklyPlan() {
    try {
      const data = await dietPlansApi.getWeekly(weekStartDate);
      setWeeklyData(data);
    } catch (err) {
      console.error('Błąd pobierania tygodniowego planu:', err);
    }
  }

  async function loadDailyPlan() {
    setLoading(true);
    try {
      const plan = await dietPlansApi.getDaily(selectedDate);
      setDailyPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMeasurements() {
    try {
      const mList = await measurementsApi.list();
      setMeasurements(mList);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleToggleCompleted(mealId) {
    try {
      await dietPlansApi.toggleMealComplete(mealId);
      setDailyPlan((prev) => ({
        ...prev,
        meals: prev.meals.map((m) =>
          m.id === mealId ? { ...m, is_completed: !m.is_completed } : m
        ),
      }));
      // Odśwież dane tygodnia, by zaktualizować status w kalendarzu
      loadWeeklyPlan();
    } catch (err) {
      alert(`Błąd: ${err.message}`);
    }
  }

  async function handleAddMeasurement(e) {
    e.preventDefault();
    if (!newWeight) return;
    try {
      await measurementsApi.add({
        date: measurementDate || selectedDate,
        weight: parseFloat(newWeight),
        waist_cm: newWaist ? parseFloat(newWaist) : null,
        notes: newNotes,
      });
      setNewWeight('');
      setNewWaist('');
      setNewNotes('');
      loadMeasurements();
    } catch (err) {
      alert(`Błąd zapisu pomiaru: ${err.message}`);
    }
  }

  function changeWeek(deltaWeeks) {
    const d = new Date(weekStartDate);
    d.setDate(d.getDate() + deltaWeeks * 7);
    const newMon = d.toISOString().split('T')[0];
    setWeekStartDate(newMon);
    setSelectedDate(newMon);
  }

  function resetToCurrentWeek() {
    const mon = getMonday(new Date());
    setWeekStartDate(mon);
    setSelectedDate(todayStr);
  }

  const calorieGoal = profile?.daily_calories_goal || 2000;
  const currentTotalCals = dailyPlan?.total_calories || 0;
  const calPercent = Math.min(Math.round((currentTotalCals / calorieGoal) * 100), 100);

  // Skrócone nazwy dni
  const shortDaysMap = {
    'Poniedziałek': 'Pon',
    'Wtorek': 'Wt',
    'Środa': 'Śr',
    'Czwartek': 'Czw',
    'Piątek': 'Pt',
    'Sobota': 'Sob',
    'Niedziela': 'Ndz',
  };

  return (
    <div className="page-container">
      {/* Personalized Welcome Header with Full Name */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(99,102,241,0.04) 100%)',
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
              fontSize: '1.2rem',
              fontWeight: 800,
              boxShadow: '0 4px 12px var(--accent-emerald-glow)',
            }}
          >
            {user?.first_name ? user.first_name[0] : 'P'}
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Pulpit Pacjenta
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#fff' }}>
              {user?.first_name} {user?.last_name || ''}
            </h1>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              {user?.email} • Opiekun: <strong style={{ color: 'var(--accent-emerald)' }}>{user?.assigned_dietitian_name || 'Dietetyk Adonis'}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ height: '46px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'right', background: 'rgba(255,255,255,0.03)', padding: '0 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>DZIENNY CEL</div>
            <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '0.95rem', lineHeight: 1.1 }}>{calorieGoal} kcal</div>
          </div>
          <div style={{ height: '46px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'right', background: 'rgba(255,255,255,0.03)', padding: '0 0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 600 }}>AKTUALNA WAGA</div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem', lineHeight: 1.1 }}>{profile?.current_weight || '—'} kg</div>
          </div>
          <button
            onClick={() => setShowRecModal(true)}
            style={{
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              padding: '0 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Przeglądaj pełną historię zaleceń od dietetyka"
          >
            <History size={15} />
            Historia zaleceń
          </button>
          <button
            onClick={() => setShowLoadPackageModal(true)}
            style={{
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(16, 185, 129, 0.22))',
              border: '1px solid rgba(99, 102, 241, 0.45)',
              color: '#a5b4fc',
              padding: '0 1rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Samodzielnie załaduj pakiet diety do swojego kalendarza"
          >
            <Package size={16} color="#a5b4fc" />
            Załaduj pakiet diety
          </button>
        </div>
      </div>

      {/* New Package Notifications Banner */}
      {newPackageNotifs.map(notif => (
        <div key={notif.id} className="package-notification-banner" style={{ marginBottom: '1rem' }}>
          <div style={{ background: 'var(--accent-emerald)', padding: '0.5rem', borderRadius: '10px', flexShrink: 0 }}>
            <Package size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-emerald)', marginBottom: '0.15rem' }}>
              🎉 {notif.title}
            </div>
            <div style={{ fontSize: '0.83rem', color: 'var(--text-main)' }}>{notif.message}</div>
          </div>
          <button
            onClick={() => dismissPackageNotif(notif.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0, padding: '0.25rem' }}
            title="Zamknij"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      {/* Official Recommendations Banner with Close 'X' and History button */}
      {profile?.official_recommendations && !recDismissed && (
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.75rem',
            marginBottom: '1.75rem',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(99,102,241,0.06) 100%)',
            border: '1px solid rgba(16,185,129,0.35)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            position: 'relative',
          }}
        >
          <div style={{ background: '#10b981', padding: '0.5rem', borderRadius: '10px', color: '#fff', flexShrink: 0 }}>
            <Sparkles size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399', margin: 0 }}>
                  Oficjalne Zalecenia Dietetyczne
                </h3>
                {profile.recommendations_updated_at && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    • Zaktualizowano: {new Date(profile.recommendations_updated_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowRecModal(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.15))',
                    color: 'var(--text-main, #f8fafc)',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <History size={13} />
                  Zobacz historię zaleceń
                </button>
                <button
                  onClick={handleDismissRec}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted, #94a3b8)',
                    padding: '0.3rem',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Zamknij (zawsze dostępne w historii)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.45rem', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
              {profile.official_recommendations}
            </p>
          </div>
        </div>
      )}


      {/* WEEKLY CALENDAR WITH DAYS OF WEEK & HOVER MEAL DETAILS */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '0.5rem', borderRadius: '10px' }}>
              <Calendar size={22} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Tygodniowy Kalendarz Jadłospisu</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Najedź na dzień, aby zobaczyć szczegóły dań. Kliknij, aby otworzyć dzień.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => changeWeek(-1)}
              className="btn btn-secondary btn-sm"
              title="Poprzedni tydzień"
            >
              <ChevronLeft size={16} /> Poprzedni tydzień
            </button>

            <button
              onClick={resetToCurrentWeek}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem' }}
            >
              Bieżący tydzień
            </button>

            <button
              onClick={() => changeWeek(1)}
              className="btn btn-secondary btn-sm"
              title="Następny tydzień"
            >
              Następny tydzień <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 7 Days of the Week Grid */}
        <div className="week-calendar-scroll-wrapper">
          <div className="week-calendar-grid">
          {weeklyData?.days.map((day) => {
            const isSelected = day.date === selectedDate;
            const isToday = day.date === todayStr;
            const isHovered = hoveredDate === day.date;
            const shortName = shortDaysMap[day.day_name] || day.day_name;
            const dateParts = day.date.split('-');
            const displayDate = `${dateParts[2]}.${dateParts[1]}`;

            return (
              <div
                key={day.date}
                style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredDate(day.date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div
                  onClick={() => setSelectedDate(day.date)}
                  style={{
                    padding: '1rem 0.6rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(16,185,129,0.25) 0%, rgba(6,78,59,0.4) 100%)'
                      : isHovered
                      ? 'rgba(255,255,255,0.08)'
                      : 'rgba(255,255,255,0.03)',
                    border: isSelected
                      ? '2px solid #10b981'
                      : isToday
                      ? '1px dashed #34d399'
                      : '1px solid var(--border-subtle)',
                    boxShadow: isSelected ? '0 0 16px rgba(16,185,129,0.3)' : 'none',
                    transform: isSelected || isHovered ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? '#34d399' : 'var(--text-main)' }}>
                      {shortName}
                    </span>
                    {isToday && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          background: '#10b981',
                          color: '#fff',
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}
                      >
                        Dziś
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
                    {displayDate}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: day.meals_count > 0 ? '#10b981' : 'var(--text-dim)', fontWeight: 600 }}>
                    {day.meals_count > 0 ? `${day.meals_count} posiłki` : 'Brak dań'}
                  </div>

                  {day.meals_count > 0 && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {day.total_calories} kcal
                    </div>
                  )}
                </div>

                {/* HOVER TOOLTIP / POPOVER WITH MEAL DETAILS */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '105%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '280px',
                      background: '#0f172a',
                      border: '1px solid rgba(16,185,129,0.5)',
                      boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
                      borderRadius: '12px',
                      padding: '1rem',
                      zIndex: 1000,
                      pointerEvents: 'none',
                      animation: 'fadeIn 0.15s ease',
                    }}
                  >
                    <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#34d399' }}>
                        {day.day_name}, {displayDate}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        <span>🔥 {day.total_calories} kcal</span>
                        <span>🥩 B: {day.total_protein_g}g</span>
                        <span>🥑 T: {day.total_fat_g}g</span>
                        <span>🌾 W: {day.total_carbs_g}g</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {day.meals_preview && day.meals_preview.length > 0 ? (
                        day.meals_preview.map((m, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              padding: '0.4rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                              <span style={{ color: '#10b981', fontWeight: 700, marginRight: '0.3rem' }}>
                                {m.meal_type}:
                              </span>
                              <span style={{ color: '#fff' }}>{m.recipe_title}</span>
                            </div>
                            <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <div style={{ color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>
                                {m.calories} kcal
                              </div>
                              {m.preparation_time_minutes ? (
                                <div style={{ color: 'var(--text-dim)', fontSize: '0.67rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                                  <Clock size={10} /> {m.preparation_time_minutes} min
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '0.5rem' }}>
                          Brak przypisanych dań na ten dzień.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Meals & Plan, Right = Goals & Measurements */}
      <div className="dashboard-grid" style={{ padding: 0 }}>
        {/* LEFT COLUMN: MEAL PLAN FOR SELECTED DAY */}
        <div>
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Wybrany dzień jadłospisu:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', margin: 0 }}>
                  {dailyPlan?.day_name || 'Jadłospis'}, {selectedDate}
                </h2>
                {selectedDate === todayStr ? (
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    Dzisiaj
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedDate(todayStr);
                      setWeekStartDate(getMonday(new Date()));
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, padding: 0 }}
                  >
                    ← Wróć do dzisiaj
                  </button>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setWeekStartDate(getMonday(e.target.value));
                }}
                style={{
                  background: '#1f2937',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          {/* Meals list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dailyPlan?.meals.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Brak zaplanowanych dań na ten dzień ({selectedDate}). Twój dietetyk wkrótce przypisze posiłki!
              </div>
            ) : (
              dailyPlan?.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    opacity: meal.is_completed ? 0.65 : 1,
                    borderColor: meal.is_completed ? 'rgba(16,185,129,0.4)' : 'var(--border-subtle)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      {/* Dish Photo Thumbnail if available */}
                      {meal.recipe.image_url && (
                        <div
                          style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          }}
                        >
                          <img
                            src={meal.recipe.image_url}
                            alt={meal.recipe.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                          <span className="badge badge-emerald">{meal.meal_type}</span>
                          {meal.is_custom_substitution && (
                            <span style={{ fontSize: '0.72rem', background: 'rgba(245,158,11,0.2)', color: '#fbbf24', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 800, border: '1px solid rgba(245,158,11,0.3)' }}>
                              Zamieniony
                            </span>
                          )}
                          <span style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(16,185,129,0.12)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(16,185,129,0.25)' }}>
                            <Clock size={12} /> {getMealTime(meal.meal_type)}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Porcja: <strong>{meal.portions}x</strong>
                          </span>
                          {meal.recipe.preparation_time_minutes ? (
                            <span style={{ fontSize: '0.78rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(56,189,248,0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600, border: '1px solid rgba(56,189,248,0.25)' }}>
                              <Clock size={12} /> Czas: {meal.recipe.preparation_time_minutes} min
                            </span>
                          ) : null}
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{meal.recipe.title}</h3>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleCompleted(meal.id)}
                      className="btn btn-sm"
                      style={{
                        background: meal.is_completed ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                        borderColor: meal.is_completed ? '#10b981' : 'var(--border-subtle)',
                        color: meal.is_completed ? '#34d399' : 'var(--text-muted)',
                      }}
                    >
                      {meal.is_completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      {meal.is_completed ? 'Zjedzone' : 'Oznacz jako zjedzone'}
                    </button>
                  </div>

                  {/* Macro indicators */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div className="macro-pill">
                      <span className="label">Kalorie</span>
                      <span className="value">{meal.recipe.calories} kcal</span>
                    </div>
                    <div className="macro-pill">
                      <span className="label">Białko</span>
                      <span className="value">{meal.recipe.protein_g} g</span>
                    </div>
                    <div className="macro-pill">
                      <span className="label">Tłuszcze</span>
                      <span className="value">{meal.recipe.fat_g} g</span>
                    </div>
                    <div className="macro-pill">
                      <span className="label">Węglowodany</span>
                      <span className="value">{meal.recipe.carbs_g} g</span>
                    </div>
                  </div>

                  {/* Action buttons: Opcje & Zamień posiłek */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        setSelectedMealForOptions(meal);
                        setOptionsInitialTab('portions');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Info size={14} color="#10b981" /> Opcje
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMealForOptions(meal);
                        setOptionsInitialTab('substitute');
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        borderColor: meal.is_custom_substitution ? '#fbbf24' : 'rgba(16,185,129,0.4)',
                        color: meal.is_custom_substitution ? '#fbbf24' : '#34d399',
                        background: meal.is_custom_substitution ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.08)',
                        fontWeight: 600,
                      }}
                    >
                      <RefreshCw size={14} /> Zamień posiłek
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DAILY GOALS & MEASUREMENTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Calorie & Macro Target Progress */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={20} color="#10b981" /> Cel Kaloryczny Dnia
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Zaplanowano:</span>
                <strong>
                  {currentTotalCals} / {calorieGoal} kcal
                </strong>
              </div>
              <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${calPercent}%`,
                    background: calPercent > 105 ? '#f43f5e' : 'linear-gradient(90deg, #10b981, #34d399)',
                    borderRadius: '5px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BIAŁKO</div>
                <div style={{ fontWeight: 800, color: '#38bdf8' }}>{dailyPlan?.total_protein_g || 0}g</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>cel: {profile?.protein_goal_g || 140}g</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TŁUSZCZE</div>
                <div style={{ fontWeight: 800, color: '#fbbf24' }}>{dailyPlan?.total_fat_g || 0}g</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>cel: {profile?.fat_goal_g || 60}g</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>WĘGLOWODANY</div>
                <div style={{ fontWeight: 800, color: '#818cf8' }}>{dailyPlan?.total_carbs_g || 0}g</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>cel: {profile?.carbs_goal_g || 220}g</div>
              </div>
            </div>
          </div>

          {/* Measurements Form */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} color="#10b981" /> Wprowadź Pomiar
            </h3>

            <form onSubmit={handleAddMeasurement} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Data pomiaru (domyślnie bieżąca, edytowalna)</label>
                <input
                  type="date"
                  value={measurementDate}
                  onChange={(e) => setMeasurementDate(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Waga (kg)*</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="np. 84.5"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Talia (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="np. 92.0"
                    value={newWaist}
                    onChange={(e) => setNewWaist(e.target.value)}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notatki</label>
                <input
                  type="text"
                  placeholder="np. ważenie na czczo po treningu"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                <Plus size={14} /> Zapisz Dzisiejszy Pomiar
              </button>
            </form>

            {/* Wykres postępów za okres 1 miesiąca (Waga, Talia i BMI) */}
            <MonthlyMeasurementChart measurements={measurements} height={profile?.height} />

            {/* Measurement history & Audit Log */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Ostatnie pomiary:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                {measurements.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-dim)', marginRight: '0.5rem' }}>{m.date}</span>
                      <strong style={{ color: '#10b981' }}>{m.weight} kg</strong>
                      {m.waist_cm && <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({m.waist_cm} cm)</span>}
                    </div>

                    {m.audit_logs && m.audit_logs.length > 0 && (
                      <span className="badge" style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', fontSize: '0.65rem' }} title={`Skorygowane przez ${m.audit_logs[0].changed_by_name}: ${m.audit_logs[0].reason}`}>
                        Skorygowane przez dietetyka
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Opcje Posiłku i Zamiennik Modal */}
      {selectedMealForOptions && (
        <PortionScalerModal
          recipeId={selectedMealForOptions.recipe.id}
          initialPortions={selectedMealForOptions.portions}
          meal={selectedMealForOptions}
          initialTab={optionsInitialTab}
          onClose={() => setSelectedMealForOptions(null)}
          onMealUpdated={() => {
            loadDailyPlan();
            loadWeeklyPlan();
          }}
        />
      )}

      {/* Historia zaleceń dietetycznych Modal */}
      <RecommendationsHistoryModal
        isOpen={showRecModal}
        onClose={() => setShowRecModal(false)}
      />

      {/* Samodzielne ładowanie pakietów diet przez pacjenta Modal */}
      <PatientLoadPackageModal
        isOpen={showLoadPackageModal}
        onClose={() => setShowLoadPackageModal(false)}
        onPackageLoaded={() => {
          loadWeeklyPlan();
          loadDailyPlan();
        }}
        initialStartDate={weekStartDate}
      />
    </div>

  );
}
export default PatientDashboard;
