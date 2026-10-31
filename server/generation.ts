import type { BrandContext } from './agent.ts';
import { normalizeOutputLocale } from './locales.ts';

export type ContentPlanHorizon = '48h' | '7d';

export interface VerifiedTrendEvidence {
  title: string;
  source: string;
  sourceUrl: string;
  freshnessDays: number;
}

type PlanLanguage = 'en' | 'fr' | 'ar' | 'ar_dz';

export interface BrandPillarContext {
  id: string;
  name: string;
  desc: string;
}

interface GenerationBrand extends BrandContext {
  pillars?: BrandPillarContext[];
}

interface PlanItem {
  id: string;
  day: string;
  date: string;
  time?: unknown;
  platform: string;
  format: string;
  title: string;
  pillar: string;
  topic: string;
  audienceProblem: string;
  objective: string;
  hook: string;
  mainMessage: string;
  caption: string;
  cta: string;
  preparationTasks: string[];
  rationale: string;
  evidenceReferences: string[];
  actionNeeded: string;
}

interface PlanResponse {
  plan: PlanItem[];
}

const planCopy = {
  en: {
    platform: 'Instagram',
    formats: ['Carousel', 'Reels', 'Single post', 'Stories'],
    roles: ['Educational', 'Authority', 'Engagement', 'Conversion'],
    topics: [
      (niche: string) => `One practical question people ask about ${niche}`,
      (niche: string) => `A decision-making framework for ${niche}`,
      (niche: string) => `A useful discussion about common challenges in ${niche}`,
      (niche: string) => `How to evaluate whether an offer in ${niche} fits your needs`,
    ],
    hooks: [
      (audience: string, niche: string) => `If you are working in ${niche}, which part feels hardest for you right now?`,
      (audience: string, niche: string) => `Before you try another approach to ${niche}, check these three questions.`,
      (audience: string, niche: string) => `What is one challenge ${audience} face that deserves a more practical answer?`,
      (audience: string, niche: string) => `Choosing a solution for ${niche}? Start with the problem you need solved.`,
    ],
    messages: [
      (niche: string, audience: string, _offer: string) => `Explain one useful concept in ${niche} in plain language, then give ${audience} a small step they can try.`,
      (niche: string, _audience: string, _offer: string) => `Share a transparent decision framework for ${niche}. Do not imply personal results or credentials that were not provided.`,
      (niche: string, audience: string, _offer: string) => `Invite ${audience} to compare experiences and identify which part of ${niche} needs more explanation.`,
      (_niche: string, _audience: string, offer: string) => `Explain who ${offer} is intended for, what it includes, and how someone can decide whether it suits their needs.`,
    ],
    ctas: [
      'Save this explanation and try the step that is most relevant to you.',
      'Which part would you like to see explained in more detail?',
      'Share your perspective or question in the comments.',
      'Review the offer details and ask a question before deciding.',
    ],
    tasks: [
      ['Outline the concept', 'Create a simple visual or slide sequence', 'Review the caption for clarity'],
      ['Choose a framework relevant to the brand', 'Prepare a clear example without unsupported claims', 'Review the final script'],
      ['Write one focused discussion question', 'Prepare a story or post prompt', 'Check that the invitation is respectful'],
      ['Confirm the offer details are accurate', 'Prepare a clear summary of who it is for', 'Review the CTA for pressure-free wording'],
    ],
    rationale: [
      'A concise educational post offers a practical starting point for the audience.',
      'A transparent framework demonstrates the brand’s point of view without inventing results.',
      'An open question helps surface audience needs for future content.',
      'Clear offer information supports informed decisions without making every post promotional.',
    ],
  },
  fr: {
    platform: 'Instagram',
    formats: ['Carrousel', 'Reel', 'Publication', 'Stories'],
    roles: ['Pédagogie', 'Expertise', 'Échange', 'Conversion'],
    topics: [
      (niche: string) => `Une question pratique fréquente sur ${niche}`,
      (niche: string) => `Un cadre de décision utile en ${niche}`,
      (niche: string) => `Un échange autour des difficultés courantes en ${niche}`,
      (niche: string) => `Comment évaluer une offre liée à ${niche}`,
    ],
    hooks: [
      (audience: string, niche: string) => `Vous travaillez dans ${niche} ? Quelle difficulté vous freine le plus en ce moment ?`,
      (audience: string, niche: string) => `Avant d’essayer une nouvelle méthode en ${niche}, posez-vous ces trois questions.`,
      (audience: string, niche: string) => `Quel problème des ${audience} mérite une réponse plus concrète ?`,
      (audience: string, niche: string) => `Pour choisir une solution en ${niche}, commencez par définir le problème à résoudre.`,
    ],
    messages: [
      (niche: string, audience: string, _offer: string) => `Expliquez simplement un concept utile en ${niche}, puis proposez aux ${audience} une petite étape à tester.`,
      (niche: string, _audience: string, _offer: string) => `Présentez un cadre de décision transparent en ${niche}, sans inventer de résultats ni de qualifications.`,
      (niche: string, audience: string, _offer: string) => `Invitez les ${audience} à partager leurs expériences et les aspects de ${niche} qui restent difficiles à comprendre.`,
      (_niche: string, _audience: string, offer: string) => `Précisez à qui s’adresse ${offer}, ce qu’elle comprend et comment évaluer si elle répond au besoin.`,
    ],
    ctas: [
      'Enregistrez cette explication et testez l’étape la plus utile pour vous.',
      'Quel point souhaitez-vous voir expliqué plus en détail ?',
      'Partagez votre expérience ou votre question en commentaire.',
      'Consultez les détails de l’offre et posez vos questions avant de décider.',
    ],
    tasks: [
      ['Définir le concept à expliquer', 'Préparer un visuel simple ou quelques diapositives', 'Relire la légende'],
      ['Choisir un cadre adapté à la marque', 'Préparer un exemple sans affirmation non vérifiée', 'Relire le script'],
      ['Rédiger une question de discussion précise', 'Préparer un format story ou publication', 'Vérifier le ton de l’invitation'],
      ['Vérifier les informations de l’offre', 'Préparer un résumé clair du public concerné', 'Relire l’appel à l’action'],
    ],
    rationale: [
      'Un contenu pédagogique concis propose un premier pas concret au public.',
      'Un cadre transparent exprime le point de vue de la marque sans inventer de résultats.',
      'Une question ouverte permet de mieux comprendre les besoins du public.',
      'Des informations claires facilitent une décision éclairée sans transformer chaque publication en promotion.',
    ],
  },
  ar: {
    platform: 'Instagram',
    formats: ['كاروسيل', 'ريلز', 'منشور', 'قصص'],
    roles: ['تعليمي', 'خبرة ومنهجية', 'تفاعل', 'تحويل'],
    topics: [
      (niche: string) => `سؤال عملي يتكرر حول ${niche}`,
      (niche: string) => `إطار لاتخاذ قرار أفضل في ${niche}`,
      (niche: string) => `نقاش حول التحديات الشائعة في ${niche}`,
      (niche: string) => `كيف تقيّم ملاءمة عرض في مجال ${niche}`,
    ],
    hooks: [
      (audience: string, niche: string) => `إذا كنت تعمل في ${niche}، ما أكثر خطوة تجدها صعبة الآن؟`,
      (audience: string, niche: string) => `قبل أن تجرّب طريقة جديدة في ${niche}، اطرح على نفسك هذه الأسئلة الثلاثة.`,
      (audience: string, niche: string) => `ما المشكلة التي يواجهها ${audience} وتحتاج إلى إجابة عملية؟`,
      (audience: string, niche: string) => `قبل اختيار حل في ${niche}، حدّد المشكلة التي تريد حلها أولاً.`,
    ],
    messages: [
      (niche: string, audience: string, _offer: string) => `اشرح مفهوماً مفيداً في ${niche} بلغة واضحة، ثم اقترح على ${audience} خطوة صغيرة قابلة للتجربة.`,
      (niche: string, _audience: string, _offer: string) => `قدّم إطاراً واضحاً لاتخاذ قرار في ${niche} من دون ادعاء نتائج أو مؤهلات لم يذكرها صاحب العلامة.`,
      (niche: string, audience: string, _offer: string) => `ادعُ ${audience} إلى مشاركة تجاربهم وتحديد الجوانب التي تحتاج إلى شرح أوضح في ${niche}.`,
      (_niche: string, _audience: string, offer: string) => `وضّح لمن صُمّم ${offer} وماذا يتضمن وكيف يمكن للشخص أن يقرر إن كان مناسباً لاحتياجه.`,
    ],
    ctas: [
      'احفظ هذا الشرح وجرّب الخطوة الأقرب إلى احتياجك.',
      'ما النقطة التي تريد شرحها بمزيد من التفصيل؟',
      'شارك تجربتك أو سؤالك في التعليقات.',
      'اطّلع على تفاصيل العرض واسأل قبل اتخاذ القرار.',
    ],
    tasks: [
      ['حدّد الفكرة التي ستشرحها', 'جهّز تصميماً بسيطاً أو تسلسلاً للشرائح', 'راجع الوصف للتأكد من وضوحه'],
      ['اختر إطاراً مناسباً لهوية العلامة', 'جهّز مثالاً من دون ادعاءات غير مثبتة', 'راجع النص قبل التسجيل'],
      ['اكتب سؤالاً واحداً واضحاً للنقاش', 'جهّز صيغة مناسبة للقصص أو المنشور', 'تأكد من أن الدعوة محترمة وواضحة'],
      ['تحقق من دقة تفاصيل العرض', 'اكتب ملخصاً واضحاً لمن يناسبه', 'راجع الدعوة إلى الإجراء لتكون بلا ضغط'],
    ],
    rationale: [
      'يقدّم المحتوى التعليمي خطوة عملية أولى للجمهور.',
      'يوضح إطار شفاف طريقة تفكير العلامة من دون اختلاق نتائج.',
      'يساعد السؤال المفتوح على فهم احتياجات الجمهور لمحتوى لاحق.',
      'تدعم تفاصيل العرض الواضحة قراراً واعياً من دون تحويل كل منشور إلى إعلان.',
    ],
  },
  ar_dz: {
    platform: 'Instagram',
    formats: ['كاروسيل', 'ريلز', 'بوست', 'ستوري'],
    roles: ['تعليمي', 'منهج وخبرة', 'تفاعل', 'عرض'],
    topics: [
      (niche: string) => `سؤال عملي يطرحو بزاف ناس على ${niche}`,
      (niche: string) => `طريقة بسيطة باش تاخذ قرار مليح في ${niche}`,
      (niche: string) => `نقاش على المشاكل لي يلقاوها الناس في ${niche}`,
      (niche: string) => `كيفاش تعرف إذا عرض في ${niche} يناسبك`,
    ],
    hooks: [
      (audience: string, niche: string) => `راك تخدم في ${niche}؟ واش هي أكثر حاجة راهي حابستك درك؟`,
      (audience: string, niche: string) => `قبل ما تجرب طريقة جديدة في ${niche}، سقسي روحك هاد 3 أسئلة.`,
      (audience: string, niche: string) => `واش هي المشكلة لي يلقاوها ${audience} وتحتاج شرح أبسط؟`,
      (audience: string, niche: string) => `حاب تختار حل في ${niche}؟ ابدا بالمشكل لي حاب تحلو.`,
    ],
    messages: [
      (niche: string, audience: string, _offer: string) => `اشرح فكرة مفيدة في ${niche} بطريقة بسيطة، واقترح على ${audience} خطوة صغيرة يقدرو يجربوها.`,
      (niche: string, _audience: string, _offer: string) => `شارك طريقة واضحة باش تاخذ قرار في ${niche}، بلا ما تزيد نتائج ولا شهادات ما عطاهاش صاحب العلامة.`,
      (niche: string, audience: string, _offer: string) => `خلي ${audience} يشاركو تجاربهم ويقولو واش حابين يفهمو أكثر على ${niche}.`,
      (_niche: string, _audience: string, offer: string) => `وضح شكون يناسبو ${offer}، واش فيه، وكيفاش الواحد يعرف إذا يلبي احتياجو.`,
    ],
    ctas: [
      'خلي هاد الشرح عندك وجرب الخطوة لي تناسبك.',
      'واش هي النقطة لي حاب تفهمها أكثر؟',
      'شاركنا تجربتك ولا سؤالك في التعليقات.',
      'شوف تفاصيل العرض واسقسي قبل ما تقرر.',
    ],
    tasks: [
      ['حدد الفكرة لي راك حاب تشرحها', 'وجد صورة بسيطة ولا ترتيب الشرائح', 'راجع النص باش يكون واضح'],
      ['اختار طريقة تناسب هوية العلامة', 'وجد مثال بلا ادعاءات ما تأكدتش منها', 'راجع السيناريو قبل التصوير'],
      ['اكتب سؤال واحد واضح للنقاش', 'وجد صيغة للستوري ولا للبوست', 'تأكد بلي الدعوة واضحة ومحترمة'],
      ['تأكد من معلومات العرض', 'وجد ملخص يوضح شكون يناسبو', 'راجع الدعوة باش ما يكونش فيها ضغط'],
    ],
    rationale: [
      'محتوى تعليمي قصير يعطي للجمهور خطوة عملية يقدرو يبداو بها.',
      'طريقة واضحة تبين كيفاش تفكر العلامة بلا ما تخترع نتائج.',
      'سؤال مفتوح يعاونك تعرف واش يحتاج الجمهور في المحتوى الجاي.',
      'تفاصيل العرض الواضحة تعاون الناس يقررو براحتهم بلا ما يتحول كل منشور لإعلان.',
    ],
  },
} as const;

function getLanguage(language: string): PlanLanguage {
  const locale = normalizeOutputLocale(language);
  if (!locale) throw new Error('Choose English, French, Modern Standard Arabic, or Algerian Darija');
  if (locale === 'en') return 'en';
  if (locale === 'fr') return 'fr';
  return locale === 'ar_algerian' ? 'ar_dz' : 'ar';
}

function getLocalDate(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((value) => value.type === type)?.value;
  const year = part('year');
  const month = part('month');
  const day = part('day');
  if (!year || !month || !day) throw new Error('Unable to determine the local plan date');
  return `${year}-${month}-${day}`;
}

function addCalendarDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function getBrandFields(brand: BrandContext, language: PlanLanguage) {
  const missing = [
    ['brand name', brand.name],
    ['niche', brand.niche],
    ['target audience', brand.targetAudience],
    ['voice tone', brand.voiceTone],
  ].filter(([, value]) => typeof value !== 'string' || !value.trim()).map(([label]) => label);
  if (missing.length) {
    throw new Error(`Complete the Brand Profile before generating content. Missing: ${missing.join(', ')}`);
  }
  const rawNiche = brand.niche?.trim() || '';
  const rawAudience = brand.targetAudience?.trim() || '';
  const rawOffer = brand.primaryOffer?.trim() || '';
  const hasWeb = /web|frontend|front-end|html|css|javascript|développement web|تطوير الويب/i.test(rawNiche);
  const hasPresentation = /powerpoint|presentation|présentation|عرض تقديمي|بوربوينت/i.test(rawNiche);
  const gardening = /garden|horticulture|jardinage|زراعة|بستنة/i.test(rawNiche);
  const niche = hasWeb && hasPresentation
    ? language === 'en' ? rawNiche
      : language === 'fr' ? 'formation PowerPoint et développement web'
      : language === 'ar_dz' ? 'تكوين PowerPoint وتطوير الويب'
      : 'تدريب PowerPoint وتطوير الويب'
    : hasWeb
    ? language === 'en' ? rawNiche
      : language === 'fr' ? 'développement web'
      : 'تطوير الويب'
    : hasPresentation
    ? language === 'en' ? rawNiche
      : language === 'fr' ? 'formation PowerPoint'
      : 'تدريب PowerPoint'
    : gardening && language !== 'en'
    ? language === 'fr' ? 'jardinage en espace réduit'
      : language === 'ar_dz' ? 'الزراعة في المساحات الصغيرة'
      : 'الزراعة في المساحات الصغيرة'
    : rawNiche;
  const studentAudience = /student|teacher|étudiant|enseignant|معلم|طالب/i.test(rawAudience);
  const apartmentAudience = /apartment|limited space|appartement|شقق|مساحة محدودة/i.test(rawAudience);
  const audience = apartmentAudience && language !== 'en'
    ? language === 'fr' ? 'habitants d’appartements avec peu d’espace'
      : language === 'ar_dz' ? 'سكان الشقق بمساحة محدودة'
      : 'سكان الشقق ذوو المساحة المحدودة'
    : studentAudience
    ? language === 'en' ? rawAudience
      : language === 'fr' ? 'étudiants et enseignants'
      : language === 'ar_dz' ? 'الطلبة والأساتذة'
      : 'الطلاب والأساتذة'
    : rawAudience || (language === 'en' ? 'your audience' : language === 'fr' ? 'votre public' : 'الجمهور المستهدف');
  const offer = rawOffer;
  return {
    name: brand.name.trim(),
    niche: niche || rawNiche,
    audience: audience || rawAudience,
    voice: brand.voiceTone.trim(),
    offer,
  };
}

interface TopicSeed {
  topic: string;
  problem: string;
  steps: [string, string, string];
  visual: string;
}

function getTopicSeeds(brand: BrandContext, language: PlanLanguage, focus = ''): TopicSeed[] {
  const source = `${brand.niche || ''} ${focus}`.toLowerCase();
  const webDevelopment = /web|frontend|front-end|html|css|javascript|programming|développement|تطوير|برمجة|ويب/.test(source);
  const presentations = /powerpoint|presentation|présentation|عرض تقديمي|بوربوينت/.test(source);
  const english = language === 'en';
  const french = language === 'fr';
  const algerian = language === 'ar_dz';

  const webSeeds: Record<PlanLanguage, TopicSeed[]> = {
    en: [
      { topic: 'Make a navigation bar usable on a phone', problem: 'A desktop menu overflows or becomes hard to tap on a narrow screen.', steps: ['Start with a content-width breakpoint, not a device brand.', 'Let links wrap or collapse into a clearly labeled menu.', 'Test at 320px and with keyboard focus.'], visual: 'Show the same navigation at desktop width and 320px side by side.' },
      { topic: 'Add a JavaScript interaction without breaking the page', problem: 'A button looks interactive but gives no feedback or updates the wrong element.', steps: ['Select one element with a stable identifier.', 'Update its state only after the user action.', 'Check the empty, active, and repeated-click states.'], visual: 'Record a small button interaction and show the DOM state changing.' },
      { topic: 'Find the cause of a layout overflow', problem: 'A page has an unexpected horizontal scrollbar and the source is unclear.', steps: ['Inspect the viewport and find the first overflowing element.', 'Check fixed widths, long words, and nested flex children.', 'Use max-width and min-width: 0 where the layout requires them.'], visual: 'Use browser devtools to highlight the element extending past the viewport.' },
      { topic: 'Build a portfolio project that demonstrates frontend skills', problem: 'A tutorial clone does not show how the learner solves a real user task.', steps: ['Choose one user and one task, such as tracking assignments.', 'Build the empty, loading, and completed states.', 'Explain one tradeoff in the README or a short walkthrough.'], visual: 'Show a task tracker moving from a rough sketch to a working screen.' },
      { topic: 'Make a form easier to use and validate', problem: 'Users see an error only after submitting, or cannot tell which field needs attention.', steps: ['Associate each input with a visible label.', 'Validate the field and explain how to fix an error.', 'Preserve valid values when another field fails.'], visual: 'Compare an unlabeled form with a labeled form that shows a helpful error.' },
    ],
    fr: [
      { topic: 'Adapter une barre de navigation au mobile', problem: 'Le menu de bureau déborde ou devient difficile à utiliser sur un écran étroit.', steps: ['Choisir un breakpoint selon le contenu, pas une marque d’appareil.', 'Faire passer les liens à la ligne ou proposer un menu clairement nommé.', 'Tester à 320 px et vérifier le focus clavier.'], visual: 'Comparer la navigation sur grand écran et à 320 px.' },
      { topic: 'Ajouter une interaction JavaScript sans casser la page', problem: 'Un bouton semble actif, mais ne donne aucun retour ou modifie le mauvais élément.', steps: ['Sélectionner un élément avec un identifiant stable.', 'Mettre à jour son état après l’action de l’utilisateur.', 'Tester les états vide, actif et après plusieurs clics.'], visual: 'Filmer un bouton et montrer le changement d’état dans le DOM.' },
      { topic: 'Diagnostiquer un débordement horizontal', problem: 'Une barre de défilement apparaît sans que sa cause soit évidente.', steps: ['Repérer le premier élément qui dépasse la fenêtre.', 'Vérifier les largeurs fixes, les mots longs et les enfants flex.', 'Utiliser max-width et min-width: 0 si le contexte le demande.'], visual: 'Mettre en évidence dans les outils du navigateur l’élément qui déborde.' },
      { topic: 'Créer un projet de portfolio qui montre ses compétences frontend', problem: 'Une copie de tutoriel ne montre pas comment résoudre un vrai besoin.', steps: ['Choisir un utilisateur et une tâche, par exemple suivre des devoirs.', 'Créer les états vide, chargement et terminé.', 'Expliquer un choix technique dans le README ou une courte démo.'], visual: 'Montrer un suivi de tâches, du croquis à l’écran fonctionnel.' },
      { topic: 'Rendre un formulaire plus simple à utiliser', problem: 'L’erreur apparaît après l’envoi ou le champ à corriger n’est pas identifiable.', steps: ['Associer chaque champ à un libellé visible.', 'Expliquer comment corriger une erreur.', 'Conserver les champs valides si un autre champ échoue.'], visual: 'Comparer un formulaire sans labels à un formulaire avec une erreur explicite.' },
    ],
    ar: [
      { topic: 'تكييف شريط التنقل مع شاشة الهاتف', problem: 'قائمة الحاسوب تتجاوز الشاشة أو تصبح الروابط صعبة النقر.', steps: ['اختر نقطة التوقف حسب المحتوى لا حسب نوع الهاتف.', 'اسمح بانتقال الروابط أو استخدم قائمة واضحة الاسم.', 'اختبر العرض عند 320px وتأكد من إمكانية التنقل بلوحة المفاتيح.'], visual: 'اعرض شريط التنقل على شاشة كبيرة ثم على عرض 320px.' },
      { topic: 'إضافة تفاعل JavaScript من دون إرباك الصفحة', problem: 'الزر يبدو قابلاً للنقر لكنه لا يعطي نتيجة واضحة أو يغيّر عنصراً خاطئاً.', steps: ['حدد العنصر بمعرّف ثابت.', 'غيّر الحالة بعد تفاعل المستخدم فقط.', 'اختبر الحالة الفارغة والنشطة والنقر المتكرر.'], visual: 'سجّل نقرة الزر وأظهر تغيّر الحالة في الصفحة.' },
      { topic: 'اكتشاف سبب التمرير الأفقي في الصفحة', problem: 'يظهر شريط تمرير أفقي ولا تعرف أي عنصر يسبب التجاوز.', steps: ['ابحث في أدوات المتصفح عن أول عنصر يتجاوز العرض.', 'راجع العرض الثابت والكلمات الطويلة وعناصر flex.', 'استخدم max-width و min-width: 0 عند الحاجة.'], visual: 'أبرز العنصر المتجاوز للشاشة باستخدام أدوات المطور.' },
      { topic: 'إنشاء مشروع Portfolio يثبت مهارات frontend', problem: 'نسخ مشروع تعليمي لا يوضح كيف تحل مشكلة حقيقية للمستخدم.', steps: ['اختر مستخدماً ومهمة مثل متابعة الواجبات.', 'أنشئ حالات فارغة وتحميل ومكتملة.', 'اشرح قراراً تقنياً في README أو فيديو قصير.'], visual: 'اعرض تطبيق متابعة المهام من الرسم الأولي إلى واجهة تعمل.' },
      { topic: 'تحسين نموذج إدخال البيانات والتحقق منه', problem: 'لا يعرف المستخدم أي خانة تحتاج إلى تصحيح أو يظهر الخطأ متأخراً.', steps: ['اربط كل input بعنوان ظاهر.', 'اشرح طريقة تصحيح الخطأ بجانب الحقل.', 'احتفظ بالقيم الصحيحة عند وجود خطأ في حقل آخر.'], visual: 'قارن نموذجاً بلا عناوين بنموذج يوضح الخطأ وطريقة إصلاحه.' },
    ],
    ar_dz: [
      { topic: 'خلي شريط التنقل يخدم مليح في الهاتف', problem: 'القائمة تخرج على الشاشة ولا الروابط يولو صعاب باش تضغط عليهم.', steps: ['اختار breakpoint على حساب المحتوى ماشي نوع الهاتف.', 'خلي الروابط يهبطو للسطر ولا دير menu واضح.', 'جرّب العرض 320px وتأكد بلي clavier يخدم.'], visual: 'ورّي نفس القائمة في شاشة كبيرة ومن بعد في عرض 320px.' },
      { topic: 'زيد interaction بـ JavaScript بلا ما تخلط الصفحة', problem: 'الزر يبان يخدم بصح ما يعطي حتى نتيجة ولا يبدل العنصر الغالط.', steps: ['اختار العنصر بمعرّف ثابت.', 'بدل الحالة غير من بعد ما المستخدم يدير action.', 'جرّب الحالة الفارغة والنشطة والنقر أكثر من مرة.'], visual: 'سجّل نقرة الزر وورّي كيفاه تتبدل الحالة في الصفحة.' },
      { topic: 'لقى سبب التمرير الأفقي في الصفحة', problem: 'يبان scrollbar أفقي وما تعرفش شكون العنصر لي راه يخرج على العرض.', steps: ['قلب في devtools على أول عنصر خارج عرض الشاشة.', 'راجع العرض الثابت والكلمات الطويلة وعناصر flex.', 'استعمل max-width و min-width: 0 كي تحتاجهم.'], visual: 'بيّن العنصر لي راه خارج الشاشة باستعمال devtools.' },
      { topic: 'دير مشروع Portfolio يبيّن مهارات frontend', problem: 'نسخ مشروع من tutorial ما يبيّنش كيفاه تحل مشكل حقيقي.', steps: ['اختار مستخدم ومهمة كيما متابعة الواجبات.', 'دير حالات فارغة وتحميل ومكتملة.', 'اشرح اختيار تقني في README ولا فيديو قصير.'], visual: 'ورّي تطبيق متابعة المهام من sketch حتى للواجهة لي تخدم.' },
      { topic: 'حسّن form وخليه يوضح الأخطاء', problem: 'المستخدم ما يعرفش الخانة لي لازم يصلحها ولا الخطأ يبان غير في الأخير.', steps: ['اربط كل input بعنوان باين.', 'اشرح كيفاه يصلح الخطأ جنب الخانة.', 'خلي القيم الصحيحة كي يكون خطأ في خانة أخرى.'], visual: 'قارن form بلا labels بواحد يبيّن الخطأ وكيفاه يتصلح.' },
    ],
  };
  const presentationSeeds: Record<PlanLanguage, TopicSeed[]> = {
    en: [
      { topic: 'Turn a crowded slide into one clear message', problem: 'A slide has several competing ideas and the audience cannot tell what to remember.', steps: ['Write the takeaway as one sentence.', 'Keep only evidence that supports that takeaway.', 'Move detail to speaker notes or a follow-up slide.'], visual: 'Edit a crowded slide live, crossing out content that does not support its headline.' },
      { topic: 'Choose a chart that answers the question', problem: 'A chart looks polished but makes comparison or change hard to see.', steps: ['Decide whether the audience compares categories, change, or parts of a whole.', 'Choose a bar, line, or stacked chart to match that task.', 'Label units and highlight only the relevant series.'], visual: 'Show the same small dataset in three chart types and identify the useful one.' },
      { topic: 'Build a presentation opening that earns attention', problem: 'A presentation starts with an agenda before the audience knows why the topic matters.', steps: ['Start with the audience’s decision or question.', 'Use one relevant example or contrast.', 'State what the audience will be able to do by the end.'], visual: 'Replace an agenda-first opening with a question and a concrete example.' },
      { topic: 'Use slide hierarchy to make a lesson easier to follow', problem: 'Students or colleagues cannot identify the key point among equal-sized text.', steps: ['Give the slide one descriptive headline.', 'Use size and spacing to show the order of information.', 'Reveal complex steps one at a time.'], visual: 'Compare a dense slide with a version that uses headline, spacing, and staged reveal.' },
      { topic: 'Create a reusable slide template without making every slide identical', problem: 'A template saves time but forces unrelated content into one layout.', steps: ['Set consistent type, color, and margins.', 'Create separate layouts for comparison, process, and evidence.', 'Keep decorative elements out of the reading path.'], visual: 'Show three layouts sharing one visual system but serving different content.' },
    ],
    fr: [
      { topic: 'Transformer une diapositive chargée en message clair', problem: 'Plusieurs idées se disputent l’attention et le public ne sait pas quoi retenir.', steps: ['Formuler le message clé en une phrase.', 'Garder uniquement les preuves qui l’appuient.', 'Déplacer les détails dans les notes ou une autre diapositive.'], visual: 'Épurer une diapositive en direct et retirer ce qui ne sert pas son titre.' },
      { topic: 'Choisir un graphique adapté à la question', problem: 'Le graphique est esthétique, mais rend la comparaison ou l’évolution difficile.', steps: ['Déterminer si le public compare des catégories, une évolution ou des parts.', 'Choisir un graphique en barres, en courbes ou empilé selon ce besoin.', 'Indiquer les unités et mettre en évidence la série utile.'], visual: 'Comparer trois graphiques construits avec les mêmes données.' },
      { topic: 'Commencer une présentation par une vraie raison d’écouter', problem: 'L’exposé commence par le programme avant d’expliquer l’intérêt du sujet.', steps: ['Partir d’une décision ou d’une question du public.', 'Ajouter un exemple concret ou un contraste pertinent.', 'Préciser ce que le public saura faire à la fin.'], visual: 'Remplacer un agenda par une question et un exemple concret.' },
      { topic: 'Utiliser la hiérarchie visuelle pour guider une leçon', problem: 'Le public ne distingue pas l’idée essentielle parmi des textes de même importance.', steps: ['Donner un titre informatif à la diapositive.', 'Organiser les informations avec taille et espacement.', 'Présenter les étapes complexes progressivement.'], visual: 'Comparer une diapositive dense à une version hiérarchisée.' },
      { topic: 'Créer un modèle réutilisable sans uniformiser toutes les diapositives', problem: 'Le modèle fait gagner du temps, mais impose la même mise en page à tout contenu.', steps: ['Définir une typographie, des couleurs et des marges cohérentes.', 'Prévoir des mises en page pour comparer, expliquer un processus et présenter des preuves.', 'Éloigner les éléments décoratifs du parcours de lecture.'], visual: 'Montrer trois mises en page qui partagent le même système visuel.' },
    ],
    ar: [
      { topic: 'تحويل شريحة مزدحمة إلى رسالة واحدة واضحة', problem: 'تتنافس أفكار كثيرة في الشريحة ولا يعرف الجمهور ما الذي ينبغي تذكره.', steps: ['اكتب الخلاصة في جملة واحدة.', 'أبقِ على المعلومات التي تدعم هذه الخلاصة فقط.', 'انقل التفاصيل إلى ملاحظات المتحدث أو شريحة لاحقة.'], visual: 'نقّح شريحة مزدحمة مباشرة واحذف ما لا يخدم عنوانها.' },
      { topic: 'اختيار مخطط يجيب عن السؤال', problem: 'يبدو المخطط جميلاً لكنه يصعّب المقارنة أو رؤية التغيّر.', steps: ['حدد هل المطلوب مقارنة فئات أم متابعة تغيّر أم عرض أجزاء.', 'اختر مخطط أعمدة أو خطياً أو تراكمياً وفق الحاجة.', 'أظهر الوحدات وميّز البيانات المهمة فقط.'], visual: 'اعرض البيانات نفسها بثلاثة مخططات وحدد الأنسب للسؤال.' },
      { topic: 'افتتاح عرض تقديمي بسبب واضح للاستماع', problem: 'يبدأ العرض بجدول الأعمال قبل أن يعرف الجمهور أهمية الموضوع.', steps: ['ابدأ بسؤال أو قرار يهم الجمهور.', 'أضف مثالاً قريباً أو مقارنة واضحة.', 'حدد ما سيتمكن الجمهور من فعله في النهاية.'], visual: 'استبدل شريحة جدول الأعمال بسؤال ومثال محدد.' },
      { topic: 'استخدام التسلسل البصري لتسهيل متابعة الدرس', problem: 'لا يستطيع الجمهور تمييز الفكرة الأساسية بين نصوص متساوية في الحجم.', steps: ['اكتب عنواناً يوضح فكرة الشريحة.', 'رتب المعلومات بالحجم والمسافات.', 'اعرض الخطوات المعقدة بالتدريج.'], visual: 'قارن شريحة مزدحمة بأخرى تستخدم عنواناً ومسافات وتسلسلاً واضحاً.' },
      { topic: 'إنشاء قالب قابل لإعادة الاستخدام من دون توحيد كل الشرائح', problem: 'يوفر القالب الوقت لكنه يفرض تخطيطاً واحداً على محتويات مختلفة.', steps: ['ثبت الخطوط والألوان والهوامش.', 'جهز تخطيطات للمقارنة والعمليات وعرض الأدلة.', 'أبعد الزخارف عن مسار القراءة.'], visual: 'اعرض ثلاثة تخطيطات مختلفة ضمن نظام بصري واحد.' },
    ],
    ar_dz: [
      { topic: 'بدل slide عامرة بزاف برسالة وحدة واضحة', problem: 'كاين بزاف أفكار في slide والجمهور ما يعرفش واش يحفظ.', steps: ['اكتب الخلاصة في جملة وحدة.', 'خلي غير المعلومات لي تشرح الخلاصة.', 'دي التفاصيل لـ notes ولا لـ slide أخرى.'], visual: 'نقّح slide عامرة قدام المشاهد ونحي واش ما يخدمش العنوان.' },
      { topic: 'اختار chart يجاوب على السؤال', problem: 'الchart يبان مليح بصح المقارنة ولا التغيير ما يبانوش.', steps: ['حدد واش راك تقارن فئات ولا تغيير مع الوقت ولا أجزاء.', 'اختار bar ولا line ولا stacked على حساب الهدف.', 'بيّن الوحدات وركز غير على البيانات المهمة.'], visual: 'ورّي نفس البيانات بثلاثة charts واختار لي يجاوب على السؤال.' },
      { topic: 'ابدا presentation بسبب يخلي الناس تسمعلك', problem: 'العرض يبدا بالبرنامج قبل ما يعرف الجمهور علاش الموضوع يهمو.', steps: ['ابدا بسؤال ولا قرار يهم الجمهور.', 'زيد مثال قريب ولا مقارنة واضحة.', 'قول واش يقدر يدير الجمهور في الأخير.'], visual: 'بدل slide تاع البرنامج بسؤال ومثال محدد.' },
      { topic: 'استعمل الترتيب البصري باش الدرس يتفهم', problem: 'الجمهور ما يقدرش يميز الفكرة المهمة كي يكون كامل النص بنفس الحجم.', steps: ['دير عنوان يشرح فكرة slide.', 'رتب المعلومات بالحجم والمسافات.', 'خرج الخطوات الصعيبة وحدة بوحدة.'], visual: 'قارن slide مزحومة بواحدة مرتبة بعنوان ومسافات واضحة.' },
      { topic: 'دير template يعاونك بلا ما يخلي كامل slides كيف كيف', problem: 'القالب يربح الوقت بصح يفرض نفس الشكل على محتويات مختلفة.', steps: ['ثبت الخطوط والألوان والهوامش.', 'وجد layouts للمقارنة والخطوات وشرح الأدلة.', 'خلي الزخارف بعيدة على طريق القراءة.'], visual: 'ورّي ثلاثة layouts مختلفين بنفس الستايل البصري.' },
    ],
  };
  const selected: TopicSeed[] = [
    ...(webDevelopment ? webSeeds[language] : []),
    ...(presentations ? presentationSeeds[language] : []),
  ];
  if (selected.length > 0) return selected;

  const fields = getBrandFields(brand, language);
  if (english) {
    return [
      { topic: `Fix a common ${fields.niche} mistake before it costs extra work`, problem: `People interested in ${fields.niche} often cannot identify the first check to make.`, steps: [`Define the exact task in ${fields.niche}.`, `Check the most likely source of the problem.`, `Apply one change and verify the result.`], visual: `Show a specific ${fields.niche} example before and after the change.` },
      { topic: `A three-step workflow for one real ${fields.niche} task`, problem: `Beginners see disconnected tips but lack an order for using them.`, steps: [`Start with the intended outcome.`, `Complete the task in three visible stages.`, `Check the result against a simple criterion.`], visual: `Record the three stages of completing one ${fields.niche} task.` },
      { topic: `Compare two approaches to a practical ${fields.niche} decision`, problem: `People choose a method without knowing its tradeoffs.`, steps: [`State the decision and constraints.`, `Compare the effort and limitations of each option.`, `Explain which situation suits each approach.`], visual: `Use a two-column comparison with one concrete example.` },
      { topic: `Create a simple quality checklist for ${fields.niche}`, problem: `Learners finish a task without a reliable way to review their result.`, steps: [`Choose three observable quality checks.`, `Review the work against each check.`, `Fix the highest-impact issue first.`], visual: `Apply a short checklist to a real example and show one improvement.` },
    ];
  }
  if (french) {
    return [
      { topic: `Corriger une erreur fréquente en ${fields.niche} avant de refaire le travail`, problem: `Les personnes qui apprennent ${fields.niche} ne savent pas toujours quel contrôle faire en premier.`, steps: [`Définir la tâche précise en ${fields.niche}.`, `Vérifier la cause la plus probable.`, `Appliquer un changement et contrôler le résultat.`], visual: `Montrer un exemple concret avant et après la correction.` },
      { topic: `Une méthode en trois étapes pour une tâche réelle en ${fields.niche}`, problem: `Les débutants trouvent des conseils isolés, sans ordre pour les appliquer.`, steps: ['Définir le résultat attendu.', 'Réaliser la tâche en trois étapes visibles.', 'Vérifier le résultat avec un critère simple.'], visual: `Filmer les trois étapes d’une tâche concrète en ${fields.niche}.` },
      { topic: `Comparer deux méthodes pour une décision pratique en ${fields.niche}`, problem: `On choisit parfois une méthode sans en connaître les limites.`, steps: ['Préciser la décision et les contraintes.', 'Comparer les efforts et limites de chaque option.', 'Indiquer dans quelle situation chaque méthode convient.'], visual: 'Présenter une comparaison en deux colonnes avec un exemple.' },
      { topic: `Créer une liste de contrôle qualité pour ${fields.niche}`, problem: `Les apprenants terminent une tâche sans méthode fiable pour vérifier le résultat.`, steps: ['Choisir trois critères observables.', 'Vérifier le travail selon chaque critère.', 'Corriger d’abord le problème le plus important.'], visual: 'Appliquer une courte liste de contrôle à un exemple réel.' },
    ];
  }
  return [
    { topic: algerian ? `صلّح غلطة تتعاود في ${fields.niche} قبل ما تعاود الخدمة` : `عالج خطأ شائعاً في ${fields.niche} قبل إعادة العمل`, problem: algerian ? `لي يتعلمو ${fields.niche} ما يعرفوش ديما واش يراجعو اللول.` : `قد لا يعرف المتعلمون في ${fields.niche} ما الذي يجب فحصه أولاً.`, steps: [algerian ? `حدد المهمة بالضبط في ${fields.niche}.` : `حدّد المهمة بدقة في ${fields.niche}.`, algerian ? 'راجع السبب الأكثر احتمالاً.' : 'تحقق من السبب الأكثر احتمالاً.', algerian ? 'بدل حاجة وحدة وتأكد من النتيجة.' : 'غيّر عاملاً واحداً وتحقق من النتيجة.'], visual: algerian ? 'ورّي المثال قبل التصحيح ومن بعد.' : 'اعرض مثالاً قبل التصحيح وبعده.' },
    { topic: algerian ? `طريقة من 3 خطوات لمهمة حقيقية في ${fields.niche}` : `منهج من ثلاث خطوات لمهمة حقيقية في ${fields.niche}`, problem: algerian ? 'المبتدئون يلقاو نصائح متفرقة وما يعرفوش الترتيب.' : 'يجد المبتدئون نصائح متفرقة ولا يعرفون ترتيب تطبيقها.', steps: [algerian ? 'حدد النتيجة لي حاب توصللها.' : 'حدّد النتيجة المطلوبة.', algerian ? 'كمل المهمة في ثلاث مراحل باينين.' : 'أنجز المهمة في ثلاث مراحل واضحة.', algerian ? 'راجع النتيجة بمعيار بسيط.' : 'تحقق من النتيجة بمعيار بسيط.'], visual: algerian ? `سجل المراحل الثلاث لمهمة في ${fields.niche}.` : `اعرض المراحل الثلاث لمهمة في ${fields.niche}.` },
    { topic: algerian ? `قارن بين زوج طرق لقرار عملي في ${fields.niche}` : `مقارنة طريقتين لاتخاذ قرار عملي في ${fields.niche}`, problem: algerian ? 'الناس يختارو طريقة بلا ما يعرفو حدودها.' : 'قد يختار الناس طريقة من دون معرفة حدودها.', steps: [algerian ? 'وضح القرار والقيود.' : 'وضّح القرار والقيود.', algerian ? 'قارن الوقت والحدود لكل اختيار.' : 'قارن الجهد والقيود لكل خيار.', algerian ? 'قول وقتاش كل طريقة تصلح.' : 'اشرح متى يناسب كل أسلوب.'], visual: 'أنشئ مقارنة بعمودين مع مثال محدد.' },
    { topic: algerian ? `دير قائمة مراجعة للجودة في ${fields.niche}` : `أنشئ قائمة تحقق لمراجعة ${fields.niche}`, problem: algerian ? 'المتعلم يكمل المهمة وما يكونش عندو طريقة واضحة باش يراجع النتيجة.' : 'قد ينهي المتعلم المهمة من دون طريقة واضحة لمراجعة النتيجة.', steps: [algerian ? 'اختار ثلاثة معايير باينين.' : 'اختر ثلاثة معايير واضحة.', algerian ? 'راجع الخدمة على حساب كل معيار.' : 'راجع العمل وفق كل معيار.', algerian ? 'صلح أهم مشكل اللول.' : 'عالج المشكلة الأهم أولاً.'], visual: 'طبق قائمة قصيرة على مثال حقيقي وأظهر تحسناً واحداً.' },
  ];
}

