# Fideltour Growth Orchestrator

## Overview
A white-label B2B SaaS platform replicating the Genesy AI model (Find → Enrich → Engage → Sync) for Fideltour's hospitality CRM business. Discovers hotel prospects automatically, enriches with waterfall providers, runs email sequences, and syncs qualified leads to Zoho CRM.

## Tech Stack
- React + TypeScript (frontend)
- Tailwind CSS (styling with light/dark theme support)
- wouter (routing)
- Recharts (charts and analytics)
- Lucide React (icons)
- Shadcn UI components
- Mock data (no backend/database - all data hardcoded)
- Express server (serves frontend only)

## Application Structure
6 main screens accessible via left sidebar:
1. **Dashboard** (`/`) - Pipeline overview with lead state cards, KPIs, funnel chart, activity feed, search job summary
2. **Discovery** (`/discovery`) - Search Jobs management: create/edit/run discovery jobs with geo/industry/keyword criteria
3. **Leads** (`/leads`) - Lead list with pipeline state filters, bulk actions, search, scoring, pagination
4. **Lead Detail** (`/lead/:id`) - Enrichment waterfall, scoring breakdown, exclusion checks, sequence enrollment, Zoho sync status, event timeline
5. **Sequences** (`/sequences`) - Email sequence builder with step editor, template variables, performance stats
6. **Settings** (`/settings`) - Tenant settings: General, Zoho CRM, SMTP, Scoring, Exclusion rules, Discovery config

## Pipeline States
Discovered → Qualified → Enriched → Eligible → In Sequence → Engaged → Ready to Sync → Synced → Excluded → Archived

## Key Files
- `client/src/lib/mockData.ts` - All mock data: 30 leads, 4 search jobs, 3 sequences, enrichment attempts, event logs, suppression list, exclusion rules
- `client/src/components/AppSidebar.tsx` - Fixed left sidebar with navigation and theme toggle
- `client/src/hooks/useTheme.ts` - Light/dark mode toggle hook (persisted in localStorage)
- `client/src/pages/` - All 6 page components
- `client/src/App.tsx` - Router and layout

## Design System
- Light/dark theme toggle (default: dark, persisted in localStorage as "gtm-theme")
- Uses semantic CSS tokens (bg-background, bg-card, text-foreground, text-muted-foreground, border-border, etc.)
- Branding: Fideltour (www.fideltour.com)
- Primary accent: teal #25CAD2 (--primary CSS variable)
- Navy: #00395E (sidebar background, chart accents)
- Sidebar: always dark navy (#00395E family) regardless of theme, uses sidebar-* tokens
- Status colors per pipeline state defined in LEAD_STATUS_CONFIG
- Fonts: Plus Jakarta Sans (body, --font-sans), Nunito (--font-serif for headings), Fira Code (mono)
- Logo: /logo-fideltour.png (white logo inverted for dark sidebar)
- Favicon: /favicon.png (Fideltour favicon)
- Desktop only (min-width 1280px)
- No authentication

## Data Model (Mock)
- **Lead**: email, name, title, company, domain, status (pipeline), score, ICP/completeness/signal scores, exclusion info, enrichment confidence, sequence enrollment, Zoho sync status
- **SearchJob**: name, status, geo/industry/keywords/targetRoles criteria, daily limits, schedule, discovered/qualified counts
- **Sequence**: name, status, steps (email/follow_up/breakup), enrollment/performance stats
- **EnrichmentAttempt**: provider, status, confidence, fields found
- **EventLog**: type, description, metadata, timestamp per lead
- **SuppressionEntry**: email/domain suppression with source
- **ExclusionRule**: 8 configurable exclusion checks (local, Zoho CRM, campaigns, recent activity, strategic)

## Exclusion Engine (Negativization)
8 checks run before sequence enrollment and before each email send:
1. Local suppression by email
2. Local suppression by domain
3. Zoho CRM client check
4. Zoho active prospect check
5. Zoho Do Not Contact flag
6. Campaigns unsubscribe
7. Recent sales activity (configurable days threshold)
8. Strategic/managed manually flag

## User Preferences
- Spanish language for all UI labels and content
- Production-ready visual appearance
- All data is mock/hardcoded - no API calls needed
- Light and dark mode support
- Reference: enginy.ai for UI style
