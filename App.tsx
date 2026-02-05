import React, { useState, Component, ErrorInfo } from 'react';
import { Menu, AlertTriangle, RefreshCcw } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Conversations from './components/Conversations';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import Campaigns from './components/Campaigns';
import LiveAssistant from './components/LiveAssistant';
import { ViewState } from './types';
import { CURRENT_USER } from './mockData';

// Simple Error Boundary to catch crashes
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

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
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} />;
      case ViewState.CONVERSATIONS:
        return <Conversations />;
      case ViewState.CONTACTS:
        return <Contacts />;
      case ViewState.CAMPAIGNS:
        return <Campaigns />;
      case ViewState.SETTINGS:
        return <Settings />;
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
               <Menu className="w-6 h-6"/>
             </button>
             <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center text-white">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
               </div>
               <span className="font-extrabold text-lg text-slate-900">SyncFlow</span>
             </div>
        </div>
        <img src={CURRENT_USER.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="User" />
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
        currentUser={CURRENT_USER}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Main Content Area */}
      <main 
        className={`flex-1 h-full relative transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {renderContent()}
      </main>

      {/* Floating Live Assistant */}
      <LiveAssistant />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;