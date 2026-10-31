import assert from 'node:assert/strict';
import {
  buildGenerationContext,
  buildContentPlanPrompt,
  createFallbackBio,
  createFallbackIdeas,
  createFallbackContentPlan,
  createFallbackStrategy,
  getGenerationResultProblems,
  isValidGenerationResult,
  isValidContentPlan,
  selectVerifiedRecentTrends,
} from '../server/generation.ts';
import {
  agentEngine,
  buildCalendarPrompt,
  buildDecisionPrompt,
  createCalendarRecords,
  createDecisionRecords,
  isValidCalendarOutput,
  isValidDecisionOutput,
} from '../server/agent.ts';

const brand = {
  name: 'Northstar Studio',
  niche: 'accessible home gardening',
  targetAudience: 'apartment residents with limited space',
  voiceTone: 'clear, encouraging, practical',
  primaryOffer: 'a beginner balcony garden workshop',
  constraints: 'No unverified yield claims; avoid recommending toxic plants.',
  pillars: [
    { id: 'learn', name: 'Small-Space Lessons', desc: 'Practical planting tutorials' },
    { id: 'method', name: 'Garden Methods', desc: 'Explain choices and tradeoffs' },
    { id: 'community', name: 'Grow Together', desc: 'Invite audience questions' },
    { id: 'offer', name: 'Workshop Fit', desc: 'Explain the workshop clearly' },
  ],
};

const now = new Date('2026-03-01T10:00:00.000Z');

for (const language of ['en', 'fr', 'ar_standard', 'ar_algerian']) {
  const plan48h = createFallbackContentPlan(brand, '48h', language, now);
  const plan7d = createFallbackContentPlan(brand, '7d', language, now);

  assert.equal(plan48h.plan.length, 2);
  assert.equal(plan7d.plan.length, 4);
  assert.ok(isValidContentPlan(plan48h, '48h', brand, [], now));
  assert.ok(isValidContentPlan(plan7d, '7d', brand, [], now));
  assert.equal(plan48h.plan[0].pillar, brand.pillars[0].name);
  if (language === 'en') assert.match(plan48h.plan[0].title, /accessible home gardening/i);
  else assert.doesNotMatch(plan48h.plan[0].title, /accessible home gardening/i);
  assert.ok(plan7d.plan.every((item) => item.date && item.hook && item.caption && item.cta));
  assert.ok(plan7d.plan.every((item) => item.preparationTasks.length > 0 && item.rationale));
  if (language === 'ar_algerian') assert.match(plan48h.plan[0].hook, /واش|راك/);
}

const prompt = buildContentPlanPrompt(brand, '7d', 'English', [
  { title: 'Recent verified signal', source: 'Example Source', sourceUrl: 'https://example.com', freshnessDays: 2 },
], 'Include a step-by-step checklist', 'America/Toronto');
assert.match(prompt, /No unverified yield claims/);
assert.match(prompt, /Small-Space Lessons/);
assert.doesNotMatch(prompt, /Recent verified signal/);
assert.match(prompt, /do not describe them as trending/i);
assert.match(prompt, /step-by-step checklist/);
assert.match(prompt, /America\/Toronto/);

const trendRecords = [
  {
    title: 'Recent source-backed signal',
    source: 'Example Source',
    sourceUrl: 'https://example.com/recent',
    isVerified: true,
    observedAt: '2026-02-28T10:00:00.000Z',
  },
  {
    title: 'Record without observation date',
    source: 'Example Source',
    sourceUrl: 'https://example.com/unknown',
    isVerified: true,
  },
  {
    title: 'Old signal',
    source: 'Example Source',
    sourceUrl: 'https://example.com/old',
    isVerified: true,
    observedAt: '2026-02-20T10:00:00.000Z',
  },
  {
    title: 'Unverified signal',
    source: 'Example Source',
    sourceUrl: 'https://example.com/unverified',
    isVerified: false,
    observedAt: '2026-02-28T10:00:00.000Z',
  },
];
const selectedTrends = selectVerifiedRecentTrends(trendRecords, now);
assert.equal(selectedTrends.length, 0);

