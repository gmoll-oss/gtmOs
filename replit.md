# GTM Cockpit - Fideltour

## Overview
GTM Cockpit is a B2B SaaS web application for Fideltour, specializing in CRM and loyalty solutions for the hospitality industry. This is Platform 1 (MQL/GTM) - focused on lead generation, enrichment, and nurturing until leads become SQLs (Contact Value >= 50).

## Tech Stack
- React + TypeScript (frontend)
- Tailwind CSS (styling with light/dark theme support)
- wouter (routing)
- Recharts (charts and analytics)
- Lucide React (icons)
- Mock data (no backend/database - all data hardcoded)
- Express server (serves frontend only)

## Application Structure
6 main screens accessible via left sidebar:
1. **Dashboard** (`/`) - GTM Dashboard with KPIs, pipeline funnel, tasks, activity feed
2. **Hotel Database** (`/database`) - Filterable/searchable hotel table with bulk actions
3. **Lead Profile** (`/lead/:id`) - Detailed hotel/lead view with AI briefing, contact value scoring
4. **Cadences** (`/cadences`) - Cadence flow builder with step visualization
5. **Unibox** (`/unibox`) - Unified inbox with conversation threads and AI suggested replies
6. **Analytics** (`/analytics`) - Charts and KPI tables for GTM metrics

## Key Files
- `client/src/lib/mockData.ts` - All mock data (20 hotels, 4 cadences, 7 conversations, analytics)
- `client/src/components/AppSidebar.tsx` - Fixed left sidebar navigation with theme toggle
- `client/src/hooks/useTheme.ts` - Light/dark mode toggle hook (persisted in localStorage)
- `client/src/pages/` - All 6 page components
- `client/src/App.tsx` - Router and layout

## Design System
- Light/dark theme toggle (default: dark, persisted in localStorage as "gtm-theme")
- Uses semantic CSS tokens (bg-background, bg-card, text-foreground, text-muted-foreground, border-border, etc.)
- Primary accent: indigo (--primary CSS variable)
- Status colors: emerald (success), amber (warning), red (danger) - consistent across themes
- Font: Inter
- Desktop only (min-width 1280px)
- No authentication

## Recent Changes
- 2026-02-19: Removed "Pedro Atienza" user section from sidebar
- 2026-02-19: Added light/dark mode toggle in sidebar bottom
- 2026-02-19: Migrated all pages from hardcoded dark hex colors to semantic Tailwind CSS tokens

## User Preferences
- Spanish language for all UI labels and content
- Production-ready visual appearance
- All data is mock/hardcoded - no API calls needed
- Light and dark mode support
