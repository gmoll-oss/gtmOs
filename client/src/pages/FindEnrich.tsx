import { useState, useMemo } from "react";
import { Search, Sparkles, Filter, UserPlus, Zap, Send, CheckCircle2, Loader2, AlertCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { leads, type Lead } from "@/lib/mockData";

type EmailStatus = "verified" | "finding" | "not_found";

function getEmailStatus(lead: Lead): EmailStatus {
  if (lead.enrichmentConfidence >= 0.85) return "verified";
  if (lead.enrichmentConfidence >= 0.5) return "finding";
  return "not_found";
}

function EmailStatusBadge({ status }: { status: EmailStatus }) {
  if (status === "verified") {
    return (
      <Badge variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Verificado
      </Badge>
    );
  }
  if (status === "finding") {
    return (
      <Badge variant="secondary" className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Buscando
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
      <AlertCircle className="w-3 h-3 mr-1" />
      No encontrado
    </Badge>
  );
}

function EnrichmentProgress({ confidence }: { confidence: number }) {
  const percent = Math.round(confidence * 100);
  let barColor = "bg-red-500";
  if (percent >= 80) barColor = "bg-emerald-500";
  else if (percent >= 50) barColor = "bg-amber-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-xs text-muted-foreground">{percent}%</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  let colorClass = "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
  if (score >= 80) colorClass = "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
  else if (score >= 60) colorClass = "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";

  return (
    <Badge variant="secondary" className={`text-xs font-semibold ${colorClass}`}>
      {score}
    </Badge>
  );
}

const EXAMPLE_PROMPTS = [
  "Directores de hotel en España con más de 50 habitaciones",
  "Revenue Managers de resorts en México",
  "CEOs de cadenas hoteleras en Colombia y Perú",
  "Directoras de marketing de hoteles boutique en Europa",
];

const ALL_COUNTRIES = Array.from(new Set(leads.map((l) => l.country)));
const ALL_INDUSTRIES = Array.from(new Set(leads.map((l) => l.industry)));
const ALL_SOURCES = Array.from(new Set(leads.map((l) => l.source)));

const COMPANY_SIZE_OPTIONS = [
  { label: "1-50", min: 1, max: 50 },
  { label: "51-100", min: 51, max: 100 },
  { label: "101-250", min: 101, max: 250 },
  { label: "250+", min: 251, max: Infinity },
];

export default function FindEnrich() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);

  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [filterCompanySize, setFilterCompanySize] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");

  const filteredLeads = useMemo(() => {
    if (!hasSearched) return [];
    let result = [...leads].filter((l) => !l.excluded);

    if (filterCountry !== "all") {
      result = result.filter((l) => l.country === filterCountry);
    }
    if (filterIndustry !== "all") {
      result = result.filter((l) => l.industry === filterIndustry);
    }
    if (filterCompanySize !== "all") {
      const size = COMPANY_SIZE_OPTIONS.find((s) => s.label === filterCompanySize);
      if (size) {
        result = result.filter((l) => l.employeeCount >= size.min && l.employeeCount <= size.max);
      }
    }
    if (filterSource !== "all") {
      result = result.filter((l) => l.source === filterSource);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.title.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          l.industry.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.score - a.score);
  }, [hasSearched, filterCountry, filterIndustry, filterCompanySize, filterSource, searchQuery]);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setHasSearched(true);
      setIsSearching(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleLead = (id: string) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const clearFilters = () => {
    setFilterCountry("all");
    setFilterIndustry("all");
    setFilterCompanySize("all");
    setFilterSource("all");
  };

  const hasActiveFilters =
    filterCountry !== "all" ||
    filterIndustry !== "all" ||
    filterCompanySize !== "all" ||
    filterSource !== "all";

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-0">
        <div className="mb-4">
          <h1 className="text-xl font-semibold" data-testid="text-page-title">Buscar y Enriquecer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Describe tu perfil de cliente ideal y encuentra prospectos relevantes
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  data-testid="input-icp-search"
                  placeholder="Describe tu ICP... ej: Directores de hotel en España con más de 50 habitaciones"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>
              <Button data-testid="button-search" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="ml-2">Buscar</span>
              </Button>
              <Button
                data-testid="button-toggle-filters"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                <span className="ml-2">Filtros</span>
                {hasActiveFilters && (
                  <Badge variant="default" className="ml-2 text-xs">
                    {[filterCountry, filterIndustry, filterCompanySize, filterSource].filter((f) => f !== "all").length}
                  </Badge>
                )}
              </Button>
            </div>

            {!hasSearched && !isSearching && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Prueba:</span>
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    data-testid={`button-example-${prompt.substring(0, 20).replace(/\s/g, "-")}`}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(prompt);
                      setIsSearching(true);
                      setTimeout(() => {
                        setHasSearched(true);
                        setIsSearching(false);
                      }, 800);
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {showFilters && (
          <div className="w-56 shrink-0 flex flex-col gap-3 overflow-y-auto">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Filtros</span>
              {hasActiveFilters && (
                <Button
                  data-testid="button-clear-filters"
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">País</label>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger data-testid="select-filter-country">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {ALL_COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Industria</label>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger data-testid="select-filter-industry">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {ALL_INDUSTRIES.map((i) => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tamaño empresa</label>
              <Select value={filterCompanySize} onValueChange={setFilterCompanySize}>
                <SelectTrigger data-testid="select-filter-size">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {COMPANY_SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s.label} value={s.label}>{s.label} empleados</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Fuente</label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger data-testid="select-filter-source">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {ALL_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {isSearching && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground" data-testid="text-searching">Buscando prospectos...</p>
              </div>
            </div>
          )}

          {!isSearching && !hasSearched && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium" data-testid="text-empty-state">Encuentra prospectos ideales</h3>
                <p className="text-sm text-muted-foreground">
                  Usa el buscador AI para describir tu perfil de cliente ideal o aplica filtros para encontrar contactos relevantes
                </p>
              </div>
            </div>
          )}

          {!isSearching && hasSearched && (
            <>
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                    {filteredLeads.length} resultados encontrados
                  </span>
                </div>
                {selectedLeads.size > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">
                      {selectedLeads.size} seleccionados
                    </span>
                    <Button data-testid="button-enrich-selected" size="sm" variant="outline">
                      <Zap className="w-3.5 h-3.5 mr-1" />
                      Enriquecer
                    </Button>
                    <Button data-testid="button-add-to-list" size="sm" variant="outline">
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      Añadir a Lista
                    </Button>
                    <Button data-testid="button-start-campaign" size="sm">
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Iniciar Campaña
                    </Button>
                  </div>
                )}
              </div>

              <Card className="flex-1 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card z-10">
                      <tr className="border-b">
                        <th className="text-left p-3 w-10">
                          <Checkbox
                            data-testid="checkbox-select-all"
                            checked={filteredLeads.length > 0 && selectedLeads.size === filteredLeads.length}
                            onCheckedChange={toggleAll}
                          />
                        </th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Nombre</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Cargo</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Empresa</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Teléfono</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Score</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Enriquecimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => {
                        const emailStatus = getEmailStatus(lead);
                        return (
                          <tr
                            key={lead.id}
                            data-testid={`row-lead-${lead.id}`}
                            className="border-b last:border-b-0 hover-elevate"
                          >
                            <td className="p-3">
                              <Checkbox
                                data-testid={`checkbox-lead-${lead.id}`}
                                checked={selectedLeads.has(lead.id)}
                                onCheckedChange={() => toggleLead(lead.id)}
                              />
                            </td>
                            <td className="p-3">
                              <span className="font-medium" data-testid={`text-name-${lead.id}`}>{lead.name}</span>
                            </td>
                            <td className="p-3 text-muted-foreground" data-testid={`text-title-${lead.id}`}>
                              {lead.title}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span data-testid={`text-company-${lead.id}`}>{lead.company}</span>
                                <span className="text-xs text-muted-foreground">{lead.country}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-xs" data-testid={`text-email-${lead.id}`}>{lead.email}</span>
                                <EmailStatusBadge status={emailStatus} />
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground text-xs" data-testid={`text-phone-${lead.id}`}>
                              {lead.phone}
                            </td>
                            <td className="p-3">
                              <ScoreBadge score={lead.score} />
                            </td>
                            <td className="p-3">
                              <EnrichmentProgress confidence={lead.enrichmentConfidence} />
                            </td>
                          </tr>
                        );
                      })}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-muted-foreground">
                            No se encontraron resultados con los filtros actuales
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
