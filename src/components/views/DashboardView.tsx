import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Compass, 
  Activity, 
  Clock, 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Eye, 
  Bookmark,
  Share2,
  Plus
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    brand, 
    decisions, 
    calendar, 
    trends, 
    instagram, 
    setRoute, 
    openGenerator, 
    openEditor, 
    t, 
    direction,
    language,
    saveCalendarItem,
    showToast
  } = useApp();

  const isEn = language === 'en';
  const isFr = language === 'fr';

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const topPriorityDecision = decisions[0];
  const next48hItems = calendar.filter(i => i.horizon === '48h').slice(0, 3);
  const activeTrends = trends.slice(0, 3);

  const handleAddTopDecision = async () => {
    if (!topPriorityDecision) return;
    try {
      await saveCalendarItem({
        title: topPriorityDecision.title,
        platform: topPriorityDecision.platform,
        format: topPriorityDecision.format,
        horizon: '48h',
        pillar: brand?.pillars?.[0]?.name || 'Authority',
        status: 'draft',
        hook: topPriorityDecision.hook,
        notes: `${topPriorityDecision.outline}\n\n${topPriorityDecision.cta}`,
        decisionId: topPriorityDecision.id
      }, true);
      showToast(t.decisionBoard.addToCalendar + ' ✓', 'success');
    } catch {
      return;
    }
  };

  const instagramMetrics = instagram?.metrics;
  const isConnected = !!instagram?.isConnected && !!instagramMetrics;

  return (
    <div className="space-y-6">
      {/* Onboarding Banner if Brand is not yet configured */}
      {!brand && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'ar' ? 'مرحباً بك! قم بتعريف هوية علامتك التجارية' : language === 'fr' ? 'Bienvenue ! Configurez le profil de votre marque' : 'Welcome! Set up your Creator Brand Profile'}
            </h3>
            <p className="text-xs text-slate-600">
              {language === 'ar' 
                ? 'استوديو العلامة التجارية يحدد أسلوبك، النيش، والركائز لتوليد استراتيجيات محتوى مخصصة لك فقط.' 
                : 'Define your niche, voice, and content pillars to unlock personalized 48-hour content plans.'}
            </p>
          </div>
          <button
            onClick={() => setRoute('brand-studio')}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-xl transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
          >
            {language === 'ar' ? 'إعداد استوديو العلامة' : language === 'fr' ? 'Configurer le profil' : 'Open Brand Studio'}
          </button>
        </div>
      )}

      {/* Top Welcome & Horizon Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.dashboard.welcome}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {brand?.name || (language === 'ar' ? 'استوديو صانع المحتوى' : 'Creator Workspace')} · {t.dashboard.overviewSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openGenerator('ideas')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{t.dashboard.generateIdeas}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t.analytics.reachMetric}</span>
            <Users className="w-4 h-4 text-[#FF5A6E]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#0E1633] tabular-nums">
              {isConnected ? instagramMetrics?.accountsReached.toLocaleString() : '—'}
            </span>
            <span className={`text-[11px] font-bold font-mono ${isConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isConnected ? instagramMetrics?.reachChange : (language === 'ar' ? 'غير متصل' : 'Not linked')}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {isConnected ? (isEn ? 'Past 30 Days (Meta Graph API)' : 'آخر 30 يوماً (Meta Graph API)') : (language === 'ar' ? 'اربط حساب Instagram لعرض الوصول' : 'Connect Instagram for live reach')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t.analytics.impressionsMetric}</span>
            <Eye className="w-4 h-4 text-[#1B2650]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#0E1633] tabular-nums">
              {isConnected ? instagramMetrics?.totalImpressions.toLocaleString() : '—'}
            </span>
            <span className={`text-[11px] font-bold font-mono ${isConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isConnected ? instagramMetrics?.impressionsChange : (language === 'ar' ? 'غير متصل' : 'Not linked')}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {isConnected ? (isEn ? 'Cumulative verified impressions' : 'مشاهدات تراكمية موثقة') : (language === 'ar' ? 'يتطلب ربط الحساب' : 'Requires account connection')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t.analytics.engagementRate}</span>
            <TrendingUp className="w-4 h-4 text-[#7BE0C3]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#0E1633] tabular-nums">
              {isConnected ? instagramMetrics?.engagementRate : '—'}
            </span>
            <span className={`text-[11px] font-bold font-mono ${isConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isConnected ? (isEn ? 'High' : isFr ? 'Élevé' : 'عالي') : '—'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {isConnected ? (isEn ? 'Average saves & shares' : 'متوسط الحفظ والمشاركة') : (language === 'ar' ? 'نسبة التفاعل الحقيقية' : 'Real engagement rate')}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t.analytics.profileVisitsMetric}</span>
            <Share2 className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-[#0E1633] tabular-nums">
              {isConnected ? instagramMetrics?.profileVisits.toLocaleString() : '—'}
            </span>
            <span className={`text-[11px] font-bold font-mono ${isConnected ? 'text-emerald-600' : 'text-slate-400'}`}>
              {isConnected ? instagramMetrics?.visitsChange : '—'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {isConnected ? (isEn ? 'Conversion to Bio & Offers' : 'تحويل نحو البايو والعروض') : (language === 'ar' ? 'نقرات الرابط الحيوي' : 'Bio link clicks')}
          </span>
        </div>
      </div>

      {/* Top Priority Action Spotlight Box or Empty State */}
      {!topPriorityDecision ? (
        <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#0E1633]">
            {language === 'ar' ? 'لا توجد قرارات محتوى منشأة حتى الآن' : language === 'fr' ? 'Aucune opportunité prioritaire pour le moment' : 'No Priority Publishing Opportunities Yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {brand 
              ? (language === 'ar' ? 'قم بتوليد قرارات استراتيجية مبنية على مؤشرات رادار التريند ومخصصة لهوية علامتك التجارية.' : 'Generate evidence-backed content decisions tailored to your brand pillars.')
              : (language === 'ar' ? 'حدد هوية علامتك التجارية في استوديو البراند أولاً لتوليد قرارات مخصصة.' : 'Define your brand in Brand Studio first to generate personalized decisions.')}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            {brand ? (
              <button
                onClick={() => setRoute('decision-board')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7BE0C3]" />
                <span>{language === 'ar' ? 'الانتقال إلى لوحة القرارات' : 'Go to Decision Board'}</span>
              </button>
            ) : (
              <button
                onClick={() => setRoute('brand-studio')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إعداد استوديو العلامة' : 'Configure Brand Studio'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5A6E]" />
              <span className="text-xs font-bold text-[#FF5A6E] tracking-wide uppercase">
                {t.dashboard.priorityActionTitle} · #{topPriorityDecision.rank || 1}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {topPriorityDecision.platform} ({topPriorityDecision.format})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                {topPriorityDecision.recommendedTiming}
              </span>
            </div>
          </div>

          <div className="pt-3 space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-[#0E1633] leading-snug">
              {topPriorityDecision.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <strong className="block text-[#0E1633] font-bold mb-1">
                  {t.decisionBoard.whyRecommended}:
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  {topPriorityDecision.whyRecommended}
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/50 rounded-lg">
                <strong className="block text-amber-900 font-bold mb-1">
                  {t.decisionBoard.whatIsUncertain}:
                </strong>
                <p className="text-amber-800 leading-relaxed">
                  {topPriorityDecision.whatIsUncertain}
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F2F4FA] rounded-lg text-xs space-y-1">
              <strong className="text-slate-700 block">{t.common.hook}:</strong>
              <p className="text-slate-900 font-medium font-sans">
                "{topPriorityDecision.hook}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{t.common.confidence}:</span>
                <span className="text-emerald-700 font-bold font-mono">{topPriorityDecision.confidence}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditor({
                    id: `cal-quick-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                    title: topPriorityDecision.title,
                    platform: topPriorityDecision.platform,
                    format: topPriorityDecision.format,
                    time: new Date().toISOString(),
                    horizon: '48h',
                    pillar: brand?.pillars?.[0]?.name || 'Authority',
                    status: 'draft',
                    hook: topPriorityDecision.hook,
                    notes: `${topPriorityDecision.outline}\n\n${topPriorityDecision.cta}`,
                    decisionId: topPriorityDecision.id
                  })}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t.decisionBoard.editDraft}
                </button>

                <button
                  onClick={handleAddTopDecision}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#7BE0C3]" />
                  <span>{t.decisionBoard.addToCalendar}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two-Column Workspace Split: 48h Outlook & Radar Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next 48 Hours Scheduled Content (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF5A6E]" />
              <h2 className="text-sm font-bold text-[#0E1633]">
                {t.dashboard.next48Hours}
              </h2>
            </div>
            <button
              onClick={() => setRoute('calendar')}
              className="text-xs font-semibold text-[#FF5A6E] hover:underline flex items-center gap-1"
            >
              <span>{t.dashboard.viewAllCalendar}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {next48hItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                {t.calendar.emptyPlan}
              </div>
            ) : (
              next48hItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openEditor(item)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0E1633]">{item.platform}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{item.format}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                      item.status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.common[item.status as keyof typeof t.common] || item.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#0E1633] leading-snug">
                    {item.title}
                  </h3>

                  {item.hook && (
                    <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                      "{item.hook}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="truncate">{item.pillar}</span>
                    <span className="font-mono tabular-nums">
                      {new Date(item.time).toLocaleTimeString(direction === 'rtl' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rising Trend Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7BE0C3]" />
              <h2 className="text-sm font-bold text-[#0E1633]">
                {t.dashboard.radarAlerts}
              </h2>
            </div>
            <button
              onClick={() => setRoute('trends')}
              className="text-xs font-semibold text-[#FF5A6E] hover:underline flex items-center gap-1"
            >
              <span>{t.nav.trends}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeTrends.map((trend) => (
              <div key={trend.id} className="p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-[#FF5A6E] bg-rose-50 px-2 py-0.5 rounded">
                    {trend.category}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{trend.velocity}%</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-[#0E1633] leading-snug">
                  {trend.title}
                </h4>

                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {trend.summary}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span className="truncate">{trend.source}</span>
                  <span className="font-semibold text-slate-600">{trend.decayStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Tools Strip */}
      <div className="bg-[#0E1633] text-white p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7BE0C3]" />
              <span>{t.dashboard.quickTools}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {brand?.name ? brand.name.split('—')[0].trim() : 'Creator Studio'} · {t.dashboard.overviewSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => openGenerator('ideas')}
            className="p-3 bg-[#1B2650] hover:bg-[#25346d] rounded-xl text-start transition-colors cursor-pointer space-y-1.5"
          >
            <span className="text-xs font-bold text-white block">
              {t.dashboard.generateIdeas}
            </span>
            <span className="text-[11px] text-slate-400 block">
              {t.generator.formatLabel}
            </span>
          </button>

          <button
            onClick={() => openGenerator('bio')}
            className="p-3 bg-[#1B2650] hover:bg-[#25346d] rounded-xl text-start transition-colors cursor-pointer space-y-1.5"
          >
            <span className="text-xs font-bold text-white block">
              {t.dashboard.generateBio}
            </span>
            <span className="text-[11px] text-slate-400 block">
              {t.contentLibrary.bios}
            </span>
          </button>

          <button
            onClick={() => openGenerator('strategy')}
            className="p-3 bg-[#1B2650] hover:bg-[#25346d] rounded-xl text-start transition-colors cursor-pointer space-y-1.5"
          >
            <span className="text-xs font-bold text-white block">
              {t.dashboard.generateStrategy}
            </span>
            <span className="text-[11px] text-slate-400 block">
              {t.brandStudio.contentPillars}
            </span>
          </button>

          <button
            onClick={() => openGenerator('plan_48h')}
            className="p-3 bg-[#1B2650] hover:bg-[#25346d] rounded-xl text-start transition-colors cursor-pointer space-y-1.5"
          >
            <span className="text-xs font-bold text-white block">
              {t.common.hours48}
            </span>
            <span className="text-[11px] text-slate-400 block">
              {t.calendar.view48h}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
