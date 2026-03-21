# 🏗️ Field Machine Rental — Architecture Diagram

## 📊 Monorepo Structure

```
field-machine-rental/
├── 📂 .github/
│   ├── 📂 workflows/
│   │   ├── lint-test.yml          (CI: tests both app & site)
│   │   └── security.yml           (Security: OWASP scanning)
│   ├── dependabot.yml             (Auto-updates)
│   └── PR/Issue templates
├── 📂 app/                        ⚙️ WEB APPLICATION
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   └── dist/                      (Build output)
├── 📂 site/                       🌐 LANDING PAGE
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   └── out/                       (Build output)
├── 📂 supabase/                   🗄️ DATABASE
│   ├── migrations/
│   └── config/
├── 📚 Documentation/
│   ├── README.md
│   ├── CONTRIBUTING.md
│   ├── CHANGELOG.md
│   ├── VERSION
│   ├── DEPLOYMENT_STRATEGY.md
│   ├── SEO_AI_CRAWLABILITY.md
│   ├── CI_CD_OPTIMIZATION.md
│   ├── ACCESSIBILITY.md
│   └── GUIA_CLOUDFLARE.md
└── .git/
```

---

## 🔄 Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPER WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    git commit & git push
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      GitHub Repository (main branch)    │
        │                                         │
        │  • App code (/app)                      │
        │  • Site code (/site)                    │
        │  • Supabase migrations (/supabase)      │
        └─────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌─────────────────────┐    ┌──────────────────────┐
    │  GitHub Actions     │    │  Webhook Triggers    │
    │  (lint-test.yml)    │    │  (Cloudflare Pages)  │
    │                     │    │                      │
    │ • Install deps      │    │ • field-machine-app  │
    │ • Lint app & site   │    │ • fieldmachine-site  │
    │ • Build app & site  │    │                      │
    │ • Type check        │    │                      │
    └─────────────────────┘    └──────────────────────┘
             │                           │
             ▼ (if passes)              ▼
    ✅ Workflow completes      Cloudflare Pages
                               builds & deploys
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            Build /app         Build /site     Updates DNS
                    │               │
                    ▼               ▼
        app.fieldmachine       fieldmachine
           .com.br              .com.br
```

---

## 🚀 Cloudflare Pages Configuration

### **Project 1: field-machine-app**

```
GitHub: lucasdierings/field-machine-rental
Branch: main

Build Settings:
  ├── Framework preset: None (Vite)
  ├── Build command: npm run build
  ├── Output directory: dist
  └── Root directory: app

Environment Variables:
  ├── VITE_SUPABASE_URL
  └── VITE_SUPABASE_PUBLISHABLE_KEY

Preview Deployments: Enabled
  └── URLs: branch-xxx.field-machine-app.pages.dev

Production Domain: app.fieldmachine.com.br
```

### **Project 2: fieldmachine-site**

```
GitHub: lucasdierings/field-machine-rental
Branch: main

Build Settings:
  ├── Framework preset: Next.js
  ├── Build command: npm run build
  ├── Output directory: out
  └── Root directory: site

Environment Variables:
  ├── NEXT_PUBLIC_SUPABASE_URL
  └── NEXT_PUBLIC_SUPABASE_ANON_KEY

Preview Deployments: Enabled
  └── URLs: branch-xxx.fieldmachine-site.pages.dev

Production Domains:
  ├── fieldmachine.com.br
  └── www.fieldmachine.com.br
```

---

## 💾 Database Architecture

```
┌──────────────────────────────────────────┐
│        Supabase (PostgreSQL)             │
│    https://app.supabase.com              │
└──────────────────────────────────────────┘
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
┌─────────────┐  ┌──────────────┐
│  Database   │  │ Auth          │
│             │  │ (JWT)         │
│ • users     │  │               │
│ • machines  │  │ Roles:        │
│ • bookings  │  │ • admin       │
│ • reviews   │  │ • owner       │
│ • documents │  │ • renter      │
└─────────────┘  └──────────────┘
    │               │
    └───────┬───────┘
            │
    ┌───────┴───────────┐
    │                   │
    ▼                   ▼
