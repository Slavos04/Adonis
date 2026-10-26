import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client';

import { applyCustomThemeSettings, getAllThemes } from '../utils/themeCustomizer';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableThemes, setAvailableThemes] = useState(() => getAllThemes());
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('adonis_theme') || 'dark';
  });

  // Nasłuchiwanie zmian własnych motywów
  useEffect(() => {
    const handleThemesChanged = () => {
      setAvailableThemes(getAllThemes());
    };
    window.addEventListener('adonis_themes_changed', handleThemesChanged);
    return () => window.removeEventListener('adonis_themes_changed', handleThemesChanged);
  }, []);

  // Apply theme to <html> element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('adonis_theme', theme);
    applyCustomThemeSettings();
  }, [theme]);

  useEffect(() => {
    applyCustomThemeSettings();
    checkCurrentUser();
  }, []);

  async function checkCurrentUser() {
    try {
      const res = await authApi.getMe();
      setUser(res.user);
      setProfile(res.profile);
    } catch (_) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await authApi.login(email, password);
    if (res.token) {
      localStorage.setItem('adonis_token', res.token);
    }
    setUser(res.user);
    setProfile(res.profile);
    return res;
  }

  async function register(data) {
    const res = await authApi.register(data);
    if (res.token) {
      localStorage.setItem('adonis_token', res.token);
    }
    setUser(res.user);
    setProfile(res.profile);
    return res;
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch (_) {}
    localStorage.removeItem('adonis_token');
    setUser(null);
    setProfile(null);
  }

  async function quickSwitch(role) {
    const credentials = {
      patient: { email: 'pacjent@adonis.app', pass: 'Pacjent123!' },
      dietitian: { email: 'dietetyk@adonis.app', pass: 'Dietetyk123!' },
      admin: { email: 'admin@adonis.app', pass: 'Admin123!' },
    };
    const cred = credentials[role];
    if (cred) {
      return login(cred.email, cred.pass);
    }
  }

  function setTheme(newTheme) {
    if (availableThemes.includes(newTheme)) {
      setThemeState(newTheme);
    }
  }

  function cycleTheme() {
    const idx = availableThemes.indexOf(theme);
    setTheme(availableThemes[(idx + 1) % availableThemes.length]);
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      login, register, logout, quickSwitch, refreshUser: checkCurrentUser,
      theme, setTheme, cycleTheme, THEMES: availableThemes
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
