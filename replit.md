# Fideltour Growth Orchestrator

## Overview
A white-label B2B SaaS platform replicating the Enginy.ai (formerly Genesy) product structure for Fideltour's hospitality CRM business. 12 modules matching Enginy's complete workflow: Activity → Inbox → Find & Enrich → Lists → Contacts → Companies → Campaigns → Analytics → Identities → AI Playbook → Integrations → Configuration. Adapted for hotel prospecting with Zoho CRM integration.

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
12 modules accessible via left sidebar (matching Enginy's navigation):
1. **Actividad** (`/`) - System-wide activity feed with timeline layout, type filters, search
2. **Inbox** (`/inbox`) - Two-panel email inbox with AI-tagged conversations and message threads
3. **Buscar y Enriquecer** (`/find`) - AI Finder search bar + filter sidebar + results table with enrichment status
4. **Listas** (`/lists`) - Card grid of prospect lists, click to expand contacts table, bulk actions
5. **Contactos** (`/contacts`) - Full contact data table with advanced filters, bulk actions, pagination
6. **Contact Detail** (`/contact/:id`) - Contact profile with enrichment waterfall, scoring, exclusion checks, campaign enrollment, Zoho sync
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
- `client/src/lib/mockData.ts` - All mock data: 15 leads, 12 companies, 4 lists, 3 campaigns, 3 identities, 7 inbox threads, 15 activity items, AI playbook data, enrichment attempts, event logs, suppression list, exclusion rules, enrichment queue
- `client/src/components/AppSidebar.tsx` - Fixed left sidebar with Enginy-style navigation (main nav + settings section), theme toggle
- `client/src/hooks/useTheme.ts` - Light/dark mode toggle hook (persisted in localStorage)
- `client/src/pages/` - All 14 page components (12 modules + ContactDetail + NotFound)
- `client/src/App.tsx` - Router and layout

## Data Model (Mock)
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
- No authentication
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

## User Preferences
- Spanish language for all UI labels and content
- Production-ready visual appearance
- All data is mock/hardcoded - no API calls needed
- Light and dark mode support
- Reference: enginy.ai for complete product structure and UX patterns
- Do NOT add credits/usage display to the sidebar - user has explicitly requested this not be added
