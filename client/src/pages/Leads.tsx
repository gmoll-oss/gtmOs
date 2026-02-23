import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, Filter, ChevronLeft, ChevronRight, Users, Mail, Archive, Ban, CheckCircle2, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { leads, LEAD_STATUS_CONFIG, type LeadStatus } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

const ALL_STATUSES: LeadStatus[] = [
  "discovered", "qualified", "enriched", "eligible",
  "in_sequence", "engaged", "ready_to_sync", "synced",
  "excluded", "archived"
];

const SOURCES = Array.from(new Set(leads.map(l => l.source)));

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

export default function Leads() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [exclusionFilter, setExclusionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          lead.name.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (sourceFilter !== "all" && lead.source !== sourceFilter) return false;
      if (exclusionFilter === "excluded" && !lead.excluded) return false;
      if (exclusionFilter === "included" && lead.excluded) return false;
      return true;
    });
  }, [searchQuery, statusFilter, sourceFilter, exclusionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / ITEMS_PER_PAGE));
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allOnPageSelected = paginatedLeads.length > 0 && paginatedLeads.every(l => selectedIds.has(l.id));

  function toggleAll() {
    if (allOnPageSelected) {
      const next = new Set(selectedIds);
      paginatedLeads.forEach(l => next.delete(l.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginatedLeads.forEach(l => next.add(l.id));
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
      enroll: "inscritos en secuencia",
      exclude: "excluidos",
      ready_to_sync: "marcados como listos para sync",
      archive: "archivados",
    };
    toast({
      title: `${count} lead${count > 1 ? "s" : ""} ${labels[action] || action}`,
      description: "Acción simulada con datos mock.",
    });
    setSelectedIds(new Set());
  }

  function handlePageChange(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sourceFilter, exclusionFilter]);

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-page-title">Leads</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""} encontrado{filteredLeads.length !== 1 ? "s" : ""}
          </p>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground" data-testid="text-selected-count">
              {selectedIds.size} seleccionado{selectedIds.size > 1 ? "s" : ""}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" data-testid="button-bulk-actions">
                  Acciones
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleBulkAction("enroll")} data-testid="button-bulk-enroll">
                  <Mail className="w-4 h-4 mr-2" />
                  Inscribir en secuencia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("exclude")} data-testid="button-bulk-exclude">
                  <Ban className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("ready_to_sync")} data-testid="button-bulk-sync">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Marcar listo para sync
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("archive")} data-testid="button-bulk-archive">
                  <Archive className="w-4 h-4 mr-2" />
                  Archivar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, email o empresa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {ALL_STATUSES.map(s => (
                <SelectItem key={s} value={s}>{LEAD_STATUS_CONFIG[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-source-filter">
              <SelectValue placeholder="Fuente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fuentes</SelectItem>
              {SOURCES.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={exclusionFilter} onValueChange={setExclusionFilter}>
            <SelectTrigger className="w-[160px]" data-testid="select-exclusion-filter">
              <SelectValue placeholder="Inclusión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="included">Incluidos</SelectItem>
              <SelectItem value="excluded">Excluidos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-leads">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3 w-10">
                  <Checkbox
                    checked={allOnPageSelected}
                    onCheckedChange={toggleAll}
                    data-testid="checkbox-select-all"
                  />
                </th>
                <th className="p-3 font-medium text-muted-foreground">Nombre</th>
                <th className="p-3 font-medium text-muted-foreground">Empresa</th>
                <th className="p-3 font-medium text-muted-foreground">Email</th>
                <th className="p-3 font-medium text-muted-foreground">Estado</th>
                <th className="p-3 font-medium text-muted-foreground text-center">Score</th>
                <th className="p-3 font-medium text-muted-foreground">Fuente</th>
                <th className="p-3 font-medium text-muted-foreground">Última actividad</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => {
                const statusConfig = LEAD_STATUS_CONFIG[lead.status];
                return (
                  <tr
                    key={lead.id}
                    className="border-b last:border-b-0 hover-elevate cursor-pointer"
                    onClick={() => navigate(`/lead/${lead.id}`)}
                    data-testid={`row-lead-${lead.id}`}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(lead.id)}
                        onCheckedChange={() => toggleOne(lead.id)}
                        data-testid={`checkbox-lead-${lead.id}`}
                      />
                    </td>
                    <td className="p-3">
                      <div>
                        <span className="font-medium text-foreground" data-testid={`text-name-${lead.id}`}>{lead.name}</span>
                        <p className="text-xs text-muted-foreground">{lead.title}</p>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground" data-testid={`text-company-${lead.id}`}>{lead.company}</td>
                    <td className="p-3 text-muted-foreground text-xs" data-testid={`text-email-${lead.id}`}>{lead.email}</td>
                    <td className="p-3">
                      <Badge
                        variant="secondary"
                        className={`${statusConfig.bgClass} ${statusConfig.textClass} border-0`}
                        data-testid={`badge-status-${lead.id}`}
                      >
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`font-semibold ${getScoreColor(lead.score)}`} data-testid={`text-score-${lead.id}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs" data-testid={`text-source-${lead.id}`}>{lead.source}</td>
                    <td className="p-3 text-muted-foreground text-xs" data-testid={`text-updated-${lead.id}`}>{formatDate(lead.updatedAt)}</td>
                  </tr>
                );
              })}
              {paginatedLeads.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>No se encontraron leads con los filtros aplicados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-4 p-3 border-t flex-wrap">
          <p className="text-sm text-muted-foreground" data-testid="text-pagination-info">
            Mostrando {filteredLeads.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} de {filteredLeads.length}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="icon"
                onClick={() => handlePageChange(page)}
                data-testid={`button-page-${page}`}
              >
                {page}
              </Button>
            ))}
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
