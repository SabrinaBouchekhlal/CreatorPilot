export type Route = 
  | 'landing'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'dashboard'
  | 'decision-board'
  | 'calendar'
  | 'trends'
  | 'analytics'
  | 'content-library'
  | 'brand-studio'
  | 'integrations'
  | 'settings';

export type ContentStatus = 'proposed' | 'draft' | 'approved' | 'scheduled' | 'published' | 'dismissed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  workspaceId: string;
}

export interface BrandPillar {
  id: string;
  name: string;
  desc: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  niche: string;
  targetAudience: string;
  voiceTone: string;
  primaryOffer: string;
  contentLanguage: 'ar_standard' | 'ar_algerian' | 'ar_darija' | 'fr' | 'en';
  contentDialect: string;
  pillars: BrandPillar[];
  constraints: string;
}

export interface TrendSignal {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  observedAt?: string;
  category: string;
  velocity: number;
  freshnessDays: number;
  decayStatus: string;
  confidence: string;
  isVerified: boolean;
  nicheFitScore: number;
  summary: string;
}

export interface ContentDecision {
  id: string;
  rank: number;
  title: string;
  trendId?: string;
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
  status: ContentStatus;
}

export interface CalendarItem {
  id: string;
  title: string;
  platform: string;
  format: string;
  time: string;
  horizon: '48h' | '7d';
  pillar: string;
  status: ContentStatus;
  hook: string;
  notes: string;
  decisionId?: string | null;
}

export interface ContentLibraryItem {
  id: string;
  type: 'script' | 'bio' | 'strategy' | 'digital_product' | 'hook';
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export interface InstagramState {
  isConnected: boolean;
  accountName: string | null;
  accountType: string | null;
  metaAppConfigured: boolean;
  tokenExpiresAt: string | null;
  permissions: string[];
  publishingStatus: string;
  metrics: {
    accountsReached: number;
    reachChange: string;
    totalImpressions: number;
    impressionsChange: string;
    profileVisits: number;
    visitsChange: string;
    engagementRate: string;
    followersCount: number;
    topReels: Array<{ id: string; title: string; reach: number; saves: number; shares: number }>;
    audienceGeo: Array<{ country: string; percentage: number }>;
  } | null;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}
