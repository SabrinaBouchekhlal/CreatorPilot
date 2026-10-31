import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandProfile, BrandPillar } from '../../types';
import { 
  Palette, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const createDefaultBrand = (language: string): BrandProfile => {
  const isEn = language === 'en';
  const isFr = language === 'fr';

  const defaultPillars: BrandPillar[] = isEn ? [
    { id: 'p1', name: 'Authority & Proof', desc: 'Case studies, data benchmarks, and strategic framework breakdowns' },
    { id: 'p2', name: 'Empathy & Mindset', desc: 'Creator fatigue, authentic positioning, and overcoming imposter syndrome' },
    { id: 'p3', name: 'Conversion & Value', desc: 'Packaging high-ticket advisory offers and sustainable audience monetization' },
    { id: 'p4', name: 'Action & Systems', desc: 'Step-by-step pre-publishing checklists and actionable workflows' }
  ] : isFr ? [
    { id: 'p1', name: 'Autorité & Preuve', desc: 'Analyses approfondies, décryptages et études de cas' },
    { id: 'p2', name: 'Empathie & Lien', desc: 'Transparence sur les défis et le quotidien du créateur' },
    { id: 'p3', name: 'Conversion & Valeur', desc: 'Structuration des offres et rentabilité' },
    { id: 'p4', name: 'Action & Systèmes', desc: 'Guides pratiques et victoires rapides' }
  ] : [
    { id: 'p1', name: 'سلطة المعرفة (Authority)', desc: 'تحليلات عميقة، دراسات حالة موثقة، وفك شفرة الخوارزميات' },
    { id: 'p2', name: 'التعاطف والتواصل (Empathy)', desc: 'تحديات صناع المحتوى اليومية، التغلب على متلازمة المحتال وإرهاق النشر' },
    { id: 'p3', name: 'التحويل والقيمة (Conversion)', desc: 'كيف تبني منتجاً رقمياً مطلوباً، تسعير الاستشارات، وهندسة الإطلاق' },
    { id: 'p4', name: 'التنفيذ والإجراء (Action)', desc: 'قوالب جاهزة، خطوات عملية مباشرة، وتطبيقات فورية' }
  ];

  return {
    id: '',
    name: '',
    niche: '',
    targetAudience: '',
    voiceTone: isEn ? 'Direct, evidence-backed, analytical, actionable' : isFr ? 'Direct, pédagogique, analytique, orienté résultats' : 'مباشر، علمي، تحليلي، محفز ومبني على الأرقام الحقيقية',
    primaryOffer: '',
    contentLanguage: isEn ? 'en' : isFr ? 'fr' : 'ar_standard',
    contentDialect: isEn ? 'en' : isFr ? 'fr' : 'ar_standard',
    constraints: '',
    pillars: defaultPillars
  };
};

export const BrandStudioView: React.FC = () => {
  const { brand, isBrandLoading, saveBrandProfile, openGenerator, language, t, showToast } = useApp();

  const [formData, setFormData] = useState<BrandProfile>(() => brand || createDefaultBrand(language));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData(brand);
    } else {
      setFormData(createDefaultBrand(language));
    }
  }, [brand, language]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast(language === 'ar' ? 'يرجى إدخال اسم البراند أو صانع المحتوى' : 'Please enter brand or creator name', 'error');
      return;
    }
    setIsSaving(true);
    await saveBrandProfile(formData);
    setIsSaving(false);
  };

  const handleUpdatePillar = (id: string, field: 'name' | 'desc', val: string) => {
    setFormData(prev => ({
      ...prev,
      pillars: prev.pillars.map(p => p.id === id ? { ...p, [field]: val } : p)
    }));
  };

  const handleAddPillar = () => {
    const newId = `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newPillar: BrandPillar = {
      id: newId,
      name: language === 'ar' ? 'ركيزة جديدة' : language === 'fr' ? 'Nouveau pilier' : 'New Pillar',
      desc: language === 'ar' ? 'وصف أهداف وموضوعات الركيزة' : language === 'fr' ? 'Description et objectifs du pilier' : 'Pillar description and focus topics'
    };
    setFormData(prev => ({ ...prev, pillars: [...prev.pillars, newPillar] }));
  };

  const handleRemovePillar = (id: string) => {
    if (formData.pillars.length <= 1) {
      showToast(language === 'ar' ? 'يجب الاحتفاظ بركيزة محتوى واحدة على الأقل' : 'At least one content pillar is required', 'error');
      return;
    }
    setFormData(prev => ({ ...prev, pillars: prev.pillars.filter(p => p.id !== id) }));
  };

  if (isBrandLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#FF5A6E] animate-spin" />
        <p className="text-xs text-slate-500 font-medium">
          {language === 'ar' ? 'جار تحميل بيانات الملف الشخصي والبراند من السحابة...' : 'Loading brand profile from database...'}
        </p>
      </div>
    );
  }

  const isNewProfile = !brand || !brand.id;

  return (
    <div className="space-y-6">
      {/* Onboarding Alert for Fresh Accounts */}
      {isNewProfile && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-emerald-900">
              {language === 'ar' ? 'مرحباً بك في مساحة عملك! ابدأ بتعريف هوية علامتك التجارية' : 'Welcome! Set up your Creator Brand Profile'}
            </h3>
            <p className="text-emerald-700 leading-relaxed">
              {language === 'ar' 
                ? 'لم يتم تسجيل بروفايل لعلامتك التجارية حتى الآن. املأ الحقول أدناه لحفظها بشكل دائم في قاعدة البيانات وتفعيل القرارات الاستراتيجية وجدول النشر.' 
                : 'No brand profile has been configured for this account yet. Fill in the fields below to persist your brand in the database and activate tailored recommendations.'}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0E1633] tracking-tight">
            {t.brandStudio.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.brandStudio.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openGenerator('strategy')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A6E]" />
            <span>{t.brandStudio.generateAllPillars}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaving ? t.common.saving : t.common.save}</span>
          </button>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Identity (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-[#0E1633] pb-2 border-b border-slate-100">
            {language === 'ar' ? 'الهوية الأساسية ومحددات النيش' : language === 'fr' ? 'Identité Fondamentale & Niche' : 'Core Identity & Niche Parameters'}
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.brandStudio.brandName}
            </label>
            <input
              type="text"
              value={formData.name}
              placeholder={language === 'ar' ? 'مثال: سارة أحمد — استشارات التسويق' : 'e.g., Sarah Chen — Growth Advisory'}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.brandStudio.niche}
            </label>
            <textarea
              rows={2}
              value={formData.niche}
              placeholder={language === 'ar' ? 'تخصص صناعة المحتوى، المنتجات الرقمية، الاستشارات...' : 'Personal brand growth, digital products, consulting...'}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.brandStudio.targetAudience}
            </label>
            <textarea
              rows={2}
              value={formData.targetAudience}
              placeholder={language === 'ar' ? 'من هو جمهورك المستهدف بالتحديد؟ ما هي تحدياتهم؟' : 'Who is your ideal customer or audience segment?'}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.brandStudio.voiceTone}
              </label>
              <input
                type="text"
                value={formData.voiceTone}
                onChange={(e) => setFormData({ ...formData, voiceTone: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.brandStudio.contentDialect}
              </label>
              <select
                value={formData.contentLanguage}
                onChange={(e) => setFormData({ ...formData, contentLanguage: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              >
                <option value="ar_standard">عربية فصحى معاصرة (MSA)</option>
                <option value="ar_algerian">دارجة جزائرية معاصرة (Algerian Darija)</option>
                <option value="fr">Français (Français Pro)</option>
                <option value="en">English (International)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.brandStudio.primaryOffer}
            </label>
            <input
              type="text"
              value={formData.primaryOffer}
              placeholder={language === 'ar' ? 'مثال: برنامج تدريبي مصغر، استشارات مدفوعة، اشتراك مجتمعي' : 'e.g., 1-on-1 Advisory, Cohort Workshop, Digital Toolkit'}
              onChange={(e) => setFormData({ ...formData, primaryOffer: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.brandStudio.constraints}
            </label>
            <textarea
              rows={2}
              value={formData.constraints}
              placeholder={language === 'ar' ? 'مثال: تجنب الوعود المبالغ فيها بالثراء السريع، تجنب ذكر أسماء منافسين، التركيز على الأدلة العلمية...' : 'e.g., No fake engagement promises, evidence-backed frameworks only...'}
              onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
            />
          </div>
        </div>

        {/* The 4 Pillars Strategy (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-[#0E1633]">
                {t.brandStudio.contentPillars}
              </h2>
              <span className="text-[11px] text-slate-400">
                {language === 'ar' ? 'نموذج التوازن الرباعي المعتمد' : 'Strategic Quadrant Framework'}
              </span>
            </div>

            <button
              onClick={handleAddPillar}
              className="p-1 text-slate-600 hover:text-[#0E1633] rounded hover:bg-slate-100 transition-colors"
              title="Add Pillar"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {formData.pillars.map((pillar) => (
              <div key={pillar.id} className="p-3.5 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={pillar.name}
                    onChange={(e) => handleUpdatePillar(pillar.id, 'name', e.target.value)}
                    className="font-bold text-xs text-[#0E1633] bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-[#FF5A6E] w-full"
                  />
                  <button
                    onClick={() => handleRemovePillar(pillar.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                    title={t.common.delete}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={pillar.desc}
                  onChange={(e) => handleUpdatePillar(pillar.id, 'desc', e.target.value)}
                  className="w-full text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
                />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? t.common.saving : t.brandStudio.saveBrandProfile}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
