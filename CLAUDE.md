# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

LingoLoop: a Vite + React 19 SPA for practicing conversational Hebrew, backed by Supabase (Auth + Postgres) and Vercel Functions in `api/`.

## Commands

- `npx vercel dev`: run the SPA **and** `api/` functions together on :3000. Use this for anything that creates conversations; plain `npm run dev` (Vite only) does not serve `/api`.
- `npm run dev`: Vite dev server only (UI work that doesn't hit `/api`)
- `npm run build`: type-check (`tsc -b`, covering `src/`, `api/` and `vite.config.ts`) then build to `dist/`
- `npm run lint`: lint with Oxlint (config in `.oxlintrc.json`; not ESLint)
- `npm run test:db`: run the pgTAP RLS tests in `supabase/tests/database/` against the **linked remote** project via the Management API. The test file wraps everything in a transaction that rolls back.

## Architecture

- Entry: `index.html` → `src/main.tsx` (`BrowserRouter` + `AuthProvider`) → `src/App.tsx` (route table).
- Routing (`react-router`): `/`, `/login`, `/signup` (`GuestOnly`), and behind `RequireAuth` + `AppShell`: `/onboarding`, then `RequireProfile` → `/dashboard`, `/conversations/:id`. Guards live in `src/auth/guards.tsx`.
- Auth state: `src/auth/AuthProvider.tsx` holds the session and the user's `profiles` row; read it with `useAuth()` from `src/auth/context.ts`.
- `src/lib/options.ts` holds the scenario and level allowlists. It is shared by the SPA and `api/`, and its values must match the SQL check constraints.
- Browser reads (profiles, conversations, messages) go straight to Supabase with the publishable key; RLS limits them to the user's rows. Writes that need server checks go through `api/` with the user's bearer token (`src/lib/api.ts`).
- `api/conversations.ts`: Web-standard `POST` handler. It verifies the JWT with `getClaims`, validates the body against the allowlists, and inserts **as the user** (RLS still applies).
- `api/chat.ts`: inserts the learner message as the user, enforces per-user and per-conversation limits by counting their messages, calls OpenAI (Responses API, structured output, model from `OPENAI_MODEL`), then inserts the assistant reply with `SUPABASE_SECRET_KEY`, the only place that key is used. Shared helpers are in `api/_shared.ts` (the `_` prefix keeps Vercel from deploying it as a function).
- Styling: Tailwind v4 via `@tailwindcss/vite`; tokens (`brand-*` blue, `accent-*` teal, `--radius-card`, Heebo for `:lang(he)`) are in `src/index.css`. Shared class strings are in `src/components/ui.ts`. Hebrew text always gets `lang="he" dir="rtl"`.
- TypeScript uses project references: `tsconfig.app.json` (`src/`), `tsconfig.api.json` (`api/`), `tsconfig.node.json` (`vite.config.ts`). `noEmit` is on.
- Strict compiler flags that will fail the build: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (type-only imports need `import type`), and `erasableSyntaxOnly` (no `enum`, `namespace`, or constructor parameter properties).
- Imports include the `.tsx`/`.ts` extension (`allowImportingTsExtensions`).
- Oxlint's `only-export-components` rule warns when a file exports both components and hooks, which is why contexts and hooks live in separate `.ts` files.

## Database

Migrations are in `supabase/migrations/`. Tables: `profiles` (PK `user_id`), `conversations`, `messages`, `vocabulary`; all have RLS and explicit grants to `authenticated` only.
- `messages` access goes through ownership of the parent conversation. Clients may insert only `role = 'user'` rows with no `translation`, `correction` or `word_translations` (per-word glosses, a jsonb array of `{word, translation}`); assistant messages must be written server-side (future milestone, with a server-only key).
- Clients have no `update` on `conversations`; a `security definer` trigger in the `private` schema bumps `updated_at` when a message is inserted.
- New tables need explicit `grant`s; the Data API roles don't get them by default on this project.
- Add a pgTAP test to `supabase/tests/database/rls.test.sql` for every new policy, wrapping each assertion as `insert into tap_output (line) select <assertion>` and updating `plan(n)`.

## Deployment

The app deploys to Vercel (`vercel.json`; the project is linked via `.vercel/`). Vercel runs `npm run build`, serves `dist/`, and deploys `api/*.ts` as functions. The SPA rewrite skips `/api/`, Vite's `/@…` paths and any path containing a dot. Keep it that way, or `vercel dev` serves `index.html` for Vite's module requests and the app goes blank.

Env vars: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (browser) plus `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (functions) are set in Vercel for all environments. `api/chat.ts` also needs `SUPABASE_SECRET_KEY` and `OPENAI_API_KEY` (`OPENAI_MODEL` is optional, default `gpt-6-luna`). On Vercel, `SUPABASE_SECRET_KEY` is set for Production only and `OPENAI_API_KEY` is not set yet, so chat fails on deployments until it is added (and Preview also needs `SUPABASE_SECRET_KEY`). See `.env.example`. Never give a secret a `VITE_` prefix. `.env*` files are gitignored. `vercel dev` does not pass `.env.local` to `api/` functions, and if a root `.env` exists it uses that file *instead of* the Development values on Vercel. So keep local secrets (`OPENAI_API_KEY`, `SUPABASE_SECRET_KEY`) in `.env` together with every other variable: start it with `npx vercel env pull .env`, then add the secrets (Vercel rejects Sensitive variables for Development). Restart `vercel dev` after editing it.