export function createFallbackIdeas(
  brand: GenerationBrand,
  format: 'reel' | 'carousel' | 'post',
  language: string,
  dialect: string,
  customPrompt = '',
) {
  if (!brand.pillars?.some((pillar) => pillar.name.trim())) {
    throw new Error('Approve strategic pillars before generating content ideas.');
  }
  const locale = getLanguage(dialect || language);
  const fields = getBrandFields(brand, locale);
  const english = locale === 'en';
  const french = locale === 'fr';
  const algerian = locale === 'ar_dz';
  const sceneLabels = english
    ? { visual: 'Visual', onScreen: 'On-screen text', dialogue: 'Voiceover' }
    : french
    ? { visual: 'Visuel', onScreen: 'Texte à l’écran', dialogue: 'Voix off' }
    : algerian
    ? { visual: 'الصورة', onScreen: 'النص لي يبان', dialogue: 'الكلام' }
    : { visual: 'المشهد', onScreen: 'النص الظاهر', dialogue: 'التعليق الصوتي' };
  const copy = english
    ? {
        pillars: ['Educational', 'Authority', 'Engagement', 'Conversion'],
        angles: ['Explain a useful concept', 'Show how to make a sound decision', 'Invite an informed discussion'],
        titles: [
          (subject: string) => `A practical starting point for ${subject}`,
          (subject: string) => `A clearer way to think about ${subject}`,
          (subject: string) => `A question worth discussing about ${subject}`,
        ],
        hooks: [
          (subject: string, audience: string) => `What is one part of ${subject} that ${audience} should understand before taking the next step?`,
          (subject: string) => `Before choosing an approach to ${subject}, compare these three points.`,
          (subject: string, audience: string) => `If you are part of ${audience}, which challenge around ${subject} needs a more useful answer?`,
        ],
        steps: [
          ['Name the audience problem', 'Explain one relevant principle', 'Offer a small next step'],
          ['Clarify the decision to make', 'Compare practical options and tradeoffs', 'Explain when each option may fit'],
          ['State the question clearly', 'Offer useful context without assuming the answer', 'Invite specific examples or questions'],
        ],
        ctas: ['Save this and try the step that fits your situation.', 'Which factor matters most in your decision?', 'Share a question or example for a future post.'],
        formats: { reel: 'Reel (45-60s)', carousel: 'Carousel (7 slides)', post: 'Single post' },
        slideLabels: ['The question', 'Common assumption', 'What to check', 'A practical step', 'Example to adapt', 'Quick recap', 'Audience question'],
      }
    : french
    ? {
        pillars: ['Pédagogie', 'Expertise', 'Échange', 'Conversion'],
        angles: ['Expliquer un concept utile', 'Aider à prendre une décision éclairée', 'Ouvrir une discussion constructive'],
        titles: [
          (subject: string) => `Un premier pas concret en ${subject}`,
          (subject: string) => `Une méthode plus claire pour aborder ${subject}`,
          (subject: string) => `Une question à débattre sur ${subject}`,
        ],
        hooks: [
          (subject: string, audience: string) => `Quel aspect de ${subject} les ${audience} devraient-ils comprendre avant de passer à l’étape suivante ?`,
          (subject: string) => `Avant de choisir une approche en ${subject}, comparez ces trois éléments.`,
          (subject: string, audience: string) => `Si vous faites partie des ${audience}, quelle difficulté en ${subject} mérite une réponse plus utile ?`,
        ],
        steps: [
          'Définir le problème du public',
          'Expliquer un principe pertinent',
          'Proposer une petite étape à tester',
        ],
        ctas: ['Enregistrez ce contenu et testez l’étape adaptée à votre situation.', 'Quel critère compte le plus dans votre décision ?', 'Partagez une question ou un exemple pour une prochaine publication.'],
        formats: { reel: 'Reel (45-60 s)', carousel: 'Carrousel (7 diapositives)', post: 'Publication simple' },
        slideLabels: ['La question', 'Idée reçue', 'Points à vérifier', 'Étape pratique', 'Exemple à adapter', 'Récapitulatif', 'Question au public'],
      }
    : algerian
    ? {
        pillars: ['تعليم عملي', 'منهج وخبرة', 'نقاش وتفاعل', 'العرض المناسب'],
        angles: ['شرح فكرة مفيدة', 'المساعدة على قرار واعي', 'فتح نقاش مفيد'],
        titles: [
          (subject: string) => `خطوة عملية باش تبدا في ${subject}`,
          (subject: string) => `طريقة أوضح باش تفكر في ${subject}`,
          (subject: string) => `سؤال يستاهل النقاش على ${subject}`,
        ],
        hooks: [
          (subject: string, audience: string) => `واش هي حاجة في ${subject} لازم يعرفوها ${audience} قبل ما يديرو الخطوة الجاية؟`,
          (subject: string) => `قبل ما تختار طريقة في ${subject}، قارن هاد النقاط الثلاثة.`,
          (subject: string, audience: string) => `إذا راك من ${audience}، واش هي المشكلة في ${subject} لي تحتاج جواب عملي؟`,
        ],
        steps: ['حدد المشكل لي يهم الجمهور', 'اشرح فكرة مرتبطة بالموضوع', 'اقترح خطوة صغيرة قابلة للتجربة'],
        ctas: ['خلي هاد الفكرة عندك وجرب الخطوة لي تناسب وضعك.', 'واش هي أهم حاجة في القرار تاعك؟', 'شارك سؤال ولا مثال باش نهضرو عليه في منشور جاي.'],
        formats: { reel: 'ريلز (45-60 ثانية)', carousel: 'كاروسيل (7 شرائح)', post: 'بوست' },
        slideLabels: ['السؤال', 'فكرة شائعة', 'واش لازم تراجع', 'خطوة عملية', 'مثال تقدر تبدلو', 'خلاصة سريعة', 'سؤال للجمهور'],
      }
    : {
        pillars: ['تعليمي', 'خبرة ومنهجية', 'تفاعل', 'ملاءمة العرض'],
        angles: ['شرح مفهوم مفيد', 'المساعدة على اتخاذ قرار واعٍ', 'فتح نقاش بنّاء'],
        titles: [
          (subject: string) => `خطوة عملية للبدء في ${subject}`,
          (subject: string) => `طريقة أوضح للتفكير في ${subject}`,
          (subject: string) => `سؤال يستحق النقاش حول ${subject}`,
        ],
        hooks: [
          (subject: string, audience: string) => `ما الجانب من ${subject} الذي ينبغي أن يفهمه ${audience} قبل اتخاذ الخطوة التالية؟`,
          (subject: string) => `قبل اختيار أسلوب في ${subject}، قارن بين هذه النقاط الثلاث.`,
          (subject: string, audience: string) => `إذا كنت من ${audience}، فما التحدي في ${subject} الذي يحتاج إلى إجابة عملية؟`,
        ],
        steps: ['حدّد مشكلة الجمهور', 'اشرح مبدأً مناسباً للموضوع', 'اقترح خطوة صغيرة قابلة للتجربة'],
        ctas: ['احفظ الفكرة وجرّب الخطوة الأنسب لوضعك.', 'ما العامل الأهم في قرارك؟', 'شارك سؤالاً أو مثالاً لمنشور قادم.'],
        formats: { reel: 'ريلز (45-60 ثانية)', carousel: 'كاروسيل (7 شرائح)', post: 'منشور' },
        slideLabels: ['السؤال', 'افتراض شائع', 'ما الذي يجب التحقق منه', 'خطوة عملية', 'مثال قابل للتكييف', 'خلاصة سريعة', 'سؤال للجمهور'],
      };

  const customFocus = customPrompt.trim();
  const localizedCustomFocus = customFocusMatchesLanguage(customFocus, locale) ? customFocus : '';
  const topicSeeds = getTopicSeeds(brand, locale, customFocus);
  const approvedPillars = brand.pillars?.filter((pillar) => pillar.name.trim()) || [];

  const ideas = [0, 1, 2].map((index) => {
    const pillar = approvedPillars[index % approvedPillars.length];
    const seed = topicSeeds[index % topicSeeds.length]!;
    const topic = localizedCustomFocus && !seed.topic.toLowerCase().includes(localizedCustomFocus.toLowerCase())
      ? `${localizedCustomFocus}: ${seed.topic}`
      : seed.topic;
    const firstCheck = seed.steps[0]!.replace(
      /^(?:start with|start by|choose|define|select|choisir|définir|sélectionner|اختر|حدد|اختار|بدا بـ)\s*/i,
      '',
    );
    const hook = english
      ? `${seed.problem} First check: ${firstCheck}`
      : french
      ? `${seed.problem} Premier contrôle : ${firstCheck}`
      : algerian
      ? `${seed.problem} أول حاجة راجعها: ${firstCheck}`
      : `${seed.problem} أول ما ينبغي التحقق منه: ${firstCheck}`;
    const formattedSteps = seed.steps.map((step, stepIndex) =>
      `${stepIndex + 1}. ${step}`
    );
    const slides = [
      { title: topic, body: hook },
      { title: copy.slideLabels[1]!, body: seed.problem },
      { title: copy.slideLabels[2]!, body: formattedSteps[0]! },
      { title: copy.slideLabels[3]!, body: formattedSteps[1]! },
      { title: copy.slideLabels[4]!, body: formattedSteps[2]! },
      { title: copy.slideLabels[5]!, body: `${seed.steps[0]} → ${seed.steps[1]} → ${seed.steps[2]}` },
      { title: copy.slideLabels[6]!, body: copy.ctas[index]! },
    ];
    const scenes = [
      { time: '0-3s', visual: seed.visual, dialogue: hook, onScreenText: topic },
      { time: '4-15s', visual: english ? 'Show the problem on screen before explaining it.' : french ? 'Montrer le problème avant de l’expliquer.' : algerian ? 'ورّي المشكل قبل ما تشرحو.' : 'اعرض المشكلة قبل شرحها.', dialogue: seed.problem, onScreenText: topic },
      ...seed.steps.map((step, stepIndex) => ({
        time: `${16 + stepIndex * 8}-${23 + stepIndex * 8}s`,
        visual: english
          ? `Demonstrate this step on screen: ${step}`
          : french
          ? `Montrer cette étape à l’écran : ${step}`
          : algerian
          ? `ورّي هاد الخطوة في الشاشة: ${step}`
          : `اعرض هذه الخطوة على الشاشة: ${step}`,
        dialogue: step,
        onScreenText: step,
      })),
      { time: '41-50s', visual: english ? 'Show the finished result and pause on the key change.' : french ? 'Montrer le résultat final et insister sur le changement clé.' : algerian ? 'ورّي النتيجة ووقف على التغيير المهم.' : 'اعرض النتيجة النهائية ووضّح التغيير الأساسي.', dialogue: copy.ctas[index]!, onScreenText: copy.ctas[index]! },
    ];
    const script = format === 'carousel'
      ? slides.map((slide, slideIndex) =>
          `${algerian ? 'Slide' : english ? 'Slide' : french ? 'Diapositive' : 'الشريحة'} ${slideIndex + 1} — ${slide.title}: ${slide.body}`
        ).join('\n\n')
      : format === 'post'
      ? `${hook}\n\n${seed.problem}\n\n${formattedSteps.join('\n')}\n\n${copy.ctas[index]}`
      : scenes.map((scene) =>
          `[${scene.time}]\n${sceneLabels.visual}: ${scene.visual}\n${sceneLabels.onScreen}: ${scene.onScreenText}\n${sceneLabels.dialogue}: ${scene.dialogue}`
        ).join('\n\n');
    const formatName = copy.formats[format];
    const cta = index === 2 || !fields.offer
      ? copy.ctas[index]
      : `${copy.ctas[index]}${index === 1 ? ` ${fields.offer}` : ''}`;
    const topicDomain = `${brand.niche || ''} ${topic}`.toLowerCase();
    const hashtags = /web|frontend|javascript|html|css/.test(topicDomain)
      ? english
        ? ['#FrontendDevelopment', '#WebDevelopment', '#BuildInPublic']
        : french
        ? ['#DeveloppementWeb', '#Frontend', '#ProjetNumerique']
        : ['#تطوير_الويب', '#Frontend', '#مشاريع_رقمية']
      : /powerpoint|presentation|présentation|عرض/.test(topicDomain)
      ? english
        ? ['#PowerPointTips', '#PresentationSkills', '#DigitalLearning']
        : french
        ? ['#ConseilsPowerPoint', '#Presentation', '#ApprentissageNumerique']
        : ['#PowerPoint', '#مهارات_العرض', '#تعلم_رقمي']
      : /garden|horticulture|jardinage|زراعة/.test(topicDomain)
      ? english
        ? ['#SmallSpaceGardening', '#UrbanGardening', '#PlantCare']
        : french
        ? ['#JardinageUrbain', '#PetitEspace', '#ConseilsJardinage']
        : ['#زراعة_منزلية', '#زراعة_المساحات_الصغيرة', '#نصائح_زراعية']
      : english
      ? [`#${fields.niche.replace(/[^\p{L}\p{N}]+/gu, '')}`, '#PracticalSkills', '#CreatorEducation']
      : french
      ? ['#ConseilsPratiques', '#Apprentissage', '#CreationDeContenu']
      : ['#مهارات_عملية', '#تعلم_بالتطبيق', '#صناعة_المحتوى'];

    return {
      title: topic,
      format: formatName,
      pillar: pillar?.name || copy.pillars[index],
      angle: copy.angles[index],
      topic,
      audienceProblem: seed.problem,
      contentObjective: copy.angles[index],
      hook,
      script,
      scenes: format === 'reel' ? scenes : [],
      slides: format === 'carousel' ? slides : [],
      visualConcept: seed.visual,
      onScreenText: format === 'post' ? topic : '',
      mainMessage: format === 'post' ? `${seed.problem}\n\n${formattedSteps.join('\n')}` : '',
      caption: `${english ? 'The problem:' : french ? 'Le problème :' : 'المشكلة:'} ${seed.problem}\n\n${formattedSteps.join('\n')}\n\n${cta}\n\n${hashtags.join(' ')}`,
      cta,
      strategicPurpose: copy.angles[index],
      hashtags,
      rationale: english
        ? `This idea solves a defined problem for ${fields.audience} using a concrete example from the brand’s field.`
        : french
        ? `Cette idée répond à un problème précis du public avec un exemple concret du domaine de la marque.`
        : algerian
        ? 'هاد الفكرة تجاوب على مشكل واضح عند الجمهور بمثال عملي من مجال العلامة.'
        : 'تعالج هذه الفكرة مشكلة محددة لدى الجمهور بمثال عملي من مجال العلامة.',
    };
  });

  return { ideas };
}

