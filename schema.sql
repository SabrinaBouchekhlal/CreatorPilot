-- CreatorPilot PostgreSQL Production Database Schema
-- Normalized Tables for Multi-tenant Creator Strategy Platform

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users and Workspaces
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'creator',
    language_preference VARCHAR(10) NOT NULL DEFAULT 'ar',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'pro',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_id, user_id)
);

-- 2. Brand Profiles and Preferences
CREATE TABLE IF NOT EXISTS brand_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    niche TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    voice_tone VARCHAR(255) NOT NULL,
    primary_offer TEXT,
    default_content_language VARCHAR(20) NOT NULL DEFAULT 'ar_standard',
    dialect_preference VARCHAR(50) DEFAULT 'modern_standard_arabic',
    constraints_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brand_pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_profile_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Authority', 'Empathy', 'Conversion', 'Action'
    description TEXT,
    allocation_percentage INTEGER NOT NULL DEFAULT 25,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Connected Social Accounts (Meta / Instagram Graph API)
CREATE TABLE IF NOT EXISTS connected_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'instagram', 'linkedin', 'youtube'
    platform_account_id VARCHAR(255) NOT NULL,
    account_username VARCHAR(255) NOT NULL,
    account_type VARCHAR(100) DEFAULT 'BUSINESS',
    encrypted_access_token BYTEA,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    granted_scopes TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_workspace_platform_account UNIQUE (workspace_id, platform, platform_account_id)
);

-- 4. Trend Sources and Signals
CREATE TABLE IF NOT EXISTS trend_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'google_trends', 'rss', 'curated_benchmark', 'meta_official'
    endpoint_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    last_crawled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trend_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES trend_sources(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    normalized_topic VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    velocity_score INTEGER NOT NULL DEFAULT 50, -- 0 to 100
    confidence_level VARCHAR(50) NOT NULL DEFAULT 'medium',
    evidence_url TEXT,
    observed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    decay_status VARCHAR(50) NOT NULL DEFAULT 'rising',
    summary TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_trend_signals_retrieved_at ON trend_signals(retrieved_at DESC);
CREATE INDEX IF NOT EXISTS idx_trend_signals_velocity ON trend_signals(velocity_score DESC);

-- 5. Content Recommendations (Decision Board)
CREATE TABLE IF NOT EXISTS content_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    trend_signal_id UUID REFERENCES trend_signals(id) ON DELETE SET NULL,
    rank_order INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    format VARCHAR(100) NOT NULL,
    niche_relevance_score INTEGER NOT NULL,
    confidence_score VARCHAR(50) NOT NULL,
    why_recommended TEXT NOT NULL,
    uncertainty_notes TEXT,
    suggested_hook TEXT NOT NULL,
    suggested_outline TEXT NOT NULL,
    suggested_cta TEXT,
    recommended_timing VARCHAR(150),
    status VARCHAR(50) NOT NULL DEFAULT 'proposed', -- 'proposed', 'added_to_calendar', 'dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Content Calendar and Tactical Plans (48h & 7d)
CREATE TABLE IF NOT EXISTS content_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    horizon_type VARCHAR(20) NOT NULL, -- '48h' or '7d'
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS calendar_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES content_plans(id) ON DELETE SET NULL,
    recommendation_id UUID REFERENCES content_recommendations(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    format VARCHAR(100) NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    pillar_id UUID REFERENCES brand_pillars(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'proposed', 'draft', 'approved', 'scheduled', 'published', 'dismissed'
    opening_hook TEXT,
    body_script TEXT,
    call_to_action TEXT,
    approved_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Content Library (Saved Drafts, Bios, Products)
CREATE TABLE IF NOT EXISTS content_library_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'script', 'bio', 'strategy', 'digital_product', 'hook'
    title VARCHAR(255) NOT NULL,
    content_payload TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Analytics Snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connected_account_id UUID NOT NULL REFERENCES connected_accounts(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    reach_count INTEGER NOT NULL DEFAULT 0,
    impressions_count INTEGER NOT NULL DEFAULT 0,
    profile_views INTEGER NOT NULL DEFAULT 0,
    engagement_rate NUMERIC(5, 2),
    raw_metrics_json JSONB DEFAULT '{}'::jsonb,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_account_snapshot_date UNIQUE (connected_account_id, snapshot_date)
);

-- 9. AI Generation Jobs
CREATE TABLE IF NOT EXISTS ai_generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tool_type VARCHAR(50) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    prompt_hash VARCHAR(64) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed', -- 'pending', 'processing', 'completed', 'failed'
    output_tokens INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Security & Audit Events
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    details JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace_time ON audit_logs(workspace_id, occurred_at DESC);
