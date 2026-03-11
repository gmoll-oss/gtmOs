import { useState, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useLists } from "@/lib/listsStore";
import {
  Search,
  Sparkles,
  Filter,
  Zap,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  Linkedin,
  Globe,
  Building2,
  Users,
  ListPlus,
  Info,
  Clock,
  XCircle,
  ArrowRight,
  Database,
  BarChart3,
  RefreshCw,
  ChevronDown,
  ChevronRight,

  CheckCircle,
  AlertTriangle,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  leads,
  enrichmentAttempts,
  enrichmentQueue,
  ENRICHMENT_PROVIDERS,
  ENRICHMENT_FIELD_LABELS,
  type EnrichmentQueueItem,
} from "@/lib/mockData";

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

type ActiveTab = "search" | "enrichment";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin}min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function QueueStatusBadge({ status }: { status: EnrichmentQueueItem["status"] }) {
  switch (status) {
    case "processing":
      return (
        <Badge variant="secondary" className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Procesando
        </Badge>
      );
    case "queued":
      return (
        <Badge variant="secondary" className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 gap-1">
          <Clock className="w-3 h-3" />
          En cola
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="secondary" className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 gap-1">
          <CheckCircle className="w-3 h-3" />
          Completado
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="secondary" className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 gap-1">
          <XCircle className="w-3 h-3" />
          Error
        </Badge>
      );
  }
}

function FieldBadges({ requested, found }: { requested: string[]; found: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {requested.map((field) => {
        const isFound = found.includes(field);
        const label = ENRICHMENT_FIELD_LABELS[field] || field;
        return (
          <span
            key={field}
            className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded ${
              isFound
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isFound && <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />}
            {label}
          </span>
        );
      })}
    </div>
  );
}