export function createFallbackBio(brand: BrandContext, language: string, customInstructions = '') {
  const locale = getLanguage(language);
  const fields = getBrandFields(brand, locale);
  const english = locale === 'en';
  const french = locale === 'fr';
  const algerian = locale === 'ar_dz';
  const customInstruction = customInstructions.trim() && customFocusMatchesLanguage(customInstructions, locale)
    ? customInstructions.trim()
    : '';
  const copy = english
    ? {
        styles: ['Clear & Professional', 'Audience-focused', 'Distinctive & Personality-driven'],
        role: (audience: string, niche: string) => `For ${audience} exploring ${niche}`,
        audience: (target: string) => `Audience: ${target}`,
        value: (niche: string) => `Practical guidance in ${niche}`,
        cta: 'Learn more',
        reason: 'States the intended audience and subject directly without unsupported claims.',
        angle: ['Clear positioning', 'Audience need', 'Distinctive brand voice'],
      }
    : french
    ? {
        styles: ['Claire et professionnelle', 'Centrée sur le public', 'Distinctive et personnelle'],
        role: (audience: string, niche: string) => `Pour les ${audience} intéressés par ${niche}`,
        audience: (target: string) => `Public : ${target}`,
        value: (niche: string) => `Conseils pratiques en ${niche}`,
        cta: 'En savoir plus',
        reason: 'Présente clairement le public et le sujet sans ajouter d’affirmations non vérifiées.',
        angle: ['Positionnement clair', 'Besoin du public', 'Voix de marque distinctive'],
      }
    : algerian
    ? {
        styles: ['واضح واحترافي', 'يركز على الجمهور', 'مميز وبشخصية'],
        role: (audience: string, niche: string) => `لـ ${audience} لي مهتمين بـ ${niche}`,
        audience: (target: string) => `الجمهور: ${target}`,
        value: (niche: string) => `نصائح عملية في ${niche}`,
        cta: 'اكتشف أكثر',
        reason: 'يوضح الجمهور والموضوع بلا ما يزيد ادعاءات ما تأكدتش.',
        angle: ['تموقع واضح', 'احتياج الجمهور', 'صوت مميز للعلامة'],
      }
    : {
        styles: ['واضح واحترافي', 'يركز على الجمهور', 'مميز ويعبر عن الشخصية'],
        role: (audience: string, niche: string) => `لـ ${audience} المهتمين بـ ${niche}`,
        audience: (target: string) => `الجمهور: ${target}`,
        value: (niche: string) => `إرشادات عملية في ${niche}`,
        cta: 'اكتشف المزيد',
        reason: 'يوضح الجمهور والموضوع مباشرة من دون ادعاءات غير مثبتة.',
        angle: ['تموضع واضح', 'احتياج الجمهور', 'صوت مميز للعلامة'],
      };
  const value = copy.value(fields.niche);
  const isTechnicalTraining = /web|frontend|front-end|html|css|javascript|powerpoint|presentation|présentation|عرض تقديمي|بوربوينت/i
    .test(`${brand.niche || ''} ${brand.primaryOffer || ''}`);
  const bioVariants = english && isTechnicalTraining
    ? [
        `${copy.role(fields.audience, fields.niche)}. Build practical projects.`,
        `Practice ${fields.niche} with real assignments for ${fields.audience}.`,
        `Turn what you learn in ${fields.niche} into slides and working projects.`,
      ]
    : french && isTechnicalTraining
    ? [
        `${fields.niche} pour les ${fields.audience}. Créez des projets pratiques.`,
        `Pratiquez ${fields.niche} avec des exercices concrets.`,
        `Transformez vos apprentissages en présentations claires et projets fonctionnels.`,
      ]
    : algerian && isTechnicalTraining
    ? [
        `تعلم ${fields.niche} وطبقها في مشاريع عملية.`,
        `مهارات ${fields.niche} للطلبة والأساتذة مع تطبيقات واضحة.`,
        `حوّل واش تتعلم في ${fields.niche} لعروض ومشاريع تخدم.`,
      ]
    : locale === 'ar' && isTechnicalTraining
    ? [
        `تعلّم ${fields.niche} وطبّقها في مشاريع عملية.`,
        `مهارات ${fields.niche} للطلاب والأساتذة مع تطبيقات واضحة.`,
        `حوّل ما تتعلمه في ${fields.niche} إلى عروض ومشاريع قابلة للتطبيق.`,
      ]
    : english
    ? [
        `Practical ${fields.niche} guidance for ${fields.audience}.`,
        `Solve a specific ${fields.niche} challenge with clear steps.`,
        `Learn, practice, and apply useful skills in ${fields.niche}.`,
      ]
    : french
    ? [
        `Des conseils pratiques en ${fields.niche} pour votre public.`,
        `Résolvez un problème précis en ${fields.niche} avec des étapes claires.`,
        `Apprenez et appliquez des compétences utiles en ${fields.niche}.`,
      ]
    : algerian
    ? [
        `نصائح عملية في ${fields.niche} للجمهور.`,
        `حل مشكل واضح في ${fields.niche} بخطوات مفهومة.`,
        `تعلم وطبق مهارات نافعة في ${fields.niche}.`,
      ]
    : [
        `إرشادات عملية في ${fields.niche} للجمهور.`,
        `حل مشكلة محددة في ${fields.niche} بخطوات واضحة.`,
        `تعلّم مهارات مفيدة في ${fields.niche} وطبّقها.`,
      ];
  const options = copy.styles.map((style, index) => {
    const positioningAngle = copy.angle[index];
    const targetAudience = fields.audience;
    const cta = copy.cta;
    const baseText = bioVariants[index] || value;
    const maxTextLength = 150 - Array.from(`\n${cta}`).length;
    const conciseText = Array.from(baseText).slice(0, Math.max(1, maxTextLength)).join('').trim();
    const text = [conciseText, cta].filter(Boolean).join('\n');
    const valueProposition = index === 0 ? value : index === 1 ? copy.audience(targetAudience) : copy.value(fields.niche);
    return {
      id: `${index + 1}`,
      style,
      text,
      positioningAngle: customInstruction
        ? `${positioningAngle} — ${english ? 'Custom emphasis' : french ? 'Priorité personnalisée' : algerian ? 'التركيز الخاص' : 'التركيز المطلوب'}: ${customInstruction}`
        : positioningAngle,
      targetAudience,
      valueProposition,
      cta,
      characterCount: Array.from(text).length,
      platformCharacterLimit: 150,
      whyItWorks: copy.reason,
    };
  });
  return { options };
}

