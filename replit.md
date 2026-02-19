# GTM Cockpit - Fideltour

## Overview
GTM Cockpit is a B2B SaaS web application for Fideltour, specializing in CRM and loyalty solutions for the hospitality industry. This is Platform 1 (MQL/GTM) - focused on lead generation, enrichment, and nurturing until leads become SQLs (Contact Value >= 50).

## Tech Stack
- React + TypeScript (frontend)
- Tailwind CSS (styling with dark theme)
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
- `client/src/components/AppSidebar.tsx` - Fixed left sidebar navigation
- `client/src/pages/` - All 6 page components
- `client/src/App.tsx` - Router and layout with forced dark mode

## Design System
- Dark theme forced (class="dark" on html)
- Background: #0F1117, Cards: #1A1D27, Borders: #2A2D3E
- Primary accent: #6366F1 (indigo)
- Success: #10B981, Warning: #F59E0B, Danger: #EF4444
- Font: Inter
- Desktop only (min-width 1280px)
- No authentication

## User Preferences
- Spanish language for all UI labels and content
- Production-ready visual appearance
- All data is mock/hardcoded - no API calls needed
