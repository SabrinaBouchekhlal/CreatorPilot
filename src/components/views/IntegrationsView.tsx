import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Boxes, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Globe,
  Radio,
  FileCheck2,
  Key
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { instagram, requestInstagramConnection, t, showToast, language } = useApp();

  const isEn = language === 'en';
  const isFr = language === 'fr';

  const securityBannerText = isEn
    ? 'We never ask for social account passwords or publish without your approval. Instagram account data remains unavailable until the official Meta OAuth integration is configured.'
    : isFr
    ? 'Nous ne demandons jamais vos mots de passe et ne publions rien sans votre accord. Les données Instagram seront disponibles après configuration de l’intégration officielle Meta OAuth.'
    : 'لا نطلب كلمات مرور حساباتك ولا ننشر دون موافقتك. لن تتوفر بيانات Instagram حتى يتم إعداد تكامل Meta OAuth الرسمي.';

  const permissionsLabel = isEn ? 'Authorized Permissions:' : isFr ? 'Permissions autorisées :' : 'الصلاحيات المصرحة:';
  const regionsLabel = isEn ? 'Monitored Regions:' : isFr ? 'Régions surveillées :' : 'المناطق المراقبة:';
  const regionsText = isEn 
    ? 'Algeria, Morocco, Egypt, Saudi Arabia, UAE, and France' 
    : isFr 
    ? 'Algérie, Maroc, Égypte, Arabie Saoudite, Émirats et France' 
    : 'الجزائر، المغرب، مصر، السعودية، الإمارات، وفرنسا';

  const sourcesLabel = isEn ? 'Curated Publications:' : isFr ? 'Sources accréditées :' : 'المصادر المعتمدة:';
  const autoSyncedBtn = isEn ? 'Auto-Synchronized' : isFr ? 'Synchronisé automatiquement' : 'مفعل تلقائياً';
  const monitoredBtn = isEn ? 'Active & Curated' : isFr ? 'Actif et surveillé' : 'مفعل ومراقب';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.integrations.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.integrations.subtitle}
          </p>
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#0E1633]">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{t.integrations.officialSecurityBanner}</span>
        </div>
        <p className="text-slate-600 leading-relaxed font-sans">
          {securityBannerText}
        </p>
      </div>

      {/* Integration Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Meta / Instagram Graph API */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold text-sm">
                IG
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                instagram?.isConnected 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {instagram?.isConnected ? t.integrations.statusConnected : t.integrations.statusUnconfigured}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#0E1633]">
              {t.integrations.metaInstagram}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.integrations.metaDesc}
            </p>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-[11px] text-slate-600 font-sans">
              <span className="block font-bold text-slate-700">{permissionsLabel}</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                <li>instagram_basic ({isEn ? 'Account info' : isFr ? 'Infos compte' : 'معلومات الحساب'})</li>
                <li>instagram_manage_insights ({isEn ? 'Insights & Reach' : isFr ? 'Analyses & Portée' : 'الرؤى والتحليلات'})</li>
                <li>pages_show_list ({isEn ? 'Facebook Page Link' : isFr ? 'Lien page Facebook' : 'الربط بصفحة فيسبوك'})</li>
              </ul>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={requestInstagramConnection}
              className={`w-full py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                instagram?.isConnected
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-[#FF5A6E] text-white hover:bg-[#E8465A]'
              }`}
            >
              {instagram?.isConnected ? t.analytics.disconnectAccount : t.integrations.connectMeta}
            </button>
          </div>
        </div>

        {/* Google Trends Public API */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#0E1633] text-[#7BE0C3] flex items-center justify-center font-bold text-sm">
                GT
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {t.integrations.statusConnected}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#0E1633]">
              {t.integrations.googleTrends}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.integrations.googleTrendsDesc}
            </p>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-[11px] text-slate-600 font-sans">
              <span className="block font-bold text-slate-700">{regionsLabel}</span>
              <p className="text-slate-500">{regionsText}</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => showToast(isEn ? 'Google Trends feed is active in Trend Radar' : isFr ? 'Le flux Google Trends est actif dans le Radar' : 'خلاصة Google Trends مفعلة وتتحدث دورياً في رادار التريندات', 'info')}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {autoSyncedBtn}
            </button>
          </div>
        </div>

        {/* RSS Newsfeeds & Publications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#1B2650] text-[#FF5A6E] flex items-center justify-center font-bold text-sm">
                RSS
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {t.integrations.statusConnected}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#0E1633]">
              {t.integrations.rssSources}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t.integrations.rssSourcesDesc}
            </p>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1 text-[11px] text-slate-600 font-sans">
              <span className="block font-bold text-slate-700">{sourcesLabel}</span>
              <p className="text-slate-500">Meta Creator Center, SocialMediaToday, MENA Tech</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => showToast(isEn ? 'Newsfeeds connected and updated' : isFr ? 'Flux d\'actualités connectés et triés' : 'خلاصات الأخبار متصلة ومفروزة بانتظام', 'info')}
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {monitoredBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
