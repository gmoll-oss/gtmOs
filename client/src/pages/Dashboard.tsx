import { Users, Zap, Shield, RefreshCw, Mail, Search, TrendingUp, Clock, CheckCircle2, XCircle, ArrowRight, Play, Pause, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { leads, searchJobs, sequences, eventLogs, LEAD_STATUS_CONFIG, type LeadStatus } from "@/lib/mockData";

const PIPELINE_ORDER: LeadStatus[] = [
  "discovered", "qualified", "enriched", "eligible",
  "in_sequence", "engaged", "ready_to_sync", "synced",
];

function getStatusCounts() {
  const counts: Record<LeadStatus, number> = {
    discovered: 0, qualified: 0, enriched: 0, eligible: 0,
    in_sequence: 0, engaged: 0, ready_to_sync: 0, synced: 0,
    excluded: 0, archived: 0,
  };
  leads.forEach((l) => { counts[l.status]++; });
  return counts;
}

function eventTypeIcon(type: string) {
  const cls = "w-4 h-4";
  switch (type) {
    case "discovered": return <Search className={`${cls} text-slate-500 dark:text-slate-400`} />;
    case "qualified": return <CheckCircle2 className={`${cls} text-blue-500 dark:text-blue-400`} />;
    case "enriched": return <Zap className={`${cls} text-violet-500 dark:text-violet-400`} />;
    case "excluded":
    case "exclusion_check": return <XCircle className={`${cls} text-red-500 dark:text-red-400`} />;
    case "enrolled": return <Mail className={`${cls} text-teal-500 dark:text-teal-400`} />;
    case "email_sent": return <Mail className={`${cls} text-blue-500 dark:text-blue-400`} />;
    case "email_opened": return <TrendingUp className={`${cls} text-amber-500 dark:text-amber-400`} />;
    case "email_replied": return <ArrowRight className={`${cls} text-emerald-500 dark:text-emerald-400`} />;
    case "email_bounced": return <XCircle className={`${cls} text-red-500 dark:text-red-400`} />;
    case "synced":
    case "ready_to_sync": return <RefreshCw className={`${cls} text-green-500 dark:text-green-400`} />;
    case "score_updated": return <TrendingUp className={`${cls} text-purple-500 dark:text-purple-400`} />;
    default: return <Clock className={`${cls} text-muted-foreground`} />;
  }
}

function eventTypeDotColor(type: string) {
  switch (type) {
    case "discovered": return "bg-slate-400";
    case "qualified": return "bg-blue-400";
    case "enriched": return "bg-violet-400";
    case "excluded":
    case "exclusion_check": return "bg-red-400";
    case "enrolled":
    case "email_sent": return "bg-teal-400";
    case "email_opened": return "bg-amber-400";
    case "email_replied": return "bg-emerald-400";
    case "email_bounced": return "bg-red-400";
    case "synced":
    case "ready_to_sync": return "bg-green-400";
    case "score_updated": return "bg-purple-400";
    default: return "bg-muted-foreground";
  }
}

function formatRelativeTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" }) + " " +
    date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export default function Dashboard() {
  const counts = getStatusCounts();

  const totalLeads = leads.length;
  const enrichedLeads = leads.filter((l) => l.lastEnrichedAt !== null).length;
  const enrichmentRate = totalLeads > 0 ? Math.round((enrichedLeads / totalLeads) * 100) : 0;
  const excludedLeads = leads.filter((l) => l.excluded).length;
  const exclusionRate = totalLeads > 0 ? Math.round((excludedLeads / totalLeads) * 100) : 0;
  const syncedLeads = leads.filter((l) => l.zohoCrmSynced).length;

  const kpis = [
    { label: "Total Leads", value: totalLeads.toString(), icon: Users, sub: "en pipeline" },
    { label: "Tasa Enriquecimiento", value: `${enrichmentRate}%`, icon: Zap, sub: `${enrichedLeads} de ${totalLeads}` },
    { label: "Tasa Exclusión", value: `${exclusionRate}%`, icon: Shield, sub: `${excludedLeads} excluidos` },
    { label: "Leads Sincronizados", value: syncedLeads.toString(), icon: RefreshCw, sub: `de ${totalLeads} totales` },
  ];

  const activeJobs = searchJobs.filter((j) => j.status === "active" || j.status === "paused");

  const recentEvents = [...eventLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  const leadNameMap = new Map(leads.map((l) => [l.id, l.name]));

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-foreground" data-testid="text-page-title">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-page-subtitle">
          Resumen del pipeline de generación de leads
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="kpi-cards">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium tracking-wide" data-testid={`text-kpi-label-${kpi.label.toLowerCase().replace(/\s+/g, "-")}`}>{kpi.label}</p>
                <p className="text-2xl font-semibold text-foreground mt-1" data-testid={`text-kpi-${kpi.label.toLowerCase().replace(/\s+/g, "-")}`}>{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
              </div>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <kpi.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5" data-testid="pipeline-overview">
        <h2 className="text-sm font-semibold text-foreground mb-4">Pipeline</h2>
        <div className="flex items-center gap-1 overflow-x-auto">
          {PIPELINE_ORDER.map((status, i) => {
            const cfg = LEAD_STATUS_CONFIG[status];
            return (
              <div key={status} className="flex items-center gap-1 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-2 rounded-md" data-testid={`pipeline-stage-${status}`}>
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{cfg.label}</span>
                  <span className="text-sm font-semibold text-foreground" data-testid={`text-pipeline-count-${status}`}>{counts[status]}</span>
                </div>
                {i < PIPELINE_ORDER.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                )}
              </div>
            );
          })}
          <div className="flex items-center gap-1 flex-shrink-0 ml-2 pl-2 border-l border-border">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md" data-testid="pipeline-stage-excluded">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: LEAD_STATUS_CONFIG.excluded.color }}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">{LEAD_STATUS_CONFIG.excluded.label}</span>
              <span className="text-sm font-semibold text-foreground" data-testid="text-pipeline-count-excluded">{counts.excluded}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="p-5" data-testid="activity-feed">
            <h2 className="text-sm font-semibold text-foreground mb-4">Actividad Reciente</h2>
            <div className="space-y-0">
              {recentEvents.map((ev, i) => (
                <div
                  key={ev.id}
                  className={`flex items-start gap-3 py-3 ${i < recentEvents.length - 1 ? "border-b border-border" : ""}`}
                  data-testid={`activity-item-${ev.id}`}
                >
                  <div className="flex flex-col items-center mt-1.5">
                    <span className={`w-2 h-2 rounded-full ${eventTypeDotColor(ev.type)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-foreground">
                      <span className="font-medium">{leadNameMap.get(ev.leadId) || ev.leadId}</span>
                      <span className="text-muted-foreground"> — {ev.description}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{formatRelativeTime(ev.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-5" data-testid="active-search-jobs">
            <h2 className="text-sm font-semibold text-foreground mb-4">Jobs de Descubrimiento</h2>
            <table className="w-full text-left" data-testid="search-jobs-table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-[11px] font-medium text-muted-foreground pb-2">Nombre</th>
                  <th className="text-[11px] font-medium text-muted-foreground pb-2 text-right">Desc.</th>
                  <th className="text-[11px] font-medium text-muted-foreground pb-2 text-right">Cual.</th>
                  <th className="text-[11px] font-medium text-muted-foreground pb-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {activeJobs.map((job) => (
                  <tr key={job.id} className="border-b border-border last:border-b-0" data-testid={`search-job-${job.id}`}>
                    <td className="py-2.5 text-[13px] font-medium text-foreground truncate max-w-[120px]">{job.name}</td>
                    <td className="py-2.5 text-[13px] text-muted-foreground text-right">{job.totalDiscovered}</td>
                    <td className="py-2.5 text-[13px] text-muted-foreground text-right">{job.totalQualified}</td>
                    <td className="py-2.5 text-right">
                      <Badge
                        variant={job.status === "active" ? "default" : "secondary"}
                        className="text-[10px] rounded-full"
                        data-testid={`badge-job-status-${job.id}`}
                      >
                        {job.status === "active" ? "Activo" : "Pausado"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="sequence-stats">
        {sequences.map((seq) => (
          <Card key={seq.id} className="p-5" data-testid={`sequence-${seq.id}`}>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[13px] font-medium text-foreground truncate">{seq.name}</span>
              <Badge
                variant={seq.status === "active" ? "default" : "secondary"}
                className="text-[10px] rounded-full flex-shrink-0"
              >
                {seq.status === "active" ? "Activa" : seq.status === "paused" ? "Pausada" : "Borrador"}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <p className="text-lg font-semibold text-foreground">{seq.enrolledCount}</p>
                <p className="text-[11px] text-muted-foreground">Inscritos</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{seq.totalSent}</p>
                <p className="text-[11px] text-muted-foreground">Enviados</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{seq.totalSent > 0 ? Math.round((seq.totalOpened / seq.totalSent) * 100) : 0}%</p>
                <p className="text-[11px] text-muted-foreground">Abiertos</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{seq.totalSent > 0 ? Math.round((seq.totalReplied / seq.totalSent) * 100) : 0}%</p>
                <p className="text-[11px] text-muted-foreground">Respuestas</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