function EnrichmentDashboard() {
  const [queueFilter, setQueueFilter] = useState<"all" | "processing" | "queued" | "completed" | "failed">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const queueStats = useMemo(() => {
    const processing = enrichmentQueue.filter((q) => q.status === "processing").length;
    const queued = enrichmentQueue.filter((q) => q.status === "queued").length;
    const completed = enrichmentQueue.filter((q) => q.status === "completed").length;
    const failed = enrichmentQueue.filter((q) => q.status === "failed").length;
    const total = enrichmentQueue.length;

    const completedItems = enrichmentQueue.filter((q) => q.status === "completed");
    const avgConfidence = completedItems.length > 0
      ? completedItems.reduce((sum, q) => sum + q.confidence, 0) / completedItems.length
      : 0;

    const totalFieldsRequested = completedItems.reduce((sum, q) => sum + q.fieldsRequested.length, 0);
    const totalFieldsFound = completedItems.reduce((sum, q) => sum + q.fieldsFound.length, 0);
    const fieldCoverage = totalFieldsRequested > 0 ? (totalFieldsFound / totalFieldsRequested) * 100 : 0;

    return { processing, queued, completed, failed, total, avgConfidence, fieldCoverage };
  }, []);

  const leadsEnrichmentStats = useMemo(() => {
    const enriched = leads.filter((l) => l.lastEnrichedAt !== null).length;
    const pending = leads.filter((l) => l.lastEnrichedAt === null && !l.excluded).length;
    const highConfidence = leads.filter((l) => l.enrichmentConfidence >= 0.85).length;
    const lowConfidence = leads.filter((l) => l.enrichmentConfidence > 0 && l.enrichmentConfidence < 0.7).length;
    return { enriched, pending, highConfidence, lowConfidence, total: leads.length };
  }, []);

  const providerStats = useMemo(() => {
    const stats: Record<string, { total: number; success: number; partial: number; failed: number }> = {};
    for (const attempt of enrichmentAttempts) {
      if (!stats[attempt.provider]) {
        stats[attempt.provider] = { total: 0, success: 0, partial: 0, failed: 0 };
      }
      stats[attempt.provider].total++;
      if (attempt.status === "success") stats[attempt.provider].success++;
      else if (attempt.status === "partial") stats[attempt.provider].partial++;
      else if (attempt.status === "failed") stats[attempt.provider].failed++;
    }
    return stats;
  }, []);

  const filteredQueue = useMemo(() => {
    if (queueFilter === "all") return enrichmentQueue;
    return enrichmentQueue.filter((q) => q.status === queueFilter);
  }, [queueFilter]);

  const recentHistory = useMemo(() => {
    return [...enrichmentAttempts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }, []);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-4 gap-3" data-testid="enrichment-kpi-cards">
          <Card data-testid="kpi-enrichment-rate">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <Badge variant="secondary" className="text-[10px]">{leadsEnrichmentStats.enriched}/{leadsEnrichmentStats.total}</Badge>
              </div>
              <p className="text-2xl font-bold">{Math.round((leadsEnrichmentStats.enriched / leadsEnrichmentStats.total) * 100)}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tasa de enriquecimiento</p>
              <Progress value={(leadsEnrichmentStats.enriched / leadsEnrichmentStats.total) * 100} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card data-testid="kpi-active-queue">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <RefreshCw className="w-4 h-4 text-blue-500" />
                {queueStats.processing > 0 && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                )}
              </div>
              <p className="text-2xl font-bold">{queueStats.processing + queueStats.queued}</p>
              <p className="text-xs text-muted-foreground mt-0.5">En cola / Procesando</p>
              <div className="flex gap-1 mt-2">
                <span className="text-[10px] text-blue-600 dark:text-blue-400">{queueStats.processing} activos</span>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400">{queueStats.queued} en espera</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="kpi-avg-confidence">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <Badge variant="secondary" className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  {leadsEnrichmentStats.highConfidence} altos
                </Badge>
              </div>
              <p className="text-2xl font-bold">{Math.round(queueStats.avgConfidence * 100)}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Confianza promedio</p>
              <Progress value={queueStats.avgConfidence * 100} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card data-testid="kpi-field-coverage">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Database className="w-4 h-4 text-primary" />
                {leadsEnrichmentStats.pending > 0 && (
                  <Badge variant="secondary" className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                    {leadsEnrichmentStats.pending} pendientes
                  </Badge>
                )}
              </div>
              <p className="text-2xl font-bold">{Math.round(queueStats.fieldCoverage)}%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Cobertura de campos</p>
              <Progress value={queueStats.fieldCoverage} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-5 gap-2" data-testid="provider-stats">
          {ENRICHMENT_PROVIDERS.map((provider) => {
            const stats = providerStats[provider.name];
            const successRate = stats ? Math.round((stats.success / stats.total) * 100) : provider.successRate;
            const total = stats?.total || 0;
            return (
              <Card key={provider.id} className="hover:border-primary/30 transition-colors" data-testid={`provider-card-${provider.id}`}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: provider.color }} />
                    <span className="text-xs font-medium truncate">{provider.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">{successRate}%</span>
                    <span className="text-[10px] text-muted-foreground">éxito</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-muted-foreground">{total} intentos</span>
                    {stats && stats.failed > 0 && (
                      <>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-red-500">{stats.failed} fallos</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card data-testid="enrichment-queue">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Cola de enriquecimiento
                {queueStats.processing > 0 && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                )}
              </CardTitle>
              <div className="flex gap-1">
                {(["all", "processing", "queued", "completed", "failed"] as const).map((f) => {
                  const labels = { all: "Todos", processing: "Activos", queued: "En cola", completed: "Completados", failed: "Errores" };
                  const counts = { all: queueStats.total, processing: queueStats.processing, queued: queueStats.queued, completed: queueStats.completed, failed: queueStats.failed };
                  return (
                    <Button
                      key={f}
                      variant={queueFilter === f ? "default" : "ghost"}
                      size="sm"
                      className="h-7 text-xs px-2"
                      onClick={() => setQueueFilter(f)}
                      data-testid={`button-queue-filter-${f}`}
                    >
                      {labels[f]}
                      {counts[f] > 0 && (
                        <span className="ml-1 text-[10px] opacity-70">({counts[f]})</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Lista</TableHead>
                  <TableHead>Proveedores</TableHead>
                  <TableHead>Campos</TableHead>
                  <TableHead>Confianza</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueue.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No hay elementos en esta categoría
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQueue.map((item) => (
                    <>
                      <TableRow
                        key={item.id}
                        className={`cursor-pointer hover:bg-muted/30 ${expandedId === item.id ? "bg-muted/20" : ""} ${item.status === "processing" ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        data-testid={`queue-row-${item.id}`}
                      >
                        <TableCell className="w-8 px-3">
                          {expandedId === item.id ? (
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground flex-shrink-0">
                              {item.leadName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                            </div>
                            <span className="font-medium text-sm" data-testid={`queue-name-${item.id}`}>{item.leadName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.company}</TableCell>
                        <TableCell>
                          {item.listName && (
                            <Badge variant="secondary" className="text-[10px]">{item.listName}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {item.providers.map((p) => {
                              const prov = ENRICHMENT_PROVIDERS.find((pr) => pr.name === p);
                              return (
                                <span
                                  key={p}
                                  className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-muted"
                                  title={p}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0" style={{ backgroundColor: prov?.color || "#888" }} />
                                  {p.split(".")[0]}
                                </span>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">{item.fieldsFound.length}/{item.fieldsRequested.length}</span>
                            <span className="text-[10px] text-muted-foreground">campos</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.confidence > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <Progress value={item.confidence * 100} className="h-1 w-12" />
                              <span className="text-xs font-medium">{Math.round(item.confidence * 100)}%</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <QueueStatusBadge status={item.status} />
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(item.startedAt)}</span>
                        </TableCell>
                      </TableRow>
                      {expandedId === item.id && (
                        <TableRow key={`${item.id}-detail`}>
                          <TableCell colSpan={9} className="bg-muted/10 px-8 py-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Campos solicitados</p>
                                <FieldBadges requested={item.fieldsRequested} found={item.fieldsFound} />
                              </div>
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Proveedores waterfall</p>
                                <div className="space-y-1">
                                  {item.providers.map((p, i) => {
                                    const prov = ENRICHMENT_PROVIDERS.find((pr) => pr.name === p);
                                    return (
                                      <div key={p} className="flex items-center gap-2">
                                        <span className="text-[10px] text-muted-foreground w-3">{i + 1}.</span>
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: prov?.color || "#888" }} />
                                        <span className="text-xs">{p}</span>
                                        {item.status === "completed" && (
                                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        )}
                                        {item.status === "failed" && i === item.providers.length - 1 && (
                                          <XCircle className="w-3 h-3 text-red-500" />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Detalles</p>
                                <div className="space-y-1 text-xs">
                                  <p><span className="text-muted-foreground">Inicio:</span> {new Date(item.startedAt).toLocaleString("es-ES")}</p>
                                  {item.completedAt && (
                                    <p><span className="text-muted-foreground">Fin:</span> {new Date(item.completedAt).toLocaleString("es-ES")}</p>
                                  )}
                                  {item.error && (
                                    <p className="text-red-500 flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      {item.error}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card data-testid="enrichment-history">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" />
              Historial de enriquecimiento por proveedor
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Confianza</TableHead>
                  <TableHead>Campos encontrados</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHistory.map((attempt) => {
                  const lead = leads.find((l) => l.id === attempt.leadId);
                  const prov = ENRICHMENT_PROVIDERS.find((p) => p.name === attempt.provider);
                  return (
                    <TableRow key={attempt.id} data-testid={`history-row-${attempt.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[9px] font-medium text-muted-foreground flex-shrink-0">
                            {lead ? lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??"}
                          </div>
                          <span className="text-sm font-medium">{lead?.name || attempt.leadId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: prov?.color || "#888" }} />
                          <span className="text-sm">{attempt.provider}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {attempt.status === "success" && (
                          <Badge variant="secondary" className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Éxito
                          </Badge>
                        )}
                        {attempt.status === "partial" && (
                          <Badge variant="secondary" className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Parcial
                          </Badge>
                        )}
                        {attempt.status === "failed" && (
                          <Badge variant="secondary" className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 gap-1">
                            <XCircle className="w-3 h-3" />
                            Error
                          </Badge>
                        )}
                        {attempt.status === "pending" && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {attempt.confidence > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <Progress value={attempt.confidence * 100} className="h-1 w-12" />
                            <span className="text-xs font-medium">{Math.round(attempt.confidence * 100)}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {attempt.fieldsFound.length > 0 ? (
                            attempt.fieldsFound.map((f) => (
                              <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                {ENRICHMENT_FIELD_LABELS[f] || f}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">Sin datos</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(attempt.timestamp)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SearchTab() {
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
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [filterSize, setFilterSize] = useState<string>("all");
  const [filterTitle, setFilterTitle] = useState<string>("all");

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const executeSearch = useCallback(async (query: string) => {
    setIsSearching(true);
    setSelectedPeople(new Set());

    try {
      const filters: Record<string, string[]> = {};
      if (filterCountry !== "all") filters.organization_locations = [filterCountry];
      if (filterIndustry !== "all") filters.organization_industries = [filterIndustry];
      if (filterSize !== "all") filters.organization_num_employees_ranges = [filterSize];
      if (filterTitle !== "all") filters.person_titles = [filterTitle];

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
  }, [filterCountry, filterIndustry, filterSize, filterTitle, toast]);

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
    setFilterIndustry("all");
    setFilterSize("all");
    setFilterTitle("all");
  };

  const hasActiveFilters =
    filterCountry !== "all" || filterIndustry !== "all" || filterSize !== "all" || filterTitle !== "all";

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
    if (filterIndustry !== "all" && p.organization?.industry !== filterIndustry) return false;
    if (filterSize !== "all") {
      const emp = p.organization?.estimated_num_employees || 0;
      const [min, max] = filterSize.split(",").map(Number);
      if (emp < min || emp > max) return false;
    }
    if (filterTitle !== "all" && !p.title?.toLowerCase().includes(filterTitle.toLowerCase())) return false;
    return true;
  });

  const uniqueCountries = Array.from(new Set(results.map((p) => p.organization?.country || p.country).filter(Boolean)));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-0">
        <div className="rounded-md p-[2px] bg-gradient-to-r from-primary via-violet-500 to-primary">
          <Card className="border-0">
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
                    {[filterCountry, filterIndustry, filterSize, filterTitle].filter((f) => f !== "all").length}
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

            {dataSource && (
              <div className="mt-2">
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
              </div>
            )}
            </CardContent>
          </Card>
        </div>
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
                <SelectTrigger data-testid="select-filter-country"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {uniqueCountries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Industria</label>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger data-testid="select-filter-industry"><SelectValue placeholder="Todas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Array.from(new Set(results.map((p) => p.organization?.industry).filter(Boolean))).map((ind) => (
                    <SelectItem key={ind} value={ind!}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tamaño empresa</label>
              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger data-testid="select-filter-size"><SelectValue placeholder="Todos" /></SelectTrigger>
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
              <label className="text-xs font-medium text-muted-foreground">Cargo</label>
              <Select value={filterTitle} onValueChange={setFilterTitle}>
                <SelectTrigger data-testid="select-filter-title"><SelectValue placeholder="Todos" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="ceo">CEO</SelectItem>
                  <SelectItem value="cmo">CMO</SelectItem>
                  <SelectItem value="revenue">Revenue Manager</SelectItem>
                  <SelectItem value="ventas">Ventas</SelectItem>
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
                        <th className="text-left p-3 font-medium text-muted-foreground">Score</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
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
                                  <span className="text-[10px] text-muted-foreground">{person.organization.industry}</span>
                                )}
                                {person.organization?.estimated_num_employees && (
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                    <Users className="w-2.5 h-2.5" />
                                    {person.organization.estimated_num_employees}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {person.email ? (
                              <div className="flex flex-col gap-1">
                                <span className="text-sm" data-testid={`text-email-${person.id}`}>{person.email}</span>
                                <EmailStatusBadge status={person.email_status} />
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">No disponible</span>
                            )}
                          </td>
                          <td className="p-3">
                            {person.phone ? (
                              <span className="text-sm" data-testid={`text-phone-${person.id}`}>{person.phone}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5" data-testid={`score-${person.id}`}>
                              <Progress value={Math.min(100, Math.max(0, (person.organization?.estimated_num_employees || 50) / 3))} className="h-1.5 w-16" />
                              <span className="text-xs font-medium text-muted-foreground">{Math.min(100, Math.max(10, Math.round((person.organization?.estimated_num_employees || 50) / 3)))}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs"
                                data-testid={`button-enrich-${person.id}`}
                                onClick={(e) => { e.stopPropagation(); toast({ title: "Enriqueciendo", description: `${person.name} añadido a cola` }); }}
                              >
                                <Zap className="w-3.5 h-3.5 mr-1" />
                                Enriquecer
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs"
                                data-testid={`button-add-to-list-${person.id}`}
                                onClick={(e) => { e.stopPropagation(); togglePerson(person.id); setSaveDialogOpen(true); setListName("Nueva lista"); }}
                              >
                                <ListPlus className="w-3.5 h-3.5 mr-1" />
                                A Lista
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
            <DialogTitle>Guardar en nueva lista</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Nombre de la lista</label>
            <Input
              data-testid="input-list-name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Nombre de la lista"
              onKeyDown={(e) => e.key === "Enter" && handleSaveToList()}
            />
            <p className="text-xs text-muted-foreground mt-2">
              {selectedContacts.length} contactos seleccionados
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)} data-testid="button-cancel-save">
              Cancelar
            </Button>
            <Button
              onClick={handleSaveToList}
              disabled={!listName.trim() || isSaving}
              data-testid="button-confirm-save"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Guardar lista
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function FindEnrich() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("enrichment");

  const processingCount = enrichmentQueue.filter((q) => q.status === "processing" || q.status === "queued").length;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-page-title">Buscar y Enriquecer</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "search"
                ? "Encuentra prospectos en LinkedIn y fuentes B2B con Apollo.io"
                : "Seguimiento del enriquecimiento de datos de tus contactos"
              }
            </p>
          </div>
        </div>

        <div className="flex gap-1 border-b" data-testid="tabs-find-enrich">
          <button
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "search"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("search")}
            data-testid="tab-search"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar prospectos
            </div>
          </button>
          <button
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "enrichment"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("enrichment")}
            data-testid="tab-enrichment"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Enriquecimiento
              {processingCount > 0 && (
                <Badge variant="default" className="text-[10px] h-5 px-1.5">
                  {processingCount}
                </Badge>
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "search" ? <SearchTab /> : <EnrichmentDashboard />}
      </div>
    </div>
  );
}
