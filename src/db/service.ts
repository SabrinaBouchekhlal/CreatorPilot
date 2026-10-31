import { randomUUID } from 'node:crypto';
import { eq, and, desc } from 'drizzle-orm';
import { db } from './index.ts';
import { 
  users, 
  brandProfiles, 
  contentDecisions, 
  calendarItems, 
  libraryItems, 
  instagramConnections, 
  auditLogs,
  trendSignals
} from './schema.ts';

export interface BrandPillar {
  id: string;
  name: string;
  desc: string;
}

export interface BrandProfileRecord {
  id: string;
  userId: string;
  name: string;
  niche: string;
  targetAudience: string;
  voiceTone: string;
  primaryOffer: string;
  contentLanguage: ContentLanguage;
  contentDialect: ContentLanguage;
  constraints: string;
  pillars: BrandPillar[];
  createdAt?: Date;
  updatedAt?: Date;
}

const demoTrendSignals: (typeof trendSignals.$inferSelect)[] = [
  {
    id: 'trend-en-1',
    title: 'Practical workshops and focused consulting',
    source: 'Demo signal',
    sourceUrl: 'https://trends.google.com/trends/',
    category: 'Digital Products',
    velocity: 0,
    freshnessDays: 0,
    observedAt: null,
    region: null,
    language: 'en',
    evidenceType: 'demo',
    decayStatus: 'Sustained Shift',
    confidence: 'Demo only',
    isVerified: false,
    nicheFitScore: 0,
    summary: 'Demo example only. No dated, source-verified trend measurement is available.'
  },
  {
    id: 'trend-en-2',
    title: 'Structured educational videos and carousels',
    source: 'Demo signal',
    sourceUrl: 'https://trends.google.com/trends/',
    category: 'Instagram Format',
    velocity: 0,
    freshnessDays: 0,
    observedAt: null,
    region: null,
    language: 'en',
    evidenceType: 'demo',
    decayStatus: 'Sustained Shift',
    confidence: 'Demo only',
    isVerified: false,
    nicheFitScore: 0,
    summary: 'Demo example only. Platform-performance claims have not been independently verified.'
  },
  {
    id: 'trend-en-3',
    title: 'Transparent content and audience trust',
    source: 'Demo signal',
    sourceUrl: 'https://trends.google.com/trends/',
    category: 'Audience Psychology',
    velocity: 0,
    freshnessDays: 0,
    observedAt: null,
    region: null,
    language: 'en',
    evidenceType: 'demo',
    decayStatus: 'Sustained Shift',
    confidence: 'Demo only',
    isVerified: false,
    nicheFitScore: 0,
    summary: 'Demo example only. This is a strategic suggestion, not a verified trend.'
  },
  {
    id: 'trend-en-4',
    title: 'AI as a research assistant',
    source: 'Demo signal',
    sourceUrl: 'https://trends.google.com/trends/',
    category: 'AI Workflow',
    velocity: 0,
    freshnessDays: 0,
    observedAt: null,
    region: 'Global',
    language: 'en',
    evidenceType: 'demo',
    decayStatus: 'Sustained Shift',
    confidence: 'Demo only',
    isVerified: false,
    nicheFitScore: 0,
    summary: 'Demo example only. No verified current trend data is attached to this suggestion.'
  }
];

export type ContentLanguage = 'ar_standard' | 'ar_algerian' | 'ar_darija' | 'fr' | 'en';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  workspaceId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DecisionRecord {
  id: string;
  userId: string;
  rank: number;
  title: string;
  trendId?: string | null;
  platform: string;
  format: string;
  confidence: string;
  freshness: string;
  recommendedTiming: string;
  whyRecommended: string;
  whatIsUncertain: string;
  hook: string;
  outline: string;
  cta: string;
  status: string;
  createdAt?: Date;
}

export interface CalendarItemRecord {
  id: string;
  userId: string;
  title: string;
  platform: string;
  format: string;
  time: string;
  horizon: '48h' | '7d';
  pillar: string;
  status: 'draft' | 'approved' | 'scheduled' | 'published' | 'proposed';
  hook?: string | null;
  notes?: string | null;
  decisionId?: string | null;
  createdAt?: Date;
}

