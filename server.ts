import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';

app.use(express.json({ limit: '10mb' }));

type GeminiFailureKind = 'quota_exceeded' | 'rate_limited' | 'provider_unavailable' | 'provider_configuration' | 'invalid_response' | 'not_configured';
interface GeminiFailure {
  kind: GeminiFailureKind;
  retryAt: string | null;
}

let geminiUnavailableUntil = 0;
let geminiUnavailableKind: GeminiFailureKind | null = null;

function classifyGeminiFailure(error: unknown): GeminiFailure {
  const message = error instanceof Error ? error.message : String(error);
  let details = message;
  try {
    const parsed: unknown = JSON.parse(message);
    if (parsed && typeof parsed === 'object') {
      const top = parsed as Record<string, unknown>;
      const payload = top.error && typeof top.error === 'object'
        ? top.error as Record<string, unknown>
        : top;
      details = `${payload.code || ''} ${payload.status || ''} ${payload.message || ''} ${JSON.stringify(payload.details || '')}`;
    }
  } catch {
    details = message;
  }

  const normalized = details.toLowerCase();
  let kind: GeminiFailureKind;
  let cooldownMs: number;
  if (/\b429\b|resource_exhausted|quota exceeded|quotaexceeded/.test(normalized)) {
    kind = /per day|perday|requestsperday|requests per day|daily quota/.test(normalized)
      ? 'quota_exceeded'
      : 'rate_limited';
    const retrySeconds = normalized.match(/retrydelay["':\s]*["']?(\d+(?:\.\d+)?)s/);
    cooldownMs = retrySeconds ? Number(retrySeconds[1]) * 1000 : 5 * 60 * 1000;
  } else if (/\b401\b|\b403\b|permission_denied|unauthenticated|api key not valid|invalid api key/.test(normalized)) {
    kind = 'provider_configuration';
    cooldownMs = 10 * 60 * 1000;
  } else if (error instanceof InvalidGeminiJsonError) {
    kind = 'invalid_response';
    cooldownMs = 30 * 1000;
  } else {
    kind = 'provider_unavailable';
    cooldownMs = 60 * 1000;
  }
  const retryAtMs = Date.now() + cooldownMs;
  if (retryAtMs > geminiUnavailableUntil) {
    geminiUnavailableUntil = retryAtMs;
    geminiUnavailableKind = kind;
  }
  return { kind, retryAt: new Date(geminiUnavailableUntil).toISOString() };
}

function currentGeminiFailure(): GeminiFailure | null {
  if (Date.now() >= geminiUnavailableUntil || !geminiUnavailableKind) {
    geminiUnavailableUntil = 0;
    geminiUnavailableKind = null;
    return null;
  }
  return {
    kind: geminiUnavailableKind,
    retryAt: new Date(geminiUnavailableUntil).toISOString(),
  };
}

function clearGeminiFailure(): void {
  geminiUnavailableUntil = 0;
  geminiUnavailableKind = null;
}

function sendGeminiFailure(res: Response, failure: GeminiFailure) {
  const response = {
    success: false,
    code: failure.kind === 'quota_exceeded' ? 'GEMINI_QUOTA_EXCEEDED'
      : failure.kind === 'rate_limited' ? 'GEMINI_RATE_LIMITED'
      : failure.kind === 'provider_configuration' || failure.kind === 'not_configured' ? 'GEMINI_NOT_CONFIGURED'
      : failure.kind === 'invalid_response' ? 'GEMINI_INVALID_RESPONSE'
      : 'GEMINI_UNAVAILABLE',
    error: failure.kind === 'quota_exceeded'
      ? 'Gemini has reached its request quota. No content was generated. Please check your Google AI Studio quota or try again after it resets.'
      : failure.kind === 'rate_limited'
      ? 'Gemini is receiving requests too quickly. No content was generated. Please try again later.'
      : failure.kind === 'provider_configuration' || failure.kind === 'not_configured'
      ? 'Gemini is not available. Check the server-side API key and Google AI Studio project configuration.'
      : failure.kind === 'invalid_response'
      ? 'Gemini returned content that did not satisfy CreatorPilot validation. No content was generated; please try again.'
      : 'Gemini is temporarily unavailable. No content was generated; please try again later.',
    retryAt: failure.retryAt,
  };
  const status = failure.kind === 'quota_exceeded' || failure.kind === 'rate_limited' ? 429
    : failure.kind === 'invalid_response' ? 502
    : failure.kind === 'provider_configuration' || failure.kind === 'not_configured' ? 503
    : 503;
  return res.status(status).json(response);
}

import { dbService } from './src/db/service.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  buildCalendarPrompt,
  buildDecisionPrompt,
  createCalendarRecords,
  createDecisionRecords,
  isValidCalendarOutput,
  isValidDecisionOutput,
} from './server/agent.ts';
import { normalizeOutputLocale, outputLocaleLabel } from './server/locales.ts';
import {
  buildGenerationContext,
  buildContentPlanPrompt,
  getUnsupportedClaimFragments,
  getGenerationResultProblems,
} from './server/generation.ts';

// Gemini API Client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

class InvalidGeminiJsonError extends Error {
  constructor() {
    super('Gemini returned malformed JSON');
    this.name = 'InvalidGeminiJsonError';
  }
}

function parseGeminiJson(text: string | undefined): unknown {
  if (!text?.trim()) throw new InvalidGeminiJsonError();
  try {
    return JSON.parse(text);
  } catch {
    throw new InvalidGeminiJsonError();
  }
}

function normalizeDerivedGeminiFields(tool: string, value: unknown): unknown {
  if (tool !== 'bio' || !value || typeof value !== 'object') return value;
  const options = (value as { options?: unknown }).options;
  if (!Array.isArray(options)) return value;
  return {
    ...(value as Record<string, unknown>),
    options: options.map((option) => {
      if (!option || typeof option !== 'object' || typeof (option as { text?: unknown }).text !== 'string') {
        return option;
      }
      const text = (option as { text: string }).text;
      return { ...(option as Record<string, unknown>), characterCount: Array.from(text).length };
    }),
  };
}

async function requestValidatedAgentJson(
  ai: GoogleGenAI,
  prompt: string,
  validate: (value: unknown) => boolean,
): Promise<unknown> {
  let currentPrompt = prompt;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const request = ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: currentPrompt,
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('AI response timed out')), 15000);
    });
    let parsed: unknown;
    try {
      const response = await Promise.race([request, timeout]);
      parsed = parseGeminiJson(response.text);
    } catch (error) {
      if (!(error instanceof InvalidGeminiJsonError) || attempt === 1) throw error;
      currentPrompt = `${prompt}\n\nThe previous response was not valid JSON. Return one complete JSON object matching the requested schema.`;
      continue;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
    if (validate(parsed)) return parsed;
    if (attempt === 0) {
      currentPrompt = `${prompt}\n\nThe previous response failed schema, brand-constraint, evidence, language, or date validation. Correct it once and return only valid JSON in the requested schema.\nPrevious response:\n${JSON.stringify(parsed)}`;
    }
  }
  throw new Error('AI proposal failed validation after one correction attempt');
}

