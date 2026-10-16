# LingoLoop

Practice conversational Hebrew with an AI tutor through realistic role-play scenarios: at a café, at the market, making plans with friends, and meeting someone new, at CEFR levels A1–B2.

Milestone 1 (current) covers accounts, onboarding, the dashboard, and saving conversations. The AI tutor itself comes in a later milestone; the conversation page is a placeholder for now.

## Stack

- Vite + React 19 + TypeScript, `react-router`, Tailwind CSS v4
- Supabase Auth and Postgres, with Row Level Security on every table
- Vercel for hosting, with Vercel Functions in `api/` for backend endpoints

## Getting started

Requirements: Node 20+ and access to the linked Vercel project and Supabase project. Docker is not needed.

```bash
npm install
npx vercel login                # once
npx vercel dev                  # app + API on http://localhost:3000
```

`vercel dev` pulls the environment variables from the Vercel project. To run only the Vite dev server (`npm run dev`), first write them to `.env.local` with `npx vercel env pull .env.local`. Note that creating a conversation needs `/api`, which only `vercel dev` serves.

## Scripts

| Command | What it does |
|---|---|
| `npx vercel dev` | App and API functions together |
| `npm run dev` | Vite only |
| `npm run build` | Type-check everything, then build to `dist/` |
| `npm run lint` | Oxlint |
| `npm run test:db` | Row Level Security tests (pgTAP) against the linked Supabase project; they roll back and leave no data |

## Environment variables

| Name | Used by | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | browser | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser | Publishable key; safe to expose, since RLS protects the data |
| `SUPABASE_URL` | `api/` | Same value as `VITE_SUPABASE_URL` |
| `SUPABASE_PUBLISHABLE_KEY` | `api/` | Same value as the browser key |

Secrets (a service-role key or an AI provider key, in later milestones) must only ever be read in `api/` and must never use a `VITE_` prefix.

## Database

SQL migrations live in `supabase/migrations/` and are applied with `npx supabase db push --linked`.

- `profiles`: display name and default level, one row per user
- `conversations`: scenario, language and level, owned by a user
- `messages`: user and assistant turns, with optional translation and correction
- `vocabulary`: saved words

Users can only read and write their own rows. Messages are protected through ownership of their conversation, and clients cannot insert assistant messages or corrections. These rules are covered by `supabase/tests/database/rls.test.sql`.

## API

`POST /api/conversations` with `Authorization: Bearer <access token>` and body `{ "scenario": "cafe" | "market" | "making_plans" | "meeting_someone", "level": "A1" | "A2" | "B1" | "B2" }`. Returns `201 { "id": "<uuid>" }`. Errors: 400 for invalid input, 401 for a missing or invalid token, 405 for the wrong method, 415 for a body that isn't JSON.
