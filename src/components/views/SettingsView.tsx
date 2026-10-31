import React from 'react';
import { useApp } from '../../context/AppContext';
import { SupportedLanguage } from '../../i18n/translations';
import { 
  Settings as SettingsIcon, 
  Globe, 
  ShieldCheck, 
  Download, 
  Key, 
  Lock, 
  FileText,
  User,
  CheckCircle2,
  LogOut
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    brand, 
    user, 
    auditLogs, 
    calendar, 
    library, 
    t, 
    showToast,
    logout
  } = useApp();

  const handleExportFullData = () => {
    const fullData = {
      exportedAt: new Date().toISOString(),
      user,
      brand,
      calendar,
      library,
      auditLogs
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creatorpilot_full_backup_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t.settings.exportData + ' ✓', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.settings.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.settings.subtitle}
          </p>
        </div>

        <button
          onClick={handleExportFullData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#7BE0C3]" />
          <span>{t.settings.exportData}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Language & Security (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Language Selection */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Globe className="w-4 h-4 text-[#FF5A6E]" />
              <h2 className="text-sm font-bold text-[#0E1633]">
                {t.settings.interfaceLanguage}
              </h2>
            </div>

            <p className="text-xs text-slate-500">
              تغيير لغة واجهة النظام واتجاه التصفح فورياً بين العربية (RTL)، الفرنسية (LTR)، والإنجليزية (LTR).
            </p>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <button
                onClick={() => setLanguage('ar')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  language === 'ar'
                    ? 'border-[#FF5A6E] bg-rose-50/40 text-[#FF5A6E] font-bold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <span className="block text-sm">العربية</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">RTL Layout</span>
              </button>

              <button
                onClick={() => setLanguage('fr')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  language === 'fr'
                    ? 'border-[#FF5A6E] bg-rose-50/40 text-[#FF5A6E] font-bold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <span className="block text-sm">Français</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">LTR Layout</span>
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  language === 'en'
                    ? 'border-[#FF5A6E] bg-rose-50/40 text-[#FF5A6E] font-bold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                }`}
              >
                <span className="block text-sm">English</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">LTR Layout</span>
              </button>
            </div>
          </div>

          {/* User Account & Session */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0E1633]" />
                <h2 className="text-sm font-bold text-[#0E1633]">
                  {language === 'ar' ? 'جلسة الحساب النشطة' : language === 'fr' ? 'Session active du compte' : 'Active Account Session'}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {language === 'ar' ? 'نشط' : language === 'fr' ? 'Actif' : 'Active'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl text-xs">
              <div className="min-w-0 pr-2">
                <p className="font-bold text-slate-900 truncate">{user?.name || brand?.name?.split('—')[0]?.trim() || (language === 'ar' ? 'صانع المحتوى' : 'Creator')}</p>
                <p className="text-slate-500 font-mono text-[11px] truncate">{user?.email || (language === 'ar' ? 'جلسة نشطة' : 'Active Session')}</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 shrink-0">
                {user?.role || 'Creator Pro'}
              </span>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.nav.logout}</span>
            </button>
          </div>

          {/* Account Security & Secrets Notice */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Lock className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-[#0E1633]">
                {t.settings.apiKeyConfig}
              </h2>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>إدارة المفاتيح السحابية الآمنة</span>
              </div>
              <p className="leading-relaxed">
                {t.settings.apiKeyNote} المفاتيح مشفرة ومحقونة حصرياً في بيئة الخادم (Server-side Gemini SDK) دون أي إمكانية للوصول إليها عبر المتصفح.
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-500">
              {t.settings.privacyNotice}
            </div>
          </div>
        </div>

        {/* Right Col: Audit Trail Logs (6 cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0E1633]" />
              <h2 className="text-sm font-bold text-[#0E1633]">
                {t.settings.auditLogs}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {auditLogs.length} سجلات
            </span>
          </div>

          <div className="space-y-2 max-h-[440px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-[11px] text-[#0E1633]">
                    {log.action}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-sans">
                  {log.details}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100/80">
                  <span className="truncate">{log.user}</span>
                  <span className="font-bold text-emerald-700">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