┌─────────────┐  ┌──────────────┐
│  Storage    │  │  Realtime    │
│ (Uploads)   │  │ (WebSocket)  │
│             │  │              │
│ • Avatars   │  │ • Chat       │
│ • Docs      │  │ • Updates    │
│ • Machine   │  │ • Booking    │
│   photos    │  │   events     │
└─────────────┘  └──────────────┘
```

---

## 🔐 Authentication Flow

```
USER (App or Site)
       │
       ▼
┌──────────────────────┐
│  Supabase Auth       │
│  (Sign up / Login)   │
└──────────────────────┘
       │
       ▼ (if success)
  JWT Token Created
  (access + refresh)
       │
       ├─────────────────┬──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
   In Storage      In Memory         In Headers
   (httpOnly      (React Context)   (API Calls)
    Cookie)
       │
       ▼
  Row Level Security (RLS)
  activated on database
       │
       ├─── user_id = auth.uid()
       ├─── role = admin/owner/renter
       └─── can_access_resource = true/false
```

---

## 📱 Frontend Stack Comparison

### **App (Vite + React)**
```
┌──────────────────────────────────┐
│      React Application           │
│     (Client-side rendered)       │
├──────────────────────────────────┤
│ Technology                       │
│ • Vite 5.4 (bundler)             │
│ • React 18.3 (UI)                │
│ • TypeScript 5.8 (types)         │
│ • TanStack Query (data fetch)    │
│ • Tailwind CSS 3.4 (styling)     │
│ • shadcn/ui (components)         │
│ • Framer Motion (animations)     │
│                                  │
│ Hosted on: Cloudflare Pages      │
│ URL: app.fieldmachine.com.br     │
│ Port (dev): 8080                 │
└──────────────────────────────────┘
```

### **Site (Next.js)**
```
┌──────────────────────────────────┐
│     Next.js Application          │
│  (Static HTML + Server-side)     │
├──────────────────────────────────┤
│ Technology                       │
│ • Next.js 16.1 (framework)       │
│ • React 19.2 (UI)                │
│ • TypeScript 5.x (types)         │
│ • Tailwind CSS 4 (styling)       │
│ • SSG (Static Site Gen)          │
│ • SEO (meta, JSON-LD, etc)       │
│                                  │
│ Hosted on: Cloudflare Pages      │
│ URL: fieldmachine.com.br         │
│ Port (dev): 3000                 │
└──────────────────────────────────┘
```

---

## 🔄 Data Flow: User Registration

```
USER SIGNS UP IN APP
        │
        ▼
┌──────────────────────────────┐
│ Onboarding.tsx               │
│ (Step 1: Welcome)            │
│ (Step 2: Register - Form)    │
│ (Step 3: Email Verification) │
└──────────────────────────────┘
        │
        ▼ (Supabase signUp)
┌──────────────────────────────┐
│ Supabase Auth                │
│ • Create user                │
│ • Send verification code     │
│ • JWT tokens generated       │
└──────────────────────────────┘
        │
        ▼ (verifyOtp)
┌──────────────────────────────┐
│ Email Verification           │
│ • User enters code           │
│ • Session created            │
└──────────────────────────────┘
        │
        ▼ (handleFinalize)
┌──────────────────────────────┐
│ Create User Profile          │
│ • INSERT into user_profiles  │
│ • Set role (owner/renter)    │
│ • profile_completed = true   │
└──────────────────────────────┘
        │
        ▼
  REDIRECT TO DASHBOARD
