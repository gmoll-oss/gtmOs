import { useState, useMemo } from "react";
import { Building2, Globe, Users, Search, MapPin, Factory, ChevronRight, ArrowLeft, ExternalLink, Sparkles, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { companies, leads, enrichmentAttempts, type Company, type Lead } from "@/lib/mockData";

const ENRICHMENT_STATUS_CONFIG: Record<string, { label: string; bgClass: string; textClass: string }> = {
  enriched: { label: "Enriquecido", bgClass: "bg-emerald-100 dark:bg-emerald-900/40", textClass: "text-emerald-700 dark:text-emerald-300" },
  partial: { label: "Parcial", bgClass: "bg-amber-100 dark:bg-amber-900/40", textClass: "text-amber-700 dark:text-amber-300" },
  pending: { label: "Pendiente", bgClass: "bg-slate-100 dark:bg-slate-800", textClass: "text-slate-700 dark:text-slate-300" },
  failed: { label: "Fallido", bgClass: "bg-red-100 dark:bg-red-900/40", textClass: "text-red-700 dark:text-red-300" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function getContactsForCompany(company: Company): Lead[] {
  return leads.filter((l) => company.contactIds.includes(l.id));
}

function CompanyProfile({ company, onBack }: { company: Company; onBack: () => void }) {
  const companyContacts = getContactsForCompany(company);
  const companyEnrichments = enrichmentAttempts.filter((ea) =>
    company.contactIds.includes(ea.leadId)
  );
  const statusCfg = ENRICHMENT_STATUS_CONFIG[company.enrichmentStatus] || ENRICHMENT_STATUS_CONFIG.pending;

  return (
    <div className="flex flex-col gap-4 p-4" data-testid="company-profile">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="icon" onClick={onBack} data-testid="button-back">
          <ArrowLeft />
        </Button>
        <h2 className="text-lg font-semibold" data-testid="text-company-name">{company.name}</h2>
        <Badge className={`${statusCfg.bgClass} ${statusCfg.textClass}`} data-testid="badge-enrichment-status">
          {statusCfg.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Datos Firmográficos</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Industria:</span>
              <span data-testid="text-industry">{company.industry}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Dominio:</span>
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1" data-testid="link-domain">
                {company.domain}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Ubicación:</span>
              <span data-testid="text-location">{company.city}, {company.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Empleados:</span>
              <span data-testid="text-employees">{company.employees}</span>
            </div>
            <div className="flex items-center gap-2">
              <Factory className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Fuente:</span>
              <span data-testid="text-source">{company.source}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <h3 className="text-sm font-semibold text-muted-foreground">Contactos ({companyContacts.length})</h3>
            <Button size="sm" variant="outline" data-testid="button-find-contacts">
              <UserPlus className="w-4 h-4 mr-1" />
              Buscar Contactos
            </Button>
          </div>
          {companyContacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No se han encontrado contactos.</p>
          ) : (
            <div className="space-y-2">
              {companyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-md border text-sm flex-wrap"
                  data-testid={`row-contact-${contact.id}`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate" data-testid={`text-contact-name-${contact.id}`}>{contact.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{contact.title}</span>
                  </div>
                  <div className="flex flex-col items-end min-w-0">
                    <span className="text-xs text-muted-foreground truncate">{contact.email}</span>
                    <Badge variant="secondary" className="text-xs mt-0.5" data-testid={`badge-contact-score-${contact.id}`}>
                      Score: {contact.score}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Historial de Enriquecimiento</h3>
        {companyEnrichments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin intentos de enriquecimiento registrados.</p>
        ) : (
          <div className="space-y-2">
            {companyEnrichments.map((ea) => {
              const statusColor =
                ea.status === "success" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" :
                ea.status === "partial" ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" :
                ea.status === "failed" ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" :
                "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
              return (
                <div key={ea.id} className="flex items-center justify-between gap-2 text-sm flex-wrap" data-testid={`row-enrichment-${ea.id}`}>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColor}>{ea.status}</Badge>
                    <span className="font-medium">{ea.provider}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs">
                    <span>{ea.fieldsFound.length > 0 ? ea.fieldsFound.join(", ") : "---"}</span>
                    <span>{formatDate(ea.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function Companies() {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [enrichmentFilter, setEnrichmentFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const industries = useMemo(() => Array.from(new Set(companies.map((c) => c.industry))).sort(), []);
  const countries = useMemo(() => Array.from(new Set(companies.map((c) => c.country))).sort(), []);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.domain.toLowerCase().includes(search.toLowerCase())) return false;
      if (industryFilter !== "all" && c.industry !== industryFilter) return false;
      if (countryFilter !== "all" && c.country !== countryFilter) return false;
      if (enrichmentFilter !== "all" && c.enrichmentStatus !== enrichmentFilter) return false;
      return true;
    });
  }, [search, industryFilter, countryFilter, enrichmentFilter]);

  const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id));

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set<string>());
    } else {
      const ids = new Set<string>();
      filtered.forEach((c) => ids.add(c.id));
      setSelected(ids);
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (selectedCompanyId) {
    const company = companies.find((c) => c.id === selectedCompanyId);
    if (company) {
      return <CompanyProfile company={company} onBack={() => setSelectedCompanyId(null)} />;
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-auto" data-testid="companies-page">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-semibold" data-testid="text-page-title">Empresas</h1>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">{selected.size} seleccionadas</span>
            <Button size="sm" variant="outline" data-testid="button-bulk-enrich">
              <Sparkles className="w-4 h-4 mr-1" />
              Enriquecer
            </Button>
            <Button size="sm" variant="outline" data-testid="button-bulk-find-contacts">
              <UserPlus className="w-4 h-4 mr-1" />
              Buscar Contactos
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empresa o dominio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-industry">
            <SelectValue placeholder="Industria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las industrias</SelectItem>
            {industries.map((ind) => (
              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-country">
            <SelectValue placeholder="País" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los países</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={enrichmentFilter} onValueChange={setEnrichmentFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-enrichment">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="enriched">Enriquecido</SelectItem>
            <SelectItem value="partial">Parcial</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="failed">Fallido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="p-3 w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleAll}
                    data-testid="checkbox-select-all"
                  />
                </th>
                <th className="p-3 font-medium">Empresa</th>
                <th className="p-3 font-medium">Dominio</th>
                <th className="p-3 font-medium">Industria</th>
                <th className="p-3 font-medium">País</th>
                <th className="p-3 font-medium text-right">Empleados</th>
                <th className="p-3 font-medium text-right">Contactos</th>
                <th className="p-3 font-medium">Estado</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => {
                const statusCfg = ENRICHMENT_STATUS_CONFIG[company.enrichmentStatus] || ENRICHMENT_STATUS_CONFIG.pending;
                const contactCount = company.contactIds.length;
                return (
                  <tr
                    key={company.id}
                    className="border-b last:border-b-0 hover-elevate cursor-pointer"
                    onClick={() => setSelectedCompanyId(company.id)}
                    data-testid={`row-company-${company.id}`}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(company.id)}
                        onCheckedChange={() => toggleOne(company.id)}
                        data-testid={`checkbox-company-${company.id}`}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium" data-testid={`text-company-name-${company.id}`}>{company.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground" data-testid={`text-domain-${company.id}`}>{company.domain}</td>
                    <td className="p-3" data-testid={`text-industry-${company.id}`}>{company.industry}</td>
                    <td className="p-3" data-testid={`text-country-${company.id}`}>{company.city}, {company.country}</td>
                    <td className="p-3 text-right" data-testid={`text-employees-${company.id}`}>{company.employees}</td>
                    <td className="p-3 text-right" data-testid={`text-contacts-${company.id}`}>{contactCount}</td>
                    <td className="p-3">
                      <Badge className={`${statusCfg.bgClass} ${statusCfg.textClass}`} data-testid={`badge-status-${company.id}`}>
                        {statusCfg.label}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">
                    No se encontraron empresas con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
