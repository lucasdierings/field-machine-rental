# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Field Machine Rental is a Brazilian agricultural services marketplace connecting farmers with equipment owners. It's a monorepo with three packages:

- **`app/`** — Main React SPA (Vite + React 18 + TypeScript) deployed to `app.fieldmachine.com.br`
- **`site/`** — SEO landing page (Next.js 16, static export) deployed to `fieldmachine.com.br`
- **`mobile/`** — Capacitor wrapper (iOS/Android) that packages `app/dist` into native apps

Backend is Supabase (auth, Postgres DB, RLS). No shared root package.json — each package is independent.

## Common Commands

### App (React SPA)
```bash
cd app
npm run dev          # Dev server on :8080
npm run build        # Production build → dist/
npm run lint         # ESLint
```

### Site (Next.js)
```bash
cd site
npm run dev          # Dev server on :3000
npm run build        # Static export → out/
```

### Mobile (Capacitor)
```bash
cd mobile
npm run sync:ios     # Build web + sync to iOS
npm run open:ios     # Open Xcode
npm run run:ios      # Full build+sync+open workflow
# Same pattern for Android: sync:android, open:android, run:android
```

No test framework is currently configured.

## Architecture

### App structure (`app/src/`)
- **Pages** (`pages/`) — 30+ lazy-loaded route components. Routes defined in `App.tsx`.
- **Auth** — `contexts/AuthContext.tsx` provides global auth state (user, session, profile, roles). Access via `useAuth()` hook. Roles: admin, owner, renter.
- **Data fetching** — TanStack Query (React Query) with custom hooks in `hooks/` (e.g., `useMachines`, `useBookings`, `useProfile`).
- **UI** — shadcn/ui components in `components/ui/` (87 Radix-based primitives). Tailwind CSS with CSS variable theming (light/dark). Custom design tokens in `tailwind.config.ts`.
- **Validation** — Zod schemas in `lib/validation.ts` for Brazilian formats (CPF, CNPJ, phone).
- **Supabase client** — `integrations/supabase/client.ts`. Auto-generated DB types in `integrations/supabase/types.ts`.
- **Path alias** — `@/` maps to `app/src/`.

### Route protection
- `<ProtectedRoute>` — requires authentication
- `<RoleProtectedRoute>` — requires specific role (e.g., admin)

### Site structure (`site/`)
- Next.js App Router with static export (`output: 'export'`) for Cloudflare Pages
- SEO: JSON-LD schemas, OG image generation, sitemap, robots.txt

### Mobile
- Capacitor wraps the built `app/dist` — no code duplication
- Config: `mobile/capacitor.config.ts` (appId: `br.com.fieldmachine`)

### Database (Supabase)
- Migrations in `supabase/migrations/`
- Key tables: `user_profiles`, `user_roles`, `machines`, `bookings`, `reviews`, `addresses`, `user_documents`, `alerts`
- All tables use RLS

## Key Conventions

- All user-facing text is in **Brazilian Portuguese (pt-BR)**
- Forms use React Hook Form + Zod validation
- Styling: Tailwind utility classes + shadcn/ui composition + Framer Motion animations
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (app); `NEXT_PUBLIC_SUPABASE_*` (site)
- CI runs lint + build on push (`.github/workflows/lint-test.yml`)