export function createFallbackStrategy(brand: GenerationBrand, language: string, customInstructions = '') {
  const locale = getLanguage(language);
  const fields = getBrandFields(brand, locale);
  const english = locale === 'en';
  const french = locale === 'fr';
  const algerian = locale === 'ar_dz';
  const customInstruction = customInstructions.trim() && customFocusMatchesLanguage(customInstructions, locale)
    ? customInstructions.trim()
    : '';
  const roles = english
    ? ['Education', 'Authority', 'Engagement', 'Conversion']
    : french
    ? ['Pédagogie', 'Expertise', 'Échange', 'Conversion']
    : algerian
    ? ['تعليم عملي', 'منهج وخبرة', 'تفاعل ونقاش', 'ملاءمة العرض']
    : ['تعليم عملي', 'خبرة ومنهجية', 'تفاعل ومشاركة', 'ملاءمة العرض'];
  const descriptions = english
    ? [
        `Teach ${fields.audience} practical concepts and steps in ${fields.niche}.`,
        `Explain the brand's decision-making principles and point of view in ${fields.niche}, without claiming unprovided credentials.`,
        `Invite ${fields.audience} to share questions, choices, and experiences related to ${fields.niche}.`,
        fields.offer ? `Clarify who ${fields.offer} is for and how it relates to the needs of ${fields.audience}.` : `Explain relevant solutions and decision criteria in ${fields.niche} without forced promotion.`,
      ]
    : french
    ? [
        `Enseigner aux ${fields.audience} des notions et des étapes pratiques en ${fields.niche}.`,
        `Expliquer la méthode et le point de vue de la marque en ${fields.niche}, sans inventer de qualifications.`,
        `Inviter les ${fields.audience} à partager leurs questions et expériences autour de ${fields.niche}.`,
        fields.offer ? `Préciser à qui s’adresse ${fields.offer} et son lien avec les besoins des ${fields.audience}.` : `Présenter des solutions utiles en ${fields.niche} sans promotion forcée.`,
      ]
    : algerian
    ? [
        `علم ${fields.audience} أفكار وخطوات عملية في ${fields.niche}.`,
        `اشرح طريقة التفكير والاختيارات في ${fields.niche} بلا ما تزيد شهادات ما عطاهاش صاحب العلامة.`,
        `خلي ${fields.audience} يشاركو أسئلتهم وتجاربهم على ${fields.niche}.`,
        fields.offer ? `وضح شكون يناسبو ${fields.offer} وعلاقته باحتياجات ${fields.audience}.` : `قدم حلول ومعايير اختيار في ${fields.niche} بلا ترويج مفروض.`,
      ]
    : [
        `قدّم لـ ${fields.audience} مفاهيم وخطوات عملية في ${fields.niche}.`,
        `اشرح منهج العلامة ووجهة نظرها في ${fields.niche} من دون اختلاق مؤهلات.`,
        `ادعُ ${fields.audience} إلى مشاركة أسئلتهم وتجاربهم حول ${fields.niche}.`,
        fields.offer ? `وضّح لمن يناسب ${fields.offer} وكيف يرتبط باحتياجات ${fields.audience}.` : `اعرض حلولاً ومعايير اختيار في ${fields.niche} من دون ترويج مفروض.`,
      ];
  const technicalProblemsByPillar = english
    ? [
        ['Choosing a first frontend project with a realistic scope', 'Turning a presentation topic into a clear slide sequence', 'Knowing which skill to practice next'],
        ['Finding why a layout overflows on mobile', 'Making a chart readable without distorting its message', 'Explaining the reasoning behind an implementation choice'],
        ['Getting useful feedback on a project before polishing it', 'Keeping students engaged during a presentation', 'Comparing approaches with peers'],
        ['Choosing a workshop or learning path that matches current skills', 'Understanding what a training offer includes before enrolling', 'Applying a new skill to a real assignment'],
      ]
    : french
    ? [
        ['Choisir un premier projet frontend de portée réaliste', 'Transformer un sujet en plan de diapositives clair', 'Savoir quelle compétence pratiquer ensuite'],
        ['Trouver pourquoi une mise en page déborde sur mobile', 'Rendre un graphique lisible sans déformer son message', 'Expliquer le raisonnement derrière un choix technique'],
        ['Obtenir des retours utiles avant de finaliser un projet', 'Maintenir l’attention des élèves pendant un exposé', 'Comparer plusieurs méthodes avec ses pairs'],
        ['Choisir une formation adaptée à son niveau', 'Comprendre le contenu d’une offre avant de s’inscrire', 'Appliquer une nouvelle compétence à un travail réel'],
      ]
    : algerian
    ? [
        ['اختيار أول مشروع frontend بحجم معقول', 'ترتيب موضوع presentation في slides واضحين', 'معرفة المهارة لي لازم تتطبق من بعد'],
        ['معرفة علاش layout يخرج على شاشة الهاتف', 'توضيح chart بلا ما يتبدل المعنى تاعو', 'شرح علاش اخترت طريقة تقنية معينة'],
        ['الحصول على ملاحظات مفيدة قبل ما تكمل المشروع', 'خلي التلاميذ يتبعو presentation حتى للآخر', 'مقارنة طرق مختلفة مع الزملاء'],
        ['اختيار تكوين يناسب المستوى الحالي', 'فهم واش داخل في العرض قبل التسجيل', 'تطبيق مهارة جديدة في واجب حقيقي'],
      ]
    : [
        ['اختيار أول مشروع frontend بحجم واقعي', 'ترتيب موضوع العرض في شرائح واضحة', 'تحديد المهارة التي ينبغي تعلمها تالياً'],
        ['اكتشاف سبب تجاوز التصميم لشاشة الهاتف', 'توضيح المخطط دون تغيير دلالته', 'شرح سبب اختيار طريقة تقنية معينة'],
        ['الحصول على ملاحظات مفيدة قبل إنهاء المشروع', 'الحفاظ على انتباه الطلاب أثناء العرض', 'مقارنة الأساليب مع الزملاء'],
        ['اختيار تدريب يناسب المستوى الحالي', 'فهم محتوى العرض قبل التسجيل', 'تطبيق المهارة الجديدة في مهمة واقعية'],
      ];
  const technicalThemesByPillar = english
    ? [
        ['Responsive layout foundations', 'JavaScript interactions', 'Presentation structure'],
        ['Debugging and browser tools', 'Accessibility and semantics', 'Chart and slide critique'],
        ['Project reviews', 'Audience polls and choices', 'Peer learning'],
        ['Training fit and prerequisites', 'Practice assignments', 'Offer questions and next steps'],
      ]
    : french
    ? [
        ['Bases du responsive', 'Interactions JavaScript', 'Structure d’une présentation'],
        ['Débogage et outils du navigateur', 'Accessibilité et sémantique', 'Analyse de graphiques et diapositives'],
        ['Retours sur des projets', 'Sondages et choix du public', 'Apprentissage entre pairs'],
        ['Adéquation et prérequis d’une formation', 'Exercices pratiques', 'Questions sur l’offre et prochaines étapes'],
      ]
    : algerian
    ? [
        ['أساسيات responsive', 'تفاعلات JavaScript', 'تنظيم presentation'],
        ['تصحيح الأخطاء وdevtools', 'إمكانية الوصول وHTML semantic', 'مراجعة charts وslides'],
        ['مراجعة المشاريع', 'تصويت واختيارات الجمهور', 'التعلم مع الزملاء'],
        ['مناسبة التكوين والمستوى المطلوب', 'تمارين تطبيقية', 'أسئلة على العرض والخطوة الجاية'],
      ]
    : [
        ['أساسيات التصميم المتجاوب', 'تفاعلات JavaScript', 'بناء العرض التقديمي'],
        ['تصحيح الأخطاء وأدوات المتصفح', 'إمكانية الوصول ودلالات HTML', 'مراجعة المخططات والشرائح'],
        ['مراجعة المشاريع', 'استطلاعات واختيارات الجمهور', 'التعلم بين الزملاء'],
        ['ملاءمة التدريب ومتطلباته', 'مهام تطبيقية', 'أسئلة العرض والخطوات التالية'],
      ];
  const technicalTraining = /web|frontend|front-end|html|css|javascript|powerpoint|presentation|présentation|développement web|تطوير|بوربوينت/i
    .test(brand.niche || '');
  const genericProblemsByPillar = english
    ? [
        [`Knowing the first practical step in ${fields.niche}`, `Avoiding a beginner mistake in ${fields.niche}`, `Checking whether a task in ${fields.niche} is complete`],
        [`Choosing between two methods in ${fields.niche}`, `Understanding the tradeoffs of a ${fields.niche} technique`, `Diagnosing why a familiar approach did not work`],
        [`Getting feedback on a real ${fields.niche} example`, `Comparing how different people handle the same task`, `Finding a useful question to explore next`],
        [fields.offer ? `Knowing whether ${fields.offer} fits a current need` : `Evaluating whether a solution in ${fields.niche} fits a current need`, `Understanding what preparation a learner needs`, `Applying a learned method to a real task`],
      ]
    : french
    ? [
        [`Identifier la première étape pratique en ${fields.niche}`, `Éviter une erreur de débutant en ${fields.niche}`, `Vérifier si une tâche en ${fields.niche} est terminée`],
        [`Choisir entre deux méthodes en ${fields.niche}`, `Comprendre les limites d’une technique`, `Diagnostiquer l’échec d’une méthode habituelle`],
        [`Obtenir des retours sur un exemple réel`, `Comparer différentes façons de réaliser la même tâche`, `Trouver la prochaine question utile à explorer`],
        [fields.offer ? `Vérifier si ${fields.offer} répond à un besoin` : `Évaluer si une solution en ${fields.niche} répond au besoin`, `Comprendre les prérequis`, `Appliquer une méthode à une tâche réelle`],
      ]
    : [
        [`معرفة أول خطوة عملية في ${fields.niche}`, `تجنب خطأ شائع للمبتدئين في المجال`, `التأكد من اكتمال مهمة عملية`],
        [`المقارنة بين طريقتين في المجال`, `فهم مزايا وحدود كل أسلوب`, `اكتشاف سبب عدم نجاح طريقة معتادة`],
        [`الحصول على ملاحظات حول مثال واقعي`, `مقارنة طرق تنفيذ المهمة نفسها`, `اختيار سؤال مفيد للموضوع القادم`],
        [fields.offer ? `معرفة مدى ملاءمة ${fields.offer} لحاجة حالية` : `تقييم مدى ملاءمة حل في ${fields.niche} لحاجة حالية`, `فهم المتطلبات قبل البدء`, `تطبيق المهارة في مهمة واقعية`],
      ];
  const genericThemesByPillar = english
    ? [
        ['Beginner workflows', 'Core principles and tools', 'Quality checks'],
        ['Method comparisons', 'Troubleshooting', 'Decision criteria'],
        ['Case reviews', 'Audience questions', 'Peer examples'],
        ['Learning pathways', 'Offer fit and prerequisites', 'Applied practice'],
      ]
    : french
    ? [
        ['Méthodes pour débuter', 'Principes et outils essentiels', 'Contrôle qualité'],
        ['Comparaison de méthodes', 'Résolution de problèmes', 'Critères de décision'],
        ['Analyse de cas', 'Questions du public', 'Exemples entre pairs'],
        ['Parcours d’apprentissage', 'Adéquation et prérequis de l’offre', 'Mise en pratique'],
      ]
    : [
        ['خطوات للمبتدئين', 'مبادئ وأدوات أساسية', 'مراجعة جودة العمل'],
        ['مقارنة الأساليب', 'حل المشكلات', 'معايير الاختيار'],
        ['تحليل أمثلة واقعية', 'أسئلة الجمهور', 'تجارب المتعلمين'],
        ['مسارات التعلم', 'ملاءمة العرض ومتطلباته', 'التطبيق العملي'],
      ];
  const problemsByPillar = technicalTraining ? technicalProblemsByPillar : genericProblemsByPillar;
  const themesByPillar = technicalTraining ? technicalThemesByPillar : genericThemesByPillar;
  const formats = english
    ? [['How-to carousel', 'Short explainer reel'], ['Analysis post', 'Process walkthrough'], ['Question-led stories', 'Community post'], ['Offer explainer', 'FAQ carousel']]
    : french
    ? [['Carrousel pratique', 'Reel explicatif'], ['Publication d’analyse', 'Présentation de méthode'], ['Stories questions-réponses', 'Publication communautaire'], ['Présentation de l’offre', 'Carrousel FAQ']]
    : [['كاروسيل تطبيقي', 'ريلز توضيحي'], ['منشور تحليلي', 'شرح خطوات العمل'], ['قصص تفاعلية', 'منشور للنقاش'], ['شرح العرض', 'كاروسيل للأسئلة']]
  const ctas = english
    ? ['Save and apply', 'Ask a specific question', 'Share an experience', 'Review the offer details']
    : french
    ? ['Enregistrer et appliquer', 'Poser une question précise', 'Partager une expérience', 'Consulter les détails de l’offre']
    : ['احفظ وجرّب', 'اطرح سؤالاً محدداً', 'شارك تجربة', 'اطّلع على تفاصيل العرض'];
  const why = english
    ? [
        'Builds usefulness through repeatable guidance.',
        'Makes the brand perspective clear without relying on fabricated authority.',
        'Creates a feedback loop around audience questions and experiences.',
        'Supports informed decisions without making every publication promotional.',
      ]
    : french
    ? [
        'Apporte une valeur concrète grâce à des conseils réutilisables.',
        'Exprime le point de vue de la marque sans inventer de preuves.',
        'Fait remonter les questions et expériences du public.',
        'Aide à décider sans transformer chaque publication en promotion.',
      ]
    : [
        'يقدّم فائدة عملية قابلة للتطبيق.',
        'يوضح وجهة نظر العلامة من دون اختلاق أدلة.',
        'يساعد على فهم أسئلة الجمهور وتجاربهم.',
        'يدعم اتخاذ قرار واعٍ من دون تحويل كل منشور إلى إعلان.',
      ];
  const topicSeeds = getTopicSeeds(brand, locale);
  const topicLenses = english
    ? ['Teach and practice', 'Diagnose and explain', 'Invite learners to discuss', 'Apply in a course exercise']
    : french
    ? ['Enseigner et pratiquer', 'Diagnostiquer et expliquer', 'Inviter le public à échanger', 'Appliquer dans un exercice']
    : algerian
    ? ['علم وطبق', 'شخّص واشرح', 'خلي الجمهور يناقش', 'طبق في تمرين']
    : ['علّم وطبّق', 'شخّص واشرح', 'ادعُ الجمهور للنقاش', 'طبّق في تمرين'];
  const topicVariations = english
    ? ['step-by-step walkthrough', 'worked example', 'quality checklist', 'common mistake to avoid', 'practice challenge']
    : french
    ? ['démonstration étape par étape', 'exemple détaillé', 'liste de contrôle qualité', 'erreur fréquente à éviter', 'exercice pratique']
    : algerian
    ? ['شرح خطوة بخطوة', 'مثال تطبيقي', 'قائمة مراجعة', 'غلطة لازم تتفاداها', 'تحدي للتطبيق']
    : ['شرح خطوة بخطوة', 'مثال تطبيقي', 'قائمة تحقق للجودة', 'خطأ شائع يجب تجنبه', 'تدريب عملي'];
  const rolesPillars = roles.map((role, index) => {
    const topicExamples = Array.from({ length: 5 }, (_, topicIndex) => {
      const seed = topicSeeds[(index * 2 + topicIndex) % topicSeeds.length]!;
      return `${topicLenses[index]}: ${topicVariations[topicIndex]} — ${seed.topic}`;
    });
    const concreteDescription = english
      ? `${descriptions[index]} Concrete directions: ${topicExamples[0]}; ${topicExamples[1]}.`
      : french
      ? `${descriptions[index]} Axes concrets : ${topicExamples[0]} ; ${topicExamples[1]}.`
      : algerian
      ? `${descriptions[index]} أمثلة تطبيقية: ${topicExamples[0]} و${topicExamples[1]}.`
      : `${descriptions[index]} أمثلة عملية: ${topicExamples[0]} و${topicExamples[1]}.`;
    const offerConnection = index === 3
      ? fields.offer || (english
        ? 'No offer was provided; answer the audience need without forcing a promotion.'
        : french
        ? 'Aucune offre n’est indiquée ; répondre au besoin sans promotion forcée.'
        : 'ماكانش عرض محدد؛ جاوب على حاجة الجمهور بلا ترويج مفروض.')
      : fields.offer
      ? english
        ? `Build relevant skills and trust so the audience can assess whether ${fields.offer} fits their needs; do not promote it in every post.`
        : french
        ? `Développer les compétences et la confiance pour aider le public à évaluer si ${fields.offer} lui convient, sans promotion systématique.`
        : `طوّر المهارات والثقة باش الجمهور يقدر يعرف إذا ${fields.offer} يناسب احتياجه، بلا ما تروّجلو في كل منشور.`
      : english
      ? 'Build useful knowledge without inventing an offer or forcing promotion.'
      : french
      ? 'Apporter des connaissances utiles sans inventer d’offre ni forcer la promotion.'
      : 'قدم معرفة نافعة بلا ما تخترع عرض ولا تفرض الترويج.';
    return {
      name: role,
      strategicRole: role,
      percentage: [30, 25, 25, 20][index],
      objective: descriptions[index],
      description: concreteDescription,
      audienceProblems: problemsByPillar[index],
      contentThemes: themesByPillar[index],
      exampleTopics: topicExamples,
      recommendedFormat: formats[index]!.join(' / '),
      recommendedFormats: formats[index],
      offerConnection,
      ctaTypes: [ctas[index], ctas[(index + 1) % 4]],
      whyItMatters: why[index],
    };
  });

  return {
    pillars: rolesPillars,
    strategicSummary: (english
      ? `A brand-specific strategy for ${fields.audience} in ${fields.niche}. The 30/25/25/20 split prioritizes foundational teaching while preserving space for expertise, audience learning, and relevant offer education.`
      : french
      ? `Une stratégie dédiée aux ${fields.audience} en ${fields.niche}. La répartition 30/25/25/20 privilégie les bases pédagogiques tout en gardant une place à l’expertise, aux échanges et à l’offre.`
      : algerian
      ? `استراتيجية موجهة للجمهور في مجال العلامة. تقسيم 30/25/25/20 يعطي الأولوية للتعليم ويخلي مساحة للخبرة والتفاعل والتعريف بالعرض المناسب.`
      : `استراتيجية موجهة للجمهور في مجال العلامة. توزيع 30/25/25/20 يعطي الأولوية للتعليم مع مساحة للخبرة والتفاعل والتعريف بالعرض المناسب.`) +
      (customInstruction
        ? ` ${english ? 'Apply this custom focus' : french ? 'Appliquer cette priorité' : algerian ? 'طبق هاد التركيز' : 'طبّق هذا التركيز'}: ${customInstruction}`
        : ''),
  };
}

