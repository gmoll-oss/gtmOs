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
- **Prisma 5** + **PostgreSQL** (database ORM)
- **@tanstack/react-query** (data fetching)
- **Next.js API routes** (backend endpoints)
- **Zustand** (lists state management)
- Config constants still in lib/mockData.ts (LEAD_STATUS_CONFIG, AI_TAG_CONFIG, etc.)

## Migration Status (Express → Next.js)
- T001 ✅ Next.js 14 foundation set up (app router, configs, workflow)
- T002 ✅ Sidebar + theme + layout migrated
- T003 ✅ All 12 module pages migrated (using mock data)
- T004 ✅ Prisma + PostgreSQL setup (schema pushed, seed data loaded)
- T005 ✅ Next.js API routes + React Query (tRPC abandoned)
- T006 ✅ All pages connected to API + Prisma (mock data replaced)
- T007 🔲 Better Auth setup
- T008 🔲 Final cleanup, testing, deployment

## Application Structure
Next.js App Router pages in `app/(dashboard)/`:

1. **Actividad** (`/`) - `app/(dashboard)/page.tsx` - Dashboard with KPI cards, pipeline bar, campaign/inbox summaries, activity feed
2. **Inbox** (`/inbox`) - Two-panel email inbox with AI-tagged conversations and message threads
3. **Buscar y Enriquecer** (`/find`) - AI Finder search bar + filter sidebar + results table with enrichment status
4. **Listas** (`/lists`) - Card grid of prospect lists, click to expand contacts table, bulk actions
5. **Contactos** (`/contacts`) - Full contact data table with advanced filters, bulk actions, pagination
6. **Contact Detail** (`/contact/[id]`) - Contact profile with enrichment waterfall, scoring, exclusion checks, campaign enrollment, Zoho sync
7. **Empresas** (`/companies`) - Company data table with click-to-expand detail panel, firmographic data, contacts list
8. **Campañas** (`/campaigns`) - Campaign cards with visual flow builder (email/wait/condition/breakup steps with branches)
9. **Analíticas** (`/analytics`) - KPI cards, Recharts bar/line charts, pipeline funnel, campaign performance table
10. **Identidades** (`/identities`) - Card grid of SMTP identities with warmup progress bars, daily usage meters
11. **AI Playbook** (`/playbook`) - Tabbed form (Company Info, AI Variables, Competitors), Fill with AI button
12. **Integraciones** (`/integrations`) - Zoho CRM connection card, PMS/Zapier/Webhooks placeholders, sync log
13. **Configuración** (`/settings`) - Tabbed settings (General, Exclusion Rules, Scoring weights, Usage limits)

## Pipeline States
Discovered → Qualified → Enriched → Eligible → In Sequence → Engaged → Ready to Sync → Synced → Excluded → Archived

## Key Files
- `app/layout.tsx` - Root layout with ThemeProvider, fonts, metadata
- `app/(dashboard)/layout.tsx` - Dashboard layout with AppSidebar
- `app/(dashboard)/page.tsx` - Activity dashboard (home page)
- `app/(dashboard)/*/page.tsx` - All module pages
- `components/AppSidebar.tsx` - Fixed left sidebar with navigation, theme toggle
- `components/ThemeProvider.tsx` - Light/dark theme context (persisted in localStorage)
- `components/ui/` - Shadcn UI components
- `lib/mockData.ts` - All mock data (15 leads, 12 companies, 4 lists, 3 campaigns, etc.)
- `lib/listsStore.ts` - Lists state management (zustand)
- `lib/utils.ts` - Utility functions (cn helper)
- `app/globals.css` - Tailwind CSS with theme variables
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind configuration with custom theme
- `postcss.config.cjs` - PostCSS configuration (CommonJS format due to package.json "type": "module")

## Legacy Files (to be removed in T008)
- `client/` - Old React + Vite frontend
- `server/` - Old Express backend
- `shared/` - Old shared types

## Data Model (PostgreSQL via Prisma)
- **Lead**: email, name, title, company, domain, status (pipeline), score, ICP/completeness/signal scores, exclusion info, enrichment confidence, sequence enrollment, Zoho sync status
- **Company**: name, domain, industry, country, city, employees, source, enrichmentStatus, contactIds
- **ProspectList**: name, contactCount, source (search/import/ai/manual), contactIds
- **Campaign**: name, status, steps (email/follow_up/wait/condition/breakup with conditional logic), enrollment/performance stats, identityId, listIds
- **CampaignStep**: type, delayDays, subject, body, conditionField/branches, per-step stats
- **Identity**: name, email, smtpHost, dailyLimit, sentToday, warmupProgress, status
- **InboxThread**: leadId, leadName, leadCompany, campaignId, aiTag, unread, messages[]
- **InboxMessage**: direction (inbound/outbound), subject, body, timestamp
- **ActivityItem**: type, description, leadName, companyName, timestamp
- **AIPlaybookData**: companyName, website, industry, description, productsServices, valuePropositions, icpDefinition, competitors, testimonials, aiVariables
- **SearchJob**: name, status, geo/industry/keywords/targetRoles criteria, daily limits, schedule
- **EnrichmentAttempt**: provider, status, confidence, fields found
- **EventLog**: type, description, metadata, timestamp per lead
- **SuppressionEntry**: email/domain suppression with source
- **ExclusionRule**: 8 configurable exclusion checks
- **EnrichmentQueueItem**: leadId, status, provider, priority, progress tracking

## Design System
- Light/dark theme toggle (default: dark, persisted in localStorage as "gtm-theme")
- Enginy-style clean aesthetic: light gray backgrounds, white cards, subtle borders, generous whitespace
- Branding: Fideltour (www.fideltour.com)
- Primary accent: teal #25CAD2 (--primary CSS variable)
- Navy: #00395E (sidebar background, chart accents)
- Sidebar: always dark navy (#00395E family), 220px wide, two sections (main + settings) with divider
- Status colors per pipeline state defined in LEAD_STATUS_CONFIG
- AI tag colors for inbox: meeting_requested (green), interested (blue), not_interested (red), auto_reply (gray), question (amber), out_of_office (slate)
- Fonts: Plus Jakarta Sans (body, --font-sans), Nunito (--font-serif for headings), Fira Code (mono)
- Logo: /logo-fideltour.png (white logo inverted for dark sidebar)
- Favicon: /favicon.png (Fideltour favicon)
- Desktop only (min-width 1280px)
- No authentication (yet - Better Auth planned for T007)
- data-testid attributes on all interactive elements

## Exclusion Engine (Negativization)
8 checks run before campaign enrollment and before each email send:
1. Local suppression by email
2. Local suppression by domain
3. Zoho CRM client check
4. Zoho active prospect check
5. Zoho Do Not Contact flag
6. Campaigns unsubscribe
7. Recent sales activity (configurable days threshold)
8. Strategic/managed manually flag

## Running the Project
- Workflow: `npx next dev -p 5000`
- All pages are client components ("use client") using mock data
- No database required currently

## User Preferences
- Spanish language for all UI labels and content
- Production-ready visual appearance
- Light and dark mode support
- Reference: enginy.ai for complete product structure and UX patterns
- Do NOT add credits/usage display to the sidebar - user has explicitly requested this not be added
