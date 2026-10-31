# CreatorPilot Submission

## 1. Project name and one-line summary

**CreatorPilot** — A multilingual AI workspace that helps Arabic-speaking creators turn their brand strategy into practical content ideas and plans.

## 2. Project description

Creators and small businesses often know their niche but struggle to turn that knowledge into consistent, audience-specific content. Generic AI tools can produce attractive text while ignoring the creator's audience, offer, voice, language, and approved strategy.

CreatorPilot is a workspace for Arabic-speaking creators and small businesses. Users create a brand profile, define their audience and offer, approve strategic content pillars, and use Gemini to generate localized ideas, scripts, bios, strategies, and 48-hour or seven-day plans. The application validates generated content before showing or saving it, rejects unsupported claims, preserves user ownership, and makes provider failures explicit instead of silently inventing local results.

The current demo requires Supabase authentication, PostgreSQL, and a server-side Gemini API key. These credentials are not included in the repository.

## 3. Live demo link

**URL:** `[ADD PUBLIC RENDER URL]`

Test the URL in a private browser window before submitting.

## 4. Code repository

**Public GitHub repository:** https://github.com/SabrinaBouchekhlal/CreatorPilot

The repository contains the application source, database schema, migrations, tests, and setup instructions.

## 5. Demo video

**Video URL:** `[ADD UNLISTED YOUTUBE OR GOOGLE DRIVE URL]`

Recommended two-to-four-minute flow:

1. Show the working workspace immediately.
2. Explain the problem in under 30 seconds.
3. Create or open a brand profile.
4. Approve strategic pillars.
5. Generate localized content with Gemini.
6. Show validation, editing, and saving.
7. Show a 48-hour or seven-day plan.
8. End with impact and next steps.

The link must be viewable without requesting access.

## 6. Team members and roles

Replace these placeholders with every contributor's full name and actual contribution:

- **[Full name]** — Product direction, UX, and frontend workflow.
- **[Full name]** — Supabase authentication, PostgreSQL schema, ownership, and persistence.
- **[Full name]** — Gemini prompts, validation, localization, and testing.
- **[Full name]** — Deployment, demo video, and submission materials.

Remove roles that do not apply.

## 7. Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide React
- **Backend:** Node.js, Express, TypeScript, `tsx`
- **Database:** Supabase PostgreSQL with Drizzle ORM
- **Authentication:** Supabase Auth with email/password
- **AI:** Google Gemini API through `@google/genai`
- **Deployment:** Render

## 8. What happens next

Over the next three months, we would stabilize the public deployment, add verified trend ingestion, implement official Meta/Instagram analytics, add brand-knowledge retrieval, and test the workflows with creators across Arabic-speaking markets.
