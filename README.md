# CreatorPilot

## 1. Project overview

**CreatorPilot — Multilingual AI content strategy for Arabic-speaking creators.**

CreatorPilot helps creators and small businesses turn a brand profile and approved content pillars into practical, localized content ideas, scripts, bios, strategies, and short-term content plans.

## 2. About the project

Creators often know their niche but struggle to turn their audience, offer, and expertise into consistent content. Generic AI tools can produce polished text while ignoring brand constraints, approved strategy, language, and dialect.

CreatorPilot addresses this problem with a structured workspace. Users define their brand, target audience, voice, offer, constraints, and strategic pillars. Gemini then generates content using that saved context. The application validates the response before displaying or saving it, rejects unsupported claims, and reports provider failures instead of silently returning invented substitute content.

The primary users are Arabic-speaking creators, educators, consultants, and small businesses. English and French workflows are also supported.

### Submission details

- **Live demo:** `[Add public Render URL]`
- **Public repository:** https://github.com/SabrinaBouchekhlal/CreatorPilot
- **Demo video:** `[Add an unlisted YouTube or Google Drive URL]`
- **Team members and roles:** `[Add each contributor's full name and one honest line describing their contribution]`

The live URL and demo video must be tested in a private browser window and accessible without requesting permission. If the deployment requires configured Supabase and Gemini credentials, the demo video should show the complete workflow.

## 3. Features

Users can:

- Create an account with Supabase email/password authentication.
- Create and edit a brand profile.
- Define and approve strategic content pillars.
- Generate three content ideas with scripts or format-specific structures.
- Generate Instagram bio options.
- Generate a four-pillar content strategy.
- Generate 48-hour and seven-day suggested content plans.
- Work in English, French, Modern Standard Arabic, or Algerian Darija.
- Review and save validated drafts.
- Manage user-owned content, decisions, calendar items, and library items.
- Receive clear errors when Gemini is unavailable or returns invalid content.

Google sign-in, Instagram OAuth, account analytics, and live trend-source verification are not currently enabled.

## 4. How it works

1. The user signs up with email and password.
2. The user creates a brand profile with the niche, audience, voice, offer, language, dialect, and constraints.
3. The user generates, reviews, and approves strategic pillars.
4. The user selects a workflow such as ideas, bio, strategy, or a content plan.
5. The server loads the authenticated user's brand context and approved pillars.
6. Gemini returns structured JSON in the requested language.
7. CreatorPilot validates required fields, format structure, dates, language, duplicate content, approved pillars, and unsupported claims.
8. Only validated content is returned or saved as a draft/proposal.

## 5. Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Lucide React |
| Backend | Node.js, Express, TypeScript, `tsx` |
| Database | Supabase PostgreSQL |
| ORM | Drizzle ORM |
| Authentication | Supabase Auth with email/password |
| AI integration | Google Gemini API through `@google/genai` |
| Validation and testing | TypeScript compiler and focused generation tests |
| Deployment | Render or another Node-compatible host |

## 6. Architecture

```text
React/Vite frontend
        |
        | Supabase Auth session + authenticated API requests
        v
Express/Node API
        |
        +--> Supabase PostgreSQL through Drizzle
        |       - brand profiles
        |       - approved pillars
        |       - user-owned content
        |
        +--> Gemini API
                - structured generation
                - server-side API key
                - bounded correction attempt
```

The frontend never receives the Gemini API key or database connection string. The API derives the current user from the verified Supabase access token, loads authorized brand data, calls Gemini, validates the response, and then persists only accepted drafts or proposals. Regeneration does not automatically overwrite approved or manually edited content.

## 7. Supported languages

CreatorPilot supports:

- English
- French
- Modern Standard Arabic (MSA)
- Algerian Darija

Language and dialect are normalized on the server and passed into each generation workflow. User-supplied brand terms are preserved where appropriate.

## 8. Project status and limitations

### Implemented

- Email/password authentication
- User-owned PostgreSQL persistence
- Brand profile and approved-pillar workflow
- Gemini-only generation
- Ideas, bios, strategies, 48-hour plans, and seven-day plans
- Output validation and bounded correction
- Unsupported-claim detection
- Date and timezone-aware suggested plan dates
- Localized UI and generation prompts
- Explicit provider and validation errors

### Planned or unavailable

- Google OAuth
- Official Instagram/Meta OAuth
- Instagram account analytics
- Verified live trend-source ingestion
- Brand-knowledge RAG
- Scheduled publishing and account-specific optimal posting times

When verified trend evidence is unavailable, the application generates evergreen ideas and does not claim that external sources or platform analytics were checked.

## 9. Getting started

### Requirements

- Node.js `>=22.12.0`
- A Supabase project
- A Gemini API key

### Environment variables

Copy `.env.example` to `.env.local` and set:

```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-publishable-key"
DATABASE_URL="your-supabase-session-pooler-connection-string"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.5-flash-lite"
```

### Database setup

For a new Supabase project, run [`supabase-schema.sql`](./supabase-schema.sql) once in the Supabase SQL Editor.

For an existing project, apply the versioned SQL files in [`drizzle/`](./drizzle/) in order. Do not rerun the initial schema unnecessarily.

In Supabase Authentication URL Configuration, add:

```text
http://localhost:3000
http://localhost:3000/**
```

### Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

### Deploy

For Render:

```text
Build command: npm install && npm run build
Start command: npm start
```

Configure the same environment variables in Render. After deployment, update Supabase's Site URL and allowed redirect URLs to use the public Render URL.

## 10. Validation and testing

Run TypeScript validation:

```powershell
npm run lint
```

Run the generation checks:

```powershell
npm run test:generation
```

Build the production frontend:

```powershell
npm run build
```

The generation tests cover localization, personalization, custom instructions, unsupported claims, profile completeness, approved pillars, trend-evidence handling, plan horizons, date boundaries, validation, and provider-result shapes.

## 11. Security notes

- Supabase access tokens are verified server-side.
- Database reads and writes are scoped to the authenticated user.
- Existing approved or manually edited content is not silently overwritten during regeneration.
- The Gemini API key stays server-side.
- `DATABASE_URL` stays server-side.
- The Supabase publishable/anon key may be used in the browser; a `service_role` key must never be exposed there.
- `.env.local`, database passwords, API keys, and local database files are excluded from Git.
- Supabase RLS policies provide defense in depth, while server-side ownership checks remain required for privileged database connections.

## 12. Future development

The next technical and product improvements are:

1. Deploy a stable public version and monitor provider/database failures.
2. Add verified trend-source ingestion with source relevance and freshness checks.
3. Implement official Meta/Instagram OAuth and read-only analytics.
4. Add brand-knowledge retrieval for user-provided documents.
5. Improve scheduling with explicit timezone-aware publication workflows.
6. Expand usability testing with creators, educators, and consultants across Arabic-speaking markets.

### What happens next

Over the next three months, we would stabilize the public deployment, add verified trend ingestion, implement official Meta/Instagram analytics, add brand-knowledge retrieval, and test the workflows with creators across Arabic-speaking markets.