```

---

## 🎯 Business Logic: Machine Booking

```
PRODUCER (Demandante)          OWNER (Ofertante)
        │                              │
        ▼                              ▼
   App Login              App Login / Machine Listing
        │                              │
        ▼                              ▼
   Search Machines   ←──────────────────┘
   (Location-based)   (TanStack Query)
        │
        ├─ Current location: GPS
        ├─ Radius: 50km default
        └─ Filters: Type, Rating
        │
        ▼
   View Machine Details
   • Photos
   • Price per day
   • Reviews
   • Availability
        │
        ▼
   Create Booking Request
   • Select dates
   • Add message
   • Confirm location
        │
        ▼
   📨 SEND REQUEST TO OWNER
        │
        └──────────┬──────────┘
                   │
                   ▼ (Owner sees notification)
          Booking Request Appears
          in Owner Dashboard
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼ (Accept)            ▼ (Reject)
   Status: ACCEPTED      Status: REJECTED
        │                     │
        ┌─────────────────────┘
        │
        ▼ (Both parties negotiate)
   💬 CHAT REALTIME
   (Supabase Realtime WebSocket)
        │
        ├─ Location details
        ├─ Date adjustments
        ├─ Price negotiations
        └─ Instructions
        │
        ▼ (Agreement reached)
   ✅ BOOKING CONFIRMED
   • Schedule created
   • Both parties notified
   • Status: CONFIRMED
        │
        ▼ (On scheduled date)
   🚜 MACHINE RENTAL STARTS
   • Service completion status
   • GPS tracking (if enabled)
   • Real-time updates
        │
        ▼ (After completion)
   ⭐ REVIEWS & RATINGS
   • Producer rates machine
   • Owner rates producer
   • Comments & photos
        │
        ▼
   🏆 REPUTATION UPDATED
   (Affects future bookings)
```

---

## 🌐 SEO Architecture (Site Only)

```
fieldmachine.com.br/
├── robots.txt          (Allows Google crawling)
├── sitemap.xml         (Lists all URLs)
├── (root layout)       (Global metadata)
│   ├── Title
│   ├── Description
│   ├── Keywords
│   ├── Open Graph
│   ├── Twitter Card
│   └── JSON-LD Schemas
│       ├── Organization
│       ├── WebSite
│       ├── Service
│       └── LocalBusiness (optional)
│
├── /                   (Home page)
├── /servicos           (Services)
├── /sobre              (About)
├── /contato            (Contact)
└── /blog               (Blog posts - future)
    └── [slug]
```

---

## 📊 Monitoring & Analytics

```
┌─────────────────────────────────────┐
│      Google Search Console          │
│   (Indexation + Core Web Vitals)    │
└─────────────────────────────────────┘
             │
             ▼ (submits sitemap)
┌─────────────────────────────────────┐
│    Google Indexation                │
│  • Crawls robots.txt                │
│  • Indexes pages                    │
│  • Tracks rankings                  │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│   Google Analytics 4 (Optional)     │
│  (User behavior tracking)           │
└─────────────────────────────────────┘
             │
             ▼
  Tracks:
  • Page views
  • User sessions
  • Conversions
  • Events (signup, booking, etc)


┌─────────────────────────────────────┐
│   Cloudflare Analytics              │
│  (Server-side metrics)              │
└─────────────────────────────────────┘
             │
             ▼
  Tracks:
  • Requests
  • Bandwidth
  • Cache hits
  • Errors
```

---

## 🔒 Security Layers

```
┌────────────────────────────────────────┐
│         Cloudflare Edge                │
│  (DDoS protection, caching, WAF)       │
└────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│    GitHub → Webhook → Deploy           │
│  (Code review, branch protection)      │
└────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│    Supabase PostgreSQL                 │
│  (Row Level Security, Encryption)      │
└────────────────────────────────────────┘
              │
              ├─── Authentication (JWT)
              ├─── RLS Policies
              └─── HTTPS Encryption
```

---

## 📈 Scaling Ready

```
Current Setup:
┌─────────────┐     ┌─────────────┐
│  App        │     │  Site       │
│ 50K users   │     │ 1M visits   │
│ per month   │     │ per month   │
└─────────────┘     └─────────────┘
       │                   │
       └─────────┬─────────┘
                 │
          ┌──────▼──────┐
          │ Supabase    │
          │ PostgreSQL  │
          │ (Scalable)  │
          └─────────────┘

Future: Can add:
• CDN for images
• Service workers for offline
• Real-time notifications
• Machine learning recommendations
```

---

**Versão:** 1.0 | **Data:** 2026-03-21

This architecture supports your two-sided marketplace with complete separation of concerns! 🚀
