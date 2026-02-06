import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Megaphone,
  Shield,
  FileText
} from 'lucide-react';
import { ViewState, User, UserRole } from '../types';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  currentUser: User;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  currentUser,
  isCollapsed,
  toggleCollapse,
  isMobileOpen,
  closeMobile
}) => {
  const { t } = useLanguage();
  const { signOut } = useAuth();

  const getNavItems = () => {
    // 1. Super Admin View
    if (currentUser.role === UserRole.SUPER_ADMIN) {
      return [
        { id: ViewState.SUPER_ADMIN_DASHBOARD, label: t('backoffice'), icon: Shield },
        { id: ViewState.SETTINGS, label: t('settings'), icon: Settings },
      ];
    }

    // 2. Standard Views (Owner, Assistant, Agent)
    const items = [
      { id: ViewState.DASHBOARD, label: t('dashboard'), icon: LayoutDashboard },
      { id: ViewState.CONVERSATIONS, label: t('conversations'), icon: MessageSquare },
      { id: ViewState.CONTACTS, label: t('contacts'), icon: Users },
      { id: ViewState.CAMPAIGNS, label: t('campaigns'), icon: Megaphone },
      { id: ViewState.TEMPLATES, label: 'Plantillas', icon: FileText },
    ];

    // Filter for Agents (Hide Dashboard & Campaigns for simplicity, keep Contacts/Convo)
    if (currentUser.role === UserRole.AGENT) {
      return items.filter(item =>
        item.id === ViewState.CONVERSATIONS ||
        item.id === ViewState.CONTACTS
      );
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      <aside
        className={`
          fixed bottom-0 top-auto md:top-0 left-0 w-full md:w-64 md:h-screen bg-slate-900 md:border-r border-t md:border-t-0 border-slate-800 z-50 flex md:flex-col transition-all duration-300 ease-in-out shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] md:shadow-none
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          ${isMobileOpen ? 'translate-y-0' : 'translate-y-0'} 
          /* On mobile it's a bottom bar, on desktop it's sidebar */
        `}
      >
        {/* Header / Logo (Desktop Only) */}
        <div className={`hidden md:flex p-6 items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all`}>
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-primary-900/50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
            <h1 className="text-lg font-extrabold text-white leading-none tracking-tight">1a <span className="text-primary-400">Fundación</span></h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {currentUser.role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Workspace'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 md:px-3 flex md:flex-col justify-around md:justify-start items-center md:items-stretch overflow-y-auto custom-scrollbar py-2 md:mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`
                  flex flex-col md:flex-row items-center md:gap-3 px-2 md:px-3 py-2 md:py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive ? 'bg-primary-900/30 text-primary-400 border border-primary-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                  ${isCollapsed ? 'md:justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`w-6 h-6 md:w-5 md:h-5 flex-shrink-0 ${isActive ? 'text-primary-400' : 'text-slate-400 group-hover:text-white'}`} />

                <span className={`text-[10px] md:text-sm font-medium whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'md:w-0 md:opacity-0 md:hidden' : 'w-auto opacity-100'}`}>
                  {item.label}
                </span>

                {/* Badge for Conversations */}
                {item.id === ViewState.CONVERSATIONS && (
                  <span className={`
                      bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm absolute top-1 right-1 md:static md:ml-auto
                      ${isCollapsed ? 'md:absolute md:top-2 md:right-2 md:w-2 md:h-2 md:p-0 md:rounded-full' : ''}
                   `}>
                    {!isCollapsed && '2'}
                  </span>
                )}
              </button>
            );
          })}

          {/* Desktop Only: Settings & Help */}
          <div className="hidden md:block pt-4 mt-4 border-t border-slate-800">
            {currentUser.role !== UserRole.AGENT && currentUser.role !== UserRole.SUPER_ADMIN && (
              <button
                onClick={() => onChangeView(ViewState.SETTINGS)}
                className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${currentView === ViewState.SETTINGS ? 'bg-primary-900/30 text-primary-400 border border-primary-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                    ${isCollapsed ? 'justify-center' : ''}
                `}
                title={t('settings')}
              >
                <Settings className={`w-5 h-5 flex-shrink-0 ${currentView === ViewState.SETTINGS ? 'text-primary-400' : 'text-slate-400 group-hover:text-white'}`} />
                <span className={`text-sm font-bold whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>{t('settings')}</span>
              </button>
            )}
            <button
              onClick={() => onChangeView(ViewState.HELP)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors
                ${currentView === ViewState.HELP ? 'bg-primary-900/30 text-primary-400 border border-primary-500/20' : ''}
                ${isCollapsed ? 'justify-center' : ''}
               `}
              title="Ayuda"
            >
              <HelpCircle className={`w-5 h-5 flex-shrink-0 ${currentView === ViewState.HELP ? 'text-primary-400' : 'text-slate-400'}`} />
              <span className={`text-sm font-bold whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Ayuda</span>
            </button>
          </div>
        </nav>

        {/* Footer User (Desktop Only) */}
        <div className="hidden md:block p-3 border-t border-slate-800 bg-slate-900">
          <div className={`
            flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-slate-700
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <div className="relative flex-shrink-0">
              <img src={currentUser.avatar} alt="User" className="w-9 h-9 rounded-full object-cover border border-slate-600 shadow-sm" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold truncate">{currentUser.role}</p>
            </div>
            {!isCollapsed && (
              <button
                onClick={signOut}
                className="text-slate-500 hover:text-red-400 transition-colors focus:outline-none"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-20 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-full p-1 shadow-sm z-50 hover:bg-slate-700"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;