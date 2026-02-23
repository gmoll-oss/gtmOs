import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  Users,
  Send,
  Mail,
  MessageSquare,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import { leads, campaigns, LEAD_STATUS_CONFIG } from "@/lib/mockData";

const kpiData = [
  {
    title: "Total Contactos",
    value: leads.length.toString(),
    change: "+12%",
    trend: "up" as const,
    icon: Users,
    description: "vs. mes anterior",
  },
  {
    title: "Emails Enviados",
    value: (campaigns.reduce((acc, c) => acc + c.totalSent, 0)).toString(),
    change: "+8%",
    trend: "up" as const,
    icon: Send,
    description: "vs. mes anterior",
  },
  {
    title: "Tasa de Apertura",
    value: (() => {
      const sent = campaigns.reduce((a, c) => a + c.totalSent, 0);
      const opened = campaigns.reduce((a, c) => a + c.totalOpened, 0);
      return sent > 0 ? `${Math.round((opened / sent) * 100)}%` : "0%";
    })(),
    change: "+3%",
    trend: "up" as const,
    icon: Mail,
    description: "vs. mes anterior",
  },
  {
    title: "Tasa de Respuesta",
    value: (() => {
      const sent = campaigns.reduce((a, c) => a + c.totalSent, 0);
      const replied = campaigns.reduce((a, c) => a + c.totalReplied, 0);
      return sent > 0 ? `${Math.round((replied / sent) * 100)}%` : "0%";
    })(),
    change: "+2%",
    trend: "up" as const,
    icon: MessageSquare,
    description: "vs. mes anterior",
  },
  {
    title: "Reuniones Agendadas",
    value: "5",
    change: "+25%",
    trend: "up" as const,
    icon: CalendarCheck,
    description: "vs. mes anterior",
  },
  {
    title: "Pipeline Value",
    value: "$48.5K",
    change: "+18%",
    trend: "up" as const,
    icon: DollarSign,
    description: "vs. mes anterior",
  },
];

const funnelStages = [
  { name: "Descubiertos", count: leads.filter(l => l.status === "discovered").length + leads.filter(l => l.status === "qualified").length + leads.filter(l => l.status === "enriched").length + leads.filter(l => l.status === "eligible").length + leads.filter(l => l.status === "in_sequence").length + leads.filter(l => l.status === "engaged").length + leads.filter(l => l.status === "ready_to_sync").length + leads.filter(l => l.status === "synced").length, color: "bg-slate-500" },
  { name: "Enriquecidos", count: leads.filter(l => ["enriched", "eligible", "in_sequence", "engaged", "ready_to_sync", "synced"].includes(l.status)).length, color: "bg-violet-500" },
  { name: "En Campaña", count: leads.filter(l => ["in_sequence", "engaged", "ready_to_sync", "synced"].includes(l.status)).length, color: "bg-teal-500" },
  { name: "Contactados", count: leads.filter(l => ["engaged", "ready_to_sync", "synced"].includes(l.status)).length, color: "bg-amber-500" },
  { name: "Sincronizados", count: leads.filter(l => l.status === "synced").length, color: "bg-green-500" },
];

const activityOverTime = [
  { week: "Sem 1", discoveries: 28, enrichments: 18, emails: 35, replies: 6 },
  { week: "Sem 2", discoveries: 42, enrichments: 30, emails: 52, replies: 10 },
  { week: "Sem 3", discoveries: 35, enrichments: 25, emails: 48, replies: 12 },
  { week: "Sem 4", discoveries: 50, enrichments: 32, emails: 69, replies: 14 },
  { week: "Sem 5", discoveries: 45, enrichments: 28, emails: 55, replies: 11 },
  { week: "Sem 6", discoveries: 73, enrichments: 38, emails: 76, replies: 19 },
];