export function selectVerifiedRecentTrends(
  _signals: unknown,
  _now: Date = new Date(),
): VerifiedTrendEvidence[] {
  return [];
}

function getPillarName(brand: BrandContext, index: number): string {
  const pillars = brand.pillars?.filter((pillar) => pillar.name.trim()) || [];
  if (pillars.length === 0) throw new Error('Approve strategic pillars before generating a content plan.');
  return pillars[index % pillars.length]!.name.trim();
}

export function createFallbackContentPlan(
  brand: BrandContext,
  horizon: ContentPlanHorizon,
  language: string,
  now: Date = new Date(),
  timeZone = 'UTC',
  customInstructions = '',
): PlanResponse {
  const locale = getLanguage(language);
  const copy = planCopy[locale];
  const count = horizon === '48h' ? 2 : 4;
  const offsets = horizon === '48h' ? [0, 1] : [0, 2, 4, 6];
  const topicSeeds = getTopicSeeds(brand, locale);
  const formatter = new Intl.DateTimeFormat(
    locale === 'en' ? 'en-GB' : locale === 'fr' ? 'fr-FR' : 'ar-DZ',
    { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' },
  );
  const firstDate = getLocalDate(now, timeZone);
  const customInstruction = customInstructions.trim() && customFocusMatchesLanguage(customInstructions, locale)
    ? customInstructions.trim()
    : '';

  const plan = Array.from({ length: count }, (_, index): PlanItem => {
    const seedIndex = Math.floor(index * topicSeeds.length / count);
    const seed = topicSeeds[seedIndex]!;
    const topic = seed.topic;
    const localDate = addCalendarDays(firstDate, offsets[index]!);
    const date = new Date(`${localDate}T12:00:00.000Z`);
    const savedPillar = getPillarName(brand, index);
    const preparationTasks = seed.steps.map((step) =>
      locale === 'en' ? `Prepare: ${step}`
        : locale === 'fr' ? `Préparer : ${step}`
        : locale === 'ar_dz' ? `وجد: ${step}`
        : `حضّر: ${step}`
    );
    if (customInstruction) {
      preparationTasks.push(locale === 'en'
        ? `Apply the custom instruction: ${customInstruction}`
        : locale === 'fr'
        ? `Appliquer la consigne personnalisée : ${customInstruction}`
        : locale === 'ar_dz'
        ? `طبق التعليمة الخاصة: ${customInstruction}`
        : `طبّق التعليمات الخاصة: ${customInstruction}`);
    }
    const mainMessage = `${seed.problem}\n${seed.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`).join('\n')}`;
    const objectives = locale === 'en'
      ? ['Help learners recognize a common problem in a real task.', 'Teach a repeatable method they can apply immediately.', 'Invite learners to practice the method with a realistic example.', 'Review the result and choose a useful next step.']
      : locale === 'fr'
      ? ['Aider le public à reconnaître un problème concret.', 'Présenter une méthode reproductible à appliquer.', 'Inviter le public à pratiquer avec un exemple réaliste.', 'Évaluer le résultat et choisir la suite utile.']
      : locale === 'ar_dz'
      ? ['عاون الجمهور يعرف مشكل يتعاود في مهمة حقيقية.', 'اشرح طريقة يقدر يعاود يطبقها.', 'خلي الجمهور يجرب الطريقة بمثال واقعي.', 'راجع النتيجة واختار الخطوة الجاية.']
      : ['مساعدة الجمهور على تمييز مشكلة واقعية.', 'شرح طريقة قابلة للتطبيق والتكرار.', 'دعوة الجمهور لتجربة الطريقة بمثال واقعي.', 'مراجعة النتيجة واختيار الخطوة التالية.'];
    const hook = locale === 'en'
      ? `Can you spot the issue? ${seed.problem}`
      : locale === 'fr'
      ? `Repérez-vous le problème ? ${seed.problem}`
      : locale === 'ar_dz'
      ? `تقدر تعرف وين راه المشكل؟ ${seed.problem}`
      : `هل تستطيع تحديد المشكلة؟ ${seed.problem}`;
    const cta = copy.ctas[index % copy.ctas.length]!;
    const actionNeeded = preparationTasks.join('; ');
    return {
      id: `${horizon}-${index + 1}`,
      day: formatter.format(date),
      date: localDate,
      platform: copy.platform,
      format: copy.formats[index]!,
      title: topic,
      pillar: savedPillar,
      topic,
      audienceProblem: seed.problem,
      objective: objectives[index]!,
      hook,
      mainMessage,
      caption: `${topic}\n\n${seed.problem}\n\n${seed.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`).join('\n')}\n\n${cta}`,
      cta,
      preparationTasks,
      rationale: locale === 'en'
        ? `Part ${index + 1} of the ${horizon === '7d' ? 'weekly learning sequence' : 'two-day practice sequence'}: ${['identify a concrete need', 'teach an applicable method', 'practice it in a realistic example', 'review the result and choose a next step'][index]}.`
        : locale === 'fr'
        ? `Étape ${index + 1} de la progression : ${['identifier un besoin concret', 'présenter une méthode applicable', 'la pratiquer dans un exemple réaliste', 'évaluer le résultat et choisir la suite'][index]}.`
        : locale === 'ar_dz'
        ? `المرحلة ${index + 1} من التدرج: ${['حدد حاجة واضحة', 'اشرح طريقة قابلة للتطبيق', 'طبقها في مثال واقعي', 'راجع النتيجة واختار الخطوة الجاية'][index]}.`
        : `المرحلة ${index + 1} من التسلسل: ${['تحديد حاجة واضحة', 'شرح طريقة قابلة للتطبيق', 'تطبيقها في مثال واقعي', 'مراجعة النتيجة واختيار الخطوة التالية'][index]}.`,
      evidenceReferences: [],
      actionNeeded,
    };
  });

  return { plan };
}

function getExcludedPhrases(constraints = ''): string[] {
  const patterns = [
    /avoid\s+(?:recommending|mentioning|discussing|covering)\s+([^.;,\n]+)/gi,
    /(?:do not mention|don't mention|never mention|avoid|exclude|without|no)\s+([^.;,\n]+)/gi,
    /(?:تجنب|لا تذكر|عدم ذكر)\s+([^؛،.\n]+)/g,
    /(?:éviter|ne pas mentionner|sans)\s+([^;,\n]+)/gi,
  ];
  return patterns.flatMap((pattern) =>
    Array.from(constraints.matchAll(pattern), (match) => match[1]?.trim().toLowerCase() || '')
  ).filter(Boolean);
}

export function buildGenerationContext(brand: GenerationBrand, language: string) {
  const locale = getLanguage(language);
  const fields = getBrandFields(brand, locale);
  const audienceProblems = [...new Set(getTopicSeeds(brand, locale).map((seed) => seed.problem))].slice(0, 6);
  return {
    brandIdentity: fields.name,
    nicheAndDomain: fields.niche,
    targetAudience: fields.audience,
    audienceProblems,
    voice: fields.voice,
    brandProfileLanguage: brand.contentLanguage || 'Not specified',
    requestedOutputLanguage: language,
    primaryOffer: fields.offer,
    publishingConstraints: brand.constraints?.trim() || 'None specified',
    excludedTopics: getExcludedPhrases(brand.constraints || ''),
    approvedPillars: brand.pillars?.filter((pillar) => pillar.name.trim()).map((pillar) => ({
      name: pillar.name.trim(),
      description: pillar.desc.trim(),
    })) || [],
  };
}

function getTextValues(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(getTextValues);
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(getTextValues);
  }
  return [];
}

