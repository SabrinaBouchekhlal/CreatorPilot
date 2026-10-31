import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Menu, X, LogOut } from 'lucide-react';
import { SupportedLanguage } from '../../i18n/translations';

export const Navbar: React.FC = () => {
  const { route, setRoute, language, setLanguage, direction, t, user, logout, openGenerator, toggleSidebar, isSidebarOpen } = useApp();

  const isLanding = route === 'landing';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E1633] text-white border-b border-[#1B2650] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          {!isLanding && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5A6E]"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
          <button 
            onClick={() => setRoute(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF5A6E] to-[#E8465A] flex items-center justify-center text-white font-black text-sm shadow-sm">
              CP
            </div>
            <span className="font-bold tracking-wide">
              Creator Pilot
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line text links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {isLanding ? (
            <>
              <button 
                onClick={() => setRoute('decision-board')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.decisionBoard}
              </button>
              <button 
                onClick={() => setRoute('trends')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.trends}
              </button>
              <button 
                onClick={() => setRoute('calendar')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.calendar}
              </button>
              <button 
                onClick={() => setRoute('analytics')} 
                className="hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.analytics}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setRoute('dashboard')} 
                className={`transition-colors whitespace-nowrap shrink-0 ${route === 'dashboard' ? 'text-[#FF5A6E] font-semibold' : 'hover:text-white'}`}
              >
                {t.nav.dashboard}
              </button>
              <button 
                onClick={() => setRoute('decision-board')} 
                className={`transition-colors whitespace-nowrap shrink-0 ${route === 'decision-board' ? 'text-[#FF5A6E] font-semibold' : 'hover:text-white'}`}
              >
                {t.nav.decisionBoard}
              </button>
              <button 
                onClick={() => setRoute('calendar')} 
                className={`transition-colors whitespace-nowrap shrink-0 ${route === 'calendar' ? 'text-[#FF5A6E] font-semibold' : 'hover:text-white'}`}
              >
                {t.nav.calendar}
              </button>
              <button 
                onClick={() => setRoute('trends')} 
                className={`transition-colors whitespace-nowrap shrink-0 ${route === 'trends' ? 'text-[#FF5A6E] font-semibold' : 'hover:text-white'}`}
              >
                {t.nav.trends}
              </button>
              <button 
                onClick={() => setRoute('content-library')} 
                className={`transition-colors whitespace-nowrap shrink-0 ${route === 'content-library' ? 'text-[#FF5A6E] font-semibold' : 'hover:text-white'}`}
              >
                {t.nav.contentLibrary}
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Language Selector + 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#1B2650] rounded-lg">
            <button
              onClick={() => setLanguage('ar')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${language === 'ar' ? 'bg-[#FF5A6E] text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}
              title="العربية (RTL)"
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${language === 'fr' ? 'bg-[#FF5A6E] text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}
              title="Français"
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${language === 'en' ? 'bg-[#FF5A6E] text-white shadow-xs' : 'text-slate-300 hover:text-white'}`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Primary Action Button & User Session */}
          {isLanding ? (
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    onClick={() => setRoute('dashboard')}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {t.landing.enterWorkspace}
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                    title={t.nav.logout}
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden sm:inline">{t.nav.logout}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setRoute('login')}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.nav.signIn}
                  </button>
                  <button
                    onClick={() => setRoute('login')}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {t.landing.enterWorkspace}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openGenerator('ideas')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">{t.nav.quickGenerate}</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-rose-300 hover:bg-rose-500/10 border border-[#1B2650] hover:border-rose-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer group"
                title={t.nav.logout}
                aria-label={t.nav.logout}
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400 transition-colors" />
                <span className="hidden sm:inline">{t.nav.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
