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
- `client/src/lib/mockData.ts` - All mock data (25 hotels, 5 cadences, 9 conversations, analytics)
- `client/src/lib/zones.ts` - Zone definitions with ambassadors (España, México, Colombia, Portugal)
- `client/src/contexts/RegionContext.tsx` - Region context for zone selection (persisted in localStorage as "gtm-region")
- `client/src/hooks/useRegion.ts` - Hook for accessing region context
- `client/src/lib/zoneFilters.ts` - Helper functions for filtering data by zone
- `client/src/components/AppSidebar.tsx` - Fixed left sidebar with zone selector, theme toggle
- `client/src/hooks/useTheme.ts` - Light/dark mode toggle hook (persisted in localStorage)
- `client/src/pages/` - All 6 page components
- `client/src/App.tsx` - Router and layout with RegionProvider

## Design System
- Light/dark theme toggle (default: dark, persisted in localStorage as "gtm-theme")
- Uses semantic CSS tokens (bg-background, bg-card, text-foreground, text-muted-foreground, border-border, etc.)
- Branding: Fideltour (www.fideltour.com)
- Primary accent: teal #25CAD2 (--primary CSS variable)
- Navy: #00395E (sidebar background in light mode, chart accents)
- Sidebar: always dark navy (#00395E family) regardless of theme, uses sidebar-* tokens
- Status colors: emerald (success), amber (warning), red (danger) - consistent across themes
- Fonts: Plus Jakarta Sans (body, --font-sans), Nunito (--font-serif for headings), Fira Code (mono)
- Logo: /logo-fideltour.png (white logo inverted for dark sidebar)
- Favicon: /favicon.png (Fideltour favicon)
- Desktop only (min-width 1280px)
- No authentication

## Regional Zones
4 zones with dedicated ambassadors:
- **España** (ES) - Ambassador: Federico Cifre
- **México** (MX) - Ambassador: Juan José Da Silva
- **Colombia** (CO) - Ambassador: Daniela Jiménez (also covers Peru, Panama)
- **Portugal** (PT) - Ambassador: Joao Freitas
Zone selector in sidebar filters all pages by region. "Todas las Regiones" shows all data.

## Recent Changes
- 2026-02-19: Applied Fideltour branding: teal/navy color palette, Plus Jakarta Sans + Nunito fonts, logo, favicon
- 2026-02-19: Sidebar now always dark navy with teal accent, matching fideltour.com branding
- 2026-02-19: Updated all chart colors across Dashboard and Analytics to use brand teal/navy palette
- 2026-02-19: Added regional zone system with 4 zones, ambassadors, and zone-filtered views
- 2026-02-19: Added 5 Portugal hotels, Portugal cadence, and Portugal conversations to mock data
- 2026-02-19: Removed "Pedro Atienza" user section from sidebar
- 2026-02-19: Added light/dark mode toggle in sidebar bottom
- 2026-02-19: Migrated all pages from hardcoded dark hex colors to semantic Tailwind CSS tokens

## User Preferences
- Spanish language for all UI labels and content
- Production-ready visual appearance
- All data is mock/hardcoded - no API calls needed
- Light and dark mode support
