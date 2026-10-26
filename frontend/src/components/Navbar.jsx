import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Flame, Utensils, ShoppingBag, MessageSquare, Users, BookOpen,
  LogOut, ShieldAlert, Sun, Moon, Waves, Trees, Bell, Trash2, AlertTriangle, Sparkles, Settings, Info
} from 'lucide-react';
import { chatApi, authApi } from '../api/client';
import { SettingsModal } from './SettingsModal';
import { AppInfoModal } from './AppInfoModal';

export function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState({ unread_messages: 0, unread_notifications: 0 });
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAppInfoModal, setShowAppInfoModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  async function handleDeleteMyAccount() {
    setDeletingAccount(true);
    try {
      await authApi.deleteMyAccount();
      alert('Twoje konto zostało trwale usunięte.');
      logout();
      setActiveTab('login');
    } catch (err) {
      alert(`Błąd usuwania konta: ${err.message}`);
    } finally {
      setDeletingAccount(false);
      setShowDeleteAccountModal(false);
    }
  }


  const fetchUnread = useCallback(async () => {
    if (!user) return;
    try {
      const data = await chatApi.getUnreadCount();
      setUnread(data);
    } catch (_) {}
  }, [user]);

  // Poll unread count every 15 seconds
  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  // When switching to chat tab, refresh unread count after a short delay
  useEffect(() => {
    if (activeTab === 'chat') {
      const t = setTimeout(fetchUnread, 1500);
      return () => clearTimeout(t);
    }
  }, [activeTab, fetchUnread]);

  const totalUnread = unread.unread_messages + unread.unread_notifications;

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div
          className="brand-logo"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
          onClick={() => setActiveTab('dashboard')}
          title="ADONIS - fit & eat"
        >
          <Flame size={28} color="var(--accent-emerald)" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #34d399 50%, var(--accent-indigo) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ADONIS
            </span>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              fit &amp; eat
            </span>
          </div>
        </div>

        {user && (
          <nav className="tabs-nav">
            {/* Patient tabs */}
            {user.role === 'patient' && (
              <>
                <button
                  className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Utensils size={15} /> Jadłospis
                </button>
                <button
                  className={`tab-btn ${activeTab === 'shopping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shopping')}
                >
                  <ShoppingBag size={15} /> Zakupy
                </button>
              </>
            )}

            {/* Dietitian tab */}
            {user.role === 'dietitian' && (
              <button
                className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <Users size={15} /> Moi Pacjenci
              </button>
            )}

            {/* Admin tab */}
            {user.role === 'admin' && (
              <button
                className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <ShieldAlert size={15} /> Panel Admina
              </button>
            )}

            {/* Shared tabs */}
            <button
              className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
              onClick={() => setActiveTab('recipes')}
            >
              <BookOpen size={15} /> Przepisy
            </button>

            {/* Chat with unread badge */}
            <button
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <div className="nav-badge-wrapper">
                <MessageSquare size={15} />
                {unread.unread_messages > 0 && (
                  <span className="nav-unread-badge">
                    {unread.unread_messages > 99 ? '99+' : unread.unread_messages}
                  </span>
                )}
              </div>
              Czat
            </button>
          </nav>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Info button */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowAppInfoModal(true)}
          title="O aplikacji ADONIS (fit & eat)"
          style={{ padding: '0.4rem 0.65rem', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Info size={16} color="var(--accent-emerald)" />
        </button>

        {/* Settings button */}
        {user && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSettingsModal(true)}
            title="Ustawienia (powiadomienia, hasło, motyw)"
            style={{ gap: '0.4rem', padding: '0.4rem 0.75rem', height: '38px', display: 'flex', alignItems: 'center' }}
          >
            <Settings size={15} color="var(--accent-emerald)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Ustawienia</span>
          </button>
        )}

        {/* Notifications bell */}
        {user && unread.unread_notifications > 0 && (
          <div className="nav-badge-wrapper">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('chat')}
              title={`${unread.unread_notifications} powiadomień`}
              style={{ padding: '0.4rem 0.65rem', height: '38px', display: 'flex', alignItems: 'center' }}
            >
              <Bell size={15} />
            </button>
            <span className="nav-unread-badge">
              {unread.unread_notifications > 9 ? '9+' : unread.unread_notifications}
            </span>
          </div>
        )}

        {/* User info + logout */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0 0.85rem',
                height: '38px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              title={`${user.first_name || ''} ${user.last_name || ''} (${user.email})`}
            >
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                {user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.email}
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'var(--accent-emerald)',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.role === 'admin' ? 'Admin' : user.role === 'dietitian' ? 'Dietetyk' : 'Pacjent'}
              </span>
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title="Wyloguj się"
              style={{ height: '38px', padding: '0 0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <LogOut size={14} />
            </button>
            <button
              onClick={() => setShowDeleteAccountModal(true)}
              className="btn btn-secondary btn-sm"
              title="Usuń moje konto"
              style={{ color: 'var(--accent-rose)', height: '38px', padding: '0 0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={14} />
            </button>
          </div>

        ) : (
          <button onClick={() => setActiveTab('login')} className="btn btn-primary btn-sm">
            Zaloguj się
          </button>
        )}
      </div>

      {/* Delete account confirmation modal */}
      {showDeleteAccountModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteAccountModal(false)} style={{ zIndex: 1200 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <AlertTriangle size={42} color="var(--accent-rose)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>Trwałe usunięcie konta</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Czy na pewno chcesz bezpowrotnie usunąć swoje konto <strong style={{ color: 'var(--accent-rose)' }}>{user?.email}</strong>? Wszystkie Twoje dane, pomiary, historia i plany dietetyczne zostaną trwale skasowane.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowDeleteAccountModal(false)}>
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* App Info Modal */}
      <AppInfoModal
        isOpen={showAppInfoModal}
        onClose={() => setShowAppInfoModal(false)}
      />
    </header>
  );
}