export interface LibraryItemRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  createdAt?: Date;
}

export interface InstagramStateRecord {
  id: string;
  userId: string;
  isConnected: boolean;
  accountName: string | null;
  accountType: string | null;
  tokenExpiresAt: string | null;
  permissions: string | null;
  metrics: string | null;
  updatedAt?: Date;
}

export interface AuditLogRecord {
  id: string;
  userId: string;
  action: string;
  details: string;
  status: string;
  timestamp: Date;
}

const decisionStatuses = ['proposed', 'draft', 'approved', 'scheduled', 'published', 'dismissed'] as const;
const calendarStatuses = ['draft', 'approved', 'scheduled', 'published', 'proposed'] as const;
const libraryTypes = ['script', 'bio', 'strategy', 'digital_product', 'hook'] as const;
const languageAliases: Record<string, ContentLanguage> = {
  en: 'en',
  fr: 'fr',
  'fr-FR': 'fr',
  ar: 'ar_standard',
  ar_standard: 'ar_standard',
  'ar-MSA': 'ar_standard',
  ar_algerian: 'ar_algerian',
  'ar-DZ': 'ar_algerian',
  ar_darija: 'ar_darija',
  darija: 'ar_darija'
};

function requireText(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} is required`);
  }
  return value.trim();
}

function optionalText(value: unknown, field: string, maxLength: number): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new Error(`${field} must be text`);
  const normalized = value.trim();
  if (normalized.length > maxLength) throw new Error(`${field} is too long`);
  return normalized;
}

function normalizeContentLanguage(value: unknown, field: string): ContentLanguage {
  if (typeof value !== 'string' || !languageAliases[value]) {
    throw new Error(`${field} is not supported`);
  }
  return languageAliases[value];
}

function normalizeCalendarStatus(value: string): CalendarItemRecord['status'] {
  const status = calendarStatuses.find((candidate) => candidate === value);
  if (!status) {
    throw new Error('Stored calendar item has an invalid status');
  }
  return status;
}

function normalizeHorizon(value: string): CalendarItemRecord['horizon'] {
  if (value !== '48h' && value !== '7d') {
    throw new Error('Stored calendar item has an invalid horizon');
  }
  return value;
}

export const dbService = {
  // ----------------- Users -----------------
  async syncUser(user: { id: string; email: string; name: string }): Promise<UserRecord> {
    try {
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (existing) {
        if (existing.email !== user.email || existing.name !== user.name) {
          const [updated] = await db
            .update(users)
            .set({ email: user.email, name: user.name, updatedAt: new Date() })
            .where(eq(users.id, user.id))
            .returning();
          return updated;
        }
        return existing;
      }

      const [created] = await db
        .insert(users)
        .values({
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'creator_pro',
          workspaceId: `ws-${user.id.substring(0, 8)}`,
        })
        .returning();

      return created;
    } catch (error) {
      console.error('Failed to sync user in database:', error);
      throw new Error('Database operation failed during user synchronization', { cause: error });
    }
  },

  async getUser(userId: string): Promise<UserRecord | null> {
    try {
      const [row] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      return row || null;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw new Error('Database query failed while fetching user', { cause: error });
    }
  },

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    try {
      const [row] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return row || null;
    } catch (error) {
      console.error('Failed to get user by email:', error);
      throw new Error('Database query failed while fetching user by email', { cause: error });
    }
  },

  // ----------------- Brand Profile -----------------
  // STRICT RULE: Returns null if no record exists. Never fabricates mock data!
  async getBrandProfile(userId: string): Promise<BrandProfileRecord | null> {
    if (!userId) throw new Error('userId is strictly required to fetch brand profile');
    try {
      const [row] = await db
        .select()
        .from(brandProfiles)
        .where(eq(brandProfiles.userId, userId))
        .limit(1);

      if (!row) return null;

      const parsedPillars: unknown = JSON.parse(row.pillars);
      if (
        !Array.isArray(parsedPillars) ||
        !parsedPillars.every(pillar =>
          pillar &&
          typeof pillar.id === 'string' &&
          typeof pillar.name === 'string' &&
          typeof pillar.desc === 'string'
        )
      ) {
        throw new Error('Stored brand pillars are malformed');
      }

      return {
        id: row.id,
        userId: row.userId,
        name: row.name,
        niche: row.niche,
        targetAudience: row.targetAudience,
        voiceTone: row.voiceTone,
        primaryOffer: row.primaryOffer,
        contentLanguage: normalizeContentLanguage(row.contentLanguage, 'Stored brand language'),
        contentDialect: normalizeContentLanguage(row.contentDialect || row.contentLanguage, 'Stored content dialect'),
        constraints: row.constraints || '',
        pillars: parsedPillars as BrandPillar[],
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };
    } catch (error) {
      console.error('Failed to get brand profile:', error);
      throw new Error('Database query failed while fetching brand profile', { cause: error });
    }
  },

  async saveBrandProfile(
    userId: string,
    profileData: Partial<BrandProfileRecord>
  ): Promise<BrandProfileRecord> {
    if (!userId) throw new Error('userId is strictly required to save brand profile');
    if (!profileData || typeof profileData !== 'object' || Array.isArray(profileData)) {
      throw new Error('Brand profile must be an object');
    }

    // Validation & normalization
    const name = requireText(optionalText(profileData.name, 'Brand name', 120), 'Brand name');
    const niche = requireText(optionalText(profileData.niche, 'Niche', 400), 'Niche');
    const targetAudience = optionalText(profileData.targetAudience, 'Target audience', 1000);
    const voiceTone = optionalText(profileData.voiceTone, 'Voice tone', 500);
    const primaryOffer = optionalText(profileData.primaryOffer, 'Primary offer', 1000);
    const contentLanguage = normalizeContentLanguage(profileData.contentLanguage || 'ar_standard', 'Brand language');
    const contentDialect = normalizeContentLanguage(profileData.contentDialect || contentLanguage, 'Content dialect');
    const constraints = optionalText(profileData.constraints, 'Publishing constraints', 3000);
    if (!Array.isArray(profileData.pillars) || profileData.pillars.length > 12) {
      throw new Error('Strategic pillars must be an array with no more than 12 entries');
    }
    const pillars = profileData.pillars.map((pillar, index) => {
      if (!pillar || typeof pillar !== 'object' ||
          typeof pillar.id !== 'string' || !pillar.id.trim() ||
          typeof pillar.name !== 'string' || !pillar.name.trim() ||
          typeof pillar.desc !== 'string' ||
          pillar.id.length > 80 || pillar.name.length > 120 || pillar.desc.length > 500) {
        throw new Error(`Strategic pillar ${index + 1} is invalid`);
      }
      return { id: pillar.id.trim(), name: pillar.name.trim(), desc: pillar.desc.trim() };
    });
    if (new Set(pillars.map((pillar) => pillar.id)).size !== pillars.length) {
      throw new Error('Strategic pillar IDs must be unique');
    }

    return await db.transaction(async (tx) => {
      const profileId = `brand-${randomUUID()}`;
      const serializedPillars = JSON.stringify(pillars);

      const [upserted] = await tx
        .insert(brandProfiles)
        .values({
          id: profileId,
          userId,
          name,
          niche,
          targetAudience,
          voiceTone,
          primaryOffer,
          contentLanguage,
          contentDialect,
          constraints,
          pillars: serializedPillars,
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: brandProfiles.userId,
          set: {
            name,
            niche,
            targetAudience,
            voiceTone,
            primaryOffer,
            contentLanguage,
            contentDialect,
            constraints,
            pillars: serializedPillars,
            updatedAt: new Date()
          }
        })
        .returning();

      return {
        id: upserted.id,
        userId: upserted.userId,
        name: upserted.name,
        niche: upserted.niche,
        targetAudience: upserted.targetAudience,
        voiceTone: upserted.voiceTone,
        primaryOffer: upserted.primaryOffer,
        contentLanguage: normalizeContentLanguage(upserted.contentLanguage, 'Stored brand language'),
        contentDialect: normalizeContentLanguage(upserted.contentDialect || upserted.contentLanguage, 'Stored content dialect'),
        constraints: upserted.constraints || '',
        pillars,
        createdAt: upserted.createdAt,
        updatedAt: upserted.updatedAt
      };
    });
  },

  // ----------------- Content Decisions -----------------
  async getDecisions(userId: string): Promise<DecisionRecord[]> {
    if (!userId) throw new Error('userId is strictly required to fetch decisions');
    try {
      const rows = await db
        .select()
        .from(contentDecisions)
        .where(eq(contentDecisions.userId, userId))
        .orderBy(contentDecisions.rank);

      // Hide known unverified seeded proposals without deleting any saved or approved records.
      return rows
        .filter((row) => !(
          row.status === 'proposed' &&
          /^trend-[1-3]$/.test(row.trendId || '') &&
          /\d{2,3}%/.test(row.confidence)
        ))
        .map(r => ({
        ...r,
        createdAt: r.createdAt
      }));
    } catch (error) {
      console.error('Failed to get content decisions:', error);
      throw new Error('Database query failed while fetching decisions', { cause: error });
    }
  },

  async saveDecisions(userId: string, decisionsList: Partial<DecisionRecord>[]): Promise<DecisionRecord[]> {
    if (!userId) throw new Error('userId is strictly required to save decisions');
    if (!decisionsList.length) return [];

    const decisions = decisionsList.map((decision, index) => {
      if (!decision || !Number.isInteger(decision.rank) || (decision.rank as number) < 1) {
        throw new Error(`Decision ${index + 1} rank must be a positive integer`);
      }
      if (!decisionStatuses.includes(decision.status as typeof decisionStatuses[number])) {
        throw new Error(`Decision ${index + 1} has an invalid status`);
      }

      return {
        decision,
        rank: decision.rank as number,
        title: requireText(decision.title, `Decision ${index + 1} title`),
        platform: requireText(decision.platform, `Decision ${index + 1} platform`),
        format: requireText(decision.format, `Decision ${index + 1} format`),
        confidence: requireText(decision.confidence, `Decision ${index + 1} confidence`),
        freshness: requireText(decision.freshness, `Decision ${index + 1} freshness`),
        recommendedTiming: requireText(decision.recommendedTiming, `Decision ${index + 1} recommended timing`),
        whyRecommended: requireText(decision.whyRecommended, `Decision ${index + 1} reason`),
        whatIsUncertain: requireText(decision.whatIsUncertain, `Decision ${index + 1} uncertainty`),
        hook: requireText(decision.hook, `Decision ${index + 1} hook`),
        outline: requireText(decision.outline, `Decision ${index + 1} outline`),
        cta: requireText(decision.cta, `Decision ${index + 1} call to action`),
        status: decision.status as string
      };
    });

    return await db.transaction(async (tx) => {
      const inserted: DecisionRecord[] = [];
      for (const { decision: d, ...values } of decisions) {
        const [row] = await tx
          .insert(contentDecisions)
          .values({
            id: d.id?.trim() || `dec-${randomUUID()}`,
            userId,
            trendId: d.trendId || null,
            ...values
          })
          .returning();
        inserted.push(row);
      }
      return inserted;
    });
  },

  async updateDecisionStatus(userId: string, id: string, status: string): Promise<DecisionRecord | null> {
    if (!userId) throw new Error('userId is strictly required');
    if (!decisionStatuses.includes(status as typeof decisionStatuses[number])) {
      throw new Error('Invalid decision status');
    }
    try {
      const [updated] = await db
        .update(contentDecisions)
        .set({ status })
        .where(and(eq(contentDecisions.id, id), eq(contentDecisions.userId, userId)))
        .returning();
      return updated || null;
    } catch (error) {
      console.error('Failed to update decision status:', error);
      throw new Error('Database operation failed while updating decision status', { cause: error });
    }
  },

  // ----------------- Calendar Items -----------------
  async getCalendarItems(userId: string): Promise<CalendarItemRecord[]> {
    if (!userId) throw new Error('userId is strictly required to fetch calendar');
    try {
      const rows = await db
        .select()
        .from(calendarItems)
        .where(eq(calendarItems.userId, userId))
        .orderBy(calendarItems.time);

      return rows.map(r => ({
        ...r,
        horizon: normalizeHorizon(r.horizon),
        status: normalizeCalendarStatus(r.status),
        createdAt: r.createdAt
      }));
    } catch (error) {
      console.error('Failed to get calendar items:', error);
      throw new Error('Database query failed while fetching calendar', { cause: error });
    }
  },

  async saveCalendarItem(userId: string, item: Partial<CalendarItemRecord>): Promise<CalendarItemRecord> {
    if (!userId) throw new Error('userId is strictly required to save calendar item');

    const id = item.id?.trim() || `cal-${randomUUID()}`;
    const title = requireText(item.title, 'Calendar item title');
    const platform = requireText(item.platform, 'Calendar item platform');
    const format = requireText(item.format, 'Calendar item format');
    const time = requireText(item.time, 'Calendar item time');
    if (item.horizon !== '48h' && item.horizon !== '7d') {
      throw new Error('Calendar item horizon must be 48h or 7d');
    }
    if (!calendarStatuses.includes(item.status as typeof calendarStatuses[number])) {
      throw new Error('Calendar item has an invalid status');
    }
    const horizon = item.horizon as '48h' | '7d';
    const pillar = requireText(item.pillar, 'Calendar item pillar');
    const status = item.status as CalendarItemRecord['status'];
    const hook = item.hook || null;
    const notes = item.notes || null;
    const decisionId = item.decisionId || null;

    try {
      const [saved] = await db.transaction(async tx => {
        const values = {
          title,
          platform,
          format,
          time,
          horizon,
          pillar,
          status,
          hook,
          notes,
          decisionId
        };
        const [inserted] = await tx
          .insert(calendarItems)
          .values({ id, userId, ...values })
          .onConflictDoNothing({ target: calendarItems.id })
          .returning();
        if (inserted) return [inserted];

        const [updated] = await tx
          .update(calendarItems)
          .set(values)
          .where(and(eq(calendarItems.id, id), eq(calendarItems.userId, userId)))
          .returning();
        if (!updated) throw new Error('Calendar item ownership conflict');
        return [updated];
      });

      return {
        ...saved,
        horizon: saved.horizon as '48h' | '7d',
        status: saved.status as CalendarItemRecord['status']
      };
    } catch (error) {
      console.error('Failed to save calendar item:', error);
      if (error instanceof Error && error.message === 'Calendar item ownership conflict') throw error;
      throw new Error('Database operation failed while saving calendar item', { cause: error });
    }
  },

  async deleteCalendarItem(userId: string, id: string): Promise<boolean> {
    if (!userId) throw new Error('userId is strictly required');
    try {
      const result = await db
        .delete(calendarItems)
        .where(and(eq(calendarItems.id, id), eq(calendarItems.userId, userId)))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Failed to delete calendar item:', error);
      throw new Error('Database operation failed while deleting calendar item', { cause: error });
    }
  },

  // ----------------- Library Items -----------------
  async getLibraryItems(userId: string): Promise<LibraryItemRecord[]> {
    if (!userId) throw new Error('userId is strictly required to fetch library');
    try {
      const rows = await db
        .select()
        .from(libraryItems)
        .where(eq(libraryItems.userId, userId))
        .orderBy(desc(libraryItems.createdAt));

      return rows.map(r => {
        const tags: unknown = JSON.parse(r.tags);
        if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
          throw new Error('Stored library tags are malformed');
        }
        return {
          ...r,
          tags,
          createdAt: r.createdAt
        };
      });
    } catch (error) {
      console.error('Failed to get library items:', error);
      throw new Error('Database query failed while fetching library items', { cause: error });
    }
  },

  async saveLibraryItem(userId: string, item: Partial<LibraryItemRecord>): Promise<LibraryItemRecord> {
    if (!userId) throw new Error('userId is strictly required to save library item');

    const id = item.id?.trim() || `lib-${randomUUID()}`;
    if (!libraryTypes.includes(item.type as typeof libraryTypes[number])) {
      throw new Error('Library item has an invalid type');
    }
    const type = item.type as LibraryItemRecord['type'];
    const title = requireText(item.title, 'Library item title');
    const content = requireText(item.content, 'Library item content');
    if (!Array.isArray(item.tags) || !item.tags.every(tag => typeof tag === 'string')) {
      throw new Error('Library item tags must be an array of strings');
    }
    const tags = item.tags;
    const values = { type, title, content, tags: JSON.stringify(tags) };

    try {
      const [saved] = await db.transaction(async tx => {
        const [inserted] = await tx
          .insert(libraryItems)
          .values({ id, userId, ...values })
          .onConflictDoNothing({ target: libraryItems.id })
          .returning();
        if (inserted) return [inserted];

        const [updated] = await tx
          .update(libraryItems)
          .set(values)
          .where(and(eq(libraryItems.id, id), eq(libraryItems.userId, userId)))
          .returning();
        if (!updated) throw new Error('Library item ownership conflict');
        return [updated];
      });

      return {
        ...saved,
        tags
      };
    } catch (error) {
      console.error('Failed to save library item:', error);
      if (error instanceof Error && error.message === 'Library item ownership conflict') throw error;
      throw new Error('Database operation failed while saving library item', { cause: error });
    }
  },

  async deleteLibraryItem(userId: string, id: string): Promise<boolean> {
    if (!userId) throw new Error('userId is strictly required');
    try {
      const result = await db
        .delete(libraryItems)
        .where(and(eq(libraryItems.id, id), eq(libraryItems.userId, userId)))
        .returning();
      return result.length > 0;
    } catch (error) {
      console.error('Failed to delete library item:', error);
      throw new Error('Database operation failed while deleting library item', { cause: error });
    }
  },

  // ----------------- Instagram Connection -----------------
  // Shows genuine disconnected state when no active connection exists. No fabricated metrics!
  async getInstagramState(userId: string): Promise<InstagramStateRecord> {
    if (!userId) throw new Error('userId is strictly required');
    try {
      const [row] = await db
        .select()
        .from(instagramConnections)
        .where(eq(instagramConnections.userId, userId))
        .limit(1);

      if (!row) {
        return {
          id: `ig-${userId}`,
          userId,
          isConnected: false,
          accountName: null,
          accountType: null,
          tokenExpiresAt: null,
          permissions: null,
          metrics: null
        };
      }

      return row;
    } catch (error) {
      console.error('Failed to get Instagram connection state:', error);
      throw new Error('Database query failed while fetching Instagram status', { cause: error });
    }
  },

  // ----------------- Audit Logs -----------------
  async logAudit(action: string, userId: string, details: string, status = 'success'): Promise<void> {
    if (!userId?.trim()) throw new Error('userId is required to write an audit log');
    try {
      await db.insert(auditLogs).values({
        id: `log-${randomUUID()}`,
        userId,
        action: requireText(action, 'Audit action'),
        details: requireText(details, 'Audit details'),
        status: requireText(status, 'Audit status')
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
      throw new Error('Database operation failed while writing audit log', { cause: error });
    }
  },

  async getAuditLogs(userId: string, limit = 50): Promise<AuditLogRecord[]> {
    if (!userId) throw new Error('userId is required to fetch audit logs');
    const safeLimit = Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.floor(limit))) : 50;
    try {
      return await db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.userId, userId))
        .orderBy(desc(auditLogs.timestamp))
        .limit(safeLimit);
    } catch (error) {
      console.error('Failed to get audit logs:', error);
      throw new Error('Database query failed while fetching audit logs', { cause: error });
    }
  },

  // ----------------- Trend Signals -----------------
  async getTrendSignals(): Promise<(typeof trendSignals.$inferSelect)[]> {
    try {
      const signals = await db.select().from(trendSignals);
      return signals.length > 0 ? signals : demoTrendSignals;
    } catch (error) {
      console.error('Failed to get trend signals:', error);
      throw new Error('Database query failed while fetching trend signals', { cause: error });
    }
  }
};
