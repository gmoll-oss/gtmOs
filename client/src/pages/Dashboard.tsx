import { Users, Search, Mail, Settings, TrendingUp, Shield, RefreshCw, Zap, Clock, CheckCircle2, XCircle, ArrowRight, Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { leads, searchJobs, sequences, eventLogs, LEAD_STATUS_CONFIG, type LeadStatus } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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

function StatusIcon({ status }: { status: LeadStatus }) {
  const iconClass = "w-4 h-4";
  switch (status) {
    case "discovered": return <Search className={iconClass} />;
    case "qualified": return <CheckCircle2 className={iconClass} />;
    case "enriched": return <Zap className={iconClass} />;
    case "eligible": return <Shield className={iconClass} />;
    case "in_sequence": return <Mail className={iconClass} />;
    case "engaged": return <TrendingUp className={iconClass} />;
    case "ready_to_sync": return <RefreshCw className={iconClass} />;
    case "synced": return <CheckCircle2 className={iconClass} />;
    case "excluded": return <XCircle className={iconClass} />;
    case "archived": return <Clock className={iconClass} />;
    default: return <Users className={iconClass} />;
  }
}

function eventTypeIcon(type: string) {
  const cls = "w-3.5 h-3.5";
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

function formatRelativeTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" }) + " " +
    date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const counts = getStatusCounts();

  const totalLeads = leads.length;
  const enrichedLeads = leads.filter((l) => l.lastEnrichedAt !== null).length;
  const enrichmentRate = totalLeads > 0 ? Math.round((enrichedLeads / totalLeads) * 100) : 0;
  const excludedLeads = leads.filter((l) => l.excluded).length;
  const exclusionRate = totalLeads > 0 ? Math.round((excludedLeads / totalLeads) * 100) : 0;
  const syncedLeads = leads.filter((l) => l.zohoCrmSynced).length;
  const syncRate = totalLeads > 0 ? Math.round((syncedLeads / totalLeads) * 100) : 0;
  const activeSequences = sequences.filter((s) => s.status === "active").length;

  const kpis = [
    { label: "Total Leads", value: totalLeads.toString(), icon: Users, desc: "en pipeline" },
    { label: "Tasa Enriquecimiento", value: `${enrichmentRate}%`, icon: Zap, desc: `${enrichedLeads} de ${totalLeads}` },
    { label: "Tasa Exclusión", value: `${exclusionRate}%`, icon: Shield, desc: `${excludedLeads} excluidos` },
    { label: "Tasa Sincronización", value: `${syncRate}%`, icon: RefreshCw, desc: `${syncedLeads} sincronizados` },
    { label: "Secuencias Activas", value: activeSequences.toString(), icon: Mail, desc: `de ${sequences.length} totales` },
  ];

  const pipelineData = PIPELINE_ORDER.map((status) => ({
    name: LEAD_STATUS_CONFIG[status].label,
    count: counts[status],
    color: LEAD_STATUS_CONFIG[status].color,
  }));

  const activeJobs = searchJobs.filter((j) => j.status === "active" || j.status === "paused");

  const recentEvents = [...eventLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const leadNameMap = new Map(leads.map((l) => [l.id, l.name]));

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold text-foreground" data-testid="text-page-title">
            Growth Orchestrator
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 capitalize">{today}</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3" data-testid="kpi-cards">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">{kpi.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1" data-testid={`text-kpi-${kpi.label.toLowerCase().replace(/\s+/g, "-")}`}>{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.desc}</p>
              </div>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <kpi.icon className="w-4 h-4 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3" data-testid="pipeline-state-cards">
        {PIPELINE_ORDER.map((status) => {
          const cfg = LEAD_STATUS_CONFIG[status];
          return (
            <Card key={status} className="p-3">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${cfg.bgClass}`}>
                  <StatusIcon status={status} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold text-foreground" data-testid={`text-pipeline-count-${status}`}>{counts[status]}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{cfg.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${LEAD_STATUS_CONFIG.excluded.bgClass}`}>
              <XCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground" data-testid="text-pipeline-count-excluded">{counts.excluded}</p>
              <p className="text-[11px] text-muted-foreground truncate">{LEAD_STATUS_CONFIG.excluded.label}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5" data-testid="pipeline-funnel">
        <h2 className="text-sm font-semibold text-foreground mb-4">Flujo del Pipeline</h2>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData} layout="vertical" margin={{ left: 20, right: 30, top: 5, bottom: 5 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--foreground))",
                  fontSize: 13,
                }}
                formatter={(value: number) => [`${value} leads`, "Cantidad"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                {pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card className="p-5" data-testid="activity-feed">
            <h2 className="text-sm font-semibold text-foreground mb-3">Actividad Reciente</h2>
            <div className="space-y-3">
              {recentEvents.map((ev) => (
                <div key={ev.id} className="flex items-start gap-3" data-testid={`activity-item-${ev.id}`}>
                  <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center flex-shrink-0 mt-0.5">
                    {eventTypeIcon(ev.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/80">
                      <span className="font-medium text-foreground">{leadNameMap.get(ev.leadId) || ev.leadId}</span>
                      {" — "}
                      {ev.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(ev.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5" data-testid="active-search-jobs">
            <h2 className="text-sm font-semibold text-foreground mb-3">Jobs de Descubrimiento</h2>
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <div key={job.id} className="p-3 rounded-md bg-background/60" data-testid={`search-job-${job.id}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground truncate">{job.name}</span>
                    <Badge variant={job.status === "active" ? "default" : "secondary"} className="text-[10px]" data-testid={`badge-job-status-${job.id}`}>
                      {job.status === "active" ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                      {job.status === "active" ? "Activo" : "Pausado"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span>{job.totalDiscovered} descubiertos</span>
                    <span>{job.totalQualified} cualificados</span>
                  </div>
                  {job.lastRunAt && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Última ejecución: {formatRelativeTime(job.lastRunAt)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5" data-testid="sequence-summary">
            <h2 className="text-sm font-semibold text-foreground mb-3">Secuencias</h2>
            <div className="space-y-3">
              {sequences.map((seq) => (
                <div key={seq.id} className="p-3 rounded-md bg-background/60" data-testid={`sequence-${seq.id}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground truncate">{seq.name}</span>
                    <Badge
                      variant={seq.status === "active" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {seq.status === "active" ? "Activa" : seq.status === "paused" ? "Pausada" : "Borrador"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span>{seq.enrolledCount} inscritos</span>
                    <span>{seq.totalSent} enviados</span>
                    <span>{seq.totalReplied} respuestas</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5" data-testid="quick-stats">
            <h2 className="text-sm font-semibold text-foreground mb-3">Resumen General</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-muted-foreground">Score Promedio</span>
                <span className="text-sm font-medium text-foreground">{Math.round(leads.reduce((s, l) => s + l.score, 0) / totalLeads)}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-muted-foreground">ICP Promedio</span>
                <span className="text-sm font-medium text-foreground">{Math.round(leads.reduce((s, l) => s + l.icpScore, 0) / totalLeads)}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-muted-foreground">Confianza Enriq. Prom.</span>
                <span className="text-sm font-medium text-foreground">{Math.round(leads.reduce((s, l) => s + l.enrichmentConfidence, 0) / totalLeads * 100)}%</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-muted-foreground">En Secuencia</span>
                <span className="text-sm font-medium text-foreground">{counts.in_sequence + counts.engaged}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs text-muted-foreground">Listos para Sync</span>
                <span className="text-sm font-medium text-foreground">{counts.ready_to_sync}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
