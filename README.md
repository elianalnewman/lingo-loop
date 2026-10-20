# LingoLoop

Practice conversational Hebrew with an AI tutor through role-play scenarios (at a café, at the market, making plans, meeting someone new) at CEFR levels A1–B2. The tutor replies in Hebrew with an English translation, per-word glosses and, when needed, a correction of your message.

## Stack

- Vite + React 19 + TypeScript, `react-router`, Tailwind CSS v4
- Supabase Auth and Postgres, with Row Level Security on every table
- Vercel for hosting, with Vercel Functions in `api/`
- OpenAI Responses API for the tutor

## Getting started

Requirements: Node 20.19+ or 22.12+, and access to the linked Vercel and Supabase projects.

```bash
npm install
npx vercel login              # once
npx vercel env pull .env      # then add OPENAI_API_KEY and SUPABASE_SECRET_KEY to .env
npx vercel dev                # app + API on http://localhost:3000
```

`vercel dev` reads `.env` instead of the Vercel Development values and ignores `.env.local`, so keep every variable in `.env`. Restart `vercel dev` after editing it. `npm run dev` runs Vite alone, without `/api`, so conversations can't be created or continued there.

## Scripts

| Command | What it does |
|---|---|
| `npx vercel dev` | App and API functions together |
| `npm run dev` | Vite only |
| `npm run build` | Type-check everything, then build to `dist/` |
| `npm run lint` | Oxlint |
| `npm run test:db` | RLS tests (pgTAP) against the linked Supabase project; they roll back and leave no data |

## Environment variables

See `.env.example`.

| Name | Used by | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | browser | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser | Publishable key; safe to expose, since RLS protects the data |
| `SUPABASE_URL` | `api/` | Same value as `VITE_SUPABASE_URL` |
| `SUPABASE_PUBLISHABLE_KEY` | `api/` | Same value as the browser key |
| `SUPABASE_SECRET_KEY` | `api/chat.ts` | Secret; used only to insert the tutor's replies |
| `OPENAI_API_KEY` | `api/chat.ts` | Secret |
| `OPENAI_MODEL` | `api/chat.ts` | Optional; defaults to `gpt-6-luna` |

Never give a secret a `VITE_` prefix. On Vercel, `OPENAI_API_KEY` is not set yet and `SUPABASE_SECRET_KEY` is set for Production only, so chat does not work on deployments until they are added.

## Database

Migrations live in `supabase/migrations/` and are applied with `npx supabase db push --linked`.

- `profiles`: display name and default level, one row per user
- `conversations`: scenario, language and level, owned by a user
- `messages`: learner and tutor turns; tutor turns carry a translation, per-word glosses and an optional correction
- `vocabulary`: saved words (not used by the app yet)

Users can only read and write their own rows. Messages are protected through ownership of their conversation, and clients can insert only plain learner messages. These rules are covered by `supabase/tests/database/rls.test.sql`.

## API

Both endpoints are `POST`, take JSON, and require `Authorization: Bearer <Supabase access token>`. Errors are `{ "error": "<message>" }`.

- `POST /api/conversations` with `{ "scenario": "cafe" | "market" | "making_plans" | "meeting_someone", "level": "A1" | "A2" | "B1" | "B2" }` returns `201 { "id": "<uuid>" }`.
- `POST /api/chat` with `{ "conversationId": "<uuid>", "content": "<up to 500 characters>" }` saves the learner's message, gets the tutor's reply and returns `201 { "userMessage", "assistantMessage" }`. It returns `429` past 20 messages per 10 minutes, 200 per day, or 100 per conversation; if no reply is produced, the learner's message is removed.