// ----------------- Public Health Check -----------------
app.get('/api/v1/health', (_req: Request, res: Response) => {
  const geminiFailure = currentGeminiFailure();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'creatorpilot-core-api',
    database: 'Supabase PostgreSQL',
    auth: 'Supabase Auth',
    gemini: {
      configured: Boolean(process.env.GEMINI_API_KEY?.trim()),
      model: GEMINI_MODEL,
      temporarilyBlocked: Boolean(geminiFailure),
      failureKind: geminiFailure?.kind || null,
      retryAt: geminiFailure?.retryAt || null,
    }
  });
});

// ----------------- Authentication Endpoints -----------------

// Synchronizes the verified Supabase user into the application profile table.
app.post('/api/v1/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await dbService.syncUser({
      id: req.user!.uid,
      email: req.user!.email,
      name: req.user!.name
    });
    await dbService.logAudit('USER_SYNCED', req.user!.uid, 'Verified user session synchronized');
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to sync user' });
  }
});

// Returns the verified session user profile
app.get('/api/v1/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await dbService.getUser(req.user!.uid);
    if (!user) {
      // Auto-sync if token verified but row pending
      const synced = await dbService.syncUser({
        id: req.user!.uid,
        email: req.user!.email,
        name: req.user!.name
      });
      return res.json({ user: synced });
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch current user' });
  }
});

