import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentDecision, ContentStatus } from '../../types';
import { 
  Compass, 
  Sparkles, 
  Plus, 
  Check, 
  X, 
  Clock, 
  Flame, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Filter,
  Copy,
  ChevronDown
} from 'lucide-react';

export const DecisionBoardView: React.FC = () => {
  const { 
    decisions, 
    updateDecisionStatus, 
    regenerateDecisions,
    saveCalendarItem, 
    openEditor, 
    brand, 
    language,
    t, 
    showToast 
  } = useApp();

  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const filteredDecisions = decisions.filter(d => {
    if (platformFilter !== 'all' && !d.platform.toLowerCase().includes(platformFilter.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && d.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleAddToCalendar = async (decision: ContentDecision) => {
    try {
      await saveCalendarItem({
        title: decision.title,
        platform: decision.platform,
        format: decision.format,
        horizon: '48h',
        pillar: brand?.pillars?.[0]?.name || 'Authority',
        status: 'draft',
        hook: decision.hook,
        notes: `${decision.outline}\n\n[${language === 'en' ? 'Call to Action' : language === 'fr' ? 'Appel à l\'action' : 'الدعوة للإجراء'}]: ${decision.cta}`,
        decisionId: decision.id
      }, true);
      await updateDecisionStatus(decision.id, 'scheduled', true);
      showToast(t.decisionBoard.addToCalendar + ' ✓', 'success');
    } catch {
      return;
    }
  };

  const handleDismiss = async (decisionId: string) => {
    await updateDecisionStatus(decisionId, 'dismissed', true);
    showToast(t.decisionBoard.dismiss, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.decisionBoard.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.decisionBoard.subtitle}
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={async () => {
              setIsRegenerating(true);
              await regenerateDecisions();
              setIsRegenerating(false);
            }}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Regenerate strategic opportunities tailored to active brand profile"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#FF5A6E] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? (language === 'en' ? 'Regenerating...' : language === 'fr' ? 'Génération...' : 'جار التحديث...') : (language === 'en' ? 'Regenerate for Brand' : language === 'fr' ? 'Actualiser les Décisions' : 'إعادة توليد القرارات')}</span>
          </button>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
          >
            <option value="all">{language === 'en' ? 'All Platforms' : language === 'fr' ? 'Toutes plateformes' : 'كافة المنصات'}</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
          >
            <option value="all">{language === 'en' ? 'All Statuses' : language === 'fr' ? 'Tous statuts' : 'كافة الحالات'}</option>
            <option value="proposed">{language === 'en' ? 'New Proposed' : language === 'fr' ? 'Nouvelle proposition' : 'مقترح جديد'}</option>
            <option value="scheduled">{language === 'en' ? 'In Calendar' : language === 'fr' ? 'Dans le calendrier' : 'مضاف للتقويم'}</option>
            <option value="dismissed">{language === 'en' ? 'Dismissed' : language === 'fr' ? 'Ignoré' : 'مستبعد'}</option>
          </select>
        </div>
      </div>

      {/* Decision Cards List */}
      <div className="space-y-5">
        {filteredDecisions.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
            {language === 'en' ? 'No decisions match the selected filters.' : language === 'fr' ? 'Aucune décision ne correspond aux filtres sélectionnés.' : 'لا توجد قرارات تطابق معايير التصفية المحددة.'}
          </div>
        ) : (
          filteredDecisions.map((decision) => (
            <div
              key={decision.id}
              className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                decision.status === 'dismissed' 
                  ? 'border-slate-200 opacity-60 bg-slate-50/50' 
                  : 'border-slate-200 hover:border-[#FF5A6E]/30 hover:shadow-md'
              }`}
            >
              {/* Card Header Strip */}
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F2F4FA]/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0E1633] text-white flex items-center justify-center font-extrabold text-xs font-mono">
                    #{decision.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#0E1633]">{decision.platform}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-600 font-medium">{decision.format}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[#FF5A6E] font-semibold">{decision.freshness}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.decisionBoard.evidenceStrength}: {decision.confidence}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#0E1633] leading-snug">
                    {decision.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{decision.recommendedTiming}</span>
                  </div>
                </div>

                {/* Why & Limitations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Why recommended */}
                  <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                    <span className="font-bold text-[#0E1633] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF5A6E]" />
                      <span>{t.decisionBoard.whyRecommended}</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed font-sans">
                      {decision.whyRecommended}
                    </p>
                  </div>

                  {/* Uncertainty & Limitations */}
                  <div className="p-4 bg-amber-50/60 rounded-xl space-y-1.5 border border-amber-200/50">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t.decisionBoard.whatIsUncertain}</span>
                    </span>
                    <p className="text-amber-800 leading-relaxed font-sans">
                      {decision.whatIsUncertain}
                    </p>
                  </div>
                </div>

                {/* Hook & Outline Accordion */}
                <div className="p-4 bg-[#F2F4FA] rounded-xl space-y-3 text-xs">
                  <div>
                    <strong className="text-slate-700 block mb-1 font-bold">
                      {t.decisionBoard.suggestedHook}:
                    </strong>
                    <p className="text-slate-900 font-semibold bg-white p-2.5 rounded-lg border border-slate-200">
                      "{decision.hook}"
                    </p>
                  </div>

                  <div>
                    <strong className="text-slate-700 block mb-1 font-bold">
                      {t.decisionBoard.suggestedOutline}:
                    </strong>
                    <pre className="text-slate-700 font-sans whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                      {decision.outline}
                    </pre>
                  </div>

                  {decision.cta && (
                    <div>
                      <strong className="text-slate-700 block mb-1 font-bold">
                        {t.common.cta}:
                      </strong>
                      <p className="text-slate-800 bg-white p-2 rounded-lg border border-slate-200">
                        {decision.cta}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-slate-400">
                    الحالة الحالية: <strong className="text-slate-700">{decision.status}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {decision.status !== 'dismissed' && (
                      <button
                        onClick={() => handleDismiss(decision.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        {t.decisionBoard.dismiss}
                      </button>
                    )}

                    <button
                      onClick={() => openEditor({
                        id: `cal-from-${decision.id}`,
                        title: decision.title,
                        platform: decision.platform,
                        format: decision.format,
                        time: new Date().toISOString(),
                        horizon: '48h',
                        pillar: brand?.pillars?.[0]?.name || 'Authority',
                        status: 'draft',
                        hook: decision.hook,
                        notes: `${decision.outline}\n\n${decision.cta}`,
                        decisionId: decision.id
                      })}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {t.decisionBoard.editDraft}
                    </button>

                    <button
                      onClick={() => handleAddToCalendar(decision)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" />
                      <span>{t.decisionBoard.addToCalendar}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
