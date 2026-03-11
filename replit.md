# Fideltour Growth Orchestrator

## Overview
A white-label B2B SaaS platform replicating the Enginy.ai (formerly Genesy) product structure for Fideltour's hospitality CRM business. 12 modules matching Enginy's complete workflow: Activity → Inbox → Find & Enrich → Lists → Contacts → Companies → Campaigns → Analytics → Identities → AI Playbook → Integrations → Configuration. Adapted for hotel prospecting with Zoho CRM integration.

## Tech Stack
- **Next.js 14** (App Router) - framework
- **React 18 + TypeScript** - frontend
- **Tailwind CSS** (styling with light/dark theme support)
- **Recharts** (charts and analytics)
- **Lucide React** (icons)
- **Shadcn UI** components
- **Prisma 5** + **PostgreSQL** (database ORM + persistence)
- **@tanstack/react-query** (data fetching)
- **Next.js API routes** (backend endpoints at app/api/)
- **Better Auth 1.2** (authentication - email/password)
- **Zustand** (lists state management)
- Config constants in lib/mockData.ts (LEAD_STATUS_CONFIG, AI_TAG_CONFIG, etc.)

## Migration Status (Express → Next.js) - COMPLETE
- T001 ✅ Next.js 14 foundation set up
- T002 ✅ Sidebar + theme + layout migrated
- T003 ✅ All 12 module pages migrated
- T004 ✅ Prisma + PostgreSQL setup (schema pushed, seed data loaded)
- T005 ✅ Next.js API routes + React Query
- T006 ✅ All pages connected to API + Prisma
- T007 ✅ Better Auth setup (email/password, login/register, session, middleware)
- T008 ✅ Final cleanup (legacy files removed, docs updated)

## Authentication
- **Better Auth 1.2** with Prisma adapter
- Email/password authentication
- Login page at `/login` with signup toggle
- Middleware at `middleware.ts` redirects unauthenticated users to `/login`
- Session cookie: `better-auth.session_token`
- Auth API routes at `/api/auth/[...all]`
- User info + sign-out button in sidebar bottom
- Auth models: User, Session, Account, Verification (in prisma/schema.prisma)
- Default admin: admin@fideltour.com / fideltour123

## Application Structure
Next.js App Router pages in `app/(dashboard)/`:

1. **Actividad** (`/`) - Dashboard with KPI cards, pipeline bar, campaign/inbox summaries, activity feed
2. **Inbox** (`/inbox`) - Two-panel email inbox with AI-tagged conversations and message threads
3. **Buscar y Enriquecer** (`/find`) - AI Finder search bar + filter sidebar + results table with enrichment status
4. **Listas** (`/lists`) - Card grid of prospect lists, click to expand contacts table, bulk actions
5. **Contactos** (`/contacts`) - Full contact data table with advanced filters, bulk actions, pagination
6. **Contact Detail** (`/contact/[id]`) - Contact profile with enrichment waterfall, scoring, exclusion checks
7. **Empresas** (`/companies`) - Company data table with click-to-expand detail panel
8. **Campañas** (`/campaigns`) - Campaign cards with visual flow builder
9. **Analíticas** (`/analytics`) - KPI cards, Recharts bar/line charts, pipeline funnel
10. **Identidades** (`/identities`) - Card grid of SMTP identities with warmup progress
11. **AI Playbook** (`/playbook`) - Tabbed form (Company Info, AI Variables, Competitors)
12. **Integraciones** (`/integrations`) - Zoho CRM connection card, PMS/Zapier/Webhooks placeholders
13. **Configuración** (`/settings`) - Tabbed settings (General, Exclusion Rules, Scoring, Limits)

## Pipeline States
Discovered → Qualified → Enriched → Eligible → In Sequence → Engaged → Ready to Sync → Synced → Excluded → Archived

## Key Files
- `app/layout.tsx` - Root layout with ThemeProvider, QueryProvider, fonts, metadata
- `app/(dashboard)/layout.tsx` - Dashboard layout with AppSidebar
- `app/(dashboard)/page.tsx` - Activity dashboard (home page)
- `app/(dashboard)/*/page.tsx` - All module pages
- `app/login/page.tsx` - Login/register page
- `app/api/auth/[...all]/route.ts` - Better Auth API handler
- `app/api/*/route.ts` - All API routes (leads, companies, campaigns, etc.)
- `middleware.ts` - Auth redirect middleware
- `lib/auth.ts` - Better Auth server config (Prisma adapter)
- `lib/auth-client.ts` - Better Auth client (signIn, signUp, signOut, useSession)
- `lib/auth-utils.ts` - Server-side session helper
- `lib/prisma.ts` - Prisma client singleton
- `lib/api.ts` - API fetcher functions
- `lib/hooks/useData.ts` - React Query hooks for all data
- `lib/queryClient.tsx` - QueryProvider wrapper
- `lib/mockData.ts` - Config constants (LEAD_STATUS_CONFIG, AI_TAG_CONFIG, etc.)
- `lib/listsStore.ts` - Lists state management (zustand)
- `components/AppSidebar.tsx` - Sidebar with navigation, theme toggle, user info
- `components/ThemeProvider.tsx` - Light/dark theme context
- `components/ui/` - Shadcn UI components
- `prisma/schema.prisma` - Full database schema
- `prisma/seed.ts` - Database seed script

## Data Model (PostgreSQL via Prisma)
- **User/Session/Account/Verification** - Better Auth models
- **Lead** - email, name, title, company, domain, status (pipeline), score, ICP/completeness/signal scores
- **Company** - name, domain, industry, country, city, employees, source, enrichmentStatus
- **ProspectList** - name, contactCount, source, contactIds
- **Campaign** - name, status, steps, enrollment/performance stats
- **CampaignStep** - type, delayDays, subject, body, conditions, per-step stats
- **Identity** - name, email, smtpHost, dailyLimit, warmupProgress, status
- **InboxThread** - leadId, campaignId, aiTag, unread, messages[]
- **InboxMessage** - direction, subject, body, timestamp
- **ActivityItem** - type, description, leadName, companyName, timestamp
- **AIPlaybook** - company info, products, value props, competitors, AI variables
- **SearchJob** - criteria, schedule, daily limits
- **EnrichmentAttempt** - provider, status, confidence, fields found
- **EventLog** - type, description, metadata, timestamp per lead
- **SuppressionEntry** - email/domain suppression with source
- **ExclusionRule** - 8 configurable exclusion checks
- **EnrichmentQueueItem** - leadId, status, provider, priority, progress

## Design System
- Light/dark theme toggle (default: dark, persisted in localStorage as "gtm-theme")
- Enginy-style clean aesthetic: light gray backgrounds, white cards, subtle borders
- Branding: Fideltour (www.fideltour.com)
- Primary accent: teal #25CAD2 (--primary CSS variable)
- Navy: #00395E (sidebar background, chart accents)
- Sidebar: always dark navy (#00395E family), 220px wide
- Fonts: Plus Jakarta Sans (body), Nunito (headings), Fira Code (mono)
- Logo: /logo-fideltour.png
- Favicon: /favicon.png
- Desktop only (min-width 1280px)
- data-testid attributes on all interactive elements

## Running the Project
- Workflow: `npx next dev -p 5000`
- All pages are client components ("use client") fetching from PostgreSQL via API routes
- Login required: admin@fideltour.com / fideltour123

## User Preferences
- Spanish language for all UI labels and content
- Production-ready visual appearance
- Light and dark mode support
- Reference: enginy.ai for complete product structure and UX patterns
- Do NOT add credits/usage display to the sidebar
