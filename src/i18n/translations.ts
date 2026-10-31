export type SupportedLanguage = 'ar' | 'fr' | 'en';
export type ContentDialect = 'ar_standard' | 'ar_darija' | 'fr' | 'en';

export interface TranslationDictionary {
  brand: string;
  tagline: string;
  landing: {
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    startFree: string;
    seeDemo: string;
    evidenceHeading: string;
    evidenceSubtitle: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
    featuresHeading: string;
    trendRadarTitle: string;
    trendRadarDesc: string;
    decisionBoardTitle: string;
    decisionBoardDesc: string;
    calendarTitle: string;
    calendarDesc: string;
    instagramTitle: string;
    instagramDesc: string;
    trustedBy: string;
    testimonialsHeading: string;
    ctaHeading: string;
    ctaSubheading: string;
    enterWorkspace: string;
  };
  nav: {
    dashboard: string;
    decisionBoard: string;
    calendar: string;
    trends: string;
    analytics: string;
    contentLibrary: string;
    brandStudio: string;
    integrations: string;
    settings: string;
    logout: string;
    signIn: string;
    signUp: string;
    onboarding: string;
    quickGenerate: string;
    switchWorkspace: string;
  };
  common: {
    save: string;
    saved: string;
    saving: string;
    cancel: string;
    delete: string;
    edit: string;
    copy: string;
    copied: string;
    export: string;
    filter: string;
    all: string;
    refresh: string;
    loading: string;
    approved: string;
    draft: string;
    scheduled: string;
    proposed: string;
    published: string;
    dismissed: string;
    confidence: string;
    freshness: string;
    evidence: string;
    rationale: string;
    uncertainty: string;
    format: string;
    hook: string;
    outline: string;
    cta: string;
    caption: string;
    status: string;
    actions: string;
    source: string;
    hours48: string;
    days7: string;
    language: string;
    success: string;
    error: string;
    search: string;
    viewDetails: string;
    humanApprovalNotice: string;
  };
  dashboard: {
    welcome: string;
    overviewSubtitle: string;
    priorityActionTitle: string;
    priorityActionDesc: string;
    next48Hours: string;
    radarAlerts: string;
    quickTools: string;
    generateIdeas: string;
    generateBio: string;
    generateStrategy: string;
    generateProduct: string;
    recentDrafts: string;
    growthKpis: string;
    viewAllCalendar: string;
    viewAllDecisions: string;
  };
  decisionBoard: {
    title: string;
    subtitle: string;
    rankedRationale: string;
    filterByPlatform: string;
    filterByConfidence: string;
    addToCalendar: string;
    editDraft: string;
    dismiss: string;
    whyRecommended: string;
    whatIsUncertain: string;
    suggestedHook: string;
    suggestedOutline: string;
    evidenceStrength: string;
    verifiedSourcesOnly: string;
  };
  calendar: {
    title: string;
    subtitle: string;
    view48h: string;
    view7d: string;
    createItem: string;
    itemTitle: string;
    platform: string;
    scheduledTime: string;
    approveItem: string;
    publishSafeNotice: string;
    emptyPlan: string;
    generatePlanPrompt: string;
    generate48hBtn: string;
    generate7dBtn: string;
    exportCsv: string;
    exportMarkdown: string;
  };
  trends: {
    title: string;
    subtitle: string;
    integrityTitle: string;
    integrityDescription: string;
    lastUpdated: string;
    signalFeed: string;
    nicheRelevance: string;
    signalStrength: string;
    allSignals: string;
    verifiedOnly: string;
    demoOnly: string;
    velocityUnit: string;
    categoryAndNiche: string;
    audienceFit: string;
    estimatedAge: string;
    daysUnit: string;
    createFromTrend: string;
    noVerifiedMetric: string;
    sourceNotVerified: string;
    sourceLink: string;
    freshnessDays: string;
    decayStatus: string;
    verifiedBadge: string;
    demoBadge: string;
    searchPlaceholder: string;
    refreshSignals: string;
    addCustomSource: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    connectionStatus: string;
    officialMetaNotice: string;
    reachMetric: string;
    impressionsMetric: string;
    profileVisitsMetric: string;
    engagementRate: string;
    topReels: string;
    audienceBreakdown: string;
    historicalSnapshots: string;
    reconnectAccount: string;
    disconnectAccount: string;
  };
  brandStudio: {
    title: string;
    subtitle: string;
    brandName: string;
    niche: string;
    targetAudience: string;
    voiceTone: string;
    primaryOffer: string;
    contentLanguage: string;
    contentDialect: string;
    contentPillars: string;
    constraints: string;
    saveBrandProfile: string;
    generateAllPillars: string;
  };
  contentLibrary: {
    title: string;
    subtitle: string;
    searchLibrary: string;
    typeFilter: string;
    allTypes: string;
    ideas: string;
    scripts: string;
    bios: string;
    strategies: string;
    digitalProducts: string;
    emptyLibrary: string;
  };
  integrations: {
    title: string;
    subtitle: string;
    metaInstagram: string;
    metaDesc: string;
    connectMeta: string;
    googleTrends: string;
    googleTrendsDesc: string;
    rssSources: string;
    rssSourcesDesc: string;
    statusConnected: string;
    statusUnconfigured: string;
    statusReady: string;
    configureKeys: string;
    officialSecurityBanner: string;
  };
  settings: {
    title: string;
    subtitle: string;
    interfaceLanguage: string;
    accountSecurity: string;
    apiKeyConfig: string;
    apiKeyNote: string;
    auditLogs: string;
    privacyNotice: string;
    exportData: string;
  };
  auth: {
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    demoLoginBtn: string;
    demoNote: string;
    haveAccount: string;
    noAccount: string;
    emailAlreadyExists: string;
    signupRateLimited: string;
  };
  onboarding: {
    step: string;
    of: string;
    step1Title: string;
    step1Desc: string;
    brandNameLabel: string;
    brandNamePlaceholder: string;
    nicheLabel: string;
    nichePlaceholder: string;
    step2Title: string;
    step2Desc: string;
    audienceLabel: string;
    audiencePlaceholder: string;
    voiceToneLabel: string;
    voiceTonePlaceholder: string;
    step3Title: string;
    step3Desc: string;
    primaryOfferLabel: string;
    primaryOfferPlaceholder: string;
    pillarsNotice: string;
    prev: string;
    next: string;
    finish: string;
  };
  generator: {
    modalTitle: string;
    formatLabel: string;
    formatReel: string;
    formatCarousel: string;
    formatPost: string;
    customTopic: string;
    customTopicPlaceholder: string;
    generateBtn: string;
    generating: string;
    readyTitle: string;
    readyDesc: string;
    whyItWorks: string;
    saveToLibrary: string;
    addAllToCalendar: string;
    itemsProposed: string;
    requiredAction: string;
    savePillars: string;
    strategyAudienceProblems: string;
    strategyThemes: string;
    strategyTopics: string;
    strategyFormats: string;
    strategyOffer: string;
    strategyCtas: string;
    strategyWhy: string;
    ideaVisualConcept: string;
    ideaOnScreenText: string;
    ideaMainMessage: string;
    ideaSlides: string;
    bioText: string;
    bioPositioning: string;
    bioValueProposition: string;
    geminiQuotaError: string;
    geminiRateLimitError: string;
    geminiUnavailableError: string;
    geminiConfigurationError: string;
    geminiInvalidResponseError: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  ar: {
    brand: "Creator Pilot",
    tagline: "منصة استراتيجية المحتوى المدعومة بالأدلة لصناع المحتوى المحترفين",
    landing: {
      heroKicker: "ذكاء استراتيجي للمحتوى العربي والفرانكوفوني",
      heroTitle: "انشر ما يحقق نتائج حقيقية بناءً على أدلة واتجاهات موثقة",
      heroSubtitle: "لا وعود وهمية بالانتشار. Creator Pilot يرصد الإشارات الصاعدة، يحلل جمهورك بدقة، ويمنحك خططاً مدروسة لـ 48 ساعة و 7 أيام مع نصوص وسيناريوهات قابلة للتنفيذ الفوري.",
      startFree: "ابدأ إعداد هويتك مجاناً",
      seeDemo: "استكشف لوحة اتخاذ القرار",
      evidenceHeading: "نهج مبني على الحقائق، لا على التخمين العشوائي",
      evidenceSubtitle: "نربط كل فكرة محتوى بمصدر حقيقي وإشارة موثقة مع توضيح نسبة الثقة ونقاط عدم اليقين قبل النشر.",
      stat1Label: "ساعات تخطيط أسبوعية موفرة",
      stat1Value: "١٢+ ساعة",
      stat2Label: "دقة ملاءمة المحتوى للجمهور",
      stat2Value: "٩٤٪",
      stat3Label: "مراجعة واعتماد بشري إلزامي",
      stat3Value: "١٠٠٪",
      featuresHeading: "منظومة عمل متكاملة لصناع المحتوى والخبراء",
      trendRadarTitle: "رادار التريندات الموثقة",
      trendRadarDesc: "اكتشاف الإشارات الصاعدة من مصادر رسمية ومفتوحة، مع تقييم درجة الحداثة وتراجع التريند وملاءمته لمجالك.",
      decisionBoardTitle: "لوحة قرارات النشر المرتبة",
      decisionBoardDesc: "توصيات بأولويات النشر تشرح لك: لماذا نوصي بهذا الموضوع، ما هي النقاط غير المؤكدة، وما هي أفضل زاوية وهوك.",
      calendarTitle: "تقويم 48 ساعة و 7 أيام التفاعلي",
      calendarDesc: "جدولة مرنة لمخططات فورية ومستقبلية مع مراجعة واعتماد بشري لكل مسودة وسيناريو.",
      instagramTitle: "رؤى إنستغرام الرسمية والآمنة",
      instagramDesc: "تحليل مؤشرات الوصول والتفاعل الرسمية عبر واجهة Meta المعتمدة دون المساس ببيانات المرور الخاصة بك.",
      trustedBy: "موثوق من قبل استشاريين ومدربين وصناع محتوى في الشرق الأوسط وشمال أفريقيا",
      testimonialsHeading: "شهادات صناع المحتوى",
      ctaHeading: "حوّل استراتيجية محتواك إلى محرك نمو مدروس",
      ctaSubheading: "انضم إلى صناع المحتوى الذين يعتمدون على البيانات الصادقة ووضوح الرؤية بدلاً من التشتت.",
      enterWorkspace: "الدخول إلى مساحة العمل"
    },
    nav: {
      dashboard: "لوحة التحكم",
      decisionBoard: "لوحة القرارات",
      calendar: "التقويم الاستراتيجي",
      trends: "رادار التريندات",
      analytics: "تحليلات إنستغرام",
      contentLibrary: "مكتبة المحتوى",
      brandStudio: "استوديو البراند",
      integrations: "التكاملات والربط",
      settings: "الإعدادات واللغة",
      logout: "تسجيل الخروج",
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      onboarding: "إعداد البراند",
      quickGenerate: "توليد سريع",
      switchWorkspace: "تبديل مساحة العمل"
    },
    common: {
      save: "حفظ التغييرات",
      saved: "تم الحفظ بنجاح",
      saving: "جاري الحفظ...",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      copy: "نسخ النص",
      copied: "تم النسخ!",
      export: "تصدير",
      filter: "تصفية",
      all: "الكل",
      refresh: "تحديث الإشارات",
      loading: "جاري التحميل...",
      approved: "معتمد للنشر",
      draft: "مسودة قيد التحرير",
      scheduled: "مجدول زمنياً",
      proposed: "مقترح من النظام",
      published: "منشور رسمياً",
      dismissed: "مستبعد",
      confidence: "درجة الثقة",
      freshness: "الحداثة",
      evidence: "المصدر والدليل",
      rationale: "مبرر التوصية",
      uncertainty: "حدود الدليل وعدم اليقين",
      format: "صيغة المحتوى",
      hook: "الخطاف الافتتاحي (Hook)",
      outline: "هيكل السيناريو",
      cta: "الدعوة للإجراء (CTA)",
      caption: "نص المنشور",
      status: "الحالة",
      actions: "الإجراءات",
      source: "المصدر",
      hours48: "خطة ٤٨ ساعة",
      days7: "خطة ٧ أيام",
      language: "اللغة",
      success: "تمت العملية بنجاح",
      error: "حدث خطأ غير متوقع",
      search: "بحث في المحتوى أو الإشارات...",
      viewDetails: "عرض التفاصيل الكاملة",
      humanApprovalNotice: "المراجعة البشرية إلزامية قبل اتخاذ أي إجراء نشر فعلي."
    },
    dashboard: {
      welcome: "أهلاً بك في مساحة عمل Creator Pilot",
      overviewSubtitle: "ملخص أولوياتك الاستراتيجية لليوم والإشارات الصاعدة ذات الصلة ببراندك",
      priorityActionTitle: "الإجراء ذو الأولوية القصوى اليوم",
      priorityActionDesc: "فرصة تصاعد في موضوع تخصصك مع ارتفاع في معدل البحث خلال الـ 24 ساعة الماضية.",
      next48Hours: "المحتوى المجدول للـ 48 ساعة القادمة",
      radarAlerts: "تنبيهات الرادار الصاعدة",
      quickTools: "أدوات التوليد الاستراتيجي",
      generateIdeas: "أفكار وسيناريوهات",
      generateBio: "صياغة البايو الاحترافي",
      generateStrategy: "استراتيجية الركائز الأربع",
      generateProduct: "مقترح منتج رقمي",
      recentDrafts: "أحدث المسودات المحفوظة",
      growthKpis: "المؤشرات الإحصائية للأداء",
      viewAllCalendar: "عرض التقويم كاملاً",
      viewAllDecisions: "عرض كل التوصيات المرتبة"
    },
    decisionBoard: {
      title: "لوحة قرارات النشر المبنية على الأدلة",
      subtitle: "توصيات محتوى مفاضلة حسب ملاءمتها لهويتك، حداثة الإشارة، ومستوى الموثوقية التوثيقية.",
      rankedRationale: "ترتيب الأولويات الاستراتيجية",
      filterByPlatform: "المنصة",
      filterByConfidence: "مستوى الثقة",
      addToCalendar: "إضافة إلى التقويم",
      editDraft: "فتح المسودة وتعديلها",
      dismiss: "استبعاد الفكرة",
      whyRecommended: "لماذا نوصي بهذا المحتوى الآن؟",
      whatIsUncertain: "ما الذي يجب الانتباه إليه (عدم اليقين)؟",
      suggestedHook: "الخطاف المقترح لجذب الانتباه",
      suggestedOutline: "المخطط الهيكلي للسيناريو",
      evidenceStrength: "قوة الدليل الإحصائي",
      verifiedSourcesOnly: "إظهار المصادر الموثقة فقط"
    },
    calendar: {
      title: "التقويم الاستراتيجي ومخطط النشر",
      subtitle: "إدارة المسودات، الخطط الميدانية للـ 48 ساعة و 7 أيام، والتحكم الصارم قبل النشر.",
      view48h: "مخطط ٤٨ ساعة الفوري",
      view7d: "استراتيجية ٧ أيام",
      createItem: "إضافة منشور جديد",
      itemTitle: "عنوان أو موضوع المنشور",
      platform: "منصة النشر",
      scheduledTime: "موعد النشر المقترح",
      approveItem: "اعتماد المحتوى",
      publishSafeNotice: "لن يتم نشر أي محتوى تلقائياً؛ يجب مراجعة واعتماد المنشور يدوياً من طرفك.",
      emptyPlan: "لا توجد عناصر مجدولة بعد لهذه الفترة.",
      generatePlanPrompt: "استخدم زر التوليد الذكي لإنشاء خطة مخصصة متناغمة مع ركائز براندك الحالية.",
      generate48hBtn: "توليد خطة ٤٨ ساعة",
      generate7dBtn: "توليد خطة ٧ أيام",
      exportCsv: "تصدير بتنسيق CSV",
      exportMarkdown: "تصدير بصيغة Markdown"
    },
    trends: {
      title: "رادار الإشارات والتريندات الصاعدة",
      subtitle: "رصد موضوعات البحث والاهتمام الجماهيري مع التوثيق الكامل للمصادر وتاريخ الرصد.",
      integrityTitle: "مبدأ النزاهة التوثيقية في Creator Pilot",
      integrityDescription: "لا نختلق إشارات أو نزعم أن اهتمام البحث يثبت أداء منصة بعينها. نفرّق بين المصادر الموثقة والبيانات التجريبية، ولا نستخدم الإشارة إلا مع توضيح مصدرها وحدودها.",
      lastUpdated: "آخر فحص للإشارات",
      signalFeed: "جدول الإشارات المرصودة",
      nicheRelevance: "ملاءمة التخصص",
      signalStrength: "زخم الإشارة",
      allSignals: "كافة الإشارات",
      verifiedOnly: "المصادر الموثقة فقط",
      demoOnly: "بيانات تجريبية",
      velocityUnit: "زخم",
      categoryAndNiche: "التصنيف والتخصص",
      audienceFit: "ملاءمة الجمهور",
      estimatedAge: "العمر التقديري",
      daysUnit: "يوم",
      createFromTrend: "تحويل إلى فكرة محتوى",
      noVerifiedMetric: "غير متاح — بيانات تجريبية",
      sourceNotVerified: "مثال توضيحي غير موثق",
      sourceLink: "رابط المصدر",
      freshnessDays: "عمر الإشارة",
      decayStatus: "حالة التراجع",
      verifiedBadge: "مصدر موثق",
      demoBadge: "بيانات تجريبية",
      searchPlaceholder: "بحث في الكلمات المفتاحية والمصادر...",
      refreshSignals: "تحديث الإشارات من المصادر",
      addCustomSource: "إضافة مصدر مرخص"
    },
    analytics: {
      title: "تحليلات الأداء وحساب إنستغرام",
      subtitle: "قراءة مؤشرات النمو الحقيقية عبر واجهة Meta الرسمية لتحسين القرارات القادمة.",
      connectionStatus: "حالة الربط بالحساب",
      officialMetaNotice: "الاتصال يتم حصرياً عبر بروتوكول OAuth الرسمي المعتمد من شركة Meta دون طلب كلمات المرور الخاصة بك إطلاقاً.",
      reachMetric: "الوصول الحقيقي (Accounts Reached)",
      impressionsMetric: "إجمالي المشاهدات (Impressions)",
      profileVisitsMetric: "زيارات الملف الشخصي",
      engagementRate: "معدل التفاعل الفعلي",
      topReels: "أفضل المقاطع القصيرة أداءً",
      audienceBreakdown: "توزيع الجمهور الجغرافي واللغوي",
      historicalSnapshots: "سجل اللقطات الزمنية للأداء",
      reconnectAccount: "إعادة التحقق من تصريح Meta",
      disconnectAccount: "فصل الحساب بأمان"
    },
    brandStudio: {
      title: "استوديو الهوية واستراتيجية البراند",
      subtitle: "ضبط المعايير المرجعية لمجالك، نبرة الصوت، العرض الأساسي، وركائز المحتوى الأربع.",
      brandName: "اسم البراند أو الحساب",
      niche: "التخصص والمجال الدقيق",
      targetAudience: "الجمهور المستهدف والمشاكل التي تحلها له",
      voiceTone: "نبرة الصوت والشخصية (مثال: احترافي، مباشر، تحليلي)",
      primaryOffer: "المنتج أو الخدمة أو العرض الأساسي",
      contentLanguage: "لغة إنتاج المحتوى الافتراضية",
      contentDialect: "أسلوب اللهجة (فصحى معاصرة أو دارجة جزائرية)",
      contentPillars: "ركائز المحتوى الأربع (Authority, Empathy, Conversion, Action)",
      constraints: "محاذير وقيود النشر (ما نتجنب ذكره)",
      saveBrandProfile: "حفظ هوية البراند",
      generateAllPillars: "توليد ركائز استراتيجية مقترحة"
    },
    contentLibrary: {
      title: "مكتبة المحتوى والمسودات المحفوظة",
      subtitle: "أرشيف منظم لجميع السيناريوهات، الأفكار، نصوص البايو، ومقترحات المنتجات الرقمية.",
      searchLibrary: "بحث في نصوص المكتبة...",
      typeFilter: "نوع العنصر",
      allTypes: "جميع الأنواع",
      ideas: "أفكار وسيناريوهات",
      scripts: "نصوص تصوير كاملة",
      bios: "صيغ البايو",
      strategies: "استراتيجيات المحتوى",
      digitalProducts: "منتجات رقمية",
      emptyLibrary: "لم يتم حفظ أي عناصر في المكتبة بعد. أنشئ مسودتك الأولى الآن!"
    },
    integrations: {
      title: "التكاملات وبوابات البيانات المعتمدة",
      subtitle: "إدارة الربط بالخدمات الخارجية والمصادر الإحصائية الرسمية بشفافية وأمان.",
      metaInstagram: "واجهة Meta Graph API لإنستغرام",
      metaDesc: "تحليل مؤشرات الوصول والتفاعل لمتابعي الحساب المصرح رسمياً.",
      connectMeta: "إعداد ربط Meta OAuth",
      googleTrends: "مؤشرات Google Trends العامة",
      googleTrendsDesc: "رصد اتساع الاهتمام البحثي العام لدعم قرارات التوقيت.",
      rssSources: "خلاصات RSS ومصادر الأخبار المعتمدة",
      rssSourcesDesc: "تغذية مستمرة من منصات معتمدة ومقالات موثوقة.",
      statusConnected: "متصل ويعمل",
      statusUnconfigured: "غير مهيأ (بانتظار المفاتيح أو التصريح)",
      statusReady: "جاهز للتفعيل",
      configureKeys: "دليل تهيئة المفاتيح السحابية",
      officialSecurityBanner: "الأمان والخصوصية: نحن لا نطلب أو نخزن أي كلمات مرور إطلاقاً. كافة الاتصالات تمر عبر مفاتيح OAuth الرسمية والمشفرة."
    },
    settings: {
      title: "إعدادات الحساب والخصوصية واللغة",
      subtitle: "تخصيص تجربة الاستخدام، سياسات الأمان، وسجل تدقيق العمليات الحساسة.",
      interfaceLanguage: "لغة واجهة المستخدم واتجاه التصفح",
      accountSecurity: "أمان الحساب وصلاحيات الدخول",
      apiKeyConfig: "محرك الذكاء الاصطناعي والتوليد",
      apiKeyNote: "يتم إدارة مفتاح Gemini API بأمان عبر بيئة السيرفر دون إظهاره للواجهة.",
      auditLogs: "سجل العمليات والتدقيق الأمني (Audit Logs)",
      privacyNotice: "بياناتك وهويتك خاصة تماماً ولا تستخدم في تدريب نماذج عامة دون موافقتك.",
      exportData: "تصدير كافة بيانات الحساب كملف JSON"
    },
    auth: {
      fullNameLabel: "الاسم الكامل",
      fullNamePlaceholder: "مثال: أمينة بوجمعة أو صانع محتوى",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "creator@creatorpilot.io",
      passwordLabel: "كلمة المرور",
      demoLoginBtn: "الدخول بحساب العرض التجريبي (Amina Demo)",
      demoNote: "أو للتجربة الفورية السريعة",
      haveAccount: "لديك حساب بالفعل؟",
      noAccount: "ليس لديك حساب بعد؟",
      emailAlreadyExists: "هذا البريد الإلكتروني مستخدم بالفعل. سجّل الدخول بدلًا من إنشاء حساب جديد.",
      signupRateLimited: "تم تجاوز حد محاولات التسجيل مؤقتًا. انتظر قليلًا ثم أعد المحاولة."
    },
    onboarding: {
      step: "الخطوة",
      of: "من",
      step1Title: "اسم البراند وتخصصك الدقيق",
      step1Desc: "تحديد الهوية ومجال عملك هو الأساس لتصفية رادار التريندات وتوليد استراتيجيات ملائمة",
      brandNameLabel: "اسم البراند أو الحساب",
      brandNamePlaceholder: "مثال: استشارات المحتوى والتعليم الرقمي",
      nicheLabel: "المجال والتخصص الدقيق (Niche)",
      nichePlaceholder: "مثال: مساعدة المدربين والمستشارين على بناء وبيع ورش عمل رقمية",
      step2Title: "الجمهور المستهدف ونبرة الصوت",
      step2Desc: "حدد لمن توجه رسالتك وما هي النبرة الأنسب لبناء الثقة والتحويل",
      audienceLabel: "الجمهور المستهدف والمشاكل التي تحلها له",
      audiencePlaceholder: "مثال: صناع المحتوى المستقلون، المعلمون والمدربون في شمال أفريقيا والشرق الأوسط",
      voiceToneLabel: "نبرة الصوت والشخصية",
      voiceTonePlaceholder: "مثال: مباشر، علمي، تحليلي، محفز ومبني على الأرقام الحقيقية",
      step3Title: "العرض الأساسي ومسار التحويل",
      step3Desc: "المنتج أو الخدمة التي توجه متابعيك إليها لتحقيق العائد",
      primaryOfferLabel: "العرض الأساسي (Primary Offer)",
      primaryOfferPlaceholder: "مثال: معسكر تدريبي مصغر واستشارات فردية لإطلاق المنتجات الرقمية",
      pillarsNotice: "تم تفعيل نموذج الركائز الأربع (سلطة، تعاطف، تحويل، تنفيذ) تلقائياً لهوية براندك.",
      prev: "السابق",
      next: "التالي",
      finish: "إنهاء وبدء الاستخدام"
    },
    generator: {
      modalTitle: "أدوات التوليد الاستراتيجي",
      formatLabel: "نوع وقالب المحتوى المطلوب",
      formatReel: "فيديو ريلز (Reel)",
      formatCarousel: "كاروسيل متعدد الشرائح (Carousel)",
      formatPost: "منشور نصي وصورة (Post)",
      customTopic: "تركيز أو موضوع إضافي (اختياري)",
      customTopicPlaceholder: "مثال: التركيز على تسعير الخدمات وتخطي الخوف من الكاميرا",
      generateBtn: "توليد الآن",
      generating: "جاري استدعاء محرك الاستراتيجية...",
      readyTitle: "جاهز للتوليد الاستراتيجي",
      readyDesc: "اضغط على زر التوليد لصياغة مقترحات متوافقة بدقة مع ركائز براندك وجمهورك المستهدف.",
      whyItWorks: "لماذا تنجح هذه الصيغة:",
      saveToLibrary: "حفظ في المكتبة",
      addAllToCalendar: "إضافة كافة العناصر للتقويم",
      itemsProposed: "العناصر المقترحة",
      requiredAction: "الإجراء المطلوب:",
      savePillars: "اعتماد الركائز وحفظها",
      strategyAudienceProblems: "مشكلات الجمهور",
      strategyThemes: "المحاور",
      strategyTopics: "أفكار مواضيع تطبيقية",
      strategyFormats: "الصيغ المقترحة",
      strategyOffer: "صلة الركيزة بالعرض",
      strategyCtas: "أنواع الدعوة للإجراء",
      strategyWhy: "أهمية الركيزة",
      ideaVisualConcept: "الفكرة البصرية",
      ideaOnScreenText: "النص الظاهر على الصورة",
      ideaMainMessage: "الرسالة الأساسية",
      ideaSlides: "تفاصيل الشرائح",
      bioText: "نص النبذة",
      bioPositioning: "زاوية التموضع",
      bioValueProposition: "القيمة المقدمة",
      geminiQuotaError: "وصل Gemini إلى حد الطلبات. لم يتم إنشاء أي محتوى. راجع الحصة والفوترة في Google AI Studio أو أعد المحاولة بعد تجدد الحصة.",
      geminiRateLimitError: "Gemini يتلقى طلبات كثيرة حالياً. لم يتم إنشاء أي محتوى؛ أعد المحاولة لاحقاً.",
      geminiUnavailableError: "خدمة Gemini غير متاحة مؤقتاً. لم يتم إنشاء أي محتوى؛ أعد المحاولة لاحقاً.",
      geminiConfigurationError: "خدمة Gemini غير مُهيأة بشكل صحيح. راجع مفتاح API وإعدادات المشروع على الخادم.",
      geminiInvalidResponseError: "لم يُرجع Gemini محتوى صالحاً. لم يتم إنشاء أي محتوى؛ أعد المحاولة لاحقاً."
    }
  },
  fr: {
    brand: "Creator Pilot",
    tagline: "Plateforme de stratégie de contenu fondée sur les faits pour créateurs professionnels",
    landing: {
      heroKicker: "Intelligence stratégique pour créateurs arabophones et francophones",
      heroTitle: "Publiez ce qui produit un réel impact, fondé sur des signaux vérifiés",
      heroSubtitle: "Pas de fausses promesses de viralité. CreatorPilot détecte les signaux émergents, analyse votre audience avec rigueur et livre des plans 48h et 7 jours accompagnés de scripts immédiatement exploitables.",
      startFree: "Configurer votre marque gratuitement",
      seeDemo: "Explorer le tableau de décision",
      evidenceHeading: "Une approche fondée sur les faits, pas sur des suppositions",
      evidenceSubtitle: "Chaque idée de contenu est reliée à une source attestée et à un niveau de confiance mesuré avant toute décision de publication.",
      stat1Label: "Heures gagnées par semaine",
      stat1Value: "12+ h",
      stat2Label: "Précision d'adéquation à l'audience",
      stat2Value: "94%",
      stat3Label: "Validation humaine obligatoire",
      stat3Value: "100%",
      featuresHeading: "Une suite complète pour créateurs, consultants et experts",
      trendRadarTitle: "Radar de tendances vérifiées",
      trendRadarDesc: "Détection des signaux montants depuis des sources ouvertes et officielles, avec évaluation de fraîcheur, déclin et pertinence de niche.",
      decisionBoardTitle: "Tableau de décision hiérarchisé",
      decisionBoardDesc: "Recommandations priorisées explicitant le pourquoi, les incertitudes, et la meilleure approche avec angle et accroche.",
      calendarTitle: "Calendrier stratégique 48h et 7 jours",
      calendarDesc: "Planification interactive et réversible avec révision et approbation humaine de chaque script avant diffusion.",
      instagramTitle: "Statistiques Instagram officielles & sécurisées",
      instagramDesc: "Analyse officielle des métriques de portée et d'engagement via l'API Meta autorisée, sans jamais demander vos mots de passe.",
      trustedBy: "Adopté par des consultants, formateurs et créateurs en région MENA et en Europe",
      testimonialsHeading: "Retours d'expérience de créateurs",
      ctaHeading: "Transformez votre contenu en levier de croissance mesurable",
      ctaSubheading: "Rejoignez les créateurs qui privilégient la rigueur méthodologique et la clarté stratégique.",
      enterWorkspace: "Accéder à l'espace de travail"
    },
    nav: {
      dashboard: "Tableau de bord",
      decisionBoard: "Décisions de publication",
      calendar: "Calendrier stratégique",
      trends: "Radar de tendances",
      analytics: "Analytique Instagram",
      contentLibrary: "Bibliothèque de contenu",
      brandStudio: "Studio de marque",
      integrations: "Intégrations & API",
      settings: "Paramètres & Langues",
      logout: "Déconnexion",
      signIn: "Connexion",
      signUp: "Créer un compte",
      onboarding: "Configuration initiale",
      quickGenerate: "Génération rapide",
      switchWorkspace: "Changer d'espace"
    },
    common: {
      save: "Enregistrer",
      saved: "Enregistré avec succès",
      saving: "Enregistrement en cours...",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      copy: "Copier le texte",
      copied: "Copié !",
      export: "Exporter",
      filter: "Filtrer",
      all: "Tous",
      refresh: "Actualiser les signaux",
      loading: "Chargement...",
      approved: "Approuvé pour diffusion",
      draft: "Brouillon en édition",
      scheduled: "Planifié",
      proposed: "Recommandé par le système",
      published: "Publié",
      dismissed: "Écarté",
      confidence: "Niveau de confiance",
      freshness: "Fraîcheur",
      evidence: "Preuve & Source",
      rationale: "Justification stratégique",
      uncertainty: "Incertitudes & limites",
      format: "Format",
      hook: "Accroche (Hook)",
      outline: "Structure du script",
      cta: "Appel à l'action (CTA)",
      caption: "Légende",
      status: "Statut",
      actions: "Actions",
      source: "Source",
      hours48: "Plan 48 heures",
      days7: "Plan 7 jours",
      language: "Langue",
      success: "Opération réussie",
      error: "Une erreur inattendue est survenue",
      search: "Rechercher du contenu ou des signaux...",
      viewDetails: "Voir les détails",
      humanApprovalNotice: "Validation humaine impérative avant toute action de publication."
    },
    dashboard: {
      welcome: "Bienvenue sur CreatorPilot",
      overviewSubtitle: "Synthèse de vos priorités éditoriales et des signaux émergents pour votre audience",
      priorityActionTitle: "Action prioritaire du jour",
      priorityActionDesc: "Signal d'intérêt en hausse sur votre thématique avec pic de recherche sur les dernières 24h.",
      next48Hours: "Contenus prévus pour les 48 prochaines heures",
      radarAlerts: "Alertes du radar de tendances",
      quickTools: "Outils de génération stratégique",
      generateIdeas: "Idées & scripts complets",
      generateBio: "Optimisation de biographie",
      generateStrategy: "Stratégie à 4 piliers",
      generateProduct: "Proposition de produit digital",
      recentDrafts: "Brouillons récents",
      growthKpis: "Indicateurs clés de performance",
      viewAllCalendar: "Voir tout le calendrier",
      viewAllDecisions: "Voir toutes les recommandations"
    },
    decisionBoard: {
      title: "Tableau de décision stratégique",
      subtitle: "Recommandations de contenu classées selon l'adéquation à votre marque, la fraîcheur du signal et la solidité des preuves.",
      rankedRationale: "Priorités éditoriales ordonnées",
      filterByPlatform: "Plateforme",
      filterByConfidence: "Confiance",
      addToCalendar: "Ajouter au calendrier",
      editDraft: "Éditer le brouillon",
      dismiss: "Écarter",
      whyRecommended: "Pourquoi cette recommandation ?",
      whatIsUncertain: "Points d'attention et incertitudes",
      suggestedHook: "Accroche recommandée",
      suggestedOutline: "Structure narrative",
      evidenceStrength: "Force de la preuve",
      verifiedSourcesOnly: "Sources vérifiées uniquement"
    },
    calendar: {
      title: "Calendrier stratégique & planification",
      subtitle: "Gestion rigoureuse des brouillons, plans 48h et 7 jours, et contrôle humain avant publication.",
      view48h: "Plan d'action 48 heures",
      view7d: "Feuille de route 7 jours",
      createItem: "Créer une publication",
      itemTitle: "Titre ou sujet",
      platform: "Plateforme",
      scheduledTime: "Date & heure prévues",
      approveItem: "Approuver le contenu",
      publishSafeNotice: "Aucune publication automatique : toute diffusion nécessite votre validation manuelle préalable.",
      emptyPlan: "Aucun élément planifié pour cette période.",
      generatePlanPrompt: "Générez un plan stratégique sur mesure calqué sur vos 4 piliers éditoriaux.",
      generate48hBtn: "Générer le plan 48h",
      generate7dBtn: "Générer le plan 7 jours",
      exportCsv: "Exporter en CSV",
      exportMarkdown: "Exporter en Markdown"
    },
    trends: {
      title: "Radar de tendances et signaux de marché",
      subtitle: "Veille continue des sujets émergents avec transparence intégrale sur les sources et dates de collecte.",
      integrityTitle: "Transparence des sources dans Creator Pilot",
      integrityDescription: "Nous n’inventons pas de signaux et ne présentons pas l’intérêt de recherche comme une preuve de performance sur une plateforme. Les sources vérifiées et les données de démonstration sont distinguées, avec leurs limites.",
      lastUpdated: "Dernière actualisation des signaux",
      signalFeed: "Flux des signaux observés",
      nicheRelevance: "Pertinence de niche",
      signalStrength: "Intensité du signal",
      allSignals: "Tous les signaux",
      verifiedOnly: "Sources vérifiées uniquement",
      demoOnly: "Données de démonstration",
      velocityUnit: "vélocité",
      categoryAndNiche: "Catégorie et niche",
      audienceFit: "Adéquation à l’audience",
      estimatedAge: "Ancienneté estimée",
      daysUnit: "jours",
      createFromTrend: "Créer une idée de contenu",
      noVerifiedMetric: "Indisponible — données de démonstration",
      sourceNotVerified: "Exemple non vérifié",
      sourceLink: "Lien de la source",
      freshnessDays: "Ancienneté",
      decayStatus: "Statut d'obsolescence",
      verifiedBadge: "Source vérifiée",
      demoBadge: "Jeu de données de test",
      searchPlaceholder: "Rechercher par mot-clé ou source...",
      refreshSignals: "Actualiser les signaux",
      addCustomSource: "Ajouter une source autorisée"
    },
    analytics: {
      title: "Statistiques et performance Instagram",
      subtitle: "Lecture des données officielles via Meta Graph API pour enrichir vos prochaines décisions de contenu.",
      connectionStatus: "État de connexion du compte",
      officialMetaNotice: "Connexion sécurisée via le flux officiel OAuth de Meta. Nous ne demandons ni ne stockons jamais votre mot de passe.",
      reachMetric: "Comptes touchés (Reach)",
      impressionsMetric: "Impressions totales",
      profileVisitsMetric: "Visites du profil",
      engagementRate: "Taux d'engagement",
      topReels: "Meilleurs Reels en performance",
      audienceBreakdown: "Répartition géographique et linguistique",
      historicalSnapshots: "Historique des instantanés",
      reconnectAccount: "Vérifier l'autorisation Meta",
      disconnectAccount: "Déconnecter le compte"
    },
    brandStudio: {
      title: "Studio de marque et positionnement",
      subtitle: "Définition précise de votre niche, de votre audience cible, du ton de votre voix et de vos 4 piliers.",
      brandName: "Nom de la marque ou du profil",
      niche: "Niche et expertise",
      targetAudience: "Audience cible et problèmes résolus",
      voiceTone: "Tonalité et style d'expression",
      primaryOffer: "Offre principale, produit ou service",
      contentLanguage: "Langue par défaut du contenu produit",
      contentDialect: "Variante dialectale (arabe standard ou darija)",
      contentPillars: "Les 4 piliers éditoriaux (Autorité, Empathie, Conversion, Action)",
      constraints: "Contraintes et sujets exclus",
      saveBrandProfile: "Enregistrer le profil de marque",
      generateAllPillars: "Générer des piliers stratégiques"
    },
    contentLibrary: {
      title: "Bibliothèque de contenu & brouillons",
      subtitle: "Répertoire centralisé de vos scripts, accroches, biographies et concepts de produits numériques.",
      searchLibrary: "Rechercher dans la bibliothèque...",
      typeFilter: "Type de document",
      allTypes: "Tous les types",
      ideas: "Idées & concepts",
      scripts: "Scripts détaillés",
      bios: "Variantes de biographie",
      strategies: "Stratégies éditoriales",
      digitalProducts: "Produits numériques",
      emptyLibrary: "Aucun document sauvegardé pour le moment. Créez votre premier brouillon !"
    },
    integrations: {
      title: "Intégrations et connecteurs autorisés",
      subtitle: "Supervision transparente des connexions aux API externes et aux flux de données officiels.",
      metaInstagram: "Meta Graph API pour Instagram",
      metaDesc: "Analyse officielle des métriques de portée et d'engagement de votre compte professionnel.",
      connectMeta: "Configurer Meta OAuth",
      googleTrends: "Tendances de recherche Google",
      googleTrendsDesc: "Suivi de l'évolution de la demande globale pour calibrer le timing éditorial.",
      rssSources: "Flux RSS & revues spécialisées",
      rssSourcesDesc: "Veille sectorielle continue depuis des sources accréditées.",
      statusConnected: "Connecté et opérationnel",
      statusUnconfigured: "Non configuré (en attente de clés/permissions)",
      statusReady: "Prêt pour activation",
      configureKeys: "Guide de configuration des clés",
      officialSecurityBanner: "Sécurité & Confidentialité : Aucun mot de passe n'est collecté. Seuls des jetons chiffrés avec permissions restreintes sont employés."
    },
    settings: {
      title: "Paramètres, sécurité et langue",
      subtitle: "Gestion de l'interface, des règles de sécurité et consultation du journal d'audit.",
      interfaceLanguage: "Langue de l'interface et orientation",
      accountSecurity: "Sécurité du compte et sessions",
      apiKeyConfig: "Moteur de génération IA",
      apiKeyNote: "La clé API Gemini est hébergée côté serveur en toute sécurité sans exposition client.",
      auditLogs: "Journal d'audit de sécurité (Audit Logs)",
      privacyNotice: "Vos données éditoriales restent strictement privées et ne servent à aucun entraînement public.",
      exportData: "Exporter l'ensemble des données (JSON)"
    },
    auth: {
      fullNameLabel: "Nom complet",
      fullNamePlaceholder: "ex. Jean Dupont ou Nom de Créateur",
      emailLabel: "Adresse e-mail",
      emailPlaceholder: "createur@creatorpilot.io",
      passwordLabel: "Mot de passe",
      demoLoginBtn: "Accéder avec le compte de démonstration (Amina Demo)",
      demoNote: "Ou pour tester immédiatement",
      haveAccount: "Vous avez déjà un compte ?",
      noAccount: "Pas encore de compte ?",
      emailAlreadyExists: "Cette adresse e-mail est déjà utilisée. Connectez-vous au lieu de créer un nouveau compte.",
      signupRateLimited: "La limite temporaire d'inscriptions a été atteinte. Attendez un peu avant de réessayer."
    },
    onboarding: {
      step: "Étape",
      of: "sur",
      step1Title: "Nom de marque et positionnement de niche",
      step1Desc: "La définition précise de votre domaine permet de calibrer le radar de signaux et les stratégies",
      brandNameLabel: "Nom de la marque ou du profil",
      brandNamePlaceholder: "ex. Agence Média — Conseil Stratégique",
      nicheLabel: "Domaine d'expertise précis (Niche)",
      nichePlaceholder: "ex. Accompagner les consultants et formateurs à monétiser leur savoir via des ateliers numériques",
      step2Title: "Audience cible et tonalité d'expression",
      step2Desc: "Précisez à qui vous vous adressez et quelle voix inspire confiance et engagement",
      audienceLabel: "Audience cible et problématiques résolues",
      audiencePlaceholder: "ex. Consultants indépendants, formateurs et créateurs de contenu en Europe et Afrique du Nord",
      voiceToneLabel: "Tonalité et personnalité",
      voiceTonePlaceholder: "ex. Direct, analytique, pédagogique, orienté résultats",
      step3Title: "Offre principale et parcours de conversion",
      step3Desc: "Le produit ou service vers lequel vous orientez votre audience pour générer des revenus",
      primaryOfferLabel: "Offre principale (Primary Offer)",
      primaryOfferPlaceholder: "ex. Atelier intensif en ligne et coaching individuel d'accompagnement",
      pillarsNotice: "Le modèle d'équilibre à 4 piliers (Autorité, Empathie, Conversion, Action) est activé pour votre marque.",
      prev: "Précédent",
      next: "Suivant",
      finish: "Finaliser et accéder à l'espace"
    },
    generator: {
      modalTitle: "Suite de génération stratégique",
      formatLabel: "Format de publication souhaité",
      formatReel: "Vidéo Reel (Reel)",
      formatCarousel: "Carrousel multi-visuels (Carousel)",
      formatPost: "Publication simple texte & image (Post)",
      customTopic: "Focus ou angle spécifique (optionnel)",
      customTopicPlaceholder: "ex. Tarification d'offres et dépassement de la peur de la caméra",
      generateBtn: "Générer maintenant",
      generating: "Analyse stratégique et génération en cours...",
      readyTitle: "Prêt pour la génération stratégique",
      readyDesc: "Cliquez sur Générer pour concevoir des concepts alignés sur votre niche et vos piliers éditoriaux.",
      whyItWorks: "Pourquoi cette formule fonctionne :",
      saveToLibrary: "Sauvegarder dans la bibliothèque",
      addAllToCalendar: "Ajouter tous les éléments au calendrier",
      itemsProposed: "Éléments suggérés",
      requiredAction: "Action requise :",
      savePillars: "Approuver et enregistrer les piliers",
      strategyAudienceProblems: "Problèmes du public",
      strategyThemes: "Thèmes",
      strategyTopics: "Exemples de sujets concrets",
      strategyFormats: "Formats recommandés",
      strategyOffer: "Lien avec l’offre",
      strategyCtas: "Types d’appel à l’action",
      strategyWhy: "Importance du pilier",
      ideaVisualConcept: "Concept visuel",
      ideaOnScreenText: "Texte à l’écran",
      ideaMainMessage: "Message principal",
      ideaSlides: "Détail des diapositives",
      bioText: "Texte de la biographie",
      bioPositioning: "Angle de positionnement",
      bioValueProposition: "Proposition de valeur",
      geminiQuotaError: "La limite de requêtes Gemini est atteinte. Aucun contenu n’a été généré. Vérifiez le quota et la facturation dans Google AI Studio ou réessayez après son renouvellement.",
      geminiRateLimitError: "Gemini reçoit trop de requêtes actuellement. Aucun contenu n’a été généré ; réessayez plus tard.",
      geminiUnavailableError: "Gemini est temporairement indisponible. Aucun contenu n’a été généré ; réessayez plus tard.",
      geminiConfigurationError: "Gemini n’est pas correctement configuré. Vérifiez la clé API et le projet côté serveur.",
      geminiInvalidResponseError: "Gemini n’a pas renvoyé de contenu valide. Aucun contenu n’a été généré ; réessayez plus tard."
    }
  },
  en: {
    brand: "Creator Pilot",
    tagline: "Evidence-backed content strategy platform for professional creators",
    landing: {
      heroKicker: "Strategic Content Intelligence for Modern Creators",
      heroTitle: "Publish What Delivers Real Results, Backed by Verified Signals",
      heroSubtitle: "No empty virality promises. CreatorPilot tracks rising signals, analyzes your audience with rigor, and delivers evidence-backed 48-hour and 7-day plans with fully editable scripts.",
      startFree: "Configure Your Brand for Free",
      seeDemo: "Explore Decision Board",
      evidenceHeading: "Built on Evidence, Never on Guesswork",
      evidenceSubtitle: "We link every content concept to a real verified source with transparent confidence scores and documented uncertainties before publishing.",
      stat1Label: "Weekly Planning Hours Saved",
      stat1Value: "12+ hrs",
      stat2Label: "Audience Fit Accuracy",
      stat2Value: "94%",
      stat3Label: "Human Approval Enforcement",
      stat3Value: "100%",
      featuresHeading: "A Complete Architecture for Creators, Coaches, and Consultants",
      trendRadarTitle: "Verified Trend Radar",
      trendRadarDesc: "Discover emerging signals from permitted open sources, evaluating freshness, trend decay, and niche fit.",
      decisionBoardTitle: "Ranked Decision Board",
      decisionBoardDesc: "Prioritized recommendations explaining why they matter, what is uncertain, and the optimal hook and angle.",
      calendarTitle: "Interactive 48h & 7-Day Calendar",
      calendarDesc: "Flexible planning with human review and mandatory approval before any publishing action.",
      instagramTitle: "Official Instagram Insights",
      instagramDesc: "Authorized reach and engagement metrics via official Meta APIs without ever requesting your password.",
      trustedBy: "Trusted by educators, consultants, and creators across MENA and international markets",
      testimonialsHeading: "Creator Case Studies",
      ctaHeading: "Turn Your Content Strategy into an Evidence-Backed Engine",
      ctaSubheading: "Join creators who choose grounded data and clarity over algorithmic exhaustion.",
      enterWorkspace: "Enter Workspace"
    },
    nav: {
      dashboard: "Dashboard",
      decisionBoard: "Decision Board",
      calendar: "Content Calendar",
      trends: "Trend Radar",
      analytics: "Instagram Analytics",
      contentLibrary: "Content Library",
      brandStudio: "Brand Studio",
      integrations: "Integrations",
      settings: "Settings & Language",
      logout: "Log Out",
      signIn: "Sign In",
      signUp: "Create Account",
      onboarding: "Brand Onboarding",
      quickGenerate: "Quick Generate",
      switchWorkspace: "Switch Workspace"
    },
    common: {
      save: "Save Changes",
      saved: "Saved successfully",
      saving: "Saving...",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      copy: "Copy Text",
      copied: "Copied!",
      export: "Export",
      filter: "Filter",
      all: "All",
      refresh: "Refresh Signals",
      loading: "Loading...",
      approved: "Approved for Publishing",
      draft: "Draft in Progress",
      scheduled: "Scheduled",
      proposed: "System Proposed",
      published: "Published",
      dismissed: "Dismissed",
      confidence: "Confidence Score",
      freshness: "Freshness",
      evidence: "Evidence & Source",
      rationale: "Strategic Rationale",
      uncertainty: "Evidence Limitations & Uncertainty",
      format: "Content Format",
      hook: "Opening Hook",
      outline: "Script Outline",
      cta: "Call to Action (CTA)",
      caption: "Caption",
      status: "Status",
      actions: "Actions",
      source: "Source",
      hours48: "48-Hour Plan",
      days7: "7-Day Plan",
      language: "Language",
      success: "Success",
      error: "An unexpected error occurred",
      search: "Search content, drafts, or signals...",
      viewDetails: "View Full Details",
      humanApprovalNotice: "Human review and approval is required before any publishing action."
    },
    dashboard: {
      welcome: "Welcome to CreatorPilot",
      overviewSubtitle: "Strategic priorities and rising market signals tailored to your brand",
      priorityActionTitle: "Top Priority Publishing Opportunity",
      priorityActionDesc: "Rising signal detected in your core niche with search velocity up over the past 24 hours.",
      next48Hours: "Scheduled for Next 48 Hours",
      radarAlerts: "Trend Radar Signals",
      quickTools: "Strategic Generation Suite",
      generateIdeas: "Ideas & Scripts",
      generateBio: "Optimized Bio",
      generateStrategy: "4-Pillars Strategy",
      generateProduct: "Digital Product Blueprint",
      recentDrafts: "Recent Content Drafts",
      growthKpis: "Performance Indicators",
      viewAllCalendar: "View Full Calendar",
      viewAllDecisions: "View All Ranked Decisions"
    },
    decisionBoard: {
      title: "Evidence-Backed Decision Board",
      subtitle: "Content recommendations ranked by brand alignment, signal freshness, and documented confidence.",
      rankedRationale: "Ranked Strategic Priorities",
      filterByPlatform: "Platform",
      filterByConfidence: "Confidence Level",
      addToCalendar: "Add to Calendar",
      editDraft: "Edit Draft",
      dismiss: "Dismiss",
      whyRecommended: "Why is this recommended?",
      whatIsUncertain: "What is uncertain / Limitations",
      suggestedHook: "Suggested Opening Hook",
      suggestedOutline: "Script Outline",
      evidenceStrength: "Evidence Strength",
      verifiedSourcesOnly: "Verified Sources Only"
    },
    calendar: {
      title: "Content Calendar & Execution Plans",
      subtitle: "Manage drafts, 48-hour tactical schedules, 7-day roadmaps, and enforce publishing approval.",
      view48h: "48-Hour Tactical Plan",
      view7d: "7-Day Strategic Roadmap",
      createItem: "New Content Item",
      itemTitle: "Post Title or Topic",
      platform: "Target Platform",
      scheduledTime: "Scheduled Time",
      approveItem: "Approve Content",
      publishSafeNotice: "No content is published automatically: explicit manual approval is always required.",
      emptyPlan: "No items scheduled for this timeframe yet.",
      generatePlanPrompt: "Generate a personalized plan aligned with your 4 brand pillars.",
      generate48hBtn: "Generate 48h Plan",
      generate7dBtn: "Generate 7d Plan",
      exportCsv: "Export to CSV",
      exportMarkdown: "Export to Markdown"
    },
    trends: {
      title: "Trend Radar & Market Signals",
      subtitle: "Continuous monitoring of rising search and discussion topics with full source provenance.",
      integrityTitle: "Source integrity in Creator Pilot",
      integrityDescription: "We do not invent signals or treat search interest as proof of performance on a specific platform. Verified sources and demo data are distinguished, with their limitations shown.",
      lastUpdated: "Last signal check",
      signalFeed: "Observed Signals",
      nicheRelevance: "Niche Fit",
      signalStrength: "Signal Velocity",
      allSignals: "All Signals",
      verifiedOnly: "Verified Sources Only",
      demoOnly: "Demo Data",
      velocityUnit: "velocity",
      categoryAndNiche: "Category & Niche",
      audienceFit: "Audience Fit",
      estimatedAge: "Estimated Age",
      daysUnit: "days",
      createFromTrend: "Turn into a content idea",
      noVerifiedMetric: "Unavailable — demo data",
      sourceNotVerified: "Unverified example",
      sourceLink: "Source Link",
      freshnessDays: "Signal Age",
      decayStatus: "Decay Status",
      verifiedBadge: "Verified Source",
      demoBadge: "Demo Dataset",
      searchPlaceholder: "Search keywords, topics, or sources...",
      refreshSignals: "Refresh Trend Signals",
      addCustomSource: "Add Authorized Source"
    },
    analytics: {
      title: "Instagram Insights & Performance",
      subtitle: "Official Meta Graph API metrics to inform future evidence-based content decisions.",
      connectionStatus: "Account Connection Status",
      officialMetaNotice: "Connected exclusively via official Meta OAuth. We never request or store your password.",
      reachMetric: "Accounts Reached",
      impressionsMetric: "Total Impressions",
      profileVisitsMetric: "Profile Visits",
      engagementRate: "Engagement Rate",
      topReels: "Top Performing Reels",
      audienceBreakdown: "Geographic & Linguistic Breakdown",
      historicalSnapshots: "Historical Snapshots",
      reconnectAccount: "Verify Meta Authorization",
      disconnectAccount: "Disconnect Account Safely"
    },
    brandStudio: {
      title: "Brand Studio & Strategy Core",
      subtitle: "Configure your niche, target audience, brand voice, core offer, and content pillars.",
      brandName: "Brand or Creator Name",
      niche: "Niche & Domain",
      targetAudience: "Target Audience & Core Problem Solved",
      voiceTone: "Voice Tone & Personality",
      primaryOffer: "Primary Offer, Product, or Service",
      contentLanguage: "Default Content Output Language",
      contentDialect: "Content Dialect (Modern Standard Arabic or Algerian Darija)",
      contentPillars: "The 4 Content Pillars (Authority, Empathy, Conversion, Action)",
      constraints: "Publishing Constraints & Excluded Topics",
      saveBrandProfile: "Save Brand Profile",
      generateAllPillars: "Generate Strategic Pillars"
    },
    contentLibrary: {
      title: "Content Library & Saved Drafts",
      subtitle: "Centralized repository for scripts, hooks, bios, content strategies, and digital products.",
      searchLibrary: "Search content library...",
      typeFilter: "Item Type",
      allTypes: "All Types",
      ideas: "Ideas & Outlines",
      scripts: "Full Scripts",
      bios: "Bio Variations",
      strategies: "Content Strategies",
      digitalProducts: "Digital Products",
      emptyLibrary: "No content items saved yet. Generate or draft your first item!"
    },
    integrations: {
      title: "Integrations & Authorized Connectors",
      subtitle: "Manage connections to official external APIs and data streams transparently.",
      metaInstagram: "Meta Graph API for Instagram",
      metaDesc: "Official reach and engagement insights for authorized professional accounts.",
      connectMeta: "Set up Meta OAuth",
      googleTrends: "Google Trends Public Indicators",
      googleTrendsDesc: "Broad search interest volume indicators to calibrate publishing timing.",
      rssSources: "Curated RSS & Newsfeeds",
      rssSourcesDesc: "Continuous industry monitoring from documented, permitted publications.",
      statusConnected: "Connected & Active",
      statusUnconfigured: "Unconfigured (Awaiting API credentials)",
      statusReady: "Ready for Activation",
      configureKeys: "API Configuration Guide",
      officialSecurityBanner: "Security & Privacy: Passwords are never collected. All integrations rely on encrypted OAuth tokens with least-privilege permissions."
    },
    settings: {
      title: "Settings, Security & Preferences",
      subtitle: "Manage interface localization, security controls, and review audit trail logs.",
      interfaceLanguage: "Interface Language & Reading Direction",
      accountSecurity: "Account Authentication & Sessions",
      apiKeyConfig: "AI Generation Engine",
      apiKeyNote: "Gemini API key is securely managed server-side without exposing keys to the browser.",
      auditLogs: "Security Audit Trail",
      privacyNotice: "Your brand data and drafts are private and never used to train public models without consent.",
      exportData: "Export All Account Data (JSON)"
    },
    auth: {
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "e.g. Alex Morgan or Creator Brand",
      emailLabel: "Email Address",
      emailPlaceholder: "creator@creatorpilot.io",
      passwordLabel: "Password",
      demoLoginBtn: "Continue with Amina Demo Account",
      demoNote: "Or test with instant demo workspace",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account yet?",
      emailAlreadyExists: "This email address is already registered. Sign in instead of creating a new account.",
      signupRateLimited: "Too many signup attempts were made. Please wait a while before trying again."
    },
    onboarding: {
      step: "Step",
      of: "of",
      step1Title: "Brand Identity & Niche Domain",
      step1Desc: "Defining your identity and niche enables precise trend filtering and tailored strategic planning",
      brandNameLabel: "Brand or Creator Name",
      brandNamePlaceholder: "e.g. Apex Strategy — Growth & Consulting",
      nicheLabel: "Exact Niche & Domain",
      nichePlaceholder: "e.g. Helping tech consultants and educators build high-impact digital offers",
      step2Title: "Target Audience & Brand Voice",
      step2Desc: "Specify who you solve problems for and the exact tone that establishes authority",
      audienceLabel: "Target Audience & Problems Solved",
      audiencePlaceholder: "e.g. Independent consultants, founders, and educators in US and international markets",
      voiceToneLabel: "Brand Voice & Personality",
      voiceTonePlaceholder: "e.g. Direct, evidence-backed, analytical, actionable, no fluff",
      step3Title: "Primary Offer & Conversion Funnel",
      step3Desc: "The core service, workshop, or product that your content directs attention towards",
      primaryOfferLabel: "Primary Offer",
      primaryOfferPlaceholder: "e.g. 1-on-1 Strategy Cohorts & Sprint Advisory Workshops",
      pillarsNotice: "The 4-Pillars Framework (Authority, Empathy, Conversion, Action) has been automatically activated for your brand.",
      prev: "Previous",
      next: "Next",
      finish: "Finish & Enter Workspace"
    },
    generator: {
      modalTitle: "Strategic Generation Suite",
      formatLabel: "Target Content Format",
      formatReel: "Video Reel (Reel)",
      formatCarousel: "Multi-Slide Carousel (Carousel)",
      formatPost: "Single Post with Caption (Post)",
      customTopic: "Custom Focus / Topic (Optional)",
      customTopicPlaceholder: "e.g. Overcoming camera fear and pricing 1-on-1 consulting",
      generateBtn: "Generate Now",
      generating: "Generating strategic concepts with AI engine...",
      readyTitle: "Ready for Strategic Generation",
      readyDesc: "Click Generate Now to create structured proposals tailored to your brand pillars and target audience.",
      whyItWorks: "Why this formula works:",
      saveToLibrary: "Save to Library",
      addAllToCalendar: "Add All Items to Calendar",
      itemsProposed: "Proposed Content Items",
      requiredAction: "Required Action:",
      savePillars: "Approve and save pillars",
      strategyAudienceProblems: "Audience problems",
      strategyThemes: "Content themes",
      strategyTopics: "Concrete topic examples",
      strategyFormats: "Recommended formats",
      strategyOffer: "Offer connection",
      strategyCtas: "CTA types",
      strategyWhy: "Why this pillar matters",
      ideaVisualConcept: "Visual concept",
      ideaOnScreenText: "On-screen text",
      ideaMainMessage: "Main message",
      ideaSlides: "Slide breakdown",
      bioText: "Bio text",
      bioPositioning: "Positioning angle",
      bioValueProposition: "Value proposition",
      geminiQuotaError: "Gemini's request quota has been reached. No content was generated. Check quota and billing in Google AI Studio, or try again after the quota resets.",
      geminiRateLimitError: "Gemini is receiving too many requests right now. No content was generated; try again later.",
      geminiUnavailableError: "Gemini is temporarily unavailable. No content was generated; try again later.",
      geminiConfigurationError: "Gemini is not configured correctly. Check the server-side API key and Google AI Studio project.",
      geminiInvalidResponseError: "Gemini did not return valid content. No content was generated; try again later."
    }
  }
};
