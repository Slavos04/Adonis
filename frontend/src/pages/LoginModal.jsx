import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Flame, Lock, Mail, UserCheck, Shield, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/client';

export function LoginModal({ onLoginSuccess }) {
  const { login, register, quickSwitch } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = podaj email, 2 = wpisz token i nowe hasło
  const [resetToken, setResetToken] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleForgotSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (forgotStep === 1) {
        const res = await authApi.forgotPassword(email);
        setForgotStep(2);
        setResetSuccess(res.message || 'Kod weryfikacyjny został wysłany na Twój adres email!');
      } else {
        const res = await authApi.resetPassword({
          email,
          token: resetToken,
          new_password: newResetPassword
        });
        setResetSuccess('Hasło zostało pomyślnie zmienione! Możesz się teraz zalogować.');
        setTimeout(() => {
          setIsForgot(false);
          setForgotStep(1);
          setPassword(newResetPassword);
          setResetSuccess(null);
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await register({ email, password, first_name: firstName, last_name: lastName, role });
      } else {
        await login(email, password);
      }
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '2rem' }} className="glass-panel">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', background: 'rgba(16,185,129,0.15)', padding: '0.85rem', borderRadius: '50%', marginBottom: '0.75rem' }}>
          {isForgot ? <KeyRound size={32} color="#10b981" /> : <Flame size={32} color="#10b981" />}
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>ADONIS</h1>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.2rem', marginBottom: '0.6rem' }}>
          fit &amp; eat
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          {isForgot
            ? 'Resetowanie hasła do Twojego konta'
            : isRegister
            ? 'Utwórz nowe konto w systemie dietetycznym'
            : 'Zaloguj się do platformy wspomagania odchudzania'}
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid var(--accent-rose)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      {resetSuccess && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid var(--accent-emerald)', color: '#6ee7b7', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{resetSuccess}</span>
        </div>
      )}

      {isForgot ? (
        /* Forgot Password Flow */
        <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {forgotStep === 1 ? (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Podaj adres e-mail przypisany do Twojego konta. Wyślemy na niego 6-cyfrowy kod weryfikacyjny do ustawienia nowego hasła.
              </p>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Twój adres E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="np. pacjent@adonis.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '8px' }}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                {loading ? 'Wysyłanie...' : 'Wyślij kod resetujący na email'}
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Wpisz 6-cyfrowy kod tokenu wysłany na <strong>{email}</strong> oraz wprowadź nowe hasło:
              </p>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Kod weryfikacyjny (6 cyfr)</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '8px', letterSpacing: '0.2em', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Nowe Hasło</label>
                <input
                  type="password"
                  required
                  placeholder="Min. 8 znaków"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '8px' }}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                {loading ? 'Zapisywanie...' : 'Zmień hasło i zatwierdź'}
              </button>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => { setIsForgot(false); setForgotStep(1); setError(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <ArrowLeft size={14} /> Wróć do logowania
            </button>
          </div>
        </form>
      ) : (
        /* Normal Login / Register Flow */
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Imię</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Nazwisko</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Rola</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '8px' }}
                >
                  <option value="patient">Pacjent</option>
                  <option value="dietitian">Dietetyk</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Adres E-mail</label>
            <input
              type="email"
              required
              placeholder="np. jan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '8px' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hasło</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => { setIsForgot(true); setError(null); }}
                  style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Nie pamiętasz hasła?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.6rem 0.85rem', borderRadius: '8px' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Przetwarzanie...' : isRegister ? 'Zarejestruj konto' : 'Zaloguj się'}
          </button>
        </form>
      )}

      {!isForgot && (
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(null); }}
            style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się jako pacjent'}
          </button>
        </div>
      )}
    </div>
  );
}
