# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: Vite dev server with HMR
- `npm run build`: type-check (`tsc -b`) then production build to `dist/`
- `npm run lint`: lint with Oxlint (config in `.oxlintrc.json`; not ESLint)
- `npm run preview`: serve the built `dist/` locally

No test framework is set up yet.

## Architecture

- Entry: `index.html` → `src/main.tsx` (renders `<App />` in `StrictMode`) → `src/App.tsx`.
- TypeScript uses project references: `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers `vite.config.ts`. `noEmit` is on, so `tsc` only type-checks and Vite does the bundling.
- Strict compiler flags that will fail the build: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (type-only imports need `import type`), and `erasableSyntaxOnly` (no `enum`, `namespace`, or constructor parameter properties).
- Imports may include the `.tsx`/`.ts` extension (`allowImportingTsExtensions`), as `main.tsx` does.

## Deployment

The app deploys to Vercel (`vercel.json`; the project is linked via `.vercel/`). Vercel runs `npm run build` and serves `dist/`, with a catch-all rewrite to `/index.html` so client-side routes work. `.env*` files are gitignored. `.env.local` holds the Vercel CLI's OIDC token and is not app config.