app.post('/api/v1/auth/logout', requireAuth, async (req: AuthRequest, res: Response) => {
  await dbService.logAudit('USER_LOGOUT', req.user!.uid, 'User signed out');
  res.json({ success: true });
});

// ----------------- Brand Profile Endpoints -----------------

// Handlers supporting both standard /api/brand-profile and versioned /api/v1/brand
const getBrandProfileHandler = async (req: AuthRequest, res: Response) => {
  try {
    const brand = await dbService.getBrandProfile(req.user!.uid);
    // Return brand (or null if new user who hasn't onboarded yet)
    if (!brand) {
      return res.json({ success: true, brand: null });
    }
    res.json({ success: true, brand, ...brand });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch brand profile' });
  }
};

const saveBrandProfileHandler = async (req: AuthRequest, res: Response) => {
  try {
    const saved = await dbService.saveBrandProfile(req.user!.uid, req.body);
    await dbService.logAudit('BRAND_PROFILE_SAVED', req.user!.uid, 'Brand profile updated');
    res.json({ success: true, brand: saved, ...saved });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to save brand profile' });
  }
};

app.get('/api/brand-profile', requireAuth, getBrandProfileHandler);
app.put('/api/brand-profile', requireAuth, saveBrandProfileHandler);
app.get('/api/v1/brand', requireAuth, getBrandProfileHandler);
app.put('/api/v1/brand', requireAuth, saveBrandProfileHandler);
app.post('/api/v1/brand', requireAuth, saveBrandProfileHandler);

// ----------------- Trend Radar -----------------
app.get('/api/v1/trends', async (_req: Request, res: Response) => {
  try {
    const signals = await dbService.getTrendSignals();
    res.json({
      timestamp: new Date().toISOString(),
      totalSignals: signals.length,
      signals
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch trends' });
  }
});

app.post('/api/v1/trends/refresh', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await dbService.logAudit('TREND_REFRESH_TRIGGERED', req.user!.uid, 'Manual trend scan requested');
    const signals = await dbService.getTrendSignals();
    res.json({
      success: true,
      message: 'Trend signals refreshed successfully',
      signals
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to refresh trends' });
  }
});

// ----------------- Decision Board -----------------
app.get('/api/v1/decisions', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const decisions = await dbService.getDecisions(req.user!.uid);
    res.json({
      timestamp: new Date().toISOString(),
      decisions
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch decisions' });
  }
});

app.post('/api/v1/decisions/regenerate', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const requestedLanguage = req.body?.language === undefined ? null : normalizeOutputLocale(req.body.language);
    if (req.body?.language !== undefined && !requestedLanguage) {
      return res.status(400).json({ error: 'Choose English, French, Modern Standard Arabic, or Algerian Darija' });
    }

    const brand = await dbService.getBrandProfile(req.user!.uid);
    if (!brand) {
      return res.status(400).json({ error: 'Please configure your Brand Profile before generating decisions' });
    }

    const savedLanguage = brand.contentLanguage ? normalizeOutputLocale(brand.contentLanguage) : null;
    if (brand.contentLanguage && !savedLanguage) {
      return res.status(400).json({ error: 'Update the Brand Profile language to English, French, Modern Standard Arabic, or Algerian Darija' });
    }
    const language = requestedLanguage || savedLanguage || 'en';
    const ai = getGeminiClient();
    let failure = currentGeminiFailure();
    if (!ai && !failure) failure = { kind: 'not_configured', retryAt: null };
    if (failure) return sendGeminiFailure(res, failure);
    if (!ai) return sendGeminiFailure(res, { kind: 'not_configured', retryAt: null });
    let generated;
    try {
      const parsed = await requestValidatedAgentJson(
        ai,
        buildDecisionPrompt(brand, outputLocaleLabel(language)),
        (value) => isValidDecisionOutput(value, brand, language),
      );
      generated = createDecisionRecords(req.user!.uid, brand, language, parsed);
      clearGeminiFailure();
    } catch (error) {
      failure = classifyGeminiFailure(error);
      console.warn(`Decision generation failed (${failure.kind}).`);
      return sendGeminiFailure(res, failure);
    }
    const saved = await dbService.saveDecisions(req.user!.uid, generated);
    await dbService.logAudit('DECISIONS_REGENERATED', req.user!.uid, `Generated ${saved.length} decisions from Gemini`);
    res.json({ success: true, decisions: saved, source: GEMINI_MODEL });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to regenerate decisions' });
  }
});

