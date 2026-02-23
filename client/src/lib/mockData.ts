export type LeadStatus = 
  | "discovered" 
  | "qualified" 
  | "enriched" 
  | "eligible" 
  | "in_sequence" 
  | "engaged" 
  | "ready_to_sync" 
  | "synced" 
  | "excluded" 
  | "archived";

export interface ProspectAccount {
  id: string;
  name: string;
  domain: string;
  website: string;
  industry: string;
  country: string;
  city: string;
  employeeCount: number;
  source: string;
  sourceUrl: string;
  confidence: number;
  discoveredAt: string;
  searchJobId: string;
}

export interface Lead {
  id: string;
  email: string;
  name: string;
  title: string;
  company: string;
  domain: string;
  phone: string;
  country: string;
  city: string;
  industry: string;
  website: string;
  employeeCount: number;
  status: LeadStatus;
  score: number;
  icpScore: number;
  completenessScore: number;
  signalScore: number;
  excluded: boolean;
  exclusionReason: string | null;
  exclusionSource: string | null;
  exclusionTimestamp: string | null;
  enrichmentConfidence: number;
  lastEnrichedAt: string | null;
  sourceUrls: string[];
  source: string;
  searchJobId: string;
  sequenceId: string | null;
  sequenceStep: number | null;
  zohoCrmSynced: boolean;
  zohoLeadId: string | null;
  matchedZohoAccountId: string | null;
  matchedZohoAccountName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchJob {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "draft";
  geo: string[];
  industry: string[];
  keywords: string[];
  targetRoles: string[];
  dailyLimit: number;
  schedule: string;
  totalDiscovered: number;
  totalQualified: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
  sources: string[];
}

export interface EnrichmentAttempt {
  id: string;
  leadId: string;
  provider: string;
  status: "success" | "partial" | "failed" | "pending";
  confidence: number;
  fieldsFound: string[];
  timestamp: string;
  payload: Record<string, string>;
}

export interface Sequence {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  steps: SequenceStep[];
  enrolledCount: number;
  totalSent: number;
  totalOpened: number;
  totalReplied: number;
  totalBounced: number;
  createdAt: string;
}

export interface SequenceStep {
  id: string;
  order: number;
  type: "email" | "follow_up" | "breakup";
  delayDays: number;
  subject: string;
  body: string;
  sent: number;
  opened: number;
  replied: number;
  bounced: number;
}

export interface EventLog {
  id: string;
  leadId: string;
  type: "discovered" | "qualified" | "enriched" | "excluded" | "enrolled" | "email_sent" | "email_opened" | "email_replied" | "email_bounced" | "ready_to_sync" | "synced" | "exclusion_check" | "score_updated";
  description: string;
  metadata: Record<string, string>;
  timestamp: string;
}

export interface SuppressionEntry {
  id: string;
  type: "email" | "domain";
  value: string;
  reason: string;
  source: "manual" | "zoho" | "campaigns" | "bounce";
  addedAt: string;
}

export interface ExclusionRule {
  id: string;
  name: string;
  type: "local_email" | "local_domain" | "zoho_client" | "zoho_active_prospect" | "zoho_dnc" | "campaigns_unsub" | "recent_activity" | "strategic_flag";
  enabled: boolean;
  config: Record<string, string | number | boolean>;
  description: string;
}

export interface ExclusionCheckResult {
  rule: string;
  passed: boolean;
  reason: string | null;
  source: string;
}

export const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bgClass: string; textClass: string }> = {
  discovered: { label: "Descubierto", color: "#94a3b8", bgClass: "bg-slate-100 dark:bg-slate-800", textClass: "text-slate-700 dark:text-slate-300" },
  qualified: { label: "Cualificado", color: "#60a5fa", bgClass: "bg-blue-100 dark:bg-blue-900/40", textClass: "text-blue-700 dark:text-blue-300" },
  enriched: { label: "Enriquecido", color: "#a78bfa", bgClass: "bg-violet-100 dark:bg-violet-900/40", textClass: "text-violet-700 dark:text-violet-300" },
  eligible: { label: "Elegible", color: "#34d399", bgClass: "bg-emerald-100 dark:bg-emerald-900/40", textClass: "text-emerald-700 dark:text-emerald-300" },
  in_sequence: { label: "En Secuencia", color: "#25CAD2", bgClass: "bg-teal-100 dark:bg-teal-900/40", textClass: "text-teal-700 dark:text-teal-300" },
  engaged: { label: "Contactado", color: "#fbbf24", bgClass: "bg-amber-100 dark:bg-amber-900/40", textClass: "text-amber-700 dark:text-amber-300" },
  ready_to_sync: { label: "Listo para Sync", color: "#f97316", bgClass: "bg-orange-100 dark:bg-orange-900/40", textClass: "text-orange-700 dark:text-orange-300" },
  synced: { label: "Sincronizado", color: "#22c55e", bgClass: "bg-green-100 dark:bg-green-900/40", textClass: "text-green-700 dark:text-green-300" },
  excluded: { label: "Excluido", color: "#ef4444", bgClass: "bg-red-100 dark:bg-red-900/40", textClass: "text-red-700 dark:text-red-300" },
  archived: { label: "Archivado", color: "#6b7280", bgClass: "bg-gray-100 dark:bg-gray-800", textClass: "text-gray-700 dark:text-gray-300" },
};

export const searchJobs: SearchJob[] = [
  {
    id: "sj-001",
    name: "Hoteles Boutique España",
    status: "active",
    geo: ["España"],
    industry: ["Hospitality", "Hotels"],
    keywords: ["hotel boutique", "hotel independiente", "hotel 4 estrellas"],
    targetRoles: ["Director General", "Revenue Manager", "Director Comercial"],
    dailyLimit: 50,
    schedule: "Diario - 09:00 CET",
    totalDiscovered: 187,
    totalQualified: 124,
    lastRunAt: "2026-02-23T09:00:00Z",
    nextRunAt: "2026-02-24T09:00:00Z",
    createdAt: "2026-01-15T10:00:00Z",
    sources: ["Google Search", "Booking.com", "TripAdvisor"],
  },
  {
    id: "sj-002",
    name: "Cadenas Medianas LATAM",
    status: "active",
    geo: ["México", "Colombia", "Perú"],
    industry: ["Hospitality", "Resorts"],
    keywords: ["cadena hotelera", "grupo hotelero", "resort todo incluido"],
    targetRoles: ["CEO", "CMO", "Director de Ventas"],
    dailyLimit: 30,
    schedule: "Diario - 10:00 CST",
    totalDiscovered: 93,
    totalQualified: 61,
    lastRunAt: "2026-02-23T10:00:00Z",
    nextRunAt: "2026-02-24T10:00:00Z",
    createdAt: "2026-01-20T10:00:00Z",
    sources: ["Google Search", "Directorios sectoriales"],
  },
  {
    id: "sj-003",
    name: "Hoteles Portugal & Algarve",
    status: "paused",
    geo: ["Portugal"],
    industry: ["Hospitality"],
    keywords: ["hotel algarve", "hotel lisboa", "pousada"],
    targetRoles: ["Diretor Geral", "Revenue Manager"],
    dailyLimit: 25,
    schedule: "Lun-Vie - 08:00 WET",
    totalDiscovered: 45,
    totalQualified: 28,
    lastRunAt: "2026-02-20T08:00:00Z",
    nextRunAt: null,
    createdAt: "2026-02-01T10:00:00Z",
    sources: ["Google Search", "Turismo de Portugal"],
  },
  {
    id: "sj-004",
    name: "Resorts Caribe",
    status: "draft",
    geo: ["República Dominicana", "Cuba", "Jamaica"],
    industry: ["Resorts", "All-Inclusive"],
    keywords: ["resort caribe", "all inclusive", "beach resort"],
    targetRoles: ["General Manager", "Director of Sales"],
    dailyLimit: 20,
    schedule: "Sin programar",
    totalDiscovered: 0,
    totalQualified: 0,
    lastRunAt: null,
    nextRunAt: null,
    createdAt: "2026-02-22T14:00:00Z",
    sources: ["Google Search"],
  },
];

