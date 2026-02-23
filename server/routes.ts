import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const APOLLO_API_BASE = "https://api.apollo.io/api/v1";

interface ApolloSearchParams {
  person_titles?: string[];
  person_locations?: string[];
  organization_locations?: string[];
  q_keywords?: string;
  person_seniorities?: string[];
  organization_num_employees_ranges?: string[];
  contact_email_status?: string[];
  per_page?: number;
  page?: number;
}

interface ApolloPersonResult {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string;
  headline: string;
  linkedin_url: string;
  email: string;
  email_status: string;
  photo_url: string;
  city: string;
  state: string;
  country: string;
  organization?: {
    id: string;
    name: string;
    website_url: string;
    linkedin_url: string;
    primary_domain: string;
    estimated_num_employees: number;
    industry: string;
    city: string;
    state: string;
    country: string;
  };
  seniority: string;
  departments: string[];
  phone_numbers?: { raw_number: string; type: string }[];
}

function getMockResults(query: string): any[] {
  const mockPeople = [
    { id: "mock-1", name: "Carlos Martínez", title: "Director General", email: "carlos@granhotelbarcelona.com", email_status: "verified", linkedin_url: "https://linkedin.com/in/carlosmartinez", city: "Barcelona", country: "Spain", phone: "+34 612 345 678", organization: { name: "Gran Hotel Barcelona", website_url: "https://granhotelbarcelona.com", primary_domain: "granhotelbarcelona.com", estimated_num_employees: 120, industry: "Hospitality", city: "Barcelona", country: "Spain" } },
    { id: "mock-2", name: "Ana López Ruiz", title: "Revenue Manager", email: "ana.lopez@hotelartemadrid.es", email_status: "verified", linkedin_url: "https://linkedin.com/in/analopez", city: "Madrid", country: "Spain", phone: "+34 623 456 789", organization: { name: "Hotel Arte Madrid", website_url: "https://hotelartemadrid.es", primary_domain: "hotelartemadrid.es", estimated_num_employees: 85, industry: "Hospitality", city: "Madrid", country: "Spain" } },
    { id: "mock-3", name: "Patricia Navarro", title: "Directora General", email: "patricia@costadelsol.es", email_status: "verified", linkedin_url: "https://linkedin.com/in/patricianavarro", city: "Málaga", country: "Spain", phone: "+34 634 567 890", organization: { name: "Costa del Sol Resort", website_url: "https://costadelsol.es", primary_domain: "costadelsol.es", estimated_num_employees: 200, industry: "Resorts", city: "Málaga", country: "Spain" } },
    { id: "mock-4", name: "María García Hernández", title: "CEO", email: "maria@playaresort.mx", email_status: "verified", linkedin_url: "https://linkedin.com/in/mariagarcia", city: "Cancún", country: "Mexico", phone: "+52 998 765 4321", organization: { name: "Playa Resort Cancún", website_url: "https://playaresort.mx", primary_domain: "playaresort.mx", estimated_num_employees: 200, industry: "Resorts", city: "Cancún", country: "Mexico" } },
    { id: "mock-5", name: "Javier Ruiz Sánchez", title: "Director Comercial", email: "javier@boutiquevalencia.com", email_status: "verified", linkedin_url: "https://linkedin.com/in/javierruiz", city: "Valencia", country: "Spain", phone: "+34 645 678 901", organization: { name: "Boutique Hotel Valencia", website_url: "https://boutiquevalencia.com", primary_domain: "boutiquevalencia.com", estimated_num_employees: 45, industry: "Hospitality", city: "Valencia", country: "Spain" } },
    { id: "mock-6", name: "Roberto Fernández", title: "CMO", email: "roberto@palaciohoteles.es", email_status: "verified", linkedin_url: "https://linkedin.com/in/robertofernandez", city: "Sevilla", country: "Spain", phone: "+34 656 789 012", organization: { name: "Palacio Hoteles", website_url: "https://palaciohoteles.es", primary_domain: "palaciohoteles.es", estimated_num_employees: 180, industry: "Hospitality", city: "Sevilla", country: "Spain" } },
    { id: "mock-7", name: "Laura Méndez", title: "Directora de Marketing", email: "laura@sierrahotel.mx", email_status: "verified", linkedin_url: "https://linkedin.com/in/lauramendez", city: "Ciudad de México", country: "Mexico", phone: "+52 555 234 5678", organization: { name: "Sierra Hotel & Spa", website_url: "https://sierrahotel.mx", primary_domain: "sierrahotel.mx", estimated_num_employees: 95, industry: "Hospitality", city: "Ciudad de México", country: "Mexico" } },
    { id: "mock-8", name: "Fernando Díaz", title: "Director General", email: "fernando@rivieramaya.mx", email_status: "verified", linkedin_url: "https://linkedin.com/in/fernandodiaz", city: "Playa del Carmen", country: "Mexico", phone: "+52 984 567 8901", organization: { name: "Riviera Maya Resort", website_url: "https://rivieramaya.mx", primary_domain: "rivieramaya.mx", estimated_num_employees: 250, industry: "Resorts", city: "Playa del Carmen", country: "Mexico" } },
    { id: "mock-9", name: "Isabel Torres", title: "Revenue Manager", email: "isabel@lisboagrand.pt", email_status: "verified", linkedin_url: "https://linkedin.com/in/isabeltorres", city: "Lisboa", country: "Portugal", phone: "+351 912 345 678", organization: { name: "Lisboa Grand Hotel", website_url: "https://lisboagrand.pt", primary_domain: "lisboagrand.pt", estimated_num_employees: 110, industry: "Hospitality", city: "Lisboa", country: "Portugal" } },
    { id: "mock-10", name: "Pablo Martín", title: "CEO", email: "pablo@urbanhotel.es", email_status: "verified", linkedin_url: "https://linkedin.com/in/pablomartin", city: "Madrid", country: "Spain", phone: "+34 667 890 123", organization: { name: "Urban Hotel Collection", website_url: "https://urbanhotel.es", primary_domain: "urbanhotel.es", estimated_num_employees: 320, industry: "Hospitality", city: "Madrid", country: "Spain" } },
    { id: "mock-11", name: "Sofía Romero", title: "Directora de Marketing", email: "sofia@hotelplazasevilla.es", email_status: "verified", linkedin_url: "https://linkedin.com/in/sofiaromero", city: "Sevilla", country: "Spain", phone: "+34 678 901 234", organization: { name: "Hotel Plaza Sevilla", website_url: "https://hotelplazasevilla.es", primary_domain: "hotelplazasevilla.es", estimated_num_employees: 65, industry: "Hospitality", city: "Sevilla", country: "Spain" } },
    { id: "mock-12", name: "Miguel Ángel Rodríguez", title: "Director General", email: "miguel@hotelmonterrey.mx", email_status: "verified", linkedin_url: "https://linkedin.com/in/miguelrodriguez", city: "Monterrey", country: "Mexico", phone: "+52 818 345 6789", organization: { name: "Hotel Monterrey Premium", website_url: "https://hotelmonterrey.mx", primary_domain: "hotelmonterrey.mx", estimated_num_employees: 140, industry: "Hospitality", city: "Monterrey", country: "Mexico" } },
  ];

  if (!query) return mockPeople;

  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return mockPeople;

  return mockPeople.filter((p) => {
    const searchable = [
      p.name, p.title, p.organization.name, p.organization.country,
      p.city, p.organization.industry, p.email,
    ].join(" ").toLowerCase();
    return words.some((w) => searchable.includes(w));
  });
}

