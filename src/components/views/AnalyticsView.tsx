import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Bookmark, 
  Share2, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  Lock,
  CheckCircle2,
  ExternalLink,
  Instagram
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { instagram, requestInstagramConnection, language, t, showToast } = useApp();
  const [handleInput, setHandleInput] = useState('');
  const metrics = instagram?.metrics;
  const isConnected = !!instagram?.isConnected && !!metrics;

  const handleConnect = () => {
    requestInstagramConnection();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.analytics.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.analytics.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleConnect}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs ${
              isConnected
                ? 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                : 'bg-[#FF5A6E] text-white hover:bg-[#E8465A]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isConnected 
                ? t.analytics.disconnectAccount 
                : t.integrations.connectMeta}
            </span>
          </button>
        </div>
      </div>

      {!isConnected ? (
        /* Genuine Disconnected State */
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-2xs text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF5A6E]/10 to-[#7BE0C3]/20 flex items-center justify-center text-[#FF5A6E] mx-auto">
              <Instagram className="w-7 h-7" />
            </div>
            
            <div className="space-y-1.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0E1633]">
                {language === 'ar' ? 'لم يتم ربط حساب Instagram حتى الآن' : language === 'fr' ? 'Aucun compte Instagram associé' : 'No Instagram Account Connected'}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {language === 'ar'
                  ? 'اربط حساب Instagram المهني أو التجاري عبر Meta Graph API للحصول على إحصائيات وصول حقيقية وموثقة دون أي أرقام وهمية أو افتراضية.'
                  : language === 'fr'
                  ? 'Associez votre compte Instagram Creator via l\'API officielle Meta pour synchroniser des mesures d\'engagement et de portée réelles sans données fabriquées.'
                  : 'Connect your Instagram Creator or Business account via Meta Graph API to analyze verified reach, audience demographics, and optimal publishing windows without fabricated metrics.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleConnect}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-[#7BE0C3]" />
                <span>{language === 'ar' ? 'ربط الحساب عبر Meta Graph API' : 'Connect via Meta Graph API'}</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ar' ? 'تصريح قراءة المقاييس فقط · لا يمكن للنظام النشر بدون موافقتك' : 'Read-only analytics permissions · Zero automated publishing'}</span>
            </div>
          </div>

          {/* Neutral Empty Data Matrix */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-50">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.analytics.reachMetric}</span>
                <Users className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold font-mono text-slate-400 block">—</span>
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'يتطلب ربط الحساب' : 'Requires connection'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.analytics.impressionsMetric}</span>
                <Eye className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold font-mono text-slate-400 block">—</span>
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'يتطلب ربط الحساب' : 'Requires connection'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.analytics.profileVisitsMetric}</span>
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold font-mono text-slate-400 block">—</span>
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'يتطلب ربط الحساب' : 'Requires connection'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{t.analytics.engagementRate}</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold font-mono text-slate-400 block">—</span>
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'يتطلب ربط الحساب' : 'Requires connection'}</span>
            </div>
          </div>
        </div>
      ) : !metrics ? null : (
        /* Connected Verified State */
        <div className="space-y-6">
          {/* Security & Boundary Banner */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#0E1633]">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
              <span>{language === 'ar' ? 'تكامل رسمي معتمد عبر Meta Graph API v20.0' : 'Official Meta Graph API v20.0 Verified Integration'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-sans">
              {t.analytics.officialMetaNotice} {language === 'ar' ? 'الحساب المتصل حالياً:' : 'Active Connected Account:'} <strong className="text-[#0E1633]">{instagram.accountName}</strong> ({instagram.accountType}).
            </p>
          </div>

          {/* Primary Insights Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{t.analytics.reachMetric}</span>
                <Users className="w-4 h-4 text-[#FF5A6E]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-mono text-[#0E1633] tabular-nums">
                  {metrics.accountsReached.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono">
                  {metrics.reachChange}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'حسابات فريدة تم الوصول إليها' : 'Unique accounts reached'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{t.analytics.impressionsMetric}</span>
                <Eye className="w-4 h-4 text-[#1B2650]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-mono text-[#0E1633] tabular-nums">
                  {metrics.totalImpressions.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono">
                  {metrics.impressionsChange}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'مرات الظهور في الخلاصات والريلز' : 'Impressions across Feed and Reels'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{t.analytics.profileVisitsMetric}</span>
                <Share2 className="w-4 h-4 text-[#7BE0C3]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-mono text-[#0E1633] tabular-nums">
                  {metrics.profileVisits.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono">
                  {metrics.visitsChange}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'نقرات الملف الشخصي والرابط الحيوي' : 'Profile & Bio link visits'}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{t.analytics.engagementRate}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold font-mono text-[#0E1633] tabular-nums">
                  {metrics.engagementRate}
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {language === 'ar' ? 'أعلى من المتوسط' : 'High engagement'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'نسبة الحفظ + المشاركة / الوصول' : 'Saves + Shares / Reach'}</span>
            </div>
          </div>

          {/* Two Columns: Top Performing Reels & Audience Geography */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-[#0E1633]">
                  {t.analytics.topReels}
                </h2>
                <span className="text-xs text-slate-400">{language === 'ar' ? 'مرتبة حسب مرات الحفظ (Saves)' : 'Ranked by saves and shares'}</span>
              </div>

              <div className="space-y-3">
                {metrics.topReels.map((reel) => (
                  <div key={reel.id} className="p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <h4 className="font-bold text-[#0E1633] leading-snug">
                      {reel.title}
                    </h4>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">{language === 'ar' ? 'الوصول:' : 'Reach:'}</span>
                        <span className="font-mono font-bold text-slate-800 tabular-nums">{reel.reach.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{language === 'ar' ? 'الحفظ (Saves):' : 'Saves:'}</span>
                        <span className="font-mono font-bold text-[#FF5A6E] tabular-nums">{reel.saves.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{language === 'ar' ? 'المشاركات:' : 'Shares:'}</span>
                        <span className="font-mono font-bold text-[#1B2650] tabular-nums">{reel.shares.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold text-[#0E1633]">
                  {t.analytics.audienceBreakdown}
                </h2>
                <span className="text-xs text-slate-400">{language === 'ar' ? 'جغرافيا المتابعين' : 'Audience Geography'}</span>
              </div>

              <div className="space-y-3">
                {metrics.audienceGeo.map((geo, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{geo.country}</span>
                      <span className="font-mono font-bold text-[#0E1633] tabular-nums">{geo.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#FF5A6E] to-[#E8465A] h-full rounded-full transition-all"
                        style={{ width: `${geo.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
