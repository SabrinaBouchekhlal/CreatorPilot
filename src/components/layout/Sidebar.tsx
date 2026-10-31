import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Compass, 
  Calendar, 
  Activity, 
  BarChart3, 
  FolderArchive, 
  Palette, 
  Boxes, 
  Settings, 
  Sparkles,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import { Route } from '../../types';

export const Sidebar: React.FC = () => {
  const { route, setRoute, t, brand, user, openGenerator, isSidebarOpen, toggleSidebar, direction, logout } = useApp();

  const navItems: Array<{ id: Route; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'decision-board', label: t.nav.decisionBoard, icon: <Compass className="w-4 h-4" /> },
    { id: 'calendar', label: t.nav.calendar, icon: <Calendar className="w-4 h-4" /> },
    { id: 'trends', label: t.nav.trends, icon: <Activity className="w-4 h-4" /> },
    { id: 'analytics', label: t.nav.analytics, icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'content-library', label: t.nav.contentLibrary, icon: <FolderArchive className="w-4 h-4" /> },
    { id: 'brand-studio', label: t.nav.brandStudio, icon: <Palette className="w-4 h-4" /> },
    { id: 'integrations', label: t.nav.integrations, icon: <Boxes className="w-4 h-4" /> },
    { id: 'settings', label: t.nav.settings, icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavigate = (targetRoute: Route) => {
    setRoute(targetRoute);
    if (isSidebarOpen) toggleSidebar();
  };

  const ChevronIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 z-40 w-64 bg-[#0E1633] text-white border-[#1B2650] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          direction === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
        } ${
          isSidebarOpen ? 'translate-x-0' : direction === 'rtl' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Summary Card */}
        <div className="p-4 border-b border-[#1B2650]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#FF5A6E]/30 shrink-0 bg-gradient-to-tr from-[#FF5A6E] to-[#1B2650] flex items-center justify-center text-white font-bold text-xs shadow-inner">
              {((user?.name || brand?.name || 'CP').trim()[0] || 'C').toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-white truncate leading-tight">
                {user?.name || brand?.name?.split('—')[0]?.trim() || (direction === 'rtl' ? 'صانع المحتوى' : 'Creator')}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <span className="truncate">{user?.role || 'Creator Pro'}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#7BE0C3] font-medium">{brand?.pillars?.length ? `${brand.pillars.length} Pillars` : 'Active'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = route === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-[#FF5A6E] text-white shadow-xs'
                    : 'text-slate-300 hover:bg-[#1B2650] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronIcon className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Strategic Tool Launcher & Logout in Footer */}
        <div className="p-4 border-t border-[#1B2650] space-y-2.5">
          <button
            onClick={() => openGenerator('ideas')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-[#0E1633] bg-[#7BE0C3] hover:bg-[#68d1b3] transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.dashboard.quickTools}</span>
          </button>

          <button
            onClick={() => {
              if (isSidebarOpen) toggleSidebar();
              logout();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-700/50 hover:border-rose-500/30 transition-all cursor-pointer group"
            title={t.nav.logout}
          >
            <div className="flex items-center gap-2.5 truncate">
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
              <span className="truncate">{t.nav.logout}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono group-hover:text-rose-400">Exit</span>
          </button>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1 pt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7BE0C3] shrink-0" />
            <span className="truncate">{t.common.humanApprovalNotice}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
