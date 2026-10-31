# CreatorPilot

## 1. Project overview

**CreatorPilot — Multilingual AI content strategy for Arabic-speaking creators.**

CreatorPilot helps creators and small businesses turn a brand profile and approved content pillars into practical, localized content ideas, scripts, bios, strategies, and short-term content plans.

## 2. About the project

Creators often know their niche but struggle to turn their audience, offer, and expertise into consistent content. Generic AI tools can produce polished text while overlooking brand constraints, approved strategies, language preferences, and dialect.

CreatorPilot addresses this problem through a structured content strategy workspace. Users define their brand identity, target audience, tone of voice, offer, constraints, and strategic content pillars. The application uses Google Gemini to generate content based on this saved context.

Generated responses are validated before being displayed or saved. CreatorPilot checks the structure and content of AI outputs, rejects unsupported claims, and reports provider or validation failures rather than silently returning fabricated substitute content.

The application is primarily designed for Arabic-speaking creators, educators, consultants, and small businesses, while also supporting English and French workflows.

## 3. Features

Users can:

- Create an account using Supabase email/password authentication.
- Create and edit a structured brand profile.
- Define, review, and approve strategic content pillars.
- Generate three content ideas with scripts or format-specific structures.
- Generate Instagram bio options.
- Generate a four-pillar content strategy.
- Generate suggested 48-hour and seven-day content plans.
- Work in English, French, Modern Standard Arabic, or Algerian Darija.
- Review and save validated content drafts.
- Manage their own content, decisions, calendar items, and library items.
- Receive clear error messages when Gemini is unavailable or returns invalid content.

Google sign-in, Instagram OAuth, Instagram account analytics, and live trend-source verification are not currently enabled.

## 4. How it works

1. **Account creation:** The user signs up using an email address and password.
2. **Brand setup:** The user creates a brand profile containing their niche, target audience, tone of voice, offer, language, dialect, and constraints.
3. **Content pillars:** The user generates, reviews, and approves strategic content pillars.
4. **Workflow selection:** The user chooses ideas, bios, strategy, or a content plan.
5. **Context retrieval:** The server identifies the authenticated user and loads the corresponding brand profile and approved pillars.
6. **AI generation:** Gemini generates structured JSON based on the workflow, brand context, and language.
7. **Output validation:** CreatorPilot validates required fields, content structure, dates, language, duplicate content, approved pillars, and unsupported claims.
8. **Draft management:** Only content that passes validation is returned or saved as a draft or proposal.

## 5. Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, Lucide React |
| Backend | Node.js, Express, TypeScript, `tsx` |
| Database | Supabase PostgreSQL |
| ORM | Drizzle ORM |
| Authentication | Supabase Auth with email/password |
| AI integration | Google Gemini API through `@google/genai` |
| Validation and testing | TypeScript compiler and generation tests |
| Deployment | Render or another Node.js-compatible hosting platform |

## 6. Architecture

```text
                    React / Vite Frontend
                             |
              Supabase Auth session and
               authenticated API requests
                             |
                             v
                      Express / Node API
                             |
                 +-----------+-----------+
                 |                       |
                 v                       v
        Supabase PostgreSQL          Gemini API
           through Drizzle                |
                 |                Structured generation
          +------+-------+          and bounded correction
          |      |       |
          v      v       v
        Brand  Approved  User-owned
        profiles pillars content
```

The frontend communicates with the backend through authenticated API requests. Supabase Auth provides the user session, and the API verifies the access token before accessing user-specific data.

The backend loads the authenticated user's authorized brand context, sends generation requests to Gemini, validates the returned content, and persists only accepted drafts or proposals. Regeneration does not automatically overwrite approved or manually edited content.

Sensitive credentials remain server-side. The frontend must never receive the Gemini API key or the database connection string.

## 7. Supported languages

CreatorPilot supports:

- **English**
- **French**
- **Modern Standard Arabic (MSA)**
- **Algerian Darija**

Language and dialect preferences are normalized on the server and passed to the relevant generation workflow. User-provided brand terminology is preserved where appropriate.

## 8. Project status and limitations

### Implemented

- Supabase email/password authentication.
- User-owned PostgreSQL persistence.
- Brand profile management.
- Content pillar generation, review, and approval.
- Gemini-powered content generation.
- Content ideas and Instagram bio generation.
- Four-pillar content strategies.
- 48-hour and seven-day suggested content plans.
- Output validation and bounded correction attempts.
- Unsupported-claim detection.
- Date and timezone-aware suggested plan dates.
- Localized user interface and generation prompts.
- Explicit provider and validation error handling.

### Planned or currently unavailable

- Google OAuth sign-in.
- Official Instagram/Meta OAuth integration.
- Instagram account analytics.
- Verified live trend-source ingestion.
- Brand-knowledge retrieval-augmented generation (RAG).
- Scheduled publishing.
- Account-specific optimal posting-time recommendations.

When verified trend evidence is unavailable, CreatorPilot generates evergreen content ideas. It does not claim that external sources, current trends, or platform analytics have been checked when they have not.

## 9. Getting started

### Requirements

- Node.js `>=22.12.0`
- A Supabase project
- A Google Gemini API key

### Environment variables

Copy `.env.example` to `.env.local` and configure:

```env
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-publishable-key"
DATABASE_URL="your-supabase-session-pooler-connection-string"
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.5-flash-lite"
```

Keep `GEMINI_API_KEY` and `DATABASE_URL` on the server. Never expose them through frontend code or commit them to Git.

### Database setup

For a new Supabase project:

1. Open the Supabase SQL Editor.
2. Run [`supabase-schema.sql`](./supabase-schema.sql) once.
3. Apply the versioned SQL files in [`drizzle/`](./drizzle/) in order.

For an existing project, do not rerun the initial schema unnecessarily; apply only migrations that have not yet been applied.

### Supabase authentication configuration

In Supabase **Authentication → URL Configuration**, configure:

```text
Site URL:
http://localhost:3000

Redirect URL:
http://localhost:3000/**
```

Update these values to the public deployment URL when deploying.

### Run locally

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

### Deploy to Render

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

Run generation tests:

```powershell
npm run test:generation
```

Build the production frontend:

```powershell
npm run build
```

The generation tests cover language and dialect localization, brand personalization, custom instructions, unsupported claims, incomplete profiles, approved pillars, trend evidence, plan horizons, date boundaries, output validation, and provider response structures.

## 11. Security notes

- Supabase access tokens are verified server-side.
- Database reads and writes are scoped to the authenticated user.
- Existing approved or manually edited content is protected from automatic overwriting during regeneration.
- The Gemini API key and database connection string stay server-side.
- The Supabase publishable/anon key may be used in the browser.
- A Supabase `service_role` key must never be exposed in frontend code.
- `.env.local`, database passwords, API keys, and local database files are excluded from Git.
- Supabase Row Level Security policies provide defense in depth; server-side ownership checks remain required for privileged database connections.

## 12. Future development

The next technical and product improvements include:

1. Deploying a stable public version and monitoring AI provider and database failures.
2. Adding verified trend-source ingestion with source relevance, provenance, and freshness checks.
3. Implementing official Meta/Instagram OAuth and read-only account analytics.
4. Adding brand-knowledge retrieval for user-provided documents.
5. Improving scheduling through explicit timezone-aware publishing workflows.
6. Expanding usability testing with creators, educators, and consultants across Arabic-speaking markets.