const invalidPlan = createFallbackContentPlan(brand, '48h', 'en', now);
invalidPlan.plan[0].preparationTasks = [];
assert.equal(isValidContentPlan(invalidPlan, '48h', brand, [], now), false);

const unsupportedTime = createFallbackContentPlan(brand, '48h', 'en', now);
unsupportedTime.plan[0].time = '18:30';
assert.equal(isValidContentPlan(unsupportedTime, '48h', brand, [], now), false);

const unsupportedEvidence = createFallbackContentPlan(brand, '48h', 'en', now);
unsupportedEvidence.plan[0].evidenceReferences = ['https://unverified.example/source'];
assert.equal(isValidContentPlan(unsupportedEvidence, '48h', brand, [], now), false);

const excludedTopic = createFallbackContentPlan(brand, '48h', 'en', now);
excludedTopic.plan[0].caption += ' toxic plants';
assert.equal(isValidContentPlan(excludedTopic, '48h', brand, [], now), false);

const changedBrandPlan = createFallbackContentPlan(
  { ...brand, niche: 'indoor mushroom cultivation' },
  '48h',
  'en',
  now,
);
assert.notEqual(changedBrandPlan.plan[0].title, createFallbackContentPlan(brand, '48h', 'en', now).plan[0].title);

assert.throws(
  () => createFallbackContentPlan({ ...brand, niche: '', targetAudience: '', primaryOffer: '' }, '48h', 'en', now),
  /Complete the Brand Profile/,
);

const outsideHorizon = createFallbackContentPlan(brand, '48h', 'en', now);
outsideHorizon.plan[1].date = '2026-03-03';
assert.equal(isValidContentPlan(outsideHorizon, '48h', brand, [], now), false);

const timezoneNow = new Date('2026-03-01T02:00:00.000Z');
const timezonePlan = createFallbackContentPlan(brand, '48h', 'en', timezoneNow, 'America/Los_Angeles');
assert.equal(timezonePlan.plan[0].date, '2026-02-28');
assert.ok(isValidContentPlan(timezonePlan, '48h', brand, [], timezoneNow, 'America/Los_Angeles'));

const customPlan = createFallbackContentPlan(brand, '48h', 'en', now, 'UTC', 'Include a checklist');
assert.ok(customPlan.plan.every((item) => item.preparationTasks.some((task) => task.includes('Include a checklist'))));

const ideaResult = createFallbackIdeas(brand, 'reel', 'en', 'en');
assert.ok(isValidGenerationResult('ideas', ideaResult, brand, 'reel'));
assert.equal(isValidGenerationResult('ideas', { ideas: ideaResult.ideas.slice(0, 2) }, brand, 'reel'), false);
assert.throws(
  () => createFallbackIdeas({ ...brand, pillars: [] }, 'reel', 'en', 'en'),
  /Approve strategic pillars/,
);

const bioResult = createFallbackBio(brand, 'en');
assert.ok(isValidGenerationResult('bio', bioResult, brand));
const customBioFallback = createFallbackBio(brand, 'en', 'highlight balcony access');
assert.ok(customBioFallback.options.every((option) => option.positioningAngle.includes('highlight balcony access')));

const strategyResult = createFallbackStrategy(brand, 'en');
assert.ok(isValidGenerationResult('strategy', strategyResult, brand));
assert.equal(isValidGenerationResult('strategy', { ...strategyResult, pillars: strategyResult.pillars.slice(0, 3) }, brand), false);
assert.match(createFallbackStrategy(brand, 'en', 'include a checklist').strategicSummary, /include a checklist/);

for (const language of ['en', 'fr', 'ar_standard', 'ar_algerian']) {
  for (const format of ['reel', 'carousel', 'post'] as const) {
    const ideas = createFallbackIdeas(brand, format, language, language);
    assert.ok(isValidGenerationResult('ideas', ideas, brand, format), `${language} ${format} brand-aware idea fallback should be complete`);
    if (format === 'carousel') assert.match(ideas.ideas[0].script, /Diapositive 7|الشريحة 7|Slide 7/);
  }
  const bio = createFallbackBio(brand, language);
  assert.ok(isValidGenerationResult('bio', bio, brand), `${language} brand-aware bio fallback should be complete`);
  assert.ok(bio.options.every((option) => Array.from(option.text).length <= 150));
  const strategy = createFallbackStrategy(brand, language);
  assert.ok(isValidGenerationResult('strategy', strategy, brand), `${language} detailed strategy fallback should be complete`);
  assert.equal(strategy.pillars.length, 4);
  assert.ok(strategy.pillars.every((pillar) => pillar.exampleTopics.length >= 5 && pillar.audienceProblems.length >= 3));
}

