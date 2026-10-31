import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  Lightbulb, 
  UserCheck, 
  Compass, 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  Plus, 
  BookmarkPlus,
  Loader2,
  Film,
  Layers,
  FileText
} from 'lucide-react';

export const QuickGeneratorModal: React.FC = () => {
  const { 
    isGeneratorOpen, 
    closeGenerator, 
    generatorInitialTool, 
    brand, 
    language,
    user,
    token,
    t, 
    saveBrandProfile,
    saveCalendarItem, 
    saveLibraryItem, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(
    generatorInitialTool === 'digital_product' ? 'ideas' : (generatorInitialTool || 'ideas')
  );
  
  // Set dialect according to current header language by default
  const defaultDialect = language === 'en' ? 'en' : language === 'fr' ? 'fr' : 'ar_standard';
  const [selectedDialect, setSelectedDialect] = useState<string>(defaultDialect);
  const [selectedFormat, setSelectedFormat] = useState<'reel' | 'carousel' | 'post'>('reel');
  const [customFocus, setCustomFocus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const getGenerationErrorMessage = (code?: string, fallback?: string) => {
    if (code === 'GEMINI_QUOTA_EXCEEDED') return t.generator.geminiQuotaError;
    if (code === 'GEMINI_RATE_LIMITED') return t.generator.geminiRateLimitError;
    if (code === 'GEMINI_NOT_CONFIGURED') return t.generator.geminiConfigurationError;
    if (code === 'GEMINI_INVALID_RESPONSE') return t.generator.geminiInvalidResponseError;
    if (code === 'GEMINI_UNAVAILABLE') return t.generator.geminiUnavailableError;
    return fallback || t.common.error;
  };

  // Sync default dialect when language changes or modal opens
  useEffect(() => {
    if (isGeneratorOpen) {
      setSelectedDialect(language === 'en' ? 'en' : language === 'fr' ? 'fr' : 'ar_standard');
      if (generatorInitialTool && generatorInitialTool !== 'digital_product') {
        setActiveTab(generatorInitialTool);
      }
    }
  }, [isGeneratorOpen, language, generatorInitialTool]);

  if (!isGeneratorOpen) return null;

  // Digital Product is removed as requested by user
  const tools = [
    { id: 'ideas', label: t.dashboard.generateIdeas, icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'bio', label: t.dashboard.generateBio, icon: <UserCheck className="w-4 h-4" /> },
    { id: 'strategy', label: t.dashboard.generateStrategy, icon: <Compass className="w-4 h-4" /> },
    { id: 'plan_48h', label: t.common.hours48, icon: <Clock className="w-4 h-4" /> },
    { id: 'plan_7d', label: t.common.days7, icon: <Calendar className="w-4 h-4" /> },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedResult(null);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-language': language
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tool: activeTab,
          dialect: selectedDialect,
          format: selectedFormat,
          customPrompt: activeTab === 'bio' ? '' : customFocus,
          language: selectedDialect || language,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setGeneratedResult(data.data);
      } else {
        const retryAt = typeof data.retryAt === 'string'
          ? ` ${language === 'fr' ? 'Nouvel essai vers' : language === 'ar' ? 'إعادة المحاولة تقريباً في' : 'Retry around'} ${new Date(data.retryAt).toLocaleString(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-DZ' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })}.`
          : '';
        showToast(`${getGenerationErrorMessage(data.code, data.error)}${retryAt}`, 'error');
      }
    } catch {
      showToast(t.common.error, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(t.common.copied, 'success');
  };

  const handleAddToCalendar = async (item: any, silent = false): Promise<boolean> => {
    const notes = [
      item.topic && `${t.common.outline}: ${item.topic}`,
      item.audienceProblem && `${t.generator.strategyAudienceProblems}: ${item.audienceProblem}`,
      item.objective && `${t.common.rationale}: ${item.objective}`,
      item.mainMessage,
      item.caption,
      item.cta && `${t.common.cta}: ${item.cta}`,
      Array.isArray(item.preparationTasks) && `${t.generator.requiredAction} ${item.preparationTasks.join('; ')}`,
      item.rationale && `${t.common.rationale}: ${item.rationale}`,
      Array.isArray(item.evidenceReferences) && item.evidenceReferences.length > 0 &&
        `${t.common.source}: ${item.evidenceReferences.join(', ')}`,
      item.script || item.actionNeeded
    ].filter(Boolean).join('\n\n');
    try {
      await saveCalendarItem({
        title: item.title,
        platform: item.platform || 'Instagram',
        format: item.format || (selectedFormat === 'carousel' ? 'Carousel' : selectedFormat === 'post' ? 'Post' : 'Reels'),
        pillar: item.pillar || brand?.pillars?.[0]?.name || 'Authority',
        horizon: activeTab === 'plan_48h' ? '48h' : '7d',
        time: item.date || item.scheduledAt || new Date().toISOString(),
        status: 'draft',
        hook: item.hook || '',
        notes
      }, true);
      if (!silent) showToast(t.decisionBoard.addToCalendar + ' ✓', 'success');
      return true;
    } catch (error) {
      showToast(error instanceof Error ? error.message : t.common.error, 'error');
      return false;
    }
  };

  const saveStrategyPillars = async () => {
    if (!brand || !Array.isArray(generatedResult?.pillars) || generatedResult.pillars.length !== 4) {
      showToast(t.common.error, 'error');
      return;
    }
    if (
      generatedResult.pillars.reduce((sum: number, pillar: any) => sum + Number(pillar.percentage || 0), 0) !== 100 ||
      generatedResult.pillars.some((pillar: any) =>
        !String(pillar.name || '').trim() ||
        !String(pillar.description || pillar.objective || '').trim() ||
        !Array.isArray(pillar.audienceProblems) || pillar.audienceProblems.length < 3 ||
        !Array.isArray(pillar.contentThemes) || pillar.contentThemes.length < 3 ||
        !Array.isArray(pillar.exampleTopics) || pillar.exampleTopics.length < 5 ||
        pillar.exampleTopics.some((topic: unknown) => typeof topic !== 'string' || !topic.trim())
      )
    ) {
      showToast(t.common.error, 'error');
      return;
    }

    await saveBrandProfile({
      ...brand,
      pillars: generatedResult.pillars.map((pillar: any, index: number) => ({
        id: brand.pillars?.[index]?.id || `pillar-${index + 1}`,
        name: String(pillar.name || '').trim(),
        desc: [
          `Strategic role: ${pillar.strategicRole || ''}`,
          `Allocation: ${pillar.percentage}%`,
          `Objective: ${pillar.description || pillar.objective || ''}`,
          `Audience problems: ${(Array.isArray(pillar.audienceProblems) ? pillar.audienceProblems : []).join(' | ')}`,
          `Content themes: ${(Array.isArray(pillar.contentThemes) ? pillar.contentThemes : []).join(' | ')}`,
          `Example topics: ${(Array.isArray(pillar.exampleTopics) ? pillar.exampleTopics : []).join(' | ')}`,
          `Recommended formats: ${(Array.isArray(pillar.recommendedFormats) ? pillar.recommendedFormats : []).join(' | ')}`,
          `Offer connection: ${pillar.offerConnection || ''}`,
          `CTA types: ${(Array.isArray(pillar.ctaTypes) ? pillar.ctaTypes : []).join(' | ')}`,
          `Rationale: ${pillar.whyItMatters || ''}`,
        ].filter(Boolean).join('\n')
      }))
    });
  };

  const updateIdea = (index: number, field: string, value: string) => {
    setGeneratedResult((current: any) => ({
      ...current,
      ideas: current.ideas.map((idea: any, ideaIndex: number) =>
        ideaIndex === index ? { ...idea, [field]: value } : idea
      )
    }));
  };

  const updateIdeaSlide = (ideaIndex: number, slideIndex: number, field: 'title' | 'body', value: string) => {
    setGeneratedResult((current: any) => ({
      ...current,
      ideas: current.ideas.map((idea: any, index: number) => {
        if (index !== ideaIndex) return idea;
        const slides = idea.slides.map((slide: any, index: number) =>
          index === slideIndex ? { ...slide, [field]: value } : slide
        );
        const slideLabel = selectedDialect === 'fr'
          ? 'Diapositive'
          : selectedDialect === 'ar_standard'
          ? 'الشريحة'
          : 'Slide';
        return {
          ...idea,
          slides,
          script: slides.map((slide: any, index: number) =>
            `${slideLabel} ${index + 1} — ${slide.title}: ${slide.body}`
          ).join('\n\n'),
        };
      })
    }));
  };

  const updateBio = (index: number, field: string, value: string) => {
    setGeneratedResult((current: any) => ({
      ...current,
      options: current.options.map((option: any, optionIndex: number) =>
        optionIndex === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const updatePlanItem = (index: number, field: string, value: string) => {
    setGeneratedResult((current: any) => ({
      ...current,
      plan: current.plan.map((item: any, itemIndex: number) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updatePlanTask = (itemIndex: number, taskIndex: number, value: string) => {
    setGeneratedResult((current: any) => ({
      ...current,
      plan: current.plan.map((item: any, index: number) => index === itemIndex
        ? {
            ...item,
            preparationTasks: item.preparationTasks.map((task: string, index: number) =>
              index === taskIndex ? value : task
            ).filter((task: string) => task.trim()),
            actionNeeded: item.preparationTasks.map((task: string, index: number) =>
              index === taskIndex ? value : task
            ).filter((task: string) => task.trim()).join('; ')
          }
        : item)
    }));
  };

  const updatePillar = (index: number, field: 'name' | 'objective' | 'percentage', value: string) => {
    setGeneratedResult((current: any) => ({
      ...current,
      pillars: current.pillars.map((pillar: any, pillarIndex: number) =>
        pillarIndex === index
          ? {
              ...pillar,
              [field]: field === 'percentage' ? Number(value) : value,
              ...(field === 'objective' ? { description: value } : {})
            }
          : pillar
      )
    }));
  };

  const updatePillarTopic = (pillarIndex: number, topicIndex: number, value: string) => {
    setGeneratedResult((current: any) => ({
      ...current,
      pillars: current.pillars.map((pillar: any, index: number) => index === pillarIndex
        ? {
            ...pillar,
            exampleTopics: pillar.exampleTopics.map((topic: string, index: number) =>
              index === topicIndex ? value : topic
            )
          }
        : pillar)
    }));
  };

  const handleSaveToLibrary = async (title: string, type: any, content: string) => {
    await saveLibraryItem({
      title,
      type,
      content,
      tags: [activeTab, (brand?.niche || 'Strategy').substring(0, 20)]
    }, true);
    showToast(t.common.saved, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white text-[#0E1633] rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#0E1633] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A6E] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {t.generator.modalTitle}
              </h2>
              <p className="text-xs text-slate-300">
                {brand?.name ? brand.name.split('—')[0].trim() : 'Creator Studio'} · {(brand?.niche || 'Strategy & Content').substring(0, 45)}...
              </p>
            </div>
          </div>
          <button
            onClick={closeGenerator}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Tabs Bar */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-slate-200 bg-[#F2F4FA] overflow-x-auto">
          {tools.map((tl) => (
            <button
              key={tl.id}
              onClick={() => {
                setActiveTab(tl.id);
                setGeneratedResult(null);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tl.id
                  ? 'bg-[#FF5A6E] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tl.icon}
              <span>{tl.label}</span>
            </button>
          ))}
        </div>

        {/* Config Strip */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Dialect / Output Language Selector */}
          <div className={activeTab === 'bio' ? 'sm:col-span-8' : activeTab === 'ideas' ? 'sm:col-span-4' : 'sm:col-span-4'}>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              {t.brandStudio.contentLanguage}
            </label>
            <select
              value={selectedDialect}
              onChange={(e) => setSelectedDialect(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
            >
              <option value="en">English (International)</option>
              <option value="fr">Français (Français Pro)</option>
              <option value="ar_standard">عربية فصحى معاصرة (MSA)</option>
              <option value="ar_algerian">دارجة جزائرية معاصرة (Algerian Darija)</option>
            </select>
          </div>

          {/* Format Selector for Ideas/Scripts (Reel / Carousel / Post) */}
          {activeTab === 'ideas' && (
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {t.generator.formatLabel}
              </label>
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('reel')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    selectedFormat === 'reel' 
                      ? 'bg-white text-[#FF5A6E] shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>{t.generator.formatReel}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('carousel')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    selectedFormat === 'carousel' 
                      ? 'bg-white text-[#FF5A6E] shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{t.generator.formatCarousel}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('post')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    selectedFormat === 'post' 
                      ? 'bg-white text-[#FF5A6E] shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>{t.generator.formatPost}</span>
                </button>
              </div>
            </div>
          )}

          {/* Custom Focus Topic - REMOVED for bio, available for ideas/strategy */}
          {activeTab !== 'bio' && (
            <div className={activeTab === 'ideas' ? 'sm:col-span-4' : 'sm:col-span-8'}>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    {t.generator.customTopic}
                  </label>
                  <input
                    type="text"
                    value={customFocus}
                    onChange={(e) => setCustomFocus(e.target.value)}
                    placeholder={t.generator.customTopicPlaceholder}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-md transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7BE0C3]" />
                      <span>{t.common.loading}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#7BE0C3]" />
                      <span>{t.generator.generateBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* For bio, generate button sits neatly next to dialect */}
          {activeTab === 'bio' && (
            <div className="sm:col-span-4 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-1.5 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-md transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7BE0C3]" />
                    <span>{t.common.loading}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#7BE0C3]" />
                    <span>{t.generator.generateBtn}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {!generatedResult && !isLoading && (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-200/80 flex items-center justify-center mx-auto text-slate-500 mb-3">
                <Sparkles className="w-6 h-6 text-[#FF5A6E]" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                {t.generator.readyTitle}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {t.generator.readyDesc}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF5A6E] mx-auto" />
              <p className="text-xs font-medium text-slate-600">
                {t.generator.generating}
              </p>
            </div>
          )}

          {/* Results: Ideas */}
          {generatedResult?.ideas && (
            <div className="space-y-4">
              {generatedResult.ideas.map((idea: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-[#FF5A6E]">
                        {idea.pillar || 'Authority'} · {idea.format}
                      </span>
                      <input
                        value={idea.title}
                        onChange={(event) => updateIdea(idx, 'title', event.target.value)}
                        aria-label={`Idea ${idx + 1} title`}
                        className="w-full text-sm font-bold text-[#0E1633] mt-0.5 border-b border-transparent focus:border-slate-300 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(`idea-${idx}`, `${idea.title}\n\n${t.common.hook}:\n${idea.hook}\n\n${t.generator.ideaMainMessage}:\n${idea.mainMessage || ''}\n\n${t.common.outline}:\n${idea.script}\n\n${t.generator.ideaVisualConcept}:\n${idea.visualConcept || ''}\n${t.generator.ideaOnScreenText}:\n${idea.onScreenText || ''}\n\n${t.common.caption}:\n${idea.caption}\n\n${t.common.cta}:\n${idea.cta}\n\n${(idea.hashtags || []).join(' ')}\n\n${idea.rationale || ''}`)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                        title={t.common.copy}
                      >
                        {copiedId === `idea-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleSaveToLibrary(idea.title, 'script', `${idea.hook}\n\n${idea.mainMessage || ''}\n\n${idea.script}\n\n${idea.visualConcept || ''}\n${idea.onScreenText || ''}\n\n${idea.caption}\n\n${idea.cta}\n\n${(idea.hashtags || []).join(' ')}\n\n${idea.rationale || ''}`)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                        title={t.generator.saveToLibrary}
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAddToCalendar(idea)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-md transition-colors"
                      >
                        <Plus className="w-3 h-3 text-[#7BE0C3]" />
                        <span>{t.decisionBoard.addToCalendar}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg space-y-2 text-xs">
                    {idea.audienceProblem && (
                      <p className="text-slate-500">{idea.audienceProblem}</p>
                    )}
                    {idea.contentObjective && (
                      <p className="text-slate-500">{idea.contentObjective}</p>
                    )}
                    {selectedFormat === 'post' && (
                      <div className="space-y-2">
                        {idea.mainMessage && (
                          <label className="block font-semibold text-slate-700">
                            {t.generator.ideaMainMessage}
                            <textarea
                              value={idea.mainMessage}
                              onChange={(event) => updateIdea(idx, 'mainMessage', event.target.value)}
                              rows={3}
                              className="mt-1 w-full resize-y rounded-md border border-slate-200 p-2 font-normal text-slate-700"
                            />
                          </label>
                        )}
                        {idea.visualConcept && <p className="text-slate-600"><strong>{t.generator.ideaVisualConcept}:</strong> {idea.visualConcept}</p>}
                        {idea.onScreenText && <p className="text-slate-600"><strong>{t.generator.ideaOnScreenText}:</strong> {idea.onScreenText}</p>}
                      </div>
                    )}
                    {selectedFormat === 'carousel' && Array.isArray(idea.slides) && (
                      <details className="rounded-md border border-slate-200 p-2">
                        <summary className="cursor-pointer font-semibold text-slate-700">{t.generator.ideaSlides} ({idea.slides.length})</summary>
                        <div className="mt-2 space-y-2">
                          {idea.slides.map((slide: any, slideIndex: number) => (
                            <div key={slideIndex} className="rounded border border-slate-100 p-2">
                              <input
                                value={slide.title || ''}
                                onChange={(event) => updateIdeaSlide(idx, slideIndex, 'title', event.target.value)}
                                aria-label={`Idea ${idx + 1} slide ${slideIndex + 1} title`}
                                className="w-full border-b border-slate-200 font-semibold text-slate-700"
                              />
                              <textarea
                                value={slide.body || ''}
                                onChange={(event) => updateIdeaSlide(idx, slideIndex, 'body', event.target.value)}
                                aria-label={`Idea ${idx + 1} slide ${slideIndex + 1} content`}
                                rows={2}
                                className="mt-1 w-full resize-y text-slate-600"
                              />
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                    <div>
                      <strong className="text-slate-700 block mb-0.5">{t.common.hook}:</strong>
                      <textarea
                        value={idea.hook || ''}
                        onChange={(event) => updateIdea(idx, 'hook', event.target.value)}
                        aria-label={`Idea ${idx + 1} hook`}
                        rows={2}
                        className="w-full resize-y text-slate-800 font-medium bg-transparent border border-slate-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </div>
                    <div>
                      <strong className="text-slate-700 block mb-0.5">{t.common.outline}:</strong>
                      <textarea
                        value={idea.script || ''}
                        onChange={(event) => updateIdea(idx, 'script', event.target.value)}
                        aria-label={`Idea ${idx + 1} script`}
                        rows={7}
                        className="w-full resize-y text-slate-600 whitespace-pre-line leading-relaxed bg-transparent border border-slate-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </div>
                    <div>
                      <strong className="text-slate-700 block mb-0.5">{t.common.caption}:</strong>
                      <textarea
                        value={idea.caption || ''}
                        onChange={(event) => updateIdea(idx, 'caption', event.target.value)}
                        aria-label={`Idea ${idx + 1} caption`}
                        rows={3}
                        className="w-full resize-y text-slate-600 bg-transparent border border-slate-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </div>
                    <div>
                      <strong className="text-slate-700 block mb-0.5">{t.common.cta}:</strong>
                      <textarea
                        value={idea.cta || ''}
                        onChange={(event) => updateIdea(idx, 'cta', event.target.value)}
                        aria-label={`Idea ${idx + 1} CTA`}
                        rows={2}
                        className="w-full resize-y text-slate-800 bg-transparent border border-slate-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </div>
                    {Array.isArray(idea.hashtags) && (
                      <p className="text-slate-600">{idea.hashtags.join(' ')}</p>
                    )}
                    {idea.rationale && (
                      <p className="text-slate-500">{idea.rationale}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results: Bio */}
          {generatedResult?.options && (
            <div className="space-y-4">
              {generatedResult.options.map((opt: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF5A6E]">{opt.style}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopy(`bio-${idx}`, opt.text)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                        title={t.common.copy}
                      >
                        {copiedId === `bio-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleSaveToLibrary(`Bio: ${opt.style}`, 'bio', opt.text)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
                        title={t.generator.saveToLibrary}
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-slate-600">
                    <label className="block">
                      <strong>{t.generator.bioPositioning}:</strong>
                      <input
                        value={opt.positioningAngle || ''}
                        onChange={(event) => updateBio(idx, 'positioningAngle', event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </label>
                    <label className="block">
                      <strong>{t.brandStudio.targetAudience}:</strong>
                      <input
                        value={opt.targetAudience || ''}
                        onChange={(event) => updateBio(idx, 'targetAudience', event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </label>
                    <label className="block">
                      <strong>{t.generator.bioValueProposition}:</strong>
                      <input
                        value={opt.valueProposition || ''}
                        onChange={(event) => updateBio(idx, 'valueProposition', event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </label>
                    <label className="block">
                      <strong>{t.common.cta}:</strong>
                      <input
                        value={opt.cta || ''}
                        onChange={(event) => updateBio(idx, 'cta', event.target.value)}
                        className="mt-1 w-full rounded-md border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </label>
                  </div>
                  <label className="block text-[11px] font-semibold text-slate-600">
                    {t.generator.bioText}
                    <textarea
                      value={opt.text || ''}
                      onChange={(event) => updateBio(idx, 'text', event.target.value)}
                      aria-label={`Bio ${idx + 1}`}
                      maxLength={150}
                      rows={4}
                      className="mt-1 w-full resize-y rounded-md border border-slate-200 p-2 text-xs font-sans font-normal text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                    />
                    <span className="font-normal text-slate-400">
                      Instagram · {Array.from(opt.text || '').length}/{opt.platformCharacterLimit || 150}
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-500 italic">
                    {t.generator.whyItWorks} {opt.whyItWorks}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Results: Strategy */}
          {generatedResult?.pillars && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={saveStrategyPillars}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-md transition-colors"
                >
                  {t.generator.savePillars}
                </button>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                <strong className="text-[#0E1633] block mb-1">{t.common.rationale}:</strong>
                {generatedResult.strategicSummary}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedResult.pillars.map((pil: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        value={pil.name || ''}
                        onChange={(event) => updatePillar(idx, 'name', event.target.value)}
                        aria-label={`Pillar ${idx + 1} name`}
                        className="w-full max-w-[75%] text-xs font-bold text-[#0E1633] border-b border-transparent focus:border-slate-300 focus:outline-none"
                      />
                      <label className="flex items-center gap-1 text-xs font-mono font-bold text-[#FF5A6E]">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={pil.percentage ?? ''}
                          onChange={(event) => updatePillar(idx, 'percentage', event.target.value)}
                          aria-label={`Pillar ${idx + 1} allocation percentage`}
                          className="w-12 bg-transparent text-right focus:outline-none"
                        />
                        %
                      </label>
                    </div>
                    <textarea
                      value={pil.description || pil.objective || ''}
                      onChange={(event) => updatePillar(idx, 'objective', event.target.value)}
                      aria-label={`Pillar ${idx + 1} description`}
                      rows={3}
                      className="w-full resize-y text-xs text-slate-600 border border-slate-200 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                    />
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <strong>{t.generator.strategyAudienceProblems}:</strong>
                      {Array.isArray(pil.audienceProblems) && pil.audienceProblems.some((problem: string) => problem.trim()) && (
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                        {pil.audienceProblems.filter((problem: string) => problem.trim()).map((problem: string, i: number) => (
                          <li key={`problem-${i}`}>{problem}</li>
                        ))}
                        </ul>
                      )}
                      <strong className="mt-2 block">{t.generator.strategyThemes}:</strong>
                      <p className="mt-1">{(pil.contentThemes || []).join(' · ')}</p>
                      <strong className="mt-2 block">{t.generator.strategyTopics}:</strong>
                      {Array.isArray(pil.exampleTopics) && pil.exampleTopics.some((topic: string) => topic.trim()) && (
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                        {pil.exampleTopics?.filter((topic: string) => topic.trim()).map((top: string, i: number) => (
                          <li key={i}>
                            <input
                              value={top}
                              onChange={(event) => updatePillarTopic(idx, i, event.target.value)}
                              aria-label={`Pillar ${idx + 1} topic ${i + 1}`}
                              className="w-[90%] border-b border-transparent focus:border-slate-300 focus:outline-none"
                            />
                          </li>
                        ))}
                        </ul>
                      )}
                      <strong className="mt-2 block">{t.generator.strategyFormats}:</strong>
                      <p className="mt-1">{(pil.recommendedFormats || []).join(' · ') || pil.recommendedFormat}</p>
                      <strong className="mt-2 block">{t.generator.strategyOffer}:</strong>
                      <p className="mt-1">{pil.offerConnection}</p>
                      <strong className="mt-2 block">{t.generator.strategyCtas}:</strong>
                      <p className="mt-1">{(pil.ctaTypes || []).join(' · ')}</p>
                      <strong className="mt-2 block">{t.generator.strategyWhy}:</strong>
                      <p className="mt-1">{pil.whyItMatters}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results: Plans (48h or 7d) */}
          {generatedResult?.plan && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-700">
                  {t.generator.itemsProposed} ({generatedResult.plan.length})
                </span>
                <button
                  onClick={async () => {
                    for (const item of generatedResult.plan) {
                      if (!await handleAddToCalendar(item, true)) return;
                    }
                    showToast(t.generator.addAllToCalendar + ' ✓', 'success');
                  }}
                  className="px-3 py-1 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-md transition-colors cursor-pointer"
                >
                  {t.generator.addAllToCalendar}
                </button>
              </div>
              {generatedResult.plan.map((pItem: any, idx: number) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-bold text-[#FF5A6E]">{pItem.day}</span>
                      {pItem.time && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{pItem.time}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{pItem.platform} ({pItem.format})</span>
                    </div>
                    <input
                      value={pItem.title || ''}
                      onChange={(event) => updatePlanItem(idx, 'title', event.target.value)}
                      aria-label={`Plan item ${idx + 1} title`}
                      className="w-full text-xs font-bold text-[#0E1633] border-b border-transparent focus:border-slate-300 focus:outline-none"
                    />
                    {pItem.audienceProblem && <p className="text-xs text-slate-600">{pItem.audienceProblem}</p>}
                    {pItem.objective && <p className="text-xs text-slate-500">{pItem.objective}</p>}
                    <label className="block text-[11px] font-semibold text-slate-600">
                      {t.common.hook}
                      <textarea
                        value={pItem.hook || ''}
                        onChange={(event) => updatePlanItem(idx, 'hook', event.target.value)}
                        aria-label={`Plan item ${idx + 1} hook`}
                        rows={2}
                        className="mt-1 w-full resize-y rounded-md border border-slate-200 p-2 text-xs font-normal text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </label>
                    <label className="block text-[11px] font-semibold text-slate-600">
                      {t.common.outline}
                      <textarea
                        value={pItem.mainMessage || ''}
                        onChange={(event) => updatePlanItem(idx, 'mainMessage', event.target.value)}
                        aria-label={`Plan item ${idx + 1} main message`}
                        rows={3}
                        className="mt-1 w-full resize-y rounded-md border border-slate-200 p-2 text-xs font-normal text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </label>
                    <label className="block text-[11px] font-semibold text-slate-600">
                      {t.common.caption}
                      <textarea
                        value={pItem.caption || ''}
                        onChange={(event) => updatePlanItem(idx, 'caption', event.target.value)}
                        aria-label={`Plan item ${idx + 1} caption`}
                        rows={3}
                        className="mt-1 w-full resize-y rounded-md border border-slate-200 p-2 text-xs font-normal text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </label>
                    <label className="block text-[11px] font-semibold text-slate-600">
                      {t.common.cta}
                      <textarea
                        value={pItem.cta || ''}
                        onChange={(event) => updatePlanItem(idx, 'cta', event.target.value)}
                        aria-label={`Plan item ${idx + 1} call to action`}
                        rows={2}
                        className="mt-1 w-full resize-y rounded-md border border-slate-200 p-2 text-xs font-normal text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                      />
                    </label>
                    {Array.isArray(pItem.preparationTasks) && (
                      <div className="text-[11px] text-slate-500">
                        <strong>{t.generator.requiredAction}</strong>
                        <ul className="list-disc list-inside">
                        {pItem.preparationTasks.map((task: string, taskIndex: number) => (
                          <li key={taskIndex}>
                            <input
                              value={task}
                              onChange={(event) => updatePlanTask(idx, taskIndex, event.target.value)}
                              aria-label={`Plan item ${idx + 1} preparation task ${taskIndex + 1}`}
                              className="w-[90%] border-b border-transparent bg-transparent focus:border-slate-300 focus:outline-none"
                            />
                          </li>
                        ))}
                      </ul>
                      </div>
                    )}
                    {pItem.rationale && <p className="text-[11px] text-slate-500">{pItem.rationale}</p>}
                  </div>
                  <button
                    onClick={() => handleAddToCalendar(pItem)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors shrink-0"
                    title={t.decisionBoard.addToCalendar}
                  >
                    <Plus className="w-4 h-4 text-[#FF5A6E]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
