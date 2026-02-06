import React, { useState, Component, ErrorInfo, useEffect } from 'react';
import { Menu, AlertTriangle, RefreshCcw, Maximize, Minimize } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Conversations from './components/Conversations';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import Campaigns from './components/Campaigns';
import LiveAssistant from './components/LiveAssistant';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import TemplatesManager from './components/TemplatesManager';
import HelpCenter from './components/HelpCenter';
import Login from './components/Login';
import { LanguageProvider } from './components/LanguageContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ViewState, UserRole } from './types';

// Simple Error Boundary to catch crashes
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  state: { hasError: boolean, error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Algo salió mal</h1>
          <p className="text-slate-500 mb-6 text-center max-w-md">
            La aplicación ha encontrado un error inesperado. Por favor intenta recargar.
          </p>
          <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 w-full max-w-lg overflow-auto max-h-40">
            <code className="text-xs text-red-600 font-mono">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" /> Recargar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { user: currentUser, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Initialize View based on Role when user loads
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === UserRole.SUPER_ADMIN) {
        setCurrentView(ViewState.SUPER_ADMIN_DASHBOARD);
      } else {
        setCurrentView(ViewState.DASHBOARD);
      }
    }
  }, [currentUser]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Keyboard shortcut for Fullscreen
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        setIsFullScreen(!isFullScreen);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullScreen]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.SUPER_ADMIN_DASHBOARD:
        if (currentUser.role !== UserRole.SUPER_ADMIN) return <Dashboard onNavigate={setCurrentView} />;
        return <SuperAdminDashboard />;
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.CONVERSATIONS:
        return <Conversations />;
      case ViewState.CONTACTS:
        return <Contacts />;
      case ViewState.CAMPAIGNS:
        return <Campaigns />;
      case ViewState.TEMPLATES:
        return <TemplatesManager />;
      case ViewState.SETTINGS:
        return <Settings />;
      case ViewState.HELP:
        return <HelpCenter />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen bg-[#f4f5f6] text-slate-900 font-sans flex flex-col md:flex-row overflow-hidden">

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-40 flex-shrink-0 h-[65px]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-extrabold text-lg text-slate-900">1a Fundación</span>
          </div>
        </div>
        <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="User" />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onChangeView={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        currentUser={currentUser}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 h-full relative transition-all duration-300 ease-in-out flex flex-col ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
      >
        {/* Top Utility Bar (for Full Screen Toggle) */}
        {!isMobileMenuOpen && (
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button
              onClick={toggleFullScreen}
              className="p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-500 hover:text-indigo-600 shadow-sm border border-slate-200 transition-all hover:scale-105"
              title="Toggle Full Screen"
            >
              {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        )}

        {renderContent()}
      </main>

      {/* Floating Live Assistant (Hidden for Super Admin) */}
      {currentUser.role !== UserRole.SUPER_ADMIN && <LiveAssistant />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;