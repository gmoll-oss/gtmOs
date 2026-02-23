import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  ChevronDown,
  Sparkles,
  ListPlus,
  Send,
  Ban,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  leads,
  prospectLists,
  campaigns,
  LEAD_STATUS_CONFIG,
  type LeadStatus,
} from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 15;

const ALL_STATUSES: LeadStatus[] = [
  "discovered",
  "qualified",
  "enriched",
  "eligible",
  "in_sequence",
  "engaged",
  "ready_to_sync",
  "synced",
  "excluded",
  "archived",
];

const ENRICHMENT_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "enriched", label: "Enriquecido" },
  { value: "partial", label: "Parcial" },
  { value: "not_enriched", label: "Sin enriquecer" },
];

function getScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-500 dark:text-red-400";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getListsForLead(leadId: string): string[] {
  return prospectLists
    .filter((list) => list.contactIds.includes(leadId))
    .map((list) => list.name);
}

function getCampaignsForLead(leadId: string): string[] {
  return campaigns
    .filter((c) =>
      c.listIds.some((listId) => {
        const list = prospectLists.find((l) => l.id === listId);
        return list?.contactIds.includes(leadId);
      })
    )
    .map((c) => c.name);
}

export default function Contacts() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [enrichmentFilter, setEnrichmentFilter] = useState<string>("all");
  const [listFilter, setListFilter] = useState<string>("all");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [scoreMin, setScoreMin] = useState<string>("");
  const [scoreMax, setScoreMax] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.title.toLowerCase().includes(q) ||
          lead.phone.includes(q);
        if (!matchesSearch) return false;
      }
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (enrichmentFilter !== "all") {
        if (enrichmentFilter === "enriched" && lead.enrichmentConfidence < 0.8)
          return false;
        if (
          enrichmentFilter === "partial" &&
          (lead.enrichmentConfidence < 0.4 || lead.enrichmentConfidence >= 0.8)
        )
          return false;
        if (
          enrichmentFilter === "not_enriched" &&
          lead.enrichmentConfidence >= 0.4
        )
          return false;
      }
      if (listFilter !== "all") {
        const list = prospectLists.find((l) => l.id === listFilter);
        if (!list || !list.contactIds.includes(lead.id)) return false;
      }
      if (campaignFilter !== "all") {
        const campaign = campaigns.find((c) => c.id === campaignFilter);
        if (!campaign) return false;
        const inCampaign = campaign.listIds.some((listId) => {
          const list = prospectLists.find((l) => l.id === listId);
          return list?.contactIds.includes(lead.id);
        });
        if (!inCampaign) return false;
      }
      if (scoreMin && lead.score < parseInt(scoreMin)) return false;
      if (scoreMax && lead.score > parseInt(scoreMax)) return false;
      return true;
    });
  }, [
    searchQuery,
    statusFilter,
    enrichmentFilter,
    listFilter,
    campaignFilter,
    scoreMin,
    scoreMax,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)
  );
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allOnPageSelected =
    paginatedLeads.length > 0 &&
    paginatedLeads.every((l) => selectedIds.has(l.id));

  function toggleAll() {
    if (allOnPageSelected) {
      const next = new Set(selectedIds);
      paginatedLeads.forEach((l) => next.delete(l.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginatedLeads.forEach((l) => next.add(l.id));
      setSelectedIds(next);
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function handleBulkAction(action: string) {
    const count = selectedIds.size;
    if (count === 0) return;
    const labels: Record<string, string> = {
      enrich: "enviados a enriquecer",
      add_to_list: "agregados a lista",
      add_to_campaign: "agregados a campaña",
      exclude: "excluidos",
    };
    toast({
      title: `${count} contacto${count > 1 ? "s" : ""} ${labels[action] || action}`,
      description: "Accion simulada con datos mock.",
    });
    setSelectedIds(new Set());
  }

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }

  function clearFilters() {
    setStatusFilter("all");
    setEnrichmentFilter("all");
    setListFilter("all");
    setCampaignFilter("all");
    setScoreMin("");
    setScoreMax("");
    setSearchQuery("");
  }

  const hasActiveFilters =
    statusFilter !== "all" ||
    enrichmentFilter !== "all" ||
    listFilter !== "all" ||
    campaignFilter !== "all" ||
    scoreMin !== "" ||
    scoreMax !== "";

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    statusFilter,
    enrichmentFilter,
    listFilter,
    campaignFilter,
    scoreMin,
    scoreMax,
  ]);

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1
            className="text-xl font-semibold text-foreground"
            data-testid="text-page-title"
          >
            Contactos
          </h1>
          <p
            className="text-sm text-muted-foreground mt-0.5"
            data-testid="text-contact-count"
          >
            {filteredLeads.length} contacto
            {filteredLeads.length !== 1 ? "s" : ""} encontrado
            {filteredLeads.length !== 1 ? "s" : ""}
          </p>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm text-muted-foreground"
              data-testid="text-selected-count"
            >
              {selectedIds.size} seleccionado
              {selectedIds.size > 1 ? "s" : ""}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" data-testid="button-bulk-actions">
                  Acciones
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleBulkAction("enrich")}
                  data-testid="button-bulk-enrich"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enriquecer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkAction("add_to_list")}
                  data-testid="button-bulk-add-list"
                >
                  <ListPlus className="w-4 h-4 mr-2" />
                  Agregar a lista
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkAction("add_to_campaign")}
                  data-testid="button-bulk-add-campaign"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Agregar a campaña
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleBulkAction("exclude")}
                  data-testid="button-bulk-exclude"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre, email, empresa, cargo o telefono..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="w-[170px]"
            data-testid="select-status-filter"
          >
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {LEAD_STATUS_CONFIG[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={showAdvancedFilters ? "secondary" : "outline"}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          data-testid="button-advanced-filters"
        >
          <SlidersHorizontal className="w-4 h-4 mr-1.5" />
          Filtros
          {hasActiveFilters && (
            <Badge variant="default" className="ml-1.5 text-[10px] rounded-full">
              {
                [
                  statusFilter !== "all",
                  enrichmentFilter !== "all",
                  listFilter !== "all",
                  campaignFilter !== "all",
                  scoreMin !== "",
                  scoreMax !== "",
                ].filter(Boolean).length
              }
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            data-testid="button-clear-filters"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {showAdvancedFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[12px] text-muted-foreground mb-1.5 block">
                Enriquecimiento
              </label>
              <Select
                value={enrichmentFilter}
                onValueChange={setEnrichmentFilter}
              >
                <SelectTrigger data-testid="select-enrichment-filter">
                  <SelectValue placeholder="Enriquecimiento" />
                </SelectTrigger>
                <SelectContent>
                  {ENRICHMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[12px] text-muted-foreground mb-1.5 block">
                Lista
              </label>
              <Select value={listFilter} onValueChange={setListFilter}>
                <SelectTrigger data-testid="select-list-filter">
                  <SelectValue placeholder="Lista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las listas</SelectItem>
                  {prospectLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[12px] text-muted-foreground mb-1.5 block">
                Campaña
              </label>
              <Select
                value={campaignFilter}
                onValueChange={setCampaignFilter}
              >
                <SelectTrigger data-testid="select-campaign-filter">
                  <SelectValue placeholder="Campaña" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las campañas</SelectItem>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[12px] text-muted-foreground mb-1.5 block">
                Rango de Score
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={scoreMin}
                  onChange={(e) => setScoreMin(e.target.value)}
                  min={0}
                  max={100}
                  data-testid="input-score-min"
                />
                <span className="text-muted-foreground text-sm">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={scoreMax}
                  onChange={(e) => setScoreMax(e.target.value)}
                  min={0}
                  max={100}
                  data-testid="input-score-max"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table
            className="w-full text-[13px]"
            data-testid="table-contacts"
          >
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 w-10 text-left">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleAll}
                    data-testid="checkbox-select-all"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-4 py-3 text-left font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
                  Telefono
                </th>
                <th className="px-4 py-3 text-left font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
                  Score
                </th>
                <th className="px-4 py-3 text-left font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
                  Listas
                </th>
                <th className="px-4 py-3 text-left font-medium text-[12px] text-muted-foreground uppercase tracking-wider">
                  Ultima actividad
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => {
                const statusConfig = LEAD_STATUS_CONFIG[lead.status];
                const leadLists = getListsForLead(lead.id);
                return (
                  <tr
                    key={lead.id}
                    className="border-b last:border-b-0 hover-elevate cursor-pointer transition-colors"
                    onClick={() => navigate(`/contact/${lead.id}`)}
                    data-testid={`row-contact-${lead.id}`}
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedIds.has(lead.id)}
                        onCheckedChange={() => toggleOne(lead.id)}
                        data-testid={`checkbox-contact-${lead.id}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span
                          className="font-medium text-foreground leading-tight"
                          data-testid={`text-name-${lead.id}`}
                        >
                          {lead.name}
                        </span>
                        <span className="text-[12px] text-muted-foreground leading-tight mt-0.5">
                          {lead.title}
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground"
                      data-testid={`text-company-${lead.id}`}
                    >
                      {lead.company}
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground text-[12px]"
                      data-testid={`text-email-${lead.id}`}
                    >
                      {lead.email}
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground text-[12px]"
                      data-testid={`text-phone-${lead.id}`}
                    >
                      {lead.phone}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={`${statusConfig.bgClass} ${statusConfig.textClass} border-0 rounded-full text-[11px] font-medium`}
                        data-testid={`badge-status-${lead.id}`}
                      >
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-semibold text-[13px] ${getScoreColor(lead.score)}`}
                        data-testid={`text-score-${lead.id}`}
                      >
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {leadLists.length > 0 ? (
                          leadLists.length <= 2 ? (
                            leadLists.map((name) => (
                              <Badge
                                key={name}
                                variant="secondary"
                                className="text-[10px] rounded-full"
                              >
                                {name}
                              </Badge>
                            ))
                          ) : (
                            <>
                              <Badge
                                variant="secondary"
                                className="text-[10px] rounded-full"
                              >
                                {leadLists[0]}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="text-[10px] rounded-full"
                              >
                                +{leadLists.length - 1}
                              </Badge>
                            </>
                          )
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            —
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      className="px-4 py-3 text-muted-foreground text-[12px]"
                      data-testid={`text-updated-${lead.id}`}
                    >
                      {formatDate(lead.updatedAt)}
                    </td>
                  </tr>
                );
              })}
              {paginatedLeads.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm" data-testid="text-no-results">
                      No se encontraron contactos con los filtros aplicados.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 py-3 border-t flex-wrap">
          <p
            className="text-[12px] text-muted-foreground"
            data-testid="text-pagination-info"
          >
            Mostrando{" "}
            {filteredLeads.length === 0
              ? 0
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            –{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} de{" "}
            {filteredLeads.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page: number;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="icon"
                  onClick={() => handlePageChange(page)}
                  data-testid={`button-page-${page}`}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              data-testid="button-next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