const longBrandBio = createFallbackBio({
  ...brand,
  niche: 'highly specialized sustainable indoor and balcony horticulture for urban environments',
  targetAudience: 'apartment residents with limited growing space and very specific accessibility needs',
}, 'en');
assert.ok(longBrandBio.options.every((option) => Array.from(option.text).length <= 150));
assert.ok(isValidGenerationResult('bio', longBrandBio, brand));

const customIdeas = createFallbackIdeas(brand, 'reel', 'en', 'en', 'balcony irrigation');
const otherBrandIdeas = createFallbackIdeas({
  ...brand,
  niche: 'home fermentation',
  targetAudience: 'beginner cooks',
}, 'reel', 'en', 'en', 'balcony irrigation');
assert.notEqual(customIdeas.ideas[0].audienceProblem, otherBrandIdeas.ideas[0].audienceProblem);

const digitalLearningBrand = {
  ...brand,
  name: 'SkillBridge Studio',
  niche: 'PowerPoint training and web development',
  targetAudience: 'Students and teachers',
  voiceTone: 'clear, supportive, practical',
  contentLanguage: 'ar_standard' as const,
  primaryOffer: 'beginner digital skills course',
  constraints: 'Do not invent learner outcomes, credentials, or statistics.',
};

const localizedDecisions = agentEngine.generateDecisions('test-user', digitalLearningBrand, 'ar_standard');
assert.match(localizedDecisions[0].title, /الطلاب والأساتذة/);
assert.doesNotMatch(localizedDecisions[0].title, /students and teachers|training programs/i);
assert.equal(localizedDecisions[0].trendId, null);
assert.doesNotMatch(localizedDecisions[0].confidence, /\d+%/);
assert.match(localizedDecisions[0].whyRecommended, /فكرة دائمة وليست اتجاهاً موثقاً/);

const decisionPrompt = buildDecisionPrompt(digitalLearningBrand, 'English');
assert.match(decisionPrompt, /approved pillars/i);
const aiDecisionDraft = {
  decisions: [
    { title: 'Build a mobile-friendly navigation bar', platform: 'Instagram', format: 'Reel', whyRecommended: 'Shows a practical web-development method.', hook: 'Why does this menu overflow?', outline: 'Inspect the width, adjust the layout, and test keyboard access.', cta: 'Share a layout issue.' },
    { title: 'Choose a clear slide hierarchy', platform: 'Instagram', format: 'Carousel', whyRecommended: 'Connects presentation design to a concrete learner task.', hook: 'Can the audience find the key point?', outline: 'Compare title size, spacing, and reading order.', cta: 'Save the checklist.' },
    { title: 'Review a small portfolio project', platform: 'Instagram', format: 'Post', whyRecommended: 'Gives learners a structured review approach.', hook: 'What task does this project help with?', outline: 'Name the user, task, and one design tradeoff.', cta: 'Share a review question.' },
  ],
};
assert.ok(isValidDecisionOutput(aiDecisionDraft, digitalLearningBrand, 'en'));
assert.ok(createDecisionRecords('test-user', digitalLearningBrand, 'en', aiDecisionDraft).every((item) => item.status === 'proposed' && item.trendId === null));
assert.equal(isValidDecisionOutput({
  ...aiDecisionDraft,
  decisions: aiDecisionDraft.decisions.map((item, index) => index ? item : { ...item, title: '80% of students finish the course.' }),
}, digitalLearningBrand, 'en'), false);

