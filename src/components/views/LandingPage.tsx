import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Compass, 
  Activity, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Flame,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setRoute, t, direction, language, user, openGenerator } = useApp();

  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-[#F2F4FA] text-[#0E1633]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#0E1633] text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FF5A6E_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Right Column: Text Content */}
            <div className="lg:col-span-7 space-y-6 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-[#7BE0C3] bg-[#1B2650] rounded-full border border-[#7BE0C3]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.landing.heroKicker}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                {t.landing.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {t.landing.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setRoute(user ? 'dashboard' : 'signup')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>{t.landing.startFree}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setRoute('decision-board')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-200 bg-[#1B2650] hover:bg-[#25346d] rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  <span>{t.landing.seeDemo}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7BE0C3]" />
                  <span>اعتماد بشري إلزامي</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF5A6E]" />
                  <span>إشارات موثقة المصادر</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#7BE0C3]" />
                  <span>دعم كامل للعربية والفرنسية والإنجليزية</span>
                </div>
              </div>
            </div>

            {/* Right/Left Column: Studio Workspace Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-[#1B2650] shadow-2xl bg-[#151E40]">
                <img
                  src="/src/assets/images/hero_creator_workspace_1793123902712.jpg"
                  alt="Creator Studio Workspace"
                  className="w-full h-80 sm:h-96 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1633]/90 via-[#0E1633]/20 to-transparent flex items-end p-6">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#7BE0C3] uppercase tracking-wider">
                      Live Studio Architecture
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      استوديو التخطيط الاستراتيجي لصناع المحتوى
                    </h3>
                    <p className="text-xs text-slate-300">
                      نظام متكامل يربط بين إشارات السوق اللحظية وجدول النشر التكتيكي.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantitative Rigor Stats Strip */}
      <section className="border-y border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-start">
            <div className="p-4 border-b md:border-b-0 md:border-e border-slate-200">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#0E1633] font-mono tabular-nums">
                {t.landing.stat1Value}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                {t.landing.stat1Label}
              </span>
            </div>

            <div className="p-4 border-b md:border-b-0 md:border-e border-slate-200">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#FF5A6E] font-mono tabular-nums">
                {t.landing.stat2Value}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                {t.landing.stat2Label}
              </span>
            </div>

            <div className="p-4">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#1B2650] font-mono tabular-nums">
                {t.landing.stat3Value}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                {t.landing.stat3Label}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E1633]">
            {t.landing.featuresHeading}
          </h2>
          <p className="text-sm text-slate-600">
            {t.landing.evidenceSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Trend Radar */}
          <div 
            onClick={() => setRoute('trends')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#FF5A6E]/40 hover:shadow-lg transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0E1633] text-[#7BE0C3] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0E1633]">
              {t.landing.trendRadarTitle}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.landing.trendRadarDesc}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A6E] group-hover:underline">
              <span>{t.common.viewDetails}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 2: Decision Board */}
          <div 
            onClick={() => setRoute('decision-board')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#FF5A6E]/40 hover:shadow-lg transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0E1633] text-[#FF5A6E] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0E1633]">
              {t.landing.decisionBoardTitle}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.landing.decisionBoardDesc}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A6E] group-hover:underline">
              <span>{t.common.viewDetails}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 3: Calendar 48h & 7d */}
          <div 
            onClick={() => setRoute('calendar')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#FF5A6E]/40 hover:shadow-lg transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0E1633] text-[#7BE0C3] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0E1633]">
              {t.landing.calendarTitle}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.landing.calendarDesc}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A6E] group-hover:underline">
              <span>{t.common.viewDetails}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Feature 4: Instagram Insights */}
          <div 
            onClick={() => setRoute('analytics')}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#FF5A6E]/40 hover:shadow-lg transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0E1633] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0E1633]">
              {t.landing.instagramTitle}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.landing.instagramDesc}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF5A6E] group-hover:underline">
              <span>{t.common.viewDetails}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* Visual Product Showcase Bento */}
      <section className="py-12 bg-[#0E1633] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-[#7BE0C3] uppercase tracking-wider">
                Trend Radar & Decision Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t.landing.evidenceHeading}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                كل فكرة مقترحة ترفق برابط إثبات، تاريخ الرصد، درجة تراجع التريند، وزاوية التميز الخاصة بك. لا نشر أوتوماتيكي بدون تدقيق بشري.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BE0C3] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>توليد متناغم مع اللهجة:</strong> فصحى معاصرة أو دارجة جزائرية/مغاربية مع إمكانية التعديل الحر.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BE0C3] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>خطط تكتيكية لـ 48 ساعة:</strong> لسرعة التفاعل مع الأخبار والأحداث الصاعدة دون تأخير.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7BE0C3] shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>ربط رسمي بـ Meta:</strong> دون طلب كلمات مرور وبأعلى معايير الخصوصية.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setRoute(user ? 'dashboard' : 'login')}
                  className="px-6 py-3 text-xs font-bold text-[#0E1633] bg-[#7BE0C3] hover:bg-[#68d1b3] rounded-xl transition-colors cursor-pointer"
                >
                  {t.landing.enterWorkspace}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[#1B2650] shadow-2xl">
                <img
                  src="/src/assets/images/trend_radar_visual_1793123903532.jpg"
                  alt="Trend Radar Screen"
                  className="w-full h-80 sm:h-96 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl font-bold text-[#0E1633]">
            {t.landing.testimonialsHeading}
          </h2>
          <p className="text-xs text-slate-500">
            {t.landing.trustedBy}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed">
              "كصانعة محتوى تعليمي ومدربة استشارات، كنت أقضي 15 ساعة أسبوعياً في التفكير فيما يجب نشره. Creator Pilot أعطاني وضوحاً كاملاً في خطة الـ 48 ساعة وسيناريوهات دقيقة بالدارجة والفصحى."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1B2650] text-white flex items-center justify-center font-bold text-xs">
                أم
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0E1633]">أمينة بوجمعة</h4>
                <p className="text-[11px] text-slate-500">استشارية تدريب وصناعة محتوى (الجزائر)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed">
              "أكثر ما أحبه هو الشفافية: يوضح لك النظام مبرر التوصية وما هو غير مؤكد في إشارة التريند. لا وعود فارغة بالانتشار، بل منهجية عمل تصنع مبيعات حقيقية لبرامجي."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FF5A6E] text-white flex items-center justify-center font-bold text-xs">
                كـ
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0E1633]">كريم المنصوري</h4>
                <p className="text-[11px] text-slate-500">مستشار أعمال وتطوير مهارات (المغرب)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <p className="text-xs text-slate-700 leading-relaxed">
              "الميزة الأهم هي عدم النشر التلقائي؛ كل منشور يتم تدقيقه واعتماده بشرياً. التحليلات الرسمية تعطيني قراءة حقيقية لما يحفظه ويشاركه جمهوري فعلياً."
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7BE0C3] text-[#0E1633] flex items-center justify-center font-bold text-xs">
                سـ
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0E1633]">سارة عبد الرحيم</h4>
                <p className="text-[11px] text-slate-500">مدربة تسويق رقمي ومصممة دورات (دبي)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-[#1B2650] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.landing.ctaHeading}
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            {t.landing.ctaSubheading}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setRoute(user ? 'dashboard' : 'login')}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-[#FF5A6E] hover:bg-[#E8465A] rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <span>{t.landing.enterWorkspace}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
