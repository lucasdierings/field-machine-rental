# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Field Machine Rental is a Brazilian agricultural services marketplace connecting farmers with equipment owners. It's a monorepo with three packages:

- **`app/`** — Main React SPA (Vite + React 18 + TypeScript strict) deployed to `app.fieldmachine.com.br`
- **`site/`** — SEO landing page (Next.js 16, static export) deployed to `fieldmachine.com.br`
- **`mobile/`** — Capacitor wrapper (iOS/Android) that packages `app/dist` into native apps

Backend is Supabase (auth, Postgres DB with RLS, Edge Functions in Deno). No shared root package.json — each package is independent.

## Common Commands

### App (React SPA)
```bash
cd app
npm run dev          # Dev server on :8080
npm run build        # Production build → dist/
npm run lint         # ESLint
npx tsc --noEmit     # Type check without emitting
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

### Tests (Vitest)
```bash
cd app
npm run test             # Run all tests once
npm run test:watch       # Watch mode (re-runs on save)
npm run test:coverage    # Coverage report (text + HTML)
```

### Validation before commit
```bash
cd app && npm run lint && npm run test && npx tsc --noEmit && npm run build
cd ../site && npm run build
```

Pre-commit hook (Husky + lint-staged) auto-runs lint + type-check on staged `.ts/.tsx` files.

## Architecture

### App structure (`app/src/`)
- **Pages** (`pages/`) — 30+ lazy-loaded route components. Routes defined in `App.tsx`.
- **Auth** — `contexts/AuthContext.tsx` provides global auth state (user, session, profile, roles). Access via `useAuth()` hook. Roles: `admin`, `owner`, `renter`.
- **Data fetching** — TanStack Query (React Query) with custom hooks in `hooks/` (e.g., `useMachines`, `useBookings`, `useProfile`, `useOnboarding`).
- **UI** — shadcn/ui components in `components/ui/` (87 Radix-based primitives). Tailwind CSS with CSS variable theming (light/dark). Custom design tokens in `tailwind.config.ts`.
- **Validation** — Zod schemas in `lib/validation.ts` for Brazilian formats (CPF, CNPJ, phone, CEP).
- **Supabase client** — `integrations/supabase/client.ts`. Auto-generated DB types in `integrations/supabase/types.ts`.
- **Path alias** — `@/` maps to `app/src/`.
- **Geolocation** — `lib/geolocation.ts` for location-based machine search.
- **User verification** — `lib/userVerification.ts` for KYC flows.

### Key components by domain
- `components/admin/` — Admin dashboard panels (analytics, users, machines, bookings, reviews)
- `components/auth/` — ProtectedRoute, RoleProtectedRoute
- `components/booking/` — Booking creation and management workflow
- `components/dashboard/` — User dashboard sections
- `components/kyc/` — Know Your Customer document verification
- `components/machines/` — Machine listing, cards, filters
- `components/onboarding/` — Multi-step user onboarding with progress indicator
- `components/register/` — Registration flow steps

### Route protection
- `<ProtectedRoute>` — requires authentication
- `<RoleProtectedRoute>` — requires specific role (e.g., admin)

### Site structure (`site/`)
- Next.js App Router with static export (`output: 'export'`) for Cloudflare Pages
- SEO: JSON-LD schemas (FAQ, Organization), OG image generation (`app/og/`), sitemap, robots.txt

### Mobile
- Capacitor wraps the built `app/dist` — no code duplication
- Config: `mobile/capacitor.config.ts` (appId: `br.com.fieldmachine`)

### Database (Supabase)
- Migrations in `supabase/migrations/` and `app/supabase/migrations/`
- Key tables: `user_profiles`, `user_roles`, `machines`, `bookings`, `reviews`, `addresses`, `user_documents`, `alerts`
- All tables use Row Level Security (RLS)
- Edge Functions (Deno): `auth/`, `create-checkout/`, `webhook-handler/`

### Hosting & CI/CD
- **App + Site:** Cloudflare Pages (static builds)
- **CI:** GitHub Actions — lint, build, type-check on push/PR (`.github/workflows/lint-test.yml`)
- **Security:** Automated scanning (`.github/workflows/security.yml`)
- **Dependencies:** Dependabot auto-updates (`.github/dependabot.yml`)

## Key Conventions

- All user-facing text is in **Brazilian Portuguese (pt-BR)**
- Forms use React Hook Form + Zod validation — always validate CPF/CNPJ/CEP/phone with existing schemas in `lib/validation.ts`
- Styling: Tailwind utility classes + shadcn/ui composition + Framer Motion animations
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (app); `NEXT_PUBLIC_SUPABASE_*` (site)
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refine:`
- New pages must be lazy-loaded in `App.tsx` with `React.lazy()`
- New UI components should use shadcn/ui primitives from `components/ui/`
- Accessibility: follow WCAG 2.1 — always add `aria-labels` to interactive elements
- Never hardcode Supabase URLs or keys — use environment variables
- Images go in `app/src/assets/` (imported) or `app/public/` (static)

## Common Pitfalls to Avoid

- **Don't create new Supabase clients** — always import from `@/integrations/supabase/client`
- **Don't bypass RLS** — all DB operations go through the authenticated client
- **Don't use `any` type** — TypeScript strict mode is enforced (`noUnusedLocals`, `noUnusedParameters`)
- **Don't forget loading/error states** — TanStack Query hooks return `isLoading`, `error` — always handle them
- **Write tests for new utils/hooks** — test files go in `__tests__/` next to the source (e.g., `lib/__tests__/validation.test.ts`)
- **Don't duplicate validation** — reuse Zod schemas from `lib/validation.ts`
- **Don't add dependencies without checking** — the project already has 50+ packages; check if existing ones cover the need
- **Test builds before pushing** — `npm run build` in both `app/` and `site/`

## Branch Strategy

- `main` — production-ready code
- `dev` — integration branch for features
- `claude/*` — feature branches for Claude Code sessions
- Always create PRs to merge into `main`
