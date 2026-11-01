import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginModal } from './pages/LoginModal';
import { PatientDashboard } from './pages/PatientDashboard';
import { DietitianDashboard } from './pages/DietitianDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { RecipeBrowser } from './pages/RecipeBrowser';
import { ShoppingListWidget } from './components/ShoppingListWidget';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { ChatWidget } from './components/ChatWidget';
import { APP_VERSION } from './version';

function GlobalCustomBackground() {
  const [bgConfig, setBgConfig] = useState(() => ({
    image: (typeof window !== 'undefined' ? localStorage.getItem('adonis_custom_bg_image') : '') || '',
    overlay: (typeof window !== 'undefined' ? parseFloat(localStorage.getItem('adonis_custom_bg_overlay')) : 0.55) || 0.55,
    blur: (typeof window !== 'undefined' ? parseInt(localStorage.getItem('adonis_custom_bg_blur')) : 0) || 0,
  }));

  React.useEffect(() => {
    const update = () => {
      setBgConfig({
        image: localStorage.getItem('adonis_custom_bg_image') || '',
        overlay: parseFloat(localStorage.getItem('adonis_custom_bg_overlay')) || 0.55,
        blur: parseInt(localStorage.getItem('adonis_custom_bg_blur')) || 0,
      });
    };
    window.addEventListener('adonis_custom_bg_changed', update);
    window.addEventListener('adonis_themes_changed', update);
    return () => {
      window.removeEventListener('adonis_custom_bg_changed', update);
      window.removeEventListener('adonis_themes_changed', update);
    };
  }, []);

  if (!bgConfig.image) return null;

  return (
    <div
      id="adonis-global-bg-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -25,
          left: -25,
          right: -25,
          bottom: -25,
          backgroundImage: `url("${bgConfig.image}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: bgConfig.blur > 0 ? `blur(${bgConfig.blur}px)` : 'none',
          transform: bgConfig.blur > 0 ? 'scale(1.06)' : 'none',
          transition: 'filter 0.3s ease, background-image 0.4s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${bgConfig.overlay})`,
          transition: 'background-color 0.3s ease',
        }}
      />
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('Błąd renderowania widoku:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-panel">
          <h2 style={{ color: 'var(--accent-rose)', marginBottom: '1rem' }}>Wystąpił nieoczekiwany błąd widoku</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'Nieznany błąd interfejsu.'}
          </p>
          <button className="btn btn-primary" onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}>
            Odśwież aplikację
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainLayout() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Gdy rola użytkownika się zmieni, upewnij się, że nie został na zakładce niedostępnej dla nowej roli
  React.useEffect(() => {
    if (user?.role !== 'patient' && activeTab === 'shopping') {
      setActiveTab('dashboard');
    }
  }, [user?.role, activeTab]);

  if (loading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        height: '100vh', color: 'var(--accent-emerald)', gap: '1rem'
      }}>
        <div style={{
          width: '48px', height: '48px', border: '3px solid var(--border-subtle)',
          borderTopColor: 'var(--accent-emerald)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontWeight: 600, letterSpacing: '0.05em' }}>Ładowanie ADONIS...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <LoginModal onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  // Render the correct dashboard based on role
  function renderDashboard() {
    if (user.role === 'admin') return <AdminDashboard />;
    if (user.role === 'dietitian') return <DietitianDashboard />;
    return <PatientDashboard />;
  }


  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
        {activeTab === 'dashboard' && renderDashboard()}

        {activeTab === 'measurements' && <MeasurementsPage />}

        {activeTab === 'shopping' && (
          <div className="page-container" style={{ maxWidth: '1000px' }}>
            <ShoppingListWidget />
          </div>
        )}

        {activeTab === 'recipes' && <RecipeBrowser />}

        {activeTab === 'chat' && (
          <div className="page-container" style={{ maxWidth: '960px' }}>
            <ChatWidget />
          </div>
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.25rem 2rem',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
        background: 'var(--footer-bg)',
        transition: 'background 0.3s ease'
      }}>
        ADONIS fit &amp; eat &copy; 2026 &bull; Multi-arch Docker Ready (x86_64 / ARM64) &bull; Web &amp; Native Android &bull; ver. {APP_VERSION}
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GlobalCustomBackground />
        <MainLayout />
      </AuthProvider>
    </ErrorBoundary>
  );
}