app.post('/api/v1/decisions/:id/status', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await dbService.updateDecisionStatus(req.user!.uid, id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Decision not found or unauthorized' });
    }
    await dbService.logAudit('DECISION_STATUS_UPDATED', req.user!.uid, `Decision ${id} set to ${status}`);
    res.json({ success: true, decision: updated });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to update decision' });
  }
});

// ----------------- Content Calendar -----------------
app.get('/api/v1/calendar', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const items = await dbService.getCalendarItems(req.user!.uid);
    res.json({
      timestamp: new Date().toISOString(),
      items
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to load calendar' });
  }
});

app.post('/api/v1/calendar/regenerate', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const requestedLanguage = req.body?.language === undefined ? null : normalizeOutputLocale(req.body.language);
    if (req.body?.language !== undefined && !requestedLanguage) {
      return res.status(400).json({ error: 'Choose English, French, Modern Standard Arabic, or Algerian Darija' });
    }

    const brand = await dbService.getBrandProfile(req.user!.uid);
    if (!brand) {
      return res.status(400).json({ error: 'Please configure your Brand Profile before generating calendar' });
    }
    const savedLanguage = brand.contentLanguage ? normalizeOutputLocale(brand.contentLanguage) : null;
    if (brand.contentLanguage && !savedLanguage) {
      return res.status(400).json({ error: 'Update the Brand Profile language to English, French, Modern Standard Arabic, or Algerian Darija' });
    }
    if (!Array.isArray(brand.pillars) || !brand.pillars.some((pillar) => pillar.name.trim())) {
      return res.status(400).json({ error: 'Create and approve strategic pillars before generating calendar proposals.' });
    }

    const timeZone = typeof req.body?.timeZone === 'string' ? req.body.timeZone : 'UTC';
    try {
      new Intl.DateTimeFormat('en', { timeZone });
    } catch {
      return res.status(400).json({ error: 'Provide a valid IANA time zone, such as Europe/Paris or Africa/Algiers' });
    }

    const requestTime = new Date();
    const language = requestedLanguage || savedLanguage || 'en';
    const ai = getGeminiClient();
    let failure = currentGeminiFailure();
    if (!ai && !failure) failure = { kind: 'not_configured', retryAt: null };
    if (failure) return sendGeminiFailure(res, failure);
    if (!ai) return sendGeminiFailure(res, { kind: 'not_configured', retryAt: null });
    let generated;
    try {
      const parsed = await requestValidatedAgentJson(
        ai,
        buildCalendarPrompt(brand, outputLocaleLabel(language), timeZone, requestTime),
        (value) => isValidCalendarOutput(value, brand, language, timeZone, requestTime),
      );
      generated = createCalendarRecords(req.user!.uid, brand, language, parsed, timeZone, requestTime);
      clearGeminiFailure();
    } catch (error) {
      failure = classifyGeminiFailure(error);
      console.warn(`Calendar generation failed (${failure.kind}).`);
      return sendGeminiFailure(res, failure);
    }
    
    // Save items for this authenticated user
    const savedItems = [];
    for (const item of generated) {
      const saved = await dbService.saveCalendarItem(req.user!.uid, item);
      savedItems.push(saved);
    }

    await dbService.logAudit('CALENDAR_REGENERATED', req.user!.uid, `Regenerated ${savedItems.length} calendar items from Gemini`);
    res.json({ success: true, items: savedItems, source: GEMINI_MODEL });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to regenerate calendar' });
  }
});

app.post('/api/v1/calendar/item', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const saved = await dbService.saveCalendarItem(req.user!.uid, req.body);
    await dbService.logAudit('CALENDAR_ITEM_SAVED', req.user!.uid, 'Calendar item saved');
    res.json({ success: true, item: saved });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to save calendar item' });
  }
});

app.delete('/api/v1/calendar/item/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await dbService.deleteCalendarItem(req.user!.uid, id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }
    await dbService.logAudit('CALENDAR_ITEM_DELETED', req.user!.uid, `Deleted calendar item ${id}`);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to delete calendar item' });
  }
});

