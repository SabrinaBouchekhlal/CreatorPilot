import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarItem, ContentStatus } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Filter, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function formatCalendarDate(value: string, language: string) {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = dateOnly
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return { dateOnly, text: value };
  const locale = language.startsWith('ar') ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US';
  return {
    dateOnly,
    text: date.toLocaleString(locale, dateOnly
      ? { weekday: 'short', month: 'short', day: 'numeric' }
      : { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
  };
}

export const CalendarView: React.FC = () => {
  const { 
    calendar, 
    saveCalendarItem, 
    deleteCalendarItem, 
    regenerateCalendar,
    brand,
    language,
    openEditor, 
    openGenerator, 
    t, 
    direction, 
    showToast 
  } = useApp();

  const [activeHorizon, setActiveHorizon] = useState<'48h' | '7d'>('48h');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const filteredItems = calendar.filter(item => {
    if (item.horizon !== activeHorizon) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const handleStatusChange = async (item: CalendarItem, newStatus: ContentStatus) => {
    try {
      if (newStatus === 'published') {
        await saveCalendarItem({ ...item, status: 'scheduled' });
        const msg = language === 'en'
          ? 'Direct publishing requires verified Meta API authorization. Marked as "scheduled".'
          : language === 'fr'
          ? 'La diffusion directe nécessite une autorisation officielle Meta. Marqué comme "planifié".'
          : 'النشر المباشر يتطلب تصريح Meta الرسمي. تم اعتماد المنشور كـ "مجدول" حالياً.';
        showToast(msg, 'info');
        return;
      }
      await saveCalendarItem({ ...item, status: newStatus });
    } catch {
      return;
    }
  };

  const handleExportCsv = () => {
    const headers = ['Title', 'Platform', 'Format', 'Horizon', 'Pillar', 'Status', 'DateOrTime', 'Hook'];
    const rows = filteredItems.map(i => [
      `"${i.title.replace(/"/g, '""')}"`,
      i.platform,
      i.format,
      i.horizon,
      `"${i.pillar}"`,
      i.status,
      i.time,
      `"${(i.hook || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `creatorpilot_calendar_${activeHorizon}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t.calendar.exportCsv + ' ✓', 'success');
  };

  const handleExportMarkdown = () => {
    let md = `# CreatorPilot Content Calendar (${activeHorizon.toUpperCase()})\n\n`;
    filteredItems.forEach((item, index) => {
      md += `### ${index + 1}. ${item.title}\n`;
      md += `- **Platform**: ${item.platform} (${item.format})\n`;
      md += `- **Pillar**: ${item.pillar}\n`;
      md += `- **Date / time**: ${item.time}\n`;
      md += `- **Status**: ${item.status}\n`;
      if (item.hook) md += `- **Opening Hook**: ${item.hook}\n`;
      if (item.notes) md += `\n**Script / Outline**:\n${item.notes}\n\n`;
      md += `---\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `creatorpilot_calendar_${activeHorizon}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t.calendar.exportMarkdown + ' ✓', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.calendar.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.calendar.subtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Export dropdown / buttons */}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Markdown</span>
          </button>

          <button
            onClick={async () => {
              setIsRegenerating(true);
              await regenerateCalendar();
              setIsRegenerating(false);
            }}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Regenerate execution plan tailored to active brand profile"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#FF5A6E] ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? (language === 'en' ? 'Regenerating...' : language === 'fr' ? 'Génération...' : 'جار التحديث...') : (language === 'en' ? 'Regenerate for Brand' : language === 'fr' ? 'Actualiser le Plan' : 'إعادة توليد الخطة')}</span>
          </button>

          <button
            onClick={() => openEditor(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#7BE0C3]" />
            <span>{t.calendar.createItem}</span>
          </button>
        </div>
      </div>

      {/* Horizon Selector & Status Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        {/* 48h vs 7d Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveHorizon('48h')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              activeHorizon === '48h'
                ? 'bg-white text-[#0E1633] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.calendar.view48h}
          </button>
          <button
            onClick={() => setActiveHorizon('7d')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              activeHorizon === '7d'
                ? 'bg-white text-[#0E1633] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.calendar.view7d}
          </button>
        </div>

        {/* Right side filter and generator button */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
          >
            <option value="all">{t.common.all} {t.common.status}</option>
            <option value="proposed">{t.common.proposed}</option>
            <option value="draft">{t.common.draft}</option>
            <option value="approved">{t.common.approved}</option>
            <option value="scheduled">{t.common.scheduled}</option>
            <option value="published">{t.common.published}</option>
          </select>

          <button
            onClick={() => openGenerator(activeHorizon === '48h' ? 'plan_48h' : 'plan_7d')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>
              {activeHorizon === '48h' ? t.calendar.generate48hBtn : t.calendar.generate7dBtn}
            </span>
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 bg-slate-100/80 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{t.calendar.publishSafeNotice}</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Meta Official Sandbox API Enabled
        </span>
      </div>

      {/* Items Grid */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">{t.calendar.emptyPlan}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t.calendar.generatePlanPrompt}
            </p>
            <button
              onClick={() => openGenerator(activeHorizon === '48h' ? 'plan_48h' : 'plan_7d')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7BE0C3]" />
              <span>{activeHorizon === '48h' ? t.calendar.generate48hBtn : t.calendar.generate7dBtn}</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#FF5A6E]">{item.platform}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-600 font-medium">{item.format}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-mono tabular-nums">
                    {formatCalendarDate(item.time, language).text}
                  </span>
                  {formatCalendarDate(item.time, language).dateOnly && (
                    <span className="text-[10px] text-slate-400">
                      {language.startsWith('ar') ? 'الوقت غير محدد' : language === 'fr' ? 'Heure non définie' : 'Time not set'}
                    </span>
                  )}
                </div>

                {/* Status Selector & Badges */}
                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item, e.target.value as ContentStatus)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-md border focus:outline-none ${
                      item.status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : item.status === 'scheduled'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : item.status === 'draft'
                        ? 'bg-slate-100 text-slate-800 border-slate-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    <option value="proposed">{t.common.proposed}</option>
                    <option value="draft">{t.common.draft}</option>
                    <option value="approved">{t.common.approved}</option>
                    <option value="scheduled">{t.common.scheduled}</option>
                    <option value="published">{t.common.published}</option>
                    <option value="dismissed">{t.common.dismissed}</option>
                  </select>

                  <button
                    onClick={() => openEditor(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title={t.common.edit}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteCalendarItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Hook */}
              <div>
                <h4 className="text-sm font-bold text-[#0E1633]">
                  {item.title}
                </h4>
                {item.hook && (
                  <p className="text-xs text-slate-600 mt-1 italic font-sans">
                    <strong className="text-slate-700 not-italic">{t.common.hook}: </strong>
                    "{item.hook}"
                  </p>
                )}
              </div>

              {/* Notes / Outline Preview */}
              {item.notes && (
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 font-sans line-clamp-3 whitespace-pre-line border border-slate-100">
                  {item.notes}
                </div>
              )}

              {/* Bottom metadata */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-600">
                  {language === 'en' ? 'Pillar' : language === 'fr' ? 'Pilier' : 'الركيزة'}: {item.pillar}
                </span>

                {item.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange(item, 'approved')}
                    className="inline-flex items-center gap-1 text-[#FF5A6E] font-bold hover:underline"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.calendar.approveItem}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
