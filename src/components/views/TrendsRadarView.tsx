import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendSignal } from '../../types';
import { 
  Activity, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Compass,
  Plus
} from 'lucide-react';

export const TrendsRadarView: React.FC = () => {
  const { trends, refreshTrends, saveCalendarItem, brand, language, t, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isEnglish = language === 'en';
  const isFrench = language === 'fr';

  const localizeTrendMetadata = (value: string) => {
    const translations: Record<string, { en: string; fr: string; ar: string }> = {
      'Digital Products': { en: 'Digital Products', fr: 'Produits numériques', ar: 'المنتجات الرقمية' },
      'Produits Numériques': { en: 'Digital Products', fr: 'Produits numériques', ar: 'المنتجات الرقمية' },
      'المنتجات الرقمية': { en: 'Digital Products', fr: 'Produits numériques', ar: 'المنتجات الرقمية' },
      'Instagram Format': { en: 'Instagram Format', fr: 'Format Instagram', ar: 'صيغة Instagram' },
      'Format Instagram': { en: 'Instagram Format', fr: 'Format Instagram', ar: 'صيغة Instagram' },
      'Audience Psychology': { en: 'Audience Psychology', fr: 'Psychologie de l’audience', ar: 'سيكولوجية الجمهور' },
      "Psychologie de l'Audience": { en: 'Audience Psychology', fr: 'Psychologie de l’audience', ar: 'سيكولوجية الجمهور' },
      'AI Workflow': { en: 'AI Workflow', fr: 'Flux de travail IA', ar: 'سير عمل الذكاء الاصطناعي' },
      'Flux de Travail IA': { en: 'AI Workflow', fr: 'Flux de travail IA', ar: 'سير عمل الذكاء الاصطناعي' },
      'سير عمل الذكاء الاصطناعي': { en: 'AI Workflow', fr: 'Flux de travail IA', ar: 'سير عمل الذكاء الاصطناعي' },
      'صاعد بقوة (Rising Velocity)': { en: 'Rising', fr: 'En hausse', ar: 'صاعد بقوة' },
      'Vélocité Croissante': { en: 'Rising', fr: 'En hausse', ar: 'صاعد' },
      'Rising Velocity': { en: 'Rising', fr: 'En hausse', ar: 'صاعد' },
      'Peak Engagement': { en: 'Peak engagement', fr: 'Pic d’engagement', ar: 'ذروة التفاعل' },
      'Pic d’Engagement': { en: 'Peak engagement', fr: 'Pic d’engagement', ar: 'ذروة التفاعل' },
      'ذروة التفاعل (Peak Engagement)': { en: 'Peak engagement', fr: 'Pic d’engagement', ar: 'ذروة التفاعل' },
      'Tendance Pérenne': { en: 'Evergreen', fr: 'Tendance pérenne', ar: 'مستمر' },
      'Sustained Shift': { en: 'Sustained', fr: 'Évolution durable', ar: 'مستمر' },
      'مستقر وثابت (Sustained Shift)': { en: 'Sustained', fr: 'Évolution durable', ar: 'مستمر' },
      'Croissance Régulière': { en: 'Steady growth', fr: 'Croissance régulière', ar: 'نمو تدريجي' },
      'Stable Growth': { en: 'Steady growth', fr: 'Croissance régulière', ar: 'نمو تدريجي' },
      'صاعد تدريجياً': { en: 'Gradually rising', fr: 'En hausse progressive', ar: 'صاعد تدريجياً' },
    };
    const translated = translations[value];
    if (!translated) return value;
    return isEnglish ? translated.en : isFrench ? translated.fr : translated.ar;
  };

  const isVerifiedRecentEvidence = (trend: TrendSignal) => {
    if (!trend.isVerified || !trend.observedAt) return false;
    const observedAt = Date.parse(trend.observedAt);
    if (Number.isNaN(observedAt)) return false;
    const ageInDays = (Date.now() - observedAt) / 86400000;
    return ageInDays >= 0 && ageInDays <= 7 && trend.sourceUrl.startsWith('https://');
  };

  const localizeTrendContent = (trend: TrendSignal) => {
    const slot = Number(trend.id.match(/-(\d+)$/)?.[1]);
    const demoContent: Record<number, { title: { en: string; fr: string; ar: string }; summary: { en: string; fr: string; ar: string } }> = {
      1: {
        title: {
          en: 'Example topic: Practical workshops and focused consulting',
          fr: 'Sujet illustratif : ateliers pratiques et accompagnement ciblé',
          ar: 'موضوع توضيحي: ورش عملية واستشارات مركزة',
        },
        summary: {
          en: 'Demo example only. No dated, source-verified trend measurement is available.',
          fr: 'Exemple de démonstration uniquement. Aucune mesure datée et vérifiée n’est disponible.',
          ar: 'مثال تجريبي فقط. لا تتوفر قياسات مؤرخة وموثقة لهذا الموضوع.',
        },
      },
      2: {
        title: {
          en: 'Example topic: Structured educational videos and carousels',
          fr: 'Sujet illustratif : vidéos pédagogiques structurées et carrousels',
          ar: 'موضوع توضيحي: فيديوهات تعليمية وشرائح منظمة',
        },
        summary: {
          en: 'Demo example only. Platform-performance claims have not been independently verified.',
          fr: 'Exemple de démonstration uniquement. Les affirmations sur les performances ne sont pas vérifiées.',
          ar: 'مثال تجريبي فقط. لم يتم التحقق من ادعاءات أداء المنصات.',
        },
      },
      3: {
        title: {
          en: 'Example topic: Transparent content and audience trust',
          fr: 'Sujet illustratif : transparence éditoriale et confiance du public',
          ar: 'موضوع توضيحي: الشفافية في المحتوى وثقة الجمهور',
        },
        summary: {
          en: 'Demo example only. This topic is a strategic suggestion, not a verified trend.',
          fr: 'Exemple de démonstration uniquement. Il s’agit d’une piste stratégique, pas d’une tendance vérifiée.',
          ar: 'مثال تجريبي فقط. هذا اقتراح استراتيجي وليس اتجاهاً موثقاً.',
        },
      },
      4: {
        title: {
          en: 'Example topic: AI as a research assistant',
          fr: 'Sujet illustratif : l’IA comme assistant de recherche',
          ar: 'موضوع توضيحي: الذكاء الاصطناعي كمساعد للبحث',
        },
        summary: {
          en: 'Demo example only. No verified current trend data is attached to this suggestion.',
          fr: 'Exemple de démonstration uniquement. Aucune donnée actuelle vérifiée n’est associée.',
          ar: 'مثال تجريبي فقط. لا توجد بيانات حالية موثقة مرتبطة بهذا الاقتراح.',
        },
      },
    };
    const content = demoContent[slot];
    if (content && /^trend-(?:en|fr|ar)-\d+$/.test(trend.id)) {
      const locale = isEnglish ? 'en' : isFrench ? 'fr' : 'ar';
      return { title: content.title[locale], summary: content.summary[locale] };
    }

    const containsArabic = /[\u0600-\u06FF]/.test(`${trend.title} ${trend.summary}`);
    if (containsArabic && (isEnglish || isFrench)) {
      return {
        title: isEnglish ? 'Signal content is available in its original language.' : 'Le contenu du signal est disponible dans sa langue d’origine.',
        summary: isEnglish ? 'This item has not been translated.' : 'Cet élément n’a pas été traduit.',
      };
    }
    return { title: trend.title, summary: trend.summary };
  };

  const localizeSourceName = (source: string) => {
    const localized = localizeTrendMetadata(source);
    if (/[\u0600-\u06FF]/.test(localized) && (isEnglish || isFrench)) {
      return isEnglish ? 'Source details' : 'Détails de la source';
    }
    return localized;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTrends();
    setIsRefreshing(false);
  };

  const filteredTrends = trends.filter(trend => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const localizedContent = localizeTrendContent(trend);
      const match = localizedContent.title.toLowerCase().includes(q) ||
                    localizedContent.summary.toLowerCase().includes(q) ||
                    trend.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    const hasVerifiedEvidence = isVerifiedRecentEvidence(trend);
    if (filterSource === 'verified' && !hasVerifiedEvidence) return false;
    if (filterSource === 'demo' && hasVerifiedEvidence) return false;
    return true;
  });

  const handleCreateContentFromTrend = async (trend: TrendSignal) => {
    const category = localizeTrendMetadata(trend.category);
    const trendContent = localizeTrendContent(trend);
    const title = isEnglish
      ? `Content opportunity: ${category}`
      : isFrench
      ? `Opportunité de contenu : ${category}`
      : `فرصة محتوى: ${category}`;
    const hook = isEnglish
      ? `What should creators know about ${category}?`
      : isFrench
      ? `Que faut-il savoir sur ${category} ?`
      : `ما الذي ينبغي معرفته عن ${category}؟`;
    const sourceLabel = isEnglish ? 'Signal source' : isFrench ? 'Source du signal' : 'مصدر الإشارة';
    const summaryLabel = isEnglish ? 'Source summary' : isFrench ? 'Résumé de la source' : 'ملخص المصدر';
    const pillar = brand?.pillars?.[0]?.name || (isEnglish ? 'Educational' : isFrench ? 'Pédagogie' : 'تعليمي');
    try {
      await saveCalendarItem({
        title,
        platform: 'Instagram',
        format: 'Reels',
        horizon: '48h',
        pillar,
        status: 'draft',
        hook,
        notes: `${isVerifiedRecentEvidence(trend) ? sourceLabel : t.trends.sourceNotVerified}: ${localizeSourceName(trend.source)}\n${trend.sourceUrl}\n${summaryLabel}: ${trendContent.summary}`
      }, true);
      showToast(t.decisionBoard.addToCalendar + ' ✓', 'success');
    } catch {
      return;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.trends.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.trends.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0E1633] bg-[#7BE0C3] hover:bg-[#68d1b3] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? t.common.loading : t.trends.refreshSignals}</span>
          </button>
        </div>
      </div>

      {/* Provenance Transparency Alert */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#0E1633]">
          <ShieldCheck className="w-4 h-4 text-[#FF5A6E]" />
          <span>{t.trends.integrityTitle}</span>
        </div>
        <p className="text-slate-600 leading-relaxed font-sans">
          {t.trends.integrityDescription}
        </p>
      </div>

      {/* Search & Source Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 start-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.trends.searchPlaceholder}
            className="w-full ps-9 pe-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
          >
            <option value="all">{t.trends.allSignals}</option>
            <option value="verified">{t.trends.verifiedOnly}</option>
            <option value="demo">{t.trends.demoOnly}</option>
          </select>
        </div>
      </div>

      {/* Signal Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrends.map((trend) => {
          const verifiedEvidence = isVerifiedRecentEvidence(trend);
          const content = localizeTrendContent(trend);
          return (
          <div
            key={trend.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header Badges & Source */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  trend.isVerified 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                }`}>
                  {verifiedEvidence ? t.trends.verifiedBadge : t.trends.demoBadge}
                </span>

                {verifiedEvidence ? (
                  <div className="flex items-center gap-1 font-mono font-bold text-xs text-emerald-700 tabular-nums">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{trend.velocity}% {t.trends.velocityUnit}</span>
                  </div>
                ) : <span className="text-[11px] text-slate-400">{t.trends.noVerifiedMetric}</span>}
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[#0E1633] leading-snug">
                {content.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {content.summary}
              </p>

              {/* Metrics metadata grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div>
                  <span className="block text-slate-400">{t.trends.categoryAndNiche}:</span>
                  <span className="font-semibold text-slate-700">{localizeTrendMetadata(trend.category)}</span>
                </div>
                <div>
                  <span className="block text-slate-400">{t.trends.audienceFit}:</span>
                  <span className="font-mono font-bold text-[#0E1633] tabular-nums">
                    {verifiedEvidence ? `${trend.nicheFitScore}%` : t.trends.noVerifiedMetric}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400">{t.trends.decayStatus}:</span>
                  <span className="font-semibold text-slate-700">{localizeTrendMetadata(trend.decayStatus)}</span>
                </div>
                <div>
                  <span className="block text-slate-400">{t.trends.estimatedAge}:</span>
                  <span className="font-semibold text-slate-700">
                    {verifiedEvidence ? `${trend.freshnessDays} ${t.trends.daysUnit}` : t.trends.noVerifiedMetric}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={trend.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <span>{localizeSourceName(trend.source)}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                onClick={() => handleCreateContentFromTrend(trend)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#7BE0C3]" />
                <span>{t.trends.createFromTrend}</span>
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