// ----------------- Content Library -----------------
app.get('/api/v1/library', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const items = await dbService.getLibraryItems(req.user!.uid);
    res.json({
      total: items.length,
      items
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to load library items' });
  }
});

app.post('/api/v1/library', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const saved = await dbService.saveLibraryItem(req.user!.uid, req.body);
    await dbService.logAudit('LIBRARY_ITEM_SAVED', req.user!.uid, 'Library item saved');
    res.json({ success: true, item: saved });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to save library item' });
  }
});

app.delete('/api/v1/library/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await dbService.deleteLibraryItem(req.user!.uid, id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }
    await dbService.logAudit('LIBRARY_ITEM_DELETED', req.user!.uid, `Deleted library item ${id}`);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to delete library item' });
  }
});

// ----------------- Instagram Connection -----------------
app.get('/api/v1/instagram/status', requireAuth, async (req: AuthRequest, res: Response) => {
  res.json({
    isConnected: false,
    accountName: null,
    accountType: null,
    metaAppConfigured: false,
    tokenExpiresAt: null,
    permissions: [],
    publishingStatus: 'NOT_CONNECTED',
    metrics: null
  });
});

// ----------------- Audit Logs -----------------
app.get('/api/v1/audit', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const logs = await dbService.getAuditLogs(req.user!.uid, 50);
    res.json({ logs });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch audit logs' });
  }
});

