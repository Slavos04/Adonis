import React, { useState, useEffect } from 'react';
import { X, Settings, Bell, Lock, Palette, CheckCircle2, AlertCircle, Clock, Trash2, AlertTriangle } from 'lucide-react';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function SettingsModal({ isOpen, onClose }) {
  const { theme, setTheme, THEMES, user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState(null);
  const [settingsError, setSettingsError] = useState(null);

  // Notification toggles
  const [notifyDietPlan, setNotifyDietPlan] = useState(true);
  const [notifyRecommendations, setNotifyRecommendations] = useState(true);
  const [notifyChatMessages, setNotifyChatMessages] = useState(true);
  const [notifyMealReminders, setNotifyMealReminders] = useState(true);

  // Meal Hours
  const [mealTimeBreakfast, setMealTimeBreakfast] = useState('08:00');
  const [mealTimeSecondBreakfast, setMealTimeSecondBreakfast] = useState('11:00');
  const [mealTimeLunch, setMealTimeLunch] = useState('14:00');
  const [mealTimeSnack, setMealTimeSnack] = useState('17:00');
  const [mealTimeDinner, setMealTimeDinner] = useState('20:00');

  // Change password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  async function handleDeleteMyAccount() {
    setDeletingAccount(true);
    try {
      await authApi.deleteMyAccount();
      alert('Twoje konto zostało trwale usunięte.');
      logout();
      window.location.reload();
    } catch (err) {
      alert(`Błąd usuwania konta: ${err.message}`);
    } finally {
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      setPasswordMsg(null);
      setPasswordError(null);
      setSettingsMsg(null);
      setSettingsError(null);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowDeleteModal(false);
    }
  }, [isOpen]);

  async function loadSettings() {
    setLoading(true);
    try {
      const data = await authApi.getSettings();
      setNotifyDietPlan(data.notify_new_diet_plan ?? data.notify_diet_plan ?? true);
      setNotifyRecommendations(data.notify_recommendations ?? true);
      setNotifyChatMessages(data.notify_chat_messages ?? true);
      setNotifyMealReminders(data.notify_upcoming_meals ?? data.notify_meal_reminders ?? true);
      if (data.meal_time_breakfast) setMealTimeBreakfast(data.meal_time_breakfast);
      if (data.meal_time_second_breakfast) setMealTimeSecondBreakfast(data.meal_time_second_breakfast);
      if (data.meal_time_lunch) setMealTimeLunch(data.meal_time_lunch);
      if (data.meal_time_snack) setMealTimeSnack(data.meal_time_snack);
      if (data.meal_time_dinner) setMealTimeDinner(data.meal_time_dinner);
      if (data.app_theme && data.app_theme !== theme) {
        setTheme(data.app_theme);
      }
    } catch (_) {
      // Domyślne wartości pozostają
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(key, currentVal, setter) {
    const newVal = !currentVal;
    setter(newVal);

    const payload = {
      notify_new_diet_plan: key === 'diet_plan' ? newVal : notifyDietPlan,
      notify_recommendations: key === 'recommendations' ? newVal : notifyRecommendations,
      notify_chat_messages: key === 'chat' ? newVal : notifyChatMessages,
      notify_upcoming_meals: key === 'meal' ? newVal : notifyMealReminders,
      meal_time_breakfast: mealTimeBreakfast,
      meal_time_second_breakfast: mealTimeSecondBreakfast,
      meal_time_lunch: mealTimeLunch,
      meal_time_snack: mealTimeSnack,
      meal_time_dinner: mealTimeDinner,
      app_theme: theme,
    };

    try {
      await authApi.updateSettings(payload);
    } catch (err) {
      setSettingsError(err.message || 'Nie udało się zapisać ustawienia.');
      setter(currentVal); // cofnięcie
    }
  }

  async function handleMealTimeSave(field, val) {
    if (field === 'breakfast') setMealTimeBreakfast(val);
    if (field === 'second_breakfast') setMealTimeSecondBreakfast(val);
    if (field === 'lunch') setMealTimeLunch(val);
    if (field === 'snack') setMealTimeSnack(val);
    if (field === 'dinner') setMealTimeDinner(val);

    const payload = {
      notify_new_diet_plan: notifyDietPlan,
      notify_recommendations: notifyRecommendations,
      notify_chat_messages: notifyChatMessages,
      notify_upcoming_meals: notifyMealReminders,
      meal_time_breakfast: field === 'breakfast' ? val : mealTimeBreakfast,
      meal_time_second_breakfast: field === 'second_breakfast' ? val : mealTimeSecondBreakfast,
      meal_time_lunch: field === 'lunch' ? val : mealTimeLunch,
      meal_time_snack: field === 'snack' ? val : mealTimeSnack,
      meal_time_dinner: field === 'dinner' ? val : mealTimeDinner,
      app_theme: theme,
    };

    try {
      await authApi.updateSettings(payload);
      setSettingsMsg('Godzina posiłku została zapisana.');
      setTimeout(() => setSettingsMsg(null), 2500);
    } catch (err) {
      setSettingsError(err.message || 'Nie udało się zapisać godziny.');
    }
  }

  async function handleThemeChange(newTheme) {
    setTheme(newTheme);
    try {
      await authApi.updateSettings({
        notify_new_diet_plan: notifyDietPlan,
        notify_recommendations: notifyRecommendations,
        notify_chat_messages: notifyChatMessages,
        notify_upcoming_meals: notifyMealReminders,
        meal_time_breakfast: mealTimeBreakfast,
        meal_time_second_breakfast: mealTimeSecondBreakfast,
        meal_time_lunch: mealTimeLunch,
        meal_time_snack: mealTimeSnack,
        meal_time_dinner: mealTimeDinner,
        app_theme: newTheme,
      });
    } catch (_) {}
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('Nowe hasła nie są identyczne.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Nowe hasło musi mieć co najmniej 8 znaków.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordMsg(res.message || 'Hasło zostało pomyślnie zmienione.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(null), 4000);
    } catch (err) {
      setPasswordError(err.message || 'Błąd podczas zmiany hasła.');
    } finally {
      setChangingPassword(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', width: '90%', maxHeight: '85vh', overflowY: 'auto', padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Settings size={22} color="var(--accent-emerald)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Ustawienia konta</h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Sekcja 1: Powiadomienia (suwaki) */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Bell size={18} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Powiadomienia w aplikacji</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                id: 'diet_plan',
                title: 'Nowy jadłospis',
                desc: 'Powiadomienie, gdy dietetyk zaktualizuje lub doda Twój jadłospis',
                val: notifyDietPlan,
                setter: setNotifyDietPlan,
              },
              {
                id: 'recommendations',
                title: 'Nowe zalecenia',
                desc: 'Powiadomienie o nowych wskazówkach i wytycznych żywieniowych',
                val: notifyRecommendations,
                setter: setNotifyRecommendations,
              },
              {
                id: 'chat',
                title: 'Wiadomości na czacie',
                desc: 'Powiadomienie, gdy dietetyk lub admin wyśle do Ciebie nową wiadomość',
                val: notifyChatMessages,
                setter: setNotifyChatMessages,
              },
              {
                id: 'meal',
                title: 'Zbliżający się posiłek',
                desc: 'Przypomnienia przed porami planowanych posiłków w ciągu dnia',
                val: notifyMealReminders,
                setter: setNotifyMealReminders,
              },
            ].map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                {/* Switch checkbox */}
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={() => handleToggle(item.id, item.val, item.setter)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: item.val ? 'var(--accent-emerald)' : '#374151',
                      borderRadius: '24px',
                      transition: '.2s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: '18px',
                        width: '18px',
                        left: item.val ? '23px' : '3px',
                        bottom: '3px',
                        backgroundColor: '#ffffff',
                        borderRadius: '50%',
                        transition: '.2s',
                      }}
                    />
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Sekcja: Harmonogram i godziny posiłków */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={18} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Harmonogram posiłków</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
            Ustal stałe godziny swoich posiłków. O tych porach otrzymasz powiadomienie przypominające.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {[
              { id: 'breakfast', label: 'Śniadanie', val: mealTimeBreakfast },
              { id: 'second_breakfast', label: 'II Śniadanie', val: mealTimeSecondBreakfast },
              { id: 'lunch', label: 'Obiad', val: mealTimeLunch },
              { id: 'snack', label: 'Przekąska', val: mealTimeSnack },
              { id: 'dinner', label: 'Kolacja', val: mealTimeDinner },
            ].map((m) => (
              <div
                key={m.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.label}</span>
                <input
                  type="time"
                  value={m.val}
                  onChange={(e) => handleMealTimeSave(m.id, e.target.value)}
                  style={{
                    background: '#1f2937',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '0.4rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sekcja 2: Motyw graficzny */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Palette size={18} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Motyw kolorystyczny</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
            {[
              { id: 'dark', label: 'Ciemny' },
              { id: 'light', label: 'Jasny' },
              { id: 'ocean', label: 'Ocean' },
              { id: 'forest', label: 'Las' },
            ].map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => handleThemeChange(th.id)}
                className={`btn ${theme === th.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ justifyContent: 'center', padding: '0.5rem' }}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sekcja 3: Zmiana hasła */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Lock size={18} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Zmiana hasła</h3>
          </div>

          {passwordMsg && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--accent-emerald)', color: '#6ee7b7', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>{passwordMsg}</span>
            </div>
          )}

          {passwordError && (
            <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid var(--accent-rose)', color: '#fca5a5', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} color="#f43f5e" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Aktualne hasło</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Nowe hasło</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 8 znaków"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Powtórz nowe hasło</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 8 znaków"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '8px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              {changingPassword ? 'Zmienianie...' : 'Zaktualizuj hasło'}
            </button>
          </form>
        </div>

        {/* Sekcja 4: Strefa niebezpieczna - Usuwanie konta (przeniesione z paska) */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(239,68,68,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <AlertTriangle size={18} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--accent-rose)' }}>
              Strefa niebezpieczna
            </h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
            Usunięcie Twojego konta jest operacją nieodwracalną. Wszystkie Twoje dane, pomiary, historia i jadłospisy zostaną trwale skasowane.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: 'rgba(239,68,68,0.4)',
              color: '#f87171',
              background: 'rgba(239,68,68,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
            }}
          >
            <Trash2 size={14} /> Usuń moje konto
          </button>
        </div>

        {/* Modal usuwania konta */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)} style={{ zIndex: 1300 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
              <AlertTriangle size={42} color="var(--accent-rose)" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Trwałe usunięcie konta</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Czy na pewno chcesz bezpowrotnie usunąć swoje konto <strong style={{ color: 'var(--accent-rose)' }}>{user?.email}</strong>? Wszystkie dane i historia zostaną bezpowrotnie utracone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowDeleteModal(false)}>
                  Anuluj
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                  disabled={deletingAccount}
                  onClick={handleDeleteMyAccount}
                >
                  <Trash2 size={15} /> {deletingAccount ? 'Usuwanie...' : 'Usuń konto'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Punkt 1: Przycisk Zamknij na dole okna ustawień */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ minWidth: '120px', fontWeight: 700 }}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}