function hasPlaceholderOrTemplate(value: unknown): boolean {
  const placeholder = /\b(?:bio\s*text|positioning\s*angle\s*:|target\s*audience\s*:|value\s*proposition\s*:|lorem ipsum|tbd|todo)\b|(?:\$\{[^}]*\}|\{\{[^}]*\}\}|<[^>]+>|\[(?:insert|add|your)\b[^\]]*\])/i;
  const emptyBullet = /^\s*(?:[-*•]|\d+[.)])\s*$/m;
  return getTextValues(value).some((text) => placeholder.test(text) || emptyBullet.test(text));
}

const unsupportedClaimPattern = /\b(?:guarantee[sd]?|proven to|number one|#1|award[- ]winning|industry[- ]leading|certified expert|double your|data[- ]tested|increase[sd]? by \d+%|\d+% (?:of|more|increase))\b|(?:\b\d+(?:[.,]\d+)?\s*(?:%|percent|x|times|seconds?)\b)|(?:\b\d{1,3}(?:,\d{3})+\+?\s+(?:creators?|clients?|customers?|students?|followers?|views?)\b)|(?:\b(?:higher|more|increased?)\s+(?:saves?|views?|engagement|conversions?)\b)|(?:garantit|prouvé|numéro un|certifié|résultats garantis)|(?:مضمون|نتائج مضمونة|الأفضل رقم واحد|يزيد بنسبة \d+٪?)/gi;

export function getUnsupportedClaimFragments(value: unknown): string[] {
  return [...new Set(getTextValues(value).flatMap((text) => text.match(unsupportedClaimPattern) || []))];
}

export function hasUnsupportedClaims(value: unknown): boolean {
  return getUnsupportedClaimFragments(value).length > 0;
}

export function hasUnsupportedEvidenceClaims(value: unknown): boolean {
  const unsupportedEvidenceClaim = /\b(?:currently trending|trending now|viral right now|trend is accelerating|verified trends? (?:show|prove|confirm)|(?:is|are) trending)\b|\b(?:we|our team|i)\s+(?:checked|verified|reviewed|analyzed|analysed)\s+(?:the\s+)?(?:external\s+)?(?:sources|trend sources|platform analytics|account analytics|instagram insights|meta insights)\b|\b(?:according to|based on)\s+(?:the\s+)?(?:latest\s+)?(?:instagram|meta|account|platform)?\s*(?:analytics|insights|research|sources|data)\b|\bstudies show\b/i;
  return getTextValues(value).some((text) => unsupportedEvidenceClaim.test(text));
}

function normalizedText(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

function hasDistinctStrings(values: unknown[]): boolean {
  const normalized = values.map((value) => typeof value === 'string' ? normalizedText(value) : '');
  return normalized.every(Boolean) && new Set(normalized).size === normalized.length;
}

function hasDistinctContent(values: string[], threshold = 0.82): boolean {
  const tokenSets = values.map((value) => new Set(normalizedText(value).split(' ').filter((token) => token.length > 2)));
  return tokenSets.every((left, index) => tokenSets.slice(0, index).every((right) => {
    const shared = [...left].filter((token) => right.has(token)).length;
    const total = new Set([...left, ...right]).size;
    return total === 0 || shared / total < threshold;
  }));
}

export function hasRequestedLanguage(value: unknown, language = '', brand?: BrandContext): boolean {
  if (!language) return true;
  const locale = getLanguage(language);
  const brandTerms = [
    brand?.name,
    brand?.niche,
    brand?.targetAudience,
    brand?.primaryOffer,
    ...(brand?.pillars || []).map((pillar) => pillar.name),
  ].filter((term): term is string => !!term?.trim());
  const content = getTextValues(value).map((text) => brandTerms.reduce(
    (result, term) => result.split(term.toLowerCase()).join(' '),
    text.toLowerCase(),
  )).filter((text) =>
    text.length > 18 && !/^(?:\d{1,2}[-–]\d{1,2}s|https?:\/\/)/i.test(text)
  );
  if (content.length === 0) return false;
  if (locale === 'en') {
    return content.filter((text) => !/[\u0600-\u06FF]/.test(text)).length / content.length >= 0.8;
  }
  if (locale === 'fr') {
    const frenchText = /(?:\b(?:le|la|les|des|pour|avec|dans|une|un|et|de|du|que|votre|vous|créer|pratique)\b|[àâçéèêëîïôùûüÿœæ])/i;
    return content.filter((text) => !/[\u0600-\u06FF]/.test(text) && frenchText.test(text)).length / content.length >= 0.35;
  }
  const arabicContent = content.filter((text) => /[\u0600-\u06FF]/.test(text));
  if (arabicContent.length / content.length < 0.6) return false;
  return locale !== 'ar_dz' || /واش|راك|بزاف|ماشي|خلي|باش|دير|تاع|باها/.test(arabicContent.join(' '));
}

function isValidPlanDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
}

function customFocusMatchesLanguage(text: string, language: PlanLanguage): boolean {
  const value = text.trim();
  if (!value) return false;
  if (language === 'en') return !/[\u0600-\u06FF]/.test(value);
  if (language === 'fr') {
    return !/[\u0600-\u06FF]/.test(value) &&
      (/[àâçéèêëîïôùûüÿœæ]/i.test(value) || /\b(?:le|la|les|des|pour|avec|dans|créer|comment|présentation)\b/i.test(value));
  }
  const arabicCharacters = (value.match(/[\u0600-\u06FF]/g) || []).length;
  const latinWords = (value.match(/[A-Za-z]{2,}/g) || []).length;
  return arabicCharacters > 0 && latinWords <= Math.max(2, arabicCharacters / 8);
}

export function isValidContentPlan(
  value: unknown,
  horizon: ContentPlanHorizon,
  brand?: BrandContext,
  _allowedEvidenceUrls: string[] = [],
  now: Date = new Date(),
  timeZone = 'UTC',
): value is PlanResponse {
  if (!value || typeof value !== 'object' || !Array.isArray((value as PlanResponse).plan)) return false;
  const { plan } = value as PlanResponse;
  const minimumItems = horizon === '48h' ? 2 : 4;
  const maximumItems = horizon === '48h' ? 3 : 7;
  if (plan.length < minimumItems || plan.length > maximumItems || plan.some((item) => !item || typeof item !== 'object')) return false;

  const normalizedTitles = plan.map((item) => typeof item.title === 'string' ? item.title.trim().toLowerCase() : '');
  if (normalizedTitles.some((title) => !title) || new Set(normalizedTitles).size !== normalizedTitles.length) return false;
  const topics = plan.map((item) => typeof item.topic === 'string' ? item.topic.trim().toLowerCase() : '');
  if (topics.some((topic) => !topic) || !hasDistinctStrings(topics) || !hasDistinctContent(topics)) return false;

  const approvedPillars = new Set(brand?.pillars?.map((pillar) => pillar.name.trim()).filter(Boolean) || []);
  if (approvedPillars.size === 0) return false;
  const excludedPhrases = getExcludedPhrases(brand?.constraints);
  let firstDate: string;
  try {
    firstDate = getLocalDate(now, timeZone);
  } catch {
    return false;
  }
  const endDate = addCalendarDays(firstDate, horizon === '48h' ? 2 : 7);

  return plan.every((item) =>
    item &&
    typeof item.day === 'string' && item.day.trim().length > 0 &&
    isValidPlanDate(item.date) &&
    item.date >= firstDate && item.date < endDate &&
    typeof item.platform === 'string' && item.platform.trim().length > 0 &&
    typeof item.format === 'string' && item.format.trim().length > 0 &&
    typeof item.title === 'string' && item.title.trim().length > 0 &&
    typeof item.pillar === 'string' && item.pillar.trim().length > 0 &&
    (approvedPillars.size === 0 || approvedPillars.has(item.pillar)) &&
    typeof item.topic === 'string' && item.topic.trim().length > 0 &&
    typeof item.audienceProblem === 'string' && item.audienceProblem.trim().length > 0 &&
    typeof item.objective === 'string' && item.objective.trim().length > 0 &&
    typeof item.hook === 'string' && item.hook.trim().length > 0 &&
    typeof item.mainMessage === 'string' && item.mainMessage.trim().length > 0 &&
    typeof item.caption === 'string' && item.caption.trim().length > 0 &&
    typeof item.cta === 'string' && item.cta.trim().length > 0 &&
    Array.isArray(item.preparationTasks) && item.preparationTasks.length > 0 &&
    item.preparationTasks.every((task) => typeof task === 'string' && task.trim().length > 0) &&
    typeof item.rationale === 'string' && item.rationale.trim().length > 0 &&
    Array.isArray(item.evidenceReferences) &&
    item.evidenceReferences.length === 0 &&
    item.time == null &&
    !hasPlaceholderOrTemplate(item) &&
    !hasUnsupportedClaims(item) &&
    !hasUnsupportedEvidenceClaims(item) &&
    !excludedPhrases.some((phrase) => JSON.stringify(item).toLowerCase().includes(phrase)),
  );
}

export function containsExcludedPhrases(value: unknown, brand: BrandContext): boolean {
  const excludedPhrases = getExcludedPhrases(brand.constraints);
  if (excludedPhrases.length === 0) return false;
  const text = JSON.stringify(value).toLowerCase();
  return excludedPhrases.some((phrase) => text.includes(phrase));
}

function isValidIdeas(value: unknown, brand: BrandContext, format?: string): boolean {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { ideas?: unknown }).ideas)) return false;
  const ideas = (value as { ideas: Array<Record<string, unknown>> }).ideas;
  if (ideas.length < 3 || ideas.some((idea) => !idea || typeof idea !== 'object' || Array.isArray(idea))) return false;

  const approvedPillars = new Set(brand.pillars?.map((pillar) => pillar.name.trim()).filter(Boolean) || []);
  if (approvedPillars.size === 0) return false;
  const titles = ideas.map((idea) => typeof idea.title === 'string' ? idea.title.trim().toLowerCase() : '');
  const topics = ideas.map((idea) => typeof idea.topic === 'string' ? idea.topic.trim().toLowerCase() : '');
  if (!hasDistinctStrings(titles) || !hasDistinctContent(titles) || !hasDistinctStrings(topics) || !hasDistinctContent(topics)) return false;
  const expectedFormats: Record<string, string[]> = {
    reel: ['reel', 'ريل'],
    carousel: ['carousel', 'carrousel', 'كاروسيل'],
    post: ['post', 'publication', 'منشور', 'بوست'],
  };
  const formatMarkers = format ? expectedFormats[format.toLowerCase()] : undefined;

  return ideas.every((idea) => {
    const itemFormat = typeof idea.format === 'string' ? idea.format.toLowerCase() : '';
    return (
      typeof idea.title === 'string' && idea.title.trim().length > 0 &&
      typeof idea.audienceProblem === 'string' && idea.audienceProblem.trim().length > 0 &&
      typeof idea.topic === 'string' && idea.topic.trim().length > 0 &&
      typeof idea.angle === 'string' && idea.angle.trim().length > 0 &&
      typeof idea.hook === 'string' && idea.hook.trim().length > 0 &&
      typeof idea.script === 'string' && idea.script.trim().length > 0 &&
      typeof idea.caption === 'string' && idea.caption.trim().length > 0 &&
      normalizedText(idea.hook) !== normalizedText(idea.caption) &&
      normalizedText(idea.script) !== normalizedText(idea.caption) &&
      typeof idea.cta === 'string' && idea.cta.trim().length > 0 &&
      typeof idea.strategicPurpose === 'string' && idea.strategicPurpose.trim().length > 0 &&
      typeof idea.contentObjective === 'string' && idea.contentObjective.trim().length > 0 &&
      typeof idea.rationale === 'string' && idea.rationale.trim().length > 0 &&
      Array.isArray(idea.hashtags) && idea.hashtags.length >= 3 &&
      idea.hashtags.every((tag) => typeof tag === 'string' && tag.trim().startsWith('#')) &&
      typeof idea.pillar === 'string' &&
      (approvedPillars.size === 0 || approvedPillars.has(idea.pillar)) &&
      typeof idea.format === 'string' &&
      (!formatMarkers || formatMarkers.some((marker) => itemFormat.includes(marker))) &&
      (format !== 'reel' || (
        Array.isArray(idea.scenes) && idea.scenes.length >= 5 &&
        idea.scenes.every((scene: any) =>
          scene && typeof scene === 'object' &&
          typeof scene.time === 'string' && typeof scene.visual === 'string' && scene.visual.trim() &&
          typeof scene.dialogue === 'string' && scene.dialogue.trim() &&
          typeof scene.onScreenText === 'string' && scene.onScreenText.trim()
        ) && idea.script.length >= 180
      )) &&
      (format !== 'carousel' || (
        Array.isArray(idea.slides) && idea.slides.length === 7 &&
        idea.slides.every((slide: any) =>
          slide && typeof slide === 'object' &&
          typeof slide.title === 'string' && slide.title.trim() &&
          typeof slide.body === 'string' && slide.body.trim().length >= 12
        ) && hasDistinctStrings(idea.slides.map((slide: any) => slide.body))
      )) &&
      (format !== 'post' || (
        typeof idea.mainMessage === 'string' && idea.mainMessage.trim().length > 0 &&
        typeof idea.visualConcept === 'string' && idea.visualConcept.trim().length > 0 &&
        typeof idea.onScreenText === 'string' && idea.onScreenText.trim().length > 0
      )) &&
      !hasPlaceholderOrTemplate(idea) &&
      !hasUnsupportedClaims(idea) &&
      !hasUnsupportedEvidenceClaims(idea) &&
      !containsExcludedPhrases(idea, brand)
    );
  });
}

function isValidBio(value: unknown, brand: BrandContext): boolean {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { options?: unknown }).options)) return false;
  const options = (value as { options: Array<Record<string, unknown>> }).options;
  if (options.some((option) => !option || typeof option !== 'object' || Array.isArray(option))) return false;
  return options.length === 3 && hasDistinctStrings(options.map((option) => String(option.text || ''))) &&
    options.every((option) =>
    typeof option.text === 'string' && option.text.trim().length > 0 &&
    Array.from(option.text).length <= 150 &&
    option.characterCount === Array.from(option.text).length &&
    option.platformCharacterLimit === 150 &&
    typeof option.style === 'string' && option.style.trim().length > 0 &&
    typeof option.positioningAngle === 'string' && option.positioningAngle.trim().length > 0 &&
    typeof option.targetAudience === 'string' && option.targetAudience.trim().length > 0 &&
    typeof option.valueProposition === 'string' && option.valueProposition.trim().length > 0 &&
    typeof option.cta === 'string' && option.cta.trim().length > 0 &&
    typeof option.whyItWorks === 'string' && option.whyItWorks.trim().length > 0 &&
    !hasPlaceholderOrTemplate(option) &&
    !hasUnsupportedClaims(option) &&
    !containsExcludedPhrases(option, brand),
  );
}