const maxActivity = Math.max(...activityOverTime.flatMap(w => [w.discoveries, w.enrichments, w.emails, w.replies]));

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const campaignPerformance = campaigns.filter(c => c.status !== "draft").map(c => {
    const openRate = c.totalSent > 0 ? Math.round((c.totalOpened / c.totalSent) * 100) : 0;
    const replyRate = c.totalSent > 0 ? Math.round((c.totalReplied / c.totalSent) * 100) : 0;
    return { ...c, openRate, replyRate };
  });

  const maxSent = Math.max(...campaignPerformance.map(c => c.totalSent), 1);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap p-4 pb-0">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-analytics-title">Analíticas</h1>
          <p className="text-sm text-muted-foreground">Métricas de rendimiento de campañas y pipeline</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]" data-testid="select-time-range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
            <SelectItem value="all">Todo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiData.map((kpi) => (
            <Card key={kpi.title} data-testid={`card-kpi-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <kpi.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Badge variant="secondary" className="text-xs">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-600 dark:text-red-400" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold" data-testid={`text-kpi-value-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {kpi.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-campaign-performance">
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-base">Rendimiento por Campaña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaignPerformance.map((campaign) => (
                <div key={campaign.id} className="space-y-2" data-testid={`campaign-perf-${campaign.id}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-medium truncate">{campaign.name}</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{campaign.totalSent} enviados</Badge>
                      <Badge variant="secondary" className="text-xs">{campaign.openRate}% apertura</Badge>
                      <Badge variant="secondary" className="text-xs">{campaign.replyRate}% respuesta</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1 h-6">
                    <div
                      className="bg-primary/20 rounded-md flex items-center justify-center text-xs"
                      style={{ width: `${(campaign.totalSent / maxSent) * 100}%`, minWidth: "2rem" }}
                      title={`${campaign.totalSent} enviados`}
                    >
                      <span className="text-muted-foreground">{campaign.totalSent}</span>
                    </div>
                    <div
                      className="bg-primary/40 rounded-md flex items-center justify-center text-xs"
                      style={{ width: `${(campaign.totalOpened / maxSent) * 100}%`, minWidth: "2rem" }}
                      title={`${campaign.totalOpened} abiertos`}
                    >
                      <span className="text-muted-foreground">{campaign.totalOpened}</span>
                    </div>
                    <div
                      className="bg-primary rounded-md flex items-center justify-center text-xs"
                      style={{ width: `${Math.max((campaign.totalReplied / maxSent) * 100, 5)}%`, minWidth: "2rem" }}
                      title={`${campaign.totalReplied} respuestas`}
                    >
                      <span className="text-primary-foreground">{campaign.totalReplied}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground">
                    <span>Enviados: {campaign.totalSent}</span>
                    <span>Abiertos: {campaign.totalOpened}</span>
                    <span>Respuestas: {campaign.totalReplied}</span>
                    <span>Rebotes: {campaign.totalBounced}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card data-testid="card-pipeline-funnel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pipeline Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {funnelStages.map((stage, index) => {
                const maxCount = funnelStages[0].count;
                const pct = maxCount > 0 ? Math.round((stage.count / maxCount) * 100) : 0;
                return (
                  <div key={stage.name} data-testid={`funnel-stage-${stage.name.toLowerCase()}`}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {index > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                        <span className="text-sm font-medium">{stage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{stage.count}</span>
                        <span className="text-xs text-muted-foreground">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-4 bg-muted rounded-md overflow-hidden">
                      <div
                        className={`h-full ${stage.color} rounded-md transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Conversión total</span>
                  <span className="font-bold">
                    {funnelStages[0].count > 0
                      ? `${Math.round((funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card data-testid="card-activity-over-time">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Actividad por Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex items-center gap-4 flex-wrap text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-slate-400 dark:bg-slate-500" />
                    <span>Descubrimientos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-violet-400 dark:bg-violet-500" />
                    <span>Enriquecimientos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-primary" />
                    <span>Emails</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                    <span>Respuestas</span>
                  </div>
                </div>
                {activityOverTime.map((week) => (
                  <div key={week.week} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12 shrink-0">{week.week}</span>
                    <div className="flex-1 flex gap-0.5">
                      <div
                        className="h-5 bg-slate-400 dark:bg-slate-500 rounded-sm"
                        style={{ width: `${(week.discoveries / maxActivity) * 100}%` }}
                        title={`${week.discoveries} descubrimientos`}
                      />
                      <div
                        className="h-5 bg-violet-400 dark:bg-violet-500 rounded-sm"
                        style={{ width: `${(week.enrichments / maxActivity) * 100}%` }}
                        title={`${week.enrichments} enriquecimientos`}
                      />
                      <div
                        className="h-5 bg-primary rounded-sm"
                        style={{ width: `${(week.emails / maxActivity) * 100}%` }}
                        title={`${week.emails} emails`}
                      />
                      <div
                        className="h-5 bg-green-500 rounded-sm"
                        style={{ width: `${(week.replies / maxActivity) * 100}%` }}
                        title={`${week.replies} respuestas`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-top-campaigns">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top Campañas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <span className="col-span-2">Campaña</span>
                  <span className="text-right">Inscritos</span>
                  <span className="text-right">Enviados</span>
                  <span className="text-right">Apertura</span>
                  <span className="text-right">Respuesta</span>
                </div>
                {campaignPerformance
                  .sort((a, b) => b.replyRate - a.replyRate)
                  .map((campaign) => (
                    <div
                      key={campaign.id}
                      className="grid grid-cols-6 gap-2 py-2 border-b last:border-b-0 items-center"
                      data-testid={`row-campaign-${campaign.id}`}
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{campaign.name}</span>
                        <Badge
                          variant={campaign.status === "active" ? "default" : "secondary"}
                          className="text-xs shrink-0"
                        >
                          {campaign.status === "active" ? "Activa" : campaign.status === "paused" ? "Pausada" : campaign.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-right">{campaign.enrolledCount}</span>
                      <span className="text-sm text-right">{campaign.totalSent}</span>
                      <span className="text-sm text-right font-medium">{campaign.openRate}%</span>
                      <span className="text-sm text-right font-medium">{campaign.replyRate}%</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Card data-testid="card-status-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribución de Estados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(LEAD_STATUS_CONFIG)
                .filter(([status]) => status !== "archived")
                .map(([status, config]) => {
                  const count = leads.filter(l => l.status === status).length;
                  const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                  return (
                    <div key={status} className="flex items-center gap-2" data-testid={`status-row-${status}`}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                      <span className="text-xs flex-1 truncate">{config.label}</span>
                      <span className="text-xs font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
            </CardContent>
          </Card>

          <Card data-testid="card-geo-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Por País</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(() => {
                const byCountry: Record<string, number> = {};
                leads.forEach(l => { byCountry[l.country] = (byCountry[l.country] || 0) + 1; });
                return Object.entries(byCountry)
                  .sort(([, a], [, b]) => b - a)
                  .map(([country, count]) => {
                    const pct = Math.round((count / leads.length) * 100);
                    return (
                      <div key={country} className="space-y-1" data-testid={`geo-row-${country.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs">{country}</span>
                          <span className="text-xs font-medium">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  });
              })()}
            </CardContent>
          </Card>

          <Card data-testid="card-industry-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Por Industria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(() => {
                const byIndustry: Record<string, number> = {};
                leads.forEach(l => { byIndustry[l.industry] = (byIndustry[l.industry] || 0) + 1; });
                return Object.entries(byIndustry)
                  .sort(([, a], [, b]) => b - a)
                  .map(([industry, count]) => {
                    const pct = Math.round((count / leads.length) * 100);
                    return (
                      <div key={industry} className="space-y-1" data-testid={`industry-row-${industry.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs">{industry}</span>
                          <span className="text-xs font-medium">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  });
              })()}
            </CardContent>
          </Card>

          <Card data-testid="card-score-distribution">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Distribución de Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(() => {
                const ranges = [
                  { label: "90-100", min: 90, max: 100, color: "bg-green-500" },
                  { label: "70-89", min: 70, max: 89, color: "bg-teal-500" },
                  { label: "50-69", min: 50, max: 69, color: "bg-amber-500" },
                  { label: "0-49", min: 0, max: 49, color: "bg-red-500" },
                ];
                return ranges.map(range => {
                  const count = leads.filter(l => l.score >= range.min && l.score <= range.max).length;
                  const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                  return (
                    <div key={range.label} className="space-y-1" data-testid={`score-row-${range.label}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${range.color}`} />
                          <span className="text-xs">{range.label}</span>
                        </div>
                        <span className="text-xs font-medium">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${range.color}/60 rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
