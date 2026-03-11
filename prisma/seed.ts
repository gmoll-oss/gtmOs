import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.inboxMessage.deleteMany();
  await prisma.inboxThread.deleteMany();
  await prisma.campaignStep.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.enrichmentQueueItem.deleteMany();
  await prisma.enrichmentAttempt.deleteMany();
  await prisma.eventLog.deleteMany();
  await prisma.activityItem.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.searchJob.deleteMany();
  await prisma.company.deleteMany();
  await prisma.prospectList.deleteMany();
  await prisma.identity.deleteMany();
  await prisma.suppressionEntry.deleteMany();
  await prisma.exclusionRule.deleteMany();
  await prisma.aIPlaybook.deleteMany();

  console.log("  Cleared existing data");

  // Search Jobs
  const searchJobs = [
    { id: "sj-001", name: "Hoteles Boutique España", status: "active" as const, geo: ["España"], industry: ["Hospitality", "Hotels"], keywords: ["hotel boutique", "hotel independiente", "hotel 4 estrellas"], targetRoles: ["Director General", "Revenue Manager", "Director Comercial"], dailyLimit: 50, schedule: "Diario - 09:00 CET", totalDiscovered: 187, totalQualified: 124, lastRunAt: new Date("2026-02-23T09:00:00Z"), nextRunAt: new Date("2026-02-24T09:00:00Z"), sources: ["Google Search", "Booking.com", "TripAdvisor"] },
    { id: "sj-002", name: "Cadenas Medianas LATAM", status: "active" as const, geo: ["México", "Colombia", "Perú"], industry: ["Hospitality", "Resorts"], keywords: ["cadena hotelera", "grupo hotelero", "resort todo incluido"], targetRoles: ["CEO", "CMO", "Director de Ventas"], dailyLimit: 30, schedule: "Diario - 10:00 CST", totalDiscovered: 93, totalQualified: 61, lastRunAt: new Date("2026-02-23T10:00:00Z"), nextRunAt: new Date("2026-02-24T10:00:00Z"), sources: ["Google Search", "Directorios sectoriales"] },
    { id: "sj-003", name: "Hoteles Portugal & Algarve", status: "paused" as const, geo: ["Portugal"], industry: ["Hospitality"], keywords: ["hotel algarve", "hotel lisboa", "pousada"], targetRoles: ["Diretor Geral", "Revenue Manager"], dailyLimit: 25, schedule: "Lun-Vie - 08:00 WET", totalDiscovered: 45, totalQualified: 28, lastRunAt: new Date("2026-02-20T08:00:00Z"), nextRunAt: null, sources: ["Google Search", "Turismo de Portugal"] },
    { id: "sj-004", name: "Resorts Caribe", status: "draft" as const, geo: ["República Dominicana", "Cuba", "Jamaica"], industry: ["Resorts", "All-Inclusive"], keywords: ["resort caribe", "all inclusive", "beach resort"], targetRoles: ["General Manager", "Director of Sales"], dailyLimit: 20, schedule: "Sin programar", totalDiscovered: 0, totalQualified: 0, lastRunAt: null, nextRunAt: null, sources: ["Google Search"] },
  ];
  for (const sj of searchJobs) {
    await prisma.searchJob.create({ data: sj });
  }
  console.log("  ✅ Search Jobs");

  // Leads (all 15)
  const leadsData = [
    { id: "lead-001", email: "carlos.martinez@granhotelbarcelona.com", name: "Carlos Martínez", title: "Director General", company: "Gran Hotel Barcelona", domain: "granhotelbarcelona.com", phone: "+34 934 123 456", country: "España", city: "Barcelona", industry: "Hospitality", website: "https://granhotelbarcelona.com", employeeCount: 120, status: "synced" as const, score: 92, icpScore: 95, completenessScore: 90, signalScore: 88, excluded: false, enrichmentConfidence: 0.95, lastEnrichedAt: new Date("2026-02-10T14:30:00Z"), sourceUrls: ["https://granhotelbarcelona.com/equipo", "https://linkedin.com/in/carlosmartinez"], source: "Google Search", searchJobId: "sj-001", sequenceId: "seq-001", sequenceStep: 4, zohoCrmSynced: true, zohoLeadId: "ZL-4829103", createdAt: new Date("2026-01-18T09:15:00Z") },
    { id: "lead-002", email: "ana.lopez@hotelartemadrid.es", name: "Ana López Ruiz", title: "Revenue Manager", company: "Hotel Arte Madrid", domain: "hotelartemadrid.es", phone: "+34 912 345 678", country: "España", city: "Madrid", industry: "Hospitality", website: "https://hotelartemadrid.es", employeeCount: 85, status: "engaged" as const, score: 87, icpScore: 88, completenessScore: 92, signalScore: 80, excluded: false, enrichmentConfidence: 0.92, lastEnrichedAt: new Date("2026-02-08T10:00:00Z"), sourceUrls: ["https://hotelartemadrid.es/equipo"], source: "Google Search", searchJobId: "sj-001", sequenceId: "seq-001", sequenceStep: 2, zohoCrmSynced: false, createdAt: new Date("2026-01-20T11:30:00Z") },
    { id: "lead-003", email: "javier.ruiz@boutiquevalencia.com", name: "Javier Ruiz Sánchez", title: "Director Comercial", company: "Boutique Hotel Valencia", domain: "boutiquevalencia.com", phone: "+34 963 456 789", country: "España", city: "Valencia", industry: "Hospitality", website: "https://boutiquevalencia.com", employeeCount: 45, status: "in_sequence" as const, score: 78, icpScore: 82, completenessScore: 85, signalScore: 65, excluded: false, enrichmentConfidence: 0.88, lastEnrichedAt: new Date("2026-02-10T09:00:00Z"), sourceUrls: ["https://boutiquevalencia.com"], source: "Google Search", searchJobId: "sj-001", sequenceId: "seq-001", sequenceStep: 1, zohoCrmSynced: false, createdAt: new Date("2026-01-22T08:00:00Z") },
    { id: "lead-004", email: "maria.garcia@playaresort.mx", name: "María García Hernández", title: "CEO", company: "Playa Resort Cancún", domain: "playaresort.mx", phone: "+52 998 123 4567", country: "México", city: "Cancún", industry: "Resorts", website: "https://playaresort.mx", employeeCount: 200, status: "ready_to_sync" as const, score: 85, icpScore: 90, completenessScore: 88, signalScore: 75, excluded: false, enrichmentConfidence: 0.94, lastEnrichedAt: new Date("2026-02-12T11:00:00Z"), sourceUrls: ["https://playaresort.mx/equipo"], source: "Google Search", searchJobId: "sj-002", sequenceId: "seq-002", sequenceStep: 2, zohoCrmSynced: false, createdAt: new Date("2026-01-25T10:00:00Z") },
    { id: "lead-005", email: "roberto.silva@haciendahotel.co", name: "Roberto Silva Mejía", title: "Director de Ventas", company: "Hacienda Hotel Cartagena", domain: "haciendahotel.co", phone: "+57 5 678 9012", country: "Colombia", city: "Cartagena", industry: "Hospitality", website: "https://haciendahotel.co", employeeCount: 70, status: "enriched" as const, score: 65, icpScore: 70, completenessScore: 72, signalScore: 52, excluded: false, enrichmentConfidence: 0.82, lastEnrichedAt: new Date("2026-02-14T10:10:00Z"), sourceUrls: ["https://haciendahotel.co"], source: "Directorios sectoriales", searchJobId: "sj-002", zohoCrmSynced: false, createdAt: new Date("2026-01-28T09:00:00Z") },
    { id: "lead-006", email: "pedro.fernandes@algarveresort.pt", name: "Pedro Fernandes", title: "Diretor Geral", company: "Algarve Beach Resort", domain: "algarveresort.pt", phone: "+351 289 123 456", country: "Portugal", city: "Faro", industry: "Resorts", website: "https://algarveresort.pt", employeeCount: 150, status: "discovered" as const, score: 45, icpScore: 50, completenessScore: 40, signalScore: 45, excluded: false, enrichmentConfidence: 0.30, sourceUrls: [], source: "Turismo de Portugal", searchJobId: "sj-003", zohoCrmSynced: false, createdAt: new Date("2026-02-05T10:00:00Z") },
    { id: "lead-007", email: "laura.mendez@sierrahotel.mx", name: "Laura Méndez", title: "Directora Comercial", company: "Sierra Hotel & Spa", domain: "sierrahotel.mx", phone: "+52 55 1234 5678", country: "México", city: "Ciudad de México", industry: "Hospitality", website: "https://sierrahotel.mx", employeeCount: 95, status: "excluded" as const, score: 72, icpScore: 78, completenessScore: 80, signalScore: 55, excluded: true, exclusionReason: "Cliente actual en Zoho CRM", exclusionSource: "zoho", exclusionTimestamp: new Date("2026-02-10T15:30:00Z"), enrichmentConfidence: 0.85, lastEnrichedAt: new Date("2026-02-08T10:00:00Z"), sourceUrls: ["https://sierrahotel.mx/equipo"], source: "Google Search", searchJobId: "sj-002", zohoCrmSynced: false, createdAt: new Date("2026-01-30T08:00:00Z") },
    { id: "lead-008", email: "pedro.navarro@palaciohoteles.es", name: "Pedro Navarro", title: "Director Comercial", company: "Palacio Hoteles", domain: "palaciohoteles.es", phone: "+34 954 567 890", country: "España", city: "Sevilla", industry: "Hospitality", website: "https://palaciohoteles.es", employeeCount: 180, status: "in_sequence" as const, score: 80, icpScore: 85, completenessScore: 82, signalScore: 72, excluded: false, enrichmentConfidence: 0.93, lastEnrichedAt: new Date("2026-02-04T09:00:00Z"), sourceUrls: ["https://palaciohoteles.es"], source: "Google Search", searchJobId: "sj-001", sequenceId: "seq-001", sequenceStep: 1, zohoCrmSynced: false, createdAt: new Date("2026-01-16T09:00:00Z") },
    { id: "lead-009", email: "diego.vargas@andinohotel.co", name: "Diego Vargas", title: "Gerente General", company: "Andino Hotel Bogotá", domain: "andinohotel.co", phone: "+57 1 234 5678", country: "Colombia", city: "Bogotá", industry: "Hospitality", website: "https://andinohotel.co", employeeCount: 60, status: "discovered" as const, score: 40, icpScore: 55, completenessScore: 35, signalScore: 30, excluded: false, enrichmentConfidence: 0.20, sourceUrls: [], source: "Directorios sectoriales", searchJobId: "sj-002", zohoCrmSynced: false, createdAt: new Date("2026-02-22T14:00:00Z") },
    { id: "lead-010", email: "sofia.costa@lisboagrand.pt", name: "Sofia Costa", title: "Revenue Manager", company: "Lisboa Grand Hotel", domain: "lisboagrand.pt", phone: "+351 21 123 4567", country: "Portugal", city: "Lisboa", industry: "Hospitality", website: "https://lisboagrand.pt", employeeCount: 110, status: "qualified" as const, score: 68, icpScore: 72, completenessScore: 75, signalScore: 55, excluded: false, enrichmentConfidence: 0.90, lastEnrichedAt: new Date("2026-02-16T10:00:00Z"), sourceUrls: ["https://lisboagrand.pt"], source: "Turismo de Portugal", searchJobId: "sj-003", zohoCrmSynced: false, createdAt: new Date("2026-02-08T10:00:00Z") },
    { id: "lead-011", email: "fernando.diaz@rivieramaya.mx", name: "Fernando Díaz", title: "Director de Operaciones", company: "Riviera Maya Resort", domain: "rivieramaya.mx", phone: "+52 984 876 5432", country: "México", city: "Playa del Carmen", industry: "Resorts", website: "https://rivieramaya.mx", employeeCount: 250, status: "in_sequence" as const, score: 75, icpScore: 80, completenessScore: 78, signalScore: 65, excluded: false, enrichmentConfidence: 0.91, lastEnrichedAt: new Date("2026-02-09T14:00:00Z"), sourceUrls: ["https://rivieramaya.mx"], source: "Google Search", searchJobId: "sj-002", sequenceId: "seq-002", sequenceStep: 3, zohoCrmSynced: false, createdAt: new Date("2026-01-26T11:00:00Z") },
    { id: "lead-012", email: "isabel.vega@monterreycentro.mx", name: "Isabel Vega", title: "Coordinadora de Marketing", company: "Hotel Monterrey Centro", domain: "monterreycentro.mx", phone: "+52 81 1234 5678", country: "México", city: "Monterrey", industry: "Hospitality", website: "https://monterreycentro.mx", employeeCount: 30, status: "excluded" as const, score: 25, icpScore: 20, completenessScore: 45, signalScore: 15, excluded: true, exclusionReason: "No cumple ICP mínimo", exclusionSource: "system", exclusionTimestamp: new Date("2026-02-06T10:00:00Z"), enrichmentConfidence: 0.60, sourceUrls: [], source: "Google Search", searchJobId: "sj-002", zohoCrmSynced: false, createdAt: new Date("2026-02-04T08:00:00Z") },
    { id: "lead-013", email: "beatriz.almeida@cascaishotel.pt", name: "Beatriz Almeida", title: "Diretora de Marketing", company: "Cascais Boutique Hotel", domain: "cascaishotel.pt", phone: "+351 21 987 6543", country: "Portugal", city: "Cascais", industry: "Hospitality", website: "https://cascaishotel.pt", employeeCount: 35, status: "excluded" as const, score: 55, icpScore: 60, completenessScore: 65, signalScore: 40, excluded: true, exclusionReason: "Do Not Contact en Zoho", exclusionSource: "zoho", exclusionTimestamp: new Date("2026-02-12T14:00:00Z"), enrichmentConfidence: 0.75, lastEnrichedAt: new Date("2026-02-12T10:00:00Z"), sourceUrls: [], source: "Turismo de Portugal", searchJobId: "sj-003", zohoCrmSynced: false, createdAt: new Date("2026-02-22T11:00:00Z") },
    { id: "lead-014", email: "patricia.navarro@costadelsol.es", name: "Patricia Navarro", title: "Directora General", company: "Costa del Sol Resort", domain: "costadelsol.es", phone: "+34 952 678 901", country: "España", city: "Málaga", industry: "Resorts", website: "https://costadelsol.es", employeeCount: 200, status: "synced" as const, score: 90, icpScore: 92, completenessScore: 95, signalScore: 82, excluded: false, enrichmentConfidence: 0.96, lastEnrichedAt: new Date("2026-02-05T11:00:00Z"), sourceUrls: ["https://costadelsol.es/equipo", "https://linkedin.com/in/patricianavarro"], source: "Google Search", searchJobId: "sj-001", sequenceId: "seq-001", sequenceStep: 3, zohoCrmSynced: true, zohoLeadId: "ZL-4829310", createdAt: new Date("2026-01-19T10:00:00Z") },
    { id: "lead-015", email: "miguel.santos@portopalace.pt", name: "Miguel Santos", title: "Diretor Geral", company: "Porto Palace Hotel", domain: "portopalace.pt", phone: "+351 22 456 7890", country: "Portugal", city: "Porto", industry: "Hospitality", website: "https://portopalace.pt", employeeCount: 90, status: "qualified" as const, score: 62, icpScore: 65, completenessScore: 70, signalScore: 50, excluded: false, enrichmentConfidence: 0.78, lastEnrichedAt: new Date("2026-02-11T10:00:00Z"), sourceUrls: [], source: "Turismo de Portugal", searchJobId: "sj-003", zohoCrmSynced: false, createdAt: new Date("2026-02-21T08:00:00Z") },
  ];
  for (const lead of leadsData) {
    await prisma.lead.create({ data: lead });
  }
  console.log("  ✅ Leads (15)");

  // Companies
  const companiesData = [
    { id: "comp-001", name: "Gran Hotel Barcelona", domain: "granhotelbarcelona.com", industry: "Hospitality", country: "España", city: "Barcelona", employees: 120, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-001"] },
    { id: "comp-002", name: "Hotel Arte Madrid", domain: "hotelartemadrid.es", industry: "Hospitality", country: "España", city: "Madrid", employees: 85, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-002"] },
    { id: "comp-003", name: "Boutique Hotel Valencia", domain: "boutiquevalencia.com", industry: "Hospitality", country: "España", city: "Valencia", employees: 45, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-003"] },
    { id: "comp-004", name: "Playa Resort Cancún", domain: "playaresort.mx", industry: "Resorts", country: "México", city: "Cancún", employees: 200, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-004"] },
    { id: "comp-005", name: "Hacienda Hotel Cartagena", domain: "haciendahotel.co", industry: "Hospitality", country: "Colombia", city: "Cartagena", employees: 70, source: "Directorios sectoriales", enrichmentStatus: "partial", contactIds: ["lead-005"] },
    { id: "comp-006", name: "Algarve Beach Resort", domain: "algarveresort.pt", industry: "Resorts", country: "Portugal", city: "Faro", employees: 150, source: "Turismo de Portugal", enrichmentStatus: "pending", contactIds: ["lead-006"] },
    { id: "comp-007", name: "Sierra Hotel & Spa", domain: "sierrahotel.mx", industry: "Hospitality", country: "México", city: "Ciudad de México", employees: 95, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-007"] },
    { id: "comp-008", name: "Palacio Hoteles", domain: "palaciohoteles.es", industry: "Hospitality", country: "España", city: "Sevilla", employees: 180, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-008"] },
    { id: "comp-009", name: "Costa del Sol Resort", domain: "costadelsol.es", industry: "Resorts", country: "España", city: "Málaga", employees: 200, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-014"] },
    { id: "comp-010", name: "Urban Hotel Collection", domain: "urbanhotel.es", industry: "Hospitality", country: "España", city: "Madrid", employees: 320, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-003"] },
    { id: "comp-011", name: "Riviera Maya Resort", domain: "rivieramaya.mx", industry: "Resorts", country: "México", city: "Playa del Carmen", employees: 250, source: "Google Search", enrichmentStatus: "enriched", contactIds: ["lead-011"] },
    { id: "comp-012", name: "Lisboa Grand Hotel", domain: "lisboagrand.pt", industry: "Hospitality", country: "Portugal", city: "Lisboa", employees: 110, source: "Turismo de Portugal", enrichmentStatus: "enriched", contactIds: ["lead-010"] },
  ];
  for (const c of companiesData) {
    await prisma.company.create({ data: c });
  }
  console.log("  ✅ Companies (12)");

  // Prospect Lists
  const listsData = [
    { id: "list-001", name: "Hoteles Boutique España", contactCount: 8, source: "search", contactIds: ["lead-001", "lead-002", "lead-003", "lead-008", "lead-012", "lead-014"] },
    { id: "list-002", name: "Resorts LATAM", contactCount: 6, source: "search", contactIds: ["lead-004", "lead-005", "lead-007", "lead-009", "lead-011"] },
    { id: "list-003", name: "Hoteles Portugal", contactCount: 4, source: "search", contactIds: ["lead-006", "lead-010", "lead-015", "lead-013"] },
    { id: "list-004", name: "Directores Generales España", contactCount: 3, source: "ai", contactIds: ["lead-001", "lead-014", "lead-003"] },
  ];
  for (const l of listsData) {
    await prisma.prospectList.create({ data: l });
  }
  console.log("  ✅ Prospect Lists (4)");

  // Identities
  const identitiesData = [
    { id: "id-001", name: "Equipo Ventas", email: "ventas@fideltour.com", smtpHost: "smtp.fideltour.com", dailyLimit: 100, sentToday: 34, warmupProgress: 95, status: "active" as const },
    { id: "id-002", name: "Partnerships", email: "partnerships@fideltour.com", smtpHost: "smtp.fideltour.com", dailyLimit: 50, sentToday: 12, warmupProgress: 78, status: "active" as const },
    { id: "id-003", name: "Growth Team", email: "growth@fideltour.com", smtpHost: "smtp.fideltour.com", dailyLimit: 75, sentToday: 0, warmupProgress: 45, status: "warming" as const },
  ];
  for (const i of identitiesData) {
    await prisma.identity.create({ data: i });
  }
  console.log("  ✅ Identities (3)");

  // Campaigns with steps
  const campaignsData = [
    {
      id: "camp-001", name: "Outreach Hoteles España", status: "active" as const,
      enrolledCount: 14, totalSent: 128, totalOpened: 84, totalReplied: 19, totalBounced: 3,
      identityId: "id-001", listIds: ["list-001"],
      steps: [
        { id: "cs-001-1", order: 1, type: "email" as const, delayDays: 0, subject: "Incrementa la fidelización de tus huéspedes con {empresa}", body: "Hola {nombre},\n\nSoy del equipo de Fideltour...", sent: 45, opened: 32, replied: 8, bounced: 2 },
        { id: "cs-001-2", order: 2, type: "wait" as const, delayDays: 3, subject: "", body: "" },
        { id: "cs-001-3", order: 3, type: "condition" as const, delayDays: 0, subject: "", body: "", conditionField: "replied", branches: { yes: "stop", no: "continue" } },
        { id: "cs-001-4", order: 4, type: "follow_up" as const, delayDays: 0, subject: "Re: Incrementa la fidelización de tus huéspedes con {empresa}", body: "Hola {nombre},\n\nQuería hacer seguimiento...", sent: 35, opened: 22, replied: 5, bounced: 1 },
        { id: "cs-001-5", order: 5, type: "wait" as const, delayDays: 5, subject: "", body: "" },
        { id: "cs-001-6", order: 6, type: "follow_up" as const, delayDays: 0, subject: "Caso de éxito en tu zona - {empresa}", body: "Hola {nombre},\n\nTe comparto un caso de éxito...", sent: 28, opened: 18, replied: 4, bounced: 0 },
        { id: "cs-001-7", order: 7, type: "wait" as const, delayDays: 7, subject: "", body: "" },
        { id: "cs-001-8", order: 8, type: "breakup" as const, delayDays: 0, subject: "Última oportunidad - {empresa}", body: "Hola {nombre},\n\nEntiendo que ahora puede no ser el momento...", sent: 20, opened: 12, replied: 2, bounced: 0 },
      ],
    },
    {
      id: "camp-002", name: "Outreach Resorts LATAM", status: "active" as const,
      enrolledCount: 8, totalSent: 76, totalOpened: 49, totalReplied: 11, totalBounced: 1,
      identityId: "id-002", listIds: ["list-002"],
      steps: [
        { id: "cs-002-1", order: 1, type: "email" as const, delayDays: 0, subject: "Fidelización para resorts: más reservas directas en {empresa}", body: "Hola {nombre},\n\nEn Fideltour trabajamos con resorts...", sent: 28, opened: 19, replied: 5, bounced: 1 },
        { id: "cs-002-2", order: 2, type: "wait" as const, delayDays: 4, subject: "", body: "" },
        { id: "cs-002-3", order: 3, type: "condition" as const, delayDays: 0, subject: "", body: "", conditionField: "replied", branches: { yes: "stop", no: "continue" } },
        { id: "cs-002-4", order: 4, type: "follow_up" as const, delayDays: 0, subject: "Re: Fidelización para resorts - {empresa}", body: "Hola {nombre},\n\nSeguimiento rápido...", sent: 22, opened: 14, replied: 3, bounced: 0 },
        { id: "cs-002-5", order: 5, type: "wait" as const, delayDays: 5, subject: "", body: "" },
        { id: "cs-002-6", order: 6, type: "breakup" as const, delayDays: 0, subject: "Cerrando el ciclo - {empresa}", body: "Hola {nombre},\n\nNo quiero ser insistente...", sent: 10, opened: 6, replied: 1, bounced: 0 },
      ],
    },
    {
      id: "camp-003", name: "Re-engagement Inactivos", status: "draft" as const,
      enrolledCount: 0, totalSent: 0, totalOpened: 0, totalReplied: 0, totalBounced: 0,
      identityId: "id-001", listIds: [],
      steps: [
        { id: "cs-003-1", order: 1, type: "email" as const, delayDays: 0, subject: "Novedades en Fideltour para {empresa}", body: "Hola {nombre},\n\nHace un tiempo hablamos..." },
        { id: "cs-003-2", order: 2, type: "wait" as const, delayDays: 5, subject: "", body: "" },
        { id: "cs-003-3", order: 3, type: "breakup" as const, delayDays: 0, subject: "Último contacto - {empresa}", body: "Hola {nombre},\n\nEntiendo que los tiempos no siempre coinciden..." },
      ],
    },
  ];
  for (const camp of campaignsData) {
    const { steps, ...campData } = camp;
    await prisma.campaign.create({ data: campData });
    for (const step of steps) {
      await prisma.campaignStep.create({ data: { ...step, campaignId: camp.id } });
    }
  }
  console.log("  ✅ Campaigns (3) + Steps");

  // Enrichment Attempts
  const enrichments = [
    { id: "ea-001", leadId: "lead-001", provider: "Clearbit", status: "success" as const, confidence: 0.95, fieldsFound: ["email", "title", "company", "phone", "linkedin"], payload: { source: "clearbit", matchType: "domain" }, timestamp: new Date("2026-02-08T10:00:00Z") },
    { id: "ea-002", leadId: "lead-001", provider: "Hunter.io", status: "success" as const, confidence: 0.90, fieldsFound: ["email", "title"], payload: { source: "hunter", matchType: "email_pattern" }, timestamp: new Date("2026-02-08T10:05:00Z") },
    { id: "ea-003", leadId: "lead-002", provider: "Clearbit", status: "success" as const, confidence: 0.92, fieldsFound: ["email", "title", "company", "phone"], payload: { source: "clearbit", matchType: "domain" }, timestamp: new Date("2026-02-06T14:00:00Z") },
    { id: "ea-004", leadId: "lead-002", provider: "ZoomInfo", status: "partial" as const, confidence: 0.78, fieldsFound: ["email", "company"], payload: { source: "zoominfo", matchType: "company_search" }, timestamp: new Date("2026-02-06T14:05:00Z") },
    { id: "ea-005", leadId: "lead-003", provider: "Hunter.io", status: "success" as const, confidence: 0.88, fieldsFound: ["email", "title", "company"], payload: { source: "hunter", matchType: "email_pattern" }, timestamp: new Date("2026-02-10T09:00:00Z") },
    { id: "ea-006", leadId: "lead-004", provider: "Clearbit", status: "success" as const, confidence: 0.94, fieldsFound: ["email", "title", "company", "phone", "linkedin"], payload: { source: "clearbit", matchType: "domain" }, timestamp: new Date("2026-02-12T11:00:00Z") },
    { id: "ea-007", leadId: "lead-005", provider: "Hunter.io", status: "partial" as const, confidence: 0.72, fieldsFound: ["email", "company"], payload: { source: "hunter", matchType: "guess" }, timestamp: new Date("2026-02-14T10:00:00Z") },
    { id: "ea-008", leadId: "lead-005", provider: "Snov.io", status: "success" as const, confidence: 0.82, fieldsFound: ["email", "title", "phone"], payload: { source: "snov", matchType: "domain_search" }, timestamp: new Date("2026-02-14T10:10:00Z") },
    { id: "ea-009", leadId: "lead-006", provider: "Hunter.io", status: "failed" as const, confidence: 0, fieldsFound: [], payload: { source: "hunter", error: "domain_not_found" }, timestamp: new Date("2026-02-05T11:00:00Z") },
    { id: "ea-010", leadId: "lead-007", provider: "Clearbit", status: "success" as const, confidence: 0.85, fieldsFound: ["email", "title", "company"], payload: { source: "clearbit", matchType: "domain" }, timestamp: new Date("2026-02-08T10:00:00Z") },
  ];
  for (const e of enrichments) {
    await prisma.enrichmentAttempt.create({ data: e });
  }
  console.log("  ✅ Enrichment Attempts (10)");

  // Event Logs (subset)
  const events = [
    { id: "ev-001", leadId: "lead-001", type: "discovered", description: "Lead descubierto vía Google Search", metadata: { searchJobId: "sj-001", source: "Google Search" }, timestamp: new Date("2026-01-18T09:15:00Z") },
    { id: "ev-002", leadId: "lead-001", type: "qualified", description: "Lead cualificado - ICP score 95", metadata: { icpScore: "95" }, timestamp: new Date("2026-01-20T10:00:00Z") },
    { id: "ev-003", leadId: "lead-001", type: "enriched", description: "Enriquecido vía Clearbit + Hunter.io", metadata: { providers: "Clearbit, Hunter.io", confidence: "0.95" }, timestamp: new Date("2026-02-08T10:05:00Z") },
    { id: "ev-005", leadId: "lead-001", type: "enrolled", description: "Inscrito en secuencia 'Outreach Hoteles España'", metadata: { sequenceId: "seq-001" }, timestamp: new Date("2026-02-09T09:00:00Z") },
    { id: "ev-006", leadId: "lead-001", type: "email_sent", description: "Email 1 enviado", metadata: { step: "1" }, timestamp: new Date("2026-02-09T09:30:00Z") },
    { id: "ev-010", leadId: "lead-001", type: "email_replied", description: "Respuesta recibida al Follow-up 1", metadata: { step: "2" }, timestamp: new Date("2026-02-13T10:45:00Z") },
    { id: "ev-012", leadId: "lead-001", type: "synced", description: "Sincronizado con Zoho CRM como Lead ZL-4829103", metadata: { zohoLeadId: "ZL-4829103" }, timestamp: new Date("2026-02-15T08:30:00Z") },
    { id: "ev-013", leadId: "lead-002", type: "discovered", description: "Lead descubierto vía Google Search", metadata: { searchJobId: "sj-001" }, timestamp: new Date("2026-01-20T11:30:00Z") },
    { id: "ev-027", leadId: "lead-007", type: "excluded", description: "Lead excluido - Cliente actual en Zoho CRM", metadata: { reason: "zoho_client" }, timestamp: new Date("2026-02-10T15:30:00Z") },
  ];
  for (const e of events) {
    await prisma.eventLog.create({ data: e });
  }
  console.log("  ✅ Event Logs");

  // Suppression Entries
  const suppressions = [
    { id: "sup-001", type: "email" as const, value: "info@sierrahotel.mx", reason: "Cliente actual", source: "zoho" as const },
    { id: "sup-002", type: "domain" as const, value: "sierrahotel.mx", reason: "Cuenta existente en Zoho", source: "zoho" as const },
    { id: "sup-003", type: "email" as const, value: "reservas@cascaishotel.pt", reason: "Unsubscribe", source: "campaigns" as const },
    { id: "sup-004", type: "email" as const, value: "info@hotelexistente.es", reason: "Do Not Contact", source: "manual" as const },
    { id: "sup-005", type: "domain" as const, value: "hotelexistente.es", reason: "Strategic account", source: "manual" as const },
  ];
  for (const s of suppressions) {
    await prisma.suppressionEntry.create({ data: s });
  }
  console.log("  ✅ Suppression Entries");

  // Exclusion Rules
  const rules = [
    { id: "er-001", name: "Supresión local por email", type: "local_email", enabled: true, config: {}, description: "Verificar si el email está en la lista de supresión local" },
    { id: "er-002", name: "Supresión local por dominio", type: "local_domain", enabled: true, config: {}, description: "Verificar si el dominio está en la lista de supresión local" },
    { id: "er-003", name: "Cliente actual en Zoho", type: "zoho_client", enabled: true, config: {}, description: "Verificar si el contacto pertenece a un cliente actual en Zoho CRM" },
    { id: "er-004", name: "Prospecto activo en Zoho", type: "zoho_active_prospect", enabled: true, config: { daysThreshold: 90 }, description: "Verificar si ya hay un prospecto activo en Zoho CRM" },
    { id: "er-005", name: "Do Not Contact (Zoho)", type: "zoho_dnc", enabled: true, config: {}, description: "Verificar flag de Do Not Contact en Zoho CRM" },
    { id: "er-006", name: "Unsubscribe (Campaigns)", type: "campaigns_unsub", enabled: true, config: {}, description: "Verificar si se ha dado de baja en Zoho Campaigns" },
    { id: "er-007", name: "Actividad comercial reciente", type: "recent_activity", enabled: true, config: { daysThreshold: 60 }, description: "Verificar si ha habido actividad comercial en los últimos N días" },
    { id: "er-008", name: "Cuenta estratégica", type: "strategic_flag", enabled: true, config: {}, description: "Verificar si la cuenta está marcada como estratégica/gestionada manualmente" },
  ];
  for (const r of rules) {
    await prisma.exclusionRule.create({ data: r });
  }
  console.log("  ✅ Exclusion Rules");

  // Inbox Threads with messages
  const threads = [
    {
      id: "thread-001", leadId: "lead-001", leadName: "Carlos Martínez", leadCompany: "Gran Hotel Barcelona", campaignId: "camp-001", aiTag: "meeting_requested" as const, unread: false,
      messages: [
        { id: "msg-001-1", direction: "outbound" as const, subject: "Incrementa la fidelización de tus huéspedes con Gran Hotel Barcelona", body: "Hola Carlos,\n\nSoy del equipo de Fideltour...", timestamp: new Date("2026-02-09T09:30:00Z") },
        { id: "msg-001-2", direction: "outbound" as const, subject: "Re: Incrementa la fidelización", body: "Hola Carlos,\n\nQuería hacer seguimiento...", timestamp: new Date("2026-02-12T09:30:00Z") },
        { id: "msg-001-3", direction: "inbound" as const, subject: "Re: Incrementa la fidelización", body: "Hola,\n\nGracias por el seguimiento. Me interesa mucho...\n\nCarlos Martínez", timestamp: new Date("2026-02-13T10:45:00Z") },
      ],
    },
    {
      id: "thread-002", leadId: "lead-002", leadName: "Ana López Ruiz", leadCompany: "Hotel Arte Madrid", campaignId: "camp-001", aiTag: "interested" as const, unread: true,
      messages: [
        { id: "msg-002-1", direction: "outbound" as const, subject: "Incrementa la fidelización con Hotel Arte Madrid", body: "Hola Ana,\n\nSoy del equipo de Fideltour...", timestamp: new Date("2026-02-10T09:30:00Z") },
        { id: "msg-002-2", direction: "inbound" as const, subject: "Re: Fidelización Hotel Arte Madrid", body: "Interesante propuesta. ¿Me podrías enviar más información?\n\nAna López", timestamp: new Date("2026-02-11T09:20:00Z") },
      ],
    },
    {
      id: "thread-003", leadId: "lead-014", leadName: "Patricia Navarro", leadCompany: "Costa del Sol Resort", campaignId: "camp-001", aiTag: "meeting_requested" as const, unread: true,
      messages: [
        { id: "msg-003-1", direction: "outbound" as const, subject: "Incrementa la fidelización con Costa del Sol Resort", body: "Hola Patricia...", timestamp: new Date("2026-02-15T09:30:00Z") },
        { id: "msg-003-3", direction: "inbound" as const, subject: "Re: Fidelización Costa del Sol", body: "Me encantaría ver una demo.\n\nPatricia Navarro", timestamp: new Date("2026-02-20T14:30:00Z") },
      ],
    },
    {
      id: "thread-004", leadId: "lead-004", leadName: "María García Hernández", leadCompany: "Playa Resort Cancún", campaignId: "camp-002", aiTag: "interested" as const, unread: false,
      messages: [
        { id: "msg-004-1", direction: "outbound" as const, subject: "Fidelización para resorts: Playa Resort Cancún", body: "Hola María...", timestamp: new Date("2026-02-14T09:30:00Z") },
        { id: "msg-004-2", direction: "inbound" as const, subject: "Re: Fidelización resorts", body: "Estamos muy interesados. Las OTAs nos están comiendo el margen.\n\nMaría García", timestamp: new Date("2026-02-15T11:00:00Z") },
      ],
    },
    {
      id: "thread-005", leadId: "lead-008", leadName: "Pedro Navarro", leadCompany: "Palacio Hoteles", campaignId: "camp-001", aiTag: "question" as const, unread: true,
      messages: [
        { id: "msg-005-1", direction: "outbound" as const, subject: "Fidelización Palacio Hoteles", body: "Hola Pedro...", timestamp: new Date("2026-02-17T09:30:00Z") },
        { id: "msg-005-2", direction: "inbound" as const, subject: "Re: Fidelización Palacio Hoteles", body: "¿Qué integraciones tienen con los PMS? Nosotros usamos Opera Cloud.\n\nPedro Navarro", timestamp: new Date("2026-02-19T16:20:00Z") },
      ],
    },
    {
      id: "thread-006", leadId: "lead-011", leadName: "Fernando Díaz", leadCompany: "Riviera Maya Resort", campaignId: "camp-002", aiTag: "not_interested" as const, unread: false,
      messages: [
        { id: "msg-006-1", direction: "outbound" as const, subject: "Fidelización: Riviera Maya Resort", body: "Hola Fernando...", timestamp: new Date("2026-02-14T09:30:00Z") },
        { id: "msg-006-3", direction: "inbound" as const, subject: "Re: Fidelización Riviera Maya", body: "Gracias pero no nos interesa. Ya tenemos un programa.\n\nFernando Díaz", timestamp: new Date("2026-02-18T10:15:00Z") },
      ],
    },
    {
      id: "thread-007", leadId: "lead-003", leadName: "Javier Ruiz Sánchez", leadCompany: "Boutique Hotel Valencia", campaignId: "camp-001", aiTag: "auto_reply" as const, unread: false,
      messages: [
        { id: "msg-007-1", direction: "outbound" as const, subject: "Fidelización Boutique Hotel Valencia", body: "Hola Javier...", timestamp: new Date("2026-02-15T09:30:00Z") },
        { id: "msg-007-2", direction: "inbound" as const, subject: "Respuesta automática: Fuera de oficina", body: "Estoy fuera de la oficina hasta el 25 de febrero.\n\nJavier Ruiz", timestamp: new Date("2026-02-16T08:00:00Z") },
      ],
    },
  ];
  for (const thread of threads) {
    const { messages, ...threadData } = thread;
    await prisma.inboxThread.create({ data: threadData });
    for (const msg of messages) {
      await prisma.inboxMessage.create({ data: { ...msg, threadId: thread.id } });
    }
  }
  console.log("  ✅ Inbox Threads (7) + Messages");

  // Activity Feed
  const activities = [
    { id: "act-001", type: "email_replied", description: "Patricia Navarro ha solicitado una reunión", leadName: "Patricia Navarro", companyName: "Costa del Sol Resort", timestamp: new Date("2026-02-20T14:30:00Z") },
    { id: "act-002", type: "enrichment", description: "8 contactos enriquecidos en la lista 'Hoteles Boutique España'", companyName: "Varios", timestamp: new Date("2026-02-20T12:00:00Z") },
    { id: "act-003", type: "email_sent", description: "12 emails enviados en campaña 'Outreach Hoteles España'", timestamp: new Date("2026-02-20T09:30:00Z") },
    { id: "act-004", type: "email_replied", description: "Gonzalo Muñoz ha preguntado sobre integraciones PMS", leadName: "Gonzalo Muñoz", companyName: "Hotel Capital Madrid", timestamp: new Date("2026-02-19T16:20:00Z") },
    { id: "act-005", type: "sync", description: "Pablo Martín sincronizado con Zoho CRM (ZL-4829310)", leadName: "Pablo Martín", companyName: "Urban Hotel Collection", timestamp: new Date("2026-02-22T11:00:00Z") },
    { id: "act-006", type: "discovery", description: "45 nuevas empresas descubiertas en búsqueda 'Hoteles Boutique España'", timestamp: new Date("2026-02-23T09:00:00Z") },
    { id: "act-007", type: "exclusion", description: "Laura Méndez excluida - Cliente actual en Zoho CRM", leadName: "Laura Méndez", companyName: "Sierra Hotel & Spa", timestamp: new Date("2026-02-10T15:30:00Z") },
    { id: "act-008", type: "campaign_started", description: "Campaña 'Outreach Resorts LATAM' activada con 8 contactos", timestamp: new Date("2026-01-20T10:30:00Z") },
    { id: "act-009", type: "contact_added", description: "4 contactos añadidos a lista 'Directores Generales España'", timestamp: new Date("2026-02-10T10:00:00Z") },
    { id: "act-010", type: "email_replied", description: "María García interesada en reducir dependencia de OTAs", leadName: "María García Hernández", companyName: "Playa Resort Cancún", timestamp: new Date("2026-02-15T11:00:00Z") },
  ];
  for (const a of activities) {
    await prisma.activityItem.create({ data: a });
  }
  console.log("  ✅ Activity Feed (10)");

  // AI Playbook
  await prisma.aIPlaybook.create({
    data: {
      id: "playbook-001",
      companyName: "Fideltour",
      website: "https://www.fideltour.com",
      industry: "Hospitality Technology / SaaS",
      description: "Fideltour es una plataforma de fidelización y CRM diseñada específicamente para la industria hotelera.",
      productsServices: ["Programa de fidelización white-label para hoteles", "Motor de reservas directas con incentivos", "CRM hotelero con segmentación de huéspedes", "Automatización de marketing por email", "Integración con PMS (Opera, Mews, Cloudbeds)", "Dashboard de analíticas de huéspedes"],
      valuePropositions: ["Incremento del 23% en reservas directas de media", "Reducción del 30% en dependencia de OTAs", "ROI positivo en los primeros 3 meses", "Implementación en menos de 2 semanas", "Sin costes de setup ni permanencia"],
      icpDefinition: "Hoteles independientes y cadenas medianas (30-500 habitaciones) en España, Portugal y Latinoamérica, con presencia en OTAs, que buscan incrementar reservas directas y fidelizar huéspedes.",
      competitors: ["Revinate", "Cendyn", "Profitroom", "The Hotels Network", "Bookassist"],
      testimonials: ["María Sánchez - Hotel Boutique Barcelona: Con Fideltour hemos aumentado nuestras reservas directas un 28% en solo 4 meses.", "Roberto López - Resort Costa del Sol: La mejor inversión que hemos hecho."],
      aiVariables: { variables: [
        { name: "pain_point", description: "Principal dolor del prospecto identificado por IA", source: "Website + LinkedIn" },
        { name: "tech_stack", description: "PMS y herramientas tecnológicas que usa el hotel", source: "Website crawling" },
        { name: "ota_dependency", description: "Nivel estimado de dependencia de OTAs", source: "Booking.com + Google Hotels" },
        { name: "recent_news", description: "Noticias recientes sobre el hotel o cadena", source: "Google News" },
      ]},
    },
  });
  console.log("  ✅ AI Playbook");

  // Enrichment Queue
  const queueItems = [
    { id: "eq-001", leadId: "lead-009", leadName: "Diego Vargas", leadCompany: "Andino Hotel Bogotá", leadEmail: "diego.vargas@andinohotel.co", status: "processing", provider: "Clearbit", priority: "normal", fieldsFound: ["email"], progress: 45, startedAt: new Date("2026-02-24T08:30:00Z") },
    { id: "eq-002", leadId: "lead-014", leadName: "Elena Torres", leadCompany: "Costa del Sol Resort", leadEmail: "patricia.navarro@costadelsol.es", status: "processing", provider: "Apollo.io", priority: "normal", fieldsFound: ["email", "title"], progress: 52, startedAt: new Date("2026-02-24T08:28:00Z") },
    { id: "eq-003", leadId: "lead-015", leadName: "Miguel Santos", leadCompany: "Porto Palace Hotel", leadEmail: "miguel.santos@portopalace.pt", status: "queued", provider: "Clearbit", priority: "normal", fieldsFound: [], progress: 0, startedAt: new Date("2026-02-24T08:35:00Z") },
    { id: "eq-005", leadId: "lead-001", leadName: "Carlos Martínez", leadCompany: "Gran Hotel Barcelona", leadEmail: "carlos.martinez@granhotelbarcelona.com", status: "completed", provider: "Clearbit", priority: "normal", fieldsFound: ["email", "phone", "title", "linkedin", "company"], progress: 100, startedAt: new Date("2026-02-24T07:00:00Z"), completedAt: new Date("2026-02-24T07:02:00Z") },
    { id: "eq-008", leadId: "lead-006", leadName: "Pedro Fernandes", leadCompany: "Algarve Beach Resort", leadEmail: "pedro.fernandes@algarveresort.pt", status: "failed", provider: "Hunter.io", priority: "normal", fieldsFound: [], progress: 0, startedAt: new Date("2026-02-24T06:00:00Z"), completedAt: new Date("2026-02-24T06:01:00Z"), error: "Dominio no encontrado en la base de datos" },
  ];
  for (const q of queueItems) {
    await prisma.enrichmentQueueItem.create({ data: q });
  }
  console.log("  ✅ Enrichment Queue");

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
