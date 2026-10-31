import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table keyed by Supabase Auth user ID
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('creator_pro'),
  workspaceId: text('workspace_id').notNull().default('ws-default-01'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Brand profiles: one per authenticated user
export const brandProfiles = pgTable('brand_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  niche: text('niche').notNull(),
  targetAudience: text('target_audience').notNull(),
  voiceTone: text('voice_tone').notNull(),
  primaryOffer: text('primary_offer').notNull(),
  contentLanguage: text('content_language').notNull().default('ar_standard'),
  contentDialect: text('content_dialect').notNull().default('ar_standard'),
  constraints: text('constraints').notNull().default(''),
  pillars: text('pillars').notNull().default('[]'), // JSON array of pillars
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Strategic content decisions: scoped to user
export const contentDecisions = pgTable('content_decisions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  rank: integer('rank').notNull(),
  title: text('title').notNull(),
  trendId: text('trend_id'),
  platform: text('platform').notNull(),
  format: text('format').notNull(),
  confidence: text('confidence').notNull(),
  freshness: text('freshness').notNull(),
  recommendedTiming: text('recommended_timing').notNull(),
  whyRecommended: text('why_recommended').notNull(),
  whatIsUncertain: text('what_is_uncertain').notNull(),
  hook: text('hook').notNull(),
  outline: text('outline').notNull(),
  cta: text('cta').notNull(),
  status: text('status').notNull().default('proposed'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Calendar items: scoped to user
export const calendarItems = pgTable('calendar_items', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  platform: text('platform').notNull(),
  format: text('format').notNull(),
  time: text('time').notNull(),
  horizon: text('horizon').notNull().default('48h'),
  pillar: text('pillar').notNull(),
  status: text('status').notNull().default('draft'),
  hook: text('hook'),
  notes: text('notes'),
  decisionId: text('decision_id'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Saved library items: scoped to user
export const libraryItems = pgTable('library_items', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  tags: text('tags').notNull().default('[]'), // JSON array of string tags
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Real Instagram account connection state: scoped to user
export const instagramConnections = pgTable('instagram_connections', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  isConnected: boolean('is_connected').notNull().default(false),
  accountName: text('account_name'),
  accountType: text('account_type'),
  tokenExpiresAt: text('token_expires_at'),
  permissions: text('permissions'),
  metrics: text('metrics'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Audit logs
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  status: text('status').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull()
});

// Trend signals (global curated / verified platform signals)
export const trendSignals = pgTable('trend_signals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  source: text('source').notNull(),
  sourceUrl: text('source_url').notNull(),
  category: text('category').notNull(),
  velocity: integer('velocity').notNull(),
  freshnessDays: integer('freshness_days').notNull(),
  observedAt: timestamp('observed_at', { withTimezone: true }),
  region: text('region'),
  language: text('language'),
  evidenceType: text('evidence_type'),
  decayStatus: text('decay_status').notNull(),
  confidence: text('confidence').notNull(),
  isVerified: boolean('is_verified').notNull().default(false),
  nicheFitScore: integer('niche_fit_score').notNull(),
  summary: text('summary').notNull()
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  brandProfile: one(brandProfiles, {
    fields: [users.id],
    references: [brandProfiles.userId]
  }),
  decisions: many(contentDecisions),
  calendarItems: many(calendarItems),
  libraryItems: many(libraryItems),
  instagramConnection: one(instagramConnections, {
    fields: [users.id],
    references: [instagramConnections.userId]
  })
}));

export const brandProfilesRelations = relations(brandProfiles, ({ one }) => ({
  user: one(users, {
    fields: [brandProfiles.userId],
    references: [users.id]
  })
}));
