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
  Megaphone
} from 'lucide-react';
import { ViewState, User } from '../types';

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
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.CONVERSATIONS, label: 'Conversaciones', icon: MessageSquare },
    { id: ViewState.CONTACTS, label: 'Contactos', icon: Users },
    { id: ViewState.CAMPAIGNS, label: 'Campañas', icon: Megaphone },
  ];

  return (
    <>
      <aside 
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-xl md:shadow-none
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-20' : 'md:w-64'}
          w-64
        `}
      >
        {/* Header / Logo */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all`}>
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-primary-200">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
             </svg>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
            <h1 className="text-lg font-extrabold text-slate-900 leading-none tracking-tight">SyncFlow</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Monterrey CRM</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                
                <span className={`text-sm font-bold whitespace-nowrap transition-all duration-200 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'} ${isActive ? 'font-extrabold' : ''}`}>
                  {item.label}
                </span>
                
                {item.id === ViewState.CONVERSATIONS && (
                   <span className={`
                      bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm
                      ${isCollapsed ? 'absolute top-2 right-2 w-2 h-2 p-0 rounded-full' : 'ml-auto'}
                   `}>
                     {!isCollapsed && '2'}
                   </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button 
              onClick={() => onChangeView(ViewState.SETTINGS)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${currentView === ViewState.SETTINGS ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title="Configuración"
            >
              <Settings className={`w-5 h-5 flex-shrink-0 ${currentView === ViewState.SETTINGS ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span className={`text-sm font-bold whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Configuración</span>
            </button>
             <button 
               className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors
                ${isCollapsed ? 'justify-center' : ''}
               `}
               title="Ayuda"
             >
              <HelpCircle className="w-5 h-5 flex-shrink-0 text-slate-400" />
              <span className={`text-sm font-bold whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Ayuda</span>
            </button>
          </div>
        </nav>

        {/* Footer User */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className={`
            flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-slate-200 hover:shadow-sm
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <div className="relative flex-shrink-0">
              <img src={currentUser.avatar} alt="User" className="w-9 h-9 rounded-full object-cover border border-white shadow-sm" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 font-semibold truncate">{currentUser.role}</p>
            </div>
            {!isCollapsed && <LogOut className="w-4 h-4 text-slate-400 hover:text-red-500 transition-colors" />}
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <button 
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-20 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 rounded-full p-1 shadow-sm z-50"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;