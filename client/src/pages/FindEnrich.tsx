import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useLists } from "@/lib/listsStore";
import {
  Search,
  Sparkles,
  Filter,
  UserPlus,
  Zap,
  Send,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  Linkedin,
  Globe,
  Building2,
  Users,
  ListPlus,
  ExternalLink,
  Info,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface SearchPerson {
  id: string;
  name: string;
  title: string;
  email: string;
  email_status: string;
  linkedin_url: string;
  photo_url?: string;
  city: string;
  state?: string;
  country: string;
  seniority?: string;
  phone: string;
  organization: {
    name: string;
    website_url: string;
    primary_domain: string;
    estimated_num_employees: number;
    industry: string;
    city: string;
    country: string;
    linkedin_url?: string;
  } | null;
}

interface SearchResponse {
  source: "apollo" | "mock";
  people: SearchPerson[];
  total: number;
  page: number;
  per_page: number;
  error?: string;
}

function EmailStatusBadge({ status }: { status: string }) {
  if (status === "verified") {
    return (
      <Badge variant="secondary" className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Verificado
      </Badge>
    );
  }
  if (status === "available") {
    return (
      <Badge variant="secondary" className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
        <Zap className="w-3 h-3 mr-1" />
        Disponible
      </Badge>
    );
  }
  if (status === "likely to engage") {
    return (
      <Badge variant="secondary" className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        Probable
      </Badge>
    );
  }
  if (status === "unverified") {
    return (
      <Badge variant="secondary" className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
        <AlertCircle className="w-3 h-3 mr-1" />
        Sin verificar
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
      <AlertCircle className="w-3 h-3 mr-1" />
      No disponible
    </Badge>
  );
}

const EXAMPLE_PROMPTS = [
  "CMO hoteles España",
  "Directores de hotel en Barcelona",
  "Revenue Managers de resorts en México",
  "CEOs de cadenas hoteleras en Colombia",
  "Directoras de marketing hoteles boutique Europa",
];

export default function FindEnrich() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchPerson[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [dataSource, setDataSource] = useState<"apollo" | "mock" | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterSeniority, setFilterSeniority] = useState<string>("all");
  const [filterSize, setFilterSize] = useState<string>("all");
  const [filterEmailStatus, setFilterEmailStatus] = useState<string>("all");

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const executeSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setSelectedPeople(new Set());

    try {
      const filters: Record<string, string[]> = {};
      if (filterCountry !== "all") filters.organization_locations = [filterCountry];
      if (filterSeniority !== "all") filters.person_seniorities = [filterSeniority];
      if (filterSize !== "all") filters.organization_num_employees_ranges = [filterSize];
      if (filterEmailStatus !== "all") filters.contact_email_status = [filterEmailStatus];

      const response = await fetch("/api/apollo/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, filters }),
      });

      const data: SearchResponse = await response.json();

      setResults(data.people);
      setTotalResults(data.total);
      setDataSource(data.source);
      setHasSearched(true);

      if (data.error) {
        toast({
          title: "Usando datos de ejemplo",
          description: data.error,
          variant: "destructive",
        });
      }

      if (data.source === "mock") {
        toast({
          title: "Modo demo",
          description: "Añade tu API Key de Apollo para buscar contactos reales de LinkedIn",
        });
      }
    } catch {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [filterCountry, filterSeniority, filterSize, filterEmailStatus, toast]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    executeSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleExampleClick = (prompt: string) => {
    setSearchQuery(prompt);
    executeSearch(prompt);
  };

  const togglePerson = (id: string) => {
    setSelectedPeople((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedPeople.size === results.length) {
      setSelectedPeople(new Set());
    } else {
      setSelectedPeople(new Set(results.map((p) => p.id)));
    }
  };

  const clearFilters = () => {
    setFilterCountry("all");
    setFilterSeniority("all");
    setFilterSize("all");
    setFilterEmailStatus("all");
  };

  const hasActiveFilters =
    filterCountry !== "all" || filterSeniority !== "all" || filterSize !== "all" || filterEmailStatus !== "all";

  const selectedContacts = results.filter((p) => selectedPeople.has(p.id));

  const { addList } = useLists();

  const handleSaveToList = async () => {
    if (!listName.trim() || selectedContacts.length === 0) return;
    setIsSaving(true);

    try {
      const contacts = selectedContacts.map((p) => ({
        id: p.id,
        name: p.name,
        title: p.title,
        email: p.email,
        email_status: p.email_status,
        phone: p.phone,
        linkedin_url: p.linkedin_url,
        city: p.city,
        country: p.country,
        company: p.organization?.name || "",
        domain: p.organization?.primary_domain || "",
        website: p.organization?.website_url || "",
        industry: p.organization?.industry || "",
        employees: p.organization?.estimated_num_employees || 0,
      }));

      addList({
        id: `list-${Date.now()}`,
        name: listName,
        contactCount: contacts.length,
        source: "search",
        contacts,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Lista creada",
        description: `"${listName}" con ${contacts.length} contactos`,
      });
      setSaveDialogOpen(false);
      setListName("");
      setSelectedPeople(new Set());
      navigate("/lists");
    } catch {
      toast({
        title: "Error",
        description: "No se pudo crear la lista",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredResults = results.filter((p) => {
    if (filterCountry !== "all" && p.organization?.country !== filterCountry && p.country !== filterCountry) return false;
    if (filterSeniority !== "all" && p.seniority !== filterSeniority) return false;
    if (filterSize !== "all") {
      const emp = p.organization?.estimated_num_employees || 0;
      const [min, max] = filterSize.split(",").map(Number);
      if (emp < min || emp > max) return false;
    }
    if (filterEmailStatus !== "all" && p.email_status !== filterEmailStatus) return false;
    return true;
  });

  const uniqueCountries = Array.from(new Set(results.map((p) => p.organization?.country || p.country).filter(Boolean)));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-page-title">Buscar y Enriquecer</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Encuentra prospectos en LinkedIn y fuentes B2B con Apollo.io
            </p>
          </div>
          {dataSource && (
            <Badge
              variant="secondary"
              className={`text-xs gap-1.5 ${dataSource === "apollo" ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"}`}
              data-testid="badge-data-source"
            >
              {dataSource === "apollo" ? (
                <>
                  <Linkedin className="w-3 h-3" />
                  Apollo.io conectado
                </>
              ) : (
                <>
                  <Info className="w-3 h-3" />
                  Datos de ejemplo
                </>
              )}
            </Badge>
          )}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  data-testid="input-icp-search"
                  placeholder='Describe tu ICP... ej: "CMO hoteles España"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>
              <Button data-testid="button-search" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="ml-2">Buscar</span>
              </Button>
              <Button data-testid="button-toggle-filters" variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4" />
                <span className="ml-2">Filtros</span>
                {hasActiveFilters && (
                  <Badge variant="default" className="ml-2 text-xs">
                    {[filterCountry, filterSeniority, filterSize, filterEmailStatus].filter((f) => f !== "all").length}
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
                    data-testid={`button-example-${prompt.substring(0, 15).replace(/\s/g, "-")}`}
                    className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors"
                    onClick={() => handleExampleClick(prompt)}
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
                <Button data-testid="button-clear-filters" variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <X className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">País empresa</label>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger data-testid="select-filter-country">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueCountries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Seniority</label>
              <Select value={filterSeniority} onValueChange={setFilterSeniority}>
                <SelectTrigger data-testid="select-filter-seniority">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="c_suite">C-Suite</SelectItem>
                  <SelectItem value="vp">VP</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="head">Head</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tamaño empresa</label>
              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger data-testid="select-filter-size">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1,50">1-50 empleados</SelectItem>
                  <SelectItem value="51,200">51-200 empleados</SelectItem>
                  <SelectItem value="201,500">201-500 empleados</SelectItem>
                  <SelectItem value="501,10000">500+ empleados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Estado email</label>
              <Select value={filterEmailStatus} onValueChange={setFilterEmailStatus}>
                <SelectTrigger data-testid="select-filter-email">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="verified">Verificado</SelectItem>
                  <SelectItem value="unverified">Sin verificar</SelectItem>
                  <SelectItem value="likely to engage">Probable</SelectItem>
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
                <p className="text-sm text-muted-foreground" data-testid="text-searching">Buscando prospectos en Apollo...</p>
              </div>
            </div>
          )}

          {!isSearching && !hasSearched && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium" data-testid="text-empty-state">Encuentra prospectos ideales</h3>
                <p className="text-sm text-muted-foreground">
                  Escribe algo como "CMO hoteles España" y el sistema buscará contactos reales en LinkedIn y bases de datos B2B
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Linkedin className="w-4 h-4" />
                  <span>Datos de LinkedIn vía Apollo.io</span>
                </div>
              </div>
            </div>
          )}

          {!isSearching && hasSearched && (
            <>
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground" data-testid="text-result-count">
                    {filteredResults.length} resultados {totalResults > filteredResults.length && `de ${totalResults} total`}
                  </span>
                </div>
                {selectedPeople.size > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {selectedPeople.size} seleccionados
                    </span>
                    <Button
                      data-testid="button-save-to-list"
                      size="sm"
                      onClick={() => {
                        setListName(searchQuery ? `Búsqueda: ${searchQuery}` : "Nueva lista");
                        setSaveDialogOpen(true);
                      }}
                    >
                      <ListPlus className="w-3.5 h-3.5 mr-1.5" />
                      Guardar en Lista
                    </Button>
                    <Button data-testid="button-enrich-selected" size="sm" variant="outline">
                      <Zap className="w-3.5 h-3.5 mr-1.5" />
                      Enriquecer
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
                            checked={filteredResults.length > 0 && selectedPeople.size === filteredResults.length}
                            onCheckedChange={toggleAll}
                          />
                        </th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Nombre</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Cargo</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Empresa</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Email</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Teléfono</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">LinkedIn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((person) => (
                        <tr
                          key={person.id}
                          data-testid={`row-person-${person.id}`}
                          className={`border-b last:border-b-0 hover:bg-muted/30 transition-colors ${selectedPeople.has(person.id) ? "bg-primary/5" : ""}`}
                        >
                          <td className="p-3">
                            <Checkbox
                              data-testid={`checkbox-person-${person.id}`}
                              checked={selectedPeople.has(person.id)}
                              onCheckedChange={() => togglePerson(person.id)}
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                                {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-medium text-foreground" data-testid={`text-name-${person.id}`}>{person.name}</span>
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <Globe className="w-3 h-3" />
                                  {person.city && `${person.city}, `}{person.country}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-muted-foreground" data-testid={`text-title-${person.id}`}>{person.title}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-muted-foreground" />
                                <span data-testid={`text-company-${person.id}`}>{person.organization?.name || "-"}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {person.organization?.industry && (
                                  <span className="text-[11px] text-muted-foreground">{person.organization.industry}</span>
                                )}
                                {person.organization?.estimated_num_employees ? (
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                                    <Users className="w-3 h-3" />
                                    {person.organization.estimated_num_employees}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {person.email ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-foreground" data-testid={`text-email-${person.id}`}>{person.email}</span>
                                <EmailStatusBadge status={person.email_status} />
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="text-xs text-muted-foreground" data-testid={`text-phone-${person.id}`}>
                              {person.phone || "-"}
                            </span>
                          </td>
                          <td className="p-3">
                            {person.linkedin_url ? (
                              <a
                                href={person.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                data-testid={`link-linkedin-${person.id}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Linkedin className="w-3.5 h-3.5" />
                                Perfil
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredResults.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
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

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar en lista</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre de la lista</label>
              <Input
                data-testid="input-list-name"
                placeholder="Ej: CMO Hoteles España"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveToList(); }}
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-foreground font-medium">{selectedContacts.length} contactos seleccionados</p>
              <div className="mt-2 space-y-1 max-h-[200px] overflow-y-auto">
                {selectedContacts.slice(0, 10).map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1">
                    <span className="text-foreground">{p.name}</span>
                    <span className="text-muted-foreground">{p.organization?.name || ""}</span>
                  </div>
                ))}
                {selectedContacts.length > 10 && (
                  <p className="text-xs text-muted-foreground mt-1">y {selectedContacts.length - 10} más...</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} data-testid="button-cancel-save">
              Cancelar
            </Button>
            <Button onClick={handleSaveToList} disabled={isSaving || !listName.trim()} data-testid="button-confirm-save">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <ListPlus className="w-4 h-4 mr-1.5" />}
              Crear lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