const calendarPrompt = buildCalendarPrompt(digitalLearningBrand, 'English', 'America/Toronto', now);
assert.match(calendarPrompt, /2026-03-01 through 2026-03-07/);
const aiCalendarDraft = {
  items: [
    { title: 'Explain a navigation overflow', platform: 'Instagram', format: 'Carousel', date: '2026-03-01', pillar: digitalLearningBrand.pillars[0].name, hook: 'Why does the menu exceed the screen?', notes: 'Show the cause and a responsive fix.' },
    { title: 'Structure a useful training slide', platform: 'Instagram', format: 'Reel', date: '2026-03-03', pillar: digitalLearningBrand.pillars[1].name, hook: 'Can learners scan this slide?', notes: 'Compare the title, example, and supporting details.' },
    { title: 'Review one portfolio task', platform: 'Instagram', format: 'Post', date: '2026-03-06', pillar: digitalLearningBrand.pillars[2].name, hook: 'What user task does this project solve?', notes: 'Invite a practical review question.' },
  ],
};
assert.ok(isValidCalendarOutput(aiCalendarDraft, digitalLearningBrand, 'en', 'America/Toronto', now));
assert.ok(createCalendarRecords('test-user', digitalLearningBrand, 'en', aiCalendarDraft, 'America/Toronto', now)
  .every((item) => item.status === 'proposed' && /^\d{4}-\d{2}-\d{2}$/.test(item.time)));
assert.equal(isValidCalendarOutput({
  ...aiCalendarDraft,
  items: aiCalendarDraft.items.map((item, index) => index ? item : { ...item, time: '18:30' }),
}, digitalLearningBrand, 'en', 'America/Toronto', now), false);
const frenchDecisions = agentEngine.generateDecisions('test-user', digitalLearningBrand, 'fr');
assert.doesNotMatch(frenchDecisions[0].title, /Students and teachers|PowerPoint training/i);
assert.ok(frenchDecisions.every((decision) => decision.trendId === null));
const calendarProposals = agentEngine.generateCalendar('test-user', digitalLearningBrand, 'en');
assert.ok(calendarProposals.every((item) => item.status === 'proposed'));
assert.ok(calendarProposals.every((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.time)));
assert.ok(calendarProposals.every((item) => digitalLearningBrand.pillars.some((pillar) => pillar.name === item.pillar)));
assert.throws(
  () => agentEngine.generateCalendar('test-user', { ...digitalLearningBrand, pillars: [] }, 'en'),
  /Approve strategic pillars/,
);

const enContext = buildGenerationContext(digitalLearningBrand, 'en');
assert.equal(enContext.targetAudience, 'Students and teachers');
assert.ok(enContext.audienceProblems.length >= 3);
assert.equal(enContext.requestedOutputLanguage, 'en');
assert.equal(enContext.brandProfileLanguage, 'ar_standard');
assert.equal(enContext.approvedPillars.length, 4);

