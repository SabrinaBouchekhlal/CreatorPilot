import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ScriptEditorModal } from './components/modals/ScriptEditorModal';
import { QuickGeneratorModal } from './components/modals/QuickGeneratorModal';

// Views
import { LandingPage } from './components/views/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { DecisionBoardView } from './components/views/DecisionBoardView';
import { CalendarView } from './components/views/CalendarView';
import { TrendsRadarView } from './components/views/TrendsRadarView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ContentLibraryView } from './components/views/ContentLibraryView';
import { BrandStudioView } from './components/views/BrandStudioView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { SettingsView } from './components/views/SettingsView';
import { AuthView } from './components/views/AuthView';
import { OnboardingView } from './components/views/OnboardingView';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts } = useApp();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast, index) => (
        <div
          key={`${toast.id}-${index}`}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-700'
              : toast.type === 'info'
              ? 'bg-[#0E1633]/90 text-white border-slate-700'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-[#7BE0C3] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="flex-1 leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

const MainContent: React.FC = () => {
  const { route, direction } = useApp();

  const isPublicOrStandalone = ['landing', 'login', 'signup', 'onboarding'].includes(route);

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4FA]">
      <Navbar />

      {!isPublicOrStandalone && <Sidebar />}

      <main
        className={`flex-1 transition-all ${
          !isPublicOrStandalone
            ? direction === 'rtl'
              ? 'lg:mr-64'
              : 'lg:ml-64'
            : ''
        }`}
      >
        <div className={!isPublicOrStandalone ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}>
          {route === 'landing' && <LandingPage />}
          {route === 'login' && <AuthView mode="login" />}
          {route === 'signup' && <AuthView mode="signup" />}
          {route === 'onboarding' && <OnboardingView />}
          {route === 'dashboard' && <DashboardView />}
          {route === 'decision-board' && <DecisionBoardView />}
          {route === 'calendar' && <CalendarView />}
          {route === 'trends' && <TrendsRadarView />}
          {route === 'analytics' && <AnalyticsView />}
          {route === 'content-library' && <ContentLibraryView />}
          {route === 'brand-studio' && <BrandStudioView />}
          {route === 'integrations' && <IntegrationsView />}
          {route === 'settings' && <SettingsView />}
        </div>
      </main>

      <ScriptEditorModal />
      <QuickGeneratorModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