export const leads: Lead[] = [
  {
    id: "lead-001",
    email: "carlos.martinez@granhotelbarcelona.com",
    name: "Carlos Martínez",
    title: "Director General",
    company: "Gran Hotel Barcelona",
    domain: "granhotelbarcelona.com",
    phone: "+34 934 123 456",
    country: "España",
    city: "Barcelona",
    industry: "Hospitality",
    website: "https://granhotelbarcelona.com",
    employeeCount: 120,
    status: "synced",
    score: 92,
    icpScore: 95,
    completenessScore: 90,
    signalScore: 88,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.95,
    lastEnrichedAt: "2026-02-10T14:30:00Z",
    sourceUrls: ["https://granhotelbarcelona.com/equipo", "https://linkedin.com/in/carlosmartinez"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: "seq-001",
    sequenceStep: 4,
    zohoCrmSynced: true,
    zohoLeadId: "ZL-4829103",
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-18T09:15:00Z",
    updatedAt: "2026-02-20T11:00:00Z",
  },
  {
    id: "lead-002",
    email: "ana.lopez@hotelartemadrid.es",
    name: "Ana López Ruiz",
    title: "Revenue Manager",
    company: "Hotel Arte Madrid",
    domain: "hotelartemadrid.es",
    phone: "+34 912 345 678",
    country: "España",
    city: "Madrid",
    industry: "Hospitality",
    website: "https://hotelartemadrid.es",
    employeeCount: 85,
    status: "engaged",
    score: 87,
    icpScore: 88,
    completenessScore: 92,
    signalScore: 80,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.92,
    lastEnrichedAt: "2026-02-08T10:00:00Z",
    sourceUrls: ["https://hotelartemadrid.es/nosotros"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: "seq-001",
    sequenceStep: 2,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-20T11:30:00Z",
    updatedAt: "2026-02-18T09:00:00Z",
  },
  {
    id: "lead-003",
    email: "javier.ruiz@boutiquevalencia.com",
    name: "Javier Ruiz Sánchez",
    title: "Director Comercial",
    company: "Boutique Hotel Valencia",
    domain: "boutiquevalencia.com",
    phone: "+34 963 456 789",
    country: "España",
    city: "Valencia",
    industry: "Hospitality",
    website: "https://boutiquevalencia.com",
    employeeCount: 45,
    status: "in_sequence",
    score: 78,
    icpScore: 80,
    completenessScore: 85,
    signalScore: 65,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.88,
    lastEnrichedAt: "2026-02-12T16:00:00Z",
    sourceUrls: ["https://boutiquevalencia.com/contacto"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: "seq-001",
    sequenceStep: 1,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-22T08:00:00Z",
    updatedAt: "2026-02-15T14:00:00Z",
  },
  {
    id: "lead-004",
    email: "maria.garcia@playaresort.mx",
    name: "María García Hernández",
    title: "CEO",
    company: "Playa Resort Cancún",
    domain: "playaresort.mx",
    phone: "+52 998 123 4567",
    country: "México",
    city: "Cancún",
    industry: "Resorts",
    website: "https://playaresort.mx",
    employeeCount: 200,
    status: "ready_to_sync",
    score: 91,
    icpScore: 93,
    completenessScore: 88,
    signalScore: 90,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.94,
    lastEnrichedAt: "2026-02-14T12:00:00Z",
    sourceUrls: ["https://playaresort.mx/equipo", "https://linkedin.com/in/mariagarcia"],
    source: "Google Search",
    searchJobId: "sj-002",
    sequenceId: "seq-002",
    sequenceStep: 3,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: "ZA-1102",
    matchedZohoAccountName: "Playa Resort Group",
    createdAt: "2026-01-25T10:00:00Z",
    updatedAt: "2026-02-19T08:00:00Z",
  },
  {
    id: "lead-005",
    email: "roberto.silva@haciendahotel.co",
    name: "Roberto Silva Mejía",
    title: "Director de Ventas",
    company: "Hacienda Hotel Cartagena",
    domain: "haciendahotel.co",
    phone: "+57 5 678 9012",
    country: "Colombia",
    city: "Cartagena",
    industry: "Hospitality",
    website: "https://haciendahotel.co",
    employeeCount: 70,
    status: "enriched",
    score: 74,
    icpScore: 76,
    completenessScore: 80,
    signalScore: 62,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.82,
    lastEnrichedAt: "2026-02-16T11:00:00Z",
    sourceUrls: ["https://haciendahotel.co/nosotros"],
    source: "Directorios sectoriales",
    searchJobId: "sj-002",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-28T09:00:00Z",
    updatedAt: "2026-02-16T11:00:00Z",
  },
  {
    id: "lead-006",
    email: "pedro.fernandes@algarveresort.pt",
    name: "Pedro Fernandes",
    title: "Diretor Geral",
    company: "Algarve Beach Resort",
    domain: "algarveresort.pt",
    phone: "+351 289 123 456",
    country: "Portugal",
    city: "Faro",
    industry: "Resorts",
    website: "https://algarveresort.pt",
    employeeCount: 150,
    status: "qualified",
    score: 81,
    icpScore: 85,
    completenessScore: 78,
    signalScore: 76,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.70,
    lastEnrichedAt: null,
    sourceUrls: ["https://algarveresort.pt/equipa"],
    source: "Turismo de Portugal",
    searchJobId: "sj-003",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-05T10:00:00Z",
    updatedAt: "2026-02-05T10:00:00Z",
  },
  {
    id: "lead-007",
    email: "laura.mendez@sierrahotel.mx",
    name: "Laura Méndez",
    title: "CMO",
    company: "Sierra Hotel & Spa",
    domain: "sierrahotel.mx",
    phone: "+52 55 1234 5678",
    country: "México",
    city: "Ciudad de México",
    industry: "Hospitality",
    website: "https://sierrahotel.mx",
    employeeCount: 95,
    status: "excluded",
    score: 68,
    icpScore: 72,
    completenessScore: 75,
    signalScore: 55,
    excluded: true,
    exclusionReason: "Cliente actual en Zoho CRM",
    exclusionSource: "zoho",
    exclusionTimestamp: "2026-02-10T15:30:00Z",
    enrichmentConfidence: 0.85,
    lastEnrichedAt: "2026-02-09T10:00:00Z",
    sourceUrls: ["https://sierrahotel.mx/equipo"],
    source: "Google Search",
    searchJobId: "sj-002",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: "ZA-0892",
    matchedZohoAccountName: "Sierra Hotel & Spa",
    createdAt: "2026-01-30T08:00:00Z",
    updatedAt: "2026-02-10T15:30:00Z",
  },
  {
    id: "lead-008",
    email: "isabel.torres@palaciohoteles.es",
    name: "Isabel Torres",
    title: "Directora de Marketing",
    company: "Palacio Hoteles",
    domain: "palaciohoteles.es",
    phone: "+34 954 789 012",
    country: "España",
    city: "Sevilla",
    industry: "Hospitality",
    website: "https://palaciohoteles.es",
    employeeCount: 180,
    status: "synced",
    score: 89,
    icpScore: 91,
    completenessScore: 88,
    signalScore: 85,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.93,
    lastEnrichedAt: "2026-02-05T14:00:00Z",
    sourceUrls: ["https://palaciohoteles.es/equipo", "https://linkedin.com/in/isabeltorres"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: "seq-001",
    sequenceStep: 4,
    zohoCrmSynced: true,
    zohoLeadId: "ZL-4829205",
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-16T09:00:00Z",
    updatedAt: "2026-02-18T16:00:00Z",
  },
  {
    id: "lead-009",
    email: "diego.vargas@andinohotel.co",
    name: "Diego Vargas",
    title: "Gerente General",
    company: "Andino Hotel Bogotá",
    domain: "andinohotel.co",
    phone: "+57 1 345 6789",
    country: "Colombia",
    city: "Bogotá",
    industry: "Hospitality",
    website: "https://andinohotel.co",
    employeeCount: 60,
    status: "discovered",
    score: 45,
    icpScore: 50,
    completenessScore: 40,
    signalScore: 42,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.30,
    lastEnrichedAt: null,
    sourceUrls: ["https://andinohotel.co"],
    source: "Directorios sectoriales",
    searchJobId: "sj-002",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-22T14:00:00Z",
    updatedAt: "2026-02-22T14:00:00Z",
  },
  {
    id: "lead-010",
    email: "sofia.costa@lisboagrand.pt",
    name: "Sofia Costa",
    title: "Revenue Manager",
    company: "Lisboa Grand Hotel",
    domain: "lisboagrand.pt",
    phone: "+351 21 987 6543",
    country: "Portugal",
    city: "Lisboa",
    industry: "Hospitality",
    website: "https://lisboagrand.pt",
    employeeCount: 110,
    status: "eligible",
    score: 83,
    icpScore: 86,
    completenessScore: 82,
    signalScore: 78,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.90,
    lastEnrichedAt: "2026-02-18T09:00:00Z",
    sourceUrls: ["https://lisboagrand.pt/equipa"],
    source: "Turismo de Portugal",
    searchJobId: "sj-003",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-08T10:00:00Z",
    updatedAt: "2026-02-18T09:00:00Z",
  },
  {
    id: "lead-011",
    email: "fernando.diaz@rivieramaya.mx",
    name: "Fernando Díaz",
    title: "Director de Operaciones",
    company: "Riviera Maya Resort",
    domain: "rivieramaya.mx",
    phone: "+52 984 876 5432",
    country: "México",
    city: "Playa del Carmen",
    industry: "Resorts",
    website: "https://rivieramaya.mx",
    employeeCount: 250,
    status: "in_sequence",
    score: 86,
    icpScore: 90,
    completenessScore: 84,
    signalScore: 82,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.91,
    lastEnrichedAt: "2026-02-11T13:00:00Z",
    sourceUrls: ["https://rivieramaya.mx/equipo"],
    source: "Google Search",
    searchJobId: "sj-002",
    sequenceId: "seq-002",
    sequenceStep: 2,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-26T11:00:00Z",
    updatedAt: "2026-02-17T10:00:00Z",
  },
  {
    id: "lead-012",
    email: "elena.morales@casarural.es",
    name: "Elena Morales",
    title: "Propietaria",
    company: "Casa Rural El Encinar",
    domain: "casarural.es",
    phone: "+34 920 123 456",
    country: "España",
    city: "Ávila",
    industry: "Rural Tourism",
    website: "https://casarural.es",
    employeeCount: 8,
    status: "excluded",
    score: 25,
    icpScore: 20,
    completenessScore: 35,
    signalScore: 18,
    excluded: true,
    exclusionReason: "No cumple ICP mínimo (< 30 empleados)",
    exclusionSource: "local",
    exclusionTimestamp: "2026-02-06T10:00:00Z",
    enrichmentConfidence: 0.65,
    lastEnrichedAt: "2026-02-06T09:00:00Z",
    sourceUrls: ["https://casarural.es"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-04T08:00:00Z",
    updatedAt: "2026-02-06T10:00:00Z",
  },
  {
    id: "lead-013",
    email: "andres.ramirez@grancolombiahotel.co",
    name: "Andrés Ramírez",
    title: "Director Financiero",
    company: "Gran Colombia Hotel",
    domain: "grancolombiahotel.co",
    phone: "+57 4 567 8901",
    country: "Colombia",
    city: "Medellín",
    industry: "Hospitality",
    website: "https://grancolombiahotel.co",
    employeeCount: 90,
    status: "enriched",
    score: 72,
    icpScore: 74,
    completenessScore: 78,
    signalScore: 60,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.80,
    lastEnrichedAt: "2026-02-19T15:00:00Z",
    sourceUrls: ["https://grancolombiahotel.co/contacto"],
    source: "Directorios sectoriales",
    searchJobId: "sj-002",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-19T15:00:00Z",
  },
  {
    id: "lead-014",
    email: "patricia.navarro@costadelsol.es",
    name: "Patricia Navarro",
    title: "Directora General",
    company: "Costa del Sol Resort",
    domain: "costadelsol.es",
    phone: "+34 952 345 678",
    country: "España",
    city: "Málaga",
    industry: "Resorts",
    website: "https://costadelsol.es",
    employeeCount: 200,
    status: "engaged",
    score: 90,
    icpScore: 92,
    completenessScore: 90,
    signalScore: 86,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.96,
    lastEnrichedAt: "2026-02-07T12:00:00Z",
    sourceUrls: ["https://costadelsol.es/equipo", "https://linkedin.com/in/patricianavarro"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: "seq-001",
    sequenceStep: 3,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-19T10:00:00Z",
    updatedAt: "2026-02-20T14:00:00Z",
  },
  {
    id: "lead-015",
    email: "miguel.santos@portopalace.pt",
    name: "Miguel Santos",
    title: "Diretor Comercial",
    company: "Porto Palace Hotel",
    domain: "portopalace.pt",
    phone: "+351 22 345 6789",
    country: "Portugal",
    city: "Porto",
    industry: "Hospitality",
    website: "https://portopalace.pt",
    employeeCount: 75,
    status: "discovered",
    score: 52,
    icpScore: 58,
    completenessScore: 48,
    signalScore: 45,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.35,
    lastEnrichedAt: null,
    sourceUrls: ["https://portopalace.pt"],
    source: "Turismo de Portugal",
    searchJobId: "sj-003",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-21T08:00:00Z",
    updatedAt: "2026-02-21T08:00:00Z",
  },
  {
    id: "lead-016",
    email: "lucia.herrera@meridianhotel.mx",
    name: "Lucía Herrera",
    title: "Gerente de Marketing",
    company: "Meridian Hotel Guadalajara",
    domain: "meridianhotel.mx",
    phone: "+52 33 9876 5432",
    country: "México",
    city: "Guadalajara",
    industry: "Hospitality",
    website: "https://meridianhotel.mx",
    employeeCount: 65,
    status: "qualified",
    score: 69,
    icpScore: 70,
    completenessScore: 72,
    signalScore: 63,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.55,
    lastEnrichedAt: null,
    sourceUrls: ["https://meridianhotel.mx/nosotros"],
    source: "Google Search",
    searchJobId: "sj-002",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-15T11:00:00Z",
    updatedAt: "2026-02-17T09:00:00Z",
  },
  {
    id: "lead-017",
    email: "ricardo.perez@exclusiveresort.es",
    name: "Ricardo Pérez",
    title: "Director de Revenue",
    company: "Exclusive Resort Ibiza",
    domain: "exclusiveresort.es",
    phone: "+34 971 234 567",
    country: "España",
    city: "Ibiza",
    industry: "Resorts",
    website: "https://exclusiveresort.es",
    employeeCount: 130,
    status: "ready_to_sync",
    score: 88,
    icpScore: 90,
    completenessScore: 86,
    signalScore: 85,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.92,
    lastEnrichedAt: "2026-02-13T10:00:00Z",
    sourceUrls: ["https://exclusiveresort.es/team"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: "seq-001",
    sequenceStep: 4,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-21T09:00:00Z",
    updatedAt: "2026-02-21T12:00:00Z",
  },
  {
    id: "lead-018",
    email: "carmen.vega@hotelplaza.es",
    name: "Carmen Vega",
    title: "Subdirectora",
    company: "Hotel Plaza Bilbao",
    domain: "hotelplaza.es",
    phone: "+34 944 567 890",
    country: "España",
    city: "Bilbao",
    industry: "Hospitality",
    website: "https://hotelplaza.es",
    employeeCount: 55,
    status: "archived",
    score: 40,
    icpScore: 45,
    completenessScore: 42,
    signalScore: 30,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.60,
    lastEnrichedAt: "2026-01-30T10:00:00Z",
    sourceUrls: ["https://hotelplaza.es"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-25T08:00:00Z",
    updatedAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "lead-019",
    email: "alejandro.cruz@paradiseresort.mx",
    name: "Alejandro Cruz",
    title: "Director General",
    company: "Paradise Resort Los Cabos",
    domain: "paradiseresort.mx",
    phone: "+52 624 123 4567",
    country: "México",
    city: "Los Cabos",
    industry: "Resorts",
    website: "https://paradiseresort.mx",
    employeeCount: 180,
    status: "in_sequence",
    score: 84,
    icpScore: 87,
    completenessScore: 82,
    signalScore: 80,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.89,
    lastEnrichedAt: "2026-02-12T11:00:00Z",
    sourceUrls: ["https://paradiseresort.mx/equipo"],
    source: "Google Search",
    searchJobId: "sj-002",
    sequenceId: "seq-002",
    sequenceStep: 1,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-28T10:00:00Z",
    updatedAt: "2026-02-16T09:00:00Z",
  },
  {
    id: "lead-020",
    email: "beatriz.almeida@cascaishotel.pt",
    name: "Beatriz Almeida",
    title: "Diretora de Marketing",
    company: "Cascais Boutique Hotel",
    domain: "cascaishotel.pt",
    phone: "+351 21 456 7890",
    country: "Portugal",
    city: "Cascais",
    industry: "Hospitality",
    website: "https://cascaishotel.pt",
    employeeCount: 40,
    status: "excluded",
    score: 55,
    icpScore: 58,
    completenessScore: 60,
    signalScore: 44,
    excluded: true,
    exclusionReason: "Do Not Contact - Zoho CRM",
    exclusionSource: "zoho",
    exclusionTimestamp: "2026-02-12T14:00:00Z",
    enrichmentConfidence: 0.75,
    lastEnrichedAt: "2026-02-11T09:00:00Z",
    sourceUrls: ["https://cascaishotel.pt/equipa"],
    source: "Turismo de Portugal",
    searchJobId: "sj-003",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: "ZA-0445",
    matchedZohoAccountName: "Cascais Boutique Hotel",
    createdAt: "2026-02-06T10:00:00Z",
    updatedAt: "2026-02-12T14:00:00Z",
  },
  {
    id: "lead-021",
    email: "pablo.martin@urbanhotel.es",
    name: "Pablo Martín",
    title: "Director de Expansión",
    company: "Urban Hotel Collection",
    domain: "urbanhotel.es",
    phone: "+34 915 678 901",
    country: "España",
    city: "Madrid",
    industry: "Hospitality",
    website: "https://urbanhotel.es",
    employeeCount: 320,
    status: "synced",
    score: 95,
    icpScore: 97,
    completenessScore: 94,
    signalScore: 92,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.98,
    lastEnrichedAt: "2026-02-03T10:00:00Z",
    sourceUrls: ["https://urbanhotel.es/equipo", "https://linkedin.com/in/pablomartin"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: "seq-001",
    sequenceStep: 4,
    zohoCrmSynced: true,
    zohoLeadId: "ZL-4829310",
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-02-22T11:00:00Z",
  },
  {
    id: "lead-022",
    email: "valentina.rios@ecohotel.co",
    name: "Valentina Ríos",
    title: "Directora de Sostenibilidad",
    company: "Eco Hotel Santa Marta",
    domain: "ecohotel.co",
    phone: "+57 5 234 5678",
    country: "Colombia",
    city: "Santa Marta",
    industry: "Eco Tourism",
    website: "https://ecohotel.co",
    employeeCount: 35,
    status: "discovered",
    score: 48,
    icpScore: 50,
    completenessScore: 45,
    signalScore: 46,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.28,
    lastEnrichedAt: null,
    sourceUrls: ["https://ecohotel.co"],
    source: "Directorios sectoriales",
    searchJobId: "sj-002",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-23T08:00:00Z",
    updatedAt: "2026-02-23T08:00:00Z",
  },
  {
    id: "lead-023",
    email: "marcos.oliveira@dourohotel.pt",
    name: "Marcos Oliveira",
    title: "Gerente",
    company: "Douro Valley Hotel",
    domain: "dourohotel.pt",
    phone: "+351 254 321 654",
    country: "Portugal",
    city: "Peso da Régua",
    industry: "Wine Tourism",
    website: "https://dourohotel.pt",
    employeeCount: 50,
    status: "qualified",
    score: 65,
    icpScore: 68,
    completenessScore: 65,
    signalScore: 58,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.50,
    lastEnrichedAt: null,
    sourceUrls: ["https://dourohotel.pt"],
    source: "Turismo de Portugal",
    searchJobId: "sj-003",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-19T10:00:00Z",
    updatedAt: "2026-02-20T09:00:00Z",
  },
  {
    id: "lead-024",
    email: "daniela.fuentes@centrohotel.mx",
    name: "Daniela Fuentes",
    title: "Revenue Manager",
    company: "Centro Histórico Hotel",
    domain: "centrohotel.mx",
    phone: "+52 55 5678 1234",
    country: "México",
    city: "Ciudad de México",
    industry: "Hospitality",
    website: "https://centrohotel.mx",
    employeeCount: 80,
    status: "eligible",
    score: 77,
    icpScore: 79,
    completenessScore: 80,
    signalScore: 70,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.87,
    lastEnrichedAt: "2026-02-20T14:00:00Z",
    sourceUrls: ["https://centrohotel.mx/nosotros"],
    source: "Google Search",
    searchJobId: "sj-002",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-12T10:00:00Z",
    updatedAt: "2026-02-20T14:00:00Z",
  },
  {
    id: "lead-025",
    email: "ramon.castillo@hotelcolonial.es",
    name: "Ramón Castillo",
    title: "Director General",
    company: "Hotel Colonial Granada",
    domain: "hotelcolonial.es",
    phone: "+34 958 234 567",
    country: "España",
    city: "Granada",
    industry: "Hospitality",
    website: "https://hotelcolonial.es",
    employeeCount: 70,
    status: "enriched",
    score: 76,
    icpScore: 78,
    completenessScore: 76,
    signalScore: 72,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.84,
    lastEnrichedAt: "2026-02-21T10:00:00Z",
    sourceUrls: ["https://hotelcolonial.es/equipo"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-14T08:00:00Z",
    updatedAt: "2026-02-21T10:00:00Z",
  },
  {
    id: "lead-026",
    email: "natalia.gomez@pacificohotel.co",
    name: "Natalia Gómez",
    title: "Directora Comercial",
    company: "Pacífico Hotel & Spa",
    domain: "pacificohotel.co",
    phone: "+57 2 890 1234",
    country: "Colombia",
    city: "Cali",
    industry: "Hospitality",
    website: "https://pacificohotel.co",
    employeeCount: 55,
    status: "in_sequence",
    score: 71,
    icpScore: 73,
    completenessScore: 74,
    signalScore: 64,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.81,
    lastEnrichedAt: "2026-02-15T12:00:00Z",
    sourceUrls: ["https://pacificohotel.co/contacto"],
    source: "Directorios sectoriales",
    searchJobId: "sj-002",
    sequenceId: "seq-002",
    sequenceStep: 1,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-08T09:00:00Z",
    updatedAt: "2026-02-17T11:00:00Z",
  },
  {
    id: "lead-027",
    email: "gonzalo.munoz@hotelcapital.es",
    name: "Gonzalo Muñoz",
    title: "CEO",
    company: "Hotel Capital Madrid",
    domain: "hotelcapital.es",
    phone: "+34 913 456 789",
    country: "España",
    city: "Madrid",
    industry: "Hospitality",
    website: "https://hotelcapital.es",
    employeeCount: 160,
    status: "engaged",
    score: 85,
    icpScore: 88,
    completenessScore: 84,
    signalScore: 80,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.90,
    lastEnrichedAt: "2026-02-09T14:00:00Z",
    sourceUrls: ["https://hotelcapital.es/equipo"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: "seq-001",
    sequenceStep: 2,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-01-23T10:00:00Z",
    updatedAt: "2026-02-19T16:00:00Z",
  },
  {
    id: "lead-028",
    email: "adriana.blanco@mayaresort.mx",
    name: "Adriana Blanco",
    title: "Directora de Hospitalidad",
    company: "Maya Resort Tulum",
    domain: "mayaresort.mx",
    phone: "+52 984 234 5678",
    country: "México",
    city: "Tulum",
    industry: "Resorts",
    website: "https://mayaresort.mx",
    employeeCount: 140,
    status: "enriched",
    score: 79,
    icpScore: 82,
    completenessScore: 78,
    signalScore: 74,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.86,
    lastEnrichedAt: "2026-02-22T09:00:00Z",
    sourceUrls: ["https://mayaresort.mx/equipo"],
    source: "Google Search",
    searchJobId: "sj-002",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-13T10:00:00Z",
    updatedAt: "2026-02-22T09:00:00Z",
  },
  {
    id: "lead-029",
    email: "hugo.ferreira@sintrapalace.pt",
    name: "Hugo Ferreira",
    title: "Diretor Financeiro",
    company: "Sintra Palace Hotel",
    domain: "sintrapalace.pt",
    phone: "+351 21 234 5678",
    country: "Portugal",
    city: "Sintra",
    industry: "Hospitality",
    website: "https://sintrapalace.pt",
    employeeCount: 65,
    status: "discovered",
    score: 50,
    icpScore: 55,
    completenessScore: 45,
    signalScore: 47,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.32,
    lastEnrichedAt: null,
    sourceUrls: ["https://sintrapalace.pt"],
    source: "Turismo de Portugal",
    searchJobId: "sj-003",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-22T11:00:00Z",
    updatedAt: "2026-02-22T11:00:00Z",
  },
  {
    id: "lead-030",
    email: "silvia.romero@azulhotel.es",
    name: "Silvia Romero",
    title: "Directora de Operaciones",
    company: "Azul Hotel Marbella",
    domain: "azulhotel.es",
    phone: "+34 952 876 543",
    country: "España",
    city: "Marbella",
    industry: "Resorts",
    website: "https://azulhotel.es",
    employeeCount: 110,
    status: "eligible",
    score: 80,
    icpScore: 83,
    completenessScore: 80,
    signalScore: 75,
    excluded: false,
    exclusionReason: null,
    exclusionSource: null,
    exclusionTimestamp: null,
    enrichmentConfidence: 0.88,
    lastEnrichedAt: "2026-02-19T10:00:00Z",
    sourceUrls: ["https://azulhotel.es/equipo"],
    source: "Google Search",
    searchJobId: "sj-001",
    sequenceId: null,
    sequenceStep: null,
    zohoCrmSynced: false,
    zohoLeadId: null,
    matchedZohoAccountId: null,
    matchedZohoAccountName: null,
    createdAt: "2026-02-11T08:00:00Z",
    updatedAt: "2026-02-19T10:00:00Z",
  },
];

export const sequences: Sequence[] = [
  {
    id: "seq-001",
    name: "Outreach Hoteles España",
    status: "active",
    steps: [
      {
        id: "step-001-1",
        order: 1,
        type: "email",
        delayDays: 0,
        subject: "Incrementa la fidelización de tus huéspedes con {empresa}",
        body: "Hola {nombre},\n\nSoy del equipo de Fideltour y ayudamos a hoteles como {empresa} a incrementar sus reservas directas y fidelización de huéspedes.\n\nHe visto que {empresa} tiene una presencia sólida en {ciudad} y creo que podríamos ayudaros a maximizar el valor de cada huésped.\n\n¿Te interesaría una demo de 15 minutos?\n\nSaludos",
        sent: 45,
        opened: 32,
        replied: 8,
        bounced: 2,
      },
      {
        id: "step-001-2",
        order: 2,
        type: "follow_up",
        delayDays: 3,
        subject: "Re: Incrementa la fidelización de tus huéspedes con {empresa}",
        body: "Hola {nombre},\n\nQuería hacer seguimiento de mi email anterior. Hoteles similares a {empresa} han logrado aumentar un 23% sus reservas directas con nuestra plataforma.\n\n¿Tienes 15 minutos esta semana?\n\nSaludos",
        sent: 35,
        opened: 22,
        replied: 5,
        bounced: 1,
      },
      {
        id: "step-001-3",
        order: 3,
        type: "follow_up",
        delayDays: 5,
        subject: "Caso de éxito en tu zona - {empresa}",
        body: "Hola {nombre},\n\nTe comparto un caso de éxito de un hotel en {ciudad} que incrementó su revenue un 18% con nuestro programa de fidelización.\n\n¿Te gustaría ver cómo aplicarlo en {empresa}?\n\nQuedo atento,\nSaludos",
        sent: 28,
        opened: 18,
        replied: 4,
        bounced: 0,
      },
      {
        id: "step-001-4",
        order: 4,
        type: "breakup",
        delayDays: 7,
        subject: "Última oportunidad - {empresa}",
        body: "Hola {nombre},\n\nEntiendo que ahora puede no ser el momento. Te dejo la puerta abierta por si en el futuro {empresa} quiere explorar cómo maximizar la fidelización de huéspedes.\n\nNo volveré a molestarte. Si cambias de opinión, aquí estaré.\n\nSaludos",
        sent: 20,
        opened: 12,
        replied: 2,
        bounced: 0,
      },
    ],
    enrolledCount: 14,
    totalSent: 128,
    totalOpened: 84,
    totalReplied: 19,
    totalBounced: 3,
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "seq-002",
    name: "Outreach Resorts LATAM",
    status: "active",
    steps: [
      {
        id: "step-002-1",
        order: 1,
        type: "email",
        delayDays: 0,
        subject: "Fidelización para resorts: más reservas directas en {empresa}",
        body: "Hola {nombre},\n\nEn Fideltour trabajamos con resorts en toda Latinoamérica para aumentar reservas directas y reducir dependencia de OTAs.\n\n{empresa} en {ciudad} tiene un gran potencial. ¿Te gustaría ver cómo lo hacemos?\n\nSaludos",
        sent: 28,
        opened: 19,
        replied: 5,
        bounced: 1,
      },
      {
        id: "step-002-2",
        order: 2,
        type: "follow_up",
        delayDays: 4,
        subject: "Re: Fidelización para resorts - {empresa}",
        body: "Hola {nombre},\n\nSeguimiento rápido. Resorts como {empresa} suelen depender demasiado de las OTAs. Con Fideltour hemos ayudado a reducir esa dependencia hasta un 30%.\n\n¿Agenda una llamada de 15 min?\n\nSaludos",
        sent: 22,
        opened: 14,
        replied: 3,
        bounced: 0,
      },
      {
        id: "step-002-3",
        order: 3,
        type: "follow_up",
        delayDays: 5,
        subject: "ROI real para {empresa}",
        body: "Hola {nombre},\n\nTe comparto números reales: un resort de tamaño similar al tuyo generó $45K adicionales en reservas directas en 6 meses.\n\n¿Te interesa saber cómo?\n\nSaludos",
        sent: 16,
        opened: 10,
        replied: 2,
        bounced: 0,
      },
      {
        id: "step-002-4",
        order: 4,
        type: "breakup",
        delayDays: 7,
        subject: "Cerrando el ciclo - {empresa}",
        body: "Hola {nombre},\n\nNo quiero ser insistente. Si en algún momento {empresa} quiere explorar la fidelización de huéspedes, aquí estaré.\n\n¡Mucho éxito!\n\nSaludos",
        sent: 10,
        opened: 6,
        replied: 1,
        bounced: 0,
      },
    ],
    enrolledCount: 8,
    totalSent: 76,
    totalOpened: 49,
    totalReplied: 11,
    totalBounced: 1,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "seq-003",
    name: "Re-engagement Inactivos",
    status: "draft",
    steps: [
      {
        id: "step-003-1",
        order: 1,
        type: "email",
        delayDays: 0,
        subject: "Novedades en Fideltour para {empresa}",
        body: "Hola {nombre},\n\nHace un tiempo hablamos sobre cómo Fideltour podría ayudar a {empresa}. Hemos lanzado nuevas funcionalidades que creo te interesarán.\n\n¿Tienes un momento para una actualización rápida?\n\nSaludos",
        sent: 0,
        opened: 0,
        replied: 0,
        bounced: 0,
      },
      {
        id: "step-003-2",
        order: 2,
        type: "follow_up",
        delayDays: 5,
        subject: "Re: Novedades en Fideltour",
        body: "Hola {nombre},\n\nSolo quería asegurarme de que vieras mi email anterior. Las nuevas funcionalidades están diseñadas especialmente para hoteles como {empresa}.\n\nSaludos",
        sent: 0,
        opened: 0,
        replied: 0,
        bounced: 0,
      },
      {
        id: "step-003-3",
        order: 3,
        type: "breakup",
        delayDays: 7,
        subject: "Último contacto - {empresa}",
        body: "Hola {nombre},\n\nEntiendo que los tiempos no siempre coinciden. Te deseo lo mejor con {empresa} y quedo a disposición.\n\nSaludos",
        sent: 0,
        opened: 0,
        replied: 0,
        bounced: 0,
      },
    ],
    enrolledCount: 0,
    totalSent: 0,
    totalOpened: 0,
    totalReplied: 0,
    totalBounced: 0,
    createdAt: "2026-02-20T10:00:00Z",
  },
];

export const enrichmentAttempts: EnrichmentAttempt[] = [
  { id: "ea-001", leadId: "lead-001", provider: "Clearbit", status: "success", confidence: 0.95, fieldsFound: ["email", "title", "company", "phone", "linkedin"], timestamp: "2026-02-08T10:00:00Z", payload: { source: "clearbit", matchType: "domain" } },
  { id: "ea-002", leadId: "lead-001", provider: "Hunter.io", status: "success", confidence: 0.90, fieldsFound: ["email", "title"], timestamp: "2026-02-08T10:05:00Z", payload: { source: "hunter", matchType: "email_pattern" } },
  { id: "ea-003", leadId: "lead-002", provider: "Clearbit", status: "success", confidence: 0.92, fieldsFound: ["email", "title", "company", "phone"], timestamp: "2026-02-06T14:00:00Z", payload: { source: "clearbit", matchType: "domain" } },
  { id: "ea-004", leadId: "lead-002", provider: "ZoomInfo", status: "partial", confidence: 0.78, fieldsFound: ["email", "company"], timestamp: "2026-02-06T14:05:00Z", payload: { source: "zoominfo", matchType: "company_search" } },
  { id: "ea-005", leadId: "lead-003", provider: "Hunter.io", status: "success", confidence: 0.88, fieldsFound: ["email", "title", "company"], timestamp: "2026-02-10T09:00:00Z", payload: { source: "hunter", matchType: "email_pattern" } },
  { id: "ea-006", leadId: "lead-004", provider: "Clearbit", status: "success", confidence: 0.94, fieldsFound: ["email", "title", "company", "phone", "linkedin"], timestamp: "2026-02-12T11:00:00Z", payload: { source: "clearbit", matchType: "domain" } },
  { id: "ea-007", leadId: "lead-005", provider: "Hunter.io", status: "partial", confidence: 0.72, fieldsFound: ["email", "company"], timestamp: "2026-02-14T10:00:00Z", payload: { source: "hunter", matchType: "guess" } },
  { id: "ea-008", leadId: "lead-005", provider: "Snov.io", status: "success", confidence: 0.82, fieldsFound: ["email", "title", "phone"], timestamp: "2026-02-14T10:10:00Z", payload: { source: "snov", matchType: "domain_search" } },
  { id: "ea-009", leadId: "lead-006", provider: "Hunter.io", status: "failed", confidence: 0, fieldsFound: [], timestamp: "2026-02-05T11:00:00Z", payload: { source: "hunter", error: "domain_not_found" } },
  { id: "ea-010", leadId: "lead-007", provider: "Clearbit", status: "success", confidence: 0.85, fieldsFound: ["email", "title", "company"], timestamp: "2026-02-08T10:00:00Z", payload: { source: "clearbit", matchType: "domain" } },
  { id: "ea-011", leadId: "lead-008", provider: "Clearbit", status: "success", confidence: 0.93, fieldsFound: ["email", "title", "company", "phone", "linkedin"], timestamp: "2026-02-04T09:00:00Z", payload: { source: "clearbit", matchType: "domain" } },
  { id: "ea-012", leadId: "lead-010", provider: "Hunter.io", status: "success", confidence: 0.90, fieldsFound: ["email", "title", "company", "phone"], timestamp: "2026-02-16T10:00:00Z", payload: { source: "hunter", matchType: "email_pattern" } },
  { id: "ea-013", leadId: "lead-011", provider: "Clearbit", status: "success", confidence: 0.91, fieldsFound: ["email", "title", "company", "phone"], timestamp: "2026-02-09T14:00:00Z", payload: { source: "clearbit", matchType: "domain" } },
  { id: "ea-014", leadId: "lead-014", provider: "Clearbit", status: "success", confidence: 0.96, fieldsFound: ["email", "title", "company", "phone", "linkedin"], timestamp: "2026-02-05T11:00:00Z", payload: { source: "clearbit", matchType: "domain" } },
  { id: "ea-015", leadId: "lead-017", provider: "Hunter.io", status: "success", confidence: 0.92, fieldsFound: ["email", "title", "company"], timestamp: "2026-02-11T10:00:00Z", payload: { source: "hunter", matchType: "email_pattern" } },
];

export const eventLogs: EventLog[] = [
  { id: "ev-001", leadId: "lead-001", type: "discovered", description: "Lead descubierto vía Google Search", metadata: { searchJobId: "sj-001", source: "Google Search" }, timestamp: "2026-01-18T09:15:00Z" },
  { id: "ev-002", leadId: "lead-001", type: "qualified", description: "Lead cualificado - ICP score 95", metadata: { icpScore: "95" }, timestamp: "2026-01-20T10:00:00Z" },
  { id: "ev-003", leadId: "lead-001", type: "enriched", description: "Enriquecido vía Clearbit + Hunter.io", metadata: { providers: "Clearbit, Hunter.io", confidence: "0.95" }, timestamp: "2026-02-08T10:05:00Z" },
  { id: "ev-004", leadId: "lead-001", type: "exclusion_check", description: "Verificación de exclusión superada", metadata: { checks: "6/6 passed" }, timestamp: "2026-02-09T08:00:00Z" },
  { id: "ev-005", leadId: "lead-001", type: "enrolled", description: "Inscrito en secuencia 'Outreach Hoteles España'", metadata: { sequenceId: "seq-001" }, timestamp: "2026-02-09T09:00:00Z" },
  { id: "ev-006", leadId: "lead-001", type: "email_sent", description: "Email 1 enviado: 'Incrementa la fidelización...'", metadata: { step: "1", sequenceId: "seq-001" }, timestamp: "2026-02-09T09:30:00Z" },
  { id: "ev-007", leadId: "lead-001", type: "email_opened", description: "Email 1 abierto", metadata: { step: "1" }, timestamp: "2026-02-09T14:20:00Z" },
  { id: "ev-008", leadId: "lead-001", type: "email_sent", description: "Follow-up 1 enviado", metadata: { step: "2", sequenceId: "seq-001" }, timestamp: "2026-02-12T09:30:00Z" },
  { id: "ev-009", leadId: "lead-001", type: "email_opened", description: "Follow-up 1 abierto", metadata: { step: "2" }, timestamp: "2026-02-12T16:10:00Z" },
  { id: "ev-010", leadId: "lead-001", type: "email_replied", description: "Respuesta recibida al Follow-up 1", metadata: { step: "2" }, timestamp: "2026-02-13T10:45:00Z" },
  { id: "ev-011", leadId: "lead-001", type: "ready_to_sync", description: "Lead marcado como listo para sincronizar", metadata: {}, timestamp: "2026-02-15T08:00:00Z" },
  { id: "ev-012", leadId: "lead-001", type: "synced", description: "Sincronizado con Zoho CRM como Lead ZL-4829103", metadata: { zohoLeadId: "ZL-4829103" }, timestamp: "2026-02-15T08:30:00Z" },
  { id: "ev-013", leadId: "lead-002", type: "discovered", description: "Lead descubierto vía Google Search", metadata: { searchJobId: "sj-001", source: "Google Search" }, timestamp: "2026-01-20T11:30:00Z" },
  { id: "ev-014", leadId: "lead-002", type: "enriched", description: "Enriquecido vía Clearbit", metadata: { providers: "Clearbit", confidence: "0.92" }, timestamp: "2026-02-06T14:00:00Z" },
  { id: "ev-015", leadId: "lead-002", type: "enrolled", description: "Inscrito en secuencia 'Outreach Hoteles España'", metadata: { sequenceId: "seq-001" }, timestamp: "2026-02-10T09:00:00Z" },
  { id: "ev-016", leadId: "lead-002", type: "email_sent", description: "Email 1 enviado", metadata: { step: "1" }, timestamp: "2026-02-10T09:30:00Z" },
  { id: "ev-017", leadId: "lead-002", type: "email_opened", description: "Email 1 abierto", metadata: { step: "1" }, timestamp: "2026-02-10T15:00:00Z" },
  { id: "ev-018", leadId: "lead-002", type: "email_replied", description: "Respuesta recibida", metadata: { step: "1" }, timestamp: "2026-02-11T09:20:00Z" },
  { id: "ev-019", leadId: "lead-004", type: "discovered", description: "Lead descubierto vía Google Search", metadata: { searchJobId: "sj-002", source: "Google Search" }, timestamp: "2026-01-25T10:00:00Z" },
  { id: "ev-020", leadId: "lead-004", type: "enriched", description: "Enriquecido vía Clearbit", metadata: { providers: "Clearbit", confidence: "0.94" }, timestamp: "2026-02-12T11:00:00Z" },
  { id: "ev-021", leadId: "lead-004", type: "enrolled", description: "Inscrito en secuencia 'Outreach Resorts LATAM'", metadata: { sequenceId: "seq-002" }, timestamp: "2026-02-14T09:00:00Z" },
  { id: "ev-022", leadId: "lead-004", type: "email_sent", description: "Email 1 enviado", metadata: { step: "1" }, timestamp: "2026-02-14T09:30:00Z" },
  { id: "ev-023", leadId: "lead-004", type: "email_replied", description: "Respuesta positiva recibida", metadata: { step: "1" }, timestamp: "2026-02-15T11:00:00Z" },
  { id: "ev-024", leadId: "lead-004", type: "ready_to_sync", description: "Lead marcado como listo para sincronizar", metadata: {}, timestamp: "2026-02-19T08:00:00Z" },
  { id: "ev-025", leadId: "lead-007", type: "discovered", description: "Lead descubierto vía Google Search", metadata: { searchJobId: "sj-002", source: "Google Search" }, timestamp: "2026-01-30T08:00:00Z" },
  { id: "ev-026", leadId: "lead-007", type: "enriched", description: "Enriquecido vía Clearbit", metadata: { providers: "Clearbit", confidence: "0.85" }, timestamp: "2026-02-08T10:00:00Z" },
  { id: "ev-027", leadId: "lead-007", type: "exclusion_check", description: "Excluido: Cliente actual en Zoho CRM", metadata: { reason: "Cliente actual en Zoho CRM", source: "zoho" }, timestamp: "2026-02-10T15:30:00Z" },
  { id: "ev-028", leadId: "lead-007", type: "excluded", description: "Lead excluido del pipeline", metadata: { reason: "zoho_client" }, timestamp: "2026-02-10T15:30:00Z" },
  { id: "ev-029", leadId: "lead-012", type: "discovered", description: "Lead descubierto vía Google Search", metadata: { searchJobId: "sj-001" }, timestamp: "2026-02-04T08:00:00Z" },
  { id: "ev-030", leadId: "lead-012", type: "excluded", description: "Excluido: No cumple ICP mínimo", metadata: { reason: "icp_too_low", icpScore: "20" }, timestamp: "2026-02-06T10:00:00Z" },
  { id: "ev-031", leadId: "lead-021", type: "discovered", description: "Lead descubierto vía Google Search", metadata: { searchJobId: "sj-001" }, timestamp: "2026-01-15T09:00:00Z" },
  { id: "ev-032", leadId: "lead-021", type: "enriched", description: "Enriquecido vía Clearbit", metadata: { confidence: "0.98" }, timestamp: "2026-02-03T10:00:00Z" },
  { id: "ev-033", leadId: "lead-021", type: "enrolled", description: "Inscrito en secuencia 'Outreach Hoteles España'", metadata: { sequenceId: "seq-001" }, timestamp: "2026-02-05T09:00:00Z" },
  { id: "ev-034", leadId: "lead-021", type: "email_replied", description: "Respuesta positiva recibida", metadata: { step: "2" }, timestamp: "2026-02-12T14:00:00Z" },
  { id: "ev-035", leadId: "lead-021", type: "synced", description: "Sincronizado con Zoho CRM como Lead ZL-4829310", metadata: { zohoLeadId: "ZL-4829310" }, timestamp: "2026-02-22T11:00:00Z" },
  { id: "ev-036", leadId: "lead-009", type: "discovered", description: "Lead descubierto vía Directorios sectoriales", metadata: { searchJobId: "sj-002" }, timestamp: "2026-02-22T14:00:00Z" },
  { id: "ev-037", leadId: "lead-022", type: "discovered", description: "Lead descubierto vía Directorios sectoriales", metadata: { searchJobId: "sj-002" }, timestamp: "2026-02-23T08:00:00Z" },
  { id: "ev-038", leadId: "lead-015", type: "discovered", description: "Lead descubierto vía Turismo de Portugal", metadata: { searchJobId: "sj-003" }, timestamp: "2026-02-21T08:00:00Z" },
  { id: "ev-039", leadId: "lead-029", type: "discovered", description: "Lead descubierto vía Turismo de Portugal", metadata: { searchJobId: "sj-003" }, timestamp: "2026-02-22T11:00:00Z" },
  { id: "ev-040", leadId: "lead-020", type: "excluded", description: "Excluido: Do Not Contact - Zoho CRM", metadata: { reason: "zoho_dnc", source: "zoho" }, timestamp: "2026-02-12T14:00:00Z" },
];

export const suppressionList: SuppressionEntry[] = [
  { id: "sup-001", type: "email", value: "info@sierrahotel.mx", reason: "Cliente actual", source: "zoho", addedAt: "2026-01-10T10:00:00Z" },
  { id: "sup-002", type: "domain", value: "sierrahotel.mx", reason: "Cuenta existente en Zoho", source: "zoho", addedAt: "2026-01-10T10:00:00Z" },
  { id: "sup-003", type: "email", value: "reservas@cascaishotel.pt", reason: "Unsubscribe", source: "campaigns", addedAt: "2026-01-15T08:00:00Z" },
  { id: "sup-004", type: "email", value: "info@hotelexistente.es", reason: "Do Not Contact", source: "manual", addedAt: "2026-01-20T10:00:00Z" },
  { id: "sup-005", type: "domain", value: "hotelexistente.es", reason: "Strategic account - managed manually", source: "manual", addedAt: "2026-01-20T10:00:00Z" },
  { id: "sup-006", type: "email", value: "bounce@invalidhotel.com", reason: "Hard bounce", source: "bounce", addedAt: "2026-02-01T12:00:00Z" },
  { id: "sup-007", type: "email", value: "director@competidor.es", reason: "Competidor", source: "manual", addedAt: "2026-02-05T10:00:00Z" },
];

export const exclusionRules: ExclusionRule[] = [
  { id: "er-001", name: "Supresión local por email", type: "local_email", enabled: true, config: {}, description: "Verificar si el email está en la lista de supresión local" },
  { id: "er-002", name: "Supresión local por dominio", type: "local_domain", enabled: true, config: {}, description: "Verificar si el dominio está en la lista de supresión local" },
  { id: "er-003", name: "Cliente actual en Zoho", type: "zoho_client", enabled: true, config: {}, description: "Verificar si el contacto pertenece a un cliente actual en Zoho CRM" },
  { id: "er-004", name: "Prospecto activo en Zoho", type: "zoho_active_prospect", enabled: true, config: { daysThreshold: 90 }, description: "Verificar si ya hay un prospecto activo en Zoho CRM" },
  { id: "er-005", name: "Do Not Contact (Zoho)", type: "zoho_dnc", enabled: true, config: {}, description: "Verificar flag de Do Not Contact en Zoho CRM" },
  { id: "er-006", name: "Unsubscribe (Campaigns)", type: "campaigns_unsub", enabled: true, config: {}, description: "Verificar si se ha dado de baja en Zoho Campaigns" },
  { id: "er-007", name: "Actividad comercial reciente", type: "recent_activity", enabled: true, config: { daysThreshold: 60 }, description: "Verificar si ha habido actividad comercial en los últimos N días" },
  { id: "er-008", name: "Cuenta estratégica", type: "strategic_flag", enabled: true, config: {}, description: "Verificar si la cuenta está marcada como estratégica/gestionada manualmente" },
];

export function getLeadExclusionChecks(lead: Lead): ExclusionCheckResult[] {
  if (lead.id === "lead-007") {
    return [
      { rule: "Supresión local por email", passed: true, reason: null, source: "local" },
      { rule: "Supresión local por dominio", passed: true, reason: null, source: "local" },
      { rule: "Cliente actual en Zoho", passed: false, reason: "Cuenta existente: Sierra Hotel & Spa (ZA-0892)", source: "zoho" },
      { rule: "Prospecto activo en Zoho", passed: true, reason: null, source: "zoho" },
      { rule: "Do Not Contact (Zoho)", passed: true, reason: null, source: "zoho" },
      { rule: "Unsubscribe (Campaigns)", passed: true, reason: null, source: "campaigns" },
      { rule: "Actividad comercial reciente", passed: true, reason: null, source: "zoho" },
      { rule: "Cuenta estratégica", passed: true, reason: null, source: "local" },
    ];
  }
  if (lead.id === "lead-012") {
    return [
      { rule: "Supresión local por email", passed: true, reason: null, source: "local" },
      { rule: "Supresión local por dominio", passed: true, reason: null, source: "local" },
      { rule: "Cliente actual en Zoho", passed: true, reason: null, source: "zoho" },
      { rule: "Prospecto activo en Zoho", passed: true, reason: null, source: "zoho" },
      { rule: "Do Not Contact (Zoho)", passed: true, reason: null, source: "zoho" },
      { rule: "Unsubscribe (Campaigns)", passed: true, reason: null, source: "campaigns" },
      { rule: "Actividad comercial reciente", passed: true, reason: null, source: "zoho" },
      { rule: "Cuenta estratégica", passed: true, reason: null, source: "local" },
    ];
  }
  if (lead.id === "lead-020") {
    return [
      { rule: "Supresión local por email", passed: true, reason: null, source: "local" },
      { rule: "Supresión local por dominio", passed: true, reason: null, source: "local" },
      { rule: "Cliente actual en Zoho", passed: true, reason: null, source: "zoho" },
      { rule: "Prospecto activo en Zoho", passed: true, reason: null, source: "zoho" },
      { rule: "Do Not Contact (Zoho)", passed: false, reason: "Flag DNC activo en registro Zoho", source: "zoho" },
      { rule: "Unsubscribe (Campaigns)", passed: true, reason: null, source: "campaigns" },
      { rule: "Actividad comercial reciente", passed: true, reason: null, source: "zoho" },
      { rule: "Cuenta estratégica", passed: true, reason: null, source: "local" },
    ];
  }
  return [
    { rule: "Supresión local por email", passed: true, reason: null, source: "local" },
    { rule: "Supresión local por dominio", passed: true, reason: null, source: "local" },
    { rule: "Cliente actual en Zoho", passed: true, reason: null, source: "zoho" },
    { rule: "Prospecto activo en Zoho", passed: true, reason: null, source: "zoho" },
    { rule: "Do Not Contact (Zoho)", passed: true, reason: null, source: "zoho" },
    { rule: "Unsubscribe (Campaigns)", passed: true, reason: null, source: "campaigns" },
    { rule: "Actividad comercial reciente", passed: true, reason: null, source: "zoho" },
    { rule: "Cuenta estratégica", passed: true, reason: null, source: "local" },
  ];
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  website: string;
  industry: string;
  country: string;
  city: string;
  employees: number;
  source: string;
  enrichmentStatus: "pending" | "enriched" | "partial" | "failed";
  contactIds: string[];
  discoveredAt: string;
}

export interface ProspectList {
  id: string;
  name: string;
  contactCount: number;
  source: "search" | "import" | "ai" | "manual";
  contactIds: string[];
  createdAt: string;
}

export interface Identity {
  id: string;
  name: string;
  email: string;
  smtpHost: string;
  smtpPort: number;
  dailyLimit: number;
  sentToday: number;
  warmupEnabled: boolean;
  warmupProgress: number;
  status: "active" | "paused" | "warming_up";
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "draft" | "completed";
  steps: CampaignStep[];
  enrolledCount: number;
  totalSent: number;
  totalOpened: number;
  totalReplied: number;
  totalBounced: number;
  identityId: string;
  listIds: string[];
  createdAt: string;
}

export interface CampaignStep {
  id: string;
  order: number;
  type: "email" | "follow_up" | "wait" | "condition" | "breakup";
  delayDays: number;
  subject: string;
  body: string;
  conditionField?: string;
  conditionYesBranch?: string;
  conditionNoBranch?: string;
  sent: number;
  opened: number;
  replied: number;
  bounced: number;
}

export interface InboxThread {
  id: string;
  leadId: string;
  leadName: string;
  leadCompany: string;
  campaignId: string;
  aiTag: "meeting_requested" | "interested" | "not_interested" | "auto_reply" | "question" | "out_of_office" | null;
  unread: boolean;
  lastMessageAt: string;
  messages: InboxMessage[];
}

export interface InboxMessage {
  id: string;
  direction: "outbound" | "inbound";
  subject: string;
  body: string;
  timestamp: string;
  aiGenerated?: boolean;
}

export interface ActivityItem {
  id: string;
  type: "discovery" | "enrichment" | "email_sent" | "email_replied" | "campaign_started" | "sync" | "exclusion" | "contact_added";
  description: string;
  leadName?: string;
  companyName?: string;
  timestamp: string;
  metadata: Record<string, string>;
}

export interface AIPlaybookData {
  companyName: string;
  website: string;
  linkedIn: string;
  industry: string;
  description: string;
  productsServices: string[];
  valuePropositions: string[];
  icpDefinition: string;
  competitors: string[];
  testimonials: { name: string; role: string; company: string; quote: string }[];
  aiVariables: { name: string; description: string; source: string }[];
}

export const companies: Company[] = [
  { id: "comp-001", name: "Gran Hotel Barcelona", domain: "granhotelbarcelona.com", website: "https://granhotelbarcelona.com", industry: "Hospitality", country: "España", city: "Barcelona", employees: 120, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-001"], discoveredAt: "2026-01-18T09:00:00Z" },
  { id: "comp-002", name: "Hotel Arte Madrid", domain: "hotelartemadrid.es", website: "https://hotelartemadrid.es", industry: "Hospitality", country: "España", city: "Madrid", employees: 85, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-002"], discoveredAt: "2026-01-20T11:00:00Z" },
  { id: "comp-003", name: "Boutique Hotel Valencia", domain: "boutiquevalencia.com", website: "https://boutiquevalencia.com", industry: "Hospitality", country: "España", city: "Valencia", employees: 45, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-003"], discoveredAt: "2026-01-22T08:00:00Z" },
  { id: "comp-004", name: "Playa Resort Cancún", domain: "playaresort.mx", website: "https://playaresort.mx", industry: "Resorts", country: "México", city: "Cancún", employees: 200, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-004"], discoveredAt: "2026-01-25T10:00:00Z" },
  { id: "comp-005", name: "Hacienda Hotel Cartagena", domain: "haciendahotel.co", website: "https://haciendahotel.co", industry: "Hospitality", country: "Colombia", city: "Cartagena", employees: 70, source: "Directorios sectoriales", enrichmentStatus: "partial", contactIds: ["lead-005"], discoveredAt: "2026-01-28T09:00:00Z" },
  { id: "comp-006", name: "Algarve Beach Resort", domain: "algarveresort.pt", website: "https://algarveresort.pt", industry: "Resorts", country: "Portugal", city: "Faro", employees: 150, source: "Turismo de Portugal", enrichmentStatus: "pending", contactIds: ["lead-006"], discoveredAt: "2026-02-05T10:00:00Z" },
  { id: "comp-007", name: "Sierra Hotel & Spa", domain: "sierrahotel.mx", website: "https://sierrahotel.mx", industry: "Hospitality", country: "México", city: "Ciudad de México", employees: 95, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-007"], discoveredAt: "2026-01-30T08:00:00Z" },
  { id: "comp-008", name: "Palacio Hoteles", domain: "palaciohoteles.es", website: "https://palaciohoteles.es", industry: "Hospitality", country: "España", city: "Sevilla", employees: 180, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-008"], discoveredAt: "2026-01-16T09:00:00Z" },
  { id: "comp-009", name: "Costa del Sol Resort", domain: "costadelsol.es", website: "https://costadelsol.es", industry: "Resorts", country: "España", city: "Málaga", employees: 200, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-014"], discoveredAt: "2026-01-19T10:00:00Z" },
  { id: "comp-010", name: "Urban Hotel Collection", domain: "urbanhotel.es", website: "https://urbanhotel.es", industry: "Hospitality", country: "España", city: "Madrid", employees: 320, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-021"], discoveredAt: "2026-01-15T09:00:00Z" },
  { id: "comp-011", name: "Riviera Maya Resort", domain: "rivieramaya.mx", website: "https://rivieramaya.mx", industry: "Resorts", country: "México", city: "Playa del Carmen", employees: 250, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-011"], discoveredAt: "2026-01-26T11:00:00Z" },
  { id: "comp-012", name: "Lisboa Grand Hotel", domain: "lisboagrand.pt", website: "https://lisboagrand.pt", industry: "Hospitality", country: "Portugal", city: "Lisboa", employees: 110, source: "Turismo de Portugal", enrichmentStatus: "enriched", contactIds: ["lead-010"], discoveredAt: "2026-02-08T10:00:00Z" },
];

export const prospectLists: ProspectList[] = [
  { id: "list-001", name: "Hoteles Boutique España", contactCount: 12, source: "search", contactIds: ["lead-001", "lead-002", "lead-003", "lead-008", "lead-012", "lead-014", "lead-017", "lead-018", "lead-021", "lead-025", "lead-027", "lead-030"], createdAt: "2026-01-15T10:00:00Z" },
  { id: "list-002", name: "Resorts LATAM", contactCount: 8, source: "search", contactIds: ["lead-004", "lead-005", "lead-007", "lead-009", "lead-011", "lead-016", "lead-019", "lead-028"], createdAt: "2026-01-20T10:00:00Z" },
  { id: "list-003", name: "Hoteles Portugal", contactCount: 5, source: "search", contactIds: ["lead-006", "lead-010", "lead-015", "lead-020", "lead-023"], createdAt: "2026-02-01T10:00:00Z" },
  { id: "list-004", name: "Directores Generales España", contactCount: 4, source: "ai", contactIds: ["lead-001", "lead-014", "lead-025", "lead-027"], createdAt: "2026-02-10T10:00:00Z" },
];

export const identities: Identity[] = [
  { id: "id-001", name: "Equipo Ventas", email: "ventas@fideltour.com", smtpHost: "smtp.fideltour.com", smtpPort: 587, dailyLimit: 100, sentToday: 34, warmupEnabled: true, warmupProgress: 95, status: "active", createdAt: "2026-01-01T10:00:00Z" },
  { id: "id-002", name: "Partnerships", email: "partnerships@fideltour.com", smtpHost: "smtp.fideltour.com", smtpPort: 587, dailyLimit: 50, sentToday: 12, warmupEnabled: true, warmupProgress: 78, status: "active", createdAt: "2026-01-05T10:00:00Z" },
  { id: "id-003", name: "Growth Team", email: "growth@fideltour.com", smtpHost: "smtp.fideltour.com", smtpPort: 587, dailyLimit: 75, sentToday: 0, warmupEnabled: true, warmupProgress: 45, status: "warming_up", createdAt: "2026-02-15T10:00:00Z" },
];

export const campaigns: Campaign[] = [
  {
    id: "camp-001", name: "Outreach Hoteles España", status: "active",
    steps: [
      { id: "cs-001-1", order: 1, type: "email", delayDays: 0, subject: "Incrementa la fidelización de tus huéspedes con {empresa}", body: "Hola {nombre},\n\nSoy del equipo de Fideltour y ayudamos a hoteles como {empresa} a incrementar sus reservas directas y fidelización de huéspedes.\n\nHe visto que {empresa} tiene una presencia sólida en {ciudad} y creo que podríamos ayudaros a maximizar el valor de cada huésped.\n\n¿Te interesaría una demo de 15 minutos?\n\nSaludos", sent: 45, opened: 32, replied: 8, bounced: 2 },
      { id: "cs-001-2", order: 2, type: "wait", delayDays: 3, subject: "", body: "", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-001-3", order: 3, type: "condition", delayDays: 0, subject: "", body: "", conditionField: "replied", conditionYesBranch: "stop", conditionNoBranch: "continue", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-001-4", order: 4, type: "follow_up", delayDays: 0, subject: "Re: Incrementa la fidelización de tus huéspedes con {empresa}", body: "Hola {nombre},\n\nQuería hacer seguimiento de mi email anterior. Hoteles similares a {empresa} han logrado aumentar un 23% sus reservas directas con nuestra plataforma.\n\n¿Tienes 15 minutos esta semana?\n\nSaludos", sent: 35, opened: 22, replied: 5, bounced: 1 },
      { id: "cs-001-5", order: 5, type: "wait", delayDays: 5, subject: "", body: "", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-001-6", order: 6, type: "follow_up", delayDays: 0, subject: "Caso de éxito en tu zona - {empresa}", body: "Hola {nombre},\n\nTe comparto un caso de éxito de un hotel en {ciudad} que incrementó su revenue un 18% con nuestro programa de fidelización.\n\n¿Te gustaría ver cómo aplicarlo en {empresa}?\n\nQuedo atento,\nSaludos", sent: 28, opened: 18, replied: 4, bounced: 0 },
      { id: "cs-001-7", order: 7, type: "wait", delayDays: 7, subject: "", body: "", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-001-8", order: 8, type: "breakup", delayDays: 0, subject: "Última oportunidad - {empresa}", body: "Hola {nombre},\n\nEntiendo que ahora puede no ser el momento. Te dejo la puerta abierta por si en el futuro {empresa} quiere explorar cómo maximizar la fidelización de huéspedes.\n\nNo volveré a molestarte. Si cambias de opinión, aquí estaré.\n\nSaludos", sent: 20, opened: 12, replied: 2, bounced: 0 },
    ],
    enrolledCount: 14, totalSent: 128, totalOpened: 84, totalReplied: 19, totalBounced: 3, identityId: "id-001", listIds: ["list-001"], createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "camp-002", name: "Outreach Resorts LATAM", status: "active",
    steps: [
      { id: "cs-002-1", order: 1, type: "email", delayDays: 0, subject: "Fidelización para resorts: más reservas directas en {empresa}", body: "Hola {nombre},\n\nEn Fideltour trabajamos con resorts en toda Latinoamérica para aumentar reservas directas y reducir dependencia de OTAs.\n\n{empresa} en {ciudad} tiene un gran potencial. ¿Te gustaría ver cómo lo hacemos?\n\nSaludos", sent: 28, opened: 19, replied: 5, bounced: 1 },
      { id: "cs-002-2", order: 2, type: "wait", delayDays: 4, subject: "", body: "", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-002-3", order: 3, type: "condition", delayDays: 0, subject: "", body: "", conditionField: "replied", conditionYesBranch: "stop", conditionNoBranch: "continue", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-002-4", order: 4, type: "follow_up", delayDays: 0, subject: "Re: Fidelización para resorts - {empresa}", body: "Hola {nombre},\n\nSeguimiento rápido. Resorts como {empresa} suelen depender demasiado de las OTAs. Con Fideltour hemos ayudado a reducir esa dependencia hasta un 30%.\n\n¿Agenda una llamada de 15 min?\n\nSaludos", sent: 22, opened: 14, replied: 3, bounced: 0 },
      { id: "cs-002-5", order: 5, type: "wait", delayDays: 5, subject: "", body: "", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-002-6", order: 6, type: "breakup", delayDays: 0, subject: "Cerrando el ciclo - {empresa}", body: "Hola {nombre},\n\nNo quiero ser insistente. Si en algún momento {empresa} quiere explorar la fidelización de huéspedes, aquí estaré.\n\n¡Mucho éxito!\n\nSaludos", sent: 10, opened: 6, replied: 1, bounced: 0 },
    ],
    enrolledCount: 8, totalSent: 76, totalOpened: 49, totalReplied: 11, totalBounced: 1, identityId: "id-002", listIds: ["list-002"], createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "camp-003", name: "Re-engagement Inactivos", status: "draft",
    steps: [
      { id: "cs-003-1", order: 1, type: "email", delayDays: 0, subject: "Novedades en Fideltour para {empresa}", body: "Hola {nombre},\n\nHace un tiempo hablamos sobre cómo Fideltour podría ayudar a {empresa}. Hemos lanzado nuevas funcionalidades que creo te interesarán.\n\n¿Tienes un momento para una actualización rápida?\n\nSaludos", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-003-2", order: 2, type: "wait", delayDays: 5, subject: "", body: "", sent: 0, opened: 0, replied: 0, bounced: 0 },
      { id: "cs-003-3", order: 3, type: "breakup", delayDays: 0, subject: "Último contacto - {empresa}", body: "Hola {nombre},\n\nEntiendo que los tiempos no siempre coinciden. Te deseo lo mejor con {empresa} y quedo a disposición.\n\nSaludos", sent: 0, opened: 0, replied: 0, bounced: 0 },
    ],
    enrolledCount: 0, totalSent: 0, totalOpened: 0, totalReplied: 0, totalBounced: 0, identityId: "id-001", listIds: [], createdAt: "2026-02-20T10:00:00Z",
  },
];

export const inboxThreads: InboxThread[] = [
  {
    id: "thread-001", leadId: "lead-001", leadName: "Carlos Martínez", leadCompany: "Gran Hotel Barcelona", campaignId: "camp-001", aiTag: "meeting_requested", unread: false, lastMessageAt: "2026-02-13T10:45:00Z",
    messages: [
      { id: "msg-001-1", direction: "outbound", subject: "Incrementa la fidelización de tus huéspedes con Gran Hotel Barcelona", body: "Hola Carlos,\n\nSoy del equipo de Fideltour y ayudamos a hoteles como Gran Hotel Barcelona a incrementar sus reservas directas y fidelización de huéspedes.\n\nHe visto que Gran Hotel Barcelona tiene una presencia sólida en Barcelona y creo que podríamos ayudaros a maximizar el valor de cada huésped.\n\n¿Te interesaría una demo de 15 minutos?\n\nSaludos", timestamp: "2026-02-09T09:30:00Z" },
      { id: "msg-001-2", direction: "outbound", subject: "Re: Incrementa la fidelización de tus huéspedes con Gran Hotel Barcelona", body: "Hola Carlos,\n\nQuería hacer seguimiento de mi email anterior. Hoteles similares a Gran Hotel Barcelona han logrado aumentar un 23% sus reservas directas con nuestra plataforma.\n\n¿Tienes 15 minutos esta semana?\n\nSaludos", timestamp: "2026-02-12T09:30:00Z" },
      { id: "msg-001-3", direction: "inbound", subject: "Re: Incrementa la fidelización de tus huéspedes con Gran Hotel Barcelona", body: "Hola,\n\nGracias por el seguimiento. Me interesa mucho lo que comentas. Estamos buscando exactamente esto para mejorar nuestras reservas directas.\n\n¿Podemos agendar una demo para la semana que viene? Martes o miércoles me vendrían bien.\n\nSaludos,\nCarlos Martínez\nDirector General\nGran Hotel Barcelona", timestamp: "2026-02-13T10:45:00Z" },
    ],
  },
  {
    id: "thread-002", leadId: "lead-002", leadName: "Ana López Ruiz", leadCompany: "Hotel Arte Madrid", campaignId: "camp-001", aiTag: "interested", unread: true, lastMessageAt: "2026-02-11T09:20:00Z",
    messages: [
      { id: "msg-002-1", direction: "outbound", subject: "Incrementa la fidelización de tus huéspedes con Hotel Arte Madrid", body: "Hola Ana,\n\nSoy del equipo de Fideltour...", timestamp: "2026-02-10T09:30:00Z" },
      { id: "msg-002-2", direction: "inbound", subject: "Re: Incrementa la fidelización de tus huéspedes con Hotel Arte Madrid", body: "Hola,\n\nInteresante propuesta. Actualmente estamos evaluando varias opciones de fidelización. ¿Me podrías enviar más información sobre casos de éxito en hoteles boutique?\n\nGracias,\nAna López\nRevenue Manager", timestamp: "2026-02-11T09:20:00Z" },
    ],
  },
  {
    id: "thread-003", leadId: "lead-014", leadName: "Patricia Navarro", leadCompany: "Costa del Sol Resort", campaignId: "camp-001", aiTag: "meeting_requested", unread: true, lastMessageAt: "2026-02-20T14:30:00Z",
    messages: [
      { id: "msg-003-1", direction: "outbound", subject: "Incrementa la fidelización de tus huéspedes con Costa del Sol Resort", body: "Hola Patricia,\n\nSoy del equipo de Fideltour...", timestamp: "2026-02-15T09:30:00Z" },
      { id: "msg-003-2", direction: "outbound", subject: "Re: Incrementa la fidelización con Costa del Sol Resort", body: "Hola Patricia,\n\nQuería hacer seguimiento...", timestamp: "2026-02-18T09:30:00Z" },
      { id: "msg-003-3", direction: "inbound", subject: "Re: Incrementa la fidelización con Costa del Sol Resort", body: "Buenos días,\n\nLlevo tiempo queriendo implementar un programa de fidelización en el resort. Me encantaría ver una demo.\n\n¿Tienen disponibilidad el jueves por la mañana?\n\nPatricia Navarro\nDirectora General\nCosta del Sol Resort", timestamp: "2026-02-20T14:30:00Z" },
    ],
  },
  {
    id: "thread-004", leadId: "lead-004", leadName: "María García Hernández", leadCompany: "Playa Resort Cancún", campaignId: "camp-002", aiTag: "interested", unread: false, lastMessageAt: "2026-02-15T11:00:00Z",
    messages: [
      { id: "msg-004-1", direction: "outbound", subject: "Fidelización para resorts: más reservas directas en Playa Resort Cancún", body: "Hola María,\n\nEn Fideltour trabajamos con resorts...", timestamp: "2026-02-14T09:30:00Z" },
      { id: "msg-004-2", direction: "inbound", subject: "Re: Fidelización para resorts - Playa Resort Cancún", body: "Hola,\n\nEstamos muy interesados. Las OTAs nos están comiendo el margen. ¿Cuánto tardaría la implementación?\n\nMaría García\nCEO\nPlaya Resort Cancún", timestamp: "2026-02-15T11:00:00Z" },
    ],
  },
  {
    id: "thread-005", leadId: "lead-027", leadName: "Gonzalo Muñoz", leadCompany: "Hotel Capital Madrid", campaignId: "camp-001", aiTag: "question", unread: true, lastMessageAt: "2026-02-19T16:20:00Z",
    messages: [
      { id: "msg-005-1", direction: "outbound", subject: "Incrementa la fidelización de tus huéspedes con Hotel Capital Madrid", body: "Hola Gonzalo,\n\nSoy del equipo de Fideltour...", timestamp: "2026-02-17T09:30:00Z" },
      { id: "msg-005-2", direction: "inbound", subject: "Re: Fidelización Hotel Capital Madrid", body: "Buenas tardes,\n\n¿Qué integraciones tienen con los PMS? Nosotros usamos Opera Cloud.\n\nGonzalo Muñoz\nCEO\nHotel Capital Madrid", timestamp: "2026-02-19T16:20:00Z" },
    ],
  },
  {
    id: "thread-006", leadId: "lead-011", leadName: "Fernando Díaz", leadCompany: "Riviera Maya Resort", campaignId: "camp-002", aiTag: "not_interested", unread: false, lastMessageAt: "2026-02-18T10:15:00Z",
    messages: [
      { id: "msg-006-1", direction: "outbound", subject: "Fidelización para resorts: Riviera Maya Resort", body: "Hola Fernando...", timestamp: "2026-02-14T09:30:00Z" },
      { id: "msg-006-2", direction: "outbound", subject: "Re: Fidelización para resorts - Riviera Maya", body: "Hola Fernando, seguimiento rápido...", timestamp: "2026-02-17T09:30:00Z" },
      { id: "msg-006-3", direction: "inbound", subject: "Re: Fidelización para resorts - Riviera Maya", body: "Hola,\n\nGracias pero en este momento no nos interesa. Ya tenemos un programa de fidelización implementado.\n\nSaludos,\nFernando Díaz", timestamp: "2026-02-18T10:15:00Z" },
    ],
  },
  {
    id: "thread-007", leadId: "lead-003", leadName: "Javier Ruiz Sánchez", leadCompany: "Boutique Hotel Valencia", campaignId: "camp-001", aiTag: "auto_reply", unread: false, lastMessageAt: "2026-02-16T08:00:00Z",
    messages: [
      { id: "msg-007-1", direction: "outbound", subject: "Incrementa la fidelización con Boutique Hotel Valencia", body: "Hola Javier...", timestamp: "2026-02-15T09:30:00Z" },
      { id: "msg-007-2", direction: "inbound", subject: "Respuesta automática: Fuera de oficina", body: "Estoy fuera de la oficina hasta el 25 de febrero. Para asuntos urgentes contactar con recepción.\n\nSaludos,\nJavier Ruiz", timestamp: "2026-02-16T08:00:00Z" },
    ],
  },
];

export const activityFeed: ActivityItem[] = [
  { id: "act-001", type: "email_replied", description: "Patricia Navarro ha solicitado una reunión", leadName: "Patricia Navarro", companyName: "Costa del Sol Resort", timestamp: "2026-02-20T14:30:00Z", metadata: { campaignId: "camp-001" } },
  { id: "act-002", type: "enrichment", description: "8 contactos enriquecidos en la lista 'Hoteles Boutique España'", companyName: "Varios", timestamp: "2026-02-20T12:00:00Z", metadata: { listId: "list-001" } },
  { id: "act-003", type: "email_sent", description: "12 emails enviados en campaña 'Outreach Hoteles España'", timestamp: "2026-02-20T09:30:00Z", metadata: { campaignId: "camp-001" } },
  { id: "act-004", type: "email_replied", description: "Gonzalo Muñoz ha preguntado sobre integraciones PMS", leadName: "Gonzalo Muñoz", companyName: "Hotel Capital Madrid", timestamp: "2026-02-19T16:20:00Z", metadata: { campaignId: "camp-001" } },
  { id: "act-005", type: "sync", description: "Pablo Martín sincronizado con Zoho CRM (ZL-4829310)", leadName: "Pablo Martín", companyName: "Urban Hotel Collection", timestamp: "2026-02-22T11:00:00Z", metadata: {} },
  { id: "act-006", type: "discovery", description: "45 nuevas empresas descubiertas en búsqueda 'Hoteles Boutique España'", timestamp: "2026-02-23T09:00:00Z", metadata: { searchJobId: "sj-001" } },
  { id: "act-007", type: "exclusion", description: "Laura Méndez excluida - Cliente actual en Zoho CRM", leadName: "Laura Méndez", companyName: "Sierra Hotel & Spa", timestamp: "2026-02-10T15:30:00Z", metadata: {} },
  { id: "act-008", type: "campaign_started", description: "Campaña 'Outreach Resorts LATAM' activada con 8 contactos", timestamp: "2026-01-20T10:30:00Z", metadata: { campaignId: "camp-002" } },
  { id: "act-009", type: "contact_added", description: "4 contactos añadidos a lista 'Directores Generales España'", timestamp: "2026-02-10T10:00:00Z", metadata: { listId: "list-004" } },
  { id: "act-010", type: "email_replied", description: "María García interesada en reducir dependencia de OTAs", leadName: "María García Hernández", companyName: "Playa Resort Cancún", timestamp: "2026-02-15T11:00:00Z", metadata: { campaignId: "camp-002" } },
  { id: "act-011", type: "enrichment", description: "Adriana Blanco enriquecida con éxito (Clearbit)", leadName: "Adriana Blanco", companyName: "Maya Resort Tulum", timestamp: "2026-02-22T09:00:00Z", metadata: {} },
  { id: "act-012", type: "sync", description: "Carlos Martínez sincronizado con Zoho CRM (ZL-4829103)", leadName: "Carlos Martínez", companyName: "Gran Hotel Barcelona", timestamp: "2026-02-15T08:30:00Z", metadata: {} },
  { id: "act-013", type: "discovery", description: "28 empresas descubiertas en búsqueda 'Cadenas Medianas LATAM'", timestamp: "2026-02-23T10:00:00Z", metadata: { searchJobId: "sj-002" } },
  { id: "act-014", type: "email_sent", description: "8 emails enviados en campaña 'Outreach Resorts LATAM'", timestamp: "2026-02-19T09:30:00Z", metadata: { campaignId: "camp-002" } },
  { id: "act-015", type: "exclusion", description: "Beatriz Almeida excluida - Do Not Contact en Zoho", leadName: "Beatriz Almeida", companyName: "Cascais Boutique Hotel", timestamp: "2026-02-12T14:00:00Z", metadata: {} },
];

export const aiPlaybook: AIPlaybookData = {
  companyName: "Fideltour",
  website: "https://www.fideltour.com",
  linkedIn: "https://www.linkedin.com/company/fideltour",
  industry: "Hospitality Technology / SaaS",
  description: "Fideltour es una plataforma de fidelización y CRM diseñada específicamente para la industria hotelera. Ayudamos a hoteles independientes y cadenas a incrementar sus reservas directas, reducir la dependencia de OTAs y maximizar el valor de cada huésped a través de programas de fidelización personalizados.",
  productsServices: [
    "Programa de fidelización white-label para hoteles",
    "Motor de reservas directas con incentivos",
    "CRM hotelero con segmentación de huéspedes",
    "Automatización de marketing por email",
    "Integración con PMS (Opera, Mews, Cloudbeds)",
    "Dashboard de analíticas de huéspedes",
  ],
  valuePropositions: [
    "Incremento del 23% en reservas directas de media",
    "Reducción del 30% en dependencia de OTAs",
    "ROI positivo en los primeros 3 meses",
    "Implementación en menos de 2 semanas",
    "Sin costes de setup ni permanencia",
  ],
  icpDefinition: "Hoteles independientes y cadenas medianas (30-500 habitaciones) en España, Portugal y Latinoamérica, con presencia en OTAs, que buscan incrementar reservas directas y fidelizar huéspedes. Decision makers: Director General, Revenue Manager, Director Comercial, CMO.",
  competitors: ["Revinate", "Cendyn", "Profitroom", "The Hotels Network", "Bookassist"],
  testimonials: [
    { name: "María Sánchez", role: "Directora General", company: "Hotel Boutique Barcelona", quote: "Con Fideltour hemos aumentado nuestras reservas directas un 28% en solo 4 meses." },
    { name: "Roberto López", role: "Revenue Manager", company: "Resort Costa del Sol", quote: "La mejor inversión que hemos hecho. El programa de fidelización se paga solo." },
  ],
  aiVariables: [
    { name: "pain_point", description: "Principal dolor del prospecto identificado por IA", source: "Website + LinkedIn" },
    { name: "tech_stack", description: "PMS y herramientas tecnológicas que usa el hotel", source: "Website crawling" },
    { name: "ota_dependency", description: "Nivel estimado de dependencia de OTAs", source: "Booking.com + Google Hotels" },
    { name: "recent_news", description: "Noticias recientes sobre el hotel o cadena", source: "Google News" },
  ],
};

export const AI_TAG_CONFIG: Record<string, { label: string; color: string; bgClass: string; textClass: string }> = {
  meeting_requested: { label: "Reunión solicitada", color: "#22c55e", bgClass: "bg-green-100 dark:bg-green-900/40", textClass: "text-green-700 dark:text-green-300" },
  interested: { label: "Interesado", color: "#25CAD2", bgClass: "bg-teal-100 dark:bg-teal-900/40", textClass: "text-teal-700 dark:text-teal-300" },
  not_interested: { label: "No interesado", color: "#ef4444", bgClass: "bg-red-100 dark:bg-red-900/40", textClass: "text-red-700 dark:text-red-300" },
  auto_reply: { label: "Auto-respuesta", color: "#6b7280", bgClass: "bg-gray-100 dark:bg-gray-800", textClass: "text-gray-700 dark:text-gray-300" },
  question: { label: "Pregunta", color: "#f59e0b", bgClass: "bg-amber-100 dark:bg-amber-900/40", textClass: "text-amber-700 dark:text-amber-300" },
  out_of_office: { label: "Fuera de oficina", color: "#94a3b8", bgClass: "bg-slate-100 dark:bg-slate-800", textClass: "text-slate-700 dark:text-slate-300" },
};
