import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const { brand, user, saveBrandProfile, setRoute, t, direction, language, showToast } = useApp();

  const [step, setStep] = useState(1);

  const initialName = user?.name || (language === 'en' ? 'Creator Studio' : language === 'fr' ? 'Studio Créateur' : 'استوديو صناعة المحتوى');
  const initialNiche = brand?.niche || '';
  const initialAudience = brand?.targetAudience || '';
  const initialVoiceTone = brand?.voiceTone || (language === 'en' ? 'Direct, evidence-backed, analytical, actionable' : language === 'fr' ? 'Direct, pédagogique, analytique, orienté résultats' : 'مباشر، علمي، تحليلي، محفز ومبني على الأرقام الحقيقية');
  const initialOffer = brand?.primaryOffer || '';

  const [name, setName] = useState(initialName);
  const [niche, setNiche] = useState(initialNiche);
  const [targetAudience, setTargetAudience] = useState(initialAudience);
  const [voiceTone, setVoiceTone] = useState(initialVoiceTone);
  const [primaryOffer, setPrimaryOffer] = useState(initialOffer);

  const ArrowNext = direction === 'rtl' ? ArrowLeft : ArrowRight;
  const ArrowPrev = direction === 'rtl' ? ArrowRight : ArrowLeft;

  const handleFinish = async () => {
    const updatedName = name.trim() || initialName;
    const updatedNiche = niche.trim() || (language === 'en' ? 'Digital Strategy & Consulting' : language === 'fr' ? 'Conseil et Stratégie Numérique' : 'استراتيجية المحتوى والمنتجات الرقمية');
    const updatedAudience = targetAudience.trim() || (language === 'en' ? 'Coaches, educators and consultants' : language === 'fr' ? 'Consultants et formateurs' : 'المدربون والمستشارون وصناع المحتوى');
    const updatedOffer = primaryOffer.trim() || (language === 'en' ? 'Strategic Sprints & Workshops' : language === 'fr' ? 'Ateliers et mentorat stratégique' : 'ورش عمل واستشارات تدريبية');

    // Generate language-appropriate pillars
    const defaultPillars = language === 'en' ? [
      { id: 'p1', name: 'Authority', desc: 'In-depth case studies, data breakdowns, and framework teardowns' },
      { id: 'p2', name: 'Empathy', desc: 'Behind-the-scenes struggles, mindset shifts, and overcoming creative fatigue' },
      { id: 'p3', name: 'Conversion', desc: 'Core offer validation, consulting pricing, and launch roadmaps' },
      { id: 'p4', name: 'Action', desc: 'Checklists, swipe files, and direct quick-win execution tactics' }
    ] : language === 'fr' ? [
      { id: 'p1', name: 'Autorité', desc: 'Études de cas vérifiées, décryptage d’algorithmes et analyses approfondies' },
      { id: 'p2', name: 'Empathie', desc: 'Transparence, coulisses quotidiennes et dépassement des blocages' },
      { id: 'p3', name: 'Conversion', desc: 'Conception de l’offre principale, tarification et parcours client' },
      { id: 'p4', name: 'Action', desc: 'Fiches pratiques, checklists téléchargeables et victoires rapides' }
    ] : [
      { id: 'p1', name: 'سلطة المعرفة (Authority)', desc: 'تحليلات عميقة، دراسات حالة موثقة، وفك شفرة الخوارزميات' },
      { id: 'p2', name: 'التعاطف والتواصل (Empathy)', desc: 'تحديات صناع المحتوى اليومية، التغلب على متلازمة المحتال وإرهاق النشر' },
      { id: 'p3', name: 'التحويل والقيمة (Conversion)', desc: 'كيف تبني منتجاً رقمياً مطلوباً، تسعير الاستشارات، وهندسة الإطلاق' },
      { id: 'p4', name: 'التنفيذ والإجراء (Action)', desc: 'قوالب جاهزة، خطوات عملية مباشرة، وتطبيقات فورية' }
    ];

    await saveBrandProfile({
      id: user?.id ? `brand-${user.id}` : (brand?.id || `brand-${Date.now()}`),
      name: updatedName,
      niche: updatedNiche,
      targetAudience: updatedAudience,
      voiceTone: voiceTone.trim() || initialVoiceTone,
      primaryOffer: updatedOffer,
      contentLanguage: language === 'en' ? 'en' : language === 'fr' ? 'fr' : 'ar_standard',
      contentDialect: language === 'en' ? 'en' : language === 'fr' ? 'fr' : 'ar_standard',
      constraints: brand?.constraints || '',
      pillars: defaultPillars
    });

    showToast(t.common.saved, 'success');
    setRoute('dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
        {/* Step progress dots */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s 
                    ? 'bg-[#FF5A6E] text-white shadow-xs' 
                    : step > s 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {t.onboarding.step} {step} {t.onboarding.of} 3
          </span>
        </div>

        {/* Step 1: Name and Niche */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0E1633]">
                {t.onboarding.step1Title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.onboarding.step1Desc}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.onboarding.brandNameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.onboarding.brandNamePlaceholder}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.onboarding.nicheLabel}
              </label>
              <textarea
                rows={3}
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder={t.onboarding.nichePlaceholder}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
            </div>
          </div>
        )}

        {/* Step 2: Audience & Voice */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0E1633]">
                {t.onboarding.step2Title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.onboarding.step2Desc}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.onboarding.audienceLabel}
              </label>
              <textarea
                rows={3}
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder={t.onboarding.audiencePlaceholder}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.onboarding.voiceToneLabel}
              </label>
              <input
                type="text"
                value={voiceTone}
                onChange={(e) => setVoiceTone(e.target.value)}
                placeholder={t.onboarding.voiceTonePlaceholder}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
            </div>
          </div>
        )}

        {/* Step 3: Primary Offer & Ready */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0E1633]">
                {t.onboarding.step3Title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.onboarding.step3Desc}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.onboarding.primaryOfferLabel}
              </label>
              <textarea
                rows={3}
                value={primaryOffer}
                onChange={(e) => setPrimaryOffer(e.target.value)}
                placeholder={t.onboarding.primaryOfferPlaceholder}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF5A6E]"
              />
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p>
                {t.onboarding.pillarsNotice}
              </p>
            </div>
          </div>
        )}

        {/* Step Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowPrev className="w-3.5 h-3.5" />
              <span>{t.onboarding.prev}</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#0E1633] hover:bg-[#1B2650] rounded-xl transition-colors cursor-pointer"
            >
              <span>{t.onboarding.next}</span>
              <ArrowNext className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>{t.onboarding.finish}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