function parseNaturalLanguageQuery(query: string): ApolloSearchParams {
  const params: ApolloSearchParams = { per_page: 25, page: 1 };
  const q = query.toLowerCase();

  const titleKeywords = ["director", "cmo", "ceo", "cto", "cfo", "revenue manager", "marketing", "gerente", "jefe", "responsable", "manager", "vp", "head"];
  const foundTitles: string[] = [];
  for (const kw of titleKeywords) {
    if (q.includes(kw)) foundTitles.push(kw);
  }
  if (foundTitles.length > 0) params.person_titles = foundTitles;

  const locationMap: Record<string, string> = {
    "españa": "Spain", "spain": "Spain", "madrid": "Madrid, Spain", "barcelona": "Barcelona, Spain",
    "valencia": "Valencia, Spain", "sevilla": "Seville, Spain", "málaga": "Malaga, Spain",
    "méxico": "Mexico", "mexico": "Mexico", "cancún": "Cancun, Mexico", "cancun": "Cancun, Mexico",
    "colombia": "Colombia", "perú": "Peru", "peru": "Peru", "chile": "Chile", "argentina": "Argentina",
    "portugal": "Portugal", "lisboa": "Lisbon, Portugal", "lisbon": "Lisbon, Portugal",
    "europa": "Europe", "latam": "Latin America", "latinoamérica": "Latin America",
    "brasil": "Brazil", "brazil": "Brazil",
  };
  const foundLocations: string[] = [];
  for (const [key, value] of Object.entries(locationMap)) {
    if (q.includes(key)) foundLocations.push(value);
  }
  if (foundLocations.length > 0) params.organization_locations = foundLocations;

  const industryKeywords = ["hotel", "hoteles", "resort", "resorts", "hospitality", "hostelería", "turismo", "tourism"];
  const foundIndustry = industryKeywords.some((kw) => q.includes(kw));
  if (foundIndustry) {
    params.q_keywords = "hotel OR resort OR hospitality";
  }

  const seniorityMap: Record<string, string> = {
    "ceo": "c_suite", "cmo": "c_suite", "cto": "c_suite", "cfo": "c_suite",
    "vp": "vp", "vice president": "vp",
    "director": "director", "directora": "director",
    "head": "head", "jefe": "head",
    "manager": "manager", "gerente": "manager", "responsable": "manager",
  };
  const foundSeniorities: string[] = [];
  for (const [key, value] of Object.entries(seniorityMap)) {
    if (q.includes(key) && !foundSeniorities.includes(value)) foundSeniorities.push(value);
  }
  if (foundSeniorities.length > 0) params.person_seniorities = foundSeniorities;

  const sizeMatch = q.match(/(\d+)\s*(?:habitaciones|empleados|rooms|employees)/);
  if (sizeMatch) {
    const num = parseInt(sizeMatch[1]);
    if (num <= 50) params.organization_num_employees_ranges = ["1,50"];
    else if (num <= 100) params.organization_num_employees_ranges = ["51,200"];
    else if (num <= 250) params.organization_num_employees_ranges = ["101,500"];
    else params.organization_num_employees_ranges = ["201,10000"];
  }

  return params;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/apollo/search", async (req: Request, res: Response) => {
    try {
      const { query, filters } = req.body;

      const apolloApiKey = process.env.APOLLO_API_KEY;

      if (!apolloApiKey) {
        const results = getMockResults(query || "");
        return res.json({
          source: "mock",
          people: results,
          total: results.length,
          page: 1,
          per_page: 25,
        });
      }

      const searchParams = parseNaturalLanguageQuery(query || "");

      if (filters?.person_titles?.length) searchParams.person_titles = filters.person_titles;
      if (filters?.organization_locations?.length) searchParams.organization_locations = filters.organization_locations;
      if (filters?.organization_num_employees_ranges?.length) searchParams.organization_num_employees_ranges = filters.organization_num_employees_ranges;
      if (filters?.person_seniorities?.length) searchParams.person_seniorities = filters.person_seniorities;
      if (filters?.contact_email_status?.length) searchParams.contact_email_status = filters.contact_email_status;

      const response = await fetch(`${APOLLO_API_BASE}/mixed_people/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apolloApiKey,
        },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Apollo API error:", response.status, errorText);
        const fallback = getMockResults(query || "");
        return res.json({
          source: "mock",
          people: fallback,
          total: fallback.length,
          page: 1,
          per_page: 25,
          error: `Apollo API error: ${response.status}`,
        });
      }

      const data = await response.json();

      const people = (data.people || []).map((p: ApolloPersonResult) => ({
        id: p.id,
        name: p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim(),
        title: p.title || "",
        email: p.email || "",
        email_status: p.email_status || "unavailable",
        linkedin_url: p.linkedin_url || "",
        photo_url: p.photo_url || "",
        city: p.city || "",
        state: p.state || "",
        country: p.country || "",
        seniority: p.seniority || "",
        phone: p.phone_numbers?.[0]?.raw_number || "",
        organization: p.organization ? {
          name: p.organization.name || "",
          website_url: p.organization.website_url || "",
          primary_domain: p.organization.primary_domain || "",
          estimated_num_employees: p.organization.estimated_num_employees || 0,
          industry: p.organization.industry || "",
          city: p.organization.city || "",
          country: p.organization.country || "",
          linkedin_url: p.organization.linkedin_url || "",
        } : null,
      }));

      res.json({
        source: "apollo",
        people,
        total: data.pagination?.total_entries || people.length,
        page: data.pagination?.page || 1,
        per_page: data.pagination?.per_page || 25,
      });
    } catch (error) {
      console.error("Search error:", error);
      const fallback = getMockResults("");
      res.json({
        source: "mock",
        people: fallback,
        total: fallback.length,
        page: 1,
        per_page: 25,
        error: "Search failed, showing mock data",
      });
    }
  });

  app.post("/api/lists", async (req: Request, res: Response) => {
    try {
      const { name, contacts } = req.body;
      if (!name || !contacts || !Array.isArray(contacts)) {
        return res.status(400).json({ error: "name and contacts are required" });
      }

      const list = {
        id: `list-${Date.now()}`,
        name,
        contactCount: contacts.length,
        source: "search" as const,
        contacts,
        createdAt: new Date().toISOString(),
      };

      res.json(list);
    } catch (error) {
      console.error("Create list error:", error);
      res.status(500).json({ error: "Failed to create list" });
    }
  });

  return httpServer;
}