// ----------------- AI Generation Engine -----------------
app.post('/api/v1/ai/generate', requireAuth, async (req: AuthRequest, res: Response) => {
  const { tool, format } = req.body;
  const userId = req.user!.uid;
  const allowedTools = new Set(['ideas', 'bio', 'strategy', 'plan_48h', 'plan_7d']);
  const requestedLocale = req.body.language === undefined
    ? null
    : normalizeOutputLocale(req.body.language);
  if (req.body.language !== undefined && !requestedLocale) {
    return res.status(400).json({ error: 'Choose English, French, Modern Standard Arabic, or Algerian Darija' });
  }
  const requestedDialect = req.body.dialect === undefined
    ? null
    : normalizeOutputLocale(req.body.dialect);
  if (req.body.dialect !== undefined && !requestedDialect) {
    return res.status(400).json({ error: 'Choose a supported output language or dialect' });
  }
  if (typeof tool !== 'string' || !allowedTools.has(tool)) {
    return res.status(400).json({ error: 'Choose a supported content generation workflow' });
  }
  if (tool === 'ideas' && !['reel', 'carousel', 'post'].includes(format)) {
    return res.status(400).json({ error: 'Choose a supported content format' });
  }

  // Retrieve user's actual brand profile from PostgreSQL
  const brandProfile = await dbService.getBrandProfile(userId);
  if (!brandProfile) {
    return res.status(400).json({ error: 'Please set up your Brand Profile before generating content' });
  }

  const savedLocale = brandProfile.contentLanguage ? normalizeOutputLocale(brandProfile.contentLanguage) : null;
  if (brandProfile.contentLanguage && !savedLocale) {
    return res.status(400).json({ error: 'Update the Brand Profile language to English, French, Modern Standard Arabic, or Algerian Darija' });
  }
  const lang = requestedLocale || savedLocale || 'en';
  const savedDialect = brandProfile.contentDialect ? normalizeOutputLocale(brandProfile.contentDialect) : null;
  if (brandProfile.contentDialect && !savedDialect) {
    return res.status(400).json({ error: 'Update the Brand Profile dialect to a supported language or dialect' });
  }
  const dialect = requestedDialect || savedDialect || lang;
  const outputLocale = lang === 'ar_standard' && dialect === 'ar_algerian' ? dialect : lang;
  const customPrompt = typeof req.body.customPrompt === 'string' ? req.body.customPrompt.trim().slice(0, 1200) : '';
  const timeZone = typeof req.body.timeZone === 'string' ? req.body.timeZone : 'UTC';
  try {
    new Intl.DateTimeFormat('en', { timeZone });
  } catch {
    return res.status(400).json({ error: 'Provide a valid IANA time zone, such as Europe/Paris or Africa/Algiers' });
  }
  const missingProfileFields = [
    ['brand name', brandProfile.name],
    ['niche', brandProfile.niche],
    ['target audience', brandProfile.targetAudience],
    ['voice tone', brandProfile.voiceTone],
  ].filter(([, value]) => typeof value !== 'string' || !value.trim()).map(([label]) => label);
  if (missingProfileFields.length) {
    return res.status(400).json({
      error: `Complete your Brand Profile before generating content. Missing: ${missingProfileFields.join(', ')}`,
      code: 'BRAND_PROFILE_INCOMPLETE',
    });
  }
  if ((tool === 'ideas' || tool === 'plan_48h' || tool === 'plan_7d') &&
      (!Array.isArray(brandProfile.pillars) || brandProfile.pillars.length === 0)) {
    return res.status(400).json({
      error: 'Create and approve strategic pillars before generating ideas or content plans.',
      code: 'APPROVED_PILLARS_REQUIRED',
    });
  }
  const generationContext = buildGenerationContext(brandProfile, outputLocale);
  const requestTime = new Date();

  await dbService.logAudit(
    'AI_GENERATION_REQUESTED',
    userId,
    `Tool: ${tool}, Lang: ${lang}, Format: ${format || 'reel'}`
  );

  const ai = getGeminiClient();
  const planHorizon = tool === 'plan_48h' ? '48h' : tool === 'plan_7d' ? '7d' : null;
  let aiFailure = currentGeminiFailure();
  if (!ai && !aiFailure) aiFailure = { kind: 'not_configured', retryAt: null };
  if (aiFailure) return sendGeminiFailure(res, aiFailure);
  if (!ai) return sendGeminiFailure(res, { kind: 'not_configured', retryAt: null });
  const verifiedTrends: Array<{ title: string; source: string; sourceUrl: string; freshnessDays: number }> = [];

  if (ai) {
    try {
      const promptLang = outputLocaleLabel(outputLocale);

      let promptText = '';
      if (tool === 'bio') {
        promptText = `You are CreatorPilot's elite content strategist.
Use this structured, saved brand context; keep audience distinct from topic:
${JSON.stringify(generationContext, null, 2)}
Language required: Write strictly in ${promptLang}.

Generate exactly 3 distinct, finished Instagram bios. Keep each "text" within 150 Unicode characters.
Give the options meaningfully different positioning, not paraphrases. Never output field labels instead of values.
Include characterCount equal to the exact Unicode character count and platformCharacterLimit: 150.
Return the positioning angle, target audience, value proposition, CTA, and explanation separately.
Use only the supplied brand information. Never invent credentials, achievements, customer numbers, testimonials, or results.
Return JSON format:
{
  "options": [
    {
      "id": "1",
      "style": "High Authority & Direct",
      "text": "...",
      "positioningAngle": "...",
      "targetAudience": "...",
      "valueProposition": "...",
      "cta": "...",
      "characterCount": 0,
      "platformCharacterLimit": 150,
      "whyItWorks": "..."
    }
  ]
}`;
      } else if (tool === 'strategy') {
        promptText = `You are CreatorPilot's AI content strategist.
Use this structured, saved brand context; keep audience distinct from topic:
${JSON.stringify(generationContext, null, 2)}
Language required: Write strictly in ${promptLang}.

Create four complementary, niche-specific pillars for this brand and audience. Give each a distinct strategic role, audience problems, themes, and at least five concrete, non-overlapping example topics. Cover teaching, expertise, audience participation, and relevant offer education without making every pillar promotional.
Use non-equal percentages unless equal allocation is justified, explain the distribution in strategicSummary, and total exactly 100. Do not generate scripts, script outlines, or empty bullet points in a strategy.
For each pillar include strategicRole, description, audienceProblems (at least three distinct strings), contentThemes (at least three distinct strings), exampleTopics (at least five complete topics), recommendedFormats, offerConnection, ctaTypes, and whyItMatters. Do not reuse the same generic audienceProblems, themes, or topic wording across pillars. Every topic must address a different concrete question or task for the saved audience.
Do not use or imply guarantees, proven results, credentials, testimonials, rankings, performance predictions, statistics, or social proof. Do not use words such as guaranteed, proven, certified, best, number one, double, increase, or percentages. Describe offer connections as optional next steps, not promised outcomes.
Return JSON format:
{
  "pillars": [
    {
      "name": "...",
      "strategicRole": "...",
      "percentage": 25,
      "objective": "...",
      "description": "...",
      "audienceProblems": ["specific problem one", "specific problem two", "specific problem three"],
      "contentThemes": ["distinct theme one", "distinct theme two", "distinct theme three"],
      "exampleTopics": ["complete topic one", "complete topic two", "complete topic three", "complete topic four", "complete topic five"],
      "recommendedFormats": ["Reels", "Carousel"],
      "offerConnection": "...",
      "ctaTypes": ["..."],
      "whyItMatters": "..."
    }
  ],
  "strategicSummary": "..."
}`;
      } else if (tool === 'ideas') {
        const formatRequirement = format === 'carousel' 
          ? 'Carousel with slide breakdown (6-8 slides)' 
          : format === 'post' 
          ? 'Single Post / In-depth analysis post' 
          : 'Reel script (45-60s) with 3s visual hook';

        promptText = `You are CreatorPilot's elite content architect.
Use this structured, saved brand context; keep audience distinct from content topic:
${JSON.stringify(generationContext, null, 2)}
Format requested: ${formatRequirement}
Language required: Write strictly in ${promptLang}.
Custom focus: ${customPrompt || 'Choose a specific audience problem based on the saved brand profile.'}

Recent verified trend evidence:
${verifiedTrends.length
    ? verifiedTrends.map((trend) => `- ${trend.title} (${trend.source}, ${trend.freshnessDays} days old, ${trend.sourceUrl})`).join('\n')
    : 'None available. Use evergreen opportunities and do not claim a topic is currently trending.'}

CRITICAL BRAND-AWARE QUALITY RULES:
1. Make each idea specific to the supplied niche, audience, voice, offer, and approved pillars. Do not assume a coaching business, high-ticket offer, or any business model not stated in the profile.
2. Create three distinct angles that address real audience needs; use the offer only when relevant and never promote it in every idea.
3. Use verified trend evidence only when relevant. Never invent trends, metrics, sources, credentials, testimonials, guarantees, predicted results, or performance outcomes; otherwise create evergreen content. Avoid words such as "guaranteed", "proven", "certified", "best", "double", or numerical claims.
4. Respect the brand's constraints and excluded topics. Write clearly and practically without generic marketing claims.

Structural Requirements:
${format === 'carousel' 
  ? '- Return exactly seven slides in slides[], each with a specific title and meaningful body. Use a logical progression: cover, problem/context, three substantive teaching steps, recap, CTA. Do not repeat generic instructions.' 
  : format === 'post' 
  ? '- Provide mainMessage, visualConcept, onScreenText, complete caption, and CTA.' 
  : '- Provide a recordable 45-60 second script and exactly six complete scene objects. Every scene must have non-empty time, visual, dialogue, and onScreenText fields. Do not use placeholders. Include a distinct opening hook, useful steps, a complete caption, CTA, hashtags, and rationale. Support the selected dialect natively.'}

Generate three publishable, distinct ideas. The audience is not the topic: choose a specific task/problem at the intersection of the brand's niche, audience needs, expertise, and offer. Never return unfinished templates or generic filler. Include title, selected format, exact approved pillar name if available, audienceProblem, topic, angle, contentObjective, hook, script, caption, CTA, strategicPurpose, rationale, and relevant hashtags.
Return JSON format:
{
  "ideas": [
    {
      "title": "...",
      "format": "${format === 'carousel' ? 'Carousel (7 Slides)' : format === 'post' ? 'Post (Analysis)' : 'Reels (50s)'}",
      "pillar": "Authority",
      "audienceProblem": "...",
      "topic": "...",
      "angle": "...",
      "hook": "...",
      "script": "...",
      "scenes": [{"time":"0-3s","visual":"...","dialogue":"...","onScreenText":"..."}],
      "slides": [{"title":"...","body":"..."}],
      "mainMessage": "...",
      "visualConcept": "...",
      "onScreenText": "...",
      "caption": "...",
      "cta": "...",
      "strategicPurpose": "...",
      "contentObjective": "...",
      "rationale": "...",
      "hashtags": ["#...","#...","#..."]
    }
  ]
}`;
      } else if (tool === 'plan_48h' || tool === 'plan_7d') {
        promptText = buildContentPlanPrompt(brandProfile, planHorizon!, promptLang, verifiedTrends, customPrompt, timeZone, requestTime);
      }

      if (promptText) {
        if (customPrompt && tool !== 'ideas' && planHorizon === null) {
          promptText += `\n\nUser's additional instruction: ${customPrompt}\nFollow it when compatible with the saved brand profile, approved pillars, requested format, and constraints. Do not let it override those requirements.`;
        }
        const requestJson = async (contents: string, timeoutMs: number) => {
          const geminiPromise = ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
              responseMimeType: 'application/json',
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.LOW
              }
            }
          });
          let timeoutId: ReturnType<typeof setTimeout> | undefined;
          const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('AI response timed out')), timeoutMs);
          });
          try {
            return await Promise.race([geminiPromise, timeoutPromise]);
          } finally {
            if (timeoutId) clearTimeout(timeoutId);
          }
        };

        const response: any = await requestJson(promptText, 20000);
        let parsed: unknown;
        try {
          parsed = normalizeDerivedGeminiFields(tool, parseGeminiJson(response?.text));
        } catch (error) {
          if (!(error instanceof InvalidGeminiJsonError)) throw error;
          const retry = await requestJson(
            `${promptText}\n\nYour previous response was not valid JSON. Regenerate the complete result and return only one valid JSON object matching the required shape.`,
            8000,
          );
          try {
            parsed = normalizeDerivedGeminiFields(tool, parseGeminiJson(retry?.text));
          } catch (retryError) {
            if (retryError instanceof InvalidGeminiJsonError) {
              aiFailure = classifyGeminiFailure(retryError);
              return sendGeminiFailure(res, aiFailure);
            }
            throw retryError;
          }
        }
        const verifiedEvidenceUrls = verifiedTrends.map((trend) => trend.sourceUrl);
        let problems = getGenerationResultProblems(tool, parsed, brandProfile, format, outputLocale, verifiedEvidenceUrls, requestTime, timeZone);
        if (problems.length > 0) {
          console.warn(`Gemini ${tool} output needs correction: ${problems.join('; ')}`);
          try {
            for (let correctionAttempt = 0; correctionAttempt < 2 && problems.length > 0; correctionAttempt += 1) {
              const correction = await requestJson(
                `${promptText}\n\nRepair the draft. This is correction attempt ${correctionAttempt + 1} of 2. Fix every validation issue listed below, especially unsupported claims and repeated content. Preserve the exact JSON schema and return only one corrected JSON object. Do not explain your changes.\nValidation issues: ${problems.join('; ')}\nDraft JSON:\n${JSON.stringify(parsed)}`,
                15000,
              );
              parsed = normalizeDerivedGeminiFields(tool, parseGeminiJson(correction?.text));
              problems = getGenerationResultProblems(tool, parsed, brandProfile, format, outputLocale, verifiedEvidenceUrls, requestTime, timeZone);
            }
          } catch (error) {
            aiFailure = classifyGeminiFailure(error);
            console.warn(`Generation correction failed (${aiFailure.kind}).`);
            return sendGeminiFailure(res, aiFailure);
          }
        }
        if (problems.length > 0) {
          console.warn(`Gemini ${tool} output remained invalid after correction: ${problems.join('; ')}`);
          if (getUnsupportedClaimFragments(parsed).length) {
            console.warn(`Unsupported claim fragments: ${getUnsupportedClaimFragments(parsed).join(', ')}`);
          }
          const failure = classifyGeminiFailure(new InvalidGeminiJsonError());
          return sendGeminiFailure(res, failure);
        }
        clearGeminiFailure();
        return res.json({ success: true, source: GEMINI_MODEL, data: parsed });
      }
    } catch (err: any) {
      aiFailure = classifyGeminiFailure(err);
      console.warn(`Gemini generation failed (${aiFailure.kind}).`);
      return sendGeminiFailure(res, aiFailure);
    }
  }

  return sendGeminiFailure(res, { kind: 'provider_unavailable', retryAt: null });
});

// ----------------- Vite Integration & Static Serving -----------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreatorPilot Full-Stack Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
