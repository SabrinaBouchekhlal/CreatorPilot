import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarItem, ContentStatus } from '../../types';
import { X, Check, Copy, Save, BookmarkPlus, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export const ScriptEditorModal: React.FC = () => {
  const { editingItem, closeEditor, saveCalendarItem, saveLibraryItem, brand, t, showToast, language } = useApp();

  const [formData, setFormData] = useState<Partial<CalendarItem>>({
    title: '',
    platform: 'Instagram',
    format: 'Reels',
    time: new Date().toISOString().substring(0, 16),
    horizon: '48h',
    pillar: brand?.pillars?.[0]?.name || 'Authority',
    status: 'draft',
    hook: '',
    notes: '',
    decisionId: null
  });

  const [copied, setCopied] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const localized = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  useEffect(() => {
    if (editingItem) {
      setFormData({
        ...editingItem,
        time: editingItem.time ? editingItem.time.substring(0, 16) : new Date().toISOString().substring(0, 16)
      });
    } else {
      setFormData({
        title: '',
        platform: 'Instagram',
        format: 'Reels',
        time: new Date(Date.now() + 86400000).toISOString().substring(0, 16),
        horizon: '48h',
        pillar: brand?.pillars?.[0]?.name || 'Authority',
        status: 'draft',
        hook: '',
        notes: '',
        decisionId: null
      });
    }
  }, [editingItem, brand]);

  // Modal must not render when no item is being edited
  if (!editingItem) return null;

  const handleAutoGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'ideas',
          customPrompt: formData.title || localized('محتوى تعليمي للمدربين', 'Contenu éducatif pour les formateurs', 'Educational content for coaches'),
          language
        })
      });
      const data = await res.json();
      if (data.data?.ideas?.[0]?.script) {
        setFormData(prev => ({
          ...prev,
          hook: prev.hook || data.data.ideas[0].hook,
          notes: data.data.ideas[0].script
        }));
        showToast(localized('تم توليد السيناريو التلقائي بنجاح!', 'Script généré avec succès !', 'Script generated successfully!'), 'success');
      } else {
        const fallbackScript = localized(
          `[توليد المنصة التلقائي]\n1. الهوك الافتتاحي (0-3 ثوان): ${formData.hook || formData.title}\n2. المفارقة وتحليل المشكلة (4-15 ثانية)\n3. الخطوات العملية الثلاث مع نموذج تطبيقي (16-45 ثانية)\n4. الدعوة للتفاعل وحفظ المنشور`,
          `[Génération automatique]\n1. Accroche (0-3 s) : ${formData.hook || formData.title}\n2. Problème et analyse (4-15 s)\n3. Trois étapes pratiques avec exemple (16-45 s)\n4. Appel à l’action`,
          `[Auto-generated outline]\n1. Opening hook (0-3 sec): ${formData.hook || formData.title}\n2. Frame and analyze the problem (4-15 sec)\n3. Three practical steps with an example (16-45 sec)\n4. Call to action`
        );
        setFormData(prev => ({ ...prev, notes: fallbackScript }));
        showToast(localized('تم تجهيز هيكل السيناريو المقترح', 'Le plan du script est prêt', 'Suggested script outline is ready'), 'success');
      }
    } catch {
      const fallbackScript = localized(
        `[توليد المنصة التلقائي]\n1. الهوك الافتتاحي (0-3 ثوان): ${formData.hook || formData.title}\n2. المفارقة وتحليل المشكلة (4-15 ثانية)\n3. الخطوات العملية الثلاث مع نموذج تطبيقي (16-45 ثانية)\n4. الدعوة للتفاعل وحفظ المنشور`,
        `[Génération automatique]\n1. Accroche (0-3 s) : ${formData.hook || formData.title}\n2. Problème et analyse (4-15 s)\n3. Trois étapes pratiques avec exemple (16-45 s)\n4. Appel à l’action`,
        `[Auto-generated outline]\n1. Opening hook (0-3 sec): ${formData.hook || formData.title}\n2. Frame and analyze the problem (4-15 sec)\n3. Three practical steps with an example (16-45 sec)\n4. Call to action`
      );
      setFormData(prev => ({ ...prev, notes: fallbackScript }));
      showToast(localized('تم تجهيز هيكل السيناريو المقترح', 'Le plan du script est prêt', 'Suggested script outline is ready'), 'success');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title?.trim()) {
      showToast(t.calendar.itemTitle + ' ' + t.common.error, 'error');
      return;
    }
    // If user leaves script outline empty, platform provides structured default automatically
    const finalData = {
      ...formData,
      notes: formData.notes?.trim() || localized(
        `[سيناريو معتمد من المنصة]\n• الموضوع: ${formData.title}\n• الهوك: ${formData.hook || 'هوك جذاب مباشر'}\n• الهيكل: تفكيك الفكرة في 3 محاور متسلسلة\n• الدعوة للإجراء: حفظ المنشور ومشاركة الرأي`,
        `[Script préparé par la plateforme]\n• Sujet : ${formData.title}\n• Accroche : ${formData.hook || 'Accroche directe'}\n• Plan : trois idées successives\n• Appel à l’action : enregistrer et partager son avis`,
        `[Platform-prepared script]\n• Topic: ${formData.title}\n• Hook: ${formData.hook || 'A clear opening hook'}\n• Outline: develop the idea in three steps\n• Call to action: save the post and share an opinion`
      )
    };
    try {
      await saveCalendarItem(finalData);
      closeEditor();
    } catch {
      return;
    }
  };

  const handleSaveToLibrary = async () => {
    if (!formData.title?.trim()) return;
    await saveLibraryItem({
      title: formData.title,
      type: 'script',
      content: `[الهوك]: ${formData.hook || ''}\n\n[ملاحظات والسيناريو]:\n${formData.notes || ''}`,
      tags: [formData.platform || 'Instagram', formData.format || 'Reels', formData.pillar || 'Content']
    });
    showToast(t.common.saved, 'success');
  };

  const handleCopy = () => {
    const textToCopy = `العنوان: ${formData.title}\nالمنصة: ${formData.platform} (${formData.format})\nالركيزة: ${formData.pillar}\n\nالهوك (Hook):\n${formData.hook}\n\nالسيناريو / التفاصيل:\n${formData.notes}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast(t.common.copied, 'success');
  };

  const statusOptions: ContentStatus[] = ['proposed', 'draft', 'approved', 'scheduled', 'published', 'dismissed'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white text-[#0E1633] rounded-xl border border-slate-200 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F2F4FA]">
          <div>
            <h3 className="text-base font-bold text-[#0E1633]">
              {editingItem?.id ? t.common.edit : t.calendar.createItem}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.decisionBoard.whyRecommended}
            </p>
          </div>
          <button
            onClick={closeEditor}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.calendar.itemTitle}
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={localized('مثال: ريلز تحليلي: لماذا يفشل معظم المدربين في تسعير خدماتهم؟', 'Ex. : Analyse en vidéo : pourquoi les formateurs sous-évaluent-ils leurs services ?', 'e.g., An analysis reel: Why do so many coaches underprice their services?')}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E] focus:border-transparent font-medium"
            />
          </div>

          {/* Grid row: Platform, Format, Horizon, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.calendar.platform}
              </label>
              <select
                value={formData.platform || 'Instagram'}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E]"
              >
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="X">X (Twitter)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.common.format}
              </label>
              <select
                value={formData.format || 'Reels'}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E]"
              >
                <option value="Reels">Reels / Shorts (45-60s)</option>
                <option value="Carousel">Carousel (Slides)</option>
                <option value="Stories">Interactive Stories</option>
                <option value="Post">Standard Post + Caption</option>
                <option value="Live">Live Stream</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.common.status}
              </label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E] font-medium"
              >
                {statusOptions.map(st => (
                  <option key={st} value={st}>
                    {t.common[st as keyof typeof t.common] || st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {localized('نطاق الخطة', 'Période du plan', 'Plan horizon')}
              </label>
              <select
                value={formData.horizon || '48h'}
                onChange={(e) => setFormData({ ...formData, horizon: e.target.value as '48h' | '7d' })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E]"
              >
                <option value="48h">{t.common.hours48}</option>
                <option value="7d">{t.common.days7}</option>
              </select>
            </div>
          </div>

          {/* Time & Pillar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.calendar.scheduledTime}
              </label>
              <input
                type="datetime-local"
                value={formData.time || ''}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E] font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.brandStudio.contentPillars}
              </label>
              <select
                value={formData.pillar || brand?.pillars?.[0]?.name || 'Authority'}
                onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E]"
              >
                {brand?.pillars?.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                )) || <option value="Authority">Authority</option>}
              </select>
            </div>
          </div>

          {/* Opening Hook */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.common.hook}
            </label>
            <input
              type="text"
              value={formData.hook || ''}
              onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
              placeholder={localized('مثال: إذا بدأت الفيديو بمقدمة طويلة فقد خسرت 70% من المشاهدين...', 'Ex. : Une longue introduction peut faire partir 70 % des spectateurs…', 'e.g., A long intro may cause 70% of viewers to leave…')}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E]"
            />
          </div>

          {/* Script Body / Outline (Optional - Automatically handled by the platform) */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-bold text-slate-700">
                {t.common.outline} / {localized('تفاصيل السيناريو', 'Détails du script', 'Script details')}{' '}
                <span className="text-slate-400 font-normal">
                  ({localized('اختياري — تتولى المنصة توليده', 'facultatif — génération automatique', 'optional — generated automatically')})
                </span>
              </label>

              <button
                type="button"
                onClick={handleAutoGenerateScript}
                disabled={isGeneratingScript}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-[#0E1633] bg-[#7BE0C3] hover:bg-[#68d1b3] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isGeneratingScript ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{localized('جاري التوليد...', 'Génération...', 'Generating...')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-[#0E1633]" />
                    <span>{localized('توليد بالذكاء الاصطناعي', 'Générer avec l’IA', 'Generate with AI')}</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={4}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={localized(
                'اختياري: يمكنك ترك هذا الحقل فارغاً حيث تقوم المنصة بصياغة السيناريو والهيكل تلقائياً عند حفظ الفكرة، أو يمكنك كتابة ملاحظاتك ونقاطك الخاصة هنا...',
                'Facultatif : laissez ce champ vide pour générer un script automatiquement, ou saisissez vos notes et vos idées.',
                'Optional: leave this blank to generate an outline when saving, or add your own notes and key points.'
              )}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A6E] font-sans"
            />
            <p className="text-[11px] text-slate-400">
              {localized(
                '💡 معلومة: المنصة تتكفل بصياغة الهيكل والأفكار المتسلسلة تلقائياً بناءً على العنوان والهوك المختار.',
                '💡 Le plan est généré automatiquement à partir du titre et de l’accroche.',
                '💡 The outline is generated from the title and selected hook.'
              )}
            </p>
          </div>

          {/* Safety & Human Approval Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg flex items-start gap-2 text-xs text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{t.calendar.publishSafeNotice}</strong>{' '}
              {localized(
                'لن يُنشر أي محتوى بشكل آلي أبداً دون موافقتك الصريحة وفحص جودة السيناريو وملاءمته لقيم البراند.',
                'Aucun contenu ne sera publié automatiquement sans votre accord explicite et une vérification de sa qualité.',
                'Content is never published automatically without your explicit approval and a quality review.'
              )}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? t.common.copied : t.common.copy}</span>
            </button>
            <button
              onClick={handleSaveToLibrary}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>{localized('حفظ في المكتبة', 'Enregistrer dans la bibliothèque', 'Save to library')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeEditor}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.common.save}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
