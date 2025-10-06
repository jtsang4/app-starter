# App Starter (TanStack Start + Vite + React 19)

A modern fullstack starter based on TanStack Start (React) and Vite. It ships with filebased routing, SSR/streaming, API routes, typesafe environment variables, authentication, database, UI components, testing, and code quality tooling. Use it to move from prototype to production quickly.

## Tech Stack & Features
- Build/Runtime
  - React 19, TypeScript 5.7, Vite 7
  - TanStack Start + Nitro v2 (SSR, Server Functions, Streaming, API Routes)
  - Filebased routing in `src/routes` (including pages and `/api/*`)
- Data & State
  - TanStack Query (fetching/caching) + TanStack Store (lightweight state)
  - Ecosystem ready: TanStack Table / Form, etc.
- UI & Styling
  - Tailwind CSS v4 (`@tailwindcss/vite`)
  - Shadcn UI components (configured via `components.json`, using lucide icons)
- Auth
  - better-auth (email/password, email verification, phone OTP, optional Google signin)
- Database
  - PostgreSQL + Drizzle ORM (migrations/generation/Studio)
  - Docker Compose for local Postgres and optional Redis
- Quality & Testing
  - Biome (lint/format/check)
  - Vitest + @testing-library/react + jsdom

## Directory Structure (excerpt)
```
src/
  routes/           # Pages & API routes (e.g. /api/health, /api/auth/$)
  router.tsx        # Router creation & SSR-Query integration
  components/       # Components (incl. shadcn: ui/* and auth/*)
  integrations/     # TanStack Query Provider and other integrations
  db/               # Drizzle connection, schema, migrations & seeds
  db-collections/   # @tanstack/db collections (examples)
  lib/              # Utilities, auth client/store, etc.
  env.ts            # Type-safe env via @t3-oss/env-core
public/             # Static assets
```

## Quick Start
1) Install dependencies
```bash
pnpm install
```

2) Start local databases (optional for dev)
```bash
pnpm db:start        # docker-compose.dev.yml: Postgres (5433) + Redis (6380)
```

3) Configure environment variables (create `.env` at repo root)
```bash
# Required
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/appstarter_dev
BETTER_AUTH_SECRET=use_a_random_string_of_at_least_32_chars

# Optional
VITE_APP_TITLE=App Starter
VITE_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
ADMIN_EMAILS=admin@appstarter.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NODE_ENV=development
```

4) Initialize the database (generate/migrate/optional seed)
```bash
pnpm db:generate   # Generate migrations into ./drizzle from schema
pnpm db:migrate    # Apply migrations
# For demo seed: build scripts then run
pnpm build:scripts && pnpm db:seed:js
```

5) Develop locally
```bash
pnpm dev           # http://localhost:3000
```

6) Testing & Quality
```bash
pnpm test          # Vitest
pnpm lint          # Biome Lint
pnpm format        # Biome Format
pnpm check         # Biome Check (combo)
```

## Routing & API
- Filebased routes live in `src/routes`, root layout at `src/routes/__root.tsx`
- API examples:
  - Health check: `GET /api/health` (uptime/memory, etc.)
  - Auth handler: `/api/auth/$` (better-auth handler)
- Router context and setup: see `src/router.tsx` (integrates TanStack Query + SSRQuery)

## Authentication (better-auth)
- Server config: `src/lib/auth.ts`
  - Email/password, email verification, phone OTP, Google signin (configure env vars)
  - In development, verification emails/SMS are logged to console
- Client side: `src/lib/auth-client.ts` + `src/lib/auth-store.ts` + `hooks/use-auth.ts`
  - Rich hooks: `useUser`, `useSession`, `useSignIn`, `useSignUp`, `useSignOut`, `useSendPhoneOTP`, etc.
  - UI examples under `src/components/auth/*` (AuthProvider, SignIn/SignUp, Phone SignIn)

## Styling & UI
- Tailwind v4 via `@tailwindcss/vite`; global styles in `src/styles.css`
- Shadcn UI:
```bash
pnpx shadcn@latest add button
```
- Utilities: `clsx` + `tailwind-merge` (`cn()` in `src/lib/utils.ts`)

## Database & Migrations
- Connection: `src/db/index.ts` (pg + drizzle-orm)
- Schema: `src/db/schema/*` (user/session/account/verification)
- Config: `drizzle.config.ts` (outputs to `./drizzle`)
- Scripts:
  - Generate: `pnpm db:generate`
  - Migrate: `pnpm db:migrate`
  - Push: `pnpm db:push`
  - Studio: `pnpm db:studio`

## Build & Deploy
- Local build
```bash
pnpm build   # TanStack Start (Nitro) outputs to .output
```
- Production (Docker recommended)
  - Dockerfile includes migrations/optional seeding via `entrypoint.sh`
  - Run directly:
```bash
docker compose up -d   # uses docker-compose.yml (app + postgres + redis)
```
- Static preview only (no SSR/API)
```bash
pnpm serve
```

## Available Scripts
- Dev/Build: `dev`, `build`, `serve`
- Test/Quality: `test`, `lint`, `format`, `check`
- Database: `db:start`, `db:stop`, `db:generate`, `db:migrate`, `db:push`, `db:studio`, `db:drop`
- Migrations & seed (JS artifacts): `build:scripts`, `db:migrate:js`, `db:seed:js`

## Code Style
- Biome is used for linting/formatting
- Import guideline: always prefer named imports; avoid `import * as` for better treeshaking and readability

## Health Check
- `GET /api/health` returns app status (see `src/routes/api/health.ts`)

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