function isValidStrategy(value: unknown, brand: BrandContext): boolean {
  if (!value || typeof value !== 'object' || !Array.isArray((value as { pillars?: unknown }).pillars)) return false;
  const result = value as { pillars: Array<Record<string, unknown>>; strategicSummary?: unknown };
  if (result.pillars.some((pillar) => !pillar || typeof pillar !== 'object' || Array.isArray(pillar))) return false;
  const names = result.pillars.map((pillar) => typeof pillar.name === 'string' ? pillar.name.trim().toLowerCase() : '');
  const percentageTotal = result.pillars.reduce(
    (total, pillar) => total + (typeof pillar.percentage === 'number' ? pillar.percentage : 0),
    0,
  );
  const strategicRoles = result.pillars.map((pillar) =>
    typeof pillar.strategicRole === 'string' ? pillar.strategicRole.trim().toLowerCase() : ''
  );
  const safeProblemGroups = result.pillars.map((pillar) =>
    (Array.isArray(pillar.audienceProblems) ? pillar.audienceProblems : [])
      .filter((problem): problem is string => typeof problem === 'string')
      .map(normalizedText)
  );
  const themeGroups = result.pillars.map((pillar) =>
    (Array.isArray(pillar.contentThemes) ? pillar.contentThemes : [])
      .filter((theme): theme is string => typeof theme === 'string')
      .map(normalizedText)
  );
  const topicGroups = result.pillars.map((pillar) =>
    (Array.isArray(pillar.exampleTopics) ? pillar.exampleTopics : [])
      .filter((topic): topic is string => typeof topic === 'string')
      .map(normalizedText)
  );
  const percentageValues = result.pillars.map((pillar) => pillar.percentage);
  const uniqueBetweenGroups = (groups: string[][]) => groups.every((group, index) =>
    groups.slice(0, index).every((previous) => {
      const overlap = group.filter((entry) => previous.includes(entry)).length;
      return overlap === 0;
    })
  );
  return result.pillars.length === 4 &&
    new Set(names).size === names.length &&
    new Set(strategicRoles).size === strategicRoles.length &&
    new Set(percentageValues).size > 1 &&
    percentageTotal === 100 &&
    uniqueBetweenGroups(safeProblemGroups) &&
    uniqueBetweenGroups(themeGroups) &&
    uniqueBetweenGroups(topicGroups) &&
    typeof result.strategicSummary === 'string' && result.strategicSummary.trim().length > 0 &&
    result.pillars.every((pillar) =>
      typeof pillar.name === 'string' && pillar.name.trim().length > 0 &&
      typeof pillar.strategicRole === 'string' && pillar.strategicRole.trim().length > 0 &&
      typeof pillar.objective === 'string' && pillar.objective.trim().length > 0 &&
      typeof pillar.description === 'string' && pillar.description.trim().length > 0 &&
      Array.isArray(pillar.audienceProblems) && pillar.audienceProblems.length >= 3 &&
      pillar.audienceProblems.every((problem) => typeof problem === 'string' && problem.trim().length > 0) &&
      Array.isArray(pillar.contentThemes) && pillar.contentThemes.length >= 3 &&
      pillar.contentThemes.every((theme) => typeof theme === 'string' && theme.trim().length > 0) &&
      Array.isArray(pillar.recommendedFormats) && pillar.recommendedFormats.length > 0 &&
      pillar.recommendedFormats.every((format) => typeof format === 'string' && format.trim().length > 0) &&
      typeof pillar.offerConnection === 'string' && pillar.offerConnection.trim().length > 0 &&
      Array.isArray(pillar.ctaTypes) && pillar.ctaTypes.length > 0 &&
      pillar.ctaTypes.every((cta) => typeof cta === 'string' && cta.trim().length > 0) &&
      typeof pillar.whyItMatters === 'string' && pillar.whyItMatters.trim().length > 0 &&
      Array.isArray(pillar.exampleTopics) && pillar.exampleTopics.length >= 5 &&
      hasDistinctStrings(pillar.exampleTopics) &&
      pillar.exampleTopics.every((topic) => typeof topic === 'string' && topic.trim().length > 0) &&
      typeof pillar.percentage === 'number' && pillar.percentage > 0 && pillar.percentage <= 100 &&
      !hasPlaceholderOrTemplate(pillar) &&
      !hasUnsupportedClaims(pillar) &&
      !containsExcludedPhrases(pillar, brand),
    );
}

export function isValidGenerationResult(
  tool: string,
  value: unknown,
  brand: BrandContext,
  format?: string,
  language = '',
  verifiedEvidenceUrls: string[] = [],
  now: Date = new Date(),
  timeZone = 'UTC',
): boolean {
  const valid = tool === 'ideas' ? isValidIdeas(value, brand, format)
    : tool === 'bio' ? isValidBio(value, brand)
    : tool === 'strategy' ? isValidStrategy(value, brand)
    : tool === 'plan_48h' ? isValidContentPlan(value, '48h', brand, verifiedEvidenceUrls, now, timeZone)
    : tool === 'plan_7d' ? isValidContentPlan(value, '7d', brand, verifiedEvidenceUrls, now, timeZone)
    : false;
  return valid && !hasPlaceholderOrTemplate(value) && !hasUnsupportedClaims(value) &&
    !hasUnsupportedEvidenceClaims(value) && hasRequestedLanguage(value, language, brand);
}

export function getGenerationResultProblems(
  tool: string,
  value: unknown,
  brand: BrandContext,
  format?: string,
  language = '',
  verifiedEvidenceUrls: string[] = [],
  now: Date = new Date(),
  timeZone = 'UTC',
): string[] {
  const problems: string[] = [];
  if (!value || typeof value !== 'object') return ['Expected a JSON object'];

  if (tool === 'ideas') {
    const ideas = (value as { ideas?: Array<Record<string, unknown>> }).ideas;
    if (!Array.isArray(ideas) || ideas.length < 3) return ['Expected three content ideas'];
    if (ideas.some((idea) => !idea || typeof idea !== 'object')) return ['An idea entry is not a JSON object'];
    ideas.forEach((idea, index) => {
      const label = `Idea ${index + 1}`;
      if (typeof idea.title !== 'string' || !idea.title.trim()) problems.push(`${label} needs a specific title`);
      if (typeof idea.topic !== 'string' || !idea.topic.trim()) problems.push(`${label} needs a concrete content topic`);
      if (typeof idea.audienceProblem !== 'string' || !idea.audienceProblem.trim()) problems.push(`${label} needs a specific audience problem`);
      if (typeof idea.hook !== 'string' || !idea.hook.trim()) problems.push(`${label} needs an opening hook`);
      if (typeof idea.script !== 'string' || idea.script.trim().length < 80) problems.push(`${label} needs a complete, recordable script`);
      if (typeof idea.caption !== 'string' || !idea.caption.trim()) problems.push(`${label} needs a complete caption`);
      if (typeof idea.cta !== 'string' || !idea.cta.trim()) problems.push(`${label} needs a relevant CTA`);
      if (format === 'reel' && (!Array.isArray(idea.scenes) || idea.scenes.length < 5)) problems.push(`${label} needs at least five complete Reel scenes`);
      if (format === 'carousel' && (!Array.isArray(idea.slides) || idea.slides.length !== 7)) problems.push(`${label} needs exactly seven meaningful carousel slides`);
      if (format === 'post' && (!idea.mainMessage || !idea.visualConcept || !idea.onScreenText)) problems.push(`${label} needs its main message, visual concept, and on-screen text`);
      if (!Array.isArray(idea.hashtags) || idea.hashtags.length < 3) problems.push(`${label} needs at least three relevant hashtags`);
    });
    if (!isValidIdeas(value, brand, format) && problems.length === 0) problems.push('Ideas repeat each other, use an unapproved pillar, violate a constraint, or have inconsistent format fields');
  } else if (tool === 'bio') {
    const options = (value as { options?: Array<Record<string, unknown>> }).options;
    if (!Array.isArray(options) || options.length < 3) return ['Expected three bio options'];
    if (options.some((option) => !option || typeof option !== 'object')) return ['Bio output contains an invalid option'];
    options.forEach((option, index) => {
      const label = `Bio ${index + 1}`;
      for (const field of ['text', 'style', 'positioningAngle', 'targetAudience', 'valueProposition', 'cta', 'whyItWorks']) {
        if (typeof option[field] !== 'string' || !String(option[field]).trim()) problems.push(`${label} is missing ${field}`);
      }
      if (typeof option.text === 'string' && Array.from(option.text).length > 150) problems.push(`${label} exceeds Instagram's 150-character limit`);
      if (option.characterCount !== (typeof option.text === 'string' ? Array.from(option.text).length : -1)) problems.push(`${label} characterCount does not match its text`);
      if (option.platformCharacterLimit !== 150) problems.push(`${label} must specify Instagram's 150-character limit`);
    });
    if (!isValidBio(value, brand) && problems.length === 0) problems.push('Bio options must have meaningfully different positioning and comply with brand constraints');
  } else if (tool === 'strategy') {
    const pillars = (value as { pillars?: Array<Record<string, unknown>> }).pillars;
    if (!Array.isArray(pillars) || pillars.length !== 4) return ['Expected four strategic pillars'];
    if (pillars.some((pillar) => !pillar || typeof pillar !== 'object')) return ['Strategy contains an invalid pillar'];
    pillars.forEach((pillar, index) => {
      const label = `Pillar ${index + 1}`;
      if (typeof pillar.name !== 'string' || !pillar.name.trim()) problems.push(`${label} needs a specific name`);
      if (!Array.isArray(pillar.audienceProblems) || pillar.audienceProblems.length < 3) problems.push(`${label} needs at least three distinct audience problems`);
      if (!Array.isArray(pillar.contentThemes) || pillar.contentThemes.length < 3) problems.push(`${label} needs at least three content themes`);
      if (!Array.isArray(pillar.exampleTopics) || pillar.exampleTopics.length < 5) problems.push(`${label} needs at least five concrete example topics`);
      if (!Array.isArray(pillar.recommendedFormats) || pillar.recommendedFormats.length === 0) problems.push(`${label} needs recommended formats`);
      if (!Array.isArray(pillar.ctaTypes) || pillar.ctaTypes.length === 0) problems.push(`${label} needs CTA types`);
      if (typeof pillar.offerConnection !== 'string' || !pillar.offerConnection.trim()) problems.push(`${label} needs an offer connection`);
    });
    const total = pillars.reduce((sum, pillar) => sum + (typeof pillar.percentage === 'number' ? pillar.percentage : 0), 0);
    if (total !== 100) problems.push(`Pillar allocations total ${total}; adjust them to exactly 100 and explain the split`);
    if (!isValidStrategy(value, brand)) problems.push('Strategy pillars are incomplete, repetitive, lack five concrete topics each, or conflict with brand constraints');
  } else if (tool === 'plan_48h' || tool === 'plan_7d') {
    const horizon = tool === 'plan_48h' ? '48h' : '7d';
    const plan = (value as { plan?: Array<Record<string, unknown>> }).plan;
    if (!Array.isArray(plan) || plan.length < (horizon === '48h' ? 2 : 4)) return [`Expected a complete ${horizon} content plan`];
    if (plan.some((item) => !item || typeof item !== 'object')) return ['Plan contains a non-object item'];
    plan.forEach((item, index) => {
      const label = `Plan item ${index + 1}`;
      for (const field of ['title', 'topic', 'audienceProblem', 'objective', 'pillar', 'format', 'hook', 'mainMessage', 'caption', 'cta', 'rationale']) {
        if (typeof item[field] !== 'string' || !String(item[field]).trim()) problems.push(`${label} is missing ${field}`);
      }
      if (!Array.isArray(item.preparationTasks) || item.preparationTasks.length === 0) problems.push(`${label} needs concrete preparation tasks`);
      if (item.time != null) problems.push(`${label} must not include an unsupported posting time`);
    });
    if (!isValidContentPlan(value, horizon, brand, verifiedEvidenceUrls, now, timeZone)) problems.push('Plan items are incomplete, repetitive, outside the requested date horizon or approved pillars, or cite unsupported trend sources');
  }
  if (hasPlaceholderOrTemplate(value)) problems.push('Output contains placeholder text or an unfilled template');
  const unsupportedClaimFragments = getUnsupportedClaimFragments(value);
  if (unsupportedClaimFragments.length) {
    problems.push(`Remove unsupported claim wording: ${unsupportedClaimFragments.slice(0, 12).join(', ')}`);
  }
  if (hasUnsupportedEvidenceClaims(value)) problems.push('Output claims trend, source, research, or analytics verification that was not performed');
  if (!hasRequestedLanguage(value, language, brand)) problems.push(`Output does not consistently use the requested language: ${language}`);
  return problems;
}

export function buildContentPlanPrompt(
  brand: BrandContext,
  horizon: ContentPlanHorizon,
  language: string,
  _verifiedTrends: VerifiedTrendEvidence[] = [],
  customInstructions = '',
  timeZone = 'UTC',
  now: Date = new Date(),
): string {
  const days = horizon === '48h' ? 2 : 7;
  const firstDate = getLocalDate(now, timeZone);
  const endDate = addCalendarDays(firstDate, days);
  const context = buildGenerationContext(brand, language);
  const pillars = context.approvedPillars.length
    ? context.approvedPillars.map(({ name, description }) => `${name}: ${description}`).join('\n')
    : 'No approved pillars yet; use balanced educational, authority, engagement, and conversion roles.';
  const trends = 'No verified recent trend evidence is available. Use evergreen opportunities and do not claim a trend is current.';

  return `Create a practical ${days}-day content plan for this brand.
Write all generated fields strictly in ${language}; preserve brand names and offer names as provided.
Brand context (keep these dimensions distinct; audience is not a content topic):
${JSON.stringify({ ...context, approvedPillars: undefined }, null, 2)}
Approved strategic pillars (use their exact names and do not invent alternatives):
${pillars}
Verified trend evidence (use only when relevant; never invent metrics, sources, or recency):
${trends}

Plan requirements:
- Include ${horizon === '48h' ? '2 or 3' : '4 to 7'} realistic publications, spread appropriately across the requested period.
- Use only suggested content dates from ${firstDate} (inclusive) through ${addCalendarDays(endDate, -1)} (inclusive), based on the user's local date in ${timeZone}.
- For a weekly plan, balance the approved pillars, vary formats and audience needs, and make the sequence coherent. Respect any stated publishing constraints.
- Do not suggest a publishing time unless timing evidence is supplied; dates are sufficient.
- Dates are suggested content dates in the ${timeZone} calendar, not scheduled publication timestamps. Omit time because no account-specific timing evidence is available.
- Never invent credentials, client outcomes, engagement statistics, or guarantees.
- Each item needs: date, title, pillar, format, topic, audienceProblem, objective, hook, mainMessage, caption, cta, preparationTasks (array), and rationale.
- Each item also needs a distinct audienceProblem and objective; do not repeat concepts by changing only the format or pillar label.
- Add evidenceReferences (array of source URLs) only for verified trend evidence actually used; otherwise use an empty array.
- Use only verified trends above; if none are supplied, create evergreen ideas and do not describe them as trending.
- Follow these user instructions when compatible with the saved brand voice, constraints, and approved pillars: ${customInstructions.trim() || 'No additional instructions.'}
- Return JSON only in this exact shape: {"plan":[{"day":"...","date":"YYYY-MM-DD","platform":"Instagram","format":"...","title":"...","pillar":"...","topic":"...","audienceProblem":"...","objective":"...","hook":"...","mainMessage":"...","caption":"...","cta":"...","preparationTasks":["..."],"rationale":"...","evidenceReferences":[]}]}`;
}
