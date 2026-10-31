# CreatorPilot

## Submission information

### 1. Project name and one-line summary

**CreatorPilot** — A multilingual AI workspace that helps Arabic-speaking creators turn their brand strategy into practical content ideas and plans.

### 2. Project description

Creators and small businesses often know their niche but struggle to turn that knowledge into consistent, audience-specific content. Generic AI tools can produce attractive text while ignoring the creator's audience, offer, voice, language, and approved strategy.

CreatorPilot is a workspace for Arabic-speaking creators and small businesses. Users create a brand profile, define their audience and offer, approve strategic content pillars, and use Gemini to generate localized ideas, scripts, bios, strategies, and 48-hour or seven-day plans. The application validates generated content before showing or saving it, rejects unsupported claims, preserves user ownership, and makes provider failures explicit instead of silently inventing local results.

The current demo requires Supabase authentication, a PostgreSQL database, and a server-side Gemini API key. These credentials are not included in the repository; the demo video should show the complete workflow if a public deployment is unavailable.

### 3. Live demo link

**Demo URL:** `[ADD PUBLIC DEPLOYMENT URL]`

The deployed URL must be tested in a private browser window before submission. If deployment is unavailable, submit the public demo video and state that the product requires configured Supabase and Gemini credentials.

### 4. Code repository

**Public repository:** `[ADD PUBLIC GITHUB URL]`

This repository contains the application source, database schema, migrations, tests, and local setup instructions. Never commit `.env.local`, API keys, database passwords, or Supabase service-role credentials.

### 5. Demo video

**Video URL:** `[ADD UNLISTED YOUTUBE OR GOOGLE DRIVE URL]`

Recommended two-to-four-minute structure:

1. Show the working workspace immediately.
2. Explain the creator problem in under 30 seconds.
3. Create or open a brand profile.
4. Approve strategic pillars.
5. Generate one localized content result with Gemini.
6. Show validation, editing, and saving behavior.
7. Briefly show the 48-hour or seven-day plan.
8. End with the product impact and next steps.

The link must be viewable without requesting access.

### 6. Team members and roles

Replace the entries below with every contributor's full name and actual contribution:

- **[Full name]** — Product direction, UX, and frontend workflow.
- **[Full name]** — Supabase authentication, PostgreSQL schema, ownership, and persistence.
- **[Full name]** — Gemini generation prompts, validation, localization, and testing.
- **[Full name]** — Deployment, demo video, and submission materials.

Remove roles that do not apply. Do not claim work a person did not perform.

### 7. Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React
- **Backend:** Node.js, Express, TypeScript, `tsx`
- **Database and authentication:** Supabase Auth, Supabase PostgreSQL, Drizzle ORM
- **AI:** Google Gemini API through `@google/genai`
- **Validation and testing:** TypeScript compiler, focused generation tests
- **Deployment target:** Render or another Node-compatible host

### 8. What happens next

Over the next three months, we would deploy a reliable public version, add verified trend-source ingestion, implement official Instagram/Meta OAuth and analytics, improve timezone-aware scheduling, add brand-knowledge retrieval, and test the workflows with creators across Arabic, French, and English markets. We would measure usefulness through completed content plans, edits required per generated draft, and repeat usage rather than unsupported performance claims.

## What works today

- Email/password authentication through Supabase; Google sign-in is intentionally not included.
- Brand profile and approved strategic-pillar workflow.
- Gemini-only generation for ideas, bios, strategies, and content plans.
- English, French, Modern Standard Arabic, and Algerian Darija output handling.
- Validation for missing profile data, approved pillars, duplicate content, unsupported claims, malformed responses, requested language, and plan dates.
- 48-hour and seven-day suggested content plans.
- User-scoped persistence through the authenticated server identity.
- Clear errors when Gemini is unavailable; no local substitute content is silently returned.

## Known limitations

- A real verified trend-source integration is not implemented; generated content is marked evergreen when verified evidence is unavailable.
- Instagram OAuth and account analytics are not implemented.
- Generated plans contain suggested dates, not scheduled publication timestamps.
- The application requires configured Supabase and Gemini credentials.

## Local setup

### Requirements

- Node.js `>=22.12.0`
- A Supabase project
- A Gemini API key

### Environment

Copy `.env.example` to `.env.local` and set:

```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-publishable-key"
DATABASE_URL="your-supabase-session-pooler-connection-string"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.5-flash-lite"
```

Keep all secrets server-side where applicable. Do not commit `.env.local`.

### Database

For a new Supabase project, run [`supabase-schema.sql`](./supabase-schema.sql) once in the Supabase SQL Editor. For an existing project, apply the versioned migrations in [`drizzle/`](./drizzle/) in order. The current migration adds trend provenance fields and ownership policies.

In Supabase Authentication URL Configuration, use:

```text
http://localhost:3000
http://localhost:3000/**
```

### Run

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

### Validate

```powershell
npm run lint
npm run test:generation
npm run build
```

## Architecture notes

The server loads the authenticated Supabase identity, retrieves the user's brand profile and approved pillars, requests structured JSON from Gemini, validates the response, and only then returns or persists it. Existing approved or manually edited content is not silently overwritten by regeneration.

The Supabase publishable key is intended for browser use. Never put a Supabase `service_role` key, database password, or Gemini key in client code or source control.