for (const language of ['en', 'fr', 'ar_standard', 'ar_algerian']) {
  const strategy = createFallbackStrategy(digitalLearningBrand, language);
  assert.ok(isValidGenerationResult('strategy', strategy, digitalLearningBrand, undefined, language), `${language} strategy should be complete and localized`);
  assert.equal(strategy.pillars.length, 4);
  assert.equal(strategy.pillars.reduce((sum, pillar) => sum + pillar.percentage, 0), 100);
  assert.equal(new Set(strategy.pillars.map((pillar) => pillar.audienceProblems[0])).size, 4);
  assert.equal(new Set(strategy.pillars.map((pillar) => pillar.contentThemes[0])).size, 4);
  assert.ok(strategy.pillars.every((pillar) => pillar.exampleTopics.length >= 5));

  const bio = createFallbackBio(digitalLearningBrand, language);
  assert.ok(isValidGenerationResult('bio', bio, digitalLearningBrand, undefined, language), `${language} bios should be complete and localized`);
  assert.equal(bio.options.length, 3);
  assert.equal(new Set(bio.options.map((option) => option.text)).size, 3);
  assert.ok(bio.options.every((option) =>
    option.characterCount === Array.from(option.text).length &&
    option.characterCount <= option.platformCharacterLimit
  ));

  for (const format of ['reel', 'carousel', 'post'] as const) {
    const ideas = createFallbackIdeas(digitalLearningBrand, format, language, language);
    assert.ok(isValidGenerationResult('ideas', ideas, digitalLearningBrand, format, language), `${language} ${format} ideas should be publishable`);
    assert.equal(new Set(ideas.ideas.map((idea) => idea.topic)).size, 3);
    if (format === 'reel') {
      assert.ok(ideas.ideas.every((idea) => idea.scenes.length >= 5 && idea.script.length > 180));
      assert.ok(ideas.ideas.every((idea) => new Set(idea.scenes.map((scene) => scene.visual)).size === idea.scenes.length));
    }
    if (format === 'carousel') {
      assert.ok(ideas.ideas.every((idea) => idea.slides.length === 7));
      assert.ok(ideas.ideas.every((idea) => new Set(idea.slides.map((slide) => slide.body)).size === 7));
    }
    if (format === 'post') {
      assert.ok(ideas.ideas.every((idea) => idea.mainMessage && idea.visualConcept && idea.onScreenText));
    }
  }

  const plan48h = createFallbackContentPlan(digitalLearningBrand, '48h', language, now);
  const plan7d = createFallbackContentPlan(digitalLearningBrand, '7d', language, now);
  assert.ok(isValidGenerationResult('plan_48h', plan48h, digitalLearningBrand, undefined, language, [], now), `${language} 48-hour plan should be complete`);
  assert.ok(isValidGenerationResult('plan_7d', plan7d, digitalLearningBrand, undefined, language, [], now), `${language} 7-day plan should be complete`);
  assert.equal(new Set(plan7d.plan.map((item) => item.topic)).size, 4);
  assert.ok(plan7d.plan.every((item) => item.audienceProblem && item.objective && item.preparationTasks.length >= 3));
}

const badBio = createFallbackBio(digitalLearningBrand, 'en');
badBio.options[0].text = 'Bio text';
badBio.options[0].characterCount = Array.from(badBio.options[0].text).length;
assert.equal(isValidGenerationResult('bio', badBio, digitalLearningBrand), false);

const unsupportedReel = createFallbackIdeas(digitalLearningBrand, 'reel', 'en', 'en');
unsupportedReel.ideas[0].script += '\nGuaranteed to double your results.';
assert.equal(isValidGenerationResult('ideas', unsupportedReel, digitalLearningBrand, 'reel'), false);

for (const fabricatedClaim of [
  '80% of viewers leave after 1.8 seconds.',
  '90% of carousel posts fail to get saves.',
  'Our 1,200+ creators use data-tested systems.',
  'This approach gets 3.2x higher saves.',
  'We checked Instagram analytics and confirmed this is currently trending.',
]) {
  const claim = createFallbackIdeas(digitalLearningBrand, 'reel', 'en', 'en');
  claim.ideas[0].script += `\n${fabricatedClaim}`;
  assert.equal(isValidGenerationResult('ideas', claim, digitalLearningBrand, 'reel'), false, fabricatedClaim);
}

const incompleteReel = createFallbackIdeas(digitalLearningBrand, 'reel', 'en', 'en');
incompleteReel.ideas[0].script = '- \n- ';
assert.equal(isValidGenerationResult('ideas', incompleteReel, digitalLearningBrand, 'reel'), false);
assert.ok(getGenerationResultProblems('ideas', incompleteReel, digitalLearningBrand, 'reel').length > 0);

const repeatedPlan = createFallbackContentPlan(digitalLearningBrand, '7d', 'en', now);
repeatedPlan.plan[1].topic = repeatedPlan.plan[0].topic;
assert.equal(isValidGenerationResult('plan_7d', repeatedPlan, digitalLearningBrand, undefined, 'en', [], now), false);

const repeatedStrategy = createFallbackStrategy(digitalLearningBrand, 'en');
repeatedStrategy.pillars[1].audienceProblems = [...repeatedStrategy.pillars[0].audienceProblems];
assert.equal(isValidGenerationResult('strategy', repeatedStrategy, digitalLearningBrand, undefined, 'en'), false);

console.log('Generation workflow tests passed.');
